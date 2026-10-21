// বইয়ের প্রথম খণ্ড ৩য় অধ্যায়ে মাত্র ৩টি দারস (পৃ. ৯২–১০৪)। অ্যাপের বাকি দারসগুলো (৪–৬) বইয়ে নেই।
// এগুলোকে কিতাবের নিজস্ব শব্দ/বাক্য থেকে "পুনরালোচনা" দারস হিসেবে বানানো হয় — বাইরের কোনো বিষয়বস্তু নেই।
const mcqBoost = require('./mcq_boost.cjs');

const isHeading = (a) => /تَّمْرِين|التمرين/.test(a);

function collect(sourceFiles) {
  const words = [];
  const sents = [];
  const seen = new Set();
  for (const f of sourceFiles) {
    const mod = require(`../book_lessons/${f}.cjs`);
    for (const st of mod.fields.bookStages) {
      for (const step of st.steps) {
        if (step.type !== 'intro' || !step.word) continue;
        const { arabic, bangla } = step.word;
        if (!arabic || !bangla || isHeading(arabic) || seen.has(arabic)) continue;
        seen.add(arabic);
        (/\s/.test(arabic.trim()) ? sents : words).push({ arabic, bangla, picture: step.picture });
      }
    }
  }
  return { words, sents };
}

const chunk = (arr, n) => { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; };
const pairs = (items) => ({ type: 'match_pairs', title: 'মিলিয়ে নাও', pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla })) });
const introW = (it) => ({ type: 'intro', title: 'পুনরালোচনা', word: { arabic: it.arabic, bangla: it.bangla }, picture: it.picture });

function builder(sent, pool) {
  const tokens = sent.arabic.split(' ').filter(Boolean);
  const dist = [];
  for (const o of pool) {
    for (const t of o.arabic.split(' ').filter(Boolean)) {
      if (!tokens.includes(t) && !dist.includes(t) && t.length > 2) dist.push(t);
      if (dist.length >= 3) break;
    }
    if (dist.length >= 3) break;
  }
  return { type: 'sentence_builder', title: 'বাক্য সাজাও', targetSentence: sent.arabic, targetTranslation: sent.bangla, targetTokens: tokens, distractors: dist };
}

module.exports = function review({ id, legacyStageCount, prefix, titleBn, titleAr, pages, sources, lessonNo, subTitle, wordLimit = 16, sentLimit = 14 }) {
  const { words, sents } = collect(sources);
  const W = words.slice(0, wordLimit);
  const S = sents.slice(0, sentLimit);
  const stages = [];

  if (W.length >= 4) {
    stages.push({
      id: `${prefix}-words`, titleBn: `${titleBn}: শব্দ`, shortTitle: 'শব্দ',
      titleAr: 'مُرَاجَعَةُ الْمُفْرَدَاتِ', desc: 'আগের দারসের শব্দগুলো আবার',
      iconName: 'BookOpen', color: 'emerald', estMinutes: 4, bookPages: pages.replace('পৃষ্ঠা ', ''),
      steps: [...W.slice(0, 4).map(introW), ...chunk(W, 4).filter(c => c.length >= 3).slice(0, 4).map(pairs)]
    });
  }
  const first = S.slice(0, 7);
  const second = S.slice(7, 14);
  if (first.length >= 3) {
    stages.push({
      id: `${prefix}-sent-1`, titleBn: `${titleBn}: বাক্য (১/২)`, shortTitle: 'বাক্য ১',
      titleAr: 'مُرَاجَعَةُ الْجُمَلِ (١)', desc: 'কিতাবের বাক্য আবার পড়ো ও সাজাও',
      iconName: 'MessageCircle', color: 'violet', estMinutes: 5, bookPages: pages.replace('পৃষ্ঠা ', ''),
      steps: [...first.slice(0, 4).map(introW), ...first.slice(0, 4).map(s => builder(s, S.filter(x => x !== s))), pairs(first.slice(0, 4))]
    });
  }
  if (second.length >= 3) {
    stages.push({
      id: `${prefix}-sent-2`, titleBn: `${titleBn}: বাক্য (২/২)`, shortTitle: 'বাক্য ২',
      titleAr: 'مُرَاجَعَةُ الْجُمَلِ (٢)', desc: 'আরও কিছু বাক্য',
      iconName: 'Star', color: 'teal', estMinutes: 5, bookPages: pages.replace('পৃষ্ঠা ', ''),
      steps: [...second.slice(0, 4).map(introW), ...second.slice(0, 4).map(s => builder(s, S.filter(x => x !== s))), pairs(second.slice(0, 4))]
    });
  }
  stages.push({
    id: `${prefix}-final`, titleBn: `${titleBn}: চূড়ান্ত চর্চা`, shortTitle: 'চূড়ান্ত চর্চা',
    titleAr: 'التَّدْرِيبُ', desc: 'শব্দ ও বাক্য মিলিয়ে চর্চা',
    iconName: 'Trophy', color: 'amber', estMinutes: 5, bookPages: pages.replace('পৃষ্ঠা ', ''),
    steps: [pairs(W.slice(0, 4)), pairs(W.slice(4, 8).length >= 3 ? W.slice(4, 8) : W.slice(0, 4)), pairs(S.slice(0, 4)),
            ...S.slice(2, 5).map(s => builder(s, S.filter(x => x !== s))), pairs(S.slice(4, 8).length >= 3 ? S.slice(4, 8) : S.slice(0, 4))]
  });

  mcqBoost(stages);

  const quiz = W.slice(0, 3).map((w, i) => {
    const wrong = W.filter(x => x !== w).slice(i, i + 2).map(x => x.bangla);
    return { question: `'${w.arabic}' অর্থ কী?`, options: [w.bangla, ...wrong], correctIndex: 0, correctAnswer: 0, explanation: w.bangla, type: 'mcq' };
  });

  return {
    id,
    legacyStageCount,
    fields: {
      pages,
      title: `${lessonNo} পাঠ: ${titleBn} (কিতাবের শব্দ ও বাক্য)`,
      subTitle,
      qaida: [],
      grammarRule: { title: titleBn, summary: 'আগের দারসগুলোর কিতাবী শব্দ ও বাক্যের পুনরালোচনা', points: [] },
      vocabulary: W.map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture })),
      sentences: S.map(({ arabic, bangla }) => ({ arabic, bangla })),
      dialogues: [],
      tamrinKitabi: [],
      quiz,
      bookStages: stages
    }
  };
};
