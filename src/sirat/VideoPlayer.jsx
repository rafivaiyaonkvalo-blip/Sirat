import { useCallback, useEffect, useRef, useState } from 'react';
import { Clapperboard, Maximize, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { bn } from './questions';
import { getAssetUrl } from '../utils/assetHelper';

// ভিডিও এন্ট্রি: "লিংক" অথবা { url, start, end } (সেকেন্ড বা "মিনিট:সেকেন্ড" / "ঘণ্টা:মিনিট:সেকেন্ড")
// একটি বড় ভিডিও থেকে প্রতি পাঠের নির্দিষ্ট অংশই (start–end) চলে; বাকি অংশ দেখা বা সিক করা যায় না।
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
function CustomPlayer({ kind, id, src, start, end, title }) {
  const box = useRef(null);
  const mount = useRef(null);
  const media = useRef(null); // { play, pause, seek, time, duration, rate, mute, muted }
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(start || 0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [err, setErr] = useState('');

  const from = start || 0;
  const to = end ?? dur;
  const len = Math.max(0, to - from);

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
          playerVars: { controls: 0, disablekb: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, playsinline: 1, fs: 0, start: Math.floor(from), ...(end ? { end: Math.ceil(end) } : {}), origin: window.location.origin },
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
        video.currentTime = from;
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
  }, [kind, id, src, from, end]);

  // বর্তমান সময় ট্র্যাক; শেষ সীমায় পৌঁছালে থামে
  useEffect(() => {
    if (!ready) return undefined;
    const t = setInterval(() => {
      const m = media.current;
      if (!m) return;
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
  const full = () => {
    const el = box.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
  };

  const rel = Math.min(Math.max(now - from, 0), len);

  if (err) {
    return <div className="aspect-video w-full rounded-2xl bg-slate-900 p-6 text-center text-sm text-slate-200 flex items-center justify-center">{err}</div>;
  }

  return (
    <div ref={box} className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg select-none" aria-label={title}>
      <div ref={mount} className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full" />
      {/* ক্লিক ঢাকনা: নিচের YouTube লোগো/লিংকে ক্লিক ঠেকায়; চাপলে চালু/বন্ধ */}
      <button type="button" onClick={toggle} aria-label={playing ? 'বিরতি' : 'চালান'} className={`absolute inset-0 z-10 flex items-center justify-center ${playing ? 'bg-transparent' : 'bg-slate-950/80'}`}>
        {!playing && (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/90 text-white shadow-[0_0_30px_rgba(14,165,233,0.8)]">
            {ended ? <RotateCcw size={28} /> : <Play size={30} className="ml-1" />}
          </span>
        )}
      </button>
      {!ready && <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950 text-sm text-slate-300">ভিডিও লোড হচ্ছে…</div>}
      {ready && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-6 text-white">
          <button type="button" onClick={toggle} aria-label="চালান/বিরতি" className="!animate-none rounded-full p-1.5 hover:bg-white/15">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <span className="w-12 shrink-0 text-[11px] tabular-nums">{fmt(rel)}</span>
          <input type="range" min={0} max={Math.max(len, 1)} step={0.5} value={rel} onChange={seek} aria-label="অগ্রগতি" className="h-1 flex-1 cursor-pointer accent-sky-400" />
          <span className="w-12 shrink-0 text-right text-[11px] tabular-nums">{fmt(len)}</span>
          <button type="button" onClick={cycleRate} className="!animate-none rounded-md px-1.5 py-0.5 text-[11px] font-bold hover:bg-white/15">{bn(rate)}x</button>
          <button type="button" onClick={toggleMute} aria-label="শব্দ" className="!animate-none rounded-full p-1.5 hover:bg-white/15">{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
          <button type="button" onClick={full} aria-label="ফুলস্ক্রিন" className="!animate-none rounded-full p-1.5 hover:bg-white/15"><Maximize size={16} /></button>
        </div>
      )}
    </div>
  );
}

export default function VideoPlayer({ entry, title }) {
  const cfg = typeof entry === 'string' ? { url: entry } : entry;
  if (!cfg?.url) return <Placeholder />;
  const start = toSec(cfg.start);
  const end = toSec(cfg.end);
  const id = ytId(cfg.url);
  if (id) return <CustomPlayer kind="yt" id={id} start={start} end={end} title={title} />;

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
  return <CustomPlayer kind="file" src={cfg.url} start={start} end={end} title={title} />;
}
