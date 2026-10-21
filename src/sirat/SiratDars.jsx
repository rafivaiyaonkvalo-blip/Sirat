import { useRoute } from './router';
import { useProgress } from './progress';
import DarsView from './DarsView';
import PorboView from './PorboView';
import NotFound from './NotFound';

const num = (s) => (/^\d+$/.test(s || '') ? Number(s) : NaN);

// দারস ট্যাবের ভেতরের নেভিগেশন (হ্যাশ: #/dars/৩/২/text)
export default function SiratDars() {
  const path = useRoute();
  const progress = useProgress();
  const seg = path.split('/').filter(Boolean);
  if (seg.length === 0 || (seg[0] === 'dars' && seg.length === 1)) return <DarsView progress={progress} />;
  if (seg[0] !== 'dars') return <DarsView progress={progress} />;
  if (seg[1] === 'deep') return <DarsView progress={progress} mode="deep" />;
  if (seg.length === 2 && num(seg[1])) return <DarsView id={num(seg[1])} progress={progress} />;
  if ((seg.length === 3 || seg.length === 4) && num(seg[1]) && num(seg[2])) return <PorboView id={num(seg[1])} no={num(seg[2])} step={seg[3] || 'video'} progress={progress} />;
  return <NotFound />;
}
