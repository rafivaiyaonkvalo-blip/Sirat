// দারসের লেখা ও কুইজের ইংরেজি/আরবি অনুবাদ: src/data/tr/<ভাষা>/dars-NN.json
// ফরম্যাট:
// { porbos: [ { title, blocks: { "<ব্লক-নম্বর>": "লেখা {{1}}" | { title, text } },
//               footnotes: { "<ক্রম>": "লেখা" },
//               quiz: [ { q, o: [৪টি অপশন, মূল ক্রমে], e } ] } ] }
// {{k}} = মূল ব্লকের k-তম বিশেষ রান (আরবি/ﷺ বা পাদটীকা-চিহ্ন), ক্রম অনুযায়ী; এগুলো মূল ব্লক থেকেই নেওয়া হয়।
import { loadDars } from './loadDars';

const modules = {
  en: import.meta.glob('./tr/en/dars-*.json'),
  ar: import.meta.glob('./tr/ar/dars-*.json'),
};

export function loadTranslation(lang, id) {
  const key = `./tr/${lang}/dars-${String(id).padStart(2, '0')}.json`;
  const load = modules[lang]?.[key];
  return load ? load().then((m) => m.default) : Promise.resolve(null);
}

const special = (runs = []) => runs.filter((r) => r.fn || r.ar);

// আরবিতে সংখ্যা আরবি-ইন্ডিক অঙ্কে
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const digits = (s, lang) => (lang === 'ar' ? String(s).replace(/[0-9]/g, (d) => AR_DIGITS[d]) : s);

// অনূদিত লেখা → রান-তালিকা (বিশেষ রানগুলো মূল থেকে বসে)
export function toRuns(text, srcRuns, lang) {
  const sp = special(srcRuns);
  return String(text)
    .split(/\{\{(\d+)\}\}/)
    .map((part, i) => (i % 2 === 0 ? { t: digits(part, lang) } : sp[Number(part) - 1] || { t: '' }))
    .filter((r) => r.t !== '' || r.fn);
}

// পর্বের ওপর অনুবাদ বসানো; যে অংশের অনুবাদ নেই সেটি মূলই থাকে
export function applyTranslation(porbo, trp, lang) {
  if (!trp) return porbo;
  const blocks = porbo.blocks.map((b, i) => {
    const v = trp.blocks?.[i];
    if (v === undefined || v === null || b.type === 'arabic') return b;
    if (typeof v === 'object') return { ...b, title: v.title ?? b.title, runs: toRuns(v.text ?? '', b.runs, lang) };
    return { ...b, runs: toRuns(v, b.runs, lang) };
  });
  const footnotes = (porbo.footnotes || []).map((f, i) => {
    const v = trp.footnotes?.[i];
    return v === undefined || v === null ? f : { ...f, runs: toRuns(v, f.runs, lang) };
  });
  const quiz = (porbo.quiz || []).map((q, j) => {
    const v = trp.quiz?.[j];
    if (!v) return q;
    return {
      ...q,
      q: v.q != null ? digits(v.q, lang) : q.q,
      options: Array.isArray(v.o) && v.o.length === q.options.length ? v.o.map((o) => digits(o, lang)) : q.options,
      explain: v.e != null ? digits(v.e, lang) : q.explain,
    };
  });
  return { ...porbo, title: trp.title ? digits(trp.title, lang) : porbo.title, blocks, footnotes, quiz };
}

// ভাষা অনুযায়ী দারস (লেখা ও কুইজসহ); অনুবাদ না থাকলে মূল বাংলা
export async function loadDarsLocalized(id, lang) {
  const d = await loadDars(id);
  if (!d || !lang || lang === 'bn') return d;
  const tr = await loadTranslation(lang, id);
  if (!tr) return d;
  return { ...d, porbos: d.porbos.map((p, i) => applyTranslation(p, tr.porbos?.[i], lang)) };
}
