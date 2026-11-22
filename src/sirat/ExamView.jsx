import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, MinusCircle, RotateCcw, XCircle, AlertCircle } from 'lucide-react';
import { bn } from './questions';
import { t } from '../i18n';
import { addQuizAnswer } from './points';
import { recordMistake } from '../utils/mistakesManager';
import { 
  saveQuizResult, 
  saveActiveExamSession, 
  getActiveExamSession, 
  clearActiveExamSession 
} from '../utils/quizHistoryManager';

const LETTERS = ['ক', 'খ', 'গ', 'ঘ'];
const fmt = (s) => `${bn(String(Math.floor(s / 60)).padStart(2, '0'))}:${bn(String(s % 60).padStart(2, '0'))}`;

function grade(pct) {
  if (pct >= 90) return { text: 'মাশা আল্লাহ! চমৎকার', color: '#10b981' };
  if (pct >= 70) return { text: 'অনেক ভালো, এগিয়ে চলুন', color: '#10b981' };
  if (pct >= 50) return { text: 'ভালো চেষ্টা, আরেকটু পড়ে নিন', color: '#f59e0b' };
  return { text: 'দারসগুলো আরেকবার পড়ে আবার চেষ্টা করুন', color: '#f43f5e' };
}

function ScoreRing({ pct, color, score, total }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 0.9s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-extrabold leading-none">{bn(score)}/{bn(total)}</span>
        <span className="mt-1 text-sm font-bold opacity-90">{bn(pct)}%</span>
      </div>
    </div>
  );
}

export function Exam({ questions: initialQuestions, onExit }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(initialQuestions.length * 60);
  const [done, setDone] = useState(false);
  const [filter, setFilter] = useState('all');
  const [pendingResume, setPendingResume] = useState(null);
  const submitted = useRef(false);
  const total = questions.length;

  // Check saved exam session
  useEffect(() => {
    const saved = getActiveExamSession();
    if (saved && Array.isArray(saved.questions) && saved.left > 0) {
      setPendingResume(saved);
    }
  }, []);

  const handleResume = () => {
    if (!pendingResume) return;
    setQuestions(pendingResume.questions);
    setAnswers(pendingResume.answers || {});
    setLeft(pendingResume.left || initialQuestions.length * 60);
    setPendingResume(null);
  };

  const handleDiscardResume = () => {
    clearActiveExamSession();
    setPendingResume(null);
  };

  // Timer
  useEffect(() => {
    if (done) return undefined;
    const t = setInterval(() => {
      setLeft((l) => {
        const next = l - 1;
        if (next > 0 && next % 5 === 0) {
          saveActiveExamSession({ questions, answers, left: next });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, questions, answers]);

  useEffect(() => {
    if (left <= 0 && !submitted.current) finish();
  }, [left]);

  const answered = Object.keys(answers).length;
  const score = questions.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0);

  const finish = () => {
    if (submitted.current && done) return;
    submitted.current = true;
    let earnedXp = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        const isOk = answers[i] === q.answer;
        earnedXp += addQuizAnswer(isOk);
        if (!isOk) {
          try {
            recordMistake({
              type: 'quiz',
              question: q.q,
              options: q.options,
              correctIndex: q.answer,
              correctText: q.options[q.answer],
              sourceTitle: q.from || 'পরীক্ষা',
              darsId: q.darsId
            });
          } catch {}
        }
      }
    });

    clearActiveExamSession();
    setDone(true);

    // Save to history & profile reports
    saveQuizResult({
      title: 'সম্মিলিত দারস পরীক্ষা',
      type: 'exam',
      score,
      total,
      earnedXp
    });
  };

  const submit = () => {
    if (answered < total && !window.confirm(t(`${bn(total - answered)}টি প্রশ্নের উত্তর দেওয়া হয়নি। জমা দেবেন?`))) return;
    finish();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (qIdx, optIdx) => {
    const nextAnswers = { ...answers, [qIdx]: optIdx };
    setAnswers(nextAnswers);
    saveActiveExamSession({ questions, answers: nextAnswers, left });
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const g = grade(pct);
    const wrong = answered - score;
    const skipped = total - answered;
    const rows = questions.map((q, i) => ({ q, i, ok: answers[i] === q.answer, none: answers[i] === undefined }));
    const shown = rows.filter((r) => (filter === 'wrong' ? !r.ok : filter === 'ok' ? r.ok : true));
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 p-6 text-center text-white shadow-xl">
          <p className="mb-3 text-sm font-bold text-emerald-100">পরীক্ষার ফল</p>
          <ScoreRing pct={pct} color={g.color} score={score} total={total} />
          <p className="mt-3 text-lg font-extrabold">{g.text}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-bold">
            <div className="rounded-2xl bg-black/25 py-2"><span className="block text-xl" style={{ color: '#34d399' }}>{bn(score)}</span>সঠিক</div>
            <div className="rounded-2xl bg-black/25 py-2"><span className="block text-xl text-rose-300">{bn(wrong)}</span>ভুল</div>
            <div className="rounded-2xl bg-black/25 py-2"><span className="block text-xl text-amber-300">{bn(skipped)}</span>বাদ</div>
          </div>
          <p className="mt-3 text-xs text-emerald-100">সময় ব্যবহার {fmt(total * 60 - Math.max(left, 0))}</p>
          <button onClick={onExit} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-bold text-emerald-700 shadow-md hover:bg-slate-100 cursor-pointer"><RotateCcw size={16} /> নতুন পরীক্ষা</button>
        </div>

        <div className="mt-6 mb-3 flex gap-2">
          {[['all', `সব (${bn(total)})`], ['wrong', `ভুল/বাদ (${bn(wrong + skipped)})`], ['ok', `সঠিক (${bn(score)})`]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold sm:text-sm cursor-pointer transition ${filter === k ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200'}`}>{l}</button>
          ))}
        </div>
        <div className="space-y-4">
          {shown.map(({ q, i, ok, none }) => (
            <div key={i} className={`rounded-2xl border-2 bg-white p-4 dark:bg-white/5 ${ok ? 'border-[#10b981]/40' : 'border-rose-400/40'}`}>
              <p className="flex gap-2 font-semibold leading-relaxed">
                {ok ? <CheckCircle2 className="mt-0.5 shrink-0 text-[#10b981]" size={20} /> : none ? <MinusCircle className="mt-0.5 shrink-0 text-amber-500" size={20} /> : <XCircle className="mt-0.5 shrink-0 text-rose-500" size={20} />}
                <span translate="no">{bn(i + 1)}. {q.q}</span>
              </p>
              <p className="mt-2 text-sm">আপনার উত্তর: <b translate={none ? undefined : 'no'}>{none ? 'উত্তর দেননি' : q.options[answers[i]]}</b></p>
              {!ok && <p className="text-sm">সঠিক উত্তর: <b translate="no" className="text-[#10b981]">{q.options[q.answer]}</b></p>}
              {q.explain && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-relaxed dark:bg-emerald-900/30"><strong>ব্যাখ্যা: </strong><span translate="no">{q.explain}</span></p>}
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('sirat_goto_dars', { detail: q.darsId }))} className="mt-2 text-left text-[11px] font-semibold text-slate-400 underline decoration-dotted underline-offset-2 cursor-pointer">{q.from} ↗</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {pendingResume && (
        <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-amber-400/50 bg-amber-500/15 p-3 text-xs">
          <div className="flex items-center gap-2">
            <RotateCcw size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold text-amber-900 dark:text-amber-200">
              আগের অসমাপ্ত পরীক্ষা পাওয়া গেছে ({bn(Object.keys(pendingResume.answers || {}).length)}টি উত্তর দেওয়া ছিল)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResume}
              className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white shadow-xs cursor-pointer"
            >
              চালিয়ে যান
            </button>
            <button
              type="button"
              onClick={handleDiscardResume}
              className="rounded-lg bg-slate-200 dark:bg-slate-700 px-2.5 py-1 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              নতুন
            </button>
          </div>
        </div>
      )}

      <div className="sticky top-16 z-30 -mx-1 mb-4 rounded-2xl border border-emerald-300/40 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md dark:bg-slate-900/95 md:top-20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{bn(answered)}/{bn(total)} উত্তর</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold ${left < 60 ? 'animate-pulse bg-rose-500/15 text-rose-500' : 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-200'}`}><Clock size={15} /> {fmt(Math.max(left, 0))}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className={`rounded-2xl border-2 bg-white p-4 transition dark:bg-white/5 ${answers[i] !== undefined ? 'border-emerald-300/60' : 'border-slate-200 dark:border-white/10'}`}>
            <p className="mb-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">{q.from}</p>
            <p className="mb-3 font-semibold leading-relaxed"><span className="text-emerald-600 dark:text-emerald-400">{bn(i + 1)}.</span> <span translate="no">{q.q}</span></p>
            <div className="grid gap-2">
              {q.options.map((o, oi) => {
                const on = answers[i] === oi;
                return (
                  <button key={oi} onClick={() => handleAnswer(i, oi)} className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition active:scale-[0.99] cursor-pointer ${on ? 'border-emerald-400 bg-emerald-50 shadow-[0_0_12px_rgba(14,165,233,0.35)] dark:bg-emerald-900/40' : 'border-slate-200 hover:border-emerald-300 dark:border-white/10'}`}>
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${on ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 dark:bg-white/10 dark:text-emerald-200'}`}>{LETTERS[oi]}</span>
                    <span translate="no" className="flex-1 font-medium">{o}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button onClick={submit} className="mt-6 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 py-3.5 text-lg font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] cursor-pointer active:scale-98 transition">জমা দিন</button>
    </div>
  );
}
