import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, CheckCircle2, XCircle, Volume2, Sparkles, 
  Lightbulb, VolumeX, PenTool, BookMarked, Flag,
  RotateCcw, MessageSquare, ArrowRight, User, Send, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playArabicAudio } from '../utils/audio';
import { 
  playSuccessChime, 
  playMistakeNotice, 
  playCompletionFanfare, 
  isSoundMuted, 
  toggleSoundMute,
  useSoundMuted
} from '../utils/soundEffects';
import { recordDailyActivity, calcSessionXp, XP_RULES } from '../utils/gamification';
import ReportModal from './ReportModal';
import HalalIcon from './HalalIcon';
import BookPicture, { DistanceScene, hasBookPicture } from './BookPicture';
import { getWordPicture, hasWordPicture } from '../utils/pictureMap';
import { StageCompleteCard, DarsCompleteScreen, MixedText } from './LessonCelebration';
import QaidaCard from './QaidaCard';
import { getVisualData, getPictureCardOptions } from '../utils/visualObjectMap';
import { 
  LESSON_SUB_UNITS, 
  getDynamicLessonStages, 
  getCleanVocabulary, 
  toBengaliNumber 
} from '../utils/lessonSubSections';
import { getShowEnglish } from '../utils/storage';
import { buildExtraPracticeSteps, buildReviewSteps } from '../utils/extraPractice';
import { getBookParts, findBookPart, pickVaried, EXTRA_STEPS_PER_PART, REVIEW_STEPS_PER_PART } from '../utils/bookParts';
import { getEnglishTranslation } from '../utils/englishDictionary';
import { recordMistake } from '../utils/mistakesManager';

import { shuffle } from '../utils/shuffle';
// ধাপের ছবি: কাছে/দূরে দৃশ্য অথবা শুধু বস্তুর ছবি
function StepPicture({ step, className = '' }) {
  const pic = step?.picture || (step?.word ? getWordPicture(step.word) : null);
  if (!pic || !hasBookPicture(pic)) return null;
  if (step?.distance) {
    return <DistanceScene name={pic} distance={step.distance} className={className} />;
  }
  return (
    <div className={`flex justify-center ${className}`}>
      <BookPicture name={pic} className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-sm" />
    </div>
  );
}


// পুরোনো ডেটা-কাঠামো (পাঠ ১০-২৩) কে বর্তমান রেন্ডারারের কাঠামোয় রূপান্তর — মূল ডেটা অপরিবর্তিত থাকে
function normalizeBookStep(spec) {
  const s = { ...spec };
  // fill_blank: { sentence: "هَلْ هَذَا ___ ؟", correctAnswer, hint } → tokensBefore / missingToken / tokensAfter
  if (s.type === 'fill_blank' && !s.missingToken && typeof s.sentence === 'string' && s.sentence.includes('___')) {
    const [before = '', after = ''] = s.sentence.split('___');
    s.missingToken = s.correctAnswer;
    s.fullArabic = `${before}${s.correctAnswer || ''}${after}`.replace(/\s+/g, ' ').trim();
    s.tokensBefore = before.trim() ? before.trim().split(/\s+/) : [];
    s.tokensAfter = after.trim() ? after.trim().split(/\s+/) : [];
    if (!s.targetBangla) s.targetBangla = s.hint || '';
    if (!s.title) s.title = 'শূন্যস্থানে সঠিক শব্দ বসান:';
  }
  // sentence_builder: { targetSentence, targetTranslation } → { targetArabic, targetBangla }
  if (s.type === 'sentence_builder') {
    if (!s.targetArabic && s.targetSentence) s.targetArabic = s.targetSentence;
    if (!s.targetBangla && s.targetTranslation) s.targetBangla = s.targetTranslation;
    if (!s.targetArabic && Array.isArray(s.targetTokens)) s.targetArabic = s.targetTokens.join(' ');
  }
  // dialogue_listen: { lines: [...] } (প্রশ্ন/অপশন ছাড়া) → পূর্ণ কথোপকথন পাঠ কার্ড
  if (s.type === 'dialogue_listen' && !Array.isArray(s.options) && Array.isArray(s.lines)) {
    s.type = 'dialogue_read';
  }
  return s;
}

// কিতাবভিত্তিক দারস: ডেটায় লেখা ধাপগুলোকে চলমান ধাপে রূপান্তর (শুধু অপশন এলোমেলো করা হয়)
function buildBookStageSteps(lesson, stage) {
  // কিতাবের ধাপের পরে পর্বের নিজের শব্দ/বাক্য দিয়ে অতিরিক্ত অনুশীলন
  // কিতাবের ধাপ → এই পর্বের অতিরিক্ত অনুশীলন → আগের দারসের পুনরাবৃত্তি
  // ছোট পর্ব: কিতাবের ধাপ (সর্বোচ্চ ৭) + ৩টি অনুশীলন + ২টি পুনরাবৃত্তি
  const allSpecs = [
    ...stage.steps,
    ...pickVaried(buildExtraPracticeSteps(lesson, stage), EXTRA_STEPS_PER_PART),
    ...pickVaried(buildReviewSteps(lesson, stage), REVIEW_STEPS_PER_PART)
  ];
  return allSpecs.map((rawSpec, idx) => {
    const spec = normalizeBookStep(rawSpec);
    const step = { ...spec, id: `${stage.id}-${idx + 1}-${spec.type}` };
    if (Array.isArray(spec.options)) step.options = shuffle(spec.options);
    if (spec.type === 'intro') step.nuances = [];
    if (spec.type === 'sentence_builder') {
      step.availableTokens = shuffle([...spec.targetTokens, ...(spec.distractors || [])]);
    }
    if (spec.type === 'match_pairs') {
      step.pairs = spec.pairs.map((p, pIdx) => ({ ...p, pairId: `${step.id}-${pIdx}` }));
    }
    if (spec.type === 'sort_groups') step.items = shuffle(spec.items);
    return step;
  });
}

// Build 100% Rich Multi-Challenge Steps with Dynamic Pedagogical Stages
function buildComprehensiveLessonSteps(lesson, subUnitId = 'all') {
  const steps = [];
  if (!lesson) return steps;

  // কিতাবভিত্তিক দারস: bookStages থাকলে সর্বদা পর্বভিত্তিক সুনির্দিষ্ট ধাপ ব্যবহার করবে (কখনোই ৪০+ ধাপ বানাবে না)
  if (Array.isArray(lesson.bookStages) && lesson.bookStages.length > 0) {
    const bookStage = (subUnitId && subUnitId !== 'all' && findBookPart(lesson, subUnitId))
      || getBookParts(lesson)[0];
    if (bookStage) return buildBookStageSteps(lesson, bookStage);
  }

  const cleanVocab = getCleanVocabulary(lesson);
  const sentences = lesson?.sentences || [];
  const dialogues = lesson?.dialogues || [];
  const quizzes = lesson?.quiz || [];
  const tamrins = lesson?.tamrinKitabi || [];

  // ব্যাকরণের জন্য আলাদা ব্যবস্থা হবে, তাই দারসে পাঠের ক্বায়েদা কার্ড যোগ হয় না
  const addGrammarCard = () => {};
  // Helper: বিশুদ্ধ শব্দভাণ্ডার পরিচিতি ও কুইজ
  const addVocabSteps = (vocabList, labelPrefix = 'শব্দ পরিচিতি', withMatching = true) => {
    vocabList.forEach((word, wIdx) => {
      steps.push({
        id: `intro-${wIdx}-${word.arabic}`,
        type: 'intro',
        word,
        nuances: [],
        title: wIdx === 0 ? `${labelPrefix} পরিচিতি` : `${labelPrefix} (${wIdx + 1}/${vocabList.length})`
      });

      // Quick meaning check for this word
      const distractors = cleanVocab.filter(v => v.arabic !== word.arabic).slice(0, 3);
      const options = shuffle([
        { text: word.bangla || word.bengali, isCorrect: true },
        ...distractors.map(d => ({ text: d.bangla || d.bengali, isCorrect: false }))
      ]);

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

    // Word Pairs Matching
    if (withMatching && vocabList.length >= 4) {
      const pairWords = vocabList.slice(0, 4);
      steps.push({
        id: `match-pairs-1-${vocabList.length}`,
        type: 'match_pairs',
        title: 'শব্দজোড় মেলান (১ম অংশ)',
        pairs: pairWords.map((w, pIdx) => ({
          pairId: `mp-1-${pIdx}-${w.arabic}`,
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
          pairs: pairWords2.map((w, pIdx) => ({
            pairId: `mp-2-${pIdx}-${w.arabic}`,
            arabic: w.arabic,
            bangla: w.bangla || w.bengali
          }))
        });
      }
    }
  };

  // Helper: ছবি দেখে বস্তু শনাক্তকরণ (Picture Choice)
  const addPictureChoiceSteps = (vocabList) => {
    vocabList.forEach((word, wIdx) => {
      const options = getPictureCardOptions(word.arabic, word.bangla || word.bengali);
      if (options && options.length >= 2) {
        steps.push({
          id: `pic-choice-${wIdx}-${word.arabic}`,
          type: 'picture_choice',
          title: 'ছবি দেখে সঠিক উত্তর নির্বাচন করুন',
          targetArabic: word.arabic,
          targetBangla: word.bangla || word.bengali,
          options
        });
      }
    });
  };

  // Helper: হরকত ও তানভীন পারফেকশন (Harakat Choice)
  const addHarakatChoiceSteps = (vocabList) => {
    vocabList.forEach((word, wIdx) => {
      const ar = word.arabic.trim();
      if (ar.endsWith('ٌ') || ar.includes('ٌ')) {
        const withFathatayn = ar.replace(/ٌ$/, 'ًا').replace(/ةٌ$/, 'َةً');
        const withKasratayn = ar.replace(/ٌ$/, 'ٍ');
        const options = shuffle([
          { text: ar, isCorrect: true, note: 'মারফু / পেশ তানভীন (সাধারণ অবস্থা)' },
          { text: withFathatayn, isCorrect: false, note: 'মানসুব / যবর তানভীন' },
          { text: withKasratayn, isCorrect: false, note: 'মাজরুর / যের তানভীন' }
        ]);

        steps.push({
          id: `harakat-choice-${wIdx}-${ar}`,
          type: 'harakat_choice',
          title: 'হরকত ও তানভীন যাচাই',
          targetWord: ar,
          meaning: word.bangla || word.bengali,
          question: `"${word.bangla || word.bengali}" শব্দের সাধারণ রূপ কোনটি?`,
          options
        });
      }
    });
  };

  // Helper: কিতাবের বাক্য গঠন ও তারকীব
  const addSentenceSteps = (sentList = sentences) => {
    sentList.forEach((sent, sIdx) => {
      const tokens = sent.arabic.replace(/[.,،؟!]/g, '').trim().split(/\s+/).filter(Boolean);
      if (tokens.length >= 2) {
        let distractorWords = cleanVocab
          .map(v => v.arabic)
          .filter(ar => !tokens.includes(ar))
          .slice(0, 2);
        if (distractorWords.length < 2 && sentList.length > 1) {
          const otherTokens = sentList
            .filter((_, idx) => idx !== sIdx)
            .flatMap(s => s.arabic.replace(/[.,،؟!]/g, '').trim().split(/\s+/).filter(Boolean))
            .filter(t => !tokens.includes(t) && !distractorWords.includes(t));
          distractorWords = [...distractorWords, ...otherTokens.slice(0, 2 - distractorWords.length)];
        }
        const availableTokens = shuffle([...tokens, ...distractorWords]);
        const tarkib = null;

        steps.push({
          id: `sent-builder-${sIdx}`,
          type: 'sentence_builder',
          title: `কিতাবের বাক্য গঠন (${sIdx + 1}/${sentList.length})`,
          targetArabic: sent.arabic,
          targetBangla: sent.bangla,
          grammarNote: sent.grammarNote || sent.explanation,
          tarkib,
          targetTokens: tokens,
          availableTokens
        });
      }
    });
  };

  // Helper: শূন্যস্থান পূরণ (Fill in the Blank)
  const addFillBlankSteps = (sentList = sentences) => {
    sentList.forEach((sent, sIdx) => {
      const cleanAr = sent.arabic.replace(/[.,،؟!]/g, '').trim();
      const tokens = cleanAr.split(/\s+/).filter(Boolean);
      if (tokens.length >= 2) {
        const blankIdx = sIdx % 2 === 0 ? 0 : 1;
        const missingToken = tokens[blankIdx];
        const tokensBefore = tokens.slice(0, blankIdx);
        const tokensAfter = tokens.slice(blankIdx + 1);

        let distractors = [];
        if (['هٰذَا', 'هٰذِهِ', 'ذٰلِكَ', 'تِلْكَ'].includes(missingToken)) {
          distractors = ['هٰذَا', 'هٰذِهِ', 'ذٰلِكَ', 'تِلْكَ'].filter(t => t !== missingToken).slice(0, 3);
        } else {
          distractors = cleanVocab
            .map(v => v.arabic)
            .filter(ar => ar !== missingToken && !tokens.includes(ar))
            .slice(0, 3);
          if (distractors.length < 2) {
            distractors = sentList
              .filter((_, idx) => idx !== sIdx)
              .flatMap(s => s.arabic.replace(/[.,،؟!]/g, '').trim().split(/\s+/).filter(Boolean))
              .filter(t => t !== missingToken && !tokens.includes(t))
              .slice(0, 3);
          }
        }

        const options = shuffle([
          { text: missingToken, isCorrect: true },
          ...distractors.map(d => ({ text: d, isCorrect: false }))
        ]);

        steps.push({
          id: `fill-blank-${sIdx}`,
          type: 'fill_blank',
          title: 'শূন্যস্থানে সঠিক শব্দ বসান',
          targetBangla: sent.bangla,
          fullArabic: cleanAr,
          tokensBefore,
          tokensAfter,
          missingToken,
          options
        });
      }
    });
  };

  // Helper: ভুল বাক্য বা ব্যাকরণ অমিল চিহ্নিতকরণ (Spot Error)
  const addSpotErrorSteps = (sentList = sentences) => {
    sentList.forEach((sent, sIdx) => {
      const cleanAr = sent.arabic.replace(/[.,،؟!]/g, '').trim();
      const tokens = cleanAr.split(/\s+/).filter(Boolean);
      const firstToken = tokens[0];
      if (['هٰذَا', 'هٰذِهِ', 'ذٰلِكَ', 'تِلْكَ'].includes(firstToken) && tokens.length >= 2) {
        const noun = tokens[1];
        let swappedToken = '';
        if (firstToken === 'هٰذَا') swappedToken = 'هٰذِهِ';
        else if (firstToken === 'هٰذِهِ') swappedToken = 'هٰذَا';
        else if (firstToken === 'ذٰلِكَ') swappedToken = 'تِلْكَ';
        else if (firstToken === 'تِلْكَ') swappedToken = 'ذٰلِكَ';

        const wrongSentence = [swappedToken, ...tokens.slice(1)].join(' ');
        
        const options = shuffle([
          { 
            text: cleanAr, 
            isCorrect: true, 
            bangla: sent.bangla
          },
          { 
            text: wrongSentence, 
            isCorrect: false, 
            bangla: 'ব্যাকরণগতভাবে ভুল রূপ'
          }
        ]);

        steps.push({
          id: `spot-error-${sIdx}`,
          type: 'spot_error',
          title: 'কোন বাক্যটি ব্যাকরণগতভাবে শুদ্ধ?',
          targetBangla: sent.bangla,
          options
        });
      }
    });
  };

  // Helper: Normalize dialogue object in case questionArabic/answerArabic or separator formats
  const normalizeDialogue = (dlg) => {
    let qAr = dlg.questionArabic;
    let aAr = dlg.answerArabic;
    let qBn = dlg.questionBangla;
    let aBn = dlg.answerBangla;

    if ((!qAr || !aAr) && dlg.arabic && (dlg.arabic.includes('—') || dlg.arabic.includes('-'))) {
      const sep = dlg.arabic.includes('—') ? '—' : '-';
      const arParts = dlg.arabic.split(sep).map(s => s.trim());
      qAr = arParts[0] || '';
      aAr = arParts[1] || '';
      if (dlg.bangla && (dlg.bangla.includes('—') || dlg.bangla.includes('-'))) {
        const bnSep = dlg.bangla.includes('—') ? '—' : '-';
        const bnParts = dlg.bangla.split(bnSep).map(s => s.trim());
        qBn = bnParts[0] || '';
        aBn = bnParts[1] || '';
      }
    }
    return {
      ...dlg,
      speaker: dlg.speaker || 'মুয়াল্লিম ও তালিবে ইলম',
      questionArabic: qAr,
      answerArabic: aAr,
      questionBangla: qBn,
      answerBangla: aBn
    };
  };

  // Helper: বাস্তবমুখী প্রশ্নোত্তর ও কথন
  const addDialogueSteps = (dlgList = dialogues) => {
    const normalized = dlgList.map(normalizeDialogue).filter(d => d.questionArabic && d.answerArabic);
    normalized.forEach((dlg, dIdx) => {
      const answerOptions = [
        { text: dlg.answerArabic, bangla: dlg.answerBangla, isCorrect: true }
      ];
      normalized.filter((_, idx) => idx !== dIdx).slice(0, 2).forEach(other => {
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
      const tarkib = null;

      steps.push({
        id: `dialogue-${dIdx}`,
        type: 'dialogue_listen',
        title: `কথোপকথন ও প্রশ্নোত্তর (${dIdx + 1}/${normalized.length})`,
        speaker: dlg.speaker,
        questionArabic: dlg.questionArabic,
        questionBangla: dlg.questionBangla,
        tarkib,
        options: shuffle(answerOptions)
      });
    });
  };

  // Helper: জীবন্ত চ্যাট সিমুলেটর (Roleplay Chat)
  const addRoleplayChatSteps = (dlgList = dialogues) => {
    const normalized = dlgList.map(normalizeDialogue).filter(d => d.questionArabic && d.answerArabic);
    normalized.forEach((dlg, dIdx) => {
      const answerOptions = [
        { text: dlg.answerArabic, bangla: dlg.answerBangla, isCorrect: true }
      ];
      normalized.filter((_, idx) => idx !== dIdx).slice(0, 2).forEach(other => {
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

      steps.push({
        id: `roleplay-chat-${dIdx}`,
        type: 'roleplay_chat',
        title: 'জীবন্ত কথোপকথন সিমুলেটর',
        teacherName: dlg.speaker || 'মুয়াল্লিম (শিক্ষক)',
        questionArabic: dlg.questionArabic,
        questionBangla: dlg.questionBangla,
        answerArabic: dlg.answerArabic,
        answerBangla: dlg.answerBangla,
        options: shuffle(answerOptions)
      });
    });
  };

  // Helper: আত-তামরীনুল কিতাবী ও কুইজ
  const addTamrinQuizSteps = (tamrinList = tamrins, quizList = quizzes) => {
    if (Array.isArray(tamrinList) && tamrinList.length > 0) {
      tamrinList.forEach((firstTamrin, tIdx) => {
        const rawItems = firstTamrin.items || (firstTamrin.text ? [firstTamrin] : []);
        if (rawItems.length > 0) {
          const tItem = rawItems[0];
          const targetAr = tItem.arabic || tItem.prompt || 'هٰذَا كِتَابٌ';
          const targetBn = tItem.bangla || tItem.text || 'ইহা একটি বই';
          const tarkib = null;

          const distractorSentences = sentences.filter(s => s.arabic !== targetAr).slice(0, 3);
          const options = shuffle([
            { text: targetAr, bangla: targetBn, isCorrect: true },
            ...distractorSentences.map(s => ({ text: s.arabic, bangla: s.bangla, isCorrect: false }))
          ]);

          steps.push({
            id: `tamrin-challenge-${tIdx}`,
            type: 'tamrin_challenge',
            title: `আত-তামরীনুল কিতাবী অনুশীলন: ${firstTamrin.title || 'অনুবাদ ও রূপান্তর'}`,
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

    if (Array.isArray(quizList) && quizList.length > 0) {
      quizList.forEach((q, qIdx) => {
        const correctIdx = q.correctIndex !== undefined ? q.correctIndex : (q.correctAnswer !== undefined ? q.correctAnswer : 0);
        const shuffledOptions = shuffle((q.options || []).map((optText, optIdx) => ({
          text: optText,
          isCorrect: optIdx === correctIdx
        })));

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
    }
  };

  // Vocab slices for sub-units
  const cleanCount = cleanVocab.length;
  let v1 = [], v2 = [], v3 = [];
  if (cleanCount <= 20) {
    const vMid = Math.ceil(cleanCount / 2);
    v1 = cleanVocab.slice(0, vMid);
    v2 = cleanVocab.slice(vMid);
  } else {
    const s1 = Math.ceil(cleanCount / 3);
    const s2 = Math.ceil((2 * cleanCount) / 3);
    v1 = cleanVocab.slice(0, s1);
    v2 = cleanVocab.slice(s1, s2);
    v3 = cleanVocab.slice(s2);
  }

  const sentMid = Math.ceil(sentences.length / 2);
  const sentP1 = sentences.slice(0, sentMid);
  const sentP2 = sentences.slice(sentMid);

  const dlgMid = Math.ceil(dialogues.length / 2);
  const dlgP1 = dialogues.slice(0, dlgMid);
  const dlgP2 = dialogues.slice(dlgMid);

  // ডাইনামিক স্টেজ অনুযায়ী চ্যালেঞ্জ গঠন:
  if (subUnitId === 'vocab_b1') {
    addGrammarCard();
    addVocabSteps(v1, 'শব্দভাণ্ডার (১ম অংশ)', true);
    addPictureChoiceSteps(v1.slice(0, 4));
    addHarakatChoiceSteps(v1.slice(0, 2));
  } else if (subUnitId === 'vocab_b2') {
    addVocabSteps(v2, 'শব্দভাণ্ডার (২য় অংশ)', true);
    addPictureChoiceSteps(v2.slice(0, 4));
    addHarakatChoiceSteps(v2.slice(0, 2));
  } else if (subUnitId === 'vocab_b3') {
    addVocabSteps(v3, 'শব্দভাণ্ডার (৩য় অংশ)', true);
    addPictureChoiceSteps(v3.slice(0, 4));
    addHarakatChoiceSteps(v3.slice(0, 2));
  } else if (subUnitId === 'core_grammar_intro') {
    addGrammarCard();
    if (cleanVocab.length > 0) {
      addVocabSteps(cleanVocab, 'মৌলিক শব্দ', true);
      addPictureChoiceSteps(cleanVocab.slice(0, 3));
    }
    if (sentences.length > 0) {
      addSentenceSteps(sentences.slice(0, 2));
      addFillBlankSteps(sentences.slice(0, 2));
    }
  } else if (subUnitId === 'sentences_p1') {
    addSentenceSteps(sentP1);
    addFillBlankSteps(sentP1);
    addSpotErrorSteps(sentP1);
  } else if (subUnitId === 'sentences_p2') {
    const targetSent = sentP2.length > 0 ? sentP2 : sentP1;
    addSentenceSteps(targetSent);
    addFillBlankSteps(targetSent);
    addSpotErrorSteps(targetSent);
  } else if (subUnitId === 'dialogues_p1') {
    addDialogueSteps(dlgP1);
    addRoleplayChatSteps(dlgP1);
  } else if (subUnitId === 'dialogues_p2') {
    const targetDlg = dlgP2.length > 0 ? dlgP2 : dlgP1;
    addDialogueSteps(targetDlg);
    addRoleplayChatSteps(targetDlg);
  } else if (subUnitId === 'tamrin_p1') {
    addTamrinQuizSteps(tamrins, []);
  } else if (subUnitId === 'quiz_mastery') {
    addTamrinQuizSteps([], quizzes);
  } else if (subUnitId === 'core_sentences_dialogues') {
    addGrammarCard();
    if (cleanVocab.length > 0 && cleanVocab.length <= 5) {
      addVocabSteps(cleanVocab, 'মৌলিক শব্দ', true);
      addPictureChoiceSteps(cleanVocab);
    }
    addSentenceSteps(sentP1);
    addFillBlankSteps(sentP1);
    addDialogueSteps(dlgP1);
    addRoleplayChatSteps(dlgP1);
  } else if (subUnitId === 'vocab_core') {
    addGrammarCard();
    const firstBatch = cleanVocab.slice(0, 12);
    addVocabSteps(firstBatch, 'শব্দকোষ (১ম গুচ্ছ)', true);
    addPictureChoiceSteps(firstBatch.slice(0, 4));
    addHarakatChoiceSteps(firstBatch.slice(0, 2));
  } else if (subUnitId === 'vocab_ext') {
    const secondBatch = cleanVocab.slice(12, 26);
    addVocabSteps(secondBatch, 'শব্দকোষ (২য় গুচ্ছ)', true);
    addPictureChoiceSteps(secondBatch.slice(0, 4));
    addHarakatChoiceSteps(secondBatch.slice(0, 2));
  } else if (subUnitId === 'vocab') {
    addGrammarCard();
    addVocabSteps(cleanVocab, 'মৌলিক শব্দভাণ্ডার', true);
    addPictureChoiceSteps(cleanVocab.slice(0, 4));
    addHarakatChoiceSteps(cleanVocab.slice(0, 2));
  } else if (subUnitId === 'sentences_dialogues' || subUnitId === 'sentences') {
    addSentenceSteps(sentences);
    addFillBlankSteps(sentences);
    addSpotErrorSteps(sentences);
    if (subUnitId === 'sentences_dialogues') {
      addDialogueSteps(dialogues);
      addRoleplayChatSteps(dialogues);
    }
  } else if (subUnitId === 'dialogues') {
    addDialogueSteps(dialogues);
    addRoleplayChatSteps(dialogues);
  } else if (subUnitId === 'tamrin_quiz') {
    addTamrinQuizSteps(tamrins, quizzes);
  } else {
    // 'all' / মাস্টার মোড
    addGrammarCard();
    if (cleanVocab.length > 0) {
      const masterVocab = cleanVocab.length > 12 ? cleanVocab.slice(0, 10) : cleanVocab;
      addVocabSteps(masterVocab, 'শব্দভাণ্ডার', true);
      addPictureChoiceSteps(masterVocab.slice(0, 3));
      addHarakatChoiceSteps(masterVocab.slice(0, 2));
    }
    addSentenceSteps(sentences.slice(0, 3));
    addFillBlankSteps(sentences.slice(0, 3));
    addSpotErrorSteps(sentences.slice(0, 2));
    addDialogueSteps(dialogues.slice(0, 2));
    addRoleplayChatSteps(dialogues.slice(0, 2));
    addTamrinQuizSteps(tamrins, quizzes);
  }

  return steps.length > 0 ? steps : [
    {
      id: 'fallback-intro',
      type: 'intro',
      word: { arabic: 'كِتَابٌ', bangla: 'একটি বই' },
      nuances: [],
      title: 'নতুন শব্দ পরিচিতি'
    }
  ];
}

export default function DuolingoLessonModal({ 
  lesson, 
  subUnitId = 'all', 
  onClose, 
  onComplete,
  onCompleteSubUnit,
  onStartNextStage,
  onStartNextLesson,
  allLessons = [],
  lessonProgress = null
}) {
  const currentSubUnitInfo = useMemo(() => {
    if (!subUnitId || subUnitId === 'all') return null;
    const stages = getDynamicLessonStages(lesson);
    return stages.find(u => u.id === subUnitId) || LESSON_SUB_UNITS.find(u => u.id === subUnitId) || null;
  }, [lesson, subUnitId]);

  const initialSteps = useMemo(() => buildComprehensiveLessonSteps(lesson, subUnitId), [lesson, subUnitId]);
  const [steps, setSteps] = useState(initialSteps);
  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    try {
      if (typeof window !== 'undefined' && lesson?.id && subUnitId) {
        const saved = localStorage.getItem(`uls_step_${lesson.id}_${subUnitId}`) || sessionStorage.getItem(`uls_step_${lesson.id}_${subUnitId}`);
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < initialSteps.length) {
          return idx;
        }
      }
    } catch (e) {}
    return 0;
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBubbles, setSelectedBubbles] = useState([]);
  const [filledBlankToken, setFilledBlankToken] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [completionInfo, setCompletionInfo] = useState(null);
  const startedAtRef = useRef(0);
  const contentScrollRef = useRef(null);
  // সঠিক উত্তর দেওয়া ধাপ (পুনরাবৃত্তি একবারই গোনা হয়) — প্রতি সঠিক উত্তরে XP
  const correctStepIdsRef = useRef(new Set());
  const [soundMuted, toggleSound] = useSoundMuted();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeQaidaModal, setActiveQaidaModal] = useState(null);
  const [showEnglish, setShowEnglish] = useState(() => getShowEnglish());

  useEffect(() => {
    const handleEngChange = (e) => {
      setShowEnglish(e.detail ? e.detail.showEnglish : getShowEnglish());
    };
    window.addEventListener('uls_english_preference_changed', handleEngChange);
    return () => window.removeEventListener('uls_english_preference_changed', handleEngChange);
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && lesson?.id && subUnitId) {
        if (!isFinished) {
          localStorage.setItem(`uls_step_${lesson.id}_${subUnitId}`, String(currentStepIdx));
          sessionStorage.setItem(`uls_step_${lesson.id}_${subUnitId}`, String(currentStepIdx));
        } else {
          localStorage.removeItem(`uls_step_${lesson.id}_${subUnitId}`);
          sessionStorage.removeItem(`uls_step_${lesson.id}_${subUnitId}`);
        }
      }
    } catch (e) {}
  }, [lesson?.id, subUnitId, currentStepIdx, isFinished]);

  // পর্বের ক্বায়েদা নির্ধারণ (যদি এই পর্বে ক্বায়েদা থাকে)
  const currentStageQaida = useMemo(() => {
    if (!lesson) return null;
    // ১. lesson.qaida-তে stageId অনুযায়ী সরাসরি মিল
    if (Array.isArray(lesson.qaida) && subUnitId) {
      const parentId = findBookPart(lesson, subUnitId)?.parentId;
      const match = lesson.qaida.find(q => q.stageId === subUnitId || q.id === subUnitId || (parentId && q.stageId === parentId));
      if (match) return match;
    }
    // ২. bookStages-এ স্টেজের নিজস্ব qaida বা grammar_card ধাপ
    if (Array.isArray(lesson.bookStages) && subUnitId) {
      // ছোট পর্বের মূল পর্ব (ক্বায়েদা কার্ড মূল পর্বের যেকোনো অংশে থাকতে পারে)
      const parentId = findBookPart(lesson, subUnitId)?.parentId || subUnitId;
      const stage = lesson.bookStages.find(s => s.id === parentId);
      if (stage) {
        if (stage.qaida) return stage.qaida;
        const gc = stage.steps?.find(s => s.type === 'grammar_card');
        if (gc) {
          return {
            id: gc.id || `${stage.id}-qaida`,
            title: gc.title || 'কিতাবের ক্বায়েদা',
            rule: gc.summary || '',
            table: gc.table || [],
            examples: gc.points ? gc.points.map(p => ({ arabic: p, bangla: '' })) : (gc.examples || [])
          };
        }
      }
    }
    // ৩. বর্তমান ধাপগুলোর মধ্যে grammar_card ধাপ থাকলে
    const gcStep = steps.find(s => s.type === 'grammar_card');
    if (gcStep) {
      return {
        id: gcStep.id || `stage-${subUnitId}-qaida`,
        title: gcStep.title || 'কিতাবের ক্বায়েদা',
        rule: gcStep.summary || '',
        table: gcStep.table || [],
        examples: gcStep.points ? gcStep.points.map(p => ({ arabic: p, bangla: '' })) : (gcStep.examples || [])
      };
    }
    // ৪. ব্যাকরণ সংশ্লিষ্ট পর্বে lesson.qaida থাকলে
    if (Array.isArray(lesson.qaida) && lesson.qaida.length > 0 && subUnitId) {
      if (subUnitId.includes('rule') || subUnitId.includes('grammar') || subUnitId.includes('qaida') || subUnitId.includes('kayfa') || subUnitId.includes('hal')) {
        return lesson.qaida[0];
      }
    }
    return null;
  }, [lesson, subUnitId, steps]);

  // পুরো দারসের প্রধান ক্বায়েদা (দারস সমাপ্তির স্ক্রিনের জন্য)
  const lessonFirstQaida = useMemo(() => {
    if (!lesson) return null;
    if (Array.isArray(lesson.qaida) && lesson.qaida.length > 0) return lesson.qaida[0];
    if (Array.isArray(lesson.bookStages)) {
      for (const st of lesson.bookStages) {
        if (st.qaida) return st.qaida;
        const gc = st.steps?.find(s => s.type === 'grammar_card');
        if (gc) {
          return {
            id: gc.id || 'lesson-qaida',
            title: gc.title || 'কিতাবের ক্বায়েদা',
            rule: gc.summary || '',
            table: gc.table || [],
            examples: gc.points ? gc.points.map(p => ({ arabic: p, bangla: '' })) : (gc.examples || [])
          };
        }
      }
    }
    return null;
  }, [lesson]);

  // Performance and Accuracy Tracking
  const [mistakesCount, setMistakesCount] = useState(0);
  const [streakCombo, setStreakCombo] = useState(0);


  // Match pairs state (independent Sets for Arabic and Bangla card IDs to prevent deadlock)
  const [matchedArabicCardIds, setMatchedArabicCardIds] = useState(new Set());
  const [matchedBanglaCardIds, setMatchedBanglaCardIds] = useState(new Set());
  const [selectedArabicCard, setSelectedArabicCard] = useState(null);
  const [selectedBanglaCard, setSelectedBanglaCard] = useState(null);

  // Sort groups state (দুই দলে ভাগ করো)
  const [sortPlacedCount, setSortPlacedCount] = useState(0);
  const [sortWrongGroupId, setSortWrongGroupId] = useState(null);
  const sortWrongTimerRef = useRef(null);

  // Auto-advance timer ref for effortless learning flow
  const autoAdvanceTimerRef = useRef(null);

  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const activeStep = steps[currentStepIdx] || steps[0];
  const progressPercent = Math.min(100, ((currentStepIdx) / steps.length) * 100);

  // Normalized matching pairs with guaranteed unique pairId
  const pairsWithIds = useMemo(() => {
    if (activeStep?.type !== 'match_pairs' || !Array.isArray(activeStep.pairs)) return [];
    return activeStep.pairs.map((p, idx) => ({
      ...p,
      pairId: p.pairId || `pair-${idx}-${p.arabic}`
    }));
  }, [activeStep]);

  // Rotate bangla cards so they don't appear in the exact same horizontal row as Arabic
  const shuffledBanglaCards = useMemo(() => {
    if (!pairsWithIds.length) return [];
    const list = [...pairsWithIds];
    if (list.length > 1) {
      return [...list.slice(1), list[0]];
    }
    return list;
  }, [pairsWithIds]);

  // Advance to next step
  const handleNextStep = () => {
    clearAutoAdvance();
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      playCompletionFanfare();
      confetti({
        particleCount: 160,
        spread: 95,
        origin: { y: 0.6 }
      });

      // Dynamic calculation of score & stars based on actual mistakes
      const score = mistakesCount === 0 ? 100 : Math.max(60, Math.round(100 - (mistakesCount * 10)));
      const stars = mistakesCount === 0 ? 3 : (mistakesCount <= 2 ? 2 : 1);
      const earnedXp = calcSessionXp(correctStepIdsRef.current.size, mistakesCount);
      const timeSec = Math.round((Date.now() - startedAtRef.current) / 1000);

      // অর্জন স্ক্রিনের তথ্য: পরের পর্ব, অথবা শেষ পর্ব হলে পুরো দারসের হিসাব
      const stages = getDynamicLessonStages(lesson);
      const stageIdx = stages.findIndex(st => st.id === subUnitId);
      const isStageMode = Boolean(subUnitId && subUnitId !== 'all' && stageIdx >= 0);
      const isDarsComplete = !isStageMode || stageIdx === stages.length - 1;
      const darsBonus = isStageMode && isDarsComplete ? XP_RULES.darsBonus : 0;
      const { streakBonus = 0 } = recordDailyActivity(earnedXp + darsBonus) || {};
      const bonuses = [
        darsBonus > 0 && { label: 'দারস বোনাস', xp: darsBonus },
        streakBonus > 0 && { label: `${XP_RULES.streakBonusEvery} দিনের স্ট্রিক বোনাস`, xp: streakBonus }
      ].filter(Boolean);
      const previousStats = Object.entries(lessonProgress?.stageStats || {})
        .filter(([id]) => id !== subUnitId)
        .map(([, stat]) => stat);
      const allStats = [...previousStats, { xp: earnedXp, timeSec, score }];
      const lessonIdx = allLessons.findIndex(l => l.id === lesson.id);
      setCompletionInfo({
        xp: earnedXp,
        accuracy: score,
        timeSec,
        isDarsComplete,
        nextStageId: isStageMode && !isDarsComplete ? stages[stageIdx + 1].id : null,
        nextLesson: lessonIdx >= 0 ? allLessons[lessonIdx + 1] || null : null,
        stageCount: stages.length,
        bonuses,
        totalXp: allStats.reduce((sum, st) => sum + (st.xp || 0), 0) + darsBonus,
        totalTimeSec: allStats.reduce((sum, st) => sum + (st.timeSec || 0), 0),
        avgAccuracy: Math.round(allStats.reduce((sum, st) => sum + (st.score || 0), 0) / allStats.length)
      });
      if (isStageMode && isDarsComplete) {
        confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
        confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
      }

      if (subUnitId && subUnitId !== 'all') {
        if (onCompleteSubUnit) {
          onCompleteSubUnit(lesson.id, subUnitId, {
            score,
            stars,
            xp: earnedXp,
            timeSec,
            mistakes: mistakesCount,
            completedAt: new Date().toISOString()
          });
        }
      } else if (onComplete) {
        onComplete(lesson.id, {
          completed: true,
          score,
          stars,
          xp: earnedXp,
          mistakes: mistakesCount,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  const scheduleAutoAdvance = (delayMs = 850) => {
    clearAutoAdvance();
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNextStep();
    }, delayMs);
  };

  // Audio trigger & step reset
  useEffect(() => {
    clearAutoAdvance();
    setSelectedOption(null);
    setSelectedBubbles([]);
    setFilledBlankToken(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedArabicCard(null);
    setSelectedBanglaCard(null);
    setMatchedArabicCardIds(new Set());
    setMatchedBanglaCardIds(new Set());
    setSortPlacedCount(0);
    setSortWrongGroupId(null);
    contentScrollRef.current?.scrollTo({ top: 0 });

    if (!activeStep) return;
    // Autoplay on intro, dialogue question, picture choice, roleplay chat, or harakat choice
    if (activeStep.type === 'intro' && activeStep.word?.arabic) {
      setTimeout(() => playArabicAudio(activeStep.word.arabic), 250);
    } else if (activeStep.type === 'dialogue_listen' && activeStep.questionArabic) {
      setTimeout(() => playArabicAudio(activeStep.questionArabic), 250);
    } else if (activeStep.type === 'picture_choice' && activeStep.targetArabic) {
      setTimeout(() => playArabicAudio(activeStep.targetArabic), 250);
    } else if (activeStep.type === 'roleplay_chat' && activeStep.questionArabic) {
      setTimeout(() => playArabicAudio(activeStep.questionArabic), 250);
    }

    return () => clearAutoAdvance();
  }, [currentStepIdx, activeStep]);

  // পর্ব শুরুর সময় (অর্জন স্ক্রিনে সময় দেখানোর জন্য)
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  // উত্তর দেওয়ার পর সঠিক উত্তর ও ব্যাখ্যা যেন স্ক্রল না করেই দেখা যায়
  useEffect(() => {
    if (!isAnswered) return;
    const el = contentScrollRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [isAnswered]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      clearAutoAdvance();
      clearTimeout(sortWrongTimerRef.current);
    };
  }, []);

  const markStepCorrect = () => {
    if (activeStep?.id) correctStepIdsRef.current.add(String(activeStep.id).replace(/-retry-\d+$/, ''));
  };

  // Sort Groups: বর্তমান বাক্য/শব্দটি সঠিক দলে রাখা
  const handleSortPick = (groupId) => {
    if (isAnswered || activeStep?.type !== 'sort_groups') return;
    const item = activeStep.items[sortPlacedCount];
    if (!item) return;

    if (item.group === groupId) {
      playSuccessChime();
      playArabicAudio(item.reveal || item.arabic);
      const nextCount = sortPlacedCount + 1;
      setSortPlacedCount(nextCount);
      setSortWrongGroupId(null);
      if (nextCount === activeStep.items.length) {
        markStepCorrect();
        setIsAnswered(true);
        setIsCorrect(true);
        scheduleAutoAdvance(1200);
      }
    } else {
      playMistakeNotice();
      setMistakesCount(c => c + 1);
      setSortWrongGroupId(groupId);
      clearTimeout(sortWrongTimerRef.current);
      sortWrongTimerRef.current = setTimeout(() => setSortWrongGroupId(null), 700);
    }
  };

  const handleToggleSound = () => {
    toggleSound();
  };

  // MCQ Selection Check (with auto-advance on correct answer)
  const handleSelectMCQ = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    setIsCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      playSuccessChime();
      markStepCorrect();
      setStreakCombo(prev => prev + 1);
      if (opt.text && /[\u0600-\u06FF]/.test(opt.text)) {
        setTimeout(() => playArabicAudio(opt.text), 180);
      }
      // Auto-advance after brief success chime
      scheduleAutoAdvance(850);
    } else {
      playMistakeNotice();
      setMistakesCount(c => c + 1);
      setStreakCombo(0);
      recordMistake({
        id: activeStep.id,
        type: activeStep.type === 'spot_error' ? 'sentence' : (activeStep.type === 'quiz_challenge' ? 'quiz' : 'word'),
        arabic: activeStep.arabic || (activeStep.word && activeStep.word.arabic) || '',
        bengali: activeStep.bengali || (activeStep.word && activeStep.word.bengali) || '',
        question: activeStep.question || activeStep.title || '',
        options: activeStep.options,
        correctText: activeStep.options?.find(o => o.isCorrect)?.text || activeStep.bengali || '',
        sourceTitle: lesson ? `${lesson.titleBn || lesson.title || 'দরস'}` : 'দরসের কুইজ'
      });
      // Spaced repetition retry queue: re-add this step to end
      setSteps(prev => [...prev, { ...activeStep, id: activeStep.id + '-retry-' + Date.now(), isRetry: true }]);
    }
  };

  // Blank Selection Check (with immediate visual fill & auto-advance on correct)
  const handleSelectBlankToken = (opt) => {
    if (isAnswered) return;
    setFilledBlankToken(opt.text);
    setSelectedOption(opt);
    setIsAnswered(true);
    setIsCorrect(opt.isCorrect);

    if (opt.isCorrect) {
      playSuccessChime();
      markStepCorrect();
      setStreakCombo(prev => prev + 1);
      const textToSpeak = activeStep.fullArabic || opt.text;
      setTimeout(() => playArabicAudio(textToSpeak), 180);
      scheduleAutoAdvance(1100);
    } else {
      playMistakeNotice();
      setMistakesCount(c => c + 1);
      setStreakCombo(0);
      recordMistake({
        id: activeStep.id,
        type: 'sentence',
        arabic: activeStep.fullArabic || activeStep.arabic || '',
        bengali: activeStep.fullBengali || activeStep.bengali || '',
        question: activeStep.title || 'শূন্যস্থান পূরণ',
        options: activeStep.options,
        correctText: activeStep.options?.find(o => o.isCorrect)?.text || '',
        sourceTitle: lesson ? `${lesson.titleBn || lesson.title || 'দরস'}` : 'দরসের শূন্যস্থান'
      });
      // Spaced repetition retry queue: re-add this step to end
      setSteps(prev => [...prev, { ...activeStep, id: activeStep.id + '-retry-' + Date.now(), isRetry: true }]);
    }
  };

  // Sentence Builder Handlers
  const handleSelectBubble = (token, tIdx) => {
    if (isAnswered) return;
    if (selectedBubbles.some(b => b.tIdx === tIdx)) {
      setSelectedBubbles(prev => prev.filter(b => b.tIdx !== tIdx));
    } else {
      setSelectedBubbles(prev => [...prev, { token, tIdx }]);
      if (/[\u0600-\u06FF]/.test(token)) {
        playArabicAudio(token);
      }
    }
  };

  const handleCheckSentence = () => {
    if (isAnswered) return;
    const constructed = selectedBubbles.map(b => b.token).join(' ');
    const expected = (activeStep.targetTokens || []).join(' ');
    const correct = constructed === expected;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      markStepCorrect();
      setStreakCombo(prev => prev + 1);
      setTimeout(() => playArabicAudio(activeStep.targetArabic), 200);
      // Auto-advance after giving learner time to hear audio
      scheduleAutoAdvance(1100);
    } else {
      playMistakeNotice();
      setMistakesCount(c => c + 1);
      setStreakCombo(0);
      recordMistake({
        id: activeStep.id,
        type: 'sentence',
        arabic: activeStep.targetArabic || '',
        bengali: activeStep.targetBangla || '',
        sourceTitle: lesson ? `${lesson.titleBn || lesson.title || 'দরস'}` : 'বাক্য গঠন'
      });
      // Spaced repetition retry queue
      setSteps(prev => [...prev, { ...activeStep, id: activeStep.id + '-retry-' + Date.now(), isRetry: true }]);
    }
  };

  // Match Pairs Handlers (ID-based matching with auto-advance)
  const handleMatchArabic = (arCard) => {
    if (matchedArabicCardIds.has(arCard.pairId)) return;
    setSelectedArabicCard(arCard);
    playArabicAudio(arCard.arabic);

    if (selectedBanglaCard) {
      const isMatch = (selectedBanglaCard.pairId === arCard.pairId) || 
                      (selectedBanglaCard.bangla === arCard.bangla && selectedBanglaCard.arabic === arCard.arabic) ||
                      (selectedBanglaCard.bangla === arCard.bangla);

      if (isMatch) {
        playSuccessChime();
        const nextAr = new Set(matchedArabicCardIds).add(arCard.pairId);
        const nextBn = new Set(matchedBanglaCardIds).add(selectedBanglaCard.pairId);
        setMatchedArabicCardIds(nextAr);
        setMatchedBanglaCardIds(nextBn);

        if (nextAr.size === pairsWithIds.length) {
          markStepCorrect();
          setIsAnswered(true);
          setIsCorrect(true);
          scheduleAutoAdvance(900);
        }
      } else {
        playMistakeNotice();
        setMistakesCount(c => c + 1);
      }
      setSelectedArabicCard(null);
      setSelectedBanglaCard(null);
    }
  };

  const handleMatchBangla = (bnCard) => {
    if (matchedBanglaCardIds.has(bnCard.pairId)) return;
    setSelectedBanglaCard(bnCard);

    if (selectedArabicCard) {
      const isMatch = (selectedArabicCard.pairId === bnCard.pairId) || 
                      (selectedArabicCard.bangla === bnCard.bangla && selectedArabicCard.arabic === bnCard.arabic) ||
                      (selectedArabicCard.bangla === bnCard.bangla);

      if (isMatch) {
        playSuccessChime();
        const nextAr = new Set(matchedArabicCardIds).add(selectedArabicCard.pairId);
        const nextBn = new Set(matchedBanglaCardIds).add(bnCard.pairId);
        setMatchedArabicCardIds(nextAr);
        setMatchedBanglaCardIds(nextBn);

        if (nextAr.size === pairsWithIds.length) {
          markStepCorrect();
          setIsAnswered(true);
          setIsCorrect(true);
          scheduleAutoAdvance(900);
        }
      } else {
        playMistakeNotice();
        setMistakesCount(c => c + 1);
      }
      setSelectedArabicCard(null);
      setSelectedBanglaCard(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] supports-[height:100dvh]:max-h-[94dvh] overflow-hidden">
        
        {/* Top Progress & Utility Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X size={20} />
          </button>

          {/* Sub-Unit Badge if active */}
          {currentSubUnitInfo && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 shrink-0">
              <span>{currentSubUnitInfo.badge}</span>
              <span className="opacity-60">•</span>
              <span>{currentSubUnitInfo.shortTitle}</span>
            </span>
          )}

          {/* Progress Bar */}
          <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {currentStepIdx + 1}/{steps.length}
          </span>

          {/* Streak Combo Badge */}
          {streakCombo >= 2 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-xs animate-float-up shrink-0">
              <span>🔥</span>
              <span>{streakCombo}</span>
            </span>
          )}


                    {/* Report Issue Button */}
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="এই পাঠ বা প্রশ্নে কোনো ভুল থাকলে রিপোর্ট করুন"
          >
            <Flag size={17} />
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={soundMuted ? 'সাউন্ড চালু করুন' : 'সাউন্ড মিউট করুন'}
          >
            {soundMuted ? <VolumeX size={18} className="text-rose-500" /> : <Volume2 size={18} className="text-teal-600" />}
          </button>
        </div>

        {/* Content Body */}
        <div ref={contentScrollRef} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {!isFinished ? (
            <div className="space-y-4">
              {/* RETRY BADGE IF THIS STEP WAS PREVIOUSLY MISSED */}
              {activeStep.isRetry && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-300">
                  <RotateCcw size={13} className="animate-spin" />
                  <span>পুনরাবৃত্তি: পূর্বের ভুলটি পুনরায় শুদ্ধ করুন</span>
                </div>
              )}

              {/* STEP: GRAMMAR CARD INTRO */}
              {activeStep.type === 'grammar_card' && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-extrabold mb-2">
                      <Lightbulb size={13} className="text-amber-600 fill-amber-500" />
                      <span>কিতাব থেকে</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {activeStep.title || 'কিতাবের টেবিল'}
                    </h3>
                  </div>

                  {activeStep.summary && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 shadow-xs">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        <MixedText text={activeStep.summary} />
                      </p>
                    </div>
                  )}

                  {Array.isArray(activeStep.points) && activeStep.points.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block px-1">
                        উদাহরণ:
                      </span>
                      <div className="space-y-2">
                        {activeStep.points.map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {toBengaliNumber(idx + 1)}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                              <MixedText text={pt} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* কিতাবের টেবিল (হুবহু) */}
                  {Array.isArray(activeStep.table) && activeStep.table.length > 0 && (
                    <div className="rounded-2xl overflow-hidden border border-amber-200/80 dark:border-amber-800/60 divide-y divide-amber-200/70 dark:divide-amber-800/50 bg-white dark:bg-slate-800 shadow-xs">
                      {activeStep.table.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-2 items-center">
                          <button
                            type="button"
                            onClick={() => playArabicAudio(row.arabic)}
                            className="px-3 py-2.5 font-arabic font-bold text-xl sm:text-2xl text-slate-900 dark:text-white text-center border-r border-amber-200/70 dark:border-amber-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                            title="উচ্চারণ শুনুন"
                          >
                            {row.arabic}
                          </button>
                          <span className="px-3 py-2.5 text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 text-center">
                            {row.bangla}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeStep.tip && (
                    <p className="text-xs sm:text-sm text-teal-900 dark:text-teal-100 bg-teal-50 dark:bg-teal-950/40 p-3 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 leading-relaxed">
                      💡 <MixedText text={activeStep.tip} />
                    </p>
                  )}
                </div>
              )}

              {/* STEP 1: INTRODUCE WORD WITH SUBTLE NUANCE */}
              {activeStep.type === 'intro' && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold">
                    <Sparkles size={13} />
                    <span>{activeStep.title}</span>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                    <StepPicture step={activeStep} />
                    <div className="flex justify-center">
                      <span className="font-arabic font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white leading-relaxed select-text">
                        {activeStep.word?.arabic}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex flex-col items-center">
                      <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                        {activeStep.word?.bangla || activeStep.word?.bengali}
                      </p>
                      {showEnglish && getEnglishTranslation(activeStep.word, activeStep.word?.bangla || activeStep.word?.bengali) && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold font-sans border border-slate-300/50 dark:border-slate-600/50 shadow-2xs">
                          {getEnglishTranslation(activeStep.word, activeStep.word?.bangla || activeStep.word?.bengali)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={() => playArabicAudio(activeStep.word.arabic)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <Volume2 size={16} />
                        <span>উচ্চারণ শুনুন</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: MCQ MEANING CHECK */}
              {activeStep.type === 'mcq' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center">
                    <span className="font-arabic font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white block mb-1">
                      {activeStep.word?.arabic}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                      <MixedText text={activeStep.question} />
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 border-b-4 hover:border-emerald-400 active:border-b-2 shadow-sm';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 border-b-4 shadow-md animate-success-pop';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600 border-b-4 animate-shake-soft';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`p-4 rounded-2xl border-2 text-center font-bold text-base transition-all cursor-pointer btn-press-3d ${btnStyle}`}
                        >
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: MATCH PAIRS */}
              {activeStep.type === 'match_pairs' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                      {activeStep.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      আরবি শব্দের সাথে সঠিক বাংলা অর্থ ট্যাপ করে মেলান
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Arabic Column */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">আরবি</span>
                      {pairsWithIds.map((p) => {
                        const isDone = matchedArabicCardIds.has(p.pairId);
                        const isSelected = selectedArabicCard?.pairId === p.pairId;
                        return (
                          <button
                            key={p.pairId}
                            type="button"
                            disabled={isDone}
                            onClick={() => handleMatchArabic(p)}
                            className={`w-full min-h-[58px] p-2.5 rounded-2xl font-arabic font-bold text-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 opacity-60'
                                : isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                            }`}
                          >
                            <span>{p.arabic}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bangla Column */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">বাংলা অর্থ</span>
                      {shuffledBanglaCards.map((p) => {
                        const isDone = matchedBanglaCardIds.has(p.pairId);
                        const isSelected = selectedBanglaCard?.pairId === p.pairId;
                        return (
                          <button
                            key={p.pairId}
                            type="button"
                            disabled={isDone}
                            onClick={() => handleMatchBangla(p)}
                            className={`w-full min-h-[58px] p-2.5 rounded-2xl font-bold text-sm border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 opacity-60'
                                : isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                            }`}
                          >
                            <span className="leading-tight">{p.bangla}</span>
                            {showEnglish && getEnglishTranslation(p, p.bangla) && (
                              <span className="text-[10px] font-medium font-sans opacity-70 mt-0.5 leading-none">
                                ({getEnglishTranslation(p, p.bangla)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: SORT INTO TWO GROUPS */}
              {activeStep.type === 'sort_groups' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                      <MixedText text={activeStep.title} />
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      উপরের কার্ডটি পড়ুন, তারপর সঠিক দলে ট্যাপ করুন ({toBengaliNumber(Math.min(sortPlacedCount + 1, activeStep.items.length))}/{toBengaliNumber(activeStep.items.length)})
                    </p>
                  </div>

                  {sortPlacedCount < activeStep.items.length ? (
                    <div key={sortPlacedCount} className={`p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center animate-fade-in ${activeStep.items[sortPlacedCount].distance ? 'flex-col gap-2' : 'gap-4'}`}>
                      {activeStep.items[sortPlacedCount].distance ? (
                        <DistanceScene
                          name={activeStep.items[sortPlacedCount].picture}
                          distance={activeStep.items[sortPlacedCount].distance}
                          className="max-w-[200px] sm:max-w-[220px]"
                        />
                      ) : (
                        <BookPicture name={activeStep.items[sortPlacedCount].picture} className="w-16 h-16 shrink-0" />
                      )}
                      <div className="text-center">
                        <span className="font-arabic font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white block leading-relaxed">
                          {activeStep.items[sortPlacedCount].arabic}
                        </span>
                        <button
                          type="button"
                          onClick={() => playArabicAudio(activeStep.items[sortPlacedCount].arabic)}
                          className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
                        >
                          <Volume2 size={13} />
                          <span>উচ্চারণ শুনুন</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center text-sm font-bold text-emerald-800 dark:text-emerald-200">
                      মাশাআল্লাহ! সবগুলো ঠিক দলে রাখা হয়েছে।
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3" dir="rtl">
                    {activeStep.groups.map(group => {
                      const placed = activeStep.items.slice(0, sortPlacedCount).filter(it => it.group === group.id);
                      const isWrong = sortWrongGroupId === group.id;
                      return (
                        <div key={group.id} className="space-y-2">
                          <button
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSortPick(group.id)}
                            className={`w-full p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                              isWrong
                                ? 'bg-rose-500 text-white border-rose-600'
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-sm'
                            }`}
                          >
                            <span className="font-arabic font-bold text-2xl sm:text-3xl block leading-snug">{group.arabic}</span>
                            {group.label && (
                              <span className={`text-xs font-bold block ${isWrong ? 'text-white/90' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                {group.label}
                              </span>
                            )}
                          </button>
                          <div className="min-h-[48px] p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-200 dark:border-slate-700 space-y-1.5">
                            {placed.map(it => (
                              <div key={it.reveal || it.arabic} className="px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-center animate-fade-in">
                                <span className="font-arabic font-bold text-lg text-emerald-800 dark:text-emerald-200 block leading-snug">
                                  {it.reveal || it.arabic}
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-700/90 dark:text-emerald-300/90 block">
                                  {it.bangla}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP: PICTURE CHOICE */}
              {activeStep.type === 'picture_choice' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold mb-1">
                      <Sparkles size={13} />
                      <span>{activeStep.title || 'ছবি দেখে সঠিক উত্তর নির্বাচন করুন'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-arabic font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white leading-relaxed">
                        {activeStep.targetArabic}
                      </span>
                      <button
                        type="button"
                        onClick={() => playArabicAudio(activeStep.targetArabic)}
                        className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                    {activeStep.targetBangla && (
                      <div className="space-y-1 mt-0.5 flex flex-col items-center">
                        <p className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400">
                          "{activeStep.targetBangla}"
                        </p>
                        {showEnglish && getEnglishTranslation(activeStep, activeStep.targetBangla) && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold font-sans">
                            <span className="text-[10px] uppercase font-bold opacity-75">EN</span>
                            <span>{getEnglishTranslation(activeStep, activeStep.targetBangla)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:shadow-md';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500 shadow-md scale-102';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800/50 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${btnStyle}`}
                        >
                          {hasBookPicture(opt.picture) ? (
                            <BookPicture name={opt.picture} className="w-20 h-20 sm:w-24 sm:h-24" />
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${opt.color || 'bg-emerald-100 text-emerald-700'}`}>
                              <HalalIcon name={opt.icon} className="w-8 h-8" />
                            </div>
                          )}
                          {(!opt.picture || isAnswered) && (
                            <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                              {opt.bangla}
                            </span>
                          )}
                          {isAnswered && opt.isCorrect && (
                            <span className="font-arabic text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {opt.text}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP: HARAKAT CHOICE */}
              {activeStep.type === 'harakat_choice' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      <Sparkles size={13} />
                      <span>{activeStep.title}</span>
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      <MixedText text={activeStep.question} />
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      অর্থ: "{activeStep.meaning}"
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-400';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="text-xs font-semibold opacity-90 text-left">
                            {opt.note}
                          </span>
                          <span className="font-arabic font-bold text-2xl sm:text-3xl text-right">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {activeStep.ruleHint && (
                    <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200/80 dark:border-amber-800/60">
                      {activeStep.ruleHint}
                    </p>
                  )}
                </div>
              )}

              {/* STEP 4: SENTENCE BUILDER WITH INTERACTIVE TARKIB */}
              {activeStep.type === 'sentence_builder' && (
                <div className="space-y-4 animate-fade-in">
                  <StepPicture step={activeStep} />
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <PenTool size={13} />
                        <span>{activeStep.title}</span>
                      </span>
                      
                      {/* পুরো বাক্যের উচ্চারণ উত্তর দেওয়ার পরেই — আগে শোনালে উত্তর বলে দেওয়া হয় */}
                      {isAnswered && (
                      <button
                        type="button"
                        onClick={() => playArabicAudio(activeStep.targetArabic)}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        title="ইঙ্গিত: উচ্চারণ শুনুন"
                      >
                        <Volume2 size={13} />
                        <span>উচ্চারণ শুনুন</span>
                      </button>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                        "{activeStep.targetBangla}"
                      </p>
                      {showEnglish && getEnglishTranslation(activeStep, activeStep.targetBangla) && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold font-sans">
                          <span className="text-[10px] uppercase font-bold opacity-75">EN</span>
                          <span>{getEnglishTranslation(activeStep, activeStep.targetBangla)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bubble drop zone */}
                  <div dir="rtl" className="min-h-[75px] p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-center gap-2">
                    {selectedBubbles.length === 0 ? (
                      <span className="text-xs text-slate-400 font-medium">
                        নিচের শব্দগুলোতে ট্যাপ করে আরবি বাক্য গঠন করুন
                      </span>
                    ) : (
                      selectedBubbles.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectBubble(item.token, item.tIdx)}
                          className="px-3.5 py-1.5 rounded-xl font-arabic font-bold text-2xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
                        >
                          {item.token}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Scrambled bubbles */}
                  <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    {activeStep.availableTokens.map((token, tIdx) => {
                      const isUsed = selectedBubbles.some(b => b.tIdx === tIdx);
                      return (
                        <button
                          key={tIdx}
                          type="button"
                          disabled={isUsed || isAnswered}
                          onClick={() => handleSelectBubble(token, tIdx)}
                          className={`px-3.5 py-1.5 rounded-xl font-arabic font-bold text-2xl border-2 transition-all cursor-pointer ${
                            isUsed
                              ? 'opacity-25 bg-slate-200 dark:bg-slate-800 border-transparent cursor-not-allowed'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-sm'
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* STEP: FILL IN THE BLANK */}
              {activeStep.type === 'fill_blank' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-3">
                    <StepPicture step={activeStep} />
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {activeStep.title || 'শূন্যস্থানে সঠিক শব্দ বসান:'}
                      </span>
                    </div>

                    {activeStep.targetBangla && (
                      <div className="space-y-1 flex flex-col items-center">
                        <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                          "{activeStep.targetBangla}"
                        </p>
                        {showEnglish && getEnglishTranslation(activeStep, activeStep.targetBangla) && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold font-sans">
                            <span className="text-[10px] uppercase font-bold opacity-75">EN</span>
                            <span>{getEnglishTranslation(activeStep, activeStep.targetBangla)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap font-arabic text-3xl sm:text-4xl text-slate-900 dark:text-white leading-relaxed" dir="rtl">
                      {activeStep.tokensBefore?.map((t, idx) => (
                        <span key={`b-${idx}`}>{t}</span>
                      ))}
                      <span className={`px-4 py-1.5 rounded-2xl border-2 font-arabic font-bold text-2xl sm:text-3xl min-w-[90px] inline-flex items-center justify-center transition-all ${
                        filledBlankToken
                          ? (isAnswered && isCorrect ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : (isAnswered && !isCorrect ? 'bg-rose-500 text-white border-rose-600' : 'bg-emerald-100 text-emerald-800 border-emerald-400'))
                          : 'border-dashed border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 animate-pulse'
                      }`}>
                        {filledBlankToken || '___'}
                      </span>
                      {activeStep.tokensAfter?.map((t, idx) => (
                        <span key={`a-${idx}`}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Bubble Option Chips */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-400 block text-center mb-3">
                      নিচের উপযুক্ত শব্দটি বেছে নিন:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {activeStep.options?.map((opt, idx) => {
                        const isChosen = filledBlankToken === opt.text;
                        let chipStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 border-b-4 hover:border-emerald-500 active:border-b-2 shadow-sm hover:scale-105';
                        if (isAnswered) {
                          if (opt.isCorrect) {
                            chipStyle = 'bg-emerald-500 text-white border-emerald-600 border-b-4 shadow-md animate-success-pop';
                          } else if (isChosen && !opt.isCorrect) {
                            chipStyle = 'bg-rose-500 text-white border-rose-600 border-b-4 animate-shake-soft';
                          } else {
                            chipStyle = 'opacity-30 bg-slate-100 dark:bg-slate-800 border-transparent';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectBlankToken(opt)}
                            className={`px-5 py-2.5 rounded-2xl font-arabic font-bold text-2xl border-2 transition-all cursor-pointer btn-press-3d ${chipStyle}`}
                          >
                            {opt.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP: SPOT ERROR */}
              {activeStep.type === 'spot_error' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      <Sparkles size={13} />
                      <span>{activeStep.title}</span>
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                      অর্থ: "{activeStep.targetBangla}"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      নিচের বাক্য দুটির মধ্যে ব্যাকরণগতভাবে শুদ্ধ বাক্যটি নির্বাচন করুন:
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let cardStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 border-b-4 hover:border-emerald-400 active:border-b-2 shadow-xs';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          cardStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 border-b-4 text-emerald-900 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500 animate-success-pop';
                        } else if (isSelected && !opt.isCorrect) {
                          cardStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 border-b-4 text-rose-900 dark:text-rose-100 animate-shake-soft';
                        } else {
                          cardStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`w-full p-4 rounded-2xl border-2 text-right transition-all cursor-pointer btn-press-3d ${cardStyle}`}
                        >
                          <div className="flex items-center justify-between mb-1" dir="ltr">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              বিকল্প {toBengaliNumber(idx + 1)}
                            </span>
                            {isAnswered && (
                              opt.isCorrect ? <Check size={18} className="text-emerald-600" /> : <X size={18} className="text-rose-600" />
                            )}
                          </div>
                          <span className="font-arabic font-bold text-2xl sm:text-3xl block leading-relaxed" dir="rtl">
                            {opt.text}
                          </span>
                          {isAnswered && opt.explanation && (
                            <span className="text-xs block mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 opacity-90 text-left font-sans">
                              💡 <MixedText text={opt.explanation} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: DIALOGUE LISTEN & ANSWER */}
              {activeStep.type === 'dialogue_listen' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                        <MessageSquare size={13} />
                        <span>{activeStep.speaker}</span>
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => playArabicAudio(activeStep.questionArabic)}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 text-teal-600 shadow-xs hover:bg-teal-50 cursor-pointer"
                        title="প্রশ্নটি শুনুন"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <StepPicture step={activeStep} />
                    <div className="text-right pt-2">
                      <span className="font-arabic font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white block leading-relaxed select-text">
                        {activeStep.questionArabic}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                        "{activeStep.questionBangla}"
                      </span>
                    </div>
                  </div>

                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    সঠিক আরবি উত্তরটি নির্বাচন করুন:
                  </label>

                  <div className="space-y-2.5">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-400';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`w-full p-4 rounded-2xl border-2 text-right transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="font-arabic font-bold text-xl block leading-snug">{opt.text}</span>
                          {(!activeStep.picture || isAnswered) && (
                            <span className="text-xs opacity-80 block mt-0.5">{opt.bangla}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP: DIALOGUE READ (পূর্ণ কথোপকথন পড়া ও শোনা) */}
              {activeStep.type === 'dialogue_read' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200">
                      <MessageSquare size={13} />
                      <span>{activeStep.title || 'কথোপকথন শোনো ও বোঝো'}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">প্রতিটি বাক্যে চাপ দিয়ে উচ্চারণ শুনুন</p>
                  </div>
                  <div className="space-y-2.5">
                    {(activeStep.lines || []).map((line, idx) => {
                      const isRight = idx % 2 === 1;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => playArabicAudio(line.arabic)}
                          className={`w-full flex ${isRight ? 'justify-start' : 'justify-end'} cursor-pointer`}
                        >
                          <div className={`max-w-[88%] p-3.5 rounded-2xl border text-right shadow-xs transition-all hover:scale-[1.01] ${
                            isRight
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 rounded-tl-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-tr-sm'
                          }`}>
                            <div className="flex items-center justify-between gap-3 mb-1" dir="ltr">
                              <span className="text-[11px] font-extrabold text-teal-700 dark:text-teal-300">{line.speaker}</span>
                              <Volume2 size={14} className="text-teal-600 shrink-0" />
                            </div>
                            <span className="font-arabic font-bold text-xl sm:text-2xl text-slate-900 dark:text-white block leading-relaxed" dir="rtl">
                              {line.arabic}
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-300 block mt-1 text-left">{line.bangla}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP: ROLEPLAY CHAT */}
              {activeStep.type === 'roleplay_chat' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Teacher Chat Bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <User size={20} />
                    </div>
                    <div className="flex-1 p-4 rounded-3xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-teal-700 dark:text-teal-400">
                          {activeStep.teacherName || 'মুয়াল্লিম (শিক্ষক)'}
                        </span>
                        <button
                          type="button"
                          onClick={() => playArabicAudio(activeStep.questionArabic)}
                          className="p-1 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 cursor-pointer"
                          title="প্রশ্ন শুনুন"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <p className="font-arabic font-bold text-2xl text-slate-900 dark:text-white text-right" dir="rtl">
                        {activeStep.questionArabic}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        "{activeStep.questionBangla}"
                      </p>
                    </div>
                  </div>

                  {/* Learner Reply Bubble Options */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-400">
                      <span>আপনার উত্তর বেছে নিন:</span>
                      <Send size={12} />
                    </div>
                    <div className="space-y-2.5">
                      {activeStep.options?.map((opt, idx) => {
                        const isSelected = selectedOption === opt;
                        let bubbleStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:shadow-md';
                        if (isAnswered) {
                          if (opt.isCorrect) {
                            bubbleStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-101';
                          } else if (isSelected && !opt.isCorrect) {
                            bubbleStyle = 'bg-rose-500 text-white border-rose-600';
                          } else {
                            bubbleStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                          }
                        }

                        return (
                          <div key={idx} className="flex justify-end">
                            <button
                              type="button"
                              disabled={isAnswered}
                              onClick={() => handleSelectMCQ(opt)}
                              className={`w-full sm:max-w-md p-4 rounded-3xl rounded-tr-sm border-2 text-right transition-all cursor-pointer ${bubbleStyle}`}
                            >
                              <span className="font-arabic font-bold text-xl block leading-snug" dir="rtl">
                                {opt.text}
                              </span>
                              {opt.bangla && (
                                <span className={`text-xs block mt-0.5 font-sans ${isAnswered && (opt.isCorrect || isSelected) ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                                  "{opt.bangla}"
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: AUTHENTIC QUIZ CHALLENGE */}
              {activeStep.type === 'quiz_challenge' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-2">
                      {activeStep.title}
                    </span>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-relaxed">
                      <MixedText text={activeStep.question} />
                    </h4>
                    {activeStep.questionBn && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {activeStep.questionBn}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 border-b-4 hover:border-emerald-400 active:border-b-2 shadow-xs';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 border-b-4 shadow-md animate-success-pop';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600 border-b-4 animate-shake-soft';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all cursor-pointer btn-press-3d ${btnStyle}`}
                        >
                          <span className={/[؀-ۿ]/.test(opt.text) ? 'font-arabic text-xl sm:text-2xl block text-right' : ''}>
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && activeStep.explanation && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
                      💡 <strong>ব্যাখ্যা:</strong> <MixedText text={activeStep.explanation} />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: AUTHENTIC TAMRIN CHALLENGE */}
              {activeStep.type === 'tamrin_challenge' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-5 rounded-3xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                        <PenTool size={13} />
                        <span>{activeStep.title || 'আত-তামরীনুল কিতাবী অনুশীলন'}</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {activeStep.instruction}
                    </p>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-teal-900/50 shadow-xs">
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block font-bengali">
                        {activeStep.targetBangla}
                      </span>
                    </div>

                    {activeStep.hint && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60">
                        💡 <strong>ইঙ্গিত:</strong> {activeStep.hint}
                      </p>
                    )}
                  </div>

                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    সঠিক আরবি অনুবাদ নির্বাচন করুন:
                  </label>

                  <div className="space-y-2.5">
                    {activeStep.options?.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:border-teal-400';
                      if (isAnswered) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-teal-600 text-white border-teal-700 shadow-md';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600';
                        } else {
                          btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectMCQ(opt)}
                          className={`w-full p-4 rounded-2xl border-2 text-right transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="font-arabic font-bold text-xl block leading-snug">{opt.text}</span>
                          {opt.bangla && <span className="text-xs opacity-80 block mt-0.5">{opt.bangla}</span>}
                        </button>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
          ) : (
            completionInfo && (completionInfo.isDarsComplete ? (
              <DarsCompleteScreen
                lessonTitle={lesson.titleBn || lesson.title}
                stageCount={completionInfo.stageCount}
                totalXp={completionInfo.totalXp}
                avgAccuracy={completionInfo.avgAccuracy}
                totalTimeSec={completionInfo.totalTimeSec}
                bonuses={completionInfo.bonuses}
                qaida={lessonFirstQaida}
                onOpenQaida={(q) => setActiveQaidaModal(q)}
                nextLessonTitle={completionInfo.nextLesson?.titleBn || completionInfo.nextLesson?.title}
                onNextLesson={() => onStartNextLesson && completionInfo.nextLesson && onStartNextLesson(completionInfo.nextLesson)}
                onBackToMap={onClose}
              />
            ) : (
              <StageCompleteCard
                stageTitle={currentSubUnitInfo?.titleBn || lesson.titleBn || lesson.title}
                badge={currentSubUnitInfo?.badge}
                xp={completionInfo.xp}
                accuracy={completionInfo.accuracy}
                timeSec={completionInfo.timeSec}
                bonuses={completionInfo.bonuses}
                qaida={currentStageQaida}
                onOpenQaida={(q) => setActiveQaidaModal(q)}
                onNext={completionInfo.nextStageId && onStartNextStage ? () => onStartNextStage(lesson, completionInfo.nextStageId) : null}
                onBackToMap={onClose}
              />
            ))
          )}

        </div>

          {/* Bottom Action / Feedback Stripe */}
          {!isFinished && (
            <div className="shrink-0 px-4 sm:px-6 pt-3 pb-4 sm:pb-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              {/* If sentence builder is not answered yet, show Check button */}
              {activeStep.type === 'sentence_builder' && !isAnswered ? (
                <button
                  type="button"
                  disabled={selectedBubbles.length === 0}
                  onClick={handleCheckSentence}
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-md ${
                    selectedBubbles.length === 0
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                  }`}
                >
                  উত্তর যাচাই করুন
                </button>
              ) : isAnswered ? (
                /* Feedback banner with Continue button */
                <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 animate-fade-in ${
                  isCorrect 
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100 border border-emerald-300' 
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100 border border-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle size={24} className="text-rose-600 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm block">
                          {isCorrect ? 'অসাধারণ! সঠিক উত্তর!' : 'ভুল হয়েছে, তবে চিন্তা নেই!'}
                        </span>
                        {isCorrect && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-xs animate-float-up">
                            +১০ XP
                          </span>
                        )}
                        {isCorrect && streakCombo >= 3 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-white animate-float-up">
                            🔥 {streakCombo} কম্বো!
                          </span>
                        )}
                      </div>
                      {!isCorrect && (
                        <span className="text-xs opacity-90 block">
                          প্রশ্নটি পাঠের শেষে আবার আসবে যাতে আপনি শিখে নিতে পারেন।
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    চালিয়ে যান →
                  </button>
                </div>
              ) : (activeStep.type === 'intro' || activeStep.type === 'grammar_card' || activeStep.type === 'dialogue_read') ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  {activeStep.type === 'grammar_card'
                    ? 'বুঝেছি, পরবর্তী ধাপে চলুন →'
                    : activeStep.type === 'dialogue_read'
                      ? 'পড়েছি, পরবর্তী ধাপে চলুন →'
                      : (activeStep.word?.arabic || '').trim().includes(' ') ? 'পরবর্তী ধাপে যান →' : 'পরবর্তী শব্দে যান →'}
                </button>
              ) : null}
            </div>
          )}
      </div>

    
      {/* Report & Feedback Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        context={{
          source: 'dars',
          lessonId: lesson?.id,
          lessonTitle: lesson?.title,
          stepType: activeStep?.type,
          arabic: activeStep?.word?.arabic || activeStep?.targetArabic || activeStep?.questionArabic || (activeStep?.targetTokens ? activeStep.targetTokens.join(' ') : null),
          bangla: activeStep?.word?.bangla || activeStep?.word?.bengali || activeStep?.targetBangla || activeStep?.questionBangla || activeStep?.question
        }}
      />

      {/* ক্বায়েদা পর্যালোচনা মোডাল */}
      {activeQaidaModal && (
        <QaidaCard
          qaida={activeQaidaModal}
          onClose={() => setActiveQaidaModal(null)}
        />
      )}
    </div>
  );
}