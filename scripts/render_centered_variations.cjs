const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CAL_IMG = path.resolve(__dirname, '../public/extracted_calligraphy.png');
const calB64 = fs.readFileSync(CAL_IMG).toString('base64');
const calUrl = `data:image/png;base64,${calB64}`;

const variations = [
  {
    id: 'centered_v1_calligraphy_outfit',
    name: 'ডিজাইন ১: ক্লাসিক আরবি ক্যালিগ্রাফি "العربي" (মাঝে) + আউটফিট ফন্ট',
    useImageCal: true,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 92,
    googleFont: 'Outfit:wght@800;900',
    title: 'ArbiGo'
  },
  {
    id: 'centered_v2_calligraphy_jakarta',
    name: 'ডিজাইন ২: ক্লাসিক আরবি ক্যালিগ্রাফি "العربي" (মাঝে) + প্লাস জাকার্তা ফন্ট',
    useImageCal: true,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    fontSize: 94,
    googleFont: 'Plus+Jakarta+Sans:wght@800;900',
    title: 'ArbiGo'
  },
  {
    id: 'centered_v3_typography_outfit',
    name: 'ডিজাইন ৩: পূর্ণ হরকতযুক্ত "اَلْعَرَبِيَّةُ" (মাঝে) + আউটফিট ফন্ট',
    useImageCal: false,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 90,
    googleFont: 'Outfit:wght@800;900',
    title: 'ArbiGo'
  }
];

function buildSvgHtml(v) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${v.googleFont}&family=Amiri:wght@700&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
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
      <!-- Base Background -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E40AF" />
        <stop offset="35%" stop-color="#1D4ED8" />
        <stop offset="70%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>

      <!-- Glass Card -->
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(37, 99, 235, 0.88)" />
        <stop offset="55%" stop-color="rgba(29, 78, 216, 0.78)" />
        <stop offset="100%" stop-color="rgba(15, 23, 42, 0.94)" />
      </linearGradient>

      <!-- Glass Border -->
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(56, 189, 248, 0.85)" />
        <stop offset="50%" stop-color="rgba(37, 99, 235, 0.35)" />
        <stop offset="100%" stop-color="rgba(14, 165, 233, 0.75)" />
      </linearGradient>

      <!-- Book Cover Blue -->
      <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0284C7" />
        <stop offset="100%" stop-color="#0369A1" />
      </linearGradient>

      <!-- Silk Ribbon -->
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="60%" stop-color="#0284C7" />
        <stop offset="100%" stop-color="#0369A1" />
      </linearGradient>

      <!-- Filters -->
      <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000000" flood-opacity="0.65" />
      </filter>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="rgba(56, 189, 248, 0.55)" />
      </filter>
      <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="rgba(0, 0, 0, 0.9)" />
        <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="rgba(186, 230, 253, 0.5)" />
      </filter>
    </defs>

    <!-- App Icon Background -->
    <rect width="1024" height="1024" fill="url(#bgGrad)" />

    <!-- Frosted Glass Squircle Card -->
    <rect x="104" y="104" width="816" height="816" rx="180" ry="180" 
          fill="url(#glassGrad)" stroke="url(#borderGrad)" stroke-width="4.5" 
          filter="url(#cardShadow)" />

    <!-- Islamic Geometric Stars Watermark -->
    <g stroke="rgba(56, 189, 248, 0.14)" stroke-width="1.8" fill="none">
      <circle cx="512" cy="235" r="55" />
      <polygon points="512,165 528,215 578,215 538,245 553,295 512,265 471,295 486,245 446,215 496,215" />

      <circle cx="260" cy="270" r="70" />
      <polygon points="260,200 280,250 330,250 290,280 305,330 260,300 215,330 230,280 190,250 240,250" />

      <circle cx="764" cy="270" r="70" />
      <polygon points="764,200 784,250 834,250 794,280 809,330 764,300 719,330 734,280 694,250 744,250" />
    </g>

    <!-- ==================== CENTERED ARABIC CALLIGRAPHY ==================== -->
    <g filter="url(#softGlow)">
      ${v.useImageCal ? `
        <!-- Authentic Extracted Calligraphy "العربي" Centered -->
        <image href="${calUrl}" x="385" y="145" width="254" height="254" />
      ` : `
        <!-- Amiri Pure Arabic Typography "اَلْعَرَبِيَّةُ" Centered -->
        <text x="512" y="315" 
              font-family="'Amiri', serif" 
              font-size="112" 
              font-weight="bold" 
              text-anchor="middle" 
              fill="#FFFFFF">
          اَلْعَرَبِيَّةُ
        </text>
        <path d="M 405 338 Q 512 355 619 338" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" fill="none" />
      `}
    </g>

    <!-- ==================== SYMMETRICAL 3D OPEN BOOK (NO ARROW!) ==================== -->
    <g transform="translate(0, 35)" filter="url(#softGlow)">
      <!-- Hardcover Blue Base Left -->
      <path d="M 512 590 Q 360 600 240 525 L 225 355 Q 360 420 512 435 Z" 
            fill="url(#bookCoverGrad)" stroke="#38BDF8" stroke-width="4.5" stroke-linejoin="round" />
      
      <!-- Hardcover Blue Base Right (Mirror) -->
      <path d="M 512 590 Q 664 600 784 525 L 799 355 Q 664 420 512 435 Z" 
            fill="url(#bookCoverGrad)" stroke="#38BDF8" stroke-width="4.5" stroke-linejoin="round" />

      <!-- White Stacked Pages Left -->
      <path d="M 510 570 Q 370 580 250 510 L 260 340 Q 375 405 510 420 Z" 
            fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      
      <!-- White Stacked Pages Right -->
      <path d="M 514 570 Q 654 580 774 510 L 764 340 Q 649 405 514 420 Z" 
            fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />

      <!-- Left Page Ruling Lines -->
      <line x1="285" y1="370" x2="480" y2="437" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="280" y1="400" x2="480" y2="467" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="275" y1="430" x2="480" y2="497" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="270" y1="460" x2="480" y2="527" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />

      <!-- Right Page Ruling Lines (Mirror) -->
      <line x1="544" y1="437" x2="739" y2="370" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="544" y1="467" x2="744" y2="400" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="544" y1="497" x2="749" y2="430" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />
      <line x1="544" y1="527" x2="754" y2="460" stroke="#CBD5E1" stroke-width="3.5" stroke-linecap="round" />

      <!-- Center Spine Crease Shadows -->
      <path d="M 470 420 L 512 420 L 512 570 L 470 570 Z" fill="rgba(15, 23, 42, 0.18)" />
      <path d="M 512 420 L 554 420 L 554 570 L 512 570 Z" fill="rgba(15, 23, 42, 0.18)" />

      <!-- Center Silk Ribbon Bookmark (Hanging Straight Down) -->
      <polygon points="494,420 530,420 532,615 512,597 492,615" 
               fill="url(#ribbonGrad)" 
               stroke="#0284C7" stroke-width="1.5" />
    </g>

    <!-- ==================== TYPOGRAPHY & SUBTITLE ==================== -->
    <g filter="url(#textGlow)">
      <!-- ArbiGo Main Brand Title -->
      <text x="512" y="740" 
            font-family="${v.fontFamily}" 
            font-size="${v.fontSize}" 
            font-weight="${v.fontWeight}" 
            text-anchor="middle" 
            fill="#FFFFFF" 
            letter-spacing="-0.5px">
        ${v.title}
      </text>

      <!-- Bengali Subtitle: •  এসো আরবী শিখি  • -->
      <text x="512" y="814" 
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

  for (const v of variations) {
    const htmlFile = path.resolve(__dirname, `temp_var_${v.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${v.id}.jpg`);
    const outFileArtifact = path.resolve(artifactDir, `${v.id}.jpg`);

    fs.writeFileSync(htmlFile, buildSvgHtml(v), 'utf-8');
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
  console.log('All centered variations rendered successfully!');
}

run().catch(console.error);
