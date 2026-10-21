import { href } from '../utils/router';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-bold text-brand-500">৪০৪</p>
      <p className="mt-3">পাতাটি পাওয়া যায়নি।</p>
      <a href={href('/')} className="mt-4 inline-block font-semibold text-brand-600">হোমে ফিরুন</a>
    </div>
  );
}
