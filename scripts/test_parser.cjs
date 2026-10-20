const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'new_input_text.txt'), 'utf-8');
const lines = text.split(/\r?\n/);

console.log("Analyzing first 30 vocabulary lines:");

function extractPairsFromLine(line) {
  // Ignore headers
  if (line.includes('بسم') || line.includes("দু'আ") || line.includes('জান্নাত')) return [];
  
  // Clean line: replace excessive tabs/spaces
  // Look for Arabic segments:
  // Regex to match Arabic text including tashkeel, tanween, punctuation
  const arabicRegex = /[\u0600-\u06FF][\u0600-\u06FF\s\-\.\,\?\!—–\(\)\[\]\{\}\/\\~ًٌَُِّ]*[\u0600-\u06FF]/g;
  
  // Let's test splitting by tabs
  const tokens = line.split('\t').map(t => t.trim()).filter(Boolean);
  return tokens;
}

for (let i = 0; i < 35; i++) {
  const line = lines[i];
  if (!/[\u0600-\u06FF]/.test(line)) continue;
  const tokens = extractPairsFromLine(line);
  console.log(`L${i+1}:`, tokens);
}
