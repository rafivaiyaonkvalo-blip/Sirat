import React, { useState, useEffect } from 'react';
import DuolingoRoadmap from './DuolingoRoadmap';
import DuolingoLessonModal from './DuolingoLessonModal';
import LessonStepsGate from './LessonStepsGate';
import DuolingoTamrinModal from './DuolingoTamrinModal';
import { allTamrins, getTamrinPartLastId, tamrinWordGroups } from '../data/tamrinKitabiData';
import { 
  getDynamicLessonStages, 
  getSubUnitProgressStatus
} from '../utils/lessonSubSections';
import { isSuperUser } from '../utils/superUser';

export default function LessonsView({ lessonsData, onOpenBookViewer, user }) {
  const isSuper = isSuperUser(user);

  const [esoLevelId, setEsoLevelId] = useState(() => {
    try {
      const savedPorbo = localStorage.getItem('uls_last_active_porbo');
      if (savedPorbo) {
        const parsed = JSON.parse(savedPorbo);
        if (parsed?.mode === 'eso_arbi' && parsed?.levelId) {
          return Math.min(3, Math.max(1, parseInt(parsed.levelId, 10)));
        }
      }
      const savedProgress = JSON.parse(localStorage.getItem('uls_lessons_progress') || '{}');
      const saved = localStorage.getItem('uls_eso_level');
      const lvl = saved ? Math.min(3, Math.max(1, parseInt(saved, 10))) : 1;
      if (!isSuper && lvl === 2 && !savedProgress['vol1-ch3-l6']?.completed) return 1;
      const vol2Lessons = (lessonsData?.lessons || []).filter(l => l.volumeId === 2);
      const vol2LastId = vol2Lessons.length ? vol2Lessons[vol2Lessons.length - 1].id : 'vol2-ch3-l9';
      if (!isSuper && lvl === 3 && !savedProgress[vol2LastId]?.completed) return 1;
      return lvl;
    } catch {
      return 1;
    }
  });

  const [tamrinPartId, setTamrinPartId] = useState(() => {
    try {
      const savedTamrinProgress = JSON.parse(localStorage.getItem('uls_tamrin_progress') || '{}');
      const params = new URLSearchParams(window.location.search);
      const tamrinId = params.get('tamrin');
      if (tamrinId) {
        const found = allTamrins.find(t => t.id === tamrinId);
        if (found?.partId) {
          const p = found.partId;
          if (!isSuper && p === 2 && !savedTamrinProgress[getTamrinPartLastId(1)]?.completed) return 1;
          if (!isSuper && p === 3 && !savedTamrinProgress[getTamrinPartLastId(2)]?.completed) return 1;
          if (!isSuper && p === 4 && !savedTamrinProgress[getTamrinPartLastId(3)]?.completed) return 1;
          return p;
        }
      }
      const savedPorbo = localStorage.getItem('uls_last_active_porbo');
      if (savedPorbo) {
        const parsed = JSON.parse(savedPorbo);
        if (parsed?.mode === 'tamrin' && parsed?.partId) {
          return Math.min(4, Math.max(1, parseInt(parsed.partId, 10)));
        }
      }
      const saved = localStorage.getItem('uls_tamrin_part');
      const part = saved ? Math.min(4, Math.max(1, parseInt(saved, 10))) : 1;
      if (!isSuper && part === 2 && !savedTamrinProgress[getTamrinPartLastId(1)]?.completed) return 1;
      if (!isSuper && part === 3 && !savedTamrinProgress[getTamrinPartLastId(2)]?.completed) return 1;
      if (!isSuper && part === 4 && !savedTamrinProgress[getTamrinPartLastId(3)]?.completed) return 1;
      return part;
    } catch {
      return 1;
    }
  });

  const [mode, setMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tamrin')) return 'tamrin';
      if (params.get('lesson')) return 'eso_arbi';
      return localStorage.getItem('uls_lessons_mode') || 'eso_arbi';
    } catch {
      return 'eso_arbi';
    }
  });

  const selectedLevelId = mode === 'tamrin' ? tamrinPartId : esoLevelId;

  const [duolingoModalLesson, setDuolingoModalLesson] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const lessonId = params.get('lesson');
      if (lessonId && lessonsData?.lessons) {
        return lessonsData.lessons.find(l => l.id === lessonId) || null;
      }
    } catch (e) {}
    return null;
  });

  const [activeSubUnitId, setActiveSubUnitId] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('subUnit');
      if (sub && sub !== 'all') return sub;
      const lessonId = params.get('lesson');
      if (lessonId && lessonsData?.lessons) {
        const found = lessonsData.lessons.find(l => l.id === lessonId);
        if (found) {
          const stages = getDynamicLessonStages(found);
          if (stages?.length > 0) return stages[0].id;
        }
      }
      return 'all';
    } catch {
      return 'all';
    }
  });

  const [duolingoTamrinLesson, setDuolingoTamrinLesson] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tamrinId = params.get('tamrin');
      if (tamrinId) {
        if (tamrinId.startsWith('tamrin-words-')) {
          for (const g of tamrinWordGroups) {
            const s = (g.sets || []).find(x => x.id === tamrinId);
            if (s) return s;
          }
        }
        return allTamrins.find(t => t.id === tamrinId) || null;
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem('uls_lessons_mode', mode);
    } catch (e) {}
  }, [mode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (duolingoModalLesson) {
          url.searchParams.set('lesson', duolingoModalLesson.id);
          if (activeSubUnitId && activeSubUnitId !== 'all') {
            url.searchParams.set('subUnit', activeSubUnitId);
          } else {
            url.searchParams.delete('subUnit');
          }
          url.searchParams.delete('tamrin');
        } else if (duolingoTamrinLesson) {
          url.searchParams.set('tamrin', duolingoTamrinLesson.id);
          url.searchParams.delete('lesson');
          url.searchParams.delete('subUnit');
        } else {
          url.searchParams.delete('lesson');
          url.searchParams.delete('subUnit');
          url.searchParams.delete('tamrin');
        }
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (e) {}
    }
  }, [duolingoModalLesson, duolingoTamrinLesson, activeSubUnitId]);

  // Lessons Progress (Eso Arbi Shikhi)
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('uls_lessons_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Tamrin Progress (At-Tamrinul Kitabi)
  const [tamrinProgress, setTamrinProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('uls_tamrin_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleProgressChange = () => {
      try {
        const saved = localStorage.getItem('uls_lessons_progress');
        setProgress(saved ? JSON.parse(saved) : {});
        const savedTamrin = localStorage.getItem('uls_tamrin_progress');
        setTamrinProgress(savedTamrin ? JSON.parse(savedTamrin) : {});
      } catch (e) {}
    };
    window.addEventListener('uls_progress_changed', handleProgressChange);
    window.addEventListener('storage', handleProgressChange);
    return () => {
      window.removeEventListener('uls_progress_changed', handleProgressChange);
      window.removeEventListener('storage', handleProgressChange);
    };
  }, []);

  // অগ্রগতি বদলের খবর রেন্ডারের পরে পাঠানো হয় (state updater-এর ভেতর থেকে অন্য কম্পোনেন্ট আপডেট করলে React সতর্ক করে)
  const notifyProgressChanged = () => {
    if (typeof window !== 'undefined') setTimeout(() => window.dispatchEvent(new CustomEvent('uls_progress_changed')), 0);
  };

  const handleCompleteLesson = (lessonId, result) => {
    setProgress(prev => {
      const existing = prev[lessonId] || {};
      const stages = getDynamicLessonStages(lessonId);
      const stageIds = stages.map(s => s.id);
      const updated = {
        ...prev,
        [lessonId]: {
          ...existing,
          ...result,
          completed: true,
          completedSubUnits: stageIds
        }
      };
      try {
        localStorage.setItem('uls_lessons_progress', JSON.stringify(updated));
        notifyProgressChanged();
      } catch (err) {
        console.error('Failed to save lesson progress:', err);
      }
      return updated;
    });
  };

  const handleCompleteSubUnit = (lessonId, subUnitId, result) => {
    setProgress(prev => {
      const existing = prev[lessonId] || {};
      const stages = getDynamicLessonStages(lessonId);
      
      const subStatus = getSubUnitProgressStatus(lessonId, prev);
      const prevCompletedUnits = subStatus.completedSubUnits || [];
      
      const newCompletedUnits = Array.from(new Set([...prevCompletedUnits, subUnitId]));
      const allDone = stages.length > 0 && stages.every(s => newCompletedUnits.includes(s.id));

      const updated = {
        ...prev,
        [lessonId]: {
          ...existing,
          completed: allDone,
          completedSubUnits: newCompletedUnits,
          stars: allDone
            ? Math.max(existing.stars || 0, result.stars || 3)
            : Math.min(2, Math.max(existing.stars || 0, Math.floor((newCompletedUnits.length / (stages.length || 1)) * 3) || 1)),
          score: Math.max(existing.score || 0, result.score || 80),
          lastSubUnitCompleted: subUnitId,
          stageStats: {
            ...(existing.stageStats || {}),
            [subUnitId]: { xp: result.xp || 0, timeSec: result.timeSec || 0, score: result.score || 0 }
          },
          completedAt: new Date().toISOString()
        }
      };
      try {
        localStorage.setItem('uls_lessons_progress', JSON.stringify(updated));
        notifyProgressChanged();

        // পরবর্তী সক্রিয় পর্ব সংরক্ষণ (যাতে ব্যবহারকারী পুনরায় ভিজিট করলে সরাসরি পরের পর্বে অবস্থান করে)
        const currIdx = stages.findIndex(s => s.id === subUnitId);
        if (currIdx !== -1 && currIdx + 1 < stages.length) {
          const currentLes = (lessonsData?.lessons || []).find(l => l.id === lessonId);
          const lvlId = currentLes?.volumeId === 2 || currentLes?.volumeId === 'vol2' ? 2 : currentLes?.volumeId === 3 || currentLes?.volumeId === 'vol3' ? 3 : 1;
          localStorage.setItem('uls_last_active_porbo', JSON.stringify({
            mode: 'eso_arbi',
            lessonId,
            stageId: stages[currIdx + 1].id,
            levelId: lvlId,
            timestamp: Date.now()
          }));
        } else {
          const lIdx = (lessonsData?.lessons || []).findIndex(l => l.id === lessonId);
          if (lIdx !== -1 && lIdx + 1 < (lessonsData?.lessons || []).length) {
            const nextL = lessonsData.lessons[lIdx + 1];
            const nextStages = getDynamicLessonStages(nextL);
            if (nextStages.length > 0) {
              const lvlId = nextL.volumeId === 2 || nextL.volumeId === 'vol2' ? 2 : nextL.volumeId === 3 || nextL.volumeId === 'vol3' ? 3 : 1;
              localStorage.setItem('uls_last_active_porbo', JSON.stringify({
                mode: 'eso_arbi',
                lessonId: nextL.id,
                stageId: nextStages[0].id,
                levelId: lvlId,
                timestamp: Date.now()
              }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to save lesson sub-unit progress:', err);
      }
      return updated;
    });
  };

  const handleCompleteTamrin = (lessonId, result) => {
    setTamrinProgress(prev => {
      const updated = {
        ...prev,
        [lessonId]: result
      };
      try {
        localStorage.setItem('uls_tamrin_progress', JSON.stringify(updated));
        notifyProgressChanged();

        const currentIdx = allTamrins.findIndex(t => t.id === lessonId);
        if (currentIdx !== -1 && currentIdx + 1 < allTamrins.length) {
          const nextTamrin = allTamrins[currentIdx + 1];
          localStorage.setItem('uls_last_active_porbo', JSON.stringify({
            mode: 'tamrin',
            tamrinId: nextTamrin.id,
            partId: nextTamrin.partId || 1,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        console.error('Failed to save tamrin progress:', err);
      }
      return updated;
    });
  };

  const handleSelectLevel = (lvlId) => {
    if (mode === 'tamrin') {
      const clamped = Math.min(4, Math.max(1, lvlId));
      setTamrinPartId(clamped);
      try {
        localStorage.setItem('uls_tamrin_part', clamped.toString());
      } catch (e) {}
    } else {
      const clamped = Math.min(3, Math.max(1, lvlId));
      setEsoLevelId(clamped);
      try {
        localStorage.setItem('uls_eso_level', clamped.toString());
      } catch (e) {}
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    try {
      localStorage.setItem('uls_lessons_mode', newMode);
    } catch (e) {}
  };

  const handleStartTamrin = (lesson) => {
    if (lesson?.partId) {
      const clamped = Math.min(4, Math.max(1, lesson.partId));
      setTamrinPartId(clamped);
      try {
        localStorage.setItem('uls_tamrin_part', clamped.toString());
      } catch (e) {}
    }
    setDuolingoTamrinLesson(lesson);
    try {
      localStorage.setItem('uls_last_active_porbo', JSON.stringify({
        mode: 'tamrin',
        tamrinId: lesson.id,
        partId: lesson.partId || 1,
        timestamp: Date.now()
      }));
    } catch (e) {}
  };

  const handleStartNextTamrin = (currentTamrin) => {
    // নতুন শব্দের সেট শেষে একই তালিকার পরের সেট
    if (currentTamrin?.kind === 'words') {
      const group = tamrinWordGroups.find(g => g.id === currentTamrin.groupId);
      setDuolingoTamrinLesson(group?.sets[currentTamrin.setIndex] || null);
      return;
    }
    const currentIdx = allTamrins.findIndex(t => t.id === currentTamrin.id);
    if (currentIdx !== -1 && currentIdx + 1 < allTamrins.length) {
      const nextTamrin = allTamrins[currentIdx + 1];
      if (nextTamrin.partId && nextTamrin.partId !== tamrinPartId) {
        setTamrinPartId(nextTamrin.partId);
        try {
          localStorage.setItem('uls_tamrin_part', nextTamrin.partId.toString());
        } catch (e) {}
      }
      setDuolingoTamrinLesson(nextTamrin);
      try {
        localStorage.setItem('uls_last_active_porbo', JSON.stringify({
          mode: 'tamrin',
          tamrinId: nextTamrin.id,
          partId: nextTamrin.partId || 1,
          timestamp: Date.now()
        }));
      } catch (e) {}
    } else {
      setDuolingoTamrinLesson(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl mb-6 relative overflow-hidden transition-all duration-500 ${
        mode === 'tamrin'
          ? 'bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800'
          : 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800'
      }`}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <a 
              href="https://markazuliman.com" 
              target="_blank" 
              rel="noopener noreferrer"
              title="মারকাযুল ঈমান অফিসিয়াল ওয়েবসাইট (markazuliman.com)"
              className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <span>মারকাযুল ঈমান • ডিজিটাল সংস্করণ</span>
              <span className="text-[10px]">↗</span>
            </a>
            <span className="text-xs text-emerald-100 font-semibold px-2.5 py-0.5 rounded-full bg-black/20">
              {mode === 'tamrin' ? '✍️ আত-তামরীনুল কিতাবী' : '📖 এসো আরবী শিখি'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {mode === 'tamrin' ? 'আত-তামরীনুল কিতাবী (التَّمْرِينُ الْكِتَابِيُّ)' : 'এসো আরবী শিখি (الطَّرِيقُ إِلَى الْعَرَبِيَّةِ)'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            {mode === 'tamrin'
              ? 'আত-তামরীনুল কিতাবীর অনুবাদ ও বাক্য রূপান্তর ধাপে ধাপে নিজে অনুশীলন করুন।'
              : 'মাওলানা আবু তাহের মেছবাহ রচিত এসো আরবী শিখি — ডিজিটাল সংস্করণ। মূল কিতাবের প্রতিটি দারস ছোট ছোট পর্বে, প্রতিদিন অল্প করে পড়ুন, নিয়মিত এগিয়ে যান।'
            }
          </p>
        </div>
      </div>

      {/* Duolingo Gamified Snake Roadmap (Supports both modes!) */}
      <DuolingoRoadmap
        lessonsData={lessonsData}
        progress={progress}
        tamrinProgress={tamrinProgress}
        selectedLevelId={selectedLevelId}
        onSelectLevel={handleSelectLevel}
        mode={mode}
        user={user}
        isSuperUser={isSuper}
        onModeChange={handleModeChange}
        onStartLesson={(les, subUnitId) => {
          const stages = getDynamicLessonStages(les);
          const targetSub = subUnitId && subUnitId !== 'all' ? subUnitId : (stages[0]?.id || 'all');
          setActiveSubUnitId(targetSub);
          setDuolingoModalLesson(les);
          try {
            const lvlId = les.volumeId === 2 || les.volumeId === 'vol2' ? 2 : les.volumeId === 3 || les.volumeId === 'vol3' ? 3 : 1;
            localStorage.setItem('uls_last_active_porbo', JSON.stringify({
              mode: 'eso_arbi',
              lessonId: les.id,
              stageId: targetSub,
              levelId: lvlId,
              timestamp: Date.now()
            }));
          } catch (e) {}
        }}
        onStartTamrin={handleStartTamrin}
        onOpenBookViewer={onOpenBookViewer}
      />

      {/* Duolingo Interactive Lesson Modal */}
      {duolingoModalLesson && (
        <LessonStepsGate
          key={duolingoModalLesson.id}
          lesson={duolingoModalLesson}
          onClose={() => {
            setDuolingoModalLesson(null);
            setActiveSubUnitId('all');
          }}
        >
        <DuolingoLessonModal
          key={`${duolingoModalLesson.id}_${activeSubUnitId}`}
          lesson={duolingoModalLesson}
          subUnitId={activeSubUnitId}
          onClose={() => {
            setDuolingoModalLesson(null);
            setActiveSubUnitId('all');
          }}
          onComplete={handleCompleteLesson}
          onCompleteSubUnit={handleCompleteSubUnit}
          onStartNextLesson={(nextLesson) => {
            const nextStages = getDynamicLessonStages(nextLesson);
            const targetSub = nextStages[0]?.id || 'all';
            setActiveSubUnitId(targetSub);
            setDuolingoModalLesson(nextLesson);
            try {
              const lvlId = nextLesson.volumeId === 2 || nextLesson.volumeId === 'vol2' ? 2 : nextLesson.volumeId === 3 || nextLesson.volumeId === 'vol3' ? 3 : 1;
              localStorage.setItem('uls_last_active_porbo', JSON.stringify({
                mode: 'eso_arbi',
                lessonId: nextLesson.id,
                stageId: targetSub,
                levelId: lvlId,
                timestamp: Date.now()
              }));
            } catch (e) {}
          }}
          onStartNextStage={(targetLesson, nextStageId) => {
            setActiveSubUnitId(nextStageId);
            setDuolingoModalLesson(targetLesson);
            try {
              const lvlId = targetLesson.volumeId === 2 || targetLesson.volumeId === 'vol2' ? 2 : targetLesson.volumeId === 3 || targetLesson.volumeId === 'vol3' ? 3 : 1;
              localStorage.setItem('uls_last_active_porbo', JSON.stringify({
                mode: 'eso_arbi',
                lessonId: targetLesson.id,
                stageId: nextStageId,
                levelId: lvlId,
                timestamp: Date.now()
              }));
            } catch (e) {}
          }}
          allLessons={lessonsData.lessons}
          lessonProgress={progress[duolingoModalLesson.id] || null}
        />
        </LessonStepsGate>
      )}

      {/* Duolingo Interactive Tamrin Modal */}
      {duolingoTamrinLesson && (
        <DuolingoTamrinModal
          key={duolingoTamrinLesson.id}
          lesson={duolingoTamrinLesson}
          onClose={() => setDuolingoTamrinLesson(null)}
          onComplete={handleCompleteTamrin}
          onStartNextTamrin={handleStartNextTamrin}
          onOpenBookViewer={onOpenBookViewer}
        />
      )}
    </div>
  );
}
