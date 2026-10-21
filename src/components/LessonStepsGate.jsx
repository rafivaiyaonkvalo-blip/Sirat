import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { isLessonHydrated, ensureLessonsSteps } from '../data/lessonSteps.js';
import { reviewLessonsFor } from '../utils/extraPractice';

// পাঠের ধাপগুলো (আলাদা ফাইলে থাকে) লোড হওয়া পর্যন্ত অপেক্ষা করে, তারপর পাঠ-মডাল দেখায়
export default function LessonStepsGate({ lesson, onClose, children }) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState(() =>
    isLessonHydrated(lesson) && reviewLessonsFor(lesson).every(isLessonHydrated) ? 'ready' : 'loading'
  );

  useEffect(() => {
    if (status === 'ready') return undefined;
    let alive = true;
    ensureLessonsSteps([lesson, ...reviewLessonsFor(lesson)])
      .then(() => { if (alive) setStatus('ready'); })
      .catch(() => { if (alive) setStatus('error'); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, attempt]);

  if (status === 'ready') return children;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-xl dark:bg-slate-800">
        {status === 'loading' ? (
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-100">
            <Loader2 className="animate-spin" size={22} />
            <span>পাঠ লোড হচ্ছে…</span>
          </div>
        ) : (
          <div className="space-y-3 text-slate-700 dark:text-slate-100">
            <p>পাঠ লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।</p>
            <div className="flex justify-center gap-2">
              <button
                className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
                onClick={() => { setStatus('loading'); setAttempt((n) => n + 1); }}
              >
                আবার চেষ্টা
              </button>
              <button className="rounded-xl bg-slate-200 px-4 py-2 text-slate-800" onClick={onClose}>
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
