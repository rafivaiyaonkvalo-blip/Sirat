// SuperUser verification and unlock utility
export const SUPER_USER_EMAIL = 'rafi.vaiya.onk.valo@gmail.com';

// ব্রাউজারের localStorage যে কেউ বদলাতে পারে, তাই সেখান থেকে সুপার-ইউজার চেনা হয় না।
// শুধু Firebase-এর যাচাইকৃত লগইন (ইমেইল verified) অথবা এই ট্যাবের চলতি অ্যাডমিন সেশনই গ্রহণযোগ্য।
let verifiedSuper = false;

function matchesSuperUser(user) {
  const email = user && user.email;
  return Boolean(
    email &&
    typeof email === 'string' &&
    email.toLowerCase().trim() === SUPER_USER_EMAIL &&
    user.emailVerified === true
  );
}

/**
 * লগইন অবস্থা বদলালে (App-এর auth listener থেকে) ডাকা হয়; null দিলে সুপার-ইউজার অবস্থা মুছে যায়
 */
export function setVerifiedSuperUser(user) {
  verifiedSuper = matchesSuperUser(user);
}

/**
 * Check if the given user or current session belongs to the superuser
 */
export function isSuperUser(user) {
  if (user && typeof user === 'object' && matchesSuperUser(user)) return true;
  if (verifiedSuper) return true;

  // অ্যাডমিন সেশন শুধু sessionStorage-এ (ট্যাব বন্ধ করলে শেষ)
  if (typeof window !== 'undefined') {
    try {
      if (sessionStorage.getItem('uls_admin_authenticated') === 'true') return true;
    } catch (e) {}
  }
  return false;
}

/**
 * Fully populates localStorage with 100% completed progress for all lessons and tamrins
 */
export function generateSuperUserProgress(lessonsList = [], tamrinsList = [], getDynamicLessonStages) {
  const fullLessonsProgress = {};
  lessonsList.forEach((lesson) => {
    const stages = getDynamicLessonStages ? getDynamicLessonStages(lesson) : (lesson.bookStages || []);
    const stageIds = stages.map(s => s.id);
    fullLessonsProgress[lesson.id] = {
      completed: true,
      completedSubUnits: stageIds,
      stars: 3,
      score: 100,
      lastSubUnitCompleted: stageIds[stageIds.length - 1] || 'tamrin_quiz',
      completedAt: new Date().toISOString()
    };
  });

  const fullTamrinProgress = {};
  tamrinsList.forEach((tamrin) => {
    fullTamrinProgress[tamrin.id] = {
      completed: true,
      stars: 3,
      score: 100,
      completedAt: new Date().toISOString()
    };
  });

  return { fullLessonsProgress, fullTamrinProgress };
}

/**
 * Applies unlock to localStorage and dispatches progress change event
 */
export function applySuperUserUnlock(lessonsList = [], tamrinsList = [], getDynamicLessonStages) {
  const { fullLessonsProgress, fullTamrinProgress } = generateSuperUserProgress(
    lessonsList,
    tamrinsList,
    getDynamicLessonStages
  );

  try {
    localStorage.setItem('uls_lessons_progress', JSON.stringify(fullLessonsProgress));
    localStorage.setItem('uls_tamrin_progress', JSON.stringify(fullTamrinProgress));
    localStorage.setItem('uls_eso_level', '3');
    localStorage.setItem('uls_tamrin_part', '4');
    localStorage.setItem('uls_unlocked_super_user', SUPER_USER_EMAIL);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_progress_changed'));
    }
  } catch (err) {
    console.error('Failed to save superuser progress:', err);
  }

  return { fullLessonsProgress, fullTamrinProgress };
}
