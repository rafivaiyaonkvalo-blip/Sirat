import { Check, Play } from 'lucide-react';
import index from '../data/darsIndex.json';
import { totalQuestions, bn } from './questions';

// কুইজ/পরীক্ষার জন্য দারস বাছাই: কার্ডে দারসের নম্বর, নাম ও প্রশ্ন-সংখ্যা; নিচে স্টিকি শুরু-বার
export default function DarsPicker({ selected, setSelected, count, setCount, onStart, startLabel, extra, busy }) {
  const qCount = (d) => d.porbos.reduce((a, p) => a + p.quiz, 0);
  const ready = index.filter((d) => qCount(d) > 0).map((d) => d.id);
  const toggle = (id) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const total = totalQuestions(selected);
  const counts = [10, 20, 30, 50].filter((c) => c < total);
  const pick = count > total ? total : count;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setSelected(ready)} className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white shadow-[0_0_14px_rgba(14,165,233,0.45)]">সব দারস</button>
        <button onClick={() => setSelected([])} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold dark:border-white/20">মুছুন</button>
        <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">{bn(selected.length)}টি দারস · {bn(total)}টি প্রশ্ন</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {index.map((d) => {
          const n = qCount(d);
          const on = selected.includes(d.id);
          return (
            <button
              key={d.id}
              disabled={!n}
              onClick={() => toggle(d.id)}
              className={`group relative flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 ${on ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_18px_rgba(14,165,233,0.35)] dark:bg-emerald-900/40' : 'border-slate-200 bg-white hover:border-emerald-300 dark:border-white/10 dark:bg-white/5'}`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black text-white ${on ? 'bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700' : 'bg-slate-400 dark:bg-slate-600'}`}>
                {on ? <Check size={20} strokeWidth={3} /> : bn(d.number)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-black text-emerald-700 dark:text-emerald-300">দারস {bn(d.number)}</span>
                <span className="line-clamp-2 text-sm font-bold leading-snug">{d.title}</span>
              </span>
              <span className="shrink-0 text-[11px] font-bold text-slate-500 dark:text-slate-400">{n ? `${bn(n)}টি` : 'শিগগির'}</span>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-3 z-30 mt-5 mr-14 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-300/40 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:bg-slate-900/95 sm:mr-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">প্রশ্ন</span>
          {counts.map((c) => (
            <button key={c} onClick={() => setCount(c)} className={`h-8 min-w-8 rounded-full px-2.5 text-sm font-bold ${pick === c ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200'}`}>{bn(c)}</button>
          ))}
          {total > 0 && <button onClick={() => setCount(total)} className={`h-8 rounded-full px-2.5 text-sm font-bold ${pick === total ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200'}`}>সব {bn(total)}</button>}
        </div>
        {extra}
        <button disabled={!total || busy} onClick={onStart} className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-[0_0_18px_rgba(14,165,233,0.5)] disabled:opacity-40 disabled:shadow-none">
          <Play size={16} /> {startLabel}
        </button>
      </div>
    </div>
  );
}
