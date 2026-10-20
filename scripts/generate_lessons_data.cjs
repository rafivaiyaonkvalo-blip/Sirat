const fs = require('fs');
const path = require('path');

const lessonsData = {
  levels: [
    {
      id: 1,
      volume: "১ম খণ্ড",
      title: "১ম খণ্ড: বাক্যগঠন ও বুনিয়াদ",
      subTitle: "ইসমুল ইশারা, সিফাত-মাওসূফ, যমীর, হরফে জর ও ইদাফাত",
      totalLessons: 10,
      active: true,
      description: "মাওলানা আবু তাহের মেসবাহ (দা.বা.) রচিত এসো আরবী শিখি কিতাবের ১ম খণ্ডের বুনিয়াদি পাঠমালা।"
    },
    {
      id: 2,
      volume: "২য় খণ্ড",
      title: "২য় খণ্ড: ক্রিয়াপদ ও বাবের ব্যবহার",
      subTitle: "ফে'ল মাদী, ফে'ল মুদারে, আমর, নাহি ও ব্যবহারিক জুমলা ফি'লিয়্যা",
      totalLessons: 12,
      active: false,
      description: "বিভিন্ন বাবের ফে'ল ও ক্রিয়াভিত্তিক বাক্যগঠন (পরবর্তী পর্বে উন্মুক্ত হবে)।"
    },
    {
      id: 3,
      volume: "৩য় খণ্ড",
      title: "৩য় খণ্ড: উচ্চতর সাহিত্য ও কুরআন-হাদিস",
      subTitle: "দ্বিবচন-বহুবচন, বালাগাত ও আরবি কথোপকথন",
      totalLessons: 10,
      active: false,
      description: "কুরআন-সুন্নাহর ভাষাশৈলী ও উচ্চতর আরবি সাহিত্য (উচ্চতর পর্বে উন্মুক্ত হবে)।"
    }
  ],
  lessons: [
    // LESSON 1
    {
      id: "vol1-lesson1",
      volumeId: 1,
      lessonNumber: 1,
      title: "১ম পাঠ: ইসমুল ইশারা (পুংলিঙ্গ ও স্ত্রীলিঙ্গ)",
      subTitle: "هٰذَا / هٰذِهِ (ইহা) এবং ذٰلِكَ / تِلْكَ (উহা) এর পরিচয়",
      pages: "মূল কিতাবের পৃষ্ঠা ১ - ৫",
      grammarRule: {
        title: "ইসমুল ইশারার কায়েদা (নিয়ম)",
        summary: "আরবি ভাষায় কাছের বস্তু নির্দেশ করতে هٰذَا (পুংলিঙ্গ) ও هٰذِهِ (স্ত্রীলিঙ্গ) এবং দূরের বস্তু নির্দেশ করতে ذٰلِكَ (পুংলিঙ্গ) ও تِلْكَ (স্ত্রীলিঙ্গ) ব্যবহৃত হয়।",
        detail: "যেসব শব্দের শেষে গোল তা (ة) থাকে, সেগুলো সাধারণ নিয়মে স্ত্রীলিঙ্গ (মুয়ান্নাস)। তাই তাদের পূর্বে هٰذِهِ বা تِلْكَ বসে। যেমন: هٰذِهِ سَاعَةٌ (ইহা একটি ঘড়ি)। গোল তা না থাকলে পুংলিঙ্গ (মুযাক্কার) হিসেবে هٰذَا বা ذٰلِكَ বসে। যেমন: هٰذَا كِتَابٌ (ইহা একটি বই)।"
      },
      vocabulary: [
        { arabic: "كِتَابٌ", bangla: "একটি বই", gender: "masculine", type: "বিশেষ্য", icon: "BookOpen", audioText: "كِتَابٌ" },
        { arabic: "قَلَمٌ", bangla: "একটি কলম", gender: "masculine", type: "বিশেষ্য", icon: "PenTool", audioText: "قَلَمٌ" },
        { arabic: "مَسْجِدٌ", bangla: "একটি মসজিদ", gender: "masculine", type: "বিশেষ্য", icon: "Landmark", audioText: "مَسْجِدٌ" },
        { arabic: "بَيْتٌ", bangla: "একটি ঘর / বাড়ি", gender: "masculine", type: "বিশেষ্য", icon: "Home", audioText: "بَيْتٌ" },
        { arabic: "بَابٌ", bangla: "একটি দরজা", gender: "masculine", type: "বিশেষ্য", icon: "DoorOpen", audioText: "بَابٌ" },
        { arabic: "جِدَارٌ", bangla: "একটি দেয়াল", gender: "masculine", type: "বিশেষ্য", icon: "Square", audioText: "جِدَارٌ" },
        { arabic: "كُرْسِيٌّ", bangla: "একটি চেয়ার", gender: "masculine", type: "বিশেষ্য", icon: "Armchair", audioText: "كُرْسِيٌّ" },
        { arabic: "سَرِيرٌ", bangla: "একটি খাট", gender: "masculine", type: "বিশেষ্য", icon: "Bed", audioText: "سَرِيرٌ" },
        { arabic: "سَاعَةٌ", bangla: "একটি ঘড়ি", gender: "feminine", type: "বিশেষ্য", icon: "Clock", audioText: "سَاعَةٌ" },
        { arabic: "مَدْرَسَةٌ", bangla: "একটি মাদরাসা", gender: "feminine", type: "বিশেষ্য", icon: "GraduationCap", audioText: "مَدْرَسَةٌ" },
        { arabic: "حَقِيبَةٌ", bangla: "একটি ব্যাগ", gender: "feminine", type: "বিশেষ্য", icon: "Briefcase", audioText: "حَقِيبَةٌ" },
        { arabic: "غُرْفَةٌ", bangla: "একটি কামরা / কক্ষ", gender: "feminine", type: "বিশেষ্য", icon: "Maximize", audioText: "غُرْفَةٌ" },
        { arabic: "نَافِذَةٌ", bangla: "একটি জানালা", gender: "feminine", type: "বিশেষ্য", icon: "LayoutGrid", audioText: "نَافِذَةٌ" },
        { arabic: "طَاوِلَةٌ", bangla: "একটি টেবিল", gender: "feminine", type: "বিশেষ্য", icon: "Columns", audioText: "طَاوِلَةٌ" },
        { arabic: "مِرْوَحَةٌ", bangla: "একটি পাখা", gender: "feminine", type: "বিশেষ্য", icon: "Fan", audioText: "مِرْوَحَةٌ" },
        { arabic: "سَبُّورَةٌ", bangla: "একটি ব্ল্যাকবোর্ড", gender: "feminine", type: "বিশেষ্য", icon: "Tv", audioText: "سَبُّورَةٌ" }
      ],
      sentences: [
        { arabic: "هٰذَا كِتَابٌ", bangla: "ইহা একটি বই।", grammarNote: "هٰذَا মুবতাদা (পুংলিঙ্গ নিকটবর্তী) + كِتَابٌ খবর।" },
        { arabic: "ذٰلِكَ قَلَمٌ", bangla: "উহা একটি কলম।", grammarNote: "ذٰلِكَ মুবতাদা (পুংলিঙ্গ দূরবর্তী) + قَلَمٌ খবর।" },
        { arabic: "هٰذِهِ سَاعَةٌ", bangla: "ইহা একটি ঘড়ি।", grammarNote: "هٰذِهِ স্ত্রীলিঙ্গ ইশারা কারণ سَاعَةٌ শব্দে গোল তা (ة) রয়েছে।" },
        { arabic: "تِلْكَ مَدْرَسَةٌ", bangla: "উহা একটি মাদরাসা।", grammarNote: "تِلْكَ দূরবর্তী স্ত্রীলিঙ্গ ইশারা।" },
        { arabic: "هٰذَا مَسْجِدٌ وَذٰلِكَ بَيْتٌ", bangla: "ইহা একটি মসজিদ এবং উহা একটি ঘর।", grammarNote: "وَ হরফে আতফ দ্বারা দুটি বাক্য যুক্ত হয়েছে।" },
        { arabic: "هٰذِهِ حَقِيبَةٌ وَتِلْكَ طَاوِلَةٌ", bangla: "ইহা একটি ব্যাগ এবং উহা একটি টেবিল।", grammarNote: "উভয় অংশেই স্ত্রীলিঙ্গ বিশেষ্য।" }
      ],
      dialogues: [
        {
          question: { arabic: "مَا هٰذَا؟", bangla: "ইহা কী?" },
          answer: { arabic: "هٰذَا كِتَابٌ.", bangla: "ইহা একটি বই।" }
        },
        {
          question: { arabic: "مَا ذٰلِكَ؟", bangla: "উহা কী?" },
          answer: { arabic: "ذٰلِكَ مَسْجِدٌ.", bangla: "উহা একটি মসজিদ।" }
        },
        {
          question: { arabic: "مَا هٰذِهِ؟", bangla: "ইহা কী? (স্ত্রীলিঙ্গ বস্তুর ক্ষেত্রে)" },
          answer: { arabic: "هٰذِهِ سَاعَةٌ.", bangla: "ইহা একটি ঘড়ি।" }
        },
        {
          question: { arabic: "مَا تِلْكَ؟", bangla: "উহা কী? (স্ত্রীলিঙ্গ বস্তুর ক্ষেত্রে)" },
          answer: { arabic: "تِلْكَ مَدْرَسَةٌ.", bangla: "উহা একটি মাদরাসা।" }
        }
      ],
      quiz: [
        {
          id: "q1_1",
          type: "mcq",
          question: "নিচের কোন বাক্যটি ব্যাকরণগতভাবে সঠিক?",
          options: ["هٰذَا سَاعَةٌ", "هٰذِهِ سَاعَةٌ", "ذٰلِكَ مَدْرَسَةٌ", "تِلْكَ كِتَابٌ"],
          correctAnswer: 1,
          explanation: "سَاعَةٌ শব্দে গোল তা (ة) থাকায় এটি স্ত্রীলিঙ্গ। তাই এর পূর্বে স্ত্রীলিঙ্গ ইসমুল ইশারা هٰذِهِ বসবে।"
        },
        {
          id: "q1_2",
          type: "fill_blank",
          sentenceBefore: "",
          blankTarget: "ذٰلِكَ",
          sentenceAfter: " مَسْجِدٌ",
          meaning: "উহা একটি মসজিদ। (দূরের পুংলিঙ্গ বস্তু)",
          options: ["هٰذِهِ", "تِلْكَ", "ذٰلِكَ", "هٰذَا"],
          correctAnswer: 2,
          explanation: "مَسْجِدٌ পুংলিঙ্গ এবং দূরের বস্তু নির্দেশ করায় ذٰلِكَ ব্যবহৃত হবে।"
        },
        {
          id: "q1_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সঠিক ক্রমে সাজিয়ে 'উহা একটি মাদরাসা' বাক্যটি তৈরি করুন:",
          words: ["مَدْرَسَةٌ", "تِلْكَ"],
          correctOrder: ["تِلْكَ", "مَدْرَسَةٌ"],
          meaning: "উহা একটি মাদরাসা।",
          explanation: "প্রথমে ইসমুল ইশারা (تِلْكَ) এবং পরে খবর বিশেষ্য (مَدْرَسَةٌ) বসে।"
        },
        {
          id: "q1_4",
          type: "grammar_tarkib",
          sentence: "هٰذِهِ حَقِيبَةٌ",
          question: "এই বাক্যে 'هٰذِهِ' শব্দটি ব্যাকরণগতভাবে কী?",
          options: ["ইসমুল ইশারা (স্ত্রীলিঙ্গ - মুবতাদা)", "সিফাত (গুণ)", "মুদাফ ইলাইহি", "হরফে জর"],
          correctAnswer: 0,
          explanation: "هٰذِهِ হলো নিকটের স্ত্রীলিঙ্গ নির্দেশক ইসমুল ইশারা, যা এই বাক্যে মুবতাদা হিসেবে ব্যবহৃত হয়েছে।"
        }
      ]
    },

    // LESSON 2
    {
      id: "vol1-lesson2",
      volumeId: 1,
      lessonNumber: 2,
      title: "২য় পাঠ: সিফাত-মাওসূফ (গুণ ও গুণান্বিত বিশেষ্য)",
      subTitle: "كِتَابٌ جَدِيدٌ / سَاعَةٌ جَمِيلَةٌ এর গঠন ও মিল",
      pages: "মূল কিতাবের পৃষ্ঠা ৬ - ১২",
      grammarRule: {
        title: "মুরাক্কাবে তাওসীফীর নিয়ম",
        summary: "আরবিতে বিশেষণ (সিফাত) বিশেষ্যের (মাওসূফ) পরে আসে এবং লিঙ্গ ও বচনে মাওসূফকে পুরোপুরি অনুসরণ করে।",
        detail: "মাওসূফ পুংলিঙ্গ হলে সিফাত পুংলিঙ্গ হবে (যেমন: كِتَابٌ جَدِيدٌ - একটি নতুন বই)। মাওসূফ স্ত্রীলিঙ্গ হলে সিফাতেও গোল তা (ة) যুক্ত হবে (যেমন: سَاعَةٌ جَمِيلَةٌ - একটি সুন্দর ঘড়ি)। বাংলায় অনুবাদের সময় সিফাত আগে আসে (নতুন বই), কিন্তু আরবিতে মাওসূফ আগে আসে (كِتَابٌ) ও সিফাত পরে আসে (جَدِيدٌ)।"
      },
      vocabulary: [
        { arabic: "جَدِيدٌ", bangla: "নতুন (পুং)", gender: "masculine", type: "সিফাত", icon: "Sparkles", audioText: "جَدِيدٌ" },
        { arabic: "جَدِيدَةٌ", bangla: "নতুন (স্ত্রী)", gender: "feminine", type: "সিফাত", icon: "Sparkles", audioText: "جَدِيدَةٌ" },
        { arabic: "قَدِيمٌ", bangla: "পুরাতন (পুং)", gender: "masculine", type: "সিফাত", icon: "History", audioText: "قَدِيمٌ" },
        { arabic: "قَدِيمَةٌ", bangla: "পুরাতন (স্ত্রী)", gender: "feminine", type: "সিফাত", icon: "History", audioText: "قَدِيمَةٌ" },
        { arabic: "جَمِيلٌ", bangla: "সুন্দর (পুং)", gender: "masculine", type: "সিফাত", icon: "Sun", audioText: "جَمِيلٌ" },
        { arabic: "جَمِيلَةٌ", bangla: "সুন্দর (স্ত্রী)", gender: "feminine", type: "সিফাত", icon: "Flower2", audioText: "جَمِيلَةٌ" },
        { arabic: "قَبِيحٌ", bangla: "কুৎসিত / অসৌন্দর্য (পুং)", gender: "masculine", type: "সিফাত", icon: "AlertCircle", audioText: "قَبِيحٌ" },
        { arabic: "কَبِيرٌ", bangla: "বড় (পুং)", gender: "masculine", type: "সিফাত", icon: "Maximize2", audioText: "كَبِيرٌ" },
        { arabic: "كَبِيرَةٌ", bangla: "বড় (স্ত্রী)", gender: "feminine", type: "সিফাত", icon: "Maximize2", audioText: "كَبِيرَةٌ" },
        { arabic: "صَغِيرٌ", bangla: "ছোট (পুং)", gender: "masculine", type: "সিফাত", icon: "Minimize2", audioText: "صَغِيرٌ" },
        { arabic: "صَغِيرَةٌ", bangla: "ছোট (স্ত্রী)", gender: "feminine", type: "সিফাত", icon: "Minimize2", audioText: "صَغِيرَةٌ" },
        { arabic: "جَيِّدٌ", bangla: "উত্তম / ভালো (পুং)", gender: "masculine", type: "সিফাত", icon: "CheckCircle2", audioText: "جَيِّدٌ" },
        { arabic: "جَيِّدَةٌ", bangla: "উত্তম / ভালো (স্ত্রী)", gender: "feminine", type: "সিফাত", icon: "CheckCircle2", audioText: "جَيِّدَةٌ" },
        { arabic: "نَظِيفٌ", bangla: "পরিষ্কার-পরিচ্ছন্ন", gender: "masculine", type: "সিফাত", icon: "Sparkles", audioText: "نَظِيفٌ" }
      ],
      sentences: [
        { arabic: "هٰذَا كِتَابٌ جَدِيدٌ", bangla: "ইহা একটি নতুন বই।", grammarNote: "كِتَابٌ (মাওসূফ পুং) + جَدِيدٌ (সিফাত পুং)।" },
        { arabic: "هٰذِهِ سَاعَةٌ جَمِيلَةٌ", bangla: "ইহা একটি সুন্দর ঘড়ি।", grammarNote: "سَاعَةٌ স্ত্রীলিঙ্গ হওয়ায় সিফাত جَمِيلَةٌ এও গোল তা এসেছে।" },
        { arabic: "ذٰلِكَ مَسْجِدٌ كَبِيرٌ", bangla: "উহা একটি বড় মসজিদ।", grammarNote: "مَسْجِدٌ পুংলিঙ্গ মাওসূফ + كَبِيرٌ পুংলিঙ্গ সিফাত।" },
        { arabic: "تِلْكَ مَدْرَسَةٌ صَغِيرَةٌ", bangla: "উহা একটি ছোট মাদরাসা।", grammarNote: "تِلْكَ দূরবর্তী স্ত্রীলিঙ্গ + مَدْرَسَةٌ صَغِيرَةٌ স্ত্রীলিঙ্গ সিফাত-মাওসূফ।" },
        { arabic: "هٰذَا قَلَمٌ جَيِّدٌ", bangla: "ইহা একটি ভালো কলম।", grammarNote: "قَلَمٌ (মাওসূফ) + جَيِّدٌ (সিফাত)।" },
        { arabic: "هٰذِهِ حَقِيبَةٌ نَظِيفَةٌ", bangla: "ইহা একটি পরিচ্ছন্ন ব্যাগ।", grammarNote: "حَقِيبَةٌ (মাওসূফ স্ত্রী) + نَظِيفَةٌ (সিফাত স্ত্রী)।" }
      ],
      dialogues: [
        {
          question: { arabic: "كَيْفَ هٰذَا الْكِتَابُ؟", bangla: "এই বইটি কেমন?" },
          answer: { arabic: "هٰذَا كِتَابٌ جَدِيدٌ وَجَمِيلٌ.", bangla: "ইহা একটি নতুন ও সুন্দর বই।" }
        },
        {
          question: { arabic: "كَيْفَ تِلْكَ الْمَدْرَسَةُ؟", bangla: "ওই মাদরাসাটি কেমন?" },
          answer: { arabic: "تِلْكَ مَدْرَسَةٌ كَبِيرَةٌ.", bangla: "উহা একটি বড় মাদরাসা।" }
        }
      ],
      quiz: [
        {
          id: "q2_1",
          type: "mcq",
          question: "'একটি সুন্দর ঘড়ি' এর সঠিক আরবি রূপ কোনটি?",
          options: ["سَاعَةٌ جَمِيلٌ", "سَاعَةٌ جَمِيلَةٌ", "جَمِيلَةٌ سَاعَةٌ", "سَاعَةٌ كَبِيرٌ"],
          correctAnswer: 1,
          explanation: "আরবিতে মাওসূফ আগে আসে (سَاعَةٌ) এবং মাওসূফ স্ত্রীলিঙ্গ হওয়ায় সিফাতও গোল তা যুক্ত হয়ে স্ত্রীলিঙ্গ (جَمِيلَةٌ) হবে।"
        },
        {
          id: "q2_2",
          type: "fill_blank",
          sentenceBefore: "هٰذَا كِتَابٌ ",
          blankTarget: "جَدِيدٌ",
          sentenceAfter: "",
          meaning: "ইহা একটি নতুন বই।",
          options: ["جَدِيدَةٌ", "جَدِيدٌ", "كَبِيرَةٌ", "جَمِيلَةٌ"],
          correctAnswer: 1,
          explanation: "كِتَابٌ পুংলিঙ্গ হওয়ায় সিফাতও পুংলিঙ্গ রূপ جَدِيدٌ হতে হবে।"
        },
        {
          id: "q2_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'ইহা একটি সুন্দর ঘড়ি' বাক্যটি তৈরি করুন:",
          words: ["جَمِيلَةٌ", "سَاعَةٌ", "هٰذِهِ"],
          correctOrder: ["هٰذِهِ", "سَاعَةٌ", "جَمِيلَةٌ"],
          meaning: "ইহা একটি সুন্দর ঘড়ি।",
          explanation: "প্রথমে ইশারা (هٰذِهِ), এরপর মাওসূফ (سَاعَةٌ) এবং শেষে সিফাত (جَمِيلَةٌ) বসে।"
        },
        {
          id: "q2_4",
          type: "grammar_tarkib",
          sentence: "ذٰلِكَ مَسْجِدٌ كَبِيرٌ",
          question: "এই বাক্যে 'كَبِيرٌ' শব্দের ব্যাকরণিক পদমর্যাদা কী?",
          options: ["সিফাত (গুণবাচক বিশেষণ)", "মাওসূফ (গুণান্বিত বিশেষ্য)", "মুবতাদা", "হরফে জর"],
          correctAnswer: 0,
          explanation: "كَبِيرٌ হলো সিফাত (বিশেষণ), যা مَسْجِدٌ শব্দটির বড় হওয়ার গুণ বর্ণনা করছে।"
        }
      ]
    },

    // LESSON 3
    {
      id: "vol1-lesson3",
      volumeId: 1,
      lessonNumber: 3,
      title: "৩য় পাঠ: প্রশ্নবোধক অব্যয় ও উত্তরদান",
      subTitle: "مَا (কী?), مَنْ (কে?) এবং هَلْ (হ্যাঁ/না প্রশ্ন) এর ব্যবহার",
      pages: "মূল কিতাবের পৃষ্ঠা ১৩ - ১৮",
      grammarRule: {
        title: "প্রশ্নবোধক শব্দের ব্যবহার বিধি",
        summary: "অচেতন বস্তুর ব্যাপারে প্রশ্ন করতে مَا (কী), বুদ্ধিমান/মানুষের ব্যাপারে مَنْ (কে) এবং হ্যাঁ/না উত্তরের জন্য هَلْ ব্যবহৃত হয়।",
        detail: "১. বস্তু ও প্রাণীর জন্য: مَا هٰذَا؟ (ইহা কী?)। ২. মানবজাতির জন্য: مَنْ هٰذَا؟ (ইনি কে?)। ৩. সত্যতা যাচাইয়ের জন্য: هَلْ هٰذَا قَلَمٌ؟ (ইহা কি একটি কলম?)। উত্তরে হ্যাঁ হলে نَعَمْ (হ্যাঁ) এবং না হলে لَا (না) বসে।"
      },
      vocabulary: [
        { arabic: "مَا", bangla: "কী? (বস্তুর জন্য)", gender: "common", type: "অব্যয়", icon: "HelpCircle", audioText: "مَا" },
        { arabic: "مَنْ", bangla: "কে? (ব্যক্তির জন্য)", gender: "common", type: "অব্যয়", icon: "HelpCircle", audioText: "مَنْ" },
        { arabic: "هَلْ", bangla: "কী? (হ্যাঁ/না প্রশ্নবোধক)", gender: "common", type: "অব্যয়", icon: "CheckSquare", audioText: "هَلْ" },
        { arabic: "نَعَمْ", bangla: "হ্যাঁ", gender: "common", type: "অব্যয়", icon: "Check", audioText: "نَعَمْ" },
        { arabic: "لَا", bangla: "না", gender: "common", type: "অব্যয়", icon: "X", audioText: "لَا" },
        { arabic: "بَلْ", bangla: "বরং", gender: "common", type: "অব্যয়", icon: "ArrowRight", audioText: "بَلْ" },
        { arabic: "وَلَدٌ", bangla: "একটি ছেলে", gender: "masculine", type: "বিশেষ্য", icon: "User", audioText: "وَلَدٌ" },
        { arabic: "بِنْتٌ", bangla: "একটি মেয়ে", gender: "feminine", type: "বিশেষ্য", icon: "UserCheck", audioText: "بِنْتٌ" },
        { arabic: "رَجُلٌ", bangla: "একজন পুরুষ / লোক", gender: "masculine", type: "বিশেষ্য", icon: "Users", audioText: "رَجُلٌ" },
        { arabic: "امْرَأَةٌ", bangla: "একজন নারী / মহিলা", gender: "feminine", type: "বিশেষ্য", icon: "Users", audioText: "امْرَأَةٌ" },
        { arabic: "طَالِبٌ", bangla: "একজন ছাত্র", gender: "masculine", type: "বিশেষ্য", icon: "GraduationCap", audioText: "طَالِبٌ" },
        { arabic: "مُعَلِّمٌ", bangla: "একজন শিক্ষক", gender: "masculine", type: "বিশেষ্য", icon: "Award", audioText: "مُعَلِّمٌ" }
      ],
      sentences: [
        { arabic: "مَنْ هٰذَا؟ هٰذَا وَلَدٌ", bangla: "ইনি/এ কে? এ একটি ছেলে।", grammarNote: "ব্যক্তির জন্য مَنْ বসেছে।" },
        { arabic: "مَنْ تِلْكَ؟ تِلْكَ بِنْتٌ", bangla: "ওই কে? ও একটি মেয়ে।", grammarNote: "মেয়ে শিশুর জন্য স্ত্রীলিঙ্গ تِلْكَ বসেছে।" },
        { arabic: "هَلْ هٰذَا كِتَابٌ؟ نَعَمْ، هٰذَا كِتَابٌ", bangla: "ইহা কি একটি বই? হ্যাঁ, ইহা একটি বই।", grammarNote: "হ্যাঁ-সূচক উত্তরে نَعَمْ।" },
        { arabic: "هَلْ ذٰلِكَ قَلَمٌ؟ لَا، ذٰلِكَ مِفْتَاحٌ", bangla: "উহা কি একটি কলম? না, উহা একটি চাবি।", grammarNote: "না-সূচক উত্তরে لَا।" }
      ],
      dialogues: [
        {
          question: { arabic: "هَلْ هٰذَا كِتَابٌ جَدِيدٌ؟", bangla: "ইহা কি একটি নতুন বই?" },
          answer: { arabic: "نَعَمْ، هٰذَا كِتَابٌ جَدِيدٌ.", bangla: "হ্যাঁ, ইহা একটি নতুন বই।" }
        },
        {
          question: { arabic: "هَلْ تِلْكَ سَاعَةٌ قَدِيمَةٌ؟", bangla: "উহা কি একটি পুরাতন ঘড়ি?" },
          answer: { arabic: "لَا، بَلْ هِيَ سَاعَةٌ جَدِيدَةٌ.", bangla: "না, বরং উহা একটি নতুন ঘড়ি।" }
        }
      ],
      quiz: [
        {
          id: "q3_1",
          type: "mcq",
          question: "একজন মানুষের পরিচয় জানতে চাইলে কোন প্রশ্নবোধক অব্যয়টি সঠিক?",
          options: ["مَا هٰذَا؟", "مَنْ هٰذَا؟", "كَيْفَ هٰذَا؟", "أَيْنَ هٰذَا؟"],
          correctAnswer: 1,
          explanation: "মানুষ বা জ্ঞানবান সৃষ্টির পরিচয় জানতে مَنْ (কে) ব্যবহৃত হয়।"
        },
        {
          id: "q3_2",
          type: "fill_blank",
          sentenceBefore: "",
          blankTarget: "هَلْ",
          sentenceAfter: " ذٰلِكَ مَسْجِدٌ؟",
          meaning: "উহা কি একটি মসজিদ? (হ্যাঁ/না প্রশ্ন)",
          options: ["مَنْ", "هَلْ", "مَا", "كَيْفَ"],
          correctAnswer: 1,
          explanation: "হ্যাঁ বা না উত্তরের যাচাইয়ের জন্য هَلْ বসে।"
        },
        {
          id: "q3_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে প্রশ্নটি তৈরি করুন: 'ইহা কি একটি কলম?'",
          words: ["قَلَمٌ", "هٰذَا", "هَلْ"],
          correctOrder: ["هَلْ", "هٰذَا", "قَلَمٌ"],
          meaning: "ইহা কি একটি কলম?",
          explanation: "প্রশ্নবোধক অব্যয় هَلْ বাক্যের শুরুতে বসে, এরপর ইশারা ও বিশেষ্য আসে।"
        },
        {
          id: "q3_4",
          type: "grammar_tarkib",
          sentence: "هَلْ هٰذَا مَسْجِدٌ؟ لَا، بَلْ هٰذَا بَيْتٌ",
          question: "এই বাক্যে 'بَلْ' শব্দটির অর্থ ও কাজ কী?",
          options: ["বরং (পূর্ববর্তী ভুল শুধরে সঠিক তথ্য দেওয়া)", "এবং (সংযোজক)", "না (অস্বীকৃতি)", "হ্যাঁ (স্বীকৃতি)"],
          correctAnswer: 0,
          explanation: "بَلْ অর্থ 'বরং', যা আগের ধারণাকে সংশোধন করে সত্য স্পষ্ট করে।"
        }
      ]
    },

    // LESSON 4
    {
      id: "vol1-lesson4",
      volumeId: 1,
      lessonNumber: 4,
      title: "৪র্থ পাঠ: মারেফা-নাকেরা ও জুমলা ইসমিয়্যা",
      subTitle: "الْكِتَابُ جَدِيدٌ (বইটি নতুন) বনাম كِتَابٌ جَدِيدٌ (একটি নতুন বই)",
      pages: "মূল কিতাবের পৃষ্ঠা ১৯ - ২৫",
      grammarRule: {
        title: "নির্দিষ্টকরণ (আলিফ-লাম) ও পূর্ণ বাক্যের নিয়ম",
        summary: "শব্দের শুরুতে আলিফ-লাম (الـ) আসলে তা মারেফা (নির্দিষ্ট) হয় এবং শেষের তানভীন বিলুপ্ত হয়ে এক পেশ হয়।",
        detail: "১. كِتَابٌ (একটি বই - অনির্দিষ্ট/নাকেরা) ➔ الْكِتَابُ (বইটি - নির্দিষ্ট/মারেফা)।\n২. كِتَابٌ جَدِيدٌ (একটি নতুন বই) হলো অপূর্ণ বাক্যাংশ (মুরাক্কাব)।\n৩. কিন্তু الْكِتَابُ جَدِيدٌ (বইটি নতুন) হলো পূর্ণ বাক্য (জুমলা ইসমিয়্যা)। এখানে الْكِتَابُ হলো মুবতাদা এবং جَدِيدٌ হলো খবর।"
      },
      vocabulary: [
        { arabic: "الْكِتَابُ", bangla: "বইটি", gender: "masculine", type: "মারেফা", icon: "BookOpen", audioText: "الْكِتَابُ" },
        { arabic: "الْقَلَمُ", bangla: "কলমটি", gender: "masculine", type: "মারেফা", icon: "PenTool", audioText: "الْقَلَمُ" },
        { arabic: "الْمَسْجِدُ", bangla: "মসজিদটি", gender: "masculine", type: "মারেফা", icon: "Landmark", audioText: "الْمَسْجِدُ" },
        { arabic: "السَّاعَةُ", bangla: "ঘড়িটি", gender: "feminine", type: "মারেফা", icon: "Clock", audioText: "السَّاعَةُ" },
        { arabic: "الْبَابُ", bangla: "দরজাটি", gender: "masculine", type: "মারেফা", icon: "DoorOpen", audioText: "الْبَابُ" },
        { arabic: "مَفْتُوحٌ", bangla: "খোলা / উন্মুক্ত", gender: "masculine", type: "সিফাত", icon: "Unlock", audioText: "مَفْتُوحٌ" },
        { arabic: "مُغْلَقٌ", bangla: "বন্ধ / তালাবদ্ধ", gender: "masculine", type: "সিফাত", icon: "Lock", audioText: "مُغْلَقٌ" },
        { arabic: "مَكْسُورٌ", bangla: "ভাঙা", gender: "masculine", type: "সিফাত", icon: "ShieldAlert", audioText: "مَكْسُورٌ" },
        { arabic: "سَلِيمٌ", bangla: "ভালো / অক্ষত", gender: "masculine", type: "সিফাত", icon: "ShieldCheck", audioText: "سَلِيمٌ" },
        { arabic: "وَاسِعٌ", bangla: "প্রশস্ত / বড়সড়", gender: "masculine", type: "সিফাত", icon: "Maximize", audioText: "وَاسِعٌ" },
        { arabic: "ضَيِّقٌ", bangla: "সংকীর্ণ / চাপা", gender: "masculine", type: "সিফাত", icon: "Minimize", audioText: "ضَيِّقٌ" }
      ],
      sentences: [
        { arabic: "الْكِتَابُ جَدِيدٌ", bangla: "বইটি নতুন।", grammarNote: "الْكِتَابُ মুবতাদা (মারেফা) + جَدِيدٌ খবর (নাকেরা)।" },
        { arabic: "الْقَلَمُ مَكْسُورٌ", bangla: "কলমটি ভাঙা।", grammarNote: "মুবতাদা ও খবর উভয়েই পেশবিশিষ্ট (মারফূ)।" },
        { arabic: "الْبَابُ مَفْتُوحٌ", bangla: "দরজাটি খোলা।", grammarNote: "জুমলা ইসমিয়্যার পূর্ণাঙ্গ রূপ।" },
        { arabic: "السَّاعَةُ جَمِيلَةٌ", bangla: "ঘড়িটি সুন্দর।", grammarNote: "মুবতাদা স্ত্রীলিঙ্গ হওয়ায় খবরও স্ত্রীলিঙ্গ হয়েছে।" },
        { arabic: "الْمَسْجِدُ كَبِيرٌ وَالْبَيْتُ صَغِيرٌ", bangla: "মসজিদটি বড় এবং বাড়িটি ছোট।", grammarNote: "হরফে আতফ দ্বারা দুটি স্বয়ংসম্পূর্ণ বাক্য।" }
      ],
      dialogues: [
        {
          question: { arabic: "هَلِ الْبَابُ مَفْتُوحٌ؟", bangla: "দরজাটি কি খোলা?" },
          answer: { arabic: "نَعَمْ، الْبَابُ مَفْتُوحٌ.", bangla: "হ্যাঁ, দরজাটি খোলা।" }
        },
        {
          question: { arabic: "هَلِ الْقَلَمُ مَكْسُورٌ؟", bangla: "কলমটি কি ভাঙা?" },
          answer: { arabic: "لَا، بَلِ الْقَلَمُ سَلِيمٌ.", bangla: "না, বরং কলমটি অক্ষত/ভালো।" }
        }
      ],
      quiz: [
        {
          id: "q4_1",
          type: "mcq",
          question: "'الْكِتَابُ جَدِيدٌ' এর সঠিক বাংলা অর্থ কী?",
          options: ["একটি নতুন বই", "বইটি নতুন", "নতুন বইটি", "বই ও নতুন"],
          correctAnswer: 1,
          explanation: "الْكِتَابُ নির্দিষ্ট (মুবতাদা) এবং جَدِيدٌ অনির্দিষ্ট (খবর), তাই অর্থ হবে পূর্ণ বাক্য: 'বইটি নতুন'।"
        },
        {
          id: "q4_2",
          type: "fill_blank",
          sentenceBefore: "الْبَابُ ",
          blankTarget: "مَفْتُوحٌ",
          sentenceAfter: "",
          meaning: "দরজাটি খোলা।",
          options: ["مَفْتُوحَةٌ", "مَفْتُوحٌ", "مَكْسُورَةٌ", "جَدِيدَةٌ"],
          correctAnswer: 1,
          explanation: "الْبَابُ পুংলিঙ্গ মুবতাদা হওয়ায় খবর পুংলিঙ্গ রূপ مَفْتُوحٌ হবে।"
        },
        {
          id: "q4_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'ঘড়িটি সুন্দর' বাক্যটি তৈরি করুন:",
          words: ["جَمِيلَةٌ", "السَّاعَةُ"],
          correctOrder: ["السَّاعَةُ", "جَمِيلَةٌ"],
          meaning: "ঘড়িটি সুন্দর।",
          explanation: "জুমলা ইসমিয়্যায় প্রথমে মুবতাদা (السَّاعَةُ) এবং পরে খবর (جَمِيلَةٌ) বসে।"
        },
        {
          id: "q4_4",
          type: "grammar_tarkib",
          sentence: "الْمَسْجِدُ كَبِيرٌ",
          question: "এই বাক্যে 'الْمَسْجِدُ' ও 'كَبِيرٌ' এর ব্যাকরণিক তারকীব কী?",
          options: ["মুবতাদা ও খবর", "সিফাত ও মাওসূফ", "মুদাফ ও মুদাফ ইলাইহি", "জর ও মাজরুর"],
          correctAnswer: 0,
          explanation: "الْمَسْجِدُ হলো মুবতাদা এবং كَبِيرٌ হলো তার খবর, যা মিলে জুমলা ইসমিয়্যা গঠিত হয়েছে।"
        }
      ]
    },

    // LESSON 5
    {
      id: "vol1-lesson5",
      volumeId: 1,
      lessonNumber: 5,
      title: "৫ম পাঠ: যমীর বা সর্বনাম (মুনফাসিল ও মুত্তাসিল)",
      subTitle: "أَنَا, أَنْتَ, هُوَ, هِيَ এবং كِتَابِي, كِتَابُكَ এর ব্যবহার",
      pages: "মূল কিতাবের পৃষ্ঠা ২৬ - ৩৪",
      grammarRule: {
        title: "সর্বনামের দুই প্রকার",
        summary: "১. পৃথক সর্বনাম (যমীরে মুনফাসিল): أَنَا (আমি), أَنْتَ (তুমি-পুং), أَنْتِ (তুমি-স্ত্রী), هُوَ (সে-পুং), هِيَ (সে-স্ত্রী)।\n২. যুক্ত সর্বনাম (যমীরে মুত্তাসিল): কোনো বিশেষ্যের সাথে যুক্ত হয়ে মালিকানা বোঝায়।",
        detail: "বিশেষ্যের শেষে যমীর যুক্ত করার নিয়ম:\n- ي (আমার): كِتَابٌ + ي = كِتَابِي (আমার বই)\n- كَ (তোমার-পুং): كِتَابٌ + كَ = كِتَابُكَ (তোমার বই)\n- كِ (তোমার-স্ত্রী): كِتَابٌ + كِ = كِتَابُكِ (তোমার বই)\n- هُ (তার-পুং): كِتَابٌ + هُ = كِتَابُهُ (তার বই)\n- هَا (তার-স্ত্রী): كِتَابٌ + هَا = كِتَابُهَا (তার বই)।"
      },
      vocabulary: [
        { arabic: "أَنَا", bangla: "আমি", gender: "common", type: "যমীর", icon: "User", audioText: "أَنَا" },
        { arabic: "أَنْتَ", bangla: "তুমি (পুরুষ)", gender: "masculine", type: "যমীর", icon: "UserCheck", audioText: "أَنْتَ" },
        { arabic: "أَنْتِ", bangla: "তুমি (মহিলা)", gender: "feminine", type: "যমীর", icon: "UserCheck", audioText: "أَنْتِ" },
        { arabic: "هُوَ", bangla: "সে / তিনি (পুরুষ)", gender: "masculine", type: "যমীর", icon: "Users", audioText: "هُوَ" },
        { arabic: "هِيَ", bangla: "সে / তিনি (মহিলা)", gender: "feminine", type: "যমীর", icon: "Users", audioText: "هِيَ" },
        { arabic: "صَدِيقٌ", bangla: "একজন বন্ধু", gender: "masculine", type: "বিশেষ্য", icon: "HeartHandshake", audioText: "صَدِيقٌ" },
        { arabic: "اسْمِي", bangla: "আমার নাম", gender: "masculine", type: "মুরাক্কাব", icon: "BadgeCheck", audioText: "اسْمِي" },
        { arabic: "اسْمُكَ", bangla: "তোমার নাম (পুরুষ)", gender: "masculine", type: "মুরাক্কাব", icon: "BadgeCheck", audioText: "اسْمُكَ" },
        { arabic: "طَبِيبٌ", bangla: "একজন ডাক্তার", gender: "masculine", type: "বিশেষ্য", icon: "Stethoscope", audioText: "طَبِيبٌ" },
        { arabic: "مُهَنْدِسٌ", bangla: "একজন প্রকৌশলী / ইঞ্জিনিয়ার", gender: "masculine", type: "বিশেষ্য", icon: "Compass", audioText: "مُهَنْدِسٌ" }
      ],
      sentences: [
        { arabic: "أَنَا طَالِبٌ", bangla: "আমি একজন ছাত্র।", grammarNote: "أَنَا যমীর (মুবতাদা) + طَالِبٌ খবর।" },
        { arabic: "أَنْتَ مُعَلِّمٌ", bangla: "তুমি একজন শিক্ষক।", grammarNote: "أَنْتَ পুংলিঙ্গ মধ্যম পুরুষ সর্বনাম।" },
        { arabic: "هُوَ طَبِيبٌ", bangla: "তিনি একজন চিকিৎসক।", grammarNote: "هُوَ পুংলিঙ্গ নামপুরুষ সর্বনাম।" },
        { arabic: "هٰذَا كِتَابِي", bangla: "ইহা আমার বই।", grammarNote: "كِتَابِي = كِتَاب + ي (মুত্তাসিল যমীর)।" },
        { arabic: "ذٰلِكَ قَلَمُكَ", bangla: "উহা তোমার কলম।", grammarNote: "قَلَمُكَ = قَلَم + كَ (তোমার পুং)।" }
      ],
      dialogues: [
        {
          question: { arabic: "مَا اسْمُكَ؟", bangla: "তোমার নাম কী?" },
          answer: { arabic: "اسْمِي مَاجِدٌ، وَأَنَا طَالِبٌ.", bangla: "আমার নাম মাজেদ, এবং আমি একজন ছাত্র।" }
        },
        {
          question: { arabic: "مَنْ هُوَ؟", bangla: "তিনি কে?" },
          answer: { arabic: "هُوَ مُعَلِّمِي فِي الْمَدْرَسَةِ.", bangla: "তিনি মাদরাসায় আমার শিক্ষক।" }
        }
      ],
      quiz: [
        {
          id: "q5_1",
          type: "mcq",
          question: "'আমার কলম' এর সঠিক আরবি রূপ কোনটি?",
          options: ["قَلَمُكَ", "قَلَمِي", "قَلَمُهُ", "قَلَمُهَا"],
          correctAnswer: 1,
          explanation: "উত্তম পুরুষ (আমার) বোঝাতে শব্দের শেষে ইয়া (ي) যুক্ত হয়ে 'قَلَمِي' হয়।"
        },
        {
          id: "q5_2",
          type: "fill_blank",
          sentenceBefore: "",
          blankTarget: "أَنَا",
          sentenceAfter: " طَالِبٌ جَدِيدٌ.",
          meaning: "আমি একজন নতুন ছাত্র।",
          options: ["هُوَ", "أَنَا", "هِيَ", "تِلْكَ"],
          correctAnswer: 1,
          explanation: "বক্তার নিজের জন্য 'أَنَا' (আমি) যমীর ব্যবহৃত হয়।"
        },
        {
          id: "q5_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'ইহা তোমার ব্যাগ' বাক্যটি তৈরি করুন:",
          words: ["حَقِيبَتُكَ", "هٰذِهِ"],
          correctOrder: ["هٰذِهِ", "حَقِيبَتُكَ"],
          meaning: "ইহা তোমার ব্যাগ।",
          explanation: "حَقِيبَةٌ স্ত্রীলিঙ্গ হওয়ায় ইশারা هٰذِهِ আসবে এবং শেষে كَ যমীর যুক্ত হবে।"
        },
        {
          id: "q5_4",
          type: "grammar_tarkib",
          sentence: "هٰذَا كِتَابُهُ",
          question: "এই বাক্যে 'كِتَابُهُ' এর শেষের 'هُ' যমীরটির অর্থ কী?",
          options: ["তার (পুংলিঙ্গ)", "আমার", "তোমার", "আমাদের"],
          correctAnswer: 0,
          explanation: "'هُ' যমীরটি নামপুরুষ পুংলিঙ্গ (তৃতীয় পক্ষ) নির্দেশ করে, যার অর্থ 'তার'।"
        }
      ]
    },

    // LESSON 6
    {
      id: "vol1-lesson6",
      volumeId: 1,
      lessonNumber: 6,
      title: "৬ষ্ঠ পাঠ: হরফে জর ও মাজরুর",
      subTitle: "فِي (মধ্যে), عَلَى (উপরে), مِنْ (হতে), إِلَى (দিকে) এর আমল",
      pages: "মূল কিতাবের পৃষ্ঠা ৩৫ - ৪২",
      grammarRule: {
        title: "হরফে জরের কায়েদা ও এরাব",
        summary: "হরফে জর (حُرُوفُ الْجَرّ) এমন অব্যয় যা তার পরবর্তী বিশেষ্যকে যের (কাসরাহ) প্রদান করে।",
        detail: "যে শব্দের উপর হরফে জর প্রবেশ করে তাকে মাজরুর (مَجْرُور) বলে।\n১. فِي (মধ্যে/ভিতরে): فِي الْحَقِيبَةِ (ব্যাগের মধ্যে - তা-এর নিচে যের)।\n২. عَلَى (উপরে): عَلَى الْمَكْتَبِ (টেবিলের উপরে - বা-এর নিচে যের)।\n৩. مِنْ (হতে/থেকে): مِنَ الْمَسْجِدِ (মসজিদ থেকে)।\n৪. إِلَى (দিকে/পর্যন্ত): إِلَى الْمَدْرَسَةِ (মাদরাসার দিকে)।"
      },
      vocabulary: [
        { arabic: "فِي", bangla: "মধ্যে / ভিতরে", gender: "common", type: "হরফে জর", icon: "Box", audioText: "فِي" },
        { arabic: "عَلَى", bangla: "উপরে", gender: "common", type: "হরফে জর", icon: "ArrowUp", audioText: "عَلَى" },
        { arabic: "مِنْ", bangla: "হতে / থেকে", gender: "common", type: "হরফে জর", icon: "LogOut", audioText: "مِنْ" },
        { arabic: "إِلَى", bangla: "দিকে / পর্যন্ত", gender: "common", type: "হরফে জর", icon: "LogIn", audioText: "إِلَى" },
        { arabic: "مَكْتَبٌ", bangla: "একটি পড়ার টেবিল / ডেস্ক", gender: "masculine", type: "বিশেষ্য", icon: "Columns", audioText: "مَكْتَبٌ" },
        { arabic: "جَيْبٌ", bangla: "একটি পকেট", gender: "masculine", type: "বিশেষ্য", icon: "Folder", audioText: "جَيْبٌ" },
        { arabic: "سُوقٌ", bangla: "একটি বাজার", gender: "masculine", type: "বিশেষ্য", icon: "ShoppingBag", audioText: "سُوقٌ" },
        { arabic: "قَرْيَةٌ", bangla: "একটি গ্রাম", gender: "feminine", type: "বিশেষ্য", icon: "Trees", audioText: "قَرْيَةٌ" },
        { arabic: "مَدِينَةٌ", bangla: "একটি শহর", gender: "feminine", type: "বিশেষ্য", icon: "Building2", audioText: "مَدِينَةٌ" },
        { arabic: "السَّمَاءُ", bangla: "আকাশ", gender: "feminine", type: "বিশেষ্য", icon: "Cloud", audioText: "السَّمَاءُ" },
        { arabic: "الأَرْضُ", bangla: "পৃথিবী / জমিন", gender: "feminine", type: "বিশেষ্য", icon: "Globe", audioText: "الأَرْضُ" }
      ],
      sentences: [
        { arabic: "الْقَلَمُ عَلَى الْمَكْتَبِ", bangla: "কলমটি টেবিলের উপরে।", grammarNote: "عَلَى হরফে জর + الْمَكْتَبِ মাজরুর (জেরবিশিষ্ট)।" },
        { arabic: "الْكِتَابُ فِي الْحَقِيبَةِ", bangla: "বইটি ব্যাগের মধ্যে।", grammarNote: "فِي হরফে জর + الْحَقِيبَةِ মাজরুর।" },
        { arabic: "الْوَلَدُ فِي الْمَسْجِدِ", bangla: "ছেলেটি মসজিদের ভিতরে।", grammarNote: "জর ও মাজরুর মিলে শিবহু জুমলা খবর হয়েছে।" },
        { arabic: "ذَهَبَ حَامِدٌ إِلَى الْمَدْرَسَةِ", bangla: "হামেদ মাদরাসার দিকে গেল।", grammarNote: "إِلَى গন্তব্য নির্দেশ করছে।" },
        { arabic: "رَجَعَ الْمُعَلِّمُ مِنَ السُّوقِ", bangla: "শিক্ষক বাজার থেকে ফিরলেন।", grammarNote: "مِنْ সূচনা নির্দেশক হরফে জর।" }
      ],
      dialogues: [
        {
          question: { arabic: "أَيْنَ الْقَلَمُ؟", bangla: "কলমটি কোথায়?" },
          answer: { arabic: "الْقَلَمُ عَلَى الْمَكْتَبِ.", bangla: "কলমটি টেবিলের উপরে।" }
        },
        {
          question: { arabic: "أَيْنَ السَّاعَةُ؟", bangla: "ঘড়িটি কোথায়?" },
          answer: { arabic: "السَّاعَةُ فِي الْغُرْفَةِ.", bangla: "ঘড়িটি কামরার মধ্যে।" }
        }
      ],
      quiz: [
        {
          id: "q6_1",
          type: "mcq",
          question: "হরফে জরের পর বিশেষ্যের শেষ অক্ষরে কোন হরকত (ই'রাব) হয়?",
          options: ["পেশ (যম্মা)", "জের (কাসরাহ)", "যবর (ফাতহাহ)", "সাকিন (জযম)"],
          correctAnswer: 1,
          explanation: "হরফে জর তার পরবর্তী ইসমে মাজরুরকে জের (কাসরাহ) প্রদান করে।"
        },
        {
          id: "q6_2",
          type: "fill_blank",
          sentenceBefore: "الْكِتَابُ ",
          blankTarget: "فِي",
          sentenceAfter: " الْحَقِيبَةِ.",
          meaning: "বইটি ব্যাগের মধ্যে।",
          options: ["عَلَى", "فِي", "مِنْ", "إِلَى"],
          correctAnswer: 1,
          explanation: "ভিতরে বা মধ্যে বোঝাতে হরফে জর 'فِي' বসে।"
        },
        {
          id: "q6_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'কলমটি টেবিলের উপরে' বাক্যটি তৈরি করুন:",
          words: ["الْمَكْتَبِ", "عَلَى", "الْقَلَمُ"],
          correctOrder: ["الْقَلَمُ", "عَلَى", "الْمَكْتَبِ"],
          meaning: "কলমটি টেবিলের উপরে।",
          explanation: "মুবতাদা (الْقَلَمُ) + হরফে জর (عَلَى) + মাজরুর (الْمَكْتَبِ)।"
        },
        {
          id: "q6_4",
          type: "grammar_tarkib",
          sentence: "الْوَلَدُ فِي الْمَسْجِدِ",
          question: "এই বাক্যে 'فِي الْمَسْجِدِ' ব্যাকরণগতভাবে কী?",
          options: ["জর ও মাজরুর (শিবহু জুমলা খবর)", "মুবতাদা", "সিফাত-মাওসূফ", "মুদাফ-মুদাফ ইলাইহি"],
          correctAnswer: 0,
          explanation: "فِي হরফে জর এবং الْمَسْجِدِ মাজরুর, উভয়টি মিলে বাক্যের খবর হিসেবে কাজ করছে।"
        }
      ]
    },

    // LESSON 7
    {
      id: "vol1-lesson7",
      volumeId: 1,
      lessonNumber: 7,
      title: "৭ম পাঠ: মুদাফ ও মুদাফ ইলাইহি (ইদাফাত)",
      subTitle: "كِتَابُ الرَّجُلِ (লোকটির বই) ও بَابُ الْمَسْجِدِ (মসজিদের দরজা)",
      pages: "মূল কিতাবের পৃষ্ঠা ৪৩ - ৫২",
      grammarRule: {
        title: "মুরাক্কাবে ইদাফীর কড়া নিয়ম",
        summary: "১. প্রথম অংশকে মুদাফ (مُضَاف) বলে, যাতে কখনও আলিফ-লাম (الـ) এবং তানভীন (ً ٍ ٌ) বসে না।\n২. দ্বিতীয় অংশকে মুদাফ ইলাইহি (مُضَاف إِلَيْهِ) বলে, যা সবসময় মাজরুর (জেরবিশিষ্ট) হয়।",
        detail: "উদাহরণ: كِتَابٌ (বই) + الرَّجُلُ (লোকটি) = كِتَابُ الرَّجُلِ (লোকটির বই)।\nলক্ষ্য করুন: كِتَابُ শব্দের শুরুতে আলিফ-লাম নেই এবং শেষে তানভীন নেই (এক পেশ হয়েছে)। আর الرَّجُلِ শব্দের শেষে জের হয়েছে।"
      },
      vocabulary: [
        { arabic: "كِتَابُ اللهِ", bangla: "আল্লাহর কিতাব", gender: "masculine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "BookOpen", audioText: "كِتَابُ اللهِ" },
        { arabic: "رَسُولُ اللهِ", bangla: "আল্লাহর রাসূল", gender: "masculine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "Award", audioText: "رَسُولُ اللهِ" },
        { arabic: "بَيْتُ اللهِ", bangla: "আল্লাহর ঘর (কাবা/মসজিদ)", gender: "masculine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "Landmark", audioText: "بَيْتُ اللهِ" },
        { arabic: "دِينُ الإِسْلَامِ", bangla: "ইসলামের দ্বীন / ধর্ম", gender: "masculine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "Shield", audioText: "دِينُ الإِسْلَامِ" },
        { arabic: "بَابُ الْمَسْجِدِ", bangla: "মসজিদের দরজা", gender: "masculine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "DoorOpen", audioText: "بَابُ الْمَسْجِدِ" },
        { arabic: "مِفْتَاحُ الْبَابِ", bangla: "দরজার চাবি", gender: "masculine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "Key", audioText: "مِفْتَاحُ الْبَابِ" },
        { arabic: "سَاعَةُ الْوَلَدِ", bangla: "ছেলেটির ঘড়ি", gender: "feminine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "Clock", audioText: "سَاعَةُ الْوَلَدِ" },
        { arabic: "حَقِيبَةُ البِنْتِ", bangla: "মেয়েটির ব্যাগ", gender: "feminine", type: "মুদাফ-মুদাফ ইলাইহি", icon: "Briefcase", audioText: "حَقِيبَةُ البِنْتِ" }
      ],
      sentences: [
        { arabic: "الْقُرْآنُ كِتَابُ اللهِ", bangla: "কুরআন আল্লাহর কিতাব।", grammarNote: "الْقُرْآنُ মুবতাদা + كِتَابُ (মুদাফ) اللهِ (মুদাফ ইলাইহি) মিলে খবর।" },
        { arabic: "مُحَمَّدٌ رَسُولُ اللهِ", bangla: "মুহাম্মদ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম আল্লাহর রাসূল।", grammarNote: "মুদাফ ও মুদাফ ইলাইহি দ্বারা গঠিত বাক্য।" },
        { arabic: "الْإِسْلَامُ دِينُ الْحَقِّ", bangla: "ইসলাম সত্য দ্বীন।", grammarNote: "دِينُ মুদাফ + الْحَقِّ মুদাফ ইলাইহি (জেরবিশিষ্ট)।" },
        { arabic: "هٰذَا بَابُ الْمَسْجِدِ", bangla: "ইহা মসজিদের দরজা।", grammarNote: "هٰذَا মুবতাদা + بَابُ الْمَسْجِدِ খবর।" }
      ],
      dialogues: [
        {
          question: { arabic: "كِتَابُ مَنْ هٰذَا؟", bangla: "ইহা কার বই?" },
          answer: { arabic: "هٰذَا كِتَابُ حَامِدٍ.", bangla: "ইহা হামেদের বই।" }
        },
        {
          question: { arabic: "أَيْنَ مِفْتَاحُ السَّيَّارَةِ؟", bangla: "গাড়ির চাবিটি কোথায়?" },
          answer: { arabic: "مِفْتَاحُ السَّيَّارَةِ عَلَى الطَّاوِلَةِ.", bangla: "গাড়ির চাবিটি টেবিলের উপরে।" }
        }
      ],
      quiz: [
        {
          id: "q7_1",
          type: "mcq",
          question: "মুদাফ (مُضَاف) এর ক্ষেত্রে নিচের কোন নিয়মটি বাধ্যতামূলক?",
          options: ["এতে আলিফ-লাম ও তানভীন বসে না", "এতে সবসময় দুই যের হয়", "এতে সবসময় আলিফ-লাম থাকতে হয়", "এটি বাক্যের শেষে বসে"],
          correctAnswer: 0,
          explanation: "মুদাফে কখনও আলিফ-লাম (الـ) এবং তানভীন (ً ٍ ٌ) প্রবেশ করতে পারে না।"
        },
        {
          id: "q7_2",
          type: "fill_blank",
          sentenceBefore: "الْقُرْآنُ ",
          blankTarget: "كِتَابُ",
          sentenceAfter: " اللهِ",
          meaning: "কুরআন আল্লাহর কিতাব।",
          options: ["الْكِتَابُ", "كِتَابٌ", "كِتَابُ", "كِتَابٍ"],
          correctAnswer: 2,
          explanation: "মুদাফ হিসেবে كِتَابُ বসবে—এতে আলিফ-লাম হবে না এবং তানভীন হবে না, কেবল এক পেশ হবে।"
        },
        {
          id: "q7_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'ইহা মসজিদের দরজা' বাক্যটি তৈরি করুন:",
          words: ["الْمَسْجِدِ", "بَابُ", "هٰذَا"],
          correctOrder: ["هٰذَا", "بَابُ", "الْمَسْجِدِ"],
          meaning: "ইহা মসজিদের দরজা।",
          explanation: "ইসমুল ইশারা (هٰذَا) + মুদাফ (بَابُ) + মুদাফ ইলাইহি (الْمَسْجِدِ)।"
        },
        {
          id: "q7_4",
          type: "grammar_tarkib",
          sentence: "بَابُ الْمَسْجِدِ مَفْتُوحٌ",
          question: "এই বাক্যে 'الْمَسْجِدِ' শব্দটির ই'রাব (হরকত) কী এবং কেন?",
          options: ["মাজরুর (জেরবিশিষ্ট) কারণ এটি মুদাফ ইলাইহি", "মারফূ কারণ এটি মুবতাদা", "মানসূব কারণ এটি মাফ'উল", "মাবনী"],
          correctAnswer: 0,
          explanation: "মুদাফ ইলাইহি সবসময় মাজরুর (জেরবিশিষ্ট) হয়, তাই 'الْمَسْجِدِ' শব্দের শেষে যের হয়েছে।"
        }
      ]
    },

    // LESSON 8
    {
      id: "vol1-lesson8",
      volumeId: 1,
      lessonNumber: 8,
      title: "৮ম পাঠ: জর-মাজরুর দ্বারা বাক্য ও অস্তিত্ব প্রকাশ",
      subTitle: "فِي الْبَيْتِ رَجُلٌ (ঘরে একজন লোক আছেন) এর বাক্যরীতি",
      pages: "মূল কিতাবের পৃষ্ঠা ৫৩ - ৬০",
      grammarRule: {
        title: "খবরে মুকাদ্দাম ও মুবতাদায়ে মুআখখার",
        summary: "অনির্দিষ্ট বিশেষ্যের অস্তিত্ব বোঝাতে জর-মাজরুর বাক্যের শুরুতে আসে।",
        detail: "১. الرَّجُلُ فِي الْبَيْتِ = লোকটি ঘরে আছেন (নির্দিষ্ট ব্যক্তি সম্পর্কে সংবাদ)।\n২. فِي الْبَيْتِ رَجُلٌ = ঘরে একজন লোক আছেন (অনির্দিষ্ট কারো ঘরের মধ্যে উপস্থিতি)। এখানে জর-মাজরুরকে 'খবরে মুকাদ্দাম' এবং শেষের শব্দটিকে 'মুবতাদায়ে মুআখখার' বলা হয়।"
      },
      vocabulary: [
        { arabic: "شَارِعٌ", bangla: "রাস্তা", gender: "masculine", type: "বিশেষ্য", icon: "Milestone", audioText: "شَارِعٌ" },
        { arabic: "حَدِيقَةٌ", bangla: "বাগান", gender: "feminine", type: "বিশেষ্য", icon: "Trees", audioText: "حَدِيقَةٌ" },
        { arabic: "شَجَرَةٌ", bangla: "একটি গাছ", gender: "feminine", type: "বিশেষ্য", icon: "TreePine", audioText: "شَجَرَةٌ" },
        { arabic: "ثَمَرَةٌ", bangla: "একটি ফল", gender: "feminine", type: "বিশেষ্য", icon: "Apple", audioText: "ثَمَرَةٌ" },
        { arabic: "زَهْرَةٌ", bangla: "একটি ফুল", gender: "feminine", type: "বিশেষ্য", icon: "Flower", audioText: "زَهْرَةٌ" },
        { arabic: "سَيَّارَةٌ", bangla: "একটি গাড়ি", gender: "feminine", type: "বিশেষ্য", icon: "Car", audioText: "سَيَّارَةٌ" },
        { arabic: "مَاءٌ", bangla: "পানি", gender: "masculine", type: "বিশেষ্য", icon: "Droplets", audioText: "مَاءٌ" }
      ],
      sentences: [
        { arabic: "فِي الْمَسْجِدِ إِمَامٌ", bangla: "মসজিদে একজন ইমাম আছেন।", grammarNote: "فِي الْمَسْجِدِ খবরে মুকাদ্দাম + إِمَامٌ মুবতাদায়ে মুআখখার।" },
        { arabic: "فِي الْحَدِيقَةِ زَهْرَةٌ جَمِيلَةٌ", bangla: "বাগানে একটি সুন্দর ফুল আছে।", grammarNote: "زَهْرَةٌ جَمِيلَةٌ মাওসূফ-সিফাত মুবতাদা।" },
        { arabic: "فِي الشَّارِعِ سَيَّارَةٌ", bangla: "রাস্তায় একটি গাড়ি আছে।", grammarNote: "অনির্দিষ্ট বিশেষ্যের উপস্থিতি।" }
      ],
      dialogues: [
        {
          question: { arabic: "مَاذَا فِي الْحَقِيبَةِ؟", bangla: "ব্যাগের মধ্যে কী আছে?" },
          answer: { arabic: "فِي الْحَقِيبَةِ كِتَابٌ وَقَلَمٌ.", bangla: "ব্যাগের মধ্যে একটি বই ও একটি কলম আছে।" }
        },
        {
          question: { arabic: "مَنْ فِي الْغُرْفَةِ؟", bangla: "কামরায় কে আছেন?" },
          answer: { arabic: "فِي الْغُرْفَةِ رَجُلٌ وَوَلَدٌ.", bangla: "কামরায় একজন লোক ও একটি ছেলে আছে।" }
        }
      ],
      quiz: [
        {
          id: "q8_1",
          type: "mcq",
          question: "'বাগানে একটি সুন্দর ফুল আছে' এর বিশুদ্ধ আরবি বাক্য কোনটি?",
          options: ["فِي الْحَدِيقَةِ زَهْرَةٌ جَمِيلَةٌ", "زَهْرَةٌ فِي حَدِيقَةٍ", "الْحَدِيقَةُ فِي زَهْرَةٍ", "فِي زَهْرَةٍ حَدِيقَةٌ"],
          correctAnswer: 0,
          explanation: "জর-মাজরুর খবরে মুকাদ্দাম আগে এসে বাক্য শুরু হয়: 'فِي الْحَدِيقَةِ زَهْرَةٌ جَمِيلَةٌ'।"
        },
        {
          id: "q8_2",
          type: "fill_blank",
          sentenceBefore: "فِي الْبَيْتِ ",
          blankTarget: "رَجُلٌ",
          sentenceAfter: "",
          meaning: "ঘরে একজন লোক আছেন।",
          options: ["الرَّجُلِ", "رَجُلٌ", "رَجُلًا", "رَجُلٍ"],
          correctAnswer: 1,
          explanation: "মুআখখার মুবতাদা অনির্দিষ্ট ও মারফূ (পেশবিশিষ্ট) হয়, তাই 'رَجُلٌ' হবে।"
        },
        {
          id: "q8_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'ব্যাগে একটি বই আছে' বাক্যটি তৈরি করুন:",
          words: ["كِتَابٌ", "الْحَقِيبَةِ", "فِي"],
          correctOrder: ["فِي", "الْحَقِيبَةِ", "كِتَابٌ"],
          meaning: "ব্যাগে একটি বই আছে।",
          explanation: "প্রথমে জর-মাজরুর (فِي الْحَقِيبَةِ) এবং শেষে মুবতাদা (كِتَابٌ)।"
        },
        {
          id: "q8_4",
          type: "grammar_tarkib",
          sentence: "فِي الْمَسْجِدِ مُصَلُّونَ",
          question: "এই বাক্যে 'فِي الْمَسْجِدِ' অংশটি ব্যাকরণগতভাবে কী?",
          options: ["খবরে মুকাদ্দাম (পূর্বে আনীত খবর)", "মুবতাদায়ে মুআখখার", "মুদাফ", "সিফাত"],
          correctAnswer: 0,
          explanation: "বাক্যের শুরুতে অবস্থিত জর-মাজরুর অংশটি হলো খবরে মুকাদ্দাম।"
        }
      ]
    },

    // LESSON 9
    {
      id: "vol1-lesson9",
      volumeId: 1,
      lessonNumber: 9,
      title: "৯ম পাঠ: স্থান ও দিক নির্দেশক অব্যয় (যরফে মাকান)",
      subTitle: "أَمَامَ (সামনে), خَلْفَ (পেছনে), فَوْقَ (উপরে), تَحْتَ (নিচে), عِنْدَ (নিকটে)",
      pages: "মূল কিতাবের পৃষ্ঠা ৬১ - ৭০",
      grammarRule: {
        title: "যরফের নিয়ম ও মুদাফ হওয়ার বিধান",
        summary: "স্থান নির্দেশক শব্দগুলোকে যরফে মাকান (ظَرْفُ مَكَانٍ) বলে। এগুলো সাধারণত যবরবিশিষ্ট (মানসূব) হয় এবং পরবর্তী শব্দের দিকে মুদাফ হয়।",
        detail: "যেহেতু এগুলো মুদাফ হিসেবে ব্যবহৃত হয়, তাই এগুলোর পরের শব্দটি সবসময় মাজরুর (জেরবিশিষ্ট) হয়।\nযেমন:\n- أَمَامَ الْمَسْجِدِ (মসজিদের সামনে)\n- خَلْفَ الْبَيْتِ (ঘরের পেছনে)\n- تَحْتَ الشَّجَرَةِ (গাছের নিচে)\n- فَوْقَ السَّحَابِ (মেঘের উপরে)\n- عِنْدَ الْمُعَلِّمِ (শিক্ষকের কাছে)।"
      },
      vocabulary: [
        { arabic: "أَمَامَ", bangla: "সামনে", gender: "common", type: "যরফ", icon: "ArrowRight", audioText: "أَمَامَ" },
        { arabic: "خَلْفَ", bangla: "পেছনে", gender: "common", type: "যরফ", icon: "ArrowLeft", audioText: "خَلْفَ" },
        { arabic: "فَوْقَ", bangla: "উপরে", gender: "common", type: "যরফ", icon: "ArrowUp", audioText: "فَوْقَ" },
        { arabic: "تَحْتَ", bangla: "নিচে", gender: "common", type: "যরফ", icon: "ArrowDown", audioText: "تَحْتَ" },
        { arabic: "عِنْدَ", bangla: "নিকটে / কাছে", gender: "common", type: "যরফ", icon: "MapPin", audioText: "عِنْدَ" },
        { arabic: "بَيْنَ", bangla: "মাঝে / মধ্যে", gender: "common", type: "যরফ", icon: "Split", audioText: "بَيْنَ" },
        { arabic: "هُنَا", bangla: "এখানে", gender: "common", type: "ইশারা", icon: "Compass", audioText: "هُنَا" },
        { arabic: "هُنَاكَ", bangla: "সেখানে", gender: "common", type: "ইশারা", icon: "Navigation", audioText: "هُنَاكَ" }
      ],
      sentences: [
        { arabic: "الْحَدِيقَةُ أَمَامَ الْمَسْجِدِ", bangla: "বাগানটি মসজিদের সামনে।", grammarNote: "أَمَامَ যরফ + الْمَسْجِدِ মুদাফ ইলাইহি।" },
        { arabic: "السَّيَّارَةُ خَلْفَ الْبَيْتِ", bangla: "গাড়িটি ঘরের পেছনে।", grammarNote: "خَلْفَ যরফ (স্থান নির্দেশক)।" },
        { arabic: "الْقِطُّ تَحْتَ الطَّاوِلَةِ", bangla: "বিড়ালটি টেবিলের নিচে।", grammarNote: "تَحْتَ মুদাফ + الطَّاوِلَةِ মাজরুর।" },
        { arabic: "الْكِتَابُ عِنْدَ الْمُعَلِّمِ", bangla: "বইটি শিক্ষকের কাছে।", grammarNote: "عِنْدَ মালিকানা বা সান্নিধ্য নির্দেশ করে।" }
      ],
      dialogues: [
        {
          question: { arabic: "أَيْنَ تَقِفُ السَّيَّارَةُ؟", bangla: "গাড়িটি কোথায় দাঁড়িয়ে আছে?" },
          answer: { arabic: "تَقِفُ السَّيَّارَةُ أَمَامَ الْمَدْرَسَةِ.", bangla: "গাড়িটি মাদরাসার সামনে দাঁড়িয়ে আছে।" }
        },
        {
          question: { arabic: "أَيْنَ الْقَلَمُ؟", bangla: "কলমটি কোথায়?" },
          answer: { arabic: "الْقَلَمُ عِنْدَ حَامِدٍ.", bangla: "কলমটি হামেদের কাছে আছে।" }
        }
      ],
      quiz: [
        {
          id: "q9_1",
          type: "mcq",
          question: "'গাছের নিচে' এর সঠিক আরবি কোনটি?",
          options: ["فَوْقَ الشَّجَرَةِ", "تَحْتَ الشَّجَرَةِ", "أَمَامَ الشَّجَرَةِ", "خَلْفَ الشَّجَرَةِ"],
          correctAnswer: 1,
          explanation: "'নিচে' বোঝাতে تَحْتَ ব্যবহৃত হয় এবং পরবর্তী শব্দ মাজরুর হয়ে 'تَحْتَ الشَّجَرَةِ' হয়।"
        },
        {
          id: "q9_2",
          type: "fill_blank",
          sentenceBefore: "الْمَسْجِدُ ",
          blankTarget: "أَمَامَ",
          sentenceAfter: " الْبَيْتِ",
          meaning: "মসজিদটি ঘরের সামনে।",
          options: ["تَحْتَ", "أَمَامَ", "فَوْقَ", "مِنْ"],
          correctAnswer: 1,
          explanation: "সামনে বোঝাতে যরফ হিসেবে 'أَمَامَ' বসে।"
        },
        {
          id: "q9_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'বিড়ালটি টেবিলের নিচে' বাক্যটি তৈরি করুন:",
          words: ["الطَّاوِلَةِ", "تَحْتَ", "الْقِطُّ"],
          correctOrder: ["الْقِطُّ", "تَحْتَ", "الطَّاوِلَةِ"],
          meaning: "বিড়ালটি টেবিলের নিচে।",
          explanation: "মুবতাদা (الْقِطُّ) + যরফ (تَحْتَ) + মুদাফ ইলাইহি (الطَّاوِلَةِ)।"
        },
        {
          id: "q9_4",
          type: "grammar_tarkib",
          sentence: "الْحَدِيقَةُ خَلْفَ الْمَدْرَسَةِ",
          question: "এই বাক্যে 'خَلْفَ' শব্দটির ব্যাকরণিক পরিচয় কী?",
          options: ["যরফে মাকান (স্থানবাচক অব্যয় / মুদাফ)", "হরফে জর", "সিফাত", "মাওসূফ"],
          correctAnswer: 0,
          explanation: "'خَلْفَ' হলো স্থান নির্দেশক যরফে মাকান, যা পরবর্তী শব্দের সাথে মুদাফ হয়ে বসেছে।"
        }
      ]
    },

    // LESSON 10
    {
      id: "vol1-lesson10",
      volumeId: 1,
      lessonNumber: 10,
      title: "১০ম পাঠ: ১ম অধ্যায়ের সমন্বিত পাঠ ও গল্প",
      subTitle: "حَدِيقَةٌ جَمِيلَةٌ (সুন্দর বাগান) ও বুনিয়াদি কথপোকথন",
      pages: "মূল কিতাবের পৃষ্ঠা ৭১ - ৮০",
      grammarRule: {
        title: "১ম অধ্যায়ের সামগ্রিক পুনরাবৃত্তি ও তামরীন",
        summary: "এতক্ষণ শেখা ইসমুল ইশারা, সিফাত-মাওসূফ, যমীর, হরফে জর, ইদাফাত ও যরফের সমন্বয়ে পূর্ণাঙ্গ অনুচ্ছেদ তৈরি।",
        detail: "এই পাঠে শিক্ষার্থী পূর্ববর্তী ৯টি পাঠের সকল বাক্যগঠন একটি আকর্ষণীয় গল্পের মাধ্যমে একসাথে পাঠ ও অনুশীলন করবে। এর মাধ্যমে আরবি ভাষা সাবলীলভাবে পড়ার ও বোঝার ভিত্তি সুদৃঢ় হয়।"
      },
      vocabulary: [
        { arabic: "قَصْرٌ", bangla: "একটি প্রাসাদ", gender: "masculine", type: "বিশেষ্য", icon: "Landmark", audioText: "قَصْرٌ" },
        { arabic: "نَهْرٌ", bangla: "একটি নদী", gender: "masculine", type: "বিশেষ্য", icon: "Waves", audioText: "نَهْرٌ" },
        { arabic: "جَبَلٌ", bangla: "একটি পাহাড়", gender: "masculine", type: "বিশেষ্য", icon: "Mountain", audioText: "جَبَلٌ" },
        { arabic: "طَرِيقٌ", bangla: "পথ / রাস্তা", gender: "masculine", type: "বিশেষ্য", icon: "Milestone", audioText: "طَرِيقٌ" },
        { arabic: "مُؤْمِنٌ", bangla: "একজন ঈমানদার / মুমিন", gender: "masculine", type: "বিশেষ্য", icon: "Award", audioText: "مُؤْمِنٌ" },
        { arabic: "صَالِحٌ", bangla: "নেককার / সৎ", gender: "masculine", type: "সিফাত", icon: "Sparkles", audioText: "صَالِحٌ" },
        { arabic: "كَرِيمٌ", bangla: "সম্মানিত / দানশীল", gender: "masculine", type: "সিফাত", icon: "Heart", audioText: "كَرِيمٌ" }
      ],
      sentences: [
        { arabic: "هٰذِهِ قَرْيَتِي، هِيَ قَرْيَةٌ جَمِيلَةٌ", bangla: "ইহা আমার গ্রাম, এটি একটি সুন্দর গ্রাম।", grammarNote: "ইশারা, মুদাফ যমীর এবং মাওসূফ-সিফাতের চমৎকার সমন্বয়।" },
        { arabic: "فِي قَرْيَتِي مَسْجِدٌ كَبِيرٌ وَمَدْرَسَةٌ نَظِيفَةٌ", bangla: "আমার গ্রামে একটি বড় মসজিদ এবং একটি পরিচ্ছন্ন মাদরাসা আছে।", grammarNote: "জর-মাজরুর খবর + দ্বৈত মাওসূফ-সিফাত মুবতাদা।" },
        { arabic: "أَمَامَ الْمَسْجِدِ حَدِيقَةٌ وَاسِعَةٌ", bangla: "মসজিদের সামনে একটি প্রশস্ত বাগান আছে।", grammarNote: "যরফ দ্বারা স্থান ও বাগানের বর্ণনা।" },
        { arabic: "فِي الْحَدِيقَةِ أَشْجَارٌ وَأَزْهَارٌ", bangla: "বাগানে গাছপালা এবং ফুল রয়েছে।", grammarNote: "প্রকৃতির সৌন্দর্য বর্ণনায় আরবি রূপ।" }
      ],
      dialogues: [
        {
          question: { arabic: "مَا هٰذِهِ؟ وَكَيْفَ هِيَ؟", bangla: "ইহা কী? এবং ইহা কেমন?" },
          answer: { arabic: "هٰذِهِ حَدِيقَةُ الْمَدْرَسَةِ، وَهِيَ جَمِيلَةٌ جِدًّا.", bangla: "ইহা মাদরাসার বাগান, এবং এটি অত্যন্ত সুন্দর।" }
        },
        {
          question: { arabic: "مَنْ هٰذَا الرَّجُلُ الصَّالِحُ؟", bangla: "এই নেককার লোকটি কে?" },
          answer: { arabic: "هُوَ إِمَامُ مَسْجِدِ الْقَرْيَةِ.", bangla: "তিনি গ্রামের মসজিদের ইমাম।" }
        }
      ],
      quiz: [
        {
          id: "q10_1",
          type: "mcq",
          question: "'আমার গ্রামে একটি বড় মসজিদ আছে' বাক্যটির বিশুদ্ধ আরবি কোনটি?",
          options: ["فِي قَرْيَتِي مَسْجِدٌ كَبِيرٌ", "مَسْجِدٌ كَبِيرٌ فِي قَرْيَةٍ", "قَرْيَتِي فِي مَسْجِدٍ كَبِيرٍ", "عَلَى قَرْيَتِي الْمَسْجِدُ"],
          correctAnswer: 0,
          explanation: "জর-মাজরুর আগে এসে 'فِي قَرْيَتِي' এবং এরপর মাওসূফ-সিফাত 'مَسْجِدٌ كَبِيرٌ' বসবে।"
        },
        {
          id: "q10_2",
          type: "fill_blank",
          sentenceBefore: "أَمَامَ الْمَسْجِدِ حَدِيقَةٌ ",
          blankTarget: "وَاسِعَةٌ",
          sentenceAfter: "",
          meaning: "মসজিদের সামনে একটি প্রশস্ত বাগান আছে।",
          options: ["وَاسِعٌ", "وَاسِعَةٌ", "كَبِيرٌ", "جَمِيلٌ"],
          correctAnswer: 1,
          explanation: "حَدِيقَةٌ স্ত্রীলিঙ্গ মাওসূফ হওয়ায় সিফাতও স্ত্রীলিঙ্গ রূপ 'وَاسِعَةٌ' হবে।"
        },
        {
          id: "q10_3",
          type: "sentence_builder",
          instruction: "শব্দগুলো সাজিয়ে 'তিনি মসজিদের সম্মানিত ইমাম' বাক্যটি তৈরি করুন:",
          words: ["الْمَسْجِدِ", "إِمَامُ", "هُوَ"],
          correctOrder: ["هُوَ", "إِمَامُ", "الْمَسْجِدِ"],
          meaning: "তিনি মসজিদের ইমাম।",
          explanation: "যমীর মুবতাদা (هُوَ) + মুদাফ (إِمَامُ) + মুদাফ ইলাইহি (الْمَسْجِدِ)।"
        },
        {
          id: "q10_4",
          type: "grammar_tarkib",
          sentence: "هٰذِهِ قَرْيَةٌ جَمِيلَةٌ",
          question: "এই বাক্যে 'قَرْيَةٌ جَمِيلَةٌ' এর ব্যাকরণিক সম্পর্ক কী?",
          options: ["মাওসূফ ও সিফাত (যা মিলে খবর হয়েছে)", "মুদাফ ও মুদাফ ইলাইহি", "মুবতাদা ও খবর", "হরফে জর ও মাজরুর"],
          correctAnswer: 0,
          explanation: "قَرْيَةٌ হলো মাওসূফ (বিশেষ্য) এবং جَمِيلَةٌ হলো সিফাত (গুণ), উভয়টি মিলে هٰذِهِ মুবতাদার খবর হয়েছে।"
        }
      ]
    }
  ]
};

const outputPath = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
fs.writeFileSync(outputPath, JSON.stringify(lessonsData, null, 2), 'utf-8');
console.log(`Successfully written lessons data with ${lessonsData.lessons.length} lessons to: ${outputPath}`);
