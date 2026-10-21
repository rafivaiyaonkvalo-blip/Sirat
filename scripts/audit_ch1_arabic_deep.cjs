const lessonsData = require('../src/data/lessons.json');
const { prepareArabicWithoutWaqf } = require('./test_unified_waqf.cjs');

const ch1 = lessonsData.lessons.filter(l => l.chapterId === 'vol1-ch1');
console.log(`Auditing ALL Arabic strings in Chapter 1 (${ch1.length} lessons)...`);

let issues = 0;
let auditedCount = 0;

function auditArabic(str, ctx) {
  if (!str) return;
  if (!/[\u0600-\u06FF]/.test(str)) return; // skip pure non-arabic
  auditedCount++;

  // Test idempotence
  const out1 = prepareArabicWithoutWaqf(str);
  const out2 = prepareArabicWithoutWaqf(out1);
  if (out1 !== out2) {
    console.error(`[IDEMPOTENCE ISSUE] ${ctx}: "${str}" => "${out1}" => "${out2}"`);
    issues++;
  }

  // Check for bare/naked Arabic letters (excluding spaces, punctuation, digits, alif-waslah/dagger alif/maddah)
  // Standard Arabic letters: \u0621-\u064A
  // Diacritics: \u064B-\u0652 (fathan, damman, kasran, fatha, damma, kasra, shadda, sukun), plus \u0670 (dagger alif), \u0653 (maddah)
  // In vowelled text, almost every consonant letter must have at least one diacritic.
  // Exception: alif (ا) when used as lengthening vowel or with waslah; yaa (ي) or waw (و) as lengthening vowels preceded by kasra/damma.
}

ch1.forEach(l => {
  (l.vocabulary || []).forEach((v, i) => auditArabic(v.arabic, `L${l.lessonNumberInChapter} Vocab[${i}]`));
  (l.sentences || []).forEach((s, i) => auditArabic(s.arabic, `L${l.lessonNumberInChapter} Sentence[${i}]`));
  (l.dialogues || []).forEach((d, i) => {
    auditArabic(d.arabic, `L${l.lessonNumberInChapter} Dialogue[${i}].arabic`);
    auditArabic(d.questionArabic, `L${l.lessonNumberInChapter} Dialogue[${i}].qAr`);
    auditArabic(d.answerArabic, `L${l.lessonNumberInChapter} Dialogue[${i}].ansAr`);
  });
  (l.tamrinKitabi || []).forEach((t, i) => {
    auditArabic(t.text, `L${l.lessonNumberInChapter} Tamrin[${i}].text`);
    auditArabic(t.prompt, `L${l.lessonNumberInChapter} Tamrin[${i}].prompt`);
  });
  (l.quiz || []).forEach((q, i) => {
    auditArabic(q.question, `L${l.lessonNumberInChapter} Quiz[${i}].question`);
    auditArabic(q.arabic, `L${l.lessonNumberInChapter} Quiz[${i}].arabic`);
    (q.options || []).forEach((opt, j) => auditArabic(opt, `L${l.lessonNumberInChapter} Quiz[${i}].opt[${j}]`));
  });
});

console.log(`Audited ${auditedCount} Arabic strings in Chapter 1.`);
console.log(`Issues found: ${issues}`);
