// vol1-ch2-l8.cjs  |  দারস ৮ — ২য় অধ্যায়  |  পৃষ্ঠা ৮৫–৮৬
// বিষয়: শ্রেণিকক্ষের শব্দ, فِي (ভেতরে), ২য় অধ্যায়ের মুরাজাআ

const W = {
  saff:    { arabic: 'صَفٌّ',       bangla: 'শ্রেণী' },
  fasl:    { arabic: 'فَصْلٌ',      bangla: 'শ্রেণীকক্ষ' },
  nar:     { arabic: 'نَارٌ',       bangla: 'আগুন, জাহান্নাম' },
  maktab:  { arabic: 'مَكْتَبٌ',   bangla: 'দফতর' },
  kuwb:    { arabic: 'كُوبٌ',       bangla: 'একটি গ্লাস' },
  maa:     { arabic: 'مَاءٌ',       bangla: 'পানি' },
  laban:   { arabic: 'لَبَنٌ',      bangla: 'দুধ' },
  sabura:  { arabic: 'سَبُّورَةٌ',  bangla: 'একটি ব্লাকবোর্ড', picture: 'blackboard' },
  kursi:   { arabic: 'كُرْسِيٌّ',   bangla: 'একটি চেয়ার', picture: 'chair' },
  tawila:  { arabic: 'طَاوِلَةٌ',   bangla: 'একটি টেবিল', picture: 'table' },
  sarir:   { arabic: 'سَرِيرٌ',     bangla: 'একটি খাট', picture: 'bed' },
  misbah:  { arabic: 'مِصْبَاحٌ',   bangla: 'একটি বাতি', picture: 'lamp' },
  mirwaha: { arabic: 'مِرْوَحَةٌ',  bangla: 'একটি পাখা', picture: 'fan' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  hadha_fasl:    T('هَذَا فَصْلٌ.',                                       'এটি একটি শ্রেণীকক্ষ।',                    '৮৭'),
  fasl_khamis:   T('هَذَا فَصْلُ الصَّفِّ الْخَامِسِ.',                 'এটি পঞ্চম শ্রেণীর শ্রেণীকক্ষ।',          '৮৭'),
  fi_sabura:     T('فِي هَذَا الْفَصْلِ سَبُّورَةٌ.',                    'এই শ্রেণীকক্ষে একটি ব্লাকবোর্ড আছে।',    '৮৭'),
  fi_kursi:      T('فِي هَذَا الْفَصْلِ كُرْسِيٌّ وَطَاوِلَةٌ.',        'এই শ্রেণীকক্ষে চেয়ার ও টেবিল আছে।',      '৮৭'),
  sabura_fasl:   T('اَلسَّبُّورَةُ فِي هَذَا الْفَصْلِ.',                'ব্লাকবোর্ডটি এই শ্রেণীকক্ষে।',          '৮৭'),
  kursi_fasl:    T('اَلْكُرْسِيُّ وَالطَّاوِلَةُ فِي هَذَا الْفَصْلِ.', 'চেয়ার ও টেবিল এই শ্রেণীকক্ষে।',        '৮৭'),
  kuwb_saghir:   T('هَذَا كُوبٌ صَغِيرٌ وَذَلِكَ كُوبٌ كَبِيرٌ.',       'এটি ছোট গ্লাস এবং ওটি বড় গ্লাস।',        '৮৭'),
  fi_kuwb_maa:   T('فِي هَذَا الْكُوبِ مَاءٌ.',                         'এই গ্লাসে পানি আছে।',                     '৮৭'),
  fi_dhalik_laban:T('وَفِي ذَلِكَ الْكُوبِ لَبَنٌ.',                    'আর ঐ গ্লাসে দুধ আছে।',                    '৮৭'),
  maa_kuwb:      T('اَلْمَاءُ فِي هَذَا الْكُوبِ وَاللَّبَنُ فِي ذَلِكَ الْكُوبِ.', 'পানি এই গ্লাসে এবং দুধ ঐ গ্লাসে।', '৮৭'),
  ghurfat_fatima:T('هَذِهِ غُرْفَةُ فَاطِمَةَ.',                         'এটি ফাতেমার কামরা।',                     '৮৭'),
  ghurfatuha:    T('غُرْفَتُهَا صَغِيرَةٌ وَجَمِيلَةٌ.',                 'তার কামরা ছোট ও সুন্দর।',                '৮৭'),
  fatima_ghurfa: T('فَاطِمَةُ فِي غُرْفَتِهَا.',                         'ফাতেমা তার কামরায়।',                    '৮৭'),
  fi_ghurfatiha: T('فِي غُرْفَتِهَا سَرِيرٌ وَمِصْبَاحٌ وَمِرْوَحَةٌ.',  'তার কামরায় খাট, বাতি ও পাখা আছে।',      '৮৭'),
  sarir_ghurfa:  T('اَلسَّرِيرُ فِي غُرْفَةِ فَاطِمَةَ.',               'খাটটি ফাতেমার কামরায়।',                 '৮৭'),
  misbah_mirwaha:T('اَلْمِصْبَاحُ وَالْمِرْوَحَةُ فِي غُرْفَةِ فَاطِمَةَ.', 'বাতি ও পাখা ফাতেমার কামরায়।',       '৮৭'),
  sayf_mujahid:  T('فِي يَدِ الْمُجَاهِدِ سَيْفٌ وَفِي يَدِ الْعَالِمِ قَلَمٌ.', 'মুজাহিদের হাতে তলোয়ার এবং আলিমের হাতে কলম।', '৮৮'),
  nur_zulma:     T('فِي قَلْبِ الْمُسْلِمِ نُورٌ وَفِي قَلْبِ الْكَافِرِ ظُلْمَةٌ.', 'মুসলিমের অন্তরে নূর এবং কাফিরের অন্তরে অন্ধকার।', '৮৮'),
  janna_nar:     T('اَلْمُسْلِمُ فِي الْجَنَّةِ وَالْكَافِرُ فِي النَّارِ.', 'মুসলিম জান্নাতে এবং কাফির জাহান্নামে।', '৮৮'),
  qaryatuna:     T('فِي قَرْيَتِنَا مَسْجِدٌ كَبِيرٌ وَمَدْرَسَةٌ كَبِيرَةٌ.', 'আমাদের গ্রামে বড় মসজিদ ও বড় মাদরাসা আছে।', '৮৮'),
  khayr_sharr:   T('اَلْخَيْرُ فِي الْمَسْجِدِ وَالشَّرُّ فِي السُّوقِ.', 'কল্যাণ মসজিদে এবং অকল্যাণ বাজারে।', '৮৮'),
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
    id: 'l17-words', titleBn: 'নতুন শব্দ', shortTitle: 'শব্দার্থ',
    titleAr: 'الْمُفْرَدَاتُ', desc: 'শ্রেণী, শ্রেণীকক্ষ, দফতর, আগুন, গ্লাস, পানি, দুধ',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৮৭',
    steps: [
      intro(W.saff), intro(W.fasl), intro(W.maktab), intro(W.nar),
      intro(W.kuwb), intro(W.maa), intro(W.laban),
      match([W.saff, W.fasl, W.maktab, W.nar]),
      match([W.kuwb, W.maa, W.laban, W.fasl]),
      mcqWord(W.fasl, ['শ্রেণী', 'দফতর']),
      arabicOf(W.maktab, ['فَصْلٌ', 'نَارٌ']),
    ],
  },
  {
    id: 'l17-fasl', titleBn: 'শ্রেণীকক্ষ: فِي দিয়ে অবস্থান', shortTitle: 'শ্রেণীকক্ষ',
    titleAr: 'فِي الْفَصْلِ', desc: 'শ্রেণীকক্ষে ব্লাকবোর্ড, চেয়ার ও টেবিল',
    iconName: 'Zap', color: 'violet', estMinutes: 4, bookPages: '৮৭',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: فِي',
        table: [
          { label: 'এর মধ্যে', arabic: 'فِي هَذَا الْفَصْلِ سَبُّورَةٌ', bangla: 'এই শ্রেণীকক্ষে ব্লাকবোর্ড আছে' },
          { label: 'এর মধ্যে', arabic: 'اَلسَّبُّورَةُ فِي هَذَا الْفَصْلِ', bangla: 'ব্লাকবোর্ড এই শ্রেণীকক্ষে' },
        ],
      },
      introSentence(SENT.hadha_fasl), introSentence(SENT.fasl_khamis), introSentence(SENT.fi_sabura),
      introSentence(SENT.fi_kursi), introSentence(SENT.sabura_fasl), introSentence(SENT.kursi_fasl),
      mcqWord({ arabic: 'فِي هَذَا الْفَصْلِ سَبُّورَةٌ.', bangla: 'এই শ্রেণীকক্ষে একটি ব্লাকবোর্ড আছে।' }, ['এই শ্রেণীকক্ষে একটি খাট আছে।', 'এই দফতরে একটি ব্লাকবোর্ড আছে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('___ هَذَا الْفَصْلِ كُرْسِيٌّ وَطَاوِلَةٌ.', 'فِي', ['فَوْقَ', 'أَمَامَ'], 'এর মধ্যে = ?'),
      sentenceBuilder(SENT.fi_sabura, ['فَوْقَ', 'تِلْكَ', 'أَمْ']),
      sentenceBuilder(SENT.kursi_fasl, ['تَحْتَ', 'ذَلِكَ', 'أَمْ']),
    ],
  },
  {
    id: 'l17-kuwb', titleBn: 'গ্লাসে পানি ও দুধ', shortTitle: 'গ্লাস',
    titleAr: 'الْكُوبُ', desc: 'এই গ্লাসে পানি, ঐ গ্লাসে দুধ',
    iconName: 'Star', color: 'teal', estMinutes: 3, bookPages: '৮৭',
    steps: [
      introSentence(SENT.kuwb_saghir), introSentence(SENT.fi_kuwb_maa), introSentence(SENT.fi_dhalik_laban),
      introSentence(SENT.maa_kuwb),
      mcqWord({ arabic: 'فِي هَذَا الْكُوبِ مَاءٌ.', bangla: 'এই গ্লাসে পানি আছে।' }, ['এই গ্লাসে দুধ আছে।', 'ঐ গ্লাসে পানি আছে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('وَفِي ذَلِكَ الْكُوبِ ___.', 'لَبَنٌ', ['مَاءٌ', 'نَارٌ'], 'দুধ = ?'),
      sentenceBuilder(SENT.fi_kuwb_maa, ['لَبَنٌ', 'ذَلِكَ', 'أَمْ']),
      sentenceBuilder(SENT.fi_dhalik_laban, ['مَاءٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l17-ghurfa', titleBn: 'ফাতেমার কামরা', shortTitle: 'ফাতেমার কামরা',
    titleAr: 'غُرْفَةُ فَاطِمَةَ', desc: 'ফাতেমার কামরায় খাট, বাতি, পাখা',
    iconName: 'MessageCircle', color: 'orange', estMinutes: 4, bookPages: '৮৭',
    steps: [
      intro(W.sarir), intro(W.misbah), intro(W.mirwaha),
      introSentence(SENT.ghurfat_fatima), introSentence(SENT.ghurfatuha), introSentence(SENT.fatima_ghurfa),
      introSentence(SENT.fi_ghurfatiha), introSentence(SENT.sarir_ghurfa), introSentence(SENT.misbah_mirwaha),
      mcqWord({ arabic: 'فِي غُرْفَتِهَا سَرِيرٌ وَمِصْبَاحٌ وَمِرْوَحَةٌ.', bangla: 'তার কামরায় খাট, বাতি ও পাখা আছে।' }, ['তার কামরায় চেয়ার, টেবিল ও খাট আছে।', 'তার কামরায় শুধু খাট আছে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('فَاطِمَةُ فِي ___.', 'غُرْفَتِهَا', ['غُرْفَتِهِ', 'غُرْفَتُكِ'], 'তার (নারী) কামরায়'),
      sentenceBuilder(SENT.fatima_ghurfa, ['غُرْفَتِهِ', 'هَذِهِ', 'أَمْ']),
    ],
  },
  {
    id: 'l17-jumal', titleBn: 'কিতাবের বাক্য (পৃ. ৮৮)', shortTitle: 'কিতাবের বাক্য',
    titleAr: 'جُمَلُ الْكِتَابِ', desc: 'মুজাহিদের হাতে তলোয়ার, মুসলিমের অন্তরে নূর…',
    iconName: 'Sparkles', color: 'cyan', estMinutes: 4, bookPages: '৮৮',
    steps: [
      introSentence(SENT.sayf_mujahid), introSentence(SENT.nur_zulma), introSentence(SENT.janna_nar),
      introSentence(SENT.qaryatuna), introSentence(SENT.khayr_sharr),
      mcqWord({ arabic: 'اَلْمُسْلِمُ فِي الْجَنَّةِ وَالْكَافِرُ فِي النَّارِ.', bangla: 'মুসলিম জান্নাতে এবং কাফির জাহান্নামে।' }, ['মুসলিম জাহান্নামে এবং কাফির জান্নাতে।', 'মুসলিম ও কাফির জান্নাতে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('فِي قَلْبِ الْمُسْلِمِ ___.', 'نُورٌ', ['ظُلْمَةٌ', 'نَارٌ'], 'নূর = ?'),
      sentenceBuilder(SENT.khayr_sharr, ['تَحْتَ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l17-muraja', titleBn: 'তামরীন: প্রশ্নোত্তর (পৃ. ৮৮–৮৯)', shortTitle: 'প্রশ্ন',
    titleAr: 'الْأَسْئِلَةُ', desc: 'কিতাবের প্রশ্নগুলো পড়ো ও অর্থ বলো',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৮৮–৮৯',
    steps: [
      introSentence(T('مَاذَا فِي هَذَا الْفَصْلِ؟', 'এই শ্রেণীকক্ষে কী আছে?', '৮৮')),
      introSentence(T('أَ سَبُّورَةٌ فِي هَذَا الْفَصْلِ أَمْ سَرِيرٌ؟', 'এই শ্রেণীকক্ষে কি ব্লাকবোর্ড না খাট?', '৮৮')),
      introSentence(T('هَلْ فِي هَذَا الْفَصْلِ كُرْسِيٌّ وَطَاوِلَةٌ؟ أَيْنَ الْكُرْسِيُّ وَالطَّاوِلَةُ؟', 'এই শ্রেণীকক্ষে কি চেয়ার ও টেবিল আছে? চেয়ার ও টেবিল কোথায়?', '৮৮')),
      introSentence(T('غُرْفَةُ مَنْ هَذِهِ؟ هَلْ فِي غُرْفَةِ فَاطِمَةَ مِصْبَاحٌ؟', 'এটি কার কামরা? ফাতেমার কামরায় কি বাতি আছে?', '৮৮')),
      introSentence(T('مَاذَا فِي غُرْفَةِ فَاطِمَةَ؟ أَيْنَ الْمِرْوَحَةُ؟', 'ফাতেমার কামরায় কী আছে? পাখাটি কোথায়?', '৮৮')),
      introSentence(T('هَلْ فِي هَذَا الْكُوبِ مَاءٌ؟ هَلْ فِي ذَلِكَ الْكُوبِ مَاءٌ؟', 'এই গ্লাসে কি পানি আছে? ঐ গ্লাসে কি পানি আছে?', '৮৯')),
      introSentence(T('أَ الْمَاءُ فِي هَذَا الْكُوبِ أَمِ اللَّبَنُ؟', 'পানি কি এই গ্লাসে না দুধ?', '৮৯')),
      introSentence(T('مَا فِي هَذَا الْكُوبِ وَمَا فِي ذَلِكَ الْكُوبِ؟', 'এই গ্লাসে কী আছে এবং ঐ গ্লাসে কী আছে?', '৮৯')),
      introSentence(T('أَيْنَ اللَّبَنُ وَأَيْنَ الْمَاءُ؟', 'দুধ কোথায় এবং পানি কোথায়?', '৮৯')),
      match([W.saff, W.fasl, W.maktab, W.nar], 'শেষ পর্যালোচনা'),
    ],
  },
  {
    id: 'l17-amr', titleBn: 'আদেশ ও নিষেধ: اِفْعَلْ — لَا تَفْعَلْ (মুখস্থের জন্য)', shortTitle: 'আদেশ-নিষেধ',
    titleAr: 'الْأَمْرُ وَالنَّهْيُ', desc: 'তুমি কর / তুমি করো না',
    iconName: 'Trophy', color: 'rose', estMinutes: 5, bookPages: '৮৯–৯০',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: আদেশ ও নিষেধ',
        table: [
          { label: 'তুমি কর (পুং.)', arabic: 'اِفْعَلْ', bangla: 'তুমি কর' },
          { label: 'তুমি কর (স্ত্রী.)', arabic: 'اِفْعَلِي', bangla: 'তুমি (নারী) কর' },
          { label: 'তুমি করো না (পুং.)', arabic: 'لَا تَفْعَلْ', bangla: 'তুমি করো না' },
          { label: 'তুমি করো না (স্ত্রী.)', arabic: 'لَا تَفْعَلِي', bangla: 'তুমি (নারী) করো না' },
        ],
      },
      introSentence(T('أُخْرُجْ — أُخْرُجِي ، لَا تَخْرُجْ — لَا تَخْرُجِي', 'তুমি বের হও — (নারী) ; বের হয়ো না — (নারী)', '৮৯')),
      introSentence(T('اِذْهَبْ — اِذْهَبِي ، لَا تَذْهَبْ — لَا تَذْهَبِي', 'তুমি যাও — (নারী) ; যেয়ো না — (নারী)', '৮৯')),
      introSentence(T('اِجْلِسْ — اِجْلِسِي ، لَا تَجْلِسْ — لَا تَجْلِسِي', 'তুমি বসো — (নারী) ; বসো না — (নারী)', '৮৯')),
      introSentence(T('اِقْرَأْ — اِقْرَئِي ، لَا تَقْرَأْ — لَا تَقْرَئِي', 'তুমি পড়ো — (নারী) ; পড়ো না — (নারী)', '৮৯')),
      introSentence(T('اُكْتُبْ — اُكْتُبِي ، لَا تَكْتُبْ — لَا تَكْتُبِي', 'তুমি লেখো — (নারী) ; লিখো না — (নারী)', '৯০')),
      introSentence(T('اِرْجِعْ — اِرْجِعِي ، لَا تَرْجِعْ — لَا تَرْجِعِي', 'তুমি ফিরো — (নারী) ; ফিরো না — (নারী)', '৯০')),
      introSentence(T('اِلْعَبْ — اِلْعَبِي ، لَا تَلْعَبْ — لَا تَلْعَبِي', 'তুমি খেলো — (নারী) ; খেলো না — (নারী)', '৯০')),
      mcqWord({ arabic: 'اِذْهَبْ', bangla: 'তুমি যাও' }, ['তুমি যেয়ো না', 'তুমি (নারী) যাও'], 'অর্থ কী?'),
      mcqWord({ arabic: 'لَا تَجْلِسِي', bangla: 'তুমি (নারী) বসো না' }, ['তুমি (নারী) বসো', 'তুমি বসো না'], 'অর্থ কী?'),
      mcqWord({ arabic: 'اِقْرَأْ', bangla: 'তুমি পড়ো' }, ['তুমি পড়ো না', 'তুমি (নারী) পড়ো'], 'অর্থ কী?'),
    ],
  },
];

const qaida = [{
  id: 'l17-q-fi', stageId: 'l17-fasl',
  title: 'فِي (এর মধ্যে)',
  table: [
    { arabic: 'فِي هَذَا الْفَصْلِ', bangla: 'এই শ্রেণীকক্ষে' },
    { arabic: 'فِي ذَلِكَ الْكُوبِ', bangla: 'ঐ গ্লাসে' },
    { arabic: 'فِي غُرْفَتِهَا', bangla: 'তার কামরায়' },
  ],
  rule: 'فِي = মধ্যে/-এ। এর পরের শব্দের শেষে যের (ــِ) হয়।',
  examples: [{ arabic: 'فِي قَلْبِ الْمُسْلِمِ نُورٌ.', bangla: 'মুসলিমের অন্তরে নূর আছে।' }],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'প্রশ্নের উত্তর দাও', arabic: 'أَ الْمَاءُ فِي هَذَا الْكُوبِ أَمِ اللَّبَنُ؟', bangla: 'পানি কি এই গ্লাসে না দুধ?', mode: 'ar-to-bn', page: '৮৯' },
  { task: 'প্রশ্নের উত্তর দাও', arabic: 'هَلْ فِي هَذَا الْفَصْلِ كُرْسِيٌّ وَطَاوِلَةٌ؟', bangla: 'এই শ্রেণীকক্ষে কি চেয়ার ও টেবিল আছে?', mode: 'ar-to-bn', page: '৮৮' },
];
const quizLegacy = [
  { question: "'فِي' অর্থ কী?", options: ['মধ্যে', 'উপরে', 'নিচে'], correctIndex: 0, correctAnswer: 0, explanation: 'ফী = মধ্যে।', type: 'mcq' },
  { question: "'فَصْلٌ' অর্থ?", options: ['শ্রেণীকক্ষ', 'দফতর', 'আগুন'], correctIndex: 0, correctAnswer: 0, explanation: 'ফাসল = শ্রেণীকক্ষ।', type: 'mcq' },
  { question: "'لَا تَذْهَبْ' অর্থ?", options: ['তুমি যেয়ো না', 'তুমি যাও', 'সে যায়'], correctIndex: 0, correctAnswer: 0, explanation: 'নিষেধ।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l8',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৮৭-৯০', qaida,
    grammarRule: { title: 'فِي দিয়ে অবস্থান', summary: 'فِي = ভেতরে — অভ্যন্তর অবস্থান বলতে ব্যবহার হয়।', points: ['فِي الْبَيْتِ = বাড়িতে', 'فِي الْفَصْلِ = শ্রেণিকক্ষে'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};