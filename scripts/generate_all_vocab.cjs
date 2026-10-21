const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, '..', '..', 'pdf_quiz', 'new_input_text.txt'), 'utf-8');
const lines = text.split(/\r?\n/);

// Canonical lookup for known words in Eso Arbi Shikhi to ensure 100% crystal-clear Bengali & transliteration
const CANONICAL_MAP = {
  'مِفْتَاح': { bn: 'একটি চাবি', tr: 'Miftah', pos: 'বিশেষ্য' },
  'صُنْدُوْق': { bn: 'একটি বাক্স', tr: 'Sundooq', pos: 'বিশেষ্য' },
  'سَاعَة': { bn: 'একটি ঘড়ি', tr: 'Saa\'ah', pos: 'বিশেষ্য' },
  'مِظَلَّة': { bn: 'একটি ছাতা', tr: 'Mizallah', pos: 'বিশেষ্য' },
  'كِتَاب': { bn: 'একটি বই', tr: 'Kitab', pos: 'বিশেষ্য' },
  'نَظَّارَة': { bn: 'একটি চশমা', tr: 'Nazzarah', pos: 'বিশেষ্য' },
  'قَلَم': { bn: 'একটি কলম', tr: 'Qalam', pos: 'বিশেষ্য' },
  'سَيَّارَة': { bn: 'একটি কার / গাড়ি', tr: 'Sayyarah', pos: 'বিশেষ্য' },
  'كُرْسِي': { bn: 'একটি চেয়ার', tr: 'Kursiyy', pos: 'বিশেষ্য' },
  'دَرَّاجَة': { bn: 'একটি সাইকেল', tr: 'Darrajah', pos: 'বিশেষ্য' },
  'بَيْت': { bn: 'একটি ঘর / বাড়ি', tr: 'Bayt', pos: 'বিশেষ্য' },
  'بَاب': { bn: 'একটি দরজা', tr: 'Bab', pos: 'বিশেষ্য' },
  'مِصْبَاح': { bn: 'একটি বাতি', tr: 'Misbah', pos: 'বিশেষ্য' },
  'جِدَار': { bn: 'একটি দেয়াল', tr: 'Jidar', pos: 'বিশেষ্য' },
  'سَرِيْر': { bn: 'একটি খাট', tr: 'Sareer', pos: 'বিশেষ্য' },
  'مَدْرَسَة': { bn: 'একটি মাদরাসা / বিদ্যালয়', tr: 'Madrasah', pos: 'বিশেষ্য' },
  'سَبُّوْرَة': { bn: 'একটি ব্ল্যাকবোর্ড', tr: 'Sabburah', pos: 'বিশেষ্য' },
  'مِسْطَرَة': { bn: 'একটি রুলার', tr: 'Mistarah', pos: 'বিশেষ্য' },
  'عَلَم': { bn: 'একটি পতাকা', tr: 'Alam', pos: 'বিশেষ্য' },
  'حَقِيْبَة': { bn: 'একটি ব্যাগ', tr: 'Haqeebah', pos: 'বিশেষ্য' },
  'مِرْوَحَة': { bn: 'একটি পাখা', tr: 'Mirwahah', pos: 'বিশেষ্য' },
  'كُرَّاسَة': { bn: 'একটি খাতা', tr: 'Kurrasah', pos: 'বিশেষ্য' },
  'حَدِيْقَة': { bn: 'একটি বাগান', tr: 'Hadeeqah', pos: 'বিশেষ্য' },
  'طَاوِلَة': { bn: 'একটি টেবিল', tr: 'Tawilah', pos: 'বিশেষ্য' },
  'فِرَاش': { bn: 'একটি বিছানা', tr: 'Firash', pos: 'বিশেষ্য' },
  'حُجْرَة': { bn: 'একটি কামরা / কক্ষ', tr: 'Hujrah', pos: 'বিশেষ্য' },
  'غُرْفَة': { bn: 'একটি কামরা / কক্ষ', tr: 'Ghurfah', pos: 'বিশেষ্য' },
  'وِسَادَة': { bn: 'একটি বালিশ', tr: 'Wisadah', pos: 'বিশেষ্য' },
  'نَافِذَة': { bn: 'একটি জানালা', tr: 'Nafidhah', pos: 'বিশেষ্য' },
  'قَمِيْص': { bn: 'একটি জামা', tr: 'Qamees', pos: 'বিশেষ্য' },
  'قُفْل': { bn: 'একটি তালা', tr: 'Qufl', pos: 'বিশেষ্য' },
  'قَلَنْسُوَة': { bn: 'একটি টুপি', tr: 'Qalansuwah', pos: 'বিশেষ্য' },
  'لِبَاس': { bn: 'একটি পোশাক', tr: 'Libas', pos: 'বিশেষ্য' },
  'عِمَامَة': { bn: 'একটি পাগড়ি', tr: 'Imamah', pos: 'বিশেষ্য' },
  'مِنْدِيْل': { bn: 'একটি রুমাল', tr: 'Mindeel', pos: 'বিশেষ্য' },
  'حِذَاء': { bn: 'একটি জুতা', tr: 'Hidha\'', pos: 'বিশেষ্য' },
  'تِلْمِيْذ': { bn: 'একজন ছাত্র', tr: 'Tilmeedh', pos: 'বিশেষ্য' },
  'تِلْمِيْذَة': { bn: 'একজন ছাত্রী', tr: 'Tilmeedhah', pos: 'বিশেষ্য' },
  'مُعَلِّم': { bn: 'একজন শিক্ষক', tr: 'Mu\'allim', pos: 'বিশেষ্য' },
  'مُعَلِّمَة': { bn: 'একজন শিক্ষিকা', tr: 'Mu\'allimah', pos: 'বিশেষ্য' },
  'وَلَد': { bn: 'একটি ছেলে / বালক', tr: 'Walad', pos: 'বিশেষ্য' },
  'بِنْت': { bn: 'একটি মেয়ে / বালিকা', tr: 'Bint', pos: 'বিশেষ্য' },
  'طِفْل': { bn: 'একটি শিশু (ছেলে)', tr: 'Tifl', pos: 'বিশেষ্য' },
  'طِفْلَة': { bn: 'একটি শিশু (মেয়ে)', tr: 'Tiflah', pos: 'বিশেষ্য' },
  'رَجُل': { bn: 'একজন লোক / পুরুষ', tr: 'Rajul', pos: 'বিশেষ্য' },
  'اِمْرَأَة': { bn: 'একজন স্ত্রীলোক / মহিলা', tr: 'Imra\'ah', pos: 'বিশেষ্য' },
  'فَلَّاح': { bn: 'একজন কৃষক', tr: 'Fallah', pos: 'বিশেষ্য' },
  'طَبِيْب': { bn: 'একজন ডাক্তার', tr: 'Tabeeb', pos: 'বিশেষ্য' },
  'تَاجِر': { bn: 'একজন ব্যবসায়ী', tr: 'Tajir', pos: 'বিশেষ্য' },
  'خَادِم': { bn: 'একজন সেবক / চাকর', tr: 'Khadim', pos: 'বিশেষ্য' },
  'طَالِب': { bn: 'একজন শিক্ষার্থী / ছাত্র', tr: 'Talib', pos: 'বিশেষ্য' },
  'أَب': { bn: 'পিতা / বাবা', tr: 'Ab', pos: 'বিশেষ্য' },
  'أُمّ': { bn: 'মাতা / আম্মা', tr: 'Umm', pos: 'বিশেষ্য' },
  'أُم': { bn: 'মাতা / আম্মা', tr: 'Umm', pos: 'বিশেষ্য' },
  'وَالِد': { bn: 'পিতা', tr: 'Walid', pos: 'বিশেষ্য' },
  'وَالِدَة': { bn: 'মাতা / আম্মা', tr: 'Walidah', pos: 'বিশেষ্য' },
  'أَخ': { bn: 'ভাই', tr: 'Akh', pos: 'বিশেষ্য' },
  'أُخْت': { bn: 'বোন', tr: 'Ukht', pos: 'বিশেষ্য' },
  'عَمّ': { bn: 'চাচা', tr: 'Amm', pos: 'বিশেষ্য' },
  'عَم': { bn: 'চাচা', tr: 'Amm', pos: 'বিশেষ্য' },
  'عَمَّة': { bn: 'ফুফু', tr: 'Ammah', pos: 'বিশেষ্য' },
  'خَال': { bn: 'মামা', tr: 'Khal', pos: 'বিশেষ্য' },
  'خَالَة': { bn: 'খালা', tr: 'Khalah', pos: 'বিশেষ্য' },
  'جَدّ': { bn: 'দাদা / নানা', tr: 'Jadd', pos: 'বিশেষ্য' },
  'جَد': { bn: 'দাদা / নানা', tr: 'Jadd', pos: 'বিশেষ্য' },
  'جَدَّة': { bn: 'দাদী / নানী', tr: 'Jaddah', pos: 'বিশেষ্য' },
  'اِسْم': { bn: 'নাম', tr: 'Ism', pos: 'বিশেষ্য' },
  'اِبْن': { bn: 'ছেলে / পুত্র', tr: 'Ibn', pos: 'বিশেষ্য' },
  'صَدِيْق': { bn: 'বন্ধু', tr: 'Sadeeq', pos: 'বিশেষ্য' },
  'عَدُوّ': { bn: 'শত্রু', tr: 'Aduww', pos: 'বিশেষ্য' },
  'عَدُو': { bn: 'শত্রু', tr: 'Aduww', pos: 'বিশেষ্য' },
  'جَار': { bn: 'প্রতিবেশী', tr: 'Jar', pos: 'বিশেষ্য' },
  'ضَيْف': { bn: 'মেহমান / অতিথি', tr: 'Dayf', pos: 'বিশেষ্য' },
  'رَبّ': { bn: 'প্রতিপালক', tr: 'Rabb', pos: 'বিশেষ্য' },
  'رَب': { bn: 'প্রতিপালক', tr: 'Rabb', pos: 'বিশেষ্য' },
  'دِيْن': { bn: 'ধর্ম / দ্বীন', tr: 'Deen', pos: 'বিশেষ্য' },
  'نَبِيّ': { bn: 'নবী', tr: 'Nabiyy', pos: 'বিশেষ্য' },
  'رَسُوْل': { bn: 'রাসূল', tr: 'Rasool', pos: 'বিশেষ্য' },
  'قُرْآن': { bn: 'কুরআন', tr: 'Qur\'an', pos: 'বিশেষ্য' },
  'اِسْـلَام': { bn: 'ইসলাম', tr: 'Islam', pos: 'বিশেষ্য' },
  'مَسْجِد': { bn: 'মসজিদ', tr: 'Masjid', pos: 'বিশেষ্য' },
  'مَكْتَبَة': { bn: 'লাইব্রেরি / পাঠাগার', tr: 'Maktabah', pos: 'বিশেষ্য' },
  'سُوْق': { bn: 'বাজার', tr: 'Sooq', pos: 'বিশেষ্য' },
  'দুক্কান': { bn: 'দোকান', tr: 'Dukkan', pos: 'বিশেষ্য' },
  'دُكَّان': { bn: 'দোকান', tr: 'Dukkan', pos: 'বিশেষ্য' },
  'شَارِع': { bn: 'রাস্তা / সড়ক', tr: 'Shari\'', pos: 'বিশেষ্য' },
  'طَرِيْق': { bn: 'পথ / রাস্তা', tr: 'Tareeq', pos: 'বিশেষ্য' },
  'قَرْيَة': { bn: 'একটি গ্রাম', tr: 'Qaryah', pos: 'বিশেষ্য' },
  'مَدِيْنَة': { bn: 'একটি শহর / নগর', tr: 'Madeenah', pos: 'বিশেষ্য' },
  'عَاصِمَة': { bn: 'রাজধানী', tr: 'Asimah', pos: 'বিশেষ্য' },
  'بَلَد': { bn: 'দেশ / নগর', tr: 'Balad', pos: 'বিশেষ্য' },
  'السماء': { bn: 'আকাশ / আসমান', tr: 'As-Sama\'', pos: 'বিশেষ্য' },
  'سَمَاء': { bn: 'আকাশ / আসমান', tr: 'Sama\'', pos: 'বিশেষ্য' },
  'األرض': { bn: 'জমিন / পৃথিবী', tr: 'Al-Ard', pos: 'বিশেষ্য' },
  'أَرْض': { bn: 'জমিন / পৃথিবী', tr: 'Ard', pos: 'বিশেষ্য' },
  'شَمْس': { bn: 'সূর্য', tr: 'Shams', pos: 'বিশেষ্য' },
  'قَمَر': { bn: 'চাঁদ', tr: 'Qamar', pos: 'বিশেষ্য' },
  'نَجْم': { bn: 'তারা / নক্ষত্র', tr: 'Najm', pos: 'বিশেষ্য' },
  'نَهْر': { bn: 'নদী', tr: 'Nahr', pos: 'বিশেষ্য' },
  'بَحْر': { bn: 'সাগর / সমুদ্র', tr: 'Bahr', pos: 'বিশেষ্য' },
  'مَاء': { bn: 'পানি', tr: 'Ma\'', pos: 'বিশেষ্য' },
  'شَجَرَة': { bn: 'একটি গাছ / বৃক্ষ', tr: 'Shajarah', pos: 'বিশেষ্য' },
  'زَهْرَة': { bn: 'একটি ফুল', tr: 'Zahrah', pos: 'বিশেষ্য' },
  'وَرْدَة': { bn: 'একটি গোলাপ', tr: 'Wardah', pos: 'বিশেষ্য' },
  'ثَمَرَة': { bn: 'একটি ফল', tr: 'Thamarah', pos: 'বিশেষ্য' },
  'فَاكِهَة': { bn: 'একটি ফল', tr: 'Fakihah', pos: 'বিশেষ্য' },
  'খাদয': { bn: 'খাবার / খাদ্য', tr: 'Ghidha\'', pos: 'বিশেষ্য' },
  'غِذَاء': { bn: 'খাবার / খাদ্য', tr: 'Ghidha\'', pos: 'বিশেষ্য' },
  'طَعَام': { bn: 'খাবার / খাদ্য', tr: 'Ta\'am', pos: 'বিশেষ্য' },
  'خُبْز': { bn: 'রুটি', tr: 'Khubz', pos: 'বিশেষ্য' },
  'لَحْم': { bn: 'গোশত / মাংস', tr: 'Lahm', pos: 'বিশেষ্য' },
  'لَبَن': { bn: 'দুধ', tr: 'Laban', pos: 'বিশেষ্য' },
  'حَلِيْب': { bn: 'দুধ', tr: 'Haleeb', pos: 'বিশেষ্য' },
  'عَسَل': { bn: 'মধু', tr: 'Asal', pos: 'বিশেষ্য' },
  'شَاي': { bn: 'চা', tr: 'Shay', pos: 'বিশেষ্য' },
  'قَهْوَة': { bn: 'কফি', tr: 'Qahwah', pos: 'বিশেষ্য' },
  'تُفَّاح': { bn: 'আপেল', tr: 'Tuffah', pos: 'বিশেষ্য' },
  'عِنَب': { bn: 'আঙ্গুর', tr: 'Inab', pos: 'বিশেষ্য' },
  'بِطِّيْخ': { bn: 'তরমুজ', tr: 'Bitteekh', pos: 'বিশেষ্য' },
  'بِطِيْخَة': { bn: 'একটি তরমুজ', tr: 'Bitteekhah', pos: 'বিশেষ্য' },
  'مَوْز': { bn: 'কলা', tr: 'Mawz', pos: 'বিশেষ্য' },
  'رُمَّان': { bn: 'ডালিম / বেদানা', tr: 'Rumman', pos: 'বিশেষ্য' },
  'মَسَّاحَة': { bn: 'ডাস্টার', tr: 'Massahah', pos: 'বিশেষ্য' },
  'خَارِطَة': { bn: 'মানচিত্র / ম্যাপ', tr: 'Kharitah', pos: 'বিশেষ্য' },
  'مِحْرَاث': { bn: 'লাঙ্গল', tr: 'Mihrath', pos: 'বিশেষ্য' },
  'حَصِيْر': { bn: 'চাটাই', tr: 'Haseer', pos: 'বিশেষ্য' },
  'عِقْد': { bn: 'হার / কণ্ঠহার', tr: 'Iqd', pos: 'বিশেষ্য' },
  'نور': { bn: 'আলো', tr: 'Noor', pos: 'বিশেষ্য' },
  'نُوْر': { bn: 'আলো', tr: 'Noor', pos: 'বিশেষ্য' },
  'ظلمة': { bn: 'অন্ধকার', tr: 'Zulmah', pos: 'বিশেষ্য' },
  'ظُلْمَة': { bn: 'অন্ধকার', tr: 'Zulmah', pos: 'বিশেষ্য' },
  'قصة': { bn: 'গল্প / কাহিনী', tr: 'Qissah', pos: 'বিশেষ্য' },
  'قِصَّة': { bn: 'একটি গল্প / ঘটনা', tr: 'Qissah', pos: 'বিশেষ্য' },
  'حَسَد': { bn: 'হিংসা', tr: 'Hasad', pos: 'বিশেষ্য' },
  'عَصِيْر': { bn: 'রস / জুস', tr: 'Aseer', pos: 'বিশেষ্য' },
  'طائِر': { bn: 'একটি পাখি', tr: 'Ta\'ir', pos: 'বিশেষ্য' },
  'كَلْب': { bn: 'একটি কুকুর', tr: 'Kalb', pos: 'বিশেষ্য' },
  'مَلِك': { bn: 'বাদশাহ / রাজা', tr: 'Malik', pos: 'বিশেষ্য' },
  'زَمِيْل': { bn: 'সহপাঠী', tr: 'Zameel', pos: 'বিশেষ্য' },
  'زَمِيل': { bn: 'সহপাঠী', tr: 'Zameel', pos: 'বিশেষ্য' },
  'صُوْرَة': { bn: 'ছবি / প্রতিচ্ছবি', tr: 'Soorah', pos: 'বিশেষ্য' },
  'طَبْشُوْرَة': { bn: 'একটি চক', tr: 'Tabshoorah', pos: 'বিশেষ্য' },
  'فَأْر': { bn: 'ইঁদুর', tr: 'Fa\'r', pos: 'বিশেষ্য' },
  'جِسْم': { bn: 'দেহ / শরীর', tr: 'Jism', pos: 'বিশেষ্য' },
  'أَسَد': { bn: 'সিংহ', tr: 'Asad', pos: 'বিশেষ্য' },
  'سَقْف': { bn: 'ছাদ', tr: 'Saqf', pos: 'বিশেষ্য' },
  'ظَبْي': { bn: 'একটি হরিণ', tr: 'Zaby', pos: 'বিশেষ্য' },
  'قِطْعَة': { bn: 'একটি টুকরা / খন্ড', tr: 'Qit\'ah', pos: 'বিশেষ্য' },
  'حَرْب': { bn: 'যুদ্ধ', tr: 'Harb', pos: 'বিশেষ্য' },
  'رَصَاص': { bn: 'সীসা / বুলেট', tr: 'Rasas', pos: 'বিশেষ্য' },
  'ثَلَّاجَة': { bn: 'ফ্রিজ', tr: 'Thallajah', pos: 'বিশেষ্য' },
  'رِجْل': { bn: 'পা', tr: 'Rijl', pos: 'বিশেষ্য' },
  'أَرْجُل': { bn: 'পাগুলো (বহুবচন)', tr: 'Arjul', pos: 'বিশেষ্য' },
  'مُجْرِم': { bn: 'অপরাধী', tr: 'Mujrim', pos: 'বিশেষ্য' },
  'سُلْطَان': { bn: 'সুলতান / পরাক্রম', tr: 'Sultan', pos: 'বিশেষ্য' },
  'سُلْطان': { bn: 'সুলতান / পরাক্রম', tr: 'Sultan', pos: 'বিশেষ্য' },
  'عُمُر': { bn: 'বয়স / জীবন', tr: 'Umur', pos: 'বিশেষ্য' },
  'مُجْتَمَع': { bn: 'সমাজ', tr: 'Mujtama\'', pos: 'বিশেষ্য' },
  'شَيْء': { bn: 'কোন জিনিস / বস্তু', tr: 'Shay\'', pos: 'বিশেষ্য' },
  
  // Adjectives
  'جَدِيْد': { bn: 'নতুন', tr: 'Jadeed', pos: 'গুণবাচক' },
  'قَدِيْم': { bn: 'পুরোনো', tr: 'Qadeem', pos: 'গুণবাচক' },
  'جَمِيْل': { bn: 'সুন্দর', tr: 'Jameel', pos: 'গুণবাচক' },
  'جميل': { bn: 'সুন্দর', tr: 'Jameel', pos: 'গুণবাচক' },
  'جَميل': { bn: 'সুন্দর', tr: 'Jameel', pos: 'গুণবাচক' },
  'كَبِيْر': { bn: 'বড়', tr: 'Kabeer', pos: 'গুণবাচক' },
  'صَغِيْر': { bn: 'ছোট', tr: 'Sagheer', pos: 'গুণবাচক' },
  'جَيِد': { bn: 'ভালো / উত্তম', tr: 'Jayyid', pos: 'গুণবাচক' },
  'جَيِّد': { bn: 'ভালো / উত্তম', tr: 'Jayyid', pos: 'গুণবাচক' },
  'نَظِيْف': { bn: 'পরিচ্ছন্ন', tr: 'Nazeef', pos: 'গুণবাচক' },
  'وَسِخ': { bn: 'ময়লা / অপরিচ্ছন্ন', tr: 'Wasikh', pos: 'গুণবাচক' },
  'ذَكِي': { bn: 'মেধাবী / বুদ্ধিমান', tr: 'Dhakiyy', pos: 'গুণবাচক' },
  'ذَكِيّ': { bn: 'মেধাবী / বুদ্ধিমান', tr: 'Dhakiyy', pos: 'গুণবাচক' },
  'غَبِي': { bn: 'মেধাহীন / নির্বোধ', tr: 'Ghabiyy', pos: 'গুণবাচক' },
  'غَبِيّ': { bn: 'মেধাহীন / নির্বোধ', tr: 'Ghabiyy', pos: 'গুণবাচক' },
  'مُجْتَهِد': { bn: 'পরিশ্রমী', tr: 'Mujtahid', pos: 'গুণবাচক' },
  'مَاهِر': { bn: 'দক্ষ', tr: 'Mahir', pos: 'গুণবাচক' },
  'غَنِي': { bn: 'ধনী', tr: 'Ghaniyy', pos: 'গুণবাচক' },
  'غَنِيّ': { bn: 'ধনী', tr: 'Ghaniyy', pos: 'গুণবাচক' },
  'فَقِيْر': { bn: 'দরিদ্র / গরিব', tr: 'Faqeer', pos: 'গুণবাচক' },
  'شَرِيْف': { bn: 'ভদ্র / সম্ভ্রান্ত', tr: 'Shareef', pos: 'গুণবাচক' },
  'مُؤَدَّب': { bn: 'ভদ্র / শিষ্টাচারী', tr: 'Mu\'addab', pos: 'গুণবাচক' },
  'مَشْهُوْر': { bn: 'প্রসিদ্ধ / বিখ্যাত', tr: 'Mash-hoor', pos: 'গুণবাচক' },
  'مَفْتُوْح': { bn: 'খোলা', tr: 'Maftooh', pos: 'গুণবাচক' },
  'مُغْلَق': { bn: 'বন্ধ', tr: 'Mughlaq', pos: 'গুণবাচক' },
  'وَاسِع': { bn: 'প্রশস্ত', tr: 'Wasi\'', pos: 'গুণবাচক' },
  'ضَيِق': { bn: 'সংকীর্ণ / অপ্রশস্ত', tr: 'Dayyiq', pos: 'গুণবাচক' },
  'ضَيِّق': { bn: 'সংকীর্ণ / অপ্রশস্ত', tr: 'Dayyiq', pos: 'গুণবাচক' },
  'قَوِي': { bn: 'শক্তিশালী / মজবুত', tr: 'Qawiyy', pos: 'গুণবাচক' },
  'قَوِيّ': { bn: 'শক্তিশালী / মজবুত', tr: 'Qawiyy', pos: 'গুণবাচক' },
  'حَار': { bn: 'গরম', tr: 'Harr', pos: 'গুণবাচক' },
  'حَارّ': { bn: 'গরম', tr: 'Harr', pos: 'গুণবাচক' },
  'بَارِد': { bn: 'ঠান্ডা', tr: 'Barid', pos: 'গুণবাচক' },
  'طَازَج': { bn: 'তাজা', tr: 'Tazaj', pos: 'গুণবাচক' },
  'طَازج': { bn: 'তাজা', tr: 'Tazaj', pos: 'গুণবাচক' },
  'বائِت': { bn: 'বাসি', tr: 'Ba\'it', pos: 'গুণবাচক' },
  'بَائِت': { bn: 'বাসি', tr: 'Ba\'it', pos: 'গুণবাচক' },
  'لَذِيْذ': { bn: 'সুস্বাদু / মজাদার', tr: 'Ladheedh', pos: 'গুণবাচক' },
  'حُلْو': { bn: 'মিষ্টি', tr: 'Hulw', pos: 'গুণবাচক' },
  'حَامِض': { bn: 'টক', tr: 'Hamid', pos: 'গুণবাচক' },
  'سَهْل': { bn: 'সহজ', tr: 'Sahl', pos: 'গুণবাচক' },
  'صَعْب': { bn: 'কঠিন', tr: 'Sa\'b', pos: 'গুণবাচক' },
  'قَرِيْب': { bn: 'কাছে / নিকটবর্তী', tr: 'Qareeb', pos: 'গুণবাচক' },
  'بَعِيْد': { bn: 'দূরে / দূরবর্তী', tr: 'Ba\'eed', pos: 'গুণবাচক' },
  'كَثِيْر': { bn: 'বেশি / অনেক', tr: 'Katheer', pos: 'গুণবাচক' },
  'قَلِيْل': { bn: 'কম / অল্প', tr: 'Qaleel', pos: 'গুণবাচক' },
  'মَكْسُوْর': { bn: 'ভাঙা', tr: 'Maksoor', pos: 'গুণবাচক' },
  'عَجِيْب': { bn: 'আশ্চর্যজনক / অদ্ভুত', tr: 'Ajeeb', pos: 'গুণবাচক' },
  'صَاف': { bn: 'স্বচ্ছ / নির্মল', tr: 'Saaf', pos: 'গুণবাচক' },
  'طَيِب': { bn: 'উত্তম / পবিত্র', tr: 'Tayyib', pos: 'গুণবাচক' },
  'عَظِيْم': { bn: 'বিরাট / মহান', tr: 'Azeem', pos: 'গুণবাচক' },
  'أَكْبَر': { bn: 'অধিকতর বড়', tr: 'Akbar', pos: 'গুণবাচক' },
  'مَشْكُوْر': { bn: 'পুরস্কারযোগ্য / প্রশংসিত', tr: 'Mashkoor', pos: 'গুণবাচক' },
  'مَشْكُور': { bn: 'পুরস্কারযোগ্য / প্রশংসিত', tr: 'Mashkoor', pos: 'গুণবাচক' },
  'صَالِح': { bn: 'সৎ / নেককার', tr: 'Salih', pos: 'গুণবাচক' },

  // Pronouns
  'هذا': { bn: 'ইহা / এটি (পুং)', tr: 'Hadha', pos: 'সর্বনাম' },
  'هذَا': { bn: 'ইহা / এটি (পুং)', tr: 'Hadha', pos: 'সর্বনাম' },
  'هذه': { bn: 'ইহা / এটি (স্ত্রী)', tr: 'Hadhihi', pos: 'সর্বনাম' },
  'هذِهِ': { bn: 'ইহা / এটি (স্ত্রী)', tr: 'Hadhihi', pos: 'সর্বনাম' },
  'ذلك': { bn: 'উহা / সেটি (পুং)', tr: 'Dhalika', pos: 'সর্বনাম' },
  'ذلِك': { bn: 'উহা / সেটি (পুং)', tr: 'Dhalika', pos: 'সর্বনাম' },
  'ذلِكَ': { bn: 'উহা / সেটি (পুং)', tr: 'Dhalika', pos: 'সর্বনাম' },
  'تلك': { bn: 'উহা / সেটি (স্ত্রী)', tr: 'Tilka', pos: 'সর্বনাম' },
  'تِلْك': { bn: 'উহা / সেটি (স্ত্রী)', tr: 'Tilka', pos: 'সর্বনাম' },
  'تِلْكَ': { bn: 'উহা / সেটি (স্ত্রী)', tr: 'Tilka', pos: 'সর্বনাম' },
  'أنا': { bn: 'আমি', tr: 'Ana', pos: 'সর্বনাম' },
  'أَنَا': { bn: 'আমি', tr: 'Ana', pos: 'সর্বনাম' },
  'أنت': { bn: 'তুমি (পুং)', tr: 'Anta', pos: 'সর্বনাম' },
  'أَنْت': { bn: 'তুমি (পুং)', tr: 'Anta', pos: 'সর্বনাম' },
  'أَنْتَ': { bn: 'তুমি (পুং)', tr: 'Anta', pos: 'সর্বনাম' },
  'أَنْتِ': { bn: 'তুমি (স্ত্রী)', tr: 'Anti', pos: 'সর্বনাম' },
  'هو': { bn: 'সে (পুং)', tr: 'Huwa', pos: 'সর্বনাম' },
  'هُو': { bn: 'সে (পুং)', tr: 'Huwa', pos: 'সর্বনাম' },
  'هُوَ': { bn: 'সে (পুং)', tr: 'Huwa', pos: 'সর্বনাম' },
  'هي': { bn: 'সে (স্ত্রী)', tr: 'Hiya', pos: 'সর্বনাম' },
  'هِي': { bn: 'সে (স্ত্রী)', tr: 'Hiya', pos: 'সর্বনাম' },
  'هِيَ': { bn: 'সে (স্ত্রী)', tr: 'Hiya', pos: 'সর্বনাম' },
  'نحن': { bn: 'আমরা', tr: 'Nahnu', pos: 'সর্বনাম' },
  'نَحْن': { bn: 'আমরা', tr: 'Nahnu', pos: 'সর্বনাম' },
  'نَحْنُ': { bn: 'আমরা', tr: 'Nahnu', pos: 'সর্বনাম' },
  'الذين': { bn: 'যারা / যাদেরকে (পুং)', tr: 'Alladheena', pos: 'সর্বনাম' },
  'الَّلتي': { bn: 'যারা / যাদেরকে (স্ত্রী)', tr: 'Allatee', pos: 'সর্বনাম' },

  // Prepositions & Particles
  'عِنْد': { bn: 'কাছে / নিকট', tr: 'Inda', pos: 'অব্যয়' },
  'عِنْدَ': { bn: 'কাছে / নিকট', tr: 'Inda', pos: 'অব্যয়' },
  'أَمَام': { bn: 'সামনে', tr: 'Amama', pos: 'অব্যয়' },
  'أَمَامَ': { bn: 'সামনে', tr: 'Amama', pos: 'অব্যয়' },
  'وَرَاء': { bn: 'পেছনে', tr: 'Wara\'a', pos: 'অব্যয়' },
  'وَرَاءَ': { bn: 'পেছনে', tr: 'Wara\'a', pos: 'অব্যয়' },
  'خَلْف': { bn: 'পেছনে', tr: 'Khalfa', pos: 'অব্যয়' },
  'خَلْفَ': { bn: 'পেছনে', tr: 'Khalfa', pos: 'অব্যয়' },
  'تَحْت': { bn: 'নিচে', tr: 'Tahta', pos: 'অব্যয়' },
  'تَحْتَ': { bn: 'নিচে', tr: 'Tahta', pos: 'অব্যয়' },
  'فَوْق': { bn: 'উপরে', tr: 'Fawqa', pos: 'অব্যয়' },
  'فَوْقَ': { bn: 'উপরে', tr: 'Fawqa', pos: 'অব্যয়' },
  'بِجَانِب': { bn: 'পাশে', tr: 'Bijanibi', pos: 'অব্যয়' },
  'مِن': { bn: 'হতে / থেকে', tr: 'Min', pos: 'অব্যয়' },
  'مِنْ': { bn: 'হতে / থেকে', tr: 'Min', pos: 'অব্যয়' },
  'ثُم': { bn: 'তারপর / অতঃপর', tr: 'Thumma', pos: 'অব্যয়' },
  'ثُمَّ': { bn: 'তারপর / অতঃপর', tr: 'Thumma', pos: 'অব্যয়' },
  'و': { bn: 'এবং / ও', tr: 'Wa', pos: 'অব্যয়' },
  'وَ': { bn: 'এবং / ও', tr: 'Wa', pos: 'অব্যয়' },
  'جِدًّا': { bn: 'খুব / অত্যন্ত', tr: 'Jiddan', pos: 'ক্রিয়াবিশেষণ' },
  'غَدًا': { bn: 'আগামীকাল', tr: 'Ghadan', pos: 'ক্রিয়াবিশেষণ' },
  'أَبَدًا': { bn: 'কখনো না / চিরকাল', tr: 'Abadan', pos: 'ক্রিয়াবিশেষণ' },
  'كُل َّيَوْم': { bn: 'প্রতিদিন', tr: 'Kulla Yawm', pos: 'ক্রিয়াবিশেষণ' },
  'إِنَّما': { bn: 'কেবল / শুধুমাত্র', tr: 'Innama', pos: 'অব্যয়' },

  // Question words
  'أَيْن': { bn: 'কোথায়?', tr: 'Ayna', pos: 'প্রশ্নবোধক' },
  'أَيْنَ': { bn: 'কোথায়?', tr: 'Ayna', pos: 'প্রশ্নবোধক' },
  'مَتى': { bn: 'কখন?', tr: 'Mata', pos: 'প্রশ্নবোধক' },
  'مَتَى': { bn: 'কখন?', tr: 'Mata', pos: 'প্রশ্নবোধক' },
  'لِم': { bn: 'কেন? / কী জন্য?', tr: 'Lim', pos: 'প্রশ্নবোধক' },
  'لِمَاذَا': { bn: 'কেন? / কী জন্য?', tr: 'Limadha', pos: 'প্রশ্নবোধক' }
};

function repairBengali(str) {
  if (!str) return '';
  let s = str;

  // Direct word substitutions
  const wordMap = {
    'োমব': 'চাবি', 'কেি': 'কলম', 'ঘমি': 'ঘড়ি', 'িাতা': 'ছাতা', 'েিিা': 'চশমা',
    'লেোর': 'চেয়ার', 'মবদযােে': 'বিদ্যালয়', 'িাত্র': 'ছাত্র', 'িাত্রী': 'ছাত্রী',
    'মিক্ষক': 'শিক্ষক', 'মিমক্ষকা': 'শিক্ষিকা', 'মবিান্া': 'বিছানা', 'বামেি': 'বালিশ',
    'তাো': 'তালা', 'জািা': 'জামা', 'বযাগ': 'ব্যাগ', 'রু োর': 'রুলার', 'লটমবে': 'টেবিল',
    'কািরা': 'কামরা', 'জান্াো': 'জানালা', 'টুমপ': 'টুপি', 'লপািাক': 'পোশাক', 'পাগিী': 'পাগড়ি',
    'রু িাে': 'রুমাল', 'লিধ্াবী': 'মেধাবী', 'বুমিিান্': 'বুদ্ধিমান', 'লিধ্ােীন্': 'মেধাহীন',
    'মন্হবথাধ্': 'নির্বোধ', 'দমরদ্র': 'দরিদ্র', 'িমেো': 'মহিলা', 'পমরচ্ছন্ন': 'পরিচ্ছন্ন',
    'িেো': 'ময়লা', 'পমরশ্রিী': 'পরিশ্রমী', 'লখাো': 'খোলা', 'প্রিস্ত': 'প্রশস্ত',
    'অপ্রিস্ত': 'অপ্রশস্ত', 'সংকীর্থ': 'সংকীর্ণ', 'িমক্তিােী': 'শক্তিমান', 'িজবুত': 'মজবুত',
    'পুহরাহন্া': 'পুরোনো', 'তুন্': 'নতুন', 'বি': 'বড়', 'লিাট': 'ছোট', 'াহো': 'ভালো',
    'সািহন্': 'সামনে', 'মপিহন্': 'পেছনে', 'মন্হে': 'নিচে', 'উপহর': 'উপরে', 'পাহি': 'পাশে',
    'লকার্াে': 'কোথায়', 'প্রমতপােক': 'প্রতিপালক', 'ধ্থি': 'ধর্ম', 'ধ্ িথ': 'ধর্ম',
    'উত্তি': 'উত্তম', 'হৃদে': 'হৃদয়', 'োর': 'হার', 'আহো': 'আলো', 'ঘটন্া': 'ঘটনা',
    'গ্রাি': 'গ্রাম', 'িের': 'শহর', 'র্াই': 'ভাই', 'র্াঙ্গা': 'ভাঙা', 'র্াস্টার': 'ডাস্টার',
    'িািা': 'মামা', 'খাো': 'খালা', 'োো': 'চাচা', 'লবান্': 'বোন', 'ন্ াি': 'নাম',
    'িত্রু': 'শত্রু', 'আসিান্': 'আসমান / আকাশ', 'েিীন্': 'জমিন / পৃথিবী', 'রিোন্': 'রমজান',
    'লরাোদার': 'রোজাদার', 'ব্ল াকহবার্থ': 'ব্ল্যাকবোর্ড', 'ব্ল াকহবাডথ': 'ব্ল্যাকবোর্ড',
    'সাইহকে': 'সাইকেল', 'বামত': 'বাতি', 'লদোে': 'দেয়াল', 'িাদরাসা': 'মাদরাসা',
    'লিহে': 'ছেলে', 'পাখা': 'পাখা', 'পতাকা': 'পতাকা', 'বাগান্': 'বাগান', 'কৃষক': 'কৃষক',
    'ধ্নী': 'ধনী', 'গরীব': 'গরিব', 'লোক': 'লোক', 'পুরুষ': 'পুরুষ', 'মিশু': 'শিশু',
    'অতযন্ত': 'অত্যন্ত', 'দক্ষ': 'দক্ষ', 'বন্ধু': 'বন্ধু', 'পর্': 'পথ', 'বাজার': 'বাজার',
    'রাজধ্ান্ী': 'রাজধানী', 'তাজা': 'তাজা', 'সুস্বাদু': 'সুস্বাদু', 'বামস': 'বাসি',
    'গরি': 'গরম', 'অদক্ষ': 'অদক্ষ', 'কি': 'কম', 'ইাঁদুর': 'ইঁদুর', 'িরীর': 'শরীর',
    'মসংে': 'সিংহ', 'খাদয': 'খাদ্য', 'িাদ': 'ছাদ', 'েমরর্': 'হরিণ', 'কুকু র': 'কুকুর',
    'আগািীকাে': 'আগামীকাল', 'কখহন্া': 'কখনো', 'কখন্': 'কখন', 'োটাই': 'চাটাই',
    'স্বচ্ছ': 'স্বচ্ছ', 'অস্ত': 'অস্ত', 'মিকার': 'শিকার', 'লসোই': 'সেলাই',
    'ইচ্ছা': 'ইচ্ছা', 'পাওয়া': 'পাওয়া', 'ধরা': 'ধরা', 'অপরাধী': 'অপরাধী',
    'পালানো': 'পালানো', 'সুসংবাদ': 'সুসংবাদ', 'সতর্ক': 'সতর্ক', 'শান্তি': 'শান্তি',
    'িযাপ': 'ম্যাপ / মানচিত্র', 'াস্টার': 'ডাস্টার', 'চাবড়': 'চাবি'
  };

  for (const [k, v] of Object.entries(wordMap)) {
    s = s.split(k).join(v);
  }

  s = s.replace(/হন্/g, 'ন')
       .replace(/ন্/g, 'ন')
       .replace(/িহ/g, 'হে')
       .replace(/মব/g, 'বি')
       .replace(/মক/g, 'কি')
       .replace(/মি/g, 'শি')
       .replace(/১ি/g, '১ম')
       .replace(/২ে/g, '২য়')
       .replace(/৩ে/g, '৩য়')
       .replace(/৪র্থ/g, '৪র্থ')
       .replace(/৫ি/g, '৫ম')
       .replace(/৬ষ্ঠ/g, '৬ষ্ঠ')
       .replace(/৭ি/g, '৭ম')
       .replace(/৮ি/g, '৮ম')
       .replace(/৯ি/g, '৯ম')
       .replace(/১০ি/g, '১০ম')
       .replace(/১১ি/g, '১১তম')
       .replace(/১২ি/g, '১২তম')
       .replace(/১৪ি/g, '১৪তম')
       .replace(/১৫ি/g, '১৫তম')
       .replace(/১৬ি/g, '১৬তম')
       .replace(/১৭ি/g, '১৭তম')
       .replace(/১৮ি/g, '১৮তম')
       .replace(/১৯ি/g, '১৯তম')
       .replace(/২০ি/g, '২০তম')
       .replace(/অধ্যাে/g, 'অধ্যায়')
       .replace(/\s+/g, ' ')
       .trim();

  return s;
}

function cleanArabic(str) {
  if (!str) return '';
  let ar = str.replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim();
  ar = ar.replace(/^[-\s\.\,\(\)]+/, '').replace(/[-\s\.\,\(\)]+$/, '');
  return ar;
}

function stripTashkeel(str) {
  return str.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

function getTransliteration(ar) {
  const stripped = stripTashkeel(ar);
  for (const [key, val] of Object.entries(CANONICAL_MAP)) {
    if (stripped === stripTashkeel(key) || ar === key) {
      return val.tr;
    }
  }
  return ar.replace(/[\u064B-\u065F]/g, '');
}

const vocabulary = [];
let currentVolume = '১ম খন্ড';
let currentChapter = '১ম অধ্যায়';
let currentLesson = '১ম পাঠ';
let idCounter = 1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  if (line.includes('بسم') || line.includes("দু'আ") || line.includes('জান্নাত')) continue;

  if (line.includes('১ম খন্ড') || line.includes('১ি খন্ড')) currentVolume = '১ম খন্ড';
  if (line.includes('২য় খন্ড') || line.includes('২ে খন্ড')) currentVolume = '২য় খন্ড';
  if (line.includes('৩য় খন্ড') || line.includes('৩ে খন্ড')) currentVolume = '৩য় খন্ড';

  const chapMatch = line.match(/([১-৯১০]+[\s]*(?:ম|য়|ে|ি|র্থ|ষ্ঠ)?[\s]*অধ্যা[েয়])/);
  if (chapMatch) currentChapter = repairBengali(chapMatch[1]);

  const lesMatch = line.match(/([১-৯১০১২৩৪৫৬৭৮৯২০]+[\s]*(?:ম|য়|ে|ি|র্থ|ষ্ঠ|তম)?[\s]*পাঠ)/);
  if (lesMatch) currentLesson = repairBengali(lesMatch[1]);

  if (!/[\u0600-\u06FF]/.test(line)) continue;

  const tokens = line.split('\t').map(t => t.trim()).filter(Boolean);
  let currentBn = '';
  let currentAr = '';

  for (const tok of tokens) {
    const hasArabic = /[\u0600-\u06FF]/.test(tok);
    const hasBengali = /[\u0980-\u09FF]/.test(tok);

    if (tok === 'ٌ' || tok === 'ٌَ' || tok === 'ٌِ' || tok === 'ٌُ' || tok === '-') {
      if (currentAr) currentAr += ' ' + tok;
      continue;
    }

    if (hasArabic && hasBengali) {
      const parts = tok.split(/(?<=[\u0980-\u09FF\(\)\[\]\.\,\?\!])\s*(?=[\u0600-\u06FF])|(?<=[\u0600-\u06FF\s\-\.\,\?\!—–\(\)\[\]\{\}\/\\~ًٌَُِّ])\s*(?=[\u0980-\u09FF])/);
      for (const p of parts) {
        if (/[\u0600-\u06FF]/.test(p)) {
          currentAr = (currentAr + ' ' + p).trim();
        } else if (/[\u0980-\u09FF]/.test(p)) {
          if (currentAr) {
            saveWord(currentBn, currentAr);
            currentBn = p;
            currentAr = '';
          } else {
            currentBn = (currentBn + ' ' + p).trim();
          }
        }
      }
    } else if (hasArabic) {
      currentAr = (currentAr + ' ' + tok).trim();
    } else if (hasBengali) {
      if (currentAr) {
        saveWord(currentBn, currentAr);
        currentBn = tok;
        currentAr = '';
      } else {
        currentBn = (currentBn + ' ' + tok).trim();
      }
    }
  }

  if (currentAr) {
    saveWord(currentBn, currentAr);
  }
}

function saveWord(bnRaw, arRaw) {
  const arClean = cleanArabic(arRaw);
  if (!arClean || arClean.length < 2) return;

  let bnClean = repairBengali(bnRaw);
  bnClean = bnClean.replace(/[১-৯১০১২৩৪৫৬৭৮৯২০]+[\s]*(?:ম|য়|ে|ি|র্থ|ষ্ঠ|তম)?[\s]*(?:পাঠ|অধ্যায়|খন্ড)/g, '').trim();

  const stripped = stripTashkeel(arClean);
  let pos = 'বিশেষ্য';
  let tr = '';

  for (const [key, val] of Object.entries(CANONICAL_MAP)) {
    const keyStrip = stripTashkeel(key);
    if (stripped === keyStrip || arClean === key) {
      bnClean = val.bn;
      pos = val.pos;
      tr = val.tr;
      break;
    }
  }

  if (!bnClean) return;
  if (!tr) tr = getTransliteration(arClean);

  if (pos === 'বিশেষ্য') {
    if (/^[اإ][\w\s]*ة$/i.test(arClean) || arClean.includes('(') || arClean.includes('করা') || bnClean.includes('করা') || bnClean.includes('হওয়া') || bnClean.includes('করলেন')) {
      pos = 'ক্রিয়া / মাসদার';
    } else if (['আমি', 'তুমি', 'সে', 'আমরা', 'তোমরা', 'তারা', 'ইহা', 'উহা', 'এটি', 'সেটি', 'যাঁরা'].some(p => bnClean.includes(p))) {
      pos = 'সর্বনাম';
    } else if (['কী', 'কে', 'কোথায়', 'কখন', 'কেন', 'কীভাবে'].some(q => bnClean.includes(q))) {
      pos = 'প্রশ্নবোধক';
    } else if (['উপরে', 'নিচে', 'সামনে', 'পেছনে', 'মধ্যে', 'থেকে', 'পর্যন্ত', 'সাথে', 'পাশে'].some(prep => bnClean.includes(prep))) {
      pos = 'অব্যয়';
    }
  }

  // Deduplicate within same lesson
  const exists = vocabulary.find(v => v.arabic === arClean && v.lesson === currentLesson);
  if (exists) return;

  vocabulary.push({
    id: idCounter++,
    arabic: arClean,
    bengali: bnClean,
    transliteration: tr,
    partOfSpeech: pos,
    volume: currentVolume,
    chapter: currentChapter,
    lesson: currentLesson,
    page: Math.min(26, Math.max(1, Math.floor(idCounter / 45) + 1))
  });
}

console.log('Total vocabulary items parsed:', vocabulary.length);

const chaptersHierarchy = {};
vocabulary.forEach(v => {
  if (!chaptersHierarchy[v.volume]) chaptersHierarchy[v.volume] = {};
  if (!chaptersHierarchy[v.volume][v.chapter]) chaptersHierarchy[v.volume][v.chapter] = new Set();
  chaptersHierarchy[v.volume][v.chapter].add(v.lesson);
});

const chaptersData = Object.entries(chaptersHierarchy).map(([volume, chaps]) => ({
  volume,
  chapters: Object.entries(chaps).map(([chapter, lessonsSet]) => ({
    chapter,
    lessons: Array.from(lessonsSet)
  }))
}));

const dataDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2), 'utf-8');
fs.writeFileSync(path.join(dataDir, 'chapters.json'), JSON.stringify(chaptersData, null, 2), 'utf-8');

console.log('Successfully written vocabulary.json & chapters.json to src/data!');
