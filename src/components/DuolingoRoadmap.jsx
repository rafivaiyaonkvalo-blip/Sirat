import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Star, CheckCircle2, Trophy, Flame, Play, Sparkles, BookOpen, 
  Compass, Award, PenTool, ArrowRight, Volume2, VolumeX, ShieldCheck,
  Lock, AlertCircle, FileText, X, ChevronDown, ChevronUp, MessageSquare, Clock, Info,
  ChevronRight, Layers, LayoutGrid, GitBranch, Zap
} from 'lucide-react';
import { getStreakData, getTotalXp, getRankTitle } from '../utils/gamification';
import { isSoundMuted, toggleSoundMute, playMistakeNotice, useSoundMuted } from '../utils/soundEffects';
import { tamrinParts, getTamrinWordGroups } from '../data/tamrinKitabiData';
import QaidaCard, { QaidaButton } from './QaidaCard';
import { 
  LESSON_SUB_UNITS, 
  getLessonSubUnitsInfo, 
  getSubUnitProgressStatus, 
  isSubUnitUnlocked,
  getDynamicLessonStages
} from '../utils/lessonSubSections';
import { isSuperUser as isSuperUserHelper } from '../utils/superUser';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return '';
  return String(num).replace(/\d/g, d => BENGALI_DIGITS[d]);
};

export const getLessonBengaliNum = (lesson, lIdx) => {
  let num = null;
  if (lesson?.lessonNumberInChapter) {
    num = lesson.lessonNumberInChapter;
  } else if (lesson?.lessonNumber) {
    num = lesson.lessonNumber;
  } else if (lesson?.id) {
    const match = lesson.id.match(/l(\d+)$/);
    if (match) num = parseInt(match[1], 10);
  }
  if (!num) num = (lIdx !== undefined ? lIdx + 1 : 1);
  return toBengaliNumber(num);
};

export const DEMO_STYLES = [
  { id: 'path', num: '১', name: 'ক্লাসিক ডুয়োলিঙ্গো', icon: '🪜', desc: 'ডুয়োলিঙ্গো এস-কার্ভ পেভড রিবন রোড' },
  { id: 'cobblestone', num: '২', name: 'কবলস্টোন ট্রেইল', icon: '🪨', desc: 'আঁকাবাঁকা প্রাচীন পাথুরে পেভমেন্ট' },
  { id: 'island', num: '৩', name: 'আইল্যান্ড ব্রিজ', icon: '🌉', desc: 'নদীতে ভাসমান দ্বীপ ও ঝুলন্ত কাঠের সেতু' },
  { id: 'neon', num: '৪', name: 'সাইবার নিয়ন', icon: '⚡', desc: 'পালসিং নিয়ন গ্লোয়িং লেজার ওয়েভ' },
  { id: 'mountain', num: '৫', name: 'মাউন্টেন সুইচব্যাক', icon: '🏔️', desc: 'পাহাড়ি আল্পাইন সুইচব্যাক ট্র্যাক' },
  { id: 'railway', num: '৬', name: 'রোলারকোস্টার ট্র্যাক', icon: '🛤️', desc: 'আঁকাবাঁকা মেটাল রেল ও স্লিপার লাইন' },
  { id: 'arabesque', num: '৭', name: 'আরাবেস্ক গোল্ড', icon: '🕌', desc: 'স্বর্ণখচিত ক্যালিগ্রাফিক ইসলামিক তোরণ পথ' },
  { id: 'vine', num: '৮', name: 'ফরেস্ট ভাইন', icon: '🌿', desc: 'লতানো প্রাকৃতিক সবুজ ডালপালা ও পাতা' },
  { id: 'river', num: '৯', name: 'রিভার পেবলস', icon: '🌊', desc: 'নীল জলতরঙ্গ ও নদীতীরের মসৃণ নুড়িপাথর' },
  { id: 'highway', num: '১০', name: 'সুপারহাইওয়ে রিবন', icon: '🎢', desc: 'আধুনিক ৩ডি এক্সপ্রেসওয়ে ও রোড স্ট্রাইপ' },
];

export const MAIN_NODE_STYLES = [
  { id: 'liquid_capsule', num: '১', name: 'লিকুইড মেটাল ক্যাপসুল', icon: '🌊', desc: 'Dribbble ও Pinterest অনুকরণে Liquid Metal Capsule Pod' },
  { id: 'liquid_orb', num: '২', name: 'লিকুইড মেটাল ওর্ব', icon: '🔮', desc: 'প্রিজম্যাটিক ক্রোমাটিক ডিসপারসন লিকুইড মেটাল ওর্ব' },
  { id: 'ios_squircle', num: '৩', name: 'অ্যাপল স্কয়ার্কল', icon: '📱', desc: 'আইফোন অ্যাপ আইকন স্টাইলের প্রিমিয়াম স্কয়ার্কল' },
  { id: 'dynamic_island', num: '৪', name: 'ডাইনামিক আইল্যান্ড', icon: '🏝️', desc: 'আইফোন ডাইনামিক আইল্যান্ড ক্যাপসুল পড' },
  { id: 'apple_watch', num: '৫', name: 'অ্যাপল ওয়াচ রিং', icon: '⌚', desc: 'অ্যাপল ওয়াচ অ্যাক্টিভিটি প্রোগ্রেস রিং' },
  { id: 'glass_card', num: '৬', name: 'ফ্রস্টেড গ্লাস কার্ড', icon: '🪟', desc: 'আইওএস কন্ট্রোল সেন্টার ট্রান্সলুসেন্ট টাইল' },
  { id: 'action_button', num: '৭', name: 'অ্যাকশন বাটন', icon: '🔘', desc: 'আইফোন প্রো টাইটানিয়াম হ্যাপটিক বোতাম' },
  { id: 'glossy', num: '৮', name: '৩ডি ডোম', icon: '🔮', desc: 'ক্লাসিক ডুয়োলিঙ্গো ৩ডি ট্যাকটাইল ডোম' },
  { id: 'medallion', num: '৯', name: 'রয়্যাল মেডেলিয়ন', icon: '🏰', desc: 'স্বর্ণখচিত রাজকীয় ক্রেস্ট মেডেল' },
  { id: 'gemstone', num: '১০', name: 'ক্রিস্টাল জেম', icon: '💎', desc: 'ফাসেটেড ৩ডি এমারেল্ড ক্রিস্টাল' },
];

export default function DuolingoRoadmap({ 
  lessonsData, 
  progress = {}, 
  tamrinProgress = {},
  selectedLevelId = 1, 
  onSelectLevel, 
  mode = 'eso_arbi', // 'eso_arbi' or 'tamrin'
  user,
  isSuperUser = false,
  onModeChange,
  onStartLesson,
  onStartTamrin,
  onOpenBookViewer
}) {
  const isUnlockedUser = isSuperUser || isSuperUserHelper(user);
  const [streakInfo, setStreakInfo] = useState(() => getStreakData());
  const [persistedXp, setPersistedXp] = useState(() => getTotalXp());
  const [soundMuted, toggleSound] = useSoundMuted();
  const [lockedNotice, setLockedNotice] = useState(null);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [openQaida, setOpenQaida] = useState(null);
  const [subDesignStyle, setSubDesignStyle] = useState(() => {
    try {
      return localStorage.getItem('uls_sub_design_style') || 'ios_sheet';
    } catch (e) {
      return 'ios_sheet';
    }
  });
  const [mainNodeStyle, setMainNodeStyle] = useState('gemstone');

  useEffect(() => {
    const handleSync = () => {
      setStreakInfo(getStreakData());
      setPersistedXp(getTotalXp());
    };
    handleSync();
    window.addEventListener('uls_progress_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('uls_progress_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [progress, tamrinProgress]);

  // Auto-clear locked notice after 3.2s
  useEffect(() => {
    if (!lockedNotice) return;
    const timer = setTimeout(() => setLockedNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [lockedNotice]);

  const handleToggleSound = () => {
    toggleSound();
  };

  const isTamrinMode = mode === 'tamrin';
  const activeProgress = isTamrinMode ? tamrinProgress : progress;

  // Authentic Tamrin Part vs Eso Arbi Volume
  const currentTamrinPart = tamrinParts.find(p => p.id === selectedLevelId) || tamrinParts[0];
  // কিতাবের শেষের নতুন শব্দের তালিকা
  const partWordGroups = useMemo(() => getTamrinWordGroups(currentTamrinPart?.id), [currentTamrinPart]);

  // তামরীন ও নতুন শব্দের সমন্বিত একক রোডম্যাপ নোড তালিকা (প্রতিটি সেটের জন্য আলাদা নোড)
  const tamrinRoadItems = useMemo(() => {
    if (!isTamrinMode || !currentTamrinPart) return [];
    const items = [];
    const placedGroupIds = new Set();

    (currentTamrinPart.tamrins || []).forEach((tamrin, tIdx) => {
      // যদি এই তামরীনের পূর্বে নতুন শব্দের তালিকা থাকে (যেমন তামরীন ১ এর আগে তামরীন ১-১০ এর শব্দ)
      if ((tamrin.subIndex || 1) === 1) {
        const matchingGroup = partWordGroups.find(
          (wg) => wg.from === tamrin.tamrinNumber && !placedGroupIds.has(wg.id)
        );
        if (matchingGroup) {
          placedGroupIds.add(matchingGroup.id);
          (matchingGroup.sets || []).forEach((set, sIdx) => {
            items.push({
              type: 'wordSet',
              id: set.id,
              set,
              group: matchingGroup,
              setIndex: sIdx + 1,
              totalSets: matchingGroup.sets.length,
              fromTamrin: tamrin
            });
          });
        }
      }

      items.push({
        type: 'tamrin',
        id: tamrin.id,
        tamrin,
        tIdx
      });
    });

    // অবশিষ্টাংশ কোনো নতুন শব্দের গ্রুপ থাকলে (যেমন সাধারণ পরিশিষ্ট)
    partWordGroups.forEach((wg) => {
      if (!placedGroupIds.has(wg.id)) {
        placedGroupIds.add(wg.id);
        (wg.sets || []).forEach((set, sIdx) => {
          items.push({
            type: 'wordSet',
            id: set.id,
            set,
            group: wg,
            setIndex: sIdx + 1,
            totalSets: wg.sets.length,
            fromTamrin: null
          });
        });
      }
    });

    return items;
  }, [isTamrinMode, currentTamrinPart, partWordGroups]);

  const currentLevel = lessonsData.levels.find(l => l.id === selectedLevelId) || lessonsData.levels[0];
  const chapters = currentLevel.chapters || [];

  // Calculate progress for current volume or current tamrin part
  const volumeLessons = useMemo(() => {
    if (isTamrinMode) {
      return currentTamrinPart ? currentTamrinPart.tamrins : [];
    }
    return lessonsData.lessons.filter(l => 
      l.volumeId === selectedLevelId || 
      l.volumeId === `vol${selectedLevelId}` || 
      l.chapterId?.startsWith(`vol${selectedLevelId}-`)
    );
  }, [lessonsData, selectedLevelId, isTamrinMode, currentTamrinPart]);

  const volumeCompletedCount = useMemo(() => {
    return volumeLessons.filter(l => activeProgress[l.id]?.completed).length;
  }, [volumeLessons, activeProgress]);

  const volumeProgress = useMemo(() => {
    if (isTamrinMode) return { done: volumeCompletedCount, total: volumeLessons.length };
    return volumeLessons.reduce((acc, lesson) => {
      const status = getSubUnitProgressStatus(lesson, activeProgress);
      return { done: acc.done + status.completedCount, total: acc.total + status.totalCount };
    }, { done: 0, total: 0 });
  }, [isTamrinMode, volumeLessons, volumeCompletedCount, activeProgress]);

  const volumePercent = Math.round((volumeProgress.done / Math.max(1, volumeProgress.total)) * 100);

  // Student Gamification Level derived directly from total XP (synced with Profile & Cloud)
  const rankTitle = getRankTitle(persistedXp);

  const totalStars = useMemo(() => {
    return Object.values(activeProgress).reduce((acc, p) => acc + (p?.stars || (p?.completed ? 3 : 0)), 0);
  }, [activeProgress]);

  // Precalculate volume stages metadata across all volumes in exact chapter & lesson visual order
  // so that Volume 2 continues seamlessly from Volume 1 (1 -> 170 in Vol 1, 171 -> 413 in Vol 2, 414 -> 564 in Vol 3)
  const volumeStagesMap = useMemo(() => {
    if (isTamrinMode) return new Map();
    const map = new Map();
    let counter = 0;
    const allLevels = lessonsData?.levels || [];
    allLevels.forEach(level => {
      const lvlChapters = level.chapters || [];
      lvlChapters.forEach(chapter => {
        const chLessons = lessonsData.lessons.filter(l => l.chapterId === chapter.id);
        chLessons.forEach(lesson => {
          const stages = getDynamicLessonStages(lesson);
          stages.forEach((stage, sIdx) => {
            counter += 1;
            map.set(`${lesson.id}_${stage.id}`, {
              globalStageIdx: counter - 1,
              serialNumber: counter,
              bengaliSerial: toBengaliNumber(counter),
              sIdx,
              totalStages: stages.length,
              lessonId: lesson.id,
              stageId: stage.id
            });
          });
        });
      });
    });
    return map;
  }, [lessonsData, isTamrinMode]);

  // Visual list of all stages across all levels in exact order (1 -> 564)
  const allStagesList = useMemo(() => {
    if (isTamrinMode) return [];
    const list = [];
    const allLevels = lessonsData?.levels || [];
    allLevels.forEach(level => {
      const lvlChapters = level.chapters || [];
      lvlChapters.forEach(chapter => {
        const chLessons = lessonsData.lessons.filter(l => l.chapterId === chapter.id);
        chLessons.forEach((lesson, lIdx) => {
          const stages = getDynamicLessonStages(lesson);
          stages.forEach((stage, sIdx) => {
            list.push({
              lesson,
              lIdx,
              stage,
              sIdx,
              levelId: level.id,
              key: `${lesson.id}_${stage.id}`
            });
          });
        });
      });
    });
    return list;
  }, [lessonsData, isTamrinMode]);

  // Responsive zigzag offsets for the Duolingo winding snake path (prominent zigzag on both mobile and desktop)
  const stepOffsets = [
    '-translate-x-14 sm:-translate-x-22', // Peak Left
    '-translate-x-7 sm:-translate-x-11',  // Mid Left
    'translate-x-7 sm:translate-x-11',    // Mid Right
    'translate-x-14 sm:translate-x-22',   // Peak Right
    'translate-x-7 sm:translate-x-11',    // Mid Right
    '-translate-x-7 sm:-translate-x-11',  // Mid Left
  ];

  // ক্বায়েদা বোতামের পাশ: দুই পর্বের মাঝামাঝি অবস্থানে, ওভারল্যাপ এড়াতে সঠিক দিকে
  const qaidaSideClass = (globalStageIdx) => {
    const STEP_OFFSET_UNITS = [-14, -7, 7, 14, 7, -7];
    const n = STEP_OFFSET_UNITS.length;
    const current = STEP_OFFSET_UNITS[globalStageIdx % n];
    const previous = STEP_OFFSET_UNITS[(globalStageIdx - 1 + n) % n];

    if (current < 0) {
      // নোড বাঁয়ে: আগের নোড ডানে থাকলে (ডান থেকে বাঁয়ে ক্রস) বাঁয়ে পুশ, অন্যথায় কেন্দ্রের ফাঁকা স্থানে (ডানে)
      return previous > 0 ? 'right-full mr-1 sm:mr-1.5' : 'left-full ml-1 sm:ml-1.5';
    } else {
      // নোড ডানে: আগের নোড বাঁয়ে থাকলে (বাঁ থেকে ডানে ক্রস) ডানে পুশ, অন্যথায় কেন্দ্রের ফাঁকা স্থানে (বাঁয়ে)
      return previous < 0 ? 'left-full ml-1 sm:ml-1.5' : 'right-full mr-1 sm:mr-1.5';
    }
  };

  // Helper to check if a specific stage is completed
  const isStageDone = (lessonId, stageId) => {
    if (isUnlockedUser) return true;
    const p = activeProgress[lessonId];
    if (!p) return false;
    // 1. If entire lesson is marked completed, all its stages are done!
    if (p.completed) return true;

    // 2. Direct match in completedSubUnits
    if (Array.isArray(p.completedSubUnits) && p.completedSubUnits.includes(stageId)) {
      return true;
    }

    // 3. Adapter check for legacy sub-unit IDs (vocab, sentences, dialogues, tamrin_quiz)
    const subStatus = getSubUnitProgressStatus(lessonId, activeProgress);
    return subStatus.completedSubUnits.includes(stageId);
  };

  // Helper to check if an entire lesson is completed
  const isLessonCompleted = (lessonId) => {
    if (isUnlockedUser) return true;
    const p = activeProgress[lessonId];
    if (!p) return false;
    if (p.completed) return true;
    const subStatus = getSubUnitProgressStatus(lessonId, activeProgress);
    return subStatus.isFullyCompleted;
  };

  // Strict Sequential Stage Unlocking: Each completed button unlocks the next button!
  const checkStageUnlocked = (globalStageIdx, lesson, stage) => {
    if (isUnlockedUser) return true;
    // 1. If already completed, always unlocked for review
    if (isStageDone(lesson.id, stage.id)) return true;

    // 2. The very first stage of Volume 1 is unconditionally unlocked
    if (globalStageIdx === 0) return true;

    // 3. Sequential rule: Unlocked if the immediately preceding button on the snake trail is done!
    const prevStage = allStagesList[globalStageIdx - 1];
    if (prevStage) {
      return isStageDone(prevStage.lesson.id, prevStage.stage.id);
    }

    return false;
  };

  // Helper to get the last tamrin ID of a part
  const getTamrinPartLastId = (partId) => {
    const part = tamrinParts?.find(p => p.id === partId);
    if (!part || !part.tamrins || part.tamrins.length === 0) return null;
    return part.tamrins[part.tamrins.length - 1]?.id || (partId === 1 ? 'tamrin-p1-t30' : partId === 2 ? 'tamrin-p2-t10' : 'tamrin-p3-t68');
  };

  // Strict Tamrin Unlocking Logic (ধারাবাহিক আনলকিং: পূর্ববর্তী তামরীন সম্পন্ন হলেই পরবর্তী তামরীন আনলক হয়)
  const checkTamrinUnlocked = (tamrin, tIdx) => {
    if (isUnlockedUser) return true;
    if (activeProgress[tamrin.id]?.completed) return true;

    // ১ম তামরীন (Part 1 এর ১ম তামরীন) সবার জন্য উন্মুক্ত ও সর্বদা আনলক
    if (currentTamrinPart.id === 1 && tIdx === 0) return true;

    // First tamrin of subsequent parts unlocks ONLY IF previous part's final tamrin is completed
    if (tIdx === 0) {
      if (currentTamrinPart.id > 1) {
        const prevPartLastId = getTamrinPartLastId(currentTamrinPart.id - 1);
        return !!activeProgress[prevPartLastId]?.completed;
      }
      return false;
    }

    // একই পর্বের মধ্যে: পূর্ববর্তী তামরীন সম্পন্ন হলে পরবর্তীটি আনলক হবে
    const priorTamrin = currentTamrinPart.tamrins[tIdx - 1];
    return !!activeProgress[priorTamrin?.id]?.completed;
  };

  // বর্তমান সক্রিয় পর্ব (Ongoing / Target Porbo) যা ব্যবহারকারীর সামনে থাকবে
  const activeStageInfo = useMemo(() => {
    if (isTamrinMode) {
      // ১. পূর্বে ভিজিট করা বা শুরু করা তামরীন থাকলে (যদি তা আনলকড হয়)
      try {
        const saved = localStorage.getItem('uls_last_active_porbo');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.mode === 'tamrin' && parsed?.tamrinId) {
            const found = (currentTamrinPart?.tamrins || []).find(t => t.id === parsed.tamrinId);
            if (found) {
              const fIdx = currentTamrinPart.tamrins.findIndex(t => t.id === found.id);
              if (checkTamrinUnlocked(found, Math.max(0, fIdx))) {
                return { tamrin: found, key: found.id };
              }
            }
            for (const wg of partWordGroups) {
              const foundSet = (wg.sets || []).find(s => s.id === parsed.tamrinId);
              if (foundSet) return { tamrin: foundSet, key: foundSet.id };
            }
          }
        }
      } catch (e) {}

      // ২. বর্তমান অংশের প্রথম আনলকড ও অসমাপ্ত তামরীন বা নতুন শব্দ
      const current = tamrinRoadItems.find((item) => {
        if (item.type === 'wordSet') {
          const set = item.set;
          const isCompleted = !!activeProgress[set.id]?.completed;
          const tIdx = item.fromTamrin ? currentTamrinPart.tamrins.findIndex(t => t.id === item.fromTamrin.id) : 0;
          const isUnlocked = item.fromTamrin 
            ? checkTamrinUnlocked(item.fromTamrin, Math.max(0, tIdx)) 
            : (currentTamrinPart.tamrins.length ? checkTamrinUnlocked(currentTamrinPart.tamrins[0], 0) : true);
          return !isCompleted && isUnlocked;
        }
        const tamrin = item.tamrin;
        const isCompleted = !!activeProgress[tamrin.id]?.completed || isUnlockedUser;
        const isUnlocked = checkTamrinUnlocked(tamrin, item.tIdx);
        return !isCompleted && isUnlocked;
      });
      if (current) {
        const target = current.type === 'wordSet' ? current.set : current.tamrin;
        return { tamrin: target, key: target.id };
      }
      const firstItem = tamrinRoadItems[0];
      const fallbackTarget = firstItem?.type === 'wordSet' ? firstItem.set : (currentTamrinPart?.tamrins?.[0] || null);
      return fallbackTarget ? { tamrin: fallbackTarget, key: fallbackTarget.id } : null;
    }

    // এসো আরবী শিখি:
    // ১. পূর্বে ব্যবহারকারী যে পর্বে অবস্থান করছিল (saved in localStorage)
    try {
      const saved = localStorage.getItem('uls_last_active_porbo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.mode === 'eso_arbi' && parsed?.lessonId && parsed?.stageId) {
          const match = allStagesList.find(s => s.lesson.id === parsed.lessonId && s.stage.id === parsed.stageId);
          if (match) return match;
        }
      }
    } catch (e) {}

    // ২. প্রথম অসমাপ্ত ও আনলক করা পর্ব (যাতে সরাসরি নতুন বা চলমান পাঠ সামনে থাকে)
    const nextUnfinished = allStagesList.find((s, idx) => {
      const isCompleted = isStageDone(s.lesson.id, s.stage.id);
      const isUnlocked = checkStageUnlocked(idx, s.lesson, s.stage);
      return !isCompleted && isUnlocked;
    });

    return nextUnfinished || allStagesList[0] || null;
  }, [isTamrinMode, currentTamrinPart, tamrinRoadItems, partWordGroups, allStagesList, activeProgress, isUnlockedUser]);

  // সক্রিয় পর্বের সাথে খণ্ড/লেভেল স্বয়ংক্রিয়ভাবে সিঙ্ক করা (যেমন: ব্যবহারকারী ২য় খণ্ডে থাকলে ২য় খণ্ডই খুলবে)
  useEffect(() => {
    if (!isTamrinMode && activeStageInfo?.levelId && activeStageInfo.levelId !== selectedLevelId) {
      if (onSelectLevel) onSelectLevel(activeStageInfo.levelId);
    }
  }, [activeStageInfo?.levelId, selectedLevelId, isTamrinMode, onSelectLevel]);

  // স্বয়ংক্রিয় স্ক্রল: ব্যবহারকারী যে পর্বে অবস্থান করছে তা সরাসরি চোখের সামনে নিয়ে আসা
  useEffect(() => {
    const scrollToTarget = () => {
      let targetId = null;
      if (isTamrinMode) {
        if (activeStageInfo?.tamrin?.id) {
          targetId = `tamrin-node-${activeStageInfo.tamrin.id}`;
        }
      } else {
        if (activeStageInfo?.lesson?.id && activeStageInfo?.stage?.id) {
          targetId = `dars-node-${activeStageInfo.lesson.id}-${activeStageInfo.stage.id}`;
        }
      }

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    const t1 = setTimeout(scrollToTarget, 300);
    const t2 = setTimeout(scrollToTarget, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selectedLevelId, isTamrinMode, activeStageInfo?.key, activeStageInfo?.tamrin?.id]);


  // কিতাবের নতুন শব্দের প্রতিটি সেটের জন্য ডুয়োলিঙ্গো স্লিম জেমস্টোন নোড
  const renderWordSetNode = (item, roadIdx, offsetClass) => {
    const { set, group, fromTamrin } = item;
    const tIdx = fromTamrin ? currentTamrinPart.tamrins.findIndex(t => t.id === fromTamrin.id) : 0;
    const isUnlocked = fromTamrin 
      ? checkTamrinUnlocked(fromTamrin, Math.max(0, tIdx)) 
      : (currentTamrinPart.tamrins.length ? checkTamrinUnlocked(currentTamrinPart.tamrins[0], 0) : true);
    const isCompleted = !!activeProgress[set.id]?.completed;
    const isActive = isUnlocked && !isCompleted;
    const isCurrentActive = activeStageInfo?.tamrin?.id === set.id;

    return (
      <div 
        key={`set-${set.id}`}
        id={`tamrin-node-${set.id}`}
        className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass}`}
      >
        {/* Floating tooltip for active node */}
        {isActive && (
          <div className="animate-bounce mb-1">
            <div className="px-3 py-0.5 rounded-full text-white font-extrabold text-[11px] sm:text-xs shadow-md flex items-center gap-1 bg-amber-600 shadow-amber-600/30">
              <Sparkles size={11} />
              <span>নতুন শব্দ!</span>
            </div>
          </div>
        )}

        {/* Compact Diamond Gemstone Button (Amber / Gold theme for Vocabulary milestone) */}
        <div className="relative flex items-center justify-center p-1.5">
          <button
            type="button"
            disabled={!isUnlocked}
            onClick={() => handleNodeClick(set, isUnlocked, isCompleted)}
            className={`group relative w-12 h-12 sm:w-13 sm:h-13 rotate-45 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
            } ${
              isCurrentActive ? 'ring-4 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900 animate-pulse ' : ''
            }${
              isCompleted
                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 border-2 border-amber-200 shadow-[0_0_22px_rgba(245,158,11,0.85)] animate-pulse hover:scale-105 active:scale-95'
                : isActive
                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 border-2 border-amber-200 shadow-lg shadow-amber-600/25 hover:scale-105 active:scale-95'
                : 'bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border-2 border-slate-400/40 text-slate-400 opacity-80'
            }`}
            title={`${set.title} • ${toBengaliNumber(set.words.length)}টি শব্দ • ${isCompleted ? 'সম্পূর্ণ' : isActive ? 'চলমান' : 'লক'}`}
          >
            {/* Center unrotated Book Icon with Set Number */}
            <div className="-rotate-45 flex flex-col items-center justify-center text-white relative select-none">
              <div className="flex items-center gap-0.5">
                <BookOpen size={12} className={`drop-shadow-sm ${isUnlocked ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="text-[10px] font-black">{toBengaliNumber(set.setIndex)}</span>
              </div>

              {/* Completed checkmark badge */}
              {isCompleted && (
                <div className="absolute -top-3.5 -right-3.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <CheckCircle2 size={12} className="stroke-[3]" />
                </div>
              )}

              {/* Locked indicator */}
              {!isUnlocked && (
                <div className="absolute -bottom-3 -right-3 text-slate-400">
                  <Lock size={11} />
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Clean Label underneath: Set Name & word count */}
        <div className="mt-1 text-center select-none max-w-[130px]">
          <span className="text-[11px] sm:text-xs font-black text-amber-700 dark:text-amber-400 font-bengali leading-tight block truncate">
            {group.from ? `শব্দ ${toBengaliNumber(group.from)}-${toBengaliNumber(group.to)}: সেট ${toBengaliNumber(set.setIndex)}` : `${group.title}: সেট ${toBengaliNumber(set.setIndex)}`}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
            {toBengaliNumber(set.words.length)}টি শব্দ
          </span>
        </div>
      </div>
    );
  };

  const handleNodeClick = (lesson, unlocked, isCompleted) => {
    if (!isUnlockedUser && !unlocked && !isCompleted) {
      playMistakeNotice();
      if (isTamrinMode) {
        if (lesson?.kind === 'words') {
          setLockedNotice('এই নতুন শব্দের তালিকাটি তার প্রথম তামরীন আনলক হলে খুলবে। আগের তামরীনগুলো সম্পন্ন করুন!');
        } else {
          setLockedNotice('তামরীনটি এখনো আনলক করা হয়নি। অনুগ্রহ করে পূর্ববর্তী তামরীন সম্পন্ন করুন!');
        }
      } else {
        setLockedNotice('ধাপটি এখনো আনলক করা হয়নি। অনুগ্রহ করে পূর্ববর্তী ধাপ সম্পন্ন করুন!');
      }
      return;
    }

    if (isTamrinMode) {
      if (onStartTamrin) onStartTamrin(lesson);
    } else {
      const stages = getDynamicLessonStages(lesson);
      const subStatus = getSubUnitProgressStatus(lesson, activeProgress);
      const nextUnit = stages.find(u => !subStatus.completedSubUnits.includes(u.id)) || stages[0];
      if (onStartLesson) {
        onStartLesson(lesson, nextUnit.id);
      }
    }
  };

  const handleSubUnitClick = (e, lesson, unit, isUnlocked, isLessonUnlocked = true) => {
    e?.stopPropagation?.();
    if (!isUnlockedUser && !isUnlocked) {
      playMistakeNotice();
      if (!isLessonUnlocked) {
        setLockedNotice("পাঠটি এখনো আনলক করা হয়নি। অনুগ্রহ করে পূর্ববর্তী পাঠ সম্পন্ন করুন!");
      } else {
        setLockedNotice("এই পর্বটি এখনো লক করা। পূর্ববর্তী পর্ব সম্পন্ন করে এটি আনলক করুন!");
      }
      return;
    }
    if (onStartLesson) {
      onStartLesson(lesson, unit.id);
    }
  };

  const renderUnitIcon = (unitId, size = 18, className = '') => {
    switch (unitId) {
      case 'vocab':
      case 'vocab_b1':
      case 'vocab_b2':
      case 'vocab_b3':
      case 'vocab_b4':
      case 'vocab_core':
      case 'vocab_ext':
        return <BookOpen size={size} className={className} />;
      case 'sentences':
      case 'sentences_p1':
      case 'sentences_p2':
      case 'sentences_dialogues':
      case 'core_sentences_dialogues':
      case 'core_grammar_intro':
        return <Sparkles size={size} className={className} />;
      case 'dialogues':
      case 'dialogues_p1':
      case 'dialogues_p2':
        return <MessageSquare size={size} className={className} />;
      case 'tamrin_p1':
      case 'quiz_mastery':
      case 'tamrin_quiz':
        return <Trophy size={size} className={className} />;
      default:
        return <BookOpen size={size} className={className} />;
    }
  };

  const renderMainNodeButton = (lesson, isUnlocked, isCompleted, isActive, subStatus, lIdx) => {
    const bengaliNum = getLessonBengaliNum(lesson, lIdx);
    const tooltip = isCompleted
      ? `পাঠ ${bengaliNum} সম্পন্ন হয়েছে! পুনরায় চর্চা করতে ট্যাপ করুন।`
      : isActive
      ? `পাঠ ${bengaliNum} শুরু করতে ট্যাপ করুন (${toBengaliNumber(subStatus.completedCount)}/${toBengaliNumber(subStatus.totalCount)} সম্পন্ন)`
      : `পাঠ ${bengaliNum} এখনো আনলক করা হয়নি। পূর্ববর্তী পাঠ সম্পন্ন করে এটি আনলক করুন।`;

    const onClick = () => handleNodeClick(lesson, isUnlocked, isCompleted);

    switch (mainNodeStyle) {
      // 1. Finalized Crystal Gem / Diamond Button (Official & Default)
      case 'gemstone':
      default:
        return (
          <div className="relative flex items-center justify-center p-2">
            <button
              type="button"
              onClick={onClick}
              className={`group relative w-16 h-16 sm:w-18 sm:h-18 rotate-45 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isCompleted
                  ? 'bg-gradient-to-br from-emerald-300 via-emerald-600 to-teal-950 border-2 border-emerald-200 shadow-xl shadow-emerald-500/50 hover:scale-105 active:scale-95'
                  : isActive
                  ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-2 border-teal-200 shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-pulse hover:scale-105 active:scale-95'
                  : 'bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border-2 border-slate-400/40 text-slate-400 opacity-80 cursor-not-allowed'
              }`}
              title={tooltip}
            >
              {/* Center unrotated Bengali Number */}
              <div className="-rotate-45 flex flex-col items-center justify-center text-white relative select-none">
                <span className={`font-bengali font-black text-2xl sm:text-3xl leading-none select-none drop-shadow-md ${
                  isUnlocked ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {bengaliNum}
                </span>

                {/* If completed, small checkmark indicator badge */}
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                    <CheckCircle2 size={12} className="stroke-[3]" />
                  </div>
                )}

                {/* If locked, small lock indicator */}
                {!isUnlocked && (
                  <div className="absolute -bottom-2.5 -right-2.5 text-slate-400">
                    <Lock size={12} />
                  </div>
                )}
              </div>
            </button>
          </div>
        );

      case 'liquid_capsule':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-64 sm:w-72 h-18 sm:h-20 rounded-full p-2 flex items-center gap-3.5 transition-all duration-300 cursor-pointer liquid-metal-capsule hover:scale-[1.02] active:scale-[0.97] ${
              isActive ? 'ring-2 ring-emerald-400/40 shadow-emerald-500/20' : ''
            }`}
            title={tooltip}
          >
            {/* Outer Recessed Bezel for the Orb */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] flex items-center justify-center shrink-0 bg-gradient-to-b from-slate-600/50 to-slate-900/80 shadow-inner">
              {/* Chromatic Dispersion Iridescent Ring (Rainbow reflections like the Dribbble shot) */}
              <div className="absolute inset-0 rounded-full liquid-metal-chromatic-ring opacity-90" />

              {/* Liquid Metal Mercury Disc with curved reflections */}
              <div className="relative z-10 w-full h-full rounded-full liquid-metal-disc flex items-center justify-center shadow-2xl">
                {/* Center Floating White Tactile Squircle (white rounded diamond in reference image) */}
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl liquid-metal-squircle flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'scale-105' : ''
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="stroke-[2.8] text-emerald-600" />
                  ) : isActive ? (
                    <Play size={14} className="fill-slate-900 text-slate-900 translate-x-0.5" />
                  ) : (
                    <Lock size={13} className="text-slate-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Clean Typography: "পাঠ ১" + Single Word Status (Zero clutter!) */}
            <div className="flex-1 text-left min-w-0 pr-3">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm sm:text-base font-normal tracking-wide text-slate-100 font-sans truncate">
                  পাঠ {lesson.id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isCompleted ? 'সম্পূর্ণ' : isActive ? 'চলমান' : 'লক'}
                </span>
              </div>

              {/* Sub-label or mini progress */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span className="truncate text-slate-400 font-arabic">
                  {lesson.arabicTitle || lesson.subTitle || 'الدَّرْسُ'}
                </span>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                  {toBengaliNumber(subStatus.completedCount)}/{toBengaliNumber(subStatus.totalCount)}
                </span>
              </div>
            </div>
          </button>
        );

      // 2. Liquid Metal Prismatic Orb (Standalone round orb with Chromatic Edge)
      case 'liquid_orb':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[2.5px] flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
              isActive ? 'ring-4 ring-emerald-400/40' : ''
            }`}
            title={tooltip}
          >
            {/* Chromatic Dispersion Ring */}
            <div className="absolute inset-0 rounded-full liquid-metal-chromatic-ring opacity-95" />

            {/* Liquid Metal Disc */}
            <div className="relative z-10 w-full h-full rounded-full liquid-metal-disc flex items-center justify-center shadow-2xl">
              {/* Center Floating White Squircle */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl liquid-metal-squircle flex items-center justify-center group-hover:scale-110 transition-transform">
                {isCompleted ? (
                  <CheckCircle2 size={17} className="stroke-[2.8] text-emerald-600" />
                ) : isActive ? (
                  <Play size={15} className="fill-slate-900 text-slate-900 translate-x-0.5" />
                ) : (
                  <Lock size={14} className="text-slate-500" />
                )}
              </div>
            </div>

            {isCompleted && (
              <div className="absolute -bottom-2 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.2 rounded-full shadow-md z-20 border border-amber-200">
                ★ স্টার
              </div>
            )}
          </button>
        );

      // 3. Apple iPhone Squircle App Icon
      case 'ios_squircle':
        return (
          <div className="relative flex items-center justify-center">
            {isUnlocked && (
              <svg 
                className="absolute -inset-2.5 sm:-inset-3 w-[calc(100%+20px)] h-[calc(100%+20px)] sm:w-[calc(100%+24px)] sm:h-[calc(100%+24px)] pointer-events-none -rotate-90 overflow-visible"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-slate-200/60 dark:text-slate-800/60" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  stroke="currentColor" 
                  strokeWidth="3.5" 
                  strokeDasharray={276.46} 
                  strokeDashoffset={276.46 - ((isCompleted ? 100 : (subStatus.completedCount / (subStatus.totalCount || 1)) * 100) / 100) * 276.46} 
                  strokeLinecap="round" 
                  fill="none" 
                  className={`${isCompleted ? 'text-amber-400' : 'text-emerald-500'} transition-all duration-700 ease-out`} 
                />
              </svg>
            )}

            <button
              type="button"
              onClick={onClick}
              className={`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-[22px] sm:rounded-[24px] flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden ${
                isCompleted
                  ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 border border-white/30 hover:scale-105 active:scale-95'
                  : isActive
                  ? 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-400/30 border border-white/35 animate-pulse hover:scale-105 active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700/60 opacity-80 cursor-not-allowed'
              }`}
              title={tooltip}
            >
              {/* Apple Specular Reflection on Top Half */}
              <div className="absolute top-1 left-2.5 right-2.5 h-7 rounded-t-[18px] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

              {isCompleted ? (
                <CheckCircle2 size={32} className="stroke-[2.5] text-white drop-shadow-sm" />
              ) : isActive ? (
                <Play size={28} className="fill-white translate-x-0.5 drop-shadow-sm" />
              ) : (
                <Lock size={22} className="text-slate-400 dark:text-slate-500" />
              )}

              {isCompleted && (
                <div className="absolute -bottom-2.5 bg-amber-400 text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 border border-amber-200">
                  <Star size={9} className="fill-slate-900" />
                  <span>স্টার</span>
                </div>
              )}
            </button>
          </div>
        );

      // 2. Apple Dynamic Island Capsule
      case 'dynamic_island':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-36 sm:w-40 h-13 sm:h-14 rounded-full px-3.5 flex items-center justify-between transition-all duration-200 cursor-pointer shadow-xl ${
              isCompleted
                ? 'bg-black/90 dark:bg-black/95 text-white border border-white/20 shadow-black/40 hover:scale-105 active:scale-95'
                : isActive
                ? 'bg-black/90 dark:bg-black/95 text-white border border-emerald-400/50 shadow-emerald-500/20 ring-2 ring-emerald-400/40 hover:scale-105 active:scale-95 animate-pulse'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 opacity-80 cursor-not-allowed'
            }`}
            title={tooltip}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-300 dark:bg-slate-700 text-slate-400'
              }`}>
                {isCompleted ? <CheckCircle2 size={16} className="stroke-[2.5]" /> : isActive ? <Play size={14} className="fill-white translate-x-0.5" /> : <Lock size={14} />}
              </div>
              <span className="text-xs font-black tracking-tight">পাঠ {lesson.id}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isCompleted ? 'bg-emerald-500/20 text-emerald-400' : isActive ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'
            }`}>
              {isCompleted ? 'সম্পূর্ণ' : isActive ? 'শুরু' : 'লক'}
            </span>
          </button>
        );

      // 3. Apple Watch Activity Progress Ring
      case 'apple_watch':
        return (
          <div className="relative flex items-center justify-center">
            <svg className="w-20 h-20 sm:w-22 sm:h-22 -rotate-90 overflow-visible" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200 dark:text-slate-800" />
              {isUnlocked && (
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeDasharray={263.89} 
                  strokeDashoffset={263.89 - ((isCompleted ? 100 : (subStatus.completedCount / (subStatus.totalCount || 1)) * 100) / 100) * 263.89} 
                  strokeLinecap="round" 
                  fill="none" 
                  className={`${isCompleted ? 'text-amber-400' : 'text-emerald-500'} transition-all duration-700 ease-out`} 
                />
              )}
            </svg>

            <button
              type="button"
              onClick={onClick}
              className={`absolute inset-3 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:scale-105 active:scale-95'
                  : isActive
                  ? 'bg-emerald-500 text-white hover:scale-105 active:scale-95 animate-pulse'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              title={tooltip}
            >
              {isCompleted ? <CheckCircle2 size={24} className="stroke-[2.5]" /> : isActive ? <Play size={22} className="fill-white translate-x-0.5" /> : <Lock size={18} />}
            </button>
          </div>
        );

      // 4. iOS Frosted Acrylic Glass Tile
      case 'glass_card':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl p-2.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-xl ${
              isCompleted
                ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-emerald-400/40 text-emerald-900 dark:text-emerald-100 hover:scale-105 active:scale-95 shadow-emerald-500/10'
                : isActive
                ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border-2 border-emerald-500 text-slate-900 dark:text-white ring-4 ring-emerald-400/20 shadow-emerald-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400 opacity-75 cursor-not-allowed'
            }`}
            title={tooltip}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center mb-1 ${
              isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
            }`}>
              {isCompleted ? <CheckCircle2 size={20} className="stroke-[2.5]" /> : isActive ? <Play size={18} className="fill-white translate-x-0.5" /> : <Lock size={16} />}
            </div>
            <span className="text-[11px] font-black tracking-tight">পাঠ {lesson.id}</span>
          </button>
        );

      // 5. iPhone Titanium Action Button
      case 'action_button':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-[22px] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl ${
              isCompleted
                ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-2 border-amber-400/80 text-amber-300 shadow-black/40 hover:scale-105 active:scale-95'
                : isActive
                ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-2 border-emerald-400 text-emerald-300 shadow-emerald-500/30 ring-4 ring-emerald-400/30 hover:scale-105 active:scale-95 animate-pulse'
                : 'bg-slate-300 dark:bg-slate-800 border border-slate-400/40 text-slate-400 opacity-75 cursor-not-allowed'
            }`}
            title={tooltip}
          >
            {isCompleted ? <CheckCircle2 size={30} className="stroke-[2.5]" /> : isActive ? <Play size={26} className="fill-emerald-300 translate-x-0.5" /> : <Lock size={20} />}
          </button>
        );

      // 6. Classic 3D Tactile Dome
      case 'glossy':
        return (
          <div className="relative flex items-center justify-center">
            {isUnlocked && (
              <svg className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="3.5" fill="none" className="text-slate-200/80 dark:text-slate-800/80" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  stroke="currentColor" 
                  strokeWidth="4.5" 
                  strokeDasharray={276.46} 
                  strokeDashoffset={276.46 - ((isCompleted ? 100 : (subStatus.completedCount / (subStatus.totalCount || 1)) * 100) / 100) * 276.46} 
                  strokeLinecap="round" 
                  fill="none" 
                  className={`${isCompleted ? 'text-amber-400' : 'text-emerald-500'} transition-all duration-700 ease-out`} 
                />
              </svg>
            )}

            <button
              type="button"
              onClick={onClick}
              className={`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500 border-b-6 border-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:translate-y-1'
                  : isActive
                  ? 'bg-emerald-600 border-b-6 border-emerald-800 text-white shadow-xl shadow-emerald-600/40 ring-4 ring-emerald-400/40 animate-pulse hover:bg-emerald-500 active:translate-y-1'
                  : 'bg-slate-200 dark:bg-slate-800 border-b-6 border-slate-300 dark:border-slate-700 text-slate-400 opacity-80 cursor-not-allowed'
              }`}
              title={tooltip}
            >
              {isCompleted ? <CheckCircle2 size={32} className="stroke-[2.5]" /> : isActive ? <Play size={30} className="fill-white translate-x-0.5" /> : <Lock size={24} />}
              {isCompleted && (
                <div className="absolute -bottom-2.5 flex items-center gap-0.5 bg-amber-400 px-2 py-0.5 rounded-full shadow-sm">
                  <Star size={10} className="fill-white text-white" />
                  <Star size={10} className="fill-white text-white" />
                  <Star size={10} className="fill-white text-white" />
                </div>
              )}
            </button>
          </div>
        );

      // 7. Royal Medallion
      case 'medallion':
        return (
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-300 to-yellow-500 text-slate-950 shadow-md border border-amber-200 whitespace-nowrap">
              👑 {lesson.id}
            </div>
            <button
              type="button"
              onClick={onClick}
              className={`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? 'bg-gradient-to-tr from-emerald-950 via-emerald-700 to-teal-600 text-white ring-4 ring-amber-400 ring-offset-2 ring-offset-emerald-950/40 shadow-2xl active:scale-95'
                  : isActive
                  ? 'bg-gradient-to-tr from-teal-400 via-emerald-600 to-emerald-950 text-white ring-4 ring-amber-400 ring-offset-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse active:scale-95'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 ring-2 ring-slate-300 opacity-80 cursor-not-allowed'
              }`}
              title={tooltip}
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border border-dashed border-amber-300/60 flex items-center justify-center">
                {isCompleted ? <CheckCircle2 size={28} className="stroke-[2.5] text-amber-200" /> : isActive ? <Play size={26} className="fill-amber-300 text-amber-300" /> : <Lock size={20} className="text-slate-400" />}
              </div>
            </button>
          </div>
        );

      // 8. Crystal Gem
      case 'crystal':
        return (
          <div className="relative flex items-center justify-center p-2">
            <button
              type="button"
              onClick={onClick}
              className={`group relative w-16 h-16 sm:w-18 sm:h-18 rotate-45 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isCompleted
                  ? 'bg-gradient-to-br from-emerald-300 via-emerald-600 to-teal-950 border-2 border-emerald-200 shadow-xl shadow-emerald-500/50 hover:rotate-90 active:scale-90'
                  : isActive
                  ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-2 border-teal-200 shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-pulse hover:rotate-90 active:scale-90'
                  : 'bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border-2 border-slate-400/40 text-slate-400 opacity-80 cursor-not-allowed'
              }`}
              title={tooltip}
            >
              <div className="-rotate-45 flex items-center justify-center text-white">
                {isCompleted ? <CheckCircle2 size={28} className="stroke-[2.5] text-emerald-100" /> : isActive ? <Play size={26} className="fill-white text-white translate-x-0.5" /> : <Lock size={20} className="text-slate-400" />}
              </div>
            </button>
          </div>
        );

      // 9. Classical Kitab
      case 'book':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-16 h-20 sm:w-18 sm:h-22 rounded-r-2xl rounded-l-md flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-800 border-l-[6px] border-l-amber-600 border-r-4 border-r-amber-100 text-white shadow-2xl hover:scale-105 active:scale-95'
                : isActive
                ? 'bg-gradient-to-r from-emerald-900 via-emerald-700 to-teal-700 border-l-[6px] border-l-amber-500 border-r-4 border-r-amber-200 text-white shadow-2xl ring-4 ring-amber-400/40 hover:scale-105 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 border-l-[6px] border-l-slate-400 border-r-4 border-r-slate-300 text-slate-400 opacity-80 cursor-not-allowed'
            }`}
            title={tooltip}
          >
            <div className="absolute inset-1.5 rounded-r-xl rounded-l-xs border border-amber-400/40 pointer-events-none" />
            <BookOpen size={22} className={`${isUnlocked ? 'text-amber-300' : 'text-slate-400'} mb-1`} />
            <span className="text-[10px] font-bold text-amber-200">পাঠ {lesson.id}</span>
            {isCompleted ? <CheckCircle2 size={16} className="text-emerald-300 mt-1 stroke-[2.5]" /> : isActive ? <Play size={14} className="fill-amber-300 text-amber-300 mt-1" /> : <Lock size={14} className="text-slate-400 mt-1" />}
            <div className="absolute -bottom-3 left-3 w-3 h-5 bg-rose-600 rounded-b shadow-md flex items-end justify-center pointer-events-none">
              <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[5px] border-b-slate-900/30" />
            </div>
          </button>
        );

      // 10. Islamic Mihrab
      case 'mihrab':
        return (
          <button
            type="button"
            onClick={onClick}
            className={`group relative w-17 h-22 sm:w-19 sm:h-24 rounded-t-full rounded-b-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden ${
              isCompleted
                ? 'bg-gradient-to-b from-emerald-600 via-teal-700 to-emerald-950 border-2 border-amber-400/80 shadow-2xl text-white hover:scale-105 active:scale-95'
                : isActive
                ? 'bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-800 border-2 border-amber-300 shadow-[0_0_25px_rgba(16,185,129,0.5)] ring-4 ring-amber-400/30 text-white hover:scale-105 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 border-2 border-slate-400/40 text-slate-400 opacity-80 cursor-not-allowed'
            }`}
            title={tooltip}
          >
            <div className="absolute inset-1 rounded-t-full rounded-b-xl border border-amber-300/40 pointer-events-none" />
            <div className="mt-2 flex flex-col items-center">
              {isCompleted ? <CheckCircle2 size={26} className="stroke-[2.5] text-amber-200" /> : isActive ? <Play size={24} className="fill-white text-white translate-x-0.5" /> : <Lock size={18} className="text-slate-400" />}
              <span className="text-[10px] font-black text-amber-300/90 mt-1">পাঠ {lesson.id}</span>
            </div>
          </button>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 relative">
      {/* Toast Notice for Locked Nodes */}
      {lockedNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-4 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-rose-400/50">
            <AlertCircle size={16} className="shrink-0" />
            <span>{lockedNotice}</span>
          </div>
        </div>
      )}

      {/* Primary Mode Switcher: এসো আরবী শিখি vs আত-তামরীনুল কিতাবী */}
      <div className="flex justify-center mb-5 w-full">
        <div className="w-full max-w-sm sm:w-auto sm:max-w-none grid grid-cols-2 sm:inline-flex p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => onModeChange && onModeChange('eso_arbi')}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              !isTamrinMode
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen size={14} className="shrink-0" />
            <span className="sm:hidden truncate">এসো আরবী</span>
            <span className="hidden sm:inline">এসো আরবী শিখি</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange && onModeChange('tamrin')}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              isTamrinMode
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PenTool size={14} className="shrink-0" />
            <span className="sm:hidden truncate">আত-তামরীন</span>
            <span className="hidden sm:inline">আত-তামরীনুল কিতাবী</span>
          </button>
        </div>
      </div>

      {/* Duolingo Sticky Stats & Volume Switcher Bar - Compact & Sleek (ছোট ও পরিচ্ছন্ন সাইজ) */}
      <div className="sticky top-16 md:top-20 z-30 mb-5 py-1.5 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs sm:shadow-sm flex items-center gap-2 sm:gap-3 transition-all">
        {/* Left: Volume Switcher Dropdown */}
        <select
          value={selectedLevelId}
          onChange={(e) => onSelectLevel(Number(e.target.value))}
          className={`shrink-0 max-w-[84px] sm:max-w-none px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-colors ${
            isTamrinMode
              ? 'bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800 hover:border-teal-300'
              : 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300'
          }`}
        >
          {isTamrinMode ? (
            tamrinParts.map(part => (
              <option key={part.id} value={part.id}>{part.name}</option>
            ))
          ) : (
            lessonsData.levels.map(lvl => (
              <option key={lvl.id} value={lvl.id}>{lvl.volume}</option>
            ))
          )}
        </select>

        {/* Center: Slim Progress Indicator */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2" title={isTamrinMode ? 'এই অংশের মোট অগ্রগতি' : 'এই খণ্ডের মোট পর্বের অগ্রগতি'}>
          <div className="relative flex-1 h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-gradient-to-r ${isTamrinMode ? 'from-teal-400 to-teal-600' : 'from-emerald-400 to-emerald-600'}`}
              style={{ width: `${Math.max(volumePercent, 2)}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] sm:text-xs font-extrabold text-slate-600 dark:text-slate-300 whitespace-nowrap">
            {toBengaliNumber(volumeProgress.done)}/{toBengaliNumber(volumeProgress.total)} <span className="font-bold text-slate-400 dark:text-slate-500">পর্ব</span>
          </span>
        </div>

        {/* Right: Level Badge & Sound Toggle */}
        <div className="shrink-0 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-white text-[11px] sm:text-xs font-bold shadow-2xs ${isTamrinMode ? 'bg-teal-600' : 'bg-emerald-600'}`} title="আপনার লেভেল">
            {rankTitle}
          </span>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundMuted ? 'সাউন্ড চালু করুন' : 'সাউন্ড মিউট করুন'}
          >
            {soundMuted ? <VolumeX size={15} className="text-rose-500" /> : <Volume2 size={15} className="text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* চলমান পর্ব / তামরীন কুইক রেজ্যুম কার্ড */}
      {activeStageInfo && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-emerald-900/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-500/30 dark:border-emerald-600/30 shadow-md backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isTamrinMode 
                ? 'bg-teal-600 text-white' 
                : 'bg-emerald-600 text-white'
            }`}>
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                  {isTamrinMode ? 'চলমান তামরীন' : 'আপনার চলমান পর্ব'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  (যেখানে শেষ করেছিলেন)
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate mt-0.5 font-bengali">
                {isTamrinMode
                  ? `${activeStageInfo.tamrin?.title || 'তামরীন'} • ${activeStageInfo.tamrin?.pagesStr || (activeStageInfo.tamrin?.page ? 'পৃষ্ঠা ' + activeStageInfo.tamrin.page : '')}`
                  : `পাঠ ${getLessonBengaliNum(activeStageInfo.lesson)} • ${activeStageInfo.stage?.titleBn || activeStageInfo.stage?.title || 'পর্ব'} (${activeStageInfo.stage?.badge || 'পর্ব'})`
                }
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                if (isTamrinMode) {
                  if (activeStageInfo.tamrin) handleNodeClick(activeStageInfo.tamrin, true, false);
                } else {
                  if (activeStageInfo.lesson && activeStageInfo.stage) {
                    handleSubUnitClick(null, activeStageInfo.lesson, activeStageInfo.stage, true);
                  }
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                isTamrinMode
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              <span>চালিয়ে যান</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => {
                const targetId = isTamrinMode
                  ? (activeStageInfo.tamrin?.id ? `tamrin-node-${activeStageInfo.tamrin.id}` : null)
                  : (activeStageInfo.lesson?.id && activeStageInfo.stage?.id ? `dars-node-${activeStageInfo.lesson.id}-${activeStageInfo.stage.id}` : null);
                if (targetId) {
                  const el = document.getElementById(targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title="রোডম্যাপে এই পর্বে স্ক্রল করুন"
            >
              <Compass size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Chapters & Winding Path */}
      <div className="space-y-12">
        {isTamrinMode ? (
          /* ==========================================================
             AUTHENTIC AT-TAMRINUL KITABI ROADMAP (108+ DISTINCT TAMRINS)
             ========================================================== */
          <div className="relative">
            {/* Authentic Part Banner */}
            <div className="mb-8 p-5 sm:p-6 rounded-3xl text-white shadow-lg relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                      ✍️ আত-তামরীনুল কিতাবী
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-900/40 text-teal-100 border border-teal-400/30">
                      {currentTamrinPart.pages}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/20 text-white">
                      মোট {toBengaliNumber(currentTamrinPart.tamrins.length)}টি তামরীন
                    </span>
                    {partWordGroups.length > 0 && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/90 text-amber-950">
                        📚 {toBengaliNumber(partWordGroups.reduce((n, g) => n + g.words.length, 0))}টি নতুন শব্দ
                      </span>
                    )}

                    {onOpenBookViewer && (
                      <button
                        type="button"
                        onClick={() => onOpenBookViewer('tamrin')}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/25 hover:bg-black/40 text-emerald-100 hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="মূল মুদ্রিত কিতাবের পৃষ্ঠা দেখুন"
                      >
                        <FileText size={11} />
                        <span>মূল কিতাবের পৃষ্ঠা ↗</span>
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-2xl font-extrabold leading-snug">
                    {currentTamrinPart.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-100 mt-1 font-arabic font-medium">
                    {currentTamrinPart.arabicName}
                  </p>
                  <p className="text-xs text-teal-100/90 mt-1.5 leading-relaxed">
                    {currentTamrinPart.subTitle}
                  </p>
                </div>
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center shrink-0 shadow-inner">
                  <PenTool size={28} className="text-white" />
                </div>
              </div>
            </div>

            {/* Snake Roadmap: Every single Tamrin and Word Milestone as a sleek Diamond Gemstone Node */}
            <div className="flex flex-col items-center gap-6 sm:gap-7 relative py-4">
              {tamrinRoadItems.map((item, roadIdx) => {
                const offsetClass = stepOffsets[roadIdx % stepOffsets.length];

                if (item.type === 'wordSet') {
                  return renderWordSetNode(item, roadIdx, offsetClass);
                }

                const tamrin = item.tamrin;
                const tIdx = item.tIdx;
                const isCompleted = !!activeProgress[tamrin.id]?.completed || isUnlockedUser;
                const isUnlocked = checkTamrinUnlocked(tamrin, tIdx);
                const isActive = !isCompleted && isUnlocked;
                const bengaliNum = tamrin.tamrinNumberBn || toBengaliNumber(tIdx + 1);

                return (
                  <div 
                    key={tamrin.id}
                    id={`tamrin-node-${tamrin.id}`}
                    className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass}`}
                  >
                    {/* Floating 'Start' tooltip for active node (only if unlocked and not completed) */}
                    {isUnlocked && !isCompleted && (isActive || activeStageInfo?.tamrin?.id === tamrin.id) && (
                      <div className="animate-bounce mb-1">
                        <div className="px-3 py-0.5 rounded-full text-white font-extrabold text-[11px] sm:text-xs shadow-md flex items-center gap-1 bg-teal-600 shadow-teal-600/30">
                          <Sparkles size={11} />
                          <span>চলমান তামরীন!</span>
                        </div>
                      </div>
                    )}

                    {/* Compact Diamond Gemstone Button */}
                    <div className="relative flex items-center justify-center p-1.5">
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => handleNodeClick(tamrin, isUnlocked, isCompleted)}
                        className={`group relative w-12 h-12 sm:w-13 sm:h-13 rotate-45 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                        } ${
                          isUnlocked && activeStageInfo?.tamrin?.id === tamrin.id ? 'ring-4 ring-teal-400 ring-offset-2 dark:ring-offset-slate-900 animate-pulse ' : ''
                        }${
                          isCompleted
                            ? 'bg-gradient-to-br from-teal-400 via-teal-600 to-emerald-900 border-2 border-teal-200 shadow-[0_0_22px_rgba(20,184,166,0.85)] animate-pulse hover:scale-105 active:scale-95'
                            : isActive
                            ? 'bg-gradient-to-br from-teal-400 via-teal-600 to-emerald-700 border-2 border-teal-200 shadow-lg shadow-teal-700/25 hover:scale-105 active:scale-95'
                            : 'bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border-2 border-slate-400/40 text-slate-400 opacity-80'
                        }`}
                        title={`${tamrin.title} • ${tamrin.pagesStr || 'পৃষ্ঠা ' + tamrin.page} • ${isCompleted ? 'সম্পূর্ণ' : isActive ? 'চলমান' : 'লক'}`}
                      >
                        {/* Center unrotated Bengali Number */}
                        <div className="-rotate-45 flex flex-col items-center justify-center text-white relative select-none">
                          <span className={`font-bengali font-black leading-none select-none drop-shadow-sm ${
                            tIdx + 1 >= 100 ? 'text-[10px] sm:text-xs' : tIdx + 1 >= 10 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                          } ${
                            isUnlocked ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {bengaliNum}
                          </span>

                          {/* Completed checkmark badge */}
                          {isCompleted && (
                            <div className="absolute -top-3.5 -right-3.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                              <CheckCircle2 size={12} className="stroke-[3]" />
                            </div>
                          )}

                          {/* Locked indicator */}
                          {!isUnlocked && (
                            <div className="absolute -bottom-3 -right-3 text-slate-400">
                              <Lock size={11} />
                            </div>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Clean Label underneath: "তামরীন ১", "তামরীন ২" etc. */}
                    <div className="mt-1 text-center">
                      <span className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white font-bengali leading-tight block">
                        তামরীন {bengaliNum}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ==========================================================
             ESO ARBI SHIKHI CHAPTERS & LESSONS ROADMAP
             ========================================================== */
          <div className="space-y-10">
            {chapters.map((chapter, chIdx) => {
            const chapterLessons = lessonsData.lessons.filter(l => l.chapterId === chapter.id);

            return (
              <div key={chapter.id} className="relative">
                {/* Duolingo Unit Banner */}
                <div className="mb-8 p-5 sm:p-6 rounded-3xl text-white shadow-lg relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                          📖 এসো আরবী শিখি • অধ্যায় {toBengaliNumber(chIdx + 1)}
                        </span>

                        {onOpenBookViewer && (
                          <button
                            type="button"
                            onClick={() => onOpenBookViewer('original')}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/25 hover:bg-black/40 text-emerald-100 hover:text-white transition-all inline-flex items-center gap-1 cursor-pointer"
                            title="মূল মুদ্রিত কিতাবের পৃষ্ঠা দেখুন"
                          >
                            <FileText size={11} />
                            <span>মূল কিতাবের পৃষ্ঠা ↗</span>
                          </button>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold leading-snug">
                        {/* আরবি নাম নিচে আলাদা লাইনে থাকে, তাই শিরোনাম থেকে বন্ধনীর আরবি বাদ */}
                        {chapter.title.replace(/\s*\([؀-ۿ\s]+\)/, '')}
                      </h3>
                      <p dir="rtl" className="text-base sm:text-lg text-emerald-50 mt-1 font-arabic">
                        {chapter.arabicTitle}
                      </p>
                    </div>
                    <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center shrink-0">
                      <Compass size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Snake Roadmap: Dynamic Sub-Dars (উপ-পাঠ) Snake Trail */}
                <div className="flex flex-col items-center gap-6 sm:gap-7 relative py-4">
                  {chapterLessons.flatMap((lesson, lIdx) => {
                    const stages = getDynamicLessonStages(lesson);
                    const lessonBengaliNum = getLessonBengaliNum(lesson, lIdx);

                    return stages.map((stage, sIdx) => {
                      const stageMeta = volumeStagesMap.get(`${lesson.id}_${stage.id}`);
                      const globalStageIdx = stageMeta ? stageMeta.globalStageIdx : sIdx;
                      const serialNumber = stageMeta ? stageMeta.serialNumber : sIdx + 1;
                      const bengaliSerial = stageMeta ? stageMeta.bengaliSerial : toBengaliNumber(serialNumber);

                      const isCompleted = isStageDone(lesson.id, stage.id);
                      const isUnlocked = checkStageUnlocked(globalStageIdx, lesson, stage);
                      const isActive = !isCompleted && isUnlocked;
                      const isCurrentPorbo = activeStageInfo?.lesson?.id === lesson.id && activeStageInfo?.stage?.id === stage.id;

                      const stepOffsetClass = stepOffsets[globalStageIdx % stepOffsets.length];

                      // এই পর্বের ক্বায়েদা: আগের পর্ব আর এই পর্বের মাঝে, পাশে সরিয়ে; পর্বের মাঝে বাড়তি গ্যাপ না রেখে টেক্সট ওভারল্যাপ মুক্ত
                      const stageQaida = isUnlocked ? (lesson.qaida || []).find(q => q.stageId === stage.id) : null;
                      const qaidaNode = stageQaida ? (
                        <div className={`absolute z-10 -top-[26px] sm:-top-[30px] animate-qaida-bob ${qaidaSideClass(globalStageIdx)}`}>
                          <QaidaButton qaida={stageQaida} onOpen={setOpenQaida} />
                        </div>
                      ) : null;

                      return (
                        <div
                          key={`${lesson.id}-${stage.id}`}
                          id={`dars-node-${lesson.id}-${stage.id}`}
                          className={`relative flex flex-col items-center transition-all duration-300 ${stepOffsetClass}`}
                        >
                          {qaidaNode}
                          {/* Floating 'Start' tooltip for active / current porbo node */}
                          {isCurrentPorbo && (
                            <div className="animate-bounce mb-1">
                              <div className="px-3 py-0.5 rounded-full text-white font-extrabold text-[11px] sm:text-xs shadow-md flex items-center gap-1 bg-emerald-600 shadow-emerald-600/30">
                                <Sparkles size={11} />
                                <span>চলমান পর্ব!</span>
                              </div>
                            </div>
                          )}
                          {/* Compact Diamond Gemstone Button */}
                          <div className="relative flex items-center justify-center p-1.5">
                            <button
                              type="button"
                              disabled={!isUnlocked}
                              onClick={() => handleSubUnitClick(null, lesson, stage, isUnlocked)}
                              className={`group relative w-12 h-12 sm:w-13 sm:h-13 rotate-45 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                              } ${
                                isCurrentPorbo ? 'ring-4 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900 animate-pulse ' : ''
                              }${
                                isCompleted
                                  ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-2 border-teal-200 shadow-[0_0_22px_rgba(16,185,129,0.85)] animate-pulse hover:scale-105 active:scale-95'
                                  : isActive
                                  ? 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 border-2 border-emerald-200 shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95'
                                  : 'bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border-2 border-slate-400/40 text-slate-400 opacity-80'
                              }`}
                              title={`পাঠ ${lessonBengaliNum} • ${stage.titleBn} (${stage.badge}) • ${isCompleted ? 'সম্পূর্ণ' : isActive ? 'চলমান' : 'লক'}`}
                            >
                              {/* Center unrotated Bengali Number (১, ২, ৩, ৪, ৫, ৬...) */}
                              <div className="-rotate-45 flex flex-col items-center justify-center text-white relative select-none">
                                <span className={`font-bengali font-black leading-none select-none drop-shadow-sm ${
                                  serialNumber >= 100 ? 'text-[10px] sm:text-xs' : serialNumber >= 10 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                                } ${
                                  isUnlocked ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                                }`}>
                                  {bengaliSerial}
                                </span>
                              </div>
                            </button>
                          </div>

                          {/* Clean Label underneath: ONLY "পাঠ ১", "পাঠ ২" etc. (NO sub-unit subtitle text) */}
                          <div className="mt-1 text-center">
                            <span className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white font-bengali leading-tight block">
                              পাঠ {lessonBengaliNum}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <QaidaCard
        qaida={openQaida}
      />
    </div>
  </div>
);
}
