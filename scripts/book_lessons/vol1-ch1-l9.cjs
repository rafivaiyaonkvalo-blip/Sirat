// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৯ম দারস (বই পৃষ্ঠা ৪৭–৪৯, PDF পৃষ্ঠা ৪৫–৪৭)
// বিষয়: বাস্তব জীবনের কথোপকথন ও অনুশীলন (الحِوَارَاتُ الشَّامِلَةُ وَالتَّطْبِيقَاتُ الحَيَّةُ)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ।

const W = {
  // পৃ. ৪৭ বিমানবন্দর ও গতি
  asimah: { arabic: 'عَاصِمَةٌ', bangla: 'রাজধানী' },
  matar: { arabic: 'مَطَارٌ', bangla: 'একটি বিমানবন্দর' },
  taira: { arabic: 'طَائِرَةٌ', bangla: 'একটি বিমান', picture: 'airplane' },
  sari: { arabic: 'سَرِيعٌ', bangla: 'দ্রুতগামী' },
  saria: { arabic: 'سَرِيعَةٌ', bangla: 'দ্রুতগামী (স্ত্রী)' },
  bati: { arabic: 'بَطِيءٌ', bangla: 'ধীরগামী' },
  batia: { arabic: 'بَطِيئَةٌ', bangla: 'ধীরগামী (স্ত্রী)' },
  warda: { arabic: 'وَرْدَةٌ', bangla: 'একটি গোলাপ', picture: 'flower' },
  zahra: { arabic: 'زَهْرَةٌ', bangla: 'একটি ফুল', picture: 'flower' },
  fakiha: { arabic: 'فَاكِهَةٌ', bangla: 'একটি ফল' },
  ladhidh: { arabic: 'لَذِيذٌ', bangla: 'সুস্বাদু' },
  ladhidha: { arabic: 'لَذِيذَةٌ', bangla: 'সুস্বাদু (স্ত্রী)' },

  // পৃ. ৪৮
  mindada: { arabic: 'مِنْضَدَةٌ', bangla: 'একটি তেপায়া / টেবিল', picture: 'table' },
  yad: { arabic: 'يَدٌ', bangla: 'হাত' },
  kura: { arabic: 'كُرَةٌ', bangla: 'একটি বল', picture: 'ball' },
  laib: { arabic: 'لَاعِبٌ', bangla: 'একজন খেলোয়াড়' },
  laiba: { arabic: 'لَاعِبَةٌ', bangla: 'একজন খেলোয়াড় (স্ত্রী)' },
  sayyara: { arabic: 'سَيَّارَةٌ', bangla: 'একটি গাড়ি', picture: 'car' },
  darraja: { arabic: 'دَرَّاجَةٌ', bangla: 'একটি সাইকেল', picture: 'bicycle' }
};

const T = (arabic, bangla, page, picture, distance) => ({ arabic, bangla, page, picture, distance });

const SENT = {
  // পৃ. ৪৭
  hathaMasjidunJadid: T('هٰذَا مَسْجِدٌ جَدِيدٌ', 'ইহা একটি নতুন মসজিদ', '৪৭', 'mosque'),
  babulMasjidiMaftuh: T('بَابُ الْمَسْجِدِ مَفْتُوحٌ', 'মসজিদের দরজা খোলা', '৪৭', 'door'),
  rashidunAmamalMasjid: T('رَاشِدٌ أَمَامَ الْمَسْجِدِ وَأَخُوهُ فِي الْمَسْجِدِ', 'রাশেদ মসজিদের সামনে এবং তার ভাই মসজিদে', '৪৭'),
  anaAbuRashid: T('أَنَا أَبُو رَاشِدٍ', 'আমি রাশেদের আব্বা', '৪৭'),
  anaMuallimulMadrasa: T('أَنَا مُعَلِّمُ الْمَدْرَسَةِ وَوَلَدِي إِمَامُ الْمَسْجِدِ', 'আমি মাদরাসার শিক্ষক এবং আমার ছেলে মসজিদের ইমাম', '৪৭'),
  waladiAlimunKabir: T('وَلَدِي عَالِمٌ كَبِيرٌ', 'আমার ছেলে বড় আলেম', '৪৭'),
  alKitabuFiGhurfatihi: T('اَلْكِتَابُ فِي غُرْفَتِهِ', 'বইটি তার কামরায় আছে', '৪৭'),
  ismulKitabiNurulIslam: T('اِسْمُ الْكِتَابِ نُورُ الْإِسْلَامِ', 'কিতাবের নাম "নূরুল ইসলাম"', '৪৭'),
  saatukiFawqalMindada: T('سَاعَتُكِ فَوْقَ الْمِنْضَدَةِ', 'তোমার ঘড়ি তেপায়ার উপরে আছে', '৪৭'),
  iqdukiFiSunduqiki: T('عِقْدُكِ فِي صُنْدُوقِكِ', 'তোমার হার তোমার বাক্সে আছে', '৪৭'),
  fiHadiqatikiZahratunJamila: T('فِي حَدِيقَتِكِ زَهْرَةٌ جَمِيلَةٌ', 'তোমার বাগানে সুন্দর ফুল আছে', '৪৭'),

  // পৃ. ৪৮
  hathaMatarulAsima: T('هٰذَا مَطَارُ الْعَاصِمَةِ', 'এটি রাজধানীর বিমানবন্দর', '৪৮'),
  fiMatarilAsimatiTaira: T('فِي مَطَارِ الْعَاصِمَةِ طَائِرَةٌ كَبِيرَةٌ', 'রাজধানীর বিমানবন্দরে বড় বিমান আছে', '৪৮', 'airplane'),
  hathihitTairatuSariatunJiddan: T('هٰذِهِ الطَّائِرَةُ سَرِيعَةٌ جِدًّا', 'এই বিমানটি খুব দ্রুতগামী', '৪৮', 'airplane'),
  fiYadiZaynabaKitab: T('فِي يَدِ زَيْنَبَ كِتَابٌ جَمِيلٌ', 'যায়নাবের হাতে সুন্দর বই আছে', '৪৮'),
  fiKitabihaQissatunJamila: T('فِي كِتَابِهَا قِصَّةٌ جَمِيلَةٌ', 'তার বইয়ে সুন্দর গল্প আছে', '৪৮'),
  hathihiFakihatunLadhidha: T('هٰذِهِ فَاكِهَةٌ لَذِيذَةٌ جِدًّا', 'এটি খুব সুস্বাদু ফল', '৪৮'),
  alFakihatuLadhidha: T('اَلْفَاكِهَةُ لَذِيذَةٌ جِدًّا', 'ফলটি খুব সুস্বাদু', '৪৮'),
  fiHadiqatiBashirinWarda: T('فِي حَدِيقَةِ بَشِيرٍ وَرْدَةٌ كَبِيرَةٌ', 'বশীরের বাগানে একটি বড় গোলাপ আছে', '৪৮'),
  alWardatuJamilatunJiddan: T('اَلْوَرْدَةُ جَمِيلَةٌ جِدًّا', 'গোলাপটি খুব সুন্দর', '৪৮'),
  hathihiKuratunJadida: T('هٰذِهِ كُرَةٌ جَدِيدَةٌ', 'ইহা একটি নতুন বল', '৪৮', 'ball'),
  alKuratuAmamalLaib: T('اَلْكُرَةُ أَمَامَ اللَّاعِبِ', 'বলটি খেলোয়াড়ের সামনে আছে', '৪৮', 'ball')
};

const QA = [
  // পৃ. ৪৯
  {
    q: T('مَنْ أَمَامَ الْمَسْجِدِ وَمَنْ فِي الْمَسْجِدِ؟', 'মসজিদের সামনে কে এবং ভেতরে কে?'),
    a: T('رَاشِدٌ أَمَامَ الْمَسْجِدِ وَأَخُوهُ فِي الْمَسْجِدِ', 'রাশেদ মসজিদের সামনে এবং তার ভাই ভেতরে'),
    wrong: ['رَاشِدٌ فِي الْمَسْجِدِ', 'مَحْمُودٌ أَمَامَ الْمَسْجِدِ']
  },
  {
    q: T('مَنْ زَيْنَبُ وَكَيْفَ هِيَ؟', 'যায়নাব কে এবং সে কেমন?'),
    a: T('زَيْنَبُ بِنْتُ مَاجِدٍ ، هِيَ بِنْتٌ طَيِّبَةٌ جِدًّا', 'যায়নাব মাজেদের মেয়ে, সে খুব ভালো মেয়ে'),
    wrong: ['زَيْنَبُ أُخْتُ بَشِيرٍ', 'هِيَ تِلْمِيذَةٌ مُجْتَهِدَةٌ']
  },
  {
    q: T('مَاذَا فِي يَدِ زَيْنَبَ؟', 'যায়নাবের হাতে কী আছে?'),
    a: T('فِي يَدِهَا كِتَابٌ جَمِيلٌ', 'তার হাতে সুন্দর বই আছে'),
    wrong: ['فِي يَدِهَا كُرَةٌ جَدِيدَةٌ', 'فِي يَدِهَا وَرْدَةٌ']
  },
  {
    q: T('مَاذَا فِي هٰذَا الْكِتَابِ؟', 'এই বইটিতে কী আছে?'),
    a: T('فِي هٰذَا الْكِتَابِ قِصَّةٌ جَمِيلَةٌ جِدًّا', 'এই বইয়ে খুব সুন্দর গল্প আছে'),
    wrong: ['فِيهِ قَلَمٌ جَدِيدٌ', 'فِيهِ خَارِطَةٌ']
  },
  {
    q: T('هَلْ بَابُ الْمَسْجِدِ مُغْلَقٌ؟', 'মসজিদের দরজা কি বন্ধ?'),
    a: T('لَا .. بَلْ بَابُ الْمَسْجِدِ مَفْتُوحٌ', 'না.. বরং মসজিদের দরজা খোলা'),
    wrong: ['نَعَمْ .. بَابُ الْمَسْجِدِ مُغْلَقٌ', 'لَا .. بَابُ الْبَيْتِ مَفْتُوحٌ']
  },
  {
    q: T('أَيْنَ حَدِيقَةُ بَشِيرٍ وَمَاذَا فِي حَدِيقَتِهِ؟', 'বশীরের বাগান কোথায় এবং বাগানে কী?'),
    a: T('حَدِيقَتُهُ بِجَانِبِ الطَّرِيقِ وَفِيهَا وَرْدَةٌ كَبِيرَةٌ', 'তার বাগান পথের পাশে এবং তাতে বড় গোলাপ আছে'),
    wrong: ['حَدِيقَتُهُ أَمَامَ الْمَسْجِدِ', 'فِي حَدِيقَتِهِ مَسْجِدٌ']
  },
  {
    q: T('مَاذَا فِي مَطَارِ الْعَاصِمَةِ؟', 'রাজধানীর বিমানবন্দরে কী আছে?'),
    a: T('فِي مَطَارِ الْعَاصِمَةِ طَائِرَةٌ كَبِيرَةٌ', 'রাজধানীর বিমানবন্দরে বড় বিমান আছে'),
    wrong: ['فِيهِ سَيَّارَةٌ سَرِيعَةٌ', 'فِيهِ قِطَارٌ كَبِيرٌ']
  },
  {
    q: T('هَلِ الطَّائِرَةُ كَبِيرَةٌ وَسَرِيعَةٌ؟', 'বিমানটি কি বড় ও দ্রুতগামী?'),
    a: T('نَعَمْ .. هِيَ كَبِيرَةٌ وَسَرِيعَةٌ جِدًّا', 'হাঁ.. তা বড় এবং খুব দ্রুতগামী'),
    wrong: ['لَا .. هِيَ بَطِيئَةٌ', 'نَعَمْ .. هُوَ كَبِيرٌ']
  },
  {
    q: T('مَاذَا أَمَامَ اللَّاعِبِ؟', 'খেলোয়াড়ের সামনে কী আছে?'),
    a: T('أَمَامَ اللَّاعِبِ كُرَةٌ جَدِيدَةٌ', 'খেলোয়াড়ের সামনে নতুন বল আছে'),
    wrong: ['أَمَامَهُ مِرْوَحَةٌ', 'خَلْفَهُ كُرَةٌ']
  },
  {
    q: T('أَيْنَ الْكُرَةُ وَكَيْفَ هِيَ؟', 'বলটি কোথায় এবং তা কেমন?'),
    a: T('اَلْكُرَةُ أَمَامَ اللَّاعِبِ وَهِيَ جَمِيلَةٌ', 'বলটি খেলোয়াড়ের সামনে এবং তা সুন্দর'),
    wrong: ['اَلْكُرَةُ فِي الْحَدِيقَةِ', 'هِيَ قَدِيمَةٌ']
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
      id: 'l9-words-1',
      titleBn: 'শব্দার্থ: বিমানবন্দর ও গতি (১/২)',
      shortTitle: 'বিমানবন্দর ও গতি',
      titleAr: 'الْمُفْرَدَاتُ: الْمَطَارُ وَالسُّرْعَةُ',
      desc: 'রাজধানী, বিমানবন্দর, বিমান, দ্রুতগামী, ধীরগামী, ফল, সুস্বাদু',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪৭'
    },
    [
      intro(W.asimah), intro(W.matar), intro(W.taira), intro(W.sari), intro(W.saria),
      match([W.asimah, W.matar, W.taira, W.sari]),
      intro(W.bati), intro(W.batia), intro(W.fakiha), intro(W.ladhidh), intro(W.ladhidha),
      pictureChoice('taira', ['sayyara', 'darraja', 'kura']),
      match([W.bati, W.fakiha, W.ladhidh, W.saria]),
      arabicOf(W.sari, ['بَطِيءٌ', 'لَذِيذٌ'])
    ]
  ),

  stage(
    {
      id: 'l9-words-2',
      titleBn: 'শব্দার্থ: ফুল, হাত ও খেলাধুলা (২/২)',
      shortTitle: 'ফুল ও খেলাধুলা',
      titleAr: 'الْمُفْرَدَاتُ: الأَزْهَارُ وَالرِّيَاضَةُ',
      desc: 'গোলাপ, ফুল, তেপায়া, হাত, বল, খেলোয়াড়',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪৭–৪৮'
    },
    [
      intro(W.warda), intro(W.zahra), intro(W.mindada), intro(W.yad), intro(W.kura),
      match([W.warda, W.mindada, W.yad, W.kura]),
      intro(W.laib), intro(W.laiba),
      pictureChoice('warda', ['kura', 'taira', 'sayyara']),
      match([W.laib, W.laiba, W.zahra, W.fakiha]),
      arabicOf(W.kura, ['مِنْضَدَةٌ', 'طَائِرَةٌ']),
      meaningOf(W.mindada, ['একটি চেয়ার', 'একটি ডাস্টার'])
    ]
  ),

  stage(
    {
      id: 'l9-sentences-1',
      titleBn: 'কিতাবের বাক্য: বিমানবন্দর ও রাজধানী (১/২)',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'রাজধানীর বিমানবন্দর, দ্রুতগামী বিমান, যায়নাবের বই ও গল্প',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৭–৪৮'
    },
    [
      introSentence(SENT.hathaMasjidunJadid),
      introSentence(SENT.babulMasjidiMaftuh),
      introSentence(SENT.hathaMatarulAsima),
      introSentence(SENT.fiMatarilAsimatiTaira),
      build(SENT.hathihitTairatuSariatunJiddan, ['سَرِيعٌ', 'طَائِرَةِ']),
      introSentence(SENT.fiYadiZaynabaKitab),
      introSentence(SENT.fiKitabihaQissatunJamila),
      build(SENT.fiKitabihaQissatunJamila, ['قِصَّةِ', 'كِتَابِهِ']),
      fill(SENT.hathaMatarulAsima, 1, ['مَطَارٌ', 'مَطَارِ']),
      spot('এই বিমানটি খুব দ্রুতগামী', 'هٰذِهِ الطَّائِرَةُ سَرِيعَةٌ جِدًّا', 'هٰذِهِ الطَّائِرَةُ سَرِيعٌ جِدًّا', 'طائرة স্ত্রীবাচক, তাই سريعة হবে।')
    ]
  ),

  stage(
    {
      id: 'l9-sentences-2',
      titleBn: 'কিতাবের বাক্য: ফল, বাগান ও খেলোয়াড় (২/২)',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'সুস্বাদু ফল, বশীরের বাগানে গোলাপ, খেলোয়াড়ের সামনে বল',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৮'
    },
    [
      introSentence(SENT.hathihiFakihatunLadhidha),
      introSentence(SENT.alFakihatuLadhidha),
      introSentence(SENT.fiHadiqatiBashirinWarda),
      introSentence(SENT.alWardatuJamilatunJiddan),
      build(SENT.alWardatuJamilatunJiddan, ['جَمِيلٌ', 'كَبِيرَةٌ']),
      introSentence(SENT.hathihiKuratunJadida),
      introSentence(SENT.alKuratuAmamalLaib),
      build(SENT.alKuratuAmamalLaib, ['كُرَةٌ', 'لَاعِبٌ']),
      fill(SENT.hathihiFakihatunLadhidha, 2, ['لَذِيذٌ', 'لَذِيذَةِ']),
      spot('বলটি খেলোয়াড়ের সামনে', 'اَلْكُرَةُ أَمَامَ اللَّاعِبِ', 'اَلْكُرَةُ أَمَامَ اللَّاعِبُ', 'জরফের পরের শব্দে যের হয়।')
    ]
  ),

  stage(
    {
      id: 'l9-dialogue-1',
      titleBn: 'কিতাবের প্রশ্নোত্তর: বিমান ও ব্যক্তিত্ব (১/২)',
      shortTitle: 'প্রশ্নোত্তর ১',
      titleAr: 'الْحِوَارُ (١)',
      desc: 'মসজিদে কে? যায়নাবের হাতে কী? বিমানবন্দরে কী আছে?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৯'
    },
    [
      dialogue(QA[0]),
      dialogue(QA[1]),
      dialogue(QA[2]),
      dialogue(QA[3]),
      dialogue(QA[4]),
      dialogue(QA[6])
    ]
  ),

  stage(
    {
      id: 'l9-dialogue-2',
      titleBn: 'কিতাবের প্রশ্নোত্তর: বাগান ও খেলোয়াড় (২/২)',
      shortTitle: 'প্রশ্নোত্তর ২',
      titleAr: 'الْحِوَارُ (٢)',
      desc: 'বশীরের বাগান কোথায়? বিমানটি কেমন? বলটি কোথায়?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৯'
    },
    [
      dialogue(QA[5]),
      dialogue(QA[7]),
      dialogue(QA[8]),
      dialogue(QA[9]),
      arabicOf(W.fakiha, ['وَرْدَةٌ', 'كُرَةٌ']),
      meaningOf(W.ladhidh, ['ধীরগামী', 'দ্রুতগামী']),
      build(SENT.babulMasjidiMaftuh, ['مُغْلَقٌ', 'بَابِ']),
      spot('মসজিদের দরজা খোলা', 'بَابُ الْمَسْجِدِ مَفْتُوحٌ', 'بَابٌ الْمَسْجِدِ مَفْتُوحٌ', 'মুযাফে তানবীন হয় না।')
    ]
  ),

  stage(
    {
      id: 'l9-quiz',
      titleBn: 'চূড়ান্ত কুইজ: ১ম অধ্যায়ের সমাপ্তি',
      shortTitle: 'চূড়ান্ত কুইজ',
      titleAr: 'الاخْتِبَارُ الشَّامِلُ',
      desc: 'সম্পূর্ণ ১ম অধ্যায়ের সমন্বিত ও চূড়ান্ত মূল্যায়ন',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '৪৭–৪৯'
    },
    [
      quiz("'রাজধানীর বিমানবন্দর' এর আরবি রূপ কোনটি?", ['مَطَارُ الْعَاصِمَةِ', 'مَطَارٌ الْعَاصِمَةِ', 'مَطَارُ الْعَاصِمَةُ'], 'মুযাফে তানবীন হয় না এবং মুযাফ ইলাইহি যেরযুক্ত হয়।'),
      quiz("'هٰذِهِ الطَّائِرَةُ سَرِيعَةٌ جِدًّا' বাক্যটির অর্থ কী?", ['এই বিমানটি খুব দ্রুতগামী', 'এই বিমানটি খুব বড়', 'এই বিমানটি খুব পুরোনো'], 'سَرِيعَةٌ جِدًّا অর্থ খুব দ্রুতগামী।'),
      quiz("'বশীরের বাগানে একটি বড় গোলাপ আছে' এর আরবি কোনটি?", ['فِي حَدِيقَةِ بَشِيرٍ وَرْدَةٌ كَبِيرَةٌ', 'حَدِيقَةُ بَشِيرٍ كَبِيرَةٌ', 'فِي حَدِيقَتِهِ زَهْرَةٌ'], 'فِي حَدِيقَةِ بَشِيرٍ = বশীরের বাগানে, وَرْدَةٌ كَبِيرَةٌ = বড় গোলাপ।'),
      quiz("'لَذِيذٌ' শব্দের অর্থ কী?", ['সুস্বাদু', 'দ্রুতগামী', 'ধীরগামী'], 'لَذِيذٌ অর্থ সুস্বাদু।'),
      quiz("'اَلْكُرَةُ أَمَامَ اللَّاعِبِ' বাক্যটির অর্থ কী?", ['বলটি খেলোয়াড়ের সামনে', 'বলটি খেলোয়াড়ের পিছনে', 'খেলোয়াড়টি বলের সামনে'], 'كُرَةٌ = বল, أَمَامَ = সামনে, اللَّاعِبِ = খেলোয়াড়।'),
      quiz("'مِنْضَدَةٌ' বলতে কী বোঝায়?", ['একটি তেপায়া / ছোট টেবিল', 'একটি চেয়ার', 'একটি খাট'], 'مِنْضَدَةٌ অর্থ তেপায়া।'),
      quiz("'فِي يَدِ زَيْنَبَ كِتَابٌ جَمِيلٌ' বাক্যটিতে 'يَدٌ' শব্দের অর্থ কী?", ['হাত', 'ব্যাগ', 'কামরা'], 'يَدٌ অর্থ হাত।'),
      quiz("'ধীরগামী' বোঝাতে নারীবাচক শব্দ কোনটি?", ['بَطِيئَةٌ', 'بَطِيءٌ', 'سَرِيعَةٌ'], 'স্ত্রীবাচকে গোল তা যোগ হয়ে بَطِيئَةٌ হয়।'),
      quiz("'وَلَدِي عَالِمٌ كَبِيرٌ' বাক্যটির অর্থ কী?", ['আমার ছেলে বড় আলেম', 'আমার ভাই বড় আলেম', 'রাশেদ একজন বড় আলেম'], 'وَلَدِي = আমার ছেলে।'),
      quiz("'اِسْمُ الْكِتَابِ نُورُ الْإِسْلَامِ' এর সঠিক অর্থ কোনটি?", ['কিতাবটির নাম "নূরুল ইসলাম"', 'কিতাবটি ইসলামের আলো', 'ইসলাম আমাদের দ্বীন'], 'اِسْمُ الْكِتَابِ = কিতাবের নাম।')
    ]
  )
];

// ---------- চর্চার পর্বসমূহ যোগ ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l9-sentences-1', stage(
  {
    id: 'l9-practice-1',
    titleBn: 'চর্চা ১: নতুন বিশেষণ ও বর্ণনা',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'দ্রুত, ধীর, সুস্বাদু ও ফুলের বিশেষণ মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৪৭–৪৮'
  },
  [
    match([W.sari, W.saria, W.bati, W.batia]),
    fill(SENT.hathihitTairatuSariatunJiddan, 2, ['سَرِيعٌ', 'سَرِيعَةٍ']),
    build(SENT.alFakihatuLadhidha, ['لَذِيذٌ', 'طَعَامٌ']),
    spot('বিমানটি খুব দ্রুতগামী', 'اَلطَّائِرَةُ سَرِيعَةٌ جِدًّا', 'اَلطَّائِرَةُ بَطِيئَةٌ جِدًّا', 'কিতাবে বিমানকে দ্রুতগামী (سَرِيعَةٌ) বলা হয়েছে।'),
    arabicOf(W.batia, ['سَرِيعَةٌ', 'لَذِيذَةٌ']),
    meaningOf(W.yad, ['পাখা', 'পাখনা']),
    match([W.warda, W.zahra, W.mindada, W.kura]),
    build(SENT.rashidunAmamalMasjid, ['خَلْفَ', 'مَسْجِدٌ']),
    fill(SENT.saatukiFawqalMindada, 0, ['سَاعَتُكَ', 'سَاعَتِي'])
  ]
));

insertAfter('l9-dialogue-2', stage(
  {
    id: 'l9-practice-2',
    titleBn: 'চর্চা ২: গতি ও বিপরীত বৈশিষ্ট্যের দলভাগ',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'দ্রুতগামী ও ধীরগামী যানবাহনের শ্রেণীবিন্যাস ও বাক্য সাজানো',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৪৮–৪৯'
  },
  [
    {
      type: 'sort_groups',
      title: 'যানবাহনটি দ্রুতগামী (سَرِيعَةٌ) না ধীরগামী (بَطِيئَةٌ)?',
      groups: [
        { id: 'fast', arabic: 'দ্রুতগামী (سَرِيعَةٌ)' },
        { id: 'slow', arabic: 'ধীরগামী (بَطِيئَةٌ)' }
      ],
      items: [
        { arabic: 'اَلطَّائِرَةُ', reveal: 'اَلطَّائِرَةُ سَرِيعَةٌ (বিমান দ্রুতগামী)', group: 'fast' },
        { arabic: 'اَلسَّيَّارَةُ', reveal: 'اَلسَّيَّارَةُ سَرِيعَةٌ (গাড়ি দ্রুতগামী)', group: 'fast' },
        { arabic: 'اَلدَّرَّاجَةُ', reveal: 'اَلدَّرَّاجَةُ بَطِيئَةٌ (সাইকেল ধীরগামী)', group: 'slow' },
        { arabic: 'اَلْعَرَبَةُ', reveal: 'اَلْعَرَبَةُ بَطِيئَةٌ (ঘোড়ার গাড়ি ধীরগামী)', group: 'slow' }
      ]
    },
    fill(SENT.alKuratuAmamalLaib, 1, ['خَلْفَ', 'فَوْقَ']),
    build(SENT.anaMuallimulMadrasa, ['تِلْمِيذُ', 'مُعَلِّمٌ']),
    spot('যায়নাবের হাতে সুন্দর বই আছে', 'فِي يَدِ زَيْنَبَ كِتَابٌ جَمِيلٌ', 'فِي يَدُ زَيْنَبَ كِتَابٌ جَمِيلٌ', 'হরফে জরের পর যের হয়।'),
    arabicOf(W.laib, ['لَاعِبَةٌ', 'مُعَلِّمٌ']),
    meaningOf(SENT.ismulKitabiNurulIslam, ['কিতাবটির আলো ইসলাম', 'কুরআন আল্লাহর কিতাব']),
    match([W.asimah, W.matar, W.taira, W.laib])
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
  page: '৪৯'
}));

const tamrinKitabi = [
  {
    task: 'বাংলায় অনুবাদ করো',
    arabic: 'هٰذَا مَطَارُ الْعَاصِمَةِ ، وَفِي الْمَطَارِ طَائِرَةٌ سَرِيعَةٌ.',
    bangla: 'এটি রাজধানীর বিমানবন্দর, এবং বিমানবন্দরে একটি দ্রুতগামী বিমান আছে।'
  },
  {
    task: 'আরবিতে বলো ও লেখো',
    arabic: 'فِي يَدِ زَيْنَبَ كِتَابٌ جَمِيلٌ وَهٰذِهِ الْفَاكِهَةُ لَذِيذَةٌ جِدًّا.',
    bangla: 'যায়নাবের হাতে একটি সুন্দর বই আছে এবং এই ফলটি খুব সুস্বাদু।'
  },
  {
    task: 'শূন্যস্থান পূরণ করো',
    arabic: 'هٰذِهِ الطَّائِرَةُ سَرِيعَةٌ جِدًّا ، وَهٰذِهِ الدَّرَّاجَةُ بَطِيئَةٌ جِدًّا.',
    bangla: 'এই বিমানটি খুব দ্রুতগামী, এবং এই সাইকেলটি খুব ধীরগামী।'
  },
  {
    task: 'প্রশ্নের উত্তর মুখে মুখে বলো',
    arabic: 'مَاذَا أَمَامَ اللَّاعِبِ؟ - أَمَامَ اللَّاعِبِ كُرَةٌ جَدِيدَةٌ.',
    bangla: 'খেলোয়াড়ের সামনে কী আছে? - খেলোয়াড়ের সামনে একটি নতুন বল আছে।'
  }
];

const quizLegacy = bookStages
  .find(s => s.id === 'l9-quiz')
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
    id: 'l9-q-comprehension',
    stageId: 'l9-sentences-1',
    title: '১ম অধ্যায়ের সমন্বিত বাক্যরীতি (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'هٰذَا مَطَارُ الْعَاصِمَةِ', bangla: 'ইহা রাজধানীর বিমানবন্দর (ইযাফত)' },
      { arabic: 'فِي الْمَطَارِ طَائِرَةٌ سَرِيعَةٌ', bangla: 'বিমানবন্দরে দ্রুতগামী বিমান আছে (জরফ ও মাওসূফ-সিফাত)' }
    ],
    rule: '১ম অধ্যায়ে শেখা ইশারা (هٰذَا/ذٰلِكَ), মাওসূফ-সিফাত (طَائِرَةٌ سَرِيعَةٌ), যমীর (كِتَابِي/كِتَابُكَ), ইযাফত (مَطَارُ الْعَاصِمَةِ) এবং জরফ (فِي/أَمَامَ) একত্রিত করে পূর্ণাঙ্গ ব্যবহারিক বাক্য তৈরি করা হয়েছে।',
    examples: [{ arabic: 'هٰذِهِ الطَّائِرَةُ سَرِيعَةٌ جِدًّا', bangla: 'এই বিমানটি খুব দ্রুতগামী' }]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l9',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৪৭-৪৯',
    qaida,
    grammarRule: {
      title: 'বাস্তব জীবনের কথোপকথন ও অনুশীলন (الحِوَارَاتُ الشَّامِلَةُ)',
      summary: '১ম অধ্যায়ের সমস্ত ব্যাকরণিক কাঠামোর বাস্তব প্রয়োগ ও সমন্বিত কথোপকথন।',
      points: [
        'বিমানবন্দর, শহর, বাগান ও খেলার মাঠের বাস্তব বর্ণনা।',
        'দ্রুত ও ধীরগতির পার্থক্য: سَرِيعٌ বনাম بَطِيءٌ।',
        'প্রশ্ন শুনে দ্রুত সাবলীল উত্তর দেওয়ার দক্ষতা অর্জন।',
        'সম্পূর্ণ ১ম অধ্যায়ের ব্যাকরণ ও শব্দভাণ্ডারের পূর্ণাঙ্গ সমাপ্তি।'
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
