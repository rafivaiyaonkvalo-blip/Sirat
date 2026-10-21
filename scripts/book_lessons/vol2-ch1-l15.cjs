// vol2-ch1-l15.cjs (বইয়ের ১৩শ দারস: الدَّرْسُ الثَّالِثَ عَشَرَ) | বইয়ের পৃ. ৬৩ (PDF ১৬৫)
// বিষয়: كَانَ + মুযারী (অতীত অভ্যাস: সে পড়তো)
const H = require('../lib/dars_helpers.cjs');
const { T, intro, introSentence, match, mcqWord, arabicOf, fillBlank, sentenceBuilder, card, stage } = H;

const V = [
  ['كَانَ يَلْعَبُ', 'সে খেলতো'], ['كَانَ يَعْرِفُ', 'সে চিনতো'], ['كَانَ يَكْتُبُ', 'সে লিখতো'], ['كَانَ يَسْأَلُ', 'সে জিজ্ঞেস করতো'],
  ['كَانَ يُطْعِمُ', 'সে খাওয়াতো'], ['كَانَ يُرْسِلُ', 'সে পাঠাতো'], ['كَانَ يُكْرِمُ', 'সে সম্মান করতো'], ['كَانَ يُنْفِقُ', 'সে খরচ করতো'],
  ['كَانَ يَخَافُ', 'সে ভয় করতো'], ['كَانَ يَتُوبُ', 'সে তাওবা করতো'], ['كَانَ يَبِيعُ', 'সে বিক্রি করতো'], ['كَانَ يَصِيدُ', 'সে শিকার করতো'],
  ['كَانَ يُطِيعُ', 'সে আনুগত্য করতো'], ['كَانَ يُجِيبُ', 'সে উত্তর দিতো'], ['كَانَ يُرِيدُ', 'সে চাইতো'],
];
const ORD = [
  ['كَانَ يَكْتُبُ رَاشِدٌ — كَانَ رَاشِدٌ يَكْتُبُ — رَاشِدٌ كَانَ يَكْتُبُ', 'রাশেদ লিখতো (শব্দক্রমের তিনটি রূপ)'],
  ['كَانَتْ تَكْتُبُ فَاطِمَةُ — كَانَتْ فَاطِمَةُ تَكْتُبُ — فَاطِمَةُ كَانَتْ تَكْتُبُ', 'ফাতেমা লিখতো (শব্দক্রমের তিনটি রূপ)'],
];

const stages = [
  stage({ id: 'v2l13-kana', titleBn: 'كَانَ يَقْرَأُ — সে পড়তো (পৃ. ৬৩)', shortTitle: 'كَانَ يَقْرَأُ',
    titleAr: 'كَانَ + الْمُضَارِعُ', desc: 'সে পড়তো — তুমি পড়তে — আমি পড়তাম',
    iconName: 'Zap', color: 'violet', estMinutes: 6, bookPages: '৬৩' }, [
    card('কিতাবের টেবিল', [
      { label: 'সে পড়তো', arabic: 'كَانَ يَقْرَأُ — كَانَتْ تَقْرَأُ', bangla: 'সে (পুরুষ — নারী) পড়তো' },
      { label: 'তুমি পড়তে', arabic: 'كُنْتَ تَقْرَأُ — كُنْتِ تَقْرَئِينَ', bangla: 'তুমি (পুরুষ — নারী) পড়তে' },
      { label: 'আমি পড়তাম', arabic: 'كُنْتُ أَقْرَأُ', bangla: 'আমি পড়তাম' },
    ]),
    ...V.slice(0, 8).map(([a, b]) => introSentence(T(a, b, '৬৩'))),
    mcqWord({ arabic: 'كُنْتُ أَقْرَأُ', bangla: 'আমি পড়তাম' }, ['তুমি পড়তে', 'সে পড়তো'], 'অর্থ কী?'),
    mcqWord({ arabic: 'كُنْتِ تَقْرَئِينَ', bangla: 'তুমি (নারী) পড়তে' }, ['তুমি (পুরুষ) পড়তে', 'আমি পড়তাম'], 'অর্থ কী?'),
    fillBlank('كُنْتُ ___.', 'أَقْرَأُ', ['تَقْرَأُ', 'يَقْرَأُ'], 'আমি পড়ি'),
  ]),
  stage({ id: 'v2l13-more', titleBn: 'আরও ফেয়েল (পৃ. ৬৩)', shortTitle: 'আরও ফেয়েল',
    titleAr: 'تَدْرِيبٌ', desc: 'খেলতো, চিনতো, লিখতো…',
    iconName: 'Star', color: 'teal', estMinutes: 6, bookPages: '৬৩' }, [
    ...V.slice(8).map(([a, b]) => introSentence(T(a, b, '৬৩'))),
    ...ORD.map(([a, b]) => introSentence(T(a, b, '৬৩'))),
    mcqWord({ arabic: V[10][0], bangla: V[10][1] }, [V[11][1], V[9][1]], 'অর্থ কী?'),
    mcqWord({ arabic: V[13][0], bangla: V[13][1] }, [V[12][1], V[14][1]], 'অর্থ কী?'),
    mcqWord({ arabic: V[3][0], bangla: V[3][1] }, [V[2][1], V[5][1]], 'অর্থ কী?'),
    fillBlank('كَانَ ___ يَكْتُبُ.', 'رَاشِدٌ', ['رَاشِدًا', 'رَاشِدٍ'], 'রাশেদ'),
    sentenceBuilder(T('كَانَتْ فَاطِمَةُ تَكْتُبُ.', 'ফাতেমা লিখতো।', '৬৩'), ['يَكْتُبُ', 'كَانَ', 'رَاشِدٌ']),
  ]),
  stage({ id: 'v2l13-review', titleBn: 'পর্যালোচনা', shortTitle: 'পর্যালোচনা',
    titleAr: 'مُرَاجَعَةٌ', desc: 'অতীত অভ্যাসের রূপ মেলাও',
    iconName: 'Trophy', color: 'amber', estMinutes: 4, bookPages: '৬৩' }, [
    match(V.slice(0, 4).map(([arabic, bangla]) => ({ arabic, bangla }))),
    match(V.slice(4, 8).map(([arabic, bangla]) => ({ arabic, bangla }))),
    match(V.slice(8, 12).map(([arabic, bangla]) => ({ arabic, bangla }))),
    match(V.slice(11).map(([arabic, bangla]) => ({ arabic, bangla }))),
    mcqWord({ arabic: V[6][0], bangla: V[6][1] }, [V[7][1], V[8][1]], 'অর্থ কী?'),
    mcqWord({ arabic: V[9][0], bangla: V[9][1] }, [V[10][1], V[1][1]], 'অর্থ কী?'),
  ]),
];

module.exports = H.build({
  id: 'vol2-ch1-l15', title: '১৩শ দারস: كَانَ + মুযারী (অতীত অভ্যাস)', subTitle: 'الدَّرْسُ الثَّالِثَ عَشَرَ — كَانَ يَقْرَأُ',
  pages: 'পৃষ্ঠা ৬৩ (২য় খণ্ড)', stages,
  vocabulary: V.map(([arabic, bangla]) => ({ arabic, bangla })),
  sentences: V.map(([arabic, bangla]) => ({ arabic, bangla, page: '৬৩' })),
  quiz: [
    { question: "'كُنْتُ أَقْرَأُ' অর্থ কী?", options: ['আমি পড়তাম', 'আমি পড়েছি', 'আমি পড়ব'], correctIndex: 0, correctAnswer: 0, explanation: 'كَانَ + মুযারী = অতীত অভ্যাস।', type: 'mcq' },
    { question: "'كَانَ يَبِيعُ' অর্থ?", options: ['সে বিক্রি করতো', 'সে বিক্রি করেছে', 'সে বিক্রি করবে'], correctIndex: 0, correctAnswer: 0, explanation: 'كَانَ يَبِيعُ।', type: 'mcq' },
  ]
});
