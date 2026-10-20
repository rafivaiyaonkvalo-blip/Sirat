import React from 'react';
import { ArrowRight, Map as MapIcon, Zap, Target, Clock, Flame, Layers, BookOpen } from 'lucide-react';
import { Lin, Rad, usePictureIds } from './BookPicture';
import { toBengaliNumber } from '../utils/lessonSubSections';
import { getTotalXp, getLevelInfo, getStreakData } from '../utils/gamification';

// বাংলা লেখার ভেতরের আরবি অংশ আলাদা RTL স্প্যানে রাখে, যাতে "প্রশ্ন: مَا هٰذَا؟" ঠিকভাবে দেখায়
const ARABIC_RUN = /([؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿](?:[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿\s/-]*[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿])?)/u;

export function MixedText({ text }) {
  if (!text) return null;
  return text.split(ARABIC_RUN).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} dir="rtl" className="font-arabic inline-block px-0.5 text-[1.2em] leading-none align-middle">{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export function formatDurationBn(totalSec = 0) {
  const sec = Math.max(0, Math.round(totalSec));
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  if (minutes === 0) return `${toBengaliNumber(seconds)} সে.`;
  return `${toBengaliNumber(minutes)} মি. ${toBengaliNumber(seconds)} সে.`;
}

function Sparkle({ x, y, size = 8, delay = '0s', color = '#fbbf24' }) {
  const s = size;
  return (
    <path
      d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`}
      fill={color}
      className="animate-celebrate-twinkle"
      style={{ animationDelay: delay }}
    />
  );
}

// সম্পন্ন হওয়ার ৩D সবুজ টিক সিল
export function CheckSeal3D({ className = 'w-24 h-24' }) {
  const { id, u } = usePictureIds();
  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-label="সম্পন্ন">
      <defs>
        <Rad id={id('glow')} c={['#d1fae5', 'rgba(209,250,229,0.4)', 'rgba(209,250,229,0)']} cx={0.5} cy={0.5} r={0.5} />
        <Rad id={id('ring')} c={['#a7f3d0', '#6ee7b7', '#10b981']} cx={0.35} cy={0.3} r={0.85} />
        <Rad id={id('disc')} c={['#6ee7b7', '#10b981', '#047857', '#064e3b']} cx={0.35} cy={0.3} r={0.85} />
        <Lin id={id('check')} c={['#ffffff', '#ecfdf5']} dir="v" />
        <filter id={id('blur')} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <circle cx="70" cy="66" r="66" fill={u('glow')} />
      <ellipse cx="70" cy="128" rx="34" ry="6" fill="#0f172a" opacity="0.22" filter={u('blur')} />
      <circle cx="71" cy="69" r="46" fill="#065f46" />
      <circle cx="70" cy="66" r="46" fill={u('ring')} />
      <circle cx="70" cy="66" r="37" fill={u('disc')} />
      <path d="M52 67 L65 80 L90 53" stroke={u('check')} strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 50 A32 32 0 0 1 66 32" stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.45" />
      <Sparkle x={18} y={26} size={7} delay="0s" />
      <Sparkle x={124} y={22} size={9} delay="0.6s" />
      <Sparkle x={126} y={100} size={6} delay="1.1s" color="#34d399" />
      <Sparkle x={14} y={98} size={6} delay="0.3s" color="#34d399" />
    </svg>
  );
}

function LevelProgress() {
  const totalXp = getTotalXp();
  const info = getLevelInfo(totalXp);
  return (
    <div className="text-left animate-celebrate-rise" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="text-emerald-700 dark:text-emerald-300">লেভেল {toBengaliNumber(info.level)}</span>
        <span>আর {toBengaliNumber(info.remainingXp)} XP → লেভেল {toBengaliNumber(info.level + 1)}</span>
      </div>
      <div className="w-full h-2.5 mt-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
          style={{ width: `${Math.max(3, info.progressPercent)}%` }}
        />
      </div>
    </div>
  );
}

function StatChips({ chips }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 animate-celebrate-rise" style={{ animationDelay: '0.4s' }}>
      {chips.map(({ label, Icon }) => (
        <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Icon size={13} />
          {label}
        </span>
      ))}
    </div>
  );
}

// দোআর অনুরোধ
function DuaRequest() {
  return (
    <div className="animate-celebrate-rise p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60" style={{ animationDelay: '0.5s' }}>
      <p className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-100">
        আপনার দোআয় আমাকে স্মরণ রাখবেন
      </p>
      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5">
        Remember me in your dua
      </p>
    </div>
  );
}

function BonusChips({ bonuses }) {
  if (!bonuses?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 animate-celebrate-rise" style={{ animationDelay: '0.25s' }}>
      {bonuses.map(b => (
        <span key={b.label} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
          <Zap size={12} />
          {b.label} +{toBengaliNumber(b.xp)} XP
        </span>
      ))}
    </div>
  );
}

function CelebrationButtons({ primaryLabel, onPrimary, onBackToMap, qaida, onOpenQaida }) {
  return (
    <div className="space-y-2.5 animate-celebrate-rise" style={{ animationDelay: '0.6s' }}>
      {qaida && onOpenQaida && (
        <button
          type="button"
          onClick={() => onOpenQaida(qaida)}
          className="w-full py-3.5 px-4 rounded-2xl bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900/60 border-2 border-sky-300 dark:border-sky-600 text-sky-800 dark:text-sky-200 font-extrabold text-sm sm:text-base transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs hover:scale-[1.01] active:scale-[0.99]"
        >
          <BookOpen size={18} className="text-sky-600 dark:text-sky-400" />
          <span>এই পর্বের ক্বায়েদা দেখুন</span>
        </button>
      )}
      {onPrimary && (
        <button
          type="button"
          onClick={onPrimary}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <span>{primaryLabel}</span>
          <ArrowRight size={18} />
        </button>
      )}
      <button
        type="button"
        onClick={onBackToMap}
        className={`w-full rounded-2xl font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
          onPrimary
            ? 'py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            : 'py-4 text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
        }`}
      >
        <MapIcon size={16} />
        <span>ম্যাপে ফিরুন</span>
      </button>
    </div>
  );
}

function CelebrationLayout({ sealClassName, title, subtitle, xpLabel, xp, bonuses, chips, primaryLabel, onPrimary, onBackToMap, qaida, onOpenQaida }) {
  return (
    <div className="text-center py-2 space-y-4">
      <div className="animate-celebrate-pop">
        <CheckSeal3D className={`${sealClassName} mx-auto animate-celebrate-float`} />
      </div>
      <div className="animate-celebrate-rise" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>
      <div className="animate-celebrate-rise" style={{ animationDelay: '0.2s' }}>
        <span className="block text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
          +{toBengaliNumber(xp)} XP
        </span>
        {xpLabel && <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{xpLabel}</span>}
      </div>
      <BonusChips bonuses={bonuses} />
      <LevelProgress />
      <StatChips chips={chips} />
      <DuaRequest />
      <CelebrationButtons 
        primaryLabel={primaryLabel} 
        onPrimary={onPrimary} 
        onBackToMap={onBackToMap} 
        qaida={qaida} 
        onOpenQaida={onOpenQaida} 
      />
    </div>
  );
}

export function StageCompleteCard({ stageTitle, badge, xp, accuracy, timeSec, bonuses, qaida, onOpenQaida, onNext, onBackToMap }) {
  const streak = getStreakData().count || 1;
  return (
    <CelebrationLayout
      sealClassName="w-24 h-24 sm:w-28 sm:h-28"
      title="পর্ব সম্পন্ন হয়েছে!"
      subtitle={
        <>
          <MixedText text={stageTitle} />
          {badge && <span className="mx-1.5 opacity-60">•</span>}
          {badge}
        </>
      }
      xp={xp}
      bonuses={bonuses}
      chips={[
        { label: `নির্ভুলতা ${toBengaliNumber(accuracy)}%`, Icon: Target },
        { label: formatDurationBn(timeSec), Icon: Clock },
        { label: `স্ট্রিক ${toBengaliNumber(streak)} দিন`, Icon: Flame }
      ]}
      qaida={qaida}
      onOpenQaida={onOpenQaida}
      primaryLabel="পরের পর্ব"
      onPrimary={onNext}
      onBackToMap={onBackToMap}
    />
  );
}

export function DarsCompleteScreen({ lessonTitle, stageCount, totalXp, avgAccuracy, totalTimeSec, bonuses, qaida, onOpenQaida, nextLessonTitle, onNextLesson, onBackToMap }) {
  return (
    <CelebrationLayout
      sealClassName="w-28 h-28 sm:w-32 sm:h-32"
      title="আলহামদুলিল্লাহ! দারস সম্পন্ন হয়েছে!"
      subtitle={<MixedText text={lessonTitle} />}
      xp={totalXp}
      xpLabel="এই দারসে মোট"
      bonuses={bonuses}
      chips={[
        { label: `${toBengaliNumber(stageCount)}টি পর্ব`, Icon: Layers },
        { label: `নির্ভুলতা ${toBengaliNumber(avgAccuracy)}%`, Icon: Target },
        { label: formatDurationBn(totalTimeSec), Icon: Clock }
      ]}
      qaida={qaida}
      onOpenQaida={onOpenQaida}
      primaryLabel={nextLessonTitle ? 'পরের দারস শুরু করুন' : null}
      onPrimary={nextLessonTitle ? onNextLesson : null}
      onBackToMap={onBackToMap}
    />
  );
}
