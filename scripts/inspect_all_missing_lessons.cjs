const fs = require('fs');
const lessonsData = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));
const vocabData = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

const syllabusLessonIds = new Set(lessonsData.lessons.map(l => l.id));

const missingMap = {};

vocabData.forEach(w => {
  if (!syllabusLessonIds.has(w.lessonId)) {
    if (!missingMap[w.lessonId]) {
      missingMap[w.lessonId] = {
        lessonId: w.lessonId,
        chapterId: w.chapterId,
        volumeId: w.volumeId,
        chapterName: w.chapter,
        lessonName: w.lesson,
        wordCount: 0,
        words: []
      };
    }
    missingMap[w.lessonId].wordCount++;
    if (missingMap[w.lessonId].words.length < 5) {
      missingMap[w.lessonId].words.push(`${w.arabic} (${w.bengali})`);
    }
  }
});

console.log(`Total missing lessons from syllabus: ${Object.keys(missingMap).length}`);
for (const [lesId, info] of Object.entries(missingMap)) {
  console.log(`\n• ${lesId} (Vol ${info.volumeId}, ${info.chapterId}):`);
  console.log(`  Chapter: ${info.chapterName} | Lesson: ${info.lessonName} | ${info.wordCount} words`);
  console.log(`  Sample words: ${info.words.join(', ')}`);
}
