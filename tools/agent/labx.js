// glyph, mercenary and charm searches for any class (run inside the planner page after lab.js)
// greedy charm fill: a rare charm in every socket, 2 affixes each, no repeat inside one charm
window.charmFill = (obj, w, els) => { const X = window.__D4X; const S = X.state(); const unl = X.unlockedSkills().map(id => X.cdata().powers[id]).filter(Boolean);
  const pool = X.GD().charmAffixes.filter(a => (!a.cls.length || a.cls.includes(S.cls)) && a.t).filter(a => { if (/Resistance_Single|Movement|Potion|MaxResource|Virtue_(Clarity|Renew|Tenacity|Malice)|CC_Duration/.test(a.id)) return false; const el = a.id.match(/ElementalSurge_(\w+)$/); if (el) return els.includes(el[1]); const sk = a.t.match(/^\+§ to (.+?)(?: Skills)?$/); if (sk) return unl.some(q => q.name === sk[1] || (q.tags || []).includes(sk[1]) || q.tag === sk[1]) || /Core|Basic|Aura/.test(sk[1]); return true; }).map(a => a.id);
  const sc = () => { const d = obj().tot, e = LAB.ehp(); return Math.log(Math.max(d, 1)) + w * Math.log(Math.max(e, 1)); };
  const NS0 = X.sealRules().sockets; S.charms.sockets = Array.from({ length: NS0 }, () => ({ t: 'r', aff: [] })); X.invalidate();
  for (let i = 0; i < NS0; i++) for (let k = 0; k < 2; k++) { let best = null, bj = -1e99; for (const id of pool) { if (S.charms.sockets[i].aff.includes(id)) continue; S.charms.sockets[i].aff[k] = id; X.invalidate(); const j = sc(); if (j > bj) { bj = j; best = id; } } S.charms.sockets[i].aff[k] = best; X.invalidate(); }
  const cnt = {}; S.charms.sockets.forEach(x => x.aff.forEach(id => { const n = id.replace('Talisman_Charm_', '').replace(/Virtue_|SkillRankBonus_\w+?_|LuckyHit_FlatDamage_ElementalSurge_/, ''); cnt[n] = (cnt[n] || 0) + 1; })); return cnt; };
// extra searches: glyphs, mercenaries, set charms and unique charms
window.LX = (() => {
  const X = () => window.__D4X; const SC = (obj, w) => { const d = obj().tot, e = LAB.ehp(); return Math.log(Math.max(d, 1)) + w * Math.log(Math.max(e, 1)); };
  const glyphs = (obj, w) => { const x = X(); const S = x.state(); const P = S.paragon; const log = []; if (!P || !P.glyphs) return log; const PD = x.data().paragon || {}; const all = Object.entries(PD.glyphs || {}).filter(([, g]) => !g.classes.length || g.classes.includes(S.cls)).map(([id]) => id);
    for (const bid of Object.keys(P.glyphs)) { const cur = P.glyphs[bid]; let best = cur, bj = SC(obj, w); const used = () => new Set(Object.entries(P.glyphs).filter(([b]) => b !== bid).map(([, g]) => g));
      for (const gid of all) { if (gid === cur || used().has(gid)) continue; P.glyphs[bid] = gid; x.invalidate(); const j = SC(obj, w); if (j > bj + 1e-9) { bj = j; best = gid; } }
      P.glyphs[bid] = best; x.invalidate(); if (best !== cur) log.push(bid + ': ' + ((PD.glyphs[cur] || {}).name || cur) + ' -> ' + ((PD.glyphs[best] || {}).name || best)); }
    return log; };
  const mercs = (obj, w) => { const x = X(); const M = x.mercState(); const L = x.data().mercs || []; const log = []; const keep = JSON.stringify(M); let bj = SC(obj, w), best = keep;
    // the hired mercenary: one node per group, chosen greedily, for each of the four
    for (const m of L) { M.main = m.id; M.nodes[m.id] = []; const groups = [...new Set(m.nodes.filter(n => n.g >= 0).map(n => n.g))];
      for (const g of groups) { let gb = null, gj = -1e99; for (const n of m.nodes.filter(n => n.g === g)) { M.nodes[m.id] = M.nodes[m.id].filter(i => m.nodes[i].g !== g).concat([n.i]); x.invalidate(); const j = SC(obj, w); if (j > gj) { gj = j; gb = n.i; } } M.nodes[m.id] = M.nodes[m.id].filter(i => m.nodes[i].g !== g).concat(gb == null ? [] : [gb]); }
      x.invalidate(); const j = SC(obj, w); if (j > bj + 1e-9) { bj = j; best = JSON.stringify(M); } }
    Object.assign(M, JSON.parse(best)); x.invalidate();
    // the reinforcement: every other mercenary and each of its skills
    let sb = JSON.stringify(M); for (const m of L) { if (m.id === M.main) continue; for (const a of (m.actives || [])) { M.sup = m.id; M.supSkill = a; x.invalidate(); const j = SC(obj, w); if (j > bj + 1e-9) { bj = j; sb = JSON.stringify(M); } } }
    Object.assign(M, JSON.parse(sb)); x.invalidate(); const K = JSON.parse(keep);
    const nm = id => (L.find(m => m.id === id) || {}).name || id || 'none'; if (K.main !== M.main) log.push('hired ' + nm(K.main) + ' -> ' + nm(M.main)); if (K.sup !== M.sup || K.supSkill !== M.supSkill) log.push('reinforcement ' + nm(K.sup) + ' -> ' + nm(M.sup) + ' (' + M.supSkill + ')');
    return log; };
  // after the single-affix fill: try each set's 2, 3, 4 or 5 pieces and each unique charm, swapping out the charms that matter least, keeping two affixes on every charm
  const charms = (obj, w, els) => { const x = X(); const S = x.state(); const log = []; const base = JSON.stringify(S.charms.sockets); let bj = SC(obj, w), best = base, bestLbl = 'single-affix charms';
    const leastUseful = (k, keepIdx) => { const out = []; for (let r = 0; r < k; r++) { let bi = -1, bjj = -1e99; S.charms.sockets.forEach((c, i) => { if (keepIdx.has(i) || out.includes(i) || !c) return; const sv = S.charms.sockets[i]; S.charms.sockets[i] = null; x.invalidate(); const j = SC(obj, w); S.charms.sockets[i] = sv; if (j > bjj) { bjj = j; bi = i; } }); if (bi >= 0) out.push(bi); } x.invalidate(); return out; };
    const tryOpt = (lbl, place) => { S.charms.sockets = JSON.parse(base); x.invalidate(); place(); x.invalidate(); const j = SC(obj, w); if (j > bj + 1e-9) { bj = j; best = JSON.stringify(S.charms.sockets); bestLbl = lbl; } };
    const AFF = [...new Set(JSON.parse(base).filter(Boolean).flatMap(c => c.aff || []).filter(Boolean))];   // the affixes the main fill chose
    const fillAff = idx => { for (const i of idx) { const c = S.charms.sockets[i]; c.aff = []; for (let k = 0; k < 2; k++) { let b = null, bb = -1e99; for (const id of AFF) { if (c.aff.includes(id)) continue; c.aff[k] = id; x.invalidate(); const j = SC(obj, w); if (j > bb) { bb = j; b = id; } } c.aff[k] = b; } } };
    for (const st of x.classSets()) { const pcs = (x.GD().setPieces || {})[st.id] || []; const tiers = (st.tiers || []).map(t => t.n).filter(n => n <= Math.min(5, pcs.length));
      for (const n of tiers) tryOpt(st.name + ' ' + n + '-piece', () => { const slots = leastUseful(n, new Set()); slots.forEach((si, k) => { S.charms.sockets[si] = { t: 'set', id: st.id, piece: pcs[k].id, aff: [] }; }); fillAff(slots); }); }
    const rules = x.sealRules(); const uq = x.data().uniques.filter(u => u.kind === 'charm' && (!u.classes || !u.classes.length || u.classes.includes(S.cls)));
    if (rules.uniques > 0) for (const u of uq) if (!(window.AGENT_BAN && window.AGENT_BAN.test(u.name))) tryOpt(u.name, () => { const [si] = leastUseful(1, new Set()); if (si == null) return; S.charms.sockets[si] = { t: 'u', id: u.id, aff: [] }; fillAff([si]); });
    S.charms.sockets = JSON.parse(best); x.invalidate(); log.push('charms: ' + bestLbl); return log; };
  // Full Talisman search: every seal (Legendary, Severed Finger, Golden Epiphany, Diamond Mind, Diamond Mind with the unique swap),
  // with and without the Hellfire Torch, every set plan (none, one set at its 2, 3 or 5 piece bonus, or two sets at once such as
  // a 5-piece and a 3-piece, or two 5-pieces), Horadric jewelry points (+1 to one set each, Season 16) split between the sets,
  // and the best unique charms in the unique slots the seal allows. Free sockets keep the build's best rare charms.
  // opts.hor: Horadric jewelry points to spend (0 to 3). Returns the log; leaves the best Talisman on the build.
  const charmCombos = (obj, w, opts) => { const x = X(); const S = x.state(); const o = Object.assign({ hor: 0, topSets: 5, topUniq: 7 }, opts || {}); const log = []; const ch = S.charms;
    const TORCH = 'S15_HELLFIRE_TORCH'; const keep = JSON.stringify(ch); const base = JSON.parse(keep);
    const rares = (base.sockets || []).filter(c => c && c.t === 'r' && (c.aff || []).length); const fillerAff = rares.length ? rares[0].aff.slice() : [];
    const SEALS = [['Talisman_Seal_Legendary', 0], ['Talisman_Seal_MythicUnique_01', 0], ['Talisman_Seal_MythicUnique_02', 0], ['Talisman_Seal_MythicUnique_03', 0], ['Talisman_Seal_MythicUnique_03', 1]].filter(([id]) => (x.GD().seals || []).some(z => z.id === id));
    const sets = x.classSets().map(st => ({ st, pcs: (x.GD().setPieces || {})[st.id] || [], tiers: (st.tiers || []).map(t => t.n) })).filter(z => z.pcs.length);
    const worn = new Set(x.SLOTS.map(sl => { const it = x.findItem((S.gear[sl.id] || {}).item); return it ? it.name.replace(/ \(.*\)$/, '') : ''; }));
    const uq = x.data().uniques.filter(u => u.kind === 'charm' && u.id !== TORCH && (!u.classes || !u.classes.length || u.classes.includes(S.cls)) && !worn.has(u.name) && !(window.AGENT_BAN && window.AGENT_BAN.test(u.name)));
    const hasTorch = x.data().uniques.some(u => u.id === TORCH);
    // build one Talisman: seal, swap, set plan [{set, tier, hor, torch}], uniques [ids], torch flag
    const place = (seal, swap, plan, uniqs, torch) => { const c = S.charms; c.seal = seal; c.sealSwap = !!swap; c.horadric = {}; c.torch = ''; c.sockets = []; x.invalidate(); const R = x.sealRules(); const n = R.sockets; const sk = [];
      for (const pl of plan) { const need = Math.max(2, pl.tier - R.minus); const k = Math.max(1, need - pl.hor - (pl.torch ? 1 : 0)); for (let i = 0; i < k; i++) sk.push({ t: 'set', id: pl.set.st.id, piece: pl.set.pcs[i % pl.set.pcs.length].id, aff: fillerAff.slice() }); if (pl.hor) c.horadric[pl.set.st.id] = pl.hor; if (pl.torch) c.torch = pl.set.st.id; }
      if (torch) sk.push({ t: 'u', id: TORCH, aff: [] }); uniqs.forEach(id => sk.push({ t: 'u', id, aff: [] }));
      const nT = n; if (sk.length > nT) return false; let r = 0; while (sk.length < nT) { const src = rares[r % Math.max(1, rares.length)]; sk.push(src ? JSON.parse(JSON.stringify(src)) : null); r++; }
      c.sockets = sk; x.invalidate(); return true; };
    const score = () => SC(obj, w);
    // rank sets by their best tier alone, and uniques alone, under the Legendary seal
    const setGain = sets.map(z => { let best = -1e99, bt = 0; for (const t of z.tiers) { if (!place('Talisman_Seal_Legendary', 0, [{ set: z, tier: t, hor: 0 }], [], false)) continue; const j = score(); if (j > best) { best = j; bt = t; } } return { z, best, bt }; }).sort((a, b) => b.best - a.best).slice(0, o.topSets);
    place('Talisman_Seal_Legendary', 0, [], [], false); const j0 = score();
    const uRank = uq.map(u => { place('Talisman_Seal_Legendary', 0, [], [u.id], false); return { id: u.id, name: u.name, j: score() }; }).filter(u => u.j > j0 + 1e-9).sort((a, b) => b.j - a.j).slice(0, o.topUniq);
    // set plans: none, one set, two sets; each tier the set has
    const plans = [[]]; setGain.forEach(a => a.z.tiers.forEach(t => plans.push([{ set: a.z, tier: t }])));
    for (let i = 0; i < setGain.length; i++) for (let k = i + 1; k < setGain.length; k++) for (const ta of setGain[i].z.tiers) for (const tb of setGain[k].z.tiers) plans.push([{ set: setGain[i].z, tier: ta }, { set: setGain[k].z, tier: tb }]);
    // Horadric points split across the plan's sets, and where the Torch's +1 goes
    const splits = (m, H) => { if (m === 0) return [[]]; if (m === 1) return Array.from({ length: H + 1 }, (_, h) => [h]); const out = []; for (let a = 0; a <= H; a++) for (let b = 0; a + b <= H; b++) out.push([a, b]); return out; };
    const top = []; const consider = (lbl, cfg) => { const j = score(); top.push({ j, lbl, cfg }); top.sort((a, b) => b.j - a.j); if (top.length > 4) top.pop(); };
    const labelOf = c => [((x.GD().seals || []).find(z => z.id === c.seal) || {}).name + (c.swap ? ' (unique swap)' : '')].concat(c.pl.map(p => p.set.st.name + ' ' + p.tier + '-piece' + (p.hor ? ' (' + p.hor + ' Horadric)' : '') + (p.torch ? ' (+Torch)' : '')), c.torch ? ['Hellfire Torch'] : [], c.ids.map(id => (uq.find(u => u.id === id) || {}).name)).join(', ');
    let tried = 0;
    // for each set plan, the seal, Torch use and Horadric split that leaves the most unique slots, then the most free sockets
    for (const plan of plans) { let pick = null;
      for (const [seal, swap] of SEALS) for (const torch of hasTorch ? [false, true] : [false]) for (const sp of splits(plan.length, o.hor)) for (const tIdx of torch && plan.length ? plan.map((_, i) => i).concat([-1]) : [-1]) {
        const pl = plan.map((p, i) => Object.assign({}, p, { hor: sp[i] || 0, torch: i === tIdx })); if (pl.some(p => p.hor && p.hor >= p.tier)) continue;
        S.charms.seal = seal; S.charms.sealSwap = !!swap; S.charms.sockets = []; x.invalidate(); const R = x.sealRules(); const uSlots = R.uniques + (torch ? 1 : 0) - (torch ? 1 : 0);
        const used = pl.reduce((a, p) => a + Math.max(1, Math.max(2, p.tier - R.minus) - p.hor - (p.torch ? 1 : 0)), 0)  + (torch ? 1 : 0); const free = R.sockets - used; if (free < 0) continue;
        const k = Math.min(uSlots, free); const key = [k, free - k, torch ? 1 : 0, -sp.reduce((a, b) => a + b, 0)];
        if (!pick || key[0] > pick.key[0] || (key[0] === pick.key[0] && (key[1] > pick.key[1] || (key[1] === pick.key[1] && (key[2] > pick.key[2] || (key[2] === pick.key[2] && key[3] > pick.key[3])))))) pick = { key, seal, swap, pl, torch, k }; }
      if (!pick) continue; const ids = uRank.slice(0, pick.k).map(u => u.id); if (!place(pick.seal, pick.swap, pick.pl, ids, pick.torch)) continue; tried++;
      const sealNm = ((x.GD().seals || []).find(z => z.id === pick.seal) || {}).name + (pick.swap ? ' (unique swap)' : '');
      consider([sealNm].concat(pick.pl.map(p => p.set.st.name + ' ' + p.tier + '-piece' + (p.hor ? ' (' + p.hor + ' Horadric)' : '') + (p.torch ? ' (+Torch)' : '')), pick.torch ? ['Hellfire Torch'] : [], ids.map(id => (uq.find(u => u.id === id) || {}).name)).join(', '), { seal: pick.seal, swap: pick.swap, pl: pick.pl, ids, torch: pick.torch }); }
    // the leaders: swap each unique for every other ranked one
    for (const t of top) { const c = t.cfg; for (let q = 0; q < c.ids.length; q++) for (const u of uRank) { if (c.ids.includes(u.id)) continue; const alt = c.ids.slice(); alt[q] = u.id; place(c.seal, c.swap, c.pl, c.ids, c.torch); const j0 = score(); place(c.seal, c.swap, c.pl, alt, c.torch); const j1 = score(); tried += 2; if (j1 > j0 + 1e-9) c.ids = alt; }
      t.lbl = labelOf(c); }
    // polish the leaders: best affixes on every set and rare charm
    const AFF = [...new Set((base.sockets || []).filter(Boolean).flatMap(c => c.aff || []).filter(Boolean))]; let best = null;
    for (const t of top) { const c = t.cfg; place(c.seal, c.swap, c.pl, c.ids, c.torch); S.charms.sockets.forEach(ck => { if (!ck || ck.t === 'u') return; ck.aff = []; for (let a = 0; a < 2; a++) { let b = null, bb = -1e99; for (const id of AFF) { if (ck.aff.includes(id)) continue; ck.aff[a] = id; x.invalidate(); const j = score(); if (j > bb) { bb = j; b = id; } } ck.aff[a] = b; } }); x.invalidate(); const j = score(); if (!best || j > best.j) best = { j, lbl: t.lbl, ch: JSON.parse(JSON.stringify(S.charms)) }; }
    // keep the old Talisman if nothing beat it
    const reset = v => { Object.keys(S.charms).forEach(k => delete S.charms[k]); Object.assign(S.charms, JSON.parse(JSON.stringify(v))); x.invalidate(); }; reset(JSON.parse(keep)); const jKeep = score();
    if (best && best.j > jKeep + 1e-9) { reset(best.ch); log.push('talisman: ' + best.lbl + ' (' + tried + ' layouts tried' + (o.hor ? ', ' + o.hor + ' Horadric jewelry points' : '') + ')'); }
    else log.push('talisman: kept ' + (top[0] ? 'the earlier layout; best new one was ' + top[0].lbl : 'the earlier layout'));
    window.LX_TALISMAN_TOP = top.map(t => t.lbl); return log; };
  return { glyphs, mercs, charms, charmCombos };
})();
