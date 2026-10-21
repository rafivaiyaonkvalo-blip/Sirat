// vol1-ch3-l1.cjs  |  দারস ১ — ৩য় অধ্যায়  |  পৃষ্ঠা ৯২–৯৫
// বিষয়: ইদাফাত — সম্বন্ধমূলক বাক্য গঠন

const W = {
  maryah:  { arabic: 'مُرِيحٌ',    bangla: 'আরামদায়ক' },
  raha:    { arabic: 'رَاحَةٌ',     bangla: 'আরাম, শান্তি' },
  malik:   { arabic: 'مَلِكٌ',      bangla: 'বাদশাহ' },
  khadim:  { arabic: 'خَادِمٌ',     bangla: 'সেবক' },
  salih:   { arabic: 'صَالِحٌ',     bangla: 'সৎ' },
  ghilaf:  { arabic: 'غِلَافٌ',     bangla: 'গিলাফ' },
  zill:    { arabic: 'ظِلٌّ',       bangla: 'ছায়া' },
  sura:    { arabic: 'صُورَةٌ',     bangla: 'ছবি' },
  mudir:   { arabic: 'مُدِيرٌ',     bangla: 'পরিচালক' },
  imam:    { arabic: 'إِمَامٌ',     bangla: 'ইমাম' },
  muallim: { arabic: 'مُعَلِّمٌ',   bangla: 'শিক্ষক' },
  miftah:  { arabic: 'مِفْتَاحٌ',   bangla: 'চাবি' },
  qufl:    { arabic: 'قُفْلٌ',       bangla: 'তালা' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  hadha_masjid:  T('هَذَا الْمَسْجِدُ.',                              'এই মসজিদ।',                          '৯২'),
  imam_masjid:   T('إِمَامُ هَذَا الْمَسْجِدِ.',                      'এই মসজিদের ইমাম।',                  '৯২'),
  muallim_madrasa:T('مُعَلِّمُ هَذِهِ الْمَدْرَسَةِ.',                'এই মাদরাসার শিক্ষক।',               '৯২'),
  miftah_qufl:   T('مِفْتَاحُ ذَلِكَ الْقُفْلِ.',                     'ঐ তালার চাবি।',                      '৯২'),
  fallah_qarya:  T('فَلَّاحُ تِلْكَ الْقَرْيَةِ.',                    'ঐ গ্রামের কৃষক।',                    '৯২'),
  bab_bayt:      T('بَابُ هَذَا الْبَيْتِ.',                          'এই ঘরের দরজা।',                      '৯২'),
  rabb_bayt:     T('رَبُّ هَذَا الْبَيْتِ اللّٰهُ.',                   'এই ঘরের রব আল্লাহ।',                 '৯২'),
  ism_bayt:      T('اِسْمُ هَذَا الْبَيْتِ الْكَعْبَةُ.',             'এই ঘরের নাম কা’বা।',                '৯২'),
  ghilaf_bayt:   T('غِلَافُ هَذَا الْبَيْتِ جَمِيلٌ.',                'এই ঘরের গিলাফ সুন্দর।',              '৯২'),
  khadim_bayt:   T('اَلْمَلِكُ خَادِمُ هَذَا الْبَيْتِ.',             'বাদশাহ এই ঘরের খাদেম।',              '৯২'),
  miftah_rajul:  T('مِفْتَاحُ هَذَا الْبَيْتِ عِنْدَ رَجُلٍ صَالِحٍ.', 'এই ঘরের চাবি একজন সৎ লোকের কাছে।', '৯৩'),
  zill_bayt:     T('ظِلُّ هَذَا الْبَيْتِ مُرِيحٌ.',                  'এই ঘরের ছায়া আরামদায়ক।',           '৯৩'),
  raha_zill:     T('فِي ظِلِّ هَذَا الْبَيْتِ رَاحَةٌ.',              'এই ঘরের ছায়ায় আরাম আছে।',          '৯৩'),
  saqf_bayt:     T('سَقْفُ هَذَا الْبَيْتِ مَفْتُوحٌ.',               'এই ঘরের ছাদ খোলা।',                  '৯৩'),
  sura_bayt:     T('صُورَةُ هَذَا الْبَيْتِ جَمِيلَةٌ.',              'এই ঘরের ছবি সুন্দর।',                '৯৩'),
  bayt_allah:    T('هَذَا بَيْتُ اللّٰهِ.',                            'এটি আল্লাহর ঘর।',                    '৯৩'),
  imam_alim:     T('إِمَامُ هَذَا الْمَسْجِدِ عَالِمٌ كَبِيرٌ.',      'এই মসজিদের ইমাম বড় আলিম।',         '৯৩'),
  abu_rashid:    T('أَبُو رَاشِدٍ مُعَلِّمُ تِلْكَ الْمَدْرَسَةِ.',    'রাশেদের আব্বা ঐ মাদরাসার শিক্ষক।',   '৯৩'),
  bab_maftuh:    T('بَابُ هَذَا الْبَيْتِ مَفْتُوحٌ.',                'এই ঘরের দরজা খোলা।',                 '৯৩'),
  muaddhin:      T('مُؤَذِّنُ ذَلِكَ الْمَسْجِدِ رَجُلٌ صَالِحٌ.',    'ঐ মসজিদের মুআযযিন সৎ লোক।',         '৯৩'),
  nafidha:       T('نَافِذَةُ هَذِهِ الْغُرْفَةِ مُغْلَقَةٌ.',        'এই কামরার জানালা বন্ধ।',             '৯৪'),
  iqd_haqiba:    T('عِقْدُ هَذِهِ الْمَرْأَةِ فِي حَقِيبَتِهَا.',     'এই মহিলার হার তার ব্যাগে।',          '৯৪'),
  dukkan_tajir:  T('دُكَّانُ هَذَا التَّاجِرِ فِي سُوقِ الْمَدِينَةِ.', 'এই ব্যবসায়ীর দোকান শহরের বাজারে।',  '৯৪'),
  qalam_walad:   T('قَلَمُ هَذَا الْوَلَدِ عِنْدَ ذَلِكَ الْوَلَدِ.', 'এই ছেলেটির কলম ঐ ছেলেটির কাছে।',    '৯৪'),
  sahib_jarida:  T('صَاحِبُ هَذِهِ الْجَرِيدَةِ كَاتِبٌ مَشْهُورٌ.',  'এই পত্রিকার মালিক প্রসিদ্ধ লেখক।',   '৯৪'),
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
    id: 'l18-words-1', titleBn: 'নতুন শব্দ (১/২)', shortTitle: 'শব্দার্থ ১',
    titleAr: 'الْمُفْرَدَاتُ (١)', desc: 'আরামদায়ক, আরাম, বাদশাহ, সেবক, সৎ',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৯২',
    steps: [
      intro(W.maryah), intro(W.raha), intro(W.malik), intro(W.khadim), intro(W.salih),
      match([W.maryah, W.raha, W.malik, W.khadim]),
      mcqWord(W.malik, ['সেবক', 'ছায়া']),
      arabicOf(W.salih, ['مُرِيحٌ', 'مَلِكٌ']),
    ],
  },
  {
    id: 'l18-words-2', titleBn: 'নতুন শব্দ (২/২)', shortTitle: 'শব্দার্থ ২',
    titleAr: 'الْمُفْرَدَاتُ (٢)', desc: 'গিলাফ, ছায়া, ছবি, পরিচালক',
    iconName: 'Star', color: 'teal', estMinutes: 3, bookPages: '৯২–৯৫',
    steps: [
      intro(W.ghilaf), intro(W.zill), intro(W.sura), intro(W.mudir),
      match([W.ghilaf, W.zill, W.sura, W.mudir]),
      mcqWord(W.zill, ['গিলাফ', 'ছবি']),
      arabicOf(W.mudir, ['صُورَةٌ', 'ظِلٌّ']),
    ],
  },
  {
    id: 'l18-idafat', titleBn: 'ইযাফত: এই মসজিদের ইমাম', shortTitle: 'ইযাফত',
    titleAr: 'الْإِضَافَةُ', desc: 'এই মসজিদের ইমাম, ঐ তালার চাবি',
    iconName: 'Zap', color: 'violet', estMinutes: 4, bookPages: '৯২',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: ইযাফত',
        table: [
          { label: 'এই মসজিদ', arabic: 'هَذَا الْمَسْجِدُ', bangla: 'এই মসজিদ' },
          { label: 'সম্বন্ধ', arabic: 'إِمَامُ هَذَا الْمَسْجِدِ', bangla: 'এই মসজিদের ইমাম' },
          { label: 'সম্বন্ধ', arabic: 'مِفْتَاحُ ذَلِكَ الْقُفْلِ', bangla: 'ঐ তালার চাবি' },
        ],
      },
      introSentence(SENT.hadha_masjid), introSentence(SENT.imam_masjid), introSentence(SENT.muallim_madrasa),
      introSentence(SENT.miftah_qufl), introSentence(SENT.fallah_qarya), introSentence(SENT.bab_bayt),
      mcqWord({ arabic: 'إِمَامُ هَذَا الْمَسْجِدِ.', bangla: 'এই মসজিদের ইমাম।' }, ['এই মাদরাসার শিক্ষক।', 'ঐ মসজিদের ইমাম।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('___ ذَلِكَ الْقُفْلِ.', 'مِفْتَاحُ', ['مِفْتَاحٌ', 'قُفْلُ'], 'ঐ তালার চাবি'),
      sentenceBuilder(SENT.muallim_madrasa, ['الْمَسْجِدِ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.bab_bayt, ['تِلْكَ', 'الْقَرْيَةِ', 'أَمْ']),
    ],
  },
  {
    id: 'l18-bayt', titleBn: 'এই ঘর (কা’বা)', shortTitle: 'এই ঘর',
    titleAr: 'هَذَا الْبَيْتُ', desc: 'এই ঘরের রব, নাম, গিলাফ, খাদেম',
    iconName: 'Sparkles', color: 'cyan', estMinutes: 4, bookPages: '৯২–৯৩',
    steps: [
      introSentence(SENT.rabb_bayt), introSentence(SENT.ism_bayt), introSentence(SENT.ghilaf_bayt),
      introSentence(SENT.khadim_bayt), introSentence(SENT.miftah_rajul), introSentence(SENT.zill_bayt),
      introSentence(SENT.raha_zill), introSentence(SENT.saqf_bayt), introSentence(SENT.sura_bayt),
      introSentence(SENT.bayt_allah),
      mcqWord({ arabic: 'رَبُّ هَذَا الْبَيْتِ اللّٰهُ.', bangla: 'এই ঘরের রব আল্লাহ।' }, ['এই ঘরের নাম আল্লাহ।', 'এই ঘরের খাদেম আল্লাহ।'], 'বাক্যটির অর্থ কী?'),
      mcqWord({ arabic: 'اَلْمَلِكُ خَادِمُ هَذَا الْبَيْتِ.', bangla: 'বাদশাহ এই ঘরের খাদেম।' }, ['খাদেম এই ঘরের বাদশাহ।', 'বাদশাহ ঐ ঘরের ইমাম।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('اِسْمُ هَذَا الْبَيْتِ ___.', 'الْكَعْبَةُ', ['الْمَدْرَسَةُ', 'الْقَرْيَةُ'], 'কা’বা = ?'),
      sentenceBuilder(SENT.ism_bayt, ['الْمَسْجِدِ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.khadim_bayt, ['إِمَامُ', 'ذَلِكَ', 'أَمْ']),
    ],
  },
  {
    id: 'l18-jumal', titleBn: 'কিতাবের বাক্য (পৃ. ৯৩–৯৪)', shortTitle: 'কিতাবের বাক্য',
    titleAr: 'جُمَلُ الْكِتَابِ', desc: 'ইমাম, মুআযযিন, জানালা, হার, দোকান, কলম',
    iconName: 'MessageCircle', color: 'orange', estMinutes: 4, bookPages: '৯৩–৯৪',
    steps: [
      introSentence(SENT.imam_alim), introSentence(SENT.abu_rashid), introSentence(SENT.bab_maftuh),
      introSentence(SENT.muaddhin), introSentence(SENT.nafidha), introSentence(SENT.iqd_haqiba),
      introSentence(SENT.dukkan_tajir), introSentence(SENT.qalam_walad), introSentence(SENT.sahib_jarida),
      mcqWord({ arabic: 'نَافِذَةُ هَذِهِ الْغُرْفَةِ مُغْلَقَةٌ.', bangla: 'এই কামরার জানালা বন্ধ।' }, ['এই কামরার দরজা বন্ধ।', 'এই কামরার জানালা খোলা।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('دُكَّانُ هَذَا ___ فِي سُوقِ الْمَدِينَةِ.', 'التَّاجِرِ', ['التَّاجِرُ', 'تَاجِرٌ'], 'ব্যবসায়ী'),
      sentenceBuilder(SENT.muaddhin, ['إِمَامُ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.sahib_jarida, ['مَسْجِدٍ', 'ذَلِكَ', 'أَمْ']),
    ],
  },
  {
    id: 'l18-qa', titleBn: 'প্রশ্নোত্তর (পৃ. ৯৫–৯৬)', shortTitle: 'প্রশ্নোত্তর',
    titleAr: 'الْأَسْئِلَةُ وَالْأَجْوِبَةُ', desc: 'ইমাম, শিক্ষক, দরজা, জানালা, দোকান, ফুল — কিতাবের উত্তরসহ',
    iconName: 'MessageCircle', color: 'violet', estMinutes: 5, bookPages: '৯৫–৯৬',
    steps: [
      introSentence(T('مَنْ مُعَلِّمُكُمْ؟ — عَمُّ هٰذَا الْوَلَدِ مُعَلِّمُنَا.', 'তোমাদের শিক্ষক কে? — এই ছেলেটির চাচা আমাদের শিক্ষক।', '৯৫')),
      introSentence(T('أَ مُعَلِّمُكُمْ عَمُّ هٰذَا الْوَلَدِ أَمْ تِلْمِيذُكُمْ؟ — مُعَلِّمُنَا.', 'তোমাদের শিক্ষক কি এই ছেলেটির চাচা না তোমাদের ছাত্র? — আমাদের শিক্ষক।', '৯৫')),
      introSentence(T('كَيْفَ مُؤَذِّنُ ذٰلِكَ الْمَسْجِدِ؟ — هُوَ رَجُلٌ صَالِحٌ.', 'ঐ মসজিদের মুআযযিন কেমন? — সে সৎ লোক।', '৯৫')),
      introSentence(T('هَلْ بَابُ هٰذَا الْبَيْتِ مُغْلَقٌ؟ — لَا ، بَابُ هٰذَا الْبَيْتِ مَفْتُوحٌ.', 'এই ঘরের দরজা কি বন্ধ? — না, এই ঘরের দরজা খোলা।', '৯৫')),
      introSentence(T('أَ نَافِذَةُ هٰذَا الْبَيْتِ مَفْتُوحَةٌ أَمِ الْبَابُ؟ — اَلْبَابُ.', 'এই ঘরের জানালা কি খোলা না দরজা? — দরজা।', '৯৫')),
      introSentence(T('هَلْ نَافِذَةُ هٰذِهِ الْغُرْفَةِ مُغْلَقَةٌ؟ — نَعَمْ ، نَافِذَةُ هٰذِهِ الْغُرْفَةِ مُغْلَقَةٌ.', 'এই কামরার জানালা কি বন্ধ? — হাঁ, এই কামরার জানালা বন্ধ।', '৯৬')),
      introSentence(T('أَيْنَ دُكَّانُ هٰذَا التَّاجِرِ؟ — دُكَّانُهُ فِي سُوقِ الْمَدِينَةِ.', 'এই ব্যবসায়ীর দোকান কোথায়? — তার দোকান শহরের বাজারে।', '৯৬')),
      introSentence(T('كَيْفَ فَلَّاحُ هٰذِهِ الْقَرْيَةِ؟ — هُوَ رَجُلٌ طَيِّبٌ.', 'এই গ্রামের কৃষক কেমন? — সে ভালো লোক।', '৯৬')),
      introSentence(T('هَلْ رَائِحَةُ تِلْكَ الزَّهْرَةِ طَيِّبَةٌ؟ — نَعَمْ ، رَائِحَتُهَا طَيِّبَةٌ.', 'ঐ ফুলের ঘ্রাণ কি উত্তম? — হাঁ, তার ঘ্রাণ উত্তম।', '৯৬')),
      introSentence(T('عِنْدَ مَنْ قَلَمُ هٰذَا الْوَلَدِ؟ — عِنْدَ ذٰلِكَ الْوَلَدِ.', 'এই ছেলেটির কলম কার কাছে? — ঐ ছেলেটির কাছে।', '৯৬')),
      mcqWord({ arabic: 'هَلْ بَابُ هٰذَا الْبَيْتِ مُغْلَقٌ؟', bangla: 'এই ঘরের দরজা কি বন্ধ?' }, ['এই ঘরের জানালা কি খোলা?', 'এই ঘরের চাবি কার কাছে?'], 'প্রশ্নের অর্থ কী?'),
      mcqWord({ arabic: 'أَيْنَ دُكَّانُ هٰذَا التَّاجِرِ؟', bangla: 'এই ব্যবসায়ীর দোকান কোথায়?' }, ['এই ব্যবসায়ী কে?', 'এই দোকান কেমন?'], 'প্রশ্নের অর্থ কী?'),
      mcqWord({ arabic: 'كَيْفَ فَلَّاحُ هٰذِهِ الْقَرْيَةِ؟', bangla: 'এই গ্রামের কৃষক কেমন?' }, ['এই গ্রামের কৃষক কোথায়?', 'এই কৃষক কে?'], 'প্রশ্নের অর্থ কী?'),
    ],
  },
  {
    id: 'l18-tamrin', titleBn: 'তামরীন ১ ও ২: প্রশ্নোত্তর', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينَاتُ', desc: 'কিতাবের প্রশ্নগুলো পড়ো ও অর্থ বলো',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৯৩–৯৫',
    steps: [
      introSentence(T('مَنْ رَبُّ هَذَا الْبَيْتِ؟ مَا اسْمُ هَذَا الْبَيْتِ؟', 'এই ঘরের রব কে? এই ঘরের নাম কী?', '৯৩')),
      introSentence(T('كَيْفَ غِلَافُ هَذَا الْبَيْتِ؟ مَنْ خَادِمُ هَذَا الْبَيْتِ؟', 'এই ঘরের গিলাফ কেমন? এই ঘরের খাদেম কে?', '৯৩')),
      introSentence(T('عِنْدَ مَنْ مِفْتَاحُ هَذَا الْبَيْتِ؟', 'এই ঘরের চাবি কার কাছে?', '৯৩')),
      introSentence(T('هَلْ سَقْفُ هَذَا الْبَيْتِ مَفْتُوحٌ؟', 'এই ঘরের ছাদ কি খোলা?', '৯৩')),
      introSentence(T('هَلْ صُورَةُ هَذَا الْبَيْتِ جَمِيلَةٌ؟', 'এই ঘরের ছবি কি সুন্দর?', '৯৩')),
      introSentence(T('كَيْفَ إِمَامُ هَذَا الْمَسْجِدِ؟ — إِمَامُ هَذَا الْمَسْجِدِ عَالِمٌ كَبِيرٌ.', 'এই মসজিদের ইমাম কেমন? — এই মসজিদের ইমাম বড় আলিম।', '৯৪')),
      introSentence(T('مَنْ إِمَامُ هَذَا الْمَسْجِدِ؟ — رَاشِدٌ.', 'এই মসজিদের ইমাম কে? — রাশেদ।', '৯৪')),
      introSentence(T('مَنْ مُعَلِّمُ تِلْكَ الْمَدْرَسَةِ؟ — أَبُو رَاشِدٍ.', 'ঐ মাদরাসার শিক্ষক কে? — রাশেদের আব্বা।', '৯৪')),
      introSentence(T('هَلْ بَابُ هَذَا الْبَيْتِ مُغْلَقٌ؟ لَا ، بَابُ هَذَا الْبَيْتِ مَفْتُوحٌ.', 'এই ঘরের দরজা কি বন্ধ? না, এই ঘরের দরজা খোলা।', '৯৫')),
      introSentence(T('أَ مَفْتُوحٌ بَابُ هَذَا الْبَيْتِ أَمْ مُغْلَقٌ؟', 'এই ঘরের দরজা কি খোলা না বন্ধ?', '৯৫')),
      introSentence(T('كَيْفَ مُؤَذِّنُ ذَلِكَ الْمَسْجِدِ؟ — هُوَ رَجُلٌ صَالِحٌ.', 'ঐ মসজিদের মুআযযিন কেমন? — সে সৎ লোক।', '৯৫')),
      match([W.imam, W.muallim, W.miftah, W.qufl], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l18-q-idafat', stageId: 'l18-idafat',
  title: 'ইযাফত (সম্বন্ধ)',
  table: [
    { arabic: 'إِمَامُ هَذَا الْمَسْجِدِ', bangla: 'এই মসজিদের ইমাম' },
    { arabic: 'مِفْتَاحُ ذَلِكَ الْقُفْلِ', bangla: 'ঐ তালার চাবি' },
    { arabic: 'بَابُ هَذَا الْبَيْتِ', bangla: 'এই ঘরের দরজা' },
  ],
  rule: 'দুটি শব্দ পরপর বসে সম্বন্ধ বোঝালে প্রথম শব্দের শেষে পেশ (ــُ) থাকে এবং পরের শব্দের শেষে যের (ــِ) হয়।',
  examples: [{ arabic: 'رَبُّ هَذَا الْبَيْتِ', bangla: 'এই ঘরের রব' }],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'প্রশ্নের উত্তর দাও', arabic: 'مَنْ رَبُّ هَذَا الْبَيْتِ؟', bangla: 'এই ঘরের রব কে?', mode: 'ar-to-bn', page: '৯৩' },
  { task: 'প্রশ্নোত্তর পড়ো ও অর্থ বলো', arabic: 'كَيْفَ إِمَامُ هَذَا الْمَسْجِدِ؟', bangla: 'এই মসজিদের ইমাম কেমন?', mode: 'ar-to-bn', page: '৯৪' },
];
const quizLegacy = [
  { question: "'مَلِكٌ' অর্থ কী?", options: ['বাদশাহ', 'সেবক', 'ইমাম'], correctIndex: 0, correctAnswer: 0, explanation: 'মালিক = বাদশাহ।', type: 'mcq' },
  { question: "'إِمَامُ هَذَا الْمَسْجِدِ' মানে?", options: ['এই মসজিদের ইমাম', 'এই মাদরাসার শিক্ষক', 'ঐ মসজিদের ইমাম'], correctIndex: 0, correctAnswer: 0, explanation: 'ইযাফত।', type: 'mcq' },
  { question: "'ظِلٌّ' অর্থ?", options: ['ছায়া', 'ছবি', 'গিলাফ'], correctIndex: 0, correctAnswer: 0, explanation: 'যিল্ল = ছায়া।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch3-l1',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৯২-৯৫', qaida,
    grammarRule: { title: 'ইদাফাত', summary: 'সম্বন্ধবাচক বাক্য গঠন', points: ['প্রথম শব্দে اَلْ বা তানভীন হয় না'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};
