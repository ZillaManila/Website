// Renders placeholder product images from the procedural 3D model.
// Usage: node tools/render-placeholders.mjs   (needs Chromium; see README)
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const out = 'public/images/products';
mkdirSync(out, { recursive: true });
const bundle = await build({ entryPoints: ['tools/render-entry.js'], bundle: true, write: false, format: 'iife' });
const html = `<html><body style="margin:0;background:transparent"><canvas id="c" width="1200" height="1200"></canvas><script>${bundle.outputFiles[0].text}</script></body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });

const jobs = JSON.parse(process.argv[2] || 'null') || (await import('./render-jobs.mjs')).default;
for (const job of jobs) {
  await page.setContent(html);
  await page.evaluate((j) => window.renderPlush(j), job);
  const png = `${out}/${job.name}.png`;
  await page.locator('#c').screenshot({ path: png, omitBackground: true });
  execFileSync('python3', ['-c', `from PIL import Image;im=Image.open('${png}');im.save('${png.replace('.png', '.webp')}',quality=86,method=6)`]);
  execFileSync('rm', [png]);
  console.log('rendered', job.name);
}
await browser.close();
