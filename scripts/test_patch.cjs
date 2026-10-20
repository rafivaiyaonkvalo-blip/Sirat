const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_design2_master.jpg');
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
    body {
      width: 1024px;
      height: 1024px;
      position: relative;
      overflow: hidden;
      background: #064e3b;
    }
    .bg-img {
      width: 1024px;
      height: 1024px;
      display: block;
    }
    /* Seamless patch directly covering the original ArbiGo text */
    .patch {
      position: absolute;
      top: 660px;
      left: 170px;
      width: 684px;
      height: 145px;
      background: radial-gradient(ellipse at center, #0e4c3d 0%, #0c4235 60%, rgba(12, 66, 53, 0.8) 80%, rgba(12, 66, 53, 0) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .title-gold {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 88px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(180deg, #FFFDF0 0%, #FFE082 25%, #FFB300 65%, #C97D10 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 179, 0, 0.35));
    }
  </style>
</head>
<body>
  <img class="bg-img" src="${imgDataUrl}" />
  <div class="patch">
    <div class="title-gold">ArbiGo</div>
  </div>
</body>
</html>
`;

const htmlPath = path.resolve(__dirname, 'test_patch.html');
fs.writeFileSync(htmlPath, html);
const outPath = path.resolve(__dirname, '../public/test_patch_gold.jpg');

execFile(
  CHROME_PATH,
  ['--headless', '--disable-gpu', `--screenshot=${outPath}`, '--window-size=1024,1024', 'file:///' + htmlPath.replace(/\\/g, '/')],
  (err) => {
    if (err) console.error(err);
    else console.log('Rendered test_patch_gold.jpg successfully!');
  }
);
