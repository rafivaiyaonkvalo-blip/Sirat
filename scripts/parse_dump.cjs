const fs = require('fs');
const txt = fs.readFileSync('scripts/pin_dump.html', 'utf8');
console.log('Length:', txt.length);
const titles = txt.match(/<title>([^<]+)<\/title>/i);
console.log('Title tag:', titles ? titles[1] : 'none');
const urls = txt.match(/https:\/\/[^"']+\.(?:jpg|png|webp|gif)/gi);
console.log('Images:', urls ? [...new Set(urls)].slice(0, 10) : 'none');
const jsonMatches = txt.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi);
console.log('JSON scripts found:', jsonMatches ? jsonMatches.length : 0);
