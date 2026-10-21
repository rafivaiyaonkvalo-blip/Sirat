// ২য়/৩য় খণ্ডের দারস-মডিউলের সাধারণ হেল্পার (ফরম্যাট ১ম খণ্ডের মডিউলের মতোই)।
const T = (arabic, bangla, page) => ({ arabic, bangla, page });
const intro = (item, title) => ({
  type: 'intro', title: title || 'নতুন শব্দ',
  word: { arabic: item.arabic, bangla: item.bangla }, picture: item.picture,
});
const introSentence = (s) => ({ type: 'intro', title: 'কিতাবের বাক্য', word: { arabic: s.arabic, bangla: s.bangla } });
const match = (items, title) => ({
  type: 'match_pairs', title: title || 'শব্দজোড় মেলান',
  pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla })),
});
const mcqWord = (item, wrong, q) => ({
  type: 'mcq', word: { arabic: item.arabic, bangla: item.bangla },
  question: q || 'শব্দটির অর্থ কী?',
  options: [item.bangla, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const arabicOf = (item, wrong) => ({
  type: 'mcq', word: { arabic: item.arabic, bangla: item.bangla },
  question: `'${item.bangla}' — আরবিতে কোনটি?`,
  options: [item.arabic, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const fillBlank = (sent, correct, wrong, hint) => ({
  type: 'fill_blank', sentence: sent, correctAnswer: correct, hint: hint || '',
  options: [correct, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 })),
});
const sentenceBuilder = (s, dist) => ({
  type: 'sentence_builder', title: 'বাক্য সাজাও',
  targetSentence: s.arabic, targetTranslation: s.bangla,
  targetTokens: s.arabic.split(' ').filter(Boolean), distractors: dist,
});
const card = (title, table) => ({ type: 'grammar_card', title, table });

// meta: { id, titleBn, shortTitle, titleAr, desc, iconName, color, estMinutes, bookPages }
const stage = (meta, steps) => ({ ...meta, steps });

function build({ id, title, subTitle, pages, stages, qaida = [], tamrinKitabi = [], vocabulary = [], sentences = [], quiz = [], legacyStageCount = 9 }) {
  require('./mcq_boost.cjs')(stages);
  return {
    id, legacyStageCount,
    fields: {
      pages, title, subTitle, qaida,
      grammarRule: { title, summary: subTitle || '', points: [] },
      vocabulary, sentences, dialogues: [], tamrinKitabi, quiz, bookStages: stages
    }
  };
}

module.exports = { T, intro, introSentence, match, mcqWord, arabicOf, fillBlank, sentenceBuilder, card, stage, build };
