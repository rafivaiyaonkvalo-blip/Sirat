# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

---

# সীরাত (মারকাযুল ঈমান)

পুরনো সাইটের ডিজাইন (Navbar, হিরো, ডুয়োলিঙ্গো-রোডম্যাপ) অক্ষুণ্ণ; কনটেন্ট বদলে ৩২টি দারস। মেনু: দারস · দুরূদ · কুইজ · পরীক্ষা · বই।

- নতুন কোড: `src/sirat/`। Word → JSON: `npm run convert -- <zip>` (`scripts/convert_dars.mjs`, ফলাফল `src/data/dars/`)।
- ভিডিও: `src/data/videos.json` (`"দারস-পাঠ": "লিংক"`)। নাম/বই/দুরূদ ক্যাম্পেইন: `src/sirat/brand.js`।

## দুরূদের সম্মিলিত গণনা (Firebase)
Vercel-এর Environment Variables-এ `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` দিন। Firestore-এ `campaigns/durood` ডকে `count` (সংখ্যা) আর ঐচ্ছিক `target` থাকে। নিয়ম (rules) — সবাই পড়তে পারবে, শুধু `count` বাড়াতে পারবে (ছোট ধাপে):

```
match /campaigns/durood {
  allow read: if true;
  allow create: if request.resource.data.keys().hasOnly(['count']) && request.resource.data.count <= 200;
  allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['count'])
                && request.resource.data.count > resource.data.count
                && request.resource.data.count - resource.data.count <= 200;
}
```
কনফিগ না থাকলে শুধু ব্যক্তিগত গণনা চলে। পূর্ণ অপব্যবহার-সুরক্ষা (বট ঠেকানো) চাইলে Cloud Function/App Check লাগবে।
