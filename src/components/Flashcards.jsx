import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Shuffle, RotateCw, RotateCcw, CheckCircle2, 
  HelpCircle, Star, Play, Pause, ArrowLeftRight, Flag, Image as ImageIcon
} from 'lucide-react';
import AudioButton from './AudioButton';
import MultiSelectDropdown from './MultiSelectDropdown';
import BookPicture, { hasBookPicture } from './BookPicture';
import { getWordPicture, hasWordPicture } from '../utils/pictureMap';
import { playArabicAudio, playBengaliAudio } from '../utils/audio';
import { setMasteredId, getMasteredIds, getReviewIds, toggleStarredId, getStarredIds, getShowEnglish } from '../utils/storage';
import { getEnglishTranslation } from '../utils/englishDictionary';
import { recordDailyActivity, XP_RULES } from '../utils/gamification';
import { checkFlashcardMasteryEligible } from '../utils/xpIntegrity';

import lessonsData from '../data/lessons.json';
import { volumeSourceOptions, matchVolumeItem, getAvailableChapters, getAvailableLessons, unifiedTypeOptions } from '../utils/filterUtils';

export default function Flashcards({ vocabulary, chapters, onOpenReport }) {
  const [showEnglish, setShowEnglish] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglish(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  const [showVisuals, setShowVisuals] = useState(() => {
    try {
      return localStorage.getItem('uls_flashcards_show_visuals') !== 'false';
    } catch (e) {
      return true;
    }
  });
  const [cardDirection, setCardDirection] = useState(() => {
    try {
      return localStorage.getItem('uls_flashcards_direction') || 'ar-to-bn';
    } catch (e) {
      return 'ar-to-bn';
    }
  }); // 'ar-to-bn' | 'bn-to-ar' | 'mixed'
  const [selectedVolumes, setSelectedVolumes] = useState(['1']);
  const [selectedChapters, setSelectedChapters] = useState(['all']);
  const [selectedLessons, setSelectedLessons] = useState(['all']);
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'review' | 'mastered'
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [masteredIds, setMasteredIds] = useState([]);
  const [reviewIds, setReviewIds] = useState([]);
  const [starredIds, setStarredIds] = useState([]);

  const cardStartTimeRef = useRef(Date.now());

  useEffect(() => {
    cardStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // Effective direction for active card (supports mixed / alternating direction)
  const effectiveDirection = useMemo(() => {
    if (cardDirection === 'mixed') {
      return currentIndex % 2 === 0 ? 'ar-to-bn' : 'bn-to-ar';
    }
    return cardDirection;
  }, [cardDirection, currentIndex]);

  // Load storage states
  useEffect(() => {
    setMasteredIds(getMasteredIds());
    setReviewIds(getReviewIds());
    setStarredIds(getStarredIds());
  }, []);

  // Filter vocabulary strictly by synced Volumes/Source, Chapters, Lessons, Types, or Status
  const filteredWords = useMemo(() => {
    return vocabulary.filter(w => {
      if (statusFilter === 'review') {
        return reviewIds.includes(w.id);
      }
      if (statusFilter === 'mastered') {
        return masteredIds.includes(w.id);
      }
      const matchVol = matchVolumeItem(w, selectedVolumes);
      const matchCh = !selectedChapters || selectedChapters.length === 0 || selectedChapters.includes('all') || selectedChapters.includes(w.chapterId);
      const matchLes = !selectedLessons || selectedLessons.length === 0 || selectedLessons.includes('all') || selectedLessons.includes(w.lessonId);
      const matchType = !selectedTypes || selectedTypes.length === 0 || selectedTypes.includes('all') || selectedTypes.includes(w.type) || (w.subType && selectedTypes.includes(w.subType));
      return matchVol && matchCh && matchLes && matchType;
    });
  }, [vocabulary, selectedVolumes, selectedChapters, selectedLessons, selectedTypes, statusFilter, reviewIds, masteredIds]);

  // Current Card
  const currentCard = filteredWords[currentIndex] || filteredWords[0] || null;

  // Reset index on filter change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedVolumes, selectedChapters, selectedLessons, selectedTypes, statusFilter]);

  // Prevent out of bounds if list shrinks during review session
  useEffect(() => {
    if (filteredWords.length > 0 && currentIndex >= filteredWords.length) {
      setCurrentIndex(0);
    }
  }, [filteredWords.length, currentIndex]);

  // Volume change handler with cascading reset
  const handleVolumesChange = (newVols) => {
    setSelectedVolumes(newVols);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
    setStatusFilter('all');
  };

  // Chapter change handler with cascading reset
  const handleChaptersChange = (newChs) => {
    setSelectedChapters(newChs);
    setSelectedLessons(['all']);
    setStatusFilter('all');
  };

  // Lesson change handler
  const handleLessonsChange = (newLes) => {
    setSelectedLessons(newLes);
    setStatusFilter('all');
  };

  // Type change handler
  const handleTypesChange = (newTypes) => {
    setSelectedTypes(newTypes);
    setStatusFilter('all');
  };

  // Navigation & Action Handlers
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % (filteredWords.length || 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredWords.length) % (filteredWords.length || 1));
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setCurrentIndex(randomIndex);
  };

  // রিভিশন/মুখস্থ তালিকা দেখার সময় কার্ডটি তালিকা থেকে সরে গেলে পরের কার্ড এই ঘরেই চলে আসে,
  // তাই তখন সামনে এগোনো হয় না (নাহলে একটি কার্ড বাদ পড়ে যায়)
  const advanceAfterMark = (res) => {
    const id = currentCard.id;
    const leavesList =
      (statusFilter === 'review' && !res.review.includes(id)) ||
      (statusFilter === 'mastered' && !res.mastered.includes(id));
    if (leavesList) {
      setIsFlipped(false);
    } else {
      handleNext();
    }
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    const timeSpentOnCard = Date.now() - cardStartTimeRef.current;
    const res = setMasteredId(currentCard.id, true);
    setMasteredIds(res.mastered);
    setReviewIds(res.review);
    
    // অ্যান্টি-চিট মাইলস্টোন ভ্যালিডেশন (একই শব্দ বারবার আনমার্ক/মার্ক বা স্প্যাম ক্লিক করে XP নেওয়া অসম্ভব)
    const check = checkFlashcardMasteryEligible(res.mastered.length, isFlipped, timeSpentOnCard);
    if (check.eligible && check.bonusXp > 0) {
      recordDailyActivity(check.bonusXp);
    }
    advanceAfterMark(res);
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    const res = setMasteredId(currentCard.id, false);
    setMasteredIds(res.mastered);
    setReviewIds(res.review);
    advanceAfterMark(res);
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    if (!currentCard) return;
    const res = toggleStarredId(currentCard.id);
    setStarredIds(res);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        handleMarkMastered();
      } else if (e.key === '2') {
        handleMarkReview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredWords.length, currentCard]);

  // Auto-play feature: Plays front face audio, flips, plays back face audio, then advances
  useEffect(() => {
    let flipTimer;
    let nextTimer;
    if (isAutoPlay && currentCard) {
      if (effectiveDirection === 'bn-to-ar') {
        // Bengali -> Arabic mode
        // 1. Play Bengali on front face
        if (currentCard.bengali) {
          playBengaliAudio(currentCard.bengali);
        }

        // 2. After 2.2s, flip card to back and play Arabic voice
        flipTimer = setTimeout(() => {
          setIsFlipped(true);
          playArabicAudio(currentCard.arabic);

          // 3. After Arabic audio plays (2.5s), advance to next card
          nextTimer = setTimeout(() => {
            handleNext();
          }, 2500);
        }, 2200);
      } else {
        // Arabic -> Bengali mode
        // 1. Play Arabic on front face
        playArabicAudio(currentCard.arabic);

        // 2. After 2.4s, flip card to back and play boys' Bengali voice
        flipTimer = setTimeout(() => {
          setIsFlipped(true);
          if (currentCard.bengali) {
            playBengaliAudio(currentCard.bengali);
          }

          // 3. After Bengali audio plays (2.5s), advance to next card
          nextTimer = setTimeout(() => {
            handleNext();
          }, 2500);
        }, 2400);
      }
    }
    return () => {
      clearTimeout(flipTimer);
      clearTimeout(nextTimer);
    };
  }, [isAutoPlay, currentIndex, currentCard, effectiveDirection]);

  // Dynamic chapters based on volume and authentic Tamrin parts
  const availableChapters = useMemo(() => {
    return getAvailableChapters(selectedVolumes, lessonsData);
  }, [selectedVolumes]);

  // Dynamic lessons based on volume, chapter, and individual 111 Tamrins
  const availableLessons = useMemo(() => {
    return getAvailableLessons(selectedVolumes, selectedChapters, lessonsData);
  }, [selectedVolumes, selectedChapters]);

  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;
  const isCurrentReview = currentCard ? reviewIds.includes(currentCard.id) : false;
  const isCurrentStarred = currentCard ? starredIds.includes(currentCard.id) : false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto flex-1">
            {/* 1. Synced Volume & Book Source Multi-Select */}
            <div className="w-full sm:w-52">
              <MultiSelectDropdown
                options={volumeSourceOptions}
                selected={selectedVolumes}
                onChange={handleVolumesChange}
                placeholder="সকল খণ্ড ও উৎস"
              />
            </div>

            {/* 2. Chapter Multi-Select */}
            <div className="w-full sm:w-44">
              <MultiSelectDropdown
                options={availableChapters}
                selected={selectedChapters}
                onChange={handleChaptersChange}
                placeholder="সকল অধ্যায়"
                align="right"
              />
            </div>

            {/* 3. Lesson Multi-Select */}
            <div className="w-full sm:w-44">
              <MultiSelectDropdown
                options={availableLessons}
                selected={selectedLessons}
                onChange={handleLessonsChange}
                placeholder="সকল পাঠ"
              />
            </div>

            {/* 4. Type Multi-Select */}
            <div className="w-full sm:w-44">
              <MultiSelectDropdown
                options={unifiedTypeOptions}
                selected={selectedTypes}
                onChange={handleTypesChange}
                placeholder="সকল উপাদান"
                align="right"
              />
            </div>
          </div>

          {/* Right controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            {/* Direction 3-way cycle button */}
            <button
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setCardDirection(prev => {
                  const next = prev === 'ar-to-bn' ? 'bn-to-ar' : prev === 'bn-to-ar' ? 'mixed' : 'ar-to-bn';
                  try { localStorage.setItem('uls_flashcards_direction', next); } catch (e) {}
                  return next;
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="ক্লিক করে দিক পরিবর্তন করুন: আরবি ➔ বাংলা, বাংলা ➔ আরবি, উভয়মুখী (মিশ্র)"
            >
              <ArrowLeftRight size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>
                {cardDirection === 'ar-to-bn' 
                  ? 'আরবি ➔ বাংলা' 
                  : cardDirection === 'bn-to-ar' 
                  ? 'বাংলা ➔ আরবি' 
                  : 'উভয়মুখী (মিশ্র)'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold ml-0.5">
                ট্যাপ
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shadow-xs cursor-pointer active:scale-95 ${
                isAutoPlay
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'
              }`}
              title={isAutoPlay ? "অটোপ্লে বন্ধ করুন" : "অটোপ্লে চালু করুন"}
            >
              {isAutoPlay ? <Pause size={13} className="text-amber-600" /> : <Play size={13} className="text-slate-400" />}
              <span>অটোপ্লে</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowVisuals(prev => {
                  const next = !prev;
                  try { localStorage.setItem('uls_flashcards_show_visuals', JSON.stringify(next)); } catch (e) {}
                  return next;
                });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs cursor-pointer active:scale-95 ${
                showVisuals
                  ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'
              }`}
              title={showVisuals ? "ছবি প্রদর্শন বন্ধ করুন" : "কার্ডে ৩ডি ছবি প্রদর্শন চালু করুন"}
            >
              <ImageIcon size={13} className={showVisuals ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
              <span>ছবি: {showVisuals ? 'অন' : 'অফ'}</span>
            </button>
          </div>
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            {statusFilter === 'review' ? (
              <RotateCcw size={32} className="text-amber-500" />
            ) : statusFilter === 'mastered' ? (
              <CheckCircle2 size={32} className="text-emerald-500" />
            ) : (
              <HelpCircle size={32} />
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            {statusFilter === 'review'
              ? 'মাশাআল্লাহ! রিভিশন তালিকায় কোনো শব্দ নেই'
              : statusFilter === 'mastered'
              ? 'মুখস্থ তালিকায় কোনো শব্দ নেই'
              : 'নির্বাচিত ফিল্টারে কোনো কার্ড পাওয়া যায়নি'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {statusFilter === 'review'
              ? 'আপনার চিহ্নিত করা সব রিভিশন শেষ হয়েছে অথবা এখনও কোনো শব্দ রিভিশন তালিকায় যোগ করেননি।'
              : statusFilter === 'mastered'
              ? 'এখনও কোনো শব্দ মুখস্থ তালিকায় যোগ করা হয়নি।'
              : 'অনুগ্রহ করে অন্য খণ্ড, অধ্যায় বা পাঠ নির্বাচন করুন অথবা সব ফিল্টার রিসেট করুন।'}
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSelectedVolumes(['1']);
              setSelectedChapters(['all']);
              setSelectedLessons(['all']);
              setSelectedTypes(['all']);
              setCurrentIndex(0);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            সব কার্ডে ফিরে যান
          </button>
        </div>
      ) : (
        <>
          {/* Progress & Card Counters */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                কার্ড {currentIndex + 1} / {filteredWords.length}
              </span>
              {currentCard && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[130px] sm:max-w-none">
                  {currentCard.volume} • {currentCard.chapter?.split('(')[0]?.trim()} • {currentCard.lesson}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter(prev => prev === 'review' ? 'all' : 'review')}
                disabled={reviewIds.length === 0}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all cursor-pointer ${
                  statusFilter === 'review'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/40 font-bold'
                    : reviewIds.length > 0
                      ? 'border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-95'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
                title={reviewIds.length > 0 ? (statusFilter === 'review' ? "সকল কার্ডে ফিরে যান" : "ক্লিক করে শুধুমাত্র রিভিশনের শব্দগুলো অনুশীলন করুন") : "রিভিশন তালিকায় কোনো শব্দ নেই"}
              >
                <RotateCcw size={12} />
                <span>রিভিশন: {reviewIds.length}</span>
                {statusFilter === 'review' && (
                  <span className="text-[10px] ml-0.5 bg-amber-600 px-1 py-0.2 rounded-full text-white">✕</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter(prev => prev === 'mastered' ? 'all' : 'mastered')}
                disabled={masteredIds.length === 0}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all cursor-pointer ${
                  statusFilter === 'mastered'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/40 font-bold'
                    : masteredIds.length > 0
                      ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
                title={masteredIds.length > 0 ? (statusFilter === 'mastered' ? "সকল কার্ডে ফিরে যান" : "ক্লিক করে শুধুমাত্র মুখস্থ হওয়া শব্দগুলো দেখুন") : "মুখস্থ তালিকায় কোনো শব্দ নেই"}
              >
                <CheckCircle2 size={12} />
                <span>মুখস্থ: {masteredIds.length}</span>
                {statusFilter === 'mastered' && (
                  <span className="text-[10px] ml-0.5 bg-emerald-700 px-1 py-0.2 rounded-full text-white">✕</span>
                )}
              </button>
            </div>
          </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / (filteredWords.length || 1)) * 100}%` }}
        />
      </div>

      {/* Active Filter Mode Banner */}
      {statusFilter === 'review' && (
        <div className="flex items-center justify-between px-4 py-2.5 mb-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <RotateCcw size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span><strong>রিভিশন মোড:</strong> শুধুমাত্র রিভিশন প্রয়োজন এমন {filteredWords.length}টি শব্দ অনুশীলন করছেন</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className="font-bold underline hover:text-amber-950 dark:hover:text-white cursor-pointer ml-3 shrink-0"
          >
            সব শব্দে ফিরুন
          </button>
        </div>
      )}

      {statusFilter === 'mastered' && (
        <div className="flex items-center justify-between px-4 py-2.5 mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-300 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span><strong>মুখস্থ মোড:</strong> আপনার আয়ত্ত করা {filteredWords.length}টি শব্দ দেখছেন</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className="font-bold underline hover:text-emerald-950 dark:hover:text-white cursor-pointer ml-3 shrink-0"
          >
            সব শব্দে ফিরুন
          </button>
        </div>
      )}

      {/* 3D Flashcard Container */}
      <div className="perspective-1000 w-full min-h-[300px] sm:min-h-[360px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-[300px] sm:h-[360px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl shadow-slate-200/50 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front Face */}
          <div className="absolute inset-0 w-full h-full p-5 sm:p-8 flex flex-col justify-between backface-hidden rounded-3xl">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReport?.({
                    source: 'flashcard_front',
                    arabic: currentCard?.arabic,
                    bengali: currentCard?.bengali,
                    volume: currentCard?.volume,
                    chapter: currentCard?.chapter,
                    lesson: currentCard?.lesson
                  });
                }}
                title="ভুলত্রুটি রিপোর্ট করুন"
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer"
              >
                <Flag size={13} className="text-rose-500" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleStar}
                  className={`p-2 rounded-xl transition-colors ${
                    isCurrentStarred 
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' 
                      : 'text-slate-400 hover:text-amber-400'
                  }`}
                  title="স্টার / প্রিয় শব্দ"
                >
                  <Star size={20} fill={isCurrentStarred ? 'currentColor' : 'none'} />
                </button>
                {/* Front face audio: Arabic in ar-to-bn mode ONLY */}
                {effectiveDirection === 'ar-to-bn' && currentCard?.arabic && (
                  <AudioButton text={currentCard.arabic} size={22} title="আরবি উচ্চারণ শুনুন" />
                )}
              </div>
            </div>

            {/* Center prompt */}
            <div className="text-center my-auto px-2">
              {effectiveDirection === 'ar-to-bn' ? (
                /* Standard Mode: Front is Arabic */
                <>
                  <h2 className={`font-arabic text-slate-900 dark:text-white font-bold leading-relaxed tracking-wide select-none ${
                    (currentCard?.arabic?.length || 0) > 40
                      ? 'text-2xl sm:text-3xl'
                      : (currentCard?.arabic?.length || 0) > 20
                      ? 'text-3xl sm:text-4xl'
                      : 'text-5xl sm:text-6xl'
                  }`}>
                    {currentCard?.arabic}
                  </h2>
                </>
              ) : (
                /* Reverse Mode: Front is Bengali */
                <>
                  {showVisuals && hasWordPicture(currentCard) && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 flex items-center justify-center animate-fade-in">
                      <BookPicture 
                        name={getWordPicture(currentCard)} 
                        className="w-full h-full object-contain drop-shadow-md" 
                      />
                    </div>
                  )}
                  <h2 className={`font-bold text-slate-900 dark:text-white leading-snug select-none ${
                    (currentCard?.bengali?.length || 0) > 35 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                  }`}>
                    {currentCard?.bengali}
                  </h2>
                  {showEnglish && getEnglishTranslation(currentCard, currentCard?.bengali) && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold font-sans">
                      <span className="opacity-70 text-[10px] uppercase font-bold">EN</span>
                      <span>{getEnglishTranslation(currentCard, currentCard?.bengali)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 w-full h-full p-5 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-2 border-emerald-500/20">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReport?.({
                    source: 'flashcard_back',
                    arabic: currentCard?.arabic,
                    bengali: currentCard?.bengali,
                    volume: currentCard?.volume,
                    chapter: currentCard?.chapter,
                    lesson: currentCard?.lesson
                  });
                }}
                title="ভুলত্রুটি রিপোর্ট করুন"
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer"
              >
                <Flag size={13} className="text-rose-500" />
              </button>
              {currentCard && (
                <AudioButton text={currentCard.arabic} size={20} title="আরবি উচ্চারণ শুনুন" />
              )}
            </div>

            {/* Center reveal */}
            <div className="text-center my-auto px-2">
              {effectiveDirection === 'ar-to-bn' ? (
                /* Standard Mode Back: Bengali + Visual */
                <>
                  {showVisuals && hasWordPicture(currentCard) && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 flex items-center justify-center animate-fade-in">
                      <BookPicture 
                        name={getWordPicture(currentCard)} 
                        className="w-full h-full object-contain drop-shadow-md" 
                      />
                    </div>
                  )}
                  <p className={`text-emerald-600 dark:text-emerald-400 font-arabic font-bold mb-2 ${
                    (currentCard?.arabic?.length || 0) > 40 ? 'text-lg sm:text-xl' : 'text-2xl'
                  }`}>
                    {currentCard?.arabic}
                  </p>
                  <h3 className={`font-bold text-slate-900 dark:text-white leading-snug ${
                    (currentCard?.bengali?.length || 0) > 35 ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'
                  }`}>
                    {currentCard?.bengali}
                  </h3>
                  {showEnglish && getEnglishTranslation(currentCard, currentCard?.bengali) && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold font-sans">
                      <span className="opacity-70 text-[10px] uppercase font-bold">EN</span>
                      <span>{getEnglishTranslation(currentCard, currentCard?.bengali)}</span>
                    </div>
                  )}
                  {currentCard?.hint && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl inline-block border border-amber-200 dark:border-amber-800">
                      💡 ইঙ্গিত: {currentCard.hint}
                    </p>
                  )}
                  {currentCard?.task && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-amber-700 dark:text-amber-300">টাস্ক: {currentCard.task}</span>
                    </p>
                  )}
                </>
              ) : (
                /* Reverse Mode Back: Arabic reveal with harakat */
                <>
                  <h2 className={`font-arabic text-slate-900 dark:text-white font-bold leading-relaxed tracking-wide select-none ${
                    (currentCard?.arabic?.length || 0) > 40
                      ? 'text-3xl sm:text-4xl'
                      : (currentCard?.arabic?.length || 0) > 20
                      ? 'text-4xl sm:text-5xl'
                      : 'text-5xl sm:text-6xl'
                  }`}>
                    {currentCard?.arabic}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                    বাংলা অর্থ: <strong className="text-slate-900 dark:text-white">{currentCard?.bengali}</strong>
                  </p>
                  {showEnglish && getEnglishTranslation(currentCard, currentCard?.bengali) && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold font-sans">
                      <span className="text-[10px] uppercase font-bold opacity-75">EN</span>
                      <span>{getEnglishTranslation(currentCard, currentCard?.bengali)}</span>
                    </div>
                  )}
                  {currentCard?.hint && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      💡 {currentCard.hint}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons & Learning Actions */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm transition-all"
            title="আগের কার্ড (বাম তীর)"
          >
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>আগেরটি</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCw size={15} className="sm:w-[16px] sm:h-[16px]" />
            <span>ফ্লিপ</span>
          </button>

          <button
            onClick={handleShuffle}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
            title="এলোমেলো করুন (Shuffle)"
          >
            <Shuffle size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs sm:text-sm transition-all"
            title="পরের কার্ড (ডান তীর)"
          >
            <span>পরেরটি</span>
            <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Spaced Repetition Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
          <button
            onClick={handleMarkReview}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
              isCurrentReview
                ? 'bg-amber-500 text-white'
                : 'border border-amber-300/80 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100/70'
            }`}
            title="রিভিশন তালিকায় রাখুন [২]"
          >
            <RotateCcw size={15} />
            <span>রিভিশন</span>
          </button>

          <button
            onClick={handleMarkMastered}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer ${
              isCurrentMastered
                ? 'bg-emerald-600 text-white'
                : 'border border-emerald-300/80 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70'
            }`}
            title="মুখস্থ তালিকায় যোগ করুন [১]"
          >
            <CheckCircle2 size={16} />
            <span>মুখস্থ</span>
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
