import { useCallback, useEffect, useState } from 'react';
import { isSuperUser } from '../utils/superUser';

const KEY = 'sirat_progress_v1';

// পাঠ N খোলা: প্রথম পাঠ সবসময়; অন্যগুলো আগের পাঠের কুইজ/সম্পন্ন হলে (সুপার ইউজারের জন্য সব খোলা)
export const isUnlocked = (done, darsId, no) => no <= 1 || !!done[`${darsId}-${no - 1}`] || isSuperUser(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { done: {}, last: null, scores: {} };
  } catch {
    return { done: {}, last: null, scores: {} };
  }
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
