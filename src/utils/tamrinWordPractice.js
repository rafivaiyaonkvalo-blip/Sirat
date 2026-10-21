/**
 * আত-তামরীনুল কিতাবী — কিতাবের শেষের "নতুন শব্দ" সেটের অনুশীলন ধাপ
 *
 * প্রতিটি শব্দের জন্য দুটি প্রশ্ন: আরবি দেখে বাংলা অর্থ বাছাই, তারপর বাংলা দেখে আরবি শব্দ বাছাই।
 * ভুল অপশন আসে একই সেট, তারপর একই তালিকা থেকে; একই লেখা বা একই অর্থের শব্দ বাদ দেওয়া হয়
 * (যেমন "ছাতা (রোদের)" ও "ছাতা (বৃষ্টির)" একে অপরের ভুল অপশন হয় না)।
 */
import { tamrinWordGroups } from '../data/tamrinKitabiData';
import { shuffle } from './shuffle';

const HARAKAT = /[ً-ْٰـ]/g;
const bare = (t) => String(t || '').replace(HARAKAT, '').replace(/[أإآٱ]/g, 'ا').replace(/\s+/g, ' ').trim();
const wordCount = (t) => String(t || '').trim().split(/\s+/).length;
// বাংলা অর্থের মূল শব্দগুলো (কমা দিয়ে আলাদা, বন্ধনীর ব্যাখ্যা বাদে)
const meaningKeys = (bn) => new Set(
  String(bn || '')
    .replace(/\([^)]*\)/g, ' ')
    .split(/[,،/]/)
    .map((x) => x.replace(/[।?!]/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
);
const sameMeaning = (a, b) => {
  const ka = meaningKeys(a);
  for (const k of meaningKeys(b)) if (ka.has(k)) return true;
  return false;
};

function pickDistractors(target, sources, key, n = 3) {
  const out = [];
  const isAr = key === 'arabic';
  const targetShape = Math.min(wordCount(target.arabic), 3);
  const candidates = sources.flatMap((src) => {
    const list = shuffle(src);
    // আরবি অপশনে আগে একই দৈর্ঘ্যের (শব্দ/শব্দগুচ্ছ) শব্দ, যেন দৈর্ঘ্য দেখে উত্তর বোঝা না যায়
    return isAr
      ? [...list.filter((c) => Math.min(wordCount(c.arabic), 3) === targetShape), ...list.filter((c) => Math.min(wordCount(c.arabic), 3) !== targetShape)]
      : list;
  });
  for (const c of candidates) {
    if (out.length >= n) break;
    const clash = [target, ...out].some((x) => bare(x.arabic) === bare(c.arabic) || sameMeaning(x.bangla, c.bangla));
    if (!clash) out.push(c);
  }
  return out;
}

export function buildWordPracticeSteps(set) {
  if (!set?.words?.length) return [];
  const group = tamrinWordGroups.find((g) => g.id === set.groupId);
  const partWords = tamrinWordGroups.filter((g) => g.partId === set.partId).flatMap((g) => g.words);
  const sources = [set.words, set.groupWords || group?.words || [], partWords];

  const arToBn = shuffle(set.words).map((w, i) => ({
    id: `${set.id}-ab-${i}`,
    kind: 'word',
    mode: 'ar-to-bn',
    stageLabel: 'নতুন শব্দ • অর্থ বাছাই',
    instruction: 'এই আরবি শব্দের সঠিক বাংলা অর্থ কোনটি?',
    arabicSentence: w.arabic,
    banglaSentence: w.bangla,
    page: w.page,
    options: shuffle([
      { text: w.bangla, isCorrect: true },
      ...pickDistractors(w, sources, 'bangla').map((d) => ({ text: d.bangla, isCorrect: false }))
    ])
  }));

  const bnToAr = shuffle(set.words).map((w, i) => ({
    id: `${set.id}-ba-${i}`,
    kind: 'word',
    mode: 'bn-to-ar',
    stageLabel: 'নতুন শব্দ • আরবি বাছাই',
    instruction: 'এই অর্থের সঠিক আরবি শব্দ কোনটি?',
    arabicSentence: w.arabic,
    banglaSentence: w.bangla,
    page: w.page,
    options: shuffle([
      { text: w.arabic, isCorrect: true, isArabic: true },
      ...pickDistractors(w, sources, 'arabic').map((d) => ({ text: d.arabic, isCorrect: false, isArabic: true }))
    ])
  }));

  return [...arToBn, ...bnToAr];
}
