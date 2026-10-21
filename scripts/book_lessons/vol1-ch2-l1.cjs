// scripts/book_lessons/vol1-ch2-l1.cjs
// দারস ১ — ২য় অধ্যায় | কিতাব পৃষ্ঠা ৫১–৫৬ (PDF ৪৯–৫৪)
// বিষয়: নতুন শব্দভাণ্ডার (বিভিন্ন জিনিস) ও সাধারণ-বিশেষ প্রশ্নোত্তর (هَلْ / أَ / أَمْ)

// ---------- ১. কিতাবের শব্দ ----------
const W = {
  bunduq:  { arabic: 'بُنْدُقِيَّةٌ', bangla: 'একটি বন্দুক',    picture: 'key' },
  saif:    { arabic: 'سَيْفٌ',        bangla: 'একটি তলোয়ার',   picture: 'key' },
  qaws:    { arabic: 'قَوْسٌ',        bangla: 'একটি ধনুক',      picture: 'ruler' },
  sahm:    { arabic: 'سَهْمٌ',        bangla: 'একটি তীর',       picture: 'pen' },
  milaqa:  { arabic: 'مِلْعَقَةٌ',   bangla: 'একটি চামচ',      picture: 'clock' },
  kuwb:    { arabic: 'كُوبٌ',         bangla: 'একটি গ্লাস',     picture: 'box' },
  milha:   { arabic: 'مِلْحَةٌ',     bangla: 'একটি নিমকদানি',  picture: 'box' },
  ibriq:   { arabic: 'إِبْرِيقٌ',    bangla: 'একটি জগ',        picture: 'box' },
  nazara:  { arabic: 'نَظَّارَةٌ',   bangla: 'একটি চশমা',      picture: 'glasses' },
  miftah:  { arabic: 'مِفْتَاحٌ',    bangla: 'একটি চাবি',      picture: 'key' },
  qufl:    { arabic: 'قُفْلٌ',        bangla: 'একটি তালা',      picture: 'lock' },
  kura:    { arabic: 'كُرَةٌ',        bangla: 'একটি বল',        picture: 'ball' },
  sayyara: { arabic: 'سَيَّارَةٌ',   bangla: 'একটি গাড়ি',     picture: 'car' },
  taira:   { arabic: 'طَائِرَةٌ',    bangla: 'একটি বিমান',     picture: 'airplane' },
  dabbaba: { arabic: 'دَبَّابَةٌ',    bangla: 'একটি ট্যাংক' },
  qunbula: { arabic: 'قُنْبُلَةٌ',   bangla: 'একটি বোমা' },
  bakhira: { arabic: 'بَاخِرَةٌ',    bangla: 'একটি স্টীমার' },
  midfa:   { arabic: 'مِدْفَعٌ',     bangla: 'একটি কামান' },
  hisn:    { arabic: 'حِصْنٌ',       bangla: 'একটি দুর্গ' },
  qalaa:   { arabic: 'قَلْعَةٌ',     bangla: 'একটি দুর্গ' },
  mawqid:  { arabic: 'مَوْقِدٌ',     bangla: 'একটি চুলা' },
  finjan:  { arabic: 'فِنْجَانٌ',    bangla: 'একটি চায়ের কাপ' },
  sahn:    { arabic: 'صَحْنٌ',       bangla: 'একটি থালা, বাসন' },
  matbakh: { arabic: 'مَطْبَخٌ',     bangla: 'একটি রান্নাঘর' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

// ---------- ২. কিতাবের বাক্য ----------
const SENT = {
  hal_qalam:      T('هَلْ هَذَا قَلَمٌ؟',                              'এটি কি একটি কলম?',              '৫৬'),
  naam_qalam:     T('نَعَمْ، هَذَا قَلَمٌ جَيِّدٌ.',                  'হ্যাঁ, এটি একটি ভালো কলম।',    '৫৬'),
  laa_qufl:       T('لَا، هَذَا قُفْلٌ.',                              'না, এটি একটি তালা।',            '৫৬'),
  hal_nazara:     T('هَلْ تِلْكَ نَظَّارَةٌ؟',                        'সেটি কি একটি চশমা?',            '৫৫'),
  naam_nazara:    T('نَعَمْ، تِلْكَ نَظَّارَةٌ.',                    'হ্যাঁ, সেটি একটি চশমা।',        '৫৫'),
  a_qalam_miftah: T('أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟',               'এটি কি কলম নাকি চাবি?',         '৫৬'),
  qalam_only:     T('قَلَمٌ.',                                          'কলম।',                           '৫৬'),
  a_miftah_qufl:  T('أَ مِفْتَاحٌ هَذَا أَمْ قُفْلٌ؟',               'এটি কি চাবি নাকি তালা?',        '৫৬'),
  miftah_only:    T('مِفْتَاحٌ.',                                       'চাবি।',                          '৫৬'),
  a_taira_sayyara:T('أَ طَائِرَةٌ هَذِهِ أَمْ سَيَّارَةٌ؟',          'এটি কি বিমান নাকি গাড়ি?',      '৫৫'),
};

// ---------- ৩. হেল্পার ----------
const intro = (item, title) => ({
  type: 'intro', title: title || 'নতুন শব্দ',
  word: { arabic: item.arabic, bangla: item.bangla },
  picture: item.picture,
});
const introSentence = (sent) => ({
  type: 'intro', title: 'কিতাবের বাক্য',
  word: { arabic: sent.arabic, bangla: sent.bangla },
});
const match = (items, title) => ({
  type: 'match_pairs', title: title || 'শব্দজোড় মেলান',
  pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla })),
});
const mcqWord = (item, wrongBanglas, question) => ({
  type: 'mcq',
  word: { arabic: item.arabic, bangla: item.bangla },
  question: question || 'শব্দটির অর্থ কী?',
  options: [item.bangla, ...wrongBanglas].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const arabicOf = (item, wrongArabics) => ({
  type: 'mcq',
  word: { arabic: item.arabic, bangla: item.bangla },
  question: `'${item.bangla}' — আরবিতে কোনটি?`,
  options: [item.arabic, ...wrongArabics].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const fillBlank = (sentence, correct, wrong, hint) => ({
  type: 'fill_blank', sentence, correctAnswer: correct,
  hint: hint || '',
  options: [correct, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const sentenceBuilder = (sent, distractors) => ({
  type: 'sentence_builder', title: 'বাক্য সাজাও',
  targetSentence: sent.arabic, targetTranslation: sent.bangla,
  targetTokens: sent.arabic.split(' ').filter(Boolean), distractors,
});
const pictureChoice = (items, title) => ({
  type: 'picture_choice', title: title || 'ছবি দেখে সঠিক শব্দ বেছে নাও',
  targetArabic: items[0].arabic,
  options: items.map((it, i) => ({ text: it.arabic, bangla: it.bangla, picture: it.picture, isCorrect: i === 0 })),
});

// ---------- ৪. পর্বসমূহ ----------
const bookStages = [
  {
    id: 'l10-words-1', titleBn: 'শব্দার্থ (১/২)', shortTitle: 'শব্দার্থ ১',
    titleAr: 'الْمُفْرَدَاتُ (١)', desc: 'চাবি, তালা, চশমা, জগ ও গ্লাস',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৫১–৫৩',
    steps: [
      intro(W.miftah), intro(W.qufl), intro(W.nazara), intro(W.ibriq), intro(W.kuwb),
      match([W.miftah, W.qufl, W.nazara, W.ibriq]),
      mcqWord(W.miftah, ['একটি তালা', 'একটি গ্লাস']),
      mcqWord(W.qufl,   ['একটি চাবি', 'একটি চশমা']),
      mcqWord(W.nazara, ['একটি জগ',   'একটি তালা']),
      pictureChoice([W.miftah, W.qufl, W.nazara, W.kuwb]),
      arabicOf(W.qufl, ['مِفْتَاحٌ', 'نَظَّارَةٌ']),
    ],
  },
  {
    id: 'l10-words-2', titleBn: 'শব্দার্থ (২/২)', shortTitle: 'শব্দার্থ ২',
    titleAr: 'الْمُفْرَدَاتُ (٢)', desc: 'চামচ, বল, গাড়ি ও বিমান',
    iconName: 'Star', color: 'blue', estMinutes: 3, bookPages: '৫৩–৫৪',
    steps: [
      intro(W.milaqa), intro(W.kura), intro(W.sayyara), intro(W.taira),
      match([W.milaqa, W.kura, W.sayyara, W.taira]),
      mcqWord(W.milaqa,  ['একটি গ্লাস', 'একটি তালা']),
      mcqWord(W.kura,    ['একটি বিমান', 'একটি গাড়ি']),
      mcqWord(W.sayyara, ['একটি বিমান', 'একটি বল']),
      arabicOf(W.taira,   ['سَيَّارَةٌ', 'كُرَةٌ']),
      pictureChoice([W.taira, W.sayyara, W.kura, W.milaqa]),
      arabicOf(W.sayyara, ['طَائِرَةٌ', 'كُرَةٌ']),
    ],
  },
  {
    id: 'l10-words-3', titleBn: 'শব্দার্থ (৩/৩): অস্ত্র ও যানবাহন', shortTitle: 'শব্দার্থ ৩',
    titleAr: 'الْمُفْرَدَاتُ (٣)', desc: 'ট্যাংক, বোমা, স্টীমার, কামান, দুর্গ',
    iconName: 'Star', color: 'teal', estMinutes: 3, bookPages: '৫১–৫৩',
    steps: [
      intro(W.dabbaba), intro(W.qunbula), intro(W.bakhira), intro(W.midfa), intro(W.hisn), intro(W.qalaa),
      match([W.dabbaba, W.qunbula, W.bakhira, W.midfa]),
      mcqWord(W.dabbaba, ['একটি বোমা', 'একটি স্টীমার']),
      mcqWord(W.midfa, ['একটি ট্যাংক', 'একটি তীর']),
      arabicOf(W.bakhira, ['دَبَّابَةٌ', 'قُنْبُلَةٌ']),
    ],
  },
  {
    id: 'l10-words-4', titleBn: 'শব্দার্থ (৪/৪): রান্নাঘরের শব্দ', shortTitle: 'শব্দার্থ ৪',
    titleAr: 'الْمُفْرَدَاتُ (٤)', desc: 'চুলা, চায়ের কাপ, থালা, রান্নাঘর',
    iconName: 'BookOpen', color: 'cyan', estMinutes: 3, bookPages: '৫৪',
    steps: [
      intro(W.mawqid), intro(W.finjan), intro(W.sahn), intro(W.matbakh),
      intro(W.milaqa), intro(W.milha),
      match([W.mawqid, W.finjan, W.sahn, W.matbakh]),
      mcqWord(W.sahn, ['একটি চুলা', 'একটি জগ']),
      mcqWord(W.matbakh, ['একটি থালা', 'একটি গ্লাস']),
      arabicOf(W.finjan, ['كُوبٌ', 'صَحْنٌ']),
    ],
  },
  {
    id: 'l10-hal-sadharan', titleBn: 'সাধারণ প্রশ্ন: هَلْ', shortTitle: 'هَلْ প্রশ্ন',
    titleAr: 'السُّؤَالُ الْعَامُّ: هَلْ', desc: 'هَلْ দিয়ে হ্যাঁ/না প্রশ্ন ও উত্তর',
    iconName: 'MessageCircle', color: 'violet', estMinutes: 4, bookPages: '৫৫–৫৬',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: সাধারণ প্রশ্ন',
        table: [
          { label: 'প্রশ্ন',      arabic: 'هَلْ هَذَا قَلَمٌ؟',    bangla: 'এটি কি একটি কলম?' },
          { label: 'হ্যাঁ-উত্তর', arabic: 'نَعَمْ، هَذَا قَلَمٌ.', bangla: 'হ্যাঁ, এটি একটি কলম।' },
          { label: 'না-উত্তর',    arabic: 'لَا، هَذَا قُفْلٌ.',    bangla: 'না, এটি একটি তালা।' },
        ],
      },
      introSentence(SENT.hal_qalam), introSentence(SENT.naam_qalam),
      introSentence(SENT.laa_qufl), introSentence(SENT.hal_nazara), introSentence(SENT.naam_nazara),
      mcqWord({ arabic: 'هَلْ هَذَا إِبْرِيقٌ؟', bangla: 'এটি কি একটি জগ?' },
              ['এটি কি একটি গ্লাস?', 'এটি কি একটি চাবি?'], 'বাক্যটির অর্থ কী?'),
      fillBlank('هَلْ هَذَا ___ ؟', 'مِفْتَاحٌ', ['قُفْلٌ', 'نَظَّارَةٌ'], 'ফাঁকে কোন শব্দ?'),
      fillBlank('___ ، هَذَا مِفْتَاحٌ.', 'نَعَمْ', ['لَا', 'هَلْ'], 'হ্যাঁ-উত্তর = ?'),
      sentenceBuilder(SENT.naam_qalam, ['تِلْكَ', 'أَ', 'قُفْلٌ']),
      sentenceBuilder(SENT.laa_qufl,   ['نَعَمْ', 'تِلْكَ', 'مِفْتَاحٌ']),
    ],
  },
  {
    id: 'l10-hal-bishesh', titleBn: 'বিশেষ প্রশ্ন: أَ ... أَمْ', shortTitle: 'أَ/أَمْ প্রশ্ন',
    titleAr: 'السُّؤَالُ الْخَاصُّ: أَ ... أَمْ', desc: 'দুটির মধ্যে কোনটি',
    iconName: 'Zap', color: 'orange', estMinutes: 4, bookPages: '৫৬',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: বিশেষ প্রশ্ন',
        table: [
          { label: 'প্রশ্ন', arabic: 'أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟', bangla: 'এটি কি কলম নাকি চাবি?' },
          { label: 'উত্তর', arabic: 'قَلَمٌ.',                            bangla: 'কলম।' },
        ],
      },
      introSentence(SENT.a_qalam_miftah), introSentence(SENT.qalam_only),
      introSentence(SENT.a_miftah_qufl), introSentence(SENT.miftah_only),
      mcqWord({ arabic: 'أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟', bangla: 'এটি কি কলম নাকি চাবি?' },
              ['এটি কি কলম নাকি চশমা?', 'এটি কি কলম?'], 'বাক্যটির অর্থ কী?'),
      fillBlank('أَ مِفْتَاحٌ هَذَا ___ قُفْلٌ؟', 'أَمْ', ['هَلْ', 'نَعَمْ'], 'ফাঁকে কোন শব্দ?'),
      {
        type: 'mcq',
        word: { arabic: 'أَ نَظَّارَةٌ تِلْكَ أَمْ كُرَةٌ؟', bangla: 'সেটি কি চশমা নাকি বল?' },
        question: 'সঠিক উত্তর কোনটি?',
        options: [
          { text: 'نَظَّارَةٌ.', isCorrect: true },
          { text: 'كُرَةٌ.', isCorrect: false },
          { text: 'نَعَمْ.', isCorrect: false },
        ],
      },
      sentenceBuilder(SENT.a_qalam_miftah, ['هَلْ', 'لَا', 'نَعَمْ']),
      sentenceBuilder(SENT.a_miftah_qufl,  ['هَلْ', 'لَا', 'مِلْعَقَةٌ']),
      match([
        { arabic: 'هَلْ هَذَا قَلَمٌ؟',         bangla: 'এটি কি একটি কলম?' },
        { arabic: 'نَعَمْ، هَذَا قَلَمٌ.',       bangla: 'হ্যাঁ, এটি একটি কলম।' },
        { arabic: 'أَ قَلَمٌ أَمْ مِفْتَاحٌ؟',  bangla: 'কলম নাকি চাবি?' },
      ], 'বাক্যের অর্থ মেলান'),
    ],
  },
  {
    id: 'l10-charcha', titleBn: 'মিশ্র চর্চা', shortTitle: 'চর্চা',
    titleAr: 'التَّدْرِيبُ الْمُخْتَلِطُ', desc: 'শব্দ ও প্রশ্নোত্তরের মিশ্র অনুশীলন',
    iconName: 'RefreshCw', color: 'teal', estMinutes: 4, bookPages: '৫৩–৫৬',
    steps: [
      arabicOf(W.miftah, ['قُفْلٌ', 'نَظَّارَةٌ']),
      arabicOf(W.nazara, ['كُرَةٌ', 'مِفْتَاحٌ']),
      pictureChoice([W.qufl, W.miftah, W.kura, W.taira]),
      mcqWord(W.kuwb,   ['একটি জগ', 'একটি চামচ']),
      mcqWord(W.milaqa, ['একটি কাপ', 'একটি তালা']),
      {
        type: 'mcq',
        word: { arabic: 'هَلْ هَذَا كُرَةٌ؟', bangla: 'এটি কি একটি বল?' },
        question: 'হ্যাঁ-উত্তর কোনটি?',
        options: [
          { text: 'نَعَمْ، هَذَا كُرَةٌ.', isCorrect: true },
          { text: 'لَا، تِلْكَ كُرَةٌ.', isCorrect: false },
          { text: 'نَعَمْ، هَذَا قُفْلٌ.', isCorrect: false },
        ],
      },
      fillBlank('___ تِلْكَ نَظَّارَةٌ؟', 'هَلْ', ['أَمْ', 'لَا'], 'প্রশ্নের শুরুতে কী?'),
      fillBlank('لَا، هَذَا ___.', 'قُفْلٌ', ['مِفْتَاحٌ', 'نَظَّارَةٌ'], 'না-উত্তর সম্পূর্ণ করো'),
      sentenceBuilder(SENT.hal_nazara, ['نَعَمْ', 'هَذِهِ', 'أَمْ']),
      {
        type: 'dialogue_listen', title: 'কথোপকথন শোনো ও বোঝো',
        lines: [
          { speaker: 'রাশিদ', arabic: 'هَلْ هَذَا مِفْتَاحٌ؟',                                         bangla: 'এটি কি একটি চাবি?' },
          { speaker: 'খালিদ', arabic: 'نَعَمْ، هَذَا مِفْتَاحٌ كَبِيرٌ.',                             bangla: 'হ্যাঁ, এটি একটি বড় চাবি।' },
          { speaker: 'রাশিদ', arabic: 'أَ مِفْتَاحُ الْبَيْتِ هَذَا أَمْ مِفْتَاحُ السَّيَّارَةِ؟', bangla: 'এটি কি ঘরের চাবি নাকি গাড়ির চাবি?' },
          { speaker: 'খালিদ', arabic: 'مِفْتَاحُ الْبَيْتِ.',                                         bangla: 'ঘরের চাবি।' },
        ],
      },
      match([W.miftah, W.qufl, W.kura, W.sayyara], 'শেষ পর্যালোচনা: শব্দ মেলান'),
    ],
  },
  {
    id: 'l10-tamrin', titleBn: 'তামরীন: কিতাবের অনুশীলন', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينَاتُ', desc: 'কিতাবের তামরীন ১–৩ অবলম্বনে',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৫৩–৫৫',
    steps: [
      intro({ arabic: 'التَّمْرِينُ الأَوَّلُ', bangla: 'ছবি দেখে আরবী বলো (তামরীন ১–২), ছবি দেখে প্রশ্ন করো ও উত্তর দাও (তামরীন ৩)', picture: 'book' }, 'তামরীনুল আউয়াল'),
      pictureChoice([W.miftah, W.qufl, W.nazara, W.kura]),
      pictureChoice([W.sayyara, W.taira, W.milaqa, W.kuwb]),
      mcqWord(
        { arabic: 'هَلْ تِلْكَ نَظَّارَةٌ مَشْهُورَةٌ؟', bangla: 'সেটি কি একটি বিখ্যাত চশমা?' },
        ['সেটি কি একটি ছোট চশমা?', 'সেটি কি একটি সুন্দর চশমা?'], 'বাক্যটির অর্থ কী?'
      ),
      fillBlank('هَلْ هَذَا ___ كَبِيرٌ؟', 'قُفْلٌ', ['مِفْتَاحٌ', 'كُرَةٌ'], 'সঠিক শব্দ বসাও'),
      sentenceBuilder({ arabic: 'هَلْ تِلْكَ نَظَّارَةٌ؟', bangla: 'সেটি কি একটি চশমা?' }, ['هَذَا', 'أَمْ', 'نَعَمْ']),
      {
        type: 'mcq',
        word: { arabic: 'أَ مِفْتَاحٌ هَذَا أَمْ قُفْلٌ؟', bangla: 'এটি কি চাবি নাকি তালা?' },
        question: 'সঠিক উত্তর?',
        options: [{ text: 'مِفْتَاحٌ.', isCorrect: true }, { text: 'قُفْلٌ.', isCorrect: false }, { text: 'نَعَمْ.', isCorrect: false }],
      },
      {
        type: 'mcq',
        word: { arabic: 'أَ طَائِرَةٌ هَذِهِ أَمْ سَيَّارَةٌ؟', bangla: 'এটি কি বিমান নাকি গাড়ি?' },
        question: 'সঠিক উত্তর?',
        options: [{ text: 'طَائِرَةٌ.', isCorrect: true }, { text: 'سَيَّارَةٌ.', isCorrect: false }, { text: 'نَعَمْ.', isCorrect: false }],
      },
      sentenceBuilder(SENT.a_taira_sayyara, ['هَلْ', 'لَا', 'نَعَمْ']),
    ],
  },
];

// ---------- ৫. ক্বায়েদা ----------
const qaida = [
  {
    id: 'l10-q-hal', stageId: 'l10-hal-sadharan',
    title: 'সাধারণ প্রশ্ন ও উত্তর',
    table: [
      { arabic: 'هَلْ',   bangla: 'কি? (সাধারণ প্রশ্নের শুরুতে)' },
      { arabic: 'نَعَمْ', bangla: 'হ্যাঁ' },
      { arabic: 'لَا',    bangla: 'না' },
    ],
    rule: 'هَلْ দিয়ে প্রশ্ন করলে উত্তরে نَعَمْ (হ্যাঁ) অথবা لَا (না) বলা হয়।',
    examples: [
      { arabic: 'هَلْ هَذَا كِتَابٌ؟',   bangla: 'এটি কি একটি বই?' },
      { arabic: 'نَعَمْ، هَذَا كِتَابٌ.', bangla: 'হ্যাঁ, এটি একটি বই।' },
      { arabic: 'لَا، هَذَا قَلَمٌ.',     bangla: 'না, এটি একটি কলম।' },
    ],
  },
  {
    id: 'l10-q-a-am', stageId: 'l10-hal-bishesh',
    title: 'বিশেষ প্রশ্ন: أَ ... أَمْ',
    table: [{ arabic: 'أَ ... أَمْ ...؟', bangla: 'এটি কি ... নাকি ...?' }],
    rule: 'দুটির মধ্যে কোনটি — এই প্রশ্নে أَ শুরুতে ও أَمْ মাঝে আসে। উত্তরে শুধু একটি শব্দ — নেই نَعَمْ/لَا।',
    examples: [
      { arabic: 'أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟', bangla: 'এটি কি কলম নাকি চাবি?' },
      { arabic: 'قَلَمٌ.',                            bangla: 'কলম।' },
    ],
  },
];

// ---------- ৬. লেগেসি ডেটা ----------
const vocabulary = [
  { arabic: 'مِفْتَاحٌ',     bangla: 'একটি চাবি',      picture: 'key' },
  { arabic: 'قُفْلٌ',        bangla: 'একটি তালা',      picture: 'lock' },
  { arabic: 'نَظَّارَةٌ',   bangla: 'একটি চশমা',      picture: 'glasses' },
  { arabic: 'إِبْرِيقٌ',    bangla: 'একটি জগ',        picture: 'box' },
  { arabic: 'كُوبٌ',         bangla: 'একটি গ্লাস',     picture: 'box' },
  { arabic: 'مِلْعَقَةٌ',   bangla: 'একটি চামচ',      picture: 'clock' },
  { arabic: 'كُرَةٌ',        bangla: 'একটি বল',        picture: 'ball' },
  { arabic: 'سَيَّارَةٌ',   bangla: 'একটি গাড়ি',     picture: 'car' },
  { arabic: 'طَائِرَةٌ',    bangla: 'একটি বিমান',     picture: 'airplane' },
  { arabic: 'بُنْدُقِيَّةٌ', bangla: 'একটি বন্দুক',   picture: 'key' },
  { arabic: 'سَيْفٌ',        bangla: 'একটি তলোয়ার',   picture: 'key' },
  { arabic: 'قَوْسٌ',        bangla: 'একটি ধনুক',      picture: 'ruler' },
  { arabic: 'سَهْمٌ',        bangla: 'একটি তীর',       picture: 'pen' },
  { arabic: 'مِلْحَةٌ',     bangla: 'একটি নিমকদানি',  picture: 'box' },
];
const sentences = Object.values(SENT);
const dialogues = [
  { arabic: 'هَلْ هَذَا مِفْتَاحٌ؟ — نَعَمْ، هَذَا مِفْتَاحٌ كَبِيرٌ.', bangla: 'এটি কি চাবি? — হ্যাঁ, বড় চাবি।', page: '৫৬' },
  { arabic: 'أَ مِفْتَاحٌ هَذَا أَمْ قُفْلٌ؟ — مِفْتَاحٌ.', bangla: 'চাবি নাকি তালা? — চাবি।', page: '৫৬' },
];
const tamrinKitabi = [
  { task: 'ছবি দেখে আরবিতে বলো', text: 'প্রতিটি ছবির নাম বলো।', prompt: 'মিফতাহ, কুফল, নাজারা', hint: 'مِفْتَاحٌ، قُفْلٌ، نَظَّارَةٌ' },
  { task: 'সাধারণ প্রশ্ন করো', text: 'هَلْ দিয়ে ৫টি প্রশ্ন করো।', hint: 'هَلْ هَذَا ...؟' },
  { task: 'বিশেষ প্রশ্ন করো', text: 'أَ...أَمْ দিয়ে ৩টি প্রশ্ন।', hint: 'أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟' },
];
const quizLegacy = [
  { question: "'مِفْتَاحٌ' শব্দের অর্থ কী?", options: ['একটি চাবি', 'একটি তালা', 'একটি চশমা'], correctIndex: 0, correctAnswer: 0, explanation: 'مِفْتَاحٌ = একটি চাবি।', type: 'mcq' },
  { question: "'هَلْ' দিয়ে কোন ধরনের প্রশ্ন?", options: ['সাধারণ প্রশ্ন (হ্যাঁ/না)', 'বিশেষ প্রশ্ন (কোনটি)', 'স্থান প্রশ্ন'], correctIndex: 0, correctAnswer: 0, explanation: 'هَلْ দিয়ে সাধারণ প্রশ্ন।', type: 'mcq' },
  { question: "'أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟' — সঠিক উত্তর?", options: ['قَلَمٌ.', 'نَعَمْ.', 'لَا.'], correctIndex: 0, correctAnswer: 0, explanation: 'বিশেষ প্রশ্নের উত্তরে সরাসরি নাম।', type: 'mcq' },
  { question: "'نَظَّارَةٌ' অর্থ?", options: ['একটি চশমা', 'একটি জগ', 'একটি বল'], correctIndex: 0, correctAnswer: 0, explanation: 'نَظَّارَةٌ = চশমা।', type: 'mcq' },
  { question: "'هَلْ تِلْكَ سَيَّارَةٌ؟' — হ্যাঁ-উত্তর?", options: ['نَعَمْ، تِلْكَ سَيَّارَةٌ.', 'نَعَمْ، هَذِهِ سَيَّارَةٌ.', 'هَلْ تِلْكَ سَيَّارَةٌ؟'], correctIndex: 0, correctAnswer: 0, explanation: 'দূরের জন্য تِلْكَ।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l1',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৫১-৫৬',
    qaida,
    grammarRule: {
      title: 'সাধারণ ও বিশেষ প্রশ্ন',
      summary: 'هَلْ = সাধারণ প্রশ্ন (হ্যাঁ/না)। أَ...أَمْ = বিশেষ প্রশ্ন (কোনটি)।',
      points: [
        'هَلْ هَذَا كِتَابٌ؟ — نَعَمْ / لَا',
        'أَ قَلَمٌ هَذَا أَمْ مِفْتَاحٌ؟ — قَلَمٌ (সরাসরি নাম)',
        'বিশেষ প্রশ্নে نَعَمْ/لَا বলা হয় না।',
      ],
    },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};