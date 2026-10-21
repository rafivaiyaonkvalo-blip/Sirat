const fs = require('fs');
const lessonsData = require('../src/data/lessons.json');

const ch1 = lessonsData.lessons.filter(l => l.chapterId === 'vol1-ch1');
const bnWords = new Set();
function extract(obj) {
  if (!obj) return;
  if (typeof obj === 'string') {
    const words = obj.split(/[\s,।!?\-—:;\"'()«»\/]+/).filter(w => /[\u0980-\u09FF]/.test(w));
    words.forEach(w => bnWords.add(w));
  } else if (Array.isArray(obj)) obj.forEach(extract);
  else if (typeof obj === 'object') Object.values(obj).forEach(extract);
}
extract(ch1);

const sorted = Array.from(bnWords).sort();
fs.writeFileSync('scripts/ch1_bn_words.txt', sorted.join('\n'), 'utf8');
console.log('Wrote', sorted.length, 'words to scripts/ch1_bn_words.txt');
