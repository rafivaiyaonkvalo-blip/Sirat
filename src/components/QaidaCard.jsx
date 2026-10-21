import React from 'react';
import { X } from 'lucide-react';
import { playArabicAudio } from '../utils/audio';
import { MixedText } from './LessonCelebration';

export function getReadQaidaIds() {
  return new Set();
}

export function markQaidaRead() {}

// ক্বায়েদার লোগো: খোলা কিতাবের উপর ছোট আলোর তারা
function QaidaLogo({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 6.5C10 5.2 7.2 4.8 4.5 5.3v12.2c2.7-.5 5.5-.1 7.5 1.2 2-1.3 4.8-1.7 7.5-1.2V5.3c-2.7-.5-5.5-.1-7.5 1.2Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 6.5v12.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17.2 1.8l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5Z" fill="currentColor" />
    </svg>
  );
}

// ম্যাপে পর্বের পাশে ছোট গোল ক্বায়েদা বোতাম (স্বচ্ছ হালকা নীল)
export function QaidaButton({ qaida, onOpen, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(qaida)}
      title={`ক্বায়েদা: ${qaida.title}`}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer bg-sky-300/20 dark:bg-sky-400/15 border-sky-300/80 dark:border-sky-500/50 text-sky-600 dark:text-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.35)] hover:bg-sky-400/30 ${className}`}
    >
      <QaidaLogo className="w-5 h-5" />
    </button>
  );
}

// ক্বায়েদার কার্ড: ছোট টেবিল, এক লাইনের নিয়ম, কিতাবের উদাহরণ
export default function QaidaCard({ qaida, onClose }) {
  if (!qaida) return null;

  const handleDone = () => {
    onClose(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => onClose(false)}>
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sky-200 dark:border-sky-900/60 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-200">
              <QaidaLogo className="w-4 h-4" />
              ক্বায়েদা
            </span>
            <button
              type="button"
              onClick={() => onClose(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            <MixedText text={qaida.title} />
          </h3>

          {Array.isArray(qaida.table) && qaida.table.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-sky-200/80 dark:border-sky-800/60 divide-y divide-sky-200/70 dark:divide-sky-800/50">
              {qaida.table.map((row, i) => (
                <div key={i} className="grid grid-cols-2 items-center bg-white dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => playArabicAudio(row.arabic)}
                    dir="rtl"
                    className="px-3 py-2.5 font-arabic font-bold text-xl sm:text-2xl text-slate-900 dark:text-white text-center border-r border-sky-200/70 dark:border-sky-800/50 hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                    title="উচ্চারণ শুনুন"
                  >
                    {row.arabic}
                  </button>
                  <span className="px-3 py-2.5 text-sm sm:text-base font-bold text-sky-700 dark:text-sky-300 text-center">
                    {row.bangla}
                  </span>
                </div>
              ))}
            </div>
          )}

          {qaida.rule && (
            <p className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              <MixedText text={qaida.rule} />
            </p>
          )}

          {Array.isArray(qaida.examples) && qaida.examples.length > 0 && (
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
              <span className="block text-xs font-bold text-sky-700 dark:text-sky-300">কিতাবের উদাহরণ</span>
              {qaida.examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => playArabicAudio(ex.arabic)}
                  className="w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">{ex.bangla}</span>
                  <span dir="rtl" className="font-arabic font-bold text-lg sm:text-xl text-slate-900 dark:text-white">{ex.arabic}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleDone}
            className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-md shadow-sky-600/25 transition-all cursor-pointer"
          >
            বুঝেছি
          </button>
        </div>
      </div>
    </div>
  );
}
