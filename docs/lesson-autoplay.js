/**
 * দারসের পর্ব স্বয়ংক্রিয়ভাবে খেলে পরীক্ষা করার স্ক্রিপ্ট।
 *
 * ব্যবহার:
 *   ১. ডেভ সার্ভার চালু করে অ্যাপ খুলুন (http://localhost:5173)
 *   ২. localStorage ব্যাকআপ নিন (docs/dars-build-guide.md §৯ দেখুন)
 *   ৩. এই পুরো ফাইলটি ব্রাউজারের কনসোলে পেস্ট করুন
 *   ৪. তারপর:
 *        await __openStage('vol1-ch1-l4', 'l4-words-1', 'শব্দার্থ (১/২)')
 *        await __next('vol1-ch1-l4', 'l4-words-2')
 *
 * ফল: { finished: true, steps: N, log: [] } হলে পর্বটি ঠিক আছে।
 * log-এ কিছু থাকলে বা error এলে ডেটা/UI-তে সমস্যা আছে।
 */

const __N = s => (s || '').normalize('NFC').replace(/\s+/g, ' ').trim();

window.__playStage = async function (lessonId, stageId) {
  const t0 = Date.now();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const mod = await import('/src/data/lessons.json?t=' + Date.now());
  const lesson = (mod.default || mod).lessons.find(l => l.id === lessonId);
  const stage = lesson.bookStages.find(s => s.id === stageId);
  if (!stage) return { stageId, error: 'stage not found' };
  const modal = () => document.querySelector('.fixed.inset-0.z-50');
  const buttons = () => [...modal().querySelectorAll('button')];
  const exactBtn = (text) => buttons().find(b => !b.disabled && (
    [...b.querySelectorAll('span')].some(s => __N(s.textContent) === __N(text)) || __N(b.textContent) === __N(text)
  ));
  const log = [];
  let lastKey = '', sameCount = 0;

  while (Date.now() - t0 < 40000) {
    await sleep(280);
    const m = modal();
    if (!m) return { stageId, error: 'modal missing', log };
    const txt = __N(m.textContent);
    if (txt.includes('পর্ব সম্পন্ন হয়েছে') || txt.includes('দারস সম্পন্ন হয়েছে')) {
      return { stageId, finished: true, steps: stage.steps.length, log };
    }
    const counter = [...m.querySelectorAll('span')].map(s => __N(s.textContent)).find(t => /^\d+\/\d+$/.test(t));
    if (!counter) { if (sameCount++ > 15) return { stageId, error: 'no counter', txt: txt.slice(0, 300) }; continue; }
    const [cur, total] = counter.split('/').map(Number);
    if (total !== stage.steps.length) return { stageId, error: `count mismatch ${counter} vs ${stage.steps.length}` };
    const spec = stage.steps[cur - 1];
    if (counter === lastKey) sameCount++; else { sameCount = 0; lastKey = counter; }
    if (sameCount > 12) return { stageId, error: `stuck at ${counter} (${spec?.type})`, log, txt: txt.slice(0, 400) };

    const cont = buttons().find(b => __N(b.textContent).includes('চালিয়ে যান'));
    if (cont) { cont.click(); continue; }
    if (sameCount > 0 && sameCount < 4) continue;

    switch (spec.type) {
      case 'intro':
      case 'grammar_card': {
        const b = buttons().find(b => /পরবর্তী|বুঝেছি/.test(__N(b.textContent)));
        b ? b.click() : log.push('no next btn');
        break;
      }
      case 'mcq':
      case 'quiz_challenge':
      case 'dialogue_listen':
      case 'spot_error':
      case 'fill_blank': {
        const shown = spec.options.filter(o => exactBtn(o.text)).length;
        if (shown !== spec.options.length) log.push(`${cur}: ${shown}/${spec.options.length} options visible`);
        const target = spec.options.find(o => o.isCorrect);
        const b = exactBtn(target.text);
        if (!b) { log.push(`no option btn ${spec.type} ${target.text}`); break; }
        b.click();
        break;
      }
      case 'picture_choice': {
        const target = spec.options.find(o => o.isCorrect);
        const b = buttons().find(b => !b.disabled && b.querySelector(`svg[aria-label="${target.picture}"]`));
        if (!b) { log.push(`no picture btn ${target.picture}`); break; }
        b.click();
        break;
      }
      case 'match_pairs': {
        for (const p of spec.pairs) {
          const a = exactBtn(p.arabic); a && a.click(); await sleep(120);
          const bn = exactBtn(p.bangla); bn && bn.click(); await sleep(160);
          if (!a || !bn) log.push(`match missing ${p.arabic}|${p.bangla}`);
        }
        break;
      }
      case 'sentence_builder': {
        for (const t of spec.targetTokens) {
          const b = buttons().find(b => !b.disabled && __N(b.textContent) === __N(t));
          b ? b.click() : log.push(`no token ${t}`);
          await sleep(120);
        }
        const check = buttons().find(b => __N(b.textContent).includes('উত্তর যাচাই করুন'));
        check && check.click();
        break;
      }
      case 'sort_groups': {
        const shown = [...m.querySelectorAll('span.font-arabic')].map(s => __N(s.textContent));
        const item = spec.items.find(it => shown.includes(__N(it.arabic)));
        if (!item) { log.push('sort item not found'); break; }
        const group = spec.groups.find(g => g.id === item.group);
        const b = buttons().find(b => !b.disabled && [...b.querySelectorAll('span')].some(s => __N(s.textContent) === __N(group.arabic)));
        b ? b.click() : log.push(`no group btn ${group.arabic}`);
        break;
      }
      default:
        log.push(`unhandled ${spec.type}`);
    }
  }
  return { stageId, error: 'time budget', lastKey, log };
};

// ম্যাপ থেকে পর্ব খুলে খেলা (titlePart = ম্যাপের বোতামের টাইটেলের অংশ, সাধারণত পর্বের titleBn)
window.__openStage = async function (lessonId, stageId, titlePart) {
  const open = document.querySelector('.fixed.inset-0.z-50');
  const back = open && [...open.querySelectorAll('button')].find(b => __N(b.textContent).includes('ম্যাপে ফিরুন'));
  if (back) { back.click(); await new Promise(r => setTimeout(r, 800)); }
  const btn = [...document.querySelectorAll('button[title]')].find(b => b.title.includes(titlePart));
  if (!btn) return 'no button for ' + titlePart;
  if (btn.disabled) return 'locked: ' + titlePart;
  btn.click();
  await new Promise(r => setTimeout(r, 1000));
  return await window.__playStage(lessonId, stageId);
};

// পর্ব শেষ হওয়ার পর "পরের পর্ব" চেপে পরেরটা খেলা
window.__next = async function (lessonId, stageId) {
  const m = document.querySelector('.fixed.inset-0.z-50');
  const b = m && [...m.querySelectorAll('button')].find(b => __N(b.textContent).includes('পরের পর্ব'));
  if (!b) return 'no next button';
  b.click();
  await new Promise(r => setTimeout(r, 900));
  return await window.__playStage(lessonId, stageId);
};

'autoplay ready: __openStage(lessonId, stageId, titlePart) / __next(lessonId, stageId)';
