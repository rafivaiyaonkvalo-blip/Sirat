const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_design2_master.jpg');
const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const variations = [
  {
    id: 'arbigo_recolor_white_bangla',
    name: 'ডেমো ২-১: অরিজিনাল হোয়াইট ফন্ট + "• এসো আরবী শিখি •"',
    target: 'none',
    addBangla: true
  },
  {
    id: 'arbigo_recolor_gold_full',
    name: 'ডেমো ২-২: সম্পূর্ণ গোল্ডেন ফন্ট + "• এসো আরবী শিখি •"',
    target: 'all',
    addBangla: true
  },
  {
    id: 'arbigo_recolor_dualtone_bangla',
    name: 'ডেমো ২-৩: ডুয়াল-টোন (Arbi সাদা + Go সোনালী) + "• এসো আরবী শিখি •"',
    target: 'go_only',
    addBangla: true
  },
  {
    id: 'arbigo_recolor_gold_frame',
    name: 'ডেমো ২-৪: লাক্সারি গোল্ডেন বর্ডার ফ্রেম + গোল্ডেন ফন্ট + "• এসো আরবী শিখি •"',
    target: 'all',
    addBorder: true,
    addBangla: true
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
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1024px; height: 1024px; background: #064e3b; overflow: hidden; }
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

      const target = '${v.target}';
      if (target !== 'none') {
        const imgData = ctx.getImageData(0, 0, 1024, 1024);
        const data = imgData.data;

        // Expanded y-range from 655 to 805 to cover full letter height
        for (let y = 655; y <= 805; y++) {
          const t = Math.min(1, Math.max(0, (y - 660) / (795 - 660)));
          // Rich metallic gold gradient
          let goldR = Math.round(255 * (1 - t * 0.18));
          let goldG = Math.round(248 - t * 90);
          let goldB = Math.round(180 - t * 165);

          for (let x = 200; x <= 800; x++) {
            // Precise split between Arbi and Go (Go starts at x >= 548)
            if (target === 'go_only' && x < 548) continue;

            const idx = (y * 1024 + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Detect white text pixels
            const brightness = (r + g + b) / 3;
            if (brightness > 120 && r > 90) {
              const factor = Math.min(1, Math.max(0, (brightness - 110) / 100));
              data[idx] = Math.round(r * (1 - factor) + goldR * factor);
              data[idx + 1] = Math.round(g * (1 - factor) + goldG * factor);
              data[idx + 2] = Math.round(b * (1 - factor) + goldB * factor);
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Add Bengali subtitle
      if (${Boolean(v.addBangla)}) {
        ctx.save();
        ctx.font = 'bold 23px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#D1FAE5';
        ctx.letterSpacing = '3px';
        ctx.fillText('•  এসো আরবী শিখি  •', 512, 818);
        ctx.restore();
      }

      // Add golden squircle frame
      if (${Boolean(v.addBorder)}) {
        ctx.save();
        ctx.beginPath();
        const x = 104, y = 104, w = 816, h = 816, r = 180;
        ctx.roundRect(x, y, w, h, r);
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, 'rgba(255, 235, 150, 0.9)');
        grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.4)');
        grad.addColorStop(1, 'rgba(255, 215, 0, 0.9)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.35)';
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
    const htmlFile = path.resolve(__dirname, `temp_recolor_${v.id}.html`);
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
  console.log('All refined variations rendered successfully!');
}

run().catch(console.error);
