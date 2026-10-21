const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

// Phonetic transliteration generator for Arabic
function transliterateArabic(ar) {
  if (!ar) return '';
  
  // Clean special characters
  let clean = ar.replace(/[()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Custom manual overrides for common compound words and plurals
  const overrides = {
    'هٰذَا - هٰذِهِ': 'Haadhaa / Haadhihi',
    'هذا -ٌهذه': 'Haadhaa / Haadhihi',
    'ذٰلِكَ - تِلْكَ': 'Dhaalika / Tilka',
    'أُولئِكَذلك،ٌتلكٌ': 'Ulaa\'ika (Dhaalika, Tilka)',
    'أُولَئِكَ (ذٰلِكَ، تِلْكَ)': 'Ulaa\'ika (Dhaalika, Tilka)',
    'أُولَئِكَ': 'Ulaa\'ika',
    'لح صٌ': 'Nazzaarah',
    'نَظَّارَةٌ': 'Nazzaarah',
    'لع قٌ': 'Riqqah',
    'رِقَّةٌ': 'Riqqah',
    'الطَّمَعٌيٌ': 'At-Tama\'',
    'اَلطَّمَعُ': 'At-Tama\'',
    'المجالَسَةٌ': 'Al-Majaalasah',
    'اَلْمُجَالَسَةُ': 'Al-Majaalasah',
    'الغَلَبَةٌُ': 'Al-Ghalabah',
    'اَلْغَلَبَةُ': 'Al-Ghalabah',
    'عَبْدٌعُبَّادٌ': 'Abd (pl. Ibaad)',
    'عَبْدٌ (ج: عِبَادٌ)': 'Abd (pl. Ibaad)',
    'سِلْعَةسِلَعٌ': 'Sil\'ah (pl. Sila\')',
    'سِلْعَةٌ (ج: سِلَعٌ)': 'Sil\'ah (pl. Sila\')',
    'نَعْلنِعالٌ': 'Na\'l (pl. Ni\'aal)',
    'نَعْلٌ (ج: نِعَالٌ)': 'Na\'l (pl. Ni\'aal)',
    'خَطِيْئَةٌخَطايا': 'Khatii\'ah (pl. Khataayaa)',
    'خَطِيْئَةٌ (ج: خَطَايَا)': 'Khatii\'ah (pl. Khataayaa)',
    'مِثْقال ٌُذَرَّةٌ': 'Mithqaalu Dharrah',
    'مِثْقَالُ ذَرَّةٍ': 'Mithqaalu Dharrah',
    'حجٌمبرور': 'Hajjun Mabroor',
    'حَجٌّ مَبْرُوْرٌ': 'Hajjun Mabroor',
    'نَضَح ٌَالماء': 'Nadah al-Maa\'',
    'نَضَحَ الْمَاءُ': 'Nadah al-Maa\'',
    'شَرَفٌ': 'Sharaf',
    'التَّراحُمٌ': 'At-Taraahum',
    'اَلتَّرَاحُمُ': 'At-Taraahum',
    'مَجيدٌ': 'Majeed',
    'مَجِيْدٌ': 'Majeed',
    'كِبْرٌ': 'Kibr',
    'فُسوقٌ': 'Fusooq',
    'فُسُوْقٌ': 'Fusooq',
    'رَوْحٌ': 'Rawh',
    'الظُّفْرٌ': 'Az-Zufr',
    'اَلظُّفْرُ': 'Az-Zufr',
    'دَرَنٌ': 'Daran',
    'أبغضٌ': 'Abghad',
    'أَبْغَضُ': 'Abghad',
    'فَوْجٌ': 'Fawj',
    'أَفْوَاجًا': 'Afwaajan',
    'العَجْزٌ': 'Al-\'Ajz',
    'اَلْعَجْزُ': 'Al-\'Ajz',
    'وَضوء': 'Wudoo\'',
    'وَضُوْءٌ': 'Wudoo\'',
    'سُدُسٌ': 'Sudus',
    'أَرأيتٌ': 'Ara\'ayta',
    'أَرَأَيْتَ': 'Ara\'ayta',
    'اَلْغَشُّ': 'Al-Ghashsh',
    'اَلسَّبُّ': 'As-Sabb',
    'رِفْقٌ': 'Rifq',
    'ثَمَرَةُ الْفُؤَادِ': 'Thamarātul Fu\'ād',
    'فِيْ نَفْسِهِ': 'Fee Nafsihi',
    'اَلْبَذَاذَةُ': 'Al-Badhādhah',
    'اَلنُّقْصَانُ': 'An-Nuqsān',
    'دَلَّ عَلَى شَيْءٍ': 'Dalla \'Alā Shay\'in',
    'اَلسَّلَامَةُ': 'As-Salāmah',
    'نَمَّامٌ': 'Nammām',
    'رَعِيَّةٌ': 'Ra\'iyyah',
    'إِيَّاكُمْ وَالْحَسَدَ': 'Iyyākum Wal-Hasad',
    'حُسْنُ الْخُلُقِ': 'Husnul Khuluq',
    'اَلشَّمَاتَةُ': 'Ash-Shamātah',
    'اَلْعِيَادَةُ': 'Al-\'Iyādah',
    'اَلِاسْتِعَاذَةُ': 'Al-Isti\'ādhah',
    'اَلْكَرْهُ': 'Al-Karh',
    'اَلْوُلُوْجُ': 'Al-Wulooj',
    'كَأَنَّمَا': 'Ka\'annamā',
    'التَّبَعٌُ': 'At-Taba\'',
    'اَلتَّبَعُ': 'At-Taba\''
  };

  if (overrides[ar.trim()]) return overrides[ar.trim()];

  // Algorithmic phonetic transliteration
  const charMap = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ٱ': 'a',
    'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
    'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': '\'', 'غ': 'gh',
    'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h',
    'ء': '\'', 'ئ': '\'', 'ؤ': '\'', 'لا': 'la'
  };

  const vowelMap = {
    '\u064E': 'a', // Fatha
    '\u064F': 'u', // Damma
    '\u0650': 'i', // Kasra
    '\u064B': 'an', // Fathatan
    '\u064C': 'un', // Dammatan
    '\u064D': 'in', // Kasratan
    '\u0670': 'aa' // Dagger alif
  };

  const words = clean.split(/\s+/);
  const resultWords = [];

  for (const word of words) {
    if (overrides[word]) {
      resultWords.push(overrides[word]);
      continue;
    }

    let trWord = '';
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (charMap[ch] !== undefined) {
        let base = charMap[ch];
        // Check for shaddah
        if (i + 1 < word.length && word[i + 1] === '\u0651') {
          base += base;
        }
        trWord += base;
      } else if (vowelMap[ch] !== undefined) {
        trWord += vowelMap[ch];
      }
    }
    // Clean up double vowels or trailing 'h' for ta marbutah
    trWord = trWord.replace(/a{3,}/g, 'aa')
                   .replace(/u{3,}/g, 'uu')
                   .replace(/i{3,}/g, 'ii')
                   .replace(/'+/g, '\'')
                   .trim();
                   
    if (trWord) {
      // Capitalize first letter
      resultWords.push(trWord.charAt(0).toUpperCase() + trWord.slice(1));
    }
  }

  const finalStr = resultWords.join(' ').trim();
  return finalStr || 'Kalimah';
}

// 2. Comprehensive vocabulary healing dictionary for known errors
const EXACT_PATCH = {
  20: {
    ar: 'هٰذَا - هٰذِهِ',
    bn: 'ইহা (এটি)',
    tr: 'Haadhaa / Haadhihi',
    pos: 'সর্বনাম'
  },
  780: {
    ar: 'عَادَةٌ',
    bn: 'অভ্যাস',
    tr: '\'Aadah',
    pos: 'বিশেষ্য'
  },
  795: {
    ar: 'اَلْعَوْدُ',
    bn: 'ফেরা / প্রত্যাবর্তন করা',
    tr: 'Al-\'Awd',
    pos: 'ক্রিয়া / মাসদার'
  },
  796: {
    ar: 'نَظَّارَةٌ',
    bn: 'একটি চশমা',
    tr: 'Nazzaarah',
    pos: 'বিশেষ্য'
  },
  798: {
    ar: 'اَلطَّمَعُ',
    bn: 'লোভ করা',
    tr: 'At-Tama\'',
    pos: 'ক্রিয়া / মাসদার'
  },
  800: {
    ar: 'اَلْمُجَالَسَةُ',
    bn: 'ওঠাবসা করা',
    tr: 'Al-Majaalasah',
    pos: 'ক্রিয়া / মাসদার'
  },
  802: {
    ar: 'أُولَئِكَ (ذٰلِكَ، تِلْكَ)',
    bn: 'ওরা, তারা (ঐ ব্যক্তিরা)',
    tr: 'Ulaa\'ika (Dhaalika, Tilka)',
    pos: 'সর্বনাম'
  },
  808: {
    ar: 'اَلْفَيْضُ',
    bn: 'উথলে ওঠা / প্রবাহিত হওয়া',
    tr: 'Al-Fayd',
    pos: 'ক্রিয়া / মাসদার'
  },
  810: {
    ar: 'اَلْإِجَادَةُ',
    bn: 'সুন্দরভাবে সম্পন্ন করা / পারদর্শী হওয়া',
    tr: 'Al-Ijaadah',
    pos: 'ক্রিয়া / মাসদার'
  },
  927: {
    ar: 'عَبْدٌ (ج: عِبَادٌ)',
    bn: 'দাস, গোলাম',
    tr: 'Abd (pl. Ibaad)',
    pos: 'বিশেষ্য'
  },
  929: {
    ar: 'رِقَّةٌ',
    bn: 'দয়া, কোমলতা',
    tr: 'Riqqah',
    pos: 'বিশেষ্য'
  },
  932: {
    ar: 'اَلْغَلَبَةُ',
    bn: 'কাবু করা, পরাস্ত করা',
    tr: 'Al-Ghalabah',
    pos: 'ক্রিয়া / মাসদার'
  },
  978: {
    ar: 'طَاهِرٌ',
    bn: 'পবিত্র',
    tr: 'Taahir',
    pos: 'গুণবাচক'
  },
  980: {
    ar: 'اَلدَّوَامُ',
    bn: 'স্থায়িত্ব / সর্বদা থাকা',
    tr: 'Ad-Dawaam',
    pos: 'ক্রিয়া / মাসদার'
  },
  1045: {
    ar: 'كَبِيْرَةٌ',
    bn: 'বড় (স্ত্রীবাচক)',
    tr: 'Kabeerah',
    pos: 'গুণবাচক'
  },
  1046: {
    ar: 'صَغِيْرَةٌ',
    bn: 'ছোট (স্ত্রীবাচক)',
    tr: 'Sagheerah',
    pos: 'গুণবাচক'
  },
  1047: {
    ar: 'طَوِيْلَةٌ',
    bn: 'লম্বা (স্ত্রীবাচক)',
    tr: 'Taweelah',
    pos: 'গুণবাচক'
  },
  1048: {
    ar: 'قَصِيْرَةٌ',
    bn: 'খাটো (স্ত্রীবাচক)',
    tr: 'Qaseerah',
    pos: 'গুণবাচক'
  },
  1049: {
    ar: 'جَمِيْلَةٌ',
    bn: 'সুন্দর (স্ত্রীবাচক)',
    tr: 'Jameelah',
    pos: 'গুণবাচক'
  },
  1050: {
    ar: 'قَبِيْحَةٌ',
    bn: 'কুৎসিত (স্ত্রীবাচক)',
    tr: 'Qabeehah',
    pos: 'গুণবাচক'
  },
  1051: {
    ar: 'نَظِيْفَةٌ',
    bn: 'পরিচ্ছন্ন (স্ত্রীবাচক)',
    tr: 'Nadheefah',
    pos: 'গুণবাচক'
  },
  1052: {
    ar: 'وَسِخَةٌ',
    bn: 'নোংরা (স্ত্রীবাচক)',
    tr: 'Wasikhah',
    pos: 'গুণবাচক'
  },
  1053: {
    ar: 'جَدِيْدَةٌ',
    bn: 'নতুন (স্ত্রীবাচক)',
    tr: 'Jadeedah',
    pos: 'গুণবাচক'
  },
  1054: {
    ar: 'قَدِيْمَةٌ',
    bn: 'পুরোনো (স্ত্রীবাচক)',
    tr: 'Qadeemah',
    pos: 'গুণবাচক'
  },
  1084: {
    ar: 'فَضْلٌ عَظِيْمٌ',
    bn: 'মহা অনুগ্রহ / বিরাট দান',
    tr: 'Fadlun \'Adheem',
    pos: 'বিশেষ্য'
  },
  1119: {
    ar: 'اَلتَّبَعُ',
    bn: 'অনুসরণ করা',
    tr: 'At-Taba\'',
    pos: 'ক্রিয়া / মাসদার'
  },
  1122: {
    ar: 'حَجٌّ مَبْرُوْرٌ',
    bn: 'মকবুল হজ',
    tr: 'Hajjun Mabroor',
    pos: 'বিশেষ্য'
  },
  1125: {
    ar: 'وَضُوْءٌ',
    bn: 'অযুর পানি / অযু',
    tr: 'Wudoo\'',
    pos: 'বিশেষ্য'
  },
  1126: {
    ar: 'سُدُسٌ',
    bn: 'এক ষষ্ঠাংশ (ছয় ভাগের এক ভাগ)',
    tr: 'Sudus',
    pos: 'বিশেষ্য'
  },
  1127: {
    ar: 'أَرَأَيْتَ',
    bn: '(ভাবার্থ) আচ্ছা, বলুন তো!',
    tr: 'Ara\'ayta',
    pos: 'ক্রিয়া'
  },
  1128: {
    ar: 'نَضَحَ الْمَاءُ',
    bn: 'পানি ছিটিয়ে দিল',
    tr: 'Nadah al-Maa\'',
    pos: 'ক্রিয়া'
  },
  1133: {
    ar: 'شَرَفٌ',
    bn: 'মর্যাদা, সম্ভ্রম, আভিজাত্য',
    tr: 'Sharaf',
    pos: 'বিশেষ্য'
  },
  1135: {
    ar: 'سِلْعَةٌ (ج: سِلَعٌ)',
    bn: 'পণ্য, বিক্রয়যোগ্য সামগ্রী',
    tr: 'Sil\'ah (pl. Sila\')',
    pos: 'বিশেষ্য'
  },
  1138: {
    ar: 'اَلتَّرَاحُمُ',
    bn: 'পরস্পর দয়া / অনুগ্রহ করা',
    tr: 'At-Taraahum',
    pos: 'ক্রিয়া / মাসদার'
  },
  1141: {
    ar: 'مَجِيْدٌ',
    bn: 'গৌরবের অধিকারী, সম্মানিত',
    tr: 'Majeed',
    pos: 'গুণবাচক'
  },
  1144: {
    ar: 'مِثْقَالُ ذَرَّةٍ',
    bn: 'কণা পরিমাণ / অণু পরিমাণ',
    tr: 'Mithqaalu Dharrah',
    pos: 'বিশেষ্য'
  },
  1146: {
    ar: 'كِبْرٌ',
    bn: 'অহংকার',
    tr: 'Kibr',
    pos: 'বিশেষ্য'
  },
  1153: {
    ar: 'فُسُوْقٌ',
    bn: 'পাপাচার / অবাধ্যতা',
    tr: 'Fusooq',
    pos: 'বিশেষ্য'
  },
  1156: {
    ar: 'نَعْلٌ (ج: نِعَالٌ)',
    bn: 'জুতা / পাদুকা',
    tr: 'Na\'l (pl. Ni\'aal)',
    pos: 'বিশেষ্য'
  },
  1157: {
    ar: 'اَلْغَشُّ',
    bn: 'ধোঁকা দেওয়া / প্রতারণা করা',
    tr: 'Al-Ghashsh',
    pos: 'ক্রিয়া / মাসদার'
  },
  1161: {
    ar: 'رَوْحٌ',
    bn: 'অনুগ্রহ, করুণা, প্রশান্তি',
    tr: 'Rawh',
    pos: 'বিশেষ্য'
  },
  1163: {
    ar: 'اَلظُّفْرُ',
    bn: 'নখ',
    tr: 'Az-Zufr',
    pos: 'বিশেষ্য'
  },
  1164: {
    ar: 'اَلسَّبُّ',
    bn: 'গালি দেওয়া / কটূক্তি করা',
    tr: 'As-Sabb',
    pos: 'ক্রিয়া / মাসদার'
  },
  1165: {
    ar: 'دَرَنٌ',
    bn: 'ময়লা / আবর্জনা',
    tr: 'Daran',
    pos: 'বিশেষ্য'
  },
  1167: {
    ar: 'خَطِيْئَةٌ (ج: خَطَايَا)',
    bn: 'পাপসমূহ / গুনাহ',
    tr: 'Khatii\'ah (pl. Khataayaa)',
    pos: 'বিশেষ্য'
  },
  1168: {
    ar: 'أَبْغَضُ',
    bn: 'ঘৃণ্যতম (সবচেয়ে অপছন্দনীয়)',
    tr: 'Abghad',
    pos: 'গুণবাচক'
  }
};

let cleanedCount = 0;

const healedVocab = vocab.map(item => {
  let ar = item.arabic;
  let bn = item.bengali;
  let tr = item.transliteration;
  let pos = item.partOfSpeech;

  // If exact patch exists
  if (EXACT_PATCH[item.id]) {
    const patch = EXACT_PATCH[item.id];
    ar = patch.ar;
    bn = patch.bn;
    tr = patch.tr;
    if (patch.pos) pos = patch.pos;
    cleanedCount++;
  } else {
    // Systematic cleaning

    // 1. Strip margin grammatical notes like "- أَجْوَف", "- نَاقِص", "- مُضَاعَف"
    if (/-\s*(مُضَاعَف|أَجْوَف|نَاقِص|مِثَال|لَفِيْف|تَفْعِيل|مُفَاعَلَة)/.test(ar)) {
      ar = ar.replace(/-\s*(مُضَاعَف|أَجْوَف|نَاقِص|مِثَال|لَفِيْف|تَفْعِيل|مُفَاعَلَة)/g, '').trim();
      cleanedCount++;
    }

    // 2. Fix stacked tanween / hyphen patterns: e.g. "جَدِيْد -ٌجَدِيْدَةٌ" -> "جَدِيْدٌ - جَدِيْدَةٌ"
    if (/-ٌ/.test(ar)) {
      ar = ar.replace(/([^\s]+)\s*-ٌ\s*([^\s]+)/g, (match, p1, p2) => {
        // If p1 doesn't have tanween, add tanween
        let p1Clean = p1;
        if (!/[\u064B-\u064D]/.test(p1Clean)) {
          p1Clean += '\u064C';
        }
        return `${p1Clean} - ${p2}`;
      });
      cleanedCount++;
    }

    // 3. Fix stacked double vowels: "ٌُ" -> "ُ" if has "ال", else "ٌ"
    if (/ٌُ/.test(ar)) {
      if (ar.startsWith('اَل') || ar.startsWith('ال') || ar.includes(' اَل') || ar.includes(' ال')) {
        ar = ar.replace(/ٌُ/g, 'ُ');
      } else {
        ar = ar.replace(/ٌُ/g, 'ٌ');
      }
      cleanedCount++;
    }
    if (/ٌَ/.test(ar)) {
      ar = ar.replace(/ٌَ/g, 'َ');
      cleanedCount++;
    }
    if (/ٌِ/.test(ar)) {
      ar = ar.replace(/ٌِ/g, 'ِ');
      cleanedCount++;
    }

    // 4. Remove injected dummy texts like "(সৈকত সৈকত)"
    if (bn.includes('সৈকত')) {
      bn = bn.replace(/\s*\(সৈকত সৈকত\)/g, '').trim();
      cleanedCount++;
    }

    // 5. If transliteration still has Arabic characters, replace with proper Latin transliteration
    if (/[\u0600-\u06FF]/.test(tr) || !tr || tr.trim() === '') {
      tr = transliterateArabic(ar);
      cleanedCount++;
    }

    // 6. Clean spacing
    ar = ar.replace(/\s+/g, ' ').trim();
    bn = bn.replace(/\s+/g, ' ').trim();
    tr = tr.replace(/\s+/g, ' ').trim();
  }

  return {
    ...item,
    arabic: ar,
    bengali: bn,
    transliteration: tr,
    partOfSpeech: pos
  };
});

fs.writeFileSync(vocabPath, JSON.stringify(healedVocab, null, 2), 'utf8');
console.log(`HEALING COMPLETED! Processed ${cleanedCount} item fixes.`);
