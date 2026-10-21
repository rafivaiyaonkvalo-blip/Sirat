const fs = require('fs');

// 1. Load functions from files
function getFunctionFromCode(code) {
  const fnCode = code.match(/function prepareArabicWithoutWaqf[\s\S]*?\n\}/)[0];
  return new Function('return (' + fnCode + ')')();
}

const audioCode = fs.readFileSync('./src/utils/audio.js', 'utf8');
const apiCode = fs.readFileSync('./api/tts.js', 'utf8');
const viteCode = fs.readFileSync('./vite.config.js', 'utf8');

const fnAudio = getFunctionFromCode(audioCode);
const fnApi = getFunctionFromCode(apiCode);
const fnVite = getFunctionFromCode(viteCode);

const testCases = [
  ['كِتَابٌ', 'Single word with Dammatan'],
  ['سَاعَةٌ', 'Taa Marbutah + Dammatan'],
  ['مَدْرَسَةً', 'Taa Marbutah + Fathatan'],
  ['حَقِيبَةٍ', 'Taa Marbutah + Kasratan'],
  ['كِتَابًا', 'Fathatan + Alif'],
  ['كِتَابٍ', 'Kasratan'],
  ['هٰذَا كِتَابٌ', 'Demonstrative + Dammatan'],
  ['هٰذِهِ سَاعَةٌ', 'Demonstrative + Taa Marbutah'],
  ['ذٰلِكَ قَلَمٌ', 'Demonstrative + Dammatan'],
  ['تِلْكَ مَدْرَسَةٌ', 'Demonstrative + Taa Marbutah'],
  ['البَابُ الأَوَّلُ', 'Definite noun with single Damma'],
  ['فِي الْمَسْجِدِ', 'Jar + Majroor with single Kasra'],
  ['عَلَى الْمَكْتَبِ', 'Jar + Majroor with single Kasra'],
  ['فِي يَدِكِ', 'Single Kasra at end'],
  ['مَا هٰذَا؟ - هٰذَا كِتَابٌ ، وَذٰلِكَ قَلَمٌ.', 'Dialogue with punctuation'],
  ['أَهٰذَا مَسْجِدٌ أَمْ بَيْتٌ؟', 'Question with punctuation'],
  ['كُرْسِيٌّ', 'Shaddah + Tanween'],
  ['قَوِيٌّ', 'Shaddah + Tanween'],
  ['جَدِيدَةٌ.', 'Word ending in period'],
  ['تِلْكَ', 'Single word ending in Fatha'],
  ['ذٰلِكَ', 'Single word ending in Fatha'],
  ['أَنْتَ', 'Pronoun ending in Fatha'],
  ['أَنْتِ', 'Pronoun ending in Kasra'],
  ['هُوَ', 'Pronoun ending in Fatha'],
  ['هِيَ', 'Pronoun ending in Fatha'],
  ['نَحْنُ', 'Pronoun ending in Damma'],
  ['مِنْهُ', 'Preposition + pronoun ending in Damma'],
  ['عَلَيْهِ', 'Preposition + pronoun ending in Kasra'],
  ['كِتَابٌ۔', 'Arabic/Urdu full stop'],
  ['الْبَابُ۔', 'Definite noun ending in Arabic full stop'],
  ['\u200Eكِتَابٌ\u200F', 'Word with bidi markers'],
  ['بَلَدٌ (বহুবচন: بِلَادٌ)', 'Word with Bengali annotation'],
  ['حَمَامَةٌ (বহুবচন: حَمَامٌ)', 'Taa Marbutah with Bengali annotation'],
  ['بِمَ (بِمَاذَا এর সংক্ষেপ)', 'Particle with Bengali annotation']
];

console.log('--- COMPREHENSIVE WAQF TRANSFORMATION AUDIT ---');
let issuesCount = 0;
for (const [input, desc] of testCases) {
  const resAudio = fnAudio(input);
  const resApi = fnApi(input);
  const resVite = fnVite(input);

  const match = resAudio === resApi && resApi === resVite;
  if (!match) {
    console.log(`MISMATCH for [${input}] (${desc}):`);
    console.log(`  audio.js:    "${resAudio}"`);
    console.log(`  api/tts.js:  "${resApi}"`);
    console.log(`  vite.config: "${resVite}"`);
    issuesCount++;
  } else {
    console.log(`OK: [${input}] => "${resAudio}"`);
  }
}
console.log(`\nTotal mismatches: ${issuesCount}`);
