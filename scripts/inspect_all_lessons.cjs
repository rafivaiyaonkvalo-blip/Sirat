const fs = require('fs');
const lessonsData = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));

console.log('=== LEVELS & CHAPTERS IN lessons.json ===');
lessonsData.levels.forEach(lvl => {
  console.log(`\nVolume ${lvl.id}: ${lvl.volume} (totalLessons: ${lvl.totalLessons})`);
  lvl.chapters.forEach(ch => {
    console.log(`  - ${ch.id}: ${ch.title} | lessonCount: ${ch.lessonCount}`);
  });
});

console.log('\n=== LESSON ENTRIES IN lessons.json ===');
const lessonsByChapter = {};
lessonsData.lessons.forEach(l => {
  lessonsByChapter[l.chapterId] = (lessonsByChapter[l.chapterId] || 0) + 1;
});
console.log(JSON.stringify(lessonsByChapter, null, 2));
