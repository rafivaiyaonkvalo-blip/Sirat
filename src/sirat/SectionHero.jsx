import { getAssetUrl } from '../utils/assetHelper';

// কুইজ ও পরীক্ষা সেকশনের উপরের ব্যানার (দারস-পথের হিরোর মতো ধাঁচ)
export default function SectionHero({ icon: Icon, title, subtitle, chips = [] }) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 p-6 text-white shadow-xl sm:p-8">
      <img src={getAssetUrl('/hero-madinah.jpg')} alt="" aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[58%] object-cover sm:w-[42%]" style={{ objectPosition: 'center 68%', WebkitMaskImage: 'linear-gradient(to left, #000 35%, transparent)', maskImage: 'linear-gradient(to left, #000 35%, transparent)' }} />
      <div className="relative z-10">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-[0_0_24px_rgba(14,165,233,0.55)] backdrop-blur-md"><Icon size={24} /></span>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-emerald-100 sm:text-sm">{subtitle}</p>
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => <span key={c} className="rounded-full bg-black/25 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm sm:text-xs">{c}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
