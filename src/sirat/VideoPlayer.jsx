import { useCallback, useEffect, useRef, useState } from 'react';
import { Clapperboard, Headphones, Maximize, Maximize2, Minimize, Pause, PictureInPicture2, Play, RotateCcw, Video, Volume2, VolumeX, X } from 'lucide-react';
import { bn } from './questions';
import { getAssetUrl } from '../utils/assetHelper';
import { useVideo } from '../context/VideoContext';

// ভিডিও এন্ট্রি: "লিংক" অথবা { url, start, end } (সেকেন্ড বা "মিনিট:সেকেন্ড" / "ঘণ্টা:মিনিট:সেকেন্ড")
// একটি বড় ভিডিও থেকে প্রতি পাঠের নির্দিষ্ট অংশই (start–end) চলে; বাকি অংশ দেখা বা সিক করা যায় না।
// start/end না দিলে frac=[শুরু,শেষ] (০–১ অনুপাত) থেকে ভিডিওর মোট দৈর্ঘ্য ধরে অংশ বের হয়।
const toSec = (v) => {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'number') return v;
  const p = String(v).split(':').map(Number);
  if (p.some(Number.isNaN)) return undefined;
  return p.reduce((a, x) => a * 60 + x, 0);
};
const fmt = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  const t = h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  return t.replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
};
const RATES = [1, 1.25, 1.5, 2];

let ytApi;
const loadYT = () => {
  if (!ytApi) {
    ytApi = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
  }
  return ytApi;
};

const ytId = (url) => (url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/) || [])[1];

function Placeholder() {
  return (
    <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-900/30 flex flex-col items-center justify-center gap-2 text-emerald-700 dark:text-emerald-200">
      <Clapperboard size={40} strokeWidth={1.5} />
      <p className="font-semibold">এই পাঠের ভিডিও শিগগিরই আসছে</p>
    </div>
  );
}

// নিজস্ব কন্ট্রোলসহ প্লেয়ার (YouTube-এর নিজের বাটন/লিংক ঢাকা থাকে)
function CustomPlayer({
  kind,
  id,
  src,
  start: startProp,
  end: endProp,
  frac,
  title,
  autoplay,
  onEnd,
  audioOnly,
  isFloating = false,
  onExpand,
  onClose,
  onPlaybackChange,
}) {
  const box = useRef(null);
  const mount = useRef(null);
  const media = useRef(null); // { play, pause, seek, time, duration, rate, mute, muted }
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [err, setErr] = useState('');
  const [started, setStarted] = useState(false);
  const [full, setFull] = useState(false);
  const [audioMode, setAudioMode] = useState(false); // শুধু শব্দ: ভিডিও ঢাকা, ছোট বার
  const audio = !!audioOnly || audioMode;
  const [pseudo, setPseudo] = useState(false); // ব্রাউজার ফুলস্ক্রিন না দিলে (যেমন আইফোন) পুরো স্ক্রিন জুড়ে ফিক্সড

  const from = startProp ?? (frac && dur ? Math.floor(frac[0] * dur) : 0);
  const end = endProp ?? (frac && dur ? Math.ceil(frac[1] * dur) : undefined);
  const to = end ?? dur;
  const len = Math.max(0, to - from);
  const [now, setNow] = useState(from);
  const rangeKey = `${from}-${end}`;
  const autoRef = useRef(!!autoplay);

  // প্লেব্যাক স্টেট পরিবর্তন নোটিফাই করা
  useEffect(() => {
    if (typeof onPlaybackChange === 'function') {
      onPlaybackChange(playing, started);
    }
  }, [playing, started, onPlaybackChange]);

  // YouTube / mp4 অ্যাডাপ্টার
  useEffect(() => {
    let dead = false;
    let player;
    let video;
    if (kind === 'yt') {
      loadYT().then((YT) => {
        if (dead || !mount.current) return;
        const el = document.createElement('div');
        mount.current.appendChild(el);
        player = new YT.Player(el, {
          videoId: id,
          width: '100%',
          height: '100%',
          playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, playsinline: 1, fs: 0, origin: window.location.origin },
          events: {
            onReady: () => {
              if (dead) return;
              media.current = {
                play: () => player.playVideo(),
                pause: () => player.pauseVideo(),
                seek: (t) => player.seekTo(t, true),
                time: () => player.getCurrentTime(),
                duration: () => player.getDuration(),
                rate: (r) => player.setPlaybackRate(r),
                mute: (m) => (m ? player.mute() : player.unMute()),
              };
              setDur(player.getDuration() || 0);
              setReady(true);
            },
            onStateChange: (e) => {
              setPlaying(e.data === 1);
              if (e.data === 1) setStarted(true);
              if (e.data === 0) setEnded(true);
            },
            onError: () => setErr('এই ভিডিওটি এখানে চালানো যাচ্ছে না। YouTube-এ ভিডিওর সেটিংসে "এম্বেড করার অনুমতি" চালু আছে কি না এবং ভিডিওটি প্রাইভেট নয় তা দেখুন।'),
          },
        });
      }).catch(() => setErr('ভিডিও প্লেয়ার লোড হয়নি।'));
    } else {
      video = document.createElement('video');
      video.src = getAssetUrl(src);
      video.preload = 'metadata';
      video.playsInline = true;
      video.className = 'h-full w-full';
      video.setAttribute('controlslist', 'nodownload noremoteplayback');
      video.disablePictureInPicture = true;
      video.addEventListener('contextmenu', (e) => e.preventDefault());
      video.addEventListener('loadedmetadata', () => {
        if (dead) return;
        setDur(video.duration || 0);
        media.current = {
          play: () => video.play(),
          pause: () => video.pause(),
          seek: (t) => { video.currentTime = t; },
          time: () => video.currentTime,
          duration: () => video.duration,
          rate: (r) => { video.playbackRate = r; },
          mute: (m) => { video.muted = m; },
        };
        setReady(true);
      });
      video.addEventListener('play', () => setPlaying(true));
      video.addEventListener('pause', () => setPlaying(false));
      video.addEventListener('error', () => setErr('ভিডিও লোড হয়নি।'));
      mount.current.appendChild(video);
    }
    return () => {
      dead = true;
      media.current = null;
      if (player?.destroy) player.destroy();
      if (video) video.remove();
    };
  }, [kind, id, src]);

  // অংশ ঠিক হলে (বা বদলালে) শুরুর জায়গায় যান
  useEffect(() => {
    if (ready && (startProp !== undefined || dur)) { media.current?.seek(from); setNow(from); setEnded(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, rangeKey]);

  // পরপর দুটি ভিডিও জুড়ে থাকা পাঠে: শেষ হলে পরের অংশ চালু
  useEffect(() => { if (ended && onEnd) onEnd(); }, [ended, onEnd]);
  useEffect(() => {
    if (ready && autoRef.current) { autoRef.current = false; media.current?.play(); }
  }, [ready]);

  // বর্তমান সময় ট্র্যাক; শেষ সীমায় পৌঁছালে থামে
  useEffect(() => {
    if (!ready) return undefined;
    const t = setInterval(() => {
      const m = media.current;
      if (!m) return;
      const full = m.duration();
      if (full) setDur((d) => (d === full ? d : full));
      const cur = m.time();
      setNow(cur);
      if (end && cur >= end - 0.2) { m.pause(); setEnded(true); setPlaying(false); }
      if (cur < from - 0.5) m.seek(from);
    }, 250);
    return () => clearInterval(t);
  }, [ready, end, from]);

  const toggle = useCallback(() => {
    const m = media.current;
    if (!m) return;
    if (ended) { m.seek(from); setEnded(false); m.play(); return; }
    if (playing) m.pause(); else m.play();
  }, [playing, ended, from]);

  const seek = (e) => {
    const m = media.current;
    if (!m) return;
    const t = from + Number(e.target.value);
    m.seek(t); setNow(t); setEnded(false);
  };
  const cycleRate = () => {
    const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(r); media.current?.rate(r);
  };
  const toggleMute = () => { setMuted(!muted); media.current?.mute(!muted); };
  const toggleFull = () => {
    const el = box.current;
    if (full) {
      if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      setPseudo(false); setFull(false);
      return;
    }
    const rq = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!rq) { setPseudo(true); setFull(true); return; }
    Promise.resolve(rq.call(el)).then(() => {
      setFull(true);
      try { window.screen.orientation?.lock?.('landscape').catch(() => {}); } catch { /* সমর্থিত না */ }
    }).catch(() => { setPseudo(true); setFull(true); });
  };

  const { float, expand, close } = useVideo();

  const toggleFloating = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isFloating) {
      if (typeof onExpand === 'function') onExpand();
      else expand();
    } else {
      float();
    }
  };

  const expandFromFloating = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onExpand === 'function') onExpand();
    else expand();
  };

  const closeFloating = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    media.current?.pause();
    if (typeof onClose === 'function') onClose();
    else close();
  };

  useEffect(() => {
    const onChange = () => {
      const on = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!on) { setFull((f) => (pseudo ? f : false)); try { window.screen.orientation?.unlock?.(); } catch { /* সমর্থিত না */ } }
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => { document.removeEventListener('fullscreenchange', onChange); document.removeEventListener('webkitfullscreenchange', onChange); };
  }, [pseudo]);

  const rel = Math.min(Math.max(now - from, 0), len);

  if (err) {
    return <div className="aspect-video w-full rounded-2xl bg-slate-900 p-6 text-center text-sm text-slate-200 flex items-center justify-center">{err}</div>;
  }

  return (
    <div
      ref={box}
      className={`relative h-full w-full overflow-hidden bg-black select-none ${
        pseudo && full ? 'fixed inset-0 z-[100] h-screen w-screen rounded-none' : ''
      }`}
      aria-label={title}
    >
      <div
        ref={mount}
        className={`absolute inset-x-0 [&_iframe]:h-full [&_iframe]:w-full ${
          kind === 'yt' ? (isFloating ? 'inset-0' : '-top-[64px] -bottom-[64px]') : 'inset-y-0'
        } ${audio ? 'pointer-events-none opacity-0' : ''}`}
      />

        {/* ফ্লোটিং মিনিপ্লেয়ারের উপরের অ্যাকশন বার */}
        {isFloating && (
          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent p-2 text-white">
            <span className="truncate text-[11px] font-bold drop-shadow px-1 max-w-[180px] sm:max-w-[220px]">
              {title}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={expandFromFloating}
                title="বড় করুন"
                className="rounded-lg p-1 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Maximize2 size={14} />
              </button>
              <button
                type="button"
                onClick={closeFloating}
                title="মিনিপ্লেয়ার বন্ধ করুন"
                className="rounded-lg p-1 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* YouTube-এর শিরোনাম/লোগো ক্রপ করে বাদ; থামা অবস্থায় ঢাকনা অস্বচ্ছ, যাতে "আরও ভিডিও" না দেখা যায়; চাপলে চালু/বন্ধ */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'বিরতি' : 'চালান'}
          className={`absolute inset-0 z-10 flex items-center justify-center ${
            audio
              ? 'bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950'
              : playing
                ? 'bg-transparent'
                : started || kind !== 'yt'
                  ? 'bg-slate-950/70'
                  : 'bg-slate-950/95'
          }`}
        >
          {audio && (
            <span className="flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500/90 shadow-[0_0_24px_rgba(14,165,233,0.7)]">
                {ended ? <RotateCcw size={20} /> : playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </span>
              <span className="text-left">
                <span className="flex items-center gap-1.5 text-sm font-extrabold">
                  <Headphones size={15} /> অডিও মোড
                </span>
                <span className="text-[11px] text-slate-300">
                  {playing ? 'চলছে… পড়তে পড়তে শুনুন' : 'চালাতে চাপুন'}
                </span>
              </span>
            </span>
          )}
          {!audio && !playing && (
            <span
              className={`flex items-center justify-center rounded-full bg-sky-500/90 text-white shadow-[0_0_30px_rgba(14,165,233,0.8)] ${
                isFloating ? 'h-11 w-11' : 'h-16 w-16'
              }`}
            >
              {ended ? (
                <RotateCcw size={isFloating ? 18 : 28} />
              ) : (
                <Play size={isFloating ? 20 : 30} className="ml-1" />
              )}
            </span>
          )}
        </button>

        {!ready && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950 text-sm text-slate-300">
            ভিডিও লোড হচ্ছে…
          </div>
        )}

        {ready && (
          <div
            className={`absolute inset-x-0 bottom-0 z-20 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-t from-black/85 to-transparent text-white ${
              isFloating ? 'px-2 pb-1.5 pt-4' : 'px-3 pb-2 pt-6'
            }`}
          >
            <button
              type="button"
              onClick={toggle}
              aria-label="চালান/বিরতি"
              className="!animate-none rounded-full p-1.5 hover:bg-white/15 cursor-pointer"
            >
              {playing ? <Pause size={isFloating ? 14 : 18} /> : <Play size={isFloating ? 14 : 18} />}
            </button>
            <span className="w-10 sm:w-12 shrink-0 text-[10px] sm:text-[11px] tabular-nums">
              {fmt(rel)}
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(len, 1)}
              step={0.5}
              value={rel}
              onChange={seek}
              aria-label="অগ্রগতি"
              className="h-1 flex-1 cursor-pointer accent-sky-400"
            />
            <span className="w-10 sm:w-12 shrink-0 text-right text-[10px] sm:text-[11px] tabular-nums">
              {fmt(len)}
            </span>
            {!isFloating && (
              <>
                <button
                  type="button"
                  onClick={cycleRate}
                  className="!animate-none rounded-md px-1.5 py-0.5 text-[11px] font-bold hover:bg-white/15 cursor-pointer"
                >
                  {bn(rate)}x
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label="শব্দ"
                  className="!animate-none rounded-full p-1.5 hover:bg-white/15 cursor-pointer"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                {!audioOnly && (
                  <button
                    type="button"
                    onClick={() => setAudioMode((a) => !a)}
                    aria-label={audio ? 'ভিডিও মোড' : 'অডিও মোড'}
                    title={audio ? 'ভিডিও মোডে ফিরুন' : 'শুধু শব্দ (অডিও মোড)'}
                    className="!animate-none rounded-full p-1.5 hover:bg-white/15 cursor-pointer"
                  >
                    {audio ? <Video size={16} /> : <Headphones size={16} />}
                  </button>
                )}
                {!audio && (
                  <button
                    type="button"
                    onClick={toggleFloating}
                    aria-label="ফ্লোটিং মিনিপ্লেয়ার"
                    title="ফ্লোটিং মিনিপ্লেয়ার (PiP Mode)"
                    className="!animate-none rounded-full p-1.5 hover:bg-white/15 cursor-pointer"
                  >
                    <PictureInPicture2 size={16} />
                  </button>
                )}
                {!audio && (
                  <button
                    type="button"
                    onClick={toggleFull}
                    aria-label="ফুলস্ক্রিন"
                    className="!animate-none rounded-full p-1.5 hover:bg-white/15 cursor-pointer"
                  >
                    {full ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
  );
}

// একটি পাঠ দুই ভিডিওতে ছড়ানো থাকলে অংশগুলো পরপর চলে
function Sequence({ entries, title, audioOnly, isFloating, onExpand, onClose, onPlaybackChange }) {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((x) => (x < entries.length - 1 ? x + 1 : x)), [entries.length]);
  return (
    <SingleVideo
      key={i}
      entry={entries[i]}
      title={title}
      autoplay={i > 0}
      onEnd={i < entries.length - 1 ? next : undefined}
      audioOnly={audioOnly}
      isFloating={isFloating}
      onExpand={onExpand}
      onClose={onClose}
      onPlaybackChange={onPlaybackChange}
    />
  );
}

export default function VideoPlayer({ entry, entries, title, frac, audioOnly, isFloating, onExpand, onClose, onPlaybackChange }) {
  if (entries?.length > 1) {
    return (
      <Sequence
        entries={entries}
        title={title}
        audioOnly={audioOnly}
        isFloating={isFloating}
        onExpand={onExpand}
        onClose={onClose}
        onPlaybackChange={onPlaybackChange}
      />
    );
  }
  return (
    <SingleVideo
      entry={entries?.[0] || entry}
      title={title}
      frac={frac}
      audioOnly={audioOnly}
      isFloating={isFloating}
      onExpand={onExpand}
      onClose={onClose}
      onPlaybackChange={onPlaybackChange}
    />
  );
}

function SingleVideo({ entry, title, frac, autoplay, onEnd, audioOnly, isFloating, onExpand, onClose, onPlaybackChange }) {
  const cfg = typeof entry === 'string' ? { url: entry } : entry;
  if (!cfg?.url) return <Placeholder />;
  const start = toSec(cfg.start);
  const end = toSec(cfg.end);
  const id = ytId(cfg.url);
  if (id) {
    return (
      <CustomPlayer
        key={cfg.url}
        kind="yt"
        id={id}
        start={start}
        end={end}
        frac={frac}
        title={title}
        autoplay={autoplay}
        onEnd={onEnd}
        audioOnly={audioOnly}
        isFloating={isFloating}
        onExpand={onExpand}
        onClose={onClose}
        onPlaybackChange={onPlaybackChange}
      />
    );
  }

  const vimeo = cfg.url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const drive = cfg.url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (vimeo || drive) {
    const src = vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : `https://drive.google.com/file/d/${drive[1]}/preview`;
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
        <iframe src={src} title={title} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
      </div>
    );
  }
  return (
    <CustomPlayer
      key={cfg.url}
      kind="file"
      src={cfg.url}
      start={start}
      end={end}
      frac={frac}
      title={title}
      autoplay={autoplay}
      onEnd={onEnd}
      audioOnly={audioOnly}
      isFloating={isFloating}
      onExpand={onExpand}
      onClose={onClose}
      onPlaybackChange={onPlaybackChange}
    />
  );
}
