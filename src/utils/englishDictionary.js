// High-fidelity English Dictionary & Translation Engine for ULS Arabic (Eso Arbi Shikhi & At-Tamrinul Kitabi)

export function stripTashkeel(text) {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F]/g, '')
    .replace(/[ـ]/g, '')
    .trim();
}

// 1. Direct Arabic Words Dictionary (Mapped by stripped Arabic)
export const ARABIC_WORD_EN = {
  // Objects & Places
  'كتاب': 'A book',
  'قلم': 'A pen',
  'كرسي': 'A chair',
  'بيت': 'A house',
  'باب': 'A door',
  'مصباح': 'A lamp',
  'جدار': 'A wall',
  'سرير': 'A bed',
  'مسجد': 'A mosque',
  'مدرسة': 'A madrasa / school',
  'سبورة': 'A blackboard',
  'مسطرة': 'A ruler',
  'حقيبة': 'A bag',
  'كراسة': 'A notebook',
  'طاولة': 'A table',
  'حجرة': 'A room',
  'غرفة': 'A room',
  'نافذة': 'A window',
  'قفل': 'A lock',
  'مفتاح': 'A key',
  'صندوق': 'A box',
  'ساعة': 'A watch / clock',
  'مظلة': 'An umbrella',
  'نظارة': 'Glasses / spectacles',
  'سيارة': 'A car',
  'دراجة': 'A bicycle',
  'طريق': 'A road',
  'شارع': 'A street',
  'حديقة': 'A garden',
  'وردة': 'A rose',
  'زهرة': 'A flower',
  'شجرة': 'A tree',
  'نهر': 'A river',
  'قرية': 'A village',
  'مدينة': 'A city',
  'عاصمة': 'A capital city',
  'مطار': 'An airport',
  'طائرة': 'An airplane',
  'قطار': 'A train',
  'سفينة': 'A ship',
  'محطة': 'A station',
  'سوق': 'A market',
  'دكان': 'A shop / store',
  'مكتبة': 'A library / bookstore',
  'فندق': 'A hotel',
  'مستشفى': 'A hospital',
  'مطبخ': 'A kitchen',
  'حمام': 'A bathroom',
  'ملعب': 'A playground',
  'ساحة': 'A courtyard',
  'شاطئ': 'A beach / shore',
  'بحر': 'A sea',
  'جبل': 'A mountain',
  'سماء': 'The sky',
  'ارض': 'The earth',
  'شمس': 'The sun',
  'قمر': 'The moon',
  'نجم': 'A star',
  'مطر': 'Rain',
  'سحاب': 'Clouds',
  'ريح': 'Wind',
  'هواء': 'Air',
  'ماء': 'Water',
  'نار': 'Fire',
  'نور': 'Light',
  'ظلمة': 'Darkness',

  // Food & Clothing
  'خبز': 'Bread',
  'طعام': 'Food',
  'لحم': 'Meat',
  'سمك': 'Fish',
  'عسل': 'Honey',
  'لبن': 'Milk',
  'ماء بارد': 'Cold water',
  'شاي': 'Tea',
  'قهوة': 'Coffee',
  'فاكهة': 'Fruit',
  'تفاح': 'Apple',
  'تفاحة': 'An apple',
  'عنب': 'Grapes',
  'رمان': 'Pomegranate',
  'موز': 'Banana',
  'تين': 'Fig',
  'زيتون': 'Olive',
  'لباس': 'Clothing / garment',
  'ثوب': 'A robe / dress',
  'قميص': 'A shirt',
  'منديل': 'A handkerchief',
  'عمامة': 'A turban',
  'قلنسوة': 'A cap',
  'حذاء': 'Shoes',
  'نعل': 'Sandal',
  'عقد': 'A necklace',
  'خاتم': 'A ring',
  'سوار': 'A bracelet',
  'مرآة': 'A mirror',
  'مشط': 'A comb',
  'صابون': 'Soap',
  'فراش': 'A mattress / bedding',
  'وسادة': 'A pillow',
  'ستار': 'A curtain',
  'ستارة': 'A curtain',
  'بساط': 'A rug / mat',
  'سجادة': 'A prayer rug / carpet',

  // People, Family & Roles
  'رجل': 'A man',
  'امراة': 'A woman',
  'ولد': 'A boy',
  'بنت': 'A girl',
  'طفل': 'A child (m.)',
  'طفلة': 'A child (f.)',
  'شاب': 'A youth',
  'شيخ': 'An elderly person / scholar',
  'معلم': 'A teacher (m.)',
  'معلمة': 'A teacher (f.)',
  'استاذ': 'A professor / teacher',
  'تلميذ': 'A student (m.)',
  'تلميذة': 'A student (f.)',
  'طالب': 'A student (m.)',
  'طالبة': 'A student (f.)',
  'طبيب': 'A doctor (m.)',
  'طبيبة': 'A doctor (f.)',
  'ممرض': 'A male nurse',
  'ممرضة': 'A female nurse',
  'تاجر': 'A merchant (m.)',
  'تاجرة': 'A merchant (f.)',
  'فلاح': 'A farmer (m.)',
  'فلاحة': 'A farmer (f.)',
  'خادم': 'A servant (m.)',
  'خادمة': 'A servant (f.)',
  'صديق': 'A friend (m.)',
  'صديقة': 'A friend (f.)',
  'اب': 'Father',
  'والد': 'Father',
  'ام': 'Mother',
  'والدة': 'Mother',
  'اخ': 'Brother',
  'اخت': 'Sister',
  'ابن': 'Son',
  'ابنة': 'Daughter',
  'عم': 'Paternal uncle',
  'عمة': 'Paternal aunt',
  'خال': 'Maternal uncle',
  'خالة': 'Maternal aunt',
  'جد': 'Grandfather',
  'جدة': 'Grandmother',
  'زوج': 'Husband',
  'زوجة': 'Wife',
  'جار': 'A neighbor',
  'ضيف': 'A guest',
  'مسافر': 'A traveler',
  'مجاهد': 'A mujahid / striver',
  'امام': 'An Imam',
  'مؤذن': 'A muezzin',
  'مؤمن': 'A believer (m.)',
  'مؤمنة': 'A believer (f.)',
  'مسلم': 'A Muslim (m.)',
  'مسلمة': 'A Muslim (f.)',
  'كافر': 'A disbeliever (m.)',
  'كافرة': 'A disbeliever (f.)',
  'منافق': 'A hypocrite (m.)',
  'منافقة': 'A hypocrite (f.)',
  'رسول': 'Messenger',
  'نبي': 'Prophet',
  'ملك': 'An angel / King',

  // Animals
  'حيوان': 'An animal',
  'فرس': 'A horse',
  'حصان': 'A horse',
  'حمار': 'A donkey',
  'جمل': 'A camel',
  'ناقة': 'A female camel',
  'بقرة': 'A cow',
  'ثور': 'An ox / bull',
  'شاة': 'A sheep',
  'كبش': 'A ram',
  'ماعز': 'A goat',
  'كلب': 'A dog',
  'قط': 'A cat',
  'هرة': 'A female cat',
  'طائر': 'A bird',
  'عصفور': 'A sparrow',
  'حمامة': 'A dove / pigeon',
  'غراب': 'A crow',
  'ديك': 'A rooster',
  'دجاجة': 'A hen',
  'اسد': 'A lion',
  'ذئب': 'A wolf',
  'ثعلب': 'A fox',
  'فيل': 'An elephant',
  'نملة': 'An ant',
  'نحلة': 'A bee',

  // Adjectives
  'جديد': 'New (m.)',
  'جديدة': 'New (f.)',
  'قديم': 'Old (m.)',
  'قديمة': 'Old (f.)',
  'جميل': 'Beautiful (m.)',
  'جميلة': 'Beautiful (f.)',
  'قبيح': 'Ugly (m.)',
  'قبيحة': 'Ugly (f.)',
  'كبير': 'Big / Large (m.)',
  'كبيرة': 'Big / Large (f.)',
  'صغير': 'Small / Little (m.)',
  'صغيرة': 'Small / Little (f.)',
  'نظيف': 'Clean (m.)',
  'نظيفة': 'Clean (f.)',
  'وسخ': 'Dirty (m.)',
  'وسخة': 'Dirty (f.)',
  'جيد': 'Good / Fine (m.)',
  'جيدة': 'Good / Fine (f.)',
  'رديء': 'Bad / Poor quality (m.)',
  'رديئة': 'Bad / Poor quality (f.)',
  'مفيد': 'Useful / Beneficial (m.)',
  'مفيدة': 'Useful / Beneficial (f.)',
  'ضار': 'Harmful (m.)',
  'ضارة': 'Harmful (f.)',
  'سهل': 'Easy (m.)',
  'سهلة': 'Easy (f.)',
  'صعب': 'Difficult / Hard (m.)',
  'صعبة': 'Difficult / Hard (f.)',
  'مفتوح': 'Open (m.)',
  'مفتوحة': 'Open (f.)',
  'مغلق': 'Closed (m.)',
  'مغلقة': 'Closed (f.)',
  'واسع': 'Spacious / Wide (m.)',
  'واسعة': 'Spacious / Wide (f.)',
  'ضيق': 'Narrow (m.)',
  'ضيقة': 'Narrow (f.)',
  'طويل': 'Tall / Long (m.)',
  'طويلة': 'Tall / Long (f.)',
  'قصير': 'Short (m.)',
  'قصيرة': 'Short (f.)',
  'قوي': 'Strong (m.)',
  'قوية': 'Strong (f.)',
  'ضعيف': 'Weak (m.)',
  'ضعيفة': 'Weak (f.)',
  'غني': 'Rich / Wealthy (m.)',
  'غنية': 'Rich / Wealthy (f.)',
  'فقير': 'Poor (m.)',
  'فقيرة': 'Poor (f.)',
  'مجتهد': 'Diligent / Hardworking (m.)',
  'مجتهدة': 'Diligent / Hardworking (f.)',
  'كسلان': 'Lazy (m.)',
  'كسلى': 'Lazy (f.)',
  'ذكي': 'Smart / Intelligent (m.)',
  'ذكية': 'Smart / Intelligent (f.)',
  'غبي': 'Foolish / Dull (m.)',
  'غبية': 'Foolish / Dull (f.)',
  'مؤدب': 'Polite / Well-mannered (m.)',
  'مؤدبة': 'Polite / Well-mannered (f.)',
  'صالح': 'Righteous / Good (m.)',
  'صالحة': 'Righteous / Good (f.)',
  'فاسد': 'Corrupt / Spoiled (m.)',
  'فاسدة': 'Corrupt / Spoiled (f.)',
  'صادق': 'Truthful (m.)',
  'صادقة': 'Truthful (f.)',
  'كاذب': 'A liar (m.)',
  'كاذبة': 'A liar (f.)',
  'امين': 'Trustworthy (m.)',
  'امينة': 'Trustworthy (f.)',
  'ماهر': 'Skilled (m.)',
  'ماهرة': 'Skilled (f.)',
  'شريف': 'Noble (m.)',
  'شريفة': 'Noble (f.)',
  'عظيم': 'Great / Magnificent (m.)',
  'عظيمة': 'Great / Magnificent (f.)',
  'كريم': 'Generous / Noble (m.)',
  'كريمة': 'Generous / Noble (f.)',
  'بخيل': 'Miserly / Stingy (m.)',
  'بخيلة': 'Miserly / Stingy (f.)',
  'سريع': 'Fast / Quick (m.)',
  'سريعة': 'Fast / Quick (f.)',
  'بطيء': 'Slow (m.)',
  'بطيئة': 'Slow (f.)',
  'حار': 'Hot',
  'بارد': 'Cold',
  'حلو': 'Sweet',
  'حامض': 'Sour',
  'لذيذ': 'Delicious',
  'طازج': 'Fresh',
  'رخيص': 'Cheap',
  'غال': 'Expensive',
  'غالية': 'Expensive (f.)',
  'عالي': 'High / Tall',
  'عالية': 'High / Tall (f.)',
  'مظلم': 'Dark',
  'مظلمة': 'Dark (f.)',
  'منير': 'Illuminating / Bright',
  'منيرة': 'Illuminating / Bright (f.)',

  // Demonstratives & Pronouns
  'هذا': 'This (m.)',
  'هذه': 'This (f.)',
  'ذلك': 'That (m.)',
  'تلك': 'That (f.)',
  'هؤلاء': 'These',
  'اولئك': 'Those',
  'انا': 'I',
  'انت': 'You (m.)',
  'انتِ': 'You (f.)',
  'هو': 'He / It',
  'هي': 'She / It',
  'نحن': 'We',
  'انتم': 'You (all m.)',
  'هم': 'They (m.)',

  // Prepositions & Adverbs
  'في': 'In',
  'على': 'On',
  'الى': 'To',
  'من': 'From',
  'عن': 'About / From',
  'مع': 'With',
  'عند': 'At / With / Near',
  'تحت': 'Under',
  'فوق': 'Above',
  'امام': 'In front of',
  'وراء': 'Behind',
  'خلف': 'Behind',
  'بين': 'Between',
  'يمين': 'Right',
  'يسار': 'Left',
  'شمال': 'North / Left',
  'جنوب': 'South',
  'شرق': 'East',
  'غرب': 'West',
  'هنا': 'Here',
  'هناك': 'There',
  'الان': 'Now',
  'اليوم': 'Today',
  'امس': 'Yesterday',
  'غدا': 'Tomorrow',
  'صباحا': 'In the morning',
  'مساء': 'In the evening',
  'ليلا': 'At night',
  'نهارا': 'During the day',
  'دائما': 'Always',
  'ابدا': 'Never / Ever',
  'جدا': 'Very',
  'ايضا': 'Also / Too',
  'فقط': 'Only',
  'كثيرا': 'A lot / Much',
  'قليلا': 'A little',
  'معا': 'Together',

  // Questions & Particles
  'ما': 'What',
  'من': 'Who',
  'هل': 'Is / Are / Do?',
  'اين': 'Where',
  'كيف': 'How',
  'لماذا': 'Why',
  'متى': 'When',
  'كم': 'How much / How many',
  'نعم': 'Yes',
  'لا': 'No',
  'بل': 'Rather / But',
  'و': 'And',
  'ف': 'Then / So',
  'ثم': 'Then',
  'او': 'Or',
  'ام': 'Or (in questions)',
  'لكن': 'But',
  'ان': 'Indeed / That',
  'يا': 'O (calling vocative)',
  'ليس': 'Is not',
  'ماذا': 'What'
};

// 2. High-Frequency Sentence Dictionary (Matched by stripped Arabic)
export const ARABIC_SENTENCE_EN = {
  // Lesson 1
  'هذا كتاب': 'This is a book',
  'ذلك قلم': 'That is a pen',
  'هذا مسجد': 'This is a mosque',
  'ذلك بيت': 'That is a house',
  'هذا باب': 'This is a door',
  'ذلك مصباح': 'That is a lamp',
  'هذا جدار': 'This is a wall',
  'ذلك كرسي': 'That is a chair',
  'هذا سرير': 'This is a bed',
  'هذه مدرسة': 'This is a madrasa / school',
  'تلك سبورة': 'That is a blackboard',
  'هذه مسطرة': 'This is a ruler',
  'تلك حقيبة': 'That is a bag',
  'هذه كراسة': 'This is a notebook',
  'تلك طاولة': 'That is a table',
  'هذه حجرة': 'This is a room',
  'تلك نافذة': 'That is a window',
  'هذه ساعة': 'This is a watch',
  'تلك مظلة': 'That is an umbrella',
  'هذا قفل': 'This is a lock',
  'ذلك مفتاح': 'That is a key',
  'هذا صندوق': 'This is a box',
  'هذه نظارة': 'These are glasses',
  'تلك سيارة': 'That is a car',
  'هذه دراجة': 'This is a bicycle',

  // Questions
  'ما هذا': 'What is this?',
  'ما هذا؟': 'What is this?',
  'ما ذلك': 'What is that?',
  'ما ذلك؟': 'What is that?',
  'ما هذه': 'What is this?',
  'ما هذه؟': 'What is this?',
  'ما تلك': 'What is that?',
  'ما تلك؟': 'What is that?',
  'هل هذا كتاب': 'Is this a book?',
  'هل هذا كتاب؟': 'Is this a book?',
  'نعم هذا كتاب': 'Yes, this is a book',
  'لا بل هذا قلم': 'No, rather this is a pen',
  'هل ذلك قلم': 'Is that a pen?',
  'هل ذلك قلم؟': 'Is that a pen?',
  'نعم ذلك قلم': 'Yes, that is a pen',
  'لا بل ذلك كتاب': 'No, rather that is a book',
  'هل هذه مدرسة': 'Is this a madrasa?',
  'هل هذه مدرسة؟': 'Is this a madrasa?',
  'نعم هذه مدرسة': 'Yes, this is a madrasa',
  'لا بل هذه حجرة': 'No, rather this is a room',
  'هل تلك سبورة': 'Is that a blackboard?',
  'هل تلك سبورة؟': 'Is that a blackboard?',
  'نعم تلك سبورة': 'Yes, that is a blackboard',

  // Lesson 2 & Attributes
  'هذا كتاب جديد': 'This is a new book',
  'ذلك قلم قديم': 'That is an old pen',
  'الكتاب جديد': 'The book is new',
  'القلم قديم': 'The pen is old',
  'الكتاب جميل': 'The book is beautiful',
  'المدرسة قديمة': 'The school is old',
  'هذا مسجد جميل': 'This is a beautiful mosque',
  'ذلك بيت واسع': 'That is a spacious house',
  'هذا باب مفتوح': 'This is an open door',
  'ذلك قفل جيد': 'That is a good lock',
  'هذه ساعة جديدة': 'This is a new watch',
  'تلك دراجة سريعة': 'That is a fast bicycle',
  'الساعة جديدة': 'The watch is new',
  'الدراجة سريعة': 'The bicycle is fast',
  'الباب مفتوح': 'The door is open',
  'المنديل وسخ': 'The handkerchief is dirty',
  'المنديل نظيف': 'The handkerchief is clean',
  'الماء بارد': 'The water is cold',
  'الشاي حار': 'The tea is hot',
  'اللبن لذيذ': 'The milk is delicious',
  'الرجل شريف': 'The man is noble',
  'الولد ذكي': 'The boy is intelligent',
  'التلميذ مجتهد': 'The student is hardworking',
  'هو معلم ماهر': 'He is a skilled teacher',
  'هي معلمة ماهرة': 'She is a skilled teacher',
  'ذلك التاجر غني': 'That merchant is rich',
  'تلك الفلاحة فقيرة': 'That farmer is poor',

  // Pronouns & Names
  'من انت': 'Who are you?',
  'من انت؟': 'Who are you?',
  'انا بلال': 'I am Bilal',
  'انا ولد مؤدب': 'I am a polite boy',
  'انا تلميذ جديد': 'I am a new student',
  'هو راشد': 'He is Rashid',
  'هي فاطمة': 'She is Fatimah',
  'هي عائشة': 'She is Aisha',
  'انت ماجد': 'You are Majid',
  'انت تلميذ ذكي': 'You are an intelligent student',
  'محمود طفل جميل': 'Mahmud is a handsome child',
  'خالد ولد مؤدب': 'Khalid is a polite boy',
  'خديجة بنت مؤدبة': 'Khadijah is a polite girl',
  'هل انت معلم': 'Are you a teacher?',
  'هل انت معلم؟': 'Are you a teacher?',
  'لا بل انا تلميذ': 'No, rather I am a student',
  'نعم انا معلم': 'Yes, I am a teacher',
  'انا ماجد وانت بلال': 'I am Majid and you are Bilal',
  'محمود رجل غني': 'Mahmud is a rich man',
  'عائشة امراة ذكية': 'Aisha is a smart woman',

  // Possessive & Prepositions
  'هذا كتابي': 'This is my book',
  'ذلك قلمي': 'That is my pen',
  'هذا كتابك': 'This is your book',
  'تلك حقيبتك': 'That is your bag',
  'اسمي شاهد': 'My name is Shahid',
  'فاطمة اختي': 'Fatimah is my sister',
  'وانا اخوها': 'And I am her brother',
  'غرفتي نظيفة': 'My room is clean',
  'فراشي نظيف': 'My bedding is clean',
  'كتاب راشد جديد': 'Rashid\'s book is new',
  'كتاب عائشة جميل': 'Aisha\'s book is beautiful',
  'ساعة بشير غالية': 'Bashir\'s watch is expensive',
  'باب المسجد مفتوح': 'The door of the mosque is open',
  'امام المسجد رجل صالح': 'The Imam of the mosque is a righteous man',
  'في الغرفة مصباح': 'In the room is a lamp',
  'المصباح في الغرفة': 'The lamp is in the room',
  'العقد في الصندوق': 'The necklace is in the box',
  'في الحديقة شجرة': 'In the garden is a tree',
  'القلم على الطاولة': 'The pen is on the table',
  'الكتاب امامك': 'The book is in front of you',
  'السيارة وراءك': 'The car is behind you',
  'المروحة فوقك': 'The fan is above you',
  'عائشة في غرفتها': 'Aisha is in her room',
  'هو في سيارته': 'He is in his car',

  // Faith & Universal Truths
  'الله ربنا': 'Allah is our Lord',
  'محمد نبينا': 'Muhammad is our Prophet',
  'محمد رسول الله': 'Muhammad is the Messenger of Allah',
  'الاسلام ديننا': 'Islam is our religion',
  'القران كتابنا': 'The Quran is our Book',
  'الكعبة قبلتنا': 'The Kaaba is our Qiblah',
  'الحمد لله': 'All praise is for Allah',
  'سبحان الله': 'Glory be to Allah',
  'الله اكبر': 'Allah is the Greatest',
  'لا اله الا الله': 'There is no god but Allah',
  'في قلب المؤمن نور': 'In the believer\'s heart is light',
  'وفي قلب الكافر ظلمة': 'And in the disbeliever\'s heart is darkness'
};

// 3. Fallback Bangla-to-English Common Phrases
export const BANGLA_PHRASE_EN = {
  'একটি বই': 'A book',
  'একটি কলম': 'A pen',
  'একটি চেয়ার': 'A chair',
  'একটি ঘর': 'A house',
  'একটি দরজা': 'A door',
  'একটি বাতি': 'A lamp',
  'একটি দেয়াল': 'A wall',
  'একটি খাট': 'A bed',
  'একটি মসজিদ': 'A mosque',
  'একটি মাদরাসা': 'A madrasa / school',
  'একটি মাদরাসা (বিদ্যালয়)': 'A madrasa / school',
  'একটি ব্লাকবোর্ড': 'A blackboard',
  'একটি রুলার': 'A ruler',
  'একটি ব্যাগ': 'A bag',
  'একটি খাতা': 'A notebook',
  'একটি টেবিল': 'A table',
  'একটি কামরা': 'A room',
  'একটি জানালা': 'A window',
  'একটি তালা': 'A lock',
  'একটি চাবি': 'A key',
  'একটি বাক্স': 'A box',
  'একটি ঘড়ি': 'A watch / clock',
  'একটি ছাতা': 'An umbrella',
  'একটি চশমা': 'Glasses',
  'একটি কার': 'A car',
  'একটি গাড়ি': 'A car',
  'একটি সাইকেল': 'A bicycle',
  'ইহা (একটি) বই': 'This is a book',
  'উহা (একটি) কলম': 'That is a pen',
  'ইহা একটি মসজিদ': 'This is a mosque',
  'উহা একটি ঘর': 'That is a house',
  'ইহা একটি দরজা': 'This is a door',
  'উহা একটি বাতি': 'That is a lamp',
  'ইহা একটি দেয়াল': 'This is a wall',
  'উহা একটি চেয়ার': 'That is a chair',
  'ইহা একটি খাট': 'This is a bed',
  'ইহা একটি মাদরাসা': 'This is a madrasa',
  'উহা একটি ব্লাকবোর্ড': 'That is a blackboard',
  'ইহা একটি রুলার': 'This is a ruler',
  'উহা একটি ব্যাগ': 'That is a bag',
  'ইহা একটি খাতা': 'This is a notebook',
  'উহা একটি টেবিল': 'That is a table',
  'ইহা একটি কামরা': 'This is a room',
  'উহা একটি জানালা': 'That is a window',
  'ইহা একটি ঘড়ি': 'This is a watch',
  'উহা একটি ছাতা': 'That is an umbrella',
  'ইহা একটি চশমা': 'These are glasses',
  'উহা একটি কার': 'That is a car',
  'ইহা একটি সাইকেল': 'This is a bicycle',
  'নতুন': 'New',
  'পুরাতন': 'Old',
  'সুন্দর': 'Beautiful',
  'বড়': 'Big / Large',
  'ছোট': 'Small / Little',
  'পরিচ্ছন্ন': 'Clean',
  'খোলা': 'Open',
  'বন্ধ': 'Closed',
  'প্রশস্ত': 'Spacious',
  'সহজ': 'Easy',
  'কঠিন': 'Difficult',
  'ধনী': 'Rich',
  'দরিদ্র': 'Poor',
  'পরিশ্রমী': 'Hardworking',
  'মেধাবী': 'Intelligent',
  'ভদ্র': 'Polite',
  'উত্তম': 'Good / Best',
  'খারাপ': 'Bad',
  'উপকারী': 'Beneficial',
  'ক্ষতিকর': 'Harmful',
  'সুস্বাদু': 'Delicious',
  'মিষ্টি': 'Sweet',
  'গরম': 'Hot',
  'ঠান্ডা': 'Cold',
  'দ্রুতগামী': 'Fast',
  'ধীরগতির': 'Slow'
};

// 4. Grammar Pattern Translator for Dynamic Arabic Sentences
function translateByPattern(strippedAr) {
  if (!strippedAr) return null;

  // Question: ما هذا / ما ذلك / ما هذه / ما تلك
  if (/^ما (هذا|هذه)/.test(strippedAr)) return 'What is this?';
  if (/^ما (ذلك|تلك)/.test(strippedAr)) return 'What is that?';
  if (/^من (هذا|هذه)/.test(strippedAr)) return 'Who is this?';
  if (/^من (ذلك|تلك)/.test(strippedAr)) return 'Who is that?';
  if (/^من انت/.test(strippedAr)) return 'Who are you?';
  if (/^من هو/.test(strippedAr)) return 'Who is he?';
  if (/^من هي/.test(strippedAr)) return 'Who is she?';

  // Pattern: هل [noun] [adj]?
  if (strippedAr.startsWith('هل ')) {
    const rest = strippedAr.replace('هل ', '').trim();
    if (ARABIC_SENTENCE_EN[rest]) {
      return `Is ${ARABIC_SENTENCE_EN[rest].toLowerCase()}?`.replace('is this is', 'is this');
    }
  }

  // Pattern: هذا [word] / ذلك [word] / هذه [word] / تلك [word]
  const matchDemonstrativeSingle = strippedAr.match(/^(هذا|ذلك|هذه|تلك)\s+([\u0621-\u064A]+)$/);
  if (matchDemonstrativeSingle) {
    const dem = matchDemonstrativeSingle[1];
    const word = matchDemonstrativeSingle[2];
    const wordEn = ARABIC_WORD_EN[word];
    if (wordEn) {
      const isFar = (dem === 'ذلك' || dem === 'تلك');
      const prefix = isFar ? 'That is ' : 'This is ';
      return `${prefix}${wordEn.toLowerCase()}`;
    }
  }

  // Pattern: هذا [word] [adj] (e.g. هذا كتاب جديد)
  const matchDemNounAdj = strippedAr.match(/^(هذا|ذلك|هذه|تلك)\s+([\u0621-\u064A]+)\s+([\u0621-\u064A]+)$/);
  if (matchDemNounAdj) {
    const dem = matchDemNounAdj[1];
    const noun = matchDemNounAdj[2];
    const adj = matchDemNounAdj[3];
    const nounEn = ARABIC_WORD_EN[noun];
    const adjEn = ARABIC_WORD_EN[adj];
    if (nounEn && adjEn) {
      const isFar = (dem === 'ذلك' || dem === 'تلك');
      const cleanNoun = nounEn.replace(/^(A|An)\s+/i, '').toLowerCase();
      const cleanAdj = adjEn.replace(/\s+\(.*?\)/g, '').toLowerCase();
      const article = /^[aeiou]/i.test(cleanAdj) ? 'an' : 'a';
      return `${isFar ? 'That is' : 'This is'} ${article} ${cleanAdj} ${cleanNoun}`;
    }
  }

  // Pattern: الـ[noun] [adj] (e.g. الكتاب جديد)
  const matchAlNounAdj = strippedAr.match(/^ال([\u0621-\u064A]+)\s+([\u0621-\u064A]+)$/);
  if (matchAlNounAdj) {
    const noun = matchAlNounAdj[1];
    const adj = matchAlNounAdj[2];
    const nounEn = ARABIC_WORD_EN[noun];
    const adjEn = ARABIC_WORD_EN[adj];
    if (nounEn && adjEn) {
      const cleanNoun = nounEn.replace(/^(A|An)\s+/i, '').toLowerCase();
      const cleanAdj = adjEn.replace(/\s+\(.*?\)/g, '').toLowerCase();
      return `The ${cleanNoun} is ${cleanAdj}`;
    }
  }

  return null;
}

/**
 * Main translation lookup helper
 * @param {string|object} item - Word/Sentence object or Arabic string
 * @param {string} [optionalBengali] - Optional Bengali text for fallback lookup
 * @returns {string|null} English translation or null
 */
export function getEnglishTranslation(item, optionalBengali = '') {
  if (!item) return null;

  // 1. Check if item already has an explicit english field
  if (typeof item === 'object') {
    if (item.english && typeof item.english === 'string') {
      return item.english.trim();
    }
    if (item.en && typeof item.en === 'string') {
      return item.en.trim();
    }
  }

  const arabicText = typeof item === 'string' ? item : (item.arabic || item.word?.arabic || item.targetArabic || '');
  const bengaliText = optionalBengali || (typeof item === 'object' ? (item.bengali || item.bangla || item.word?.bangla || item.targetBangla || '') : '');

  const strippedAr = stripTashkeel(arabicText);

  // 2. Direct sentence lookup
  if (ARABIC_SENTENCE_EN[strippedAr]) {
    return ARABIC_SENTENCE_EN[strippedAr];
  }

  // 3. Direct word lookup
  if (ARABIC_WORD_EN[strippedAr]) {
    return ARABIC_WORD_EN[strippedAr];
  }

  // 4. Grammar Pattern Translation
  const patternMatch = translateByPattern(strippedAr);
  if (patternMatch) {
    return patternMatch;
  }

  // 5. Bengali phrase mapping fallback
  const cleanBn = (bengaliText || '').trim();
  if (cleanBn && BANGLA_PHRASE_EN[cleanBn]) {
    return BANGLA_PHRASE_EN[cleanBn];
  }

  return null;
}

export default {
  getEnglishTranslation,
  stripTashkeel,
  ARABIC_WORD_EN,
  ARABIC_SENTENCE_EN,
  BANGLA_PHRASE_EN
};
