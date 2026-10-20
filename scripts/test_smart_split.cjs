const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'new_input_text.txt'), 'utf-8');
const lines = text.split(/\r?\n/);

function splitBengaliArabic(str) {
  // Replace multiple spaces and tanween alignments
  return str
    // Split where Arabic followed by Bengali
    .replace(/([\u0600-\u06FF\s\-\.\,\?\!—–\(\)\[\]\{\}\/\\~ًٌَُِّ]+?)([\u0980-\u09FF][^\u0600-\u06FF]*)/g, '$1\t$2')
    // Split where Bengali followed by Arabic
    .replace(/([\u0980-\u09FF\(\)\[\]\.\,\?\!]+?)([\u0600-\u06FF])/g, '$1\t$2');
}

for (let i = 4; i < 30; i++) {
  const line = lines[i];
  if (!/[\u0600-\u06FF]/.test(line)) continue;
  const processed = splitBengaliArabic(line);
  console.log(`L${i+1} original:`, line.replace(/\t+/g, ' | '));
  console.log(`L${i+1} split:   `, processed.replace(/\t+/g, ' || '));
  console.log('---');
}
