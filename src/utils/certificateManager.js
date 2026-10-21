/**
 * certificateManager.js
 * মারকাযুল ঈমান (Markazul Iman) — এসো আরবী শিখি ডিজিটাল সনদপত্র ও স্বীকৃতি ইঞ্জিন
 * 
 * Provides:
 * - Volume completion calculation (১ম খণ্ড, ২য় খণ্ড, ৩য় খণ্ড)
 * - Deterministic Certificate Verification IDs (MI-EAS1-2026-XXXX)
 * - Grade calculation (মুমতাজ / জায়্যিদ জিদ্দান / জায়্যিদ)
 * - Certificate metadata generation
 */

import lessonsData from '../data/lessons.json';
import { getTotalXp, getLevelInfo, toBengaliNumber } from './gamification';
import { isSuperUser } from './superUser';

// খণ্ডভিত্তিক পাঠের তালিকা
export const VOLUME_CONFIGS = [
  {
    id: 'vol1',
    volumeNumber: 1,
    title: '১ম খণ্ড (মৌলিক স্তর)',
    bookTitle: 'এসো আরবী শিখি (১ম খণ্ড) ও আত-তামরীনুল কিতাবী',
    arabicBookTitle: 'دُرُوسُ اللُّغَةِ الْعَرَبِيَّةِ — الْجُزْءُ الأَوَّلُ',
    description: 'মৌলিক শব্দভাণ্ডার, কাছে-দূরের ইশারা, সম্বন্ধযুক্ত শব্দ ও গুণবাচক বাক্য',
    totalLessons: 23,
    minXp: 400
  },
  {
    id: 'vol2',
    volumeNumber: 2,
    title: '২য় খণ্ড (মধ্যম স্তর)',
    bookTitle: 'এসো আরবী শিখি (২য় খণ্ড) ও আত-তামরীনুল কিতাবী',
    arabicBookTitle: 'دُرُوسُ اللُّغَةِ الْعَرَبِيَّةِ — الْجُزْءُ الثَّانِي',
    description: 'ক্রিয়াপদ, বাবে নাসারা, যারাবা, ফাতাহা ও ব্যবহারিক বাক্যমালা',
    totalLessons: 30,
    minXp: 1200
  },
  {
    id: 'vol3',
    volumeNumber: 3,
    title: '৩য় খণ্ড (উচ্চতর স্তর)',
    bookTitle: 'এসো আরবী শিখি (৩য় খণ্ড) ও আত-তামরীনুল কিতাবী',
    arabicBookTitle: 'دُرُوسُ اللُّغَةِ الْعَرَبِيَّةِ — الْجُزْءُ الثَّالِثُ',
    description: 'উচ্চতর ভাষা, কুরআন-হাদীসের পাঠ ও সাহিত্যিক বাক্যমালা',
    totalLessons: 28,
    minXp: 2500
  }
];

/**
 * শিক্ষার্থীর খণ্ডভিত্তিক পাঠ সম্পন্ন হওয়ার সংখ্যা ও শতকরা হার বের করা
 */
export function getVolumeProgress(volumeId = 'vol1') {
  const config = VOLUME_CONFIGS.find(v => v.id === volumeId) || VOLUME_CONFIGS[0];
  
  let completedCount = 0;
  try {
    const progress = JSON.parse(localStorage.getItem('uls_lessons_progress') || '{}') || {};
    const lessons = lessonsData.lessons || [];
    
    // নির্দিষ্ট ভলিউমের পাঠগুলো ফিল্টার করা
    const volLessons = lessons.filter(l => {
      if (volumeId === 'vol1') return l.id.startsWith('vol1') || l.volume === 1 || l.volume === '১ম খণ্ড';
      if (volumeId === 'vol2') return l.id.startsWith('vol2') || l.volume === 2 || l.volume === '২য় খণ্ড';
      if (volumeId === 'vol3') return l.id.startsWith('vol3') || l.volume === 3 || l.volume === '৩য় খণ্ড';
      return false;
    });

    const totalCount = volLessons.length || config.totalLessons;
    volLessons.forEach(l => {
      if (progress[l.id]?.completed) {
        completedCount++;
      }
    });

    const percent = Math.min(100, Math.round((completedCount / (totalCount || 1)) * 100));
    const isUnlocked = Boolean((completedCount >= totalCount && totalCount > 0) || isSuperUser(null));
    
    return {
      completedCount,
      totalCount,
      remainingCount: Math.max(0, totalCount - completedCount),
      percent,
      isUnlocked
    };
  } catch (err) {
    console.warn('Error calculating volume progress:', err);
    return {
      completedCount: 0,
      totalCount: config.totalLessons,
      remainingCount: config.totalLessons,
      percent: 0,
      isUnlocked: Boolean(isSuperUser(null))
    };
  }
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
      color: '#059669', // emerald
      sealTone: 'gold'
    };
  }
  if (percent >= 75 || totalXp >= 500) {
    return {
      gradeBn: 'জায়্যিদ জিদ্দান (অতি উত্তম)',
      gradeAr: 'جَيِّدٌ جِدًّا',
      gradeEn: 'Jayyid Jiddan (Very Good)',
      color: '#0284c7', // sky
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
      arabic: 'إِنَّا أَنْزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَعَلَّكُمْ تَعْقِلُونَ',
      bengali: 'নিশ্চয় আমি একে অবতীর্ণ করেছি আরবী ভাষায় কুরআনরূপে, যাতে তোমরা বুঝতে পারো।',
      surah: 'সূরা ইউসুফ, আয়াত: ২'
    }
  };
}
