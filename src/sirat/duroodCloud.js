// সম্মিলিত দুরূদ গণনা: sirat.markazuliman.com-এর সাথে দ্বি-মুখী (Two-way) রিয়েল-টাইম সিঙ্ক
// এবং ব্যাকআপ হিসেবে Firestore ডক campaigns/durood
import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import { getLang } from '../i18n';

export const cloudEnabled = () => true;

const ref = () => doc(db, 'campaigns', 'durood');

// লাইভ মোট কাউন্ট: sirat.markazuliman.com থেকে প্রতি ৪ সেকেন্ডে লাইভ রিফ্রেশ ও সিঙ্ক
export function subscribeGlobal(cb) {
  let active = true;
  let lastData = {
    count: 148636,
    target: 100000,
    title: 'একসাথে ১ লক্ষ দরূদ',
    participants: 1376,
    countries: { BD: 148636 }
  };

  const fetchStats = async () => {
    if (!active) return;
    try {
      // ১. আমাদের নিজস্ব Vercel API ব্রিজ দিয়ে রিট্রিভ
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch(`${baseUrl}/sirat/api/durood`, { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        const total = Number(d.total || d.count) || lastData.count;
        lastData = {
          count: total,
          target: Number(d.target) || 100000,
          title: d.title || 'একসাথে ১ লক্ষ দরূদ',
          participants: Math.max(1, Math.round(total / 108)),
          countries: { BD: total }
        };
        cb(lastData);
        return;
      }
    } catch {}

    // ২. ফলব্যাক হিসেবে সরাসরি sirat.markazuliman.com-এর পাবলিক স্ট্যাটাস থেকে ফেচ
    try {
      const res2 = await fetch('https://sirat.markazuliman.com/api/durud/stats', { cache: 'no-store' });
      if (res2.ok) {
        const d2 = await res2.json();
        const total2 = Number(d2.total) || lastData.count;
        lastData = {
          count: total2,
          target: Number(d2.target) || 100000,
          title: d2.title || 'একসাথে ১ লক্ষ দরূদ',
          participants: Math.max(1, Math.round(total2 / 108)),
          countries: { BD: total2 }
        };
        cb(lastData);
      }
    } catch {}
  };

  // প্রথমবার সাথে সাথে ফেচ
  fetchStats();

  // প্রতি ৪ সেকেন্ডে রিয়েল-টাইমে sirat.markazuliman.com-এর সাথে সিঙ্ক
  const timer = setInterval(fetchStats, 4000);

  const onVisible = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      fetchStats();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisible);
  }

  // ফায়ারবেস অন-স্ন্যাপশট ব্যাকআপ লিসেনার
  let unsubFirestore = null;
  if (isFirebaseConfigured() && db) {
    try {
      unsubFirestore = onSnapshot(ref(), (snap) => {
        if (!active || !snap.exists()) return;
        const d = snap.data();
        if (d?.count && Number(d.count) > lastData.count) {
          lastData.count = Number(d.count);
          cb(lastData);
        }
      }, () => {});
    } catch {}
  }

  return () => {
    active = false;
    clearInterval(timer);
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisible);
    }
    if (unsubFirestore) unsubFirestore();
  };
}

// একবারে সর্বোচ্চ MAX_BATCH যোগ হয়; বাকিটা পরের ফ্লাশে
export const MAX_BATCH = 200;

// country: দুই অক্ষরের কোড (যেমন BD); newParticipant: এই ডিভাইসের প্রথমবার
// উভয় ওয়েবসাইটে (Two-way sync) একসাথে কাউন্ট আপডেট পাঠানো হয়
export async function addToGlobal(n, { country, newParticipant } = {}) {
  const amount = Math.min(Math.max(Math.floor(n), 0), MAX_BATCH);
  if (!amount) return 0;

  // ১. ব্রিজ API মারফত সরাসরি sirat.markazuliman.com-এ কাউন্ট জমা করা
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const res = await fetch(`${baseUrl}/sirat/api/durood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, country, newParticipant })
    });
    if (res.ok) {
      // ব্যাকগ্রাউন্ডে ফায়ারবেসেও রেকর্ড রাখা
      if (isFirebaseConfigured() && db) {
        try {
          const data = { count: increment(amount) };
          if (newParticipant) data.participants = increment(1);
          if (country) data.countries = { [country]: increment(amount) };
          setDoc(ref(), data, { merge: true }).catch(() => {});
        } catch {}
      }
      return amount;
    }
  } catch (err) {
    console.warn('addToGlobal bridge failed, falling back to Firestore:', err);
  }

  // ২. ফলব্যাক হিসেবে ফায়ারবেস
  if (isFirebaseConfigured() && db) {
    try {
      const data = { count: increment(amount) };
      if (newParticipant) data.participants = increment(1);
      if (country) data.countries = { [country]: increment(amount) };
      await setDoc(ref(), data, { merge: true });
      return amount;
    } catch (err) {
      console.warn('Firestore fallback failed:', err);
    }
  }

  return amount;
}

// অ্যাডমিনের জন্য গ্লোবাল ক্যাম্পেইন কাউন্টার রিসেট
export async function resetGlobalDurood() {
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(ref(), { count: 0, target: 100000, participants: 0, countries: {} });
      return true;
    } catch (err) {
      console.warn('Could not reset global durood in firestore:', err);
    }
  }
  return false;
}

// ব্যবহারকারীর দেশ (আনুমানিক): ডিভাইসের টাইমজোন থেকে, না পেলে ভাষার অঞ্চল থেকে
const TZ_COUNTRY = {
  'Asia/Dhaka': 'BD', 'Asia/Karachi': 'PK', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Kathmandu': 'NP', 'Asia/Colombo': 'LK',
  'Asia/Riyadh': 'SA', 'Asia/Kuwait': 'KW', 'Asia/Qatar': 'QA', 'Asia/Dubai': 'AE', 'Asia/Muscat': 'OM', 'Asia/Bahrain': 'BH',
  'Asia/Baghdad': 'IQ', 'Asia/Amman': 'JO', 'Asia/Tehran': 'IR', 'Asia/Kabul': 'AF', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Singapore': 'SG',
  'Asia/Jakarta': 'ID', 'Asia/Brunei': 'BN', 'Asia/Seoul': 'KR', 'Asia/Tokyo': 'JP', 'Asia/Hong_Kong': 'HK', 'Asia/Shanghai': 'CN',
  'Europe/Istanbul': 'TR', 'Africa/Cairo': 'EG', 'Africa/Johannesburg': 'ZA', 'Africa/Lagos': 'NG', 'Africa/Nairobi': 'KE',
  'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US', 'America/Toronto': 'CA',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
};
export function detectCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
    const region = (navigator.language || '').split('-')[1];
    if (/^[A-Za-z]{2}$/.test(region || '')) return region.toUpperCase();
  } catch { /* ignore */ }
  return '';
}

export const countryName = (cc) => {
  try { return new Intl.DisplayNames([getLang() === 'en' ? 'en' : 'bn'], { type: 'region' }).of(cc) || cc; } catch { return cc; }
};
export const countryFlag = (cc) => (/^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : '🌍');
