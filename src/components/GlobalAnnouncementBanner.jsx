import React, { useState, useEffect } from 'react';
import { 
  Megaphone, AlertCircle, Sparkles, Video, Bell, 
  ExternalLink, X, ChevronRight 
} from 'lucide-react';
import { fetchActiveAnnouncements } from '../services/announcementService';

const DISMISSED_STORAGE_KEY = 'uls_dismissed_announcements';

export default function GlobalAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DISMISSED_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const loadActiveNotices = async () => {
    try {
      const active = await fetchActiveAnnouncements();
      setAnnouncements(active || []);
    } catch (e) {
      console.warn('Failed to load active announcements:', e);
    }
  };

  useEffect(() => {
    loadActiveNotices();

    const handleUpdate = () => loadActiveNotices();
    window.addEventListener('uls_announcements_updated', handleUpdate);
    return () => window.removeEventListener('uls_announcements_updated', handleUpdate);
  }, []);

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.includes(a.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  const currentNotice = visibleAnnouncements[currentIndex % visibleAnnouncements.length];

  const handleDismiss = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const getStyle = (type) => {
    switch (type) {
      case 'urgent':
        return {
          bannerBg: 'bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 border-rose-600/40 text-rose-100',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          badgeText: 'জরুরি ঘোষণা',
          icon: AlertCircle,
          btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
        };
      case 'success':
        return {
          bannerBg: 'bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 border-emerald-600/40 text-emerald-100',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          badgeText: 'সুসংবাদ',
          icon: Sparkles,
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
        };
      case 'class':
        return {
          bannerBg: 'bg-gradient-to-r from-purple-900 via-purple-950 to-slate-950 border-purple-600/40 text-purple-100',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          badgeText: 'লাইভ ক্লাস',
          icon: Video,
          btnBg: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30'
        };
      default:
        return {
          bannerBg: 'bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-amber-600/40 text-amber-100',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          badgeText: 'নোটিশ',
          icon: Bell,
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/30 font-bold'
        };
    }
  };

  const style = getStyle(currentNotice.type);
  const IconComponent = style.icon;

  return (
    <div className={`relative z-30 border-b shadow-md transition-all duration-300 ${style.bannerBg}`}>
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Badge & Notice Content */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${style.badgeBg}`}>
            <IconComponent size={12} className="animate-pulse" />
            <span>{style.badgeText}</span>
          </span>

          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="font-bold text-white tracking-tight truncate">
              {currentNotice.title}
            </span>
            {currentNotice.message && (
              <span className="hidden md:inline text-slate-300 truncate font-normal">
                — {currentNotice.message}
              </span>
            )}
          </div>
        </div>

        {/* Right: Action Button & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {currentNotice.linkUrl && (
            <a
              href={currentNotice.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-xs ${style.btnBg}`}
            >
              <span>{currentNotice.linkText || 'বিস্তারিত'}</span>
              <ExternalLink size={11} />
            </a>
          )}

          {/* Multiple notices pagination pill */}
          {visibleAnnouncements.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length)}
              className="px-1.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
              title="পরবর্তী নোটিশ"
            >
              {(currentIndex % visibleAnnouncements.length) + 1}/{visibleAnnouncements.length}
            </button>
          )}

          {/* Close / Dismiss Button */}
          <button
            type="button"
            onClick={() => handleDismiss(currentNotice.id)}
            className="p-1 rounded-full hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="নোটিশ বন্ধ করুন"
            aria-label="Dismiss notice"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
