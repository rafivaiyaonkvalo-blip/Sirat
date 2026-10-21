import { Hourglass } from 'lucide-react';
import { DarsGrid } from './Home';
import { href } from '../utils/router';

const TABS = [
  { key: 'concise', to: '/dars', label: 'সংক্ষিপ্ত', en: 'Concise', note: 'প্রতিটি দারস পর্বে পর্বে: ভিডিও, সংক্ষিপ্ত পাঠ ও কুইজ।' },
  { key: 'deep', to: '/dars/deep', label: 'গভীর পাঠ', en: 'Deep', note: 'প্রতিটি বিষয়ের গভীর ও বিস্তারিত আলোচনা।' },
];

export default function DarsList({ progress, mode = 'concise' }) {
  const tab = TABS.find((t) => t.key === mode);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold text-brand-700 dark:text-brand-200">দারস</h1>
      <div className="mb-3 inline-flex rounded-full border border-brand-200 dark:border-white/15 bg-white dark:bg-white/5 p-1">
        {TABS.map((t) => (
          <a key={t.key} href={href(t.to)} className={`rounded-full px-5 py-2 text-sm font-bold transition ${t.key === mode ? 'bg-brand-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>
            {t.label} <span className="font-normal opacity-70">· {t.en}</span>
          </a>
        ))}
      </div>
      <p className="mb-6 text-slate-500 dark:text-slate-400">{tab.note}</p>
      {mode === 'concise' ? (
        <DarsGrid progress={progress} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-brand-200 dark:border-brand-700/50 bg-brand-50 dark:bg-brand-900/30 px-6 py-16 text-center text-brand-700 dark:text-brand-200">
          <Hourglass size={40} strokeWidth={1.5} />
          <p className="text-lg font-bold">গভীর পাঠ শিগগিরই আসছে, ইন শা আল্লাহ</p>
        </div>
      )}
    </div>
  );
}
