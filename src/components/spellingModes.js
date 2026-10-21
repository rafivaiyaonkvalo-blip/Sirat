// বানান অনুশীলনের চারটি ধরন — শিরোনাম, ব্যাখ্যা ও রং (অনুশীলন পাতা ও লক পাতা দুই জায়গায় ব্যবহৃত)
import { Layers, Keyboard, Ear, PenTool } from 'lucide-react';

export const SPELLING_MODES = [
  {
    id: 'tiles',
    title: 'হরফ সাজানো',
    arabic: 'تَرْتِيبُ الْحُرُوفِ',
    desc: 'এলোমেলো হরফ সাজিয়ে শব্দ গড়ুন',
    icon: Layers,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    bar: 'from-emerald-500 via-teal-500 to-emerald-400',
    activeCard: 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-md shadow-emerald-500/10',
    chip: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  {
    id: 'dictation',
    title: 'শ্রুতলিপি',
    arabic: 'اَلْإِمْلَاءُ',
    desc: 'উচ্চারণ শুনে আরবিতে লিখুন',
    icon: Keyboard,
    iconBg: 'bg-gradient-to-br from-sky-500 to-cyan-600',
    bar: 'from-sky-500 via-cyan-500 to-sky-400',
    activeCard: 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 shadow-md shadow-sky-500/10',
    chip: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
  },
  {
    id: 'confusing',
    title: 'হরফের তফাত',
    arabic: 'اَلْحُرُوفُ الْمُتَشَابِهَةُ',
    desc: 'কাছাকাছি উচ্চারণের হরফ চিনুন',
    icon: Ear,
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    bar: 'from-indigo-500 via-blue-500 to-indigo-400',
    activeCard: 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10',
    chip: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'tashkeel',
    title: 'হরকত পরীক্ষা',
    arabic: 'اَلتَّشْكِيلُ',
    desc: 'সঠিক হরকতযুক্ত রূপ বাছাই করুন',
    icon: PenTool,
    iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-600',
    bar: 'from-violet-500 via-fuchsia-500 to-violet-400',
    activeCard: 'border-violet-500 bg-violet-50/80 dark:bg-violet-950/40 shadow-md shadow-violet-500/10',
    chip: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
  }
];

export const getSpellingMode = (id) => SPELLING_MODES.find((m) => m.id === id) || SPELLING_MODES[0];
