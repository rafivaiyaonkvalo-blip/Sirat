const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf-8'));

console.log('Total items:', vocab.length);

const suspiciousBn = [];
const noHarakatAr = [];

// Harakat regex in Arabic: Fatha (064E), Damma (064F), Kasra (0650), Shaddah (0651), Sukun (0652), Tanween (064B, 064C, 064D)
const harakatRegex = /[\u064B-\u0652\u0670]/;

vocab.forEach(v => {
  // Check Bengali
  if (/[ন্হেমবর্মি]|(\s[ািেৈোৌ])/i.test(v.bengali) || v.bengali.length < 2) {
    suspiciousBn.push({ id: v.id, ar: v.arabic, bn: v.bengali, lesson: v.lesson });
  }
  // Check Harakat
  if (!harakatRegex.test(v.arabic)) {
    noHarakatAr.push({ id: v.id, ar: v.arabic, bn: v.bengali });
  }
});

console.log(`Found ${suspiciousBn.length} suspicious Bengali entries.`);
console.log(`Found ${noHarakatAr.length} Arabic entries without detected Harakat.`);

console.log('\nSample suspicious Bengali:');
suspiciousBn.slice(0, 30).forEach(s => console.log(`ID ${s.id} [${s.lesson}]: ${s.ar} -> "${s.bn}"`));
