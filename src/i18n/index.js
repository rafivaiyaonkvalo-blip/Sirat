// সাইটের ভাষা (বাংলা | ইংরেজি): ইংরেজিতে DOM-এর বাংলা লেখা শব্দকোষ (./en.js) দিয়ে বদলে দেয়।
// translate="no" চিহ্নিত অংশ (দারসের মূল লেখা, প্রশ্ন-উত্তর, ব্যবহারকারীর নাম/নোট) অপরিবর্তিত থাকে।
import { useEffect, useState } from 'react';
import { DARS_TITLES, EXACT as EXACT_SRC, FRAGMENTS as FRAGMENTS_SRC, patterns } from './en';
import { EXACT_MORE } from './en_more';

const KEY = 'sirat_lang';
const BN = /[\u0964\u0965\u0980-\u09FF]/;
const BN_LETTER = /[\u0980-\u09E5\u09F0-\u09FF]/;
const DIGITS = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
const normDigits = (s) => s.replace(/[০-৯]/g, (d) => DIGITS[d]);
const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];

let lang = 'bn';
try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'bn'; } catch { /* ignore */ }

// "য়" ইত্যাদির ইউনিকোড রূপ (U+09DF বনাম U+09AF+U+09BC) মেলাতে সব কিছু NFC-তে
const nfc = (s) => s.normalize('NFC');
const mapKeys = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [nfc(k), v]));
const EXACT = { ...mapKeys(EXACT_SRC), ...mapKeys(EXACT_MORE) };
const TITLES = mapKeys(DARS_TITLES);
const frags = FRAGMENTS_SRC.map(([k, v]) => [nfc(k), v]).sort((a, b) => b[0].length - a[0].length);
const dt = (t) => TITLES[nfc(normDigits(t.trim()))] ?? t;
const PATS = patterns(dt).map(([re, fn]) => [new RegExp(nfc(re.source), re.flags), fn]);

// মাঝের অংশ অনুবাদ (n: NFC ও ল্যাটিন-সংখ্যা); না মিললে null
function inner(n) {
  if (EXACT[n] !== undefined) return EXACT[n];
  if (TITLES[n] !== undefined) return TITLES[n];
  for (const [re, fn] of PATS) {
    const mm = n.match(re);
    if (mm) return fn(...mm);
  }
  if (!BN_LETTER.test(n)) return n; // শুধু বাংলা সংখ্যা
  if (n.length <= 160) {
    let out = n;
    let changed = false;
    for (const [k, v] of frags) {
      if (out.includes(k)) { out = out.split(k).join(v); changed = true; }
    }
    if (changed && !BN_LETTER.test(out)) return out.replace(/ {2,}/g, ' ');
  }
  return null;
}

// একটি লেখা ইংরেজিতে; না মিললে মূল লেখাই ফেরত
export function translate(text) {
  if (!text || !BN.test(text)) return text;
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const [, lead, core, trail] = m;
  if (!core) return text;
  const n = nfc(normDigits(core));
  let r = inner(n);
  if (r !== null) return lead + r + trail;
  // আগে/পরের চিহ্ন (বুলেট, ইমোজি, তীর, বন্ধনী) সরিয়ে আবার চেষ্টা
  const sm = n.match(/^([^\u0964\u0965\u0980-\u09FFA-Za-z0-9]*)([\s\S]*?)([^\u0964\u0965\u0980-\u09FFA-Za-z0-9]*)$/);
  if (sm && sm[2] && (sm[1] || sm[3])) {
    r = inner(sm[2]);
    if (r !== null) return lead + sm[1] + r + sm[3] + trail;
  }
  return text;
}

export const getLang = () => lang;
export const t = (s) => (lang === 'en' ? translate(s) : s);

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
    if (lang === 'en') {
      if (document.title && BN.test(document.title)) { window.__bnTitle = document.title; document.title = translate(document.title); }
    } else if (window.__bnTitle) { document.title = window.__bnTitle; }
  } catch { /* ignore */ }
};

export function setLang(next) {
  lang = next === 'en' ? 'en' : 'bn';
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  try { document.documentElement.lang = lang; } catch { /* ignore */ }
  if (lang === 'en') startDom(); else stopDom();
  applyTitle();
  try { window.dispatchEvent(new CustomEvent('sirat_lang_changed', { detail: lang })); } catch { /* ignore */ }
}

export const toggleLang = () => setLang(lang === 'en' ? 'bn' : 'en');

// অ্যাপ শুরুতে একবার
export function initI18n() {
  try { document.documentElement.lang = lang; } catch { /* ignore */ }
  if (lang === 'en') {
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
