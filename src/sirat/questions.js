import { loadDarsLocalized } from '../data/loadTranslation';
import { getLang } from '../i18n';
import index from '../data/darsIndex.json';
import { smartSelectQuestions, smartSelectBalanced } from '../utils/quizHistoryManager';

export const totalQuestions = (ids) => index.filter((d) => ids.includes(d.id)).reduce((a, d) => a + d.porbos.reduce((b, p) => b + p.quiz, 0), 0);

export const bn = (n) => Number(n).toLocaleString('bn-BD');

const makeSalt = () => Math.random().toString(36).slice(2);

// কুইজ ও পরীক্ষার প্রশ্ন: নির্বাচিত দারসগুলোর প্রশ্ন দারসভিত্তিক ভারসাম্যে ও স্মার্ট রোটেশনে বাছাই
export async function buildQuestions(ids, count) {
  const groups = [];
  for (const id of ids) {
    const d = await loadDarsLocalized(id, getLang());
    if (!d) continue;
    const darsQuestions = [];
    for (const p of d.porbos) {
      for (const q of p.quiz) {
        darsQuestions.push({
          ...q,
          darsId: d.id,
          porboNo: p.no,
          salt: makeSalt(),
          from: `দারস ${bn(d.number)} · ${d.title}`
        });
      }
    }
    if (darsQuestions.length > 0) groups.push(darsQuestions);
  }
  return smartSelectBalanced(groups, count);
}

// একটি পর্বের কুইজ থেকে এলোমেলো সর্বোচ্চ n টি (ডিফল্ট ২০)
export function pickQuiz(qs, opts = 20) {
  if (!Array.isArray(qs)) return [];
  const { n = 20, darsId = null, porboNo = null, title = '' } =
    typeof opts === 'number' ? { n: opts } : (opts || {});
  const prepared = qs.map((q) => ({
    ...q,
    ...(darsId && !q.darsId ? { darsId } : {}),
    ...(porboNo && !q.porboNo ? { porboNo } : {}),
    ...(title && !q.from ? { from: title } : {}),
    salt: makeSalt()
  }));
  return smartSelectQuestions(prepared, n);
}
