import { BookOpen, ShoppingCart } from 'lucide-react';
import { book } from './brand';
import { getAssetUrl } from '../utils/assetHelper';

export default function BookPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">বই</h1>
      <div className="mt-6 flex flex-col items-center gap-6 rounded-3xl border border-emerald-100 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:flex-row sm:items-start">
        <div className="flex aspect-[3/4] w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-900 text-emerald-200 shadow-lg">
          {book.cover ? <img src={getAssetUrl(book.cover)} alt={book.title} className="h-full w-full object-cover" /> : <BookOpen size={56} strokeWidth={1.3} />}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <p className="text-slate-600 dark:text-slate-300">{book.subtitle}</p>
          <p className="mt-2 text-sm text-slate-500">সংকলন ও সম্পাদনা: {book.author}</p>
          {book.price && <p className="mt-3 text-2xl font-bold text-emerald-700 dark:text-emerald-200">{book.price}</p>}
          {book.orderUrl ? (
            <a href={book.orderUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white"><ShoppingCart size={18} /> অর্ডার করুন</a>
          ) : (
            <p className="mt-4 inline-block rounded-full bg-amber-100 dark:bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-300">বইটি শিগগিরই প্রকাশিত হবে, ইন শা আল্লাহ</p>
          )}
        </div>
      </div>
      <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">এই ওয়েবসাইটে কিতাবের পাঠ দারস ও পাঠ আকারে সহায়ক হিসেবে দেওয়া আছে; মূল কিতাবটি ছাপা আকারে সংগ্রহ করতে পারবেন।</p>
    </div>
  );
}
