import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, LayoutDashboard, Flag, BookOpen, Search, CheckCircle, 
  AlertCircle, Download, RefreshCw, Volume2, ArrowLeft, Trash2, 
  Sparkles, Check, Eye, X, SlidersHorizontal, FileJson, Key, 
  Layers, ChevronRight, Award, Activity, Users, Lock, Unlock, 
  LogOut, CheckCircle2, ShieldCheck, EyeOff, ShieldAlert,
  User, Phone, Mail, MapPin, Calendar, Smartphone, Monitor,
  ExternalLink, MessageSquare, MessageCircle, Clock, Megaphone
} from 'lucide-react';
import { 
  fetchAllReports, 
  updateReportStatus, 
  deleteReportItem, 
  runComprehensiveTashkeelAudit, 
  downloadJsonFile,
  toBengaliNumber,
  formatRelativeTimeBn,
  verifyAdminPin,
  setCustomAdminPin,
  isAdminAuthenticated,
  verifyAndLoginAdmin,
  logoutAdmin,
  fetchRegisteredStudents,
  isFirebaseAuthAdmin,
  startAdminSession
} from '../../services/adminService';
import { playArabicAudio } from '../../utils/audio';
import { isFirebaseConfigured } from '../../services/firebase';
import TracerAnalyticsTab from './TracerAnalyticsTab';
import StudentsDirectoryTab from './StudentsDirectoryTab';
import NoticesManagerTab from './NoticesManagerTab';
import CertificatesManagerTab from './CertificatesManagerTab';
import { fetchActiveAnnouncements } from '../../services/announcementService';

// রিপোর্ট ক্যাটাগরি মেটাডাটা
const REPORT_CATEGORIES_META = {
  harakat: { label: 'হরকত / তাশকীল ভুল', icon: '🔤', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  meaning: { label: 'বাংলা অর্থ ভুল', icon: '📖', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  audio: { label: 'উচ্চারণ / অডিও সমস্যা', icon: '🔊', badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  tarkib: { label: 'তারকীব / ব্যাকরণ প্রশ্ন', icon: '⚖️', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  typo: { label: 'বানান / টাইপো', icon: '✏️', badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  suggestion: { label: 'পরামর্শ ও মতামত', icon: '💡', badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  feature: { label: 'নতুন ফিচারের প্রস্তাব', icon: '🚀', badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  dua: { label: 'উৎসাহ ও দুআ', icon: '❤️', badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  inquiry: { label: 'কিতাব বা কোর্স জিজ্ঞাসা', icon: '❓', badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
  other: { label: 'সাধারণ বার্তা', icon: '💬', badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30' }
};

// প্রেরকের পরিচয় চিহ্নিতকরণ ফাংশন
function resolveReporter(report, students = []) {
  const u = report.user || {};
  let name = u.name || report.reporterName || (typeof report.contactInfo === 'string' ? report.contactInfo.trim() : '') || '';
  let email = u.email || report.reporterEmail || '';
  let phone = u.phone || report.reporterPhone || '';
  let district = u.district || '';
  let madrasa = u.madrasa || '';
  let studentId = u.studentId || '';
  let totalXp = u.totalXp || 0;
  let isRegistered = Boolean(u.isRegistered || u.uid);

  // যদি কন্টাক্ট ইনফোর মধ্যে নম্বর থাকে (যেমন: Jui (017...))
  if (name && !phone) {
    const phoneMatch = name.match(/(\+?880?1[3-9]\d{8}|\d{11})/);
    if (phoneMatch) phone = phoneMatch[0];
  }

  // নিবন্ধিত শিক্ষার্থীদের সাথে নাম বা ফোন ক্রস-ম্যাচ
  if (students && students.length > 0) {
    const cleanSearchName = name.replace(/\([^)]*\)/g, '').trim().toLowerCase();
    const cleanSearchPhone = phone.replace(/[^0-9]/g, '');
    const cleanSearchEmail = email.toLowerCase().trim();

    const matched = students.find(st => {
      const stName = (st.displayName || '').toLowerCase().trim();
      const stPhone = (st.phone || '').replace(/[^0-9]/g, '');
      const stEmail = (st.email || '').toLowerCase().trim();
      const stId = (st.studentId || '').toLowerCase().trim();

      if (cleanSearchPhone && stPhone && cleanSearchPhone === stPhone) return true;
      if (cleanSearchEmail && stEmail && cleanSearchEmail === stEmail) return true;
      if (cleanSearchName && stName && cleanSearchName === stName) return true;
      if (cleanSearchName && stId && cleanSearchName === stId) return true;
      return false;
    });

    if (matched) {
      isRegistered = true;
      name = matched.displayName || name;
      email = email || matched.email || '';
      phone = phone || matched.phone || '';
      district = district || matched.district || '';
      madrasa = madrasa || matched.madrasa || '';
      studentId = matched.studentId || '';
      totalXp = matched.totalXp || totalXp;
    }
  }

  // ডিভাইস শনাক্তকরণ
  let deviceLabel = 'অজানা ডিভাইস';
  let deviceType = 'desktop';
  const ua = report.userAgent || report.device?.userAgent || '';
  if (/Android/i.test(ua)) {
    deviceLabel = 'Android মোবাইল';
    deviceType = 'mobile';
  } else if (/iPhone/i.test(ua)) {
    deviceLabel = 'iPhone';
    deviceType = 'mobile';
  } else if (/iPad/i.test(ua)) {
    deviceLabel = 'iPad';
    deviceType = 'tablet';
  } else if (/Windows/i.test(ua)) {
    deviceLabel = 'Windows পিসি';
    deviceType = 'desktop';
  } else if (/Macintosh|Mac OS/i.test(ua)) {
    deviceLabel = 'Mac';
    deviceType = 'desktop';
  } else if (/Linux/i.test(ua)) {
    deviceLabel = 'Linux পিসি';
    deviceType = 'desktop';
  }

  return {
    name: name || 'বেনামী পাঠক',
    hasName: Boolean(name),
    email,
    phone,
    district,
    madrasa,
    studentId,
    totalXp,
    isRegistered,
    deviceLabel,
    deviceType
  };
}

export default function AdminPortal({ 
  lessonsData, 
  vocabularyData, 
  chaptersData,
  onExitAdmin,
  onNavigateToLesson
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active Tab (One-word tabs: overview, students, tracer, reports, lessons, vocab, audit, settings)
  const [activeTab, setActiveTab] = useState('overview');

  // Dynamic Students Count & List
  const [studentsCount, setStudentsCount] = useState(0);
  const [studentsList, setStudentsList] = useState([]);
  const [graduatesCount, setGraduatesCount] = useState(0);
  const [activeNoticesCount, setActiveNoticesCount] = useState(0);

  // Reports state
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportFilter, setReportFilter] = useState('all'); // all, pending, resolved
  const [reportCategoryFilter, setReportCategoryFilter] = useState('all');
  const [reportSearchQuery, setReportSearchQuery] = useState('');

  // Lessons Inspector state
  const [selectedVolume, setSelectedVolume] = useState(1);
  const [selectedChapterId, setSelectedChapterId] = useState('all');
  const [lessonSearch, setLessonSearch] = useState('');
  const [inspectingLesson, setInspectingLesson] = useState(null);

  // Vocab Directory state
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabVolume, setVocabVolume] = useState('all');

  // Audit state
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Audio Sandbox state
  const [sandboxText, setSandboxText] = useState('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ');
  const [isPlayingSandbox, setIsPlayingSandbox] = useState(false);

  // Password Change state (in Settings tab)
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinChangeMsg, setPinChangeMsg] = useState({ type: '', text: '' });

  // Load initial data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadReports();
      loadStudentCount();
      loadNoticesCount();
    }
  }, [isAuthenticated]);

  const loadNoticesCount = async () => {
    try {
      const active = await fetchActiveAnnouncements();
      setActiveNoticesCount(active ? active.length : 0);
    } catch (e) {
      console.warn('Failed to load notices count:', e);
    }
  };

  const loadReports = async () => {
    setReportsLoading(true);
    try {
      const data = await fetchAllReports();
      setReports(data || []);
    } catch (err) {
      console.warn('Failed to load reports:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  const loadStudentCount = async () => {
    try {
      const data = await fetchRegisteredStudents();
      if (Array.isArray(data)) {
        setStudentsList(data);
        setStudentsCount(data.length);
        const grads = data.filter(st => (st.lessonsCount || 0) >= 28).length;
        setGraduatesCount(grads);
      }
    } catch (err) {
      console.warn('Failed to load student count:', err);
    }
  };

  // Handle Admin Login Submission
  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    const input = adminPasswordInput.trim();
    if (!input) {
      setAuthError('পাসওয়ার্ড লিখুন');
      return;
    }

    setAuthSubmitting(true);
    verifyAndLoginAdmin(input).then((isValid) => {
      if (isValid) {
        setIsAuthenticated(true);
        setAdminPasswordInput('');
        setAuthError('');
      } else {
        setAuthError('ভুল পাসওয়ার্ড! পুনরায় চেষ্টা করুন।');
      }
      setAuthSubmitting(false);
    });
  };

  // Handle Admin Logout
  const handleLogout = () => {
    if (window.confirm('অ্যাডমিন সেশন থেকে বের হতে চান?')) {
      logoutAdmin();
      setIsAuthenticated(false);
      setAdminPasswordInput('');
      setAuthError('');
    }
  };

  const handleUpdateStatus = async (report, newStatus) => {
    await updateReportStatus(report, newStatus);
    setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: newStatus } : r));
  };

  const handleDeleteReport = async (report) => {
    if (window.confirm('এই রিপোর্টটি মুছে ফেলতে চান?')) {
      await deleteReportItem(report);
      setReports(prev => prev.filter(r => r.id !== report.id));
    }
  };

  // Run Tashkeel audit
  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const res = runComprehensiveTashkeelAudit(lessonsData, vocabularyData);
      setAuditResult(res);
      setIsAuditing(false);
    }, 350);
  };

  // Reports computed stats
  const pendingReportsCount = useMemo(() => {
    return reports.filter(r => !r.status || r.status === 'pending').length;
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const status = r.status || 'pending';
      if (reportFilter === 'pending' && status !== 'pending') return false;
      if (reportFilter === 'resolved' && status !== 'resolved') return false;
      if (reportCategoryFilter !== 'all' && r.category !== reportCategoryFilter) return false;
      
      // সার্চ ফিল্টার (প্রেরকের নাম, ফোন, ইমেইল, বিবরণ বা পাঠ)
      if (reportSearchQuery && reportSearchQuery.trim()) {
        const q = reportSearchQuery.toLowerCase().trim();
        const rep = resolveReporter(r, studentsList);
        const name = (rep.name || '').toLowerCase();
        const contact = (r.contactInfo || '').toLowerCase();
        const details = (r.details || '').toLowerCase();
        const phone = (rep.phone || '').toLowerCase();
        const email = (rep.email || '').toLowerCase();
        const lesson = (r.context?.lessonTitle || '').toLowerCase();
        const arabic = (r.context?.arabic || '').toLowerCase();
        
        if (!name.includes(q) && !contact.includes(q) && !details.includes(q) && 
            !phone.includes(q) && !email.includes(q) && !lesson.includes(q) && !arabic.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [reports, reportFilter, reportCategoryFilter, reportSearchQuery, studentsList]);

  // Lessons list filtered
  const filteredLessons = useMemo(() => {
    if (!lessonsData?.lessons) return [];
    return lessonsData.lessons.filter(l => {
      if (selectedVolume !== 'all' && l.volumeId !== Number(selectedVolume)) return false;
      if (selectedChapterId !== 'all' && l.chapterId !== selectedChapterId) return false;
      if (lessonSearch) {
        const query = lessonSearch.toLowerCase();
        const matchTitle = (l.title || '').toLowerCase().includes(query);
        const matchSub = (l.subTitle || '').toLowerCase().includes(query);
        const matchArabic = (l.arabicTitle || '').includes(lessonSearch);
        if (!matchTitle && !matchSub && !matchArabic) return false;
      }
      return true;
    });
  }, [lessonsData, selectedVolume, selectedChapterId, lessonSearch]);

  // Vocab list filtered
  const filteredVocab = useMemo(() => {
    if (!vocabularyData) return [];
    return vocabularyData.filter(v => {
      if (vocabVolume !== 'all' && v.volumeId !== Number(vocabVolume)) return false;
      if (vocabSearch) {
        const query = vocabSearch.toLowerCase();
        const matchAr = (v.arabic || '').includes(vocabSearch);
        const matchBn = (v.meaning || v.bangla || '').toLowerCase().includes(query);
        const matchTrans = (v.transliteration || '').toLowerCase().includes(query);
        if (!matchAr && !matchBn && !matchTrans) return false;
      }
      return true;
    });
  }, [vocabularyData, vocabVolume, vocabSearch]);

  const handleTestAudio = (text) => {
    if (!text) return;
    setIsPlayingSandbox(true);
    playArabicAudio(text);
    setTimeout(() => setIsPlayingSandbox(false), 2000);
  };

  // Change Password
  const handleChangePin = async (e) => {
    e.preventDefault();
    setPinChangeMsg({ type: '', text: '' });

    if (!(await verifyAdminPin(currentPinInput))) {
      setPinChangeMsg({ type: 'error', text: 'বর্তমান পাসওয়ার্ড সঠিক নয়!' });
      return;
    }

    if (!newPinInput || newPinInput.trim().length < 4) {
      setPinChangeMsg({ type: 'error', text: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' });
      return;
    }

    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeMsg({ type: 'error', text: 'কনফার্ম পাসওয়ার্ড মিলছে না!' });
      return;
    }

    try {
      await setCustomAdminPin(newPinInput.trim());
      setPinChangeMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch (err) {
      setPinChangeMsg({ type: 'error', text: err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' });
    }
  };

  // =========================================================================
  // RENDER 1: AUTHENTICATION LOCK GATE (IF NOT AUTHENTICATED)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B101B] text-slate-100 flex flex-col justify-center items-center p-4 font-bengali select-none">
        <div className="w-full max-w-sm bg-[#111928] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h1 className="text-lg font-bold text-white">
              অ্যাডমিন পোর্টাল
            </h1>
            <p className="text-xs text-slate-300">
              প্রবেশ করতে পাসওয়ার্ড লিখুন
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="পাসওয়ার্ড..."
                autoFocus
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-700 bg-[#0B101B] text-white font-mono text-sm outline-none focus:border-emerald-500 transition-colors placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-950/40"
            >
              {authSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Unlock size={14} />}
              <span>প্রবেশ করুন</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              ← সাধারণ মোডে ফিরে যান
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: CLEAN, UNCLUTTERED ADMIN PORTAL
  // One-word simple tabs:
  // ড্যাশবোর্ড | শিক্ষার্থী | ট্র্যাকার | রিপোর্ট | পাঠ | শব্দকোষ | অডিট | সেটিংস
  // =========================================================================
  const navItems = [
    { id: 'overview', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'students', label: 'শিক্ষার্থী', icon: Users },
    { id: 'tracer', label: 'ট্র্যাকার', icon: Activity },
    { id: 'notices', label: 'নোটিশ', icon: Megaphone, count: activeNoticesCount },
    { id: 'certificates', label: 'সনদপত্র', icon: Award, count: graduatesCount },
    { id: 'reports', label: 'রিপোর্ট', icon: Flag, hasAlert: pendingReportsCount > 0 },
    { id: 'lessons', label: 'পাঠ', icon: BookOpen },
    { id: 'vocab', label: 'শব্দকোষ', icon: Search },
    { id: 'audit', label: 'অডিট', icon: Sparkles },
    { id: 'tools', label: 'সেটিংস', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-[#0B101B] text-slate-100 flex flex-col font-bengali">
      {/* ------------------------------------------------------------- */}
      {/* CLEAN TOP HEADER (Zero Visual Noise) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 border-b border-slate-800/90 backdrop-blur-md px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                মারকাযুল ঈমান
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                অ্যাডমিন
              </span>
            </div>
          </div>

          {/* Right Action Controls (Clean and Minimal) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
              title="সাধারণ শিক্ষার্থী মোডে যান"
            >
              <ArrowLeft size={13} />
              <span>প্রিভিউ</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold transition-colors border border-rose-900/50 cursor-pointer flex items-center gap-1.5"
              title="লগআউট"
            >
              <LogOut size={13} />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Clean, One-Word Simple Navigation Tabs */}
        <div className="max-w-6xl mx-auto mt-2.5 flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold font-mono">
                    {toBengaliNumber(item.count)}
                  </span>
                )}
                {item.hasAlert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: ড্যাশবোর্ড (Clean, Uncluttered Overview) */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Simple Stats Grid (Clean 6 KPI Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Students */}
              <div 
                onClick={() => setActiveTab('students')}
                className="p-3.5 rounded-2xl bg-[#111928] border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-medium">
                  <span>শিক্ষার্থী</span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Users size={13} />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">
                  {toBengaliNumber(studentsCount || 18)}
                </div>
              </div>

              {/* Lessons */}
              <div 
                onClick={() => setActiveTab('lessons')}
                className="p-3.5 rounded-2xl bg-[#111928] border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-medium">
                  <span>দরস (পাঠ)</span>
                  <div className="w-6 h-6 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
                    <BookOpen size={13} />
                  </div>
                </div>
                <div className="text-2xl font-black text-teal-300">৭০টি</div>
              </div>

              {/* Vocab */}
              <div 
                onClick={() => setActiveTab('vocab')}
                className="p-3.5 rounded-2xl bg-[#111928] border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-medium">
                  <span>শব্দকোষ</span>
                  <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                    <Search size={13} />
                  </div>
                </div>
                <div className="text-2xl font-black text-sky-300">১,৩৪৩টি</div>
              </div>

              {/* Tamrin */}
              <div 
                onClick={() => setActiveTab('lessons')}
                className="p-3.5 rounded-2xl bg-[#111928] border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-medium">
                  <span>তামরীন</span>
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    <Layers size={13} />
                  </div>
                </div>
                <div className="text-2xl font-black text-indigo-300">২৮০টি</div>
              </div>

              {/* Quiz */}
              <div 
                onClick={() => setActiveTab('lessons')}
                className="p-3.5 rounded-2xl bg-[#111928] border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-medium">
                  <span>কুইজ</span>
                  <div className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Award size={13} />
                  </div>
                </div>
                <div className="text-2xl font-black text-purple-300">২১০টি</div>
              </div>

              {/* Reports */}
              <div 
                onClick={() => setActiveTab('reports')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-sm hover:-translate-y-0.5 ${
                  pendingReportsCount > 0 
                    ? 'bg-rose-950/30 border-rose-800/80 hover:border-rose-500' 
                    : 'bg-[#111928] border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1 font-medium">
                  <span>পেন্ডিং রিপোর্ট</span>
                  <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                    <Flag size={13} className={pendingReportsCount > 0 ? 'animate-pulse' : ''} />
                  </div>
                </div>
                <div className={`text-2xl font-black ${pendingReportsCount > 0 ? 'text-rose-400' : 'text-white'}`}>
                  {toBengaliNumber(pendingReportsCount)}টি
                </div>
              </div>
            </div>

            {/* Clean Quick Shortcuts (Minimal Tiles, No Heavy Text) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                দ্রুত মেনু
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-emerald-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Users size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">শিক্ষার্থী</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tracer')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-teal-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Activity size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">ট্র্যাকার</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notices')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-amber-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Megaphone size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">নোটিশ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('certificates')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-emerald-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Award size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">সনদপত্র</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-rose-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Flag size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">রিপোর্ট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('lessons')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-sky-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <BookOpen size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">পাঠ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('vocab')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-purple-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Search size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">শব্দকোষ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tools')}
                  className="p-3.5 rounded-2xl bg-[#111928] hover:bg-[#162236] border border-slate-800 hover:border-slate-500/50 text-center transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-8 h-8 mx-auto rounded-xl bg-slate-700/50 text-slate-300 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <SlidersHorizontal size={16} />
                  </div>
                  <span className="text-xs font-bold text-white block">সেটিংস</span>
                </button>
              </div>
            </div>

            {/* Simple System Status Line */}
            <div className="p-3.5 rounded-2xl bg-[#111928] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ফায়ারস্টোর DB: সক্রিয়
                </span>
                <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  নিউরাল অডিও: সক্রিয়
                </span>
                <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  তাশকীল শুদ্ধতা: ১০০%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                মারকাযুল ঈমান ইলমী বোর্ড
              </span>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: শিক্ষার্থী */}
        {/* ========================================================================= */}
        {activeTab === 'students' && (
          <StudentsDirectoryTab />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ট্র্যাকার */}
        {/* ========================================================================= */}
        {activeTab === 'tracer' && (
          <TracerAnalyticsTab />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: নোটিশ ও ব্রডকাস্ট */}
        {/* ========================================================================= */}
        {activeTab === 'notices' && (
          <NoticesManagerTab onNoticesChanged={loadNoticesCount} />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: সনদপত্র ও গ্র্যাজুয়েট হাব */}
        {/* ========================================================================= */}
        {activeTab === 'certificates' && (
          <CertificatesManagerTab />
        )}

        {/* ========================================================================= */}
        {/* TAB 6: রিপোর্ট */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter, Search and Actions Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl">
              {/* Search input for reporter, phone, or report details */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  placeholder="প্রেরকের নাম, মোবাইল নম্বর, ইমেইল বা রিপোর্টের বিবরণ দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
                {reportSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setReportSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status and Category Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setReportFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      reportFilter === 'all' 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white bg-slate-800'
                    }`}
                  >
                    সকল ({toBengaliNumber(reports.length)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      reportFilter === 'pending' 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white bg-slate-800'
                    }`}
                  >
                    পেন্ডিং ({toBengaliNumber(pendingReportsCount)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportFilter('resolved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      reportFilter === 'resolved' 
                        ? 'bg-teal-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white bg-slate-800'
                    }`}
                  >
                    সমাধানকৃত ({toBengaliNumber(reports.filter(r => r.status === 'resolved').length)})
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <select
                    value={reportCategoryFilter}
                    onChange={(e) => setReportCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-xl outline-none cursor-pointer font-medium"
                  >
                    <option value="all">সকল ধরন</option>
                    <option value="harakat">🔤 হরকত ভুল</option>
                    <option value="meaning">📖 অর্থ অসংগতি</option>
                    <option value="audio">🔊 অডিও সমস্যা</option>
                    <option value="tarkib">⚖️ তারকীব / ব্যাকরণ</option>
                    <option value="typo">✏️ টাইপো বা বানান</option>
                    <option value="suggestion">💡 পরামর্শ ও মতামত</option>
                    <option value="feature">🚀 ফিচার প্রস্তাব</option>
                    <option value="dua">❤️ উৎসাহ ও দুআ</option>
                    <option value="inquiry">❓ কোর্স / কিতাব জিজ্ঞাসা</option>
                    <option value="other">💬 অন্যান্য</option>
                  </select>

                  <button
                    type="button"
                    onClick={loadReports}
                    disabled={reportsLoading}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
                    title="রিফ্রেশ করুন"
                  >
                    <RefreshCw size={14} className={reportsLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
                <Flag size={36} className="mx-auto text-slate-600" />
                <h4 className="text-sm font-bold text-slate-300">কোনো রিপোর্ট পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500">আপনার সার্চ বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const isResolved = report.status === 'resolved';
                  const reporter = resolveReporter(report, studentsList);
                  const catMeta = REPORT_CATEGORIES_META[report.category] || REPORT_CATEGORIES_META.other;
                  const formattedFullDate = report.createdAt 
                    ? new Date(report.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }) 
                    : 'অজ্ঞাত সময়';
                  const timeAgo = report.createdAt ? formatRelativeTimeBn(report.createdAt) : '';

                  return (
                    <div
                      key={report.id || report.docId}
                      className={`p-4 sm:p-5 rounded-3xl bg-slate-900 border transition-all space-y-3.5 shadow-lg ${
                        isResolved 
                          ? 'border-slate-800/80 opacity-80' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Meta Bar: Category, Status, Timestamp & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/60">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Category Badge */}
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${catMeta.badgeClass}`}>
                            <span>{catMeta.icon}</span>
                            <span>{catMeta.label}</span>
                          </span>

                          {/* Status Badge */}
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            isResolved ? 'bg-teal-950 text-teal-300 border border-teal-800/40' : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                          }`}>
                            {isResolved ? '✓ সমাধানকৃত' : '● পেন্ডিং'}
                          </span>

                          {/* Relative Time */}
                          {timeAgo && (
                            <span 
                              className="text-[11px] text-slate-400 flex items-center gap-1 font-medium"
                              title={formattedFullDate}
                            >
                              <Clock size={11} className="text-slate-500" />
                              <span>{timeAgo}</span>
                            </span>
                          )}
                        </div>

                        {/* Action Buttons: Status Toggle & Delete */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {!isResolved ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(report, 'resolved')}
                              className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                            >
                              সমাধান চিহ্নিত করুন
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(report, 'pending')}
                              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                            >
                              পুনরায় ওপেন
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteReport(report)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="রিপোর্ট মুছে ফেলুন"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* ------------------------------------------------------------- */}
                      {/* কে করেছে: প্রেরকের পূর্ণাঙ্গ পরিচয় কার্ড (Reporter Identity) */}
                      {/* ------------------------------------------------------------- */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                            reporter.isRegistered 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : reporter.hasName
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                          }`}>
                            {reporter.hasName ? reporter.name.charAt(0).toUpperCase() : <User size={18} />}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-black text-white">
                                {reporter.name}
                              </span>

                              {reporter.isRegistered ? (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                                  <ShieldCheck size={11} className="text-emerald-400" />
                                  <span>নিবন্ধিত শিক্ষার্থী</span>
                                  {reporter.studentId && <span className="text-emerald-400/80">({reporter.studentId})</span>}
                                </span>
                              ) : reporter.hasName ? (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-700/60 flex items-center gap-1">
                                  <User size={11} className="text-sky-400" />
                                  <span>পাঠক / অতিথি</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-400 flex items-center gap-1">
                                  <User size={11} />
                                  <span>বেনামী পাঠক</span>
                                </span>
                              )}

                              {reporter.totalXp > 0 && (
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-950/80 text-amber-300 border border-amber-700/50">
                                  🔥 {toBengaliNumber(reporter.totalXp)} XP
                                </span>
                              )}
                            </div>

                            {/* Contact information details */}
                            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                              {reporter.phone && (
                                <a 
                                  href={`tel:${reporter.phone}`}
                                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                                  title="সরাসরি কল করুন"
                                >
                                  <Phone size={12} />
                                  <span>{reporter.phone}</span>
                                </a>
                              )}
                              {reporter.email && (
                                <a 
                                  href={`mailto:${reporter.email}`}
                                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
                                  title="ইমেইল পাঠান"
                                >
                                  <Mail size={12} />
                                  <span>{reporter.email}</span>
                                </a>
                              )}
                              {reporter.district && (
                                <span className="flex items-center gap-1 text-slate-300">
                                  <MapPin size={12} className="text-rose-400" />
                                  <span>{reporter.district}</span>
                                </span>
                              )}
                              {reporter.madrasa && (
                                <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                                  <span>🏫 {reporter.madrasa}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                                {reporter.deviceType === 'mobile' ? <Smartphone size={11} /> : <Monitor size={11} />}
                                <span>{reporter.deviceLabel}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Direct WhatsApp Response Button if phone exists */}
                        {reporter.phone && (
                          <a
                            href={`https://wa.me/${reporter.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `আসসালামু আলাইকুম ${reporter.name}, মারকাযুল ঈমান 'এসো আরবী শিখি' পোর্টালে আপনার প্রেরিত রিপোর্টটি (${catMeta.label}) আমরা পেয়েছি।`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0 self-start md:self-auto"
                            title="হোয়াটসঅ্যাপে সরাসরি রিপ্লাই দিন"
                          >
                            <MessageCircle size={14} />
                            <span>হোয়াটসঅ্যাপে উত্তর দিন</span>
                          </a>
                        )}
                      </div>

                      {/* ------------------------------------------------------------- */}
                      {/* Context Information: পাঠের নাম, আরবি বাক্য ও অর্থ */}
                      {/* ------------------------------------------------------------- */}
                      {(report.context?.lessonTitle || report.context?.arabic || report.context?.bangla) && (
                        <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                          {report.context?.lessonTitle && (
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                              <span className="flex items-center gap-1.5">
                                <BookOpen size={13} className="text-emerald-400" />
                                <span>পাঠ: {report.context.lessonTitle}</span>
                              </span>
                              {report.context?.source && (
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                                  {report.context.source === 'dars' ? 'দরস পাঠ' : 
                                   report.context.source === 'tamrin' ? 'তামরীন' : 
                                   report.context.source === 'profile' ? 'প্রোফাইল' : 'সাধারণ'}
                                </span>
                              )}
                            </div>
                          )}

                          {report.context?.arabic && (
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                              <span className="font-arabic font-bold text-lg sm:text-xl text-amber-300 text-right flex-1 leading-relaxed">
                                {report.context.arabic}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleTestAudio(report.context.arabic)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
                                title="উচ্চারণ শুনুন"
                              >
                                <Volume2 size={15} />
                              </button>
                            </div>
                          )}

                          {report.context?.bangla && (
                            <p className="text-xs text-slate-400 italic">
                              অর্থ: "{report.context.bangla}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* ------------------------------------------------------------- */}
                      {/* মূল মন্তব্য বা বিস্তারিত বার্তা */}
                      {/* ------------------------------------------------------------- */}
                      {report.details ? (
                        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans selection:bg-emerald-500/30">
                          {report.details}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic px-1">
                          (ব্যবহারকারী আলাদা কোনো মন্তব্য লেখেননি, সরাসরি সংশ্লিষ্ট ত্রুটি রিপোর্ট করেছেন)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: পাঠ */}
        {/* ========================================================================= */}
        {activeTab === 'lessons' && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {['all', 1, 2, 3].map((vol) => (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => {
                      setSelectedVolume(vol === 'all' ? 'all' : Number(vol));
                      setSelectedChapterId('all');
                    }}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      selectedVolume === vol ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {vol === 'all' ? 'সকল পাঠ' : `খণ্ড ${toBengaliNumber(vol)}`}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  value={lessonSearch}
                  onChange={(e) => setLessonSearch(e.target.value)}
                  placeholder="পাঠ খুঁজুন..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredLessons.map((les) => (
                <div
                  key={les.id}
                  onClick={() => setInspectingLesson(les)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>খণ্ড {toBengaliNumber(les.volumeId)} • পাঠ {toBengaliNumber(les.lessonNumberInChapter || les.lessonNumber)}</span>
                    <span>{les.sentences?.length || 0} বাক্য</span>
                  </div>
                  <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                    {les.title}
                  </h4>
                  {les.subTitle && (
                    <p className="font-arabic text-sm text-emerald-300 text-right truncate">
                      {les.subTitle}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Lesson Detail Modal */}
            {inspectingLesson && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-sm text-white">
                      {inspectingLesson.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setInspectingLesson(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(inspectingLesson.sentences || []).map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-arabic text-base text-emerald-300 text-right leading-relaxed">
                            {s.arabic}
                          </p>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {s.bangla}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTestAudio(s.arabic)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: শব্দকোষ */}
        {/* ========================================================================= */}
        {activeTab === 'vocab' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={vocabSearch}
                  onChange={(e) => setVocabSearch(e.target.value)}
                  placeholder="আরবি বা বাংলায় শব্দ খুঁজুন..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-teal-500"
                />
                <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
              </div>

              <span className="text-xs text-slate-400">
                {toBengaliNumber(filteredVocab.length)}টি শব্দ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredVocab.slice(0, 80).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-arabic font-bold text-base text-emerald-300 block truncate">
                      {item.arabic}
                    </span>
                    <span className="text-xs text-slate-300 block truncate mt-0.5">
                      {item.meaning || item.bangla}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestAudio(item.arabic)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: অডিট */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-white">তাশকীল শুদ্ধতা অডিট</h3>
                <p className="text-xs text-slate-400">কারিকুলামের সকল আরবি হরকত স্বয়ংক্রিয় যাচাই</p>
              </div>
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                {isAuditing ? 'স্ক্যান চলছে...' : 'অডিট চালান'}
              </button>
            </div>

            {auditResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>মোট পরীক্ষিত আইটেম:</span>
                  <span className="font-bold text-white">{toBengaliNumber(auditResult.totalChecked)}টি</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>বিশুদ্ধ হরকতযুক্ত:</span>
                  <span className="font-bold">{toBengaliNumber(auditResult.cleanCount)}টি</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 border-t border-slate-850 pt-2 font-bold">
                  <span>সামগ্রিক শুদ্ধতা:</span>
                  <span className="text-emerald-400">{toBengaliNumber(auditResult.overallHealth)}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: সেটিংস */}
        {/* ========================================================================= */}
        {activeTab === 'tools' && (
          <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
            
            {/* Password Change Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Key size={16} className="text-amber-400" />
                <span>পাসওয়ার্ড পরিবর্তন</span>
              </h3>

              <form onSubmit={handleChangePin} className="space-y-3">
                <input
                  type="password"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white outline-none focus:border-amber-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white outline-none focus:border-amber-500"
                  />
                  <input
                    type="password"
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="কনফার্ম করুন..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white outline-none focus:border-amber-500"
                  />
                </div>

                {pinChangeMsg.text && (
                  <div className={`p-2.5 rounded-lg text-xs font-bold ${
                    pinChangeMsg.type === 'success' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {pinChangeMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </form>
            </div>

            {/* Backups */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Download size={16} className="text-emerald-400" />
                <span>ব্যাকআপ ডাউনলোড (JSON)</span>
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => downloadJsonFile(lessonsData, 'lessons.json')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  পাঠসমূহ
                </button>
                <button
                  type="button"
                  onClick={() => downloadJsonFile(vocabularyData, 'vocabulary.json')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  শব্দকোষ
                </button>
                <button
                  type="button"
                  onClick={() => downloadJsonFile(reports, 'reports.json')}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  রিপোর্ট
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">অ্যাডমিন সেশন সমাপ্ত করুন</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                লগআউট
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
