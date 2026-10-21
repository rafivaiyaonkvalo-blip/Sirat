// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ২য় দারস (বই পৃষ্ঠা ২২–২৪, PDF পৃষ্ঠা ২০–২২)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ। অনুশীলনগুলো এই দারসের কিতাবী শব্দ/বাক্য দিয়েই তৈরি।

// বিশেষণ (কিতাবের টেবিল, পৃ. ২২): পুরুষবাচক - স্ত্রীবাচক
const A = {
  jadid: { m: 'جَدِيدٌ', f: 'جَدِيدَةٌ', bn: 'নতুন' },
  qadim: { m: 'قَدِيمٌ', f: 'قَدِيمَةٌ', bn: 'পুরোনো' },
  jamil: { m: 'جَمِيلٌ', f: 'جَمِيلَةٌ', bn: 'সুন্দর' },
  kabir: { m: 'كَبِيرٌ', f: 'كَبِيرَةٌ', bn: 'বড়' },
  saghir: { m: 'صَغِيرٌ', f: 'صَغِيرَةٌ', bn: 'ছোট' },
  jayyid: { m: 'جَيِّدٌ', f: 'جَيِّدَةٌ', bn: 'ভালো' },
  nazif: { m: 'نَظِيفٌ', f: 'نَظِيفَةٌ', bn: 'পরিচ্ছন্ন' },
  wasikh: { m: 'وَسِخٌ', f: 'وَسِخَةٌ', bn: 'ময়লা' }
};

// বিশেষ্য (g: m = পুরুষবাচক, f = স্ত্রীবাচক)
const W = {
  // আগের দারসের শব্দ (এই দারসের বাক্যে এসেছে)
  book: { arabic: 'كِتَابٌ', bangla: 'একটি বই', picture: 'book', g: 'm' },
  notebook: { arabic: 'كُرَّاسَةٌ', bangla: 'একটি খাতা', picture: 'notebook', g: 'f' },
  mosque: { arabic: 'مَسْجِدٌ', bangla: 'একটি মসজিদ', picture: 'mosque', g: 'm' },
  madrasa: { arabic: 'مَدْرَسَةٌ', bangla: 'একটি মাদরাসা', picture: 'madrasa', g: 'f' },
  house: { arabic: 'بَيْتٌ', bangla: 'একটি ঘর', picture: 'house', g: 'm' },
  room: { arabic: 'حُجْرَةٌ', bangla: 'একটি কামরা', picture: 'room', g: 'f' },
  lamp: { arabic: 'مِصْبَاحٌ', bangla: 'একটি বাতি', picture: 'lamp', g: 'm' },
  clock: { arabic: 'سَاعَةٌ', bangla: 'একটি ঘড়ি', picture: 'clock', g: 'f' },
  lock: { arabic: 'قُفْلٌ', bangla: 'একটি তালা', picture: 'lock', g: 'm' },
  key: { arabic: 'مِفْتَاحٌ', bangla: 'একটি চাবি', picture: 'key', g: 'm' },
  door: { arabic: 'بَابٌ', bangla: 'একটি দরজা', picture: 'door', g: 'm' },
  bed: { arabic: 'سَرِيرٌ', bangla: 'একটি খাট', picture: 'bed', g: 'm' },
  bag: { arabic: 'حَقِيبَةٌ', bangla: 'একটি ব্যাগ', picture: 'bag', g: 'f' },
  umbrella: { arabic: 'مِظَلَّةٌ', bangla: 'একটি ছাতা', picture: 'umbrella', g: 'f' },
  glasses: { arabic: 'نَظَّارَةٌ', bangla: 'একটি চশমা', picture: 'glasses', g: 'f' },
  blackboard: { arabic: 'سَبُّورَةٌ', bangla: 'একটি ব্লাকবোর্ড', picture: 'blackboard', g: 'f' },

  // নতুন শব্দ (পৃ. ২২ পাদটীকা)
  flag: { arabic: 'عَلَمٌ', bangla: 'একটি পতাকা', picture: 'flag', g: 'm' },
  fan: { arabic: 'مِرْوَحَةٌ', bangla: 'একটি পাখা', picture: 'fan', g: 'f' },
  garden: { arabic: 'حَدِيقَةٌ', bangla: 'একটি বাগান', picture: 'garden', g: 'f' },

  // নতুন শব্দ (পৃ. ২৪)
  bedding: { arabic: 'فِرَاشٌ', bangla: 'একটি বিছানা', picture: 'bedding', g: 'm' },
  pillow: { arabic: 'وِسَادَةٌ', bangla: 'একটি বালিশ', picture: 'pillow', g: 'f' },
  shirt: { arabic: 'قَمِيصٌ', bangla: 'একটি জামা', picture: 'shirt', g: 'm' },
  cap: { arabic: 'قَلَنْسُوَةٌ', bangla: 'একটি টুপি', picture: 'cap', g: 'f' },
  clothing: { arabic: 'لِبَاسٌ', bangla: 'একটি পোশাক', picture: 'clothing', g: 'm' },
  turban: { arabic: 'عِمَامَةٌ', bangla: 'একটি পাগড়ী', picture: 'turban', g: 'f' },
  handkerchief: { arabic: 'مِنْدِيلٌ', bangla: 'একটি রুমাল', picture: 'handkerchief', g: 'm' },
  shoe: { arabic: 'حِذَاءٌ', bangla: 'একটি জুতা', picture: 'shoe', g: 'm' }
};

const DEM = {
  'هٰذَا': { bn: 'ইহা', distance: 'near' },
  'هٰذِهِ': { bn: 'ইহা', distance: 'near' },
  'ذٰلِكَ': { bn: 'উহা', distance: 'far' },
  'تِلْكَ': { bn: 'উহা', distance: 'far' }
};

// "একটি বই" + "নতুন" → "একটি নতুন বই"
const bnPhrase = (key, adj) => W[key].bangla.replace('একটি ', `একটি ${A[adj].bn} `);
const adjFor = (key, adj) => A[adj][W[key].g];

// বিশেষ্য + বিশেষণ (যেমন كِتَابٌ جَدِيدٌ)
function P(key, adj) {
  return {
    arabic: `${W[key].arabic} ${adjFor(key, adj)}`,
    bangla: bnPhrase(key, adj),
    picture: W[key].picture
  };
}

// ইশারা + বিশেষ্য (+ বিশেষণ) দিয়ে কিতাবের বাক্য
function S(dem, key, adj, page) {
  const word = W[key];
  return {
    arabic: adj ? `${dem} ${word.arabic} ${adjFor(key, adj)}` : `${dem} ${word.arabic}`,
    bangla: `${DEM[dem].bn} ${adj ? bnPhrase(key, adj) : word.bangla}`,
    picture: word.picture,
    distance: DEM[dem].distance,
    page
  };
}

// কিতাবের বাক্য (ক্রম অনুযায়ী)
const SENT = {
  // পৃ. ২৩ — ছবির সাথে
  hadhaKitabJadid: { ...S('هٰذَا', 'book', 'jadid', '২৩'), bangla: 'ইহা (একটি) নতুন বই' },
  tilkaSaaJadida: S('تِلْكَ', 'clock', 'jadid', '২৩'),
  dhalikaAlamJamil: S('ذٰلِكَ', 'flag', 'jamil', '২৩'),
  hadhihiMirwahaJayyida: S('هٰذِهِ', 'fan', 'jayyid', '২৩'),
  tilkaHaqibaSaghira: S('تِلْكَ', 'bag', 'saghir', '২৩'),
  tilkaHaqibaJamila: S('تِلْكَ', 'bag', 'jamil', '২৩'),
  // পৃ. ২৪ — ছবির সাথে
  hadhaBaytSaghir: S('هٰذَا', 'house', 'saghir', '২৪'),
  dhalikaMasjidKabir: S('ذٰلِكَ', 'mosque', 'kabir', '২৪'),
  hadhihiMizallaQadima: S('هٰذِهِ', 'umbrella', 'qadim', '২৪'),
  tilkaNazzaraJadida: S('تِلْكَ', 'glasses', 'jadid', '২৪'),
  hadhaSarir: S('هٰذَا', 'bed', null, '২৪'),
  dhalikaQufl: S('ذٰلِكَ', 'lock', null, '২৪'),
  // পৃ. ২৪ — পড়ার অনুচ্ছেদ
  hadhaMasjidJadid: S('هٰذَا', 'mosque', 'jadid', '২৪'),
  hadhaQuflJayyid: S('هٰذَا', 'lock', 'jayyid', '২৪'),
  hadhaFirashNazif: S('هٰذَا', 'bedding', 'nazif', '২৪'),
  tilkaHujraNazifa: S('تِلْكَ', 'room', 'nazif', '২৪'),
  dhalikaMandilSaghir: S('ذٰلِكَ', 'handkerchief', 'saghir', '২৪'),
  hadhihiImamaJadida: S('هٰذِهِ', 'turban', 'jadid', '২৪'),
  hadhaQamisJadid: S('هٰذَا', 'shirt', 'jadid', '২৪'),
  tilkaQalansuwaJadida: S('تِلْكَ', 'cap', 'jadid', '২৪'),
  hadhaLibasNazif: S('هٰذَا', 'clothing', 'nazif', '২৪'),
  dhalikaHidhaSaghir: S('ذٰلِكَ', 'shoe', 'saghir', '২৪'),
  hadhihiWisadaJamila: S('هٰذِهِ', 'pillow', 'jamil', '২৪'),
  dhalikaMiftahSaghir: S('ذٰلِكَ', 'key', 'saghir', '২৪'),
  hadhihiSabburaWasikha: S('هٰذِهِ', 'blackboard', 'wasikh', '২৪'),
  dhalikaMandilWasikh: S('ذٰلِكَ', 'handkerchief', 'wasikh', '২৪')
};

// ---------- ধাপ তৈরির ছোট সহায়ক ----------

const intro = (item, title = 'নতুন শব্দ') => ({
  type: 'intro',
  title,
  word: { arabic: item.arabic, bangla: item.bangla },
  picture: item.picture,
  distance: item.distance
});

const introAdj = (adj) => intro({ arabic: `${A[adj].m} - ${A[adj].f}`, bangla: A[adj].bn }, 'নতুন বিশেষণ');
const introPhrase = (key, adj) => intro(P(key, adj), 'কিতাবের শব্দজোড়');
const introSentence = (sent) => intro(sent, 'কিতাবের বাক্য');

const match = (keys, title = 'শব্দজোড় মেলান') => ({
  type: 'match_pairs',
  title,
  pairs: keys.map(k => ({ arabic: W[k].arabic, bangla: W[k].bangla }))
});

const matchAdj = (adjs, title = 'বিশেষণ ও অর্থ মেলান') => ({
  type: 'match_pairs',
  title,
  pairs: adjs.map(a => ({ arabic: A[a].m, bangla: A[a].bn }))
});

const pictureChoice = (correctKey, otherKeys, title = 'ছবি দেখে সঠিক উত্তর দিন') => ({
  type: 'picture_choice',
  title,
  targetArabic: W[correctKey].arabic,
  options: [correctKey, ...otherKeys].map((k, i) => ({
    text: W[k].arabic,
    bangla: W[k].bangla,
    picture: W[k].picture,
    isCorrect: i === 0
  }))
});

const adjMeaningMcq = (adj, wrongAdjs) => ({
  type: 'mcq',
  word: { arabic: `${A[adj].m} - ${A[adj].f}`, bangla: A[adj].bn },
  question: 'শব্দটির অর্থ কী?',
  options: [adj, ...wrongAdjs].map((a, i) => ({ text: A[a].bn, isCorrect: i === 0 }))
});

// বিশেষ্যের পরে সঠিক রূপের বিশেষণ বসানো (তামরীন খ)
const fillAdj = (key, adj, title = 'শূন্যস্থানে উপযুক্ত শব্দ বসাও') => {
  const right = adjFor(key, adj);
  const wrong = A[adj][W[key].g === 'm' ? 'f' : 'm'];
  return {
    type: 'fill_blank',
    title,
    targetBangla: bnPhrase(key, adj),
    fullArabic: `${W[key].arabic} ${right}`,
    tokensBefore: [W[key].arabic],
    tokensAfter: [],
    missingToken: right,
    picture: W[key].picture,
    options: [{ text: right, isCorrect: true }, { text: wrong, isCorrect: false }]
  };
};

// বিশেষণের আগে সঠিক বিশেষ্য বসানো (তামরীন খ)
const fillNoun = (key, wrongKey, adj, title = 'শূন্যস্থানে উপযুক্ত শব্দ বসাও') => ({
  type: 'fill_blank',
  title,
  targetBangla: `কোন শব্দের সাথে ${adjFor(key, adj)} (${A[adj].bn}) মিলবে?`,
  fullArabic: `${W[key].arabic} ${adjFor(key, adj)}`,
  tokensBefore: [],
  tokensAfter: [adjFor(key, adj)],
  missingToken: W[key].arabic,
  options: [{ text: W[key].arabic, isCorrect: true }, { text: W[wrongKey].arabic, isCorrect: false }]
});

// বাক্যের ইশারা শব্দটি খালি রেখে পূরণ
const fillDemonstrative = (sent, wrongDems, title = 'ছবি দেখে খালি জায়গা পূরণ করুন') => {
  const [dem, ...rest] = sent.arabic.split(' ');
  return {
    type: 'fill_blank',
    title,
    targetBangla: sent.bangla,
    fullArabic: sent.arabic,
    tokensBefore: [],
    tokensAfter: rest,
    missingToken: dem,
    picture: sent.picture,
    distance: sent.distance,
    options: [dem, ...wrongDems].map((t, i) => ({ text: t, isCorrect: i === 0 }))
  };
};

// বাক্যের শেষের বিশেষণটি খালি রেখে পূরণ (পুং/স্ত্রী রূপ বাছাই)
const fillSentenceAdj = (sent, wrongAdj, title = 'বাক্যটি পূরণ করুন') => {
  const tokens = sent.arabic.split(' ');
  const last = tokens.pop();
  return {
    type: 'fill_blank',
    title,
    targetBangla: sent.bangla,
    fullArabic: sent.arabic,
    tokensBefore: tokens,
    tokensAfter: [],
    missingToken: last,
    picture: sent.picture,
    distance: sent.distance,
    options: [{ text: last, isCorrect: true }, { text: wrongAdj, isCorrect: false }]
  };
};

// বাক্য/শব্দজোড়ের অর্থ বাছাই (MCQ)
const meaningOf = (item, wrongBanglas, question = 'বাক্যটির অর্থ কী?') => ({
  type: 'mcq',
  word: { arabic: item.arabic, bangla: item.bangla },
  question,
  options: [item.bangla, ...wrongBanglas].map((text, i) => ({ text, isCorrect: i === 0 }))
});

// বাংলা দেখে সঠিক আরবি বাছাই (MCQ)
const arabicOf = (item, wrongArabics, question = 'এর আরবি কোনটি?') => ({
  type: 'mcq',
  word: { arabic: item.bangla, bangla: item.bangla },
  question: `"${item.bangla}" ${question}`,
  options: [item.arabic, ...wrongArabics].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const build = (sent, distractors) => ({
  type: 'sentence_builder',
  title: 'কিতাবের বাক্য সাজান',
  targetArabic: sent.arabic,
  targetBangla: sent.bangla,
  targetTokens: sent.arabic.split(' '),
  distractors,
  picture: sent.picture,
  distance: sent.distance
});

// কার্ডে শুধু বিশেষ্য; কোন রূপের বিশেষণ বসবে তা বাছাই
const sortNoun = (key, adj) => ({
  arabic: W[key].arabic,
  bangla: bnPhrase(key, adj),
  picture: W[key].picture,
  reveal: `${W[key].arabic} ${adjFor(key, adj)}`,
  group: W[key].g
});

const sortAdjGroups = (adj, keys, title) => ({
  type: 'sort_groups',
  title: title || `${A[adj].m} না ${A[adj].f}? ঠিক দলে রাখুন`,
  groups: [
    { id: 'm', arabic: A[adj].m },
    { id: 'f', arabic: A[adj].f }
  ],
  items: keys.map(k => sortNoun(k, adj))
});

const spot = (targetBangla, right, wrong, why) => ({
  type: 'spot_error',
  title: 'কোন বাক্যটি কিতাবের মতো শুদ্ধ?',
  targetBangla,
  options: [
    { text: right, isCorrect: true, explanation: `কিতাবে আছে: ${right}` },
    { text: wrong, isCorrect: false, explanation: why }
  ]
});

const quiz = (question, options, explanation) => ({
  type: 'quiz_challenge',
  question,
  explanation,
  options: options.map((text, i) => ({ text, isCorrect: i === 0 }))
});

// অপশন সর্বোচ্চ ৩টি রাখা হয় (সঠিক উত্তরসহ), যাতে প্রশ্ন ছোট ও পরিষ্কার থাকে
const MAX_OPTIONS = 3;
const trimOptions = (step) => {
  // ছবির প্রশ্নে ৪টি অপশন থাকলে দেখতে ভালো লাগে, তাই সেগুলো কমানো হয় না
  if (step.type === 'picture_choice') return step;
  if (!Array.isArray(step.options) || step.options.length <= MAX_OPTIONS) return step;
  const correct = step.options.filter(o => o.isCorrect);
  const wrong = step.options.filter(o => !o.isCorrect).slice(0, MAX_OPTIONS - correct.length);
  return { ...step, options: [...correct, ...wrong] };
};

const stage = (meta, steps) => ({ ...meta, steps: steps.map(trimOptions) });

// ---------- পর্বসমূহ (কিতাবের ক্রমে) ----------

const bookStages = [
  stage(
    {
      id: 'l2-words-adj',
      titleBn: 'শব্দার্থ: বিশেষণ',
      shortTitle: 'বিশেষণ',
      titleAr: 'الصِّفَاتُ',
      desc: 'নতুন, পুরোনো, সুন্দর, বড়, ছোট ও ভালো — দুই রূপে',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '২২'
    },
    [
      {
        type: 'grammar_card',
        title: 'কিতাবের শব্দতালিকা',
        table: ['jadid', 'qadim', 'jamil', 'kabir', 'saghir', 'jayyid'].map(a => ({
          arabic: `${A[a].m} - ${A[a].f}`,
          bangla: A[a].bn
        }))
      },
      introAdj('jadid'), introAdj('qadim'), introAdj('jamil'),
      matchAdj(['jadid', 'qadim', 'jamil']),
      introAdj('kabir'), introAdj('saghir'), introAdj('jayyid'),
      matchAdj(['kabir', 'saghir', 'jayyid']),
      adjMeaningMcq('qadim', ['jadid', 'jamil', 'jayyid']),
      adjMeaningMcq('saghir', ['kabir', 'jayyid', 'qadim']),
      adjMeaningMcq('jayyid', ['jamil', 'jadid', 'saghir'])
    ]
  ),

  stage(
    {
      id: 'l2-adj-pairs',
      titleBn: 'দু\'টি করে শব্দ একত্রে',
      shortTitle: 'শব্দজোড়',
      titleAr: 'كِتَابٌ جَدِيدٌ',
      desc: 'كِتَابٌ جَدِيدٌ, كُرَّاسَةٌ جَدِيدَةٌ — তামরীন (ক): একত্রে পড়ো ও অর্থ বলো',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২২'
    },
    [
      {
        type: 'grammar_card',
        title: 'একটি নতুন বই, একটি নতুন খাতা',
        table: [
          { arabic: 'كِتَابٌ جَدِيدٌ', bangla: 'একটি নতুন বই' },
          { arabic: 'كُرَّاسَةٌ جَدِيدَةٌ', bangla: 'একটি নতুন খাতা' }
        ]
      },
      intro(W.flag), intro(W.fan), intro(W.garden),
      introPhrase('flag', 'jamil'),
      introPhrase('garden', 'jamil'),
      introPhrase('lock', 'jayyid'),
      introPhrase('fan', 'jayyid'),
      {
        type: 'match_pairs',
        title: 'শব্দজোড় ও অর্থ মেলান',
        pairs: [P('mosque', 'kabir'), P('madrasa', 'kabir'), P('house', 'saghir'), P('room', 'saghir')]
          .map(({ arabic, bangla }) => ({ arabic, bangla }))
      },
      {
        type: 'match_pairs',
        title: 'শব্দজোড় ও অর্থ মেলান',
        pairs: [P('lamp', 'qadim'), P('clock', 'qadim'), P('flag', 'jamil'), P('fan', 'jayyid')]
          .map(({ arabic, bangla }) => ({ arabic, bangla }))
      },
      meaningOf(P('garden', 'jamil'), ['একটি সুন্দর পতাকা', 'একটি বড় বাগান', 'একটি ভালো পাখা'], 'শব্দজোড়ের অর্থ কী?'),
      pictureChoice('fan', ['flag', 'garden', 'clock']),
      pictureChoice('garden', ['mosque', 'house', 'flag'])
    ]
  ),

  stage(
    {
      id: 'l2-tamrin-kha',
      titleBn: 'তামরীন (খ): শূন্যস্থান পূরণ',
      shortTitle: 'তামরীন খ',
      titleAr: 'التَّمْرِينُ (ب)',
      desc: 'أ - ب - ج এর শূন্যস্থানে উপযুক্ত শব্দ বসাও এবং অর্থ বলো',
      iconName: 'PenTool',
      color: 'amber',
      estMinutes: 4,
      bookPages: '২৩'
    },
    [
      // (أ)
      fillAdj('umbrella', 'jamil'),
      fillAdj('key', 'saghir'),
      fillAdj('house', 'jadid'),
      fillAdj('glasses', 'jayyid'),
      fillAdj('fan', 'qadim'),
      // (ب)
      fillNoun('lamp', 'clock', 'qadim'),
      fillNoun('bag', 'lock', 'saghir'),
      fillNoun('notebook', 'book', 'jayyid'),
      fillNoun('mosque', 'madrasa', 'kabir'),
      fillNoun('flag', 'garden', 'jamil'),
      // (ج)
      fillAdj('blackboard', 'kabir'),
      fillNoun('lock', 'fan', 'jayyid'),
      fillAdj('door', 'jamil'),
      fillNoun('madrasa', 'mosque', 'kabir')
    ]
  ),

  stage(
    {
      id: 'l2-sentences-1',
      titleBn: 'বাক্য: هٰذَا كِتَابٌ جَدِيدٌ',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'ইহা (একটি) নতুন বই — কিতাবের ২৩ পৃষ্ঠার ছবির বাক্য',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৩'
    },
    [
      {
        type: 'grammar_card',
        title: 'ইহা (একটি) নতুন বই',
        table: [
          { arabic: 'هٰذَا كِتَابٌ', bangla: 'ইহা (একটি) বই' },
          { arabic: 'هٰذَا كِتَابٌ جَدِيدٌ', bangla: 'ইহা (একটি) নতুন বই' }
        ]
      },
      introSentence(SENT.hadhaKitabJadid),
      introSentence(SENT.tilkaSaaJadida),
      introSentence(SENT.dhalikaAlamJamil),
      introSentence(SENT.hadhihiMirwahaJayyida),
      introSentence(SENT.tilkaHaqibaSaghira),
      introSentence(SENT.tilkaHaqibaJamila),
      meaningOf(SENT.dhalikaAlamJamil, ['ইহা একটি সুন্দর পতাকা', 'উহা একটি নতুন পতাকা', 'উহা একটি সুন্দর বাগান']),
      fillSentenceAdj(SENT.tilkaSaaJadida, 'جَدِيدٌ'),
      fillDemonstrative(SENT.hadhihiMirwahaJayyida, ['هٰذَا', 'تِلْكَ']),
      build(SENT.dhalikaAlamJamil, ['تِلْكَ', 'جَمِيلَةٌ']),
      build(SENT.tilkaHaqibaJamila, ['ذٰلِكَ', 'جَمِيلٌ']),
      arabicOf(SENT.tilkaHaqibaSaghira, ['تِلْكَ حَقِيبَةٌ صَغِيرٌ', 'هٰذِهِ حَقِيبَةٌ صَغِيرَةٌ', 'تِلْكَ حَقِيبَةٌ كَبِيرَةٌ'])
    ]
  ),

  stage(
    {
      id: 'l2-sentences-2',
      titleBn: 'বাক্য: ছোট ঘর, বড় মসজিদ',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'هٰذَا بَيْتٌ صَغِيرٌ, ذٰلِكَ مَسْجِدٌ كَبِيرٌ — কিতাবের ২৪ পৃষ্ঠার ছবির বাক্য',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৪'
    },
    [
      introSentence(SENT.hadhaBaytSaghir),
      introSentence(SENT.dhalikaMasjidKabir),
      introSentence(SENT.hadhihiMizallaQadima),
      introSentence(SENT.tilkaNazzaraJadida),
      introSentence(SENT.hadhaSarir),
      introSentence(SENT.dhalikaQufl),
      meaningOf(SENT.hadhihiMizallaQadima, ['উহা একটি পুরোনো ছাতা', 'ইহা একটি নতুন ছাতা', 'ইহা একটি পুরোনো চশমা']),
      fillSentenceAdj(SENT.hadhihiMizallaQadima, 'قَدِيمٌ'),
      fillSentenceAdj(SENT.dhalikaMasjidKabir, 'كَبِيرَةٌ'),
      sortAdjGroups('kabir', ['mosque', 'madrasa', 'house', 'room', 'bed', 'bag']),
      build(SENT.hadhaBaytSaghir, ['صَغِيرَةٌ', 'ذٰلِكَ']),
      build(SENT.tilkaNazzaraJadida, ['جَدِيدٌ', 'هٰذِهِ']),
      arabicOf(SENT.hadhaBaytSaghir, ['هٰذَا بَيْتٌ صَغِيرَةٌ', 'ذٰلِكَ بَيْتٌ صَغِيرٌ', 'هٰذَا بَيْتٌ كَبِيرٌ'])
    ]
  ),

  stage(
    {
      id: 'l2-words-clothes',
      titleBn: 'শব্দার্থ: বিছানা ও পোশাক',
      shortTitle: 'শব্দার্থ',
      titleAr: 'الْمُفْرَدَاتُ',
      desc: 'বিছানা, বালিশ, জামা, টুপি, পোশাক, পাগড়ী, রুমাল, জুতা; পরিচ্ছন্ন ও ময়লা',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '২৪'
    },
    [
      intro(W.bedding), intro(W.pillow), intro(W.shirt), intro(W.cap),
      match(['bedding', 'pillow', 'shirt', 'cap']),
      intro(W.clothing), intro(W.turban), intro(W.handkerchief), intro(W.shoe),
      match(['clothing', 'turban', 'handkerchief', 'shoe']),
      introAdj('nazif'), introAdj('wasikh'),
      meaningOf({ arabic: 'وَسِخٌ - وَسِخَةٌ', bangla: 'ময়লা' }, ['পরিচ্ছন্ন', 'পুরোনো', 'ছোট'], 'শব্দটির অর্থ কী?'),
      pictureChoice('cap', ['turban', 'shoe', 'pillow'])
    ]
  ),

  stage(
    {
      id: 'l2-reading-1',
      titleBn: 'পড়ার অনুচ্ছেদ (১/২)',
      shortTitle: 'পড়া ১',
      titleAr: 'الْقِرَاءَةُ (١)',
      desc: 'هٰذَا مَسْجِدٌ جَدِيدٌ … هٰذَا قَمِيصٌ جَدِيدٌ — কিতাবের ২৪ পৃষ্ঠা',
      iconName: 'BookOpen',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৪'
    },
    [
      introSentence(SENT.hadhaMasjidJadid),
      introSentence(SENT.hadhaQuflJayyid),
      introSentence(SENT.hadhaFirashNazif),
      introSentence(SENT.tilkaHujraNazifa),
      introSentence(SENT.dhalikaMandilSaghir),
      introSentence(SENT.hadhihiImamaJadida),
      introSentence(SENT.hadhaQamisJadid),
      sortAdjGroups('nazif', ['bedding', 'room', 'shirt', 'turban', 'handkerchief', 'pillow']),
      meaningOf(SENT.hadhaFirashNazif, ['ইহা একটি ময়লা বিছানা', 'উহা একটি পরিচ্ছন্ন বিছানা', 'ইহা একটি পরিচ্ছন্ন বালিশ']),
      fillSentenceAdj(SENT.tilkaHujraNazifa, 'نَظِيفٌ'),
      build(SENT.hadhihiImamaJadida, ['هٰذَا', 'جَدِيدٌ']),
      arabicOf(SENT.hadhaQamisJadid, ['هٰذَا قَمِيصٌ جَدِيدَةٌ', 'ذٰلِكَ قَمِيصٌ جَدِيدٌ', 'هٰذَا قَمِيصٌ نَظِيفٌ'])
    ]
  ),

  stage(
    {
      id: 'l2-reading-2',
      titleBn: 'পড়ার অনুচ্ছেদ (২/২)',
      shortTitle: 'পড়া ২',
      titleAr: 'الْقِرَاءَةُ (٢)',
      desc: 'تِلْكَ قَلَنْسُوَةٌ جَدِيدَةٌ … ذٰلِكَ مِنْدِيلٌ وَسِخٌ — ও তামরীন (গ)',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '২৪'
    },
    [
      introSentence(SENT.tilkaQalansuwaJadida),
      introSentence(SENT.hadhaLibasNazif),
      introSentence(SENT.dhalikaHidhaSaghir),
      introSentence(SENT.hadhihiWisadaJamila),
      introSentence(SENT.dhalikaMiftahSaghir),
      introSentence(SENT.hadhihiSabburaWasikha),
      introSentence(SENT.dhalikaMandilWasikh),
      meaningOf(SENT.dhalikaMandilWasikh, ['উহা একটি ছোট রুমাল', 'ইহা একটি ময়লা রুমাল', 'উহা একটি ময়লা জুতা']),
      spot('ইহা একটি ময়লা ব্লাকবোর্ড', 'هٰذِهِ سَبُّورَةٌ وَسِخَةٌ', 'هٰذِهِ سَبُّورَةٌ وَسِخٌ', 'سَبُّورَةٌ-এর পরে কিতাবে وَسِخَةٌ এসেছে।'),
      spot('উহা একটি ছোট জুতা', 'ذٰلِكَ حِذَاءٌ صَغِيرٌ', 'تِلْكَ حِذَاءٌ صَغِيرَةٌ', 'حِذَاءٌ-এর আগে কিতাবে ذٰلِكَ ও পরে صَغِيرٌ এসেছে।'),
      build(SENT.hadhihiWisadaJamila, ['هٰذَا', 'جَمِيلٌ']),
      {
        type: 'grammar_card',
        title: 'তামরীন (গ): ইশারা করে বলো',
        summary: 'কিতাবের নির্দেশনা: বিভিন্ন বস্তুর দিকে ইশারা করে উপরের অনুকরণে আরবী বলো। এই মুহূর্তে হয়তো আপনি এটি করতে পারবেন না; বাকি যখন সুযোগ পাবেন তখন করবেন, ইন শা আল্লাহ।',
        table: [
          { arabic: 'هٰذَا قَمِيصٌ نَظِيفٌ', bangla: 'কাছের পুরুষবাচক জিনিস দেখিয়ে' },
          { arabic: 'تِلْكَ حُجْرَةٌ نَظِيفَةٌ', bangla: 'দূরের স্ত্রীবাচক জিনিস দেখিয়ে' }
        ]
      }
    ]
  ),

  stage(
    {
      id: 'l2-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الِاخْتِبَارُ',
      desc: 'পুরো দারসের শব্দ, বিশেষণ ও বাক্য যাচাই',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '২২–২৪'
    },
    [
      quiz("'قَدِيمٌ - قَدِيمَةٌ' শব্দের অর্থ কী?", ['পুরোনো', 'নতুন', 'সুন্দর', 'ভালো'], 'কিতাব: قَدِيمٌ - قَدِيمَةٌ = পুরোনো।'),
      quiz("'একটি নতুন খাতা' এর আরবি কোনটি?", ['كُرَّاسَةٌ جَدِيدَةٌ', 'كُرَّاسَةٌ جَدِيدٌ', 'كِتَابٌ جَدِيدٌ'], 'কিতাব: كُرَّاسَةٌ جَدِيدَةٌ = একটি নতুন খাতা।'),
      pictureChoice('turban', ['cap', 'pillow', 'shirt']),
      quiz('حَدِيقَةٌ ___ — শূন্যস্থানে কোনটি বসবে?', ['جَمِيلَةٌ', 'جَمِيلٌ'], 'কিতাব: حَدِيقَةٌ جَمِيلَةٌ = একটি সুন্দর বাগান।'),
      quiz("'هٰذَا فِرَاشٌ نَظِيفٌ' বাক্যের অর্থ কী?", ['ইহা একটি পরিচ্ছন্ন বিছানা', 'উহা একটি ময়লা বিছানা', 'ইহা একটি পরিচ্ছন্ন বালিশ'], 'هٰذَا = ইহা, فِرَاشٌ = একটি বিছানা, نَظِيفٌ = পরিচ্ছন্ন।'),
      quiz("'مِنْدِيلٌ' শব্দের অর্থ কী?", ['একটি রুমাল', 'একটি জুতা', 'একটি জামা', 'একটি টুপি'], 'কিতাব: مِنْدِيلٌ = একটি রুমাল।'),
      pictureChoice('flag', ['fan', 'garden', 'umbrella']),
      quiz('দূরের নতুন টুপি দেখিয়ে কী বলবে?', ['تِلْكَ قَلَنْسُوَةٌ جَدِيدَةٌ', 'ذٰلِكَ قَلَنْسُوَةٌ جَدِيدٌ', 'هٰذِهِ قَلَنْسُوَةٌ جَدِيدَةٌ'], 'কিতাব: تِلْكَ قَلَنْسُوَةٌ جَدِيدَةٌ।'),
      quiz('ذٰلِكَ مَسْجِدٌ ___ — শূন্যস্থানে কোনটি বসবে?', ['كَبِيرٌ', 'كَبِيرَةٌ'], 'কিতাব: ذٰلِكَ مَسْجِدٌ كَبِيرٌ = উহা একটি বড় মসজিদ।'),
      quiz("'وَسِخٌ - وَسِخَةٌ' শব্দের অর্থ কী?", ['ময়লা', 'পরিচ্ছন্ন', 'ছোট', 'পুরোনো'], 'কিতাব: وَسِخٌ - وَسِخَةٌ = ময়লা।')
    ]
  )
];

// ---------- অতিরিক্ত চর্চার পর্ব (শেখা বাক্য ও শব্দ দিয়েই) ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l2-sentences-2', stage(
  {
    id: 'l2-practice-1',
    titleBn: 'চর্চা: বিশেষণ মেলাও',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'শেখা শব্দজোড় ও বাক্য দিয়ে মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '২২–২৪'
  },
  [
    sortAdjGroups('jadid', ['book', 'notebook', 'clock', 'flag', 'fan', 'house']),
    fillSentenceAdj(SENT.hadhaBaytSaghir, 'صَغِيرَةٌ'),
    fillDemonstrative(SENT.dhalikaMasjidKabir, ['تِلْكَ', 'هٰذَا']),
    meaningOf(SENT.tilkaSaaJadida, ['ইহা একটি নতুন ঘড়ি', 'উহা একটি পুরোনো ঘড়ি']),
    arabicOf(SENT.hadhihiMirwahaJayyida, ['هٰذِهِ مِرْوَحَةٌ جَيِّدٌ', 'هٰذَا مِرْوَحَةٌ جَيِّدَةٌ']),
    build(SENT.tilkaHaqibaSaghira, ['ذٰلِكَ', 'صَغِيرٌ']),
    spot('উহা একটি বড় মসজিদ', 'ذٰلِكَ مَسْجِدٌ كَبِيرٌ', 'تِلْكَ مَسْجِدٌ كَبِيرَةٌ', 'مَسْجِدٌ পুরুষবাচক, তাই কিতাবে ذٰلِكَ ও كَبِيرٌ এসেছে।'),
    fillAdj('garden', 'jamil'),
    fillAdj('lamp', 'qadim'),
    {
      type: 'match_pairs',
      title: 'শব্দজোড় ও অর্থ মেলান',
      pairs: [P('umbrella', 'qadim'), P('glasses', 'jadid'), P('house', 'saghir'), P('mosque', 'kabir')]
        .map(({ arabic, bangla }) => ({ arabic, bangla }))
    },
    build(SENT.hadhihiMizallaQadima, ['هٰذَا', 'قَدِيمٌ']),
    meaningOf(P('fan', 'jayyid'), ['একটি সুন্দর পাখা', 'একটি ভালো পতাকা'], 'শব্দজোড়ের অর্থ কী?')
  ]
));

insertAfter('l2-reading-2', stage(
  {
    id: 'l2-practice-2',
    titleBn: 'চর্চা: পোশাক ও পরিচ্ছন্নতা',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'পড়ার অনুচ্ছেদের বাক্য দিয়ে মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '২৪'
  },
  [
    sortAdjGroups('wasikh', ['shirt', 'cap', 'shoe', 'pillow', 'bedding', 'turban']),
    pictureChoice('shoe', ['shirt', 'cap', 'handkerchief']),
    pictureChoice('pillow', ['bedding', 'turban', 'clothing']),
    fillSentenceAdj(SENT.hadhaLibasNazif, 'نَظِيفَةٌ'),
    fillDemonstrative(SENT.tilkaQalansuwaJadida, ['ذٰلِكَ', 'هٰذِهِ']),
    meaningOf(SENT.dhalikaHidhaSaghir, ['উহা একটি ছোট রুমাল', 'ইহা একটি ছোট জুতা']),
    arabicOf(SENT.hadhihiWisadaJamila, ['هٰذِهِ وِسَادَةٌ جَمِيلٌ', 'هٰذَا وِسَادَةٌ جَمِيلَةٌ']),
    build(SENT.hadhaFirashNazif, ['نَظِيفَةٌ', 'ذٰلِكَ']),
    build(SENT.dhalikaMandilWasikh, ['وَسِخَةٌ', 'تِلْكَ']),
    spot('ইহা একটি নতুন পাগড়ী', 'هٰذِهِ عِمَامَةٌ جَدِيدَةٌ', 'هٰذَا عِمَامَةٌ جَدِيدٌ', 'عِمَامَةٌ স্ত্রীবাচক (ة), তাই কিতাবে هٰذِهِ ও جَدِيدَةٌ এসেছে।'),
    match(['bedding', 'pillow', 'turban', 'shoe']),
    meaningOf(SENT.tilkaHujraNazifa, ['উহা একটি ময়লা কামরা', 'ইহা একটি পরিচ্ছন্ন কামরা'])
  ]
));

// ---------- পাঠের অন্যান্য ফিল্ড (ফ্ল্যাশকার্ড, তামরীন মোড, অ্যাডমিন) ----------

const stripUi = ({ arabic, bangla, picture }) => ({ arabic, bangla, picture });

const vocabulary = [
  ...['jadid', 'qadim', 'jamil', 'kabir', 'saghir', 'jayyid'].map(a => ({ arabic: `${A[a].m} - ${A[a].f}`, bangla: A[a].bn })),
  ...['flag', 'fan', 'garden', 'bedding', 'pillow', 'shirt', 'cap', 'clothing', 'turban', 'handkerchief', 'shoe'].map(k => stripUi(W[k])),
  ...['nazif', 'wasikh'].map(a => ({ arabic: `${A[a].m} - ${A[a].f}`, bangla: A[a].bn }))
];

const sentences = Object.values(SENT).map(s => ({
  arabic: s.arabic,
  bangla: s.bangla,
  picture: s.picture,
  distance: s.distance,
  page: s.page
}));

// তামরীন (ক) ও (খ) — তামরীন মোডের জন্য
const TAMRIN_KA = [['flag', 'jamil'], ['garden', 'jamil'], ['lock', 'jayyid'], ['fan', 'jayyid'], ['mosque', 'kabir'], ['madrasa', 'kabir'], ['house', 'saghir'], ['room', 'saghir'], ['lamp', 'qadim'], ['clock', 'qadim']];
const TAMRIN_KHA = [['umbrella', 'jamil'], ['key', 'saghir'], ['house', 'jadid'], ['glasses', 'jayyid'], ['fan', 'qadim'], ['lamp', 'qadim'], ['bag', 'saghir'], ['notebook', 'jayyid'], ['mosque', 'kabir'], ['flag', 'jamil'], ['blackboard', 'kabir'], ['lock', 'jayyid'], ['door', 'jamil'], ['madrasa', 'kabir']];

const tamrinKitabi = [
  ...TAMRIN_KA.map(([k, a]) => ({ task: 'দু\'টি করে শব্দ একত্রে পড়ো ও অর্থ বলো', mode: 'ar-to-bn', ...P(k, a), page: '২২' })),
  ...TAMRIN_KHA.map(([k, a]) => ({
    task: 'শূন্যস্থানে উপযুক্ত শব্দ বসাও এবং অর্থ বলো',
    mode: 'bn-to-ar',
    ...P(k, a),
    hint: `${W[k].g === 'm' ? 'পুরুষবাচক' : 'স্ত্রীবাচক'} শব্দ — বিশেষণ: ${A[a].m} / ${A[a].f}`,
    page: '২৩'
  }))
];

const quizLegacy = bookStages
  .find(s => s.id === 'l2-quiz')
  .steps.filter(s => s.type === 'quiz_challenge')
  .map(q => {
    const correctIndex = q.options.findIndex(o => o.isCorrect);
    return {
      question: q.question,
      options: q.options.map(o => o.text),
      correctIndex,
      correctAnswer: correctIndex,
      explanation: q.explanation,
      type: 'mcq'
    };
  });

// ক্বায়েদা (খসড়া — উস্তাদের যাচাই বাকি): stageId পর্বের ঠিক আগে ম্যাপে পাশে দেখায়
const qaida = [
  {
    id: 'l2-q-sifat',
    stageId: 'l2-adj-pairs',
    title: 'বিশেষণ (সিফাত) বিশেষ্যের পরে বসে',
    table: [
      { arabic: 'كِتَابٌ جَدِيدٌ', bangla: 'পুরুষবাচক → جَدِيدٌ' },
      { arabic: 'كُرَّاسَةٌ جَدِيدَةٌ', bangla: 'স্ত্রীবাচক → جَدِيدَةٌ' }
    ],
    rule: 'আরবীতে বিশেষণ বিশেষ্যের পরে আসে। বিশেষ্য পুরুষবাচক হলে বিশেষণও পুরুষবাচক, আর স্ত্রীবাচক (ة) হলে বিশেষণের শেষেও ة যোগ হয়।',
    examples: [
      { arabic: 'مَسْجِدٌ كَبِيرٌ', bangla: 'একটি বড় মসজিদ' },
      { arabic: 'مَدْرَسَةٌ كَبِيرَةٌ', bangla: 'একটি বড় মাদরাসা' },
      { arabic: 'حَدِيقَةٌ جَمِيلَةٌ', bangla: 'একটি সুন্দর বাগান' }
    ]
  },
  {
    id: 'l2-q-dem-sifat',
    stageId: 'l2-sentences-1',
    title: 'ইশারা + বিশেষ্য + বিশেষণ',
    table: [
      { arabic: 'هٰذَا كِتَابٌ', bangla: 'ইহা (একটি) বই' },
      { arabic: 'هٰذَا كِتَابٌ جَدِيدٌ', bangla: 'ইহা (একটি) নতুন বই' }
    ],
    rule: 'আগের দারসের বাক্যের শেষে একটি বিশেষণ যোগ করলেই নতুন বাক্য হয়। ইশারা, বিশেষ্য ও বিশেষণ — তিনটিই একই লিঙ্গের হয়।',
    examples: [
      { arabic: 'تِلْكَ سَاعَةٌ جَدِيدَةٌ', bangla: 'উহা একটি নতুন ঘড়ি' },
      { arabic: 'ذٰلِكَ عَلَمٌ جَمِيلٌ', bangla: 'উহা একটি সুন্দর পতাকা' }
    ]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l2',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ২২-২৪',
    qaida,
    grammarRule: {
      title: 'কিতাবের টেবিল: বিশেষণ',
      summary: 'جَدِيدٌ - جَدِيدَةٌ = নতুন। قَدِيمٌ - قَدِيمَةٌ = পুরোনো। جَمِيلٌ - جَمِيلَةٌ = সুন্দর। كَبِيرٌ - كَبِيرَةٌ = বড়। صَغِيرٌ - صَغِيرَةٌ = ছোট। جَيِّدٌ - جَيِّدَةٌ = ভালো।',
      points: [
        'كِتَابٌ جَدِيدٌ = একটি নতুন বই',
        'كُرَّاسَةٌ جَدِيدَةٌ = একটি নতুন খাতা',
        'هٰذَا كِتَابٌ جَدِيدٌ = ইহা (একটি) নতুন বই'
      ]
    },
    vocabulary,
    sentences,
    dialogues: [],
    tamrinKitabi,
    quiz: quizLegacy,
    bookStages
  }
};
