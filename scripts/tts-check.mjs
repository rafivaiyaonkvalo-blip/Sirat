// api/tts.js-এর কণ্ঠ যাচাই (GitHub Actions-এ চলে; ffmpeg লাগে)
// - Microsoft-এর পুরুষ কণ্ঠ কাজ করছে কি না (Google-এর মেয়েদের কণ্ঠে ফেরত যাওয়া হয় না)
// - ওয়াকফ ছাড়া শেষ হরকত: কাটার আগে স্বর বাজছে, আর কাটা জায়গা নিঃশব্দ (ক্লিক নেই)
// - শিশু কণ্ঠ: স্বরের উচ্চতা (F0) স্বাভাবিকের চেয়ে বেশি
// ফলাফলের MP3 ফাইল tts-check-out/ ফোল্ডারে থাকে (Actions artifact হিসেবে শোনা যায়)
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { synthesizeEdge, synthesizeArabicMale, synthesizeBanglaMale, prepareArabicWithoutWaqf } from '../api/tts.js';

const OUT = 'tts-check-out';
fs.mkdirSync(OUT, { recursive: true });
const SR = 16000;
const CHILD_AR = '+70Hz';
const CHILD_BN = '+65Hz';

function decode(buf) {
  const pcm = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', 'pipe:0', '-f', 's16le', '-ac', '1', '-ar', String(SR), 'pipe:1'], { input: buf, maxBuffer: 64 * 1024 * 1024 });
  const out = new Float32Array(pcm.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = pcm.readInt16LE(i * 2) / 32768;
  return out;
}

const ms = (n) => Math.round(n);
const durMs = (pcm) => (pcm.length / SR) * 1000;
function rmsDb(pcm, fromMs, toMs) {
  const a = Math.max(0, Math.floor((fromMs / 1000) * SR));
  const b = Math.min(pcm.length, Math.floor((toMs / 1000) * SR));
  if (b <= a) return -120;
  let s = 0;
  for (let i = a; i < b; i++) s += pcm[i] * pcm[i];
  return Math.round(10 * Math.log10(s / (b - a) + 1e-12));
}
// endMs-এর আগের ৫০ মি.সে.-এ সর্বোচ্চ autocorrelation (০.৬-এর বেশি = স্বর বাজছে)
function voicingBefore(pcm, endMs) {
  const end = Math.floor((endMs / 1000) * SR);
  const frame = Math.floor(SR * 0.05);
  const start = end - frame;
  const minLag = Math.floor(SR / 400);
  const maxLag = Math.floor(SR / 70);
  if (start - maxLag < 0) return 0;
  let e1 = 0;
  for (let i = start; i < end; i++) e1 += pcm[i] ** 2;
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let c = 0;
    let e2 = 0;
    for (let i = start; i < end; i++) {
      c += pcm[i] * pcm[i - lag];
      e2 += pcm[i - lag] ** 2;
    }
    best = Math.max(best, c / Math.sqrt(e1 * e2 + 1e-12));
  }
  return Math.round(best * 100) / 100;
}
// স্বরের উচ্চতা: ৪০ মি.সে. ফ্রেমে autocorrelation, স্বরযুক্ত ফ্রেমের মধ্যমা
function medianF0(pcm) {
  const frame = Math.floor(SR * 0.04);
  const hop = Math.floor(SR * 0.01);
  const minLag = Math.floor(SR / 400);
  const maxLag = Math.floor(SR / 70);
  const f0s = [];
  for (let start = 0; start + frame + maxLag < pcm.length; start += hop) {
    let energy = 0;
    for (let i = 0; i < frame; i++) energy += pcm[start + i] ** 2;
    if (energy / frame < 1e-4) continue;
    let best = 0;
    let bestLag = 0;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let c = 0;
      let e2 = 0;
      for (let i = 0; i < frame; i++) {
        c += pcm[start + i] * pcm[start + i + lag];
        e2 += pcm[start + i + lag] ** 2;
      }
      const r = c / Math.sqrt(energy * e2 + 1e-12);
      if (r > best) { best = r; bestLag = lag; }
    }
    if (best > 0.6 && bestLag) f0s.push(SR / bestLag);
  }
  if (!f0s.length) return 0;
  f0s.sort((x, y) => x - y);
  return Math.round(f0s[Math.floor(f0s.length / 2)]);
}

const problems = [];

// লাইভ সাইট এখন কোন কণ্ঠ-ইঞ্জিন ব্যবহার করছে (তথ্যের জন্য; deploy-এর আগে পুরোনো কোড থাকতে পারে)
console.log('== live site (arabic.markazuliman.com) ==');
for (const [label, query] of [
  ['arabic', `text=${encodeURIComponent('كِتَابٌ')}&voice=ar-KW-FahedNeural`],
  ['bangla', `text=${encodeURIComponent('আমি আরবি শিখি')}&lang=bn&voice=bn-BD-PradeepNeural`]
]) {
  try {
    const r = await fetch(`https://arabic.markazuliman.com/api/tts?${query}&nocache=${Date.now()}`);
    console.log(`${label}: HTTP ${r.status} engine=${r.headers.get('x-tts-engine')}`);
  } catch (e) {
    console.log(`${label}: ERROR ${e.message}`);
  }
}

console.log('== ওয়াকফ ছাড়া শেষ হরকত (Fahed, শিশু কণ্ঠ) ==');
const words = ['اَلْكِتَابُ', 'ذَهَبَ', 'فِي الْبَيْتِ', 'كِتَابٌ', 'هٰذَا قَلَمٌ', 'اَلْمُدَرِّسُ فِي الْفَصْلِ'];
for (const [k, w] of words.entries()) {
  const text = prepareArabicWithoutWaqf(w);
  try {
    const held = await synthesizeEdge({ text, voice: 'ar-KW-FahedNeural', lang: 'ar-SA', rate: '-22%', pitch: CHILD_AR, hold: true });
    const trimmed = decode(held.buffer);
    const full = decode(held.full);
    const filler = held.boundaries[held.boundaries.length - 1];
    const row = {
      word: w,
      fillerStartMs: ms(filler.startMs),
      cutMs: ms(held.trimmedAtMs),
      trimmedDurMs: ms(durMs(trimmed)),
      voicedAtFillerStart: voicingBefore(full, filler.startMs),
      last30Db: rmsDb(trimmed, durMs(trimmed) - 30, durMs(trimmed))
    };
    console.log(JSON.stringify(row));
    fs.writeFileSync(`${OUT}/${k + 1}-nowaqf.mp3`, held.buffer);
    if (row.last30Db > -30) problems.push(`${w}: কাটা জায়গায় শব্দ (${row.last30Db} dB)`);
  } catch (e) {
    console.log(JSON.stringify({ word: w, error: e.message }));
    problems.push(`${w}: ${e.message}`);
  }
}

console.log('== পুরো পথ (handler-এর মতো) ==');
try {
  const ar = await synthesizeArabicMale('اَلْكِتَابُ', { pitch: CHILD_AR });
  console.log(`arabic: voice=${ar.voice} mode=${ar.mode} bytes=${ar.buffer.length}`);
  if (ar.mode !== 'hold') problems.push('Arabic did not use hold mode');
  const bn = await synthesizeBanglaMale('আমি আরবি শিখি।', { pitch: CHILD_BN });
  console.log(`bangla: voice=${bn.voice} bytes=${bn.buffer.length}`);
} catch (e) {
  console.log(`ERROR ${e.message}`);
  problems.push(e.message);
}

console.log('== স্বরের উচ্চতা (F0, Hz) ==');
const sampleAr = prepareArabicWithoutWaqf('اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ');
const sampleBn = 'আসসালামু আলাইকুম, আমি আরবি শিখছি।';
const f0 = {};
for (const [key, voice, pitch] of [
  ['arAdult', 'ar-KW-FahedNeural', 'default'], ['arChild', 'ar-KW-FahedNeural', CHILD_AR],
  ['bnAdult', 'bn-BD-PradeepNeural', 'default'], ['bnChild', 'bn-BD-PradeepNeural', CHILD_BN]
]) {
  const bn = voice.startsWith('bn-');
  try {
    const out = await synthesizeEdge({ text: bn ? sampleBn : sampleAr, voice, lang: bn ? 'bn-BD' : 'ar-SA', rate: bn ? '-4%' : '-22%', pitch, hold: false });
    f0[key] = medianF0(decode(out.buffer));
    fs.writeFileSync(`${OUT}/voice-${key}.mp3`, out.buffer);
    console.log(`${voice} ${pitch}: F0 ≈ ${f0[key]} Hz`);
  } catch (e) {
    console.log(`${voice} ${pitch}: ERROR ${e.message}`);
    problems.push(`${voice}: ${e.message}`);
  }
}
if (f0.arChild && f0.arAdult && f0.arChild < f0.arAdult + 30) problems.push('Arabic child pitch is not higher');
if (f0.bnChild && f0.bnAdult && f0.bnChild < f0.bnAdult + 30) problems.push('Bangla child pitch is not higher');

console.log(problems.length ? `PROBLEMS:\n- ${problems.join('\n- ')}` : 'সব ঠিক আছে');
process.exit(problems.length ? 1 : 0);
