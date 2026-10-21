// প্রতিটি পর্বে আরও MCQ ধাপ যোগ করে — শুধু ওই দারসের কিতাব-শব্দ/বাক্য থেকে।
// ব্যবহার: module.exports-এর আগে  require('../lib/mcq_boost.cjs')(bookStages);

const MAX_STEPS = 24;      // একটি পর্বে ধাপের সর্বোচ্চ সীমা
const TARGET_ADD = 8;      // প্রতি পর্বে চেষ্টা করে এতগুলো MCQ যোগ হবে
const MAX_OPTIONS = 3;

const isWord = (ar) => !/\s/.test(ar.trim());

// একটি ধাপ থেকে পরীক্ষাযোগ্য (আরবি, বাংলা) জোড়া বের করে
const itemsOf = (step) => {
  switch (step.type) {
    case 'intro':
      return step.word ? [{ arabic: step.word.arabic, bangla: step.word.bangla }] : [];
    case 'match_pairs':
      return (step.pairs || []).map(p => ({ arabic: p.arabic, bangla: p.bangla }));
    case 'sentence_builder':
      return step.targetArabic ? [{ arabic: step.targetArabic, bangla: step.targetBangla }] : [];
    case 'fill_blank':
      return step.fullArabic ? [{ arabic: step.fullArabic, bangla: step.targetBangla }] : [];
    default:
      return [];
  }
};

// শিরোনাম/নির্দেশনা (যেমন "التَّمْرِينُ الأَوَّلُ") পরীক্ষার আইটেম নয়
const isHeading = (it) => /تَّمْرِين|التمرين/.test(it.arabic) || /^(তামরীন|ছবি দেখে|প্রশ্ন করো)/.test(it.bangla);
const valid = (it) => it && it.arabic && it.bangla && it.arabic.trim() && it.bangla.trim() && !isHeading(it);

const uniqBy = (arr, key) => {
  const seen = new Set();
  return arr.filter(x => (seen.has(key(x)) ? false : (seen.add(key(x)), true)));
};

// ৪টি বা বেশি MCQ পরপর থাকলে, প্রতিটিকে তার নিজের intro-র কিছু পরে ছড়িয়ে দেয়
const spreadLongRuns = (steps) => {
  const out = steps.slice();
  let i = 0;
  while (i < out.length) {
    if (out[i].type !== 'mcq') { i++; continue; }
    let j = i;
    while (j < out.length && out[j].type === 'mcq') j++;
    if (j - i >= 4) {
      const run = out.slice(i, j);
      const rest = out.slice(0, i).concat(out.slice(j));
      const keep = [];
      const anchored = [];
      run.forEach((m, k) => {
        const a = m.word && m.word.arabic;
        const idx = rest.findIndex((x, t) => t < i && x.type === 'intro' && x.word && (x.word.arabic === a || x.word.bangla === a));
        if (k >= 1 && idx >= 0) anchored.push({ idx, m }); else keep.push(m);
      });
      if (anchored.length) {
        const merged = [];
        rest.forEach((x, t) => {
          merged.push(x);
          anchored.filter(a => Math.min(a.idx + 1, i - 1) === t).forEach(a => merged.push(a.m));
          if (t === i - 1) keep.forEach(m => merged.push(m));
        });
        return spreadLongRuns(merged);
      }
    }
    i = j;
  }
  return out;
};

module.exports = function boost(bookStages) {
  bookStages.forEach(st => { st.steps = spreadLongRuns(st.steps); });
  // পুরো দারসের পুল (ভুল অপশনের জন্য)
  const pool = uniqBy(
    bookStages.flatMap(s => s.steps.flatMap(itemsOf)).filter(valid),
    x => x.arabic
  );

  for (const stage of bookStages) {
    if (/quiz$/.test(stage.id)) continue;
    const steps = stage.steps;
    const room = MAX_STEPS - steps.length;
    if (room <= 0) continue;

    // এই পর্বে ইতিমধ্যে যেসব আরবি/বাংলা MCQ-তে আছে
    const mcqKeys = new Set();
    steps.filter(s => s.type === 'mcq').forEach(s => {
      if (s.word) { mcqKeys.add(s.word.arabic); mcqKeys.add(s.word.bangla); }
      (s.options || []).forEach(o => mcqKeys.add(o.text));
    });

    // পর্বের নিজস্ব আইটেম (অবস্থানসহ); কম হলে পুল থেকে
    let own = [];
    steps.forEach((s, idx) => itemsOf(s).filter(valid).forEach(it => own.push({ ...it, idx })));
    own = uniqBy(own, x => x.arabic);
    if (own.length < 4) {
      const extra = pool.filter(p => !own.some(o => o.arabic === p.arabic)).map(p => ({ ...p, idx: 0 }));
      own = own.concat(extra.slice(0, 6 - own.length));
    }
    if (!own.length) continue;

    const want = Math.min(TARGET_ADD, room);
    const made = [];

    const wc = (t) => t.trim().split(/s+/).length;
    const overlaps = (x, y) => x.includes(y) || y.includes(x);
    const pickWrong = (item, field) => {
      const base = pool.filter(p => p.arabic !== item.arabic && p.bangla !== item.bangla
        && !overlaps(p.bangla, item.bangla)
        && Math.abs(wc(p.arabic) - wc(item.arabic)) <= (isWord(item.arabic) ? 0 : 2));
      const cands = uniqBy(base, x => x[field]);
      const start = (item.arabic.length * 7 + made.length * 3) % Math.max(cands.length, 1);
      const out = [];
      for (let k = 0; k < cands.length && out.length < MAX_OPTIONS - 1; k++) {
        const c = cands[(start + k) % cands.length];
        if (c[field] !== item[field]) out.push(c[field]);
      }
      return out;
    };

    // একবার অর্থ-প্রশ্ন, একবার আরবি-প্রশ্ন — আইটেম ঘুরিয়ে ঘুরিয়ে
    for (let round = 0; round < 2 && made.length < want; round++) {
      for (const item of own) {
        if (made.length >= want) break;
        if (round === 0) {
          if (mcqKeys.has(item.arabic)) continue;
          mcqKeys.add(item.arabic);
          const wrong = pickWrong(item, 'bangla');
          if (wrong.length < 1) continue;
          made.push({
            idx: item.idx,
            step: {
              type: 'mcq',
              word: { arabic: item.arabic, bangla: item.bangla },
              question: isWord(item.arabic) ? 'শব্দটির অর্থ কী?' : 'বাক্যটির অর্থ কী?',
              options: [item.bangla, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
            }
          });
        } else {
          if (mcqKeys.has(item.bangla)) continue;
          mcqKeys.add(item.bangla);
          const wrong = pickWrong(item, 'arabic');
          if (wrong.length < 1) continue;
          made.push({
            idx: item.idx,
            step: {
              type: 'mcq',
              word: { arabic: item.bangla, bangla: item.bangla },
              question: `"${item.bangla}" এর আরবি কোনটি?`,
              options: [item.arabic, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
            }
          });
        }
      }
    }
    if (!made.length) continue;

    // শুধু এমন ফাঁকে বসানো যেখানে আগে-পরে কোনোটিই MCQ নয় — যাতে MCQ-র লম্বা সারি না হয়
    const n = steps.length;
    const isM = (i) => i >= 0 && i < n && steps[i].type === 'mcq';
    const gaps = [];
    for (let i = 1; i <= n; i++) if (!isM(i - 1) && !isM(i)) gaps.push(i);
    // দ্বিতীয় দফা: একপাশে ছোট (≤২) MCQ-সারি থাকলে সেখানেও বসানো যাবে
    const runAt = (i, dir) => { let c = 0; for (let k = i; isM(k); k += dir) c++; return c; };
    const loose = [];
    for (let i = 1; i <= n; i++) {
      if (gaps.includes(i) || (isM(i - 1) && isM(i))) continue;
      if (runAt(i - 1, -1) <= 2 && runAt(i, 1) <= 2) loose.push(i);
    }
    const used = new Set();
    const placed = [];
    for (const m of made) {
      let free = gaps.filter(g => !used.has(g) && !used.has(g - 1) && !used.has(g + 1));
      if (!free.length) free = loose.filter(g => !used.has(g) && !used.has(g - 1) && !used.has(g + 1));
      if (!free.length) continue;
      const after = free.filter(g => g >= m.idx + 2);
      const g = (after.length ? after : free)[0];
      used.add(g);
      placed.push({ pos: g, step: m.step });
    }
    placed.sort((x, y) => x.pos - y.pos);
    const out = [];
    let mi = 0;
    for (let i = 0; i <= n; i++) {
      while (mi < placed.length && placed[mi].pos === i) out.push(placed[mi++].step);
      if (i < n) out.push(steps[i]);
    }
    stage.steps = out;
    stage.estMinutes = Math.max(stage.estMinutes || 3, Math.ceil(out.length * 0.28));
  }
  return bookStages;
};
