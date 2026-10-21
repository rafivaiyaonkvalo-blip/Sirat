const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf-8'));
const arabicExtracted = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'arabic_extracted.json'), 'utf-8'));

function norm(s) {
  if (!s) return '';
  // Replace eastern arabic / bengali chars if any
  let str = s.replace(/র/g, 'ر').replace(/ফ/g, 'ف').replace(/দ/g, 'د').replace(/ম/g, 'م');
  // Strip tashkeel, spaces, hyphens, punctuation
  return str.replace(/[\u064B-\u065F\u0670\s\-\.\,\?\!—–\(\)\[\]\{\}\/\\~ة]/g, '').trim();
}

// Build master authentic dictionary
const masterDict = new Map();

// Helper to add
function addWord(keyStr, authenticArabic, translit, bangla) {
  const k = norm(keyStr);
  if (k && !masterDict.has(k)) {
    masterDict.set(k, { ar: authenticArabic, tr: translit, bn: bangla });
  }
}

// Load clean_and_enrich_vocab.cjs HARAKAT_FIXES
const enrichCode = fs.readFileSync(path.join(__dirname, 'clean_and_enrich_vocab.cjs'), 'utf-8');
const matchHarakat = enrichCode.match(/const HARAKAT_FIXES = \{([\s\S]*?)\};/);
if (matchHarakat) {
  const fixes = eval('({' + matchHarakat[1] + '})');
  for (const [k, v] of Object.entries(fixes)) {
    addWord(k, v);
    addWord(v, v);
  }
}

// Load arabic_extracted.json
arabicExtracted.forEach(item => {
  if (item.raw) {
    let clean = item.raw.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
    // if starts with tanween
    clean = clean.replace(/^ٌ\s*/, '').trim();
    if (clean) {
      addWord(clean, clean);
    }
  }
});

console.log('Master authentic dictionary size:', masterDict.size);

let found = 0;
let missing = [];

vocab.forEach(v => {
  const k = norm(v.arabic);
  if (masterDict.has(k)) {
    found++;
  } else {
    missing.push({ id: v.id, ar: v.arabic, bn: v.bengali });
  }
});

console.log({ total: vocab.length, found, missingCount: missing.length });
console.log('Missing items (first 30):', missing.slice(0, 30));
