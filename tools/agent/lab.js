// search harness: runs inside the planner page and drives its own maths
window.LAB = (() => {
  const X = window.__D4X; const clone = o => JSON.parse(JSON.stringify(o));
  const S = () => X.state(); const C = () => X.cdata();
  const st = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  function load(name, variant, cls) { const b = window.D4LIB.builds.find(x => (!cls || x.cls === cls) && (x.name === name || x.name.includes(name))); const r = window.__D4LIB.libResolve(b, variant || 0); X.setState(clone(r.st)); const T = X.tcState(); T.wd = 2000; T.ws = 1; T.wdAuto = 1; return b.name; }
  // one damage line: expected hit against elites times hits a second
  function line(skill, payKey, extra) { const T = X.tcState(); T.skill = skill; T.pay = payKey || ''; const ex = Object.assign({}, extra || {}); delete ex.seg; delete ex.riders; Object.assign(T, ex); { const sg0 = (extra && extra.seg != null) ? extra.seg : window.LAB_SEG; if (sg0 === 2) T.st = Object.assign({}, T.st || {}, { boss: true }); } let R; try { R = X.theory(); } catch (e) { return { dps: 0, err: e.message }; }
    if (!R || !(R.base > 0)) return { dps: 0, R }; if (payKey && (!R.payD || R.payD.k !== payKey)) return { dps: 0, miss: 1, R };
    const sg = (extra && extra.seg != null) ? extra.seg : (window.LAB_SEG != null ? window.LAB_SEG : 1); const rid = (extra && extra.riders === false) ? 0 : X.riderDps(sg).v; return { dps: R.segs[sg][1].exp * R.hps + rid, main: R.segs[sg][1].exp * R.hps, riders: rid, hit: R.segs[sg][1].exp, hps: R.hps, R }; }
  function lines(list) { let tot = 0; const parts = []; for (const l of list) { const r = line(l.skill, l.pay, l.extra); const v = r.dps * (l.w == null ? 1 : l.w); tot += v; parts.push({ n: l.n || l.skill + ':' + (l.pay || ''), dps: v, hit: r.hit, hps: r.hps, cast: r.R && r.R.castEvery }); } return { tot, parts }; }
  function ehp() { try { const D = X.defense(); return D ? D.now || 0 : 0; } catch (e) { return 0; } }
  // best single line of a build, for judging the meta builds the same way
  function bestLine() { let best = { dps: 0 }; for (const id of X.unlockedSkills()) { const P = C().powers[id]; if (!P || P.passive) continue; let pays = []; try { X.tcState().skill = id; X.tcState().pay = ''; const R = X.theory(); pays = R ? R.pays.map(p => p.k) : []; } catch (e) { pays = []; }
      for (const k of pays) { if (/^(GRIEF|ECHO|PROC)/.test(k)) continue; const r = line(id, k); if (r.dps > best.dps) best = { dps: r.dps, skill: P.name, pay: k, hit: r.hit, hps: r.hps }; } } return best; }
  const slotKind = id => id.replace(/\d$/, '');
  function score(obj, w) { const d = obj().tot; const e = ehp(); return { d, e, j: Math.log(Math.max(d, 1)) + (w == null ? 1 : w) * Math.log(Math.max(e, 1)) }; }
  // candidates for a slot: every unique or runeword the class can put there, and every aspect that fits
  function items(slotId) { const sl = X.SLOTS.find(s => s.id === slotId); const { uniq, asp } = X.slotItems(sl); const seen = new Set(); const out = [];
    const worn = new Set(X.SLOTS.filter(s => s.id !== slotId).map(s => { const it = X.findItem((S().gear[s.id] || {}).item); return it ? it.name.replace(/ \(.*\)$/, '') : ''; }));
    // a unique can be worn once, and the off-slot copies of a unique (a glove unique listed as a helm) are left out
    uniq.forEach(u => { const nm = u.name.replace(/ \(.*\)$/, ''); if (!seen.has(nm) && !worn.has(nm) && !/_(Helm|Chest|Gloves|Pants|Legs|Boots|Amulet|Ring|Shield)$/.test(u.id)) { seen.add(nm); out.push({ t: 'u', id: u.id, name: u.name, kind: u.kind, type: u.type }); } });
    asp.forEach(a => { if (!seen.has(a.name) && X.aspectFits(a, slotId) && !worn.has(a.name)) { seen.add(a.name); out.push({ t: 'aspect', id: a.id, name: a.name }); } }); return out; }
  function affixPool(slotId) { const k = slotKind(slotId); return X.GD().affixes.filter(a => a.slots.includes(k) && (!a.cls.length || a.cls.includes(S().cls))); }
  function temperPool(slotId) { const k = slotKind(slotId); const out = []; X.GD().tempers.forEach(r => { if (!(r.slots || []).includes(k) || (r.cls && r.cls !== S().cls)) return; (r.opts || []).forEach(o => out.push({ rid: r.id, oid: o.id, t: o.t })); }); return out; }
  function optimize(obj, opt) {
    opt = opt || {}; const w = opt.w == null ? 1 : opt.w; const log = []; const slots = opt.slots || X.SLOTS.map(s => s.id); const lock = opt.lock || {};
    for (let pass = 0; pass < (opt.passes || 2); pass++) for (const slot of slots) {
      if (slot === 'offhand' && X.offhandBlock()) continue; const G = S().gear; if (!G[slot]) G[slot] = { item: null, affixes: [], tempers: [], gems: [] };
      const cur = () => S().gear[slot]; let best = score(obj, w); let bestItem = cur().item;
      if (lock[slot] && lock[slot].id) cur().item = { t: lock[slot].t, id: lock[slot].id };
      if (!lock[slot]) { for (const it of items(slot)) { if (opt.ban && opt.ban.test(it.name)) continue; const keep = cur().item; cur().item = { t: it.t, id: it.id }; const off = slot === 'weapon' && X.twoHanded() ? G.offhand : null; if (off) delete G.offhand;
          const sc = score(obj, w); if (off) G.offhand = off; if (sc.j > best.j + 1e-9) { best = sc; bestItem = { t: it.t, id: it.id }; } cur().item = keep; }
        cur().item = bestItem; }
      // affixes: four different ones, picked one at a time
      // a unique drops with 2 guaranteed affixes and 2 random ones, and one enchant can reroll any of them:
      // try keeping both guaranteed affixes, or enchanting either one away, then pick the rest one at a time
      const pool = affixPool(slot); const itNow = X.findItem(cur().item); cur().seeded = 1;
      const G2 = itNow && itNow.kind === 'unique' ? X.fixedDefs0(itNow) : []; // a guaranteed affix stays even where the slot could not roll it (Rakanoth's Wake: All Damage Multiplier on boots)
      const pickAff = start => { const chosen = start.slice();
        for (let k = chosen.length; k < X.N_AFF; k++) { let top = null; cur().affixes = chosen.slice(); let b0 = -1e99;
          for (const a of pool) { if (chosen.some(c => c.id === a.id || (X.affixDef(c.id) && X.affixDef(c.id).t === a.t) || (a.fam && X.affixDef(c.id) && X.affixDef(c.id).fam === a.fam))) continue; cur().affixes = chosen.concat([{ id: a.id }]); const sc = score(obj, w); if (sc.j > b0) { b0 = sc.j; top = a; } }
          if (top) chosen.push({ id: top.id }); }
        cur().affixes = chosen; return chosen; };
      let chosen;
      if (G2.some(Boolean)) { let bE = null; const opts = [[0, 1], [1], [0]].map(keep => keep.map(i => G2[i]).filter(Boolean).map(d => ({ id: d.id, g: 1 })));
        for (const st of opts) { const ch = pickAff(st); const sc = score(obj, w); if (!bE || sc.j > bE.j + 1e-9) bE = { j: sc.j, ch: ch.slice() }; } cur().affixes = bE.ch; chosen = bE.ch; }
      else chosen = pickAff(((opt.aff || {})[slot] || []).filter(id => pool.some(a => a.id === id)).map(id => ({ id })));
      // temper
      let bt = null, bj = -1e99; for (const t of temperPool(slot)) { cur().tempers = [{ rid: t.rid, oid: t.oid }]; const sc = score(obj, w); if (sc.j > bj) { bj = sc.j; bt = t; } }
      cur().tempers = bt ? [{ rid: bt.rid, oid: bt.oid }] : [];
      const it = X.findItem(cur().item); const fin = score(obj, w);
      log.push({ pass, slot, item: it ? it.name : '-', aff: chosen.map(c => (X.affixDef(c.id) || {}).t), temper: bt ? bt.t : '', d: fin.d, e: fin.e });
    }
    return log;
  }
  // skill tree helpers
  function nodeOf(power, kind, modName) { const P = C().powers[power]; return C().nodes.find(n => n.power === power && n.kind === kind && (kind !== 'mod' || (P.mods.find(m => m.id === n.mod) || {}).name === modName)); }
  function setSkill(power, rank, mods) { const A = S().alloc; C().nodes.forEach(n => { if (n.power === power) delete A[n.i]; }); if (!(rank > 0)) return; const u = nodeOf(power, 'unlock'); if (u) A[u.i] = Math.min(rank, u.max || rank); (mods || []).forEach(m => { const n = nodeOf(power, 'mod', m); if (n) A[n.i] = n.max && n.max > 1 ? n.max : 1; else throw new Error('no mod ' + m + ' on ' + power); }); }
  function points() { return Object.values(S().alloc).reduce((a, b) => a + b, 0); }
  function oath(id) { const c = S().cls; S().mech = Object.assign({}, S().mech, { [c]: { picks: { 0: [id] }, bond: '', up: {} } }); }
  function skills() { return X.unlockedSkills().map(id => { const P = C().powers[id]; const c = X.skillCtx(id); return P.name + ' r' + c.lvl + ' [' + P.mods.filter(m => c.mods.has(m.key)).map(m => m.name).join(', ') + ']'; }); }
  function pit(tier) { const T = X.dfState(); T.pit = tier; const D = X.defense(); const el = D.cards.find(c => c.cat === 'elite'); const big = Math.max(...D.cards.map(c => Math.max(...c.attacks.map(a => a.hit)))); return { life: el ? el.life : 0, ehpLife: D.life, biggest: big, name: el && el.m.name }; }
  return { load, line, lines, ehp, bestLine, optimize, setSkill, points, oath, skills, pit, items, score, S, st };
})();
