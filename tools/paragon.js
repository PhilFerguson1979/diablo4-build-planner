// Paragon boards, nodes and glyphs from a d4data checkout.
// Used by extract.js: require('./paragon.js')(ROOT, helpers) -> { boards, nodes, glyphs, texts }
const fs = require('fs'), path = require('path');

// Power-budget multipliers are engine constants that are not shipped in the data files.
// Calibrated against in-game tooltips (Castle board: magic +5% Physical, rare +10% Physical,
// +1.5% / +2% / +3% Total Armor, glyph Turf +2.0% per 5 Strength at level 1, threshold 15% DR).
const BUDGET = {
  ParagonPowerBudgetMultiplierNodeMagicOffensive: 2.5,
  ParagonPowerBudgetMultiplierNodeMagicDefensive: 2,
  ParagonPowerBudgetMultiplierNodeRareMinorOffensive: 5,
  ParagonPowerBudgetMultiplierNodeRareMajorOffensive: 5,
  ParagonPowerBudgetMultiplierNodeRareMinorDefensive: 4,
  ParagonPowerBudgetMultiplierNodeRareMajorDefensive: 4,
  ParagonPowerBudgetMultiplierGlyphStatBonusRare: 0.5,
  ParagonPowerBudgetMultiplierGlyphThresholdBonusRare: 0.1,
};
const DMG = ['Physical', 'Fire', 'Lightning', 'Cold', 'Poison', 'Shadow', 'Holy'];
const DOT = ['Bleeding', 'Burning', 'Shocked', 'Chilled', 'Poisoned', 'Shadow-afflicted', 'Holy-afflicted'];
const CC = ['Stunned', 'Slowed', 'Crowd Controlled', 'Frozen', 'Knocked Down', 'Immobilized', 'Feared', 'Dazed', 'Chilled', 'Taunted'];
const RES = { Barbarian: 'Fury', Druid: 'Spirit', Necromancer: 'Essence', Rogue: 'Energy', Sorcerer: 'Mana', Spiritborn: 'Vigor', Paladin: 'Faith', Warlock: 'Primary Resource' };
const STAT = { Strength: 'Str', Intelligence: 'Int', Willpower: 'Will', Dexterity: 'Dex' };
const BOARD_PREFIX = { Barbarian: 'Barb', Druid: 'Druid', Necromancer: 'Necro', Rogue: 'Rogue', Sorcerer: 'Sorc', Spiritborn: 'Spirit', Paladin: 'Paladin', Warlock: 'Warlock' };

module.exports = function extractParagon(ROOT, H) {
  const { readJ, strings, F, T, hash, CLASSES, tableFn } = H;
  const META = path.join(ROOT, 'base/meta');
  const ls = d => { try { return fs.readdirSync(path.join(META, d)); } catch (e) { return []; } };

  // attribute formulas (gbid group 22)
  const af = readJ(path.join(META, 'GameBalance', 'AttributeFormulas.gam.json'));
  const AF = {}; if (af) for (const e of af.ptData[0].tEntries) AF[e.tHeader.szName] = e.arRanges.length ? e.arRanges[e.arRanges.length - 1].tFormula.value : '0';
  const call = (f) => BUDGET[f] !== undefined ? BUDGET[f] : undefined;
  const evalF = (src, vars) => F.evaluate(src || '0', { id: n => (vars && vars[n] !== undefined ? vars[n] : 0), call, table: tableFn });

  // attribute text templates
  const AD = strings('AttributeDescriptions');
  const tagNames = {}; const st = strings('SkillTags');
  const tagFile = readJ(path.join(META, 'GameBalance', 'SkillTags.gam.json'));
  if (tagFile) for (const e of tagFile.ptData[0].tEntries) { const n = e.tHeader.szName; const nm = st[n + '_TagName'] || st[n.replace(/^Skill_Primary_/, 'Skill_') + '_TagName']; if (nm) tagNames[hash(n)] = nm; }
  const powerNames = {};
  for (const f of ls('Power')) { if (/^Paragon/.test(f)) continue; const d = readJ(path.join(META, 'Power', f)); if (!d) continue; const nm = f.replace('.pow.json', ''); const s = strings('Power_' + nm); if (s.name) powerNames[d.__snoID__] = s.name; }
  const paramName = (attr, p, cls) => {
    if (p === -1 || p == null) return '';
    if (/Skill_Tag|Per_Skill_Tag|By_Skill_Tag/.test(attr)) return tagNames[p >>> 0] || '';
    if (/^Skill_Rank_Bonus$|Power_Rank|Passive_Rank/.test(attr)) return powerNames[p] || '';
    if (/Power|Per_Power/.test(attr)) return powerNames[p] || '';
    if (/Dot_Type/.test(attr)) return DOT[p] || '';
    if (/CC_Target|CC_Type/.test(attr)) return CC[p] || 'Crowd Controlled';
    if (/Resource/.test(attr)) return RES[cls] || 'Resource';
    if (/Damage_Type|Resist|DamageType|Per_Damage_Type/.test(attr)) return DMG[p] || '';
    if (/Shapeshift_Form/.test(attr)) return ['Human', 'Werewolf', 'Werebear'][p] || '';
    if (/Pet_Type/.test(attr)) return ['Skeleton Warriors', 'Skeleton Mages', 'Golem'][p] || 'Minions';
    return '';
  };
  const texts = []; const textIdx = {};
  // Returns index of a template where § marks the number. Values are already in display units.
  const tplCache = {};
  function tplFor(attr, p, cls) {
    const pn = paramName(attr, p, cls);
    const key = attr + '|' + pn;
    if (tplCache[key]) return tplCache[key];
    let tpl = AD[attr + '#' + pn] || AD[attr] || '';
    let s, pct = false;
    if (!tpl) s = '+§ ' + attr.replace(/_/g, ' ');
    else {
      s = tpl.replace(/\[([^\[\]|]+?)(?:\|([^|\]]*)\|?)?\]/g, (m, expr, fmt) => {
        if (!/value/i.test(expr)) return m;
        const isPct = (fmt || '').includes('%') || /\*\s*100/.test(expr);
        if (isPct) pct = true;
        return '§' + (isPct ? '%' : '') + ((fmt || '').includes('x') ? '\u2039x\u203a' : '');
      });
      if (pn) s = s.replace(/\{[vV][aA][lL][uU][eE]1\}/g, pn);
      s = s.replace(/\{[vV][aA][lL][uU][eE]\d?\}/g, '§').replace(/\|\d?([A-Za-z]+):([A-Za-z]+);/g, '$2');
      if (!pct && /Resist/.test(attr)) s = s.replace('§', '§%');
      s = T.render(s, { token: () => undefined, cond: () => false }).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().replace(/\u2039x\u203a/g, '[x]');
      if (!s.includes('§')) s = '+§ ' + s;
    }
    return (tplCache[key] = { s, pct, pn });
  }
  function attrTpl(attr, p, cls) {
    const { s } = tplFor(attr, p, cls);
    if (textIdx[s] !== undefined) return textIdx[s];
    texts.push(s); textIdx[s] = texts.length - 1; return texts.length - 1;
  }

  // thresholds
  const thrCache = {};
  function threshold(name) {
    if (!name) return null; if (thrCache[name] !== undefined) return thrCache[name];
    const d = readJ(path.join(META, 'ParagonThreshold', name + '.pth.json'));
    const out = d ? d.ptThresholds.map(e => {
      const a = e.tThresholdAttribute.__eAttribute_name__.replace(/_(Total|Core)$/, '');
      const f = e.tThresholdValueFormula.value;
      return [a, evalF(f, { ParagonBoardEquipIndex: 0 }), evalF(f, { ParagonBoardEquipIndex: 1 }) - evalF(f, { ParagonBoardEquipIndex: 0 })];
    }) : null;
    thrCache[name] = out; return out;
  }

  // power text (legendary nodes, glyph threshold powers)
  function powerText(pname, extra) {
    const d = readJ(path.join(META, 'Power', pname + '.pow.json')); const s = strings('Power_' + pname);
    if (!d) return { name: s.name || '', desc: '' };
    const sf = (d.ptScriptFormulas || []).map(x => x.tFormula.value);
    const memo = {};
    const ctx = { id: n => { const m = n.match(/^SF_(\d+)$/); if (m) { if (memo[n] === undefined) { memo[n] = 0; memo[n] = F.evaluate(sf[+m[1]] || '0', ctx); } return memo[n]; } return extra && extra[n] !== undefined ? extra[n] : 0; }, call, table: tableFn };
    let desc = (s.desc || '').replace(/\r?\n\r?\n?Current Bonus:[\s\S]*$/i, '').replace(/\r?\n?\{c_label\}Current[\s\S]*$/i, '');
    desc = T.render(desc, { value: inner => F.evaluate(inner, ctx), token: n => /^SF_\d+$/.test(n) ? ctx.id(n) : (extra && extra[n] !== undefined ? extra[n] : undefined), cond: () => false });
    return { name: s.name || '', desc };
  }

  // nodes
  const nodes = {}; const nodeCls = {};
  function node(name, cls) {
    if (nodes[name]) return name;
    const d = readJ(path.join(META, 'ParagonNode', name + '.pgn.json')); if (!d) return null;
    const s = strings('ParagonNode_' + name);
    let r = d.bIsGate ? 'gate' : d.bHasSocket ? 'socket' : /^StartNode/.test(name) ? 'start' : ({ 0: 'normal', 2: 'magic', 3: 'rare', 4: 'legendary' })[d.eRarityOverride] || 'normal';
    const stats = (d.ptAttributes || []).map(a => {
      const f = a.gbidFormula ? AF[a.gbidFormula.name] : a.szAttributeFormula.value;
      const v = Math.round(evalF(f) * 1000) / 1000;
      return [attrTpl(a.__eAttribute_name__, a.nParam, cls), v, a.__eAttribute_name__.replace(/_Core$/, '')];
    });
    const o = { r, n: s.Name || '', s: stats.map(x => [x[0], x[1]]) };
    if (r === 'normal' || r === 'magic' || r === 'gate') { const core = stats.filter(x => STAT[x[2]]); if (core.length) o.c = core.map(x => [x[2], x[1]]); }
    if (r === 'rare') { const core = stats.filter(x => STAT[x[2]]); if (core.length) o.c = core.map(x => [x[2], x[1]]); }
    if ((d.ptBonusAttributeIndices || []).length) o.b = d.ptBonusAttributeIndices;
    if ((d.arThresholdSelector || []).length) o.t = threshold(d.arThresholdSelector[0].name);
    if (d.snoPassivePower) { const p = powerText(d.snoPassivePower.name); o.n = o.n || p.name; o.d = p.desc; }
    o.g = (d.arSkillTags || []).map(t => (t && t.name || '').replace(/^Search_/, '')).filter(Boolean);
    nodes[name] = o; return name;
  }

  // boards
  const boards = {};
  for (const cls of CLASSES) {
    const pre = BOARD_PREFIX[cls]; const list = [];
    for (const f of ls('ParagonBoard').filter(f => f.startsWith('Paragon_' + pre + '_')).sort()) {
      const id = f.replace('.pbd.json', ''); const d = readJ(path.join(META, 'ParagonBoard', f)); if (!d) continue;
      const w = d.nWidth; const h = Math.ceil(d.arEntries.length / w);
      const cells = [];
      d.arEntries.forEach((e, i) => { if (e && e.name) { const k = node(e.name, cls); if (k) cells.push([i % w, Math.floor(i / w), k]); } });
      if (!cells.length) continue;
      const s = strings('ParagonBoard_' + id);
      const start = cells.some(c => nodes[c[2]].r === 'start');
      const leg = cells.find(c => nodes[c[2]].r === 'legendary');
      list.push({ id, name: s.Name || (start ? 'Starting Board' : id), w, h, cells, start: start ? 1 : 0, leg: leg ? leg[2] : null });
    }
    list.sort((a, b) => b.start - a.start || a.name.localeCompare(b.name));
    if (list.length) boards[cls] = list;
  }

  // glyphs
  const glyphs = {};
  for (const f of ls('ParagonGlyph')) {
    const d = readJ(path.join(META, 'ParagonGlyph', f)); if (!d || !d.arAffixes) continue;
    const id = f.replace('.gph.json', ''); const s = strings('Item_ParagonGlyph_' + id);
    if (!s.Name) continue;
    const m = id.match(/_(Strength|Intelligence|Willpower|Dexterity)_(Main|Side)/);
    const affixes = [];
    let thr = null;
    for (const a of d.arAffixes) {
      if (!a) continue;
      const A = readJ(path.join(META, 'ParagonGlyphAffix', a.name + '.gaf.json')); if (!A) continue;
      const as = strings('ParagonGlyphAffix_' + a.name);
      const budget = A.gbidPowerBudgetFormula ? evalF(AF[A.gbidPowerBudgetFormula.name] || '0') : 1;
      const x = { op: A.eBonusOperation, b: Math.round(budget * 1e6) / 1e6, s0: A.flStartingBonusScalar, s1: A.flAddedBonusScalarPerLevel, req: A.eRequiredRarity || 0, nr: A.eAffectedNodeRarity || 0 };
      const src = (A.unk_e80c332 || [])[0];
      if (src) x.src = src.tSourceAttribute.__eAttribute_name__.replace(/_Core$/, '');
      if ((A.arThresholdSelector || []).length) { thr = threshold(A.arThresholdSelector[0].name); x.thr = 1; }
      if (A.snoBonusPassivePower) { const p = powerText(A.snoBonusPassivePower.name); x.d = p.desc; }
      else x.d = T.render((as.Desc || '').replace(/\[\{GlyphAffixScalar\}\|([^|\]]*)\|?\]/g, '§$1§'), { token: () => undefined, cond: () => false });
      affixes.push(x);
    }
    const classes = (d.fUsableByClass || []).map((v, i) => v ? CLASSES[i] : null).filter(Boolean);
    glyphs[id] = { name: s.Name.replace(/^Glyph:\s*/, ''), stat: m ? m[1] : '', kind: m ? m[2] : '', classes, thr, a: affixes };
  }
  return { boards, nodes, glyphs, texts, _h: { tplFor, AF, evalF, paramName } };
};
