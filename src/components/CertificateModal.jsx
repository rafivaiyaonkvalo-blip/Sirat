import React, { useState, useEffect } from 'react';
import { 
  X, Award, CheckCircle2, Lock, Sparkles, Edit2, Check, RefreshCw, BookOpen 
} from 'lucide-react';
import StudentCertificate from './StudentCertificate';
import { 
  VOLUME_CONFIGS, 
  getVolumeProgress, 
  getCertificateData 
} from '../utils/certificateManager';
import { readSavedProfile } from './ProfileDashboard';
import { toBengaliNumber } from '../utils/gamification';
import { triggerHaptic } from '../utils/haptics';

export default function CertificateModal({ isOpen, onClose, user }) {
  const [activeVolumeId, setActiveVolumeId] = useState('vol1');
  const [editingName, setEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [savedName, setSavedName] = useState('');

  const profile = readSavedProfile();

  useEffect(() => {
    if (isOpen) {
      const initialName = profile?.name || user?.displayName || 'শিক্ষার্থী';
      setSavedName(initialName);
      setCustomName(initialName);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentVolume = VOLUME_CONFIGS.find(v => v.id === activeVolumeId) || VOLUME_CONFIGS[0];
  const progress = getVolumeProgress(activeVolumeId);
  const certData = getCertificateData(user, profile, activeVolumeId, savedName);

  const handleSaveName = (e) => {
    e.preventDefault();
    triggerHaptic();
    if (customName.trim()) {
      setSavedName(customName.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[94vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* মোডাল হেডার */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center shadow-xs text-amber-600 dark:text-amber-400">
              <Award size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                ডিজিটাল প্রশংসাপত্র ও সনদপত্র
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                মারকাযুল ঈমান • এসো আরবী শিখি পাঠ্যক্রম
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* খণ্ড নির্বাচন ও অগ্রগতি ট্যাব */}
        <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {VOLUME_CONFIGS.map(vol => {
              const volProg = getVolumeProgress(vol.id);
              const isActive = activeVolumeId === vol.id;

              return (
                <button
                  key={vol.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setActiveVolumeId(vol.id);
                  }}
                  className={`flex-1 min-w-[140px] p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-black ${isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                      {vol.title}
                    </span>
                    {volProg.isUnlocked ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <Lock size={10} />
                        <span>{toBengaliNumber(volProg.percent)}%</span>
                      </span>
                    )}
                  </div>

                  {/* মিনি প্রোগ্রেস বার */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.max(4, volProg.percent)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* মূল স্ক্রলযোগ্য কনটেন্ট */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 [scrollbar-width:thin]">
          {!progress.isUnlocked ? (
            /* সনদ সেকশন লক করা রয়েছে এমন অবস্থায় সুন্দর ইসলামিক লক কার্ড */
            <div className="py-10 px-4 sm:px-8 text-center space-y-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-3">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                <Lock size={36} className="stroke-[2.2]" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30 shadow-xs">
                  <Lock size={12} />
                  <span>সনদপত্রটি এখনও তালাবদ্ধ (Locked)</span>
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2.5">
                  {currentVolume.title} সনদপত্র
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  মারকাযুল ঈমান মাদরাসার এই অফিশিয়াল সনদপত্রটি উন্মুক্ত করতে আপনাকে এই খণ্ডের সকল দারস সফলতার সাথে সম্পন্ন করতে হবে।
                </p>
              </div>

              {/* প্রোগ্রেস কার্ড */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs text-left">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">পাঠ সম্পন্ন</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {toBengaliNumber(progress.completedCount)} / {toBengaliNumber(progress.totalCount)} দারস ({toBengaliNumber(progress.percent)}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 transition-all duration-700"
                    style={{ width: `${Math.max(4, progress.percent)}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 pt-0.5">
                  আর মাত্র {toBengaliNumber(progress.remainingCount)}টি দারস শেষ করলেই সনদপত্রটি উন্মুক্ত হয়ে যাবে ইনশাআল্লাহ!
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('uls_navigate_tab', { detail: 'lessons' }));
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer inline-flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  <span>দারস পড়া শুরু করুন ➔</span>
                </button>
              </div>
            </div>
          ) : (
            /* সনদ আনলক হলে সার্টিফিকেট ও ডাউনলোডের সুবিধা */
            <>
              {/* নাম সম্পাদনা বার */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    সনদে প্রদর্শিত নাম:
                  </span>
                  {!editingName ? (
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {savedName}
                    </span>
                  ) : (
                    <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        className="px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={12} />
                        <span>সেভ</span>
                      </button>
                    </form>
                  )}
                </div>

                {!editingName && (
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>নাম পরিবর্তন করুন</span>
                  </button>
                )}
              </div>

              {/* সার্টিফিকেট কম্পোনেন্ট */}
              <StudentCertificate 
                certificateData={certData} 
                isPreview={false} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
