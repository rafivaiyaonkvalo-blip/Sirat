import { tamrinParts, getTamrinWordGroups } from '../data/tamrinKitabiData.js';
import vocabularyData from '../data/vocabulary.json';
import { unifiedVocabulary } from '../data/unifiedVocabulary.js';

const bnNum = (n) => String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const esoCount = (vol) => vocabularyData.filter((w) => w.volumeId === vol).length;
const partOpt = (id, id2) => {
  const p = tamrinParts.find((x) => x.id === id);
  return {
    id: id2,
    label: p ? p.name : 'তামরীন',
    group: '✍️ আত-তামরীনুল কিতাবী',
    badge: p ? bnNum(p.tamrins.length) + 'টি নোড' : ''
  };
};

export const volumeSourceOptions = [
  { id: '1', label: '১ম খণ্ড: প্রাথমিক ভাগ', group: '📖 এসো আরবী শিখি', badge: bnNum(esoCount(1)) + 'টি' },
  { id: '2', label: '২য় খণ্ড: মধ্যম ভাগ', group: '📖 এসো আরবী শিখি', badge: bnNum(esoCount(2)) + 'টি' },
  { id: '3', label: '৩য় খণ্ড: উচ্চ ভাগ', group: '📖 এসো আরবী শিখি', badge: bnNum(esoCount(3)) + 'টি' },
  { id: 'tamrin', label: 'আত-তামরীন: সকল পর্ব', group: '✍️ আত-তামরীনুল কিতাবী', badge: bnNum(tamrinParts.reduce((n, p) => n + p.tamrins.length, 0)) + 'টি নোড' },
  partOpt(1, 'tamrin_p1'),
  partOpt(2, 'tamrin_p2'),
  partOpt(3, 'tamrin_p3'),
  partOpt(4, 'tamrin_app'),
];

// ডেটায় যে ধরনের কোনো উপাদান নেই, তা বাছাই তালিকায় দেখানো হয় না (নাহলে খালি পাতা আসে)
export const unifiedTypeOptions = [
  { id: 'word', label: 'মূল শব্দার্থ', badge: 'শব্দ' },
  { id: 'phrase', label: 'বাক্যাংশ ও পদগুচ্ছ', badge: 'বাক্যাংশ' },
  { id: 'sentence', label: 'পূর্ণ বাক্যমালা', badge: 'বাক্য' },
  { id: 'dialogue', label: 'কথোপকথন ও প্রশ্নোত্তর', badge: 'হাওয়ার' },
  { id: 'tamrin', label: 'আত-তামরীন (সকল)', badge: 'তামরীন' },
  { id: 'tamrin_word', label: 'তামরীন: কিতাবের নতুন শব্দ', badge: 'শব্দ' },
  { id: 'tamrin_trans_bn', label: 'তামরীন: বাংলায় অনুবাদ', badge: '(ক)' },
  { id: 'tamrin_tarkib', label: 'তামরীন: তারকীব ও বিশ্লেষণ', badge: '(খ)' },
  { id: 'tamrin_trans_ar', label: 'তামরীন: আরবিতে রূপান্তর', badge: '(গ)' },
].filter((opt) => unifiedVocabulary.some((w) => w.type === opt.id || w.subType === opt.id));

/**
 * Checks if a vocabulary/tamrin item matches the selected volume/source filter
 */
const ORD = ['', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', '১১তম', '১২তম', '১৩তম', '১৪তম', '১৫তম', '১৬তম', '১৭তম', '১৮তম', '১৯তম', '২০তম'];
const ord = (n) => ORD[n] || (bnNum(n) + 'তম');
const lessonLabel = (les) => {
  const t = (les.title || '').split(':');
  const no = les.lessonNumberInChapter ? ord(les.lessonNumberInChapter) + ' পাঠ' : t[0].trim();
  const rest = (t.length > 1 ? t.slice(1).join(':') : les.title || '').replace(/\s*\(.*\)\s*$/, '').trim();
  return rest && rest !== no ? no + ' — ' + rest.slice(0, 28) : no;
};

export const matchVolumeItem = (w, selectedVolumes) => {
  if (!selectedVolumes || selectedVolumes.length === 0 || selectedVolumes.includes('all')) return true;
  return selectedVolumes.some(v => {
    if (v === '1' || v === 'eso_1') return (!w.bookSource || w.bookSource === 'eso_arbi') && w.volumeId === 1;
    if (v === '2' || v === 'eso_2') return (!w.bookSource || w.bookSource === 'eso_arbi') && w.volumeId === 2;
    if (v === '3' || v === 'eso_3') return (!w.bookSource || w.bookSource === 'eso_arbi') && w.volumeId === 3;
    if (v === 'tamrin') return w.bookSource === 'tamrin';
    if (v === 'tamrin_p1' || v === 'tamrin_1') return w.bookSource === 'tamrin' && (w.partId === 1 || w.partKey === 'part1' || w.volumeId === 1);
    if (v === 'tamrin_p2' || v === 'tamrin_2') return w.bookSource === 'tamrin' && (w.partId === 2 || w.partKey === 'part2' || w.volumeId === 2);
    if (v === 'tamrin_p3' || v === 'tamrin_3') return w.bookSource === 'tamrin' && (w.partId === 3 || w.partKey === 'part3' || w.volumeId === 3);
    if (v === 'tamrin_app') return w.bookSource === 'tamrin' && (w.partId === 4 || w.partKey === 'appendix');
    return String(w.volumeId) === String(v);
  });
};

/**
 * Returns active numeric volume IDs (1, 2, 3) for chapter and lesson filtering
 */
export const getActiveVolumeIds = (selectedVolumes) => {
  if (!selectedVolumes || selectedVolumes.length === 0 || selectedVolumes.includes('all') || selectedVolumes.includes('tamrin')) {
    return [1, 2, 3];
  }
  const ids = new Set();
  selectedVolumes.forEach(v => {
    if (v === '1' || v === 'eso_1' || v === 'tamrin_1' || v === 'tamrin_p1') ids.add(1);
    if (v === '2' || v === 'eso_2' || v === 'tamrin_2' || v === 'tamrin_p2') ids.add(2);
    if (v === '3' || v === 'eso_3' || v === 'tamrin_3' || v === 'tamrin_p3') ids.add(3);
    if (['1', '2', '3'].includes(String(v))) ids.add(Number(v));
  });
  return ids.size > 0 ? Array.from(ids) : [1, 2, 3];
};

/**
 * Returns dynamic chapter / period options matching the selected volume/source filter
 */
export const getAvailableChapters = (selectedVolumes, lessonsData) => {
  const isAll = !selectedVolumes || selectedVolumes.length === 0 || selectedVolumes.includes('all');
  const chapters = [];

  // 1. Eso Arbi Shikhi chapters
  const hasEso1 = isAll || selectedVolumes.includes('1') || selectedVolumes.includes('eso_1');
  const hasEso2 = isAll || selectedVolumes.includes('2') || selectedVolumes.includes('eso_2');
  const hasEso3 = isAll || selectedVolumes.includes('3') || selectedVolumes.includes('eso_3');

  const activeEsoVols = [];
  if (hasEso1) activeEsoVols.push(1);
  if (hasEso2) activeEsoVols.push(2);
  if (hasEso3) activeEsoVols.push(3);

  if (activeEsoVols.length > 0 && lessonsData?.levels) {
    const selectedLevels = lessonsData.levels.filter(lvl => activeEsoVols.includes(lvl.id));
    selectedLevels.forEach(lvl => {
      (lvl.chapters || []).forEach(ch => {
        chapters.push({
          id: ch.id,
          label: ch.title.split(':')[0],
          badge: lvl.volume,
          group: lvl.volume,
          count: (() => { const n = (lessonsData.lessons || []).filter(l => l.chapterId === ch.id).length; return n ? `${bnNum(n)}টি পাঠ` : undefined; })()
        });
      });
    });
  }

  // 2. At-Tamrinul Kitabi parts / chapters
  const hasTamrinAll = isAll || selectedVolumes.includes('tamrin');
  const hasP1 = hasTamrinAll || selectedVolumes.includes('tamrin_p1') || selectedVolumes.includes('tamrin_1');
  const hasP2 = hasTamrinAll || selectedVolumes.includes('tamrin_p2') || selectedVolumes.includes('tamrin_2');
  const hasP3 = hasTamrinAll || selectedVolumes.includes('tamrin_p3') || selectedVolumes.includes('tamrin_3');
  const hasApp = hasTamrinAll || selectedVolumes.includes('tamrin_app');

  tamrinParts.forEach(part => {
    let match = false;
    if (part.partKey === 'part1' && hasP1) match = true;
    if (part.partKey === 'part2' && hasP2) match = true;
    if (part.partKey === 'part3' && hasP3) match = true;
    if (part.partKey === 'appendix' && hasApp) match = true;

    if (match) {
      chapters.push({
        id: part.partKey,
        label: part.name,
        badge: part.pages,
        group: '✍️ আত-তামরীনুল কিতাবী',
        count: `${part.totalTamrins || part.tamrins.length}টি তামরীন`
      });
    }
  });

  return chapters;
};

/**
 * Returns dynamic lesson / tamrin options matching the selected volume and chapter filters
 */
export const getAvailableLessons = (selectedVolumes, selectedChapters, lessonsData) => {
  const isAllVols = !selectedVolumes || selectedVolumes.length === 0 || selectedVolumes.includes('all');
  const isAllChs = !selectedChapters || selectedChapters.length === 0 || selectedChapters.includes('all');
  const lessons = [];

  // 1. Eso Arbi Shikhi lessons
  const hasEso1 = isAllVols || selectedVolumes.includes('1') || selectedVolumes.includes('eso_1');
  const hasEso2 = isAllVols || selectedVolumes.includes('2') || selectedVolumes.includes('eso_2');
  const hasEso3 = isAllVols || selectedVolumes.includes('3') || selectedVolumes.includes('eso_3');
  const activeEsoVols = [];
  if (hasEso1) activeEsoVols.push(1);
  if (hasEso2) activeEsoVols.push(2);
  if (hasEso3) activeEsoVols.push(3);

  if (activeEsoVols.length > 0 && lessonsData?.lessons) {
    lessonsData.lessons
      .filter(l => {
        const matchVol = activeEsoVols.includes(l.volumeId);
        const matchCh = isAllChs || selectedChapters.includes(l.chapterId);
        return matchVol && matchCh;
      })
      .forEach(les => {
        lessons.push({
          id: les.id,
          label: lessonLabel(les),
          badge: bnNum(vocabularyData.filter((w) => w.lessonId === les.id).length) + 'টি',
          group: `${ord(les.volumeId)} খণ্ড • ${ord(Number(String(les.chapterId).split('-ch')[1]) || 0)} অধ্যায়`
        });
      });
  }

  // 2. At-Tamrinul Kitabi individual tamrins
  const hasTamrinAll = isAllVols || selectedVolumes.includes('tamrin');
  const hasP1 = hasTamrinAll || selectedVolumes.includes('tamrin_p1') || selectedVolumes.includes('tamrin_1');
  const hasP2 = hasTamrinAll || selectedVolumes.includes('tamrin_p2') || selectedVolumes.includes('tamrin_2');
  const hasP3 = hasTamrinAll || selectedVolumes.includes('tamrin_p3') || selectedVolumes.includes('tamrin_3');
  const hasApp = hasTamrinAll || selectedVolumes.includes('tamrin_app');

  tamrinParts.forEach(part => {
    let matchPart = false;
    if (part.partKey === 'part1' && hasP1) matchPart = true;
    if (part.partKey === 'part2' && hasP2) matchPart = true;
    if (part.partKey === 'part3' && hasP3) matchPart = true;
    if (part.partKey === 'appendix' && hasApp) matchPart = true;

    if (matchPart) {
      const matchCh = isAllChs || selectedChapters.includes(part.partKey);
      if (matchCh) {
        // কিতাবের নতুন শব্দের তালিকা (শব্দ অনুশীলনের জন্য) আগে, তারপর প্রতিটি তামরীন
        getTamrinWordGroups(part.id).forEach(g => {
          lessons.push({
            id: g.id,
            label: `📚 ${g.title}`,
            badge: `${bnNum(g.words.length)}টি শব্দ`,
            group: `✍️ ${part.name}`
          });
        });
        part.tamrins.forEach(t => {
          lessons.push({
            id: t.id,
            label: t.title,
            badge: t.pagesStr || `পৃষ্ঠা ${t.page}`,
            group: `✍️ ${part.name}`
          });
        });
      }
    }
  });

  return lessons;
};
