// vol1-ch2-l3.cjs  |  দারস ৩ — ২য় অধ্যায়  |  পৃষ্ঠা ৬২–৬৬
// বিষয়: পেশাবাচক ও গুণবাচক শব্দ, مَنْ هُوَ؟/مَنْ هِيَ؟ দিয়ে পরিচয়

const W = {
  tabib:    { arabic: 'طَبِيبٌ',    bangla: 'চিকিৎসক',     picture: 'bag' },
  amin:     { arabic: 'أَمِينٌ',    bangla: 'বিশ্বস্ত',    picture: 'key' },
  bakhil:   { arabic: 'بَخِيلٌ',   bangla: 'কৃপণ',        picture: 'lock' },
  sakhi:    { arabic: 'سَخِيٌّ',   bangla: 'দানশীল',      picture: 'key' },
  katib:    { arabic: 'كَاتِبٌ',   bangla: 'লেখক',        picture: 'pen' },
  kaslan:   { arabic: 'كَسْلَانٌ', bangla: 'অলস',         picture: 'bed' },
  nashit:   { arabic: 'نَشِيطٌ',   bangla: 'উদ্যমী/পরিশ্রমী', picture: 'bag' },
  muallim:  { arabic: 'مُعَلِّمٌ', bangla: 'শিক্ষক',      picture: 'blackboard' },
  tilmidh:  { arabic: 'تِلْمِيذٌ', bangla: 'ছাত্র',       picture: 'bag' },
  tajir:    { arabic: 'تَاجِرٌ',   bangla: 'ব্যবসায়ী',   picture: 'box' },
  fallaH:   { arabic: 'فَلَّاحٌ',  bangla: 'কৃষক',        picture: 'tree' },
  marid:    { arabic: 'مَرِيضٌ',     bangla: 'রুগী' },
  khayyat:  { arabic: 'خَيَّاطٌ',    bangla: 'দরজী' },
  labban:   { arabic: 'لَبَّانٌ',    bangla: 'গোয়াল' },
  sayyad:   { arabic: 'صَيَّادٌ',    bangla: 'শিকারী' },
  saiq:     { arabic: 'سَائِقٌ',     bangla: 'চালক' },
  tabbakh:  { arabic: 'طَبَّاخٌ',    bangla: 'পাচক' },
  laib:     { arabic: 'لَاعِبٌ',     bangla: 'খেলোয়াড়' },
  mutawadi: { arabic: 'مُتَوَاضِعٌ', bangla: 'বিনয়ী' },
  mutakabbir:{ arabic: 'مُتَكَبِّرٌ', bangla: 'অহংকারী' },
  mahir:    { arabic: 'مَاهِرٌ',     bangla: 'দক্ষ' },
  ghayr_mahir:{ arabic: 'غَيْرُ مَاهِرٍ', bangla: 'অদক্ষ' },
  mashhur:  { arabic: 'مَشْهُورٌ',   bangla: 'প্রসিদ্ধ' },
  ghayr_mashhur:{ arabic: 'غَيْرُ مَشْهُورٍ', bangla: 'অপ্রসিদ্ধ' },
  muslim:   { arabic: 'مُسْلِمٌ',    bangla: 'মুসলিম' },
  mushrik:  { arabic: 'مُشْرِكٌ',    bangla: 'মুশরিক' },
  sadiq:    { arabic: 'صَادِقٌ',   bangla: 'সত্যবাদী',    picture: 'book' },
  kadhib:   { arabic: 'كَاذِبٌ',   bangla: 'মিথ্যাবাদী', picture: 'lock' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  majid_tajir:   T('مَاجِدٌ تَاجِرٌ كَبِيرٌ.',               'মাজিদ একজন বড় ব্যবসায়ী।',       '৬৩'),
  hu_tajir_amin: T('هُوَ تَاجِرٌ أَمِينٌ.',                  'সে একজন বিশ্বস্ত ব্যবসায়ী।',      '৬৩'),
  khalid_muallim:T('أَنَا فَلَّاحٌ نَشِيطٌ.',               'আমি একজন উদ্যমী কৃষক।',          '৬২'),
  man_huwa:      T('مَنْ هُوَ مَاجِدٌ؟',                     'মাজিদ কে?',                          '৬৪'),
  huwa_tajir:    T('هُوَ تَاجِرٌ.',                           'সে ব্যবসায়ী।',                      '৬৪'),
  man_hiya:      T('مَنْ هِيَ فَاطِمَةُ؟',                   'ফাতিমা কে?',                         '৬৫'),
  hiya_tabiba:   T('هِيَ طَبِيبَةٌ.',                         'সে চিকিৎসক।',                        '৬৫'),
  rashid_fallaH: T('فَرْحَانَةُ فَلَّاحَةٌ كَسْلَانَةٌ.',  'ফারহানা একজন অলস কৃষক নারী।',    '৬২'),
  sent_ahmad:    T('أَ خَالِدٌ مُعَلِّمٌ أَمْ رَاشِدٌ؟',   'খালেদ কি শিক্ষক না রাশেদ?',        '৬৬'),
  sent_muslim:   T('هَلْ أَنْتَ مُسْلِمٌ؟',                'তুমি কি মুসলিম?',                    '৬৬'),
  sent_ana_aisha:T('نَعَمْ ، أَنَا عَائِشَةُ.',           'হাঁ, আমি আয়েশা।',                  '৬৬'),
  sent_hal_ana:  T('هَلْ أَنْتِ فَاطِمَةُ؟',               'তুমি কি ফাতেমা?',                    '৬৬'),
  sent_la_bal:   T('لَا ، بَلْ أَنَا عَائِشَةُ.',         'না, বরং আমি আয়েশা।',               '৬৬'),
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
    id: 'l12-words-1', titleBn: 'পেশা ও চরিত্রবাচক শব্দ (১/২)', shortTitle: 'শব্দার্থ ১',
    titleAr: 'الْمُفْرَدَاتُ: الْمِهَنُ وَالصِّفَاتُ (١)', desc: 'শিক্ষক, ব্যবসায়ী, চিকিৎসক, বিশ্বস্ত, কৃপণ',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৬২–৬৩',
    steps: [
      intro(W.muallim), intro(W.tajir), intro(W.tabib), intro(W.katib), intro(W.fallaH),
      match([W.muallim, W.tajir, W.tabib, W.katib]),
      mcqWord(W.muallim, ['ব্যবসায়ী', 'চিকিৎসক']),
      mcqWord(W.tabib,   ['শিক্ষক', 'লেখক']),
      mcqWord(W.tajir,   ['কৃষক', 'চিকিৎসক']),
      arabicOf(W.katib,  ['طَبِيبٌ', 'مُعَلِّمٌ']),
      arabicOf(W.fallaH, ['تَاجِرٌ', 'كَاتِبٌ']),
    ],
  },
  {
    id: 'l12-words-2', titleBn: 'গুণবাচক শব্দ (২/২)', shortTitle: 'শব্দার্থ ২',
    titleAr: 'الْمُفْرَدَاتُ: الصِّفَاتُ (٢)', desc: 'বিশ্বস্ত, অলস, উদ্যমী, সত্যবাদী',
    iconName: 'Star', color: 'blue', estMinutes: 3, bookPages: '৬৩–৬৪',
    steps: [
      intro(W.amin), intro(W.sakhi), intro(W.bakhil), intro(W.kaslan), intro(W.nashit),
      match([W.amin, W.sakhi, W.bakhil, W.kaslan]),
      mcqWord(W.amin,   ['কৃপণ', 'অলস']),
      mcqWord(W.bakhil, ['বিশ্বস্ত', 'দানশীল']),
      mcqWord(W.kaslan, ['উদ্যমী', 'বিশ্বস্ত']),
      arabicOf(W.nashit, ['كَسْلَانٌ', 'بَخِيلٌ']),
      arabicOf(W.sakhi,  ['أَمِينٌ', 'نَشِيطٌ']),
    ],
  },
  {
    id: 'l12-words-3', titleBn: 'পেশা ও স্বভাবের আরও শব্দ', shortTitle: 'শব্দার্থ ৩',
    titleAr: 'الْمُفْرَدَاتُ (٣)', desc: 'রুগী, দরজী, গোয়াল, শিকারী, চালক, পাচক, খেলোয়াড়',
    iconName: 'Star', color: 'teal', estMinutes: 4, bookPages: '৬০–৬৩',
    steps: [
      intro(W.marid), intro(W.khayyat), intro(W.labban), intro(W.sayyad), intro(W.saiq), intro(W.tabbakh), intro(W.laib),
      match([W.marid, W.khayyat, W.labban, W.sayyad]),
      match([W.saiq, W.tabbakh, W.laib, W.tabib]),
      mcqWord(W.sayyad, ['দরজী', 'চালক']),
      arabicOf(W.tabbakh, ['لَاعِبٌ', 'سَائِقٌ']),
    ],
  },
  {
    id: 'l12-words-4', titleBn: 'স্বভাব ও গুণের বিপরীত শব্দ', shortTitle: 'শব্দার্থ ৪',
    titleAr: 'الْمُفْرَدَاتُ (٤)', desc: 'সত্যবাদী-মিথ্যাবাদী, বিনয়ী-অহংকারী, দক্ষ-অদক্ষ',
    iconName: 'Zap', color: 'cyan', estMinutes: 4, bookPages: '৬৩–৬৪',
    steps: [
      intro(W.sadiq), intro(W.kadhib), intro(W.mutawadi), intro(W.mutakabbir),
      match([W.sadiq, W.kadhib, W.mutawadi, W.mutakabbir]),
      intro(W.mahir), intro(W.ghayr_mahir), intro(W.mashhur), intro(W.ghayr_mashhur),
      match([W.mahir, W.ghayr_mahir, W.mashhur, W.ghayr_mashhur]),
      intro(W.muslim), intro(W.mushrik),
      mcqWord(W.mutakabbir, ['বিনয়ী', 'অলস']),
      arabicOf(W.ghayr_mahir, ['مَاهِرٌ', 'غَيْرُ مَشْهُورٍ']),
    ],
  },
  {
    id: 'l12-questions', titleBn: 'হ্যাঁ/না ও বিকল্প প্রশ্ন (কিতাবের বাক্য)', shortTitle: 'প্রশ্নোত্তর',
    titleAr: 'الْأَسْئِلَةُ', desc: 'هَلْ ও أَ ... أَمْ দিয়ে প্রশ্ন',
    iconName: 'MessageCircle', color: 'violet', estMinutes: 4, bookPages: '৬৫–৬৬',
    steps: [
      introSentence(SENT.sent_muslim), introSentence(SENT.sent_hal_ana), introSentence(SENT.sent_ahmad),
      introSentence(SENT.sent_ana_aisha), introSentence(SENT.sent_la_bal),
      mcqWord({ arabic: 'هَلْ أَنْتَ مُسْلِمٌ؟', bangla: 'তুমি কি মুসলিম?' }, ['তুমি কি মুশরিক?', 'তুমি কি ছাত্র?'], 'বাক্যটির অর্থ কী?'),
      mcqWord({ arabic: 'أَ خَالِدٌ مُعَلِّمٌ أَمْ رَاشِدٌ؟', bangla: 'খালেদ কি শিক্ষক না রাশেদ?' }, ['খালেদ কি ছাত্র?', 'রাশেদ কি শিক্ষক?'], 'বাক্যটির অর্থ কী?'),
      fillBlank('أَ مُسْلِمٌ أَنْتَ ___ مُشْرِكٌ؟', 'أَمْ', ['هَلْ', 'مَنْ'], 'নাকি = ?'),
      sentenceBuilder(SENT.sent_ahmad, ['هَلْ', 'مَنْ', 'تَاجِرٌ']),
      sentenceBuilder(SENT.sent_la_bal, ['نَعَمْ', 'هُوَ', 'فَاطِمَةُ']),
    ],
  },
  {
    id: 'l12-man-huwa', titleBn: 'مَنْ هُوَ؟ / مَنْ هِيَ؟ — পরিচয়', shortTitle: 'مَنْ প্রশ্ন',
    titleAr: 'مَنْ هُوَ؟ / مَنْ هِيَ؟', desc: 'কে? প্রশ্নের মাধ্যমে পরিচয়',
    iconName: 'MessageCircle', color: 'violet', estMinutes: 4, bookPages: '৬৪–৬৫',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: মান হুওয়া/হিয়া',
        table: [
          { label: 'পুরুষ সম্পর্কে', arabic: 'مَنْ هُوَ مَاجِدٌ؟',   bangla: 'মাজিদ কে?' },
          { label: 'উত্তর',           arabic: 'هُوَ تَاجِرٌ.',          bangla: 'সে ব্যবসায়ী।' },
          { label: 'নারী সম্পর্কে',  arabic: 'مَنْ هِيَ فَاطِمَةُ؟', bangla: 'ফাতিমা কে?' },
          { label: 'উত্তর',           arabic: 'هِيَ طَبِيبَةٌ.',        bangla: 'সে চিকিৎসক।' },
        ],
      },
      introSentence(SENT.man_huwa),
      introSentence(SENT.huwa_tajir),
      introSentence(SENT.man_hiya),
      introSentence(SENT.hiya_tabiba),
      introSentence(SENT.majid_tajir),
      introSentence(SENT.hu_tajir_amin),
      mcqWord({ arabic: 'مَنْ هُوَ مَاجِدٌ؟', bangla: 'মাজিদ কে?' },
              ['মাজিদ কোথায়?', 'মাজিদ কী করে?'], 'বাক্যটির অর্থ কী?'),
      fillBlank('___ هُوَ خَالِدٌ؟', 'مَنْ', ['مَا', 'هَلْ'], 'কে প্রশ্নের শুরুতে কী?'),
      fillBlank('هُوَ ___ أَمِينٌ.', 'تَاجِرٌ', ['مُعَلِّمٌ', 'فَلَّاحٌ'], 'সঠিক পেশা বসাও'),
      sentenceBuilder(SENT.majid_tajir,    ['فَلَّاحٌ', 'صَغِيرٌ', 'هُوَ']),
      sentenceBuilder(SENT.rashid_fallaH,  ['تَاجِرٌ', 'كَاذِبٌ', 'مُعَلِّمٌ']),
    ],
  },
  {
    id: 'l12-tamrin', titleBn: 'তামরীন ও মিশ্র চর্চা', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينَاتُ', desc: 'কিতাবের তামরীন ১–৩ অনুশীলন',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৬৩–৬৬',
    steps: [
      {
        type: 'mcq',
        word: { arabic: 'هَلْ خَالِدٌ مُعَلِّمٌ؟', bangla: 'খালিদ কি শিক্ষক?' },
        question: 'হ্যাঁ-উত্তর কোনটি?',
        options: [
          { text: 'نَعَمْ، هُوَ مُعَلِّمٌ.', isCorrect: true },
          { text: 'لَا، هُوَ طَبِيبٌ.', isCorrect: false },
          { text: 'نَعَمْ، هِيَ مُعَلِّمَةٌ.', isCorrect: false },
        ],
      },
      arabicOf(W.amin,   ['نَشِيطٌ', 'كَسْلَانٌ']),
      arabicOf(W.kaslan, ['نَشِيطٌ', 'أَمِينٌ']),
      {
        type: 'mcq',
        word: { arabic: 'أَ مُعَلِّمٌ مَاجِدٌ أَمْ تَاجِرٌ؟', bangla: 'মাজিদ কি শিক্ষক নাকি ব্যবসায়ী?' },
        question: 'সঠিক উত্তর?',
        options: [
          { text: 'تَاجِرٌ.', isCorrect: true },
          { text: 'مُعَلِّمٌ.', isCorrect: false },
          { text: 'نَعَمْ.', isCorrect: false },
        ],
      },
      fillBlank('خَالِدٌ مُعَلِّمٌ ___.', 'نَشِيطٌ', ['كَسْلَانٌ', 'بَخِيلٌ'], 'পরিশ্রমী = ?'),
      match([W.muallim, W.tajir, W.amin, W.kaslan]),
      sentenceBuilder(SENT.khalid_muallim, ['مُعَلِّمٌ', 'بَخِيلٌ', 'كَاذِبٌ']),
      match([W.sadiq, W.kadhib, W.nashit, W.sakhi], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l12-q-man', stageId: 'l12-man-huwa',
  title: 'مَنْ هُوَ؟ / مَنْ هِيَ؟ প্রশ্ন',
  table: [
    { arabic: 'مَنْ هُوَ ...؟',  bangla: 'সে (পুরু.) কে?' },
    { arabic: 'مَنْ هِيَ ...؟',  bangla: 'সে (স্ত্রী.) কে?' },
    { arabic: 'هُوَ تَاجِرٌ.',   bangla: 'সে ব্যবসায়ী।' },
    { arabic: 'هِيَ طَبِيبَةٌ.', bangla: 'সে চিকিৎসক।' },
  ],
  rule: 'مَنْ = কে? — ব্যক্তি সম্পর্কে প্রশ্নে ব্যবহার হয়। هُوَ = সে (পুরু.), هِيَ = সে (স্ত্রী.)।',
  examples: [
    { arabic: 'مَنْ هُوَ رَاشِدٌ؟', bangla: 'রাশিদ কে?' },
    { arabic: 'هُوَ فَلَّاحٌ.',       bangla: 'সে কৃষক।' },
  ],
}];

const vocabulary = [
  { arabic: 'طَبِيبٌ',    bangla: 'চিকিৎসক',     picture: 'bag' },
  { arabic: 'أَمِينٌ',    bangla: 'বিশ্বস্ত',    picture: 'key' },
  { arabic: 'بَخِيلٌ',   bangla: 'কৃপণ',        picture: 'lock' },
  { arabic: 'سَخِيٌّ',   bangla: 'দানশীল',      picture: 'key' },
  { arabic: 'كَاتِبٌ',   bangla: 'লেখক',        picture: 'pen' },
  { arabic: 'كَسْلَانٌ', bangla: 'অলস',         picture: 'bed' },
  { arabic: 'نَشِيطٌ',   bangla: 'উদ্যমী',      picture: 'bag' },
  { arabic: 'مُعَلِّمٌ', bangla: 'শিক্ষক',      picture: 'blackboard' },
  { arabic: 'تِلْمِيذٌ', bangla: 'ছাত্র',       picture: 'bag' },
  { arabic: 'تَاجِرٌ',   bangla: 'ব্যবসায়ী',   picture: 'box' },
  { arabic: 'فَلَّاحٌ',  bangla: 'কৃষক',        picture: 'tree' },
  { arabic: 'صَادِقٌ',   bangla: 'সত্যবাদী',    picture: 'book' },
];
const sentences = Object.values(SENT);
const dialogues = [
  { arabic: 'مَنْ هُوَ مَاجِدٌ؟ — هُوَ تَاجِرٌ كَبِيرٌ.', bangla: 'মাজিদ কে? — বড় ব্যবসায়ী।', page: '৬৪' },
];
const tamrinKitabi = [
  { task: 'পরিচয় দাও', text: 'মাজিদ/খালিদ/রাশিদ সম্পর্কে مَنْ হুওয়া প্রশ্ন করো।', hint: 'مَنْ هُوَ ...؟ — هُوَ ...' },
  { task: 'বিশেষণ যোগ করো', text: 'পেশাবাচক শব্দের সাথে গুণবাচক শব্দ যোগ করো।', hint: 'تَاجِرٌ أَمِينٌ' },
];
const quizLegacy = [
  { question: "'مَنْ هُوَ؟' প্রশ্নের অর্থ কী?", options: ['সে কে?', 'সে কোথায়?', 'সে কী করে?'], correctIndex: 0, correctAnswer: 0, explanation: 'مَنْ = কে।', type: 'mcq' },
  { question: "'نَشِيطٌ' অর্থ কী?", options: ['উদ্যমী', 'অলস', 'কৃপণ'], correctIndex: 0, correctAnswer: 0, explanation: 'নাশিত = উদ্যমী।', type: 'mcq' },
  { question: "'تَاجِرٌ' অর্থ কী?", options: ['ব্যবসায়ী', 'শিক্ষক', 'কৃষক'], correctIndex: 0, correctAnswer: 0, explanation: 'তাজির = ব্যবসায়ী।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l3',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৬২-৬৬', qaida,
    grammarRule: { title: 'مَنْ هُوَ؟ / مَنْ هِيَ؟', summary: 'মান হুওয়া/হিয়া = কে? — ব্যক্তি পরিচয়ের প্রশ্ন।', points: ['مَنْ هُوَ رَاشِدٌ؟ — هُوَ فَلَّاحٌ.', 'مَنْ هِيَ فَاطِمَةُ؟ — هِيَ طَبِيبَةٌ.'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};