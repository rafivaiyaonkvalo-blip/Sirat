const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'), 'utf8'));

const flagged = [];

vocab.forEach((item, index) => {
  const ar = item.arabic;
  const bn = item.bengali;
  const reasons = [];

  // Arabic checks
  if (/اإل/.test(ar)) reasons.push('Arabic: Hamza-before-Lam (اإل)');
  if (/اقص|مهموز|مثال|أجوف|لفيف|تفعيل/.test(ar)) reasons.push('Arabic: grammar term attached');
  if (/[\.|\(|\)|﴾|﴿|…|\?|\!|:|,|;|ـ]/.test(ar) && !ar.includes(' / ') && !ar.includes(' - ')) reasons.push('Arabic: unwanted punctuation');
  if (!/[\u064B-\u0652\u0670]/.test(ar)) reasons.push('Arabic: missing harakat');
  if (/[a-zA-Z]/.test(ar)) reasons.push('Arabic: latin letters');
  if (/[০-৯0-9]/.test(ar)) reasons.push('Arabic: numerals');
  if (/[\u0980-\u09FF]/.test(ar)) reasons.push('Arabic: Bengali letters in Arabic');

  // Bengali checks
  if (/ক[ক-হ]/.test(bn) && !/কত|কখন|কখনো|কখনই|কখনবা|কখনকার|কখনও|কখনথেকে|কখনপর্যন্ত|কখনইনা|কখনি/.test(bn)) {
    // Check if real Bengali word like 'কখন', 'কত', 'কপাল', etc.
    const cleanWords = ['কত', 'কখন', 'কখনো', 'কখনই', 'কঠিন', 'কখনও', 'কখনইনা', 'কখনপর্যন্ত', 'কখনকার', 'কপাল', 'কলম', 'কদম', 'কবুল', 'কবরে', 'কবর', 'কখনওনা', 'কখনোনা', 'কচি', 'কখনও-সখনও', 'কখনো কখনো', 'কতটা', 'কতগুলো', 'কতখানি', 'কখনো-সখনো', 'কখনো-কখনো'];
    const words = bn.split(/[\s,./()/-]+/);
    const hasSuspect = words.some(w => /^ক[ক-হ]/.test(w) && !cleanWords.includes(w));
    if (hasSuspect) reasons.push('Bengali: Bijoy e-kar Ka-consonant (' + words.filter(w => /^ক[ক-হ]/.test(w) && !cleanWords.includes(w)).join(', ') + ')');
  }

  if (/ব[প-ভ]|বড়[হ-য়]|মস্থ|াননা|েননা|জাে|জাগ্রি|উিার|ববলুপ্ত|কনভ|ছড়াননা|কাাঁদ|খরে|আনুগতয|অপিান|ওিানা|সংহিা|কোমরাহ|বাবহি|বপরা|কদয়া|রাবত্র|অননয|কপৌোঁ|চু হওয়া|পে প্র|বণণ|ববপ|মুবছ|ছবড়|করাে|কস্বচ্ছা|লাবড়ি|দবণল|অেুিিা|ঘুনম|পরামশ্ণ|আনলাচনা|ককয়াশি|উপনদশ্|কক্ষপে|পববত্রিা|পবরহার|বননজর|কমামরা|করাধকারী|কহদায়াি|চবরনত্রর|পথদা|কধাোঁয়া|বনশুধু|অবভভাবক|ককাটনা|ককামলিা|উল্লাে|কদখনি|অপছনদ|প্র নবশ্|ভাঙা|কভনে|আকৃবড়|বৃবড়|অবড়বাবহি|অবড়ান|বনকটবড়ী|ববধ্বস্ত/.test(bn)) {
    reasons.push('Bengali: OCR corruption pattern');
  }

  if (reasons.length > 0) {
    flagged.push({ id: item.id, page: item.page, ar: item.arabic, bn: item.bengali, tr: item.transliteration, reasons });
  }
});

console.log(`Total flagged entries: ${flagged.length} out of ${vocab.length}`);
fs.writeFileSync(path.join(__dirname, 'flagged_entries.json'), JSON.stringify(flagged, null, 2), 'utf8');
console.log('Saved to scripts/flagged_entries.json');
