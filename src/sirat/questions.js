import { loadDars } from '../data/loadDars';
import index from '../data/darsIndex.json';

export const totalQuestions = (ids) => index.filter((d) => ids.includes(d.id)).reduce((a, d) => a + d.porbos.reduce((b, p) => b + p.quiz, 0), 0);

export async function buildQuestions(ids, count) {
  const all = [];
  for (const id of ids) {
    const d = await loadDars(id);
    if (!d) continue;
    for (const p of d.porbos) for (const q of p.quiz) all.push({ ...q, from: `দারস ${d.number} · ${p.title}` });
  }
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
}

export const bn = (n) => Number(n).toLocaleString('bn-BD');
