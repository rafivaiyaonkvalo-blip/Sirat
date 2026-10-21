/**
 * পাঠের ধাপ (bookStages[].steps) অলস লোড।
 *
 * lessons.json-এর ৮ MB-এর প্রায় ৬.৪ MB-ই এই ধাপগুলো। বিল্ডের সময় (vite.config.js-এর
 * lessonStepsSplit প্লাগইন) এগুলো আলাদা করে প্রতিটি পাঠের জন্য একটি ছোট ফাইলে রাখা হয়;
 * মূল ডেটায় শুধু stepCount থাকে। পাঠ খোলার সময় ensureLessonSteps দিয়ে ধাপগুলো
 * আবার lesson.bookStages[i].steps-এ বসানো হয়, ফলে বাকি কোড আগের মতোই চলে।
 */
import lessonsData from './lessons.json';
import loaders from 'virtual:lesson-steps-loaders';

const inflight = new Map();

// ধাপের লেখা লোড হয়েছে কিনা (bookStages নেই এমন পাঠ সবসময় 'লোডেড')
export function isLessonHydrated(lesson) {
  const stages = lesson?.bookStages;
  if (!Array.isArray(stages) || stages.length === 0) return true;
  return stages.every((s) => Array.isArray(s.steps));
}

export function ensureLessonSteps(lessonOrId) {
  const lesson = typeof lessonOrId === 'string'
    ? lessonsData.lessons.find((l) => l.id === lessonOrId)
    : lessonOrId;
  if (!lesson || isLessonHydrated(lesson)) return Promise.resolve(lesson);

  const canonical = lessonsData.lessons.find((l) => l.id === lesson.id) || lesson;
  if (inflight.has(canonical.id)) return inflight.get(canonical.id).then(() => lesson);

  const load = loaders[canonical.id];
  if (!load) return Promise.resolve(lesson);

  const p = load()
    .then((mod) => {
      const perStage = mod.default || [];
      canonical.bookStages.forEach((stage, i) => {
        stage.steps = perStage[i] || [];
      });
      return canonical;
    })
    .finally(() => inflight.delete(canonical.id));
  inflight.set(canonical.id, p);
  return p.then(() => lesson);
}

export function ensureLessonsSteps(lessons) {
  return Promise.all((lessons || []).map(ensureLessonSteps));
}
