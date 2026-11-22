// The build agent's search: runs inside the planner page after lab.js and labx.js.
// AGENT.build(spec) turns a build idea into a full build: skill upgrades, every gear slot
// (item, four affixes, temper), Paragon boards, glyphs, mercenaries and charms, then
// measures damage, Effective Life, caps and how far up the Pit it should hold.
window.AGENT = (() => {
  const X = window.__D4X; const C = () => X.cdata(); const S = () => X.state(); const clone = o => JSON.parse(JSON.stringify(o));
  const pid = nm => Object.keys(C().powers).find(id => C().powers[id].name === nm);
  const libOf = cls => window.D4LIB.builds.filter(b => b.cls === cls);
  const resolve = (b, v) => { try { return window.__D4LIB.libResolve(b, v || 0); } catch (e) { return null; } };
  const SLOTN = { helm: 'Helm', chest: 'Chest', gloves: 'Gloves', pants: 'Pants', boots: 'Boots', amulet: 'Amulet', ring1: 'Ring', ring2: 'Ring', weapon: 'Weapon', offhand: 'Off-hand' };

  function start(spec) {
    const lib = libOf(spec.cls); let b = spec.base ? lib.find(q => q.name === spec.base) || lib.find(q => q.name.includes(spec.base)) : null;
    if (!b) b = lib.find(q => !q.lab && (q.variants || []).length) || lib[0]; if (!b) throw new Error('no library build for ' + spec.cls);
    const r = resolve(b, spec.variant || 0); X.setState(clone(r.st)); const T = X.tcState(); T.wd = 2000; T.ws = 1; T.tg = spec.tg || 3; return b.name;
  }

  function build(spec) {
    const t0 = Date.now(); const log = []; const say = m => { log.push(m); console.log('AGENT: ' + m + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); }; const w = spec.w == null ? 0.5 : spec.w; const tg = spec.tg || 3;
    const baseName = start(spec); say('started from ' + baseName);
    const MAIN = pid(spec.main); if (!MAIN) throw new Error('no skill ' + spec.main + ' for ' + spec.cls); const P = C().powers[MAIN];
    const pts0 = LAB.points();
    // the bar: a full bar from the spec, or the base bar with swaps
    let bar = S().hotbar.slice();
    if (spec.bar) { const want = spec.bar.map(pid).filter(Boolean); bar.filter(id => !want.includes(id)).forEach(id => LAB.setSkill(id, 0)); bar = want; }
    for (const [oldN, newN] of (spec.swap || [])) { const o = oldN ? pid(oldN) : null, n = pid(newN); if (o) LAB.setSkill(o, 0); if (bar.includes(n)) continue; const i = o ? bar.indexOf(o) : -1; if (i >= 0) bar[i] = n; else if (bar.length < 6) bar.push(n); else bar[bar.length - 1] = n; }
    if (!bar.includes(MAIN)) { if (bar.length < 6) bar.push(MAIN); else bar[bar.length - 1] = MAIN; }
    S().hotbar = bar;
    for (const id of bar) { const A = S().alloc; const u = C().nodes.find(n => n.power === id && n.kind === 'unlock'); if (u && !(A[u.i] > 0)) LAB.setSkill(id, 1); }
    if (spec.oath) LAB.oath(spec.oath); if (spec.mech) S().mech = Object.assign({}, S().mech, spec.mech);
    for (const [nm, r, mods] of (spec.extra || [])) LAB.setSkill(pid(nm), r, mods);
    X.invalidate();
    // the main skill's upgrades: every enhancement, then each variant with each pair of upgrades
    const hasNode = m => C().nodes.some(n => n.power === MAIN && n.kind === 'mod' && n.mod === m.id);
    const enh = P.mods.filter(m => /^M\d/.test(m.key) && hasNode(m)).map(m => m.name); const vars = P.mods.filter(m => /^Upgrade[ABC]$/.test(m.key) && hasNode(m)).map(m => m.name); const ups = P.mods.filter(m => /^Upgrade\d$/.test(m.key) && hasNode(m)).map(m => m.name);
    const pays = () => { const T = X.tcState(); T.skill = MAIN; T.pay = ''; try { const R = X.theory(); return R ? R.pays : []; } catch (e) { return []; } };
    const best = () => { let b = { dps: 0, k: '' }; for (const p of pays()) { if (p.proc || (spec.sum || []).includes(p.k)) continue; if (spec.pay && p.k !== spec.pay) continue; const r = LAB.line(MAIN, p.k, { tg }); if (r.dps > b.dps) b = { dps: r.dps, k: p.k, n: p.n }; } return b; };
    const alsoBest = nm => { const id = pid(nm); if (!id) return { dps: 0, n: nm }; const T = X.tcState(); const s0 = T.skill, p0 = T.pay; T.skill = id; T.pay = ''; let ps = []; try { ps = X.theory().pays; } catch (e) { ps = []; } T.skill = s0; T.pay = p0; let b = { dps: 0, n: nm }; for (const p of ps) { if (p.proc) continue; const r = LAB.line(id, p.k, { tg }); if (r.dps > b.dps) b = { dps: r.dps, n: nm + ' ' + (p.n || p.k) }; } return b; };
    const procs = () => { let t = 0; const parts = []; for (const nm of (spec.also || [])) { const r = alsoBest(nm); if (r.dps > 0) { t += r.dps; parts.push({ n: r.n, dps: r.dps }); } } for (const k of (spec.sum || [])) { const r = LAB.line(MAIN, k, { tg }); if (r.dps > 0) { t += r.dps; parts.push({ n: k, dps: r.dps }); } } for (const p of pays()) if (p.proc) { const r = LAB.line(MAIN, p.k, { tg }); if (r.dps > 0) { t += r.dps; parts.push({ n: p.n || p.k, dps: r.dps }); } } return { t, parts }; };
    const pickMods = () => { if (spec.mods) { LAB.setSkill(MAIN, 5, spec.mods); X.invalidate(); return spec.mods; } let top = null; const vlist = vars.length ? vars : [null]; const pairs = []; if (ups.length < 2) pairs.push(ups.slice()); else for (let i = 0; i < ups.length; i++) for (let j = i + 1; j < ups.length; j++) pairs.push([ups[i], ups[j]]);
      for (const v of vlist) for (const pr of pairs) { const mods = enh.concat(v ? [v] : [], pr); try { LAB.setSkill(MAIN, 5, mods); } catch (e) { continue; } X.invalidate(); const v2 = best().dps + procs().t; if (!top || v2 > top.v) top = { v: v2, mods }; }
      if (top) LAB.setSkill(MAIN, 5, top.mods); X.invalidate(); return top ? top.mods : []; };
    let mods = pickMods(); let PAY = best().k; say('main skill upgrades: ' + mods.join(', '));
    // keep the skill points the base build had
    let over = LAB.points() - pts0; const trim = []; if (over > 0) { const A = S().alloc; const unl = C().nodes.filter(n => n.kind === 'unlock' && n.power !== MAIN && A[n.i] > 1).sort((a, b) => A[b.i] - A[a.i]); for (const n of unl) { while (over > 0 && A[n.i] > 1) { A[n.i]--; over--; trim.push(C().powers[n.power].name); } } X.invalidate(); }
    const obj = () => { const r = LAB.line(MAIN, PAY, { tg }); const pr = procs(); return { tot: (r.dps || 0) + pr.t, parts: [] }; };
    const SC = () => { const d = obj().tot, e = LAB.ehp(); return Math.log(Math.max(d, 1)) + w * Math.log(Math.max(e, 1)); };
    const d0 = obj().tot, e0 = LAB.ehp();
    // locked items stay put
    const lock = {}; for (const [slot, nm] of (spec.lock || [])) { const u = X.data().uniques.find(u => u.name === nm && u.kind !== 'charm') || X.data().uniques.find(u => u.name === nm) || null; const a = u ? null : X.data().aspects.find(a => a.name === nm); const it = u ? { t: 'u', id: u.id } : a ? { t: 'aspect', id: a.id } : null; if (!it) { log.push('lock not found: ' + nm); continue; } lock[slot] = it; S().gear[slot] = S().gear[slot] || { item: null, affixes: [], tempers: [], gems: [] }; S().gear[slot].item = clone(it); }
    for (const slot of (spec.mythic || [])) if (S().gear[slot]) S().gear[slot].mythic = true;
    X.invalidate(); const ban = spec.ban ? new RegExp(spec.ban) : null;
    LAB.optimize(obj, { w, passes: 2, lock, ban }); say('gear searched (2 passes)');
    // Paragon: every board layout the class's library builds use, then glyphs for each socket
    let bestPara = clone(S().paragon), bj = SC(), paraFrom = 'kept from ' + baseName; const keepLv = clone((S().paragon || {}).glyphLv || {});
    for (const b of libOf(spec.cls)) for (let v = 0; v < Math.min(2, (b.variants || []).length); v++) { const r = resolve(b, v); if (!r || !r.st || !r.st.paragon) continue; S().paragon = clone(r.st.paragon); X.invalidate(); const j = SC(); if (j > bj + 1e-9) { bj = j; bestPara = clone(r.st.paragon); paraFrom = b.name + ' (' + ((b.variants[v] || {}).t || 'variant ' + v) + ')'; } }
    S().paragon = bestPara; if (S().paragon) S().paragon.glyphLv = Object.assign({}, S().paragon.glyphLv || {}, keepLv); X.invalidate(); say('paragon boards from ' + paraFrom);
    mods = pickMods(); PAY = best().k; LAB.optimize(obj, { w, passes: 1, lock, ban }); say('gear searched again with the new boards');
    const els = spec.els || ['Physical', C().powers[MAIN].dmg || 'Physical'];
    const xlog = [].concat(LX.glyphs(obj, w), LX.mercs(obj, w)); window.charmFill(obj, w, els); xlog.push(...LX.charms(obj, w, els)); log.push(...xlog); say('glyphs, mercenaries and charms searched');
    PAY = best().k; X.invalidate();
    return report(spec, { MAIN, PAY, mods, trim, pts0, d0, e0, obj, procs, best, log, baseName, paraFrom, t0, tg });
  }

  function report(spec, k) {
    const { MAIN, PAY, obj, procs, best, tg } = k; const St = S(); const T = X.tcState(); T.skill = MAIN; T.pay = PAY; T.tg = tg; X.invalidate();
    const fin = obj(); const b = best(); const pr = procs(); let sc = {}; try { sc = X.buildScore() || {}; } catch (e) { sc = {}; }
    const D = X.defense(); const M = X.statModel();
    const caps = Object.values(M).filter(d => d.cap).map(d => ({ id: d.id, stat: d.l, v: +(d.v || 0).toFixed(1), cap: d.cap, at: (d.v || 0) >= d.cap - 0.05 }));
    const elems = (D.ehp || []).map(e => ({ el: e.t, dr: +(e.dr * 100).toFixed(1), ehp: Math.round(e.ehp) }));
    const whatIf = (D.whatIf || []).slice(0, 6).map(q => ({ affix: q.n, gain: +(q.gain * 100).toFixed(1) }));
    // Pit ladder: highest tier with no one-shots, elites under 10 s and the boss under 90 s
    const pit = []; let hold = 0; const T2 = X.dfState(); const keepPit = T2.pit; const bossD = sc.boss || fin.tot;
    for (let t = 60; t <= 150; t += 10) { T2.pit = t; let Dp; try { Dp = X.defense(); } catch (e) { break; } const el = Dp.cards.find(c => c.cat === 'elite'); const bo = Dp.cards.find(c => c.cat === 'boss'); const big = Math.max(...Dp.cards.map(c => Math.max(...c.attacks.map(a => a.hit))));
      const row = { tier: t, eliteTTK: el ? +(el.life / Math.max(fin.tot, 1)).toFixed(1) : null, bossTTK: bo ? +(bo.life / Math.max(bossD, 1)).toFixed(1) : null, biggestHit: Math.round(big), life: Math.round(Dp.life) }; row.ok = big < Dp.life && (row.eliteTTK == null || row.eliteTTK <= 10) && (row.bossTTK == null || row.bossTTK <= 90); pit.push(row); if (row.ok) hold = t; }
    T2.pit = keepPit; X.invalidate();
    // rotation facts for the notes
    const rot = St.hotbar.map(id => { const P = C().powers[id]; if (!P) return null; const T3 = X.tcState(); const s0 = T3.skill, p0 = T3.pay; T3.skill = id; T3.pay = ''; let R = null; try { R = X.theory(); } catch (e) { R = null; } T3.skill = s0; T3.pay = p0; return { id, name: P.name, tag: P.tag, basic: !!+P.basic, main: id === MAIN, cd: R && R.castEvery ? +R.castEvery.toFixed(2) : 0, cost: (P.cost || []).length > 0, dmg: P.dmg || '' }; }).filter(Boolean);
    X.invalidate();
    const PD = X.data().paragon || {};
    const gear = X.SLOTS.map(s => { const g = St.gear[s.id]; const it = g && X.findItem(g.item); if (!it) return null; return { slot: s.id, slotName: SLOTN[s.id] || s.id, item: it.name, kind: g.item.t === 'u' ? (it.kind || 'unique') : 'aspect', mythic: !!g.mythic, affixes: (g.affixes || []).map(a => (X.affixDef(a.id) || {}).t || a.id).map(t => String(t).replace(/§/g, '#')), tempers: (g.tempers || []).map(t => { const r = X.GD().tempers.find(r => r.id === t.rid); const o = r && (r.opts || []).find(o => o.id === t.oid); return o ? o.t : t.oid; }), gems: (g.gems || []).filter(Boolean) }; }).filter(Boolean);
    const glyphs = Object.entries((St.paragon || {}).glyphs || {}).map(([bd, gid]) => ({ board: bd, glyph: (PD.glyphs[gid] || {}).name || gid, level: ((St.paragon.glyphLv || {})[gid]) || 75 }));
    const boards = ((St.paragon || {}).boards || (St.paragon || {}).b || []).map(x => Array.isArray(x) ? x[0] : (x.id || x.board || x)).map(id => { const bd = (PD.boards || {})[id]; return bd ? bd.name || id : id; });
    const charms = (St.charms.sockets || []).map(c => { if (!c) return null; if (c.t === 'u') { const u = X.data().uniques.find(u => u.id === c.id); return { kind: 'unique', name: u ? u.name : c.id }; } if (c.t === 'set') { const st = X.classSets().find(s => s.id === c.id); return { kind: 'set', name: st ? st.name : c.id, piece: c.piece, aff: c.aff }; } return { kind: 'rare', aff: (c.aff || []).map(id => { const a = X.GD().charmAffixes.find(a => a.id === id); return a ? a.t.replace(/§/g, '#') : id; }) }; }).filter(Boolean);
    const seal = St.charms.seal ? ((X.data().uniques.find(u => u.id === St.charms.seal) || {}).name || St.charms.seal) : '';
    const M2 = X.mercState(); const ML = X.data().mercs || []; const mn = id => (ML.find(m => m.id === id) || {}).name || id || '';
    return { key: spec.key, name: spec.name, cls: spec.cls, base: k.baseName, main: C().powers[MAIN].name, pay: PAY, payN: b.n, mods: k.mods, trim: k.trim,
      dmg: { start: Math.round(k.d0), main: Math.round(b.dps), procs: pr.parts.map(p => ({ n: p.n, dps: Math.round(p.dps) })), total: Math.round(fin.tot), pack: Math.round(sc.pack || 0), boss: Math.round(sc.boss || 0), bestSkill: sc.name || '' },
      def: { start: Math.round(k.e0), ehp: Math.round(LAB.ehp()), life: Math.round(D.life), armor: Math.round(D.armor), armorDR: +((D.armorDR || 0) * 100).toFixed(1), block: +((D.block || 0) * 100).toFixed(1), dodge: +((D.dodge || 0) * 100).toFixed(1), elems, overCap: D.overCap || [], whatIf },
      caps, pit, pitHold: hold, rot, gear, glyphs, boards, paraFrom: k.paraFrom, charms, seal, mercs: { main: mn(M2.main), sup: mn(M2.sup), supSkill: M2.supSkill || '' },
      skills: LAB.skills(), bar: St.hotbar.map(id => (C().powers[id] || {}).name), log: k.log, secs: Math.round((Date.now() - k.t0) / 1000), st: clone(St) };
  }
  return { build, start, pid };
})();
