import { useMemo, useState } from 'react';
import { Bookmark, Pencil, StickyNote, Trash2 } from 'lucide-react';
import { noteKey, saveNote, toggleBookmark, useNotes } from './notes';

// একটি অনুচ্ছেদের চারপাশে বুকমার্ক ও নোটের বাটন; বুকমার্ক করা অনুচ্ছেদে সোনালি দাগ, নোট নিচে দেখায়
export default function NoteWrap({ b, idx, dars, porbo, children }) {
  const notes = useNotes();
  const n = notes[noteKey(dars, porbo, idx)];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const text = useMemo(() => (b.runs || []).map((r) => r.t || '').join(''), [b]);
  if (!text.trim()) return children;
  const meta = { dars, porbo, block: idx, snippet: text };

  const openEditor = () => { setDraft(n?.note || ''); setEditing(true); };
  const save = () => { saveNote(meta, draft); setEditing(false); };

  return (
    <div id={`blk-${idx}`} className={`group relative rounded-lg transition-colors ${n?.bookmark ? 'border-l-4 border-amber-400 bg-amber-400/5 pl-3' : ''}`}>
      {children}
      <div translate="yes" className="mt-1 flex justify-end gap-1 opacity-60 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <button type="button" onClick={() => toggleBookmark(meta)} aria-label={n?.bookmark ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'} title={n?.bookmark ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
          <Bookmark size={15} className={n?.bookmark ? 'fill-amber-400 text-amber-500' : ''} />
        </button>
        <button type="button" onClick={openEditor} aria-label="নোট লিখুন" title="নোট লিখুন" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10">
          <StickyNote size={15} className={n?.note ? 'text-amber-500' : ''} />
        </button>
      </div>

      {n?.note && !editing && (
        <div translate="yes" className="mt-1 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm">
          <StickyNote size={15} className="mt-0.5 shrink-0 text-amber-500" />
          <p translate="no" className="min-w-0 flex-1 whitespace-pre-wrap break-words">{n.note}</p>
          <button type="button" onClick={openEditor} aria-label="নোট সম্পাদনা" className="shrink-0 rounded-full p-1 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10"><Pencil size={13} /></button>
          <button type="button" onClick={() => saveNote(meta, '')} aria-label="নোট মুছুন" className="shrink-0 rounded-full p-1 text-rose-500 hover:bg-black/5 dark:hover:bg-white/10"><Trash2 size={13} /></button>
        </div>
      )}

      {editing && (
        <div translate="yes" className="mt-1 rounded-xl border border-amber-400/50 bg-white p-2 dark:bg-slate-900">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="এই অনুচ্ছেদ নিয়ে আপনার নোট…"
            className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm outline-none focus:border-amber-400 dark:border-white/10 dark:bg-slate-800"
          />
          <div className="mt-1.5 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="rounded-full px-3 py-1 text-xs font-semibold text-slate-500">বাতিল</button>
            <button type="button" onClick={save} className="rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-white">সংরক্ষণ</button>
          </div>
        </div>
      )}
    </div>
  );
}
