// সম্মিলিত দুরূদ গণনা: Firestore ডক campaigns/durood { count, target, participants, countries: { BD: n, ... } }
// Firebase কনফিগ (VITE_FIREBASE_*) না থাকলে cloudEnabled() মিথ্যা, তখন শুধু ব্যক্তিগত গণনা চলে।
// নিরাপত্তা নিয়ম: firestore.rules (ফাইলটি Firebase কনসোলের Rules-এ বসাতে হয়)
import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import { getLang } from '../i18n';

export const cloudEnabled = () => isFirebaseConfigured() && !!db;

const ref = () => doc(db, 'campaigns', 'durood');

// লাইভ মোট; ত্রুটি হলে cb(null)
export function subscribeGlobal(cb) {
  if (!cloudEnabled()) return () => {};
  return onSnapshot(
    ref(),
    (snap) => {
      const d = snap.exists() ? snap.data() : {};
      cb({ count: Number(d.count) || 0, target: Number(d.target) || 0, participants: Number(d.participants) || 0, countries: d.countries || {} });
    },
    () => cb(null),
  );
}

// একবারে সর্বোচ্চ MAX_BATCH যোগ হয়; বাকিটা পরের ফ্লাশে
export const MAX_BATCH = 200;

// country: দুই অক্ষরের কোড (যেমন BD); newParticipant: এই ডিভাইসের প্রথমবার
export async function addToGlobal(n, { country, newParticipant } = {}) {
  const amount = Math.min(Math.max(Math.floor(n), 0), MAX_BATCH);
  if (!amount || !cloudEnabled()) return 0;
  const data = { count: increment(amount) };
  if (newParticipant) data.participants = increment(1);
  if (country) data.countries = { [country]: increment(amount) };
  await setDoc(ref(), data, { merge: true });
  return amount;
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
