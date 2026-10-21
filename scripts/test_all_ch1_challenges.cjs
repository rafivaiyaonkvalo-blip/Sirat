const fs = require('fs');
const path = require('path');
const lessonsData = require('../src/data/lessons.json');
const { getDynamicLessonStages, getCleanVocabulary } = require('../src/utils/lessonSubSections.js');

// Parse DuolingoLessonModal's buildComprehensiveLessonSteps function
// Or simulate with the exact implementation from DuolingoLessonModal.jsx:
function buildSteps(lesson, subUnitId = 'all') {
  const steps = [];
  if (!lesson) return steps;

  const isChapter1 = lesson?.chapterId === 'vol1-ch1' || (typeof lesson?.id === 'string' && lesson.id.startsWith('vol1-ch1-')) || (lesson?.chapter === 1 && lesson?.volume === 1);
  const cleanVocab = getCleanVocabulary(lesson);
  const sentences = lesson?.sentences || [];
  const dialogues = lesson?.dialogues || [];
  const quizzes = lesson?.quiz || [];
  const tamrins = lesson?.tamrinKitabi || [];

  const addGrammarCard = () => {
    if (lesson.grammarRule && (lesson.grammarRule.summary || (Array.isArray(lesson.grammarRule.points) && lesson.grammarRule.points.length > 0))) {
      steps.push({
        id: 'grammar-rule-intro',
        type: 'grammar_card',
        title: lesson.grammarRule.title || (isChapter1 ? 'উস্তাদের সহজ নির্দেশনা' : 'পাঠের মৌলিক ব্যাকরণ ও ক্বায়েদা'),
        summary: lesson.grammarRule.summary,
        points: lesson.grammarRule.points || []
      });
    }
  };

  const addVocabSteps = (vocabList, labelPrefix = 'শব্দ পরিচিতি', withMatching = true) => {
    vocabList.forEach((word, wIdx) => {
      steps.push({
        id: `intro-${wIdx}-${word.arabic}`,
        type: 'intro',
        word,
        title: wIdx === 0 ? `${labelPrefix} পরিচিতি` : `${labelPrefix} (${wIdx + 1}/${vocabList.length})`
      });

      const distractors = cleanVocab.filter(v => v.arabic !== word.arabic).slice(0, 3);
      const options = [
        { text: word.bangla || word.bengali, isCorrect: true },
        ...distractors.map(d => ({ text: d.bangla || d.bengali, isCorrect: false }))
      ].sort(() => 0.5 - Math.random());

      if (options.length >= 2 && wIdx % 2 === 0) {
        steps.push({
          id: `mcq-${wIdx}-${word.arabic}`,
          type: 'mcq',
          word,
          question: `"${word.arabic}" শব্দটির সঠিক বাংলা অর্থ কোনটি?`,
          options
        });
      }
    });

    if (withMatching && vocabList.length >= 4) {
      const pairWords = vocabList.slice(0, 4);
      steps.push({
        id: `match-pairs-1-${vocabList.length}`,
        type: 'match_pairs',
        title: 'শব্দজোড় মেলান (১ম অংশ)',
        pairs: pairWords.map(w => ({
          arabic: w.arabic,
          bangla: w.bangla || w.bengali
        }))
      });

      if (vocabList.length >= 8) {
        const pairWords2 = vocabList.slice(4, 8);
        steps.push({
          id: `match-pairs-2-${vocabList.length}`,
          type: 'match_pairs',
          title: 'শব্দজোড় মেলান (২য় অংশ)',
          pairs: pairWords2.map(w => ({
            arabic: w.arabic,
            bangla: w.bangla || w.bengali
          }))
        });
      }
    }
  };

  const addSentenceSteps = (sentList = sentences) => {
    sentList.forEach((sent, sIdx) => {
      const tokens = sent.arabic.replace(/[.,،؟!]/g, '').trim().split(/\s+/).filter(Boolean);
      if (tokens.length >= 2) {
        let distractorWords = cleanVocab
          .map(v => v.arabic)
          .filter(ar => !tokens.includes(ar))
          .slice(0, 2);
        if (distractorWords.length < 2 && sentences.length > 1) {
          const otherTokens = sentences
            .filter((_, idx) => idx !== sIdx)
            .flatMap(s => s.arabic.replace(/[.,،؟!]/g, '').trim().split(/\s+/).filter(Boolean))
            .filter(t => !tokens.includes(t) && !distractorWords.includes(t));
          distractorWords = [...distractorWords, ...otherTokens.slice(0, 2 - distractorWords.length)];
        }
        const availableTokens = [...tokens, ...distractorWords].sort(() => 0.5 - Math.random());
        const tarkib = isChapter1 ? null : 'tarkib_object';

        steps.push({
          id: `sent-builder-${sIdx}-${sent.arabic.slice(0, 8)}`,
          type: 'sentence_builder',
          title: `কিতাবের বাক্য গঠন (${sIdx + 1}/${sentList.length})`,
          targetArabic: sent.arabic,
          targetBangla: sent.bangla,
          tarkib,
          targetTokens: tokens,
          availableTokens
        });
      }
    });
  };

  const addDialogueSteps = (dlgList = dialogues) => {
    dlgList.forEach((dlg, dIdx) => {
      if (dlg.questionArabic && dlg.answerArabic) {
        const answerOptions = [
          { text: dlg.answerArabic, bangla: dlg.answerBangla, isCorrect: true }
        ];
        dialogues.filter((_, idx) => idx !== dIdx).slice(0, 2).forEach(other => {
          answerOptions.push({
            text: other.answerArabic,
            bangla: other.answerBangla,
            isCorrect: false
          });
        });
        if (answerOptions.length < 3 && sentences.length > 0) {
          sentences.slice(0, 3 - answerOptions.length).forEach(s => {
            answerOptions.push({ text: s.arabic, bangla: s.bangla, isCorrect: false });
          });
        }
        answerOptions.sort(() => 0.5 - Math.random());
        const tarkib = isChapter1 ? null : 'tarkib_object';

        steps.push({
          id: `dialogue-${dIdx}-${dlg.answerArabic.slice(0, 8)}`,
          type: 'dialogue_listen',
          title: `কথোপকথন ও প্রশ্নোত্তর (${dIdx + 1}/${dlgList.length})`,
          speaker: dlg.speaker || 'মুয়াল্লিম ও তালিবে ইলম',
          questionArabic: dlg.questionArabic,
          questionBangla: dlg.questionBangla,
          tarkib,
          options: answerOptions
        });
      }
    });
  };

  const addTamrinSteps = (tamrinList = tamrins) => {
    if (Array.isArray(tamrinList) && tamrinList.length > 0) {
      tamrinList.forEach((firstTamrin, tIdx) => {
        const rawItems = firstTamrin.items || (firstTamrin.text ? [firstTamrin] : []);
        if (rawItems.length > 0) {
          const tItem = rawItems[0];
          let targetAr = tItem.arabic;
          let targetBn = tItem.bangla;
          if (!targetAr || !targetBn) {
            const isTextAr = /[\u0600-\u06FF]/.test(tItem.text || '');
            const isPromptAr = /[\u0600-\u06FF]/.test(tItem.prompt || '');
            if (isTextAr && !isPromptAr) {
              targetAr = targetAr || tItem.text;
              targetBn = targetBn || tItem.prompt || tItem.hint || '';
            } else if (!isTextAr && isPromptAr) {
              targetAr = targetAr || tItem.prompt;
              targetBn = targetBn || tItem.text || '';
            } else if (isTextAr && isPromptAr) {
              targetAr = targetAr || tItem.prompt || tItem.text;
              targetBn = targetBn || tItem.hint || 'আরবি বাক্যটি সম্পূর্ণ করুন';
            } else {
              targetAr = targetAr || tItem.prompt || 'هٰذَا كِتَابٌ';
              targetBn = targetBn || tItem.text || 'ইহা একটি বই';
            }
          }

          const tarkib = isChapter1 ? null : 'tarkib_object';

          const distractorSentences = sentences.filter(s => s.arabic !== targetAr).slice(0, 3);
          const options = [
            { text: targetAr, bangla: targetBn, isCorrect: true },
            ...distractorSentences.map(s => ({ text: s.arabic, bangla: s.bangla, isCorrect: false }))
          ].sort(() => 0.5 - Math.random());

          steps.push({
            id: `tamrin-challenge-${tIdx}`,
            type: 'tamrin_challenge',
            title: `আত-তামরীনুল কিতাবী অনুশীলন: ${firstTamrin.title || firstTamrin.task || 'অনুবাদ ও রূপান্তর'}`,
            instruction: firstTamrin.instruction || 'বাংলা বাক্যের সঠিক আরবি অনুবাদ নির্বাচন করুন:',
            targetArabic: targetAr,
            targetBangla: targetBn,
            hint: tItem.hint || firstTamrin.hint,
            tarkib,
            options
          });
        }
      });
    }
  };

  const addQuizSteps = (quizList = quizzes) => {
    quizList.forEach((q, qIdx) => {
      const rawOptions = (q.options || []).map((optText, optIdx) => ({
        text: optText,
        isCorrect: optIdx === q.correctIndex
      }));
      const shuffledOptions = [...rawOptions].sort(() => 0.5 - Math.random());

      steps.push({
        id: `quiz-${qIdx}`,
        type: 'quiz_challenge',
        title: `মেধা যাচাই কুইজ (${qIdx + 1}/${quizList.length})`,
        question: q.question,
        questionBn: q.questionBn,
        explanation: q.explanation,
        options: shuffledOptions
      });
    });
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
    if (cleanVocab.length > 0) addVocabSteps(cleanVocab, 'মৌলিক শব্দভাণ্ডার', true);
  } else if (subUnitId === 'vocab_b1') {
    addGrammarCard();
    addVocabSteps(vocabBatch1, 'শব্দকোষ (১ম পর্ব)', true);
  } else if (subUnitId === 'vocab_b2') {
    addVocabSteps(vocabBatch2, 'শব্দকোষ (২য় পর্ব)', true);
  } else if (subUnitId === 'vocab_b3') {
    addVocabSteps(vocabBatch3, 'শব্দকোষ (৩য় পর্ব)', true);
  } else if (subUnitId === 'vocab_b4') {
    addVocabSteps(vocabBatch4, 'শব্দকোষ (৪র্থ পর্ব)', true);
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
    addVocabSteps(cleanVocab, 'শব্দভাণ্ডার', true);
    addSentenceSteps(sentences);
    addDialogueSteps(dialogues);
    addTamrinSteps();
    addQuizSteps();
  }

  return steps;
}

// ------------------- AUDIT ALL 76 STAGES -------------------
const ch1 = lessonsData.lessons.filter(l => l.chapterId === 'vol1-ch1');
let totalStagesChecked = 0;
let totalStepsChecked = 0;
let errors = 0;

ch1.forEach(lesson => {
  const stages = getDynamicLessonStages(lesson);
  stages.forEach(st => {
    totalStagesChecked++;
    const steps = buildSteps(lesson, st.id);
    if (!steps || steps.length === 0) {
      console.error(`[ERROR] Lesson ${lesson.id} stage ${st.id} generated 0 steps!`);
      errors++;
    }

    steps.forEach((step, sIdx) => {
      totalStepsChecked++;
      // Check tarkib suppression (must be null/undefined, never an active object)
      if (step.tarkib) {
        console.error(`[ERROR] Tarkib not suppressed in ${lesson.id} stage ${st.id} step ${sIdx}!`);
        errors++;
      }

      // Check tamrin challenge
      if (step.type === 'tamrin_challenge') {
        const arValid = /[\u0600-\u06FF]/.test(step.targetArabic);
        const bnValid = /[\u0980-\u09FF]/.test(step.targetBangla);
        if (!arValid) {
          console.error(`[TAMRIN BUG] ${lesson.id} step ${sIdx}: targetArabic has no Arabic: "${step.targetArabic}"`);
          errors++;
        }
        if (!bnValid) {
          console.error(`[TAMRIN BUG] ${lesson.id} step ${sIdx}: targetBangla has no Bengali: "${step.targetBangla}"`);
          errors++;
        }
      }

      // Check quiz challenge
      if (step.type === 'quiz_challenge') {
        const correctOpts = step.options.filter(o => o.isCorrect);
        if (correctOpts.length !== 1) {
          console.error(`[QUIZ BUG] ${lesson.id} step ${sIdx}: Expected exactly 1 correct option, got ${correctOpts.length}`);
          errors++;
        }
      }

      // Check dialogue listen
      if (step.type === 'dialogue_listen') {
        const correctOpts = step.options.filter(o => o.isCorrect);
        if (correctOpts.length !== 1) {
          console.error(`[DIALOGUE BUG] ${lesson.id} step ${sIdx}: Expected exactly 1 correct option, got ${correctOpts.length}`);
          errors++;
        }
      }

      // Check sentence builder
      if (step.type === 'sentence_builder') {
        if (!step.targetTokens || step.targetTokens.length < 2) {
          console.error(`[BUILDER BUG] ${lesson.id} step ${sIdx}: tokens < 2`);
          errors++;
        }
      }
    });
  });
});

console.log(`\n==============================================`);
console.log(`Audited ${totalStagesChecked} stages in Chapter 1.`);
console.log(`Audited ${totalStepsChecked} interactive challenge steps.`);
console.log(`Errors found: ${errors}`);

if (errors === 0) {
  console.log(`SUCCESS! 100% of interactive challenge steps in Chapter 1 pass validation cleanly!`);
} else {
  process.exit(1);
}
