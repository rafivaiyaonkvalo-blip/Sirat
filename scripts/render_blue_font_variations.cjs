const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const ARTIFACT_DIR = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';

const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const fontVariations = [
  {
    id: 'blue_font_1_jakarta',
    name: 'ফন্ট ১: প্লাস জাকার্তা সান্স (Plus Jakarta Sans - মডার্ন টেক বোল্ড)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    fontSize: 88,
    letterSpacing: '-1px',
    casing: 'normal', // ArbiGo
    googleFont: 'Plus+Jakarta+Sans:wght@800;900',
    desc: 'আধুনিক, পরিচ্ছন্ন ও আন্তর্জাতিক টেক ব্র্যান্ড লুক (Spotify / Stripe স্টাইল)'
  },
  {
    id: 'blue_font_2_outfit',
    name: 'ফন্ট ২: আউটফিট জিওমেট্রিক (Outfit - সুপার শার্প ও স্লীক)',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 86,
    letterSpacing: '0px',
    casing: 'normal',
    googleFont: 'Outfit:wght@800;900',
    desc: 'নিখুঁত জ্যামিতিক কার্ভ, অত্যন্ত আকর্ষণীয় ও স্মার্ট'
  },
  {
    id: 'blue_font_3_fredoka',
    name: 'ফন্ট ৩: ফ্রেডোকা রাউন্ডেড (Fredoka - ডুওলিঙ্গো ও এডুকেশন স্টাইল)',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 90,
    letterSpacing: '0.5px',
    casing: 'normal',
    googleFont: 'Fredoka:wght@600;700',
    desc: 'সফট রাউন্ডেড এজ, ফ্রেন্ডলি ও আধুনিক ভাষা শিক্ষা প্ল্যাটফর্মের উপযোগী'
  },
  {
    id: 'blue_font_4_cinzel',
    name: 'ফন্ট ৪: সিনজেল রয়্যাল সেরিফ (Cinzel - অভিজাত রাজকীয় সংস্করণ)',
    fontFamily: "'Cinzel', serif",
    fontWeight: 900,
    fontSize: 78,
    letterSpacing: '3px',
    casing: 'uppercase', // ARBIGO
    googleFont: 'Cinzel:wght@800;900',
    desc: 'ঐতিহ্যবাহী, অভিজাত ও রাজকীয় সেরিফ লেটারিং'
  },
  {
    id: 'blue_font_5_tajawal',
    name: 'ফন্ট ৫: তাজাউয়াল অ্যারাবিক ল্যাটিন (Tajawal - আধুনিক আরবি কাট)',
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 900,
    fontSize: 86,
    letterSpacing: '1px',
    casing: 'normal',
    googleFont: 'Tajawal:wght@800;900',
    desc: 'আরবি ক্যালিগ্রাফিক ব্যালান্স সহ আধুনিক ডিজিটাল কাট'
  }
];

function generateHtml(v) {
  const titleText = v.casing === 'uppercase' ? 'ARBIGO' : 'ArbiGo';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${v.googleFont}&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
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

      // Seamless radial gradient patch matching deep ocean blue card
      ctx.save();
      const grad = ctx.createRadialGradient(512, 735, 10, 512, 735, 340);
      grad.addColorStop(0, 'rgba(8, 48, 140, 0.98)');
      grad.addColorStop(0.55, 'rgba(7, 42, 125, 0.96)');
      grad.addColorStop(0.82, 'rgba(6, 38, 115, 0.85)');
      grad.addColorStop(1, 'rgba(5, 32, 100, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(512, 735, 360, 105, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render new font
      ctx.save();
      ctx.font = '${v.fontWeight} ${v.fontSize}px ${v.fontFamily}';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '${v.letterSpacing}';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('${titleText}', 512, 725);
      ctx.restore();

      // Render Bengali Subtitle: • এসো আরবী শিখি •
      ctx.save();
      ctx.font = 'bold 23px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '3px';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#BAE6FD'; // soft cyan-blue
      ctx.fillText('•  এসো আরবী শিখি  •', 512, 808);
      ctx.restore();
    };
  </script>
</body>
</html>
  `;
}

async function run() {
  for (const v of fontVariations) {
    const htmlFile = path.resolve(__dirname, `temp_font_${v.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${v.id}.jpg`);
    const outFileArtifact = path.resolve(ARTIFACT_DIR, `${v.id}.jpg`);

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
  console.log('All 5 font variations rendered successfully!');
}

run().catch(console.error);
