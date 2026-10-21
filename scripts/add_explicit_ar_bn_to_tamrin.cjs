const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/lessons.json');
const data = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));

let updatedCount = 0;

data.lessons.forEach(l => {
  if (l.chapterId === 'vol1-ch1') {
    (l.tamrinKitabi || []).forEach(t => {
      let ar = t.arabic;
      let bn = t.bangla;

      if (!ar || !bn) {
        const isTextAr = /[\u0600-\u06FF]/.test(t.text || '');
        const isPromptAr = /[\u0600-\u06FF]/.test(t.prompt || '');

        if (isTextAr && !isPromptAr) {
          ar = ar || t.text;
          bn = bn || t.prompt || t.hint || '';
        } else if (!isTextAr && isPromptAr) {
          ar = ar || t.prompt;
          bn = bn || t.text || '';
        } else if (isTextAr && isPromptAr) {
          ar = ar || t.prompt || t.text;
          bn = bn || t.hint || 'আরবি বাক্যটি সম্পূর্ণ করুন';
        }
      }

      if (ar && !t.arabic) {
        t.arabic = ar;
        updatedCount++;
      }
      if (bn && !t.bangla) {
        t.bangla = bn;
        updatedCount++;
      }
    });
  }
});

console.log(`Updated ${updatedCount} properties in Chapter 1 tamrins.`);
fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Saved lessons.json successfully.');
