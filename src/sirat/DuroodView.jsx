import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Flame, Globe, Heart, Plus, RotateCcw, Share2, Trophy, Users, Zap } from 'lucide-react';
import { campaign } from './brand';
import { bn } from './questions';
import { auth } from '../services/firebase';
import { isSuperUser } from '../utils/superUser';
import { t } from '../i18n';
import { POINTS, addDurood, creditReferrer, ensureRefDoc, getMyCode, getPoints, refreshOwn, referralLink } from './points';
import { addToGlobal, cloudEnabled, countryFlag, countryName, detectCountry, subscribeGlobal, resetGlobalDurood } from './duroodCloud';

const DUROODS = [
  { id: 'short', name: 'সংক্ষিপ্ত দুরূদ', ar: 'صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ', bn: 'আল্লাহ তাঁর ওপর রহমত ও শান্তি বর্ষণ করুন।' },
  { id: 'salam', name: 'দুরূদ ও সালাম', ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ', bn: 'হে আল্লাহ, আমাদের নবী মুহাম্মাদের ওপর রহমত ও শান্তি বর্ষণ করুন।' },
  { id: 'ibrahim', name: 'দুরূদে ইবরাহীম', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ', bn: 'নামাযে পঠিত দুরূদ।' },
];

const KEY = 'sirat_durood_v1';
const JOINED_KEY = 'sirat_durood_joined';
const RESET_VER_KEY = 'sirat_durood_reset_v4';
const BEAD = 33;
const day = (d) => d.toISOString().slice(0, 10);
const today = () => day(new Date());

const load = () => {
  try {
    // ইউজারের অনুরোধে নতুন ভার্সন লোডে একবার স্বয়ংক্রিয়ভাবে কাউন্টার রিসেট করা
    if (!localStorage.getItem(RESET_VER_KEY)) {
      localStorage.setItem(RESET_VER_KEY, '1');
      localStorage.setItem(KEY, JSON.stringify({ total: 0, days: {} }));
      const ptsRaw = localStorage.getItem('sirat_points_v1');
      if (ptsRaw) {
        const p = JSON.parse(ptsRaw);
        p.durood = 0;
        p.pend = { ...(p.pend || {}), durood: 0 };
        localStorage.setItem('sirat_points_v1', JSON.stringify(p));
      }
      return { total: 0, days: {} };
    }
    return JSON.parse(localStorage.getItem(KEY)) || { total: 0, days: {} };
  } catch {
    return { total: 0, days: {} };
  }
};
const wasJoined = () => { try { return localStorage.getItem(JOINED_KEY) === '1'; } catch { return false; } };

// টানা কত দিন (আজ বা গতকাল পর্যন্ত) দুরূদ পড়া হয়েছে
const streakOf = (days) => {
  const d = new Date();
  if (!days[day(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days[day(d)] > 0) { n += 1; d.setDate(d.getDate() - 1); }
  return n;
};

const FAQ = [
  { q: 'এই ক্যাম্পেইনের উদ্দেশ্য কী?', a: 'সবাই মিলে নবীজী ﷺ-এর ওপর দুরূদ পাঠ করা এবং নিয়মিত দুরূদ পড়ার অভ্যাস গড়ে তোলা। প্রতিটি পাঠ সম্মিলিত গণনায় যোগ হয়।' },
  { q: 'লক্ষ্যমাত্রা কেন নির্ধারণ করা হলো?', a: 'লক্ষ্যমাত্রা কেবল সবাইকে উৎসাহ দেওয়ার জন্য। একজনকে পুরো লক্ষ্য পূরণ করতে হয় না; যে যতটুকু পারেন, ততটুকুই যথেষ্ট।' },
  { q: 'আমার পাঠ গণনায় কীভাবে যোগ করব?', a: 'দুরূদ পড়ে একবার বড় বোতামে চাপ দিন। আগেই পড়ে থাকলে ১০, ৩৩ বা ১০০ একসাথে যোগ করতে পারেন।' },
  { q: 'দুরূদের ফযীলত কী?', a: 'হাদীসে এসেছে, নবীজী ﷺ বলেছেন: “যে ব্যক্তি আমার ওপর একবার দুরূদ পাঠ করে, আল্লাহ তার ওপর দশবার রহমত বর্ষণ করেন।” (সহীহ মুসলিম, ৪০৮)', ar: 'مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا' },
  { q: 'আমার কোন তথ্য জমা হয়?', a: 'শুধু দুরূদের সংখ্যা ও আনুমানিক দেশ জমা হয়। নাম, ইমেইল বা ব্যক্তিগত কোনো তথ্য নেওয়া হয় না।' },
];

function BeadRing({ filled }) {
  const beads = useMemo(() => Array.from({ length: BEAD }, (_, i) => {
    const a = (i / BEAD) * 2 * Math.PI - Math.PI / 2;
    return { x: 50 + 46 * Math.cos(a), y: 50 + 46 * Math.sin(a) };
  }), []);
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {beads.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r="2.3" className={i < filled ? 'fill-emerald-500 transition-colors' : 'fill-slate-300 dark:fill-white/20'} />)}
    </svg>
  );
}

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
  const newPartRef = useRef(false);
  const sentSinceRef = useRef(0);
  const country = useMemo(() => detectCountry(), []);
  const flush = useCallback(async () => {
    if (flushing.current || !pendingRef.current) return;
    flushing.current = true;
    try {
      const sent = await addToGlobal(pendingRef.current, { country, newParticipant: newPartRef.current });
      pendingRef.current -= sent;
      sentSinceRef.current += sent;
      if (sent) creditReferrer(sent);
      if (newPartRef.current && sent) { newPartRef.current = false; try { localStorage.setItem(JOINED_KEY, '1'); } catch { /* ignore */ } }
      setPending(pendingRef.current);
    } catch { /* অফলাইন: পরের ফ্লাশে আবার চেষ্টা */ }
    flushing.current = false;
  }, [country]);
  useEffect(() => {
    if (!cloudEnabled()) return undefined;
    const unsub = subscribeGlobal(setRemote);
    const timer = setInterval(flush, 4000);
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    return () => { unsub(); clearInterval(timer); document.removeEventListener('visibilitychange', onHide); flush(); };
  }, [flush]);

  // ভেসে ওঠা "+N": নিজের চাপ ও অন্যদের যোগ হওয়া দুরূদ
  const [bubbles, setBubbles] = useState([]);
  const bubbleId = useRef(0);
  const spawn = useCallback((text, own) => {
    const id = (bubbleId.current += 1);
    setBubbles((b) => [...b.slice(-12), { id, text, own, left: 12 + Math.random() * 76 }]);
    setTimeout(() => setBubbles((b) => b.filter((x) => x.id !== id)), 2600);
  }, []);
  const prevRemote = useRef(null);
  useEffect(() => {
    if (!remote) return;
    if (prevRemote.current !== null) {
      const others = remote.count - prevRemote.current - sentSinceRef.current;
      if (others > 0) spawn(`🌍 +${bn(others)}`, false);
    }
    sentSinceRef.current = 0;
    prevRemote.current = remote.count;
  }, [remote, spawn]);

  const add = (n) => {
    if (navigator.vibrate) navigator.vibrate(n === 1 ? 8 : 20);
    if (cloudEnabled()) {
      pendingRef.current += n;
      setPending(pendingRef.current);
      if (!wasJoined()) newPartRef.current = true;
    }
    spawn(`+${bn(n)}`, true);
    addDurood(n);
    setState((s) => ({ total: s.total + n, days: { ...s.days, [today()]: (s.days[today()] || 0) + n } }));
  };
  const [pts, setPts] = useState(getPoints);
  const [me, setMe] = useState(auth?.currentUser || null);
  useEffect(() => {
    const sync = () => setPts(getPoints());
    window.addEventListener('sirat_points_changed', sync);
    const off = auth ? auth.onAuthStateChanged((u) => { setMe(u); refreshOwn(); }) : null;
    return () => { window.removeEventListener('sirat_points_changed', sync); if (off) off(); };
  }, []);
  const myLink = referralLink(getMyCode());
  useEffect(() => { ensureRefDoc().then(refreshOwn); }, []);
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: campaign.title, text: 'আমার লিংকে এসে দুরূদ পাঠ করুন:', url: myLink }); return; }
      await navigator.clipboard.writeText(myLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ইউজার বাতিল করেছেন */ }
  };
  const todayCount = state.days[today()] || 0;
  const filled = state.total % BEAD;
  const cycles = Math.floor(state.total / BEAD);
  const streak = streakOf(state.days);
  const hasGlobal = remote !== null;
  const globalCount = hasGlobal ? remote.count + pending : 0;
  const target = (hasGlobal && remote.target) || campaign.target;
  const pct = hasGlobal ? Math.min(100, (globalCount / target) * 100) : 0;
  const daysLeft = campaign.endDate ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / 86400000)) : null;
  const topCountries = hasGlobal ? Object.entries(remote.countries).sort((a, b) => b[1] - a[1]).slice(0, 6) : [];

  const resetToday = () => {
    if (window.confirm('আজকের দুরূদ কাউন্টার শূন্য (০) করতে চান?')) {
      setState((s) => ({
        total: Math.max(0, s.total - todayCount),
        days: { ...s.days, [today()]: 0 }
      }));
    }
  };

  const resetAll = () => {
    if (window.confirm('আপনার মোট ও আজকের দুরূদ কাউন্টার সম্পূর্ণ শূন্য (০) করতে চান?')) {
      setState({ total: 0, days: {} });
      try {
        localStorage.setItem(KEY, JSON.stringify({ total: 0, days: {} }));
        const ptsRaw = localStorage.getItem('sirat_points_v1');
        if (ptsRaw) {
          const p = JSON.parse(ptsRaw);
          p.durood = 0;
          p.pend = { ...(p.pend || {}), durood: 0 };
          localStorage.setItem('sirat_points_v1', JSON.stringify(p));
          window.dispatchEvent(new CustomEvent('sirat_points_changed'));
        }
      } catch {}
    }
  };

  const handleResetGlobal = async () => {
    if (window.confirm('⚠️ আপনি কি নিশ্চিত যে পুরো ওয়েবসাইটের সম্মিলিত গ্লোবাল দুরূদ ক্যাম্পেইন কাউন্টার ০ করতে চান?')) {
      const ok = await resetGlobalDurood();
      if (ok) alert('গ্লোবাল ক্যাম্পেইন কাউন্টার সফলভাবে রিসেট করা হয়েছে।');
      else alert('রিসেট করতে ব্যর্থ হয়েছে। অনুমতি চেক করুন।');
    }
  };

  const [shareMsg, setShareMsg] = useState('');
  const share = async () => {
    const url = myLink;
    const text = `${campaign.title}: নবীজী ﷺ-এর ওপর দুরূদ পাঠ করি, সবাই মিলে।`;
    try {
      if (navigator.share) { await navigator.share({ title: campaign.title, text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareMsg('লিংক কপি হয়েছে');
    } catch { setShareMsg('শেয়ার করা যায়নি'); }
    setTimeout(() => setShareMsg(''), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">দুরূদ</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{campaign.title}: নবীজী ﷺ-এর ওপর দুরূদ পাঠ করি, সবাই মিলে।</p>
      <p className="font-arabic mt-2 text-lg font-bold text-emerald-700 dark:text-emerald-200 sm:text-xl" dir="rtl">بَيْنَكَ أَنْتَ وَبَيْنَ اللَّهِ</p>

      <div className="mt-5 rounded-2xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-left">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5">{hasGlobal && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>}{hasGlobal ? 'লাইভ সম্মিলিত দুরূদ' : 'ক্যাম্পেইন লক্ষ্য'}</span>
          <span>{bn(target)}</span>
        </div>
        {hasGlobal && <p className="mt-1 text-3xl font-extrabold tabular-nums text-emerald-700 dark:text-emerald-200">{bn(globalCount)}</p>}
        <div className="mt-2 h-3 rounded-full bg-emerald-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-500 progress-fill" style={{ width: `${pct}%` }} /></div>
        <p className="mt-2 text-xs text-slate-500">{hasGlobal ? `লক্ষ্যের ${bn(pct.toFixed(1))}% পূর্ণ • বাকি ${bn(Math.max(0, target - globalCount))}` : 'সম্মিলিত গণনা শিগগিরই চালু হবে, ইন শা আল্লাহ। আপাতত আপনার নিজের গণনা চলবে।'}</p>
        {hasGlobal && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-emerald-50 dark:bg-white/5 px-3 py-2"><Users size={16} className="mx-auto text-emerald-600" /><p className="mt-0.5 text-lg font-bold">{bn(remote.participants)}</p><p className="text-[11px] text-slate-500">অংশগ্রহণকারী</p></div>
            <div className="rounded-xl bg-emerald-50 dark:bg-white/5 px-3 py-2"><Globe size={16} className="mx-auto text-emerald-600" /><p className="mt-0.5 text-lg font-bold">{daysLeft !== null ? bn(daysLeft) : bn(Object.keys(remote.countries).length)}</p><p className="text-[11px] text-slate-500">{daysLeft !== null ? 'দিন বাকি' : 'দেশ থেকে'}</p></div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {DUROODS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${sel === x.id ? 'bg-emerald-600 text-white' : 'border border-emerald-200 dark:border-white/20'}`}>{x.name}</button>
        ))}
      </div>

      <p className="font-arabic mt-6 text-2xl font-bold text-emerald-700 dark:text-emerald-200 sm:text-3xl" dir="rtl">{d.ar}</p>
      <p className="mt-1 text-slate-600 dark:text-slate-300">{d.bn}</p>

      {/* তাসবীহ: ৩৩ দানার বৃত্ত; চাপলে দানা ভরে, ৩৩ হলে এক চক্র */}
      <div className="relative mx-auto mt-8 h-64 w-64">
        <BeadRing filled={filled} />
        <button onClick={() => add(1)} aria-label="দুরূদ গণনা" className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 transition active:scale-95">
          <Heart size={28} />
          <span className="mt-1 text-4xl font-bold">{bn(todayCount)}</span>
          <span className="text-xs text-emerald-100">আজকের দুরূদ</span>
        </button>
        <div className="pointer-events-none absolute inset-x-0 -top-2 h-0">
          {bubbles.map((b) => (
            <span key={b.id} className={`durood-bubble absolute whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold shadow ${b.own ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-100'}`} style={{ left: `${b.left}%` }}>{b.text}</span>
          ))}
        </div>
      </div>
      <p className="mt-1 text-sm text-slate-500">{bn(filled)} / {bn(BEAD)} • {bn(cycles)} চক্র সম্পন্ন</p>

      {/* কাউন্টার রিসেট বোতামসমূহ */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={resetToday}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs active:scale-95"
          title="আজকের গণনা রিসেট করুন"
        >
          <RotateCcw size={13} className="text-amber-500" />
          <span>কাউন্টার রিসেট (০)</span>
        </button>
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/40 px-4 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-300 transition cursor-pointer shadow-xs active:scale-95"
          title="সব গণনা সম্পূর্ণ রিসেট করুন"
        >
          <RotateCcw size={13} className="text-rose-500" />
          <span>সব রিসেট</span>
        </button>
      </div>
      {isSuperUser(me) && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={handleResetGlobal}
            className="text-[11px] font-bold text-rose-500 hover:text-rose-700 underline cursor-pointer"
          >
            🛡️ অ্যাডমিন: গ্লোবাল ক্যাম্পেইন কাউন্টার রিসেট
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-500">আগে পড়েছেন? যোগ করুন:</span>
        {[10, 33, 100].map((n) => (
          <button key={n} onClick={() => add(n)} className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 dark:border-white/20 px-3 py-1 text-sm font-bold hover:bg-emerald-50 dark:hover:bg-white/10"><Plus size={13} />{bn(n)}</button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-2"><p className="text-xl font-bold">{bn(todayCount)}</p><p className="text-[11px] text-slate-500">আজ</p></div>
        <div className="rounded-xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-2"><p className="text-xl font-bold">{bn(state.total)}</p><p className="text-[11px] text-slate-500">মোট</p></div>
        <div className="rounded-xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-2"><p className="inline-flex items-center gap-1 text-xl font-bold"><Flame size={16} className="text-orange-500" />{bn(streak)}</p><p className="text-[11px] text-slate-500">টানা দিন</p></div>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-bold"><Zap size={16} className="text-amber-500" /> আপনার XP: {bn(pts.xp)}</h2>
          <button onClick={() => window.dispatchEvent(new CustomEvent('uls_open_leaderboard'))} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1 text-xs font-bold dark:border-white/20"><Trophy size={13} /> লিডারবোর্ড</button>
        </div>
        <p className="mt-1 text-xs text-slate-500">প্রতিটি দুরূদ পাঠে +১০ XP এবং কুইজ ও অনুশীলনে অতিরিক্ত XP অর্জন করা যায়।</p>
        <div className="mt-3">
          <p className="text-sm font-semibold">আপনার রেফারেল লিংক {!me && <span className="text-[11px] font-normal text-slate-500">(লগইন ছাড়াই)</span>}</p>
          <div className="mt-1 flex items-center gap-2">
            <input readOnly value={myLink} onFocus={(e) => e.target.select()} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs dark:border-white/10 dark:bg-slate-900" />
            <button onClick={copyLink} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"><Copy size={13} /> {copied ? 'কপি হয়েছে' : 'কপি / শেয়ার'}</button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">এই লিংকে যাঁরা ওয়েবসাইটে এসে দুরূদ পড়বেন, তাঁদের দুরূদ আপনার হিসাবে জমা হবে।</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-emerald-50 px-2 py-2 dark:bg-white/5"><p className="text-lg font-bold">{bn(pts.referredPeople)}</p><p className="text-[11px] text-slate-500">আপনার লিংকে এসেছেন</p></div>
            <div className="rounded-xl bg-emerald-50 px-2 py-2 dark:bg-white/5"><p className="text-lg font-bold">{bn(pts.referred)}</p><p className="text-[11px] text-slate-500">তাঁদের পড়া দুরূদ (আপনার হিসাবে জমা)</p></div>
          </div>
          {!me && (
            <div className="mt-3 rounded-xl bg-emerald-50 p-3 dark:bg-white/5">
              <p className="text-sm">লিডারবোর্ডে আপনার নাম আসতে লগইন করুন। লগইনের পর আপনার এই লিংক ও আজ পর্যন্ত জমা সব সংখ্যা অ্যাকাউন্টে যোগ হবে।</p>
              <button onClick={() => window.dispatchEvent(new CustomEvent('sirat_open_auth'))} className="mt-2 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white">লগইন করুন</button>
            </div>
          )}
        </div>
      </div>

      {topCountries.length > 0 && (
        <div className="mt-6 rounded-2xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-left">
          <h2 className="mb-2 text-sm font-bold">দেশ অনুযায়ী দুরূদ</h2>
          <ol className="space-y-1.5">
            {topCountries.map(([cc, n], i) => (
              <li key={cc} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${cc === country ? 'bg-emerald-50 dark:bg-white/10 font-bold' : ''}`}>
                <span className="w-5 text-xs text-slate-400">{bn(i + 1)}</span>
                <span>{countryFlag(cc)}</span>
                <span className="flex-1">{countryName(cc)}{cc === country && <span className="ml-1 text-[11px] text-emerald-600">(আপনার দেশ)</span>}</span>
                <span className="font-semibold tabular-nums">{bn(n)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-6">
        <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md active:scale-95"><Share2 size={16} /> বন্ধু-পরিজনকে আমন্ত্রণ জানান</button>
        <p className="mt-2 text-xs text-slate-500">{shareMsg || 'আপনার আমন্ত্রণে আরেকজন দুরূদ পাঠের সুযোগ পেতে পারেন।'}</p>
      </div>

      <div className="mt-8 space-y-2 text-left">
        <h2 className="text-sm font-bold">সচরাচর জিজ্ঞাসা</h2>
        {FAQ.map((f) => (
          <details key={f.q} className="group rounded-xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5">
            <summary className="cursor-pointer list-none text-sm font-semibold">{f.q}</summary>
            {f.ar && <p className="font-arabic mt-2 text-center text-xl text-emerald-700 dark:text-emerald-200" dir="rtl">{f.ar}</p>}
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{f.a}</p>
          </details>
        ))}
      </div>

      <button onClick={() => { if (window.confirm(t('আজকের গণনা শূন্য করবেন?'))) setState((s) => ({ total: s.total - todayCount, days: { ...s.days, [today()]: 0 } })); }} className="mt-6 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"><RotateCcw size={12} /> আজকের গণনা রিসেট</button>
    </div>
  );
}
