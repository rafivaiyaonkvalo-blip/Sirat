import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Volume2, Sparkles, 
  PenTool, Eye, EyeOff, Lightbulb,
  BookMarked, VolumeX, CheckCircle2, XCircle, Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playArabicAudio } from '../utils/audio';
import { 
  playSuccessChime, 
  playMistakeNotice, 
  playCompletionFanfare, 
  isSoundMuted, 
  toggleSoundMute,
  useSoundMuted
} from '../utils/soundEffects';
import { recordDailyActivity, calcSessionXp, XP_RULES } from '../utils/gamification';
import { toBengaliNumber } from '../utils/lessonSubSections';
import { allTamrins } from '../data/tamrinKitabiData';
import { buildEnhancedTamrinSteps } from '../utils/tamrinSentenceSplitter';
import { buildWordPracticeSteps } from '../utils/tamrinWordPractice';
import { StageCompleteCard } from './LessonCelebration';
import ReportModal from './ReportModal';
import { getShowEnglish } from '../utils/storage';
import { getEnglishTranslation } from '../utils/englishDictionary';
import { recordMistake } from '../utils/mistakesManager';

import { shuffle } from '../utils/shuffle';
export default function DuolingoTamrinModal({ 
  lesson, 
  onClose, 
  onComplete, 
  onStartNextTamrin,
  onOpenBookViewer 
}) {
  // Build enhanced, multi-stage steps (breaking long compound sentences into clauses + full sentence)
  const steps = useMemo(() => {
    // কিতাবের শেষের নতুন শব্দের সেট: শব্দ অনুশীলনের প্রশ্ন
    if (lesson?.kind === 'words') return buildWordPracticeSteps(lesson);
    const enhanced = buildEnhancedTamrinSteps(lesson);
    if (enhanced && enhanced.length > 0) return enhanced;

    // Fallback if raw items
    const rawTamrin = lesson?.tamrinKitabi || lesson?.exercises || [];
    return (Array.isArray(rawTamrin) ? rawTamrin : [rawTamrin]).map((item, idx) => ({
      id: `fallback-${idx}`,
      stageLabel: 'তামরীন অনুশীলন',
      task: item.task || 'সঠিক বাক্য গঠন করুন',
      instruction: item.instruction || 'শব্দ সাজিয়ে বাক্যটি তৈরি করুন:',
      mode: item.mode || (item.arabicSentence ? 'ar-to-bn' : 'bn-to-ar'),
      arabicSentence: item.arabicSentence || item.arabic || 'هٰذَا كِتَابٌ',
      banglaSentence: item.banglaSentence || item.bangla || 'ইহা একটি বই',
      hint: item.hint,
      page: item.page || lesson?.page
    }));
  }, [lesson]);

  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    try {
      if (typeof window !== 'undefined' && lesson?.id) {
        const saved = localStorage.getItem(`uls_tamrin_step_${lesson.id}`);
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < steps.length) {
          return idx;
        }
      }
    } catch (e) {}
    return 0;
  });
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [usedSolution, setUsedSolution] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [soundMuted, toggleSound] = useSoundMuted();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showEnglish, setShowEnglish] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglish(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  // Time tracking
  const startTimeRef = useRef(Date.now());
  const [durationSec, setDurationSec] = useState(0);

  // Interactive sentence builder state
  const [selectedBubbles, setSelectedBubbles] = useState([]);
  const [selectedBengaliOpt, setSelectedBengaliOpt] = useState(null);
  const [stepAnswered, setStepAnswered] = useState(false);
  const [stepCorrect, setStepCorrect] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [anySolutionUsed, setAnySolutionUsed] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && lesson?.id) {
        if (!isFinished) {
          localStorage.setItem(`uls_tamrin_step_${lesson.id}`, String(currentStepIdx));
        } else {
          localStorage.removeItem(`uls_tamrin_step_${lesson.id}`);
        }
      }
    } catch (e) {}
  }, [lesson?.id, currentStepIdx, isFinished]);

  const activeStep = steps[currentStepIdx] || steps[0] || {};
  const isArToBn = activeStep.mode === 'ar-to-bn';
  // ধাপে তৈরি অপশন থাকলে (শব্দ অনুশীলন) দুই দিকেই বহুনির্বাচনী প্রশ্ন হয়
  const hasOptions = Array.isArray(activeStep.options) && activeStep.options.length > 0;
  const isWordsSet = lesson?.kind === 'words';

  // Extract clean target tokens for sentence builder (without punctuation)
  const sentenceTokens = useMemo(() => {
    if (!activeStep.arabicSentence) return [];
    return activeStep.arabicSentence
      .replace(/[.,،؟!؛:\-]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }, [activeStep]);

  // Scramble tokens for the bubble bank
  const scrambledTokens = useMemo(() => {
    if (sentenceTokens.length <= 1) return [...sentenceTokens];
    const tokens = [...sentenceTokens];
    for (let attempts = 0; attempts < 8; attempts++) {
      for (let i = tokens.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
      }
      if (tokens.join(' ') !== sentenceTokens.join(' ')) {
        break;
      }
    }
    return tokens;
  }, [sentenceTokens]);

  // Context-aware distractors for MCQ
  const bengaliOptions = useMemo(() => {
    if (hasOptions) return activeStep.options;
    if (!isArToBn || !activeStep.banglaSentence) return [];
    const correctBn = activeStep.banglaSentence;
    const isTarkib = activeStep.isTarkib;

    const distractorPool = [];
    allTamrins.forEach(t => {
      (t.exercises || []).forEach(e => {
        if (e.banglaSentence && e.banglaSentence !== correctBn) {
          const isDistractorTarkib = e.task?.includes('তারকীব') || e.banglaSentence.includes('মুবতাদা');
          if (isTarkib ? isDistractorTarkib : !isDistractorTarkib) {
            distractorPool.push(e.banglaSentence);
          }
        }
      });
    });

    const uniqueDistractors = shuffle(Array.from(new Set(distractorPool)))
      .slice(0, 3)
      .map(text => ({ text, isCorrect: false }));

    return shuffle([
      { text: correctBn, isCorrect: true },
      ...uniqueDistractors
    ]);
  }, [activeStep, isArToBn, hasOptions]);

  const progressPercent = Math.min(100, ((currentStepIdx + 1) / steps.length) * 100);

  const autoAdvanceTimerRef = useRef(null);
  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const scheduleAutoAdvance = (delayMs = 1100) => {
    clearAutoAdvance();
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNextStep();
    }, delayMs);
  };

  // Reset states on step transition
  useEffect(() => {
    clearAutoAdvance();
    setShowHint(false);
    setShowSolution(false);
    setUsedSolution(false);
    setSelectedBubbles([]);
    setSelectedBengaliOpt(null);
    setStepAnswered(false);
    setStepCorrect(false);

    // Audio playback on comprehension prompts
    if (isArToBn && activeStep.arabicSentence) {
      const timer = setTimeout(() => playArabicAudio(activeStep.arabicSentence), 250);
      return () => clearTimeout(timer);
    }

    return () => clearAutoAdvance();
  }, [currentStepIdx, activeStep, isArToBn]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => clearAutoAdvance();
  }, [lesson]);

  const handleToggleSound = () => {
    toggleSound();
  };

  // Bubble selection handler
  const handleSelectBubble = (token, tIdx) => {
    if (stepAnswered) return;
    if (selectedBubbles.some(b => b.tIdx === tIdx)) {
      setSelectedBubbles(prev => prev.filter(b => b.tIdx !== tIdx));
    } else {
      setSelectedBubbles(prev => [...prev, { token, tIdx }]);
      if (/[\u0600-\u06FF]/.test(token)) {
        playArabicAudio(token);
      }
    }
  };

  // Check sentence builder construction
  const handleCheckSentence = () => {
    if (stepAnswered) return;
    const constructed = selectedBubbles.map(b => b.token).join(' ');
    const expected = sentenceTokens.join(' ');
    const isMatched = constructed === expected;

    setStepAnswered(true);
    setStepCorrect(isMatched);

    if (isMatched) {
      if (!usedSolution) setCorrectCount(c => c + 1);
      playSuccessChime();
      setTimeout(() => playArabicAudio(activeStep.arabicSentence), 220);
      scheduleAutoAdvance(1250);
    } else {
      playMistakeNotice();
      setMistakesCount(c => c + 1);
      if (activeStep) {
        recordMistake({
          id: activeStep.id,
          type: 'tamrin',
          arabic: activeStep.arabicSentence || '',
          bengali: activeStep.banglaSentence || '',
          sourceTitle: tamrin ? `${tamrin.title || 'আত-তামরীনুল কিতাবী'}` : 'আত-তামরীনুল কিতাবী'
        });
      }
    }
  };

  // Check MCQ selection
  const handleSelectBengaliOpt = (opt) => {
    if (stepAnswered) return;
    setSelectedBengaliOpt(opt);
    setStepAnswered(true);
    setStepCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      if (!usedSolution) setCorrectCount(c => c + 1);
      playSuccessChime();
      if (hasOptions && !isArToBn) setTimeout(() => playArabicAudio(activeStep.arabicSentence), 220);
      scheduleAutoAdvance(1000);
    } else {
      playMistakeNotice();
      setMistakesCount(c => c + 1);
      if (activeStep) {
        recordMistake({
          id: activeStep.id,
          type: 'tamrin',
          arabic: activeStep.arabicSentence || '',
          bengali: activeStep.banglaSentence || '',
          question: activeStep.task || '',
          options: activeStep.options,
          correctText: activeStep.options?.find(o => o.isCorrect)?.text || activeStep.banglaSentence || '',
          sourceTitle: tamrin ? `${tamrin.title || 'আত-তামরীনুল কিতাবী'}` : 'আত-তামরীনুল কিতাবী'
        });
      }
    }
  };

  const handleRevealSolution = () => {
    clearAutoAdvance();
    setShowSolution(true);
    setUsedSolution(true);
    setAnySolutionUsed(true);
  };

  const handleNextStep = () => {
    clearAutoAdvance();
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      setDurationSec(elapsed);
      setIsFinished(true);
      playCompletionFanfare();
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 }
      });

      const baseEarnedXp = calcSessionXp(correctCount, anySolutionUsed ? 1 : mistakesCount);
      const score = mistakesCount === 0 && !usedSolution ? 100 : Math.max(60, Math.round(100 - (mistakesCount * 12)));
      const stars = score >= 90 ? 3 : (score >= 75 ? 2 : 1);

      recordDailyActivity(baseEarnedXp);

      if (onComplete) {
        onComplete(lesson.id, {
          completed: true,
          score,
          stars,
          xp: baseEarnedXp,
          mistakes: mistakesCount,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  const earnedXp = calcSessionXp(correctCount, anySolutionUsed ? 1 : mistakesCount);
  const accuracy = Math.round((correctCount / Math.max(1, correctCount + mistakesCount)) * 100);
  const bengaliNum = lesson.tamrinNumberBn || toBengaliNumber(lesson.tamrinNumber || 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-teal-200/80 dark:border-teal-900/60 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Progress & Utility Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X size={20} />
          </button>

          {/* Duolingo Teal Progress Bar */}
          <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-teal-100 dark:border-teal-900/60">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 rounded-full transition-all duration-400 shadow-sm"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>

          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 font-mono">
            {toBengaliNumber(currentStepIdx + 1)}/{toBengaliNumber(steps.length)}
          </span>

          {/* Report Issue Button */}
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="কোনো ভুল থাকলে রিপোর্ট করুন"
          >
            <Flag size={17} />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundMuted ? 'সাউন্ড চালু করুন' : 'সাউন্ড মিউট করুন'}
          >
            {soundMuted ? <VolumeX size={18} className="text-rose-500" /> : <Volume2 size={18} className="text-teal-600" />}
          </button>

          <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-extrabold text-xs">
            <Sparkles size={15} />
            <span>+{toBengaliNumber(correctCount * XP_RULES.perCorrect)} XP</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
          {!isFinished ? (
            <div className="space-y-4">
              
              {/* Exercise Header Badge & Page Info */}
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 inline-flex items-center gap-1.5">
                      <PenTool size={12} />
                      <span>{activeStep.stageLabel || 'আত-তামরীনুল কিতাবী'}</span>
                    </span>

                    {activeStep.isClause && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300/50">
                        {activeStep.clausePart === 1 ? '১ম খণ্ডাংশ' : '২য় খণ্ডাংশ'}
                      </span>
                    )}

                    {activeStep.isFullPreserved && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300/50">
                        পূর্ণাঙ্গ বাক্য একীভূতকরণ
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {(activeStep.page || lesson.page) && (
                      <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                        {lesson.pagesStr || `পৃষ্ঠা ${activeStep.page || lesson.page}`}
                      </span>
                    )}
                    {onOpenBookViewer && (
                      <button
                        type="button"
                        onClick={() => onOpenBookViewer('tamrin')}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="মূল মুদ্রিত কিতাবের পৃষ্ঠা দেখুন"
                      >
                        <BookMarked size={11} />
                        <span>কিতাবে দেখুন ↗</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 block mb-1">
                    {activeStep.instruction}
                  </span>

                  {/* If ARABIC to BANGLA: Show Arabic sentence prominently */}
                  {isArToBn ? (
                    <div className="space-y-2 pt-1">
                      <p className="font-arabic font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-loose text-right select-text py-1">
                        {activeStep.arabicSentence}
                      </p>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => playArabicAudio(activeStep.arabicSentence)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-200 dark:hover:bg-teal-900 transition-colors cursor-pointer"
                        >
                          <Volume2 size={14} />
                          <span>উচ্চারণ শুনুন</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* If BANGLA to ARABIC: Show Bengali sentence clearly */
                    <div className="py-1">
                      <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white select-text">
                        "{activeStep.banglaSentence}"
                      </p>
                      {showEnglish && getEnglishTranslation(activeStep, activeStep.banglaSentence) && (
                        <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-lg bg-teal-100/70 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold font-sans">
                          <span className="text-[10px] uppercase font-bold opacity-75">EN</span>
                          <span>{getEnglishTranslation(activeStep, activeStep.banglaSentence)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* MODE 1: BANGLA TO ARABIC - BUBBLE BUILDER */}
              {!isArToBn && !hasOptions && (
                <div className="p-4 rounded-3xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-teal-600" />
                      <span>{activeStep.isClause ? 'খণ্ডাংশটি আরবিতে সাজান:' : 'শব্দ সাজিয়ে আরবি বাক্য গঠন করুন:'}</span>
                    </label>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                      (ট্যাপ করে বাক্য তৈরি করুন)
                    </span>
                  </div>

                  {/* Slot area */}
                  <div dir="rtl" className="min-h-[75px] p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-dashed border-teal-300 dark:border-teal-700/60 flex flex-wrap items-center justify-center gap-2">
                    {selectedBubbles.length === 0 ? (
                      <span className="text-xs text-slate-400 font-medium select-none">
                        নিচের শব্দগুলোতে ট্যাপ করে আরবি সাজান
                      </span>
                    ) : (
                      selectedBubbles.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={stepAnswered}
                          onClick={() => handleSelectBubble(item.token, item.tIdx)}
                          className="px-3.5 py-1.5 rounded-xl font-arabic font-bold text-2xl bg-teal-600 text-white shadow-sm hover:bg-teal-700 transition-all cursor-pointer"
                        >
                          {item.token}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Scrambled bubble bank */}
                  <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                    {scrambledTokens.map((token, tIdx) => {
                      const isUsed = selectedBubbles.some(b => b.tIdx === tIdx);
                      return (
                        <button
                          key={tIdx}
                          type="button"
                          disabled={isUsed || stepAnswered}
                          onClick={() => handleSelectBubble(token, tIdx)}
                          className={`px-3.5 py-1.5 rounded-xl font-arabic font-bold text-2xl border-2 transition-all cursor-pointer ${
                            isUsed
                              ? 'opacity-25 bg-slate-200 dark:bg-slate-800 border-transparent cursor-not-allowed'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-teal-500 shadow-sm'
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 2: ARABIC TO BANGLA - TRANSLATION / TARKIB MCQ (শব্দ অনুশীলনে দুই দিকেই) */}
              {(isArToBn || hasOptions) && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    {hasOptions
                      ? (isArToBn ? 'সঠিক বাংলা অর্থ নির্বাচন করুন:' : 'সঠিক আরবি শব্দ নির্বাচন করুন:')
                      : 'সঠিক বাংলা তরজমা / তারকীব নির্বাচন করুন:'}
                  </label>

                  <div className="space-y-2.5">
                    {bengaliOptions.map((opt, idx) => {
                      const isSelected = selectedBengaliOpt === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-teal-400';
                      if (stepAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-teal-600 text-white border-teal-700 shadow-md';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={stepAnswered}
                          onClick={() => handleSelectBengaliOpt(opt)}
                          dir={opt.isArabic ? 'rtl' : undefined}
                          className={`w-full rounded-2xl border-2 font-bold transition-all cursor-pointer ${
                            opt.isArabic ? 'px-4 py-2.5 text-right font-arabic text-2xl sm:text-3xl leading-loose' : 'p-4 text-left text-sm sm:text-base'
                          } ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hint & Solution Actions */}
              <div className="flex items-center justify-between pt-1">
                {activeStep.hint && (
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <Lightbulb size={14} />
                    <span>{showHint ? 'ইঙ্গিত লুকান' : 'ইঙ্গিত দেখুন'}</span>
                  </button>
                )}

                {!showSolution ? (
                  <button
                    type="button"
                    onClick={handleRevealSolution}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors cursor-pointer ml-auto"
                    title="সমাধান দেখলে অর্জিত XP ৫০% হবে"
                  >
                    <Eye size={14} />
                    <span>সমাধান দেখুন (৫০% XP)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSolution(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer ml-auto"
                  >
                    <EyeOff size={14} />
                    <span>সমাধান লুকান</span>
                  </button>
                )}
              </div>

              {/* Hint Card */}
              {showHint && activeStep.hint && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 animate-fade-in">
                  💡 <strong>ইঙ্গিত:</strong> {activeStep.hint}
                </div>
              )}

              {/* Solution Card */}
              {showSolution && (
                <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-200">
                      কিতাবের সঠিক আরবি রূপ:
                    </span>
                    <button
                      type="button"
                      onClick={() => playArabicAudio(activeStep.arabicSentence)}
                      className="text-teal-700 dark:text-teal-300 hover:underline text-xs flex items-center gap-1 font-bold"
                    >
                      <Volume2 size={13} />
                      <span>উচ্চারণ</span>
                    </button>
                  </div>
                  <p className="font-arabic font-bold text-2xl text-teal-900 dark:text-teal-100 text-right leading-relaxed select-text">
                    {activeStep.arabicSentence}
                  </p>
                  <p className="text-xs text-teal-800 dark:text-teal-300">
                    বাংলা অর্থ: "{activeStep.banglaSentence}"
                  </p>
                  {showEnglish && getEnglishTranslation(activeStep, activeStep.banglaSentence) && (
                    <p className="text-xs text-teal-700/80 dark:text-teal-400 font-sans">
                      English: "{getEnglishTranslation(activeStep, activeStep.banglaSentence)}"
                    </p>
                  )}
                </div>
              )}

            </div>
          ) : (
            /* COMPLETION CARD (ESPO ARBI SHIKHI 3D CELEBRATION STYLE) */
            <div className="animate-fade-in">
              <StageCompleteCard
                stageTitle={`${lesson.title || 'আত-তামরীনুল কিতাবী'}`}
                badge={isWordsSet ? 'কিতাবের নতুন শব্দ' : `তামরীন ${bengaliNum}`}
                xp={earnedXp}
                accuracy={accuracy}
                timeSec={durationSec}
                bonuses={accuracy === 100 ? [{ label: 'নিখুঁত তামরীন বোনাস', xp: 20 }] : []}
                onNext={onStartNextTamrin ? () => onStartNextTamrin(lesson) : null}
                onBackToMap={onClose}
              />
            </div>
          )}

          {/* Bottom Action / Feedback Stripe */}
          {!isFinished && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              {!isArToBn && !hasOptions && !stepAnswered ? (
                <button
                  type="button"
                  disabled={selectedBubbles.length === 0}
                  onClick={handleCheckSentence}
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-md ${
                    selectedBubbles.length === 0
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/25'
                  }`}
                >
                  উত্তর যাচাই করুন
                </button>
              ) : stepAnswered ? (
                <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 animate-fade-in ${
                  stepCorrect 
                    ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-100 border border-teal-300' 
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100 border border-rose-300'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {stepCorrect ? (
                      <CheckCircle2 size={24} className="text-teal-600 shrink-0" />
                    ) : (
                      <XCircle size={24} className="text-rose-600 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="font-extrabold text-sm block truncate">
                        {stepCorrect 
                          ? (activeStep.isClause 
                              ? (activeStep.clausePart === 1 ? 'চমৎকার! ১ম অংশ সঠিক হয়েছে!' : 'মাশাআল্লাহ! ২য় অংশ সঠিক হয়েছে!') 
                              : (activeStep.isFullPreserved ? 'আলহামদুলিল্লাহ! পূর্ণাঙ্গ বাক্য শুদ্ধ হয়েছে!' : 'মাশাআল্লাহ! সঠিক উত্তর!'))
                          : (hasOptions ? 'উত্তরটি সঠিক হয়নি' : 'শব্দবিন্যাসে ভুল হয়েছে')}
                      </span>
                      {!stepCorrect && (
                        <span className="text-xs opacity-90 block truncate">
                          {hasOptions
                            ? 'সবুজ রঙের অপশনটিই সঠিক উত্তর।'
                            : "উপরে 'সমাধান দেখুন' চেপে সঠিক রূপটি দেখে নিতে পারেন।"}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0 ${
                      stepCorrect
                        ? 'bg-teal-600 hover:bg-teal-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    চালিয়ে যান →
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    
      {/* Report & Feedback Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        context={{
          source: 'tamrin',
          lessonId: lesson?.id,
          lessonTitle: lesson?.title,
          arabic: activeStep?.arabicSentence,
          bangla: activeStep?.banglaSentence,
          page: activeStep?.page
        }}
      />
    </div>
  );
}