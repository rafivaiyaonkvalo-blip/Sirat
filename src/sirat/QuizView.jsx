import { useState } from 'react';
import { Clock, PenLine } from 'lucide-react';
import DarsPicker from './DarsPicker';
import Quiz from './Quiz';
import SectionHero from './SectionHero';
import { QuizShell } from './QuizModal';
import { Exam } from './ExamView';
import { buildQuestions } from './questions';

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

  if (qs && mode === 'exam') return <Exam key={attempt} questions={qs} onExit={() => setQs(null)} />;

  return (
    <div className="mx-auto max-w-4xl">
      <SectionHero
        icon={mode === 'exam' ? Clock : PenLine}
        title="কুইজ ও পরীক্ষা"
        subtitle="যে দারসগুলো চান বেছে নিন। কুইজে উত্তর দিলেই সঠিক উত্তর ও ব্যাখ্যা; পরীক্ষায় প্রতি প্রশ্নে ১ মিনিট, ফল ও ব্যাখ্যা জমা দেওয়ার পর।"
        chips={['কুইজ: সঙ্গে সঙ্গে ব্যাখ্যা', 'পরীক্ষা: সময়সীমাসহ', 'সঠিক ১০ XP, ভুল ৫ XP']}
      />
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">
        {MODES.map(({ key, label, hint, icon: Icon }) => (
          <button key={key} onClick={() => setMode(key)} className={`rounded-xl px-3 py-2.5 text-left transition ${mode === key ? 'bg-emerald-600 text-white shadow-[0_0_18px_rgba(14,165,233,0.5)]' : 'text-slate-600 dark:text-slate-300'}`}>
            <span className="flex items-center gap-1.5 text-sm font-extrabold"><Icon size={16} /> {label}</span>
            <span className={`mt-0.5 block text-[11px] ${mode === key ? 'text-emerald-100' : 'text-slate-400'}`}>{hint}</span>
          </button>
        ))}
      </div>
      <DarsPicker selected={selected} setSelected={setSelected} count={count} setCount={setCount} onStart={start} startLabel={busy ? 'তৈরি হচ্ছে…' : mode === 'exam' ? 'পরীক্ষা শুরু' : 'কুইজ শুরু'} busy={busy} />
      {qs && mode === 'quiz' && (
        <QuizShell heading="কুইজ" onClose={() => setQs(null)}>
          <Quiz key={attempt} questions={qs} title="কুইজ" onRetry={start} onClose={() => setQs(null)} />
        </QuizShell>
      )}
    </div>
  );
}
