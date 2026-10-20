const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_design2_master.jpg');
const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const variations = [
  {
    id: 'arbigo_blue_v1_sapphire',
    name: 'নীল অপশন ১: রয়্যাল স্যাফায়ার ব্লু অ্যারো ও ক্রিস্প হোয়াইট টেক্সট (কোনো গোল্ড নেই)',
    blueShade: 'sapphire', // 0x2563eb / 0x3b82f6
    textStyle: 'white_only',
    bgBlue: false
  },
  {
    id: 'arbigo_blue_v2_dualtone',
    name: 'নীল অপশন ২: ডুয়াল-টোন (Arbi সাদা + Go ইলেকট্রিক ব্লু) + ব্লু অ্যারো',
    blueShade: 'electric', // 0x0284c7 / 0x38bdf8
    textStyle: 'dualtone_blue',
    bgBlue: false
  },
  {
    id: 'arbigo_blue_v3_deep_ocean',
    name: 'নীল অপশন ৩: ডিপ ওশান ব্লু থিম (সম্পূর্ণ ব্যাকগ্রাউন্ড ও উপাদান ব্লু)',
    blueShade: 'cyan_glow',
    textStyle: 'white_cyan',
    bgBlue: true
  },
  {
    id: 'arbigo_blue_v4_sky_frame',
    name: 'নীল অপশন ৪: রয়্যাল ব্লু অ্যারো + আইকনে স্কাই ব্লু নিয়ান বর্ডার ফ্রেম',
    blueShade: 'sapphire',
    textStyle: 'white_only',
    bgBlue: false,
    addFrame: true
  }
];

function generateHtml(v) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1024px; height: 1024px; background: #031e28; overflow: hidden; }
    canvas { display: block; width: 1024px; height: 1024px; }
  </style>
</head>
<body>
  <canvas id="c" width="1024" height="1024"></canvas>
  <script>
    const img = new Image();
    img.src = '${imgDataUrl}';
    img.onload = () => {
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, 1024, 1024);
      const data = imgData.data;

      // 1. Convert all Gold/Yellow pixels into Vibrant Blue
      // 2. Optionally shift Green background to Deep Ocean Blue
      const isBgBlue = ${Boolean(v.bgBlue)};
      const shade = '${v.blueShade}';

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Detect gold/amber pixels: High Red, Medium-High Green, Lower Blue, (r - b) > 35
        const isGold = (r > 120 && g > 80 && (r - b) > 35 && (r + g) > 230 && b < 160);

        if (isGold) {
          // Replace Gold with Blue
          const brightness = (r * 0.4 + g * 0.4 + b * 0.2) / 255; // 0 to 1

          if (shade === 'sapphire') {
            // Royal Sapphire Blue: Deep navy to bright royal blue
            data[i] = Math.round(15 + brightness * 35);       // Low red (15 - 50)
            data[i + 1] = Math.round(60 + brightness * 120);   // Medium green/cyan (60 - 180)
            data[i + 2] = Math.round(140 + brightness * 115);  // High blue (140 - 255)
          } else if (shade === 'electric') {
            // Electric Blue / Sky Blue
            data[i] = Math.round(10 + brightness * 40);
            data[i + 1] = Math.round(90 + brightness * 140);
            data[i + 2] = Math.round(180 + brightness * 75);
          } else {
            // Cyan Glow / Ice Blue
            data[i] = Math.round(20 + brightness * 60);
            data[i + 1] = Math.round(120 + brightness * 125);
            data[i + 2] = Math.round(200 + brightness * 55);
          }
        } else if (isBgBlue) {
          // Shift emerald green background to deep ocean blue
          const isGreenBg = (g > r && g > b && (r + g + b) < 450);
          if (isGreenBg) {
            data[i] = Math.round(r * 0.6);
            data[i + 1] = Math.round(g * 0.7);
            data[i + 2] = Math.round(Math.min(255, b * 1.8 + g * 0.4));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Recolor 'Go' in ArbiGo to Blue if dualtone
      const textStyle = '${v.textStyle}';
      if (textStyle === 'dualtone_blue') {
        const textImgData = ctx.getImageData(0, 0, 1024, 1024);
        const tdata = textImgData.data;

        for (let y = 655; y <= 805; y++) {
          const t = Math.min(1, Math.max(0, (y - 660) / (795 - 660)));
          // Blue gradient for 'Go'
          let blueR = Math.round(30 + t * 10);
          let blueG = Math.round(180 - t * 70);
          let blueB = Math.round(255 - t * 40);

          for (let x = 548; x <= 800; x++) {
            const idx = (y * 1024 + x) * 4;
            const r = tdata[idx];
            const g = tdata[idx + 1];
            const b = tdata[idx + 2];
            const brightness = (r + g + b) / 3;

            if (brightness > 120 && r > 90) {
              const factor = Math.min(1, Math.max(0, (brightness - 110) / 100));
              tdata[idx] = Math.round(r * (1 - factor) + blueR * factor);
              tdata[idx + 1] = Math.round(g * (1 - factor) + blueG * factor);
              tdata[idx + 2] = Math.round(b * (1 - factor) + blueB * factor);
            }
          }
        }
        ctx.putImageData(textImgData, 0, 0);
      }

      // Add Bengali subtitle in soft Sky Blue / Mint
      ctx.save();
      ctx.font = 'bold 23px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = isBgBlue ? '#BAE6FD' : '#E0F2FE';
      ctx.letterSpacing = '3px';
      ctx.fillText('•  এসো আরবী শিখি  •', 512, 818);
      ctx.restore();

      // Add Blue/Cyan border frame if requested
      if (${Boolean(v.addFrame)}) {
        ctx.save();
        ctx.beginPath();
        const x = 104, y = 104, w = 816, h = 816, r = 180;
        ctx.roundRect(x, y, w, h, r);
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
        grad.addColorStop(0.5, 'rgba(37, 99, 235, 0.4)');
        grad.addColorStop(1, 'rgba(14, 165, 233, 0.9)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();
      }
    };
  </script>
</body>
</html>
  `;
}

async function run() {
  const artifactDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';

  for (const v of variations) {
    const htmlFile = path.resolve(__dirname, `temp_blue_${v.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${v.id}.jpg`);
    const outFileArtifact = path.resolve(artifactDir, `${v.id}.jpg`);

    fs.writeFileSync(htmlFile, generateHtml(v), 'utf-8');
    const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

    console.log(`Rendering ${v.name}...`);
    await new Promise((resolve, reject) => {
      execFile(
        CHROME_PATH,
        [
          '--headless',
          '--disable-gpu',
          `--screenshot=${outFileProject}`,
          '--window-size=1024,1024',
          fileUrl
        ],
        (err) => {
          if (err) return reject(err);
          try { fs.copyFileSync(outFileProject, outFileArtifact); } catch(e) {}
          resolve();
        }
      );
    });

    try { fs.unlinkSync(htmlFile); } catch(e) {}
    console.log(`✓ Finished ${v.id}`);
  }
  console.log('All Blue variations rendered successfully!');
}

run().catch(console.error);
