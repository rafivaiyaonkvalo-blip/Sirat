// vol1-ch2-l6.cjs  |  দারস ৬ — ২য় অধ্যায়  |  পৃষ্ঠা ৭৭–৮১
// বিষয়: মসজিদ/মাদরাসা শব্দ, ক্রিয়ার মাদী রূপ (فَعَلَ/خَرَجَ/ذَهَبَ)

const W = {
  khayr:    { arabic: 'خَيْرٌ',      bangla: 'কল্যাণ' },
  sharr:    { arabic: 'شَرٌّ',       bangla: 'অকল্যাণ' },
  qayyim:   { arabic: 'قَيِّمٌ',     bangla: 'মূল্যবান' },
  maktaba:  { arabic: 'مَكْتَبَةٌ', bangla: 'পাঠাগার, লাইব্রেরী' },
  saqf:     { arabic: 'سَقْفٌ',      bangla: 'ছাদ' },
  asad:     { arabic: 'أَسَدٌ',      bangla: 'একটি সিংহ' },
  fa:       { arabic: 'فَأْرٌ',      bangla: 'একটি ইঁদুর' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  masjid_jamil:   T('ذَلِكَ مَسْجِدٌ جَمِيلٌ.',                          'ওটি সুন্দর মসজিদ।',                    '৭৯'),
  masjid_asima:   T('ذَلِكَ مَسْجِدُ الْعَاصِمَةِ.',                     'ওটি রাজধানীর মসজিদ।',                  '৭৯'),
  masjid_kabir:   T('مَسْجِدُ الْعَاصِمَةِ كَبِيرٌ وَجَمِيلٌ.',          'রাজধানীর মসজিদ বড় ও সুন্দর।',         '৭৯'),
  ism_masjid:     T('اِسْمُ الْمَسْجِدِ بَيْتُ الْمُكَرَّمِ.',            'মসজিদের নাম বাইতুল মুকাররম।',          '৭৯'),
  amam_hadiqa:    T('أَمَامَ الْمَسْجِدِ حَدِيقَةٌ كَبِيرَةٌ وَجَمِيلَةٌ.', 'মসজিদের সামনে বড় ও সুন্দর বাগান আছে।', '৭৯'),
  masjid_baytullah:T('اَلْمَسْجِدُ بَيْتُ اللّٰهِ.',                      'মসজিদ আল্লাহর ঘর।',                    '৭৯'),
  khayr_sharr:    T('فِي الْمَسْجِدِ خَيْرٌ وَفِي السُّوقِ شَرٌّ.',      'মসজিদে কল্যাণ আছে এবং বাজারে অকল্যাণ।', '৭৯'),
  madrasa_saghira:T('تِلْكَ مَدْرَسَةٌ صَغِيرَةٌ.',                      'ওটি ছোট মাদরাসা।',                     '৭৯'),
  madrasat_qarya: T('تِلْكَ مَدْرَسَةُ الْقَرْيَةِ.',                    'ওটি গ্রামের মাদরাসা।',                  '৭৯'),
  ism_madrasa:    T('اِسْمُ الْمَدْرَسَةِ مِفْتَاحُ الْقُرْآنِ.',        'মাদরাসার নাম মিফতাহুল কুরআন।',        '৭৯'),
  maktaba_saghira:T('فِي هٰذِهِ الْمَدْرَسَةِ مَكْتَبَةٌ صَغِيرَةٌ.',    'এই মাদরাসায় ছোট একটি পাঠাগার আছে।',   '৭৯'),
  kitab_qayyim:   T('فِي مَكْتَبَةِ الْمَدْرَسَةِ كِتَابٌ قَيِّمٌ وَهُوَ كِتَابُ الْحَدِيثِ.', 'মাদরাসার পাঠাগারে একটি মূল্যবান বই আছে, তা হাদীসের কিতাব।', '৭৯'),
  bayt_majid:     T('هَذَا بَيْتُ مَاجِدٍ.',                              'এটি মাজেদের বাড়ি।',                    '৭৯'),
  bayt_jadid:     T('بَيْتُ مَاجِدٍ جَدِيدٌ.',                            'মাজেদের বাড়ি নতুন।',                   '৭৯'),
  manzar_bayt:    T('مَنْظَرُ الْبَيْتِ جَمِيلٌ جِدًّا.',                 'বাড়ির দৃশ্য খুব সুন্দর।',             '৭৯'),
  bab_bayt:       T('بَابُ الْبَيْتِ مَفْتُوحٌ.',                          'বাড়ির দরজা খোলা।',                    '৮০'),
  majid_tajir:    T('هُوَ تَاجِرُ الْمَدِينَةِ وَدُكَّانُهُ فِي سُوقِ الْقَرْيَةِ.', 'সে শহরের ব্যবসায়ী এবং তার দোকান গ্রামের বাজারে।', '৮০'),
  saqf_bayt:      T('سَقْفُ الْبَيْتِ جَمِيلٌ وَفَوْقَ السَّقْفِ عَلَمٌ.', 'বাড়ির ছাদ সুন্দর এবং ছাদের উপর পতাকা আছে।', '৮০'),
  kitab_arabi:    T('هَذَا كِتَابٌ عَرَبِيٌّ.',                            'এটি আরবী বই।',                         '৮০'),
  kitab_qissa:    T('فِي هَذَا الْكِتَابِ قِصَّةٌ جَمِيلَةٌ.',            'এই বইয়ে সুন্দর একটি গল্প আছে।',       '৮০'),
  ism_qissa:      T('اِسْمُ الْقِصَّةِ "اَلْفَأْرُ وَالْأَسَدُ".',        'গল্পের নাম "ইঁদুর ও সিংহ"।',           '৮০'),
  hujrat_muallim: T('تِلْكَ حُجْرَةُ الْمُعَلِّمِ وَحُجْرَتُهُ وَاسِعَةٌ وَنَظِيفَةٌ.', 'ওটি শিক্ষকের কামরা, তার কামরা প্রশস্ত ও পরিচ্ছন্ন।', '৮০'),
  bab_hujra:      T('بَابُ الْحُجْرَةِ مَفْتُوحٌ وَنَافِذَتُهَا مُغْلَقَةٌ.', 'কামরার দরজা খোলা এবং তার জানালা বন্ধ।', '৮০'),
  sarir_minda:    T('فِي حُجْرَةِ الْمُعَلِّمِ سَرِيرٌ وَمِنْضَدَةٌ.',     'শিক্ষকের কামরায় একটি খাট ও একটি ছোট টেবিল আছে।', '৮০'),
  kitab_qalam:    T('اَلْكِتَابُ وَالْقَلَمُ فَوْقَ الْمِنْضَدَةِ.',      'বই ও কলম ছোট টেবিলের উপর।',            '৮০'),
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
    id: 'l15-words', titleBn: 'নতুন শব্দ', shortTitle: 'শব্দার্থ',
    titleAr: 'الْمُفْرَدَاتُ', desc: 'কল্যাণ, অকল্যাণ, মূল্যবান, পাঠাগার, ছাদ, সিংহ, ইঁদুর',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৭৯–৮০',
    steps: [
      intro(W.khayr), intro(W.sharr), intro(W.qayyim), intro(W.maktaba),
      intro(W.saqf), intro(W.asad), intro(W.fa),
      match([W.khayr, W.sharr, W.qayyim, W.maktaba]),
      match([W.saqf, W.asad, W.fa, W.qayyim]),
      mcqWord(W.sharr, ['কল্যাণ', 'ছাদ']),
      arabicOf(W.maktaba, ['سَقْفٌ', 'فَأْرٌ']),
    ],
  },
  {
    id: 'l15-masjid', titleBn: 'মসজিদ ও মাদরাসার বাক্য', shortTitle: 'মসজিদ-মাদরাসা',
    titleAr: 'الْمَسْجِدُ وَالْمَدْرَسَةُ', desc: 'ইযাফত: مَسْجِدُ الْعَاصِمَةِ, مَدْرَسَةُ الْقَرْيَةِ',
    iconName: 'Zap', color: 'violet', estMinutes: 5, bookPages: '৭৯',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: ইযাফত (সম্বন্ধ)',
        table: [
          { label: 'মসজিদ', arabic: 'مَسْجِدٌ', bangla: 'একটি মসজিদ' },
          { label: 'সম্বন্ধ', arabic: 'مَسْجِدُ الْعَاصِمَةِ', bangla: 'রাজধানীর মসজিদ' },
          { label: 'মাদরাসা', arabic: 'مَدْرَسَةُ الْقَرْيَةِ', bangla: 'গ্রামের মাদরাসা' },
        ],
      },
      introSentence(SENT.masjid_jamil), introSentence(SENT.masjid_asima), introSentence(SENT.masjid_kabir),
      introSentence(SENT.ism_masjid), introSentence(SENT.amam_hadiqa), introSentence(SENT.masjid_baytullah),
      introSentence(SENT.khayr_sharr),
      mcqWord({ arabic: 'ذَلِكَ مَسْجِدُ الْعَاصِمَةِ.', bangla: 'ওটি রাজধানীর মসজিদ।' }, ['ওটি গ্রামের মসজিদ।', 'ওটি সুন্দর মসজিদ।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('ذَلِكَ مَسْجِدُ ___.', 'الْعَاصِمَةِ', ['الْعَاصِمَةُ', 'عَاصِمَةٌ'], 'রাজধানীর মসজিদ'),
      sentenceBuilder(SENT.masjid_asima, ['هَذَا', 'الْقَرْيَةِ', 'أَمْ']),
      sentenceBuilder(SENT.masjid_baytullah, ['مَدْرَسَةٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l15-madrasa', titleBn: 'মাদরাসা ও পাঠাগার', shortTitle: 'মাদরাসা',
    titleAr: 'الْمَدْرَسَةُ وَالْمَكْتَبَةُ', desc: 'গ্রামের মাদরাসা, মাদরাসার পাঠাগার',
    iconName: 'Star', color: 'teal', estMinutes: 4, bookPages: '৭৯',
    steps: [
      introSentence(SENT.madrasa_saghira), introSentence(SENT.madrasat_qarya), introSentence(SENT.ism_madrasa),
      introSentence(SENT.maktaba_saghira), introSentence(SENT.kitab_qayyim),
      mcqWord({ arabic: 'تِلْكَ مَدْرَسَةُ الْقَرْيَةِ.', bangla: 'ওটি গ্রামের মাদরাসা।' }, ['ওটি শহরের মাদরাসা।', 'ওটি ছোট মাদরাসা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('فِي هٰذِهِ الْمَدْرَسَةِ ___ صَغِيرَةٌ.', 'مَكْتَبَةٌ', ['سَقْفٌ', 'أَسَدٌ'], 'পাঠাগার = ?'),
      sentenceBuilder(SENT.madrasat_qarya, ['الْمَدِينَةِ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.maktaba_saghira, ['كَبِيرٌ', 'ذَلِكَ', 'أَمْ']),
    ],
  },
  {
    id: 'l15-bayt', titleBn: 'বাড়ি ও দোকানের বাক্য', shortTitle: 'বাড়ি',
    titleAr: 'الْبَيْتُ وَالدُّكَّانُ', desc: 'মাজেদের বাড়ি, বাড়ির দরজা ও ছাদ',
    iconName: 'MessageCircle', color: 'orange', estMinutes: 4, bookPages: '৭৯–৮০',
    steps: [
      introSentence(SENT.bayt_majid), introSentence(SENT.bayt_jadid), introSentence(SENT.manzar_bayt),
      introSentence(SENT.bab_bayt), introSentence(SENT.majid_tajir), introSentence(SENT.saqf_bayt),
      mcqWord({ arabic: 'بَابُ الْبَيْتِ مَفْتُوحٌ.', bangla: 'বাড়ির দরজা খোলা।' }, ['বাড়ির দরজা বন্ধ।', 'বাড়ির ছাদ খোলা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('بَابُ ___ مَفْتُوحٌ.', 'الْبَيْتِ', ['الْبَيْتُ', 'بَيْتٌ'], 'বাড়ির দরজা'),
      sentenceBuilder(SENT.bab_bayt, ['مُغْلَقٌ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.bayt_jadid, ['قَدِيمٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l15-kitab-hujra', titleBn: 'বই ও শিক্ষকের কামরা', shortTitle: 'বই-কামরা',
    titleAr: 'الْكِتَابُ وَالْحُجْرَةُ', desc: 'আরবী বই, ইঁদুর ও সিংহের গল্প, শিক্ষকের কামরা',
    iconName: 'Sparkles', color: 'cyan', estMinutes: 4, bookPages: '৮০',
    steps: [
      introSentence(SENT.kitab_arabi), introSentence(SENT.kitab_qissa), introSentence(SENT.ism_qissa),
      introSentence(SENT.hujrat_muallim), introSentence(SENT.bab_hujra), introSentence(SENT.sarir_minda),
      introSentence(SENT.kitab_qalam),
      mcqWord({ arabic: 'بَابُ الْحُجْرَةِ مَفْتُوحٌ وَنَافِذَتُهَا مُغْلَقَةٌ.', bangla: 'কামরার দরজা খোলা এবং তার জানালা বন্ধ।' }, ['কামরার দরজা বন্ধ এবং তার জানালা খোলা।', 'কামরার দরজা ও জানালা খোলা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('فِي حُجْرَةِ الْمُعَلِّمِ سَرِيرٌ وَ___.', 'مِنْضَدَةٌ', ['سَقْفٌ', 'أَسَدٌ'], 'ছোট টেবিল = ?'),
      sentenceBuilder(SENT.kitab_qalam, ['تَحْتَ', 'هَذِهِ', 'أَمْ']),
    ],
  },
  {
    id: 'l15-tamrin', titleBn: 'তামরীন ১: ছবি দেখে প্রশ্নের উত্তর দাও', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينُ الْأَوَّلُ', desc: 'কিতাবের প্রশ্নগুলো পড়ো ও অর্থ বলো',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৮০–৮২',
    steps: [
      introSentence(T('هَلْ ذَلِكَ مَسْجِدٌ جَمِيلٌ؟', 'ওটি কি সুন্দর মসজিদ?', '৮০')),
      introSentence(T('مَا اسْمُ الْمَسْجِدِ؟', 'মসজিদের নাম কী?', '৮০')),
      introSentence(T('أَ مَسْجِدُ الْقَرْيَةِ ذَلِكَ أَمْ مَسْجِدُ الْعَاصِمَةِ؟', 'ওটি কি গ্রামের মসজিদ না রাজধানীর মসজিদ?', '৮০')),
      introSentence(T('هَلِ الْمَسْجِدُ بَيْتُ اللّٰهِ؟', 'মসজিদ কি আল্লাহর ঘর?', '৮১')),
      introSentence(T('مَاذَا أَمَامَ الْمَسْجِدِ؟ أَيْنَ الْحَدِيقَةُ؟', 'মসজিদের সামনে কী আছে? বাগান কোথায়?', '৮১')),
      introSentence(T('بَيْتُ مَنْ هَذَا؟', 'এটি কার বাড়ি?', '৮১')),
      introSentence(T('أَ كِتَابٌ عَرَبِيٌّ هَذَا أَمْ كِتَابٌ بَنْغَالِيٌّ؟', 'এটি কি আরবী বই না বাংলা বই?', '৮১')),
      introSentence(T('كَيْفَ حُجْرَةُ الْمُعَلِّمِ؟', 'শিক্ষকের কামরা কেমন?', '৮২')),
      introSentence(T('أَ وَاسِعَةٌ حُجْرَتُهُ أَمْ ضَيِّقَةٌ؟', 'তার কামরা কি প্রশস্ত না সংকীর্ণ?', '৮২')),
      introSentence(T('أَ كِتَابٌ فَوْقَ الْمِنْضَدَةِ أَمْ كُرَّاسَةٌ؟', 'ছোট টেবিলের উপর কি বই না খাতা?', '৮২')),
      match([W.khayr, W.sharr, W.qayyim, W.maktaba], 'শেষ পর্যালোচনা'),
    ],
  },
  {
    id: 'l15-mudari', titleBn: 'মুযারী ক্রিয়া: يَفْعَلُ (শুধু মুখস্থের জন্য)', shortTitle: 'মুযারী',
    titleAr: 'الْفِعْلُ الْمُضَارِعُ', desc: 'সে করবে/করছে/করে, তুমি, আমি',
    iconName: 'Trophy', color: 'rose', estMinutes: 5, bookPages: '৮২–৮৩',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: فَعَلَ → يَفْعَلُ',
        table: [
          { label: 'সে (পুং.)', arabic: 'يَفْعَلُ', bangla: 'সে করবে, করছে, করে' },
          { label: 'সে (স্ত্রী.)/তুমি (পুং.)', arabic: 'تَفْعَلُ', bangla: 'সে/তুমি করবে, করছো, করো' },
          { label: 'তুমি (স্ত্রী.)', arabic: 'تَفْعَلِينَ', bangla: 'তুমি করবে, করছো, করো' },
          { label: 'আমি', arabic: 'أَفْعَلُ', bangla: 'আমি করব, করছি, করি' },
        ],
      },
      introSentence(T('يَخْرُجُ — تَخْرُجُ — تَخْرُجِينَ — أَخْرُجُ', 'বের হয় — তুমি বের হও — তুমি (স্ত্রী.) বের হও — আমি বের হই', '৮২')),
      introSentence(T('يَذْهَبُ — تَذْهَبُ — تَذْهَبِينَ — أَذْهَبُ', 'যায় — তুমি যাও — তুমি (স্ত্রী.) যাও — আমি যাই', '৮২')),
      introSentence(T('يَجْلِسُ — تَجْلِسُ — تَجْلِسِينَ — أَجْلِسُ', 'বসে — তুমি বসো — তুমি (স্ত্রী.) বসো — আমি বসি', '৮৩')),
      introSentence(T('يَقْرَأُ — تَقْرَأُ — تَقْرَئِينَ — أَقْرَأُ', 'পড়ে — তুমি পড়ো — তুমি (স্ত্রী.) পড়ো — আমি পড়ি', '৮৩')),
      introSentence(T('يَكْتُبُ — تَكْتُبُ — تَكْتُبِينَ — أَكْتُبُ', 'লেখে — তুমি লেখো — তুমি (স্ত্রী.) লেখো — আমি লিখি', '৮৩')),
      introSentence(T('يَرْجِعُ — تَرْجِعُ — تَرْجِعِينَ — أَرْجِعُ', 'ফিরে — তুমি ফেরো — তুমি (স্ত্রী.) ফেরো — আমি ফিরি', '৮৩')),
      introSentence(T('يَلْعَبُ — تَلْعَبُ — تَلْعَبِينَ — أَلْعَبُ', 'খেলে — তুমি খেলো — তুমি (স্ত্রী.) খেলো — আমি খেলি', '৮৩')),
      mcqWord({ arabic: 'أَذْهَبُ', bangla: 'আমি যাই' }, ['সে যায়', 'তুমি যাও'], 'অর্থ কী?'),
      mcqWord({ arabic: 'يَقْرَأُ', bangla: 'সে পড়ে' }, ['আমি পড়ি', 'তুমি পড়ো'], 'অর্থ কী?'),
      mcqWord({ arabic: 'تَكْتُبِينَ', bangla: 'তুমি (স্ত্রী.) লেখো' }, ['আমি লিখি', 'সে লেখে'], 'অর্থ কী?'),
    ],
  },
];

const qaida = [{
  id: 'l15-q-idafa', stageId: 'l15-masjid',
  title: 'ইযাফত: مَسْجِدُ الْعَاصِمَةِ',
  table: [
    { arabic: 'مَسْجِدُ الْعَاصِمَةِ', bangla: 'রাজধানীর মসজিদ' },
    { arabic: 'مَدْرَسَةُ الْقَرْيَةِ', bangla: 'গ্রামের মাদরাসা' },
    { arabic: 'بَابُ الْبَيْتِ', bangla: 'বাড়ির দরজা' },
  ],
  rule: 'দুটি শব্দ পরপর বসে সম্বন্ধ বোঝালে প্রথম শব্দে "আমার/-এর" অর্থ আসে; দ্বিতীয় শব্দে ال থাকে।',
  examples: [{ arabic: 'سَقْفُ الْبَيْتِ', bangla: 'বাড়ির ছাদ' }],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'ছবি দেখে প্রশ্নের উত্তর দাও', arabic: 'أَ مَسْجِدُ الْقَرْيَةِ ذَلِكَ أَمْ مَسْجِدُ الْعَاصِمَةِ؟', bangla: 'ওটি কি গ্রামের মসজিদ না রাজধানীর মসজিদ?', mode: 'ar-to-bn', page: '৮০' },
  { task: 'ছবি দেখে প্রশ্নের উত্তর দাও', arabic: 'كَيْفَ حُجْرَةُ الْمُعَلِّمِ؟', bangla: 'শিক্ষকের কামরা কেমন?', mode: 'ar-to-bn', page: '৮২' },
];
const quizLegacy = [
  { question: "'خَيْرٌ' অর্থ কী?", options: ['কল্যাণ', 'অকল্যাণ', 'ছাদ'], correctIndex: 0, correctAnswer: 0, explanation: 'খাইর = কল্যাণ।', type: 'mcq' },
  { question: "'مَسْجِدُ الْعَاصِمَةِ' অর্থ?", options: ['রাজধানীর মসজিদ', 'গ্রামের মসজিদ', 'সুন্দর মসজিদ'], correctIndex: 0, correctAnswer: 0, explanation: 'ইযাফত।', type: 'mcq' },
  { question: "'سَقْفٌ' অর্থ?", options: ['ছাদ', 'দরজা', 'জানালা'], correctIndex: 0, correctAnswer: 0, explanation: 'সাকফ = ছাদ।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l6',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৭৯-৮৩', qaida,
    grammarRule: { title: 'ক্রিয়ার মাদী রূপ', summary: 'সে = فَعَلَ, তুমি = فَعَلْتَ, আমি = فَعَلْتُ।', points: ['ذَهَبَ = সে গেছে', 'ذَهَبْتَ = তুমি গেছ', 'ذَهَبْتُ = আমি গেছি'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};