import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, ShieldCheck, Search, CheckCircle2, AlertCircle, 
  ExternalLink, Download, User, Calendar, BookOpen, 
  Copy, Check, MessageCircle, RefreshCw, X, Eye, Sparkles, Filter
} from 'lucide-react';
import { 
  fetchRegisteredStudents, 
  verifyCertificateSerial, 
  toBengaliNumber, 
  formatRelativeTimeBn 
} from '../../services/adminService';
import StudentCertificate from '../StudentCertificate';

export default function CertificatesManagerTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verification state
  const [searchSerial, setSearchSerial] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedSerial, setCopiedSerial] = useState(null);

  // Filter state
  const [filterVolume, setFilterVolume] = useState('all'); // all, vol1, vol2
  const [studentSearch, setStudentSearch] = useState('');

  // Certificate Modal Preview
  const [previewStudent, setPreviewStudent] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRegisteredStudents();
      setStudents(data || []);
    } catch (err) {
      console.warn('Failed to load students for certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!searchSerial.trim()) return;

    setVerifying(true);
    try {
      const res = await verifyCertificateSerial(searchSerial);
      setVerificationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedSerial(text);
    setTimeout(() => setCopiedSerial(null), 2000);
  };

  // Identify graduates (students with >= 28 completed lessons for Vol 1)
  const graduatesList = useMemo(() => {
    return students
      .filter((st) => {
        const completed = st.lessonsCount || 0;
        return completed >= 28; // Vol 1 has 28 lessons
      })
      .map((st) => {
        const rawSeed = (st.uid || st.email || 'student').replace(/[^a-zA-Z0-9]/g, '');
        const cleanId = (rawSeed.slice(-6) || '786012').toUpperCase();
        const serialNumber = `MI-2026-AR-VOL1-${cleanId}`;

        return {
          ...st,
          certificateSerial: serialNumber,
          isVol1Complete: true,
          isVol2Complete: st.lessonsCount >= 70
        };
      });
  }, [students]);

  // Filtered graduates
  const filteredGraduates = useMemo(() => {
    let list = [...graduatesList];

    if (filterVolume === 'vol2') {
      list = list.filter((g) => g.isVol2Complete);
    }

    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase().trim();
      list = list.filter((g) => {
        const name = (g.displayName || '').toLowerCase();
        const id = (g.studentId || '').toLowerCase();
        const email = (g.email || '').toLowerCase();
        const phone = (g.phone || '').toLowerCase();
        const serial = (g.certificateSerial || '').toLowerCase();
        return name.includes(q) || id.includes(q) || email.includes(q) || phone.includes(q) || serial.includes(q);
      });
    }

    return list;
  }, [graduatesList, filterVolume, studentSearch]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>সনদপত্র ভেরিফায়ার ও গ্র্যাজুয়েট হাব</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {toBengaliNumber(graduatesList.length)} জন গ্র্যাজুয়েট
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              অফিসিয়াল সনদপত্রের সিরিয়াল নম্বর যাচাই এবং সফল শিক্ষার্থীদের সনদপত্র পরিচালনা
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors self-start sm:self-auto"
          title="রিফ্রেশ করুন"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Instant Serial Number Verification Search Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
          <ShieldCheck size={18} />
          <span>তাত্ক্ষণিক সনদপত্র যাচাইকরণ (Instant Verification)</span>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              placeholder="সনদপত্রের সিরিয়াল নম্বর লিখুন (যেমন: MI-2026-AR-VOL1-...)"
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none font-mono transition-all shadow-inner"
            />
            {searchSerial && (
              <button
                type="button"
                onClick={() => {
                  setSearchSerial('');
                  setVerificationResult(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={verifying || !searchSerial.trim()}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-950/40"
          >
            {verifying ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            <span>যাচাই করুন</span>
          </button>
        </form>

        {/* Verification Result Card */}
        {verificationResult && (
          <div className="pt-2 animate-scale-up">
            {verificationResult.isValid ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>প্রমাণিত ও বিশুদ্ধ সনদপত্র (Verified Credential)</span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    মারকাযুল ঈমান স্বীকৃত
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">শিক্ষার্থীর নাম:</span>
                    <span className="font-bold text-white text-sm">
                      {verificationResult.student?.displayName || 'শিক্ষার্থী'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">পাঠ্যক্রম ও খণ্ড:</span>
                    <span className="font-bold text-teal-300">
                      {verificationResult.volume}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">সিরিয়াল নম্বর:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {verificationResult.serialNumber}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">মোট সম্পন্ন পাঠ:</span>
                    <span className="font-bold text-emerald-400">
                      {toBengaliNumber(verificationResult.lessonsCompleted)}টি দরস
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setPreviewStudent(verificationResult.student)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Eye size={13} />
                    <span>সনদপত্র প্রিভিউ দেখুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle size={18} className="shrink-0 text-rose-400" />
                <span>
                  সিরিয়াল নম্বরটি <strong>"{verificationResult.serialNumber}"</strong> খুঁজে পাওয়া যায়নি অথবা সনদটি এখনো অনুমোদিত হয়নি।
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Graduates Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterVolume('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterVolume === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              সকল গ্র্যাজুয়েট ({toBengaliNumber(graduatesList.length)})
            </button>
            <button
              type="button"
              onClick={() => setFilterVolume('vol1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterVolume === 'vol1'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              ১ম খণ্ড সম্পন্ন
            </button>
            <button
              type="button"
              onClick={() => setFilterVolume('vol2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterVolume === 'vol2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              ২য় খণ্ড সম্পন্ন ({toBengaliNumber(graduatesList.filter(g => g.isVol2Complete).length)})
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="গ্র্যাজুয়েট শিক্ষার্থী খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Graduates Cards Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <RefreshCw size={24} className="animate-spin text-emerald-400" />
            <span>গ্র্যাজুয়েট ডাটা লোড হচ্ছে...</span>
          </div>
        ) : filteredGraduates.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <Award size={32} className="mx-auto text-slate-500" />
            <p className="text-sm font-bold text-slate-300">কোনো সনদপ্রাপ্ত শিক্ষার্থী পাওয়া যায়নি</p>
            <p className="text-xs text-slate-500">১ম খণ্ডের ২৮টি দরস সম্পূর্ণ সম্পন্ন করলে শিক্ষার্থীরা এখানে অন্তর্ভুক্ত হবেন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredGraduates.map((st) => (
              <div
                key={st.uid}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group shadow-md"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">
                      {st.displayName ? st.displayName[0] : 'শ'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">
                        {st.displayName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {st.studentId}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 shrink-0">
                    সনদপ্রাপ্ত 📜
                  </span>
                </div>

                {/* Serial Bar */}
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-mono text-slate-400 truncate">
                    {st.certificateSerial}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(st.certificateSerial)}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title="সিরিয়াল কপি করুন"
                  >
                    {copiedSerial === st.certificateSerial ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>

                {/* Progress Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-teal-400" />
                    <span>{toBengaliNumber(st.lessonsCount)}টি দরস সম্পন্ন</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>{toBengaliNumber(st.totalXp)} মোট XP</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  {st.phone ? (
                    <a
                      href={`https://wa.me/${st.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${st.displayName},\nমারকাযুল ঈমান 'এসো আরবী শিখি' কোর্সের ১ম খণ্ড সফলভাবে সম্পন্ন করায় আপনাকে আন্তরিক মোবারকবাদ! আপনার অফিসিয়াল সনদপত্র সিরিয়াল: ${st.certificateSerial}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle size={12} />
                      <span>শুভেচ্ছা পাঠান</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500">ফোন নম্বর নেই</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewStudent(st)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye size={12} />
                    <span>সনদ প্রিভিউ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Modal Preview */}
      {previewStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewStudent(null)}
        >
          <div
            className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  {previewStudent.displayName} — অফিসিয়াল সনদপত্র প্রিভিউ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewStudent(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Visual Certificate */}
            <StudentCertificate
              user={previewStudent}
              volumeId="vol1"
              volumeTitle="১ম খণ্ড (Volume 1)"
              completedLessonsCount={previewStudent.lessonsCount || 28}
              totalLessonsInVolume={28}
              issueDate={previewStudent.updatedAt || previewStudent.createdAt}
            />
          </div>
        </div>
      )}
    </div>
  );
}
