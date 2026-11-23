import { useState } from 'react';
import { Clock, PenLine, ClipboardList } from 'lucide-react';
import DarsPicker from './DarsPicker';
import Quiz from './Quiz';
import SectionHero from './SectionHero';
import { QuizShell } from './QuizModal';
import { Exam } from './ExamView';
import { buildQuestions, bn } from './questions';
import { saveQuizResult } from '../utils/quizHistoryManager';

const MODES = [
  { key: 'quiz', label: 'কুইজ', hint: 'একটি একটি প্রশ্ন, সঙ্গে সঙ্গে ব্যাখ্যা', icon: PenLine },
  { key: 'exam', label: 'পরীক্ষা', hint: 'সময়সীমাসহ, শেষে পূর্ণ বিশ্লেষণ', icon: Clock },
];

// কুইজ ও পরীক্ষা এক সেকশনে: একই দারস-বাছাই, মোড বেছে শুরু
export default function QuizPage() {
  const [mode, setMode] = useState(() => (new URLSearchParams(window.location.search).get('tab') === 'exam' ? 'exam' : 'quiz'));
  const [selected, setSelected] = useState([1]);
  const [count, setCount] = useState(10);
  const [qs, setQs] = useState(null);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const start = async () => {
    setBusy(true);
    setQs(await buildQuestions(selected, count));
    setAttempt((a) => a + 1);
    setBusy(false);
  };

  const handleQuizFinish = (s, t) => {
    saveQuizResult({
      title: `কুইজ (দারস ${selected.map(bn).join(', ')})`,
      type: 'quiz',
      score: s,
      total: t,
      earnedXp: (s * 10) + ((t - s) * 5)
    });
  };

  if (qs && mode === 'exam') return <Exam key={attempt} questions={qs} onExit={() => setQs(null)} />;

  return (
    <div className="mx-auto max-w-4xl">
      <SectionHero
        icon={mode === 'exam' ? Clock : PenLine}
        title="কুইজ ও পরীক্ষা"
        subtitle="যে দারসগুলো চান বেছে নিন। কুইজে উত্তর দিলেই সঠিক উত্তর ও ব্যাখ্যা; পরীক্ষায় প্রতি প্রশ্নে ১ মিনিট, ফল ও ব্যাখ্যা জমা দেওয়ার পর।"
        chips={['কুইজ: সঙ্গে সঙ্গে ব্যাখ্যা', 'পরীক্ষা: সময়সীমাসহ', 'সঠিক ১০ XP, ভুল ৫ XP']}
      />

      {/* অনুশীলন ও পরীক্ষার ফলাফল রিপোর্ট বাটন */}
      <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ClipboardList size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              অনুশীলন ও পরীক্ষার ফলাফল রিপোর্ট
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
              দারসভিত্তিক প্রাপ্ত নম্বর, গড় হার এবং পরীক্ষার পূর্ণ ইতিহাস দেখুন
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('sirat_open_quiz_results'))}
          className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
        >
          ফলাফল দেখুন ➔
        </button>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">
        {MODES.map(({ key, label, hint, icon: Icon }) => (
          <button key={key} onClick={() => setMode(key)} className={`rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${mode === key ? 'bg-emerald-600 text-white shadow-[0_0_18px_rgba(14,165,233,0.5)]' : 'text-slate-600 dark:text-slate-300'}`}>
            <span className="flex items-center gap-1.5 text-sm font-extrabold"><Icon size={16} /> {label}</span>
            <span className={`mt-0.5 block text-[11px] ${mode === key ? 'text-emerald-100' : 'text-slate-400'}`}>{hint}</span>
          </button>
        ))}
      </div>
      <DarsPicker selected={selected} setSelected={setSelected} count={count} setCount={setCount} onStart={start} startLabel={busy ? 'তৈরি হচ্ছে…' : mode === 'exam' ? 'পরীক্ষা শুরু' : 'কুইজ শুরু'} busy={busy} />
      {qs && mode === 'quiz' && (
        <QuizShell heading="কুইজ" onClose={() => setQs(null)}>
          <Quiz 
            key={attempt} 
            questions={qs} 
            sessionKey={`quiz_view_${selected.join('_')}`}
            title="কুইজ" 
            onRetry={start} 
            onClose={() => setQs(null)} 
            onFinish={handleQuizFinish}
          />
        </QuizShell>
      )}
    </div>
  );
}
