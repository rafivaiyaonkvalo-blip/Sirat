import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Clock, Heart, ArrowRight, CheckCircle, XCircle, Award, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, Sparkles, Flag, Volume2 } from 'lucide-react';
import AudioButton from './AudioButton';
import ScoreCard from './ScoreCard';
import { playArabicAudio } from '../utils/audio';
import { pickDistractors } from '../utils/quizOptions';
import MultiSelectDropdown from './MultiSelectDropdown';
import { saveExamResult } from '../utils/storage';
import { recordDailyActivity, XP_RULES } from '../utils/gamification';
import { auditAndClampExamXp } from '../utils/xpIntegrity';
import lessonsData from '../data/lessons.json';
import { volumeSourceOptions, matchVolumeItem, getAvailableChapters, getAvailableLessons, unifiedTypeOptions } from '../utils/filterUtils';
import { recordMistake } from '../utils/mistakesManager';

import { shuffle } from '../utils/shuffle';
export default function GrillMeExam({ vocabulary, initialCustomWords = null, onOpenReport }) {
  // Setup configuration state
  const [examMode, setExamMode] = useState('grill'); // 'grill' (3 strikes) or 'timed'
  const [selectedVolumes, setSelectedVolumes] = useState(['all']);
  const [selectedChapters, setSelectedChapters] = useState(['all']);
  const [selectedLessons, setSelectedLessons] = useState(['all']);
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [selectedPOSs, setSelectedPOSs] = useState(['all']);
  const [timerDuration, setTimerDuration] = useState(30); // 15, 30, 45, 0 (no timer)
  const [questionCount, setQuestionCount] = useState(20);
  const [questionType, setQuestionType] = useState('mixed'); // 'mixed', 'ar-to-bn', 'bn-to-ar'
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Exam execution state
  const [isStarted, setIsStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [strikesLeft, setStrikesLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeSpentTotal, setTimeSpentTotal] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const answeredRef = useRef(false);

  // Generate question options
  const generateQuestions = (pool, count) => {
    const shuffled = shuffle(pool);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // ৩টি ভুল অপশন: শব্দের প্রশ্নে শব্দ, বাক্যের প্রশ্নে বাক্য।
    // একই আরবি শব্দ (হরকত/'ال' বাদে) বা একই বাংলা অর্থের অপশন বাদ, যেন দুটি অপশন সঠিক না হয়।
    const isPhrase = (w) => /\s/.test(String(w.arabic || '').trim());
    const split = (list) => ({ phrase: list.filter(isPhrase), single: list.filter(w => !isPhrase(w)) });
    const poolByKind = split(pool);
    const vocabByKind = split(vocabulary);

    return selected.map((word) => {
      const kind = isPhrase(word) ? 'phrase' : 'single';
      let distractors = pickDistractors(word, [poolByKind[kind], vocabByKind[kind]], 3);
      if (distractors.length < 3) distractors = pickDistractors(word, [pool], 3, () => true, distractors);

      const qType = questionType === 'mixed' 
        ? (Math.random() > 0.5 ? 'ar-to-bn' : 'bn-to-ar')
        : questionType;

      const isArToBn = qType === 'ar-to-bn';

      const options = shuffle([
        { 
          text: isArToBn ? word.bengali : word.arabic, 
          isCorrect: true, 
          word 
        },
        ...distractors.map(d => ({
          text: isArToBn ? d.bengali : d.arabic,
          isCorrect: false,
          word: d
        }))
      ]);

      return {
        word,
        qType,
        prompt: isArToBn ? word.arabic : word.bengali,
        subPrompt: isArToBn ? 'সঠিক বাংলা অর্থটি বেছে নিন' : 'সঠিক আরবি শব্দটি বেছে নিন',
        correctText: isArToBn ? word.bengali : word.arabic,
        options
      };
    });
  };

  const startExamWithWords = (words) => {
    const generated = generateQuestions(words, words.length);
    setQuestions(generated);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setStrikesLeft(3);
    setTimeLeft(30);
    setTimeSpentTotal(0);
    setMistakes([]);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCompleted(false);
    answeredRef.current = false;
    setIsStarted(true);
  };

  // If custom words provided (e.g. re-testing mistakes)
  useEffect(() => {
    if (initialCustomWords && initialCustomWords.length > 0) {
      startExamWithWords(initialCustomWords);
    }
  }, [initialCustomWords]);
  // Dynamic chapters based on volume
  // Dynamic chapters based on volume and authentic Tamrin parts
  const availableChapters = useMemo(() => {
    return getAvailableChapters(selectedVolumes, lessonsData);
  }, [selectedVolumes]);

  // Dynamic lessons based on volume, chapter, and individual 111 Tamrins
  const availableLessons = useMemo(() => {
    return getAvailableLessons(selectedVolumes, selectedChapters, lessonsData);
  }, [selectedVolumes, selectedChapters]);

  const typeOptions = useMemo(() => [
    { id: 'word', label: 'একক শব্দ (Word)', count: vocabulary.filter(w => w.type === 'word').length },
    { id: 'phrase', label: 'মুরাক্কাব / বাক্যাংশ (Phrase)', count: vocabulary.filter(w => w.type === 'phrase').length },
    { id: 'sentence', label: 'পূর্ণ বাক্য (Sentence)', count: vocabulary.filter(w => w.type === 'sentence').length },
    { id: 'dialogue', label: 'কথোপকথন (Dialogue)', count: vocabulary.filter(w => w.type === 'dialogue').length },
    { id: 'tamrin', label: '✍️ আত-তামরীনুল কিতাবী (সকল)', count: vocabulary.filter(w => w.bookSource === 'tamrin').length },
    { id: 'tamrin_trans_bn', label: '🇧🇩 তামরীন: বাংলায় অনুবাদ (ক)', count: vocabulary.filter(w => w.subType === 'tamrin_trans_bn').length },
    { id: 'tamrin_tarkib', label: '🔍 তামরীন: তারকীব ও বিশ্লেষণ (খ)', count: vocabulary.filter(w => w.subType === 'tamrin_tarkib').length },
    { id: 'tamrin_trans_ar', label: '🇸🇦 তামরীন: আরবি বাবল ও রূপান্তর (গ)', count: vocabulary.filter(w => w.subType === 'tamrin_trans_ar').length },
  ].filter(opt => opt.count > 0), [vocabulary]); // খালি ধরন দেখালে পরীক্ষা চুপচাপ সব প্রশ্ন থেকে শুরু হয়

  const availablePOSOptions = useMemo(() => {
    const counts = {};
    vocabulary.forEach(w => {
      if (w.partOfSpeech) {
        counts[w.partOfSpeech] = (counts[w.partOfSpeech] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([pos, count]) => ({
        id: pos,
        label: pos,
        count
      }));
  }, [vocabulary]);

  const handleVolumesChange = (newVols) => {
    setSelectedVolumes(newVols);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
  };

  const handleVolumeToggle = (volId) => {
    if (volId === 'all') {
      handleVolumesChange(['all']);
      return;
    }

    const current = (selectedVolumes || []).filter(v => v !== 'all');
    let updated;
    if (current.includes(volId)) {
      // Toggle off / unselect
      updated = current.filter(v => v !== volId);
    } else {
      // Toggle on / select
      updated = [...current, volId];
    }

    const allIndividuals = ['1', '2', '3', 'tamrin'];
    const hasAllIndividuals = allIndividuals.every(id => updated.includes(id));

    if (updated.length === 0 || hasAllIndividuals) {
      handleVolumesChange(['all']);
    } else {
      handleVolumesChange(updated);
    }
  };

  const handleChaptersChange = (newChs) => {
    setSelectedChapters(newChs);
    setSelectedLessons(['all']);
  };

  // Exam pool matching all criteria with unified volume & book support
  const examPool = useMemo(() => {
    return vocabulary.filter(w => {
      const matchVol = matchVolumeItem(w, selectedVolumes);
      const matchCh = !selectedChapters || selectedChapters.length === 0 || selectedChapters.includes('all') || selectedChapters.includes(w.chapterId);
      const matchLes = !selectedLessons || selectedLessons.length === 0 || selectedLessons.includes('all') || selectedLessons.includes(w.lessonId);
      const matchType = !selectedTypes || selectedTypes.length === 0 || selectedTypes.includes('all') || selectedTypes.includes(w.type) || (w.subType && selectedTypes.includes(w.subType));
      const matchPOS = !selectedPOSs || selectedPOSs.length === 0 || selectedPOSs.includes('all') || selectedPOSs.includes(w.partOfSpeech);
      return matchVol && matchCh && matchLes && matchType && matchPOS;
    });
  }, [vocabulary, selectedVolumes, selectedChapters, selectedLessons, selectedTypes, selectedPOSs]);

  const activeCustomFilterCount = useMemo(() => {
    let count = 0;
    if (selectedChapters.length > 0 && !selectedChapters.includes('all')) count++;
    if (selectedLessons.length > 0 && !selectedLessons.includes('all')) count++;
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) count++;
    if (selectedPOSs.length > 0 && !selectedPOSs.includes('all')) count++;
    if (timerDuration !== 30) count++;
    if (questionType !== 'mixed') count++;
    return count;
  }, [selectedChapters, selectedLessons, selectedTypes, selectedPOSs, timerDuration, questionType]);

  const handleResetFilters = () => {
    setSelectedVolumes(['all']);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
    setSelectedTypes(['all']);
    setSelectedPOSs(['all']);
    setTimerDuration(30);
    setQuestionCount(20);
    setQuestionType('mixed');
  };

  const startExam = () => {
    let pool = examPool;
    if (!pool || pool.length === 0) {
      pool = vocabulary;
    }

    const targetCount = questionCount >= 9999 ? pool.length : (questionCount || 20);
    const count = Math.min(targetCount, pool.length);
    const generated = generateQuestions(pool, count);
    setQuestions(generated);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setStrikesLeft(3);
    setTimeLeft(timerDuration === 0 ? 0 : timerDuration);
    setTimeSpentTotal(0);
    setMistakes([]);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCompleted(false);
    answeredRef.current = false;
    setIsStarted(true);
  };

  const finishExam = (finalMistakes, finalCorrect, finalIncorrect) => {
    clearInterval(timerRef.current);
    clearInterval(totalTimerRef.current);

    const totalAnswered = finalCorrect + finalIncorrect;
    const percentage = totalAnswered > 0 ? Math.round((finalCorrect / totalAnswered) * 100) : 0;

    // অ্যান্টি-চিট ভ্যালিডেশন: প্রশ্ন সংখ্যা, অতিদ্রুত ক্লিক, দৈনিক সিলিং ও কোলডাউন যাচাই
    const validatedExamXp = auditAndClampExamXp({
      questionCount: totalAnswered,
      percentage,
      timeSpentSec: timeSpentTotal
    });

    const result = {
      total: totalAnswered,
      correct: finalCorrect,
      incorrect: finalIncorrect,
      percentage,
      timeSpent: timeSpentTotal,
      mistakes: finalMistakes,
      earnedXp: validatedExamXp
    };

    saveExamResult(result);
    if (validatedExamXp > 0) {
      recordDailyActivity(validatedExamXp);
    }
    setIsCompleted(true);
  };

  // setTimeout-এর ভেতর থেকে ডাকা হয়, তাই সর্বশেষ গণনা প্যারামিটারে নেওয়া হয় (পুরনো state নয়)
  const advanceQuestion = (finalMistakes, finalCorrect, finalIncorrect) => {
    if (currentIndex + 1 >= questions.length) {
      finishExam(finalMistakes, finalCorrect, finalIncorrect);
    } else {
      const nextIdx = currentIndex + 1;
      answeredRef.current = false;
      setCurrentIndex(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      setTimeLeft(timerDuration === 0 ? 0 : timerDuration);
    }
  };

  const handleTimeOut = () => {
    if (answeredRef.current) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    answeredRef.current = true;
    setIsAnswered(true);
    setIncorrectCount(prev => prev + 1);

    const newMistake = {
      arabic: currentQ.word.arabic,
      correctBengali: currentQ.word.bengali,
      userAnswer: 'সময় শেষ (Time Out)'
    };
    recordMistake({
      id: currentQ.word?.id,
      type: currentQ.word?.type || 'word',
      arabic: currentQ.word?.arabic || '',
      bengali: currentQ.word?.bengali || '',
      sourceTitle: currentQ.word?.volume ? `${currentQ.word.volume} • ${currentQ.word.lesson || ''}` : 'মেধা যাচাই পরীক্ষা'
    });
    const updatedMistakes = [...mistakes, newMistake];
    setMistakes(updatedMistakes);

    if (examMode === 'grill') {
      const remaining = strikesLeft - 1;
      setStrikesLeft(remaining);
      if (remaining <= 0) {
        finishExam(updatedMistakes, correctCount, incorrectCount + 1);
        return;
      }
    }

    setTimeout(() => {
      advanceQuestion(updatedMistakes, correctCount, incorrectCount + 1);
    }, 1500);
  };

  // Timer logic
  useEffect(() => {
    if (!isStarted || isCompleted) return;

    totalTimerRef.current = setInterval(() => {
      setTimeSpentTotal(prev => prev + 1);
    }, 1000);

    if (timerDuration > 0) {
      timerRef.current = setInterval(() => {
        // উত্তর দেওয়ার পর পরবর্তী প্রশ্ন না আসা পর্যন্ত সময় থেমে থাকে
        if (answeredRef.current) return;
        setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [isStarted, isCompleted, currentIndex, strikesLeft, timerDuration]);

  // সময় শেষ হলে বর্তমান প্রশ্নটি ভুল হিসেবে ধরা হয়
  useEffect(() => {
    if (isStarted && !isCompleted && timerDuration > 0 && timeLeft === 0 && !answeredRef.current) {
      handleTimeOut();
    }
  }, [timeLeft]);

  const handleSelectOption = (option) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setIsAnswered(true);
    setSelectedOption(option);

    const currentQ = questions[currentIndex];

    if (option.isCorrect) {
      setCorrectCount(prev => prev + 1);
      setTimeout(() => {
        advanceQuestion(mistakes, correctCount + 1, incorrectCount);
      }, 700);
    } else {
      setIncorrectCount(prev => prev + 1);
      const newMistake = {
        arabic: currentQ.word.arabic,
        correctBengali: currentQ.word.bengali,
        userAnswer: option.text
      };
      recordMistake({
        id: currentQ.word?.id,
        type: currentQ.word?.type || 'word',
        arabic: currentQ.word?.arabic || '',
        bengali: currentQ.word?.bengali || '',
        sourceTitle: currentQ.word?.volume ? `${currentQ.word.volume} • ${currentQ.word.lesson || ''}` : 'মেধা যাচাই পরীক্ষা'
      });
      const updatedMistakes = [...mistakes, newMistake];
      setMistakes(updatedMistakes);

      if (examMode === 'grill') {
        const remaining = strikesLeft - 1;
        setStrikesLeft(remaining);
        if (remaining <= 0) {
          setTimeout(() => {
            finishExam(updatedMistakes, correctCount, incorrectCount + 1);
          }, 1200);
          return;
        }
      }

      setTimeout(() => {
        advanceQuestion(updatedMistakes, correctCount, incorrectCount + 1);
      }, 1400);
    }
  };

  const currentQ = questions[currentIndex];

  // If completed, show ScoreCard
  if (isCompleted) {
    const totalAnswered = correctCount + incorrectCount;
    const percentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const result = {
      total: totalAnswered,
      correct: correctCount,
      incorrect: incorrectCount,
      percentage,
      timeSpent: timeSpentTotal,
      mistakes
    };

    return (
      <ScoreCard
        result={result}
        onRestart={() => {
          setIsStarted(false);
          setIsCompleted(false);
        }}
        onRetakeMistakes={() => {
          if (mistakes.length > 0) {
            const mistakeWords = mistakes.map(m => {
              const matched = vocabulary.find(w => w.arabic === m.arabic);
              return matched || { id: Math.random(), arabic: m.arabic, bengali: m.correctBengali };
            });
            startExamWithWords(mistakeWords);
          }
        }}
      />
    );
  }

  // Setup Screen
  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Award size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  মেধা যাচাই পরীক্ষা
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  মারকাযুল ঈমান • এসো আরবী শিখি শব্দ ও বাক্য মূল্যায়ন
                </p>
              </div>
            </div>
            {activeCustomFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                title="সকল ফিল্টার রিসেট করুন"
              >
                <RotateCcw size={13} />
                <span>রিসেট</span>
              </button>
            )}
          </div>

          {/* Mode Switcher - Compact Segmented Control */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setExamMode('grill')}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  examMode === 'grill'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award size={16} />
                <span>৩-স্ট্রাইক চ্যালেঞ্জ</span>
                <span className="text-[10px] hidden sm:inline px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 font-normal">
                  ৩ ভুলে শেষ
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExamMode('timed')}
                className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  examMode === 'timed'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-teal-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock size={16} />
                <span>সময়ভিত্তিক কুইজ</span>
                <span className="text-[10px] hidden sm:inline px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 font-normal">
                  রিপোর্ট কার্ড
                </span>
              </button>
            </div>
          </div>

          {/* Quick Scope - Unified Volume & Source Selection Pills */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                খণ্ড ও উৎস নির্বাচন <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">(ক্লিক করে একাধিক নির্বাচন করুন)</span>
              </label>
              {!selectedVolumes.includes('all') && selectedVolumes.length > 0 && (
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  নির্বাচিত: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedVolumes.length}টি</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'all', label: 'সকল উপাদান', count: vocabulary.length },
                { id: '1', label: '১ম খণ্ড', count: vocabulary.filter(w => (!w.bookSource || w.bookSource === 'eso_arbi') && w.volumeId === 1).length },
                { id: '2', label: '২য় খণ্ড', count: vocabulary.filter(w => (!w.bookSource || w.bookSource === 'eso_arbi') && w.volumeId === 2).length },
                { id: '3', label: '৩য় খণ্ড', count: vocabulary.filter(w => (!w.bookSource || w.bookSource === 'eso_arbi') && w.volumeId === 3).length },
                { id: 'tamrin', label: '✍️ আত-তামরীন', count: vocabulary.filter(w => w.bookSource === 'tamrin').length },
              ].map((vol) => {
                const isSelected = (!selectedVolumes || selectedVolumes.length === 0 || selectedVolumes.includes('all'))
                  ? vol.id === 'all'
                  : selectedVolumes.includes(vol.id);

                return (
                  <button
                    key={vol.id}
                    type="button"
                    onClick={() => handleVolumeToggle(vol.id)}
                    className={`relative p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold">{vol.label}</span>
                      {isSelected && vol.id !== 'all' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{vol.count}টি প্রশ্ন</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Scope - Question Count Pills */}
          <div className="mb-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              প্রশ্ন সংখ্যা
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 10, label: '১০টি' },
                { val: 20, label: '২০টি' },
                { val: 30, label: '৩০টি' },
                { val: 50, label: '৫০টি' },
                { val: 9999, label: 'সবগুলো' },
              ].map((q) => {
                const isSelected = questionCount === q.val;
                return (
                  <button
                    key={q.val}
                    type="button"
                    onClick={() => setQuestionCount(q.val)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Advanced Criteria Drawer (সাপও না মরে লাঠিও না ভাঙ্গে) */}
          <div className="mb-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-all relative">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors ${
                showAdvanced ? 'rounded-t-2xl' : 'rounded-2xl'
              }`}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  বিস্তারিত কাস্টমাইজেশন (অধ্যায়, পাঠ, ব্যাকরণ, সময় ও দিক)
                </span>
                {activeCustomFilterCount > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {activeCustomFilterCount}টি সক্রিয়
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-[11px] font-medium hidden sm:inline">
                  {showAdvanced ? 'সংক্ষেপ করুন' : 'প্রসারিত করুন'}
                </span>
                {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {/* Expanded Drawer Content */}
            {showAdvanced && (
              <div className="p-4 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900/90 rounded-b-2xl">
                {/* Chapter & Lesson Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
                  <div>
                    <MultiSelectDropdown
                      label="অধ্যায় নির্বাচন"
                      options={availableChapters}
                      selected={selectedChapters}
                      onChange={handleChaptersChange}
                      placeholder={`সকল অধ্যায় (${availableChapters.length}টি)`}
                      align="left"
                    />
                  </div>
                  <div>
                    <MultiSelectDropdown
                      label="পাঠ নির্বাচন"
                      options={availableLessons}
                      selected={selectedLessons}
                      onChange={setSelectedLessons}
                      placeholder={`সকল পাঠ (${availableLessons.length}টি)`}
                      align="right"
                    />
                  </div>
                </div>

                {/* Content Type & Part of Speech */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-20">
                  <div>
                    <MultiSelectDropdown
                      label="শব্দের ধরণ"
                      options={typeOptions}
                      selected={selectedTypes}
                      onChange={setSelectedTypes}
                      placeholder="সকল ধরণ (শব্দ, বাক্য, মুরাক্কাব...)"
                      align="left"
                    />
                  </div>
                  <div>
                    <MultiSelectDropdown
                      label="পদের ধরণ (ব্যাকরণ)"
                      options={availablePOSOptions}
                      selected={selectedPOSs}
                      onChange={setSelectedPOSs}
                      placeholder="সকল পদ (ইসম, সিফাত, ফেয়েল...)"
                      align="right"
                    />
                  </div>
                </div>

                {/* Timer Speed & Question Direction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      প্রতি প্রশ্নে সময়
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { val: 15, label: '১৫ সে' },
                        { val: 30, label: '৩০ সে' },
                        { val: 45, label: '৪৫ সে' },
                        { val: 0, label: 'অফ' },
                      ].map(t => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setTimerDuration(t.val)}
                          className={`py-1.5 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                            timerDuration === t.val
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      প্রশ্নের দিক
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'ar-to-bn', label: 'আরবি ➔ বাংলা' },
                        { id: 'bn-to-ar', label: 'বাংলা ➔ আরবি' },
                        { id: 'mixed', label: 'মিশ্র' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setQuestionType(t.id)}
                          className={`py-1.5 px-1 text-center rounded-xl text-[11px] font-bold border transition-all ${
                            questionType === t.id
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Integrated Action Footer */}
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  উপলব্ধ প্রশ্ন: <strong className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">{examPool.length}টি</strong> প্রস্তুত
                </span>
              </div>

              <button
                onClick={startExam}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span>পরীক্ষা শুরু করুন</span>
                <ArrowRight size={17} />
              </button>
            </div>

            {examPool.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2 text-center">
                ⚠️ নির্বাচিত ফিল্টারে কোনো শব্দ পাওয়া যায়নি। শুরু করলে সম্পূর্ণ শব্দকোষ থেকে প্রশ্ন আসবে।
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Interface
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Question Counter */}
        <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-300">
          <span>প্রশ্ন {currentIndex + 1} / {questions.length}</span>
          <span className="text-xs font-normal text-slate-400">
            • {currentQ?.word?.volume}
          </span>
        </div>

        {/* Grill Strikes or Timed Score */}
        {examMode === 'grill' ? (
          <div className="flex items-center gap-1.5" title={`${strikesLeft}টি লাইফ বাকি আছে`}>
            {[1, 2, 3].map((s) => (
              <Heart
                key={s}
                size={20}
                className={s <= strikesLeft ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-300 dark:text-slate-700'}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-emerald-600">✓ {correctCount}</span>
            <span className="text-rose-500">✗ {incorrectCount}</span>
          </div>
        )}

        {/* Timer display */}
        {timerDuration > 0 ? (
          <div className={`flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-xl ${
            timeLeft <= 5 
              ? 'bg-rose-100 text-rose-600 animate-bounce dark:bg-rose-950/60' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock size={16} />
            <span>{timeLeft}s</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Clock size={16} />
            <span>{Math.floor(timeSpentTotal / 60)}:{(timeSpentTotal % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Timer / Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-1000 linear rounded-full ${
            timerDuration > 0
              ? (timeLeft <= 5 ? 'bg-rose-500' : 'bg-amber-500')
              : 'bg-emerald-500'
          }`}
          style={{
            width: timerDuration > 0
              ? `${(timeLeft / timerDuration) * 100}%`
              : `${((currentIndex + 1) / questions.length) * 100}%`
          }}
        />
      </div>

      {/* Question Prompt Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {currentQ?.qType === 'ar-to-bn' ? 'অর্থ কী?' : 'আরবি কোনটি?'}
            </span>
            <button
              type="button"
              onClick={() => onOpenReport?.({
                source: 'exam_question',
                arabic: currentQ?.word?.arabic,
                bengali: currentQ?.word?.bengali,
                volume: currentQ?.word?.volume,
                lesson: currentQ?.word?.lesson
              })}
              title="ভুলত্রুটি রিপোর্ট করুন"
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              <Flag size={13} className="text-rose-500" />
            </button>
          </div>
          {/* Audio logic in exam: NEVER reveal the answer through audio! */}
          {currentQ?.qType === 'ar-to-bn' ? (
            /* In Arabic -> Bengali: The prompt is Arabic text. User can click to hear the prompt (no autoplay) */
            currentQ?.prompt && <AudioButton text={currentQ.prompt} size={20} title="আরবি প্রশ্নটি শুনুন" />
          ) : (
            /* In Bengali -> Arabic: DO NOT play the Arabic answer before answering! */
            isAnswered ? (
              /* Only reveal Arabic audio AFTER the student selects their answer */
              <AudioButton text={currentQ.word.arabic} size={20} title="সঠিক আরবি উচ্চারণ শুনুন" />
            ) : (
              /* Before answering: only allow listening to the Bengali prompt itself, NEVER the Arabic answer */
              currentQ?.prompt && (
                <AudioButton text={currentQ.prompt} size={20} lang="bn" title="বাংলা প্রশ্নটি শুনুন (ছেলেদের কণ্ঠ)" />
              )
            )
          )}
        </div>

        {/* Prompt */}
        <h3 className={`text-slate-900 dark:text-white font-extrabold mb-2 select-none ${
          currentQ?.qType === 'ar-to-bn'
            ? `font-arabic leading-relaxed ${
                (currentQ?.prompt?.length || 0) > 40
                  ? 'text-2xl sm:text-3xl'
                  : (currentQ?.prompt?.length || 0) > 20
                  ? 'text-3xl sm:text-4xl'
                  : 'text-5xl sm:text-6xl'
              }`
            : (currentQ?.prompt?.length || 0) > 40
            ? 'text-xl sm:text-2xl'
            : 'text-3xl sm:text-4xl'
        }`}>
          {currentQ?.prompt}
        </h3>

        {currentQ?.subPrompt && (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            [{currentQ.subPrompt}]
          </p>
        )}
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {currentQ?.options?.map((option, idx) => {
          let btnStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/60 dark:hover:border-emerald-500/60';

          if (isAnswered) {
            if (option.isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/40';
            } else if (selectedOption === option && !option.isCorrect) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/40';
            } else {
              btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(option)}
              className={`p-4 rounded-2xl border text-left transition-all font-medium flex items-center justify-between gap-3 shadow-sm ${btnStyle}`}
            >
              <span className={`select-none ${currentQ?.qType === 'bn-to-ar' ? 'font-arabic text-2xl font-bold' : 'text-base font-semibold'}`}>
                {option.text}
              </span>

              {isAnswered && option.isCorrect && (
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {currentQ?.qType === 'bn-to-ar' && (
                    // বোতামের ভেতরে আরেকটি বোতাম রাখা যায় না, তাই এখানে span
                    <span
                      onClick={() => playArabicAudio(option.text)}
                      className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 cursor-pointer"
                      title="সঠিক উচ্চারণ শুনুন"
                    >
                      <Volume2 size={18} />
                    </span>
                  )}
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
              )}
              {isAnswered && selectedOption === option && !option.isCorrect && (
                <XCircle size={20} className="text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Exit Exam */}
      <div className="text-center">
        <button
          onClick={() => finishExam(mistakes, correctCount, incorrectCount)}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
        >
          পরীক্ষা শেষ করে ফলাফল দেখুন
        </button>
      </div>
    </div>
  );
}
