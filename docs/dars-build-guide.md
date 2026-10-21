# দারস (পাঠ) বানানোর সম্পূর্ণ নির্দেশিকা

> এই ফাইলটি AI-কে দিলেই সে "এসো আরবী শিখি" অ্যাপের একটি দারস কিতাব থেকে হুবহু একই নিয়মে বানাতে পারবে।
> ব্যবহার: AI-কে বলুন — **"docs/dars-build-guide.md পড়ে নাও, তারপর পাঠ N বানাও।"**

---

## ০. এক নজরে কাজের ধাপ

1. কিতাবের পৃষ্ঠাগুলো ছবি হিসেবে রেন্ডার করা → পড়া
2. `scripts/book_lessons/vol1-chX-lN.cjs` ফাইলে কনটেন্ট লেখা
3. `node scripts/apply_book_lessons.cjs` চালিয়ে `src/data/lessons.json`-এ বসানো
4. `npx vite build` দিয়ে বিল্ড পরীক্ষা
5. ব্রাউজারে প্রতিটি পর্ব স্বয়ংক্রিয়ভাবে খেলে পরীক্ষা (`docs/lesson-autoplay.js`)
6. পরীক্ষার আগে localStorage ব্যাকআপ, পরে রিস্টোর — এটা বাধ্যতামূলক
7. ব্যবহারকারীকে রিপোর্ট: কী কী পর্ব হলো, কী যাচাই করা দরকার

---

## ১. মূল নীতি (কখনো ভাঙা যাবে না)

| নিয়ম | বিস্তারিত |
|---|---|
| **শুধু কিতাবের কনটেন্ট** | মাওলানা আবু তাহের মেছবাহ রচিত "এসো আরবি শিখি" বইয়ের শব্দ, বাক্য, তামরীন — এর বাইরের কোনো বাক্য বানানো যাবে না। অনুশীলনও ওই দারসের শব্দ-বাক্য দিয়েই তৈরি। |
| **কিতাবের ক্রম** | দারসের ভেতরে ধাপের ক্রম = বইয়ের ক্রম। শব্দার্থ → নিয়ম/টেবিল → বাক্য → পড়ার অনুচ্ছেদ → তামরীন → কুইজ। |
| **পূর্ণ হরকত** | বইয়ের অনেক বাক্যে হরকত নেই; অ্যাপে সব আরবি লেখায় পূর্ণ হরকত দিতে হবে। |
| **ছোট পর্ব** | প্রতি পর্ব ৬–১৪ ধাপ (২–৪ মিনিট)। ১৪-এর বেশি হলে ভ্যালিডেশন ফেল করবে। বড় অংশ ভাগ করুন: "শব্দার্থ (১/৩)"। |
| **চর্চা বেশি** | পরিচয়মূলক কার্ডের (intro/grammar_card) চেয়ে চর্চার ধাপ বেশি থাকবে (মোটামুটি ১.৫ গুণ)। ২–৩টা পরিচয়-ভারী পর্বের পরে একটা আলাদা **"চর্চা"** পর্ব দিন (≈১২ ধাপ, মিশ্র ধরনের)। |
| **অপশন সংখ্যা** | লেখার প্রশ্নে সর্বোচ্চ ৩টি অপশন (লিঙ্গ বাছাইয়ে ২টি)। **ছবির প্রশ্নে (picture_choice) ৪টি** — দেখতে ভালো লাগে। |
| **ছবি** | নিজস্ব ৩D SVG (`src/components/BookPicture.jsx`)। **কোনো প্রাণীর ছবি নয়** (মানুষ, পশু, পাখি কিছুই না)। পতাকা মানে **কালিমার পতাকা** (কালো কাপড়, সাদা কালিমা), বাংলাদেশের পতাকা নয়। |
| **উত্তর ফাঁস নয়** | প্রশ্নের কার্ডে বা অপশনে এমন কিছু দেখানো যাবে না যাতে উত্তর বোঝা যায় (যেমন দলে ভাগের কার্ডে ইশারা শব্দ, বা উত্তরের আগে বাক্যের অডিও)। |
| **বাড়তি গ্রামার নয়** | দারসের ভেতরে টিপস/নুক্তা/তারকীব নেই। শুধু কিতাবের টেবিল (`grammar_card`) থাকবে। বাকি নিয়ম যায় আলাদা **ক্বায়েদা** ব্যবস্থায়। |
| **শব্দচয়ন** | "উপ-পাঠ" শব্দটি কখনো নয় — সব জায়গায় **"পর্ব"**। "লিঙ্গ" নয় — "জেন্ডার"। |
| **দুইজনে করার কাজ** | ক্লাসের যে কাজ একা করা যায় না (যেমন "দু'জন দাঁড়াও..."), সেই কার্ডের summary-তে এই লাইনটি যোগ করুন: `এই মুহূর্তে হয়তো আপনি এটি করতে পারবেন না; বাকি যখন সুযোগ পাবেন তখন করবেন, ইন শা আল্লাহ।` |

---

## ২. কিতাবের পৃষ্ঠা বের করা ও পড়া

- মূল PDF: `downloaded_original.pdf` (গিট-ইগনোরড, ৪৪৬ পৃষ্ঠা, স্ক্যান করা — টেক্সট লেয়ার নেই)
- **বইয়ের পৃষ্ঠা = PDF পৃষ্ঠা + ২**
- রেন্ডার কমান্ড:

```bash
node scripts/render_book_pages.mjs _book_compare <fromPdfPage> <toPdfPage> 1.6
```

- ছোট লেখা/হরকত পড়তে না পারলে বড় করে ও অংশ কেটে রেন্ডার করুন:

```bash
node scripts/render_book_pages.mjs _book_compare/hi 21 21 3 0.05,0.05,0.95,0.45
```

(শেষের চারটি সংখ্যা = x0,y0,x1,y1 অনুপাত)

- এরপর ছবিগুলো পড়ে (Read) বইয়ের সব শব্দ, বাক্য, তামরীন টুকে নিন।
- **কোনো অবস্থাতেই বইয়ের স্ক্যান বা PDF কোথাও আপলোড/প্রকাশ করা যাবে না।**

**ইতিমধ্যে জানা পৃষ্ঠা-বিন্যাস (১ম খণ্ড, ১ম অধ্যায়):**

| দারস | বইয়ের পৃষ্ঠা | PDF পৃষ্ঠা | অবস্থা |
|---|---|---|---|
| ১ | ১৭–২১ | ১৫–১৯ | ✅ হয়েছে |
| ২ | ২২–২৪ | ২০–২২ | ✅ হয়েছে |
| ৩ | ২৫–২৮ | ২৩–২৬ | ✅ হয়েছে |
| ৪ | ২৯–৩৩ | ২৭–৩১ | বাকি (اَلْ, কামারী-শামসী হরফ, كَيْفَ؟) |
| ৫ | ৩৪–৩৭ | ৩২–৩৫ | বাকি (كِتَابِي / كِتَابُكَ, পরিবার) |
| ৬ | ৩৮–৪০ | ৩৬–৩৮ | বাকি (كِتَابُ رَاشِدٍ — ইযাফত) |
| ৭ | ৪১–৪৪ | ৩৯–৪২ | বাকি (عِنْدَ / أَمَامَ / أَيْنَ؟) |

---

## ৩. ফাইল কাঠামো

```
scripts/book_lessons/vol1-ch1-lN.cjs   ← দারসের কনটেন্ট (এখানেই লিখবেন)
scripts/apply_book_lessons.cjs         ← ভ্যালিডেট করে lessons.json-এ বসায়
scripts/render_book_pages.mjs          ← PDF → PNG
src/data/lessons.json                  ← তৈরি হওয়া ডেটা (হাতে এডিট করবেন না)
src/components/BookPicture.jsx         ← ৩D SVG ছবি
src/components/DuolingoLessonModal.jsx ← ধাপগুলো যেখানে দেখানো হয়
src/components/QaidaCard.jsx           ← ম্যাপের ক্বায়েদা বোতাম ও কার্ড
```

**নতুন দারস শুরু করতে** `scripts/book_lessons/_TEMPLATE.cjs` কপি করে নাম দিন `vol1-ch1-l4.cjs`।

`module.exports` এর আকৃতি:

```js
module.exports = {
  id: 'vol1-ch1-l4',        // lessons.json-এর lesson id (আগে থেকেই আছে)
  legacyStageCount: 9,      // পুরনো ধাপের সংখ্যা (অগ্রগতি মাইগ্রেশনের জন্য; ৯ রাখুন)
  fields: {
    pages: 'পৃষ্ঠা ২৯-৩৩',
    qaida,                  // ম্যাপের ক্বায়েদা (নিচে দেখুন)
    grammarRule: { title, summary, points: [] },
    vocabulary: [{ arabic, bangla, picture? }],
    sentences: [{ arabic, bangla, picture?, distance?, page }],
    dialogues: [],          // প্রশ্নোত্তর থাকলে
    tamrinKitabi: [],       // তামরীন মোডের জন্য
    quiz: quizLegacy,       // কুইজ পর্ব থেকে অটো তৈরি
    bookStages              // ★ মূল জিনিস — পর্বগুলো
  }
};
```

---

## ৪. পর্ব (stage) ও ধাপ (step)

```js
stage(
  {
    id: 'l4-words-1',            // অনন্য; lN- দিয়ে শুরু
    titleBn: 'শব্দার্থ (১/২)',
    shortTitle: 'শব্দার্থ ১',     // ম্যাপে ছোট করে
    titleAr: 'الْمُفْرَدَاتُ (١)',
    desc: 'এক লাইনে কী আছে',
    iconName: 'BookOpen',        // BookOpen | Sparkles | MessageSquare | PenTool | Trophy
    color: 'emerald',            // emerald | teal | cyan | amber
    estMinutes: 3,
    bookPages: '২৯'
  },
  [ /* ৬–১৪টি ধাপ */ ]
)
```

### ধাপের ধরন ও কখন ব্যবহার

| type | কাজ | দরকারি ফিল্ড |
|---|---|---|
| `intro` | নতুন শব্দ/বাক্য দেখানো | `title`, `word:{arabic,bangla}`, `picture?`, `distance?` |
| `grammar_card` | কিতাবের টেবিল ("কিতাব থেকে") | `title`, `table:[{arabic,bangla}]`, `summary?` |
| `mcq` | অর্থ/আরবি বাছাই | `word`, `question`, `options:[{text,isCorrect}]` |
| `match_pairs` | আরবি-বাংলা জোড়া মেলানো | `title`, `pairs:[{arabic,bangla}]` (৩–৪ জোড়া) |
| `picture_choice` | ছবি দেখে শব্দ বাছাই | `targetArabic`, `options:[{text,bangla,picture,isCorrect}]` (**৪টি**) |
| `fill_blank` | শূন্যস্থান পূরণ | `targetBangla`, `fullArabic`, `tokensBefore`, `tokensAfter`, `missingToken`, `options` |
| `sentence_builder` | শব্দ সাজিয়ে বাক্য | `targetArabic`, `targetBangla`, `targetTokens`, `distractors` |
| `spot_error` | কোন বাক্যটি শুদ্ধ | `targetBangla`, `options:[{text,isCorrect,explanation}]` |
| `sort_groups` | দুই দলে ভাগ | `groups:[{id,arabic}]`, `items:[{arabic,bangla,picture?,reveal,group}]` |
| `dialogue_listen` | প্রশ্ন শুনে উত্তর বাছাই | `speaker`, `questionArabic`, `questionBangla`, `options` |
| `quiz_challenge` | চূড়ান্ত কুইজ | `question`, `explanation`, `options` |

**নিয়ম:**
- প্রতি `options` তালিকায় ঠিক **একটি** `isCorrect: true`।
- একই `options`-এ দুটি একই লেখা থাকা যাবে না।
- `sentence_builder`-এর `distractors` কখনো `targetTokens`-এর কোনো শব্দ হতে পারবে না।
- `sort_groups`-এর প্রতিটি `item.group` অবশ্যই কোনো `groups[].id`-এর সাথে মিলবে।
- `sort_groups`-এর কার্ডে শুধু যেটুকু দেখালে উত্তর ফাঁস হয় না সেটুকু (`arabic`), পুরোটা থাকবে `reveal`-এ।

### অপশন কমানোর হেল্পার (প্রতিটি দারস ফাইলে রাখুন)

```js
const MAX_OPTIONS = 3;
const trimOptions = (step) => {
  // ছবির প্রশ্নে ৪টি অপশন থাকলে দেখতে ভালো লাগে, তাই সেগুলো কমানো হয় না
  if (step.type === 'picture_choice') return step;
  if (!Array.isArray(step.options) || step.options.length <= MAX_OPTIONS) return step;
  const correct = step.options.filter(o => o.isCorrect);
  const wrong = step.options.filter(o => !o.isCorrect).slice(0, MAX_OPTIONS - correct.length);
  return { ...step, options: [...correct, ...wrong] };
};
const stage = (meta, steps) => ({ ...meta, steps: steps.map(trimOptions) });
```

### চর্চা পর্ব পরে ঢোকানোর হেল্পার

```js
const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};
```

---

## ৫. একটি দারসের আদর্শ কাঠামো

```
১. শব্দার্থ (১/২)        — intro ৪ + match + intro ৪ + match + mcq ২
২. শব্দার্থ (২/২)        — একইভাবে
৩. কিতাবের নিয়ম/টেবিল    — grammar_card + intro বাক্য + fill/build
৪. বাক্য (১/২)
৫. বাক্য (২/২)
৬. ★ চর্চা ১             — sort, fill, mcq, arabicOf, build, spot, match (≈১২ ধাপ)
৭. পড়ার অনুচ্ছেদ (১/২)
৮. পড়ার অনুচ্ছেদ (২/২)
৯. ★ চর্চা ২
১০. তামরীন (কিতাবের)
১১. চূড়ান্ত কুইজ         — ১০টি quiz_challenge/picture_choice
```

দারসপ্রতি ৯–১৪টি পর্ব স্বাভাবিক।

---

## ৬. ক্বায়েদা (ম্যাপের নীল বোতাম)

প্রতি দারসে ১–৩টি। `stageId` = যে পর্বের পাশে দেখাবে।

```js
const qaida = [
  {
    id: 'l4-q-al',
    stageId: 'l4-rule-al',
    title: 'اَلْ দিয়ে নির্দিষ্ট করা',
    table: [{ arabic: 'كِتَابٌ', bangla: 'একটি বই' }, { arabic: 'اَلْكِتَابُ', bangla: 'বইটি' }],
    rule: 'এক-দুই লাইনে সহজ বাংলা নিয়ম।',
    examples: [{ arabic: 'اَلْكِتَابُ جَمِيلٌ', bangla: 'বইটি সুন্দর' }]
  }
];
```

- ক্বায়েদার লেখা AI-এর খসড়া — রিপোর্টে স্পষ্ট বলতে হবে যে **উস্তাদের যাচাই বাকি**।
- পর্ব লক থাকলে বোতাম দেখায় না; পড়া হলে টিক বসে (`uls_qaida_read`)।

---

## ৭. নতুন ছবি আঁকা

`src/components/BookPicture.jsx`-এর `PICTURES` অবজেক্টে নতুন কী যোগ করুন:

```jsx
newthing: ({ id, u }) => (
  <g>
    <defs>
      <Lin id={id('body')} c={['#fde68a', '#f59e0b', '#b45309']} dir="d" />
    </defs>
    <Shadow u={u} rx="46" />
    {/* 120x120 viewBox, আলো উপর-বাম থেকে */}
  </g>
),
```

- viewBox সবসময় `0 0 120 120`
- গ্রেডিয়েন্ট (`Lin`, `Rad`), নরম ছায়া (`Shadow`), হালকা গ্লস (`Gloss`) ব্যবহার করলে ৩D লাগে
- ডার্ক মোডেও যেন দেখা যায়
- **প্রাণী আঁকা নিষেধ** — প্রয়োজনে প্রতীক/জিনিস দিয়ে বোঝান
- ছবি না থাকলে ধাপ ছবিহীনই চলবে (মানুষ নিয়ে দারসে ছবি দেবেন না)

---

## ৮. বসানো ও বিল্ড

```bash
node scripts/apply_book_lessons.cjs            # সব দারস
node scripts/apply_book_lessons.cjs vol1-ch1-l4 # শুধু একটি
npx vite build
```

ভ্যালিডেশন যা ধরে: অজানা step type, ভুল অপশন সংখ্যা, একই অপশন লেখা দুবার, ধাপ ৬–১৪-এর বাইরে, ডুপ্লিকেট stage id, sort_groups-এর ভুল গ্রুপ, sentence_builder-এর distractor সমস্যা।

---

## ৯. ব্রাউজারে পরীক্ষা (বাধ্যতামূলক)

1. ডেভ সার্ভার: `npm run dev` (বা preview টুল), ঠিকানা `http://localhost:5173`
2. **আগে localStorage ব্যাকআপ**, শেষে রিস্টোর:

```js
const keys=['uls_lessons_progress','uls_total_xp','uls_xp_history','uls_daily_streak_data','uls_xp_scale_version','uls_qaida_read'];
const bk={}; keys.forEach(k=>bk[k]=localStorage.getItem(k)); sessionStorage.setItem('__bk', JSON.stringify(bk));
// পরীক্ষার জন্য আগের দারস সম্পন্ন দেখানো:
localStorage.setItem('uls_lessons_progress', JSON.stringify({'vol1-ch1-l1':{completed:true},'vol1-ch1-l2':{completed:true},'vol1-ch1-l3':{completed:true}}));
location.reload();
```

রিস্টোর:

```js
const bk = JSON.parse(sessionStorage.getItem('__bk')||'null');
if (bk) { Object.entries(bk).forEach(([k,v]) => v==null ? localStorage.removeItem(k) : localStorage.setItem(k,v)); sessionStorage.removeItem('__bk'); }
location.href='/';
```

3. `docs/lesson-autoplay.js` ফাইলের কোড ব্রাউজার কনসোলে পেস্ট করুন, তারপর:

```js
await __openStage('vol1-ch1-l4', 'l4-words-1', 'শব্দার্থ (১/২)');  // নাম = ম্যাপের বোতামের টাইটেলের অংশ
await __next('vol1-ch1-l4', 'l4-words-2');                        // "পরের পর্ব" চেপে পরেরটা
```

ফলাফলে `{finished: true, log: []}` এলে পর্বটি ঠিক আছে। `log`-এ কিছু থাকলে বা `error` এলে ঠিক করতে হবে।

---

## ১০. রিপোর্ট করার নিয়ম

কাজ শেষে ব্যবহারকারীকে **বাংলায়** জানাবেন:

- কয়টি পর্ব, কয়টি ধাপ হলো, প্রতিটি পর্বে কী আছে (এক লাইনে)
- কী কী পরীক্ষা করা হয়েছে, বিল্ড পাস করেছে কিনা
- কোন কোন লেখা AI-এর নিজের (ক্বায়েদা, বইয়ে অর্থ না থাকা শব্দের অনুবাদ, তামরীনের বেছে নেওয়া উত্তর) — যাচাই দরকার
- কী কমিট করা হয়নি
- বড় কিছু বদলানোর আগে ব্যবহারকারীকে জিজ্ঞাসা করুন; ছোট সিদ্ধান্ত নিজে নিন
- কমিট/ডিপ্লয় ব্যবহারকারী না বললে করবেন না

---

## ১১. কাজ করার সময় যেসব সমস্যায় পড়তে হয়

- **ইউনিকোড:** বাংলা য়/ড় ইত্যাদির দুই রকম রূপ থাকায় string replace ফেল করে। স্ক্রিপ্টে `.normalize('NFC')` ব্যবহার করুন।
- **CRLF/LF:** মাল্টি-লাইন রিপ্লেসে `\r?\n` ব্যবহার করুন।
- **শেল heredoc:** বড় কোড heredoc দিয়ে পাঠাতে গেলে ভাঙে; আলাদা `.cjs` ফাইল লিখে `node` দিয়ে চালান।
- **ব্রাউজারে React ইম্পোর্ট:** `/node_modules/.vite/deps/react.js` সরাসরি ইম্পোর্ট করলে দুই কপি React হয়ে "Invalid hook call" আসে; `performance.getEntriesByType('resource')` থেকে `?v=` সহ আসল URL নিন।
- **অটো-প্লে টাইমআউট:** কনসোল স্ক্রিপ্টের সময়সীমা থাকে, তাই প্রতি পর্ব আলাদা কলে চালান (≈৪০ সেকেন্ড বাজেট)।

---

## ১২. ব্যবহারকারীর পছন্দ-অপছন্দ (মনে রাখুন)

- বাংলায় উত্তর দিন, সহজ কথায়; ইংরেজি শব্দ কম।
- ডেমো দেখাতে ভালোবাসেন — বড় নকশা বদলের আগে ২–৩টা বিকল্প দেখান।
- অপছন্দ: "উপ-পাঠ", "গেমিফাইড", "লিঙ্গ", ট্রফি/মেডেল, স্টার, অতিরিক্ত গ্রামার, বাংলাদেশের পতাকা।
- পছন্দ: ছোট পর্ব, বেশি চর্চা, পরিষ্কার সরল নকশা, কিতাবের প্রতি বিশ্বস্ততা।
