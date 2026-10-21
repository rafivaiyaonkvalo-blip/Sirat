import { CheckCircle2, FileText, Film, PenLine } from 'lucide-react';
import { bn } from './questions';
import { href } from './router';

const STEPS = [
  { key: 'video', label: 'ভিডিও', icon: Film },
  { key: 'text', label: 'পাঠ', icon: FileText },
  { key: 'quiz', label: 'কুইজ', icon: PenLine },
];

const GLOW_DONE = 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-900 border-teal-200 shadow-[0_0_22px_rgba(16,185,129,0.85)] animate-pulse';
const GLOW_IDLE = 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 border-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.55)]';

// দারসের বড় হীরক-নোড
export function DarsNode({ number, done }) {
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="p-2.5">
        <div className={`flex h-14 w-14 rotate-45 items-center justify-center rounded-2xl border-2 ${done ? GLOW_DONE : GLOW_IDLE}`}>
          <span className="-rotate-45 text-xl font-black text-white drop-shadow-sm">{bn(number)}</span>
        </div>
      </div>
      <span className="mt-0.5 text-xs font-black">দারস {bn(number)}</span>
    </div>
  );
}

// দারসের পাশের সারির ছোট পাঠ-নোড
export function LessonNode({ no, done, current, open, onToggle }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <div className="p-1.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`পাঠ ${bn(no)}`}
          className={`relative flex h-10 w-10 rotate-45 items-center justify-center rounded-xl border-2 transition hover:scale-105 active:scale-95 ${done ? GLOW_DONE : GLOW_IDLE} ${current ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 animate-pulse shadow-[0_0_26px_rgba(16,185,129,0.9)]' : ''} ${open ? 'scale-110' : ''}`}
        >
          <span className="-rotate-45 select-none text-sm font-black leading-none text-white drop-shadow-sm">{bn(no)}</span>
          {done && <CheckCircle2 size={12} className="absolute -right-2 -top-2 -rotate-45 rounded-full bg-white text-emerald-600" />}
        </button>
      </div>
      <span className="text-[11px] font-black leading-tight">পাঠ {bn(no)}</span>
    </div>
  );
}

// নোডে চাপলে সারির নিচে ডাল: ভিডিও → পাঠ → কুইজ
export function Branch({ darsId, no, title, hasQuiz, hasVideo }) {
  const steps = STEPS.filter((s) => s.key !== 'quiz' || hasQuiz);
  return (
    <div className="mt-1 rounded-2xl border border-emerald-300 dark:border-emerald-400/40 bg-white dark:bg-slate-800 p-3 shadow-[0_0_24px_rgba(16,185,129,0.45)]" style={{ animation: 'subNodePop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both', transformOrigin: 'top left' }}>
      <p className="mb-2 text-sm font-bold leading-snug text-slate-800 dark:text-slate-100">পাঠ {bn(no)} · {title}</p>
      <div className="flex flex-wrap gap-2">
        {steps.map(({ key, label, icon: Icon }) => (
          <a key={key} href={href(`/dars/${darsId}/${no}/${key}`)} className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-white/10 px-3 py-2 text-sm font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-white/20">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Icon size={14} /></span>
            {label}
            {key === 'video' && !hasVideo && <span className="text-[10px] font-semibold text-slate-400">শিগগির</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
