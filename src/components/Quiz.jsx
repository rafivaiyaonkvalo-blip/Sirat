import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { shuffleSeed } from '../utils/shuffle';

const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];

export default function Quiz({ questions, onFinish, previous }) {
  const [picked, setPicked] = useState({}); // qIndex -> option index (মূল ক্রম)
  const [round, setRound] = useState(0);
  const answered = Object.keys(picked).length;
  const score = questions.reduce((a, q, i) => a + (picked[i] === q.answer ? 1 : 0), 0);
  const finished = answered === questions.length;

  const choose = (qi, oi) => {
    if (picked[qi] !== undefined) return;
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    if (Object.keys(next).length === questions.length) {
      const s = questions.reduce((a, q, i) => a + (next[i] === q.answer ? 1 : 0), 0);
      onFinish?.(s, questions.length);
    }
  };

  return (
    <section className="mt-10" key={round}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-700 dark:text-brand-200">পর্ব-কুইজ</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {answered}/{questions.length}
          {previous && !answered ? ` · আগের ফল ${previous.score}/${previous.total}` : ''}
        </span>
      </div>
      <div className="space-y-5">
        {questions.map((q, qi) => {
          const order = shuffleSeed(q.options.map((_, i) => i), `${q.q}${round}`);
          const sel = picked[qi];
          return (
            <div key={qi} className="rounded-2xl border border-brand-100 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:p-5">
              <p className="mb-3 font-semibold leading-relaxed">
                <span className="text-brand-600 dark:text-brand-400">{qi + 1}.</span> {q.q}
              </p>
              <div className="grid gap-2">
                {order.map((oi, pos) => {
                  const isAns = oi === q.answer;
                  const isSel = sel === oi;
                  let cls = 'border-slate-200 dark:border-white/10 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-white/5';
                  if (sel !== undefined) {
                    if (isAns) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15';
                    else if (isSel) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-500/15';
                    else cls = 'border-slate-200 dark:border-white/10 opacity-60';
                  }
                  return (
                    <button key={oi} disabled={sel !== undefined} onClick={() => choose(qi, oi)} className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition ${cls}`}>
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-white/10 text-xs font-bold text-brand-700 dark:text-brand-200">{LETTERS[pos]}</span>
                      <span className="flex-1">{q.options[oi]}</span>
                      {sel !== undefined && isAns && <CheckCircle2 className="shrink-0 text-emerald-600" size={20} />}
                      {sel !== undefined && isSel && !isAns && <XCircle className="shrink-0 text-rose-600" size={20} />}
                    </button>
                  );
                })}
              </div>
              {sel !== undefined && q.explain && (
                <p className="mt-3 rounded-lg bg-brand-50 dark:bg-brand-900/30 px-3 py-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  <strong className="text-brand-700 dark:text-brand-200">ব্যাখ্যা: </strong>
                  {q.explain}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {finished && (
        <div className="mt-6 rounded-2xl bg-brand-600 p-5 text-center text-white">
          <p className="text-lg font-bold">আপনার ফল: {score}/{questions.length}</p>
          <button onClick={() => { setPicked({}); setRound((r) => r + 1); }} className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
            <RotateCcw size={16} /> আবার চেষ্টা করুন
          </button>
        </div>
      )}
    </section>
  );
}
