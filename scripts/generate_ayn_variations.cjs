const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';
const publicLogosDir = path.resolve(__dirname, '../public/logos');

// SVG 1: Royal Ocean Blue & Pure White Ribbon (with soft cyan inner glow)
const html1 = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:transparent; display:flex; align-items:center; justify-content:center; }
  svg { width:512px; height:512px; }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a84ff"/>
      <stop offset="40%" stop-color="#0066cc"/>
      <stop offset="100%" stop-color="#003d80"/>
    </linearGradient>
    <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="46%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="ribbonWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f0f7ff"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <linearGradient id="innerDepth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <filter id="dropShad" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#001e40" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="124" fill="url(#bg1)"/>
  <!-- Glass Diagonal Sheen -->
  <path d="M 0 0 L 512 0 L 512 180 L 0 380 Z" fill="url(#glassSheen)" rx="124"/>
  <rect width="512" height="512" rx="124" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.15"/>

  <!-- 3D Sculpted Ribbon 'ع' -->
  <g filter="url(#dropShad)">
    <!-- Inner Bevel / Core Shade of Ayn -->
    <!-- Upper Loop Inner -->
    <path d="M 285 145 C 285 185 240 205 210 215 C 235 220 280 205 315 170 C 315 125 265 95 215 95 C 160 95 130 145 130 205 C 130 285 185 365 295 365 C 335 365 375 350 400 325 C 360 335 310 335 270 320 C 190 290 170 230 170 195 C 170 155 190 125 225 125 C 265 125 285 135 285 145 Z" fill="url(#innerDepth)" opacity="0.3"/>

    <!-- Main White 3D Ribbon Body -->
    <!-- Head of Ayn -->
    <path d="M 315 170 C 315 125 265 95 215 95 C 160 95 130 145 130 205 C 130 240 145 268 170 285 C 190 250 220 225 260 218 C 240 215 220 205 210 185 C 205 172 208 152 222 140 C 238 126 265 126 282 138 C 298 150 305 168 315 170 Z" fill="url(#ribbonWhite)"/>
    <!-- Tail of Ayn -->
    <path d="M 170 285 C 190 325 235 365 305 365 C 345 365 385 348 405 320 C 360 330 315 328 275 308 C 230 285 200 255 185 225 C 175 245 170 268 170 285 Z" fill="url(#ribbonWhite)"/>

    <!-- Top Highlight Lip -->
    <path d="M 215 102 C 260 102 305 130 308 168 C 302 165 290 152 278 142 C 260 130 235 130 222 142" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <!-- Bottom Tail Swoop Highlight -->
    <path d="M 185 300 C 220 345 265 358 315 358 C 345 358 375 348 395 328" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>
</body>
</html>`;

// SVG 2: 24K Polished Gold Ribbon on Emerald Green Tile
const html2 = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:transparent; display:flex; align-items:center; justify-content:center; }
  svg { width:512px; height:512px; }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="50%" stop-color="#065f46"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
    <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="25%" stop-color="#fef08a"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
    <linearGradient id="glassSheen2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="42%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="43%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="goldShad" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#011e17" flood-opacity="0.55"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="124" fill="url(#bg2)"/>
  <path d="M 0 0 L 512 0 L 512 180 L 0 380 Z" fill="url(#glassSheen2)" rx="124"/>
  <rect width="512" height="512" rx="124" fill="none" stroke="url(#goldRibbon)" stroke-width="2.5" opacity="0.3"/>

  <g filter="url(#goldShad)">
    <!-- Inner Dark Gold Bevel -->
    <path d="M 315 170 C 315 125 265 95 215 95 C 160 95 130 145 130 205 C 130 285 185 365 295 365 C 335 365 375 350 400 325 C 360 335 310 335 270 320 C 190 290 170 230 170 195 Z" fill="url(#goldDark)" opacity="0.4"/>

    <!-- Gold Ayn Ribbon -->
    <path d="M 315 170 C 315 125 265 95 215 95 C 160 95 130 145 130 205 C 130 240 145 268 170 285 C 190 250 220 225 260 218 C 240 215 220 205 210 185 C 205 172 208 152 222 140 C 238 126 265 126 282 138 C 298 150 305 168 315 170 Z" fill="url(#goldRibbon)"/>
    <path d="M 170 285 C 190 325 235 365 305 365 C 345 365 385 348 405 320 C 360 330 315 328 275 308 C 230 285 200 255 185 225 C 175 245 170 268 170 285 Z" fill="url(#goldRibbon)"/>

    <!-- Brilliant 24k Edge Highlight -->
    <path d="M 215 102 C 260 102 305 130 308 168" fill="none" stroke="#fffbeb" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M 185 300 C 220 345 265 358 315 358 C 345 358 375 348 395 328" fill="none" stroke="#fffbeb" stroke-width="4.5" stroke-linecap="round"/>
  </g>
</svg>
</body>
</html>`;

// SVG 3: Modern Mint & Sunshine Accent (ডুওলিঙ্গো ও মডার্ন টেক ভাইব্রেন্ট)
const html3 = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:transparent; display:flex; align-items:center; justify-content:center; }
  svg { width:512px; height:512px; }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="sunDot" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <filter id="freshShad" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#022c22" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="124" fill="url(#bg3)"/>
  
  <g filter="url(#freshShad)">
    <!-- White Sculpted Ayn Ribbon -->
    <path d="M 315 170 C 315 125 265 95 215 95 C 160 95 130 145 130 205 C 130 240 145 268 170 285 C 190 250 220 225 260 218 C 240 215 220 205 210 185 C 205 172 208 152 222 140 C 238 126 265 126 282 138 C 298 150 305 168 315 170 Z" fill="#ffffff"/>
    <path d="M 170 285 C 190 325 235 365 305 365 C 345 365 385 348 405 320 C 360 330 315 328 275 308 C 230 285 200 255 185 225 C 175 245 170 268 170 285 Z" fill="#ffffff"/>
    
    <!-- Inner Sculpt Shade -->
    <path d="M 170 285 C 190 250 220 225 260 218 C 240 215 220 205 210 185 C 205 172 208 152 222 140 C 238 126 265 126 282 138 C 285 145 285 155 280 162 C 265 165 245 172 235 185 C 220 205 205 235 195 265 Z" fill="#d1fae5"/>

    <!-- Playful Sunshine Fathah Accent (Golden Accent floating above) -->
    <rect x="295" y="48" width="48" height="14" rx="7" transform="rotate(-28 295 48)" fill="url(#sunDot)"/>
  </g>
</svg>
</body>
</html>`;

// SVG 4: Midnight Dark & Electric Cyan-Violet Aurora Ribbon
const html4 = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:512px; height:512px; overflow:hidden; background:transparent; display:flex; align-items:center; justify-content:center; }
  svg { width:512px; height:512px; }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="auroraRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="45%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <filter id="neonAura" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#818cf8" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="124" fill="url(#bg4)"/>
  <rect width="512" height="512" rx="124" fill="none" stroke="#334155" stroke-width="2"/>

  <g filter="url(#neonAura)">
    <!-- Aurora Gradient Ayn Ribbon with Pure White Contour -->
    <path d="M 315 170 C 315 125 265 95 215 95 C 160 95 130 145 130 205 C 130 240 145 268 170 285 C 190 250 220 225 260 218 C 240 215 220 205 210 185 C 205 172 208 152 222 140 C 238 126 265 126 282 138 C 298 150 305 168 315 170 Z" fill="url(#auroraRibbon)"/>
    <path d="M 170 285 C 190 325 235 365 305 365 C 345 365 385 348 405 320 C 360 330 315 328 275 308 C 230 285 200 255 185 225 C 175 245 170 268 170 285 Z" fill="url(#auroraRibbon)"/>
    
    <!-- Pure White Accent Line -->
    <path d="M 215 102 C 260 102 305 130 308 168" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M 185 300 C 220 345 265 358 315 358 C 345 358 375 348 395 328" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  </g>
</svg>
</body>
</html>`;

const tempDir = path.resolve(__dirname, '../scratch');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const f1 = path.join(tempDir, 't1.html');
const f2 = path.join(tempDir, 't2.html');
const f3 = path.join(tempDir, 't3.html');
const f4 = path.join(tempDir, 't4.html');

fs.writeFileSync(f1, html1);
fs.writeFileSync(f2, html2);
fs.writeFileSync(f3, html3);
fs.writeFileSync(f4, html4);

const out1 = path.join(brainDir, 'ayn_var1_ocean.png');
const out2 = path.join(brainDir, 'ayn_var2_gold.png');
const out3 = path.join(brainDir, 'ayn_var3_mint.png');
const out4 = path.join(brainDir, 'ayn_var4_aurora.png');

console.log('Rendering high-res images with Chrome...');

function render(htmlPath, outPath) {
  const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=512,512 "file:///${htmlPath.replace(/\\\\/g, '/')}"`;
  execSync(cmd);
}

render(f1, out1);
render(f2, out2);
render(f3, out3);
render(f4, out4);

// Copy to public/logos/
fs.copyFileSync(out1, path.join(publicLogosDir, 'ayn_var1_ocean.png'));
fs.copyFileSync(out2, path.join(publicLogosDir, 'ayn_var2_gold.png'));
fs.copyFileSync(out3, path.join(publicLogosDir, 'ayn_var3_mint.png'));
fs.copyFileSync(out4, path.join(publicLogosDir, 'ayn_var4_aurora.png'));

console.log('Successfully rendered all 4 high-res Ayn monogram variations!');
