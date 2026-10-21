// scripts/tamrin_book/part*.cjs থেকে কিতাব-ভিত্তিক তামরীন src/data/tamrinBook.json-এ লেখে।
// tamrinKitabiData.js এই ফাইল দিয়ে একই id-র পুরনো তামরীন বদলে দেয়।
// ব্যবহার: node scripts/apply_tamrin_book.cjs
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'tamrin_book');
const out = [];
const errors = [];
// একটি তামরীনকে ছোট ছোট নোডে ভাঙে: প্রতি নোডে ~১০–১৬ ধাপ (ছোট অংশসহ), ক/গ-এর সীমানায় আগে ভাঙে
const stepsOf = (e) => (e.chunks ? e.chunks.length + 1 : 1);
const splitNodes = (exercises) => {
  const nodes = [];
  let cur = [];
  let n = 0;
  exercises.forEach((e) => {
    const sectionChange = cur.length && cur[cur.length - 1].section !== e.section;
    if (cur.length && ((sectionChange && n >= 8) || n + stepsOf(e) > 16 || n >= 12)) {
      nodes.push(cur);
      cur = [];
      n = 0;
    }
    cur.push(e);
    n += stepsOf(e);
  });
  if (cur.length) nodes.push(cur);
  // শেষ নোড খুব ছোট (<৬ ধাপ) হলে আগেরটির সাথে জুড়ে দিই
  if (nodes.length > 1 && nodes[nodes.length - 1].reduce((a, e) => a + stepsOf(e), 0) < 6) {
    const last = nodes.pop();
    nodes[nodes.length - 1].push(...last);
  }
  return nodes;
};

const AR = /[\u0621-\u064A]/;
const HAR = /[\u064B-\u0652\u0670]/;

for (const f of fs.readdirSync(dir).filter(x => /^part\d+\.cjs$/.test(x)).sort()) {
  const partId = Number(f.match(/\d+/)[0]);
  require(path.join(dir, f)).slice().sort((x, y) => x.n - y.n).forEach(t => {
    t.exercises.forEach((e, i) => {
      const where = `${f}#T${t.n}/${i + 1}`;
      const words = e.arabicSentence.split(/[\s،؟.!:؛]+/).filter(w => AR.test(w) && w.length > 1);
      words.filter(w => !HAR.test(w)).forEach(w => errors.push(`${where}: হরকত নেই — ${w}`));
      if (e.chunks) {
        const j = e.chunks.map(c => c.arabic).join(' ');
        if (j !== e.arabicSentence) errors.push(`${where}: chunks মেলেনি`);
      }
    });
    splitNodes(t.exercises).forEach((exs, k, all) => {
      out.push({
        id: k === 0 ? `tamrin-p${partId}-t${t.n}` : `tamrin-p${partId}-t${t.n}-${k + 1}`,
        partId,
        tamrinNumber: t.n,
        subIndex: k + 1,
        subCount: all.length,
        page: t.page,
        exercises: exs
      });
    });
  });
}
// কিতাবের শেষের "নতুন শব্দ" তালিকা (scripts/tamrin_book/glossary.cjs) — তামরীন অংশে শব্দ অনুশীলনের জন্য
const glossary = require('./tamrin_book/glossary.cjs').map((g) => {
  let page = null;
  const seen = new Set();
  const words = [];
  g.text.trim().split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
    if (line.startsWith('@')) { page = Number(line.slice(1)); return; }
    const [arabic, bangla] = line.split(' // ').map((x) => (x || '').trim());
    const where = `glossary p${g.part} ${g.title || `${g.from}-${g.to}`}: ${line}`;
    if (!arabic || !bangla || !AR.test(arabic) || AR.test(bangla)) { errors.push(`${where}: ভুল লাইন`); return; }
    arabic.split(/\s+/).filter((w) => AR.test(w) && !HAR.test(w)).forEach((w) => errors.push(`${where}: হরকত নেই — ${w}`));
    if (seen.has(arabic)) return;
    seen.add(arabic);
    words.push({ arabic, bangla, page });
  });
  const pages = [...new Set(words.map((w) => w.page))];
  return {
    id: g.title ? `tamrin-words-p${g.part}-${pages[0]}` : `tamrin-words-p${g.part}-t${g.from}-${g.to}`,
    partId: g.part,
    from: g.from,
    to: g.to,
    title: g.title || null,
    pages,
    words
  };
});

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const parts = require('./tamrin_book/parts.cjs');
fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'tamrinBook.json'), JSON.stringify({ parts, nodes: out, glossary }, null, 1) + '\n');
console.log(`tamrinBook.json: ${out.length} node, ${out.reduce((n, t) => n + t.exercises.length, 0)} exercises, ${glossary.reduce((n, g) => n + g.words.length, 0)} glossary words`);
