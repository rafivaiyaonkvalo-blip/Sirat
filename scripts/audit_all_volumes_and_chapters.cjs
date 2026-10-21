const fs = require('fs');
const lessonsData = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));
const vocabData = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

console.log('========================================================');
console.log('AUDIT: ALL VOLUMES & CHAPTERS IN lessons.json');
console.log('========================================================');

const lessonsInSyllabus = {};
lessonsData.lessons.forEach(l => {
  if (!lessonsInSyllabus[l.chapterId]) {
    lessonsInSyllabus[l.chapterId] = [];
  }
  lessonsInSyllabus[l.chapterId].push(l.id);
});

lessonsData.levels.forEach(lvl => {
  console.log(`\n📘 Volume ${lvl.id}: ${lvl.volume} (Declared totalLessons: ${lvl.totalLessons})`);
  lvl.chapters.forEach(ch => {
    const inSyllabus = lessonsInSyllabus[ch.id] || [];
    console.log(`  📁 Chapter ${ch.id}: "${ch.title}"`);
    console.log(`     - Declared lessonCount in chapter: ${ch.lessonCount}`);
    console.log(`     - Actual lesson objects in lessons.json: ${inSyllabus.length}`);
    console.log(`     - Lesson IDs: ${inSyllabus.join(', ')}`);
  });
});

console.log('\n========================================================');
console.log('AUDIT: ALL LESSON IDS PRESENT IN vocabulary.json');
console.log('========================================================');

const vocabByChapterAndLesson = {};
vocabData.forEach(w => {
  const ch = w.chapterId || 'NO_CHAPTER';
  const les = w.lessonId || 'NO_LESSON';
  if (!vocabByChapterAndLesson[ch]) {
    vocabByChapterAndLesson[ch] = {};
  }
  vocabByChapterAndLesson[ch][les] = (vocabByChapterAndLesson[ch][les] || 0) + 1;
});

for (const [chId, lessons] of Object.entries(vocabByChapterAndLesson)) {
  console.log(`\n📁 Chapter: ${chId}`);
  const lessonKeys = Object.keys(lessons).sort();
  console.log(`   Distinct lesson IDs in vocab (${lessonKeys.length}):`);
  for (const lKey of lessonKeys) {
    console.log(`     • ${lKey}: ${lessons[lKey]} words`);
  }
}

console.log('\n========================================================');
console.log('DISCREPANCY CHECK: Vocabulary lesson IDs NOT in lessons.json');
console.log('========================================================');

const allSyllabusLessonIds = new Set(lessonsData.lessons.map(l => l.id));
const missingFromSyllabus = [];

for (const [chId, lessons] of Object.entries(vocabByChapterAndLesson)) {
  for (const lKey of Object.keys(lessons)) {
    if (!allSyllabusLessonIds.has(lKey)) {
      missingFromSyllabus.push({ chapterId: chId, lessonId: lKey, wordCount: lessons[lKey] });
    }
  }
}

if (missingFromSyllabus.length === 0) {
  console.log('✅ ALL lesson IDs from vocabulary.json exist in lessons.json!');
} else {
  console.log(`⚠️ FOUND ${missingFromSyllabus.length} lesson IDs in vocabulary.json that are MISSING from lessons.json:`);
  console.log(JSON.stringify(missingFromSyllabus, null, 2));
}

console.log('\n========================================================');
console.log('DISCREPANCY CHECK: Declared lessonCount vs actual lessons count');
console.log('========================================================');
lessonsData.levels.forEach(lvl => {
  let actualVolTotal = 0;
  lvl.chapters.forEach(ch => {
    const actualCount = (lessonsInSyllabus[ch.id] || []).length;
    actualVolTotal += actualCount;
    if (ch.lessonCount !== actualCount) {
      console.log(`❌ Mismatch in Chapter ${ch.id}: declared lessonCount=${ch.lessonCount}, but found ${actualCount} lessons`);
    }
  });
  if (lvl.totalLessons !== actualVolTotal) {
    console.log(`❌ Mismatch in Volume ${lvl.id}: declared totalLessons=${lvl.totalLessons}, but actual sum is ${actualVolTotal}`);
  }
});
