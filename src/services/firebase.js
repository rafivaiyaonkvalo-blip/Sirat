// Firebase Client configuration & Cloud Sync Service
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  linkWithCredential,
  linkWithPopup
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { XP_SCALE_VERSION, LEGACY_XP_MULTIPLIER } from '../utils/gamification';
import { isSuperUser } from '../utils/superUser';
import { 
  sanitizeUserDataForCloudSync, 
  saveSignedXp, 
  auditAndRecoverLocalXp 
} from '../utils/xpIntegrity';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Guarantee session persistence across browser restarts
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Firebase persistence warning:', err);
    });
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('Firebase initialization skipped or failed:', err);
  }
}

export { auth, db };

// Auth helpers
export async function loginWithGoogle() {
  if (!auth || !googleProvider) {
    throw new Error('ফায়ারবেস কনফিগারেশন সেট করা নেই।');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user && db) {
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          displayName: result.user.displayName || '',
          email: result.user.email || '',
          photoURL: result.user.photoURL || '',
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Initial user profile write warning:', e);
      }
    }
    return result.user;
  } catch (err) {
    if (err.code === 'auth/account-exists-with-different-credential') {
      const pendingCredential = GoogleAuthProvider.credentialFromError(err);
      const email = err.customData?.email || err.email || '';
      const customErr = new Error(`আপনার এই ইমেইলটি (${email}) পূর্বে পাসওয়ার্ড দিয়ে তৈরি করা হয়েছিল। আপনার পাসওয়ার্ড দিয়ে একবার সাইন ইন করলেই গুগল ও পাসওয়ার্ড দুটি স্বয়ংক্রিয়ভাবে সংযুক্ত (Link) হয়ে যাবে।`);
      customErr.code = 'auth/account-exists-with-different-credential';
      customErr.pendingCredential = pendingCredential;
      customErr.email = email;
      throw customErr;
    } else if (err.code === 'auth/popup-blocked') {
      throw new Error('ব্রাউজারের পপআপ ব্লকার সক্রিয় আছে। অনুগ্রহ করে পপআপ অনুমোদিত করুন অথবা ইমেইল দিয়ে প্রবেশ করুন।');
    } else if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('লগইন পপআপ উইন্ডো বন্ধ করা হয়েছে।');
    } else if (err.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'ডোমেইন';
      throw new Error(`এই ডোমেইনটি (${currentHost}) ফায়ারবেস কনসোলে অনুমোদিত (Authorized) করা নেই। Firebase Console > Authentication > Settings > Authorized domains-এ "${currentHost}" যোগ করুন।`);
    }
    throw err;
  }
}

// পূর্বে তৈরি পাসওয়ার্ড একাউন্টের সাথে নতুন গুগল ক্রেডেনশিয়াল লিঙ্ক করা
export async function linkPendingGoogleCredential(email, password, pendingCredential) {
  if (!auth) throw new Error('ফায়ারবেস কনফিগারেশন সেট করা নেই।');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  if (pendingCredential && userCredential.user) {
    try {
      await linkWithCredential(userCredential.user, pendingCredential);
    } catch (linkErr) {
      console.warn('Google credential auto-link warning:', linkErr);
    }
  }
  return userCredential.user;
}

// Google বা অন্য যেকোনো প্রোভাইডার দিয়ে লগইন থাকা অবস্থায় অ্যাকাউন্টে নতুন পাসওয়ার্ড সেট করা
export async function setPasswordForCurrentUser(newPassword) {
  const current = auth?.currentUser;
  if (!current) {
    throw new Error('অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে লগইন করুন।');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
  }
  await updatePassword(current, newPassword);
  return true;
}

// ইমেইল/পাসওয়ার্ড একাউন্টের সাথে সরাসরি Google একাউন্ট সংযুক্ত (Link) করা
export async function linkGoogleAccount(currentUser) {
  const current = currentUser || auth?.currentUser;
  if (!current || !googleProvider) {
    throw new Error('ব্যবহারকারী লগইন অবস্থায় নেই অথবা ফায়ারবেস কনফিগারেশন সেট করা নেই।');
  }
  const result = await linkWithPopup(current, googleProvider);
  return result.user;
}

// ইউজারের সংযুক্ত প্রোভাইডারসমূহ জানা (যেমন: google.com, password ইত্যাদি)
export function getUserProviders(user) {
  const current = user || auth?.currentUser;
  if (!current || !Array.isArray(current.providerData)) {
    return { hasGoogle: false, hasPassword: false, providers: [] };
  }
  const providerIds = current.providerData.map(p => p.providerId);
  return {
    hasGoogle: providerIds.includes('google.com'),
    hasPassword: providerIds.includes('password'),
    providers: providerIds
  };
}

export async function loginWithEmail(email, password) {
  if (!auth) {
    throw new Error('ফায়ারবেস কনফিগারেশন সেট করা নেই।');
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email, password, displayName = '') {
  if (!auth) {
    throw new Error('ফায়ারবেস কনফিগারেশন সেট করা নেই।');
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && result.user) {
    try {
      await updateProfile(result.user, { displayName });
    } catch (e) {
      console.warn('Display name update warning:', e);
    }
  }
  if (result.user && db) {
    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        displayName: displayName || result.user.displayName || '',
        email: email || result.user.email || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Initial register user profile write warning:', e);
    }
  }
  return result.user;
}

export async function resetPassword(email) {
  if (!auth) {
    throw new Error('ফায়ারবেস কনফিগারেশন সেট করা নেই।');
  }
  await sendPasswordResetEmail(auth, email);
}

// বর্তমান পাসওয়ার্ড দিয়ে আবার যাচাই করে নতুন পাসওয়ার্ড বসানো (ইমেইল-পাসওয়ার্ড অ্যাকাউন্টের জন্য)
export async function changePassword(currentPassword, newPassword) {
  const current = auth?.currentUser;
  if (!current || !current.email) {
    throw new Error('অ্যাকাউন্ট পাওয়া যায়নি। আবার লগইন করুন।');
  }
  const credential = EmailAuthProvider.credential(current.email, currentPassword);
  await reauthenticateWithCredential(current, credential);
  await updatePassword(current, newPassword);
}

// স্থানীয় প্রগ্রেস ও ইউজার ডেটা সম্পূর্ণ মুছে ফেলা (লগআউটের সময় বা অন্য অ্যাকাউন্ট পরিবর্তনের সময়)
export function clearLocalUserData() {
  const keysToRemove = [
    'uls_lessons_progress',
    'uls_tamrin_progress',
    'uls_arabic_starred',
    'uls_arabic_mastered',
    'uls_arabic_review',
    'uls_arabic_exam_history',
    'uls_total_xp',
    'uls_xp_sig',
    'uls_xp_history',
    'uls_xp_scale_version',
    'uls_daily_streak_data',
    'uls_student_profile',
    'uls_unlocked_super_user',
    'uls_current_user_uid',
    'uls_eso_level',
    'uls_tamrin_part',
    'uls_lessons_mode'
  ];
  keysToRemove.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });

  // নির্দিষ্ট দারস বা তামরিনের URL প্যারামিটার পরিষ্কার করা
  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('lesson') || url.searchParams.has('tamrin')) {
        url.searchParams.delete('lesson');
        url.searchParams.delete('tamrin');
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('uls_progress_changed'));
  }
}

export async function logoutUser(userToSync) {
  const current = userToSync || auth?.currentUser;
  if (current && db) {
    try {
      const currentUid = localStorage.getItem('uls_current_user_uid');
      if (currentUid === current.uid) {
        // লগআউটের ঠিক পূর্বে ইউজারের সর্বশেষ প্রগ্রেস ক্লাউডে সেভ করা
        await syncUserDataToCloud(current);
      }
    } catch (e) {
      console.warn('Sync before logout error:', e);
    }
  }

  // ব্রাউজারের লোকাল স্টোরেজ সম্পূর্ণ ক্লিন করা
  clearLocalUserData();

  if (auth) {
    await signOut(auth);
  }
}

export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Cloud Data Synchronization
export async function syncUserDataToCloud(user) {
  if (!db || !user?.uid) return false;
  // অফলাইনে থাকলে ক্লাউড সিঙ্ক স্কিপ করা
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    const currentUid = localStorage.getItem('uls_current_user_uid');
    // কঠোর নিরাপত্তা গার্ড: লোকাল স্টোরেজ যদি বর্তমান ইউজারের আইডি বহন না করে, তবে কোনো অবস্থাতেই ক্লাউডে পুশ করা যাবে না
    if (!currentUid || currentUid !== user.uid) {
      console.warn('Sync aborted: localStorage UID does not match user UID', { currentUid, userUid: user.uid });
      return false;
    }

    const rawXp = auditAndRecoverLocalXp();
    const dataToSync = {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      lessonsProgress: JSON.parse(localStorage.getItem('uls_lessons_progress') || '{}'),
      tamrinProgress: JSON.parse(localStorage.getItem('uls_tamrin_progress') || '{}'),
      starred: JSON.parse(localStorage.getItem('uls_arabic_starred') || '[]'),
      mastered: JSON.parse(localStorage.getItem('uls_arabic_mastered') || '[]'),
      review: JSON.parse(localStorage.getItem('uls_arabic_review') || '[]'),
      examHistory: JSON.parse(localStorage.getItem('uls_arabic_exam_history') || '[]'),
      totalXp: rawXp,
      xpScaleVersion: XP_SCALE_VERSION,
      xpHistory: JSON.parse(localStorage.getItem('uls_xp_history') || '{}'),
      streakData: JSON.parse(localStorage.getItem('uls_daily_streak_data') || '{}'),
      studentProfile: JSON.parse(localStorage.getItem('uls_student_profile') || '{}'),
      updatedAt: new Date().toISOString()
    };
    // অ্যান্টি-চিট সিলিং ও স্যানিটাইজেশন প্রয়োগ
    const sanitizedData = sanitizeUserDataForCloudSync(dataToSync);
    await setDoc(doc(db, 'users', user.uid), sanitizedData, { merge: true });
    return true;
  } catch (err) {
    console.warn('Cloud sync save error:', err);
    return false;
  }
}

// প্রোফাইলের নাম বদলানো: লগইন অ্যাকাউন্টের নাম ও ক্লাউড দুই জায়গাতেই
export async function updateDisplayName(user, name) {
  if (!user) return null;
  const current = auth?.currentUser;
  if (current && current.uid === user.uid) {
    await updateProfile(current, { displayName: name });
  }
  if (db && user.uid) {
    await setDoc(doc(db, 'users', user.uid), { displayName: name, updatedAt: new Date().toISOString() }, { merge: true });
  }
  // একই অবজেক্ট বদলালে React নতুন করে আঁকে না, তাই মেথডসহ নতুন কপি ফেরত দেওয়া হয়
  const source = current && current.uid === user.uid ? current : user;
  return Object.assign(Object.create(Object.getPrototypeOf(source)), source, { displayName: name });
}

export async function saveStudentProfileToCloud(user, profileData) {
  if (!user) return false;
  try {
    localStorage.setItem('uls_student_profile', JSON.stringify(profileData));
    if (db && user.uid) {
      await setDoc(doc(db, 'users', user.uid), {
        studentProfile: profileData,
        displayName: user.displayName || profileData.name || '',
        email: user.email || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_progress_changed'));
    }
    return true;
  } catch (err) {
    console.warn('Error saving student profile:', err);
    return false;
  }
}

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function loadUserDataFromCloud(user) {
  if (!db || !user?.uid) return null;
  // অফলাইনে থাকলে বা নেটওয়ার্ক না থাকলে লোকাল স্টোরেজের প্রগ্রেস অক্ষত রাখা
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('Offline mode active: Preserving local progress for user', user.uid);
    return null;
  }
  try {
    const previousUid = localStorage.getItem('uls_current_user_uid');
    // যদি অন্য কোনো অ্যাকাউন্টের প্রগ্রেস লোকাল স্টোরেজে থেকে থাকে, তবে অ্যাকাউন্ট মিক্সিং রোধে তা সাফ করা
    if (previousUid && previousUid !== user.uid) {
      clearLocalUserData();
    }

    const docRef = doc(db, 'users', user.uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const cloudData = snap.data();
      const rawCloudXp = parseInt(cloudData.totalXp || '0', 10);
      const cloudXp = cloudData.xpScaleVersion === XP_SCALE_VERSION ? rawCloudXp : rawCloudXp * LEGACY_XP_MULTIPLIER;

      // ক্লাউডের ডেটাই ১০০% মূল সত্য — লোকাল স্টোরেজে সরাসরি ওভাররাইট করা হচ্ছে
      localStorage.setItem('uls_lessons_progress', JSON.stringify(cloudData.lessonsProgress || {}));
      localStorage.setItem('uls_tamrin_progress', JSON.stringify(cloudData.tamrinProgress || {}));
      localStorage.setItem('uls_arabic_starred', JSON.stringify(Array.isArray(cloudData.starred) ? cloudData.starred : []));
      localStorage.setItem('uls_arabic_mastered', JSON.stringify(Array.isArray(cloudData.mastered) ? cloudData.mastered : []));
      localStorage.setItem('uls_arabic_review', JSON.stringify(Array.isArray(cloudData.review) ? cloudData.review : []));
      localStorage.setItem('uls_arabic_exam_history', JSON.stringify(Array.isArray(cloudData.examHistory) ? cloudData.examHistory : []));
      localStorage.setItem('uls_total_xp', String(cloudXp));
      localStorage.setItem('uls_xp_scale_version', String(XP_SCALE_VERSION));
      saveSignedXp(cloudXp, cloudData.streakData?.count || 1, user.uid);
      localStorage.setItem('uls_xp_history', JSON.stringify(cloudData.xpHistory && typeof cloudData.xpHistory === 'object' ? cloudData.xpHistory : {}));
      localStorage.setItem('uls_daily_streak_data', JSON.stringify(cloudData.streakData && typeof cloudData.streakData === 'object' ? cloudData.streakData : { count: 1, lastActiveDate: getTodayDateString() }));
      localStorage.setItem('uls_student_profile', JSON.stringify(cloudData.studentProfile && typeof cloudData.studentProfile === 'object' ? cloudData.studentProfile : {}));

      // সক্রিয় ইউজার আইডি লোকাল স্টোরেজে সংরক্ষণ
      localStorage.setItem('uls_current_user_uid', user.uid);

      // পূর্ববর্তী অ্যাকাউন্টের ভলিউম ও পার্ট রিসেট করা
      localStorage.removeItem('uls_eso_level');
      localStorage.removeItem('uls_tamrin_part');

      if (!isSuperUser(user)) {
        localStorage.removeItem('uls_unlocked_super_user');
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uls_progress_changed'));
      }
      return cloudData;
    } else {
      // নতুন অ্যাকাউন্ট: শিক্ষার্থী যদি লগইনের আগে অফলাইনে/গেস্টে কিছু পড়ে থাকে, তা মুছে না ফেলে নতুন অ্যাকাউন্টে ব্যাকআপ করা
      localStorage.setItem('uls_current_user_uid', user.uid);
      localStorage.setItem('uls_xp_scale_version', String(XP_SCALE_VERSION));

      await syncUserDataToCloud(user);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uls_progress_changed'));
      }
      return {};
    }
  } catch (err) {
    console.warn('Cloud sync load error (fallback to local data):', err);
  }
  return null;
}


