import React from 'react';
import { X, BookOpen, Download, ExternalLink, PenTool, FileText } from 'lucide-react';

export default function BookModal({ isOpen, onClose, onOpenBook }) {
  if (!isOpen) return null;

  const books = [
    {
      id: 'original',
      title: 'এসো আরবী শিখি (মূল কিতাব)',
      pages: '৪৪৬ পৃষ্ঠা • সম্পূর্ণ ৩টি খণ্ড',
      desc: 'হযরত মাওলানা আবু তাহের মেছবাহ (দা. বা.) বিরচিত মূল পাঠ্যবই। সকল মৌলিক শব্দভাণ্ডার, ব্যাকরণ ও অনুবাদের মূল সংস্করণ।',
      badge: 'মূল মুদ্রিত কিতাব',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      icon: BookOpen,
      iconColor: 'bg-emerald-600 text-white',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1_sV5FDmBa5VrtdbT4TToaD5HnkGANQSM',
      downloadName: 'eso_arbi_shikhi_original_book.pdf',
      driveLink: 'https://drive.google.com/file/d/1_sV5FDmBa5VrtdbT4TToaD5HnkGANQSM/view?usp=sharing'
    },
    {
      id: 'tamrin',
      title: 'আত-তামরীনুল কিতাবী (অনুশীলন খাতা)',
      pages: '২৪৭ পৃষ্ঠা • তামরীন ও তারকীব',
      desc: '৭০টি পাঠের প্রতিটি অনুশীলন, শূন্যস্থান পূরণ, বাক্য গঠন ও পূর্ণাঙ্গ তারকীব অনুশীলনের প্রামাণ্য হস্তলিখিত তামরীন খাতা।',
      badge: 'অনুশীলন খাতা',
      badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
      icon: PenTool,
      iconColor: 'bg-amber-600 text-white',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1hpstC8kcngf4dqFhta0gAVxzsfFJ7Q1V',
      downloadName: 'at_tamrinul_kitabi.pdf',
      driveLink: 'https://drive.google.com/file/d/1hpstC8kcngf4dqFhta0gAVxzsfFJ7Q1V/view?usp=sharing'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                মূল মুদ্রিত কিতাব ও তামরীন (PDF ভিউয়ার)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                হযরত মাওলানা আবু তাহের মেছবাহ (দা. বা.) বিরচিত মূল কিতাবদ্বয়
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Two Book Cards */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => {
              const Icon = book.icon;
              return (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${book.badgeColor}`}>
                        <Icon size={13} />
                        {book.badge}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {book.pages}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {book.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {book.desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenBook(book.id);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center shadow-xs cursor-pointer"
                    >
                      অনলাইনে পড়ুন
                    </button>

                    <a
                      href={book.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-all inline-flex items-center justify-center cursor-pointer"
                      title="অফলাইন PDF ডাউনলোড"
                    >
                      <Download size={16} />
                    </a>

                    <a
                      href={book.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-all inline-flex items-center justify-center cursor-pointer"
                      title="গুগল ড্রাইভ ফুলস্ক্রিন"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>মারকাযুল ঈমান ডিজিটাল সংস্করণ</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
