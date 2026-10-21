import { DarsGrid } from './Home';

export default function DarsList({ progress }) {
  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-brand-700 dark:text-brand-200">দারস</h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">একটি দারস বেছে নিন; প্রতিটি দারস অনেকগুলো পর্বে সাজানো।</p>
      <DarsGrid progress={progress} />
    </div>
  );
}
