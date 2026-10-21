const fs = require('fs');
const lessonsData = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));
const l1 = lessonsData.lessons.find(l => l.id === 'vol1-ch1-l1');

// Updated DuolingoTamrinModal logic:
const rawTamrin = l1.tamrinKitabi;
let list = [];
if (Array.isArray(rawTamrin) && rawTamrin.length > 0) {
  list = rawTamrin.flatMap(t => {
    const rawItems = Array.isArray(t.items) && t.items.length > 0 ? t.items : [t];
    return rawItems.map(item => {
      let ar = item.arabic;
      let bn = item.bangla;
      if (!ar || !bn) {
        const isTextAr = /[\u0600-\u06FF]/.test(item.text || '');
        const isPromptAr = /[\u0600-\u06FF]/.test(item.prompt || '');
        if (isTextAr && !isPromptAr) {
          ar = ar || item.text;
          bn = bn || item.prompt || item.hint || '';
        } else if (!isTextAr && isPromptAr) {
          ar = ar || item.prompt;
          bn = bn || item.text || '';
        } else if (isTextAr && isPromptAr) {
          ar = ar || item.prompt || item.text;
          bn = bn || item.hint || 'আরবি বাক্যটি সম্পূর্ণ করুন';
        } else {
          ar = ar || item.prompt || 'هٰذَا كِتَابٌ';
          bn = bn || item.text || 'ইহা একটি বই';
        }
      }

      const isTaskArToBn = item.mode === 'ar-to-bn' || (item.task && (item.task.includes('বাংলায়') || item.task.includes('অনুবাদ')));
      const mode = isTaskArToBn ? 'ar-to-bn' : (item.mode || 'bn-to-ar');
      const defaultInstruction = mode === 'ar-to-bn' ? 'বাংলায় সঠিক অর্থ নির্বাচন করুন:' : 'সঠিক আরবি বাক্য গঠন করুন:';

      return {
        title: t.title || item.task || t.task || 'আত-তামরীনুল কিতাবী',
        instruction: item.instruction || t.instruction || defaultInstruction,
        mode,
        arabicSentence: ar,
        banglaSentence: bn,
        hint: item.hint || t.hint,
        page: t.page || item.page,
        task: item.task || t.task
      };
    });
  });
}

console.log('DuolingoTamrinModal extracted exercises for L1 (AFTER FIX):');
list.forEach((ex, idx) => {
  console.log(`Ex ${idx}: task="${ex.task}", mode="${ex.mode}"`);
  console.log(`  arabicSentence: "${ex.arabicSentence}" (isArabic? ${/[\u0600-\u06FF]/.test(ex.arabicSentence)})`);
  console.log(`  banglaSentence: "${ex.banglaSentence}" (isArabic? ${/[\u0600-\u06FF]/.test(ex.banglaSentence)})`);
});
