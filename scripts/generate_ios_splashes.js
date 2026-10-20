import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const splashDir = path.resolve('public', 'splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
}

// CRC-32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function createSolidPng(width, height, hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdrData);

  const lineSize = 1 + width * 3;
  const singleLine = Buffer.alloc(lineSize);
  singleLine[0] = 0; // Filter: None
  for (let x = 0; x < width; x++) {
    const offset = 1 + x * 3;
    singleLine[offset] = r;
    singleLine[offset + 1] = g;
    singleLine[offset + 2] = b;
  }

  const rawData = Buffer.alloc(lineSize * height);
  for (let y = 0; y < height; y++) {
    singleLine.copy(rawData, y * lineSize);
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const devices = [
  // iPhone 16 Pro Max, 15 Pro Max, 14 Pro Max (430x932 @3x)
  { name: '430x932-3x', w: 1290, h: 2796 },
  // iPhone 16 Pro (402x874 @3x)
  { name: '402x874-3x', w: 1206, h: 2622 },
  // iPhone 16, 15 Pro, 15, 14 Pro (393x852 @3x)
  { name: '393x852-3x', w: 1179, h: 2556 },
  // iPhone 16 Plus, 15 Plus, 14 Plus, 13 Pro Max, 12 Pro Max (428x926 @3x)
  { name: '428x926-3x', w: 1284, h: 2778 },
  // iPhone 14, 13, 13 Pro, 12, 12 Pro (390x844 @3x)
  { name: '390x844-3x', w: 1170, h: 2532 },
  // iPhone 13 mini, 12 mini, 11 Pro, XS, X (375x812 @3x)
  { name: '375x812-3x', w: 1125, h: 2436 },
  // iPhone 11 Pro Max, XS Max (414x896 @3x)
  { name: '414x896-3x', w: 1242, h: 2688 },
  // iPhone 11, XR (414x896 @2x)
  { name: '414x896-2x', w: 828, h: 1792 },
  // iPhone 8 Plus, 7 Plus, 6s Plus (414x736 @3x)
  { name: '414x736-3x', w: 1242, h: 2208 },
  // iPhone SE 2/3, 8, 7, 6s (375x667 @2x)
  { name: '375x667-2x', w: 750, h: 1334 },
  // iPad Pro 12.9" / 13" (1024x1366 @2x)
  { name: '1024x1366-2x', w: 2048, h: 2732 },
  // iPad Pro 11" / Air (834x1194 @2x)
  { name: '834x1194-2x', w: 1668, h: 2388 },
  // iPad 10.2" / 10.9" (810x1080 @2x)
  { name: '810x1080-2x', w: 1620, h: 2160 },
  // Default fallback
  { name: 'default', w: 1290, h: 2796 }
];

const DARK_COLOR = '#0A0D12';
const LIGHT_COLOR = '#FFFFFF';

console.log('Generating iOS startup images in public/splash/...');

for (const d of devices) {
  const darkBuf = createSolidPng(d.w, d.h, DARK_COLOR);
  const darkPath = path.join(splashDir, `splash-dark-${d.name}.png`);
  fs.writeFileSync(darkPath, darkBuf);

  const lightBuf = createSolidPng(d.w, d.h, LIGHT_COLOR);
  const lightPath = path.join(splashDir, `splash-light-${d.name}.png`);
  fs.writeFileSync(lightPath, lightBuf);

  console.log(`✓ Generated ${d.name} (${d.w}x${d.h}) - Dark: ${darkBuf.length}b, Light: ${lightBuf.length}b`);
}

console.log('All iOS startup splash images generated successfully!');
