import React, { useState, useEffect } from 'react';
import { 
  X, Flag, CheckCircle2, Send, MessageCircle, MessageSquare, AlertCircle, 
  Sparkles, BookOpen, PenTool, Search
} from 'lucide-react';
import { playSuccessChime } from '../utils/soundEffects';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getDeviceInfo } from '../services/analyticsTracker';

// মারকাযুল ঈমানের হোয়াটসঅ্যাপ নম্বর (01540715958)
const WHATSAPP_NUMBER = '8801540715958';

const ISSUE_CATEGORIES = [
  { id: 'harakat', label: '🔤 হরকত / তাশকীল ভুল', desc: 'যবর, যের, পেশ বা তাশদীদ সংক্রান্ত ত্রুটি' },
  { id: 'meaning', label: '📖 বাংলা অর্থ ভুল', desc: 'শব্দার্থ বা বাক্য তরজমায় অসংগতি' },
  { id: 'audio', label: '🔊 অডিও সমস্যা', desc: 'ভুল উচ্চারণ বা অডিও শুনতে না পাওয়া' },
  { id: 'tarkib', label: '⚖️ তারকীব / ব্যাকরণ প্রশ্ন', desc: "মুবতাদা, খবর, ফে'ল বা এরাব সংক্রান্ত" },
  { id: 'typo', label: '✏️ টাইপো বা বানান ভুল', desc: 'মুদ্রণজনিত যেকোনো ভুল' },
  { id: 'other', label: '💬 অন্যান্য ত্রুটি', desc: 'অন্যান্য যেকোনো অসঙ্গতি' }
];

const MESSAGE_CATEGORIES = [
  { id: 'suggestion', label: '💡 পরামর্শ ও মতামত', desc: 'অ্যাপটি আরও উন্নত করার মূল্যবান পরামর্শ' },
  { id: 'inquiry', label: '❓ কিতাব বা কোর্স জিজ্ঞাসা', desc: 'আরবি শিক্ষা ও কোর্স সংক্রান্ত যেকোনো প্রশ্ন' },
  { id: 'dua', label: '❤️ উৎসাহ ও দুআ', desc: 'টিমের প্রতি শুভেচ্ছা ও নেক দুআ' },
  { id: 'feature', label: '🚀 নতুন ফিচারের প্রস্তাব', desc: 'নতুন কোনো ফিচার বা সুবিধা যোগ করার অনুরোধ' }
];

export default function ReportModal({ 
  isOpen, 
  onClose, 
  context = {} 
}) {
  const isMessageMode = Boolean(context?.isMessage || context?.category === 'other' && context?.source === 'floating_speed_dial');
  const activeCategories = isMessageMode ? MESSAGE_CATEGORIES : ISSUE_CATEGORIES;

  const [selectedCategory, setSelectedCategory] = useState(isMessageMode ? (MESSAGE_CATEGORIES.some(c => c.id === context.category) ? context.category : 'suggestion') : (context.category || 'harakat'));
  const [details, setDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(isMessageMode ? (MESSAGE_CATEGORIES.some(c => c.id === context.category) ? context.category : 'suggestion') : (context.category || 'harakat'));
      setIsSuccess(false);
      setDetails('');

      // শিক্ষার্থীর নাম বা পরিচয় জানা থাকলে স্বয়ংক্রিয়ভাবে যোগাযোগ ফিল্ডে সাজেস্ট করা
      try {
        const storedProfile = JSON.parse(localStorage.getItem('uls_student_profile') || '{}');
        const user = auth?.currentUser;
        const name = user?.displayName || storedProfile?.name || '';
        const phone = storedProfile?.phone || '';
        const email = user?.email || '';

        if (!contactInfo) {
          if (name && phone) setContactInfo(`${name} (${phone})`);
          else if (name && email) setContactInfo(`${name} (${email})`);
          else if (name) setContactInfo(name);
          else if (phone) setContactInfo(phone);
          else if (email) setContactInfo(email);
        }
      } catch (e) {}
    }
  }, [isOpen, context, isMessageMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // শিক্ষার্থীর লগইন প্রফাইল তথ্য স্বয়ংক্রিয়ভাবে সংগ্রহ
    let studentUser = null;
    try {
      const storedProfile = JSON.parse(localStorage.getItem('uls_student_profile') || '{}');
      const user = auth?.currentUser;
      const currentUid = user?.uid || localStorage.getItem('uls_current_user_uid') || null;
      const totalXp = parseInt(localStorage.getItem('uls_total_xp') || '0', 10);
      
      if (currentUid || user || storedProfile?.name || contactInfo.trim()) {
        studentUser = {
          uid: currentUid || null,
          name: user?.displayName || storedProfile?.name || contactInfo.trim() || 'শিক্ষার্থী',
          email: user?.email || '',
          phone: storedProfile?.phone || '',
          district: storedProfile?.district || '',
          madrasa: storedProfile?.madrasa || '',
          photoURL: user?.photoURL || storedProfile?.photo || '',
          totalXp,
          isRegistered: Boolean(currentUid)
        };
      }
    } catch (e) {}

    const deviceInfo = typeof getDeviceInfo === 'function' ? getDeviceInfo() : null;

    const reportPayload = {
      id: 'rep_' + Date.now(),
      createdAt: new Date().toISOString(),
      category: selectedCategory,
      details: details.trim(),
      contactInfo: contactInfo.trim(),
      user: studentUser,
      reporterName: studentUser?.name || contactInfo.trim() || 'বেনামী পাঠক',
      reporterPhone: studentUser?.phone || '',
      reporterEmail: studentUser?.email || '',
      device: deviceInfo,
      context: {
        source: context.source || 'general',
        lessonId: context.lessonId || null,
        lessonTitle: context.lessonTitle || null,
        arabic: context.arabic || null,
        bangla: context.bangla || null,
        stepType: context.stepType || null,
        page: context.page || null
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    // 1. Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('uls_user_reports') || '[]');
      existing.unshift(reportPayload);
      localStorage.setItem('uls_user_reports', JSON.stringify(existing.slice(0, 50)));
    } catch (err) {
      console.warn('Failed to save report locally:', err);
    }

    // 2. Save to Cloud Firestore if connected
    if (db) {
      try {
        await addDoc(collection(db, 'reports'), reportPayload);
      } catch (cloudErr) {
        console.log('Saved locally (cloud sync skipped):', cloudErr?.message);
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    playSuccessChime();
  };

  // হোয়াটসঅ্যাপে সুন্দরভাবে সাজানো রিপোর্ট/মেসেজ পাঠানো
  const handleShareWhatsApp = () => {
    const categoryLabel = activeCategories.find(c => c.id === selectedCategory)?.label || selectedCategory;
    const date = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const lines = [
      'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ',
      '',
      isMessageMode ? '*সীরাত — মেসেজ*' : '*সীরাত — ভুল রিপোর্ট*',
      '━━━━━━━━━━━━━━',
      `📌 *ধরন:* ${categoryLabel}`,
      ...(context.lessonTitle ? [`📖 *পাঠ:* ${context.lessonTitle}`] : []),
      ...(context.arabic ? [`🔤 *আরবি:* ${context.arabic}`] : []),
      ...(context.bangla ? [`📝 *অর্থ:* ${context.bangla}`] : []),
      ...(details.trim() ? [`💬 *${isMessageMode ? 'মেসেজ' : 'বিস্তারিত'}:* ${details.trim()}`] : []),
      ...(contactInfo.trim() ? [`👤 *প্রেরক:* ${contactInfo.trim()}`] : []),
      `📅 *তারিখ:* ${date}`,
      '━━━━━━━━━━━━━━',
      'জাযাকাল্লাহু খাইরান 🌿',
      'arabic.markazuliman.com'
    ];

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setDetails('');
    setContactInfo('');
    setSelectedCategory('harakat');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {context?.isMessage || context?.category === 'other' ? (
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Flag size={18} />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                {context?.isMessage || context?.category === 'other' ? 'পরামর্শ বা মেসেজ পাঠান' : 'ভুলত্রুটি বা অসঙ্গতি রিপোর্ট'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {context?.isMessage || context?.category === 'other' ? 'মারকাযুল ঈমান টিম' : 'মারকাযুল ঈমান ইলমী যাচাই টিম'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Context Preview Card (Auto-captured) */}
              {(context.arabic || context.bangla || context.lessonTitle) && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>স্বয়ংক্রিয়ভাবে সংযুক্ত কনটেক্সট:</span>
                    {context.source && (
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {context.source === 'dars' ? 'দরস পাঠ' : context.source === 'tamrin' ? 'তামরীন' : 'শব্দকোষ'}
                      </span>
                    )}
                  </div>

                  {context.lessonTitle && (
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {context.lessonTitle}
                    </p>
                  )}

                  {context.arabic && (
                    <p className="font-arabic font-bold text-xl sm:text-2xl text-emerald-800 dark:text-emerald-300 leading-relaxed text-right select-text py-0.5">
                      {context.arabic}
                    </p>
                  )}

                  {context.bangla && (
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      অর্থ: "{context.bangla}"
                    </p>
                  )}
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-2">
                  {isMessageMode ? 'বার্তা বা পরামর্শের বিষয়:' : 'সমস্যার ধরন নির্বাচন করুন:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCategories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? isMessageMode
                              ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-violet-900 dark:text-violet-200 shadow-sm'
                              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 shadow-sm'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold block">{cat.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">
                          {cat.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Details Textarea */}
              <div>
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                  {isMessageMode ? 'আপনার বার্তা বা বিস্তারিত পরামর্শ লিখুন:' : 'সঠিক রূপটি কী বা আপনার মন্তব্য লিখুন:'}
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    isMessageMode
                      ? 'এখানে আপনার প্রশ্ন, সুচিন্তিত পরামর্শ বা যেকোনো মতামত বিস্তারিত লিখুন...'
                      : 'যেমন: অমুক শব্দের শেষ অক্ষরে পেশের পরিবর্তে যের হবে / বাংলা অর্থের সঠিক রূপ...'
                  }
                  className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none transition-colors resize-none font-sans ${
                    isMessageMode ? 'focus:border-violet-500' : 'focus:border-rose-500'
                  }`}
                />
              </div>

              {/* Contact Info (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  আপনার নাম বা যোগাযোগ (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="নাম / ফোন / ইমেইল"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none transition-colors ${
                    isMessageMode ? 'focus:border-violet-500' : 'focus:border-rose-500'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isMessageMode
                      ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/25'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
                  }`}
                >
                  <Send size={15} />
                  <span>
                    {isSubmitting 
                      ? 'পাঠানো হচ্ছে...' 
                      : isMessageMode 
                        ? 'মেসেজ পাঠান' 
                        : 'রিপোর্ট দাখিল করুন'
                    }
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title="হোয়াটসঅ্যাপে সরাসরি মারকাযুল ঈমানে পাঠান"
                >
                  <MessageCircle size={16} />
                  <span>হোয়াটসঅ্যাপে পাঠান</span>
                </button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border-4 border-emerald-400 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {isMessageMode ? 'বার্তা সফলভাবে পৌঁছেছে!' : 'জাযাকাল্লাহু খাইরান!'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
                  {isMessageMode
                    ? 'আপনার মূল্যবান পরামর্শ ও বার্তা মারকাযুল ঈমান টিমের নিকট পৌঁছেছে। আমাদের সাথে থাকার জন্য ধন্যবাদ।'
                    : 'আপনার ত্রুটি রিপোর্ট ও মতামত সফলভাবে গ্রহণ করা হয়েছে। আমাদের ইলমী টিম বিষয়টি যাচাই করে দ্রুত সংশোধন করবেন ইনশাআল্লাহ।'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {isMessageMode
                  ? 'আপনার পরামর্শ ও মতামত আমাদের শিক্ষামূলক উদ্যোগকে সমৃদ্ধ করতে সাহায্য করবে।'
                  : 'ইলমে দ্বীনের খিদমতে আপনার এই সতর্কতা সাদাকায়ে জারিয়াহ হিসেবে কবুল হোক। আমীন।'}
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                পড়ালেখায় ফিরে যান
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
