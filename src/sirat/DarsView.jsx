import { useState } from 'react';
import { BookOpen, Compass, Hourglass, Sparkles, ArrowRight } from 'lucide-react';
import index from '../data/darsIndex.json';
import videos from '../data/videos.json';
import { brand } from './brand';
import { bn } from './questions';
import { href } from './router';
import PathNode from './PathNode';

// ডুয়োলিঙ্গো-ধাঁচের আঁকাবাঁকা পথের অবস্থান (মোবাইল / ডেস্কটপ)
const OFFSETS = [
  '-translate-x-14 sm:-translate-x-22',
  '-translate-x-7 sm:-translate-x-11',
  'translate-x-7 sm:translate-x-11',
  'translate-x-14 sm:translate-x-22',
  'translate-x-7 sm:translate-x-11',
  '-translate-x-7 sm:-translate-x-11',
];
const SIDES = ['right', 'right', 'left', 'left', 'left', 'right'];

const TABS = [
  { key: 'concise', to: '/dars', label: 'সংক্ষিপ্ত', icon: BookOpen },
  { key: 'deep', to: '/dars/deep', label: 'গভীর পাঠ', icon: Compass },
];

export default function DarsList({ progress, mode = 'concise', id }) {
  const darsId = id || progress.last?.dars || 1;
  const d = index.find((x) => x.id === darsId) || index[0];
  // দারস বদলালে খোলা ডাল বন্ধ: key দিয়ে রিসেট
  return <Roadmap key={d.id} d={d} progress={progress} mode={mode} />;
}

function Roadmap({ d, progress, mode }) {
  const [openNo, setOpenNo] = useState(null);
  const deep = mode === 'deep';
  const doneCount = d.porbos.filter((p) => progress.done[`${d.id}-${p.no}`]).length;
  const pct = Math.round((doneCount / d.porbos.length) * 100);
  const currentNo = (progress.last?.dars === d.id && progress.last.porbo) || d.porbos.find((p) => !progress.done[`${d.id}-${p.no}`])?.no || 1;

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-4" onClick={() => setOpenNo(null)}>
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
          <div className="sticky top-16 md:top-20 z-30 mb-5 py-1.5 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-xs sm:shadow-sm flex items-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
            <select value={d.id} onChange={(e) => { window.location.hash = `/dars/${e.target.value}`; }} className="shrink-0 max-w-[84px] sm:max-w-none px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-colors bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300">
              {index.map((x) => <option key={x.id} value={x.id}>দারস {bn(x.number)}</option>)}
            </select>
            <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2" title="এই দারসের মোট পাঠের অগ্রগতি">
              <div className="relative flex-1 h-1.5 sm:h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${Math.max(pct, 2)}%` }} />
              </div>
              <span className="shrink-0 text-[11px] sm:text-xs font-extrabold text-slate-600 dark:text-slate-300 whitespace-nowrap">{bn(doneCount)}/{bn(d.porbos.length)} <span className="font-bold text-slate-400 dark:text-slate-500">পাঠ</span></span>
            </div>
            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-white text-[11px] sm:text-xs font-bold shadow-2xs bg-emerald-600">দারস {bn(d.number)}</span>
          </div>

          {/* চলমান পাঠ কুইক রেজ্যুম কার্ড */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-emerald-900/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-500/30 dark:border-emerald-600/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-emerald-600 text-white"><Sparkles size={20} className="animate-pulse" /></div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">আপনার চলমান পাঠ</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">(যেখানে শেষ করেছিলেন)</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">দারস {bn(d.number)} • পাঠ {bn(currentNo)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <a href={href(`/dars/${d.id}/${currentNo}/video`)} className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"><span>চালিয়ে যান</span><ArrowRight size={14} /></a>
            </div>
          </div>

          {/* Unit banner */}
          <div className="mb-8 p-5 sm:p-6 rounded-3xl text-white shadow-lg relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600">
            <div className="relative z-10">
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-2">📖 সংক্ষিপ্ত • দারস {bn(d.number)}</span>
              <h3 className="text-lg sm:text-xl font-bold leading-snug">{d.title}</h3>
              <p className="text-sm text-emerald-50 mt-1">{d.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 sm:gap-7 relative py-4" onClick={(e) => e.stopPropagation()}>
            {d.porbos.map((p, i) => (
              <PathNode
                key={p.no}
                darsId={d.id}
                no={p.no}
                offsetClass={OFFSETS[i % OFFSETS.length]}
                side={SIDES[i % SIDES.length]}
                done={!!progress.done[`${d.id}-${p.no}`]}
                current={p.no === currentNo}
                open={openNo === p.no}
                onToggle={() => setOpenNo(openNo === p.no ? null : p.no)}
                hasQuiz={p.quiz > 0}
                hasVideo={!!videos[`${d.id}-${p.no}`]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
