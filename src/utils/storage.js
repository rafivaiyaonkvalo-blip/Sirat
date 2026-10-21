// LocalStorage persistence helpers for ULS Arabic

const STARRED_KEY = 'uls_arabic_starred';
const MASTERED_KEY = 'uls_arabic_mastered';
const REVIEW_KEY = 'uls_arabic_review';
const EXAM_HISTORY_KEY = 'uls_arabic_exam_history';

export function getStarredIds() {
  try {
    const raw = localStorage.getItem(STARRED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleStarredId(id) {
  try {
    const list = getStarredIds();
    const idx = list.indexOf(id);
    let updated;
    if (idx >= 0) {
      updated = list.filter(item => item !== id);
    } else {
      updated = [...list, id];
    }
    localStorage.setItem(STARRED_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_progress_changed'));
    }
    return updated;
  } catch (e) {
    return [];
  }
}

export function getMasteredIds() {
  try {
    const raw = localStorage.getItem(MASTERED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function setMasteredId(id, isMastered) {
  try {
    const mastered = getMasteredIds();
    const review = getReviewIds();
    let updatedMastered, updatedReview;

    if (isMastered) {
      if (mastered.includes(id)) {
        // Toggle off if already mastered
        updatedMastered = mastered.filter(item => item !== id);
        updatedReview = review.filter(item => item !== id);
      } else {
        updatedMastered = [...new Set([...mastered, id])];
        updatedReview = review.filter(item => item !== id);
      }
    } else {
      if (review.includes(id)) {
        // Toggle off if already in review
        updatedReview = review.filter(item => item !== id);
        updatedMastered = mastered.filter(item => item !== id);
      } else {
        updatedMastered = mastered.filter(item => item !== id);
        updatedReview = [...new Set([...review, id])];
      }
    }

    localStorage.setItem(MASTERED_KEY, JSON.stringify(updatedMastered));
    localStorage.setItem(REVIEW_KEY, JSON.stringify(updatedReview));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_progress_changed'));
    }
    return { mastered: updatedMastered, review: updatedReview };
  } catch (e) {
    return { mastered: [], review: [] };
  }
}

export function getReviewIds() {
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveExamResult(result) {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('bn-BD'),
      ...result
    };
    const updated = [newEntry, ...history].slice(0, 30); // Keep last 30 exams
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_progress_changed'));
    }
    return updated;
  } catch (e) {
    return [];
  }
}

export function getExamHistory() {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

const SHOW_ENGLISH_KEY = 'uls_show_english';

export function getShowEnglish() {
  try {
    return localStorage.getItem(SHOW_ENGLISH_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setShowEnglish(val) {
  try {
    localStorage.setItem(SHOW_ENGLISH_KEY, val ? 'true' : 'false');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_english_preference_changed', { detail: { showEnglish: !!val } }));
    }
    return !!val;
  } catch (e) {
    return false;
  }
}

export function toggleShowEnglish() {
  const current = getShowEnglish();
  return setShowEnglish(!current);
}
