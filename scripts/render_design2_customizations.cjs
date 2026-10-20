const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MASTER_IMG = path.resolve(__dirname, '../public/arbigo_design2_master.jpg');
const ARTIFACT_DIR = 'C:\\Users\\Abdul Hakim\\.gemini\\antigravity\brain\\3cc0a983-6c10-4926-a750-c9e422e62b28';

const imgBase64 = fs.readFileSync(MASTER_IMG).toString('base64');
const imgDataUrl = `data:image/jpeg;base64,${imgBase64}`;

const variations = [
  {
    id: 'demo_custom_gold',
    name: 'কাস্টম ১: লাক্সারি থ্রি-ডি গোল্ড ফন্ট (Luxury 3D Gold Gradient)',
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800;900&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; position: relative; overflow: hidden; background: #064e3b; }
          .bg-img { width: 1024px; height: 1024px; display: block; }
          .patch {
            position: absolute;
            top: 650px;
            left: 160px;
            width: 704px;
            height: 195px;
            background: radial-gradient(ellipse at center, #0e4c3d 0%, #0c4235 65%, rgba(12, 66, 53, 0.96) 82%, rgba(12, 66, 53, 0) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .title {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 88px;
            font-weight: 900;
            letter-spacing: -0.5px;
            background: linear-gradient(180deg, #FFFFFF 0%, #FFF3B0 25%, #FFD700 65%, #C68A14 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 20px rgba(255, 179, 0, 0.4));
          }
        </style>
      </head>
      <body>
        <img class="bg-img" src="${imgDataUrl}" />
        <div class="patch"><div class="title">ArbiGo</div></div>
      </body>
      </html>
    `
  },
  {
    id: 'demo_custom_dualtone',
    name: 'কাস্টম ২: ডুয়াল-টোন আধুনিক ফন্ট + বাংলা সাবটাইটেল (Dual-tone White & Amber + এসো আরবী শিখি)',
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; position: relative; overflow: hidden; background: #064e3b; }
          .bg-img { width: 1024px; height: 1024px; display: block; }
          .patch {
            position: absolute;
            top: 645px;
            left: 150px;
            width: 724px;
            height: 205px;
            background: radial-gradient(ellipse at center, #0e4c3d 0%, #0c4235 65%, rgba(12, 66, 53, 0.96) 82%, rgba(12, 66, 53, 0) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
          }
          .title {
            font-family: 'Outfit', sans-serif;
            font-size: 82px;
            font-weight: 900;
            display: flex;
            align-items: center;
            filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85));
          }
          .title-arbi { color: #FFFFFF; }
          .title-go {
            background: linear-gradient(180deg, #FFE57F 0%, #FFB300 70%, #E68A00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-left: 2px;
          }
          .subtitle {
            font-family: 'Hind Siliguri', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #A7F3D0;
            letter-spacing: 2px;
            display: flex;
            align-items: center;
            gap: 8px;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.7));
          }
          .dot {
            width: 6px;
            height: 6px;
            background: #FFB300;
            border-radius: 50%;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <img class="bg-img" src="${imgDataUrl}" />
        <div class="patch">
          <div class="title"><span class="title-arbi">Arbi</span><span class="title-go">Go</span></div>
          <div class="subtitle"><span class="dot"></span><span>এসো আরবী শিখি</span><span class="dot"></span></div>
        </div>
      </body>
      </html>
    `
  },
  {
    id: 'demo_custom_serif_gold',
    name: 'কাস্টম ৩: রয়্যাল সেরিফ গোল্ড + মারকাযুল ঈমান ব্যাজ (Royal Serif Gold & Badge)',
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@800;900&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; position: relative; overflow: hidden; background: #064e3b; }
          .bg-img { width: 1024px; height: 1024px; display: block; }
          .patch {
            position: absolute;
            top: 645px;
            left: 150px;
            width: 724px;
            height: 205px;
            background: radial-gradient(ellipse at center, #0e4c3d 0%, #0c4235 65%, rgba(12, 66, 53, 0.96) 82%, rgba(12, 66, 53, 0) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }
          .title {
            font-family: 'Cinzel', serif;
            font-size: 74px;
            font-weight: 900;
            letter-spacing: 2px;
            background: linear-gradient(180deg, #FFFFFF 0%, #FFF3B0 30%, #FFD700 70%, #C68A14 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.85));
          }
          .badge {
            background: rgba(4, 120, 87, 0.65);
            border: 1px solid rgba(255, 215, 0, 0.55);
            padding: 3px 16px;
            border-radius: 16px;
            font-family: 'Hind Siliguri', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #FEF3C7;
            letter-spacing: 1px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          }
        </style>
      </head>
      <body>
        <img class="bg-img" src="${imgDataUrl}" />
        <div class="patch">
          <div class="title">ARBIGO</div>
          <div class="badge">মারকাযুল ঈমান</div>
        </div>
      </body>
      </html>
    `
  },
  {
    id: 'demo_custom_purewhite_glow',
    name: 'কাস্টম ৪: প্রিমিয়াম হোয়াইট গ্লো ও গোল্ডেন ফ্রেম (Crisp White Glow with Luxury Border)',
    renderHtml: () => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@800;900&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; position: relative; overflow: hidden; background: #064e3b; }
          .bg-img { width: 1024px; height: 1024px; display: block; }
          .gold-frame {
            position: absolute;
            top: 104px;
            left: 104px;
            width: 816px;
            height: 816px;
            border-radius: 175px;
            border: 4px solid rgba(255, 215, 0, 0.55);
            box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.25), 0 0 25px rgba(0, 0, 0, 0.5);
            pointer-events: none;
          }
          .patch {
            position: absolute;
            top: 650px;
            left: 160px;
            width: 704px;
            height: 195px;
            background: radial-gradient(ellipse at center, #0e4c3d 0%, #0c4235 65%, rgba(12, 66, 53, 0.96) 82%, rgba(12, 66, 53, 0) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .title {
            font-family: 'Poppins', sans-serif;
            font-size: 88px;
            font-weight: 900;
            color: #FFFFFF;
            letter-spacing: -0.5px;
            filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.45));
          }
        </style>
      </head>
      <body>
        <img class="bg-img" src="${imgDataUrl}" />
        <div class="gold-frame"></div>
        <div class="patch"><div class="title">ArbiGo</div></div>
      </body>
      </html>
    `
  }
];

async function run() {
  for (const v of variations) {
    const htmlFile = path.resolve(__dirname, `temp_${v.id}.html`);
    const outFileProject = path.resolve(__dirname, `../public/${v.id}.jpg`);
    const outFileArtifact = path.resolve(ARTIFACT_DIR, `${v.id}.jpg`);

    fs.writeFileSync(htmlFile, v.renderHtml(), 'utf-8');
    const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');

    console.log(`Rendering ${v.name}...`);
    await new Promise((resolve, reject) => {
      execFile(
        CHROME_PATH,
        [
          '--headless',
          '--disable-gpu',
          `--screenshot=${outFileProject}`,
          '--window-size=1024,1024',
          fileUrl
        ],
        (err) => {
          if (err) return reject(err);
          try { fs.copyFileSync(outFileProject, outFileArtifact); } catch(e) {}
          resolve();
        }
      );
    });

    try { fs.unlinkSync(htmlFile); } catch(e) {}
    console.log(`✓ Finished ${v.id}`);
  }
  console.log('All 4 refined customizations successfully rendered!');
}

run().catch(console.error);
