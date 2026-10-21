import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import DarsPicker from './DarsPicker';
import { buildQuestions, bn } from './questions';

const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];
const fmt = (s) => `${bn(String(Math.floor(s / 60)).padStart(2, '0'))}:${bn(String(s % 60).padStart(2, '0'))}`;

function Exam({ questions, onExit }) {
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(questions.length * 60);
  const [done, setDone] = useState(false);
  const submitted = useRef(false);

  useEffect(() => {
    if (done) return undefined;
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, [done]);
  useEffect(() => {
    if (left <= 0 && !submitted.current) { submitted.current = true; setDone(true); }
  }, [left]);

  const score = questions.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0);

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-emerald-900 p-6 text-center text-white">
          <p className="text-sm text-emerald-200">পরীক্ষার ফল</p>
          <p className="mt-1 text-5xl font-bold">{bn(score)}/{bn(questions.length)}</p>
          <p className="mt-1 text-emerald-100">{bn(pct)}% · সময় ব্যবহার {fmt(questions.length * 60 - Math.max(left, 0))}</p>
          <button onClick={onExit} className="mt-4 rounded-full bg-white px-5 py-2 font-bold text-emerald-700">নতুন পরীক্ষা</button>
        </div>
        <div className="mt-6 space-y-4">
          {questions.map((q, i) => {
            const ok = answers[i] === q.answer;
            return (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
                <p className="flex gap-2 font-semibold">{ok ? <CheckCircle2 className="shrink-0 text-emerald-600" size={20} /> : <XCircle className="shrink-0 text-rose-600" size={20} />}<span>{bn(i + 1)}. {q.q}</span></p>
                <p className="mt-2 text-sm">আপনার উত্তর: <b>{answers[i] === undefined ? 'উত্তর দেননি' : q.options[answers[i]]}</b></p>
                {!ok && <p className="text-sm">সঠিক উত্তর: <b className="text-emerald-700 dark:text-emerald-400">{q.options[q.answer]}</b></p>}
                {q.explain && <p className="mt-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-sm">{q.explain}</p>}
                <p className="mt-1 text-xs text-slate-400">{q.from}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-14 z-20 -mx-4 mb-4 flex items-center justify-between bg-slate-50/95 dark:bg-slate-900/95 px-4 py-2 backdrop-blur">
        <span className="text-sm font-semibold">{bn(Object.keys(answers).length)}/{bn(questions.length)} উত্তর দেওয়া হয়েছে</span>
        <span className={`inline-flex items-center gap-1 font-bold ${left < 60 ? 'text-rose-600' : 'text-emerald-700 dark:text-emerald-200'}`}><Clock size={16} /> {fmt(Math.max(left, 0))}</span>
      </div>
      <div className="space-y-5">
        {questions.map((q, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
            <p className="mb-3 font-semibold leading-relaxed"><span className="text-emerald-600 dark:text-emerald-400">{bn(i + 1)}.</span> {q.q}</p>
            <div className="grid gap-2">
              {q.options.map((o, oi) => (
                <button key={oi} onClick={() => setAnswers({ ...answers, [i]: oi })} className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${answers[i] === oi ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40' : 'border-slate-200 dark:border-white/10'}`}>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-white/10 text-xs font-bold">{LETTERS[oi]}</span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { submitted.current = true; setDone(true); }} className="mt-6 w-full rounded-full bg-emerald-600 py-3 text-lg font-bold text-white">জমা দিন</button>
    </div>
  );
}

export default function ExamPage() {
  const [selected, setSelected] = useState([]);
  const [count, setCount] = useState(20);
  const [qs, setQs] = useState(null);
  const start = async () => setQs(await buildQuestions(selected, count));

  if (qs) return <Exam questions={qs} onExit={() => setQs(null)} />;
  return (
    <div>
      <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">পরীক্ষা</h1>
      <p className="mb-6 mt-1 text-slate-500 dark:text-slate-400">সময়সীমাসহ পরীক্ষা (প্রতি প্রশ্নে ১ মিনিট)। উত্তর ও ব্যাখ্যা দেখানো হবে জমা দেওয়ার পর।</p>
      <DarsPicker selected={selected} setSelected={setSelected} count={count} setCount={setCount} onStart={start} startLabel="পরীক্ষা শুরু" />
    </div>
  );
}
