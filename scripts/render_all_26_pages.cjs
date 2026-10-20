const fs = require('fs');
const path = require('path');
const { PDFParse } = require(path.join(__dirname, '..', '..', 'pdf_quiz', 'node_modules', 'pdf-parse'));

async function renderAll() {
  const pdfPath = path.join(__dirname, '..', '..', 'pdf_quiz', 'new_input.pdf');
  const targetDir = path.join(__dirname, '..', 'public', 'pages');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log('Loading PDF from:', pdfPath);
  const p = new PDFParse({ data: fs.readFileSync(pdfPath) });
  await p.load();

  console.log('Rendering all 26 pages with high quality...');
  for (let i = 1; i <= 26; i++) {
    const shot = await p.getScreenshot({ partial: [i], scale: 2.0 });
    if (shot.pages && shot.pages.length > 0) {
      const pageData = shot.pages[0];
      const targetFile = path.join(targetDir, `page_${i}.png`);
      fs.writeFileSync(targetFile, Buffer.from(pageData.data));
      console.log(`Rendered page ${i}/26 -> ${targetFile} (${pageData.data.length} bytes, w: ${pageData.width}, h: ${pageData.height})`);
    } else {
      console.error(`Failed to render page ${i}`);
    }
  }

  console.log('Successfully rendered all 26 unique high-res pages!');
}

renderAll().catch(err => {
  console.error('Fatal rendering error:', err);
  process.exit(1);
});
