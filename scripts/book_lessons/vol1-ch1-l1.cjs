// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ১ম দারস (বই পৃষ্ঠা ১৭–২১, PDF পৃষ্ঠা ১৫–১৯)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ। অনুশীলনগুলো এই দারসের কিতাবী শব্দ/বাক্য দিয়েই তৈরি।

const W = {
  book: { arabic: 'كِتَابٌ', bangla: 'একটি বই', picture: 'book' },
  pen: { arabic: 'قَلَمٌ', bangla: 'একটি কলম', picture: 'pen' },
  chair: { arabic: 'كُرْسِيٌّ', bangla: 'একটি চেয়ার', picture: 'chair' },
  house: { arabic: 'بَيْتٌ', bangla: 'একটি ঘর', picture: 'house' },
  door: { arabic: 'بَابٌ', bangla: 'একটি দরজা', picture: 'door' },
  lamp: { arabic: 'مِصْبَاحٌ', bangla: 'একটি বাতি', picture: 'lamp' },
  wall: { arabic: 'جِدَارٌ', bangla: 'একটি দেয়াল', picture: 'wall' },
  bed: { arabic: 'سَرِيرٌ', bangla: 'একটি খাট', picture: 'bed' },
  mosque: { arabic: 'مَسْجِدٌ', bangla: 'একটি মসজিদ', picture: 'mosque' },

  madrasa: { arabic: 'مَدْرَسَةٌ', bangla: 'একটি মাদরাসা (বিদ্যালয়)', picture: 'madrasa' },
  blackboard: { arabic: 'سَبُّورَةٌ', bangla: 'একটি ব্লাকবোর্ড', picture: 'blackboard' },
  ruler: { arabic: 'مِسْطَرَةٌ', bangla: 'একটি রুলার', picture: 'ruler' },
  bag: { arabic: 'حَقِيبَةٌ', bangla: 'একটি ব্যাগ', picture: 'bag' },
  notebook: { arabic: 'كُرَّاسَةٌ', bangla: 'একটি খাতা', picture: 'notebook' },
  table: { arabic: 'طَاوِلَةٌ', bangla: 'একটি টেবিল', picture: 'table' },
  room: { arabic: 'حُجْرَةٌ - غُرْفَةٌ', bangla: 'একটি কামরা', picture: 'room' },
  hujra: { arabic: 'حُجْرَةٌ', bangla: 'একটি কামরা', picture: 'room' },
  ghurfa: { arabic: 'غُرْفَةٌ', bangla: 'একটি কামরা', picture: 'room' },
  window: { arabic: 'نَافِذَةٌ', bangla: 'একটি জানালা', picture: 'window' },

  lock: { arabic: 'قُفْلٌ', bangla: 'একটি তালা', picture: 'lock' },
  key: { arabic: 'مِفْتَاحٌ', bangla: 'একটি চাবি', picture: 'key' },
  box: { arabic: 'صُنْدُوقٌ', bangla: 'একটি বাক্স', picture: 'box' },
  clock: { arabic: 'سَاعَةٌ', bangla: 'একটি ঘড়ি', picture: 'clock' },
  umbrella: { arabic: 'مِظَلَّةٌ', bangla: 'একটি ছাতা', picture: 'umbrella' },
  glasses: { arabic: 'نَظَّارَةٌ', bangla: 'একটি চশমা', picture: 'glasses' },
  car: { arabic: 'سَيَّارَةٌ', bangla: 'একটি কার', picture: 'car' },
  bicycle: { arabic: 'دَرَّاجَةٌ', bangla: 'একটি সাইকেল', picture: 'bicycle' }
};

const DEM = {
  'هٰذَا': { bn: 'ইহা', distance: 'near' },
  'هٰذِهِ': { bn: 'ইহা', distance: 'near' },
  'ذٰلِكَ': { bn: 'উহা', distance: 'far' },
  'تِلْكَ': { bn: 'উহা', distance: 'far' }
};

// ইশারা + শব্দ দিয়ে কিতাবের বাক্য
function S(dem, key, page) {
  const word = W[key];
  return {
    arabic: `${dem} ${word.arabic}`,
    bangla: `${DEM[dem].bn} ${word.bangla}`,
    picture: word.picture,
    distance: DEM[dem].distance,
    page
  };
}

// কিতাবের বাক্য (ক্রম অনুযায়ী, হুবহু পুনরাবৃত্তি বাদ)
const SENT = {
  // পৃ. ১৭ (কিতাবের টেবিলের অনুবাদ হুবহু)
  hadhaKitab: { ...S('هٰذَا', 'book', '১৭'), bangla: 'ইহা (একটি) বই' },
  dhalikaQalam: { ...S('ذٰلِكَ', 'pen', '১৭'), bangla: 'উহা (একটি) কলম' },
  hadhaMasjid: S('هٰذَا', 'mosque', '১৭'),
  dhalikaBayt: S('ذٰلِكَ', 'house', '১৭'),
  // পৃ. ১৮
  hadhaBab: S('هٰذَا', 'door', '১৮'),
  dhalikaMisbah: S('ذٰلِكَ', 'lamp', '১৮'),
  hadhaJidar: S('هٰذَا', 'wall', '১৮'),
  dhalikaKursi: S('ذٰلِكَ', 'chair', '১৮'),
  hadhaBayt: S('هٰذَا', 'house', '১৮'),
  hadhaKursi: S('هٰذَا', 'chair', '১৮'),
  dhalikaMasjid: S('ذٰلِكَ', 'mosque', '১৮'),
  hadhaSarir: S('هٰذَا', 'bed', '১৮'),
  dhalikaSarir: S('ذٰلِكَ', 'bed', '১৮'),
  dhalikaJidar: S('ذٰلِكَ', 'wall', '১৮'),
  // পৃ. ১৯
  hadhihiMadrasa: S('هٰذِهِ', 'madrasa', '১৯'),
  tilkaSabbura: S('تِلْكَ', 'blackboard', '১৯'),
  hadhihiHujra: S('هٰذِهِ', 'hujra', '১৯'),
  tilkaHaqiba: S('تِلْكَ', 'bag', '১৯'),
  hadhihiKurrasa: S('هٰذِهِ', 'notebook', '১৯'),
  tilkaTawila: S('تِلْكَ', 'table', '১৯'),
  hadhihiMistara: S('هٰذِهِ', 'ruler', '১৯'),
  hadhihiSabbura: S('هٰذِهِ', 'blackboard', '১৯'),
  tilkaNafidha: S('تِلْكَ', 'window', '১৯'),
  hadhihiTawila: S('هٰذِهِ', 'table', '১৯'),
  // পৃ. ২০
  tilkaMistara: S('تِلْكَ', 'ruler', '২০'),
  tilkaKurrasa: S('تِلْكَ', 'notebook', '২০'),
  hadhihiHaqiba: S('هٰذِهِ', 'bag', '২০')
};

const QUESTION = {
  'هٰذَا': { arabic: 'مَا هٰذَا؟', bangla: 'ইহা কী? (এটি কী?)' },
  'هٰذِهِ': { arabic: 'مَا هٰذِهِ؟', bangla: 'ইহা কী? (এটি কী?)' },
  'ذٰلِكَ': { arabic: 'مَا ذٰلِكَ؟', bangla: 'উহা কী? (সেটি কী?)' },
  'تِلْكَ': { arabic: 'مَا تِلْكَ؟', bangla: 'উহা কী? (সেটি কী?)' }
};

// ---------- ধাপ তৈরির ছোট সহায়ক ----------

const intro = (item, title = 'নতুন শব্দ') => ({
  type: 'intro',
  title,
  word: { arabic: item.arabic, bangla: item.bangla },
  picture: item.picture,
  distance: item.distance
});

const introSentence = (sent) => intro(sent, 'কিতাবের বাক্য');

const match = (keys, title = 'শব্দজোড় মেলান') => ({
  type: 'match_pairs',
  title,
  pairs: keys.map(k => ({ arabic: W[k].arabic, bangla: W[k].bangla }))
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

const meaningMcq = (key, wrongKeys) => ({
  type: 'mcq',
  word: { arabic: W[key].arabic, bangla: W[key].bangla },
  question: 'শব্দটির অর্থ কী?',
  options: [key, ...wrongKeys].map((k, i) => ({ text: W[k].bangla, isCorrect: i === 0 }))
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

// কার্ডে শুধু শব্দ ও কাছে/দূরের দৃশ্য; ইশারা শব্দটি দেখালে উত্তর বলে দেওয়া হয়ে যায়
const sortItem = (sent, group) => ({
  arabic: sent.arabic.split(' ').slice(1).join(' '),
  bangla: sent.bangla,
  picture: sent.picture,
  distance: sent.distance,
  reveal: sent.arabic,
  group
});

const sortWord = (key, dem, group) => ({
  arabic: W[key].arabic,
  bangla: `${DEM[dem].bn} ${W[key].bangla}`,
  picture: W[key].picture,
  reveal: `${dem} ${W[key].arabic}`,
  group
});

// ছবি দেখে প্রশ্নের উত্তর (কিতাবের প্রশ্নোত্তর ও তামরীন)
const pictureQuestion = (dem, key, wrong, speaker) => {
  const correct = S(dem, key);
  return {
    type: 'dialogue_listen',
    speaker,
    questionArabic: QUESTION[dem].arabic,
    questionBangla: QUESTION[dem].bangla,
    picture: correct.picture,
    distance: correct.distance,
    options: [[dem, key], ...wrong].map(([d, k], i) => {
      const s = S(d, k);
      return { text: s.arabic, bangla: s.bangla, isCorrect: i === 0 };
    })
  };
};

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

// ---------- উপ-পাঠসমূহ (কিতাবের ক্রমে) ----------

const bookStages = [
  stage(
    {
      id: 'l1-words-1',
      titleBn: 'শব্দার্থ (১/৩)',
      shortTitle: 'শব্দার্থ ১',
      titleAr: 'الْمُفْرَدَاتُ (١)',
      desc: 'বই, কলম, চেয়ার, ঘর, দরজা, বাতি, দেয়াল ও খাট',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '১৭'
    },
    [
      intro(W.book), intro(W.pen), intro(W.chair), intro(W.house),
      match(['book', 'pen', 'chair', 'house']),
      intro(W.door), intro(W.lamp), intro(W.wall), intro(W.bed),
      match(['door', 'lamp', 'wall', 'bed']),
      pictureChoice('chair', ['bed', 'door', 'lamp']),
      pictureChoice('wall', ['house', 'book', 'pen']),
      meaningMcq('lamp', ['door', 'bed', 'wall'])
    ]
  ),

  stage(
    {
      id: 'l1-rule-hadha-dhalika',
      titleBn: 'ইশারা: هٰذَا / ذٰلِكَ',
      shortTitle: 'ইহা-উহা',
      titleAr: 'هٰذَا وَذٰلِكَ',
      desc: 'কিতাবের টেবিল: ইহা (এটি) ও উহা (সেটি)',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '১৭'
    },
    [
      {
        type: 'grammar_card',
        title: 'ইহা (এটি) ও উহা (সেটি)',
        table: [
          { arabic: 'هٰذَا - هٰذِهِ', bangla: 'ইহা (এটি)' },
          { arabic: 'ذٰلِكَ - تِلْكَ', bangla: 'উহা (সেটি)' },
          { arabic: 'هٰذَا كِتَابٌ', bangla: 'ইহা (একটি) বই' },
          { arabic: 'ذٰلِكَ قَلَمٌ', bangla: 'উহা (একটি) কলম' }
        ]
      },
      introSentence(SENT.hadhaKitab),
      introSentence(SENT.dhalikaQalam),
      introSentence(SENT.hadhaMasjid),
      introSentence(SENT.dhalikaBayt),
      fillDemonstrative(SENT.hadhaMasjid, ['ذٰلِكَ']),
      fillDemonstrative(SENT.dhalikaBayt, ['هٰذَا']),
      build(SENT.hadhaKitab, ['ذٰلِكَ', 'قَلَمٌ']),
      build(SENT.dhalikaQalam, ['هٰذَا', 'كِتَابٌ']),
      {
        type: 'mcq',
        word: { arabic: 'ذٰلِكَ', bangla: 'উহা (সেটি)' },
        question: 'শব্দটির অর্থ কী?',
        options: [
          { text: 'উহা (সেটি)', isCorrect: true },
          { text: 'ইহা (এটি)', isCorrect: false }
        ]
      }
    ]
  ),

  stage(
    {
      id: 'l1-sentences-near-far',
      titleBn: 'কাছে না দূরে? (বাক্য)',
      shortTitle: 'কাছে-দূরে',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'هٰذَا بَابٌ, ذٰلِكَ مِصْبَاحٌ — কিতাবের ১৮ পৃষ্ঠার বাক্য',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '১৮'
    },
    [
      introSentence(SENT.hadhaBab),
      introSentence(SENT.dhalikaMisbah),
      introSentence(SENT.hadhaJidar),
      introSentence(SENT.dhalikaKursi),
      introSentence(SENT.hadhaBayt),
      fillDemonstrative(SENT.hadhaJidar, ['ذٰلِكَ']),
      fillDemonstrative(SENT.dhalikaMisbah, ['هٰذَا']),
      {
        type: 'sort_groups',
        title: 'ছবি দেখুন: هٰذَا না ذٰلِكَ?',
        groups: [
          { id: 'near', arabic: 'هٰذَا' },
          { id: 'far', arabic: 'ذٰلِكَ' }
        ],
        items: [
          sortItem(SENT.hadhaKursi, 'near'),
          sortItem(SENT.dhalikaMasjid, 'far'),
          sortItem(SENT.hadhaSarir, 'near'),
          sortItem(SENT.dhalikaSarir, 'far'),
          sortItem(SENT.dhalikaJidar, 'far'),
          sortItem(SENT.hadhaBab, 'near')
        ]
      },
      build(SENT.hadhaSarir, ['ذٰلِكَ', 'بَابٌ']),
      build(SENT.dhalikaMasjid, ['هٰذَا', 'بَيْتٌ'])
    ]
  ),

  stage(
    {
      id: 'l1-words-2',
      titleBn: 'শব্দার্থ (২/৩)',
      shortTitle: 'শব্দার্থ ২',
      titleAr: 'الْمُفْرَدَاتُ (٢)',
      desc: 'মাদরাসা, ব্লাকবোর্ড, রুলার, ব্যাগ, খাতা, টেবিল, কামরা ও জানালা',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '১৯'
    },
    [
      intro(W.madrasa), intro(W.blackboard), intro(W.ruler), intro(W.bag),
      match(['madrasa', 'blackboard', 'ruler', 'bag']),
      intro(W.notebook), intro(W.table), intro(W.room), intro(W.window),
      match(['notebook', 'table', 'room', 'window']),
      pictureChoice('window', ['door', 'room', 'table']),
      pictureChoice('blackboard', ['notebook', 'ruler', 'bag']),
      meaningMcq('ghurfa', ['table', 'window', 'madrasa'])
    ]
  ),

  stage(
    {
      id: 'l1-rule-hadhihi-tilka',
      titleBn: 'ইশারা: هٰذِهِ / تِلْكَ',
      shortTitle: 'هٰذِهِ-تِلْكَ',
      titleAr: 'هٰذِهِ وَتِلْكَ',
      desc: 'هٰذِهِ مَدْرَسَةٌ, تِلْكَ سَبُّورَةٌ — কিতাবের ১৯ পৃষ্ঠার বাক্য',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '১৯'
    },
    [
      {
        type: 'grammar_card',
        title: 'هٰذِهِ ও تِلْكَ',
        table: [
          { arabic: 'هٰذَا - هٰذِهِ', bangla: 'ইহা (এটি)' },
          { arabic: 'ذٰلِكَ - تِلْكَ', bangla: 'উহা (সেটি)' }
        ]
      },
      introSentence(SENT.hadhihiMadrasa),
      introSentence(SENT.tilkaSabbura),
      introSentence(SENT.hadhihiHujra),
      introSentence(SENT.tilkaHaqiba),
      introSentence(SENT.hadhihiKurrasa),
      fillDemonstrative(SENT.tilkaTawila, ['ذٰلِكَ', 'هٰذِهِ']),
      fillDemonstrative(SENT.hadhihiMistara, ['هٰذَا', 'تِلْكَ']),
      build(SENT.hadhihiSabbura, ['هٰذَا', 'تِلْكَ']),
      build(SENT.tilkaNafidha, ['ذٰلِكَ', 'هٰذِهِ'])
    ]
  ),

  stage(
    {
      id: 'l1-sentences-hadhihi',
      titleBn: 'هٰذَا না هٰذِهِ?',
      shortTitle: 'বাক্য চর্চা',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'কিতাবের ১৯–২০ পৃষ্ঠার বাক্য ও দলে ভাগ করার চর্চা',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '১৯–২০'
    },
    [
      introSentence(SENT.hadhihiTawila),
      introSentence(SENT.tilkaMistara),
      introSentence(SENT.tilkaKurrasa),
      introSentence(SENT.hadhihiHaqiba),
      {
        type: 'sort_groups',
        title: 'هٰذَا না هٰذِهِ? ঠিক দলে রাখুন',
        groups: [
          { id: 'hadha', arabic: 'هٰذَا' },
          { id: 'hadhihi', arabic: 'هٰذِهِ' }
        ],
        items: [
          sortWord('book', 'هٰذَا', 'hadha'),
          sortWord('madrasa', 'هٰذِهِ', 'hadhihi'),
          sortWord('door', 'هٰذَا', 'hadha'),
          sortWord('window', 'هٰذِهِ', 'hadhihi'),
          sortWord('bed', 'هٰذَا', 'hadha'),
          sortWord('notebook', 'هٰذِهِ', 'hadhihi')
        ]
      },
      {
        type: 'sort_groups',
        title: 'ذٰلِكَ না تِلْكَ? ঠিক দলে রাখুন',
        groups: [
          { id: 'dhalika', arabic: 'ذٰلِكَ' },
          { id: 'tilka', arabic: 'تِلْكَ' }
        ],
        items: [
          sortWord('pen', 'ذٰلِكَ', 'dhalika'),
          sortWord('blackboard', 'تِلْكَ', 'tilka'),
          sortWord('lamp', 'ذٰلِكَ', 'dhalika'),
          sortWord('bag', 'تِلْكَ', 'tilka'),
          sortWord('wall', 'ذٰلِكَ', 'dhalika'),
          sortWord('ruler', 'تِلْكَ', 'tilka')
        ]
      },
      {
        type: 'spot_error',
        title: 'কোন বাক্যটি কিতাবের মতো শুদ্ধ?',
        targetBangla: 'ইহা একটি মাদরাসা',
        options: [
          { text: 'هٰذِهِ مَدْرَسَةٌ', isCorrect: true, explanation: 'কিতাবে আছে: هٰذِهِ مَدْرَسَةٌ' },
          { text: 'هٰذَا مَدْرَسَةٌ', isCorrect: false, explanation: 'مَدْرَسَةٌ-এর আগে কিতাবে هٰذِهِ এসেছে।' }
        ]
      },
      {
        type: 'spot_error',
        title: 'কোন বাক্যটি কিতাবের মতো শুদ্ধ?',
        targetBangla: 'উহা (একটি) কলম',
        options: [
          { text: 'ذٰلِكَ قَلَمٌ', isCorrect: true, explanation: 'কিতাবে আছে: ذٰلِكَ قَلَمٌ' },
          { text: 'تِلْكَ قَلَمٌ', isCorrect: false, explanation: 'قَلَمٌ-এর আগে কিতাবে ذٰلِكَ এসেছে।' }
        ]
      },
      fillDemonstrative(SENT.hadhihiHujra, ['هٰذَا'])
    ]
  ),

  stage(
    {
      id: 'l1-words-3',
      titleBn: 'শব্দার্থ (৩/৩)',
      shortTitle: 'শব্দার্থ ৩',
      titleAr: 'الْمُفْرَدَاتُ (٣)',
      desc: 'তালা, চাবি, বাক্স, ঘড়ি, ছাতা, চশমা, কার ও সাইকেল',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '২০'
    },
    [
      intro(W.lock), intro(W.key), intro(W.box), intro(W.clock),
      match(['lock', 'key', 'box', 'clock']),
      intro(W.umbrella), intro(W.glasses), intro(W.car), intro(W.bicycle),
      match(['umbrella', 'glasses', 'car', 'bicycle']),
      pictureChoice('key', ['lock', 'box', 'clock']),
      pictureChoice('glasses', ['umbrella', 'car', 'bicycle']),
      meaningMcq('box', ['lock', 'clock', 'car'])
    ]
  ),

  stage(
    {
      id: 'l1-question-ma',
      titleBn: 'প্রশ্ন: مَا هٰذَا؟',
      shortTitle: 'প্রশ্নোত্তর',
      titleAr: 'مَا هٰذَا؟',
      desc: 'ইহা কী? উহা কী? — কিতাবের প্রশ্নোত্তর পড়ো ও অর্থ বলো',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '২০'
    },
    [
      {
        type: 'grammar_card',
        title: 'ইহা কী? উহা কী?',
        table: [
          { arabic: 'مَا هٰذَا - مَا هٰذِهِ', bangla: 'ইহা কী? (এটি কী?)' },
          { arabic: 'مَا ذٰلِكَ - مَا تِلْكَ', bangla: 'উহা কী? (সেটি কী?)' }
        ]
      },
      intro({ arabic: 'مَا هٰذَا؟', bangla: 'ইহা কী? (এটি কী?)' }, 'কিতাবের প্রশ্ন'),
      intro({ arabic: 'مَا ذٰلِكَ؟', bangla: 'উহা কী? (সেটি কী?)' }, 'কিতাবের প্রশ্ন'),
      pictureQuestion('هٰذَا', 'book', [['ذٰلِكَ', 'pen'], ['هٰذِهِ', 'ruler']], 'প্রশ্নোত্তর পড়ো ও অর্থ বলো'),
      pictureQuestion('ذٰلِكَ', 'pen', [['هٰذَا', 'pen'], ['تِلْكَ', 'blackboard']], 'প্রশ্নোত্তর পড়ো ও অর্থ বলো'),
      pictureQuestion('هٰذِهِ', 'ruler', [['تِلْكَ', 'ruler'], ['هٰذَا', 'book']], 'প্রশ্নোত্তর পড়ো ও অর্থ বলো'),
      pictureQuestion('تِلْكَ', 'blackboard', [['هٰذِهِ', 'blackboard'], ['ذٰلِكَ', 'pen']], 'প্রশ্নোত্তর পড়ো ও অর্থ বলো'),
      {
        type: 'match_pairs',
        title: 'প্রশ্ন ও বাক্যের অর্থ মেলান',
        pairs: [
          { arabic: 'مَا هٰذَا؟', bangla: 'ইহা কী?' },
          { arabic: 'مَا ذٰلِكَ؟', bangla: 'উহা কী?' },
          { arabic: 'هٰذَا كِتَابٌ', bangla: 'ইহা একটি বই' },
          { arabic: 'ذٰلِكَ قَلَمٌ', bangla: 'উহা একটি কলম' }
        ]
      },
      {
        type: 'fill_blank',
        title: 'প্রশ্নটি পূরণ করুন',
        targetBangla: 'উহা কী? (সেটি কী?)',
        fullArabic: 'مَا ذٰلِكَ؟',
        tokensBefore: ['مَا'],
        tokensAfter: ['؟'],
        missingToken: 'ذٰلِكَ',
        options: [
          { text: 'ذٰلِكَ', isCorrect: true },
          { text: 'هٰذَا', isCorrect: false }
        ]
      }
    ]
  ),

  stage(
    {
      id: 'l1-tamrin',
      titleBn: 'তামরীন: ছবি দেখে উত্তর দাও',
      shortTitle: 'তামরীন',
      titleAr: 'التَّمْرِينُ',
      desc: 'কিতাবের ২১ পৃষ্ঠার ১১টি প্রশ্ন ও ইশারার অনুশীলন',
      iconName: 'PenTool',
      color: 'amber',
      estMinutes: 4,
      bookPages: '২১'
    },
    [
      pictureQuestion('هٰذَا', 'chair', [['ذٰلِكَ', 'chair'], ['هٰذَا', 'house']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('ذٰلِكَ', 'house', [['هٰذَا', 'house'], ['ذٰلِكَ', 'mosque']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('تِلْكَ', 'clock', [['هٰذِهِ', 'clock'], ['تِلْكَ', 'car']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('هٰذَا', 'lock', [['هٰذَا', 'key'], ['ذٰلِكَ', 'lock']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('ذٰلِكَ', 'wall', [['هٰذَا', 'wall'], ['ذٰلِكَ', 'door']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('هٰذِهِ', 'glasses', [['تِلْكَ', 'glasses'], ['هٰذِهِ', 'umbrella']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('هٰذَا', 'key', [['هٰذَا', 'lock'], ['ذٰلِكَ', 'key']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('تِلْكَ', 'bag', [['هٰذِهِ', 'bag'], ['تِلْكَ', 'notebook']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('هٰذَا', 'mosque', [['ذٰلِكَ', 'mosque'], ['هٰذَا', 'house']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('تِلْكَ', 'car', [['هٰذِهِ', 'car'], ['تِلْكَ', 'bicycle']], 'ছবি দেখে উত্তর দাও'),
      pictureQuestion('هٰذِهِ', 'umbrella', [['تِلْكَ', 'umbrella'], ['هٰذِهِ', 'glasses']], 'ছবি দেখে উত্তর দাও'),
      {
        type: 'grammar_card',
        title: 'বন্ধুর সাথে ইশারার অনুশীলন',
        summary: 'কিতাবের নির্দেশনা: দু\'জন দাঁড়াও এবং দূর ও নিকট থেকে বিভিন্ন বস্তুর দিকে হাতে ইশারা করে প্রশ্ন করো এবং উত্তর দাও। এই মুহূর্তে হয়তো আপনি এটি করতে পারবেন না; বাকি যখন সুযোগ পাবেন তখন করবেন, ইন শা আল্লাহ।',
        table: [
          { arabic: 'مَا هٰذَا؟ — هٰذَا بَابٌ', bangla: 'কাছের জিনিস দেখিয়ে' },
          { arabic: 'مَا تِلْكَ؟ — تِلْكَ نَافِذَةٌ', bangla: 'দূরের জিনিস দেখিয়ে' }
        ]
      }
    ]
  ),

  stage(
    {
      id: 'l1-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الِاخْتِبَارُ',
      desc: 'পুরো দারসের শব্দ, ইশারা ও প্রশ্নোত্তর যাচাই',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '১৭–২১'
    },
    [
      quiz("'سَبُّورَةٌ' শব্দের অর্থ কী?", ['একটি ব্লাকবোর্ড', 'একটি খাতা', 'একটি রুলার', 'একটি টেবিল'], 'কিতাব: سَبُّورَةٌ = একটি ব্লাকবোর্ড।'),
      quiz("'ইহা (এটি)' বোঝাতে কিতাবে কোন শব্দ দুটি এসেছে?", ['هٰذَا - هٰذِهِ', 'ذٰلِكَ - تِلْكَ', 'مَا هٰذَا - مَا هٰذِهِ'], 'কিতাবের টেবিল: هٰذَا - هٰذِهِ = ইহা (এটি)।'),
      pictureChoice('car', ['bicycle', 'clock', 'umbrella']),
      quiz('দূরের কলম দেখিয়ে কী বলবে?', ['ذٰلِكَ قَلَمٌ', 'هٰذَا قَلَمٌ', 'تِلْكَ قَلَمٌ'], 'কিতাব: ذٰلِكَ قَلَمٌ = উহা (একটি) কলম।'),
      quiz("'উহা কী? (সেটি কী?)' এর আরবি কোনটি?", ['مَا ذٰلِكَ؟', 'مَا هٰذَا؟', 'ذٰلِكَ قَلَمٌ'], 'কিতাবের টেবিল: مَا ذٰلِكَ - مَا تِلْكَ = উহা কী? (সেটি কী?)'),
      quiz("'مِفْتَاحٌ' শব্দের অর্থ কী?", ['একটি চাবি', 'একটি তালা', 'একটি বাক্স', 'একটি ঘড়ি'], 'কিতাব: مِفْتَاحٌ = একটি চাবি।'),
      pictureChoice('lamp', ['door', 'window', 'key']),
      quiz("'هٰذِهِ مَدْرَسَةٌ' বাক্যের অর্থ কী?", ['ইহা একটি মাদরাসা', 'উহা একটি মাদরাসা', 'ইহা একটি কামরা'], 'هٰذِهِ = ইহা, مَدْرَسَةٌ = একটি মাদরাসা।'),
      quiz("কিতাবে 'একটি কামরা' অর্থে কোন দুটি শব্দ এসেছে?", ['حُجْرَةٌ - غُرْفَةٌ', 'طَاوِلَةٌ - نَافِذَةٌ', 'مَدْرَسَةٌ - سَبُّورَةٌ'], 'কিতাব: حُجْرَةٌ - غُرْفَةٌ = একটি কামরা।'),
      quiz('কাছের ছাতা দেখিয়ে প্রশ্ন: مَا هٰذِهِ؟ — উত্তর কোনটি?', ['هٰذِهِ مِظَلَّةٌ', 'تِلْكَ مِظَلَّةٌ', 'هٰذَا مِظَلَّةٌ'], 'কিতাব ২১ পৃষ্ঠা: কাছের ছাতা — هٰذِهِ مِظَلَّةٌ।')
    ]
  )
];

// ---------- পাঠের অন্যান্য ফিল্ড (ফ্ল্যাশকার্ড, তামরীন মোড, অ্যাডমিন) ----------

const stripUi = ({ arabic, bangla, picture }) => ({ arabic, bangla, picture });

const vocabulary = [
  'book', 'pen', 'chair', 'house', 'door', 'lamp', 'wall', 'bed', 'mosque',
  'madrasa', 'blackboard', 'ruler', 'bag', 'notebook', 'table', 'hujra', 'ghurfa', 'window',
  'lock', 'key', 'box', 'clock', 'umbrella', 'glasses', 'car', 'bicycle'
].map(k => stripUi(W[k]));

const sentences = Object.values(SENT).map(s => ({
  arabic: s.arabic,
  bangla: s.bangla,
  picture: s.picture,
  distance: s.distance,
  page: s.page
}));

const qa = (dem, key) => {
  const s = S(dem, key);
  return {
    speaker: 'কিতাবের প্রশ্নোত্তর',
    questionArabic: QUESTION[dem].arabic,
    questionBangla: QUESTION[dem].bangla,
    answerArabic: s.arabic,
    answerBangla: s.bangla,
    arabic: `${QUESTION[dem].arabic} — ${s.arabic}`,
    bangla: `${QUESTION[dem].bangla} — ${s.bangla}`,
    page: '২০'
  };
};

const dialogues = [qa('هٰذَا', 'book'), qa('ذٰلِكَ', 'pen'), qa('هٰذِهِ', 'ruler'), qa('تِلْكَ', 'blackboard')];

const TAMRIN_ITEMS = [
  ['هٰذَا', 'chair'], ['ذٰلِكَ', 'house'], ['تِلْكَ', 'clock'], ['هٰذَا', 'lock'],
  ['ذٰلِكَ', 'wall'], ['هٰذِهِ', 'glasses'], ['هٰذَا', 'key'], ['تِلْكَ', 'bag'],
  ['هٰذَا', 'mosque'], ['تِلْكَ', 'car'], ['هٰذِهِ', 'umbrella']
];

const tamrinKitabi = TAMRIN_ITEMS.map(([dem, key]) => {
  const s = S(dem, key);
  return {
    task: 'ছবি দেখে উত্তর দাও',
    mode: 'bn-to-ar',
    arabic: s.arabic,
    bangla: s.bangla,
    hint: `প্রশ্ন: ${QUESTION[dem].arabic} — ছবিতে ${s.distance === 'near' ? 'কাছের' : 'দূরের'} ${W[key].bangla.replace('একটি ', '')}`,
    picture: s.picture,
    distance: s.distance,
    page: '২১'
  };
});

const quizLegacy = bookStages
  .find(s => s.id === 'l1-quiz')
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
    id: 'l1-q-ism-ishara',
    stageId: 'l1-rule-hadha-dhalika',
    title: 'ইসমুল ইশারা: কাছে ও দূরে',
    table: [
      { arabic: 'هٰذَا / هٰذِهِ', bangla: 'কাছের জন্য' },
      { arabic: 'ذٰلِكَ / تِلْكَ', bangla: 'দূরের জন্য' }
    ],
    rule: 'কোনো কিছুর দিকে ইশারা করতে ইসমুল ইশারা ব্যবহার হয়। কাছের জিনিসের জন্য هٰذَا, দূরের জিনিসের জন্য ذٰلِكَ।',
    examples: [
      { arabic: 'هٰذَا كِتَابٌ', bangla: 'ইহা (একটি) বই' },
      { arabic: 'ذٰلِكَ قَلَمٌ', bangla: 'উহা (একটি) কলম' }
    ]
  },
  {
    id: 'l1-q-muzakkar-muannas',
    stageId: 'l1-rule-hadhihi-tilka',
    title: 'মুযাক্কার ও মুআন্নাস',
    table: [
      { arabic: 'هٰذَا / ذٰلِكَ', bangla: 'পুরুষবাচক (মুযাক্কার)' },
      { arabic: 'هٰذِهِ / تِلْكَ', bangla: 'স্ত্রীবাচক (মুআন্নাস)' }
    ],
    rule: 'শব্দের শেষে গোল তা (ة) থাকলে সাধারণত শব্দটি স্ত্রীবাচক, তাই তার আগে هٰذِهِ বা تِلْكَ বসে।',
    examples: [
      { arabic: 'هٰذَا بَابٌ', bangla: 'ইহা একটি দরজা' },
      { arabic: 'هٰذِهِ مَدْرَسَةٌ', bangla: 'ইহা একটি মাদরাসা' },
      { arabic: 'تِلْكَ سَبُّورَةٌ', bangla: 'উহা একটি ব্লাকবোর্ড' }
    ]
  },
  {
    id: 'l1-q-ma-question',
    stageId: 'l1-question-ma',
    title: 'مَا দিয়ে প্রশ্ন',
    table: [
      { arabic: 'مَا', bangla: 'কী?' },
      { arabic: 'مَا هٰذَا؟', bangla: 'ইহা কী?' }
    ],
    rule: 'কোনো জিনিস সম্পর্কে জানতে مَا দিয়ে প্রশ্ন করা হয়। উত্তরে প্রশ্নের ইশারা শব্দটিই আসে।',
    examples: [
      { arabic: 'مَا هٰذَا؟ — هٰذَا كِتَابٌ', bangla: 'ইহা কী? — ইহা একটি বই' },
      { arabic: 'مَا تِلْكَ؟ — تِلْكَ سَبُّورَةٌ', bangla: 'উহা কী? — উহা একটি ব্লাকবোর্ড' }
    ]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l1',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ১৭-২১',
    qaida,
    grammarRule: {
      title: 'কিতাবের টেবিল: ইশারা ও প্রশ্ন',
      summary: 'هٰذَا - هٰذِهِ = ইহা (এটি)। ذٰلِكَ - تِلْكَ = উহা (সেটি)। مَا هٰذَا - مَا هٰذِهِ = ইহা কী? (এটি কী?)। مَا ذٰلِكَ - مَا تِلْكَ = উহা কী? (সেটি কী?)',
      points: [
        'هٰذَا كِتَابٌ = ইহা (একটি) বই',
        'ذٰلِكَ قَلَمٌ = উহা (একটি) কলম',
        'কাছের জন্য هٰذَا / هٰذِهِ, দূরের জন্য ذٰلِكَ / تِلْكَ।',
        'هٰذَا / ذٰلِكَ পুরুষবাচক শব্দের জন্য; هٰذِهِ / تِلْكَ স্ত্রীবাচক শব্দের জন্য (গোল তা ة থাকলে সাধারণত স্ত্রীবাচক)।',
        'مَا = কী? — مَا هٰذَا؟ এর উত্তরে هٰذَا ... বলা হয়।'
      ]
    },
    vocabulary,
    sentences,
    dialogues,
    tamrinKitabi,
    quiz: quizLegacy,
    bookStages
  }
};
