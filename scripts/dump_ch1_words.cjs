const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

for (let i = 1; i <= 9; i++) {
  const lessonId = `vol1-ch1-l${i}`;
  const words = d.filter(w => w.lessonId === lessonId);
  console.log(`\n========================================`);
  console.log(`LESSON ${i} (${lessonId}) -> Total ${words.length} words:`);
  console.log('========================================');
  words.slice(0, 15).forEach((w, idx) => {
    console.log(`${idx + 1}. ${w.arabic} | ${w.bengali} | ${w.transliteration} | ${w.banglaPronunciation}`);
  });
}
