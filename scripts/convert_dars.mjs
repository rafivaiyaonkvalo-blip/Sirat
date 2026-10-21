// Word (dars-NN.docx) → src/data/dars/dars-NN.json + src/data/darsIndex.json
// ব্যবহার: npm run convert -- <zip-or-folder>   (ডিফল্ট: sirat-word/ ফোল্ডার)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'src/data/dars');
const src = path.resolve(process.argv[2] || path.join(root, 'sirat-word'));

const BN = '০১২৩৪৫৬৭৮৯';
const bn2n = (s) => Number([...s].map((c) => (BN.includes(c) ? BN.indexOf(c) : c)).join(''));
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };
const decode = (s) => s.replace(/&(amp|lt|gt|quot|apos);/g, (m) => ENT[m]);

// ---- run / paragraph parsing -------------------------------------------
function parseRuns(pXml, { footnotes = null } = {}) {
  const runs = [];
  const re = /<w:r(?: [^>]*)?>(.*?)<\/w:r>/gs;
  let m;
  while ((m = re.exec(pXml))) {
    const r = m[1];
    const rPr = (r.match(/<w:rPr>(.*?)<\/w:rPr>/s) || [, ''])[1];
    const fnRef = r.match(/<w:footnoteReference w:id="(\d+)"/);
    if (fnRef) {
      runs.push({ t: '', fn: fnRef[1] });
      continue;
    }
    if (/<w:footnoteRef\/>/.test(r)) continue; // footnote এর ভেতরের নম্বর
    let t = '';
    for (const tm of r.matchAll(/<w:t(?: [^>]*)?>(.*?)<\/w:t>|<w:tab\/>/gs)) t += tm[0] === '<w:tab/>' ? ' ' : decode(tm[1]);
    if (!t) continue;
    const flag = (tag) => {
      const x = rPr.match(new RegExp(`<w:${tag}(?: w:val="(\\w+)")?/>`));
      return !!x && x[1] !== '0' && x[1] !== 'false';
    };
    const run = { t };
    if (flag('b')) run.b = 1;
    if (flag('i')) run.i = 1;
    if (/Traditional Arabic/.test(rPr) || /<w:rtl\/>/.test(rPr)) run.ar = 1;
    runs.push(run);
  }
  // একই ফরম্যাটের পাশাপাশি রান জোড়া লাগানো
  const merged = [];
  for (const r of runs) {
    const p = merged[merged.length - 1];
    if (p && !r.fn && !p.fn && !!p.b === !!r.b && !!p.i === !!r.i && !!p.ar === !!r.ar) p.t += r.t;
    else merged.push({ ...r });
  }
  return merged;
}

const plain = (runs) => runs.map((r) => r.t).join('').trim();

function parseParagraph(pXml) {
  const ppr = (pXml.match(/<w:pPr>(.*?)<\/w:pPr>/s) || [, ''])[1];
  const jc = (ppr.match(/<w:jc w:val="(\w+)"/) || [])[1] || '';
  const indLeft = Number((ppr.match(/<w:ind [^>]*w:left="(\d+)"/) || [])[1] || 0);
  const style = (ppr.match(/<w:pStyle w:val="(\w+)"/) || [])[1] || '';
  const sz = Number((pXml.match(/<w:sz w:val="(\d+)"/) || [])[1] || 0);
  const bold = /<w:b\/>/.test(pXml);
  const runs = parseRuns(pXml);
  return { jc, indLeft, style, sz, bold, runs, text: plain(runs) };
}

// ---- footnotes -------------------------------------------------------
function parseFootnotes(xml) {
  const map = {};
  for (const m of xml.matchAll(/<w:footnote (?:w:type="\w+" )?w:id="(\d+)">(.*?)<\/w:footnote>/gs)) {
    const runs = parseRuns(m[2]);
    if (runs.length) {
      runs[0].t = runs[0].t.replace(/^\s+/, '');
      map[m[1]] = runs;
    }
  }
  return map;
}

// ---- dars ---------------------------------------------------------------
async function convertDars(buf, file) {
  const zip = await JSZip.loadAsync(buf);
  const doc = await zip.file('word/document.xml').async('string');
  const fnXml = zip.file('word/footnotes.xml') ? await zip.file('word/footnotes.xml').async('string') : '';
  const fnMap = parseFootnotes(fnXml);
  const paras = [...doc.matchAll(/<w:p(?: [^>]*)?>.*?<\/w:p>/gs)].map((m) => parseParagraph(m[0]));

  const warn = [];
  const dars = { id: Number(file.match(/(\d+)/)[1]), number: 0, title: '', subtitle: '', author: [], porbos: [], sources: [], quizCount: 0 };

  // শিরোনাম ব্লক (প্রথম পর্বের হেডিং এর আগ পর্যন্ত)
  const isPorboHead = (p) => p.jc === 'left' && p.sz === 27 && p.bold && p.text;
  const firstHead = paras.findIndex(isPorboHead);
  const head = paras.slice(0, firstHead).filter((p) => p.text && !/^◆/.test(p.text));
  dars.number = bn2n(head[0].text.replace('দারস', '').trim());
  dars.title = head[1].text;
  dars.subtitle = head[2]?.text || '';
  dars.author = head.slice(3).map((p) => p.text);

  let cur = null;
  let mode = 'porbo'; // porbo | sources | mcq
  let fnCounter = 0;
  const mcq = [];
  let q = null;

  const pushBlock = (b) => cur.blocks.push(b);
  const attachFootnotes = (runs) => {
    for (const r of runs) {
      if (r.fn) {
        if (!fnMap[r.fn]) {
          warn.push(`footnote ${r.fn} missing`);
          r.fn = 0;
          continue;
        }
        fnCounter += 1;
        cur.footnotes.push({ n: fnCounter, runs: fnMap[r.fn] });
        r.fn = fnCounter;
      }
    }
    return runs;
  };

  for (let i = firstHead; i < paras.length; i++) {
    const p = paras[i];
    if (!p.text && !p.runs.some((r) => r.fn)) continue;

    if (mode === 'porbo' && isPorboHead(p)) {
      const no = dars.porbos.length + 1;
      const num = p.text.match(/^([০-৯]+)\.\s/);
      if (num && bn2n(num[1]) !== no) warn.push(`porbo no ${num[1]} out of order`);
      cur = { no, title: p.text.replace(/^[০-৯]+\.\s*/, ''), blocks: [], footnotes: [], subs: [] };
      fnCounter = 0;
      dars.porbos.push(cur);
      continue;
    }
    if (/^─+$/.test(p.text)) continue;
    if (p.text === 'সহায়ক উৎস') { mode = 'sources'; continue; }
    if (p.text.startsWith('বহুনির্বাচনী প্রশ্ন')) { mode = 'mcq'; continue; }

    if (mode === 'sources') {
      if (p.style === 'ListBullet' || p.indLeft) dars.sources.push(p.runs);
      else if (p.text) dars.sources.push(p.runs);
      continue;
    }

    if (mode === 'mcq') {
      if (/^[০-৯]+।\s/.test(p.text)) {
        q = { q: p.text.replace(/^[০-৯]+।\s*/, ''), options: [], answer: -1, explain: '', porbo: 0 };
        mcq.push(q);
      } else if (q && /^\([কখগঘ]\)\s/.test(p.text)) q.options.push(p.text.replace(/^\([কখগঘ]\)\s*/, ''));
      else if (q && /^উত্তর:\s*\(([কখগঘ])\)/.test(p.text)) {
        const mm = p.text.match(/^উত্তর:\s*\(([কখগঘ])\)[।.]?\s*(.*)$/s);
        q.answer = 'কখগঘ'.indexOf(mm[1]);
        q.explain = mm[2].trim();
      } else if (q && /^\[.+\]$/.test(p.text)) {
        // ট্যাগ: [অধ্যায় ১ → শিরোনাম] অথবা [শিরোনাম]
        q.ref = p.text.slice(1, -1).replace(/^অধ্যায়\s*[০-৯]+\s*→\s*/, '').trim();
        const hit = dars.porbos.findIndex((pb) => pb.title === q.ref || pb.subs.includes(q.ref));
        if (hit >= 0) q.porbo = hit + 1;
        else warn.push(`mcq tag matches no porbo: ${q.ref.slice(0, 40)}`);
      }
      continue;
    }

    // পর্বের ভেতরের কনটেন্ট
    if (!cur) continue;
    if (p.jc === 'left' && p.bold && /^◆\s/.test(p.text)) {
      const text = p.text.replace(/^◆\s*/, '');
      cur.subs.push(text);
      pushBlock({ type: 'sub', runs: attachFootnotes(parseRuns(`<w:r><w:t>${text}</w:t></w:r>`)) });
      continue;
    }
    if (p.text.startsWith('sub,')) {
      const rest = p.text.slice(4);
      const label = 'আমলি সংকল্প';
      if (rest.startsWith(label)) {
        pushBlock({ type: 'callout', title: label, runs: [{ t: rest.slice(label.length).trim() }] });
      } else {
        warn.push(`unrecognized sub, marker: ${rest.slice(0, 30)}`);
        pushBlock({ type: 'p', runs: [{ t: rest }] });
      }
      continue;
    }
    const runs = attachFootnotes(p.runs);
    if (p.jc === 'center' && p.sz >= 28 && p.runs.every((r) => r.ar)) pushBlock({ type: 'arabic', runs });
    else if (p.indLeft >= 400) pushBlock({ type: 'quote', runs });
    else if (p.style === 'ListBullet') pushBlock({ type: 'bullet', runs });
    else if (p.jc === 'center') pushBlock({ type: 'center', runs });
    else pushBlock({ type: 'p', runs });
  }

  // MCQ যাচাই ও পর্বে বিন্যাস
  const quizByPorbo = {};
  for (const m of mcq) {
    if (m.options.length !== 4 || m.answer < 0 || !m.porbo) warn.push(`bad mcq: ${m.q.slice(0, 40)}`);
    if (m.porbo > dars.porbos.length) warn.push(`mcq porbo ${m.porbo} > ${dars.porbos.length}`);
    (quizByPorbo[m.porbo] ||= []).push({ q: m.q, options: m.options, answer: m.answer, explain: m.explain });
  }
  for (const pb of dars.porbos) { pb.quiz = quizByPorbo[pb.no] || []; delete pb.subs; }
  dars.quizCount = mcq.length;
  return { dars, warn };
}

// ---- main --------------------------------------------------------------
async function loadSources() {
  const files = [];
  if (fs.statSync(src).isDirectory()) {
    for (const f of fs.readdirSync(src).filter((f) => /^dars-\d+\.docx$/.test(f)).sort()) files.push([f, fs.readFileSync(path.join(src, f))]);
  } else {
    const z = await JSZip.loadAsync(fs.readFileSync(src));
    for (const f of Object.keys(z.files).filter((f) => /^dars-\d+\.docx$/.test(f)).sort()) files.push([f, await z.file(f).async('nodebuffer')]);
  }
  return files;
}

fs.mkdirSync(outDir, { recursive: true });
const index = [];
let totalWarn = 0;
for (const [file, buf] of await loadSources()) {
  const { dars, warn } = await convertDars(buf, file);
  const nn = String(dars.id).padStart(2, '0');
  fs.writeFileSync(path.join(outDir, `dars-${nn}.json`), JSON.stringify(dars));
  index.push({
    id: dars.id,
    number: dars.number,
    title: dars.title,
    subtitle: dars.subtitle,
    porbos: dars.porbos.map((p) => ({ no: p.no, title: p.title, quiz: p.quiz.length })),
  });
  const fnTotal = dars.porbos.reduce((a, p) => a + p.footnotes.length, 0);
  console.log(`${file}: ${dars.porbos.length} পর্ব, ${fnTotal} footnote, ${dars.quizCount} MCQ, ${dars.sources.length} source${warn.length ? '  ⚠ ' + warn.join(' | ') : ''}`);
  totalWarn += warn.length;
}
fs.writeFileSync(path.join(root, 'src/data/darsIndex.json'), JSON.stringify(index));
console.log(`\n${index.length} dars converted, ${totalWarn} warning(s)`);
