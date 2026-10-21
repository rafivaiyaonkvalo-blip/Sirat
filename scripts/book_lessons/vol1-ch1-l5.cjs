// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৫ম দারস (বই পৃষ্ঠা ৩৪–৩৭, PDF পৃষ্ঠা ৩২–৩৫)
// বিষয়: আপন জিনিস ও সম্পর্কের পরিচয় (كِتَابِي / كِتَابُكَ / كِتَابُهُ)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ।

const W = {
  // পৃ. ৩৪ কিতাবের ছক
  kitabi: { arabic: 'كِتَابِي', bangla: 'আমার বই', picture: 'book' },
  kitabuka: { arabic: 'كِتَابُكَ', bangla: 'তোমার বই (পুং)', picture: 'book' },
  kitabuki: { arabic: 'كِتَابُكِ', bangla: 'তোমার বই (স্ত্রী)', picture: 'book' },
  kitabuhu: { arabic: 'كِتَابُهُ', bangla: 'তার বই (পুং)', picture: 'book' },
  kitabuha: { arabic: 'كِتَابُهَا', bangla: 'তার বই (স্ত্রী)', picture: 'book' },

  qalami: { arabic: 'قَلَمِي', bangla: 'আমার কলম', picture: 'pen' },
  saati: { arabic: 'سَاعَتِي', bangla: 'আমার ঘড়ি', picture: 'clock' },
  haqibati: { arabic: 'حَقِيبَتِي', bangla: 'আমার ব্যাগ', picture: 'bag' },
  kurrasati: { arabic: 'كُرَّاسَتِي', bangla: 'আমার খাতা', picture: 'notebook' },
  ghurfati: { arabic: 'غُرْفَتِي', bangla: 'আমার কামরা', picture: 'room' },
  firashi: { arabic: 'فِرَاشِي', bangla: 'আমার বিছানা', picture: 'bedding' },
  libasuka: { arabic: 'لِبَاسُكَ', bangla: 'তোমার পোশাক (পুং)', picture: 'clothing' },

  // পৃ. ৩৪ পরিবারের শব্দ
  ab: { arabic: 'أَبٌ', bangla: 'আব্বা / পিতা' },
  um: { arabic: 'أُمٌّ', bangla: 'আম্মা / মাতা' },
  akh: { arabic: 'أَخٌ', bangla: 'ভাই' },
  ukht: { arabic: 'أُخْتٌ', bangla: 'বোন' },
  amm: { arabic: 'عَمٌّ', bangla: 'চাচা' },
  amma: { arabic: 'عَمَّةٌ', bangla: 'ফুফু' },
  khal: { arabic: 'خَالٌ', bangla: 'মামা' },
  khala: { arabic: 'خَالَةٌ', bangla: 'খালা' },
  jadd: { arabic: 'جَدٌّ', bangla: 'দাদা / নানা' },
  jadda: { arabic: 'جَدَّةٌ', bangla: 'দাদী / নানী' },

  // পৃ. ৩৪ ফুটনোট
  ism: { arabic: 'اِسْمٌ', bangla: 'নাম' },
  sadiq: { arabic: 'صَدِيقٌ', bangla: 'বন্ধু' },
  aduww: { arabic: 'عَدُوٌّ', bangla: 'শত্রু' },

  // পৃ. ৩৫ আব্বা ও ভাই রূপান্তর
  abi: { arabic: 'أَبِي', bangla: 'আমার আব্বা' },
  abuka: { arabic: 'أَبُوكَ', bangla: 'তোমার আব্বা (পুং)' },
  abuki: { arabic: 'أَبُوكِ', bangla: 'তোমার আব্বা (স্ত্রী)' },
  abuhu: { arabic: 'أَبُوهُ', bangla: 'তার আব্বা (পুং)' },
  abuha: { arabic: 'أَبُوهَا', bangla: 'তার আব্বা (স্ত্রী)' },

  akhi: { arabic: 'أَخِي', bangla: 'আমার ভাই' },
  akhuka: { arabic: 'أَخُوكَ', bangla: 'তোমার ভাই (পুং)' },
  akhuki: { arabic: 'أَخُوكِ', bangla: 'তোমার ভাই (স্ত্রী)' },
  akhuhu: { arabic: 'أَخُوهُ', bangla: 'তার ভাই (পুং)' },
  akhuha: { arabic: 'أَخُوهَا', bangla: 'তার ভাই (স্ত্রী)' },

  // পৃ. ৩৫ ফুটনোট
  rab: { arabic: 'رَبٌّ', bangla: 'প্রতিপালক' },
  din: { arabic: 'دِينٌ', bangla: 'ধর্ম / দ্বীন' },
  tayyib: { arabic: 'طَيِّبٌ', bangla: 'উত্তম / ভালো' },
  iqd: { arabic: 'عِقْدٌ', bangla: 'একটি হার', picture: 'necklace' },

  // পৃ. ৩৭ বহুবচন যমীর
  kitabuna: { arabic: 'كِتَابُنَا', bangla: 'আমাদের বই', picture: 'book' },
  kitabukum: { arabic: 'كِتَابُكُمْ', bangla: 'তোমাদের বই (পুং)', picture: 'book' },
  kitabukunna: { arabic: 'كِتَابُكُنَّ', bangla: 'তোমাদের বই (স্ত্রী)', picture: 'book' },
  kitabuhum: { arabic: 'كِتَابُهُمْ', bangla: 'তাদের বই (পুং)', picture: 'book' },
  kitabuhunna: { arabic: 'كِتَابُهُنَّ', bangla: 'তাদের বই (স্ত্রী)', picture: 'book' },
  daruna: { arabic: 'دَارُنَا', bangla: 'আমাদের বাড়ি / গৃহ', picture: 'house' }
};

const T = (arabic, bangla, page, picture, distance) => ({ arabic, bangla, page, picture, distance });

const SENT = {
  // পৃ. ৩৫
  anaTilmidh: T('أَنَا تِلْمِيذٌ', 'আমি একজন ছাত্র', '৩৫'),
  ismiShahid: T('اِسْمِي شَاهِدٌ', 'আমার নাম শাহিদ', '৩৫'),
  hathaKitabi: T('هٰذَا كِتَابِي', 'ইহা আমার বই', '৩৫', 'book', 'near'),
  dhalikaQalami: T('ذٰلِكَ قَلَمِي', 'উহা আমার কলম', '৩৫', 'pen', 'far'),
  hathihiHaqibati: T('هٰذِهِ حَقِيبَتِي', 'ইহা আমার ব্যাগ', '৩৫', 'bag', 'near'),
  tilkaKurrasati: T('تِلْكَ كُرَّاسَتِي', 'উহা আমার খাতা', '৩৫', 'notebook', 'far'),
  kitabiJadid: T('كِتَابِي جَدِيدٌ', 'আমার বই নতুন', '৩৫', 'book'),
  qalamiJayyid: T('قَلَمِي جَيِّدٌ', 'আমার কলম ভালো', '৩৫', 'pen'),
  haqibatiJadida: T('حَقِيبَتِي جَدِيدَةٌ', 'আমার ব্যাগ নতুন', '৩৫', 'bag'),
  kurrasatiJayyida: T('كُرَّاسَتِي جَيِّدَةٌ', 'আমার খাতা ভালো', '৩৫', 'notebook'),

  fatimaUkhti: T('فَاطِمَةُ أُخْتِي وَأَنَا أَخُوهَا', 'ফাতেমা আমার বোন এবং আমি তার ভাই', '৩৫'),
  hathihiGhurfati: T('هٰذِهِ غُرْفَتِي', 'ইহা আমার কামরা', '৩৫', 'room', 'near'),
  ghurfatiNazifa: T('غُرْفَتِي نَظِيفَةٌ وَفِرَاشِي نَظِيفٌ', 'আমার কামরা পরিচ্ছন্ন এবং আমার বিছানা পরিচ্ছন্ন', '৩৫'),
  bashirMuallimi: T('بَشِيرٌ مُعَلِّمِي وَأَنَا تِلْمِيذُهُ', 'বশীর আমার শিক্ষক এবং আমি তার ছাত্র', '৩৫'),
  hathaQalamuhu: T('هٰذَا قَلَمُهُ وَتِلْكَ سَاعَتُهُ', 'এটি তার কলম এবং ওটি তার ঘড়ি', '৩৫'),
  qalamuhuJadid: T('قَلَمُهُ جَدِيدٌ وَسَاعَتُهُ جَدِيدَةٌ', 'তার কলম নতুন এবং তার ঘড়ি নতুন', '৩৫'),

  hatharRajuluAbi: T('هٰذَا الرَّجُلُ أَبِي وَأَبُوكِ', 'এই লোকটি আমার ও তোমার আব্বা', '৩৫'),
  tilkalMarAtuUmmi: T('تِلْكَ الْمَرْأَةُ أُمِّي وَأُمُّكِ', 'ঐ মহিলাটি আমার ও তোমার আম্মা', '৩৫'),
  abunaRajulTayyib: T('أَبُونَا رَجُلٌ طَيِّبٌ', 'আমাদের আব্বা একজন ভালো মানুষ', '৩৫'),
  ummunaImraATayyiba: T('أُمُّنَا امْرَأَةٌ طَيِّبَةٌ', 'আমাদের আম্মা একজন ভালো মহিলা', '৩৫'),

  dhalikalWaladuSadiqi: T('ذٰلِكَ الْوَلَدُ صَدِيقِي', 'ঐ ছেলেটি আমার বন্ধু', '৩৫'),
  tilkalBintSadiqatuki: T('تِلْكَ الْبِنْتُ صَدِيقَتُكِ', 'ঐ মেয়েটি তোমার বান্ধবী', '৩৫'),
  sadiqiTilmidhDhaki: T('صَدِيقِي تِلْمِيذٌ ذَكِيٌّ', 'আমার বন্ধু মেধাবী ছাত্র', '৩৫'),
  sadiqatukiTilmidhaDhakiyya: T('صَدِيقَتُكِ تِلْمِيذَةٌ ذَكِيَّةٌ', 'তোমার বান্ধবী মেধাবী ছাত্রী', '৩৫'),

  yaMahmudLibasukaJadid: T('يَا مَحْمُودُ! لِبَاسُكَ جَدِيدٌ', 'হে মাহমূদ! তোমার পোশাক নতুন', '৩৫'),
  hathihiGhurfatuka: T('هٰذِهِ غُرْفَتُكَ', 'এটি তোমার কামরা', '৩৫'),
  ghurfatukaKabira: T('غُرْفَتُكَ كَبِيرَةٌ وَجَمِيلَةٌ', 'তোমার কামরা বড় ও সুন্দর', '৩৫'),

  // পৃ. ৩৭
  allahuRabbuna: T('اَللهُ رَبُّنَا وَرَبُّكُمْ', 'আল্লাহ আমাদের ও তোমাদের রব', '৩৭'),
  muhammadNabiyyuna: T('مُحَمَّدٌ نَبِيُّنَا وَنَبِيُّكُمْ', 'মুহাম্মদ আমাদের ও তোমাদের নবী', '৩৭'),
  alIslamuDinuna: T('اَلْإِسْلَامُ دِينُنَا وَدِينُكُمْ', 'ইসলাম আমাদের ও তোমাদের দ্বীন', '৩৭'),
  alQuranuKitabuna: T('اَلْقُرْآنُ كِتَابُنَا وَكِتَابُكُمْ', 'কুরআন আমাদের ও তোমাদের কিতাব', '৩৭'),
  alJannatuDaruna: T('اَلْجَنَّةُ دَارُنَا وَدَارُكُمْ', 'জান্নাত আমাদের ও তোমাদের বাড়ি', '৩৭'),
  alKabatuQiblatuna: T('اَلْكَعْبَةُ قِبْلَتُنَا وَقِبْلَتُكُمْ', 'কাবা আমাদের ও তোমাদের কিবলা', '৩৭'),
  alQabruBaytuna: T('اَلْقَبْرُ بَيْتُنَا وَبَيْتُكُمْ', 'কবর আমাদের ও তোমাদের ঘর', '৩৭')
};

const QA = [
  // পৃ. ৩৬
  {
    q: T('مَا اسْمُكَ يَا وَلَدُ؟', 'হে ছেলে, তোমার নাম কী?'),
    a: T('اِسْمِي شَاهِدٌ', 'আমার নাম শাহিদ'),
    wrong: ['اِسْمِي فَاطِمَةُ', 'هُوَ شَاهِدٌ']
  },
  {
    q: T('هَلْ هٰذَا قَلَمُكَ؟', 'এটি কি তোমার কলম?'),
    a: T('نَعَمْ .. هٰذَا قَلَمِي', 'হাঁ.. এটি আমার কলম'),
    wrong: ['لَا .. هٰذَا قَلَمِي', 'نَعَمْ .. هٰذَا قَلَمُكَ']
  },
  {
    q: T('كَيْفَ قَلَمُكَ؟', 'তোমার কলমটি কেমন?'),
    a: T('قَلَمِي جَيِّدٌ', 'আমার কলম ভালো'),
    wrong: ['قَلَمِي جَيِّدَةٌ', 'سَاعَتِي جَمِيلَةٌ']
  },
  {
    q: T('هَلْ فَاطِمَةُ أُخْتُكَ؟', 'ফাতেমা কি তোমার বোন?'),
    a: T('نَعَمْ .. فَاطِمَةُ أُخْتِي', 'হাঁ.. ফাতেমা আমার বোন'),
    wrong: ['نَعَمْ .. هُوَ أَخِي', 'لَا .. فَاطِمَةُ أُخْتِي']
  },
  {
    q: T('كَيْفَ أُخْتُكَ؟', 'তোমার বোন কেমন?'),
    a: T('هِيَ بِنْتٌ طَيِّبَةٌ', 'সে একজন ভালো মেয়ে'),
    wrong: ['هُوَ وَلَدٌ طَيِّبٌ', 'هِيَ بِنْتٌ طَيِّبٌ']
  },
  {
    q: T('يَا زَيْنَبُ! هَلْ هٰذَا عِقْدُكِ؟', 'হে যায়নাব! এটি কি তোমার হার?'),
    a: T('نَعَمْ .. هٰذَا عِقْدِي', 'হাঁ.. এটি আমার হার'),
    wrong: ['نَعَمْ .. هٰذَا عِقْدُكِ', 'لَا .. هٰذَا قَلَمِي']
  },
  {
    q: T('كَيْفَ عِقْدُكِ؟', 'তোমার হার কেমন?'),
    a: T('عِقْدِي جَمِيلٌ', 'আমার হার সুন্দর'),
    wrong: ['عِقْدِي جَمِيلَةٌ', 'سَاعَتِي جَدِيدَةٌ']
  },
  {
    q: T('هَلْ أَخُوكَ تَاجِرٌ؟', 'তোমার ভাই কি ব্যবসায়ী?'),
    a: T('لَا .. أَخِي فَلَّاحٌ', 'না.. আমার ভাই কৃষক'),
    wrong: ['نَعَمْ .. أَخِي فَلَّاحٌ', 'لَا .. أُخْتِي فَلَّاحَةٌ']
  },
  // পৃ. ৩৭
  {
    q: T('مَنْ رَبُّكَ يَا مُسْلِمُ؟', 'হে মুসলিম, তোমার রব কে?'),
    a: T('رَبِّيَ اللهُ', 'আমার রব আল্লাহ'),
    wrong: ['رَبُّكَ اللهُ', 'دِينِيَ الْإِسْلَامُ']
  },
  {
    q: T('مَا دِينُكَ يَا وَلَدُ؟', 'হে ছেলে, তোমার দ্বীন কী?'),
    a: T('دِينِيَ الْإِسْلَامُ', 'আমার দ্বীন ইসলাম'),
    wrong: ['دِينُكَ الْإِسْلَامُ', 'رَبِّيَ اللهُ']
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
      id: 'l5-words-1',
      titleBn: 'শব্দার্থ: আপন জিনিস (১/৩)',
      shortTitle: 'আপন জিনিস',
      titleAr: 'الْمُفْرَدَاتُ: الْمِلْكِيَّةُ',
      desc: 'আমার বই, তোমার বই, তার বই',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৩৪'
    },
    [
      intro(W.kitabi), intro(W.kitabuka), intro(W.kitabuki),
      match([W.kitabi, W.kitabuka, W.kitabuki, W.kitabuhu]),
      intro(W.kitabuhu), intro(W.kitabuha),
      intro(W.qalami), intro(W.saati),
      pictureChoice('kitabi', ['qalami', 'saati', 'haqibati']),
      meaningOf(W.kitabi, ['তোমার বই', 'তার বই']),
      arabicOf(W.kitabuki, ['كِتَابُكَ', 'كِتَابِي'])
    ]
  ),

  stage(
    {
      id: 'l5-grammar-damir',
      titleBn: 'ক্বায়েদা: যমীর (আমার, তোমার, তার)',
      shortTitle: 'যমীরের নিয়ম',
      titleAr: 'قَاعِدَةُ الضَّمَائِرِ',
      desc: 'শব্দের শেষে ي, كَ, كِ, هُ, هَا যুক্ত করার নিয়ম',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '৩৪'
    },
    [
      {
        type: 'grammar_card',
        title: 'সর্বনাম বা যমীর যুক্ত করা',
        summary: 'আমার জিনিস বলতে শেষে ي যুক্ত হয়। পুরুষের তোমার বলতে ـكَ এবং নারীর তোমার বলতে ـكِ হয়। পুরুষের তার বলতে ـهُ এবং নারীর তার বলতে ـهَا হয়।',
        table: [
          { arabic: 'كِتَابِي', bangla: 'আমার বই' },
          { arabic: 'كِتَابُكَ - كِتَابُكِ', bangla: 'তোমার বই (পুং - স্ত্রী)' },
          { arabic: 'كِتَابُهُ - كِتَابُهَا', bangla: 'তার বই (পুং - স্ত্রী)' }
        ]
      },
      spot('আমার বই', 'كِتَابِي', 'كِتَابُي', 'নিজের জিনিস বোঝাতে শেষে যেরসহ ي যুক্ত হয়।'),
      spot('তোমার কলম (পুরুষকে)', 'قَلَمُكَ', 'قَلَمُكِ', 'পুরুষকে সম্বোধন করতে যবরযুক্ত كَ বসে।'),
      spot('তার ঘড়ি (নারীর)', 'سَاعَتُهَا', 'سَاعَتُهُ', 'স্ত্রীলিঙ্গের জন্য هَا বসে।'),
      fill(SENT.hathaKitabi, 1, ['كِتَابُكَ', 'كِتَابُهُ']),
      arabicOf(W.kitabuka, ['كِتَابِي', 'كِتَابُكِ']),
      meaningOf(W.kitabuha, ['তার বই (পুরুষ)', 'আমার বই'])
    ]
  ),

  stage(
    {
      id: 'l5-words-family',
      titleBn: 'শব্দার্থ: পরিবার ও আত্মীয় (২/৩)',
      shortTitle: 'পরিবার',
      titleAr: 'الْمُفْرَدَاتُ: الأُسْرَةُ',
      desc: 'আব্বা, আম্মা, ভাই, বোন, চাচা, ফুফু',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৩৪'
    },
    [
      intro(W.ab), intro(W.um), intro(W.akh), intro(W.ukht),
      match([W.ab, W.um, W.akh, W.ukht]),
      intro(W.amm), intro(W.amma), intro(W.khal), intro(W.khala),
      match([W.amm, W.amma, W.khal, W.khala]),
      intro(W.jadd), intro(W.jadda),
      match([W.jadd, W.jadda, W.sadiq, W.aduww])
    ]
  ),

  stage(
    {
      id: 'l5-grammar-ab-akh',
      titleBn: 'ক্বায়েদা: আব্বা ও ভাই রূপান্তর',
      shortTitle: 'أَب ও أَخ এর রূপ',
      titleAr: 'قَاعِدَةُ الأَبِ وَالأَخِ',
      desc: 'أَبِي থেকে أَبُوكَ এবং أَخِي থেকে أَخُوكَ তৈরির বিশেষ কায়দা',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '৩৫'
    },
    [
      {
        type: 'grammar_card',
        title: 'أَبٌ ও أَخٌ শব্দের সাথে যমীর যোগ',
        summary: 'أَبٌ এবং أَخٌ শব্দের সাথে যখন كَ, كِ, هُ, هَا যুক্ত হয়, তখন মাঝখানে একটি ওয়াও (و) বৃদ্ধি পায়: যেমন أَبُوكَ, أَخُوكَ, أَبُوهَا ইত্যাদি। তবে আমার বলতে শুধু أَبِي ও أَخِي হয়।',
        table: [
          { arabic: 'أَبِي - أَبُوكَ - أَبُوكِ - أَبُوهُ - أَبُوهَا', bangla: 'আমার আব্বা - তোমার আব্বা - তার আব্বা' },
          { arabic: 'أَخِي - أَخُوكَ - أَخُوكِ - أَخُوهُ - أَخُوهَا', bangla: 'আমার ভাই - তোমার ভাই - তার ভাই' }
        ]
      },
      spot('তোমার আব্বা (পুরুষ)', 'أَبُوكَ', 'أَبَكَ', 'أَب এর সাথে كَ যুক্ত হলে মাঝখানে و বাড়ে: أَبُوكَ।'),
      spot('তার ভাই (স্ত্রী)', 'أَخُوهَا', 'أَخَهَا', 'أَخ এর সাথে هَا যুক্ত হলে মাঝখানে و বাড়ে: أَخُوهَا।'),
      fill(SENT.fatimaUkhti, 0, ['فَاطِمَةِ', 'فَاطِمَةً']),
      arabicOf(W.abuki, ['أَبُوكَ', 'أَبِي']),
      meaningOf(W.akhuha, ['তার ভাই (পুরুষ)', 'আমার ভাই']),
      arabicOf(W.abuhu, ['أَبُوهَا', 'أَبُوكَ'])
    ]
  ),

  stage(
    {
      id: 'l5-sentences-1',
      titleBn: 'কিতাবের বাক্য: ব্যক্তিগত পরিচয় (১/২)',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'আমি ছাত্র, আমার নাম শাহিদ, এটি আমার কামরা',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৫'
    },
    [
      introSentence(SENT.anaTilmidh),
      introSentence(SENT.ismiShahid),
      introSentence(SENT.hathaKitabi),
      introSentence(SENT.dhalikaQalami),
      build(SENT.kitabiJadid, ['قَدِيمٌ', 'قَلَمِي']),
      introSentence(SENT.fatimaUkhti),
      introSentence(SENT.ghurfatiNazifa),
      introSentence(SENT.bashirMuallimi),
      build(SENT.bashirMuallimi, ['تِلْمِيذِي', 'مُعَلِّمُهُ']),
      fill(SENT.hathihiHaqibati, 1, ['حَقِيبَتُكَ', 'حَقِيبَتُهُ']),
      spot('আমার কামরা পরিচ্ছন্ন', 'غُرْفَتِي نَظِيفَةٌ', 'غُرْفَتِي نَظِيفٌ', 'غرفة স্ত্রীবাচক শব্দ, তাই نظيفة হবে।')
    ]
  ),

  stage(
    {
      id: 'l5-words-plural',
      titleBn: 'শব্দার্থ: আমাদের ও তোমাদের (৩/৩)',
      shortTitle: 'আমাদের ও তোমাদের',
      titleAr: 'الْمُفْرَدَاتُ: ضَمَائِرُ الْجَمْعِ',
      desc: 'আমাদের বই, তোমাদের বই, আমাদের বাড়ি',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৩৭'
    },
    [
      intro(W.kitabuna), intro(W.kitabukum), intro(W.kitabuhum), intro(W.daruna),
      match([W.kitabuna, W.kitabukum, W.kitabuhum, W.daruna]),
      intro(W.rab), intro(W.din), intro(W.tayyib), intro(W.iqd),
      pictureChoice('iqd', ['kitabi', 'qalami', 'saati']),
      match([W.rab, W.din, W.tayyib, W.iqd]),
      arabicOf(W.kitabuna, ['كِتَابُكُمْ', 'كِتَابِي']),
      meaningOf(W.daruna, ['তোমাদের বাড়ি', 'তাদের বাড়ি'])
    ]
  ),

  stage(
    {
      id: 'l5-sentences-2',
      titleBn: 'কিতাবের বাক্য: ঈমান ও বিশ্বাস (২/২)',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'আল্লাহ আমাদের রব, ইসলাম আমাদের দ্বীন, জান্নাত আমাদের ঘর',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৭'
    },
    [
      introSentence(SENT.allahuRabbuna),
      introSentence(SENT.muhammadNabiyyuna),
      introSentence(SENT.alIslamuDinuna),
      introSentence(SENT.alQuranuKitabuna),
      introSentence(SENT.alJannatuDaruna),
      build(SENT.allahuRabbuna, ['رَبِّي', 'رَبُّكَ']),
      build(SENT.alIslamuDinuna, ['دِينِي', 'دِينُكَ']),
      fill(SENT.alQuranuKitabuna, 1, ['كِتَابُكُمْ', 'كِتَابِي']),
      spot('আল্লাহ আমাদের ও তোমাদের রব', 'اَللهُ رَبُّنَا وَرَبُّكُمْ', 'اَللهُ رَبَّنَا وَرَبَّكُمْ', 'বাক্যের শুরুতে مبتدأ ও খবর পেশযুক্ত হয়।'),
      meaningOf(SENT.alJannatuDaruna, ['জান্নাত আল্লাহর ঘর', 'কাবা আমাদের কিবলা'])
    ]
  ),

  stage(
    {
      id: 'l5-dialogue',
      titleBn: 'কিতাবের প্রশ্নোত্তর',
      shortTitle: 'প্রশ্নোত্তর',
      titleAr: 'الْحِوَارُ وَالأَسْئِلَةُ',
      desc: 'তোমার নাম কী? এটি কি তোমার কলম? তোমার রব কে?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৬–৩৭'
    },
    [
      dialogue(QA[0]),
      dialogue(QA[1]),
      dialogue(QA[2]),
      dialogue(QA[3]),
      dialogue(QA[4]),
      dialogue(QA[5]),
      dialogue(QA[6]),
      dialogue(QA[8]),
      dialogue(QA[9])
    ]
  ),

  stage(
    {
      id: 'l5-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الاخْتِبَارُ النِّهَائِيُّ',
      desc: '৫ম পাঠের অর্জিত জ্ঞানের পূর্ণাঙ্গ মূল্যায়ন',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '৩৪–৩৭'
    },
    [
      quiz("'আমার বই' এর সঠিক আরবি কোনটি?", ['كِتَابِي', 'كِتَابُكَ', 'كِتَابُهُ'], 'নিজের জিনিস বোঝাতে শব্দের শেষে ي যুক্ত হয়।'),
      quiz("একজন পুরুষকে 'তোমার কলম' বলতে কোনটি বলবেন?", ['قَلَمُكَ', 'قَلَمُكِ', 'قَلَمِي'], 'পুরুষকে সম্বোধন করতে ـكَ ব্যবহৃত হয়।'),
      quiz("একজন নারীকে 'তোমার ঘড়ি' বলতে কোনটি বলবেন?", ['سَاعَتُكِ', 'سَاعَتُكَ', 'سَاعَتُهَا'], 'নারীকে সম্বোধন করতে ـكِ ব্যবহৃত হয়।'),
      quiz("'أَخُوهَا' কথাটির অর্থ কী?", ['তার ভাই (স্ত্রী)', 'তার ভাই (পুরুষ)', 'আমার ভাই'], 'ـهَا সর্বনামটি স্ত্রীবাচকের জন্য ব্যবহৃত হয়।'),
      quiz("'أَبُوكَ' শব্দটিতে অতিরিক্ত কোন হরফ এসেছে?", ['واو (و)', 'ياء (ي)', 'ألف (ا)'], 'أَبٌ এর সাথে যমীর যুক্ত হলে মাঝখানে واو বাড়ে।'),
      quiz("'اَللهُ رَبُّنَا' বাক্যটির অর্থ কী?", ['আল্লাহ আমাদের প্রতিপালক', 'আল্লাহ তোমার রব', 'আল্লাহ এক'], 'رَبُّنَا অর্থ আমাদের রব বা প্রতিপালক।'),
      quiz("'فَاطِمَةُ أُخْتِي وَأَنَا ......' খালি জায়গায় কী বসবে?", ['أَخُوهَا', 'أَخُوهُ', 'أُخْتُهَا'], 'বক্তা পুরুষ এবং ফাতেমা নারী, তাই "তার ভাই" = أَخُوهَا।'),
      quiz("'عِقْدٌ' শব্দের অর্থ কী?", ['একটি হার', 'একটি ঘড়ি', 'একটি আংটি'], 'عِقْدٌ অর্থ একটি হার।'),
      quiz("'আমাদের কিতাব' এর আরবি রূপ কোনটি?", ['كِتَابُنَا', 'كِتَابُكُمْ', 'كِتَابُهُمْ'], 'আমাদের বোঝাতে ـنَا যুক্ত হয়।'),
      quiz("'كِتَابُكُمْ' বলতে কাদের বই বোঝায়?", ['তোমাদের বই (পুরুষ)', 'তাদের বই (পুরুষ)', 'আমাদের বই'], 'كُـمْ বহুবচন পুরুষের জন্য ব্যবহৃত হয়।')
    ]
  )
];

// ---------- চর্চার পর্বসমূহ যোগ ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l5-sentences-1', stage(
  {
    id: 'l5-practice-1',
    titleBn: 'চর্চা ১: পরিবার ও আপন জিনিস',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'পরিবারের শব্দ ও ব্যক্তিবাচক যমীরের মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৩৪–৩৫'
  },
  [
    match([W.ab, W.um, W.akh, W.ukht]),
    match([W.kitabi, W.kitabuka, W.kitabuhu, W.kitabuha]),
    fill(SENT.hathihiGhurfatuka, 1, ['غُرْفَتِي', 'غُرْفَتُكِ']),
    build(SENT.yaMahmudLibasukaJadid, ['نَظِيفَةٌ', 'لِبَاسُكِ']),
    spot('ফাতেমা আমার বোন', 'فَاطِمَةُ أُخْتِي', 'فَاطِمَةُ أَخِي', 'ফাতেমা মেয়ে, তাই أُخْتِي হবে।'),
    arabicOf(W.akhuka, ['أَخُوكِ', 'أَخِي']),
    meaningOf(W.kitabuna, ['তোমাদের বই', 'তার বই']),
    build(SENT.abunaRajulTayyib, ['امْرَأَةٌ', 'طَيِّبَةٌ']),
    fill(SENT.tilkalBintSadiqatuki, 2, ['صَدِيقُكِ', 'صَدِيقَتِي']),
    match([W.sadiq, W.aduww, W.tayyib, W.iqd])
  ]
));

insertAfter('l5-dialogue', stage(
  {
    id: 'l5-practice-2',
    titleBn: 'চর্চা ২: যমীর ও সম্বন্ধ ভাগ',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'পুরুষ ও স্ত্রী যমীর চিহ্নিতকরণ ও বাক্য মেলানো',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৩৫–৩৭'
  },
  [
    {
      type: 'sort_groups',
      title: 'শব্দটি পুরুষবাচক (ـكَ / ـهُ) না স্ত্রীবাচক (ـكِ / ـهَا)?',
      groups: [
        { id: 'm', arabic: 'পুরুষবাচক (ـكَ / ـهُ)' },
        { id: 'f', arabic: 'স্ত্রীবাচক (ـكِ / ـهَا)' }
      ],
      items: [
        { arabic: 'كِتَابُكَ', reveal: 'كِتَابُكَ (তোমার বই - পুং)', group: 'm' },
        { arabic: 'كِتَابُكِ', reveal: 'كِتَابُكِ (তোমার বই - স্ত্রী)', group: 'f' },
        { arabic: 'قَلَمُهُ', reveal: 'قَلَمُهُ (তার কলম - পুং)', group: 'm' },
        { arabic: 'سَاعَتُهَا', reveal: 'سَاعَتُهَا (তার ঘড়ি - স্ত্রী)', group: 'f' },
        { arabic: 'أَبُوكَ', reveal: 'أَبُوكَ (তোমার আব্বা - পুং)', group: 'm' },
        { arabic: 'أَخُوهَا', reveal: 'أَخُوهَا (তার ভাই - স্ত্রী)', group: 'f' }
      ]
    },
    fill(SENT.hathaQalamuhu, 0, ['هٰذِهِ', 'تِلْكَ']),
    build(SENT.alJannatuDaruna, ['دَارِي', 'دَارُكَ']),
    spot('তার ঘড়ি নতুন (নারীর)', 'سَاعَتُهَا جَدِيدَةٌ', 'سَاعَتُهُ جَدِيدَةٌ', 'নারীর ঘড়ি বোঝাতে سَاعَتُهَا হবে।'),
    arabicOf(W.daruna, ['دَارُكُمْ', 'دَارِي']),
    meaningOf(SENT.alQabruBaytuna, ['জান্নাত আমাদের ঘর', 'কাবা আমাদের কিবলা']),
    match([W.kitabuna, W.kitabukum, W.daruna, W.rab])
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
  page: '৩৬-৩৭'
}));

const tamrinKitabi = [
  {
    task: 'বাংলায় অনুবাদ করো',
    arabic: 'هٰذَا كِتَابِي وَذٰلِكَ قَلَمُكَ.',
    bangla: 'এটি আমার বই এবং ওটি তোমার বই।'
  },
  {
    task: 'আরবিতে বলো ও লেখো',
    arabic: 'فَاطِمَةُ أُخْتِي وَأَنَا أَخُوهَا.',
    bangla: 'ফাতেমা আমার বোন এবং আমি তার ভাই।'
  },
  {
    task: 'শূন্যস্থান পূরণ করো',
    arabic: 'اَللهُ رَبُّنَا وَرَبُّكُمْ ، مُحَمَّدٌ نَبِيُّنَا وَنَبِيُّكُمْ.',
    bangla: 'আল্লাহ আমাদের ও তোমাদের রব, মুহাম্মদ আমাদের ও তোমাদের নবী।'
  },
  {
    task: 'সম্পর্কের রূপান্তর মুখে মুখে বলো',
    arabic: 'أَبِي - أَبُوكَ - أَبُوكِ - أَبُوهُ - أَبُوهَا',
    bangla: 'আমার আব্বা - তোমার আব্বা - তার আব্বা'
  }
];

const quizLegacy = bookStages
  .find(s => s.id === 'l5-quiz')
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
    id: 'l5-q-damir',
    stageId: 'l5-grammar-damir',
    title: 'সর্বনাম বা যমীর যুক্ত করা (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'كِتَابِي', bangla: 'আমার বই' },
      { arabic: 'كِتَابُكَ', bangla: 'তোমার বই (পুং)' },
      { arabic: 'كِتَابُكِ', bangla: 'তোমার বই (স্ত্রী)' },
      { arabic: 'كِتَابُهُ', bangla: 'তার বই (পুং)' },
      { arabic: 'كِتَابُهَا', bangla: 'তার বই (স্ত্রী)' }
    ],
    rule: 'শব্দের শেষে ي যুক্ত করলে "আমার", পুরুষকে ـكَ ও নারীকে ـكِ বললে "তোমার", এবং পুরুষকে ـهُ ও নারীকে ـهَا বললে "তার" বোঝায়।',
    examples: [{ arabic: 'هٰذَا كِتَابِي وَذٰلِكَ قَلَمُكَ', bangla: 'এটি আমার বই এবং ওটি তোমার কলম' }]
  },
  {
    id: 'l5-q-ab-akh',
    stageId: 'l5-grammar-ab-akh',
    title: 'أَبٌ ও أَخٌ এর বিশেষ রূপ (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'أَبِي / أَخِي', bangla: 'আমার আব্বা / আমার ভাই' },
      { arabic: 'أَبُوكَ / أَخُوكَ', bangla: 'তোমার আব্বা / তোমার ভাই (পুং)' },
      { arabic: 'أَبُوهُ / أَخُوهُ', bangla: 'তার আব্বা / তার ভাই (পুং)' }
    ],
    rule: 'أَبٌ এবং أَخٌ শব্দের সাথে ي ছাড়া অন্য যমীর যুক্ত হলে মাঝখানে ওয়াও (و) বৃদ্ধি পায়: যেমন أَبُوكَ এবং أَخُوهَا।',
    examples: [{ arabic: 'فَاطِمَةُ أُخْتِي وَأَنَا أَخُوهَا', bangla: 'ফাতেমা আমার বোন এবং আমি তার ভাই' }]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l5',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৩৪-৩৭',
    qaida,
    grammarRule: {
      title: 'আপন জিনিস ও সম্পর্কের পরিচয় (كِتَابِي / كِتَابُكَ / كِتَابُهُ)',
      summary: 'সর্বনাম বা যমীর যুক্ত করে নিজের, অপরের ও অনুপস্থিত ব্যক্তির জিনিস প্রকাশ করা।',
      points: [
        'আমার জিনিস বলতে ي যুক্ত হয়: كِتَابِي (আমার বই)।',
        'তোমার জিনিস বলতে পুরুষকে ـكَ এবং নারীকে ـكِ বলুন: كِتَابُكَ, كِتَابُكِ।',
        'তার জিনিস বলতে পুরুষকে ـهُ এবং নারীকে ـهَا বলুন: كِتَابُهُ, كِتَابُهَا।',
        'أَبٌ ও أَخٌ এর ক্ষেত্রে ওয়াও বৃদ্ধি পায়: أَبُوكَ, أَخُوهَا।'
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
