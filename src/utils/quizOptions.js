/**
 * অনুশীলন ও পরীক্ষার বহুনির্বাচনী অপশন বাছাই
 *
 * ভুল অপশন এমন হবে না যা আসলে সঠিক উত্তরও হতে পারে:
 * - একই আরবি শব্দ (হরকত, যতিচিহ্ন বা 'اَلْ' বাদে মিলে যায়), যেমন كِتَابٌ / اَلْكِتَابُ / قَلَمٌ.
 * - একই বাংলা অর্থ, যেমন ঘর = بَيْتٌ / مَنْزِلٌ, "একটি বই" / "বইটি", "তার বই" = كِتَابُهُ / كِتَابُهَا
 */
import { shuffle } from './shuffle';
const HARAKAT = /[ً-ْٰـ]/g;

export const bareArabic = (t) => String(t || '')
  .replace(HARAKAT, '')
  .replace(/[أإآٱ]/g, 'ا')
  .replace(/[.,،؛؟!?:;"'«»()\-—]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const withoutArticle = (t) => bareArabic(t).split(' ').map((w) => w.replace(/^[وفبك]?ال/, '')).join(' ');

// বাংলা অর্থের মূল অংশগুলো: কমা/স্ল্যাশে আলাদা, বন্ধনী, "একটি", "-টি" ও যতিচিহ্ন বাদে
export const meaningKeys = (bn) => String(bn || '')
  .replace(/\([^)]*\)/g, ' ')
  .split(/[,،/;]/)
  .map((k) => k
    .replace(/[।?!.'"‘’“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(একটি|একজন|একখানা|একটা)\s+/, '')
    .replace(/(টি|টা|খানা|গুলো|গুলি)$/, ''))
  .filter(Boolean);

// দুটি শব্দ/বাক্য একই প্রশ্নে অপশন হলে বিভ্রান্তি হয় কি না
export const optionsConflict = (a, b) => {
  if (!a || !b) return false;
  if (bareArabic(a.arabic) === bareArabic(b.arabic) || withoutArticle(a.arabic) === withoutArticle(b.arabic)) return true;
  const keys = new Set(meaningKeys(a.bengali));
  return meaningKeys(b.bengali).some((k) => keys.has(k));
};

/**
 * target-এর জন্য n-টি ভুল অপশন; pools ক্রমানুসারে (আগে নির্বাচিত পরিসর, পরে বড় শব্দভাণ্ডার) খোঁজা হয়।
 * accept দিয়ে বাড়তি শর্ত (যেমন শব্দের উত্তরে শুধু শব্দ) দেওয়া যায়; taken আগে বাছাই করা অপশন।
 */
export function pickDistractors(target, pools, n = 3, accept = () => true, taken = []) {
  const out = [...taken];
  for (const pool of pools) {
    if (out.length >= n) break;
    // বড় তালিকায় পুরোটা না ঘেঁটে এলোমেলো কিছু অংশ দেখা হয়
    const candidates = pool.length > 400 ? shuffle(pool).slice(0, 400) : shuffle(pool);
    for (const c of candidates) {
      if (out.length >= n) break;
      if (!c || c.id === target.id || !c.arabic || !c.bengali || !accept(c)) continue;
      if (optionsConflict(target, c) || out.some((d) => d.id === c.id || optionsConflict(d, c))) continue;
      out.push(c);
    }
  }
  return out;
}

// পরস্পরের সাথে বিভ্রান্তিকর নয় এমন সর্বোচ্চ n-টি শব্দ (জোড় মেলানোর খেলার জন্য); clash দিয়ে বাড়তি শর্ত
export function pickDistinctItems(list, n, clash = () => false) {
  const out = [];
  for (const c of shuffle(list)) {
    if (out.length >= n) break;
    if (!c?.arabic || !c?.bengali) continue;
    if (out.some((d) => d.id === c.id || optionsConflict(d, c) || clash(d, c))) continue;
    out.push(c);
  }
  return out;
}
