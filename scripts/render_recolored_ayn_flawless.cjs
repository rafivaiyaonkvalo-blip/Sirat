const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';
const publicLogosDir = path.resolve(__dirname, '../public/logos');
const original1A = path.join(brainDir, 'arbigo_new_concept1_ayn_ribbon_1790152548295.jpg');

const original1AUri = 'file:///' + original1A.replace(/\\/g, '/');

// 1. Blue Edition (Hue rotated perfectly to Deep Royal Ocean Blue)
const htmlBlue = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:#ffffff; display:flex; align-items:center; justify-content:center; }
  img { width:512px; height:512px; filter: hue-rotate(65deg) saturate(1.15) brightness(0.95); }
</style>
</head>
<body>
  <img src="${original1AUri}">
</body>
</html>`;

// 2. Royal Gold Edition (Hue rotated to Rich 24K Gold)
const htmlGold = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:#ffffff; display:flex; align-items:center; justify-content:center; }
  img { width:512px; height:512px; filter: hue-rotate(295deg) saturate(1.3) contrast(1.05); }
</style>
</head>
<body>
  <img src="${original1AUri}">
</body>
</html>`;

// 3. Deep Indigo / Sapphire Edition
const htmlIndigo = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:#ffffff; display:flex; align-items:center; justify-content:center; }
  img { width:512px; height:512px; filter: hue-rotate(110deg) saturate(1.2) contrast(1.1); }
</style>
</head>
<body>
  <img src="${original1AUri}">
</body>
</html>`;

// 4. Authentic Arabic Typography using Google Font Amiri & Reem Kufi (100% Unbroken)
const htmlKufi = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@700&family=Plus+Jakarta+Sans:wght@800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:#ffffff; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans', sans-serif; }
  .tile {
    width:512px; height:512px;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0c4a6e 100%);
    border-radius: 124px;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    position:relative;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .sheen {
    position:absolute; top:0; left:0; width:100%; height:100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%);
    border-radius: 124px;
  }
  .ayn {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 260px;
    color: #ffffff;
    line-height: 1;
    margin-top: -30px;
    text-shadow: 0 10px 25px rgba(0,0,0,0.35);
  }
  .brand {
    font-size: 42px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 2px;
    margin-top: -10px;
    text-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .brand span { color: #38bdf8; }
</style>
</head>
<body>
  <div class="tile">
    <div class="sheen"></div>
    <div class="ayn">ع</div>
    <div class="brand">Arbi<span>Go</span></div>
  </div>
</body>
</html>`;

const tempDir = path.resolve(__dirname, '../scratch');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const fBlue = path.join(tempDir, 'p_blue.html');
const fGold = path.join(tempDir, 'p_gold.html');
const fIndigo = path.join(tempDir, 'p_indigo.html');
const fKufi = path.join(tempDir, 'p_kufi.html');

fs.writeFileSync(fBlue, htmlBlue);
fs.writeFileSync(fGold, htmlGold);
fs.writeFileSync(fIndigo, htmlIndigo);
fs.writeFileSync(fKufi, htmlKufi);

const outBlue = path.join(brainDir, 'ayn_flawless_blue.png');
const outGold = path.join(brainDir, 'ayn_flawless_gold.png');
const outIndigo = path.join(brainDir, 'ayn_flawless_indigo.png');
const outKufi = path.join(brainDir, 'ayn_flawless_kufi.png');

function render(htmlPath, outPath) {
  const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=512,512 "file:///${htmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd);
}

render(fBlue, outBlue);
render(fGold, outGold);
render(fIndigo, outIndigo);
render(fKufi, outKufi);

// Copy to public/logos
fs.copyFileSync(outBlue, path.join(publicLogosDir, 'ayn_flawless_blue.png'));
fs.copyFileSync(outGold, path.join(publicLogosDir, 'ayn_flawless_gold.png'));
fs.copyFileSync(outIndigo, path.join(publicLogosDir, 'ayn_flawless_indigo.png'));
fs.copyFileSync(outKufi, path.join(publicLogosDir, 'ayn_flawless_kufi.png'));

console.log('Successfully generated all flawless, unbroken Ayn logos!');
