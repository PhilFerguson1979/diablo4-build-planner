// glyph, mercenary and charm searches for any class (run inside the planner page after lab.js)
// greedy charm fill: 6 rare charms, 2 affixes each, no repeat inside one charm
window.charmFill = (obj, w, els) => { const X = window.__D4X; const S = X.state(); const unl = X.unlockedSkills().map(id => X.cdata().powers[id]).filter(Boolean);
  const pool = X.GD().charmAffixes.filter(a => (!a.cls.length || a.cls.includes(S.cls)) && a.t).filter(a => { if (/Resistance_Single|Movement|Potion|MaxResource|Virtue_(Clarity|Renew|Tenacity|Malice)|CC_Duration/.test(a.id)) return false; const el = a.id.match(/ElementalSurge_(\w+)$/); if (el) return els.includes(el[1]); const sk = a.t.match(/^\+§ to (.+?)(?: Skills)?$/); if (sk) return unl.some(q => q.name === sk[1] || (q.tags || []).includes(sk[1]) || q.tag === sk[1]) || /Core|Basic|Aura/.test(sk[1]); return true; }).map(a => a.id);
  const sc = () => { const d = obj().tot, e = LAB.ehp(); return Math.log(Math.max(d, 1)) + w * Math.log(Math.max(e, 1)); };
  S.charms.sockets = [0, 1, 2, 3, 4, 5].map(() => ({ t: 'r', aff: [] })); X.invalidate();
  for (let i = 0; i < 6; i++) for (let k = 0; k < 2; k++) { let best = null, bj = -1e99; for (const id of pool) { if (S.charms.sockets[i].aff.includes(id)) continue; S.charms.sockets[i].aff[k] = id; X.invalidate(); const j = sc(); if (j > bj) { bj = j; best = id; } } S.charms.sockets[i].aff[k] = best; X.invalidate(); }
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
    if (rules.uniques > 0) for (const u of uq) tryOpt(u.name, () => { const [si] = leastUseful(1, new Set()); if (si == null) return; S.charms.sockets[si] = { t: 'u', id: u.id, aff: [] }; fillAff([si]); });
    S.charms.sockets = JSON.parse(best); x.invalidate(); log.push('charms: ' + bestLbl); return log; };
  return { glyphs, mercs, charms };
})();
