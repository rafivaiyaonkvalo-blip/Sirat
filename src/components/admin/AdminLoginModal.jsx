import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { verifyAndLoginAdmin, startAdminSession, setCustomAdminPin } from '../../services/adminService';
import { isSuperUser } from '../../utils/superUser';

export default function AdminLoginModal({ isOpen, onClose, onSuccess, user }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!pin.trim()) {
      setError('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    const isValid = await verifyAndLoginAdmin(pin.trim());
    if (isValid) {
      setPin('');
      setError('');
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } else {
      setError('ভুল অ্যাডমিন পাসওয়ার্ড! পুনরায় চেষ্টা করুন।');
    }
  };

  const handleChangePin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      await setCustomAdminPin(newPin);
      setSuccessMsg('অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      setNewPin('');
      setTimeout(() => {
        setIsChangingPin(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden relative">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
            <Shield size={28} className="text-emerald-300" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            মারকাযুল ঈমান অ্যাডমিন পোর্টাল
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            ইলমী কারিকুলাম ও রিপোর্ট ব্যবস্থাপনা
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Quick SuperUser Direct Access */}
          {!isChangingPin && isSuperUser(user) && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
                <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>সুপারইউজার অ্যাকাউন্ট সক্রিয়:</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono mb-2.5 truncate">
                {user.email}
              </p>
              <button
                type="button"
                onClick={() => {
                  startAdminSession();
                  if (typeof onSuccess === 'function') onSuccess();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Shield size={14} />
                <span>১-ক্লিকে সরাসরি অ্যাডমিন পোর্টালে প্রবেশ করুন</span>
              </button>
              <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-800/40 text-center text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                অথবা নিচের ফর্ম থেকে পিন দিয়ে প্রবেশ করুন
              </div>
            </div>
          )}

          {!isChangingPin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  অ্যাডমিন পাসওয়ার্ড (Admin Password):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key size={18} />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন..."
                    autoFocus
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm tracking-wider outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                🔒 <span>মারকাযুল ঈমান ইলমী অ্যাডমিন সিকিউরিটি গেটওয়ে</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                প্রবেশ করুন (Access Portal)
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(true);
                    setError('');
                  }}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer"
                >
                  পিন পরিবর্তন করতে চান?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  নতুন অ্যাডমিন পিন লিখুন:
                </label>
                <input
                  type="text"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="কমপক্ষে ৪ অক্ষরের নতুন পিন"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
