const fs = require('fs');

const test1 = 'م ف ت اح';
// If we collapse single characters separated by space:
function collapseArabicLetters(str) {
  // Split tokens by '-' or other punctuation first to preserve hyphenated words
  return str.split('-').map(part => {
    // If a part consists of isolated single letters separated by space, join them:
    const words = part.trim().split(/\s+/);
    // If words are single letters (length 1 or 2 with harakat), reconnect them into a single word
    if (words.length > 1 && words.every(w => w.replace(/[\u064B-\u065F\u0670]/g, '').length === 1)) {
      return words.join('');
    }
    return part.trim();
  }).join(' - ');
}

console.log('Result test1:', collapseArabicLetters(test1));
console.log('Result test2:', collapseArabicLetters('ج د ي د - ج د ي د َةٌ'));
