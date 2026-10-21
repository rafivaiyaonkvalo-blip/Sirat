function prepareArabicWithoutWaqf(text) {
  if (!text) return '';
  let t = text.trim();

  // 1. Strip punctuation, brackets, and quotes that trigger pauses/waqf in TTS engines
  t = t.replace(/[.,!?؟:;،—–\-\/\\()[\]{}«»"']/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();

  // 2. Prolong Madd for Demonstratives so Madd is drawn out/elongated
  t = t.replace(/هٰذَا|هَـٰذَا|هَٰذَا/g, 'هَاذَا');
  t = t.replace(/هٰذِهِ|هَـٰذِهِ|هَٰذِهِ|هَذِهِ/g, 'هَاذِهِي');
  t = t.replace(/ذٰلِكَ|ذَٰلِكَ|ذَـٰلِكَ/g, 'ذَالِكَ');
  t = t.replace(/أُولٰئِكَ|أُولَٰئِكَ/g, 'أُولَائِكَ');
  t = t.replace(/هٰؤُلَاءِ|هَٰؤُلَاءِ/g, 'هَاؤُلَاءِ');

  // 3. Phonetic Zero-Waqf Transformation for Tanween (Everywhere)
  // In classical Arabic, Tanween is phonetically a Nun Sakinah attached to the vowel (لفظاً لا خطاً).
  // Taa Marbutah + Tanween
  t = t.replace(/ة\u064C/g, 'تُنْ'); // ةٌ -> تُنْ (-tun)
  t = t.replace(/ة\u064D/g, 'تِنْ'); // ةٍ -> تِنْ (-tin)
  t = t.replace(/ة\u064B/g, 'تَنْ'); // ةً -> تَنْ (-tan)

  // General Tanween (letters other than Taa Marbutah)
  t = t.replace(/[اَ]\u064B/g, 'َنْ');
  t = t.replace(/\u064Bا/g, 'َنْ');
  t = t.replace(/\u064Bى/g, 'َنْ');
  t = t.replace(/\u064B/g, 'َنْ'); // Fathatan (-an)
  t = t.replace(/\u064C/g, 'ُنْ'); // Dammatan (-un)
  t = t.replace(/\u064D/g, 'ِنْ'); // Kasratan (-in)

  // 4. Phonetic Zero-Waqf for Taa Marbutah + Single Harakah
  t = t.replace(/ة\u064F/g, 'تُو'); // ةُ -> تُو (-tu)
  t = t.replace(/ة\u0650/g, 'تِي'); // ةِ -> تِي (-ti)
  t = t.replace(/ة\u064E/g, 'تَا'); // ةَ -> تَا (-ta)
  t = t.replace(/ة(?=\s|$)/g, 'تْ'); // isolated bare ة without harakah

  // 5. Phonetic Zero-Waqf for Single Harakah AT THE END OF WORDS / CLAUSES
  // Guarantees that Neural TTS engines NEVER drop single Damma, Kasra, or Fatha at word boundaries
  // Consonant: Arabic letters (Hamza to Yaa) + optional Shaddah
  // Final Damma -> add Waw (ـُو)
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064F(?=\s|$)/g, '$1ُو');

  // Final Kasra -> add Yaa (ـِي)
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u0650(?=\s|$)/g, '$1ِي');

  // Final Fatha -> add Alif (ـَا)
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064E(?=\s|$)/g, '$1َا');

  // 6. Clean extra whitespace
  return t.replace(/\s+/g, ' ').trim();
}

const tests = [
  'كِتَابٌ',
  'سَاعَةٌ',
  'مَدْرَسَةً',
  'حَقِيبَةٍ',
  'كِتَابًا',
  'كِتَابٍ',
  'هٰذَا كِتَابٌ',
  'هٰذِهِ سَاعَةٌ',
  'ذٰلِكَ قَلَمٌ',
  'تِلْكَ مَدْرَسَةٌ',
  'البَابُ الأَوَّلُ',
  'فِي الْمَسْجِدِ',
  'عَلَى الْمَكْتَبِ',
  'فِي يَدِكِ',
  'مَا هٰذَا؟ - هٰذَا كِتَابٌ ، وَذٰلِكَ قَلَمٌ.',
  'أَهٰذَا مَسْجِدٌ أَمْ بَيْتٌ؟',
  'كُرْسِيٌّ',
  'قَوِيٌّ',
  'جَدِيدَةٌ.',
  'تِلْكَ',
  'ذٰلِكَ',
  'أَنْتَ',
  'أَنْتِ',
  'هُوَ',
  'هِيَ',
  'نَحْنُ',
  'مِنْهُ',
  'عَلَيْهِ',
  'مَا هٰذِهِ فِي يَدِكِ؟'
];

let ok = true;
for (const t of tests) {
  const o1 = prepareArabicWithoutWaqf(t);
  const o2 = prepareArabicWithoutWaqf(o1);
  if (o1 !== o2) {
    console.log('NOT IDEMPOTENT:', t, '->', o1, '->', o2);
    ok = false;
  }
}
if (ok) console.log('ALL 29 TESTS ARE 100% IDEMPOTENT!\n');
for (const t of tests) {
  console.log(`${t.padEnd(35)} => ${prepareArabicWithoutWaqf(t)}`);
}

module.exports = { prepareArabicWithoutWaqf };
