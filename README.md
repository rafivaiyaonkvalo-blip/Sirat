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
