const fs = require('fs');
const path = require('path');

const flagged = JSON.parse(fs.readFileSync(path.join(__dirname, 'flagged_entries.json'), 'utf8'));

// Filter out false positives from Bengali
const falsePositiveWords = new Set([
  'কক্ষ', 'ভাঙা', 'কণ্ঠহার', 'কম', 'কল্যাণ', 'কখন', 'কখনো', 'কখনই', 'কঠিন', 'কখনও',
  'কপাল', 'কলম', 'কবর', 'কচি', 'কত', 'কখনওনা', 'কদম', 'কবুল', 'কতটা', 'কতগুলো', 'কতখানি',
  'কখনো কখনো', 'কখনো-সখনো', 'কখনো-কখনো', 'কষ্ট', 'কবিতা', 'কখনকার'
]);

const genuineIssues = [];

flagged.forEach(item => {
  const realReasons = [];
  
  item.reasons.forEach(r => {
    if (r.startsWith('Bengali: Bijoy e-kar Ka-consonant')) {
      // extract word
      const m = r.match(/\((.*?)\)/);
      if (m) {
        const words = m[1].split(', ').map(w => w.trim());
        const hasRealIssue = words.some(w => !falsePositiveWords.has(w));
        if (hasRealIssue) realReasons.push(r);
      } else {
        realReasons.push(r);
      }
    } else if (r === 'Bengali: OCR corruption pattern' && item.bn === 'ভাঙা') {
      // false positive from /ভাঙা/ pattern
    } else {
      realReasons.push(r);
    }
  });

  if (realReasons.length > 0) {
    genuineIssues.push({ ...item, reasons: realReasons });
  }
});

console.log(`Genuine issues remaining: ${genuineIssues.length}`);
fs.writeFileSync(path.join(__dirname, 'genuine_issues.json'), JSON.stringify(genuineIssues, null, 2), 'utf8');
console.log('Saved to scripts/genuine_issues.json');
