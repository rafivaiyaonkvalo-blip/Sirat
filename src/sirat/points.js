// XP, দুরূদ-গণনা ও রেফারেল: ডিভাইসে জমা থাকে, লগইন থাকলে Firestore-এর পাবলিক ডক leaderboard/{uid}-এ যায়
// (ইমেইল/ফোন ছাড়া শুধু নাম, ছবি ও সংখ্যা)। রেফারেল-কোড লগইন ছাড়াই পাওয়া যায়: refcodes/{code}। নিয়ম: firestore.rules
import { collection, doc, documentId, getDoc, getDocs, increment, limit, orderBy, query, runTransaction, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';

export const POINTS = { perDurood: 10, quizCorrect: 10, quizWrong: 5, quizComplete: 20, perfectBonus: 30 };

const KEY = 'sirat_points_v1';
const REF_KEY = 'sirat_ref';
const REF_CHAIN_KEY = 'sirat_ref_chain';
const REF_JOINED_KEY = 'sirat_ref_joined';
const MY_CODE_KEY = 'sirat_refcode';
const OWNED_KEY = 'sirat_refcode_owned';
const NEW_CODE_LEN = 7; // ছোট লিংকের জন্য; আগের ১২ অক্ষরের কোডও চলে
const validCode = (c) => typeof c === 'string' && (c.length === NEW_CODE_LEN || c.length === 12);
const HISTORY_DAYS = 60;
const FLUSH_MS = 3000;

const fresh = () => ({ uid: null, xp: 0, durood: 0, referred: 0, referredPeople: 0, history: {}, pend: { durood: 0, xp: 0 } });
const today = () => new Date().toISOString().slice(0, 10);
const cloud = () => isFirebaseConfigured() && !!db;

// সাপ্তাহিক লিডারবোর্ডের সপ্তাহ: শনিবার শুরু (UTC), আইডি = ওই শনিবারের তারিখ "YYYY-MM-DD"
export const weekId = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 1) % 7));
  return t.toISOString().slice(0, 10);
};

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

// ---- রেফারেল-কোড (লগইন ছাড়াই) ----
const randomCode = () => {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(NEW_CODE_LEN);
  (window.crypto || window.msCrypto).getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
};

// এই ব্যক্তির নিজস্ব কোড: প্রথমবার ডিভাইসে বানানো হয়; লগইন থাকলে অ্যাকাউন্টের কোড বসে যায় (সব ডিভাইসে একই লিংক)
export function getMyCode() {
  try {
    let c = localStorage.getItem(MY_CODE_KEY);
    if (!validCode(c)) { c = randomCode(); localStorage.setItem(MY_CODE_KEY, c); }
    return c;
  } catch {
    return '';
  }
}

// ছোট লিংক: .../sirat/?tab=durood&r=abc1234 এবং চেইনের রেফারেল থাকলে &c=code1.code2
export const referralLink = (code) => {
  let origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.markazuliman.com';
  if (typeof window !== 'undefined' && window.location.hostname.includes('markazuliman.com')) {
    origin = 'https://www.markazuliman.com';
  }
  const baseUrl = import.meta.env.BASE_URL || '/sirat/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const base = `${origin}${cleanBase}?tab=durood&r=${code}`;
  try {
    let chain = [];
    const raw = localStorage.getItem(REF_CHAIN_KEY);
    if (raw) chain = JSON.parse(raw);
    const direct = localStorage.getItem(REF_KEY);
    if (direct && !chain.includes(direct)) chain.unshift(direct);
    const validChain = chain.filter((c) => validCode(c) && c !== code).slice(0, 8);
    if (validChain.length > 0) {
      return `${base}&c=${validChain.join('.')}`;
    }
  } catch { /* ignore */ }
  return base;
};

// কোডের গণনা-ডক না থাকলে বানায় (যেন অন্যদের দুরূদ জমা হতে পারে)
export async function ensureRefDoc() {
  let code = getMyCode();
  if (!code || !cloud()) return code;
  try {
    for (let i = 0; i < 5; i += 1) {
      const ref = doc(db, 'refcodes', code);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { referred: 0, referredPeople: 0 });
        try { localStorage.setItem(OWNED_KEY, code); } catch { /* ignore */ }
        break;
      }
      // ডক আগে থেকেই আছে: আমাদের নিজের (বা আগের ১২ অক্ষরের) হলে ঠিক; নইলে অন্য কারও কোডের সাথে মিলে গেছে, নতুন কোড নিই
      let owned = false;
      try { owned = localStorage.getItem(OWNED_KEY) === code; } catch { /* ignore */ }
      if (owned || code.length === 12) break;
      code = randomCode();
      try { localStorage.setItem(MY_CODE_KEY, code); } catch { /* ignore */ }
    }
  } catch { /* অফলাইন/নিয়ম-ত্রুটি: পরের বার আবার চেষ্টা */ }
  return code;
}

// নিজের কোডে এ পর্যন্ত কত দুরূদ ও কতজন এসেছেন
export async function refreshOwn() {
  if (!cloud()) return;
  const code = getMyCode();
  if (!code) return;
  try {
    const snap = await getDoc(doc(db, 'refcodes', code));
    const s = read();
    s.referred = snap.exists() ? Number(snap.data().referred) || 0 : 0;
    s.referredPeople = snap.exists() ? Number(snap.data().referredPeople) || 0 : 0;
    save();
  } catch { /* ignore */ }
}

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
      const wk = weekId();
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        const d = snap.exists() ? snap.data() : {};
        const weekDurood = d.week === wk ? (Number(d.weekDurood) || 0) + durood : durood;
        tx.update(ref, { ...base, durood: increment(durood), total: increment(durood), xp: increment(xp), week: wk, weekDurood });
      });
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

// লগইনের পর: ক্লাউডের সংখ্যা এনে লোকালে বসায়; অতিথি অবস্থায় জমানো সংখ্যা ও রেফারেল-কোড অ্যাকাউন্টে যোগ হয়
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
      if (validCode(d.refCode)) {
        try { localStorage.setItem(MY_CODE_KEY, d.refCode); localStorage.setItem(OWNED_KEY, d.refCode); } catch { /* ignore */ }
      } else {
        const mine = await ensureRefDoc();
        try { await updateDoc(ref, { refCode: mine }); } catch { /* ignore */ }
      }
      save();
      await flushPoints();
    } else {
      const { durood, xp } = cur.pend;
      const mine = await ensureRefDoc();
      await setDoc(ref, { ...profileFields(), durood, xp, total: durood, week: weekId(), weekDurood: 0, refCode: mine, updatedAt: new Date().toISOString() });
      cur.uid = user.uid;
      cur.pend = { durood: 0, xp: 0 };
      save();
    }
    await ensureRefDoc();
    await refreshOwn();
  } catch { /* অফলাইন/নিয়ম-ত্রুটি: লোকালেই থাকে, পরে আবার চেষ্টা */ }
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
  if (POINTS.perDurood > 0) {
    addXp(amount * POINTS.perDurood);
  }
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

// কুইজ/পরীক্ষা সম্পূর্ণ করার বোনাস
export function addQuizBonus(bonusXp) {
  if (!bonusXp || bonusXp <= 0) return 0;
  addXp(bonusXp);
  save();
  scheduleFlush();
  return bonusXp;
}

// ---- রেফারেল (আসা দর্শকের দিক) ও মাল্টি-টিয়ার চেইন ----
export function captureReferral() {
  try {
    const q = new URLSearchParams(window.location.search);
    let ref = q.get('r') || q.get('ref');
    let chainParam = q.get('c') || q.get('via') || q.get('chain');

    if (!ref && typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.slice(window.location.hash.indexOf('?'));
      const hashParams = new URLSearchParams(hashQuery);
      ref = hashParams.get('r') || hashParams.get('ref');
      chainParam = chainParam || hashParams.get('c') || hashParams.get('via') || hashParams.get('chain');
    }

    if (ref && validCode(ref)) {
      if (!localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, ref);
      let chain = [ref];
      if (chainParam) {
        const ancestors = chainParam.split(/[.,_]/).map((x) => x.trim()).filter((x) => validCode(x));
        chain = [...new Set([ref, ...ancestors])];
      }
      try {
        const existing = JSON.parse(localStorage.getItem(REF_CHAIN_KEY) || '[]');
        if (Array.isArray(existing)) chain = [...new Set([...chain, ...existing])];
      } catch {}
      localStorage.setItem(REF_CHAIN_KEY, JSON.stringify(chain.slice(0, 10)));
    }
  } catch { /* ignore */ }
}

// এই দর্শক অন্যের লিংকে এসে থাকলে তার পড়া দুরূদ চেইনের প্রতিটি রেফারারের হিসাবে জমা হয় (একবারে সর্বোচ্চ ২০০)
export async function creditReferrer(n) {
  const amount = Math.min(Math.max(Math.floor(n), 0), 200);
  if (!amount || !cloud()) return false;

  let chain = [];
  try {
    const raw = localStorage.getItem(REF_CHAIN_KEY);
    if (raw) chain = JSON.parse(raw);
    const direct = localStorage.getItem(REF_KEY);
    if (direct && !chain.includes(direct)) chain.unshift(direct);
  } catch {}

  const myCode = getMyCode();
  chain = chain.filter((c) => validCode(c) && c !== myCode);
  if (chain.length === 0) return false;

  const first = (() => { try { return localStorage.getItem(REF_JOINED_KEY) !== '1'; } catch { return false; } })();
  const wk = weekId();

  // চেইনের সব রেফারারকে সমপরিমাণ দুরূদ ও এক্সপি পাঠানো
  const tasks = chain.slice(0, 10).map(async (refCode) => {
    try {
      const r = doc(db, 'refcodes', refCode);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(r);
        if (!snap.exists()) return;
        const d = snap.data();
        const weekReferred = d.week === wk ? (Number(d.weekReferred) || 0) + amount : amount;
        const data = { referred: increment(amount), week: wk, weekReferred };
        if (first) data.referredPeople = increment(1);
        tx.update(r, data);
      });
      return true;
    } catch (e) {
      console.warn(`Could not credit refCode ${refCode}:`, e);
      return false;
    }
  });

  const results = await Promise.allSettled(tasks);
  if (first) { try { localStorage.setItem(REF_JOINED_KEY, '1'); } catch { /* ignore */ } }
  return results.some((res) => res.status === 'fulfilled' && res.value === true);
}

// ---- লিডারবোর্ড ----
// লিডারবোর্ড: অনুশীলন, কুইজ ও দুরূদ (+১০ XP) এবং রেফারেল চেইনের অর্জিত মোট XP-র ওপর ভিত্তি করে সাজানো হয়
export async function fetchLeaderboard(max = 100) {
  if (!cloud()) return [];
  const snap = await getDocs(query(collection(db, 'leaderboard'), limit(max * 2)));
  const rows = snap.docs.map((d) => {
    const x = d.data();
    return {
      uid: d.id,
      name: x.name || 'শিক্ষার্থী',
      hideName: Boolean(x.hideName),
      photoURL: x.photoURL || '',
      durood: Number(x.durood) || 0,
      refCode: x.refCode || '',
      referred: 0,
      referredPeople: 0,
      weekOwn: x.week === weekId() ? Number(x.weekDurood) || 0 : 0,
      xp: Number(x.xp) || 0,
    };
  });
  const codes = [...new Set(rows.map((r) => r.refCode).filter((c) => validCode(c)))];
  const byCode = {};
  for (let i = 0; i < codes.length; i += 30) {
    try {
      const part = await getDocs(query(collection(db, 'refcodes'), where(documentId(), 'in', codes.slice(i, i + 30))));
      part.forEach((d) => { byCode[d.id] = d.data(); });
    } catch { /* এই অংশ ছাড়াই চলবে */ }
  }
  return rows
    .map((r) => {
      const c = byCode[r.refCode] || {};
      const referred = Number(c.referred) || 0;
      const weekRef = c.week === weekId() ? Number(c.weekReferred) || 0 : 0;
      const refXp = referred * POINTS.perDurood;
      const totalScore = r.xp + refXp;
      return { 
        ...r, 
        referred, 
        referredPeople: Number(c.referredPeople) || 0, 
        weekRef, 
        refXp,
        total: totalScore, // র‍্যাংক নির্ধারিত হয় মোট XP (কুইজ + দুরূদ + রেফারেল চেইন) দিয়ে
        weekTotal: totalScore 
      };
    })
    .filter((r) => r.xp > 0 || r.durood > 0 || r.referred > 0);
}
