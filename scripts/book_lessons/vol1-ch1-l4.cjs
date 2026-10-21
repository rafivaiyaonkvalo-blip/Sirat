// এসো আরবি শিখি — ১ম খণ্ড, ১ম অধ্যায়, ৪র্থ দারস (বই পৃষ্ঠা ২৯–৩৩, PDF পৃষ্ঠা ২৭–৩১)
// শুধু কিতাবের কনটেন্ট; হরকত সবখানে পূর্ণ।

const W = {
  // পৃ. ২৯
  kitab: { arabic: 'كِتَابٌ', bangla: 'একটি বই', picture: 'book' },
  alKitab: { arabic: 'اَلْكِتَابُ', bangla: 'বইটি', picture: 'book' },
  qalam: { arabic: 'قَلَمٌ', bangla: 'একটি কলম', picture: 'pen' },
  alQalam: { arabic: 'اَلْقَلَمُ', bangla: 'কলমটি', picture: 'pen' },
  darraja: { arabic: 'دَرَّاجَةٌ', bangla: 'একটি সাইকেল', picture: 'bicycle' },
  alDarraja: { arabic: 'اَلدَّرَّاجَةُ', bangla: 'সাইকেলটি', picture: 'bicycle' },
  nafida: { arabic: 'نَافِذَةٌ', bangla: 'একটি জানালা', picture: 'window' },
  alNafida: { arabic: 'اَلنَّافِذَةُ', bangla: 'জানালাটি', picture: 'window' },
  // পৃ. ৩০
  sharif: { arabic: 'شَرِيفٌ', bangla: 'ভদ্র' },
  mujtahid: { arabic: 'مُجْتَهِدٌ', bangla: 'পরিশ্রমী' },
  mahir: { arabic: 'مَاهِرٌ', bangla: 'দক্ষ' },
  mashhur: { arabic: 'مَشْهُورٌ', bangla: 'প্রসিদ্ধ' },
  maftuh: { arabic: 'مَفْتُوحٌ', bangla: 'খোলা' },
  mughlaq: { arabic: 'مُغْلَقٌ', bangla: 'বন্ধ' },
  wasi: { arabic: 'وَاسِعٌ', bangla: 'প্রশস্ত' },
  dayyiq: { arabic: 'ضَيِّقٌ', bangla: 'অপ্রশস্ত, সংকীর্ণ' },
  qawi: { arabic: 'قَوِيٌّ', bangla: 'শক্তিশালী, মজবুত' },
  daif: { arabic: 'ضَعِيفٌ', bangla: 'দুর্বল' },
  // পৃ. ৩২
  jamal: { arabic: 'جَمَلٌ', bangla: 'একটি উট', picture: 'camel' },
  naqa: { arabic: 'نَاقَةٌ', bangla: 'একটি উষ্ট্রী', picture: 'camel' },
  kayfa: { arabic: 'كَيْفَ؟', bangla: 'কেমন? কীভাবে?' },
  mufid: { arabic: 'مُفِيدٌ', bangla: 'উপকারী' }
};

const NAMES = {
  rashid: { arabic: 'رَاشِدٌ', bangla: 'রাশেদ', g: 'm' },
  said: { arabic: 'سَعِيدٌ', bangla: 'সাঈদ', g: 'm' },
  khalid: { arabic: 'خَالِدٌ', bangla: 'খালেদ', g: 'm' },
  mahmud: { arabic: 'مَحْمُودٌ', bangla: 'মাহমূদ', g: 'm' },
  farhana: { arabic: 'فَرْحَانَةُ', bangla: 'ফারহানা', g: 'f' },
  lubana: { arabic: 'لُبَانَةُ', bangla: 'লুবানা', g: 'f' },
  khadija: { arabic: 'خَدِيجَةُ', bangla: 'খাদীজা', g: 'f' }
};

const T = (arabic, bangla, page, picture, distance) => ({ arabic, bangla, page, picture, distance });

const SENT = {
  hathaKitab: T('هٰذَا كِتَابٌ', 'ইহা একটি বই', '৩০', 'book', 'near'),
  hathaKitabJadid: T('هٰذَا كِتَابٌ جَدِيدٌ', 'ইহা একটি নতুন বই', '৩০', 'book', 'near'),
  alKitabJadid: T('اَلْكِتَابُ جَدِيدٌ', 'বইটি নতুন', '৩০', 'book'),
  alKitabKabir: T('اَلْكِتَابُ كَبِيرٌ', 'বইটি বড়', '৩০', 'book'),
  alKitabJamil: T('اَلْكِتَابُ جَمِيلٌ', 'বইটি সুন্দর', '৩০', 'book'),
  
  hathihiMadrasa: T('هٰذِهِ مَدْرَسَةٌ', 'ইহা একটি মাদরাসা', '৩০', 'school', 'near'),
  hathihiMadrasaSaghira: T('هٰذِهِ مَدْرَسَةٌ صَغِيرَةٌ', 'ইহা একটি ছোট মাদরাসা', '৩০', 'school', 'near'),
  alMadrasaSaghira: T('اَلْمَدْرَسَةُ صَغِيرَةٌ', 'মাদরাসাটি ছোট', '৩০', 'school'),
  alMadrasaJamila: T('اَلْمَدْرَسَةُ جَمِيلَةٌ', 'মাদরাসাটি সুন্দর', '৩০', 'school'),
  alMadrasaQadima: T('اَلْمَدْرَسَةُ قَدِيمَةٌ', 'মাদরাসাটি পুরোনো', '৩০', 'school'),

  dhalikaMasjid: T('ذٰلِكَ مَسْجِدٌ', 'উহা একটি মসজিদ', '৩০', 'mosque', 'far'),
  dhalikaMasjidJamil: T('ذٰلِكَ مَسْجِدٌ جَمِيلٌ', 'উহা একটি সুন্দর মসজিদ', '৩০', 'mosque', 'far'),
  alMasjidJamil: T('اَلْمَسْجِدُ جَمِيلٌ', 'মসজিদটি সুন্দর', '৩০', 'mosque'),
  alMasjidKabir: T('اَلْمَسْجِدُ كَبِيرٌ', 'মসজিদটি বড়', '৩০', 'mosque'),
  alMasjidQadim: T('اَلْمَسْجِدُ قَدِيمٌ', 'মসজিদটি পুরোনো', '৩০', 'mosque'),
  
  tilkaSaa: T('تِلْكَ سَاعَةٌ', 'উহা একটি ঘড়ি', '৩০', 'clock', 'far'),
  alSaaJadida: T('اَلسَّاعَةُ جَدِيدَةٌ', 'ঘড়িটি নতুন', '৩০', 'clock'),
  alSaaJayyida: T('اَلسَّاعَةُ جَيِّدَةٌ', 'ঘড়িটি ভালো', '৩০', 'clock'),
  alSaaJamila: T('اَلسَّاعَةُ جَمِيلَةٌ', 'ঘড়িটি সুন্দর', '৩০', 'clock'),
  
  arRajulSharif: T('اَلرَّجُلُ شَرِيفٌ', 'লোকটি ভদ্র', '৩০'),
  alWaladDhaki: T('اَلْوَلَدُ ذَكِيٌّ', 'ছেলেটি মেধাবী', '৩০'),
  alBintDhakiyya: T('اَلْبِنْتُ ذَكِيَّةٌ', 'মেয়েটি মেধাবী', '৩০'),
  atTiflJamil: T('اَلطِّفْلُ جَمِيلٌ', 'শিশুটি সুন্দর', '৩০'),
  atTiflSaghir: T('اَلطِّفْلُ صَغِيرٌ', 'শিশুটি ছোট', '৩০'),
  atTiflaJamila: T('اَلطِّفْلَةُ جَمِيلَةٌ', 'শিশুটি সুন্দর', '৩০'),
  atTiflaSaghira: T('اَلطِّفْلَةُ صَغِيرَةٌ', 'শিশুটি ছোট', '৩০'),
  
  atTilmidhMujtahid: T('اَلتِّلْمِيذُ مُجْتَهِدٌ', 'ছাত্রটি পরিশ্রমী', '৩১'),
  atTilmidhaMujtahida: T('اَلتِّلْمِيذَةُ مُجْتَهِدَةٌ', 'ছাত্রীটি পরিশ্রমী', '৩১'),
  hathaBabWasi: T('هٰذَا بَابٌ وَاسِعٌ', 'ইহা একটি প্রশস্ত দরজা', '৩১'),
  alBabMaftuh: T('اَلْبَابُ مَفْتُوحٌ', 'দরজাটি খোলা', '৩১'),
  
  hathaQamis: T('هٰذَا قَمِيصٌ', 'ইহা একটি জামা', '৩১'),
  hathaQamisJadid: T('هٰذَا قَمِيصٌ جَدِيدٌ', 'ইহা একটি নতুন জামা', '৩১'),
  alQamisNadhif: T('اَلْقَمِيصُ نَظِيفٌ', 'জামাটি পরিচ্ছন্ন', '৩১'),
  alMindilWasikh: T('اَلْمِنْدِيلُ وَسِخٌ', 'রুমালটি ময়লা', '৩১'),
  alWisadaJamila: T('اَلْوِسَادَةُ جَمِيلَةٌ', 'বালিশটি সুন্দর', '৩১'),
  
  rashidMuallim: T('رَاشِدٌ مُعَلِّمٌ', 'রাশেদ একজন শিক্ষক', '৩১'),
  huwaMuallimMahir: T('هُوَ مُعَلِّمٌ مَاهِرٌ', 'সে একজন দক্ষ শিক্ষক', '৩১'),
  farhanaMuallima: T('فَرْحَانَةُ مُعَلِّمَةٌ', 'ফারহানা একজন শিক্ষিকা', '৩১'),
  hiyaMuallimaMahira: T('هِيَ مُعَلِّمَةٌ مَاهِرَةٌ', 'সে একজন দক্ষ শিক্ষিকা', '৩১'),
  
  yaSaidAntaTajirMashhur: T('يَا سَعِيدُ! أَنْتَ تَاجِرٌ مَشْهُورٌ', 'হে সাঈদ! তুমি একজন প্রসিদ্ধ ব্যবসায়ী', '৩১'),
  yaLubanaAntiFallahaFaqira: T('يَا لُبَانَةُ! أَنْتِ فَلَّاحَةٌ فَقِيرَةٌ', 'হে লুবানা! তুমি একজন গরীব কৃষানি', '৩১'),
  antiImraaSharifa: T('أَنْتِ امْرَأَةٌ شَرِيفَةٌ', 'তুমি একজন ভদ্র মহিলা', '৩১'),
  alMarAaSharifa: T('اَلْمَرْأَةُ شَرِيفَةٌ', 'স্ত্রীলোকটি ভদ্র', '৩১'),

  kitabJamil: T('كِتَابٌ جَمِيلٌ', 'একটি সুন্দর বই', '৩২'),
  hathaKitabJamil: T('هٰذَا كِتَابٌ جَمِيلٌ', 'ইহা একটি সুন্দর বই', '৩২'),
  hathalKitabJamil: T('هٰذَا الْكِتَابُ جَمِيلٌ', 'এই বইটি সুন্দর', '৩২'),
  
  saaJadida: T('سَاعَةٌ جَدِيدَةٌ', 'একটি নতুন ঘড়ি', '৩২'),
  hathihiSaaJadida: T('هٰذِهِ سَاعَةٌ جَدِيدَةٌ', 'ইহা একটি নতুন ঘড়ি', '৩২'),
  hathihisSaaJadida: T('هٰذِهِ السَّاعَةُ جَدِيدَةٌ', 'এই ঘড়িটি নতুন', '৩২'),
  
  rajulSharif: T('رَجُلٌ شَرِيفٌ', 'একজন ভদ্র লোক', '৩২'),
  huwaRajulSharif: T('هُوَ رَجُلٌ شَرِيفٌ', 'সে একজন ভদ্র লোক', '৩২'),
  dhalikarRajulSharif: T('ذٰلِكَ الرَّجُلُ شَرِيفٌ', 'ঐ লোকটি ভদ্র', '৩২'),
  
  hathatTilmidhDhaki: T('هٰذَا التِّلْمِيذُ ذَكِيٌّ', 'এই ছাত্রটি মেধাবী', '৩২'),
  atTajirGhani: T('اَلتَّاجِرُ غَنِيٌّ', 'ব্যবসায়ীটি ধনী', '৩২'),
  dhalikatTajirGhani: T('ذٰلِكَ التَّاجِرُ غَنِيٌّ', 'ঐ ব্যবসায়ীটি ধনী', '৩২'),
  
  alFallahaFaqira: T('اَلْفَلَّاحَةُ فَقِيرَةٌ', 'কৃষানিটি গরীব', '৩২'),
  tilkalFallahaFaqira: T('تِلْكَ الْفَلَّاحَةُ فَقِيرَةٌ', 'ঐ কৃষানিটি গরীব', '৩২'),
  
  hathalJidarQawi: T('هٰذَا الْجِدَارُ قَوِيٌّ', 'এই দেয়ালটি মজবুত', '৩২'),
  waDhalikalJidarDaif: T('وَذٰلِكَ الْجِدَارُ ضَعِيفٌ', 'এবং ঐ দেয়ালটি দুর্বল', '৩২'),
  
  hathalWaladQawi: T('هٰذَا الْوَلَدُ قَوِيٌّ', 'এই ছেলেটি শক্তিশালী', '৩২'),
  waDhalikalWaladDaif: T('وَذٰلِكَ الْوَلَدُ ضَعِيفٌ', 'এবং ঐ ছেলেটি দুর্বল', '৩২'),
  
  hathihisSaaJadida2: T('هٰذِهِ السَّاعَةُ جَدِيدَةٌ', 'এই ঘড়িটি নতুন', '৩২'),
  waTilkasSaaQadima: T('وَتِلْكَ السَّاعَةُ قَدِيمَةٌ', 'এবং ঐ ঘড়িটি পুরোনো', '৩২'),
  
  hathalMindilWasikh: T('هٰذَا الْمِنْدِيلُ وَسِخٌ', 'এই রুমালটি ময়লা', '৩২'),
  waDhalikalMindilNadhif: T('وَذٰلِكَ الْمِنْدِيلُ نَظِيفٌ', 'এবং ঐ রুমালটি পরিচ্ছন্ন', '৩২'),
  
  yaKhalidAnaTajirWaAntaFallah: T('يَا خَالِدُ! أَنَا تَاجِرٌ وَأَنْتَ فَلَّاحٌ', 'হে খালেদ! আমি একজন ব্যবসায়ী এবং তুমি একজন কৃষক', '৩২'),
  anaTajirGhaniWaAntaFallahFaqir: T('أَنَا تَاجِرٌ غَنِيٌّ وَأَنْتَ فَلَّاحٌ فَقِيرٌ', 'আমি একজন ধনী ব্যবসায়ী এবং তুমি একজন গরীব কৃষক', '৩২'),
  yaKhadijaAntiImraaSharifa: T('يَا خَدِيجَةُ! أَنْتِ امْرَأَةٌ شَرِيفَةٌ', 'হে খাদীজা! তুমি একজন ভদ্র মহিলা', '৩২'),
  
  hathaJamal: T('هٰذَا جَمَلٌ', 'ইহা একটি উট', '৩২'),
  waTilkaNaqa: T('وَتِلْكَ نَاقَةٌ', 'এবং উহা একটি উষ্ট্রী', '৩২'),
  hathalJamalKabir: T('هٰذَا الْجَمَلُ كَبِيرٌ', 'এই উটটি বড়', '৩২'),
  waDhalikalJamalSaghir: T('وَذٰلِكَ الْجَمَلُ صَغِيرٌ', 'এবং ঐ উটটি ছোট', '৩২'),
  hathihinNaqaSaghira: T('هٰذِهِ النَّاقَةُ صَغِيرَةٌ', 'এই উষ্ট্রীটি ছোট', '৩২'),
  waTilkanNaqaKabira: T('وَتِلْكَ النَّاقَةُ كَبِيرَةٌ', 'এবং ঐ উষ্ট্রীটি বড়', '৩২')
};

const QA = [
  // পৃ. ৩১
  { q: T('مَا هٰذِهِ؟', 'ইহা কী?'), a: T('هٰذِهِ سَاعَةٌ', 'ইহা একটি ঘড়ি'), wrong: ['هٰذَا سَاعَةٌ', 'تِلْكَ سَاعَةٌ'] },
  { q: T('كَيْفَ السَّاعَةُ؟', 'ঘড়িটি কেমন?'), a: T('اَلسَّاعَةُ جَمِيلَةٌ', 'ঘড়িটি সুন্দর'), wrong: ['اَلسَّاعَةُ جَمِيلٌ', 'هُوَ جَمِيلَةٌ'] },
  { q: T('مَا ذٰلِكَ؟', 'উহা কী?'), a: T('ذٰلِكَ بَيْتٌ', 'উহা একটি ঘর'), wrong: ['تِلْكَ بَيْتٌ', 'هٰذَا بَيْتٌ'] },
  { q: T('كَيْفَ الْبَيْتُ؟', 'ঘরটি কেমন?'), a: T('اَلْبَيْتُ جَمِيلٌ', 'ঘরটি সুন্দর'), wrong: ['اَلْبَيْتُ جَمِيلَةٌ', 'هِيَ جَمِيلٌ'] },
  { q: T('مَنْ هُوَ؟', 'সে কে?'), a: T('هُوَ تِلْمِيذٌ جَدِيدٌ', 'সে একজন নতুন ছাত্র'), wrong: ['هِيَ تِلْمِيذَةٌ جَدِيدَةٌ', 'أَنَا تِلْمِيذٌ جَدِيدٌ'] },
  { q: T('كَيْفَ التِّلْمِيذُ؟', 'ছাত্রটি কেমন?'), a: T('اَلتِّلْمِيذُ ذَكِيٌّ', 'ছাত্রটি মেধাবী'), wrong: ['اَلتِّلْمِيذَةُ ذَكِيَّةٌ', 'اَلتِّلْمِيذُ ذَكِيَّةٌ'] },
  { q: T('مَنْ هِيَ؟', 'সে কে?'), a: T('هِيَ تِلْمِيذَةٌ جَدِيدَةٌ', 'সে একজন নতুন ছাত্রী'), wrong: ['هُوَ تِلْمِيذٌ جَدِيدٌ', 'هِيَ تِلْمِيذَةٌ'] },
  { q: T('كَيْفَ التِّلْمِيذَةُ؟', 'ছাত্রীটি কেমন?'), a: T('اَلتِّلْمِيذَةُ ذَكِيَّةٌ', 'ছাত্রীটি মেধাবী'), wrong: ['اَلتِّلْمِيذَةُ ذَكِيٌّ', 'هُوَ ذَكِيَّةٌ'] },
  { q: T('كَيْفَ الرَّجُلُ؟', 'লোকটি কেমন?'), a: T('اَلرَّجُلُ شَرِيفٌ', 'লোকটি ভদ্র'), wrong: ['اَلرَّجُلُ شَرِيفَةٌ', 'هِيَ شَرِيفٌ'] },
  { q: T('كَيْفَ الْمَرْأَةُ؟', 'মহিলাটি কেমন?'), a: T('اَلْمَرْأَةُ شَرِيفَةٌ', 'মহিলাটি ভদ্র'), wrong: ['اَلْمَرْأَةُ شَرِيفٌ', 'هُوَ شَرِيفَةٌ'] },
  
  // পৃ. ৩৩
  { q: T('كَيْفَ هٰذَا الْكِتَابُ؟', 'এই বইটি কেমন?'), a: T('هٰذَا الْكِتَابُ مُفِيدٌ', 'এই বইটি উপকারী'), wrong: ['هٰذَا الْكِتَابُ مُفِيدَةٌ', 'هٰذِهِ الْكِتَابُ مُفِيدٌ'] },
  { q: T('كَيْفَ تِلْكَ السَّاعَةُ؟', 'ঐ ঘড়িটি কেমন?'), a: T('تِلْكَ السَّاعَةُ جَدِيدَةٌ', 'ঐ ঘড়িটি নতুন'), wrong: ['تِلْكَ السَّاعَةُ جَدِيدٌ', 'ذٰلِكَ السَّاعَةُ جَدِيدَةٌ'] },
  { q: T('كَيْفَ ذٰلِكَ التِّلْمِيذُ؟', 'ঐ ছাত্রটি কেমন?'), a: T('ذٰلِكَ التِّلْمِيذُ ذَكِيٌّ', 'ঐ ছাত্রটি মেধাবী'), wrong: ['ذٰلِكَ التِّلْمِيذُ ذَكِيَّةٌ', 'تِلْكَ التِّلْمِيذُ ذَكِيٌّ'] },
  { q: T('كَيْفَ تِلْكَ الْبِنْتُ؟', 'ঐ মেয়েটি কেমন?'), a: T('تِلْكَ الْبِنْتُ ذَكِيَّةٌ', 'ঐ মেয়েটি মেধাবী'), wrong: ['تِلْكَ الْبِنْتُ ذَكِيٌّ', 'ذٰلِكَ الْبِنْتُ ذَكِيَّةٌ'] },
  { q: T('هَلْ هٰذِهِ الْحَقِيبَةُ جَمِيلَةٌ؟', 'এই ব্যাগটি কি সুন্দর?'), a: T('نَعَمْ .. هٰذِهِ الْحَقِيبَةُ جَمِيلَةٌ', 'হাঁ.. এই ব্যাগটি সুন্দর'), wrong: ['لَا .. هٰذِهِ الْحَقِيبَةُ جَمِيلَةٌ', 'نَعَمْ .. هٰذَا الْحَقِيبَةُ جَمِيلَةٌ'] },
  { q: T('هَلْ تِلْكَ السَّاعَةُ جَدِيدَةٌ؟', 'ঐ ঘড়িটি কি নতুন?'), a: T('لَا .. تِلْكَ السَّاعَةُ قَدِيمَةٌ', 'না.. ঐ ঘড়িটি পুরোনো'), wrong: ['نَعَمْ .. تِلْكَ السَّاعَةُ قَدِيمَةٌ', 'لَا .. ذٰلِكَ السَّاعَةُ قَدِيمَةٌ'] },
  { q: T('هَلْ تِلْكَ الْبِنْتُ ذَكِيَّةٌ؟', 'ঐ মেয়েটি কি মেধাবী?'), a: T('نَعَمْ .. هِيَ ذَكِيَّةٌ', 'হাঁ.. সে মেধাবী'), wrong: ['نَعَمْ .. هُوَ ذَكِيَّةٌ', 'لَا .. هِيَ ذَكِيَّةٌ'] },
  { q: T('مَنْ هٰذَا الرَّجُلُ؟', 'এই লোকটি কে?'), a: T('هُوَ مَحْمُودٌ - هُوَ تَاجِرٌ كَبِيرٌ', 'সে মাহমূদ - সে একজন বড় ব্যবসায়ী'), wrong: ['هِيَ مَحْمُودٌ', 'هُوَ مَحْمُودٌ - هُوَ تَاجِرٌ كَبِيرَةٌ'] },
  { q: T('مَنْ هٰذِهِ الْمَرْأَةُ؟', 'এই মহিলাটি কে?'), a: T('هِيَ خَدِيجَةُ - هِيَ امْرَأَةٌ فَقِيرَةٌ', 'সে খাদীজা - সে একজন গরীব মহিলা'), wrong: ['هُوَ خَدِيجَةُ', 'هِيَ خَدِيجَةُ - هِيَ امْرَأَةٌ فَقِيرٌ'] }
];

// ---------- ধাপ তৈরির ছোট সহায়ক ----------

const intro = (item, title = 'নতুন শব্দ') => ({
  type: 'intro',
  title,
  word: { arabic: item.arabic, bangla: item.bangla },
  picture: item.picture
});

const introSentence = (sent) => intro(sent, 'কিতাবের বাক্য');

const match = (items, title = 'শব্দজোড় মেলান') => ({
  type: 'match_pairs',
  title,
  pairs: items.map(({ arabic, bangla }) => ({ arabic, bangla }))
});

const meaningOf = (item, wrongBanglas, question = 'বাক্যটির অর্থ কী?') => ({
  type: 'mcq',
  word: { arabic: item.arabic, bangla: item.bangla },
  question,
  options: [item.bangla, ...wrongBanglas].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const arabicOf = (item, wrongArabics) => ({
  type: 'mcq',
  word: { arabic: item.bangla, bangla: item.bangla },
  question: `"${item.bangla}" এর আরবি কোনটি?`,
  options: [item.arabic, ...wrongArabics].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const fill = (sent, index, wrong, title = 'খালি জায়গা পূরণ করুন') => {
  const tokens = sent.arabic.split(' ');
  return {
    type: 'fill_blank',
    title,
    targetBangla: sent.bangla,
    fullArabic: sent.arabic,
    tokensBefore: tokens.slice(0, index),
    tokensAfter: tokens.slice(index + 1),
    missingToken: tokens[index],
    options: [tokens[index], ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
  };
};

const build = (sent, distractors) => ({
  type: 'sentence_builder',
  title: 'কিতাবের বাক্য সাজান',
  targetArabic: sent.arabic,
  targetBangla: sent.bangla,
  targetTokens: sent.arabic.split(' '),
  distractors
});

const dialogue = ({ q, a, wrong }, speaker = 'প্রশ্নোত্তর পড়ো ও অর্থ বলো') => ({
  type: 'dialogue_listen',
  speaker,
  questionArabic: q.arabic,
  questionBangla: q.bangla,
  options: [a.arabic, ...wrong].map((text, i) => ({ text, isCorrect: i === 0 }))
});

const spot = (targetBangla, right, wrong, why) => ({
  type: 'spot_error',
  title: 'কোন বাক্যটি কিতাবের মতো শুদ্ধ?',
  targetBangla,
  options: [
    { text: right, isCorrect: true, explanation: `কিতাবে আছে: ${right}` },
    { text: wrong, isCorrect: false, explanation: why }
  ]
});

const quiz = (question, options, explanation) => ({
  type: 'quiz_challenge',
  question,
  explanation,
  options: options.map((text, i) => ({ text, isCorrect: i === 0 }))
});

const MAX_OPTIONS = 3;
const trimOptions = (step) => {
  if (step.type === 'picture_choice') return step;
  if (!Array.isArray(step.options) || step.options.length <= MAX_OPTIONS) return step;
  const correct = step.options.filter(o => o.isCorrect);
  const wrong = step.options.filter(o => !o.isCorrect).slice(0, MAX_OPTIONS - correct.length);
  return { ...step, options: [...correct, ...wrong] };
};

const stage = (meta, steps) => ({ ...meta, steps: steps.map(trimOptions) });

const pictureChoice = (correctKey, otherKeys, title = 'ছবি দেখে সঠিক উত্তর দিন') => ({
  type: 'picture_choice',
  title,
  targetArabic: W[correctKey].arabic,
  options: [correctKey, ...otherKeys].map((k, i) => ({
    text: W[k].arabic,
    bangla: W[k].bangla,
    picture: W[k].picture,
    isCorrect: i === 0
  }))
});

// ---------- পর্বসমূহ (কিতাবের ক্রমে) ----------

const bookStages = [
  stage(
    {
      id: 'l4-words-1',
      titleBn: 'শব্দার্থ (১/২)',
      shortTitle: 'শব্দার্থ ১',
      titleAr: 'الْمُفْرَدَاتُ (١)',
      desc: 'বইটি, কলমটি, সাইকেলটি, জানালাটি',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '২৯'
    },
    [
      intro(W.alKitab), intro(W.alQalam),
      match([W.alKitab, W.alQalam, W.kitab, W.qalam]),
      intro(W.alDarraja), intro(W.alNafida),
      match([W.alDarraja, W.alNafida, W.darraja, W.nafida]),
      pictureChoice('alKitab', ['alQalam', 'alDarraja', 'alNafida']),
      pictureChoice('alDarraja', ['alNafida', 'alKitab', 'alQalam']),
      meaningOf(W.alNafida, ['জানালা', 'একটি সাইকেল'])
    ]
  ),
  
  stage(
    {
      id: 'l4-grammar-al',
      titleBn: 'اَلْ যুক্ত করার নিয়ম',
      shortTitle: 'اَلْ এর নিয়ম',
      titleAr: 'قَاعِدَةُ ال',
      desc: 'কখন লাম উচ্চারিত হয়, আর কখন হয় না',
      iconName: 'Sparkles',
      color: 'teal',
      estMinutes: 3,
      bookPages: '২৯'
    },
    [
      {
        type: 'grammar_card',
        title: 'اَلْ যুক্ত করার নিয়ম',
        summary: '১৪টি হরফে (যেমন: ب, ك, ق) اَلْ যুক্ত হলে লাম উচ্চারিত হয়। বাকি ১৪টি হরফে (যেমন: ت, ش, س, ن) লাম উচ্চারিত হয় না, বরং পরের হরফটি তাশদীদযুক্ত হয়।',
        table: [
          { arabic: 'كِتَابٌ - اَلْكِتَابُ', bangla: 'بَيْتٌ - اَلْبَيْتُ' },
          { arabic: 'تِلْمِيذٌ - اَلتِّلمِيذُ', bangla: 'رَجُلٌ - اَلرَّجُلُ' }
        ]
      },
      spot('বইটি', 'اَلْكِتَابُ', 'اَكِّتَابُ', 'ك হরফে লাম উচ্চারিত হয়।'),
      spot('ছাত্রটি', 'اَلتِّلْمِيذُ', 'اَلْتِلْمِيذُ', 'ت হরফে লাম উচ্চারিত না হয়ে তাশদীদ হয়।'),
      meaningOf({ arabic: 'اَلرَّجُلُ', bangla: 'লোকটি' }, ['একজন লোক', 'ছাত্রটি']),
      arabicOf({ arabic: 'اَلسَّاعَةُ', bangla: 'ঘড়িটি' }, ['سَاعَةٌ', 'هٰذِهِ سَاعَةٌ']),
      fill(SENT.alKitabJadid, 0, ['كِتَابٌ', 'كِتَابُ'])
    ]
  ),
  
  stage(
    {
      id: 'l4-sentences-1',
      titleBn: 'বাক্য (১/২)',
      shortTitle: 'বাক্য ১',
      titleAr: 'الْجُمَلُ (١)',
      desc: 'এই বইটি সুন্দর, ঐ মসজিদটি পুরোনো',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩০'
    },
    [
      introSentence(SENT.hathaKitabJadid),
      introSentence(SENT.alKitabJamil),
      introSentence(SENT.hathihiMadrasaSaghira),
      introSentence(SENT.alMadrasaQadima),
      build(SENT.alMadrasaJamila, ['مَدْرَسَةٌ', 'هٰذِهِ']),
      introSentence(SENT.dhalikaMasjidJamil),
      introSentence(SENT.alMasjidQadim),
      introSentence(SENT.tilkaSaa),
      introSentence(SENT.alSaaJadida),
      fill(SENT.hathihiMadrasaSaghira, 1, ['مَدْرَسَةُ']),
      build(SENT.dhalikaMasjidJamil, ['اَلْمَسْجِدُ', 'قَدِيمٌ']),
      meaningOf(SENT.alSaaJayyida, ['ঘড়িটি নতুন', 'উহা একটি ঘড়ি'])
    ]
  ),
  
  stage(
    {
      id: 'l4-words-2',
      titleBn: 'শব্দার্থ (২/২)',
      shortTitle: 'শব্দার্থ ২',
      titleAr: 'الْمُفْرَدَاتُ (٢)',
      desc: 'ভদ্র, পরিশ্রমী, দক্ষ, প্রসিদ্ধ, খোলা, বন্ধ',
      iconName: 'BookOpen',
      color: 'emerald',
      estMinutes: 3,
      bookPages: '৩০'
    },
    [
      intro(W.sharif), intro(W.mujtahid), intro(W.mahir), intro(W.mashhur),
      match([W.sharif, W.mujtahid, W.mahir, W.mashhur]),
      intro(W.maftuh), intro(W.mughlaq), intro(W.wasi), intro(W.dayyiq),
      match([W.maftuh, W.mughlaq, W.wasi, W.dayyiq]),
      intro(W.qawi), intro(W.daif),
      match([W.qawi, W.daif, W.kayfa, W.mufid]),
      meaningOf(W.mujtahid, ['দক্ষ', 'ভদ্র'])
    ]
  ),
  
  stage(
    {
      id: 'l4-sentences-2',
      titleBn: 'বাক্য (২/২)',
      shortTitle: 'বাক্য ২',
      titleAr: 'الْجُمَلُ (٢)',
      desc: 'ছেলেটি মেধাবী, দরজাটি খোলা, জামাটি পরিচ্ছন্ন',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩০–৩১'
    },
    [
      introSentence(SENT.arRajulSharif),
      introSentence(SENT.alWaladDhaki),
      introSentence(SENT.atTiflJamil),
      introSentence(SENT.atTilmidhMujtahid),
      fill(SENT.alBintDhakiyya, 0, ['اَلْوَلَدُ', 'بِنْتٌ']),
      build(SENT.atTiflaJamila, ['اَلطِّفْلُ', 'جَمِيلٌ']),
      introSentence(SENT.alBabMaftuh),
      introSentence(SENT.alQamisNadhif),
      introSentence(SENT.alMindilWasikh),
      introSentence(SENT.huwaMuallimMahir),
      fill(SENT.hathaBabWasi, 2, ['وَاسِعَةٌ', 'ضَيِّقٌ']),
      meaningOf(SENT.hiyaMuallimaMahira, ['সে একজন প্রসিদ্ধ শিক্ষিকা', 'সে একজন পরিশ্রমী ছাত্রী']),
      arabicOf(SENT.alQamisNadhif, ['هٰذَا قَمِيصٌ نَظِيفٌ', 'اَلْقَمِيصُ وَسِخٌ'])
    ]
  ),
  
  stage(
    {
      id: 'l4-sentences-3',
      titleBn: 'বাক্য (৩/৩)',
      shortTitle: 'বাক্য ৩',
      titleAr: 'الْجُمَلُ (٣)',
      desc: 'এই বইটি সুন্দর, ঐ লোকটি ভদ্র',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩২'
    },
    [
      {
        type: 'grammar_card',
        title: 'هٰذَا كِتَابٌ বনাম هٰذَا الْكِتَابُ',
        summary: 'ইশারার পরে اَلْ না থাকলে সেটা পূর্ণ বাক্য হয়। اَلْ থাকলে সেটা বাক্যের অংশ হয়।',
        table: [
          { arabic: 'هٰذَا كِتَابٌ', bangla: 'ইহা একটি বই' },
          { arabic: 'هٰذَا الْكِتَابُ', bangla: 'এই বইটি' },
          { arabic: 'هٰذَا الْكِتَابُ جَمِيلٌ', bangla: 'এই বইটি সুন্দর' }
        ]
      },
      introSentence(SENT.hathalKitabJamil),
      introSentence(SENT.hathihisSaaJadida),
      introSentence(SENT.dhalikarRajulSharif),
      introSentence(SENT.dhalikatTajirGhani),
      introSentence(SENT.tilkalFallahaFaqira),
      fill(SENT.hathihisSaaJadida2, 0, ['هٰذَا', 'تِلْكَ']),
      build(SENT.dhalikarRajulSharif, ['رَجُلٌ', 'شَرِيفَةٌ']),
      spot('এই ঘড়িটি নতুন', 'هٰذِهِ السَّاعَةُ جَدِيدَةٌ', 'هٰذِهِ سَاعَةٌ جَدِيدَةٌ', 'هٰذِهِ سَاعَةٌ অর্থ "ইহা একটি ঘড়ি"'),
      introSentence(SENT.waDhalikalJidarDaif),
      introSentence(SENT.waDhalikalMindilNadhif),
      meaningOf(SENT.hathalJidarQawi, ['এই দেয়ালটি দুর্বল', 'উহা একটি শক্তিশালী দেয়াল'])
    ]
  ),
  
  stage(
    {
      id: 'l4-qa-1',
      titleBn: 'প্রশ্নোত্তর (১/২)',
      shortTitle: 'প্রশ্নোত্তর ১',
      titleAr: 'سُؤَالٌ وَجَوَابٌ (١)',
      desc: 'মَا هٰذِهِ؟ كَيْفَ الْبَيْتُ؟',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩১–৩৩'
    },
    [
      ...QA.slice(0, 9).map(item => dialogue(item)),
      fill(QA[1].a, 0, ['اَلسَّاعَةٌ', 'سَاعَةٌ']),
      meaningOf(QA[5].q, ['ছাত্রীটি কেমন?', 'সে কে?'])
    ]
  ),

  stage(
    {
      id: 'l4-qa-2',
      titleBn: 'প্রশ্নোত্তর (২/২)',
      shortTitle: 'প্রশ্নোত্তর ২',
      titleAr: 'سُؤَالٌ وَجَوَابٌ (٢)',
      desc: 'هَلْ هٰذِهِ الْحَقِيبَةُ جَمِيلَةٌ؟ ...',
      iconName: 'MessageSquare',
      color: 'cyan',
      estMinutes: 3,
      bookPages: '৩৩'
    },
    [
      ...QA.slice(9).map(item => dialogue(item)),
      spot('না.. ঐ ঘড়িটি পুরোনো', 'لَا .. تِلْكَ السَّاعَةُ قَدِيمَةٌ', 'لَا .. تِلْكَ سَاعَةٌ قَدِيمَةٌ', 'এখানে নির্দিষ্ট ঘড়ির কথা বলা হয়েছে।'),
      build(QA[15].a, ['نَعَمْ', 'جَدِيدَةٌ']),
      meaningOf(QA[17].q, ['ঐ লোকটি কে?', 'এই মহিলাটি কে?'])
    ]
  ),

  stage(
    {
      id: 'l4-quiz',
      titleBn: 'চূড়ান্ত কুইজ',
      shortTitle: 'কুইজ',
      titleAr: 'الِاخْتِبَارُ',
      desc: 'পুরো দারসের শব্দ, বাক্য ও প্রশ্নোত্তরের যাচাই',
      iconName: 'Trophy',
      color: 'amber',
      estMinutes: 3,
      bookPages: '২৯–৩৩'
    },
    [
      quiz("'বইটি' এর আরবি কোনটি?", ['اَلْكِتَابُ', 'كِتَابٌ', 'هٰذَا كِتَابٌ'], 'اَلْ যুক্ত হলে নির্দিষ্ট অর্থ দেয়।'),
      quiz("'مُجْتَهِدٌ' শব্দের অর্থ কী?", ['পরিশ্রমী', 'মেধাবী', 'দক্ষ'], 'مُجْتَهِدٌ অর্থ পরিশ্রমী, ذَكِيٌّ অর্থ মেধাবী।'),
      quiz('কোন বাক্যটির অর্থ "এই বইটি সুন্দর"?', ['هٰذَا الْكِتَابُ جَمِيلٌ', 'هٰذَا كِتَابٌ جَمِيلٌ', 'اَلْكِتَابُ جَمِيلٌ'], 'هٰذَا الْكِتَابُ = এই বইটি।'),
      quiz("'رَجُلٌ' শব্দে اَلْ যুক্ত হলে উচ্চারিত রূপ কেমন হবে?", ['اَلرَّجُلُ', 'اَلْرَجُلُ', 'اَلرَجُلُ'], 'ر হরফে লাম উচ্চারিত না হয়ে তাশদীদ হয়।'),
      quiz('كَيْفَ السَّاعَةُ؟ এর সঠিক উত্তর কোনটি?', ['اَلسَّاعَةُ جَمِيلَةٌ', 'هٰذِهِ سَاعَةٌ', 'نَعَمْ، اَلسَّاعَةُ جَمِيلَةٌ'], 'كَيْفَ (কেমন) এর উত্তরে ন্যাম/লা হয় না।'),
      quiz("'قَوِيٌّ' এর বিপরীত শব্দ কোনটি?", ['ضَعِيفٌ', 'ضَيِّقٌ', 'مُغْلَقٌ'], 'قَوِيٌّ = শক্তিশালী, ضَعِيفٌ = দুর্বল।'),
      quiz('اِمْرَأَةٌ শব্দের শুরুতে اَلْ যুক্ত হলে কী হয়?', ['اَلْمَرْأَةُ', 'اَلْاِمْرَأَةُ', 'اَلْمِرْأَةُ'], 'কিতাব: اِمْرَأَةٌ পরিবর্তিত হয়ে اَلْمَرْأَةُ হয়।'),
      quiz("'هٰذَا بَابٌ وَاسِعٌ' এর অর্থ কী?", ['ইহা একটি প্রশস্ত দরজা', 'এই দরজাটি প্রশস্ত', 'উহা একটি প্রশস্ত দরজা'], 'هٰذَا بَابٌ = ইহা একটি দরজা।'),
      quiz("'مُغْلَقٌ' শব্দের অর্থ কী?", ['বন্ধ', 'খোলা', 'প্রশস্ত'], 'مُغْلَقٌ = বন্ধ, مَفْتُوحٌ = খোলা।'),
      quiz("'هِيَ مُعَلِّمَةٌ مَاهِرَةٌ' এর অর্থ কী?", ['সে একজন দক্ষ শিক্ষিকা', 'তুমি একজন দক্ষ শিক্ষিকা', 'সে একজন পরিশ্রমী শিক্ষিকা'], 'هِيَ = সে, مَاهِرَةٌ = দক্ষ।')
    ]
  )
];

// ---------- চর্চার পর্ব ----------

const insertAfter = (afterId, newStage) => {
  const idx = bookStages.findIndex(s => s.id === afterId);
  bookStages.splice(idx + 1, 0, newStage);
};

insertAfter('l4-sentences-1', stage(
  {
    id: 'l4-practice-1',
    titleBn: 'চর্চা: বাক্যগঠন',
    shortTitle: 'চর্চা ১',
    titleAr: 'التَّدْرِيبُ (١)',
    desc: 'اَلْ যুক্ত শব্দ ও সাধারণ বাক্যের মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '২৯–৩০'
  },
  [
    fill(SENT.alKitabJamil, 0, ['كِتَابٌ', 'كِتَابُ']),
    build(SENT.alMadrasaQadima, ['مَدْرَسَةٌ', 'قَدِيمٌ']),
    meaningOf(SENT.hathaKitabJadid, ['এই বইটি নতুন', 'উহা একটি নতুন বই']),
    spot('মসজিদটি বড়', 'اَلْمَسْجِدُ كَبِيرٌ', 'اَلْمَسْجِدُ كَبِيرَةٌ', 'مسجد পুরুষবাচক শব্দ।'),
    arabicOf(SENT.alSaaJadida, ['سَاعَةٌ جَدِيدَةٌ', 'هٰذِهِ سَاعَةٌ']),
    fill(SENT.alWaladDhaki, 1, ['ذَكِيَّةٌ']),
    build(SENT.atTiflJamil, ['اَلطِّفْلَةُ', 'جَمِيلَةٌ']),
    match([W.alKitab, W.alQalam, W.alDarraja, W.alNafida])
  ]
));

insertAfter('l4-sentences-3', stage(
  {
    id: 'l4-practice-2',
    titleBn: 'চর্চা: গুণবাচক শব্দ',
    shortTitle: 'চর্চা ২',
    titleAr: 'التَّدْرِيبُ (٢)',
    desc: 'ভদ্র, পরিশ্রমী, খোলা, প্রশস্ত ইত্যাদি শব্দের মিশ্র চর্চা',
    iconName: 'PenTool',
    color: 'amber',
    estMinutes: 3,
    bookPages: '৩০–৩২'
  },
  [
    match([W.mujtahid, W.mahir, W.wasi, W.dayyiq]),
    match([W.qawi, W.daif, W.maftuh, W.mughlaq]),
    fill(SENT.atTilmidhMujtahid, 1, ['مُجْتَهِدَةٌ', 'مُجْتَهِدُ']),
    fill(SENT.hathalJidarQawi, 2, ['قَوِيَّةٌ']),
    build(SENT.yaSaidAntaTajirMashhur, ['مَشْهُورَةٌ', 'أَنَا']),
    spot('এই রুমালটি ময়লা', 'هٰذَا الْمِنْدِيلُ وَسِخٌ', 'هٰذَا مِنْدِيلٌ وَسِخٌ', 'هٰذَا مِنْدِيلٌ অর্থ "ইহা একটি রুমাল"'),
    meaningOf(SENT.alMarAaSharifa, ['মহিলাটি ভদ্র', 'তুমি একজন ভদ্র মহিলা']),
    arabicOf(SENT.dhalikatTajirGhani, ['اَلتَّاجِرُ غَنِيٌّ', 'ذٰلِكَ تَاجِرٌ غَنِيٌّ'])
  ]
));

const vocabulary = Object.values(W).map(({ arabic, bangla, picture }) => ({ arabic, bangla, picture }));
const sentences = Object.values(SENT).map(({ arabic, bangla, picture, distance, page }) => ({ arabic, bangla, picture, distance, page }));

const dialogues = QA.map(({ q, a }) => ({
  speaker: 'কিতাবের প্রশ্নোত্তর',
  questionArabic: q.arabic,
  questionBangla: q.bangla,
  answerArabic: a.arabic,
  answerBangla: a.bangla,
  arabic: `${q.arabic} — ${a.arabic}`,
  bangla: `${q.bangla} — ${a.bangla}`,
  page: ''
}));

const tamrinKitabi = [];

const quizLegacy = bookStages
  .find(s => s.id === 'l4-quiz')
  .steps.filter(s => s.type === 'quiz_challenge')
  .map(q => {
    const correctIndex = q.options.findIndex(o => o.isCorrect);
    return {
      question: q.question,
      options: q.options.map(o => o.text),
      correctIndex,
      correctAnswer: correctIndex,
      explanation: q.explanation,
      type: 'mcq'
    };
  });

const qaida = [
  {
    id: 'l4-q-al',
    stageId: 'l4-grammar-al',
    title: 'اَلْ দিয়ে নির্দিষ্ট করা (উস্তাদের যাচাই বাকি)',
    table: [
      { arabic: 'كِتَابٌ', bangla: 'একটি বই' },
      { arabic: 'اَلْكِتَابُ', bangla: 'বইটি' }
    ],
    rule: 'শব্দের শুরুতে اَلْ যুক্ত হলে শব্দটি নির্দিষ্ট হয়ে যায় এবং শেষের তানবীন উঠে যায়।',
    examples: [{ arabic: 'اَلْكِتَابُ جَمِيلٌ', bangla: 'বইটি সুন্দর' }]
  }
];

require('../lib/mcq_boost.cjs')(bookStages);

module.exports = {
  id: 'vol1-ch1-l4',
  legacyStageCount: 9,
  fields: {
    pages: 'পৃষ্ঠা ২৯-৩৩',
    qaida,
    grammarRule: {
      title: 'اَلْ এর ব্যবহার',
      summary: 'শব্দকে নির্দিষ্ট করার নিয়ম',
      points: []
    },
    vocabulary,
    sentences,
    dialogues,
    tamrinKitabi,
    quiz: quizLegacy,
    bookStages
  }
};
