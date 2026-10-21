// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৬ষ্ঠ দারস (বই পৃষ্ঠা ৩৮–৪০, PDF পৃষ্ঠা ৩৬–৩৮)
// বিষয়: জিনিসের মালিক ও সম্বন্ধ — ইযাফত (كِتَابُ رَاشِدٍ / بَابُ الْمَسْجِدِ)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ।

const W = {
  // পৃ. ৩৮ কিতাবের ছক
  kitabuRashid: { arabic: 'كِتَابُ رَاشِدٍ', bangla: 'রাশেদের বই', picture: 'book' },
  kitabuAisha: { arabic: 'كِتَابُ عَائِشَةَ', bangla: 'আয়েশার বই', picture: 'book' },
  kitabulMuallim: { arabic: 'كِتَابُ الْمُعَلِّمِ', bangla: 'শিক্ষকের বই', picture: 'book' },

  qalamuKhalid: { arabic: 'قَلَمُ خَالِدٍ', bangla: 'খালেদের কলম', picture: 'pen' },
  saatuBashir: { arabic: 'سَاعَةُ بَشِيرٍ', bangla: 'বশীরের ঘড়ি', picture: 'clock' },
  baytuMahmud: { arabic: 'بَيْتُ مَحْمُودٍ', bangla: 'মাহমুদের ঘর', picture: 'house' },
  akhuSaid: { arabic: 'أَخُو سَعِيدٍ', bangla: 'সাঈদের ভাই' },
  ukhtuBilal: { arabic: 'أُخْتُ بِلَالٍ', bangla: 'বেলালের বোন' },
  sadiquMajid: { arabic: 'صَدِيقُ مَاجِدٍ', bangla: 'মাজেদের বন্ধু' },

  iqduAmina: { arabic: 'عِقْدُ آمِنَةَ', bangla: 'আমেনার হার', picture: 'necklace' },
  haqibatuFatima: { arabic: 'حَقِيبَةُ فَاطِمَةَ', bangla: 'ফাতেমার ব্যাগ', picture: 'bag' },
  sadiqatuZaynab: { arabic: 'صَدِيقَةُ زَيْنَبَ', bangla: 'যায়নাবের বান্ধবী' },

  babulMasjid: { arabic: 'بَابُ الْمَسْجِدِ', bangla: 'মসজিদের দরজা', picture: 'door' },
  ismulWalad: { arabic: 'اِسْمُ الْوَلَدِ', bangla: 'ছেলেটির নাম' },
  miftahulQufl: { arabic: 'مِفْتَاحُ الْقُفْلِ', bangla: 'তালার চাবি', picture: 'key' },
  misbahulGhurfa: { arabic: 'مِصْبَاحُ الْغُرْفَةِ', bangla: 'কামরার বাতি', picture: 'lamp' },
  muallimulMadrasa: { arabic: 'مُعَلِّمُ الْمَدْرَسَةِ', bangla: 'মাদরাসার শিক্ষক' },
  imamuMasjid: { arabic: 'إِمَامُ الْمَسْجِدِ', bangla: 'মসজিদের ইমাম' },

  // পৃ. ৩৯
  tariq: { arabic: 'طَرِيقٌ', bangla: 'একটি পথ / রাস্তা' },
  qarya: { arabic: 'قَرْيَةٌ', bangla: 'একটি গ্রাম' },
  manzar: { arabic: 'مَنْظَرٌ', bangla: 'একটি দৃশ্য' },
  suq: { arabic: 'سُوقٌ', bangla: 'একটি বাজার' },
  madina: { arabic: 'مَدِينَةٌ', bangla: 'একটি শহর' },
  jiddan: { arabic: 'جِدًّا', bangla: 'খুব / অত্যন্ত' },

  // পৃ. ৪০
  zawj: { arabic: 'زَوْجٌ', bangla: 'স্বামী' },
  zawja: { arabic: 'زَوْجَةٌ', bangla: 'স্ত্রী' },
  walid: { arabic: 'وَالِدٌ', bangla: 'আব্বা / পিতা' },
  walida: { arabic: 'وَالِدَةٌ', bangla: 'আম্মা / মাতা' },
  kitabullah: { arabic: 'كِتَابُ اللهِ', bangla: 'আল্লাহর কিতাব' },
  baytullah: { arabic: 'بَيْتُ اللهِ', bangla: 'আল্লাহর ঘর' },
  rasulullah: { arabic: 'رَسُولُ اللهِ', bangla: 'আল্লাহর রাসূল' }
};

const T = (arabic, bangla, page, picture, distance) => ({ arabic, bangla, page, picture, distance });

const SENT = {
  // পৃ. ৩৮
  hathaKitabuRashid: T('هٰذَا كِتَابُ رَاشِدٍ وَذٰلِكَ كِتَابُ عَائِشَةَ', 'এটি রাশেদের বই এবং ওটি আয়েশার বই', '৩৮', 'book', 'near'),
  kitabuRashidJadid: T('كِتَابُ رَاشِدٍ جَدِيدٌ', 'রাশেদের বই নতুন', '৩৮', 'book'),
  kitabuAishaJamil: T('كِتَابُ عَائِشَةَ جَمِيلٌ', 'আয়েশার বই সুন্দর', '৩৮', 'book'),
  kitabulMuallimMufid: T('كِتَابُ الْمُعَلِّمِ مُفِيدٌ', 'শিক্ষকের বই উপকারী', '৩৮', 'book'),

  hathaQalamuMahmud: T('هٰذَا قَلَمُ مَحْمُودٍ', 'এটি মাহমুদের কলম', '৩৮', 'pen', 'near'),
  tilkaSaatuBashir: T('تِلْكَ سَاعَةُ بَشِيرٍ', 'ওটি বশীরের ঘড়ি', '৩৮', 'clock', 'far'),
  hathaIqduAmina: T('هٰذَا عِقْدُ آمِنَةَ', 'এটি আমেনার হার', '৩৮', 'necklace', 'near'),
  dhalikarRajuluAbuFatima: T('ذٰلِكَ الرَّجُلُ أَبُو فَاطِمَةَ', 'ঐ লোকটি ফাতেমার আব্বা', '৩৮'),
  abuMajidMuallimulMadrasa: T('أَبُو مَاجِدٍ مُعَلِّمُ الْمَدْرَسَةِ', 'মাজেদের আব্বা মাদরাসার শিক্ষক', '৩৮'),

  // পৃ. ৩৯
  hathaManzarulQarya: T('هٰذَا مَنْظَرُ الْقَرْيَةِ', 'এটি গ্রামের দৃশ্য', '৩৯'),
  manzarulQaryaJamil: T('مَنْظَرُ الْقَرْيَةِ جَمِيلٌ جِدًّا', 'গ্রামের দৃশ্য খুব সুন্দর', '৩৯'),
  suqulQaryaSaghir: T('سُوقُ الْقَرْيَةِ صَغِيرٌ وَسُوقُ الْمَدِينَةِ كَبِيرٌ', 'গ্রামের বাজার ছোট এবং শহরের বাজার বড়', '৩৯'),
  hathatTariquWasi: T('هٰذَا الطَّرِيقُ وَاسِعٌ وَذٰلِكَ الطَّرِيقُ ضَيِّقٌ', 'এই পথটি প্রশস্ত এবং ঐ পথটি সংকীর্ণ', '৩৯'),

  // পৃ. ৪০
  alQaryatuJamila: T('اَلْقَرْيَةُ جَمِيلَةٌ وَنَظِيفَةٌ', 'গ্রামটি সুন্দর ও পরিচ্ছন্ন', '৪০'),
  bilalAkhuFatima: T('بِلَالٌ أَخُو فَاطِمَةَ وَهِيَ أُخْتُهُ', 'বেলাল ফাতেমার ভাই এবং সে তার বোন', '৪০'),
  alQuranuKitabullah: T('اَلْقُرْآنُ كِتَابُ اللهِ', 'কুরআন আল্লাহর কিতাব', '৪০'),
  alKabatuBaytullah: T('اَلْكَعْبَةُ بَيْتُ اللهِ', 'কাবা আল্লাহর ঘর', '৪০'),
  muhammadunRasulullah: T('مُحَمَّدٌ رَسُولُ اللهِ', 'মুহাম্মদ আল্লাহর রাসূল', '৪০'),
  abdullahiWalidurRasul: T('عَبْدُ اللهِ وَالِدُ الرَّسُولِ وَآمِنَةُ وَالِدَتُهُ', 'আব্দুল্লাহ রাসূলের পিতা এবং আমেনা তাঁর মাতা', '৪০')
};

const QA = [
  // পৃ. ৩৯
  {
    q: T('مَنْ أَنْتَ أَيُّهَا الرَّجُلُ؟', 'হে পুরুষ, আপনি কে?'),
    a: T('أَنَا أَبُو فَاطِمَةَ وَعَمُّ خَالِدٍ', 'আমি ফাতেমার আব্বা এবং খালেদের চাচা'),
    wrong: ['أَنَا مُعَلِّمُ الْمَدْرَسَةِ', 'هُوَ أَبُو فَاطِمَةَ']
  },
  {
    q: T('هَلْ أَنْتَ إِمَامُ الْمَسْجِدِ؟', 'আপনি কি মসজিদের ইমাম?'),
    a: T('نَعَمْ .. أَنَا إِمَامُ الْمَسْجِدِ', 'হাঁ.. আমি মসজিদের ইমাম'),
    wrong: ['لَا .. أَنَا إِمَامُ الْمَسْجِدِ', 'نَعَمْ .. هُوَ إِمَامُ الْمَسْجِدِ']
  },
  {
    q: T('هَلْ هٰذَا قَلَمُ خَالِدٍ؟', 'এটি কি খালেদের কলম?'),
    a: T('نَعَمْ .. هٰذَا قَلَمُ خَالِدٍ', 'হাঁ.. এটি খালেদের কলম'),
    wrong: ['لَا .. هٰذَا قَلَمُ خَالِدٍ', 'نَعَمْ .. هٰذَا قَلَمِي']
  },
  {
    q: T('كَيْفَ قَلَمُ خَالِدٍ؟', 'খালেদের কলম কেমন?'),
    a: T('قَلَمُهُ جَيِّدٌ', 'তার কলমটি ভালো'),
    wrong: ['قَلَمُهُ جَدِيدَةٌ', 'سَاعَتُهُ جَمِيلَةٌ']
  },
  {
    q: T('هَلْ بَابُ الْبَيْتِ مَفْتُوحٌ؟', 'ঘরের দরজা কি খোলা?'),
    a: T('لَا .. بَابُ الْبَيْتِ مُغْلَقٌ', 'না.. ঘরের দরজা বন্ধ'),
    wrong: ['نَعَمْ .. بَابُ الْبَيْتِ مُغْلَقٌ', 'لَا .. بَابُ الْبَيْتِ مَفْتُوحٌ']
  },
  {
    q: T('كَيْفَ مَنْظَرُ الْقَرْيَةِ؟', 'গ্রামের দৃশ্য কেমন?'),
    a: T('مَنْظَرُ الْقَرْيَةِ جَمِيلٌ جِدًّا', 'গ্রামের দৃশ্য খুব সুন্দর'),
    wrong: ['مَنْظَرُ الْقَرْيَةِ صَغِيرٌ', 'سُوقُ الْقَرْيَةِ كَبِيرٌ']
  },
  // পৃ. ৪০
  {
    q: T('هَلْ فَرْحَانَةُ بِنْتٌ مُؤَدَّبَةٌ؟', 'ফারহানা কি ভদ্র মেয়ে?'),
    a: T('نَعَمْ .. هِيَ بِنْتٌ مُؤَدَّبَةٌ', 'হাঁ.. সে একজন ভদ্র মেয়ে'),
    wrong: ['لَا .. هِيَ بِنْتٌ مُؤَدَّبَةٌ', 'نَعَمْ .. هُوَ وَلَدٌ مُؤَدَّبٌ']
  },
  {
    q: T('مَنْ بِلَالٌ وَكَيْفَ هُوَ؟', 'বেলাল কে এবং সে কেমন?'),
    a: T('هُوَ أَخُو فَاطِمَةَ - هُوَ تِلْمِيذٌ مُجْتَهِدٌ', 'সে ফাতেমার ভাই - সে একজন পরিশ্রমী ছাত্র'),
    wrong: ['هِيَ أُخْتُ بِلَالٍ', 'هُوَ مُعَلِّمُ الْمَدْرَسَةِ']
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
      id: 'l6-words-1',
      titleBn: 'শব্দার্থ: সম্বন্ধ ও মালিকানা (১/২)',
      shortTitle: 'সম্বন্ধ ও মালিকানা',
      titleAr: 'الْمُفْرَدَاتُ: الإِضَافَةُ',
      desc: 'রাশেদের বই, আয়েশার বই, মসজিদের দরজা, তালার চাবি',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৩৮'
    },
    [
      intro(W.kitabuRashid), intro(W.kitabuAisha), intro(W.kitabulMuallim),
      match([W.kitabuRashid, W.kitabuAisha, W.kitabulMuallim, W.babulMasjid]),
      intro(W.miftahulQufl), intro(W.misbahulGhurfa), intro(W.imamuMasjid),
      pictureChoice('kitabuRashid', ['qalamuKhalid', 'saatuBashir', 'miftahulQufl']),
      meaningOf(W.babulMasjid, ['মসজিদের বাতি', 'ঘরের দরজা']),
      arabicOf(W.miftahulQufl, ['بَابُ الْمَسْجِدِ', 'مِصْبَاحُ الْغُرْفَةِ'])
    ]
  ),

  stage(
    {
      id: 'l6-grammar-idafa',
      titleBn: 'ক্বায়েদা: ইযাফতের নিয়ম',
      shortTitle: 'ইযাফতের নিয়ম',
      titleAr: 'قَاعِدَةُ الإِضَافَةِ',
      desc: 'মুযাফ ও মুযাফ ইলাইহির যের-যবরের নিয়ম',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '৩৮'
    },
    [
      {
        type: 'grammar_card',
        title: 'জিনিসের মালিক ও সম্বন্ধ (ইযাফত)',
        summary: 'যার জিনিস বোঝায় (মুযাফ) তাতে اَلْ বা তানবীন বসে না। যার সাথে সম্বন্ধ করা হয় (মুযাফ ইলাইহি) পুরুষের নাম হলে দুই যের (رَاشِدٍ) এবং নারীর নাম হলে এক যবর (عَائِشَةَ) হয়।',
        table: [
          { arabic: 'كِتَابٌ + رَاشِدٌ = كِتَابُ رَاشِدٍ', bangla: 'রাশেদের বই' },
          { arabic: 'كِتَابٌ + عَائِشَةُ = كِتَابُ عَائِشَةَ', bangla: 'আয়েশার বই' },
          { arabic: 'كِتَابٌ + اَلْمُعَلِّمُ = كِتَابُ الْمُعَلِّمِ', bangla: 'শিক্ষকের বই' }
        ]
      },
      spot('রাশেদের বই', 'كِتَابُ رَاشِدٍ', 'كِتَابٌ رَاشِدٍ', 'মুযাফ-এ তানবীন হয় না।'),
      spot('আয়েশার বই', 'كِتَابُ عَائِشَةَ', 'كِتَابُ عَائِشَةِ', 'নারীর নামের শেষে যেরের বদলে যবর হয়।'),
      spot('মসজিদের দরজা', 'بَابُ الْمَسْجِدِ', 'بَابُ الْمَسْجِدُ', 'মুযাফ ইলাইহি যেরযুক্ত হয়।'),
      fill(SENT.kitabuRashidJadid, 0, ['كِتَابٌ', 'كِتَابِ']),
      fill(SENT.kitabuAishaJamil, 1, ['عَائِشَةِ', 'عَائِشَةُ']),
      meaningOf(W.kitabulMuallim, ['মাদরাসার শিক্ষক', 'রাশেদের বই'])
    ]
  ),

  stage(
    {
      id: 'l6-words-2',
      titleBn: 'শব্দার্থ: পথ, গ্রাম ও শহর (২/২)',
      shortTitle: 'গ্রাম ও শহর',
      titleAr: 'الْمُفْرَدَاتُ: الْقَرْيَةُ وَالْمَدِينَةُ',
      desc: 'রাস্তা, গ্রাম, দৃশ্য, বাজার, শহর, খুব',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৩৯–৪০'
    },
    [
      intro(W.tariq), intro(W.qarya), intro(W.manzar), intro(W.suq),
      match([W.tariq, W.qarya, W.manzar, W.suq]),
      intro(W.madina), intro(W.jiddan), intro(W.zawj), intro(W.zawja), intro(W.walid), intro(W.walida),
      match([W.madina, W.zawj, W.zawja, W.walid]),
      arabicOf(W.qarya, ['مَدِينَةٌ', 'سُوقٌ'])
    ]
  ),

  stage(
    {
      id: 'l6-sentences-1',
      titleBn: 'কিতাবের বাক্য: মালিকানা ও বৈশিষ্ট্য (১/২)',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'রাশেদের বই নতুন, শিক্ষকের বই উপকারী, এটি মাহমুদের কলম',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৮'
    },
    [
      introSentence(SENT.hathaKitabuRashid),
      introSentence(SENT.kitabuRashidJadid),
      introSentence(SENT.kitabuAishaJamil),
      introSentence(SENT.kitabulMuallimMufid),
      build(SENT.kitabuRashidJadid, ['قَدِيمٌ', 'كِتَابٌ']),
      introSentence(SENT.hathaQalamuMahmud),
      introSentence(SENT.tilkaSaatuBashir),
      introSentence(SENT.dhalikarRajuluAbuFatima),
      build(SENT.dhalikarRajuluAbuFatima, ['أَبِي', 'أُمُّ']),
      fill(SENT.hathaQalamuMahmud, 1, ['قَلَمٌ', 'قَلَمِ']),
      spot('বশীরের ঘড়ি সুন্দর', 'سَاعَةُ بَشِيرٍ جَمِيلَةٌ', 'سَاعَةُ بَشِيرٍ جَمِيلٌ', 'ساعة স্ত্রীবাচক, তাই جميلة হবে।')
    ]
  ),

  stage(
    {
      id: 'l6-sentences-2',
      titleBn: 'কিতাবের বাক্য: গ্রাম ও শহর (২/২)',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'গ্রামের দৃশ্য খুব সুন্দর, গ্রামের বাজার ছোট ও শহরের বাজার বড়',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৯–৪০'
    },
    [
      introSentence(SENT.hathaManzarulQarya),
      introSentence(SENT.manzarulQaryaJamil),
      introSentence(SENT.suqulQaryaSaghir),
      introSentence(SENT.hathatTariquWasi),
      introSentence(SENT.alQaryatuJamila),
      build(SENT.alQaryatuJamila, ['جَمِيلٌ', 'نَظِيفٌ']),
      fill(SENT.suqulQaryaSaghir, 0, ['سُوقٌ', 'سُوقِ']),
      spot('গ্রামের দৃশ্য খুব সুন্দর', 'مَنْظَرُ الْقَرْيَةِ جَمِيلٌ جِدًّا', 'مَنْظَرُ الْقَرْيَةِ جَمِيلَةٌ جِدًّا', 'منظر শব্দটি পুরুষবাচক, তাই جميل হবে।'),
      meaningOf(SENT.hathatTariquWasi, ['এই পথটি সংকীর্ণ এবং ঐ পথটি প্রশস্ত', 'পথটি খুব সুন্দর'])
    ]
  ),

  stage(
    {
      id: 'l6-dialogue',
      titleBn: 'কিতাবের প্রশ্নোত্তর',
      shortTitle: 'প্রশ্নোত্তর',
      titleAr: 'الْحِوَارُ وَالأَسْئِلَةُ',
      desc: 'আপনি কি ইমাম? এটি কি খালেদের কলম? ঘরের দরজা কি খোলা?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৯–৪০'
    },
    [
      dialogue(QA[0]),
      dialogue(QA[1]),
      dialogue(QA[2]),
      dialogue(QA[3]),
      dialogue(QA[4]),
      dialogue(QA[5]),
      dialogue(QA[6]),
      dialogue(QA[7])
    ]
  ),

  stage(
    {
      id: 'l6-reading',
      titleBn: 'পড়ার অনুচ্ছেদ: রাসূল (ﷺ)-এর পবিত্র পরিচয়',
      shortTitle: 'রাসূলের পরিচয়',
      titleAr: 'النَّصُّ: النَّبِيُّ الكَرِيمُ',
      desc: 'কুরআন আল্লাহর কিতাব, কাবা আল্লাহর ঘর, মুহাম্মদ আল্লাহর রাসূল',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪০'
    },
    [
      introSentence(SENT.alQuranuKitabullah),
      introSentence(SENT.alKabatuBaytullah),
      introSentence(SENT.muhammadunRasulullah),
      introSentence(SENT.abdullahiWalidurRasul),
      build(SENT.alQuranuKitabullah, ['كِتَابٌ', 'اللهَ']),
      build(SENT.alKabatuBaytullah, ['بَيْتٌ', 'اللهَ']),
      fill(SENT.muhammadunRasulullah, 1, ['رَسُولٌ', 'رَسُولِ']),
      spot('মুহাম্মদ আল্লাহর রাসূল', 'مُحَمَّدٌ رَسُولُ اللهِ', 'مُحَمَّدٌ رَسُولٌ اللهِ', 'মুযাফে তানবীন হয় না।')
    ]
  ),

  stage(
    {
      id: 'l6-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الاخْتِبَارُ النِّهَائِيُّ',
      desc: '৬ষ্ঠ পাঠের ইযাফত ও সম্পর্কের পূর্ণাঙ্গ মূল্যায়ন',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '৩৮–৪০'
    },
    [
      quiz("'রাশেদের বই' এর সঠিক আরবি কোনটি?", ['كِتَابُ رَاشِدٍ', 'كِتَابٌ رَاشِدٍ', 'كِتَابُ رَاشِدٌ'], 'মুযাফে তানবীন হয় না এবং মুযাফ ইলাইহি যেরযুক্ত হয়।'),
      quiz("'আয়েশার বই' বলতে কোনটি বলবেন?", ['كِتَابُ عَائِشَةَ', 'كِتَابُ عَائِشَةِ', 'كِتَابٌ عَائِشَةُ'], 'নারীর নামের শেষে যেরের জায়গায় যবর হয়।'),
      quiz("'بَابُ الْمَسْجِدِ' এর বাংলা অর্থ কী?", ['মসজিদের দরজা', 'ঘরের দরজা', 'মসজিদের বাতি'], 'بَابُ অর্থ দরজা এবং الْمَسْجِدِ অর্থ মসজিদ।'),
      quiz("মুযাফ-এর (সম্বন্ধযুক্ত জিনিসের) ক্ষেত্রে কোনটি সত্য?", ['اَلْ বা তানবীন হয় না', 'সর্বদা যের হয়', 'সর্বদা তানবীন হয়'], 'মুযাফে কখনো اَلْ বা তানবীন বসে না।'),
      quiz("'মাদরাসার শিক্ষক' এর আরবি রূপ কোনটি?", ['مُعَلِّمُ الْمَدْرَسَةِ', 'مُعَلِّمٌ الْمَدْرَسَةِ', 'مُعَلِّمُ الْمَدْرَسَةُ'], 'মুযাফ পেশযুক্ত ও তানবীনহীন এবং মুযাফ ইলাইহি যেরযুক্ত।'),
      quiz("'مَنْظَرُ الْقَرْيَةِ جَمِيلٌ جِدًّا' বাক্যটির অর্থ কী?", ['গ্রামের দৃশ্য খুব সুন্দর', 'শহরের বাজার খুব বড়', 'গ্রামটি পরিচ্ছন্ন'], 'مَنْظَرُ الْقَرْيَةِ = গ্রামের দৃশ্য, جَمِيلٌ جِدًّا = খুব সুন্দর।'),
      quiz("'سُوقُ الْمَدِينَةِ' এর অর্থ কী?", ['শহরের বাজার', 'গ্রামের বাজার', 'শহরের রাস্তা'], 'سُوقُ = বাজার, الْمَدِينَةِ = শহর।'),
      quiz("'مِفْتَاحُ الْقُفْلِ' বলতে কী বোঝায়?", ['তালার চাবি', 'ঘরের চাবি', 'মসজিদের চাবি'], 'مِفْتَاحُ = চাবি, الْقُفْلِ = তালা।'),
      quiz("'خَدِيجَةُ زَوْجَةُ الرَّسُولِ' বাক্যটির অর্থ কী?", ['খাদীজা রাসূলের স্ত্রী', 'আমেনা রাসূলের মাতা', 'ফাতেমা রাসূলের কন্যা'], 'زَوْجَةُ = স্ত্রী।'),
      quiz("'طَرِيقٌ ضَيِّقٌ' এর অর্থ কোনটি?", ['সংকীর্ণ পথ', 'প্রশস্ত পথ', 'পুরোনো পথ'], 'ضَيِّقٌ অর্থ অপ্রশস্ত বা সংকীর্ণ।')
    ]
  )
];

// ---------- চর্চার পর্বসমূহ যোগ ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l6-sentences-1', stage(
  {
    id: 'l6-practice-1',
    titleBn: 'চর্চা ১: ইযাফত গঠন ও যের-যবর',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'মুযাফ ও মুযাফ ইলাইহির গঠন ও বাক্যের মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৩৮–৩৯'
  },
  [
    match([W.kitabuRashid, W.kitabuAisha, W.babulMasjid, W.miftahulQufl]),
    fill(SENT.kitabuAishaJamil, 2, ['جَمِيلَةٌ', 'مُفِيدٌ']),
    build(SENT.kitabulMuallimMufid, ['جَدِيدٌ', 'مُعَلِّمٌ']),
    spot('খালেদের কলম', 'قَلَمُ خَالِدٍ', 'قَلَمٌ خَالِدٍ', 'মুযাফে তানবীন হয় না।'),
    arabicOf(W.babulMasjid, ['مِفْتَاحُ الْقُفْلِ', 'بَيْتُ مَحْمُودٍ']),
    meaningOf(W.iqduAmina, ['আমেনার ব্যাগ', 'আমেনার ঘড়ি']),
    build(SENT.hathaManzarulQarya, ['قَرْيَةٌ', 'هٰذِهِ']),
    fill(SENT.manzarulQaryaJamil, 2, ['جَمِيلَةٌ', 'صَغِيرٌ']),
    match([W.tariq, W.qarya, W.suq, W.madina]),
    spot('আমেনার হার', 'عِقْدُ آمِنَةَ', 'عِقْدُ آمِنَةِ', 'নারীর নামের শেষে যেরের জায়গায় যবর হয়।')
  ]
));

insertAfter('l6-dialogue', stage(
  {
    id: 'l6-practice-2',
    titleBn: 'চর্চা ২: মুযাফ ইলাইহির রূপভেদ',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'পুরুষ ও নারীর নামের ইযাফত বাছাই ও বাক্য সাজানো',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৩৯–৪০'
  },
  [
    {
      type: 'sort_groups',
      title: 'মুযাফ ইলাইহি পুরুষ (দুই যের: رَاشِدٍ) না নারী (এক যবর: عَائِشَةَ)?',
      groups: [
        { id: 'tanween', arabic: 'পুরুষ (رَاشِدٍ)' },
        { id: 'fatha', arabic: 'নারী (عَائِشَةَ)' }
      ],
      items: [
        { arabic: 'كِتَابُ رَاشِدٍ', reveal: 'كِتَابُ رَاشِدٍ (রাশেদের বই)', group: 'tanween' },
        { arabic: 'كِتَابُ عَائِشَةَ', reveal: 'كِتَابُ عَائِشَةَ (আয়েশার বই)', group: 'fatha' },
        { arabic: 'قَلَمُ خَالِدٍ', reveal: 'قَلَمُ خَالِدٍ (খালেদের কলম)', group: 'tanween' },
        { arabic: 'عِقْدُ آمِنَةَ', reveal: 'عِقْدُ آمِنَةَ (আমেনার হার)', group: 'fatha' },
        { arabic: 'سَاعَةُ بَشِيرٍ', reveal: 'سَاعَةُ بَشِيرٍ (বশীরের ঘড়ি)', group: 'tanween' },
        { arabic: 'حَقِيبَةُ فَاطِمَةَ', reveal: 'حَقِيبَةُ فَاطِمَةَ (ফাতেমার ব্যাগ)', group: 'fatha' }
      ]
    },
    fill(SENT.alQuranuKitabullah, 1, ['كِتَابٌ', 'كِتَابِ']),
    build(SENT.muhammadunRasulullah, ['عَبْدُ', 'نَبِيُّ']),
    spot('কুরআন আল্লাহর কিতাব', 'اَلْقُرْآنُ كِتَابُ اللهِ', 'اَلْقُرْآنُ كِتَابٌ اللهِ', 'মুযাফে তানবীন হয় না।'),
    meaningOf(SENT.alKabatuBaytullah, ['কাবা আমাদের কিবলা', 'কুরআন আল্লাহর কিতাব']),
    match([W.zawj, W.zawja, W.walid, W.walida])
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
  page: '৩৯-৪০'
}));

const tamrinKitabi = [
  {
    task: 'বাংলায় অনুবাদ করো',
    arabic: 'هٰذَا كِتَابُ رَاشِدٍ وَذٰلِكَ كِتَابُ عَائِشَةَ.',
    bangla: 'এটি রাশেদের বই এবং ওটি আয়েশার বই।'
  },
  {
    task: 'আরবিতে বলো ও লেখো',
    arabic: 'كِتَابُ رَاشِدٍ جَدِيدٌ وَكِتَابُ عَائِشَةَ جَمِيلٌ.',
    bangla: 'রাশেদের বই নতুন এবং আয়েশার বই সুন্দর।'
  },
  {
    task: 'শূন্যস্থান পূরণ করো',
    arabic: 'هٰذَا بَابُ الْمَسْجِدِ وَذٰلِكَ مِفْتَاحُ الْقُفْلِ.',
    bangla: 'এটি মসজিদের দরজা এবং ওটি তালার চাবি।'
  },
  {
    task: 'সম্পর্ক মুখে মুখে বলো',
    arabic: 'اَلْقُرْآنُ كِتَابُ اللهِ ، وَالْكَعْبَةُ بَيْتُ اللهِ ، وَمُحَمَّدٌ رَسُولُ اللهِ.',
    bangla: 'কুরআন আল্লাহর কিতাব, কাবা আল্লাহর ঘর, এবং মুহাম্মদ আল্লাহর রাসূল।'
  }
];

const quizLegacy = bookStages
  .find(s => s.id === 'l6-quiz')
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
    id: 'l6-q-idafa',
    stageId: 'l6-grammar-idafa',
    title: 'ইযাফত বা সম্বন্ধযুক্ত পদ (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'كِتَابُ رَاشِدٍ', bangla: 'রাশেদের বই' },
      { arabic: 'كِتَابُ عَائِشَةَ', bangla: 'আয়েশার বই' },
      { arabic: 'كِتَابُ الْمُعَلِّمِ', bangla: 'শিক্ষকের বই' }
    ],
    rule: 'মুযাফ-এ (প্রথম শব্দে) اَلْ বা তানবীন হয় না। মুযাফ ইলাইহি পুরুষবাচক নাম হলে দুই যের (ـٍ) এবং নারীবাচক নাম হলে এক যবর (ـَ) হয়। সাধারণ শব্দে اَلْ থাকলে এক যের (ـِ) হয়।',
    examples: [{ arabic: 'كِتَابُ رَاشِدٍ جَدِيدٌ', bangla: 'রাশেদের বই নতুন' }]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l6',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৩৮-৪০',
    qaida,
    grammarRule: {
      title: 'জিনিসের মালিক ও সম্বন্ধ — ইযাফত (كِتَابُ رَاشِدٍ / بَابُ الْمَسْجِدِ)',
      summary: 'মুযাফ ও মুযাফ ইলাইহির মাধ্যমে মালিকানা ও সম্বন্ধ প্রকাশ করা।',
      points: [
        'মুযাফ-এ اَلْ বা তানবীন বসে না: كِتَابُ رَاشِدٍ।',
        'পুরুষের নামের মুযাফ ইলাইহিতে দুই যের: كِتَابُ رَاشِدٍ, قَلَمُ خَالِدٍ।',
        'নারীর নামের মুযাফ ইলাইহিতে এক যবর: كِتَابُ عَائِشَةَ, عِقْدُ آمِنَةَ।',
        'اَلْ যুক্ত শব্দে এক যের: بَابُ الْمَسْجِدِ, مِفْتَاحُ الْقُفْلِ।'
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
