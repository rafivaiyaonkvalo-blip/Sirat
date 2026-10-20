// XP Integrity, Anti-Cheat, and Tamper-Proofing Engine for ULS Arabic
// মারকাযুল ঈমান — আরবি শিক্ষা পোর্টাল

const XP_SCALE_VERSION = 2;

// সিক্রেট সল্ট (ক্লায়েন্ট-সাইড ট্যাম্পার প্রতিরোধে হ্যাশ সিগনেচার তৈরি করতে ব্যবহৃত)
const INTEGRITY_SALT = 'Markazul-Iman-XP-Guard-v2#786#Alhamdulillah#NoCheat';
const XP_KEY = 'uls_total_xp';
const XP_SIG_KEY = 'uls_xp_sig';
const STREAK_KEY = 'uls_daily_streak_data';
const RATE_LIMIT_KEY = 'uls_xp_velocity';

// কোনো একক অ্যাকশনে সর্বোচ্চ সম্ভাব্য বৈধ XP (দারস সমাপ্তি + পারফেক্ট বোনাস + স্ট্রিক = ~৪৭০ XP)
export const MAX_SINGLE_XP_AWARD = 500;

// গতিসীমা: ১০ সেকেন্ডে সর্বোচ্চ ৭৫০ XP (এর বেশি মানুষের পক্ষে বৈধভাবে পড়া ও উত্তর দেওয়া অসম্ভব)
export const VELOCITY_WINDOW_MS = 10000;
export const MAX_VELOCITY_XP = 750;

/**
 * ফাস্ট ৬০-বিট হ্যাশিং অ্যালগরিদম (Double-round avalanche mixing)
 */
function fastHash(str) {
  let h1 = 0xdeadbeef ^ 786;
  let h2 = 0x41c6ce57 ^ 2026;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const high = (2097151 & h2).toString(16).padStart(6, '0');
  const low = (h1 >>> 0).toString(16).padStart(8, '0');
  return `${high}${low}`;
}

/**
 * XP ও স্ট্রিকের জন্য বৈধ ডিজিটাল সিগনেচার তৈরি
 */
export function generateXpSignature(xp, streakCount = 1, uid = '') {
  const safeXp = Math.max(0, parseInt(xp || 0, 10));
  const safeStreak = Math.max(1, parseInt(streakCount || 1, 10));
  const safeUid = String(uid || '').trim();
  const payload = `${INTEGRITY_SALT}|xp=${safeXp}|st=${safeStreak}|uid=${safeUid}|v=${XP_SCALE_VERSION}`;
  return fastHash(payload);
}

/**
 * সিগনেচার যাচাই (ট্যাম্পার হয়েছে কি না)
 */
export function verifyXpSignature(xp, signature, streakCount = 1, uid = '') {
  if (!signature || typeof signature !== 'string') return false;
  const expected = generateXpSignature(xp, streakCount, uid);
  return signature === expected;
}

/**
 * স্থানীয় স্টোরেজে সংরক্ষিত সিগনেচার আপডেট করা
 */
export function saveSignedXp(xp, streakCount = 1, uid = '') {
  if (typeof window === 'undefined') return;
  try {
    const safeXp = Math.max(0, parseInt(xp || 0, 10));
    localStorage.setItem(XP_KEY, String(safeXp));
    const sig = generateXpSignature(safeXp, streakCount, uid);
    localStorage.setItem(XP_SIG_KEY, sig);
  } catch {}
}

/**
 * বর্তমান ইউজারের বাস্তব প্রগ্রেস অনুযায়ী সর্বোচ্চ সম্ভাব্য বৈধ XP (Plausibility Ceiling)
 * কোনো অবস্থাতেই একজন শিক্ষার্থী তার পাঠ্যসূচির বাস্তব পরিমাণের চেয়ে আকাশচুম্বী XP অর্জন করতে পারে না।
 */
export function calculateMaxPlausibleXp(progressData = {}) {
  const lessons = progressData.lessonsProgress || {};
  const tamrins = progressData.tamrinProgress || {};
  const exams = Array.isArray(progressData.examHistory) ? progressData.examHistory : [];
  const streak = Math.max(1, parseInt(progressData.streakData?.count || progressData.streakDays || 1, 10));
  const mastered = Array.isArray(progressData.mastered) 
    ? progressData.mastered.length 
    : parseInt(progressData.masteredCount || 0, 10);

  const completedLessons = Object.keys(lessons).length;
  // শব্দার্থ সেট বাদে আসল তামরীন
  const completedTamrins = Object.keys(tamrins).filter((k) => !k.startsWith('tamrin-words-')).length;
  const examsCount = exams.length;

  // প্রতিটি দারসে গড়ে ৩ বার পর্যন্ত পূর্ণাঙ্গ অনুশীলনের সুযোগ (প্রতি দারস ১২০০ XP সিলিং)
  const lessonsCeiling = completedLessons * 1200;
  // প্রতিটি তামরীনে সর্বোচ্চ ৬০০ XP সিলিং
  const tamrinsCeiling = completedTamrins * 600;
  // প্রতিটি পরীক্ষায় সর্বোচ্চ ৪০০ XP সিলিং
  const examsCeiling = examsCount * 400;
  // প্রতিটি মুখস্থ শব্দে ২৫ XP সিলিং
  const vocabCeiling = mastered * 25;
  // স্ট্রিক সিলিং: প্রতি ৭ দিনে ২০০ বোনাস + দৈনিক সক্রিয়তার গড়
  const streakCeiling = (Math.floor(streak / 7) * 200) + (streak * 60);
  // নতুন ব্যবহারকারী/অনুশীলনের বেস বাফার (কুইজ, বানান, ফ্ল্যাশকার্ড ইত্যাদি দারস শেষ না করেও করা যায়)
  const baseBuffer = 1500;

  return lessonsCeiling + tamrinsCeiling + examsCeiling + vocabCeiling + streakCeiling + baseBuffer;
}

/**
 * শিক্ষার্থীর আসল প্রগ্রেস অনুযায়ী যুক্তিসঙ্গত প্রকৃত XP হিসাব করা (রিকভারি বা রিসেটের জন্য)
 */
export function calculateLegitimateXpFromProgress(progressData = {}) {
  const lessons = progressData.lessonsProgress || {};
  const tamrins = progressData.tamrinProgress || {};
  const exams = Array.isArray(progressData.examHistory) ? progressData.examHistory : [];
  const streak = Math.max(1, parseInt(progressData.streakData?.count || progressData.streakDays || 1, 10));
  const mastered = Array.isArray(progressData.mastered) 
    ? progressData.mastered.length 
    : parseInt(progressData.masteredCount || 0, 10);

  const completedLessons = Object.keys(lessons).length;
  const completedTamrins = Object.keys(tamrins).filter((k) => !k.startsWith('tamrin-words-')).length;
  const examsCount = exams.length;

  // গড় বাস্তবসম্মত অর্জন
  const lessonXp = completedLessons * 320;
  const tamrinXp = completedTamrins * 180;
  const examXp = examsCount * 110;
  const vocabXp = mastered * 6;
  const streakXp = (Math.floor(streak / 7) * 200) + (streak * 25);
  const starterXp = 50;

  return Math.max(0, lessonXp + tamrinXp + examXp + vocabXp + streakXp + starterXp);
}

/**
 * ব্রাউজার বা মেমোরিতে XP ট্যাম্পার হয়েছে কি না যাচাই ও মেরামত
 */
export function auditAndRecoverLocalXp() {
  if (typeof window === 'undefined') return 0;
  try {
    const rawXp = parseInt(localStorage.getItem(XP_KEY) || '0', 10) || 0;
    const currentSig = localStorage.getItem(XP_SIG_KEY);
    const streakStr = localStorage.getItem(STREAK_KEY);
    const streakData = streakStr ? JSON.parse(streakStr) : { count: 1 };
    const streakCount = streakData.count || 1;
    const currentUid = localStorage.getItem('uls_current_user_uid') || '';

    // সিগনেচার মেলানো
    const isSigValid = verifyXpSignature(rawXp, currentSig, streakCount, currentUid);

    // বাস্তব প্রগ্রেস সংগ্রহ
    const progressData = {
      lessonsProgress: JSON.parse(localStorage.getItem('uls_lessons_progress') || '{}'),
      tamrinProgress: JSON.parse(localStorage.getItem('uls_tamrin_progress') || '{}'),
      examHistory: JSON.parse(localStorage.getItem('uls_arabic_exam_history') || '[]'),
      mastered: JSON.parse(localStorage.getItem('uls_arabic_mastered') || '[]'),
      streakData
    };

    const maxAllowed = calculateMaxPlausibleXp(progressData);

    // ১. সিগনেচার নেই বা ভুল (কেউ ব্রাউজারের লোকাল স্টোরেজে ফেক মান বসিয়েছে)
    // ২. অথবা XP সিলিং এর চেয়ে অসম্ভব বেশি
    if (!isSigValid || rawXp > maxAllowed) {
      // যদি সিগনেচার একদমই না থাকে (প্রথমবার আপগ্রেড হওয়া পুরনো ব্যবহারকারী)
      if (!currentSig && rawXp > 0 && rawXp <= maxAllowed) {
        // বৈধ পুরনো ব্যবহারকারী — নতুন সুরক্ষিত সিগনেচার বানিয়ে সেভ করা
        saveSignedXp(rawXp, streakCount, currentUid);
        return rawXp;
      }

      // ট্যাম্পার বা অস্বাভাবিক চিটিং ধরা পড়েছে!
      console.warn('⚠️ XP Tamper / Cheat Detected! Restoring legitimate XP...', {
        attemptedXp: rawXp,
        maxAllowed,
        isSigValid
      });

      const recoveredXp = Math.min(rawXp > 0 ? rawXp : 0, calculateLegitimateXpFromProgress(progressData));
      saveSignedXp(recoveredXp, streakCount, currentUid);
      return recoveredXp;
    }

    return rawXp;
  } catch (err) {
    console.error('XP Audit error:', err);
    return 0;
  }
}

/**
 * অ্যান্টি-স্প্যাম ভেলোসিটি গার্ড (একটানা স্ক্রিপ্ট বা লুপ চালিয়ে XP চুরি রোধ)
 */
export function checkXpRateLimit(awardAmount) {
  if (typeof window === 'undefined') return { allowed: true, clampedAmount: awardAmount };
  try {
    const now = Date.now();
    const rawVelocity = sessionStorage.getItem(RATE_LIMIT_KEY);
    let velocityData = rawVelocity ? JSON.parse(rawVelocity) : { windowStart: now, currentXp: 0 };

    // উইন্ডো পার হয়ে গেলে রিসেট
    if (now - velocityData.windowStart > VELOCITY_WINDOW_MS) {
      velocityData = { windowStart: now, currentXp: 0 };
    }

    // একক অ্যাকশনের সর্বোচ্চ সিলিং
    const clampedAmount = Math.min(awardAmount, MAX_SINGLE_XP_AWARD);

    // গতিসীমা অতিক্রম করেছে কি না
    if (velocityData.currentXp + clampedAmount > MAX_VELOCITY_XP) {
      console.warn('⚠️ XP Rate limit exceeded! Anti-cheat throttled rapid XP gains.');
      return { allowed: false, clampedAmount: 0 };
    }

    // ভেলোসিটি আপডেট
    velocityData.currentXp += clampedAmount;
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(velocityData));

    return { allowed: true, clampedAmount };
  } catch {
    return { allowed: true, clampedAmount: Math.min(awardAmount, MAX_SINGLE_XP_AWARD) };
  }
}

/**
 * ক্লাউডে পুশ করার পূর্বে পূর্ণাঙ্গ অ্যান্টি-চিট স্যানিটাইজেশন
 */
export function sanitizeUserDataForCloudSync(dataToSync) {
  if (!dataToSync) return dataToSync;

  const rawXp = parseInt(dataToSync.totalXp || 0, 10);
  const maxPlausible = calculateMaxPlausibleXp(dataToSync);

  // যদি কোনো শিক্ষার্থী ক্লাউডে ফেক XP পুশ করার চেষ্টা করে
  if (rawXp > maxPlausible) {
    console.warn(`⚠️ Cloud Sync Anti-Cheat: User XP ${rawXp} exceeds max plausible ${maxPlausible}. Clamping.`);
    dataToSync.totalXp = maxPlausible;
    dataToSync.isXpSuspicious = true;
    dataToSync.xpTamperAudit = {
      flaggedAt: new Date().toISOString(),
      originalAttemptedXp: rawXp,
      clampedTo: maxPlausible
    };
  } else {
    dataToSync.isXpSuspicious = false;
  }

  return dataToSync;
}

const FLASHCARD_MILESTONE_KEY = 'uls_flashcard_highest_mastered_milestone';
const FLASHCARD_DAILY_XP_KEY = 'uls_flashcard_daily_xp';
const MAX_FLASHCARD_DAILY_XP = 100;

/**
 * ফ্ল্যাশকার্ডে মুখস্থ শব্দের মাইলস্টোন ও অ্যান্টি-চিট যাচাই
 * একই শব্দ বারবার আনমার্ক/মার্ক করে বা দ্রুত স্প্যাম ক্লিক করে ফেক XP নেওয়া অসম্ভব
 */
export function checkFlashcardMasteryEligible(currentMasteredCount, hasFlipped = true, timeSpentOnCardMs = 2000) {
  if (typeof window === 'undefined') return { eligible: false, bonusXp: 0 };
  try {
    const count = parseInt(currentMasteredCount || 0, 10);
    if (count < 10) return { eligible: false, bonusXp: 0 };

    // ১. কার্ড অন্তত ১.২ সেকেন্ড দেখা বা ফ্লিপ করা আবশ্যক (ব্লাইন্ড স্প্যাম ক্লিক রোধ)
    if (!hasFlipped && timeSpentOnCardMs < 1200) {
      console.warn('⚠️ Flashcard Anti-Cheat: Card marked without viewing/flipping. XP blocked.');
      return { eligible: false, bonusXp: 0, reason: 'unviewed_spam' };
    }

    // ২. সর্বোচ্চ মাইলস্টোন যাচাই (পূর্বে পাওয়া মাইলস্টোনে দ্বিতীয়বার কোনো XP দেওয়া হবে না)
    const rawMilestone = parseInt(localStorage.getItem(FLASHCARD_MILESTONE_KEY) || '0', 10);
    const targetMilestone = Math.floor(count / 10) * 10;
    if (targetMilestone <= rawMilestone) {
      return { eligible: false, bonusXp: 0, reason: 'already_awarded' };
    }

    // ৩. দৈনিক সিলিং যাচাই (দিনে সর্বোচ্চ ১০০ XP)
    const today = new Date().toISOString().split('T')[0];
    const rawDaily = localStorage.getItem(FLASHCARD_DAILY_XP_KEY);
    const dailyData = rawDaily ? JSON.parse(rawDaily) : { date: today, xp: 0 };
    const currentDailyXp = dailyData.date === today ? (dailyData.xp || 0) : 0;

    if (currentDailyXp >= MAX_FLASHCARD_DAILY_XP) {
      console.warn('⚠️ Flashcard Anti-Cheat: Daily flashcard XP cap reached.');
      return { eligible: false, bonusXp: 0, reason: 'daily_cap' };
    }

    // মাইলস্টোন নিশ্চিতকরণ ও সেভ
    localStorage.setItem(FLASHCARD_MILESTONE_KEY, String(targetMilestone));
    const bonusXp = 20;
    const newDailyXp = currentDailyXp + bonusXp;
    localStorage.setItem(FLASHCARD_DAILY_XP_KEY, JSON.stringify({ date: today, xp: newDailyXp }));

    return { eligible: true, bonusXp, milestone: targetMilestone };
  } catch {
    return { eligible: false, bonusXp: 0 };
  }
}

const EXAM_DAILY_XP_KEY = 'uls_exam_daily_xp';
const EXAM_LAST_SUBMIT_KEY = 'uls_exam_last_submit';
const MAX_EXAM_DAILY_XP = 300;
const EXAM_MIN_TIME_PER_QUESTION_SEC = 1.2;

/**
 * পরীক্ষা (মডেল টেস্ট) শেষে অর্জিত XP অডিট ও সিলিং যাচাই
 * অতিদ্রুত রোবটিক ক্লিক, মাত্র ১-২ প্রশ্নের পরীক্ষা দিয়ে বারবার বোনাস নেওয়া রোধ করে
 */
export function auditAndClampExamXp({ questionCount, percentage, timeSpentSec }) {
  if (typeof window === 'undefined') return 0;
  try {
    const qCount = parseInt(questionCount || 0, 10);
    const timeSec = parseInt(timeSpentSec || 0, 10);
    const pct = parseInt(percentage || 0, 10);

    // ১. অতিদ্রুত রোবটিক সাবমিট বন্ধ (প্রতি প্রশ্নে অন্তত ১.২ সেকেন্ড সময় ব্যয় হওয়া জরুরি)
    const minRequiredTime = qCount * EXAM_MIN_TIME_PER_QUESTION_SEC;
    if (timeSec < minRequiredTime && qCount >= 5) {
      console.warn('⚠️ Exam Anti-Cheat: Sub-human completion speed detected. No XP awarded.');
      return 0;
    }

    // ২. কোলডাউন যাচাই (পরপর পরীক্ষার মধ্যে অন্তত ১৫ সেকেন্ড বিরতি)
    const now = Date.now();
    const lastSubmit = parseInt(sessionStorage.getItem(EXAM_LAST_SUBMIT_KEY) || '0', 10);
    if (now - lastSubmit < 15000) {
      console.warn('⚠️ Exam Anti-Cheat: Rapid consecutive exam spam throttled.');
      return 0;
    }

    // ৩. প্রশ্ন সংখ্যার অনুপাতে স্কেলিং (১০ প্রশ্নের নিচে পূর্ণাঙ্গ বোনাস নেই)
    let baseAward = 50;
    if (pct >= 80) baseAward += 30;
    if (pct === 100) baseAward += 50;

    let scaledAward = baseAward;
    if (qCount < 10) {
      // যদি কেউ মাত্র ১ বা ২টি শব্দের ফিল্টার দিয়ে পরীক্ষা দেয়
      const ratio = Math.max(0.1, qCount / 10);
      scaledAward = Math.round(baseAward * ratio);
      scaledAward = Math.min(scaledAward, 25); // সর্বোচ্চ ২৫ XP
    }

    // ৪. দৈনিক পরীক্ষা XP সিলিং (দিনে সর্বোচ্চ ৩০০ XP)
    const today = new Date().toISOString().split('T')[0];
    const rawDaily = localStorage.getItem(EXAM_DAILY_XP_KEY);
    const dailyData = rawDaily ? JSON.parse(rawDaily) : { date: today, xp: 0 };
    const currentDailyXp = dailyData.date === today ? (dailyData.xp || 0) : 0;

    const remainingAllowed = Math.max(0, MAX_EXAM_DAILY_XP - currentDailyXp);
    const finalAward = Math.min(scaledAward, remainingAllowed);

    if (finalAward > 0) {
      sessionStorage.setItem(EXAM_LAST_SUBMIT_KEY, String(now));
      localStorage.setItem(EXAM_DAILY_XP_KEY, JSON.stringify({ date: today, xp: currentDailyXp + finalAward }));
    }

    return finalAward;
  } catch {
    return 0;
  }
}
