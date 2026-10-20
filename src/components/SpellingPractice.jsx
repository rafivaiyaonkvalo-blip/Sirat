import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Volume2, Flag,
  Lightbulb, Eye, EyeOff, SlidersHorizontal, Target, Trophy, Flame, Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

import MultiSelectDropdown from './MultiSelectDropdown';
import ArabicVirtualKeyboard from './ArabicVirtualKeyboard';
import BookPicture, { hasBookPicture } from './BookPicture';
import { SPELLING_MODES, getSpellingMode } from './spellingModes';
import { playArabicAudio } from '../utils/audio';
import { playSuccessChime, playMistakeNotice } from '../utils/soundEffects';
import { recordDailyActivity, XP_RULES } from '../utils/gamification';
import { toBengaliNumber } from '../utils/lessonSubSections';
import { recordMistake } from '../utils/mistakesManager';
import lessonsData from '../data/lessons.json';
import { volumeSourceOptions, matchVolumeItem, getAvailableChapters, getAvailableLessons } from '../utils/filterUtils';
import { shuffle } from '../utils/shuffle';
import {
  splitArabicWordIntoLetterUnits,
  stripAllHarakat,
  normalizeArabicForComparison,
  generateConfusingLetterChallenge,
  generateTashkeelChallenge
} from '../utils/spellingUtils';

// Helper to map known Arabic words to 3D BookPicture names
function getWordPictureName(arabic = '') {
  const stripped = stripAllHarakat(arabic);
  const map = {
    'كتاب': 'book',
    'قلم': 'pen',
    'سبورة': 'blackboard',
    'مسطرة': 'ruler',
    'حقيبة': 'bag',
    'كراسة': 'notebook',
    'مدرسة': 'madrasa',
    'بيت': 'house',
    'باب': 'door',
    'كرسي': 'chair',
    'سرير': 'bed',
    'مصباح': 'lamp',
    'جدار': 'wall',
    'طاولة': 'table',
    'نافذة': 'window',
    'قفل': 'lock',
    'مفتاح': 'key',
    'ساعة': 'clock',
    'مظلة': 'umbrella',
    'مسجد': 'mosque',
    'سيارة': 'car',
    'دراجة': 'bicycle',
    'شجرة': 'tree'
  };
  const key = map[stripped];
  return key && hasBookPicture(key) ? key : null;
}

// প্রতি ৫টি ধারাবাহিক সঠিক উত্তরে উদযাপন
const MILESTONE = 5;

export default function SpellingPractice({ vocabulary = [], onOpenReport }) {
  // Mode selection: 'tiles', 'dictation', 'confusing', 'tashkeel'
  const [activeMode, setActiveMode] = useState('tiles');
  const mode = getSpellingMode(activeMode);
  const ModeIcon = mode.icon;

  // Filter drawer toggle for distraction-free practice
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter persistence via localStorage
  const [selectedVolumes, setSelectedVolumes] = useState(() => {
    try {
      const saved = localStorage.getItem('uls_spelling_volumes');
      return saved ? JSON.parse(saved) : ['1'];
    } catch (e) {
      return ['1'];
    }
  });
  const [selectedChapters, setSelectedChapters] = useState(() => {
    try {
      const saved = localStorage.getItem('uls_spelling_chapters');
      return saved ? JSON.parse(saved) : ['all'];
    } catch (e) {
      return ['all'];
    }
  });
  const [selectedLessons, setSelectedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('uls_spelling_lessons');
      return saved ? JSON.parse(saved) : ['all'];
    } catch (e) {
      return ['all'];
    }
  });

  // Global Game Stats (এই সেশনের)
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);

  // Current Question State
  const [currentWord, setCurrentWord] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');

  // Audio Playback Rate: 1.0 (normal) or 0.75 (slow tartil)
  const [audioSpeed, setAudioSpeed] = useState(1.0);

  // Mode 1: Letter Tiles State
  const [availableTiles, setAvailableTiles] = useState([]);
  const [placedTiles, setPlacedTiles] = useState([]);

  // Mode 2: Dictation / Virtual Keyboard State
  const [typedInput, setTypedInput] = useState('');
  const [showMeaningHint, setShowMeaningHint] = useState(false);
  // শ্রুতলিপিতে শুধু হরফ মিললেই সঠিক; চাইলে হরকতসহ কড়া যাচাই চালু করা যায়
  const [strictHarakat, setStrictHarakat] = useState(false);
  const [englishKeyWarning, setEnglishKeyWarning] = useState(false);

  // Mode 3: Confusing Letters Challenge State
  const [confusingChallenge, setConfusingChallenge] = useState(null);
  const [selectedConfusingOpt, setSelectedConfusingOpt] = useState(null);

  // Mode 4: Tashkeel Challenge State
  const [tashkeelChallenge, setTashkeelChallenge] = useState(null);
  const [selectedTashkeelOpt, setSelectedTashkeelOpt] = useState(null);

  // Input ref
  const inputRef = useRef(null);

  // Persist filter changes
  useEffect(() => {
    try {
      localStorage.setItem('uls_spelling_volumes', JSON.stringify(selectedVolumes));
    } catch (e) {}
  }, [selectedVolumes]);

  useEffect(() => {
    try {
      localStorage.setItem('uls_spelling_chapters', JSON.stringify(selectedChapters));
    } catch (e) {}
  }, [selectedChapters]);

  useEffect(() => {
    try {
      localStorage.setItem('uls_spelling_lessons', JSON.stringify(selectedLessons));
    } catch (e) {}
  }, [selectedLessons]);

  // Dynamic chapters based on volume
  const availableChapters = useMemo(() => {
    return getAvailableChapters(selectedVolumes, lessonsData);
  }, [selectedVolumes]);

  // Dynamic lessons based on volume & chapter
  const availableLessons = useMemo(() => {
    return getAvailableLessons(selectedVolumes, selectedChapters, lessonsData);
  }, [selectedVolumes, selectedChapters]);

  // Volume change handler with cascading reset
  const handleVolumesChange = (newVols) => {
    setSelectedVolumes(newVols);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
  };

  // Chapter change handler with cascading reset
  const handleChaptersChange = (newChs) => {
    setSelectedChapters(newChs);
    setSelectedLessons(['all']);
  };

  // Strictly single-word only vocabulary pool for 100% focused spelling practice
  const pool = useMemo(() => {
    return vocabulary.filter(w => {
      const matchVol = matchVolumeItem(w, selectedVolumes);
      const matchCh = !selectedChapters || selectedChapters.length === 0 || selectedChapters.includes('all') || selectedChapters.includes(w.chapterId);
      const matchLes = !selectedLessons || selectedLessons.length === 0 || selectedLessons.includes('all') || selectedLessons.includes(w.lessonId);

      const ar = (w.arabic || '').trim();
      // Strictly single word: no whitespace, no punctuation, pure independent word
      const isSingleWord = ar.length > 0 && !/\s/.test(ar) && !/[.,،؟!؟;:]/.test(ar);
      return matchVol && matchCh && matchLes && isSingleWord;
    });
  }, [vocabulary, selectedVolumes, selectedChapters, selectedLessons]);

  // Play audio with current speed
  const playWordAudio = (arabicText, speedOverride = null) => {
    if (!arabicText) return;
    const speed = speedOverride || audioSpeed;
    playArabicAudio(arabicText, null, speed);
  };

  // Setup next question based on current mode
  const setupNextQuestion = () => {
    if (!pool || pool.length === 0) {
      setCurrentWord(null);
      return;
    }

    setIsAnswered(false);
    setIsCorrect(false);
    setFeedbackNote('');
    setEnglishKeyWarning(false);

    if (activeMode === 'tiles') {
      const word = pool[Math.floor(Math.random() * pool.length)];
      setCurrentWord(word);
      const units = splitArabicWordIntoLetterUnits(word.arabic);
      const shuffled = shuffle(units.map((unit, idx) => ({ id: `${idx}-${unit}-${Math.random()}`, text: unit })));
      setAvailableTiles(shuffled);
      setPlacedTiles([]);
      playWordAudio(word.arabic);
    }
    else if (activeMode === 'dictation') {
      const word = pool[Math.floor(Math.random() * pool.length)];
      setCurrentWord(word);
      setTypedInput('');
      setShowMeaningHint(false);
      setTimeout(() => {
        playWordAudio(word.arabic);
      }, 250);
    }
    else if (activeMode === 'confusing') {
      let challenge = null;
      const shuffledPool = shuffle(pool);
      for (const w of shuffledPool) {
        challenge = generateConfusingLetterChallenge(w);
        if (challenge) {
          setCurrentWord(w);
          break;
        }
      }
      if (!challenge && vocabulary.length > 0) {
        const fullShuffled = shuffle(vocabulary.filter(w => {
          const ar = (w.arabic || '').trim();
          return ar.length > 0 && !/\s/.test(ar) && !/[.,،؟!؟;:]/.test(ar);
        }));
        for (const w of fullShuffled) {
          challenge = generateConfusingLetterChallenge(w);
          if (challenge) {
            setCurrentWord(w);
            break;
          }
        }
      }
      setConfusingChallenge(challenge);
      setSelectedConfusingOpt(null);
      if (challenge) {
        playWordAudio(challenge.correctArabic);
      }
    }
    else if (activeMode === 'tashkeel') {
      let challenge = null;
      const shuffledPool = shuffle(pool);
      for (const w of shuffledPool) {
        challenge = generateTashkeelChallenge(w, pool);
        if (challenge) {
          setCurrentWord(w);
          break;
        }
      }
      if (!challenge && vocabulary.length > 0) {
        const fullShuffled = shuffle(vocabulary.filter(w => {
          const ar = (w.arabic || '').trim();
          return ar.length > 0 && !/\s/.test(ar) && !/[.,،؟!؟;:]/.test(ar);
        }));
        for (const w of fullShuffled) {
          challenge = generateTashkeelChallenge(w, fullShuffled);
          if (challenge) {
            setCurrentWord(w);
            break;
          }
        }
      }
      setTashkeelChallenge(challenge);
      setSelectedTashkeelOpt(null);
      // NOTE: In Tashkeel mode we intentionally do NOT auto-play the vowelled answer on load,
      // so the student solves the Harakat challenge by orthographic recognition!
    }
  };

  // Trigger setup on mode change or filter change
  useEffect(() => {
    setupNextQuestion();
  }, [activeMode, selectedVolumes, selectedChapters, selectedLessons, pool.length]);

  // Keyboard shortcut: Press Enter to proceed or check
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (isAnswered) {
          setupNextQuestion();
        } else if (activeMode === 'tiles' && placedTiles.length > 0) {
          validateTiles();
        } else if (activeMode === 'dictation' && typedInput.trim()) {
          validateDictation();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, placedTiles, typedInput, activeMode]);

  // সঠিক / ভুল উত্তরের সাধারণ হিসাব (স্ট্রিক, XP, সেশনের পরিসংখ্যান, উদযাপন)
  const markCorrect = (arabicToPlay, note, points = 15) => {
    setIsAnswered(true);
    setIsCorrect(true);
    playSuccessChime();
    playWordAudio(arabicToPlay);
    const newStreak = streak + 1;
    setStreak(newStreak);
    setScore(s => s + points);
    setSessionCorrect(c => c + 1);
    recordDailyActivity(XP_RULES.perCorrect);
    setFeedbackNote(note);
    if (newStreak % MILESTONE === 0) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    }
  };

  const markWrong = (note) => {
    setIsAnswered(true);
    setIsCorrect(false);
    playMistakeNotice();
    setStreak(0);
    setSessionWrong(c => c + 1);
    setFeedbackNote(note);
    if (currentWord) {
      recordMistake({
        id: currentWord.id,
        type: 'spelling',
        arabic: currentWord.arabic || '',
        bengali: currentWord.bengali || '',
        sourceTitle: currentWord.volume ? `${currentWord.volume} • ${currentWord.lesson || ''}` : 'বানান অনুশীলন'
      });
    }
  };

  // Mode 1 (Tiles) - Clicking an available tile
  const handleSelectTile = (tile) => {
    if (isAnswered) return;
    const newPlaced = [...placedTiles, tile];
    const newAvailable = availableTiles.filter(t => t.id !== tile.id);
    setPlacedTiles(newPlaced);
    setAvailableTiles(newAvailable);

    // Pedagogical UX fix: Only auto-validate if it's already a perfect match!
    // If not matching yet, do NOT fail the student; keep the 'যাচাই করুন' button ready so they can swap!
    if (newAvailable.length === 0 && currentWord) {
      const assembled = newPlaced.map(t => t.text).join('');
      const target = normalizeArabicForComparison(currentWord.arabic);
      if (normalizeArabicForComparison(assembled) === target) {
        validateTiles(newPlaced);
      }
    }
  };

  // Mode 1 (Tiles) - Returning a placed tile
  const handleReturnTile = (tile) => {
    if (isAnswered) return;
    setPlacedTiles(prev => prev.filter(t => t.id !== tile.id));
    setAvailableTiles(prev => [...prev, tile]);
  };

  // Validate Tiles
  const validateTiles = (placed = placedTiles) => {
    if (!currentWord) return;
    const assembled = placed.map(t => t.text).join('');
    const isMatch = normalizeArabicForComparison(assembled) === normalizeArabicForComparison(currentWord.arabic);

    if (isMatch) {
      markCorrect(currentWord.arabic, 'মাশাআল্লাহ! নির্ভুলভাবে বানান সম্পূর্ণ হয়েছে।');
    } else {
      markWrong('হরফের ক্রম ঠিক হয়নি। সঠিক বানান:');
    }
  };

  // Mode 2 (Dictation) - Virtual Keyboard Handlers
  const handleVirtualKeyPress = (char) => {
    if (isAnswered) return;
    setTypedInput(prev => prev + char);
  };

  const handleVirtualBackspace = () => {
    if (isAnswered) return;
    setTypedInput(prev => {
      if (!prev) return '';
      // Smart backspace: if ending with Lam-Alif 'لا', remove both
      if (prev.endsWith('لا')) {
        return prev.slice(0, -2);
      }
      return prev.slice(0, -1);
    });
  };

  const handleVirtualClear = () => {
    if (isAnswered) return;
    setTypedInput('');
  };

  const handleVirtualSpace = () => {
    if (isAnswered) return;
    setTypedInput(prev => prev + ' ');
  };

  // Input change handler in Dictation: filter out Latin letters
  const handleInputChange = (e) => {
    const val = e.target.value;
    // Detect if user typed Latin characters
    if (/[a-zA-Z]/.test(val)) {
      setEnglishKeyWarning(true);
      setTimeout(() => setEnglishKeyWarning(false), 3500);
      // Clean out Latin characters
      const cleaned = val.replace(/[a-zA-Z]/g, '');
      setTypedInput(cleaned);
    } else {
      setTypedInput(val);
    }
  };

  // Validate Dictation
  const validateDictation = () => {
    if (!currentWord || !typedInput.trim()) return;

    const userNorm = normalizeArabicForComparison(typedInput);
    const targetNorm = normalizeArabicForComparison(currentWord.arabic);

    const exactMatch = userNorm === targetNorm;
    const baseLettersMatch = stripAllHarakat(userNorm) === stripAllHarakat(targetNorm);

    if (exactMatch) {
      markCorrect(currentWord.arabic, 'অসাধারণ! সম্পূর্ণ হরকতসহ ১০০% বিশুদ্ধ বানান।');
    } else if (!strictHarakat && baseLettersMatch) {
      markCorrect(currentWord.arabic, 'হরফ সঠিক হয়েছে! পূর্ণাঙ্গ হরকতসহ রূপ:');
    } else if (baseLettersMatch) {
      markWrong('হরফ সঠিক, তবে হরকতে ভুল রয়েছে। সঠিক বানান:');
    } else {
      markWrong('বানানটি মেলেনি। সঠিক বানান:');
    }
  };

  // Mode 3 (Confusing Letters) Option Click
  const handleConfusingOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedConfusingOpt(option);
    if (option.isCorrect) {
      markCorrect(confusingChallenge.correctArabic, 'শুদ্ধ বানান সনাক্ত হয়েছে!');
    } else {
      markWrong('অশুদ্ধ হরফের বানান বেছে নিয়েছেন। সঠিক বানান:');
    }
  };

  // Mode 4 (Tashkeel) Option Click
  const handleTashkeelOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedTashkeelOpt(option);
    if (option.isCorrect) {
      markCorrect(tashkeelChallenge.correctArabic, 'সঠিক হরকত ও স্বরচিহ্ন নির্বাচিত হয়েছে!');
    } else {
      markWrong('হরকত মেলেনি। সঠিক হরকতযুক্ত রূপ:');
    }
  };

  const pictureName = currentWord ? getWordPictureName(currentWord.arabic) : null;
  const assembledPreview = placedTiles.map(t => t.text).join('');
  const totalTiles = placedTiles.length + availableTiles.length;
  const answered = sessionCorrect + sessionWrong;
  const accuracy = answered ? Math.round((sessionCorrect / answered) * 100) : 0;
  const questionNo = answered + (isAnswered ? 0 : 1);
  const milestoneProgress = streak % MILESTONE;
  // ফলাফলের প্যানেলে দেখানো সঠিক আরবি রূপ
  const answerArabic = activeMode === 'confusing'
    ? confusingChallenge?.correctArabic
    : activeMode === 'tashkeel'
    ? tashkeelChallenge?.correctArabic
    : currentWord?.arabic;
  const hasQuestion = activeMode === 'confusing' ? !!confusingChallenge : activeMode === 'tashkeel' ? !!tashkeelChallenge : !!currentWord;

  const stats = [
    { label: 'XP', value: toBengaliNumber(score), icon: Sparkles },
    { label: 'স্ট্রিক', value: toBengaliNumber(streak), icon: Flame },
    { label: 'সঠিক', value: `${toBengaliNumber(sessionCorrect)}/${toBengaliNumber(answered)}`, icon: Trophy },
    { label: 'নির্ভুলতা', value: `${toBengaliNumber(accuracy)}%`, icon: Target }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 transition-colors">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER: শিরোনাম ও সেশনের পরিসংখ্যান                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white p-5 sm:p-6 shadow-lg shadow-emerald-700/20 mb-5">
        {/* আলংকারিক আরবি হরফ */}
        <div aria-hidden="true" className="pointer-events-none select-none absolute -left-3 -bottom-10 font-arabic text-[110px] sm:text-[140px] leading-none text-white/10" dir="rtl">
          أ ب ت
        </div>
        <div aria-hidden="true" className="pointer-events-none select-none absolute right-24 -top-8 font-arabic text-[90px] leading-none text-white/10">
          ح
        </div>

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold">
              ✍️ ইমলা ও কিতাবাত
            </span>
            <h1 className="mt-2 text-xl sm:text-2xl font-extrabold leading-tight">
              বানান ও ইমলা অনুশীলন
            </h1>
            <p className="font-arabic text-lg sm:text-xl text-emerald-50/95 leading-relaxed" dir="rtl">
              تَمْرِينُ الْإِمْلَاءِ وَالْكِتَابَةِ
            </p>
            <p className="text-xs text-emerald-50/85 mt-0.5">
              শুনুন, সাজান, লিখুন — হরফ ও হরকতসহ বিশুদ্ধ আরবি বানান
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`shrink-0 p-2.5 rounded-xl border transition-all cursor-pointer ${
              showFilterDrawer
                ? 'bg-white text-emerald-700 border-white shadow-sm'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/25'
            }`}
            title="সিলেবাস ও ফিল্টার সেটিংস"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>

        {/* সেশনের পরিসংখ্যান */}
        <div className="relative mt-4 grid grid-cols-4 gap-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white/12 border border-white/15 backdrop-blur-sm px-1.5 py-2 text-center">
              <Icon size={14} className="mx-auto text-amber-200" />
              <div className="mt-0.5 text-sm sm:text-lg font-extrabold leading-tight">{value}</div>
              <div className="text-[10px] sm:text-[11px] text-emerald-50/80 font-semibold">{label}</div>
            </div>
          ))}
        </div>

        {/* পরবর্তী মাইলফলক */}
        <div className="relative mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 transition-all duration-500"
              style={{ width: `${(milestoneProgress / MILESTONE) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-emerald-50/90 shrink-0">
            🎉 {toBengaliNumber(milestoneProgress)}/{toBengaliNumber(MILESTONE)} ধারাবাহিক সঠিক
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. অনুশীলনের ধরন                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
        {SPELLING_MODES.map((m) => {
          const active = activeMode === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMode(m.id)}
              className={`relative text-left p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                active
                  ? m.activeCard
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
              }`}
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${m.iconBg}`}>
                <Icon size={18} />
              </span>
              <span className="block mt-2 text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                {m.title}
              </span>
              <span className="block mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {m.desc}
              </span>
              {active && (
                <CheckCircle2 size={16} className="absolute top-2.5 right-2.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* সিলেবাসের সারাংশ ও ফিল্টার */}
      <div className="flex items-center justify-between gap-2 mb-4 px-1">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          অনুশীলনের শব্দভাণ্ডার: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{toBengaliNumber(pool.length)}টি শব্দ</span>
        </span>
        <button
          type="button"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <Filter size={12} />
          <span>{showFilterDrawer ? 'ফিল্টার লুকান' : 'খণ্ড / পাঠ বাছাই'}</span>
        </button>
      </div>

      {/* Collapsible Syllabus Filter Panel */}
      {showFilterDrawer && (
        <div className="p-4 mb-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              সিলেবাস অনুযায়ী শব্দ নির্বাচন
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              উপলব্ধ শব্দ: {toBengaliNumber(pool.length)}টি
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <MultiSelectDropdown
              label="খণ্ড"
              options={volumeSourceOptions}
              selected={selectedVolumes}
              onChange={handleVolumesChange}
              placeholder="খণ্ড নির্বাচন"
            />
            <MultiSelectDropdown
              label="অধ্যায়"
              options={availableChapters}
              selected={selectedChapters}
              onChange={handleChaptersChange}
              placeholder="সব অধ্যায়"
            />
            <MultiSelectDropdown
              label="পাঠ / দরস"
              options={availableLessons}
              selected={selectedLessons}
              onChange={setSelectedLessons}
              placeholder="সব পাঠ"
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN INTERACTIVE PRACTICE CANVAS                           */}
      {/* ------------------------------------------------------------- */}
      {pool.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Filter size={24} />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            নির্বাচিত ফিল্টারে কোনো শব্দ পাওয়া যায়নি। অনুগ্রহ করে অন্য খণ্ড বা অধ্যায় নির্বাচন করুন।
          </p>
          <button
            type="button"
            onClick={() => setShowFilterDrawer(true)}
            className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold cursor-pointer"
          >
            ফিল্টার পরিবর্তন করুন
          </button>
        </div>
      ) : (
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          {/* ধরনের রঙের রেখা */}
          <div className={`h-1.5 bg-gradient-to-r ${mode.bar}`} />

          <div className="p-5 sm:p-8">
            {/* ধরন ও প্রশ্ন নম্বর */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold ${mode.chip}`}>
                <ModeIcon size={13} />
                <span>{mode.title}</span>
                <span className="font-arabic font-bold opacity-80" dir="rtl">• {mode.arabic}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                প্রশ্ন {toBengaliNumber(questionNo)}
              </span>
            </div>

            {/* ========================================================= */}
            {/* MODE 1: LETTER TILES (হরফ সাজানো)                         */}
            {/* ========================================================= */}
            {activeMode === 'tiles' && currentWord && (
              <div>
                {/* Target Presentation Card */}
                <div className="text-center mb-5">
                  {pictureName && (
                    <div className="flex justify-center mb-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700/50 flex items-center justify-center shadow-xs">
                        <BookPicture name={pictureName} className="w-full h-full" />
                      </div>
                    </div>
                  )}

                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    এই অর্থের আরবি শব্দটি হরফ সাজিয়ে লিখুন
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentWord.bengali || currentWord.bangla}
                  </h2>

                  <button
                    type="button"
                    onClick={() => playWordAudio(currentWord.arabic)}
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer transition-colors border border-emerald-200/70 dark:border-emerald-800/60"
                  >
                    <Volume2 size={14} />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                </div>

                {/* Placed Tiles Track (Assembled Word) — খালি ঘরগুলো দেখায় কয়টি হরফ বাকি */}
                <div className="mb-4">
                  <div
                    className={`min-h-[84px] sm:min-h-[96px] p-3 rounded-2xl border-2 transition-all flex flex-wrap items-center justify-center gap-2 ${
                      isAnswered
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20'
                          : 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/20'
                        : 'border-dashed border-emerald-300/80 dark:border-emerald-800/70 bg-emerald-50/30 dark:bg-slate-800/40'
                    }`}
                    dir="rtl"
                  >
                    {placedTiles.map((tile) => (
                      <button
                        key={tile.id}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleReturnTile(tile)}
                        className={`touch-manipulation min-w-[52px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-2xl sm:text-3xl font-bold font-serif border-2 border-b-4 transition-all active:border-b-2 active:translate-y-0.5 shadow-sm cursor-pointer ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-rose-600 text-white border-rose-700'
                            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-emerald-300 dark:border-emerald-700 hover:border-rose-400'
                        }`}
                        title="ট্যাপ করে ফেরত নিন"
                      >
                        {tile.text}
                      </button>
                    ))}
                    {!isAnswered && Array.from({ length: Math.max(0, totalTiles - placedTiles.length) }).map((_, i) => (
                      <span
                        key={`slot-${i}`}
                        className="min-w-[52px] h-[54px] sm:h-[62px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Live Connected Arabic Script Preview (হরফ জোড়ার লাইভ রূপ) */}
                  {placedTiles.length > 0 && (
                    <div className="flex items-center justify-center gap-2.5 mt-2.5 py-1 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 max-w-sm mx-auto">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        সংযুক্ত রূপ:
                      </span>
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400" dir="rtl">
                        {assembledPreview}
                      </span>
                    </div>
                  )}

                  {placedTiles.length > 0 && !isAnswered && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAvailableTiles([...availableTiles, ...placedTiles]);
                          setPlacedTiles([]);
                        }}
                        className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <RotateCcw size={12} />
                        <span>সব ফেরত নিন</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Available Scrambled Tiles Rack */}
                <div className="mb-2">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center mb-2">
                    শব্দের প্রথম হরফ থেকে শুরু করে ক্রমানুসারে ট্যাপ করুন
                  </p>
                  <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 p-4 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60" dir="rtl">
                    {availableTiles.length === 0 ? (
                      <span className="text-xs text-slate-400 py-1" dir="ltr">
                        সব হরফ স্থাপন করা হয়েছে
                      </span>
                    ) : (
                      availableTiles.map((tile) => (
                        <button
                          key={tile.id}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectTile(tile)}
                          className="touch-manipulation min-w-[52px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-emerald-50 hover:to-white dark:hover:from-slate-600 text-slate-800 dark:text-white text-2xl sm:text-3xl font-bold font-serif border-2 border-b-4 border-slate-200 dark:border-slate-600 hover:border-emerald-400 shadow-sm transition-all active:border-b active:translate-y-1 cursor-pointer"
                        >
                          {tile.text}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* MODE 2: DICTATION & KEYBOARD (শ্রুতলিপি ও কিবোর্ড)          */}
            {/* ========================================================= */}
            {activeMode === 'dictation' && currentWord && (
              <div>
                {/* Circular Hero Audio Speaker */}
                <div className="flex flex-col items-center justify-center my-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    শব্দটি শুনুন, তারপর আরবিতে লিখুন — শুধু হরফ লিখলেই হবে, হরকত লাগবে না
                  </p>
                  <div className="relative">
                    {!isAnswered && <span className="absolute inset-0 rounded-full bg-sky-400/30 animate-ping" aria-hidden="true" />}
                    <button
                      type="button"
                      onClick={() => playWordAudio(currentWord.arabic)}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 transition-all cursor-pointer active:scale-95 group"
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 size={36} className="group-hover:scale-110 transition-transform" />
                      <span className="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-white text-sky-800 text-[10px] font-bold shadow-xs">
                        {audioSpeed === 0.75 ? 'ধীর গতি 🐢' : 'শুনুন 🔊'}
                      </span>
                    </button>
                  </div>

                  {/* Speed & Hint Toggles */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                    {/* Speed Toggle (1.0x vs 0.75x) */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextSpeed = audioSpeed === 1.0 ? 0.75 : 1.0;
                        setAudioSpeed(nextSpeed);
                        playWordAudio(currentWord.arabic, nextSpeed);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                        audioSpeed === 0.75
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 text-teal-800 dark:text-teal-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                      title="উচ্চারণের গতি পরিবর্তন করুন"
                    >
                      <span>{audioSpeed === 0.75 ? '🐢 তারতীল (০.৭৫x)' : '⚡ স্বাভাবিক গতি (১.০x)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMeaningHint(!showMeaningHint)}
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {showMeaningHint ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{showMeaningHint ? 'অর্থ লুকান' : 'অর্থের ইঙ্গিত'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStrictHarakat(!strictHarakat)}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors cursor-pointer ${
                        strictHarakat
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                      title="চালু করলে হরকতসহ মিলিয়ে যাচাই হবে"
                    >
                      {strictHarakat ? 'হরকতসহ যাচাই: চালু' : 'হরকতসহ যাচাই: বন্ধ'}
                    </button>
                  </div>

                  {showMeaningHint && (
                    <div className="mt-2.5 px-4 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300 animate-in fade-in duration-200">
                      অর্থ: {currentWord.bengali || currentWord.bangla}
                    </div>
                  )}

                  {englishKeyWarning && (
                    <div className="mt-2 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold animate-pulse">
                      ⚠️ অনুগ্রহ করে অন-স্ক্রিন কিবোর্ড দিয়ে আরবি টাইপ করুন
                    </div>
                  )}
                </div>

                {/* Arabic Input Screen */}
                <div className="my-3">
                  <div className="relative max-w-lg mx-auto">
                    <input
                      ref={inputRef}
                      type="text"
                      dir="rtl"
                      value={typedInput}
                      onChange={handleInputChange}
                      placeholder="এখানে আরবি বানান লিখুন..."
                      disabled={isAnswered}
                      className="w-full text-center text-3xl sm:text-4xl font-bold font-serif py-3.5 px-5 rounded-2xl border-2 border-sky-400/50 focus:border-sky-600 focus:outline-none bg-sky-50/40 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-xl shadow-inner"
                    />
                    {typedInput && !isAnswered && (
                      <button
                        type="button"
                        onClick={handleVirtualClear}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="মুছুন"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Virtual Arabic Keyboard */}
                {!isAnswered && (
                  <div className="mt-3">
                    <ArabicVirtualKeyboard
                      onKeyPress={handleVirtualKeyPress}
                      onBackspace={handleVirtualBackspace}
                      onClear={handleVirtualClear}
                      onSpace={handleVirtualSpace}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* MODE 3: CONFUSING LETTERS (সমোচ্চারিত হরফ)                */}
            {/* ========================================================= */}
            {activeMode === 'confusing' && confusingChallenge && (
              <div>
                <div className="text-center mb-6">
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 mb-2">
                    {confusingChallenge.confusingSet?.label}
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    "{confusingChallenge.questionBangla}"
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    এই অর্থের জন্য কোন আরবি বানানটি সঠিক? দুটিরই উচ্চারণ শুনে তুলনা করুন।
                  </p>
                </div>

                {/* 2 Side-by-Side Comparison Cards with individual audio buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto my-6">
                  {confusingChallenge.options.map((opt, i) => {
                    const isSelected = selectedConfusingOpt === opt;
                    let style = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30';

                    if (isAnswered) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500';
                      } else if (isSelected) {
                        style = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500';
                      } else {
                        style = 'opacity-40 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <div
                        key={i}
                        className={`p-4 sm:p-6 rounded-2xl border-2 text-center transition-all relative group ${style}`}
                      >
                        <span className="absolute top-2 left-2.5 text-[10px] font-black text-slate-400">
                          {['ক', 'খ'][i] || toBengaliNumber(i + 1)}
                        </span>
                        <button
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleConfusingOptionClick(opt)}
                          className="w-full cursor-pointer focus:outline-none"
                        >
                          <span className="text-3xl sm:text-4xl font-bold font-serif block mb-1.5" dir="rtl">
                            {opt.text}
                          </span>
                          {/* কোনটি শুদ্ধ তা উত্তর দেওয়ার পরেই দেখানো হয় */}
                          {isAnswered && (
                            <span className="text-xs font-bold block mb-2">
                              {opt.note}
                            </span>
                          )}
                        </button>

                        {/* Acoustic contrast audio player on both options */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playWordAudio(opt.text);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-2xs"
                          title="এই রূপের উচ্চারণ শুনুন"
                        >
                          <Volume2 size={13} />
                          <span>উচ্চারণ</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Learning Note */}
                {isAnswered && confusingChallenge.explanation && (
                  <div className="max-w-xl mx-auto p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 my-4 animate-in fade-in duration-200">
                    <div className="flex items-start gap-2.5">
                      <Lightbulb size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          বানান ও মাখরাজের নিয়ম:
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                          {confusingChallenge.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* MODE 4: TASHKEEL CHALLENGE (হরকত পরীক্ষা)                 */}
            {/* ========================================================= */}
            {activeMode === 'tashkeel' && tashkeelChallenge && (
              <div>
                <div className="text-center mb-6">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block">
                    হরকতবিহীন শব্দ
                  </span>
                  <div className="inline-block mt-1.5 px-6 py-2 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-800/60">
                    <h2 className="text-4xl sm:text-5xl font-bold font-serif text-slate-900 dark:text-white leading-relaxed" dir="rtl">
                      {tashkeelChallenge.unvowelled}
                    </h2>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block text-sm font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 px-3 py-0.5 rounded-full">
                      অর্থ: {tashkeelChallenge.questionBangla}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    সঠিক হরকতযুক্ত (তাশকীল) রূপটি নির্বাচন করুন:
                  </p>
                </div>

                {/* 4 Choices Grid with individual audio buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 max-w-xl mx-auto my-6">
                  {tashkeelChallenge.options.map((opt, i) => {
                    const isSelected = selectedTashkeelOpt === opt;
                    let style = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50/40 dark:hover:bg-violet-950/30';

                    if (isAnswered) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500';
                      } else if (isSelected) {
                        style = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500';
                      } else {
                        style = 'opacity-40 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <div
                        key={i}
                        className={`relative p-4 sm:p-5 rounded-2xl border-2 text-center transition-all ${style}`}
                      >
                        <span className="absolute top-2 left-2.5 text-[10px] font-black text-slate-400">
                          {['ক', 'খ', 'গ', 'ঘ'][i] || toBengaliNumber(i + 1)}
                        </span>
                        <button
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleTashkeelOptionClick(opt)}
                          className="w-full cursor-pointer focus:outline-none"
                        >
                          <span className="text-2xl sm:text-3xl font-bold font-serif block mb-1 leading-loose" dir="rtl">
                            {opt.text}
                          </span>
                          {/* সঠিক/ভুল লেবেল শুধু উত্তর দেওয়ার পরে */}
                          {isAnswered && (
                            <span className="text-xs font-bold block mb-2">
                              {opt.note}
                            </span>
                          )}
                        </button>

                        {isAnswered && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playWordAudio(opt.text);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-violet-600 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors shadow-2xs"
                          >
                            <Volume2 size={12} />
                            <span>উচ্চারণ শুনুন</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. BOTTOM ACTION & FEEDBACK                                */}
            {/* ========================================================= */}
            {hasQuestion && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
                {isAnswered ? (
                  <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
                  }`}>
                    <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                        isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}>
                        {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-sm sm:text-base font-extrabold ${
                          isCorrect ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'
                        }`}>
                          {isCorrect ? 'মাশাআল্লাহ! নির্ভুল হয়েছে 🎉' : 'ভুল হয়েছে, আবার চেষ্টা করুন!'}
                        </h3>
                        <p className={`text-xs sm:text-sm mt-0.5 ${
                          isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                        }`}>
                          {feedbackNote}
                        </p>
                        {/* সঠিক বানান বড় করে, উচ্চারণসহ */}
                        {answerArabic && (!isCorrect || /রূপ:$/.test(feedbackNote)) && (
                          <button
                            type="button"
                            onClick={() => playWordAudio(answerArabic)}
                            className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 cursor-pointer"
                            title="উচ্চারণ শুনুন"
                          >
                            <span className="font-arabic text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed" dir="rtl">
                              {answerArabic}
                            </span>
                            <Volume2 size={15} className="text-emerald-600 shrink-0" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={setupNextQuestion}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <span>পরবর্তী শব্দ</span>
                        <ArrowRight size={16} />
                      </button>

                      {onOpenReport && (
                        <button
                          type="button"
                          onClick={() => onOpenReport({
                            type: 'spelling',
                            word: currentWord?.arabic,
                            meaning: currentWord?.bengali || currentWord?.bangla,
                            mode: activeMode
                          })}
                          title="রিপোর্ট"
                          className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-rose-600 cursor-pointer"
                        >
                          <Flag size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">
                      {activeMode === 'tiles'
                        ? 'হরফগুলো সাজিয়ে মিলিয়ে নিন'
                        : activeMode === 'dictation'
                        ? 'লেখা শেষ হলে যাচাই করুন (Enter)'
                        : 'সঠিক উত্তর দিয়ে স্ট্রিক বজায় রাখুন'}
                    </span>

                    {activeMode === 'tiles' && (
                      <button
                        type="button"
                        disabled={placedTiles.length === 0}
                        onClick={() => validateTiles()}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          placedTiles.length > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        যাচাই করুন
                      </button>
                    )}

                    {activeMode === 'dictation' && (
                      <button
                        type="button"
                        disabled={!typedInput.trim()}
                        onClick={validateDictation}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          typedInput.trim()
                            ? 'bg-sky-600 hover:bg-sky-700 text-white cursor-pointer active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        যাচাই করুন
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
