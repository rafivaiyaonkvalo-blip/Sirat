import { Clapperboard } from 'lucide-react';

function embedUrl(url) {
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  if (m) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` };
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { kind: 'iframe', src: `https://player.vimeo.com/video/${m[1]}` };
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) return { kind: 'iframe', src: `https://drive.google.com/file/d/${m[1]}/preview` };
  return { kind: 'video', src: url };
}

export default function VideoPlayer({ url, title }) {
  if (!url) {
    return (
      <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-900/30 flex flex-col items-center justify-center gap-2 text-emerald-700 dark:text-emerald-200">
        <Clapperboard size={40} strokeWidth={1.5} />
        <p className="font-semibold">এই পাঠের ভিডিও শিগগিরই আসছে</p>
      </div>
    );
  }
  const e = embedUrl(url);
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
      {e.kind === 'iframe' ? (
        <iframe src={e.src} title={title} className="h-full w-full" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
      ) : (
        <video src={e.src} controls preload="metadata" className="h-full w-full" />
      )}
    </div>
  );
}
