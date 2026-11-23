import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, ExternalLink, FileDown, FileText, Film, Headphones, Lightbulb, Lock, PenLine, PictureInPicture2 } from 'lucide-react';
import { isUnlocked, isDarsLocked, isTextLocked } from './progress';
import index from '../data/darsIndex.json';
import videos from '../data/videos.json';
import { loadDarsLocalized } from '../data/loadTranslation';
import { useLang } from '../i18n';
import { href } from './router';
import Runs from './Runs';
import QuizModal from './QuizModal';
import NotFound from './NotFound';
import NoteWrap from './NoteWrap';
import { useVideo } from '../context/VideoContext';

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
  text: { label: 'লেখা', icon: FileText },
  quiz: { label: 'কুইজ', icon: PenLine },
};

const DRIVE_PDF_LINK = 'https://drive.google.com/drive/folders/1jYIve35J-bdRkydqeE14PqfNsX6w7Mii?usp=drive_link';

// দারসের মূল ইউটিউব ভিডিও: পার্ট থাকলে সেটি, অন্যথায় মূল ভিডিওটি সম্পূর্ণভাবে কোনো কাটাকাটি ছাড়া চলবে
function videoFor(meta, id, no) {
  const v = videos[String(id)];
  if (!v) return {};
  const cfg = typeof v === 'string' ? { url: v } : v;
  const part = cfg.parts?.[no - 1];
  if (part?.segments) return { entries: part.segments };
  if (part) return { entry: { url: cfg.url, ...part } };
  return { entry: { url: cfg.url } };
}

export default function PorboPage({ id, no, step, progress }) {
  const meta = index.find((x) => x.id === id);
  const [dars, setDars] = useState(null);
  const [listen, setListen] = useState(false);
  const lang = useLang();
  const { markVisited } = progress;
  const {
    registerLesson,
    activeVideo,
    isFloating,
    expand,
    float,
    isPlaying,
    setAnchorEl,
  } = useVideo();
  const anchorNodeRef = useRef(null);

  useEffect(() => {
    let live = true;
    setDars(null);
    loadDarsLocalized(id, lang).then((d) => live && setDars(d || false));
    return () => { live = false; };
  }, [id, lang]);
  useEffect(() => { markVisited(id, no); }, [id, no, markVisited]);

  // পাঠের ভিডিও গ্লোবাল ভিডিও কন্টেক্সটে রেজিস্টার করা
  useEffect(() => {
    if (meta?.porbos?.[no - 1]) {
      const p = meta.porbos[no - 1];
      registerLesson({
        darsId: id,
        porboNo: no,
        title: p.title,
        ...videoFor(meta, id, no),
      });
    }
  }, [id, no, meta, registerLesson]);

  // ভিউ পরিবর্তন হলে (ভিডিও থেকে লেখা/কুইজ সেকশনে এলে স্বয়ংক্রিয়ভাবে ফ্লোটিং হবে)
  useEffect(() => {
    if (step && step !== 'video') {
      if (isPlaying) {
        float();
      }
    }
  }, [step, isPlaying, float]);

  // ভিডিও পেজে স্ক্রল করলে ফ্লোটিং হওয়া (IntersectionObserver)
  useEffect(() => {
    if (step !== 'video') return undefined;
    const el = anchorNodeRef.current || document.getElementById('sirat-video-anchor');
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (isPlaying) {
            float();
          }
        }
        // NOTE: একবার ফ্লোটিং হলে স্বয়ংক্রিয়ভাবে আনফ্লোট হবে না।
        // ব্যবহারকারী [ ↗ ] বাটনে বা কার্ডে চাপলেই কেবল আনফ্লোট হবে।
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [step, isPlaying, float]);

  // নোট/বুকমার্ক থেকে এলে ওই অনুচ্ছেদে স্ক্রল ও কিছুক্ষণ জ্বলে ওঠা
  useEffect(() => {
    if (!dars || step === 'video') return undefined;
    const jump = () => {
      let v = null;
      try { v = sessionStorage.getItem('sirat_jump_block'); } catch { /* ignore */ }
      if (v === null) return;
      const el = document.getElementById(`blk-${v}`);
      if (!el) return;
      try { sessionStorage.removeItem('sirat_jump_block'); } catch { /* ignore */ }
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el.classList.add('note-flash');
      setTimeout(() => el.classList.remove('note-flash'), 2600);
    };
    const t = setTimeout(jump, 250);
    window.addEventListener('sirat_jump_block', jump);
    return () => { clearTimeout(t); window.removeEventListener('sirat_jump_block', jump); };
  }, [dars, step, id, no]);

  if (!meta || no < 1 || no > meta.porbos.length || !STEP_META[step]) return <NotFound />;
  if (dars === null) return <p className="py-20 text-center text-slate-500">লোড হচ্ছে…</p>;
  if (dars === false) return <NotFound />;

  const porbo = dars.porbos[no - 1];
  const done = progress.done[`${id}-${no}`];
  const steps = ['video', 'text', ...(porbo.quiz.length ? ['quiz'] : [])];
  if (!steps.includes(step)) return <NotFound />;
  if (!isUnlocked(progress.done, id, no)) {
    const lockedDars = isDarsLocked(id);
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <Lock size={44} className="mx-auto text-slate-400" />
        <p className="mt-4 text-lg font-bold">{lockedDars ? 'এই দারসটি এখনও বন্ধ রয়েছে' : 'এই ধাপ এখনও বন্ধ'}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lockedDars ? 'এই দারসটি শীঘ্রই আসছে, ইন শা আল্লাহ।' : 'আগের ধাপ সম্পন্ন করলে এটি খুলবে।'}</p>
        <a href={href(lockedDars ? '/dars' : (no > 1 ? `/dars/${id}/${no - 1}/video` : `/dars/${id - 1}/1/video`))} className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white">{lockedDars ? 'পাঠ্যক্রমে ফিরুন' : 'আগের ধাপে যান'}</a>
      </div>
    );
  }
  const view = step === 'quiz' ? 'text' : step;
  const si = steps.indexOf(step);
  const go = (p) => href(p);
  const prevHref = si > 0 ? `/dars/${id}/${no}/${steps[si - 1]}` : null;
  const nextLessonHref = no < meta.porbos.length ? `/dars/${id}/${no + 1}/video` : (id < index.length && !isDarsLocked(id + 1)) ? `/dars/${id + 1}/1/video` : null;

  return (
    <article className="mx-auto max-w-3xl">
      <a href={href(`/dars/${id}`)} className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">← দারস {meta.number}: {meta.title}</a>
      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{no}/{meta.porbos.length}</p>
      <h1 translate="no" className="mb-4 text-xl font-bold leading-snug sm:text-2xl">{porbo.title.split(' • ')[0]}</h1>

      <div className="mb-6 grid gap-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((k) => {
          const { label, icon: Icon } = STEP_META[k];
          const textLocked = k === 'text' && isTextLocked(id);
          return (
            <a
              key={k}
              href={go(`/dars/${id}/${no}/${k}`)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold ${
                k === step
                  ? 'bg-emerald-600 text-white shadow'
                  : textLocked
                    ? 'text-slate-400 dark:text-slate-500 opacity-80'
                    : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {textLocked ? <Lock size={15} className="text-amber-500" /> : <Icon size={16} />}
              {label}
              {textLocked ? <span className="text-[10px] text-amber-500 font-semibold">(শীঘ্রই)</span> : null}
            </a>
          );
        })}
      </div>

      {/* ভিডিও প্লেয়ারের অ্যাংকর স্থান: ভিডিও মোডে এখানে ভিডিও রেন্ডার হবে অথবা ফ্লোটিং কার্ড দেখাবে */}
      {step === 'video' && (
        <div
          ref={(node) => {
            anchorNodeRef.current = node;
            setAnchorEl(node);
          }}
          id="sirat-video-anchor"
          className="relative w-full aspect-video rounded-2xl mb-6 bg-slate-900/10 dark:bg-black/30 overflow-hidden"
        >
          {isFloating && (
            <div
              onClick={expand}
              className="h-full w-full rounded-2xl border-2 border-dashed border-emerald-400/50 dark:border-emerald-600/50 bg-emerald-500/5 dark:bg-emerald-950/20 flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center group hover:bg-emerald-500/10 transition-colors select-none"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <PictureInPicture2 size={20} />
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ভিডিও নিচে ভাসমান (Floating Mini-Player) অবস্থায় চলছে
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                এখানে চাপ দিয়ে স্বাভাবিক আকারে বড় করুন ↗
              </span>
            </div>
          )}
        </div>
      )}

      {view === 'text' && (
        isTextLocked(id) ? (
          <div className="mx-auto max-w-md py-14 px-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
              <Lock size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">দারস {meta.number}-এর লেখা প্রস্তুত হচ্ছে</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              দারস ২৫ থেকে ৩২-এর বিস্তারিত লিখিত পাঠ ও নোট তৈরির কাজ চলছে, ইনশাআল্লাহ শীঘ্রই উন্মুক্ত করা হবে। অফলাইনে পড়ার জন্য গুগল ড্রাইভ ফোল্ডার থেকে সম্পূর্ণ পিডিএফ সংগ্রহ করতে পারেন।
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={go(`/dars/${id}/${no}/video`)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
                <Film size={16} /> লেকচার ভিডিও দেখুন
              </a>
              <a
                href={DRIVE_PDF_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-5 py-2.5 font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-xs"
              >
                <FileDown size={16} /> মূল পিডিএফ ডাউনলোড <ExternalLink size={13} className="opacity-70" />
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-white/10 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {videos[String(id)] && (
                  !listen ? (
                    <button
                      type="button"
                      onClick={() => setListen(true)}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-500 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Headphones size={16} /> পড়ার সাথে শুনুন
                    </button>
                  ) : (
                    <div className="sticky top-16 z-30 md:top-20">
                      <VideoPlayer {...videoFor(meta, id, no)} title={porbo.title} audioOnly />
                      <button
                        type="button"
                        onClick={() => setListen(false)}
                        className="mt-1 text-xs font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
                      >
                        অডিও বার বন্ধ করুন
                      </button>
                    </div>
                  )
                )}
              </div>
              <a
                href={DRIVE_PDF_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/30 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-xs"
                title="গুগল ড্রাইভ ফোল্ডার থেকে সম্পূর্ণ দারসের মূল পিডিএফ ডাউনলোড করুন"
              >
                <FileDown size={16} />
                <span>পিডিএফ ডাউনলোড</span>
                <ExternalLink size={13} className="opacity-70" />
              </a>
            </div>

            <div translate="no" className="reader space-y-4">
              {porbo.blocks.map((b, i) => (b.type === 'sub' ? <Block key={i} b={b} /> : <NoteWrap key={i} b={b} idx={i} dars={id} porbo={no}><Block b={b} /></NoteWrap>))}
            </div>

            <div className="my-8 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileDown size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">দারসের মূল মুদ্রিত পিডিএফ সংগ্রহ করুন</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">অফলাইনে পড়া ও রিভিশনের জন্য গুগল ড্রাইভ ফোল্ডার থেকে সব পিডিএফ সংগ্রহ করতে পারেন।</p>
                </div>
              </div>
              <a
                href={DRIVE_PDF_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-700 shrink-0 transition-colors"
              >
                <FileDown size={15} />
                <span>ড্রাইভ থেকে ডাউনলোড</span>
                <ExternalLink size={12} className="opacity-80" />
              </a>
            </div>

            {porbo.footnotes.length > 0 && (
              <aside className="mt-8 border-t border-slate-200 dark:border-white/10 pt-4 text-sm text-slate-600 dark:text-slate-300">
                <h2 className="mb-2 font-bold">পাদটীকা</h2>
                <ol className="space-y-1.5">
                  {porbo.footnotes.map((f) => (
                    <li key={f.n} id={`fn-${f.n}`} className="flex gap-2">
                      <a href={`#fnref-${f.n}`} onClick={(e) => { e.preventDefault(); document.getElementById(`fnref-${f.n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400">[{f.n}]</a>
                      <span translate="no"><Runs runs={f.runs} /></span>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </>
        )
      )}

      {step === 'quiz' && <QuizModal id={id} no={no} progress={progress} onClose={() => { window.location.hash = `/dars/${id}/${no}/text`; }} />}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        {prevHref ? <a href={go(prevHref)} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 dark:border-white/20 px-4 py-2 font-semibold"><ChevronLeft size={18} /> আগের</a> : <span />}
        {view === 'video' && (
          <div className="flex flex-wrap items-center gap-2">
            {!isTextLocked(id) && (
              <a href={go(`/dars/${id}/${no}/text`)} className="inline-flex items-center gap-1 rounded-full border-2 border-emerald-500 px-5 py-2.5 font-bold text-emerald-700 dark:text-emerald-200">লেখা পড়ুন <ChevronRight size={18} /></a>
            )}
            {porbo.quiz.length > 0 && !isTextLocked(id) && <a href={go(`/dars/${id}/${no}/quiz`)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white"><PenLine size={18} /> কুইজ খেলুন</a>}
            {isTextLocked(id) && !done && (
              <button onClick={() => progress.markDone(id, no)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white"><Circle size={18} /> সম্পন্ন করুন</button>
            )}
            {done && (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={18} /> সম্পন্ন</span>
                {nextLessonHref && <a href={go(nextLessonHref)} className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white">পরের ধাপ <ChevronRight size={18} /></a>}
              </div>
            )}
          </div>
        )}
        {view === 'text' && !isTextLocked(id) && porbo.quiz.length > 0 && (
          <a href={go(`/dars/${id}/${no}/quiz`)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white"><PenLine size={18} /> কুইজ খেলুন <ChevronRight size={18} /></a>
        )}
        {view === 'text' && !isTextLocked(id) && porbo.quiz.length > 0 && !done && (
          <button onClick={() => progress.markDone(id, no)} className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-500 px-5 py-2.5 font-bold text-emerald-700 dark:text-emerald-200"><Circle size={18} /> কুইজ ছাড়াই সম্পন্ন করুন</button>
        )}
        {view === 'text' && (!porbo.quiz.length || isTextLocked(id)) && !done && (
          <button onClick={() => progress.markDone(id, no)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white"><Circle size={18} /> সম্পন্ন করুন</button>
        )}
        {done && view !== 'video' && (

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={18} /> সম্পন্ন</span>
            {nextLessonHref && <a href={go(nextLessonHref)} className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-5 py-2.5 font-bold text-white">পরের ধাপ <ChevronRight size={18} /></a>}
          </div>
        )}
      </div>
    </article>
  );
}
