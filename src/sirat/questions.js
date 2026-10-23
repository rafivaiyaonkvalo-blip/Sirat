import { loadDars } from '../data/loadDars';
import index from '../data/darsIndex.json';

export const totalQuestions = (ids) => index.filter((d) => ids.includes(d.id)).reduce((a, d) => a + d.porbos.reduce((b, p) => b + p.quiz, 0), 0);

// কুইজ ও পরীক্ষার প্রশ্ন: নির্বাচিত দারসগুলোর Word-ফাইলের প্রশ্ন একসাথে মিশিয়ে
export async function buildQuestions(ids, count) {
  const all = [];
  for (const id of ids) {
    const d = await loadDars(id);
    if (!d) continue;
    for (const p of d.porbos) for (const q of p.quiz) all.push({ ...q, from: `দারস ${d.number} · ${d.title}` });
  }
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
}

export const bn = (n) => Number(n).toLocaleString('bn-BD');

// একটি পর্বের কুইজ থেকে এলোমেলো সর্বোচ্চ n টি (ডিফল্ট ২০)
export function pickQuiz(qs, n = 20) {
  const a = [...qs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
