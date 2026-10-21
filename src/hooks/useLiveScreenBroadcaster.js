// =========================================================================
// ULS Arabic - useLiveScreenBroadcaster Hook
// Automatically captures student interaction, touches, tabs, audio, and away state
// =========================================================================

import { useEffect, useRef } from 'react';
import { 
  broadcastStudentScreenState, 
  markStudentOffline, 
  listenForAdminNudges 
} from '../services/liveScreenService';
import { getOrCreateSessionId } from '../services/analyticsTracker';
import confetti from 'canvas-confetti';

export function useLiveScreenBroadcaster(currentTab, user) {
  const lastScrollBroadcastRef = useRef(0);
  const awayTimerRef = useRef(null);

  // 1. Initial tab & user change broadcast
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/rafi')) return;

    let tabLabel = 'দারস ও পাঠসমূহ';
    if (currentTab === 'flashcards') tabLabel = 'ফ্ল্যাশকার্ড অনুশীলন';
    else if (currentTab === 'practice') tabLabel = 'অভ্যাস ও অনুশীলন';
    else if (currentTab === 'spelling') tabLabel = 'বানান ও বর্ণ লিখন';
    else if (currentTab === 'exam') tabLabel = 'গ্রিল মি মৌখিক পরীক্ষা';
    else if (currentTab === 'vocab') tabLabel = '১,৩৪৩ শব্দকোষ ডিকশনারি';
    else if (currentTab === 'book') tabLabel = 'মূল কিতাব ভিউয়ার (PDF)';

    broadcastStudentScreenState({
      currentTab,
      user: user ? {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'শিক্ষার্থী',
        email: user.email || '',
        photoURL: user.photoURL || '',
        isLoggedIn: true
      } : {
        uid: null,
        name: 'অতিথি শিক্ষার্থী',
        isLoggedIn: false
      },
      lastActionText: `${tabLabel} ট্যাবে আছেন`,
      isAway: document.hidden
    }, true);
  }, [currentTab, user]);

  // 2. Global pointer & click listener (Laser cursor tracking)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/rafi')) return;

    const handlePointerAction = (e) => {
      // Calculate percentage coordinate
      const width = window.innerWidth || 390;
      const height = window.innerHeight || 844;
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : width / 2);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : height / 2);

      const xPercent = Math.min(100, Math.max(0, Math.round((clientX / width) * 100)));
      const yPercent = Math.min(100, Math.max(0, Math.round((clientY / height) * 100)));

      // Detect clicked element description
      let targetLabel = '';
      try {
        const target = e.target;
        if (target) {
          const clickable = target.closest('button, a, input, select, [role="button"], [data-track], .cursor-pointer');
          if (clickable) {
            targetLabel = clickable.getAttribute('data-track') ||
                          clickable.getAttribute('aria-label') ||
                          clickable.getAttribute('title') ||
                          clickable.innerText ||
                          clickable.textContent ||
                          '';
            targetLabel = targetLabel.trim().replace(/\s+/g, ' ').slice(0, 45);
          }
        }
      } catch (err) {}

      broadcastStudentScreenState({
        cursor: {
          x: xPercent,
          y: yPercent,
          lastAction: e.type === 'pointerdown' || e.type === 'touchstart' ? 'click' : 'move',
          targetLabel: targetLabel || 'ক্লিক',
          timestamp: Date.now()
        },
        lastActionText: targetLabel ? `"${targetLabel}" এ ক্লিক করেছেন` : 'স্ক্রিনে টাচ করেছেন'
      }, true); // clicks are sent immediately
    };

    window.addEventListener('pointerdown', handlePointerAction, { passive: true });
    window.addEventListener('touchstart', handlePointerAction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerAction);
      window.removeEventListener('touchstart', handlePointerAction);
    };
  }, []);

  // 3. Scroll tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/rafi')) return;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollBroadcastRef.current < 1200) return; // 1.2s throttle
      lastScrollBroadcastRef.current = now;

      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = totalH > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / totalH) * 100))) : 0;

      broadcastStudentScreenState({
        scrollPercentage: pct,
        lastActionText: `স্ক্রল অবস্থান: ${pct}%`
      }, false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Tab visibility change (Detect if student goes away to another tab or minimizes browser)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/rafi')) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        broadcastStudentScreenState({
          isAway: true,
          awaySince: Date.now(),
          lastActionText: '⚠️ অন্য ট্যাবে বা অ্যাপের বাইরে গেছেন'
        }, true);
      } else {
        broadcastStudentScreenState({
          isAway: false,
          awaySince: null,
          lastActionText: '🟢 আবার মারকাযুল ঈমান অ্যাপে ফিরে এসেছেন'
        }, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 5. Audio playback listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/rafi')) return;

    const handleAudioEvent = (e) => {
      if (e.detail?.text) {
        broadcastStudentScreenState({
          audioPlaying: {
            text: e.detail.text,
            playedAt: Date.now()
          },
          lastActionText: `🔊 আরবি উচ্চারণ শুনছেন: "${e.detail.text}"`
        }, true);
      }
    };

    window.addEventListener('uls_audio_played', handleAudioEvent);
    return () => window.removeEventListener('uls_audio_played', handleAudioEvent);
  }, []);

  // 6. Listen for Remote Admin Encouragements / Nudges / Duas
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/rafi')) return;

    const sessionId = getOrCreateSessionId();
    const unsub = listenForAdminNudges(sessionId, (nudge) => {
      if (!nudge) return;

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // Show floating Islamic cheer toast
      showAdminNudgeToast(nudge);
    });

    return () => unsub();
  }, []);

  // 7. Cleanup on unload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUnload = () => markStudentOffline();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
}

function showAdminNudgeToast(nudge) {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('uls-admin-nudge-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'uls-admin-nudge-toast';
  toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[90%] bg-gradient-to-r from-emerald-900/95 via-slate-900/95 to-teal-900/95 border-2 border-emerald-400 text-white p-4 rounded-3xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce';
  
  toast.innerHTML = `
    <div class="w-11 h-11 rounded-2xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 text-xl">
      ${nudge.type === 'dua' ? '🤲' : nudge.type === 'applause' ? '👏' : nudge.type === 'star' ? '⭐' : '❤️'}
    </div>
    <div class="flex-1">
      <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">মারকাযুল ঈমান ইলমী বোর্ড</span>
      <p class="text-xs font-black text-white mt-0.5">${nudge.message || 'মাশাআল্লাহ! চমৎকার হচ্ছে, চালিয়ে যান।'}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white p-1 text-sm font-bold">✕</button>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 500ms ease';
      setTimeout(() => toast.remove(), 500);
    }
  }, 6000);
}
