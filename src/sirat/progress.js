import { useCallback, useEffect, useState } from 'react';

const KEY = 'sirat_progress_v1';

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
  const saveScore = useCallback(
    (dars, porbo, score, total) => setState((s) => ({ ...s, scores: { ...s.scores, [`${dars}-${porbo}`]: { score, total } } })),
    [],
  );
  return { ...state, markVisited, toggleDone, saveScore };
}
