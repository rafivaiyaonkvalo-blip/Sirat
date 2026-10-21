import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, PenTool, ArrowLeft } from 'lucide-react';

export default function BookViewer({ onBack, initialBook = 'original' }) {
  // Active Book: 'original' (মূল কিতাব) or 'tamrin' (তামরীন)
  const [activeBook, setActiveBook] = useState(initialBook || 'original');

  const books = {
    original: {
      title: 'মূল কিতাব (এসো আরবী শিখি)',
      pages: '৪৪৬ পৃঃ',
      drivePreview: 'https://drive.google.com/file/d/1_sV5FDmBa5VrtdbT4TToaD5HnkGANQSM/preview',
      driveLink: 'https://drive.google.com/file/d/1_sV5FDmBa5VrtdbT4TToaD5HnkGANQSM/view?usp=sharing',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1_sV5FDmBa5VrtdbT4TToaD5HnkGANQSM',
      downloadName: 'eso_arbi_shikhi_original_book.pdf'
    },
    tamrin: {
      title: 'আত-তামরীনুল কিতাবী',
      pages: '২৪৭ পৃঃ',
      drivePreview: 'https://drive.google.com/file/d/1hpstC8kcngf4dqFhta0gAVxzsfFJ7Q1V/preview',
      driveLink: 'https://drive.google.com/file/d/1hpstC8kcngf4dqFhta0gAVxzsfFJ7Q1V/view?usp=sharing',
      downloadUrl: 'https://drive.google.com/uc?export=download&id=1hpstC8kcngf4dqFhta0gAVxzsfFJ7Q1V',
      downloadName: 'at_tamrinul_kitabi.pdf'
    }
  };

  const current = books[activeBook];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Sleek Minimal Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>পাঠ্যক্রমে ফিরুন</span>
            </button>
          )}

          {/* Book Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveBook('original')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeBook === 'original'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={15} />
            <span>মূল কিতাব</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 ml-1 hidden sm:inline">
              ৪৪৬ পৃঃ
            </span>
          </button>

          <button
            onClick={() => setActiveBook('tamrin')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeBook === 'tamrin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PenTool size={15} />
            <span>তামরীন</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 ml-1 hidden sm:inline">
              ২৪৯ পৃঃ
            </span>
          </button>
        </div>
      </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={current.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download size={14} />
            <span>ডাউনলোড</span>
          </a>

          <a
            href={current.driveLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <ExternalLink size={14} />
            <span>পূর্ণ পর্দা</span>
          </a>
        </div>
      </div>

      {/* Clean Distraction-Free Book Frame */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
        <iframe
          key={activeBook}
          src={current.drivePreview}
          title={current.title}
          className="w-full h-[82vh] min-h-[460px] sm:min-h-[620px] border-0"
          allow="autoplay"
        />
      </div>
    </div>
  );
}
