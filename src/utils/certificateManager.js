/**
 * certificateManager.js
 * মারকাযুল ঈমান (Markazul Iman) — সীরাত ডিজিটাল সনদপত্র ও স্বীকৃতি ইঞ্জিন
 * 
 * Provides:
 * - Volume completion calculation (১ম খণ্ড, ২য় খণ্ড, ৩য় খণ্ড)
 * - Deterministic Certificate Verification IDs (MI-EAS1-2026-XXXX)
 * - Grade calculation (মুমতাজ / জায়্যিদ জিদ্দান / জায়্যিদ)
 * - Certificate metadata generation
 */

import darsIndex from '../data/darsIndex.json';
import { getTotalXp, getLevelInfo, toBengaliNumber } from './gamification';
import { isSuperUser } from './superUser';

export const TOTAL_DARS = 32;

// সনদের কোর্স: সীরাতের ৩২টি দারস (আইডি 'vol1' রাখা হয়েছে, পুরনো কোডের সঙ্গে সামঞ্জস্যের জন্য)
export const VOLUME_CONFIGS = [
  {
    id: 'vol1',
    volumeNumber: 1,
    title: 'সীরাত (পূর্ণাঙ্গ কোর্স — ৩২ দারস)',
    bookTitle: 'সীরাত: নবীজী ﷺ-এর পবিত্র জীবনচরিত (৩২টি দারস)',
    arabicBookTitle: 'السِّيرَةُ النَّبَوِيَّةُ الشَّرِيفَةُ (٣٢ دَرْسًا)',
    description: 'নবীজী ﷺ-এর পবিত্র জীবনী নিয়ে ৩২টি দারসের পূর্ণাঙ্গ পাঠ্যক্রম',
    totalLessons: TOTAL_DARS,
    minXp: 0
  }
];

/**
 * শিক্ষার্থীর পাঠ সম্পন্ন হওয়ার সংখ্যা ও শতকরা হার বের করা (৩২টি দারসের ভিত্তিতে)
 */
export function getVolumeProgress() {
  let completedCount = 0;
  try {
    const progress = JSON.parse(localStorage.getItem('sirat_progress_v2') || '{}') || {};
    const done = progress.done || {};
    // দারসের প্রতিটি পর্ব সম্পন্ন হলে সেই দারস সম্পন্ন হিসেবে গণ্য
    completedCount = darsIndex.filter(d => 
      d.porbos.length > 0 && d.porbos.every(p => Boolean(done[`${d.id}-${p.no}`]))
    ).length;
  } catch (err) {
    console.warn('Error calculating progress:', err);
  }
  const totalCount = TOTAL_DARS;
  const percent = Math.min(100, Math.round((completedCount / totalCount) * 100));
  return {
    completedCount,
    totalCount,
    remainingCount: Math.max(0, totalCount - completedCount),
    percent,
    isUnlocked: Boolean(completedCount >= totalCount || isSuperUser(null))
  };
}

/**
 * শিক্ষার্থীর ফলাফল ও গ্রেড নির্ধারণ
 */
export function calculateStudentGrade(totalXp = 0, percent = 100) {
  if (percent >= 90 || totalXp >= 800) {
    return {
      gradeBn: 'মুমতাজ (সর্বোচ্চ কৃতিত্ব)',
      gradeAr: 'مُمْتَاز',
      gradeEn: 'Mumtaz (Outstanding)',
      color: '#334155', // emerald
      sealTone: 'gold'
    };
  }
  if (percent >= 75 || totalXp >= 500) {
    return {
      gradeBn: 'জায়্যিদ জিদ্দান (অতি উত্তম)',
      gradeAr: 'جَيِّدٌ جِدًّا',
      gradeEn: 'Jayyid Jiddan (Very Good)',
      color: '#0ea5e9', // sky
      sealTone: 'silver'
    };
  }
  return {
    gradeBn: 'জায়্যিদ (উত্তম)',
    gradeAr: 'جَيِّدٌ',
    gradeEn: 'Jayyid (Good)',
    color: '#d97706', // amber
    sealTone: 'bronze'
  };
}

/**
 * ডিটারমিনিস্টিক সার্টিফিকেট ভেরিফিকেশন আইডি তৈরি
 */
export function generateCertificateId(user, volumeId = 'vol1') {
  const seed = (user?.uid || user?.email || localStorage.getItem('uls_current_user_uid') || 'student')
    .replace(/[^a-zA-Z0-9]/g, '');
  const userPart = (seed.slice(-4) || '7860').toUpperCase();
  const year = new Date().getFullYear();
  const volTag = volumeId.toUpperCase();
  return `MI-${volTag}-${year}-${userPart}`;
}

/**
 * সম্পূর্ণ সনদ তথ্য প্রস্তুত করা
 */
export function getCertificateData(user, profile, volumeId = 'vol1', overrideName = '') {
  const config = VOLUME_CONFIGS.find(v => v.id === volumeId) || VOLUME_CONFIGS[0];
  const progress = getVolumeProgress(volumeId);
  const totalXp = getTotalXp();
  const grade = calculateStudentGrade(totalXp, progress.percent);

  const studentName = (overrideName || profile?.name || user?.displayName || 'শিক্ষার্থী').trim();
  const studentId = `MI-2026-AR${((user?.uid || user?.email || '7860').replace(/[^a-zA-Z0-9]/g, '').slice(-4) || '7860').toUpperCase()}`;
  const certificateId = generateCertificateId(user, volumeId);

  const issueDateBn = new Date().toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const issueDateEn = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    volumeConfig: config,
    studentName,
    studentId,
    certificateId,
    grade,
    progress,
    totalXp,
    issueDateBn,
    issueDateEn,
    organization: 'মারকাযুল ঈমান (Markazul Iman)',
    organizationAr: 'مَرْكَزُ الإِيمَانِ التَّعْلِيمِيُّ',
    madrasaLocation: 'ঢাকা, বাংলাদেশ',
    directorTitle: 'শিক্ষা ও পাঠ্যক্রম পরিচালক',
    directorName: 'মাওলানা মুহাম্মাদ আব্দুল হাকিম',
    quranAyah: {
      arabic: 'لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ',
      bengali: 'নিশ্চয় রাসূলুল্লাহর মাঝে তোমাদের জন্য রয়েছে সর্বোত্তম আদর্শ।',
      surah: 'সূরা আল-আহযাব, আয়াত: ২১'
    }
  };
}
