import React from 'react';
import { Delete, Space, RotateCcw } from 'lucide-react';
import { ARABIC_KEYBOARD_DATA } from '../utils/spellingUtils';

export default function ArabicVirtualKeyboard({
  onKeyPress,
  onBackspace,
  onClear,
  onSpace,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`w-full max-w-2xl mx-auto p-2 sm:p-4 rounded-3xl bg-slate-100/95 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-lg select-none ${className}`}>
      {/* Harakat / Tashkeel Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 px-1">
          <span>স্বরচিহ্ন (হরকত ও তাশদীদ)</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            হরফের পর চাপুন
          </span>
        </div>
        <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
          {ARABIC_KEYBOARD_DATA.harakat.map((h, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onKeyPress(h.char)}
              title={h.name}
              className="touch-manipulation flex flex-col items-center justify-center h-10 sm:h-12 rounded-xl bg-gradient-to-b from-amber-50 to-amber-100/70 dark:from-amber-950/40 dark:to-amber-900/30 hover:from-amber-100 hover:to-amber-200/80 dark:hover:from-amber-900/50 dark:hover:to-amber-800/40 border border-b-2 border-amber-200 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-bold transition-all active:border-b active:translate-y-0.5 cursor-pointer shadow-xs"
            >
              <span className="text-lg sm:text-xl font-serif leading-none mt-0.5">{h.badge}</span>
              <span className="text-[8px] sm:text-[9px] font-medium leading-tight opacity-80 mt-0.5">{h.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Arabic Letters - Row 1 */}
      <div className="flex justify-center gap-0.5 sm:gap-1.5 mb-1.5" dir="rtl">
        {ARABIC_KEYBOARD_DATA.row1.map((char) => (
          <button
            key={char}
            type="button"
            disabled={disabled}
            onClick={() => onKeyPress(char)}
            className="touch-manipulation flex-1 min-w-0 max-w-[48px] h-10 sm:h-12 rounded-xl bg-white dark:bg-slate-700/90 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-b-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-bold text-base sm:text-xl font-serif transition-all active:border-b active:translate-y-0.5 cursor-pointer shadow-xs flex items-center justify-center hover:border-emerald-300 dark:hover:border-emerald-500"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Arabic Letters - Row 2 */}
      <div className="flex justify-center gap-0.5 sm:gap-1.5 mb-1.5" dir="rtl">
        {ARABIC_KEYBOARD_DATA.row2.map((char) => (
          <button
            key={char}
            type="button"
            disabled={disabled}
            onClick={() => onKeyPress(char)}
            className="touch-manipulation flex-1 min-w-0 max-w-[52px] h-10 sm:h-12 rounded-xl bg-white dark:bg-slate-700/90 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-b-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-bold text-base sm:text-xl font-serif transition-all active:border-b active:translate-y-0.5 cursor-pointer shadow-xs flex items-center justify-center hover:border-emerald-300 dark:hover:border-emerald-500"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Arabic Letters - Row 3 */}
      <div className="flex justify-center gap-0.5 sm:gap-1.5 mb-2.5" dir="rtl">
        {ARABIC_KEYBOARD_DATA.row3.map((char) => (
          <button
            key={char}
            type="button"
            disabled={disabled}
            onClick={() => onKeyPress(char)}
            className="touch-manipulation flex-1 min-w-0 max-w-[56px] h-10 sm:h-12 rounded-xl bg-white dark:bg-slate-700/90 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-b-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-bold text-base sm:text-xl font-serif transition-all active:border-b active:translate-y-0.5 cursor-pointer shadow-xs flex items-center justify-center hover:border-emerald-300 dark:hover:border-emerald-500"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Action Row: Clear, Space, Backspace */}
      <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          title="সব মুছুন"
          className="touch-manipulation flex items-center gap-1.5 px-3 sm:px-4 h-10 sm:h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-b-2 border-rose-200 dark:border-rose-800/80 text-xs font-bold transition-all active:border-b active:translate-y-0.5 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span className="hidden sm:inline">পরিষ্কার</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onSpace}
          title="স্পেসবার"
          className="touch-manipulation flex-1 h-10 sm:h-11 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-b-2 border-slate-200 dark:border-slate-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:border-b active:translate-y-0.5 cursor-pointer shadow-xs"
        >
          <Space size={16} />
          <span>স্পেস (فاصلة)</span>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={onBackspace}
          title="একটি হরফ বা হরকত মুছুন"
          className="touch-manipulation flex items-center gap-1.5 px-3 sm:px-4 h-10 sm:h-11 rounded-xl bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-b-2 border-slate-300 dark:border-slate-600 text-xs font-bold transition-all active:border-b active:translate-y-0.5 cursor-pointer shadow-xs"
        >
          <Delete size={16} />
          <span className="hidden sm:inline">ব্যাকস্পেস</span>
        </button>
      </div>
    </div>
  );
}
