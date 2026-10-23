import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { loadDars } from '../data/loadDars';
import { bn, pickQuiz } from './questions';
import Quiz from './Quiz';

// দারস-পথের কুইজ-পপআপ: পর্বের প্রশ্ন থেকে সর্বোচ্চ ২০টি, একটি একটি করে
export default function QuizModal({ id, no, progress, onClose }) {
  const [dars, setDars] = useState(null);
  const [qs, setQs] = useState([]);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    loadDars(id).then((d) => {
      if (!live) return;
      setDars(d || false);
      if (d) setQs(pickQuiz(d.porbos[no - 1].quiz));
    });
    return () => { live = false; };
  }, [id, no]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const retry = () => {
    setQs(pickQuiz(dars.porbos[no - 1].quiz));
    setAttempt((a) => a + 1);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-emerald-300/40 bg-slate-50 p-4 shadow-2xl dark:bg-slate-900 sm:rounded-3xl sm:p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">{dars ? `দারস ${bn(dars.number)} · ${dars.title}` : ''}</p>
          <button onClick={onClose} aria-label="বন্ধ" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10"><X size={20} /></button>
        </div>
        {dars === null && <p className="py-10 text-center text-slate-500">লোড হচ্ছে…</p>}
        {dars === false && <p className="py-10 text-center text-slate-500">কুইজ পাওয়া যায়নি।</p>}
        {dars && qs.length > 0 && (
          <Quiz
            key={attempt}
            questions={qs}
            previous={progress.scores[`${id}-${no}`]}
            onRetry={retry}
            onClose={onClose}
            onFinish={(s, t) => { progress.saveScore(id, no, s, t); progress.markDone(id, no); }}
          />
        )}
      </div>
    </div>
  );
}
