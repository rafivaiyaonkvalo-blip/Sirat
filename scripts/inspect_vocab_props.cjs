const fs = require('fs');
const vocab = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

console.log('Sample word from vol2-ch1:');
const sampleVol2 = vocab.find(w => w.chapterId === 'vol2-ch1' && w.lessonId === 'vol2-ch1-l16');
console.log(JSON.stringify(sampleVol2, null, 2));

console.log('\nSample word from vol3-ch2:');
const sampleVol3 = vocab.find(w => w.chapterId === 'vol3-ch2' && w.lessonId === 'vol3-ch2-l6');
console.log(JSON.stringify(sampleVol3, null, 2));

console.log('\nCheck if words have original page or lesson metadata:');
const allKeys = new Set();
vocab.forEach(w => Object.keys(w).forEach(k => allKeys.add(k)));
console.log('All property keys in vocabulary entries:', Array.from(allKeys));
