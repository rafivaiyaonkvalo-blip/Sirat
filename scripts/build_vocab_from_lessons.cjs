// বই-ভিত্তিক দারস (bookStages) থেকে vocabulary.json পুনর্গঠন — ফ্ল্যাশকার্ড/অনুশীলনের উৎস।
const fs = require('fs');
const path = require('path');
const vpath = path.join(__dirname, '../src/data/vocabulary.json');
const lessons = require('../src/data/lessons.json').lessons;
const old = JSON.parse(fs.readFileSync(vpath, 'utf8'));

const ORD = { 1: '১ম', 2: '২য়', 3: '৩য়', 4: '৪র্থ', 5: '৫ম', 6: '৬ষ্ঠ', 7: '৭ম', 8: '৮ম', 9: '৯ম', 10: '১০ম', 11: '১১তম', 12: '১২তম', 13: '১৩তম', 14: '১৪তম', 15: '১৫তম', 16: '১৬তম' };
const CH = { 1: 'الباب الأول', 2: 'الباب الثاني', 3: 'الباب الثالث', 4: 'الباب الرابع' };
const HEAD = /تَّمْرِين|التمرين|التَّمْرِين/;
const REVIEW = new Set(['vol1-ch3-l4', 'vol1-ch3-l5', 'vol1-ch3-l6']);
const nw = (s) => s.trim().split(/\s+/).length;

const rebuilt = lessons.filter(l => l.bookStages && l.bookStages.length && !REVIEW.has(l.id));
const rebuiltIds = new Set([...rebuilt.map(l => l.id), ...REVIEW]);
const keep = old.filter(x => !rebuiltIds.has(x.lessonId));
let id = 100000;
const out = [];
for (const l of rebuilt) {
  const m = /^vol(\d+)-ch(\d+)-l(\d+)$/.exec(l.id);
  if (!m) continue;
  const [vol, ch, ln] = [+m[1], +m[2], +m[3]];
  const page = parseInt(String(l.pages || '').replace(/\D+/g, ' ').trim().split(' ')[0], 10) || 0;
  const items = [];
  const seen = new Set();
  const add = (arabic, bangla, picture) => {
    if (!arabic || !bangla) return;
    arabic = arabic.trim(); bangla = bangla.trim();
    if (HEAD.test(arabic) || seen.has(arabic)) return;
    if (nw(arabic) > 12 || arabic.split("—").length > 2) return;
    seen.add(arabic);
    items.push({ arabic, bangla });
  };
  for (const v of l.vocabulary || []) add(v.arabic, v.bangla);
  for (const st of l.bookStages) for (const s of st.steps) if (s.type === 'intro' && s.word) add(s.word.arabic, s.word.bangla);
  for (const s of l.sentences || []) add(s.arabic, s.bangla);
  for (const it of items) {
    const sentence = nw(it.arabic) > 1;
    out.push({
      id: id++, arabic: it.arabic, bengali: it.bangla,
      partOfSpeech: sentence ? 'কিতাবের বাক্য' : 'কিতাবের শব্দ',
      volume: `${ORD[vol]} খণ্ড`, chapter: `${ORD[ch]} অধ্যায় (${CH[ch] || ''})`, lesson: `${ORD[ln] || ln + 'ম'} পাঠ`,
      page, type: sentence ? 'sentence' : 'word', typeLabel: sentence ? 'পূর্ণ বাক্য' : 'শব্দার্থ',
      volumeId: vol, chapterId: `vol${vol}-ch${ch}`, lessonNumberInChapter: ln, lessonId: l.id
    });
  }
}
const all = [...keep, ...out];
fs.writeFileSync(vpath, JSON.stringify(all, null, 2));
console.log('kept', keep.length, 'new', out.length, 'total', all.length);
