// অনুবাদ যাচাই: node scripts/tr_check.mjs <en|ar> [দারস-নম্বর...]
// কী দেখে: সব ব্লক/পাদটীকা/কুইজ আছে কি, {{k}} চিহ্ন ঠিক আছে কি, বাংলা অক্ষর রয়ে গেছে কি,
// দৈর্ঘ্য অস্বাভাবিক (বাদ পড়ার সন্দেহ) কি, আর আরবিতে হরকতহীন শব্দ আছে কি।
import fs from 'fs';

const lang = process.argv[2];
if (!['en', 'ar'].includes(lang)) { console.log('ব্যবহার: node scripts/tr_check.mjs <en|ar> [দারস...]'); process.exit(1); }
const ids = process.argv.slice(3).length
  ? process.argv.slice(3).map((x) => String(x).padStart(2, '0'))
  : fs.readdirSync(`src/data/tr/${lang}`).filter((f) => /^dars-\d+\.json$/.test(f)).map((f) => f.match(/(\d+)/)[1]);

const BN = /[ঀ-৿]/;
const ARW = /[ء-ي]/g;
const HARAKAT = /[ً-ٰٓ]/; // harakat + maddah (U+0653)
const plain = (runs = []) => runs.map((r) => (r.fn ? '' : r.t || '')).join('');
const specialCount = (runs = []) => runs.filter((r) => r.fn || r.ar).length;
const tokens = (s) => [...String(s).matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
const textOf = (v) => (typeof v === 'object' && v ? `${v.title || ''} ${v.text || ''}` : String(v));

let totalIssues = 0;
for (const id of ids) {
  const src = JSON.parse(fs.readFileSync(`src/data/dars/dars-${id}.json`, 'utf8'));
  const path = `src/data/tr/${lang}/dars-${id}.json`;
  if (!fs.existsSync(path)) { console.log(`দারস ${id}: অনুবাদ-ফাইল নেই`); totalIssues += 1; continue; }
  const tr = JSON.parse(fs.readFileSync(path, 'utf8'));
  const issues = [];
  const unvoiced = new Map();
  let srcChars = 0;
  let trChars = 0;
  const checkAr = (s, where) => {
    if (lang !== 'ar') return;
    const clean = String(s).replace(/\{\{\d+\}\}/g, ' ');
    for (const w of clean.split(/[\s،؛؟.,;:!?()«»“”"'‘’\-–—/]+/)) {
      const letters = (w.match(ARW) || []).length;
      if (letters >= 2 && !HARAKAT.test(w)) unvoiced.set(w, (unvoiced.get(w) || 0) + 1);
    }
    if (/[A-Za-z]{2,}/.test(clean.replace(/XP/g, ''))) issues.push(`${where}: ল্যাটিন অক্ষর আছে`);
    // হরকতের ঘনত্ব: পূর্ণ হরকতে আরবি অক্ষর-প্রতি ~০.৭–১.০টি হরকত থাকে
    const letters = (clean.match(ARW) || []).length;
    const marks = (clean.match(/[ً-ْٰ]/g) || []).length;
    if (letters >= 25 && marks / letters < 0.6) issues.push(`${where}: হরকত কম (${(marks / letters).toFixed(2)})`);
  };
  const checkText = (v, where, expectedSpecial) => {
    const s = textOf(v);
    if (BN.test(s)) issues.push(`${where}: বাংলা অক্ষর রয়ে গেছে`);
    if (!s.trim()) issues.push(`${where}: ফাঁকা`);
    if (expectedSpecial !== undefined) {
      const t = tokens(s).sort((a, b) => a - b);
      const want = Array.from({ length: expectedSpecial }, (_, i) => i + 1);
      if (t.length !== want.length || t.some((x, i) => x !== want[i])) issues.push(`${where}: {{k}} চিহ্ন মেলেনি (পেয়েছি ${JSON.stringify(t)}, চাই ${JSON.stringify(want)})`);
    }
    checkAr(s, where);
  };

  src.porbos.forEach((p, pi) => {
    if (process.env.ONLY && String(p.no) !== process.env.ONLY) return; // ONLY=2 → শুধু ২য় পর্ব যাচাই
    const t = tr.porbos?.[pi];
    if (!t) { issues.push(`পর্ব ${p.no}: নেই`); return; }
    if (!t.title) issues.push(`পর্ব ${p.no}: শিরোনাম নেই`);
    else checkText(t.title, `পর্ব ${p.no} শিরোনাম`);
    p.blocks.forEach((b, i) => {
      if (b.type === 'arabic') return;
      const text = plain(b.runs);
      if (!text.trim() && !specialCount(b.runs)) return;
      const v = t.blocks?.[i];
      const where = `পর্ব ${p.no} ব্লক ${i}`;
      if (v === undefined || v === null) { issues.push(`${where}: অনুবাদ নেই`); return; }
      if (b.type === 'callout' && typeof v !== 'object') issues.push(`${where}: callout-এ {title,text} চাই`);
      checkText(v, where, specialCount(b.runs));
      const sl = text.length;
      const tl = textOf(v).replace(/\{\{\d+\}\}/g, '').length;
      srcChars += sl;
      trChars += tl;
      if (sl > 120 && !/﴿/.test(textOf(v))) {
        const ratio = tl / sl;
        const [lo, hi] = lang === 'ar' ? [0.55, 2.6] : [0.7, 2.3];
        if (ratio < lo || ratio > hi) issues.push(`${where}: দৈর্ঘ্য সন্দেহজনক (অনুপাত ${ratio.toFixed(2)})`);
      }
    });
    (p.footnotes || []).forEach((f, i) => {
      const v = t.footnotes?.[i];
      const where = `পর্ব ${p.no} পাদটীকা ${i}`;
      if (v === undefined || v === null) { issues.push(`${where}: অনুবাদ নেই`); return; }
      checkText(v, where, specialCount(f.runs));
    });
    if ((p.quiz || []).length !== (t.quiz || []).length) issues.push(`পর্ব ${p.no}: কুইজ ${(t.quiz || []).length}টি, মূলে ${p.quiz.length}টি`);
    (p.quiz || []).forEach((q, j) => {
      const v = t.quiz?.[j];
      const where = `পর্ব ${p.no} কুইজ ${j}`;
      if (!v) return;
      if (!v.q) issues.push(`${where}: প্রশ্ন নেই`); else checkText(v.q, `${where} প্রশ্ন`);
      if (!Array.isArray(v.o) || v.o.length !== q.options.length) issues.push(`${where}: অপশন-সংখ্যা মেলেনি`);
      else {
        v.o.forEach((o, k) => checkText(o, `${where} অপশন ${k}`));
        if (new Set(v.o).size !== v.o.length) issues.push(`${where}: দুটি অপশন একই`);
      }
      if (q.explain) { if (!v.e) issues.push(`${where}: ব্যাখ্যা নেই`); else checkText(v.e, `${where} ব্যাখ্যা`); }
    });
  });

  const bad = [...unvoiced.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\nদারস ${id}: ${issues.length} সমস্যা • অনুপাত ${(trChars / Math.max(1, srcChars)).toFixed(2)} • হরকতহীন শব্দ ${bad.length}`);
  issues.slice(0, 40).forEach((x) => console.log('  ✗ ' + x));
  if (issues.length > 40) console.log(`  … আরও ${issues.length - 40}টি`);
  if (bad.length) console.log('  হরকতহীন শব্দ: ' + bad.slice(0, 40).map(([w, n]) => `${w}×${n}`).join('، '));
  totalIssues += issues.length + bad.length;
}
console.log(`\nমোট সমস্যা/সতর্কতা: ${totalIssues}`);
process.exitCode = totalIssues ? 1 : 0;
