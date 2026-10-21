const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('Total vocabulary items:', vocab.length);

const flagged = [];

// Bijoy corruption regexes
const bijoyRegex = /লে|েে|েি|ো|মহ|মি|মব|মদ|মর|মপ|মক|মন|মস|মর|মশ|মণ|মত|মথ|মখ|মগ|ঘমি|োমব|িাতা|েিিা|কেি|দোে|পুহরা|হন্া|হবন্|হদর|াহব|াহন্|াহর|াহল|াহক|াহস|াহদ|াহম|াহয|াহত|াহথ|াহন|াহপ|াহফ|াহব|াহভ|াহর|াহল|াহশ|াহষ|াহস|াহহ|বড়|বক|বন|বপ|কদ|কপ|কখ|কচ|কশ|কছ|কভ|কয|কস|কহ|কজ|কঝ|কট|কঠ|কড|কঢ|কত|কথ|কন|কপ|কফ|কব|কভ|কম|কল|কষ|ভরিা|পণয|পবরমাণ|জুিা|দাে|কোলাম|ওঠাবলা|নক্কার|রিক্ক্ব/;

vocab.forEach((item) => {
  const issues = [];
  const ar = item.arabic;
  const bn = item.bengali;
  const tr = item.transliteration;

  // Check Bengali
  if (bijoyRegex.test(bn)) {
    issues.push(`Bijoy artifact in Bengali: "${bn}"`);
  }
  if (/[a-zA-Z]/.test(bn)) {
    issues.push(`English letter in Bengali: "${bn}"`);
  }
  if (/[\u0600-\u06FF]/.test(bn)) {
    issues.push(`Arabic letter in Bengali: "${bn}"`);
  }
  if (/[ািীুূৃেৈোৌ]{2,}/.test(bn)) {
    issues.push(`Multiple consecutive vowel marks in Bengali: "${bn}"`);
  }

  // Check Arabic
  if (/[a-zA-Z]/.test(ar)) {
    issues.push(`English letter in Arabic: "${ar}"`);
  }
  if (/[\u0980-\u09FF]/.test(ar)) {
    issues.push(`Bengali letter in Arabic: "${ar}"`);
  }
  if (ar.includes('لح ص') || ar.includes('لع ق')) {
    issues.push(`Corrupted Arabic OCR: "${ar}"`);
  }
  if (/[\u064B-\u0652]{2,}/.test(ar.replace(/ّ[\u064B-\u0652]/g, ''))) {
    issues.push(`Multiple harakat stacked illegally: "${ar}"`);
  }
  // Check for smashed words like سِلْعَةسِلَعٌ or خَطِيْئَةٌخَطايا or نَعْلنِعالٌ
  if (/[\u0600-\u06FF]ٌ[\u0600-\u06FF]/.test(ar) || /[\u0600-\u06FF]َة[\u0600-\u06FF]/.test(ar)) {
    issues.push(`Smashed Arabic words without space/dash: "${ar}"`);
  }
  // Check margin notes like - مُضَاعَف or - أَجْوَف
  if (/-\s*(مُضَاعَف|أَجْوَف|نَاقِص|مِثَال|لَفِيْف)/.test(ar)) {
    issues.push(`Margin grammatical note in Arabic: "${ar}"`);
  }

  // Check Transliteration
  if (!tr || tr.trim() === '' || /[\u0600-\u06FF]/.test(tr) || /[\u0980-\u09FF]/.test(tr)) {
    issues.push(`Invalid transliteration: "${tr}"`);
  }

  if (issues.length > 0) {
    flagged.push({ id: item.id, page: item.page, ar, bn, tr, issues });
  }
});

console.log(`FLAGGED ${flagged.length} ITEMS OUT OF ${vocab.length}:`);
flagged.forEach(f => {
  console.log(`[ID ${f.id} P${f.page}] Ar: ${f.ar} | Bn: ${f.bn} | Issues: ${f.issues.join('; ')}`);
});
