import { useEffect, useMemo } from 'react';
import { Bookmark, StickyNote, Trash2, X } from 'lucide-react';
import index from '../data/darsIndex.json';
import { bn } from './questions';
import { useNotes, saveNote, toggleBookmark } from './notes';

// "আমার নোট ও বুকমার্ক": সব দারসের সংরক্ষিত অনুচ্ছেদ, চাপলে সেই জায়গায় যায়
export default function NotesModal({ onClose }) {
  const notes = useNotes();
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const groups = useMemo(() => {
    const map = {};
    Object.values(notes).forEach((n) => {
      const k = `${n.dars}-${n.porbo}`;
      (map[k] ||= { dars: n.dars, porbo: n.porbo, rows: [] }).rows.push(n);
    });
    return Object.values(map)
      .sort((a, b) => a.dars - b.dars || a.porbo - b.porbo)
      .map((g) => ({ ...g, rows: g.rows.sort((a, b) => a.block - b.block) }));
  }, [notes]);

  const count = Object.keys(notes).length;
  const go = (n) => {
    onClose();
    window.dispatchEvent(new CustomEvent('sirat_goto_porbo', { detail: { dars: n.dars, porbo: n.porbo, block: n.block } }));
  };
  const titleOf = (id) => index.find((d) => d.id === id);

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl border border-amber-300/40 bg-slate-50 shadow-2xl dark:bg-slate-900 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="inline-flex items-center gap-2 text-base font-black text-slate-800 dark:text-white"><Bookmark size={18} className="fill-amber-400 text-amber-500" /> নোট ও বুকমার্ক <span className="text-xs font-bold text-slate-400">({bn(count)})</span></h2>
          <button onClick={onClose} aria-label="বন্ধ" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {groups.length === 0 ? (
            <div className="py-12 text-center">
              <StickyNote size={34} className="mx-auto text-amber-500" />
              <p className="mt-3 text-sm font-bold">এখনো কিছু সংরক্ষণ করেননি</p>
              <p className="mt-1 text-xs text-slate-500">দারসের লেখা পড়ার সময় প্রতিটি অনুচ্ছেদের নিচের বুকমার্ক বা নোট বাটন চাপুন।</p>
            </div>
          ) : groups.map((g) => {
            const d = titleOf(g.dars);
            return (
              <section key={`${g.dars}-${g.porbo}`} className="mb-4">
                <h3 className="mb-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300">দারস {bn(d?.number ?? g.dars)}{d ? `: ${d.title}` : ''} • পর্ব {bn(g.porbo)}</h3>
                <ul className="space-y-2">
                  {g.rows.map((n) => (
                    <li key={n.block} className="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-white/10 dark:bg-white/5">
                      <button type="button" onClick={() => go(n)} className="block w-full text-left">
                        <p translate="no" className={`line-clamp-3 text-sm leading-relaxed ${n.bookmark ? 'border-l-4 border-amber-400 pl-2' : ''}`}>{n.snippet}</p>
                      </button>
                      {n.note && <p translate="no" className="mt-1.5 whitespace-pre-wrap break-words rounded-lg bg-amber-400/10 px-2 py-1.5 text-xs">{n.note}</p>}
                      <div className="mt-1.5 flex items-center justify-between">
                        <button type="button" onClick={() => go(n)} className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">সেখানে যান ↗</button>
                        <div className="flex gap-1">
                          {n.bookmark && <button type="button" onClick={() => toggleBookmark(n)} aria-label="বুকমার্ক সরান" title="বুকমার্ক সরান" className="rounded-full p-1 text-amber-500 hover:bg-slate-100 dark:hover:bg-white/10"><Bookmark size={14} className="fill-amber-400" /></button>}
                          {n.note && <button type="button" onClick={() => saveNote(n, '')} aria-label="নোট মুছুন" title="নোট মুছুন" className="rounded-full p-1 text-rose-500 hover:bg-slate-100 dark:hover:bg-white/10"><Trash2 size={14} /></button>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
