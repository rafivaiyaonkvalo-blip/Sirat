import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, FileText, Film, Lightbulb, PenLine } from 'lucide-react';
import index from '../data/darsIndex.json';
import videos from '../data/videos.json';
import { loadDars } from '../data/loadDars';
import { href } from './router';
import Runs from './Runs';
import VideoPlayer from './VideoPlayer';
import Quiz from './Quiz';
import NotFound from './NotFound';

function Block({ b }) {
  switch (b.type) {
    case 'sub':
      return <h3 className="mt-8 mb-2 text-xl font-bold text-emerald-700 dark:text-emerald-200"><Runs runs={b.runs} /></h3>;
    case 'arabic':
      return <p className="font-arabic my-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 px-4 py-3 text-center text-2xl font-bold text-emerald-700 dark:text-emerald-200 sm:text-3xl" dir="rtl"><Runs runs={b.runs.map((r) => ({ ...r, ar: 0 }))} /></p>;
    case 'quote':
      return <blockquote className="my-4 border-l-4 border-amber-500 bg-amber-50/60 dark:bg-white/5 px-4 py-1 italic"><p><Runs runs={b.runs} /></p></blockquote>;
    case 'callout':
      return (
        <div className="my-6 rounded-2xl border border-amber-500/40 bg-amber-50 dark:bg-amber-400/10 p-4">
          <p className="mb-1 flex items-center gap-2 font-bold text-amber-600"><Lightbulb size={18} /> {b.title}</p>
          <p><Runs runs={b.runs} /></p>
        </div>
      );
    case 'center':
      return <p className="text-center"><Runs runs={b.runs} /></p>;
    default:
      return <p><Runs runs={b.runs} /></p>;
  }
}

const STEP_META = {
  video: { label: 'ভিডিও', icon: Film },
  text: { label: 'পাঠ', icon: FileText },
  quiz: { label: 'কুইজ', icon: PenLine },
};

export default function PorboPage({ id, no, step, progress }) {
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

  if (!meta || no < 1 || no > meta.porbos.length || !STEP_META[step]) return <NotFound />;
  if (dars === null) return <p className="py-20 text-center text-slate-500">লোড হচ্ছে…</p>;
  if (dars === false) return <NotFound />;

  const porbo = dars.porbos[no - 1];
  const done = progress.done[`${id}-${no}`];
  const steps = ['video', 'text', ...(porbo.quiz.length ? ['quiz'] : [])];
  if (!steps.includes(step)) return <NotFound />;
  const si = steps.indexOf(step);
  const go = (p) => href(p);
  const prevHref = si > 0 ? `/dars/${id}/${no}/${steps[si - 1]}` : null;
  let nextHref = null;
  if (si < steps.length - 1) nextHref = `/dars/${id}/${no}/${steps[si + 1]}`;
  else if (no < meta.porbos.length) nextHref = `/dars/${id}/${no + 1}/video`;
  else if (id < index.length) nextHref = `/dars/${id + 1}/1/video`;
  const last = si === steps.length - 1;

  return (
    <article className="mx-auto max-w-3xl">
      <a href={href(`/dars/${id}`)} className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">← দারস {meta.number}: {meta.title}</a>
      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">পাঠ {no}/{meta.porbos.length}</p>
      <h1 className="mb-4 text-2xl font-bold leading-snug sm:text-3xl">{porbo.title}</h1>

      <div className="mb-6 grid gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((k) => {
          const { label, icon: Icon } = STEP_META[k];
          return (
            <a key={k} href={go(`/dars/${id}/${no}/${k}`)} className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold ${k === step ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}><Icon size={16} /> {label}</a>
          );
        })}
      </div>

      {step === 'video' && <VideoPlayer url={videos[`${id}-${no}`]} title={porbo.title} />}

      {step === 'text' && (
        <>
          <div className="reader space-y-4">
            {porbo.blocks.map((b, i) => <Block key={i} b={b} />)}
          </div>
          {porbo.footnotes.length > 0 && (
            <aside className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 text-sm text-slate-600 dark:text-slate-300">
              <h2 className="mb-2 font-bold">পাদটীকা</h2>
              <ol className="space-y-1.5">
                {porbo.footnotes.map((f) => (
                  <li key={f.n} id={`fn-${f.n}`} className="flex gap-2">
                    <a href={`#fnref-${f.n}`} onClick={(e) => { e.preventDefault(); document.getElementById(`fnref-${f.n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400">[{f.n}]</a>
                    <span><Runs runs={f.runs} /></span>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </>
      )}

      {step === 'quiz' && <Quiz key={`${id}-${no}`} questions={porbo.quiz} previous={progress.scores[`${id}-${no}`]} onFinish={(s, t) => progress.saveScore(id, no, s, t)} />}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        {last ? (
          <button onClick={() => progress.toggleDone(id, no)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold ${done ? 'bg-emerald-600 text-white' : 'border-2 border-emerald-500 text-emerald-700 dark:text-emerald-200'}`}>
            {done ? <CheckCircle2 size={18} /> : <Circle size={18} />} {done ? 'সম্পন্ন' : 'সম্পন্ন চিহ্নিত করুন'}
          </button>
        ) : <span />}
        <div className="flex gap-2">
          {prevHref && <a href={go(prevHref)} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 dark:border-white/20 px-4 py-2 font-semibold"><ChevronLeft size={18} /> আগের</a>}
          {nextHref && <a href={go(nextHref)} className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white">{last ? 'পরের পাঠ' : 'পরের ধাপ'} <ChevronRight size={18} /></a>}
        </div>
      </div>
    </article>
  );
}
