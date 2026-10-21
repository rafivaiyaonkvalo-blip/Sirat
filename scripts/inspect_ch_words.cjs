const fs = require('fs');
const vocab = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

const chWords = {};
vocab.forEach(w => {
  if (!chWords[w.chapterId]) chWords[w.chapterId] = {};
  if (!chWords[w.chapterId][w.lessonId]) chWords[w.chapterId][w.lessonId] = {
    lessonName: w.lesson,
    lessonNum: w.lessonNumberInChapter,
    count: 0,
    page: w.page,
    sample: []
  };
  chWords[w.chapterId][w.lessonId].count++;
  if (chWords[w.chapterId][w.lessonId].sample.length < 3) {
    chWords[w.chapterId][w.lessonId].sample.push(w.arabic);
  }
});

fs.writeFileSync('ch_words_breakdown.json', JSON.stringify(chWords, null, 2), 'utf8');
console.log('Breakdown saved to ch_words_breakdown.json');
