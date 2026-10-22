import { CheckCircle2, ChevronDown, FileText, Film, Lock, PenLine, Sparkles } from 'lucide-react';
import { bn } from './questions';
import { href } from './router';

const STEPS = [
  { key: 'video', label: 'ভিডিও', icon: Film },
  { key: 'text', label: 'পাঠ', icon: FileText },
  { key: 'quiz', label: 'কুইজ', icon: PenLine },
];

// একটি পাঠের হীরক-নোড; চাপলে পাশে ডাল বেরোয়: ভিডিও → পাঠ → কুইজ
export function PathNode({ darsId, no, offsetClass, side, done, current, open, onToggle, hasQuiz, hasVideo, locked }) {
  const steps = STEPS.filter((s) => s.key !== 'quiz' || hasQuiz);
  const tone = locked
    ? 'bg-gradient-to-br from-slate-300 to-slate-500 dark:from-slate-600 dark:to-slate-800 border-slate-300/60 dark:border-slate-500/40 opacity-90'
    : done
    ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-teal-200 shadow-[0_0_22px_rgba(14,165,233,0.85)] animate-pulse'
    : 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 border-emerald-200 shadow-[0_0_16px_rgba(14,165,233,0.55)]';
  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass} ${open ? 'z-30' : ''}`}>
      {current && !open && !locked && (
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
          className={`relative flex h-12 w-12 rotate-45 items-center justify-center rounded-xl border-2 transition hover:scale-105 active:scale-95 sm:h-14 sm:w-14 ${tone} ${current && !locked ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 animate-pulse shadow-[0_0_26px_rgba(14,165,233,0.9)]' : ''} ${open ? 'scale-110' : ''}`}
        >
          {locked ? <Lock size={16} className="-rotate-45 text-white/90" /> : <span className="-rotate-45 select-none text-base font-black leading-none text-white drop-shadow-sm">{bn(no)}</span>}
          {done && <CheckCircle2 size={14} className="absolute -right-2.5 -top-2.5 -rotate-45 rounded-full bg-white text-emerald-600" />}
        </button>

        {open && (
          <div className={`absolute top-1/2 z-30 flex -translate-y-1/2 items-center ${side === 'right' ? 'left-full' : 'right-full flex-row-reverse'}`}>
            <span className="h-0.5 w-3 bg-emerald-400 shadow-[0_0_8px_rgba(14,165,233,0.9)]" style={{ animation: 'fadeInSubtle 0.25s ease-out' }} />
            {locked ? (
              <div className="w-40 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-xs font-bold leading-snug text-slate-600 dark:text-slate-200 shadow-xl" style={{ animation: 'subNodePop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both' }}>🔒 আগের পাঠের কুইজ শেষ করলে এটি খুলবে</div>
            ) : (
            <div className="flex flex-col gap-1.5 rounded-2xl border border-emerald-300 dark:border-emerald-400/40 bg-white dark:bg-slate-800 p-1.5 shadow-[0_0_24px_rgba(14,165,233,0.45)]" style={{ animation: 'subNodePop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both', transformOrigin: side === 'right' ? 'left center' : 'right center' }}>
              {steps.map(({ key, label, icon: Icon }) => (
                <a key={key} href={href(`/dars/${darsId}/${no}/${key}`)} className="flex w-28 items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-white/10">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Icon size={14} /></span>
                  <span>{label}</span>
                  {key === 'video' && !hasVideo && <span className="ml-auto text-[9px] font-semibold text-slate-400">শিগগির</span>}
                </a>
              ))}
            </div>
            )}
          </div>
        )}
      </div>
      <span className="mt-1 text-xs font-black leading-tight">পাঠ {bn(no)}</span>
    </div>
  );
}

// দারসের বড় হীরক-নোড; চাপলে নিচে তার পাঠগুলো আঁকাবাঁকা পথে বেরিয়ে আসে
export function DarsNode({ number, done, open, onToggle, offsetClass }) {
  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass}`}>
      <div className="p-2.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`দারস ${bn(number)}`}
          className={`relative flex h-16 w-16 rotate-45 items-center justify-center rounded-2xl border-2 transition hover:scale-105 active:scale-95 ${done ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-teal-200 shadow-[0_0_26px_rgba(14,165,233,0.9)] animate-pulse' : 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 border-emerald-200 shadow-[0_0_20px_rgba(14,165,233,0.6)]'} ${open ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900' : ''}`}
        >
          <span className="-rotate-45 select-none text-2xl font-black leading-none text-white drop-shadow-sm">{bn(number)}</span>
          <ChevronDown size={14} className={`absolute -right-2.5 -top-2.5 -rotate-45 rounded-full bg-white text-emerald-600 transition-transform ${open ? 'rotate-[135deg]' : ''}`} />
        </button>
      </div>
      <span className="mt-0.5 text-xs font-black leading-tight">দারস {bn(number)}</span>
    </div>
  );
}
