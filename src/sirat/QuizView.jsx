import { useState } from 'react';
import { ArrowLeft, PenLine } from 'lucide-react';
import DarsPicker from './DarsPicker';
import Quiz from './Quiz';
import SectionHero from './SectionHero';
import { buildQuestions } from './questions';

export default function QuizPage() {
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

  if (qs) {
    return (
      <div className="mx-auto max-w-2xl">
        <button onClick={() => setQs(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400"><ArrowLeft size={16} /> নতুন কুইজ বানান</button>
        <Quiz key={attempt} questions={qs} title="কুইজ" onRetry={start} />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHero
        icon={PenLine}
        title="কুইজ"
        subtitle="যে দারসগুলো চান বেছে নিন; একটি একটি করে প্রশ্ন আসবে, উত্তর দিলেই সঠিক উত্তর ও ব্যাখ্যা দেখতে পাবেন।"
        chips={['একটি একটি প্রশ্ন', 'সঙ্গে সঙ্গে ব্যাখ্যা', 'যতবার খুশি']}
      />
      <DarsPicker selected={selected} setSelected={setSelected} count={count} setCount={setCount} onStart={start} startLabel={busy ? 'তৈরি হচ্ছে…' : 'কুইজ শুরু'} busy={busy} />
    </div>
  );
}
