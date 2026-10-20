// ২য় খণ্ডের দীর্ঘ দারসের মডিউল লেখার সহায়ক: বাক্য/প্রশ্নের তালিকা থেকে ইনট্রো ও MCQ ধাপ তৈরি।
const H = require('./dars_helpers.cjs');
const { T, intro, introSentence, mcqWord } = H;

// items: [[arabic, bangla], ...]
function listSteps(items, page) {
  return items.map(([a, b]) => introSentence(T(a, b, page)));
}
// অন্য আইটেমের বাংলা থেকে ভুল অপশন (সঠিক টেক্সটের সাথে মিলে গেলে বাদ)
function listMcq(items, i0, q = 'অর্থ কী?') {
  const i = i0 % items.length;
  const pool = items.map((x) => x[1]).filter((b) => b !== items[i][1]);
  const wrong = [pool[(i * 3 + 1) % pool.length], pool[(i * 5 + 4) % pool.length]];
  const uniq = [...new Set(wrong)].filter((b) => b !== items[i][1]);
  while (uniq.length < 2) uniq.push(pool[(i + uniq.length + 7) % pool.length]);
  return mcqWord({ arabic: items[i][0], bangla: items[i][1] }, [...new Set(uniq)].slice(0, 2), q);
}
// মাসদার/শব্দ আইটেমের অবজেক্ট ম্যাপ → intro তালিকা
const introAll = (obj, title) => Object.values(obj).map((w) => intro(w, title));
// টেবিল-কার্ড: কিতাবের মাযী/মুযারী/আমর-নাহী
const verbCard = (title, past, pres, imp) => H.card(title, [
  { label: 'মাযী', arabic: past[0], bangla: past[1] },
  { label: 'মুযারী', arabic: pres[0], bangla: pres[1] },
  { label: 'আমর — নাহী', arabic: imp[0], bangla: imp[1] },
]);
module.exports = { listSteps, listMcq, introAll, verbCard };
