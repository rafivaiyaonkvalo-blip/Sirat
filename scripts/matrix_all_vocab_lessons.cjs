const fs = require('fs');
const vocab = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

const matrix = {};

vocab.forEach(w => {
  const vol = w.volumeId || 1;
  const ch = w.chapterId || 'unknown';
  const chTitle = w.chapter || ch;
  const les = w.lessonId || 'unknown';
  const lesName = w.lesson || les;
  const lesNum = w.lessonNumberInChapter || 0;

  if (!matrix[vol]) matrix[vol] = {};
  if (!matrix[vol][ch]) matrix[vol][ch] = { chTitle, lessons: {} };

  if (!matrix[vol][ch].lessons[les]) {
    matrix[vol][ch].lessons[les] = {
      lessonId: les,
      lessonName: lesName,
      lessonNum: lesNum,
      wordCount: 0,
      sampleWords: []
    };
  }

  matrix[vol][ch].lessons[les].wordCount++;
  if (matrix[vol][ch].lessons[les].sampleWords.length < 3) {
    matrix[vol][ch].lessons[les].sampleWords.push(`${w.arabic} (${w.bengali})`);
  }
});

console.log('========================================================');
console.log('COMPLETE BREAKDOWN OF ALL LESSONS IN VOCABULARY DATASET');
console.log('========================================================');

for (const volId of [1, 2, 3]) {
  console.log(`\n=================== VOLUME ${volId} ===================`);
  const chapters = matrix[volId] || {};
  for (const [chId, chData] of Object.entries(chapters)) {
    console.log(`\nChapter: ${chId} - "${chData.chTitle}"`);
    const lessons = Object.values(chData.lessons).sort((a, b) => a.lessonNum - b.lessonNum);
    console.log(`Total Lessons in this Chapter: ${lessons.length}`);
    lessons.forEach(l => {
      console.log(`  • ${l.lessonId} | ${l.lessonName} (num: ${l.lessonNum}) -> ${l.wordCount} words | Samples: ${l.sampleWords.join(', ')}`);
    });
  }
}
