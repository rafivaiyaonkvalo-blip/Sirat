// final_times.json (ভিডিওর ট্রান্সক্রিপ্ট ও লেখা মিলিয়ে বের করা সময়) → src/data/videos.json
import fs from 'fs';
const [,, timesFile] = process.argv;
const times = JSON.parse(fs.readFileSync(timesFile, 'utf8'));
const f = 'src/data/videos.json';
const videos = JSON.parse(fs.readFileSync(f, 'utf8'));
for (const [dars, parts] of Object.entries(times)) {
  videos[dars] = {
    parts: parts.map((segs) => (segs.length === 1 ? segs[0] : { segments: segs })),
  };
}
fs.writeFileSync(f, JSON.stringify(videos, null, 2) + '\n');
console.log('updated dars:', Object.keys(times).join(', '));
