# সীরাত (মারকাযুল ঈমান)

নবীজী ﷺ-এর জীবনী নিয়ে ৩২টি দারস: প্রতিটি দারস অনেকগুলো পাঠে বিভক্ত, প্রতি পাঠে **ভিডিও → পাঠ → কুইজ**।
মেনু: দারস · কুইজ · পরীক্ষা · দুরূদ · বই।

## কনটেন্ট যুক্ত করা
- **Word → ওয়েব**: `sirat-word/` ফোল্ডারে (গিট-ইগনোরড) `dars-NN.docx` রেখে `npm run convert` (বা `npm run convert -- path/to/file.zip`)। এটি `src/data/dars/*.json` ও `src/data/darsIndex.json` তৈরি করে। কনভার্টার Word-এর পাঠ-শিরোনাম, `◆` উপ-শিরোনাম, পাদটীকা ও শেষের MCQ (পাঠের নামে ট্যাগ করা) পড়ে।
- **ভিডিও**: `src/data/videos.json`-এ `"দারস-পাঠ": "লিংক"` (YouTube / Vimeo / Drive / .mp4)।
- **নাম, লোগো, বইয়ের তথ্য, দুরূদ ক্যাম্পেইন**: `src/config/brand.js` ও `public/sirat-logo.svg`।

## কমান্ড
`npm run dev` · `npm run build` · `npx vercel deploy --prod`

লাইভ: https://www.markazuliman.com/sirat (Vite `base: '/sirat/'`, হ্যাশ-রাউটার)। সব ছবি/অ্যাসেট `getAssetUrl` দিয়ে।
