import { shuffle } from './shuffle';

/**
 * Visual Object Map for ULS Arabic (মারকাযুল ঈমান)
 * Maps pure Arabic vocabulary to Halal-compliant Lucide icons & emojis
 */

// Helper to strip Tashkeel for fuzzy matching
export function stripHarakat(text = '') {
  return text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

export const VISUAL_OBJECT_DICT = {
  // Study & Madrasa
  'كتاب': { icon: 'BookOpen', bangla: 'বই', emoji: '📖', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  'قلم': { icon: 'PenTool', bangla: 'কলম', emoji: '🖋️', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  'سبورة': { icon: 'LayoutGrid', bangla: 'ব্ল্যাকবোর্ড', emoji: '📋', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  'مسطرة': { icon: 'Maximize2', bangla: 'রুলার', emoji: '📏', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  'حقيبة': { icon: 'ShoppingBag', bangla: 'ব্যাগ', emoji: '🎒', color: 'bg-rose-500/10 text-rose-600 border-rose-200' },
  'كراسة': { icon: 'Folder', bangla: 'খাতা', emoji: '📒', color: 'bg-teal-500/10 text-teal-600 border-teal-200' },
  'مدرسة': { icon: 'GraduationCap', bangla: 'মাদ্রাসা', emoji: '🏫', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },

  // House & Furniture
  'بيت': { icon: 'Home', bangla: 'ঘর', emoji: '🏠', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  'باب': { icon: 'DoorOpen', bangla: 'দরজা', emoji: '🚪', color: 'bg-amber-600/10 text-amber-700 border-amber-300' },
  'كرسي': { icon: 'Armchair', bangla: 'চেয়ার', emoji: '🪑', color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  'سرير': { icon: 'Bed', bangla: 'খাট', emoji: '🛏️', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200' },
  'مصباح': { icon: 'Sparkles', bangla: 'বাতি', emoji: '💡', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  'جدار': { icon: 'Columns', bangla: 'দেয়াল', emoji: '🧱', color: 'bg-slate-500/10 text-slate-600 border-slate-200' },
  'طاولة': { icon: 'Box', bangla: 'টেবিল', emoji: '🪵', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  'نافذة': { icon: 'Maximize', bangla: 'জানালা', emoji: '🪟', color: 'bg-sky-500/10 text-sky-600 border-sky-200' },
  'قفل': { icon: 'Lock', bangla: 'তালা', emoji: '🔒', color: 'bg-slate-500/10 text-slate-600 border-slate-200' },
  'مفتاح': { icon: 'Key', bangla: 'চাবি', emoji: '🔑', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  'ساعة': { icon: 'Clock', bangla: 'ঘড়ি', emoji: '⏰', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  'مظلة': { icon: 'Shield', bangla: 'ছাতা', emoji: '☂️', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  'صندوق': { icon: 'Box', bangla: 'বাক্স', emoji: '📦', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },

  // Places & Nature
  'مسجد': { icon: 'Landmark', bangla: 'মসজিদ', emoji: '🕌', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  'سيارة': { icon: 'Car', bangla: 'গাড়ি', emoji: '🚗', color: 'bg-red-500/10 text-red-600 border-red-200' },
  'دراجة': { icon: 'Compass', bangla: 'সাইকেল', emoji: '🚲', color: 'bg-teal-500/10 text-teal-600 border-teal-200' },
  'شجرة': { icon: 'Trees', bangla: 'গাছ', emoji: '🌳', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  'زهرة': { icon: 'Flower', bangla: 'ফুল', emoji: '🌸', color: 'bg-pink-500/10 text-pink-600 border-pink-200' },
  'حديقة': { icon: 'Trees', bangla: 'বাগান', emoji: '🏡', color: 'bg-green-500/10 text-green-600 border-green-200' }
};

export function getVisualData(arabicText = '') {
  const stripped = stripHarakat(arabicText);
  return VISUAL_OBJECT_DICT[stripped] || null;
}

/**
 * Returns a set of visual card options (1 correct + 3 distractors)
 */
export function getPictureCardOptions(correctArabic, correctBangla) {
  const correctVisual = getVisualData(correctArabic);
  const correctItem = {
    text: correctArabic,
    bangla: correctBangla || correctVisual?.bangla || 'বস্তু',
    icon: correctVisual?.icon || 'BookOpen',
    emoji: correctVisual?.emoji || '📖',
    color: correctVisual?.color || 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    isCorrect: true
  };

  const distractorKeys = Object.keys(VISUAL_OBJECT_DICT).filter(k => k !== stripHarakat(correctArabic));
  const shuffledKeys = shuffle(distractorKeys).slice(0, 3);

  const distractors = shuffledKeys.map(k => {
    const data = VISUAL_OBJECT_DICT[k];
    return {
      text: k,
      bangla: data.bangla,
      icon: data.icon,
      emoji: data.emoji,
      color: data.color,
      isCorrect: false
    };
  });

  return shuffle([correctItem, ...distractors]);
}
