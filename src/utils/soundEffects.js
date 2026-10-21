import { useState, useEffect, useCallback } from 'react';

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundMuted() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('uls_sound_muted') === 'true';
  } catch (e) {
    return false;
  }
}

export function setSoundMuted(muted) {
  if (typeof window === 'undefined') return;
  const isMuted = Boolean(muted);
  try {
    localStorage.setItem('uls_sound_muted', isMuted ? 'true' : 'false');
  } catch (e) {}
  try {
    window.dispatchEvent(new CustomEvent('uls_sound_mute_changed', { detail: { muted: isMuted } }));
  } catch (e) {}
}

export function toggleSoundMute() {
  const current = isSoundMuted();
  const next = !current;
  setSoundMuted(next);
  return next;
}

/**
 * Universal React Hook for real-time sound mute synchronization across all components.
 * Immediately responds to mute/unmute events anywhere in the app or other tabs.
 */
export function useSoundMuted() {
  const [muted, setMutedState] = useState(() => isSoundMuted());

  useEffect(() => {
    const handleMuteChange = (e) => {
      if (e?.detail?.muted !== undefined) {
        setMutedState(Boolean(e.detail.muted));
      } else {
        setMutedState(isSoundMuted());
      }
    };

    window.addEventListener('uls_sound_mute_changed', handleMuteChange);
    window.addEventListener('storage', handleMuteChange);
    return () => {
      window.removeEventListener('uls_sound_mute_changed', handleMuteChange);
      window.removeEventListener('storage', handleMuteChange);
    };
  }, []);

  const toggle = useCallback(() => {
    return toggleSoundMute();
  }, []);

  const setMuted = useCallback((val) => {
    setSoundMuted(val);
  }, []);

  return [muted, toggle, setMuted];
}

// Sound Effects disabled completely as per preference (Zero artificial chimes, buzzers, or ting-ting sounds)

export function playSuccessChime() {
  // Silent - No ting-ting or chime
}

export function playMistakeNotice() {
  // Silent - No buzz or mistake sound
}

export function playCompletionFanfare() {
  // Silent - No fanfare
}

