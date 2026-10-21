import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import FloatingSpeedDial from './components/FloatingSpeedDial';
import AdminPortal from './components/admin/AdminPortal';
import AnimatedSplashIntro from './components/AnimatedSplashIntro';
import GlobalAnnouncementBanner from './components/GlobalAnnouncementBanner';
import MistakesNotebookModal from './components/MistakesNotebookModal';
import LeaderboardModal from './components/LeaderboardModal';
import CertificateModal from './components/CertificateModal';
import { subscribeToAuth, loadUserDataFromCloud, syncUserDataToCloud } from './services/firebase';
import { loadMistakesFromCloud } from './utils/mistakesManager';
import { initAnalyticsTracker, updateTrackerUser, trackPageView } from './services/analyticsTracker';
import { useLiveScreenBroadcaster } from './hooks/useLiveScreenBroadcaster';

import SiratDars from './sirat/SiratDars';
import DuroodView from './sirat/DuroodView';
import QuizView from './sirat/QuizView';
import ExamView from './sirat/ExamView';
import BookView from './sirat/BookView';
import { isSuperUser, applySuperUserUnlock, setVerifiedSuperUser } from './utils/superUser';

const EMPTY_LIST = [];
const EMPTY_LESSONS = { lessons: [] };

const getInitialTab = () => {
  if (typeof window !== 'undefined') {
    try {
      const path = window.location.pathname.replace(/\/+$/, '');
      if (path === '/rafi' || path.endsWith('/rafi')) {
        return 'admin';
      }

      const validTabs = ['lessons', 'durood', 'quiz', 'exam', 'book'];
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.replace('#', '');
      const paramTab = params.get('tab');
      if (paramTab && validTabs.includes(paramTab)) {
        return paramTab;
      }
      if (hash && validTabs.includes(hash)) {
        return hash;
      }

      const savedTab = localStorage.getItem('uls_active_tab');
      if (savedTab && validTabs.includes(savedTab)) {
        return savedTab;
      }
    } catch (e) {
      console.warn('Error reading initial tab:', e);
    }
  }
  return 'lessons';
};

export default function App() {
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContext, setReportContext] = useState({});
  const [mistakesModalOpen, setMistakesModalOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState('original');
  const [user, setUser] = useState(null);
  const [isSuper, setIsSuper] = useState(() => isSuperUser(null));
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !window.location.search.includes('nosplash=1');
    } catch {
      return true;
    }
  });
  const [splashClosing, setSplashClosing] = useState(false);

  // Live Screen Mirror Broadcaster for Admin Co-Browsing
  useLiveScreenBroadcaster(currentTab, user);

  // Listen for replay intro triggers (e.g., from Speed Dial or Profile)
  useEffect(() => {
    const handleReplay = () => {
      setSplashClosing(false);
      setShowSplash(true);
    };
    window.addEventListener('uls_replay_intro', handleReplay);
    return () => window.removeEventListener('uls_replay_intro', handleReplay);
  }, []);

  // Listen for Open Mistakes Notebook triggers
  useEffect(() => {
    const handleOpenMistakes = () => setMistakesModalOpen(true);
    window.addEventListener('uls_open_mistakes_modal', handleOpenMistakes);
    return () => window.removeEventListener('uls_open_mistakes_modal', handleOpenMistakes);
  }, []);

  // Listen for Open Leaderboard triggers
  useEffect(() => {
    const handleOpenLeaderboard = () => setLeaderboardModalOpen(true);
    window.addEventListener('uls_open_leaderboard', handleOpenLeaderboard);
    return () => window.removeEventListener('uls_open_leaderboard', handleOpenLeaderboard);
  }, []);

  // Listen for Open Certificate triggers
  useEffect(() => {
    const handleOpenCertificate = () => setCertificateModalOpen(true);
    window.addEventListener('uls_open_certificate', handleOpenCertificate);
    return () => window.removeEventListener('uls_open_certificate', handleOpenCertificate);
  }, []);

  // Initialize Website Usage Tracer & Activity Heartbeat
  useEffect(() => {
    initAnalyticsTracker(user);
  }, []);

  useEffect(() => {
    if (user) {
      updateTrackerUser(user);
    }
  }, [user]);

  useEffect(() => {
    trackPageView(currentTab);
  }, [currentTab]);

  useEffect(() => {
    setIsSuper(isSuperUser(user));
  }, [user]);

  useEffect(() => {
    const handleUnlock = () => setIsSuper(isSuperUser(user));
    window.addEventListener('uls_superuser_unlocked', handleUnlock);
    window.addEventListener('storage', handleUnlock);
    return () => {
      window.removeEventListener('uls_superuser_unlocked', handleUnlock);
      window.removeEventListener('storage', handleUnlock);
    };
  }, [user]);

  useEffect(() => {
    const unsub = subscribeToAuth(async (currentUser) => {
      setVerifiedSuperUser(currentUser);
      if (currentUser) {
        await loadUserDataFromCloud(currentUser);
        await loadMistakesFromCloud(currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Automatic background Cloud Sync whenever progress is made
  useEffect(() => {
    if (!user) return;
    let timer = null;

    const triggerSync = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const currentUid = localStorage.getItem('uls_current_user_uid');
          if (currentUid && currentUid === user?.uid) {
            await syncUserDataToCloud(user);
          }
        } catch (e) {
          console.warn('Auto-sync silent warning:', e);
        }
      }, 2500); // 2.5s debounce
    };

    window.addEventListener('uls_progress_changed', triggerSync);
    
    // Auto-sync pending progress when device reconnects to internet
    const handleOnline = () => {
      const currentUid = localStorage.getItem('uls_current_user_uid');
      if (user && currentUid === user?.uid) {
        syncUserDataToCloud(user).catch(() => {});
      }
    };
    window.addEventListener('online', handleOnline);

    // Also periodic safety sync every 3 minutes
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        const currentUid = localStorage.getItem('uls_current_user_uid');
        if (currentUid && currentUid === user?.uid) {
          syncUserDataToCloud(user).catch(() => {});
        }
      }
    }, 180000);

    return () => {
      if (timer) clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('uls_progress_changed', triggerSync);
      window.removeEventListener('online', handleOnline);
    };
  }, [user]);

  // Persist current tab across refresh and synchronize URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (currentTab !== 'admin') {
          localStorage.setItem('uls_active_tab', currentTab);
        }
        const url = new URL(window.location.href);
        if (currentTab === 'lessons') {
          url.searchParams.delete('tab');
        } else if (currentTab !== 'admin') {
          url.searchParams.set('tab', currentTab);
        }
        const relativePath = url.pathname + url.search + url.hash;
        window.history.replaceState(null, '', relativePath);
      } catch (e) {
        console.warn('Failed to sync tab state:', e);
      }
    }
  }, [currentTab]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '');
      if (path === '/rafi' || path.endsWith('/rafi')) {
        setCurrentTab('admin');
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || 'lessons';
      const validTabs = ['lessons', 'durood', 'quiz', 'exam', 'book'];
      if (validTabs.includes(tab)) {
        setCurrentTab(tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check URL pathname strictly for /rafi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/\/+$/, '');
      if (path === '/rafi' || path.endsWith('/rafi')) {
        setCurrentTab('admin');
      }
    }
  }, []);

  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('uls_theme');
        if (saved === 'dark' || saved === 'light') return saved;
        return 'system';
      } catch {
        return 'system';
      }
    }
    return 'system';
  });

  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const darkMode = themePreference === 'system' ? systemDark : (themePreference === 'dark');

  // Real-time listener for device system dark mode change
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e) => {
      setSystemDark(e.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    const handleDeviceTheme = (e) => {
      if (e?.detail?.isDark !== undefined) {
        setSystemDark(e.detail.isDark);
      }
    };
    window.addEventListener('uls_device_theme_changed', handleDeviceTheme);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('uls_device_theme_changed', handleDeviceTheme);
    };
  }, []);

  const setDarkMode = (val) => {
    let nextMode;
    if (typeof val === 'function') {
      nextMode = val(darkMode) ? 'dark' : 'light';
    } else {
      nextMode = val ? 'dark' : 'light';
    }
    setThemePreference(nextMode);
    try {
      localStorage.setItem('uls_theme', nextMode);
    } catch {}
  };

  // Apply dark class to <html> and <body> and notify native Android
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    try {
      if (darkMode) {
        root.classList.add('dark');
        if (body) body.classList.add('dark');
        root.style.colorScheme = 'dark';
        root.style.backgroundColor = '#0A0D12';
        if (body) body.style.backgroundColor = '#0A0D12';
      } else {
        root.classList.remove('dark');
        if (body) body.classList.remove('dark');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#FFFFFF';
        if (body) body.style.backgroundColor = '#FFFFFF';
      }

      // Update browser/Android theme-color meta
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', darkMode ? '#0A0D12' : '#FFFFFF');
      }

      // Sync native Android status bar & navigation bar
      if (window.AndroidApp && typeof window.AndroidApp.onThemeChanged === 'function') {
        window.AndroidApp.onThemeChanged(darkMode);
      }
    } catch (e) {}
  }, [darkMode]);

  // Smart Android Native Back Button Handler
  useEffect(() => {
    window.__handleAndroidBack = () => {
      // 1. If auth modal is open, close it
      if (authModalOpen) {
        setAuthModalOpen(false);
        return true;
      }
      // 2. If report modal is open, close it
      if (reportModalOpen) {
        setReportModalOpen(false);
        return true;
      }
      // 3. If book modal is open, close it
      if (selectedBook) {
        setSelectedBook(null);
        return true;
      }
      // 4. If on another tab than lessons, navigate back to lessons
      if (currentTab !== 'lessons') {
        setCurrentTab('lessons');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
      // Nothing open, let native Android handle back (show exit toast)
      return false;
    };
    return () => {
      delete window.__handleAndroidBack;
    };
  }, [authModalOpen, reportModalOpen, selectedBook, currentTab]);

  if (currentTab === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <AdminPortal
          lessonsData={EMPTY_LESSONS}
          vocabularyData={EMPTY_LIST}
          chaptersData={EMPTY_LIST}
          onExitAdmin={() => {
            if (typeof window !== 'undefined') {
              const baseRoot = window.location.pathname.replace(/\/rafi\/?$/, '') || import.meta.env.BASE_URL || '/';
              window.history.pushState(null, '', baseRoot);
            }
            setCurrentTab('lessons');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToLesson={(lessonId) => {
            if (typeof window !== 'undefined') {
              const baseRoot = window.location.pathname.replace(/\/rafi\/?$/, '') || import.meta.env.BASE_URL || '/';
              window.history.pushState(null, '', baseRoot);
            }
            setCurrentTab('lessons');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0A0D12] dark:text-slate-100">
      {/* Underlying Website Shell - hidden with 0 opacity while splash is active to prevent any pre-animation flash */}
      <div
        style={{
          visibility: showSplash && !splashClosing ? 'hidden' : 'visible',
          opacity: showSplash && !splashClosing ? 0 : 1,
          transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          flex: '1 1 auto'
        }}
      >
        {/* Global Live Notice Banner */}
        <GlobalAnnouncementBanner />

        {/* Navigation Bar */}
        <Navbar
        currentTab={currentTab}
        setCurrentTab={(t) => { if (t === 'lessons' && /^#\/dars\/\d/.test(window.location.hash)) window.location.hash = '#/dars'; setCurrentTab(t); }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalWords={0}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          {(currentTab === 'lessons' || !['durood', 'quiz', 'exam', 'book'].includes(currentTab)) && <SiratDars />}
          {currentTab === 'durood' && <DuroodView />}
          {currentTab === 'quiz' && <QuizView />}
          {currentTab === 'exam' && <ExamView />}
          {currentTab === 'book' && <BookView />}
        </div>
      </main>

      {/* Clean & Elegant Footer */}
      <Footer
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        setCurrentTab={setCurrentTab}
        onOpenReport={(ctx) => {
          setReportContext(ctx || {});
          setReportModalOpen(true);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Cloud Sync & Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onUserChange={setUser}
      />
      {/* Global Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        context={reportContext}
      />
      {/* "ভুল" (My Mistakes Notebook) Modal */}
      <MistakesNotebookModal
        isOpen={mistakesModalOpen}
        onClose={() => setMistakesModalOpen(false)}
        user={user}
        vocabulary={EMPTY_LIST}
      />
      {/* "লিডারবোর্ড" (Leaderboard) Modal */}
      <LeaderboardModal
        isOpen={leaderboardModalOpen}
        onClose={() => setLeaderboardModalOpen(false)}
        user={user}
      />
      {/* "সনদপত্র" (Certificate) Modal */}
      <CertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        user={user}
      />
      {/* Expandable Floating Action Menu (Right Corner Speed Dial) */}
      <FloatingSpeedDial
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenMistakes={() => setMistakesModalOpen(true)}
        onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
        onOpenCertificate={() => setCertificateModalOpen(true)}
        onOpenReport={(ctx) => {
          setReportContext(ctx || {});
          setReportModalOpen(true);
        }}
        onOpenBook={() => {
          setCurrentTab('book');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>

      {/* 'My Quran' Animated Arabic Calligraphy Splash Screen */}
      {showSplash && currentTab !== 'admin' && (
        <AnimatedSplashIntro
          darkMode={darkMode}
          onClosing={() => setSplashClosing(true)}
          onFinish={() => {
            setSplashClosing(false);
            setShowSplash(false);
          }}
        />
      )}
    </div>
  );
}
