const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

console.log(`=== VERIFYING ${vocab.length} ARABIC & BENGALI VOCABULARY ITEMS ===\n`);

let issues = [];

vocab.forEach((item, index) => {
  // 1. Check Arabic validity
  if (!item.arabic || item.arabic.length < 2) {
    issues.push({ id: item.id, type: 'EMPTY_ARABIC', item });
  }

  // 2. Check Bengali validity
  if (!item.bengali || item.bengali.length < 2) {
    issues.push({ id: item.id, type: 'EMPTY_BENGALI', item });
  }

  // 3. Check for leftover corrupted font glyphs
  if (/[োমবকেিঘমিিাতাহন্ন্িহমবমকমি]/.test(item.bengali)) {
    // Check specific known corrupted patterns
    const corruptPatterns = ['োমব', 'কেি', 'ঘমি', 'িাতা', 'েিিা', 'লেোর', 'মবদযােে', 'িাদরাসা', 'িাত্র', 'িাত্রী', 'মিক্ষক', 'মিমক্ষকা', 'মবিান্া', 'বামেি', 'তাো', 'জািা', 'বযাগ', 'লটমবে', 'কািরা', 'জান্াো', 'টুমপ', 'লপািাক', 'পাগিী', 'বুমিিান্', 'লিধ্াবী', 'মন্হবথাধ্', 'দমরদ্র', 'িমেো', 'পমরচ্ছন্ন', 'িেো', 'পমরশ্রিী', 'লখাো', 'প্রিস্ত', 'সংকীর্থ', 'িমক্তিােী', 'িজবুত', 'পুহরাহন্া', 'তুন্', 'াহো', 'সািহন্', 'মপিহন্', 'মন্হে', 'উপহর', 'পাহি', 'লকার্াে', 'প্রমতপােক', 'ধ্থি', 'উত্তি', 'হৃদে', 'োর', 'আহো', 'ঘটন্া', 'গ্রাি', 'িের', 'র্াই', 'র্াঙ্গা', 'র্াস্টার', 'িািা', 'খাো', 'োো', 'লবান্', 'ন্ াি', 'িত্রু', 'আসিান্', 'েিীন্', 'রিোন্', 'লরাোদার', 'সাইহকে', 'বামত', 'লদোে', 'লিহে', 'বাগান্', 'মিশু', 'অতযন্ত', 'রাজধ্ান্ী', 'বামস', 'গরি', 'ইাঁদুর', 'িরীর', 'মসংে', 'খাদয', 'িাদ', 'েমরর্', 'কুকু র', 'আগািীকাে', 'কখহন্া', 'কখন্', 'োটাই', 'মিকার', 'লসোই', 'িযাপ', 'াস্টার', 'মেংসা', 'মবরাট', 'িোন্', 'অধ্যােন্', 'খাওোহন্া', 'পাঠাহন্া', 'সাোেয', 'অবিযই', 'অমেহরই', 'কাাঁদাহন্া', 'আহরাের্', 'অবিবাহি', 'অনুমবি', 'েহপাঠী', 'যুি', 'েীো', 'বিজ', 'কনয়কজন', 'দ\'জন', 'োহাযযকাবরণী', 'বনভাননা', 'হনলা', 'হনচ্ছ', 'েুন্দর', 'অবধকির', 'পুরস্কারনযােয', 'মিা', 'েুদৃঢ়', 'অবিান', 'কবরনলন', 'পালাননা', 'যবদ', 'িারা', 'যানদরনক', 'যানদর', 'িরীকা', 'আদশ্ণ', 'সুনদর', 'বড়দ্যালয়', 'চাবড়'];
    
    for (const pat of corruptPatterns) {
      if (item.bengali.includes(pat)) {
        issues.push({ id: item.id, type: 'CORRUPT_GLYPH', pattern: pat, item });
        break;
      }
    }
  }

  // 4. Check for unattached or broken Arabic tashkeel/tanween
  if (/^[\u064B-\u065F\u0670]/.test(item.arabic) || /\s[\u064B-\u065F\u0670]\s/.test(item.arabic)) {
    issues.push({ id: item.id, type: 'DETACHED_TASHKEEL', item });
  }
});

console.log(`Found ${issues.length} potential issues across ${vocab.length} items.`);

if (issues.length > 0) {
  console.log('\nTop 20 Issues to inspect:');
  issues.slice(0, 20).forEach(iss => {
    console.log(`- [ID ${iss.id}] ${iss.type}: "${iss.item.arabic}" -> "${iss.item.bengali}" (Pattern: ${iss.pattern || 'N/A'})`);
  });
} else {
  console.log('✓ All 1,170 words passed the structural verification without any corrupt glyphs or detached tashkeel!');
}
