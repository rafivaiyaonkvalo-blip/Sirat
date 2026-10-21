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
  const doneCount = d.porbos.filter((p) => progress.done[`${d.id}-${p.no}`]).length;
  const pct = Math.round((doneCount / d.porbos.length) * 100);
  const currentNo = (progress.last?.dars === d.id && progress.last.porbo) || d.porbos.find((p) => !progress.done[`${d.id}-${p.no}`])?.no || 1;

  return (
    <div className="mx-auto max-w-2xl" onClick={() => setOpenNo(null)}>
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-900 p-6 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)]">
        <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">{brand.org}</span>
        <h1 className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl">{brand.name} <span className="font-arabic text-xl text-emerald-100">({brand.nameArabic})</span></h1>
        <p className="mt-2 text-sm text-emerald-50">নবীজী ﷺ-এর জীবনী নিয়ে ধারাবাহিক দারস। প্রতিটি পাঠে ভিডিও, লেখা ও কুইজ।</p>
      </section>

      <div className="mt-5 grid grid-cols-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1">
        {TABS.map(({ key, to, label, icon: Icon }) => (
          <a key={key} href={href(to)} className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold ${key === mode ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}><Icon size={16} /> {label}</a>
        ))}
      </div>

      {mode === 'deep' ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-900/30 px-6 py-16 text-center text-emerald-700 dark:text-emerald-200">
          <Hourglass size={40} strokeWidth={1.5} />
          <p className="text-lg font-bold">গভীর পাঠ শিগগিরই আসছে, ইন শা আল্লাহ</p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 shadow-sm" onClick={(e) => e.stopPropagation()}>
            <select value={d.id} onChange={(e) => { window.location.hash = `/dars/${e.target.value}`; }} className="max-w-[9rem] rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-slate-900 px-2 py-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-200">
              {index.map((x) => <option key={x.id} value={x.id}>দারস {bn(x.number)}</option>)}
            </select>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
            <span className="text-xs font-bold text-slate-500">{bn(doneCount)}/{bn(d.porbos.length)} পাঠ</span>
          </div>

          <a href={href(`/dars/${d.id}/${currentNo}/video`)} className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-white/10 bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"><Sparkles size={20} /></span>
            <span className="flex-1 leading-snug">
              <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-300">আপনার চলমান পাঠ</span>
              <span className="block font-bold">দারস {bn(d.number)} · পাঠ {bn(currentNo)}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">চালিয়ে যান <ArrowRight size={16} /></span>
          </a>

          <section className="mt-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-5 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)]">
            <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">📖 সংক্ষিপ্ত · দারস {bn(d.number)}</span>
            <h2 className="mt-2 text-xl font-bold leading-snug">{d.title}</h2>
            <p className="mt-1 text-sm text-emerald-50">{d.subtitle}</p>
          </section>

          <div className="relative flex flex-col items-center gap-6 py-6 sm:gap-7" onClick={(e) => e.stopPropagation()}>
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
