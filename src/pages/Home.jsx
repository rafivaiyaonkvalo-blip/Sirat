import { ArrowRight, PlayCircle } from 'lucide-react';
import index from '../data/darsIndex.json';
import { href } from '../utils/router';
import { getAssetUrl } from '../utils/assetHelper';
import { brand } from '../config/brand';

export function DarsGrid({ progress }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {index.map((d) => {
        const done = d.porbos.filter((p) => progress.done[`${d.id}-${p.no}`]).length;
        const pct = Math.round((done / d.porbos.length) * 100);
        return (
          <a key={d.id} href={href(`/dars/${d.id}`)} className="group rounded-2xl border border-brand-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
              <span>দারস {d.number}</span>
              <span>{d.porbos.length} পর্ব</span>
            </div>
            <h3 className="mt-1 text-lg font-bold leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-200">{d.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{d.subtitle}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100 dark:bg-white/10">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default function Home({ progress }) {
  const total = index.reduce((a, d) => a + d.porbos.length, 0);
  const last = progress.last && index.find((d) => d.id === progress.last.dars);
  return (
    <div>
      <section className="pattern-bg relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-12 text-center text-white sm:py-16">
        <img src={getAssetUrl(brand.logo)} alt={brand.name} className="mx-auto mb-4 h-20 w-20" />
        <p className="font-arabic text-3xl text-brand-200">{brand.nameArabic}</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{brand.name}</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">নবীজী ﷺ-এর জীবনী নিয়ে ধারাবাহিক {index.length}টি দারস, {total}টি পর্ব। ভিডিও, পাঠ ও কুইজসহ।</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={href('/dars/1/1')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-brand-700 shadow hover:bg-brand-50"><PlayCircle size={20} /> শুরু করুন</a>
          {last && <a href={href(`/dars/${progress.last.dars}/${progress.last.porbo}`)} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">দারস {last.number} থেকে চালিয়ে যান <ArrowRight size={18} /></a>}
        </div>
      </section>
      <h2 className="mb-4 mt-10 text-2xl font-bold text-brand-700 dark:text-brand-200">সব দারস</h2>
      <DarsGrid progress={progress} />
    </div>
  );
}
