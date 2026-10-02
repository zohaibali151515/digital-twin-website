// Run while `npm run dev -- --port 5173` serves the local capture page.
const { chromium } = require('playwright-core');
const { readFileSync, writeFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..');
const output = resolve(root, 'public/maikada-hero.webp');
const metadataFile = resolve(root, 'assets/maikada/metadata.json');

(async () => {
  const browser = await chromium.launchPersistentContext(resolve(root, '.tools/chrome-capture-hero'), {
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--disable-dev-shm-usage']
  });
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1 });
    const captureUrl = process.env.CAPTURE_URL || 'http://localhost:5173/capture-panorama.html';
    await page.goto(`${captureUrl}?origin=1,0,2&width=800&height=1000`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.panoramaCaptureReady || window.panoramaCaptureError, null, { timeout: 120000 });
    const error = await page.evaluate(() => window.panoramaCaptureError);
    if (error) throw new Error(error);
    await page.evaluate(() => window.setPanoramaDirection([0.7, 0, 0.7], [0, 1, 0]));
    await page.waitForTimeout(1500);
    const dataUrl = await page.locator('#scene canvas').evaluate(canvas => canvas.toDataURL('image/webp', 0.86));
    if (!dataUrl.startsWith('data:image/webp;base64,')) throw new Error('WebP capture failed');
    const bytes = Buffer.from(dataUrl.slice('data:image/webp;base64,'.length), 'base64');
    writeFileSync(output, bytes);
    const metadata = JSON.parse(readFileSync(metadataFile, 'utf8'));
    metadata.web.heroImage = {
      path: '../../public/maikada-hero.webp',
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex')
    };
    writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
    console.log(`Captured Maikada hero: ${bytes.length} bytes`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
