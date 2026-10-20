const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('Total vocabulary items:', vocab.length);

const issues = [];

vocab.forEach((v) => {
  const ar = v.arabic.trim();
  const bn = v.bengali.trim();

  // 1. Check for isolated or broken Arabic letters with spaces inside a single root
  const arParts = ar.split(/\s+/);
  for (const part of arParts) {
    const strippedPart = part.replace(/[\u064B-\u065F\u0670]/g, '');
    if (arParts.length > 1 && strippedPart.length === 1 && !['وَ', 'فَ', 'بِ', 'لِ', 'كَ', 'أَ', 'يَا', 'مَا', 'لَا', 'مِنْ', 'عَنْ', 'فِي'].includes(part)) {
      issues.push({ id: v.id, page: v.page, ar, bn, reason: `Suspicious 1-char Arabic token '${part}' in '${ar}'` });
      break;
    }
  }

  // 2. Check Tanween at the beginning or middle of word, e.g. "هذا -ٌهذه"
  if (/[-_]\s*[\u064B-\u0652]/.test(ar) || /[\u064B-\u0650][^\s\u064B-\u0652\u0670]/.test(ar)) {
    issues.push({ id: v.id, page: v.page, ar, bn, reason: `Tanween/Harakah on punctuation or mid-word: '${ar}'` });
  }

  // 3. Arabic strings containing non-Arabic letters (excluding spaces, brackets, hyphen)
  const nonArInAr = ar.replace(/[\u0600-\u06FF\s\(\)\[\]\-\,\.\:\;\/—–]/g, '');
  if (nonArInAr.length > 0) {
    issues.push({ id: v.id, page: v.page, ar, bn, reason: `Non-Arabic characters in arabic field: '${nonArInAr}' in '${ar}'` });
  }

  // 4. Bengali strings with suspicious characters or patterns
  if (/[\u0600-\u06FF]/.test(bn)) {
    issues.push({ id: v.id, page: v.page, ar, bn, reason: `Arabic characters in bengali field: '${bn}'` });
  }

  // 5. Bengali with consecutive vowel marks or broken Bijoy patterns
  if (/[ািীুূৃেৈোৌ]{2,}/.test(bn)) {
    issues.push({ id: v.id, page: v.page, ar, bn, reason: `Consecutive vowel marks in bengali: '${bn}'` });
  }

  // 6. Check transliteration
  if (!v.transliteration || v.transliteration.trim() === '') {
    issues.push({ id: v.id, page: v.page, ar, bn, reason: `Missing transliteration` });
  } else if (/[\u0600-\u06FF]/.test(v.transliteration)) {
    issues.push({ id: v.id, page: v.page, ar, bn, reason: `Arabic characters in transliteration: '${v.transliteration}'` });
  }
});

console.log(`Found ${issues.length} potential issues:`);
issues.forEach(iss => console.log(`[ID ${iss.id} | Page ${iss.page}] (${iss.ar} => ${iss.bn}): ${iss.reason}`));
