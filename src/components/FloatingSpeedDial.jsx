import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Volume2, VolumeX, User, Share2, MessageSquare, Flag, 
  HelpCircle, ArrowDown, ArrowUp, X, Check, ExternalLink, 
  BookOpen, Award, ShieldCheck, Send, Download, Sparkles,
  Languages, BookX, Trophy, Lock, SlidersHorizontal
} from 'lucide-react';
import { useSoundMuted } from '../utils/soundEffects';
import { getShowEnglish, toggleShowEnglish } from '../utils/storage';
import { getVoiceProfile, setVoiceProfile, playArabicAudio } from '../utils/audio';
import { getPendingMistakesCount } from '../utils/mistakesManager';
import { getVolumeProgress } from '../utils/certificateManager';
import { toBengaliNumber } from '../utils/lessonSubSections';

export default function FloatingSpeedDial({
  darkMode,
  setDarkMode,
  user,
  onOpenAuth,
  onOpenReport,
  onOpenBook,
  onOpenMistakes,
  onOpenLeaderboard,
  onOpenCertificate,
  onNavigateTab,
  customItems = []
}) {
  // Single right button opens dual columns simultaneously (Left: Settings/Tools, Right: Learning/Profile)
  const [isOpen, setIsOpen] = useState(false);

  const [soundMuted, toggleSound] = useSoundMuted();
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const rightDialRef = useRef(null);
  const leftDialRef = useRef(null);
  const rightScrollContainerRef = useRef(null);
  const leftScrollContainerRef = useRef(null);

  // Monitor scroll for Smart Scroll toggle direction (Top vs Bottom)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside or ESC key to close both columns
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideRight = rightDialRef.current && rightDialRef.current.contains(e.target);
      const clickedInsideLeft = leftDialRef.current && leftDialRef.current.contains(e.target);
      
      if (!clickedInsideRight && !clickedInsideLeft) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowHelpModal(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const [showEnglish, setShowEnglishState] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglishState(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  // Voice Profile Handler
  const [voiceProfile, setVoiceProfileState] = useState(() => getVoiceProfile());
  useEffect(() => {
    const handleVoiceChange = (e) => setVoiceProfileState(e.detail?.profile || getVoiceProfile());
    window.addEventListener('uls_voice_profile_changed', handleVoiceChange);
    return () => window.removeEventListener('uls_voice_profile_changed', handleVoiceChange);
  }, []);
  const handleVoiceToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const next = setVoiceProfile(voiceProfile === 'adult' ? 'child' : 'adult');
    setVoiceProfileState(next);
    playArabicAudio('اَلسَّلَامُ عَلَيْكُمْ');
  };

  // English toggle handler
  const handleEnglishToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const nextVal = toggleShowEnglish();
    setShowEnglishState(nextVal);
  };

  // Theme toggle handler
  const handleThemeToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof setDarkMode === 'function') {
      setDarkMode(!darkMode);
    }
  };

  // Sound toggle handler
  const handleSoundToggle = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    toggleSound();
  };

  // Profile handler
  const handleProfileClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onOpenAuth === 'function') {
      onOpenAuth();
    }
    setIsOpen(false);
  };

  // Mistakes Notebook (ভুল) handler
  const [pendingMistakesCount, setPendingMistakesCount] = useState(() => getPendingMistakesCount());

  useEffect(() => {
    const handleMistakesUpdate = (e) => {
      setPendingMistakesCount(e.detail?.count ?? getPendingMistakesCount());
    };
    window.addEventListener('uls_mistakes_updated', handleMistakesUpdate);
    return () => window.removeEventListener('uls_mistakes_updated', handleMistakesUpdate);
  }, []);

  const handleMistakesClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onOpenMistakes === 'function') {
      onOpenMistakes();
    } else {
      window.dispatchEvent(new CustomEvent('uls_open_mistakes_modal'));
    }
    setIsOpen(false);
  };

  // Leaderboard handler
  const handleLeaderboardClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onOpenLeaderboard === 'function') {
      onOpenLeaderboard();
    } else {
      window.dispatchEvent(new CustomEvent('uls_open_leaderboard'));
    }
    setIsOpen(false);
  };

  // Certificate handler
  const handleCertificateClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onOpenCertificate === 'function') {
      onOpenCertificate();
    } else {
      window.dispatchEvent(new CustomEvent('uls_open_certificate'));
    }
    setIsOpen(false);
  };

  // Book handler
  const handleBookClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (onOpenBook) onOpenBook();
    else if (onNavigateTab) onNavigateTab('book');
    setIsOpen(false);
  };

  // Direct APK Download handler
  const handleDownloadApk = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const apkUrl = '/downloads/ArbiShikhi-release-signed.apk';
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'ArbiShikhi-release-signed.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3200);
    setIsOpen(false);
  };

  // Share handler
  const handleShareClick = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://arabic.markazuliman.com';
    const shareData = {
      title: 'Sirat - সীরাত',
      text: 'সীরাত — নবীজী ﷺ-এর জীবনী নিয়ে ধারাবাহিক দারস, মারকাযুল ঈমান।',
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Cancelled or unsupported
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2400);
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }
    }
    setIsOpen(false);
  };

  // Message / Feedback handler
  const handleMessageClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onOpenReport === 'function') {
      onOpenReport({
        source: 'floating_speed_dial',
        category: 'other',
        isMessage: true,
        title: 'পরামর্শ বা মেসেজ পাঠান'
      });
    }
    setIsOpen(false);
  };

  // Report Error handler
  const handleReportClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onOpenReport === 'function') {
      onOpenReport({
        source: 'floating_speed_dial',
        category: 'harakat',
        isMessage: false,
        title: 'ভুলত্রুটি বা অসঙ্গতি রিপোর্ট'
      });
    }
    setIsOpen(false);
  };

  // Help & Developer Support handler
  const handleHelpClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowHelpModal(true);
    setIsOpen(false);
  };

  // Smart Scroll handler
  const handleSmartScroll = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isScrolledDown) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight || document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  // ================= STRICTLY ONE-WORD LABELS =================
  // Left Side Items: Settings, Audio, Theme & System Tools
  const leftItems = [
    {
      id: 'theme',
      label: darkMode ? 'লাইট' : 'ডার্ক',
      icon: darkMode ? Sun : Moon,
      gradient: darkMode 
        ? 'from-amber-500 via-orange-500 to-yellow-400 shadow-amber-500/35 ring-amber-400/30' 
        : 'from-indigo-600 via-purple-600 to-slate-900 shadow-indigo-600/35 ring-indigo-400/30',
      onClick: handleThemeToggle
    },
    {
      id: 'sound',
      label: soundMuted ? 'মিউট' : 'সাউন্ড',
      icon: soundMuted ? VolumeX : Volume2,
      gradient: soundMuted 
        ? 'from-slate-600 via-slate-700 to-slate-800 shadow-slate-600/35 ring-slate-400/30'
        : 'from-emerald-500 via-teal-600 to-emerald-600 shadow-emerald-500/35 ring-emerald-400/30',
      onClick: handleSoundToggle
    },
    {
      id: 'english_toggle',
      label: showEnglish ? 'English' : 'ইংরেজি',
      icon: Languages,
      gradient: showEnglish
        ? 'from-emerald-500 via-teal-600 to-cyan-500 shadow-emerald-500/35 ring-emerald-400/30'
        : 'from-slate-600 via-slate-700 to-slate-800 shadow-slate-600/35 ring-slate-400/30',
      onClick: handleEnglishToggle
    },
    {
      id: 'smart_scroll',
      label: isScrolledDown ? 'উপরে' : 'নিচে',
      icon: isScrolledDown ? ArrowUp : ArrowDown,
      gradient: isScrolledDown
        ? 'from-sky-500 via-blue-600 to-indigo-600 shadow-sky-500/35 ring-sky-400/30'
        : 'from-teal-600 via-cyan-600 to-sky-600 shadow-teal-600/35 ring-teal-400/30',
      onClick: handleSmartScroll
    },
    {
      id: 'share',
      label: copiedToast ? 'কপি!' : 'শেয়ার',
      icon: copiedToast ? Check : Share2,
      gradient: 'from-blue-600 via-sky-600 to-indigo-600 shadow-blue-600/35 ring-blue-400/30',
      onClick: handleShareClick
    },
    {
      id: 'download_apk',
      label: downloadToast ? 'ডাউনলোড' : 'অ্যাপ',
      icon: downloadToast ? Check : Download,
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600 shadow-emerald-600/35 ring-emerald-400/30',
      onClick: handleDownloadApk
    },
    {
      id: 'message',
      label: 'মেসেজ',
      icon: MessageSquare,
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600 shadow-purple-600/35 ring-purple-400/30',
      onClick: handleMessageClick
    },
    {
      id: 'report',
      label: 'রিপোর্ট',
      icon: Flag,
      gradient: 'from-rose-600 via-pink-600 to-rose-500 shadow-rose-600/35 ring-rose-400/30',
      onClick: handleReportClick
    }
  ];

  // Right Side Items: Learning, Progress, Profile & Book Exploration
  const rightItems = [
    {
      id: 'profile',
      label: 'প্রোফাইল',
      icon: User,
      gradient: 'from-teal-600 via-emerald-600 to-cyan-600 shadow-teal-600/35 ring-teal-400/30',
      onClick: handleProfileClick
    },
    {
      id: 'leaderboard',
      label: 'লিডারবোর্ড',
      icon: Trophy,
      gradient: 'from-amber-500 via-yellow-500 to-amber-600 shadow-amber-500/35 ring-amber-400/30',
      onClick: handleLeaderboardClick
    },
    {
      id: 'certificate',
      label: getVolumeProgress('vol1').isUnlocked ? 'সনদপত্র' : 'সনদ🔒',
      icon: getVolumeProgress('vol1').isUnlocked ? Award : Lock,
      gradient: getVolumeProgress('vol1').isUnlocked
        ? 'from-amber-600 via-amber-500 to-yellow-500 shadow-amber-500/35 ring-amber-400/30'
        : 'from-slate-700 via-slate-800 to-slate-900 shadow-slate-700/35 ring-slate-600/30',
      onClick: handleCertificateClick
    },
    {
      id: 'mistakes',
      label: pendingMistakesCount > 0 ? `ভুল(${toBengaliNumber(pendingMistakesCount)})` : 'ভুলখাতা',
      icon: BookX,
      gradient: 'from-rose-600 via-rose-500 to-amber-600 shadow-rose-600/35 ring-rose-400/30',
      badge: pendingMistakesCount > 0 ? toBengaliNumber(pendingMistakesCount) : null,
      onClick: handleMistakesClick
    },
    {
      id: 'book',
      label: 'কিতাব',
      icon: BookOpen,
      gradient: 'from-emerald-600 via-teal-600 to-emerald-500 shadow-emerald-600/35 ring-emerald-400/30',
      onClick: handleBookClick
    },
    {
      id: 'intro',
      label: 'ইন্ট্রো',
      icon: Sparkles,
      gradient: 'from-amber-500 via-yellow-500 to-amber-600 shadow-amber-500/35 ring-amber-400/30',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('uls_replay_intro'));
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      label: 'সাহায্য',
      icon: HelpCircle,
      gradient: 'from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/35 ring-amber-400/30',
      onClick: handleHelpClick
    }
  ];

  return (
    <>
      {/* Toast confirmation for Link Copy */}
      {copiedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-slate-900/95 dark:bg-emerald-950/95 text-white font-bold text-xs shadow-2xl border border-emerald-500/50 flex items-center gap-2 backdrop-blur-md">
            <Check size={14} className="text-emerald-400" />
            <span>সাইটের লিংক কপি করা হয়েছে!</span>
          </div>
        </div>
      )}

      {/* Toast confirmation for APK Download */}
      {downloadToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-emerald-950/95 text-white font-bold text-xs shadow-2xl border border-emerald-400/50 flex items-center gap-2 backdrop-blur-md">
            <Download size={14} className="text-emerald-400 animate-pulse" />
            <span>Sirat APK ডাউনলোড শুরু হচ্ছে... 🚀</span>
          </div>
        </div>
      )}

      {/* Dark Backdrop Overlay when open */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-35 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in pointer-events-auto"
        />
      )}

      {/* ================= 1. LEFT COLUMN: SETTINGS & TOOLS (NO SEPARATE BUTTON) ================= */}
      <div 
        ref={leftDialRef}
        className="fixed z-40 left-3.5 sm:left-7 bottom-15 md:bottom-7 flex flex-col items-start pointer-events-none select-none mb-13.5 md:mb-12.5"
      >
        {/* Expanded Left Speed Dial Action Items Container */}
        <div 
          ref={leftScrollContainerRef}
          className={`flex flex-col items-start gap-2.5 select-none overscroll-contain transition-all duration-200 origin-bottom-left ${
            isOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto visible py-1 pl-1 pr-2' 
              : 'opacity-0 translate-y-3 pointer-events-none invisible h-0 w-0 py-0 pl-0 pr-0 overflow-hidden'
          } ${
            isOpen 
              ? 'max-h-[calc(100vh-140px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' 
              : 'max-h-0'
          }`}
        >
          {leftItems.map((item, idx) => {
            const IconComponent = item.icon || SlidersHorizontal;
            const reverseIdx = leftItems.length - 1 - idx;

            return (
              <div 
                key={item.id || idx}
                className={`flex items-center gap-2 group cursor-pointer transition-all duration-300 ease-out ${
                  isOpen 
                    ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto' 
                    : 'translate-y-4 scale-90 opacity-0 pointer-events-none'
                }`}
                style={{ 
                  transitionDelay: isOpen ? `${reverseIdx * 30}ms` : `${idx * 15}ms`,
                  transformOrigin: 'left center'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof item.onClick === 'function') {
                    item.onClick(e);
                  }
                }}
              >
                {/* Action Button on Left */}
                <button
                  type="button"
                  className={`w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center shadow-md ring-1 sm:ring-2 border border-white/25 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 active:scale-90 cursor-pointer`}
                  title={item.label}
                >
                  <IconComponent size={16} className="text-white drop-shadow-sm stroke-[2.2]" />
                </button>

                {/* Glassmorphism ONE-WORD Label on Right */}
                <div className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 shadow-sm shadow-slate-950/10 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800/80 transition-all duration-200 group-hover:translate-x-1 group-hover:border-indigo-500/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 active:scale-95">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 2. RIGHT COLUMN & SOLE TRIGGER BUTTON ================= */}
      <div 
        ref={rightDialRef}
        className="fixed z-40 right-3.5 sm:right-7 bottom-15 md:bottom-7 flex flex-col items-end pointer-events-none select-none"
      >
        {/* Expanded Right Speed Dial Action Items Container */}
        <div 
          ref={rightScrollContainerRef}
          className={`flex flex-col items-end gap-2.5 select-none overscroll-contain transition-all duration-200 origin-bottom-right ${
            isOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto visible mb-2.5 py-1 pr-1 pl-2' 
              : 'opacity-0 translate-y-3 pointer-events-none invisible h-0 w-0 mb-0 py-0 pr-0 pl-0 overflow-hidden'
          } ${
            isOpen 
              ? 'max-h-[calc(100vh-140px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' 
              : 'max-h-0'
          }`}
        >
          {rightItems.map((item, idx) => {
            const IconComponent = item.icon || Sparkles;
            const reverseIdx = rightItems.length - 1 - idx;

            return (
              <div 
                key={item.id || idx}
                className={`flex items-center gap-2 group cursor-pointer transition-all duration-300 ease-out ${
                  isOpen 
                    ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto' 
                    : 'translate-y-4 scale-90 opacity-0 pointer-events-none'
                }`}
                style={{ 
                  transitionDelay: isOpen ? `${reverseIdx * 30}ms` : `${idx * 15}ms`,
                  transformOrigin: 'right center'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof item.onClick === 'function') {
                    item.onClick(e);
                  }
                }}
              >
                {/* Glassmorphism ONE-WORD Label on Left */}
                <div className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 shadow-sm shadow-slate-950/10 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800/80 transition-all duration-200 group-hover:-translate-x-1 group-hover:border-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 active:scale-95">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                </div>

                {/* Glowing Gradient Action Button on Right */}
                <button
                  type="button"
                  className={`w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center shadow-md ring-1 sm:ring-2 border border-white/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 active:scale-90 cursor-pointer`}
                  title={item.label}
                >
                  <IconComponent size={16} className="text-white drop-shadow-sm stroke-[2.2]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* The Sole Floating Trigger Button (Emerald / Aquatic Water Gem ۞) */}
        <div className="relative group pointer-events-auto">
          {!isOpen && (
            <>
              <div className="absolute -inset-2 rounded-full border border-emerald-500/30 dark:border-cyan-400/30 animate-ping pointer-events-none duration-1000 opacity-50 dark:opacity-60" />
              <div className="absolute -inset-1.5 rounded-full bg-emerald-500/15 dark:bg-cyan-400/20 blur-sm dark:blur-md pointer-events-none animate-pulse" />
            </>
          )}

          {/* Soft Ambient Glow Halo */}
          <div 
            className={`absolute -inset-1.5 rounded-full transition-all duration-500 pointer-events-none ${
              isOpen
                ? 'blur-sm bg-gradient-to-r from-emerald-500/35 via-teal-400/30 to-cyan-400/35 opacity-80 scale-105'
                : 'blur-sm dark:blur-md bg-emerald-500/20 dark:bg-gradient-to-r dark:from-cyan-400/40 dark:via-teal-400/30 dark:to-sky-400/40 opacity-70 dark:opacity-75 group-hover:opacity-100 group-hover:scale-110'
            }`}
          />

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 overflow-hidden ${
              isOpen
                ? 'bg-emerald-50 dark:bg-slate-950 dark:bg-gradient-to-b dark:from-slate-900 dark:via-emerald-950/60 dark:to-slate-950 border-2 border-emerald-500 dark:border-emerald-500/60 ring-2 ring-emerald-200 dark:ring-emerald-500/30 shadow-lg shadow-emerald-900/20 dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] rotate-90 scale-105'
                : 'bg-white border-2 border-emerald-500/85 ring-2 ring-emerald-100 shadow-md shadow-slate-300/80 group-hover:border-emerald-600 group-hover:ring-emerald-200 dark:bg-slate-950 dark:bg-gradient-to-b dark:from-slate-900/95 dark:via-slate-950 dark:to-cyan-950/80 dark:border-cyan-500/50 dark:ring-1 dark:ring-cyan-500/20 dark:shadow-[0_10px_35px_rgba(0,0,0,0.85)] dark:group-hover:border-cyan-400/70 group-hover:scale-105'
            }`}
            title={isOpen ? 'মেনু বন্ধ করুন' : 'কুইক অ্যাকশন মেনু (۞)'}
            aria-label="Quick Action Dual Menu"
          >
            {!isOpen && (
              <div className="hidden dark:block absolute top-1 inset-x-2 h-1.5 rounded-full bg-gradient-to-b from-cyan-300/25 via-cyan-400/10 to-transparent pointer-events-none" />
            )}
            {!isOpen && (
              <div className="hidden dark:block absolute bottom-1 inset-x-2 h-1.5 rounded-full bg-cyan-500/20 blur-xs pointer-events-none" />
            )}

            <div className={`relative z-10 transition-all duration-300 ${isOpen ? 'rotate-90 scale-105' : 'rotate-0 scale-100'}`}>
              {isOpen ? (
                <X className="w-4.5 h-4.5 md:w-4 md:h-4 stroke-[2.5] text-emerald-700 dark:text-emerald-400 drop-shadow-sm" />
              ) : (
                <svg 
                  className="w-5.5 h-5.5 md:w-5 md:h-5 text-emerald-600 dark:text-cyan-300 fill-emerald-600/15 dark:fill-cyan-400/20 drop-shadow-sm dark:drop-shadow-[0_2px_10px_rgba(6,182,212,0.7)] transition-transform duration-300 group-hover:scale-110" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect width="13" height="13" x="5.5" y="5.5" rx="1.5" />
                  <rect width="13" height="13" x="5.5" y="5.5" rx="1.5" transform="rotate(45 12 12)" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              )}
            </div>

            {/* Red mistakes count badge or Accent pulse dot when closed */}
            {!isOpen && (
              pendingMistakesCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 z-20 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-rose-600 text-white font-bold text-[9px] items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                    {pendingMistakesCount > 9 ? '৯+' : toBengaliNumber(pendingMistakesCount)}
                  </span>
                </span>
              ) : (
                <span className="absolute top-0.5 right-1 flex h-2 w-2 z-20 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-cyan-400 opacity-75 dark:opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-cyan-400 border border-white dark:border-slate-900 shadow-xs"></span>
                </span>
              )
            )}
          </button>
        </div>
      </div>

      {/* ================= HELP & DEVELOPER SUPPORT MODAL ================= */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowHelpModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-emerald-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                    সহায়তা ও ডেভেলপার সাপোর্ট
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    মারকাযুল ঈমান • ULS Arabic
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Quick Guide */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <BookOpen size={14} />
                  <span>কীভাবে সহজে শিখবেন?</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-4 list-disc font-medium">
                  <li><strong>দরস:</strong> ১ থেকে ৭০ পর্যন্ত পর্যায়ক্রমে পাঠ ও তামরীন অনুশীলন করুন।</li>
                  <li><strong>ফ্ল্যাশকার্ড ও অডিও:</strong> বিশুদ্ধ হরকতযুক্ত আরবি উচ্চারণ বারবার শুনুন ও মুখস্থ করুন।</li>
                  <li><strong>পরীক্ষা:</strong> প্রতিটি অধ্যায় শেষে গ্রিল মি এক্সামে মেধা যাচাই করুন।</li>
                </ul>
              </div>

              {/* Technical Cell & Org Info */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/30 dark:to-slate-800/60 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck size={14} />
                  <span>ডেভেলপার ও টেকনিক্যাল সেল</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  এই প্ল্যাটফর্মটি <strong>মারকাযুল ঈমান</strong>-এর ডিজিটাল লার্নিং সেল কর্তৃক পরিচালিত ও সার্বক্ষণিকভাবে রক্ষণাবেক্ষণ করা হয়।
                </p>
                <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
                  <a
                    href="https://markazuliman.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-50 transition-colors"
                  >
                    <span>অফিসিয়াল ওয়েবসাইট</span>
                    <ExternalLink size={11} />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHelpModal(false);
                      if (onOpenReport) {
                        onOpenReport({
                          source: 'help_modal',
                          category: 'other',
                          title: 'ডেভেলপার সহায়তা ও মেসেজ'
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Send size={11} />
                    <span>সরাসরি মেসেজ পাঠান</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Close */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
