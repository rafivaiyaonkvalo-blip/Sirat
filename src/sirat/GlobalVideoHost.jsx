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

  // ফ্লোটিং উইন্ডো বন্ধ করে দেওয়া হলে এবং ব্যবহারকারী যদি কোনো ভিডিও অ্যাংকরে না থাকেন, তবে লুকানো থাকবে
  if (isDismissed && !anchorRect) {
    return null;
  }

  // ফ্লোটিং মোড: যদি স্পষ্টভাবে ফ্লোটিং চালু থাকে অথবা পেজে কোনো অ্যাংকর না থাকে (যেমন অন্য ট্যাবে থাকলে)
  const isFloatingMode = isFloating || !anchorRect;

  // যদি ফ্লোটিং বন্ধ করে দেওয়া থাকে কিন্তু ভিডিও পেজে আছেন, তখন স্বাভাবিক আকারে দেখাবে
  if (isDismissed && isFloatingMode) {
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
              top: `${anchorRect.top}px`,
              left: `${anchorRect.left}px`,
              width: `${anchorRect.width}px`,
              height: `${anchorRect.height}px`,
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
