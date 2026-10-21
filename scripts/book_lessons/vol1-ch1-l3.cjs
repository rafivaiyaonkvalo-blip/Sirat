// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৩য় দারস (বই পৃষ্ঠা ২৫–২৮, PDF পৃষ্ঠা ২৩–২৬)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ। মানুষ নিয়ে পাঠ, তাই কোনো ছবি নেই।

const W = {
  // পৃ. ২৫
  tilmidh: { arabic: 'تِلْمِيذٌ', bangla: 'একজন ছাত্র' },
  tilmidha: { arabic: 'تِلْمِيذَةٌ', bangla: 'একজন ছাত্রী' },
  muallim: { arabic: 'مُعَلِّمٌ', bangla: 'একজন শিক্ষক' },
  muallima: { arabic: 'مُعَلِّمَةٌ', bangla: 'একজন শিক্ষিকা' },
  walad: { arabic: 'وَلَدٌ', bangla: 'একটি ছেলে' },
  bint: { arabic: 'بِنْتٌ', bangla: 'একটি মেয়ে' },
  tifl: { arabic: 'طِفْلٌ - طِفْلَةٌ', bangla: 'একটি শিশু' },
  muaddab: { arabic: 'مُؤَدَّبٌ', bangla: 'ভদ্র, সভ্য' },
  // পৃ. ২৬ পাদটীকা
  hal: { arabic: 'هَلْ؟', bangla: 'কি?' },
  naam: { arabic: 'نَعَمْ', bangla: 'হাঁ' },
  la: { arabic: 'لَا', bangla: 'না' },
  man: { arabic: 'مَنْ؟', bangla: 'কে?' },
  bal: { arabic: 'بَلْ', bangla: 'বরং' },
  wa: { arabic: 'وَ', bangla: 'এবং' },
  // পৃ. ২৭
  tajir: { arabic: 'تَاجِرٌ', bangla: '(একজন) ব্যবসায়ী' },
  fallah: { arabic: 'فَلَّاحٌ', bangla: '(একজন) কৃষক' },
  ghani: { arabic: 'غَنِيٌّ', bangla: 'ধনী' },
  faqir: { arabic: 'فَقِيرٌ', bangla: 'গরীব, দরিদ্র' },
  dhaki: { arabic: 'ذَكِيٌّ', bangla: 'মেধাবী, বুদ্ধিমান' },
  ghabi: { arabic: 'غَبِيٌّ', bangla: 'মেধাহীন, নির্বোধ' },
  rajul: { arabic: 'رَجُلٌ', bangla: '(একজন) লোক, পুরুষ' },
  imraa: { arabic: 'اِمْرَأَةٌ', bangla: '(একজন) স্ত্রীলোক, মহিলা' },
  // পৃ. ২৮-এর বাক্যে এসেছে
  jiddan: { arabic: 'جِدًّا', bangla: 'খুব, অত্যন্ত' },
  sharif: { arabic: 'شَرِيفٌ', bangla: 'ভদ্র, সম্ভ্রান্ত' }
};

// নাম (m = ছেলের নাম, শেষে তানবীন; f = মেয়ের নাম, তানবীন নেই)
const NAMES = {
  said: { arabic: 'سَعِيدٌ', bangla: 'সাঈদ', g: 'm' },
  khalid: { arabic: 'خَالِدٌ', bangla: 'খালেদ', g: 'm' },
  rashid: { arabic: 'رَاشِدٌ', bangla: 'রাশেদ', g: 'm' },
  mahmud: { arabic: 'مَحْمُودٌ', bangla: 'মাহমূদ', g: 'm' },
  bilal: { arabic: 'بِلَالٌ', bangla: 'বেলাল', g: 'm' },
  majid: { arabic: 'مَاجِدٌ', bangla: 'মাজেদ', g: 'm' },
  aisha: { arabic: 'عَائِشَةُ', bangla: 'আয়েশা', g: 'f' },
  fatima: { arabic: 'فَاطِمَةُ', bangla: 'ফাতেমা', g: 'f' },
  farhana: { arabic: 'فَرْحَانَةُ', bangla: 'ফারহানা', g: 'f' },
  khadija: { arabic: 'خَدِيجَةُ', bangla: 'খাদীজা', g: 'f' },
  zaynab: { arabic: 'زَيْنَبُ', bangla: 'যায়নাব', g: 'f' }
};

const T = (arabic, bangla, page) => ({ arabic, bangla, page });

// কিতাবের বাক্য (ক্রম অনুযায়ী)
const SENT = {
  // পৃ. ২৫
  anaTilmidh: T('أَنَا تِلْمِيذٌ', 'আমি (একজন) ছাত্র', '২৫'),
  anaTilmidhJadid: T('أَنَا تِلْمِيذٌ جَدِيدٌ', 'আমি নতুন ছাত্র', '২৫'),
  anaBilal: T('أَنَا بِلَالٌ', 'আমি বেলাল', '২৫'),
  anaWaladMuaddab: T('أَنَا وَلَدٌ مُؤَدَّبٌ', 'আমি ভদ্র ছেলে', '২৫'),
  anaAisha: T('أَنَا عَائِشَةُ', 'আমি আয়েশা', '২৫'),
  anaTilmidha: T('أَنَا تِلْمِيذَةٌ', 'আমি (একজন) ছাত্রী', '২৫'),
  anaTilmidhaJadida: T('أَنَا تِلْمِيذَةٌ جَدِيدَةٌ', 'আমি নতুন ছাত্রী', '২৫'),
  anaBintMuaddaba: T('أَنَا بِنْتٌ مُؤَدَّبَةٌ', 'আমি ভদ্র মেয়ে', '২৫'),
  // পৃ. ২৬
  huwaBilal: T('هُوَ بِلَالٌ', 'সে বেলাল', '২৬'),
  huwaTilmidhJadid: T('هُوَ تِلْمِيذٌ جَدِيدٌ', 'সে নতুন ছাত্র', '২৬'),
  huwaWaladMuaddab: T('هُوَ وَلَدٌ مُؤَدَّبٌ', 'সে ভদ্র ছেলে', '২৬'),
  hiyaAisha: T('هِيَ عَائِشَةُ', 'সে আয়েশা', '২৬'),
  hiyaTilmidhaJadida: T('هِيَ تِلْمِيذَةٌ جَدِيدَةٌ', 'সে নতুন ছাত্রী', '২৬'),
  hiyaBintMuaddaba: T('هِيَ بِنْتٌ مُؤَدَّبَةٌ', 'সে ভদ্র মেয়ে', '২৬'),
  // পৃ. ২৬ — *** অনুচ্ছেদ
  bilalTilmidhJadid: T('بِلَالٌ تِلْمِيذٌ جَدِيدٌ', 'বেলাল নতুন ছাত্র', '২৬'),
  majidMuallimJayyid: T('مَاجِدٌ مُعَلِّمٌ جَيِّدٌ', 'মাজেদ ভালো শিক্ষক', '২৬'),
  zaynabBintSaghira: T('زَيْنَبُ بِنْتٌ صَغِيرَةٌ', 'যায়নাব ছোট মেয়ে', '২৬'),
  farhanaMuallimaJadida: T('فَرْحَانَةُ مُعَلِّمَةٌ جَدِيدَةٌ', 'ফারহানা নতুন শিক্ষিকা', '২৬'),
  mahmudTiflJamil: T('مَحْمُودٌ طِفْلٌ جَمِيلٌ', 'মাহমূদ সুন্দর শিশু', '২৬'),
  fatimaTiflaJamila: T('فَاطِمَةُ طِفْلَةٌ جَمِيلَةٌ', 'ফাতেমা সুন্দর শিশু', '২৬'),
  khalidWaladMuaddab: T('خَالِدٌ وَلَدٌ مُؤَدَّبٌ', 'খালেদ ভদ্র ছেলে', '২৬'),
  khadijaBintMuaddaba: T('خَدِيجَةُ بِنْتٌ مُؤَدَّبَةٌ', 'খাদীজা ভদ্র মেয়ে', '২৬'),
  // পৃ. ২৬ — হে! ও هَلْ
  yaWalad: T('يَا وَلَدُ!', 'হে ছেলে!', '২৬'),
  yaBilal: T('يَا بِلَالُ!', 'হে বেলাল!', '২৬'),
  yaBint: T('يَا بِنْتُ!', 'হে মেয়ে!', '২৬'),
  yaZaynab: T('يَا زَيْنَبُ!', 'হে যায়নাব!', '২৬'),
  halAntaMuallim: T('هَلْ أَنْتَ مُعَلِّمٌ؟', 'তুমি কি শিক্ষক?', '২৬'),
  laBalAnaTilmidh: T('لَا .. بَلْ أَنَا تِلْمِيذٌ', 'না, বরং আমি ছাত্র।', '২৬'),
  // পৃ. ২৮ — পড়ার অনুচ্ছেদ
  anaMajidWaAntaBilal: T('أَنَا مَاجِدٌ وَأَنْتَ بِلَالٌ', 'আমি মাজেদ এবং তুমি বেলাল', '২৮'),
  anaMuallimWaAntaTilmidh: T('أَنَا مُعَلِّمٌ وَأَنْتَ تِلْمِيذٌ', 'আমি শিক্ষক এবং তুমি ছাত্র', '২৮'),
  anaMuallimJadidWaAnta: T('أَنَا مُعَلِّمٌ جَدِيدٌ وَأَنْتَ تِلْمِيذٌ جَدِيدٌ', 'আমি নতুন শিক্ষক এবং তুমি নতুন ছাত্র', '২৮'),
  huwaMahmudWaAnaBashir: T('هُوَ مَحْمُودٌ وَأَنَا بَشِيرٌ', 'সে মাহমূদ এবং আমি বাশীর', '২৮'),
  mahmudTajirGhani: T('مَحْمُودٌ تَاجِرٌ غَنِيٌّ وَأَنَا فَلَّاحٌ فَقِيرٌ', 'মাহমূদ ধনী ব্যবসায়ী এবং আমি গরীব কৃষক', '২৮'),
  huwaBilalWaHiyaZaynab: T('هُوَ بِلَالٌ وَهِيَ زَيْنَبُ', 'সে বেলাল এবং সে যায়নাব', '২৮'),
  bilalDhakiWaZaynab: T('بِلَالٌ تِلْمِيذٌ ذَكِيٌّ وَزَيْنَبُ تِلْمِيذَةٌ ذَكِيَّةٌ', 'বেলাল মেধাবী ছাত্র এবং যায়নাব মেধাবী ছাত্রী', '২৮'),
  mahmudRajulGhani: T('مَحْمُودٌ رَجُلٌ غَنِيٌّ وَرَيْحَانَةُ امْرَأَةٌ فَقِيرَةٌ', 'মাহমূদ ধনী লোক এবং রায়হানা গরীব মহিলা', '২৮'),
  halMahmudTajir: T('هَلْ مَحْمُودٌ تَاجِرٌ؟', 'মাহমূদ কি ব্যবসায়ী?', '২৮'),
  naamMahmudTajir: T('نَعَمْ .. مَحْمُودٌ تَاجِرٌ', 'হাঁ, মাহমূদ ব্যবসায়ী', '২৮'),
  halZaynabGhabiyya: T('هَلْ زَيْنَبُ تِلْمِيذَةٌ غَبِيَّةٌ؟', 'যায়নাব কি মেধাহীন ছাত্রী?', '২৮'),
  laBalHiyaDhakiyya: T('لَا .. بَلْ هِيَ تِلْمِيذَةٌ ذَكِيَّةٌ جِدًّا', 'না, বরং সে খুব মেধাবী ছাত্রী', '২৮'),
  antiImraaDhakiyya: T('أَنْتِ امْرَأَةٌ ذَكِيَّةٌ جِدًّا', 'তুমি খুব বুদ্ধিমান মহিলা', '২৮'),
  aishaImraaDhakiyya: T('عَائِشَةُ امْرَأَةٌ ذَكِيَّةٌ جِدًّا', 'আয়েশা খুব বুদ্ধিমান মহিলা', '২৮'),
  saidRajulSharif: T('سَعِيدٌ رَجُلٌ شَرِيفٌ جِدًّا', 'সাঈদ খুব সম্ভ্রান্ত লোক', '২৮'),
  huwaGhaniJiddan: T('هُوَ غَنِيٌّ جِدًّا', 'সে খুব ধনী', '২৮')
};

// কিতাবের প্রশ্নোত্তর (পৃ. ২৬–২৭)
const QA = [
  { q: T('مَنْ أَنْتَ يَا وَلَدُ؟', 'হে ছেলে, তুমি কে?'), a: T('أَنَا بِلَالٌ', 'আমি বেলাল'), wrong: ['أَنْتَ بِلَالٌ', 'هُوَ بِلَالٌ'] },
  { q: T('هَلْ أَنْتَ تِلْمِيذٌ؟', 'তুমি কি ছাত্র?'), a: T('نَعَمْ .. أَنَا تِلْمِيذٌ', 'হাঁ, আমি ছাত্র'), wrong: ['نَعَمْ .. أَنْتَ تِلْمِيذٌ', 'نَعَمْ .. أَنَا تِلْمِيذَةٌ'] },
  { q: T('هَلْ أَنْتَ تِلْمِيذٌ جَدِيدٌ؟', 'তুমি কি নতুন ছাত্র?'), a: T('نَعَمْ .. أَنَا تِلْمِيذٌ جَدِيدٌ', 'হাঁ, আমি নতুন ছাত্র'), wrong: ['نَعَمْ .. أَنَا تِلْمِيذٌ جَدِيدَةٌ', 'نَعَمْ .. هُوَ تِلْمِيذٌ جَدِيدٌ'] },
  { q: T('مَنْ أَنْتِ يَا بِنْتُ؟', 'হে মেয়ে, তুমি কে?'), a: T('أَنَا زَيْنَبُ', 'আমি যায়নাব'), wrong: ['هِيَ زَيْنَبُ', 'أَنْتِ زَيْنَبُ'] },
  { q: T('هَلْ أَنْتِ بِنْتٌ صَغِيرَةٌ؟', 'তুমি কি ছোট মেয়ে?'), a: T('نَعَمْ .. أَنَا بِنْتٌ صَغِيرَةٌ', 'হাঁ, আমি ছোট মেয়ে'), wrong: ['نَعَمْ .. أَنَا بِنْتٌ صَغِيرٌ', 'نَعَمْ .. أَنْتِ بِنْتٌ صَغِيرَةٌ'] },
  { q: T('هَلْ أَنْتِ مُعَلِّمَةٌ؟', 'তুমি কি শিক্ষিকা?'), a: T('لَا .. بَلْ أَنَا تِلْمِيذَةٌ', 'না, বরং আমি ছাত্রী'), wrong: ['لَا .. بَلْ أَنَا تِلْمِيذٌ', 'نَعَمْ .. بَلْ أَنَا تِلْمِيذَةٌ'] },
  { q: T('مَنْ هُوَ يَا بِلَالُ؟', 'হে বেলাল, সে কে?'), a: T('هُوَ رَاشِدٌ', 'সে রাশেদ'), wrong: ['هِيَ رَاشِدٌ', 'أَنَا رَاشِدٌ'] },
  { q: T('هَلْ هُوَ مُعَلِّمٌ؟', 'সে কি শিক্ষক?'), a: T('لَا .. بَلْ هُوَ تِلْمِيذٌ', 'না, বরং সে ছাত্র'), wrong: ['لَا .. بَلْ هِيَ تِلْمِيذٌ', 'نَعَمْ .. بَلْ هُوَ تِلْمِيذٌ'] },
  { q: T('مَنْ هِيَ يَا زَيْنَبُ؟', 'হে যায়নাব, সে কে?'), a: T('هِيَ خَدِيجَةُ - هِيَ تِلْمِيذَةٌ جَدِيدَةٌ', 'সে খাদীজা, সে নতুন ছাত্রী'), wrong: ['هُوَ خَدِيجَةُ - هُوَ تِلْمِيذَةٌ جَدِيدَةٌ', 'هِيَ خَدِيجَةُ - هِيَ تِلْمِيذٌ جَدِيدٌ'] },
  { q: T('مَنْ أَنَا؟', 'আমি কে?'), a: T('أَنْتَ مَاجِدٌ - أَنْتَ مُعَلِّمٌ جَيِّدٌ', 'তুমি মাজেদ, তুমি ভালো শিক্ষক'), wrong: ['أَنَا مَاجِدٌ - أَنَا مُعَلِّمٌ جَيِّدٌ', 'أَنْتِ مَاجِدٌ - أَنْتِ مُعَلِّمٌ جَيِّدٌ'] },
  { q: T('مَنْ مَاجِدٌ؟', 'মাজেদ কে?'), a: T('مَاجِدٌ مُعَلِّمٌ (هُوَ مُعَلِّمٌ)', 'মাজেদ শিক্ষক (সে শিক্ষক)'), wrong: ['مَاجِدٌ مُعَلِّمَةٌ (هِيَ مُعَلِّمَةٌ)', 'مَاجِدٌ تِلْمِيذٌ (أَنَا تِلْمِيذٌ)'] },
  { q: T('هَلْ هُوَ مُعَلِّمٌ جَيِّدٌ؟', 'সে কি ভালো শিক্ষক?'), a: T('نَعَمْ .. هُوَ مُعَلِّمٌ جَيِّدٌ', 'হাঁ, সে ভালো শিক্ষক'), wrong: ['نَعَمْ .. هُوَ مُعَلِّمٌ جَيِّدَةٌ', 'لَا .. هُوَ مُعَلِّمٌ جَيِّدٌ'] },
  { q: T('هَلْ زَيْنَبُ بِنْتٌ كَبِيرَةٌ؟', 'যায়নাব কি বড় মেয়ে?'), a: T('لَا .. بَلْ هِيَ بِنْتٌ صَغِيرَةٌ', 'না, বরং সে ছোট মেয়ে'), wrong: ['لَا .. بَلْ هُوَ بِنْتٌ صَغِيرَةٌ', 'نَعَمْ .. هِيَ بِنْتٌ صَغِيرَةٌ'] },
  { q: T('هَلْ فَرْحَانَةُ مُعَلِّمَةٌ جَدِيدَةٌ؟', 'ফারহানা কি নতুন শিক্ষিকা?'), a: T('نَعَمْ .. هِيَ مُعَلِّمَةٌ جَدِيدَةٌ', 'হাঁ, সে নতুন শিক্ষিকা'), wrong: ['نَعَمْ .. هُوَ مُعَلِّمٌ جَدِيدٌ', 'نَعَمْ .. هِيَ مُعَلِّمَةٌ جَدِيدٌ'] },
  { q: T('هَلْ خَالِدٌ وَلَدٌ مُؤَدَّبٌ؟', 'খালেদ কি ভদ্র ছেলে?'), a: T('نَعَمْ .. هُوَ وَلَدٌ مُؤَدَّبٌ', 'হাঁ, সে ভদ্র ছেলে'), wrong: ['نَعَمْ .. هِيَ وَلَدٌ مُؤَدَّبٌ', 'نَعَمْ .. هُوَ وَلَدٌ مُؤَدَّبَةٌ'] }
];

// ---------- ধাপ তৈরির ছোট সহায়ক ----------

const intro = (item, title = 'নতুন শব্দ') => ({
  type: 'intro',
  title,
  word: { arabic: item.arabic, bangla: item.bangla }
});

const introSentence = (sent) => intro(sent, 'কিতাবের বাক্য');

const match = (items, title = 'শব্দজোড় মেলান') => ({
  type: 'match_pairs',
  title,
  pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla }))
});

const meaningOf = (item, wrongBanglas, question = 'বাক্যটির অর্থ কী?') => ({
  type: 'mcq',
  word: { arabic: item.arabic, bangla: item.bangla },
  question,
  options: [item.bangla, ...wrongBanglas].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const arabicOf = (item, wrongArabics) => ({
  type: 'mcq',
  word: { arabic: item.bangla, bangla: item.bangla },
  question: `"${item.bangla}" এর আরবি কোনটি?`,
  options: [item.arabic, ...wrongArabics].map((text, i) => ({ text, isCorrect: i === 0 }))
});

// বাক্যের একটি শব্দ খালি রেখে পূরণ (index = কোন শব্দটি খালি)
const fill = (sent, index, wrong, title = 'খালি জায়গা পূরণ করুন') => {
  const tokens = sent.arabic.split(' ');
  return {
    type: 'fill_blank',
    title,
    targetBangla: sent.bangla,
    fullArabic: sent.arabic,
    tokensBefore: tokens.slice(0, index),
    tokensAfter: tokens.slice(index + 1),
    missingToken: tokens[index],
    options: [tokens[index], ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
  };
};

const build = (sent, distractors) => ({
  type: 'sentence_builder',
  title: 'কিতাবের বাক্য সাজান',
  targetArabic: sent.arabic,
  targetBangla: sent.bangla,
  targetTokens: sent.arabic.split(' '),
  distractors
});

const dialogue = ({ q, a, wrong }, speaker = 'প্রশ্নোত্তর পড়ো ও অর্থ বলো') => ({
  type: 'dialogue_listen',
  speaker,
  questionArabic: q.arabic,
  questionBangla: q.bangla,
  options: [a.arabic, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
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

const nameSortItem = (key) => {
  const n = NAMES[key];
  return {
    arabic: n.arabic,
    bangla: n.bangla,
    reveal: `${n.g === 'm' ? 'هُوَ' : 'هِيَ'} ${n.arabic}`,
    group: n.g
  };
};

// ---------- পর্বসমূহ (কিতাবের ক্রমে) ----------

const bookStages = [
  stage(
    {
      id: 'l3-words-people',
      titleBn: 'শব্দার্থ: ছাত্র, শিক্ষক',
      shortTitle: 'শব্দার্থ ১',
      titleAr: 'الْمُفْرَدَاتُ (١)',
      desc: 'ছাত্র-ছাত্রী, শিক্ষক-শিক্ষিকা, ছেলে, মেয়ে, শিশু ও ভদ্র',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '২৫'
    },
    [
      intro(W.tilmidh), intro(W.tilmidha), intro(W.muallim), intro(W.muallima),
      match([W.tilmidh, W.tilmidha, W.muallim, W.muallima]),
      intro(W.walad), intro(W.bint), intro(W.tifl), intro(W.muaddab),
      match([W.walad, W.bint, W.tifl, W.muaddab]),
      meaningOf(W.muallima, ['একজন ছাত্রী', 'একজন শিক্ষক'], 'শব্দটির অর্থ কী?'),
      meaningOf(W.muaddab, ['একটি শিশু', 'নতুন'], 'শব্দটির অর্থ কী?')
    ]
  ),

  stage(
    {
      id: 'l3-pronouns',
      titleBn: 'আমি, তুমি, সে',
      shortTitle: 'সর্বনাম',
      titleAr: 'أَنَا - أَنْتَ - هُوَ',
      desc: 'أَنَا, أَنْتَ - أَنْتِ, هُوَ - هِيَ এবং ছেলে-মেয়ের নাম',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৫'
    },
    [
      {
        type: 'grammar_card',
        title: 'আমি, তুমি, সে',
        table: [
          { arabic: 'أَنَا', bangla: 'আমি' },
          { arabic: 'أَنْتَ - أَنْتِ', bangla: 'তুমি' },
          { arabic: 'هُوَ - هِيَ', bangla: 'সে' }
        ]
      },
      intro({ arabic: 'أَنَا', bangla: 'আমি' }, 'নতুন শব্দ'),
      intro({ arabic: 'أَنْتَ - أَنْتِ', bangla: 'তুমি' }, 'নতুন শব্দ'),
      intro({ arabic: 'هُوَ - هِيَ', bangla: 'সে' }, 'নতুন শব্দ'),
      {
        type: 'grammar_card',
        title: 'ছেলে ও মেয়ের নাম',
        summary: 'কিতাব: পুরুষ-নামের শেষে সাধারণত তানবীন হয়, কিন্তু মেয়ে-নামের শেষে তানবীন হয় না।',
        table: [
          { arabic: 'سَعِيدٌ - خَالِدٌ - رَاشِدٌ - مَحْمُودٌ', bangla: 'সাঈদ, খালেদ, রাশেদ, মাহমূদ' },
          { arabic: 'عَائِشَةُ - فَاطِمَةُ - فَرْحَانَةُ - خَدِيجَةُ', bangla: 'আয়েশা, ফাতেমা, ফারহানা, খাদীজা' }
        ]
      },
      {
        type: 'sort_groups',
        title: 'নামটি ছেলের না মেয়ের? هُوَ না هِيَ?',
        groups: [
          { id: 'm', arabic: 'هُوَ' },
          { id: 'f', arabic: 'هِيَ' }
        ],
        items: ['said', 'aisha', 'khalid', 'fatima', 'mahmud', 'khadija'].map(nameSortItem)
      },
      introSentence(SENT.anaTilmidh),
      introSentence(SENT.anaTilmidhJadid),
      meaningOf({ arabic: 'هُوَ - هِيَ', bangla: 'সে' }, ['আমি', 'তুমি'], 'শব্দটির অর্থ কী?'),
      fill(SENT.anaTilmidhJadid, 0, ['هُوَ', 'أَنْتَ'])
    ]
  ),

  stage(
    {
      id: 'l3-self-intro',
      titleBn: 'নিজের ও অন্যের পরিচয়',
      shortTitle: 'পরিচয়',
      titleAr: 'أَنَا بِلَالٌ',
      desc: 'বেলাল ও আয়েশা নিজের সম্পর্কে, রাশেদ ও ফাতেমা তাদের সম্পর্কে বলছে',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '২৫–২৬'
    },
    [
      introSentence(SENT.anaBilal),
      introSentence(SENT.anaWaladMuaddab),
      introSentence(SENT.anaAisha),
      introSentence(SENT.anaBintMuaddaba),
      fill(SENT.anaTilmidhaJadida, 1, ['تِلْمِيذٌ']),
      fill(SENT.anaBintMuaddaba, 2, ['مُؤَدَّبٌ']),
      introSentence(SENT.huwaBilal),
      introSentence(SENT.hiyaAisha),
      fill(SENT.huwaTilmidhJadid, 0, ['هِيَ', 'أَنَا']),
      fill(SENT.hiyaTilmidhaJadida, 0, ['هُوَ', 'أَنَا']),
      build(SENT.huwaWaladMuaddab, ['هِيَ', 'مُؤَدَّبَةٌ']),
      build(SENT.hiyaBintMuaddaba, ['هُوَ', 'مُؤَدَّبٌ']),
      meaningOf(SENT.hiyaBintMuaddaba, ['আমি ভদ্র মেয়ে', 'সে ভদ্র ছেলে'])
    ]
  ),

  stage(
    {
      id: 'l3-reading-names',
      titleBn: 'পড়ো: বেলাল নতুন ছাত্র',
      shortTitle: 'পড়া ১',
      titleAr: 'الْقِرَاءَةُ (١)',
      desc: 'بِلَالٌ تِلْمِيذٌ جَدِيدٌ … خَدِيجَةُ بِنْتٌ مُؤَدَّبَةٌ — কিতাবের ২৬ পৃষ্ঠা',
      iconName: 'BookOpen',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৬'
    },
    [
      introSentence(SENT.bilalTilmidhJadid),
      introSentence(SENT.majidMuallimJayyid),
      introSentence(SENT.zaynabBintSaghira),
      introSentence(SENT.farhanaMuallimaJadida),
      introSentence(SENT.mahmudTiflJamil),
      introSentence(SENT.fatimaTiflaJamila),
      introSentence(SENT.khalidWaladMuaddab),
      introSentence(SENT.khadijaBintMuaddaba),
      fill(SENT.farhanaMuallimaJadida, 2, ['جَدِيدٌ']),
      fill(SENT.fatimaTiflaJamila, 1, ['طِفْلٌ']),
      build(SENT.majidMuallimJayyid, ['جَيِّدَةٌ', 'مُعَلِّمَةٌ']),
      meaningOf(SENT.zaynabBintSaghira, ['যায়নাব বড় মেয়ে', 'যায়নাব ছোট শিশু'])
    ]
  ),

  stage(
    {
      id: 'l3-ya-hal',
      titleBn: 'হে! ও প্রশ্ন: هَلْ',
      shortTitle: 'يَا - هَلْ',
      titleAr: 'يَا - هَلْ',
      desc: 'يَا وَلَدُ! হে ছেলে!, هَلْ أَنْتَ مُعَلِّمٌ؟ তুমি কি শিক্ষক?',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '২৬'
    },
    [
      {
        type: 'grammar_card',
        title: 'হে ছেলে! হে মেয়ে!',
        table: [
          { arabic: 'وَلَدٌ - يَا وَلَدُ!', bangla: 'হে ছেলে!' },
          { arabic: 'بِلَالٌ - يَا بِلَالُ!', bangla: 'হে বেলাল!' },
          { arabic: 'بِنْتٌ - يَا بِنْتُ!', bangla: 'হে মেয়ে!' },
          { arabic: 'زَيْنَبُ - يَا زَيْنَبُ!', bangla: 'হে যায়নাব!' }
        ]
      },
      intro(SENT.yaWalad, 'কিতাবের বাক্য'),
      intro(SENT.yaBint, 'কিতাবের বাক্য'),
      match([SENT.yaWalad, SENT.yaBilal, SENT.yaBint, SENT.yaZaynab], 'সম্বোধন ও অর্থ মেলান'),
      intro(W.hal), intro(W.naam), intro(W.la),
      match([W.hal, W.naam, W.la]),
      intro(W.man), intro(W.bal), intro(W.wa),
      match([W.man, W.bal, W.wa]),
      introSentence(SENT.halAntaMuallim),
      introSentence(SENT.laBalAnaTilmidh)
    ]
  ),

  stage(
    {
      id: 'l3-qa-1',
      titleBn: 'প্রশ্নোত্তর (১/২)',
      shortTitle: 'প্রশ্নোত্তর ১',
      titleAr: 'سُؤَالٌ وَجَوَابٌ (١)',
      desc: 'مَنْ أَنْتَ يَا وَلَدُ؟ — কিতাবের প্রশ্নোত্তর পড়ো ও অর্থ বলো',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '২৬–২৭'
    },
    [
      ...QA.slice(0, 8).map(item => dialogue(item)),
      fill(T('مَنْ أَنْتِ يَا بِنْتُ؟', 'হে মেয়ে, তুমি কে?'), 1, ['أَنْتَ', 'هُوَ']),
      meaningOf(QA[5].q, ['তুমি কি ছাত্রী?', 'সে কি শিক্ষিকা?'], 'প্রশ্নটির অর্থ কী?')
    ]
  ),

  stage(
    {
      id: 'l3-qa-2',
      titleBn: 'প্রশ্নোত্তর (২/২)',
      shortTitle: 'প্রশ্নোত্তর ২',
      titleAr: 'سُؤَالٌ وَجَوَابٌ (٢)',
      desc: 'مَنْ هِيَ يَا زَيْنَبُ؟ … هَلْ خَالِدٌ وَلَدٌ مُؤَدَّبٌ؟',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '২৭'
    },
    [
      ...QA.slice(8).map(item => dialogue(item)),
      spot('না, বরং সে ছোট মেয়ে', 'لَا .. بَلْ هِيَ بِنْتٌ صَغِيرَةٌ', 'لَا .. بَلْ هُوَ بِنْتٌ صَغِيرَةٌ', 'মেয়ের জন্য কিতাবে هِيَ এসেছে।'),
      meaningOf(QA[13].q, ['ফারহানা কি পুরোনো শিক্ষিকা?', 'ফারহানা কি নতুন ছাত্রী?'], 'প্রশ্নটির অর্থ কী?')
    ]
  ),

  stage(
    {
      id: 'l3-words-2',
      titleBn: 'শব্দার্থ: ব্যবসায়ী, কৃষক',
      shortTitle: 'শব্দার্থ ২',
      titleAr: 'الْمُفْرَدَاتُ (٢)',
      desc: 'ব্যবসায়ী, কৃষক, ধনী, গরীব, মেধাবী, মেধাহীন, পুরুষ ও মহিলা',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '২৭'
    },
    [
      intro(W.tajir), intro(W.fallah), intro(W.ghani), intro(W.faqir),
      match([W.tajir, W.fallah, W.ghani, W.faqir]),
      intro(W.dhaki), intro(W.ghabi), intro(W.rajul), intro(W.imraa),
      match([W.dhaki, W.ghabi, W.rajul, W.imraa]),
      {
        type: 'grammar_card',
        title: 'اِمْرَأَةٌ শব্দের আলিফ',
        summary: 'কিতাব: اِمْرَأَةٌ শব্দের আগে অন্য শব্দ হলে ا টি শুধু লেখায় আসে, উচ্চারণে আসে না।',
        table: [{ arabic: 'هِيَ امْرَأَةٌ', bangla: 'সে একজন মহিলা' }]
      },
      meaningOf(W.ghani, ['গরীব, দরিদ্র', 'মেধাবী, বুদ্ধিমান'], 'শব্দটির অর্থ কী?'),
      arabicOf({ arabic: 'فَلَّاحٌ', bangla: '(একজন) কৃষক' }, ['تَاجِرٌ', 'رَجُلٌ'])
    ]
  ),

  stage(
    {
      id: 'l3-reading-2',
      titleBn: 'পড়ার অনুচ্ছেদ (১/২)',
      shortTitle: 'পড়া ২',
      titleAr: 'الْقِرَاءَةُ (٢)',
      desc: 'أَنَا مَاجِدٌ وَأَنْتَ بِلَالٌ … — কিতাবের ২৮ পৃষ্ঠা',
      iconName: 'BookOpen',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৮'
    },
    [
      introSentence(SENT.anaMajidWaAntaBilal),
      introSentence(SENT.anaMuallimWaAntaTilmidh),
      introSentence(SENT.anaMuallimJadidWaAnta),
      introSentence(SENT.huwaMahmudWaAnaBashir),
      introSentence(SENT.mahmudTajirGhani),
      introSentence(SENT.huwaBilalWaHiyaZaynab),
      introSentence(SENT.bilalDhakiWaZaynab),
      introSentence(SENT.mahmudRajulGhani),
      fill(SENT.anaMuallimWaAntaTilmidh, 2, ['وَأَنَا', 'وَهُوَ']),
      fill(SENT.bilalDhakiWaZaynab, 5, ['ذَكِيٌّ']),
      build(SENT.huwaBilalWaHiyaZaynab, ['أَنْتَ', 'وَهُوَ']),
      meaningOf(SENT.mahmudTajirGhani, ['মাহমূদ গরীব কৃষক এবং আমি ধনী ব্যবসায়ী', 'মাহমূদ ধনী লোক এবং আমি গরীব ব্যবসায়ী'])
    ]
  ),

  stage(
    {
      id: 'l3-reading-3',
      titleBn: 'পড়ার অনুচ্ছেদ (২/২)',
      shortTitle: 'পড়া ৩',
      titleAr: 'الْقِرَاءَةُ (٣)',
      desc: 'هَلْ مَحْمُودٌ تَاجِرٌ؟ … سَعِيدٌ رَجُلٌ شَرِيفٌ جِدًّا',
      iconName: 'BookOpen',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৮'
    },
    [
      intro(W.jiddan, 'বাক্যের নতুন শব্দ'),
      intro(W.sharif, 'বাক্যের নতুন শব্দ'),
      introSentence(SENT.halMahmudTajir),
      introSentence(SENT.naamMahmudTajir),
      introSentence(SENT.halZaynabGhabiyya),
      introSentence(SENT.laBalHiyaDhakiyya),
      introSentence(SENT.antiImraaDhakiyya),
      introSentence(SENT.aishaImraaDhakiyya),
      introSentence(SENT.saidRajulSharif),
      introSentence(SENT.huwaGhaniJiddan),
      spot('তুমি খুব বুদ্ধিমান মহিলা', 'أَنْتِ امْرَأَةٌ ذَكِيَّةٌ جِدًّا', 'أَنْتَ امْرَأَةٌ ذَكِيَّةٌ جِدًّا', 'মহিলাকে সম্বোধনে কিতাবে أَنْتِ এসেছে।'),
      build(SENT.saidRajulSharif, ['امْرَأَةٌ', 'غَنِيٌّ']),
      meaningOf(SENT.huwaGhaniJiddan, ['সে খুব গরীব', 'তুমি খুব ধনী'])
    ]
  ),

  stage(
    {
      id: 'l3-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الِاخْتِبَارُ',
      desc: 'পুরো দারসের শব্দ, সর্বনাম ও প্রশ্নোত্তর যাচাই',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '২৫–২৮'
    },
    [
      quiz("'তুমি' অর্থে কিতাবে কোন শব্দ দুটি এসেছে?", ['أَنْتَ - أَنْتِ', 'هُوَ - هِيَ', 'أَنَا'], 'কিতাবের টেবিল: أَنْتَ - أَنْتِ = তুমি।'),
      quiz("'تِلْمِيذَةٌ' শব্দের অর্থ কী?", ['একজন ছাত্রী', 'একজন ছাত্র', 'একজন শিক্ষিকা'], 'কিতাব: تِلْمِيذَةٌ = একজন ছাত্রী।'),
      quiz('কোন নামটি মেয়ের নাম?', ['فَاطِمَةُ', 'خَالِدٌ', 'رَاشِدٌ'], 'কিতাব: মেয়ে-নামের শেষে তানবীন হয় না — فَاطِمَةُ।'),
      quiz("'হে মেয়ে!' এর আরবি কোনটি?", ['يَا بِنْتُ!', 'يَا وَلَدُ!', 'يَا زَيْنَبُ!'], 'কিতাব: بِنْتٌ - يَا بِنْتُ! = হে মেয়ে!'),
      quiz('هَلْ أَنْتَ مُعَلِّمٌ؟ — ছাত্র হলে উত্তর কী?', ['لَا .. بَلْ أَنَا تِلْمِيذٌ', 'نَعَمْ .. أَنَا مُعَلِّمٌ', 'لَا .. بَلْ أَنْتَ تِلْمِيذٌ'], 'কিতাব: لَا .. بَلْ أَنَا تِلْمِيذٌ = না, বরং আমি ছাত্র।'),
      quiz("'بَلْ' শব্দের অর্থ কী?", ['বরং', 'এবং', 'কে?'], 'কিতাব: بَلْ = বরং।'),
      quiz("'غَبِيٌّ' শব্দের অর্থ কী?", ['মেধাহীন, নির্বোধ', 'মেধাবী, বুদ্ধিমান', 'গরীব, দরিদ্র'], 'কিতাব: غَبِيٌّ = মেধাহীন, নির্বোধ।'),
      quiz('খাদীজা সম্পর্কে কোন বাক্যটি শুদ্ধ?', ['خَدِيجَةُ بِنْتٌ مُؤَدَّبَةٌ', 'خَدِيجَةُ بِنْتٌ مُؤَدَّبٌ', 'خَدِيجَةُ وَلَدٌ مُؤَدَّبٌ'], 'কিতাব: خَدِيجَةُ بِنْتٌ مُؤَدَّبَةٌ।'),
      quiz('هِيَ امْرَأَةٌ — এখানে امْرَأَةٌ এর আলিফ কি উচ্চারণ হয়?', ['না, শুধু লেখায় আসে', 'হাঁ, উচ্চারণ হয়'], 'কিতাব: اِمْرَأَةٌ শব্দের আগে অন্য শব্দ হলে ا টি শুধু লেখায় আসে, উচ্চারণে আসে না।'),
      quiz("'سَعِيدٌ رَجُلٌ شَرِيفٌ جِدًّا' বাক্যের অর্থ কী?", ['সাঈদ খুব সম্ভ্রান্ত লোক', 'সাঈদ খুব ধনী লোক', 'সাঈদ ভদ্র ছেলে'], 'جِدًّا = খুব, شَرِيفٌ = সম্ভ্রান্ত।')
    ]
  )
];

// ---------- অতিরিক্ত চর্চার পর্ব (শেখা বাক্য ও শব্দ দিয়েই) ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

const personItem = (arabic, bangla, g) => ({ arabic, bangla, reveal: `${g === 'm' ? 'هُوَ' : 'هِيَ'} ${arabic}`, group: g });
const heShe = (title, items) => ({
  type: 'sort_groups',
  title,
  groups: [{ id: 'm', arabic: 'هُوَ' }, { id: 'f', arabic: 'هِيَ' }],
  items
});

insertAfter('l3-reading-names', stage(
  {
    id: 'l3-practice-1',
    titleBn: 'চর্চা: ছেলে না মেয়ে?',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'هُوَ / هِيَ, পুরুষবাচক ও স্ত্রীবাচক শব্দ দিয়ে মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '২৫–২৬'
  },
  [
    heShe('শব্দটি هُوَ না هِيَ-এর সাথে বসবে?', [
      personItem('مُعَلِّمٌ', 'একজন শিক্ষক', 'm'),
      personItem('مُعَلِّمَةٌ', 'একজন শিক্ষিকা', 'f'),
      personItem('وَلَدٌ', 'একটি ছেলে', 'm'),
      personItem('بِنْتٌ', 'একটি মেয়ে', 'f'),
      personItem('طِفْلَةٌ', 'একটি শিশু (মেয়ে)', 'f'),
      personItem('تِلْمِيذٌ', 'একজন ছাত্র', 'm')
    ]),
    fill(SENT.khalidWaladMuaddab, 2, ['مُؤَدَّبَةٌ']),
    fill(SENT.zaynabBintSaghira, 1, ['وَلَدٌ']),
    fill(SENT.hiyaAisha, 0, ['هُوَ', 'أَنَا']),
    meaningOf(SENT.mahmudTiflJamil, ['মাহমূদ ভদ্র ছেলে', 'ফাতেমা সুন্দর শিশু']),
    arabicOf(SENT.khadijaBintMuaddaba, ['خَدِيجَةُ بِنْتٌ مُؤَدَّبٌ', 'خَدِيجَةُ وَلَدٌ مُؤَدَّبٌ']),
    build(SENT.bilalTilmidhJadid, ['تِلْمِيذَةٌ', 'جَدِيدَةٌ']),
    build(SENT.anaTilmidhaJadida, ['هُوَ', 'جَدِيدٌ']),
    spot('সে নতুন ছাত্র', 'هُوَ تِلْمِيذٌ جَدِيدٌ', 'هِيَ تِلْمِيذٌ جَدِيدٌ', 'ছেলের জন্য কিতাবে هُوَ এসেছে।'),
    heShe('নামটি ছেলের না মেয়ের? هُوَ না هِيَ?', ['rashid', 'zaynab', 'bilal', 'farhana', 'majid', 'khadija'].map(nameSortItem)),
    match([SENT.anaBilal, SENT.hiyaAisha, SENT.huwaBilal, SENT.anaAisha], 'বাক্য ও অর্থ মেলান'),
    meaningOf(SENT.farhanaMuallimaJadida, ['ফারহানা নতুন ছাত্রী', 'ফারহানা ভালো শিক্ষিকা'])
  ]
));

insertAfter('l3-qa-2', stage(
  {
    id: 'l3-practice-2',
    titleBn: 'চর্চা: প্রশ্ন ও উত্তর',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'هَلْ, مَنْ, يَا, بَلْ — প্রশ্নোত্তর দিয়ে মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '২৬–২৮'
  },
  [
    fill(QA[1].q, 0, ['مَنْ']),
    fill(QA[6].q, 0, ['هَلْ']),
    fill(SENT.laBalAnaTilmidh, 2, ['وَ', 'نَعَمْ']),
    fill(SENT.yaBint, 1, ['وَلَدُ!']),
    dialogue({ q: SENT.halMahmudTajir, a: T('نَعَمْ .. هُوَ تَاجِرٌ', 'হাঁ, সে ব্যবসায়ী'), wrong: ['نَعَمْ .. هِيَ تَاجِرٌ', 'لَا .. هُوَ تَاجِرٌ'] }),
    arabicOf(QA[6].a, ['هِيَ رَاشِدٌ', 'أَنَا رَاشِدٌ']),
    meaningOf(QA[9].q, ['তুমি কে?', 'সে কে?'], 'প্রশ্নটির অর্থ কী?'),
    build(QA[2].q, ['مَنْ', 'أَنَا']),
    build(QA[3].a, ['هِيَ', 'أَنْتِ']),
    match([W.hal, W.man, W.bal, W.naam]),
    spot('হে ছেলে, তুমি কে?', 'مَنْ أَنْتَ يَا وَلَدُ؟', 'مَنْ أَنْتِ يَا وَلَدُ؟', 'ছেলেকে সম্বোধনে কিতাবে أَنْتَ এসেছে।'),
    meaningOf(QA[12].a, ['না, বরং সে বড় মেয়ে', 'হাঁ, সে ছোট মেয়ে'], 'উত্তরটির অর্থ কী?')
  ]
));

insertAfter('l3-reading-3', stage(
  {
    id: 'l3-practice-3',
    titleBn: 'চর্চা: ধনী-গরীব, মেধাবী',
    shortTitle: 'চর্চা ৩',
    titleAr: 'التَّدْرِيبُ (٣)',
    desc: 'কিতাবের ২৭–২৮ পৃষ্ঠার শব্দ ও বাক্য দিয়ে মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '২৭–২৮'
  },
  [
    match([W.tajir, W.fallah, W.ghani, W.faqir]),
    match([W.dhaki, W.ghabi, W.rajul, W.imraa]),
    fill(SENT.mahmudRajulGhani, 5, ['فَقِيرٌ']),
    fill(SENT.laBalHiyaDhakiyya, 3, ['هُوَ', 'أَنْتَ']),
    meaningOf(SENT.aishaImraaDhakiyya, ['আয়েশা খুব গরীব মহিলা', 'আয়েশা খুব মেধাবী ছাত্রী']),
    arabicOf(SENT.huwaMahmudWaAnaBashir, ['أَنَا مَحْمُودٌ وَهُوَ بَشِيرٌ', 'هُوَ مَحْمُودٌ وَأَنْتَ بَشِيرٌ']),
    build(SENT.anaMajidWaAntaBilal, ['وَهُوَ', 'أَنْتِ']),
    build(SENT.halMahmudTajir, ['مَنْ', 'فَلَّاحٌ']),
    spot('যায়নাব মেধাবী ছাত্রী', 'زَيْنَبُ تِلْمِيذَةٌ ذَكِيَّةٌ', 'زَيْنَبُ تِلْمِيذَةٌ ذَكِيٌّ', 'تِلْمِيذَةٌ স্ত্রীবাচক, তাই কিতাবে ذَكِيَّةٌ এসেছে।'),
    arabicOf({ arabic: 'فَقِيرٌ', bangla: 'গরীব, দরিদ্র' }, ['غَنِيٌّ', 'غَبِيٌّ']),
    fill(SENT.saidRajulSharif, 3, ['جَدِيدٌ']),
    meaningOf(SENT.halZaynabGhabiyya, ['যায়নাব কি মেধাবী ছাত্রী?', 'যায়নাব কি গরীব মহিলা?'], 'প্রশ্নটির অর্থ কী?')
  ]
));

// ---------- পাঠের অন্যান্য ফিল্ড (ফ্ল্যাশকার্ড, তামরীন মোড, অ্যাডমিন) ----------

const vocabulary = Object.values(W).map(({ arabic, bangla }) => ({ arabic, bangla }));

const sentences = Object.values(SENT).map(({ arabic, bangla, page }) => ({ arabic, bangla, page }));

const dialogues = QA.map(({ q, a }) => ({
  speaker: 'কিতাবের প্রশ্নোত্তর',
  questionArabic: q.arabic,
  questionBangla: q.bangla,
  answerArabic: a.arabic,
  answerBangla: a.bangla,
  arabic: `${q.arabic} — ${a.arabic}`,
  bangla: `${q.bangla} — ${a.bangla}`,
  page: '২৬–২৭'
}));

// কিতাবে এই দারসে আলাদা তামরীন নেই; প্রশ্নোত্তরগুলোই তামরীন মোডে চর্চার জন্য
const tamrinKitabi = QA.map(({ q, a }) => ({
  task: 'প্রশ্নোত্তর পড়ো ও অর্থ বলো',
  mode: 'ar-to-bn',
  arabic: `${q.arabic} — ${a.arabic}`,
  bangla: `${q.bangla} — ${a.bangla}`,
  page: '২৬–২৭'
}));

const quizLegacy = bookStages
  .find(s => s.id === 'l3-quiz')
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

// ক্বায়েদা (খসড়া — উস্তাদের যাচাই বাকি)
const qaida = [
  {
    id: 'l3-q-damir',
    stageId: 'l3-pronouns',
    title: 'সর্বনাম (যমীর): আমি, তুমি, সে',
    table: [
      { arabic: 'أَنَا', bangla: 'আমি (ছেলে-মেয়ে দুজনের জন্য)' },
      { arabic: 'أَنْتَ / أَنْتِ', bangla: 'তুমি (ছেলে / মেয়ে)' },
      { arabic: 'هُوَ / هِيَ', bangla: 'সে (ছেলে / মেয়ে)' }
    ],
    rule: 'أَنَا ছেলে-মেয়ে সবার জন্য একই। কিন্তু "তুমি" ও "সে" বলতে ছেলের জন্য أَنْتَ ও هُوَ, মেয়ের জন্য أَنْتِ ও هِيَ।',
    examples: [
      { arabic: 'أَنَا تِلْمِيذٌ', bangla: 'আমি ছাত্র' },
      { arabic: 'هُوَ بِلَالٌ', bangla: 'সে বেলাল' },
      { arabic: 'هِيَ عَائِشَةُ', bangla: 'সে আয়েশা' }
    ]
  },
  {
    id: 'l3-q-hal-man',
    stageId: 'l3-ya-hal',
    title: 'هَلْ ও مَنْ দিয়ে প্রশ্ন',
    table: [
      { arabic: 'هَلْ', bangla: 'কি? — উত্তর نَعَمْ / لَا' },
      { arabic: 'مَنْ', bangla: 'কে? — উত্তরে নাম বা পরিচয়' }
    ],
    rule: 'হাঁ/না উত্তরের প্রশ্ন هَلْ দিয়ে শুরু হয়। "না" বলে সঠিক কথা জানাতে لَا-এর পরে بَلْ (বরং) আসে। মানুষ সম্পর্কে জানতে مَنْ দিয়ে প্রশ্ন করা হয়।',
    examples: [
      { arabic: 'هَلْ أَنْتَ مُعَلِّمٌ؟ — لَا .. بَلْ أَنَا تِلْمِيذٌ', bangla: 'তুমি কি শিক্ষক? — না, বরং আমি ছাত্র' },
      { arabic: 'مَنْ أَنْتَ يَا وَلَدُ؟ — أَنَا بِلَالٌ', bangla: 'হে ছেলে, তুমি কে? — আমি বেলাল' }
    ]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l3',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ২৫-২৮',
    qaida,
    grammarRule: {
      title: 'কিতাবের টেবিল: সর্বনাম',
      summary: 'أَنَا = আমি। أَنْتَ - أَنْتِ = তুমি। هُوَ - هِيَ = সে। পুরুষ-নামের শেষে সাধারণত তানবীন হয়, কিন্তু মেয়ে-নামের শেষে তানবীন হয় না।',
      points: [
        'أَنَا تِلْمِيذٌ = আমি (একজন) ছাত্র',
        'يَا وَلَدُ! = হে ছেলে!',
        'هَلْ أَنْتَ مُعَلِّمٌ؟ لَا .. بَلْ أَنَا تِلْمِيذٌ = তুমি কি শিক্ষক? না, বরং আমি ছাত্র।'
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
