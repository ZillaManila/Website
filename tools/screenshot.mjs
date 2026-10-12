// Dev helper: node tools/screenshot.mjs <path> <out.png> [width] [fullPage] [scrollY]
import { chromium } from 'playwright';
const [, , path = '/', out = 'shot.png', width = '1440', full = '1', scrollY = '0'] = process.argv;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const w = Number(width);
const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle' });
if (full === '1') {
  // Trigger reveals and lazy content.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
    window.scrollTo(0, 0);
  });
}
if (scrollY !== '0') await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
await page.waitForTimeout(2500);
await page.screenshot({ path: out, fullPage: full === '1' });
if (errors.length) console.log('ERRORS:', errors.join('\n'));
await browser.close();
