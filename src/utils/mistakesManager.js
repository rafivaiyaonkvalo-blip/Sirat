/**
 * mistakesManager.js
 * ULS Arabic — "ভুল" (My Mistakes Notebook / Spaced Repetition Engine)
 * 
 * Rules:
 * - Capture mistakes from Lessons, Quizzes, Flashcards, Practice, Spelling, and Exams.
 * - 3 Consecutive Correct Answers Rule (৩ বার শুদ্ধ হলে সমাধান/মাস্টার্ড ঘোষণা)।
 * - Offline-first (localStorage) with Firebase Firestore automatic cloud sync.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const STORAGE_KEY = 'uls_mistakes_v1';
const CLOUD_SYNC_DEBOUNCE_MS = 1500;
let cloudSyncTimeout = null;

// Unique Key Generator for items
export function generateMistakeId(item) {
  if (item.id) return String(item.id);
  const base = item.arabic || item.question || item.bengali || 'item';
  // simple hash
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = ((hash << 5) - hash) + base.charCodeAt(i);
    hash |= 0;
  }
  return `m_${item.type || 'gen'}_${Math.abs(hash)}`;
}

/**
 * Read all recorded mistakes from localStorage
 */
export function getMistakes() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error reading mistakes from storage:', e);
    return [];
  }
}

/**
 * Save all mistakes to localStorage and notify all listeners
 */
export function saveMistakes(mistakes, currentUser = null) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
    window.dispatchEvent(new CustomEvent('uls_mistakes_updated', {
      detail: { count: getPendingMistakesCount(mistakes), mistakes }
    }));
  } catch (e) {
    console.warn('Error saving mistakes to storage:', e);
  }

  // Trigger cloud sync if user is present
  if (currentUser) {
    scheduleCloudSync(currentUser, mistakes);
  }
}

/**
 * Get list of pending (unresolved) mistakes
 */
export function getPendingMistakes(list = null) {
  const all = list || getMistakes();
  return all.filter(m => m.status !== 'mastered');
}

/**
 * Get count of pending mistakes
 */
export function getPendingMistakesCount(list = null) {
  return getPendingMistakes(list).length;
}

/**
 * Get list of mastered (successfully corrected 3 times) mistakes
 */
export function getMasteredMistakes(list = null) {
  const all = list || getMistakes();
  return all.filter(m => m.status === 'mastered');
}

/**
 * Record a mistake (from quiz, exam, flashcard, spelling, etc.)
 */
export function recordMistake({
  id = null,
  type = 'word', // 'word' | 'sentence' | 'quiz' | 'spelling' | 'tamrin'
  arabic = '',
  bengali = '',
  question = '',
  options = [],
  correctIndex = 0,
  correctText = '',
  sourceTitle = '',
  volumeId = null,
  chapterId = null,
  lessonId = null,
  user = null
}) {
  if (!arabic && !question && !bengali) return null;

  const mistakes = getMistakes();
  const mistakeId = id ? String(id) : generateMistakeId({ id, type, arabic, bengali, question });

  const existingIdx = mistakes.findIndex(m => m.id === mistakeId);
  const now = Date.now();

  let updatedItem;

  if (existingIdx >= 0) {
    const existing = mistakes[existingIdx];
    updatedItem = {
      ...existing,
      mistakeCount: (existing.mistakeCount || 1) + 1,
      consecutiveCorrect: 0, // Reset progress back to 0 on failure
      status: 'pending',
      lastFailedAt: now,
      // Update options/text if fresh info is available
      arabic: arabic || existing.arabic,
      bengali: bengali || existing.bengali,
      question: question || existing.question,
      options: options && options.length ? options : existing.options,
      correctIndex: correctIndex !== undefined ? correctIndex : existing.correctIndex,
      correctText: correctText || existing.correctText || bengali,
      sourceTitle: sourceTitle || existing.sourceTitle
    };
    mistakes[existingIdx] = updatedItem;
  } else {
    updatedItem = {
      id: mistakeId,
      type,
      arabic: (arabic || '').trim(),
      bengali: (bengali || '').trim(),
      question: (question || '').trim(),
      options: options || [],
      correctIndex: correctIndex ?? 0,
      correctText: (correctText || bengali || arabic || '').trim(),
      sourceTitle: sourceTitle || 'অনুশীলন',
      volumeId,
      chapterId,
      lessonId,
      mistakeCount: 1,
      consecutiveCorrect: 0,
      addedAt: now,
      lastFailedAt: now,
      lastReviewedAt: null,
      status: 'pending'
    };
    // New items at the beginning
    mistakes.unshift(updatedItem);
  }

  saveMistakes(mistakes, user);
  return updatedItem;
}

/**
 * Record a SUCCESSFUL answer during Mistakes Revision
 * Rule: Needs 3 consecutive correct answers to become 'mastered'
 */
export function recordMistakeSuccess(id, user = null) {
  const mistakes = getMistakes();
  const idx = mistakes.findIndex(m => m.id === String(id));
  if (idx < 0) return { mastered: false, consecutiveCorrect: 0 };

  const item = mistakes[idx];
  const newConsecutive = (item.consecutiveCorrect || 0) + 1;
  const isMastered = newConsecutive >= 3;

  mistakes[idx] = {
    ...item,
    consecutiveCorrect: newConsecutive,
    status: isMastered ? 'mastered' : 'pending',
    masteredAt: isMastered ? Date.now() : item.masteredAt,
    lastReviewedAt: Date.now()
  };

  saveMistakes(mistakes, user);
  return { mastered: isMastered, consecutiveCorrect: newConsecutive, item: mistakes[idx] };
}

/**
 * Record a FAILED answer during Mistakes Revision
 * Rule: Resets consecutiveCorrect counter to 0!
 */
export function recordMistakeFailure(id, user = null) {
  const mistakes = getMistakes();
  const idx = mistakes.findIndex(m => m.id === String(id));
  if (idx < 0) return null;

  const item = mistakes[idx];
  mistakes[idx] = {
    ...item,
    consecutiveCorrect: 0, // Reset to 0
    mistakeCount: (item.mistakeCount || 1) + 1,
    status: 'pending',
    lastFailedAt: Date.now(),
    lastReviewedAt: Date.now()
  };

  saveMistakes(mistakes, user);
  return mistakes[idx];
}

/**
 * Delete a specific mistake item
 */
export function removeMistake(id, user = null) {
  const mistakes = getMistakes().filter(m => m.id !== String(id));
  saveMistakes(mistakes, user);
  return mistakes;
}

/**
 * Clear all mastered items from archive
 */
export function clearAllMastered(user = null) {
  const mistakes = getMistakes().filter(m => m.status !== 'mastered');
  saveMistakes(mistakes, user);
  return mistakes;
}

/**
 * Reset all mistakes back to pending 0
 */
export function resetAllMistakes(user = null) {
  const mistakes = getMistakes().map(m => ({
    ...m,
    status: 'pending',
    consecutiveCorrect: 0
  }));
  saveMistakes(mistakes, user);
  return mistakes;
}

/* =========================================================
   Cloud Synchronization (Firestore)
   ========================================================= */

function scheduleCloudSync(user, mistakes) {
  if (!user || !db) return;
  if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
  cloudSyncTimeout = setTimeout(async () => {
    try {
      await syncMistakesToCloud(user, mistakes);
    } catch (e) {
      console.warn('Background mistakes cloud sync error:', e);
    }
  }, CLOUD_SYNC_DEBOUNCE_MS);
}

export async function syncMistakesToCloud(user, mistakes = null) {
  if (!user || !db) return;
  try {
    const list = mistakes || getMistakes();
    const userRef = doc(db, 'users', user.uid);
    // Keep top 300 active/recent mistakes to preserve Firestore doc limits
    const payload = list.slice(0, 300);
    await setDoc(userRef, {
      mistakes_notebook: payload,
      mistakes_updated_at: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync mistakes to cloud:', err);
  }
}

export async function loadMistakesFromCloud(user) {
  if (!user || !db) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const cloudMistakes = data.mistakes_notebook;
      if (Array.isArray(cloudMistakes) && cloudMistakes.length > 0) {
        const localMistakes = getMistakes();
        // Merge cloud with local (prefer item with highest mistakeCount or latest date)
        const map = new Map();
        cloudMistakes.forEach(m => map.set(m.id, m));
        localMistakes.forEach(m => {
          if (!map.has(m.id)) {
            map.set(m.id, m);
          } else {
            const cloudItem = map.get(m.id);
            if ((m.lastFailedAt || 0) > (cloudItem.lastFailedAt || 0)) {
              map.set(m.id, m);
            }
          }
        });
        const merged = Array.from(map.values());
        saveMistakes(merged, null); // Don't trigger cloud loop
        return merged;
      }
    }
  } catch (err) {
    console.warn('Failed to load mistakes from cloud:', err);
  }
  return getMistakes();
}
