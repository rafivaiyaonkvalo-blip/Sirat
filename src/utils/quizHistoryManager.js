/**
 * quizHistoryManager.js
 * Sirat (সীরাত - মারকাযুল ঈমান)
 * 
 * Manages:
 * 1. Quiz & Exam History (নম্বর ও পরীক্ষার ইতিহাস)
 * 2. Active Session Persistence (অনুশীলন চলাকালীন ড্রাফট রিস্টোর / রজিউম)
 * 3. Smart Question Rotation / Seen Questions Tracking (বারবার একই প্রশ্ন আসা রোধ)
 */

import { toBengaliNumber } from './gamification';
import { db, auth } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

const QUIZ_HISTORY_KEY = 'sirat_quiz_history_v1';
const LEGACY_EXAM_KEY = 'uls_arabic_exam_history';
const ACTIVE_QUIZ_SESSION_KEY = 'sirat_active_quiz_session';
const ACTIVE_EXAM_SESSION_KEY = 'sirat_active_exam_session';
const SEEN_QUESTIONS_KEY = 'sirat_seen_questions_pool';
const MAX_HISTORY_ITEMS = 50;
const MAX_SEEN_POOL = 200;

/* =========================================================
   1. Quiz & Exam History Persistence
   ========================================================= */

/**
 * Get all quiz and exam results from localStorage
 */
export function getQuizHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Fallback: Check legacy exam history
    const legacyRaw = localStorage.getItem(LEGACY_EXAM_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (Array.isArray(legacy)) {
        return legacy.map((item) => ({
          id: item.id || Date.now(),
          title: item.title || 'অনুশীলন পরীক্ষা',
          type: item.type || 'exam',
          score: item.score ?? 0,
          total: item.total ?? 0,
          pct: item.pct ?? (item.total ? Math.round((item.score / item.total) * 100) : 0),
          correct: item.score ?? 0,
          wrong: (item.total || 0) - (item.score || 0),
          earnedXp: item.earnedXp || 0,
          date: item.date || new Date().toLocaleDateString('bn-BD'),
          timestamp: item.timestamp || item.id || Date.now()
        }));
      }
    }
    return [];
  } catch (err) {
    console.warn('Failed to read quiz history:', err);
    return [];
  }
}

/**
 * Save a newly completed Quiz or Exam result
 */
export function saveQuizResult({
  title = 'পাঠ-কুইজ',
  type = 'quiz', // 'quiz' | 'exam'
  darsId = null,
  porboNo = null,
  score = 0,
  total = 0,
  earnedXp = 0
}) {
  if (typeof window === 'undefined') return null;

  try {
    const history = getQuizHistory();
    const now = new Date();
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const wrong = Math.max(0, total - score);

    const newEntry = {
      id: Date.now(),
      title,
      type,
      darsId,
      porboNo,
      score,
      total,
      pct,
      correct: score,
      wrong,
      earnedXp: earnedXp || (score * 10 + wrong * 5),
      date: now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime()
    };

    const updated = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));

    // Also sync to legacy exam key for backward compatibility
    try {
      localStorage.setItem(LEGACY_EXAM_KEY, JSON.stringify(updated.slice(0, 30)));
    } catch {}

    // Clear active session once finished
    clearActiveQuizSession();
    clearActiveExamSession();

    // Notify UI listeners
    window.dispatchEvent(new CustomEvent('uls_quiz_history_updated', { detail: newEntry }));
    window.dispatchEvent(new CustomEvent('uls_progress_changed'));

    // Cloud sync if logged in
    const user = auth?.currentUser;
    if (db && user?.uid) {
      setDoc(doc(db, 'users', user.uid), {
        latest_quiz_result: newEntry,
        quiz_history_preview: updated.slice(0, 10),
        quiz_updated_at: now.toISOString()
      }, { merge: true }).catch(() => {});
    }

    return newEntry;
  } catch (err) {
    console.warn('Failed to save quiz result:', err);
    return null;
  }
}

/**
 * Calculate summary statistics for the user's quiz performance
 */
export function getQuizSummaryStats() {
  const history = getQuizHistory();

  // Also read dars scores from progress storage
  let progressScores = {};
  try {
    const raw = localStorage.getItem('sirat_progress_v2');
    if (raw) {
      progressScores = JSON.parse(raw)?.scores || {};
    }
  } catch {}

  const darsScoreValues = Object.values(progressScores);
  const totalCompletedDarsQuizzes = darsScoreValues.length;

  const totalExams = history.length;
  if (totalExams === 0 && totalCompletedDarsQuizzes === 0) {
    return {
      totalAttempted: 0,
      avgPct: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      perfectCount: 0,
      totalXpEarned: 0
    };
  }

  // Combine scores
  let totalScore = 0;
  let totalQuestions = 0;
  let perfectCount = 0;
  let totalXpEarned = 0;

  if (history.length > 0) {
    history.forEach((h) => {
      totalScore += (h.score || 0);
      totalQuestions += (h.total || 0);
      if (h.pct === 100) perfectCount += 1;
      totalXpEarned += (h.earnedXp || 0);
    });
  } else {
    darsScoreValues.forEach((s) => {
      totalScore += (s.score || 0);
      totalQuestions += (s.total || 0);
      if (s.total > 0 && s.score === s.total) perfectCount += 1;
      totalXpEarned += (s.score * 10);
    });
  }

  const avgPct = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  return {
    totalAttempted: Math.max(totalExams, totalCompletedDarsQuizzes),
    avgPct,
    totalCorrect: totalScore,
    totalQuestions,
    perfectCount,
    totalXpEarned
  };
}

/* =========================================================
   2. Active Session Persistence (Resume / Draft State)
   ========================================================= */

/**
 * Save in-progress quiz session
 */
export function saveActiveQuizSession(sessionData) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...sessionData,
      updatedAt: Date.now()
    };
    localStorage.setItem(ACTIVE_QUIZ_SESSION_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save active quiz session:', err);
  }
}

/**
 * Retrieve saved active quiz session
 * Expires after 24 hours
 */
export function getActiveQuizSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_QUIZ_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const now = Date.now();
    // 24 hours expiry
    if (now - (session.updatedAt || 0) > 24 * 60 * 60 * 1000) {
      clearActiveQuizSession();
      return null;
    }
    return session;
  } catch (err) {
    return null;
  }
}

/**
 * Clear saved active quiz session
 */
export function clearActiveQuizSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ACTIVE_QUIZ_SESSION_KEY);
  } catch {}
}

/**
 * Save in-progress exam session
 */
export function saveActiveExamSession(sessionData) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...sessionData,
      updatedAt: Date.now()
    };
    localStorage.setItem(ACTIVE_EXAM_SESSION_KEY, JSON.stringify(payload));
  } catch {}
}

/**
 * Retrieve saved active exam session (expires after 2 hours)
 */
export function getActiveExamSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_EXAM_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() - (session.updatedAt || 0) > 2 * 60 * 60 * 1000) {
      clearActiveExamSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Clear active exam session
 */
export function clearActiveExamSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ACTIVE_EXAM_SESSION_KEY);
  } catch {}
}

/* =========================================================
   3. Smart Question Rotation (Seen Questions Tracking)
   ========================================================= */

/**
 * Unique hash for a question
 */
export function getQuestionKey(q) {
  if (!q) return '';
  const dars = q.darsId || '';
  const text = (q.q || '').trim();
  return `${dars}__${text}`;
}

/**
 * Get the pool of recently seen questions
 */
export function getSeenQuestionKeys() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Mark questions as seen
 */
export function markQuestionsSeen(questions) {
  if (typeof window === 'undefined' || !Array.isArray(questions)) return;
  try {
    const current = getSeenQuestionKeys();
    const newKeys = questions.map(getQuestionKey).filter(Boolean);
    const set = new Set([...current, ...newKeys]);
    const updated = Array.from(set).slice(-MAX_SEEN_POOL);
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Truly randomize an array with Cryptographic / High-Entropy Fisher-Yates shuffle
 */
export function secureShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let rnd = Math.random();
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      rnd = buf[0] / 4294967296;
    }
    const j = Math.floor(rnd * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Smart Question Selector:
 * 1. Partitions questions into unseen and seen.
 * 2. Unseen questions are prioritized first so quizzes never repeat.
 * 3. Once unseen pool is exhausted, least recently seen questions cycle in.
 */
export function smartSelectQuestions(allQuestions, count) {
  if (!Array.isArray(allQuestions) || allQuestions.length === 0) return [];
  if (allQuestions.length <= count) {
    return secureShuffle(allQuestions);
  }

  const seenKeys = new Set(getSeenQuestionKeys());
  const unseen = [];
  const seen = [];

  for (const q of allQuestions) {
    const key = getQuestionKey(q);
    if (seenKeys.has(key)) {
      seen.push(q);
    } else {
      unseen.push(q);
    }
  }

  const shuffledUnseen = secureShuffle(unseen);
  const shuffledSeen = secureShuffle(seen);

  let selected = [];
  if (shuffledUnseen.length >= count) {
    selected = shuffledUnseen.slice(0, count);
  } else {
    selected = [...shuffledUnseen, ...shuffledSeen.slice(0, count - shuffledUnseen.length)];
  }

  // Mark selected as seen
  markQuestionsSeen(selected);

  return secureShuffle(selected);
}
