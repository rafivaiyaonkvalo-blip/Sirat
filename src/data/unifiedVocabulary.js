import vocabularyData from './vocabulary.json';
import { allTamrins, tamrinParts, tamrinWordGroups } from './tamrinKitabiData.js';

// Tag existing Eso Arbi Shikhi vocabulary items
export const esoArbiItems = vocabularyData.map(item => ({
  ...item,
  bookSource: item.bookSource || 'eso_arbi'
}));

// Extract all authentic exercises from At-Tamrinul Kitabi with full Tashkeel and authentic part mapping
export const tamrinItems = [];

allTamrins.forEach((tamrin) => {
  const exercises = tamrin.exercises || [];
  exercises.forEach((ex, exIdx) => {
    const id = `${tamrin.id}-ex${exIdx + 1}`;
    let subType = 'tamrin';
    if (ex.mode === 'bn-to-ar' || ex.task?.includes('আরবিতে')) {
      subType = 'tamrin_trans_ar';
    } else if (ex.task?.includes('তারকীব')) {
      subType = 'tamrin_tarkib';
    } else if (ex.task?.includes('শূন্যস্থান')) {
      subType = 'tamrin_blank';
    } else {
      subType = 'tamrin_trans_bn';
    }

    tamrinItems.push({
      id,
      tamrinId: tamrin.id,
      partId: tamrin.partId,
      partKey: tamrin.partKey,
      volume: tamrin.partName,
      volumeId: tamrin.partId,
      chapter: tamrin.partName,
      chapterId: tamrin.partKey,
      lesson: tamrin.title,
      lessonId: tamrin.id,
      tamrinNumber: tamrin.tamrinNumber,
      tamrinNumberBn: tamrin.tamrinNumberBn,
      arabic: (ex.arabicSentence || '').trim(),
      bengali: (ex.banglaSentence || '').trim(),
      type: 'tamrin',
      subType,
      task: ex.task || 'অনুশীলন',
      hint: ex.hint || '',
      partOfSpeech: subType === 'tamrin_tarkib' ? 'তারকীব (ব্যাকরণ)' : 'আত-তামরীনুল কিতাবী',
      page: ex.page || tamrin.page,
      bookSource: 'tamrin'
    });
  });
});

// কিতাবের শেষের "নতুন শব্দ" (৯৫০টি) — ফ্ল্যাশকার্ড, অনুশীলন, পরীক্ষা ও বানানে তামরীনের শব্দ হিসেবে
export const tamrinWordItems = [];
tamrinWordGroups.forEach((group) => {
  const part = tamrinParts.find((p) => p.id === group.partId);
  group.words.forEach((w, i) => {
    tamrinWordItems.push({
      id: `${group.id}-w${i + 1}`,
      partId: group.partId,
      partKey: part?.partKey,
      volume: part?.name,
      volumeId: group.partId,
      chapter: part?.name,
      chapterId: part?.partKey,
      lesson: group.title,
      lessonId: group.id,
      arabic: w.arabic,
      bengali: w.bangla,
      type: 'word',
      subType: 'tamrin_word',
      partOfSpeech: 'তামরীনের নতুন শব্দ',
      page: w.page,
      bookSource: 'tamrin'
    });
  });
});

// Grand total items
export const unifiedVocabulary = [...esoArbiItems, ...tamrinItems, ...tamrinWordItems];

export default unifiedVocabulary;
