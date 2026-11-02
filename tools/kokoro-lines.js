// Every line the site can say, asked of the page itself (window.__oliveraSpeech.lines(), built by the
// same code that draws the screens), written as JSON for kokoro-voice/make_lines.py.
//   node tools/kokoro-lines.js <url of the running site> <out.json>
// Uses the Playwright that website data/site-tests already has.
const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '..', 'site-tests', 'node_modules', 'playwright'));

(async () => {
  const [url, out] = process.argv.slice(2);
  if (!url || !out) { console.error('usage: node tools/kokoro-lines.js <url> <out.json>'); process.exit(2); }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const lines = await page.evaluate(() => window.__oliveraSpeech.lines());
  await browser.close();
  fs.writeFileSync(out, JSON.stringify(lines, null, 1));
  const secs = Math.round(lines.join(' ').split(/\s+/).length / 2.3);
  console.log(`${lines.length} lines → ${out} (about ${Math.round(secs / 60)} min of speech)`);
})();
