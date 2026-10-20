const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf-8'));
const arabicExtracted = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'arabic_extracted.json'), 'utf-8'));

// Build dictionary of all authentic Arabic words extracted with Tashkeel
const authMap = new Map();

function strip(s) {
  if (!s) return '';
  return s.replace(/[\u064B-\u065F\u0670\s\-\.\,\?\!—–\(\)\[\]\{\}\/\\~]/g, '').trim();
}

// 1. From arabicExtracted
arabicExtracted.forEach(item => {
  if (item.raw) {
    let raw = item.raw.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
    // Normalize tanween
    raw = raw.replace(/^ٌ\s*/, '').trim();
    if (raw) {
      const key = strip(raw);
      if (key && !authMap.has(key)) {
        authMap.set(key, raw);
      }
    }
  }
});

console.log('authMap size from arabicExtracted:', authMap.size);

// Also load HARAKAT_FIXES from clean_and_enrich_vocab.cjs
// Let's check how many vocab entries match
let matched = 0;
let unmatched = [];

vocab.forEach(v => {
  const key = strip(v.arabic);
  if (authMap.has(key)) {
    matched++;
  } else {
    unmatched.push({ id: v.id, ar: v.arabic, bn: v.bengali });
  }
});

console.log({ total: vocab.length, matched, unmatchedCount: unmatched.length });
console.log('First 20 unmatched:', unmatched.slice(0, 20));
