import React, { useState, useEffect, useMemo } from 'react';
import { Search, Star, ChevronLeft, ChevronRight, Flag, X, RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ReportModal from './ReportModal';
import AudioButton from './AudioButton';
import MultiSelectDropdown from './MultiSelectDropdown';
import ResourceDetailDrawer from './ResourceDetailDrawer';
import { toggleStarredId, getStarredIds, getShowEnglish } from '../utils/storage';
import { getEnglishTranslation } from '../utils/englishDictionary';

import lessonsData from '../data/lessons.json';
import { volumeSourceOptions, matchVolumeItem, getAvailableChapters, getAvailableLessons, unifiedTypeOptions } from '../utils/filterUtils';

export default function VocabularyTable({ vocabulary, onOpenBookViewer, onOpenReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolumes, setSelectedVolumes] = useState(['all']);
  const [selectedChapters, setSelectedChapters] = useState(['all']);
  const [selectedLessons, setSelectedLessons] = useState(['all']);
  const [selectedPOSs, setSelectedPOSs] = useState(['all']);
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [sortBy, setSortBy] = useState('default');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [starredIds, setStarredIds] = useState(() => getStarredIds());
  const [reportingWord, setReportingWord] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showEnglish, setShowEnglish] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglish(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  const itemsPerPage = 30;

  const handleToggleStar = (id) => {
    const updated = toggleStarredId(id);
    setStarredIds(updated);
  };

  // Volume change handler with cascading reset
  const handleVolumesChange = (newVols) => {
    setSelectedVolumes(newVols);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
    setCurrentPage(1);
  };

  // Chapter change handler with cascading reset
  const handleChaptersChange = (newChs) => {
    setSelectedChapters(newChs);
    setSelectedLessons(['all']);
    setCurrentPage(1);
  };

  // Dynamic chapters based on volume and authentic Tamrin parts
  const availableChapters = useMemo(() => {
    return getAvailableChapters(selectedVolumes, lessonsData);
  }, [selectedVolumes]);

  // Dynamic lessons based on volume, chapter, and individual 111 Tamrins
  const availableLessons = useMemo(() => {
    return getAvailableLessons(selectedVolumes, selectedChapters, lessonsData);
  }, [selectedVolumes, selectedChapters]);

  // Filtered words with bidirectional Tashkeel-insensitive search
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const qStripped = q.replace(/[\u064B-\u065F\u0670\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F]/g, '');

    return vocabulary.filter(w => {
      if (onlyStarred && !starredIds.includes(w.id)) return false;

      // Synced volume & source filter
      if (!matchVolumeItem(w, selectedVolumes)) return false;

      if (selectedChapters.length > 0 && !selectedChapters.includes('all') && !selectedChapters.includes(w.chapterId)) return false;
      if (selectedLessons.length > 0 && !selectedLessons.includes('all') && !selectedLessons.includes(w.lessonId)) return false;
      if (selectedPOSs.length > 0 && !selectedPOSs.includes('all') && !selectedPOSs.includes(w.partOfSpeech)) return false;

      // Type & subType filter
      if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
        const matchType = selectedTypes.includes(w.type) || (w.subType && selectedTypes.includes(w.subType));
        if (!matchType) return false;
      }

      if (!q) return true;

      const arStripped = (w.arabic || '').replace(/[\u064B-\u065F\u0670\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F]/g, '');
      const matchBn = w.bengali?.toLowerCase().includes(q);
      const matchAr = w.arabic?.includes(q) || (arStripped && arStripped.includes(qStripped));
      const matchTask = w.task?.toLowerCase().includes(q);
      const matchHint = w.hint?.toLowerCase().includes(q);
      const matchEn = showEnglish && (
        w.english?.toLowerCase().includes(q) || 
        getEnglishTranslation(w, w.bengali)?.toLowerCase().includes(q)
      );

      return matchBn || matchAr || matchTask || matchHint || matchEn;
    });
  }, [vocabulary, searchTerm, selectedVolumes, selectedChapters, selectedLessons, selectedPOSs, selectedTypes, onlyStarred, starredIds, showEnglish]);

  // Sorting logic (সর্ট অপশন)
  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'arabic-asc') {
      return list.sort((a, b) => {
        const arA = (a.arabic || '').replace(/[\u064B-\u065F\u0670\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F]/g, '');
        const arB = (b.arabic || '').replace(/[\u064B-\u065F\u0670\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F]/g, '');
        return arA.localeCompare(arB, 'ar');
      });
    }
    if (sortBy === 'bangla-asc') {
      return list.sort((a, b) => (a.bengali || '').localeCompare(b.bengali || '', 'bn'));
    }
    if (sortBy === 'tamrin-first') {
      return list.sort((a, b) => (b.bookSource === 'tamrin' ? 1 : 0) - (a.bookSource === 'tamrin' ? 1 : 0));
    }
    if (sortBy === 'word-first') {
      return list.sort((a, b) => (b.type === 'word' ? 1 : 0) - (a.type === 'word' ? 1 : 0));
    }
    return list; // 'default'
  }, [filtered, sortBy]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const currentItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Selected item navigation in Drawer
  const currentSelectedIndex = selectedItem ? sorted.findIndex(w => w.id === selectedItem.id) : -1;
  const hasPrev = currentSelectedIndex > 0;
  const hasNext = currentSelectedIndex >= 0 && currentSelectedIndex < sorted.length - 1;

  const handlePrevItem = () => {
    if (hasPrev) setSelectedItem(sorted[currentSelectedIndex - 1]);
  };

  const handleNextItem = () => {
    if (hasNext) setSelectedItem(sorted[currentSelectedIndex + 1]);
  };

  // Quick Scope Pills (শর্টে সকল উপাদান)
  const quickTypePills = useMemo(() => {
    return [
      { id: 'all', label: 'সব উপাদান', count: vocabulary.length },
      { id: 'word', label: 'শব্দার্থ', count: vocabulary.filter(w => w.type === 'word').length },
      { id: 'sentences', label: 'বাক্য ও সংলাপ', count: vocabulary.filter(w => w.type === 'sentence' || w.type === 'dialogue' || w.type === 'phrase').length },
      { id: 'tamrin', label: 'আত-তামরীন', count: vocabulary.filter(w => w.bookSource === 'tamrin').length },
    ];
  }, [vocabulary]);

  const activePill = useMemo(() => {
    if (selectedVolumes.includes('tamrin') && selectedVolumes.length === 1) return 'tamrin';
    if (selectedTypes.includes('word') && selectedTypes.length === 1) return 'word';
    if (
      selectedTypes.includes('sentence') && 
      selectedTypes.includes('dialogue') && 
      selectedTypes.includes('phrase') && 
      selectedTypes.length === 3
    ) return 'sentences';
    if (selectedTypes.includes('tamrin') || selectedVolumes.some(v => String(v).startsWith('tamrin'))) return 'tamrin';
    if (selectedTypes.length === 0 || selectedTypes.includes('all')) return 'all';
    return null;
  }, [selectedTypes, selectedVolumes]);

  const handlePillSelect = (pillId) => {
    setCurrentPage(1);
    if (pillId === 'all') {
      setSelectedTypes(['all']);
      if (selectedVolumes.length === 1 && selectedVolumes[0] === 'tamrin') {
        setSelectedVolumes(['all']);
      }
    } else if (pillId === 'word') {
      setSelectedTypes(['word']);
    } else if (pillId === 'sentences') {
      setSelectedTypes(['sentence', 'dialogue', 'phrase']);
    } else if (pillId === 'tamrin') {
      setSelectedVolumes(['tamrin']);
      setSelectedTypes(['all']);
    }
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
    !selectedVolumes.includes('all') ||
    !selectedChapters.includes('all') ||
    !selectedLessons.includes('all') ||
    !selectedPOSs.includes('all') ||
    !selectedTypes.includes('all') ||
    sortBy !== 'default' ||
    onlyStarred
  );

  const activeAdvancedFilterCount = useMemo(() => {
    let count = 0;
    if (!selectedChapters.includes('all')) count++;
    if (!selectedLessons.includes('all')) count++;
    if (!selectedPOSs.includes('all')) count++;
    if (!selectedTypes.includes('all')) count++;
    if (sortBy !== 'default') count++;
    return count;
  }, [selectedChapters, selectedLessons, selectedPOSs, selectedTypes, sortBy]);

  const handleResetAll = () => {
    setSearchTerm('');
    setSelectedVolumes(['all']);
    setSelectedChapters(['all']);
    setSelectedLessons(['all']);
    setSelectedPOSs(['all']);
    setSelectedTypes(['all']);
    setSortBy('default');
    setOnlyStarred(false);
    setShowFilters(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            রিসোর্স ও পাঠ সম্ভার (Resource Hub & Explorer)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            মোট {sorted.length}টি উপাদান প্রদর্শিত (মূল কিতাবের শব্দ, বাক্যাংশ, পূর্ণ বাক্য ও আত-তামরীন)
          </p>
        </div>

        <button
          onClick={() => setOnlyStarred(!onlyStarred)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border cursor-pointer ${
            onlyStarred
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-600 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <Star size={16} fill={onlyStarred ? 'currentColor' : 'none'} className={onlyStarred ? 'text-amber-500' : ''} />
          <span>প্রিয় তালিকা ({starredIds.length})</span>
        </button>
      </div>

      {/* Filter & Search Hub */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        {/* Row 1: Search input + Primary Book/Source Selector + Filter Toggle + Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="শব্দ, বাক্য বা তামরীন খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-[40px] transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Volume filter */}
          <div className="w-full sm:w-52 shrink-0">
            <MultiSelectDropdown
              options={volumeSourceOptions}
              selected={selectedVolumes}
              onChange={handleVolumesChange}
              placeholder="সকল খণ্ড"
            />
          </div>

          {/* Advanced Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 h-[40px] cursor-pointer ${
              showFilters || activeAdvancedFilterCount > 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="অ্যাডভান্সড ফিল্টার"
          >
            <SlidersHorizontal size={14} />
            <span>ফিল্টার</span>
            {activeAdvancedFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-mono">
                {activeAdvancedFilterCount}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={handleResetAll}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors shrink-0 h-[40px] cursor-pointer"
              title="সকল ফিল্টার রিসেট করুন"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">রিসেট</span>
            </button>
          )}
        </div>

        {/* Row 2: Clean Category Segment Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 custom-scrollbar text-xs">
          {quickTypePills.map(pill => (
            <button
              key={pill.id}
              type="button"
              onClick={() => handlePillSelect(pill.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer border ${
                activePill === pill.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{pill.label}</span>
              <span className="ml-1.5 opacity-80 text-[10px] font-mono font-normal">({pill.count})</span>
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 animate-fade-in">
            {/* 1. Chapter filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                অধ্যায় / পর্ব
              </label>
              <MultiSelectDropdown
                options={availableChapters}
                selected={selectedChapters}
                onChange={handleChaptersChange}
                placeholder="সকল অধ্যায়"
              />
            </div>

            {/* 2. Lesson filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                পাঠ / তামরীন
              </label>
              <MultiSelectDropdown
                options={availableLessons}
                selected={selectedLessons}
                onChange={(val) => {
                  setSelectedLessons(val);
                  setCurrentPage(1);
                }}
                placeholder="সকল পাঠ"
              />
            </div>

            {/* 3. POS filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                ব্যাকরণ পদ
              </label>
              <MultiSelectDropdown
                options={[
                  { id: 'বিশেষ্য (ইসম)', label: 'বিশেষ্য (ইসম)' },
                  { id: 'বিশেষণ (সিফাত)', label: 'বিশেষণ (সিফাত)' },
                  { id: 'সর্বনাম (যমীর)', label: 'সর্বনাম (যমীর)' },
                  { id: 'ক্রিয়া (ফে\'ল)', label: 'ক্রিয়া (ফে\'ল)' },
                  { id: 'অব্যয় (হরফ)', label: 'অব্যয় (হরফ)' },
                  { id: 'আত-তামরীনুল কিতাবী', label: 'আত-তামরীনুল কিতাবী' },
                  { id: 'তারকীব (ব্যাকরণ)', label: 'তারকীব (ব্যাকরণ)' },
                ]}
                selected={selectedPOSs}
                onChange={(val) => {
                  setSelectedPOSs(val);
                  setCurrentPage(1);
                }}
                placeholder="সকল পদ"
              />
            </div>

            {/* 4. Type filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                উপাদান ধরণ
              </label>
              <MultiSelectDropdown
                options={unifiedTypeOptions}
                selected={selectedTypes}
                onChange={(val) => {
                  setSelectedTypes(val);
                  setCurrentPage(1);
                }}
                placeholder="সকল উপাদান"
                align="right"
              />
            </div>

            {/* 5. Sort selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                সাজানোর ক্রম
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500 h-[38px] transition-all cursor-pointer"
              >
                <option value="default">↕ স্বাভাবিক ক্রম</option>
                <option value="arabic-asc">↕ আরবি (أ - ي)</option>
                <option value="bangla-asc">↕ বাংলা (অ - হ)</option>
                <option value="tamrin-first">↕ তামরীন প্রথমে</option>
                <option value="word-first">↕ শব্দার্থ প্রথমে</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filter summary notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          প্রদর্শিত ফলাফল: <span className="font-bold text-slate-800 dark:text-slate-200">{sorted.length}</span> টি
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetAll}
            className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            সব ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-bold text-slate-600 dark:text-slate-400">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">আরবি বাক্য / শব্দ</th>
                <th className="py-3.5 px-4">বাংলা অর্থ ও সমাধান</th>
                <th className="py-3.5 px-4 hidden md:table-cell">ধরণ / অনুশীলন</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">উৎস, পদ ও পাঠ</th>
                <th className="py-3.5 px-4 w-24 text-center">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {currentItems.length > 0 ? (
                currentItems.map((word, idx) => {
                  const isStarred = starredIds.includes(word.id);
                  const isTamrin = word.bookSource === 'tamrin';
                  return (
                    <tr 
                      key={word.id}
                      onClick={() => setSelectedItem(word)}
                      className="hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                      title="আইটেমের বিস্তারিত বিবরণ, তারকীব ও সরফ দেখতে ক্লিক করুন"
                    >
                      <td className="py-3 px-4 text-center text-xs font-mono text-slate-400">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-arabic text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                            {word.arabic}
                          </span>
                          {word.hint && (
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              💡 ইঙ্গিত: {word.hint}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 leading-relaxed">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {word.bengali}
                        </div>
                        {showEnglish && getEnglishTranslation(word, word.bengali) && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 font-sans border border-slate-200/60 dark:border-slate-700/60">
                            {getEnglishTranslation(word, word.bengali)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell">
                        {word.task ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800 text-[11px]">
                            {word.task}
                          </span>
                        ) : word.typeLabel ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 text-[11px]">
                            {word.typeLabel}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Book Source Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isTamrin
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}>
                            {isTamrin ? '✍️ আত-তামরীন' : '📖 এসো আরবী'}
                          </span>

                          {/* Volume Badge */}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            word.volumeId === 1 || word.volume?.includes('১ম')
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : word.volumeId === 2 || word.volume?.includes('২য়') || word.volume?.includes('২য়')
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                              : 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          }`}>
                            {word.volume || `${word.volumeId}ম খণ্ড`}
                          </span>

                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {word.partOfSpeech}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {word.chapter?.split('(')[0]?.trim()} • {word.lesson}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <AudioButton text={word.arabic} size={17} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenReport) {
                                onOpenReport({
                                  source: 'vocabulary_table',
                                  id: word.id,
                                  arabic: word.arabic,
                                  bengali: word.bengali,
                                  volume: word.volume,
                                  lesson: word.lesson
                                });
                              } else {
                                setReportingWord(word);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="শব্দটিতে কোনো ভুল থাকলে রিপোর্ট করুন"
                          >
                            <Flag size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(word.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isStarred 
                                ? 'text-amber-500 hover:text-amber-600' 
                                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                            }`}
                            title="প্রিয় তালিকায় রাখুন"
                          >
                            <Star size={17} fill={isStarred ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোন শব্দ পাওয়া যায়নি। অনুসন্ধানের বানান বা ফিল্টার পরিবর্তন করুন।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              পৃষ্ঠা {currentPage} / {totalPages} (মোট {sorted.length}টি)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
          {/* Report Modal */}
      {reportingWord && (
        <ReportModal
          isOpen={Boolean(reportingWord)}
          onClose={() => setReportingWord(null)}
          context={{
            source: 'vocab',
            lessonId: reportingWord.lessonId,
            lessonTitle: `${reportingWord.volume || ''} • ${reportingWord.lesson || ''}`,
            arabic: reportingWord.arabic,
            bangla: reportingWord.bengali,
            page: reportingWord.page
          }}
        />
      )}

      {/* Item Detailed View Slide-over Drawer */}
      {selectedItem && (
        <ResourceDetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPrev={handlePrevItem}
          onNext={handleNextItem}
          hasPrev={hasPrev}
          hasNext={hasNext}
          currentIndex={currentSelectedIndex}
          totalItems={sorted.length}
          isStarred={starredIds.includes(selectedItem.id)}
          onToggleStar={handleToggleStar}
          onOpenReport={onOpenReport}
          onOpenBookViewer={onOpenBookViewer}
        />
      )}
    </div>
  );
}