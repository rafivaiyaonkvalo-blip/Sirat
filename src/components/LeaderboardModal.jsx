import React, { useState, useEffect, useTransition } from 'react';
import { 
  X, Trophy, Zap, RefreshCw, Flame, EyeOff, BookOpen
} from 'lucide-react';
import { 
  getLeaderboard, 
  getBlurMyNameSetting, 
  setBlurMyNameSetting 
} from '../utils/leaderboardManager';
import { toBengaliNumber } from '../utils/gamification';
import { triggerHaptic } from '../utils/haptics';

// ইসলামের পবিত্র মসজিদ ও ঐতিহাসিক নিদর্শনের ছবি (অটো স্লাইডশো)
const MOSQUE_BACKGROUNDS = [
  {
    id: 'madina',
    name: 'মসজিদে নববী (মদীনা মুনাওয়ারা)',
    src: '/masjid_podium_bg.jpg'
  },
  {
    id: 'makkah',
    name: 'কাবা শরীফ ও মসজিদুল হারাম (মক্কা)',
    src: '/mosque_bg_makkah.jpg'
  },
  {
    id: 'alaqsa',
    name: 'মসজিদুল আকসা (বায়তুল মুকাদ্দাস)',
    src: '/mosque_bg_alaqsa.jpg'
  },
  {
    id: 'makkah_night',
    name: 'রাতে কাবা শরীফ ও তাওয়াফ (মক্কা)',
    src: '/mosque_bg_makkah_night.jpg'
  },
  {
    id: 'medina_dome',
    name: 'মসজিদে নববীর সবুজ গম্বুজ ও চত্বর',
    src: '/mosque_bg_medina_dome.jpg'
  },
  {
    id: 'quba',
    name: 'মসজিদে কুবা (মদীনা মুনাওয়ারা)',
    src: '/mosque_bg_quba.jpg'
  },
  {
    id: 'sheikh_zayed',
    name: 'শাইখ জায়েদ গ্র্যান্ড মসজিদ',
    src: '/mosque_bg_sheikh_zayed.jpg'
  },
  {
    id: 'blue_mosque',
    name: 'সুলতান আহমেদ মসজিদ (ব্লু মস্ক)',
    src: '/mosque_bg_blue_mosque.jpg'
  },
  {
    id: 'islamic_arch',
    name: 'ঐতিহাসিক ইসলামিক স্থাপত্য ও খিলান',
    src: '/mosque_bg_islamic_arch.jpg'
  }
];

export default function LeaderboardModal({ isOpen, onClose, user }) {
  const [timeframe, setTimeframe] = useState('today'); // 'today' | 'week' | 'all'
  const [data, setData] = useState({ items: [], currentUser: null, totalParticipants: 0, activeParticipants: 0 });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isBlurName, setIsBlurName] = useState(() => getBlurMyNameSetting());
  const [bgIndex, setBgIndex] = useState(() => Math.floor(Math.random() * MOSQUE_BACKGROUNDS.length));

  // ছবি যেন স্বয়ংক্রিয়ভাবে (Auto-slide) পরিবর্তিত হয় প্রতি ৪.৫ সেকেন্ড পর পর
  useEffect(() => {
    if (!isOpen) return;
    const autoSlideTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % MOSQUE_BACKGROUNDS.length);
    }, 4500);
    return () => clearInterval(autoSlideTimer);
  }, [isOpen]);

  const handleToggleBlurName = async () => {
    triggerHaptic();
    const nextVal = !isBlurName;
    setIsBlurName(nextVal);
    await setBlurMyNameSetting(nextVal);
    loadData(timeframe, true);
  };

  const loadData = async (tf = timeframe, force = false) => {
    setLoading(true);
    try {
      const res = await getLeaderboard(tf, force);
      startTransition(() => {
        setData(res);
      });
    } catch (err) {
      console.warn('Leaderboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData(timeframe, false);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, timeframe]);

  if (!isOpen) return null;

  const topThree = data.items.slice(0, 3);
  const restOfList = data.items.slice(3);

  // পডিয়াম কার্ড কম্পোনেন্ট
  const renderPodiumCard = (entry, place) => {
    if (!entry) return null;

    const isFirst = place === 1;
    const isSecond = place === 2;
    const isThird = place === 3;

    const ringColor = entry.isCurrentUser
      ? 'ring-emerald-400 border-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.7)]'
      : isFirst 
        ? 'ring-amber-400 border-amber-300 bg-amber-500/10' 
        : isSecond 
          ? 'ring-slate-300 border-slate-200 bg-slate-400/10' 
          : 'ring-amber-700/60 border-amber-700/40 bg-amber-800/10';

    const badgeGradient = isFirst
      ? 'from-amber-400 to-yellow-500 text-amber-950'
      : isSecond
        ? 'from-slate-200 to-slate-400 text-slate-900'
        : 'from-amber-600 to-amber-700 text-amber-50';

    const heightClass = isFirst ? 'h-50 sm:h-54 z-10' : 'h-44 sm:h-48';
    const placeBadge = isFirst ? '১ম' : isSecond ? '২য়' : '৩য়';

    const rawName = entry.name || (entry.isCurrentUser ? 'আমার প্রোফাইল' : 'শিক্ষার্থী');
    const isEntryBlurred = entry.isCurrentUser ? isBlurName : Boolean(entry.hideName);
    const displayName = rawName;

    return (
      <div 
        key={entry.uid}
        className={`flex-1 flex flex-col items-center justify-end ${heightClass} relative transition-all duration-300`}
      >
        {/* Avatar: ছবি থাকলে আসল ছবি, ফাঁকা থাকলে মদীনা শরীফের ছবি */}
        <div className="relative mb-2">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 sm:ring-4 ${ringColor} p-0.5 flex items-center justify-center bg-white dark:bg-slate-800 shadow-lg overflow-hidden`}>
            <img 
              src={entry.photoURL || '/madina.jpg'} 
              alt="" 
              className="w-full h-full rounded-full object-cover" 
            />
          </div>

          {/* Place Badge Pill */}
          <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full text-[10px] font-black shadow-md bg-gradient-to-r ${badgeGradient}`}>
            {placeBadge}
          </div>
        </div>

        {/* Name: সম্পূর্ণ নাম ব্লার (যখন ব্লার সক্রিয়) */}
        <div className="w-full px-1 text-center mt-1 flex flex-col items-center">
          <span 
            className={`text-xs sm:text-sm font-bold truncate block max-w-[95px] sm:max-w-[120px] mx-auto transition-all ${
              entry.isCurrentUser
                ? 'text-emerald-300 font-black drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]'
                : 'text-white drop-shadow-md'
            }`} 
            style={isEntryBlurred ? { filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' } : undefined}
            title={isEntryBlurred ? '' : displayName}
          >
            {displayName}
          </span>

          {/* নিজের প্রোফাইল চেনার জন্য বিশেষ ব্যাজ / চিহ্ন */}
          {entry.isCurrentUser && (
            <span className="inline-flex items-center gap-0.5 mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 border border-emerald-300 shadow-sm animate-pulse">
              ● আমি
            </span>
          )}
        </div>

        {/* Level & Score (১ম, ২য়, ৩য় দের লেভেল ও XP প্রদর্শন) */}
        <div className="mt-1 flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.2 rounded-full border border-emerald-500/35 backdrop-blur-xs">
            লেভেল {toBengaliNumber(entry.level)}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/85 border border-slate-700/80 shadow-xs backdrop-blur-xs">
            <Zap size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] sm:text-xs font-black text-amber-200">
              {entry.scoreBn} XP
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-xs text-emerald-600 dark:text-emerald-400 select-none"
              title="ইলমে দ্বীন ও আরবী ভাষা চর্চা"
            >
              <BookOpen size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                লিডারবোর্ড
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* নাম ব্লার অপশন বাটন */}
            <button
              type="button"
              onClick={handleToggleBlurName}
              title={isBlurName ? 'নাম ব্লার চালু আছে (অন্যদের কাছে আপনার নাম গোপন)' : 'নাম ব্লার করুন (অন্যদের কাছে নিজের নাম গোপন রাখতে ট্যাপ করুন)'}
              className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isBlurName
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <EyeOff size={13} className={isBlurName ? 'text-emerald-600 dark:text-emerald-400' : ''} />
              <span>{isBlurName ? 'নাম ব্লার: চালু' : 'নাম ব্লার'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                loadData(timeframe, true);
              }}
              title="নতুন করে লোড করুন"
              disabled={loading}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-600' : ''} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Timeframe Filter Tabs (আজকের | সাপ্তাহিক | সর্বমোট) */}
        <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 gap-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setTimeframe('today');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              আজকের
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setTimeframe('week');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'week'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সাপ্তাহিক
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setTimeframe('all');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'all'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সর্বমোট
            </button>
          </div>
        </div>

        {/* Scrollable Content: Podium + List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 [scrollbar-width:thin]">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw size={24} className="animate-spin text-emerald-600" />
              <span className="text-xs font-medium">লিডারবোর্ড প্রস্তুত হচ্ছে...</span>
            </div>
          ) : data.items.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Trophy size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                এখনো কোনো স্কোর নেই
              </p>
              <p className="text-xs text-slate-400 mt-1">
                দারস ও তামরীন অনুশীলন করে পয়েন্ট অর্জন করুন।
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium (২য়, ১ম, ৩য় বিন্যাস) with Real Changeable Islamic Mosques Background */}
              {topThree.length > 0 && (
                <div className="relative pt-4 pb-3 px-2 rounded-3xl border border-emerald-500/35 overflow-hidden shadow-inner bg-slate-950">
                  {/* Real Mosque Photograph Background with Smooth Auto-Crossfade (অটো স্লাইডশো) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {MOSQUE_BACKGROUNDS.map((mosque, idx) => (
                      <img 
                        key={mosque.id}
                        src={mosque.src} 
                        alt={mosque.name} 
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out ${
                          idx === bgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                      />
                    ))}
                    {/* Dark gradient overlay so the Ayah, student cards, and badges are clearly readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/75" />
                  </div>

                  {/* কুরআনের আয়াত: وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ (১ম, ২য় ও ৩য়-এর উপরে) */}
                  <div className="relative z-10 text-center mb-2 px-2 pt-1">
                    <p className="font-arabic font-bold text-sm sm:text-base text-emerald-300 tracking-wide drop-shadow-md" dir="rtl">
                      وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ
                    </p>
                    <p className="text-[11px] sm:text-xs text-emerald-100/90 font-medium mt-0.5 tracking-wide drop-shadow-sm">
                      আপনার দোয়ায় আমাদের স্মরণ রাখবেন
                    </p>
                  </div>

                  <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-3">
                    {/* ২য় স্থান (বাম পাশে) */}
                    {topThree[1] ? (
                      renderPodiumCard(topThree[1], 2)
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* ১ম স্থান (মাঝখানে সবচেয়ে উঁচুতে) */}
                    {topThree[0] && renderPodiumCard(topThree[0], 1)}

                    {/* ৩য় স্থান (ডান পাশে) */}
                    {topThree[2] ? (
                      renderPodiumCard(topThree[2], 3)
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                </div>
              )}

              {/* ৪র্থ থেকে বাকিদের তালিকা */}
              {restOfList.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    <span>ক্রম ও শিক্ষার্থী</span>
                    <span>অর্জিত পয়েন্ট</span>
                  </div>

                  {restOfList.map((entry) => {
                    const rawName = entry.name || (entry.isCurrentUser ? 'আমার প্রোফাইল' : 'শিক্ষার্থী');
                    const isEntryBlurred = entry.isCurrentUser ? isBlurName : Boolean(entry.hideName);
                    const displayName = rawName;

                    return (
                      <div
                        key={entry.uid}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                          entry.isCurrentUser
                            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/40 shadow-xs'
                            : 'bg-white dark:bg-slate-800/70 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                        }`}
                      >
                        {/* বাম পাশ: র‍্যাংক নম্বর + অবতার + নাম */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Rank Badge */}
                          <div className={`w-6 text-center text-xs font-black ${
                            entry.isCurrentUser ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {entry.rankBn}
                          </div>

                          {/* Avatar / Madina Photo: ছবি থাকলে আসল ছবি, ফাঁকা থাকলে মদীনা মুনাওয়ারার ছবি */}
                          <div className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden border ${
                            entry.isCurrentUser ? 'border-emerald-500 ring-2 ring-emerald-400/50 shadow-xs' : 'border-slate-200/60 dark:border-slate-700 shadow-xs'
                          }`}>
                            <img 
                              src={entry.photoURL || '/madina.jpg'} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          </div>

                          {/* Name + Level + আমি Tag */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span 
                                className={`text-xs sm:text-sm font-bold truncate block transition-all ${
                                  entry.isCurrentUser ? 'text-emerald-700 dark:text-emerald-300 font-black' : 'text-slate-800 dark:text-slate-100'
                                }`} 
                                style={isEntryBlurred ? { filter: 'blur(6px)', userSelect: 'none', pointerEvents: 'none' } : undefined}
                                title={isEntryBlurred ? '' : displayName}
                              >
                                {displayName}
                              </span>
                              {entry.isCurrentUser && (
                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black shrink-0 shadow-xs">
                                  আমি
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>লেভেল {toBengaliNumber(entry.level)}</span>
                              {entry.streak > 1 && (
                                <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                                  <Flame size={10} className="fill-amber-500" />
                                  {toBengaliNumber(entry.streak)} দিন
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ডান পাশ: স্কোর */}
                        <div className="flex items-center gap-1 pl-2 shrink-0">
                          <Zap size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                            {entry.scoreBn}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer: Sticky Bar with Current User Rank */}
        {data.currentUser && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs">
                  {data.currentUser.rankBn}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-bold transition-all"
                      style={isBlurName ? { filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' } : undefined}
                    >
                      {data.currentUser.name || 'আমার অবস্থান'}
                    </span>
                    <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-md font-black">
                      আমি
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleBlurName}
                      className={`text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold transition-all cursor-pointer ${
                        isBlurName
                          ? 'bg-white/30 text-white ring-1 ring-white/40'
                          : 'bg-white/10 text-emerald-100 hover:bg-white/20'
                      }`}
                      title="নিজের নাম ব্লার বা দৃশ্যমান রাখুন"
                    >
                      <EyeOff size={10} />
                      <span>{isBlurName ? 'ব্লার চালু' : 'নাম ব্লার'}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-100">
                    লেভেল {toBengaliNumber(data.currentUser.level)} • {timeframe === 'today' ? 'আজকের স্কোর' : timeframe === 'week' ? 'সাপ্তাহিক স্কোর' : 'মোট স্কোর'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl">
                <Zap size={13} className="text-amber-300 fill-amber-300" />
                <span className="text-xs font-black tracking-wide">
                  {data.currentUser.scoreBn} XP
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
