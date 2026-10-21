// =========================================================================
// ULS Arabic - LiveStudentScreenModal (Live Co-Browsing & Screen Mirroring)
// মারকাযুল ঈমান ইলমী বোর্ড - ULS Arabic Live Classroom Vision
// Includes full live screen mirror + Comprehensive Student Dossier
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Smartphone, Monitor, Volume2, Activity, Sparkles, 
  Clock, MapPin, Eye, MousePointer, Flame, CheckCircle, 
  AlertCircle, ShieldCheck, RefreshCw, Send, Heart, Award, 
  ExternalLink, Wifi, Battery, BookOpen, Layers, Compass,
  User, Phone, Mail, Navigation, MessageCircle, Gift, Check
} from 'lucide-react';
import { 
  subscribeToStudentLiveScreen, 
  sendRemoteAdminNudge 
} from '../../services/liveScreenService';
import { playArabicAudio } from '../../utils/audio';
import { 
  formatDurationBn, 
  toBengaliNumber, 
  fetchRegisteredStudents,
  awardBonusXp 
} from '../../services/adminService';

export default function LiveScreenViewerModal({ session, onClose }) {
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [activeSidebarTab, setActiveSidebarTab] = useState('profile'); // 'profile' | 'timeline' | 'nudge'
  const [liveStream, setLiveStream] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [actionHistory, setActionHistory] = useState([]);
  const [clickRipple, setClickRipple] = useState(null);
  const [customNudgeMsg, setCustomNudgeMsg] = useState('');
  const [nudgeSentAlert, setNudgeSentAlert] = useState(false);
  const [isAudioEchoPlaying, setIsAudioEchoPlaying] = useState(false);
  const [timeAwaySeconds, setTimeAwaySeconds] = useState(0);
  const [bonusAwardMsg, setBonusAwardMsg] = useState('');

  const awayTimerRef = useRef(null);

  // 1. Load full registered student details for deep profile dossier
  useEffect(() => {
    let isMounted = true;
    async function loadFullStudent() {
      if (!session?.user?.uid && !session?.user?.email) return;
      try {
        const list = await fetchRegisteredStudents();
        if (!isMounted || !Array.isArray(list)) return;
        const found = list.find(s => 
          (session.user?.uid && s.uid === session.user.uid) || 
          (session.user?.email && s.email && s.email.toLowerCase() === session.user.email.toLowerCase())
        );
        if (found) {
          setStudentDetails(found);
        }
      } catch (e) {
        console.warn('Could not load student profile for live modal:', e);
      }
    }
    loadFullStudent();
    return () => { isMounted = false; };
  }, [session?.user?.uid, session?.user?.email]);

  // 2. Subscribe to live screen stream
  useEffect(() => {
    if (!session?.sessionId) return;

    setLiveStream({
      sessionId: session.sessionId,
      isLive: session.isLive !== false,
      user: session.user,
      device: session.device,
      location: session.location,
      currentTab: 'lessons',
      scrollPercentage: 0,
      cursor: { x: 50, y: 50, lastAction: 'idle', targetLabel: '' },
      lastActionText: 'সেশন সংযুক্ত হয়েছে...',
      updatedAt: Date.now()
    });

    const unsub = subscribeToStudentLiveScreen(session.sessionId, (data) => {
      if (!data) return;
      setLiveStream(prev => ({
        ...prev,
        ...data
      }));

      // Visual pointer ripple
      if (data.cursor?.lastAction === 'click') {
        setClickRipple({
          x: data.cursor.x,
          y: data.cursor.y,
          key: Date.now()
        });
      }

      // Action ticker
      if (data.lastActionText) {
        setActionHistory(prev => {
          if (prev.length > 0 && prev[0].text === data.lastActionText) return prev;
          return [
            { text: data.lastActionText, time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
            ...prev.slice(0, 19)
          ];
        });
      }
    });

    return () => unsub();
  }, [session?.sessionId]);

  // 3. Track Away timer
  useEffect(() => {
    if (liveStream?.isAway) {
      const awayStart = liveStream.awaySince || Date.now();
      awayTimerRef.current = setInterval(() => {
        const sec = Math.max(1, Math.round((Date.now() - awayStart) / 1000));
        setTimeAwaySeconds(sec);
      }, 1000);
    } else {
      setTimeAwaySeconds(0);
      if (awayTimerRef.current) clearInterval(awayTimerRef.current);
    }

    return () => {
      if (awayTimerRef.current) clearInterval(awayTimerRef.current);
    };
  }, [liveStream?.isAway, liveStream?.awaySince]);

  // Handle echo audio
  const handlePlayStudentAudio = () => {
    if (!liveStream?.audioPlaying?.text) return;
    setIsAudioEchoPlaying(true);
    playArabicAudio(liveStream.audioPlaying.text);
    setTimeout(() => setIsAudioEchoPlaying(false), 2500);
  };

  // Send Remote Nudge
  const handleSendNudge = async (type = 'dua', customText = null) => {
    let msg = customText;
    if (!msg) {
      if (type === 'dua') msg = 'মারকাযুল ঈমান ইলমী বোর্ড: মাশাআল্লাহ! চমৎকার হয়েছে, এভাবে অধ্যবসায় চালিয়ে যান 🤲';
      else if (type === 'applause') msg = 'অ্যাডমিন থেকে করতালি: সাবাশ! আপনার মনোযোগ প্রশংসনীয় 👏';
      else if (type === 'star') msg = 'ইলমী বোর্ড থেকে স্টার: আজকের পাঠে আপনি অসাধারণ উন্নতি করছেন ⭐';
    }

    const success = await sendRemoteAdminNudge(session.sessionId, { type, message: msg });
    if (success) {
      setNudgeSentAlert(true);
      setCustomNudgeMsg('');
      setTimeout(() => setNudgeSentAlert(false), 3000);
    }
  };

  // Quick Bonus XP Award
  const handleQuickBonus = async (amount) => {
    const uid = studentDetails?.uid || session?.user?.uid;
    if (!uid) return;
    const ok = await awardBonusXp(uid, amount, 'লাইভ স্ক্রিন পর্যবেক্ষণ থেকে সরাসরি অ্যাডমিন পুরস্কার');
    if (ok) {
      setBonusAwardMsg(`+${amount} XP প্রদান সম্পন্ন!`);
      setTimeout(() => setBonusAwardMsg(''), 3000);
    }
  };

  const cleanPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return '';
    let p = rawPhone.replace(/[^0-9]/g, '');
    if (p.startsWith('01')) p = '88' + p;
    return p;
  };

  const isStudentAway = Boolean(liveStream?.isAway);
  const diffFromLastPing = liveStream?.updatedAt ? Math.round((Date.now() - liveStream.updatedAt) / 1000) : 0;
  const isOnline = liveStream?.isLive !== false && diffFromLastPing < 120;

  const phone = studentDetails?.phone || session?.user?.phone || '';
  const madrasa = studentDetails?.madrasa || session?.user?.madrasa || 'দেওয়া নেই';
  const district = studentDetails?.district || session?.user?.district || session?.location?.city || session?.location?.district || 'ঢাকা';
  const totalXp = studentDetails?.totalXp ?? (session?.user?.totalXp || 0);
  const streak = studentDetails?.streakDays ?? (session?.user?.streakDays || 1);
  const lessonsCount = studentDetails?.lessonsCount ?? 0;
  const tamrinsCount = studentDetails?.tamrinsCount ?? 0;
  const studentId = studentDetails?.studentId || (session?.user?.uid ? `STU-${session.user.uid.slice(-4).toUpperCase()}` : `GUEST-${(session?.visitorId || '').slice(-4)}`);

  const getTabLabel = (tab) => {
    if (tab === 'durood') return 'দুরূদ';
    if (tab === 'quiz') return 'কুইজ';
    if (tab === 'exam') return 'পরীক্ষা';
    if (tab === 'book') return 'বই';
    return 'দারস ও পাঠসমূহ';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in font-bengali">
      <div className="w-full max-w-6xl bg-slate-900 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col h-[94vh] max-h-[960px] overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER HUD (লাইভ স্ট্যাটাস, শিক্ষার্থী মেটাডাটা ও কন্ট্রোল) */}
        {/* ========================================================================= */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Student Identity Banner */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-950/50">
                {studentDetails?.photoURL || liveStream?.user?.photoURL ? (
                  <img src={studentDetails?.photoURL || liveStream?.user?.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  (studentDetails?.displayName || liveStream?.user?.name || 'শ')[0]
                )}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                isStudentAway ? 'bg-amber-500 animate-pulse' : isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-white">
                  {studentDetails?.displayName || liveStream?.user?.name || `অতিথি #${(session?.visitorId || '').slice(-4)}`}
                </h3>

                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] font-bold border border-slate-700">
                  {studentId}
                </span>

                {isStudentAway ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/40 animate-pulse">
                    ⚠️ অ্যাপের বাইরে আছেন ({toBengaliNumber(timeAwaySeconds)} সে.)
                  </span>
                ) : isOnline ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    লাইভ সক্রিয়
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                    অফলাইন
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                {phone && (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Phone size={11} /> {phone}
                  </span>
                )}
                {madrasa && madrasa !== 'দেওয়া নেই' && <span>• {madrasa}</span>}
                <span>• {district}</span>
              </div>
            </div>
          </div>

          {/* Right: Device View Switcher & Close Button */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center text-xs">
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceMode === 'mobile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="মোবাইল ফ্রেম"
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">মোবাইল</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceMode === 'desktop' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="ডেস্কটপ ফ্রেম"
              >
                <Monitor size={14} />
                <span className="hidden sm:inline">ডেস্কটপ</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN CENTER: VIRTUAL DEVICE CANVAS (যেখানে শিক্ষার্থীর স্ক্রিন দেখা যাবে) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-hidden bg-[#070B14] flex flex-col lg:flex-row relative">
          
          {/* The Visual Screen Mirror Display */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div 
              className={`transition-all duration-300 relative shadow-2xl border-4 ${
                deviceMode === 'mobile'
                  ? 'w-[360px] sm:w-[380px] h-[640px] sm:h-[680px] rounded-[42px] border-slate-700 bg-slate-950 flex flex-col overflow-hidden ring-8 ring-slate-900/60'
                  : 'w-full max-w-3xl h-[600px] rounded-3xl border-slate-700 bg-slate-950 flex flex-col overflow-hidden ring-4 ring-slate-900/40'
              }`}
            >
              {/* Virtual Device Notch & Status Bar (Mobile Only) */}
              {deviceMode === 'mobile' && (
                <div className="h-6 bg-slate-950 text-slate-400 px-6 flex items-center justify-between text-[11px] font-mono select-none shrink-0 z-20 border-b border-slate-900">
                  <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
                  <div className="flex items-center gap-1.5">
                    <Wifi size={11} className="text-emerald-400" />
                    <Battery size={11} className="text-emerald-400" />
                  </div>
                </div>
              )}

              {/* Simulated Browser Address Bar */}
              <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] flex items-center justify-between text-slate-400 shrink-0 select-none">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono truncate">
                  <ShieldCheck size={12} />
                  <span>arabic.markazuliman.com</span>
                  <span className="text-slate-500">/{liveStream?.currentTab || 'lessons'}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                  {toBengaliNumber(liveStream?.scrollPercentage || 0)}% স্ক্রল
                </span>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* VIRTUAL SCREEN CONTENT (শিক্ষার্থীর চোখের দৃশ্য) */}
              {/* ------------------------------------------------------------- */}
              <div className="flex-1 bg-[#0A0D14] overflow-y-auto relative p-4 text-slate-100 flex flex-col select-none">
                
                {/* Away Warning Overlay if student left tab */}
                {isStudentAway && (
                  <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-300 flex items-center justify-center mb-3 animate-pulse">
                      <AlertCircle size={32} />
                    </div>
                    <h4 className="text-base font-black text-white">শিক্ষার্থী অ্যাপের বাইরে গেছেন</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs">
                      শিক্ষার্থী অন্য কোনো ব্রাউজার ট্যাব বা অন্য কোনো অ্যাপে গেছেন।
                    </p>
                    <div className="mt-4 px-4 py-1.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                      অনুপস্থিতির সময়কাল: {toBengaliNumber(timeAwaySeconds)} সেকেন্ড
                    </div>
                    <span className="text-[11px] text-slate-400 mt-3">
                      শিক্ষার্থী আবার মারকাযুল ঈমান অ্যাপে প্রবেশ করা মাত্রই স্ক্রিন স্বয়ংক্রিয়ভাবে সচল হবে।
                    </span>
                  </div>
                )}

                {/* Live Laser Touch Cursor (যেখানে শিক্ষার্থী ক্লিক করছে) */}
                {liveStream?.cursor && (
                  <div 
                    className="absolute pointer-events-none z-40 transition-all duration-200 ease-out flex items-center gap-1"
                    style={{
                      left: `${liveStream.cursor.x}%`,
                      top: `${liveStream.cursor.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/40 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      {/* Ripple ping on click */}
                      {clickRipple && (
                        <div 
                          key={clickRipple.key} 
                          className="absolute -inset-3 rounded-full border-2 border-emerald-400 animate-ping opacity-75"
                        />
                      )}
                    </div>
                    {liveStream.cursor.targetLabel && (
                      <span className="bg-slate-950/90 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/40 whitespace-nowrap shadow-md">
                        {liveStream.cursor.targetLabel}
                      </span>
                    )}
                  </div>
                )}

                {/* Screen Content Render based on Current Tab */}
                <div className="space-y-3.5">
                  {/* Top Bar of Student Screen */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        م
                      </div>
                      <span className="text-xs font-bold text-white">মারকাযুল ঈমান</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      {getTabLabel(liveStream?.currentTab)}
                    </span>
                  </div>

                  {/* Active Lesson / Content Simulation */}
                  {(!liveStream?.currentTab || liveStream?.currentTab === 'lessons') && (
                    <div className="space-y-3">
                      {/* Current Lesson Hero Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
                        <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1">
                          <span>সীরাত • সংক্ষিপ্ত</span>
                          <span className="font-arabic text-sm">الدَّرْسُ الأَوَّلُ</span>
                        </div>
                        <h4 className="text-sm font-black text-white">
                          দারস ১: সীরাত কেন পড়ব
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 font-arabic text-right text-base text-emerald-300">
                          السِّيرَةُ النَّبَوِيَّةُ
                        </p>
                      </div>

                      {/* Sub-sections tabs inside lesson */}
                      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">ভিডিও</div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">পাঠ</div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">লেখা</div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">কুইজ</div>
                      </div>

                      {/* Vocabulary list preview */}
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                          <span className="font-arabic text-emerald-400 text-sm font-bold">كِتَابٌ</span>
                          <span className="text-xs text-slate-300">একটি কিতাব / বই</span>
                          <Volume2 size={13} className="text-slate-500" />
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                          <span className="font-arabic text-emerald-400 text-sm font-bold">قَلَمٌ</span>
                          <span className="text-xs text-slate-300">একটি কলম</span>
                          <Volume2 size={13} className="text-slate-500" />
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                          <span className="font-arabic text-emerald-400 text-sm font-bold">مَسْجِدٌ</span>
                          <span className="text-xs text-slate-300">একটি মসজিদ</span>
                          <Volume2 size={13} className="text-slate-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flashcards View */}
                  {liveStream?.currentTab === 'flashcards' && (
                    <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-4 shadow-xl">
                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">ফ্ল্যাশকার্ড ডেক</span>
                      <div className="py-8">
                        <span className="font-arabic text-3xl font-extrabold text-white block">
                          بَيْتٌ جَمِيلٌ
                        </span>
                        <span className="text-xs text-slate-400 mt-2 block">
                          (একটি সুন্দর ঘর)
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="px-3 py-1 rounded-xl bg-slate-800 text-[11px] text-slate-300">কার্ড ৩/২০</span>
                        <span className="px-3 py-1 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px]">স্মরণে আছে</span>
                      </div>
                    </div>
                  )}

                  {/* Grill Me Exam View */}
                  {liveStream?.currentTab === 'exam' && (
                    <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-3">
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                        <Flame size={14} /> গ্রিল মি মৌখিক পরীক্ষা চলছে
                      </span>
                      <p className="text-xs text-slate-300 font-medium">প্রশ্ন: "هَذَا وَلَدٌ مُؤَدَّبٌ" বাক্যটির সঠিক বাংলা অর্থ কোনটি?</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 rounded-xl bg-slate-800 text-slate-300">১. এটি একটি ভালো ছেলে</div>
                        <div className="p-2 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold">২. এই ছেলেটি ভদ্র (নির্বাচিত)</div>
                      </div>
                    </div>
                  )}

                  {/* Book Viewer */}
                  {liveStream?.currentTab === 'book' && (
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                      <BookOpen size={32} className="mx-auto text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">সীরাত (মূল কিতাব)</h4>
                      <span className="text-xs text-slate-400 block">পৃষ্ঠা নম্বর: ১২ / ৪৪৬</span>
                    </div>
                  )}
                </div>

                {/* Real-time Audio Playing Notification inside Screen */}
                {liveStream?.audioPlaying && (Date.now() - (liveStream.audioPlaying.playedAt || 0) < 8000) && (
                  <div className="mt-auto pt-3">
                    <div className="p-2.5 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-between text-xs text-teal-300 animate-pulse">
                      <div className="flex items-center gap-2 truncate">
                        <Volume2 size={14} className="text-teal-400 shrink-0" />
                        <span className="truncate font-arabic text-sm">{liveStream.audioPlaying.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePlayStudentAudio}
                        disabled={isAudioEchoPlaying}
                        className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold shrink-0 cursor-pointer transition-all"
                      >
                        {isAudioEchoPlaying ? 'বাজছে...' : 'অডিও শুনুন'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. RIGHT SIDEBAR: FULL STUDENT DOSSIER & ACTIONS */}
          {/* ========================================================================= */}
          <div className="w-full lg:w-96 bg-slate-950/85 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
            
            {/* Sidebar Navigation Tabs */}
            <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-1">
              {[
                { id: 'profile', label: 'শিক্ষার্থীর তথ্য', icon: User },
                { id: 'timeline', label: 'অ্যাকশন লগ', icon: Activity },
                { id: 'nudge', label: 'উৎসাহ ও দুআ', icon: Sparkles }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeSidebarTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSidebarTab(tab.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab 1: FULL STUDENT DETAILED DOSSIER */}
            {activeSidebarTab === 'profile' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Academic Highlights Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">মোট অর্জিত পয়েন্ট</span>
                    <span className="text-lg font-black text-amber-400 flex items-center gap-1 mt-0.5">
                      <Flame size={15} /> {toBengaliNumber(totalXp)} XP
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">স্ট্রিক দিন</span>
                    <span className="text-lg font-black text-rose-400 flex items-center gap-1 mt-0.5">
                      🔥 {toBengaliNumber(streak)} দিন
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">সম্পন্ন পাঠ</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                      {toBengaliNumber(lessonsCount)}/৭০টি দারস
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">তামরীন অনুশীলন</span>
                    <span className="text-sm font-bold text-teal-400 mt-0.5 block">
                      {toBengaliNumber(tamrinsCount)}টি সম্পন্ন
                    </span>
                  </div>
                </div>

                {/* Personal & Contact Dossier */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
                  <span className="font-extrabold text-white text-xs block pb-1 border-b border-slate-800">
                    যোগাযোগ ও প্রাতিষ্ঠানিক পরিচয়
                  </span>

                  {phone ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">মোবাইল:</span>
                      <div className="flex items-center gap-2">
                        <a 
                          href={`tel:${phone}`}
                          className="font-mono font-bold text-emerald-400 hover:underline"
                        >
                          {phone}
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhoneForWhatsApp(phone)}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${studentDetails?.displayName || 'শিক্ষার্থী'},\nমারকাযুল ঈমান 'সীরাত' অনলাইন প্ল্যাটফর্ম থেকে আপনার সাথে যোগাযোগ করা হচ্ছে।`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp-এ শুভেচ্ছা পাঠান"
                        >
                          <MessageCircle size={13} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">মোবাইল:</span>
                      <span className="text-slate-500 font-italic">প্রোফাইলে যুক্ত নেই</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ইমেইল:</span>
                    <span className="font-mono text-slate-300 text-[11px] truncate max-w-[180px]">
                      {studentDetails?.email || session?.user?.email || 'গেস্ট অ্যাকাউন্ট'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">মাদরাসা:</span>
                    <span className="font-bold text-slate-200 text-right">{madrasa}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">জেলা:</span>
                    <span className="font-bold text-slate-200">{district}</span>
                  </div>

                  {studentDetails?.goal && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400 block text-[11px]">পড়ার উদ্দেশ্য:</span>
                      <p className="text-slate-300 font-medium text-[11px] mt-0.5 italic">"{studentDetails.goal}"</p>
                    </div>
                  )}
                </div>

                {/* Location & Network Geo-Card */}
                {session?.location && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white flex items-center gap-1.5">
                        <MapPin size={13} className="text-emerald-400" />
                        ভৌগোলিক অবস্থান ও আইপি
                      </span>
                      {session.location.mapsUrl && (
                        <a
                          href={session.location.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <ExternalLink size={11} /> ম্যাপে পিন
                        </a>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span>শহর / জেলা:</span>
                      <span className="font-bold">{session.location.flag} {session.location.city || session.location.district || 'ঢাকা'}, {session.location.country}</span>
                    </div>

                    {session.location.ip && (
                      <div className="text-[11px] text-slate-300 flex items-center justify-between">
                        <span>আইপি অ্যাড্রেস:</span>
                        <span className="font-mono text-emerald-400">{session.location.ip}</span>
                      </div>
                    )}

                    {session.location.isp && (
                      <div className="text-[11px] text-slate-300 flex items-center justify-between">
                        <span>ইন্টারনেট প্রোভাইডার:</span>
                        <span className="text-slate-400 truncate max-w-[170px]">{session.location.isp}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Instant Bonus XP Reward from Admin */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Gift size={13} /> লাইভ পাঠ চলাকালীন বোনাস XP দিন
                    </span>
                    {bonusAwardMsg && (
                      <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                        {bonusAwardMsg}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickBonus(50)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-emerald-500/40"
                    >
                      +৫০ XP
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBonus(100)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-emerald-500/40"
                    >
                      +১০০ XP
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBonus(250)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold text-xs transition-colors cursor-pointer border border-emerald-500/40"
                    >
                      +২৫০ XP
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-tab 2: LIVE ACTION TIMELINE */}
            {activeSidebarTab === 'timeline' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
                <span className="text-xs font-bold text-white block mb-1">
                  শিক্ষার্থীর সাম্প্রতিক ইন্টারঅ্যাকশন হিস্ট্রি ({toBengaliNumber(actionHistory.length)}টি)
                </span>

                {actionHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    কোনো নতুন ক্লিক এখনো রেকর্ড হয়নি...
                  </div>
                ) : (
                  actionHistory.map((act, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start justify-between gap-2">
                      <span className="font-medium text-slate-200">{act.text}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{act.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub-tab 3: REMOTE ENCOURAGEMENT & DUA */}
            {activeSidebarTab === 'nudge' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                <div>
                  <span className="text-xs font-bold text-white block mb-1">
                    শিক্ষার্থীর স্ক্রিনে ইসলামিক উৎসাহ বা বার্তা পাঠান
                  </span>
                  <p className="text-[11px] text-slate-400">
                    এখান থেকে কোনো বার্তা পাঠালে শিক্ষার্থীর ডিভাইসে সুন্দর কনফেটি অ্যানিমেশন সহ একটি বরকতপূর্ণ নোটিফিকেশন ভেসে উঠবে।
                  </p>
                </div>

                {nudgeSentAlert && (
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold animate-fade-in flex items-center justify-center gap-1.5">
                    <Check size={14} />
                    <span>শিক্ষার্থীর স্ক্রিনে শুভেচ্ছা পৌঁছে গেছে!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendNudge('dua')}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left cursor-pointer transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">🤲</span>
                    <div>
                      <span className="font-bold text-white block">মাশাআল্লাহ দুআ পাঠান</span>
                      <span className="text-[10px] text-slate-400">"মাশাআল্লাহ! চমৎকার হয়েছে, এভাবে অধ্যবসায় চালিয়ে যান"</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendNudge('applause')}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left cursor-pointer transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">👏</span>
                    <div>
                      <span className="font-bold text-white block">শাবাশ ও শুভেচ্ছা</span>
                      <span className="text-[10px] text-slate-400">"সাবাশ! আপনার মনোযোগ প্রশংসনীয়"</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendNudge('star')}
                    className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left cursor-pointer transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">⭐</span>
                    <div>
                      <span className="font-bold text-white block">ইলমী স্টার পুরস্কার</span>
                      <span className="text-[10px] text-slate-400">"আজকের পাঠে আপনি অসাধারণ উন্নতি করছেন"</span>
                    </div>
                  </button>
                </div>

                {/* Custom Note input */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-1">কাস্টম নির্দেশনা / মেসেজ:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={customNudgeMsg}
                      onChange={(e) => setCustomNudgeMsg(e.target.value)}
                      placeholder="যেমন: দারস ৩ ভালো করে রিভিশন দাও..."
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                    >
                    </input>
                    <button
                      type="button"
                      onClick={() => handleSendNudge('custom', customNudgeMsg)}
                      disabled={!customNudgeMsg.trim()}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-emerald-400 hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>লাইভ কো-ব্রাউজিং ও শিক্ষার্থী মনিটরিং পোর্টাল • মারকাযুল ঈমান ইলমী বোর্ড</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white font-bold cursor-pointer"
          >
            বন্ধ করুন ✕
          </button>
        </div>

      </div>
    </div>
  );
}
