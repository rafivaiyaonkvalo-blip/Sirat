// ULS Arabic Website Usage Tracer & Analytics Service
// মারকাযুল ঈমান ইলমী বোর্ড - Sirat
import { db } from './firebase';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getUserLocation, getCachedUserLocation } from './locationService';

const VISITOR_ID_KEY = 'uls_tracer_vid';
const SESSION_ID_KEY = 'uls_tracer_sid';
const CACHE_SESSIONS_KEY = 'uls_tracer_local_cache';
const HEARTBEAT_INTERVAL_MS = 30000; // ৩০ সেকেন্ড পরপর ক্লাউড সিঙ্ক
const IDLE_TIMEOUT_MS = 60000; // ৬০ সেকেন্ড নিষ্ক্রিয় থাকলে সময় গণনা সাময়িক বিরতি

let currentVisitorId = null;
let currentSessionId = null;
let currentUser = null;
let currentUserLocation = getCachedUserLocation();
let activeDurationSeconds = 0;
let totalClicksCount = 0;
let lastUserActivityAt = Date.now();
let isCurrentlyIdle = false;
let sessionStartedAt = null;
let sessionEvents = [];
let heartbeatTimer = null;
let secondTickerTimer = null;
let isInitialized = false;

// Listen for high-accuracy GPS upgrades
if (typeof window !== 'undefined') {
  window.addEventListener('uls_precise_location_available', (e) => {
    if (e.detail) {
      currentUserLocation = e.detail;
      syncSessionToCloud(false);
    }
  });
}

// -------------------------------------------------------------
// 1. Device & Browser Detection Helpers
// -------------------------------------------------------------
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { type: 'Desktop', os: 'Unknown', browser: 'Unknown', screen: '0x0' };
  }

  const ua = navigator.userAgent || '';
  const width = window.innerWidth || (window.screen && window.screen.width) || 0;
  const height = window.innerHeight || (window.screen && window.screen.height) || 0;

  // Device Type
  let type = 'Desktop';
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || width < 768) {
    type = 'Mobile';
  } else if (/iPad|Tablet/i.test(ua) || (width >= 768 && width <= 1024)) {
    type = 'Tablet';
  }

  // Operating System
  let os = 'Unknown';
  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser Name
  let browser = 'Chrome';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/CriOS/i.test(ua)) browser = 'Chrome iOS';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';

  return {
    type,
    os,
    browser,
    screen: `${width}x${height}`,
    userAgent: ua.slice(0, 150)
  };
}

// -------------------------------------------------------------
// 2. ID Generation & Storage
// -------------------------------------------------------------
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return 'server_guest';
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = generateId('vis');
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch (e) {
    return 'guest_' + Date.now();
  }
}

export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'sess_server';
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = generateId('sess');
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch (e) {
    return 'sess_' + Date.now();
  }
}

function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// -------------------------------------------------------------
// 3. User Identity Resolver
// -------------------------------------------------------------
function resolveUserData(user) {
  let profile = {};
  try {
    profile = JSON.parse(localStorage.getItem('uls_student_profile') || '{}');
  } catch (e) {}

  if (user && user.uid) {
    return {
      isLoggedIn: true,
      uid: user.uid,
      name: user.displayName || profile.name || user.email?.split('@')[0] || 'শিক্ষার্থী',
      email: user.email || '',
      phone: profile.phone || '',
      madrasa: profile.madrasa || '',
      photoURL: user.photoURL || '',
      role: 'student'
    };
  }

  // অতিথি শিক্ষার্থী আইডি
  const shortId = currentVisitorId ? currentVisitorId.slice(-4) : 'গেস্ট';
  return {
    isLoggedIn: false,
    uid: null,
    name: `অতিথি শিক্ষার্থী #${shortId}`,
    email: '',
    phone: '',
    madrasa: '',
    photoURL: '',
    role: 'guest'
  };
}

// -------------------------------------------------------------
// 4. Cloud Sync / Session Flush
// -------------------------------------------------------------
async function syncSessionToCloud(isFinal = false) {
  if (!db || !currentSessionId) return;

  const nowIso = new Date().toISOString();
  const userData = resolveUserData(currentUser);
  const deviceInfo = getDeviceInfo();
  const today = getTodayString();

  const loc = currentUserLocation || getCachedUserLocation();

  const sessionPayload = {
    sessionId: currentSessionId,
    visitorId: currentVisitorId,
    startedAt: sessionStartedAt,
    lastActiveAt: nowIso,
    durationSeconds: activeDurationSeconds,
    clicksCount: totalClicksCount,
    isLive: !isFinal,
    user: userData,
    device: deviceInfo,
    location: loc || null,
    date: today,
    recentEvents: sessionEvents.slice(-40), // সর্বশেষ ৪০টি অ্যাকশন সংরক্ষিত রাখা
    updatedAt: nowIso
  };

  // 1. লোকাল ক্যাশে ব্যাকআপ
  try {
    localStorage.setItem('uls_tracer_my_session', JSON.stringify(sessionPayload));
  } catch (e) {}

  // 2. ফায়ারবেস ক্লাউডে সেভ (analytics_sessions)
  if (!db) return;
  try {
    const sessionRef = doc(db, 'analytics_sessions', currentSessionId);
    await setDoc(sessionRef, sessionPayload, { merge: true });

    // 3. ডেইলি অ্যাগ্রিগেটর আপডেট (analytics_daily)
    try {
      const dailyRef = doc(db, 'analytics_daily', today);
      await setDoc(dailyRef, {
        date: today,
        lastUpdatedAt: nowIso
      }, { merge: true });
    } catch (dErr) {}
  } catch (err) {
    console.warn('Analytics silent sync warning:', err?.message);
  }
}

// -------------------------------------------------------------
// 5. Activity Monitoring & Heartbeat Engine
// -------------------------------------------------------------
function registerUserActivity() {
  lastUserActivityAt = Date.now();
  if (isCurrentlyIdle) {
    isCurrentlyIdle = false;
  }
}

function startDurationTracking() {
  if (secondTickerTimer) clearInterval(secondTickerTimer);

  secondTickerTimer = setInterval(() => {
    // শুধুমাত্র ট্যাব ভিজিবল থাকলে এবং ইউজার এক্টিভ থাকলে সময় গোনা হবে
    const isVisible = typeof document !== 'undefined' && !document.hidden;
    const isRecent = Date.now() - lastUserActivityAt < IDLE_TIMEOUT_MS;

    if (isVisible && isRecent) {
      activeDurationSeconds += 1;
      isCurrentlyIdle = false;
    } else {
      isCurrentlyIdle = true;
    }
  }, 1000);

  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(() => {
    if (!isCurrentlyIdle) {
      syncSessionToCloud(false);
    }
  }, HEARTBEAT_INTERVAL_MS);
}

// -------------------------------------------------------------
// 6. Global Click & Interaction Capture
// -------------------------------------------------------------
function setupGlobalClickListener() {
  if (typeof window === 'undefined') return;

  const handleClick = (e) => {
    registerUserActivity();
    totalClicksCount += 1;

    try {
      const target = e.target;
      if (!target) return;

      // বাটনের বা ক্লিকের বিষয়বস্তু সনাক্ত করা
      const clickable = target.closest('button, a, input, select, [role="button"], details summary, [data-track]');
      if (!clickable) return;

      // অ্যাডমিন প্যানেলে থাকলে ব্যবহারকারীর নিজস্ব ক্লিক লগিং ন্যূনতম রাখা
      if (window.location.pathname.startsWith('/rafi')) return;

      let label = clickable.getAttribute('data-track') ||
                  clickable.getAttribute('aria-label') ||
                  clickable.getAttribute('title') ||
                  clickable.innerText ||
                  clickable.textContent ||
                  '';
      label = label.trim().replace(/\s+/g, ' ').slice(0, 50);

      if (!label && clickable.tagName === 'A') {
        label = clickable.getAttribute('href') || 'লিংক';
      }

      const tagName = clickable.tagName.toLowerCase();
      
      // তাৎপর্যপূর্ণ অ্যাকশন চিহ্নিতকরণ
      let actionType = 'click';
      if (label.includes('শুনুন') || label.includes('উচ্চারণ') || clickable.querySelector('svg.lucide-volume-2')) {
        actionType = 'audio_play';
      } else if (label.includes('দারস') || label.includes('পাঠ') || clickable.closest('[data-lesson-id]')) {
        actionType = 'lesson_interaction';
      } else if (label.includes('তামরীন')) {
        actionType = 'tamrin_interaction';
      } else if (label.includes('কুইজ') || label.includes('যাচাই')) {
        actionType = 'quiz_action';
      } else if (label.includes('অনুসন্ধান') || label.includes('সার্চ')) {
        actionType = 'search';
      }

      recordTracerEvent({
        type: actionType,
        tag: tagName,
        label: label || 'ইন্টারঅ্যাকশন',
        timestamp: new Date().toISOString()
      });
    } catch (err) {}
  };

  window.addEventListener('click', handleClick, { capture: true, passive: true });
  window.addEventListener('mousemove', registerUserActivity, { passive: true });
  window.addEventListener('keydown', registerUserActivity, { passive: true });
  window.addEventListener('touchstart', registerUserActivity, { passive: true });
  window.addEventListener('scroll', registerUserActivity, { passive: true });

  // ট্যাব ব্যাকগ্রাউন্ডে গেলে বা বন্ধ করার সময়
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      syncSessionToCloud(false);
    } else {
      registerUserActivity();
    }
  });

  window.addEventListener('beforeunload', () => {
    syncSessionToCloud(true);
  });
}

// -------------------------------------------------------------
// 7. Public API
// -------------------------------------------------------------
export function recordTracerEvent(eventObj) {
  const event = {
    ...eventObj,
    timestamp: eventObj.timestamp || new Date().toISOString()
  };
  sessionEvents.push(event);
  if (sessionEvents.length > 50) {
    sessionEvents.shift();
  }
}

export function trackPageView(tabName) {
  registerUserActivity();
  const titles = {
    lessons: 'পাঠ ও রোডম্যাপ',
    flashcards: 'ফ্ল্যাশকার্ড',
    practice: 'অনুশীলন ও তামরীন',
    spelling: 'ইমলা ও বানান',
    exam: 'গ্রিল-মি পরীক্ষা',
    vocab: 'শব্দকোষ ডিরেক্টরি',
    book: 'মূল কিতাব ভিউয়ার',
    admin: 'অ্যাডমিন পোর্টাল'
  };
  recordTracerEvent({
    type: 'page_view',
    tab: tabName,
    label: titles[tabName] || tabName,
    timestamp: new Date().toISOString()
  });
}

export function trackAudioPlay(arabicText) {
  registerUserActivity();
  totalClicksCount += 1;
  recordTracerEvent({
    type: 'audio_play',
    text: (arabicText || '').slice(0, 40),
    label: `অডিও: ${(arabicText || '').slice(0, 25)}`,
    timestamp: new Date().toISOString()
  });
}

export function trackLessonOpen(lessonId, lessonTitle) {
  registerUserActivity();
  totalClicksCount += 1;
  recordTracerEvent({
    type: 'lesson_open',
    lessonId,
    label: `পাঠ ওপেন: ${lessonTitle || lessonId}`,
    timestamp: new Date().toISOString()
  });
}

export function trackTamrinOpen(tamrinId, title) {
  registerUserActivity();
  totalClicksCount += 1;
  recordTracerEvent({
    type: 'tamrin_open',
    tamrinId,
    label: `তামরীন: ${title || tamrinId}`,
    timestamp: new Date().toISOString()
  });
}

export function trackQuizAnswer(stepTitle, isCorrect) {
  registerUserActivity();
  totalClicksCount += 1;
  recordTracerEvent({
    type: 'quiz_answer',
    isCorrect,
    label: `কুইজ ${isCorrect ? '✅ সঠিক' : '❌ ভুল'}: ${(stepTitle || '').slice(0, 30)}`,
    timestamp: new Date().toISOString()
  });
}

export function updateTrackerUser(user) {
  currentUser = user;
  // ইউজার পরিবর্তন হলে তাৎক্ষণিক সেশন আপডেট
  syncSessionToCloud(false);
}

export function initAnalyticsTracker(user) {
  if (typeof window === 'undefined' || isInitialized) {
    if (user) updateTrackerUser(user);
    return;
  }

  isInitialized = true;
  currentUser = user;
  currentVisitorId = getOrCreateVisitorId();
  currentSessionId = getOrCreateSessionId();
  sessionStartedAt = new Date().toISOString();
  lastUserActivityAt = Date.now();

  setupGlobalClickListener();
  startDurationTracking();

  // প্রাথমিক সেশন রেজিস্টার
  recordTracerEvent({
    type: 'session_start',
    label: 'সাইটে আগমন',
    timestamp: sessionStartedAt
  });

  // স্বয়ংক্রিয় হাইব্রিড লোকেশন সনাক্তকরণ (IP + GPS)
  getUserLocation().then((loc) => {
    if (loc) {
      currentUserLocation = loc;
      syncSessionToCloud(false);
    }
  }).catch(() => {});

  // ১ম হার্টবিট ৩ সেকেন্ড পর
  setTimeout(() => {
    syncSessionToCloud(false);
  }, 3000);
}
