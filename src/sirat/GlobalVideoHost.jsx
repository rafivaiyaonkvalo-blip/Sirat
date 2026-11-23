import { useEffect, useState } from 'react';
import { useVideo } from '../context/VideoContext';
import VideoPlayer from './VideoPlayer';

export default function GlobalVideoHost() {
  const { activeVideo, isFloating, isDismissed, anchorRect, expand, close, setIsPlaying, setIsStarted } = useVideo();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !activeVideo) return null;

  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const isVideoPage = hash.includes('/video');

  // যদি অ্যাংকর স্টেট এখনো আপডেট না হয়ে থাকে, সরাসরি DOM থেকে পরিমাপ নেওয়া
  const effectiveRect = anchorRect || (() => {
    if (typeof document === 'undefined') return null;
    const el = document.getElementById('sirat-video-anchor');
    if (!el) return null;
    const rootEl = document.getElementById('root') || document.body;
    if (rootEl && window.getComputedStyle(rootEl).position === 'static') {
      rootEl.style.position = 'relative';
    }
    const elRect = el.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();
    return {
      top: Math.round(elRect.top - rootRect.top),
      left: Math.round(elRect.left - rootRect.left),
      width: Math.round(elRect.width),
      height: Math.round(elRect.height),
    };
  })();

  // ফ্লোটিং উইন্ডো বন্ধ করে দেওয়া হলে এবং ব্যবহারকারী যদি ভিডিও পেজে না থাকেন, তবে লুকানো থাকবে
  if (isDismissed && (!isVideoPage || !effectiveRect)) {
    return null;
  }

  // ফ্লোটিং মোড: যদি স্পষ্টভাবে ফ্লোটিং চালু থাকে অথবা ভিডিও পেজে না থাকি
  const isFloatingMode = isFloating || (!isVideoPage && !effectiveRect);

  // যদি ফ্লোটিং বন্ধ করে দেওয়া থাকে এবং ফ্লোটিং মোডে থাকে, তবে লুকানো থাকবে
  if (isDismissed && isFloatingMode) {
    return null;
  }

  // যদি স্বাভাবিক মোডে আছি কিন্তু অ্যাংকর প্রস্তুত না, এক ফ্রেম অপেক্ষা
  if (!isFloatingMode && !effectiveRect) {
    return null;
  }

  return (
    <div
      id="global-video-host"
      className={`select-none transition-all duration-300 ${
        isFloatingMode
          ? 'fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-50 w-72 sm:w-80 md:w-96 aspect-video rounded-2xl shadow-2xl ring-2 ring-emerald-500/80 bg-black backdrop-blur overflow-hidden'
          : 'overflow-hidden rounded-2xl shadow-lg'
      }`}
      style={
        isFloatingMode
          ? {}
          : {
              position: 'absolute',
              top: `${effectiveRect.top}px`,
              left: `${effectiveRect.left}px`,
              width: `${effectiveRect.width}px`,
              height: `${effectiveRect.height}px`,
              zIndex: 30,
            }
      }
    >
      <VideoPlayer
        key={`${activeVideo.darsId}-${activeVideo.porboNo}`}
        entry={activeVideo.entry}
        entries={activeVideo.entries}
        title={activeVideo.title}
        frac={activeVideo.frac}
        isFloating={isFloatingMode}
        onExpand={expand}
        onClose={close}
        onPlaybackChange={(playing, started) => {
          setIsPlaying(playing);
          if (started) setIsStarted(true);
        }}
      />
    </div>
  );
}
