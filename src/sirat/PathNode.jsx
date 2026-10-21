import { CheckCircle2, FileText, Film, PenLine, Sparkles } from 'lucide-react';
import { bn } from './questions';
import { href } from './router';

const STEPS = [
  { key: 'video', label: 'ভিডিও', icon: Film },
  { key: 'text', label: 'পাঠ', icon: FileText },
  { key: 'quiz', label: 'কুইজ', icon: PenLine },
];

// একটি পাঠের হীরক-নোড; চাপলে পাশে ডাল বেরোয়: ভিডিও → পাঠ → কুইজ
export default function PathNode({ darsId, no, offsetClass, side, done, current, open, onToggle, hasQuiz, hasVideo }) {
  const steps = STEPS.filter((s) => s.key !== 'quiz' || hasQuiz);
  const tone = done
    ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-teal-200 shadow-[0_0_22px_rgba(16,185,129,0.8)]'
    : 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 border-emerald-200 shadow-lg shadow-emerald-700/25';
  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass} ${open ? 'z-30' : ''}`}>
      {current && !open && (
        <div className="mb-1 animate-bounce">
          <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-extrabold text-white shadow-md"><Sparkles size={11} /> চলমান পাঠ!</span>
        </div>
      )}
      <div className="relative flex items-center justify-center p-1.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`পাঠ ${bn(no)}`}
          className={`relative flex h-12 w-12 rotate-45 items-center justify-center rounded-xl border-2 transition hover:scale-105 active:scale-95 sm:h-14 sm:w-14 ${tone} ${current ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900' : ''} ${open ? 'scale-110' : ''}`}
        >
          <span className="-rotate-45 select-none text-base font-black leading-none text-white drop-shadow-sm">{bn(no)}</span>
          {done && <CheckCircle2 size={14} className="absolute -right-2.5 -top-2.5 -rotate-45 rounded-full bg-white text-emerald-600" />}
        </button>

        {open && (
          <div className={`absolute top-1/2 z-30 flex -translate-y-1/2 items-center ${side === 'right' ? 'left-full' : 'right-full flex-row-reverse'}`}>
            <span className="h-0.5 w-3 bg-emerald-400" />
            <div className="flex flex-col gap-1.5 rounded-2xl border border-emerald-200 dark:border-white/15 bg-white dark:bg-slate-800 p-1.5 shadow-xl">
              {steps.map(({ key, label, icon: Icon }) => (
                <a key={key} href={href(`/dars/${darsId}/${no}/${key}`)} className="flex w-28 items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-white/10">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Icon size={14} /></span>
                  <span>{label}</span>
                  {key === 'video' && !hasVideo && <span className="ml-auto text-[9px] font-semibold text-slate-400">শিগগির</span>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <span className="mt-1 text-xs font-black leading-tight">পাঠ {bn(no)}</span>
    </div>
  );
}
