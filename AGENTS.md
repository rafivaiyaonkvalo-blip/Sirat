# ULS Arabic Learning Portal (মারকাযুল ঈমান)
**Project Root & Antigravity Workspace Guidelines**

Welcome to the **ULS Arabic** project — an AI-powered interactive Arabic language learning web application based on the renowned curriculum of **"এসো আরবী শিখি" (Eso Arbi Shikhi)** and **"আত-তামরীনুল কিতাবী" (At-Tamrinul Kitabi)** by Maulana Abu Taher Mesbah (দা.বা.).

---

## 1. Project Overview & Architecture

- **Organization**: মারকাযুল ঈমান (Markazul Iman - https://markazuliman.com)
- **Technology Stack**:
  - **Frontend**: React 19, Vite 8, Tailwind CSS v4
  - **Icons & Effects**: Lucide React, Canvas Confetti
  - **Audio Engine**: Web Speech API / High-fidelity Arabic pronunciation synthesis
  - **PDF & Book Viewer**: High-resolution rendering of original books

### Key Directory Structure:
```
uls-arabic/
├── public/
│   ├── original_book.pdf       # এসো আরবী শিখি (৪৪৬ পৃষ্ঠা)
│   ├── at_tamrinul_kitabi.pdf  # আত-তামরীনুল কিতাবী (২৪৭ পৃষ্ঠা)
│   └── markazul_iman_logo.jpg  # অফিসিয়াল লোগো
├── src/
│   ├── components/             # React কম্পোনেন্টসমূহ (LessonDetail, Flashcards, GrillMeExam, ইত্যাদি)
│   ├── data/
│   │   ├── lessons.json        # ৭০টি পূর্ণাঙ্গ পাঠ (৩০৮ বাক্য, ২১১ কথোপকথন, ২৮০ তামরীন, ২১০ কুইজ)
│   │   ├── vocabulary.json     # ১,৩৪৩টি বিশুদ্ধ আরবি শব্দভাণ্ডার (পূর্ণাঙ্গ হরকত ও বাংলা অর্থ)
│   │   └── chapters.json       # অধ্যায়ভিত্তিক কাঠামো
│   ├── utils/                  # অডিও ও ইউটিলিটি ফাংশন
│   ├── App.jsx                 # মূল অ্যাপ এন্ট্রি
│   └── main.jsx
├── GEMINI.md                   # Antigravity প্রজেক্ট রুলস ও কনফিগারেশন
└── package.json
```

---

## 2. Development & Build Commands

- **Run Development Server**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 3. Strict Guidelines for AI Agents & Developers

1. **Arabic Orthography & Harakat**:
   - Every single Arabic word and sentence **MUST** have 100% complete and accurate Tashkeel/Harakat (যবর, যের, পেশ, সাকিন, তাশদীদ, তানভীন). No bare unvowelled Arabic allowed.
2. **Bengali Typography**:
   - Zero broken font ligatures. Use standard Bengali grammar and spelling (যেমন: "অতএব", "শ্রেণীকক্ষ", "মুদাররিস")।
3. **Data Integrity**:
   - Never replace existing rich content with mock or placeholder data.
   - Respect the 5-stage lesson schema: `vocabulary` ➜ `sentences` ➜ `dialogues` ➜ `quiz` ➜ `tamrinKitabi`.
4. **Attribution**:
   - Logo or branding clicks must link to `https://markazuliman.com`.

---

## 4. Live Production & Infrastructure (উৎপাদন ও ক্লাউড পরিকাঠামো)

- **Official Live Domain**: [https://arabic.markazuliman.com](https://arabic.markazuliman.com)
- **Admin Portal**: [https://arabic.markazuliman.com/rafi](https://arabic.markazuliman.com/rafi) *(Admin পাসওয়ার্ড কোডে/ডক্সে রাখা হয় না — মালিকের কাছে সংরক্ষিত)*
- **Hosting Platform**: Vercel
  - **Project Name**: `arabic-markazuliman`
  - **Local Linking**: Linked via `.vercel/project.json`
  - **Deploy Command**: `cmd /c npx vercel deploy --prod`
- **Cloud Database & Auth**: Google Firebase
  - **Project ID**: `eso-arbi-sikki`
  - **Database**: Cloud Firestore (Region: `asia-south1` Mumbai)
  - **Auth Methods**: Email/Password and Google Sign-in
  - **Authorized Domains**: `arabic.markazuliman.com`, `uls-arabic.vercel.app`, `localhost`

