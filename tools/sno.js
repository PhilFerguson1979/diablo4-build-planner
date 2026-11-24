// Game file number (SNO) to name map for affixes, used to read Maxroll planner builds,
// which name affixes, tempers and aspects by file number.
// usage: node sno.js <d4data repo> <app data dir> <live|ptr>
const { execFileSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const [, , REPO, OUT, LABEL] = process.argv;
const toc = JSON.parse(execFileSync('git', ['-C', REPO, 'show', 'HEAD:json/base/CoreTOC.dat.json'], { maxBuffer: 1 << 30 }).toString());
const AFFIX_GROUP = Object.keys(toc).find(g => Object.values(toc[g]).includes('S04_CooldownReductionCDR'));
global.window = {}; require(path.resolve(OUT, `items-${LABEL}.js`)); require(path.resolve(OUT, `gear-${LABEL}.js`));
const D = window.D4DATA[LABEL];
const used = new Set();
D.aspects.forEach(a => used.add(a.id));
D.gear.affixes.forEach(a => used.add(a.id));
D.gear.tempers.forEach(t => t.opts.forEach(o => used.add(o.id)));
(D.gear.sanct || []).forEach(s => used.add(s.id));
const affix = {};
for (const [sno, name] of Object.entries(toc[AFFIX_GROUP])) if (used.has(name)) affix[sno] = name;
fs.writeFileSync(path.join(OUT, `sno-${LABEL}.js`), `window.D4SNO=window.D4SNO||{};window.D4SNO[${JSON.stringify(LABEL)}]=${JSON.stringify({ affix })};\n`);
console.log(LABEL, 'affix group', AFFIX_GROUP, 'mapped', Object.keys(affix).length, 'of', used.size);
