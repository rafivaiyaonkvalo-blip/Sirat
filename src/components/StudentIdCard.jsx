import React, { useRef, useState } from 'react';
import { Download, ShieldCheck, Share2, Check, Sparkles } from 'lucide-react';
import { getLevelInfo, toBengaliNumber } from '../utils/gamification';

export default function StudentIdCard({ user, profileData, totalXp, streakDays }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate deterministic student ID based on user UID or email
  const getStudentId = () => {
    if (!user) return 'MI-2026-AR001';
    const seed = (user.uid || user.email || 'student').replace(/[^a-zA-Z0-9]/g, '');
    const code = (seed.slice(-4) || '7860').toUpperCase();
    return `MI-2026-AR${code}`;
  };

  const studentId = getStudentId();
  const level = getLevelInfo(totalXp || 0).level;
  // আপলোড করা ছবি (data URL) কার্ডে ও PNG-তে আঁকা যায়; গুগলের ছবি শুধু কার্ডে দেখায়
  const uploadedPhoto = profileData?.photo || '';
  const avatarSrc = uploadedPhoto || user?.photoURL || '';
  const displayName = user?.displayName || profileData?.name || 'শিক্ষার্থী';
  const district = profileData?.district || 'বাংলাদেশ';
  const joinDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })
    : '২০২৬ শিক্ষাবর্ষ';

  // Native HTML5 Canvas high-resolution PNG generation
  const handleDownloadCard = async () => {
    try {
      setDownloading(true);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 2; // High-DPI 2x scale
      const width = 640;
      const height = 400;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // 1. Premium Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#064e3b'); // emerald-900
      bgGrad.addColorStop(0.5, '#022c22'); // deep emerald
      bgGrad.addColorStop(1, '#0f172a'); // slate-900
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 24);
      ctx.fill();

      // 2. Decorative Gold/Emerald Border
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(8, 8, width - 16, height - 16, 20);
      ctx.stroke();

      // Subtle inner glow border
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(14, 14, width - 28, height - 28, 16);
      ctx.stroke();

      // 3. Header Banner (Markazul Iman)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(24, 24, width - 48, 64, 14);
      ctx.fill();

      // Header Text
      ctx.fillStyle = '#fef3c7'; // amber-100
      ctx.font = 'bold 18px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText('মারকাযুল ঈমান (Markazul Iman)', 40, 50);

      ctx.fillStyle = '#93c5fd'; // emerald-300
      ctx.font = '600 13px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText('সীরাত • ডিজিটাল শিক্ষার্থী পরিচয়পত্র', 40, 72);

      // Verified Badge Pill (Top Right)
      ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
      ctx.beginPath();
      ctx.roundRect(width - 165, 36, 135, 36, 10);
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width - 165, 36, 135, 36, 10);
      ctx.stroke();

      ctx.fillStyle = '#ecfdf5';
      ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
      ctx.fillText('✓ ভেরিফাইড শিক্ষার্থী', width - 153, 59);

      // 4. Student Avatar Monogram
      const avatarX = 40;
      const avatarY = 116;
      const avatarSize = 96;

      const avatarGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
      avatarGrad.addColorStop(0, '#1d4ed8');
      avatarGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = avatarGrad;
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 18);
      ctx.fill();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 18);
      ctx.stroke();

      if (uploadedPhoto) {
        const photoImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = uploadedPhoto;
        });
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(avatarX + 2, avatarY + 2, avatarSize - 4, avatarSize - 4, 16);
        ctx.clip();
        ctx.drawImage(photoImg, avatarX + 2, avatarY + 2, avatarSize - 4, avatarSize - 4);
        ctx.restore();
      } else {
        // Monogram Letter
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        const initial = (displayName[0] || 'ত').toUpperCase();
        ctx.fillText(initial, avatarX + (avatarSize / 2), avatarY + 64);
        ctx.textAlign = 'left'; // Reset
      }

      // 5. Student Info Block
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText(displayName, 156, 142);

      // Student Meta details
      ctx.fillStyle = '#cbd5e1'; // slate-300
      ctx.font = '500 13px "Hind Siliguri", sans-serif';
      ctx.fillText(`স্টুডেন্ট আইডি:  ${studentId}`, 156, 172);
      ctx.fillText(`জেলা / শহর:  ${district}`, 156, 194);
      ctx.fillText(`যোগদান:  ${joinDate}`, 156, 216);

      // 6. Stats Highlight Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.roundRect(24, 246, width - 48, 76, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(24, 246, width - 48, 76, 14);
      ctx.stroke();

      // Stat Columns
      const colWidth = (width - 48) / 3;
      // Col 1: Total XP
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Hind Siliguri", sans-serif';
      ctx.fillText('মোট XP', 44, 272);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`⚡ ${toBengaliNumber(totalXp || 0)} XP`, 44, 302);

      // Col 2: Streak
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Hind Siliguri", sans-serif';
      ctx.fillText('স্ট্রিক', 44 + colWidth, 272);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`🔥 ${toBengaliNumber(streakDays || 1)} দিন`, 44 + colWidth, 302);

      // Col 3: Level
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Hind Siliguri", sans-serif';
      ctx.fillText('লেভেল', 44 + (colWidth * 2), 272);
      ctx.fillStyle = '#2563eb';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(String(toBengaliNumber(level)), 44 + (colWidth * 2), 302);

      // 7. Footer Attribution
      ctx.fillStyle = '#64748b';
      ctx.font = '500 11px sans-serif';
      ctx.fillText('arabic.markazuliman.com  •  মারকাযুল ঈমান মাদরাসা প্রকল্প', 40, 362);

      // 8. Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Markazul_Iman_Student_Card_${studentId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading card:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'মারকাযুল ঈমান - সীরাত',
      text: `আমি মারকাযুল ঈমান-এর "সীরাত" কোর্সের একজন নিবন্ধিত শিক্ষার্থী (আইডি: ${studentId})। আপনিও যুক্ত হোন!`,
      url: typeof window !== 'undefined' ? window.location.origin : ''
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(`$hostUrl (স্টুডেন্ট আইডি: ${studentId})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-3">
      {/* Interactive Visual ID Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950"
      >
        {/* Decorative Background Islamic Pattern Ring */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border-4 border-emerald-500/10 pointer-events-none blur-[1px]" />
        <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full border border-amber-400/20 pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-emerald-500/10 pointer-events-none blur-2xl" />

        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-300 font-extrabold text-sm sm:text-base tracking-tight">
                মারকাযুল ঈমান
              </span>
              <span className="text-[10px] text-emerald-300/80 font-medium px-1.5 py-0.5 rounded bg-white/10">
                Markazul Iman
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              সীরাত • ডিজিটাল শিক্ষার্থী পরিচয়পত্র
            </p>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold shadow-xs">
            <ShieldCheck size={13} className="text-emerald-300 shrink-0" />
            <span>ভেরিফাইড</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-4 flex items-center gap-4 relative z-10">
          {/* Avatar */}
          {avatarSrc ? (
            <img
              src={avatarSrc} 
              alt={displayName} 
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md shrink-0" 
            />
          ) : (
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white font-black text-2xl flex items-center justify-center border-2 border-amber-400/70 shadow-md shrink-0">
              {(displayName[0] || 'ত').toUpperCase()}
            </div>
          )}

          {/* Student Info */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-black text-white truncate drop-shadow-xs mb-1">
              {displayName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-300">
              <span className="font-mono text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                {studentId}
              </span>
              <span>• {district}</span>
              <span>• {joinDate}</span>
            </div>
          </div>
        </div>

        {/* Card Stats Highlights */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 relative z-10 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <span className="block text-[10px] text-slate-400 font-medium">মোট XP</span>
            <span className="font-extrabold text-xs sm:text-sm text-amber-300">⚡ {toBengaliNumber(totalXp)} XP</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <span className="block text-[10px] text-slate-400 font-medium">স্ট্রিক</span>
            <span className="font-extrabold text-xs sm:text-sm text-rose-400">🔥 {toBengaliNumber(streakDays)} দিন</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-xs">
            <span className="block text-[10px] text-slate-400 font-medium">লেভেল</span>
            <span className="font-extrabold text-xs sm:text-sm text-emerald-300">{toBengaliNumber(level)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download & Share */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownloadCard}
          disabled={downloading}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {downloading ? (
            <>
              <Sparkles size={14} className="animate-spin" />
              <span>কার্ড তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>আইডি কার্ড ডাউনলোড করুন (PNG)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shrink-0"
          title="শেয়ার করুন"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span className="hidden sm:inline">শেয়ার</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
