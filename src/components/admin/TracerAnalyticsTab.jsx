import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Users, Clock, MousePointer, RefreshCw, Smartphone, 
  Monitor, Tablet, Globe, Search, Filter, Volume2, BookOpen, 
  CheckCircle, AlertCircle, Trash2, Eye, Calendar, Sparkles, 
  ChevronRight, Award, Flame, X, UserCheck, ShieldAlert,
  MapPin, ExternalLink, Navigation
} from 'lucide-react';
import LiveScreenViewerModal from './LiveScreenViewerModal';
import { 
  fetchAnalyticsOverview, 
  fetchRecentSessions, 
  fetchRegisteredStudents, 
  deleteSessionRecord,
  formatDurationBn,
  formatRelativeTimeBn,
  toBengaliNumber
} from '../../services/adminService';

export default function TracerAnalyticsTab() {
  const [timeRange, setTimeRange] = useState('all'); // today, yesterday, 7d, 30d, all
  const [activeSubTab, setActiveSubTab] = useState('sessions'); // sessions, students
  const [roleFilter, setRoleFilter] = useState('all'); // all, live, student, guest
  const [searchQuery, setSearchQuery] = useState('');
  
  const [overview, setOverview] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Selected session for click stream inspection modal
  const [selectedSessionModal, setSelectedSessionModal] = useState(null);
  const [selectedLiveScreenSession, setSelectedLiveScreenSession] = useState(null);

  // Load analytics data
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [ovData, sessData, stuData] = await Promise.all([
        fetchAnalyticsOverview(timeRange),
        fetchRecentSessions({ timeRange, searchQuery, filterRole: roleFilter }),
        fetchRegisteredStudents()
      ]);
      setOverview(ovData);
      setSessions(sessData);
      setStudents(stuData);
    } catch (err) {
      console.warn('Error loading tracer analytics:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, [timeRange, roleFilter, searchQuery]);

  // Auto-refresh interval (every 15s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, timeRange, roleFilter, searchQuery]);

  const handleDeleteSession = async (session) => {
    if (window.confirm(`আপনি কি "${session.user?.name || session.visitorId}" এর এই সেশন রেকর্ডটি মুছে ফেলতে চান?`)) {
      await deleteSessionRecord(session.sessionId || session.docId);
      setSessions(prev => prev.filter(s => (s.sessionId || s.docId) !== (session.sessionId || session.docId)));
      loadData(true);
    }
  };

  const getDeviceIcon = (deviceType) => {
    if (deviceType === 'Mobile') return <Smartphone size={15} className="text-emerald-400" />;
    if (deviceType === 'Tablet') return <Tablet size={15} className="text-teal-400" />;
    return <Monitor size={15} className="text-sky-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in font-bengali">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity size={18} className="animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ওয়েবসাইট ব্যবহার ও ইউজার ট্র্যাকার (Analytics)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            কে কতক্ষণ সাইট ব্যবহার করেছে, সর্বমোট সময়, ক্লিক ও রিয়েল-টাইম লাইভ অ্যাক্টিভিটি
          </p>
        </div>

        {/* Time Filters & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-slate-700/80 text-xs">
            {[
              { id: 'today', label: 'আজকে' },
              { id: 'yesterday', label: 'গতকাল' },
              { id: '7d', label: '৭ দিন' },
              { id: '30d', label: '৩০ দিন' },
              { id: 'all', label: 'সর্বকালের' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTimeRange(btn.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  timeRange === btn.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Auto Refresh toggle & Manual Button */}
          <button
            type="button"
            onClick={() => loadData(false)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-400' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              autoRefresh 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{autoRefresh ? 'অটো-সিঙ্ক চালু' : 'অটো-সিঙ্ক বন্ধ'}</span>
          </button>
        </div>
      </div>

      {/* 6 Core KPI Cards (সর্বমোট কত ইউজ হয়েছে) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Sessions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-800/40 border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">মোট সেশন / ভিজিট</span>
            <Globe size={16} className="text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white block mt-1">
            {overview ? overview.totalSessionsBn : '—'}
          </span>
          <span className="text-[11px] text-emerald-400/90 font-medium">
            {timeRange === 'today' ? 'আজকের ভিজিট' : timeRange === 'all' ? 'সর্বমোট ভিজিট' : 'নির্বাচিত মেয়াদের'}
          </span>
        </div>

        {/* Total Active Duration */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-800/80 to-slate-800/40 border border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-emerald-300">মোট সময় ব্যয়</span>
            <Clock size={16} className="text-emerald-400" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 block mt-1 truncate">
            {overview ? overview.totalDurationFormatted : '—'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">সক্রিয় পাঠের সময়</span>
        </div>

        {/* Unique Visitors */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-800/40 border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">অনন্য শিক্ষার্থী</span>
            <Users size={16} className="text-teal-400" />
          </div>
          <span className="text-2xl font-black text-teal-300 block mt-1">
            {overview ? overview.uniqueVisitorsBn : '—'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">স্বতন্ত্র ডিভাইস/ইউজার</span>
        </div>

        {/* Total Clicks */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-800/40 border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">মোট ক্লিক</span>
            <MousePointer size={16} className="text-blue-400" />
          </div>
          <span className="text-2xl font-black text-blue-400 block mt-1">
            {overview ? overview.totalClicksBn : '—'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">ইন্টারঅ্যাকশন সংখ্যা</span>
        </div>

        {/* Live Users Now */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/20 via-slate-800/80 to-slate-800/40 border border-rose-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              লাইভ এখন
            </span>
            <Activity size={16} className="text-rose-400" />
          </div>
          <span className="text-2xl font-black text-white block mt-1">
            {overview ? overview.liveActiveBn : '০'} <span className="text-xs text-emerald-400 font-bold">অনলাইন</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">গত ৩ মিনিটে সক্রিয়</span>
        </div>

        {/* Avg Duration per Session */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-800/40 border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">গড় সময় / সেশন</span>
            <Sparkles size={16} className="text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400 block mt-1">
            {overview ? overview.avgDurationFormatted : '—'}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">প্রতি ভিজিটে সময়</span>
        </div>
      </div>

      {/* Feature Clicks Breakdown (ক্লিক ও ইন্টারঅ্যাকশন বিস্তারিত) */}
      {overview?.featureStats && (
        <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/70">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MousePointer size={16} className="text-emerald-400" />
              <span>ফিচারভিত্তিক ক্লিক ও ইন্টারঅ্যাকশন বিভাজন</span>
            </h3>
            <span className="text-xs text-slate-400">শিক্ষার্থীরা কোন ফিচারে কত ক্লিক করেছে</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Volume2 size={13} className="text-teal-400" /> অডিও উচ্চারণ
              </span>
              <span className="text-lg font-black text-teal-300 block mt-1">
                {overview.featureStats.audioPlaysBn} <span className="text-xs font-normal text-slate-400">বার</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <BookOpen size={13} className="text-emerald-400" /> পাঠ ও দারস
              </span>
              <span className="text-lg font-black text-emerald-400 block mt-1">
                {overview.featureStats.lessonsBn} <span className="text-xs font-normal text-slate-400">বার</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Award size={13} className="text-blue-400" /> কিতাবী তামরীন
              </span>
              <span className="text-lg font-black text-blue-400 block mt-1">
                {overview.featureStats.tamrinsBn} <span className="text-xs font-normal text-slate-400">বার</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle size={13} className="text-indigo-400" /> কুইজ ও উত্তর
              </span>
              <span className="text-lg font-black text-indigo-400 block mt-1">
                {overview.featureStats.quizzesBn} <span className="text-xs font-normal text-slate-400">বার</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Search size={13} className="text-amber-400" /> শব্দকোষ সার্চ
              </span>
              <span className="text-lg font-black text-amber-400 block mt-1">
                {overview.featureStats.searchesBn} <span className="text-xs font-normal text-slate-400">বার</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Globe size={13} className="text-purple-400" /> পেজ নেভিগেশন
              </span>
              <span className="text-lg font-black text-purple-400 block mt-1">
                {overview.featureStats.pageViewsBn} <span className="text-xs font-normal text-slate-400">বার</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Controls: Sessions vs Registered Students */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'sessions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity size={16} />
            <span>কে কতক্ষণ ইউজ করেছে ({toBengaliNumber(sessions.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('students')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'students'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users size={16} />
            <span>রেজিস্টার্ড শিক্ষার্থী রোস্টার ({toBengaliNumber(students.length)})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SESSIONS LIST (কে কতক্ষণ ইউজ করেছে) */}
      {/* ========================================================================= */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-4">
          {/* Filters & Search Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিক্ষার্থীর নাম, ইমেইল, গেস্ট আইডি বা ডিভাইস খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-700 text-xs">
              {[
                { id: 'all', label: 'সকল সেশন' },
                { id: 'live', label: '🟢 লাইভ অনলাইন' },
                { id: 'student', label: 'লগইন শিক্ষার্থী' },
                { id: 'guest', label: 'গেস্ট ভিজিটর' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setRoleFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    roleFilter === f.id
                      ? 'bg-slate-750 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List Table / Cards */}
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw size={24} className="animate-spin text-emerald-400 mx-auto mb-2" />
              <span>ব্যবহারকারী সেশন লোড হচ্ছে...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-700/60 text-slate-400">
              <Users size={32} className="mx-auto mb-2 text-slate-500" />
              <p className="font-bold text-base text-slate-300">কোনো সেশন পাওয়া যায়নি</p>
              <p className="text-xs text-slate-500 mt-1">নির্বাচিত ফিল্টারে এই মুহূর্তে কোনো রেকর্ড নেই।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {sessions.map((sess) => {
                const diffSec = Math.max(0, Math.round((Date.now() - new Date(sess.lastActiveAt || 0).getTime()) / 1000));
                const isLive = sess.isLive !== false && diffSec < 210;
                const durBn = formatDurationBn(sess.durationSeconds);
                const relTime = formatRelativeTimeBn(sess.lastActiveAt);

                return (
                  <div
                    key={sess.sessionId || sess.docId}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isLive
                        ? 'bg-gradient-to-r from-emerald-950/40 via-slate-800/90 to-slate-800/80 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    {/* User Info & Identity */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 font-black text-sm">
                          {sess.user?.photoURL ? (
                            <img src={sess.user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                          ) : sess.user?.isLoggedIn ? (
                            <UserCheck size={20} className="text-emerald-400" />
                          ) : (
                            getDeviceIcon(sess.device?.type)
                          )}
                        </div>
                        {isLive && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-white">
                            {sess.user?.name || `গেস্ট #${(sess.visitorId || '').slice(-4)}`}
                          </span>

                          {sess.user?.isLoggedIn ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              রেজিস্টার্ড শিক্ষার্থী
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-300 text-[10px] font-bold">
                              অতিথি ভিজিটর
                            </span>
                          )}

                          {isLive && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold animate-pulse">
                              🟢 লাইভ
                            </span>
                          )}
                        </div>

                        {/* Sub info: Device & Email / Madrasa */}
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                          {sess.user?.email && (
                            <span className="text-slate-300 font-mono text-[11px]">{sess.user.email}</span>
                          )}
                          {sess.user?.madrasa && (
                            <span>• {sess.user.madrasa}</span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-700/50">
                            {getDeviceIcon(sess.device?.type)}
                            <span>{sess.device?.os || 'Device'}</span>
                            <span>• {sess.device?.browser || 'Browser'}</span>
                          </span>
                        </div>

                        {/* Location Badge (IP / GPS Location) */}
                        {sess.location && (
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                              <MapPin size={11} className="text-emerald-400" />
                              <span>{sess.location.flag || '🇧🇩'}</span>
                              <span>{sess.location.city || sess.location.district || sess.location.region || 'ঢাকা'}, {sess.location.country || 'বাংলাদেশ'}</span>
                            </span>

                            {sess.location.isPreciseGps ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                <Navigation size={10} />
                                <span>নিখুঁত জিপিএস</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-900/60 text-slate-400 border border-slate-700/50">
                                <span>আইপি</span>
                              </span>
                            )}

                            {sess.location.mapsUrl && (
                              <a
                                href={sess.location.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-950/70 hover:bg-sky-900 text-sky-300 hover:text-white border border-sky-500/30 transition-colors"
                                title="গুগল ম্যাপে সরাসরি লোকেশন দেখুন"
                              >
                                <ExternalLink size={11} />
                                <span>ম্যাপে পিন</span>
                              </a>
                            )}

                            {sess.location.isp && (
                              <span className="text-[10px] text-slate-400">
                                • {sess.location.isp}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats & Duration (কে কতক্ষণ ইউজ করেছে) */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-700/60">
                      {/* Active Duration */}
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 block font-semibold">ব্যবহারের সময়কাল</span>
                        <span className="text-base sm:text-lg font-black text-emerald-400 block">
                          {durBn}
                        </span>
                      </div>

                      {/* Total Clicks */}
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 block font-semibold">ক্লিক সংখ্যা</span>
                        <span className="text-sm sm:text-base font-black text-blue-400 block">
                          {toBengaliNumber(sess.clicksCount || 0)}টি
                        </span>
                      </div>

                      {/* Last Active Time */}
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-slate-400 block font-semibold">সর্বশেষ সক্রিয়</span>
                        <span className="text-xs font-bold text-slate-300 block">
                          {relTime}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLiveScreenSession(sess)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
                          title="শিক্ষার্থীর লাইভ স্ক্রিন ও সম্পূর্ণ প্রোফাইল দেখুন"
                        >
                          <Smartphone size={14} className={isLive ? "animate-bounce text-emerald-200" : ""} />
                          <span>লাইভ স্ক্রিন ও প্রোফাইল</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedSessionModal(sess)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                          title="ক্লিক হিস্ট্রি ও জার্নি দেখুন"
                        >
                          <Eye size={14} />
                          <span>ক্লিক জার্নি ({toBengaliNumber((sess.recentEvents || []).length)})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSession(sess)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all cursor-pointer"
                          title="রেকর্ড মুছুন"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: REGISTERED STUDENTS ROSTER (রেজিস্টার্ড শিক্ষার্থী ও মোট প্রগ্রেস) */}
      {/* ========================================================================= */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              ক্লাউডে সংরক্ষিত মোট শিক্ষার্থী: <strong className="text-emerald-400">{toBengaliNumber(students.length)} জন</strong>
            </span>
            <span className="text-xs text-slate-400">সর্বোচ্চ অর্জিত XP অনুযায়ী সাজানো</span>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users size={32} className="mx-auto mb-2 text-slate-500" />
              <span>কোনো রেজিস্টার্ড শিক্ষার্থী পাওয়া যায়নি।</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((st, idx) => (
                <div
                  key={st.uid}
                  className="p-5 rounded-2xl bg-slate-800 border border-slate-700/80 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {st.photoURL ? (
                        <img src={st.photoURL} alt="" className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/40" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                          {toBengaliNumber(idx + 1)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-white">{st.displayName}</h4>
                          {st.studentId && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              {st.studentId}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono block">{st.email || 'ইমেইল নেই'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-amber-400 font-black flex items-center gap-1 justify-end">
                        <Flame size={14} /> {toBengaliNumber(st.totalXp)} XP
                      </span>
                      <span className="text-[10px] text-slate-400 block">{toBengaliNumber(st.streakDays)} দিন স্ট্রিক</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">সম্পন্ন পাঠ</span>
                      <span className="font-bold text-emerald-400">{toBengaliNumber(st.lessonsCount)}টি পাঠ</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">তামরীন অনুশীলন</span>
                      <span className="font-bold text-teal-400">{toBengaliNumber(st.tamrinsCount)}টি তামরীন</span>
                    </div>
                  </div>

                  {(st.phone || st.district || st.madrasa) && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl flex items-center justify-between flex-wrap gap-1">
                      {st.phone && <span>মোবাইল: <strong className="text-emerald-300 font-mono">{st.phone}</strong></span>}
                      {st.district && <span>জেলা: <strong className="text-slate-300">{st.district}</strong></span>}
                      {st.madrasa && <span>মাদরাসা: <strong className="text-slate-300">{st.madrasa}</strong></span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLICK JOURNEY / EVENT STREAM (ক্লিক ও ইন্টারঅ্যাকশন বিস্তারিত) */}
      {/* ========================================================================= */}
      {selectedLiveScreenSession && (
        <LiveScreenViewerModal
          session={selectedLiveScreenSession}
          onClose={() => setSelectedLiveScreenSession(null)}
        />
      )}

      {selectedSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-emerald-400" />
                  <h3 className="font-black text-base text-white">
                    ক্লিক ও ইন্টারঅ্যাকশন টাইমলাইন (Click Journey)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSessionModal.user?.name || `গেস্ট #${(selectedSessionModal.visitorId || '').slice(-4)}`} • সময়কাল: <strong className="text-emerald-400">{formatDurationBn(selectedSessionModal.durationSeconds)}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSessionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Chronological Event Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Detailed Location Card */}
              {selectedSessionModal.location && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-white">
                          {selectedSessionModal.location.flag} {selectedSessionModal.location.city || selectedSessionModal.location.district || 'ঢাকা'}, {selectedSessionModal.location.region ? `${selectedSessionModal.location.region}, ` : ''}{selectedSessionModal.location.country}
                        </span>
                        {selectedSessionModal.location.isPreciseGps ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            🎯 নিখুঁত জিপিএস {selectedSessionModal.location.accuracyMeters ? `(±${selectedSessionModal.location.accuracyMeters}m)` : ''}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-700">
                            আইপি লোকেশন
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {selectedSessionModal.location.isp ? `ISP: ${selectedSessionModal.location.isp} • ` : ''}
                        {selectedSessionModal.location.ip ? `IP: ${selectedSessionModal.location.ip}` : ''}
                        {selectedSessionModal.location.latitude && selectedSessionModal.location.longitude ? ` • কোঅর্ডিনেট: ${Number(selectedSessionModal.location.latitude).toFixed(4)}, ${Number(selectedSessionModal.location.longitude).toFixed(4)}` : ''}
                      </div>
                    </div>
                  </div>

                  {selectedSessionModal.location.mapsUrl && (
                    <a
                      href={selectedSessionModal.location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-950/40 transition-all cursor-pointer"
                    >
                      <ExternalLink size={13} />
                      <span>গুগল ম্যাপে পিন দেখুন</span>
                    </a>
                  )}
                </div>
              )}
              {(!selectedSessionModal.recentEvents || selectedSessionModal.recentEvents.length === 0) ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  এই সেশনের কোনো বিস্তারিত ক্লিক হিস্ট্রি পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-2.5 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {selectedSessionModal.recentEvents.map((ev, i) => {
                    const time = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';
                    
                    let Icon = MousePointer;
                    let iconColor = 'text-slate-400 bg-slate-800';
                    if (ev.type === 'audio_play') {
                      Icon = Volume2;
                      iconColor = 'text-teal-400 bg-teal-950/60 border border-teal-500/30';
                    } else if (ev.type === 'lesson_open' || ev.type === 'lesson_interaction') {
                      Icon = BookOpen;
                      iconColor = 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30';
                    } else if (ev.type === 'tamrin_open') {
                      Icon = Award;
                      iconColor = 'text-blue-400 bg-blue-950/60 border border-blue-500/30';
                    } else if (ev.type === 'quiz_answer') {
                      Icon = CheckCircle;
                      iconColor = ev.isCorrect ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60';
                    } else if (ev.type === 'search') {
                      Icon = Search;
                      iconColor = 'text-amber-400 bg-amber-950/60 border border-amber-500/30';
                    }

                    return (
                      <div key={i} className="flex items-start gap-3 relative pl-1">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 z-10 ${iconColor}`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60 text-xs">
                          <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="font-mono text-[11px] text-slate-400">{time}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">
                              {ev.type}
                            </span>
                          </div>
                          <span className="font-bold text-white text-xs block">
                            {ev.label || ev.text || 'ইন্টারঅ্যাকশন'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                মোট ক্লিক রেকর্ড: <strong className="text-white">{toBengaliNumber((selectedSessionModal.recentEvents || []).length)}টি</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedSessionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
