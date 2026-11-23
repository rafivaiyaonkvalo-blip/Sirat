import { db, auth } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toBengaliNumber } from './gamification';
import { getAssetUrl } from './assetHelper';
import { fetchLeaderboard } from '../sirat/points';

// ইন-মেমোরি ক্যাশ (৯০ সেকেন্ড) — যেন বারবার ফায়ারস্টোর রিড বিল না বাড়ে
let cachedUsers = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 90 * 1000;
const BLUR_MY_NAME_KEY = 'uls_leaderboard_blur_my_name';

export function getBlurMyNameSetting() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(BLUR_MY_NAME_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function setBlurMyNameSetting(enabled) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BLUR_MY_NAME_KEY, String(enabled));
      const profStr = localStorage.getItem('uls_student_profile');
      if (profStr) {
        const prof = JSON.parse(profStr);
        prof.hideNameInLeaderboard = Boolean(enabled);
        localStorage.setItem('uls_student_profile', JSON.stringify(prof));
      }
    } catch {}
  }
  cachedUsers = null;
  // ফায়ারবেস ক্লাউডে ইউজারের প্রোফাইলে সেভ করা
  const currentUser = auth?.currentUser;
  if (db && currentUser?.uid) {
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        hideNameInLeaderboard: Boolean(enabled),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync blur name preference:', e);
    }
  }
}

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLastNDateStrings(n = 7) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

const FEMALE_NAME_KEYWORDS = [
  'akhter', 'akter', 'khatun', 'begum', 'jannat', 'fatima', 'fatema', 'aisha', 'ayesha',
  'mariam', 'maryam', 'khadija', 'khadijah', 'zainab', 'amina', 'tasnim', 'nusrat', 'sadia',
  'sumaiya', 'lamiya', 'umme', 'sultana', 'parvin', 'nahar', 'tabassum', 'salma', 'nargis',
  'hafsa', 'farhana', 'tahmina', 'sharmin', 'nasrin', 'samia', 'marzia', 'meem', 'mim',
  'humaira', 'bushra', 'habiba', 'kulsum', 'আক্তার', 'আখতার', 'খাতুন', 'বেগম', 'জান্নাত',
  'ফাতিমা', 'ফাতেমা', 'আয়েশা', 'মারিয়াম', 'মরিয়ম', 'খাদিজা', 'যয়নব', 'জয়নব', 'আমিনা',
  'তাসনিম', 'নুসরাত', 'সাদিয়া', 'সুমাইয়া', 'লামিয়া', 'উম্মে', 'সুলতানা', 'পারভীন', 'নাহার',
  'তাবাসসুম', 'সালমা', 'নারগিস', 'হাফসা', 'ফারহানা', 'তাহমিনা', 'শারমিন', 'নাসরিন', 'মুনিরা',
  'সামিয়া', 'মারজিয়া', 'মীম', 'মিম', 'হুমায়রা', 'বুশরা', 'হাবিবা', 'কুলসুম'
];

export function isFemaleStudent(name, gender, isMasturatFlag) {
  if (gender === 'female' || isMasturatFlag) return true;
  if (!name) return false;
  const lower = name.toLowerCase();
  return FEMALE_NAME_KEYWORDS.some(kw => lower.includes(kw));
}

export function formatStudentPartialName(fullName) {
  if (!fullName) return 'তালিবাত...';
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    return `${parts[0]}...`;
  }
  if (trimmed.length > 5) {
    return `${trimmed.slice(0, 4)}...`;
  }
  return `${trimmed}...`;
}

/**
 * লিডারবোর্ড: অনুশীলন ও কুইজে যার অর্জিত XP বেশি, সে এগিয়ে।
 * ডেটা পাবলিক leaderboard/{uid} থেকে আসে (ইমেইল/ফোন সেখানে থাকে না)।
 */
export async function getLeaderboard(timeframe = 'week', forceRefresh = false) {
  const now = Date.now();
  if (forceRefresh || !cachedUsers || now - lastFetchTime >= CACHE_TTL_MS) {
    try {
      cachedUsers = await fetchLeaderboard(200);
      lastFetchTime = now;
    } catch (err) {
      console.warn('Leaderboard fetch warning:', err);
      cachedUsers = cachedUsers || [];
    }
  }
  const currentUid = auth?.currentUser?.uid || null;
  // লিডারবোর্ড: অনুশীলন, কুইজ, দুরূদ (+১০ XP) ও রেফারেল চেইনের অর্জিত মোট XP
  const scoreOf = (u) => Number(u.total ?? u.xp) || 0;
  const sorted = (cachedUsers || [])
    .filter((u) => scoreOf(u) > 0)
    .sort((a, b) => scoreOf(b) - scoreOf(a))
    .slice(0, 100);

  let rank = 1;
  const items = sorted.map((u, i) => {
    if (i > 0 && scoreOf(u) < scoreOf(sorted[i - 1])) rank = i + 1;
    return {
      uid: u.uid,
      name: u.name,
      hideName: u.hideName,
      photoURL: u.photoURL || getAssetUrl('/madina.jpg'),
      score: scoreOf(u),
      scoreBn: toBengaliNumber(scoreOf(u)),
      xp: u.xp,
      own: u.durood || 0,
      referred: u.referred || 0,
      referredPeople: u.referredPeople || 0,
      isCurrentUser: u.uid === currentUid,
      rank,
      rankBn: toBengaliNumber(rank),
    };
  });
  return {
    items,
    currentUser: items.find((u) => u.isCurrentUser) || null,
    timeframe,
    totalParticipants: items.length,
    activeParticipants: items.length,
  };
}
