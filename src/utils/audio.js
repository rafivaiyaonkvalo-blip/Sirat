import { isSoundMuted } from './soundEffects';

// High-fidelity Arabic audio player - Persona: Pure Classical Fusha Qari (ফাহেদ - কুয়েতি বিশুদ্ধ জ্বীম ও ফাসিহ্ আরবি)
// Characteristics: Pure Jeem [d͡ʒ] (not Egyptian G), slow deliberate rate (-22%), prolonged Madd, zero waqf

let currentAudio = null;
let arabicMaleVoice = null;

export const RAFI_IBRAHIM_VOICE = 'ar-KW-FahedNeural'; // বিশুদ্ধ 'জ্বীম' (J) উচ্চারণে কুয়েতি ফুসহা ক্বারী (Fahed)
export const RAFI_IBRAHIM_ALT = 'ar-QA-MoazNeural'; // উপসাগরীয় বিশুদ্ধ ফুসহা (Moaz)

// কণ্ঠের ধরন: সবসময় ছেলেদের কণ্ঠ। 'adult' = স্বাভাবিক ও হালকা মিষ্টি ক্বারী কণ্ঠ, 'child' = কোমল শিশু কণ্ঠ
export const VOICE_PROFILES = {
  adult: { id: 'adult', label: 'স্বাভাবিক ও হালকা', arPitch: '+10Hz', bnPitch: '+8Hz' },
  child: { id: 'child', label: 'শিশু কণ্ঠ', arPitch: '+22Hz', bnPitch: '+20Hz' }
};
const VOICE_PROFILE_KEY = 'uls_voice_profile';
// অডিও ক্যাশের সংস্করণ: হালকা ও সাবলীল কণ্ঠের জন্য নতুন সংস্করণ
const AUDIO_CACHE_VERSION = 'male-light-v8';

export function getVoiceProfile() {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(VOICE_PROFILE_KEY) : null;
    if (!localStorage.getItem('uls_voice_light_v8')) {
      localStorage.setItem(VOICE_PROFILE_KEY, 'adult');
      localStorage.setItem('uls_voice_light_v8', '1');
      return 'adult';
    }
    return VOICE_PROFILES[saved] ? saved : 'adult';
  } catch (e) {
    return 'adult';
  }
}

export function setVoiceProfile(id) {
  const next = VOICE_PROFILES[id] ? id : 'adult';
  try {
    localStorage.setItem(VOICE_PROFILE_KEY, next);
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('uls_voice_profile_changed', { detail: { profile: next } }));
  }
  return next;
}

export function prepareArabicWithoutWaqf(text) {
  if (!text) return '';
  let t = text.trim();

  // 1. Strip tatweel / kashida (\u0640)
  t = t.replace(/\u0640/g, '');

  // 2. Strip Bengali/English explanatory text mixed into Arabic strings (e.g. "(বহুবচন: ...)")
  t = t.replace(/[\u0980-\u09FF]/g, ' ');

  // 3. Strip all invisible/bidi control characters (LRM, RLM, ALM, ZWNJ, ZWJ, ZWSP, BOM, etc.)
  t = t.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF\u061C\u00A0]/g, '');

  // 4. Strip all Quranic stop signs, ornaments, ligatures, punctuation, quotes, brackets, dashes, Arabic/Urdu stops
  // Including Arabic full stop (\u06D4 ۔), Arabic semicolon (؛), Arabic comma (،), Arabic question mark (؟)
  // Arabic percent (٪), Arabic decimal/thousands (٫ ٬), asterisk (٭), Quranic signs (\u06D6-\u06ED, \uFDFA-\uFDFD)
  t = t.replace(/[\u06D4\u06D6-\u06ED\uFDFA-\uFDFD\u066A-\u066D]/g, ' ');
  t = t.replace(/[.,!?؟:;؛،—–―\-\/\\()[\]{}«»"“”'‘’‹›…~_#*+^=<>|]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();

  // 5. Canonical normalization: ensure Shaddah (\u0651) always PRECEDES vowel diacritics
  // If Harakah precedes Shaddah (e.g. \u064C\u0651, \u064E\u0651), swap them so Shaddah is attached to consonant
  t = t.replace(/([\u064B-\u0650\u0670])\u0651/g, '\u0651$1');

  // 6. Prolong Madd for Demonstratives so Madd is drawn out/elongated
  t = t.replace(/هٰذَا|هَـٰذَا|هَٰذَا/g, 'هَاذَا');
  t = t.replace(/هٰذِهِ|هَـٰذِهِ|هَٰذِهِ|هَذِهِ/g, 'هَاذِهِي');
  t = t.replace(/ذٰلِكَ|ذَٰلِكَ|ذَـٰلِكَ/g, 'ذَالِكَ');
  t = t.replace(/أُولٰئِكَ|أُولَٰئِكَ/g, 'أُولَائِكَ');
  t = t.replace(/هٰؤُلَاءِ|هَٰؤُلَاءِ/g, 'هَاؤُلَاءِ');

  // 7. Phonetic Zero-Waqf Transformation for Tanween
  // Taa Marbutah + Tanween
  t = t.replace(/ة\u0651?\u064C/g, 'تُنْ'); // ةٌ -> تُنْ (-tun)
  t = t.replace(/ة\u0651?\u064D/g, 'تِنْ'); // ةٍ -> تِنْ (-tin)
  t = t.replace(/ة\u0651?\u064B/g, 'تَنْ'); // ةً -> تَنْ (-tan)

  // Fathatan on general letters (handles both Alif-after \u064B\u0627 and Alif-before \u0627\u064B, and Alif Maqsura \u0649\u064B / \u064B\u0649)
  t = t.replace(/([\u0621-\u0626\u0628-\u0648\u064A-\u06D3]\u0651?)[اى]?\u064B[اى]?/g, '$1َنْ');
  t = t.replace(/\u064B[اى]?/g, 'َنْ');

  // Dammatan on general letters
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064C/g, '$1ُنْ');
  t = t.replace(/\u064C/g, 'ُنْ');

  // Kasratan on general letters
  t = t.replace(/([\u0621-\u064A\u0671-\u06D3]\u0651?)\u064D/g, '$1ِنْ');
  t = t.replace(/\u064D/g, 'ِنْ');

  // 8. Phonetic Zero-Waqf for Taa Marbutah + Single Harakah (preserve pure short vowels without artificial Madd)
  t = t.replace(/ة\u0651?\u064F/g, 'تُ'); // ةُ -> تُ (-tu)
  t = t.replace(/ة\u0651?\u0650/g, 'تِ'); // ةِ -> تِ (-ti)
  t = t.replace(/ة\u0651?\u064E/g, 'تَ'); // ةَ -> تَ (-ta)
  t = t.replace(/ة(?=\s|$)/g, 'تْ');       // isolated bare ة without harakah

  // 9. Normalize Alif Maqsura (ىَ) with Fatha at word boundary to regular Alif (ـَا)
  t = t.replace(/ى\u064E(?=\s|$)/g, 'َا');

  // 10. Clean extra whitespace
  return t.replace(/\s+/g, ' ').trim();
}

function getCleanArabicText(text) {
  if (!text) return '';
  return text
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF\u061C\u00A0]/g, '')
    .replace(/[()\[\]{}—–\-\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSelectedVoice() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('arabic_tts_voice');
      if (saved && saved !== RAFI_IBRAHIM_VOICE) {
        localStorage.setItem('arabic_tts_voice', RAFI_IBRAHIM_VOICE);
      }
    } catch (e) {}
    return RAFI_IBRAHIM_VOICE;
  }
  return RAFI_IBRAHIM_VOICE;
}

export function setSelectedVoice(voiceId) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('arabic_tts_voice', voiceId);
    } catch (e) {}
    audioCache.clear();
  }
}

const audioCache = new Map();

export function stopAllAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('uls_sound_mute_changed', (e) => {
    if (e.detail?.muted) {
      stopAllAudio();
    }
  });
}

const getTtsEndpoint = () => (typeof window !== 'undefined' && window.location.hostname === 'markazuliman.com') ? 'https://sirat-theta.vercel.app/api/tts' : '/api/tts';

// High-fidelity Audio Stream Player (via /api/tts - Rafi Ibrahim)
export function playViaOnlineAudio(cleanText, overrideVoice = null, playbackRate = 1.0) {
  if (isSoundMuted()) return false;
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const preparedText = prepareArabicWithoutWaqf(cleanText);
    const voice = overrideVoice || getSelectedVoice();
    const pitch = VOICE_PROFILES[getVoiceProfile()].arPitch;
    const encoded = encodeURIComponent(preparedText);
    // হালকা ও সাবলীল গতি (-14%), বিশুদ্ধ জ্বীম, আর hold=1: শেষ শব্দেও ওয়াকফ ছাড়া শেষ হরকত উচ্চারিত হয়
    const url = `${getTtsEndpoint()}?text=${encoded}&voice=${encodeURIComponent(voice)}&rate=${encodeURIComponent('-14%')}&pitch=${encodeURIComponent(pitch)}&hold=1&v=${AUDIO_CACHE_VERSION}`;
    const cacheKey = `${AUDIO_CACHE_VERSION}:${voice}:${pitch}:${preparedText}`;

    let audio = audioCache.get(cacheKey);
    if (!audio) {
      audio = new Audio(url);
      audio.playbackRate = playbackRate || 1.0;
      audioCache.set(cacheKey, audio);
    } else {
      audio.currentTime = 0;
      audio.playbackRate = playbackRate || 1.0;
    }

    currentAudio = audio;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // AbortError occurs normally if user clicks another audio quickly
        if (err.name !== 'AbortError') {
          console.warn('Online audio playback issue:', err.message);
        }
      });
    }
    return true;
  } catch (err) {
    console.error('Failed to play online audio:', err);
    return false;
  }
}

export const BANGLA_MALE_VOICE = 'bn-BD-PradeepNeural'; // ছেলেদের বাংলা কণ্ঠ (Pradeep - Natural Bangladeshi Male)

// High-fidelity Bengali Voice Player (ছেলেদের বাংলা কণ্ঠ)
export function playBengaliAudio(text, overrideVoice = null) {
  if (!text || isSoundMuted()) return false;
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const clean = text.trim().replace(/[()\[\]{}—–\-\/\\]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return false;

    const voice = overrideVoice || BANGLA_MALE_VOICE;
    const pitch = VOICE_PROFILES[getVoiceProfile()].bnPitch;
    const encoded = encodeURIComponent(clean);
    const url = `${getTtsEndpoint()}?text=${encoded}&voice=${encodeURIComponent(voice)}&lang=bn&rate=${encodeURIComponent('-2%')}&pitch=${encodeURIComponent(pitch)}&v=bn-${AUDIO_CACHE_VERSION}`;
    const cacheKey = `bn-${AUDIO_CACHE_VERSION}:${voice}:${pitch}:${clean}`;

    let audio = audioCache.get(cacheKey);
    if (!audio) {
      audio = new Audio(url);
      audio.playbackRate = 1.0;
      audioCache.set(cacheKey, audio);
    } else {
      audio.currentTime = 0;
      audio.playbackRate = 1.0;
    }

    currentAudio = audio;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Bengali audio playback issue:', err.message);
        }
      });
    }
    return true;
  } catch (err) {
    console.error('Failed to play Bengali audio:', err);
    return false;
  }
}

export function playArabicAudio(text, overrideVoice = null, playbackRate = 1.0) {
  if (!text) return false;
  // If the input is primarily Bengali text, seamlessly route to boys' Bengali voice
  if (/[\u0980-\u09FF]/.test(text) && !/[\u0600-\u06FF]/.test(text)) {
    return playBengaliAudio(text, overrideVoice);
  }
  const cleanText = getCleanArabicText(text);
  if (!cleanText) return false;

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('uls_audio_played', {
        detail: { text: cleanText, lang: 'ar', timestamp: Date.now() }
      }));
    }
  } catch (e) {}

  return playViaOnlineAudio(cleanText, overrideVoice, playbackRate);
}

