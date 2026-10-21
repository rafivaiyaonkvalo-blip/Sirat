const vocab = require('../src/data/vocabulary.json');
const lessonsData = require('../src/data/lessons.json');
const { prepareArabicWithoutWaqf } = require('./test_unified_waqf.cjs');

console.log('--- AUDITING ENTIRE CURRICULUM VOCABULARY ---');
let vocabIssues = 0;
vocab.forEach((v, i) => {
  const ar = v.arabic;
  const out1 = prepareArabicWithoutWaqf(ar);
  const out2 = prepareArabicWithoutWaqf(out1);
  if (out1 !== out2) {
    console.error(`Vocab Idempotence Issue [${i}]: "${ar}" => "${out1}" => "${out2}"`);
    vocabIssues++;
  }
  if (!out1 && ar) {
    console.error(`Vocab Empty Output [${i}]: "${ar}"`);
    vocabIssues++;
  }
});
console.log(`Audited ${vocab.length} vocabulary words. Issues: ${vocabIssues}`);

console.log('\n--- AUDITING ALL LESSON SENTENCES & EXERCISES ---');
let sentenceIssues = 0;
let sentenceCount = 0;
lessonsData.lessons.forEach((l) => {
  const check = (str, context) => {
    if (!str) return;
    sentenceCount++;
    const out1 = prepareArabicWithoutWaqf(str);
    const out2 = prepareArabicWithoutWaqf(out1);
    if (out1 !== out2) {
      console.error(`Sentence Idempotence Issue in ${l.id} (${context}): "${str}" => "${out1}" => "${out2}"`);
      sentenceIssues++;
    }
  };
  (l.sentences || []).forEach(s => check(s.arabic || s.targetArabic, 'sentences'));
  (l.dialogues || []).forEach(d => check(d.arabic, 'dialogues'));
  (l.tamrinKitabi || []).forEach(t => check(t.arabicSentence, 'tamrinKitabi'));
  (l.vocabulary || []).forEach(v => check(v.arabic, 'lessonVocab'));
});
console.log(`Audited ${sentenceCount} curriculum Arabic strings. Issues: ${sentenceIssues}`);

if (vocabIssues === 0 && sentenceIssues === 0) {
  console.log('\nSUCCESS! 100% OF THE CURRICULUM DATA PASSES CLEANLY!');
} else {
  process.exit(1);
}
