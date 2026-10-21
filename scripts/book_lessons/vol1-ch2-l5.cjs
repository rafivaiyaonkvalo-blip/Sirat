// vol1-ch2-l5.cjs  |  দারস ৫ — ২য় অধ্যায়  |  পৃষ্ঠা ৭২–৭৬
// বিষয়: সম্বন্ধবাচক যমীর (আমার/তোমার), পারিবারিক শব্দ, দেহাবয়বের শব্দ

const W = {
  lawn:   { arabic: 'لَوْنٌ',       bangla: 'রং' },
  wajh:   { arabic: 'وَجْهٌ',       bangla: 'মুখ, চেহারা' },
  ayn:    { arabic: 'عَيْنٌ',       bangla: 'চোখ, চক্ষু' },
  batn:   { arabic: 'بَطْنٌ',       bangla: 'পেট' },
  shar:   { arabic: 'شَعْرٌ',       bangla: 'চুল' },
  anf:    { arabic: 'أَنْفٌ',       bangla: 'নাক' },
  khadd:  { arabic: 'خَدٌّ',        bangla: 'গাল' },
  zahr:   { arabic: 'ظَهْرٌ',       bangla: 'পিঠ' },
  raiha:  { arabic: 'رَائِحَةٌ',    bangla: 'ঘ্রাণ, গন্ধ' },
  mizana: { arabic: 'مِئْذَنَةٌ',   bangla: 'আযানখানা' },
  abd:    { arabic: 'عَبْدٌ',       bangla: 'বান্দা, দাস' },
  zamil:  { arabic: 'زَمِيلٌ',      bangla: 'সহপাঠী' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  // সাহেদ তার বন্ধু মাজেদকে লক্ষ্য করে বলছে (পৃ. ৭৩)
  sadiqi:      T('أَنْتَ صَدِيقِي وَأَنَا صَدِيقُكَ.',             'তুমি আমার বন্ধু এবং আমি তোমার বন্ধু।',          '৭৩'),
  ismi_shahid: T('اِسْمِي شَاهِدٌ وَاسْمُكَ مَاجِدٌ.',              'আমার নাম শাহেদ এবং তোমার নাম মাজেদ।',          '৭৩'),
  ana_fallah:  T('أَنَا فَلَّاحُ الْقَرْيَةِ وَأَنْتَ تَاجِرُ الْمَدِينَةِ.', 'আমি গ্রামের কৃষক এবং তুমি শহরের ব্যবসায়ী।', '৭৩'),
  hadha_bayti: T('هَذَا بَيْتِي وَذَلِكَ بَيْتُكَ.',               'এটি আমার বাড়ি এবং ওটি তোমার বাড়ি।',            '৭৩'),
  bayti_qadim: T('بَيْتِي قَدِيمٌ وَبَيْتُكَ جَدِيدٌ.',            'আমার বাড়ি পুরনো এবং তোমার বাড়ি নতুন।',        '৭৩'),
  saati:       T('هَذِهِ سَاعَتِي وَتِلْكَ سَاعَتُكَ.',             'এটি আমার ঘড়ি এবং ওটি তোমার ঘড়ি।',              '৭৩'),
  saati_rakhisa:T('سَاعَتِي رَخِيصَةٌ وَسَاعَتُكَ غَالِيَةٌ.',     'আমার ঘড়ি সস্তা এবং তোমার ঘড়ি দামী।',          '৭৩'),
  sayyara_khalid:T('تِلْكَ سَيَّارَةُ خَالِدٍ وَهُوَ عَمِّي.',     'ওটি খালেদের গাড়ি এবং তিনি আমার চাচা।',        '৭৩'),
  sayyaratuhu: T('سَيَّارَتُهُ جَمِيلَةٌ وَلَوْنُهَا جَمِيلٌ.',    'তার গাড়ি সুন্দর এবং তার রং সুন্দর।',            '৭৩'),
  // সাহেদ তার আম্মাকে লক্ষ্য করে বলছে
  anti_tayyiba:T('أَنْتِ امْرَأَةٌ طَيِّبَةٌ وَاسْمُكِ خَدِيجَةُ.', 'তুমি ভালো নারী এবং তোমার নাম খাদীজা।',          '৭৩'),
  anti_ummi:   T('أَنْتِ أُمِّي وَأَنَا ابْنُكِ.',                  'তুমি আমার মা এবং আমি তোমার ছেলে।',              '৭৩'),
  fatima_bintuki:T('فَاطِمَةُ بِنْتُكِ وَعَائِشَةُ أُخْتُكِ.',     'ফাতেমা তোমার মেয়ে এবং আয়েশা তোমার বোন।',      '৭৩'),
  ghurfatuki:  T('هَذِهِ غُرْفَتُكِ وَفِي غُرْفَتِكِ سَرِيرٌ.',     'এটি তোমার কামরা এবং তোমার কামরায় খাট আছে।',     '৭৩'),
  sarirki:     T('سَرِيرُكِ جَدِيدٌ وَفِرَاشُكِ نَظِيفٌ.',          'তোমার খাট নতুন এবং তোমার বিছানা পরিচ্ছন্ন।',     '৭৩'),
  mahmud_abuki:T('مَحْمُودٌ أَبُوكِ وَجَدِّي.',                     'মাহমূদ তোমার বাবা এবং আমার দাদা।',               '৭৩'),
  // আয়েশা তার বান্ধবী ফাতেমা সম্পর্কে বলছে (পৃ. ৭৪)
  fatima_sadiqati:T('فَاطِمَةُ صَدِيقَتِي وَأَنَا صَدِيقَتُهَا.',   'ফাতেমা আমার বান্ধবী এবং আমি তার বান্ধবী।',      '৭৪'),
  libasuha:    T('لِبَاسُهَا نَظِيفٌ وَشَعْرُهَا طَوِيلٌ.',         'তার পোশাক পরিচ্ছন্ন এবং তার চুল লম্বা।',         '৭৪'),
  lawnuhu:     T('شَعْرُهَا طَوِيلٌ وَلَوْنُهُ جَمِيلٌ.',           'তার চুল লম্বা এবং তার রং সুন্দর।',                '৭৪'),
  saatuha:     T('هَذِهِ سَاعَتُهَا وَتِلْكَ نَظَّارَتُهَا.',       'এটি তার ঘড়ি এবং ওটি তার চশমা।',                  '৭৪'),
  iqduha:      T('عِقْدُهَا فِي هَذَا الصُّنْدُوقِ.',               'তার হার এই সিন্দুকে আছে।',                         '৭৪'),
  // খালেদ তার শিক্ষক মাজেদ সম্পর্কে বলছে
  majid_muallim:T('مَاجِدٌ مُعَلِّمٌ جَيِّدٌ وَهُوَ مُعَلِّمِي.',  'মাজেদ ভালো শিক্ষক এবং তিনি আমার শিক্ষক।',       '৭৪'),
  ana_tilmiduh:T('هُوَ مُعَلِّمِي وَأَنَا تِلْمِيذُهُ.',            'তিনি আমার শিক্ষক এবং আমি তার ছাত্র।',            '৭৪'),
  baytuhu:     T('ذَلِكَ بَيْتُهُ وَبَيْتُهُ جَدِيدٌ وَجَمِيلٌ.',   'ওটি তার বাড়ি এবং তার বাড়ি নতুন ও সুন্দর।',    '৭৪'),
  saatuhu:     T('هَذِهِ سَاعَتُهُ وَتِلْكَ حَقِيبَتُهُ.',          'এটি তার ঘড়ি এবং ওটি তার ব্যাগ।',                '৭৪'),
  waladuhu:    T('وَلَدُهُ زَمِيلِي وَهُوَ تِلْمِيذٌ ذَكِيٌّ.',    'তার ছেলে আমার সহপাঠী এবং সে মেধাবী ছাত্র।',      '৭৪'),
  miftah_jaybih:T('مِفْتَاحُ السَّيَّارَةِ فِي جَيْبِهِ.',         'গাড়ির চাবি তার পকেটে।',                           '৭৪'),
  allah_rabbi: T('اَللّٰهُ رَبِّي وَأَنَا عَبْدُهُ.',                 'আল্লাহ আমার রব এবং আমি তাঁর বান্দা।',            '৭৫'),
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
    id: 'l14-words-body', titleBn: 'শরীরের ও আরও শব্দ', shortTitle: 'শব্দার্থ ১',
    titleAr: 'الْمُفْرَدَاتُ (١)', desc: 'রং, মুখ, চোখ, পেট, চুল, নাক, গাল, পিঠ',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৭৩',
    steps: [
      intro(W.lawn), intro(W.wajh), intro(W.ayn), intro(W.batn),
      intro(W.shar), intro(W.anf), intro(W.khadd), intro(W.zahr),
      match([W.lawn, W.wajh, W.ayn, W.batn]),
      match([W.shar, W.anf, W.khadd, W.zahr]),
      mcqWord(W.batn, ['পিঠ', 'মুখ']),
      arabicOf(W.ayn, ['أَنْفٌ', 'خَدٌّ']),
    ],
  },
  {
    id: 'l14-words-2', titleBn: 'আরও কয়েকটি শব্দ', shortTitle: 'শব্দার্থ ২',
    titleAr: 'الْمُفْرَدَاتُ (٢)', desc: 'ঘ্রাণ, আযানখানা, বান্দা, সহপাঠী',
    iconName: 'Star', color: 'teal', estMinutes: 2, bookPages: '৭৪',
    steps: [
      intro(W.raiha), intro(W.mizana), intro(W.abd), intro(W.zamil),
      match([W.raiha, W.mizana, W.abd, W.zamil]),
      mcqWord(W.zamil, ['বান্দা', 'ঘ্রাণ']),
      arabicOf(W.abd, ['زَمِيلٌ', 'رَائِحَةٌ']),
    ],
  },
  {
    id: 'l14-zameer-sambandh', titleBn: 'আমার/তোমার (সাহেদ ও মাজেদ)', shortTitle: 'আমার/তোমার',
    titleAr: 'يَاءُ الْمُتَكَلِّمِ وَكَافُ الْمُخَاطَبِ', desc: 'ـي = আমার, ـكَ = তোমার',
    iconName: 'Zap', color: 'violet', estMinutes: 4, bookPages: '৭৩',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: আমার/তোমার',
        table: [
          { label: 'আমার', arabic: 'هَذَا بَيْتِي', bangla: 'এটি আমার বাড়ি' },
          { label: 'তোমার', arabic: 'وَذَلِكَ بَيْتُكَ', bangla: 'আর ওটি তোমার বাড়ি' },
        ],
      },
      introSentence(SENT.sadiqi), introSentence(SENT.ismi_shahid), introSentence(SENT.ana_fallah),
      introSentence(SENT.hadha_bayti), introSentence(SENT.bayti_qadim), introSentence(SENT.saati),
      introSentence(SENT.saati_rakhisa), introSentence(SENT.sayyara_khalid), introSentence(SENT.sayyaratuhu),
      mcqWord({ arabic: 'هَذَا بَيْتِي وَذَلِكَ بَيْتُكَ.', bangla: 'এটি আমার বাড়ি এবং ওটি তোমার বাড়ি।' },
              ['এটি তোমার বাড়ি এবং ওটি আমার বাড়ি।', 'এটি তার বাড়ি এবং ওটি আমার বাড়ি।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('هَذِهِ سَاعَتِي وَتِلْكَ ___.', 'سَاعَتُكَ', ['سَاعَتِي', 'سَاعَتُهُ'], 'ওটি তোমার ঘড়ি = ?'),
      sentenceBuilder(SENT.sadiqi, ['صَدِيقُهُ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.saati, ['بَيْتِي', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l14-zameer-ki', titleBn: 'তোমার (স্ত্রী.) — মায়ের প্রতি', shortTitle: 'তোমার (স্ত্রী.)',
    titleAr: 'كَافُ الْمُخَاطَبَةِ', desc: 'ـكِ = তোমার (নারীকে লক্ষ্য করে)',
    iconName: 'MessageCircle', color: 'orange', estMinutes: 4, bookPages: '৭৩–৭৪',
    steps: [
      introSentence(SENT.anti_tayyiba), introSentence(SENT.anti_ummi), introSentence(SENT.fatima_bintuki),
      introSentence(SENT.ghurfatuki), introSentence(SENT.sarirki), introSentence(SENT.mahmud_abuki),
      mcqWord({ arabic: 'أَنْتِ أُمِّي وَأَنَا ابْنُكِ.', bangla: 'তুমি আমার মা এবং আমি তোমার ছেলে।' },
              ['তুমি আমার বোন এবং আমি তোমার ভাই।', 'আপনি আমার খালা এবং আমি আপনার ছেলে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('سَرِيرُكِ جَدِيدٌ وَفِرَاشُكِ ___.', 'نَظِيفٌ', ['مُغْلَقٌ', 'حَارٌّ'], 'পরিচ্ছন্ন = ?'),
      sentenceBuilder(SENT.anti_ummi, ['أَبُوكِ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.ghurfatuki, ['سَرِيرٌ', 'ذَلِكَ', 'أَمْ']),
    ],
  },
  {
    id: 'l14-zameer-ha', titleBn: 'তার (স্ত্রী.) — আয়েশা ও ফাতেমা', shortTitle: 'তার (স্ত্রী.)',
    titleAr: 'هَاءُ الْغَائِبَةِ', desc: 'ـهَا = তার (নারী)',
    iconName: 'Sparkles', color: 'pink', estMinutes: 4, bookPages: '৭৪',
    steps: [
      introSentence(SENT.fatima_sadiqati), introSentence(SENT.libasuha), introSentence(SENT.lawnuhu),
      introSentence(SENT.saatuha), introSentence(SENT.iqduha),
      mcqWord({ arabic: 'شَعْرُهَا طَوِيلٌ وَلَوْنُهُ جَمِيلٌ.', bangla: 'তার চুল লম্বা এবং তার রং সুন্দর।' },
              ['তার চুল খাটো এবং তার রং সুন্দর।', 'তার চোখ সুন্দর এবং তার রং লম্বা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('هَذِهِ سَاعَتُهَا وَتِلْكَ ___.', 'نَظَّارَتُهَا', ['نَظَّارَتُهُ', 'نَظَّارَتُكَ'], 'ওটি তার (নারী) চশমা = ?'),
      sentenceBuilder(SENT.saatuha, ['سَاعَتِي', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.fatima_sadiqati, ['صَدِيقِي', 'هِيَ', 'أَمْ']),
    ],
  },
  {
    id: 'l14-zameer-hu', titleBn: 'তার (পুং.) — খালেদ ও শিক্ষক', shortTitle: 'তার (পুং.)',
    titleAr: 'هَاءُ الْغَائِبِ', desc: 'ـهُ = তার (পুরুষ)',
    iconName: 'Trophy', color: 'cyan', estMinutes: 4, bookPages: '৭৪',
    steps: [
      introSentence(SENT.majid_muallim), introSentence(SENT.ana_tilmiduh), introSentence(SENT.baytuhu),
      introSentence(SENT.saatuhu), introSentence(SENT.waladuhu), introSentence(SENT.miftah_jaybih),
      introSentence(SENT.allah_rabbi),
      mcqWord({ arabic: 'هُوَ مُعَلِّمِي وَأَنَا تِلْمِيذُهُ.', bangla: 'তিনি আমার শিক্ষক এবং আমি তার ছাত্র।' },
              ['তিনি আমার ছাত্র এবং আমি তার শিক্ষক।', 'তিনি তোমার শিক্ষক এবং আমি তার ছাত্র।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('ذَلِكَ بَيْتُهُ وَبَيْتُهُ جَدِيدٌ وَ___.', 'جَمِيلٌ', ['جَمِيلَةٌ', 'قَصِيرٌ'], 'সুন্দর (পুং.) = ?'),
      sentenceBuilder(SENT.ana_tilmiduh, ['مُعَلِّمُهُ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.miftah_jaybih, ['بَابِهِ', 'هَلْ', 'أَمْ']),
    ],
  },
  {
    id: 'l14-madi', titleBn: 'মাযী ক্রিয়া: فَعَلَ (শুধু মুখস্থের জন্য)', shortTitle: 'মাযী ক্রিয়া',
    titleAr: 'الْفِعْلُ الْمَاضِي', desc: 'সে/তুমি/আমি করেছি — ছয়টি ক্রিয়া',
    iconName: 'Trophy', color: 'rose', estMinutes: 5, bookPages: '৭৭–৭৮',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: فَعَلَ',
        table: [
          { label: 'সে (পুং.)', arabic: 'فَعَلَ', bangla: 'সে করেছে, করল' },
          { label: 'সে (স্ত্রী.)', arabic: 'فَعَلَتْ', bangla: 'সে (নারী) করেছে, করল' },
          { label: 'তুমি (পুং.)', arabic: 'فَعَلْتَ', bangla: 'তুমি করেছো, করলে' },
          { label: 'তুমি (স্ত্রী.)', arabic: 'فَعَلْتِ', bangla: 'তুমি (নারী) করেছো, করলে' },
          { label: 'আমি', arabic: 'فَعَلْتُ', bangla: 'আমি করেছি, করলাম' },
        ],
      },
      introSentence(T('خَرَجَ — خَرَجَتْ — خَرَجْتَ — خَرَجْتِ — خَرَجْتُ', 'সে বের হয়েছে — সে (নারী) — তুমি — তুমি (নারী) — আমি বের হয়েছি', '৭৭')),
      introSentence(T('ذَهَبَ — ذَهَبَتْ — ذَهَبْتَ — ذَهَبْتِ — ذَهَبْتُ', 'সে গিয়েছে — সে (নারী) — তুমি — তুমি (নারী) — আমি গিয়েছি', '৭৭')),
      introSentence(T('جَلَسَ — جَلَسَتْ — جَلَسْتَ — جَلَسْتِ — جَلَسْتُ', 'সে বসেছে — সে (নারী) — তুমি — তুমি (নারী) — আমি বসেছি', '৭৭')),
      introSentence(T('قَرَأَ — قَرَأَتْ — قَرَأْتَ — قَرَأْتِ — قَرَأْتُ', 'সে পড়েছে — সে (নারী) — তুমি — তুমি (নারী) — আমি পড়েছি', '৭৭')),
      introSentence(T('كَتَبَ — كَتَبَتْ — كَتَبْتَ — كَتَبْتِ — كَتَبْتُ', 'সে লিখেছে — সে (নারী) — তুমি — তুমি (নারী) — আমি লিখেছি', '৭৮')),
      introSentence(T('رَجَعَ — رَجَعَتْ — رَجَعْتَ — رَجَعْتِ — رَجَعْتُ', 'সে ফিরেছে — সে (নারী) — তুমি — তুমি (নারী) — আমি ফিরেছি', '৭৮')),
      introSentence(T('لَعِبَ — لَعِبَتْ — لَعِبْتَ — لَعِبْتِ — لَعِبْتُ', 'সে খেলেছে — সে (নারী) — তুমি — তুমি (নারী) — আমি খেলেছি', '৭৮')),
      mcqWord({ arabic: 'ذَهَبْتُ', bangla: 'আমি গিয়েছি' }, ['সে গিয়েছে', 'তুমি গিয়েছো'], 'অর্থ কী?'),
      mcqWord({ arabic: 'كَتَبَتْ', bangla: 'সে (নারী) লিখেছে' }, ['আমি লিখেছি', 'সে (পুরুষ) লিখেছে'], 'অর্থ কী?'),
      mcqWord({ arabic: 'قَرَأْتَ', bangla: 'তুমি পড়েছো' }, ['আমি পড়েছি', 'সে পড়েছে'], 'অর্থ কী?'),
    ],
  },
  {
    id: 'l14-tamrin', titleBn: 'তামরীন ও মিশ্র চর্চা', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينَاتُ', desc: 'তামরীন ১: শূন্যস্থানে উপযুক্ত যমীর যোগ করো',
    iconName: 'PenLine', color: 'amber', estMinutes: 4, bookPages: '৭৪–৭৫',
    steps: [
      introSentence(T('هَذِهِ زَهْرَةٌ جَمِيلَةٌ ، لَوْنُهَا جَمِيلٌ وَرَائِحَتُهَا طَيِّبَةٌ.', 'এটি সুন্দর ফুল, তার রং সুন্দর এবং তার ঘ্রাণ উত্তম।', '৭৪')),
      introSentence(T('هَذَا مَسْجِدٌ قَدِيمٌ ، بَابُهُ وَاسِعٌ وَمِئْذَنَتُهُ عَالِيَةٌ.', 'এটি পুরনো মসজিদ, তার দরজা প্রশস্ত এবং তার আযানখানা উঁচু।', '৭৪')),
      introSentence(T('يَا سَعِيدُ ! هَلْ عَمُّكَ خَيَّاطٌ؟', 'হে সাঈদ! তোমার চাচা কি দরজী?', '৭৪')),
      introSentence(T('هَلْ أُخْتُكَ تِلْمِيذَةٌ ذَكِيَّةٌ؟', 'তোমার বোন কি মেধাবী ছাত্রী?', '৭৪')),
      introSentence(T('يَا عَائِشَةُ ! هَلْ هَذَا قَلَمُكِ؟ هَلْ قَلَمُكِ جَدِيدٌ؟', 'হে আয়েশা! এটি কি তোমার কলম? তোমার কলম কি নতুন?', '৭৪')),
      introSentence(T('اَللّٰهُ رَبِّي وَأَنَا عَبْدُهُ.', 'আল্লাহ আমার রব এবং আমি তাঁর বান্দা।', '৭৫')),
      introSentence(T('اَللّٰهُمَّ أَنْتَ رَبِّي وَأَنَا عَبْدُكَ.', 'হে আল্লাহ! তুমি আমার রব এবং আমি তোমার বান্দা।', '৭৫')),
      match([W.lawn, W.wajh, W.raiha, W.mizana], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l14-q-zameer', stageId: 'l14-zameer-sambandh',
  title: 'সম্বন্ধবাচক যমীর: আমার/তোমার/তার',
  table: [
    { arabic: 'ـي (আমার)',        bangla: 'بَيْتِي، سَاعَتِي، صَدِيقِي' },
    { arabic: 'ـكَ (তোমার পুং.)', bangla: 'بَيْتُكَ، سَاعَتُكَ، صَدِيقُكَ' },
    { arabic: 'ـكِ (তোমার স্ত্রী.)', bangla: 'غُرْفَتُكِ، سَرِيرُكِ، فِرَاشُكِ' },
    { arabic: 'ـهَا (তার স্ত্রী.)', bangla: 'سَاعَتُهَا، شَعْرُهَا، لِبَاسُهَا' },
    { arabic: 'ـهُ (তার পুং.)',   bangla: 'بَيْتُهُ، سَاعَتُهُ، وَلَدُهُ' },
  ],
  rule: 'শব্দের শেষে ـي যোগ করলে "আমার", ـكَ/ـكِ যোগ করলে "তোমার", ـهُ/ـهَا যোগ করলে "তার" হয়।',
  examples: [
    { arabic: 'هَذَا بَيْتِي وَذَلِكَ بَيْتُكَ.', bangla: 'এটি আমার বাড়ি এবং ওটি তোমার বাড়ি।' },
  ],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'শূন্যস্থানে উপযুক্ত যমীর যোগ করে পড়ো', arabic: 'هَذِهِ زَهْرَةٌ جَمِيلَةٌ ، لَوْنُهَا جَمِيلٌ وَرَائِحَتُهَا طَيِّبَةٌ.', bangla: 'এটি সুন্দর ফুল, তার রং সুন্দর এবং তার ঘ্রাণ উত্তম।', mode: 'ar-to-bn', page: '৭৪' },
  { task: 'শূন্যস্থানে উপযুক্ত যমীর যোগ করে পড়ো', arabic: 'اَللّٰهُ رَبِّي وَأَنَا عَبْدُهُ.', bangla: 'আল্লাহ আমার রব এবং আমি তাঁর বান্দা।', mode: 'ar-to-bn', page: '৭৫' },
];
const quizLegacy = [
  { question: "'بَيْتِي' অর্থ কী?", options: ['আমার বাড়ি', 'তোমার বাড়ি', 'তার বাড়ি'], correctIndex: 0, correctAnswer: 0, explanation: 'ـي = আমার।', type: 'mcq' },
  { question: "'سَاعَتُهَا' অর্থ?", options: ['তার (নারী) ঘড়ি', 'তার (পুরুষ) ঘড়ি', 'তোমার ঘড়ি'], correctIndex: 0, correctAnswer: 0, explanation: 'ـهَا = তার (স্ত্রী.)।', type: 'mcq' },
  { question: "'عَيْنٌ' অর্থ?", options: ['চোখ', 'নাক', 'গাল'], correctIndex: 0, correctAnswer: 0, explanation: 'আইন = চোখ।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l5',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৭৩-৭৮', qaida,
    grammarRule: { title: 'সম্বন্ধবাচক যমীর', summary: 'ي = আমার, كَ = তোমার — শব্দের শেষে যোগ হয়।', points: ['قَلَمِي = আমার কলম', 'قَلَمُكَ = তোমার কলম'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};