const fs = require('fs');
const path = require('path');

const lessonsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/lessons.json'), 'utf8'));
const vocabData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const existingLessons = new Map();
lessonsData.lessons.forEach(l => {
  existingLessons.set(l.id, l);
});

// Group vocabulary by lessonId
const vocabByLesson = {};
vocabData.forEach(w => {
  if (!vocabByLesson[w.lessonId]) {
    vocabByLesson[w.lessonId] = {
      lessonId: w.lessonId,
      volumeId: w.volumeId,
      chapterId: w.chapterId,
      volume: w.volume,
      chapter: w.chapter,
      lessonName: w.lesson,
      lessonNumberInChapter: w.lessonNumberInChapter,
      words: []
    };
  }
  vocabByLesson[w.lessonId].words.push({
    id: w.id,
    arabic: w.arabic,
    bengali: w.bengali,
    transliteration: w.transliteration,
    partOfSpeech: w.partOfSpeech
  });
});

const report = {
  totalVocabWords: vocabData.length,
  totalLessonsInVocab: Object.keys(vocabByLesson).length,
  totalLessonsInLessonsJson: lessonsData.lessons.length,
  existingLessonIds: Array.from(existingLessons.keys()),
  missingLessons: [],
  presentLessons: []
};

for (const [lesId, data] of Object.entries(vocabByLesson)) {
  if (!existingLessons.has(lesId)) {
    report.missingLessons.push({
      lessonId: lesId,
      volumeId: data.volumeId,
      chapterId: data.chapterId,
      volume: data.volume,
      chapter: data.chapter,
      lessonName: data.lessonName,
      lessonNumberInChapter: data.lessonNumberInChapter,
      wordCount: data.words.length,
      sampleWords: data.words.slice(0, 5)
    });
  } else {
    report.presentLessons.push({
      lessonId: lesId,
      wordCountInVocab: data.words.length,
      wordCountInLesson: existingLessons.get(lesId).vocabulary ? existingLessons.get(lesId).vocabulary.length : 0
    });
  }
}

// Sort missing lessons by volume, chapter, and lessonNumber
report.missingLessons.sort((a, b) => {
  if (a.volumeId !== b.volumeId) return a.volumeId - b.volumeId;
  if (a.chapterId !== b.chapterId) return a.chapterId.localeCompare(b.chapterId);
  return (a.lessonNumberInChapter || 0) - (b.lessonNumberInChapter || 0);
});

fs.writeFileSync(path.join(__dirname, '../missing_lessons_report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('Report written to missing_lessons_report.json. Missing lessons count:', report.missingLessons.length);
