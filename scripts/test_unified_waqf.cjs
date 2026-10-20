function prepareArabicWithoutWaqf(text) {
  if (!text) return '';
  let t = text.trim();

  // 1. Strip tatweel / kashida (\u0640)
  t = t.replace(/\u0640/g, '');

  // 2. Strip Bengali/English explanatory text mixed into Arabic strings (e.g. "(বহুবচন: ...)")
  t = t.replace(/[\u0980-\u09FF]/g, ' ');

  // 3. Strip all invisible/bidi control characters (LRM, RLM, ALM, ZWNJ, ZWJ, ZWSP, BOM, etc.)
  t = t.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF\u061C\u00A0]/g, '');

  // 4. Strip all Quranic stop signs, ornaments, ligatures, punctuation, quotes, brackets, dashes, Arabic/Urdu stops
  // Including Arabic full stop (\u06D4 ۔), Arabic semicolon (؛), Arabic comma (،), Arabic question mark (؟)
  // Arabic percent (٪), Arabic decimal/thousands (٫ ٬), asterisk (٭), Quranic signs (\u06D6-\u06ED, \uFDFA-\uFDFD)
  t = t.replace(/[\u06D4\u06D6-\u06ED\uFDFA-\uFDFD\u066A-\u066D]/g, ' ');
  t = t.replace(/[.,!?؟:;؛،—–―\-\/\\()[\]{}«»"“”'‘’‹›…~_#*+^=<>|]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();

  // 5. Canonical normalization: ensure Shaddah (\u0651) always PRECEDES vowel diacritics
  // If Harakah precedes Shaddah (e.g. \u064C\u0651, \u064E\u0651), swap them so Shaddah is attached to consonant
  t = t.replace(/([\u064B-\u0650\u0670])\u0651/g, '\u0651$1');

  // 6. Prolong Madd for Demonstratives so Madd is drawn out/elongated
  t = t.replace(/هٰذَا|هَـٰذَا|هَٰذَا/g, 'هَاذَا');
  t = t.replace(/هٰذِهِ|هَـٰذِهِ|هَٰذِهِ|هَذِهِ/g, 'هَاذِهِي');
  t = t.replace(/ذٰلِكَ|ذَٰلِكَ|ذَـٰلِكَ/g, 'ذَالِكَ');
  t = t.replace(/أُولٰئِكَ|أُولَٰئِكَ/g, 'أُولَائِكَ');
  t = t.replace(/هٰؤُلَاءِ|هَٰؤُلَاءِ/g, 'هَاؤُلَاءِ');

  // 7. Phonetic Zero-Waqf Transformation for Tanween
  // Taa Marbutah + Tanween
  t = t.replace(/ة\u0651?\u064C/g, 'تُنْ'); // ةٌ -> تُنْ (-tun)
  t = t.replace(/ة\u0651?\u064D/g, 'تِنْ'); // ةٍ -> تِنْ (-tin)
  t = t.replace(/ة\u0651?\u064B/g, 'تَنْ'); // ةً -> تَنْ (-tan)

  // Fathatan on general letters (handles both Alif-after \u064B\u0627 and Alif-before \u0627\u064B, and Alif Maqsura \u0649\u064B / \u064B\u0649)
  t = t.replace(/([\u0621-\u0626\u0628-\u0648\u064A-\u06D3]\u0651?)[اى]?\u064B[اى]?/g, '$1َنْ');
  t = t.replace(/\u064B[اى]?/g, 'َنْ');

  // Dammatan on general letters
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064C/g, '$1ُنْ');
  t = t.replace(/\u064C/g, 'ُنْ');

  // Kasratan on general letters
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064D/g, '$1ِنْ');
  t = t.replace(/\u064D/g, 'ِنْ');

  // 8. Phonetic Zero-Waqf for Taa Marbutah + Single Harakah
  t = t.replace(/ة\u0651?\u064F/g, 'تُو'); // ةُ -> تُو (-tu)
  t = t.replace(/ة\u0651?\u0650/g, 'تِي'); // ةِ -> تِي (-ti)
  t = t.replace(/ة\u0651?\u064E/g, 'تَا'); // ةَ -> تَا (-ta)
  t = t.replace(/ة(?=\s|$)/g, 'تْ');       // isolated bare ة without harakah

  // 9. Phonetic Zero-Waqf for Single Harakah AT THE END OF WORDS / CLAUSES
  // Guarantees that Neural TTS engines NEVER drop single Damma, Kasra, or Fatha at word boundaries
  // Consonant: Arabic letters (Hamza to Yaa) + optional Shaddah
  // Final Damma -> add Waw (ـُو)
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064F(?=\s|$)/g, '$1ُو');

  // Final Kasra -> add Yaa (ـِي)
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u0650(?=\s|$)/g, '$1ِي');

  // Final Fatha -> on Alif Maqsura (ىَ) normalize to regular Alif (ـَا), otherwise add Alif (ـَا)
  t = t.replace(/ى\u064E(?=\s|$)/g, 'َا');
  t = t.replace(/([\u0621-\u0648\u064A-\u06D3]\u0651?)\u064E(?=\s|$)/g, '$1َا');

  // 10. Clean extra whitespace
  return t.replace(/\s+/g, ' ').trim();
}

const testCases = [
  // Shaddah before/after
  ['كُرْسِيٌّ', 'كُرْسِيُّنْ'],
  ['ثُمَّ', 'ثُمَّا'],
  ['اَلْخُلُوُّ', 'اَلْخُلُوُّو'],
  ['قَوِيٌّ', 'قَوِيُّنْ'],
  ['أُمٌّ', 'أُمُّنْ'],
  // Tanween
  ['كِتَابٌ', 'كِتَابُنْ'],
  ['سَاعَةٌ', 'سَاعَتُنْ'],
  ['مَدْرَسَةً', 'مَدْرَسَتَنْ'],
  ['حَقِيبَةٍ', 'حَقِيبَتِنْ'],
  ['كِتَابًا', 'كِتَابَنْ'],
  ['كِتَابٍ', 'كِتَابِنْ'],
  ['مَاءً', 'مَاءَنْ'],
  ['هُدًى', 'هُدَنْ'],
  ['هُدىً', 'هُدَنْ'],
  // Single Harakah
  ['البَابُ الأَوَّلُ', 'البَابُو الأَوَّلُو'],
  ['فِي الْمَسْجِدِ', 'فِي الْمَسْجِدِي'],
  ['عَلَى الْمَكْتَبِ', 'عَلَى الْمَكْتَبِي'],
  ['فِي يَدِكِ', 'فِي يَدِكِي'],
  ['تِلْكَ', 'تِلْكَا'],
  ['ذٰلِكَ', 'ذَالِكَا'],
  ['أَنْتَ', 'أَنْتَا'],
  ['أَنْتِ', 'أَنْتِي'],
  ['هُوَ', 'هُوَا'],
  ['هِيَ', 'هِيَا'],
  ['نَحْنُ', 'نَحْنُو'],
  ['مِنْهُ', 'مِنْهُو'],
  ['عَلَيْهِ', 'عَلَيْهِي'],
  // Punctuation & Quotes
  ['مَا هٰذَا؟ - هٰذَا كِتَابٌ ، وَذٰلِكَ قَلَمٌ.', 'مَا هَاذَا هَاذَا كِتَابُنْ وَذَالِكَا قَلَمُنْ'],
  ['أَهٰذَا مَسْجِدٌ أَمْ بَيْتٌ؟', 'أَهَاذَا مَسْجِدُنْ أَمْ بَيْتُنْ'],
  ['جَدِيدَةٌ.', 'جَدِيدَتُنْ'],
  ['سَاعَةٌ؛', 'سَاعَتُنْ'],
  ['«كِتَابٌ»', 'كِتَابُنْ'],
  ['حَمَامَةٌ (ج: حَمَامٌ)', 'حَمَامَتُنْ ج حَمَامُنْ'],
  // Edge cases: Arabic/Urdu full stop, bidi marks, mixed annotations
  ['كِتَابٌ۔', 'كِتَابُنْ'],
  ['الْبَابُ۔', 'الْبَابُو'],
  ['\u200Eكِتَابٌ\u200F', 'كِتَابُنْ'],
  ['الْبَابُ\u200E', 'الْبَابُو'],
  ['بَلَدٌ (বহুবচন: بِلَادٌ)', 'بَلَدُنْ بِلَادُنْ'],
  ['حَمَامَةٌ (বহুবচন: حَمَامٌ)', 'حَمَامَتُنْ حَمَامُنْ'],
  ['بِمَ (بِمَاذَا এর সংক্ষেপ)', 'بِمَا بِمَاذَا']
];

console.log('Testing unified prepareArabicWithoutWaqf:');
let allPassed = true;
for (const [inp, expected] of testCases) {
  const actual = prepareArabicWithoutWaqf(inp);
  const pass = actual === expected;
  if (!pass) {
    console.error(`FAIL: [${inp}] => got [${actual}], expected [${expected}]`);
    allPassed = false;
  } else {
    console.log(`PASS: [${inp}] => [${actual}]`);
  }
}

// Check idempotence
for (const [inp] of testCases) {
  const o1 = prepareArabicWithoutWaqf(inp);
  const o2 = prepareArabicWithoutWaqf(o1);
  if (o1 !== o2) {
    console.error(`IDEMPOTENCE FAIL: [${inp}] => [${o1}] => [${o2}]`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\nALL TESTS PASSED WITH 100% ACCURACY & IDEMPOTENCE!');
} else {
  process.exit(1);
}

module.exports = { prepareArabicWithoutWaqf };
