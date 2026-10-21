import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
    
    // Auto-recover from chunk load errors, dynamic import failures, or stale PWA caches
    const errText = error?.message || error?.toString() || '';
    if (
      errText.includes('Failed to fetch') ||
      errText.includes('Loading chunk') ||
      errText.includes('dynamically imported module') ||
      errText.includes('Importing a module script failed')
    ) {
      const now = Date.now();
      const lastReset = parseInt(sessionStorage.getItem('uls_auto_reset_time') || '0', 10);
      if (now - lastReset > 10000) {
        sessionStorage.setItem('uls_auto_reset_time', now.toString());
        this.handleReset();
      }
    }
  }

  handleReset = async () => {
    try {
      localStorage.removeItem('uls_active_tab');
      localStorage.removeItem('uls_lessons_level');
      localStorage.removeItem('uls_lessons_mode');
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const names = await caches.keys();
        for (const name of names) {
          await caches.delete(name);
        }
      }
    } catch (e) {}
    window.location.replace('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bengali">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl">
              📖
            </div>
            <h2 className="text-xl font-bold mb-2">সীরাত - মারকাযুল ঈমান</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              পেজটি লোড করার সময় একটি সাময়িক ত্রুটি হয়েছে। নিচের বাটনে ক্লিক করে পুনরায় লোড করুন।
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer mb-4"
            >
              ক্যাশ রিসেট করে পুনরায় লোড করুন
            </button>
            {this.state.error && (
              <details className="text-left text-xs bg-slate-100 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <summary className="cursor-pointer font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  ত্রুটির বিবরণ (Error Details)
                </summary>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-rose-600 dark:text-rose-400">
                  {this.state.error?.stack || this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
)
