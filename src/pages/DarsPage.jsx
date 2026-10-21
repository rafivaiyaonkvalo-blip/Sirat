import { CheckCircle2, ChevronLeft, ChevronRight, Circle, PlayCircle } from 'lucide-react';
import index from '../data/darsIndex.json';
import videos from '../data/videos.json';
import { href } from '../utils/router';
import NotFound from './NotFound';

export default function DarsPage({ id, progress }) {
  const d = index.find((x) => x.id === id);
  if (!d) return <NotFound />;
  const prev = index.find((x) => x.id === id - 1);
  const next = index.find((x) => x.id === id + 1);
  return (
    <div>
      <a href={href('/dars')} className="text-sm font-semibold text-brand-600 dark:text-brand-400">← সংক্ষিপ্ত দারস</a>
      <header className="mt-2 rounded-3xl bg-brand-900 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold text-brand-200">দারস {d.number}</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{d.title}</h1>
        <p className="mt-2 text-brand-100">{d.subtitle}</p>
        <a href={href(`/dars/${d.id}/1`)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-brand-700"><PlayCircle size={18} /> প্রথম পর্ব থেকে শুরু</a>
      </header>
      <ol className="mt-6 space-y-2">
        {d.porbos.map((p) => {
          const done = progress.done[`${d.id}-${p.no}`];
          return (
            <li key={p.no}>
              <a href={href(`/dars/${d.id}/${p.no}`)} className="flex items-center gap-3 rounded-xl border border-brand-100 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 hover:border-brand-400">
                {done ? <CheckCircle2 className="shrink-0 text-brand-500" size={22} /> : <Circle className="shrink-0 text-slate-300 dark:text-slate-600" size={22} />}
                <span className="w-7 shrink-0 text-sm font-bold text-brand-600 dark:text-brand-400">{p.no}</span>
                <span className="flex-1 font-semibold">{p.title}</span>
                <span className="hidden gap-2 text-xs text-slate-500 sm:flex">
                  {videos[`${d.id}-${p.no}`] && <span>ভিডিও</span>}
                  {p.quiz > 0 && <span>কুইজ {p.quiz}</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 flex justify-between">
        {prev ? <a href={href(`/dars/${prev.id}`)} className="inline-flex items-center gap-1 font-semibold text-brand-600"><ChevronLeft size={18} /> দারস {prev.number}</a> : <span />}
        {next ? <a href={href(`/dars/${next.id}`)} className="inline-flex items-center gap-1 font-semibold text-brand-600">দারস {next.number} <ChevronRight size={18} /></a> : <span />}
      </div>
    </div>
  );
}
