const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const CAL_IMG = path.resolve(__dirname, '../public/extracted_calligraphy.png');

const masterB64 = fs.readFileSync(MASTER_IMG).toString('base64');
const calB64 = fs.readFileSync(CAL_IMG).toString('base64');

const fontOptions = [
  {
    id: 'centered_font1_jakarta',
    name: 'ডিজাইন ১ (প্লাস জাকার্তা সান্স - বোল্ড টেক)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 900,
    fontSize: 94,
    googleFont: 'Plus+Jakarta+Sans:wght@800;900'
  },
  {
    id: 'centered_font2_outfit',
    name: 'ডিজাইন ২ (আউটফিট - সুপার শার্প জিওমেট্রিক)',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 900,
    fontSize: 92,
    googleFont: 'Outfit:wght@800;900'
  },
  {
    id: 'centered_font3_fredoka',
    name: 'ডিজাইন ৩ (ফ্রেডোকা - ডুওলিঙ্গো রাউন্ডেড এডুকেশন)',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 700,
    fontSize: 96,
    googleFont: 'Fredoka:wght@600;700'
  },
  {
    id: 'centered_font4_cinzel',
    name: 'ডিজাইন ৪ (সিনজেল - রয়েল ক্লাসিক সেরিফ)',
    fontFamily: "'Cinzel', serif",
    fontWeight: 900,
    fontSize: 84,
    googleFont: 'Cinzel:wght@800;900',
    isUpper: true
  }
];

function generateHtml(f) {
  const titleText = f.isUpper ? 'ARBIGO' : 'ArbiGo';
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
    body { width: 1024px; height: 1024px; background: #031e28; overflow: hidden; }
    canvas { display: block; width: 1024px; height: 1024px; }
  </style>
</head>
<body>
  <canvas id="c" width="1024" height="1024"></canvas>
  <script>
    const master = new Image();
    const cal = new Image();
    let loaded = 0;
    function check() { if (++loaded === 2) draw(); }
    master.src = 'data:image/jpeg;base64,${masterB64}';
    cal.src = 'data:image/png;base64,${calB64}';
    master.onload = check;
    cal.onload = check;

    function draw() {
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      ctx.drawImage(master, 0, 0);

      // Book center axis
      const cx = 506;

      // 1. CLEAN UP THE TOP-LEFT (where the original calligraphy was):
      // Sample the blue background from the top-right and blend it over top-left
      ctx.save();
      const bgGradLeft = ctx.createRadialGradient(310, 290, 20, 310, 290, 210);
      bgGradLeft.addColorStop(0, 'rgba(10, 52, 140, 0.98)');
      bgGradLeft.addColorStop(0.65, 'rgba(8, 42, 120, 0.95)');
      bgGradLeft.addColorStop(1, 'rgba(8, 42, 120, 0)');
      ctx.fillStyle = bgGradLeft;
      ctx.beginPath();
      ctx.ellipse(305, 300, 160, 150, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. CLEAN UP THE ARROW (where the arrow head was in top-right background):
      ctx.save();
      const bgGradRight = ctx.createRadialGradient(720, 340, 20, 720, 340, 180);
      bgGradRight.addColorStop(0, 'rgba(10, 52, 140, 0.98)');
      bgGradRight.addColorStop(0.65, 'rgba(8, 42, 120, 0.95)');
      bgGradRight.addColorStop(1, 'rgba(8, 42, 120, 0)');
      ctx.fillStyle = bgGradRight;
      ctx.beginPath();
      ctx.ellipse(710, 335, 140, 130, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. RECONSTRUCT THE OPEN BOOK (Symmetrical, pristine white pages, blue edges):
      // Draw the crisp left page
      // Left page path:
      ctx.save();
      // We draw clean symmetrical book pages on both left and right!
      function drawBookPage(isRight) {
        ctx.save();
        if (isRight) {
          ctx.translate(cx * 2, 0);
          ctx.scale(-1, 1);
        }

        // Hardcover cyan base
        ctx.beginPath();
        ctx.moveTo(cx, 620);
        ctx.quadraticCurveTo(cx - 140, 625, cx - 250, 555);
        ctx.lineTo(cx - 270, 395);
        ctx.quadraticCurveTo(cx - 140, 460, cx, 470);
        ctx.fillStyle = '#0284C7';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#38BDF8';
        ctx.stroke();

        // White paper stack / page
        ctx.beginPath();
        ctx.moveTo(cx - 2, 595);
        ctx.quadraticCurveTo(cx - 130, 600, cx - 240, 535);
        ctx.lineTo(cx - 255, 380);
        ctx.quadraticCurveTo(cx - 130, 445, cx - 2, 452);
        ctx.closePath();
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Subtle ruling lines
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
          const yOff = i * 22;
          ctx.beginPath();
          ctx.moveTo(cx - 40, 475 + yOff);
          ctx.lineTo(cx - 210, 435 + yOff);
          ctx.stroke();
        }

        // Inner page crease shadow
        const crease = ctx.createLinearGradient(cx, 450, cx - 35, 450);
        crease.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
        crease.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = crease;
        ctx.fillRect(cx - 35, 450, 35, 150);

        ctx.restore();
      }

      drawBookPage(false); // Left page
      drawBookPage(true);  // Right page

      // Center silk ribbon bookmark hanging straight down
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - 16, 452);
      ctx.lineTo(cx + 16, 452);
      ctx.lineTo(cx + 18, 645);
      ctx.lineTo(cx, 630);
      ctx.lineTo(cx - 18, 645);
      ctx.closePath();
      const ribGrad = ctx.createLinearGradient(cx - 18, 452, cx + 18, 645);
      ribGrad.addColorStop(0, '#38BDF8');
      ribGrad.addColorStop(0.5, '#0284C7');
      ribGrad.addColorStop(1, '#0369A1');
      ctx.fillStyle = ribGrad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      // 4. PLACE THE ARABIC CALLIGRAPHY IN THE CENTER (floating majestically above the open book):
      // The calligraphy width is ~200px, height ~280px.
      // We center it at x = cx (506), y = 205!
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;
      // Draw centered calligraphy
      // Source: from extracted_calligraphy.png (which is 400x400)
      // Calligraphy is between x: 60 to 260, y: 50 to 330
      ctx.drawImage(cal, 60, 40, 230, 310, cx - 120, 170, 240, 320);
      ctx.restore();

      // 5. CLEAN BOTTOM TEXT AREA & DRAW TYPOGRAPHY:
      ctx.save();
      const gradBottom = ctx.createRadialGradient(512, 735, 10, 512, 735, 340);
      gradBottom.addColorStop(0, 'rgba(14, 75, 185, 1)');
      gradBottom.addColorStop(0.75, 'rgba(10, 58, 155, 1)');
      gradBottom.addColorStop(0.9, 'rgba(8, 48, 135, 0.95)');
      gradBottom.addColorStop(1, 'rgba(8, 48, 135, 0)');
      ctx.fillStyle = gradBottom;
      ctx.beginPath();
      ctx.ellipse(512, 735, 400, 105, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ArbiGo Title
      ctx.save();
      ctx.font = '${f.fontWeight} ${f.fontSize}px ${f.fontFamily}';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('${titleText}', 512, 725);
      ctx.restore();

      // Subtitle: •  এসো আরবী শিখি  •
      ctx.save();
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '2.5px';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#BAE6FD';
      ctx.fillText('•  এসো আরবী শিখি  •', 512, 808);
      ctx.restore();
    }
  </script>
</body>
</html>
  `;
}

async function run() {
  const artifactDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';

  for (const f of fontOptions) {
    const htmlFile = path.resolve(__dirname, `temp_clean_${f.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${f.id}.jpg`);
    const outFileArtifact = path.resolve(artifactDir, `${f.id}.jpg`);

    fs.writeFileSync(htmlFile, generateHtml(f), 'utf-8');
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
  console.log('All centered no-arrow designs rendered successfully!');
}

run().catch(console.error);
