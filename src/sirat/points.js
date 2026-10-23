// XP, দুরূদ-গণনা ও রেফারেল: ডিভাইসে জমা থাকে, লগইন থাকলে Firestore-এর পাবলিক ডক leaderboard/{uid}-এ যায়
// (ইমেইল/ফোন ছাড়া শুধু নাম, ছবি ও সংখ্যা)। নিয়ম: firestore.rules
import { collection, doc, getDoc, getDocs, increment, limit, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';

export const POINTS = { perDurood: 10, quizCorrect: 10, quizWrong: 5 };

const KEY = 'sirat_points_v1';
const REF_KEY = 'sirat_ref';
const REF_JOINED_KEY = 'sirat_ref_joined';
const HISTORY_DAYS = 60;
const FLUSH_MS = 3000;

const fresh = () => ({ uid: null, xp: 0, durood: 0, referred: 0, referredPeople: 0, history: {}, pend: { durood: 0, xp: 0 } });
const today = () => new Date().toISOString().slice(0, 10);
const cloud = () => isFirebaseConfigured() && !!db;

let state = null;
let lastRaw;
let timer = null;

// localStorage বদলালে (যেমন লগআউটে মোছা) ক্যাশ নতুন করে পড়া হয়
const read = () => {
  let raw = null;
  try { raw = localStorage.getItem(KEY); } catch { /* ignore */ }
  if (state && raw === lastRaw) return state;
  try { state = { ...fresh(), ...(raw ? JSON.parse(raw) : {}) }; } catch { state = fresh(); }
  state.pend = { durood: 0, xp: 0, ...(state.pend || {}) };
  lastRaw = raw;
  return state;
};
const emit = () => {
  try { window.dispatchEvent(new CustomEvent('sirat_points_changed')); window.dispatchEvent(new CustomEvent('uls_progress_changed')); } catch { /* ignore */ }
};
const save = () => {
  try { lastRaw = JSON.stringify(state); localStorage.setItem(KEY, lastRaw); } catch { /* ignore */ }
  emit();
};

export const getPoints = () => ({ ...read() });
export const getXp = () => read().xp;
export const getXpDays = () => ({ ...read().history });

// ---- ক্লাউডে পাঠানো ----
const profileFields = () => {
  const u = auth?.currentUser;
  let prof = {};
  try { prof = JSON.parse(localStorage.getItem('uls_student_profile') || '{}'); } catch { /* ignore */ }
  return {
    name: (prof.name || u?.displayName || 'শিক্ষার্থী').slice(0, 60),
    photoURL: (u?.photoURL || prof.photo || '').slice(0, 500),
    hideName: localStorage.getItem('uls_leaderboard_blur_my_name') === 'true' || Boolean(prof.hideNameInLeaderboard),
  };
};

export async function flushPoints() {
  const s = read();
  const user = auth?.currentUser;
  if (!cloud() || !user || s.uid !== user.uid) return false;
  const { durood, xp } = s.pend;
  try {
    const ref = doc(db, 'leaderboard', user.uid);
    const base = { ...profileFields(), updatedAt: new Date().toISOString() };
    if (durood || xp) {
      await updateDoc(ref, { ...base, durood: increment(durood), total: increment(durood), xp: increment(xp) });
      s.pend = { durood: 0, xp: 0 };
      save();
    } else {
      await updateDoc(ref, base);
    }
    return true;
  } catch {
    return false;
  }
}

const scheduleFlush = () => {
  if (!cloud() || !auth?.currentUser) return;
  clearTimeout(timer);
  timer = setTimeout(flushPoints, FLUSH_MS);
};

// লগইনের পর: ক্লাউডের সংখ্যা এনে লোকালে বসায়; অতিথি অবস্থায় জমানো সংখ্যা নতুন অ্যাকাউন্টে যোগ হয়
export async function syncAccount(user) {
  const s = read();
  if (!user) {
    clearTimeout(timer);
    return;
  }
  if (!cloud()) return;
  if (s.uid && s.uid !== user.uid) { state = fresh(); }
  const cur = read();
  if (!cur.uid) cur.pend = { durood: cur.durood, xp: cur.xp }; // অতিথি অবস্থার সব জমানো সংখ্যা অ্যাকাউন্টে যাবে
  try {
    const ref = doc(db, 'leaderboard', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const d = snap.data();
      cur.uid = user.uid;
      cur.durood = (Number(d.durood) || 0) + cur.pend.durood;
      cur.xp = (Number(d.xp) || 0) + cur.pend.xp;
      cur.referred = Number(d.referred) || 0;
      cur.referredPeople = Number(d.referredPeople) || 0;
      save();
      await flushPoints();
    } else {
      const { durood, xp } = cur.pend;
      await setDoc(ref, { ...profileFields(), durood, xp, total: durood, updatedAt: new Date().toISOString() });
      cur.uid = user.uid;
      cur.pend = { durood: 0, xp: 0 };
      save();
    }
  } catch { /* অফলাইন/নিয়ম-ত্রুটি: লোকালেই থাকে, পরে আবার চেষ্টা */ }
}

// নিজের ডকের লাইভ সংখ্যা (রেফারেল থেকে আসা সহ) নিতে
export async function refreshOwn() {
  const user = auth?.currentUser;
  if (!cloud() || !user) return;
  try {
    const snap = await getDoc(doc(db, 'leaderboard', user.uid));
    if (!snap.exists()) return;
    const d = snap.data();
    const s = read();
    s.referred = Number(d.referred) || 0;
    s.referredPeople = Number(d.referredPeople) || 0;
    save();
  } catch { /* ignore */ }
}

// ---- XP/দুরূদ যোগ ----
const addXp = (n) => {
  const s = read();
  s.xp += n;
  s.pend.xp += n;
  const d = today();
  s.history[d] = (s.history[d] || 0) + n;
  const cut = new Date(Date.now() - HISTORY_DAYS * 864e5).toISOString().slice(0, 10);
  Object.keys(s.history).forEach((k) => { if (k < cut) delete s.history[k]; });
};

export function addDurood(n) {
  const amount = Math.max(0, Math.floor(n));
  if (!amount) return;
  const s = read();
  s.durood += amount;
  s.pend.durood += amount;
  addXp(amount * POINTS.perDurood);
  save();
  scheduleFlush();
}

// কুইজ/পরীক্ষার একটি উত্তর: সঠিক ১০, ভুল ৫ XP; কত XP পেল তা ফেরত দেয়
export function addQuizAnswer(correct) {
  const gain = correct ? POINTS.quizCorrect : POINTS.quizWrong;
  addXp(gain);
  save();
  scheduleFlush();
  return gain;
}

// ---- রেফারেল ----
export function captureReferral() {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^[A-Za-z0-9]{10,64}$/.test(ref) && !localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, ref);
  } catch { /* ignore */ }
}

export const referralLink = (uid) => `${window.location.origin}${import.meta.env.BASE_URL}?ref=${uid}`;

// এই দর্শক অন্যের লিংকে এসে থাকলে তার পড়া দুরূদ ওই ব্যক্তির হিসাবে জমা হয় (একবারে সর্বোচ্চ ২০০)
export async function creditReferrer(n) {
  const amount = Math.min(Math.max(Math.floor(n), 0), 200);
  let ref = null;
  try { ref = localStorage.getItem(REF_KEY); } catch { /* ignore */ }
  if (!amount || !ref || !cloud() || auth?.currentUser?.uid === ref) return false;
  const first = (() => { try { return localStorage.getItem(REF_JOINED_KEY) !== '1'; } catch { return false; } })();
  try {
    const data = { referred: increment(amount), total: increment(amount) };
    if (first) data.referredPeople = increment(1);
    await updateDoc(doc(db, 'leaderboard', ref), data);
    if (first) { try { localStorage.setItem(REF_JOINED_KEY, '1'); } catch { /* ignore */ } }
    return true;
  } catch {
    return false;
  }
}

// ---- লিডারবোর্ড ----
export async function fetchLeaderboard(max = 100) {
  if (!cloud()) return [];
  const snap = await getDocs(query(collection(db, 'leaderboard'), orderBy('total', 'desc'), limit(max)));
  return snap.docs
    .map((d) => {
      const x = d.data();
      return {
        uid: d.id,
        name: x.name || 'শিক্ষার্থী',
        hideName: Boolean(x.hideName),
        photoURL: x.photoURL || '',
        durood: Number(x.durood) || 0,
        referred: Number(x.referred) || 0,
        referredPeople: Number(x.referredPeople) || 0,
        total: Number(x.total) || 0,
        xp: Number(x.xp) || 0,
      };
    })
    .filter((x) => x.total > 0);
}
