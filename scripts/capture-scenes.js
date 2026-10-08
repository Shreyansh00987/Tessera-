const puppeteer = require('puppeteer');
const path = require('path');

const scenes = [
  { id: 'scene_1', url: 'http://localhost:3000/', wait: 2000, scroll: 0 },
  { id: 'scene_2', url: 'http://localhost:3000/', wait: 2500, scroll: 250 },
  { id: 'scene_3', url: 'http://localhost:3000/marketplace', wait: 2000, scroll: 150 },
  { id: 'scene_4', url: 'http://localhost:3000/curvelab', wait: 2000, scroll: 100 },
  { id: 'scene_5', url: 'http://localhost:3000/launch', wait: 2000, scroll: 100 },
  { id: 'scene_6', url: 'http://localhost:3000/replay', wait: 2000, scroll: 150 },
  { id: 'scene_7', url: 'http://localhost:3000/lifecycle', wait: 2000, scroll: 100 },
];

async function capture() {
  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  for (const s of scenes) {
    console.log(`Navigating to ${s.url} for ${s.id}...`);
    await page.goto(s.url, { waitUntil: 'networkidle0' });
    if (s.scroll > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), s.scroll);
    }
    await new Promise((r) => setTimeout(r, s.wait));
    const outPath = path.join(__dirname, `${s.id}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot: ${outPath}`);
  }

  await browser.close();
  console.log('All 7 scene screenshots captured successfully!');
}

capture().catch(console.error);
