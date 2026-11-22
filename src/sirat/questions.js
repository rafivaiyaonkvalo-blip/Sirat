import { loadDarsLocalized } from '../data/loadTranslation';
import { getLang } from '../i18n';
import index from '../data/darsIndex.json';
import { smartSelectQuestions, secureShuffle } from '../utils/quizHistoryManager';

export const totalQuestions = (ids) => index.filter((d) => ids.includes(d.id)).reduce((a, d) => a + d.porbos.reduce((b, p) => b + p.quiz, 0), 0);

export const bn = (n) => Number(n).toLocaleString('bn-BD');

// কুইজ ও পরীক্ষার প্রশ্ন: নির্বাচিত দারসগুলোর প্রশ্ন মিশিয়ে এবং স্মার্ট রোটেশনে পুনরাবৃত্তিহীন বাছাই
export async function buildQuestions(ids, count) {
  const all = [];
  for (const id of ids) {
    const d = await loadDarsLocalized(id, getLang());
    if (!d) continue;
    for (const p of d.porbos) {
      for (const q of p.quiz) {
        all.push({
          ...q,
          darsId: d.id,
          salt: Math.random().toString(36).slice(2),
          from: `দারস ${bn(d.number)} · ${d.title}`
        });
      }
    }
  }
  return smartSelectQuestions(all, count);
}

// একটি পর্বের কুইজ থেকে এলোমেলো সর্বোচ্চ n টি (ডিফল্ট ২০)
export function pickQuiz(qs, n = 20) {
  if (!Array.isArray(qs)) return [];
  const prepared = qs.map((q) => ({
    ...q,
    salt: Math.random().toString(36).slice(2)
  }));
  return smartSelectQuestions(prepared, n);
}
