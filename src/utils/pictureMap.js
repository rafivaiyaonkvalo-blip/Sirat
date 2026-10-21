/**
 * ULS Arabic — Picture Mapping Utility
 * Maps Arabic and Bengali vocabulary items to authentic 3D BookPicture SVG vector illustrations.
 */
import { hasBookPicture } from '../components/BookPicture';
import { stripAllHarakat } from './spellingUtils';

// Arabic base words (without harakat) to BookPicture key
const ARABIC_TO_PICTURE = {
  // Books & Writing
  'كتاب': 'book',
  'قلم': 'pen',
  'سبورة': 'blackboard',
  'مسطرة': 'ruler',
  'حقيبة': 'bag',
  'كراسة': 'notebook',
  'دفتر': 'notebook',
  'خريطة': 'map',

  // Furniture & Household
  'كرسي': 'chair',
  'بيت': 'house',
  'دار': 'house',
  'منزل': 'house',
  'باب': 'door',
  'مصباح': 'lamp',
  'سراج': 'lamp',
  'جدار': 'wall',
  'حائط': 'wall',
  'سرير': 'bed',
  'فراش': 'bedding',
  'وسادة': 'pillow',
  'طاولة': 'table',
  'منضدة': 'table',
  'مكتب': 'table',
  'نافذة': 'window',
  'شباك': 'window',
  'حجرة': 'room',
  'غرفة': 'room',
  'مروحة': 'fan',

  // Objects & Daily Items
  'قفل': 'lock',
  'مفتاح': 'key',
  'صندوق': 'box',
  'ساعة': 'clock',
  'مظلة': 'umbrella',
  'نظارة': 'glasses',
  'منديل': 'handkerchief',

  // Clothing & Personal
  'قميص': 'shirt',
  'ثوب': 'clothing',
  'لباس': 'clothing',
  'قلنسوة': 'cap',
  'عمامة': 'turban',
  'حذاء': 'shoe',
  'نعل': 'shoe',
  'قلادة': 'necklace',
  'عقد': 'necklace',

  // Places, Nature & Vehicles
  'مسجد': 'mosque',
  'مدرسة': 'madrasa',
  'حديقة': 'garden',
  'بستان': 'garden',
  'شجرة': 'tree',
  'زهرة': 'flower',
  'وردة': 'flower',
  'كرة': 'ball',
  'علم': 'flag',
  'راية': 'flag',
  'سيارة': 'car',
  'دراجة': 'bicycle',
  'طائرة': 'airplane',
  'سجادة': 'prayer_rug',
  'نهر': 'river'
};

// Bengali keywords to BookPicture key fallback
const BENGALI_TO_PICTURE = {
  'বই': 'book',
  'কিতাব': 'book',
  'কলম': 'pen',
  'চেয়ার': 'chair',
  'ঘর': 'house',
  'বাড়ি': 'house',
  'দরজা': 'door',
  'বাতি': 'lamp',
  'দেয়াল': 'wall',
  'খাট': 'bed',
  'বিছানা': 'bedding',
  'বালিশ': 'pillow',
  'মসজিদ': 'mosque',
  'মাদরাসা': 'madrasa',
  'বিদ্যালয়': 'madrasa',
  'ব্লাকবোর্ড': 'blackboard',
  'রুলার': 'ruler',
  'ব্যাগ': 'bag',
  'খাতা': 'notebook',
  'টেবিল': 'table',
  'কামরা': 'room',
  'কক্ষ': 'room',
  'জানালা': 'window',
  'তালা': 'lock',
  'চাবি': 'key',
  'বাক্স': 'box',
  'ঘড়ি': 'clock',
  'ছাতা': 'umbrella',
  'চশমা': 'glasses',
  'কার': 'car',
  'গাড়ি': 'car',
  'সাইকেল': 'bicycle',
  'পতাকা': 'flag',
  'পাখা': 'fan',
  'বাগান': 'garden',
  'জামা': 'shirt',
  'পাঞ্জাবি': 'shirt',
  'টুপি': 'cap',
  'পোশাক': 'clothing',
  'পাগড়ি': 'turban',
  'রুমাল': 'handkerchief',
  'জায়নামাজ': 'prayer_rug',
  'জায়নামায': 'prayer_rug',
  'গালিচা': 'prayer_rug',
  'নদী': 'river',
  'নহর': 'river',
  'জুতা': 'shoe',
  'হার': 'necklace',
  'গাছ': 'tree',
  'বিমান': 'airplane',
  'উড়োজাহাজ': 'airplane',
  'ফুল': 'flower',
  'বল': 'ball',
  'মানচিত্র': 'map'
};

/**
 * Get the matching BookPicture name for a word object or Arabic/Bengali string
 */
export function getWordPicture(wordOrText) {
  if (!wordOrText) return null;

  // 1. If explicit picture property exists and is valid
  if (typeof wordOrText === 'object' && wordOrText.picture) {
    if (hasBookPicture(wordOrText.picture)) {
      return wordOrText.picture;
    }
  }

  // 2. Resolve Arabic text
  const arabic = typeof wordOrText === 'string'
    ? wordOrText
    : wordOrText.arabic || wordOrText.targetArabic || '';

  if (arabic) {
    const stripped = stripAllHarakat(arabic).replace(/[؟?!.,]/g, '').trim();
    
    // Exact stripped match
    if (ARABIC_TO_PICTURE[stripped] && hasBookPicture(ARABIC_TO_PICTURE[stripped])) {
      return ARABIC_TO_PICTURE[stripped];
    }

    // Single token lookup for multi-word or compound phrases (e.g., 'حُجْرَةٌ - غُرْفَةٌ')
    const tokens = stripped.split(/[\s\-–—/]+/);
    for (const t of tokens) {
      if (ARABIC_TO_PICTURE[t] && hasBookPicture(ARABIC_TO_PICTURE[t])) {
        return ARABIC_TO_PICTURE[t];
      }
    }
  }

  // 3. Fallback to Bengali text
  const bangla = typeof wordOrText === 'object'
    ? wordOrText.bangla || wordOrText.bengali || ''
    : '';

  if (bangla) {
    const cleanBn = bangla.replace(/[()–—.,?!]/g, ' ');
    for (const [key, pic] of Object.entries(BENGALI_TO_PICTURE)) {
      if (cleanBn.includes(key) && hasBookPicture(pic)) {
        return pic;
      }
    }
  }

  return null;
}

/**
 * Check if a word or text has a 3D BookPicture
 */
export function hasWordPicture(wordOrText) {
  return Boolean(getWordPicture(wordOrText));
}

/**
 * Filter an array of vocabulary items that have a verified BookPicture
 */
export function getPictureVocabularyPool(vocabulary = []) {
  if (!Array.isArray(vocabulary)) return [];
  return vocabulary.filter(w => hasWordPicture(w));
}
