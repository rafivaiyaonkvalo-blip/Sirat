import React, { useState } from 'react';
import { 
  X, CheckCircle2, Lock, Play, Sparkles, BookOpen, 
  MessageSquare, Trophy, Clock, ArrowRight, FileText, 
  ChevronRight, Star, Info, HelpCircle
} from 'lucide-react';
import { 
  LESSON_SUB_UNITS, 
  getLessonSubUnitsInfo, 
  getSubUnitProgressStatus, 
  isSubUnitUnlocked,
  toBengaliNumber 
} from '../utils/lessonSubSections';

export default function SubLessonDrawer({
  lesson,
  progress = {},
  isOpen,
  onClose,
  onStartSubUnit,
  onOpenBookViewer
}) {
  if (!isOpen || !lesson) return null;

  const subUnitsInfo = getLessonSubUnitsInfo(lesson);
  const status = getSubUnitProgressStatus(lesson, progress);

  const getSubUnitIcon = (id, colorClass) => {
    switch (id) {
      case 'vocab':
      case 'vocab_b1':
      case 'vocab_b2':
      case 'vocab_b3':
      case 'vocab_b4':
      case 'vocab_core':
      case 'vocab_ext':
        return <BookOpen size={20} className={colorClass} />;
      case 'sentences':
      case 'sentences_p1':
      case 'sentences_p2':
      case 'sentences_dialogues':
      case 'core_sentences_dialogues':
      case 'core_grammar_intro':
        return <Sparkles size={20} className={colorClass} />;
      case 'dialogues':
      case 'dialogues_p1':
      case 'dialogues_p2':
        return <MessageSquare size={20} className={colorClass} />;
      case 'tamrin_p1':
      case 'quiz_mastery':
      case 'tamrin_quiz':
        return <Trophy size={20} className={colorClass} />;
      default:
        return <BookOpen size={20} className={colorClass} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer / Modal Body */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-all cursor-pointer"
            title="বন্ধ করুন"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              📖 {lesson.chapterTitle?.split(':')[0] || 'অধ্যায়'}
            </span>
            {lesson.pages && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-900/40 text-emerald-100 border border-emerald-400/30">
                {lesson.pages}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/25 text-emerald-200">
              {toBengaliNumber(status.completedCount)}/{toBengaliNumber(status.totalCount)} পর্ব সম্পন্ন
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight">
            {lesson.title}
          </h2>
          <p className="text-sm font-arabic text-emerald-100 mt-1 font-medium">
            {lesson.subTitle}
          </p>


          {/* Mini Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-3">
            <div className="flex-1 bg-black/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${status.percent}%` }}
              />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-100 shrink-0">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span>{status.percent}%</span>
            </div>
          </div>
        </div>

        {/* Sub-Units List (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            ছোট ছোট পর্বসমূহ:
          </div>

          <div className="space-y-3 pt-1">
            {subUnitsInfo.map((unit, idx) => {
              const isCompleted = status.completedSubUnits.includes(unit.id);
              const isUnlocked = status.isFullyCompleted || isSubUnitUnlocked(unit.id, status.completedSubUnits, lesson);
              const isNext = !isCompleted && isUnlocked;

              return (
                <div
                  key={unit.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : isNext
                      ? 'bg-white dark:bg-slate-800/90 border-emerald-400 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                  }`}
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isNext
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-white" />
                      ) : isUnlocked ? (
                        getSubUnitIcon(unit.id, isNext ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500')
                      ) : (
                        <Lock size={18} className="text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          isCompleted
                            ? 'bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                            : isNext
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {unit.badge}
                        </span>

                        <span className="text-[11px] font-arabic font-semibold text-slate-500 dark:text-slate-400">
                          {unit.titleAr}
                        </span>

                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock size={11} />
                          <span>~{unit.estMinutes} মিনিট</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {unit.titleBn}
                      </h4>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {unit.desc} • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{unit.itemCountStr}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700/60">
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => onStartSubUnit(lesson, unit.id)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isCompleted
                            ? 'bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700'
                            : isNext
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/30 animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Play size={14} className={isCompleted ? '' : 'fill-current'} />
                        <span>{isCompleted ? 'পুনরায় পড়ুন' : 'শুরু করুন'}</span>
                      </button>
                    ) : (
                      <div className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
                        <Lock size={13} />
                        <span>পূর্ববর্তী পর্ব শেষ করুন</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenBookViewer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBookViewer('original');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileText size={13} className="text-emerald-600" />
                <span>মূল কিতাবের পাতা দেখুন</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Master Mode (All steps at once) */}
            <button
              type="button"
              onClick={() => onStartSubUnit(lesson, 'all')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              title="একটানা সম্পূর্ণ পাঠের সবগুলো ধাপ অনুশীলন করুন"
            >
              সম্পূর্ণ পাঠ একসাথে (মাস্টার মোড)
            </button>

            {/* Quick Resume Button */}
            <button
              type="button"
              onClick={() => onStartSubUnit(lesson, status.nextSubUnitId)}
              className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{status.isFullyCompleted ? 'পুনর্বার অনুশীলন' : 'অগ্রসর হোন'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
