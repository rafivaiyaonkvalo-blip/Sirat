/**
 * আত-তামরীনুল কিতাবী - বাক্য খণ্ডায়ন ও বহু-ধাপ প্রসেসর
 * মারকাযুল ঈমান (Markazul Iman) - https://markazuliman.com
 *
 * দীর্ঘ ও যৌগিক বাক্যগুলোকে শিক্ষার্থী-বান্ধব খণ্ডাংশে রূপান্তর করে
 * এবং চূড়ান্ত ধাপে পূর্ণাঙ্গ বাক্য (Full Sentence) নিখুঁত হরকত সহ একীভূত করে।
 */

/**
 * আরবি ও বাংলা যৌগিক বাক্যকে যুক্তিসঙ্গত খণ্ডে বিভক্ত করার চেষ্টা করে
 */
export function splitCompoundSentence(arabicSentence, banglaSentence) {
  if (!arabicSentence || typeof arabicSentence !== 'string') return null;

  const cleanAr = arabicSentence.trim();
  const cleanBn = (banglaSentence || '').trim();

  // শব্দ সংখ্যা যদি ৪ বা তার বেশি হয় এবং বাক্যটি 'وَ' বা কমা দ্বারা যুক্ত থাকে
  const words = cleanAr.split(/\s+/).filter(Boolean);
  if (words.length < 4) return null;

  // আরবি খণ্ডায়ন: 'وَ' অথবা কমার পরে খণ্ড
  const arMatch = cleanAr.match(/^(.*?)(?:[،,]\s*|\s+)(وَ[\u0600-\u06FF].+)$/);
  if (!arMatch) return null;

  const part1Ar = arMatch[1].trim();
  const part2Ar = arMatch[2].trim();

  // বাংলা খণ্ডায়ন: এবং, আর, ও, অথবা কমা
  let part1Bn = cleanBn;
  let part2Bn = '';

  const bnMatch = cleanBn.match(/^(.*?)(?:[،,]\s*|\s+(?:এবং|আর|ও)\s+)(.+)$/);
  if (bnMatch) {
    part1Bn = bnMatch[1].trim().replace(/[।\.]$/, '');
    part2Bn = bnMatch[2].trim();
    // 'এবং' বা 'আর' ছাড়া থাকলে স্বাভাবিক অর্থ
    if (!part2Bn.startsWith('এবং') && !part2Bn.startsWith('আর') && !part2Bn.startsWith('ও')) {
      part2Bn = `এবং ${part2Bn}`;
    }
  }

  // যদি বাংলায় পরিষ্কার বিভাজন না পাওয়া যায় তবে শুধু আরবিকে ভাঙলে ব্যাকরণ নষ্ট হতে পারে
  if (!part2Bn) return null;

  return {
    isCompound: true,
    fullArabic: cleanAr,
    fullBangla: cleanBn,
    clause1: {
      arabic: part1Ar,
      bangla: part1Bn,
      title: '১ম খণ্ডাংশ'
    },
    clause2: {
      arabic: part2Ar,
      bangla: part2Bn,
      title: '২য় খণ্ডাংশ'
    }
  };
}

/**
 * একটি তামরীনের সকল অনুশীলনকে সুষম ও ধারাবাহিক শিক্ষণ ধাপে বিভক্ত করে
 * ক) তরজমা ও উচ্চারণ (Listening / Comprehension)
 * খ) খণ্ডাংশ গঠন (ছোট অংশে রূপান্তর - বড় বাক্যের জন্য)
 * গ) পূর্ণাঙ্গ বাক্য গঠন (Complete Sentence Builder)
 * ঘ) তারকীব ও ব্যাকরণগত বিশ্লেষণ (Tarkib & Grammar)
 */
export function buildEnhancedTamrinSteps(tamrin) {
  const steps = [];
  if (!tamrin) return steps;

  const rawExercises = Array.isArray(tamrin.exercises) ? tamrin.exercises : [];
  
  rawExercises.forEach((ex, exIdx) => {
    const rawAr = (ex.arabicSentence || '').trim();
    const rawBn = (ex.banglaSentence || '').trim();
    const isTarkib = ex.task?.includes('তারকীব') || 
                     ex.task?.includes('বিশ্লেষণ') || 
                     rawBn.includes('মুবতাদা') || 
                     rawBn.includes('খবর') || 
                     rawBn.includes('মাওসূফ') || 
                     rawBn.includes('সিফাত');

    // তারকীব বিশ্লেষণ ধাপ
    if (isTarkib) {
      steps.push({
        id: `tarkib-${exIdx}`,
        stageType: 'tarkib',
        stageLabel: 'তারকীব ও ব্যাকরণিক বিশ্লেষণ',
        task: ex.task || 'তারকীব ও ব্যাকরণিক বিশ্লেষণ',
        arabicSentence: rawAr,
        banglaSentence: rawBn,
        hint: ex.hint || 'বাক্যের উপাদানসমূহ (মুবতাদা, খবর, সিফাত, মাওসূফ) লক্ষ্য করুন।',
        page: ex.page || tamrin.page,
        mode: 'ar-to-bn',
        isTarkib: true
      });
      return;
    }

    // বড় বাক্যে হাতে-লেখা ছোট অংশ (chunks) থাকলে: আগে প্রতিটি অংশের অনুশীলন, শেষে পূর্ণ বাক্য
    if (Array.isArray(ex.chunks) && ex.chunks.length >= 2) {
      const mode = ex.mode || 'ar-to-bn';
      ex.chunks.forEach((c, ci) => {
        steps.push({
          id: `chunk-${exIdx}-${ci}`,
          stageType: 'clause',
          stageLabel: `ছোট অংশ ${ci + 1}/${ex.chunks.length}`,
          task: mode === 'ar-to-bn' ? 'অংশটির অর্থ কী?' : 'অংশটি আরবিতে সাজান',
          instruction: mode === 'ar-to-bn' ? 'আরবি অংশটির সঠিক বাংলা বাছুন:' : 'বাবল ট্যাপ করে অংশটি আরবিতে সাজান:',
          arabicSentence: c.arabic,
          banglaSentence: c.bangla,
          hint: ex.hint,
          page: ex.page || tamrin.page,
          mode,
          isClause: true,
          clausePart: ci + 1
        });
      });
      steps.push({
        id: `ex-${exIdx}`,
        stageType: mode === 'ar-to-bn' ? 'comprehension' : 'full_sentence',
        stageLabel: 'পূর্ণ বাক্য',
        task: ex.task || (mode === 'ar-to-bn' ? 'বাংলায় বলো ও তরজমা করো' : 'আরবিতে বলো ও বাক্য সাজাও'),
        instruction: mode === 'ar-to-bn' ? 'এবার পুরো বাক্যটির সঠিক অনুবাদ বাছুন:' : 'এবার পুরো বাক্যটি আরবিতে সাজান:',
        arabicSentence: rawAr,
        banglaSentence: rawBn,
        hint: ex.hint,
        page: ex.page || tamrin.page,
        mode
      });
      return;
    }

    // যৌগিক বাক্য কি না যাচাই
    const compound = splitCompoundSentence(rawAr, rawBn);

    if (compound && ex.mode !== 'ar-to-bn') {
      // ১. খণ্ডাংশ ১ (ছোট অংশ আগে গঠন করা)
      steps.push({
        id: `clause-1-${exIdx}`,
        stageType: 'clause',
        stageLabel: 'খণ্ডাংশ ১ অনুশীলন',
        task: `বড় বাক্যের ১ম অংশ সাজান`,
        instruction: 'নিচের বাবল ট্যাপ করে প্রথম অংশটি আরবিতে সাজান:',
        arabicSentence: compound.clause1.arabic,
        banglaSentence: compound.clause1.bangla,
        fullArabicTarget: rawAr,
        fullBanglaTarget: rawBn,
        hint: ex.hint,
        page: ex.page || tamrin.page,
        mode: 'bn-to-ar',
        isClause: true,
        clausePart: 1
      });

      // ২. খণ্ডাংশ ২ (দ্বিতীয় অংশ গঠন করা)
      steps.push({
        id: `clause-2-${exIdx}`,
        stageType: 'clause',
        stageLabel: 'খণ্ডাংশ ২ অনুশীলন',
        task: `বড় বাক্যের ২য় অংশ সাজান`,
        instruction: 'নিচের বাবল ট্যাপ করে দ্বিতীয় অংশটি আরবিতে সাজান:',
        arabicSentence: compound.clause2.arabic,
        banglaSentence: compound.clause2.bangla,
        fullArabicTarget: rawAr,
        fullBanglaTarget: rawBn,
        hint: ex.hint,
        page: ex.page || tamrin.page,
        mode: 'bn-to-ar',
        isClause: true,
        clausePart: 2
      });

      // ৩. পূর্ণাঙ্গ বাক্য (সতর্কতা: পুরো বাক্যটি যাতে ছাত্র পূর্ণাঙ্গভাবে একীভূত করতে পারে)
      steps.push({
        id: `full-sentence-${exIdx}`,
        stageType: 'full_sentence',
        stageLabel: 'পূর্ণাঙ্গ বাক্য একীভূতকরণ',
        task: `এবার সম্পূর্ণ বাক্যটি একসাথে গঠন করুন`,
        instruction: 'খণ্ডাংশগুলো মিলিয়ে পুরো বাক্যটি নির্ভুলভাবে আরবিতে সাজান:',
        arabicSentence: compound.fullArabic,
        banglaSentence: compound.fullBangla,
        hint: 'দুই অংশের সমন্বয়ে মূল বাক্যটি সম্পন্ন করুন।',
        page: ex.page || tamrin.page,
        mode: 'bn-to-ar',
        isFullPreserved: true
      });
    } else {
      // সাধারণ একক বাক্য
      steps.push({
        id: `ex-${exIdx}`,
        stageType: ex.mode === 'ar-to-bn' ? 'comprehension' : 'full_sentence',
        stageLabel: ex.mode === 'ar-to-bn' ? 'তরজমা ও পাঠোদ্ধার' : 'আরবি বাক্য গঠন',
        task: ex.task || (ex.mode === 'ar-to-bn' ? 'বাংলায় বলো ও তরজমা করো' : 'আরবিতে বলো ও বাক্য সাজাও'),
        instruction: ex.mode === 'ar-to-bn' ? 'আরবি বাক্যটি শুনে সঠিক বাংলা অনুবাদ নির্বাচন করুন:' : 'শব্দ সাজিয়ে সঠিক আরবি বাক্য তৈরি করুন:',
        arabicSentence: rawAr,
        banglaSentence: rawBn,
        hint: ex.hint,
        page: ex.page || tamrin.page,
        mode: ex.mode || 'ar-to-bn'
      });
    }
  });

  return steps;
}
