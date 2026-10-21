const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';
const publicDir = path.resolve(__dirname, '../public');
const sourceImg = path.join(brainDir, 'arbigo_new_concept1_ayn_ribbon_1790152548295.jpg');
const sourceUri = 'file:///' + sourceImg.replace(/\\/g, '/');

const tempHtml = path.resolve(__dirname, '../scratch/icon_render.html');
fs.writeFileSync(tempHtml, `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body, html { width:100%; height:100%; overflow:hidden; background:#ffffff; }
  img { width:100%; height:100%; object-fit:cover; display:block; }
</style>
</head>
<body>
  <img src="${sourceUri}">
</body>
</html>`);

function capture(size, outPath) {
  const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=${size},${size} "file:///${tempHtml.replace(/\\/g, '/')}"`;
  execSync(cmd);
}

console.log('Rendering modern Ayn app icons...');

capture(512, path.join(publicDir, 'logo-512.png'));
capture(192, path.join(publicDir, 'logo-192.png'));
capture(512, path.join(publicDir, 'playstore-icon.png'));
capture(512, path.join(publicDir, 'logo.png'));
capture(512, path.join(publicDir, 'logo.jpg'));
capture(64, path.join(publicDir, 'favicon.png'));

// Also copy to release folder for playstore build
const releaseDir = path.resolve(__dirname, '../release');
if (fs.existsSync(releaseDir)) {
  fs.copyFileSync(path.join(publicDir, 'playstore-icon.png'), path.join(releaseDir, 'playstore-icon.png'));
}

console.log('All icons successfully updated to modern Ayn ribbon!');
