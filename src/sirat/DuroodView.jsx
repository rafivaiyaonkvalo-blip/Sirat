import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
import { campaign } from './brand';
import { bn } from './questions';
import { addToGlobal, cloudEnabled, subscribeGlobal } from './duroodCloud';

const DUROODS = [
  { id: 'short', name: 'সংক্ষিপ্ত দুরূদ', ar: 'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ', bn: 'আল্লাহ তাঁর ওপর রহমত ও শান্তি বর্ষণ করুন।' },
  { id: 'salam', name: 'দুরূদ ও সালাম', ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ', bn: 'হে আল্লাহ, আমাদের নবী মুহাম্মাদের ওপর রহমত ও শান্তি বর্ষণ করুন।' },
  { id: 'ibrahim', name: 'দুরূদে ইবরাহীম', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ', bn: 'নামাযে পঠিত দুরূদ।' },
];

const KEY = 'sirat_durood_v1';
const today = () => new Date().toISOString().slice(0, 10);
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { total: 0, days: {} }; } catch { return { total: 0, days: {} }; }
};

export default function DuroodPage() {
  const [state, setState] = useState(load);
  const [sel, setSel] = useState(DUROODS[0].id);
  const d = DUROODS.find((x) => x.id === sel);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  // সম্মিলিত গণনা: ট্যাপ জমিয়ে প্রতি কয়েক সেকেন্ডে একবার সার্ভারে যোগ হয়
  const [remote, setRemote] = useState(null);
  const [pending, setPending] = useState(0);
  const pendingRef = useRef(0);
  const flushing = useRef(false);
  const flush = useCallback(async () => {
    if (flushing.current || !pendingRef.current) return;
    flushing.current = true;
    try {
      const sent = await addToGlobal(pendingRef.current);
      pendingRef.current -= sent;
      setPending(pendingRef.current);
    } catch { /* অফলাইন: পরের ফ্লাশে আবার চেষ্টা */ }
    flushing.current = false;
  }, []);
  useEffect(() => {
    if (!cloudEnabled()) return undefined;
    const unsub = subscribeGlobal(setRemote);
    const timer = setInterval(flush, 4000);
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    return () => { unsub(); clearInterval(timer); document.removeEventListener('visibilitychange', onHide); flush(); };
  }, [flush]);

  const tap = () => {
    if (navigator.vibrate) navigator.vibrate(8);
    if (cloudEnabled()) { pendingRef.current += 1; setPending(pendingRef.current); }
    setState((s) => ({ total: s.total + 1, days: { ...s.days, [today()]: (s.days[today()] || 0) + 1 } }));
  };
  const todayCount = state.days[today()] || 0;
  const hasGlobal = remote !== null;
  const globalCount = hasGlobal ? remote.count + pending : 0;
  const target = (hasGlobal && remote.target) || campaign.target;
  const pct = hasGlobal ? Math.min(100, (globalCount / target) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">দুরূদ</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{campaign.title}: নবীজী ﷺ-এর ওপর দুরূদ পাঠ করি, সবাই মিলে।</p>

      <div className="mt-5 rounded-2xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-left">
        <div className="flex justify-between text-sm font-semibold"><span>ক্যাম্পেইন লক্ষ্য</span><span>{bn(target)}</span></div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
        <p className="mt-2 text-xs text-slate-500">{hasGlobal ? `এ পর্যন্ত সম্মিলিত দুরূদ: ${bn(globalCount)}` : 'সম্মিলিত গণনা শিগগিরই চালু হবে, ইন শা আল্লাহ। এখন আপনার নিজের গণনা সংরক্ষিত হচ্ছে।'}</p>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {DUROODS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${sel === x.id ? 'bg-emerald-600 text-white' : 'border border-emerald-200 dark:border-white/20'}`}>{x.name}</button>
        ))}
      </div>

      <p className="font-arabic mt-6 text-2xl font-bold text-emerald-700 dark:text-emerald-200 sm:text-3xl" dir="rtl">{d.ar}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-300">{d.bn}</p>

      <button onClick={tap} className="mx-auto mt-8 flex h-44 w-44 flex-col items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 transition active:scale-95">
        <Heart size={30} />
        <span className="mt-1 text-4xl font-bold">{bn(todayCount)}</span>
        <span className="text-xs text-emerald-100">আজকের দুরূদ</span>
      </button>
      <p className="mt-4 text-sm text-slate-500">মোট: <b>{bn(state.total)}</b></p>
      <button onClick={() => { if (window.confirm('আজকের গণনা শূন্য করবেন?')) setState((s) => ({ total: s.total - todayCount, days: { ...s.days, [today()]: 0 } })); }} className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><RotateCcw size={12} /> আজকের গণনা রিসেট</button>
    </div>
  );
}
