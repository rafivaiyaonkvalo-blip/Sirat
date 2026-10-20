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
  const bWithPeriod = await synthesize('كِتَابٌ.');
  const bNoPeriod = await synthesize('كِتَابٌ');
  const bSukoonPeriod = await synthesize('كِتَابْ.');
  const bNunated = await synthesize('كِتَابُنْ');
  const bNunatedPeriod = await synthesize('كِتَابُنْ.');

  console.log('كِتَابٌ. (tanween + period):', bWithPeriod.length);
  console.log('كِتَابٌ  (tanween no period):', bNoPeriod.length);
  console.log('كِتَابْ. (sukoon + period):  ', bSukoonPeriod.length);
  console.log('كِتَابُنْ (noon no period):   ', bNunated.length);
  console.log('كِتَابُنْ. (noon + period):    ', bNunatedPeriod.length);

  console.log('Does كِتَابٌ. == كِتَابْ. (did period cause waqf)?', bWithPeriod.equals(bSukoonPeriod));
}

run().catch(console.error);
