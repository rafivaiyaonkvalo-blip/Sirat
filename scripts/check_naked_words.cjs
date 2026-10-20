const lessonsData = require('../src/data/lessons.json');

const ch1 = lessonsData.lessons.filter(l => l.chapterId === 'vol1-ch1');

// Harakat marks in Unicode: \u064B through \u0652, plus \u0670 (dagger alif)
const HARAKAT_REGEX = /[\u064B-\u0652\u0670]/;

let nakedWordsCount = 0;

function checkText(text, ctx) {
  if (!text) return;
  // clean punctuation and whitespace
  const words = text
    .replace(/[.,،؟!؛:\-—()«»"'\d\.]/g, ' ')
    .split(/\s+/)
    .filter(w => /[\u0600-\u06FF]/.test(w));

  words.forEach(w => {
    // If it's a valid Arabic word, does it have at least one harakat mark?
    // Exclude common particles or symbols if any, but in Eso Arbi Shikhi EVERY word has harakat!
    // Even 'مَا' has harakat or dagger alif? 'مَا' has fatha on meem: 'مَـا'
    // 'مَنْ' has fatha on meem, sukun on noon: 'مَنْ'
    // 'فِي' has kasra on fa: 'فِي'
    if (!HARAKAT_REGEX.test(w)) {
      console.log(`[NAKED WORD] in ${ctx}: "${w}" (original full text: "${text}")`);
      nakedWordsCount++;
    }
  });
}

ch1.forEach(l => {
  (l.vocabulary || []).forEach((v, i) => checkText(v.arabic, `L${l.lessonNumberInChapter} Vocab[${i}]`));
  (l.sentences || []).forEach((s, i) => checkText(s.arabic, `L${l.lessonNumberInChapter} Sentence[${i}]`));
  (l.dialogues || []).forEach((d, i) => {
    checkText(d.questionArabic, `L${l.lessonNumberInChapter} Dlg[${i}] Q`);
    checkText(d.answerArabic, `L${l.lessonNumberInChapter} Dlg[${i}] A`);
  });
  (l.tamrinKitabi || []).forEach((t, i) => {
    checkText(t.text, `L${l.lessonNumberInChapter} Tamrin[${i}] text`);
    checkText(t.prompt, `L${l.lessonNumberInChapter} Tamrin[${i}] prompt`);
  });
  (l.quiz || []).forEach((q, i) => {
    checkText(q.arabic, `L${l.lessonNumberInChapter} Quiz[${i}] ar`);
    (q.options || []).forEach((opt, j) => checkText(opt, `L${l.lessonNumberInChapter} Quiz[${i}] opt[${j}]`));
  });
});

console.log(`Total completely naked words found: ${nakedWordsCount}`);
