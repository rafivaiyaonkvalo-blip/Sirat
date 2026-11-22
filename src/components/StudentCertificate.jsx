import React, { useRef, useState } from 'react';
import { Download, Printer, Share2, Check, Sparkles, ShieldCheck, Award, ExternalLink, Lock, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/haptics';

export const CERTIFICATE_THEMES = [
  {
    id: 'emerald',
    name: 'রাজকীয় পান্না ও স্বর্ণালী',
    nameEn: 'Royal Emerald & Gold',
    primary: '#064e3b',
    secondary: '#d97706',
    accent: '#fbbf24',
    badgeBg: 'bg-emerald-800 text-amber-200',
    borderGradient: 'from-amber-500 via-yellow-400 to-emerald-700',
    cardBg: 'from-[#fdfbf7] via-[#faf7ef] to-[#f4eee1]',
    cardBorder: 'border-emerald-950/20',
    textColor: 'text-emerald-950',
    ribbonBg: 'bg-emerald-900 text-amber-200'
  },
  {
    id: 'parchment',
    name: 'ক্ল্যাসিক্যাল পার্চমেন্ট ও ক্যালিগ্রাফি',
    nameEn: 'Antique Parchment Calligraphy',
    primary: '#78350f',
    secondary: '#b45309',
    accent: '#f59e0b',
    badgeBg: 'bg-amber-900 text-amber-100',
    borderGradient: 'from-amber-700 via-amber-500 to-amber-900',
    cardBg: 'from-[#fffdfa] via-[#fcf6e8] to-[#f5ebdc]',
    cardBorder: 'border-amber-950/20',
    textColor: 'text-amber-950',
    ribbonBg: 'bg-amber-900 text-amber-100'
  },
  {
    id: 'navy',
    name: 'ইম্পেরিয়াল নেভি ও প্লাটিনাম গোল্ড',
    nameEn: 'Imperial Navy & Gold',
    primary: '#0f172a',
    secondary: '#ca8a04',
    accent: '#facc15',
    badgeBg: 'bg-slate-900 text-amber-300',
    borderGradient: 'from-amber-400 via-slate-600 to-slate-950',
    cardBg: 'from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]',
    cardBorder: 'border-slate-950/25',
    textColor: 'text-slate-950',
    ribbonBg: 'bg-slate-900 text-amber-300'
  }
];

export default function StudentCertificate({ certificateData, isPreview = false }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('emerald');

  const activeTheme = CERTIFICATE_THEMES.find(t => t.id === activeThemeId) || CERTIFICATE_THEMES[0];

  const {
    volumeConfig,
    studentName,
    studentId,
    certificateId,
    grade,
    issueDateBn,
    organization,
    organizationAr,
    madrasaLocation,
    directorTitle,
    directorName,
    quranAyah
  } = certificateData;

  // কনফেটি অ্যানিমেশন ও তাকবীর ধ্বনি
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

  // উচ্চ রেজোলিউশনের (2400 x 1700 px) আল্ট্রা-শার্প PNG সনদ তৈরি
  const handleDownloadPng = async () => {
    try {
      triggerHaptic();
      setDownloading(true);
      fireCelebration();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 1200;
      const height = 850;
      const scale = 2; // Ultra High-DPI 2x Retina scale (2400x1700)
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // থিম কালারসমূহ
      let bgGradStart = '#fbfaf5';
      let bgGradMid = '#f7f4ea';
      let bgGradEnd = '#f3ede0';
      let outerBorder = '#d97706';
      let midBorder = '#fbbf24';
      let innerBorder = '#064e3b';
      let headerText = '#064e3b';
      let ribbonBg = '#064e3b';
      let ribbonText = '#fef3c7';
      let titleArColor = '#b45309';

      if (activeThemeId === 'parchment') {
        bgGradStart = '#fffdfa';
        bgGradMid = '#fcf6e8';
        bgGradEnd = '#f5ebdc';
        outerBorder = '#854d0e';
        midBorder = '#f59e0b';
        innerBorder = '#78350f';
        headerText = '#78350f';
        ribbonBg = '#78350f';
        ribbonText = '#fef3c7';
        titleArColor = '#9a3412';
      } else if (activeThemeId === 'navy') {
        bgGradStart = '#ffffff';
        bgGradMid = '#f8fafc';
        bgGradEnd = '#f1f5f9';
        outerBorder = '#0f172a';
        midBorder = '#ca8a04';
        innerBorder = '#1e293b';
        headerText = '#0f172a';
        ribbonBg = '#0f172a';
        ribbonText = '#fde047';
        titleArColor = '#b45309';
      }

      // ১. ক্লাসিক ব্যাকগ্রাউন্ড
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, bgGradStart);
      bgGrad.addColorStop(0.5, bgGradMid);
      bgGrad.addColorStop(1, bgGradEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ২. গাঢ় ও স্বর্ণালী রাজকীয় ফ্রেম (Double Islamic Border)
      // বাইরের বর্ডার
      ctx.strokeStyle = outerBorder;
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // মধ্যবর্তী পাতলা সোনালী লাইন
      ctx.strokeStyle = midBorder;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      // ভেতরের বর্ডার
      ctx.strokeStyle = innerBorder;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // কোণার ইসলামিক অলংকরণ ও নকশা
      const drawCornerStar = (cx, cy) => {
        ctx.save();
        ctx.fillStyle = outerBorder;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = midBorder;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawCornerStar(40, 40);
      drawCornerStar(width - 40, 40);
      drawCornerStar(40, height - 40);
      drawCornerStar(width - 40, height - 40);

      // ৩. বিসমিল্লাহির রাহমানির রাহিম (ক্যালিগ্রাফি স্টাইল)
      ctx.textAlign = 'center';
      ctx.fillStyle = headerText;
      ctx.font = 'bold 22px "Amiri", "Scheherazade New", serif';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, 85);

      // ৪. মারকাযুল ঈমান হেডার ও পরিচয়
      ctx.fillStyle = titleArColor;
      ctx.font = 'bold 16px "Amiri", serif';
      ctx.fillText(organizationAr, width / 2, 114);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 26px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText(organization, width / 2, 146);

      ctx.fillStyle = '#1e293b';
      ctx.font = '600 14px "Hind Siliguri", sans-serif';
      ctx.fillText('অনলাইন সীরাত শিক্ষা বিভাগ • ' + madrasaLocation, width / 2, 170);

      // ৫. সার্টিফিকেটের মূল শিরোনাম
      ctx.fillStyle = titleArColor;
      ctx.font = 'bold 20px "Amiri", serif';
      ctx.fillText('شَهَادَةُ إِتْمَامِ دِرَاسَةِ السِّيرَةِ النَّبَوِيَّةِ الشَّرِيفَةِ', width / 2, 215);

      // আলংকারিক রিবন ব্যাকগ্রাউন্ড
      ctx.fillStyle = ribbonBg;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 210, 230, 420, 44, 8);
      ctx.fill();

      ctx.fillStyle = ribbonText;
      ctx.font = 'bold 21px "Hind Siliguri", sans-serif';
      ctx.fillText('প্রশংসাপত্র ও সমাপনী সনদপত্র', width / 2, 260);

      // ৬. শিক্ষার্থীর বিবরণ ও পাঠ্যক্রম স্বীকৃতি
      ctx.fillStyle = '#475569';
      ctx.font = '16px "Hind Siliguri", sans-serif';
      ctx.fillText('এই মর্মে প্রশংসাপত্র ও স্বীকৃতি প্রদান করা যাচ্ছে যে,', width / 2, 310);

      // শিক্ষার্থীর নাম (বড়, মার্জিত ও স্পষ্ট)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px "Hind Siliguri", "Segoe UI", sans-serif';
      ctx.fillText(studentName, width / 2, 360);

      // আইডি ও রোল
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
      ctx.fillText(`স্টুডেন্ট আইডি: ${studentId}`, width / 2, 386);

      // পাঠ্যক্রমের বিবরণ
      ctx.fillStyle = '#1e293b';
      ctx.font = '17px "Hind Siliguri", sans-serif';
      ctx.fillText('মারকাযুল ঈমান মাদরাসা পরিচালিত নবীজী ﷺ-এর জীবনচরিত পাঠ্যক্রম', width / 2, 425);

      ctx.fillStyle = innerBorder;
      ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
      ctx.fillText(`“${volumeConfig.bookTitle}”`, width / 2, 458);

      ctx.fillStyle = '#334155';
      ctx.font = '16px "Hind Siliguri", sans-serif';
      ctx.fillText('এর ৩২টি দারসের সকল পাঠ, পর্যালোচনা, তামরীন ও কুইজ সফলতার সাথে সম্পন্ন করেছেন।', width / 2, 492);

      // ফলাফল ও গ্রেড ব্যাজ
      ctx.fillStyle = innerBorder;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 180, 520, 360, 38, 19);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Hind Siliguri", sans-serif';
      ctx.fillText(`অর্জিত মূল্যায়ন: ${grade.gradeBn}`, width / 2, 545);

      // ৭. কুরআনের নূরানী আয়াত
      ctx.fillStyle = innerBorder;
      ctx.font = 'bold 18px "Amiri", serif';
      ctx.fillText(quranAyah.arabic, width / 2, 600);

      ctx.fillStyle = '#475569';
      ctx.font = 'italic 12px "Hind Siliguri", sans-serif';
      ctx.fillText(`“${quranAyah.bengali}” — ${quranAyah.surah}`, width / 2, 622);

      // ৮. ফুটার: মারকাযুল ঈমান সিলমোহর (বাম পাশে)
      const sealX = 180;
      const sealY = 720;
      
      // সিলমোহর সার্কেল
      ctx.save();
      ctx.fillStyle = outerBorder;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = midBorder;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 10px "Hind Siliguri", sans-serif';
      ctx.fillText('মারকাযুল ঈমান', sealX, sealY - 14);
      ctx.font = 'bold 12px "Amiri", serif';
      ctx.fillText('مَرْكَزُ الإِيمَان', sealX, sealY + 2);
      ctx.font = 'bold 8px "Hind Siliguri", sans-serif';
      ctx.fillText('অফিশিয়াল সিল', sealX, sealY + 16);
      ctx.fillText('২০২৬', sealX, sealY + 28);
      ctx.restore();

      // ফুটার: তারিখ ও ভেরিফিকেশন আইডি (মাঝখানে)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = '12px "Hind Siliguri", sans-serif';
      ctx.fillText(`সনদ প্রদানের তারিখ: ${issueDateBn}`, width / 2, 715);
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`সনদ সত্যতা যাচাই কোড: ${certificateId}`, width / 2, 735);
      ctx.font = '10px "Hind Siliguri", sans-serif';
      ctx.fillText('যাচাই করুন: markazuliman.com/sirat', width / 2, 752);

      // ফুটার: শিক্ষকের স্বাক্ষর (ডান পাশে)
      const sigX = width - 180;
      const sigY = 715;

      ctx.strokeStyle = innerBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sigX - 90, sigY);
      ctx.lineTo(sigX + 90, sigY);
      ctx.stroke();

      ctx.fillStyle = innerBorder;
      ctx.font = 'italic 16px "Segoe Script", cursive';
      ctx.fillText('M. Abdul Hakim', sigX, sigY - 10);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
      ctx.fillText(directorName, sigX, sigY + 18);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "Hind Siliguri", sans-serif';
      ctx.fillText(directorTitle, sigX, sigY + 34);

      // প্রিভিউ ওয়াটারমার্ক (যদি এখনো পূর্ণ আনলক না হয়)
      if (isPreview) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.font = 'bold 70px "Hind Siliguri", sans-serif';
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

  // প্রিন্ট হ্যান্ডলার
  const handlePrint = () => {
    triggerHaptic();
    window.print();
  };

  // শেয়ার হ্যান্ডলার
  const handleShare = async () => {
    triggerHaptic();
    const shareUrl = 'https://www.markazuliman.com/sirat';
    const text = `আলহামদুলিল্লাহ! মারকাযুল ঈমানের 'সীরাত' অনলাইন প্ল্যাটফর্মে নবীজী ﷺ-এর জীবনী নিয়ে ৩২টি দারস সফলতার সাথে সম্পন্ন করে আমি সনদপত্র অর্জন করেছি! আপনিও শুরু করুন: ${shareUrl}`;

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
      {/* থিম ও ডিজাইন সিলেক্টর বার */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Palette size={15} className="text-amber-500" />
          <span>সনদের ডিজাইন নির্বাচন করুন:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {CERTIFICATE_THEMES.map((th) => {
            const isActive = th.id === activeThemeId;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setActiveThemeId(th.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.primary }} />
                <span>{th.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* অ্যাকশন বাটনসমূহ (ডাউনলোড, প্রিন্ট, শেয়ার) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {!isPreview ? (
            <>
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={downloading}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-60"
              >
                <Download size={16} />
                <span>{downloading ? 'সনদ তৈরি হচ্ছে...' : 'সনদ ডাউনলোড করুন (HD PNG)'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="সরাসরি প্রিন্ট করুন (A4 ল্যান্ডস্কেপ)"
              >
                <Printer size={16} />
                <span className="hidden sm:inline">প্রিন্ট</span>
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

      {/* সার্টিফিকেট প্রিভিউ কার্ড (Responsive Islamic Frame) */}
      <div className={`relative p-1 rounded-3xl bg-gradient-to-br ${activeTheme.borderGradient} shadow-xl overflow-hidden print:p-0 print:shadow-none transition-all duration-300`}>
        <div className={`relative p-5 sm:p-8 rounded-[22px] bg-gradient-to-b ${activeTheme.cardBg} text-slate-900 border-4 ${activeTheme.cardBorder} shadow-inner select-none print:border-none print:rounded-none`}>
          {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক (মারকাযুল ঈমান সিলমোহর) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden">
            <div className="w-[450px] h-[450px] rounded-full border-[25px] border-emerald-950 flex items-center justify-center">
              <span className="text-8xl font-black font-arabic">مَرْكَز</span>
            </div>
          </div>

          {/* প্রিভিউ ওয়াটারমার্ক ব্যাজ (যদি আনলক বাকি থাকে) */}
          {isPreview && (
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-800 border border-amber-500/40 shadow-xs">
                প্রিভিউ কপি
              </span>
            </div>
          )}

          {/* বিসমিল্লাহ */}
          <div className="text-center mb-1">
            <p className="font-arabic font-bold text-base sm:text-lg tracking-wider" style={{ color: activeTheme.primary }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>

          {/* মারকাযুল ঈমান হেডার */}
          <div className="text-center space-y-0.5 mb-4">
            <p className="font-arabic font-bold text-xs sm:text-sm text-amber-700">
              {organizationAr}
            </p>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {organization}
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold" style={{ color: activeTheme.primary }}>
              অনলাইন সীরাত শিক্ষা বিভাগ • {madrasaLocation}
            </p>
          </div>

          {/* সনদপত্র ব্যানার */}
          <div className="text-center mb-4">
            <p className="font-arabic font-bold text-xs sm:text-sm text-amber-800">
              شَهَادَةُ إِتْمَامِ دِرَاسَةِ السِّيرَةِ النَّبَوِيَّةِ الشَّرِيفَةِ
            </p>
            <div className={`inline-block mt-1 px-6 py-1.5 rounded-lg ${activeTheme.ribbonBg} shadow-sm`}>
              <h2 className="text-sm sm:text-base font-black tracking-wide">
                প্রশংসাপত্র ও সমাপনী সনদপত্র
              </h2>
            </div>
          </div>

          {/* প্রাপক ও স্বীকৃতির বিবরণ */}
          <div className="text-center space-y-2 mb-4">
            <p className="text-xs sm:text-sm text-slate-600">
              এই মর্মে প্রশংসাপত্র ও স্বীকৃতি প্রদান করা যাচ্ছে যে,
            </p>
            <h3 className="text-xl sm:text-3xl font-black underline decoration-amber-500/40 decoration-2 underline-offset-8" style={{ color: activeTheme.primary }}>
              {studentName}
            </h3>
            <p className="text-[11px] font-mono font-bold text-slate-500 pt-1">
              স্টুডেন্ট আইডি: {studentId}
            </p>
          </div>

          <div className="text-center space-y-1 max-w-xl mx-auto mb-4">
            <p className="text-xs sm:text-sm text-slate-700">
              মারকাযুল ঈমান মাদরাসা পরিচালিত নবীজী ﷺ-এর জীবনচরিত পাঠ্যক্রম
            </p>
            <p className="text-sm sm:text-base font-black text-slate-900">
              “{volumeConfig.bookTitle}”
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              এর ৩২টি দারসের সকল পাঠ, পর্যালোচনা, তামরীন ও কুইজ সফলতার সাথে সম্পন্ন করেছেন।
            </p>
          </div>

          {/* ফলাফল গ্রেড পিল */}
          <div className="text-center mb-5">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-white text-xs sm:text-sm font-bold shadow-xs" style={{ backgroundColor: activeTheme.primary }}>
              <Award size={15} className="text-amber-300" />
              <span>অর্জিত মূল্যায়ন: {grade.gradeBn}</span>
            </span>
          </div>

          {/* কুরআনের আয়াত */}
          <div className="text-center px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-md mx-auto mb-6">
            <p className="font-arabic font-bold text-xs sm:text-sm" dir="rtl" style={{ color: activeTheme.primary }}>
              {quranAyah.arabic}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-600 italic mt-0.5">
              “{quranAyah.bengali}” — {quranAyah.surah}
            </p>
          </div>

          {/* ফুটার সিলমোহর ও স্বাক্ষর */}
          <div className="pt-3 border-t border-amber-600/30 grid grid-cols-3 items-center text-center gap-2">
            {/* সিলমোহর */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-200 flex flex-col items-center justify-center text-amber-50">
                  <span className="text-[8px] sm:text-[9px] font-bold">মারকাযুল ঈমান</span>
                  <span className="font-arabic text-[9px] sm:text-[10px] font-bold">مَرْكَز الإِيمَان</span>
                  <span className="text-[7px] sm:text-[8px]">অফিশিয়াল সিল</span>
                </div>
              </div>
            </div>

            {/* তারিখ ও ভেরিফিকেশন আইডি */}
            <div className="space-y-0.5 text-slate-500">
              <p className="text-[10px] sm:text-xs font-semibold">
                ইস্যুর তারিখ: {issueDateBn}
              </p>
              <p className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-600">
                আইডি: {certificateId}
              </p>
              <p className="text-[9px] font-medium" style={{ color: activeTheme.primary }}>
                markazuliman.com/sirat
              </p>
            </div>

            {/* শিক্ষকের স্বাক্ষর */}
            <div className="flex flex-col items-center">
              <div className="w-24 sm:w-32 border-b-2 pb-0.5 mb-1" style={{ borderColor: activeTheme.primary }}>
                <span className="font-serif italic text-sm sm:text-base" style={{ color: activeTheme.primary }}>
                  M. Abdul Hakim
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-800">
                {directorName}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500">
                {directorTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
