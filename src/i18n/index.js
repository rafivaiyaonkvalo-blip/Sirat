// সাইটের ভাষা (বাংলা | ইংরেজি | আরবি): বাংলা ছাড়া অন্য ভাষায় DOM-এর বাংলা লেখা শব্দকোষ (./en.js, ./ar.js) দিয়ে বদলে দেয়।
// translate="no" চিহ্নিত অংশ (দারসের মূল লেখা, প্রশ্ন-উত্তর, ব্যবহারকারীর নাম/নোট) অপরিবর্তিত থাকে।
// আরবিতে পাতা ডান-থেকে-বাঁয়ে (dir="rtl") হয়; আরবিতে না মিললে ইংরেজি অনুবাদ কাজ করে।
import { useEffect, useState } from 'react';
import { DARS_TITLES, EXACT as EXACT_SRC, FRAGMENTS as FRAGMENTS_SRC, patterns } from './en';
import { EXACT_MORE } from './en_more';
import { AR_EXACT, AR_FRAGMENTS, AR_TITLES, arPatterns } from './ar';

const KEY = 'sirat_lang';
export const LANGS = ['bn', 'en', 'ar'];
const BN = /[।॥ঀ-৿]/;
const BN_LETTER = /[ঀ-৥ৰ-৿]/;
const DIGITS = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
const normDigits = (s) => s.replace(/[০-৯]/g, (d) => DIGITS[d]);
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArDigits = (s) => s.replace(/[0-9]/g, (d) => AR_DIGITS[d]);
const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];

let lang = 'bn';
try { const v = localStorage.getItem(KEY); lang = LANGS.includes(v) ? v : 'bn'; } catch { /* ignore */ }

// "য়" ইত্যাদির ইউনিকোড রূপ (U+09DF বনাম U+09AF+U+09BC) মেলাতে সব কিছু NFC-তে
const nfc = (s) => s.normalize('NFC');
const mapKeys = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [nfc(k), v]));

const makePack = (exact, titles, fragments, pats) => {
  const TITLES = mapKeys(titles);
  const dt = (t) => TITLES[nfc(normDigits(t.trim()))] ?? t;
  return {
    EXACT: mapKeys(exact),
    TITLES,
    frags: fragments.map(([k, v]) => [nfc(k), v]).sort((a, b) => b[0].length - a[0].length),
    PATS: pats(dt).map(([re, fn]) => [new RegExp(nfc(re.source), re.flags), fn]),
  };
};
const PACKS = {
  en: makePack({ ...EXACT_SRC, ...EXACT_MORE }, DARS_TITLES, FRAGMENTS_SRC, patterns),
  ar: makePack(AR_EXACT, AR_TITLES, AR_FRAGMENTS, arPatterns),
};

// মাঝের অংশ অনুবাদ (n: NFC ও ল্যাটিন-সংখ্যা); না মিললে null
function inner(n, pack) {
  if (pack.EXACT[n] !== undefined) return pack.EXACT[n];
  if (pack.TITLES[n] !== undefined) return pack.TITLES[n];
  for (const [re, fn] of pack.PATS) {
    const mm = n.match(re);
    if (mm) return fn(...mm);
  }
  if (!BN_LETTER.test(n)) return n; // শুধু বাংলা সংখ্যা
  if (n.length <= 160) {
    let out = n;
    let changed = false;
    for (const [k, v] of pack.frags) {
      if (out.includes(k)) { out = out.split(k).join(v); changed = true; }
    }
    if (changed && !BN_LETTER.test(out)) return out.replace(/ {2,}/g, ' ');
  }
  return null;
}

// আরবিতে না মিললে ইংরেজি
const run = (n) => {
  let r = inner(n, PACKS[lang]);
  if (r === null && lang === 'ar') r = inner(n, PACKS.en);
  return r;
};

const finish = (s) => (lang === 'ar' ? toArDigits(s) : s);

// একটি লেখা বর্তমান ভাষায়; না মিললে মূল লেখাই ফেরত
export function translate(text) {
  if (lang === 'bn' || !text || !BN.test(text)) return text;
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const [, lead, core, trail] = m;
  if (!core) return text;
  const n = nfc(normDigits(core));
  let r = run(n);
  if (r !== null) return lead + finish(r) + trail;
  // আগে/পরের চিহ্ন (বুলেট, ইমোজি, তীর, বন্ধনী) সরিয়ে আবার চেষ্টা
  const sm = n.match(/^([^।॥ঀ-৿A-Za-z0-9]*)([\s\S]*?)([^।॥ঀ-৿A-Za-z0-9]*)$/);
  if (sm && sm[2] && (sm[1] || sm[3])) {
    r = run(sm[2]);
    if (r !== null) return lead + sm[1] + finish(r) + sm[3] + trail;
  }
  return text;
}

export const getLang = () => lang;
export const t = (s) => translate(s);

// বাটনে দেখানোর "পরের ভাষা" (বাংলা → ইংরেজি → আরবি → বাংলা)
const NEXT = { bn: 'en', en: 'ar', ar: 'bn' };
const LABELS = { bn: { short: 'বাং', long: 'বাংলা' }, en: { short: 'ENG', long: 'English' }, ar: { short: 'عربي', long: 'العربية' } };
export const nextLang = (l = lang) => NEXT[l] || 'en';
export const langLabel = (l) => LABELS[l] || LABELS.en;

// ---- DOM অনুবাদ ----
let observer = null;

const skipped = (node, forAttr = false) => {
  for (let e = node.nodeType === 1 ? node : node.parentElement; e; e = e.parentElement) {
    const tag = e.tagName;
    if (!forAttr && (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'CODE')) return true;
    const tr = e.getAttribute && e.getAttribute('translate');
    if (tr === 'no') return true;
    if (tr === 'yes') return false;
  }
  return false;
};

const doText = (node) => {
  const cur = node.nodeValue;
  if (cur === node.__en || !cur || !BN.test(cur) || skipped(node)) return;
  const tr = translate(cur);
  if (tr !== cur) { node.__bn = cur; node.__en = tr; node.nodeValue = tr; }
};

const doAttr = (el, name) => {
  const cur = el.getAttribute(name);
  if (!cur || !BN.test(cur) || skipped(el, true)) return;
  const store = el.__enAttr || (el.__enAttr = {});
  if (cur === store[name]?.en) return;
  const tr = translate(cur);
  if (tr !== cur) { store[name] = { bn: cur, en: tr }; el.setAttribute(name, tr); }
};

const doTree = (root) => {
  if (root.nodeType === 3) { doText(root); return; }
  if (root.nodeType !== 1) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = w.nextNode();
  while (n) { doText(n); n = w.nextNode(); }
  const els = root.matches?.('[title],[placeholder],[aria-label],[alt]') ? [root] : [];
  root.querySelectorAll('[title],[placeholder],[aria-label],[alt]').forEach((e) => els.push(e));
  els.forEach((e) => ATTRS.forEach((a) => doAttr(e, a)));
};

const undoTree = () => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n = w.nextNode();
  while (n) {
    if (n.__bn !== undefined && n.nodeValue === n.__en) n.nodeValue = n.__bn;
    delete n.__bn;
    delete n.__en;
    n = w.nextNode();
  }
  document.querySelectorAll('[title],[placeholder],[aria-label],[alt]').forEach((e) => {
    const store = e.__enAttr;
    if (!store) return;
    Object.entries(store).forEach(([name, v]) => { if (e.getAttribute(name) === v.en) e.setAttribute(name, v.bn); });
    delete e.__enAttr;
  });
};

const startDom = () => {
  if (observer || typeof document === 'undefined' || !document.body) return;
  doTree(document.body);
  observer = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'characterData') doText(m.target);
      else if (m.type === 'attributes') doAttr(m.target, m.attributeName);
      else m.addedNodes.forEach(doTree);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
};

const stopDom = () => {
  if (observer) { observer.disconnect(); observer = null; }
  undoTree();
};

const applyTitle = () => {
  try {
    if (lang !== 'bn') {
      if (window.__bnTitle === undefined && document.title && BN.test(document.title)) window.__bnTitle = document.title;
      if (window.__bnTitle) document.title = translate(window.__bnTitle);
    } else if (window.__bnTitle) { document.title = window.__bnTitle; }
  } catch { /* ignore */ }
};

const applyDir = () => {
  try {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  } catch { /* ignore */ }
};

export function setLang(next) {
  lang = LANGS.includes(next) ? next : 'bn';
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  applyDir();
  stopDom(); // মূল বাংলায় ফিরিয়ে
  if (lang !== 'bn') startDom();
  applyTitle();
  try { window.dispatchEvent(new CustomEvent('sirat_lang_changed', { detail: lang })); } catch { /* ignore */ }
}

export const toggleLang = () => setLang(nextLang());

// অ্যাপ শুরুতে একবার
export function initI18n() {
  applyDir();
  if (lang !== 'bn') {
    startDom();
    applyTitle();
  }
}

export function useLang() {
  const [l, setL] = useState(lang);
  useEffect(() => {
    const on = (e) => setL(e.detail);
    window.addEventListener('sirat_lang_changed', on);
    return () => window.removeEventListener('sirat_lang_changed', on);
  }, []);
  return l;
}
