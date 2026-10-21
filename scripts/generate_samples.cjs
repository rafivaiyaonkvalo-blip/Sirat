const { EdgeTTS } = require('node-edge-tts');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function synthesize(text, voice = 'ar-KW-FahedNeural') {
  const tts = new EdgeTTS({ voice, lang: 'ar-SA', outputFormat: 'audio-24khz-96kbitrate-mono-mp3' });
  const ws = await tts._connectWebSocket();
  return new Promise((resolve, reject) => {
    const chunks = [];
    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        const sep = 'Path:audio\r\n';
        const idx = data.indexOf(sep);
        if (idx !== -1) chunks.push(data.subarray(idx + sep.length));
      } else if (data.toString().includes('Path:turn.end')) {
        ws.close();
        resolve(Buffer.concat(chunks));
      }
    });
    ws.on('error', reject);
    const requestId = crypto.randomBytes(16).toString('hex');
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-SA">` +
      `<voice name="${voice}"><prosody rate="-22%">${text}</prosody></voice></speak>`;
    ws.send(`X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n` + ssml);
  });
}

function prepareArabicWithoutWaqf(text) {
  if (!text) return '';
  let t = text.trim();
  t = t.replace(/هٰذَا|هَـٰذَا|هَٰذَا/g, 'هَاذَا');
  t = t.replace(/هٰذِهِ|هَـٰذِهِ|هَٰذِهِ|هَذِهِ/g, 'هَاذِهِي');
  t = t.replace(/ذٰلِكَ|ذَٰلِكَ|ذَـٰلِكَ/g, 'ذَالِكَ');
  t = t.replace(/[.,!?؟:;،—–\-\/\\]/g, ' ');
  t = t.replace(/ة\u064C/g, 'تُنْ');
  t = t.replace(/ة\u064D/g, 'تِنْ');
  t = t.replace(/ة\u064B/g, 'تَنْ');
  t = t.replace(/[اَ]\u064B/g, 'َنْ');
  t = t.replace(/\u064Bا/g, 'َنْ');
  t = t.replace(/\u064B/g, 'َنْ');
  t = t.replace(/\u064C/g, 'ُنْ');
  t = t.replace(/\u064D/g, 'ِنْ');
  t = t.replace(/ة\u064F/g, 'تُو');
  t = t.replace(/ة\u0650/g, 'تِي');
  t = t.replace(/ة\u064E/g, 'تَا');
  t = t.replace(/ة(?=[\s]|$)/g, 'تْ');
  t = t.replace(/([\u0600-\u06FF]\u0651?)\u064F(?=\s|$)/g, '$1ُو');
  t = t.replace(/([\u0600-\u06FF]\u0651?)\u0650(?=\s|$)/g, '$1ِي');
  t = t.replace(/([\u0600-\u06FF]\u0651?)\u064E(?=\s|$)/g, '$1َا');
  return t.replace(/\s+/g, ' ').trim();
}

async function run() {
  const outDir = path.join(__dirname, 'audio_samples');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const samples = [
    { name: 'kitabun_raw', text: 'كِتَابٌ' },
    { name: 'kitabun_prep', text: prepareArabicWithoutWaqf('كِتَابٌ') },
    { name: 'saatun_raw', text: 'سَاعَةٌ' },
    { name: 'saatun_prep', text: prepareArabicWithoutWaqf('سَاعَةٌ') },
    { name: 'bab_awwal_raw', text: 'البَابُ الأَوَّلُ' },
    { name: 'bab_awwal_prep', text: prepareArabicWithoutWaqf('البَابُ الأَوَّلُ') },
    { name: 'yadiki_raw', text: 'فِي يَدِكِ' },
    { name: 'yadiki_prep', text: prepareArabicWithoutWaqf('فِي يَدِكِ') },
    { name: 'tilka_raw', text: 'تِلْكَ' },
    { name: 'tilka_prep', text: prepareArabicWithoutWaqf('تِلْكَ') },
  ];

  for (const s of samples) {
    const buf = await synthesize(s.text);
    fs.writeFileSync(path.join(outDir, `${s.name}.mp3`), buf);
    console.log(`Saved ${s.name}.mp3 (text: ${s.text}, size: ${buf.length})`);
  }
}

run().catch(console.error);
