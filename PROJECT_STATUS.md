# ULS Arabic Learning Portal — Project Status & Master Handover

**Project Directory**: `C:\Users\Abdul Hakim\.gemini\antigravity\scratch\uls-arabic`
**Project ID in Antigravity**: `21d7e2fa-287d-4c9f-9a57-107f34045d00`
**Last Updated**: 2026-09-10

---

## 1. Project Overview & Background
- **Source Books**:
  - *Eso Arbi Shikhi* (এসো আরবী শিখি) by Maulana Abu Taher Mesbah (446 pages) — located at `public/original_book.pdf`.
  - *At-Tamrinul Kitabi* (আত-তামরীনুল কিতাবী) (247 pages) — located at `public/at_tamrinul_kitabi.pdf`.
- **Target Organization**: মারকাযুল ঈমান (Markazul Iman — `https://markazuliman.com`).
- **Tech Stack**: React 19, Vite 8, Tailwind CSS v4, Lucide React, Canvas Confetti.

---

## 2. Master Curriculum Data (100% Complete)
- **Levels/Volumes**: 3 Volumes
  - **Volume 1**: 21 Lessons (Sentence building, Ism Isharah, Sifah-Mawsuf, Idafat, Harf Jar)
  - **Volume 2**: 30 Lessons (Verbs, Baab Nasara, Daraba, Fataha, Samia, Mazid Feeh, Amr & Nahy)
  - **Volume 3**: 19 Lessons (Muthanna, Jam' Salim & Taksir, Mansubat, Quranic & Hadith texts)
- **Total Completed Lessons**: **70 / 70 (100%)**
- **Detailed Content Breakdown**:
  - **308 Book Sentences** (`sentences`) with accurate Harakat, Bengali translations, and grammatical notes.
  - **211 Dialogues / Q&As** (`dialogues`) with question-answer pairs and audio support.
  - **280 At-Tamrinul Kitabi Exercises** (`tamrinKitabi`) with tasks, prompts, and hints.
  - **210 Interactive Quizzes** (`quiz`) with options, correct answer indices, and book explanations.
  - **1,343 Vocabulary Items** mapped and synchronized from `src/data/vocabulary.json`.

---

## 3. Key Components & Features
- **LessonDetail.jsx**: 5 interactive tabs:
  1. শব্দার্থ ও চিত্র (Vocabulary)
  2. কিতাবের বাক্য (Sentences)
  3. প্রশ্নোত্তর তামরীন (Dialogues)
  4. মেধা যাচাই পরীক্ষা (Quiz)
  5. আত-তামরীনুল কিতাবী (Kitabi Exercises)
- **DuolingoRoadmap.jsx & DuolingoTamrinModal.jsx**: Duolingo-style milestone learning.
- **GrillMeExam.jsx**: Hardcore 3-strikes exam mode & timed practice.
- **Flashcards.jsx**: 3D interactive flashcards with audio and spaced repetition.
- **Audio Synthesis**: Native Arabic pronunciation via `src/utils/audio.js`.

---

## 4. Antigravity Configuration
- **GEMINI.md**: Workspace rules, coding standards, 100% Arabic Tashkeel enforcement.
- **AGENTS.md**: Antigravity agent configuration and system prompts.
- **.agents/rules/guidelines.md**: Directory rules.

---

## 5. Live Production & Infrastructure (উৎপাদন ও ক্লাউড পরিকাঠামো)
- **Official Live Domain**: [https://arabic.markazuliman.com](https://arabic.markazuliman.com)
- **Admin Portal**: [https://arabic.markazuliman.com/rafi](https://arabic.markazuliman.com/rafi) *(Admin PIN: `iman2026`)*
- **Hosting Platform**: Vercel
  - **Project Name**: `arabic-markazuliman`
  - **Local Linking**: Linked via `.vercel/project.json`
  - **Deploy Command**: `cmd /c npx vercel deploy --prod`
- **Cloud Database & Auth**: Google Firebase
  - **Project ID**: `eso-arbi-sikki`
  - **Database**: Cloud Firestore (Region: `asia-south1` Mumbai)
  - **Auth Methods**: Email/Password and Google Sign-in
  - **Authorized Domains**: `arabic.markazuliman.com`, `uls-arabic.vercel.app`, `localhost`

