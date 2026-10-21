import { useEffect, useRef, useState } from 'react';
import { BookOpen, Compass, Hourglass, Sparkles, ArrowRight } from 'lucide-react';
import index from '../data/darsIndex.json';
import videos from '../data/videos.json';
import { brand } from './brand';
import { bn } from './questions';
import { href } from './router';
import { Branch, DarsNode, LessonNode } from './PathNode';

const TABS = [
  { key: 'concise', to: '/dars', label: 'সংক্ষিপ্ত', icon: BookOpen },
  { key: 'deep', to: '/dars/deep', label: 'গভীর পাঠ', icon: Compass },
];

export default function DarsView({ progress, mode = 'concise', id }) {
  return <Roadmap progress={progress} mode={mode} focusId={id} />;
}

function DarsRow({ d, progress, current, focus }) {
  const [openNo, setOpenNo] = useState(null);
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const doneCount = d.porbos.filter((p) => progress.done[`${d.id}-${p.no}`]).length;
  const currentNo = current ? (progress.last?.dars === d.id && progress.last.porbo) || d.porbos.find((p) => !progress.done[`${d.id}-${p.no}`])?.no || 1 : 0;
  const open = d.porbos.find((p) => p.no === openNo);

  useEffect(() => {
    if (focus) rowRef.current?.scrollIntoView({ block: 'start' });
    if (current && currentNo > 1) trackRef.current?.children[currentNo - 1]?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [focus, current, currentNo]);

  return (
    <section ref={rowRef} id={`dars-row-${d.id}`} className="scroll-mt-32">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
        <h3 className="text-base font-extrabold leading-snug sm:text-lg">{d.title}</h3>
        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{bn(doneCount)}/{bn(d.porbos.length)} পাঠ</span>
      </div>
      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">{d.subtitle}</p>
      <div className="flex items-center gap-2">
        <DarsNode number={d.number} done={doneCount === d.porbos.length} />
        <div ref={trackRef} className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-3 pl-1 pr-4">
          {d.porbos.map((p) => (
            <LessonNode key={p.no} no={p.no} done={!!progress.done[`${d.id}-${p.no}`]} current={p.no === currentNo} open={openNo === p.no} onToggle={() => setOpenNo(openNo === p.no ? null : p.no)} />
          ))}
        </div>
      </div>
      {open && <Branch darsId={d.id} no={open.no} title={open.title} hasQuiz={open.quiz > 0} hasVideo={!!videos[`${d.id}-${open.no}`]} />}
    </section>
  );
}

function Roadmap({ progress, mode, focusId }) {
  const deep = mode === 'deep';
  const total = index.reduce((a, x) => a + x.porbos.length, 0);
  const doneTotal = index.reduce((a, x) => a + x.porbos.filter((p) => progress.done[`${x.id}-${p.no}`]).length, 0);
  const pct = Math.round((doneTotal / total) * 100);
  const lastDars = progress.last?.dars || index.find((x) => x.porbos.some((p) => !progress.done[`${x.id}-${p.no}`]))?.id || 1;
  const cur = index.find((x) => x.id === lastDars) || index[0];
  const currentNo = (progress.last?.dars === cur.id && progress.last.porbo) || cur.porbos.find((p) => !progress.done[`${cur.id}-${p.no}`])?.no || 1;

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-4">
      {/* Top Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl mb-6 relative overflow-hidden transition-all duration-500 ${deep ? 'bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800' : 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800'}`}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <a href="https://markazuliman.com" target="_blank" rel="noopener noreferrer" title="মারকাযুল ঈমান অফিসিয়াল ওয়েবসাইট (markazuliman.com)" className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-all inline-flex items-center gap-1 cursor-pointer">
              <span>মারকাযুল ঈমান • ডিজিটাল সংস্করণ</span>
              <span className="text-[10px]">↗</span>
            </a>
            <span className="text-xs text-emerald-100 font-semibold px-2.5 py-0.5 rounded-full bg-black/20">{deep ? '🔎 গভীর পাঠ' : '📖 সংক্ষিপ্ত'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">{brand.name} ({brand.nameArabic})</h1>
          <p className="text-emerald-100 text-xs sm:text-sm md:text-base mt-2 max-w-2xl leading-relaxed">নবীজী ﷺ-এর জীবনী নিয়ে ধারাবাহিক দারস। প্রতিটি দারসের ছোট ছোট পাঠে ভিডিও, লেখা ও কুইজ; প্রতিদিন অল্প করে পড়ুন, নিয়মিত এগিয়ে যান।</p>
        </div>
      </div>

      {/* Primary Mode Switcher */}
      <div className="flex justify-center mb-5 w-full">
        <div className="w-full max-w-sm sm:w-auto sm:max-w-none grid grid-cols-2 sm:inline-flex p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {TABS.map(({ key, to, label, icon: Icon }) => {
            const on = key === mode;
            const activeCls = key === 'deep' ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs';
            return (
              <a key={key} href={href(to)} className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${on ? activeCls : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <Icon size={14} className="shrink-0" />
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {deep ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-teal-300 dark:border-teal-700/50 bg-teal-50 dark:bg-teal-950/30 px-6 py-16 text-center text-teal-800 dark:text-teal-200">
          <Hourglass size={40} strokeWidth={1.5} />
          <p className="text-lg font-bold">গভীর পাঠ শিগগিরই আসছে, ইন শা আল্লাহ</p>
        </div>
      ) : (
        <>
          {/* Sticky stats & dars switcher bar */}
          <div className="sticky top-16 md:top-20 z-30 mb-5 py-1.5 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs sm:shadow-sm flex items-center gap-2 sm:gap-3" >
                        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2" title="এই দারসের মোট পাঠের অগ্রগতি">
              <div className="relative flex-1 h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${Math.max(pct, 2)}%` }} />
              </div>
              <span className="shrink-0 text-[11px] sm:text-xs font-extrabold text-slate-600 dark:text-slate-300 whitespace-nowrap">{bn(doneTotal)}/{bn(total)} <span className="font-bold text-slate-400 dark:text-slate-500">পাঠ</span></span>
            </div>
            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-white text-[11px] sm:text-xs font-bold shadow-2xs bg-emerald-600">{bn(index.length)}টি দারস</span>
          </div>

          {/* চলমান পাঠ কুইক রেজ্যুম কার্ড */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-emerald-900/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-500/30 dark:border-emerald-600/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4" >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-emerald-600 text-white"><Sparkles size={20} className="animate-pulse" /></div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">আপনার চলমান পাঠ</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">(যেখানে শেষ করেছিলেন)</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">দারস {bn(cur.number)} • পাঠ {bn(currentNo)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <a href={href(`/dars/${cur.id}/${currentNo}/video`)} className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"><span>চালিয়ে যান</span><ArrowRight size={14} /></a>
            </div>
          </div>

          {/* সব দারস: প্রতিটির পাশে অনুভূমিক পাঠের পথ */}
          <div className="space-y-6 pb-4">
            {index.map((x) => (
              <DarsRow key={x.id} d={x} progress={progress} current={x.id === cur.id} focus={x.id === focusId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
