// অনুবাদের অংশ-ফাইল জুড়ে চূড়ান্ত ফাইল বানায়:
//   scripts/tr_parts/<en|ar>/NN-P.json  (NN = দারস, P = পর্ব; ফরম্যাট loadTranslation.js-এর "porbos[]"-এর একটি উপাদান)
//   → src/data/tr/<en|ar>/dars-NN.json
// ব্যবহার: node scripts/tr_merge.mjs <en|ar> [দারস...]
import fs from 'fs';

const lang = process.argv[2];
if (!['en', 'ar'].includes(lang)) { console.log('ব্যবহার: node scripts/tr_merge.mjs <en|ar> [দারস...]'); process.exit(1); }
const dir = `scripts/tr_parts/${lang}`;
const all = fs.readdirSync(dir).filter((f) => /^\d+-\d+\.json$/.test(f));
const ids = process.argv.slice(3).length ? process.argv.slice(3).map((x) => String(x).padStart(2, '0')) : [...new Set(all.map((f) => f.split('-')[0]))].sort();
fs.mkdirSync(`src/data/tr/${lang}`, { recursive: true });
for (const id of ids) {
  const src = JSON.parse(fs.readFileSync(`src/data/dars/dars-${id}.json`, 'utf8'));
  const porbos = src.porbos.map((p) => {
    const f = `${dir}/${id}-${p.no}.json`;
    if (!fs.existsSync(f)) return {};
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  });
  const have = porbos.filter((p) => p.title).length;
  fs.writeFileSync(`src/data/tr/${lang}/dars-${id}.json`, JSON.stringify({ porbos }));
  console.log(`দারস ${id}: ${have}/${src.porbos.length} পর্ব`);
}
