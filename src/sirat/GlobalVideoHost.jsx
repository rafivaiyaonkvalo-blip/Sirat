import { useEffect, useState, useRef, useCallback } from 'react';
import { useVideo } from '../context/VideoContext';
import VideoPlayer from './VideoPlayer';

export default function GlobalVideoHost() {
  const { activeVideo, isFloating, isDismissed, anchorRect, expand, close, setIsPlaying, setIsStarted } = useVideo();
  const [mounted, setMounted] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [floatingPos, setFloatingPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const hostRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, elX: 0, elY: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // স্ক্রিন সাইজ পরিবর্তন হলে ফ্লোটিং প্লেয়ার যাতে স্ক্রিনের বাইরে না চলে যায়
  useEffect(() => {
    if (!floatingPos) return undefined;
    const handleResize = () => {
      const host = hostRef.current;
      const w = host?.offsetWidth || 320;
      const h = host?.offsetHeight || 180;
      const pad = 8;
      const maxX = Math.max(pad, window.innerWidth - w - pad);
      const maxY = Math.max(pad, window.innerHeight - h - pad);
      setFloatingPos((prev) => {
        if (!prev) return null;
        return {
          x: Math.max(pad, Math.min(maxX, prev.x)),
          y: Math.max(pad, Math.min(maxY, prev.y)),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [floatingPos]);

  // মাউস/টাচ ড্র্যাগ মুভ এবং আপ হ্যান্ডলিং (গ্লোবাল উইন্ডো লিসেনার)
  useEffect(() => {
    if (!isDragging) return undefined;

    const onPointerMove = (e) => {
      const { startX, startY, elX, elY } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const host = hostRef.current;
      const w = host?.offsetWidth || 320;
      const h = host?.offsetHeight || 180;
      const pad = 8;
      const maxX = Math.max(pad, window.innerWidth - w - pad);
      const maxY = Math.max(pad, window.innerHeight - h - pad);

      const nextX = Math.max(pad, Math.min(maxX, elX + dx));
      const nextY = Math.max(pad, Math.min(maxY, elY + dy));

      setFloatingPos({ x: nextX, y: nextY });
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDragging]);

  const handleDragStart = useCallback((e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('button')) return;

    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: rect.left,
      elY: rect.top,
    };

    setIsDragging(true);
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
    <>
      {/* ড্র্যাগিং চলাকালীন ইভেন্ট চুরি ও সিলেক্ট রোধ করার স্বচ্ছ ফুলস্ক্রিন পর্দা */}
      {isDragging && (
        <div className="fixed inset-0 z-[99998] cursor-grabbing select-none" />
      )}

      <div
        ref={hostRef}
        id="global-video-host"
        className={`select-none ${
          isDragging ? '!transition-none' : 'transition-all duration-300'
        } ${
          isFull
            ? 'fixed inset-0 z-[99999] w-screen h-screen !max-w-none !rounded-none !top-0 !left-0 !m-0 !p-0 bg-black overflow-hidden'
            : isFloatingMode
              ? `${
                  floatingPos ? 'fixed' : 'fixed bottom-20 right-3 sm:bottom-6 sm:right-6'
                } z-50 w-72 sm:w-80 md:w-96 aspect-video rounded-2xl shadow-2xl ring-2 ${
                  isDragging
                    ? 'ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.4)] cursor-grabbing'
                    : 'ring-emerald-500/80'
                } bg-black backdrop-blur overflow-hidden`
              : 'overflow-hidden rounded-2xl shadow-lg'
        }`}
        style={
          isFull
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 99999,
                borderRadius: 0,
              }
            : isFloatingMode
              ? floatingPos
                ? {
                    position: 'fixed',
                    left: `${floatingPos.x}px`,
                    top: `${floatingPos.y}px`,
                    right: 'auto',
                    bottom: 'auto',
                    zIndex: 9999,
                  }
                : {}
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
          onFullscreenChange={setIsFull}
          onDragStart={handleDragStart}
          onPlaybackChange={(playing, started) => {
            setIsPlaying(playing);
            setIsStarted(started);
          }}
        />
      </div>
    </>
  );
}
