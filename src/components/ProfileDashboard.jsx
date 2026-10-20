import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Zap, Flame, BookOpen, Phone, MapPin, User, Edit3, Check, LogOut, Camera, Cake, Users, Heart, Lightbulb, ChevronRight, Lock, Eye, EyeOff, KeyRound, Trophy, Award } from 'lucide-react';
import { 
  saveStudentProfileToCloud, 
  updateDisplayName, 
  changePassword, 
  resetPassword,
  setPasswordForCurrentUser,
  linkGoogleAccount,
  getUserProviders
} from '../services/firebase';
import { getTotalXp, getStreakData, getLevelInfo, getXpHistory, getDateString } from '../utils/gamification';
import { toBengaliNumber } from '../utils/lessonSubSections';
import StudentIdCard from './StudentIdCard';
import StudentCertificate from './StudentCertificate';
import { getCertificateData, getVolumeProgress } from '../utils/certificateManager';
import ReportModal from './ReportModal';

const TABS = [
  { id: 'progress', label: 'অগ্রগতি' },
  { id: 'certificate', label: 'সনদপত্র 📜' },
  { id: 'card', label: 'আইডি কার্ড' },
  { id: 'info', label: 'তথ্য' }
];

const WEEKDAYS_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
const GENDER_OPTIONS = [
  { id: 'male', label: 'ছেলে' },
  { id: 'female', label: 'মেয়ে' }
];

// লক্ষ্য: একটিই — আল্লাহর জন্য
const GOAL_ID = 'for_allah';
const GOAL_LABEL = 'আল্লাহর জন্য';
const GOAL_AYAH = {
  arabic: 'قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ',
  bangla: 'বলুন, নিশ্চয়ই আমার সালাত, আমার কুরবানি (ইবাদত), আমার জীবন ও আমার মৃত্যু বিশ্বজগতের রব আল্লাহরই জন্য।',
  reference: 'সূরা আল-আনআম ৬:১৬২'
};

const PHOTO_SIZE = 256;

// প্রোফাইল থেকে ডেভেলপারকে নতুন ফিচারের পরামর্শ
const FEATURE_REQUEST_CONTEXT = { isMessage: true, category: 'feature', source: 'profile' };

export function readSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem('uls_student_profile') || '{}') || {};
  } catch {
    return {};
  }
}

function countCompletedDars() {
  try {
    const progress = JSON.parse(localStorage.getItem('uls_lessons_progress') || '{}') || {};
    return Object.values(progress).filter(p => p?.completed).length;
  } catch {
    return 0;
  }
}

function lastDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

function formatDobBn(dob) {
  if (!dob) return '';
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dob;
  return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ছবি মাঝখান থেকে বর্গাকারে কেটে ছোট JPEG বানানো (ক্লাউড প্রোফাইলে রাখার উপযোগী)
function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image failed'));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = PHOTO_SIZE;
        canvas.height = PHOTO_SIZE;
        canvas.getContext('2d').drawImage(
          img,
          (img.width - side) / 2, (img.height - side) / 2, side, side,
          0, 0, PHOTO_SIZE, PHOTO_SIZE
        );
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileAvatar({ user, photo, className = 'w-12 h-12 rounded-2xl text-lg' }) {
  const src = photo || user?.photoURL;
  if (src) {
    return <img src={src} alt="" className={`${className} object-cover ring-2 ring-emerald-500/40`} />;
  }
  return (
    <div className={`${className} bg-emerald-600 text-white flex items-center justify-center font-bold`}>
      {(user?.displayName || user?.email || 'শ')[0].toUpperCase()}
    </div>
  );
}

function ProgressTab({ totalXp, streakDays, completedDars, history, vol1Progress }) {
  const week = lastDays(7);
  const weekXp = week.map(d => history[getDateString(d)] || 0);
  const maxWeekXp = Math.max(...weekXp, 1);
  const weekTotal = weekXp.reduce((a, b) => a + b, 0);

  const tiles = [
    { label: 'মোট XP', value: toBengaliNumber(totalXp), Icon: Zap, tone: 'text-amber-500' },
    { label: 'স্ট্রিক', value: `${toBengaliNumber(streakDays)} দিন`, Icon: Flame, tone: 'text-rose-500' },
    { label: 'দারস শেষ', value: toBengaliNumber(completedDars), Icon: BookOpen, tone: 'text-emerald-500' }
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {tiles.map(({ label, value, Icon, tone }) => (
          <div key={label} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <Icon size={16} className={`mx-auto ${tone}`} />
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{value}</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white">এই সপ্তাহের XP</h4>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">মোট {toBengaliNumber(weekTotal)} XP</span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {week.map((d, i) => (
            <div key={getDateString(d)} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {weekXp[i] > 0 ? toBengaliNumber(weekXp[i]) : ''}
              </span>
              <div
                className={`w-full rounded-md ${weekXp[i] > 0 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                style={{ height: `${Math.max(6, Math.round((weekXp[i] / maxWeekXp) * 64))}px` }}
              />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{WEEKDAYS_BN[d.getDay()]}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent('uls_open_leaderboard'))}
        className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/25 hover:border-amber-500/40 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs font-bold transition-all cursor-pointer hover:bg-amber-500/15 active:scale-98 shadow-xs"
      >
        <span className="flex items-center gap-2">
          <Trophy size={15} className="text-amber-500" />
          <span>লিডারবোর্ড দেখুন</span>
        </span>
        <ChevronRight size={15} className="text-amber-600 dark:text-amber-400" />
      </button>

      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent('uls_open_certificate'))}
        className={`w-full py-2.5 px-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer active:scale-98 shadow-xs ${
          vol1Progress?.isUnlocked
            ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-500/20'
            : 'bg-slate-100/90 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60'
        }`}
      >
        <span className="flex items-center gap-2">
          {vol1Progress?.isUnlocked ? (
            <Award size={16} className="text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Lock size={15} className="text-amber-500" />
          )}
          <span>{vol1Progress?.isUnlocked ? '১ম খণ্ড সনদপত্র ও প্রশংসাপত্র' : '১ম খণ্ড সনদপত্র (লক করা)'}</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>{vol1Progress?.isUnlocked ? 'সনদ দেখুন ➔' : `বাকি ${toBengaliNumber(vol1Progress?.remainingCount || 0)}টি দারস`}</span>
        </span>
      </button>
    </div>
  );
}

function GoalAyah() {
  return (
    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-center">
      <p className="font-arabic font-bold text-xl sm:text-2xl text-emerald-900 dark:text-emerald-100 leading-loose">
        {GOAL_AYAH.arabic}
      </p>
      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
        {GOAL_AYAH.bangla}
      </p>
      <span className="inline-block mt-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
        {GOAL_AYAH.reference}
      </span>
    </div>
  );
}

function InfoTab({ user, onSaved, onError, onUserChange }) {
  const saved = useMemo(() => readSavedProfile(), []);
  const [name, setName] = useState(user?.displayName || saved.name || '');
  const [photo, setPhoto] = useState(saved.photo || '');
  const [phone, setPhone] = useState(saved.phone || '');
  const [dob, setDob] = useState(saved.dob || '');
  const [gender, setGender] = useState(saved.gender || '');
  const [district, setDistrict] = useState(saved.district || '');
  const [goal, setGoal] = useState(saved.goal === GOAL_ID ? GOAL_ID : '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!editing) {
      const fresh = readSavedProfile();
      setName(user?.displayName || fresh.name || '');
      setPhoto(fresh.photo || '');
      setPhone(fresh.phone || '');
      setDob(fresh.dob || '');
      setGender(fresh.gender || '');
      setDistrict(fresh.district || '');
      setGoal(fresh.goal === GOAL_ID ? GOAL_ID : '');
    }
  }, [user, editing]);

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError('শুধু ছবি ফাইল দিন।');
      return;
    }
    try {
      setPhoto(await resizePhoto(file));
    } catch {
      onError('ছবিটি পড়া যায়নি। অন্য একটি ছবি চেষ্টা করুন।');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      onError('নাম খালি রাখা যাবে না।');
      return;
    }
    setSaving(true);
    try {
      if (trimmedName !== (user?.displayName || '')) {
        const updatedUser = await updateDisplayName(user, trimmedName);
        if (updatedUser && onUserChange) onUserChange(updatedUser);
      }
      // আগের অন্য ঘরগুলো মুছে না ফেলে শুধু এই তথ্যগুলো বসানো হয়
      await saveStudentProfileToCloud(user, {
        ...readSavedProfile(),
        name: trimmedName,
        photo,
        phone: phone.trim(),
        dob,
        gender,
        district: district.trim(),
        goal,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      });
      setEditing(false);
      onSaved('প্রোফাইল তথ্য সংরক্ষিত হয়েছে');
    } catch {
      onError('প্রোফাইল সংরক্ষণে সমস্যা হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full pl-8 pr-3 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30';
  const labelClass = 'block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1';

  if (editing) {
    return (
      <form onSubmit={handleSave} className="space-y-3">
        <div className="flex items-center gap-3">
          <ProfileAvatar user={user} photo={photo} className="w-16 h-16 rounded-2xl text-2xl" />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 text-sm font-bold cursor-pointer"
            >
              <Camera size={15} />
              <span>{photo ? 'ছবি বদলান' : 'ছবি দিন'}</span>
            </button>
            {photo && (
              <button type="button" onClick={() => setPhoto('')} className="text-xs font-semibold text-rose-500 hover:underline text-left cursor-pointer">
                ছবি সরান
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoPick} className="hidden" />
        </div>

        <div>
          <label className={labelClass}>নাম</label>
          <div className="relative">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="আপনার নাম" maxLength={40} required className={inputClass} />
            <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className={labelClass}>মোবাইল</label>
          <div className="relative">
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="০১XXXXXXXXX" className={inputClass} />
            <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className={labelClass}>জন্মতারিখ</label>
          <div className="relative">
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={getDateString(new Date())} className={inputClass} />
            <Cake size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className={labelClass}>জেন্ডার</label>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setGender(opt.id)}
                className={`py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  gender === opt.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>জেলা</label>
          <div className="relative">
            <input type="text" value={district} onChange={e => setDistrict(e.target.value)} placeholder="ঢাকা" className={inputClass} />
            <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>আরবি শেখার লক্ষ্য</label>
          <button
            type="button"
            onClick={() => setGoal(goal === GOAL_ID ? '' : GOAL_ID)}
            className={`w-full py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
              goal === GOAL_ID
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {goal === GOAL_ID ? <Check size={15} /> : <Heart size={15} />}
            <span>{GOAL_LABEL}</span>
          </button>
          {goal === GOAL_ID && <GoalAyah />}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Check size={15} />
            <span>{saving ? 'সেভ হচ্ছে…' : 'সেভ করুন'}</span>
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold cursor-pointer"
          >
            বাতিল
          </button>
        </div>
      </form>
    );
  }

  const rows = [
    { label: 'নাম', value: user?.displayName || name, Icon: User },
    { label: 'মোবাইল', value: phone, Icon: Phone },
    { label: 'জন্মতারিখ', value: formatDobBn(dob), Icon: Cake },
    { label: 'জেন্ডার', value: GENDER_OPTIONS.find(g => g.id === gender)?.label, Icon: Users },
    { label: 'জেলা', value: district, Icon: MapPin },
    { label: 'লক্ষ্য', value: goal === GOAL_ID ? GOAL_LABEL : '', Icon: Heart }
  ];

  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
        {rows.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Icon size={13} className="text-emerald-500" />
              {label}
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[60%]">
              {value || <span className="text-slate-400 font-normal">দেওয়া হয়নি</span>}
            </span>
          </div>
        ))}
      </div>
      {goal === GOAL_ID && <GoalAyah />}
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Edit3 size={14} />
        <span>তথ্য এডিট করুন</span>
      </button>
    </div>
  );
}

const MIN_PASSWORD_LENGTH = 6;
const PW_LENGTH_MSG = `নতুন পাসওয়ার্ড অন্তত ${toBengaliNumber(MIN_PASSWORD_LENGTH)} অক্ষরের হতে হবে।`;

function passwordErrorBn(err) {
  const code = err?.code || '';
  if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'বর্তমান পাসওয়ার্ড ভুল হয়েছে।';
  if (code.includes('weak-password')) return PW_LENGTH_MSG;
  if (code.includes('too-many-requests')) return 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
  if (code.includes('requires-recent-login')) return 'নিরাপত্তার জন্য একবার লগআউট করে আবার লগইন করুন, তারপর চেষ্টা করুন।';
  if (code.includes('network')) return 'ইন্টারনেট সংযোগ পরীক্ষা করুন।';
  if (!code && err?.message) return err.message;
  return 'পাসওয়ার্ড পরিবর্তন করা যায়নি। আবার চেষ্টা করুন।';
}

// পাসওয়ার্ড ও লগইন মেথড ব্যবস্থাপনা (Google ও Password সহাবস্থান)
function PasswordSection({ user, onSaved, onError, onUserChange }) {
  const [open, setOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const { hasGoogle, hasPassword } = getUserProviders(user);

  const close = () => {
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setShow(false);
    setOpen(false);
  };

  // ইমেইল/পাসওয়ার্ড একাউন্টের পাসওয়ার্ড পরিবর্তন
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw.length < MIN_PASSWORD_LENGTH) {
      onError(PW_LENGTH_MSG);
      return;
    }
    if (newPw !== confirmPw) {
      onError('নতুন পাসওয়ার্ড দুইবার একই লিখুন।');
      return;
    }
    if (newPw === currentPw) {
      onError('নতুন পাসওয়ার্ড আগেরটি থেকে আলাদা হতে হবে।');
      return;
    }
    setBusy(true);
    try {
      await changePassword(currentPw, newPw);
      close();
      onSaved('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
    } catch (err) {
      onError(passwordErrorBn(err));
    } finally {
      setBusy(false);
    }
  };

  // Google ব্যবহারকারীদের অ্যাকাউন্টে পাসওয়ার্ড সেট করা
  const handleSetGooglePassword = async (e) => {
    e.preventDefault();
    if (newPw.length < MIN_PASSWORD_LENGTH) {
      onError(PW_LENGTH_MSG);
      return;
    }
    if (newPw !== confirmPw) {
      onError('নতুন পাসওয়ার্ড দুইবার একই লিখুন।');
      return;
    }
    setBusy(true);
    try {
      await setPasswordForCurrentUser(newPw);
      close();
      onSaved('পাসওয়ার্ড সফলভাবে সেট করা হয়েছে! এখন থেকে আপনি Google এবং পাসওয়ার্ড উভয় মাধ্যমেই একই অ্যাকাউন্টে লগইন করতে পারবেন।');
      if (typeof onUserChange === 'function') onUserChange();
    } catch (err) {
      onError(passwordErrorBn(err));
    } finally {
      setBusy(false);
    }
  };

  // পাসওয়ার্ড একাউন্টে Google লিংক করা
  const handleLinkGoogle = async () => {
    setBusy(true);
    try {
      await linkGoogleAccount(user);
      onSaved('আপনার গুগল অ্যাকাউন্ট সফলভাবে সংযুক্ত (Linked) করা হয়েছে!');
      if (typeof onUserChange === 'function') onUserChange();
    } catch (err) {
      onError(err.message || 'গুগল সংযুক্ত করতে সমস্যা হয়েছে।');
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async () => {
    setBusy(true);
    try {
      await resetPassword(user.email);
      onSaved(`${user.email} ঠিকানায় পাসওয়ার্ড রিসেটের লিঙ্ক পাঠানো হয়েছে। ইনবক্স চেক করুন।`);
    } catch (err) {
      onError(passwordErrorBn(err));
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="space-y-2">
        {/* Connected Providers Badges */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">লগইন মাধ্যম:</span>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full font-bold ${hasGoogle ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
              Google {hasGoogle ? '✅' : '❌'}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${hasPassword ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
              পাসওয়ার্ড {hasPassword ? '✅' : '❌'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <KeyRound size={14} />
          <span>{hasPassword ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'পাসওয়ার্ড সেট করুন (ম্যানুয়াল লগইনের জন্য)'}</span>
        </button>
      </div>
    );
  }

  const inputClass = 'w-full pl-8 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30';
  const field = (label, value, setValue, autoComplete) => (
    <div>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => setValue(e.target.value)}
          autoComplete={autoComplete}
          required
          className={inputClass}
        />
        <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label={show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <KeyRound size={15} className="text-emerald-500" />
          {hasPassword ? 'পাসওয়ার্ড পরিবর্তন' : 'নতুন পাসওয়ার্ড তৈরি'}
        </span>
        <button type="button" onClick={close} className="text-xs font-semibold text-slate-500 hover:underline cursor-pointer">
          বন্ধ করুন
        </button>
      </div>

      {!hasPassword && hasGoogle ? (
        // Google ইউজারদের জন্য পাসওয়ার্ড তৈরির ফর্ম
        <form onSubmit={handleSetGooglePassword} className="space-y-2.5">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
            💡 আপনি বর্তমানে <strong>Google</strong> দিয়ে প্রবেশ করেছেন। নিচে একটি পাসওয়ার্ড সেট করে রাখলে পরবর্তীতে Google ছাড়াও সরাসরি ইমেইল ও পাসওয়ার্ড দিয়ে একই অ্যাকাউন্টে ঢুকতে পারবেন।
          </p>
          {field('নতুন পাসওয়ার্ড সেট করুন (কমপক্ষে ৬ অক্ষর)', newPw, setNewPw, 'new-password')}
          {field('নতুন পাসওয়ার্ড নিশ্চিত করুন', confirmPw, setConfirmPw, 'new-password')}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Check size={15} />
            <span>{busy ? 'অপেক্ষা করুন…' : 'পাসওয়ার্ড সেট করুন'}</span>
          </button>
        </form>
      ) : (
        // স্বাভাবিক পাসওয়ার্ড পরিবর্তনের ফর্ম
        <form onSubmit={handleChangePassword} className="space-y-2.5">
          {field('বর্তমান পাসওয়ার্ড', currentPw, setCurrentPw, 'current-password')}
          {field('নতুন পাসওয়ার্ড', newPw, setNewPw, 'new-password')}
          {field('নতুন পাসওয়ার্ড আবার লিখুন', confirmPw, setConfirmPw, 'new-password')}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Check size={15} />
            <span>{busy ? 'অপেক্ষা করুন…' : 'পাসওয়ার্ড পরিবর্তন করুন'}</span>
          </button>
          {user.email && (
            <button type="button" onClick={handleForgot} disabled={busy} className="w-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline disabled:opacity-50 cursor-pointer">
              বর্তমান পাসওয়ার্ড ভুলে গেছেন? ইমেইলে রিসেট লিঙ্ক পাঠান
            </button>
          )}

          {!hasGoogle && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleLinkGoogle}
                disabled={busy}
                className="w-full py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🌐 এই অ্যাকাউন্টের সাথে Google লিঙ্ক করুন</span>
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default function ProfileDashboard({ user, loading, onLogout, onSaved, onError, onUserChange }) {
  const [tab, setTab] = useState('progress');
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    const handleProgressChange = () => {
      setProgressTick(t => t + 1);
    };
    window.addEventListener('uls_progress_changed', handleProgressChange);
    return () => window.removeEventListener('uls_progress_changed', handleProgressChange);
  }, []);

  const totalXp = useMemo(() => getTotalXp(), [progressTick]);
  const streakDays = useMemo(() => getStreakData().count || 1, [progressTick]);
  const history = useMemo(() => getXpHistory(), [progressTick]);
  const completedDars = useMemo(() => countCompletedDars(), [progressTick]);
  const levelInfo = getLevelInfo(totalXp);
  const profile = useMemo(() => readSavedProfile(), [progressTick]);
  const vol1Progress = useMemo(() => getVolumeProgress('vol1'), [progressTick]);
  const certData = useMemo(() => getCertificateData(user, profile, 'vol1'), [user, profile, progressTick]);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);


  const tabsList = useMemo(() => [
    { id: 'progress', label: 'অগ্রগতি' },
    { id: 'certificate', label: vol1Progress.isUnlocked ? 'সনদপত্র 📜' : 'সনদপত্র 🔒' },
    { id: 'card', label: 'আইডি কার্ড' },
    { id: 'info', label: 'তথ্য' }
  ], [vol1Progress.isUnlocked]);

  return (
    <div className="space-y-3">
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center gap-3">
          <ProfileAvatar user={user} photo={profile.photo} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {user?.displayName || 'শিক্ষার্থী'}
              </span>
              <span className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                লেভেল {toBengaliNumber(levelInfo.level)}
              </span>
            </div>
            {profile.district && <span className="text-xs text-slate-500 dark:text-slate-400">{profile.district}</span>}
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${Math.max(3, levelInfo.progressPercent)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>{toBengaliNumber(totalXp)} / {toBengaliNumber(levelInfo.nextLevelXp)} XP</span>
          <span>লেভেল {toBengaliNumber(levelInfo.level + 1)} পর্যন্ত আর {toBengaliNumber(levelInfo.remainingXp)} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
        {tabsList.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              tab === t.id
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'progress' && (
        <ProgressTab totalXp={totalXp} streakDays={streakDays} completedDars={completedDars} history={history} vol1Progress={vol1Progress} />
      )}
      {tab === 'certificate' && (
        <div className="space-y-4">
          {!vol1Progress.isUnlocked ? (
            <div className="py-8 px-4 sm:px-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                <Lock size={28} className="stroke-[2.2]" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30">
                  <Lock size={11} />
                  <span>সনদপত্রটি এখনও তালাবদ্ধ (Locked)</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-2">
                  ১ম খণ্ড সনদপত্র
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  মারকাযুল ঈমান মাদরাসার এই অফিশিয়াল ডিজিটাল সনদপত্রটি অর্জন করতে আপনাকে ১ম খণ্ডের সকল দারস সফলতার সাথে সম্পন্ন করতে হবে।
                </p>
              </div>

              {/* প্রোগ্রেস বার */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-2 text-left">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-300">পাঠ সম্পন্ন</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {toBengaliNumber(vol1Progress.completedCount)} / {toBengaliNumber(vol1Progress.totalCount)} দারস ({toBengaliNumber(vol1Progress.percent)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 transition-all duration-700"
                    style={{ width: `${Math.max(4, vol1Progress.percent)}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 pt-0.5">
                  আর মাত্র {toBengaliNumber(vol1Progress.remainingCount)}টি দারস সম্পন্ন করলেই আপনার নামের অফিশিয়াল সনদপত্রটি উন্মুক্ত হয়ে যাবে!
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('uls_navigate_tab', { detail: 'lessons' }));
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer inline-flex items-center gap-2"
                >
                  <BookOpen size={15} />
                  <span>দারস পড়া শুরু করুন ➔</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-teal-500/15 border border-emerald-500/30 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    মারকাযুল ঈমান ডিজিটাল সনদপত্র
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ✓ ১ম খণ্ড সফলভাবে সম্পন্ন হয়েছে
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('uls_open_certificate'))}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>বড় পর্দায় দেখুন</span>
                  <ChevronRight size={13} />
                </button>
              </div>
              <StudentCertificate
                certificateData={certData}
                isPreview={false}
              />
            </div>
          )}
        </div>
      )}
      {tab === 'card' && (
        <StudentIdCard
          user={user}
          profileData={{ name: user?.displayName, ...profile }}
          totalXp={totalXp}
          streakDays={streakDays}
        />
      )}
      {tab === 'info' && (
        <>
          <InfoTab user={user} onSaved={onSaved} onError={onError} onUserChange={onUserChange} />
          <PasswordSection user={user} onSaved={onSaved} onError={onError} onUserChange={onUserChange} />
        </>
      )}

      <button
        type="button"
        onClick={() => setFeatureModalOpen(true)}
        className="w-full p-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 flex items-center gap-3 text-left transition-colors cursor-pointer"
      >
        <span className="w-9 h-9 rounded-xl bg-amber-400 text-white flex items-center justify-center shrink-0">
          <Lightbulb size={18} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-amber-900 dark:text-amber-100">নতুন ফিচারের আইডিয়া আছে?</span>
          <span className="block text-xs text-amber-700 dark:text-amber-300">ডেভেলপারকে পরামর্শ দিন</span>
        </span>
        <ChevronRight size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
      </button>

      <ReportModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
        context={FEATURE_REQUEST_CONTEXT}
      />

      <button
        type="button"
        onClick={onLogout}
        disabled={loading}
        className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
      >
        <LogOut size={15} />
        <span>লগআউট</span>
      </button>
    </div>
  );
}
