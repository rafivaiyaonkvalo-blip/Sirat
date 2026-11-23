import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const VideoContext = createContext(null);

export function VideoProvider({ children, onNavigateToTab }) {
  const [activeVideo, setActiveVideo] = useState(null); // { darsId, porboNo, title, entry, entries, frac }
  const [isFloating, setIsFloating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  const anchorElRef = useRef(null);
  const activeVideoRef = useRef(activeVideo);
  activeVideoRef.current = activeVideo;
  const isFloatingRef = useRef(isFloating);
  isFloatingRef.current = isFloating;

  // মেজারমেন্ট আপডেট: #sirat-video-anchor-এর পজিশন #root-এর সাপেক্ষে বের করা
  const updateRect = useCallback(() => {
    const el = anchorElRef.current;
    if (!el) {
      setAnchorRect(null);
      return;
    }
    const rootEl = document.getElementById('root') || document.body;
    if (rootEl && window.getComputedStyle(rootEl).position === 'static') {
      rootEl.style.position = 'relative';
    }
    const elRect = el.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();

    setAnchorRect({
      top: Math.round(elRect.top - rootRect.top),
      left: Math.round(elRect.left - rootRect.left),
      width: Math.round(elRect.width),
      height: Math.round(elRect.height),
    });
  }, []);

  // উইন্ডো রিসাইজ বা অ্যাংকর সাইজ পরিবর্তন হলে মেজারমেন্ট ঠিক করা
  useEffect(() => {
    const el = anchorElRef.current;
    if (!el) return undefined;

    updateRect();
    const ro = new ResizeObserver(() => updateRect());
    ro.observe(el);
    window.addEventListener('resize', updateRect);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateRect);
    };
  }, [updateRect]);

  // নতুন অ্যাংকর রেজিস্টার করা
  const setAnchorEl = useCallback((el) => {
    anchorElRef.current = el;
    if (el) {
      // রেন্ডার হওয়া মাত্রই পরিমাপ নেওয়া
      requestAnimationFrame(updateRect);
    } else {
      setAnchorRect(null);
    }
  }, [updateRect]);

  // পাঠের ভিডিও রেজিস্টার করা (দারসে প্রবেশের সময় কল হয়)
  const registerLesson = useCallback(({ darsId, porboNo, title, entry, entries, frac, force = false }) => {
    setActiveVideo((prev) => {
      // যদি আগে থেকেই অন্য কোনো ভিডিও চলছে এবং ব্যবহারকারী ফ্লোটিং অবস্থায় আছেন,
      // তখন নতুন দারস ব্রাউজ করলেও ফ্লোটিং ভিডিও কাটবে না, যতক্ষণ না ব্যবহারকারী নিজে নতুন দারস প্লে করেন
      if (prev && isFloatingRef.current && !force) {
        // একই দারস হলে তথ্য আপডেট করা
        if (prev.darsId === darsId && prev.porboNo === porboNo) {
          return { ...prev, title: title || prev.title, entry, entries, frac };
        }
        return prev;
      }

      // একই ভিডিও হলে রেফারেন্স অপরিবর্তিত রাখা
      if (prev?.darsId === darsId && prev?.porboNo === porboNo) {
        return prev;
      }

      // নতুন ভিডিও সেট করা
      return { darsId, porboNo, title, entry, entries, frac };
    });
  }, []);

  // ফ্লোটিং করা
  const float = useCallback(() => {
    setIsFloating(true);
    setIsDismissed(false);
  }, []);

  // স্বাভাবিক আকারে বড় করা (আনফ্লোটিং)
  const expand = useCallback(() => {
    const current = activeVideoRef.current;
    setIsFloating(false);
    setIsDismissed(false);

    if (current?.darsId && current?.porboNo) {
      try {
        localStorage.setItem('uls_active_tab', 'lessons');
        const url = new URL(window.location.href);
        url.searchParams.delete('tab');
        url.searchParams.delete('r');
        url.searchParams.delete('ref');
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
      } catch (e) {
        /* ignore */
      }
      if (typeof onNavigateToTab === 'function') {
        onNavigateToTab('lessons');
      }
      const targetHash = `#/dars/${current.darsId}/${current.porboNo}/video`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
      setTimeout(() => {
        const el = anchorElRef.current;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [onNavigateToTab]);

  // ফ্লোটিং উইন্ডো বন্ধ করা
  const close = useCallback(() => {
    setIsFloating(false);
    setIsDismissed(true);
  }, []);

  const value = {
    activeVideo,
    isFloating,
    isDismissed,
    isPlaying,
    isStarted,
    anchorRect,
    setAnchorEl,
    registerLesson,
    float,
    expand,
    close,
    setIsPlaying,
    setIsStarted,
    updateRect,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return ctx;
}
