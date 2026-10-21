import { shuffle } from './shuffle';

/**
 * ULS Arabic — Spelling & Imla' Utilities
 * Functions for tokenizing Arabic words, managing Tashkeel, identifying confusing letter pairs,
 * and generating dynamic spelling exercises.
 */

// Regular expressions for Arabic letters and combining diacritics
export const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/g;
export const ARABIC_BASE_LETTERS_REGEX = /[\u0621-\u064A\u0671-\u06D3]/;

/**
 * Strips all vowel diacritics/tashkeel from an Arabic string
 */
export function stripAllHarakat(text = '') {
  if (!text) return '';
  return text
    .replace(/\u0640/g, '') // tatweel
    .replace(ARABIC_DIACRITICS_REGEX, '')
    .trim();
}

/**
 * Normalizes an Arabic string for fair spelling comparison
 */
export function normalizeArabicForComparison(text = '') {
  if (!text) return '';
  return text
    .replace(/\u0640/g, '') // strip tatweel
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '') // strip zero-width chars
    .replace(/\s+/g, ' ')
    // Normalize Shaddah + vowel order: ensure shaddah comes first
    .replace(/([\u064B-\u0650\u0670])\u0651/g, '\u0651$1')
    .trim();
}

/**
 * Splits an Arabic vowelled word into phonological letter units (consonant + attached vowels)
 * Example: 'كِتَابٌ' -> ['كِ', 'تَ', 'ا', 'بٌ']
 */
export function splitArabicWordIntoLetterUnits(word = '') {
  if (!word) return [];
  const clean = normalizeArabicForComparison(word);
  const units = [];
  
  // Match an Arabic base letter followed by 0 or more diacritical marks
  const unitRegex = /([\u0621-\u064A\u0671-\u06D3])([\u064B-\u065F\u0670]*)/g;
  let match;
  while ((match = unitRegex.exec(clean)) !== null) {
    units.push(match[1] + match[2]);
  }

  // Handle trailing Alif Tanween: if word ends with [consonant + ً] followed by bare 'ا', merge into [consonant + ًا]
  if (units.length >= 2) {
    const last = units[units.length - 1];
    const prev = units[units.length - 2];
    if (last === 'ا' && prev.includes('\u064B')) {
      units.splice(units.length - 2, 2, prev + last);
    }
  }

  // Fallback in case regex missed non-standard characters
  if (units.length === 0 && clean.length > 0) {
    return clean.split('').filter(c => c.trim().length > 0);
  }

  return units;
}

/**
 * Confusing letter sets with pedagogical explanations for Bengali speakers
 */
export const CONFUSING_LETTER_SETS = [
  {
    letters: ['ت', 'ط'],
    label: 'তা (ت) বনাম ত্বা (ط)',
    note: 'তা (ت) পাতলা ও নরম হরফ। আর ত্বা (ط) মোটা, ভারী ও ইস্তিলাহর হরফ।',
    swapPairs: { 'ت': 'ط', 'ط': 'ت' }
  },
  {
    letters: ['ك', 'ق'],
    label: 'কাফ (ك) বনাম ক্বাফ (ق)',
    note: 'কাফ (ك) পাতলা হরফ। ক্বাফ (ق) জিহ্বার গোড়া থেকে উচ্চারিত ভারী ও ক্বলক্বলাহর হরফ।',
    swapPairs: { 'ك': 'ق', 'ق': 'ك' }
  },
  {
    letters: ['س', 'ص'],
    label: 'সিন (س) বনাম সাদ (ص)',
    note: 'সিন (س) পাতলা শিসধ্বনিযুক্ত হরফ। সাদ (ص) মোটা, ভারী ও মুখ পূর্ণ করে উচ্চারিত হয়।',
    swapPairs: { 'س': 'ص', 'ص': 'س' }
  },
  {
    letters: ['ث', 'س'],
    label: 'ছা (ث) বনাম সিন (س)',
    note: 'ছা (ث) জিহ্বার আগা সামনের ওপরের দাঁতের পেট থেকে নরমভাবে। সিন (س) দাঁত চেপে শিসধ্বনি।',
    swapPairs: { 'ث': 'س', 'س': 'ث' }
  },
  {
    letters: ['د', 'ض'],
    label: 'দাল (د) বনাম দ্বাদ (ض)',
    note: 'দাল (د) সহজ ও পাতলা। দ্বাদ (ض) জিহ্বার গোড়ার পাশ ওপরের মাড়ির দাঁতে লাগিয়ে দীর্ঘ ও গম্ভীর।',
    swapPairs: { 'د': 'ض', 'ض': 'د' }
  },
  {
    letters: ['ذ', 'ز'],
    label: 'যাল (ذ) বনাম যা (ز)',
    note: 'যাল (ذ) জিহ্বার আগা সামনের দাঁতের কিনারা থেকে নরম। যা (ز) দ্রুত মৌমাছির গুঞ্জনের মতো শিস।',
    swapPairs: { 'ذ': 'ز', 'ز': 'ذ' }
  },
  {
    letters: ['ظ', 'ذ'],
    label: 'জোয়া (ظ) বনাম যাল (ذ)',
    note: 'জোয়া (ظ) মোটা ও জিহ্বার আগা থেকে উঁচু হয়ে। যাল (ذ) পাতলা ও সমতল।',
    swapPairs: { 'ظ': 'ذ', 'ذ': 'ظ' }
  },
  {
    letters: ['ح', 'ه'],
    label: 'হা (ح) বনাম হা (هـ)',
    note: 'হা (ح) হলকের মধ্যভাগ থেকে পরিচ্ছন্ন বাতাস। হা (هـ) হলকের তলদেশ থেকে নির্গত হালকা ধ্বনি।',
    swapPairs: { 'ح': 'ه', 'ه': 'ح' }
  },
  {
    letters: ['ة', 'ت'],
    label: 'গোল তা (ة) বনাম খোলা তা (ت)',
    note: 'একবচন বিশেষ্য ও গুণবাচক শব্দে সাধারণত গোল তা (ة) বসে, যা ওয়াকফে "হা" (হ্)-এ রূপান্তরিত হয়।',
    swapPairs: { 'ة': 'ت', 'ت': 'ة' }
  },
  {
    letters: ['أ', 'ع'],
    label: 'আলিফ/হামযাহ (أ/ء) বনাম আইন (ع)',
    note: 'আইন (ع) হলকের মধ্যভাগ চেপে নির্গত গভীর কণ্ঠধ্বনি। হামযাহ (أ/ء) হলকের শেষ প্রান্তের ছিটকানো শব্দ।',
    swapPairs: { 'أ': 'ع', 'ع': 'أ', 'إ': 'ع', 'ء': 'ع' }
  }
];

/**
 * Checks if a word contains any confusing letters and generates a targeted test
 */
export function generateConfusingLetterChallenge(wordObj) {
  if (!wordObj || !wordObj.arabic) return null;
  const arabic = wordObj.arabic.trim();
  
  // Find matching confusing sets
  for (const set of CONFUSING_LETTER_SETS) {
    for (const [targetChar, replacementChar] of Object.entries(set.swapPairs)) {
      // Grammatical constraint: Ta Marbutah (ة) CAN ONLY occur at the end of an Arabic word
      if (replacementChar === 'ة' && targetChar === 'ت') {
        // Only swap if 'ت' is the final consonant of the word (followed by optional diacritics)
        if (!/ت[\u064B-\u065F]*$/.test(arabic)) continue;
      }

      if (arabic.includes(targetChar)) {
        let misspelledArabic = '';
        if (targetChar === 'ت' && replacementChar === 'ة') {
          misspelledArabic = arabic.replace(/ت([\u064B-\u065F]*)$/, 'ة$1');
        } else if (targetChar === 'ة' && replacementChar === 'ت') {
          misspelledArabic = arabic.replace(/ة([\u064B-\u065F]*)$/, 'ت$1');
        } else {
          misspelledArabic = arabic.replace(targetChar, replacementChar);
        }

        if (misspelledArabic && misspelledArabic !== arabic) {
          const isCorrectFirst = Math.random() > 0.5;
          return {
            type: 'confusing_letters',
            wordObj,
            questionBangla: wordObj.bengali || wordObj.bangla,
            correctArabic: arabic,
            confusingSet: set,
            targetChar,
            replacementChar,
            options: isCorrectFirst
              ? [
                  { text: arabic, isCorrect: true, note: 'শুদ্ধ বানান' },
                  { text: misspelledArabic, isCorrect: false, note: `অশুদ্ধ হরফ (${replacementChar})` }
                ]
              : [
                  { text: misspelledArabic, isCorrect: false, note: `অশুদ্ধ হরফ (${replacementChar})` },
                  { text: arabic, isCorrect: true, note: 'শুদ্ধ বানান' }
                ],
            explanation: set.note
          };
        }
      }
    }
  }
  return null;
}

/**
 * Generates a Tashkeel/Harakat challenge from a vowelled word
 */
export function generateTashkeelChallenge(wordObj, allVocab = []) {
  if (!wordObj || !wordObj.arabic) return null;
  const correct = wordObj.arabic.trim();
  const unvowelled = stripAllHarakat(correct);
  if (!unvowelled || unvowelled.length < 2) return null;

  // ভুল অপশন: শুধু ভেতরের হরফের হরকত বদলে (শেষ হরফের ই'রাব/তানবীন বদলালে অন্য কারকে
  // শুদ্ধ রূপ হয়ে যায়, যেমন مَكْتَبٌ → مَكْتَبٍ, তাই শেষ হরফ অপরিবর্তিত থাকে)
  const SHORT_VOWELS = ['\u064E', '\u064F', '\u0650']; // যবর, পেশ, যের
  const isMark = (c) => /[\u064B-\u0652\u0670]/.test(c);
  const chars = [...correct];
  let lastLetterIdx = -1;
  chars.forEach((c, i) => { if (!isMark(c)) lastLetterIdx = i; });
  // শেষে তানবীনের আলিফ (ًا) বা আলিফ মাকসূরা থাকলে তার আগের হরফও শেষাংশ ধরা হয়
  if ((chars[lastLetterIdx] === 'ا' || chars[lastLetterIdx] === 'ى') && isMark(chars[lastLetterIdx - 1] || '')) {
    for (let i = lastLetterIdx - 1; i >= 0; i--) {
      if (!isMark(chars[i])) { lastLetterIdx = i; break; }
    }
  }

  // মদের হরফের (ا, অথবা হরকতহীন و/ي) আগের হরকত বদলালে অসম্ভব বানান হয় (যেমন سِاعَةٌ), সহজে ধরা পড়ে
  const beforeMadd = (i) => {
    const next = chars[i + 1];
    if (next === 'ا') return true;
    return (next === 'و' || next === 'ي') && !isMark(chars[i + 2] || '');
  };

  const candidates = [];
  chars.forEach((c, i) => {
    if (i >= lastLetterIdx) return;
    if (SHORT_VOWELS.includes(c) && !beforeMadd(i)) {
      SHORT_VOWELS.filter((v) => v !== c).forEach((v) => {
        const next = [...chars];
        next[i] = v;
        candidates.push(next.join(''));
      });
    } else if (c === '\u0651') {
      const next = [...chars];
      next.splice(i, 1);
      candidates.push(next.join(''));
    }
  });

  // শব্দভাণ্ডারে অন্য শব্দ হিসেবে আছে এমন রূপ ভুল অপশন হবে না
  const knownForms = new Set((allVocab || []).map((w) => (w.arabic || '').trim()));
  const filteredDistractors = shuffle(Array.from(new Set(candidates))).filter(
    (d) => d !== correct && d !== unvowelled && stripAllHarakat(d) === unvowelled && !knownForms.has(d)
  );
  if (filteredDistractors.length < 2) return null;

  const uniqueDistractors = Array.from(new Set(filteredDistractors)).slice(0, 3);
  if (uniqueDistractors.length === 0) return null;

  const options = shuffle([
    { text: correct, isCorrect: true, note: 'সঠিক হরকতযুক্ত রূপ' },
    ...uniqueDistractors.map(d => ({ text: d, isCorrect: false, note: 'ভুল স্বরচিহ্ন' }))
  ]);

  return {
    type: 'tashkeel',
    wordObj,
    unvowelled,
    correctArabic: correct,
    questionBangla: wordObj.bengali || wordObj.bangla,
    options
  };
}

/**
 * Standard Arabic Virtual Keyboard layout with full Tashkeel
 */
export const ARABIC_KEYBOARD_DATA = {
  harakat: [
    { char: '\u064E', name: 'যবর', badge: ' َ ' },
    { char: '\u0650', name: 'যের', badge: ' ِ ' },
    { char: '\u064F', name: 'পেশ', badge: ' ُ ' },
    { char: '\u064B', name: 'দুই যবর', badge: ' ً ' },
    { char: '\u064D', name: 'দুই যের', badge: ' ٍ ' },
    { char: '\u064C', name: 'দুই পেশ', badge: ' ٌ ' },
    { char: '\u0651', name: 'তাশদীদ', badge: ' ّ ' },
    { char: '\u0652', name: 'সুকুন', badge: ' ْ ' },
    { char: '\u0670', name: 'খাড়া যবর', badge: ' ٰ ' },
  ],
  row1: ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د', 'ذ'],
  row2: ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  row3: ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ']
};
