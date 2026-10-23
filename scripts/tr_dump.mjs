// অনুবাদের জন্য একটি দারসের লেখা ছাপে: node scripts/tr_dump.mjs <দারস-নম্বর> [পর্ব-নম্বর]
// বিশেষ রান (আরবি/ﷺ ও পাদটীকা-চিহ্ন) {{k:...}} আকারে দেখায়; অনুবাদে শুধু {{k}} রাখতে হবে।
import fs from 'fs';

const id = String(process.argv[2] || 1).padStart(2, '0');
const only = process.argv[3] ? Number(process.argv[3]) : null;
const d = JSON.parse(fs.readFileSync(`src/data/dars/dars-${id}.json`, 'utf8'));

export const render = (runs = []) => {
  let k = 0;
  return runs.map((r) => {
    if (r.fn) { k += 1; return `{{${k}:fn${r.fn}}}`; }
    if (r.ar) { k += 1; return `{{${k}:${r.t}}}`; }
    return r.t || '';
  }).join('');
};

console.log(`# দারস ${d.number}: ${d.title}`);
for (const p of d.porbos) {
  if (only && p.no !== only) continue;
  console.log(`\n## পর্ব ${p.no}: ${p.title}`);
  p.blocks.forEach((b, i) => {
    if (b.type === 'arabic') {
      const t = (b.runs || []).map((r) => r.t).join('');
      console.log(`[${i}] (আরবি, অপরিবর্তিত) ${t.slice(0, 50)}${t.length > 50 ? '…' : ''}`);
      return;
    }
    const txt = render(b.runs);
    if (!txt.trim()) return;
    const tag = b.type === 'p' ? '' : ` ${b.type}${b.title ? `(${b.title})` : ''}`;
    console.log(`[${i}]${tag} ${txt}`);
  });
  if (p.footnotes?.length) {
    console.log('-- পাদটীকা');
    p.footnotes.forEach((f, i) => console.log(`<${i}> (${f.n}) ${render(f.runs)}`));
  }
  if (p.quiz?.length) {
    console.log('-- কুইজ');
    p.quiz.forEach((q, j) => console.log(`Q${j}. ${q.q} || ${q.options.map((o, k) => `${'ABCD'[k]}) ${o}`).join(' | ')} || ব্যাখ্যা: ${q.explain || ''}`));
  }
}
