// প্রতি দারসের পাঠ সর্বোচ্চ ৩টিতে একত্র করে (একবারই চালানোর কথা)
import fs from 'fs';
const dir = 'src/data/dars';
const idxPath = 'src/data/darsIndex.json';
const index = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
const len = (p) => JSON.stringify(p.blocks).length;
const MAX = 3;

for (const meta of index) {
  if (meta.porbos[0].from) continue; // আগেই করা হয়েছে
  const f = `${dir}/dars-${String(meta.id).padStart(2, '0')}.json`;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const k = Math.min(MAX, d.porbos.length);
  const total = d.porbos.reduce((a, p) => a + len(p), 0);
  const groups = Array.from({ length: k }, () => []);
  let acc = 0;
  d.porbos.forEach((p, i) => {
    // পাঠের মাঝবিন্দু যে ভাগে পড়ে সেখানে; প্রতি ভাগে অন্তত একটি পাঠ নিশ্চিত
    let g = Math.min(k - 1, Math.floor(((acc + len(p) / 2) / total) * k));
    const left = d.porbos.length - i;
    const empty = groups.slice(g + 1).filter((x) => !x.length).length;
    if (left <= empty) g = groups.findIndex((x) => !x.length);
    if (groups[g - 1] && !groups[g - 1].length) g -= 1;
    groups[g].push({ p, i });
    acc += len(p);
  });
  const merged = groups.map((items, gi) => {
    const blocks = [];
    const footnotes = [];
    for (const { p } of items) {
      if (items.length > 1) blocks.push({ type: 'sub', runs: [{ t: p.title }] });
      blocks.push(...p.blocks);
      footnotes.push(...p.footnotes);
    }
    return {
      no: gi + 1,
      title: items.map((x) => x.p.title).join(' • '),
      from: items[0].p.no,
      to: items[items.length - 1].p.no,
      blocks,
      footnotes,
      quiz: items.flatMap((x) => x.p.quiz),
    };
  });
  d.porbos = merged;
  fs.writeFileSync(f, JSON.stringify(d));
  meta.porbos = merged.map((m) => ({ no: m.no, title: m.title, quiz: m.quiz.length, from: m.from, to: m.to, weight: len(m) }));
}
fs.writeFileSync(idxPath, JSON.stringify(index));
console.log(index.map((m) => m.porbos.map((p) => `${p.from}-${p.to}`).join('|')).join('\n'));
