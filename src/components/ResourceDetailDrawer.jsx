import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Star, Copy, Check, Volume2, 
  Flag, BookOpen, Sparkles, BookMarked, Info, ExternalLink,
  Layers, ArrowRight, CornerDownRight, Compass
} from 'lucide-react';
import { playArabicAudio, playBengaliAudio } from '../utils/audio';
import { analyzeSentenceTarkib, getSubtleNuances } from '../utils/tarkibHelper';
import { getSarfDataForWord } from '../utils/sarfHelper';
import { getShowEnglish } from '../utils/storage';
import { getEnglishTranslation } from '../utils/englishDictionary';

export default function ResourceDetailDrawer({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex = 0,
  totalItems = 0,
  isStarred = false,
  onToggleStar,
  onOpenReport,
  onOpenBookViewer
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tarkib' | 'sarf'
  const [selectedWordIdx, setSelectedWordIdx] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showEnglish, setShowEnglish] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglish(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  // Trigger entrance slide animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 20);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose?.();
    }, 280);
  };

  // Close on Escape & Arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev?.();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext]);

  // Reset selected word when item changes
  useEffect(() => {
    setSelectedWordIdx(null);
    setCopied(false);
  }, [item?.id]);

  if (!item) return null;

  const isTamrin = item.bookSource === 'tamrin' || item.type === 'tamrin';
  const isSentence = item.type === 'sentence' || item.type === 'dialogue' || item.type === 'phrase' || isTamrin;

  // Sarf (Verb Morphology) lookup
  const sarf = useMemo(() => {
    return getSarfDataForWord(item?.arabic, item?.bengali);
  }, [item?.arabic, item?.bengali]);

  // Tarkib analysis
  const tarkib = useMemo(() => {
    if (!item.arabic) return null;
    try {
      return analyzeSentenceTarkib(item.arabic);
    } catch (e) {
      return null;
    }
  }, [item.arabic]);

  // Subtle Nuances
  const nuances = useMemo(() => {
    if (!item.arabic) return [];
    try {
      return getSubtleNuances(item.arabic);
    } catch (e) {
      return [];
    }
  }, [item.arabic]);

  const handleCopy = () => {
    const engPart = (showEnglish && getEnglishTranslation(item, item.bengali)) ? `\n(English: ${getEnglishTranslation(item, item.bengali)})` : '';
    const textToCopy = `${item.arabic}\n${item.bengali}${engPart}${item.hint ? `\n(ইঙ্গিত: ${item.hint})` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = (arabicText) => {
    playArabicAudio(arabicText || item.arabic);
  };

  const handlePlayBengali = () => {
    if (item.bengali) {
      playBengaliAudio(item.bengali);
    }
  };

  const selectedWordInfo = selectedWordIdx !== null && tarkib?.words?.[selectedWordIdx] ? tarkib.words[selectedWordIdx] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className={`absolute inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <aside className={`w-screen max-w-lg sm:max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between pointer-events-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* 1. TOP UTILITY HEADER */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            
            {/* Left: Navigation Buttons & Counter */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={onPrev}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="পূর্ববর্তী শব্দ (Left Arrow)"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={onNext}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="পরবর্তী শব্দ (Right Arrow)"
              >
                <ChevronRight size={18} />
              </button>

              {totalItems > 0 && (
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 ml-1">
                  {currentIndex + 1} / {totalItems}
                </span>
              )}
            </div>

            {/* Right: Actions (Star, Copy, Report, Close) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onToggleStar?.(item.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isStarred
                    ? 'border-amber-300 bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:border-amber-700 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={isStarred ? 'প্রিয় তালিকা থেকে সরান' : 'প্রিয় তালিকায় যুক্ত করুন'}
              >
                <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer relative"
                title="আরবি ও বাংলা টেক্সট কপি করুন"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>

              <button
                type="button"
                onClick={() => onOpenReport?.({
                  source: 'resource_detail_drawer',
                  id: item.id,
                  arabic: item.arabic,
                  bengali: item.bengali,
                  volume: item.volume,
                  lesson: item.lesson
                })}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                title="ভুলত্রুটি রিপোর্ট করুন"
              >
                <Flag size={16} />
              </button>

              <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="বন্ধ করুন (Esc)"
              >
                <X size={19} />
              </button>
            </div>

          </div>

          {/* 2. SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* HERO WORD / SENTENCE CARD */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-emerald-950/30 border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4">
              
              {/* Type / Source Pill */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isTamrin
                    ? 'bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                    : 'bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                }`}>
                  {isTamrin ? '✍️ আত-তামরীনুল কিতাবী' : '📖 এসো আরবী শিখি'} • {item.partOfSpeech || 'শব্দভাণ্ডার'}
                </span>

                {item.task && (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700">
                    {item.task}
                  </span>
                )}
              </div>

              {/* Pure Arabic Text with Harakat */}
              <div className="py-2 text-right dir-rtl">
                <p className={`font-arabic font-bold text-slate-900 dark:text-white leading-loose select-text ${
                  (item.arabic?.length || 0) > 40
                    ? 'text-3xl sm:text-4xl'
                    : 'text-4xl sm:text-5xl'
                }`}>
                  {item.arabic}
                </p>
              </div>

              {/* Bengali & English Translation */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-100 leading-relaxed select-text">
                      {item.bengali}
                    </h3>
                    {showEnglish && getEnglishTranslation(item, item.bengali) && (
                      <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold font-sans">
                        <span className="text-[10px] uppercase font-bold opacity-75">EN</span>
                        <span>{getEnglishTranslation(item, item.bengali)}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handlePlayBengali}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="বাংলা উচ্চারণ শুনুন"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                
                {item.hint && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/50 p-2.5 rounded-xl border border-amber-200/70 dark:border-amber-800/60 mt-2.5 font-medium flex items-start gap-1.5">
                    <span className="shrink-0">💡</span>
                    <span>{item.hint}</span>
                  </p>
                )}
              </div>

              {/* Audio Controls */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(item.arabic)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 size={16} />
                  <span>আরবি উচ্চারণ শুনুন</span>
                </button>
              </div>

            </div>

            {/* TAB NAVIGATION: ওভারভিউ / তারকীব / সরফ */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-3 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 text-xs sm:text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>মৌলিক বিবরণ ও কিতাব</span>
                {activeTab === 'overview' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tarkib')}
                className={`pb-2.5 text-xs sm:text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tarkib'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles size={14} />
                <span>তারকীব ও ব্যাকরণ</span>
                {activeTab === 'tarkib' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>

              {/* TAB 3: SARF (ILLMUS SARF) */}
              {sarf && (
                <button
                  type="button"
                  onClick={() => setActiveTab('sarf')}
                  className={`pb-2.5 text-xs sm:text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'sarf'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-500 hover:text-amber-700 dark:hover:text-amber-300'
                  }`}
                >
                  <Compass size={14} className="text-amber-500" />
                  <span>ইলমুস সারফ (রূপান্তর)</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    বাব
                  </span>
                  {activeTab === 'sarf' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              )}
            </div>

            {/* TAB 1: OVERVIEW & BOOK REFERENCE */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Book & Curriculum Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-emerald-600" />
                      <span>কিতাবের উৎস ও অবস্থান</span>
                    </span>
                    {(item.page) && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        পৃষ্ঠা নং {item.page}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40">
                      <div className="text-slate-400 text-[10px] mb-0.5">মূল কিতাব</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {isTamrin ? 'আত-তামরীনুল কিতাবী' : 'এসো আরবী শিখি'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40">
                      <div className="text-slate-400 text-[10px] mb-0.5">খণ্ড / পর্ব</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.volume || `${item.volumeId || 1}ম খণ্ড`}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40">
                      <div className="text-slate-400 text-[10px] mb-0.5">অধ্যায়</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate" title={item.chapter}>
                        {item.chapter || 'সাধারণ'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/40">
                      <div className="text-slate-400 text-[10px] mb-0.5">দরস / পাঠ</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate" title={item.lesson}>
                        {item.lesson || 'পাঠ'}
                      </div>
                    </div>
                  </div>

                  {/* Direct Book Viewer Action Button */}
                  {onOpenBookViewer && (
                    <button
                      type="button"
                      onClick={() => onOpenBookViewer(isTamrin ? 'tamrin' : 'original', item.page)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-emerald-500/40 shadow-2xs"
                    >
                      <BookMarked size={15} className="text-emerald-600 dark:text-emerald-400" />
                      <span>মুদ্রিত মূল কিতাবে দেখুন ↗</span>
                    </button>
                  )}
                </div>

                {/* Quick Sarf Highlight Teaser (if verb) */}
                {sarf && (
                  <div 
                    onClick={() => setActiveTab('sarf')}
                    className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/70 cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold font-arabic text-xl shrink-0">
                        {sarf.madi[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          {sarf.baab} • {sarf.baabGroup}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          মাযী: {sarf.madi} • মুযারে': {sarf.mudari} • আমর: {sarf.amr}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      রূপান্তর দেখুন →
                    </span>
                  </div>
                )}

                {/* Grammar category badges */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info size={14} className="text-teal-600" />
                    <span>ব্যাকরণিক শ্রেণিবিভাগ</span>
                  </span>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-700">
                      পদ: {item.partOfSpeech || 'বিশেষ্য'}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/60 dark:border-slate-700">
                      ধরণ: {item.typeLabel || (isSentence ? 'বাক্য' : 'একক শব্দ')}
                    </span>
                    {item.task && (
                      <span className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200/60 dark:border-teal-800">
                        অনুশীলন: {item.task}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: TARKIB & SYNTAX BREAKDOWN */}
            {activeTab === 'tarkib' && (
              <div className="space-y-4 animate-fade-in">
                {tarkib ? (
                  <>
                    {/* Overall Structure Card */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-600" />
                        <span>বাক্যের সামগ্রিক গঠন</span>
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {tarkib.structure}
                      </h4>
                      {tarkib.nuance && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed border-t border-emerald-200/50 dark:border-emerald-800/40">
                          {tarkib.nuance}
                        </p>
                      )}
                    </div>

                    {/* Word-by-word interactive breakdown */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                        শব্দভিত্তিক তারকীব ভূমিকা (ট্যাপ করে বিস্তারিত দেখুন):
                      </span>

                      {/* Interactive Arabic Word Chips */}
                      <div className="flex flex-wrap gap-2.5 justify-end dir-rtl py-1">
                        {tarkib.words.map((w, idx) => {
                          const isSelected = selectedWordIdx === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedWordIdx(isSelected ? null : idx)}
                              className={`px-3 py-2 rounded-2xl border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40'
                              }`}
                            >
                              <span className="font-arabic font-bold text-xl sm:text-2xl block leading-tight">
                                {w.word}
                              </span>
                              <span className={`text-[10px] font-sans font-bold block mt-0.5 ${
                                isSelected ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {w.role.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Word Detail Box */}
                      {selectedWordInfo ? (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-300/60 dark:border-emerald-700/60 space-y-1.5 animate-fade-in">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-arabic font-bold text-xl text-slate-900 dark:text-white">
                              {selectedWordInfo.word}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                              {selectedWordInfo.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {selectedWordInfo.caseExplanation}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 text-center py-1">
                          যেকোনো শব্দের ব্যাকরণিক ভূমিকা ও এরাবের কারণ দেখতে উপরের শব্দটিতে ট্যাপ করুন।
                        </p>
                      )}
                    </div>

                    {/* Subtle Nuances */}
                    {nuances.length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Info size={13} />
                          <span>বিশেষ ব্যাকরণিক সূক্ষ্মতা (Nuances)</span>
                        </span>
                        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                          {nuances.map((n, i) => (
                            <li key={i} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                              <div className="flex-1">
                                {typeof n === 'object' && n !== null ? (
                                  <>
                                    {n.title && (
                                      <span className="font-semibold text-amber-900 dark:text-amber-200">
                                        {n.title}:{' '}
                                      </span>
                                    )}
                                    <span>{n.rule}</span>
                                  </>
                                ) : (
                                  <span>{n}</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                    এই একক শব্দটির জন্য আলাদা বাক্য তারকীব প্রযোজ্য নয়। মৌলিক ব্যাকরণিক তথ্যাদি ওভারভিউ ট্যাবে দেওয়া হয়েছে।
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SARF (ILLMUS SARF & VERB MORPHOLOGY) */}
            {activeTab === 'sarf' && sarf && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Baab & Root Header Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-slate-800/90 dark:to-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5">
                      <Compass size={13} />
                      <span>{sarf.baabGroup}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      ক্রিয়া: <span className="font-bold text-amber-800 dark:text-amber-300">{sarf.transitivity}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-arabic font-bold text-2xl text-slate-900 dark:text-white leading-relaxed">
                      {sarf.baabArabic}
                    </h4>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                      {sarf.baab} • মূল অক্ষর (রুট): <span className="font-arabic text-base font-bold text-slate-900 dark:text-white dir-rtl">{sarf.root}</span>
                    </p>
                  </div>

                  {sarf.summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-amber-200/60 dark:border-amber-800/50 leading-relaxed">
                      💡 {sarf.summary}
                    </p>
                  )}
                </div>

                {/* The 4 Primary Pillars: Madi, Mudari, Amr, Nahi */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block px-1">
                    প্রধান ৪টি মৌলিক রূপ (الأشكال الأربعة الأساسية):
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    {/* 1. Madi */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>المَاضِي (অতীতকাল)</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(sarf.madi)}
                          className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                          title="উচ্চারণ"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <div className="font-arabic font-bold text-2xl text-emerald-800 dark:text-emerald-300 text-right dir-rtl">
                        {sarf.madi}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {sarf.madiMeaning}
                      </div>
                    </div>

                    {/* 2. Mudari */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>المُضَارِع (বর্তমান/ভবিষ্যৎ)</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(sarf.mudari)}
                          className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                          title="উচ্চারণ"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <div className="font-arabic font-bold text-2xl text-teal-800 dark:text-teal-300 text-right dir-rtl">
                        {sarf.mudari}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {sarf.mudariMeaning}
                      </div>
                    </div>

                    {/* 3. Amr */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>الأَمْر (আদেশবাচক)</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(sarf.amr)}
                          className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                          title="উচ্চারণ"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <div className="font-arabic font-bold text-2xl text-amber-800 dark:text-amber-300 text-right dir-rtl">
                        {sarf.amr}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {sarf.amrMeaning}
                      </div>
                    </div>

                    {/* 4. Nahi */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>النَّهْي (নিষেধবাচক)</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(sarf.nahi)}
                          className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                          title="উচ্চারণ"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <div className="font-arabic font-bold text-2xl text-rose-800 dark:text-rose-300 text-right dir-rtl">
                        {sarf.nahi}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {sarf.nahiMeaning}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verbal Derivatives: Masdar, Ism Fail, Ism Maful */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block px-1">
                    উৎপন্ন রূপসমূহ (المشتقات):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Masdar */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                      <div className="text-[10px] font-bold text-slate-400">المَصْدَر (ক্রিয়ামূল)</div>
                      <div className="font-arabic font-bold text-xl text-slate-900 dark:text-white mt-1 text-right dir-rtl">
                        {sarf.masdar}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {sarf.masdarMeaning}
                      </div>
                    </div>

                    {/* Ism Fail */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                      <div className="text-[10px] font-bold text-slate-400">اِسْم الفَاعِل (কর্তৃবাচক)</div>
                      <div className="font-arabic font-bold text-xl text-slate-900 dark:text-white mt-1 text-right dir-rtl">
                        {sarf.ismFail}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {sarf.ismFailMeaning}
                      </div>
                    </div>

                    {/* Ism Maful */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                      <div className="text-[10px] font-bold text-slate-400">اِسْم المَفْعُول (কর্মবাচক)</div>
                      <div className="font-arabic font-bold text-xl text-slate-900 dark:text-white mt-1 text-right dir-rtl">
                        {sarf.ismMaful}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {sarf.ismMafulMeaning}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sarfe Saghir Flow Banner */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>সংক্ষিপ্ত গর্দান (التصريف الصغير)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(`${sarf.madi} ${sarf.mudari} ${sarf.masdar}`)}
                      className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={13} />
                      <span>একটানা শুনুন</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 text-center font-arabic font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-relaxed dir-rtl">
                    {sarf.madi} • {sarf.mudari} • {sarf.masdar.split('/')[0].trim()} • فَهُوَ {sarf.ismFail} • وَالأَمْرُ {sarf.amr} • وَالنَّهْيُ {sarf.nahi}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* 3. BOTTOM FOOTER NAVIGATION */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={onPrev}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>পূর্ববর্তী</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              বন্ধ করুন
            </button>

            <button
              type="button"
              disabled={!hasNext}
              onClick={onNext}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>পরবর্তী</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}
