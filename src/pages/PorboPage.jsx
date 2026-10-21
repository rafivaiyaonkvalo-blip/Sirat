import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Lightbulb } from 'lucide-react';
import index from '../data/darsIndex.json';
import videos from '../data/videos.json';
import { loadDars } from '../data/loadDars';
import { href } from '../utils/router';
import Runs from '../components/Runs';
import VideoPlayer from '../components/VideoPlayer';
import Quiz from '../components/Quiz';
import NotFound from './NotFound';

function Block({ b }) {
  switch (b.type) {
    case 'sub':
      return <h3 className="mt-8 mb-2 text-xl font-bold text-brand-700 dark:text-brand-200"><Runs runs={b.runs} /></h3>;
    case 'arabic':
      return <p className="font-arabic my-5 rounded-xl bg-brand-50 dark:bg-brand-900/30 px-4 py-3 text-center text-2xl font-bold text-brand-700 dark:text-brand-200 sm:text-3xl" dir="rtl"><Runs runs={b.runs.map((r) => ({ ...r, ar: 0 }))} /></p>;
    case 'quote':
      return <blockquote className="my-4 border-l-4 border-gold bg-amber-50/60 dark:bg-white/5 px-4 py-1 italic"><p><Runs runs={b.runs} /></p></blockquote>;
    case 'callout':
      return (
        <div className="my-6 rounded-2xl border border-gold/40 bg-amber-50 dark:bg-amber-400/10 p-4">
          <p className="mb-1 flex items-center gap-2 font-bold text-gold"><Lightbulb size={18} /> {b.title}</p>
          <p><Runs runs={b.runs} /></p>
        </div>
      );
    case 'center':
      return <p className="text-center"><Runs runs={b.runs} /></p>;
    default:
      return <p><Runs runs={b.runs} /></p>;
  }
}

export default function PorboPage({ id, no, progress }) {
  const meta = index.find((x) => x.id === id);
  const [dars, setDars] = useState(null);
  const { markVisited } = progress;

  useEffect(() => {
    let live = true;
    setDars(null);
    loadDars(id).then((d) => live && setDars(d || false));
    return () => { live = false; };
  }, [id]);
  useEffect(() => { markVisited(id, no); }, [id, no, markVisited]);

  if (!meta || no < 1 || no > meta.porbos.length) return <NotFound />;
  if (dars === null) return <p className="py-20 text-center text-slate-500">লোড হচ্ছে…</p>;
  if (dars === false) return <NotFound />;

  const porbo = dars.porbos[no - 1];
  const done = progress.done[`${id}-${no}`];
  const prevHref = no > 1 ? `/dars/${id}/${no - 1}` : id > 1 ? `/dars/${id - 1}` : null;
  const nextHref = no < meta.porbos.length ? `/dars/${id}/${no + 1}` : id < index.length ? `/dars/${id + 1}` : null;

  return (
    <article className="mx-auto max-w-3xl">
      <a href={href(`/dars/${id}`)} className="text-sm font-semibold text-brand-600 dark:text-brand-400">← দারস {meta.number}: {meta.title}</a>
      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">পর্ব {no}/{meta.porbos.length}</p>
      <h1 className="mb-4 text-2xl font-bold leading-snug sm:text-3xl">{porbo.title}</h1>

      <VideoPlayer url={videos[`${id}-${no}`]} title={porbo.title} />

      <div className="reader mt-8 space-y-4">
        {porbo.blocks.map((b, i) => <Block key={i} b={b} />)}
      </div>

      {porbo.footnotes.length > 0 && (
        <aside className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="mb-2 font-bold">পাদটীকা</h2>
          <ol className="space-y-1.5">
            {porbo.footnotes.map((f) => (
              <li key={f.n} id={`fn-${f.n}`} className="flex gap-2">
                <a href={`#fnref-${f.n}`} onClick={(e) => { e.preventDefault(); document.getElementById(`fnref-${f.n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="shrink-0 font-semibold text-brand-600 dark:text-brand-400">[{f.n}]</a>
                <span><Runs runs={f.runs} /></span>
              </li>
            ))}
          </ol>
        </aside>
      )}

      {porbo.quiz.length > 0 && <Quiz key={`${id}-${no}`} questions={porbo.quiz} previous={progress.scores[`${id}-${no}`]} onFinish={(s, t) => progress.saveScore(id, no, s, t)} />}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => progress.toggleDone(id, no)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold ${done ? 'bg-brand-600 text-white' : 'border-2 border-brand-500 text-brand-700 dark:text-brand-200'}`}>
          {done ? <CheckCircle2 size={18} /> : <Circle size={18} />} {done ? 'সম্পন্ন' : 'সম্পন্ন হিসেবে চিহ্নিত করুন'}
        </button>
        <div className="flex gap-2">
          {prevHref && <a href={href(prevHref)} className="inline-flex items-center gap-1 rounded-full border border-brand-200 dark:border-white/20 px-4 py-2 font-semibold"><ChevronLeft size={18} /> আগের</a>}
          {nextHref && <a href={href(nextHref)} className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-4 py-2 font-semibold text-white">পরের <ChevronRight size={18} /></a>}
        </div>
      </div>
    </article>
  );
}
