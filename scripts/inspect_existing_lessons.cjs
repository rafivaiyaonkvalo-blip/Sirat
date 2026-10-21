const fs = require('fs');
const lessonsData = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));

console.log('=== CURRENT LESSONS IN lessons.json (EXCLUDING vol1-ch1) ===');
lessonsData.lessons.forEach(l => {
  if (l.chapterId !== 'vol1-ch1') {
    console.log(`${l.id} | ${l.title} | ${l.subTitle}`);
  }
});
