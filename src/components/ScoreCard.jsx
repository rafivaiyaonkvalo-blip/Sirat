import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import AudioButton from './AudioButton';

export default function ScoreCard({ result, onRestart, onRetakeMistakes }) {
  const { total, correct, incorrect, percentage, timeSpent, mistakes } = result;

  useEffect(() => {
    if (percentage >= 70) {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [percentage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins} মিনিট ` : ''}${secs} সেকেন্ড`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Result Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        {/* Badge Icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          <Award size={40} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          পরীক্ষার ফলাফল
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          আপনার অর্জিত স্কোর ও পরিসংখ্যান
        </p>

        {/* Earned XP Pill */}
        {result.earnedXp !== undefined && result.earnedXp > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs mb-2">
            <span>+{result.earnedXp} XP অর্জিত</span>
          </div>
        )}

        {/* Big Percentage Display */}
        <div className="inline-flex items-baseline gap-1 my-2">
          <span className={`text-6xl sm:text-7xl font-extrabold tracking-tight ${
            percentage >= 80 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : percentage >= 50 
              ? 'text-amber-500' 
              : 'text-rose-500'
          }`}>
            {percentage}%
          </span>
        </div>

        {/* 3 Core Stats Cards */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto my-6">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs font-semibold">সঠিক</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {correct}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40">
            <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 mb-1">
              <XCircle size={16} />
              <span className="text-xs font-semibold">ভুল</span>
            </div>
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
              {incorrect}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
              <Clock size={16} />
              <span className="text-xs font-semibold">সময়</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">
              {formatTime(timeSpent)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            <RotateCcw size={17} />
            <span>নতুন পরীক্ষা শুরু করুন</span>
          </button>

          {mistakes && mistakes.length > 0 && (
            <button
              onClick={onRetakeMistakes}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/30 transition-all"
            >
              <span>ভুল হওয়া শব্দগুলো আবার পরীক্ষা দিন ({mistakes.length})</span>
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Mistake Review Section */}
      {mistakes && mistakes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>ভুল হওয়া শব্দগুলোর পর্যালোচনা ({mistakes.length}টি)</span>
          </h3>

          <div className="space-y-3">
            {mistakes.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-arabic text-2xl font-bold text-slate-900 dark:text-white">
                      {m.arabic}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    সঠিক অর্থ: {m.correctBengali}
                  </p>
                  {m.userAnswer && (
                    <p className="text-xs text-rose-500 line-through">
                      আপনার উত্তর: {m.userAnswer}
                    </p>
                  )}
                </div>

                <AudioButton text={m.arabic} size={18} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
