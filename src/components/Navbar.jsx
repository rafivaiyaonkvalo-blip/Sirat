import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Library, Layers, Award, Menu, X, Download, LogIn, User, PenTool } from 'lucide-react';
import { isSuperUser } from '../utils/superUser';
import DynamicLogo, { LOGO_VARIANTS } from './DynamicLogo';
import { triggerHaptic } from '../utils/haptics';
import { getShowEnglish, toggleShowEnglish } from '../utils/storage';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  darkMode, 
  setDarkMode, 
  totalWords, 
  user, 
  onOpenAuth 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeVariant, setActiveVariant] = useState(LOGO_VARIANTS[0]);
  const [showEnglish, setShowEnglishState] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglishState(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  const handleToggleEnglish = () => {
    triggerHaptic();
    const nextVal = toggleShowEnglish();
    setShowEnglishState(nextVal);
  };

  const [superUnlocked, setSuperUnlocked] = useState(() => isSuperUser(user));

  useEffect(() => {
    setSuperUnlocked(isSuperUser(user));
  }, [user]);

  useEffect(() => {
    const handleUnlock = () => setSuperUnlocked(isSuperUser(user));
    window.addEventListener('uls_superuser_unlocked', handleUnlock);
    window.addEventListener('storage', handleUnlock);
    return () => {
      window.removeEventListener('uls_superuser_unlocked', handleUnlock);
      window.removeEventListener('storage', handleUnlock);
    };
  }, [user]);

  const isSuper = superUnlocked;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const navItems = [
    { id: 'lessons', label: 'দারস', icon: BookOpen },
    { id: 'durood', label: 'দুরূদ', icon: Heart },
    { id: 'quiz', label: 'কুইজ', icon: PenTool },
    { id: 'exam', label: 'পরীক্ষা', icon: Award },
    { id: 'book', label: 'বই', icon: Library },
  ];



  return (
    <>
      {/* Desktop Header (Logo, Nav Tabs, Actions) - Hidden on Mobile */}
      <header 
        style={{ paddingTop: 'max(0px, env(safe-area-inset-top, 0px))' }}
        className="hidden md:block sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <DynamicLogo 
                size="brand" 
                updateFavicon={true} 
                onVariantChange={setActiveVariant} 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('uls_replay_intro'));
                }}
                className="shrink-0" 
              />
              <div>
                <div 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('uls_replay_intro'));
                  }}
                  className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-none cursor-pointer flex items-center gap-1.5"
                  title="কালেমা ক্যালিগ্রাফি অ্যানিমেশন দেখুন"
                >
                  <span 
                    className="font-black tracking-tight transition-colors duration-1000"
                    style={{ 
                      color: darkMode ? (activeVariant?.textColorDark || '#38bdf8') : (activeVariant?.textColorLight || '#0284c7'),
                      textShadow: activeVariant?.glowColor ? `0 0 14px ${activeVariant.glowColor}` : undefined
                    }}
                  >
                    Sirat
                  </span>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">• সীরাত</span>
                </div>
                <a 
                  href="https://markazuliman.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  title="মারকাযুল ঈমান অফিসিয়াল ওয়েবসাইট (markazuliman.com)"
                  className="text-[11px] mt-0.5 font-semibold hover:underline block transition-colors duration-1000"
                  style={{ 
                    color: darkMode ? (activeVariant?.textColorDark || '#38bdf8') : (activeVariant?.textColorLight || '#0284c7')
                  }}
                >
                  <span className="underline decoration-emerald-500/50">মারকাযুল ঈমান ↗</span>
                </a>
              </div>
            </div>

            {/* Desktop Nav - Clean Single Word Buttons */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={item.isLocked ? `${item.label} (পরীক্ষামূলক • লক করা)` : item.label}
                  >
                    <Icon size={14} className={isActive ? 'text-white' : item.isLocked ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'} />
                    <span>{item.label}</span>
                    {item.isLocked && (
                      <span className="text-[10px] font-normal px-1 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        লক
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              {/* English (ENG) Toggle Button */}
              <button
                type="button"
                onClick={handleToggleEnglish}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  showEnglish
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={showEnglish ? "ইংরেজি বন্ধ করুন (শুধু বাংলা দেখতে ট্যাপ করুন)" : "ইংরেজি অর্থ চালু করুন (বাংলার সাথে ইংরেজি দেখতে ট্যাপ করুন)"}
              >
                <span className="font-mono text-xs font-black tracking-wide">ENG</span>
                <span className={`w-1.5 h-1.5 rounded-full ${showEnglish ? 'bg-white shadow-xs' : 'bg-slate-400 dark:bg-slate-500'}`} />
              </button>

              {/* PWA Install Button */}
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  title="অ্যাপটি ইন্সটল করুন (অফলাইন ব্যবহারের জন্য)"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-600/30 text-xs font-bold transition-all animate-pulse hover:animate-none cursor-pointer"
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">অ্যাপ ইন্সটল</span>
                </button>
              )}

              {/* Log In / User Profile Button */}
              {user ? (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-xs"
                  title="প্রোফাইল ও ক্লাউড সিঙ্ক"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User size={15} className="text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span className="hidden sm:inline max-w-[100px] truncate font-medium">
                    {user.displayName ? user.displayName.split(' ')[0] : 'প্রোফাইল'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-600/25 text-xs font-semibold transition-all cursor-pointer hover:scale-102 active:scale-95"
                  title="লগ ইন বা অ্যাকাউন্ট তৈরি করুন"
                >
                  <LogIn size={15} />
                  <span>লগ ইন</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Navigation Bar (The 5 Tabs at Top - Replaces Old Header & Bottom Nav Bar) */}
      <header 
        style={{ 
          paddingTop: 'max(0.35rem, env(safe-area-inset-top, 0.35rem))',
          paddingLeft: 'max(0.35rem, env(safe-area-inset-left, 0.35rem))',
          paddingRight: 'max(0.35rem, env(safe-area-inset-right, 0.35rem))'
        }}
        className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
      >
        <nav className="flex items-center justify-around py-1 px-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentTab(item.id);
                }}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
                title={item.isLocked ? `${item.label} (লক করা)` : item.label}
              >
                <div className="relative">
                  <Icon size={18} className={isActive ? 'text-emerald-600 dark:text-emerald-400 stroke-[2.5]' : item.isLocked ? 'text-amber-500' : 'text-slate-400'} />
                  {item.isLocked && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </header>
    </>
  );
}
