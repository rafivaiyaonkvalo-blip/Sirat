const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800;900&family=Outfit:wght@800;900&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
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

      // Book center axis is around x = 506
      const centerX = 506;

      // 1. Extract Arabic Calligraphy from top-left (approx x: 195 to 435, y: 195 to 500)
      const calCanvas = document.createElement('canvas');
      calCanvas.width = 1024;
      calCanvas.height = 1024;
      const calCtx = calCanvas.getContext('2d');
      calCtx.drawImage(img, 0, 0);

      const calData = calCtx.getImageData(190, 180, 250, 320);
      const cPixels = calData.data;

      // Isolate white calligraphy pixels (high brightness, low blue tint compared to background)
      for (let i = 0; i < cPixels.length; i += 4) {
        const r = cPixels[i];
        const g = cPixels[i + 1];
        const b = cPixels[i + 2];
        const brightness = (r + g + b) / 3;
        // If it's the background glass, make it transparent
        if (brightness < 160 || (b - r > 70 && brightness < 200)) {
          cPixels[i + 3] = 0;
        } else {
          // Keep white calligraphy
          const alphaFactor = Math.min(1, Math.max(0, (brightness - 150) / 60));
          cPixels[i + 3] = Math.round(255 * alphaFactor);
        }
      }
      calCtx.putImageData(calData, 190, 180);

      // 2. Erase the top-right arrow and top-left calligraphy to get clean background & book
      // On the right side, the arrow is in area x: 420 to 810, y: 250 to 580.
      // We can mirror the clean left side of the book (x: 235 to 506, y: 270 to 650) to the right!
      const bookHalfCanvas = document.createElement('canvas');
      bookHalfCanvas.width = 512;
      bookHalfCanvas.height = 1024;
      const bCtx = bookHalfCanvas.getContext('2d');
      // Draw left half of book
      bCtx.drawImage(img, 0, 0);

      // Mirror left book half to right
      ctx.save();
      ctx.translate(centerX * 2, 0);
      ctx.scale(-1, 1);
      // Draw the mirrored left half over the right half (x: centerX to 800)
      ctx.drawImage(img, 240, 260, centerX - 240, 380, 240, 260, centerX - 240, 380);
      ctx.restore();

      // Clean background behind where the arrow head was (x: 650 to 820, y: 250 to 420)
      // Mirror background from left side
      ctx.save();
      ctx.translate(centerX * 2, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 180, 200, 160, 200, 180, 200, 160, 200);
      ctx.restore();

      // Clean top-left where original calligraphy was by mirroring the clean top-right background
      ctx.drawImage(img, 560, 180, 240, 180, 200, 180, 240, 180);

      // 3. Now draw the Arabic calligraphy right in the CENTER (above/on the book)!
      // Original was at x: 190 (width ~240, center was ~310).
      // We move it so its center is at centerX = 506 (shift dx = 506 - 310 = +196)
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;
      ctx.drawImage(calCanvas, 190, 180, 250, 320, 506 - 125, 175, 250, 320);
      ctx.restore();

      // 4. Clean bottom text patch & draw ArbiGo + এসো আরবী শিখি
      ctx.save();
      const grad = ctx.createRadialGradient(512, 735, 10, 512, 735, 340);
      grad.addColorStop(0, 'rgba(14, 75, 185, 1)');
      grad.addColorStop(0.75, 'rgba(10, 58, 155, 1)');
      grad.addColorStop(0.9, 'rgba(8, 48, 135, 0.95)');
      grad.addColorStop(1, 'rgba(8, 48, 135, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(512, 735, 390, 105, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ArbiGo text
      ctx.save();
      ctx.font = '900 92px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.5px';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('ArbiGo', 512, 725);
      ctx.restore();

      // Subtitle
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
    };
  </script>
</body>
</html>
`;

const htmlFile = path.resolve(__dirname, 'temp_centered.html');
const outFile = path.resolve(__dirname, '../public/arbigo_centered_no_arrow_test.jpg');
fs.writeFileSync(htmlFile, html);

execFile(
  CHROME_PATH,
  ['--headless', '--disable-gpu', `--screenshot=${outFile}`, '--window-size=1024,1024', 'file:///' + htmlFile.replace(/\\/g, '/')],
  (err) => {
    if (err) console.error(err);
    else console.log('Successfully generated arbigo_centered_no_arrow_test.jpg!');
  }
);
