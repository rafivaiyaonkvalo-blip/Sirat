const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/lessons.json');
const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');

const lessonsData = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

const existingLessonIds = new Set(lessonsData.lessons.map(l => l.id));

// Group vocabulary by lessonId
const vocabByLesson = {};
vocabData.forEach(w => {
  if (!vocabByLesson[w.lessonId]) {
    vocabByLesson[w.lessonId] = [];
  }
  vocabByLesson[w.lessonId].push(w);
});

// Helper to determine chapter metadata
const chapterMap = {};
lessonsData.levels.forEach(lvl => {
  lvl.chapters.forEach(ch => {
    chapterMap[ch.id] = {
      volumeId: lvl.id,
      volumeName: lvl.volume,
      chapterNumber: ch.number,
      chapterTitle: ch.title,
      arabicTitle: ch.arabicTitle
    };
  });
});

console.log('Known Chapters:', Object.keys(chapterMap));

// Find all missing lessons
const missingIds = Object.keys(vocabByLesson).filter(id => !existingLessonIds.has(id));
console.log(`Found ${missingIds.length} missing lesson IDs:`, missingIds);
