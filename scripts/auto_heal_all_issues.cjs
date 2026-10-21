const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
let vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));

// Specific known dictionary fixes for all 45 items found in verification
const FIX_ITEMS = {
  78: { ar: 'هَلْ', bn: 'কী? (হ্যাঁ/না প্রশ্ন)', tr: 'Hal', pos: 'প্রশ্নবোধক' },
  80: { ar: 'نَعَمْ', bn: 'হ্যাঁ', tr: 'Na\'am', pos: 'অব্যয়' },
  83: { ar: 'بَلْ', bn: 'বরং', tr: 'Bal', pos: 'অব্যয়' },
  103: { ar: 'مَسَّاحَةٌ', bn: 'ডাস্টার', tr: 'Massahah', pos: 'বিশেষ্য' },
  261: { ar: 'غِلَافٌ', bn: 'গিলাফ / মলাট', tr: 'Ghilaf', pos: 'বিশেষ্য' },
  306: { ar: 'لِأَنَّ', bn: 'কেননা / কারণ', tr: 'Li-anna', pos: 'অব্যয়' },
  312: { ar: 'لِأَنِّي / لِأَنَّنِي', bn: 'কেননা আমি', tr: 'Li-annee', pos: 'অব্যয়' },
  321: { ar: 'مَسَاءً', bn: 'সন্ধ্যায়', tr: 'Masa\'an', pos: 'ক্রিয়াবিশেষণ' },
  332: { ar: 'النُّزُوْلُ (ض)', bn: 'নামা / অবতরণ করা', tr: 'An-Nuzool', pos: 'ক্রিয়া/মাসদার' },
  403: { ar: 'الْإِجْلَاسُ', bn: 'বসানো', tr: 'Al-Ijlas', pos: 'ক্রিয়া/মাসদার' },
  411: { ar: 'الظَّلَامُ', bn: 'অন্ধকার', tr: 'Az-Zalam', pos: 'বিশেষ্য' },
  421: { ar: 'مِمَّ', bn: 'কী থেকে? (মিনের সংক্ষেপ)', tr: 'Mimma', pos: 'প্রশ্নবোধক' },
  426: { ar: 'إِنَّ', bn: 'নিশ্চয়', tr: 'Inna', pos: 'অব্যয়' },
  428: { ar: 'لَعَلَّ', bn: 'হয়তো / যেন', tr: 'La\'alla', pos: 'অব্যয়' },
  466: { ar: 'الْكَلَامُ', bn: 'কথা বলা', tr: 'Al-Kalam', pos: 'ক্রিয়া/মাসদার' },
  535: { ar: 'الطَّلَبُ (ن)', bn: 'চাওয়া / দাবি করা', tr: 'At-Talab', pos: 'ক্রিয়া/মাসদার' },
  539: { ar: 'الْمَلْءُ (ف)', bn: 'পূর্ণ করা / ভরা', tr: 'Al-Mal\'', pos: 'ক্রিয়া/মাসদার' },
  541: { ar: 'الذِّكْرُ (ن)', bn: 'স্মরণ করা / আলোচনা করা', tr: 'Adh-Dhikr', pos: 'ক্রিয়া/মাসদার' },
  547: { ar: 'بِإِذْنِ اللَّهِ', bn: 'আল্লাহর হুকুমে', tr: 'Bi-idhnillah', pos: 'বাক্যাংশ' }
};

// General healing function for all items
vocab = vocab.map(item => {
  // If in direct fix dictionary
  if (FIX_ITEMS[item.id]) {
    return {
      ...item,
      ...FIX_ITEMS[item.id]
    };
  }

  let ar = item.arabic.trim();
  let bn = item.bengali.trim();

  // Fix detached leading harakat on Arabic
  ar = ar.replace(/^[ٌََُِّْ\s]+/, '').trim();
  // Fix detached tanween in middle of arabic
  ar = ar.replace(/\s*[ٌََُِّْ]\s*/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Clean multiple 'ড' on ডাস্টার
  bn = bn.replace(/ড+াস্টার/g, 'ডাস্টার');

  // Fix general Bengali broken characters
  bn = bn.replace(/োাঁ/g, 'হ্যাঁ')
         .replace(/লকননা/g, 'কেননা')
         .replace(/আশি/g, 'আমি')
         .replace(/সনধযাে/g, 'সন্ধ্যায়')
         .replace(/মনশ্চে/g, 'নিশ্চয়')
         .replace(/েেত/g, 'হয়তো')
         .replace(/িন েে/g, 'যেন')
         .replace(/কর্া/g, 'কথা')
         .replace(/বো/g, 'বলা')
         .replace(/োওো/g, 'চাওয়া')
         .replace(/পূর্থ/g, 'পূর্ণ')
         .replace(/আলোেনা/g, 'আলোচনা')
         .replace(/আল্লাে - র/g, 'আল্লাহর')
         .replace(/হুকু হি/g, 'হুকুমে')
         .replace(/মগোফ/g, 'গিলাফ')
         .replace(/অনধকার/g, 'অন্ধকার');

  return {
    ...item,
    arabic: ar,
    bengali: bn
  };
});

fs.writeFileSync(vocabPath, JSON.stringify(vocab, null, 2), 'utf-8');
console.log('Auto-healed all vocabulary items!');
