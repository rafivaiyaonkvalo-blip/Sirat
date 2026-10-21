// Gamification, Streaks and XP Engine for ULS Arabic
import { 
  auditAndRecoverLocalXp, 
  saveSignedXp, 
  checkXpRateLimit, 
  calculateMaxPlausibleXp 
} from './xpIntegrity';

const STREAK_KEY = 'uls_daily_streak_data';
const XP_KEY = 'uls_total_xp';
const XP_SCALE_KEY = 'uls_xp_scale_version';
const XP_HISTORY_KEY = 'uls_xp_history';
const XP_HISTORY_DAYS = 60;

// XP-এর নিয়ম: প্রতি সঠিক উত্তরে XP, পর্ব শেষে ও ভুলহীন হলে বোনাস, দারস ও ৭ দিনের স্ট্রিকে বড় বোনাস
// ফ্ল্যাশকার্ডে প্রতি ১০টি মুখস্থ করলে বোনাস, পরীক্ষা শেষে ও ভালো স্কোরে বোনাস
export const XP_RULES = {
  perCorrect: 10,
  sessionComplete: 20,
  perfectBonus: 30,
  darsBonus: 200,
  streakBonus: 200,
  streakBonusEvery: 7,
  flashcardMasteryBatch: 10,    // প্রতি ১০টি কার্ড মুখস্থ করলে বোনাস
  flashcardMasteryXp: 20,       // ১০ কার্ড মুখস্থ = ২০ XP
  examComplete: 50,             // পরীক্ষা সম্পূর্ণ করলে ৫০ XP
  exam80Bonus: 30,              // ৮০%+ স্কোরে +৩০ XP বোনাস
  exam100Bonus: 50              // ১০০% স্কোরে +৫০ XP অতিরিক্ত বোনাস
};

// পুরনো হারে জমানো XP একবার নতুন হারে গুণ করা হয় (ক্লাউডের পুরনো XP-র জন্যও একই গুণক)
export const XP_SCALE_VERSION = 2;
export const LEGACY_XP_MULTIPLIER = 3;

function ensureXpScale() {
  try {
    if (localStorage.getItem(XP_SCALE_KEY) === String(XP_SCALE_VERSION)) return;
    const raw = parseInt(localStorage.getItem(XP_KEY) || '0', 10) || 0;
    if (raw > 0) localStorage.setItem(XP_KEY, String(raw * LEGACY_XP_MULTIPLIER));
    localStorage.setItem(XP_SCALE_KEY, String(XP_SCALE_VERSION));
  } catch {
    // স্টোরেজ না থাকলে কিছু করার নেই
  }
}

export function calcSessionXp(correctCount, mistakes) {
  return correctCount * XP_RULES.perCorrect
    + XP_RULES.sessionComplete
    + (mistakes === 0 ? XP_RULES.perfectBonus : 0);
}

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateString(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// দিনভিত্তিক XP ইতিহাস { 'YYYY-MM-DD': xp } — স্ট্রিক ক্যালেন্ডার ও সাপ্তাহিক XP-র জন্য
export function getXpHistory() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(XP_HISTORY_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function addXpToHistory(date, xp) {
  const history = getXpHistory();
  history[date] = (history[date] || 0) + xp;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - XP_HISTORY_DAYS);
  const cutoffStr = getDateString(cutoff);
  Object.keys(history).forEach(k => { if (k < cutoffStr) delete history[k]; });
  localStorage.setItem(XP_HISTORY_KEY, JSON.stringify(history));
}

function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStreakData() {
  if (typeof window === 'undefined') {
    return { count: 1, lastActiveDate: getTodayString() };
  }
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) {
      const initial = { count: 1, lastActiveDate: getTodayString() };
      localStorage.setItem(STREAK_KEY, JSON.stringify(initial));
      return initial;
    }
    const data = JSON.parse(raw);
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (data.lastActiveDate === today) {
      return data;
    } else if (data.lastActiveDate === yesterday) {
      return data;
    } else {
      // Streak broken (missed more than 1 day)
      const reset = { count: 1, lastActiveDate: today };
      localStorage.setItem(STREAK_KEY, JSON.stringify(reset));
      return reset;
    }
  } catch (err) {
    console.error('Streak read error:', err);
    return { count: 1, lastActiveDate: getTodayString() };
  }
}

export function recordDailyActivity(earnedXp = 20) {
  if (typeof window === 'undefined') return { streak: 1, totalXp: 0, streakBonus: 0 };
  try {
    ensureXpScale();
    const today = getTodayString();
    const yesterday = getYesterdayString();
    let currentStreak = 1;
    const raw = localStorage.getItem(STREAK_KEY);

    let lastStreakBonusDate = null;
    if (raw) {
      const data = JSON.parse(raw);
      lastStreakBonusDate = data.streakBonusDate || null;
      if (data.lastActiveDate === today) {
        currentStreak = data.count || 1;
      } else if (data.lastActiveDate === yesterday) {
        currentStreak = (data.count || 0) + 1;
      } else {
        currentStreak = 1;
      }
    }
    // প্রতি ৭ দিনের টানা স্ট্রিকে দিনে একবার বোনাস
    const streakBonus = currentStreak % XP_RULES.streakBonusEvery === 0 && lastStreakBonusDate !== today
      ? XP_RULES.streakBonus
      : 0;
    localStorage.setItem(STREAK_KEY, JSON.stringify({
      count: currentStreak,
      lastActiveDate: today,
      streakBonusDate: streakBonus > 0 ? today : lastStreakBonusDate
    }));

    // অ্যান্টি-স্প্যাম রেট লিমিট ও সিলিং ভ্যালিডেশন
    const { allowed, clampedAmount } = checkXpRateLimit(earnedXp);
    if (!allowed || clampedAmount <= 0) {
      console.warn('XP award ignored due to anti-cheat velocity rate limit');
      return { streak: currentStreak, totalXp: getTotalXp(), streakBonus: 0 };
    }

    // বর্তমান বৈধ XP ও সর্বোচ্চ সিলিং যাচাই
    const currentXp = getTotalXp();
    const candidateXp = currentXp + clampedAmount + streakBonus;

    const progressData = {
      lessonsProgress: JSON.parse(localStorage.getItem('uls_lessons_progress') || '{}'),
      tamrinProgress: JSON.parse(localStorage.getItem('uls_tamrin_progress') || '{}'),
      examHistory: JSON.parse(localStorage.getItem('uls_arabic_exam_history') || '[]'),
      mastered: JSON.parse(localStorage.getItem('uls_arabic_mastered') || '[]'),
      streakData: { count: currentStreak }
    };
    const maxPlausible = calculateMaxPlausibleXp(progressData);
    const newXp = Math.min(candidateXp, maxPlausible);

    // ডিজিটাল সিগনেচারসহ লোকাল স্টোরেজে সুরক্ষিতভাবে সংরক্ষণ
    const currentUid = localStorage.getItem('uls_current_user_uid') || '';
    saveSignedXp(newXp, currentStreak, currentUid);

    const actualGained = Math.max(0, newXp - currentXp);
    if (actualGained > 0) {
      addXpToHistory(today, actualGained);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_progress_changed'));
    }

    return { streak: currentStreak, totalXp: newXp, streakBonus };
  } catch (err) {
    console.error('Record activity error:', err);
    return { streak: 1, totalXp: getTotalXp(), streakBonus: 0 };
  }
}

export function getTotalXp() {
  if (typeof window === 'undefined') return 0;
  try {
    ensureXpScale();
    return auditAndRecoverLocalXp();
  } catch {
    return 0;
  }
}

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return '';
  return String(num).replace(/\d/g, d => BENGALI_DIGITS[d]);
};

// সংখ্যার লেভেল: প্রতি লেভেলে সমান ৩০০ XP — কোনো সীমা নেই
const XP_PER_LEVEL = 300;

export function getLevelInfo(xp = 0) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const levelStartXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  return {
    level,
    levelStartXp,
    nextLevelXp,
    remainingXp: nextLevelXp - xp,
    progressPercent: Math.floor(((xp - levelStartXp) / XP_PER_LEVEL) * 100)
  };
}

export function getRankTitle(xp) {
  const info = getLevelInfo(xp);
  return `লেভেল ${toBengaliNumber(info.level)}`;
}
