const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf-8'));
const harakatRegex = /[\u064B-\u065F\u0670]/;

const needsFix = [];

vocab.forEach(v => {
  const words = v.arabic.split(/\s+/);
  const singleCharWords = words.filter(w => /^[\u0600-\u06FF]$/.test(w));
  const hasSpaced = singleCharWords.length > 1;
  const hasNoHarakat = !harakatRegex.test(v.arabic);
  const hasBnInAr = /[\u0980-\u09FF]/.test(v.arabic);

  if (hasSpaced || hasNoHarakat || hasBnInAr) {
    needsFix.push({
      id: v.id,
      arabic: v.arabic,
      bengali: v.bengali,
      hasSpaced,
      hasNoHarakat,
      hasBnInAr
    });
  }
});

console.log('Total items needing fix:', needsFix.length);
console.log('Sample items needing fix (first 25):', needsFix.slice(0, 25));
