// Build agent runner.
//   node tools/agent/run.js specs/<idea>.json          search the build and write out/<key>.json
//   node tools/agent/run.js --eval script.js           run any script inside the planner (LAB, LX, AGENT ready)
// Needs Playwright and Chrome (NODE_PATH=/opt/npm-tools/node_modules in the Claude workspace).
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'); const HERE = __dirname;
(async () => {
  const args = process.argv.slice(2); const isEval = args[0] === '--eval'; const file = isEval ? args[1] : args[0];
  if (!file) { console.log('usage: node run.js <spec.json> | --eval <script.js>'); process.exit(1); }
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { const t = m.text(); if (t.startsWith('AGENT:')) console.error(t); });
  await p.goto('file://' + path.join(ROOT, 'index.html')); await p.evaluate(() => { localStorage.clear(); }); await p.reload(); await p.waitForTimeout(400);
  for (const f of ['lab.js', 'labx.js', 'pipeline.js']) await p.addScriptTag({ path: path.join(HERE, f) });
  p.setDefaultTimeout(0);
  let out;
  if (isEval) { const body = fs.readFileSync(file, 'utf8'); out = await p.evaluate('(async () => {' + body + '})()').catch(e => ({ error: String(e).slice(0, 800) })); }
  else { const spec = JSON.parse(fs.readFileSync(file, 'utf8')); out = await p.evaluate(s => { try { return AGENT.build(s); } catch (e) { return { error: String(e.stack || e).slice(0, 800) }; } }, spec);
    if (!out.error) { fs.mkdirSync(path.join(HERE, 'out'), { recursive: true }); fs.writeFileSync(path.join(HERE, 'out', spec.key + '.json'), JSON.stringify(out, null, 1)); } }
  const s = JSON.stringify(out, (k, v) => k === 'st' ? '[state]' : v, 1); console.log(s.slice(0, +(args[isEval ? 2 : 1]) || 4000));
  if (errs.length) console.log('PAGE ERRORS', errs.slice(0, 3).join(' | ')); await b.close();
})();
