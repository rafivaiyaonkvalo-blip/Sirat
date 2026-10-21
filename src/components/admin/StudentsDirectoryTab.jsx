import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Phone, MapPin, Mail, Award, Flame, Zap, 
  BookOpen, Star, Calendar, Download, Eye, ExternalLink, ShieldCheck, 
  Check, Copy, MessageCircle, RefreshCw, X, SlidersHorizontal, ChevronRight, 
  UserCheck, LayoutGrid, List, Sparkles, AlertCircle, Heart, FileText, CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { 
  fetchRegisteredStudents, 
  exportStudentsToCSV, 
  downloadJsonFile,
  toBengaliNumber,
  formatRelativeTimeBn,
  awardBonusXp,
  adjustStudentStreak,
  auditAndFixStudentXp
} from '../../services/adminService';
import { getLevelInfo } from '../../utils/gamification';
import StudentIdCard from '../StudentIdCard';
import LiveScreenViewerModal from './LiveScreenViewerModal';
import { Smartphone } from 'lucide-react';

export default function StudentsDirectoryTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('xp'); // xp, lessons, tamrins, recent, name
  const [filterType, setFilterType] = useState('all'); // all, active, hasPhone, hasDistrict, highXp, male, female
  const [viewMode, setViewMode] = useState('grid'); // grid, table
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalTab, setModalTab] = useState('info'); // info, idCard, progress, vocabExams
  const [copiedField, setCopiedField] = useState(null);

  // Bonus XP & Streak Moderation State
  const [bonusAmount, setBonusAmount] = useState(100);
  const [bonusReason, setBonusReason] = useState('চমৎকার পাঠ অনুশীলনের জন্য পুরস্কার');
  const [bonusSubmitting, setBonusSubmitting] = useState(false);
  const [bonusSuccessMsg, setBonusSuccessMsg] = useState('');

  const [streakAdjustInput, setStreakAdjustInput] = useState(1);
  const [streakSubmitting, setStreakSubmitting] = useState(false);
  const [liveScreenSession, setLiveScreenSession] = useState(null);

  const handleOpenStudentLiveScreen = (st) => {
    if (!st) return;
    setLiveScreenSession({
      sessionId: `sess_${st.uid}`,
      visitorId: `vis_${(st.uid || '').slice(-6)}`,
      user: {
        uid: st.uid,
        name: st.displayName,
        email: st.email,
        phone: st.phone,
        madrasa: st.madrasa,
        district: st.district,
        photoURL: st.photoURL,
        isLoggedIn: true
      },
      isLive: true
    });
  };
  const [streakSuccessMsg, setStreakSuccessMsg] = useState('');

  const [fixXpSubmitting, setFixXpSubmitting] = useState(false);
  const [fixXpSuccessMsg, setFixXpSuccessMsg] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchRegisteredStudents();
      setStudents(data || []);
    } catch (err) {
      console.warn('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    let list = [...students];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(st => {
        const name = (st.displayName || '').toLowerCase();
        const email = (st.email || '').toLowerCase();
        const phone = (st.phone || '').toLowerCase();
        const district = (st.district || '').toLowerCase();
        const madrasa = (st.madrasa || '').toLowerCase();
        const id = (st.studentId || '').toLowerCase();
        const uid = (st.uid || '').toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q) || 
               district.includes(q) || madrasa.includes(q) || id.includes(q) || uid.includes(q);
      });
    }

    // Filter type
    if (filterType === 'active') {
      list = list.filter(st => st.totalXp > 0 || st.lessonsCount > 0 || st.tamrinsCount > 0);
    } else if (filterType === 'hasPhone') {
      list = list.filter(st => Boolean(st.phone && st.phone.trim()));
    } else if (filterType === 'hasDistrict') {
      list = list.filter(st => Boolean(st.district && st.district.trim()));
    } else if (filterType === 'highXp') {
      list = list.filter(st => st.totalXp >= 1000);
    } else if (filterType === 'suspicious') {
      list = list.filter(st => st.isSuspiciousXp);
    } else if (filterType === 'male') {
      list = list.filter(st => st.gender === 'male');
    } else if (filterType === 'female') {
      list = list.filter(st => st.gender === 'female');
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'xp') return (b.totalXp || 0) - (a.totalXp || 0);
      if (sortBy === 'lessons') return (b.lessonsCount || 0) - (a.lessonsCount || 0);
      if (sortBy === 'tamrins') return (b.tamrinsCount || 0) - (a.tamrinsCount || 0);
      if (sortBy === 'recent') {
        return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      }
      if (sortBy === 'name') return (a.displayName || '').localeCompare(b.displayName || '', 'bn');
      return 0;
    });

    return list;
  }, [students, searchQuery, filterType, sortBy]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.totalXp > 0 || s.lessonsCount > 0).length;
    const totalXp = students.reduce((acc, s) => acc + (s.totalXp || 0), 0);
    const totalLessons = students.reduce((acc, s) => acc + (s.lessonsCount || 0), 0);
    const totalTamrins = students.reduce((acc, s) => acc + (s.tamrinsCount || 0), 0);
    const withPhone = students.filter(s => s.phone && s.phone.trim()).length;
    const withDistrict = students.filter(s => s.district && s.district.trim()).length;

    // Top districts count
    const districtCounts = {};
    students.forEach(s => {
      if (s.district && s.district.trim()) {
        const d = s.district.trim().toLowerCase();
        districtCounts[d] = (districtCounts[d] || 0) + 1;
      }
    });

    return {
      total,
      active,
      totalXp,
      totalLessons,
      totalTamrins,
      withPhone,
      withDistrict,
      suspicious: students.filter(s => s.isSuspiciousXp).length,
      profileCompletionRate: total > 0 ? Math.round(((withPhone + withDistrict) / (total * 2)) * 100) : 0
    };
  }, [students]);

  const cleanPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return '';
    let p = rawPhone.replace(/[^0-9]/g, '');
    if (p.startsWith('01')) p = '88' + p;
    return p;
  };

  const makeWhatsAppUrl = (rawPhone, name) => {
    const clean = cleanPhoneForWhatsApp(rawPhone);
    if (!clean) return '#';
    const text = encodeURIComponent(`আসসালামু আলাইকুম ${name || 'শিক্ষার্থী'},\nমারকাযুল ঈমান 'সীরাত' অনলাইন প্ল্যাটফর্ম থেকে আপনার সাথে যোগাযোগ করা হচ্ছে।`);
    return `https://wa.me/${clean}?text=${text}`;
  };

  const handleAwardBonus = async () => {
    if (!selectedStudent?.uid) return;
    setBonusSubmitting(true);
    setBonusSuccessMsg('');
    try {
      const res = await awardBonusXp(selectedStudent.uid, bonusAmount, bonusReason);
      if (res && res.success) {
        setBonusSuccessMsg(`+${toBengaliNumber(bonusAmount)} XP সফলভাবে প্রদান করা হয়েছে!`);
        setSelectedStudent(prev => ({ ...prev, totalXp: res.newTotalXp }));
        setStudents(prev => prev.map(s => s.uid === selectedStudent.uid ? { ...s, totalXp: res.newTotalXp } : s));
        setTimeout(() => setBonusSuccessMsg(''), 3500);
      }
    } catch (err) {
      alert('বোনাস XP প্রদানে ত্রুটি হয়েছে।');
    } finally {
      setBonusSubmitting(false);
    }
  };

  const handleAdjustStreak = async () => {
    if (!selectedStudent?.uid) return;
    setStreakSubmitting(true);
    setStreakSuccessMsg('');
    try {
      await adjustStudentStreak(selectedStudent.uid, streakAdjustInput);
      setStreakSuccessMsg(`স্ট্রিক ${toBengaliNumber(streakAdjustInput)} দিনে আপডেট হয়েছে!`);
      setSelectedStudent(prev => ({ ...prev, streakDays: parseInt(streakAdjustInput, 10) }));
      setStudents(prev => prev.map(s => s.uid === selectedStudent.uid ? { ...s, streakDays: parseInt(streakAdjustInput, 10) } : s));
      setTimeout(() => setStreakSuccessMsg(''), 3500);
    } catch (err) {
      alert('স্ট্রিক আপডেটে ত্রুটি হয়েছে।');
    } finally {
      setStreakSubmitting(false);
    }
  };

  const handleAuditAndFixXp = async () => {
    if (!selectedStudent?.uid) return;
    const targetXp = selectedStudent.legitimateXp || 0;
    if (!window.confirm(`আপনি কি "${selectedStudent.displayName}"-এর XP তার বাস্তব পাঠানুশীলন অনুযায়ী ${toBengaliNumber(targetXp)} XP-তে রিসেট করতে চান?`)) {
      return;
    }
    setFixXpSubmitting(true);
    setFixXpSuccessMsg('');
    try {
      const res = await auditAndFixStudentXp(selectedStudent.uid);
      if (res?.success) {
        setFixXpSuccessMsg(`XP সফলভাবে মেরামত করা হয়েছে! নতুন বৈধ XP: ${toBengaliNumber(res.newTotalXp)}`);
        setSelectedStudent(prev => ({ ...prev, totalXp: res.newTotalXp, isSuspiciousXp: false }));
        setStudents(prev => prev.map(s => s.uid === selectedStudent.uid ? { ...s, totalXp: res.newTotalXp, isSuspiciousXp: false } : s));
        setTimeout(() => setFixXpSuccessMsg(''), 4000);
      }
    } catch {
      alert('XP মেরামতে ত্রুটি হয়েছে।');
    } finally {
      setFixXpSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-bengali">
      {/* ------------------------------------------------------------- */}
      {/* TOP STATS BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">নিবন্ধিত শিক্ষার্থী</span>
            <Users size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {toBengaliNumber(metrics.total)} <span className="text-xs text-slate-400 font-normal">জন</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">মারকাযুল ঈমান পরিবার</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-teal-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">সক্রিয় শিক্ষার্থী</span>
            <Zap size={16} className="text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300">
            {toBengaliNumber(metrics.active)} <span className="text-xs text-slate-400 font-normal">জন</span>
          </div>
          <span className="text-[10px] text-teal-400 font-bold block mt-1">পাঠ শুরু করেছে</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">অর্জিত সর্বমোট XP</span>
            <Flame size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {toBengaliNumber(metrics.totalXp)}
          </div>
          <span className="text-[10px] text-amber-400/90 font-bold block mt-1">গ্যামিফিকেশন স্কোর</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-sky-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">সম্পন্ন পাঠ</span>
            <BookOpen size={16} className="text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-300">
            {toBengaliNumber(metrics.totalLessons)} <span className="text-xs text-slate-400 font-normal">টি</span>
          </div>
          <span className="text-[10px] text-sky-400 font-bold block mt-1">সীরাত</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-indigo-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">তামরীন অনুশীলন</span>
            <FileText size={16} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            {toBengaliNumber(metrics.totalTamrins)} <span className="text-xs text-slate-400 font-normal">টি</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-bold block mt-1">সীরাত</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">প্রফাইল সম্পূর্ণতা</span>
            <CheckCircle2 size={16} className="text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            {toBengaliNumber(metrics.profileCompletionRate)}%
          </div>
          <span className="text-[10px] text-purple-400 font-bold block mt-1">{toBengaliNumber(metrics.withPhone)} জনের ফোন নম্বর সহ</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH, FILTER & ACTION BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিক্ষার্থীর নাম, ইমেইল, মোবাইল নম্বর, জেলা বা আইডি দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="কার্ড গ্রিড ভিউ"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="ডিটেইলড টেবিল ভিউ"
              >
                <List size={16} />
              </button>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={loadStudents}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="নতুন করে লোড করুন"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-400' : ''} />
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={() => exportStudentsToCSV(filteredStudents)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              title="এক্সেল বা সিএসভিতে ডাউনলোড করুন"
            >
              <Download size={14} />
              <span>CSV এক্সপোর্ট</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={() => downloadJsonFile(filteredStudents, `students_backup_${new Date().toISOString().split('T')[0]}.json`)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="JSON ব্যাকআপ ফাইল"
            >
              <Download size={14} />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Sort Select */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-700/60">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'all', label: `সবাই (${toBengaliNumber(students.length)})` },
              { id: 'active', label: `সক্রিয় (${toBengaliNumber(metrics.active)})` },
              { id: 'hasPhone', label: `মোবাইল সহ (${toBengaliNumber(metrics.withPhone)})` },
              { id: 'hasDistrict', label: `জেলা সহ (${toBengaliNumber(metrics.withDistrict)})` },
              { id: 'highXp', label: '১০০০+ XP' },
              ...(metrics.suspicious > 0 ? [{ id: 'suspicious', label: `⚠️ সন্দেহজনক (${toBengaliNumber(metrics.suspicious)})` }] : []),
              { id: 'male', label: 'ছেলে' },
              { id: 'female', label: 'মেয়ে' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <SlidersHorizontal size={13} /> সাজান:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 text-xs font-bold text-slate-200 outline-none cursor-pointer"
            >
              <option value="xp">সর্বোচ্চ XP</option>
              <option value="lessons">সর্বাধিক পাঠ সম্পন্ন</option>
              <option value="tamrins">সর্বাধিক তামরীন সম্পন্ন</option>
              <option value="recent">সাম্প্রতিক সক্রিয়</option>
              <option value="name">নামের ক্রমানুসারে</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STUDENTS DISPLAY (GRID OR TABLE) */}
      {/* ------------------------------------------------------------- */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 space-y-3">
          <RefreshCw size={36} className="animate-spin mx-auto text-emerald-400" />
          <p className="text-sm font-bold">শিক্ষার্থীদের প্রফাইল লোড হচ্ছে...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-800/40 border border-slate-800 space-y-3">
          <Users size={40} className="mx-auto text-slate-600" />
          <h4 className="text-lg font-bold text-slate-300">কোনো শিক্ষার্থী পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500">আপনার ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করে চেষ্টা করুন।</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================== GRID CARDS VIEW ================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((st, idx) => {
            const levelInfo = getLevelInfo(st.totalXp);
            const avatarInitial = (st.displayName || 'শ')[0].toUpperCase();
            const relTime = formatRelativeTimeBn(st.updatedAt || st.createdAt);

            return (
              <div
                key={st.uid}
                className="rounded-3xl bg-slate-800 border border-slate-700/80 hover:border-emerald-500/40 p-5 space-y-4 transition-all hover:shadow-xl hover:shadow-emerald-950/20 relative group"
              >
                {/* Header: Avatar, Name & Student ID */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {st.photoURL ? (
                        <img
                          src={st.photoURL}
                          alt=""
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md">
                          {avatarInitial}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-emerald-500 text-[10px] font-black text-emerald-400 flex items-center justify-center">
                        {toBengaliNumber(idx + 1)}
                      </span>
                    </div>

                    {/* Name & ID */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-black text-base text-white truncate" title={st.displayName}>
                          {st.displayName}
                        </h4>
                        {st.gender === 'female' && (
                          <span className="px-1.5 py-0.2 rounded-md bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                            বোন
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                          {st.studentId}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[150px]" title={st.email}>
                          {st.email || 'ইমেইল নেই'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top XP & Streak */}
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-xs">
                      <Flame size={13} className="text-amber-400" />
                      <span>{toBengaliNumber(st.totalXp)} XP</span>
                    </span>
                    {st.isSuspiciousXp && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 block mt-1">
                        ⚠️ কারচুপি সন্দেহ
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {toBengaliNumber(st.streakDays)} দিন স্ট্রিক
                    </span>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-750">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                      <Award size={13} /> {levelInfo.title}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      লেভেল {toBengaliNumber(levelInfo.level)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((st.totalXp / (levelInfo.nextXp || 1000)) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Info Badges (Phone, District, Madrasa) */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  {/* Phone */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <Phone size={13} className="text-emerald-400" /> মোবাইল:
                    </span>
                    {st.phone ? (
                      <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                        <span>{st.phone}</span>
                        <a
                          href={`tel:${st.phone}`}
                          className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="সরাসরি কল দিন"
                        >
                          <Phone size={12} />
                        </a>
                        <a
                          href={makeWhatsAppUrl(st.phone, st.displayName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
                          title="WhatsApp-এ মেসেজ পাঠান"
                        >
                          <MessageCircle size={12} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">দেওয়া নেই</span>
                    )}
                  </div>

                  {/* District */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <MapPin size={13} className="text-teal-400" /> জেলা:
                    </span>
                    <span className="font-bold text-slate-200">
                      {st.district || 'দেওয়া নেই'}
                    </span>
                  </div>

                  {/* Madrasa / Institute if available */}
                  {st.madrasa && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                        <BookOpen size={13} className="text-sky-400" /> মাদরাসা:
                      </span>
                      <span className="font-bold text-slate-200 truncate max-w-[160px]" title={st.madrasa}>
                        {st.madrasa}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Counters (Lessons & Tamrins) */}
                <div className="pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-900/40 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">সম্পন্ন পাঠ</span>
                    <span className="font-black text-emerald-400 text-sm">
                      {toBengaliNumber(st.lessonsCount)} <span className="text-[10px] font-normal">টি</span>
                    </span>
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">তামরীন</span>
                    <span className="font-black text-teal-400 text-sm">
                      {toBengaliNumber(st.tamrinsCount)} <span className="text-[10px] font-normal">টি</span>
                    </span>
                  </div>
                </div>

                {/* Footer: Last active & Details Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-750">
                  <span className="text-[10px] text-slate-400">
                    সক্রিয়: {relTime}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenStudentLiveScreen(st)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white text-xs font-bold transition-all border border-teal-500/30 cursor-pointer"
                      title="লাইভ স্ক্রিন দেখুন"
                    >
                      <Smartphone size={12} />
                      <span>স্ক্রিন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudent(st);
                        setModalTab('info');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition-all border border-emerald-500/30 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>প্রফাইল</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================== TABLE VIEW ================== */
        <div className="overflow-x-auto rounded-3xl bg-slate-800 border border-slate-700/80 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 font-extrabold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-4">নং ও আইডি</th>
                <th className="py-4 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-4 px-4">ইমেইল ও যোগাযোগ</th>
                <th className="py-4 px-4">জেলা ও ঠিকানা</th>
                <th className="py-4 px-4 text-center">XP ও লেভেল</th>
                <th className="py-4 px-4 text-center">পাঠ / তামরীন</th>
                <th className="py-4 px-4 text-center">স্ট্রিক</th>
                <th className="py-4 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750 font-medium">
              {filteredStudents.map((st, idx) => {
                const levelInfo = getLevelInfo(st.totalXp);
                return (
                  <tr key={st.uid} className="hover:bg-slate-750/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-400 text-[10px] font-black flex items-center justify-center">
                          {toBengaliNumber(idx + 1)}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {st.studentId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {st.photoURL ? (
                          <img src={st.photoURL} alt="" className="w-8 h-8 rounded-xl object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                            {(st.displayName || 'শ')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-white block">{st.displayName}</span>
                          {st.gender && (
                            <span className="text-[10px] text-slate-400 block">
                              {st.gender === 'male' ? 'ছেলে' : 'মেয়ে'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-mono text-slate-300 block">{st.email || 'ইমেইল নেই'}</span>
                        {st.phone && (
                          <span className="font-mono text-emerald-400 text-[11px] block mt-0.5">
                            {st.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-200 block">{st.district || '—'}</span>
                        {st.madrasa && (
                          <span className="text-[10px] text-slate-400 block">{st.madrasa}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-amber-300 block">{toBengaliNumber(st.totalXp)} XP</span>
                      <span className="text-[10px] text-emerald-400 block">{levelInfo.title}</span>
                      {st.isSuspiciousXp && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          ⚠️ সন্দেহজনক
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-white block">{toBengaliNumber(st.lessonsCount)}টি পাঠ</span>
                      <span className="text-[10px] text-teal-400 block">{toBengaliNumber(st.tamrinsCount)}টি তামরীন</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-rose-400 inline-flex items-center gap-1">
                        <Flame size={12} /> {toBengaliNumber(st.streakDays)} দিন
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {st.phone && (
                          <a
                            href={makeWhatsAppUrl(st.phone, st.displayName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors border border-emerald-500/30"
                            title="WhatsApp-এ মেসেজ পাঠান"
                          >
                            <MessageCircle size={13} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(st);
                            setModalTab('info');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-bold transition-all border border-emerald-500/30 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>প্রফাইল</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DETAILED STUDENT PROFILE INSPECTION MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {selectedStudent.photoURL ? (
                  <img
                    src={selectedStudent.photoURL}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xl flex items-center justify-center">
                    {(selectedStudent.displayName || 'শ')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-lg sm:text-xl text-white truncate">
                      {selectedStudent.displayName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                      {selectedStudent.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {selectedStudent.email || 'ইমেইল নেই'} • সদস্যপদ: {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : '২০২৬ শিক্ষাবর্ষ'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Subtabs Header */}
            <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-slate-950/40 border-b border-slate-800 text-xs overflow-x-auto scrollbar-none">
              {[
                { id: 'info', label: 'ব্যক্তিগত ও যোগাযোগ তথ্য', icon: UserCheck },
                { id: 'idCard', label: 'ডিজিটাল আইডি কার্ড', icon: ShieldCheck },
                { id: 'progress', label: `পাঠ ও তামরীন অগ্রগতি (${toBengaliNumber(selectedStudent.lessonsCount + selectedStudent.tamrinsCount)})`, icon: BookOpen },
                { id: 'vocabExams', label: `শব্দকোষ ও পরীক্ষা (${toBengaliNumber(selectedStudent.starredCount + selectedStudent.masteredCount)})`, icon: Award }
              ].map(t => {
                const Icon = t.icon;
                const isActive = modalTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setModalTab(t.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* TAB 1: PERSONAL & CONTACT INFO */}
              {modalTab === 'info' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 block font-semibold">পুরো নাম</span>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-base">{selectedStudent.displayName}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedStudent.displayName, 'name')}
                          className="text-slate-400 hover:text-emerald-400 cursor-pointer p-1"
                          title="নাম কপি করুন"
                        >
                          {copiedField === 'name' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 block font-semibold">ইমেইল ঠিকানা</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-sm truncate max-w-[240px]">
                          {selectedStudent.email || 'দেওয়া নেই'}
                        </span>
                        {selectedStudent.email && (
                          <div className="flex items-center gap-1">
                            <a
                              href={`mailto:${selectedStudent.email}`}
                              className="text-slate-400 hover:text-emerald-400 cursor-pointer p-1"
                              title="সরাসরি ইমেইল পাঠান"
                            >
                              <Mail size={14} />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedStudent.email, 'email')}
                              className="text-slate-400 hover:text-emerald-400 cursor-pointer p-1"
                              title="ইমেইল কপি করুন"
                            >
                              {copiedField === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 block font-semibold">মোবাইল নম্বর</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-400 text-base">
                          {selectedStudent.phone || 'দেওয়া নেই'}
                        </span>
                        {selectedStudent.phone && (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${selectedStudent.phone}`}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
                              title="সরাসরি কল দিন"
                            >
                              <Phone size={13} />
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhoneForWhatsApp(selectedStudent.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
                              title="WhatsApp চ্যাট খুলুন"
                            >
                              <MessageCircle size={13} />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedStudent.phone, 'phone')}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                              title="কপি করুন"
                            >
                              {copiedField === 'phone' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* District */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 block font-semibold">জেলা / অবস্থান</span>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-teal-400" />
                        <span className="font-extrabold text-white text-base">
                          {selectedStudent.district || 'দেওয়া নেই'}
                        </span>
                      </div>
                    </div>

                    {/* Gender & DOB */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 block font-semibold">লিঙ্গ ও জন্ম তারিখ</span>
                      <span className="font-bold text-slate-200 text-sm block">
                        {selectedStudent.gender === 'male' ? 'ছেলে (ভাই)' : (selectedStudent.gender === 'female' ? 'মেয়ে (বোন)' : 'নির্দিষ্ট করা নেই')}
                        {selectedStudent.dob ? ` • জন্ম: ${selectedStudent.dob}` : ''}
                      </span>
                    </div>

                    {/* Madrasa / Institution */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                      <span className="text-xs text-slate-400 block font-semibold">মাদরাসা / প্রতিষ্ঠান</span>
                      <span className="font-bold text-slate-200 text-sm block">
                        {selectedStudent.madrasa || 'সাধারণ শিক্ষার্থী'}
                      </span>
                    </div>

                    {/* Learning Goal */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1 sm:col-span-2">
                      <span className="text-xs text-slate-400 block font-semibold">শেখার লক্ষ্য ও উদ্দেশ্য</span>
                      <span className="font-bold text-emerald-300 text-sm block">
                        {selectedStudent.goal === 'for_allah' ? 'আল্লাহর সন্তুষ্টি ও কুরআন বুঝার উদ্দেশ্যে (قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ)' : (selectedStudent.goal || 'কুরআন ও হাদিসের বিশুদ্ধ আরবি ভাষা আত্মস্থকরণ')}
                      </span>
                    </div>

                    {/* Firebase UID */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
                      <span className="text-[11px] text-slate-500 block font-semibold">ফায়ারবেস ইউজার আইডি (UID)</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-slate-400 truncate max-w-[500px]">
                          {selectedStudent.uid}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedStudent.uid, 'uid')}
                          className="text-slate-500 hover:text-emerald-400 cursor-pointer p-1"
                          title="UID কপি করুন"
                        >
                          {copiedField === 'uid' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Admin Moderation & Rewards Box */}
                    <div className="col-span-1 sm:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 space-y-4 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Award size={18} className="text-amber-400" />
                          <h4 className="font-bold text-sm text-white">অ্যাডমিন মডারেশন ও শিক্ষার্থী পুরস্কার</h4>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                          ম্যানেজমেন্ট অ্যাকশন
                        </span>
                      </div>

                      {/* 1. Award Bonus XP */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>বোনাস XP প্রদান করুন (Award Bonus XP)</span>
                          <span className="text-[11px] text-amber-400">বর্তমান: {toBengaliNumber(selectedStudent.totalXp)} XP</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {[50, 100, 250, 500].map(amt => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setBonusAmount(amt)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                bonusAmount === amt
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                              }`}
                            >
                              +{toBengaliNumber(amt)} XP
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <input
                            type="text"
                            value={bonusReason}
                            onChange={(e) => setBonusReason(e.target.value)}
                            placeholder="পুরস্কারের কারণ..."
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={handleAwardBonus}
                            disabled={bonusSubmitting}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                          >
                            {bonusSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                            <span>XP যোগ করুন</span>
                          </button>
                        </div>
                        {bonusSuccessMsg && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-scale-up">
                            <CheckCircle2 size={14} />
                            <span>{bonusSuccessMsg}</span>
                          </div>
                        )}
                      </div>

                      {/* 2. Adjust Streak */}
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>স্ট্রিক মেরামত বা সংশোধন (Adjust Streak)</span>
                          <span className="text-[11px] text-rose-400">বর্তমান: {toBengaliNumber(selectedStudent.streakDays)} দিন</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={streakAdjustInput}
                            onChange={(e) => setStreakAdjustInput(e.target.value)}
                            className="w-24 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white outline-none focus:border-emerald-500 text-center font-bold"
                          />
                          <button
                            type="button"
                            onClick={handleAdjustStreak}
                            disabled={streakSubmitting}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {streakSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <Flame size={13} className="text-rose-400" />}
                            <span>স্ট্রিক আপডেট করুন</span>
                          </button>
                        </div>
                        {streakSuccessMsg && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-scale-up">
                            <CheckCircle2 size={14} />
                            <span>{streakSuccessMsg}</span>
                          </div>
                        )}
                      </div>

                      {/* 3. Anti-Cheat XP Audit & Reset */}
                      <div className="pt-3 border-t border-slate-800 space-y-2.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ShieldAlert size={14} className={selectedStudent.isSuspiciousXp ? "text-rose-400" : "text-emerald-400"} />
                            <span>অ্যান্টি-চিট ও XP সততা অডিট</span>
                          </span>
                          {selectedStudent.isSuspiciousXp ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                              ⚠️ কারচুপি চিহ্নিত
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                              ✓ সুরক্ষিত
                            </span>
                          )}
                        </label>

                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>বর্তমান মোট XP:</span>
                            <span className="font-bold text-amber-300">{toBengaliNumber(selectedStudent.totalXp)} XP</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>দারস ও তামরীন অনুযায়ী সর্বোচ্চ সিলিং:</span>
                            <span className="font-mono text-slate-300">{toBengaliNumber(selectedStudent.plausibleMaxXp || 0)} XP</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>হিসাবকৃত প্রকৃত বৈধ XP:</span>
                            <span className="font-bold text-emerald-400">{toBengaliNumber(selectedStudent.legitimateXp || 0)} XP</span>
                          </div>

                          {selectedStudent.isSuspiciousXp && (
                            <p className="text-[11px] text-rose-300/90 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                              ⚠️ সতর্কবার্তা: এই শিক্ষার্থীর পাঠ্যক্রমের প্রগ্রেসের তুলনায় XP অস্বাভাবিকভাবে বেশি।
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={handleAuditAndFixXp}
                            disabled={fixXpSubmitting}
                            className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {fixXpSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <ShieldAlert size={13} />}
                            <span>প্রকৃত বৈধ XP-তে রিসেট ও মেরামত করুন</span>
                          </button>
                        </div>

                        {fixXpSuccessMsg && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-scale-up">
                            <CheckCircle2 size={14} />
                            <span>{fixXpSuccessMsg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DIGITAL ID CARD */}
              {modalTab === 'idCard' && (
                <div className="space-y-4 animate-fade-in flex flex-col items-center">
                  <div className="w-full max-w-xl">
                    <StudentIdCard
                      user={{
                        uid: selectedStudent.uid,
                        displayName: selectedStudent.displayName,
                        email: selectedStudent.email,
                        photoURL: selectedStudent.photoURL,
                        metadata: { creationTime: selectedStudent.createdAt }
                      }}
                      profileData={{
                        name: selectedStudent.displayName,
                        phone: selectedStudent.phone,
                        district: selectedStudent.district,
                        photo: selectedStudent.photoURL,
                        madrasa: selectedStudent.madrasa
                      }}
                      totalXp={selectedStudent.totalXp}
                      streakDays={selectedStudent.streakDays}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: LESSONS & TAMRINS PROGRESS */}
              {modalTab === 'progress' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Summary row */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-slate-800 border border-emerald-500/30">
                      <span className="text-xs text-slate-400 block font-semibold">সম্পন্ন পাঠ</span>
                      <span className="text-xl font-black text-emerald-400 mt-1 block">
                        {toBengaliNumber(selectedStudent.lessonsCount)}টি পাঠ
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800 border border-teal-500/30">
                      <span className="text-xs text-slate-400 block font-semibold">সম্পন্ন তামরীন</span>
                      <span className="text-xl font-black text-teal-400 mt-1 block">
                        {toBengaliNumber(selectedStudent.tamrinsCount)}টি তামরীন
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800 border border-amber-500/30">
                      <span className="text-xs text-slate-400 block font-semibold">অবিরাম স্ট্রিক</span>
                      <span className="text-xl font-black text-amber-400 mt-1 block">
                        {toBengaliNumber(selectedStudent.streakDays)} দিন
                      </span>
                    </div>
                  </div>

                  {/* Completed Lessons List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <BookOpen size={16} className="text-emerald-400" />
                      <span>সম্পন্ন পাঠের তালিকা ({toBengaliNumber(selectedStudent.lessonsCount)}টি)</span>
                    </h4>

                    {selectedStudent.lessonsCount === 0 ? (
                      <div className="p-6 text-center text-slate-500 bg-slate-800/40 rounded-2xl text-xs">
                        এখনো কোনো পাঠ সম্পন্ন করেননি।
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                        {Object.entries(selectedStudent.lessonsProgress).map(([lesId, lData]) => (
                          <div
                            key={lesId}
                            className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span className="font-bold text-slate-200 font-mono">{lesId}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {lData?.stars && (
                                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                  <Star size={11} fill="currentColor" /> {toBengaliNumber(lData.stars)}
                                </span>
                              )}
                              {lData?.score !== undefined && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-500/20">
                                  {toBengaliNumber(lData.score)}%
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tamrins List */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <FileText size={16} className="text-teal-400" />
                      <span>সম্পন্ন তামরীনের তালিকা ({toBengaliNumber(selectedStudent.tamrinsCount)}টি)</span>
                    </h4>

                    {selectedStudent.tamrinsCount === 0 ? (
                      <div className="p-6 text-center text-slate-500 bg-slate-800/40 rounded-2xl text-xs">
                        এখনো কোনো তামরীন অনুশীলন করেননি।
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                        {Object.keys(selectedStudent.tamrinProgress).map((tamId) => (
                          <div
                            key={tamId}
                            className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 text-center font-mono text-xs font-bold text-teal-300"
                          >
                            {tamId}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: VOCABULARY & EXAMS */}
              {modalTab === 'vocabExams' && (
                <div className="space-y-5 animate-fade-in">
                  {/* Vocab Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-slate-800 border border-emerald-500/30">
                      <span className="text-xs text-slate-400 block font-semibold">আয়ত্ত করা শব্দ</span>
                      <span className="text-2xl font-black text-emerald-400 mt-1 block">
                        {toBengaliNumber(selectedStudent.masteredCount)}টি
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800 border border-amber-500/30">
                      <span className="text-xs text-slate-400 block font-semibold">সংরক্ষিত (Starred)</span>
                      <span className="text-2xl font-black text-amber-400 mt-1 block">
                        {toBengaliNumber(selectedStudent.starredCount)}টি
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800 border border-sky-500/30">
                      <span className="text-xs text-slate-400 block font-semibold">রিভিউ শব্দ</span>
                      <span className="text-2xl font-black text-sky-400 mt-1 block">
                        {toBengaliNumber(selectedStudent.reviewCount)}টি
                      </span>
                    </div>
                  </div>

                  {/* Exam History Timeline */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Award size={16} className="text-amber-400" />
                      <span>পরীক্ষার ফলাফল ও মেধা যাচাই রেকর্ড ({toBengaliNumber(selectedStudent.examHistory.length)}টি)</span>
                    </h4>

                    {selectedStudent.examHistory.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 bg-slate-800/40 rounded-2xl text-xs">
                        এখনো কোনো চূড়ান্ত পরীক্ষা বা গ্রিল-মি এক্সামে অংশ নেননি।
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {selectedStudent.examHistory.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-white block">
                                {ex.title || `পরীক্ষা #${toBengaliNumber(exIdx + 1)}`}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {ex.date ? new Date(ex.date).toLocaleDateString('bn-BD') : 'তারিখ উল্লেখ নেই'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-emerald-400 text-sm">
                                {toBengaliNumber(ex.score || ex.percentage || 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                মারকাযুল ঈমান ইলমী অ্যাডমিন ড্যাশবোর্ড
              </span>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold transition-all cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* LIVE SCREEN VIEWER MODAL */}
      {liveScreenSession && (
        <LiveScreenViewerModal
          session={liveScreenSession}
          onClose={() => setLiveScreenSession(null)}
        />
      )}
    </div>
  );
}
