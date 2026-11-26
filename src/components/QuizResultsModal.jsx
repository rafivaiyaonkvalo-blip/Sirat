import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ClipboardList, Award, Zap, Trophy, Lock, RefreshCw, BookOpen, ExternalLink, ArrowRight
} from 'lucide-react';
import darsIndex from '../data/darsIndex.json';
import { isDarsLocked } from '../sirat/progress';
import { getQuizHistory, getQuizSummaryStats } from '../utils/quizHistoryManager';
import { toBengaliNumber } from '../utils/gamification';
import { triggerHaptic } from '../utils/haptics';

export default function QuizResultsModal({ isOpen, onClose }) {
  const [subView, setSubView] = useState('dars'); // 'dars' | 'history'

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const history = useMemo(() => (isOpen ? getQuizHistory() : []), [isOpen]);
  const stats = useMemo(() => (isOpen ? getQuizSummaryStats() : { totalAttempted: 0, avgPct: 0, totalXpEarned: 0, perfectCount: 0 }), [isOpen, history]);

  const progressScores = useMemo(() => {
    if (!isOpen) return {};
    try {
      const raw = localStorage.getItem('sirat_progress_v2');
      return raw ? JSON.parse(raw)?.scores || {} : {};
    } catch {
      return {};
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const openQuiz = (darsId, porboNo) => {
    triggerHaptic();
    onClose();
    window.location.hash = `#/dars/${darsId}/${porboNo}/quiz`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* মোডাল হেডার */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center shadow-xs text-blue-600 dark:text-blue-400">
              <ClipboardList size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                অনুশীলন ও পরীক্ষার ফলাফল
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                দারস-ভিত্তিক অর্জিত নম্বর ও পূর্ণাঙ্গ পরীক্ষার ইতিহাস
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* কনটেন্ট */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 [scrollbar-width:thin]">
          {/* শীর্ষ পরিসংখ্যান কার্ডসমূহ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <ClipboardList size={18} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {toBengaliNumber(stats.totalAttempted)}টি
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                সম্পন্ন অনুশীলন
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <Award size={18} className="mx-auto text-amber-500 mb-1" />
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {toBengaliNumber(stats.avgPct)}%
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                গড় নম্বর হার
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <Zap size={18} className="mx-auto text-amber-400 fill-amber-400 mb-1" />
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                +{toBengaliNumber(stats.totalXpEarned)}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                কুইজে অর্জিত XP
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <Trophy size={18} className="mx-auto text-yellow-500 mb-1" />
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {toBengaliNumber(stats.perfectCount)} বার
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                পূর্ণ নম্বর (১০০%)
              </div>
            </div>
          </div>

          {/* সাব-ভিউ সুইচ (দারস-ভিত্তিক নম্বর vs পরীক্ষার ইতিহাস) */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 gap-1">
            <button
              type="button"
              onClick={() => { triggerHaptic(); setSubView('dars'); }}
              className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                subView === 'dars'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              দারস-ভিত্তিক নম্বর তালিকা
            </button>
            <button
              type="button"
              onClick={() => { triggerHaptic(); setSubView('history'); }}
              className={`flex-1 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                subView === 'history'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              পরীক্ষার ইতিহাস ({toBengaliNumber(history.length)})
            </button>
          </div>

          {/* দারস-ভিত্তিক নম্বর তালিকা */}
          {subView === 'dars' && (
            <div className="space-y-2.5">
              {darsIndex.map((d) => {
                const locked = isDarsLocked(d.id);
                return (
                  <div
                    key={d.id}
                    className={`p-3 rounded-2xl border transition ${
                      locked
                        ? 'opacity-40 bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                          দারস {toBengaliNumber(d.number)}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                          {d.title}
                        </span>
                      </div>
                      {locked && (
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5">
                          <Lock size={12} /> লক করা
                        </span>
                      )}
                    </div>

                    {/* প্রতিটি পর্বের কুইজ গ্রিড */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {d.porbos.map((p) => {
                        const scoreData = progressScores[`${d.id}-${p.no}`];
                        const hasTaken = Boolean(scoreData && scoreData.total > 0);
                        const pct = hasTaken ? Math.round((scoreData.score / scoreData.total) * 100) : 0;
                        const isPerfect = pct === 100;
                        const isPassed = pct >= 60;

                        return (
                          <div
                            key={p.no}
                            className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 ${
                              locked
                                ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/40'
                                : hasTaken
                                  ? isPerfect
                                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/60 dark:border-emerald-800/60'
                                    : isPassed
                                      ? 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-300/60 dark:border-teal-800/60'
                                      : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/60 dark:border-amber-800/60'
                                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/70'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                পর্ব {toBengaliNumber(p.no)}
                              </span>
                              {hasTaken ? (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                                  isPerfect
                                    ? 'bg-[#10b981] text-white'
                                    : isPassed
                                      ? 'bg-teal-600 text-white'
                                      : 'bg-amber-600 text-white'
                                }`}>
                                  {isPerfect ? 'পূর্ণ নম্বর' : `${toBengaliNumber(pct)}%`}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-400">
                                  দেওয়া হয়নি
                                </span>
                              )}
                            </div>

                            {hasTaken ? (
                              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/5">
                                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                                  নম্বর: {toBengaliNumber(scoreData.score)}/{toBengaliNumber(scoreData.total)}
                                </span>
                                <button
                                  type="button"
                                  disabled={locked}
                                  onClick={() => openQuiz(d.id, p.no)}
                                  className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 underline decoration-dotted cursor-pointer hover:text-emerald-900"
                                >
                                  পুনরায় ↻
                                </button>
                              </div>
                            ) : p.quiz > 0 ? (
                              <button
                                type="button"
                                disabled={locked}
                                onClick={() => openQuiz(d.id, p.no)}
                                className="mt-1 w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                কুইজ শুরু করুন
                              </button>
                            ) : (
                              <div className="mt-1 w-full py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-center text-[10px] font-semibold text-slate-400">
                                কুইজ নেই
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* পরীক্ষার ইতিহাস ভিউ */}
          {subView === 'history' && (
            <div className="space-y-2.5">
              {history.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4">
                  <ClipboardList size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    এখনও কোনো পরীক্ষার হিস্ট্রি জমা হয়নি
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    দারসের কুইজ বা পরীক্ষা দিলে প্রতিটি পরীক্ষার পূর্ণাঙ্গ ফলাফল ও নম্বর এখানে সংরক্ষিত থাকবে।
                  </p>
                  <button
                    type="button"
                    onClick={() => { 
                      onClose();
                      window.location.hash = '#/quiz'; 
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    কুইজ ও পরীক্ষা পেজে যান ➔
                  </button>
                </div>
              ) : (
                history.map((h, i) => {
                  const isPerfect = h.pct === 100;
                  const isGood = h.pct >= 70;
                  return (
                    <div
                      key={h.id || i}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.2 rounded-md text-[10px] font-black ${
                            h.type === 'exam' ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {h.type === 'exam' ? 'পরীক্ষা' : 'কুইজ'}
                          </span>
                          <h5 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                            {h.title}
                          </h5>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span>{h.date}{h.time ? ` • ${h.time}` : ''}</span>
                          <span>সঠিক: {toBengaliNumber(h.correct)}</span>
                          {h.wrong > 0 && <span className="text-rose-500 font-medium">ভুল: {toBengaliNumber(h.wrong)}</span>}
                          <span className="text-amber-500 font-bold">+{toBengaliNumber(h.earnedXp)} XP</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-sm sm:text-base font-black ${
                          isPerfect ? 'text-[#10b981]' : isGood ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {toBengaliNumber(h.score)}/{toBengaliNumber(h.total)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          ({toBengaliNumber(h.pct)}%)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
