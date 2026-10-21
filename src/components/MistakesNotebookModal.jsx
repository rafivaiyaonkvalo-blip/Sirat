import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, BookX, CheckCircle2, ArrowRight, 
  Trash2, Sparkles, AlertCircle, Play, 
  Check, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AudioButton from './AudioButton';
import { toBengaliNumber } from '../utils/gamification';
import { 
  getMistakes, 
  recordMistakeSuccess, 
  recordMistakeFailure, 
  removeMistake
} from '../utils/mistakesManager';
import { shuffle } from '../utils/shuffle';

export default function MistakesNotebookModal({ isOpen, onClose, user = null, vocabulary = [] }) {
  const [mistakes, setMistakes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'word', 'sentence', 'quiz', 'mastered'
  const [mode, setMode] = useState('list'); // 'list' or 'practice'
  
  // Practice state
  const [practiceQueue, setPracticeQueue] = useState([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionMasteredCount, setSessionMasteredCount] = useState(0);

  // Sync state with storage and window events
  const reloadMistakes = () => {
    setMistakes(getMistakes());
  };

  useEffect(() => {
    if (isOpen) {
      reloadMistakes();
      setMode('list');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      reloadMistakes();
    };
    window.addEventListener('uls_mistakes_updated', handleUpdate);
    return () => window.removeEventListener('uls_mistakes_updated', handleUpdate);
  }, []);

  const pendingList = useMemo(() => mistakes.filter(m => m.status !== 'mastered'), [mistakes]);
  const masteredList = useMemo(() => mistakes.filter(m => m.status === 'mastered'), [mistakes]);

  // Filtered items based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'mastered') return masteredList;
    if (activeTab === 'all') return pendingList;
    if (activeTab === 'word') return pendingList.filter(m => m.type === 'word');
    if (activeTab === 'sentence') return pendingList.filter(m => m.type === 'sentence');
    if (activeTab === 'quiz') return pendingList.filter(m => m.type === 'quiz' || m.type === 'tamrin');
    return pendingList;
  }, [activeTab, pendingList, masteredList]);

  // Start 3-Strike Practice Session
  const startPractice = (targetItems = null) => {
    const items = (targetItems || pendingList).slice();
    if (items.length === 0) return;

    // Generate questions for each item
    const formattedQuestions = items.map((item) => {
      let options = [];
      const correctText = item.correctText || item.bengali || item.arabic;

      if (item.options && item.options.length > 0) {
        // Quiz / Spot error question with preset options
        options = shuffle(item.options.map(opt => ({
          text: typeof opt === 'string' ? opt : opt.text,
          isCorrect: typeof opt === 'object' && opt.isCorrect !== undefined 
            ? opt.isCorrect 
            : (opt === correctText || opt.text === correctText)
        })));
      } else {
        // Word or sentence question: pick 3 distractors from vocabulary
        const isArPrompt = Boolean(item.arabic);
        const correctOpt = { text: isArPrompt ? item.bengali : item.arabic, isCorrect: true };
        
        const candidateDistractors = vocabulary.filter(w => {
          if (!w) return false;
          const val = isArPrompt ? w.bengali : w.arabic;
          return val && val !== correctOpt.text;
        });

        const chosenDistractors = shuffle(candidateDistractors).slice(0, 3).map(w => ({
          text: isArPrompt ? w.bengali : w.arabic,
          isCorrect: false
        }));

        // Fallback if vocabulary distractors are sparse
        if (chosenDistractors.length < 3) {
          const generic = isArPrompt 
            ? ['একটি বই', 'একটি কলম', 'একটি মসজিদ', 'একটি ঘর'] 
            : ['كِتَابٌ', 'قَلَمٌ', 'مَسْجِدٌ', 'بَيْتٌ'];
          generic.filter(g => g !== correctOpt.text).slice(0, 3 - chosenDistractors.length).forEach(g => {
            chosenDistractors.push({ text: g, isCorrect: false });
          });
        }

        options = shuffle([correctOpt, ...chosenDistractors]);
      }

      return {
        item,
        prompt: item.arabic || item.question || item.bengali,
        subPrompt: item.arabic ? 'সঠিক অর্থটি বেছে নিন' : (item.question || 'সঠিক উত্তরটি নির্বাচন করুন'),
        arabicToPlay: item.arabic || null,
        correctText,
        options
      };
    });

    setPracticeQueue(shuffle(formattedQuestions));
    setPracticeIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionMasteredCount(0);
    setMode('practice');
  };

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = practiceQueue[practiceIndex];
    if (!currentQ) return;

    if (option.isCorrect) {
      const res = recordMistakeSuccess(currentQ.item.id, user);
      if (res.mastered) {
        setSessionMasteredCount(prev => prev + 1);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } else {
      recordMistakeFailure(currentQ.item.id, user);
    }
  };

  const handleNextQuestion = () => {
    if (practiceIndex + 1 < practiceQueue.length) {
      setPracticeIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed practice queue
      reloadMistakes();
      setMode('list');
    }
  };

  const handleDeleteItem = (id, e) => {
    if (e) e.stopPropagation();
    removeMistake(id, user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <BookX size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  ভুল
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {toBengaliNumber(pendingList.length)}টি
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ভুল রিভিশন • دَفْتَرُ التَّصْحِيحِ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {mode === 'practice' && (
              <button
                type="button"
                onClick={() => {
                  reloadMistakes();
                  setMode('list');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                ফিরে যান
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="বন্ধ করুন"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {mode === 'list' ? (
          <>
            {/* Top Stats Overview */}
            <div className="px-5 sm:px-6 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      ভুল: <strong className="text-slate-900 dark:text-white font-bold">{toBengaliNumber(pendingList.length)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      শুদ্ধ: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{toBengaliNumber(masteredList.length)}</strong>
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  ৩ বার শুদ্ধ হলে সম্পন্ন
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `সব (${toBengaliNumber(pendingList.length)})` },
                { id: 'word', label: 'একক শব্দ' },
                { id: 'sentence', label: 'বাক্য' },
                { id: 'quiz', label: 'কুইজ ও তামরীন' },
                { id: 'mastered', label: `সংশোধিত (${toBengaliNumber(masteredList.length)})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mistakes List Scroll Area */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-2.5">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-500/20">
                    <Sparkles size={28} />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {activeTab === 'mastered' 
                      ? 'এখনো কোনো সংশোধিত ভুল নেই' 
                      : 'মাশাআল্লাহ! কোনো ভুল জমা নেই'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {activeTab === 'mastered'
                      ? 'চলতি ভুলগুলো ৩ বার শুদ্ধ উত্তর দিলে তা এখানে সফলভাবে জমা হবে।'
                      : 'পাঠের কুইজ, বানান বা মেধা যাচাই পরীক্ষায় ভুল হলে স্বয়ংক্রিয়ভাবে এখানে এসে জমা হবে।'}
                  </p>
                </div>
              ) : (
                filteredItems.map(item => {
                  const consecutive = item.consecutiveCorrect || 0;
                  const isMastered = item.status === 'mastered';

                  return (
                    <div
                      key={item.id}
                      className="group relative p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        {/* Arabic text with audio */}
                        <div className="flex items-center gap-2">
                          {item.arabic ? (
                            <>
                              <span 
                                dir="rtl" 
                                className="font-arabic text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed tracking-wide"
                              >
                                {item.arabic}
                              </span>
                              <AudioButton text={item.arabic} size={15} />
                            </>
                          ) : (
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              {item.question}
                            </span>
                          )}
                        </div>

                        {/* Bengali Meaning & Context */}
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {item.bengali || item.correctText}
                        </div>

                        {/* Metadata Tag Line */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                          <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 font-medium">
                            {item.sourceTitle || 'অনুশীলন'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold">
                            ❌ {toBengaliNumber(item.mistakeCount || 1)} বার ভুল
                          </span>
                        </div>
                      </div>

                      {/* 3-Strike Mastery Indicator & Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* 3 Steps Bubble */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            {[1, 2, 3].map(step => {
                              const filled = isMastered || consecutive >= step;
                              return (
                                <span
                                  key={step}
                                  title={`ধাপ ${toBengaliNumber(step)}/৩`}
                                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                                    filled
                                      ? 'bg-emerald-500 text-white shadow-xs'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                  }`}
                                >
                                  {filled ? '✓' : step}
                                </span>
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                            {isMastered 
                              ? 'সম্পন্ন' 
                              : `${toBengaliNumber(consecutive)}/৩`}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        {!isMastered && (
                          <button
                            type="button"
                            onClick={() => startPractice([item])}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white transition-all cursor-pointer"
                            title="অনুশীলন করুন"
                          >
                            <Play size={15} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions Bar */}
            {pendingList.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  মোট <strong>{toBengaliNumber(pendingList.length)}টি</strong> ভুল অনুশীলনের বাকি
                </div>

                <button
                  type="button"
                  onClick={() => startPractice()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all cursor-pointer hover:scale-102 active:scale-95"
                >
                  <Flame size={16} />
                  <span>অনুশীলন শুরু করুন</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* =========================================================
             Practice Mode (৩ বার শুদ্ধ চ্যালেঞ্জ)
             ========================================================= */
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 flex flex-col justify-between">
            {practiceQueue[practiceIndex] ? (
              (() => {
                const q = practiceQueue[practiceIndex];
                const currentConsecutive = q.item.consecutiveCorrect || 0;

                return (
                  <div className="max-w-xl mx-auto w-full my-auto py-2">
                    {/* Practice Top Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        প্রশ্ন {toBengaliNumber(practiceIndex + 1)} / {toBengaliNumber(practiceQueue.length)}
                      </span>

                      {/* 3 Steps Badge for current question */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">অগ্রগতি:</span>
                        {[1, 2, 3].map(step => (
                          <span
                            key={step}
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                              currentConsecutive >= step
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                            }`}
                          >
                            {currentConsecutive >= step ? '✓' : step}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Question Prompt Card */}
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-sm mb-6">
                      <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 mb-1.5">
                        {q.subPrompt}
                      </p>

                      <div className="flex items-center justify-center gap-2">
                        <h2 
                          dir={q.arabicToPlay ? 'rtl' : 'ltr'}
                          className={`font-bold text-slate-900 dark:text-white leading-relaxed ${
                            q.arabicToPlay ? 'font-arabic text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                          }`}
                        >
                          {q.prompt}
                        </h2>
                        {q.arabicToPlay && (
                          <AudioButton text={q.arabicToPlay} size={20} />
                        )}
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {q.options.map((opt, oIdx) => {
                        let btnStyle = 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-rose-400 hover:bg-rose-50/40 dark:hover:bg-slate-800';

                        if (isAnswered) {
                          if (opt.isCorrect) {
                            btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20';
                          } else if (selectedOption === opt) {
                            btnStyle = 'bg-rose-500 text-white border-rose-500';
                          } else {
                            btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleOptionClick(opt)}
                            className={`p-4 rounded-2xl border font-bold text-sm text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                          >
                            <span dir={/[\u0600-\u06FF]/.test(opt.text) ? 'rtl' : 'ltr'} className={/[\u0600-\u06FF]/.test(opt.text) ? 'font-arabic text-base' : ''}>
                              {opt.text}
                            </span>
                            {isAnswered && opt.isCorrect && (
                              <Check size={18} className="text-white shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Answer Feedback Banner */}
                    {isAnswered && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        {selectedOption?.isCorrect ? (
                          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                              <span>
                                {currentConsecutive + 1 >= 3 ? (
                                  <strong>মাশাআল্লাহ, সম্পন্ন হয়েছে! 🎉</strong>
                                ) : (
                                  <span>সঠিক হয়েছে! ({toBengaliNumber(currentConsecutive + 1)}/৩)</span>
                                )}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} className="text-rose-500 shrink-0" />
                              <span>
                                ভুল হয়েছে! সঠিক উত্তর: <strong>{q.correctText}</strong>
                              </span>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>{practiceIndex + 1 < practiceQueue.length ? 'পরবর্তী' : 'সমাপ্ত করুন'}</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="py-12 text-center my-auto">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  অনুশীলন সম্পন্ন!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  মোট <strong>{toBengaliNumber(sessionMasteredCount)}টি</strong> ভুল সমাধান হয়েছে।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    reloadMistakes();
                    setMode('list');
                  }}
                  className="mt-5 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-emerald-700"
                >
                  ফিরে যান
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
