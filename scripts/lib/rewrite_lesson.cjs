// বই থেকে লেখা দারস-মডিউল নতুন করে বসানোর হেল্পার (মডিউলের হেল্পার ফাংশনগুলো অক্ষুণ্ণ থাকে)।
// ব্যবহার: rewrite('scripts/book_lessons/vol1-ch3-l2.cjs', { W, SENT, stages, qaida, tamrin, quiz, pages })
// প্রতিটি ফিল্ড হলো JS সোর্স-টেক্সট (স্ট্রিং)।
const fs = require('fs');

module.exports = function rewrite(file, spec) {
  let s = fs.readFileSync(file, 'utf8');
  const cut = (from, to, repl) => {
    const a = s.indexOf(from);
    const b = s.indexOf(to, a);
    if (a < 0 || b < 0) throw new Error(`${file}: cannot find "${from}" … "${to}"`);
    s = s.slice(0, a) + repl + s.slice(b);
  };
  cut('const W = {', 'const T = (arabic', `const W = {\n${spec.W}\n};\n\n`);
  cut('const SENT = {', 'const intro = (item, title)', `const SENT = {\n${spec.SENT}\n};\n\n`);
  cut('const bookStages = [', 'const qaida = [', `const bookStages = [\n${spec.stages}\n];\n\n`);
  cut('const qaida = [', 'const vocabulary', `const qaida = ${spec.qaida};\n\n`);
  cut('const vocabulary', 'const sentences = Object.values(SENT);', `const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));\n`);
  cut('const dialogues = [', 'const quizLegacy = [', `const dialogues = [];\nconst tamrinKitabi = ${spec.tamrin};\n`);
  s = s.replace(/const quizLegacy = \[[\s\S]*?\n\];/, `const quizLegacy = ${spec.quiz};`);
  s = s.replace(/pages: 'পৃষ্ঠা [^']*'/, `pages: '${spec.pages}'`);
  fs.writeFileSync(file, s);
  console.log('rewritten', file);
};
