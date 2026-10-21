const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf-8'));
const arabicExtracted = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'arabic_extracted.json'), 'utf-8'));
const text = fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'new_input_text.txt'), 'utf-8');

// Load HARAKAT_FIXES
const enrichCode = fs.readFileSync(path.join(__dirname, 'clean_and_enrich_vocab.cjs'), 'utf-8');
const matchHarakat = enrichCode.match(/const HARAKAT_FIXES = \{([\s\S]*?)\};/);
const harakatFixes = matchHarakat ? eval('({' + matchHarakat[1] + '})') : {};

// Load CANONICAL_MAP
const genCode = fs.readFileSync(path.join(__dirname, 'generate_all_vocab.cjs'), 'utf-8');
const matchCanonical = genCode.match(/const CANONICAL_MAP = \{([\s\S]*?)\};/);
const canonicalMap = matchCanonical ? eval('({' + matchCanonical[1] + '})') : {};

// Normalization function: removes spaces, tashkeel, punctuation, hyphens, and converts Bengali corruption chars
function normKey(s) {
  if (!s) return '';
  let str = s.replace(/র/g, 'ر').replace(/ফ/g, 'ف').replace(/দ/g, 'د').replace(/ম/g, 'م');
  return str.replace(/[\u064B-\u065F\u0670\s\-\.\,\?\!—–\(\)\[\]\{\}\/\\~ة]/g, '').trim();
}

const lookup = new Map();

function register(rawKey, authenticArabic, translit, bangla) {
  if (!authenticArabic) return;
  // Ensure Tanween / harakat normalized
  let cleanAr = authenticArabic.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
  cleanAr = cleanAr.replace(/^ٌ\s*/, '').trim();
  if (!cleanAr) return;

  const key = normKey(rawKey || cleanAr);
  if (key && !lookup.has(key)) {
    lookup.set(key, { ar: cleanAr, tr: translit, bn: bangla });
  }
}

// 1. Register HARAKAT_FIXES
for (const [k, v] of Object.entries(harakatFixes)) {
  register(k, v);
  register(v, v);
}

// 2. Register CANONICAL_MAP
for (const [k, v] of Object.entries(canonicalMap)) {
  // If noun without tanween, append tanween if appropriate
  let ar = k;
  if (v.pos === 'বিশেষ্য' || v.pos === 'গুণবাচক') {
    if (harakatFixes[k]) ar = harakatFixes[k];
    else if (ar.endsWith('َة')) ar = ar + 'ٌ';
    else if (!ar.includes(' ') && !ar.endsWith('ٌ') && !ar.startsWith('ال')) ar = ar + 'ٌ';
  }
  register(k, ar, v.tr, v.bn);
}

// 3. Register arabicExtracted
arabicExtracted.forEach(item => {
  if (item.raw) {
    let clean = item.raw.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean.startsWith('ٌ') && !clean.endsWith('ٌ')) {
      clean = clean.replace(/^ٌ\s*/, '').trim() + 'ٌ';
    }
    register(clean, clean);
  }
});

console.log('Total entries in lookup map:', lookup.size);

// Test matching against all 1,170 vocab entries
let matchedCount = 0;
let remaining = [];

vocab.forEach(v => {
  const k = normKey(v.arabic);
  if (lookup.has(k)) {
    matchedCount++;
  } else {
    remaining.push({ id: v.id, ar: v.arabic, bn: v.bengali });
  }
});

console.log({ totalVocab: vocab.length, matchedCount, remainingCount: remaining.length });
console.log('Sample remaining items:', remaining.slice(0, 35));
