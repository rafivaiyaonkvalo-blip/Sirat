import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Bell, BellRing, ExternalLink, Sparkles, Video, Megaphone, X } from 'lucide-react';
import { fetchActiveAnnouncements } from '../services/announcementService';
import { toBengaliNumber } from '../utils/gamification';

const SEEN_KEY = 'sirat_seen_notices';
const POLL_MS = 5 * 60 * 1000;

const readSeen = () => { try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { return []; } };
const TYPE = {
  urgent: { label: 'জরুরি', icon: AlertCircle, cls: 'bg-rose-500/15 text-rose-500' },
  success: { label: 'সুসংবাদ', icon: Sparkles, cls: 'bg-emerald-500/15 text-emerald-600' },
  class: { label: 'লাইভ ক্লাস', icon: Video, cls: 'bg-purple-500/15 text-purple-500' },
  info: { label: 'ঘোষণা', icon: Megaphone, cls: 'bg-sky-500/15 text-sky-500' },
};
const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' }); } catch { return ''; }
};

// ঘণ্টা-আইকন: সব সক্রিয় ঘোষণার তালিকা, না-পড়া সংখ্যা, আর অনুমতি দিলে নতুন ঘোষণায় ব্রাউজার-নোটিফিকেশন
export default function NotificationBell() {
  const [list, setList] = useState([]);
  const [seen, setSeen] = useState(readSeen);
  const [open, setOpen] = useState(false);
  const [perm, setPerm] = useState(() => (typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'));
  const boxRef = useRef(null);
  const firstLoad = useRef(true);
  const seenRef = useRef(seen);
  seenRef.current = seen;

  const load = useCallback(async () => {
    try {
      const active = await fetchActiveAnnouncements();
      const fresh = active || [];
      if (!firstLoad.current && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const known = new Set(seenRef.current);
        fresh.filter((a) => !known.has(a.id)).slice(0, 2).forEach((a) => {
          try { new Notification(a.title || 'নতুন ঘোষণা', { body: a.message || '', icon: `${import.meta.env.BASE_URL}favicon.ico` }); } catch { /* সমর্থিত নয় */ }
        });
      }
      firstLoad.current = false;
      setList(fresh);
    } catch { /* নেটওয়ার্ক নেই */ }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, POLL_MS);
    const onFocus = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('uls_announcements_updated', load);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onFocus); window.removeEventListener('uls_announcements_updated', load); };
  }, [load]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const unread = list.filter((a) => !seen.includes(a.id)).length;
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && list.length) {
      const all = [...new Set([...seen, ...list.map((a) => a.id)])];
      setSeen(all);
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(all)); } catch { /* ignore */ }
    }
  };
  const askPermission = async () => {
    try { setPerm(await Notification.requestPermission()); } catch { /* ignore */ }
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={toggle}
        title="ঘোষণা ও নোটিফিকেশন"
        aria-label="ঘোষণা"
        className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        {unread > 0 ? <BellRing size={16} className="text-amber-500" /> : <Bell size={16} />}
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">{toBengaliNumber(unread)}</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-16 z-[90] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-80">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">ঘোষণা</h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="বন্ধ" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
          </div>

          {perm === 'default' && (
            <button type="button" onClick={askPermission} className="mb-2 w-full rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200">
              🔔 নতুন ঘোষণা এলে ব্রাউজার-নোটিফিকেশন চালু করুন
              <span className="mt-0.5 block text-[10px] font-normal text-slate-500">সাইট খোলা থাকলে দেখাবে (বন্ধ থাকলে নয়)</span>
            </button>
          )}
          {perm === 'denied' && <p className="mb-2 text-[10px] text-slate-400">ব্রাউজারে নোটিফিকেশন বন্ধ করা আছে; ব্রাউজারের সাইট-সেটিংসে চালু করতে হবে।</p>}

          {list.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">এখন কোনো নতুন ঘোষণা নেই।</p>
          ) : (
            <ul className="space-y-2">
              {list.map((a) => {
                const t = TYPE[a.type] || TYPE.info;
                const Icon = t.icon;
                return (
                  <li key={a.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${t.cls}`}><Icon size={11} /> {t.label}</span>
                      <span className="text-[10px] text-slate-400">{fmtDate(a.createdAt)}</span>
                    </div>
                    {a.title && <p className="mt-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">{a.title}</p>}
                    {a.message && <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{a.message}</p>}
                    {a.linkUrl && (
                      <a href={a.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {a.linkText || 'বিস্তারিত'} <ExternalLink size={11} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
