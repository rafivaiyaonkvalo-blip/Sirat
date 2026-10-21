// vol1-ch2-l2.cjs  |  দারস ২ — ২য় অধ্যায়  |  পৃষ্ঠা ৫৭–৬১
// বিষয়: খাবার ও গাছপালার শব্দ, বিশেষণ (طَازَجٌ/فَاسِدٌ, كَبِيرٌ/صَغِيرٌ)

const W = {
  taazaj:  { arabic: 'طَازَجٌ',    bangla: 'তাজা',       picture: 'flower' },
  baait:   { arabic: 'بَائِتٌ',    bangla: 'বাসি',       picture: 'clock' },
  fasid:   { arabic: 'فَاسِدٌ',    bangla: 'নষ্ট',       picture: 'clock' },
  samaka:  { arabic: 'سَمَكَةٌ',   bangla: 'একটি মাছ',   picture: 'clock' },
  laban:   { arabic: 'لَبَنٌ',     bangla: 'দুধ',         picture: 'box' },
  asal:    { arabic: 'عَسَلٌ',     bangla: 'মধু',         picture: 'box' },
  shajara: { arabic: 'شَجَرَةٌ',  bangla: 'একটি গাছ',   picture: 'tree' },
  wariqa:  { arabic: 'وَرَقَةٌ',  bangla: 'একটি পাতা',  picture: 'tree' },
  zahra:   { arabic: 'زَهْرَةٌ',  bangla: 'একটি ফুল',   picture: 'flower' },
  ghaba:   { arabic: 'غَابَةٌ',   bangla: 'একটি বন',    picture: 'tree' },
  kabir:   { arabic: 'كَبِيرٌ',   bangla: 'বড়',         picture: 'box' },
  saghir:  { arabic: 'صَغِيرٌ',   bangla: 'ছোট',         picture: 'box' },
  khalidw: { arabic: 'خَالِصٌ',   bangla: 'খাঁটি',      picture: 'box' },
  bayda:   { arabic: 'بَيْضَةٌ',    bangla: 'একটি ডিম' },
  khubz:   { arabic: 'خُبْزٌ',      bangla: 'রুটি' },
  taam:    { arabic: 'طَعَامٌ',     bangla: 'খাবার' },
  lahm:    { arabic: 'لَحْمٌ',      bangla: 'গোশত' },
  qitar:   { arabic: 'قِطَارٌ',     bangla: 'রেলগাড়ি' },
  tawil:   { arabic: 'طَوِيلٌ',     bangla: 'লম্বা' },
  qasir:   { arabic: 'قَصِيرٌ',     bangla: 'খাটো' },
  barid:   { arabic: 'بَارِدٌ',     bangla: 'ঠাণ্ডা' },
  harr:    { arabic: 'حَارٌّ',      bangla: 'গরম' },
  qalil:   { arabic: 'قَلِيلٌ',     bangla: 'কম' },
  kathir:  { arabic: 'كَثِيرٌ',     bangla: 'বেশি' },
  ghali:   { arabic: 'غَالٍ',       bangla: 'দামী, মূল্যবান' },
  aali:    { arabic: 'عَالٍ',       bangla: 'উঁচু' },
  ghusn:   { arabic: 'غُصْنٌ',      bangla: 'একটি ডাল' },
  jabal:   { arabic: 'جَبَلٌ',      bangla: 'একটি পাহাড়' },
  manara:  { arabic: 'مَنَارَةٌ',   bangla: 'একটি মিনার' },
  mamsaha: { arabic: 'مِمْسَحَةٌ', bangla: 'একটি পাপোশ' },
  maa:     { arabic: 'مَاءٌ',       bangla: 'পানি' },
  ulba:    { arabic: 'عُلْبَةٌ',   bangla: 'কৌটা' },
  iqd:     { arabic: 'عِقْدٌ',      bangla: 'একটি হার', picture: 'necklace' },
  ladhidh: { arabic: 'لَذِيذٌ',   bangla: 'সুস্বাদু',   picture: 'box' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  laban_khalid:   T('هَذَا لَبَنٌ خَالِصٌ.',                      'এটি খাঁটি দুধ।',           '৫৯'),
  samak_taaza:    T('هَذِهِ سَمَكَةٌ طَازَجَةٌ.',                 'এটি তাজা মাছ।',            '৫৯'),
  zahra_jamila:   T('تِلْكَ زَهْرَةٌ جَمِيلَةٌ.',                'সেটি সুন্দর ফুল।',         '৫৮'),
  shaj_small:     T('هَذِهِ شَجَرَةٌ صَغِيرَةٌ.',                'এটি একটি ছোট গাছ।',        '৫৮'),
  asal_ladhidh:   T('هَذَا عَسَلٌ لَذِيذٌ.',                      'এটি সুস্বাদু মধু।',         '৫৯'),
  taaam_haarr:    T('ذَلِكَ طَعَامٌ حَارٌّ.',                     'সেটি গরম খাবার।',          '৫৯'),
  khubz_baait:    T('هَذَا خُبْزٌ بَائِتٌ.',                      'এটি বাসি রুটি।',            '৫৯'),
  bayda_fasida:   T('هَذِهِ الْبَيْضَةُ فَاسِدَةٌ.',              'এই ডিমটি নষ্ট।',            '৫৯'),
  hujra_wasia:    T('تِلْكَ حُجْرَةٌ وَاسِعَةٌ.',                 'সেটি প্রশস্ত কামরা।',       '৫৯'),
  taira_saria:    T('هَذِهِ طَائِرَةٌ سَرِيعَةٌ.',                'এটি দ্রুতগামী বিমান।',      '৫৯'),
  qamis_tawil:    T('ذَلِكَ قَمِيصٌ طَوِيلٌ.',                    'সেটি লম্বা জামা।',          '৫৯'),
  tariq_wasi:     T('ذَلِكَ طَرِيقٌ وَاسِعٌ.',                    'সেটি প্রশস্ত পথ।',          '৫৯'),
  iqd_ghali:      T('هَذَا عِقْدٌ غَالٍ.',                        'এটি দামী হার।',             '৫৯'),
  iqd_zaynab:     T('هَذَا عِقْدُ زَيْنَبَ.',                     'এটি যায়নাবের হার।',        '৫৯'),
  samaka_kabira:  T('هَذِهِ سَمَكَةٌ كَبِيرَةٌ.',                 'এটি বড় মাছ।',              '৫৯'),
  manara_aaliya:  T('تِلْكَ مَنَارَةٌ عَالِيَةٌ.',               'সেটি উঁচু মিনার।',         '৫৯'),
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

const bookStages = [
  {
    id: 'l11-words-1', titleBn: 'শব্দার্থ: খাবার ও বিশেষণ', shortTitle: 'শব্দার্থ ১',
    titleAr: 'الْمُفْرَدَاتُ: الطَّعَامُ وَالنُّعُوتُ', desc: 'তাজা, বাসি, মধু, দুধ, মাছ',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৫৭–৫৯',
    steps: [
      intro(W.taazaj), intro(W.baait), intro(W.laban), intro(W.asal), intro(W.samaka),
      match([W.taazaj, W.baait, W.laban, W.asal]),
      mcqWord(W.taazaj, ['বাসি', 'নষ্ট']),
      mcqWord(W.baait,  ['তাজা', 'সুস্বাদু']),
      mcqWord(W.laban,  ['মধু', 'পানি']),
      arabicOf(W.asal,  ['لَبَنٌ', 'سَمَكَةٌ']),
      mcqWord(W.samaka, ['একটি ফুল', 'একটি গাছ']),
    ],
  },
  {
    id: 'l11-words-2', titleBn: 'শব্দার্থ: গাছপালা ও আকার', shortTitle: 'শব্দার্থ ২',
    titleAr: 'الْمُفْرَدَاتُ: النَّبَاتُ وَالْحَجْمُ', desc: 'গাছ, পাতা, ফুল, বন, ছোট-বড়',
    iconName: 'Star', color: 'green', estMinutes: 3, bookPages: '৫৮–৫৯',
    steps: [
      intro(W.shajara), intro(W.wariqa), intro(W.zahra), intro(W.ghaba),
      intro(W.kabir), intro(W.saghir),
      match([W.shajara, W.wariqa, W.zahra, W.ghaba]),
      mcqWord(W.shajara, ['একটি পাতা', 'একটি বন']),
      mcqWord(W.zahra,   ['একটি গাছ', 'একটি পাতা']),
      arabicOf(W.kabir,  ['صَغِيرٌ', 'لَذِيذٌ']),
      arabicOf(W.saghir, ['كَبِيرٌ', 'خَالِصٌ']),
    ],
  },
  {
    id: 'l11-words-3', titleBn: 'শব্দার্থ: খাবার ও অবস্থা', shortTitle: 'শব্দার্থ ৩',
    titleAr: 'الْمُفْرَدَاتُ: الْأَطْعِمَةُ وَالْأَحْوَالُ', desc: 'রুটি, খাবার, গোশত, ডিম, ঠাণ্ডা-গরম, কম-বেশি',
    iconName: 'Star', color: 'teal', estMinutes: 4, bookPages: '৫৭–৫৯',
    steps: [
      intro(W.khubz), intro(W.taam), intro(W.lahm), intro(W.bayda), intro(W.fasid),
      match([W.khubz, W.taam, W.lahm, W.bayda]),
      intro(W.barid), intro(W.harr), intro(W.qalil), intro(W.kathir), intro(W.ghali), intro(W.aali),
      match([W.barid, W.harr, W.qalil, W.kathir]),
      mcqWord(W.ghali, ['উঁচু', 'কম']),
      mcqWord(W.aali, ['দামী', 'বেশি']),
    ],
  },
  {
    id: 'l11-words-4', titleBn: 'শব্দার্থ: আরও শব্দ', shortTitle: 'শব্দার্থ ৪',
    titleAr: 'الْمُفْرَدَاتُ (٤)', desc: 'রেলগাড়ি, মিনার, পাহাড়, ডাল, পাপোশ, পানি, কৌটা, হার',
    iconName: 'BookOpen', color: 'cyan', estMinutes: 4, bookPages: '৫৮–৫৯',
    steps: [
      intro(W.qitar), intro(W.manara), intro(W.jabal), intro(W.ghusn),
      intro(W.mamsaha), intro(W.maa), intro(W.ulba), intro(W.iqd),
      intro(W.tawil), intro(W.qasir),
      match([W.qitar, W.manara, W.jabal, W.ghusn]),
      match([W.mamsaha, W.maa, W.ulba, W.iqd]),
      arabicOf(W.tawil, ['قَصِيرٌ', 'كَبِيرٌ']),
    ],
  },
  {
    id: 'l11-sentences-2', titleBn: 'কিতাবের বাক্য (তামরীন ১)', shortTitle: 'কিতাবের বাক্য',
    titleAr: 'جُمَلُ الْكِتَابِ', desc: 'তামরীনুল আউয়ালের বাক্য পড়ো ও অর্থ বলো',
    iconName: 'MessageCircle', color: 'violet', estMinutes: 4, bookPages: '৫৯',
    steps: [
      introSentence(SENT.khubz_baait), introSentence(SENT.bayda_fasida), introSentence(SENT.hujra_wasia),
      introSentence(SENT.taira_saria), introSentence(SENT.qamis_tawil), introSentence(SENT.tariq_wasi),
      introSentence(SENT.iqd_ghali), introSentence(SENT.iqd_zaynab), introSentence(SENT.samaka_kabira),
      sentenceBuilder(SENT.khubz_baait, ['خَالِصٌ', 'لَبَنٌ', 'هَذِهِ']),
      sentenceBuilder(SENT.iqd_ghali, ['كَبِيرٌ', 'هَذِهِ', 'بَائِتٌ']),
      fillBlank('هَذَا عِقْدٌ ___.', 'غَالٍ', ['فَاسِدٌ', 'طَازَجٌ'], 'দামী = ?'),
    ],
  },
  {
    id: 'l11-sifat', titleBn: 'বিশেষণ দিয়ে বাক্য', shortTitle: 'বিশেষণ বাক্য',
    titleAr: 'الْجُمَلُ بِالنُّعُوتِ', desc: 'বিশেষণের লিঙ্গ মেনে বাক্য গঠন',
    iconName: 'Zap', color: 'blue', estMinutes: 4, bookPages: '৫৮–৫৯',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: বিশেষণের লিঙ্গ',
        table: [
          { label: 'পুরুষবাচক', arabic: 'كِتَابٌ كَبِيرٌ',     bangla: 'বড় বই' },
          { label: 'স্ত্রীবাচক', arabic: 'سَمَكَةٌ كَبِيرَةٌ', bangla: 'বড় মাছ' },
          { label: 'পুরুষবাচক', arabic: 'لَبَنٌ خَالِصٌ',      bangla: 'খাঁটি দুধ' },
          { label: 'স্ত্রীবাচক', arabic: 'شَجَرَةٌ صَغِيرَةٌ', bangla: 'ছোট গাছ' },
        ],
      },
      introSentence(SENT.laban_khalid),
      introSentence(SENT.samak_taaza),
      introSentence(SENT.zahra_jamila),
      introSentence(SENT.shaj_small),
      introSentence(SENT.asal_ladhidh),
      introSentence(SENT.taaam_haarr),
      mcqWord({ arabic: 'هَذَا لَبَنٌ خَالِصٌ.', bangla: 'এটি খাঁটি দুধ।' },
              ['এটি তাজা মাছ।', 'এটি সুস্বাদু মধু।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('هَذِهِ سَمَكَةٌ ___.', 'طَازَجَةٌ', ['فَاسِدَةٌ', 'خَالِصَةٌ'], 'তাজা (স্ত্রী.) = ?'),
      fillBlank('هَذِهِ شَجَرَةٌ ___.', 'صَغِيرَةٌ', ['كَبِيرَةٌ', 'جَمِيلَةٌ'], 'ছোট (স্ত্রী.) = ?'),
      sentenceBuilder(SENT.laban_khalid,  ['سَمَكَةٌ', 'صَغِيرٌ', 'تِلْكَ']),
      sentenceBuilder(SENT.zahra_jamila, ['هَذَا', 'خَالِصَةٌ', 'كَبِيرَةٌ']),
    ],
  },
  {
    id: 'l11-tamrin', titleBn: 'তামরীন ও মিশ্র চর্চা', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينَاتُ', desc: 'কিতাবের তামরীন অনুশীলন',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৫৮–৬১',
    steps: [
      mcqWord({ arabic: 'هَذَا عَسَلٌ لَذِيذٌ.', bangla: 'এটি সুস্বাদু মধু।' },
              ['এটি খাঁটি মধু।', 'এটি তাজা দুধ।'], 'বাক্যটির অর্থ কী?'),
      arabicOf(W.zahra,   ['شَجَرَةٌ', 'غَابَةٌ']),
      arabicOf(W.shajara, ['وَرَقَةٌ', 'زَهْرَةٌ']),
      fillBlank('تِلْكَ زَهْرَةٌ ___.', 'جَمِيلَةٌ', ['كَبِيرَةٌ', 'طَازَجَةٌ'], 'সুন্দর (স্ত্রী.) = ?'),
      mcqWord({ arabic: 'هَذَا طَعَامٌ حَارٌّ.'.replace('هَذَا','ذَلِكَ'), bangla: 'সেটি গরম খাবার।' },
              ['সেটি ঠাণ্ডা খাবার।', 'সেটি নষ্ট খাবার।'], 'বাক্যটির অর্থ কী?'),
      match([W.taazaj, W.baait, W.shajara, W.zahra]),
      sentenceBuilder(SENT.manara_aaliya, ['هَذِهِ', 'صَغِيرَةٌ', 'خَالِصَةٌ']),
      sentenceBuilder(SENT.samak_taaza,  ['تِلْكَ', 'طَازَجٌ', 'لَبَنٌ']),
      introSentence(T('عَسَلٌ خَالِصٌ', 'খাঁটি মধু', '৫৭')),
      introSentence(T('طَعَامٌ فَاسِدٌ', 'নষ্ট খাবার', '৫৭')),
      introSentence(T('لَحْمٌ طَازَجٌ', 'তাজা গোশত', '৫৭')),
      introSentence(T('سَمَكَةٌ طَازَجَةٌ', 'তাজা মাছ', '৫৭')),
      introSentence(T('كُوبٌ جَدِيدٌ', 'একটি নতুন গ্লাস', '৫৭')),
      introSentence(T('قَرْيَةٌ صَغِيرَةٌ', 'একটি ছোট গ্রাম', '৫৭')),
      match([W.laban, W.asal, W.kabir, W.saghir], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l11-q-sifat', stageId: 'l11-sifat',
  title: 'বিশেষণের লিঙ্গ পরিবর্তন',
  table: [
    { arabic: 'كَبِيرٌ / كَبِيرَةٌ',     bangla: 'বড় (পুরু./স্ত্রী.)' },
    { arabic: 'صَغِيرٌ / صَغِيرَةٌ',     bangla: 'ছোট' },
    { arabic: 'طَازَجٌ / طَازَجَةٌ',     bangla: 'তাজা' },
    { arabic: 'خَالِصٌ / خَالِصَةٌ',     bangla: 'খাঁটি' },
  ],
  rule: 'বিশেষণ বিশেষ্যের লিঙ্গ মেনে পরিবর্তিত হয়। স্ত্রীবাচকে শেষে ة যোগ হয়।',
  examples: [
    { arabic: 'كِتَابٌ كَبِيرٌ',     bangla: 'বড় বই (পুরু.)' },
    { arabic: 'سَمَكَةٌ كَبِيرَةٌ', bangla: 'বড় মাছ (স্ত্রী.)' },
  ],
}];

const vocabulary = [
  { arabic: 'طَازَجٌ',  bangla: 'তাজা',       picture: 'flower' },
  { arabic: 'بَائِتٌ',  bangla: 'বাসি',       picture: 'clock' },
  { arabic: 'فَاسِدٌ',  bangla: 'নষ্ট',       picture: 'clock' },
  { arabic: 'لَبَنٌ',   bangla: 'দুধ',         picture: 'box' },
  { arabic: 'عَسَلٌ',   bangla: 'মধু',         picture: 'box' },
  { arabic: 'سَمَكَةٌ', bangla: 'একটি মাছ',   picture: 'clock' },
  { arabic: 'شَجَرَةٌ',bangla: 'একটি গাছ',   picture: 'tree' },
  { arabic: 'وَرَقَةٌ',bangla: 'একটি পাতা',  picture: 'tree' },
  { arabic: 'زَهْرَةٌ',bangla: 'একটি ফুল',   picture: 'flower' },
  { arabic: 'غَابَةٌ', bangla: 'একটি বন',    picture: 'tree' },
  { arabic: 'لَذِيذٌ', bangla: 'সুস্বাদু',   picture: 'box' },
  { arabic: 'خَالِصٌ', bangla: 'খাঁটি',      picture: 'box' },
];
const sentences = Object.values(SENT);
const dialogues = [
];
const tamrinKitabi = [
  { task: 'বিশেষণ যুক্ত করো', text: 'عَسَلٌ + خَالِصٌ — لিঙ্গ মেলাও', hint: 'عَسَلٌ خَالِصٌ' },
  { task: 'বাক্য বলো', text: 'এটি তাজা মাছ।', hint: 'هَذِهِ سَمَكَةٌ طَازَجَةٌ.' },
];
const quizLegacy = [
  { question: "'طَازَجٌ' অর্থ কী?", options: ['তাজা', 'বাসি', 'নষ্ট'], correctIndex: 0, correctAnswer: 0, explanation: 'তাজা।', type: 'mcq' },
  { question: "'شَجَرَةٌ' অর্থ কী?", options: ['একটি গাছ', 'একটি ফুল', 'একটি পাতা'], correctIndex: 0, correctAnswer: 0, explanation: 'গাছ।', type: 'mcq' },
  { question: "স্ত্রীবাচকে 'كَبِيرٌ' হয়?", options: ['كَبِيرَةٌ', 'كَبِيرٌ', 'كَبِيرِينَ'], correctIndex: 0, correctAnswer: 0, explanation: 'ة যোগ হয়।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l2',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৫৭-৬১', qaida,
    grammarRule: { title: 'বিশেষণের লিঙ্গ', summary: 'বিশেষণ বিশেষ্যের লিঙ্গ মেনে পরিবর্তিত হয়।', points: ['كِتَابٌ كَبِيرٌ', 'سَمَكَةٌ كَبِيرَةٌ'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};