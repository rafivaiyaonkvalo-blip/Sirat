# Sirat (সীরাত - মারকাযুল ঈমান)
**AI Agent Guidelines**

নবীজী ﷺ-এর জীবনী নিয়ে ৩২ দারসের ওয়েবসাইট (React 19 + Vite 8 + Tailwind v4)। বিস্তারিত: `README.md`।
আগের "এসো আরবী শিখি" পোর্টালের কোড গিট ট্যাগ `arabic-portal-final`-এ সংরক্ষিত।

- আরবি লেখায় সবসময় পূর্ণ হরকত দিতে হবে।
- Word-এর কনটেন্ট হাতে বদলানো নয়; `npm run convert` দিয়ে আপডেট করুন।

---

## ২. লাইভ ডিপ্লয়মেন্ট ও সাবপাথ আর্কিটেকচার (Subpath Deployment)

- **অফিসিয়াল লাইভ লিঙ্ক**: [https://www.markazuliman.com/sirat](https://www.markazuliman.com/sirat)
- **অ্যাডমিন পোর্টাল**: [https://www.markazuliman.com/sirat/rafi](https://www.markazuliman.com/sirat/rafi)
- **Vercel প্রোডাকশন লিঙ্ক**: [https://sirat-theta.vercel.app](https://sirat-theta.vercel.app)
- **Vercel প্রোজেক্ট**: `sirat` (টিম: `rafi-a6b0`)
- **গিটহাব রিপোজিটরি**: `https://github.com/rafivaiyaonkvalo-blip/Sirat`

### 🚫 অতি গুরুত্বপূর্ণ নিষেধাজ্ঞা (STRICT RESTRICTIONS):
1. **কখনোই `sirat.markazuliman.com` ব্যবহার করবেন না:**
   - `sirat.markazuliman.com` সাবডোমেইনে অন্য একটি স্বতন্ত্র ওয়েবসাইট চলছে।
   - এই অ্যাপটি শুধুমাত্র মূল ডোমেইনের সাবপাথ **`https://markazuliman.com/sirat`**-এর মাধ্যমে চলবে।
2. **মূল ওয়েবসাইটে কোনো অপ্রয়োজনীয় পরিবর্তন নয়:**
   - মূল সাইটের Vercel রিরাইটে `/sirat/:path*` ➜ `https://sirat-theta.vercel.app/:path*` প্রক্সি করা আছে। Sirat-এর নতুন কোড ডিপ্লয় করার সময় মূল ওয়েবসাইটে হাত দেওয়ার প্রয়োজন নেই।

---

## ৩. ইমেজ ও স্ট্যাটিক অ্যাসেট সংক্রান্ত বাধ্যতামূলক নিয়ম (Asset Rules)

অ্যাপটি সাবপাথ (`/sirat/`)-এ রান করার কারণে ব্রাউজারে কখনো সরাসরি `/image.jpg` বা `/logos/...` লেখা যাবে না। এতে মূল ওয়েবসাইট থেকে 404 ত্রুটি হবে।

### ✅ বাধ্যতামূলক নিয়ম:
যেকোনো React কম্পোনেন্ট বা জাভাস্ক্রিপ্ট ফাইলে কোনো ছবি, আইকন, বা স্ট্যাটিক অ্যাসেট রেফার করতে হলে **অবশ্যই** `getAssetUrl` ব্যবহার করতে হবে:

```javascript
import { getAssetUrl } from '../utils/assetHelper';

// সঠিক নিয়ম (Correct):
<img src={getAssetUrl('/logos/novel_concept_1_ayn.jpg')} alt="Logo" />
<img src={entry.photoURL || getAssetUrl('/madina.jpg')} alt="Avatar" />

// ভুল নিয়ম (Incorrect - NEVER DO THIS):
<img src="/logos/novel_concept_1_ayn.jpg" /> // ❌ Subpath 404 ত্রুটি ঘটাবে
```

---

## ৪. ডেভেলপমেন্ট ও ডিপ্লয়মেন্ট কমান্ডসমূহ

- **ডেভেলপমেন্ট সার্ভার চালান**:
  ```bash
  npm run dev
  ```
- **প্রোডাকশন বিল্ড করুন**:
  ```bash
  npm run build
  ```
- **Vercel প্রোডাকশনে ডিপ্লয় করুন**:
  ```bash
  npx vercel deploy --prod
  ```

---

## ৫. ভাষাগত ও তথ্যের বিশুদ্ধতা (Language Integrity)

1. **আরবি হরকত ও তাসকীল (Arabic Orthography)**:
   - প্রতিটি আরবি শব্দ ও বাক্যে ১০০% নির্ভুল হরকত (যবর, যের, পেশ, সাকিন, তাশদীদ, তানভীন) থাকতে হবে। কোনো নগ্ন বা হরকতবিহীন আরবি গ্রহণযোগ্য নয়।
2. **বাংলা বানান ও ফন্ট লিগেচার**:
   - মানসম্মত বাংলা বানান ও ব্যাকরণ বজায় রাখতে হবে।
3. **কন্টেন্ট অখণ্ডতা (Data Integrity)**:
   - বিদ্যমান কোনো তথ্য ফেক বা মক ডেটা দিয়ে প্রতিস্থাপন করা যাবে না।
4. **অ্যাট্রিবিউশন**:
   - অ্যাপের লোগো বা মারকাযুল ঈমান ব্র্যান্ডিং ক্লিকে `https://markazuliman.com` ওপেন হতে হবে।
