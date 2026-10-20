import { WebSocket } from 'ws';
import crypto from 'node:crypto';

// শুধু ছেলেদের কণ্ঠ। আগে Edge ব্যর্থ হলে Google Translate-এ ফেরত যেত, যার আরবি ও বাংলা কণ্ঠ মেয়েদের —
// এখন ব্যর্থ হলে অন্য পুরুষ কণ্ঠ চেষ্টা করা হয়, তাও না হলে শব্দ ছাড়াই ত্রুটি ফেরত যায়।
export const ARABIC_MALE_VOICES = ['ar-KW-FahedNeural', 'ar-QA-MoazNeural', 'ar-SA-HamedNeural', 'ar-AE-HamdanNeural'];
export const BANGLA_MALE_VOICES = ['bn-BD-PradeepNeural', 'bn-IN-BashkarNeural'];
const OPENAI_MALE_VOICES = ['onyx', 'echo', 'ash'];
const GEMINI_MALE_VOICES = ['Puck', 'Charon', 'Fenrir', 'Orus'];

// ওয়াকফ ছাড়া শেষ হরকত: শেষ শব্দের পরে একটি বাড়তি শব্দ জুড়ে দেওয়া হয়, ফলে শেষ শব্দটি বাক্যের
// শেষ হিসেবে পড়া হয় না (হরকতসহ উচ্চারিত হয়)। Microsoft যে সময়-তথ্য পাঠায়, তা দেখে বাড়তি শব্দ শুরুর
// সময়ে অডিও কেটে ফেলা হয়। বাড়তি শব্দ 'قَطْ': ق উচ্চারণের আগে মুখ বন্ধ থাকে, তাই শব্দ শুরুর ~৮০-১৪০ মি.সে.
// পর্যন্ত নিঃশব্দ ফাঁক থাকে (GitHub Actions-এ ছয়টি বাক্যাংশে মাপা)। সেই ফাঁকে কাটলে শেষ হরকত পুরো থাকে,
// স্বাভাবিকভাবে মিলিয়ে যায়, আর কোনো ক্লিক হয় না।
// (নতুন হোস্ট <prosody volume="silent"> সহ SSML-এ উত্তর দেয় না, তাই নিঃশব্দ শব্দ ব্যবহার করা যায়নি)
const HOLD_FILLER = 'قَطْ';
// বাড়তি শব্দ শুরুর এত মি.সে. পরে কাটা হয় (ফ্রেমের সীমানায় নিচের দিকে, অর্থাৎ ৭৬-১০০ মি.সে.)
const HOLD_CUT_AFTER_MS = 100;

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}

// ---------------------------------------------------------------
// Microsoft Edge "Read Aloud" সংযোগ — Python edge-tts 7.2.8-এর মতো করে
// (MUID কুকি, ConnectionId, X-Timestamp; 403 হলে সার্ভারের সময় দেখে ঘড়ির পার্থক্য ঠিক করে আবার চেষ্টা)
// ---------------------------------------------------------------
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_FULL_VERSION = '143.0.3650.75';
const CHROMIUM_MAJOR_VERSION = CHROMIUM_FULL_VERSION.split('.')[0];
// অক্টোবর ২০২৬ থেকে Microsoft পুরোনো হোস্টে ৪০৩ দিচ্ছে (edge-tts issue #490); নতুন হোস্ট আগে, পুরোনোটি বিকল্প
const WSS_ENDPOINTS = [
  `wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1?Ocp-Apim-Subscription-Key=${TRUSTED_CLIENT_TOKEN}`,
  `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}`
];
const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
const WIN_EPOCH_SECONDS = 11644473600;
let clockSkewSeconds = 0;

function generateSecMsGec() {
  let seconds = Date.now() / 1000 + clockSkewSeconds + WIN_EPOCH_SECONDS;
  seconds -= seconds % 300; // ৫ মিনিটে গোল করা
  const ticks = BigInt(Math.floor(seconds)) * 10000000n; // ১০০ ন্যানোসেকেন্ড একক
  return crypto.createHash('sha256').update(`${ticks}${TRUSTED_CLIENT_TOKEN}`, 'ascii').digest('hex').toUpperCase();
}

const hex = (bytes) => crypto.randomBytes(bytes).toString('hex');
const jsDateString = () => new Date().toUTCString().replace(/^(\w+), (\d+) (\w+) (\d+) /, '$1 $3 $2 $4 ').replace('GMT', 'GMT+0000 (Coordinated Universal Time)');

function openEdgeSocket(endpoint) {
  const url = `${endpoint}&ConnectionId=${hex(16)}` +
    `&Sec-MS-GEC=${generateSecMsGec()}&Sec-MS-GEC-Version=1-${CHROMIUM_FULL_VERSION}`;
  const ws = new WebSocket(url, {
    origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
    perMessageDeflate: true,
    handshakeTimeout: 8000,
    headers: {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': `muid=${hex(16).toUpperCase()};`
    }
  });
  return new Promise((resolve, reject) => {
    ws.once('open', () => resolve(ws));
    ws.once('unexpected-response', (req, res) => {
      const err = new Error(`Unexpected server response: ${res.statusCode}`);
      err.status = res.statusCode;
      err.serverDate = res.headers?.date;
      try { res.resume(); req.destroy(); } catch (e) {}
      reject(err);
    });
    ws.once('error', reject);
  });
}

// যে হোস্ট শেষবার কাজ করেছে সেটি আগে চেষ্টা করা হয়
let preferredEndpoint = 0;

async function connectEdge() {
  const order = [preferredEndpoint, ...WSS_ENDPOINTS.keys()].filter((v, i, a) => a.indexOf(v) === i);
  let lastErr = null;
  for (const idx of order) {
    try {
      const ws = await openEdgeSocket(WSS_ENDPOINTS[idx]);
      preferredEndpoint = idx;
      return ws;
    } catch (err) {
      lastErr = err;
      if (err.status !== 403) continue;
      // 403: সার্ভারের ঘড়ি অনুযায়ী Sec-MS-GEC ঠিক করে একই হোস্টে একবার আবার চেষ্টা
      const serverMs = err.serverDate ? Date.parse(err.serverDate) : NaN;
      if (Number.isNaN(serverMs) || Math.abs(serverMs - Date.now()) < 60000) continue;
      clockSkewSeconds += (serverMs - Date.now()) / 1000;
      try {
        const ws = await openEdgeSocket(WSS_ENDPOINTS[idx]);
        preferredEndpoint = idx;
        return ws;
      } catch (retryErr) {
        lastErr = retryErr;
      }
    }
  }
  throw lastErr || new Error('Edge TTS connection failed');
}

// Edge-এর আউটপুট audio-24khz-48kbitrate-mono-mp3: MPEG-2 Layer III, প্রতি ফ্রেম ৫৭৬ নমুনা = ২৪ মি.সে.
const FRAME_MS = (576 / 24000) * 1000;

// Parse MP3 buffer into frames to allow clean trimming at frame boundaries
export function parseMp3Frames(buffer) {
  const frames = [];
  let i = 0;
  while (i < buffer.length - 4) {
    if (buffer[i] === 0xFF && (buffer[i + 1] & 0xE0) === 0xE0) {
      const b2 = buffer[i + 2];
      const bitrateIndex = (b2 >> 4) & 0x0F;
      const padding = (b2 >> 1) & 1;
      const bitrates = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
      const bitrate = (bitrates[bitrateIndex] || 48) * 1000;
      const sampleRate = 24000;
      const frameSize = Math.floor((72 * bitrate) / sampleRate) + padding;
      if (frameSize <= 0) { i++; continue; }
      frames.push({ offset: i, size: frameSize });
      i += frameSize;
    } else {
      i++;
    }
  }
  return frames;
}

// cutMs পর্যন্ত অডিও রেখে বাকিটা বাদ (ফ্রেমের সীমানায়, cutMs-এর পরের কিছু থাকে না)
export function trimMp3(buffer, cutMs) {
  const frames = parseMp3Frames(buffer);
  const keep = Math.floor(cutMs / FRAME_MS);
  if (!frames.length || keep >= frames.length) return buffer;
  return buffer.subarray(0, frames[Math.max(1, keep)].offset);
}

export function prepareArabicWithoutWaqf(text) {
  if (!text) return '';
  let t = text.trim();

  // 1. Strip tatweel / kashida (ـ)
  t = t.replace(/ـ/g, '');

  // 2. Strip Bengali/English explanatory text mixed into Arabic strings (e.g. "(বহুবচন: ...)")
  t = t.replace(/[ঀ-৿]/g, ' ');

  // 3. Strip all invisible/bidi control characters (LRM, RLM, ALM, ZWNJ, ZWJ, ZWSP, BOM, etc.)
  t = t.replace(/[​-‏‪-‮⁠-⁩﻿؜ ]/g, '');

  // 4. Strip all Quranic stop signs, ornaments, ligatures, punctuation, quotes, brackets, dashes, Arabic/Urdu stops
  // Including Arabic full stop (۔ ۔), Arabic semicolon (؛), Arabic comma (،), Arabic question mark (؟)
  // Arabic percent (٪), Arabic decimal/thousands (٫ ٬), asterisk (٭), Quranic signs (ۖ-ۭ, ﷺ-﷽)
  t = t.replace(/[۔ۖ-ۭﷺ-﷽٪-٭]/g, ' ');
  t = t.replace(/[.,!?؟:;؛،—–―\-\/\\()[\]{}«»"“”'‘’‹›…~_#*+^=<>|]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();

  // 5. Canonical normalization: ensure Shaddah (ّ) always PRECEDES vowel diacritics
  // If Harakah precedes Shaddah (e.g. ٌّ, َّ), swap them so Shaddah is attached to consonant
  t = t.replace(/([ً-ِٰ])ّ/g, 'ّ$1');

  // 6. Prolong Madd for Demonstratives so Madd is drawn out/elongated
  t = t.replace(/هٰذَا|هَـٰذَا|هَٰذَا/g, 'هَاذَا');
  t = t.replace(/هٰذِهِ|هَـٰذِهِ|هَٰذِهِ|هَذِهِ/g, 'هَاذِهِي');
  t = t.replace(/ذٰلِكَ|ذَٰلِكَ|ذَـٰلِكَ/g, 'ذَالِكَ');
  t = t.replace(/أُولٰئِكَ|أُولَٰئِكَ/g, 'أُولَائِكَ');
  t = t.replace(/هٰؤُلَاءِ|هَٰؤُلَاءِ/g, 'هَاؤُلَاءِ');

  // 7. Phonetic Zero-Waqf Transformation for Tanween
  // Taa Marbutah + Tanween
  t = t.replace(/ةّ?ٌ/g, 'تُنْ'); // ةٌ -> تُنْ (-tun)
  t = t.replace(/ةّ?ٍ/g, 'تِنْ'); // ةٍ -> تِنْ (-tin)
  t = t.replace(/ةّ?ً/g, 'تَنْ'); // ةً -> تَنْ (-tan)

  // Fathatan on general letters (handles both Alif-after ًا and Alif-before اً, and Alif Maqsura ىً / ًى)
  t = t.replace(/([ء-ئب-وي-ۓ]ّ?)[اى]?ً[اى]?/g, '$1َنْ');
  t = t.replace(/ً[اى]?/g, 'َنْ');

  // Dammatan on general letters
  t = t.replace(/([ء-يٱ-ۓ]ّ?)ٌ/g, '$1ُنْ');
  t = t.replace(/ٌ/g, 'ُنْ');

  // Kasratan on general letters
  t = t.replace(/([ء-يٱ-ۓ]ّ?)ٍ/g, '$1ِنْ');
  t = t.replace(/ٍ/g, 'ِنْ');

  // 8. Phonetic Zero-Waqf for Taa Marbutah + Single Harakah (preserve pure short vowels without artificial Madd)
  t = t.replace(/ةّ?ُ/g, 'تُ'); // ةُ -> تُ (-tu)
  t = t.replace(/ةّ?ِ/g, 'تِ'); // ةِ -> تِ (-ti)
  t = t.replace(/ةّ?َ/g, 'تَ'); // ةَ -> تَ (-ta)
  t = t.replace(/ة(?=\s|$)/g, 'تْ');       // isolated bare ة without harakah

  // 9. Normalize Alif Maqsura (ىَ) with Fatha at word boundary to regular Alif (ـَا)
  t = t.replace(/ىَ(?=\s|$)/g, 'َا');

  // 10. Clean extra whitespace
  return t.replace(/\s+/g, ' ').trim();
}

const bareArabic = (t) => String(t || '').replace(/[ً-ْٰ]/g, '').trim();

// hold পদ্ধতি নিজে ব্যর্থ (সংযোগ ঠিক আছে) — তখনই একই কণ্ঠে সাধারণভাবে আবার চেষ্টা করা হয়
class HoldError extends Error {}

// সব কণ্ঠ মিলিয়ে সর্বোচ্চ সময় (সার্ভারলেস ফাংশনের সময়সীমার মধ্যে থাকতে)
const TOTAL_BUDGET_MS = 9000;

/**
 * Edge Neural TTS — একটি অনুরোধ।
 * hold = true হলে শেষে নিঃশব্দ HOLD_FILLER জুড়ে দেওয়া হয় ও তার শুরুতে অডিও কাটা হয় (ওয়াকফ ছাড়া শেষ হরকত)।
 * ফেরত: { buffer, boundaries, trimmedAtMs }
 */
export async function synthesizeEdge({ text, voice, lang, rate = 'default', pitch = 'default', hold = false, filler = HOLD_FILLER, cutAfterMs = HOLD_CUT_AFTER_MS }) {
  const body = escapeXml(text);
  if (!body) return { buffer: Buffer.alloc(0), boundaries: [], trimmedAtMs: null };

  const ws = await connectEdge();
  const { buffer, boundaries } = await new Promise((resolve, reject) => {
    const chunks = [];
    const boundaries = [];
    const timer = setTimeout(() => {
      try { ws.close(); } catch (e) {}
      reject(new Error('Edge TTS connection timed out'));
    }, 8000);

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        const sep = 'Path:audio\r\n';
        const idx = data.indexOf(sep);
        if (idx !== -1) {
          chunks.push(data.subarray(idx + sep.length));
        }
      } else {
        const msg = data.toString();
        if (msg.includes('Path:turn.end')) {
          clearTimeout(timer);
          try { ws.close(); } catch (e) {}
          resolve({ buffer: Buffer.concat(chunks), boundaries });
        } else if (msg.includes('Path:audio.metadata')) {
          // শব্দের সময়-তথ্য (WordBoundary): Offset ও Duration ১০০ ন্যানোসেকেন্ড এককে
          try {
            const json = JSON.parse(msg.slice(msg.indexOf('\r\n\r\n') + 4));
            (json.Metadata || []).forEach((m) => {
              if (m.Type === 'WordBoundary' && m.Data) {
                boundaries.push({
                  text: m.Data.text?.Text || '',
                  startMs: m.Data.Offset / 10000,
                  durationMs: (m.Data.Duration || 0) / 10000
                });
              }
            });
          } catch (e) {}
        }
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timer);
      try { ws.close(); } catch (e) {}
      reject(err);
    });

    ws.send(
      `X-Timestamp:${jsDateString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
      '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},' +
      `"outputFormat":"${OUTPUT_FORMAT}"}}}}\r\n`
    );

    const requestId = hex(16);
    const pitchAttr = (!pitch || pitch === 'default' || pitch === '+0Hz') ? '' : ` pitch="${pitch}"`;
    const rateAttr = (!rate || rate === 'default') ? '' : ` rate="${rate}"`;
    const fillerText = hold ? ` ${filler}` : '';
    const ssml = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${jsDateString()}Z\r\nPath:ssml\r\n\r\n` +
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">` +
      `<voice name="${voice}">` +
      `<prosody${rateAttr}${pitchAttr} volume="default">` +
      `${body}${fillerText}` +
      `</prosody>` +
      `</voice>` +
      `</speak>`;
    ws.send(ssml);
  });

  if (!buffer.length) throw new Error('Edge TTS returned no audio');
  if (!hold) return { buffer, full: buffer, boundaries, trimmedAtMs: null };

  // বাড়তি শব্দটির শুরু খুঁজে তার পরের নিঃশব্দ ফাঁকে কাটা; না পেলে ব্যর্থ ধরা হয় (ডাকা ফাংশন তখন সাধারণভাবে বানায়)
  const fillerBare = bareArabic(filler);
  const fillerBoundary = [...boundaries].reverse().find((b) => bareArabic(b.text) === fillerBare);
  if (!fillerBoundary || fillerBoundary.startMs <= 0) throw new HoldError('Hold filler boundary not found');
  const cutMs = fillerBoundary.startMs + cutAfterMs;
  return { buffer: trimMp3(buffer, cutMs), full: buffer, boundaries, trimmedAtMs: cutMs };
}

// Persona: Pure Classical Fusha Qari (ফাহেদ - কুয়েতি বিশুদ্ধ জ্বীম, Zero Waqf, -22% deliberate rate)
// পুরুষ কণ্ঠগুলো ক্রমানুসারে চেষ্টা করা হয়; hold ব্যর্থ হলে একই কণ্ঠে সাধারণভাবে
export async function synthesizeArabicMale(text, { voice, rate = '-22%', pitch = 'default', hold = true } = {}) {
  const preparedText = prepareArabicWithoutWaqf(text);
  if (!preparedText) return { buffer: Buffer.alloc(0), voice: null };
  const order = [voice, ...ARABIC_MALE_VOICES].filter((v, i, a) => v && ARABIC_MALE_VOICES.includes(v) && a.indexOf(v) === i);
  const started = Date.now();
  let lastErr = null;
  for (const v of order) {
    if (Date.now() - started > TOTAL_BUDGET_MS) break;
    if (hold) {
      try {
        const res = await synthesizeEdge({ text: preparedText, voice: v, lang: 'ar-SA', rate, pitch, hold: true });
        return { buffer: res.buffer, voice: v, mode: 'hold' };
      } catch (err) {
        lastErr = err;
        // সংযোগ/কণ্ঠের সমস্যা হলে সরাসরি পরের কণ্ঠে
        if (!(err instanceof HoldError)) {
          console.warn(`Arabic TTS [${v}] failed:`, err.message);
          continue;
        }
      }
    }
    try {
      const res = await synthesizeEdge({ text: preparedText, voice: v, lang: 'ar-SA', rate, pitch, hold: false });
      return { buffer: res.buffer, voice: v, mode: 'plain' };
    } catch (err) {
      lastErr = err;
      console.warn(`Arabic TTS [${v}] failed:`, err.message);
    }
  }
  throw lastErr || new Error('All Arabic male voices failed');
}

// Persona: Natural Bangladeshi Male/Boy (প্রদীপ - ছেলেদের স্পষ্ট ও মার্জিত বাংলা কণ্ঠ)
export async function synthesizeBanglaMale(text, { voice, rate = '-4%', pitch = 'default' } = {}) {
  const clean = text.trim().replace(/[()\[\]{}—–\-\/\\]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return { buffer: Buffer.alloc(0), voice: null };
  const order = [voice, ...BANGLA_MALE_VOICES].filter((v, i, a) => v && BANGLA_MALE_VOICES.includes(v) && a.indexOf(v) === i);
  const started = Date.now();
  let lastErr = null;
  for (const v of order) {
    if (Date.now() - started > TOTAL_BUDGET_MS) break;
    try {
      const res = await synthesizeEdge({ text: clean, voice: v, lang: 'bn-BD', rate, pitch, hold: false });
      return { buffer: res.buffer, voice: v, mode: 'plain' };
    } catch (err) {
      lastErr = err;
      console.warn(`Bangla TTS [${v}] failed:`, err.message);
    }
  }
  throw lastErr || new Error('All Bangla male voices failed');
}

// OpenAI HD Studio Engine (tts-1-hd) — শুধু পুরুষ কণ্ঠ
async function synthesizeOpenAiHd(text, voice = 'onyx', speed = 0.92) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server');
  }

  const preparedText = prepareArabicWithoutWaqf(text);
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      input: preparedText,
      voice: OPENAI_MALE_VOICES.includes(voice) ? voice : 'onyx',
      speed: speed
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Google Gemini 2.0 Flash Audio Engine (Strict Male Reciter, Zero Extra Words)
async function synthesizeGeminiAudio(text, voice = 'Puck') {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const preparedText = prepareArabicWithoutWaqf(text);
  const prompt = `Strict instruction: You are a young male Arabic reader. Read ONLY the following Arabic text aloud with exact Tashkeel and every final Harakah pronounced (no waqf, no pausal forms). Do NOT utter any English words, do NOT add introductory greetings or conversational commentary. Read ONLY this Arabic text:\n\n${preparedText}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.0,
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: GEMINI_MALE_VOICES.includes(voice) ? voice : 'Puck'
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!part || !part.inlineData?.data) {
    throw new Error('No audio returned from Gemini');
  }

  return {
    buffer: Buffer.from(part.inlineData.data, 'base64'),
    mimeType: part.inlineData.mimeType || 'audio/wav'
  };
}

// প্রশ্নের মান যাচাই (SSML-এ সরাসরি বসে, তাই নির্দিষ্ট রূপ ছাড়া কিছু নেওয়া হয় না)
const safePitch = (p) => (typeof p === 'string' && /^[+-]\d{1,3}Hz$/.test(p) ? p : 'default');
const safeRate = (r, fallback) => (typeof r === 'string' && /^[+-]\d{1,2}%$/.test(r) ? r : fallback);

function sendAudio(res, buffer, contentType, engine, cacheable) {
  res.setHeader('Content-Type', contentType || 'audio/mpeg');
  // শুধু সফল পুরুষ-কণ্ঠের অডিও দীর্ঘ সময় ক্যাশ হয়
  res.setHeader('Cache-Control', cacheable ? 'public, max-age=31536000, immutable' : 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-TTS-Engine', engine);
  return res.status(200).send(buffer);
}

function sendFailure(res, message) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(503).json({ error: message });
}

export default async function handler(req, res) {
  try {
    const text = req.query.text;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    const cleanText = text.trim();
    const isBengali = req.query.lang === 'bn' || (/[ঀ-৿]/.test(cleanText) && !/[؀-ۿ]/.test(cleanText)) || (req.query.voice && req.query.voice.startsWith('bn-'));
    const cacheable = !!req.query.v;
    const pitch = safePitch(req.query.pitch);

    // 0. Dedicated Bengali TTS Engine (ছেলেদের বাংলা কণ্ঠ - Pradeep)
    if (isBengali) {
      try {
        const out = await synthesizeBanglaMale(cleanText, { voice: req.query.voice, rate: safeRate(req.query.rate, '-4%'), pitch });
        if (!out.buffer.length) return sendFailure(res, 'Empty Bengali text');
        return sendAudio(res, out.buffer, 'audio/mpeg', `${out.voice}:${pitch}`, cacheable);
      } catch (bnErr) {
        console.warn('Bengali male TTS failed:', bnErr.message);
        return sendFailure(res, 'Failed to synthesize Bengali audio');
      }
    }

    const requestedEngine = req.query.engine || 'edge';
    const rate = safeRate(req.query.rate, '-22%');
    // hold=0 দিলে পুরোনো আচরণ (শেষ শব্দে ওয়াকফ হতে পারে); নইলে শেষ হরকতসহ
    const hold = req.query.hold !== '0';

    // 1. Check Google Gemini Audio (if explicitly requested)
    if (requestedEngine === 'gemini' && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
      try {
        const geminiRes = await synthesizeGeminiAudio(cleanText, req.query.geminiVoice);
        return sendAudio(res, geminiRes.buffer, geminiRes.mimeType, 'gemini:2.0-flash', cacheable);
      } catch (geminiErr) {
        console.warn('Gemini Audio synthesis failed or key missing, falling back:', geminiErr.message);
      }
    }

    // 2. Check OpenAI HD Studio Engine (if explicitly requested)
    if (requestedEngine === 'openai-hd' && process.env.OPENAI_API_KEY) {
      try {
        const buffer = await synthesizeOpenAiHd(cleanText, req.query.openaiVoice, 0.92);
        return sendAudio(res, buffer, 'audio/mpeg', 'openai:tts-1-hd', cacheable);
      } catch (openAiErr) {
        console.warn('OpenAI HD synthesis failed or key missing, falling back to Edge Neural:', openAiErr.message);
      }
    }

    // 3. High-Fidelity Edge Neural (Pure Jeem - Fahed / Moaz / Hamed / Hamdan, Zero Waqf)
    try {
      const out = await synthesizeArabicMale(cleanText, { voice: req.query.voice, rate, pitch, hold });
      if (!out.buffer.length) return sendFailure(res, 'Empty Arabic text');
      return sendAudio(res, out.buffer, 'audio/mpeg', `${out.voice}:${pitch}:${out.mode}`, cacheable);
    } catch (edgeErr) {
      console.warn('All Arabic male voices failed:', edgeErr.message);
      return sendFailure(res, 'Failed to synthesize audio');
    }
  } catch (err) {
    console.error('TTS handler fatal error:', err);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(500).json({ error: 'Internal server error' });
  }
}
