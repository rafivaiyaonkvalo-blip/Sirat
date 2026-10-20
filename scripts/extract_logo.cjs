const fs = require('fs');
const path = require('path');

const srcHtml = path.join(__dirname, '..', '..', 'noorani_40_hadith_slides', 'index.html');
const destLogoPng = path.join(__dirname, '..', 'public', 'logo.png');
const destLogoJpg = path.join(__dirname, '..', 'public', 'logo.jpg');

const content = fs.readFileSync(srcHtml, 'utf-8');
const searchStr = 'const LOGO_BASE64 = "';
const startIdx = content.indexOf(searchStr);

if (startIdx !== -1) {
  const dataStart = startIdx + searchStr.length;
  const endIdx = content.indexOf('"', dataStart);
  const dataUri = content.substring(dataStart, endIdx);
  const base64Part = dataUri.split(',')[1];
  const buffer = Buffer.from(base64Part, 'base64');
  fs.writeFileSync(destLogoPng, buffer);
  fs.writeFileSync(destLogoJpg, buffer);
  console.log(`Saved official Markazul Iman logo (${buffer.length} bytes) to public/logo.png and public/logo.jpg!`);
} else {
  console.error('LOGO_BASE64 not found in index.html');
}
