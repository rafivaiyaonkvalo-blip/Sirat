const fs = require('fs');
const lessonsData = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));

const l1 = lessonsData.lessons.find(l => l.id === 'vol1-ch1-l1');
console.log('Keys of a lesson object:', Object.keys(l1));
console.log('\ngrammarRule structure:', Object.keys(l1.grammarRule));
console.log('\nvocabulary[0] structure:', l1.vocabulary[0]);
console.log('\nsentences[0] structure:', l1.sentences[0]);
console.log('\ndialogues[0] structure:', l1.dialogues[0]);
console.log('\nquiz[0] structure:', l1.quiz[0]);
console.log('\ntamrinKitabi structure:', l1.tamrinKitabi);
