const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/vocabulary.json', 'utf8'));

for (let i = 1; i <= 9; i++) {
  const lessonId = `vol1-ch1-l${i}`;
  const words = d.filter(w => w.lessonId === lessonId);
  console.log(`\n=== Lesson ${i} (${lessonId}): ${words.length} words ===`);
  console.log(words.slice(0, 8).map(w => `${w.arabic} (${w.bangla})`).join(', '));
  if (words.length > 8) {
    console.log(`... and ${words.length - 8} more: ` + words.slice(8, 16).map(w => `${w.arabic} (${w.bangla})`).join(', '));
  }
}
