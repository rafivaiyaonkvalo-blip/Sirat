// vol1-ch3-l2.cjs  |  দারস ২ — ৩য় অধ্যায়  |  পৃষ্ঠা ৯৭–৯৯
// বিষয়: মাওসুফ-সিফাত পূর্ণ রূপ (নির্দিষ্ট + অনির্দিষ্ট)

const W = {
  warda:    { arabic: 'وَرْدَةٌ',    bangla: 'একটি গোলাব' },
  ajib:     { arabic: 'عَجِيبٌ',     bangla: 'আশ্চর্যজনক' },
  libas:    { arabic: 'لِبَاسٌ',     bangla: 'পোশাক' },
  manzar:   { arabic: 'مَنْظَرٌ',    bangla: 'দৃশ্য' },
  madina:   { arabic: 'مَدِينَةٌ',   bangla: 'শহর' },
  kitab:    { arabic: 'كِتَابٌ',     bangla: 'একটি বই' },
  tilmidh:  { arabic: 'تِلْمِيذٌ',   bangla: 'একজন ছাত্র' },
  sayyara:  { arabic: 'سَيَّارَةٌ',  bangla: 'একটি গাড়ি' },
  ghurfa:   { arabic: 'غُرْفَةٌ',    bangla: 'একটি কামরা' },
  masjid:   { arabic: 'مَسْجِدٌ',    bangla: 'একটি মসজিদ' },
  bayt:     { arabic: 'بَيْتٌ',      bangla: 'একটি ঘর' },
  samaka:   { arabic: 'سَمَكَةٌ',   bangla: 'একটি মাছ' },
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

const SENT = {
  w1: T('وَرْدَةٌ كَبِيرَةٌ.',                                       'একটি বড় গোলাব।',                        '৯৭'),
  w2: T('اَلْوَرْدَةُ كَبِيرَةٌ.',                                      'গোলাবটি বড়।',                            '৯৭'),
  w3: T('اَلْوَرْدَةُ الْكَبِيرَةُ.',                                   'বড় গোলাবটি।',                            '৯৭'),
  w4: T('اَلْوَرْدَةُ الْكَبِيرَةُ جَمِيلَةٌ.',                        'বড় গোলাবটি সুন্দর।',                     '৯৭'),
  k1: T('هَذَا كِتَابٌ جَدِيدٌ.',                                      'এটি নতুন বই।',                            '৯৭'),
  k2: T('اَلْكِتَابُ الْجَدِيدُ.',                                      'নতুন বইটি।',                              '৯৭'),
  k3: T('اَلْكِتَابُ الْجَدِيدُ جَمِيلٌ.',                              'নতুন বইটি সুন্দর।',                       '৯৭'),
  k4: T('اَلْكِتَابُ الْجَدِيدُ عِنْدَ مَحْمُودٍ.',                    'নতুন বইটি মাহমুদের কাছে।',               '৯৭'),
  k5: T('فِي الْكِتَابِ الْجَدِيدِ قِصَّةٌ عَجِيبَةٌ.',               'নতুন বইয়ে একটি আশ্চর্য গল্প আছে।',      '৯৭'),
  k6: T('فِي هَذَا الْكِتَابِ الْجَدِيدِ صُورَةٌ جَمِيلَةٌ.',         'এই নতুন বইয়ে একটি সুন্দর ছবি আছে।',     '৯৭'),
  t1: T('هُوَ تِلْمِيذٌ ذَكِيٌّ.',                                     'সে মেধাবী ছাত্র।',                       '৯৭'),
  t2: T('اَلتِّلْمِيذُ الذَّكِيُّ صَالِحٌ.',                           'মেধাবী ছাত্রটি নেককার।',                 '৯৭'),
  t3: T('اَلتِّلْمِيذُ الذَّكِيُّ فِي غُرْفَةِ الْمُعَلِّمِ.',        'মেধাবী ছাত্রটি শিক্ষকের কামরায়।',       '৯৭'),
  t4: T('عِنْدَ التِّلْمِيذِ الذَّكِيِّ كِتَابٌ قَيِّمٌ.',            'মেধাবী ছাত্রটির কাছে একটি মূল্যবান বই আছে।', '৯৭'),
  t5: T('هَذَا التِّلْمِيذُ الذَّكِيُّ وَلَدُ مَاجِدٍ.',              'এই মেধাবী ছাত্রটি মাজেদের ছেলে।',        '৯৭'),
  s1: T('اَلسَّيَّارَةُ الْجَدِيدَةُ سَرِيعَةٌ.',                      'নতুন গাড়িটি দ্রুতগামী।',                 '৯৮'),
  s2: T('أَمَامَ هَذَا الْبَيْتِ سَيَّارَةٌ جَدِيدَةٌ.',               'এই ঘরের সামনে একটি নতুন গাড়ি আছে।',     '৯৮'),
  s3: T('صَاحِبُ هَذَا الْبَيْتِ فِي السَّيَّارَةِ الْجَدِيدَةِ.',     'এই ঘরের মালিক নতুন গাড়িতে আছে।',        '৯৮'),
  g1: T('غُرْفَةُ فَاطِمَةَ وَاسِعَةٌ.',                               'ফাতেমার কামরা প্রশস্ত।',                 '৯৮'),
  g2: T('فِي غُرْفَةِ فَاطِمَةَ مِرْوَحَةٌ جَيِّدَةٌ.',               'ফাতেমার কামরায় একটি ভালো পাখা আছে।',    '৯৮'),
  g3: T('اَلْمِرْوَحَةُ الْجَيِّدَةُ فِي غُرْفَةِ فَاطِمَةَ.',        'ভালো পাখাটি ফাতেমার কামরায়।',           '৯৮'),
  m1: T('اَلْمَسْجِدُ الْقَدِيمُ مَشْهُورٌ.',                          'পুরনো মসজিদটি প্রসিদ্ধ।',                 '৯৮'),
  m2: T('أَمَامَ الْمَسْجِدِ الْقَدِيمِ حَدِيقَةٌ.',                   'পুরনো মসজিদের সামনে একটি বাগান আছে।',    '৯৮'),
  m3: T('إِمَامُ الْمَسْجِدِ الْقَدِيمِ عَالِمٌ كَبِيرٌ.',            'পুরনো মসজিদের ইমাম বড় আলিম।',           '৯৮'),
  m4: T('عَمُّ مَاجِدٍ إِمَامُ الْمَسْجِدِ الْقَدِيمِ.',               'মাজেদের চাচা পুরনো মসজিদের ইমাম।',       '৯৮'),
  b1: T('اَلْبَيْتُ الْجَمِيلُ فِي الْعَاصِمَةِ.',                     'সুন্দর ঘরটি রাজধানীতে।',                  '৯৮'),
  b2: T('رَاشِدٌ صَاحِبُ الْبَيْتِ.',                                  'রাশেদ ঘরের মালিক।',                       '৯৮'),
  b3: T('صَاحِبُ هَذَا الْبَيْتِ الْجَمِيلِ تَاجِرٌ غَنِيٌّ.',        'এই সুন্দর ঘরের মালিক ধনী ব্যবসায়ী।',    '৯৮'),
  f1: T('اَلسَّمَكَةُ الْكَبِيرَةُ لَذِيذَةٌ.',                        'বড় মাছটি মজাদার।',                        '৯৮'),
  f2: T('هَذِهِ السَّمَكَةُ لَذِيذَةٌ جِدًّا.',                        'এই মাছটি খুব মজাদার।',                    '৯৮'),
  f3: T('اَلسَّمَكَةُ الْكَبِيرَةُ فِي حَوْضٍ كَبِيرٍ.',              'বড় মাছটি একটি বড় হাউজে।',               '৯৮'),
  f4: T('فِي الْحَوْضِ الْكَبِيرِ سَمَكَةٌ كَبِيرَةٌ.',               'বড় হাউজে একটি বড় মাছ আছে।',            '৯৮'),
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
    id: 'l19-words', titleBn: 'নতুন শব্দ', shortTitle: 'শব্দার্থ',
    titleAr: 'الْمُفْرَدَاتُ', desc: 'গোলাব, আশ্চর্যজনক; পোশাক, দৃশ্য, শহর',
    iconName: 'BookOpen', color: 'emerald', estMinutes: 3, bookPages: '৯৭, ১০০',
    steps: [
      intro(W.warda), intro(W.ajib), intro(W.libas), intro(W.manzar), intro(W.madina),
      match([W.warda, W.ajib, W.libas, W.manzar]),
      mcqWord(W.madina, ['দৃশ্য', 'পোশাক']),
      arabicOf(W.warda, ['سَمَكَةٌ', 'سَيَّارَةٌ']),
    ],
  },
  {
    id: 'l19-warda', titleBn: 'গোলাব: অপূর্ণ ও পূর্ণ কথা', shortTitle: 'গোলাব',
    titleAr: 'الْوَرْدَةُ الْكَبِيرَةُ', desc: 'বড় গোলাব → গোলাবটি বড় → বড় গোলাবটি → বড় গোলাবটি সুন্দর',
    iconName: 'Zap', color: 'violet', estMinutes: 4, bookPages: '৯৭',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের টেবিল: ধাপে ধাপে',
        table: [
          { label: 'অপূর্ণ কথা', arabic: 'وَرْدَةٌ كَبِيرَةٌ', bangla: 'একটি বড় গোলাব' },
          { label: 'পূর্ণ কথা', arabic: 'اَلْوَرْدَةُ كَبِيرَةٌ', bangla: 'গোলাবটি বড়' },
          { label: 'ال সহ অপূর্ণ', arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ', bangla: 'বড় গোলাবটি' },
          { label: 'পূর্ণ কথা', arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ جَمِيلَةٌ', bangla: 'বড় গোলাবটি সুন্দর' },
        ],
      },
      introSentence(SENT.w1), introSentence(SENT.w2), introSentence(SENT.w3), introSentence(SENT.w4),
      mcqWord({ arabic: 'اَلْوَرْدَةُ كَبِيرَةٌ.', bangla: 'গোলাবটি বড়।' }, ['একটি বড় গোলাব।', 'বড় গোলাবটি সুন্দর।'], 'বাক্যটির অর্থ কী?'),
      mcqWord({ arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ.', bangla: 'বড় গোলাবটি।' }, ['গোলাবটি বড়।', 'একটি বড় গোলাব।'], 'এটির অর্থ কী?'),
      fillBlank('اَلْوَرْدَةُ ___ جَمِيلَةٌ.', 'الْكَبِيرَةُ', ['كَبِيرَةٌ', 'الْكَبِيرُ'], 'বড় গোলাবটি সুন্দর'),
      sentenceBuilder(SENT.w4, ['كَبِيرٌ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.w2, ['الْكَبِيرَةُ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l19-kitab', titleBn: 'নতুন বই ও মেধাবী ছাত্র', shortTitle: 'বই ও ছাত্র',
    titleAr: 'الْكِتَابُ الْجَدِيدُ وَالتِّلْمِيذُ الذَّكِيُّ', desc: 'নতুন বইটি, মেধাবী ছাত্রটি',
    iconName: 'Star', color: 'teal', estMinutes: 5, bookPages: '৯৭',
    steps: [
      introSentence(SENT.k1), introSentence(SENT.k2), introSentence(SENT.k3), introSentence(SENT.k4),
      introSentence(SENT.k5), introSentence(SENT.k6),
      introSentence(SENT.t1), introSentence(SENT.t2), introSentence(SENT.t3), introSentence(SENT.t4), introSentence(SENT.t5),
      mcqWord({ arabic: 'اَلْكِتَابُ الْجَدِيدُ عِنْدَ مَحْمُودٍ.', bangla: 'নতুন বইটি মাহমুদের কাছে।' }, ['নতুন বইটি আমার কাছে।', 'পুরনো বইটি মাহমুদের কাছে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('___ الذَّكِيُّ صَالِحٌ.', 'اَلتِّلْمِيذُ', ['تِلْمِيذٌ', 'التِّلْمِيذَةُ'], 'ছাত্রটি'),
      sentenceBuilder(SENT.t2, ['الذَّكِيَّةُ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.k3, ['جَمِيلَةٌ', 'هَذِهِ', 'أَمْ']),
    ],
  },
  {
    id: 'l19-sayyara', titleBn: 'গাড়ি, কামরা, মসজিদ', shortTitle: 'গাড়ি-কামরা-মসজিদ',
    titleAr: 'السَّيَّارَةُ وَالْغُرْفَةُ وَالْمَسْجِدُ', desc: 'নতুন গাড়ি, ফাতেমার কামরা, পুরনো মসজিদ',
    iconName: 'MessageCircle', color: 'orange', estMinutes: 5, bookPages: '৯৮',
    steps: [
      introSentence(SENT.s1), introSentence(SENT.s2), introSentence(SENT.s3),
      introSentence(SENT.g1), introSentence(SENT.g2), introSentence(SENT.g3),
      introSentence(SENT.m1), introSentence(SENT.m2), introSentence(SENT.m3), introSentence(SENT.m4),
      mcqWord({ arabic: 'اَلسَّيَّارَةُ الْجَدِيدَةُ سَرِيعَةٌ.', bangla: 'নতুন গাড়িটি দ্রুতগামী।' }, ['পুরনো গাড়িটি দ্রুতগামী।', 'নতুন গাড়িটি ধীরগতির।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('إِمَامُ الْمَسْجِدِ ___ عَالِمٌ كَبِيرٌ.', 'الْقَدِيمِ', ['الْقَدِيمُ', 'قَدِيمٌ'], 'পুরনো মসজিদের ইমাম'),
      sentenceBuilder(SENT.g2, ['كَبِيرَةٌ', 'هَذِهِ', 'أَمْ']),
      sentenceBuilder(SENT.m1, ['الْجَدِيدُ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l19-bayt', titleBn: 'ঘর ও মাছ', shortTitle: 'ঘর ও মাছ',
    titleAr: 'الْبَيْتُ وَالسَّمَكَةُ', desc: 'রাজধানীর সুন্দর ঘর, বড় মাছ',
    iconName: 'Sparkles', color: 'cyan', estMinutes: 4, bookPages: '৯৮',
    steps: [
      introSentence(SENT.b1), introSentence(SENT.b2), introSentence(SENT.b3),
      introSentence(SENT.f1), introSentence(SENT.f2), introSentence(SENT.f3), introSentence(SENT.f4),
      mcqWord({ arabic: 'اَلسَّمَكَةُ الْكَبِيرَةُ فِي حَوْضٍ كَبِيرٍ.', bangla: 'বড় মাছটি একটি বড় হাউজে।' }, ['ছোট মাছটি বড় হাউজে।', 'বড় মাছটি ছোট হাউজে।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('اَلسَّمَكَةُ الْكَبِيرَةُ ___.', 'لَذِيذَةٌ', ['لَذِيذٌ', 'فَقِيرَةٌ'], 'মজাদার (স্ত্রী.)'),
      sentenceBuilder(SENT.f2, ['لَذِيذٌ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(SENT.b1, ['الْقَدِيمُ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l19-tamrin2', titleBn: 'তামরীন ২: লিবাস, মানযার, মাদীনা', shortTitle: 'তামরীন ২',
    titleAr: 'التَّمْرِينُ الثَّانِي', desc: 'একটি করে শব্দ নিয়ে এই পাঠের অনুকরণে বাক্য বানাও',
    iconName: 'PenLine', color: 'cyan', estMinutes: 4, bookPages: '১০০',
    steps: [
      intro(W.libas), intro(W.manzar), intro(W.madina),
      introSentence(T('لِبَاسٌ جَمِيلٌ.', 'একটি সুন্দর পোশাক।', '১০০')),
      introSentence(T('اَللِّبَاسُ الْجَمِيلُ غَالٍ.', 'সুন্দর পোশাকটি দামী।', '১০০')),
      introSentence(T('مَنْظَرٌ جَمِيلٌ.', 'একটি সুন্দর দৃশ্য।', '১০০')),
      introSentence(T('اَلْمَنْظَرُ الْجَمِيلُ فِي الْقَرْيَةِ.', 'সুন্দর দৃশ্যটি গ্রামে।', '১০০')),
      introSentence(T('مَدِينَةٌ كَبِيرَةٌ.', 'একটি বড় শহর।', '১০০')),
      introSentence(T('اَلْمَدِينَةُ الْكَبِيرَةُ مَشْهُورَةٌ.', 'বড় শহরটি প্রসিদ্ধ।', '১০০')),
      mcqWord({ arabic: 'اَلْمَنْظَرُ الْجَمِيلُ فِي الْقَرْيَةِ.', bangla: 'সুন্দর দৃশ্যটি গ্রামে।' }, ['সুন্দর গ্রামটি দৃশ্যে।', 'দৃশ্যটি সুন্দর।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('اَلْمَدِينَةُ ___ مَشْهُورَةٌ.', 'الْكَبِيرَةُ', ['كَبِيرَةٌ', 'الْكَبِيرُ'], 'বড় শহরটি প্রসিদ্ধ'),
      sentenceBuilder(T('اَلْمَدِينَةُ الْكَبِيرَةُ مَشْهُورَةٌ.', 'বড় শহরটি প্রসিদ্ধ।', '১০০'), ['الْكَبِيرُ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l19-tarkib', titleBn: 'তামরীন ৪: অপূর্ণ ↔ পূর্ণ কথা (তারকীব)', shortTitle: 'তামরীন ৪',
    titleAr: 'التَّمْرِينُ الرَّابِعُ', desc: 'গোলাব, মাহমূদ ব্যবসায়ী, যয়নাব শিক্ষিকা',
    iconName: 'Zap', color: 'orange', estMinutes: 5, bookPages: '১০১',
    steps: [
      {
        type: 'grammar_card', title: 'কিতাবের ডায়াগ্রাম ১: গোলাব',
        table: [
          { label: 'অপূর্ণ কথা (মাওসুফ+সিফাত)', arabic: 'وَرْدَةٌ كَبِيرَةٌ', bangla: 'একটি বড় গোলাব' },
          { label: 'পূর্ণ কথা (মুবতাদা+খবর)', arabic: 'اَلْوَرْدَةُ كَبِيرَةٌ', bangla: 'গোলাবটি বড়' },
          { label: 'অপূর্ণ কথা (ال দুটিতেই)', arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ', bangla: 'বড় গোলাবটি' },
          { label: 'পূর্ণ কথা', arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ جَمِيلَةٌ', bangla: 'বড় গোলাবটি সুন্দর' },
        ],
      },
      {
        type: 'grammar_card', title: 'কিতাবের ডায়াগ্রাম ২: মাহমূদ ব্যবসায়ী',
        table: [
          { label: 'পূর্ণ কথা (মুবতাদা+খবর)', arabic: 'مَحْمُودٌ تَاجِرٌ', bangla: 'মাহমূদ ব্যবসায়ী' },
          { label: 'অপূর্ণ কথা (মাওসুফ+সিফাত)', arabic: 'مَحْمُودٌ التَّاجِرُ', bangla: 'ব্যবসায়ী মাহমূদ' },
          { label: 'পূর্ণ কথা', arabic: 'مَحْمُودٌ التَّاجِرُ غَنِيٌّ', bangla: 'ব্যবসায়ী মাহমূদ ধনী' },
        ],
      },
      {
        type: 'grammar_card', title: 'কিতাবের ডায়াগ্রাম ৩: যয়নাব শিক্ষিকা',
        table: [
          { label: 'পূর্ণ কথা', arabic: 'زَيْنَبُ مُعَلِّمَةٌ', bangla: 'যয়নাব শিক্ষিকা' },
          { label: 'অপূর্ণ কথা', arabic: 'زَيْنَبُ الْمُعَلِّمَةُ', bangla: 'শিক্ষিকা যয়নাব' },
          { label: 'পূর্ণ কথা', arabic: 'زَيْنَبُ الْمُعَلِّمَةُ امْرَأَةٌ طَيِّبَةٌ', bangla: 'শিক্ষিকা যয়নাব ভালো নারী' },
        ],
      },
      mcqWord({ arabic: 'مَحْمُودٌ تَاجِرٌ.', bangla: 'মাহমূদ ব্যবসায়ী।' }, ['ব্যবসায়ী মাহমূদ', 'মাহমূদ ধনী।'], 'এটির অর্থ কী?'),
      mcqWord({ arabic: 'مَحْمُودٌ التَّاجِرُ.', bangla: 'ব্যবসায়ী মাহমূদ।' }, ['মাহমূদ ব্যবসায়ী।', 'ব্যবসায়ী মাহমূদ ধনী।'], 'এটির অর্থ কী?'),
      mcqWord({ arabic: 'زَيْنَبُ الْمُعَلِّمَةُ امْرَأَةٌ طَيِّبَةٌ.', bangla: 'শিক্ষিকা যয়নাব ভালো নারী।' }, ['যয়নাব শিক্ষিকা।', 'শিক্ষিকা যয়নাব।'], 'বাক্যটির অর্থ কী?'),
      fillBlank('مَحْمُودٌ ___ غَنِيٌّ.', 'التَّاجِرُ', ['تَاجِرٌ', 'التَّاجِرَةُ'], 'ব্যবসায়ী মাহমূদ ধনী'),
      fillBlank('زَيْنَبُ ___ امْرَأَةٌ طَيِّبَةٌ.', 'الْمُعَلِّمَةُ', ['مُعَلِّمَةٌ', 'الْمُعَلِّمُ'], 'শিক্ষিকা যয়নাব ভালো নারী'),
      sentenceBuilder(T('مَحْمُودٌ التَّاجِرُ غَنِيٌّ.', 'ব্যবসায়ী মাহমূদ ধনী।', '১০১'), ['تَاجِرٌ', 'هَذَا', 'أَمْ']),
      sentenceBuilder(T('زَيْنَبُ الْمُعَلِّمَةُ امْرَأَةٌ طَيِّبَةٌ.', 'শিক্ষিকা যয়নাব ভালো নারী।', '১০১'), ['مُعَلِّمَةٌ', 'هَذَا', 'أَمْ']),
    ],
  },
  {
    id: 'l19-tamrin', titleBn: 'তামরীন ১: প্রশ্নের উত্তর দাও', shortTitle: 'তামরীন',
    titleAr: 'التَّمْرِينُ الْأَوَّلُ', desc: 'কিতাবের প্রশ্নগুলো পড়ো ও অর্থ বলো',
    iconName: 'PenLine', color: 'amber', estMinutes: 5, bookPages: '৯৯–১০০',
    steps: [
      introSentence(T('كَيْفَ الْوَرْدَةُ؟ أَ كَبِيرَةٌ هِيَ أَمْ صَغِيرَةٌ؟', 'গোলাবটি কেমন? সেটি কি বড় না ছোট?', '৯৯')),
      introSentence(T('هَلِ الْوَرْدَةُ الْكَبِيرَةُ جَمِيلَةٌ؟', 'বড় গোলাবটি কি সুন্দর?', '৯৯')),
      introSentence(T('كَيْفَ الْكِتَابُ الْجَدِيدُ؟ هَلِ الْكِتَابُ الْجَدِيدُ عِنْدَ مَحْمُودٍ؟', 'নতুন বইটি কেমন? নতুন বইটি কি মাহমুদের কাছে?', '৯৯')),
      introSentence(T('عِنْدَ مَنِ الْكِتَابُ الْجَدِيدُ؟ مَاذَا فِي الْكِتَابِ الْجَدِيدِ؟', 'নতুন বইটি কার কাছে? নতুন বইয়ে কী আছে?', '৯৯')),
      introSentence(T('هَلِ التِّلْمِيذُ ذَكِيٌّ؟ هَلِ التِّلْمِيذُ الذَّكِيُّ مُجْتَهِدٌ؟', 'ছাত্রটি কি মেধাবী? মেধাবী ছাত্রটি কি পরিশ্রমী?', '৯৯')),
      introSentence(T('أَيْنَ التِّلْمِيذُ الذَّكِيُّ؟ أَ فِي غُرْفَةِ الْمُعَلِّمِ هُوَ أَمْ فِي الْفَصْلِ؟', 'মেধাবী ছাত্রটি কোথায়? সে কি শিক্ষকের কামরায় না শ্রেণীকক্ষে?', '৯৯')),
      introSentence(T('كَيْفَ السَّيَّارَةُ الْجَدِيدَةُ؟ مَاذَا أَمَامَ هَذَا الْبَيْتِ؟', 'নতুন গাড়িটি কেমন? এই ঘরের সামনে কী আছে?', '৯৯')),
      introSentence(T('كَيْفَ غُرْفَةُ فَاطِمَةَ؟ أَ وَاسِعَةٌ هِيَ أَمْ ضَيِّقَةٌ؟', 'ফাতেমার কামরা কেমন? সেটি কি প্রশস্ত না সংকীর্ণ?', '৯৯')),
      introSentence(T('مَنْ إِمَامُ الْمَسْجِدِ الْقَدِيمِ؟ كَيْفَ إِمَامُ الْمَسْجِدِ الْقَدِيمِ؟', 'পুরনো মসজিদের ইমাম কে? পুরনো মসজিদের ইমাম কেমন?', '১০০')),
      introSentence(T('مَنْ صَاحِبُ هَذَا الْبَيْتِ؟ هَلْ صَاحِبُ هَذَا الْبَيْتِ تَاجِرٌ؟', 'এই ঘরের মালিক কে? এই ঘরের মালিক কি ব্যবসায়ী?', '১০০')),
      introSentence(T('هَلْ هَذِهِ سَمَكَةٌ كَبِيرَةٌ؟ هَلِ السَّمَكَةُ الْكَبِيرَةُ لَذِيذَةٌ؟', 'এটি কি বড় মাছ? বড় মাছটি কি মজাদার?', '১০০')),
      match([W.warda, W.libas, W.manzar, W.madina], 'শেষ পর্যালোচনা'),
    ],
  },
];

const qaida = [{
  id: 'l19-q-sifa', stageId: 'l19-warda',
  title: 'অপূর্ণ ও পূর্ণ কথা (মাওসুফ-সিফাত)',
  table: [
    { arabic: 'وَرْدَةٌ كَبِيرَةٌ', bangla: 'একটি বড় গোলাব (অপূর্ণ কথা)' },
    { arabic: 'اَلْوَرْدَةُ كَبِيرَةٌ', bangla: 'গোলাবটি বড় (পূর্ণ কথা)' },
    { arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ', bangla: 'বড় গোলাবটি (অপূর্ণ কথা)' },
    { arabic: 'اَلْوَرْدَةُ الْكَبِيرَةُ جَمِيلَةٌ', bangla: 'বড় গোলাবটি সুন্দর (পূর্ণ কথা)' },
  ],
  rule: 'বিশেষ্য ও বিশেষণ দুটোতেই ال থাকলে অপূর্ণ কথা; একটিতে ال থাকলে পূর্ণ কথা।',
  examples: [{ arabic: 'اَلْكِتَابُ الْجَدِيدُ جَمِيلٌ.', bangla: 'নতুন বইটি সুন্দর।' }],
}];

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT);
const dialogues = [];
const tamrinKitabi = [
  { task: 'উপরের বাক্যগুলোর আলোকে উত্তর দাও', arabic: 'كَيْفَ الْوَرْدَةُ؟ أَ كَبِيرَةٌ هِيَ أَمْ صَغِيرَةٌ؟', bangla: 'গোলাবটি কেমন? সেটি কি বড় না ছোট?', mode: 'ar-to-bn', page: '৯৯' },
  { task: 'উপরের বাক্যগুলোর আলোকে উত্তর দাও', arabic: 'مَنْ صَاحِبُ هَذَا الْبَيْتِ؟', bangla: 'এই ঘরের মালিক কে?', mode: 'ar-to-bn', page: '১০০' },
];
const quizLegacy = [
  { question: "'اَلْوَرْدَةُ الْكَبِيرَةُ' অর্থ কী?", options: ['বড় গোলাবটি', 'গোলাবটি বড়', 'একটি বড় গোলাব'], correctIndex: 0, correctAnswer: 0, explanation: 'দুটিতেই ال = অপূর্ণ কথা।', type: 'mcq' },
  { question: "'مَدِينَةٌ' অর্থ?", options: ['শহর', 'দৃশ্য', 'পোশাক'], correctIndex: 0, correctAnswer: 0, explanation: 'মাদীনা = শহর।', type: 'mcq' },
  { question: "'عَجِيبٌ' অর্থ?", options: ['আশ্চর্যজনক', 'সুন্দর', 'বড়'], correctIndex: 0, correctAnswer: 0, explanation: 'আজীব = আশ্চর্যজনক।', type: 'mcq' },
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch3-l2',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ৯৭-১০০', qaida,
    grammarRule: { title: 'মাওসুফ-সিফাত', summary: 'নির্দিষ্ট ও অনির্দিষ্ট রূপ', points: ['উভয় শব্দ নির্দিষ্ট বা অনির্দিষ্ট হতে হয়'] },
    vocabulary, sentences, dialogues, tamrinKitabi, quiz: quizLegacy, bookStages,
  },
};
