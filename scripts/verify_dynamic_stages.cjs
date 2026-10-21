const fs = require('fs');
const path = require('path');

const lessonsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/lessons.json'), 'utf8'));

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBengaliNumber(num) {
  if (num === null || num === undefined) return '';
  return String(num).replace(/\d/g, d => BENGALI_DIGITS[d]);
}

function isCleanVocabItem(item) {
  if (!item || typeof item !== 'object' || !item.arabic) return false;
  const stripped = item.arabic.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  const words = stripped.split(/[\s\-\/]+/).filter(w => /[\u0600-\u06FF]/.test(w));
  return words.length >= 1 && words.length <= 2;
}

function getCleanVocabulary(lesson) {
  if (!lesson || !Array.isArray(lesson.vocabulary)) return [];
  return lesson.vocabulary.filter(isCleanVocabItem);
}

function getDynamicLessonStages(lesson) {
  if (!lesson) return [];
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
        titleBn: 'মৌলিক কায়েদা ও পরিচিতি',
        titleAr: 'القَاعِدَةُ وَالمُقَدِّمَةُ',
        shortTitle: 'কায়েদা পরিচিতি',
        badge: `উপ-পাঠ ১/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: cleanCount > 0 ? `${cleanCount}টি শব্দ ও কায়েদা` : 'কায়েদা ও প্রাথমিক রূপ',
        cleanVocabCount: cleanCount
      },
      {
        id: 'sentences_p1',
        num: 2,
        titleBn: 'বাক্য গঠন - ১ম পর্ব',
        titleAr: 'تَرْكِيبُ الجُمَلِ (١)',
        shortTitle: 'বাক্য (১ম)',
        badge: `উপ-পাঠ ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও তারকীব`
      },
      {
        id: 'sentences_p2',
        num: 3,
        titleBn: 'বাক্য গঠন - ২য় পর্ব',
        titleAr: 'تَرْكِيبُ الجُمَلِ (٢)',
        shortTitle: 'বাক্য (২য়)',
        badge: `উপ-পাঠ ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
      {
        id: 'dialogues_p1',
        num: 4,
        titleBn: 'কথোপকথন - ১ম পর্ব',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
        shortTitle: 'কথন (১ম)',
        badge: `উপ-পাঠ ৪/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP1Count}টি কথোপকথন`
      },
      {
        id: 'dialogues_p2',
        num: 5,
        titleBn: 'কথোপকথন - ২য় পর্ব',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
        shortTitle: 'কথন (২য়)',
        badge: `উপ-পাঠ ৫/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP2Count}টি কথোপকথন`
      },
      {
        id: 'tamrin_p1',
        num: 6,
        titleBn: 'কিতাবী তামরীন ও অনুশীলন',
        titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
        shortTitle: 'কিতাবী তামরীন',
        badge: `উপ-পাঠ ৬/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
      },
      {
        id: 'quiz_mastery',
        num: 7,
        titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
        titleAr: 'الاخْتِبَারُ النِّهَائِيُّ وَالمَهَارَةُ',
        shortTitle: 'মাস্টারী কুইজ',
        badge: `উপ-পাঠ ৭/${toBengaliNumber(total)}`,
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
        titleBn: 'শব্দভাণ্ডার - ১ম পর্ব ও কায়েদা',
        titleAr: 'المُفْرَدَاتُ (١) وَالقَاعِدَةُ',
        shortTitle: 'শব্দার্থ (১ম)',
        badge: `উপ-পাঠ ১/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v1Count}টি শব্দার্থ ও কায়েদা`,
        cleanVocabCount: v1Count
      },
      {
        id: 'vocab_b2',
        num: 2,
        titleBn: 'শব্দভাণ্ডার - ২য় পর্ব',
        titleAr: 'المُفْرَدَاتُ (٢) وَالتَّرْكِيبُ',
        shortTitle: 'শব্দার্থ (২য়)',
        badge: `উপ-পাঠ ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v2Count}টি শব্দার্থ ও জোড়`,
        cleanVocabCount: v2Count
      },
      {
        id: 'sentences_p1',
        num: 3,
        titleBn: 'বাক্য গঠন - ১ম পর্ব',
        titleAr: 'تَرْكِيبُ الجُمَلِ (١)',
        shortTitle: 'বাক্য (১ম)',
        badge: `উপ-পাঠ ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও তারকীব`
      },
      {
        id: 'sentences_p2',
        num: 4,
        titleBn: 'বাক্য গঠন - ২য় পর্ব',
        titleAr: 'تَرْكِيبُ الجُمَلِ (٢)',
        shortTitle: 'বাক্য (২য়)',
        badge: `উপ-পাঠ ৪/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
      {
        id: 'dialogues_p1',
        num: 5,
        titleBn: 'কথোপকথন - ১ম পর্ব',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
        shortTitle: 'কথন (১ম)',
        badge: `উপ-পাঠ ৫/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP1Count}টি কথোপকথন`
      },
      {
        id: 'dialogues_p2',
        num: 6,
        titleBn: 'কথোপকথন - ২য় পর্ব',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
        shortTitle: 'কথন (২য়)',
        badge: `উপ-পাঠ ৬/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP2Count}টি কথোপকথন`
      },
      {
        id: 'tamrin_p1',
        num: 7,
        titleBn: 'কিতাবী তামরীন ও অনুশীলন',
        titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
        shortTitle: 'কিতাবী তামরীন',
        badge: `উপ-পাঠ ৭/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
      },
      {
        id: 'quiz_mastery',
        num: 8,
        titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
        titleAr: 'الاخْتِبَارُ النِّهَائِيُّ وَالمَهَارَةُ',
        shortTitle: 'মাস্টারী কুইজ',
        badge: `উপ-পাঠ ৮/${toBengaliNumber(total)}`,
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
        titleBn: 'শব্দভাণ্ডার - ১ম পর্ব ও কায়েদা',
        titleAr: 'المُفْرَدَاتُ (١) وَالقَاعِدَةُ',
        shortTitle: 'শব্দার্থ (১ম)',
        badge: `উপ-পাঠ ১/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v1Count}টি শব্দার্থ ও কায়েদা`,
        cleanVocabCount: v1Count
      },
      {
        id: 'vocab_b2',
        num: 2,
        titleBn: 'শব্দভাণ্ডার - ২য় পর্ব',
        titleAr: 'المُفْرَدَاتُ (٢) وَالتَّرْكِيبُ',
        shortTitle: 'শব্দার্থ (২য়)',
        badge: `উপ-পাঠ ২/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v2Count}টি শব্দার্থ ও জোড়`,
        cleanVocabCount: v2Count
      },
      {
        id: 'vocab_b3',
        num: 3,
        titleBn: 'শব্দভাণ্ডার - ৩য় পর্ব',
        titleAr: 'المُفْرَدَاتُ (٣) وَالتَّطْبِيقُ',
        shortTitle: 'শব্দার্থ (৩য়)',
        badge: `উপ-পাঠ ৩/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${v3Count}টি শব্দার্থ ও চর্চা`,
        cleanVocabCount: v3Count
      },
      {
        id: 'sentences_p1',
        num: 4,
        titleBn: 'বাক্য গঠন - ১ম পর্ব',
        titleAr: 'تَرْكِيبُ الجُمَلِ (١)',
        shortTitle: 'বাক্য (১ম)',
        badge: `উপ-পাঠ ৪/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP1Count}টি বাক্য ও তারকীব`
      },
      {
        id: 'sentences_p2',
        num: 5,
        titleBn: 'বাক্য গঠন - ২য় পর্ব',
        titleAr: 'تَرْكِيبُ الجُمَلِ (٢)',
        shortTitle: 'বাক্য (২য়)',
        badge: `উপ-পাঠ ৫/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
      },
      {
        id: 'dialogues_p1',
        num: 6,
        titleBn: 'কথোপকথন - ১ম পর্ব',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
        shortTitle: 'কথন (১ম)',
        badge: `উপ-পাঠ ৬/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP1Count}টি কথোপকথন`
      },
      {
        id: 'dialogues_p2',
        num: 7,
        titleBn: 'কথোপকথন - ২য় পর্ব',
        titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
        shortTitle: 'কথন (২য়)',
        badge: `উপ-পাঠ ৭/${toBengaliNumber(total)}`,
        estMinutes: 3,
        itemCountStr: `${dlgP2Count}টি কথোপকথন`
      },
      {
        id: 'tamrin_p1',
        num: 8,
        titleBn: 'কিতাবী তামরীন ও অনুশীলন',
        titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
        shortTitle: 'কিতাবী তামরীন',
        badge: `উপ-পাঠ ৮/${toBengaliNumber(total)}`,
        estMinutes: 4,
        itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
      },
      {
        id: 'quiz_mastery',
        num: 9,
        titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
        titleAr: 'الاخْتِبَারُ النِّهَائِيُّ وَالمَهَارَةُ',
        shortTitle: 'মাস্টারী কুইজ',
        badge: `উপ-পাঠ ৯/${toBengaliNumber(total)}`,
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
      titleBn: 'শব্দভাণ্ডার - ১ম পর্ব ও কায়েদা',
      titleAr: 'المُفْرَدَاتُ (١) وَالقَاعِدَةُ',
      shortTitle: 'শব্দার্থ (১ম)',
      badge: `উপ-পাঠ ১/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${v1Count}টি শব্দার্থ ও কায়েদা`,
      cleanVocabCount: v1Count
    },
    {
      id: 'vocab_b2',
      num: 2,
      titleBn: 'শব্দভাণ্ডার - ২য় পর্ব',
      titleAr: 'المُفْرَدَاتُ (٢) وَالتَّرْكِيبُ',
      shortTitle: 'শব্দার্থ (২য়)',
      badge: `উপ-পাঠ ২/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${v2Count}টি শব্দার্থ ও জোড়`,
      cleanVocabCount: v2Count
    },
    {
      id: 'vocab_b3',
      num: 3,
      titleBn: 'শব্দভাণ্ডার - ৩য় পর্ব',
      titleAr: 'المُفْرَدَاتُ (٣) وَالتَّطْبِيقُ',
      shortTitle: 'শব্দার্থ (৩য়)',
      badge: `উপ-পাঠ ৩/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${v3Count}টি শব্দার্থ ও চর্চা`,
      cleanVocabCount: v3Count
    },
    {
      id: 'vocab_b4',
      num: 4,
      titleBn: 'শব্দভাণ্ডার - ৪র্থ পর্ব',
      titleAr: 'المُفْرَدَاتُ (٤) وَالتَّثْبِيتُ',
      shortTitle: 'শব্দার্থ (৪র্থ)',
      badge: `উপ-পাঠ ৪/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${v4Count}টি শব্দার্থ ও সমাধান`,
      cleanVocabCount: v4Count
    },
    {
      id: 'sentences_p1',
      num: 5,
      titleBn: 'বাক্য গঠন - ১ম পর্ব',
      titleAr: 'تَرْكِيبُ الجُمَلِ (١)',
      shortTitle: 'বাক্য (১ম)',
      badge: `উপ-পাঠ ৫/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${sentP1Count}টি বাক্য ও তারকীব`
    },
    {
      id: 'sentences_p2',
      num: 6,
      titleBn: 'বাক্য গঠন - ২য় পর্ব',
      titleAr: 'تَرْكِيبُ الجُمَلِ (٢)',
      shortTitle: 'বাক্য (২য়)',
      badge: `উপ-পাঠ ৬/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${sentP2Count}টি বাক্য ও বিশ্লেষণ`
    },
    {
      id: 'dialogues_p1',
      num: 7,
      titleBn: 'কথোপকথন - ১ম পর্ব',
      titleAr: 'الحِوَارُ وَالسُّؤَالُ (١)',
      shortTitle: 'কথন (১ম)',
      badge: `উপ-পাঠ ৭/${toBengaliNumber(total)}`,
      estMinutes: 3,
      itemCountStr: `${dlgP1Count}টি কথোপকথন`
    },
    {
      id: 'dialogues_p2',
      num: 8,
      titleBn: 'কথোপকথন - ২য় পর্ব',
      titleAr: 'الحِوَارُ وَالسُّؤَالُ (٢)',
      shortTitle: 'কথন (২য়)',
      badge: `উপ-পাঠ ৮/${toBengaliNumber(total)}`,
      estMinutes: 3,
      itemCountStr: `${dlgP2Count}টি কথোপকথন`
    },
    {
      id: 'tamrin_p1',
      num: 9,
      titleBn: 'কিতাবী তামরীন ও অনুশীলন',
      titleAr: 'التَّمْرِينُ الكِتَابِيُّ والتَّطْبِيقُ',
      shortTitle: 'কিতাবী তামরীন',
      badge: `উপ-পাঠ ৯/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${tamrinCount}টি কিতাবী তামরীন`
    },
    {
      id: 'quiz_mastery',
      num: 10,
      titleBn: 'চূড়ান্ত মূল্যায়ন ও কুইজ',
      titleAr: 'الاخْتِبَارُ النِّهَائِيُّ وَالمَهَارَةُ',
      shortTitle: 'মাস্টারী কুইজ',
      badge: `উপ-পাঠ ১০/${toBengaliNumber(total)}`,
      estMinutes: 4,
      itemCountStr: `${quizCount}টি মেধা যাচাই কুইজ`
    }
  ];
}

function getSubUnitProgressStatus(lesson, progress) {
  const lessonId = lesson.id;
  const lessonData = progress?.[lessonId];
  const isLessonFullyCompleted = !!lessonData?.completed;
  const stages = getDynamicLessonStages(lesson);
  const totalCount = stages.length;
  const rawCompleted = Array.isArray(lessonData?.completedSubUnits) ? lessonData.completedSubUnits : [];

  let completedSubUnits = [];
  if (isLessonFullyCompleted) {
    completedSubUnits = stages.map(s => s.id);
  } else {
    completedSubUnits = stages.filter(stage => {
      if (rawCompleted.includes(stage.id)) return true;
      if (stage.id.startsWith('vocab_')) {
        if (rawCompleted.includes('vocab') || rawCompleted.includes('vocab_core')) {
          if (stage.id === 'vocab_b1') return true;
          if (rawCompleted.includes('vocab')) return true;
        }
        if (stage.id === 'vocab_b2' && rawCompleted.includes('vocab_ext')) return true;
      }
      if (stage.id.startsWith('sentences_')) {
        if (rawCompleted.includes('sentences') || rawCompleted.includes('sentences_dialogues')) return true;
      }
      if (stage.id.startsWith('dialogues_')) {
        if (rawCompleted.includes('dialogues') || rawCompleted.includes('sentences_dialogues')) return true;
      }
      if (stage.id === 'tamrin_p1') {
        if (rawCompleted.includes('tamrin_quiz') || rawCompleted.includes('tamrin')) return true;
      }
      if (stage.id === 'quiz_mastery') {
        if (rawCompleted.includes('tamrin_quiz') || rawCompleted.includes('quiz')) return true;
      }
      if (stage.id === 'core_grammar_intro') {
        if (rawCompleted.includes('core_sentences_dialogues') || rawCompleted.includes('vocab')) return true;
      }
      if (rawCompleted.includes('core_sentences_dialogues')) {
        if (stage.id === 'core_grammar_intro' || stage.id.startsWith('sentences_') || stage.id.startsWith('dialogues_')) return true;
      }
      return false;
    }).map(s => s.id);
  }

  const completedCount = completedSubUnits.length;
  const isFullyCompleted = isLessonFullyCompleted || (totalCount > 0 && completedCount >= totalCount);
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let nextSubUnitId = stages[0]?.id || 'vocab_b1';
  for (let i = 0; i < stages.length; i++) {
    if (!completedSubUnits.includes(stages[i].id)) {
      nextSubUnitId = stages[i].id;
      break;
    }
  }

  const stars = isFullyCompleted 
    ? (lessonData?.stars || 3) 
    : Math.min(2, lessonData?.stars ? Math.min(2, lessonData.stars) : Math.max(0, completedCount));
  return { isFullyCompleted, completedSubUnits, completedCount, totalCount, percent, nextSubUnitId, stars };
}

function isSubUnitUnlocked(subUnitId, completedSubUnits = [], lesson) {
  const stages = getDynamicLessonStages(lesson);
  const idx = stages.findIndex(u => u.id === subUnitId);
  if (idx <= 0) return true;
  return completedSubUnits.includes(stages[idx - 1].id);
}

function simulateBuildSteps(lesson, subUnitId) {
  const steps = [];
  const cleanVocab = getCleanVocabulary(lesson);
  const sentences = lesson?.sentences || [];
  const dialogues = lesson?.dialogues || [];
  const quizzes = lesson?.quiz || [];
  const tamrins = lesson?.tamrinKitabi || [];

  const addGrammarCard = () => {
    if (lesson.grammarRule && (lesson.grammarRule.summary || (Array.isArray(lesson.grammarRule.points) && lesson.grammarRule.points.length > 0))) {
      steps.push({ type: 'grammar_card' });
    }
  };

  const addVocabSteps = (vocabList) => {
    vocabList.forEach(w => steps.push({ type: 'intro', word: w }));
  };

  const addSentenceSteps = (sentList = sentences) => {
    sentList.forEach(s => steps.push({ type: 'sentence_builder', sentence: s }));
  };

  const addDialogueSteps = (dlgList = dialogues) => {
    dlgList.forEach(d => steps.push({ type: 'dialogue_listen', dialogue: d }));
  };

  const addTamrinSteps = (tamrinList = tamrins) => {
    tamrinList.forEach(t => steps.push({ type: 'tamrin_challenge', tamrin: t }));
  };

  const addQuizSteps = (quizList = quizzes) => {
    quizList.forEach(q => steps.push({ type: 'quiz_challenge', quiz: q }));
  };

  const cleanCount = cleanVocab.length;
  let vocabBatch1 = [], vocabBatch2 = [], vocabBatch3 = [], vocabBatch4 = [];
  if (cleanCount <= 20) {
    const mid = Math.ceil(cleanCount / 2);
    vocabBatch1 = cleanVocab.slice(0, mid);
    vocabBatch2 = cleanVocab.slice(mid);
  } else if (cleanCount <= 45) {
    const s1 = Math.ceil(cleanCount / 3);
    const s2 = Math.ceil((2 * cleanCount) / 3);
    vocabBatch1 = cleanVocab.slice(0, s1);
    vocabBatch2 = cleanVocab.slice(s1, s2);
    vocabBatch3 = cleanVocab.slice(s2);
  } else {
    const s1 = Math.ceil(cleanCount / 4);
    const s2 = Math.ceil((2 * cleanCount) / 4);
    const s3 = Math.ceil((3 * cleanCount) / 4);
    vocabBatch1 = cleanVocab.slice(0, s1);
    vocabBatch2 = cleanVocab.slice(s1, s2);
    vocabBatch3 = cleanVocab.slice(s2, s3);
    vocabBatch4 = cleanVocab.slice(s3);
  }

  const sentMid = Math.ceil(sentences.length / 2);
  const sentPart1 = sentences.slice(0, sentMid);
  const sentPart2 = sentences.slice(sentMid);

  const dlgMid = Math.ceil(dialogues.length / 2);
  const dlgPart1 = dialogues.slice(0, dlgMid);
  const dlgPart2 = dialogues.slice(dlgMid);

  if (subUnitId === 'core_grammar_intro') {
    addGrammarCard();
    if (cleanVocab.length > 0) addVocabSteps(cleanVocab);
    else if (sentences.length > 0) steps.push({ type: 'intro', word: { arabic: sentences[0].arabic, bangla: sentences[0].bangla } });
  } else if (subUnitId === 'vocab_b1') {
    addGrammarCard();
    addVocabSteps(vocabBatch1);
  } else if (subUnitId === 'vocab_b2') {
    addVocabSteps(vocabBatch2);
  } else if (subUnitId === 'vocab_b3') {
    addVocabSteps(vocabBatch3);
  } else if (subUnitId === 'vocab_b4') {
    addVocabSteps(vocabBatch4);
  } else if (subUnitId === 'sentences_p1') {
    addSentenceSteps(sentPart1.length > 0 ? sentPart1 : sentences);
  } else if (subUnitId === 'sentences_p2') {
    addSentenceSteps(sentPart2.length > 0 ? sentPart2 : sentences);
  } else if (subUnitId === 'dialogues_p1') {
    addDialogueSteps(dlgPart1.length > 0 ? dlgPart1 : dialogues);
  } else if (subUnitId === 'dialogues_p2') {
    addDialogueSteps(dlgPart2.length > 0 ? dlgPart2 : dialogues);
  } else if (subUnitId === 'tamrin_p1') {
    addTamrinSteps();
  } else if (subUnitId === 'quiz_mastery') {
    addQuizSteps();
  } else {
    addGrammarCard();
    addVocabSteps(cleanVocab);
    addSentenceSteps(sentences);
    addDialogueSteps(dialogues);
    addTamrinSteps();
    addQuizSteps();
  }

  return steps;
}

// ---------------------- RUN TESTS ----------------------
console.log('--- TEST SUITE: 6-10 SUB-SECTIONS ARCHITECTURE ---');

let passed = 0;
let failed = 0;
function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`FAILED: ${message}`);
  }
}

// Test 1: All 70 lessons have strictly between 6 and 10 dynamic stages
assert(lessonsData.lessons.length === 70, `Total lessons must be 70, got ${lessonsData.lessons.length}`);

let counts = { 7: 0, 8: 0, 9: 0, 10: 0 };
let totalStages = 0;

lessonsData.lessons.forEach(l => {
  const stages = getDynamicLessonStages(l);
  const len = stages.length;
  assert(len >= 6 && len <= 10, `Lesson ${l.id} stages count ${len} must be in [6, 10]`);
  counts[len] = (counts[len] || 0) + 1;
  totalStages += len;

  // Verify sequential serials and badges
  stages.forEach((st, idx) => {
    assert(st.num === idx + 1, `Stage index mismatch in ${l.id}: expected ${idx + 1}, got ${st.num}`);
    assert(st.badge.includes(`উপ-পাঠ ${toBengaliNumber(idx + 1)}/${toBengaliNumber(len)}`), `Badge format error in ${l.id} stage ${st.id}`);
  });
});

console.log(`Distribution across 70 lessons:`, counts);
console.log(`Total stages across curriculum: ${totalStages}`);
assert(totalStages === 564, `Total stages expected 564, got ${totalStages}`);

// Test 2: Step generation across all 564 stages (0 empty stages!)
let totalChallengeRuns = 0;
lessonsData.lessons.forEach(l => {
  const stages = getDynamicLessonStages(l);
  stages.forEach(st => {
    totalChallengeRuns++;
    const steps = simulateBuildSteps(l, st.id);
    assert(steps.length > 0, `Steps for lesson ${l.id} stage ${st.id} must be > 0, got ${steps.length}`);
  });
  totalChallengeRuns++;
  const masterSteps = simulateBuildSteps(l, 'all');
  assert(masterSteps.length > 0, `Master steps for lesson ${l.id} must be > 0`);
});
console.log(`Verified ${totalChallengeRuns} interactive stage challenge generations with 100% non-empty steps!`);

// Test 3: Backward compatibility with legacy progress
const testLesson8Stages = lessonsData.lessons.find(l => getCleanVocabulary(l).length >= 7 && getCleanVocabulary(l).length <= 20);
const legacyCompletedProgress = {
  [testLesson8Stages.id]: {
    completed: true,
    completedSubUnits: ['vocab', 'sentences', 'dialogues', 'tamrin_quiz'],
    stars: 3
  }
};
const adaptedStatus = getSubUnitProgressStatus(testLesson8Stages, legacyCompletedProgress);
assert(adaptedStatus.isFullyCompleted === true, 'Legacy completed lesson is fully completed');
assert(adaptedStatus.completedCount === 8, `All 8 dynamic stages marked complete for legacy completed lesson, got ${adaptedStatus.completedCount}`);
assert(adaptedStatus.percent === 100, 'Legacy completed lesson is 100%');
assert(adaptedStatus.stars === 3, 'Legacy completed lesson retains 3 stars');

// Test 4: Legacy partial progress adaptation
const legacyPartialProgress = {
  [testLesson8Stages.id]: {
    completed: false,
    completedSubUnits: ['vocab']
  }
};
const adaptedPartial = getSubUnitProgressStatus(testLesson8Stages, legacyPartialProgress);
assert(adaptedPartial.isFullyCompleted === false, 'Partial progress is not fully completed');
assert(adaptedPartial.completedCount === 2, `Vocab completed maps to both vocab_b1 and vocab_b2 (2 stages), got ${adaptedPartial.completedCount}`);
assert(adaptedPartial.nextSubUnitId === 'sentences_p1', `Next stage should be sentences_p1, got ${adaptedPartial.nextSubUnitId}`);

// Test 5: Dynamic unlock checks
assert(isSubUnitUnlocked(testLesson8Stages.id, [], testLesson8Stages) === true, 'First stage is unlocked initially');
const stages8 = getDynamicLessonStages(testLesson8Stages);
assert(isSubUnitUnlocked(stages8[1].id, [], testLesson8Stages) === false, 'Second stage locked initially');
assert(isSubUnitUnlocked(stages8[1].id, [stages8[0].id], testLesson8Stages) === true, 'Second stage unlocked when first complete');

console.log(`\nFINAL TEST SUMMARY: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL 70 LESSONS & 564 SUB-SECTIONS TESTS PASSED WITH 100% SUCCESS!');
}
