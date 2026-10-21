const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const html = `
<!DOCTYPE html><html><body><canvas id="c" width="400" height="400"></canvas>
<script>
const img = new Image();
img.src = '${imgDataUrl}';
img.onload = () => {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  // Draw the calligraphy region from master (source: x:190, y:180, w:250, h:320)
  ctx.drawImage(img, 195, 185, 240, 310, 80, 45, 240, 310);
  
  const imgData = ctx.getImageData(0, 0, 400, 400);
  const d = imgData.data;
  
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];
    const brightness = (r + g + b) / 3;
    
    // Detect white calligraphy strokes
    if (r > 190 && g > 190 && b > 200) {
      // Pure white with full opacity
      d[i] = 255; d[i+1] = 255; d[i+2] = 255;
      d[i+3] = 255;
    } else if (r > 140 && g > 140 && b > 160) {
      // Anti-aliased white edge
      const alpha = Math.min(255, Math.max(0, (brightness - 130) * 3));
      d[i] = 255; d[i+1] = 255; d[i+2] = 255;
      d[i+3] = alpha;
    } else {
      // Transparent background
      d[i+3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
};
</script></body></html>`;

fs.writeFileSync(path.resolve(__dirname, 'temp_cal.html'), html);

execFile(
  CHROME_PATH,
  [
    '--headless',
    '--disable-gpu',
    `--screenshot=${path.resolve(__dirname, '../public/extracted_calligraphy.png')}`,
    '--window-size=400,400',
    '--default-background-color=00000000',
    'file:///' + path.resolve(__dirname, 'temp_cal.html').replace(/\\/g, '/')
  ],
  (err) => {
    if (err) console.error(err);
    else console.log('Extracted calligraphy successfully to public/extracted_calligraphy.png!');
  }
);
