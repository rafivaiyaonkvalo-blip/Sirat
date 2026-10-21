const { getDynamicLessonStages } = require('../src/utils/lessonSubSections.js');
const lessonsData = require('../src/data/lessons.json');

const ch1Lessons = lessonsData.lessons.filter(l => l.chapterId === 'vol1-ch1');

console.log(`Auditing 9 lessons of Chapter 1 stages for grammatical jargon...`);

const forbiddenTerms = [
  'মুবতাদা', 'খবর', 'তারকীব', 'তারকিব', 'মারফূ', 'মারফু', 'মানসুব', 'মানসূব', 
  'মাজরুর', 'মাজরূর', 'মুরাক্কাব', 'তাওসীফী', 'তাওসিফি', 'ইদাফী', 'ইদাফি', 
  'সিফাত', 'মাওসুফ', 'মাওসূফ', 'মুদাফ', 'মুজাফ', 'হরফে জর', 'হরফে জার', 'মুশারুন', 
  'ইসমুল ইশারা', 'ইসমে ইশারা', 'যমীর', 'যরফ', 'ব্যাকরণ', 'ব্যাকরণিক', 'কায়েদা', 'ক্বায়েদা',
  'تَرْكِيب', 'تركيب', 'القَاعِدَة', 'قاعدة', 'مُبْتَدَأ', 'مبتدأ', 'خَبَر', 'خبر', 'مَوْصُوف', 'موصوف', 'مُرَكَّب', 'مركب'
];

let stageJargonCount = 0;
let totalStages = 0;

ch1Lessons.forEach(lesson => {
  const stages = getDynamicLessonStages(lesson);
  totalStages += stages.length;
  console.log(`Lesson ${lesson.lessonNumberInChapter} has ${stages.length} stages: ${stages.map(s => s.id).join(', ')}`);

  stages.forEach(stage => {
    const stageStr = JSON.stringify(stage);
    forbiddenTerms.forEach(term => {
      if (stageStr.includes(term)) {
        console.error(`[STAGE JARGON] L${lesson.lessonNumberInChapter} stage ${stage.id} contains "${term}": ${stage.titleBn} | ${stage.desc} | ${stage.itemCountStr}`);
        stageJargonCount++;
      }
    });
  });
});

console.log(`\n========================================`);
console.log(`Total Chapter 1 stages audited: ${totalStages}`);
console.log(`Total Stage Jargon count: ${stageJargonCount}`);

if (stageJargonCount === 0 && totalStages === 76) {
  console.log('SUCCESS: All 76 stages in Chapter 1 are 100% free of grammatical jargon!');
} else {
  console.error('FAILURE: Grammatical jargon still detected in stages!');
  process.exit(1);
}
