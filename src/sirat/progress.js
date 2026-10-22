import { useCallback, useEffect, useState } from 'react';
import { isSuperUser } from '../utils/superUser';
import index from '../data/darsIndex.json';

const KEY = 'sirat_progress_v2';
const OLD_KEY = 'sirat_progress_v1';

// পাঠ N খোলা: প্রথম পাঠ সবসময়; অন্যগুলো আগের পাঠের কুইজ/সম্পন্ন হলে (সুপার ইউজারের জন্য সব খোলা)
export const isUnlocked = (done, darsId, no) => no <= 1 || !!done[`${darsId}-${no - 1}`] || isSuperUser(null);

// আগের (ছোট ছোট ভাগের) অগ্রগতি নতুন ৩-ভাগে রূপান্তর: নতুন পাঠের সব পুরনো পাঠ সম্পন্ন হলেই সেটি সম্পন্ন
const migrate = (old) => {
  const done = {};
  const scores = {};
  let last = null;
  for (const d of index) {
    for (const p of d.porbos) {
      let all = true;
      for (let n = p.from; n <= p.to; n++) if (!old.done?.[`${d.id}-${n}`]) all = false;
      if (all) done[`${d.id}-${p.no}`] = 1;
      const s = old.scores?.[`${d.id}-${p.to}`];
      if (s) scores[`${d.id}-${p.no}`] = s;
      if (old.last?.dars === d.id && old.last.porbo >= p.from && old.last.porbo <= p.to) last = { dars: d.id, porbo: p.no };
    }
  }
  return { done, last, scores };
};

const load = () => {
  try {
    const cur = JSON.parse(localStorage.getItem(KEY));
    if (cur) return cur;
    const old = JSON.parse(localStorage.getItem(OLD_KEY));
    if (old) return migrate(old);
  } catch {
    /* স্টোরেজ পড়া যায়নি */
  }
  return { done: {}, last: null, scores: {} };
};

export function useProgress() {
  const [state, setState] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ব্রাউজার স্টোরেজ বন্ধ থাকলে অগ্রগতি সংরক্ষণ হবে না */
    }
  }, [state]);

  const markVisited = useCallback((dars, porbo) => setState((s) => ({ ...s, last: { dars, porbo } })), []);
  const toggleDone = useCallback(
    (dars, porbo) =>
      setState((s) => {
        const k = `${dars}-${porbo}`;
        const done = { ...s.done };
        if (done[k]) delete done[k];
        else done[k] = 1;
        return { ...s, done };
      }),
    [],
  );
  const markDone = useCallback((dars, porbo) => setState((s) => (s.done[`${dars}-${porbo}`] ? s : { ...s, done: { ...s.done, [`${dars}-${porbo}`]: 1 } })), []);
  const saveScore = useCallback(
    (dars, porbo, score, total) => setState((s) => ({ ...s, scores: { ...s.scores, [`${dars}-${porbo}`]: { score, total } } })),
    [],
  );
  return { ...state, markVisited, toggleDone, markDone, saveScore };
}
