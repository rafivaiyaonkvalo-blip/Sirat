const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/lessons.json');
const vocabPath = path.join(__dirname, '../src/data/vocabulary.json');

const lessonsData = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

// 1. Update Chapter 1 metadata
lessonsData.levels[0].totalLessons = 20; // 9 + 8 + 3 = 20
lessonsData.levels[0].chapters[0].lessonCount = 9;
lessonsData.levels[0].chapters[0].title = "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার (৯টি পাঠ)";
lessonsData.levels[0].chapters[0].subTitle = "ইসমুল ইশারা, সিফাত-মাওসূফ, সম্বোধন, বিপরীত সিফাত, যমীর, ইদাফাত, যরফ ও হরফে জর";

// 9 Authentic Lessons for Volume 1 Chapter 1
const ch1Lessons = [
  // LESSON 1
  {
    id: "vol1-ch1-l1",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 1,
    lessonNumberInChapter: 1,
    title: "১ম পাঠ: ইসমুল ইশারা (পুংলিঙ্গ ও স্ত্রীলিঙ্গ) ও মৌলিক শব্দভাণ্ডার",
    subTitle: "الدرس الأول : هٰذَا ، هٰذِهِ ، ذٰلِكَ ، تِلْكَ (أسماء الإشارة)",
    pages: "পৃষ্ঠা ১৫-১৯",
    grammarRule: {
      summary: "আরবিতে কোনো নিকটবর্তী বা দূরবর্তী বস্তু নির্দেশ করার জন্য 'ইসমুল ইশারা' (إسم الإشارة) ব্যবহৃত হয়। পুংলিঙ্গ শব্দের ক্ষেত্রে নিকটের জন্য 'هٰذَا' (ইহা/এটি) এবং দূরের জন্য 'ذٰلِكَ' (উহা/ওটি) বসে। স্ত্রীলিঙ্গ শব্দের ক্ষেত্রে নিকটের জন্য 'هٰذِهِ' এবং দূরের জন্য 'تِلْكَ' বসে।",
      points: [
        "পুংলিঙ্গ (মুযাক্কার): هٰذَا كِتَابٌ (এটি একটি বই), ذٰلِكَ قَلَمٌ (ওটি একটি কলম)।",
        "স্ত্রীলিঙ্গ (মুয়ান্নাস): هٰذِهِ سَاعَةٌ (এটি একটি ঘড়ি), تِلْكَ مَدْرَسَةٌ (ওটি একটি মাদ্রাসা)।",
        "শব্দের শেষে গোল তা (ة) থাকলে শব্দটি সাধারণ নিয়মে স্ত্রীলিঙ্গ হয় এবং তার জন্য هٰذِهِ বা تِلْكَ বসে।",
        "শব্দের শেষের তানভীন (ـٌ / একবচন পেশ) পূর্ণাঙ্গ উচ্চারণে 'উন' (যেমন: কিতাবুন, কলমুন) উচ্চারিত হয়।"
      ]
    },
    vocabulary: [
      { arabic: "كِتَابٌ", bangla: "একটি বই", transliteration: "Kitābun", banglaPronunciation: "কিতাবুন" },
      { arabic: "قَلَمٌ", bangla: "একটি কলম", transliteration: "Qalamun", banglaPronunciation: "কলমুন" },
      { arabic: "مَسْجِدٌ", bangla: "একটি মসজিদ", transliteration: "Masjidun", banglaPronunciation: "মাসজিদুন" },
      { arabic: "بَيْتٌ", bangla: "একটি ঘর / বাড়ি", transliteration: "Baytun", banglaPronunciation: "বাইতুন" },
      { arabic: "بَابٌ", bangla: "একটি দরজা", transliteration: "Bābun", banglaPronunciation: "বাবুন" },
      { arabic: "مِصْبَاحٌ", bangla: "একটি বাতি", transliteration: "Misbāhun", banglaPronunciation: "মিসবাহুন" },
      { arabic: "جِدَارٌ", bangla: "একটি দেয়াল", transliteration: "Jidārun", banglaPronunciation: "জিদারুন" },
      { arabic: "كُرْسِيٌّ", bangla: "একটি চেয়ার", transliteration: "Kursiyyun", banglaPronunciation: "কুরসিইয়ুন" },
      { arabic: "سَرِيرٌ", bangla: "একটি খাট", transliteration: "Sarīrun", banglaPronunciation: "সারীরুন" },
      { arabic: "سَاعَةٌ", bangla: "একটি ঘড়ি", transliteration: "Sā'atun", banglaPronunciation: "সাআ'তুন" },
      { arabic: "مِظَلَّةٌ", bangla: "একটি ছাতা", transliteration: "Mizallatun", banglaPronunciation: "মিযাল্লাতুন" },
      { arabic: "صُنْدُوقٌ", bangla: "একটি বাক্স", transliteration: "Sundūqun", banglaPronunciation: "সুন্দূকুন" },
      { arabic: "مِفْتَاحٌ", bangla: "একটি চাবি", transliteration: "Miftāhun", banglaPronunciation: "মিফতাহুন" },
      { arabic: "نَظَّارَةٌ", bangla: "একটি চশমা", transliteration: "Nazzāratun", banglaPronunciation: "নাযযারাতুন" },
      { arabic: "سَيَّارَةٌ", bangla: "একটি গাড়ি", transliteration: "Sayyāratun", banglaPronunciation: "সাইয়্যারাতুন" },
      { arabic: "دَرَّاجَةٌ", bangla: "একটি সাইকেল", transliteration: "Darrājatun", banglaPronunciation: "দাররাজাতুন" }
    ],
    sentences: [
      { arabic: "هٰذَا كِتَابٌ وَذٰلِكَ قَلَمٌ.", bangla: "ইহা একটি বই এবং উহা একটি কলম।", explanation: "হাযা নিকটবর্তী পুংলিঙ্গ ইশারা এবং যালিকা দূরবর্তী পুংলিঙ্গ ইশারা।" },
      { arabic: "هٰذِهِ سَاعَةٌ وَتِلْكَ نَظَّارَةٌ.", bangla: "ইহা একটি ঘড়ি এবং উহা একটি চশমা।", explanation: "উভয় শব্দে গোল তা (ة) থাকায় স্ত্রীলিঙ্গ ইশারা হাযিহি ও তিলকা বসেছে।" },
      { arabic: "هٰذَا مَسْجِدٌ وَتِلْكَ مَدْرَسَةٌ.", bangla: "এটি একটি মসজিদ এবং ওটি একটি মাদ্রাসা।", explanation: "মসজিদ পুংলিঙ্গ এবং মাদ্রাসা স্ত্রীলিঙ্গ।" },
      { arabic: "هٰذَا مِفْتَاحٌ وَذٰلِكَ صُنْدُوقٌ.", bangla: "এটি একটি চাবি এবং ওটি একটি বাক্স।", explanation: "নিকট ও দূরবর্তী পুংলিঙ্গ বস্তুর সমন্বয়।" }
    ],
    dialogues: [
      { speaker: "মুয়াল্লিম", arabic: "مَا هٰذَا يَا وَلَدُ؟", bangla: "হে ছেলে, এটি কী?" },
      { speaker: "তিলমীয", arabic: "هٰذَا كِتَابٌ.", bangla: "এটি একটি বই।" },
      { speaker: "মুয়াল্লিম", arabic: "وَمَا تِلْكَ؟", bangla: "আর ওটি কী?" },
      { speaker: "তিলমীয", arabic: "تِلْكَ سَاعَةٌ جَمِيلَةٌ.", bangla: "ওটি একটি সুন্দর ঘড়ি।" }
    ],
    quiz: [
      {
        question: "'একটি ঘড়ি' এর সঠিক আরবি রূপ কোনটি?",
        options: ["سَاعَةٌ", "سَيَّارَةٌ", "سَرِيرٌ", "حَقِيبَةٌ"],
        correctIndex: 0,
        explanation: "سَاعَةٌ অর্থ ঘড়ি, যার শেষে গোল তা থাকায় এটি স্ত্রীলিঙ্গ।"
      },
      {
        question: "খালি ঘরে কী বসবে? '... مَدْرَسَةٌ'",
        options: ["هٰذِهِ", "هٰذَا", "ذٰلِكَ", "هُوَ"],
        correctIndex: 0,
        explanation: "মাদ্রাসা স্ত্রীলিঙ্গ বিশেষ্য হওয়ায় নিকটের স্ত্রীলিঙ্গ ইশারা 'هٰذِهِ' বসবে।"
      },
      {
        question: "দূরবর্তী পুংলিঙ্গ বস্তু নির্দেশ করতে কোনটি ব্যবহৃত হয়?",
        options: ["ذٰلِكَ", "تِلْكَ", "هٰذَا", "هٰذِهِ"],
        correctIndex: 0,
        explanation: "'ذٰلِكَ' হলো দূরবর্তী পুংলিঙ্গ ইসমুল ইশারা।"
      }
    ],
    tamrinKitabi: [
      { task: "বাংলায় অনুবাদ করো", text: "هٰذَا مَسْجِدٌ وَذٰلِكَ بَيْتٌ ، هٰذِهِ سَيَّارَةٌ وَتِلْكَ طَيَّارَةٌ." },
      { task: "আরবিতে বলো ও লেখো", text: "এটি একটি কলম এবং ওটি একটি চশমা। এটি একটি খাট এবং ওটি একটি কামরা।" }
    ]
  },

  // LESSON 2
  {
    id: "vol1-ch1-l2",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 2,
    lessonNumberInChapter: 2,
    title: "২য় পাঠ: সিফাত-মাওসূফ (গুণ ও গুণান্বিত বিশেষ্য)",
    subTitle: "الدرس الثاني : النَّعْتُ وَالْمَنْعُوتُ (جَدِيدٌ ، قَدِيمٌ ، جَمِيلٌ ، كَبِيرٌ ، صَغِيرٌ)",
    pages: "পৃষ্ঠা ২০-২৪",
    grammarRule: {
      summary: "আরবিতে গুণবাচক শব্দকে 'সিফাত' (صِفَة) এবং যার গুণ বর্ণনা করা হয় তাকে 'মাওসূফ' (مَوْصُوف) বলে। বাংলায় বিশেষণ আগে বসে (নতুন বই), কিন্তু আরবিতে মাওসূফ আগে ও সিফাত পরে বসে (كِتَابٌ جَدِيدٌ)।",
      points: [
        "মাওসূফ পুংলিঙ্গ হলে সিফাত পুংলিঙ্গ: كِتَابٌ جَدِيدٌ (একটি নতুন বই), قَلَمٌ جَمِيلٌ (একটি সুন্দর কলম)।",
        "মাওসূফ স্ত্রীলিঙ্গ হলে সিফাতে গোল তা (ة) বসে: سَاعَةٌ جَمِيلَةٌ (একটি সুন্দর ঘড়ি), مَدْرَسَةٌ كَبِيرَةٌ (একটি বড় মাদরাসা)।",
        "মাওসূফে তানভীন থাকলে অনির্দিষ্ট অবস্থায় সিফাতেও তানভীন থাকে।"
      ]
    },
    vocabulary: [
      { arabic: "جَدِيدٌ / جَدِيدَةٌ", bangla: "নতুন", transliteration: "Jadīdun / Jadīdatun", banglaPronunciation: "জাদীদুন / জাদীদাতুন" },
      { arabic: "قَدِيمٌ / قَدِيمَةٌ", bangla: "পুরনো", transliteration: "Qadīmun / Qadīmatun", banglaPronunciation: "ক্বাদীমুন / ক্বাদীমাতুন" },
      { arabic: "جَمِيلٌ / جَمِيلَةٌ", bangla: "সুন্দর", transliteration: "Jamīlun / Jamīlatun", banglaPronunciation: "জামীলুন / জামীলাতুন" },
      { arabic: "قَبِيحٌ / قَبِيحَةٌ", bangla: "কুৎসিত / অসুন্দর", transliteration: "Qabīhun / Qabīhatun", banglaPronunciation: "ক্বাবীহুন / ক্বাবীহাতুন" },
      { arabic: "كَبِيرٌ / كَبِيرَةٌ", bangla: "বড়", transliteration: "Kabīrun / Kabīratun", banglaPronunciation: "কবীরুন / কবীরাতুন" },
      { arabic: "صَغِيرٌ / صَغِيرَةٌ", bangla: "ছোট", transliteration: "Saghīrun / Saghīratun", banglaPronunciation: "সাগীরুন / সাগীরাতুন" },
      { arabic: "جَيِّدٌ / جَيِّدَةٌ", bangla: "উত্তম / ভালো", transliteration: "Jayyidun / Jayyidatun", banglaPronunciation: "জাইয়্যিদুন / জাইয়্যিদাতুন" },
      { arabic: "مَدْرَسَةٌ", bangla: "মাদরাসা", transliteration: "Madrasatun", banglaPronunciation: "মাদরাসাতুন" },
      { arabic: "سَبُّورَةٌ", bangla: "ব্ল্যাকবোর্ড", transliteration: "Sabbūratun", banglaPronunciation: "সাব্বূরাতুন" },
      { arabic: "مِسْطَرَةٌ", bangla: "রুলার", transliteration: "Mistaratun", banglaPronunciation: "মিসত্বারাতুন" },
      { arabic: "عَلَمٌ", bangla: "পতাকা", transliteration: "'Alamun", banglaPronunciation: "আ'লামুন" },
      { arabic: "مِرْوَحَةٌ", bangla: "পাখা", transliteration: "Mirwahatun", banglaPronunciation: "মিরওয়াহাতুন" }
    ],
    sentences: [
      { arabic: "هٰذَا كِتَابٌ جَدِيدٌ.", bangla: "এটি একটি নতুন বই।", explanation: "كِتَابٌ (মাওসূফ) + جَدِيدٌ (সিফাত)।" },
      { arabic: "هٰذِهِ سَاعَةٌ جَمِيلَةٌ.", bangla: "ইহা একটি সুন্দর ঘড়ি।", explanation: "سَاعَةٌ স্ত্রীলিঙ্গ হওয়ায় সিফাত جَمِيلَةٌ-এ গোল তা এসেছে।" },
      { arabic: "ذٰلِكَ مَسْجِدٌ كَبِيرٌ وَتِلْكَ مَدْرَسَةٌ صَغِيرَةٌ.", bangla: "ওটি একটি বড় মসজিদ এবং ওটি একটি ছোট মাদরাসা।", explanation: "মুযাক্কার ও মুয়ান্নাস সিফাত-মাওসূফের দৃষ্টান্ত।" }
    ],
    dialogues: [
      { speaker: "ফাতিমা", arabic: "هَلْ هٰذِهِ مِرْوَحَةٌ جَيِّدَةٌ؟", bangla: "এটি কি একটি ভালো পাখা?" },
      { speaker: "আয়েশা", arabic: "نَعَمْ، هٰذِهِ مِرْوَحَةٌ جَيِّدَةٌ وَجَمِيلَةٌ.", bangla: "হ্যাঁ, এটি একটি ভালো ও সুন্দর পাখা।" }
    ],
    quiz: [
      {
        question: "'একটি নতুন মাদরাসা' এর সঠিক আরবি কোনটি?",
        options: ["مَدْرَسَةٌ جَدِيدَةٌ", "مَدْرَسَةٌ جَدِيدٌ", "جَدِيدٌ مَدْرَسَةٌ", "مَدْرَسَةٌ كَبِيرٌ"],
        correctIndex: 0,
        explanation: "মাওসূফ আগে আসবে এবং মাওসূফ স্ত্রীলিঙ্গ হওয়ায় সিফাতও جَدِيدَةٌ হবে।"
      }
    ],
    tamrinKitabi: [
      { task: "শূন্যস্থান পূরণ করো", text: "هٰذَا قَلَمٌ [...] ، تِلْكَ مَدْرَسَةٌ [...] (নতুন / বড়)" }
    ]
  },

  // LESSON 3
  {
    id: "vol1-ch1-l3",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 3,
    lessonNumberInChapter: 3,
    title: "৩য় পাঠ: সম্বোধন (নিদা) ও প্রাথমিক আত্মপরিচয়",
    subTitle: "الدرس الثالث : حَرْفُ النِّدَاءِ وَالتَّعَارُفُ (يَا وَلَدُ ، يَا بِنْتُ ، أَنَا تِلْمِيذٌ جَدِيدٌ)",
    pages: "পৃষ্ঠা ২৫-২৮",
    grammarRule: {
      summary: "আরবিতে কাউকে ডাকতে বা সম্বোধন করতে 'يَا' (ইয়া - হে) হরফে নিদা ব্যবহৃত হয়। 'ইয়া'-এর পরবর্তী শব্দে তানভীন হয় না, বরং এক পেশ হয় (যেমন: يَا وَلَدُ!, يَا بِنْتُ!, يَا بِلَالُ!)। আত্মপরিচয়ে 'أَنَا' (আমি) এবং পরোক্ষ পরিচয়ে 'هُوَ' (সে - পুং) ও 'هِيَ' (সে - স্ত্রী) বসে।",
      points: [
        "সম্বোধন: يَا وَلَدُ! (হে ছেলে!), يَا بِنْتُ! (হে মেয়ে!), يَا زَيْنَبُ! (হে যয়নব!)।",
        "আত্মপরিচয়: أَنَا تِلْمِيذٌ جَدِيدٌ (আমি নতুন ছাত্র), أَنَا تِلْمِيذَةٌ جَدِيدَةٌ (আমি নতুন ছাত্রী)।",
        "তৃতীয় পুরুষ: هُوَ بِلَالٌ، هُوَ تِلْمِيذٌ جَدِيدٌ (সে বেলাল, সে নতুন ছাত্র), هِيَ عَائِشَةُ، هِيَ تِلْمِيذَةٌ جَدِيدَةٌ (সে আয়েশা, সে নতুন ছাত্রী)।",
        "'جِدًّا' (খুব / অত্যন্ত) শব্দ দ্বারা সিফাতকে জোরদার করা হয়: مُؤَدَّبٌ جِدًّا (অত্যন্ত ভদ্র)।"
      ]
    },
    vocabulary: [
      { arabic: "يَا وَلَدُ!", bangla: "হে ছেলে!", transliteration: "Yā Waladu!", banglaPronunciation: "ইয়া ওয়ালাদু!" },
      { arabic: "يَا بِنْتُ!", bangla: "হে মেয়ে!", transliteration: "Yā Bintu!", banglaPronunciation: "ইয়া বিনতু!" },
      { arabic: "يَا بِلَالُ!", bangla: "হে বেলাল!", transliteration: "Yā Bilālu!", banglaPronunciation: "ইয়া বিলালু!" },
      { arabic: "يَا زَيْنَبُ!", bangla: "হে যয়নব!", transliteration: "Yā Zaynabu!", banglaPronunciation: "ইয়া যাইনাবু!" },
      { arabic: "تِلْمِيذٌ / تِلْمِيذَةٌ", bangla: "ছাত্র / ছাত্রী", transliteration: "Tilmīdhun / Tilmīdhatun", banglaPronunciation: "তিলমীযুন / তিলমীযাতুন" },
      { arabic: "شَرِيفٌ / شَرِيفَةٌ", bangla: "ভদ্র / সম্ভ্রান্ত", transliteration: "Sharīfun / Sharīfatun", banglaPronunciation: "শারীফুন / শারীফাতুন" },
      { arabic: "مُؤَدَّبٌ / مُؤَدَّبَةٌ", bangla: "শিষ্টাচারী / নম্র", transliteration: "Mu'addabun / Mu'addabatun", banglaPronunciation: "মুয়াদ্দাবুন / মুয়াদ্দাবাতুন" },
      { arabic: "جِدًّا", bangla: "খুব / অত্যন্ত", transliteration: "Jiddan", banglaPronunciation: "জিদ্দান" },
      { arabic: "أَنَا", bangla: "আমি", transliteration: "Anā", banglaPronunciation: "আনা" },
      { arabic: "هُوَ", bangla: "সে (পুং)", transliteration: "Huwa", banglaPronunciation: "হুওয়া" },
      { arabic: "هِيَ", bangla: "সে (স্ত্রী)", transliteration: "Hiya", banglaPronunciation: "হিয়া" }
    ],
    sentences: [
      { arabic: "أَنَا بِلَالٌ، أَنَا تِلْمِيذٌ جَدِيدٌ، أَنَا وَلَدٌ مُؤَدَّبٌ.", bangla: "আমি বেলাল, আমি নতুন ছাত্র, আমি একটি ভদ্র ছেলে।", explanation: "প্রথম পুরুষের পূর্ণাঙ্গ আত্মপরিচয়মূলক বাক্য।" },
      { arabic: "أَنَا عَائِشَةُ، أَنَا تِلْمِيذَةٌ جَدِيدَةٌ، أَنَا بِنْتٌ مُؤَدَّبَةٌ.", bangla: "আমি আয়েশা, আমি নতুন ছাত্রী, আমি একটি ভদ্র মেয়ে।", explanation: "স্ত্রীলিঙ্গ প্রথম পুরুষের আত্মপরিচয়।" },
      { arabic: "هُوَ بِلَالٌ، هُوَ تِلْمِيذٌ جَدِيدٌ.", bangla: "সে বেলাল, সে একজন নতুন ছাত্র।", explanation: "মুযাক্কার গায়েব (তৃতীয় পুরুষ)।" },
      { arabic: "هِيَ زَيْنَبُ، هِيَ بِنْتٌ صَغِيرَةٌ وَمُؤَدَّبَةٌ جِدًّا.", bangla: "সে যয়নব, সে একটি ছোট এবং অত্যন্ত ভদ্র মেয়ে।", explanation: "মুয়ান্নাস গায়েব ও সিফাতের প্রয়োগ।" }
    ],
    dialogues: [
      { speaker: "উস্তাদ", arabic: "مَنْ أَنْتَ يَا وَلَدُ؟", bangla: "হে ছেলে, তুমি কে?" },
      { speaker: "বেলাল", arabic: "أَنَا بِلَالٌ، أَنَا تِلْمِيذٌ جَدِيدٌ.", bangla: "আমি বেলাল, আমি নতুন ছাত্র।" },
      { speaker: "উস্তাদ", arabic: "وَمَنْ هِيَ؟", bangla: "আর সে কে?" },
      { speaker: "বেলাল", arabic: "هِيَ زَيْنَبُ، هِيَ تِلْمِيذَةٌ جَدِيدَةٌ.", bangla: "সে যয়নব, সে নতুন ছাত্রী।" }
    ],
    quiz: [
      {
        question: "হরফে নিদা 'يَا'-এর পর শব্দের শেষে সাধারণত কী হয়?",
        options: ["এক পেশ হয় (তানভীন হয় না)", "দুই পেশ হয়", "জের হয়", "যবর হয়"],
        correctIndex: 0,
        explanation: "'يَا'-এর পর মুনাদা এক পেশবিশিষ্ট হয়, যেমন: يَا وَلَدُ!"
      },
      {
        question: "'আমি একজন ভদ্র ছেলে' এর সঠিক আরবি কোনটি?",
        options: ["أَنَا وَلَدٌ مُؤَدَّبٌ", "أَنَا بِنْتٌ مُؤَدَّبَةٌ", "هُوَ وَلَدٌ مُؤَدَّبٌ", "أَنْتَ وَلَدٌ مُؤَدَّبٌ"],
        correctIndex: 0,
        explanation: "পুংলিঙ্গে 'أَنَا وَلَدٌ مُؤَدَّبٌ' সঠিক বাক্য।"
      }
    ],
    tamrinKitabi: [
      { task: "বাংলায় বলো ও লেখো", text: "أَنَا تِلْمِيذٌ جَدِيدٌ وَأَنْتَ مُعَلِّمٌ شَرِيفٌ." },
      { task: "আরবিতে রূপান্তর করো", text: "হে বেলাল! তুমি একজন মেধাবী ছাত্র।" }
    ]
  },

  // LESSON 4
  {
    id: "vol1-ch1-l4",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 4,
    lessonNumberInChapter: 4,
    title: "৪র্থ পাঠ: বিপরীতার্থক বিশেষণ, পেশা ও মৌখিক প্রশ্নোত্তর (তামরীনুশ শাফাহী)",
    subTitle: "الدرس الرابع : الصِّفَاتُ الْمُتَقَابِلَةُ وَالأَوْصَافُ (مَفْتُوحٌ ، مُغْلَقٌ ، مُعَلِّمٌ ، مَاهِرٌ)",
    pages: "পৃষ্ঠা ২৯-৩৩",
    grammarRule: {
      summary: "আরবিতে বস্তুর অবস্থা ও মানুষের যোগ্যতা প্রকাশে বিপরীতার্থক জোড় সিফাত বহুল ব্যবহৃত হয়। যেমন: مَفْتُوحٌ (খোলা) এর বিপরীত مُغْلَقٌ (বন্ধ), وَاسِعٌ (প্রশস্ত) এর বিপরীত ضَيِّقٌ (সংকীর্ণ)। এই পাঠে মৌখিক প্রশ্নোত্তরের দক্ষতা অর্জনের পর আত-তামরীনুল কিতাবীর অনুশীলন শুরু হয়।",
      points: [
        "বিপরীতার্থক জোড়: مَفْتُوحٌ / مُغْلَقٌ (খোলা / বন্ধ), وَاسِعٌ / ضَيِّقٌ (প্রশস্ত / সংকীর্ণ)।",
        "পেশা ও যোগ্যতা: مُعَلِّمٌ مَاهِرٌ (দক্ষ শিক্ষক), تِلْمِيذٌ مُجْتَهِدٌ (পরিশ্রমী ছাত্র)।",
        "সিফাতের মুয়ান্নাস রূপ: مَفْتُوحَةٌ, مُغْلَقَةٌ, وَاسِعَةٌ, ضَيِّقَةٌ, مَاهِرَةٌ, مُجْتَهِدَةٌ।"
      ]
    },
    vocabulary: [
      { arabic: "مُعَلِّمٌ / مُعَلِّمَةٌ", bangla: "শিক্ষক / শিক্ষিকা", transliteration: "Mu'allimun / Mu'allimatun", banglaPronunciation: "মুয়াল্লিমুন / মুয়াল্লিমাতুন" },
      { arabic: "مَاهِرٌ / مَاهِرَةٌ", bangla: "দক্ষ", transliteration: "Māhirun / Māhiratun", banglaPronunciation: "মাহিরুন / মাহিরাতুন" },
      { arabic: "مُجْتَهِدٌ / مُجْتَهِدَةٌ", bangla: "পরিশ্রমী", transliteration: "Mujtahidun / Mujtahidatun", banglaPronunciation: "মুজতাহিদুন / মুজতাহিদাতুন" },
      { arabic: "مَشْهُورٌ / مَشْهُورَةٌ", bangla: "প্রসিদ্ধ / বিখ্যাত", transliteration: "Mash-hūrun / Mash-hūratun", banglaPronunciation: "মাশহূরুন / মাশহূরাতুন" },
      { arabic: "مَفْتُوحٌ / مَفْتُوحَةٌ", bangla: "খোলা", transliteration: "Maftūhun / Maftūhatun", banglaPronunciation: "মাফতূহুন / মাফতূহাতুন" },
      { arabic: "مُغْلَقٌ / مُغْلَقَةٌ", bangla: "বন্ধ", transliteration: "Mughlaqun / Mughlaqatun", banglaPronunciation: "মুগলাক্বুন / মুগলাক্বাতুন" },
      { arabic: "وَاسِعٌ / وَاسِعَةٌ", bangla: "প্রশস্ত", transliteration: "Wāsi'un / Wāsi'atun", banglaPronunciation: "ওয়াসি'উন / ওয়াসি'আতুন" },
      { arabic: "ضَيِّقٌ / ضَيِّقَةٌ", bangla: "সংকীর্ণ / চাপা", transliteration: "Dayyiqun / Dayyiqatun", banglaPronunciation: "দাইয়্যিক্বুন / দাইয়্যিক্বাতুন" },
      { arabic: "طِفْلٌ / طِفْلَةٌ", bangla: "শিশু (ছেলে/মেয়ে)", transliteration: "Tiflun / Tiflatun", banglaPronunciation: "তিফলুন / তিফলাতুন" }
    ],
    sentences: [
      { arabic: "اَلْبَابُ مَفْتُوحٌ وَالنَّافِذَةُ مُغْلَقَةٌ.", bangla: "দরজাটি খোলা এবং জানালাটি বন্ধ।", explanation: "বিপরীত সিফাত এবং মুযাক্কার-মুয়ান্নাসের ভারসাম্য।" },
      { arabic: "مَاجِدٌ مُعَلِّمٌ مَاهِرٌ وَمَشْهُورٌ.", bangla: "মাজেদ একজন দক্ষ ও প্রসিদ্ধ শিক্ষক।", explanation: "একই মাওসূফের একাধিক সিফাত।" },
      { arabic: "هٰذَا مَسْجِدٌ وَاسِعٌ وَذٰلِكَ بَيْتٌ ضَيِّقٌ.", bangla: "এটি একটি প্রশস্ত মসজিদ এবং ওটি একটি সংকীর্ণ বাড়ি।", explanation: "প্রশস্ত ও সংকীর্ণের তুলনা।" }
    ],
    dialogues: [
      { speaker: "খালেদ", arabic: "هَلْ هٰذَا البَابُ مَفْتُوحٌ؟", bangla: "এই দরজাটি কি খোলা?" },
      { speaker: "সাঈদ", arabic: "لَا، بَلْ هُوَ مُغْلَقٌ.", bangla: "না, বরং এটি বন্ধ।" }
    ],
    quiz: [
      {
        question: "'مَفْتُوحٌ' (খোলা) শব্দের বিপরীত শব্দ কোনটি?",
        options: ["مُغْلَقٌ", "وَاسِعٌ", "جَدِيدٌ", "قَدِيمٌ"],
        correctIndex: 0,
        explanation: "مَفْتُوحٌ (খোলা)-এর বিপরীত হলো مُغْلَقٌ (বন্ধ)।"
      }
    ],
    tamrinKitabi: [
      { task: "আত-তামরীনুল কিতাবী অনুশীলন", text: "اَلْمَسْجِدُ وَاسِعٌ وَالنَّافِذَةُ مَفْتُوحَةٌ وَالبَابُ مُغْلَقٌ." }
    ]
  },

  // LESSON 5
  {
    id: "vol1-ch1-l5",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 5,
    lessonNumberInChapter: 5,
    title: "৫ম পাঠ: যমীরে মুত্তাসিল ও পারিবারিক সম্পর্ক (ইদাফাত ১)",
    subTitle: "الدرس الخامس : الضَّمَائِرُ الْمُتَّصِلَةُ (كِتَابِي ، كِتَابُكَ ، أَبِي ، أُمِّي ، رَبُّنَا)",
    pages: "পৃষ্ঠা ৩৪-৩৮",
    grammarRule: {
      summary: "বিশেষ্যের সাথে সংযুক্ত সর্বনামকে 'যমীরে মুত্তাসিল' (الضمير المتصل) বলে। বিশেষ্যের সাথে যমীর যুক্ত হলে তা মালিকানা বা সম্বন্ধ (ইদাফাত) প্রকাশ করে। যেমন: كِتَابِي (আমার বই), كِتَابُكَ (তোমার বই)।",
      points: [
        "ي (আমার): كِتَابِي (আমার বই), قَلَمِي (আমার কলম), أَبِي (আমার বাবা)।",
        "كَ (তোমার - পুং): كِتَابُكَ (তোমার বই), اِسْمُكَ (তোমার নাম)।",
        "كِ (তোমার - স্ত্রী): كِتَابُكِ (তোমার বই - নারী)।",
        "هُ (তার - পুং): كِتَابُهُ (তার বই), اِسْمُهُ (তার নাম)।",
        "هَا (তার - স্ত্রী): كِتَابُهَا (তার বই - নারী)।",
        "نَا (আমাদের): رَبُّنَا (আমাদের প্রতিপালক), دِينُنَا (আমাদের দ্বীন), نَبِيُّنَا (আমাদের নবী)।",
        "যমীর যুক্ত বিশেষ্যে কখনো আলিফ-লাম (ال) বা তানভীন বসে না।"
      ]
    },
    vocabulary: [
      { arabic: "أَبٌ", bangla: "পিতা / বাবা", transliteration: "Abun", banglaPronunciation: "আবুন" },
      { arabic: "أُمٌّ", bangla: "মাতা / মা", transliteration: "Ummun", banglaPronunciation: "উম্মুন" },
      { arabic: "وَالِدٌ / وَالِدَةٌ", bangla: "পিতা / মাতা", transliteration: "Wālidun / Wālidatun", banglaPronunciation: "ওয়ালিদুন / ওয়ালিদাতুন" },
      { arabic: "تَاجِرٌ", bangla: "ব্যবসায়ী", transliteration: "Tājirun", banglaPronunciation: "তাজিরুন" },
      { arabic: "كِتَابِي", bangla: "আমার বই", transliteration: "Kitābī", banglaPronunciation: "কিতাবী" },
      { arabic: "كِتَابُكَ", bangla: "তোমার বই (পুং)", transliteration: "Kitābuka", banglaPronunciation: "কিতাবুকা" },
      { arabic: "كِتَابُكِ", bangla: "তোমার বই (স্ত্রী)", transliteration: "Kitābuki", banglaPronunciation: "কিতাবুকি" },
      { arabic: "كِتَابُهُ", bangla: "তার বই (পুং)", transliteration: "Kitābuhu", banglaPronunciation: "কিতাবুহু" },
      { arabic: "كِتَابُهَا", bangla: "তার বই (স্ত্রী)", transliteration: "Kitābuhā", banglaPronunciation: "কিতাবুহা" },
      { arabic: "كِتَابُنَا", bangla: "আমাদের বই", transliteration: "Kitābunā", banglaPronunciation: "কিতাবুনা" },
      { arabic: "كِتَابُكُمْ", bangla: "তোমাদের বই", transliteration: "Kitābukum", banglaPronunciation: "কিতাবুকুম" }
    ],
    sentences: [
      { arabic: "أَنَا تِلْمِيذٌ، اِسْمِي شَاهِدٌ.", bangla: "আমি ছাত্র, আমার নাম শাহিদ।", explanation: "যমীরে মুত্তাসিল 'ي' (আমার) এর ব্যবহার।" },
      { arabic: "هٰذَا كِتَابِي وَذٰلِكَ قَلَمِي.", bangla: "ইহা আমার বই এবং উহা আমার কলম।", explanation: "নিকট ও দূরবর্তী বস্তুতে মালিকানা প্রকাশ।" },
      { arabic: "فَاطِمَةُ أُخْتِي وَأَنَا أَخُوهَا.", bangla: "ফাতেমা আমার বোন এবং আমি তার ভাই।", explanation: "পারিবারিক সম্বন্ধসূচক যমীর।" },
      { arabic: "اَللهُ رَبُّنَا وَرَبُّكُمْ وَالإِسْلَامُ دِينُنَا.", bangla: "আল্লাহ আমাদের প্রতিপালক ও তোমাদের প্রতিপালক এবং ইসলাম আমাদের দ্বীন।", explanation: "ঈমানী বাক্যে 'نَا' (আমাদের) যমীরের চমৎকার দৃষ্টান্ত।" }
    ],
    dialogues: [
      { speaker: "উস্তাদ", arabic: "مَا اسْمُكَ يَا وَلَدُ؟", bangla: "হে ছেলে, তোমার নাম কী?" },
      { speaker: "শাহিদ", arabic: "اِسْمِي شَاهِدٌ، وَهٰذَا أَخِي مَاجِدٌ.", bangla: "আমার নাম শাহিদ এবং ইনি আমার ভাই মাজেদ।" }
    ],
    quiz: [
      {
        question: "'আমার কলম' এর আরবি কী?",
        options: ["قَلَمِي", "قَلَمُكَ", "قَلَمُهُ", "قَلَمُنَا"],
        correctIndex: 0,
        explanation: "বিশেষ্যের শেষে 'ي' যুক্ত হয়ে আমার অর্থ দেয়: قَلَمِي।"
      }
    ],
    tamrinKitabi: [
      { task: "অর্থ বলো ও অনুবাদ করো", text: "اَللهُ رَبِّي وَمُحَمَّدٌ نَبِيِّي وَالْقُرْآنُ كِتَابِي وَالْكَعْبَةُ قِبْلَتِي." }
    ]
  },

  // LESSON 6
  {
    id: "vol1-ch1-l6",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 6,
    lessonNumberInChapter: 6,
    title: "৬ষ্ঠ পাঠ: মুরাক্কাবে ইদাফী - মুদাফ ও মুদাফ ইলাইহি (ইদাফাত ২)",
    subTitle: "الدرس السادس : الْمُضَافُ وَالْمُضَافُ إِلَيْهِ (كِتَابُ اللهِ ، بَيْتُ اللهِ ، بَابُ الْمَسْجِدِ)",
    pages: "পৃষ্ঠা ৩৯-৪৩",
    grammarRule: {
      summary: "একটি বিশেষ্যকে অন্য বিশেষ্যের সাথে সম্বন্ধ করাকে 'ইদাফাত' (الإضافة) বলে। ১ম অংশকে 'মুদাফ' (مضاف) এবং ২য় অংশকে 'মুদাফ ইলাইহ' (مضاف إليه) বলে। মুদাফে কখনোই আলিফ-লাম (ال) এবং তানভীন বসে না। মুদাফ ইলাইহ সর্বদা মাজরুর (জেরবিশিষ্ট) হয়।",
      points: [
        "মুদাফ + মুদাফ ইলাইহি: كِتَابُ اللهِ (আল্লাহর কিতাব), بَيْتُ اللهِ (আল্লাহর ঘর), رَسُولُ اللهِ (আল্লাহর রাসূল)।",
        "ব্যক্তির সাথে সম্বন্ধ: كِتَابُ رَاشِدٍ (রাশেদের বই), عِقْدُ عَائِشَةَ (আয়েশার হার)।",
        "বস্তু বা স্থানের সাথে সম্বন্ধ: بَابُ الْمَسْجِدِ (মসজিদের দরজা), مِفْتَاحُ الْقُفْلِ (তালার চাবি), سُوقُ الْمَدِينَةِ (শহরের বাজার)।",
        "জরুরি কায়দা: মুদাফে তানভীন ও আলিফ-লাম দেওয়া মারাত্মক ভুল।"
      ]
    },
    vocabulary: [
      { arabic: "نُورٌ", bangla: "আলো / নূর", transliteration: "Nūrun", banglaPronunciation: "নূরুন" },
      { arabic: "ظُلْمَةٌ", bangla: "অন্ধকার", transliteration: "Zulmatun", banglaPronunciation: "যুলমাতুন" },
      { arabic: "طَرِيقٌ", bangla: "একটি পথ / রাস্তা", transliteration: "Tarīqun", banglaPronunciation: "ত্বারীক্বুন" },
      { arabic: "قِصَّةٌ", bangla: "গল্প / কাহিনী", transliteration: "Qissatun", banglaPronunciation: "ক্বিস্সাতুন" },
      { arabic: "سُوقٌ", bangla: "একটি বাজার", transliteration: "Sūqun", banglaPronunciation: "সূক্বুন" },
      { arabic: "كِتَابُ اللهِ", bangla: "আল্লাহর কিতাব", transliteration: "Kitābullāh", banglaPronunciation: "কিতাবুল্লাহ" },
      { arabic: "بَيْتُ اللهِ", bangla: "আল্লাহর ঘর", transliteration: "Baytullāh", banglaPronunciation: "বাইতুল্লাহ" },
      { arabic: "رَسُولُ اللهِ", bangla: "আল্লাহর রাসূল", transliteration: "Rasūlullāh", banglaPronunciation: "রাসূলুল্লাহ" },
      { arabic: "كِتَابُ رَاشِدٍ", bangla: "রাশেদের বই", transliteration: "Kitābu Rāshidin", banglaPronunciation: "কিতাবু রাশিদিন" },
      { arabic: "عِقْدُ عَائِشَةَ", bangla: "আয়েশার হার", transliteration: "'Iqdu 'Ā'ishata", banglaPronunciation: "ই'ক্বদু আ'য়িশাতা" },
      { arabic: "بَابُ الْمَسْجِدِ", bangla: "মসজিদের দরজা", transliteration: "Bābul Masjidi", banglaPronunciation: "বাবুল মাসজিদি" },
      { arabic: "مِفْتَاحُ الْقُفْلِ", bangla: "তালার চাবি", transliteration: "Miftāhul Qufli", banglaPronunciation: "মিফতাহুল ক্বুফলি" },
      { arabic: "مُعَلِّمُ الْمَدْرَسَةِ", bangla: "মাদ্রাসার শিক্ষক", transliteration: "Mu'allimul Madrasati", banglaPronunciation: "মুয়াল্লিমুল মাদরাসাতী" },
      { arabic: "مَنْظَرُ الْقَرْيَةِ", bangla: "গ্রামের দৃশ্য", transliteration: "Manzarul Qaryati", banglaPronunciation: "মানযারুল ক্বারয়াতি" },
      { arabic: "سُوقُ الْمَدِينَةِ", bangla: "শহরের বাজার", transliteration: "Sūqul Madīnati", banglaPronunciation: "সূক্বুল মাদীনাতী" }
    ],
    sentences: [
      { arabic: "اَلْقُرْآنُ كِتَابُ اللهِ وَالْكَعْبَةُ بَيْتُ اللهِ.", bangla: "কুরআন আল্লাহর কিতাব এবং কাবা আল্লাহর ঘর।", explanation: "মুদাফ ও মুদাফ ইলাইহির বিশুদ্ধ প্রয়োগ।" },
      { arabic: "هٰذَا مِفْتَاحُ الْقُفْلِ وَذٰلِكَ بَابُ الْمَسْجِدِ.", bangla: "এটি তালার চাবি এবং ওটি মসজিদের দরজা।", explanation: "ইসমুল ইশারা ও মুরাক্কাবে ইদাফীর বাক্য।" },
      { arabic: "أَبُو فَاطِمَةَ عَالِمٌ كَبِيرٌ.", bangla: "ফাতিমার পিতা একজন বড় আলেম।", explanation: "মুদাফ-মুদাফ ইলাইহি মুবতাদা এবং সিফাত-মাওসূফ খবর।" }
    ],
    dialogues: [
      { speaker: "খালেদ", arabic: "كِتَابُ مَنْ هٰذَا؟", bangla: "এটি কার বই?" },
      { speaker: "রাশিদ", arabic: "هٰذَا كِتَابُ رَاشِدٍ.", bangla: "এটি রাশেদের বই।" }
    ],
    quiz: [
      {
        question: "মুদাফের ক্ষেত্রে কোনটি সঠিক নিয়ম?",
        options: ["মুদাফে আলিফ-লাম ও তানভীন কখনো বসে না", "মুদাফে তানভীন আবশ্যক", "মুদাফ সর্বদা জেরযুক্ত হয়", "মুদাফে কেবল আলিফ-লাম বসে"],
        correctIndex: 0,
        explanation: "মুদাফে আলিফ-লাম এবং তানভীন কোনোটাই গ্রহণ করে না।"
      },
      {
        question: "'আল্লাহর রাসূল' এর আরবি কী?",
        options: ["رَسُولُ اللهِ", "الرَّسُولُ اللهِ", "رَسُولٌ اللهِ", "رَسُولَ اللهِ"],
        correctIndex: 0,
        explanation: "মুদাফ রসূলে পেশ এবং মুদাফ ইলাইহি আল্লাহি-তে জের: رَسُولُ اللهِ।"
      }
    ],
    tamrinKitabi: [
      { task: "তারকীব করো ও অর্থ লেখো", text: "بَابُ المَسْجِدِ مَفْتُوحٌ وَقَلَمُ المُعَلِّمِ جَدِيدٌ." }
    ]
  },

  // LESSON 7
  {
    id: "vol1-ch1-l7",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 7,
    lessonNumberInChapter: 7,
    title: "৭ম পাঠ: স্থানবাচক অব্যয় (যরফ) ও পারিবারিক আত্মীয়তার পরিভাষা",
    subTitle: "الدرس السابع : ظُرُوفُ الْمَكَانِ وَالقَرَابَةُ (أَمَامَ ، وَرَاءَ ، فَوْقَ ، تَحْتَ ، عِنْدَ)",
    pages: "পৃষ্ঠা ৪৪-৪৭",
    grammarRule: {
      summary: "স্থান নির্দেশক শব্দগুলোকে 'যারফে মাকান' (ظرف المكان) বলে। যেমন: أَمَامَ (সামনে), وَرَاءَ / خَلْفَ (পেছনে), فَوْقَ (উপরে), تَحْتَ (নিচে), عِنْدَ (কাছে/নিকট), بِجَانِبِ (পাশে)। যরফের পরবর্তী শব্দটি মুদাফ ইলাইহির মতো মাজরুর (জেরযুক্ত) হয়।",
      points: [
        "أَمَامَ (সামনে): أَمَامَ الْمَسْجِدِ (মসজিদের সামনে)।",
        "وَرَاءَ / خَلْفَ (পেছনে): وَرَاءَ الْبَيْتِ (বাড়ির পেছনে)।",
        "فَوْقَ (উপরে): فَوْقَ الطَّاوِلَةِ (টেবিলের উপরে)।",
        "تَحْتَ (নিচে): تَحْتَ الشَّجَرَةِ (গাছের নিচে)।",
        "আত্মীয়তার পরিভাষা: أَخٌ (ভাই), أُخْتٌ (বোন), عَمٌّ (চাচা), عَمَّةٌ (ফুফু), خَالٌ (মামা), خَالَةٌ (খালা), جَدٌّ (দাদা/নানা), جَدَّةٌ (দাদী/নানী)।"
      ]
    },
    vocabulary: [
      { arabic: "أَخٌ", bangla: "ভাই", transliteration: "Akhun", banglaPronunciation: "আখুন" },
      { arabic: "أُخْتٌ", bangla: "বোন", transliteration: "Ukhtun", banglaPronunciation: "উখতুন" },
      { arabic: "عَمٌّ", bangla: "চাচা", transliteration: "'Ammun", banglaPronunciation: "আম্মুন" },
      { arabic: "عَمَّةٌ", bangla: "ফুফু", transliteration: "'Ammatun", banglaPronunciation: "আম্মাতুন" },
      { arabic: "خَالٌ", bangla: "মামা", transliteration: "Khālun", banglaPronunciation: "খালুন" },
      { arabic: "خَالَةٌ", bangla: "খালা", transliteration: "Khālatun", banglaPronunciation: "খালাতুন" },
      { arabic: "جَدٌّ", bangla: "দাদা / নানা", transliteration: "Jaddun", banglaPronunciation: "জাদ্দুন" },
      { arabic: "جَدَّةٌ", bangla: "দাদী / নানী", transliteration: "Jaddatun", banglaPronunciation: "জাদ্দাতুন" },
      { arabic: "عِنْدَ", bangla: "কাছে / নিকট", transliteration: "'Inda", banglaPronunciation: "ইনদা" },
      { arabic: "أَمَامَ", bangla: "সামনে", transliteration: "Amāma", banglaPronunciation: "আমামা" },
      { arabic: "وَرَاءَ - خَلْفَ", bangla: "পেছনে", transliteration: "Warā'a - Khalfa", banglaPronunciation: "ওয়ারাআ - খালফা" },
      { arabic: "تَحْتَ", bangla: "নিচে", transliteration: "Tahta", banglaPronunciation: "তাহতা" },
      { arabic: "فَوْقَ", bangla: "উপরে", transliteration: "Fawqa", banglaPronunciation: "ফাওক্বা" },
      { arabic: "بِجَانِبِ", bangla: "পাশে", transliteration: "Bijānibi", banglaPronunciation: "বিজানিবি" },
      { arabic: "مَسَّاحَةٌ", bangla: "ডাস্টার", transliteration: "Massāhatun", banglaPronunciation: "মাস্সাহাতুন" },
      { arabic: "خَارِطَةٌ", bangla: "মানচিত্র", transliteration: "Khāritatun", banglaPronunciation: "খারিত্বাতুন" }
    ],
    sentences: [
      { arabic: "اَلْمُعَلِّمُ أَمَامَ السَّبُّورَةِ.", bangla: "শিক্ষক ব্ল্যাকবোর্ডের সামনে আছেন।", explanation: "যরফ 'আমামা' খবর হিসেবে ব্যবহৃত হয়েছে।" },
      { arabic: "اَلْحَدِيقَةُ وَرَاءَ الْبَيْتِ.", bangla: "বাগানটি বাড়ির পেছনে।", explanation: "স্থান নির্দেশক যরফ 'ওয়ারাআ'।" },
      { arabic: "اَلْقَلَمُ فَوْقَ الطَّاوِلَةِ وَالْحَقِيبَةُ تَحْتَ السَّرِيرِ.", bangla: "কলমটি টেবিলের উপরে এবং ব্যাগটি খাটের নিচে।", explanation: "ফাওকা ও তাহতার ব্যবহারিক প্রয়োগ।" },
      { arabic: "هٰذَا عَمِّي وَتِلْكَ عَمَّتِي.", bangla: "ইনি আমার চাচা এবং উনি আমার ফুফু।", explanation: "আত্মীয়তার সম্পর্কের সাথে যমীরের মিলন।" }
    ],
    dialogues: [
      { speaker: "তিলমীয", arabic: "أَيْنَ الْخَارِطَةُ يَا أُسْتَاذُ؟", bangla: "মানচিত্রটি কোথায় হে উস্তাদ?" },
      { speaker: "মুয়াল্লিম", arabic: "اَلْخَارِطَةُ فَوْقَ الجِدَارِ أَمَامَكَ.", bangla: "মানচিত্রটি তোমার সামনে দেয়ালের উপরে।" }
    ],
    quiz: [
      {
        question: "'টেবিলের উপরে' এর সঠিক আরবি রূপ কোনটি?",
        options: ["فَوْقَ الطَّاوِلَةِ", "تَحْتَ الطَّاوِلَةِ", "أَمَامَ الطَّاوِلَةِ", "وَرَاءَ الطَّاوِلَةِ"],
        correctIndex: 0,
        explanation: "فَوْقَ অর্থ উপরে, তাই فَوْقَ الطَّاوِلَةِ সঠিক।"
      }
    ],
    tamrinKitabi: [
      { task: "অর্থ লেখো ও বলো", text: "اَلْكِتَابُ عِنْدَ رَاشِدٍ ، وَالسَّيَّارَةُ أَمَامَ البَيْتِ." }
    ]
  },

  // LESSON 8
  {
    id: "vol1-ch1-l8",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 8,
    lessonNumberInChapter: 8,
    title: "৮ম পাঠ: হরফে জর 'ফি' (فِي) ও অবস্থানবাচক বাক্য",
    subTitle: "الدرس الثامن : حَرْفُ الْجَرِّ (فِي) وَالْجَارُّ وَالْمَجْرُورُ (فِي الْمَسْجِدِ ، فِي الْحَقِيبَةِ)",
    pages: "পৃষ্ঠা ৪৮-৫১",
    grammarRule: {
      summary: "'فِي' (ফি) একটি হরফে জর (অব্যয়), যার অর্থ 'মধ্যে' বা 'ভিতরে'। হরফে জরের পরের বিশেষ্যকে 'মাজরুর' (مجرور) বলে এবং তার শেষে জের (কাসরা) হয়। যার-মাজরুর মিলে বাক্যের খবর (শিবহু জুমলা) হয়।",
      points: [
        "فِي الْمَسْجِدِ (মসজিদে / মসজিদের ভিতরে), فِي الْحَقِيبَةِ (ব্যাগে)।",
        "যার-মাজরুর খবর: اَلْكِتَابُ فِي الْحَقِيبَةِ (বইটি ব্যাগে রয়েছে)।",
        "তাকদীম (আগে আসা): অনির্দিষ্ট মুবতাদার পূর্বে খবর আগে চলে আসে: فِي الْمَسْجِدِ رَجُلٌ (মসজিদে একজন লোক রয়েছে)।",
        "প্রশ্ন ও উত্তর: أَيْنَ الرَّجُلُ؟ هُوَ فِي الْمَسْجِدِ (লোকটি কোথায়? সে মসজিদে)।"
      ]
    },
    vocabulary: [
      { arabic: "فِي", bangla: "মধ্যে / ভিতরে", transliteration: "Fī", banglaPronunciation: "ফী" },
      { arabic: "فِي قَلْبِ الْمُسْلِمِ", bangla: "মুসলিমের অন্তরে", transliteration: "Fī Qalbil Muslimi", banglaPronunciation: "ফী ক্বলবিল মুসলিমী" },
      { arabic: "فِي الْمَدِينَةِ الْمُنَوَّرَةِ", bangla: "মদিনা মুনাওয়ারায়", transliteration: "Fil Madīnatil Munawwarati", banglaPronunciation: "ফিল মাদীনাতিল মুনাওয়ারাতি" },
      { arabic: "فِي الْمَسْجِدِ", bangla: "মসজিদে", transliteration: "Fil Masjidi", banglaPronunciation: "ফিল মাসজিদি" },
      { arabic: "فِي الْحَقِيبَةِ", bangla: "ব্যাগে", transliteration: "Fil Haqībati", banglaPronunciation: "ফিল হাক্বীবাতি" },
      { arabic: "كَوْبٌ", bangla: "একটি গ্লাস / পেয়ালা", transliteration: "Kawbun", banglaPronunciation: "কাওবুন" },
      { arabic: "مَاءٌ بَارِدٌ", bangla: "ঠান্ডা পানি", transliteration: "Mā'un Bāridun", banglaPronunciation: "মাউন বারিদুন" },
      { arabic: "قَبْرُ الرَّسُولِ", bangla: "রাসূলের রওজা / কবর", transliteration: "Qabrur Rasūli", banglaPronunciation: "ক্বাবরুর রাসূলি" }
    ],
    sentences: [
      { arabic: "فِي قَلْبِ الْمُسْلِمِ نُورٌ وَفِي قَلْبِ الْكَافِرِ ظُلْمَةٌ.", bangla: "মুসলিমের অন্তরে নূর এবং কাফেরের অন্তরে অন্ধকার।", explanation: "যার-মাজরুর খবর মুকাদ্দাম এবং নূরুন মুবতাদা মুআখ্খার।" },
      { arabic: "فِي كِتَابِ اللهِ قِصَّةٌ جَمِيلَةٌ.", bangla: "আল্লাহর কিতাবে সুন্দর কাহিনী রয়েছে।", explanation: "কিতাবুল্লাহিতে জের কারণ পূর্বে فِي হরফে জর রয়েছে।" },
      { arabic: "قَبْرُ الرَّسُولِ فِي الْمَدِينَةِ الْمُنَوَّرَةِ.", bangla: "রাসূলুল্লাহ সা.-এর রওজা মোবারক মদিনা মুনাওয়ারায় অবস্থিত।", explanation: "অবস্থান নির্দেশক যার-মাজরুর।" },
      { arabic: "ذٰلِكَ كَوْبٌ كَبِيرٌ، فِيهِ مَاءٌ بَارِدٌ.", bangla: "উহা একটি বড় গ্লাস, তাতে ঠান্ডা পানি রয়েছে।", explanation: "ফী এর সাথে যমীর যুক্ত হয়ে 'ফীহি' (তাতে) রূপ ধারণ করেছে।" }
    ],
    dialogues: [
      { speaker: "মুসাফির", arabic: "مَنْ فِي الْمَسْجِدِ؟", bangla: "মসজিদে কে রয়েছে?" },
      { speaker: "ইমাম", arabic: "فِي الْمَسْجِدِ رَجُلٌ صَالِحٌ.", bangla: "মসজিদে একজন নেককার লোক রয়েছে।" },
      { speaker: "মুসাফির", arabic: "وَأَيْنَ الْكِتَابُ وَالْقَلَمُ؟", bangla: "আর বই ও কলমটি কোথায়?" },
      { speaker: "ইমাম", arabic: "اَلْكِتَابُ وَالْقَلَمُ فِي الْحَقِيبَةِ.", bangla: "বই ও কলমটি ব্যাগে রয়েছে।" }
    ],
    quiz: [
      {
        question: "'فِي' হরফে জরের পর শব্দের শেষে কোন হরকত হয়?",
        options: ["জের (কাসরা)", "পেশ (যম্মা)", "যবর (ফাতহা)", "সাকিন"],
        correctIndex: 0,
        explanation: "হরফে জর তার পরবর্তী ইসিমকে জের (মাজরুর) প্রদান করে।"
      },
      {
        question: "'মসজিদে কে আছে?' এর সঠিক আরবি রূপ কোনটি?",
        options: ["مَنْ فِي الْمَسْجِدِ؟", "مَا فِي الْمَسْجِدِ؟", "أَيْنَ فِي الْمَسْجِدِ؟", "كَيْفَ فِي الْمَسْجِدِ؟"],
        correctIndex: 0,
        explanation: "ব্যক্তির ব্যাপারে জানতে 'مَنْ' বসে: مَنْ فِي الْمَسْجِدِ؟"
      }
    ],
    tamrinKitabi: [
      { task: "বাংলায় অনুবাদ করো", text: "أَيْنَ قَبْرُ الرَّسُولِ؟ قَبْرُهُ فِي المَدِينَةِ المُنَوَّرَةِ." },
      { task: "আরবিতে লেখো", text: "গ্লাসে ঠান্ডা পানি রয়েছে এবং ব্যাগে একটি নতুন কলম রয়েছে।" }
    ]
  },

  // LESSON 9
  {
    id: "vol1-ch1-l9",
    volumeId: 1,
    chapterId: "vol1-ch1",
    chapterNumber: 1,
    chapterTitle: "১ম অধ্যায় (الباب الأول): আসমাউশ শারাহ ও মৌলিক শব্দভাণ্ডার",
    lessonNumber: 9,
    lessonNumberInChapter: 9,
    title: "৯ম পাঠ: নগর ও প্রকৃতি পরিচিতি, গতি ও ১ম অধ্যায়ের সমাপ্তি",
    subTitle: "الدرس التاسع : الْمَدِينَةُ وَالقَرْيَةُ وَخَاتِمَةُ البَابِ الأَوَّلِ (قَرْيَةٌ ، مَدِينَةٌ ، مَطَارٌ ، سَرِيعٌ ، بَطِيءٌ)",
    pages: "পৃষ্ঠা ৫২-৫৬",
    grammarRule: {
      summary: "১ম অধ্যায়ের সমাপ্তি পাঠ। এখানে নগর, গ্রাম, বিমানবন্দর ও বাহনের দ্রুতি-ধীরতা বিষয়ক শব্দভাণ্ডার এবং পূর্ববর্তী সকল ব্যাকরণিক উপাদানের (ইসমুল ইশারা, সিফাত-মাওসূফ, মুরাক্কাবে ইদাফী, যমীর, যরফ ও হরফে জর) সমন্বয়ে দীর্ঘ অনুচ্ছেদ ও যৌগিক বাক্য গঠনের তামরীন সম্পন্ন হয়।",
      points: [
        "নগর ও প্রকৃতি: قَرْيَةٌ (গ্রাম), مَدِينَةٌ (শহর), عَاصِمَةٌ (রাজধানী), مَطَارٌ (বিমানবন্দর), مَنْظَرٌ (দৃশ্য)।",
        "গতি বিষয়ক সিফাত: سَرِيعٌ (দ্রুতগামী) / بَطِيءٌ (ধীরগামী)।",
        "পারিবারিক ভূমিকা: زَوْجٌ (স্বামী), زَوْجَةٌ (স্ত্রী), وَالِدٌ (পিতা)।",
        "১ম অধ্যায়ের সকল কায়দার সামগ্রিক সম্মিলন ও সমাপ্তি।"
      ]
    },
    vocabulary: [
      { arabic: "قَرْيَةٌ", bangla: "একটি গ্রাম", transliteration: "Qaryatun", banglaPronunciation: "ক্বারইয়াতুন" },
      { arabic: "عَاصِمَةٌ", bangla: "রাজধানী", transliteration: "'Āsimatun", banglaPronunciation: "আ'সিমাতুন" },
      { arabic: "مَدِينَةٌ", bangla: "একটি শহর", transliteration: "Madīnatun", banglaPronunciation: "মাদীনাতুন" },
      { arabic: "مَطَارٌ", bangla: "একটি বিমানবন্দর", transliteration: "Matārun", banglaPronunciation: "মাত্বারুন" },
      { arabic: "مَنْظَرٌ", bangla: "একটি দৃশ্য", transliteration: "Manzarun", banglaPronunciation: "মানযারুন" },
      { arabic: "طَائِرَةٌ", bangla: "একটি উড়োজাহাজ / বিমান", transliteration: "Tā'iratun", banglaPronunciation: "ত্বায়িরাতুন" },
      { arabic: "سَرِيعٌ / سَرِيعَةٌ", bangla: "দ্রুতগামী", transliteration: "Sarī'un / Sarī'atun", banglaPronunciation: "সারী'উন / সারী'আতুন" },
      { arabic: "بَطِيءٌ / بَطِيئَةٌ", bangla: "ধীরগামী", transliteration: "Batī'un / Batī'atun", banglaPronunciation: "বাত্বীউন / বাত্বীআতুন" },
      { arabic: "زَوْجٌ", bangla: "স্বামী", transliteration: "Zawjun", banglaPronunciation: "যাওজুন" },
      { arabic: "زَوْجَةٌ", bangla: "স্ত্রী", transliteration: "Zawjatun", banglaPronunciation: "যাওজাতুন" },
      { arabic: "وَرْدَةٌ", bangla: "একটি গোলাপ", transliteration: "Wardatun", banglaPronunciation: "ওয়ারদাতুন" },
      { arabic: "وَالِدٌ", bangla: "পিতা / বাবা", transliteration: "Wālidun", banglaPronunciation: "ওয়ালিদুন" }
    ],
    sentences: [
      { arabic: "هٰذِهِ قَرْيَةٌ جَمِيلَةٌ، مَنْظَرُهَا رَائِعٌ جِدًّا.", bangla: "এটি একটি সুন্দর গ্রাম, এর দৃশ্য অত্যন্ত মনোরম।", explanation: "সিফাত ও যমীর সম্বলিত সমন্বিত বাক্য।" },
      { arabic: "اَلطَّائِرَةُ سَرِيعَةٌ جِدًّا وَالْقِطَارُ بَطِيءٌ.", bangla: "উড়োজাহাজটি অত্যন্ত দ্রুতগামী এবং ট্রেনটি ধীরগতির।", explanation: "দ্রুত ও ধীর সিফাতের তুলনামূলক বাক্য।" },
      { arabic: "اَلْعَاصِمَةُ مَدِينَةٌ كَبِيرَةٌ فِيهَا مَطَارٌ وَاسِعٌ.", bangla: "রাজধানী একটি বড় শহর যাতে রয়েছে একটি প্রশস্ত বিমানবন্দর।", explanation: "১ম অধ্যায়ের সামগ্রিক বাক্য গঠনের উৎকৃষ্ট নিদর্শন।" },
      { arabic: "هٰذَا زَوْجٌ صَالِحٌ وَهٰذِهِ زَوْجَةٌ صَالِحَةٌ.", bangla: "ইনি একজন নেককার স্বামী এবং উনি একজন নেককার স্ত্রী।", explanation: "মুযাক্কার ও মুয়ান্নাসের পরিপূর্ণ সমাপ্তি।" }
    ],
    dialogues: [
      { speaker: "পর্যটক", arabic: "مَا هٰذِهِ الْمَدِينَةُ؟", bangla: "এই শহরটি কী?" },
      { speaker: "নাগরিক", arabic: "هٰذِهِ عَاصِمَةُ البِلَادِ، فِيهَا مَطَارٌ كَبِيرٌ وَسُوقٌ وَاسِعٌ.", bangla: "এটি দেশের রাজধানী, এতে রয়েছে একটি বড় বিমানবন্দর ও প্রশস্ত বাজার।" }
    ],
    quiz: [
      {
        question: "'সুপারফাস্ট / দ্রুতগামী' নির্দেশক আরবি সিফাত কোনটি?",
        options: ["سَرِيعٌ", "بَطِيءٌ", "وَاسِعٌ", "ضَيِّقٌ"],
        correctIndex: 0,
        explanation: "سَرِيعٌ অর্থ দ্রুতগামী এবং بَطِيءٌ অর্থ ধীরগামী।"
      },
      {
        question: "'একটি সুন্দর দৃশ্য' এর আরবি রূপ কী?",
        options: ["مَنْظَرٌ جَمِيلٌ", "مَنْظَرٌ جَمِيلَةٌ", "جَمِيلٌ مَنْظَرٌ", "مَنْظَرَةٌ جَمِيلٌ"],
        correctIndex: 0,
        explanation: "مَنْظَرٌ পুংলিঙ্গ হওয়ায় সিফাতও جَمِيلٌ হবে।"
      }
    ],
    tamrinKitabi: [
      { task: "১ম অধ্যায়ের সমাপ্তি অনুচ্ছেদ", text: "هٰذِهِ مَدِينَةٌ جَمِيلَةٌ فِيهَا مَسْجِدٌ كَبِيرٌ وَسُوقٌ وَاسِعٌ وَمَطَارٌ جَدِيدٌ." }
    ]
  }
];

// Replace the old Chapter 1 lessons in lessonsData.lessons with all 9 authentic lessons
const remainingLessons = lessonsData.lessons.filter(l => l.chapterId !== 'vol1-ch1');
lessonsData.lessons = [...ch1Lessons, ...remainingLessons];

// Write updated lessons.json
fs.writeFileSync(lessonsPath, JSON.stringify(lessonsData, null, 2), 'utf8');
console.log('Successfully updated lessons.json with 9 authentic lessons for Volume 1 Chapter 1!');

// 2. Also enhance vocabulary.json phonetics for ALL 1343 items
// Phonetic helper for arabic to bangla un-waqfed pronunciation
function getAccurateBanglaPronunciation(arabic, transliteration) {
  if (!transliteration) return '';
  let p = transliteration.trim();

  // Common phrase overrides
  const map = {
    'Kitabun': 'কিতাবুন',
    'Qalamun': 'কলমুন',
    'Masjidun': 'মাসজিদুন',
    'Baytun': 'বাইতুন',
    'Babun': 'বাবুন',
    'Jidarun': 'জিদারুন',
    'Kursiyyun': 'কুরসিইয়ুন',
    'Kursiyy': 'কুরসিইয়ুন',
    'Sarirun': 'সারীরুন',
    'Sareerun': 'সারীরুন',
    'Saa\'atun': 'সাআ\'তুন',
    'Madrasatun': 'মাদরাসাতুন',
    'Haqibatun': 'হাক্বীবাতুন',
    'Haqeebatun': 'হাক্বীবাতুন',
    'Ghurfatun': 'গুরফাতুন',
    'Nafidhatun': 'নাফিযাতুন',
    'Tawilatun': 'ত্বাবিলাতুন',
    'Mirwahatun': 'মিরওয়াহাতুন',
    'Sabburatun': 'সাব্বূরাতুন',
    'Miftahun': 'মিফতাহুন',
    'Sundooqun': 'সুন্দূকুন',
    'Sundūqun': 'সুন্দূকুন',
    'Sayyaratun': 'সাইয়্যারাতুন',
    'Darrajatun': 'দাররাজাতুন',
    'Mizallatun': 'মিযাল্লাতুন',
    'Nazzaratun': 'নাযযারাতুন',
    'Misbahun': 'মিসবাহুন',
    'Jadeedun': 'জাদীদুন',
    'Jadeedatun': 'জাদীদাতুন',
    'Qadeemun': 'ক্বাদীমুন',
    'Qadeematun': 'ক্বাদীমাতুন',
    'Jameelun': 'জামীলুন',
    'Jameelatun': 'জামীলাতুন',
    'Kabeerun': 'কবীরুন',
    'Kabeeratun': 'কবীরাতুন',
    'Sagheerun': 'সাগীরুন',
    'Sagheeratun': 'সাগীরাতুন',
    'Jayyidun': 'জাইয়্যিদুন',
    'Jayyidatun': 'জাইয়্যিদাতুন',
    'Nazifun': 'নাযীফুন',
    'Wasikhun': 'ওয়াসিখুন',
    'Waladun': 'ওয়ালাদুন',
    'Bintun': 'বিনতুন',
    'Rajulun': 'রাজুলুন',
    'Imra\'atun': 'ইমরাআতুন',
    'Tilmeedhun': 'তিলমীযুন',
    'Tilmeedhatun': 'তিলমীযাতুন',
    'Mu\'allimun': 'মুয়াল্লিমুন',
    'Mu\'allimatun': 'মুয়াল্লিমাতুন',
    'Māhirun': 'মাহিরুন',
    'Mujtahidun': 'মুজতাহিদুন',
    'Maftoohun': 'মাফতূহুন',
    'Mughlaqun': 'মুগলাক্বুন',
    'Wasi\'un': "ওয়াসি'উন",
    'Dayyiqun': 'দাইয়্যিক্বুন',
    'Abun': 'আবুন',
    'Ummun': 'উম্মুন',
    'Walidun': 'ওয়ালিদুন',
    'Walidatun': 'ওয়ালিদাতুন',
    'Tajirun': 'তাজিরুন',
    'Kitabi': 'কিতাবী',
    'Kitabuka': 'কিতাবুকা',
    'Kitabuki': 'কিতাবুকি',
    'Kitabuhu': 'কিতাবুহু',
    'Kitabuha': 'কিতাবুহা',
    'Kitabuna': 'কিতাবুনা',
    'Kitabukum': 'কিতাবুকুম',
    'Noorun': 'নূরুন',
    'Zulmatun': 'যুলমাতুন',
    'Tareequn': 'ত্বারীক্বুন',
    'Qissatun': 'ক্বিস্সাতুন',
    'Sooqun': 'সূক্বুন',
    'Kitabullah': 'কিতাবুল্লাহ',
    'Baytullah': 'বাইতুল্লাহ',
    'Rasoolullah': 'রাসূলুল্লাহ',
    'Akhun': 'আখুন',
    'Ukhtun': 'উখতুন',
    'Ammun': 'আম্মুন',
    'Ammatun': 'আম্মাতুন',
    'Khalun': 'খালুন',
    'Khalatun': 'খালাতুন',
    'Jaddun': 'জাদ্দুন',
    'Jaddatun': 'জাদ্দাতুন',
    'Inda': 'ইনদা',
    'Amama': 'আমামা',
    'Khalfa': 'খালফা',
    'Tahta': 'তাহতা',
    'Fawqa': 'ফাওক্বা',
    'Qaryatun': 'ক্বারইয়াতুন',
    'Madeenatun': 'মাদীনাতুন',
    'Matārun': 'মাত্বারুন',
    'Manzarun': 'মানযারুন',
    'Tā\'iratun': 'ত্বায়িরাতুন',
    'Sariy\'un': "সারী'উন",
    'Batee\'un': 'বাত্বীউন',
    'Zawjun': 'যাওজুন',
    'Zawjatun': 'যাওজাতুন',
    'Wardatun': 'ওয়ারদাতুন'
  };

  if (map[p]) return map[p];

  // Algorithmic phonetic transliteration from English to Bengali
  let b = p;
  b = b.replace(/oo/gi, 'ূ').replace(/ee/gi, 'ী').replace(/aa/gi, 'া');
  b = b.replace(/ā/gi, 'া').replace(/ī/gi, 'ী').replace(/ū/gi, 'ূ');
  b = b.replace(/th/gi, 'ছ').replace(/dh/gi, 'য').replace(/kh/gi, 'খ');
  b = b.replace(/gh/gi, 'গ').replace(/sh/gi, 'শ').replace(/q/gi, 'ক্ব');
  b = b.replace(/b/gi, 'ব').replace(/t/gi, 'ত').replace(/j/gi, 'জ');
  b = b.replace(/h/gi, 'হ').replace(/d/gi, 'দ').replace(/r/gi, 'র');
  b = b.replace(/z/gi, 'য').replace(/s/gi, 'স').replace(/f/gi, 'ফ');
  b = b.replace(/k/gi, 'ক').replace(/l/gi, 'ল').replace(/m/gi, 'ম');
  b = b.replace(/n/gi, 'ন').replace(/w/gi, 'ওয়').replace(/y/gi, 'ইয়');
  b = b.replace(/un$/gi, 'ুন').replace(/an$/gi, 'ান').replace(/in$/gi, 'িন');
  return b;
}

let fixedVocabCount = 0;
vocabData.forEach(w => {
  if (!w.banglaPronunciation || w.banglaPronunciation === 'undefined' || w.banglaPronunciation.trim() === '') {
    w.banglaPronunciation = getAccurateBanglaPronunciation(w.arabic, w.transliteration);
    fixedVocabCount++;
  }
});

fs.writeFileSync(vocabPath, JSON.stringify(vocabData, null, 2), 'utf8');
console.log(`Successfully updated vocabulary.json! Fixed ${fixedVocabCount} pronunciations.`);
