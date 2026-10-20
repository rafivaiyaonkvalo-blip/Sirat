/**
 * এসো আরবী শিখি - গতিশীল পাঠভিত্তিক সাব-সেকশন (Dynamic Lesson Stages Architecture)
 * মারকাযুল ঈমান (Markazul Iman) - https://markazuliman.com
 *
 * প্রতিটি পাঠের প্রকৃত উপাদান (শব্দভাণ্ডার, বাক্য, কথন, তামরীন ও কুইজ) অনুযায়ী
 * স্বয়ংক্রিয়ভাবে নিখুঁত ও ভারসাম্যপূর্ণ পেডাগজিক্যাল ইউনিটে বিভক্ত করা হয়:
 * - Case 1: জিরো/মাইক্রো শব্দকোষ (পরিচ্ছন্ন শব্দ <= ৫): ২ ধাপ
 * - Case 2: সাধারণ শব্দকোষ (পরিচ্ছন্ন শব্দ ৬-২৫): ৩ ধাপ
 * - Case 3: ঘন শব্দকোষ (পরিচ্ছন্ন শব্দ > ২৫): ৪ ধাপ
 */

import { getBookParts } from './bookParts';
import { isSuperUser } from './superUser';
import lessonsData from '../data/lessons.json';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return '';
  return String(num).replace(/\d/g, d => BENGALI_DIGITS[d]);
};

/**
 * ফিল্টার: ব্যাকরণিক বাক্য বা লম্বা প্যারাগ্রাফকে শব্দকার্ড হিসেবে গণ্য না করে
 * ১ বা ২ শব্দের বিশুদ্ধ আরবি শব্দভাণ্ডার শনাক্ত করে।
 */
export function isCleanVocabItem(item) {
  if (!item || typeof item !== 'object' || !item.arabic) return false;
  // প্রশ্নবোধক বা পূর্ণচ্ছেদ থাকলে তা বাক্য/কথোপকথন, শব্দ নয়
  if (/[؟\?\.]/.test(item.arabic)) return false;

  // বন্ধনীতে থাকা বাংলা বা অতিরিক্ত টীকা যেমন "(বহুবচন: ...)" অপসারণ
  const stripped = item.arabic.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();

  // ইসমুল ইশারা + বিশেষ্য (যেমন: هٰذَا كِتَابٌ বা تِلْكَ سَبُّورَةٌ) বাক্য হিসেবে গণ্য হবে, শব্দ নয়
  if (/^(هٰذَا|هٰذِهِ|ذٰلِكَ|تِلْكَ)\s+[\u0600-\u06FF]+/i.test(stripped) && !stripped.includes('-') && !stripped.includes('/')) {
    return false;
  }

  // আরবি হরফের শব্দ সংখ্যা গণনা
  const words = stripped.split(/[\s\-\/]+/).filter(w => /[\u0600-\u06FF]/.test(w));
  return words.length >= 1 && words.length <= 2;
}

/**
 * পাঠের কেবল বিশুদ্ধ ও পরিচ্ছন্ন শব্দভাণ্ডার তালিকা রিটার্ন করে
 */
export function getCleanVocabulary(lesson) {
  if (!lesson || !Array.isArray(lesson.vocabulary)) return [];
  return lesson.vocabulary.filter(isCleanVocabItem);
}

/**
 * লেগ্যাসি ব্যাকওয়ার্ড কম্প্যাটিবিলিটির জন্য প্রমিত উপ-পাঠের মাস্টার তালিকা
 */
export const LESSON_SUB_UNITS = [
  {
    id: 'vocab',
    num: 1,
    titleBn: 'মৌলিক শব্দভাণ্ডার ও জোড় মেলানো',
    titleAr: 'المُفْرَدَاتُ وَالتَّطْبِيقَاتُ',
    shortTitle: 'শব্দার্থ ও রূপ',
    desc: 'নতুন শব্দার্থ পরিচয়, বিশুদ্ধ হরকত উচ্চারণ ও শব্দজোড় মেলানো',
    iconName: 'BookOpen',
    color: 'emerald',
    badge: 'পর্ব ১/৪',
    estMinutes: 4
  },
  {
    id: 'sentences',
    num: 2,
    titleBn: 'কিতাবের বাক্য ও অনুশীলন',
    titleAr: 'الجُمَلُ وَالتَّطْبِيقُ',
    shortTitle: 'বাক্য ও রূপ',
    desc: 'প্রমিত বাক্যগঠন, বাবল সাজিয়ে রূপান্তর ও বিশুদ্ধ প্রয়োগ অনুশীলন',
    iconName: 'Sparkles',
    color: 'teal',
    badge: 'পর্ব ২/৪',
    estMinutes: 5
  },
  {
    id: 'dialogues',
    num: 3,
    titleBn: 'প্রশ্নোত্তর ও বাস্তবমুখী কথোপকথন',
    titleAr: 'الحِوَارُ وَالسُّؤَالُ وَالجَوَابُ',
    shortTitle: 'প্রশ্নোত্তর ও কথন',
    desc: 'বাস্তব জীবনের প্রশ্ন-উত্তর, শ্রুতি ও বিশুদ্ধ উচ্চারণ অনুশীলন',
    iconName: 'MessageSquare',
    color: 'cyan',
    badge: 'পর্ব ৩/৪',
    estMinutes: 3
  },
  {
    id: 'tamrin_quiz',
    num: 4,
    titleBn: 'কিতাবী তামরীন ও মাস্টারী কুইজ',
    titleAr: 'التَّمْرِينُ الكِتَابِيُّ وَالاخْتِبَارُ',
    shortTitle: 'তামরীন ও কুইজ',
    desc: 'আত-তামরীনুল কিতাবীর অনুশীলন সমাধান ও মেধা যাচাই কুইজ',
    iconName: 'Trophy',
    color: 'amber',
    badge: 'পর্ব ৪/৪',
    estMinutes: 4
  }
];

/**
 * পাঠের ডেটা পর্যালোচনা করে গতিশীল ও ভারসাম্যপূর্ণ সাব-সেকশন ধাপসমূহ তৈরি করে
 * প্রতিটি পাঠ কঠোরভাবে ৬ থেকে ১০টি সুনির্দিষ্ট উপ-পাঠে বিভক্ত
 */
export function getDynamicLessonStages(lessonOrId) {
  const lesson = typeof lessonOrId === 'object' && lessonOrId !== null
    ? lessonOrId
    : (lessonsData?.lessons?.find(l => l.id === lessonOrId) || { id: lessonOrId });

  if (!lesson) return LESSON_SUB_UNITS;

  // কিতাবভিত্তিক দারস: উপ-পাঠ ও ধাপ সরাসরি কিতাবের ক্রমে ডেটায় লেখা
  // বড় পর্বগুলো ছোট ছোট পর্বে ভাগ করা (bookParts.js)
  if (Array.isArray(lesson.bookStages) && lesson.bookStages.length > 0) {
    const parts = getBookParts(lesson);
    const total = parts.length;
    return parts.map((stage, idx) => ({
      id: stage.id,
      num: idx + 1,
      titleBn: stage.titleBn,
      titleAr: stage.titleAr,
      shortTitle: stage.shortTitle,
      desc: stage.desc,
      iconName: stage.iconName,
      color: stage.color,
      badge: `পর্ব ${toBengaliNumber(idx + 1)}/${toBengaliNumber(total)}`,
      estMinutes: stage.estMinutes,
      itemCountStr: `${toBengaliNumber(stage.stepCount ?? stage.steps?.length ?? 0)}টি কিতাবের ধাপ + অনুশীলন • কিতাব পৃ. ${stage.bookPages}`,
      bookPages: stage.bookPages,
      parentId: stage.parentId
    }));
  }

  const isChapter1 = lesson?.chapterId === 'vol1-ch1' || (typeof lesson?.id === 'string' && lesson.id.startsWith('vol1-ch1-')) || (lesson?.volumeId === 1 && lesson?.lessonNumberInChapter <= 9 && (lesson?.chapterId === 'vol1-ch1' || !lesson?.chapterId));

  const cleanVocab = getCleanVocabulary(lesson);
  const cleanCount = cleanVocab.length;
  const sentencesCount = lesson.sentences?.length || 0;
  const dialoguesCount = lesson.dialogues?.length || 0;
  const quizCount = lesson.quiz?.length || 0;
  const tamrinCount = lesson.tamrinKitabi?.length || 0;

  const sentMid = Math.ceil(sentencesCount / 2);
  const sentP1Count = sentMid;
  const sentP2Count = sentencesCount - sentMid;

  const dlgMid = Math.ceil(dialoguesCount / 2);
  const dlgP1Count = dlgMid;
  const dlgP2Count = dialoguesCount - dlgMid;

  // Case 1: মাইক্রো শব্দকোষ (পরিচ্ছন্ন শব্দ <= ৬) -> ৭ ধাপ
  if (cleanCount <= 6) {
    const total = 7;
    return [
      {
        id: 'core_grammar_intro',
        num: 1,
        titleBn: cleanCount > 0 ? 'প্রাথমিক শব্দ ও বাক্য' : 'প্রাথমিক বাক্য পরিচিতি',
        titleAr: 'المُفْرَدَاتُ وَالجُمَلُ',
        shortTitle: cleanCount > 0 ? 'শব্দ ও বাক্য' : 'মূল বাক্য',
        desc: 'পাঠের মূল শব্দার্থ ও প্রাথমিক বাক্য গঠন অনুশীলন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ১/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: cleanCount > 0 ? `${cleanCount}টি শব্দ ও বাক্য` : 'বাক্য ও অনুশীলন',
        cleanVocabCount: cleanCount
      },
      {
        id: 'sentences_p1',
        num: 2,
        titleBn: 'বাক্য গঠন - ১ম অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (١)',
        shortTitle: 'বাক্য (১ম)',
        desc: 'কিতাবের প্রমিত বাক্যগঠন, বাবল সাজিয়ে শব্দ সংযোজন ও অনুশীলন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও অনুশীলন`
      },
      {
        id: 'sentences_p2',
        num: 3,
        titleBn: 'বাক্য গঠন - ২য় অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (٢)',
        shortTitle: 'বাক্য (২য়)',
        desc: 'অগ্রসর বাক্য অনুশীলন, বাবল বিন্যাস ও অর্থ অনুধাবন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
      {
        id: 'dialogues_p1',
        num: 4,
        titleBn: 'কথোপকথন - ১ম অংশ',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
        shortTitle: 'কথন (১ম)',
        desc: 'বাস্তব জীবনের প্রাথমিক প্রশ্নোত্তর, বিশুদ্ধ শ্রবণ ও কথন অনুশীলন',
        iconName: 'MessageSquare',
        color: 'cyan',
        badge: `পর্ব ৪/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP1Count}টি কথোপকথন`
      },
      {
        id: 'dialogues_p2',
        num: 5,
        titleBn: 'কথোপকথন - ২য় অংশ',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
        shortTitle: 'কথন (২য়)',
        desc: 'অগ্রসর ও প্রাঞ্জল কথোপকথন, আরবি শ্রবণ ও সাবলীল জবাব',
        iconName: 'MessageSquare',
        color: 'cyan',
        badge: `পর্ব ৫/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP2Count}টি কথোপকথন`
      },
      {
        id: 'tamrin_p1',
        num: 6,
        titleBn: 'কিতাবী তামরীন ও অনুশীলন',
        titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
        shortTitle: 'কিতাবী তামরীন',
        desc: 'আত-তামরীনুল কিতাবীর অনুশীলন সমাধান ও রূপান্তর দক্ষতা',
        iconName: 'Trophy',
        color: 'amber',
        badge: `পর্ব ৬/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
      },
      {
        id: 'quiz_mastery',
        num: 7,
        titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
        titleAr: 'الاخْتِبَارُ النِّهَائِيُّ وَالمَهَارَةُ',
        shortTitle: 'মাস্টারী কুইজ',
        desc: 'পাঠের অর্জিত দক্ষতার চূড়ান্ত মেধা যাচাই ও ৩-স্টার সনদ',
        iconName: 'Trophy',
        color: 'amber',
        badge: `পর্ব ৭/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${quizCount}টি মেধা যাচাই কুইজ`
      }
    ];
  }

  // Case 2: সাধারণ শব্দকোষ (পরিচ্ছন্ন শব্দ ৭-২০) -> ৮ ধাপ
  if (cleanCount <= 20) {
    const total = 8;
    const vMid = Math.ceil(cleanCount / 2);
    const v1Count = vMid;
    const v2Count = cleanCount - vMid;

    return [
      {
        id: 'vocab_b1',
        num: 1,
        titleBn: 'শব্দভাণ্ডার - ১ম অংশ',
        titleAr: 'المُفْرَدَاتُ (١)',
        shortTitle: 'শব্দার্থ (১ম)',
        desc: 'প্রাথমিক মৌলিক শব্দভাণ্ডার পরিচয় ও বিশুদ্ধ উচ্চারণ',
        iconName: 'BookOpen',
        color: 'emerald',
        badge: `পর্ব ১/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v1Count}টি শব্দার্থ ও অনুশীলন`,
        cleanVocabCount: v1Count
      },
      {
        id: 'vocab_b2',
        num: 2,
        titleBn: 'শব্দভাণ্ডার - ২য় অংশ',
        titleAr: 'المُفْرَدَاتُ (٢)',
        shortTitle: 'শব্দার্থ (২য়)',
        desc: 'অগ্রসর শব্দভাণ্ডার, হরকত অনুধাবন ও দ্রুত শব্দজোড় মেলানো',
        iconName: 'BookOpen',
        color: 'emerald',
        badge: `পর্ব ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v2Count}টি শব্দার্থ ও জোড়`,
        cleanVocabCount: v2Count
      },
      {
        id: 'sentences_p1',
        num: 3,
        titleBn: 'বাক্য গঠন - ১ম অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (١)',
        shortTitle: 'বাক্য (১ম)',
        desc: 'কিতাবের প্রমিত বাক্যগঠন, বাবল সাজিয়ে শব্দ সংযোজন ও অনুশীলন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও অনুশীলন`
      },
      {
        id: 'sentences_p2',
        num: 4,
        titleBn: 'বাক্য গঠন - ২য় অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (٢)',
        shortTitle: 'বাক্য (২য়)',
        desc: 'অগ্রসর বাক্য অনুশীলন, বাবল বিন্যাস ও অর্থ অনুধাবন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৪/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
      {
        id: 'dialogues_p1',
        num: 5,
        titleBn: 'কথোপকথন - ১ম অংশ',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
        shortTitle: 'কথন (১ম)',
        desc: 'বাস্তব জীবনের প্রাথমিক প্রশ্নোত্তর, বিশুদ্ধ শ্রবণ ও কথন অনুশীলন',
        iconName: 'MessageSquare',
        color: 'cyan',
        badge: `পর্ব ৫/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP1Count}টি কথোপকথন`
      },
      {
        id: 'dialogues_p2',
        num: 6,
        titleBn: 'কথোপকথন - ২য় অংশ',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
        shortTitle: 'কথন (২য়)',
        desc: 'অগ্রসর ও প্রাঞ্জল কথোপকথন, আরবি শ্রবণ ও সাবলীল জবাব',
        iconName: 'MessageSquare',
        color: 'cyan',
        badge: `পর্ব ৬/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP2Count}টি কথোপকথন`
      },
      {
        id: 'tamrin_p1',
        num: 7,
        titleBn: 'কিতাবী তামরীন ও অনুশীলন',
        titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
        shortTitle: 'কিতাবী তামরীন',
        desc: 'আত-তামরীনুল কিতাবীর অনুশীলন সমাধান ও রূপান্তর দক্ষতা',
        iconName: 'Trophy',
        color: 'amber',
        badge: `পর্ব ৭/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
      },
      {
        id: 'quiz_mastery',
        num: 8,
        titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
        titleAr: 'الاخْتِبَارُ النِّهَائِيُّ وَالمَهَارَةُ',
        shortTitle: 'মাস্টারী কুইজ',
        desc: 'পাঠের অর্জিত দক্ষতার চূড়ান্ত মেধা যাচাই ও ৩-স্টার সনদ',
        iconName: 'Trophy',
        color: 'amber',
        badge: `পর্ব ৮/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${quizCount}টি মেধা যাচাই কুইজ`
      }
    ];
  }

  // Case 3: বিস্তীর্ণ শব্দকোষ (পরিচ্ছন্ন শব্দ ২১-৪৫) -> ৯ ধাপ
  if (cleanCount <= 45) {
    const total = 9;
    const s1 = Math.ceil(cleanCount / 3);
    const s2 = Math.ceil((2 * cleanCount) / 3);
    const v1Count = s1;
    const v2Count = s2 - s1;
    const v3Count = cleanCount - s2;

    return [
      {
        id: 'vocab_b1',
        num: 1,
        titleBn: 'শব্দভাণ্ডার - ১ম অংশ',
        titleAr: 'المُفْرَدَاتُ (١)',
        shortTitle: 'শব্দার্থ (১ম)',
        desc: 'প্রাথমিক মৌলিক শব্দভাণ্ডার পরিচয় ও বিশুদ্ধ উচ্চারণ',
        iconName: 'BookOpen',
        color: 'emerald',
        badge: `পর্ব ১/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v1Count}টি শব্দার্থ ও অনুশীলন`,
        cleanVocabCount: v1Count
      },
      {
        id: 'vocab_b2',
        num: 2,
        titleBn: 'শব্দভাণ্ডার - ২য় অংশ',
        titleAr: 'المُفْرَدَاتُ (٢)',
        shortTitle: 'শব্দার্থ (২য়)',
        desc: 'অগ্রসর শব্দভাণ্ডার, হরকত অনুধাবন ও দ্রুত শব্দজোড় মেলানো',
        iconName: 'BookOpen',
        color: 'emerald',
        badge: `পর্ব ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v2Count}টি শব্দার্থ ও জোড়`,
        cleanVocabCount: v2Count
      },
      {
        id: 'vocab_b3',
        num: 3,
        titleBn: 'শব্দভাণ্ডার - ৩য় অংশ',
        titleAr: 'المُفْرَدَاتُ (٣)',
        shortTitle: 'শব্দার্থ (৩য়)',
        desc: 'বিস্তৃত শব্দকোষ চর্চা ও স্মৃতিতে শব্দ সংরক্ষণ',
        iconName: 'BookOpen',
        color: 'cyan',
        badge: `পর্ব ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v3Count}টি শব্দার্থ ও চর্চা`,
        cleanVocabCount: v3Count
      },
      {
        id: 'sentences_p1',
        num: 4,
        titleBn: 'বাক্য গঠন - ১ম অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (١)',
        shortTitle: 'বাক্য (১ম)',
        desc: 'কিতাবের প্রমিত বাক্যগঠন, বাবল সাজিয়ে শব্দ সংযোজন ও অনুশীলন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৪/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও অনুশীলন`
      },
      {
        id: 'sentences_p2',
        num: 5,
        titleBn: 'বাক্য গঠন - ২য় অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (٢)',
        shortTitle: 'বাক্য (২য়)',
        desc: 'অগ্রসর বাক্য অনুশীলন, বাবল বিন্যাস ও অর্থ অনুধাবন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৫/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
      {
        id: 'dialogues_p1',
        num: 6,
        titleBn: 'কথোপকথন - ১ম অংশ',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
        shortTitle: 'কথন (১ম)',
        desc: 'বাস্তব জীবনের প্রাথমিক প্রশ্নোত্তর, বিশুদ্ধ শ্রবণ ও কথন অনুশীলন',
        iconName: 'MessageSquare',
        color: 'cyan',
        badge: `পর্ব ৬/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP1Count}টি কথোপকথন`
      },
      {
        id: 'dialogues_p2',
        num: 7,
        titleBn: 'কথোপকথন - ২য় অংশ',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
        shortTitle: 'কথন (২য়)',
        desc: 'অগ্রসর ও প্রাঞ্জল কথোপকথন, আরবি শ্রবণ ও সাবলীল জবাব',
        iconName: 'MessageSquare',
        color: 'cyan',
        badge: `পর্ব ৭/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP2Count}টি কথোপকথন`
      },
      {
        id: 'tamrin_p1',
        num: 8,
        titleBn: 'কিতাবী তামরীন ও অনুশীলন',
        titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
        shortTitle: 'কিতাবী তামরীন',
        desc: 'আত-তামরীনুল কিতাবীর অনুশীলন সমাধান ও রূপান্তর দক্ষতা',
        iconName: 'Trophy',
        color: 'amber',
        badge: `পর্ব ৮/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
      },
      {
        id: 'quiz_mastery',
        num: 9,
        titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
        titleAr: 'الاخْتِبَارُ النِّهَائِيُّ وَالمَهَارَةُ',
        shortTitle: 'মাস্টারী কুইজ',
        desc: 'পাঠের অর্জিত দক্ষতার চূড়ান্ত মেধা যাচাই ও ৩-স্টার সনদ',
        iconName: 'Trophy',
        color: 'amber',
        badge: `পর্ব ৯/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${quizCount}টি মেধা যাচাই কুইজ`
      }
    ];
  }

  // Case 4: ঘন/মেগা শব্দকোষ (পরিচ্ছন্ন শব্দ > ৪৫) -> ১০ ধাপ
  const total = 10;
  const s1 = Math.ceil(cleanCount / 4);
  const s2 = Math.ceil((2 * cleanCount) / 4);
  const s3 = Math.ceil((3 * cleanCount) / 4);
  const v1Count = s1;
  const v2Count = s2 - s1;
  const v3Count = s3 - s2;
  const v4Count = cleanCount - s3;

  return [
      {
        id: 'vocab_b1',
        num: 1,
        titleBn: 'শব্দভাণ্ডার - ১ম অংশ',
        titleAr: 'المُفْرَدَاتُ (١)',
        shortTitle: 'শব্দার্থ (১ম)',
        desc: 'প্রাথমিক মৌলিক শব্দভাণ্ডার পরিচয় ও বিশুদ্ধ উচ্চারণ',
        iconName: 'BookOpen',
        color: 'emerald',
        badge: `পর্ব ১/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v1Count}টি শব্দার্থ ও অনুশীলন`,
        cleanVocabCount: v1Count
      },
      {
        id: 'vocab_b2',
        num: 2,
        titleBn: 'শব্দভাণ্ডার - ২য় অংশ',
        titleAr: 'المُفْرَدَاتُ (٢)',
        shortTitle: 'শব্দার্থ (২য়)',
        desc: 'অগ্রসর শব্দভাণ্ডার, হরকত অনুধাবন ও দ্রুত শব্দজোড় মেলানো',
        iconName: 'BookOpen',
        color: 'emerald',
        badge: `পর্ব ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v2Count}টি শব্দার্থ ও জোড়`,
        cleanVocabCount: v2Count
      },
      {
        id: 'vocab_b3',
        num: 3,
        titleBn: 'শব্দভাণ্ডার - ৩য় অংশ',
        titleAr: 'المُفْرَدَاتُ (٣)',
        shortTitle: 'শব্দার্থ (৩য়)',
        desc: 'বিস্তৃত শব্দকোষ চর্চা ও স্মৃতিতে শব্দ সংরক্ষণ',
        iconName: 'BookOpen',
        color: 'cyan',
        badge: `পর্ব ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v3Count}টি শব্দার্থ ও চর্চা`,
        cleanVocabCount: v3Count
      },
      {
        id: 'vocab_b4',
        num: 4,
        titleBn: 'শব্দভাণ্ডার - ৪র্থ অংশ',
        titleAr: 'المُفْرَدَاتُ (٤)',
        shortTitle: 'শব্দার্থ (৪র্থ)',
        desc: 'বিশেষ পরিপূরক শব্দকোষ ও সামগ্রিক শব্দজোড় সমাধান',
        iconName: 'BookOpen',
        color: 'cyan',
        badge: `পর্ব ৪/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v4Count}টি শব্দার্থ ও সমাধান`,
        cleanVocabCount: v4Count
      },
      {
        id: 'sentences_p1',
        num: 5,
        titleBn: 'বাক্য গঠন - ১ম অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (١)',
        shortTitle: 'বাক্য (১ম)',
        desc: 'কিতাবের প্রমিত বাক্যগঠন, বাবল সাজিয়ে শব্দ সংযোজন ও অনুশীলন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৫/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও অনুশীলন`
      },
      {
        id: 'sentences_p2',
        num: 6,
        titleBn: 'বাক্য গঠন - ২য় অংশ',
        titleAr: 'الجُمَلُ وَالتَّطْبِيقُ (٢)',
        shortTitle: 'বাক্য (২য়)',
        desc: 'অগ্রসর বাক্য অনুশীলন, বাবল বিন্যাস ও অর্থ অনুধাবন',
        iconName: 'Sparkles',
        color: 'teal',
        badge: `পর্ব ৬/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
    {
      id: 'dialogues_p1',
      num: 7,
      titleBn: 'কথোপকথন - ১ম অংশ',
      titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
      shortTitle: 'কথন (১ম)',
      desc: 'বাস্তব জীবনের প্রাথমিক প্রশ্নোত্তর, বিশুদ্ধ শ্রবণ ও কথন অনুশীলন',
      iconName: 'MessageSquare',
      color: 'cyan',
      badge: `পর্ব ৭/${toBengaliNumber(total)}`,
      estMinutes: 3,
      itemCountStr: `${dlgP1Count}টি কথোপকথন`
    },
    {
      id: 'dialogues_p2',
      num: 8,
      titleBn: 'কথোপকথন - ২য় অংশ',
      titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
      shortTitle: 'কথন (২য়)',
      desc: 'অগ্রসর ও প্রাঞ্জল কথোপকথন, আরবি শ্রবণ ও সাবলীল জবাব',
      iconName: 'MessageSquare',
      color: 'cyan',
      badge: `পর্ব ৮/${toBengaliNumber(total)}`,
      estMinutes: 3,
      itemCountStr: `${dlgP2Count}টি কথোপকথন`
    },
    {
      id: 'tamrin_p1',
      num: 9,
      titleBn: 'কিতাবী তামরীন ও অনুশীলন',
      titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
      shortTitle: 'কিতাবী তামরীন',
      desc: 'আত-তামরীনুল কিতাবীর অনুশীলন সমাধান ও রূপান্তর দক্ষতা',
      iconName: 'Trophy',
      color: 'amber',
      badge: `পর্ব ৯/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
    },
    {
      id: 'quiz_mastery',
      num: 10,
      titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
      titleAr: 'الاخْتِبَارُ النِّهَائِيُّ وَالمَهَارَةُ',
      shortTitle: 'মাস্টারী কুইজ',
      desc: 'পাঠের অর্জিত দক্ষতার চূড়ান্ত মেধা যাচাই ও ৩-স্টার সনদ',
      iconName: 'Trophy',
      color: 'amber',
      badge: `পর্ব ১০/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${quizCount}টি মেধা যাচাই কুইজ`
    }
  ];
}

/**
 * উপ-পাঠের তালিকা রিটার্ন করে (backward compatibility helper)
 */
export function getLessonSubUnitsInfo(lesson) {
  if (!lesson) return [];
  return getDynamicLessonStages(lesson);
}

/**
 * পাঠের সাব-ইউনিট অগ্রগতি ও লেগ্যাসি কমপ্লিশন অ্যাডাপ্টার ফাংশন
 * পূর্ববর্তী লোকালস্টোরেজ অগ্রগতি নির্বিঘ্নে ডায়নামিক আর্কিটেকচারে রূপান্তর করে
 */
export function getSubUnitProgressStatus(lessonOrId, progress) {
  const lesson = typeof lessonOrId === 'object' && lessonOrId !== null
    ? lessonOrId
    : (lessonsData?.lessons?.find(l => l.id === lessonOrId) || { id: lessonOrId });

  const lessonId = lesson?.id || lessonOrId;
  const lessonData = progress?.[lessonId];
  const isLessonFullyCompleted = !!lessonData?.completed || 
    isSuperUser(null);

  // পাঠের গতিশীল ধাপসমূহ
  const stages = getDynamicLessonStages(lesson);
  const totalCount = stages.length;

  const rawCompleted = Array.isArray(lessonData?.completedSubUnits)
    ? lessonData.completedSubUnits
    : Array.isArray(lessonData)
    ? lessonData
    : [];

  let completedSubUnits = [];

  if (isLessonFullyCompleted) {
    completedSubUnits = stages.map(s => s.id);
  } else if (Array.isArray(lesson?.bookStages) && lesson.bookStages.length > 0) {
    // কিতাবভিত্তিক দারসে পুরনো উপ-পাঠের অগ্রগতি অনুপাতে নতুন উপ-পাঠে ম্যাপ করা হয়
    const stageIds = stages.map(s => s.id);
    // ছোট পর্বে ভাগের আগের মূল পর্ব সম্পন্ন থাকলে তার সব ছোট পর্বও সম্পন্ন
    const parentIds = new Set(stages.map(s => s.parentId).filter(Boolean));
    const legacyDone = new Set(rawCompleted.filter(id => !stageIds.includes(id) && !parentIds.has(id))).size;
    const legacyTotal = lesson.legacyStageCount || legacyDone;
    const carriedOver = legacyTotal > 0
      ? Math.floor((Math.min(legacyDone, legacyTotal) / legacyTotal) * stages.length)
      : 0;
    completedSubUnits = stages
      .filter((stage, idx) => idx < carriedOver || rawCompleted.includes(stage.id) || (stage.parentId && rawCompleted.includes(stage.parentId)))
      .map(s => s.id);
  } else {
    // লেগ্যাসি ও প্রমিত ম্যাপিং
    completedSubUnits = stages.filter(stage => {
      // ১. সরাসরি মিল
      if (rawCompleted.includes(stage.id)) return true;

      // ২. লেগ্যাসি ভোকাবুলারি ম্যাপিং
      if (stage.id.startsWith('vocab_')) {
        if (rawCompleted.includes('vocab') || rawCompleted.includes('vocab_core')) {
          if (stage.id === 'vocab_b1') return true;
          if (rawCompleted.includes('vocab')) return true;
        }
        if (stage.id === 'vocab_b2' && rawCompleted.includes('vocab_ext')) return true;
      }

      // ৩. লেগ্যাসি বাক্য ম্যাপিং
      if (stage.id.startsWith('sentences_')) {
        if (rawCompleted.includes('sentences') || rawCompleted.includes('sentences_dialogues')) return true;
      }

      // ৪. লেগ্যাসি কথন ম্যাপিং
      if (stage.id.startsWith('dialogues_')) {
        if (rawCompleted.includes('dialogues') || rawCompleted.includes('sentences_dialogues')) return true;
      }

      // ৫. লেগ্যাসি তামরীন ও কুইজ ম্যাপিং
      if (stage.id === 'tamrin_p1') {
        if (rawCompleted.includes('tamrin_quiz') || rawCompleted.includes('tamrin')) return true;
      }
      if (stage.id === 'quiz_mastery') {
        if (rawCompleted.includes('tamrin_quiz') || rawCompleted.includes('quiz')) return true;
      }

      // ৬. লেগ্যাসি কোর ব্যাকরণ পরিচিতি
      if (stage.id === 'core_grammar_intro') {
        if (rawCompleted.includes('core_sentences_dialogues') || rawCompleted.includes('vocab')) return true;
      }

      // ৭. লেগ্যাসি core_sentences_dialogues সম্পূর্ণ সম্পন্ন হলে
      if (rawCompleted.includes('core_sentences_dialogues')) {
        if (stage.id === 'core_grammar_intro' || stage.id.startsWith('sentences_') || stage.id.startsWith('dialogues_')) return true;
      }

      return false;
    }).map(s => s.id);
  }

  const completedCount = completedSubUnits.length;
  const isFullyCompleted = isLessonFullyCompleted || (totalCount > 0 && completedCount >= totalCount);
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // পরবর্তী সক্রিয় বা অসম্পূর্ণ উপ-পাঠ নির্ধারণ
  let nextSubUnitId = stages[0]?.id || 'vocab';
  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    if (!completedSubUnits.includes(s.id)) {
      nextSubUnitId = s.id;
      break;
    }
  }

  const stars = isFullyCompleted 
    ? (lessonData?.stars || 3) 
    : Math.min(2, lessonData?.stars ? Math.min(2, lessonData.stars) : Math.max(0, completedCount));

  return {
    isFullyCompleted,
    completedSubUnits,
    completedCount,
    totalCount,
    percent,
    nextSubUnitId,
    stars,
    stages
  };
}

/**
 * Backward-compatible alias
 */
export const getLessonProgressAdapted = getSubUnitProgressStatus;

/**
 * কোনো নির্দিষ্ট উপ-পাঠ আনলক কিনা তা পরীক্ষা করে
 */
export function isSubUnitUnlocked(subUnitId, completedSubUnits = [], lessonOrId = null) {
  if (isSuperUser(null)) {
    return true;
  }
  let stages = LESSON_SUB_UNITS;
  if (lessonOrId) {
    stages = getDynamicLessonStages(lessonOrId);
  }
  const idx = stages.findIndex(u => u.id === subUnitId);
  // প্রথম উপ-পাঠ সর্বদা আনলক
  if (idx <= 0) return true;
  const previousSubUnitId = stages[idx - 1].id;
  return completedSubUnits.includes(previousSubUnitId);
}

/**
 * এসো আরবী শিখি-এর পাঠ ৬-এর ১ম পর্ব আনলক হয়েছে কিনা যাচাই করে
 * (আত-তামরীনুল কিতাবী শুরু করার পূর্বশর্ত: পাঠ ১ থেকে ৫ সম্পন্ন হওয়া বা পাঠ ৬ আনলক হওয়া)
 */
export function isEsoArbiLesson6Unlocked(progress = {}, isUnlockedUser = false) {
  if (isUnlockedUser) return true;
  if (!progress || typeof progress !== 'object') return false;

  // ১. পাঠ ৬ শুরু বা সম্পন্ন হয়েছে কিনা
  if (progress['vol1-ch1-l6']?.completed) return true;
  if (Array.isArray(progress['vol1-ch1-l6']?.completedSubUnits) && progress['vol1-ch1-l6'].completedSubUnits.length > 0) {
    return true;
  }

  // ২. পাঠ ৬-এর পরবর্তী কোনো পাঠ (l7, l8, অধ্যায় ২, খণ্ড ২ বা ৩) শুরু বা সম্পন্ন হয়েছে কিনা
  const hasSubsequentProgress = Object.keys(progress).some(lessonId => {
    if (lessonId.startsWith('vol2-') || lessonId.startsWith('vol3-')) return !!progress[lessonId]?.completed;
    if (lessonId.startsWith('vol1-ch2-') || lessonId.startsWith('vol1-ch3-')) return !!progress[lessonId]?.completed;
    const match = lessonId.match(/^vol1-ch1-l(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 6) {
        return !!progress[lessonId]?.completed || (Array.isArray(progress[lessonId]?.completedSubUnits) && progress[lessonId].completedSubUnits.length > 0);
      }
    }
    return false;
  });
  if (hasSubsequentProgress) return true;

  // ৩. পাঠ ৫ সম্পন্ন হয়েছে কিনা (পাঠ ৫ সম্পন্ন হলে স্বয়ংক্রিয়ভাবে পাঠ ৬-এর ১ম পর্ব আনলক হয়)
  if (progress['vol1-ch1-l5']?.completed) return true;
  const l5SubUnits = progress['vol1-ch1-l5']?.completedSubUnits;
  if (Array.isArray(l5SubUnits) && (l5SubUnits.includes('l5-quiz') || l5SubUnits.includes('tamrin_quiz') || l5SubUnits.length >= 11)) {
    return true;
  }

  return false;
}

