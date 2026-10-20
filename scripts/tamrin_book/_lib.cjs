// কিতাব "আত-তামরীনুল কিতাবী"-র তামরীন লেখার হেল্পার।
// প্রতিটি লাইন:  আরবি // বাংলা   (ক/খ অংশ: আরবি→বাংলা)   |   বাংলা // আরবি   (গ/ঘ অংশ: বাংলা→আরবি)
// বড় বাক্য '|' দিয়ে ছোট অংশে ভাঙা যায় (দুই পাশে সমান সংখ্যক '|'): ছোট অংশ আগে অনুশীলন, শেষে পূর্ণ বাক্য।
const parse = (block, mode, section, page) =>
  block.trim().split('\n').map(l => l.trim()).filter(Boolean).map((line, i) => {
    const [a, b] = line.split(' // ').map(s => s.trim());
    if (!a || !b) { console.error(`bad line: ${line}`); process.exitCode = 1; return { arabicSentence: '', banglaSentence: '' }; }
    const ar = mode === 'ar-to-bn' ? a : b;
    const bn = mode === 'ar-to-bn' ? b : a;
    const arP = ar.split('|').map(s => s.trim());
    const bnP = bn.split('|').map(s => s.trim());
    if (arP.length !== bnP.length) { console.warn(`chunk dropped (count mismatch): ${line.slice(0, 50)}`); arP.splice(0, arP.length, arP.join(' ')); bnP.splice(0, bnP.length, bnP.join(' ')); }
    const ex = {
      task: mode === 'ar-to-bn' ? 'বাংলায় বলো ও তরজমা করো' : 'আরবিতে বলো',
      section,
      mode,
      arabicSentence: arP.join(' '),
      banglaSentence: bnP.join(' '),
      page
    };
    if (arP.length > 1) ex.chunks = arP.map((x, k) => ({ arabic: x, bangla: bnP[k] }));
    return ex;
  });

// n = তামরীন নম্বর, page = কিতাবের পৃষ্ঠা, ka = আরবি→বাংলা, ga = বাংলা→আরবি
const T = (n, page, { ka, ga }) => ({
  n,
  page,
  exercises: [
    ...parse(ka, 'ar-to-bn', 'ক', page),
    ...parse(ga, 'bn-to-ar', 'গ', page)
  ]
});

module.exports = { T };
