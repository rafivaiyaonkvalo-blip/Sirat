const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');

const html = `
<!DOCTYPE html><html><body><canvas id="c" width="1024" height="1024"></canvas>
<script>
const img = new Image();
img.src = 'data:image/jpeg;base64,${imgBase64}';
img.onload = () => {
  const ctx = document.getElementById('c').getContext('2d');
  ctx.drawImage(img, 0, 0);
  const p1 = ctx.getImageData(200, 720, 1, 1).data;
  const p2 = ctx.getImageData(820, 720, 1, 1).data;
  const p3 = ctx.getImageData(512, 645, 1, 1).data;
  const p4 = ctx.getImageData(512, 850, 1, 1).data;
  document.title = JSON.stringify({
    left: [p1[0], p1[1], p1[2]],
    right: [p2[0], p2[1], p2[2]],
    top: [p3[0], p3[1], p3[2]],
    bottom: [p4[0], p4[1], p4[2]]
  });
};
</script></body></html>`;

fs.writeFileSync(path.resolve(__dirname, 'sample.html'), html);
console.log('sample.html ready');
