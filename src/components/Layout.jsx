import { useEffect, useState } from 'react';
import { BookOpen, Heart, Library, Moon, PenLine, Sun, Timer } from 'lucide-react';
import { brand } from '../config/brand';
import { href, useRoute } from '../utils/router';
import Logo from './Logo';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      const s = localStorage.getItem('sirat_theme');
      return s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('sirat_theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [dark]);
  return [dark, setDark];
}

const NAV = [
  { to: '/dars', key: 'dars', label: 'দারস', icon: BookOpen },
  { to: '/quiz', key: 'quiz', label: 'কুইজ', icon: PenLine },
  { to: '/exam', key: 'exam', label: 'পরীক্ষা', icon: Timer },
  { to: '/durood', key: 'durood', label: 'দুরূদ', icon: Heart },
  { to: '/book', key: 'book', label: 'বই', icon: Library },
];

export default function Layout({ children }) {
  const [dark, setDark] = useTheme();
  const path = useRoute();
  const active = path.split('/')[1];
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-brand-100 dark:border-white/10 bg-white/85 dark:bg-[#0a1514]/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <a href={href('/')} className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-200">
            <Logo />
            <span className="text-lg">{brand.name}</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(({ to, key, label, icon: Icon }) => (
              <a key={key} href={href(to)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${active === key ? 'bg-brand-600 text-white' : 'hover:bg-brand-50 dark:hover:bg-white/10'}`}><Icon size={16} /> {label}</a>
            ))}
          </nav>
          <button onClick={() => setDark(!dark)} aria-label="থিম" className="rounded-full p-2 hover:bg-brand-50 dark:hover:bg-white/10">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      <footer className="border-t border-brand-100 dark:border-white/10 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        সংকলন ও সম্পাদনা: উস্তায মুফতি আনিছুর রহমান হাফিজাহুল্লাহ · {brand.org}
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-brand-100 dark:border-white/10 bg-white/95 dark:bg-[#0a1514]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map(({ to, key, label, icon: Icon }) => (
          <a key={key} href={href(to)} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${active === key ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}><Icon size={20} /> {label}</a>
        ))}
      </nav>
    </div>
  );
}
