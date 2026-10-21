import React, { useState, useEffect } from 'react';
import { User, LogIn, Award, Zap, Flame, ShieldCheck, Settings, Sparkles } from 'lucide-react';
import { getTotalXp, getRankTitle, getStreakData, getLevelInfo, toBengaliNumber } from '../utils/gamification';

export default function Footer({ user, onOpenAuth }) {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState({ count: 1 });
  const [studentProfile, setStudentProfile] = useState({});

  useEffect(() => {
    const handleSync = () => {
      setXp(getTotalXp());
      setStreak(getStreakData());
      try {
        const p = JSON.parse(localStorage.getItem('uls_student_profile') || '{}');
        setStudentProfile(p);
      } catch (e) {
        setStudentProfile({});
      }
    };
    handleSync();
    window.addEventListener('uls_progress_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('uls_progress_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [user]);

  const rank = getRankTitle(xp);

  // সংখ্যার লেভেল ও পরের লেভেল পর্যন্ত অগ্রগতি
  const levelInfo = getLevelInfo(xp);
  const nextRankXp = levelInfo.nextLevelXp;
  const nextRankTitle = getRankTitle(levelInfo.nextLevelXp);
  const progressPercent = Math.max(5, levelInfo.progressPercent);

  return (
    <footer 
      style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 3rem))' }}
      className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 pt-8 pb-24 sm:pb-28 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              প্লেয়ার ড্যাশবোর্ড
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            {user ? 'ক্লাউড সেভ অন' : 'গেস্ট মোড'}
          </span>
        </div>

        {/* The Premium Profile & Gamification Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/20 dark:from-slate-800/70 dark:to-slate-900/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60 dark:border-slate-700/60">
            {/* Student Info Left */}
            <div className="flex items-center gap-3.5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-900/20 overflow-hidden ring-2 ring-emerald-500/30">
                  {(user && (studentProfile.photo || user.photoURL)) ? (
                    <img src={studentProfile.photo || user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : user ? (
                    <span>{(user.displayName || user.email || 'P')[0]?.toUpperCase()}</span>
                  ) : (
                    <User size={24} className="text-white" />
                  )}
                </div>
                {user && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-white">
                    ✓
                  </span>
                )}
              </div>

              {/* Name & Rank */}
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-none">
                    {user?.displayName || (user ? 'প্লেয়ার' : 'গেস্ট প্লেয়ার')}
                  </h4>
                  {user && (
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" title="যাচাইকৃত শিক্ষার্থী" />
                  )}

                  {/* Prominent Animated Zoom-in Zoom-out Level Badge */}
                  <div className="animate-zoom-breathe">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 border border-emerald-400/50 select-none cursor-default">
                      <Sparkles size={13} className="text-amber-300 shrink-0 animate-spin-slow" />
                      <span>{rank}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action / Settings Button */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs hover:border-emerald-500/40 cursor-pointer"
            >
              {user ? (
                <>
                  <Settings size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>প্রোফাইল</span>
                </>
              ) : (
                <>
                  <LogIn size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>
          </div>

          {/* Gamification Stats Grid */}
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                <Zap size={14} />
                <span>XP পয়েন্ট</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {toBengaliNumber(xp)}
              </div>
              <div className="text-[10px] text-slate-400">টোটাল স্কোর</div>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-500 text-xs font-bold mb-0.5">
                <Flame size={14} />
                <span>স্ট্রিক</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {toBengaliNumber(streak.count || 1)} দিন
              </div>
              <div className="text-[10px] text-slate-400">ডেইলি স্ট্রিক 🔥</div>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-500 text-xs font-bold mb-0.5">
                <Award size={14} />
                <span>লেভেল</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {toBengaliNumber(levelInfo.level)}
              </div>
              <div className="text-[10px] text-slate-400">আর {toBengaliNumber(levelInfo.remainingXp)} XP বাকি</div>
            </div>
          </div>

          {/* Progress Bar towards next rank */}
          <div className="pt-2 pb-1">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {toBengaliNumber(xp)} / {toBengaliNumber(nextRankXp)} XP
              </span>
              <span>
                পরের লেভেল: <span className="font-bold text-emerald-600 dark:text-emerald-400">{nextRankTitle}</span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>

        {/* Subtle Minimal Bottom Line */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} <a href="https://markazuliman.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 hover:underline">মারকাযুল ঈমান (Markazul Iman)</a> • সর্বস্বত্ব সংরক্ষিত
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            সীরাত: নবীজী ﷺ-এর জীবনী নিয়ে ধারাবাহিক দারস
          </div>
        </div>

      </div>
    </footer>
  );
}
