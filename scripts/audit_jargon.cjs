const fs = require('fs');
const path = require('path');
const { getDynamicLessonStages } = require('../src/utils/lessonSubSections.js');

const lessonsPath = path.join(__dirname, '../src/data/lessons.json');
const rawData = fs.readFileSync(lessonsPath, 'utf8');
const data = JSON.parse(rawData);

const lessons = data.lessons || [];
const ch1Lessons = lessons.filter(l => l.chapterId === 'vol1-ch1');

console.log(`Auditing Chapter 1 (${ch1Lessons.length} lessons & dynamic stages) for grammatical jargon...`);

const forbiddenTerms = [
  'মুবতাদা', 'খবর', 'তারকীব', 'তারকিব', 'মারফূ', 'মারফু', 'মানসুব', 'মানসূব', 
  'মাজরুর', 'মাজরূর', 'মুরাক্কাব', 'তাওসীফী', 'তাওসিফি', 'ইদাফী', 'ইদাফি', 
  'সিফাত', 'মাওসুফ', 'মাওসূফ', 'মুদাফ', 'মুজাফ', 'হরফে জর', 'হরফে জার', 'মুশারুন', 
  'ইসমুল ইশারা', 'ইসমে ইশারা', 'যমীর', 'যরফ', 'ব্যাকরণ', 'ব্যাকরণিক', 'কায়েদা', 'ক্বায়েদা',
  'تَرْكِيب', 'تركيب', 'القَاعِدَة', 'قاعدة', 'مُبْتَدَأ', 'مبتدأ', 'خَبَر', 'خبر', 'مَوْصُوف', 'موصوف', 'مُرَكَّب', 'مركب'
];

let totalJargonHits = 0;

function checkObject(obj, pathStr) {
  if (!obj) return;
  if (typeof obj === 'string') {
    forbiddenTerms.forEach(term => {
      if (obj.includes(term)) {
        console.error(`[JARGON] Found "${term}" in ${pathStr}: "${obj.substring(0, 80)}"`);
        totalJargonHits++;
      }
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => checkObject(item, `${pathStr}[${idx}]`));
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => checkObject(obj[key], `${pathStr}.${key}`));
  }
}

// 1. Check Chapter 1 Lessons data
ch1Lessons.forEach((l) => {
  checkObject(l, `Lesson_${l.lessonNumberInChapter}`);
});

// 2. Check Level/Chapter metadata for Chapter 1
if (data.levels) {
  data.levels.forEach((lvl, lvlIdx) => {
    if (lvl.chapters) {
      lvl.chapters.forEach((ch, chIdx) => {
        if (ch.id === 'vol1-ch1') {
          checkObject(ch, `levels[${lvlIdx}].chapters[${chIdx}]`);
        }
      });
    }
  });
}

// 3. Check all dynamic stages of Chapter 1
let totalStages = 0;
ch1Lessons.forEach(l => {
  const stages = getDynamicLessonStages(l);
  totalStages += stages.length;
  stages.forEach(s => {
    checkObject(s, `L${l.lessonNumberInChapter}_stage_${s.id}`);
  });
});

// 4. Check vocabulary.json for Chapter 1
const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');
const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
const ch1Vocab = vocabData.filter(v => v.chapterId === 'vol1-ch1');
ch1Vocab.forEach(v => {
  checkObject(v, `Vocab_${v.id}`);
});

console.log(`Audited ${ch1Lessons.length} lessons, ${totalStages} dynamic stages, and ${ch1Vocab.length} vocabulary items.`);
console.log(`Total jargon hits in Chapter 1: ${totalJargonHits}`);

if (totalJargonHits > 0) {
  console.error(`FAILED: ${totalJargonHits} grammatical jargon hits detected in Chapter 1!`);
  process.exit(1);
} else {
  console.log(`SUCCESS: Chapter 1 is 100% free of grammatical jargon in data and dynamic stages!`);
}
