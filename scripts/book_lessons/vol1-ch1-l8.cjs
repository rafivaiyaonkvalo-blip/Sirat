// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৮ম দারস (বই পৃষ্ঠা ৪৫–৪৬, PDF পৃষ্ঠা ৪৩–৪৪)
// বিষয়: স্থান ও পাত্রের ভেতরে থাকা — فِي (فِي الْمَسْجِدِ / فِي الْغُرْفَةِ)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ।

const W = {
  // পৃ. ৪৫ কিতাবের ছক
  fi: { arabic: 'فِي', bangla: 'মধ্যে / ভেতরে' },
  filMasjid: { arabic: 'فِي الْمَسْجِدِ', bangla: 'মসজিদে', picture: 'mosque' },
  filQarya: { arabic: 'فِي الْقَرْيَةِ', bangla: 'গ্রামে' },
  fiGhurfatilMuallim: { arabic: 'فِي غُرْفَةِ الْمُعَلِّمِ', bangla: 'শিক্ষকের কামরায়', picture: 'room' },
  fiSuqilQarya: { arabic: 'فِي سُوقِ الْقَرْيَةِ', bangla: 'গ্রামের বাজারে' },
  fiGhurfatika: { arabic: 'فِي غُرْفَتِكَ', bangla: 'তোমার কামরায় (পুং)', picture: 'room' },
  fiGhurfatiki: { arabic: 'فِي غُرْفَتِكِ', bangla: 'তোমার কামরায় (স্ত্রী)', picture: 'room' },
  fiGhurfatihi: { arabic: 'فِي غُرْفَتِهِ', bangla: 'তার কামরায় (পুং)', picture: 'room' },
  fiGhurfatiha: { arabic: 'فِي غُرْفَتِهَا', bangla: 'তার কামরায় (স্ত্রী)', picture: 'room' },

  filGhurfa: { arabic: 'فِي الْغُرْفَةِ', bangla: 'কামরায়', picture: 'room' },
  fisSunduq: { arabic: 'فِي الصُّنْدُوقِ', bangla: 'বাক্সে', picture: 'box' },
  filHadiqa: { arabic: 'فِي الْحَدِيقَةِ', bangla: 'বাগানে', picture: 'garden' },

  // পৃ. ৪৫-৪৬ নতুন শব্দ
  shajara: { arabic: 'شَجَرَةٌ', bangla: 'একটি গাছ', picture: 'tree' },
  dukkan: { arabic: 'دُكَّانٌ', bangla: 'একটি দোকান' },
  muslim: { arabic: 'مُسْلِمٌ', bangla: 'একজন মুসলিম' },
  kafir: { arabic: 'كَافِرٌ', bangla: 'একজন কাফের' },
  alMadinatulMunawwara: { arabic: 'اَلْمَدِينَةُ الْمُنَوَّرَةُ', bangla: 'মদীনা মুনাওয়ারা' },
  qabr: { arabic: 'قَبْرٌ', bangla: 'কবর / রওজা' },
  iqd: { arabic: 'عِقْدٌ', bangla: 'একটি হার', picture: 'necklace' },
  misbah: { arabic: 'مِصْبَاحٌ', bangla: 'একটি বাতি', picture: 'lamp' }
};

const T = (arabic, bangla, page, picture, distance) => ({ arabic, bangla, page, picture, distance });

const SENT = {
  // পৃ. ৪৫
  filMasjidiRajul: T('فِي الْمَسْجِدِ رَجُلٌ', 'মসজিদে একজন লোক আছে', '৪৫', 'mosque'),
  arRajuluFilMasjid: T('اَلرَّجُلُ فِي الْمَسْجِدِ', 'লোকটি মসজিদে আছে', '৪৫', 'mosque'),
  filGhurfatiMisbah: T('فِي الْغُرْفَةِ مِصْبَاحٌ', 'কামরায় একটি বাতি আছে', '৪৫', 'lamp'),
  alMisbahuFilGhurfa: T('اَلْمِصْبَاحُ فِي الْغُرْفَةِ', 'বাতিটি কামরায় আছে', '৪৫', 'lamp'),
  fisSunduqiIqd: T('فِي الصُّنْدُوقِ عِقْدٌ', 'বাক্সে একটি হার আছে', '৪৫', 'necklace'),
  alIqduFisSunduq: T('اَلْعِقْدُ فِي الصُّنْدُوقِ', 'হারটি বাক্সে আছে', '৪৫', 'necklace'),
  filHadiqatiShajara: T('فِي الْحَدِيقَةِ شَجَرَةٌ', 'বাগানে একটি গাছ আছে', '৪৫', 'tree'),
  ashShajaratuFilHadiqa: T('اَلشَّجَرَةُ فِي الْحَدِيقَةِ', 'গাছটি বাগানে আছে', '৪৫', 'tree'),

  hathihiQaryatunSaghira: T('هٰذِهِ قَرْيَةٌ صَغِيرَةٌ', 'ইহা একটি ছোট গ্রাম', '৪৫'),
  fiHathihilQaryatiMasjid: T('فِي هٰذِهِ الْقَرْيَةِ مَسْجِدٌ قَدِيمٌ', 'এই গ্রামে একটি পুরোনো মসজিদ আছে', '৪৫', 'mosque'),
  fiSuqilQaryatiDukkan: T('فِي سُوقِ الْقَرْيَةِ دُكَّانٌ صَغِيرٌ', 'গ্রামের বাজারে একটি ছোট দোকান আছে', '৪৫'),
  fiHaqibatiAishataKitab: T('فِي حَقِيبَةِ عَائِشَةَ كِتَابٌ وَقَلَمٌ', 'আয়েশার ব্যাগে একটি বই ও একটি কলম আছে', '৪৫'),

  // পৃ. ৪৬
  aishatuFiGhurfatiha: T('عَائِشَةُ فِي غُرْفَتِهَا', 'আয়েশা তার কামরায় আছে', '৪৬'),
  fiGhurfatihaMirwaha: T('فِي غُرْفَتِهَا مِرْوَحَةٌ جَدِيدَةٌ', 'তার কামরায় একটি নতুন পাখা আছে', '৪৬'),
  hathihiSayyaratuMahmud: T('هٰذِهِ سَيَّارَةُ مَحْمُودٍ', 'এটি মাহমুদের গাড়ি', '৪৬'),
  huwaFiSayyaratihi: T('هُوَ فِي سَيَّارَتِهِ', 'সে তার গাড়িতে আছে', '৪৬'),

  fiQalbilMuslimiNur: T('فِي قَلْبِ الْمُسْلِمِ نُورٌ', 'মুসলিমের অন্তরে নূর আছে', '৪৬'),
  fiQalbilKafiriDhulma: T('وَفِي قَلْبِ الْكَافِرِ ظُلْمَةٌ', 'এবং কাফেরের অন্তরে অন্ধকার আছে', '৪৬'),
  fiKitabillahiQissa: T('فِي كِتَابِ اللهِ قِصَّةٌ جَمِيلَةٌ', 'আল্লাহর কিতাবে সুন্দর গল্প আছে', '৪৬'),
  qabrurRasuliFilMadina: T('قَبْرُ الرَّسُولِ فِي الْمَدِينَةِ الْمُنَوَّرَةِ', 'রাসূলের রওজা মদীনা মুনাওয়ারায় আছে', '৪৬')
};

const QA = [
  // পৃ. ৪৬
  {
    q: T('مَنْ فِي الْمَسْجِدِ؟', 'মসজিদে কে আছে?'),
    a: T('فِي الْمَسْجِدِ رَجُلٌ', 'মসজিদে একজন লোক আছে'),
    wrong: ['فِي الْمَسْجِدِ امْرَأَةٌ', 'هُوَ فِي الْمَسْجِدِ']
  },
  {
    q: T('أَيْنَ الرَّجُلُ؟', 'লোকটি কোথায়?'),
    a: T('هُوَ فِي الْمَسْجِدِ', 'সে মসজিদে আছে'),
    wrong: ['هُوَ فِي الْبَيْتِ', 'فِي الْمَسْجِدِ رَجُلٌ']
  },
  {
    q: T('هَلْ هُوَ فِي الْمَسْجِدِ؟', 'সে কি মসজিদে আছে?'),
    a: T('نَعَمْ .. هُوَ فِي الْمَسْجِدِ', 'হাঁ.. সে মসজিদে আছে'),
    wrong: ['لَا .. هُوَ فِي الْمَسْجِدِ', 'نَعَمْ .. هِيَ فِي الْمَسْجِدِ']
  },
  {
    q: T('مَاذَا فِي حَقِيبَةِ عَائِشَةَ؟', 'আয়েশার ব্যাগে কী আছে?'),
    a: T('فِي حَقِيبَتِهَا كِتَابٌ وَقَلَمٌ', 'তার ব্যাগে একটি বই ও একটি কলম আছে'),
    wrong: ['فِي حَقِيبَتِهَا كُرَّاسَةٌ', 'فِي حَقِيبَتِهِ كِتَابٌ']
  },
  {
    q: T('هَلْ فِي حَقِيبَتِهَا كُرَّاسَةٌ وَمِسْطَرَةٌ؟', 'তার ব্যাগে কি খাতা ও স্কেল আছে?'),
    a: T('لَا .. بَلْ فِي حَقِيبَتِهَا كِتَابٌ وَقَلَمٌ', 'না.. বরং তার ব্যাগে বই ও কলম আছে'),
    wrong: ['نَعَمْ .. فِي حَقِيبَتِهَا كُرَّاسَةٌ', 'لَا .. بَلْ فِي حَقِيبَتِهِ كِتَابٌ']
  },
  {
    q: T('أَيْنَ الْمِرْوَحَةُ؟', 'পাখাটি কোথায়?'),
    a: T('هِيَ فِي غُرْفَتِي', 'তা আমার কামরায় আছে'),
    wrong: ['هُوَ فِي غُرْفَتِي', 'هِيَ فِي الصُّنْدُوقِ']
  },
  {
    q: T('أَيْنَ مَحْمُودٌ؟', 'মাহমূদ কোথায়?'),
    a: T('هُوَ فِي سَيَّارَتِهِ', 'সে তার গাড়িতে আছে'),
    wrong: ['هِيَ فِي سَيَّارَتِهَا', 'هُوَ فِي الْمَسْجِدِ']
  },
  {
    q: T('هَلْ هُوَ فِي بَيْتِهِ؟', 'সে কি তার ঘরে আছে?'),
    a: T('لَا .. بَلْ هُوَ فِي سَيَّارَتِهِ', 'না.. বরং সে তার গাড়িতে আছে'),
    wrong: ['نَعَمْ .. هُوَ فِي بَيْتِهِ', 'لَا .. هِيَ فِي بَيْتِهَا']
  },
  {
    q: T('فِي قَلْبِ مَنِ النُّورُ؟', 'কার অন্তরে নূর আছে?'),
    a: T('اَلنُّورُ فِي قَلْبِ الْمُسْلِمِ', 'নূর মুসলিমের অন্তরে আছে'),
    wrong: ['اَلنُّورُ فِي قَلْبِ الْكَافِرِ', 'اَلظُّلْمَةُ فِي قَلْبِ الْمُسْلِمِ']
  },
  {
    q: T('أَيْنَ قَبْرُ الرَّسُولِ؟', 'রাসূলের রওজা কোথায়?'),
    a: T('قَبْرُهُ فِي الْمَدِينَةِ الْمُنَوَّرَةِ', 'তাঁর রওজা মদীনা মুনাওয়ারায় আছে'),
    wrong: ['قَبْرُهُ فِي مَكَّةَ الْمُكَرَّمَةِ', 'قَبْرُهُ فِي الْقَرْيَةِ']
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
      id: 'l8-words-1',
      titleBn: 'শব্দার্থ: স্থানে ও পাত্রে থাকা (১/২)',
      shortTitle: 'ভেতরে থাকা',
      titleAr: 'الْمُفْرَدَاتُ: الظَّرْفِيَّةُ',
      desc: 'মসজিদে, গ্রামে, কামরায়, বাক্সে, বাগানে',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪৫'
    },
    [
      intro(W.fi), intro(W.filMasjid), intro(W.filQarya), intro(W.filGhurfa),
      match([W.filMasjid, W.filQarya, W.filGhurfa, W.fisSunduq]),
      intro(W.fisSunduq), intro(W.filHadiqa), intro(W.shajara), intro(W.dukkan),
      pictureChoice('shajara', ['filMasjid', 'fisSunduq', 'filHadiqa']),
      meaningOf(W.filMasjid, ['মসজিদের সামনে', 'মসজিদের পাশে']),
      arabicOf(W.fisSunduq, ['فِي الْغُرْفَةِ', 'فِي الْحَدِيقَةِ'])
    ]
  ),

  stage(
    {
      id: 'l8-grammar-fi',
      titleBn: 'ক্বায়েদা: হরফে জর فِي ও যের প্রদান',
      shortTitle: 'فِي এর নিয়ম',
      titleAr: 'قَاعِدَةُ حَرْفِ الْجَرِّ فِي',
      desc: 'فِي এর কারণে শব্দের শেষে যের হওয়ার নিয়ম',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '৪৫'
    },
    [
      {
        type: 'grammar_card',
        title: 'পাত্র বা স্থানে থাকা (فِي)',
        summary: 'فِي শব্দের অর্থ "মধ্যে" বা "ভেতরে"। এটি হরফে জর, তাই এর পরের বিশেষ্যটি যেরযুক্ত হয় (যেমন: فِي الْمَسْجِدِ)। অনির্দিষ্ট জিনিস পরে এলে তানবীনযুক্ত হয় (فِي الْمَسْجِدِ رَجُلٌ) এবং নির্দিষ্ট জিনিস শুরুতে এলে পেশযুক্ত হয় (اَلرَّجُلُ فِي الْمَسْجِدِ)।',
        table: [
          { arabic: 'فِي الْمَسْجِدِ رَجُلٌ', bangla: 'মসজিদে একজন লোক আছে' },
          { arabic: 'اَلرَّجُلُ فِي الْمَسْجِدِ', bangla: 'লোকটি মসজিদে আছে' }
        ]
      },
      spot('মসজিদে একজন লোক আছে', 'فِي الْمَسْجِدِ رَجُلٌ', 'فِي الْمَسْجِدِ اَلرَّجُلُ', 'অনির্দিষ্ট জিনিস পরে এসে তানবীনযুক্ত হয়।'),
      spot('লোকটি মসজিদে আছে', 'اَلرَّجُلُ فِي الْمَسْجِدِ', 'رَجُلٌ فِي الْمَسْجِدِ', 'নির্দিষ্ট জিনিস বাক্যের শুরুতে বসে।'),
      fill(SENT.filMasjidiRajul, 1, ['الْمَسْجِدُ', 'الْمَسْجِدَ']),
      fill(SENT.arRajuluFilMasjid, 0, ['اَلرَّجُلِ', 'اَلرَّجُلَ']),
      arabicOf(W.fi, ['عِنْدَ', 'أَمَامَ']),
      meaningOf(SENT.filGhurfatiMisbah, ['বাতিটি কামরায় আছে', 'কামরার বাতি সুন্দর'])
    ]
  ),

  stage(
    {
      id: 'l8-words-2',
      titleBn: 'শব্দার্থ: ঈমান ও বরকতময় স্থান (২/২)',
      shortTitle: 'ঈমান ও স্থান',
      titleAr: 'الْمُفْرَدَاتُ: الإِيمَانُ وَالأَمَاكِنُ',
      desc: 'গাছ, দোকান, মুসলিম, কাফের, মদীনা মুনাওয়ারা, কবর',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৪৫–৪৬'
    },
    [
      intro(W.muslim), intro(W.kafir), intro(W.alMadinatulMunawwara), intro(W.qabr),
      match([W.muslim, W.kafir, W.alMadinatulMunawwara, W.qabr]),
      intro(W.iqd), intro(W.misbah),
      pictureChoice('iqd', ['shajara', 'fisSunduq', 'misbah']),
      arabicOf(W.muslim, ['كَافِرٌ', 'مُعَلِّمٌ']),
      meaningOf(W.alMadinatulMunawwara, ['মক্কা মুকাররমা', 'একটি শহর'])
    ]
  ),

  stage(
    {
      id: 'l8-sentences-1',
      titleBn: 'কিতাবের বাক্য: অবস্থান ও উপস্থিতি (১/২)',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'কামরায় বাতি আছে, বাক্সে হার আছে, বাগানে গাছ আছে',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৫'
    },
    [
      introSentence(SENT.filGhurfatiMisbah),
      introSentence(SENT.alMisbahuFilGhurfa),
      introSentence(SENT.fisSunduqiIqd),
      introSentence(SENT.alIqduFisSunduq),
      build(SENT.fisSunduqiIqd, ['صُنْدُوقٌ', 'عِقْدِ']),
      introSentence(SENT.filHadiqatiShajara),
      introSentence(SENT.hathihiQaryatunSaghira),
      introSentence(SENT.fiHathihilQaryatiMasjid),
      build(SENT.fiHathihilQaryatiMasjid, ['مَسْجِدٍ', 'قَدِيمَةٌ']),
      fill(SENT.fiSuqilQaryatiDukkan, 0, ['عِنْدَ', 'أَمَامَ']),
      spot('বাক্সে একটি হার আছে', 'فِي الصُّنْدُوقِ عِقْدٌ', 'فِي الصُّنْدُوقُ عِقْدٌ', 'فِي এর পরের শব্দে যের হয়।')
    ]
  ),

  stage(
    {
      id: 'l8-sentences-2',
      titleBn: 'কিতাবের বাক্য: আলো, অন্ধকার ও রওজা (২/২)',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'মুসলিমের অন্তরে নূর, কাফেরের অন্তরে অন্ধকার, রাসূলের রওজা মদীনায়',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৬'
    },
    [
      introSentence(SENT.aishatuFiGhurfatiha),
      introSentence(SENT.fiGhurfatihaMirwaha),
      introSentence(SENT.huwaFiSayyaratihi),
      introSentence(SENT.fiQalbilMuslimiNur),
      introSentence(SENT.fiQalbilKafiriDhulma),
      build(SENT.fiQalbilMuslimiNur, ['نُورِ', 'مُسْلِمٌ']),
      introSentence(SENT.fiKitabillahiQissa),
      introSentence(SENT.qabrurRasuliFilMadina),
      build(SENT.qabrurRasuliFilMadina, ['مَدِينَةٌ', 'رَسُولٌ']),
      fill(SENT.fiKitabillahiQissa, 1, ['كِتَابٌ', 'كِتَابُ'])
    ]
  ),

  stage(
    {
      id: 'l8-dialogue',
      titleBn: 'কিতাবের প্রশ্নোত্তর',
      shortTitle: 'প্রশ্নোত্তর',
      titleAr: 'الْحِوَارُ وَالأَسْئِلَةُ',
      desc: 'মসজিদে কে আছে? লোকটি কোথায়? আয়েশার ব্যাগে কী আছে?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৪৬'
    },
    [
      dialogue(QA[0]),
      dialogue(QA[1]),
      dialogue(QA[2]),
      dialogue(QA[3]),
      dialogue(QA[4]),
      dialogue(QA[5]),
      dialogue(QA[6]),
      dialogue(QA[7]),
      dialogue(QA[8]),
      dialogue(QA[9])
    ]
  ),

  stage(
    {
      id: 'l8-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الاخْتِبَارُ النِّهَائِيُّ',
      desc: '৮ম পাঠের فِي ও আধারের পূর্ণাঙ্গ মূল্যায়ন',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '৪৫–৪৬'
    },
    [
      quiz("'মসজিদে একজন লোক আছে' এর আরবি কোনটি?", ['فِي الْمَسْجِدِ رَجُلٌ', 'اَلرَّجُلُ فِي الْمَسْجِدِ', 'أَمَامَ الْمَسْجِدِ رَجُلٌ'], 'ভেতরে অনির্দিষ্ট জিনিস প্রকাশ করতে فِي الْمَسْجِدِ رَجُلٌ বলা হয়।'),
      quiz("'লোকটি মসজিদে আছে' বলতে কীভাবে বলবেন?", ['اَلرَّجُلُ فِي الْمَسْجِدِ', 'فِي الْمَسْجِدِ رَجُلٌ', 'رَجُلٌ فِي الْمَسْجِدِ'], 'নির্দিষ্ট জিনিস বাক্যের শুরুতে আসে।'),
      quiz("'فِي الصُّنْدُوقِ عِقْدٌ' বাক্যটির অর্থ কী?", ['বাক্সে একটি হার আছে', 'কামরায় একটি বাতি আছে', 'ব্যাগে একটি কলম আছে'], 'الصُّنْدُوقِ = বাক্স, عِقْدٌ = হার।'),
      quiz("হরফে জর 'فِي' এর পর শব্দের রূপ কেমন হয়?", ['সর্বদা যেরযুক্ত (مَجْرُور)', 'সর্বদা পেশযুক্ত', 'সর্বদা যবরযুক্ত'], 'হরফে জর তার পরবর্তী শব্দকে যের প্রদান করে।'),
      quiz("'شَجَرَةٌ' শব্দের অর্থ কী?", ['একটি গাছ', 'একটি ফুল', 'একটি ফল'], 'شَجَرَةٌ অর্থ একটি গাছ।'),
      quiz("'فِي قَلْبِ الْمُسْلِمِ نُورٌ' এর সঠিক অর্থ কোনটি?", ['মুসলিমের অন্তরে নূর আছে', 'মুসলিমের অন্তরে অন্ধকার আছে', 'কাফেরের অন্তরে নূর আছে'], 'نُورٌ অর্থ আলো বা নূর।'),
      quiz("'قَبْرُ الرَّسُولِ فِي الْمَدِينَةِ الْمُنَوَّرَةِ' বাক্যটির অর্থ কী?", ['রাসূলের রওজা মদীনা মুনাওয়ারায়', 'রাসূলের ঘর মক্কায়', 'কুরআন আল্লাহর কিতাব'], 'قَبْرُ = কবর বা রওজা।'),
      quiz("'دُكَّانٌ' শব্দের অর্থ কী?", ['একটি দোকান', 'একটি বাজার', 'একটি বাড়ি'], 'دُكَّانٌ অর্থ একটি দোকান।'),
      quiz("'فِي حَقِيبَتِهَا كِتَابٌ وَقَلَمٌ' বলতে কার ব্যাগ বোঝায়?", ['তার ব্যাগে (স্ত্রী)', 'তার ব্যাগে (পুরুষ)', 'আমার ব্যাগে'], 'ـهَا সর্বনামটি নারীবাচক।'),
      quiz("'কাফের' এর আরবি রূপ কোনটি?", ['كَافِرٌ', 'مُسْلِمٌ', 'ظُلْمَةٌ'], 'كَافِرٌ অর্থ একজন কাফের।')
    ]
  )
];

// ---------- চর্চার পর্বসমূহ যোগ ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l8-sentences-1', stage(
  {
    id: 'l8-practice-1',
    titleBn: 'চর্চা ১: فِي এর সঠিক প্রয়োগ',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'ভেতরের জিনিসের অবস্থান ও হরফে জরের মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৪৫–৪৬'
  },
  [
    match([W.filMasjid, W.filGhurfa, W.fisSunduq, W.filHadiqa]),
    fill(SENT.aishatuFiGhurfatiha, 1, ['عِنْدَ', 'فَوْقَ']),
    build(SENT.huwaFiSayyaratihi, ['سَيَّارَةٌ', 'هِيَ']),
    spot('মুসলিমের অন্তরে নূর আছে', 'فِي قَلْبِ الْمُسْلِمِ نُورٌ', 'فِي قَلْبُ الْمُسْلِمِ نُورٌ', 'হরফে জর فِي এর পর যের হয়।'),
    arabicOf(W.filHadiqa, ['فِي الصُّنْدُوقِ', 'فِي الْغُرْفَةِ']),
    meaningOf(SENT.fiGhurfatihaMirwaha, ['তার কামরায় একটি পুরোনো পাখা আছে', 'তার কামরা পরিচ্ছন্ন']),
    build(SENT.fiHathihilQaryatiMasjid, ['بَيْتٌ', 'جَدِيدٌ']),
    fill(SENT.fiQalbilKafiriDhulma, 3, ['نُورٌ', 'قِصَّةٌ']),
    match([W.muslim, W.kafir, W.shajara, W.dukkan]),
    spot('আয়েশা তার কামরায় আছে', 'عَائِشَةُ فِي غُرْفَتِهَا', 'عَائِشَةُ فِي غُرْفَتِهِ', 'আয়েশা নারী, তাই غُرْفَتِهَا হবে।')
  ]
));

insertAfter('l8-dialogue', stage(
  {
    id: 'l8-practice-2',
    titleBn: 'চর্চা ২: নূর ও অন্ধকারের দলভাগ',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'আলো ও অন্ধকার সম্পর্কিত বাক্য ও শব্দের শ্রেণীবিন্যাস',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৪৬'
  },
  [
    {
      type: 'sort_groups',
      title: 'শব্দটি নূর (نُورٌ) সম্পর্কিত না অন্ধকার (ظُلْمَةٌ) সম্পর্কিত?',
      groups: [
        { id: 'nur', arabic: 'নূর (نُورٌ)' },
        { id: 'dhulma', arabic: 'অন্ধকার (ظُلْمَةٌ)' }
      ],
      items: [
        { arabic: 'اَلْمُسْلِمُ', reveal: 'فِي قَلْبِ الْمُسْلِمِ نُورٌ (মুসলিমের অন্তরে নূর)', group: 'nur' },
        { arabic: 'اَلْكَافِرُ', reveal: 'فِي قَلْبِ الْكَافِرِ ظُلْمَةٌ (কাফেরের অন্তরে অন্ধকার)', group: 'dhulma' },
        { arabic: 'كِتَابُ اللهِ', reveal: 'فِي كِتَابِ اللهِ نُورٌ (আল্লাহর কিতাবে নূর)', group: 'nur' },
        { arabic: 'اَلظُّلْمَةُ', reveal: 'اَلظُّلْمَةُ فِي قَلْبِ الْكَافِرِ (অন্ধকার)', group: 'dhulma' }
      ]
    },
    fill(SENT.ashShajaratuFilHadiqa, 0, ['اَلشَّجَرَةِ', 'اَلشَّجَرَةَ']),
    build(SENT.alIqduFisSunduq, ['عِقْدٌ', 'صُنْدُوقٌ']),
    spot('গাছটি বাগানে আছে', 'اَلشَّجَرَةُ فِي الْحَدِيقَةِ', 'اَلشَّجَرَةُ فِي الْحَدِيقَةُ', 'فِي এর পরের শব্দ যেরযুক্ত হয়।'),
    arabicOf(W.dukkan, ['سُوقٌ', 'قَرْيَةٌ']),
    meaningOf(SENT.fiKitabillahiQissa, ['আল্লাহর কিতাবে কোনো গল্প নেই', 'কিতাবটি খুব সুন্দর']),
    match([W.fiGhurfatika, W.fiGhurfatiki, W.fiGhurfatihi, W.fiGhurfatiha])
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
  page: '৪৬'
}));

const tamrinKitabi = [
  {
    task: 'বাংলায় অনুবাদ করো',
    arabic: 'فِي الْمَسْجِدِ رَجُلٌ ، اَلرَّجُلُ فِي الْمَسْجِدِ.',
    bangla: 'মসজিদে একজন লোক আছে, লোকটি মসজিদে আছে।'
  },
  {
    task: 'আরবিতে বলো ও লেখো',
    arabic: 'فِي الْغُرْفَةِ مِصْبَاحٌ وَفِي الصُّنْدُوقِ عِقْدٌ.',
    bangla: 'কামরায় একটি বাতি আছে এবং বাক্সে একটি হার আছে।'
  },
  {
    task: 'শূন্যস্থান পূরণ করো',
    arabic: 'فِي قَلْبِ الْمُسْلِمِ ...... ، وَفِي قَلْبِ الْكَافِرِ ...... .',
    bangla: 'মুসলিমের অন্তরে নূর আছে, এবং কাফেরের অন্তরে অন্ধকার আছে।'
  },
  {
    task: 'স্থান ও অবস্থান বলো',
    arabic: 'قَبْرُ الرَّسُولِ فِي الْمَدِينَةِ الْمُنَوَّرَةِ.',
    bangla: 'রাসূলের রওজা মদীনা মুনাওয়ারায়।'
  }
];

const quizLegacy = bookStages
  .find(s => s.id === 'l8-quiz')
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
    id: 'l8-q-fi',
    stageId: 'l8-grammar-fi',
    title: 'হরফে জর فِي এর ব্যবহার (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'فِي الْمَسْجِدِ رَجُلٌ', bangla: 'মসজিদে একজন লোক আছে' },
      { arabic: 'اَلرَّجُلُ فِي الْمَسْجِدِ', bangla: 'লোকটি মসজিদে আছে' }
    ],
    rule: 'কোনো স্থান বা আধারের ভেতরে থাকা বোঝাতে فِي ব্যবহৃত হয়। فِي হরফে জর হওয়ায় এর পরের শব্দকে যের দেয়: যেমন فِي الْمَسْجِدِ। স্থান জানতে প্রশ্ন করতে أَيْنَ？ এবং ভেতরে কে জানতে مَنْ فِي...？ ব্যবহার করা হয়।',
    examples: [{ arabic: 'فِي الْغُرْفَةِ مِصْبَاحٌ', bangla: 'কামরায় একটি বাতি আছে' }]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l8',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৪৫-৪৬',
    qaida,
    grammarRule: {
      title: 'স্থান ও আধারের ভেতরে থাকা (فِي)',
      summary: 'কোনো পাত্র বা স্থানের ভেতরে কিছু থাকা প্রকাশ করার নিয়ম।',
      points: [
        'স্থানের ভেতরে থাকা বোঝাতে فِي বলুন: فِي الْمَسْجِدِ (মসজিদে)।',
        'فِي এলে শব্দের শেষে যের হয়: فِي الْغُرْفَةِ (কামরায়)।',
        'অনির্দিষ্ট বস্তু শেষে এলে তানবীন হয়: فِي الْمَسْجِدِ رَجُلٌ।',
        'ভেতরে কে আছে জানতে প্রশ্ন: مَنْ فِي الْمَسْجِدِ؟'
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
