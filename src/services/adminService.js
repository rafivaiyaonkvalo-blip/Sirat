import { db, auth } from './firebase';
import { hashPin } from '../utils/pinHash';
import { 
  calculateMaxPlausibleXp, 
  calculateLegitimateXpFromProgress 
} from '../utils/xpIntegrity';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  limit 
} from 'firebase/firestore';

const ADMIN_STORAGE_KEY = 'uls_admin_authenticated';
// নিজের দেওয়া পাসওয়ার্ড শুধু হ্যাশ আকারে রাখা হয় (আগে সরাসরি লেখা থাকত 'uls_admin_pin'-এ)
const ADMIN_PIN_HASH_KEY = 'uls_admin_pin_hash';
const LEGACY_PIN_KEY = 'uls_admin_pin';
// মূল অ্যাডমিন পাসওয়ার্ড (আগের দুটি) — শুধু হ্যাশ, পাসওয়ার্ড কোডে নেই
const DEFAULT_PIN_HASHES = [
  '630be34bd872529d7f834892e5e45c258356460c48ba482e37fe3e0cef68a77c',
  '20ecdb62fc3ad78ecce7f43057b71ec3b223bab8efa79d692983a2527d78eaa5'
];

// -------------------------------------------------------------
// 1. Admin Authentication & Session Management
// -------------------------------------------------------------

// আগে ব্রাউজারে সরাসরি লেখা নিজস্ব পাসওয়ার্ড থাকলে তা হ্যাশে বদলে মূল লেখা মুছে ফেলা
async function migrateLegacyPin() {
  try {
    const legacy = localStorage.getItem(LEGACY_PIN_KEY);
    if (legacy === null) return;
    localStorage.removeItem(LEGACY_PIN_KEY);
    const legacyHash = await hashPin(legacy.trim());
    if (legacy.trim() && !DEFAULT_PIN_HASHES.includes(legacyHash) && !localStorage.getItem(ADMIN_PIN_HASH_KEY)) {
      localStorage.setItem(ADMIN_PIN_HASH_KEY, legacyHash);
    }
  } catch (e) {}
}

export async function verifyAdminPin(inputPin) {
  const trimmed = inputPin ? inputPin.trim() : '';
  if (!trimmed || typeof window === 'undefined') return false;
  await migrateLegacyPin();
  const h = await hashPin(trimmed);
  let customHash = null;
  try {
    customHash = localStorage.getItem(ADMIN_PIN_HASH_KEY);
  } catch (e) {}
  return DEFAULT_PIN_HASHES.includes(h) || (!!customHash && h === customHash);
}

export async function setCustomAdminPin(newPin) {
  if (typeof window === 'undefined') return;
  if (!newPin || newPin.trim().length < 4) {
    throw new Error('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।');
  }
  const h = await hashPin(newPin.trim());
  try {
    localStorage.setItem(ADMIN_PIN_HASH_KEY, h);
    localStorage.removeItem(LEGACY_PIN_KEY);
  } catch (e) {}
}

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function startAdminSession() {
  try {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  } catch (e) {}
}

export async function verifyAndLoginAdmin(inputPin) {
  if (await verifyAdminPin(inputPin)) {
    startAdminSession();
    return true;
  }
  return false;
}

export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {}
  }
}

// -------------------------------------------------------------
// 2. User Reports Management (Firestore + LocalStorage fallback)
// -------------------------------------------------------------
export async function fetchAllReports() {
  const reportsList = [];
  const reportIds = new Set();

  // 1. Try fetching from Cloud Firestore
  if (db) {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        reportsList.push({
          docId: docSnap.id,
          ...data,
          isCloud: true
        });
        reportIds.add(data.id || docSnap.id);
      });
    } catch (err) {
      console.warn('Firestore fetch reports error (fallback to local):', err);
    }
  }

  // 2. Load and merge from LocalStorage
  try {
    const local = JSON.parse(localStorage.getItem('uls_user_reports') || '[]');
    local.forEach((rep) => {
      if (!reportIds.has(rep.id)) {
        reportsList.push({
          ...rep,
          isCloud: false
        });
        reportIds.add(rep.id);
      }
    });
  } catch (err) {
    console.warn('Local reports read error:', err);
  }

  // Sort by date descending
  return reportsList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function updateReportStatus(report, newStatus) {
  // Update in cloud if available
  if (report.docId && db) {
    try {
      const docRef = doc(db, 'reports', report.docId);
      await updateDoc(docRef, { 
        status: newStatus, 
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      console.warn('Cloud update report error:', err);
    }
  }

  // Update in localStorage
  try {
    const local = JSON.parse(localStorage.getItem('uls_user_reports') || '[]');
    const idx = local.findIndex(r => r.id === report.id);
    if (idx !== -1) {
      local[idx].status = newStatus;
      local[idx].updatedAt = new Date().toISOString();
      localStorage.setItem('uls_user_reports', JSON.stringify(local));
    }
  } catch (err) {
    console.warn('Local update report error:', err);
  }

  return true;
}

export async function deleteReportItem(report) {
  // Delete from cloud
  if (report.docId && db) {
    try {
      await deleteDoc(doc(db, 'reports', report.docId));
    } catch (err) {
      console.warn('Cloud delete report error:', err);
    }
  }

  // Delete from local
  try {
    const local = JSON.parse(localStorage.getItem('uls_user_reports') || '[]');
    const filtered = local.filter(r => r.id !== report.id);
    localStorage.setItem('uls_user_reports', JSON.stringify(filtered));
  } catch (err) {
    console.warn('Local delete report error:', err);
  }

  return true;
}

// -------------------------------------------------------------
// 3. Tashkeel / Harakat Audit Engine (Rule: 100% Arabic Tashkeel)
// -------------------------------------------------------------
// Arabic Diacritics Unicode range:
// Fatha (064E), Damma (064F), Kasra (0650), Fathatan (064B), Dammatan (064C), Kasratan (064D),
// Sukun (0652), Shaddah (0651), Dagger Alif (0670), Maddah (0653), Hamza above/below etc.
const ARABIC_DIACRITICS_REGEX = /[\u064B-\u0652\u0670\u0653\u0654\u0655]/;
const ARABIC_LETTERS_REGEX = /[\u0621-\u064A\u0671]/g;

/**
 * Checks if an Arabic string has reasonable and full Tashkeel coverage.
 * Returns { score: number, isVowelled: boolean, missingRatio: number }
 */
export function auditArabicStringTashkeel(text) {
  if (!text || typeof text !== 'string') return { score: 100, isVowelled: true, count: 0 };

  // Strip punctuation and numbers
  const clean = text.replace(/[0-9٠-٩.,?!;:()[\]{}—\-«»"']/g, '').trim();
  const letters = clean.match(ARABIC_LETTERS_REGEX) || [];
  if (letters.length === 0) return { score: 100, isVowelled: true, count: 0 };

  // Count diacritics
  const diacritics = clean.match(new RegExp(ARABIC_DIACRITICS_REGEX.source, 'g')) || [];
  
  // In Arabic, almost every letter (except long vowels like ya/waw/alif or sukuns) has a harakat.
  // A ratio of diacritics to letters around 0.65 - 1.2 indicates rich, full Tashkeel.
  const ratio = diacritics.length / letters.length;
  const score = Math.min(100, Math.round((ratio / 0.75) * 100));

  return {
    score,
    isVowelled: score >= 60,
    lettersCount: letters.length,
    diacriticsCount: diacritics.length,
    ratio: Math.round(ratio * 100) / 100
  };
}

/**
 * Full Audit of all Lessons and Vocabulary
 */
export function runComprehensiveTashkeelAudit(lessonsData, vocabularyData) {
  const issues = [];
  let totalArabicItemsChecked = 0;
  let cleanItems = 0;

  // 1. Audit Vocabulary items
  if (Array.isArray(vocabularyData)) {
    vocabularyData.forEach((item) => {
      totalArabicItemsChecked++;
      const res = auditArabicStringTashkeel(item.arabic);
      if (!res.isVowelled) {
        issues.push({
          source: 'vocabulary',
          id: item.id,
          title: item.arabic,
          translation: item.meaning || item.bangla,
          details: `শব্দে পর্যাপ্ত হরকত পাওয়া যায়নি (স্কোর: ${res.score}%, অনুপাত: ${res.ratio})`,
          score: res.score
        });
      } else {
        cleanItems++;
      }
    });
  }

  // 2. Audit Lessons (sentences, dialogues, exercises)
  if (lessonsData && Array.isArray(lessonsData.lessons)) {
    lessonsData.lessons.forEach((les) => {
      // Check sentences
      (les.sentences || []).forEach((sent, idx) => {
        totalArabicItemsChecked++;
        const res = auditArabicStringTashkeel(sent.arabic);
        if (!res.isVowelled) {
          issues.push({
            source: 'lesson_sentence',
            lessonId: les.id,
            lessonTitle: les.title,
            title: sent.arabic,
            translation: sent.bangla,
            details: `বাক্যে হরকতের ঘাটতি (স্কোর: ${res.score}%, বাক্য নং: ${idx + 1})`,
            score: res.score
          });
        } else {
          cleanItems++;
        }
      });

      // Check dialogues
      (les.dialogues || []).forEach((dia, idx) => {
        totalArabicItemsChecked += 2;
        const qRes = auditArabicStringTashkeel(dia.question);
        const aRes = auditArabicStringTashkeel(dia.answer);

        if (!qRes.isVowelled) {
          issues.push({
            source: 'lesson_dialogue_question',
            lessonId: les.id,
            lessonTitle: les.title,
            title: dia.question,
            translation: dia.banglaQuestion,
            details: `কথোপকথনের প্রশ্নে হরকতের ঘাটতি (${idx + 1})`,
            score: qRes.score
          });
        } else cleanItems++;

        if (!aRes.isVowelled) {
          issues.push({
            source: 'lesson_dialogue_answer',
            lessonId: les.id,
            lessonTitle: les.title,
            title: dia.answer,
            translation: dia.banglaAnswer,
            details: `কথোপকথনের উত্তরে হরকতের ঘাটতি (${idx + 1})`,
            score: aRes.score
          });
        } else cleanItems++;
      });
    });
  }

  const overallHealth = totalArabicItemsChecked > 0 
    ? Math.round((cleanItems / totalArabicItemsChecked) * 100) 
    : 100;

  return {
    totalChecked: totalArabicItemsChecked,
    cleanCount: cleanItems,
    issueCount: issues.length,
    overallHealth,
    issues
  };
}

// -------------------------------------------------------------
// 4. 1-Click JSON Data Export Helper
// -------------------------------------------------------------
export function downloadJsonFile(data, filename) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// -------------------------------------------------------------
// 5. Website Usage Tracer & Analytics Service
// -------------------------------------------------------------
export function toBengaliNumber(num) {
  if (num === null || num === undefined) return '০';
  return String(num).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
}

export function formatDurationBn(seconds) {
  if (!seconds || seconds <= 0) return '০ সে.';
  const s = Math.round(seconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const remainingSecs = s % 60;

  if (hours > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা ${toBengaliNumber(minutes)} মি.`;
  }
  if (minutes > 0) {
    return `${toBengaliNumber(minutes)} মি. ${toBengaliNumber(remainingSecs)} সে.`;
  }
  return `${toBengaliNumber(remainingSecs)} সে.`;
}

export function formatRelativeTimeBn(isoString) {
  if (!isoString) return 'অজ্ঞাত সময়';
  const diffSec = Math.max(0, Math.round((Date.now() - new Date(isoString).getTime()) / 1000));
  
  if (diffSec < 45) return 'এইমাত্র (সক্রিয়)';
  if (diffSec < 300) return `${toBengaliNumber(Math.round(diffSec / 60))} মিনিট আগে`;
  if (diffSec < 3600) return `${toBengaliNumber(Math.round(diffSec / 60))} মিনিট আগে`;
  if (diffSec < 86400) return `${toBengaliNumber(Math.round(diffSec / 3600))} ঘণ্টা আগে`;
  return `${toBengaliNumber(Math.round(diffSec / 86400))} দিন আগে`;
}

/**
 * Fetch and aggregate website usage metrics
 * @param {'today' | 'yesterday' | '7d' | '30d' | 'all'} timeRange 
 */
export async function fetchAnalyticsOverview(timeRange = 'all') {
  const sessions = [];
  const sessionIds = new Set();

  // 1. Fetch sessions from Firestore
  if (db) {
    try {
      const q = query(collection(db, 'analytics_sessions'), orderBy('lastActiveAt', 'desc'), limit(300));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        sessions.push({
          docId: docSnap.id,
          ...data
        });
        sessionIds.add(docSnap.id);
      });
    } catch (err) {
      console.warn('Firestore analytics fetch warning:', err);
    }
  }

  // 2. Fallback / Merge with local session
  try {
    const local = localStorage.getItem('uls_tracer_my_session');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.sessionId && !sessionIds.has(parsed.sessionId)) {
        sessions.unshift(parsed);
      }
    }
  } catch (e) {}

  // 3. Filter by Time Range
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const yDate = new Date(now.getTime() - 86400000);
  const yesterdayStr = `${yDate.getFullYear()}-${String(yDate.getMonth() + 1).padStart(2, '0')}-${String(yDate.getDate()).padStart(2, '0')}`;
  
  const cutoff7d = new Date(now.getTime() - 7 * 86400000);
  const cutoff30d = new Date(now.getTime() - 30 * 86400000);

  const filtered = sessions.filter((s) => {
    if (!s.startedAt && !s.lastActiveAt) return true;
    const sessionDate = (s.startedAt || s.lastActiveAt || '').split('T')[0];
    const sessionTime = new Date(s.lastActiveAt || s.startedAt).getTime();

    if (timeRange === 'today') return sessionDate === todayStr;
    if (timeRange === 'yesterday') return sessionDate === yesterdayStr;
    if (timeRange === '7d') return sessionTime >= cutoff7d.getTime();
    if (timeRange === '30d') return sessionTime >= cutoff30d.getTime();
    return true; // 'all'
  });

  // 4. Calculate Aggregate Metrics
  let totalDurationSec = 0;
  let totalClicks = 0;
  const uniqueVisitors = new Set();
  let liveActiveCount = 0;

  // Feature usage breakdown
  let audioPlaysCount = 0;
  let lessonsInteractionsCount = 0;
  let tamrinInteractionsCount = 0;
  let quizActionsCount = 0;
  let searchesCount = 0;
  let pageViewsCount = 0;

  const liveThresholdMs = 3.5 * 60 * 1000; // গত সাড়ে তিন মিনিটে সক্রিয় থাকলে লাইভ

  filtered.forEach((sess) => {
    const dur = parseInt(sess.durationSeconds || 0, 10);
    const clicks = parseInt(sess.clicksCount || 0, 10);
    totalDurationSec += dur;
    totalClicks += clicks;

    if (sess.visitorId) uniqueVisitors.add(sess.visitorId);

    // লাইভ অ্যাক্টিভ চেক
    const lastActiveTime = new Date(sess.lastActiveAt || 0).getTime();
    const isLive = sess.isLive !== false && (Date.now() - lastActiveTime < liveThresholdMs);
    if (isLive) liveActiveCount++;

    // ইভেন্ট বিশ্লেষণ
    (sess.recentEvents || []).forEach((ev) => {
      if (ev.type === 'audio_play') audioPlaysCount++;
      else if (ev.type === 'lesson_open' || ev.type === 'lesson_interaction') lessonsInteractionsCount++;
      else if (ev.type === 'tamrin_open' || ev.type === 'tamrin_interaction') tamrinInteractionsCount++;
      else if (ev.type === 'quiz_answer' || ev.type === 'quiz_action') quizActionsCount++;
      else if (ev.type === 'search') searchesCount++;
      else if (ev.type === 'page_view') pageViewsCount++;
    });
  });

  const totalSessionsCount = filtered.length;
  const avgDurationSec = totalSessionsCount > 0 ? Math.round(totalDurationSec / totalSessionsCount) : 0;

  return {
    timeRange,
    totalSessions: totalSessionsCount,
    totalSessionsBn: toBengaliNumber(totalSessionsCount),
    totalDurationSec,
    totalDurationFormatted: formatDurationBn(totalDurationSec),
    totalClicks,
    totalClicksBn: toBengaliNumber(totalClicks),
    uniqueVisitorsCount: uniqueVisitors.size,
    uniqueVisitorsBn: toBengaliNumber(uniqueVisitors.size),
    liveActiveCount,
    liveActiveBn: toBengaliNumber(liveActiveCount),
    avgDurationSec,
    avgDurationFormatted: formatDurationBn(avgDurationSec),
    featureStats: {
      audioPlays: audioPlaysCount,
      audioPlaysBn: toBengaliNumber(audioPlaysCount),
      lessons: lessonsInteractionsCount,
      lessonsBn: toBengaliNumber(lessonsInteractionsCount),
      tamrins: tamrinInteractionsCount,
      tamrinsBn: toBengaliNumber(tamrinInteractionsCount),
      quizzes: quizActionsCount,
      quizzesBn: toBengaliNumber(quizActionsCount),
      searches: searchesCount,
      searchesBn: toBengaliNumber(searchesCount),
      pageViews: pageViewsCount,
      pageViewsBn: toBengaliNumber(pageViewsCount)
    },
    rawSessions: filtered
  };
}

/**
 * Fetch detailed sessions list with filtering & search
 */
export async function fetchRecentSessions({
  timeRange = 'all',
  searchQuery = '',
  filterRole = 'all', // all, student, guest, live
  limitCount = 100
} = {}) {
  const overview = await fetchAnalyticsOverview(timeRange);
  let list = overview.rawSessions || [];

  const liveThresholdMs = 3.5 * 60 * 1000;

  // Filter by Role
  if (filterRole === 'student') {
    list = list.filter(s => s.user?.isLoggedIn);
  } else if (filterRole === 'guest') {
    list = list.filter(s => !s.user?.isLoggedIn);
  } else if (filterRole === 'live') {
    list = list.filter(s => {
      const lastActiveTime = new Date(s.lastActiveAt || 0).getTime();
      return s.isLive !== false && (Date.now() - lastActiveTime < liveThresholdMs);
    });
  }

  // Filter by Search Query
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(s => {
      const name = (s.user?.name || '').toLowerCase();
      const email = (s.user?.email || '').toLowerCase();
      const vid = (s.visitorId || '').toLowerCase();
      const os = (s.device?.os || '').toLowerCase();
      const browser = (s.device?.browser || '').toLowerCase();
      const city = (s.location?.city || s.location?.district || '').toLowerCase();
      const country = (s.location?.country || '').toLowerCase();
      const region = (s.location?.region || '').toLowerCase();
      const isp = (s.location?.isp || '').toLowerCase();
      return name.includes(q) || email.includes(q) || vid.includes(q) || os.includes(q) || browser.includes(q) ||
             city.includes(q) || country.includes(q) || region.includes(q) || isp.includes(q);
    });
  }

  return list.slice(0, limitCount);
}

/**
 * Fetch all registered students from users collection with rich profile details
 */
export async function fetchRegisteredStudents() {
  const students = [];
  students.error = null;
  students.isPermissionDenied = false;

  if (!db) {
    students.error = 'no-db';
    return students;
  }

  try {
    const snap = await getDocs(query(collection(db, 'users'), limit(300)));
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const lessonsCount = Object.keys(data.lessonsProgress || {}).length;
      // কিতাবের নতুন শব্দের সেট (tamrin-words-*) তামরীন হিসেবে গোনা হয় না
      const tamrinsCount = Object.keys(data.tamrinProgress || {}).filter((id) => !id.startsWith('tamrin-words-')).length;

      const profile = data.studentProfile || {};
      const seed = (docSnap.id || data.email || 'student').replace(/[^a-zA-Z0-9]/g, '');
      const code = (seed.slice(-4) || '7860').toUpperCase();
      const studentId = `MI-2026-AR${code}`;

      const rawTotalXp = parseInt(data.totalXp || 0, 10);
      const plausibleMax = calculateMaxPlausibleXp(data);
      const legitimateXp = calculateLegitimateXpFromProgress(data);
      const isSuspiciousXp = rawTotalXp > plausibleMax || Boolean(data.isXpSuspicious);

      students.push({
        uid: docSnap.id,
        studentId,
        displayName: data.displayName || profile.name || 'শিক্ষার্থী',
        email: data.email || '',
        photoURL: data.photoURL || profile.photo || '',
        phone: profile.phone || data.phone || '',
        district: profile.district || data.district || '',
        gender: profile.gender || data.gender || '',
        dob: profile.dob || '',
        goal: profile.goal || '',
        madrasa: profile.madrasa || '',
        level: profile.level || '',
        totalXp: rawTotalXp,
        plausibleMaxXp: plausibleMax,
        legitimateXp,
        isSuspiciousXp,
        streakDays: data.streakData?.count || 1,
        lastActiveDate: data.streakData?.lastActiveDate || '',
        lessonsCount,
        tamrinsCount,
        starredCount: Array.isArray(data.starred) ? data.starred.length : 0,
        masteredCount: Array.isArray(data.mastered) ? data.mastered.length : 0,
        reviewCount: Array.isArray(data.review) ? data.review.length : 0,
        examHistory: Array.isArray(data.examHistory) ? data.examHistory : [],
        lessonsProgress: data.lessonsProgress || {},
        tamrinProgress: data.tamrinProgress || {},
        xpHistory: data.xpHistory || {},
        createdAt: data.createdAt || data.updatedAt || '',
        lastLoginAt: data.lastLoginAt || data.updatedAt || '',
        updatedAt: data.updatedAt || '',
        raw: data
      });
    });
  } catch (err) {
    console.warn('Failed to fetch registered students:', err);
    students.error = err?.code || err?.message || 'error';
    if (err?.code === 'permission-denied' || String(err?.message || '').toLowerCase().includes('permission')) {
      students.isPermissionDenied = true;
    }
  }

  return students.sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0));
}

/**
 * Check if the active Firebase Auth user is the cloud super admin
 */
export function isFirebaseAuthAdmin() {
  if (!auth?.currentUser) return false;
  const email = (auth.currentUser.email || '').toLowerCase().trim();
  return email === 'rafi.vaiya.onk.valo@gmail.com';
}

/**
 * Export registered students to UTF-8 CSV spreadsheet with Bengali encoding
 */
export function exportStudentsToCSV(students) {
  if (!students || students.length === 0) return;
  const headers = ['আইডি', 'নাম', 'ইমেইল', 'মোবাইল', 'জেলা', 'লিঙ্গ', 'মাদরাসা', 'মোট XP', 'স্ট্রিক', 'সম্পন্ন পাঠ', 'সম্পন্ন তামরীন', 'সর্বশেষ সক্রিয়'];
  const rows = students.map(s => [
    s.studentId,
    `"${(s.displayName || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.phone || '').replace(/"/g, '""')}"`,
    `"${(s.district || '').replace(/"/g, '""')}"`,
    s.gender === 'male' ? 'ছেলে' : (s.gender === 'female' ? 'মেয়ে' : ''),
    `"${(s.madrasa || '').replace(/"/g, '""')}"`,
    s.totalXp,
    s.streakDays,
    s.lessonsCount,
    s.tamrinsCount,
    s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('bn-BD') : ''
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `Markazul_Iman_Students_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Delete a specific session record from Firestore
 */
export async function deleteSessionRecord(sessionId) {
  if (!db || !sessionId) return false;
  try {
    await deleteDoc(doc(db, 'analytics_sessions', sessionId));
    return true;
  } catch (err) {
    console.warn('Error deleting session:', err);
    return false;
  }
}

/**
 * Award bonus XP to a student with an administrative log
 */
export async function awardBonusXp(uid, amount, reason = 'অ্যাডমিন পুরস্কার') {
  if (!db || !uid) return false;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) return false;
    
    const data = userSnap.data();
    const currentXp = parseInt(data.totalXp || 0, 10);
    const bonus = parseInt(amount, 10) || 0;
    const newTotalXp = currentXp + bonus;
    
    const xpHistory = data.xpHistory || {};
    const today = new Date().toISOString().split('T')[0];
    xpHistory[today] = (xpHistory[today] || 0) + bonus;

    const adminBonusLog = Array.isArray(data.adminBonusLog) ? [...data.adminBonusLog] : [];
    adminBonusLog.unshift({
      amount: bonus,
      reason,
      date: new Date().toISOString()
    });

    await updateDoc(userDocRef, {
      totalXp: newTotalXp,
      xpHistory,
      adminBonusLog,
      updatedAt: new Date().toISOString()
    });

    return { success: true, newTotalXp };
  } catch (err) {
    console.error('Error awarding bonus XP:', err);
    throw err;
  }
}

/**
 * Adjust or restore student streak days
 */
export async function adjustStudentStreak(uid, streakCount) {
  if (!db || !uid) return false;
  try {
    const userDocRef = doc(db, 'users', uid);
    const count = Math.max(1, parseInt(streakCount, 10) || 1);
    await updateDoc(userDocRef, {
      'streakData.count': count,
      'streakData.lastActiveDate': new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Error adjusting student streak:', err);
    throw err;
  }
}

/**
 * অ্যান্টি-চিট অডিট ও বৈধ প্রগ্রেস অনুযায়ী শিক্ষার্থীর XP রিসেট / মেরামত করা
 */
export async function auditAndFixStudentXp(uid) {
  if (!db || !uid) return false;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return false;
    const data = snap.data() || {};

    const legitimateXp = calculateLegitimateXpFromProgress(data);
    const oldXp = parseInt(data.totalXp || 0, 10);

    await updateDoc(userDocRef, {
      totalXp: legitimateXp,
      isXpSuspicious: false,
      xpAuditNote: `অ্যাডমিন কর্তৃক রিসেটকৃত। পূর্ববর্তী XP: ${oldXp}, সংশোধিত বৈধ XP: ${legitimateXp}`,
      updatedAt: new Date().toISOString()
    });

    return { success: true, oldXp, newTotalXp: legitimateXp };
  } catch (err) {
    console.error('Error auditing & fixing student XP:', err);
    throw err;
  }
}

/**
 * Verify certificate by Serial Number across registered students
 */
export async function verifyCertificateSerial(serialNumber) {
  if (!serialNumber || typeof serialNumber !== 'string') return null;
  const cleanSerial = serialNumber.trim().toUpperCase();
  const students = await fetchRegisteredStudents();
  
  for (const st of students) {
    const rawSeed = (st.uid || st.email || 'student').replace(/[^a-zA-Z0-9]/g, '');
    const cleanId = (rawSeed.slice(-6) || '786012').toUpperCase();
    const vol1Serial = `MI-2026-AR-VOL1-${cleanId}`;
    const vol2Serial = `MI-2026-AR-VOL2-${cleanId}`;
    const generalId = (st.studentId || '').toUpperCase();

    if (cleanSerial === vol1Serial || cleanSerial.endsWith(cleanId) || cleanSerial === generalId) {
      return {
        isValid: true,
        volume: '১ম খণ্ড (Volume 1)',
        volumeId: 'vol1',
        serialNumber: vol1Serial,
        student: st,
        lessonsCompleted: st.lessonsCount,
        totalXp: st.totalXp,
        issueDate: st.updatedAt || st.createdAt || new Date().toISOString()
      };
    }

    if (cleanSerial === vol2Serial) {
      return {
        isValid: true,
        volume: '২য় খণ্ড (Volume 2)',
        volumeId: 'vol2',
        serialNumber: vol2Serial,
        student: st,
        lessonsCompleted: st.lessonsCount,
        totalXp: st.totalXp,
        issueDate: st.updatedAt || st.createdAt || new Date().toISOString()
      };
    }
  }

  return { isValid: false, serialNumber: cleanSerial };
}


