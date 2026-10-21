const https = require('https');
const fs = require('fs');

const url = 'https://www.pinterest.com/pin/852869248233360992/';
https.get(url, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scripts/pin_dump.html', data);
    const ogImgMatch = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);
    const titleMatch = data.match(/property="og:title"\s+content="([^"]+)"/i);
    const descMatch = data.match(/property="og:description"\s+content="([^"]+)"/i);
    console.log('OG_IMAGE:', ogImgMatch ? ogImgMatch[1] : 'not found');
    console.log('OG_TITLE:', titleMatch ? titleMatch[1] : 'not found');
    console.log('OG_DESC:', descMatch ? descMatch[1] : 'not found');
  });
});
