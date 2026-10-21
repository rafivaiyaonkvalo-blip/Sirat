// ছবি ও শব্দের মিল যাচাই: শুধু src/utils/pictureMap.js-এর যাচাইকৃত তালিকা অনুযায়ী মিললে ছবি থাকে,
// না মিললে ছবি বাদ যায় (যেমন "মাছ"-এ ঘড়ির ছবি, "বন্দুক"-এ চাবির ছবি)।
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'utils', 'pictureMap.js'), 'utf8');
const MAP = {};
for (const m of src.matchAll(/'([\u0600-\u06FF]+)'\s*:\s*'([a-z_]+)'/g)) MAP[m[1]] = m[2];

const strip = (t) => String(t || '').replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/[\u06E0-\u06ED]/g, '').trim();
const base = (t) => strip(t).replace(/^ال/, '').replace(/ة$/, 'ة');

// একক শব্দের ছবি বৈধ কি না
const ok = (arabic, picture) => {
  const w = strip(arabic);
  if (!w || /\s/.test(w)) return true; // বাক্য/বাক্যাংশ হলে স্পর্শ করি না
  return MAP[w] === picture || MAP[base(arabic)] === picture;
};

const stats = { removed: 0, droppedSteps: 0 };

function guardItem(o, arabicOf) {
  if (o && o.picture && !ok(arabicOf(o), o.picture)) { delete o.picture; stats.removed++; }
}

module.exports = function guardPictures(fields) {
  (fields.vocabulary || []).forEach(v => guardItem(v, x => x.arabic));
  (fields.bookStages || []).forEach(stage => {
    stage.steps = stage.steps.filter(step => {
      if (step.type === 'picture_choice') {
        const bad = (step.options || []).filter(o => o.picture && !ok(o.text, o.picture));
        if (bad.length) {
          const keep = step.options.filter(o => !bad.includes(o));
          if (!keep.some(o => o.isCorrect) || keep.length < 2) { stats.droppedSteps++; return false; }
          step.options = keep;
        }
        return true;
      }
      if (step.type === 'intro' && step.word) guardItem(step, s => s.word.arabic);
      return true;
    });
  });
  return stats;
};
module.exports.stats = stats;
