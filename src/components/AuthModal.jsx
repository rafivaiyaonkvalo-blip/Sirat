import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Lock, LogIn, Eye, EyeOff,
  CheckCircle2, AlertCircle, KeyRound, UserPlus, Link2
} from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword,
  logoutUser,
  linkPendingGoogleCredential
} from '../services/firebase';
import ProfileDashboard from './ProfileDashboard';

export default function AuthModal({ isOpen, onClose, user, onUserChange }) {
  // Tabs: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingLinkInfo, setPendingLinkInfo] = useState(null);
  const [linkPassword, setLinkPassword] = useState('');
  const [showGoogleFallback, setShowGoogleFallback] = useState(false);

  // Reset or load stats & profile on open
  useEffect(() => {
    if (isOpen) {
      setIsForgotPassword(false);
      setPendingLinkInfo(null);
      setLinkPassword('');
      setShowGoogleFallback(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setPendingLinkInfo(null);
    setLinkPassword('');
    setShowGoogleFallback(false);
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  if (!isOpen) return null;

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setShowGoogleFallback(false);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('গুগল দিয়ে সফলভাবে প্রবেশ করেছেন!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setPendingLinkInfo({
          email: err.email,
          credential: err.pendingCredential
        });
        setErrorMsg(err.message);
      } else {
        setErrorMsg(err.message || 'লগইন করতে সমস্যা হয়েছে।');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google ও Password অ্যাকাউন্ট সংযুক্তকরণ সাবমিট
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkPassword) {
      setErrorMsg('অনুগ্রহ করে আপনার পূর্বের পাসওয়ার্ডটি লিখুন।');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await linkPendingGoogleCredential(pendingLinkInfo.email, linkPassword, pendingLinkInfo.credential);
      setSuccessMsg('গুগল ও পাসওয়ার্ড অ্যাকাউন্ট সফলভাবে সংযুক্ত করা হয়েছে! স্বাগতম।');
      setPendingLinkInfo(null);
      setLinkPassword('');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('পাসওয়ার্ডটি ভুল হয়েছে। পুনরায় চেষ্টা করুন অথবা নিচে পাসওয়ার্ড রিসেট করুন।');
      } else {
        setErrorMsg(err.message || 'অ্যাকাউন্ট লিঙ্ক করতে সমস্যা হয়েছে।');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login or Registration
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }

    if (activeTab === 'register') {
      if (!displayName.trim()) {
        setErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন।');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');
        return;
      }
    } else {
      if (!password) {
        setErrorMsg('অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।');
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'register') {
        await registerWithEmail(cleanEmail, password, displayName.trim());
        setSuccessMsg('নিবন্ধন সফল হয়েছে! স্বাগতম।');
      } else {
        await loginWithEmail(cleanEmail, password);
        setSuccessMsg('লগইন সফল হয়েছে! স্বাগতম।');
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে।');
        setShowGoogleFallback(true);
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('এই ইমেইল দিয়ে আগেই একাউন্ট খোলা হয়েছে। আপনি Google দিয়ে লগইন করতে পারেন অথবা পাসওয়ার্ড রিসেট করতে পারেন।');
        setShowGoogleFallback(true);
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('অতিরিক্ত ভুল প্রচেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।');
      } else {
        setErrorMsg(err.message || 'সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন।');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await resetPassword(cleanEmail);
      setSuccessMsg('পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে! ইনবক্স চেক করুন।');
      setTimeout(() => {
        setIsForgotPassword(false);
        setActiveTab('login');
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setErrorMsg('এই ইমেইল দিয়ে কোনো একাউন্ট পাওয়া যায়নি।');
      } else {
        setErrorMsg('রিসেট লিঙ্ক পাঠাতে ব্যর্থ হয়েছে। সঠিক ইমেইল দিন।');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser(user);
      setSuccessMsg('লগআউট সম্পন্ন হয়েছে');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg('লগআউট ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2.5">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User" 
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-xs" 
              />
            ) : user ? (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-emerald-500/20">
                {(user.displayName || user.email || 'P')[0].toUpperCase()}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <Lock size={16} />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                {user ? 'প্রোফাইল' : (
                  pendingLinkInfo ? 'অ্যাকাউন্ট সংযুক্তিকরণ' :
                  isForgotPassword ? 'পাসওয়ার্ড রিকভারি' :
                  activeTab === 'register' ? 'নতুন আইডি' : 'লগইন'
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                মারকাযুল ঈমান • ULS Arabic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= 1. LOGGED-IN PROFILE VIEW ================= */}
          {user ? (
            <ProfileDashboard
              user={user}
              loading={loading}
              onLogout={handleLogout}
              onSaved={(msg) => {
                setSuccessMsg(msg);
                setTimeout(() => setSuccessMsg(''), 3000);
              }}
              onError={setErrorMsg}
              onUserChange={onUserChange}
            />
          ) : pendingLinkInfo ? (
            /* ================= 2. PENDING GOOGLE LINK VIEW ================= */
            <form onSubmit={handleLinkSubmit} className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-indigo-700 dark:text-indigo-300">
                  <Link2 size={18} className="shrink-0" />
                  <span>গুগল ও পাসওয়ার্ড একাউন্ট একত্রিত করুন</span>
                </div>
                <p>
                  <strong>{pendingLinkInfo.email}</strong> ইমেইলটিতে আগে থেকেই একটি পাসওয়ার্ড একাউন্ট খোলা রয়েছে। গুগল ও পাসওয়ার্ড দুই মাধ্যমেই সহজে প্রবেশ করতে আপনার পূর্বের পাসওয়ার্ডটি দিন।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার পূর্বের অ্যাকাউন্টের পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={linkPassword}
                    onChange={(e) => setLinkPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Link2 size={16} />
                <span>{loading ? 'সংযুক্ত করা হচ্ছে…' : 'অ্যাকাউন্ট সংযুক্ত করুন ও লগইন করুন'}</span>
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(pendingLinkInfo.email);
                    setPendingLinkInfo(null);
                    setIsForgotPassword(true);
                  }}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingLinkInfo(null);
                    setErrorMsg('');
                  }}
                  className="text-slate-500 dark:text-slate-400 hover:underline font-medium cursor-pointer"
                >
                  বাতিল করুন
                </button>
              </div>
            </form>
          ) : isForgotPassword ? (
            /* ================= 3. FORGOT PASSWORD VIEW ================= */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                আপনার নিবন্ধিত ইমেইল ঠিকানা প্রদান করুন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি সুরক্ষিত লিঙ্ক পাঠাবো।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound size={16} />
                <span>{loading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিঙ্ক পাঠান'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  লগইন স্ক্রিনে ফিরে যান
                </button>
              </div>
            </form>
          ) : (
            /* ================= 4. AUTH VIEW (LOGIN OR REGISTER ONLY) ================= */
            <div className="space-y-4">
              {/* Fallback Helper when Google or Password conflict suspected */}
              {showGoogleFallback && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[12px] flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      💡 আপনি কি Google দিয়ে একাউন্ট খুলেছিলেন?
                    </span>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Google দিয়ে লগইন
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-tight">
                    যদি আগে Google দিয়ে ঢুকে থাকেন, তবে ওপরের বোতামে চাপ দিন। প্রবেশের পর প্রোফাইল থেকে সহজেই নিজের মতো পাসওয়ার্ড সেট করে নিতে পারবেন।
                  </p>
                </div>
              )}

              {/* Tabs Switcher */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  প্রবেশ করুন (লগইন)
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  নতুন একাউন্ট (নিবন্ধন)
                </button>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loading ? 'অপেক্ষা করুন…' : 'Google দিয়ে প্রবেশ করুন'}</span>
              </button>

              <div className="flex items-center gap-3 my-1.5">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">অথবা ইমেইল</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      শিক্ষার্থীর পূর্ণ নাম
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        autoComplete="name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল ঠিকানা
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      পাসওয়ার্ড
                    </label>
                    {activeTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={activeTab === 'register' ? 'new-password' : 'current-password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      পাসওয়ার্ড নিশ্চিত করুন
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {activeTab === 'register' ? <UserPlus size={16} /> : <LogIn size={16} />}
                  <span>
                    {loading ? 'অপেক্ষা করুন…' : activeTab === 'register' ? 'নিবন্ধন সম্পন্ন করুন' : 'লগইন করুন'}
                  </span>
                </button>
              </form>

              {/* Guest mode reminder */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                💡 <strong>গেস্ট শিক্ষার্থী মোড:</strong> লগইন ছাড়া আপনার পড়াশোনার অগ্রগতি সাময়িকভাবে এই ব্রাউজারে সংরক্ষিত থাকে। সব ডিভাইসে পয়েন্ট ও স্টার সেভ রাখতে লগইন করুন।
              </div>

              {/* Switch Subtabs */}
              <div className="text-center pt-1">
                {activeTab === 'register' ? (
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    আগে থেকেই একাউন্ট আছে? লগইন করুন
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('register')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    নতুন শিক্ষার্থী? এখানে ক্লিক করে একাউন্ট খুলুন
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
