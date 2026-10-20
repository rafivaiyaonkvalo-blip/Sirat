import { db, auth } from '../services/firebase';
import { collection, getDocs, query, limit, doc, setDoc } from 'firebase/firestore';
import { getTotalXp, getXpHistory, getLevelInfo, toBengaliNumber } from './gamification';
import { calculateMaxPlausibleXp } from './xpIntegrity';

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
 * ফায়ারস্টোর থেকে সকল শিক্ষার্থীর পাবলিক স্কোর সংগ্রহ করা (ফোন, ইমেইল ইত্যাদি গোপন রেখে)
 */
export async function getRawLeaderboardUsers(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedUsers && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedUsers;
  }

  const rawList = [];

  if (db) {
    try {
      const q = query(collection(db, 'users'), limit(250));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        const data = docSnap.data() || {};
        const profile = data.studentProfile || {};
        const rawName = data.displayName || profile.name || 'শিক্ষার্থী';
        const hideName = Boolean(data.hideNameInLeaderboard || profile.hideNameInLeaderboard);
        const rawPhoto = (data.photoURL || profile.photo || '').trim();
        // ছবি থাকলে আসল ছবি, ফাঁকা থাকলে মদীনা শরীফের পবিত্র ছবি
        const photoURL = rawPhoto ? rawPhoto : '/madina.jpg';

        const maxAllowed = calculateMaxPlausibleXp(data);
        const rawXp = parseInt(data.totalXp || '0', 10) || 0;
        // অ্যান্টি-চিট সিলিং: অসম্ভব বা ফেক XP হলে তা সিলিংয়ে নামিয়ে দেওয়া হয় যাতে প্রতারক লিডারবোর্ড দখল করতে না পারে
        const cleanXp = Math.min(rawXp, maxAllowed);
        const isCheat = rawXp > maxAllowed || Boolean(data.isXpSuspicious);

        rawList.push({
          uid: docSnap.id,
          name: rawName,
          hideName,
          photoURL,
          totalXp: cleanXp,
          isSuspicious: isCheat,
          xpHistory: data.xpHistory && typeof data.xpHistory === 'object' ? data.xpHistory : {},
          streak: data.streakData?.count || 1,
          updatedAt: data.updatedAt || ''
        });
      });
    } catch (err) {
      console.warn('Leaderboard cloud fetch warning:', err);
    }
  }

  // বর্তমান লোকাল ইউজারের সর্বশেষ স্কোর ও হিস্ট্রি ওভারলে করা (যাতে আজকের পয়েন্ট তাৎক্ষণিক দেখা যায়)
  const currentAuthUid = auth?.currentUser?.uid || localStorage.getItem('uls_current_user_uid');
  const localXp = getTotalXp();
  const localHistory = getXpHistory();
  const localProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('uls_student_profile') || '{}');
    } catch {
      return {};
    }
  })();
  const localName = localProfile.name || auth?.currentUser?.displayName || '';
  const localBlur = getBlurMyNameSetting() || Boolean(localProfile.hideNameInLeaderboard);
  const localRawPhoto = (auth?.currentUser?.photoURL || localProfile.photo || '').trim();
  const localPhoto = localRawPhoto ? localRawPhoto : '/madina.jpg';

  if (currentAuthUid) {
    const existingIdx = rawList.findIndex((u) => u.uid === currentAuthUid);
    const existingName = existingIdx >= 0 ? rawList[existingIdx].name : '';
    const resolvedName = localName || existingName || auth?.currentUser?.displayName || 'শিক্ষার্থী';

    const updatedUser = {
      uid: currentAuthUid,
      name: resolvedName,
      hideName: localBlur,
      photoURL: localPhoto,
      totalXp: Math.max(localXp, existingIdx >= 0 ? rawList[existingIdx].totalXp : 0),
      xpHistory: {
        ...(existingIdx >= 0 ? rawList[existingIdx].xpHistory : {}),
        ...localHistory
      },
      streak: parseInt(JSON.parse(localStorage.getItem('uls_daily_streak_data') || '{}')?.count || '1', 10) || 1,
      isCurrentUser: true
    };

    if (existingIdx >= 0) {
      rawList[existingIdx] = { ...rawList[existingIdx], ...updatedUser };
    } else if (localXp > 0) {
      rawList.push(updatedUser);
    }
  } else if (localXp > 0) {
    // গেস্ট ইউজার (লগইন ছাড়া)
    rawList.push({
      uid: 'guest_me',
      name: localName || 'শিক্ষার্থী',
      hideName: localBlur,
      photoURL: localPhoto,
      totalXp: localXp,
      xpHistory: localHistory,
      streak: 1,
      isCurrentUser: true
    });
  }

  cachedUsers = rawList;
  lastFetchTime = now;
  return rawList;
}

/**
 * ফিল্টার অনুযায়ী শিক্ষার্থীদের সাজানো তালিকা
 * @param {'today' | 'week' | 'all'} timeframe 
 * @param {boolean} forceRefresh 
 */
export async function getLeaderboard(timeframe = 'today', forceRefresh = false) {
  const users = await getRawLeaderboardUsers(forceRefresh);
  const todayStr = getTodayString();
  const weekDates = getLastNDateStrings(7);
  const currentUid = auth?.currentUser?.uid || localStorage.getItem('uls_current_user_uid') || 'guest_me';

  const scoredUsers = users.map((u) => {
    let score = 0;
    if (timeframe === 'today') {
      score = u.xpHistory?.[todayStr] || 0;
    } else if (timeframe === 'week') {
      score = weekDates.reduce((sum, date) => sum + (u.xpHistory?.[date] || 0), 0);
    } else {
      score = u.totalXp || 0;
    }

    const isCurrent = u.isCurrentUser || u.uid === currentUid;
    const levelInfo = getLevelInfo(u.totalXp);

    return {
      uid: u.uid,
      name: u.name,
      hideName: u.hideName,
      photoURL: u.photoURL,
      score,
      totalXp: u.totalXp,
      level: levelInfo.level,
      streak: u.streak,
      isCurrentUser: isCurrent
    };
  });

  // স্কোর অনুযায়ী বড় থেকে ছোট সাজানো (XP একই হলে লেভেল অনুযায়ী আগে যাবে)
  scoredUsers.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.level !== a.level) return b.level - a.level;
    return b.totalXp - a.totalXp;
  });

  // র‍্যাংক নম্বর বসানো (স্কোর ও লেভেল বিবেচনায় র‍্যাংক নির্ধারণ)
  let currentRank = 1;
  const rankedList = scoredUsers.map((item, idx) => {
    if (idx > 0) {
      const prev = scoredUsers[idx - 1];
      if (item.score < prev.score || (item.score === prev.score && item.level < prev.level)) {
        currentRank = idx + 1;
      }
    }
    return {
      ...item,
      rank: currentRank,
      rankBn: toBengaliNumber(currentRank),
      scoreBn: toBengaliNumber(item.score)
    };
  });

  // বর্তমান ইউজারের র‍্যাংক খোঁজা
  const currentUserEntry = rankedList.find((u) => u.isCurrentUser) || null;

  return {
    items: rankedList,
    currentUser: currentUserEntry,
    timeframe,
    totalParticipants: rankedList.length,
    activeParticipants: rankedList.filter((u) => u.score > 0).length
  };
}
