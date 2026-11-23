import React, { useRef, useState } from 'react';
import { Download, Printer, Share2, Check, Sparkles, Award, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';
import { getAssetUrl } from '../utils/assetHelper';

// ইউজারের পছন্দ অনুযায়ী অফিসিয়াল সনদ: ইম্পেরিয়াল নেভি ও প্লাটিনাম গোল্ড (A4 Landscape)
export const CERTIFICATE_THEME = {
  id: 'navy',
  name: 'ইম্পেরিয়াল নেভি ও প্লাটিনাম গোল্ড',
  primary: '#0f172a',
  secondary: '#ca8a04',
  accent: '#facc15',
  badgeBg: 'bg-slate-900 text-amber-300',
  borderGradient: 'from-amber-400 via-slate-600 to-slate-950',
  cardBg: 'from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]',
  cardBorder: 'border-slate-950/25',
  textColor: 'text-slate-950',
  ribbonBg: 'bg-slate-900 text-amber-300'
};

export default function StudentCertificate({ certificateData, isPreview = false }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeTheme = CERTIFICATE_THEME;

  const {
    volumeConfig,
    studentName,
    studentId,
    certificateId,
    grade,
    issueDateBn,
    organization,
    organizationAr,
    directorTitle,
    directorName,
    quranAyah
  } = certificateData;

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: [activeTheme.primary, activeTheme.secondary, activeTheme.accent, '#ffffff', '#10b981']
      });
    } catch {}
  };

  // উচ্চ রেজোলিউশনের (২৮২৮ x ২০০০ px - A4 Landscape ৩০০০ ডিপিআই) আল্ট্রা-শার্প PNG সনদ তৈরি
  const handleDownloadPng = async () => {
    try {
      triggerHaptic();
      setDownloading(true);
      fireCelebration();

      // লোগো লোড
      const loadImg = (src) => new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

      const dawahLogo = await loadImg(getAssetUrl('/logos/dawah_logo.png'));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // A4 Landscape Dimensions: 1414 x 1000 (Scale 2x = 2828 x 2000 px)
      const width = 1414;
      const height = 1000;
      const scale = 2;
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // থিম কালারসমূহ (ইম্পেরিয়াল নেভি ও গোল্ড)
      const bgGradStart = '#ffffff';
      const bgGradMid = '#f8fafc';
      const bgGradEnd = '#f1f5f9';
      const outerBorder = '#0f172a';
      const midBorder = '#ca8a04';
      const innerBorder = '#1e293b';
      const headerText = '#0f172a';
      const ribbonBg = '#0f172a';
      const ribbonText = '#fde047';
      const titleArColor = '#b45309';

      // ১. ব্যাকগ্রাউন্ড
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, bgGradStart);
      bgGrad.addColorStop(0.5, bgGradMid);
      bgGrad.addColorStop(1, bgGradEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ২. গাঢ় ও স্বর্ণালী রাজকীয় ফ্রেম (Double Islamic Border)
      ctx.strokeStyle = outerBorder;
      ctx.lineWidth = 16;
      ctx.strokeRect(24, 24, width - 48, height - 48);

      ctx.strokeStyle = midBorder;
      ctx.lineWidth = 3;
      ctx.strokeRect(38, 38, width - 76, height - 76);

      ctx.strokeStyle = innerBorder;
      ctx.lineWidth = 5;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // কোণার ইসলামিক অলংকরণ
      const drawCornerStar = (cx, cy) => {
        ctx.save();
        ctx.fillStyle = outerBorder;
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = midBorder;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawCornerStar(48, 48);
      drawCornerStar(width - 48, 48);
      drawCornerStar(48, height - 48);
      drawCornerStar(width - 48, height - 48);

      // ৩. বিসমিল্লাহির রাহমানির রাহিম
      ctx.textAlign = 'center';
      ctx.fillStyle = headerText;
      ctx.font = 'bold 24px "Amiri", "Scheherazade New", serif';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, 95);

      // ৪. মারকাযুল ঈমান মাদরাসা হেডার (সঠিক আরবি ও বাংলা)
      ctx.fillStyle = titleArColor;
      ctx.font = 'bold 20px "Amiri", serif';
      ctx.fillText(organizationAr, width / 2, 128);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText(organization, width / 2, 165);

      // ৫. সার্টিফিকেটের মূল শিরোনাম
      ctx.fillStyle = titleArColor;
      ctx.font = 'bold 22px "Amiri", serif';
      ctx.fillText('شَهَادَةُ إِتْمَامِ دِرَاسَةِ السِّيرَةِ النَّبَوِيَّةِ الشَّرِيفَةِ', width / 2, 215);

      // আলংকারিক রিবন ব্যাকগ্রাউন্ড
      ctx.fillStyle = ribbonBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 240, 235, 480, 48, 10);
      ctx.fill();

      ctx.fillStyle = ribbonText;
      ctx.font = 'bold 23px "Hind Siliguri", sans-serif';
      ctx.fillText('প্রশংসাপত্র ও সমাপনী সনদপত্র', width / 2, 268);

      // ৬. শিক্ষার্থীর বিবরণ ও পাঠ্যক্রম স্বীকৃতি
      ctx.fillStyle = '#475569';
      ctx.font = '17px "Hind Siliguri", sans-serif';
      ctx.fillText('এই মর্মে প্রশংসাপত্র ও স্বীকৃতি প্রদান করা যাচ্ছে যে,', width / 2, 325);

      // শিক্ষার্থীর নাম (বড়, স্পষ্ট)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 40px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText(studentName, width / 2, 380);

      // আইডি
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 14px "Hind Siliguri", sans-serif';
      ctx.fillText(`স্টুডেন্ট আইডি: ${studentId}`, width / 2, 410);

      // পাঠ্যক্রমের বিবরণ
      ctx.fillStyle = '#1e293b';
      ctx.font = '19px "Hind Siliguri", sans-serif';
      ctx.fillText('মারকাযুল ঈমান মাদরাসা পরিচালিত নবীজী ﷺ-এর জীবনচরিত পাঠ্যক্রম', width / 2, 455);

      ctx.fillStyle = innerBorder;
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText(`“${volumeConfig.bookTitle}”`, width / 2, 492);

      ctx.fillStyle = '#334155';
      ctx.font = '17px "Hind Siliguri", sans-serif';
      ctx.fillText('এর ৩২টি দারসের সকল পাঠ, পর্যালোচনা, তামরীন ও কুইজ সফলতার সাথে সম্পন্ন করেছেন।', width / 2, 530);

      // ফলাফল ও গ্রেড ব্যাজ
      ctx.fillStyle = innerBorder;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, 560, 400, 42, 21);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 17px "Hind Siliguri", sans-serif';
      ctx.fillText(`অর্জিত মূল্যায়ন: ${grade.gradeBn}`, width / 2, 587);

      // ৭. কুরআনের নূরানী আয়াত
      ctx.fillStyle = innerBorder;
      ctx.font = 'bold 20px "Amiri", serif';
      ctx.fillText(quranAyah.arabic, width / 2, 655);

      ctx.fillStyle = '#475569';
      ctx.font = 'italic 13px "Hind Siliguri", sans-serif';
      ctx.fillText(`“${quranAyah.bengali}” — ${quranAyah.surah}`, width / 2, 680);

      // ৮. ফুটার: মারকাযুল ঈমান দাওয়াহ লোগো (বাম পাশে)
      const sealX = 220;
      const sealY = 820;
      if (dawahLogo) {
        ctx.drawImage(dawahLogo, sealX - 50, sealY - 50, 100, 100);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px "Hind Siliguri", sans-serif';
        ctx.fillText('মারকাযুল ঈমান দাওয়াহ', sealX, sealY);
      }

      // ফুটার: তারিখ ও ভেরিফিকেশন আইডি (মাঝখানে)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = '13px "Hind Siliguri", sans-serif';
      ctx.fillText(`সনদ প্রদানের তারিখ: ${issueDateBn}`, width / 2, 805);
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`সনদ সত্যতা যাচাই কোড: ${certificateId}`, width / 2, 828);
      ctx.font = '11px "Hind Siliguri", sans-serif';
      ctx.fillText('যাচাই করুন: markazuliman.com/sirat', width / 2, 848);

      // ফুটার: পরিচালকের স্বাক্ষর ও পদবি (ডান পাশে)
      const sigX = width - 220;
      const sigY = 805;

      ctx.strokeStyle = innerBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sigX - 110, sigY);
      ctx.lineTo(sigX + 110, sigY);
      ctx.stroke();

      ctx.fillStyle = innerBorder;
      ctx.font = 'bold italic 20px "Brush Script MT", "Segoe Script", cursive';
      ctx.fillText('Mufti Anisur Rahman', sigX, sigY - 12);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px "Hind Siliguri", sans-serif';
      ctx.fillText(directorName, sigX, sigY + 22);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px "Hind Siliguri", sans-serif';
      ctx.fillText(directorTitle, sigX, sigY + 42);

      // প্রিভিউ ওয়াটারমার্ক (যদি এখনো পূর্ণ আনলক না হয়)
      if (isPreview) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.font = 'bold 80px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('শিক্ষার্থী প্রিভিউ কপি', 0, 0);
        ctx.restore();
      }

      // ফাইল সেভ ও ডাউনলোড
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const safeName = studentName.replace(/\s+/g, '_');
      link.download = `Markazul_Iman_Sirat_Certificate_${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Certificate download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    triggerHaptic();
    window.print();
  };

  const handleShare = async () => {
    triggerHaptic();
    const shareUrl = 'https://www.markazuliman.com/sirat';
    const text = `আলহামদুলিল্লাহ! মারকাযুল ঈমানের 'সীরাত' অনলাইন প্ল্যাটফর্মে নবীজী ﷺ-এর পবিত্র জীবনচরিত নিয়ে ৩২টি দারস সফলতার সাথে সম্পন্ন করে আমি প্রশংসাপত্র ও সমাপনী সনদপত্র অর্জন করেছি! আপনিও শুরু করুন: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'মারকাযুল ঈমান সীরাত সনদপত্র',
          text,
          url: shareUrl
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      } catch {}
    }
  };

  return (
    <div className="space-y-4">
      {/* অ্যাকশন বাটনসমূহ (ডাউনলোড, প্রিন্ট, শেয়ার) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {!isPreview ? (
            <>
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={downloading}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60 border border-amber-500/30"
              >
                <Download size={16} />
                <span>{downloading ? 'সনদ তৈরি হচ্ছে...' : 'সনদ ডাউনলোড করুন (A4 HD PNG)'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="সরাসরি প্রিন্ট করুন (A4 ল্যান্ডস্কেপ)"
              >
                <Printer size={16} />
                <span className="hidden sm:inline">প্রিন্ট (A4)</span>
              </button>
            </>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
              <Lock size={14} className="text-amber-600 dark:text-amber-400" />
              <span>৩২টি দারস সম্পন্ন করার পূর্বে ডাউনলোড লক করা রয়েছে</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="px-3.5 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} className="text-amber-600 dark:text-amber-400" />}
          <span>{copied ? 'কপি হয়েছে!' : 'শেয়ার করুন'}</span>
        </button>
      </div>

      {/* সার্টিফিকেট প্রিভিউ কার্ড: হুবহু A4 ল্যান্ডস্কেপ অনুপাত (Aspect Ratio: 297/210 = 1.414:1) এবং রেসপনসিভ */}
      <div className="w-full overflow-x-auto pb-2 [scrollbar-width:thin]">
        <div className="min-w-[700px] max-w-4xl mx-auto aspect-[297/210] p-1.5 sm:p-2.5 rounded-3xl bg-gradient-to-br from-amber-400 via-slate-700 to-slate-950 shadow-2xl relative select-none print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none print:aspect-[297/210]">
          <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-white via-slate-50 to-slate-100 border-4 border-slate-900/30 p-4 sm:p-7 md:p-9 flex flex-col justify-between shadow-inner relative overflow-hidden print:border-none print:rounded-none">
            
            {/* ব্যাকগ্রাউন্ড নূরানী ওয়াটারমার্ক */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
              <img 
                src={getAssetUrl('/logos/dawah_logo.png')} 
                alt="" 
                className="w-[500px] h-[500px] object-contain grayscale"
              />
            </div>

            {/* প্রিভিউ ব্যাজ (যদি আনলক বাকি থাকে) */}
            {isPreview && (
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/40 shadow-xs">
                  প্রিভিউ কপি
                </span>
              </div>
            )}

            {/* শীর্ষ অংশ: বিসমিল্লাহ ও মারকাযুল ঈমান মাদরাসা */}
            <div className="text-center space-y-1">
              <p className="font-arabic font-bold text-sm sm:text-base md:text-lg text-slate-900 tracking-wider">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="font-arabic font-bold text-xs sm:text-sm text-amber-800">
                {organizationAr}
              </p>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
                {organization}
              </h1>
            </div>

            {/* সনদপত্র ব্যানার */}
            <div className="text-center my-1 sm:my-2">
              <p className="font-arabic font-bold text-[11px] sm:text-xs text-amber-800">
                شَهَادَةُ إِتْمَامِ دِرَاسَةِ السِّيرَةِ النَّبَوِيَّةِ الشَّرِيفَةِ
              </p>
              <div className="inline-block mt-1 px-5 sm:px-8 py-1 rounded-lg bg-slate-900 text-amber-300 shadow-sm border border-amber-400/40">
                <h2 className="text-xs sm:text-sm md:text-base font-black tracking-wide">
                  প্রশংসাপত্র ও সমাপনী সনদপত্র
                </h2>
              </div>
            </div>

            {/* প্রাপক ও স্বীকৃতির বিবরণ */}
            <div className="text-center space-y-1 sm:space-y-1.5">
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                এই মর্মে প্রশংসাপত্র ও স্বীকৃতি প্রদান করা যাচ্ছে যে,
              </p>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-950 underline decoration-amber-500/50 decoration-2 underline-offset-6">
                {studentName}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500">
                স্টুডেন্ট আইডি: {studentId}
              </p>
            </div>

            {/* পাঠ্যক্রম ও অর্জনের বিবরণ */}
            <div className="text-center space-y-0.5 sm:space-y-1 max-w-2xl mx-auto my-1">
              <p className="text-[11px] sm:text-xs text-slate-700">
                মারকাযুল ঈমান মাদরাসা পরিচালিত নবীজী ﷺ-এর জীবনচরিত পাঠ্যক্রম
              </p>
              <p className="text-xs sm:text-sm md:text-base font-black text-slate-950">
                “{volumeConfig.bookTitle}”
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600">
                এর ৩২টি দারসের সকল পাঠ, পর্যালোচনা, তামরীন ও কুইজ সফলতার সাথে সম্পন্ন করেছেন।
              </p>
            </div>

            {/* অর্জিত মূল্যায়ন / গ্রেড */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-slate-900 text-amber-300 text-[11px] sm:text-xs font-bold shadow-xs border border-amber-400/30">
                <Award size={14} className="text-amber-400" />
                <span>অর্জিত মূল্যায়ন: {grade.gradeBn}</span>
              </span>
            </div>

            {/* কুরআনের নূরানী আয়াত */}
            <div className="text-center px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-lg mx-auto my-1">
              <p className="font-arabic font-bold text-xs sm:text-sm text-slate-900" dir="rtl">
                {quranAyah.arabic}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 italic mt-0.5">
                “{quranAyah.bengali}” — {quranAyah.surah}
              </p>
            </div>

            {/* ফুটার: দাওয়াহ লোগো, তারিখ ও পরিচালকের স্বাক্ষর */}
            <div className="pt-2 sm:pt-3 border-t border-slate-300 grid grid-cols-3 items-center text-center gap-2">
              {/* বাম পাশ: মারকাযুল ঈমান দাওয়াহ লোগো */}
              <div className="flex flex-col items-center justify-center">
                <img 
                  src={getAssetUrl('/logos/dawah_logo.png')} 
                  alt="মারকাযুল ঈমান দাওয়াহ" 
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 object-contain drop-shadow-sm" 
                />
                <span className="text-[8px] sm:text-[9px] font-bold text-amber-900 dark:text-amber-400 mt-0.5">
                  মারকাযুল ঈমান দাওয়াহ
                </span>
              </div>

              {/* মাঝখান: তারিখ ও ভেরিফিকেশন আইডি */}
              <div className="space-y-0.5 text-slate-500">
                <p className="text-[9px] sm:text-[11px] font-semibold text-slate-600">
                  সনদ প্রদানের তারিখ: {issueDateBn}
                </p>
                <p className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-700">
                  আইডি: {certificateId}
                </p>
                <p className="text-[8px] sm:text-[9px] font-medium text-slate-500">
                  markazuliman.com/sirat
                </p>
              </div>

              {/* ডান পাশ: প্রতিষ্ঠাতার স্বাক্ষর ও পদবি */}
              <div className="flex flex-col items-center">
                <div className="w-28 sm:w-36 md:w-44 border-b-2 pb-0.5 mb-1 border-slate-900">
                  <span className="font-serif italic text-xs sm:text-sm md:text-base font-bold text-slate-950 tracking-wider">
                    Mufti Anisur Rahman
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-slate-900">
                  {directorName}
                </p>
                <p className="text-[8px] sm:text-[10px] text-slate-500 font-medium">
                  {directorTitle}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
