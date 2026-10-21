const { EdgeTTS } = require('node-edge-tts');
const crypto = require('crypto');

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

async function run() {
  const r1 = await synthesize('سَاعَةُ');
  const r2 = await synthesize('سَاعَهْ');
  const r3 = await synthesize('سَاعَتْ');
  const r4 = await synthesize('سَاعَتُ');
  const r5 = await synthesize('سَاعَتُو');

  console.log('سَاعَةُ (taa marbutah + damma):', r1.length);
  console.log('سَاعَهْ (haa sukoon):           ', r2.length);
  console.log('سَاعَتْ (open taa sukoon):      ', r3.length);
  console.log('سَاعَتُ (open taa + damma):     ', r4.length);
  console.log('سَاعَتُو (open taa + waw):       ', r5.length);

  console.log('Does سَاعَةُ == سَاعَهْ (waqf to haa)?', r1.equals(r2));
  console.log('Does سَاعَتُ == سَاعَتْ (waqf to taa sukoon)?', r4.equals(r3));
}

run().catch(console.error);
