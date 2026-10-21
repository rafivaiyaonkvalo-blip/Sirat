const fs = require('fs');
const vocab = JSON.parse(fs.readFileSync('./src/data/vocabulary.json', 'utf8'));
const lessons = JSON.parse(fs.readFileSync('./src/data/lessons.json', 'utf8'));

const endings = new Map();
function record(str) {
  if (!str || typeof str !== 'string') return;
  const words = str.trim().split(/\s+/);
  for (const w of words) {
    const clean = w.replace(/[()[\]{}.,،؟!]/g, '').trim();
    if (!clean) continue;
    const lastTwo = clean.slice(-2);
    const lastTwoCodes = [...lastTwo].map(c => c.charCodeAt(0).toString(16)).join('-');
    endings.set(lastTwoCodes, (endings.get(lastTwoCodes) || 0) + 1);
  }
}

vocab.forEach(v => record(v.arabic));

function scanLessons(obj) {
  if (!obj) return;
  if (typeof obj === 'string') return;
  if (Array.isArray(obj)) {
    obj.forEach(scanLessons);
  } else if (typeof obj === 'object') {
    if (obj.arabic) record(obj.arabic);
    if (obj.questionArabic) record(obj.questionArabic);
    if (obj.answerArabic) record(obj.answerArabic);
    if (obj.targetArabic) record(obj.targetArabic);
    Object.values(obj).forEach(scanLessons);
  }
}
scanLessons(lessons);

console.log('Top 40 word endings:');
const sorted = [...endings.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
for (const [codes, count] of sorted) {
  const chars = codes.split('-').map(c => String.fromCharCode(parseInt(c, 16))).join('');
  console.log(`${codes.padEnd(12)} (${chars}) : ${count}`);
}
