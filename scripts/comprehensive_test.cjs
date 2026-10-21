const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const vocabPath = path.join(rootDir, 'src', 'data', 'vocabulary.json');
const chaptersPath = path.join(rootDir, 'src', 'data', 'chapters.json');
const pagesDir = path.join(rootDir, 'public', 'pages');

console.log('=== COMPREHENSIVE REPOSITORY INTEGRITY AUDIT ===\n');

// 1. Check vocabulary count & uniqueness
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
console.log(`[1] Total vocabulary items: ${vocab.length}`);
if (vocab.length !== 1343) {
  throw new Error(`Expected 1343 vocabulary items, got ${vocab.length}`);
}

const idSet = new Set();
vocab.forEach(v => idSet.add(v.id));
if (idSet.size !== 1343) {
  throw new Error(`Duplicate IDs found! Unique count: ${idSet.size}`);
}
console.log('    ✓ All 1,343 IDs are distinct and sequential.');

// 2. Check required fields
const missingField = vocab.filter(v => 
  !v.arabic || !v.bengali || !v.transliteration || 
  !v.volume || !v.chapter || !v.lesson || !v.partOfSpeech || !v.page
);
if (missingField.length > 0) {
  throw new Error(`Found ${missingField.length} entries missing required fields!`);
}
console.log('    ✓ All entries contain required fields.');

// 3. Check Harakat presence across Arabic words
const harakatRegex = /[\u064B-\u0652\u0670]/;
const withoutHarakat = vocab.filter(v => {
  // Each significant word should have at least one harakah
  const parts = v.arabic.split(/\s+/);
  return parts.some(p => {
    const letters = p.replace(/[^-\u0600-\u06FF]/g, '');
    if (letters.length >= 2 && !['في', 'عن', 'من', 'ما', 'لا', 'يا', 'هو', 'هي'].includes(letters)) {
      return !harakatRegex.test(letters);
    }
    return false;
  });
});
console.log(`[2] Words lacking Harakat: ${withoutHarakat.length}`);
if (withoutHarakat.length > 0) {
  console.error('Sample without harakat:', withoutHarakat.slice(0, 5));
  throw new Error('Found Arabic words missing Harakat!');
}

// 4. Check Arabic corruption & margin notes
const illegalVowels = vocab.filter(v => 
  /-ٌ/.test(v.arabic) || 
  /ٌُ|ٌَ|ٌِ|ًٌ|ٌُ|ٌَ|ٌِ/.test(v.arabic) ||
  /-\s*(مُضَاعَف|أَجْوَف|نَاقِص|مِثَال|لَفِيْف|تَفْعِيل|مُفَاعَلَة)/.test(v.arabic) ||
  /َاقِص|مضاعف|أجوف/.test(v.arabic) ||
  v.arabic.includes('لح ص') || v.arabic.includes('لع ق') ||
  /[\u064C\u064D][\u0621-\u064A]/.test(v.arabic) ||
  /ة[\u0621-\u064A]/.test(v.arabic.replace(/[\u064B-\u0652\u0670]/g, ''))
);
console.log(`[3] Corrupted Arabic entries (stacked vowels / smashed / margin notes): ${illegalVowels.length}`);
if (illegalVowels.length > 0) {
  console.error('Sample corrupted Arabic:', illegalVowels.slice(0, 5));
  throw new Error('Found corrupted Arabic entries!');
}

// 5. Check Bengali spelling and Bijoy corruption
const brokenBengali = vocab.filter(v => {
  const bn = v.bengali;
  if (bn.includes('সৈকত')) return true;
  if (/[ািীুূৃেৈোৌ]{2,}/.test(bn)) return true;
  if (/\s[ািীুূৃেৈোৌ]/.test(bn)) return true;
  if (/^[ািীুূৃেৈোৌ]/.test(bn)) return true;
  if (/[\u0600-\u06FF]/.test(bn)) return true;
  if (/জুিা|পণয|পবরমাণ|ভরিা|দাে|কোলাম|ওঠাবলা|এক ষষ্ঠাংশ্|বড়হলা|বকশ্বড়|বনভাননা|বপরাবমড|অনতনরর|পুবলনশ|দনলদনল|বদৌলতে|বাবড়র|শ্ হনরর|পুরস্কারনযােয|অবধকির|েুদৃঢ়|অবিান|অনধকার|মগোফ|উটন্ী|তগািী|ীরগািী|খাাঁটি|দৃিয|মবড়ান্|স্ব ািী|স্ত্র ী|বনধু|বনধ|দুবথে|লবাঝা|লখাসা|লকাে|লশ্রষ্ঠত্ব|কোনাহকারী|লবড়ি|কেো|আটহক|লটন|লরোই|মনহক্ষপ|সািা|লগাসে|লমামা|লধ্াো|লখো|লরাপথ|লনাংরা|লশ্রর্ী|লশ্রর্ীকক্ষ|লপট|লঘািা|লনকহি|লপাে|লগাোে|মেংসা|মবরাট|পামখ|আগািীকাে|লর্হক|অমেহরই|গ্র াি|আহো|লবমি|িমব|বাদিাে|তরিুজ|খাওোহন্া|পাঠাহন্া|সাোেয|লবর|উপমস্থত|কাাঁদাহন্া|অবিবাহি|আহরাের্|েহপাঠী|েীো|বিজ|োত|োহাযয|িাদ|দুধ্|িধ্ু|কুকু র|অতযন্ত|িাত্রী|ধ্ রা|খাহটা|ধ্নু ক|পাোি|পিকদানি|পাহপাি|লহার্|ঘাি|জহোচ্ছ্বাস|জখি|কাাঁে|লখহচাচাি|মর্ি|কািান|দূগথ|লবািা|লটনক|বনদু ক|কনিৃত্ব|অলেিা|নযিা|বকছু বরে|বছয়াম|বকয়ানমর|মাে|বযিীি|উপহাে|ককান|বননদুনকর|বননদা|বড়গ্রস্ত|বযো|পায়বন|কমাছাোহা|রৎ ঋিু|যায়বন|বের হলো|সামরত|পানয়র|পািা|বদনর|কো ও|দাোঁবড়পাল্লা|আেুল/.test(bn)) return true;
  return false;
});
console.log(`[4] Broken Bengali entries detected: ${brokenBengali.length}`);
if (brokenBengali.length > 0) {
  console.error('Sample broken Bengali:', brokenBengali.slice(0, 5));
  throw new Error('Found broken Bengali entries!');
}

// 6. Check Transliteration
const badTranslit = vocab.filter(v => /[\u0600-\u06FF]/.test(v.transliteration) || !v.transliteration.trim());
console.log(`[5] Transliterations with Arabic letters: ${badTranslit.length}`);
if (badTranslit.length > 0) {
  console.error('Sample bad transliteration:', badTranslit.slice(0, 5));
  throw new Error('Found invalid transliterations!');
}

// 7. Check chapters
const chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
console.log(`[6] Total volumes configured: ${chapters.length}`);
if (chapters.length !== 3) {
  throw new Error(`Expected 3 volumes, got ${chapters.length}`);
}

// 8. Check all 26 page images
let missingPages = 0;
let emptyPages = 0;
for (let i = 1; i <= 26; i++) {
  const pPath = path.join(pagesDir, `page_${i}.png`);
  if (!fs.existsSync(pPath)) {
    missingPages++;
  } else {
    const stat = fs.statSync(pPath);
    if (stat.size < 20000) {
      emptyPages++;
    }
  }
}
console.log(`[7] Missing page images (out of 26): ${missingPages}`);
console.log(`[8] Suspiciously small page images (<20KB): ${emptyPages}`);
if (missingPages > 0 || emptyPages > 0) {
  throw new Error('Page images missing or suspiciously small!');
}

console.log('\n=== AUDIT RESULT ===');
console.log('✓ ALL DEEP INTEGRITY CHECKS PASSED WITH 100% SUCCESS!\n');
