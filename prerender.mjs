/**
 * Prerender script — captures static HTML snapshots of each SPA route
 * using a real Chromium browser so Three.js, framer-motion, and all
 * browser-only code render correctly before the HTML is saved.
 *
 * Usage: called automatically via `npm run build` (postbuild hook).
 * Manual: `node prerender.mjs`
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { extname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = resolve(__dirname, 'dist');

// ── Routes to prerender ────────────────────────────────────────────────────────
// Add new blog slugs here as articles are published.
const ROUTES = [
  '/',
  '/blog',
  '/blog/complete-2026-ai-guide-el-paso-small-businesses',
  '/faq',
  '/case-studies',
  '/case-studies/torque-performance',
  '/case-studies/el-toro-law',
  '/case-studies/brenda-jazmin-cake-pump',
  '/ai-automation-el-paso',
  '/ai-for-law-firms-el-paso',
  '/bilingual-ai-chatbots-el-paso',
  '/ai-content-marketing-el-paso',
  '/ai-web-development-el-paso',
  '/ai-for-hispanic-businesses-el-paso',
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.md':   'text/plain',
};

// ── Minimal static server with SPA fallback ────────────────────────────────────
function createStaticServer(port) {
  const server = createServer((req, res) => {
    const url = req.url.split('?')[0];
    let filePath = join(DIST, url === '/' ? 'index.html' : url);
    const ext = extname(filePath);

    // SPA fallback: unknown extension or file missing → serve index.html
    if (!ext || !existsSync(filePath)) {
      filePath = join(DIST, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const mime = MIME_TYPES[extname(filePath)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function prerender() {
  if (!existsSync(DIST)) {
    console.error('❌  /dist not found — run `npm run build` first (without postbuild).');
    process.exit(1);
  }

  console.log('\n🎨  Primo AI Studio — static prerender\n');

  const PORT = 5174;
  const server = await createStaticServer(PORT);
  console.log(`   Server: http://127.0.0.1:${PORT}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    for (const route of ROUTES) {
      process.stdout.write(`   📄  ${route} … `);

      const page = await browser.newPage();

      // Suppress console noise from the SPA
      page.on('console', () => {});
      page.on('pageerror', () => {});

      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });

      // Wait for React to mount (#root has children) OR render-event fires
      await Promise.race([
        page.waitForFunction(
          () => document.getElementById('root')?.childElementCount > 0,
          { timeout: 15_000 }
        ),
        page.evaluate(
          () => new Promise(res =>
            document.addEventListener('render-event', res, { once: true })
          )
        ),
      ]).catch(() => {});

      // Brief extra wait for lazy-loaded chunks and framer-motion initial frame
      await new Promise(r => setTimeout(r, 1_500));

      const html = await page.content();

      // Write to dist/<route>/index.html
      const outputDir = route === '/'
        ? DIST
        : join(DIST, ...route.replace(/^\//, '').split('/'));

      mkdirSync(outputDir, { recursive: true });
      writeFileSync(join(outputDir, 'index.html'), html, 'utf-8');

      console.log('✅');
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n✨  Prerender complete!\n');
}

prerender().catch(err => {
  console.error('\n❌  Prerender failed:', err.message);
  process.exit(1);
});
