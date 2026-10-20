import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playArabicAudio, playBengaliAudio } from '../utils/audio';
import { useSoundMuted } from '../utils/soundEffects';

export default function AudioButton({ text, className = '', size = 18, showLabel = false, lang = null, title = null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted] = useSoundMuted();

  const isBengali = lang === 'bn' || (/[\u0980-\u09FF]/.test(text || '') && !/[\u0600-\u06FF]/.test(text || ''));

  const handleClick = (e) => {
    e.stopPropagation();
    if (!text) return;
    if (muted) return;
    setIsPlaying(true);
    if (isBengali) {
      playBengaliAudio(text);
    } else {
      playArabicAudio(text);
    }
    setTimeout(() => setIsPlaying(false), 1400);
  };

  const defaultTitle = muted
    ? 'সাউন্ড বন্ধ আছে (উপরে স্পিকার আইকন থেকে চালু করুন)'
    : (isBengali ? 'বাংলা উচ্চারণ শুনুন (ছেলেদের কণ্ঠ)' : 'আরবি উচ্চারণ শুনুন');

  const colorClass = muted
    ? 'text-slate-400 dark:text-slate-600 opacity-60 hover:opacity-100 cursor-not-allowed'
    : (isBengali
      ? 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50'
      : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50');

  const activeClass = isBengali
    ? 'ring-2 ring-sky-500/40 bg-sky-100/50 dark:bg-sky-900/40'
    : 'ring-2 ring-emerald-500/40 bg-emerald-100/50 dark:bg-emerald-900/40';

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title || defaultTitle}
      aria-label={title || defaultTitle}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-150 active:scale-95 cursor-pointer ${colorClass} ${className} ${
        isPlaying ? activeClass : ''
      }`}
    >
      {muted ? <VolumeX size={size} /> : <Volume2 size={size} className={isPlaying ? 'animate-pulse' : ''} />}
      {showLabel && <span className="text-xs font-medium">{isBengali ? 'বাংলা' : 'শুনুন'}</span>}
    </button>
  );
}
