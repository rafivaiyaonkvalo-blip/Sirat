const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const CAL_IMG = path.resolve(__dirname, '../public/extracted_calligraphy.png');

const masterB64 = fs.readFileSync(MASTER_IMG).toString('base64');
const calB64 = fs.readFileSync(CAL_IMG).toString('base64');

const masterUrl = `data:image/jpeg;base64,${masterB64}`;
const calUrl = `data:image/png;base64,${calB64}`;

const fontVariations = [
  {
    id: 'centered_blue_f1_jakarta',
    name: 'ডিজাইন ১: প্লাস জাকার্তা সান্স (Plus Jakarta Sans - মডার্ন বোল্ড)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    fontSize: 92,
    googleFont: 'Plus+Jakarta+Sans:wght@800;900',
    title: 'ArbiGo'
  },
  {
    id: 'centered_blue_f2_outfit',
    name: 'ডিজাইন ২: আউটফিট জিওমেট্রিক (Outfit - সুপার শার্প)',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 90,
    googleFont: 'Outfit:wght@800;900',
    title: 'ArbiGo'
  },
  {
    id: 'centered_blue_f3_fredoka',
    name: 'ডিজাইন ৩: ফ্রেডোকা রাউন্ডেড (Fredoka - ডুওলিঙ্গো এডুকেশন)',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 94,
    googleFont: 'Fredoka:wght@600;700',
    title: 'ArbiGo'
  },
  {
    id: 'centered_blue_f4_cinzel',
    name: 'ডিজাইন ৪: সিনজেল রয়্যাল সেরিফ (Cinzel - ক্লাসিক লাক্সারি)',
    fontFamily: "'Cinzel', serif",
    fontWeight: 900,
    fontSize: 82,
    googleFont: 'Cinzel:wght@800;900',
    title: 'ARBIGO'
  }
];

function buildHtml(f) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${f.googleFont}&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1024px;
      height: 1024px;
      position: relative;
      overflow: hidden;
      background: #031e28;
    }
    .bg-master {
      position: absolute;
      top: 0;
      left: 0;
      width: 1024px;
      height: 1024px;
      z-index: 1;
    }
    /* 1. Cover original top-left calligraphy with deep blue glass patch */
    .patch-top-left {
      position: absolute;
      top: 190px;
      left: 170px;
      width: 280px;
      height: 310px;
      background: radial-gradient(ellipse at center, rgba(12, 60, 165, 0.98) 0%, rgba(9, 45, 135, 0.95) 60%, rgba(8, 40, 120, 0) 100%);
      z-index: 2;
    }
    /* 2. Cover arrow head on top-right with deep blue glass patch */
    .patch-arrow-head {
      position: absolute;
      top: 240px;
      left: 620px;
      width: 220px;
      height: 240px;
      background: radial-gradient(ellipse at center, rgba(12, 60, 165, 0.98) 0%, rgba(9, 45, 135, 0.95) 60%, rgba(8, 40, 120, 0) 100%);
      z-index: 2;
    }
    /* 3. Clean Right Book Page overlay to cover the arrow body on the right page */
    .book-right-overlay {
      position: absolute;
      top: 320px;
      left: 506px;
      width: 270px;
      height: 320px;
      z-index: 3;
    }
    /* 4. Symmetrical Center Silk Bookmark Ribbon */
    .center-ribbon {
      position: absolute;
      top: 450px;
      left: 494px;
      width: 26px;
      height: 190px;
      background: linear-gradient(180deg, #38BDF8 0%, #0284C7 60%, #0369A1 100%);
      clip-path: polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      z-index: 4;
    }
    /* 5. Centered Arabic Calligraphy */
    .centered-calligraphy {
      position: absolute;
      top: 175px;
      left: 50%;
      transform: translateX(-50%);
      width: 240px;
      height: 290px;
      z-index: 5;
      filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 20px rgba(186, 230, 253, 0.45));
    }
    /* 6. Bottom text area patch */
    .patch-bottom {
      position: absolute;
      top: 640px;
      left: 104px;
      width: 816px;
      height: 220px;
      background: radial-gradient(ellipse at center, rgba(14, 75, 185, 1) 0%, rgba(10, 58, 155, 1) 75%, rgba(8, 48, 135, 0.95) 90%, rgba(8, 48, 135, 0) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      z-index: 6;
    }
    .title {
      font-family: ${f.fontFamily};
      font-size: ${f.fontSize}px;
      font-weight: ${f.fontWeight};
      color: #FFFFFF;
      filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 16px rgba(186, 230, 253, 0.4));
    }
    .subtitle {
      font-family: 'Hind Siliguri', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #BAE6FD;
      letter-spacing: 2.5px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
    }
  </style>
</head>
<body>
  <!-- Master Image -->
  <img class="bg-master" src="${masterUrl}" />

  <!-- Patches removing old off-center calligraphy and arrow head -->
  <div class="patch-top-left"></div>
  <div class="patch-arrow-head"></div>

  <!-- Pristine Right Page covering arrow body -->
  <svg class="book-right-overlay" viewBox="0 0 270 320">
    <!-- Blue hardcover base -->
    <path d="M 0 170 Q 140 180 250 115 L 268 -40 Q 140 25 0 35 Z" fill="#0284C7" stroke="#38BDF8" stroke-width="4" />
    <!-- White paper page -->
    <path d="M 0 150 Q 130 160 240 95 L 255 -55 Q 130 10 0 18 Z" fill="#FFFFFF" />
    <!-- Subtle ruling lines -->
    <line x1="40" y1="40" x2="210" y2="0" stroke="#CBD5E1" stroke-width="3" />
    <line x1="40" y1="62" x2="210" y2="22" stroke="#CBD5E1" stroke-width="3" />
    <line x1="40" y1="84" x2="210" y2="44" stroke="#CBD5E1" stroke-width="3" />
    <line x1="40" y1="106" x2="210" y2="66" stroke="#CBD5E1" stroke-width="3" />
    <!-- Page crease shadow -->
    <rect x="0" y="15" width="28" height="140" fill="url(#creaseGrad)" />
    <defs>
      <linearGradient id="creaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(0,0,0,0.22)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0)" />
      </linearGradient>
    </defs>
  </svg>

  <!-- Center Silk Ribbon Bookmark -->
  <div class="center-ribbon"></div>

  <!-- Centered Arabic Calligraphy -->
  <img class="centered-calligraphy" src="${calUrl}" />

  <!-- Bottom Title and Subtitle -->
  <div class="patch-bottom">
    <div class="title">${f.title}</div>
    <div class="subtitle">•  এসো আরবী শিখি  •</div>
  </div>
</body>
</html>
  `;
}

async function run() {
  const artifactDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';

  for (const f of fontVariations) {
    const htmlFile = path.resolve(__dirname, `temp_${f.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${f.id}.jpg`);
    const outFileArtifact = path.resolve(artifactDir, `${f.id}.jpg`);

    fs.writeFileSync(htmlFile, buildHtml(f), 'utf-8');
    const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

    console.log(`Rendering ${f.name}...`);
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
    console.log(`✓ Finished ${f.id}`);
  }
  console.log('All centered no-arrow designs rendered with 100% precision!');
}

run().catch(console.error);
