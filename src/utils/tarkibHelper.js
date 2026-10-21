// Comprehensive Arabic Grammar & Tarkib (তারকীব) Engine
// Based on "এসো আরবী শিখি" and "আত-তামরীনুল কিতাবী" syntax rules
// By Maulana Abu Taher Mesbah (দা.বা.)

// Strip Harakat & diacritics
export function stripHarakat(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي');
}

export const HARF_JAR_STRIPPED = ['في', 'علي', 'الي', 'من', 'عن', 'حتي', 'منذ', 'رب'];

export const ISM_ISHARAH_STRIPPED = {
  'هذا': { type: 'ইসমুল ইশারা (পুংলিঙ্গ / নিকটবর্তী)', role: 'মুবতাদা (مُبْتَدَأٌ)', meaning: 'ইহা / এটি' },
  'هذه': { type: 'ইসমুল ইশারা (স্ত্রীলিঙ্গ / নিকটবর্তী)', role: 'মুবতাদা (مُبْتَدَأٌ)', meaning: 'ইহা / এটি' },
  'ذلك': { type: 'ইসমুল ইশারা (পুংলিঙ্গ / দূরবর্তী)', role: 'মুবতাদা (مُبْتَدَأٌ)', meaning: 'উহা / ওটি' },
  'تلك': { type: 'ইসমুল ইশারা (স্ত্রীলিঙ্গ / দূরবর্তী)', role: 'মুবতাদা (مُبْتَدَأٌ)', meaning: 'উহা / ওটি' },
  'هولاء': { type: 'ইসমুল ইশারা (বহুবচন / নিকটবর্তী)', role: 'মুবতাদা (مُبْتَدَأٌ)', meaning: 'এরা সকলে' },
  'اولئك': { type: 'ইসমুল ইশারা (বহুবচন / দূরবর্তী)', role: 'মুবতাদা (مُبْتَدَأٌ)', meaning: 'ওরা সকলে' },
  'هنا': { type: 'ইসমুল ইশারা (স্থান / নিকটবর্তী)', role: 'যরফে মাকান (শুবহু জুমলা খবর)', meaning: 'এখানে' },
  'هناك': { type: 'ইসমুল ইশারা (স্থান / দূরবর্তী)', role: 'যরফে মাকান (শুবহু জুমলা খবর)', meaning: 'সেখানে' }
};

export const PRONOUN_STRIPPED = {
  'انا': { type: 'যমীরে মুনফাসিল (উত্তম পুরুষ)', role: 'মুবতাদা', meaning: 'আমি' },
  'انت': { type: 'যমীরে মুনফাসিল (মধ্যম পুরুষ)', role: 'মুবতাদা', meaning: 'তুমি' },
  'هو': { type: 'যমীরে মুনফাসিল (নাম পুরুষ মুযাক্কার)', role: 'মুবতাদা', meaning: 'সে (পুরুষ)' },
  'هي': { type: 'যমীরে মুনফাসিল (নাম পুরুষ মুয়ান্নাস)', role: 'মুবতাদা', meaning: 'সে (মহিলা)' },
  'نحن': { type: 'যমীরে মুনফাসিল (বহুবচন)', role: 'মুবতাদা', meaning: 'আমরা' },
  'انتم': { type: 'যমীরে মুনফাসিল (মধ্যম পুরুষ বহুবচন)', role: 'মুবতাদা', meaning: 'তোমরা' },
  'هم': { type: 'যমীরে মুনফাসিল (নাম পুরুষ বহুবচন)', role: 'মুবতাদা', meaning: 'তারা' }
};

export const VERBS_PAST_STRIPPED = [
  'ذهب', 'خرج', 'دخل', 'قرا', 'كتب', 'جلس', 'رجع', 'سمع', 'علم', 'فهم',
  'شرب', 'اكل', 'نظر', 'وجد', 'قال', 'كان', 'جاء', 'سال', 'امر', 'ضرب',
  'فتح', 'نصر', 'حمد', 'شكر', 'صلي', 'قام', 'نام', 'سافر', 'تعلم', 'ولد',
  'ذهبت', 'خرجت', 'دخلت', 'قرات', 'كتبت', 'جلست', 'رجعت', 'سمعت', 'قالت', 'كانت'
];

export const VERBS_PRESENT_STRIPPED = [
  'يذهب', 'يخرج', 'يدخل', 'يقرا', 'يكتب', 'يجلس', 'يرجع', 'يسمع', 'يعلم', 'يفهم',
  'يشرب', 'ياكل', 'ينظر', 'يجد', 'يقول', 'يكون', 'يجيء', 'يسال', 'يامر', 'يضرب',
  'يفتح', 'ينصر', 'يحمد', 'يشكر', 'يصلي', 'يقوم', 'ينام', 'يسافر', 'يتعلم',
  'تذهب', 'تخرج', 'تدخل', 'تقرا', 'تكتب', 'تجلس', 'اذهب', 'اقرا', 'اكتب', 'نذهب'
];

export const VERBS_IMPERATIVE_STRIPPED = [
  'اقرا', 'اكتب', 'اذهب', 'ادخل', 'اخرج', 'اجلس', 'اسمع', 'تعال', 'قل',
  'اقرئي', 'اكتبي', 'اذهبي', 'ادخلي', 'اخرجي', 'اجلسي'
];

export const KNOWN_ADJECTIVES_STRIPPED = [
  'جديد', 'جديدة', 'قديم', 'قديمة', 'صغير', 'صغيرة', 'كبير', 'كبيرة',
  'جميل', 'جميلة', 'نظيف', 'نظيفة', 'طويل', 'طويلة', 'قصير', 'قصيرة',
  'مفتوح', 'مفتوحة', 'مغلق', 'مغلقة', 'مكسور', 'مكسورة', 'طيب', 'طيبة',
  'ماهر', 'ماهرة', 'واسع', 'واسعة', 'ضيق', 'ضيقة', 'سريع', 'سريعة',
  'بطيء', 'بطيئة', 'لذيذ', 'لذيذة', 'مفيد', 'مفيدة', 'صالح', 'صالحة',
  'نشيط', 'نشيطة', 'كسلان', 'كسلي', 'عطشان', 'جوعان', 'مجتهد', 'مجتهدة'
];

export const SAMAI_FEMININES_STRIPPED = [
  'يد', 'عين', 'رجل', 'اذن', 'ام', 'بنت', 'اخت',
  'شمس', 'ارض', 'نفس', 'نار', 'دار', 'سماء', 'حرب'
];

// Check if a word is a verb
export function isVerb(cleanWord) {
  const s = stripHarakat(cleanWord);
  if (VERBS_PAST_STRIPPED.includes(s)) return { type: "ফে'লে মাদী (أَلْفِعْلُ الْمَاضِي)", isPast: true };
  if (VERBS_PRESENT_STRIPPED.includes(s)) return { type: "ফে'লে মুদারে (أَلْفِعْلُ الْمُضَارِعُ)", isPresent: true };
  if (VERBS_IMPERATIVE_STRIPPED.includes(s)) return { type: "ফে'লে আমর (فِعْلُ الْأَمْرِ)", isImperative: true };
  return null;
}

// Check for attached Harf Jar prefix (بِـ, لِـ, كَـ)
export function getAttachedHarfJar(word) {
  const clean = word.replace(/[()[\]{}.,،؟!]/g, '').trim();
  if (/^بِ[ء-ي]/.test(clean)) {
    return { prefix: 'بِـ', name: 'হরফে জর (বা)', remainder: clean.slice(1) };
  }
  if (/^لِ[ء-ي]/.test(clean)) {
    return { prefix: 'لِـ', name: 'হরফে জর (লাম)', remainder: clean.slice(1) };
  }
  if (/^كَ[ء-ي]/.test(clean)) {
    return { prefix: 'كَـ', name: 'হরফে জর (কাফ)', remainder: clean.slice(1) };
  }
  return null;
}

// Check for attached pronoun suffix
export function getAttachedPronoun(word) {
  const clean = word.replace(/[()[\]{}.,،؟!]/g, '').trim();
  const s = stripHarakat(clean);
  const pronouns = [
    { suffix: 'هُ', strippedSuffix: 'ه', meaning: 'তার (মুযাক্কার)' },
    { suffix: 'هَا', strippedSuffix: 'ها', meaning: 'তার (মুয়ান্নাস)' },
    { suffix: 'كَ', strippedSuffix: 'ك', meaning: 'তোমার (মুযাক্কার)' },
    { suffix: 'كِ', strippedSuffix: 'ك', meaning: 'তোমার (মুয়ান্নাস)' },
    { suffix: 'ي', strippedSuffix: 'ي', meaning: 'আমার' },
    { suffix: 'نَا', strippedSuffix: 'না', meaning: 'আমাদের' },
    { suffix: 'كُمْ', strippedSuffix: 'كم', meaning: 'তোমাদের' },
    { suffix: 'هُمْ', strippedSuffix: 'هم', meaning: 'তাদের' }
  ];

  for (const p of pronouns) {
    if (s.length > 3 && s.endsWith(p.strippedSuffix)) {
      return p;
    }
  }
  return null;
}

// Analyze each word in a sentence for Tarkib
export function analyzeSentenceTarkib(arabicSentence) {
  if (!arabicSentence) return { words: [], structure: '', nuance: '' };

  const rawWords = arabicSentence.trim().split(/\s+/);
  const cleanWords = rawWords.map(w => w.replace(/[()[\]{}.,،؟!]/g, '').trim());
  const strippedWords = cleanWords.map(w => stripHarakat(w));

  const firstWordVerb = isVerb(cleanWords[0]);
  const isVerbalSentence = !!firstWordVerb;

  const words = rawWords.map((rawWord, idx) => {
    const clean = cleanWords[idx];
    const s = strippedWords[idx];

    let role = 'ইসিম (বিশেষ্য)';
    let caseExplanation = 'মারফূ‘ (পেশযুক্ত)';
    let isFeminine = /[ةَة]/.test(clean) || SAMAI_FEMININES_STRIPPED.includes(s);

    const attachedJar = getAttachedHarfJar(rawWord);
    const verbInfo = isVerb(clean);
    const attachedPronoun = getAttachedPronoun(clean);

    // 1. Standalone Harf Jar
    if (HARF_JAR_STRIPPED.includes(s)) {
      role = 'হরফে জর (حَرْفُ جَرٍّ)';
      caseExplanation = 'পরবর্তী শব্দকে যের (কাসরা) দেয়';
    }
    // 2. Word directly following Standalone Harf Jar
    else if (idx > 0 && HARF_JAR_STRIPPED.includes(strippedWords[idx - 1])) {
      role = 'মাজরুর (مَجْرُورٌ)';
      caseExplanation = 'পূর্ববর্তী হরফে জরের কারণে শব্দটির শেষ অক্ষরে যের (কাসরা) হয়েছে';
    }
    // 3. Attached Harf Jar
    else if (attachedJar && !isVerb(clean)) {
      role = attachedJar.name + ' + মাজরুর';
      caseExplanation = attachedJar.prefix + ' হরফে জর যুক্ত হয়ে পদটিকে মাজরুর (যেরযুক্ত) করেছে';
    }
    // 4. Ism Isharah
    else if (ISM_ISHARAH_STRIPPED[s]) {
      const match = ISM_ISHARAH_STRIPPED[s];
      role = match.role;
      caseExplanation = match.type + ' - মাবনী (অপরিবর্তনীয়), মুবতাদার স্থানে মারফূ‘';
    }
    // 5. Personal Pronoun
    else if (PRONOUN_STRIPPED[s]) {
      const match = PRONOUN_STRIPPED[s];
      role = 'মুবতাদা (مُبْتَدَأٌ)';
      caseExplanation = match.type + ' - যমীরে মারফূ‘ মুনফাসিল';
    }
    // 6. Interrogative (Harf Istifham)
    else if (['ما', 'من', 'ا', 'هل', 'اين', 'كيف', 'متي', 'كم', 'ماذا', 'لماذا'].includes(s)) {
      role = 'হরফে ইস্তিফহাম (প্রশ্নবোধক অব্যয়)';
      caseExplanation = 'জিজ্ঞাসার জন্য ব্যবহৃত অব্যয়';
    }
    // 7. Conjunction (Harf Atf)
    else if (['و', 'ف', 'ثم', 'او', 'ام'].includes(s) || clean === 'وَ') {
      role = 'হরফে আতফ (সংযোজক অব্যয়)';
      caseExplanation = 'পূর্ববর্তী পদের সাথে পরবর্তী পদের সমন্বয় ঘটায়';
    }
    // 8. Vocative (Harf Nida)
    else if (['يا', 'ايها', 'ايتها'].includes(s)) {
      role = 'হরফে নিদা (আহ্বানসূচক অব্যয়)';
      caseExplanation = 'পরবর্তী পদটি মুনাদা (আহ্বানকৃত ব্যক্তি)';
    }
    else if (idx > 0 && ['يا', 'ايها', 'ايتها'].includes(strippedWords[idx - 1])) {
      role = 'মুনাদা (مُنَادَى)';
      caseExplanation = 'আহ্বানকৃত বিশেষ্য, যা এক পেশযুক্ত (মাবনী আলাদ-দাম)';
    }
    // 9. VERB (ফে'ল)
    else if (verbInfo) {
      role = verbInfo.type;
      caseExplanation = verbInfo.isPast 
        ? "ফে'লে মাদী - সর্বদাই মাবনী (অপরিবর্তনীয়)"
        : (verbInfo.isPresent ? "ফে'লে মুদারে - মারফূ‘ (পেশযুক্ত)" : "ফে'লে আমর - নির্দেশসূচক ক্রিয়া");
    }
    // 10. Verbal sentence: FA'IL (Subject) or MAF'UL (Object)
    else if (isVerbalSentence && idx === 1) {
      role = "ফা'য়েল (فَاعِلٌ / কর্তা)";
      caseExplanation = 'ক্রিয়ার কার্য সম্পাদনকারী, যা সর্বদা মারফূ‘ (পেশযুক্ত)';
    }
    else if (isVerbalSentence && idx > 1 && !HARF_JAR_STRIPPED.includes(s) && !HARF_JAR_STRIPPED.includes(strippedWords[idx - 1])) {
      if (/[ـًً]/.test(clean) || clean.endsWith('َ') || /[َ]/.test(clean.slice(-2))) {
        role = "মাফ'ঊলে বিহী (مَفْعُولٌ بِهِ / কর্ম)";
        caseExplanation = 'ক্রিয়ার লক্ষ্যবস্তু, যা সর্বদা মানসূব (যবরযুক্ত)';
      } else {
        role = 'মুতাআল্লাক / পরিপূরক পদ';
        caseExplanation = 'ক্রিয়া ও কর্তার সাথে সম্পর্কযুক্ত পদ';
      }
    }
    // 11. Muzaaf + Muzaaf Ilayhi (মুরাক্কাবে ইদাফী)
    else if (
      idx < rawWords.length - 1 &&
      !clean.startsWith('ال') &&
      !HARF_JAR_STRIPPED.includes(s) &&
      !ISM_ISHARAH_STRIPPED[s] &&
      !PRONOUN_STRIPPED[s] &&
      !/[ـٌـٍـًًٌٍ]/.test(clean) &&
      (rawWords[idx + 1].includes('ِ') || rawWords[idx + 1].includes('ٍ') || rawWords[idx + 1].startsWith('ال') || getAttachedPronoun(cleanWords[idx + 1]))
    ) {
      role = 'মুদাফ (مُضَافٌ)';
      caseExplanation = 'সম্বন্ধপদ; এটি কখনো আলিফ-লাম (ال) বা তানভীন গ্রহণ করে না';
    }
    else if (
      idx > 0 &&
      !cleanWords[idx - 1].startsWith('ال') &&
      !HARF_JAR_STRIPPED.includes(strippedWords[idx - 1]) &&
      !ISM_ISHARAH_STRIPPED[strippedWords[idx - 1]] &&
      !PRONOUN_STRIPPED[strippedWords[idx - 1]] &&
      !/[ـٌـٍـًًٌٍ]/.test(cleanWords[idx - 1])
    ) {
      role = 'মুদাফ ইলাইহি (مُضَافٌ إِلَيْهِ)';
      caseExplanation = 'যার প্রতি সম্বন্ধ করা হয়েছে; এটি সর্বদা মাজরুর (যেরযুক্ত)';
    }
    // 12. Badal / Musharun Ilayh: Ism Isharah followed by Alif-Lam noun
    else if (idx === 1 && ISM_ISHARAH_STRIPPED[strippedWords[0]] && clean.startsWith('ال')) {
      role = 'মুশারুন ইলাইহি / বদল (مُشَارٌ إِلَيْهِ)';
      caseExplanation = 'ইসমুল ইশারার পর "ال" যুক্ত থাকায় এটি পূর্ণ বাক্য নয়, বরং মুরাক্কাবে ইশারী (অপূর্ণ বাক্যাংশ)';
    }
    // 13. Delayed Subject (Mubtada Mu'akhkhar after Jar-Majroor)
    else if (idx >= 2 && HARF_JAR_STRIPPED.includes(strippedWords[0]) && /[ـٌ\u064C]/.test(clean)) {
      role = 'মুবতাদা মুআখখার (مُبْتَدَأٌ مُؤَخَّرٌ)';
      caseExplanation = 'বিলম্বিত উদ্দেশ্য; জার-মাজরুর আগে এসে খবর মুকাদ্দাম হওয়ায় এটি পরে বসেছে (মারফূ‘)';
    }
    // 14. Check Khabar after Idafat (Muzaaf + Muzaaf Ilayhi)
    else if (
      idx >= 2 &&
      !clean.startsWith('ال') &&
      /[ـٌ\u064C]/.test(clean) &&
      !HARF_JAR_STRIPPED.includes(strippedWords[idx - 1]) &&
      !HARF_JAR_STRIPPED.includes(strippedWords[0]) &&
      !cleanWords[idx - 2].startsWith('ال')
    ) {
      role = 'খবর (خَبَرٌ)';
      caseExplanation = 'মুদাফ ও মুদাফ ইলাইহি মিলে গঠিত মুবতাদার খবর; এটি মারফূ‘ (দুই পেশযুক্ত)';
    }
    // 15. Check Khabar after Ism Isharah or Pronoun
    else if (idx === 1 && (ISM_ISHARAH_STRIPPED[strippedWords[0]] || PRONOUN_STRIPPED[strippedWords[0]]) && !clean.startsWith('ال')) {
      role = 'খবর (خَبَرٌ)';
      caseExplanation = 'মুবতাদার বিবরণ দানকারী পদ, যা মারফূ‘ (দুই পেশযুক্ত)';
    }
    // 15. Sifah (Adjective)
    else if (
      KNOWN_ADJECTIVES_STRIPPED.includes(s) ||
      (idx > 0 && !HARF_JAR_STRIPPED.includes(strippedWords[idx - 1]) &&
       (clean.startsWith('ال') === cleanWords[idx - 1].startsWith('ال')) &&
       /[ةَة]/.test(clean) === (/[ةَة]/.test(cleanWords[idx - 1]) || SAMAI_FEMININES_STRIPPED.includes(strippedWords[idx - 1])))
    ) {
      role = 'সিফাত (صِفَةٌ / বিশেষণ)';
      caseExplanation = 'পূর্ববর্তী মাওসূফের গুণ বর্ণনা করে এবং মাওসূফের এরাব ও লিঙ্গ অনুসরণ করে';
    }
    // 15. Delayed Subject (Mubtada Mu'akhkhar after Jar-Majroor)
    else if (idx === 2 && HARF_JAR_STRIPPED.includes(strippedWords[0])) {
      role = 'মুবতাদা মুআখখার (مُبْتَدَأٌ مُؤَخَّرٌ)';
      caseExplanation = 'বিলম্বিত উদ্দেশ্য; জার-মাজরুর আগে এসে খবর মুকাদ্দাম হওয়ায় এটি পরে বসেছে (মারফূ‘)';
    }
    // 16. Default Fallback
    else {
      role = idx === 0 ? 'মুবতাদা / বাক্য সূচনা' : 'খবর / পরিপূরক পদ';
      caseExplanation = 'বাক্যের মৌলিক পদ, যা মারফূ‘ (পেশযুক্ত)';
    }

    if (attachedPronoun && !role.includes('মুদাফ ইলাইহি') && !PRONOUN_STRIPPED[s]) {
      caseExplanation += " (সাথে সংযুক্ত সর্বনাম '" + attachedPronoun.suffix + "' মুদাফ ইলাইহি হিসেবে যুক্ত)";
    }

    return {
      word: rawWord,
      clean,
      role,
      caseExplanation,
      isFeminine
    };
  });

  // Overall sentence structure
  let structure = 'জুমলা ইসমিয়্যা (جُمْلَةٌ إِسْمِيَّةٌ) [নামবাচক বাক্য]';
  let nuance = '';

  const firstS = strippedWords[0];

  if (firstWordVerb) {
    structure = "জুমলা ফি'লিয়্যা (جُمْلَةٌ فِعْلِيَّةٌ) [ক্রিয়াবাচক বাক্য]";
    nuance = "নিয়ম: বাক্যটি ক্রিয়া (فِعْلٌ) দিয়ে শুরু হয়েছে। গঠন: [ফে'ল + ফা'য়েল (কর্তা) + মাফ'ঊল (কর্ম) / মুতাআল্লাক] = জুমলা ফি'লিয়্যা।";
  } else if (ISM_ISHARAH_STRIPPED[firstS] && cleanWords[1]?.startsWith('ال')) {
    structure = 'মুরাক্কাবে ইশারী (مُرَكَّبٌ إِشَارِيٌّ) [অপূর্ণ ইঙ্গিতবাচক বাক্যাংশ]';
    nuance = 'নিয়ম: ইসমুল ইশারার পর "ال" যুক্ত ইসিম আসলে তা খবর হয় না, বরং মুশারুন ইলাইহি (বদল) হয়ে একটি অপূর্ণ বাক্যাংশ গঠন করে।';
  } else if (ISM_ISHARAH_STRIPPED[firstS]) {
    structure = 'ইসমুল ইশারা ও খবর: [মুবতাদা + খবর = জুমলা ইসমিয়্যা]';
    nuance = 'নিয়ম: ইসমুল ইশারা (هٰذَا / هٰذِهِ) মুবতাদা হিসেবে বসে এবং পরবর্তী পদটি তানভীনযুক্ত নাকেরা খবর হিসেবে দুই পেশ গ্রহণ করে পূর্ণ বাক্য গঠন করে।';
  } else if (HARF_JAR_STRIPPED.includes(firstS)) {
    structure = 'মুরাক্কাবে জাররী সম্বলিত বাক্য: [শুবহু জুমলা খবর মুকাদ্দাম + মুবতাদা মুআখখার]';
    nuance = 'নিয়ম: হরফে জর শুরুতে এসে খবর মুকাদ্দাম গঠিত হয়েছে এবং অনির্দিষ্ট বিশেষ্যটি পরে বসে মুবতাদা মুআখখার হয়েছে।';
  } else if (words.some(w => w.role.includes('মুদাফ'))) {
    structure = 'মুরাক্কাবে ইদাফী সম্বলিত বাক্য: [মুদাফ + মুদাফ ইলাইহি]';
    nuance = 'নিয়ম: মুদাফ কখনো তানভীন বা "ال" গ্রহণ করে না এবং মুদাফ ইলাইহি সর্বদা মাজরুর (যেরযুক্ত) হয়।';
  } else if (arabicSentence.includes('جَدِيد') || arabicSentence.includes('صَغِير') || arabicSentence.includes('كَبِير') || arabicSentence.includes('جَمِيل')) {
    structure = 'মুরাক্কাবে তাওসীফী সম্বলিত বাক্য: [মাওসূফ (বিশেষ্য) + সিফাত (বিশেষণ)]';
    nuance = 'নিয়ম: আরবিতে সিফাত সর্বদা মাওসূফের পরে বসে এবং মাওসূফ স্ত্রীলিঙ্গ হলে সিফাতও স্ত্রীলিঙ্গ হয়।';
  }

  return { words, structure, nuance };
}

// Generate subtle grammar notes & explanations
export function getSubtleNuances(word, lessonContext) {
  const notes = [];
  const clean = (word || '').replace(/[()[\]{}.,،؟!]/g, '').trim();
  const s = stripHarakat(clean);

  // Feminine Rule
  if (/[ةَة]/.test(word) || SAMAI_FEMININES_STRIPPED.includes(s)) {
    const isSamai = SAMAI_FEMININES_STRIPPED.includes(s);
    notes.push({
      title: "স্ত্রীলিঙ্গ (মুয়ান্নাস) চেনার নিয়ম",
      rule: isSamai 
        ? '"' + clean + '" শব্দটি আরবে স্বাভাবিকভাবে স্ত্রীলিঙ্গ (মুয়ান্নাসে সামাঈ) হিসেবে গণ্য। তাই নির্দেশ করতে \'هٰذِهِ\' বা \'تِلْكَ\' ব্যবহৃত হয়।'
        : "শব্দের শেষে গোল তা (ـة / ة) থাকায় শব্দটি স্ত্রীলিঙ্গ। তাই নির্দেশ করতে 'هٰذِهِ' (নিকটে) বা 'تِلْكَ' (দূরে) ব্যবহৃত হয়।"
    });
  }

  // Tanween Rule
  if (/[ـٌ]/.test(word) || /[ٌ]/.test(word)) {
    notes.push({
      title: "তানভীন (দুই পেশ) কেন হলো?",
      rule: "শব্দটি নির্দিষ্ট (আলিফ-লামযুক্ত) নয় এবং কোনো শব্দের মুদাফ নয়। অনির্দিষ্ট সাধারণ একবচন বিশেষ্য প্রকাশে শেষ অক্ষরে তানভীন (দুম্মাতাইন) বসেছে।"
    });
  }

  // Alif-Lam Rule
  if (clean.startsWith("ال") || clean.startsWith("اَل")) {
    notes.push({
      title: "আলিফ-লাম (ال) ও তানভীনের বৈরিতা",
      rule: "কোনো শব্দের শুরুতে 'ال' যুক্ত হলে তার শেষ থেকে তানভীন বিলুপ্ত হয়ে এক যবর/যের/পেশ হয়। যেমন: كِتَابٌ ➔ اَلْكِتَابُ।"
    });
  }

  // Harf Jar Attached
  const attachedJar = getAttachedHarfJar(clean);
  if (attachedJar) {
    notes.push({
      title: "সংযুক্ত হরফে জর (" + attachedJar.prefix + ") এর প্রভাব",
      rule: "শব্দটির শুরুতে " + attachedJar.prefix + " হরফে জর যুক্ত হওয়ার কারণে শব্দটি মাজরুর হয়েছে এবং শেষ অক্ষরে যের (কাসরা) হয়েছে।"
    });
  }

  // Verb Recognition
  const verbInfo = isVerb(clean);
  if (verbInfo) {
    notes.push({
      title: "ক্রিয়াপদ (ফি'ল) শনাক্তকরণ",
      rule: "এটি একটি " + verbInfo.type + "। বাক্যটিতে এটি কর্তা (ফা'য়েল) নিয়ে জুমলা ফি'লিয়্যা গঠন করে।"
    });
  }

  return notes;
}
