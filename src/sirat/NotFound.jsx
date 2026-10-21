import { href } from './router';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-bold text-emerald-500">৪০৪</p>
      <p className="mt-3">পাতাটি পাওয়া যায়নি।</p>
      <a href={href('/dars')} className="mt-4 inline-block font-semibold text-emerald-600">দারসে ফিরুন</a>
    </div>
  );
}
