const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf-8'));
const text = fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'new_input_text.txt'), 'utf-8');

// Split into lines
const lines = text.split(/\r?\n/);
console.log('Total lines in new_input_text.txt:', lines.length);

// Let's collect all Arabic occurrences in new_input_text.txt with their harakat
const arabicList = [];
lines.forEach((line, idx) => {
  // Extract tokens separated by tabs or spaces
  const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (/[\u0600-\u06FF]/.test(p) && !p.includes('بسم') && !p.includes('الرحمن') && !p.includes("দু'আ")) {
      arabicList.push({ lineNum: idx + 1, text: p, fullLine: line });
    }
  }
});

console.log('Total Arabic tokens found in new_input_text.txt:', arabicList.length);
console.log('Sample Arabic tokens (first 20):', arabicList.slice(0, 20));
