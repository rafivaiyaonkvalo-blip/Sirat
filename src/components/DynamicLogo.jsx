import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/assetHelper';

// The 4 Sirat logo colour variants with matching brand text colors
export const LOGO_VARIANTS = [
  {
    id: 'emerald',
    name: 'এমারেল্ড ও মিন্ট',
    src: getAssetUrl('/logos/sirat_emerald.svg'),
    glowColor: 'rgba(14,165,233, 0.45)',
    borderColor: 'border-emerald-500/40',
    textColorLight: '#334155',
    textColorDark: '#94a3b8',
    accentColor: '#475569'
  },
  {
    id: 'ocean',
    name: 'রয়্যাল ওশান ব্লু',
    src: getAssetUrl('/logos/sirat_ocean.svg'),
    glowColor: 'rgba(2, 132, 199, 0.45)',
    borderColor: 'border-sky-500/40',
    textColorLight: '#0ea5e9',
    textColorDark: '#94a3b8',
    accentColor: '#475569'
  },
  {
    id: 'gold',
    name: 'রয়্যাল গোল্ড',
    src: getAssetUrl('/logos/sirat_gold.svg'),
    glowColor: 'rgba(234, 179, 8, 0.45)',
    borderColor: 'border-amber-500/40',
    textColorLight: '#d97706',
    textColorDark: '#fbbf24',
    accentColor: '#f59e0b'
  },
  {
    id: 'indigo',
    name: 'সাফায়ার ও ইন্ডিগো',
    src: getAssetUrl('/logos/sirat_indigo.svg'),
    glowColor: 'rgba(129, 140, 248, 0.45)',
    borderColor: 'border-indigo-500/40',
    textColorLight: '#6366f1',
    textColorDark: '#a5b4fc',
    accentColor: '#818cf8'
  }
];

export default function DynamicLogo({ 
  size = 'brand', 
  className = '', 
  showGlow = true,
  interactive = true,
  updateFavicon = false,
  onVariantChange,
  onClick
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Notify parent on mount and change
  useEffect(() => {
    try {
      onVariantChange?.(LOGO_VARIANTS[currentIndex]);
    } catch (e) {
      console.warn('onVariantChange error:', e);
    }
  }, [currentIndex, onVariantChange]);

  // Cycle every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOGO_VARIANTS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Optionally update browser tab favicon dynamically
  useEffect(() => {
    if (!updateFavicon) return;
    try {
      const current = LOGO_VARIANTS[currentIndex];
      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = current.src;
    } catch (e) {
      console.warn('Favicon update error:', e);
    }
  }, [currentIndex, updateFavicon]);

  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    brand: 'w-9 h-9 sm:w-10 sm:h-10 rounded-[13px] sm:rounded-[14px]',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
    huge: 'w-32 h-32 rounded-[32px]'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.brand;
  const currentLogo = LOGO_VARIANTS[currentIndex];

  const handleNext = (e) => {
    // 1. Dispatch animation trigger event
    if (onClick) {
      onClick(e);
    } else {
      window.dispatchEvent(new CustomEvent('uls_replay_intro'));
    }

    // 2. Cycle logo color
    if (!interactive) return;
    setCurrentIndex((prev) => (prev + 1) % LOGO_VARIANTS.length);
  };

  return (
    <div 
      onClick={handleNext}
      title="কালেমা ক্যালিগ্রাফি অ্যানিমেশন দেখুন (ক্লিক করুন)"
      className={`relative inline-block cursor-pointer select-none group transition-transform duration-300 hover:scale-105 ${className}`}
      style={{
        filter: showGlow ? `drop-shadow(0 4px 10px ${currentLogo.glowColor})` : 'none',
        transition: 'filter 1s ease'
      }}
    >
      <div className={`relative overflow-hidden ${selectedSize} border ${currentLogo.borderColor} bg-slate-900 shadow-sm transition-colors duration-1000`}>
        {LOGO_VARIANTS.map((variant, idx) => (
          <img
            key={variant.id}
            src={variant.src}
            alt={variant.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
