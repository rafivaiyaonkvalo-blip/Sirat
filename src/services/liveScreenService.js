// =========================================================================
// ULS Arabic Live Screen Mirroring & Co-Browsing Service
// মারকাযুল ঈমান ইলমী বোর্ড - ULS Arabic (Live Classroom Vision)
// Allows admin to see live screen state, touches, audio, and lessons
// =========================================================================

import { db } from './firebase';
import { doc, setDoc, onSnapshot, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getOrCreateSessionId, getOrCreateVisitorId, getDeviceInfo } from './analyticsTracker';

const LIVE_STREAM_COLLECTION = 'live_screen_sessions';
const BROADCAST_CHANNEL_NAME = 'uls_live_screen_mirror_channel';

let localBroadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    localBroadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    localBroadcastChannel = null;
  }
}

// Current student screen state held in memory
let currentScreenState = {
  sessionId: null,
  visitorId: null,
  isLive: true,
  updatedAt: Date.now(),
  currentTab: 'lessons', // lessons, flashcards, practice, spelling, exam, vocab, book
  activeModal: null, // 'lesson', 'tamrin', 'flashcard', 'book', 'quiz', 'mistakes', null
  lessonInfo: null, // { volumeId, lessonId, title, arabicTitle, activeSubUnitId, activeTab }
  exerciseInfo: null, // { type, index, total, questionText, selectedAnswer, isCorrect }
  audioPlaying: null, // { text, playedAt }
  scrollPercentage: 0,
  cursor: { x: 50, y: 50, lastAction: 'idle', targetLabel: '' },
  screenSize: { width: 0, height: 0, isMobile: false },
  device: null,
  user: null,
  lastActionText: 'ওয়েবসাইটে প্রবেশ করেছেন'
};

let broadcastThrottleTimer = null;
let lastBroadcastAt = 0;
const THROTTLE_INTERVAL_MS = 800; // ৮০০ মিলিসেকেন্ড থ্রটল

/**
 * স্টুডেন্ট স্ক্রিন স্টেট ক্লাউড ও লোকাল চ্যানেলে ব্রডকাস্ট করা
 */
export function broadcastStudentScreenState(partialState = {}, immediate = false) {
  if (typeof window === 'undefined') return;

  // অ্যাডমিন প্যানেলে থাকলে স্টুডেন্ট হিসেবে নিজের স্ক্রিন ব্রডকাস্ট করার প্রয়োজন নেই
  if (window.location.pathname.startsWith('/rafi')) return;

  const sessionId = getOrCreateSessionId();
  const visitorId = getOrCreateVisitorId();
  const deviceInfo = getDeviceInfo();

  const width = window.innerWidth || 390;
  const height = window.innerHeight || 844;
  const isMobile = width < 768;

  // স্টেট মার্জ করা
  currentScreenState = {
    ...currentScreenState,
    ...partialState,
    sessionId,
    visitorId,
    isLive: true,
    updatedAt: Date.now(),
    screenSize: { width, height, isMobile },
    device: deviceInfo
  };

  // ১. সেইম ডিভাইসে ইনস্ট্যান্ট টেস্টের জন্য BroadcastChannel ও LocalStorage এ পাঠানো
  try {
    if (localBroadcastChannel) {
      localBroadcastChannel.postMessage(currentScreenState);
    }
    localStorage.setItem(`uls_live_screen_${sessionId}`, JSON.stringify(currentScreenState));
  } catch (e) {}

  // ২. ফায়ারস্টোরে পুশ (থ্রটলড অথবা ইমিডিয়েট)
  const now = Date.now();
  if (immediate || now - lastBroadcastAt >= THROTTLE_INTERVAL_MS) {
    if (broadcastThrottleTimer) {
      clearTimeout(broadcastThrottleTimer);
      broadcastThrottleTimer = null;
    }
    lastBroadcastAt = now;
    pushToFirestore(currentScreenState);
  } else if (!broadcastThrottleTimer) {
    broadcastThrottleTimer = setTimeout(() => {
      lastBroadcastAt = Date.now();
      pushToFirestore(currentScreenState);
      broadcastThrottleTimer = null;
    }, THROTTLE_INTERVAL_MS);
  }
}

async function pushToFirestore(state) {
  if (!db || !state.sessionId) return;
  try {
    const streamRef = doc(db, LIVE_STREAM_COLLECTION, state.sessionId);
    await setDoc(streamRef, {
      ...state,
      lastPing: Date.now()
    }, { merge: true });
  } catch (err) {
    // সাইলেন্ট এরর হ্যান্ডলিং
  }
}

/**
 * শিক্ষার্থী যখন পেজ ছেড়ে যায়
 */
export function markStudentOffline() {
  const sessionId = getOrCreateSessionId();
  if (!db || !sessionId) return;

  try {
    const offlinePayload = {
      isLive: false,
      lastActionText: 'সেশন বন্ধ করেছেন',
      updatedAt: Date.now()
    };
    if (localBroadcastChannel) {
      localBroadcastChannel.postMessage({ sessionId, ...offlinePayload });
    }
    const streamRef = doc(db, LIVE_STREAM_COLLECTION, sessionId);
    setDoc(streamRef, offlinePayload, { merge: true }).catch(() => {});
  } catch (e) {}
}

/**
 * অ্যাডমিন সাইড: রিয়েল-টাইম স্ক্রিন সাবস্ক্রিপশন (Live Screen Streaming)
 */
export function subscribeToStudentLiveScreen(sessionId, onUpdate) {
  if (!sessionId) return () => {};

  let unsubscribeFirestore = () => {};

  // ১. লোকাল ব্রডকাস্ট চ্যানেলে শোনা (যদি অ্যাডমিন একই ডিভাইসের অন্য ট্যাবে পরীক্ষা করে)
  const handleLocalMessage = (event) => {
    if (event.data && event.data.sessionId === sessionId) {
      onUpdate(event.data);
    }
  };

  if (localBroadcastChannel) {
    localBroadcastChannel.addEventListener('message', handleLocalMessage);
  }

  // ২. লোকালস্টোরেজ থেকে প্রাথমিক স্টেট পড়ে নেওয়া
  try {
    const cached = localStorage.getItem(`uls_live_screen_${sessionId}`);
    if (cached) {
      onUpdate(JSON.parse(cached));
    }
  } catch (e) {}

  // ৩. ফায়ারস্টোর রিয়েল-টাইম স্ন্যাপশট
  if (db) {
    try {
      const streamRef = doc(db, LIVE_STREAM_COLLECTION, sessionId);
      unsubscribeFirestore = onSnapshot(streamRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate(data);
        }
      }, (err) => {
        console.warn('Live screen snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Error starting live screen snapshot:', e);
    }
  }

  return () => {
    if (localBroadcastChannel) {
      localBroadcastChannel.removeEventListener('message', handleLocalMessage);
    }
    unsubscribeFirestore();
  };
}

/**
 * অ্যাডমিন থেকে শিক্ষার্থীকে লাইভ উৎসাহ / দুআ / নজ পাঠানো
 */
export async function sendRemoteAdminNudge(sessionId, nudgeData = { type: 'dua', message: 'মাশাআল্লাহ! চালিয়ে যান' }) {
  if (!db || !sessionId) return false;
  try {
    const streamRef = doc(db, LIVE_STREAM_COLLECTION, sessionId);
    const payload = {
      pendingNudge: {
        id: `nudge_${Date.now()}`,
        ...nudgeData,
        sentAt: Date.now()
      }
    };
    await updateDoc(streamRef, payload);

    // লোকাল টেস্টের জন্য
    if (localBroadcastChannel) {
      localBroadcastChannel.postMessage({
        sessionId,
        ...payload
      });
    }
    return true;
  } catch (err) {
    console.warn('Failed to send remote nudge:', err);
    return false;
  }
}

/**
 * শিক্ষার্থী সাইডে অ্যাডমিনের পাঠানো দুআ / নজ শোনা
 */
export function listenForAdminNudges(sessionId, onNudgeReceived) {
  if (!db || !sessionId) return () => {};

  let lastHandledNudgeId = null;

  const handleData = (data) => {
    if (data?.pendingNudge && data.pendingNudge.id !== lastHandledNudgeId) {
      lastHandledNudgeId = data.pendingNudge.id;
      onNudgeReceived(data.pendingNudge);
    }
  };

  // BroadcastChannel
  const handleLocal = (e) => {
    if (e.data && e.data.sessionId === sessionId) {
      handleData(e.data);
    }
  };
  if (localBroadcastChannel) {
    localBroadcastChannel.addEventListener('message', handleLocal);
  }

  // Firestore Snapshot
  let unsub = () => {};
  try {
    const streamRef = doc(db, LIVE_STREAM_COLLECTION, sessionId);
    unsub = onSnapshot(streamRef, (docSnap) => {
      if (docSnap.exists()) {
        handleData(docSnap.data());
      }
    });
  } catch (e) {}

  return () => {
    if (localBroadcastChannel) localBroadcastChannel.removeEventListener('message', handleLocal);
    unsub();
  };
}
