import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RotateCcw, ChevronRight, PartyPopper } from 'lucide-react';
import { shuffleSeed } from './shuffle';
import { bn } from './questions';
import { addQuizAnswer } from './points';

const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];

// একবারে একটি প্রশ্ন; উত্তর দিলেই সঠিক উত্তর ও ব্যাখ্যা দেখায়
// স্কোর অনুযায়ী অভিনন্দন-বাণী
const messageFor = (pct) => {
  if (pct === 100) return 'মাশা আল্লাহ! পূর্ণ নম্বর। আল্লাহ আপনার ইলমে বরকত দিন।';
  if (pct >= 80) return 'চমৎকার! খুব ভালো করেছেন।';
  if (pct >= 60) return 'ভালো হয়েছে, এভাবেই এগিয়ে চলুন।';
  return 'উৎসাহ হারাবেন না। লেখাটা আরেকবার পড়ে আবার চেষ্টা করলে আরও ভালো হবে।';
};

// celebrate: পর্বের কুইজ শেষে "পর্ব সম্পন্ন" অভিনন্দন; nextHref: পরের পর্বে যাওয়ার লিংক
export default function Quiz({ questions, onFinish, previous, onRetry, onClose, title = 'পাঠ-কুইজ', celebrate = false, nextHref = null }) {
  const [picked, setPicked] = useState({}); // qIndex -> option index (মূল ক্রম)
  const [idx, setIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [gain, setGain] = useState({}); // qIndex -> পাওয়া XP
  const total = questions.length;
  const score = questions.reduce((a, q, i) => a + (picked[i] === q.answer ? 1 : 0), 0);
  const finished = idx >= total;
  const q = questions[idx];
  const sel = picked[idx];
  const pct = total ? Math.round((score / total) * 100) : 0;

  // ভালো স্কোরে কনফেটি
  useEffect(() => {
    if (!finished || pct < 60) return;
    try {
      confetti({ particleCount: pct === 100 ? 160 : 90, spread: 75, origin: { y: 0.55 }, zIndex: 200 });
      if (pct === 100) setTimeout(() => confetti({ particleCount: 90, spread: 100, origin: { x: 0.15, y: 0.6 }, zIndex: 200 }), 350);
    } catch { /* ইফেক্ট না চললে সমস্যা নেই */ }
  }, [finished, pct]);

  const choose = (oi) => {
    if (sel !== undefined) return;
    const next = { ...picked, [idx]: oi };
    setPicked(next);
    setGain((g) => ({ ...g, [idx]: addQuizAnswer(oi === q.answer) }));
    if (idx === total - 1) {
      const s = questions.reduce((a, qq, i) => a + (next[i] === qq.answer ? 1 : 0), 0);
      onFinish?.(s, total);
    }
  };

  const retry = () => {
    if (onRetry) { onRetry(); return; }
    setPicked({}); setGain({}); setIdx(0); setRound((r) => r + 1);
  };

  if (finished) {
    return (
      <section className="mt-2 text-center">
        <div className="rounded-2xl bg-emerald-600 p-6 text-white">
          {celebrate && <PartyPopper size={38} className="mx-auto mb-1 text-amber-300" />}
          <p className="text-lg font-extrabold">{celebrate ? 'অভিনন্দন! পর্ব সম্পন্ন' : 'আপনার ফল'}</p>
          <p className="mt-1 text-4xl font-extrabold">{bn(score)}/{bn(total)}</p>
          <p className="mt-0.5 text-sm font-bold opacity-90">{bn(pct)}%</p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-emerald-50">{messageFor(pct)}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {celebrate && nextHref && (
              <a href={nextHref} onClick={() => onClose?.()} className="inline-flex items-center gap-1 rounded-full bg-white px-5 py-2 text-sm font-extrabold text-emerald-700">পরের পর্বে যান <ChevronRight size={16} /></a>
            )}
            <button onClick={retry} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
              <RotateCcw size={16} /> আবার চেষ্টা করুন
            </button>
            {onClose && <button onClick={onClose} className={celebrate && nextHref ? 'rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25' : 'rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700'}>বন্ধ করুন</button>}
          </div>
        </div>
      </section>
    );
  }

  const order = shuffleSeed(q.options.map((_, i) => i), `${q.q}${round}`);

  return (
    <section key={round}>
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <h2 className="font-bold text-emerald-700 dark:text-emerald-200">{title}</h2>
          <span className="text-slate-500 dark:text-slate-400">
            {bn(idx + 1)}/{bn(total)}
            {previous && idx === 0 && sel === undefined ? ` · আগের ফল ${bn(previous.score)}/${bn(previous.total)}` : ''}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(idx / total) * 100}%` }} />
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:p-5">
        {q.from && (q.darsId ? (
          <button type="button" onClick={() => { onClose?.(); window.dispatchEvent(new CustomEvent('sirat_goto_dars', { detail: q.darsId })); }} className="mb-2 text-left text-[11px] font-bold text-emerald-700 underline decoration-dotted underline-offset-2 dark:text-emerald-300">{q.from} ↗</button>
        ) : <p className="mb-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">{q.from}</p>)}
        <p translate="no" className="mb-3 font-semibold leading-relaxed">{q.q}</p>
        <div className="grid gap-2">
          {order.map((oi, pos) => {
            const isAns = oi === q.answer;
            const isSel = sel === oi;
            let cls = 'border-slate-200 dark:border-white/10 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-white/5';
            if (sel !== undefined) {
              if (isAns) cls = 'border-[#10b981] bg-[#10b981]/15';
              else if (isSel) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-500/15';
              else cls = 'border-slate-200 dark:border-white/10 opacity-60';
            }
            return (
              <button key={oi} disabled={sel !== undefined} onClick={() => choose(oi)} className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition ${cls}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-white/10 text-xs font-bold text-emerald-700 dark:text-emerald-200">{LETTERS[pos]}</span>
                <span translate="no" className="flex-1">{q.options[oi]}</span>
                {sel !== undefined && isAns && <CheckCircle2 className="shrink-0 text-[#10b981]" size={20} />}
                {sel !== undefined && isSel && !isAns && <XCircle className="shrink-0 text-rose-600" size={20} />}
              </button>
            );
          })}
        </div>
        {sel !== undefined && <p className="mt-3 text-sm font-extrabold text-amber-500">+{bn(gain[idx])} XP</p>}
        {sel !== undefined && q.explain && (
          <p className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <strong className="text-emerald-700 dark:text-emerald-200">ব্যাখ্যা: </strong>
            <span translate="no">{q.explain}</span>
          </p>
        )}
      </div>
      {sel !== undefined && (
        <button onClick={() => setIdx(idx + 1)} className="mt-4 ml-auto flex items-center gap-1 rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white">
          {idx === total - 1 ? 'ফল দেখুন' : 'পরের প্রশ্ন'} <ChevronRight size={18} />
        </button>
      )}
    </section>
  );
}
