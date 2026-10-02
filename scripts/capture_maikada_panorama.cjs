// Run while `npm run dev -- --port 5173` serves the local capture page.
const { chromium } = require('playwright-core');
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..');
const output = resolve(root, 'public/maikada/panorama');
const metadataFile = resolve(root, 'assets/maikada/metadata.json');
const faces = [
  ['px', [1, 0, 0], [0, 1, 0]], ['nx', [-1, 0, 0], [0, 1, 0]],
  ['pz', [0, 0, 1], [0, 1, 0]], ['nz', [0, 0, -1], [0, 1, 0]],
  ['py', [0, 1, 0], [0, 0, -1]], ['ny', [0, -1, 0], [0, 0, 1]]
];

(async () => {
  const browser = await chromium.launchPersistentContext(resolve(root, '.tools/chrome-capture-panorama'), {
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--disable-dev-shm-usage']
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
    const captureUrl = process.env.CAPTURE_URL || 'http://localhost:5173/capture-panorama.html';
    const origin = process.env.PANORAMA_ORIGIN || '0,-3.5,2';
    const prefix = process.env.PANORAMA_PREFIX || 'pano';
    await page.goto(`${captureUrl}?origin=${encodeURIComponent(origin)}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.panoramaCaptureReady || window.panoramaCaptureError, null, { timeout: 120000 });
    const error = await page.evaluate(() => window.panoramaCaptureError);
    if (error) throw new Error(error);
    await page.waitForTimeout(2000);
    mkdirSync(output, { recursive: true });
    const metadata = JSON.parse(readFileSync(metadataFile, 'utf8'));
    const records = [];
    for (const [name, direction, up] of faces) {
      await page.evaluate(({ direction, up }) => window.setPanoramaDirection(direction, up), { direction, up });
      await page.waitForTimeout(1500);
      const bytes = await page.locator('#scene canvas').screenshot({ type: 'jpeg', quality: 92 });
      const file = resolve(output, `${prefix}-${name}.jpg`);
      writeFileSync(file, bytes);
      records.push({ path: `../../public/maikada/panorama/${prefix}-${name}.jpg`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
      console.log(`Captured ${name}: ${bytes.length} bytes`);
    }
    metadata.web[prefix === 'pano' ? 'panorama' : 'loungePanorama'] = records;
    writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
