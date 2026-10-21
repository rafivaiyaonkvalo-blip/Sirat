const fs = require('fs');
const path = require('path');

const vocab = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vocabulary.json'), 'utf8'));

console.log('Total vocabulary items:', vocab.length);

const defects = [];

vocab.forEach(v => {
  const issues = [];
  const ar = v.arabic.trim();
  const bn = v.bengali.trim();
  const tr = v.transliteration.trim();

  // 1. Check transliteration: must not contain Arabic characters
  if (/[\u0600-\u06FF]/.test(tr)) {
    issues.push(`Transliteration contains Arabic: "${tr}"`);
  }
  if (!tr) {
    issues.push('Missing transliteration');
  }

  // 2. Check Arabic margin notes
  if (/-\s*(مُضَاعَف|أَجْوَف|نَاقِص|مِثَال|لَفِيْف|تَفْعِيل|مُفَاعَلَة)/.test(ar)) {
    issues.push(`Arabic contains margin note: "${ar}"`);
  }

  // 3. Tanween anomalies: e.g. "-ٌ" or stacked vowels "ٌُ", "ٌَ", "ٌِ", "ٌُ"
  if (/-ٌ/.test(ar) || /[ًٌٍَُِ][ًٌٍَُِ]/.test(ar.replace(/ّ[ًٌٍَُِ]/g, ''))) {
    issues.push(`Arabic contains illegal stacked vowels/tanween: "${ar}"`);
  }

  // 4. Smashed Arabic words:
  // (a) Tanween directly followed by an Arabic letter without space: e.g. "حجٌمبرور"
  if (/[\u064B-\u064D][\u0621-\u064A]/.test(ar)) {
    issues.push(`Arabic has smashed word after tanween: "${ar}"`);
  }
  // (b) Ta Marbuta (not followed by harakat) directly followed by an Arabic letter: e.g. "سِلْعَةسِلَعٌ"
  if (/ة[\u0621-\u064A]/.test(ar.replace(/[\u064B-\u0652\u0670]/g, ''))) {
    issues.push(`Arabic has smashed word after ta marbutah: "${ar}"`);
  }

  // 5. Corrupted OCR Arabic
  if (ar.includes('لح ص') || ar.includes('لع ق') || ar.includes('أُولئِكَذلك') || ar === 'أبغضٌ' || ar === 'وَضوء' || ar === 'أَرأيتٌ') {
    issues.push(`Arabic contains known corrupted OCR: "${ar}"`);
  }

  // 6. Bengali anomalies:
  // Dummy text
  if (bn.includes('সৈকত')) {
    issues.push(`Bengali contains dummy text "(সৈকত)": "${bn}"`);
  }
  // Known OCR typos
  if (/জুিা|পণয|পবরমাণ|ভরিা|দাে|কোলাম|ওঠাবলা|এক ষষ্ঠাংশ্|বড়হলা|বকশ্বড়|বনভাননা|বপরাবমড|অনতনরর|পুবলনশ|দনলদনল|বদৌলতে|বাবড়র|শ্ হনরর|পুরস্কারনযােয|অবধকির|েুদৃঢ়|অবিান|অনধকার|মগোফ|উটন্ী|তগািী|ীরগািী|খাাঁটি|দৃিয|মবড়ান্|স্ব ািী|স্ত্র ী|বনধু|বনধ|দুবথে|লবাঝা|লখাসা|লকাে|লশ্রষ্ঠত্ব|কোনাহকারী|লবড়ি|কেো|আটহক|লটন|লরোই|মনহক্ষপ|সািা|লগাসে|লমামা|লধ্াো|লখো|লরাপথ|লনাংরা|লশ্রর্ী|লশ্রর্ীকক্ষ|লপট|লঘািা|লনকহি|লপাে|লগাোে|মেংসা|মবরাট|পামখ|আগািীকাে|লর্হক|অমেহরই|গ্র াি|আহো|লবমি|িমব|বাদিাে|তরিুজ|খাওোহন্া|পাঠাহন্া|সাোেয|লবর|উপমস্থত|কাাঁদাহন্া|অবিবাহি|আহরাের্|েহপাঠী|েীো|বিজ|োত|োহাযয|িাদ|দুধ্|িধ্ু|কুকু র|অতযন্ত|িাত্রী|ধ্ রা|খাহটা|ধ্নু ক|পাোি|পিকদানি|পাহপাি|লহার্|ঘাি|জহোচ্ছ্বাস|জখি|কাাঁে|লখহচাচাি|মর্ি|কািান|দূগথ|লবািা|লটনক|বনদু ক/.test(bn)) {
    issues.push(`Bengali contains known OCR corruption: "${bn}"`);
  }
  // Consecutive Bengali vowel marks
  if (/[ািীুূৃেৈোৌ]{2,}/.test(bn)) {
    issues.push(`Bengali contains consecutive vowel signs: "${bn}"`);
  }
  // Isolated vowel mark after space
  if (/\s[ািীুূৃেৈোৌ]/.test(bn)) {
    issues.push(`Bengali contains isolated vowel sign after space: "${bn}"`);
  }

  if (issues.length > 0) {
    defects.push({ id: v.id, page: v.page, ar, bn, tr, issues });
  }
});

console.log(`REAL DEFECTS DETECTED: ${defects.length}`);
if (defects.length > 0) {
  defects.forEach(d => console.log(`[ID ${d.id} P${d.page}] (${d.ar} => ${d.bn} [${d.tr}]): ${d.issues.join(', ')}`));
}
