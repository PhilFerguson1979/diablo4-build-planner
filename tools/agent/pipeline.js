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


  // Rule 2 of the synergy maps: a payoff only counts if the build makes what it pays off.
  // State payoffs (crowd control, block, damage over time, a form...) are gated; stat payoffs (crit, Lucky Hit, movement) are not,
  // since any gear can supply those. Items that make their own trigger are kept.
  const GATED = new Set(['Block', 'Crowd control', 'Overpower', 'Damage over time', 'Thorns', 'Evade and Dodge',
    'Berserking', 'Shouts', 'Weapon swapping', 'Earthquakes and Dust Devils', 'Shapeshifting', 'Companions', 'Storm and Earth', 'Minions', 'Corpses', 'Blood Orbs', 'Shadow and Darkness',
    'Combo Points', 'Stealth and Concealment', 'Imbuements', 'Traps and Grenades', 'Crackling Energy', 'Burning', 'Frozen and Chilled', 'Enchantments and Conjurations',
    'Spirit Hall', 'Resolve and Counterattack', 'Aura cast / Aura Potency', 'Judgement', 'Arbiter form', 'Resolve (Juggernaut)', 'Fervor (Zealot)', 'Retribution',
    'Volatility', 'Demonform and Shadowform', 'Summons and demons', 'Hex and Sigils']);
  function engine(spec) { const T = ((window.SYNTAGS || {}).classes || {})[spec.cls]; if (!T) return null; const by = new Map(); T.powers.forEach(p => { const k = p.name; if (!by.has(k)) by.set(k, []); by.get(k).push(p); });
    const made = new Set(); const add = n => (by.get(n) || []).forEach(p => p.makes.forEach(m => made.add(m)));
    LAB.skills().forEach(s => { const m = s.match(/^(.+?) r\d+ \[(.*)\]$/); if (!m) return; add(m[1]); (m[2] ? m[2].split(', ') : []).forEach(u => add(m[1] + ' > ' + u)); });
    X.SLOTS.forEach(sl => { const g = S().gear[sl.id]; const it = g && X.findItem(g.item); if (it) add(it.name); });
    S().hotbar.forEach(id => { const P = C().powers[id]; if (P && P.tag === 'Aura') made.add('Aura cast / Aura Potency'); });
    (spec.makes || []).forEach(m => made.add(m));
    const dead = []; T.powers.forEach(p => { if (!/Aspect|Unique|Runeword/.test(p.kind)) return; const need = p.pays.filter(t => GATED.has(t) && !made.has(t) && !p.makes.includes(t)); if (need.length && !p.makes.some(t => GATED.has(t))) dead.push({ name: p.name, need }); });
    return { made: [...made], dead }; }
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Pit ladder: at each tier, does the build kill an elite before the elite kills it (the planner's time-to-die with healing),
  // and how long does the boss take. Compare against the starting build measured the same way: the planner's Pit model is harsher than the game.
  function ladder(dps, bossDps) { const rows = []; let hold = 0; const T2 = X.dfState(); const keep = T2.pit;
    for (let t = 60; t <= 150; t += 10) { T2.pit = t; let Dp; try { Dp = X.defense(); } catch (e) { break; } const el = Dp.cards.find(c => c.cat === 'elite'); const sv = (Dp.surv || []).find(q => q.cat === 'elite') || {};
      const row = { tier: t, eliteTTK: el ? +(el.life / Math.max(dps, 1)).toFixed(1) : null, eliteKillsYouIn: sv.ttd != null ? +sv.ttd.toFixed(1) : null, biggestHit: Math.round(Math.max(...Dp.cards.map(c => Math.max(...c.attacks.map(a => a.hit))))), life: Math.round(Dp.life) };
      row.ok = row.eliteTTK != null && row.eliteKillsYouIn != null && row.eliteTTK < row.eliteKillsYouIn; rows.push(row); if (row.ok) hold = t; }
    T2.pit = keep; X.invalidate(); return { rows, hold }; }

  function start(spec) {
    const lib = libOf(spec.cls); let b = spec.base ? lib.find(q => q.name === spec.base) || lib.find(q => q.name.includes(spec.base)) : null;
    if (!b) b = lib.find(q => !q.lab && (q.variants || []).length) || lib[0]; if (!b) throw new Error('no library build for ' + spec.cls);
    const r = resolve(b, spec.variant || 0); X.setState(clone(r.st)); const T = X.tcState(); T.wd = 2000; T.ws = 1; T.tg = spec.tg || 3; return b.name;
  }

  function build(spec) {
    const t0 = Date.now(); const log = []; const say = m => { log.push(m); console.log('AGENT: ' + m + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); }; const w = spec.w == null ? 0.5 : spec.w; const tg = spec.tg || 3;
    const baseName = start(spec); say('started from ' + baseName);
    const MAIN = pid(spec.main); if (!MAIN) throw new Error('no skill ' + spec.main + ' for ' + spec.cls); const P = C().powers[MAIN];
    const pts0 = LAB.points(); const unl0 = C().nodes.find(n => n.power === MAIN && n.kind === 'unlock'); const RANK = spec.rank || Math.max(5, (unl0 && S().alloc[unl0.i]) || 0, unl0 && unl0.max ? Math.min(15, unl0.max) : 5);
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
    const pickMods = () => { if (spec.mods) { LAB.setSkill(MAIN, RANK, spec.mods); X.invalidate(); return spec.mods; } let top = null; const vlist = vars.length ? vars : [null]; const pairs = []; if (ups.length < 2) pairs.push(ups.slice()); else for (let i = 0; i < ups.length; i++) for (let j = i + 1; j < ups.length; j++) pairs.push([ups[i], ups[j]]);
      for (const v of vlist) for (const pr of pairs) { const mods = enh.concat(v ? [v] : [], pr); if ((spec.needMods || []).some(n => !mods.includes(n))) continue; try { LAB.setSkill(MAIN, RANK, mods); } catch (e) { continue; } X.invalidate(); const v2 = best().dps + procs().t; if (!top || v2 > top.v) top = { v: v2, mods }; }
      if (top) LAB.setSkill(MAIN, RANK, top.mods); X.invalidate(); return top ? top.mods : []; };
    let mods = pickMods(); let PAY = best().k; say('main skill upgrades: ' + mods.join(', '));
    // keep the skill points the base build had
    let over = LAB.points() - pts0; const trim = []; if (over > 0) { const A = S().alloc; const unl = C().nodes.filter(n => n.kind === 'unlock' && n.power !== MAIN && A[n.i] > 1).sort((a, b) => A[b.i] - A[a.i]); for (const n of unl) { while (over > 0 && A[n.i] > 1) { A[n.i]--; over--; trim.push(C().powers[n.power].name); } } X.invalidate(); }
    const obj = () => { const r = LAB.line(MAIN, PAY, { tg }); const pr = procs(); return { tot: (r.dps || 0) + pr.t, parts: [] }; };
    const SC = () => { const d = obj().tot, e = LAB.ehp(); return Math.log(Math.max(d, 1)) + w * Math.log(Math.max(e, 1)); };
    const d0 = obj().tot, e0 = LAB.ehp(); let sc0 = {}; try { sc0 = X.buildScore() || {}; } catch (e) { sc0 = {}; } const lad0 = ladder(d0, sc0.boss || d0); say('starting point holds Pit ' + lad0.hold);
    // locked items stay put
    const lock = {}; for (const [slot, nm] of (spec.lock || [])) { const u = X.data().uniques.find(u => u.name === nm && u.kind !== 'charm') || X.data().uniques.find(u => u.name === nm) || null; const a = u ? null : X.data().aspects.find(a => a.name === nm); const it = u ? { t: 'u', id: u.id } : a ? { t: 'aspect', id: a.id } : null; if (!it) { log.push('lock not found: ' + nm); continue; } lock[slot] = it; S().gear[slot] = S().gear[slot] || { item: null, affixes: [], tempers: [], gems: [] }; S().gear[slot].item = clone(it); }
    for (const slot of (spec.mythic || [])) if (S().gear[slot]) S().gear[slot].mythic = true;
    X.invalidate(); const E = spec.gate === false ? null : engine(spec);
    const banParts = []; if (spec.ban) banParts.push(spec.ban); if (E && E.dead.length) banParts.push('^(' + E.dead.map(d => esc(d.name)).join('|') + ')( \\(.*\\))?$');
    if ((spec.tg || 3) > 1) { const iso = X.data().uniques.concat(X.data().aspects).filter(q => /isolated enem/i.test(String(q.desc || '').replace(/<[^>]+>/g, ''))).map(q => esc(q.name)); if (iso.length) banParts.push('^(' + [...new Set(iso)].join('|') + ')( \\(.*\\))?$'); }
    const ban = banParts.length ? new RegExp(banParts.join('|')) : null; window.AGENT_BAN = ban; if (E) say('engine: ' + E.made.join(', ') + '; ' + E.dead.length + ' payoffs left out for lack of a trigger');
    LAB.optimize(obj, { w, passes: 2, lock, ban }); say('gear searched (2 passes)');
    // Paragon: every board layout the class's library builds use, then glyphs for each socket
    let bestPara = clone(S().paragon), bj = SC(), paraFrom = 'kept from ' + baseName; const keepLv = clone((S().paragon || {}).glyphLv || {}); const cap0 = (S().paragon || {}).cap || 1e9;
    for (const b of libOf(spec.cls)) for (let v = 0; v < Math.min(2, (b.variants || []).length); v++) { const r = resolve(b, v); if (!r || !r.st || !r.st.paragon || (r.st.paragon.cap || 0) > cap0) continue; S().paragon = clone(r.st.paragon); X.invalidate(); const j = SC(); if (j > bj + 1e-9) { bj = j; bestPara = clone(r.st.paragon); paraFrom = b.name + ' (' + ((b.variants[v] || {}).t || 'variant ' + v) + ')'; } }
    S().paragon = bestPara; if (S().paragon) S().paragon.glyphLv = Object.assign({}, S().paragon.glyphLv || {}, keepLv); X.invalidate(); say('paragon boards from ' + paraFrom);
    mods = pickMods(); PAY = best().k; LAB.optimize(obj, { w, passes: 1, lock, ban }); say('gear searched again with the new boards');
    const els = spec.els || ['Physical', C().powers[MAIN].dmg || 'Physical'];
    const xlog = [].concat(LX.glyphs(obj, w), LX.mercs(obj, w)); window.charmFill(obj, w, els); xlog.push(...LX.charms(obj, w, els)); log.push(...xlog); say('glyphs, mercenaries and charms searched');
    PAY = best().k; X.invalidate();
    const E2 = E; return report(spec, { lad0, sc0, E: E2, MAIN, PAY, mods, trim, pts0, d0, e0, obj, procs, best, log, baseName, paraFrom, t0, tg });
  }

  const fmtN = v => { const n = +v; if (!isFinite(n)) return String(v); return Math.abs(n) >= 100 ? Math.round(n).toLocaleString('en-US') : String(Math.round(n * 10) / 10); };
  function report(spec, k) {
    const { MAIN, PAY, obj, procs, best, tg } = k; const St = S(); const T = X.tcState(); T.skill = MAIN; T.pay = PAY; T.tg = tg; X.invalidate();
    const fin = obj(); const b = best(); const pr = procs(); let sc = {}; try { sc = X.buildScore() || {}; } catch (e) { sc = {}; }
    const D = X.defense(); const M = X.statModel();
    const caps = Object.values(M).filter(d => d.cap).map(d => ({ id: d.id, stat: d.l, v: +(d.v || 0).toFixed(1), cap: d.cap, at: (d.v || 0) >= d.cap - 0.05 }));
    const elems = (D.ehp || []).map(e => ({ el: e.t, dr: +(e.dr * 100).toFixed(1), ehp: Math.round(e.ehp) }));
    const whatIf = (D.whatIf || []).slice(0, 6).map(q => ({ affix: q.n, gain: +(q.gain * 100).toFixed(1) }));
    const lad = ladder(fin.tot, sc.boss || fin.tot); const pit = lad.rows, hold = lad.hold;
    // rotation facts for the notes
    const rot = St.hotbar.map(id => { const P = C().powers[id]; if (!P) return null; const T3 = X.tcState(); const s0 = T3.skill, p0 = T3.pay; T3.skill = id; T3.pay = ''; let R = null; try { R = X.theory(); } catch (e) { R = null; } T3.skill = s0; T3.pay = p0; return { id, name: P.name, tag: P.tag, basic: !!+P.basic, main: id === MAIN, cd: R && R.castEvery ? +R.castEvery.toFixed(2) : 0, cost: (P.cost || []).length > 0, dmg: P.dmg || '' }; }).filter(Boolean);
    X.invalidate();
    const PD = X.data().paragon || {};
    const gear = X.SLOTS.map(s => { const g = St.gear[s.id]; const it = g && X.findItem(g.item); if (!it) return null; return { slot: s.id, slotName: SLOTN[s.id] || s.id, item: it.name, kind: g.item.t === 'u' ? (it.kind || 'unique') : 'aspect', mythic: !!g.mythic, fixed: (it.kind && it.kind !== 'charm' ? (it.affixes || []).slice(0, X.N_AFF) : []).map(h => String(h).replace(/<[^>]+>/g, '')), affixes: (g.affixes || []).slice(0, X.N_AFF - (it.kind && it.kind !== 'charm' ? Math.min(X.N_AFF, (it.affixes || []).length) : 0)).map(a => { const d = X.affixDef(a.id) || {}; return String(d.t || a.id).replace(/§/g, d.v != null ? fmtN(d.v) : '#'); }), tempers: (g.tempers || []).map(t => { const r = X.GD().tempers.find(r => r.id === t.rid); const o = r && (r.opts || []).find(o => o.id === t.oid); return o ? String(o.t).replace(/§/g, o.v != null ? fmtN(o.v) : (o.max != null ? fmtN(o.max) : '#')) : t.oid; }), gems: (g.gems || []).filter(Boolean) }; }).filter(Boolean);
    const glyphs = Object.entries((St.paragon || {}).glyphs || {}).map(([bd, gid]) => ({ board: ((((PD.boards || {})[St.cls] || []).find(q => q.id === bd)) || {}).name || bd, glyph: (PD.glyphs[gid] || {}).name || gid, level: ((St.paragon.glyphLv || {})[gid]) || 75 }));
    const BD = ((PD.boards || {})[St.cls] || []); const boards = ((St.paragon || {}).boards || []).map(x => { const id = x.id || x; const bd = BD.find(q => q.id === id); return bd ? bd.name : id; });
    const charms = (St.charms.sockets || []).map(c => { if (!c) return null; if (c.t === 'u') { const u = X.data().uniques.find(u => u.id === c.id); return { kind: 'unique', name: u ? u.name : c.id }; } if (c.t === 'set') { const st = X.classSets().find(s => s.id === c.id); return { kind: 'set', name: st ? st.name : c.id, piece: c.piece, aff: (c.aff || []).map(id => { const a = X.GD().charmAffixes.find(a => a.id === id); return a ? a.t.replace(/§/g, a.v != null ? fmtN(a.v) : '#') : id; }) }; } return { kind: 'rare', aff: (c.aff || []).map(id => { const a = X.GD().charmAffixes.find(a => a.id === id); return a ? a.t.replace(/§/g, a.v != null ? fmtN(a.v) : '#') : id; }) }; }).filter(Boolean);
    const seal = St.charms.seal ? ((X.data().uniques.find(u => u.id === St.charms.seal) || {}).name || St.charms.seal) : '';
    const M2 = X.mercState(); const ML = X.data().mercs || []; const mn = id => (ML.find(m => m.id === id) || {}).name || id || '';
    return { key: spec.key, name: spec.name, cls: spec.cls, base: k.baseName, main: C().powers[MAIN].name, pay: PAY, payN: b.n, mods: k.mods, trim: k.trim,
      dmg: { start: Math.round(k.d0), main: Math.round(b.dps), procs: pr.parts.map(p => ({ n: p.n, dps: Math.round(p.dps) })), total: Math.round(fin.tot), pack: Math.round(sc.pack || 0), boss: Math.round(sc.boss || 0), bestSkill: sc.name || '' },
      def: { start: Math.round(k.e0), ehp: Math.round(LAB.ehp()), life: Math.round(D.life), armor: Math.round(D.armor), armorDR: +((D.armorDR || 0) * 100).toFixed(1), block: +((D.block || 0) * 100).toFixed(1), dodge: +((D.dodge || 0) * 100).toFixed(1), elems, overCap: D.overCap || [], whatIf },
      caps, pit, pitHold: hold, pitHoldStart: k.lad0.hold, startScore: { pack: Math.round(k.sc0.pack || 0), boss: Math.round(k.sc0.boss || 0) }, rot, gear, glyphs, boards, paraFrom: k.paraFrom, charms, seal, mercs: { main: mn(M2.main), sup: mn(M2.sup), supSkill: (() => { const m = ML.find(m => m.id === M2.sup); const p = m && m.powers && (m.powers[M2.supSkill] || m.powers['NPC_' + M2.supSkill] || Object.values(m.powers).find(q => q.id && M2.supSkill && q.id.endsWith(M2.supSkill.replace(/^NPC_/, '')))); return p ? p.name : (M2.supSkill || ''); })() },
      engine: k.E ? { made: k.E.made, leftOut: (k.E.dead || []).length } : null, skills: LAB.skills(), bar: St.hotbar.map(id => (C().powers[id] || {}).name), log: k.log, secs: Math.round((Date.now() - k.t0) / 1000), st: clone(St) };
  }

  // report again from a saved result without searching (after the report code changes)
  function rereport(spec, prev) { const t0 = Date.now(); X.setState(clone(prev.st)); const T = X.tcState(); T.wd = 2000; T.ws = 1; const tg = spec.tg || 3; T.tg = tg; X.invalidate();
    const MAIN = pid(prev.main); const PAY = prev.pay;
    const pays = () => { const T = X.tcState(); T.skill = MAIN; T.pay = ''; try { const R = X.theory(); return R ? R.pays : []; } catch (e) { return []; } };
    const best = () => { const r = LAB.line(MAIN, PAY, { tg }); const p = pays().find(p => p.k === PAY) || {}; return { dps: r.dps || 0, k: PAY, n: p.n }; };
    const alsoBest = nm => { const id = pid(nm); if (!id) return { dps: 0, n: nm }; const T = X.tcState(); const s0 = T.skill, p0 = T.pay; T.skill = id; T.pay = ''; let ps = []; try { ps = X.theory().pays; } catch (e) { ps = []; } T.skill = s0; T.pay = p0; let b = { dps: 0, n: nm }; for (const p of ps) { if (p.proc) continue; const r = LAB.line(id, p.k, { tg }); if (r.dps > b.dps) b = { dps: r.dps, n: nm + ' ' + (p.n || p.k) }; } return b; };
    const procs = () => { let t = 0; const parts = []; for (const nm of (spec.also || [])) { const r = alsoBest(nm); if (r.dps > 0) { t += r.dps; parts.push({ n: r.n, dps: r.dps }); } } for (const k of (spec.sum || [])) { const r = LAB.line(MAIN, k, { tg }); if (r.dps > 0) { t += r.dps; parts.push({ n: k, dps: r.dps }); } } for (const p of pays()) if (p.proc) { const r = LAB.line(MAIN, p.k, { tg }); if (r.dps > 0) { t += r.dps; parts.push({ n: p.n || p.k, dps: r.dps }); } } return { t, parts }; };
    const obj = () => ({ tot: best().dps + procs().t, parts: [] });
    return report(spec, { lad0: { hold: prev.pitHoldStart || 0 }, sc0: prev.startScore || {}, E: prev.engine ? { made: prev.engine.made, dead: { length: prev.engine.leftOut } } : null, MAIN, PAY, mods: prev.mods, trim: prev.trim, pts0: 0, d0: prev.dmg.start, e0: prev.def.start, obj, procs, best, log: prev.log, baseName: prev.base, paraFrom: prev.paraFrom, t0, tg }); }
  return { build, start, pid, engine, rereport };
})();
