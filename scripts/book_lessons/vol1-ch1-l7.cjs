// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৭ম দারস (বই পৃষ্ঠা ৪১–৪৪, PDF পৃষ্ঠা ৩৯–৪২)
// বিষয়: অবস্থান ও দিকনির্দেশ (عِنْدَ / أَمَامَ / فَوْقَ / تَحْتَ ও أَيْنَ؟)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ।

const W = {
  // পৃ. ৪১ দিকনির্দেশ ও অবস্থান
  inda: { arabic: 'عِنْدَ', bangla: 'কাছে / নিকটে' },
  amama: { arabic: 'أَمَامَ', bangla: 'সামনে' },
  waraa: { arabic: 'وَرَاءَ', bangla: 'পিছনে' },
  khalfa: { arabic: 'خَلْفَ', bangla: 'পিছনে' },
  fawqa: { arabic: 'فَوْقَ', bangla: 'উপরে' },
  tahta: { arabic: 'تَحْتَ', bangla: 'নিচে' },
  bijanibi: { arabic: 'بِجَانِبِ', bangla: 'পাশে' },
  ayna: { arabic: 'أَيْنَ؟', bangla: 'কোথায়?' },

  // পৃ. ৪২ শ্রেণি ও জিনিসপত্র
  massaha: { arabic: 'مَسَّاحَةٌ', bangla: 'ডাস্টার' },
  kharita: { arabic: 'خَارِطَةٌ', bangla: 'মানচিত্র / ম্যাপ', picture: 'map' },
  mihrath: { arabic: 'مِحْرَاثٌ', bangla: 'লাঙ্গল' },
  maksur: { arabic: 'مَكْسُورٌ', bangla: 'ভাঙা' },
  hawd: { arabic: 'حَوْضٌ', bangla: 'জলাধার / হাউয' },
  kitab: { arabic: 'كِتَابٌ', bangla: 'একটি বই', picture: 'book' },
  tawila: { arabic: 'طَاوِلَةٌ', bangla: 'একটি টেবিল', picture: 'table' },
  kursiyy: { arabic: 'كُرْسِيٌّ', bangla: 'একটি চেয়ার', picture: 'chair' },

  // পৃ. ৪৪ প্রকৃতি ও বিশ্বাস
  samaa: { arabic: 'اَلسَّمَاءُ', bangla: 'আসমান / আকাশ' },
  ard: { arabic: 'اَلْأَرْضُ', bangla: 'যমীন / পৃথিবী' },
  qalb: { arabic: 'قَلْبٌ', bangla: 'হৃদয় / অন্তর' },
  nur: { arabic: 'نُورٌ', bangla: 'আলো / নূর' },
  dhulma: { arabic: 'ظُلْمَةٌ', bangla: 'অন্ধকার' },
  qissa: { arabic: 'قِصَّةٌ', bangla: 'গল্প / ঘটনা' }
};

const T = (arabic, bangla, page, picture, distance) => ({ arabic, bangla, page, picture, distance });

const SENT = {
  // পৃ. ৪১
  indiKitab: T('عِنْدِي كِتَابٌ', 'আমার কাছে একটি বই আছে', '৪১', 'book'),
  alKitabuIndi: T('اَلْكِتَابُ عِنْدِي', 'বইটি আমার কাছে আছে', '৪১', 'book'),
  yaMajiduAmamakaKitab: T('يَا مَاجِدُ! أَمَامَكَ كِتَابٌ', 'হে মাজেদ! তোমার সামনে একটি বই আছে', '৪১'),
  alKitabuAmamaka: T('اَلْكِتَابُ أَمَامَكَ', 'বইটি তোমার সামনে আছে', '৪১'),
  fawqakaMirwaha: T('فَوْقَكَ مِرْوَحَةٌ', 'তোমার উপরে একটি পাখা আছে', '৪১', 'fan'),
  waraakaSayyara: T('وَرَاءَكَ سَيَّارَةٌ', 'তোমার পিছনে একটি গাড়ি আছে', '৪১', 'car'),
  bijanibikaDarraja: T('بِجَانِبِكَ دَرَّاجَةٌ', 'তোমার পাশে একটি সাইকেল আছে', '৪১', 'bicycle'),

  yaAishatuIndakiQalam: T('يَا عَائِشَةُ! عِنْدَكِ قَلَمٌ', 'হে আয়েশা! তোমার কাছে একটি কলম আছে', '৪১'),
  fawqakiMisbah: T('فَوْقَكِ مِصْبَاحٌ', 'তোমার উপরে একটি বাতি আছে', '৪১', 'lamp'),
  khalfakiTawila: T('خَلْفَكِ طَاوِلَةٌ', 'তোমার পিছনে একটি টেবিল আছে', '৪১', 'table'),
  bijanibikiKursiyy: T('بِجَانِبِكِ كُرْسِيٌّ', 'তোমার পাশে একটি চেয়ার আছে', '৪১', 'chair'),

  // পৃ. ৪২
  rashidunIndahuKitab: T('رَاشِدٌ عِنْدَهُ كِتَابٌ وَقَلَمٌ', 'রাশেদের কাছে একটি বই ও একটি কলম আছে', '৪২'),
  amamahuSabbura: T('أَمَامَهُ سَبُّورَةٌ وَمَسَّاحَةٌ', 'তার সামনে একটি ব্ল্যাকবোর্ড ও ডাস্টার আছে', '৪২'),
  fawqahuMisbah: T('فَوْقَهُ مِصْبَاحٌ وَمِرْوَحَةٌ', 'তার উপরে একটি বাতি ও একটি পাখা আছে', '৪২'),
  zaynabuIndahaKharita: T('زَيْنَبُ عِنْدَهَا خَارِطَةٌ وَكُرَّاسَةٌ', 'যায়নাবের কাছে একটি মানচিত্র ও একটি খাতা আছে', '৪২'),

  amamalFallahiMihrath: T('أَمَامَ الْفَلَّاحِ مِحْرَاثٌ', 'কৃষকের সামনে একটি লাঙ্গল আছে', '৪২'),
  alMihrathuAmamalFallah: T('اَلْمِحْرَاثُ أَمَامَ الْفَلَّاحِ', 'লাঙ্গলটি কৃষকের সামনে আছে', '৪২'),
  bijanibilMasjidiHawd: T('بِجَانِبِ الْمَسْجِدِ حَوْضٌ', 'মসজিদের পাশে একটি হাউয আছে', '৪২'),
  alHawduBijanibilMasjid: T('اَلْحَوْضُ بِجَانِبِ الْمَسْجِدِ', 'হাউযটি মসজিদের পাশে আছে', '৪২'),

  hathihiSaatuFawqatTawila: T('هٰذِهِ السَّاعَةُ فَوْقَ الطَّاوِلَةِ', 'এই ঘড়িটি টেবিলের উপরে আছে', '৪২'),
  hathaMihrathunMaksur: T('هٰذَا مِحْرَاثٌ مَكْسُورٌ', 'ইহা একটি ভাঙা লাঙ্গল', '৪২'),
  iqduAishataIndaFatima: T('عِقْدُ عَائِشَةَ عِنْدَ فَاطِمَةَ', 'আয়েশার হার ফাতেমার কাছে আছে', '৪২'),

  // পৃ. ৪৪
  asSamauFawqana: T('اَلسَّمَاءُ فَوْقَنَا وَالْأَرْضُ تَحْتَنَا', 'আসমান আমাদের উপরে এবং পৃথিবী আমাদের নিচে', '৪৪')
};

const QA = [
  // পৃ. ৪২-৪৩
  {
    q: T('أَيْنَ السَّاعَةُ؟', 'ঘড়িটি কোথায়?'),
    a: T('اَلسَّاعَةُ عِنْدِي', 'ঘড়িটি আমার কাছে আছে'),
    wrong: ['اَلسَّاعَةُ عِنْدَكَ', 'اَلسَّاعَةُ جَدِيدَةٌ']
  },
  {
    q: T('عِنْدَ مَنِ الْقَلَمُ؟', 'কলমটি কার কাছে?'),
    a: T('اَلْقَلَمُ عِنْدَ عَائِشَةَ', 'কলমটি আয়েশার কাছে আছে'),
    wrong: ['اَلْقَلَمُ عِنْدِي', 'اَلْقَلَمُ جَيِّدٌ']
  },
  {
    q: T('مَاذَا فَوْقَكِ يَا عَائِشَةُ؟', 'হে আয়েশা, তোমার উপরে কী?'),
    a: T('فَوْقِي مِصْبَاحٌ', 'আমার উপরে একটি বাতি আছে'),
    wrong: ['فَوْقِي مِرْوَحَةٌ', 'أَمَامِي مِصْبَاحٌ']
  },
  {
    q: T('أَيْنَ الْمِرْوَحَةُ؟', 'পাখাটি কোথায়?'),
    a: T('اَلْمِرْوَحَةُ فَوْقَ مَاجِدٍ', 'পাখাটি মাজেদের উপরে আছে'),
    wrong: ['اَلْمِرْوَحَةُ فَوْقِي', 'اَلْمِرْوَحَةُ تَحْتَهُ']
  },
  {
    q: T('مَاذَا أَمَامَ الْمُعَلِّمِ؟', 'শিক্ষকের সামনে কী আছে?'),
    a: T('أَمَامَ الْمُعَلِّمِ سَبُّورَةٌ وَمَسَّاحَةٌ', 'শিক্ষকের সামনে ব্ল্যাকবোর্ড ও ডাস্টার আছে'),
    wrong: ['أَمَامَهُ مِرْوَحَةٌ', 'خَلْفَهُ سَبُّورَةٌ']
  },
  {
    q: T('أَيْنَ الْخَارِطَةُ؟', 'মানচিত্রটি কোথায়?'),
    a: T('اَلْخَارِطَةُ عِنْدَ الْمُعَلِّمَةِ', 'মানচিত্রটি শিক্ষিকার কাছে আছে'),
    wrong: ['اَلْخَارِطَةُ فَوْقَ الطَّاوِلَةِ', 'اَلْخَارِطَةُ عِنْدِي']
  },
  // পৃ. ৪৪
  {
    q: T('أَيْنَ صَدِيقُ بَشِيرٍ؟', 'বশীরের বন্ধু কোথায়?'),
    a: T('صَدِيقُ بَشِيرٍ أَمَامَ الْمَسْجِدِ', 'বশীরের বন্ধু মসজিদের সামনে আছে'),
    wrong: ['صَدِيقُهُ فِي الْمَسْجِدِ', 'صَدِيقُهُ وَرَاءَ الْمَسْجِدِ']
  },
  {
    q: T('أَيْنَ السَّمَاءُ وَأَيْنَ الْأَرْضُ؟', 'আসমান কোথায় এবং পৃথিবী কোথায়?'),
    a: T('اَلسَّمَاءُ فَوْقَنَا وَالْأَرْضُ تَحْتَنَا', 'আসমান আমাদের উপরে এবং পৃথিবী আমাদের নিচে'),
    wrong: ['اَلسَّمَاءُ تَحْتَنَا وَالْأَرْضُ فَوْقَنَا', 'اَلسَّمَاءُ جَمِيلَةٌ']
  }
];

// ---------- ধাপ তৈরির সহায়ক ----------

const intro = (item, title = 'নতুন শব্দ') => ({
  type: 'intro',
  title,
  word: { arabic: item.arabic, bangla: item.bangla },
  picture: item.picture,
  distance: item.distance
});

const introSentence = (sent) => intro(sent, 'কিতাবের বাক্য');

const match = (items, title = 'শব্দজোড় মেলান') => ({
  type: 'match_pairs',
  title,
  pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla }))
});

const meaningOf = (item, wrongBanglas, question = 'বাক্যটির অর্থ কী?') => ({
  type: 'mcq',
  word: { arabic: item.arabic, bangla: item.bangla },
  question,
  options: [item.bangla, ...wrongBanglas].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const arabicOf = (item, wrongArabics) => ({
  type: 'mcq',
  word: { arabic: item.bangla, bangla: item.bangla },
  question: `"${item.bangla}" এর আরবি কোনটি?`,
  options: [item.arabic, ...wrongArabics].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const fill = (sent, index, wrong, title = 'খালি জায়গা পূরণ করুন') => {
  const tokens = sent.arabic.split(' ');
  return {
    type: 'fill_blank',
    title,
    targetBangla: sent.bangla,
    fullArabic: sent.arabic,
    tokensBefore: tokens.slice(0, index),
    tokensAfter: tokens.slice(index + 1),
    missingToken: tokens[index],
    picture: sent.picture,
    distance: sent.distance,
    options: [tokens[index], ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
  };
};

const build = (sent, distractors) => ({
  type: 'sentence_builder',
  title: 'কিতাবের বাক্য সাজান',
  targetArabic: sent.arabic,
  targetBangla: sent.bangla,
  targetTokens: sent.arabic.split(' '),
  distractors,
  picture: sent.picture,
  distance: sent.distance
});

const dialogue = ({ q, a, wrong }, speaker = 'প্রশ্নোত্তর পড়ো ও অর্থ বলো') => ({
  type: 'dialogue_listen',
  speaker,
  questionArabic: q.arabic,
  questionBangla: q.bangla,
  options: [a.arabic, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const spot = (targetBangla, right, wrong, why) => ({
  type: 'spot_error',
  title: 'কোন বাক্যটি কিতাবের মতো শুদ্ধ?',
  targetBangla,
  options: [
    { text: right, isCorrect: true, explanation: `কিতাবে আছে: ${right}` },
    { text: wrong, isCorrect: false, explanation: why }
  ]
});

const quiz = (question, options, explanation) => ({
  type: 'quiz_challenge',
  question,
  explanation,
  options: options.map((text, i) => ({ text, isCorrect: i === 0 }))
});

const MAX_OPTIONS = 3;
const trimOptions = (step) => {
  if (step.type === 'picture_choice') return step;
  if (!Array.isArray(step.options) || step.options.length <= MAX_OPTIONS) return step;
  const correct = step.options.filter(o => o.isCorrect);
  const wrong = step.options.filter(o => !o.isCorrect).slice(0, MAX_OPTIONS - correct.length);
  return { ...step, options: [...correct, ...wrong] };
};

const stage = (meta, steps) => ({ ...meta, steps: steps.map(trimOptions) });

const pictureChoice = (correctKey, otherKeys, title = 'ছবি দেখে সঠিক উত্তর দিন') => ({
  type: 'picture_choice',
  title,
  targetArabic: W[correctKey].arabic,
  options: [correctKey, ...otherKeys].map((k, i) => ({
    text: W[k].arabic,
    bangla: W[k].bangla,
    picture: W[k].picture,
    isCorrect: i === 0
  }))
});

// ---------- পর্বসমূহ (কিতাবের ক্রমে) ----------

const bookStages = [
  stage(
    {
      id: 'l7-words-1',
      titleBn: 'শব্দার্থ: অবস্থান ও দিকনির্দেশ (১/২)',
      shortTitle: 'দিক ও অবস্থান',
      titleAr: 'الْمُفْرَدَاتُ: الظُّرُوفُ',
      desc: 'কাছে, সামনে, পিছনে, উপরে, নিচে, পাশে, কোথায়?',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪১'
    },
    [
      intro(W.inda), intro(W.amama), intro(W.waraa), intro(W.khalfa),
      match([W.inda, W.amama, W.waraa, W.khalfa]),
      intro(W.fawqa), intro(W.tahta), intro(W.bijanibi), intro(W.ayna),
      match([W.fawqa, W.tahta, W.bijanibi, W.ayna]),
      arabicOf(W.amama, ['خَلْفَ', 'فَوْقَ']),
      meaningOf(W.fawqa, ['নিচে', 'পাশে'])
    ]
  ),

  stage(
    {
      id: 'l7-grammar-zarf',
      titleBn: 'ক্বায়েদা: অবস্থান নির্দেশক শব্দ (জরফ)',
      shortTitle: 'জরফের নিয়ম',
      titleAr: 'قَاعِدَةُ الظَّرْفِ',
      desc: 'عِنْدِي كِتَابٌ বনাম اَلْكِتَابُ عِنْدِي এর পার্থক্য',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '৪১'
    },
    [
      {
        type: 'grammar_card',
        title: 'অবস্থান নির্দেশক শব্দ (জরফ)',
        summary: 'عِنْدَ (কাছে), أَمَامَ (সামনে), فَوْقَ (উপরে), تَحْتَ (নিচে) ইত্যাদি শব্দকে জরফ বলে। অনির্দিষ্ট জিনিস পরে এলে তানবীনযুক্ত হয় (عِنْدِي كِتَابٌ = আমার কাছে একটি বই আছে)। আর নির্দিষ্ট জিনিস শুরুতে এলে পেশযুক্ত হয় (اَلْكِتَابُ عِنْدِي = বইটি আমার কাছে আছে)।',
        table: [
          { arabic: 'عِنْدِي كِتَابٌ', bangla: 'আমার কাছে একটি বই আছে' },
          { arabic: 'اَلْكِتَابُ عِنْدِي', bangla: 'বইটি আমার কাছে আছে' }
        ]
      },
      spot('আমার কাছে একটি বই আছে', 'عِنْدِي كِتَابٌ', 'عِنْدِي اَلْكِتَابُ', 'অনির্দিষ্ট জিনিস পরে এসে তানবীনযুক্ত হয়।'),
      spot('বইটি আমার কাছে আছে', 'اَلْكِتَابُ عِنْدِي', 'كِتَابٌ عِنْدِي', 'নির্দিষ্ট জিনিস বাক্যের শুরুতে বসে।'),
      fill(SENT.indiKitab, 0, ['عِنْدَكَ', 'عِنْدَهُ']),
      fill(SENT.alKitabuIndi, 1, ['عِنْدَكَ', 'عِنْدَكِ']),
      arabicOf(W.inda, ['أَمَامَ', 'فَوْقَ']),
      meaningOf(W.ayna, ['কেমন', 'কী'])
    ]
  ),

  stage(
    {
      id: 'l7-words-2',
      titleBn: 'শব্দার্থ: শ্রেণি, প্রকৃতি ও নতুন শব্দ (২/২)',
      shortTitle: 'শ্রেণি ও প্রকৃতি',
      titleAr: 'الْمُفْرَدَاتُ: الأَدَوَاتُ وَالطَّبِيعَةُ',
      desc: 'ডাস্টার, মানচিত্র, লাঙ্গল, হাউয, আসমান, পৃথিবী',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪২, ৪৪'
    },
    [
      intro(W.massaha), intro(W.kharita), intro(W.mihrath), intro(W.maksur),
      match([W.massaha, W.kharita, W.mihrath, W.maksur]),
      intro(W.hawd), intro(W.samaa), intro(W.ard), intro(W.qalb),
      match([W.hawd, W.samaa, W.ard, W.qalb]),
      pictureChoice('kharita', ['kitab', 'tawila', 'kursiyy']),
      meaningOf(W.mihrath, ['ডাস্টার', 'হাউয'])
    ]
  ),

  stage(
    {
      id: 'l7-sentences-1',
      titleBn: 'কিতাবের বাক্য: অবস্থান ও উপস্থিতি (১/২)',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'তোমার সামনে বই, তোমার উপরে পাখা, তোমার পিছনে গাড়ি',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪১'
    },
    [
      introSentence(SENT.yaMajiduAmamakaKitab),
      introSentence(SENT.alKitabuAmamaka),
      introSentence(SENT.fawqakaMirwaha),
      introSentence(SENT.waraakaSayyara),
      build(SENT.fawqakaMirwaha, ['مِرْوَحَةِ', 'فَوْقِ']),
      introSentence(SENT.yaAishatuIndakiQalam),
      introSentence(SENT.fawqakiMisbah),
      introSentence(SENT.khalfakiTawila),
      build(SENT.khalfakiTawila, ['طَاوِلَةِ', 'خَلْفِ']),
      fill(SENT.bijanibikaDarraja, 0, ['بِجَانِبِكِ', 'بِجَانِبِي']),
      spot('তোমার উপরে পাখা আছে', 'فَوْقَكَ مِرْوَحَةٌ', 'فَوْقَكِ مِرْوَحَةٌ', 'পুরুষকে সম্বোধন করতে فَوْقَكَ হবে।')
    ]
  ),

  stage(
    {
      id: 'l7-sentences-2',
      titleBn: 'কিতাবের বাক্য: ক্লাসরুম ও পরিবেশ (২/২)',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'শিক্ষকের সামনে ব্ল্যাকবোর্ড, মসজিদের পাশে হাউয, আসমান আমাদের উপরে',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪২, ৪৪'
    },
    [
      introSentence(SENT.rashidunIndahuKitab),
      introSentence(SENT.amamahuSabbura),
      introSentence(SENT.zaynabuIndahaKharita),
      introSentence(SENT.amamalFallahiMihrath),
      introSentence(SENT.bijanibilMasjidiHawd),
      build(SENT.bijanibilMasjidiHawd, ['حَوْضٍ', 'مَسْجِدٌ']),
      introSentence(SENT.hathihiSaatuFawqatTawila),
      introSentence(SENT.hathaMihrathunMaksur),
      introSentence(SENT.asSamauFawqana),
      build(SENT.hathaMihrathunMaksur, ['مَكْسُورَةٌ', 'قَدِيمٌ']),
      fill(SENT.asSamauFawqana, 0, ['اَلسَّمَاءِ', 'اَلسَّمَاءَ'])
    ]
  ),

  stage(
    {
      id: 'l7-dialogue-1',
      titleBn: 'কিতাবের প্রশ্নোত্তর: অবস্থান ও বস্তু (১/২)',
      shortTitle: 'প্রশ্নোত্তর ১',
      titleAr: 'الْحِوَارُ (١)',
      desc: 'ঘড়িটি কোথায়? কলমটি কার কাছে? তোমার উপরে কী?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪২–৪৩'
    },
    [
      dialogue(QA[0]),
      dialogue(QA[1]),
      dialogue(QA[2]),
      dialogue(QA[3]),
      dialogue(QA[4]),
      dialogue(QA[5])
    ]
  ),

  stage(
    {
      id: 'l7-dialogue-2',
      titleBn: 'কিতাবের প্রশ্নোত্তর: ব্যক্তি ও আসমান-যমীন (২/২)',
      shortTitle: 'প্রশ্নোত্তর ২',
      titleAr: 'الْحِوَارُ (٢)',
      desc: 'বশীরের বন্ধু কোথায়? আসমান কোথায় এবং পৃথিবী কোথায়?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৪'
    },
    [
      dialogue(QA[6]),
      dialogue(QA[7]),
      arabicOf(W.samaa, ['اَلْأَرْضُ', 'اَلْحَوْضُ']),
      meaningOf(W.ard, ['আসমান', 'হাউয']),
      build(SENT.alHawduBijanibilMasjid, ['حَوْضٌ', 'مَسْجِدِ']),
      spot('আসমান আমাদের উপরে', 'اَلسَّمَاءُ فَوْقَنَا', 'اَلسَّمَاءُ تَحْتَنَا', 'আকাশ উপরে, তাই فَوْقَنَا হবে।')
    ]
  ),

  stage(
    {
      id: 'l7-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الاخْتِبَارُ النِّهَائِيُّ',
      desc: '৭ম পাঠের অবস্থান ও দিকনির্দেশের পূর্ণাঙ্গ মূল্যায়ন',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '৪১–৪৪'
    },
    [
      quiz("'আমার কাছে একটি বই আছে' এর আরবি কোনটি?", ['عِنْدِي كِتَابٌ', 'أَمَامِي كِتَابٌ', 'فَوْقِي كِتَابٌ'], 'কাছে থাকা বোঝাতে عِنْدِي ব্যবহৃত হয়।'),
      quiz("'কোথায়?' জানতে আরবিতে কোন শব্দটি ব্যবহার করা হয়?", ['أَيْنَ؟', 'كَيْفَ؟', 'مَاذَا؟'], 'স্থান নির্দেশক প্রশ্ন করতে أَيْنَ؟ ব্যবহৃত হয়।'),
      quiz("'فَوْقَ الطَّاوِلَةِ' কথাটির অর্থ কী?", ['টেবিলের উপরে', 'টেবিলের নিচে', 'টেবিলের সামনে'], 'فَوْقَ অর্থ উপরে।'),
      quiz("'خَلْفَ' ও 'وَرَاءَ' শব্দদ্বয়ের অর্থ কী?", ['পিছনে', 'সামনে', 'পাশে'], 'خَلْفَ ও وَرَاءَ দুটি সমার্থক শব্দ, অর্থ পিছনে।'),
      quiz("'بِجَانِبِ الْمَسْجِدِ حَوْضٌ' বাক্যটির অর্থ কী?", ['মসজিদের পাশে একটি হাউয আছে', 'মসজিদের সামনে একটি হাউয আছে', 'মসজিদের ভিতরে একটি হাউয আছে'], 'بِجَانِبِ অর্থ পাশে।'),
      quiz("'اَلسَّمَاءُ فَوْقَنَا وَالْأَرْضُ ......' খালি জায়গায় কী বসবে?", ['تَحْتَنَا', 'فَوْقَنَا', 'أَمَامَنَا'], 'আকাশ উপরে এবং পৃথিবী নিচে (تَحْتَنَا)।'),
      quiz("'مَسَّاحَةٌ' শব্দের সঠিক অর্থ কোনটি?", ['ডাস্টার', 'মানচিত্র', 'লাঙ্গল'], 'مَسَّاحَةٌ অর্থ ডাস্টার।'),
      quiz("'হৃদয় / অন্তর' এর আরবি শব্দ কোনটি?", ['قَلْبٌ', 'نُورٌ', 'ظُلْمَةٌ'], 'قَلْبٌ অর্থ হৃদয় বা অন্তর।'),
      quiz("'অন্ধকার' এর আরবি শব্দ কোনটি?", ['ظُلْمَةٌ', 'نُورٌ', 'قِصَّةٌ'], 'ظُلْمَةٌ অর্থ অন্ধকার।'),
      quiz("'اَلْمِحْرَاثُ مَكْسُورٌ' এর অর্থ কী?", ['লাঙ্গলটি ভাঙা', 'লাঙ্গলটি নতুন', 'লাঙ্গলটি পুরোনো'], 'مَكْسُورٌ অর্থ ভাঙা।')
    ]
  )
];

// ---------- চর্চার পর্বসমূহ যোগ ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l7-sentences-1', stage(
  {
    id: 'l7-practice-1',
    titleBn: 'চর্চা ১: দিক ও স্থানের প্রয়োগ',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'সামনে, পিছনে, উপরে, নিচে ইত্যাদির সঠিক ব্যবহার',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৪১–৪২'
  },
  [
    match([W.amama, W.khalfa, W.fawqa, W.tahta]),
    fill(SENT.fawqakiMisbah, 0, ['فَوْقَكَ', 'فَوْقَهُ']),
    build(SENT.amamalFallahiMihrath, ['مِحْرَاثِ', 'فَلَّاحٌ']),
    spot('লাঙ্গলটি কৃষকের সামনে', 'اَلْمِحْرَاثُ أَمَامَ الْفَلَّاحِ', 'اَلْمِحْرَاثُ أَمَامَ الْفَلَّاحُ', 'জরফের পরের শব্দ যেরযুক্ত হয়।'),
    arabicOf(W.khalfa, ['أَمَامَ', 'تَحْتَ']),
    meaningOf(W.bijanibi, ['উপরে', 'সামনে']),
    build(SENT.hathihiSaatuFawqatTawila, ['طَاوِلَةٌ', 'سَاعَةٌ']),
    fill(SENT.amamahuSabbura, 0, ['أَمَامَهَا', 'أَمَامِي']),
    match([W.samaa, W.ard, W.hawd, W.massaha]),
    spot('আকাশ আমাদের উপরে', 'اَلسَّمَاءُ فَوْقَنَا', 'اَلسَّمَاءُ تَحْتَنَا', 'আকাশ উপরে, তাই فَوْقَنَا হবে।')
  ]
));

insertAfter('l7-dialogue-2', stage(
  {
    id: 'l7-practice-2',
    titleBn: 'চর্চা ২: বিপরীত দিক বাছাই',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'উপরে বনাম নিচে এবং অবস্থানগত শব্দের দলভাগ',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৪২–৪৪'
  },
  [
    {
      type: 'sort_groups',
      title: 'শব্দটি উপরে (فَوْقَ) সম্পর্কিত না নিচে (تَحْتَ) সম্পর্কিত?',
      groups: [
        { id: 'up', arabic: 'উপরে (فَوْقَ)' },
        { id: 'down', arabic: 'নিচে (تَحْتَ)' }
      ],
      items: [
        { arabic: 'اَلسَّمَاءُ', reveal: 'اَلسَّمَاءُ فَوْقَنَا (আকাশ আমাদের উপরে)', group: 'up' },
        { arabic: 'اَلْأَرْضُ', reveal: 'اَلْأَرْضُ تَحْتَنَا (পৃথিবী আমাদের নিচে)', group: 'down' },
        { arabic: 'اَلْمِرْوَحَةُ', reveal: 'اَلْمِرْوَحَةُ فَوْقَكَ (পাখা তোমার উপরে)', group: 'up' },
        { arabic: 'اَلْبِسَاطُ', reveal: 'اَلْبِسَاطُ تَحْتَكَ (ম্যাট তোমার নিচে)', group: 'down' }
      ]
    },
    fill(SENT.iqduAishataIndaFatima, 2, ['فَوْقَ', 'تَحْتَ']),
    build(SENT.asSamauFawqana, ['فَوْقِ', 'تَحْتِ']),
    spot('হাউযটি মসজিদের পাশে', 'اَلْحَوْضُ بِجَانِبِ الْمَسْجِدِ', 'اَلْحَوْضُ بِجَانِبِ الْمَسْجِدُ', 'بِجَانِبِ এর পরের শব্দ যেরযুক্ত হয়।'),
    arabicOf(W.nur, ['ظُلْمَةٌ', 'قَلْبٌ']),
    meaningOf(W.dhulma, ['আলো', 'গল্প']),
    match([W.qalb, W.nur, W.dhulma, W.qissa])
  ]
));

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT).map(({ arabic, bangla, picture, distance, page }) => ({ arabic, bangla, picture, distance, page }));

const dialogues = QA.map(({ q, a }) => ({
  speaker: 'কিতাবের প্রশ্নোত্তর',
  questionArabic: q.arabic,
  questionBangla: q.bangla,
  answerArabic: a.arabic,
  answerBangla: a.bangla,
  arabic: `${q.arabic} — ${a.arabic}`,
  bangla: `${q.bangla} — ${a.bangla}`,
  page: '৪২-৪৪'
}));

const tamrinKitabi = [
  {
    task: 'বাংলায় অনুবাদ করো',
    arabic: 'عِنْدِي كِتَابٌ جَدِيدٌ وَفَوْقِي مِرْوَحَةٌ.',
    bangla: 'আমার কাছে একটি নতুন বই আছে এবং আমার উপরে একটি পাখা।'
  },
  {
    task: 'আরবিতে বলো ও লেখো',
    arabic: 'أَمَامَ الْمُعَلِّمِ سَبُّورَةٌ وَفَوْقَ الطَّاوِلَةِ سَاعَةٌ.',
    bangla: 'শিক্ষকের সামনে একটি ব্ল্যাকবোর্ড আছে এবং টেবিলের উপরে ঘড়ি আছে।'
  },
  {
    task: 'শূন্যস্থান পূরণ করো',
    arabic: 'اَلسَّمَاءُ فَوْقَنَا ، وَالْأَرْضُ تَحْتَنَا.',
    bangla: 'আসমান আমাদের উপরে, এবং পৃথিবী আমাদের নিচে।'
  },
  {
    task: 'প্রশ্ন ও উত্তর বলো',
    arabic: 'أَيْنَ السَّاعَةُ؟ - اَلسَّاعَةُ فَوْقَ الطَّاوِلَةِ.',
    bangla: 'ঘড়িটি কোথায়? - ঘড়িটি টেবিলের উপরে।'
  }
];

const quizLegacy = bookStages
  .find(s => s.id === 'l7-quiz')
  .steps.filter(s => s.type === 'quiz_challenge')
  .map(q => {
    const correctIndex = q.options.findIndex(o => o.isCorrect);
    return {
      question: q.question,
      options: q.options.map(o => o.text),
      correctIndex,
      correctAnswer: correctIndex,
      explanation: q.explanation,
      type: 'mcq'
    };
  });

const qaida = [
  {
    id: 'l7-q-zarf',
    stageId: 'l7-grammar-zarf',
    title: 'জরফ বা অবস্থান নির্দেশক অব্যয় (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'عِنْدِي كِتَابٌ', bangla: 'আমার কাছে একটি বই আছে' },
      { arabic: 'اَلْكِتَابُ عِنْدِي', bangla: 'বইটি আমার কাছে আছে' },
      { arabic: 'أَمَامَ / وَرَاءَ / فَوْقَ / تَحْتَ', bangla: 'সামনে / পিছনে / উপরে / নিচে' }
    ],
    rule: 'জরফের পর কোনো বিশেষ্য বা নাম এলে তাতে সাধারণত যের (ـِ / ـٍ) হয়, যেমন: أَمَامَ الْمَسْجِدِ (মসজিদের সামনে), فَوْقَ الطَّاوِلَةِ (টেবিলের উপরে)। স্থান জানতে أَيْنَ؟ (কোথায়?) দিয়ে প্রশ্ন করা হয়।',
    examples: [{ arabic: 'اَلسَّمَاءُ فَوْقَنَا وَالْأَرْضُ تَحْتَنَا', bangla: 'আসমান আমাদের উপরে এবং পৃথিবী আমাদের নিচে' }]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l7',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৪১-৪৪',
    qaida,
    grammarRule: {
      title: 'অবস্থান ও দিকনির্দেশ (عِنْدَ / أَمَامَ / فَوْقَ / تَحْتَ ও أَيْنَ؟)',
      summary: 'কাছে, সামনে, পিছনে, উপরে, নিচে, পাশে অবস্থান প্রকাশ এবং কোথায় দিয়ে প্রশ্ন করা।',
      points: [
        'কাছে থাকা বোঝাতে عِنْدَ: عِنْدِي كِتَابٌ (আমার কাছে বই আছে)।',
        'সামনে ও পিছনে: أَمَامَ (সামনে), وَرَاءَ / خَلْفَ (পিছনে)।',
        'উপরে ও নিচে: فَوْقَ (উপরে), تَحْتَ (নিচে)।',
        'স্থান জানতে প্রশ্ন: أَيْنَ؟ (কোথায়?)।'
      ]
    },
    vocabulary,
    sentences,
    dialogues,
    tamrinKitabi,
    quiz: quizLegacy,
    bookStages
  }
};
