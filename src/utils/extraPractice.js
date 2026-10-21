/**
 * দারসের প্রতিটি পর্বের শেষে অতিরিক্ত অনুশীলন
 *
 * পর্বের নিজের শব্দ ও বাক্য (ডেটায় লেখা ধাপ থেকে) নিয়ে নতুন ধরনের প্রশ্ন তৈরি হয়:
 * বাংলা দেখে আরবি শব্দ বাছাই, শব্দজোড় মেলানো, আরবি বাক্যের অর্থ, বাক্য সাজানো ও শূন্যস্থান পূরণ।
 * ভুল অপশন আসে একই দারসের শব্দ/বাক্য থেকে; সঠিক উত্তরের সমার্থক বা একই লেখা অপশন বাদ দেওয়া হয়।
 * নতুন পর্ব যোগ হয় না, তাই আগের অগ্রগতি (সম্পন্ন পর্ব) অপরিবর্তিত থাকে।
 */
import vocabularyData from '../data/vocabulary.json';
import lessonsData from '../data/lessons.json';
import { isLessonHydrated } from '../data/lessonSteps.js';

import { shuffle } from './shuffle';
import { optionsConflict } from './quizOptions';
const AR = /[؀-ۿ]/;
const HARAKAT = /[ً-ْٰ]/g;
const PUNCT_ONLY = /^[\s.,،؛؟!?:;\-—()«»"']+$/;
const EXTRA = 'অতিরিক্ত অনুশীলন';

const clean = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const bare = (t) => clean(t).replace(HARAKAT, '').replace(/[.,،؛؟!?:;]/g, '');
const words = (t) => clean(t).split(' ').filter((w) => AR.test(w));
const isSentence = (t) => /[؟?.!]/.test(t) || words(t).length >= 3;

// পর্বের ধাপ থেকে শব্দ (১-২ শব্দের) ও বাক্য সংগ্রহ
export function collectStageContent(stage) {
  const wordMap = new Map();
  const sentMap = new Map();
  const addWord = (arabic, bangla) => {
    const ar = clean(arabic);
    const bn = clean(bangla);
    if (!ar || !bn || !AR.test(ar) || AR.test(bn)) return;
    if (isSentence(ar)) return addSent(ar, bn);
    if (!wordMap.has(bare(ar))) wordMap.set(bare(ar), { arabic: ar, bangla: bn });
  };
  const addSent = (arabic, bangla) => {
    const ar = clean(arabic);
    const bn = clean(bangla);
    if (!ar || !bn || !AR.test(ar) || AR.test(bn) || ar.includes('___')) return;
    if (words(ar).length < 2) return;
    if (!sentMap.has(bare(ar))) sentMap.set(bare(ar), { arabic: ar, bangla: bn });
  };

  (stage?.steps || []).forEach((s) => {
    if ((s.type === 'intro' || s.type === 'mcq') && s.word) addWord(s.word.arabic, s.word.bangla);
    if (s.type === 'match_pairs') (s.pairs || []).forEach((p) => addWord(p.arabic, p.bangla));
    if (s.type === 'picture_choice') (s.options || []).forEach((o) => addWord(o.text, o.bangla));
    if (s.type === 'sentence_builder') addSent(s.targetArabic || s.targetSentence || (s.targetTokens || []).join(' '), s.targetBangla || s.targetTranslation);
    if (s.type === 'fill_blank') {
      const full = s.fullArabic || (typeof s.sentence === 'string' && s.correctAnswer ? s.sentence.replace('___', s.correctAnswer) : '');
      addSent(full, s.targetBangla || s.hint);
    }
    if (s.type === 'dialogue_listen') {
      addSent(s.questionArabic, s.questionBangla);
      const right = (s.options || []).find((o) => o.isCorrect);
      if (right) addSent(right.text, right.bangla);
    }
    if (s.type === 'spot_error') {
      const right = (s.options || []).find((o) => o.isCorrect);
      if (right) addSent(right.text, s.targetBangla);
    }
  });
  return { words: [...wordMap.values()], sentences: [...sentMap.values()] };
}

// দারসের সব পর্বের শব্দ/বাক্য (ভুল অপশনের উৎস)
const lessonPoolCache = new Map();
function lessonPool(lesson) {
  if (lessonPoolCache.has(lesson.id)) return lessonPoolCache.get(lesson.id);
  const all = { words: [], sentences: [] };
  (lesson.bookStages || []).forEach((st) => {
    const c = collectStageContent(st);
    all.words.push(...c.words);
    all.sentences.push(...c.sentences);
  });
  // কম শব্দ থাকলে একই খণ্ডের শব্দভাণ্ডার থেকে নেওয়া হয়
  const volumeWords = vocabularyData
    .filter((w) => w.volumeId === lesson.volumeId && w.type === 'word' && w.arabic && w.bengali)
    .map((w) => ({ arabic: clean(w.arabic), bangla: clean(w.bengali) }))
    .filter((w) => !isSentence(w.arabic));
  const pool = { ...all, volumeWords };
  // ধাপের লেখা লোড না হলে ক্যাশ করা হয় না (পরে লোড হলে যেন সঠিক পুল তৈরি হয়)
  if (isLessonHydrated(lesson)) lessonPoolCache.set(lesson.id, pool);
  return pool;
}

// অপশনের আকার (শব্দসংখ্যা ও '-' / '/' যুক্ত জোড়রূপ) — আকার দেখে যেন উত্তর বোঝা না যায়
const shapeOf = (t) => `${Math.min(words(t).length, 4)}${/\s[-/]\s|[-/]/.test(t) ? 'd' : ''}`;

// সঠিক উত্তরের সাথে মিলে যায় না এমন n-টি আলাদা অপশন; আগে একই আকারের, তারপর অন্যগুলো
function pickDistractors(target, sources, n, key) {
  const out = [];
  const seenAr = new Set([bare(target.arabic)]);
  const seenBn = new Set([clean(target.bangla)]);
  const shape = shapeOf(target.arabic);
  const all = sources.flatMap((src) => shuffle(src));
  const ordered = key === 'arabic'
    ? [...all.filter((c) => shapeOf(c.arabic) === shape), ...all.filter((c) => shapeOf(c.arabic) !== shape)]
    : all;
  for (const src of [ordered]) {
    for (const c of src) {
      if (out.length >= n) return out;
      const ar = bare(c.arabic);
      const bn = clean(c.bangla);
      if (seenAr.has(ar) || seenBn.has(bn)) continue;
      // বাংলা অর্থে সঠিক উত্তর পুরোটা থাকলে (যেমন "বই" ও "একটি বই") অস্পষ্ট হয়, তাই বাদ
      if (key === 'bangla' && (bn.includes(clean(target.bangla)) || clean(target.bangla).includes(bn))) continue;
      // অনুশীলন/পরীক্ষার মতো একই নিয়ম: একই অর্থ ("একটি কলম" / "কলমটি") বা 'ال' বাদে একই শব্দ বাদ
      const asItem = (x) => ({ arabic: x.arabic, bengali: x.bangla });
      if ([target, ...out].some((x) => optionsConflict(asItem(x), asItem(c)))) continue;
      seenAr.add(ar);
      seenBn.add(bn);
      out.push(c);
    }
  }
  return out;
}

// আরবি বাক্যকে টোকেনে ভাগ (আলাদা যতিচিহ্ন আগের শব্দের সাথে যুক্ত থাকে)
function tokenize(arabic) {
  const raw = clean(arabic).split(' ');
  const tokens = [];
  raw.forEach((t) => {
    if (PUNCT_ONLY.test(t) && tokens.length) tokens[tokens.length - 1] += ` ${t}`;
    else tokens.push(t);
  });
  return tokens;
}

export function buildExtraPracticeSteps(lesson, stage) {
  if (!lesson || !stage) return [];
  const { words: stageWords, sentences: stageSents } = collectStageContent(stage);
  const pool = lessonPool(lesson);
  const steps = [];

  // ১. বাংলা দেখে আরবি শব্দ বাছাই
  shuffle(stageWords).slice(0, 6).forEach((w) => {
    const ds = pickDistractors(w, [pool.words, pool.volumeWords], 3, 'arabic');
    if (ds.length < 2) return;
    steps.push({
      type: 'quiz_challenge',
      title: `${EXTRA} • আরবি শব্দ বাছাই`,
      question: `"${w.bangla}" — এর আরবি কোনটি?`,
      explanation: `${w.arabic} = ${w.bangla}`,
      options: [{ text: w.arabic, isCorrect: true }, ...ds.map((d) => ({ text: d.arabic, isCorrect: false }))]
    });
  });

  // ২. শব্দজোড় মেলানো (অর্থ আলাদা এমন ৩-৫টি শব্দ)
  if (stageWords.length >= 3) {
    const picked = [];
    const seenBn = new Set();
    shuffle(stageWords).forEach((w) => {
      if (picked.length < 5 && !seenBn.has(w.bangla)) {
        seenBn.add(w.bangla);
        picked.push(w);
      }
    });
    if (picked.length >= 3) {
      steps.push({ type: 'match_pairs', title: `${EXTRA} • শব্দজোড় মেলান`, pairs: picked });
    }
  }

  // ৩. আরবি বাক্যের সঠিক অর্থ
  const sents = shuffle(stageSents);
  sents.slice(0, 3).forEach((s) => {
    const ds = pickDistractors(s, [pool.sentences], 3, 'bangla');
    if (ds.length < 2) return;
    steps.push({
      type: 'quiz_challenge',
      title: `${EXTRA} • বাক্যের অর্থ`,
      question: `এই বাক্যের অর্থ কী? ${s.arabic}`,
      explanation: `${s.arabic} = ${s.bangla}`,
      options: [{ text: s.bangla, isCorrect: true }, ...ds.map((d) => ({ text: d.bangla, isCorrect: false }))]
    });
  });

  // ৪. বাংলা দেখে আরবি বাক্য সাজানো
  sents.filter((s) => {
    const n = tokenize(s.arabic).length;
    return n >= 2 && n <= 7;
  }).slice(0, 2).forEach((s) => {
    const targetTokens = tokenize(s.arabic);
    const taken = new Set(targetTokens.map(bare));
    const distractors = shuffle([...pool.sentences.flatMap((x) => tokenize(x.arabic)), ...pool.words.map((w) => w.arabic)])
      .filter((t) => {
        const b = bare(t);
        if (!b || taken.has(b) || words(t).length !== 1) return false;
        taken.add(b);
        return true;
      })
      .slice(0, 2);
    steps.push({
      type: 'sentence_builder',
      title: `${EXTRA} • বাক্য সাজান`,
      targetArabic: s.arabic,
      targetBangla: s.bangla,
      targetTokens,
      distractors
    });
  });

  // ৫. শূন্যস্থান পূরণ: বাক্যের একটি শব্দ (যা দারসের শব্দতালিকায় আছে) খালি রেখে
  const lessonWordSet = new Map(pool.words.map((w) => [bare(w.arabic), w.arabic]));
  let blanks = 0;
  for (const s of sents) {
    if (blanks >= 2) break;
    const tokens = tokenize(s.arabic);
    if (tokens.length < 2) continue;
    const idx = tokens.findIndex((t) => lessonWordSet.has(bare(t)));
    if (idx < 0) continue;
    // শব্দের সাথে লেগে থাকা যতিচিহ্ন অপশনে রাখা হয় না, পরের অংশে যায়
    const m = tokens[idx].match(/^(.*?)(\s*[.,،؛؟!?:;]+)$/);
    const missing = m ? m[1] : tokens[idx];
    const trailing = m ? [m[2].trim()] : [];
    const others = shuffle(pool.words)
      .map((w) => w.arabic)
      .filter((a) => words(a).length === 1 && bare(a) !== bare(missing) && !tokens.some((t) => bare(t) === bare(a)));
    const uniq = [...new Map(others.map((a) => [bare(a), a])).values()].slice(0, 2);
    if (uniq.length < 2) continue;
    steps.push({
      type: 'fill_blank',
      title: `${EXTRA} • শূন্যস্থান পূরণ করুন`,
      targetBangla: s.bangla,
      fullArabic: s.arabic,
      tokensBefore: tokens.slice(0, idx),
      missingToken: missing,
      tokensAfter: [...trailing, ...tokens.slice(idx + 1)],
      options: [{ text: missing, isCorrect: true }, ...uniq.map((a) => ({ text: a, isCorrect: false }))]
    });
    blanks++;
  }

  return steps;
}

// ---------------------------------------------------------------
// আগের দারসের পুনরাবৃত্তি: প্রতিটি পর্বে আগের দারসগুলোর শব্দ ও বাক্য ঘুরে ঘুরে আসে।
// বেশিরভাগ প্রশ্ন সাম্প্রতিক ১-৩টি দারস থেকে, একটি পুরোনো যেকোনো দারস থেকে (ভুলে না যেতে)।
// ---------------------------------------------------------------

const REVIEW = 'পুনরাবৃত্তি';
const ORDERED_LESSONS = (lessonsData.lessons || []).filter((l) => (l.bookStages || []).length);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const reviewLabel = (les) => {
  const head = String(les.title || '').split(':')[0].trim();
  return `${['', '১ম', '২য়', '৩য়'][les.volumeId] || ''} খণ্ড • ${head}`;
};

// পুনরাবৃত্তির জন্য যেসব দারসের ধাপ আগে লোড করা দরকার: সাম্প্রতিক ৩টি + পুরোনো থেকে ২টি
export function reviewLessonsFor(lesson) {
  const idx = ORDERED_LESSONS.findIndex((l) => l.id === lesson?.id);
  if (idx <= 0) return [];
  const recent = ORDERED_LESSONS.slice(Math.max(0, idx - 3), idx);
  const older = ORDERED_LESSONS.slice(0, Math.max(0, idx - 3));
  const extra = older.length ? [pick(older), pick(older)] : [];
  return [...new Set([...recent, ...extra])];
}

export function buildReviewSteps(lesson, stage) {
  const idx = ORDERED_LESSONS.findIndex((l) => l.id === lesson?.id);
  if (idx <= 0 || !stage) return [];
  // ধাপের লেখা লোড হয়েছে এমন দারস থেকেই প্রশ্ন বানানো হয়
  const recent = ORDERED_LESSONS.slice(Math.max(0, idx - 3), idx).filter(isLessonHydrated);
  const older = ORDERED_LESSONS.slice(0, Math.max(0, idx - 3)).filter(isLessonHydrated);
  if (!recent.length && !older.length) return [];
  const steps = [];
  const used = new Set();

  const takeWord = (sourceLessons) => {
    if (!sourceLessons.length) return null;
    for (let tries = 0; tries < 12; tries++) {
      const les = pick(sourceLessons);
      const w = pick(lessonPool(les).words || []);
      if (w && !used.has(bare(w.arabic))) {
        used.add(bare(w.arabic));
        return { les, w };
      }
    }
    return null;
  };

  // ১. বাংলা দেখে আরবি (সাম্প্রতিক দারস)
  const a = takeWord(recent);
  if (a) {
    const pool = lessonPool(a.les);
    const ds = pickDistractors(a.w, [pool.words, pool.volumeWords], 3, 'arabic');
    if (ds.length >= 2) {
      steps.push({
        type: 'quiz_challenge',
        title: `${REVIEW} • ${reviewLabel(a.les)}`,
        question: `"${a.w.bangla}" — এর আরবি কোনটি?`,
        explanation: `${a.w.arabic} = ${a.w.bangla}`,
        options: [{ text: a.w.arabic, isCorrect: true }, ...ds.map((d) => ({ text: d.arabic, isCorrect: false }))]
      });
    }
  }

  // ২. আরবি দেখে অর্থ (সাম্প্রতিক এবং একটি পুরোনো দারস)
  [recent, older.length ? older : recent].forEach((source) => {
    const b = takeWord(source);
    if (!b) return;
    const pool = lessonPool(b.les);
    const ds = pickDistractors(b.w, [pool.words, pool.volumeWords], 3, 'bangla');
    if (ds.length < 2) return;
    steps.push({
      type: 'quiz_challenge',
      title: `${REVIEW} • ${reviewLabel(b.les)}`,
      question: `"${b.w.arabic}" — এর অর্থ কী?`,
      explanation: `${b.w.arabic} = ${b.w.bangla}`,
      options: [{ text: b.w.bangla, isCorrect: true }, ...ds.map((d) => ({ text: d.bangla, isCorrect: false }))]
    });
  });

  // ৩. আগের দারসের একটি বাক্যের অর্থ
  const sLes = pick([...recent, ...older]);
  const sentPool = lessonPool(sLes).sentences || [];
  const s = pick(sentPool);
  if (s) {
    const ds = pickDistractors(s, [sentPool, ...recent.map((l) => lessonPool(l).sentences || [])], 3, 'bangla');
    if (ds.length >= 2) {
      steps.push({
        type: 'quiz_challenge',
        title: `${REVIEW} • ${reviewLabel(sLes)}`,
        question: `এই বাক্যের অর্থ কী? ${s.arabic}`,
        explanation: `${s.arabic} = ${s.bangla}`,
        options: [{ text: s.bangla, isCorrect: true }, ...ds.map((d) => ({ text: d.bangla, isCorrect: false }))]
      });
    }
  }

  // ৪. আগের দারসগুলো মিলিয়ে শব্দজোড় (অর্থ ও লেখা আলাদা এমন ৪টি)
  const pairs = [];
  const seenBn = new Set();
  for (let tries = 0; tries < 20 && pairs.length < 4; tries++) {
    const p = takeWord([...recent, ...older]);
    if (p && !seenBn.has(p.w.bangla)) {
      seenBn.add(p.w.bangla);
      pairs.push(p.w);
    }
  }
  if (pairs.length >= 3) {
    steps.push({ type: 'match_pairs', title: `${REVIEW} • আগের দারসের শব্দজোড়`, pairs });
  }

  return shuffle(steps);
}
