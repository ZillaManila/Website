// Dev helper: viewport screenshots at several scroll positions.
// node tools/scrollshots.mjs <path> <outPrefix> <width> <y1,y2,...>
import { chromium } from 'playwright';
const [, , path, prefix, width, ys] = process.argv;
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const w = Number(width);
const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle' });
console.log('scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth), 'height', await page.evaluate(() => document.body.scrollHeight));
for (const y of ys.split(',').map(Number)) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${prefix}-${y}.png` });
}
if (errors.length) console.log('ERRORS:', errors.join('\n'));
await browser.close();
