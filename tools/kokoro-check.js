// Does every line the site can say have a Kokoro recording?
//   node tools/kokoro-check.js <url of the running site>
// Asks the page for its lines (window.__oliveraSpeech.lines(), the same list the recordings were
// made from) and looks each one up in kokoro/lines.js the way kokoro-voice.js does. Exits 1 on a miss.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require(path.join(__dirname, '..', '..', 'site-tests', 'node_modules', 'playwright'));

const END_STOP = /[.!?:,]["”’]?$/;
const canon = t => { t = String(t).trim(); return END_STOP.test(t) ? t : `${t}.`; };   // as kokoro-voice.js

(async () => {
  const url = process.argv[2];
  if (!url) { console.error('usage: node tools/kokoro-check.js <url>'); process.exit(2); }
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'kokoro', 'lines.js'), 'utf8'), ctx);
  const recorded = ctx.window.KOKORO_LINES || {};
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const lines = await page.evaluate(() => window.__oliveraSpeech.lines());
  await browser.close();
  const missing = lines.filter(l => !Object.prototype.hasOwnProperty.call(recorded, canon(l)));
  const files = new Set(fs.readdirSync(path.join(__dirname, '..', 'kokoro')).filter(f => f.endsWith('.webm')).map(f => f.slice(0, -5)));
  const noFile = Object.values(recorded).filter(r => !files.has(r[0])).map(r => r[0]);
  const secs = Object.values(recorded).reduce((n, r) => n + r[1], 0);
  console.log(`${lines.length} lines the site can say · ${Object.keys(recorded).length} recordings (${Math.round(secs / 60)} min) · ${missing.length} with no recording · ${noFile.length} recordings missing their file`);
  missing.slice(0, 10).forEach(l => console.log('  no recording: ' + l.slice(0, 120)));
  noFile.slice(0, 10).forEach(id => console.log('  missing file: kokoro/' + id + '.webm'));
  process.exit(missing.length || noFile.length ? 1 : 0);
})();
