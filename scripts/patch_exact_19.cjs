const fs = require('fs');
const path = require('path');

const roadmapCode = `import React from 'react';
import { 
  Star, CheckCircle2, Trophy, Flame, Play, Sparkles, BookOpen, Compass, Award 
} from 'lucide-react';

export default function DuolingoRoadmap({ 
  lessonsData, 
  progress = {}, 
  selectedLevelId = 1, 
  onSelectLevel, 
  onStartLesson 
}) {
  const currentLevel = lessonsData.levels.find(l => l.id === selectedLevelId) || lessonsData.levels[0];
  const chapters = currentLevel.chapters || [];

  // Calculate total XP and stats from progress
  const completedLessons = Object.values(progress).filter(p => p && p.completed);
  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p?.stars || (p?.completed ? 3 : 0)), 0);
  const totalXp = completedLessons.length * 20;

  // Offsets for the Duolingo winding snake path
  const stepOffsets = [
    'translate-x-0',
    '-translate-x-10 sm:-translate-x-16',
    '-translate-x-6 sm:-translate-x-10',
    'translate-x-0',
    'translate-x-8 sm:translate-x-14',
    'translate-x-12 sm:translate-x-20',
    'translate-x-6 sm:translate-x-10',
    'translate-x-0',
    '-translate-x-8 sm:-translate-x-12'
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Duolingo Header Stats Bar */}
      <div className="sticky top-20 z-30 mb-8 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Level Switcher Dropdown */}
          <select
            value={selectedLevelId}
            onChange={(e) => onSelectLevel(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 outline-none cursor-pointer"
          >
            {lessonsData.levels.map(lvl => (
              <option key={lvl.id} value={lvl.id}>{lvl.volume}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Flame size={18} className="fill-amber-500 animate-pulse" />
            <span>৩ দিন</span>
          </div>

          <div className="flex items-center gap-1.5 text-yellow-500">
            <Star size={18} className="fill-yellow-500" />
            <span>{totalStars}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Trophy size={18} className="fill-emerald-500" />
            <span>{totalXp} XP</span>
          </div>
        </div>
      </div>

      {/* Chapters & Winding Path */}
      <div className="space-y-12">
        {chapters.map((chapter, chIdx) => {
          const chapterLessons = lessonsData.lessons.filter(l => l.chapterId === chapter.id);

          return (
            <div key={chapter.id} className="relative">
              {/* Duolingo Unit Banner */}
              <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-2">
                      অধ্যায় {chIdx + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-arabic">
                      {chapter.arabicTitle}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Compass size={24} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Snake Roadmap Lesson Nodes */}
              <div className="flex flex-col items-center gap-7 sm:gap-9 relative py-4">
                {chapterLessons.map((lesson, lIdx) => {
                  const isCompleted = progress[lesson.id]?.completed;
                  const offsetClass = stepOffsets[lIdx % stepOffsets.length];
                  const isActive = !isCompleted && (lIdx === 0 || progress[chapterLessons[lIdx - 1]?.id]?.completed);

                  return (
                    <div 
                      key={lesson.id} 
                      className={\`flex flex-col items-center transition-transform duration-300 \${offsetClass}\`}
                    >
                      {/* Floating 'Start' tooltip for active node */}
                      {isActive && (
                        <div className="animate-bounce mb-2">
                          <div className="px-3.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1">
                            <Sparkles size={12} />
                            <span>শুরু করুন!</span>
                          </div>
                        </div>
                      )}

                      {/* 3D Circular Duolingo Node Button */}
                      <button
                        onClick={() => onStartLesson(lesson)}
                        className={\`group relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 active:shadow-none cursor-pointer \${
                          isCompleted
                            ? 'bg-emerald-500 border-b-6 border-emerald-700 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400'
                            : isActive
                            ? 'bg-emerald-600 border-b-6 border-emerald-800 text-white shadow-xl shadow-emerald-600/40 ring-4 ring-emerald-400/40 animate-pulse hover:bg-emerald-500'
                            : 'bg-slate-100 dark:bg-slate-800 border-b-6 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-200 dark:hover:bg-slate-700'
                        }\`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={32} className="stroke-[2.5]" />
                        ) : isActive ? (
                          <Play size={30} className="fill-white translate-x-0.5" />
                        ) : (
                          <BookOpen size={26} className="text-slate-500 dark:text-slate-400" />
                        )}

                        {/* Stars badge for completed lessons */}
                        {isCompleted && (
                          <div className="absolute -bottom-2.5 flex items-center gap-0.5 bg-amber-400 px-2 py-0.5 rounded-full shadow-sm">
                            <Star size={10} className="fill-white text-white" />
                            <Star size={10} className="fill-white text-white" />
                            <Star size={10} className="fill-white text-white" />
                          </div>
                        )}
                      </button>

                      {/* Lesson Title Label */}
                      <div className="mt-2 text-center max-w-[140px]">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {lesson.title.split(':')[0]}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                          {lesson.title.split(':')[1] || lesson.subTitle}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;

const modalCode = `import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles, Award, RotateCcw, Heart 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playArabicAudio, prepareArabicForFullPronunciation } from '../utils/audio';

export default function DuolingoLessonModal({ lesson, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedBubbles, setSelectedBubbles] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Generate interactive challenge steps from lesson vocabulary
  const vocabList = lesson?.vocabulary || [];
  const sampleWords = vocabList.length > 0 ? vocabList : [
    { arabic: 'كِتَابٌ', bangla: 'একটি বই', transliteration: 'Kitābun' },
    { arabic: 'قَلَمٌ', bangla: 'একটি কলম', transliteration: 'Qalamun' },
    { arabic: 'مِفْتَاحٌ', bangla: 'একটি চাবি', transliteration: 'Miftāhun' },
    { arabic: 'سَاعَةٌ', bangla: 'একটি ঘড়ি', transliteration: 'Sā\'atun' }
  ];

  // Build steps
  const steps = [];

  // Step 1: Intro Card for 1st word
  if (sampleWords[0]) {
    steps.push({
      type: 'intro',
      word: sampleWords[0],
      title: 'নতুন শব্দ শিখুন'
    });
  }

  // Step 2: Meaning MCQ for 1st word
  if (sampleWords[0]) {
    const distractors = sampleWords.filter(w => w.arabic !== sampleWords[0].arabic).slice(0, 3);
    const options = [
      { text: sampleWords[0].bangla, isCorrect: true },
      ...distractors.map(d => ({ text: d.bangla, isCorrect: false }))
    ].sort(() => 0.5 - Math.random());

    steps.push({
      type: 'mcq',
      word: sampleWords[0],
      question: \`"\${sampleWords[0].arabic}" এর বাংলা অর্থ কী?\`,
      options
    });
  }

  // Step 3: Intro Card for 2nd word
  if (sampleWords[1]) {
    steps.push({
      type: 'intro',
      word: sampleWords[1],
      title: 'পরবর্তী নতুন শব্দ'
    });
  }

  // Step 4: Word Bank Bubble Sentence Builder
  // e.g. "هٰذَا كِتَابٌ" -> bubbles: ["هٰذَا", "كِتَابٌ", "قَلَمٌ", "ذٰلِكَ"]
  const sentenceWord = sampleWords[0];
  const targetArabic = \`هٰذَا \${sentenceWord.arabic}\`;
  const targetBangla = \`ইহা \${sentenceWord.bangla}\`;
  const targetTokens = ['هٰذَا', sentenceWord.arabic];
  const scrambledTokens = ['هٰذَا', sentenceWord.arabic, 'ذٰلِكَ', sampleWords[1]?.arabic || 'قَلَمٌ'].sort(() => 0.5 - Math.random());

  steps.push({
    type: 'bubble_builder',
    targetArabic,
    targetBangla,
    targetTokens,
    availableTokens: scrambledTokens,
    title: 'শব্দ সাজিয়ে বাক্য গঠন করুন'
  });

  // Step 5: Listen & Match
  const testWord = sampleWords[1] || sampleWords[0];
  const listenOptions = [
    { text: testWord.arabic, isCorrect: true },
    ...sampleWords.filter(w => w.arabic !== testWord.arabic).slice(0, 3).map(w => ({ text: w.arabic, isCorrect: false }))
  ].sort(() => 0.5 - Math.random());

  steps.push({
    type: 'listen_mcq',
    word: testWord,
    question: 'উচ্চারণ শুনে সঠিক আরবি শব্দটি নির্বাচন করুন:',
    options: listenOptions
  });

  const activeStep = steps[currentStep] || steps[0];
  const progressPercent = ((currentStep) / steps.length) * 100;

  // Automatically play audio when step appears
  useEffect(() => {
    if (!activeStep) return;
    if (activeStep.type === 'intro' || activeStep.type === 'listen_mcq') {
      setTimeout(() => {
        playArabicAudio(activeStep.word.arabic);
      }, 200);
    }
    setSelectedOption(null);
    setSelectedBubbles([]);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentStep]);

  // Handle MCQ Choice
  const handleCheckMCQ = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    setIsCorrect(opt.isCorrect);
    if (opt.isCorrect) setCorrectAnswersCount(prev => prev + 1);
  };

  // Handle Bubble Builder
  const handleToggleBubble = (token, tokenIdx) => {
    if (isAnswered) return;
    if (selectedBubbles.some(b => b.tokenIdx === tokenIdx)) {
      // Remove from selected
      setSelectedBubbles(prev => prev.filter(b => b.tokenIdx !== tokenIdx));
    } else {
      // Add to selected
      setSelectedBubbles(prev => [...prev, { token, tokenIdx }]);
    }
  };

  const handleCheckBubbleSentence = () => {
    if (isAnswered) return;
    const constructed = selectedBubbles.map(b => b.token).join(' ');
    const expected = activeStep.targetTokens.join(' ');
    const correct = constructed === expected;
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) setCorrectAnswersCount(prev => prev + 1);
  };

  // Continue to next step or complete
  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete lesson
      setIsFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onComplete) {
        onComplete(lesson.id, {
          completed: true,
          score: 100,
          stars: 3,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={22} />
          </button>

          {/* Duolingo Progress Bar */}
          <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-400"
              style={{ width: \`\${Math.max(progressPercent, 10)}%\` }}
            />
          </div>

          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <Sparkles size={16} />
            <span>+২০ XP</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {!isFinished ? (
            <div>
              {/* Mode: Intro Word */}
              {activeStep.type === 'intro' && (
                <div className="text-center py-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    {activeStep.title}
                  </span>

                  <div className="my-6">
                    <h2 className="text-5xl sm:text-6xl font-arabic font-bold text-slate-900 dark:text-white leading-relaxed">
                      {activeStep.word.arabic}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                      [{activeStep.word.transliteration}]
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {activeStep.word.bangla}
                    </h3>
                  </div>

                  <button
                    onClick={() => playArabicAudio(activeStep.word.arabic)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-bold text-sm hover:bg-emerald-200 transition-all cursor-pointer"
                  >
                    <Volume2 size={18} />
                    <span>উচ্চারণ শুনুন (ওয়াকফ ছাড়া)</span>
                  </button>
                </div>
              )}

              {/* Mode: MCQ */}
              {activeStep.type === 'mcq' && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {activeStep.question}
                  </h3>
                  <div className="my-6 text-center">
                    <span className="text-4xl sm:text-5xl font-arabic font-bold text-slate-900 dark:text-white">
                      {activeStep.word.arabic}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeStep.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleCheckMCQ(opt)}
                        className={\`p-4 rounded-2xl border-2 text-left font-bold text-base transition-all cursor-pointer \${
                          selectedOption === opt
                            ? opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                              : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }\`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode: Word Bank Bubble Builder */}
              {activeStep.type === 'bubble_builder' && (
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {activeStep.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    বাংলা: <span className="font-bold text-slate-800 dark:text-slate-200">"{activeStep.targetBangla}"</span>
                  </p>

                  {/* Constructed sentence slot */}
                  <div className="min-h-[70px] p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center gap-2 mb-6">
                    {selectedBubbles.length > 0 ? (
                      selectedBubbles.map((b) => (
                        <button
                          key={b.tokenIdx}
                          onClick={() => handleToggleBubble(b.token, b.tokenIdx)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-arabic font-bold text-xl shadow-md cursor-pointer animate-scale-up"
                        >
                          {b.token}
                        </button>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-medium mx-auto">
                        নিচের বাবল শব্দগুলোতে ট্যাপ করে বাক্য তৈরি করুন
                      </span>
                    )}
                  </div>

                  {/* Available word bank bubbles */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    {activeStep.availableTokens.map((token, idx) => {
                      const isChosen = selectedBubbles.some(b => b.tokenIdx === idx);
                      return (
                        <button
                          key={idx}
                          disabled={isChosen || isAnswered}
                          onClick={() => handleToggleBubble(token, idx)}
                          className={\`px-4 py-2.5 rounded-xl border-2 font-arabic font-bold text-xl transition-all cursor-pointer \${
                            isChosen
                              ? 'opacity-30 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm hover:border-emerald-500'
                          }\`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mode: Listen & Match */}
              {activeStep.type === 'listen_mcq' && (
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
                    {activeStep.question}
                  </h3>

                  <div className="text-center my-6">
                    <button
                      onClick={() => playArabicAudio(activeStep.word.arabic)}
                      className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/40 hover:bg-emerald-500 transition-all cursor-pointer animate-pulse"
                    >
                      <Volume2 size={36} />
                    </button>
                    <p className="mt-2 text-xs text-slate-400">আবার শুনতে ক্লিক করুন</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeStep.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleCheckMCQ(opt)}
                        className={\`p-4 rounded-2xl border-2 text-center font-arabic font-bold text-2xl transition-all cursor-pointer \${
                          selectedOption === opt
                            ? opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                              : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }\`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Duolingo Completion Fanfare */
            <div className="text-center py-6 animate-scale-up">
              <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center mx-auto mb-5 shadow-lg border-2 border-amber-300">
                <Award size={48} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                দারুণ! পাঠ সম্পন্ন হয়েছে!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                মাশাআল্লাহ! আপনি সফলভাবে এই পাঠটি সম্পন্ন করেছেন।
              </p>

              <div className="grid grid-cols-3 gap-3 my-8 max-w-sm mx-auto">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-400 block">মোট অর্জিত</span>
                  <span className="text-lg font-bold text-emerald-600">+২০ XP</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-400 block">স্টার রেটিং</span>
                  <span className="text-lg font-bold text-amber-500">★★★</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-400 block">সঠিকতা</span>
                  <span className="text-lg font-bold text-teal-600">১০০%</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                রোডম্যাপে ফিরে যান
              </button>
            </div>
          )}
        </div>

        {/* Bottom Action / Feedback Drawer */}
        {!isFinished && (
          <div className={\`p-4 sm:p-5 border-t transition-all \${
            !isAnswered
              ? 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
              : isCorrect
              ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/80'
              : 'border-rose-300 bg-rose-50 dark:bg-rose-950/80'
          }\`}>
            <div className="flex items-center justify-between gap-4">
              {isAnswered ? (
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-emerald-900 dark:text-emerald-100 text-base">
                          দারুণ! সঠিক উত্তর!
                        </h4>
                        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                          চালিয়ে যান
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                        <XCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-rose-900 dark:text-rose-100 text-base">
                          ভুল হয়েছে!
                        </h4>
                        <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                          পরেরটিতে চেষ্টা করুন
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  {activeStep.type === 'bubble_builder' ? 'শব্দ সাজিয়ে চেক করুন' : 'উত্তর নির্বাচন করুন'}
                </span>
              )}

              {/* Action Button */}
              {activeStep.type === 'intro' ? (
                <button
                  onClick={handleContinue}
                  className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  চালিয়ে যান
                </button>
              ) : activeStep.type === 'bubble_builder' && !isAnswered ? (
                <button
                  disabled={selectedBubbles.length === 0}
                  onClick={handleCheckBubbleSentence}
                  className={\`px-7 py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer \${
                    selectedBubbles.length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }\`}
                >
                  যাচাই করুন
                </button>
              ) : isAnswered ? (
                <button
                  onClick={handleContinue}
                  className={\`px-8 py-3 rounded-2xl font-extrabold text-sm shadow-md transition-all cursor-pointer \${
                    isCorrect
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  }\`}
                >
                  পরবর্তী ধাপ
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'DuolingoRoadmap.jsx'), roadmapCode, 'utf-8');
console.log('Created DuolingoRoadmap.jsx');

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'DuolingoLessonModal.jsx'), modalCode, 'utf-8');
console.log('Created DuolingoLessonModal.jsx');
