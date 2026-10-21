import { useState } from 'react';
import DarsPicker from '../components/DarsPicker';
import Quiz from '../components/Quiz';
import { buildQuestions } from '../utils/questions';

export default function QuizPage() {
  const [selected, setSelected] = useState([1]);
  const [count, setCount] = useState(10);
  const [qs, setQs] = useState(null);
  const [busy, setBusy] = useState(false);

  const start = async () => {
    setBusy(true);
    setQs(await buildQuestions(selected, count));
    setBusy(false);
  };

  if (qs) {
    return (
      <div className="mx-auto max-w-3xl">
        <button onClick={() => setQs(null)} className="text-sm font-semibold text-brand-600 dark:text-brand-400">← নতুন কুইজ বানান</button>
        <Quiz questions={qs} />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-700 dark:text-brand-200">কুইজ</h1>
      <p className="mb-6 mt-1 text-slate-500 dark:text-slate-400">পুরো কিতাব থেকে যে দারসগুলো চান বেছে নিন। প্রতিটি উত্তরের সঙ্গে সঙ্গেই ব্যাখ্যা দেখুন।</p>
      <DarsPicker selected={selected} setSelected={setSelected} count={count} setCount={setCount} onStart={start} startLabel={busy ? 'তৈরি হচ্ছে…' : 'কুইজ শুরু'} />
    </div>
  );
}
