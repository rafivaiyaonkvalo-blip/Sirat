// vol1-ch2-l7.cjs  |  দারস ৭ — ২য় অধ্যায়  |  পৃষ্ঠা ৮২–৮৫
// বিষয়: যরফ (অবস্থান শব্দ), ক্রিয়ার মুদারি রূপ (يَفْعَلُ/تَفْعَلُ/أَفْعَلُ)

const W = {
  nahr:    { arabic: 'نَهْرٌ',     bangla: 'একটি নদী' },
  bahr:    { arabic: 'بَحْرٌ',     bangla: 'একটি সমুদ্র' },
  jisr:    { arabic: 'جِسْرٌ',     bangla: 'একটি পুল' },
  zawraq:  { arabic: 'زَوْرَقٌ',   bangla: 'একটি নৌকা' },
  fawq:    { arabic: 'فَوْقَ',     bangla: 'উপরে' },
  tahta:   { arabic: 'تَحْتَ',    bangla: 'নিচে' },
  amama:   { arabic: 'أَمَامَ',   bangla: 'সামনে' },
  tawila:  { arabic: 'طَاوِلَةٌ', bangla: 'একটি টেবিল', picture: 'table' },
  kursi:   { arabic: 'كُرْسِيٌّ', bangla: 'একটি চেয়ার', picture: 'chair' },
  sabura:  { arabic: 'سَبُّورَةٌ', bangla: 'একটি ব্লাকবোর্ড', picture: 'blackboard' },
  mizalla: { arabic: 'مِظَلَّةٌ', bangla: 'একটি ছাতা', picture: 'umbrella' },
  haqiba:  { arabic: 'حَقِيبَةٌ', bangla: 'একটি ব্যাগ', picture: 'bag' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  hadhi_tawila:  T('هَذِهِ طَاوِلَةٌ.',                                  'এটি একটি টেবিল।',                         '৮৪'),
  tawila_kabira: T('اَلطَّاوِلَةُ كَبِيرَةٌ.',                          'টেবিলটি বড়।',                            '৮৪'),
  fawq_kitab:    T('فَوْقَ الطَّاوِلَةِ كِتَابٌ وَقَلَمٌ.',             'টেবিলের উপর বই ও কলম আছে।',               '৮৪'),
  fawq_saa:      T('فَوْقَ الطَّاوِلَةِ سَاعَةٌ وَمِسْطَرَةٌ.',         'টেবিলের উপর ঘড়ি ও রুলার আছে।',           '৮৪'),
  kitab_qalam:   T('اَلْكِتَابُ وَالْقَلَمُ فَوْقَ الطَّاوِلَةِ.',      'বই ও কলম টেবিলের উপর।',                   '৮৪'),
  saa_mistara:   T('اَلسَّاعَةُ وَالْمِسْطَرَةُ فَوْقَ الطَّاوِلَةِ.',  'ঘড়ি ও রুলার টেবিলের উপর।',               '৮৪'),
  tahta_haqiba:  T('تَحْتَ الطَّاوِلَةِ حَقِيبَةٌ وَمِظَلَّةٌ.',        'টেবিলের নিচে ব্যাগ ও ছাতা আছে।',         '৮৪'),
  haqiba_mizalla:T('اَلْحَقِيبَةُ وَالْمِظَلَّةُ تَحْتَ الطَّاوِلَةِ.',  'ব্যাগ ও ছাতা টেবিলের নিচে।',             '৮৪'),
  amam_muallim:  T('أَمَامَ الْمُعَلِّمِ سَبُّورَةٌ.',                  'শিক্ষকের সামনে ব্লাকবোর্ড আছে।',          '৮৪'),
  muallim_sabura:T('اَلْمُعَلِّمُ أَمَامَ السَّبُّورَةِ.',              'শিক্ষক ব্লাকবোর্ডের সামনে।',              '৮৪'),
  amam_kursi:    T('أَمَامَ السَّبُّورَةِ كُرْسِيٌّ وَطَاوِلَةٌ.',     'ব্লাকবোর্ডের সামনে চেয়ার ও টেবিল আছে।',  '৮৪'),
  kursi_tawila:  T('اَلْكُرْسِيُّ وَالطَّاوِلَةُ أَمَامَ السَّبُّورَةِ.', 'চেয়ার ও টেবিল ব্লাকবোর্ডের সামনে।',    '৮৪'),
  hadha_nahr:    T('هَذَا نَهْرٌ كَبِيرٌ.',                             'এটি বড় নদী।',                             '৮৪'),
  fawq_nahr:     T('فَوْقَ النَّهْرِ جِسْرٌ.',                          'নদীর উপর একটি পুল আছে।',                  '৮৪'),
  jisr_fawq:     T('اَلْجِسْرُ فَوْقَ النَّهْرِ.',                      'পুলটি নদীর উপর।',                          '৮৪'),
  jisr_jadid:    T('هَذَا الْجِسْرُ جَدِيدٌ وَطَوِيلٌ جِدًّا.',         'এই পুলটি নতুন ও খুব লম্বা।',              '৮৪'),
  tahta_jisr:    T('تَحْتَ الْجِسْرِ زَوْرَقٌ.',                        'পুলের নিচে একটি নৌকা আছে।',               '৮৫'),
  zawraq_saghir: T('هَذَا الزَّوْرَقُ صَغِيرٌ.',                        'এই নৌকাটি ছোট।',                          '৮৫'),
  fawq_sayyara:  T('فَوْقَ الْجِسْرِ سَيَّارَةٌ.',                      'পুলের উপর একটি গাড়ি আছে।',               '৮৫'),
  sayyara_sariia:T('هَذِهِ سَيَّارَةٌ سَرِيعَةٌ جِدًّا.',               'এটি খুব দ্রুতগামী গাড়ি।',               '৮৫'),
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
    id: 'l16-words', titleBn: 'নদী, সমুদ্র, পুল ও নৌকা', shortTitle: 'শব্দার্থ',
    titleAr: 'الْمُفْرَدَاتُ', desc: 'নদী, সমুদ্র, পুল, নৌকা — আর উপরে/নিচে/সামনে',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৮৪',
    steps: [
      intro(W.nahr), intro(W.bahr), intro(W.jisr), intro(W.zawraq),
      intro(W.fawq), intro(W.tahta), intro(W.amama),
      match([W.nahr, W.bahr, W.jisr, W.zawraq]),
      match([W.fawq, W.tahta, W.amama, W.tawila]),
      mcqWord(W.jisr, ['একটি নদী', 'একটি নৌকা']),
      mcqWord(W.fawq, ['নিচে', 'সামনে']),
      arabicOf(W.zawraq, ['بَحْرٌ', 'نَهْرٌ']),
    ],
  },
  {
    id: 'l16-tawila', titleBn: 'টেবিল ও ব্লাকবোর্ড: فَوْقَ، تَحْتَ، أَمَامَ', shortTitle: 'টেবিল',
    titleAr: 'الطَّاوِلَةُ وَالسَّبُّورَةُ', desc: 'টেবিলের উপর, নিচে; ব্লাকবোর্ডের সামনে',
    iconName: 'Zap', color: 'violet', estMinutes: 5, bookPages: '৮৪',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: যরফ',
        table: [
          { label: 'উপরে', arabic: 'فَوْقَ الطَّاوِلَةِ كِتَابٌ', bangla: 'টেবিলের উপর বই আছে' },
          { label: 'নিচে', arabic: 'تَحْتَ الطَّاوِلَةِ حَقِيبَةٌ', bangla: 'টেবিলের নিচে ব্যাগ আছে' },
          { label: 'সামনে', arabic: 'أَمَامَ السَّبُّورَةِ كُرْسِيٌّ', bangla: 'ব্লাকবোর্ডের সামনে চেয়ার আছে' },
        ],
      },
      introSentence(SENT.hadhi_tawila), introSentence(SENT.tawila_kabira), introSentence(SENT.fawq_kitab),
      introSentence(SENT.fawq_saa), introSentence(SENT.kitab_qalam), introSentence(SENT.saa_mistara),
      introSentence(SENT.tahta_haqiba), introSentence(SENT.haqiba_mizalla),
      mcqWord({ arabic: 'فَوْقَ الطَّاوِلَةِ كِتَابٌ وَقَلَمٌ.', bangla: 'টেবিলের উপর বই ও কলম আছে।' }, ['টেবিলের নিচে বই ও কলম আছে।', 'টেবিলের সামনে বই ও কলম আছে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('___ الطَّاوِلَةِ حَقِيبَةٌ وَمِظَلَّةٌ.', 'تَحْتَ', ['فَوْقَ', 'أَمَامَ'], 'নিচে = ?'),
      sentenceBuilder(SENT.kitab_qalam, ['تَحْتَ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.haqiba_mizalla, ['فَوْقَ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l16-sabura', titleBn: 'শিক্ষক ও ব্লাকবোর্ড', shortTitle: 'ব্লাকবোর্ড',
    titleAr: 'الْمُعَلِّمُ وَالسَّبُّورَةُ', desc: 'শিক্ষক ব্লাকবোর্ডের সামনে; চেয়ার-টেবিলের অবস্থান',
    iconName: 'Star', color: 'teal', estMinutes: 3, bookPages: '৮৪',
    steps: [
      introSentence(SENT.amam_muallim), introSentence(SENT.muallim_sabura),
      introSentence(SENT.amam_kursi), introSentence(SENT.kursi_tawila),
      mcqWord({ arabic: 'اَلْمُعَلِّمُ أَمَامَ السَّبُّورَةِ.', bangla: 'শিক্ষক ব্লাকবোর্ডের সামনে।' }, ['শিক্ষক ব্লাকবোর্ডের পিছনে।', 'শিক্ষক টেবিলের নিচে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('أَمَامَ السَّبُّورَةِ كُرْسِيٌّ وَ___.', 'طَاوِلَةٌ', ['نَهْرٌ', 'جِسْرٌ'], 'টেবিল = ?'),
      sentenceBuilder(SENT.muallim_sabura, ['تَحْتَ', 'فَوْقَ', 'أَمْ']),
      sentenceBuilder(SENT.kursi_tawila, ['فَوْقَ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l16-nahr', titleBn: 'নদী ও পুল', shortTitle: 'নদী-পুল',
    titleAr: 'النَّهْرُ وَالْجِسْرُ', desc: 'নদীর উপর পুল, পুলের নিচে নৌকা',
    iconName: 'MessageCircle', color: 'cyan', estMinutes: 4, bookPages: '৮৪–৮৫',
    steps: [
      introSentence(SENT.hadha_nahr), introSentence(SENT.fawq_nahr), introSentence(SENT.jisr_fawq),
      introSentence(SENT.jisr_jadid), introSentence(SENT.tahta_jisr), introSentence(SENT.zawraq_saghir),
      introSentence(SENT.fawq_sayyara), introSentence(SENT.sayyara_sariia),
      mcqWord({ arabic: 'تَحْتَ الْجِسْرِ زَوْرَقٌ.', bangla: 'পুলের নিচে একটি নৌকা আছে।' }, ['পুলের উপর একটি নৌকা আছে।', 'নদীর নিচে একটি পুল আছে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('فَوْقَ النَّهْرِ ___.', 'جِسْرٌ', ['زَوْرَقٌ', 'بَحْرٌ'], 'পুল = ?'),
      sentenceBuilder(SENT.fawq_nahr, ['تَحْتَ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.tahta_jisr, ['فَوْقَ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l16-tamrin', titleBn: 'তামরীন ১: ছবি দেখে উত্তর দাও', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينُ الْأَوَّلُ', desc: 'কিতাবের প্রশ্নগুলো পড়ো ও অর্থ বলো',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৮৫–৮৬',
    steps: [
      introSentence(T('هَلْ فَوْقَ الطَّاوِلَةِ سَاعَةٌ وَمِسْطَرَةٌ؟', 'টেবিলের উপর কি ঘড়ি ও রুলার আছে?', '৮৫')),
      introSentence(T('أَ كِتَابٌ فَوْقَ الطَّاوِلَةِ أَمْ كُرَّاسَةٌ؟', 'টেবিলের উপর কি বই না খাতা?', '৮৫')),
      introSentence(T('مَاذَا فَوْقَ الطَّاوِلَةِ؟', 'টেবিলের উপর কী আছে?', '৮৫')),
      introSentence(T('أَيْنَ الْكِتَابُ وَالْقَلَمُ؟', 'বই ও কলম কোথায়?', '৮৫')),
      introSentence(T('مَاذَا تَحْتَ السَّقْفِ؟', 'ছাদের নিচে কী আছে?', '৮৫')),
      introSentence(T('أَ مِرْوَحَةٌ تَحْتَ السَّقْفِ أَمْ مِصْبَاحٌ؟', 'ছাদের নিচে কি পাখা না বাতি?', '৮৫')),
      introSentence(T('مَاذَا فَوْقَ النَّهْرِ؟ أَيْنَ الْجِسْرُ؟ كَيْفَ الْجِسْرُ؟', 'নদীর উপর কী আছে? পুলটি কোথায়? পুলটি কেমন?', '৮৫')),
      introSentence(T('أَ طَوِيلٌ هَذَا الْجِسْرُ؟ أَ جَدِيدٌ هَذَا الْجِسْرُ أَمْ قَدِيمٌ؟', 'এই পুলটি কি লম্বা? এই পুলটি কি নতুন না পুরনো?', '৮৫')),
      introSentence(T('أَيْنَ الزَّوْرَقُ؟ أَ تَحْتَ الْجِسْرِ الزَّوْرَقُ أَمْ فَوْقَهُ؟', 'নৌকাটি কোথায়? নৌকাটি কি পুলের নিচে না উপরে?', '৮৬')),
      introSentence(T('مَنْ أَمَامَ السَّبُّورَةِ؟ أَيْنَ الْمُعَلِّمُ؟', 'ব্লাকবোর্ডের সামনে কে? শিক্ষক কোথায়?', '৮৬')),
      introSentence(T('أَيْنَ الْكُرْسِيُّ وَالطَّاوِلَةُ؟', 'চেয়ার ও টেবিল কোথায়?', '৮৬')),
      match([W.nahr, W.bahr, W.jisr, W.zawraq], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l16-q-zarf', stageId: 'l16-tawila',
  title: 'যরফ: فَوْقَ، تَحْتَ، أَمَامَ',
  table: [
    { arabic: 'فَوْقَ الطَّاوِلَةِ', bangla: 'টেবিলের উপর' },
    { arabic: 'تَحْتَ الطَّاوِلَةِ', bangla: 'টেবিলের নিচে' },
    { arabic: 'أَمَامَ السَّبُّورَةِ', bangla: 'ব্লাকবোর্ডের সামনে' },
  ],
  rule: 'فَوْقَ, تَحْتَ, أَمَامَ — এদের পরের শব্দের শেষে যের (ــِ) হয়।',
  examples: [{ arabic: 'فَوْقَ النَّهْرِ جِسْرٌ.', bangla: 'নদীর উপর পুল আছে।' }],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'ছবি দেখে উত্তর দাও', arabic: 'أَ كِتَابٌ فَوْقَ الطَّاوِلَةِ أَمْ كُرَّاسَةٌ؟', bangla: 'টেবিলের উপর কি বই না খাতা?', mode: 'ar-to-bn', page: '৮৫' },
  { task: 'ছবি দেখে উত্তর দাও', arabic: 'أَيْنَ الزَّوْرَقُ؟ أَ تَحْتَ الْجِسْرِ الزَّوْرَقُ أَمْ فَوْقَهُ؟', bangla: 'নৌকাটি কোথায়? নৌকাটি কি পুলের নিচে না উপরে?', mode: 'ar-to-bn', page: '৮৬' },
];
const quizLegacy = [
  { question: "'فَوْقَ' অর্থ কী?", options: ['উপরে', 'নিচে', 'সামনে'], correctIndex: 0, correctAnswer: 0, explanation: 'ফাওকা = উপরে।', type: 'mcq' },
  { question: "'جِسْرٌ' অর্থ?", options: ['পুল', 'নদী', 'নৌকা'], correctIndex: 0, correctAnswer: 0, explanation: 'জিসর = পুল।', type: 'mcq' },
  { question: "'تَحْتَ الطَّاوِلَةِ' অর্থ?", options: ['টেবিলের নিচে', 'টেবিলের উপর', 'টেবিলের সামনে'], correctIndex: 0, correctAnswer: 0, explanation: 'তাহতা = নিচে।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l7',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৮৪-৮৬', qaida,
    grammarRule: { title: 'যরফ ও মুদারি ক্রিয়া', summary: 'যরফ = অবস্থান শব্দ। মুদারি = বর্তমান ক্রিয়া।', points: ['فَوْقَ = উপরে, تَحْتَ = নিচে', 'يَفْعَلُ = সে করছে, أَفْعَلُ = আমি করছি'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};