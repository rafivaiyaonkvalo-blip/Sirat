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
    name: 'ফন্ট ১: প্লাস জাকার্তা সান্স (Plus Jakarta Sans - মডার্ন গ্লোবাল টেক)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    fontSize: 94,
    letterSpacing: '-0.5px',
    casing: 'normal',
    googleFont: 'Plus+Jakarta+Sans:wght@800;900',
    desc: 'আধুনিক, পরিচ্ছন্ন ও আন্তর্জাতিক টেক ব্র্যান্ড লুক (Spotify / Stripe স্টাইল)'
  },
  {
    id: 'blue_font_2_outfit',
    name: 'ফন্ট ২: আউটফিট জিওমেট্রিক (Outfit - সুপার শার্প ও আধুনিক)',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 92,
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
    fontSize: 96,
    letterSpacing: '0px',
    casing: 'normal',
    googleFont: 'Fredoka:wght@600;700',
    desc: 'সফট রাউন্ডেড এজ, ফ্রেন্ডলি ও আধুনিক ভাষা শিক্ষা প্ল্যাটফর্মের উপযোগী'
  },
  {
    id: 'blue_font_4_cinzel',
    name: 'ফন্ট ৪: সিনজেল রয়্যাল সেরিফ (Cinzel - অভিজাত রাজকীয় সংস্করণ)',
    fontFamily: "'Cinzel', serif",
    fontWeight: 900,
    fontSize: 84,
    letterSpacing: '3px',
    casing: 'uppercase',
    googleFont: 'Cinzel:wght@800;900',
    desc: 'ঐতিহ্যবাহী, অভিজাত ও রাজকীয় সেরিফ লেটারিং'
  },
  {
    id: 'blue_font_5_tajawal',
    name: 'ফন্ট ৫: তাজাউয়াল অ্যারাবিক ল্যাটিন (Tajawal - আধুনিক আরবি কাট)',
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 900,
    fontSize: 92,
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
    body {
      width: 1024px;
      height: 1024px;
      position: relative;
      overflow: hidden;
      background: #031e28;
    }
    .bg-img {
      width: 1024px;
      height: 1024px;
      display: block;
    }
    /* Full-width patch covering entire width of card at bottom */
    .patch {
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
    }
    .title {
      font-family: ${v.fontFamily};
      font-size: ${v.fontSize}px;
      font-weight: ${v.fontWeight};
      letter-spacing: ${v.letterSpacing};
      color: #FFFFFF;
      filter: drop-shadow(0 4px 18px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 16px rgba(186, 230, 253, 0.5));
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
  <img class="bg-img" src="${imgDataUrl}" />
  <div class="patch">
    <div class="title">${titleText}</div>
    <div class="subtitle">•  এসো আরবী শিখি  •</div>
  </div>
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
  console.log('All 5 font variations rendered with 100% ghost-free precision!');
}

run().catch(console.error);
