// Tidy attack names in data/monsters.js: drop leading words that only repeat the monster's file name (S15, ancient, korlic...)
const fs = require('fs'); const f = process.argv[2];
global.window = {}; require(require('path').resolve(f)); const D = window.D4MON;
for (const m of D.monsters) {
  const toks = new Set(m.id.toLowerCase().split('_').concat(['s14', 's15', 'egb', 'boss', 'ancients', 'triad', 'a', 'b', 'c', 'p1', 'p2', 'attk', 'attack']));
  for (const a of m.attacks) {
    const w = a.name.split(' '); while (w.length > 1 && toks.has(w[0].toLowerCase())) w.shift();
    const t = w.join(' '); a.name = t.charAt(0).toUpperCase() + t.slice(1);
  }
}
fs.writeFileSync(f, 'window.D4MON=' + JSON.stringify(D) + ';\n'); console.log('tidied', D.monsters.length);
