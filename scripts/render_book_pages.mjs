// কিতাবের স্ক্যান করা PDF (downloaded_original.pdf) থেকে পৃষ্ঠা PNG ছবিতে রেন্ডার করে।
// বইয়ের পৃষ্ঠা নম্বর = PDF পৃষ্ঠা + ২ (যেমন বই পৃ. ১৭ = PDF পৃ. ১৫)।
//
// ব্যবহার:
//   node scripts/render_book_pages.mjs <outDir> <fromPdfPage> <toPdfPage> [scale=2.2] [crop=x0,y0,x1,y1 (0–1 ratio)]

import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

const [outDir, fromArg, toArg, scaleArg = '2.2', cropArg] = process.argv.slice(2);
if (!outDir || !fromArg) {
  console.error('usage: node scripts/render_book_pages.mjs <outDir> <from> <to> [scale] [crop]');
  process.exit(1);
}
const from = Number(fromArg);
const to = Number(toArg || fromArg);
const scale = Number(scaleArg);
const crop = cropArg ? cropArg.split(',').map(Number) : null;

fs.mkdirSync(outDir, { recursive: true });
const data = new Uint8Array(fs.readFileSync('downloaded_original.pdf'));
const doc = await pdfjs.getDocument({ data, verbosity: 0 }).promise;

for (let p = from; p <= to; p++) {
  const page = await doc.getPage(p);
  const vp = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;

  let out = canvas;
  if (crop) {
    const [x0, y0, x1, y1] = crop;
    const sx = Math.round(x0 * canvas.width);
    const sy = Math.round(y0 * canvas.height);
    const w = Math.round((x1 - x0) * canvas.width);
    const h = Math.round((y1 - y0) * canvas.height);
    out = createCanvas(w, h);
    out.getContext('2d').drawImage(canvas, sx, sy, w, h, 0, 0, w, h);
  }
  const name = `p${String(p).padStart(3, '0')}${crop ? '-crop' : ''}.png`;
  fs.writeFileSync(path.join(outDir, name), await out.encode('png'));
  console.log(name, `${out.width}x${out.height}`);
}
