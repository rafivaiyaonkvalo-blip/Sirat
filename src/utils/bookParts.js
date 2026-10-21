// কিতাবভিত্তিক দারসের বড় পর্বকে ছোট ছোট পর্বে ভাগ করা হয়:
// প্রতিটি ছোট পর্বে কিতাবের সর্বোচ্চ ৭টি ধাপ, সাথে অল্প কিছু অনুশীলন ও পুনরাবৃত্তি —
// যেন একেকটি পর্ব ছোট ও প্রশান্তিময় হয়, আর পর্বের সংখ্যা বেশি হয়।
// পুরোনো অগ্রগতি: মূল পর্ব (parentId) সম্পন্ন থাকলে তার সব ছোট পর্বও সম্পন্ন ধরা হয়।

import { isLessonHydrated } from '../data/lessonSteps.js';

export const MAX_BOOK_STEPS_PER_PART = 7;
export const EXTRA_STEPS_PER_PART = 3;
export const REVIEW_STEPS_PER_PART = 2;

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const bn = (n) => String(n).replace(/\d/g, (d) => BN_DIGITS[d]);

const cache = new WeakMap();

// ধাপগুলোকে প্রায় সমান ভাগে ভাগ (কোনো ভাগে ৭টির বেশি নয়) — শুধু ভাগের আকারগুলো ফেরত দেয়,
// তাই ধাপের লেখা লোড হওয়ার আগেও (stepCount দিয়ে) পর্বের সংখ্যা ও আইডি একই থাকে
function chunkSizes(n) {
  const count = Math.max(1, Math.ceil(n / MAX_BOOK_STEPS_PER_PART));
  const sizes = [];
  let start = 0;
  for (let i = 0; i < count; i++) {
    const size = Math.ceil((n - start) / (count - i));
    sizes.push(size);
    start += size;
  }
  return sizes;
}

export function getBookParts(lesson) {
  if (!lesson || !Array.isArray(lesson.bookStages)) return [];
  // ধাপের লেখা লোড হলে আগের ক্যাশ বাতিল (শুধু লোডের আগের অবস্থা থেকে পরের অবস্থায় বদলালে)
  const hydrated = isLessonHydrated(lesson);
  const cached = cache.get(lesson);
  if (cached && cached.hydrated === hydrated) return cached.parts;
  const parts = [];
  lesson.bookStages.forEach((stage) => {
    const total = typeof stage.stepCount === 'number' ? stage.stepCount : (stage.steps || []).length;
    const sizes = chunkSizes(total);
    let offset = 0;
    sizes.forEach((size, i) => {
      const steps = Array.isArray(stage.steps) ? stage.steps.slice(offset, offset + size) : [];
      offset += size;
      const multi = sizes.length > 1;
      parts.push({
        ...stage,
        // একভাগের পর্বে আগের আইডিই থাকে (পুরোনো অগ্রগতি সরাসরি মেলে)
        id: multi ? `${stage.id}~${i + 1}` : stage.id,
        parentId: stage.id,
        partIndex: i,
        partCount: sizes.length,
        stepCount: size,
        titleBn: multi ? `${stage.titleBn} • অংশ ${bn(i + 1)}/${bn(sizes.length)}` : stage.titleBn,
        shortTitle: multi ? `${stage.shortTitle || stage.titleBn} (${bn(i + 1)})` : stage.shortTitle,
        estMinutes: Math.max(2, Math.round(((stage.estMinutes || 6) * size) / Math.max(1, total))),
        steps
      });
    });
  });
  cache.set(lesson, { parts, hydrated });
  return parts;
}

// ছোট পর্বের আইডি বা পুরোনো মূল পর্বের আইডি — দুটো দিয়েই খোঁজা যায়
export function findBookPart(lesson, id) {
  const parts = getBookParts(lesson);
  return parts.find((p) => p.id === id) || parts.find((p) => p.parentId === id) || null;
}

// ধাপের ধরন ঘুরিয়ে ঘুরিয়ে নেওয়া, যেন অল্প কয়েকটি ধাপেও বৈচিত্র্য থাকে
export function pickVaried(steps, max) {
  if (steps.length <= max) return steps;
  const groups = new Map();
  steps.forEach((s) => {
    const key = `${s.type}|${s.title || ''}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  });
  const lists = [...groups.values()];
  const out = [];
  for (let round = 0; out.length < max; round++) {
    let added = false;
    for (const list of lists) {
      if (out.length >= max) break;
      if (list[round]) {
        out.push(list[round]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}
