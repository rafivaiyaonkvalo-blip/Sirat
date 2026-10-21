const fs = require('fs');
const vocab = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

let missingPronunciation = 0;
let missingTranslit = 0;

vocab.forEach(w => {
  if (!w.banglaPronunciation || w.banglaPronunciation === 'undefined') missingPronunciation++;
  if (!w.transliteration || w.transliteration === 'undefined') missingTranslit++;
});

console.log('Total vocabulary items:', vocab.length);
console.log('Items missing banglaPronunciation:', missingPronunciation);
console.log('Items missing transliteration:', missingTranslit);
