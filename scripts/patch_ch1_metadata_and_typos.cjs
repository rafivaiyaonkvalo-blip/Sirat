const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/lessons.json');
const rawData = fs.readFileSync(lessonsPath, 'utf8');
const data = JSON.parse(rawData);

const ch1Titles = {
  1: {
    arabicTitle: 'الدَّرْسُ الأَوَّلُ: الكَلِمَاتُ الأَسَاسِيَّةُ وَالإِشَارَةُ (هٰذَا / ذٰلِكَ / هٰذِهِ / تِلْكَ)',
    pages: 'পৃষ্ঠা ১৩-১৯'
  },
  2: {
    arabicTitle: 'الدَّرْسُ الثَّانِي: الأَشْيَاءُ وَأَوْصَافُهَا (جَدِيدٌ / قَدِيمٌ / كَبِيرٌ / صَغِيرٌ)',
    pages: 'পৃষ্ঠা ২০-২৪'
  },
  3: {
    arabicTitle: 'الدَّرْسُ الثَّالِثُ: الضَّمَائِرُ الشَّخْصِيَّةُ وَالتَّعَارُفُ (أَنَا / أَنْتَ / هُوَ)',
    pages: 'পৃষ্ঠা ২৫-৩০'
  },
  4: {
    arabicTitle: 'الدَّرْسُ الرَّابِعُ: التَّعْرِيفُ بِـ (الْـ) وَالسُّؤَالُ بِـ (كَيْفَ؟)',
    pages: 'পৃষ্ঠা ৩১-৩৬'
  },
  5: {
    arabicTitle: 'الدَّرْسُ الخَامِسُ: النِّسْبَةُ وَالمِلْكِيَّةُ الشَّخْصِيَّةُ (كِتَابِي / كِتَابُكَ / كِتَابُهُ)',
    pages: 'পৃষ্ঠা ৩৭-৪০'
  },
  6: {
    arabicTitle: 'الدَّرْسُ السَّادِسُ: المِلْكِيَّةُ وَالمَعْرِفَةُ (كِتَابُ رَاشِدٍ / بَابُ المَسْجِدِ)',
    pages: 'পৃষ্ঠা ৪১-৪৪'
  },
  7: {
    arabicTitle: 'الدَّرْسُ السَّابِعُ: الظُّرُوفُ وَالجِهَاتُ (عِنْدَ / أَمَامَ / فَوْقَ / تَحْتَ وَأَيْنَ؟)',
    pages: 'পৃষ্ঠা ৪৫-৪৬'
  },
  8: {
    arabicTitle: 'الدَّرْسُ الثَّامِنُ: التَّعْبِيرُ عَنِ الظَّرْفِيَّةِ بِـ (فِي المَسْجِدِ / فِي الغُرْفَةِ)',
    pages: 'পৃষ্ঠা ৪৭-৪৭'
  },
  9: {
    arabicTitle: 'الدَّرْسُ التَّاسِعُ: الحِوَارَاتُ الشَّامِلَةُ وَالتَّطْبِيقَاتُ الحَيَّةُ',
    pages: 'পৃষ্ঠা ৪৮-৪৮'
  }
};

let patchedLessons = 0;
let fixedTypos = 0;

data.lessons.forEach(l => {
  if (l.chapterId === 'vol1-ch1') {
    const num = l.lessonNumberInChapter;
    const meta = ch1Titles[num];
    if (meta) {
      l.chapterNumber = 1;
      l.chapterTitle = '১ম অধ্যায়: মৌলিক শব্দ, বাক্য ও জীবন্ত কথোপকথন';
      l.lessonNumber = num;
      l.pages = meta.pages;
      l.arabicTitle = meta.arabicTitle;
      l.subTitle = meta.arabicTitle;
      l.titleAr = meta.arabicTitle;
      patchedLessons++;
    }

    // Fix any occurrences of "তালাল" typo
    if (Array.isArray(l.tamrinKitabi)) {
      l.tamrinKitabi.forEach(t => {
        if (t.bangla && t.bangla.includes('তালাল')) {
          t.bangla = t.bangla.replace(/তালাল/g, 'তালার');
          fixedTypos++;
        }
        if (t.prompt && t.prompt.includes('তালাল')) {
          t.prompt = t.prompt.replace(/তালাল/g, 'তালার');
          fixedTypos++;
        }
        if (t.text && t.text.includes('তালাল')) {
          t.text = t.text.replace(/তালাল/g, 'তালার');
          fixedTypos++;
        }
      });
    }
  }
});

fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Successfully patched ${patchedLessons} Chapter 1 lessons and fixed ${fixedTypos} typos!`);
