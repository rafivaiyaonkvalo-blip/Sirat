const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';
const publicLogosDir = path.resolve(__dirname, '../public/logos');

// -------------------------------------------------------------
// Novel Concept 2: Modern Speech Bubble with Arabic Diacritics & Letter (স্পিচ বাবল ও আরবি হারকাত)
// -------------------------------------------------------------
const svgChat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="chatBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>

    <filter id="softShad" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="120" fill="url(#chatBg)"/>

  <!-- Minimal Speech Bubble (Pure Modern White) -->
  <g filter="url(#softShad)">
    <path d="M 130 140 C 130 100 165 75 220 75 L 292 75 C 347 75 382 100 382 140 L 382 250 C 382 290 347 315 292 315 L 230 315 L 160 365 L 175 315 L 160 315 C 130 315 130 290 130 250 Z" fill="#ffffff"/>

    <!-- Inside the bubble: Clean Modern Arabic Letter 'ع' in Deep Blue -->
    <path d="M 285 145 C 285 132 272 120 256 120 C 240 120 228 132 228 146 C 228 162 245 170 260 170 C 278 170 296 160 304 145" fill="none" stroke="#0369a1" stroke-width="15" stroke-linecap="round"/>
    <path d="M 252 170 C 235 182 220 202 220 224 C 220 248 238 260 260 260 C 290 260 312 236 312 208" fill="none" stroke="#0369a1" stroke-width="15" stroke-linecap="round"/>
  </g>

  <!-- Golden Floating Fathah Accent (যবর) -->
  <rect x="290" y="45" width="46" height="14" rx="7" transform="rotate(-28 290 45)" fill="url(#goldAcc)"/>

  <!-- Clean Minimalist Typography "ArbiGo" -->
  <text x="256" y="440" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="1.5">
    Arbi<tspan fill="#38bdf8">Go</tspan>
  </text>
</svg>`;

// -------------------------------------------------------------
// Novel Concept 3: The Golden Qalam & Wisdom Crescent (মিনিমালিস্ট ক্বালাম)
// -------------------------------------------------------------
const svgQalam = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="qalamBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="50%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>

    <linearGradient id="goldPure" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>

    <filter id="qalamGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#eab308" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="120" fill="url(#qalamBg)"/>

  <!-- Minimalist Geometric Pen Nib (القلم) -->
  <g filter="url(#qalamGlow)">
    <!-- Sleek Minimalist Nib -->
    <path d="M 256 100 L 320 230 C 310 270 290 300 256 320 C 222 300 202 270 192 230 Z" fill="url(#goldPure)"/>
    
    <!-- Inner Cutout Slit -->
    <line x1="256" y1="100" x2="256" y2="230" stroke="#022c22" stroke-width="5" stroke-linecap="round"/>
    <circle cx="256" cy="240" r="10" fill="#022c22"/>

    <!-- Subtle Floating Crescent Base -->
    <path d="M 160 290 C 185 350 256 370 256 370 C 256 370 327 350 352 290 C 315 330 256 345 256 345 C 256 345 197 330 160 290 Z" fill="url(#goldPure)" opacity="0.9"/>
  </g>

  <!-- Brand Typography -->
  <text x="256" y="440" font-family="'Outfit', system-ui, sans-serif" font-size="42" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="4">
    ARBI<tspan fill="url(#goldPure)">GO</tspan>
  </text>
</svg>`;

// -------------------------------------------------------------
// Novel Concept 4: The Minimalist Bilingual Monogram (A + ع Fusion)
// -------------------------------------------------------------
const svgMonogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="monoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>

    <linearGradient id="gradAyn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>

    <filter id="neonGlow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#818cf8" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="120" fill="url(#monoBg)"/>

  <!-- High-Tech Monogram: Letter 'ع' merging with stylized modern triangular 'A' -->
  <g filter="url(#neonGlow)">
    <!-- Modern Calligraphic Loop of 'ع' -->
    <path d="M 300 130 C 300 100 270 80 235 80 C 195 80 170 105 170 140 C 170 185 210 205 250 205 C 290 205 330 180 345 150" fill="none" stroke="url(#gradAyn)" stroke-width="26" stroke-linecap="round"/>
    
    <!-- Swooping Tail forming bottom of 'A' -->
    <path d="M 230 205 C 190 240 160 280 160 330 C 160 380 205 400 256 400 C 320 400 370 350 370 290" fill="none" stroke="url(#gradAyn)" stroke-width="26" stroke-linecap="round"/>
    
    <!-- Modern Crossbar dot -->
    <circle cx="270" cy="275" r="14" fill="#ffffff"/>
  </g>
</svg>`;

// Write files
fs.writeFileSync(path.join(publicLogosDir, 'novel_concept_2_chat_arabic.svg'), svgChat, 'utf8');
fs.writeFileSync(path.join(publicLogosDir, 'novel_concept_3_qalam_minimal.svg'), svgQalam, 'utf8');
fs.writeFileSync(path.join(publicLogosDir, 'novel_concept_4_bilingual_monogram.svg'), svgMonogram, 'utf8');

fs.writeFileSync(path.join(brainDir, 'novel_concept_2_chat_arabic.svg'), svgChat, 'utf8');
fs.writeFileSync(path.join(brainDir, 'novel_concept_3_qalam_minimal.svg'), svgQalam, 'utf8');
fs.writeFileSync(path.join(brainDir, 'novel_concept_4_bilingual_monogram.svg'), svgMonogram, 'utf8');

console.log('Successfully generated novel vector logos!');
