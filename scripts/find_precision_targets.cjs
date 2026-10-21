const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

const targets = [];

vocab.forEach(item => {
  const hasLeadingHarakat = /^[ٌََُِّْ]/.test(item.arabic);
  const hasCorruptBn = /[োমবকেিঘমিিাতাহন্ন্িহমবমকমি]/.test(item.bengali) && 
    (item.bengali.includes('লকননা') || item.bengali.includes('সনধযাে') || item.bengali.includes('অনধকার') || item.bengali.includes('মনশ্চে') || item.bengali.includes('েেত') || item.bengali.includes('কর্া') || item.bengali.includes('বো') || item.bengali.includes('োওো') || item.bengali.includes('পূর্থ') || item.bengali.includes('আলোেনা') || item.bengali.includes('আল্লাে') || item.bengali.includes('মগোফ') || item.bengali.includes('োাঁ'));

  if (hasLeadingHarakat || hasCorruptBn) {
    targets.push({ id: item.id, ar: item.arabic, bn: item.bengali });
  }
});

console.log(`Found ${targets.length} items needing precision mapping:`);
targets.forEach(t => console.log(`${t.id}: { ar: '${t.ar}', bn: '${t.bn}' },`));
