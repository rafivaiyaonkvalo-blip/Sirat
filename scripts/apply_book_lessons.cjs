// scripts/book_lessons/*.cjs থেকে কিতাবভিত্তিক দারসের কনটেন্ট src/data/lessons.json-এ বসায়।
// ব্যবহার: node scripts/apply_book_lessons.cjs [--check] [lessonId ...]
// --check: শুধু যাচাই, lessons.json লেখা হয় না

const fs = require('fs');
const path = require('path');

const LESSONS_PATH = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
const MODULES_DIR = path.join(__dirname, 'book_lessons');
const STEP_TYPES = new Set([
  'intro', 'mcq', 'match_pairs', 'picture_choice', 'harakat_choice', 'sentence_builder',
  'fill_blank', 'spot_error', 'dialogue_listen', 'roleplay_chat', 'tamrin_challenge',
  'quiz_challenge', 'grammar_card', 'sort_groups'
]);

const guardPictures = require('./lib/picture_guard.cjs');
const CHECK_ONLY = process.argv.includes('--check');
const only = process.argv.slice(2).filter(a => a !== '--check');
const data = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));
const errors = [];

for (const file of fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.cjs')).sort()) {
  const mod = require(path.join(MODULES_DIR, file));
  if (only.length && !only.includes(mod.id)) continue;

  let lesson = data.lessons.find(l => l.id === mod.id);
  if (!lesson) {
    // বইয়ে অ্যাপের বিদ্যমান আইডির চেয়ে বেশি দারস থাকলে নতুন পাঠ খোলা হয় (একই অধ্যায়ের শেষ পাঠ থেকে মেটা ক্লোন)
    const m = /^(vol(\d+)-ch(\d+))-l(\d+)$/.exec(mod.id);
    const sameCh = m ? data.lessons.filter(l => l.chapterId === m[1]) : [];
    const level = m && (data.levels || []).find(lvl => String(lvl.id) === m[2]);
    if (!sameCh.length) {
      // নতুন অধ্যায়: মডিউলের `chapter` মেটা দিয়ে অধ্যায় খোলা হয়, একই খণ্ডের শেষ পাঠ থেকে মেটা ক্লোন
      const sameVol = m ? data.lessons.filter(l => l.chapterId && l.chapterId.startsWith(`vol${m[2]}-`)) : [];
      // --check-এ একটি মডিউল একা যাচাই করা যায় (অধ্যায়ের আগের পাঠ বা `chapter` মেটা ছাড়াই)
      if (!sameVol.length || !level || (!CHECK_ONLY && (!mod.chapter || m[4] !== '1'))) {
        errors.push(`${file}: lesson ${mod.id} not found (a new chapter needs l1 and a \`chapter\` export)`);
        continue;
      }
      const last = sameVol[sameVol.length - 1];
      lesson = JSON.parse(JSON.stringify(last));
      lesson.chapterId = m[1];
      lesson.chapterNumber = Number(m[3]);
      lesson.chapterTitle = mod.chapter ? mod.chapter.title : '';
      data.lessons.splice(data.lessons.indexOf(last) + 1, 0, lesson);
      level.chapters.push({ id: m[1], number: Number(m[3]), ...(mod.chapter || {}), lessonCount: 0 });
      console.log('created chapter ' + m[1]);
    } else {
      const last = sameCh[sameCh.length - 1];
      lesson = JSON.parse(JSON.stringify(last));
      data.lessons.splice(data.lessons.indexOf(last) + 1, 0, lesson);
    }
    lesson.id = mod.id;
    lesson.lessonNumber = sameCh.length + 1;
    lesson.lessonNumberInChapter = sameCh.length + 1;
    for (const ch of (level && level.chapters) || []) if (ch.id === m[1]) ch.lessonCount = sameCh.length + 1;
    if (level) level.totalLessons = data.lessons.filter(l => l.chapterId && l.chapterId.startsWith(`vol${m[2]}-`)).length;
    console.log('created lesson ' + mod.id);
  }

  // ২য়-৩য় অধ্যায়ের ছবি-মিল যাচাই (অমিল ছবি বাদ)
  if (/^vol1-ch[23]-/.test(mod.id)) guardPictures(mod.fields);

  const stageIds = new Set();
  mod.fields.bookStages.forEach(stage => {
    if (stageIds.has(stage.id)) errors.push(`${mod.id}: duplicate stage id ${stage.id}`);
    stageIds.add(stage.id);
    if (stage.steps.length < 6 || stage.steps.length > 24) {
      errors.push(`${mod.id}/${stage.id}: ${stage.steps.length} steps (expected 6–24)`);
    }
    stage.steps.forEach((step, i) => {
      const where = `${mod.id}/${stage.id}#${i + 1}`;
      if (!STEP_TYPES.has(step.type)) errors.push(`${where}: unknown type ${step.type}`);
      if (Array.isArray(step.options)) {
        const correct = step.options.filter(o => o.isCorrect).length;
        if (correct !== 1) errors.push(`${where}: ${correct} correct options`);
        const texts = step.options.map(o => o.text);
        if (new Set(texts).size !== texts.length) errors.push(`${where}: duplicate option text`);
      }
      if (step.type === 'sentence_builder' && step.distractors.some(d => step.targetTokens.includes(d))) {
        errors.push(`${where}: distractor equals a target token`);
      }
      if (step.type === 'sort_groups') {
        const groupIds = step.groups.map(g => g.id);
        step.items.forEach(it => {
          if (!groupIds.includes(it.group)) errors.push(`${where}: item ${it.arabic} has unknown group`);
        });
      }
    });
  });

  Object.assign(lesson, mod.fields, { legacyStageCount: mod.legacyStageCount });
  const stepCount = mod.fields.bookStages.reduce((n, s) => n + s.steps.length, 0);
  console.log(`${mod.id}: ${mod.fields.bookStages.length} stages, ${stepCount} steps`);
}

if (errors.length) {
  console.error('Validation failed:\n' + errors.join('\n'));
  process.exit(1);
}

if (CHECK_ONLY) {
  console.log('check passed (lessons.json not written)');
} else {
  fs.writeFileSync(LESSONS_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log('lessons.json updated');
}
