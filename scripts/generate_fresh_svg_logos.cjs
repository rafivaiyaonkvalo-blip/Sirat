const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';
const publicLogosDir = path.resolve(__dirname, '../public/logos');

if (!fs.existsSync(publicLogosDir)) {
  fs.mkdirSync(publicLogosDir, { recursive: true });
}

// -------------------------------------------------------------
// Concept 1: Radiant Rehal & Noor (নূর ও রেহাল)
// -------------------------------------------------------------
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b192c"/>
      <stop offset="40%" stop-color="#0a2540"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>

    <!-- Golden Gradients -->
    <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="35%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <linearGradient id="goldLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect width="512" height="512" rx="118" fill="url(#bg1)"/>

  <!-- Subtle Outer Border Accent -->
  <rect x="6" y="6" width="500" height="500" rx="112" fill="none" stroke="url(#gold1)" stroke-width="2.5" opacity="0.35"/>

  <!-- Ambient Radiant Noor Behind Book -->
  <circle cx="256" cy="210" r="140" fill="#f59e0b" opacity="0.18" filter="url(#glow1)"/>
  <circle cx="256" cy="200" r="70" fill="#ffffff" opacity="0.12" filter="url(#glow1)"/>

  <!-- Geometric Radiant Beams -->
  <g opacity="0.15" stroke="url(#gold1)" stroke-width="1.5">
    <line x1="256" y1="90" x2="256" y2="130" stroke-dasharray="3,3"/>
    <line x1="170" y1="130" x2="200" y2="160" stroke-dasharray="3,3"/>
    <line x1="342" y1="130" x2="312" y2="160" stroke-dasharray="3,3"/>
    <line x1="130" y1="210" x2="170" y2="210" stroke-dasharray="3,3"/>
    <line x1="382" y1="210" x2="342" y2="210" stroke-dasharray="3,3"/>
  </g>

  <!-- Rehal / Wooden Stand (Lower Intersecting Curves) -->
  <g filter="url(#subtleShadow)">
    <!-- Stand Left Leg -->
    <path d="M 160 300 Q 256 325 352 300 L 320 340 Q 256 365 192 340 Z" fill="#b45309" opacity="0.9"/>
    <path d="M 180 310 Q 256 335 332 310 L 305 348 Q 256 368 207 348 Z" fill="#78350f"/>
    <!-- Center Rehal Knot -->
    <circle cx="256" cy="335" r="7" fill="url(#goldLight)"/>
  </g>

  <!-- Open Book Pages (Layered Floating 3D Vector) -->
  <g filter="url(#subtleShadow)">
    <!-- Left Back Page -->
    <path d="M 256 265 Q 190 278 120 248 Q 125 185 185 178 Q 225 174 256 188 Z" fill="#1e3a8a" opacity="0.4"/>
    <!-- Right Back Page -->
    <path d="M 256 265 Q 322 278 392 248 Q 387 185 327 178 Q 287 174 256 188 Z" fill="#1e3a8a" opacity="0.4"/>

    <!-- Left Main Pure Page -->
    <path d="M 256 260 C 205 272 155 258 118 240 C 122 178 178 168 226 166 C 240 166 250 172 256 178 Z" fill="#f8fafc"/>
    <path d="M 256 260 C 215 270 175 258 140 242 C 143 195 185 182 226 180 C 240 180 250 183 256 188 Z" fill="#f1f5f9"/>

    <!-- Right Main Pure Page -->
    <path d="M 256 260 C 307 272 357 258 394 240 C 390 178 334 168 286 166 C 272 166 262 172 256 178 Z" fill="#ffffff"/>
    <path d="M 256 260 C 297 270 337 258 372 242 C 369 195 327 182 286 180 C 272 180 262 183 256 188 Z" fill="#f8fafc"/>

    <!-- Gold Edge Trim on Pages -->
    <path d="M 118 240 C 122 178 178 168 226 166" fill="none" stroke="url(#gold1)" stroke-width="4" stroke-linecap="round"/>
    <path d="M 394 240 C 390 178 334 168 286 166" fill="none" stroke="url(#gold1)" stroke-width="4" stroke-linecap="round"/>

    <!-- Spine Centerfold Glow Line -->
    <line x1="256" y1="178" x2="256" y2="262" stroke="url(#gold1)" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Luminous Arabic Script Floating in Noor (ع - Arabi Calligraphic Motif) -->
  <g filter="url(#glow1)">
    <!-- Stylized Ayn Calligraphy -->
    <path d="M 276 136 C 276 122 264 112 250 112 C 236 112 226 122 226 134 C 226 148 242 156 256 156 C 272 156 288 148 294 134" fill="none" stroke="url(#goldLight)" stroke-width="6.5" stroke-linecap="round"/>
    <!-- Lower Calligraphic Swoop -->
    <path d="M 248 155 C 234 166 220 184 220 202 C 220 220 236 230 256 230 C 282 230 302 210 302 186" fill="none" stroke="url(#goldLight)" stroke-width="6.5" stroke-linecap="round"/>
    <!-- Shaddah / Tashkeel Accent -->
    <path d="M 242 98 Q 248 104 254 98 Q 260 104 266 98" fill="none" stroke="url(#goldLight)" stroke-width="3.5" stroke-linecap="round"/>
  </g>

  <!-- Brand Typography -->
  <!-- "ArbiGo" -->
  <text x="256" y="415" font-family="'Plus Jakarta Sans', 'Outfit', 'Segoe UI', system-ui, sans-serif" font-size="46" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="2">
    Arbi<tspan fill="url(#gold1)">Go</tspan>
  </text>

  <!-- Subtitle: "মারকাযুল ঈমান" -->
  <text x="256" y="452" font-family="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="middle" fill="#94a3b8" letter-spacing="3">
    মারকাযুল ঈমান • এসো আরবী শিখি
  </text>
</svg>`;

// -------------------------------------------------------------
// Concept 2: The Sacred Pen & Learning Crescent (ক্বালাম ও ক্রিসেন্ট)
// -------------------------------------------------------------
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Royal Emerald & Forest) -->
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="50%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>

    <!-- Brilliant 24k Gold Gradient -->
    <linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="25%" stop-color="#fde047"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>

    <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>

    <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#011c15" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect width="512" height="512" rx="118" fill="url(#bg2)"/>
  <rect x="8" y="8" width="496" height="496" rx="110" fill="none" stroke="url(#goldRim)" stroke-width="2.5" opacity="0.4"/>

  <!-- Radial Halo Glow -->
  <circle cx="256" cy="205" r="130" fill="#eab308" opacity="0.14" filter="url(#glow2)"/>

  <!-- Golden Crescent Base (The Horizon of Knowledge) -->
  <g filter="url(#shadow2)">
    <path d="M 120 260 C 130 340 210 375 256 375 C 302 375 382 340 392 260 C 360 320 295 345 256 345 C 217 345 152 320 120 260 Z" fill="url(#gold2)"/>
  </g>

  <!-- Open Book Wings Emerging from Base -->
  <g filter="url(#shadow2)">
    <!-- Left Wing/Page -->
    <path d="M 256 300 C 200 290 145 260 115 220 C 145 180 210 200 256 225 Z" fill="#ffffff" opacity="0.95"/>
    <path d="M 256 300 C 205 288 160 262 135 230 C 160 195 215 210 256 230 Z" fill="#ecfdf5"/>

    <!-- Right Wing/Page -->
    <path d="M 256 300 C 312 290 367 260 397 220 C 367 180 302 200 256 225 Z" fill="#ffffff" opacity="0.95"/>
    <path d="M 256 300 C 307 288 352 262 377 230 C 352 195 297 210 256 230 Z" fill="#ecfdf5"/>
  </g>

  <!-- The Sacred Pen Nib (Al-Qalam - القلم) Centered & Piercing Skyward -->
  <g filter="url(#shadow2)">
    <!-- Nib Body (Gold) -->
    <path d="M 256 100 L 290 190 C 285 240 270 280 256 310 C 242 280 227 240 222 190 Z" fill="url(#gold2)"/>
    
    <!-- Inner Nib Contrast (Emerald Shadow) -->
    <path d="M 256 100 L 256 240" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
    
    <!-- Nib Breather Hole (Circle) -->
    <circle cx="256" cy="210" r="9" fill="#064e3b" stroke="url(#gold2)" stroke-width="2.5"/>

    <!-- Nib Slit from hole to tip -->
    <line x1="256" y1="100" x2="256" y2="201" stroke="#064e3b" stroke-width="2.5"/>
  </g>

  <!-- Radiant Star of Wisdom At The Pen Tip -->
  <g filter="url(#glow2)">
    <circle cx="256" cy="98" r="8" fill="#ffffff"/>
    <polygon points="256,80 260,94 274,98 260,102 256,116 252,102 238,98 252,94" fill="url(#gold2)"/>
  </g>

  <!-- Arabic Script Badge: ن وَالْقَلَمِ -->
  <text x="256" y="338" font-family="'Amiri', 'Scheherazade New', serif" font-size="20" font-weight="700" text-anchor="middle" fill="url(#gold2)">
    ن وَالْقَلَمِ
  </text>

  <!-- Brand Typography -->
  <text x="256" y="420" font-family="'Cinzel', 'Plus Jakarta Sans', system-ui, sans-serif" font-size="44" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="3">
    ARBI<tspan fill="url(#gold2)">GO</tspan>
  </text>
  <text x="256" y="452" font-family="'Hind Siliguri', system-ui, sans-serif" font-size="15" font-weight="600" text-anchor="middle" fill="#a7f3d0" letter-spacing="2">
    মারকাযুল ঈমান • ভাষা ও জ্ঞান
  </text>
</svg>`;

// -------------------------------------------------------------
// Concept 3: Modern Tech Speech & Book (মডার্ন লার্নিং বাবল ও কিতাব)
// -------------------------------------------------------------
const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Vibrant Emerald to Modern Cyan) -->
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>

    <!-- Warm Sunshine Accent -->
    <linearGradient id="sun3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>

    <filter id="softShadow3" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#064e3b" flood-opacity="0.5"/>
    </filter>

    <filter id="popGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect width="512" height="512" rx="118" fill="url(#bg3)"/>

  <!-- Subtle Playful Geometric Circles in Background -->
  <circle cx="90" cy="90" r="140" fill="#ffffff" opacity="0.06"/>
  <circle cx="440" cy="420" r="180" fill="#0891b2" opacity="0.2"/>

  <!-- Main Unified Shape: Chat Speech Bubble Fused with Open Book -->
  <g filter="url(#softShadow3)">
    <!-- Main Floating White Container -->
    <path d="M 140 140 C 140 120 160 100 200 100 L 312 100 C 352 100 372 120 372 140 L 372 260 C 372 280 352 300 312 300 L 270 300 L 220 340 L 230 300 L 200 300 C 160 300 140 280 140 260 Z" fill="#ffffff"/>

    <!-- Inner Open Book Illustration inside the bubble -->
    <!-- Left Page (Emerald Tint) -->
    <path d="M 256 250 C 215 260 180 248 165 235 C 168 185 205 175 245 172 C 252 172 256 176 256 182 Z" fill="#d1fae5"/>
    <line x1="185" y1="195" x2="235" y2="192" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
    <line x1="182" y1="212" x2="230" y2="209" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>

    <!-- Right Page (Vibrant Cyan Tint) -->
    <path d="M 256 250 C 297 260 332 248 347 235 C 344 185 307 175 267 172 C 260 172 256 176 256 182 Z" fill="#cffafe"/>
    <line x1="277" y1="192" x2="327" y2="195" stroke="#0891b2" stroke-width="4" stroke-linecap="round"/>
    <line x1="282" y1="209" x2="330" y2="212" stroke="#0891b2" stroke-width="4" stroke-linecap="round"/>

    <!-- Center Fold -->
    <line x1="256" y1="180" x2="256" y2="252" stroke="#059669" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Playful Arabic Floating Diacritics (Fathah / Dammah / Tashkeel) -->
  <g filter="url(#popGlow)">
    <!-- Golden Fathah (Zabor) Accent Floating Above Bubble -->
    <rect x="270" y="65" width="45" height="12" rx="6" transform="rotate(-25 270 65)" fill="url(#sun3)"/>
    <!-- Small Dammah (Pesh) Accent -->
    <circle cx="340" cy="85" r="10" fill="url(#sun3)"/>
    <path d="M 345 85 C 345 98 335 106 325 102" fill="none" stroke="url(#sun3)" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- App Brand Typography -->
  <!-- "ArbiGo" with Friendly Rounded Type -->
  <text x="256" y="418" font-family="'Fredoka', 'Quicksand', 'Plus Jakarta Sans', system-ui, sans-serif" font-size="50" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="1">
    Arbi<tspan fill="#fef08a">Go</tspan>
  </text>

  <!-- Subtitle Tagline -->
  <text x="256" y="456" font-family="'Hind Siliguri', system-ui, sans-serif" font-size="16" font-weight="700" text-anchor="middle" fill="#e0f2fe" letter-spacing="2">
    সহজে আরবী শিখি ও বলি
  </text>
</svg>`;

// -------------------------------------------------------------
// Concept 4: The Iconic 'ض' & Book Monogram (লিসানুল আরবী / লুগাতুদ দোয়াদ)
// -------------------------------------------------------------
const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Deep Oceanic Midnight Navy to Teal) -->
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>

    <!-- Luxury Gold to Copper Gradient -->
    <linearGradient id="gold4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <!-- Emerald Cyan Ribbon Gradient -->
    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>

    <filter id="shadow4" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.55"/>
    </filter>

    <filter id="glow4" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect width="512" height="512" rx="118" fill="url(#bg4)"/>
  
  <!-- Sleek Geometric Inner Frame -->
  <rect x="12" y="12" width="488" height="488" rx="106" fill="none" stroke="#334155" stroke-width="2" opacity="0.6"/>

  <!-- Ambient Glow Behind Monogram -->
  <circle cx="256" cy="210" r="130" fill="#10b981" opacity="0.12" filter="url(#glow4)"/>

  <!-- Master Monogram: Fusion of Arabic Letter 'ض' and Modern Book Pages -->
  <g filter="url(#shadow4)">
    <!-- Base Curved Ribbon of the Letter 'ض' (forms a sleek swooping book cradle) -->
    <path d="M 125 210 C 125 155 180 140 240 140 C 310 140 370 170 370 215 C 370 270 310 285 240 285 C 190 285 155 270 140 250" fill="none" stroke="url(#ribbonGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Extending Tail of 'ض' gracefully swooping beneath like an open page bookmark -->
    <path d="M 360 215 C 360 295 285 345 200 345 C 150 345 110 325 90 295" fill="none" stroke="url(#ribbonGrad)" stroke-width="24" stroke-linecap="round"/>

    <!-- Inner Book Silhouette within the eye of 'ض' -->
    <path d="M 240 245 C 210 252 185 244 175 235 C 178 200 205 192 235 190" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.95"/>
    <path d="M 240 245 C 270 252 295 244 305 235 C 302 200 275 192 245 190" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.95"/>
    <line x1="240" y1="190" x2="240" y2="245" stroke="url(#gold4)" stroke-width="5" stroke-linecap="round"/>

    <!-- Golden Radiant Nuqta (Dot of 'ض') -->
    <circle cx="330" cy="118" r="22" fill="url(#gold4)" filter="url(#glow4)"/>
    <circle cx="330" cy="118" r="10" fill="#ffffff" opacity="0.8"/>
  </g>

  <!-- Brand Typography -->
  <!-- "ArbiGo" in Ultra Clean Apple-Style Geometric Type -->
  <text x="256" y="420" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-size="46" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="3">
    ARBI<tspan fill="url(#gold4)">GO</tspan>
  </text>
  
  <text x="256" y="454" font-family="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" font-size="15" font-weight="600" text-anchor="middle" fill="#94a3b8" letter-spacing="3">
    মারকাযুল ঈমান • لُغَةُ الضَّادِ
  </text>
</svg>`;

// Write to public/logos/
fs.writeFileSync(path.join(publicLogosDir, 'concept_1_rehal_nur.svg'), svg1, 'utf8');
fs.writeFileSync(path.join(publicLogosDir, 'concept_2_qalam_crescent.svg'), svg2, 'utf8');
fs.writeFileSync(path.join(publicLogosDir, 'concept_3_duo_chat_book.svg'), svg3, 'utf8');
fs.writeFileSync(path.join(publicLogosDir, 'concept_4_lisan_daad.svg'), svg4, 'utf8');

// Also write copies to brain artifacts directory so user/markdown can reference them
fs.writeFileSync(path.join(brainDir, 'concept_1_rehal_nur.svg'), svg1, 'utf8');
fs.writeFileSync(path.join(brainDir, 'concept_2_qalam_crescent.svg'), svg2, 'utf8');
fs.writeFileSync(path.join(brainDir, 'concept_3_duo_chat_book.svg'), svg3, 'utf8');
fs.writeFileSync(path.join(brainDir, 'concept_4_lisan_daad.svg'), svg4, 'utf8');

console.log('Successfully generated 4 high-end SVG vector logos!');
