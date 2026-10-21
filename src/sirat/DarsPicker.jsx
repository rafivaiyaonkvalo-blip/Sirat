import index from '../data/darsIndex.json';
import { totalQuestions, bn } from './questions';

export default function DarsPicker({ selected, setSelected, count, setCount, onStart, startLabel, extra }) {
  const toggle = (id) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const total = totalQuestions(selected);
  const counts = [10, 20, 30, 50, 100].filter((c) => c < total);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setSelected(index.map((d) => d.id))} className="rounded-full bg-emerald-100 dark:bg-white/10 px-3 py-1 text-sm font-semibold">সব দারস</button>
        <button onClick={() => setSelected([])} className="rounded-full border border-slate-300 dark:border-white/20 px-3 py-1 text-sm font-semibold">মুছুন</button>
        <span className="text-sm text-slate-500 dark:text-slate-400">{bn(selected.length)}টি দারস · {bn(total)}টি প্রশ্ন</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {index.map((d) => {
          const on = selected.includes(d.id);
          return (
            <button key={d.id} onClick={() => toggle(d.id)} className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition ${on ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40' : 'border-slate-200 dark:border-white/10'}`}>
              <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400">দারস {d.number}</span>
              <span className="line-clamp-2 font-semibold leading-snug">{d.title}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          প্রশ্ন সংখ্যা
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900 px-2 py-1.5">
            {counts.map((c) => <option key={c} value={c}>{bn(c)}</option>)}
            <option value={total || 1}>সব ({bn(total)})</option>
          </select>
        </label>
        {extra}
        <button disabled={!total} onClick={onStart} className="rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white disabled:opacity-40">{startLabel}</button>
      </div>
    </div>
  );
}
