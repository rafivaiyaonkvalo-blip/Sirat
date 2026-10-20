import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export const getVolumeBadgeClass = (badge) => {
  if (!badge) return '';
  const b = String(badge);
  if (b.includes('১ম') || b.includes('vol1') || b === '1') {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  }
  if (b.includes('২য়') || b.includes('২য়') || b.includes('vol2') || b === '2') {
    return 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800';
  }
  if (b.includes('৩য়') || b.includes('৩য়') || b.includes('vol3') || b === '3') {
    return 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  }
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
};

export const getGroupDotColor = (group) => {
  if (!group) return 'bg-slate-400';
  const g = String(group);
  if (g.includes('১ম') || g.includes('vol1') || g.includes('1')) return 'bg-emerald-500';
  if (g.includes('২য়') || g.includes('২য়') || g.includes('vol2') || g.includes('2')) return 'bg-sky-500';
  if (g.includes('৩য়') || g.includes('৩য়') || g.includes('vol3') || g.includes('3')) return 'bg-purple-500';
  return 'bg-slate-400';
};

export default function MultiSelectDropdown({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = 'সব',
  icon: Icon = null,
  className = '',
  searchable = true,
  align = 'left'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close when clicked outside without intercepting target clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, []);

  const isAllSelected = selected.length === 0 || selected.includes('all') || selected.length === options.length;

  const handleToggleOption = (id) => {
    if (id === 'all') {
      onChange(['all']);
      setIsOpen(false);
      return;
    }

    // Clean out 'all' if present
    const currentList = selected.filter(item => item !== 'all');
    let updated;

    if (currentList.includes(id)) {
      updated = currentList.filter(item => item !== id);
      // If none selected, default back to 'all'
      if (updated.length === 0) {
        updated = ['all'];
      }
    } else {
      updated = [...currentList, id];
      // If user selected all individual options, simplify to 'all'
      if (updated.length === options.length) {
        updated = ['all'];
      }
    }
    onChange(updated);
  };

  const handleSelectAll = () => {
    onChange(['all']);
  };

  const filteredOptions = searchable && searchQuery.trim()
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opt.badge && opt.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (opt.group && opt.group.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  // Render trigger text
  const getDisplayText = () => {
    if (isAllSelected) return placeholder;
    if (selected.length === 1) {
      const found = options.find(o => o.id === selected[0]);
      if (!found) return placeholder;
      return found.label;
    }
    const first = options.find(o => o.id === selected[0]);
    const firstLabel = first ? first.label : '';
    return `${firstLabel} (+${selected.length - 1})`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
          <span>{label}</span>
          {!isAllSelected && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
              {selected.length}টি নির্বাচিত
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left text-xs font-semibold transition-all ${
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-slate-800'
            : !isAllSelected
            ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate flex-1 min-w-0">
          {Icon && <Icon size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />}
          <span className="truncate">{getDisplayText()}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isAllSelected && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
              title="সব রিসেট করুন"
              className="p-1 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div className={`absolute z-50 mt-1.5 w-full min-w-[220px] sm:min-w-[280px] max-w-[calc(100vw-1.5rem)] sm:max-w-[360px] ${align === 'right' ? 'right-0' : 'left-0'} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 text-xs space-y-1.5 animate-fadeIn`}>
          {/* Search box if list has many options */}
          {searchable && options.length > 6 && (
            <div className="relative mb-1">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="অনুসন্ধান করুন..."
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Clean Action / Status Bar */}
          <div className="flex items-center justify-between px-2 py-1 text-[11px] border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
            <span>তালিকা থেকে পছন্দ করুন:</span>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
              মোট {options.length}টি
            </span>
          </div>

          {/* Options Scroll List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
            {/* 'All' option */}
            <div
              onClick={handleSelectAll}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer select-none transition-colors ${
                isAllSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                  isAllSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}>
                  {isAllSelected && <Check size={11} strokeWidth={3} />}
                </div>
                <span>{placeholder}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">সকল</span>
            </div>

            {/* Individual Options */}
            {filteredOptions.map((opt, index) => {
              const isChecked = !isAllSelected && selected.includes(opt.id);
              const prevOpt = index > 0 ? filteredOptions[index - 1] : null;
              const isNewGroup = opt.group && (!prevOpt || prevOpt.group !== opt.group);

              return (
                <React.Fragment key={opt.id}>
                  {isNewGroup && (
                    <div className="pt-2 pb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/80 rounded-lg my-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${getGroupDotColor(opt.group)}`} />
                        <span>{opt.group}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">
                        {filteredOptions.filter(o => o.group === opt.group).length}টি
                      </span>
                    </div>
                  )}

                  <div
                    onClick={() => handleToggleOption(opt.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer select-none transition-colors ${
                      isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 transition-all ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}>
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </div>

                      {opt.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getVolumeBadgeClass(opt.badge)}`}>
                          {opt.badge}
                        </span>
                      )}

                      <span className="truncate">{opt.label}</span>
                    </div>

                    {opt.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 shrink-0 ml-1">
                        {opt.count}
                      </span>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="text-center py-3 text-slate-400 text-xs">
                কোনো মিল পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
