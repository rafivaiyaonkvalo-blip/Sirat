// প্লেলিস্ট (সীরাত কোর্স ২০২৬) থেকে দারস → ভিডিও; প্রতি দারসের ৩ ধাপ লেখার দৈর্ঘ্য অনুযায়ী ভিডিওর সময়ে ভাগ হয়।
// দারসে একাধিক ভিডিও থাকলে সেগুলো পরপর জুড়ে ধরা হয়; কোনো ধাপ দুই ভিডিওর মাঝে পড়লে সীমানা ভিডিওর শেষে টেনে আনা হয়।
import fs from 'fs';
const t = (s) => s.split(':').map(Number).reduce((a, x) => a * 60 + x, 0);
const V = {
  1: [['LOzINE7H2nQ', '1:01:23']], 2: [['UKD-9ILoyyc', '1:04:00']], 3: [['UheKaPynbaY', '1:31:47']], 4: [['SdMCmpIhCGM', '1:24:05']],
  5: [['35NitBLp6X8', '51:16'], ['-jLRt2rgMRg', '24:41']],
  6: [['v-SXwUAZNLU', '32:16'], ['t1hDKM9RU-c', '58:26']],
  7: [['qjRK4CQG-DQ', '1:00:22'], ['uLWLxNji4JY', '59:23']],
  8: [['hZdE4QhSO7o', '1:04:18']], 9: [['j8gAkPaB1Gw', '1:11:37']], 10: [['OXe6pQEwrDY', '58:37']],
  11: [['pOiHbJSIu7s', '1:12:27'], ['9V-E0G0ef-E', '1:40:14']],
  12: [['jsW9Cabj3a0', '53:03']], 13: [['V9jJUQ75Y8w', '1:27:54']], 14: [['RgPehGAO2Ds', '1:29:26']], 15: [['HdHR_P0ewcE', '1:46:47']],
  16: [['muAilPwleRg', '1:01:59']], 17: [['vToglP7fJGs', '43:03']], 18: [['L2NdNtcI_Go', '1:04:39']], 19: [['4qFYJUHPURM', '1:57:21']],
  20: [['Bw-kQJl3_tg', '1:09:16']], 21: [['S7yI6fzj0mw', '1:06:41']], 22: [['JBkgCf9z9Cw', '54:20']], 23: [['DyUmLgt40Us', '1:30:29']],
};
const idx = JSON.parse(fs.readFileSync('src/data/darsIndex.json', 'utf8'));
const out = JSON.parse(fs.readFileSync('src/data/videos.json', 'utf8'));
for (const k of Object.keys(out)) if (k !== '_help') delete out[k];
const url = (id) => `https://www.youtube.com/watch?v=${id}`;
for (const [dars, list] of Object.entries(V)) {
  const w = idx.find((d) => d.id === Number(dars)).porbos.map((p) => p.weight);
  const W = w.reduce((a, b) => a + b, 0);
  const vids = list.map(([id, d]) => ({ id, d: t(d) }));
  const total = vids.reduce((a, v) => a + v.d, 0);
  let cuts = [(w[0] / W) * total, ((w[0] + w[1]) / W) * total]; // মোট সময়ে দুই কাটার জায়গা
  // দুই ভিডিওর সীমানা: যে কাট সবচেয়ে কাছে, সেটি সীমানায় বসে
  if (vids.length === 2) {
    const edge = vids[0].d;
    const i = Math.abs(cuts[0] - edge) <= Math.abs(cuts[1] - edge) ? 0 : 1;
    cuts[i] = edge;
    if (cuts[0] >= cuts[1]) cuts[1] = cuts[0] + 1;
  }
  const bounds = [0, ...cuts, total];
  const parts = [];
  for (let i = 0; i < 3; i++) {
    let a = bounds[i], b = bounds[i + 1], off = 0, v = vids[0];
    for (const x of vids) { if (a < off + x.d - 0.5) { v = x; break; } off += x.d; }
    b = Math.min(b, off + v.d);
    parts.push({ url: url(v.id), start: Math.round(a - off), end: Math.round(b - off) });
  }
  out[dars] = vids.length === 1 ? { url: url(vids[0].id), parts: parts.map(({ start, end }) => ({ start, end })) } : { parts };
}
fs.writeFileSync('src/data/videos.json', JSON.stringify(out, null, 2) + '\n');
for (const d of [1, 5, 6, 11]) console.log(d, JSON.stringify(out[d]));
