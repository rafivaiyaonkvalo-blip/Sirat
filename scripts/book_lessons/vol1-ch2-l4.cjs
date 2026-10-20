// vol1-ch2-l4.cjs  |  দারস ৪ — ২য় অধ্যায়  |  পৃষ্ঠা ৬৭–৭১
// বিষয়: ফল-তরকারির শব্দ, وَ দিয়ে সমন্বয়, তারকীব (মাওসুফ-সিফাত)

const W = {
  inaba:   { arabic: 'عِنَبَةٌ',    bangla: 'একটি আঙুর' },
  tuffaha: { arabic: 'تُفَّاحَةٌ', bangla: 'একটি আপেল' },
  rumman:  { arabic: 'رُمَّانَةٌ',  bangla: 'একটি আনার' },
  battikh: { arabic: 'بِطِّيخَةٌ', bangla: 'একটি তরমুজ' },
  hulw:    { arabic: 'حُلْوٌ',      bangla: 'মিষ্টি' },
  hamid:   { arabic: 'حَامِضٌ',     bangla: 'টক' },
  rakhis:  { arabic: 'رَخِيصٌ',     bangla: 'সস্তা' },
  ghali:   { arabic: 'غَالٍ',       bangla: 'দামী' },
  siwar:   { arabic: 'سِوَارٌ',     bangla: 'বালা, চুড়ি' },
  tawil:   { arabic: 'طَوِيلٌ',     bangla: 'লম্বা, দীর্ঘ' },
  qasir:   { arabic: 'قَصِيرٌ',     bangla: 'খাটো' },
  shay:    { arabic: 'شَايٌ',       bangla: 'চা' },
  maa:     { arabic: 'مَاءٌ',       bangla: 'পানি' },
  barid:   { arabic: 'بَارِدٌ',     bangla: 'ঠাণ্ডা' },
  harr:    { arabic: 'حَارٌّ',      bangla: 'গরম' },
  jadid:   { arabic: 'جَدِيدٌ',     bangla: 'নতুন' },
  qadim:   { arabic: 'قَدِيمٌ',     bangla: 'পুরনো' },
  hayawan: { arabic: 'حَيَوَانٌ',    bangla: 'একটি প্রাণী' },
  insan:   { arabic: 'إِنْسَانٌ',    bangla: 'একজন মানুষ' },
  fil:     { arabic: 'فِيلٌ',        bangla: 'একটি হাতি' },
  qird:    { arabic: 'قِرْدٌ',       bangla: 'একটি বানর' },
  himar:   { arabic: 'حِمَارٌ',      bangla: 'একটি গাধা' },
  faras:   { arabic: 'فَرَسٌ',       bangla: 'একটি ঘোড়া' },
  ghurab:  { arabic: 'غُرَابٌ',      bangla: 'একটি কাক' },
  usfur:   { arabic: 'عُصْفُورَةٌ', bangla: 'একটি চড়ুই' },
  zabi:    { arabic: 'ظَبْيٌ',       bangla: 'একটি হরিণ' },
  namir:   { arabic: 'نَمِرٌ',       bangla: 'একটি বাঘ' },
  dhib:    { arabic: 'ذِئْبٌ',       bangla: 'একটি নেকড়ে' },
  kalb:    { arabic: 'كَلْبٌ',       bangla: 'একটি কুকুর' },
  khurtum: { arabic: 'خُرْطُومٌ',    bangla: 'শুঁড়' },
  ras:     { arabic: 'رَأْسٌ',       bangla: 'মাথা' },
  jism:    { arabic: 'جِسْمٌ',       bangla: 'শরীর' },
  sadr:    { arabic: 'صَدْرٌ',       bangla: 'বুক' },
  lisan:   { arabic: 'لِسَانٌ',      bangla: 'জিহ্বা' },
  fam:     { arabic: 'فَمٌ',         bangla: 'মুখ' },
  dhikr:   { arabic: 'ذِكْرٌ',       bangla: 'যিকির' },
  ghidha:  { arabic: 'غِذَاءٌ',      bangla: 'খাদ্য' },
  azim:    { arabic: 'عَظِيمٌ',      bangla: 'বিরাট' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  qalam_misatara: T('هَذَا قَلَمٌ وَتِلْكَ مِسْطَرَةٌ.',                  'এটি কলম এবং সেটি রুলার।',                '৬৭'),
  qalam_jayyid:   T('هَذَا قَلَمٌ جَيِّدٌ وَتِلْكَ مِسْطَرَةٌ جَيِّدَةٌ.', 'এটি ভালো কলম এবং সেটি ভালো রুলার।',     '৬৭'),
  qufl_miftah:    T('هَذَا قُفْلٌ وَذَلِكَ مِفْتَاحٌ.',                    'এটি তালা এবং সেটি চাবি।',                '৬৭'),
  qufl_kabir:     T('هَذَا قُفْلٌ كَبِيرٌ وَذَلِكَ مِفْتَاحٌ صَغِيرٌ.',   'এটি বড় তালা এবং সেটি ছোট চাবি।',         '৬৭'),
  qufl_sunduq:    T('هَذَا قُفْلُ الصُّنْدُوقِ وَذَلِكَ مِفْتَاحُ السَّيَّارَةِ.', 'এটি সিন্দুকের তালা এবং সেটি গাড়ির চাবি।', '৬৭'),
  sabura_nazifa:  T('اَلسَّبُّورَةُ نَظِيفَةٌ وَجَمِيلَةٌ.',               'ব্লাকবোর্ডটি পরিচ্ছন্ন ও সুন্দর।',        '৬৭'),
  battikh_hulwa:  T('اَلْبِطِّيخَةُ كَبِيرَةٌ وَحُلْوَةٌ.',                'তরমুজটি বড় ও মিষ্টি।',                  '৬৮'),
  masjid_kabir:   T('هَذَا الْمَسْجِدُ كَبِيرٌ وَذَلِكَ الْمَسْجِدُ صَغِيرٌ.', 'এই মসজিদটি বড় এবং ঐ মসজিদটি ছোট।', '৬৯'),
  shay_maa:       T('هَذَا شَايٌ وَذَلِكَ مَاءٌ.',                         'এটি চা এবং সেটি পানি।',                  '৬৯'),
  shay_harr:      T('اَلشَّايُ حَارٌّ وَالْمَاءُ بَارِدٌ.',                'চা গরম এবং পানি ঠাণ্ডা।',                '৬৯'),
  saa_nazara:     T('هَذِهِ سَاعَةٌ وَتِلْكَ نَظَّارَةٌ.',                 'এটি ঘড়ি এবং সেটি চশমা।',                '৬৯'),
  saa_ghalia:     T('اَلسَّاعَةُ غَالِيَةٌ وَالنَّظَّارَةُ رَخِيصَةٌ.',    'ঘড়িটি দামী এবং চশমাটি সস্তা।',          '৬৯'),
  walad_tawil:    T('اَلْوَلَدُ طَوِيلٌ وَالْبِنْتُ قَصِيرَةٌ.',           'ছেলেটি লম্বা এবং মেয়েটি খাটো।',          '৬৯'),
  bab_nafidha:    T('اَلْبَابُ مَفْتُوحٌ وَالنَّافِذَةُ مُغْلَقَةٌ.',      'দরজাটি খোলা এবং জানালাটি বন্ধ।',         '৬৯'),
  sayyara_jadida: T('هَذِهِ السَّيَّارَةُ جَدِيدَةٌ وَتِلْكَ السَّيَّارَةُ قَدِيمَةٌ.', 'এই গাড়িটি নতুন এবং ঐ গাড়িটি পুরনো।', '৬৯'),
  hal_bab:        T('هَلِ الْبَابُ مَفْتُوحٌ؟',                            'দরজাটি কি খোলা?',                        '৬৯'),
  a_maftuh:       T('أَ مَفْتُوحٌ الْبَابُ أَمْ مُغْلَقٌ؟',                'দরজাটি কি খোলা না বন্ধ?',                '৬৯'),
  a_bab_nafidha:  T('آلْبَابُ مَفْتُوحٌ أَمِ النَّافِذَةُ؟',               'দরজা কি খোলা না জানালা?',                '৬৯'),
  hadha_kitab:    T('هَذَا كِتَابٌ جَدِيدٌ.',                              'এটি নতুন বই।',                            '৭২'),
  al_kitab_jadid: T('اَلْكِتَابُ جَدِيدٌ.',                                'বইটি নতুন।',                              '৭২'),
  al_kitab_sadiq: T('اَلْكِتَابُ صَدِيقُ الْإِنْسَانِ.',                   'বই মানুষের বন্ধু।',                       '৭২'),
  masjid_baytullah:T('اَلْمَسْجِدُ بَيْتُ اللّٰهِ.',                       'মসজিদ আল্লাহর ঘর।',                       '৭২'),
  tuffaha_saghira:T('اَلتُّفَّاحَةُ صَغِيرَةٌ.',                           'আপেলটি ছোট।',                             '৭২'),
  tuffah_ladhidh: T('اَلتُّفَّاحُ لَذِيذٌ جِدًّا.',                        'আপেল খুব মজাদার।',                        '৭২'),
  asal_ghidha:    T('اَلْعَسَلُ غِذَاءٌ مُفِيدٌ.',                         'মধু উপকারী খাদ্য।',                       '৭২'),
  qird_dhaki:     T('اَلْقِرْدُ حَيَوَانٌ ذَكِيٌّ.',                       'বানর বুদ্ধিমান প্রাণী।',                  '৭২'),
  himar_ghabi:    T('اَلْحِمَارُ حَيَوَانٌ غَبِيٌّ.',                      'গাধা নির্বোধ প্রাণী।',                    '৭২'),
  ghurab_qabih:   T('اَلْغُرَابُ طَائِرٌ قَبِيحٌ.',                        'কাক কুৎসিত পাখি।',                        '৭২'),
  bulbul_jamil:   T('اَلْبُلْبُلُ طَائِرٌ جَمِيلٌ.',                       'বুলবুলি সুন্দর পাখি।',                   '৭২'),
  fil_kabir:      T('اَلْفِيلُ حَيَوَانٌ كَبِيرٌ.',                        'হাতি বড় প্রাণী।',                        '৭২'),
  usfur_saghir:   T('اَلْعُصْفُورُ طَائِرٌ صَغِيرٌ.',                      'চড়ুই ছোট পাখি।',                         '৭২'),
  ras_fil:        T('رَأْسُ الْفِيلِ صَغِيرٌ وَجِسْمُهُ عَظِيمٌ.',         'হাতির মাথা ছোট এবং তার শরীর বিরাট।',     '৭২'),
  khurtumuh:      T('خُرْطُومُهُ طَوِيلٌ.',                                'তার শুঁড় লম্বা।',                         '৭২'),
  insan_daif:     T('اَلْإِنْسَانُ ضَعِيفٌ جِدًّا.',                       'মানুষ খুবই দুর্বল।',                      '৭২'),
  shaytan_aduw:   T('اَلشَّيْطَانُ عَدُوُّ الْإِنْسَانِ.',                 'শয়তান মানুষের শত্রু।',                   '৭২'),
  dhikr_ghidha:   T('اَلذِّكْرُ غِذَاءُ الْقَلْبِ.',                       'যিকির অন্তরের খাদ্য।',                    '৭২'),
  qalb_sadr:      T('قَلْبُ الْإِنْسَانِ فِي صَدْرِهِ وَلِسَانُهُ فِي فَمِهِ.', 'মানুষের অন্তর তার বুকে এবং তার জিহ্বা তার মুখে।', '৭২'),
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
    id: 'l13-words-1', titleBn: 'ফল ও স্বাদের শব্দ', shortTitle: 'শব্দার্থ ১',
    titleAr: 'الْمُفْرَدَاتُ: الْفَوَاكِهُ', desc: 'আঙুর, আনার, আপেল, তরমুজ, মিষ্টি, টক',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৬৭–৬৮',
    steps: [
      intro(W.inaba), intro(W.rumman), intro(W.tuffaha), intro(W.battikh), intro(W.hulw), intro(W.hamid),
      match([W.inaba, W.rumman, W.tuffaha, W.battikh]),
      mcqWord(W.inaba,   ['একটি আপেল', 'একটি তরমুজ']),
      mcqWord(W.tuffaha, ['একটি আঙুর', 'একটি আনার']),
      mcqWord(W.hamid,   ['মিষ্টি', 'ঠাণ্ডা']),
      arabicOf(W.battikh, ['رُمَّانَةٌ', 'عِنَبَةٌ']),
    ],
  },
  {
    id: 'l13-words-2', titleBn: 'আরও শব্দ: দাম, আকার ও পানীয়', shortTitle: 'শব্দার্থ ২',
    titleAr: 'الْمُفْرَدَاتُ (٢)', desc: 'সস্তা, দামী, লম্বা, খাটো, চা, পানি, ঠাণ্ডা, গরম',
    iconName: 'Star', color: 'blue', estMinutes: 4, bookPages: '৬৮–৬৯',
    steps: [
      intro(W.rakhis), intro(W.ghali), intro(W.siwar), intro(W.tawil), intro(W.qasir),
      intro(W.shay), intro(W.maa), intro(W.barid), intro(W.harr), intro(W.jadid), intro(W.qadim),
      match([W.rakhis, W.ghali, W.tawil, W.qasir]),
      match([W.shay, W.maa, W.barid, W.harr]),
      arabicOf(W.qasir, ['طَوِيلٌ', 'رَخِيصٌ']),
    ],
  },
  {
    id: 'l13-wa-atf', titleBn: 'وَ দিয়ে সমন্বয়', shortTitle: 'وَ সমন্বয়',
    titleAr: 'الْعَطْفُ بِالْوَاوِ', desc: 'وَ দিয়ে দুটি বস্তু বা গুণ একসাথে বলা',
    iconName: 'Zap', color: 'violet', estMinutes: 4, bookPages: '৬৭–৬৮',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: وَ দিয়ে সমন্বয়',
        table: [
          { label: 'বস্তু সমন্বয়', arabic: 'هَذَا قَلَمٌ وَتِلْكَ مِسْطَرَةٌ.', bangla: 'এটি কলম এবং সেটি রুলার।' },
          { label: 'গুণ সমন্বয়',   arabic: 'اَلْبِطِّيخَةُ كَبِيرَةٌ وَحُلْوَةٌ.', bangla: 'তরমুজটি বড় ও মিষ্টি।' },
        ],
      },
      introSentence(SENT.qalam_misatara), introSentence(SENT.qalam_jayyid),
      introSentence(SENT.qufl_miftah), introSentence(SENT.qufl_kabir), introSentence(SENT.qufl_sunduq),
      introSentence(SENT.sabura_nazifa), introSentence(SENT.battikh_hulwa),
      mcqWord({ arabic: 'هَذَا قَلَمٌ وَتِلْكَ مِسْطَرَةٌ.', bangla: 'এটি কলম এবং সেটি রুলার।' },
              ['এটি কলম এবং সেটি বই।', 'এটি রুলার এবং সেটি কলম।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('هَذَا قُفْلٌ ___ ذَلِكَ مِفْتَاحٌ.', 'وَ', ['أَمْ', 'هَلْ'], 'সমন্বয়ের শব্দ?'),
      fillBlank('اَلْبِطِّيخَةُ كَبِيرَةٌ ___ حُلْوَةٌ.', 'وَ', ['أَمْ', 'هَلْ'], 'দুই গুণ সমন্বয়?'),
      sentenceBuilder(SENT.qalam_misatara, ['هَذِهِ', 'مَسْجِدٌ', 'أَمْ']),
      sentenceBuilder(SENT.qufl_kabir, ['صَغِيرَةٌ', 'هَلْ', 'أَمْ']),
    ],
  },
  {
    id: 'l13-sentences', titleBn: 'কিতাবের বাক্য (পৃ. ৬৯)', shortTitle: 'কিতাবের বাক্য',
    titleAr: 'جُمَلُ الْكِتَابِ', desc: 'ঠাণ্ডা-গরম, সস্তা-দামী, লম্বা-খাটো, খোলা-বন্ধ',
    iconName: 'MessageCircle', color: 'teal', estMinutes: 4, bookPages: '৬৯',
    steps: [
      introSentence(SENT.masjid_kabir), introSentence(SENT.shay_maa), introSentence(SENT.shay_harr),
      introSentence(SENT.saa_nazara), introSentence(SENT.saa_ghalia), introSentence(SENT.walad_tawil),
      introSentence(SENT.bab_nafidha), introSentence(SENT.sayyara_jadida),
      mcqWord({ arabic: 'اَلشَّايُ حَارٌّ وَالْمَاءُ بَارِدٌ.', bangla: 'চা গরম এবং পানি ঠাণ্ডা।' },
              ['চা ঠাণ্ডা এবং পানি গরম।', 'চা মিষ্টি এবং পানি ঠাণ্ডা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('اَلسَّاعَةُ غَالِيَةٌ وَالنَّظَّارَةُ ___.', 'رَخِيصَةٌ', ['طَوِيلَةٌ', 'مَفْتُوحَةٌ'], 'সস্তা (স্ত্রী.) = ?'),
      sentenceBuilder(SENT.walad_tawil, ['كَبِيرٌ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.bab_nafidha, ['مُغْلَقٌ', 'هَلْ', 'أَمْ']),
    ],
  },
  {
    id: 'l13-hamza', titleBn: 'প্রশ্নবোধক أَ ও আলিফ-লাম (أَ + ا = آ)', shortTitle: 'প্রশ্ন (আ)',
    titleAr: 'هَمْزَةُ الِاسْتِفْهَامِ', desc: 'هَلِ ও أَ ... أَمْ প্রশ্ন; أَ + ال = آل',
    iconName: 'Zap', color: 'orange', estMinutes: 4, bookPages: '৬৯–৭১',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: أَ + ا = آ',
        table: [
          { label: 'সাধারণ প্রশ্ন', arabic: 'هَلِ الْبَابُ مَفْتُوحٌ؟', bangla: 'দরজাটি কি খোলা?' },
          { label: 'বিকল্প প্রশ্ন', arabic: 'أَ مَفْتُوحٌ الْبَابُ أَمْ مُغْلَقٌ؟', bangla: 'দরজাটি কি খোলা না বন্ধ?' },
          { label: 'أَ + ال',       arabic: 'آلْبَابُ مَفْتُوحٌ أَمِ النَّافِذَةُ؟', bangla: 'দরজা কি খোলা না জানালা?' },
        ],
      },
      introSentence(SENT.hal_bab), introSentence(SENT.a_maftuh), introSentence(SENT.a_bab_nafidha),
      mcqWord({ arabic: 'هَلِ الْبَابُ مَفْتُوحٌ؟', bangla: 'দরজাটি কি খোলা?' },
              ['দরজাটি কি বন্ধ?', 'জানালাটি কি খোলা?'], 'বাক্যটির অর্থ কী?'),
      fillBlank('أَ مَفْتُوحٌ الْبَابُ ___ مُغْلَقٌ؟', 'أَمْ', ['هَلْ', 'وَ'], 'নাকি = ?'),
      sentenceBuilder(SENT.a_maftuh, ['هَلْ', 'وَ', 'النَّافِذَةُ']),
      sentenceBuilder(SENT.hal_bab, ['أَمْ', 'مُغْلَقٌ', 'النَّافِذَةُ']),
    ],
  },
  {
    id: 'l13-tarkib', titleBn: 'তারকীব: মাওসুফ-সিফাত', shortTitle: 'তারকীব',
    titleAr: 'التَّرْكِيبُ: الْمَوْصُوفُ وَالصِّفَةُ', desc: 'অপূর্ণ কথা ও পূর্ণ কথা (মুবতাদা-খবর)',
    iconName: 'MessageCircle', color: 'orange', estMinutes: 4, bookPages: '৭১',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের ডায়াগ্রাম: مَسْجِدٌ جَمِيلٌ',
        table: [
          { label: 'অপূর্ণ কথা (মাওসুফ + সিফাত)', arabic: 'مَسْجِدٌ جَمِيلٌ', bangla: 'সুন্দর মসজিদ' },
          { label: 'পূর্ণ কথা (মুবতাদা + খবর)', arabic: 'اَلْمَسْجِدُ جَمِيلٌ', bangla: 'মসজিদটি সুন্দর' },
          { label: 'পূর্ণ কথা (মুবতাদা + খবর)', arabic: 'هَذَا مَسْجِدٌ جَمِيلٌ', bangla: 'এটি সুন্দর মসজিদ' },
        ],
      },
      introSentence(T('مَسْجِدٌ جَمِيلٌ', 'সুন্দর মসজিদ (অপূর্ণ কথা)', '৭১')),
      introSentence(T('اَلْمَسْجِدُ جَمِيلٌ.', 'মসজিদটি সুন্দর। (পূর্ণ কথা)', '৭১')),
      introSentence(T('هَذَا مَسْجِدٌ جَمِيلٌ.', 'এটি সুন্দর মসজিদ। (পূর্ণ কথা)', '৭১')),
      mcqWord({ arabic: 'مَسْجِدٌ جَمِيلٌ', bangla: 'সুন্দর মসজিদ' }, ['মসজিদটি সুন্দর।', 'এটি সুন্দর মসজিদ।'], 'এটির অর্থ কী?'),
      mcqWord({ arabic: 'اَلْمَسْجِدُ جَمِيلٌ.', bangla: 'মসজিদটি সুন্দর।' }, ['সুন্দর মসজিদ', 'এটি মসজিদ।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('هَذَا ___ جَمِيلٌ.', 'مَسْجِدٌ', ['الْمَسْجِدُ', 'مَسْجِدَةٌ'], 'মাওসুফ বসাও'),
      sentenceBuilder(T('هَذَا مَسْجِدٌ جَمِيلٌ.', 'এটি সুন্দর মসজিদ।', '৭১'), ['الْمَسْجِدُ', 'هَلْ', 'أَمْ']),
    ],
  },
  {
    id: 'l13-tamrin2', titleBn: 'তামরীন ২: ال যোগ করে পড়ো', shortTitle: 'তামরীন ২',
    titleAr: 'التَّمْرِينُ الثَّانِي', desc: 'ক-এ ال যোগ করো; খ থেকে ال বাদ দাও',
    iconName: 'PenLine', color: 'amber', estMinutes: 4, bookPages: '৭১',
    steps: [
      introSentence(T('كِتَابٌ مَفْتُوحٌ', 'একটি খোলা বই', '৭১')),
      introSentence(T('مَسْجِدٌ جَمِيلٌ', 'একটি সুন্দর মসজিদ', '৭১')),
      introSentence(T('رَجُلٌ سَخِيٌّ', 'একজন দানশীল লোক', '৭১')),
      introSentence(T('صَيَّادٌ مَاهِرٌ', 'একজন দক্ষ শিকারী', '৭১')),
      introSentence(T('قِطَارٌ سَرِيعٌ', 'একটি দ্রুতগামী রেলগাড়ি', '৭১')),
      introSentence(T('اَلْقُفْلُ جَيِّدٌ.', 'তালাটি ভালো।', '৭১')),
      introSentence(T('اَلْمَنَارَةُ عَالِيَةٌ.', 'মিনারটি উঁচু।', '৭১')),
      introSentence(T('اَلْبِنْتُ مُؤَدَّبَةٌ.', 'মেয়েটি ভদ্র।', '৭১')),
      introSentence(T('اَلتُّفَّاحَةُ حُلْوَةٌ.', 'আপেলটি মিষ্টি।', '৭১')),
      mcqWord({ arabic: 'اَلْقُفْلُ جَيِّدٌ.', bangla: 'তালাটি ভালো।' }, ['একটি ভালো তালা', 'এটি ভালো তালা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('رَجُلٌ سَخِيٌّ → ___ سَخِيٌّ.', 'اَلرَّجُلُ', ['رَجُلٌ', 'اَلرَّجُلَةُ'], 'ال যোগ করে পূর্ণ কথা'),
      sentenceBuilder(T('اَلْمَنَارَةُ عَالِيَةٌ.', 'মিনারটি উঁচু।', '৭১'), ['مَنَارَةٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l13-al', titleBn: 'ال যোগ করা: বই — বইটি', shortTitle: 'ال',
    titleAr: 'أَلْ التَّعْرِيفِ', desc: 'কিতাবের পৃ. ৭২: ال সহ ও ছাড়া শব্দ',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 4, bookPages: '৭২',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: ال',
        table: [
          { label: 'ال ছাড়া', arabic: 'كِتَابٌ', bangla: 'একটি বই' },
          { label: 'ال সহ',    arabic: 'اَلْكِتَابُ', bangla: 'বইটি' },
          { label: 'ال ছাড়া', arabic: 'تَمْرَةٌ', bangla: 'একটি খেজুর' },
          { label: 'ال সহ',    arabic: 'اَلتَّمْرَةُ', bangla: 'খেজুরটি' },
        ],
      },
      introSentence(SENT.hadha_kitab), introSentence(SENT.al_kitab_jadid), introSentence(SENT.al_kitab_sadiq),
      introSentence(SENT.masjid_baytullah), introSentence(SENT.tuffaha_saghira), introSentence(SENT.tuffah_ladhidh),
      introSentence(SENT.asal_ghidha),
      mcqWord({ arabic: 'اَلْكِتَابُ جَدِيدٌ.', bangla: 'বইটি নতুন।' }, ['একটি নতুন বই', 'এটি নতুন বই।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('___ صَدِيقُ الْإِنْسَانِ.', 'اَلْكِتَابُ', ['كِتَابٌ', 'كِتَابَةٌ'], 'বই মানুষের বন্ধু'),
      sentenceBuilder(SENT.al_kitab_sadiq, ['كِتَابٌ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.masjid_baytullah, ['مَسْجِدٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l13-animals', titleBn: 'প্রাণী ও শরীরের শব্দ', shortTitle: 'প্রাণী',
    titleAr: 'الْحَيَوَانَاتُ', desc: 'হাতি, বানর, গাধা, ঘোড়া, কাক, চড়ুই, বাঘ, শরীর, শুঁড়',
    iconName: 'Star', color: 'cyan', estMinutes: 5, bookPages: '৭২',
    steps: [
      intro(W.hayawan), intro(W.insan), intro(W.fil), intro(W.qird), intro(W.himar), intro(W.faras),
      intro(W.ghurab), intro(W.usfur), intro(W.zabi), intro(W.namir), intro(W.dhib), intro(W.kalb),
      match([W.fil, W.qird, W.himar, W.faras]),
      match([W.ghurab, W.usfur, W.zabi, W.namir]),
    ],
  },
  {
    id: 'l13-body', titleBn: 'শরীর ও আরও শব্দ', shortTitle: 'শরীর',
    titleAr: 'الْمُفْرَدَاتُ (٣)', desc: 'শুঁড়, মাথা, শরীর, বুক, জিহ্বা, মুখ, যিকির, খাদ্য',
    iconName: 'Zap', color: 'teal', estMinutes: 4, bookPages: '৭২',
    steps: [
      intro(W.khurtum), intro(W.ras), intro(W.jism), intro(W.sadr), intro(W.lisan), intro(W.fam),
      intro(W.dhikr), intro(W.ghidha), intro(W.azim),
      match([W.khurtum, W.ras, W.jism, W.sadr]),
      match([W.lisan, W.fam, W.dhikr, W.ghidha]),
    ],
  },
  {
    id: 'l13-animal-sentences', titleBn: 'কিতাবের বাক্য (প্রাণী ও মানুষ)', shortTitle: 'প্রাণীর বাক্য',
    titleAr: 'جُمَلُ الْكِتَابِ', desc: 'বানর বুদ্ধিমান, গাধা নির্বোধ, হাতি বড়…',
    iconName: 'MessageCircle', color: 'violet', estMinutes: 5, bookPages: '৭২',
    steps: [
      introSentence(SENT.qird_dhaki), introSentence(SENT.himar_ghabi), introSentence(SENT.ghurab_qabih),
      introSentence(SENT.bulbul_jamil), introSentence(SENT.fil_kabir), introSentence(SENT.usfur_saghir),
      introSentence(SENT.ras_fil), introSentence(SENT.khurtumuh), introSentence(SENT.insan_daif),
      introSentence(SENT.shaytan_aduw), introSentence(SENT.dhikr_ghidha), introSentence(SENT.qalb_sadr),
      mcqWord({ arabic: 'اَلْحِمَارُ حَيَوَانٌ غَبِيٌّ.', bangla: 'গাধা নির্বোধ প্রাণী।' }, ['বানর বুদ্ধিমান প্রাণী।', 'হাতি বড় প্রাণী।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('اَلْقِرْدُ حَيَوَانٌ ___.', 'ذَكِيٌّ', ['غَبِيٌّ', 'قَبِيحٌ'], 'বুদ্ধিমান = ?'),
      sentenceBuilder(SENT.fil_kabir, ['صَغِيرٌ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.dhikr_ghidha, ['الْقَلْبِ', 'هَلْ', 'أَمْ']),
    ],
  },
  {
    id: 'l13-tamrin', titleBn: 'তামরীন ও মিশ্র চর্চা', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينَاتُ', desc: 'কিতাবের তামরীন ১ (ছবি দেখে উত্তর দাও)',
    iconName: 'PenLine', color: 'amber', estMinutes: 4, bookPages: '৬৮',
    steps: [
      introSentence(T('كَيْفَ السَّاعَةُ؟', 'ঘড়িটি কেমন?', '৬৮')),
      introSentence(T('أَ رَخِيصَةٌ هِيَ أَمْ غَالِيَةٌ؟', 'সেটি কি সস্তা না দামী?', '৬৮')),
      introSentence(T('أَ تُفَّاحَةٌ تِلْكَ أَمْ رُمَّانَةٌ؟', 'ওটি কি আপেল না আনার?', '৬৮')),
      introSentence(T('أَ حُلْوَةٌ هِيَ أَمْ حَامِضَةٌ؟', 'সেটি কি মিষ্টি না টক?', '৬৮')),
      introSentence(T('أَ عِقْدٌ هَذَا أَمْ سِوَارٌ؟', 'এটি কি হার না বালা?', '৬৮')),
      introSentence(T('أَ نَظِيفَةٌ هِيَ أَمْ وَسِخَةٌ؟', 'সেটি কি পরিচ্ছন্ন না নোংরা?', '৬৮')),
      match([W.inaba, W.tuffaha, W.rumman, W.siwar], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l13-q-wa', stageId: 'l13-wa-atf',
  title: 'وَ দিয়ে সমন্বয়',
  table: [
    { arabic: 'هَذَا قَلَمٌ وَتِلْكَ مِسْطَرَةٌ.', bangla: 'এটি কলম এবং সেটি রুলার।' },
    { arabic: 'كَبِيرَةٌ وَحُلْوَةٌ', bangla: 'বড় ও মিষ্টি' },
  ],
  rule: 'وَ = এবং/ও — দুটি বস্তু বা দুটি গুণ একসাথে বলতে ব্যবহার হয়।',
  examples: [{ arabic: 'هَذَا قُفْلٌ وَذَلِكَ مِفْتَاحٌ.', bangla: 'এটি তালা এবং সেটি চাবি।' }],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'ছবি দেখে উত্তর দাও', arabic: 'كَيْفَ السَّاعَةُ؟', bangla: 'ঘড়িটি কেমন?', mode: 'ar-to-bn', page: '৬৮' },
  { task: 'ছবি দেখে উত্তর দাও', arabic: 'أَ تُفَّاحَةٌ تِلْكَ أَمْ رُمَّانَةٌ؟', bangla: 'ওটি কি আপেল না আনার?', mode: 'ar-to-bn', page: '৬৮' },
  { task: 'ছবি দেখে উত্তর দাও', arabic: 'أَ عِقْدٌ هَذَا أَمْ سِوَارٌ؟', bangla: 'এটি কি হার না বালা?', mode: 'ar-to-bn', page: '৬৮' },
];
const quizLegacy = [
  { question: "'عِنَبَةٌ' অর্থ কী?", options: ['একটি আঙুর', 'একটি আপেল', 'একটি তরমুজ'], correctIndex: 0, correctAnswer: 0, explanation: 'একটি আঙুর।', type: 'mcq' },
  { question: "'وَ' এর কাজ কী?", options: ['সমন্বয় করে', 'প্রশ্ন করে', 'না বলে'], correctIndex: 0, correctAnswer: 0, explanation: 'وَ = এবং।', type: 'mcq' },
  { question: "'حَامِضٌ' অর্থ?", options: ['টক', 'মিষ্টি', 'ঠাণ্ডা'], correctIndex: 0, correctAnswer: 0, explanation: 'হামিদ = টক।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch2-l4',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৬৭-৭২', qaida,
    grammarRule: { title: 'وَ দিয়ে সমন্বয়', summary: 'وَ = এবং/ও — দুটি বস্তু বা গুণ একসাথে।', points: ['هَذَا قَلَمٌ وَ تِلْكَ مِسْطَرَةٌ.', 'حُلْوٌ وَ كَبِيرٌ'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};