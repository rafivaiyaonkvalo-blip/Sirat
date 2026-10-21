const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

const defects = [];

vocab.forEach(v => {
  const issues = [];
  const ar = v.arabic;
  const bn = v.bengali;
  const tr = v.transliteration;

  // 1. Transliteration containing Arabic
  if (/[\u0600-\u06FF]/.test(tr)) {
    issues.push('tr_has_arabic');
  }

  // 2. Arabic margin notes
  if (/-\s*(مُضَاعَف|أَجْوَف|نَاقِص|مِثَال|لَفِيْف)/.test(ar)) {
    issues.push('ar_margin_note');
  }

  // 3. Tanween and hyphen anomalies in Arabic
  if (/-ٌ/.test(ar) || /ٌُ/.test(ar) || /ٌَ/.test(ar) || /ٌِ/.test(ar) || /ًٌ/.test(ar) || /ٌ[َُِ]/.test(ar)) {
    issues.push('ar_stacked_tanween');
  }

  // 4. Smashed Arabic words
  if (/[\u0600-\u06FF]ٌ[\u0600-\u06FF]/.test(ar) || /[\u0600-\u06FF]َة[\u0600-\u06FF]/.test(ar)) {
    issues.push('ar_smashed_words');
  }

  // 5. Corrupted OCR Arabic
  if (ar.includes('لح ص') || ar.includes('لع ق') || ar.includes('أُولئِكَذلك') || ar === 'أبغضٌ' || ar === 'وَضوء' || ar === 'أَرأيتٌ') {
    issues.push('ar_ocr_corrupt');
  }

  // 6. Bengali anomalies
  if (
    bn.includes('সৈকত') ||
    bn.includes('জুিা') ||
    bn.includes('পণয') ||
    bn.includes('পবরমাণ') ||
    bn.includes('ভরিা') ||
    bn.includes('দাে, কোলাম') ||
    bn.includes('ওঠাবলা') ||
    bn.includes('এক ষষ্ঠাংশ্') ||
    /[ািীুূৃেৈোৌ]{2,}/.test(bn) ||
    /ক[যভদখশছহজঝটডতথনপফবমষ]/.test(bn.replace(/ক্[তত্থটডমকপ]/g, ''))
  ) {
    issues.push('bn_corrupt');
  }

  if (issues.length > 0) {
    defects.push({ id: v.id, page: v.page, ar, bn, tr, issues });
  }
});

console.log(`Total defects found: ${defects.length}`);
fs.writeFileSync(path.join(__dirname, 'defects_list.json'), JSON.stringify(defects, null, 2), 'utf8');
console.log('Saved to scripts/defects_list.json');
