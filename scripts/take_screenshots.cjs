const { execFileSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const TEMP_PROFILE = path.join(ROOT_DIR, '.chrome-temp-profile');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'release', 'playstore-assets', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function waitForServer(port) {
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject();
        });
        req.on('error', reject);
        req.setTimeout(500, () => req.destroy());
      });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('Server timed out');
}

function capture(url, outputFile) {
  console.log('Capturing:', url, '->', outputFile);
  execFileSync(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--virtual-time-budget=2000',
    '--window-size=1080,1920',
    `--user-data-dir=${TEMP_PROFILE}`,
    `--screenshot=${outputFile}`,
    url
  ]);
  console.log('✓ Captured:', outputFile, fs.statSync(outputFile).size, 'bytes');
}

async function main() {
  console.log('Starting local preview server...');
  const server = spawn('cmd', ['/c', 'npx vite preview --port 4173'], {
    cwd: ROOT_DIR,
    stdio: 'ignore'
  });

  try {
    await waitForServer(4173);
    console.log('Preview server ready at http://localhost:4173');

    // 1. Lessons Roadmap
    capture('http://localhost:4173/?nosplash=1&tab=lessons', path.join(SCREENSHOTS_DIR, '01_lessons_roadmap.png'));

    // 2. Vocabulary Explorer
    capture('http://localhost:4173/?nosplash=1&tab=vocab', path.join(SCREENSHOTS_DIR, '02_vocabulary_builder.png'));

    // 3. Flashcards
    capture('http://localhost:4173/?nosplash=1&tab=flashcards', path.join(SCREENSHOTS_DIR, '03_interactive_flashcards.png'));

    // 4. Original Books & PDF Reader
    capture('http://localhost:4173/?nosplash=1&tab=book', path.join(SCREENSHOTS_DIR, '04_original_book_reader.png'));

  } finally {
    server.kill();
    try {
      execFileSync('cmd', ['/c', 'taskkill /F /IM node.exe /FI "WINDOWTITLE eq vite*"'], { stdio: 'ignore' });
    } catch {}
    if (fs.existsSync(TEMP_PROFILE)) {
      try {
        fs.rmSync(TEMP_PROFILE, { recursive: true, force: true });
      } catch {}
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
