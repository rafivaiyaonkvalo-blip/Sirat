const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const fontOptions = [
  {
    id: 'clean_blue_centered_jakarta',
    name: 'ডিজাইন ১ (প্লাস জাকার্তা সান্স - মডার্ন টেক)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    fontSize: 90,
    googleFont: 'Plus+Jakarta+Sans:wght@800;900',
    title: 'ArbiGo'
  },
  {
    id: 'clean_blue_centered_outfit',
    name: 'ডিজাইন ২ (আউটফিট - সুপার স্লীক জিওমেট্রিক)',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 88,
    googleFont: 'Outfit:wght@800;900',
    title: 'ArbiGo'
  },
  {
    id: 'clean_blue_centered_fredoka',
    name: 'ডিজাইন ৩ (ফ্রেডোকা - ফ্রেন্ডলি ডুওলিঙ্গো এডুকেশন)',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 92,
    googleFont: 'Fredoka:wght@600;700',
    title: 'ArbiGo'
  },
  {
    id: 'clean_blue_centered_cinzel',
    name: 'ডিজাইন ৪ (সিনজেল - রয়েল ক্লাসিক সেরিফ)',
    fontFamily: "'Cinzel', serif",
    fontWeight: 900,
    fontSize: 80,
    googleFont: 'Cinzel:wght@800;900',
    title: 'ARBIGO'
  }
];

function buildSvgHtml(f) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${f.googleFont}&family=Amiri:wght@700&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1024px;
      height: 1024px;
      background: #021a24;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background squircle gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E40AF" />
        <stop offset="30%" stop-color="#1D4ED8" />
        <stop offset="70%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>

      <!-- Glass card gradient -->
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(37, 99, 235, 0.85)" />
        <stop offset="50%" stop-color="rgba(29, 78, 216, 0.75)" />
        <stop offset="100%" stop-color="rgba(15, 23, 42, 0.92)" />
      </linearGradient>

      <!-- Border gradient -->
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(56, 189, 248, 0.8)" />
        <stop offset="50%" stop-color="rgba(37, 99, 235, 0.3)" />
        <stop offset="100%" stop-color="rgba(14, 165, 233, 0.7)" />
      </linearGradient>

      <!-- Book Cover Base Gradient -->
      <linearGradient id="bookBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0284C7" />
        <stop offset="100%" stop-color="#0369A1" />
      </linearGradient>

      <!-- Ribbon Gradient -->
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="60%" stop-color="#0284C7" />
        <stop offset="100%" stop-color="#0369A1" />
      </linearGradient>

      <!-- Page Crease Shadow -->
      <linearGradient id="pageCreaseLeft" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="rgba(15, 23, 42, 0.35)" />
        <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
      </linearGradient>
      <linearGradient id="pageCreaseRight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(15, 23, 42, 0.35)" />
        <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
      </linearGradient>

      <!-- Glow Filters -->
      <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6" />
      </filter>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="rgba(56, 189, 248, 0.5)" />
      </filter>
      <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0, 0, 0, 0.9)" />
        <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="rgba(186, 230, 253, 0.45)" />
      </filter>
    </defs>

    <!-- App Icon Base Background -->
    <rect width="1024" height="1024" fill="url(#bgGrad)" />

    <!-- Frosted Glass Card Squircle -->
    <rect x="104" y="104" width="816" height="816" rx="180" ry="180" 
          fill="url(#glassGrad)" stroke="url(#borderGrad)" stroke-width="4.5" 
          filter="url(#cardShadow)" />

    <!-- Islamic Geometric Stars Watermark Pattern in Background -->
    <g stroke="rgba(56, 189, 248, 0.12)" stroke-width="1.8" fill="none">
      <!-- Repeating 8-point Islamic star geometries -->
      <path d="M 512 140 L 532 190 L 582 190 L 542 220 L 558 270 L 512 240 L 466 270 L 482 220 L 442 190 L 492 190 Z" />
      <circle cx="512" cy="205" r="45" />
      
      <circle cx="260" cy="260" r="70" />
      <polygon points="260,190 280,240 330,240 290,270 305,320 260,290 215,320 230,270 190,240 240,240" />

      <circle cx="764" cy="260" r="70" />
      <polygon points="764,190 784,240 834,240 794,270 809,320 764,290 719,320 734,270 694,240 744,240" />

      <circle cx="230" cy="620" r="60" />
      <circle cx="794" cy="620" r="60" />
    </g>

    <!-- ==================== CENTERED ARABIC CALLIGRAPHY ==================== -->
    <!-- Beautiful Arabic Calligraphy: اَلْعَرَبِيَّة (Al-Arabiyyah) or اَلْعَرَبِي (Al-Arabi) -->
    <g filter="url(#softGlow)">
      <!-- Arabic Calligraphy text styled authentically with Tashkeel -->
      <text x="512" y="325" 
            font-family="'Amiri', 'Scheherazade New', serif" 
            font-size="108" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="#FFFFFF" 
            letter-spacing="1px">
        اَلْعَرَبِيَّةُ
      </text>
      <!-- Sub-calligraphy decorative flourish -->
      <path d="M 412 345 Q 512 360 612 345" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" fill="none" />
      <circle cx="512" cy="358" r="4" fill="#38BDF8" />
    </g>

    <!-- ==================== SYMMETRICAL OPEN BOOK (NO ARROW!) ==================== -->
    <g transform="translate(0, 30)" filter="url(#softGlow)">
      <!-- Hardcover Cyan/Blue Base Left -->
      <path d="M 512 585 Q 360 595 240 520 L 225 350 Q 360 415 512 430 Z" 
            fill="url(#bookBaseGrad)" stroke="#38BDF8" stroke-width="4.5" stroke-linejoin="round" />
      
      <!-- Hardcover Cyan/Blue Base Right (Perfect Symmetrical Mirror) -->
      <path d="M 512 585 Q 664 595 784 520 L 799 350 Q 664 415 512 430 Z" 
            fill="url(#bookBaseGrad)" stroke="#38BDF8" stroke-width="4.5" stroke-linejoin="round" />

      <!-- White Page Stack Left -->
      <path d="M 510 565 Q 370 575 250 505 L 260 335 Q 375 400 510 415 Z" 
            fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      
      <!-- White Page Stack Right (Symmetrical) -->
      <path d="M 514 565 Q 654 575 774 505 L 764 335 Q 649 400 514 415 Z" 
            fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />

      <!-- Left Page Ruling Lines -->
      <line x1="285" y1="365" x2="480" y2="432" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="280" y1="395" x2="480" y2="462" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="275" y1="425" x2="480" y2="492" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="270" y1="455" x2="480" y2="522" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />

      <!-- Right Page Ruling Lines (Symmetrical) -->
      <line x1="544" y1="432" x2="739" y2="365" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="544" y1="462" x2="744" y2="395" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="544" y1="492" x2="749" y2="425" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="544" y1="522" x2="754" y2="455" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />

      <!-- Center Spine Crease Shadow -->
      <rect x="470" y="415" width="42" height="150" fill="url(#pageCreaseLeft)" />
      <rect x="512" y="415" width="42" height="150" fill="url(#pageCreaseRight)" />

      <!-- Hanging Silk Ribbon Bookmark (Straight Down in Center) -->
      <polygon points="494,415 530,415 532,610 512,592 492,610" 
               fill="url(#ribbonGrad)" 
               stroke="#0284C7" stroke-width="1.5" />
    </g>

    <!-- ==================== TYPOGRAPHY & SUBTITLE ==================== -->
    <g filter="url(#textGlow)">
      <!-- ArbiGo Main Brand Title -->
      <text x="512" y="738" 
            font-family="${f.fontFamily}" 
            font-size="${f.fontSize}" 
            font-weight="${f.fontWeight}" 
            text-anchor="middle" 
            fill="#FFFFFF" 
            letter-spacing="-0.5px">
        ${f.title}
      </text>

      <!-- Bengali Subtitle: •  এসো আরবী শিখি  • -->
      <text x="512" y="812" 
            font-family="'Hind Siliguri', sans-serif" 
            font-size="24" 
            font-weight="bold" 
            text-anchor="middle" 
            fill="#BAE6FD" 
            letter-spacing="3.5px">
        •  এসো আরবী শিখি  •
      </text>
    </g>
  </svg>
</body>
</html>
  `;
}

async function run() {
  const artifactDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';

  for (const f of fontOptions) {
    const htmlFile = path.resolve(__dirname, `temp_vector_${f.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${f.id}.jpg`);
    const outFileArtifact = path.resolve(artifactDir, `${f.id}.jpg`);

    fs.writeFileSync(htmlFile, buildSvgHtml(f), 'utf-8');
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
  console.log('All pure vector centered logos rendered successfully!');
}

run().catch(console.error);
