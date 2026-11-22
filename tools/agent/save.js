// Build agent: turn a search result into planner notes, a chase list and a library entry.
//   node tools/agent/save.js <key>            reads specs/<key>.json and out/<key>.json
//   --no-library                              write the report only
// Writes docs/builds/<key>.md and adds (or replaces) the build in data/library-lab.js.
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'); const HERE = __dirname;
const key = process.argv[2]; const noLib = process.argv.includes('--no-library');
if (!key) { console.log('usage: node save.js <key> [--no-library]'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(path.join(HERE, 'specs', key + '.json'), 'utf8'));
const R = JSON.parse(fs.readFileSync(path.join(HERE, 'out', key + '.json'), 'utf8'));
const TAGS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'synergy-tags.json'), 'utf8')).classes[R.cls] || { powers: [] };
const today = new Date().toISOString().slice(0, 10);

// numbers in words people read: 12.3 billion, 456 million
const big = v => { const a = Math.abs(v); if (a >= 1e12) return (v / 1e12).toFixed(2) + ' trillion'; if (a >= 1e9) return (v / 1e9).toFixed(2) + ' billion'; if (a >= 1e6) return (v / 1e6).toFixed(1) + ' million'; if (a >= 1e3) return Math.round(v).toLocaleString('en-US'); return String(Math.round(v)); };
const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

// synergy check: what the build's own parts make and pay off
const parts = []; const tagOf = (kind, name) => TAGS.powers.find(p => p.name === name && (!kind || p.kind === kind));
R.gear.forEach(g => { const t = tagOf(null, g.item) || tagOf(null, g.item.replace(/ \(.*\)$/, '')); if (t) parts.push(t); });
R.skills.forEach(s => { const m = s.match(/^(.+?) r\d+ \[(.*)\]$/); if (!m) return; const t = tagOf('Skill', m[1]); if (t) parts.push(t); (m[2] ? m[2].split(', ') : []).forEach(u => { const q = tagOf('Skill upgrade', m[1] + ' > ' + u); if (q) parts.push(q); }); });
R.charms.forEach(c => { if (c.name) { const t = tagOf(null, c.name); if (t) parts.push(t); } });
R.glyphs.forEach(g => { const t = tagOf('Glyph', g.glyph); if (t) parts.push(t); });
const made = new Map(), paid = new Map(); parts.forEach(p => { p.makes.forEach(m => made.set(m, (made.get(m) || []).concat(p.name))); p.pays.forEach(m => paid.set(m, (paid.get(m) || []).concat(p.name))); });
const skipT = new Set(['Elites, bosses and kills']);
const links = [...paid.keys()].filter(t => !skipT.has(t) && made.has(t)).map(t => ({ t, mk: [...new Set(made.get(t))], py: [...new Set(paid.get(t))] })).filter(l => new Set(l.mk.concat(l.py)).size > 1);
const GATED = new Set(['Block', 'Crowd control', 'Overpower', 'Damage over time', 'Thorns', 'Evade and Dodge', 'Berserking', 'Shouts', 'Weapon swapping', 'Earthquakes and Dust Devils', 'Shapeshifting', 'Companions', 'Storm and Earth', 'Minions', 'Corpses', 'Blood Orbs', 'Shadow and Darkness', 'Combo Points', 'Stealth and Concealment', 'Imbuements', 'Traps and Grenades', 'Crackling Energy', 'Burning', 'Frozen and Chilled', 'Enchantments and Conjurations', 'Spirit Hall', 'Resolve and Counterattack', 'Aura cast / Aura Potency', 'Judgement', 'Arbiter form', 'Resolve (Juggernaut)', 'Fervor (Zealot)', 'Retribution', 'Volatility', 'Demonform and Shadowform', 'Summons and demons', 'Hex and Sigils']);
const dead = [...paid.keys()].filter(t => GATED.has(t) && !made.has(t)).map(t => ({ t, py: [...new Set(paid.get(t))] }));

// rotation from the bar
const rotLines = R.rot.map(r => { const cd = r.cd ? ` (every ${r.cd} seconds after Cooldown Reduction)` : '';
  if (r.main && !r.cd) return `**${r.name}:** your main skill. Cast it as much as you can.`;
  if (r.tag === 'Ultimate') return `**${r.name}:** Ultimate. Cast it on cooldown${cd}, ideally when elites or the boss are in range.`;
  if (r.tag === 'Aura') return `**${r.name}:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect${cd}${r.main ? '. This is the main damage' : ''}.`;
  if (r.main) return `**${r.name}:** your main skill${cd}. Cast it on cooldown and fill the gaps with your other skills.`;
  if (r.basic) return `**${r.name}:** Basic skill. Use it to fill gaps and generate resource.`;
  if (r.cd) return `**${r.name}:** cast on cooldown${cd}.`;
  if (r.cost) return `**${r.name}:** spends resource. Cast it between ${R.main} casts when you have resource to spare, or keep it up if it summons or lingers.`;
  return `**${r.name}:** keep it on your bar for its passive effect and cast it when it is useful.`; });

const okPit = R.pitHold; const p100 = R.pit.find(p => p.tier === 100) || {};
const capRows = R.caps.filter(c => c.v > 0 || ['cdr', 'csc', 'block'].includes(c.id));
const lowEl = R.def.elems.slice().sort((a, b) => a.dr - b.dr)[0];
const shortCaps = capRows.filter(c => !c.at && c.cap <= 100 && ['cdr', 'csc', 'block', 'as', 'dodge', 'lhc'].includes(c.id)).map(c => `${c.stat} ${c.v}% of ${c.cap}%`);

const about = [
  `Build agent, ${today}. ${spec.idea || ''}`.trim(),
  `Damage: ${big(R.dmg.total)} a second against elites (${R.main}${R.payN ? ', ' + R.payN : ''}${R.dmg.procs.length ? ', plus ' + list(R.dmg.procs.map(p => p.n)) : ''}). Build score: ${big(R.dmg.pack)} a second on packs and ${big(R.dmg.boss)} on bosses.`,
  `Survival: Effective Life ${big(R.def.ehp)} (Life ${big(R.def.life)}, Armor ${big(R.def.armor)}). Weakest element: ${lowEl ? lowEl.el + ' at ' + lowEl.dr + '% damage reduction' : 'none'}. Pit check (the planner's model, harsher than the game, so compare it with the starting build): it wins the race against an elite up to Pit ${okPit || 'below 60'}, against Pit ${R.pitHoldStart || 'below 60'} for ${R.base} measured the same way.${p100.tier ? ` At Pit 100 an elite dies in about ${p100.eliteTTK} seconds and would kill you in about ${p100.eliteKillsYouIn}.` : ''}`,
  `How it was made: started from ${R.base}. The agent tried every item that fits each slot, four affixes and a temper on each, Paragon boards from ${R.paraFrom}, every glyph in each socket (level 75), both mercenaries and their nodes, and charms (single affixes, every set at each tier, unique charms). Numbers assume a 2,000 damage weapon, top rolls, ${spec.tg || 3} enemies in range and every power's condition met. Nothing here has been checked in game.`
].join('\n\n');
const strengths = links.slice(0, 6).map(l => `${l.t}: ${list(l.mk.slice(0, 4))} → ${list(l.py.slice(0, 4))}`).join('\n');
const weaknesses = [shortCaps.length ? 'Below cap: ' + list(shortCaps) + '.' : '', dead.length ? 'Payoffs with nothing in the build to trigger them: ' + dead.map(d => `${d.t} (${list(d.py.slice(0, 3))})`).join('; ') + '. Swap these first if a better item drops.' : '', lowEl && lowEl.dr < 60 ? `${lowEl.el} damage hurts most (${lowEl.dr}% reduction).` : ''].filter(Boolean).join('\n');
const glyphTxt = R.glyphs.map(g => `${g.glyph} (level ${g.level})`).join(', ');
const notes = { about, strengths, weaknesses, rotation: rotLines.join('\n'), glyphs: glyphTxt, video: '', filter: '', tags: ['Build agent'].concat(spec.engine || []) };

// the report Phil reads
const md = [];
md.push(`# ${R.name} (${R.cls})\n`); md.push(`*Made by the build agent on ${today}. Everything below comes from the planner's maths and has not been checked in game.*\n`);
md.push(`## The idea\n\n${spec.idea || R.main + ' build.'}\n`);
md.push(`## Numbers\n`);
md.push(`- **Damage against elites:** ${big(R.dmg.total)} a second`); md.push(`- **Build score:** ${big(R.dmg.pack)} on packs, ${big(R.dmg.boss)} on bosses`); md.push(`- **Effective Life:** ${big(R.def.ehp)} (Life ${big(R.def.life)}, Armor ${big(R.def.armor)}, Block ${R.def.block}%)`);
md.push(`- **Pit check:** kills an elite before it dies up to Pit ${okPit || 'below 60'}; the starting build managed ${R.pitHoldStart || 'below 60'} by the same test. The planner's Pit model is harsher than the game, so use it to compare builds, not as a promise.`);
md.push(`- **Started from:** ${R.base}: build score ${big((R.startScore || {}).pack || 0)} on packs, ${big((R.startScore || {}).boss || 0)} on bosses, ${big(R.def.start)} Effective Life\n`);
md.push(`| Pit | Elite dies in | Elite kills you in | Biggest hit | Your Life |\n|---|---|---|---|---|`);
R.pit.forEach(p => md.push(`| ${p.tier} | ${p.eliteTTK} s | ${p.eliteKillsYouIn} s | ${big(p.biggestHit)} | ${big(p.life)} |`)); md.push('');
md.push(`## How it works\n`); if (links.length) links.forEach(l => md.push(`- **${l.t}:** made by ${list(l.mk.slice(0, 6))}; paid off by ${list(l.py.slice(0, 6))}.`)); else md.push('- No linked mechanics found.'); md.push('');
if (dead.length) { md.push(`### Payoffs with nothing to trigger them\n`); dead.forEach(d => md.push(`- **${d.t}:** ${list(d.py)}`)); md.push(''); }
md.push(`## Rotation\n`); rotLines.forEach(l => md.push(`- ${l}`)); md.push('');
md.push(`## Skills\n`); R.skills.forEach(s => md.push(`- ${s}`)); md.push('');
md.push(`## Gear to chase\n\nAffixes are in the order the agent picked them, most valuable first. Get the item, then the first affix, and so on.\n`);
md.push(`| Slot | Item | Affixes | Temper |\n|---|---|---|---|`);
R.gear.forEach(g => md.push(`| ${g.slotName} | ${g.item}${g.mythic ? ' (Mythic)' : ''} | ${(g.fixed || []).map(f => f + ' (fixed)').concat(g.affixes).join('; ')} | ${g.tempers.join('; ')} |`)); md.push('');
md.push(`## Caps\n\n| Stat | Now | Cap |\n|---|---|---|`); capRows.forEach(c => md.push(`| ${c.stat} | ${c.v}% | ${c.cap}%${c.at ? ' (at cap)' : ''} |`)); md.push('');
md.push(`| Element | Damage reduction | Effective Life |\n|---|---|---|`); R.def.elems.forEach(e => md.push(`| ${e.el} | ${e.dr}% | ${big(e.ehp)} |`)); md.push('');
if (R.def.whatIf.length) { md.push(`Best next defensive affixes: ${R.def.whatIf.map(w => `${w.affix} (+${w.gain}% Effective Life)`).join(', ')}.\n`); }
md.push(`## Paragon\n\n- **Boards:** ${list(R.boards)} (layout from ${R.paraFrom})\n- **Glyphs:** ${R.glyphs.map(g => g.glyph + ' on ' + g.board + ' (level ' + g.level + ')').join(', ')}\n`);
md.push(`## Charms\n\n- **Seal:** ${R.seal || 'none'}`); R.charms.forEach(c => md.push(`- ${c.kind === 'rare' ? 'Rare charm: ' + c.aff.join('; ') : c.kind === 'set' ? 'Set: ' + c.name + (c.aff && c.aff.length ? ' (' + c.aff.join('; ') + ')' : '') : 'Unique: ' + c.name}`)); md.push('');
md.push(`## Mercenaries\n\n- **Hired:** ${R.mercs.main || 'none'}\n- **Reinforcement:** ${R.mercs.sup || 'none'}${R.mercs.supSkill ? ' (' + R.mercs.supSkill + ')' : ''}\n`);
md.push(`## Search log\n`); R.log.forEach(l => md.push(`- ${l}`)); md.push(`- took ${R.secs} seconds`);
fs.mkdirSync(path.join(ROOT, 'docs', 'builds'), { recursive: true }); fs.writeFileSync(path.join(ROOT, 'docs', 'builds', key + '.md'), md.join('\n') + '\n');

if (!noLib) {
  const p = path.join(ROOT, 'data', 'library-lab.js'); const L = fs.readFileSync(p, 'utf8').split('\n'); const pre = "(function(){ if (!window.D4LIB) return; window.D4LIB.builds.push(...", post = "); })();";
  const arr = JSON.parse(L[1].slice(pre.length, L[1].length - post.length)); const st = R.st; st.notes = notes; st.name = R.name;
  const entry = { cls: R.cls, tier: 'Lab', author: 'Build agent', lab: 1, updated: today, id: 'lab/' + key, name: R.name, note: (spec.idea || '').split('. ')[0].replace(/\.$/, '') + '.', variants: [{ t: spec.variantName || 'Agent search', bar: R.bar, gear: R.gear.map(g => [g.slot, g.item, g.kind === 'aspect' ? 'a' : 'u']), st }] };
  const i = arr.findIndex(b => b.id === entry.id); if (i >= 0) arr[i] = entry; else arr.push(entry);
  L[1] = pre + JSON.stringify(arr) + post; fs.writeFileSync(p, L.join('\n'));
}
console.log('saved', key, '| damage', big(R.dmg.total), '| EHP', big(R.def.ehp), '| pit', okPit, 'vs start', R.pitHoldStart, '| links', links.length, '| dead', dead.length);
