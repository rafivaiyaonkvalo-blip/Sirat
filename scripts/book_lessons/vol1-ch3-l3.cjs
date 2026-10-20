// vol1-ch3-l3.cjs  |  দারস ৩ — ৩য় অধ্যায়  |  পৃষ্ঠা ৯৯–১০২
// বিষয়: ইদাফাত + সিফাত মিলিয়ে জটিল বাক্য, ব্যাপক কথোপকথন

const W = {
  saf:     { arabic: 'صَافٍ',      bangla: 'পরিষ্কার' },
  qadhir:  { arabic: 'قَذِرٌ',      bangla: 'নোংরা' },
  mabad:   { arabic: 'مَعْبَدٌ',    bangla: 'মন্দির' },
  sajjada: { arabic: 'سَجَّادَةٌ', bangla: 'জায়নামায, গালিচা' },
  ghurfa:  { arabic: 'غُرْفَةٌ',    bangla: 'একটি কামরা', picture: 'room' },
  qarya:   { arabic: 'قَرْيَةٌ',    bangla: 'একটি গ্রাম' },
  nahr:    { arabic: 'نَهْرٌ',      bangla: 'একটি নদী' },
  shajara: { arabic: 'شَجَرَةٌ',   bangla: 'একটি গাছ', picture: 'tree' },
  misbah:  { arabic: 'مِصْبَاحٌ',   bangla: 'একটি বাতি', picture: 'lamp' },
  mirwaha: { arabic: 'مِرْوَحَةٌ',  bangla: 'একটি পাখা', picture: 'fan' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  g1: T('هَذِهِ غُرْفَةٌ صَغِيرَةٌ.',                                'এটি একটি ছোট কামরা।',                     '১০২'),
  g2: T('اَلْغُرْفَةُ الصَّغِيرَةُ نَظِيفَةٌ.',                        'ছোট কামরাটি পরিচ্ছন্ন।',                   '১০২'),
  g3: T('هَذِهِ غُرْفَةُ فَاطِمَةَ.',                                  'এটি ফাতেমার কামরা।',                      '১০২'),
  g4: T('فَاطِمَةُ بِنْتٌ طَيِّبَةٌ.',                                 'ফাতেমা ভালো মেয়ে।',                      '১০২'),
  g5: T('غُرْفَتُهَا نَظِيفَةٌ وَفِرَاشُهَا نَظِيفٌ.',                 'তার কামরা পরিচ্ছন্ন এবং তার বিছানা পরিচ্ছন্ন।', '১০২'),
  g6: T('فِي غُرْفَةِ فَاطِمَةَ سَرِيرٌ وَمِنْضَدَةٌ.',               'ফাতেমার কামরায় একটি খাট ও একটি ছোট টেবিল আছে।', '১০২'),
  g7: T('فِي غُرْفَتِهَا مِصْبَاحٌ وَمِرْوَحَةٌ.',                    'তার কামরায় বাতি ও পাখা আছে।',            '১০২'),
  g8: T('اَلْمِصْبَاحُ جَدِيدٌ وَالْمِرْوَحَةُ جَيِّدَةٌ.',            'বাতিটি নতুন এবং পাখাটি ভালো।',            '১০২'),
  g9: T('اَلْمِرْوَحَةُ تَحْتَ السَّقْفِ.',                            'পাখাটি ছাদের নিচে।',                      '১০২'),
  g10:T('فَوْقَ الْمِنْضَدَةِ سَاعَةٌ جَمِيلَةٌ.',                    'ছোট টেবিলের উপর একটি সুন্দর ঘড়ি আছে।',   '১০২'),
  g11:T('بِجَانِبِ السَّاعَةِ الْجَمِيلَةِ قَلَمٌ.',                  'সুন্দর ঘড়িটির পাশে একটি কলম আছে।',       '১০২'),
  g12:T('بَابُ هَذِهِ الْغُرْفَةِ مَفْتُوحٌ.',                        'এই কামরার দরজা খোলা।',                    '১০২'),
  g13:T('بَابُ هَذِهِ الْغُرْفَةِ الصَّغِيرَةِ وَاسِعٌ.',            'এই ছোট কামরার দরজা প্রশস্ত।',            '১০২'),
  q1: T('هَذِهِ قَرْيَةٌ قَدِيمَةٌ.',                                  'এটি একটি পুরনো গ্রাম।',                   '১০৩'),
  q2: T('اَلْقَرْيَةُ بِجَانِبِ النَّهْرِ.',                           'গ্রামটি নদীর পাশে।',                      '১০৩'),
  q3: T('اَلْقَرْيَةُ الْقَدِيمَةُ بِجَانِبِ النَّهْرِ الْوَاسِعِ.', 'পুরনো গ্রামটি প্রশস্ত নদীর পাশে।',          '১০৩'),
  q4: T('مَاءُ هَذَا النَّهْرِ صَافٍ.',                               'এই নদীর পানি পরিষ্কার।',                  '১০৩'),
  q5: T('فِي هَذِهِ الْقَرْيَةِ مَسْجِدٌ كَبِيرٌ وَمَعْبَدٌ صَغِيرٌ.', 'এই গ্রামে একটি বড় মসজিদ ও একটি ছোট মন্দির আছে।', '১০৩'),
  q6: T('اَلْمَسْجِدُ الْكَبِيرُ جَمِيلٌ.',                           'বড় মসজিদটি সুন্দর।',                      '১০৩'),
  q7: T('اِسْمُ هَذَا الْمَسْجِدِ مَسْجِدُ النُّورِ.',               'এই মসজিদের নাম মসজিদুন নূর।',            '১০৪'),
  q8: T('فِي مَسْجِدِ النُّورِ سَجَّادَةٌ غَالِيَةٌ.',               'মসজিদুন নূরে একটি দামী জায়নামায আছে।',   '১০৪'),
  q9: T('فِي هَذِهِ الْقَرْيَةِ شَجَرَةٌ عَالِيَةٌ.',               'এই গ্রামে একটি উঁচু গাছ আছে।',            '১০৪'),
  q10:T('اَلشَّجَرَةُ الْعَالِيَةُ بِجَانِبِ الْبَيْتِ الصَّغِيرِ.', 'উঁচু গাছটি ছোট ঘরের পাশে।',               '১০৪'),
  q11:T('هَذَا الْبَيْتُ الصَّغِيرُ بِجَانِبِ الشَّجَرَةِ الْعَالِيَةِ.', 'এই ছোট ঘরটি উঁচু গাছের পাশে।',          '১০৪'),
};

const intro = (item, title) => ({
  type: 'intro', title: title || 'নতুন শব্দ',
  word: { arabic: item.arabic, bangla: item.bangla }, picture: item.picture,
});
const introSentence = (s) => ({
  type: 'intro', title: 'কিতাবের বাক্য',
  word: { arabic: s.arabic, bangla: s.bangla },
});
const match = (items, title) => ({
  type: 'match_pairs', title: title || 'শব্দজোড় মেলান',
  pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla })),
});
const mcqWord = (item, wrong, q) => ({
  type: 'mcq', word: { arabic: item.arabic, bangla: item.bangla },
  question: q || 'শব্দটির অর্থ কী?',
  options: [item.bangla, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const arabicOf = (item, wrong) => ({
  type: 'mcq', word: { arabic: item.arabic, bangla: item.bangla },
  question: `'${item.bangla}' — আরবিতে কোনটি?`,
  options: [item.arabic, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const fillBlank = (sent, correct, wrong, hint) => ({
  type: 'fill_blank', sentence: sent, correctAnswer: correct, hint: hint || '',
  options: [correct, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const sentenceBuilder = (s, dist) => ({
  type: 'sentence_builder', title: 'বাক্য সাজাও',
  targetSentence: s.arabic, targetTranslation: s.bangla,
  targetTokens: s.arabic.split(' ').filter(Boolean), distractors: dist,
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

const bookStages = [
  {
    id: 'l20-words', titleBn: 'নতুন শব্দ', shortTitle: 'শব্দার্থ',
    titleAr: 'الْمُفْرَدَاتُ', desc: 'পরিষ্কার, নোংরা, মন্দির, জায়নামায',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '১০৩',
    steps: [
      intro(W.saf), intro(W.qadhir), intro(W.mabad), intro(W.sajjada),
      match([W.saf, W.qadhir, W.mabad, W.sajjada]),
      mcqWord(W.qadhir, ['পরিষ্কার', 'মন্দির']),
      arabicOf(W.sajjada, ['مَعْبَدٌ', 'قَذِرٌ']),
    ],
  },
  {
    id: 'l20-ghurfa', titleBn: 'ফাতেমার ছোট কামরা', shortTitle: 'কামরা',
    titleAr: 'غُرْفَةُ فَاطِمَةَ', desc: 'ছোট কামরা, বাতি, পাখা, ঘড়ি, কলম',
    iconName: 'Zap', color: 'violet', estMinutes: 5, bookPages: '১০২',
    steps: [
      introSentence(SENT.g1), introSentence(SENT.g2), introSentence(SENT.g3), introSentence(SENT.g4),
      introSentence(SENT.g5), introSentence(SENT.g6), introSentence(SENT.g7), introSentence(SENT.g8),
      introSentence(SENT.g9), introSentence(SENT.g10), introSentence(SENT.g11), introSentence(SENT.g12),
      introSentence(SENT.g13),
      mcqWord({ arabic: 'اَلْغُرْفَةُ الصَّغِيرَةُ نَظِيفَةٌ.', bangla: 'ছোট কামরাটি পরিচ্ছন্ন।' }, ['কামরাটি ছোট।', 'ছোট কামরাটি নোংরা।'], 'বাক্যটির অর্থ কী?'),
      mcqWord({ arabic: 'غُرْفَتُهَا نَظِيفَةٌ وَفِرَاشُهَا نَظِيفٌ.', bangla: 'তার কামরা পরিচ্ছন্ন এবং তার বিছানা পরিচ্ছন্ন।' }, ['তার কামরা পরিচ্ছন্ন এবং তার ছাদ খোলা।', 'তার কামরা ছোট এবং তার বিছানা নোংরা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('اَلْمِرْوَحَةُ ___ السَّقْفِ.', 'تَحْتَ', ['فَوْقَ', 'أَمَامَ'], 'ছাদের নিচে'),
      sentenceBuilder(SENT.g2, ['كَبِيرَةٌ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.g8, ['قَدِيمٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l20-qarya', titleBn: 'পুরনো গ্রাম ও নদী', shortTitle: 'গ্রাম ও নদী',
    titleAr: 'الْقَرْيَةُ الْقَدِيمَةُ', desc: 'পুরনো গ্রাম, প্রশস্ত নদী, মসজিদ, মন্দির',
    iconName: 'Star', color: 'teal', estMinutes: 4, bookPages: '১০৩',
    steps: [
      introSentence(SENT.q1), introSentence(SENT.q2), introSentence(SENT.q3),
      introSentence(SENT.q4), introSentence(SENT.q5), introSentence(SENT.q6),
      mcqWord({ arabic: 'اَلْقَرْيَةُ بِجَانِبِ النَّهْرِ.', bangla: 'গ্রামটি নদীর পাশে।' }, ['গ্রামটি নদীর উপর।', 'নদীটি গ্রামের নিচে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('مَاءُ هَذَا النَّهْرِ ___.', 'صَافٍ', ['قَذِرٌ', 'مَفْتُوحٌ'], 'পরিষ্কার = ?'),
      sentenceBuilder(SENT.q2, ['فَوْقَ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.q6, ['الصَّغِيرُ', 'هَذِهِ', 'أَمْ']),
    ],
  },
  {
    id: 'l20-masjid', titleBn: 'মসজিদুন নূর ও উঁচু গাছ', shortTitle: 'মসজিদুন নূর',
    titleAr: 'مَسْجِدُ النُّورِ', desc: 'মসজিদুন নূর, দামী জায়নামায, উঁচু গাছ',
    iconName: 'Sparkles', color: 'cyan', estMinutes: 4, bookPages: '১০৪',
    steps: [
      introSentence(SENT.q7), introSentence(SENT.q8), introSentence(SENT.q9),
      introSentence(SENT.q10), introSentence(SENT.q11),
      mcqWord({ arabic: 'اِسْمُ هَذَا الْمَسْجِدِ مَسْجِدُ النُّورِ.', bangla: 'এই মসজিদের নাম মসজিদুন নূর।' }, ['এই মাদরাসার নাম মসজিদুন নূর।', 'ঐ মসজিদের নাম মসজিদুন নূর।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('فِي مَسْجِدِ النُّورِ ___ غَالِيَةٌ.', 'سَجَّادَةٌ', ['شَجَرَةٌ', 'مِرْوَحَةٌ'], 'জায়নামায'),
      sentenceBuilder(SENT.q7, ['الْمَدْرَسَةِ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.q10, ['الْكَبِيرِ', 'هَذِهِ', 'أَمْ']),
    ],
  },
  {
    id: 'l20-tamrin', titleBn: 'প্রশ্নোত্তর (পৃ. ১০২–১০৪)', shortTitle: 'প্রশ্নোত্তর',
    titleAr: 'الْأَسْئِلَةُ', desc: 'কিতাবের প্রশ্নগুলো পড়ো ও অর্থ বলো',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '১০২–১০৪',
    steps: [
      introSentence(T('مَا هَذِهِ؟ هَلْ هَذِهِ غُرْفَةٌ صَغِيرَةٌ؟', 'এটি কী? এটি কি ছোট কামরা?', '১০২')),
      introSentence(T('كَيْفَ الْغُرْفَةُ الصَّغِيرَةُ؟ أَ نَظِيفَةٌ هِيَ أَمْ قَذِرَةٌ؟', 'ছোট কামরাটি কেমন? সেটি কি পরিচ্ছন্ন না নোংরা?', '১০২')),
      introSentence(T('غُرْفَةُ مَنْ هَذِهِ؟ أَ غُرْفَةُ خَالِدٍ هَذِهِ؟', 'এটি কার কামরা? এটি কি খালেদের কামরা?', '১০২')),
      introSentence(T('أَيْنَ فَاطِمَةُ؟ أَ فِي غُرْفَتِهَا هِيَ أَمْ فِي غُرْفَةِ الْمُعَلِّمَةِ؟', 'ফাতেমা কোথায়? সে কি তার কামরায় না শিক্ষিকার কামরায়?', '১০৩')),
      introSentence(T('أَيْنَ الْمِصْبَاحُ وَالْمِرْوَحَةُ؟ أَ جَدِيدٌ الْمِصْبَاحُ أَمْ قَدِيمٌ؟', 'বাতি ও পাখা কোথায়? বাতিটি কি নতুন না পুরনো?', '১০৩')),
      introSentence(T('مَاذَا تَحْتَ السَّقْفِ؟ مَاذَا فَوْقَ الْمِنْضَدَةِ؟ أَيْنَ الْقَلَمُ؟', 'ছাদের নিচে কী আছে? ছোট টেবিলের উপর কী আছে? কলমটি কোথায়?', '১০৩')),
      introSentence(T('هَلْ بَابُ هَذِهِ الْغُرْفَةِ مَفْتُوحٌ؟ أَ مَفْتُوحٌ بَابُ هَذِهِ الْغُرْفَةِ الصَّغِيرَةِ أَمْ مُغْلَقٌ؟', 'এই কামরার দরজা কি খোলা? এই ছোট কামরার দরজা কি খোলা না বন্ধ?', '১০৩')),
      introSentence(T('أَ قَرْيَةٌ قَدِيمَةٌ هَذِهِ أَمْ قَرْيَةٌ جَدِيدَةٌ؟ أَيْنَ الْقَرْيَةُ الْقَدِيمَةُ؟', 'এটি কি পুরনো গ্রাম না নতুন গ্রাম? পুরনো গ্রামটি কোথায়?', '১০৪')),
      introSentence(T('هَلْ مَاءُ هَذَا النَّهْرِ صَافٍ؟ هَلْ فِي هَذِهِ الْقَرْيَةِ مَسْجِدٌ؟', 'এই নদীর পানি কি পরিষ্কার? এই গ্রামে কি মসজিদ আছে?', '১০৪')),
      introSentence(T('آلْمَسْجِدُ كَبِيرٌ أَمِ الْمَعْبَدُ؟ مَا اسْمُ هَذَا الْمَسْجِدِ الصَّغِيرِ؟', 'মসজিদ কি বড় না মন্দির? এই ছোট মসজিদের নাম কী?', '১০৪')),
      introSentence(T('مَاذَا بِجَانِبِ الْبَيْتِ الصَّغِيرِ؟ أَيْنَ الشَّجَرَةُ الْعَالِيَةُ؟', 'ছোট ঘরের পাশে কী আছে? উঁচু গাছটি কোথায়?', '১০৪')),
      match([W.saf, W.qadhir, W.mabad, W.sajjada], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'নিচের প্রশ্নগুলোর উত্তর দাও', arabic: 'كَيْفَ الْغُرْفَةُ الصَّغِيرَةُ؟', bangla: 'ছোট কামরাটি কেমন?', mode: 'ar-to-bn', page: '১০২' },
  { task: 'নিচের প্রশ্নগুলোর উত্তর দাও', arabic: 'هَلْ مَاءُ هَذَا النَّهْرِ صَافٍ؟', bangla: 'এই নদীর পানি কি পরিষ্কার?', mode: 'ar-to-bn', page: '১০৪' },
];
const quizLegacy = [
  { question: "'صَافٍ' অর্থ কী?", options: ['পরিষ্কার', 'নোংরা', 'বড়'], correctIndex: 0, correctAnswer: 0, explanation: 'সাফিন = পরিষ্কার।', type: 'mcq' },
  { question: "'مَعْبَدٌ' অর্থ?", options: ['মন্দির', 'মসজিদ', 'মাদরাসা'], correctIndex: 0, correctAnswer: 0, explanation: 'মা’বাদ = মন্দির।', type: 'mcq' },
  { question: "'اَلْمِرْوَحَةُ تَحْتَ السَّقْفِ' মানে?", options: ['পাখাটি ছাদের নিচে', 'পাখাটি ছাদের উপর', 'পাখাটি কামরায়'], correctIndex: 0, correctAnswer: 0, explanation: 'তাহতা = নিচে।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch3-l3',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ১০২-১০৪', qaida,
    grammarRule: { title: 'জটিল বাক্য', summary: 'ইদাফাত ও সিফাতের মিশ্রণ', points: [] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};
