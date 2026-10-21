const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_blue_deep_ocean_master.jpg');
const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const iconSizes = [
  { file: 'logo.png', size: 512 },
  { file: 'logo-512.png', size: 512 },
  { file: 'logo-192.png', size: 192 },
  { file: 'favicon.png', size: 64 },
  { file: 'playstore-icon.png', size: 512 }
];

function generateHtml(size) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
    img { width: 100%; height: 100%; display: block; object-fit: cover; }
  </style>
</head>
<body>
  <img src="${imgDataUrl}" />
</body>
</html>
  `;
}

async function run() {
  // First, directly copy full resolution master as logo.jpg
  fs.copyFileSync(MASTER_IMG, path.resolve(__dirname, '../public/logo.jpg'));
  console.log('✓ Copied master to public/logo.jpg');

  for (const item of iconSizes) {
    const htmlFile = path.resolve(__dirname, `temp_icon_${item.size}.html`);
    const outFile = path.resolve(__dirname, `../public/${item.file}`);
    fs.writeFileSync(htmlFile, generateHtml(item.size), 'utf-8');
    const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

    console.log(`Generating ${item.file} (${item.size}x${item.size})...`);
    await new Promise((resolve, reject) => {
      execFile(
        CHROME_PATH,
        [
          '--headless',
          '--disable-gpu',
          `--screenshot=${outFile}`,
          `--window-size=${item.size},${item.size}`,
          '--default-background-color=00000000',
          fileUrl
        ],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    try { fs.unlinkSync(htmlFile); } catch(e) {}
    console.log(`✓ Created public/${item.file}`);
  }

  console.log('All official ArbiGo app icons generated successfully!');
}

run().catch(console.error);
