import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Sparkles, Puzzle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Volume2, RefreshCw, Flag, ArrowLeftRight, PenTool, Lock, Image as ImageIcon } from 'lucide-react';
import AudioButton from './AudioButton';
import MultiSelectDropdown from './MultiSelectDropdown';
import BookPicture, { DistanceScene, hasBookPicture } from './BookPicture';
import { getWordPicture, hasWordPicture, getPictureVocabularyPool } from '../utils/pictureMap';
import { pickDistractors, pickDistinctItems } from '../utils/quizOptions';
import { playArabicAudio } from '../utils/audio';
import { playSuccessChime, playMistakeNotice } from '../utils/soundEffects';
import { recordDailyActivity, XP_RULES } from '../utils/gamification';
import { isSuperUser } from '../utils/superUser';

import lessonsData from '../data/lessons.json';
import { volumeSourceOptions, matchVolumeItem, getAvailableChapters, getAvailableLessons, unifiedTypeOptions } from '../utils/filterUtils';
import { getShowEnglish } from '../utils/storage';
import { getEnglishTranslation } from '../utils/englishDictionary';
import { recordMistake } from '../utils/mistakesManager';

import { shuffle } from '../utils/shuffle';
export default function Practice({ vocabulary = [], user, onOpenReport, onNavigateTab }) {
  const isSuper = isSuperUser(user);

  const [showEnglish, setShowEnglish] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglish(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  const [practiceMode, setPracticeMode] = useState('quiz'); // 'quiz', 'picture', or 'matching'
  const [matchingCardType, setMatchingCardType] = useState('picture'); // 'picture' or 'text'
  const [direction, setDirection] = useState(() => {
    try {
      return localStorage.getItem('uls_practice_direction') || 'bn-to-ar';
    } catch (e) {
      return 'bn-to-ar';
    }
  });
  const [currentDirection, setCurrentDirection] = useState('bn-to-ar');
  const [selectedVolumes, setSelectedVolumes] = useState(['1']);
  const [selectedChapters, setSelectedChapters] = useState(['all']);
  const [selectedLessons, setSelectedLessons] = useState(['all']);
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  
  // MCQ State
  const [quizWord, setQuizWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);

  // Picture Quiz State
  const [pictureWord, setPictureWord] = useState(null);
  const [pictureOptions, setPictureOptions] = useState([]);
  const [selectedPictureOption, setSelectedPictureOption] = useState(null);
  const [isPictureAnswered, setIsPictureAnswered] = useState(false);

  // Matching Game State
  const [matchingCards, setMatchingCards] = useState([]);
  const [selectedFirst, setSelectedFirst] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [matchingMoves, setMatchingMoves] = useState(0);

  // Dynamic chapters based on volume and authentic Tamrin parts
  const availableChapters = useMemo(() => {
    return getAvailableChapters(selectedVolumes, lessonsData);
  }, [selectedVolumes]);

  // Dynamic lessons based on volume, chapter, and individual 111 Tamrins
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

  // Pool for selected book source, volume, chapter, lesson, and type
  const volumePool = useMemo(() => {
    return vocabulary.filter(w => {
      const matchVol = matchVolumeItem(w, selectedVolumes);
      const matchCh = !selectedChapters || selectedChapters.length === 0 || selectedChapters.includes('all') || selectedChapters.includes(w.chapterId);
      const matchLes = !selectedLessons || selectedLessons.length === 0 || selectedLessons.includes('all') || selectedLessons.includes(w.lessonId);
      const matchType = !selectedTypes || selectedTypes.length === 0 || selectedTypes.includes('all') || selectedTypes.includes(w.type) || (w.subType && selectedTypes.includes(w.subType));
      return matchVol && matchCh && matchLes && matchType;
    });
  }, [vocabulary, selectedVolumes, selectedChapters, selectedLessons, selectedTypes]);

  // Setup new MCQ Question
  const nextQuizQuestion = (forcedDir) => {
    if (!volumePool || volumePool.length === 0) {
      setQuizWord(null);
      setOptions([]);
      return;
    }

    const activeDirSetting = forcedDir || direction;
    let actualDir = activeDirSetting;
    if (activeDirSetting === 'mixed') {
      actualDir = Math.random() > 0.5 ? 'bn-to-ar' : 'ar-to-bn';
    }
    setCurrentDirection(actualDir);

    // একই প্রশ্ন পরপর যেন না আসে
    const fresh = volumePool.length > 1 && quizWord ? volumePool.filter(w => w.id !== quizWord.id) : volumePool;
    const word = fresh[Math.floor(Math.random() * fresh.length)];
    const wc = (t) => String(t || '').trim().split(/\s+/).length;
    const sameKind = (w) => (wc(w.arabic) > 1) === (wc(word.arabic) > 1);

    // ৩টি ভুল অপশন: আগে নির্বাচিত পরিসর থেকে, কম হলে পুরো শব্দভাণ্ডার থেকে (শব্দের উত্তরে শব্দ, বাক্যের উত্তরে বাক্য)।
    // একই আরবি শব্দ বা একই বাংলা অর্থের অপশন বাদ, যেন দুটি অপশন সঠিক না হয়।
    const distractors = pickDistractors(word, [volumePool, vocabulary], 3, sameKind);

    const isBnToAr = actualDir === 'bn-to-ar';

    const opts = shuffle([
      { 
        text: isBnToAr ? word.arabic : word.bengali, 
        isCorrect: true,
        audioText: word.arabic 
      },
      ...distractors.map(d => ({ 
        text: isBnToAr ? d.arabic : d.bengali, 
        isCorrect: false,
        audioText: d.arabic 
      }))
    ]);

    setQuizWord(word);
    setOptions(opts);
    setSelectedOption(null);
    setIsAnswered(false);

    // Audio: Only auto-play Arabic audio when question is Arabic-to-Bengali (listening/reading comprehension)
    // For Bengali-to-Arabic, do NOT auto-play before answering so as not to spoil the Arabic answer!
    if (!isBnToAr) {
      setTimeout(() => playArabicAudio(word.arabic), 150);
    }
  };

  // Setup new Picture Quiz Question
  const nextPictureQuestion = () => {
    let pool = volumePool.filter(w => hasWordPicture(w));
    if (pool.length < 2) {
      pool = getPictureVocabularyPool(vocabulary);
    }
    if (!pool || pool.length === 0) {
      setPictureWord(null);
      setPictureOptions([]);
      return;
    }

    const word = pool[Math.floor(Math.random() * pool.length)];
    const picName = getWordPicture(word);

    // একই ছবির বা একই অর্থের শব্দ অপশনে আসে না
    const differentPicture = (w) => getWordPicture(w) !== picName;
    const distractors = pickDistractors(word, [pool, getPictureVocabularyPool(vocabulary)], 3, differentPicture);

    const opts = shuffle([
      { text: word.arabic, bangla: word.bengali, isCorrect: true },
      ...distractors.map(d => ({ text: d.arabic, bangla: d.bengali, isCorrect: false }))
    ]);

    setPictureWord({ ...word, pictureName: picName });
    setPictureOptions(opts);
    setSelectedPictureOption(null);
    setIsPictureAnswered(false);
  };

  const handlePictureOptionClick = (opt) => {
    if (isPictureAnswered) return;
    setSelectedPictureOption(opt);
    setIsPictureAnswered(true);

    if (opt.isCorrect) {
      playSuccessChime();
      playArabicAudio(pictureWord.arabic);
      setStreak(prev => prev + 1);
      recordDailyActivity(XP_RULES.perCorrect);
      setTimeout(() => {
        nextPictureQuestion();
      }, 1200);
    } else {
      playMistakeNotice();
      if (pictureWord) {
        recordMistake({
          id: pictureWord.id,
          type: pictureWord.type || 'word',
          arabic: pictureWord.arabic,
          bengali: pictureWord.bengali,
          sourceTitle: pictureWord.volume ? `${pictureWord.volume} • ${pictureWord.lesson || ''}` : 'চিত্র অনুশীলন'
        });
      }
      setTimeout(() => playArabicAudio(pictureWord.arabic), 350);
      setStreak(0);
    }
  };

  // Setup new Matching Game
  const startMatchingGame = (forcedType) => {
    const activeType = forcedType !== undefined ? forcedType : matchingCardType;
    let pool = volumePool;
    if (activeType === 'picture') {
      const picWords = volumePool.filter(w => hasWordPicture(w));
      if (picWords.length >= 4) {
        pool = picWords;
      } else {
        const allPics = getPictureVocabularyPool(vocabulary);
        pool = allPics.length > 0 ? allPics : volumePool;
      }
    }

    if (!pool || pool.length === 0) {
      setMatchingCards([]);
      setMatchedIds([]);
      return;
    }

    let candidateWords = pool.filter(w => (w.arabic?.length || 0) < 30);
    if (candidateWords.length < 6) {
      const extraPool = (activeType === 'picture' ? getPictureVocabularyPool(vocabulary) : vocabulary).filter(
        w => (w.arabic?.length || 0) < 30 && !candidateWords.some(c => c.id === w.id)
      );
      const needed = 6 - candidateWords.length;
      const extra = shuffle(extraPool).slice(0, needed);
      candidateWords = [...candidateWords, ...extra];
    }

    // একই শব্দ/অর্থ বা একই ছবির দুটি কার্ড থাকলে জোড় মেলানো অস্পষ্ট হয়, তাই পরস্পর আলাদা ৬টি শব্দ
    const samePicture = (a, b) => activeType === 'picture' && hasWordPicture(a) && getWordPicture(a) === getWordPicture(b);
    const selected = pickDistinctItems(candidateWords, 6, samePicture);

    const cards = [];
    selected.forEach(w => {
      cards.push({ id: `ar-${w.id}`, wordId: w.id, text: w.arabic, type: 'ar' });
      if (activeType === 'picture' && hasWordPicture(w)) {
        cards.push({ id: `pic-${w.id}`, wordId: w.id, text: w.bengali, picture: getWordPicture(w), type: 'pic' });
      } else {
        cards.push({ id: `bn-${w.id}`, wordId: w.id, text: w.bengali, type: 'bn' });
      }
    });

    setMatchingCards(shuffle(cards));
    setSelectedFirst(null);
    setMatchedIds([]);
    setMatchingMoves(0);
  };

  // Trigger setup on filter or mode change
  useEffect(() => {
    if (practiceMode === 'quiz') {
      nextQuizQuestion();
    } else if (practiceMode === 'picture') {
      nextPictureQuestion();
    } else {
      startMatchingGame();
    }
  }, [practiceMode, selectedVolumes, selectedChapters, selectedLessons, selectedTypes, volumePool.length]);

  // Handle MCQ click
  const handleOptionClick = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt.isCorrect) {
      playSuccessChime();
      playArabicAudio(quizWord.arabic);
      setStreak(prev => prev + 1);
      recordDailyActivity(XP_RULES.perCorrect);
      setTimeout(() => {
        nextQuizQuestion();
      }, 1000);
    } else {
      playMistakeNotice();
      if (quizWord) {
        recordMistake({
          id: quizWord.id,
          type: quizWord.type || 'word',
          arabic: quizWord.arabic,
          bengali: quizWord.bengali,
          sourceTitle: quizWord.volume ? `${quizWord.volume} • ${quizWord.lesson || ''}` : 'শব্দ কুইজ'
        });
      }
      setTimeout(() => playArabicAudio(quizWord.arabic), 350);
      setStreak(0);
    }
  };

  // Handle Matching click
  const handleCardClick = (card) => {
    if (matchedIds.includes(card.wordId)) return;
    if (selectedFirst && selectedFirst.id === card.id) {
      setSelectedFirst(null);
      return;
    }

    if (!selectedFirst) {
      setSelectedFirst(card);
      if (card.type === 'ar') playArabicAudio(card.text);
      return;
    }

    // Second card chosen
    setMatchingMoves(prev => prev + 1);
    if (card.type === 'ar') playArabicAudio(card.text);

    if (selectedFirst.wordId === card.wordId && selectedFirst.type !== card.type) {
      // Matched!
      setMatchedIds(prev => [...prev, card.wordId]);
      setSelectedFirst(null);
    } else {
      // Miss
      setTimeout(() => {
        setSelectedFirst(null);
      }, 500);
    }
  };

  const handleResetFilters = () => {
    setSelectedVolumes(['all']);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
    setSelectedTypes(['all']);
  };

  const getQuizWordBadgeLabel = (word) => {
    if (!word) return 'অনুশীলন';
    const typeLabel = word.typeLabel || (word.type === 'sentence' ? 'পূর্ণ বাক্য' : word.type === 'phrase' ? 'বাক্যাংশ' : word.type === 'tamrin' ? 'আত-তামরীন' : 'শব্দার্থ');
    const pos = word.partOfSpeech?.trim();
    if (!pos || pos === typeLabel || pos === 'সাধারণ' || pos === 'অন্যান্য' || pos === 'পূর্ণ বাক্য') {
      return typeLabel;
    }
    return `${typeLabel} • ${pos}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Header & Sub-mode switch */}
      <div className="flex flex-col gap-3.5 mb-6 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Row 1: Sub-mode Pills */}
        <div className="w-full overflow-x-auto no-scrollbar pb-0.5">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 w-max sm:w-auto min-w-full">
            <button
              type="button"
              onClick={() => setPracticeMode('quiz')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                practiceMode === 'quiz'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen size={15} />
              <span>কুইজ</span>
            </button>

            <button
              type="button"
              onClick={() => setPracticeMode('picture')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                practiceMode === 'picture'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="৩D ছবি দেখে সঠিক আরবি রূপ অনুশীলন"
            >
              <ImageIcon size={15} />
              <span>ছবি কুইজ</span>
            </button>

            <button
              type="button"
              onClick={() => setPracticeMode('matching')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                practiceMode === 'matching'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Puzzle size={15} />
              <span>শব্দ মেলানো</span>
            </button>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('spelling')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSuper 
                    ? 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-300/50' 
                    : 'text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20'
                }`}
                title={isSuper ? "বানান ও ইমলা অনুশীলন সেকশনে যান" : "বানান ও ইমলা (লক করা)"}
              >
                {isSuper ? <PenTool size={14} /> : <Lock size={13} className="text-amber-500" />}
                <span>বানান ↗</span>
                {!isSuper && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    লক
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Direction Switcher & Item Counter */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {/* Translation Direction Cycle Switcher (For Quiz Mode) */}
          {practiceMode === 'quiz' && (
            <button
              type="button"
              onClick={() => {
                const nextDir = direction === 'ar-to-bn' ? 'bn-to-ar' : direction === 'bn-to-ar' ? 'mixed' : 'ar-to-bn';
                setDirection(nextDir);
                try { localStorage.setItem('uls_practice_direction', nextDir); } catch (e) {}
                nextQuizQuestion(nextDir);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="ক্লিক করে দিক পরিবর্তন করুন: আরবি ➔ বাংলা, বাংলা ➔ আরবি, উভয়মুখী (মিশ্র)"
            >
              <ArrowLeftRight size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>
                {direction === 'ar-to-bn' 
                  ? 'আরবি ➔ বাংলা' 
                  : direction === 'bn-to-ar' 
                  ? 'বাংলা ➔ আরবি' 
                  : 'উভয়মুখী (মিশ্র)'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold ml-0.5">
                ট্যাপ
              </span>
            </button>
          )}

          {/* Matching Card Type Toggle (For Matching Mode) */}
          {practiceMode === 'matching' && (
            <button
              type="button"
              onClick={() => {
                const nextType = matchingCardType === 'picture' ? 'text' : 'picture';
                setMatchingCardType(nextType);
                startMatchingGame(nextType);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="কার্ডের ধরন পরিবর্তন করুন"
            >
              {matchingCardType === 'picture' ? <ImageIcon size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Puzzle size={14} className="text-emerald-600 dark:text-emerald-400" />}
              <span>{matchingCardType === 'picture' ? 'কার্ড: ছবি ➔ আরবি' : 'কার্ড: বাংলা ➔ আরবি'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold ml-0.5">
                টগল
              </span>
            </button>
          )}

          {practiceMode === 'picture' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ছবি দেখে শব্দ যাচাই</span>
            </div>
          )}

          <div className="text-xs text-slate-500 font-medium ml-auto">
            উপলব্ধ উপাদান: <span className="font-bold text-slate-800 dark:text-slate-200">{volumePool.length}</span> টি
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* 1. Synced Volume & Source Select */}
          <div className="w-full sm:w-48">
            <MultiSelectDropdown
              options={volumeSourceOptions}
              selected={selectedVolumes}
              onChange={handleVolumesChange}
              placeholder="সকল খণ্ড ও উৎস"
            />
          </div>

          {/* 2. Chapter Select */}
          <div className="w-full sm:w-40">
            <MultiSelectDropdown
              options={availableChapters}
              selected={selectedChapters}
              onChange={handleChaptersChange}
              placeholder="সকল অধ্যায়"
              align="right"
            />
          </div>

          {/* 3. Lesson Select */}
          <div className="w-full sm:w-40">
            <MultiSelectDropdown
              options={availableLessons}
              selected={selectedLessons}
              onChange={setSelectedLessons}
              placeholder="সকল পাঠ"
            />
          </div>

          {/* 4. Type / Content Select */}
          <div className="w-full sm:w-40">
            <MultiSelectDropdown
              options={unifiedTypeOptions}
              selected={selectedTypes}
              onChange={setSelectedTypes}
              placeholder="সকল বিষয়বস্তু"
              align="right"
            />
          </div>
        </div>
      </div>

      {/* Empty State Fallback */}
      {(!volumePool || volumePool.length === 0) && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <RotateCcw size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            এই পাঠে পর্যাপ্ত শব্দ পাওয়া যায়নি
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            অনুগ্রহ করে উপরের ড্রপডাউন থেকে অন্য কোনো পাঠ অথবা "সকল পাঠ" নির্বাচন করুন।
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm"
          >
            <RefreshCw size={16} />
            <span>সকল পাঠ নির্বাচন করুন</span>
          </button>
        </div>
      )}

      {/* Mode 1: MCQ Quiz Practice */}
      {practiceMode === 'quiz' && quizWord && (
        <div>
          {/* Streak indicator */}
          <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Sparkles size={16} />
              টানা সঠিক উত্তর: {streak}টি
            </span>
            <span>{quizWord.volume || '১ম খণ্ড'} • {quizWord.lesson || 'পাঠ'}</span>
          </div>

          {/* Question Card */}
          {(() => {
            const isBnToAr = currentDirection === 'bn-to-ar';
            return (
              <>
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center mb-6">
                  {/* Card Header: Category & Controls */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Clean non-duplicated category badge */}
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 truncate">
                        {getQuizWordBadgeLabel(quizWord)}
                      </span>
                      {/* Direction badge */}
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 shrink-0">
                        {isBnToAr ? 'বাংলা ➔ আরবি' : 'আরবি ➔ বাংলা'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* In Arabic question mode: always show Audio. In Bengali question mode: show Audio once answered */}
                      {(!isBnToAr || isAnswered) && (
                        <AudioButton text={quizWord.arabic} size={20} />
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenReport?.({
                          source: 'practice_quiz',
                          direction: currentDirection,
                          arabic: quizWord.arabic,
                          bengali: quizWord.bengali,
                          volume: quizWord.volume,
                          lesson: quizWord.lesson
                        })}
                        title="ভুলত্রুটি রিপোর্ট করুন"
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all cursor-pointer"
                      >
                        <Flag size={14} className="text-rose-400 hover:text-rose-500" />
                      </button>
                    </div>
                  </div>

                  {/* Main Question Display */}
                  {hasWordPicture(quizWord) && (
                    <div className="flex justify-center my-3">
                      <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                        <BookPicture name={getWordPicture(quizWord)} className="w-16 h-16 sm:w-20 sm:h-20" />
                      </div>
                    </div>
                  )}

                  {isBnToAr ? (
                    <div className="py-2">
                      <p className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-300 mb-2">
                        সঠিক আরবি রূপটি নির্বাচন করুন:
                      </p>
                      <h3 className="font-extrabold text-slate-900 dark:text-white my-3 select-none leading-relaxed text-2xl sm:text-3xl max-w-xl mx-auto">
                        "{quizWord.bengali}"
                      </h3>
                      {showEnglish && getEnglishTranslation(quizWord, quizWord.bengali) && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold font-sans mt-1">
                          <span className="opacity-70 text-[10px] uppercase font-bold">EN</span>
                          <span>{getEnglishTranslation(quizWord, quizWord.bengali)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-2">
                      <h3 className={`font-arabic font-bold text-slate-900 dark:text-white my-3 select-none leading-relaxed ${
                        (quizWord.arabic?.length || 0) > 40
                          ? 'text-2xl sm:text-3xl'
                          : (quizWord.arabic?.length || 0) > 20
                          ? 'text-3xl sm:text-4xl'
                          : 'text-5xl sm:text-6xl'
                      }`}>
                        {quizWord.arabic}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3">
                        সঠিক বাংলা অর্থটি নির্বাচন করুন:
                      </p>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                  {options.map((opt, idx) => {
                    let style = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50';

                    if (isAnswered) {
                      if (opt.isCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
                      } else if (selectedOption === opt && !opt.isCorrect) {
                        style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
                      } else {
                        style = 'opacity-50 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleOptionClick(opt)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          isBnToAr 
                            ? 'text-right font-arabic font-bold text-2xl sm:text-3xl' 
                            : 'text-left font-semibold text-base'
                        } ${style}`}
                        dir={isBnToAr ? 'rtl' : 'ltr'}
                      >
                        <span className="leading-relaxed">{opt.text}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {isAnswered && isBnToAr && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                playArabicAudio(opt.text);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-400 hover:text-emerald-600 transition-colors"
                              title="উচ্চারণ শুনুন"
                            >
                              <Volume2 size={16} />
                            </span>
                          )}
                          {isAnswered && opt.isCorrect && (
                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && selectedOption === opt && !opt.isCorrect && (
                            <XCircle size={18} className="text-rose-500 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Next Button */}
          {isAnswered && !selectedOption?.isCorrect && (
            <div className="text-center">
              <button
                onClick={nextQuizQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-700 transition-all"
              >
                <span>পরের শব্দ অনুশীলন করুন</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Visual Picture Quiz (ছবি দেখে কুইজ) */}
      {practiceMode === 'picture' && pictureWord && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
          {/* Header & Streak */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                ছবিটি দেখুন ও সঠিক আরবি রূপটি নির্বাচন করুন
              </span>
            </div>
            <div className="flex items-center gap-2">
              {streak > 1 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  🔥 {streak} স্ট্রিক!
                </span>
              )}
              {isPictureAnswered && (
                <AudioButton text={pictureWord.arabic} size={20} title="উচ্চারণ শুনুন" />
              )}
            </div>
          </div>

          {/* Picture Display */}
          <div className="text-center my-6">
            <div className="inline-block p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-inner transition-all hover:scale-105">
              {pictureWord.distance ? (
                <DistanceScene name={pictureWord.pictureName} distance={pictureWord.distance} className="w-36 h-36 sm:w-44 sm:h-44" />
              ) : (
                <BookPicture name={pictureWord.pictureName} className="w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-sm" />
              )}
            </div>

            {isPictureAnswered && (
              <div className="mt-3 animate-fade-in">
                <p className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {pictureWord.bengali}
                </p>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {pictureOptions.map((opt, idx) => {
              const isSelected = selectedPictureOption === opt;
              let style = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-slate-900 dark:text-white';

              if (isPictureAnswered) {
                if (opt.isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
                } else {
                  style = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isPictureAnswered}
                  onClick={() => handlePictureOptionClick(opt)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer text-right font-arabic font-bold text-2xl sm:text-3xl ${style}`}
                  dir="rtl"
                >
                  <span className="flex-1 text-center">{opt.text}</span>
                  {isPictureAnswered && opt.isCorrect && (
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isPictureAnswered && isSelected && !opt.isCorrect && (
                    <XCircle size={20} className="text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {isPictureAnswered && !selectedPictureOption?.isCorrect && (
            <div className="text-center">
              <button
                type="button"
                onClick={nextPictureQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <span>পরের ছবি অনুশীলন করুন</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Matching Pairs Game */}
      {practiceMode === 'matching' && matchingCards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-500">
            <span>মোট মিলানো হয়েছে: {matchedIds.length} / {matchingCards.length / 2} জোড়া</span>
            <div className="flex items-center gap-3">
              <span>চেষ্টা: {matchingMoves} বার</span>
              <button
                onClick={() => startMatchingGame()}
                className="flex items-center gap-1 text-emerald-600 hover:underline"
              >
                <RotateCcw size={13} />
                নতুন খেলা
              </button>
            </div>
          </div>

          {matchedIds.length === (matchingCards.length / 2) && matchingCards.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                মাশাআল্লাহ! আপনি সব জোড়া মিলিয়েছেন!
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                আপনি {matchingMoves}টি চালে সফলভাবে সম্পন্ন করেছেন।
              </p>
              <button
                onClick={() => startMatchingGame()}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-md"
              >
                আবার খেলুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {matchingCards.map((card) => {
                const isMatched = matchedIds.includes(card.wordId);
                const isSelected = selectedFirst?.id === card.id;

                let cardStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:scale-[1.02] cursor-pointer shadow-sm';

                if (isMatched) {
                  cardStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 opacity-60 pointer-events-none';
                } else if (isSelected) {
                  cardStyle = 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 ring-2 ring-amber-500 text-amber-900 dark:text-amber-100 shadow-md';
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`h-24 p-2 sm:p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${cardStyle}`}
                  >
                    {card.type === 'pic' ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <BookPicture name={card.picture} className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-xs" />
                        <span className="text-[10px] text-slate-500 font-medium truncate max-w-full mt-0.5">{card.text}</span>
                      </div>
                    ) : (
                      <span className={`select-none ${card.type === 'ar' ? 'font-arabic text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white' : 'text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200'}`}>
                        {card.text}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
