/* D4 Build Planner: Diablo IV build planner */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const strip = s => String(s || '').replace(/<[^>]+>/g, '');
  const ALL = window.D4DATA || {};
  const CLASS_LIST = ['Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Rogue', 'Sorcerer', 'Spiritborn', 'Warlock'];
  // Main-stat damage scaling per point, matching community damage sheets.
  const MAINSTAT = { Barbarian: ['Strength', 0.0008], Druid: ['Willpower', 0.001625], Necromancer: ['Intelligence', 0.001625], Paladin: ['Strength', 0.001625], Rogue: ['Dexterity', 0.00125], Sorcerer: ['Intelligence', 0.001625], Spiritborn: ['Dexterity', 0.00125], Warlock: ['Intelligence', 0.00125] };
  const SIGILS = {
    Barbarian: 'M8 26 L24 6 M14 6 h10 v10 M6 20 l6 6 M20 18 l8 8',
    Druid: 'M16 4 C8 12 8 20 16 28 C24 20 24 12 16 4 Z M16 10 v18',
    Necromancer: 'M16 4 a9 9 0 0 1 9 9 c0 5-3 7-3 10 h-12 c0-3-3-5-3-10 a9 9 0 0 1 9-9 Z M12 13 h2 M18 13 h2 M13 27 v-4 M19 27 v-4',
    Paladin: 'M16 3 L26 8 V16 C26 22 21 27 16 29 C11 27 6 22 6 16 V8 Z M16 9 V23 M11 14 H21',
    Rogue: 'M6 26 L20 12 M20 12 L26 6 L24 14 Z M10 8 C14 10 16 14 16 18',
    Sorcerer: 'M16 3 L19 13 L29 16 L19 19 L16 29 L13 19 L3 16 L13 13 Z',
    Spiritborn: 'M16 5 C22 5 27 10 27 16 C27 22 22 27 16 27 M16 5 C10 5 5 10 5 16 M9 16 a7 7 0 0 0 14 0',
    Warlock: 'M16 4 L28 26 H4 Z M16 12 L22 23 H10 Z',
  };
  const SLOTS = [
    { id: 'helm', name: 'Helm', re: /^Helm/i },
    { id: 'chest', name: 'Chest', re: /Chest/i },
    { id: 'gloves', name: 'Gloves', re: /Gloves/i },
    { id: 'pants', name: 'Pants', re: /Legs|Pants/i },
    { id: 'boots', name: 'Boots', re: /Boots/i },
    { id: 'amulet', name: 'Amulet', re: /Amulet/i },
    { id: 'ring1', name: 'Ring', re: /^Ring/i },
    { id: 'ring2', name: 'Ring', re: /^Ring/i },
    { id: 'weapon', name: 'Weapon', re: /Axe|Sword|Mace|Flail|Scythe|Dagger|Wand|Staff|Bow|Crossbow|Polearm|Glaive|Spear|Quarterstaff|Hammer|Club|2H|1H/i, notRe: /Shield|Focus|Totem|OffHand/i },
    { id: 'offhand', name: 'Off-hand', re: /Shield|Focus|Totem|OffHand/i },
  ];
  const SEALS = [
    { id: 'none', name: 'Standard seal', minus: 0 },
    { id: 'diamond', name: 'Seal of the Diamond Mind (sets need 1 fewer charm, minimum 2)', minus: 1 },
  ];

  // ---------- state ----------
  const blank = cls => ({
    v: 1, cls, ver: 'live', name: 'Untitled build', alloc: {}, bonusRanks: 0, sel: null,
    gear: {}, charms: { seal: 'Talisman_Seal_MythicUnique_03', count: {}, horadric: {}, torch: '', uniques: [] },
    calc: {
      cd: { skill: '', base: '', cdr: [{ n: 'Relentless while moving', v: 0 }], flat: [{ n: 'Rune or proc cuts per second', v: 0 }], dur: '' },
      lh: { skill: '', base: '', bonus: 0, hits: 4, fx: [] },
      dmg: { wd: 4000, ms: 2500, ranks: 20, add: 250, cc: 60, cd: 200, vuln: 120, vulnUp: 80, mult: [{ n: 'Aspect slot', v: 60 }, { n: 'Unique power', v: 100 }] },
      ehp: { life: 12000, armorDr: 60, res: 70, dr: [{ n: 'Firm Decree', v: 30 }, { n: 'Righteous Will (2 min Resolve)', v: 20 }] },
    },
  });
  let S = load() || blank('Paladin');
  const data = () => ALL[S.ver] || ALL.live;
  const cdata = () => data().classes[S.cls];

  // older saves carried a typed-in gear CDR row; the build now supplies that itself
  function migrate(st) { try { st.calc.cd.cdr = (st.calc.cd.cdr || []).filter(r => r.n !== 'Gear and paragon CDR'); } catch (e) { /* ignore */ } return st; }
  function load() {
    try {
      const h = location.hash.match(/^#b=(.+)$/);
      if (h) return migrate(Object.assign(blank('Paladin'), JSON.parse(decodeURIComponent(escape(atob(h[1]))))));
    } catch (e) { /* ignore bad links */ }
    try { const j = localStorage.getItem('sanctuary-ledger'); if (j) return migrate(Object.assign(blank('Paladin'), JSON.parse(j))); } catch (e) { /* storage unavailable */ }
    return null;
  }
  function save() { try { localStorage.setItem('sanctuary-ledger', JSON.stringify(S)); } catch (e) { /* ignore */ } }
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
  function commit() { invalidate(); save(); renderLedger(); }

  // ---------- skill math ----------
  function activeMods(power) {
    const C = cdata(); const keys = new Set();
    for (const [i, r] of Object.entries(S.alloc)) { const n = C.nodes[i]; if (n && r > 0 && n.power === power && n.kind === 'mod') { const m = C.powers[power].mods.find(x => x.id === n.mod); if (m) keys.add(m.key); } }
    return keys;
  }
  function skillRank(power) {
    const C = cdata(); let r = 0;
    for (const [i, v] of Object.entries(S.alloc)) { const n = C.nodes[i]; if (n && n.kind === 'unlock' && n.power === power) r = Math.max(r, v); }
    return r;
  }
  // ---------- what the build adds to each skill: ranks, cooldown reduction, cost reduction, lucky hit, attack speed, crit ----------
  const CAT_ALIAS = { Werewolf: 'Wolf', Werebear: 'Bear', Earth: 'Nature Magic Earth', Storm: 'Nature Magic Storm', Pyromancy: 'Fire', Frost: 'Cold', Shock: 'Lightning', Darkness: 'Shadow', Judicator: 'Divine', Eagle: 'Spirit Sky', Jaguar: 'Spirit Plains', Gorilla: 'Spirit Forest', Centipede: 'Spirit Soil', Imbuement: 'Imbuements', Imbuements: 'Imbueable' };
  function skillIs(P, cat) {
    if (!cat) return true; if (cat === 'All') return true;
    const tags = [P.tag, ...(P.tags || [])]; const al = CAT_ALIAS[cat];
    if (tags.includes(cat) || (al && tags.includes(al))) return true;
    const k = effSchool(P); return !!(k && (k === cat || k === al || (SCHOOL_COL[k] && SCHOOL_COL[k][0] === cat)));
  }
  // sum every stat line "<prefix> suffix" whose prefix is empty, this skill's name, or a category the skill belongs to
  function skillLines(P, suffixRe) {
    const out = [];
    for (const e of sheetData().stats) {
      const m = e.key.match(suffixRe); if (!m) continue;
      const pre = (m[1] || '').trim(); let scope = '';
      if (pre === '' || pre === 'All') scope = 'all skills';
      else if (pre === P.name) scope = P.name;
      else if (/ Skills?$/.test(pre) ? skillIs(P, pre.replace(/ Skills?$/, '')) : skillIs(P, pre)) scope = pre;
      else continue;
      e.parts.forEach(pt => out.push({ v: pt.v, src: pt.src, scope }));
    }
    return out;
  }
  function skillBonus(power) {
    if (SB_CACHE[power]) return SB_CACHE[power];
    const P = cdata().powers[power]; if (!P) return { ranks: 0, rankParts: [], cdrParts: [], cdrKeep: 1, rcr: 0, rcrParts: [], lhc: 0, as: 0, cs: 0, csc: 0 };
    const rankParts = [];
    for (const e of sheetData().stats) {
      const m = e.key.match(/^§ to (.+)$/); if (!m) continue; const t = m[1].trim();
      let scope = null;
      if (t === P.name) scope = P.name; else if (t === 'All Skills') scope = 'all skills';
      else { const c = t.match(/^(.+) Skills$/); if (c && skillIs(P, c[1])) scope = t; }
      if (scope) e.parts.forEach(pt => rankParts.push({ v: pt.v, src: pt.src, scope }));
    }
    const cdrParts = skillLines(P, /^§% (.*?)\s*Cooldown Reduction$/);
    const rcrParts = skillLines(P, /^§% (.*?)\s*(?:Resource |Faith |Fury |Mana |Spirit |Energy |Essence |Vigor )?Cost Reduction$/);
    const sum = l => l.reduce((a, x) => a + x.v, 0);
    let keep = 1; cdrParts.forEach(x => { keep *= 1 - Math.max(0, Math.min(100, x.v)) / 100; });
    return SB_CACHE[power] = {
      ranks: Math.round(sum(rankParts)), rankParts, cdrParts, cdrKeep: Math.max(0.25, keep), cdrCapped: keep < 0.25,
      rcr: Math.min(100, sum(rcrParts)), rcrParts,
      lhc: sum(skillLines(P, /^§% (.*?)\s*Lucky Hit Chance$/)), as: sum(skillLines(P, /^§% (.*?)\s*Attack Speed$/)), cs: sum(skillLines(P, /^§% (.*?)\s*Cast Speed$/)),
      csc: sum(skillLines(P, /^§% (.*?)\s*Critical Strike Chance$/)), csd: sum(skillLines(P, /^§% (.*?)\s*Critical Strike Damage$/)),
    };
  }
  function skillCtx(power, rankOverride) {
    const P = cdata().powers[power]; const D = data(); const mods = activeMods(power);
    const baseRank = rankOverride != null ? rankOverride : skillRank(power); const SB = skillBonus(power);
    const gearRanks = baseRank > 0 ? SB.ranks : 0;
    const lvl = Math.max(1, baseRank + gearRanks + (baseRank > 0 ? (+S.bonusRanks || 0) : 0));
    const memo = {}; let depth = 0;
    const id = name => {
      if (name === 'sLevel' || name === 'Level') return lvl;
      if (name.startsWith('Mod.')) return mods.has(name.slice(4)) ? 1 : 0;
      const m = name.match(/^SF_(\d+)$/);
      if (m) {
        if (memo[name] !== undefined) return memo[name];
        if (depth > 30) return 0; depth++;
        const v = D4F.evaluate(P.sf[+m[1]] || '0', ctx); depth--; memo[name] = v; return v;
      }
      return 0;
    };
    const table = (i, l) => { const t = D.tables[i]; if (!t) return 0; return t[Math.max(0, Math.min(t.length - 1, Math.round(l)))]; };
    const ctx = { id, table };
    const ev = expr => D4F.evaluate(expr, ctx);
    return {
      P, mods, lvl, ev, baseRank, gearRanks, SB,
      cd: () => ev(P.cd), lh: () => ev(P.lh), cost: () => P.cost.length ? ev(P.cost[0]) : 0, charges: () => ev(P.charges),
      cdEff: () => ev(P.cd) * SB.cdrKeep, costEff: () => (P.cost.length ? ev(P.cost[0]) : 0) * (1 - SB.rcr / 100), lhEff: () => ev(P.lh) * (1 + SB.lhc / 100),
      text: tpl => D4T.render(tpl, {
        value: inner => ev(inner),
        token: n => {
          if (n.startsWith('payload:')) { const f = P.payloads[n.slice(8)]; return f === undefined ? '?' : '<b class="num">' + D4T.fmtNum(ev(f) * 100) + '%</b>'; }
          if (/^SF_\d+$/.test(n)) return ev(n);
          if (n === 'Cooldown Time') return ev(P.cd) * SB.cdrKeep;
          if (n === 'Combat Effect Chance') return ev(P.lh);
          if (n === 'Resource Cost') return (P.cost.length ? ev(P.cost[0]) : 0) * (1 - SB.rcr / 100);
          if (n === 'Max Charges') return ev(P.charges);
          return undefined;
        },
        cond: c => c === 'ADVANCED_TOOLTIP' ? false : c.startsWith('Mod.') ? mods.has(c.slice(4)) : false,
      }),
    };
  }

  // ---------- class rail ----------
  function renderRail() {
    $('#rail').innerHTML = '<div class="mark">D4 Build Planner</div>' + NAV.map(([g, items]) => `<p class="nav-g">${g}</p>` + items.map(([id, label]) => `<button class="nav-b" data-site="${id}" aria-current="${id === site ? 'page' : 'false'}">${esc(label)}</button>`).join('')).join('');
    $$('#rail [data-site]').forEach(b => b.onclick = () => showSite(b.dataset.site));
    $('#classStrip').innerHTML = CLASS_LIST.map(c =>
      `<button class="sigil" data-cls="${c}" aria-pressed="${c === S.cls}" title="${c}"><svg class="rail-crest" viewBox="-4 -4 40 40" aria-hidden="true"><circle cx="16" cy="16" r="19" class="rc-plate"/><circle cx="16" cy="16" r="17.2" class="rc-ring"/><g transform="translate(2.4 2.4) scale(0.85)">${D4ART.crest(c)}</g></svg><span>${c}</span></button>`).join('');
    $$('#classStrip .sigil').forEach(b => b.onclick = () => {
      if (b.dataset.cls === S.cls) return;
      const keep = { ver: S.ver };
      S = Object.assign(blank(b.dataset.cls), keep); S.name = 'Untitled ' + b.dataset.cls; renderAll(); commit();
    });
  }
  function renderHeader() {
    $('#buildName').value = S.name;
    const D = data();
    $('#classLine').textContent = `${S.cls}, ${S.ver === 'ptr' ? 'Season 16 PTR' : 'Season 15 live'} game data, build ${D.meta.build || ''}`;
    $$('.season-toggle button').forEach(b => { b.classList.toggle('on', b.dataset.ver === S.ver); b.disabled = !ALL[b.dataset.ver]; });
  }

  // ---------- skill tree ----------
  let view = null;
  const R = { unlock: 300, mod: 158, hub: 80, trunk: 96 };
  const TREE_K = 1.55;
  const layCache = new Map();
  // The game's own node positions, spread out evenly and read top-down (basic skills first).
  function layout() {
    const C = cdata(); if (layCache.has(C)) return layCache.get(C);
    const N = C.nodes; const adj = N.map(() => []);
    for (const [a, b] of C.links) { if (adj[a] && adj[b]) { adj[a].push(b); adj[b].push(a); } }
    const trunk = new Set(N.filter(n => n.kind === 'hub' && !adj[n.i].some(j => N[j].kind === 'mod')).map(n => n.i));
    const P = N.map(n => [n.x * TREE_K, n.y * TREE_K]);
    const hubSkill = {};
    for (const n of N) if (n.kind === 'hub' && !trunk.has(n.i)) { const m = adj[n.i].map(j => N[j]).find(x => x.kind === 'mod'); if (m) hubSkill[n.i] = m.power; }
    const tiers = [...trunk].map(i => N[i]).sort((a, b) => a.y - b.y).map(n => n.i);
    // painted icons for the three-way choice upgrades
    const groups = [];
    const byPow = {}; for (const n of N) if (n.kind === 'mod') ((byPow[n.power] = byPow[n.power] || {})[n.g] = (byPow[n.power][n.g] || [])).push(n);
    for (const [pw, gs] of Object.entries(byPow)) { const Pw = C.powers[pw]; if (!Pw) continue; for (const list of Object.values(gs)) if (list.length >= 3) groups.push({ skill: Pw.name, mods: list.map(n => { const md = (Pw.mods || []).find(m => m.id === n.mod) || {}; return { id: n.i, text: (md.name || '') + ' ' + (md.desc || '') }; }) }); }
    const modIcon = window.modIconsFor ? window.modIconsFor(S.cls, groups) : {};
    const out = { P, trunk, tiers, hubSkill, modIcon }; layCache.set(C, out); return out;
  }
  function treeBounds() {
    const { P } = layout(); let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of P) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const pad = 520; return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2 + 1400 };
  }
  function nodeLabel(n) {
    const C = cdata();
    if (n.kind === 'unlock') return C.powers[n.power] ? C.powers[n.power].name : '';
    if (n.kind === 'mod') { const P = C.powers[n.power]; const m = P && P.mods.find(x => x.id === n.mod); return m ? m.name : ''; }
    return '';
  }
  function groupSiblings(n) { const C = cdata(); return C.nodes.filter(x => x !== n && x.kind === 'mod' && x.g === n.g && x.power === n.power); }
  // ---------- skill tree look (original art in the spirit of the in-game tree) ----------
  const spikes = (r, n, h, rot) => { let d = ''; for (let k = 0; k < n * 2; k++) { const a = Math.PI * k / n - Math.PI / 2 + (rot || 0); const rr = k % 2 ? r : r + h; d += (k ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1); } return d + 'Z'; };
  // star for the cluster centres: 4 long points, 4 short
  const STAR = (() => { let d = ''; const pts = 16; for (let k = 0; k < pts; k++) { const a = Math.PI * 2 * k / pts - Math.PI / 2; const rr = k % 4 === 0 ? 300 : k % 2 === 0 ? 210 : 150; d += (k ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1); } return d + 'Z'; })();
  const THORNS = spikes(118, 22, 22);
  // spiky diamond frame for choice upgrades
  const SPIKY_DIAMOND = (s => { const t = 0.28 * s, k = 0.16 * s; return `M0 ${-s - t} L${k} ${-s + k} L${s / 2} ${-s / 2 - k} L${s / 2 + k * 0.4} ${-s / 2 + k * 0.4} L${s + t} 0 L${s - k} ${k} L${s / 2 + k} ${s / 2} L${s / 2 - k * 0.4} ${s / 2 + k * 0.4} L0 ${s + t} L${-k} ${s - k} L${-s / 2} ${s / 2 + k} L${-s / 2 - k * 0.4} ${s / 2 - k * 0.4} L${-s - t} 0 L${-s + k} ${-k} L${-s / 2 - k} ${-s / 2} L${-s / 2 + k * 0.4} ${-s / 2 - k * 0.4} Z`; })(150);
  const DMG_BG = { Holy: ['#e8c76a', '#6e4a14'], Fire: ['#ef8a3e', '#5e1c08'], Lightning: ['#8e8af0', '#231d63'], Cold: ['#5ec7cf', '#0f3c44'], Poison: ['#93c75a', '#203e12'], Shadow: ['#a46ad8', '#2a0f44'], Physical: ['#6fb3a6', '#173a35'], '': ['#a99a80', '#2d261f'] };
  // recolour the painted (orange) skill art to the skill's damage type
  const TINT_RAMP = { Holy: ['#1a1204', '#7a5410', '#f1c75a', '#fff6d8'], Lightning: ['#0c0a22', '#3a33a8', '#a7a2ff', '#f2f0ff'], Cold: ['#04161a', '#13606c', '#7fe0ea', '#effeff'], Poison: ['#081405', '#2f6a14', '#a8e05a', '#f6ffe8'], Shadow: ['#120620', '#4e1c86', '#c48af0', '#fbf0ff'], Physical: ['#0a0f0e', '#2e5f58', '#a8d8cc', '#f4fffb'], '': ['#140f0a', '#5e4a30', '#d8c09a', '#fff8ec'] };
  const hx = c => [1, 3, 5].map(i => (parseInt(c.slice(i, i + 2), 16) / 255).toFixed(3));
  // skill schools: each class groups its skills (Disciple, Juggernaut, Zealot; Blood, Bone, Shadow; and so on), one colour per school
  const R4 = (a, b, c, d) => [a, b, c, d];
  const SCHOOL_COL = {
    Disciple: ['Disciple', R4('#1a1204', '#7a5410', '#f1c75a', '#fff6d8'), '#f1c75a'], Juggernaut: ['Juggernaut', R4('#0d0e11', '#5c626d', '#dfe5ee', '#ffffff'), '#dfe5ee'], Zealot: ['Zealot', null, '#ef8a3e'], Divine: ['Judicator', R4('#06121e', '#2a5f8a', '#a8d4f5', '#f4fbff'), '#9fd0f2'], PalOther: ['Valor and Justice', R4('#100c12', '#5a4a6a', '#d6c6e8', '#fbf7ff'), '#cbb8e0'],
    Bludgeoning: ['Bludgeoning', R4('#0d0f12', '#46525e', '#c4ccd4', '#fafcff'), '#b8c2cc'], Slashing: ['Slashing', R4('#1a0505', '#7a1414', '#e8574a', '#ffe6e0'), '#e05046'], DualWield: ['Dual Wield', null, '#ef8a3e'], Shout: ['Shouts', R4('#1a1204', '#7a5410', '#f1c75a', '#fff6d8'), '#f1c75a'], BarbOther: ['Martial', R4('#0a0f0e', '#2e5f58', '#a8d8cc', '#f4fffb'), '#8fc7bb'],
    Wolf: ['Werewolf', R4('#120d04', '#6a4a12', '#e0b45a', '#fff4dc'), '#d8a84e'], Bear: ['Werebear', R4('#140904', '#6a3214', '#d0844a', '#fff0e2'), '#c97a44'], Earth: ['Earth', R4('#081405', '#2f6a14', '#a8e05a', '#f6ffe8'), '#9ad455'], Storm: ['Storm', R4('#0c0a22', '#3a33a8', '#a7a2ff', '#f2f0ff'), '#a39cff'], Nature: ['Nature Magic', R4('#04161a', '#13606c', '#7fe0ea', '#effeff'), '#78d8e2'],
    Blood: ['Blood', R4('#1a0505', '#7a1414', '#e8574a', '#ffe6e0'), '#e05046'], Bone: ['Bone', R4('#12100c', '#5e5646', '#e6dcc4', '#fffdf6'), '#e0d4b8'], Shadow: ['Shadow', R4('#120620', '#4e1c86', '#c48af0', '#fbf0ff'), '#c084ec'], Summon: ['Summoning', R4('#081405', '#2f6a14', '#a8e05a', '#f6ffe8'), '#9ad455'], Macabre: ['Macabre', R4('#0a0f0e', '#2e5f58', '#a8d8cc', '#f4fffb'), '#8fc7bb'],
    Cutthroat: ['Cutthroat', R4('#1a0505', '#7a1414', '#e8574a', '#ffe6e0'), '#e05046'], Marksman: ['Marksman', R4('#04161a', '#13606c', '#7fe0ea', '#effeff'), '#78d8e2'], Trap: ['Traps and Grenades', null, '#ef8a3e'], Imbue: ['Imbuements', R4('#120620', '#4e1c86', '#c48af0', '#fbf0ff'), '#c084ec'], RogOther: ['Agility and Subterfuge', R4('#0a0f0e', '#2e5f58', '#a8d8cc', '#f4fffb'), '#8fc7bb'],
    Fire: ['Pyromancy', null, '#ef8a3e'], Cold: ['Frost', R4('#04161a', '#13606c', '#7fe0ea', '#effeff'), '#78d8e2'], Lightning: ['Shock', R4('#0c0a22', '#3a33a8', '#a7a2ff', '#f2f0ff'), '#a39cff'], SorcOther: ['Conjuration', R4('#100c12', '#5a4a6a', '#d6c6e8', '#fbf7ff'), '#cbb8e0'],
    Jaguar: ['Jaguar', null, '#ef8a3e'], Gorilla: ['Gorilla', R4('#120d04', '#6a4a12', '#e0b45a', '#fff4dc'), '#d8a84e'], Eagle: ['Eagle', R4('#0c0a22', '#3a33a8', '#a7a2ff', '#f2f0ff'), '#a39cff'], Centipede: ['Centipede', R4('#081405', '#2f6a14', '#a8e05a', '#f6ffe8'), '#9ad455'], SpiOther: ['Spirit', R4('#0a0f0e', '#2e5f58', '#a8d8cc', '#f4fffb'), '#8fc7bb'],
    Hellfire: ['Hellfire', null, '#ef8a3e'], Abyss: ['Abyss', R4('#120620', '#4e1c86', '#c48af0', '#fbf0ff'), '#c084ec'], Occult: ['Occult', R4('#081405', '#2f6a14', '#a8e05a', '#f6ffe8'), '#9ad455'], Demon: ['Demonology', R4('#1a0505', '#7a1414', '#e8574a', '#ffe6e0'), '#e05046'], WarOther: ['Warlock', R4('#100c12', '#5a4a6a', '#d6c6e8', '#fbf7ff'), '#cbb8e0'],
  };
  const SCHOOL_RULES = {
    Paladin: [['Disciple', 'Disciple'], ['Juggernaut', 'Juggernaut'], ['Zealot', 'Zealot'], ['Divine', 'Divine'], [null, 'PalOther']],
    Barbarian: [['Shout', 'Shout'], ['Bludgeoning', 'Bludgeoning'], ['Slashing', 'Slashing'], ['DualWield', 'DualWield'], [null, 'BarbOther']],
    Druid: [['Wolf', 'Wolf'], ['Bear', 'Bear'], ['Nature Magic Earth', 'Earth'], ['Nature Magic Storm', 'Storm'], [null, 'Nature']],
    Necromancer: [['Blood', 'Blood'], ['Bone', 'Bone'], ['Shadow', 'Shadow'], ['Corruption', 'Shadow'], ['Summoning', 'Summon'], [null, 'Macabre']],
    Rogue: [['Imbueable', null], ['Cutthroat', 'Cutthroat'], ['Marksman', 'Marksman'], ['Trap', 'Trap'], ['Grenade', 'Trap'], ['Imbuement', 'Imbue'], [null, 'RogOther']],
    Sorcerer: [['Fire', 'Fire'], ['Cold', 'Cold'], ['Lightning', 'Lightning'], [null, 'SorcOther']],
    Spiritborn: [['Spirit Plains', 'Jaguar'], ['Spirit Forest', 'Gorilla'], ['Spirit Sky', 'Eagle'], ['Spirit Soil', 'Centipede'], [null, 'SpiOther']],
    Warlock: [['Hellfire', 'Hellfire'], ['Abyss', 'Abyss'], ['Occult', 'Occult'], ['Demonology', 'Demon'], [null, 'WarOther']],
  };
  function schoolOf(P) {
    const tags = (P && P.tags) || []; const rules = SCHOOL_RULES[S.cls] || [];
    if (S.cls === 'Rogue' && !tags.includes('Cutthroat') && !tags.includes('Marksman') && /Imbu|Poison Imbue|Cold Imbue|Shadow Imbue/i.test(P && P.name || '')) return 'Imbue';
    for (const [t, k] of rules) if (k && (t === null || tags.includes(t))) return k;
    return null;
  }
  // an upgrade that turns the skill into another school ("Advance becomes a Disciple Skill") takes that school's colour
  const SCHOOL_WORD = { Disciple: 'Disciple', Juggernaut: 'Juggernaut', Zealot: 'Zealot', Divine: 'Divine', Judicator: 'Divine', Werewolf: 'Wolf', Werebear: 'Bear', Earth: 'Earth', Storm: 'Storm', Blood: 'Blood', Bone: 'Bone', Shadow: 'Shadow', Darkness: 'Shadow', Pyromancy: 'Fire', Frost: 'Cold', Shock: 'Lightning', Cutthroat: 'Cutthroat', Marksman: 'Marksman', Jaguar: 'Jaguar', Gorilla: 'Gorilla', Eagle: 'Eagle', Centipede: 'Centipede', Hellfire: 'Hellfire', Abyss: 'Abyss', Occult: 'Occult', Demonology: 'Demon', Brawling: 'Brawling' };
  SCHOOL_COL.Brawling = ['Brawling', R4('#140904', '#6a3214', '#d0844a', '#fff0e2'), '#c97a44'];
  function modSchool(md) {
    const d = String((md && md.desc) || '').replace(/\{[^}]*\}/g, '').replace(/<[^>]+>/g, '');
    const m = d.match(/(?:becomes|is now(?: also)?|is also|now counts as)\s+an?\s+([A-Z][a-z]+)\s+[Ss]kill/);
    return m && SCHOOL_WORD[m[1]] ? SCHOOL_WORD[m[1]] : null;
  }
  // the skill's school after its chosen upgrades
  function effSchool(P) {
    if (!P) return null; const C = cdata();
    for (const [i, r] of Object.entries(S.alloc)) { const n = C.nodes[i]; if (r > 0 && n && n.kind === 'mod' && n.power === P.id) { const k = modSchool(P.mods.find(x => x.id === n.mod)); if (k) return k; } }
    return schoolOf(P);
  }
  const schoolTint = k => k && SCHOOL_COL[k] && SCHOOL_COL[k][1] ? `filter="url(#tintS${k})"` : '';
  const schoolCss = k => k && SCHOOL_COL[k] && SCHOOL_COL[k][1] ? `filter:url(#tintS${k})` : '';

  const tintFilter = (id, ramp) => { const ch = ramp.map(hx); return `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.36 0.6 0.14 0 0  0.36 0.6 0.14 0 0  0.36 0.6 0.14 0 0  0 0 0 1 0"/><feComponentTransfer>${['R', 'G', 'B'].map((c, i) => `<feFunc${c} type="table" tableValues="${ch.map(x => x[i]).join(' ')}"/>`).join('')}</feComponentTransfer></filter>`; };
  const SCHOOL_TINTS = Object.entries(SCHOOL_COL).filter(([, v]) => v[1]).map(([k, v]) => tintFilter('tintS' + k, v[1])).join('');
  const TINTS = Object.entries(TINT_RAMP).map(([k, ramp]) => { const ch = ramp.map(hx); return `<filter id="tint${k || 'None'}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.36 0.6 0.14 0 0  0.36 0.6 0.14 0 0  0.36 0.6 0.14 0 0  0 0 0 1 0"/><feComponentTransfer>${['R', 'G', 'B'].map((c, i) => `<feFunc${c} type="table" tableValues="${ch.map(x => x[i]).join(' ')}"/>`).join('')}</feComponentTransfer></filter>`; }).join('');
  const skillImg = (cls, name, size) => `img/skills/${window.skillIconFor ? window.skillIconFor(cls, name) : 1}.png`;
  const TREE_DEFS = `<defs>
    <filter id="fStone" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0022 0.003" numOctaves="5" seed="7"/><feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.19  0 0 0 0 0.17  0 0 0 0.45 0"/></filter>
    <radialGradient id="gVig" cx="50%" cy="50%" r="70%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></radialGradient>
    <linearGradient id="gIron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d8378"/><stop offset="0.45" stop-color="#3d3631"/><stop offset="0.55" stop-color="#2a2420"/><stop offset="1" stop-color="#6b6158"/></linearGradient>
    <linearGradient id="gBlood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b5a"/><stop offset="0.45" stop-color="#b3141c"/><stop offset="0.55" stop-color="#7a0b10"/><stop offset="1" stop-color="#d8303a"/></linearGradient>
    <radialGradient id="gPlate" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#2a2725"/><stop offset="1" stop-color="#0c0b0a"/></radialGradient>
    <radialGradient id="gRedGlow" r="50%"><stop offset="0" stop-color="#e02a2a" stop-opacity="0.55"/><stop offset="1" stop-color="#e02a2a" stop-opacity="0"/></radialGradient>
    ${TINTS}${SCHOOL_TINTS}
    <clipPath id="clipDia"><rect x="-88" y="-88" width="176" height="176" rx="4" transform="rotate(45)"/></clipPath>
    <clipPath id="clipTile"><rect x="-205" y="-205" width="410" height="410" rx="5"/></clipPath>
    ${Object.entries(DMG_BG).map(([k, [a, b]]) => `<radialGradient id="gDmg${k || 'None'}" cx="40%" cy="30%" r="85%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`).join('')}
  </defs>`;
  const ICON_INK = '#f7eedc';
  const inkMotif = (m, scale) => `<g transform="scale(${scale})"><path d="${D4ART.paths[m]}" fill="none" stroke="#0a0705" stroke-width="${11}" stroke-linejoin="round" stroke-linecap="round" opacity="0.7"/><path d="${D4ART.paths[m]}" fill="none" stroke="${ICON_INK}" stroke-width="${5.5}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  // route from a skill to one of its branch points: out sideways, then a rounded turn
  function elbow(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay; if (Math.abs(dx) < 30 || Math.abs(dy) < 30) return `M${ax} ${ay} L${bx} ${by}`;
    const r = Math.min(Math.abs(dx), Math.abs(dy), 260); const sx = Math.sign(dx), sy = Math.sign(dy);
    return `M${ax} ${ay} L${bx - sx * r} ${ay} Q${bx} ${ay} ${bx} ${ay + sy * r} L${bx} ${by}`;
  }
  // Put each skill name where it covers the fewest nodes and other names.
  const labelCache = new Map();
  function placeLabels(labels, C, P, L) {
    const FS = 200, CW = 0.56 * FS;
    let spots = labelCache.get(C);
    if (!spots) {
      const circles = C.nodes.map(n => [P[n.i][0], P[n.i][1], (n.kind === 'unlock' ? R.unlock + 60 : n.kind === 'mod' ? R.mod + 70 : L.trunk.has(n.i) ? R.trunk + 20 : R.hub + 20)]);
      const boxes = []; spots = new Map();
      const overlap = (b) => {
        let s = 0;
        for (const [cx, cy, cr] of circles) { const dx = Math.max(b.x0 - cx, 0, cx - b.x1), dy = Math.max(b.y0 - cy, 0, cy - b.y1); if (dx * dx + dy * dy < cr * cr) s += cr * 2; }
        for (const o of boxes) { const w = Math.min(b.x1, o.x1) - Math.max(b.x0, o.x0), h = Math.min(b.y1, o.y1) - Math.max(b.y0, o.y0); if (w > 0 && h > 0) s += w + h + 600; }
        for (const [a, b2] of C.links) { const [x1, y1] = P[a], [x2, y2] = P[b2]; for (let t = 0.15; t < 0.9; t += 0.15) { const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t; if (px > b.x0 && px < b.x1 && py > b.y0 && py < b.y1) s += 40; } }
        return s;
      };
      const order = labels.slice().sort((a, b) => a.y - b.y || a.x - b.x);
      for (const l of order) {
        const w = l.text.length * CW, h = FS, r = l.r;
        const cand = [
          { x: l.x, y: l.y + r + 250, a: 'middle', pen: 0 },
          { x: l.x, y: l.y - r - 110, a: 'middle', pen: 60 },
          { x: l.x + r + 70, y: l.y + 70, a: 'start', pen: 120 },
          { x: l.x - r - 70, y: l.y + 70, a: 'end', pen: 120 },
          { x: l.x, y: l.y + r + 520, a: 'middle', pen: 260 },
          { x: l.x, y: l.y - r - 380, a: 'middle', pen: 300 },
        ].map(c => { const x0 = c.a === 'middle' ? c.x - w / 2 : c.a === 'start' ? c.x : c.x - w; const b = { x0, x1: x0 + w, y0: c.y - FS * 0.8, y1: c.y + FS * 0.25 }; return Object.assign(c, { b, score: overlap(b) + c.pen }); });
        cand.sort((a, b) => a.score - b.score); const best = cand[0];
        boxes.push(best.b); spots.set(l.n.i, best);
      }
      labelCache.set(C, spots);
    }
    return labels.map(l => { const sp = spots.get(l.n.i); return `<text class="label${l.on ? ' on' : ''}" x="${sp.x}" y="${sp.y}" style="text-anchor:${sp.a}">${esc(l.text)}</text>`; });
  }
  function renderSchoolLegend() {
    const el = $('#treeLegend'); if (!el) return; const C = cdata(); const cnt = {};
    Object.values(C.powers).filter(p => !p.passive).forEach(p => { const k = schoolOf(p); if (k) cnt[k] = (cnt[k] || 0) + 1; (p.mods || []).forEach(m => { const mk = modSchool(m); if (mk) cnt[mk] = cnt[mk] || 0; }); });
    el.innerHTML = Object.keys(cnt).map(k => `<span><i style="background:${SCHOOL_COL[k][2]}"></i>${esc(SCHOOL_COL[k][0])}</span>`).join('');
  }
  function renderTree() {
    invalidate();
    renderSchoolLegend();
    const C = cdata(); const svg = $('#tree'); const L = layout(); const P = L.P; TREE_MODICON = L.modIcon;
    if (!view) { const B = treeBounds(); const w = Math.min(B.w, 9000), cx = L.tiers.length ? P[L.tiers[0]][0] : B.x + B.w / 2; view = { x: cx - w / 2, y: B.y, w, h: w * 0.75 }; }
    let html = TREE_DEFS;
    const B = treeBounds();
    // backdrop: faint rings and rune bands around each cluster (the rough stone frame is a fixed overlay)
    for (const ti of L.tiers) {
      const [cx, cy] = P[ti];
      html += `<g class="bgring" transform="translate(${cx} ${cy})"><circle r="2350"/><circle r="2210" class="thin"/><circle r="1150" class="thin"/>
        ${Array.from({ length: 36 }, (_, k) => `<path d="M-30 -2280 V-2240 M0 -2290 V-2235 M30 -2280 V-2250 M-14 -2262 H14" transform="rotate(${k * 10})"/>`).join('')}</g>`;
    }
    // trunk between cluster centres
    const tierLit = ti => C.nodes.some(n => n.kind === 'unlock' && S.alloc[n.i] > 0 && C.links.some(([x, y]) => (x === n.i && y === ti) || (y === n.i && x === ti)));
    for (let t = 1; t < L.tiers.length; t++) {
      const a = P[L.tiers[t - 1]], b = P[L.tiers[t]];
      const lit = tierLit(L.tiers[t]);
      const td = `M${a[0]} ${a[1]} C${a[0]} ${(a[1] + b[1]) / 2} ${b[0]} ${(a[1] + b[1]) / 2} ${b[0]} ${b[1]}`;
      html += `<path class="trunk-case" d="${td}"/><path class="trunk${lit ? ' lit' : ''}" d="${td}"/><path class="trunk-core${lit ? ' lit' : ''}" d="${td}"/>`;
    }
    const adjMods = {}; for (const [a, b] of C.links) { if (C.nodes[b] && C.nodes[b].kind === 'mod') (adjMods[a] = adjMods[a] || []).push(b); if (C.nodes[a] && C.nodes[a].kind === 'mod') (adjMods[b] = adjMods[b] || []).push(a); }
    const branchOn = i => (adjMods[i] || []).some(m => S.alloc[m] > 0);
    for (const [a, b] of C.links) {
      const A = C.nodes[a], B2 = C.nodes[b]; if (!A || !B2) continue;
      const isOn = i => S.alloc[i] > 0 || (C.nodes[i].kind === 'hub' && (L.trunk.has(i) ? false : branchOn(i)));
      const lit = (isOn(a) || L.trunk.has(a)) && (isOn(b) || L.trunk.has(b)) && !(L.trunk.has(a) && L.trunk.has(b));
      let d;
      const skillToBranch = (A.kind === 'unlock' && B2.kind === 'hub' && !L.trunk.has(b)) ? [a, b] : (B2.kind === 'unlock' && A.kind === 'hub' && !L.trunk.has(a)) ? [b, a] : null;
      if (skillToBranch) { const [u, h] = skillToBranch; d = elbow(P[u][0], P[u][1], P[h][0], P[h][1]); }
      else d = `M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}`;
      const main = L.trunk.has(a) || L.trunk.has(b);
      html += main ? `<path class="link-case" d="${d}"/><path class="link main${lit ? ' lit' : ''}" d="${d}"/><path class="link-core${lit ? ' lit' : ''}" d="${d}"/>` : `<path class="link${lit ? ' lit' : ''}" d="${d}"/>`;
    }
    const labels = [];
    for (const n of C.nodes) {
      const pts = S.alloc[n.i] || 0; const on = pts > 0;
      let blocked = false;
      if (n.kind === 'mod') blocked = skillRank(n.power) === 0 || groupSiblings(n).some(s => S.alloc[s.i] > 0);
      const cls = `node ${n.kind}${L.trunk.has(n.i) ? ' trunkhub' : ''}${on ? ' on' : ''}${blocked && !on ? ' blocked' : ''}${S.sel === n.i ? ' sel' : ''}`;
      const [x, y] = P[n.i]; let body = ''; let r = R[n.kind];
      if (n.kind === 'unlock') {
        const Pw = C.powers[n.power] || {}; const dk = DMG_BG[Pw.dmg] ? Pw.dmg : '';
        const T = 205;
        body = `<g transform="translate(${x} ${y})">
          ${on ? `<circle r="${r * 1.7}" fill="url(#gRedGlow)"/>` : ''}
          <circle r="${r - 10}" fill="url(#gPlate)" stroke="#050404" stroke-width="10"/>
          <circle r="${r - 30}" fill="none" stroke="#3a3530" stroke-width="5"/>
          <rect x="${-T - 26}" y="${-T - 26}" width="${(T + 26) * 2}" height="${(T + 26) * 2}" rx="18" fill="url(#${on ? 'gBlood' : 'gIron'})" stroke="#050404" stroke-width="8"/>
          <rect x="${-T - 8}" y="${-T - 8}" width="${(T + 8) * 2}" height="${(T + 8) * 2}" rx="8" fill="#0a0807"/>
          <g class="face"><image href="${skillImg(S.cls, Pw.name)}" x="${-T}" y="${-T}" width="${T * 2}" height="${T * 2}" clip-path="url(#clipTile)" preserveAspectRatio="xMidYMid slice" ${schoolTint(effSchool(Pw))}/></g>
          <rect x="${-T}" y="${-T}" width="${T * 2}" height="${T * 2}" rx="5" fill="url(#gVig)" opacity="0.45"/>
          <rect x="${-T - 8}" y="${-T - 8}" width="${(T + 8) * 2}" height="${(T + 8) * 2}" rx="8" fill="none" stroke="${(SCHOOL_COL[effSchool(Pw)] || [, , '#a89a8a'])[2]}" stroke-width="7" opacity="${on ? 0.95 : 0.6}"/>
          ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<path d="M${sx * (T + 34)} ${sy * (T - 30)} L${sx * (T + 34)} ${sy * (T + 34)} L${sx * (T - 30)} ${sy * (T + 34)}" fill="none" stroke="${on ? '#ffb0a0' : '#a89a8a'}" stroke-width="9" stroke-linecap="round"/>`).join('')}
        </g>
        <text class="rank${on ? ' on' : ''}" x="${x + T * 0.55}" y="${y + T + 120}">${pts}/${n.max || 5}</text>`;
        labels.push({ n, x, y, r: r + 40, on, text: nodeLabel(n) });
      } else if (n.kind === 'mod') {
        const Pw = C.powers[n.power] || {}; const choice = groupSiblings(n).length >= 2;
        const md = Pw.mods && Pw.mods.find(m => m.id === n.mod);
        const dk = DMG_BG[Pw.dmg] ? Pw.dmg : '';
        const m = D4ART.modMotif(md && md.name, md && md.desc);
        if (choice) {
          body = `<g transform="translate(${x} ${y})">${on ? `<circle r="${r * 1.9}" fill="url(#gRedGlow)"/>` : ''}
            <path d="${SPIKY_DIAMOND}" fill="url(#${on ? 'gBlood' : 'gIron'})" stroke="#050404" stroke-width="8" stroke-linejoin="round"/>
            <rect x="-100" y="-100" width="200" height="200" rx="6" transform="rotate(45)" fill="#0a0807"/>
            ${L.modIcon[n.i] ? `<g class="face"><image href="img/skills/${L.modIcon[n.i]}.png" x="-125" y="-125" width="250" height="250" clip-path="url(#clipDia)" preserveAspectRatio="xMidYMid slice" ${schoolTint(modSchool(md) || schoolOf(Pw))}/></g>${modSchool(md) ? `<rect x="-100" y="-100" width="200" height="200" rx="6" transform="rotate(45)" fill="none" stroke="${SCHOOL_COL[modSchool(md)][2]}" stroke-width="9"/>` : ''}
            <rect x="-88" y="-88" width="176" height="176" rx="4" transform="rotate(45)" fill="url(#gVig)" opacity="0.4"/>`
            : `<rect x="-88" y="-88" width="176" height="176" rx="4" transform="rotate(45)" fill="url(#gDmg${dk || 'None'})" class="face"/><g class="emb">${inkMotif(m, 2.3)}</g>`}</g>`;
        } else {
          body = `<g transform="translate(${x} ${y})">${on ? `<circle r="${r * 1.9}" fill="url(#gRedGlow)"/>` : ''}
            <circle r="${r - 18}" fill="url(#${on ? 'gBlood' : 'gIron'})" stroke="#050404" stroke-width="8"/>
            <circle r="${r - 36}" fill="url(#gPlate)"/>
            <g class="emb small">${inkMotif(m, 1.9)}</g></g>`;
        }
        if (n.max > 1) body += `<g transform="translate(${x} ${y})">${Array.from({ length: n.max }, (_, k) => `<circle cx="${(k - (n.max - 1) / 2) * 44}" cy="${r + 44}" r="15" class="pip${k < pts ? ' full' : ''}"/>`).join('')}</g>`;
      } else if (L.trunk.has(n.i)) {
        r = 300; const lit = tierLit(n.i) || L.tiers[0] === n.i;
        body = `<g transform="translate(${x} ${y})">${lit ? `<circle r="560" fill="url(#gRedGlow)"/>` : ''}
          <path d="${STAR}" fill="url(#${lit ? 'gBlood' : 'gIron'})" stroke="#050404" stroke-width="10" stroke-linejoin="round"/>
          <path d="${STAR}" fill="none" stroke="${lit ? '#ff9a8a' : '#9a8f84'}" stroke-width="4" transform="scale(0.82)" opacity="0.6"/>
          <circle r="132" fill="#0b0908" stroke="#050404" stroke-width="8"/>
          <path d="${THORNS}" fill="none" stroke="${lit ? '#e8ddd0' : '#8a8076'}" stroke-width="7" stroke-linejoin="round"/>
          <circle r="96" fill="#d8cfc2"/>
          <g transform="translate(-58 -58) scale(3.6)"><path d="${SIGILS[S.cls]}" fill="none" stroke="#1a1512" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
      } else {
        const lit = branchOn(n.i);
        body = `<g transform="translate(${x} ${y})"><rect x="-46" y="-46" width="92" height="92" rx="8" transform="rotate(45)" fill="url(#${lit ? 'gBlood' : 'gIron'})" stroke="#050404" stroke-width="8"/><rect x="-22" y="-22" width="44" height="44" rx="4" transform="rotate(45)" fill="${lit ? '#ff6050' : '#151210'}"/></g>`;
      }
      const sel = S.sel === n.i ? `<circle class="ring" cx="${x}" cy="${y}" r="${r + (n.kind === 'mod' ? 60 : 80)}"/>` : '';
      const hub = n.kind === 'hub';
      html += `<g class="${cls}" data-i="${n.i}" tabindex="${hub ? -1 : 0}" role="button" aria-label="${esc(nodeLabel(n) || 'Path node')}"><title>${esc(nodeLabel(n))}${n.max ? ` (${pts}/${n.max})` : ''}</title>${sel}${body}</g>`;
    }
    html += `<g class="labels">${placeLabels(labels, C, P, L).join('')}</g>`;
    svg.innerHTML = html;
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    const spent = Object.values(S.alloc).reduce((a, b) => a + b, 0);
    $('#pointsSpent').textContent = `${spent} point${spent === 1 ? '' : 's'}`;
    renderHotbar();
  }
  function renderHotbar() {
    const C = cdata(); const bar = $('#hotbar'); if (!bar) return;
    const unlocked = unlockedSkills();
    S.hotbar = (S.hotbar || []).filter(p => unlocked.includes(p));
    for (const p of unlocked) if (S.hotbar.length < 6 && !S.hotbar.includes(p)) S.hotbar.push(p);
    const keys = ['1', '2', '3', '4', 'L', 'R'];
    bar.hidden = !S.hotbar.length;
    bar.innerHTML = keys.slice(0, S.hotbar.length).map((k, i) => {
      const p = S.hotbar[i]; const P = p && C.powers[p];
      return `<button class="hk${P ? ' filled' : ''}" data-h="${i}" title="${P ? esc(P.name) : 'Empty slot'}">${P ? `<img class="hk-img" style="${schoolCss(effSchool(P))}" src="${skillImg(S.cls, P.name)}" alt="">` : ''}<span class="key">${k}</span>${P ? `<span class="nm">${esc(P.name)}</span>` : ''}</button>`;
    }).join('');
    $$('.hk', bar).forEach(b => b.onclick = () => {
      const p = S.hotbar[+b.dataset.h];
      if (p) { const n = cdata().nodes.find(x => x.kind === 'unlock' && x.power === p); if (n) { S.sel = n.i; renderTree(); renderInspector(); } }
    });
  }
  // ---------- in-game style hover tooltip for skills and their upgrades ----------
  let TREE_MODICON = {}; let ttipNode = null;
  const TT_CHIPS = ['Defensive', 'Mobility', 'Shout', 'Summoning', 'Channeled', 'Trap', 'Grenade', 'Shapeshifting', 'Marksman', 'Cutthroat', 'Companion', 'Aura'];
  function ttipHtml(i) {
    const C = cdata(); const n = C.nodes[i]; if (!n || !n.power || !C.powers[n.power]) return '';
    const sk = skillCtx(n.power); const P = sk.P; const res = CLASS_RES[S.cls] || 'Resource';
    const learned = (S.alloc[i] || 0) > 0;
    const school = effSchool(P); const schoolName = school && SCHOOL_COL[school] ? SCHOOL_COL[school][0] : '';
    const schoolCol = school && SCHOOL_COL[school] ? SCHOOL_COL[school][2] : '#d9b878';
    const f = (v, d) => D4T.fmtNum(Math.round(v * Math.pow(10, d)) / Math.pow(10, d));
    if (n.kind === 'mod') {
      const md = P.mods.find(m => m.id === n.mod); if (!md) return '';
      const exclusive = groupSiblings(n).length >= 1;
      const ms = modSchool(md); const icon = TREE_MODICON[i] ? `<img src="img/skills/${TREE_MODICON[i]}.png" alt="" style="${schoolCss(ms || school)}">` : '';
      return `<div class="tt-icon dia">${icon}</div>
        <h4>${esc(md.name)}</h4><div class="tt-orn"></div>
        <div class="tt-body">${sk.text(md.desc)}</div>
        ${exclusive ? '<p class="tt-excl">You may only select one modifier.</p>' : ''}
        <p class="tt-foot ${learned ? 'ok' : 'no'}">${learned ? 'Learned' : 'Not Yet Learned'}</p>
        <p class="tt-parent">${esc(P.name)} upgrade</p>`;
    }
    const tags = [...new Set([P.tag, ...TT_CHIPS.filter(t => (P.tags || []).includes(t)), schoolName].filter(Boolean))];
    const cd = sk.cd(), ch = sk.charges(), cost = sk.cost();
    const active = P.mods.filter(m => sk.mods.has(m.key));
    const max = n.max || 15; const extra = sk.lvl - sk.baseRank;
    return `<div class="tt-icon sq" style="border-color:${schoolCol}"><img src="${skillImg(S.cls, P.name)}" alt="" style="${schoolCss(school)}"></div>
      <h4>${esc(P.name)}</h4>
      <div class="tt-rank">RANK <b class="${extra > 0 ? 'boost' : ''}">${sk.baseRank ? sk.lvl : 0}</b>/${max}</div>
      ${sk.baseRank && extra > 0 ? `<p class="tt-contrib">(Item Contribution: <b>${extra}</b>)</p>` : ''}
      <div class="tt-chips">${tags.map(t => `<span style="${t === schoolName ? `border-color:${schoolCol};color:${schoolCol}` : ''}">${esc(t)}</span>`).join('')}</div>
      <div class="tt-orn"></div>
      <div class="tt-stats">
        ${cost ? `<p><span>${esc(res)} Cost:</span> <b>${f(sk.costEff(), 1)}</b></p>` : ''}
        ${cd ? `<p><span>Cooldown:</span> <b>${f(sk.cdEff(), 2)}</b> seconds</p>` : ch ? `<p><span>Charges:</span> <b>${f(ch, 0)}</b></p>` : ''}
        <p><span>Lucky Hit Chance:</span> <b>${f(sk.lhEff(), 1)}%</b></p>
      </div>
      <div class="tt-body">${sk.text(P.desc).replace(/<span class="c-label">[^<]*?(?:Cost|Cooldown|Lucky Hit Chance|Charges|Generate)[^<]*<\/span>.*?(?:<br>|$)/g, '').replace(/^(\s*<br>)+/, '')}</div>
      ${active.length ? `<div class="tt-mods"><div class="tt-modh">MODIFIERS</div>${active.map(m => `<div class="tt-mod">${sk.text(m.desc)}</div>`).join('')}</div>` : ''}
      ${P.dmg ? `<p class="tt-dmg">${esc(P.dmg)} Damage</p>` : ''}
      ${learned ? '' : '<p class="tt-foot no">Not Yet Learned</p>'}`;
  }
  function showTtip(i, x, y) {
    const t = $('#ttip'); if (!t) return; const h = ttipHtml(i); if (!h) { hideTtip(); return; }
    ttipNode = i; t.innerHTML = h; t.hidden = false; placeTtip(x, y);
  }
  function placeTtip(x, y) {
    const t = $('#ttip'); if (!t || t.hidden) return; const r = t.getBoundingClientRect(); const W = window.innerWidth, H = window.innerHeight;
    let left = x + 24, top = y - r.height / 2;
    if (left + r.width > W - 10) left = x - r.width - 24;
    top = Math.max(10, Math.min(H - r.height - 10, top));
    t.style.left = left + 'px'; t.style.top = top + 'px';
  }
  function hideTtip() { const t = $('#ttip'); if (t) t.hidden = true; ttipNode = null; }
  function changeNode(i, delta) {
    const C = cdata(); const n = C.nodes[i]; if (!n || n.kind === 'hub') return;
    const cur = S.alloc[i] || 0; let next = Math.max(0, Math.min(n.max || 1, cur + delta));
    if (delta > 0 && n.kind === 'mod') {
      if (skillRank(n.power) === 0) { toast(`Unlock ${C.powers[n.power].name} first`); return; }
      const taken = groupSiblings(n).find(s => S.alloc[s.i] > 0);
      if (taken) { toast(`Only one of these: ${nodeLabel(taken)} is already chosen`); return; }
    }
    if (next === cur) return;
    if (next) S.alloc[i] = next; else delete S.alloc[i];
    if (n.kind === 'unlock' && next === 0) for (const m of C.nodes) if (m.kind === 'mod' && m.power === n.power) delete S.alloc[m.i];
    S.sel = i; renderTree(); renderInspector(); commit(); if (ttipNode === i) { invalidate(); const t = $('#ttip'); if (t && !t.hidden) t.innerHTML = ttipHtml(i); }
  }
  function wireTree() {
    const svg = $('#tree'); let drag = null;
    svg.addEventListener('pointerdown', e => { const g = e.target.closest && e.target.closest('.node'); drag = { x: e.clientX, y: e.clientY, v: Object.assign({}, view), moved: false, node: g ? +g.dataset.i : null, btn: e.button }; if (e.button === 0) svg.setPointerCapture(e.pointerId); });
    svg.addEventListener('pointermove', e => {
      if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; svg.classList.add('dragging'); }
      if (!drag.moved) return;
      const k = view.w / svg.clientWidth; view.x = drag.v.x - dx * k; view.y = drag.v.y - dy * (view.h / svg.clientHeight);
      svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    });
    svg.addEventListener('pointerup', e => {
      svg.classList.remove('dragging');
      if (drag && !drag.moved && drag.node != null && drag.btn === 0) changeNode(drag.node, +1);
      drag = null;
    });
    svg.addEventListener('contextmenu', e => { e.preventDefault(); const g = e.target.closest('.node'); if (g) changeNode(+g.dataset.i, -1); });
    svg.addEventListener('mouseover', e => { const g = e.target.closest('.node'); if (g && cdata().nodes[+g.dataset.i].kind !== 'hub') { S.sel = +g.dataset.i; renderInspector(); showTtip(+g.dataset.i, e.clientX, e.clientY); } });
    svg.addEventListener('mousemove', e => { if (ttipNode != null) { const g = e.target.closest('.node'); if (!g) hideTtip(); else placeTtip(e.clientX, e.clientY); } });
    svg.addEventListener('mouseleave', hideTtip);
    svg.addEventListener('pointerdown', () => { if (ttipNode != null) { const i = ttipNode; setTimeout(() => { const t = $('#ttip'); if (t && !t.hidden && ttipNode === i) t.innerHTML = ttipHtml(i); }, 0); } });
    svg.addEventListener('keydown', e => { const g = e.target.closest('.node'); if (!g) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); changeNode(+g.dataset.i, e.shiftKey ? -1 : 1); } });
    svg.addEventListener('wheel', e => {
      e.preventDefault(); const r = svg.getBoundingClientRect(); const k = e.deltaY > 0 ? 1.12 : 1 / 1.12;
      const px = view.x + (e.clientX - r.left) / r.width * view.w, py = view.y + (e.clientY - r.top) / r.height * view.h;
      view.w *= k; view.h *= k; view.x = px - (px - view.x) * k; view.y = py - (py - view.y) * k;
      svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    }, { passive: false });
    $('#fitTree').onclick = () => { view = treeBounds(); renderTree(); };
    $('#clearTree').onclick = () => { S.alloc = {}; S.sel = null; renderTree(); renderInspector(); commit(); };
  }
  function renderInspector() {
    invalidate();
    const box = $('#inspector'); const C = cdata();
    const n = S.sel != null ? C.nodes[S.sel] : null;
    if (!n || !n.power || !C.powers[n.power]) {
      box.innerHTML = `<h2>${esc(S.cls)} skills</h2><p class="empty">Hover any skill or upgrade to read it here. Large nodes are skills, small nodes are their upgrades. Upgrades that share a branch are exclusive: you can take only one of them.</p>${allocatedSkillsHtml()}`;
      wireRankInput(); return;
    }
    const sk = skillCtx(n.power); const P = sk.P;
    const cd = sk.cd(), lh = sk.lh(), cost = sk.cost(), ch = sk.charges();
    const groups = {};
    for (const m of C.nodes.filter(x => x.kind === 'mod' && x.power === n.power)) (groups[m.g] = groups[m.g] || []).push(m);
    const modsHtml = Object.values(groups).map(g => g.map(m => {
      const md = P.mods.find(x => x.id === m.mod); if (!md) return '';
      return `<li class="${S.alloc[m.i] ? 'on' : ''}"><b class="mname">${esc(md.name)}</b>${sk.text(md.desc)}${g.length > 1 ? `<div class="excl">Choose one of ${g.length} on this branch</div>` : ''}</li>`;
    }).join('')).join('');
    box.innerHTML = `
      <h2>${esc(P.name)}</h2>
      <p class="meta">${esc([...new Set([P.tag, ...P.tags].filter(t => t && !/^Search|Filter|^Copy/i.test(t)))].slice(0, 5).join(', '))}${P.dmg ? ', ' + P.dmg + ' damage' : ''}</p>
      <dl class="stats">
        <div><dt>Skill rank</dt><dd>${sk.baseRank ? sk.lvl : '0'}${sk.gearRanks ? ` <small>(${sk.baseRank} + ${sk.gearRanks} from build)</small>` : ''}</dd></div>
        <div><dt>Cooldown</dt><dd>${cd ? `${D4T.fmtNum(Math.round(sk.cdEff() * 100) / 100)} s${sk.SB.cdrKeep < 1 ? ` <small>base ${D4T.fmtNum(cd)} s</small>` : ''}` : (ch ? ch + ' charges' : 'None')}</dd></div>
        <div><dt>Lucky Hit chance</dt><dd>${D4T.fmtNum(Math.round(sk.lhEff() * 10) / 10)}%${sk.SB.lhc ? ` <small>base ${D4T.fmtNum(lh)}%</small>` : ''}</dd></div>
        <div><dt>Cost</dt><dd>${cost ? `${D4T.fmtNum(Math.round(sk.costEff() * 10) / 10)}${sk.SB.rcr ? ` <small>base ${D4T.fmtNum(cost)}</small>` : ''}` : 'None'}</dd></div>
        ${sk.SB.as ? `<div><dt>Attack speed</dt><dd>+${D4T.fmtNum(Math.round(sk.SB.as * 10) / 10)}%</dd></div>` : ''}
        ${sk.SB.csc ? `<div><dt>Crit chance bonus</dt><dd>+${D4T.fmtNum(Math.round(sk.SB.csc * 10) / 10)}%</dd></div>` : ''}
      </dl>
      ${skillSourcesHtml(sk)}
      <div class="desc">${sk.text(P.desc)}</div>
      <h3>Upgrades</h3><ul class="mod-list">${modsHtml || '<li>No upgrades listed</li>'}</ul>
      ${allocatedSkillsHtml()}`;
    wireRankInput();
  }
  function skillSourcesHtml(sk) {
    const SB = sk.SB; const rows = [];
    SB.rankParts.forEach(x => rows.push(`<li><span>+${D4T.fmtNum(x.v)} rank${x.v === 1 ? '' : 's'} (${esc(x.scope)})</span><em>${esc(x.src)}</em></li>`));
    SB.cdrParts.forEach(x => rows.push(`<li><span>${D4T.fmtNum(Math.round(x.v * 10) / 10)}% cooldown reduction (${esc(x.scope)})</span><em>${esc(x.src)}</em></li>`));
    SB.rcrParts.forEach(x => rows.push(`<li><span>${D4T.fmtNum(Math.round(x.v * 10) / 10)}% cost reduction (${esc(x.scope)})</span><em>${esc(x.src)}</em></li>`));
    if (!rows.length) return '';
    return `<details class="sk-src"><summary>From your build${SB.cdrCapped ? ', cooldown reduction capped at 75%' : ''}</summary><ul>${rows.join('')}</ul>${sk.baseRank ? '' : '<p class="note">Bonus ranks only apply once the skill has at least 1 point.</p>'}</details>`;
  }
  function allocatedSkillsHtml() {
    return `<h3>Extra skill ranks</h3><p class="note">Ranks from gear, charms, the seal and Paragon are read automatically. Use this only for ranks the planner can't see.</p><div class="kv"><label for="bonusRanks">Added to every learned skill</label><input id="bonusRanks" type="number" min="0" max="40" value="${+S.bonusRanks || 0}"></div>`;
  }
  function wireRankInput() { const i = $('#bonusRanks'); if (i) i.onchange = () => { S.bonusRanks = Math.max(0, +i.value || 0); renderInspector(); commit(); }; }

  // ---------- picker ----------
  function openPicker(title, items, onPick, filters) {
    const box = $('#picker'); $('#pickerTitle').textContent = title; box.hidden = false;
    let active = filters ? filters[0].id : null;
    const search = $('#pickerSearch'); search.value = '';
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      $('#pickerFilters').innerHTML = (filters || []).map(f => `<button class="chip${f.id === active ? ' on' : ''}" data-f="${f.id}">${esc(f.name)}</button>`).join('');
      $$('#pickerFilters .chip').forEach(c => c.onclick = () => { active = c.dataset.f; draw(); });
      const pool = filters ? items.filter(filters.find(f => f.id === active).test) : items;
      const list = pool.filter(it => !q || (it.name + ' ' + strip(it.desc)).toLowerCase().includes(q)).slice(0, 300);
      $('#pickerList').innerHTML = list.length ? list.map((it, k) => entryHtml(it, q, `data-k="${k}" tabindex="0"`)).join('') : '<p class="empty">Nothing matches that search. Try a skill name or a word from the effect.</p>';
      $$('#pickerList .entry').forEach(el => { const go = () => { onPick(list[+el.dataset.k]); closePicker(); }; el.onclick = go; el.onkeydown = e => { if (e.key === 'Enter') go(); }; });
    };
    search.oninput = draw; draw(); search.focus();
  }
  function closePicker() { $('#picker').hidden = true; }
  function entryHtml(it, q, attrs) {
    const hl = s => q ? s.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![^<]*>)', 'ig'), '<mark>$1</mark>') : s;
    const kind = it.kind || 'aspect';
    const sub = it.sub ? it.sub : it.kind ? [it.kind === 'runeword' ? 'Runeword' : it.kind === 'charm' ? 'Charm' : 'Unique', it.type, it.runes, (it.classes || []).length >= 8 ? 'All classes' : (it.classes || []).join(', ')].filter(Boolean).join(' · ') : [it.cat ? it.cat + ' aspect' : 'Aspect', (it.classes || []).length >= 8 ? 'All classes' : (it.classes || []).join(', ')].join(' · ');
    return `<div class="entry" ${attrs || ''}><h4 class="${kind}">${hl(esc(it.name))}</h4><div class="sub">${esc(sub)}</div><div class="d">${hl(it.desc)}</div>${(it.affixes || []).length ? `<div class="aff">${it.affixes.join('<br>')}</div>` : ''}</div>`;
  }

  // ---------- gear ----------
  function classUsable(it) { return !it.classes || !it.classes.length || it.classes.includes(S.cls); }
  function dedupe(list) { const seen = new Set(); return list.filter(x => { const k = x.name + '|' + strip(x.desc).slice(0, 80) + '|' + (x.kind || ''); if (seen.has(k)) return false; seen.add(k); return true; }); }
  function slotItems(slot) {
    const D = data();
    const uniq = dedupe(D.uniques.filter(u => (u.kind === 'unique' || u.kind === 'runeword') && classUsable(u) && slot.re.test(u.type) && !(slot.notRe && slot.notRe.test(u.type))));
    const asp = dedupe(D.aspects.filter(classUsable));
    return { uniq, asp };
  }
  function findItem(ref) {
    if (!ref) return null; const D = data();
    return ref.t === 'aspect' ? D.aspects.find(a => a.id === ref.id) : D.uniques.find(u => u.id === ref.id);
  }
  let gearSel = 'helm';
  function rarityOf(it, g) {
    if (!it) return 'empty';
    if (g && g.mythic) return 'mythic';
    if (it.kind === 'runeword') return 'runeword';
    if (it.kind === 'unique') return 'unique';
    if (it.kind === 'charm') return 'charm';
    return 'legendary';
  }
  const RARITY_NAME = { legendary: 'Legendary aspect', unique: 'Unique', mythic: 'Mythic unique', runeword: 'Runeword', charm: 'Charm' };
  // ---------- crafting: affixes, greater affixes, tempers, masterwork ----------
  const GD = () => data().gear || { affixes: [], tempers: [] };
  const slotKind = id => id.replace(/\d$/, '');
  // ---------- gems and sockets ----------
  // Weapons take the damage line, helm, chest, pants and off-hand the armor line, amulet and rings the jewelry line.
  // The Empyrean Eye (Gem_Mythic_01) is in the game files but unreleased: it borrows the Ruby model and no guide lists it. Add 'Mythic' here if it ships.
  const GEM_TYPES = ['Ruby', 'Sapphire', 'Topaz', 'Emerald', 'Amethyst', 'Diamond', 'Skull'];
  const SOCKET_MAX = { helm: 2, chest: 2, pants: 2, gloves: 0, boots: 0, amulet: 1, ring1: 1, ring2: 1, weapon: 2, offhand: 1 };
  let gemSel = -1;
  const gemTarget = id => id === 'weapon' ? 'w' : /^(amulet|ring)/.test(id) ? 'j' : 'a';
  const gemImg = type => `img/gems/${type.toLowerCase()}.png`;
  const gemsOf = type => (GD().gems || []).filter(x => x.type === type).sort((a, b) => a.grade - b.grade);
  const gemDef = (type, grade) => { const l = gemsOf(type); return l.find(x => x.grade === +grade) || l[l.length - 1]; };
  const gemTpl = t => t.replace(/^x\s*§%\s*(.*?)\s*Multiplier$/, '§%[x] $1').replace(/^x\s*§%/, '§%[x]').replace(/^§ /, '+§ ');
  // Weapon base: uniques carry their own type; an aspect weapon takes the type picked in the forge.
  const TWO_HAND_RE = /2H|Bow|Staff|Polearm|Glaive|Quarterstaff/i;
  const OFFHAND_CLASSES = ['Sorcerer', 'Necromancer', 'Warlock', 'Paladin', 'Druid'];
  const WEAPON_BASES = { Barbarian: ['Axe', 'Mace', 'Sword', 'Flail', 'Dagger', 'Axe2H', 'Mace2H', 'Sword2H', 'Polearm'], Druid: ['Axe', 'Mace', 'Sword', 'Dagger', 'Flail', 'Axe2H', 'Mace2H', 'Polearm', 'Staff'], Necromancer: ['Axe', 'Mace', 'Sword', 'Dagger', 'Flail', 'Scythe', 'Axe2H', 'Mace2H', 'Sword2H', 'Scythe2H'], Paladin: ['Axe', 'Mace', 'Sword', 'Flail', 'Dagger', 'Axe2H', 'Mace2H', 'Sword2H'], Rogue: ['Sword', 'Dagger', 'Bow', 'Crossbow2H'], Sorcerer: ['Sword', 'Mace', 'Dagger', 'Wand', 'Staff'], Spiritborn: ['Glaive', 'Quarterstaff', 'Polearm'], Warlock: ['Axe', 'Mace', 'Sword', 'Flail', 'Dagger', 'Axe2H', 'Mace2H', 'Sword2H'] };
  const baseName = t => ({ Axe2H: 'Two-handed axe', Mace2H: 'Two-handed mace', Sword2H: 'Two-handed sword', Scythe2H: 'Two-handed scythe', Crossbow2H: 'Crossbow', Staff: 'Staff (two-handed)', Polearm: 'Polearm (two-handed)', Bow: 'Bow (two-handed)', Glaive: 'Glaive (two-handed)', Quarterstaff: 'Quarterstaff (two-handed)' }[t] || ('One-handed ' + t.toLowerCase()));
  const wtypeOf = (it, g) => (it && it.kind && it.type) || (g && g.wtype) || '';
  const twoHanded = () => { const g = S.gear.weapon || {}; const it = findItem(g.item); return !!it && TWO_HAND_RE.test(wtypeOf(it, g)); };
  // why the off-hand cannot be used right now, or '' when it can
  const offhandBlock = () => !OFFHAND_CLASSES.includes(S.cls) ? `${S.cls}s cannot use an off-hand.` : twoHanded() ? 'Blocked by your two-handed weapon.' : '';
  function socketMax(slotId, it, g) {
    if (it && it.runes) return 0;
    if (slotId === 'weapon') { const t = wtypeOf(it, g || S.gear.weapon); if (t && !TWO_HAND_RE.test(t)) return 1; }
    return SOCKET_MAX[slotId] || 0;
  }
  function gemLines(slotId, g, it) {
    const out = []; const tgt = gemTarget(slotId);
    (g.gems || []).slice(0, socketMax(slotId, it, g)).forEach(x => { const d = x && gemDef(x.type, x.grade); if (!d) return; (d[tgt] || []).forEach(l => { const t = gemTpl(l.t); out.push({ kind: 'gem', gem: d, html: fillTpl(t, l.v, 1), label: t.replace('§', l.v) }); }); });
    return out;
  }
  const N_AFF = 4, N_TEMP = 1, Q_MAX = 25;
  function craft(g) { if (!Array.isArray(g.affixes)) g.affixes = []; if (!Array.isArray(g.tempers)) g.tempers = []; if (g.tempers.length > N_TEMP) g.tempers.length = N_TEMP; if (!Array.isArray(g.uga)) g.uga = []; g.q = Math.max(0, Math.min(Q_MAX, +g.q || 0)); if (g.cap == null) g.cap = 0; return g; }
  const sanctDef = id => (GD().sanctify || []).find(a => a.id === id);
  const affixDef = id => GD().affixes.find(a => a.id === id);
  const temperDef = id => GD().tempers.find(t => t.id === id);
  // the base roll typed in on the item, or the top roll when none is set
  const rollOf = (slot, def) => { const v = slot && slot.val; return v !== undefined && v !== null && v !== '' && isFinite(+v) ? +v : def.v; };
  const rangeTxt = d => d.lo != null && d.lo < d.v ? `${D4T.fmtNum(d.lo)} to ${D4T.fmtNum(d.v)}` : `up to ${D4T.fmtNum(d.v)}`;
  const rollInput = (attr, i, slot, d) => `<input class="roll" type="number" step="any" ${attr}="${i}" value="${slot && slot.val != null && slot.val !== '' ? esc(slot.val) : ''}" placeholder="${D4T.fmtNum(d.v)}" ${d.lo != null ? `min="${d.lo}"` : ''} max="${d.v}" aria-label="Base roll, ${esc(rangeTxt(d))}" title="Base roll before quality and greater affix. Range ${esc(rangeTxt(d))}.">`;
  // Item quality: +1% to every affix per point; quality 25 adds +50% to one chosen line (the capstone).
  function lineScale(g, idx, ga) { return 1 + (ga ? 0.5 : 0) + 0.01 * (+g.q || 0) + ((+g.q || 0) >= Q_MAX && +g.cap === idx ? 0.5 : 0); }
  const fmtScaled = (v, k) => { const x = v * k; return Number.isInteger(v) ? Math.floor(x).toLocaleString('en-US') : D4T.fmtNum(Math.round(x * 10) / 10); };
  const fillTpl = (t, v, k) => esc(t).replace('§', `<b class="num">${fmtScaled(v, k)}</b>`);
  const scaleHtml = (html, k) => k === 1 ? html : html.replace(/<b class="num">([^<]*)<\/b>/g, (m, inner) => `<b class="num">${inner.replace(/\d[\d,]*(\.\d+)?/g, n => fmtScaled(parseFloat(n.replace(/,/g, '')), k))}</b>`);
  // every affix-like line on the item, in masterwork order
  function itemLines(it, g, slotId) {
    g = craft(g || {}); const out = [];
    const unique = it && it.kind && it.kind !== 'charm';
    const nFix = unique ? Math.min(N_AFF, (it.affixes || []).length) : 0;
    if (unique) (it.affixes || []).forEach((h, i) => { const ga = !!g.uga[i]; out.push({ kind: 'base', ga, html: scaleHtml(h, lineScale(g, out.length, ga)), label: strip(h) }); });
    g.affixes.slice(0, N_AFF - nFix).forEach(a => { const d = a && affixDef(a.id); if (!d) return; const ga = !!a.ga; const v = g.mythic ? d.v : rollOf(a, d); out.push({ kind: 'base', ga, html: fillTpl(d.t, v, lineScale(g, out.length, ga)), label: d.t.replace('§', v) }); });
    g.tempers.slice(0, N_TEMP).forEach(t => { const m = t && temperDef(t.rid); const o = m && m.opts.find(x => x.id === t.oid); if (!o) return; const v = rollOf(t, o); out.push({ kind: 'temper', html: fillTpl(o.t, v, lineScale(g, out.length, false)), label: o.t.replace('§', v), from: m.name }); });
    const sd = g.sanct && sanctDef(g.sanct);
    if (sd) { const k = lineScale(g, out.length, false); const v = sd.html ? 0 : rollOf({ val: g.sanctVal }, sd); out.push({ kind: 'sanct', html: sd.html ? scaleHtml(sd.html, k) : fillTpl(sd.t, v, k), label: sd.html ? strip(sd.html) : sd.t.replace('§', v) }); }
    const hd = g.hor && g.hor.id && affixDef(g.hor.id);
    if (hd && !unique) { const v = rollOf(g.hor, hd); const ga = !!g.hor.ga; out.push({ kind: 'hor', ga, html: fillTpl(hd.t, v, lineScale(g, out.length, ga)), label: hd.t.replace('§', v) }); }
    out.forEach((l, i) => { l.cap = g.q >= Q_MAX && +g.cap === i; });
    if (slotId) out.push(...gemLines(slotId, g, it));
    return out;
  }
  const GA_ICON = '<svg class="ga-ico" viewBox="-10 -10 20 20" aria-hidden="true"><path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z"/></svg>';
  const SANCT_ICON = '<svg class="sc-ico" viewBox="-10 -10 20 20" aria-hidden="true"><path d="M0 -9 V9 M-6 -3 H6"/><circle r="9" fill="none"/></svg>';
  const HOR_ICON = '<svg class="hr-ico" viewBox="-10 -10 20 20" aria-hidden="true"><rect x="-6.5" y="-6.5" width="13" height="13" fill="none"/><path d="M-6.5 -6.5 L0 -2 L6.5 -6.5 M0 -2 V6.5"/></svg>';
  const TEMPER_ICON = '<svg class="tp-ico" viewBox="-10 -10 20 20" aria-hidden="true"><path d="M-7 6 L5 -6 M2 -8 L8 -2 M-8 3 L-3 8"/></svg>';
  function itemCard(it, g, slotName) {
    if (!it) return `<div class="card empty-card"><p class="empty">No item in this slot. Choose an aspect, a unique or a runeword.</p></div>`;
    const r = rarityOf(it, g); g = craft(g || {});
    const wt = !it.kind && slotName === 'Weapon' && g.wtype ? baseName(g.wtype) : '';
    const typeLine = [RARITY_NAME[r], it.kind ? (it.type || '').replace(/([a-z])([A-Z0-9])/g, '$1 $2') : (it.cat ? it.cat + ' power' : ''), wt, slotName].filter(Boolean).join(', ');
    const who = (it.classes || []).length >= 8 ? 'All classes' : (it.classes || []).join(', ');
    const slotId = (SLOTS.find(s => s.name === slotName) || {}).id;
    const lines = itemLines(it, g, slotId); const base = lines.filter(l => l.kind === 'base'), temp = lines.filter(l => l.kind === 'temper'), sanct = lines.filter(l => l.kind === 'sanct'), hor = lines.filter(l => l.kind === 'hor'), gemL = lines.filter(l => l.kind === 'gem');
    const li = l => `<p class="ln${l.ga ? ' ga' : ''}${l.cap ? ' crit' : ''}">${l.kind === 'temper' ? TEMPER_ICON : l.kind === 'sanct' ? SANCT_ICON : l.kind === 'hor' ? HOR_ICON : l.ga ? GA_ICON : '<i class="dot"></i>'}<span>${l.html}${l.cap ? ' <em class="mwc">capstone</em>' : ''}</span></p>`;
    const mw = g.q ? `<p class="qline">Item quality <b>${g.q}</b> / ${Q_MAX}</p>` : '';
    const a2 = g.aspect2 && data().aspects.find(a => a.id === g.aspect2);
    return `<div class="card ${r}">
      <div class="card-head"><h3>${esc(it.name)}</h3><p>${esc(typeLine)}</p>${mw}</div>
      <div class="card-body">
        ${it.runes ? `<p class="runes">${esc(it.runes)}</p>` : ''}
        ${base.length ? `<div class="affix-lines">${base.map(li).join('')}</div>` : ''}
        ${temp.length ? `<div class="affix-lines tempers">${temp.map(li).join('')}</div>` : ''}
        ${sanct.length ? `<div class="affix-lines sanct">${sanct.map(li).join('')}</div>` : ''}
        ${hor.length ? `<div class="affix-lines hor">${hor.map(li).join('')}</div>` : ''}
        ${gemL.length ? `<div class="affix-lines gems">${gemL.map(l => `<p class="ln gemln"><img src="${gemImg(l.gem.type)}" alt=""><span>${l.html} <em>${esc(l.gem.name)}</em></span></p>`).join('')}</div>` : ''}
        <div class="power">${it.desc}</div>
        ${a2 ? `<div class="power prism"><p class="prism-h">${esc(a2.name)} <span>Kullean Prism</span></p>${a2.desc}</div>` : ''}
        ${g.note ? `<p class="temper">${esc(g.note)}</p>` : ''}
        <p class="who">${esc(who)}</p>
      </div></div>`;
  }
  const RARITY_COL = { legendary: '#ff8a3c', unique: '#f0c060', mythic: '#c48cff', runeword: '#7cc4e8', empty: '#8a7d70' };
  // Painted item art (Colorless Lab, M-Xing): one picture per slot; weapons follow the item's type, else the class's usual weapon.
  const WEAPON_DEF = { Barbarian: 'axe2h', Druid: 'druidstaff', Necromancer: 'scythe', Paladin: 'paladin', Rogue: 'dagger', Sorcerer: 'staff2', Spiritborn: 'glaive', Warlock: 'wand' };
  const OFF_DEF = { Druid: 'totem', Necromancer: 'focus', Sorcerer: 'focus', Warlock: 'focus' };
  const WEAPON_TYPES = [[/Crossbow/i, 'crossbow'], [/Bow/i, 'bow'], [/Scythe/i, 'scythe'], [/Glaive/i, 'glaive'], [/Quarterstaff/i, 'druidstaff'], [/Spear/i, 'spear'], [/Polearm/i, 'polearm'], [/Staff/i, 'staff2'], [/Wand/i, 'wand'], [/Dagger/i, 'dagger'], [/Axe2H/i, 'axe2h'], [/Axe/i, 'axe'], [/Flail/i, 'flail'], [/Mace|Hammer|Club/i, 'mace'], [/Sword2H/i, 'sword2'], [/Sword/i, 'sword'], [/Shield/i, 'shield'], [/Totem/i, 'totem'], [/Focus/i, 'focus']];
  function itemSprite(slotId, it, g) {
    if (slotId === 'pants') return 'leggings';
    if (slotId === 'boots') return 'greaves';
    if (slotId !== 'weapon' && slotId !== 'offhand') return slotId;
    const t = wtypeOf(it, g); const hit = t && WEAPON_TYPES.find(([re]) => re.test(t));
    if (hit) return hit[1];
    return slotId === 'weapon' ? (WEAPON_DEF[S.cls] || 'sword') : (OFF_DEF[S.cls] || 'shield');
  }
  function tileHtml(sl, extraCls) {
    const g = S.gear[sl.id] || {}; const it = findItem(g.item); const r = rarityOf(it, g);
    const glyph = `<img class="iart gart" src="img/gear/${itemSprite(sl.id, it, g)}.png" alt="" draggable="false">`;
    const blockedWhy = sl.id === 'offhand' ? offhandBlock() : '';
    if (blockedWhy) return `<button class="tile empty blocked${gearSel === sl.id ? ' sel' : ''} ${extraCls || ''}" data-slot="${sl.id}" aria-label="${esc(sl.name)}: ${esc(blockedWhy)}" title="${esc(blockedWhy)}">
      <i class="rv tl"></i><i class="rv tr"></i><i class="rv bl"></i><i class="rv br"></i>${glyph}<span class="tile-lock" aria-hidden="true"></span><span class="tile-name">${OFFHAND_CLASSES.includes(S.cls) ? 'Two-handed' : 'No off-hand'}</span></button>`;
    const mw = +g.q ? `<span class="tile-mw">${g.q}</span>` : '';
    const nS = it ? socketMax(sl.id, it, g) : 0; const pips = nS ? `<span class="tile-gems">${Array.from({ length: nS }, (_, i) => { const x = (g.gems || [])[i]; return x ? `<img src="${gemImg(x.type)}" alt="">` : '<i></i>'; }).join('')}</span>` : '';
    return `<button class="tile ${r}${gearSel === sl.id ? ' sel' : ''} ${extraCls || ''}" data-slot="${sl.id}" aria-label="${esc(sl.name)}: ${esc(it ? it.name : 'empty')}">
      <i class="rv tl"></i><i class="rv tr"></i><i class="rv bl"></i><i class="rv br"></i>${mw}${pips}
      ${glyph}<span class="tile-name">${it ? esc(it.name) : esc(sl.name)}</span></button>`;
  }
  function forgeHtml(sel, it, g) {
    g = craft(g); const kind = slotKind(sel.id); const unique = it && it.kind && it.kind !== 'charm';
    const okCls = x => !x.cls || !x.cls.length || (Array.isArray(x.cls) ? x.cls.includes(S.cls) : x.cls === S.cls);
    const pool = GD().affixes.filter(a => a.slots.includes(kind) && okCls(a));
    const manuals = GD().tempers.filter(t => t.slots.includes(kind) && okCls(t)); const manualsOther = GD().tempers.filter(t => !t.slots.includes(kind) && okCls(t));
    const lines = itemLines(it, g).filter(l => l.kind !== 'gem');
    let rows = '';
    const nFix = unique ? Math.min(N_AFF, (it.affixes || []).length) : 0;
    if (unique) rows = (it.affixes || []).map((h, i) => `<div class="frow"><span class="fval">${lines[i] ? lines[i].html : h}</span><button class="ga-btn${g.uga[i] ? ' on' : ''}" data-uga="${i}" aria-pressed="${!!g.uga[i]}" title="Greater affix: 50% more">${GA_ICON}GA</button></div>`).join('');
    for (let i = 0; i < N_AFF - nFix; i++) {
      const a = g.affixes[i] || {}; const used = new Set(g.affixes.filter((x, k) => x && k !== i).map(x => x.id));
      rows += `<div class="frow"><select data-aff="${i}" aria-label="Affix ${nFix + i + 1}"><option value="">Affix ${nFix + i + 1}: choose...</option>${pool.filter(p => !used.has(p.id)).map(p => `<option value="${p.id}" ${p.id === a.id ? 'selected' : ''}>${esc(p.t.replace('§', p.v))}</option>`).join('')}</select>
        ${a.id && affixDef(a.id) && !g.mythic ? rollInput('data-av', i, a, affixDef(a.id)) : ''}
        <button class="ga-btn${a.ga ? ' on' : ''}" data-ga="${i}" ${a.id ? '' : 'disabled'} aria-pressed="${!!a.ga}" title="Greater affix: 50% more">${GA_ICON}GA</button></div>`;
    }
    const used4 = new Set(g.affixes.filter(Boolean).map(x => x.id)); const h = g.hor || {};
    const horRow = unique ? '' : `<h3>Horadric affix</h3>
      <div class="frow"><select id="horPick" aria-label="Horadric affix"><option value="">No Horadric affix</option>${pool.filter(p => !used4.has(p.id)).map(p => `<option value="${p.id}" ${p.id === h.id ? 'selected' : ''}>${esc(p.t.replace('§', p.v))}</option>`).join('')}</select>
        ${h.id && affixDef(h.id) ? rollInput('data-hv', 0, h, affixDef(h.id)) : ''}
        <button class="ga-btn${h.ga ? ' on' : ''}" id="horGa" ${h.id ? '' : 'disabled'} aria-pressed="${!!h.ga}" title="Greater affix: 50% more">${GA_ICON}GA</button></div>
      <p class="note">The extra affix the Horadric Cube adds. It rolls from this slot's affix pool.</p>`;
    let trows = '';
    for (let i = 0; i < N_TEMP; i++) {
      const t = g.tempers[i] || {}; const m = t.rid && temperDef(t.rid);
      const other = g.tempers[1 - i] && g.tempers[1 - i].rid;
      const groups = {}; manuals.filter(x => x.id !== other).forEach(x => (groups[x.cat] = groups[x.cat] || []).push(x));
      trows += `<div class="frow two"><select data-tm="${i}" aria-label="Tempering manual"><option value="">Temper: choose a manual...</option>${Object.entries(groups).map(([c, list]) => `<optgroup label="${esc(c)}">${list.map(x => `<option value="${x.id}" ${x.id === t.rid ? 'selected' : ''}>${esc(x.name)}${x.cls ? '' : ' (any class)'}</option>`).join('')}</optgroup>`).join('')}${(() => { const og = {}; manualsOther.filter(x => x.id !== other).forEach(x => (og[x.cat] = og[x.cat] || []).push(x)); return Object.entries(og).map(([c, list]) => `<optgroup label="${esc(c)} (listed for other slots)">${list.map(x => `<option value="${x.id}" ${x.id === t.rid ? 'selected' : ''}>${esc(x.name)}${x.cls ? '' : ' (any class)'}</option>`).join('')}</optgroup>`).join(''); })()}</select>
        <select data-to="${i}" aria-label="Temper affix" ${m ? '' : 'disabled'}>${m ? m.opts.map(o => `<option value="${o.id}" ${o.id === t.oid ? 'selected' : ''}>${esc(o.t.replace('§', o.v))}${o.nv ? ' (amount not in the game files)' : o.est ? ' (usual range)' : ''}</option>`).join('') : '<option>Pick a manual first</option>'}</select>
        ${m && m.opts.find(o => o.id === t.oid) && !m.opts.find(o => o.id === t.oid).nv ? rollInput('data-tv', i, t, m.opts.find(o => o.id === t.oid)) : ''}</div>`;
    }
    const sPool = (GD().sanctify || []).filter(x => x.slots.includes(kind) && okCls(x));
    const capSel = g.q >= Q_MAX ? `<div class="frow"><label class="flabel" for="capPick">Capstone (+50%)</label><select id="capPick">${lines.length ? lines.map((l, i) => `<option value="${i}" ${+g.cap === i ? 'selected' : ''}>${esc(strip(l.label)).slice(0, 70)}</option>`).join('') : '<option>Add affixes first</option>'}</select></div>` : '';
    const genericAspects = kind === 'amulet' ? data().aspects.filter(a => !a.classes || !a.classes.length || a.classes.length >= 8) : [];
    const bases = WEAPON_BASES[S.cls] || [];
    const baseRow = sel.id === 'weapon' && !unique ? `<h3>Weapon type</h3><div class="frow"><select id="wtypePick" aria-label="Weapon type"><option value="">Choose the weapon this aspect is on...</option>${bases.map(b => `<option value="${b}" ${b === g.wtype ? 'selected' : ''}>${esc(baseName(b))}</option>`).join('')}</select></div>
      <p class="note">${g.wtype && TWO_HAND_RE.test(g.wtype) ? 'Two-handed: the off-hand slot is blocked and this weapon has 2 sockets.' : 'One-handed weapons have 1 socket and leave the off-hand free. Two-handed weapons block the off-hand.'}</p>` : '';
    return `<section class="forge">${baseRow}
      <h3>Affixes</h3>${rows}
      <p class="note">${g.mythic ? 'Mythic: every roll is at its maximum. Greater affixes are still yours to mark.' : 'Type the base roll from your item into the box beside each affix. Leave it empty for the top roll. Greater affixes add 50% and item quality adds its share on top.'}</p>
      ${horRow}
      <h3>Tempering</h3>${trows}
      <h3>Item quality</h3>
      <div class="qrow"><input type="number" id="qNum" min="0" max="${Q_MAX}" value="${g.q}" aria-label="Item quality"><span class="qmax">/ ${Q_MAX}</span></div>
      <p class="note">${g.q ? `+${g.q}% to every affix, temper and transfigured affix${g.q >= Q_MAX ? ', plus the +50% capstone on the line you choose' : ''}.` : 'Each point of quality adds 1% to every affix. Quality 25 also unlocks a +50% capstone on one line.'}</p>
      ${capSel}
      <h3>Transfiguration</h3>
      <div class="frow"><select id="sanctPick" aria-label="Transfigured affix"><option value="">No transfigured affix</option>${sPool.map(x => `<option value="${x.id}" ${x.id === g.sanct ? 'selected' : ''}>${esc(x.html ? strip(x.html) : x.t.replace('§', x.v)).slice(0, 90)}</option>`).join('')}</select>
        ${g.sanct && sanctDef(g.sanct) && !sanctDef(g.sanct).html ? rollInput('data-sv', 0, { val: g.sanctVal }, sanctDef(g.sanct)) : ''}</div>
      ${socketsHtml(sel, it, g)}
      ${kind === 'amulet' ? `<h3>Kullean Prism aspect</h3>
      <div class="frow"><select id="prismPick" aria-label="Second aspect from a Kullean Prism"><option value="">No second aspect</option>${genericAspects.map(a => `<option value="${a.id}" ${a.id === g.aspect2 ? 'selected' : ''}>${esc(a.name)}${a.cat ? ' (' + esc(a.cat) + ')' : ''}</option>`).join('')}</select></div>
      <p class="note">A Kullean Prism adds a second, all-class aspect to an amulet.</p>` : ''}
    </section>`;
  }
  function socketsHtml(sel, it, g) {
    const n = socketMax(sel.id, it); const tgt = gemTarget(sel.id);
    if (!n) return `<h3>Sockets</h3><p class="note">${it && it.runes ? 'Runewords fill both sockets with their runes, so there is no room for gems.' : 'This slot has no sockets.'}</p>`;
    if (!Array.isArray(g.gems)) g.gems = [];
    if (gemSel >= n) gemSel = -1;
    const where = { w: 'weapon', a: 'armor', j: 'jewelry' }[tgt];
    const sock = i => { const x = g.gems[i]; const d = x && gemDef(x.type, x.grade);
      return `<button class="gsock${gemSel === i ? ' sel' : ''}${x ? ' full' : ''}" data-gs="${i}" aria-pressed="${gemSel === i}" aria-label="Socket ${i + 1}: ${d ? esc(d.name) : 'empty'}">${x ? `<img src="${gemImg(x.type)}" alt="">` : '<span>+</span>'}</button>`; };
    const cur = gemSel >= 0 ? g.gems[gemSel] : null;
    const grade = cur ? cur.grade : 9;
    const picker = gemSel < 0 ? '' : `<div class="gempick">
      <div class="gem-grid">${GEM_TYPES.map(t => { const d = gemDef(t, t === 'Mythic' ? 1 : grade); if (!d) return ''; const l = (d[tgt] || [])[0];
        return `<button class="gem-btn${cur && cur.type === t ? ' on' : ''}" data-gt="${t}" aria-pressed="${!!(cur && cur.type === t)}"><img src="${gemImg(t)}" alt=""><b>${esc(t === 'Mythic' ? d.name : t)}</b><small>${l ? esc(gemTpl(l.t).replace('§', D4T.fmtNum(l.v))) : ''}</small></button>`; }).join('')}</div>
      ${cur && cur.type !== 'Mythic' ? `<div class="frow"><label class="flabel" for="gemGrade">Grade</label><select id="gemGrade">${gemsOf(cur.type).map(d => `<option value="${d.grade}" ${d.grade === cur.grade ? 'selected' : ''}>${esc(d.name)}</option>`).join('')}</select></div>` : ''}
      ${cur ? '<button class="btn ghost danger" id="gemClear">Empty this socket</button>' : ''}
    </div>`;
    return `<h3>Sockets</h3>
      <div class="sockrow">${Array.from({ length: n }, (_, i) => sock(i)).join('')}</div>
      <p class="note">${n} socket${n > 1 ? 's' : ''}. Gems here use their ${where} bonus. Click a socket to set its gem.</p>${picker}`;
  }
  function crestHtml() {
    let eq = 0, ga = 0, temp = 0, sanct = 0, qs = [], prism = 0; const nSlots = SLOTS.length - (offhandBlock() ? 1 : 0);
    for (const sl of SLOTS) { const g = S.gear[sl.id]; const it = g && findItem(g.item); if (!it) continue; if (sl.id === 'offhand' && offhandBlock()) continue; eq++; craft(g);
      const lines = itemLines(it, g); ga += lines.filter(l => l.ga).length; temp += lines.filter(l => l.kind === 'temper').length; sanct += lines.filter(l => l.kind === 'sanct').length; qs.push(g.q); if (g.aspect2) prism++; }
    const avgQ = qs.length ? Math.round(qs.reduce((a, b) => a + b, 0) / qs.length) : 0;
    const spk = (() => { let d = ''; const n = 24; for (let k = 0; k < n * 2; k++) { const a = Math.PI * k / n; const r = k % 2 ? 92 : 104; d += (k ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1); } return d + 'Z'; })();
    const stat = (v, l) => `<div class="cstat"><b>${v}</b><span>${l}</span></div>`;
    return `<svg class="crest-svg" viewBox="-120 -120 240 240" aria-hidden="true">
      <defs><radialGradient id="crGlow" r="50%"><stop offset="0" stop-color="#8a2414" stop-opacity="0.55"/><stop offset="1" stop-color="#8a2414" stop-opacity="0"/></radialGradient>
      <radialGradient id="crFace" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#2c211b"/><stop offset="1" stop-color="#0a0807"/></radialGradient>
      <linearGradient id="crIron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a39484"/><stop offset="0.5" stop-color="#3a322c"/><stop offset="1" stop-color="#7a6d61"/></linearGradient></defs>
      <circle r="118" fill="url(#crGlow)"/>
      <path d="${spk}" fill="#1a1512" stroke="#6b5e52" stroke-width="1.5"/>
      <circle r="88" fill="url(#crFace)" stroke="url(#crIron)" stroke-width="6"/>
      <circle r="76" fill="none" stroke="#3a2d24" stroke-width="1.5" stroke-dasharray="2 5"/>
      <path d="M0 -70 L12 -12 L70 0 L12 12 L0 70 L-12 12 L-70 0 L-12 -12 Z" fill="none" stroke="#4a3426" stroke-width="2"/>
      <g transform="translate(-48 -48) scale(3)">${D4ART.crest(S.cls)}</g>
    </svg>
    <p class="crest-class">${esc(S.cls)}</p>
    <div class="crest-stats">${stat(eq + '/' + nSlots, 'equipped')}${stat(ga, 'greater affixes')}${stat(temp, 'tempers')}${stat(avgQ, 'avg quality')}${stat(sanct, 'transfigured')}${stat(prism ? 'Yes' : 'No', 'prism aspect')}</div>`;
  }
  function renderGear() {
    invalidate();
    const left = ['helm', 'chest', 'gloves', 'pants', 'boots'], right = ['amulet', 'ring1', 'ring2', 'weapon', 'offhand'];
    const bySlot = id => SLOTS.find(s => s.id === id);
    const sel = bySlot(gearSel) || SLOTS[0]; const g = S.gear[sel.id] || {}; const it = findItem(g.item);
    $('#panel-gear').innerHTML = `<div class="armory with-stats">
      ${statColumnHtml()}
      <div class="doll">
        <i class="orn tl"></i><i class="orn tr"></i><i class="orn bl"></i><i class="orn br"></i>
        <div class="col">${left.map(id => tileHtml(bySlot(id))).join('')}</div>
        <div class="crest">${crestHtml()}</div>
        <div class="col">${right.map(id => tileHtml(bySlot(id))).join('')}</div>
      </div>
      <div class="gear-detail">${sel.id === 'offhand' && offhandBlock() ? `<div class="card empty-card"><p class="empty">${esc(offhandBlock())}${twoHanded() ? ' Switch to a one-handed weapon to use an off-hand.' : ''}${it ? ' Its stats are left out until the slot is free.' : ''}</p></div>` : ''}
        <div id="cardHere">${itemCard(it, g, sel.name)}</div>
        <div class="detail-actions">
          <button class="btn" id="pickItem">${it ? 'Change ' + (it.kind ? 'item' : 'aspect') : 'Choose aspect or unique'}</button>
          ${it ? '<button class="btn ghost danger" id="clearItem">Remove</button>' : ''}
        </div>
        ${scanHtml()}${bagHtml()}
        ${compareHtml(sel, it, g)}
        ${it ? forgeHtml(sel, it, g) : ''}
        ${it && it.kind === 'unique' ? `<label class="check"><input type="checkbox" id="gearMythic" ${g.mythic ? 'checked' : ''}> Mythic version (every roll at its maximum)</label>` : ''}
        <div class="field"><label for="gearNote">Notes</label><input id="gearNote" type="text" value="${esc(g.note || '')}" placeholder="For example: swap to Paladin Guard on bosses"></div>
      </div></div>`;
    $$('#panel-gear .tile').forEach(t => {
      t.onclick = () => { if (gearSel !== t.dataset.slot) gemSel = -1; gearSel = t.dataset.slot; renderGear(); };
      t.onmouseenter = () => { const sl = bySlot(t.dataset.slot); const gg = S.gear[sl.id] || {}; $('#cardHere').innerHTML = itemCard(findItem(gg.item), gg, sl.name); };
      t.onmouseleave = () => { $('#cardHere').innerHTML = itemCard(it, g, sel.name); };
    });
    wireStats('#panel-gear', renderGear); wireCompare(sel, renderGear); wireScan();
    const G = () => craft(S.gear[sel.id] = S.gear[sel.id] || {});
    const redo = () => { renderGear(); commit(); };
    $('#pickItem').onclick = () => {
      const { uniq, asp } = slotItems(sel);
      openPicker(`${sel.name}: aspect or unique`, [...uniq, ...asp], pick => { const gg = G(); gg.item = { t: pick.kind ? 'u' : 'aspect', id: pick.id }; gg.uga = []; redo(); }, [
        { id: 'all', name: 'Everything', test: () => true },
        { id: 'u', name: 'Uniques and runewords', test: x => !!x.kind },
        { id: 'off', name: 'Offensive aspects', test: x => !x.kind && /Offensive/.test(x.cat) },
        { id: 'def', name: 'Defensive aspects', test: x => !x.kind && /Defensive/.test(x.cat) },
        { id: 'util', name: 'Utility, resource, mobility', test: x => !x.kind && /Utility|Resource|Mobility/.test(x.cat) },
      ]);
    };
    const clr = $('#clearItem'); if (clr) clr.onclick = () => { delete S.gear[sel.id]; redo(); };
    $('#gearNote').onchange = e => { G().note = e.target.value; redo(); };
    const my = $('#gearMythic'); if (my) my.onchange = e => { G().mythic = e.target.checked; redo(); };
    $$('#panel-gear [data-aff]').forEach(s => s.onchange = () => { const gg = G(); const i = +s.dataset.aff; gg.affixes[i] = s.value ? { id: s.value, ga: (gg.affixes[i] || {}).ga && !!s.value } : null; redo(); });
    $$('#panel-gear [data-ga]').forEach(b => b.onclick = () => { const a = G().affixes[+b.dataset.ga]; if (a) { a.ga = !a.ga; redo(); } });
    $$('#panel-gear [data-uga]').forEach(b => b.onclick = () => { const gg = G(); const i = +b.dataset.uga; gg.uga[i] = !gg.uga[i]; redo(); });
    $$('#panel-gear [data-tm]').forEach(s => s.onchange = () => { const gg = G(); const i = +s.dataset.tm; const m = temperDef(s.value); gg.tempers[i] = m ? { rid: m.id, oid: m.opts[0].id } : null; redo(); });
    $$('#panel-gear [data-to]').forEach(s => s.onchange = () => { const t = G().tempers[+s.dataset.to]; if (t) { t.oid = s.value; delete t.val; redo(); } });
    const setQ = v => { G().q = Math.max(0, Math.min(Q_MAX, Math.round(+v || 0))); redo(); };
    const qn = $('#qNum'); if (qn) qn.onchange = () => setQ(qn.value);
    const cp = $('#capPick'); if (cp) cp.onchange = () => { G().cap = +cp.value; redo(); };
    const sp = $('#sanctPick'); if (sp) sp.onchange = () => { G().sanct = sp.value || null; delete G().sanctVal; redo(); };
    const pp = $('#prismPick'); if (pp) pp.onchange = () => { G().aspect2 = pp.value || null; redo(); };
    const wp = $('#wtypePick'); if (wp) wp.onchange = () => { G().wtype = wp.value || ''; gemSel = -1; redo(); };
    const roll = v => v === '' ? '' : +v;
    $$('#panel-gear [data-av]').forEach(x => x.onchange = () => { const a = G().affixes[+x.dataset.av]; if (a) { a.val = roll(x.value); redo(); } });
    $$('#panel-gear [data-tv]').forEach(x => x.onchange = () => { const t = G().tempers[+x.dataset.tv]; if (t) { t.val = roll(x.value); redo(); } });
    $$('#panel-gear [data-sv]').forEach(x => x.onchange = () => { G().sanctVal = roll(x.value); redo(); });
    $$('#panel-gear [data-hv]').forEach(x => x.onchange = () => { const h = G().hor; if (h) { h.val = roll(x.value); redo(); } });
    const hp = $('#horPick'); if (hp) hp.onchange = () => { const gg = G(); gg.hor = hp.value ? { id: hp.value, ga: false } : null; redo(); };
    const hg = $('#horGa'); if (hg) hg.onclick = () => { const h = G().hor; if (h) { h.ga = !h.ga; redo(); } };
    $$('#panel-gear [data-gs]').forEach(b => b.onclick = () => { const i = +b.dataset.gs; gemSel = gemSel === i ? -1 : i; renderGear(); });
    $$('#panel-gear [data-gt]').forEach(b => b.onclick = () => { const gg = G(); if (!Array.isArray(gg.gems)) gg.gems = []; const t = b.dataset.gt; const prev = gg.gems[gemSel];
      if (t === 'Mythic' && SLOTS.some(sl => sl.id !== sel.id && ((S.gear[sl.id] || {}).gems || []).some(x => x && x.type === 'Mythic'))) toast('The Empyrean Eye is already socketed on another item');
      gg.gems[gemSel] = { type: t, grade: t === 'Mythic' ? 1 : (prev && prev.type !== 'Mythic' ? prev.grade : 9) };
      const n = socketMax(sel.id, findItem(gg.item)); const nxt = gg.gems.findIndex((x, k) => k < n && !x); gemSel = nxt >= 0 && !prev ? nxt : gemSel; redo(); });
    const gr = $('#gemGrade'); if (gr) gr.onchange = () => { const x = G().gems[gemSel]; if (x) { x.grade = +gr.value; redo(); } };
    const gc = $('#gemClear'); if (gc) gc.onclick = () => { G().gems[gemSel] = null; redo(); };
  }

  // ---------- charms and seals ----------
  const OLD_SEAL = { none: 'Talisman_Seal_Legendary', diamond: 'Talisman_Seal_MythicUnique_03' };
  function classSets() { return data().sets.filter(s => s.cls === S.cls || s.cls === 'All'); }
  const sealList = () => (GD().seals || []);
  function sealOf() { const ch = S.charms; if (OLD_SEAL[ch.seal]) ch.seal = OLD_SEAL[ch.seal]; return sealList().find(x => x.id === ch.seal) || sealList().find(x => x.id === 'Talisman_Seal_Legendary') || sealList()[0] || { id: '', name: 'Seal', slots: 3, forced: [], rarity: 'legendary', legendary: true }; }
  const sealAff = id => (GD().sealAffixes || []).find(a => a.id === id);
  const charmAff = id => (GD().charmAffixes || []).find(a => a.id === id);
  function sealRules() {
    const sl = sealOf(); const ch = S.charms; const extra = (ch.sealAff || []).some(id => id && /AdditionalCharmSlot/.test(id));
    let sockets = 6 + (extra ? 1 : 0), uniques = 1, minus = 0;
    if (/MythicUnique_01/.test(sl.id)) { sockets = Math.min(sockets, 5); uniques = 2; }
    if (/MythicUnique_02/.test(sl.id)) uniques = 3;
    if (/MythicUnique_03/.test(sl.id)) minus = 1;
    return { sockets, uniques, minus };
  }
  function sockets() {
    const ch = S.charms; if (!Array.isArray(ch.sockets)) ch.sockets = [];
    const n = sealRules().sockets; while (ch.sockets.length < n) ch.sockets.push(null);
    return ch.sockets.slice(0, n);
  }
  function setCount(s) {
    const ch = S.charms; const charms = sockets().filter(x => x && x.t === 'set' && x.id === s.id).length;
    const hor = +ch.horadric[s.id] || 0; const torch = ch.torch === s.id ? 1 : 0;
    return { charms, hor, torch, total: charms + hor + torch, minus: sealRules().minus };
  }
  function tierActive(s, t) { const c = setCount(s); if (!c.charms) return false; const need = Math.max(2, t.n - c.minus); return c.total >= need; }
  let socketSel = 0;
  const affHtml = a => a ? (a.html || `<span>${esc(a.t).replace('§', `<b class="num">${D4T.fmtNum(a.v)}</b>`)}</span>`) : '';
  // Charm art by rarity, like the game: magic and rare charms are blue and yellow crystals, each set charm a different cut gem
  // (same painted style), and unique and mythic charms show the unique item they come from, ringed gold or purple.
  const SET_GEMS = ['gem_emerald', 'gem_ruby', 'gem_amethyst', 'gem_diamond', 'gem_amber', 'gem_pearl', 'gem_obsidian', 'gem_moonsilver', 'gem_sapphire', 'gem_topaz'];
  const CHARM_BASE = { '1HAxe': 'axe', '2HAxe': 'axe2h', '1HDagger': 'dagger', '1HFocus': 'focus', '1HMace': 'mace', '2HMace': 'mace', '1HShield': 'shield', '1HSword': 'sword', '2HSword': 'sword2', '2HPolearm': 'polearm', '2HScythe': 'scythe', '1HScythe': 'scythe', '2HStaff': 'staff2', Glaive: 'glaive', Quarterstaff: 'druidstaff', '1HWand': 'wand', '1HTotem': 'totem', '2HBow': 'bow', '2HCrossbow': 'crossbow', Amulet: 'amulet', Boots: 'greaves', Chest: 'chest', Gloves: 'gloves', Helm: 'helm', Pants: 'leggings', Ring: 'ring1' };
  const CHARM_RARITY = { m: ['magic', '#5f8dff'], r: ['rare', '#f2d23c'], set: ['set', '#45d16e'], u: ['unique', '#d9a654'], my: ['mythic', '#b77cff'] };
  const hashStr = t => { let h = 0; for (const c of String(t)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  function charmRarity(x) { if (!x) return null; if (x.t === 'u') { const u = data().uniques.find(v => v.id === x.id); return u && u.mythic ? 'my' : 'u'; } return x.t; }
  // In game every charm is the same talisman piece (one model for all charms) told apart by rarity colour,
  // and set charms carry their set's mark. Unique and mythic charms carry a mark for the unique they come from.
  const SET_MARKS = ['shield', 'flame', 'eye', 'claw', 'crown', 'bolt', 'frost', 'wing', 'hammer', 'spear'];
  const BASE_MARK = { Ring: 'rings', Amulet: 'orb', Helm: 'crown', Chest: 'shield', Gloves: 'claw', Pants: 'stack', Boots: 'wing', '1HFocus': 'eye', '1HShield': 'shield', Glaive: 'spear', '2HPolearm': 'spear', Quarterstaff: 'spear', '2HStaff': 'bolt', '2HScythe': 'blade', '1HDagger': 'blade' };
  const hexPts = r => Array.from({ length: 6 }, (_, k) => { const t = Math.PI / 6 + k * Math.PI / 3; return (Math.cos(t) * r).toFixed(1) + ',' + (Math.sin(t) * r).toFixed(1); }).join(' ');
  function charmMark(x) {
    if (x.t === 'm') return 'drop';
    if (x.t === 'r') return 'chevrons';
    if (x.t === 'set') { const ids = classSets().map(s => s.id); const i = ids.indexOf(x.id); return SET_MARKS[(i < 0 ? hashStr(x.id) : i) % SET_MARKS.length]; }
    const m = String(x.id).match(/Talisman_Charm_Unique_(?:S\d+_[A-Z]+_)?([^_]+)_/);
    return (m && BASE_MARK[m[1]]) || 'strike';
  }
  function charmToken(x, size) {
    const rk = charmRarity(x); const col = (CHARM_RARITY[rk] || ['', '#d9a654'])[1]; const sc = (size || 40) / 40;
    return `<g class="ctoken r-${rk}" transform="scale(${sc})">
      <polygon points="${hexPts(40)}" fill="url(#gTokRim)" stroke="#0a0807" stroke-width="2.5"/>
      <polygon points="${hexPts(33)}" fill="url(#gTok-${rk})" stroke="${col}" stroke-width="2"/>
      <polygon points="${hexPts(33)}" fill="url(#gTokShine)"/>
      <g class="cmark" style="color:${col}">${D4ART.motif(charmMark(x), '#fff4dc', 0.52)}</g>
    </g>`;
  }
  const tokenDefs = () => `<linearGradient id="gTokRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a8c7c"/><stop offset="0.45" stop-color="#3b332c"/><stop offset="1" stop-color="#6e6257"/></linearGradient>
    <radialGradient id="gTokShine" cx="35%" cy="25%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/></radialGradient>
    ${Object.entries(CHARM_RARITY).map(([k, [, c]]) => `<radialGradient id="gTok-${k}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="${c}"/><stop offset="0.55" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="#0a0807"/></radialGradient>`).join('')}`;
  function socketItem(x) {
    if (!x) return null;
    const lines = (x.aff || []).map(charmAff).filter(Boolean).map(affHtml);
    if (x.t === 'set') {
      const st = data().sets.find(s => s.id === x.id); if (!st) return null;
      const piece = ((GD().setPieces || {})[x.id] || []).find(p => p.id === x.piece);
      return { name: piece ? piece.name : st.name + ' charm', set: st, lines, kind: 'charm', type: `Set charm, ${st.name}`, classes: [S.cls] };
    }
    if (x.t === 'm' || x.t === 'r') { const nm = x.t === 'm' ? 'Magic charm' : 'Rare charm'; return { name: nm, lines, kind: 'charm', type: nm, affixes: [], classes: [S.cls] }; }
    const u = data().uniques.find(u => u.id === x.id); if (!u) return null;
    return Object.assign({}, u, { lines, type: u.mythic ? 'Mythic unique charm' : 'Unique charm' });
  }
  function charmCard(it, x) {
    const sets = it.set ? `<div class="setpow"><p class="setpow-h">${esc(it.set.name)}</p>${it.set.tiers.map(t => `<div class="tier${tierActive(it.set, t) ? ' on' : ''}"><span class="req">${t.n}</span><div>${t.desc}</div></div>`).join('')}</div>` : '';
    const rk = (CHARM_RARITY[charmRarity(x)] || ['unique'])[0];
    return `<div class="card charm-${rk} ${x.t === 'set' ? 'charm' : x.t === 'm' ? 'magic' : x.t === 'r' ? 'rare' : rk === 'mythic' ? 'mythic' : 'unique'}"><div class="card-head"><h3>${esc(it.name)}</h3><p>${esc(it.type || 'Charm')}</p></div>
      <div class="card-body">${(it.affixes || []).length ? `<div class="affix-lines">${it.affixes.map(a => `<p class="ln"><i class="dot"></i><span>${a}</span></p>`).join('')}</div>` : ''}
      ${it.lines.length ? `<div class="affix-lines">${it.lines.map(a => `<p class="ln"><i class="dot"></i><span>${a}</span></p>`).join('')}</div>` : ''}
      ${it.desc ? `<div class="power">${it.desc}</div>` : ''}${sets}</div></div>`;
  }
  function renderCharms() {
    invalidate();
    const ch = S.charms; const sets = classSets(); const sk = sockets(); const rules = sealRules(); const seal = sealOf();
    if (!Array.isArray(ch.sealAff)) ch.sealAff = [];
    if (socketSel >= sk.length) socketSel = 0;
    const horUsed = sets.reduce((a, s) => a + (+ch.horadric[s.id] || 0), 0);
    const charmItems = dedupe(data().uniques.filter(u => u.kind === 'charm' && classUsable(u)));
    const uniqCount = sk.filter(x => x && x.t === 'u').length;
    const R = 150, pos = sk.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / sk.length; return [Math.cos(a) * R, Math.sin(a) * R]; });
    const setCol = '#8fd16a', uniqCol = '#f0b660';
    const sockSvg = sk.map((x, i) => {
      const it = socketItem(x); const rr = CHARM_RARITY[charmRarity(x)]; const kind = rr ? rr[0] : 'none'; const col = rr ? rr[1] : '';
      const prongs = [45, 135, 225, 315].map(d => `<path d="M0 -58 L7 -44 L0 -40 L-7 -44 Z" class="prong" transform="rotate(${d})"/>`).join('');
      const gem = it ? charmToken(x, 38) : '<circle r="6" class="empty-dot"/>';
      return `<g class="sock ${kind}${socketSel === i ? ' sel' : ''}" data-s="${i}" tabindex="0" role="button" aria-label="Socket ${i + 1}: ${esc(it ? it.name : 'empty')}" transform="translate(${pos[i][0]} ${pos[i][1]})" style="--gc:${col || '#5a4e44'}">
        ${it ? `<polygon points="${hexPts(64)}" class="sock-glow"/>` : ''}<polygon points="${hexPts(54)}" class="sock-rim"/>${it ? `<polygon points="${hexPts(50)}" class="rar-ring"/>` : ''}<polygon points="${hexPts(45)}" class="sock-hole"/>${gem}
      </g>`;
    }).join('');
    const spikesSeal = (() => { let d = ''; const n = 36; for (let k = 0; k < n * 2; k++) { const a = Math.PI * k / n; const r = k % 2 ? 214 : 226; d += (k ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1); } return d + 'Z'; })();
    const star = pos.length ? 'M' + pos.map((p, i) => pos[(i * 2) % pos.length].join(' ')).join(' L') + ' Z' : '';
    const runes = Array.from({ length: 24 }, (_, k) => `<path d="M-4 -192 L0 -200 L4 -192 M0 -200 V-182" class="rune" transform="rotate(${k * 15})"/>`).join('');
    const x = sk[socketSel]; const cur = socketItem(x);
    const rimCol = { magic: '#6c8bd0', rare: '#d8c050', legendary: '#d8742d', ancestral: '#d8742d', mythic: '#b88ae6' }[seal.rarity] || '#8a7d70';
    // charm editor for the selected socket
    const okCls = a => !a.cls || !a.cls.length || a.cls.includes(S.cls);
    const cPool = (GD().charmAffixes || []).filter(okCls);
    let editor = '';
    if (x && cur) {
      const pieces = x.t === 'set' ? ((GD().setPieces || {})[x.id] || []) : [];
      const aff = x.aff || [];
      editor = `${pieces.length ? `<div class="frow"><label class="flabel" for="piecePick">Charm</label><select id="piecePick">${pieces.map(p => `<option value="${p.id}" ${p.id === x.piece ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></div>` : ''}
        ${(x.t === 'm' ? [0] : [0, 1]).map(i => `<div class="frow"><select data-caff="${i}" aria-label="Charm affix ${i + 1}"><option value="">Charm affix ${i + 1}: choose...</option>${cPool.filter(p => !aff.includes(p.id) || aff[i] === p.id).map(p => `<option value="${p.id}" ${p.id === aff[i] ? 'selected' : ''}>${esc(p.html ? strip(p.html) : p.t.replace('§', p.v)).slice(0, 90)}</option>`).join('')}</select></div>`).join('')}`;
    }
    // seal affix rows
    const sPool = (GD().sealAffixes || []);
    const normal = sPool.filter(a => a.kind === 'normal' || a.kind === 'virtue' || a.kind === 'special');
    const legend = sPool.filter(a => a.kind === 'legendary' || (a.kind === 'set' && sets.some(s => s.id === a.set)));
    const nRows = seal.slots || 3;
    const sealRows = Array.from({ length: nRows }, (_, i) => `<div class="frow"><select data-saff="${i}" aria-label="Seal affix ${i + 1}"><option value="">Seal affix ${i + 1}: choose...</option>
      <optgroup label="Seal affixes">${normal.map(a => `<option value="${a.id}" ${a.id === ch.sealAff[i] ? 'selected' : ''}>${esc(a.html ? strip(a.html) : a.t.replace('§', a.v)).slice(0, 95)}</option>`).join('')}</optgroup>
      ${seal.legendary ? `<optgroup label="Legendary and set seal powers">${legend.map(a => `<option value="${a.id}" ${a.id === ch.sealAff[i] ? 'selected' : ''}>${esc(a.html ? strip(a.html) : a.t.replace('§', a.v)).slice(0, 95)}</option>`).join('')}</optgroup>` : ''}</select></div>`).join('');
    const sealLines = ch.sealAff.slice(0, nRows).map(sealAff).filter(Boolean);
    $('#panel-charms').innerHTML = `<div class="seal-layout">
      <div class="seal-wrap">
        <svg class="seal" viewBox="-240 -240 480 480" aria-label="Seal">
          <defs>
            <radialGradient id="gSeal" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#2a201a"/><stop offset="0.7" stop-color="#141009"/><stop offset="1" stop-color="#070605"/></radialGradient>
            <radialGradient id="gCore" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#4a1a10"/><stop offset="1" stop-color="#0d0706"/></radialGradient>
            <linearGradient id="gIronS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a7d70"/><stop offset="0.5" stop-color="#3a332d"/><stop offset="1" stop-color="#6b6058"/></linearGradient>
            ${tokenDefs()}
            <radialGradient id="gSealFace" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="${rimCol}"/><stop offset="0.6" stop-color="${rimCol}" stop-opacity="0.35"/><stop offset="1" stop-color="#0a0807"/></radialGradient>
          </defs>
          <path d="${spikesSeal}" fill="#1a1512" stroke="${rimCol}" stroke-width="2.5"/>
          <circle r="208" fill="url(#gSeal)" stroke="url(#gIronS)" stroke-width="8"/>
          <circle r="196" fill="none" stroke="${rimCol}" stroke-width="2" opacity="0.6"/>
          <circle r="186" fill="none" stroke="#2e2722" stroke-width="2"/>${runes}
          <path d="${star}" class="hex"/>
          <circle r="${R}" fill="none" class="orbit"/>
          <circle r="86" fill="url(#gCore)" stroke="url(#gIronS)" stroke-width="7"/>
          <circle r="70" fill="none" stroke="#3a2a22" stroke-width="2"/>
          <g class="seal-item" aria-hidden="true"><polygon points="${hexPts(62)}" fill="url(#gTokRim)" stroke="#0a0807" stroke-width="3"/><polygon points="${hexPts(52)}" fill="url(#gSealFace)" stroke="${rimCol}" stroke-width="2.5"/><polygon points="${hexPts(52)}" fill="url(#gTokShine)"/>
            <g class="sigil"><path d="M0 -40 L11 -11 L40 0 L11 11 L0 40 L-11 11 L-40 0 L-11 -11 Z"/><circle r="9"/></g></g>
          ${sockSvg}
        </svg>
        <p class="seal-caption" style="color:${rimCol}">${esc(seal.name)}</p>
        <div class="socket-detail">
          <h3>Socket ${socketSel + 1}</h3>
          ${cur ? charmCard(cur, x) : '<p class="empty">Empty socket. Add a magic, rare, set, unique or mythic charm.</p>'}
          <div class="detail-actions">
            <select id="setPick" aria-label="Set charm"><option value="">${x && x.t === 'set' ? 'Change set...' : 'Add a set charm...'}</option>${sets.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select>
            <button class="btn" id="magicPick">Magic charm</button>
            <button class="btn" id="rarePick">Rare charm</button>
            <button class="btn" id="uniqPick">Unique or mythic charm</button>
            ${cur ? '<button class="btn ghost danger" id="sockClear">Empty socket</button>' : ''}
          </div>
          ${editor ? `<section class="forge">${editor}</section>` : ''}
        </div>
      </div>
      <div class="seal-side">
        <div class="box">
          <h3>Seal</h3>
          <div class="field"><label for="seal">Seal</label><select id="seal">${sealList().map(s => `<option value="${s.id}" ${s.id === seal.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></div>
          ${seal.forced.map(f => `<p class="seal-power">${f.html}</p>`).join('')}
          <p class="note">${rules.sockets} charm sockets, up to ${rules.uniques} unique charm${rules.uniques > 1 ? 's' : ''}${uniqCount > rules.uniques ? `. You have ${uniqCount} socketed, which is more than this seal allows` : ''}.</p>
          <section class="forge">${sealRows}</section>
          ${sealLines.length ? `<div class="affix-lines seal-lines">${sealLines.map(a => `<p class="ln"><i class="dot"></i><span>${affHtml(a)}</span></p>`).join('')}</div>` : ''}
        </div>
        <div class="box">
          <h3>Extras</h3>
          <div class="field"><label for="torch">Hellfire Torch set line (+1 to one set)</label><select id="torch"><option value="">No Torch line</option>${sets.map(s => `<option value="${s.id}" ${s.id === ch.torch ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></div>
          <p class="note">${horUsed} of 3 Horadric jewelry pieces assigned below.${horUsed > 3 ? ' That is more than your 3 jewelry slots.' : ''} Horadric jewelry and the Torch only count when at least one charm from that set is socketed.</p>
        </div>
        ${sets.map(s => { const c = setCount(s); const act = s.tiers.some(t => tierActive(s, t)); return `<article class="set-card${act ? ' active' : ''}">
          <header><h4>${esc(s.name)}</h4><span class="counter"><span>${c.charms} socketed</span><label>Horadric <input type="number" min="0" max="3" data-set="${s.id}" value="${c.hor}"></label><span class="total" title="Set count">${c.total}</span></span></header>
          ${s.tiers.map(t => `<div class="tier${tierActive(s, t) ? ' on' : ''}"><span class="req">${t.n}${c.minus ? `<small>needs ${Math.max(2, t.n - c.minus)}</small>` : ''}</span><div>${t.desc}</div></div>`).join('')}
        </article>`; }).join('')}
      </div></div>`;
    const redo = () => { renderCharms(); commit(); };
    $$('#panel-charms .sock').forEach(g => { const go = () => { socketSel = +g.dataset.s; renderCharms(); }; g.onclick = go; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }; });
    $('#setPick').onchange = e => { if (!e.target.value) return; const pcs = (GD().setPieces || {})[e.target.value] || []; const used = new Set(ch.sockets.filter(y => y && y.t === 'set').map(y => y.piece)); const pc = pcs.find(p => !used.has(p.id)) || pcs[0]; ch.sockets[socketSel] = { t: 'set', id: e.target.value, piece: pc ? pc.id : null, aff: (x && x.aff) || [] }; if (!x) socketSel = Math.min(sk.length - 1, socketSel + 1); redo(); };
    $('#uniqPick').onclick = () => openPicker('Unique charm', charmItems, it => { if ((!x || x.t !== 'u') && uniqCount >= rules.uniques) toast(`This seal allows ${rules.uniques} unique charm${rules.uniques > 1 ? 's' : ''}`); ch.sockets[socketSel] = { t: 'u', id: it.id, aff: (x && x.aff) || [] }; redo(); });
    const plain = t => () => { ch.sockets[socketSel] = { t, aff: ((x && x.aff) || []).slice(0, t === 'm' ? 1 : 2) }; if (!x) socketSel = Math.min(sk.length - 1, socketSel + 1); redo(); };
    $('#magicPick').onclick = plain('m'); $('#rarePick').onclick = plain('r');
    const sc = $('#sockClear'); if (sc) sc.onclick = () => { ch.sockets[socketSel] = null; redo(); };
    const pp = $('#piecePick'); if (pp) pp.onchange = () => { ch.sockets[socketSel].piece = pp.value; redo(); };
    $$('#panel-charms [data-caff]').forEach(s => s.onchange = () => { const y = ch.sockets[socketSel]; if (!y) return; y.aff = y.aff || []; y.aff[+s.dataset.caff] = s.value || null; redo(); });
    $$('#panel-charms [data-saff]').forEach(s => s.onchange = () => { ch.sealAff[+s.dataset.saff] = s.value || null; redo(); });
    $('#seal').onchange = e => { ch.seal = e.target.value; redo(); };
    $('#torch').onchange = e => { ch.torch = e.target.value; redo(); };
    $$('#panel-charms input[data-set]').forEach(i => i.onchange = () => { ch.horadric[i.dataset.set] = Math.max(0, +i.value || 0); redo(); });
  }

  // ---------- paragon ----------
  const PARA = window.D4PARAGON ? window.D4PARAGON({ $, $$, esc, toast, openPicker, getS: () => S, data, commit }) : null;

  // ---------- calculators ----------
  function unlockedSkills() { const C = cdata(); return Object.keys(C.powers).filter(p => skillRank(p) > 0); }
  function rowsHtml(list, key, extra) {
    return `<div class="rows" data-list="${key}">${list.map((r, k) => `<div class="r${extra ? ' three' : ''}"><input data-k="${k}" data-f="n" value="${esc(r.n)}" aria-label="Source"><input data-k="${k}" data-f="v" type="number" step="any" value="${r.v}" aria-label="Value">${extra ? `<input data-k="${k}" data-f="cdr" type="number" step="any" value="${r.cdr || 0}" aria-label="Cooldown cut in seconds" title="Cooldown cut per proc, seconds">` : ''}<button class="x" data-k="${k}" aria-label="Remove row">×</button></div>`).join('')}</div><button class="btn tiny ghost" data-add="${key}">Add row</button>`;
  }
  function wireRows(root, onChange) {
    $$('[data-list]', root).forEach(box => {
      const path = box.dataset.list.split('.'); const list = path.reduce((o, k) => o[k], S.calc);
      $$('input', box).forEach(i => i.onchange = () => { const r = list[+i.dataset.k]; r[i.dataset.f] = i.dataset.f === 'n' ? i.value : (+i.value || 0); onChange(); });
      $$('.x', box).forEach(b => b.onclick = () => { list.splice(+b.dataset.k, 1); onChange(true); });
    });
    $$('[data-add]', root).forEach(b => b.onclick = () => { const path = b.dataset.add.split('.'); path.reduce((o, k) => o[k], S.calc).push({ n: 'New source', v: 0 }); onChange(true); });
  }
  function skillOptions(sel) { const C = cdata(); const list = unlockedSkills(); return `<option value="">${list.length ? 'Pick a skill from your tree' : 'Unlock skills in the tree first'}</option>` + list.map(p => `<option value="${p}" ${p === sel ? 'selected' : ''}>${esc(C.powers[p].name)}</option>`).join(''); }

  function calcCooldown() {
    const c = S.calc.cd; const base = c.base !== '' ? +c.base : (c.skill && cdata().powers[c.skill] ? skillCtx(c.skill).cd() : 0);
    const SB = c.skill && cdata().powers[c.skill] ? skillBonus(c.skill) : null;
    let keep = 1; (SB ? SB.cdrParts : []).forEach(x => { keep *= 1 - Math.max(0, Math.min(100, x.v)) / 100; });
    for (const r of c.cdr) keep *= 1 - Math.max(0, Math.min(100, +r.v || 0)) / 100;
    const pct = Math.min(0.75, 1 - keep); const flat = c.flat.reduce((a, r) => a + (+r.v || 0), 0);
    const afterPct = base * (1 - pct); const eff = afterPct / (1 + flat); const dur = +c.dur || 0;
    return { base, pct, afterPct, flat, eff, dur, uptime: dur && eff ? Math.min(1, dur / eff) : null, capped: 1 - keep > 0.75, build: SB ? SB.cdrParts : [] };
  }
  // Lucky Hit effects on equipped aspects, uniques and charms ("Lucky Hit: Up to a 30% chance to ...")
  function gearLuckyEffects() {
    const out = []; const seen = new Set();
    const scan = (name, html) => {
      const t = strip(String(html || '')).replace(/\s+/g, ' ');
      const re = /Lucky Hit:[^.]*?(?:up to an? |)\[?([\d.]+)(?:\s*-\s*([\d.]+))?\]?%\s*chance/gi; let m;
      while ((m = re.exec(t))) { const v = +(m[2] || m[1]); const k = name + v; if (seen.has(k)) continue; seen.add(k); out.push({ n: name + ' (from your gear)', v, cdr: 0, auto: true }); }
    };
    SLOTS.forEach(sl => { const it = findItem((S.gear[sl.id] || {}).item); if (it) scan(it.name, it.desc); const a2 = (S.gear[sl.id] || {}).aspect2 && data().aspects.find(a => a.id === S.gear[sl.id].aspect2); if (a2) scan(a2.name, a2.desc); });
    sockets().forEach(x => { const it = socketItem(x); if (it && it.desc) scan(it.name, it.desc); });
    return out;
  }
  function calcLucky() {
    const c = S.calc.lh; const base = c.base !== '' ? +c.base : (c.skill && cdata().powers[c.skill] ? skillCtx(c.skill).lh() : 0);
    const buildLhc = c.skill && cdata().powers[c.skill] ? skillBonus(c.skill).lhc : 0;
    const chance = base / 100 * (1 + (buildLhc + (+c.bonus || 0)) / 100);
    const fx = [...gearLuckyEffects(), ...c.fx].map(f => { const p = Math.min(1, chance * (+f.v || 0) / 100); return { n: f.n, p, perSec: p * (+c.hits || 0), cdr: (+f.cdr || 0) * p * (+c.hits || 0) }; });
    return { base, chance, fx, buildLhc, cdrPerSec: fx.reduce((a, f) => a + f.cdr, 0) };
  }
  function calcDamage(mod) {
    const d = Object.assign({}, S.calc.dmg, mod || {}); const mult = (mod && mod.mult) || S.calc.dmg.mult;
    const scal = MAINSTAT[S.cls][1];
    const rankF = r => { r = Math.max(1, r); const fives = Math.floor(r / 5); return 1 + 0.1 * (r - fives - 1) + 0.15 * fives; };
    const ms = 1 + d.ms * scal; const add = 1 + d.add / 100; const cc = Math.min(1, d.cc / 100);
    const crit = 1 + cc * (1.5 * (1 + d.cd / 100) - 1);
    const vuln = 1.2 * (1 + d.vuln / 100) * (d.vulnUp / 100) + (1 - d.vulnUp / 100);
    const x = mult.reduce((a, r) => a * (1 + (+r.v || 0) / 100), 1);
    return d.wd * ms * rankF(d.ranks) * add * crit * vuln * x;
  }
  function upgradeRanking() {
    const base = calcDamage(); const d = S.calc.dmg;
    const opts = [
      { n: '+10% [x] new multiplier', m: { mult: [...d.mult, { v: 10 }] } },
      { n: '+25% crit damage', m: { cd: d.cd + 25 } },
      { n: '+5% crit chance', m: { cc: d.cc + 5 } },
      { n: '+25% vulnerable damage', m: { vuln: d.vuln + 25 } },
      { n: '+50% additive [+] damage', m: { add: d.add + 50 } },
      { n: '+180 main stat', m: { ms: d.ms + 180 } },
      { n: '+2 skill ranks', m: { ranks: d.ranks + 2 } },
      { n: '+10% weapon damage', m: { wd: d.wd * 1.1 } },
    ].map(o => ({ n: o.n, g: calcDamage(o.m) / base - 1 })).sort((a, b) => b.g - a.g);
    return opts;
  }
  function calcEhp() {
    const e = S.calc.ehp; let keep = (1 - Math.min(0.85, e.armorDr / 100)) * (1 - Math.min(0.7, e.res / 100));
    for (const r of e.dr) keep *= 1 - Math.max(0, Math.min(100, +r.v || 0)) / 100;
    return { keep, dr: 1 - keep, ehp: keep > 0 ? e.life / keep : Infinity };
  }
  function renderCalc() {
    invalidate();
    const c = S.calc; const C = cdata();
    const cd = calcCooldown(), lk = calcLucky(), eh = calcEhp(); const dmg = calcDamage(); const rank = upgradeRanking();
    const top = Math.max(...rank.map(r => r.g), 0.0001);
    const stones = [
      ...c.dmg.mult.map(r => ({ n: r.n, v: 1 + (+r.v || 0) / 100, x: true })),
      { n: 'Additive damage pool', v: 1 + c.dmg.add / 100, x: false },
      { n: 'Critical strikes (average)', v: 1 + Math.min(1, c.dmg.cc / 100) * (1.5 * (1 + c.dmg.cd / 100) - 1), x: true },
      { n: 'Vulnerable (average)', v: 1.2 * (1 + c.dmg.vuln / 100) * (c.dmg.vulnUp / 100) + (1 - c.dmg.vulnUp / 100), x: true },
      { n: MAINSTAT[S.cls][0], v: 1 + c.dmg.ms * MAINSTAT[S.cls][1], x: true },
    ].sort((a, b) => a.v - b.v);
    const maxLog = Math.max(...stones.map(s => Math.log(s.v)), 0.01);
    $('#panel-calc').innerHTML = `<div class="calc-grid">
      <div class="box calc" id="c-cd">
        <h3>Cooldown and uptime</h3>
        <p class="lead">Every cooldown reduction source multiplies, capped at 75%. Your build's sources are read automatically; add conditional ones below. Flat cuts (Reaver explosions, Eom, Resplendence) shorten what is left.</p>
        <div class="kv">
          <label for="cdSkill">Skill</label><select id="cdSkill">${skillOptions(c.cd.skill)}</select>
          <label for="cdBase">Base cooldown override (s)</label><input id="cdBase" type="number" step="any" value="${esc(c.cd.base)}" placeholder="${cd.base ? D4T.fmtNum(cd.base) : ''}">
          <label for="cdDur">Effect duration (s), for uptime</label><input id="cdDur" type="number" step="any" value="${esc(c.cd.dur)}">
        </div>
        <h3 style="margin-top:14px;font-size:15px">From your build</h3>${cd.build.length ? `<ul class="auto-rows">${cd.build.map(x => `<li><span>${esc(x.src)} (${esc(x.scope)})</span><b class="num">${D4T.fmtNum(Math.round(x.v * 10) / 10)}%</b></li>`).join('')}</ul>` : `<p class="note">${c.cd.skill ? 'No cooldown reduction on this build yet.' : 'Pick a skill to read its cooldown reduction from your build.'}</p>`}
        <h3 style="margin-top:14px;font-size:15px">Extra percent cooldown reduction</h3>${rowsHtml(c.cd.cdr, 'cd.cdr')}
        <h3 style="margin-top:10px;font-size:15px">Flat cuts, seconds per second</h3>${rowsHtml(c.cd.flat, 'cd.flat')}
        <div class="result">
          <div class="big">${cd.base ? D4T.fmtNum(cd.eff, 2) + ' s' : '...'}<small>effective cooldown</small></div>
          <p>Base ${D4T.fmtNum(cd.base, 1)} s, ${D4T.fmtNum(cd.pct * 100, 1)}% CDR${cd.capped ? ' (capped)' : ''}, then ${D4T.fmtNum(cd.flat, 2)} s cut every second${lk.cdrPerSec ? `, including ${D4T.fmtNum(lk.cdrPerSec, 2)} from your Lucky Hit procs if you add them here` : ''}.</p>
          ${cd.uptime != null ? `<p>Uptime: <b class="num">${D4T.fmtNum(cd.uptime * 100)}%</b>${cd.uptime >= 1 ? ', always up' : ''}.</p>` : ''}
        </div>
      </div>

      <div class="box calc" id="c-lh">
        <h3>Lucky Hit procs</h3>
        <p class="lead">Proc chance per hit = skill Lucky Hit × (1 + bonus Lucky Hit) × the effect's "up to" chance. Bonus Lucky Hit and gear effects are read from your build.</p>
        <div class="kv">
          <label for="lhSkill">Skill</label><select id="lhSkill">${skillOptions(c.lh.skill)}</select>
          <label for="lhBase">Skill Lucky Hit override (%)</label><input id="lhBase" type="number" step="any" value="${esc(c.lh.base)}" placeholder="${lk.base ? D4T.fmtNum(lk.base) : ''}">
          <label>Bonus Lucky Hit from your build</label><output class="num">${D4T.fmtNum(Math.round(lk.buildLhc * 10) / 10)}%</output>
          <label for="lhBonus">Extra bonus Lucky Hit (%)</label><input id="lhBonus" type="number" step="any" value="${c.lh.bonus}">
          <label for="lhHits">Hits per second</label><input id="lhHits" type="number" step="any" value="${c.lh.hits}">
        </div>
        ${lk.fx.filter(f => f.auto).length ? `<h3 style="margin-top:14px;font-size:15px">Found on your gear</h3><ul class="auto-rows">${lk.fx.filter(f => f.auto).map(f => `<li><span>${esc(f.n.replace(' (from your gear)', ''))}</span><b class="num">up to ${D4T.fmtNum(f.v)}%</b></li>`).join('')}</ul>` : ''}
        <h3 style="margin-top:14px;font-size:15px">Extra effects: chance %, cooldown cut per proc (s)</h3>${rowsHtml(c.lh.fx, 'lh.fx', true)}
        <div class="result">
          <div class="big">${D4T.fmtNum(lk.chance * 100, 1)}%<small>Lucky Hit roll per hit</small></div>
          ${lk.fx.length ? lk.fx.map(f => `<p>${esc(f.n)}: ${D4T.fmtNum(f.p * 100, 1)}% per hit, ${D4T.fmtNum(f.perSec, 2)} per second${f.perSec ? `, about every ${D4T.fmtNum(1 / f.perSec, 1)} s` : ''}${f.cdr ? `, ${D4T.fmtNum(f.cdr, 2)} s of cooldown cut per second` : ''}</p>`).join('') : '<p>No Lucky Hit effects found on your gear yet. Add one below to test it.</p>'}
        </div>
      </div>

      <div class="box calc" id="c-dmg">
        <h3>Damage multipliers</h3>
        <p class="lead">Every [x] source multiplies. All [+] sources share one additive pool. ${esc(S.cls)} gains ${(MAINSTAT[S.cls][1] * 100).toFixed(3)}% per point of ${MAINSTAT[S.cls][0]}.</p>
        <div class="kv">
          <label for="d-wd">Weapon damage</label><input id="d-wd" data-d="wd" type="number" value="${c.dmg.wd}">
          <label for="d-ms">${MAINSTAT[S.cls][0]} (total)</label><input id="d-ms" data-d="ms" type="number" value="${c.dmg.ms}">
          <label for="d-ranks">Skill ranks</label><input id="d-ranks" data-d="ranks" type="number" value="${c.dmg.ranks}">
          <label for="d-add">Additive [+] damage (%)</label><input id="d-add" data-d="add" type="number" value="${c.dmg.add}">
          <label for="d-cc">Crit chance (%)</label><input id="d-cc" data-d="cc" type="number" value="${c.dmg.cc}">
          <label for="d-cd">Crit damage multiplier (%)</label><input id="d-cd" data-d="cd" type="number" value="${c.dmg.cd}">
          <label for="d-vu">Vulnerable damage multiplier (%)</label><input id="d-vu" data-d="vuln" type="number" value="${c.dmg.vuln}">
          <label for="d-vup">Vulnerable uptime (%)</label><input id="d-vup" data-d="vulnUp" type="number" value="${c.dmg.vulnUp}">
        </div>
        <h3 style="margin-top:14px;font-size:15px">Other [x] multipliers (%)</h3>${rowsHtml(c.dmg.mult, 'dmg.mult')}
        <div class="result">
          <div class="big">×${D4T.fmtNum(dmg / Math.max(1, c.dmg.wd), 0)}<small>total multiplier on weapon damage</small></div>
          <div class="stack" aria-label="Multiplier stack">${stones.map(s => `<div class="stone${s.x ? '' : ' add'}" style="height:${Math.round(20 + 34 * Math.log(s.v) / maxLog)}px"><span>${esc(s.n)}</span><b>×${s.v.toFixed(2)}</b></div>`).join('')}</div>
          <h3 style="margin:16px 0 4px;font-size:15px">Best next upgrade</h3>
          <ul class="rank-list">${rank.map(r => `<li><span>${esc(r.n)}</span><b>+${(r.g * 100).toFixed(1)}%</b><span class="bar"><i style="width:${Math.max(2, r.g / top * 100)}%"></i></span></li>`).join('')}</ul>
        </div>
      </div>

      <div class="box calc" id="c-ehp">
        <h3>Toughness</h3>
        <p class="lead">Damage reduction sources multiply. Use the Armor and resistance percentages from your character sheet.</p>
        <div class="kv">
          <label for="e-life">Maximum Life</label><input id="e-life" data-e="life" type="number" value="${c.ehp.life}">
          <label for="e-ar">Armor damage reduction (%)</label><input id="e-ar" data-e="armorDr" type="number" value="${c.ehp.armorDr}">
          <label for="e-res">Resistance (%)</label><input id="e-res" data-e="res" type="number" value="${c.ehp.res}">
        </div>
        <h3 style="margin-top:14px;font-size:15px">Other damage reduction (%)</h3>${rowsHtml(c.ehp.dr, 'ehp.dr')}
        <div class="result">
          <div class="big">${D4T.fmtNum(eh.ehp)}<small>effective Life</small></div>
          <p>You take ${D4T.fmtNum(eh.keep * 100, 2)}% of incoming damage (${D4T.fmtNum(eh.dr * 100, 2)}% total reduction).</p>
        </div>
      </div>
    </div>`;
    const root = $('#panel-calc'); const redo = () => { renderCalc(); commit(); };
    wireRows(root, redo);
    $('#cdSkill').onchange = e => { c.cd.skill = e.target.value; c.cd.base = ''; redo(); };
    $('#cdBase').onchange = e => { c.cd.base = e.target.value; redo(); };
    $('#cdDur').onchange = e => { c.cd.dur = e.target.value; redo(); };
    $('#lhSkill').onchange = e => { c.lh.skill = e.target.value; c.lh.base = ''; redo(); };
    $('#lhBase').onchange = e => { c.lh.base = e.target.value; redo(); };
    $('#lhBonus').onchange = e => { c.lh.bonus = +e.target.value || 0; redo(); };
    $('#lhHits').onchange = e => { c.lh.hits = +e.target.value || 0; redo(); };
    $$('[data-d]', root).forEach(i => i.onchange = () => { c.dmg[i.dataset.d] = +i.value || 0; redo(); });
    $$('[data-e]', root).forEach(i => i.onchange = () => { c.ehp[i.dataset.e] = +i.value || 0; redo(); });
  }

  // ---------- codex ----------
  let codexKind = 'aspect', codexQ = '';
  function renderCodex() {
    const D = data();
    const kinds = [['aspect', 'Aspects'], ['unique', 'Uniques'], ['runeword', 'Runewords'], ['charm', 'Charms'], ['set', 'Charm sets']];
    let list;
    if (codexKind === 'aspect') list = dedupe(D.aspects.filter(classUsable));
    else if (codexKind === 'set') list = classSets().map(s => ({ name: s.name, desc: s.tiers.map(t => `<b>${t.n}-piece:</b> ${t.desc}`).join('<br>'), kind: 'charm', type: 'Set', classes: [] }));
    else list = dedupe(D.uniques.filter(u => u.kind === codexKind && classUsable(u)));
    const q = codexQ.toLowerCase();
    const shown = list.filter(it => !q || (it.name + ' ' + strip(it.desc) + ' ' + (it.affixes || []).join(' ')).toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));
    $('#panel-codex').innerHTML = `<div class="codex-bar"><input type="search" id="codexQ" value="${esc(codexQ)}" placeholder="Search names and effects, for example Lucky Hit or Judgement" aria-label="Search the codex">${kinds.map(([k, n]) => `<button class="chip${k === codexKind ? ' on' : ''}" data-k="${k}">${n}</button>`).join('')}</div>
      <p class="empty">${shown.length} ${kinds.find(k => k[0] === codexKind)[1].toLowerCase()} usable by ${esc(S.cls)} in ${S.ver === 'ptr' ? 'the Season 16 PTR' : 'Season 15'} data.</p>
      <div class="entries">${shown.slice(0, 400).map(it => entryHtml(it, q)).join('')}</div>`;
    const qi = $('#codexQ'); qi.oninput = () => { codexQ = qi.value; const pos = qi.selectionStart; renderCodex(); const n = $('#codexQ'); n.focus(); n.setSelectionRange(pos, pos); };
    $$('#panel-codex .chip').forEach(b => b.onclick = () => { codexKind = b.dataset.k; renderCodex(); });
  }

  // ---------- ledger ----------
  function renderLedger() {
    invalidate();
    const C = cdata(); const skills = unlockedSkills();
    const spent = Object.values(S.alloc).reduce((a, b) => a + b, 0);
    const gear = SLOTS.map(sl => { const it = findItem((S.gear[sl.id] || {}).item); return it ? `<li><span>${esc(it.name)}</span><span>${sl.name}</span></li>` : ''; }).join('');
    const sets = classSets().map(s => { const on = s.tiers.filter(t => tierActive(s, t)).map(t => t.n); return on.length ? `<li><span>${esc(s.name)}</span><span>${on.join(', ')}-piece</span></li>` : ''; }).join('');
    const cd = calcCooldown(); const eh = calcEhp();
    const charmsUsed = sockets().filter(Boolean).length;
    $('#ledger').innerHTML = `<h2>Build Planner</h2>
      <div class="stat-row">
        <div class="stat"><b>${spent}</b><span>skill points</span></div>
        <div class="stat"><b>${skills.length}</b><span>skills unlocked</span></div>
        <div class="stat"><b>${cd.base ? D4T.fmtNum(cd.eff, 1) + 's' : '...'}</b><span>${cd.base && S.calc.cd.skill && C.powers[S.calc.cd.skill] ? esc(C.powers[S.calc.cd.skill].name) : 'key cooldown'}</span></div>
        <div class="stat"><b>${D4T.fmtNum(eh.dr * 100, 1)}%</b><span>damage reduction</span></div>
      </div>
      <h3>Skills</h3><ul>${skills.map(p => `<li><span>${esc(C.powers[p].name)}</span><span>rank ${skillRank(p)}${[...activeMods(p)].length ? ', ' + [...activeMods(p)].length + ' upg.' : ''}</span></li>`).join('') || '<li><span>None yet</span><span></span></li>'}</ul>
      <h3>Gear</h3><ul>${gear || '<li><span>Nothing equipped</span><span></span></li>'}</ul>
      <h3>Charm sets</h3><ul>${sets || '<li><span>No set bonuses active</span><span></span></li>'}</ul>
      
      ${(() => { const p = PARA && PARA.summary(); return p ? `<h3>Paragon</h3><ul><li><span>Points spent</span><span>${p.points} of ${p.cap}</span></li>${p.boards.map(b => `<li><span>${esc(b.name)}</span><span>${b.glyph ? esc(b.glyph) : 'no glyph'}</span></li>`).join('')}</ul>` : ''; })()}
      <h3>Seal</h3><ul>${sockets().map(x => socketItem(x)).filter(Boolean).map(it => `<li><span>${esc(it.name)}</span><span>charm</span></li>`).join('') || '<li><span>No charms socketed</span><span></span></li>'}</ul>`;
  }

  // ---------- character sheet: every stat line from gear, charms, seal and paragon, summed ----------
  const SHEET_GROUPS = [
    ['Offensive', /damage|critical|attack speed|overpower|vulnerable|lucky hit|weapon|berserk|chance to|multistrike|strike/i],
    ['Defensive', /life|armor|resist|damage reduction|dodge|barrier|fortify|heal|thorns|block|control impair|impairment|evade/i],
    ['Utility', /cooldown|resource|movement|speed|ranks? (to|of)|duration|cost|spirit|fury|mana|essence|energy|faith|vigor|potion|gold|experience/i],
  ];
  const ATTRS = ['Strength', 'Intelligence', 'Willpower', 'Dexterity'];
  const decode = t => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
  // turn one line of text into {key, v}; lines with more or fewer than one number are kept as plain effects
  function parseLine(raw) {
    const txt = decode(strip(raw)).replace(/\s+/g, ' ').trim();
    const nums = txt.match(/\d[\d,]*(\.\d+)?/g) || [];
    if (nums.length !== 1) return { txt };
    const v = parseFloat(nums[0].replace(/,/g, ''));
    const key = txt.replace(nums[0], '§').replace(/^\+\s*/, '').replace(/^§\s*%/, '§%');
    return { key, v, txt };
  }
  let SD_CACHE = null, SB_CACHE = {};
  const invalidate = () => { SD_CACHE = null; SB_CACHE = {}; };
  function sheetData() { return SD_CACHE || (SD_CACHE = sheetDataRaw()); }
  function sheetDataRaw() {
    const stats = new Map(); const effects = []; const powers = [];
    const add = (raw, src) => {
      const p = parseLine(raw); if (!p.txt) return;
      if (p.key == null) { effects.push({ txt: p.txt, src }); return; }
      const e = stats.get(p.key) || { key: p.key, v: 0, mult: /\[x\]|^x\s*§/i.test(p.key), parts: [] };
      e.v = e.mult ? ((1 + e.v / 100) * (1 + p.v / 100) - 1) * 100 : e.v + p.v; e.parts.push({ v: p.v, src }); stats.set(p.key, e);
    };
    SLOTS.forEach(sl => {
      const g = S.gear[sl.id] || {}; const it = findItem(g.item); if (!it) return;
      if (sl.id === 'offhand' && offhandBlock()) return;
      itemLines(it, g, sl.id).forEach(l => add(l.html, sl.name + (l.kind === 'temper' ? ' temper' : l.kind === 'sanct' ? ' transfiguration' : l.kind === 'hor' ? ' Horadric affix' : l.kind === 'gem' ? ' gem' : '')));
      powers.push({ name: it.name, kind: it.kind ? (RARITY_NAME[rarityOf(it, g)] || 'Unique') : 'Aspect', src: sl.name, desc: it.desc });
      const a2 = g.aspect2 && data().aspects.find(a => a.id === g.aspect2);
      if (a2) powers.push({ name: a2.name, kind: 'Prism aspect', src: sl.name, desc: a2.desc });
    });
    sockets().forEach((x, i) => {
      const it = socketItem(x); if (!it) return;
      (it.affixes || []).forEach(h => add(h, it.name)); (it.lines || []).forEach(h => add(h, it.name));
      if (it.desc) powers.push({ name: it.name, kind: 'Unique charm', src: 'Seal socket ' + (i + 1), desc: it.desc });
    });
    (S.charms.sealAff || []).forEach(id => { const a = id && sealAff(id); if (a) add(affHtml(a), 'Seal'); });
    classSets().forEach(st => st.tiers.forEach(t => { if (tierActive(st, t)) powers.push({ name: st.name + ', ' + t.n + '-piece', kind: 'Set bonus', src: 'Charms', desc: t.desc }); }));
    const P = PARA && PARA.stats && PARA.stats();
    if (P) {
      (P.lines || []).forEach(l => add(esc(l.t).replace('§', D4T.fmtNum(Math.round(l.v * 10) / 10)), 'Paragon'));
      ATTRS.forEach(a => { const v = (+(P.base || {})[a] || 0); if (v) add(v + ' ' + a, 'Entered on Paragon'); });
      (P.glyphs || []).forEach(g => powers.push({ name: g.name, kind: 'Glyph, level ' + g.L, src: 'Paragon', desc: g.met ? 'Bonus threshold met.' : 'Bonus threshold not met yet.' }));
    }
    if (P) (P.legend || []).forEach(l => { proseStats(l.desc).forEach(x => add(x, 'Legendary node: ' + l.name)); powers.push({ name: l.name, kind: 'Legendary node', src: 'Paragon', desc: l.desc }); });
    try { const CP = cdata().powers; Object.keys(CP).forEach(id => { const q = CP[id]; if (!q.passive) return; const r = skillRank(id); if (!(r > 0)) return; const html = powerText(q, null, r, CP); proseStats(html).forEach(x => add(x, 'Passive: ' + q.name)); powers.push({ name: q.name, kind: 'Passive', src: 'Skill tree', desc: html }); }); } catch (e) { /* a passive that fails to render adds nothing */ }
    // mercenaries: the hired one's chosen nodes and signature, and the reinforcement's skill
    try { const ML = data().mercs || []; const MS = mercState(); const main = ML.find(m => m.id === MS.main); const sup = ML.find(m => m.id === MS.sup);
      const stM = tcState().st || {};
      const addM = (m, q, role, label) => { if (!q) return; const html = powerText(q, null, 1, m.powers); const t = stM[role] === false ? '' : strip(html);
        let x = t.match(/grants you ([\d.]+)%\s*(?:\[\+\])?\s*Armor/); if (x) add(x[1] + '% Total Armor', label + ': ' + q.name);
        x = t.match(/grants you ([\d.]+)%\s*(?:\[\+\])?\s*Resistance to All Elements/); if (x) add(x[1] + '% Resistance to All Elements', label + ': ' + q.name);
        powers.push({ name: q.name, kind: 'Mercenary', role, merc: m.name, src: m.name + ', ' + label.toLowerCase(), desc: html }); };
      if (main) { (MS.nodes[main.id] || []).forEach(i => { const n = main.nodes[i]; if (n) addM(main, main.powers[n.power], 'mercMain', 'Hired mercenary'); }); if (main.bonus) addM(main, main.powers[main.bonus], 'mercMain', 'Hired mercenary'); }
      if (sup && MS.supSkill) addM(sup, sup.powers[MS.supSkill], 'mercSup', 'Reinforcement');
    } catch (e) { /* a mercenary power that fails to render adds nothing */ }
    mechLines().forEach(m => { proseStats(m.html).forEach(l => add(l, 'Class mechanic: ' + m.name)); powers.push({ name: m.name, kind: 'Class mechanic', src: S.cls, desc: m.html }); });
    EXTRA_LINES.forEach(l => add(l, 'What if'));
    return { stats: [...stats.values()], effects, powers };
  }
  const fmtStat = e => { const n = Math.round(e.v * 10) / 10; return D4T.fmtNum(Number.isInteger(n) ? n : n); };
  const statRow = e => `<details class="srow"><summary><span class="sk">${esc(e.key.replace('§', '').replace(/^\s*%\s*/, '').replace(/\s+/g, ' ').trim())}</span><b class="num">${e.key.includes('%') ? fmtStat(e) + '%' : fmtStat(e)}</b></summary>
    <ul>${e.parts.map(p => `<li><span>${esc(p.src)}</span><span>${D4T.fmtNum(Math.round(p.v * 10) / 10)}${e.key.includes('%') ? '%' : ''}</span></li>`).join('')}</ul></details>`;
  function renderSheet() {
    invalidate();
    const D = sheetData(); const used = new Set();
    const attr = ATTRS.map(a => { const e = D.stats.find(x => x.key === '§ ' + a); if (e) used.add(e); return `<div class="attr"><span>${a}</span><b class="num">${e ? fmtStat(e) : 0}</b></div>`; }).join('');
    const groups = SHEET_GROUPS.map(([name, re]) => [name, D.stats.filter(e => !used.has(e) && re.test(e.key) && (used.add(e), true))]);
    const rest = D.stats.filter(e => !used.has(e));
    if (rest.length) groups.push(['Other', rest]);
    const col = ([name, list]) => `<section class="sheet-col"><h3>${name}</h3>${list.length ? list.sort((a, b) => a.key.localeCompare(b.key)).map(statRow).join('') : '<p class="empty">Nothing yet.</p>'}</section>`;
    const C = cdata(); const skills = unlockedSkills();
    $('#panel-sheet').innerHTML = `<div class="sheet">${sheetChkHtml()}
      <header class="sheet-head"><div class="sheet-crest"><svg viewBox="-2 -2 36 36" aria-hidden="true">${D4ART.crest(S.cls)}</svg></div>
        <div><h2>${esc(S.cls)} character sheet</h2><p>Every number on gear, tempers, transfiguration, charms, the seal and Paragon, added together. Click a stat to see where it comes from.</p></div></header>
      ${skillBarHtml()}
      ${adviceHtml()}
      <div class="attrs">${attr}</div>
      <div class="sheet-ingame">
        <div class="gstats wide">${trackersHtml(statModel())}${checksHtml()}</div>
        <div class="gstats wide">${statSections(statModel(), true)}</div>
      </div>
      <h3 class="sheet-sub">Every stat line</h3>
      <div class="sheet-grid">${groups.map(col).join('')}</div>
      <div class="sheet-grid two">
        <section class="sheet-col"><h3>Powers</h3>${D.powers.length ? D.powers.map(p => `<details class="srow pw"><summary><span class="sk">${esc(p.name)}</span><em>${esc(p.kind)}, ${esc(p.src)}</em></summary><div class="pdesc">${p.desc || ''}</div></details>`).join('') : '<p class="empty">Equip items, charms or glyphs to list their powers.</p>'}</section>
        <section class="sheet-col"><h3>Skills</h3>${skills.length ? `<ul class="sk-list">${skills.map(p => `<li><span>${esc(C.powers[p].name)}</span><span>rank ${skillRank(p)}</span></li>`).join('')}</ul>` : '<p class="empty">No skills taken yet.</p>'}
          ${D.effects.length ? `<h3 class="sub">Other effects</h3><ul class="fx-list">${D.effects.map(f => `<li>${esc(f.txt)} <em>${esc(f.src)}</em></li>`).join('')}</ul>` : ''}</section>
      </div></div>`;
    wireStats('#panel-sheet', renderSheet); wireSkillBar('#panel-sheet', renderSheet); wireAdvice(renderSheet);
  }

  // ---------- in-game style stat list, build trackers and completion checks ----------
  const CLASS_RES = { Paladin: 'Faith', Barbarian: 'Fury', Necromancer: 'Essence', Sorcerer: 'Mana', Druid: 'Spirit', Rogue: 'Energy', Spiritborn: 'Vigor', Warlock: 'Resource' };
  const RES_RE = /^§ Maximum (Faith|Fury|Essence|Mana|Spirit|Energy|Vigor|Resource|Primary Resource)$/;
  const PCT = '%';
  const statDefs = () => [
    { sec: 'Core Stats', id: 'str', l: 'Strength', re: [/^§ Strength$/, /^§ All Stats$/] },
    { sec: 'Core Stats', id: 'int', l: 'Intelligence', re: [/^§ Intelligence$/, /^§ All Stats$/] },
    { sec: 'Core Stats', id: 'wil', l: 'Willpower', re: [/^§ Willpower$/, /^§ All Stats$/] },
    { sec: 'Core Stats', id: 'dex', l: 'Dexterity', re: [/^§ Dexterity$/, /^§ All Stats$/] },
    { sec: 'Armor & Resistances', id: 'armor', l: 'Armor', re: [/^§ Armor$/] },
    { sec: 'Armor & Resistances', id: 'armorp', l: 'Total Armor bonus', u: PCT, re: [/^§% Total Armor$/] },
    { sec: 'Armor & Resistances', id: 'rphys', l: 'Physical Resistance', re: [/^§ Physical Resistance$/] },
    ...['Fire', 'Lightning', 'Cold', 'Poison', 'Shadow'].map(e => ({ sec: 'Armor & Resistances', id: 'r' + e.toLowerCase(), l: e + ' Resistance', re: [new RegExp('^§ ' + e + ' Resistance$'), /^§ Resistance to All Elements$/] })),
    { sec: 'Armor & Resistances', id: 'rallp', l: 'Resistance to All Elements', u: PCT, re: [/^§% Resistance to All Elements$/] },
    { sec: 'Offensive', id: 'as', l: 'Attack Speed Bonus', u: PCT, cap: 100, capSrc: 'game cap on gear and passive attack speed', re: [/^§% Attack Speed$/] },
    { sec: 'Offensive', id: 'cs', l: 'Cast Speed Bonus (second attack speed cap)', u: PCT, cap: 100, capSrc: 'game cap on Cast Speed bonuses, separate from the Attack Speed cap', re: [/^§% Cast Speed$/] },
    { sec: 'Offensive', id: 'csc', l: 'Critical Strike Chance', u: PCT, cap: 100, re: [/^§% Critical Strike Chance$/] },
    { sec: 'Offensive', id: 'csd', l: 'Critical Strike Damage', u: PCT, re: [/Critical Strike Damage( Multiplier)?$/] },
    { sec: 'Offensive', id: 'vuln', l: 'Vulnerable Damage', u: PCT, re: [/Vulnerable Damage( Multiplier)?$/] },
    { sec: 'Offensive', id: 'od', l: 'Overpower Damage', u: PCT, re: [/Overpower Damage/] },
    { sec: 'Offensive', id: 'all', l: 'All Damage', u: PCT, re: [/^§%( \[x\])? (All )?Damage( Multiplier)?$/, /^§%\[x\] All Damage$/] },
    ...['Physical', 'Fire', 'Lightning', 'Cold', 'Holy', 'Poison', 'Shadow'].map(e => ({ sec: 'Offensive', id: 'd' + e.toLowerCase(), l: 'Damage with ' + e, u: PCT, re: [new RegExp('^§%(\\[x\\])? ' + e + ' Damage$'), new RegExp('^§%(\\[x\\])? ' + (e === 'Holy' ? 'Fire and Holy' : e === 'Fire' ? 'Fire and Holy' : '_') + ' Damage$')] })),
    { sec: 'Offensive', id: 'close', l: 'Damage vs Close', u: PCT, re: [/^§% Damage to Close Enemies$/] },
    { sec: 'Offensive', id: 'dist', l: 'Damage vs Distant', u: PCT, re: [/^§% Damage to Distant Enemies$/] },
    { sec: 'Offensive', id: 'elite', l: 'Damage vs Elites', u: PCT, re: [/^§% Damage to Elites$/] },
    { sec: 'Offensive', id: 'ccd', l: 'Damage vs Crowd Controlled', u: PCT, re: [/^§% Damage to Crowd Controlled Enemies$/] },
    { sec: 'Offensive', id: 'healthy', l: 'Damage while Healthy', u: PCT, re: [/^§% Damage while Healthy$/] },
    { sec: 'Offensive', id: 'thorns', l: 'Thorns', re: [/^§ Thorns$/] },
    { sec: 'Offensive', id: 'retri', l: 'Retribution Chance', u: PCT, cap: 100, re: [/Retribution Chance/] },
    { sec: 'Defensive', id: 'life', l: 'Maximum Life', re: [/^§ Maximum Life$/] },
    { sec: 'Defensive', id: 'lifep', l: 'Maximum Life bonus', u: PCT, re: [/^§% Maximum Life$/] },
    { sec: 'Defensive', id: 'potion', l: 'Potion Capacity', re: [/Potion Capacity$/] },
    { sec: 'Defensive', id: 'heal', l: 'Healing Received', u: PCT, re: [/Healing Received$/] },
    { sec: 'Defensive', id: 'regen', l: 'Life Regeneration', re: [/^§ Life Regeneration$/, /^§ Life per 5 Seconds$/] },
    { sec: 'Defensive', id: 'loh', l: 'Life On Hit', re: [/^§ Life On Hit$/] },
    { sec: 'Defensive', id: 'block', l: 'Block Chance', u: PCT, cap: 100, re: [/^§% Block Chance$/] },
    { sec: 'Defensive', id: 'blockr', l: 'Block Reduction', u: PCT, cap: 80, capSrc: 'game cap', re: [/^§% Blocked Damage Reduction$/] },
    { sec: 'Defensive', id: 'dr', l: 'All Damage Reduction', u: PCT, cap: 100, re: [/^§% Damage Reduction$/] },
    { sec: 'Defensive', id: 'fort', l: 'Fortify Bonus', u: PCT, re: [/^§% Fortify Generation$/] },
    { sec: 'Defensive', id: 'barrier', l: 'Barrier Bonus', u: PCT, re: [/^§% Barrier Generation$/] },
    { sec: 'Defensive', id: 'dodge', l: 'Dodge Chance', u: PCT, cap: 100, re: [/^§% Dodge Chance$/] },
    { sec: 'Utility', id: 'res', l: 'Maximum ' + (CLASS_RES[S.cls] || 'Resource'), re: [RES_RE] },
    { sec: 'Utility', id: 'rcr', l: (CLASS_RES[S.cls] || 'Resource') + ' Cost Reduction', u: PCT, re: [/^§% Resource Cost Reduction$/] },
    { sec: 'Utility', id: 'rgen', l: (CLASS_RES[S.cls] || 'Resource') + ' Generation', u: PCT, re: [/^§% Resource Generation$/] },
    { sec: 'Utility', id: 'ms', l: 'Movement Speed', u: PCT, re: [/^§% Movement Speed$/] },
    { sec: 'Utility', id: 'cdr', l: 'Cooldown Reduction', u: PCT, cap: 75, capSrc: 'game cap', re: [/^§% Cooldown Reduction$/] },
    { sec: 'Utility', id: 'lhc', l: 'Lucky Hit Chance Bonus', u: PCT, cap: 100, re: [/^§% Lucky Hit Chance$/] },
    { sec: 'Utility', id: 'ccdur', l: 'Crowd Control Duration', u: PCT, re: [/^§% Crowd Control Duration$/] },
    { sec: 'Utility', id: 'resolve', l: 'Resolve', re: [/Resolve/] },
  ];
  const STAT_SECS = ['Core Stats', 'Armor & Resistances', 'Offensive', 'Defensive', 'Utility'];
  function statModel() {
    const D = sheetData(); const out = {};
    for (const d of statDefs()) {
      const hits = D.stats.filter(e => d.re.some(r => r.test(e.key)));
      let add = 0, mul = 1; const parts = [];
      let sumX = 0; hits.forEach(e => { if (e.mult && /Multiplier$/.test(e.key)) sumX += e.parts.reduce((a, p) => a + p.v, 0); else if (e.mult) mul *= 1 + e.v / 100; else add += e.v; e.parts.forEach(p => parts.push({ v: p.v, src: p.src, mult: e.mult })); }); mul *= 1 + sumX / 100;
      if (d.id === 'cdr') add = (1 - parts.reduce((k, p) => k * (1 - Math.min(100, p.v) / 100), 1)) * 100;
      out[d.id] = Object.assign({}, d, { v: add, x: mul > 1 ? (mul - 1) * 100 : 0, parts });
    }
    return out;
  }
  const fmtV = (v, u) => { const n = Math.round(v * 10) / 10; return D4T.fmtNum(n) + (u || ''); };
  const statVal = s => !s.v && s.x ? `${fmtV(s.x, '%')}[x]` : fmtV(s.v, s.u) + (s.x ? ` <small>and ${fmtV(s.x, '%')}[x]</small>` : '');
  const openSecs = new Set(['Core Stats', 'Offensive']);
  function statSections(M, withCore) {
    return STAT_SECS.filter(sec => withCore || sec !== 'Core Stats').map(sec => {
      const rows = Object.values(M).filter(s => s.sec === sec);
      return `<details class="gsec" data-sec="${esc(sec)}" ${openSecs.has(sec) ? 'open' : ''}><summary>${esc(sec)}</summary>
        ${rows.map(s => `<details class="grow${s.v || s.x ? '' : ' zero'}"><summary><span>${esc(s.l)}</span><b>${statVal(s)}</b></summary>${s.parts.length ? `<ul>${s.parts.map(p => `<li><span>${esc(p.src)}</span><span>${fmtV(p.v, s.u || (p.mult ? '%' : ''))}${p.mult ? '[x]' : ''}</span></li>`).join('')}</ul>` : '<p class="none">Nothing on this build adds to it yet.</p>'}</details>`).join('')}
      </details>`;
    }).join('');
  }
  // tracked stats: five slots the build is built around
  const TRACK_DEFAULT = { Paladin: ['csc', 'cdr', 'block', 'res', 'ms'], Barbarian: ['csc', 'cdr', 'res', 'as', 'ms'], Druid: ['csc', 'cdr', 'res', 'lhc', 'ms'], Necromancer: ['csc', 'cdr', 'res', 'lhc', 'ms'], Rogue: ['csc', 'cdr', 'res', 'lhc', 'ms'], Sorcerer: ['csc', 'cdr', 'res', 'lhc', 'ms'], Spiritborn: ['csc', 'cdr', 'res', 'as', 'ms'], Warlock: ['csc', 'cdr', 'res', 'lhc', 'ms'] };
  function tracks() { if (!Array.isArray(S.track) || S.track.length !== 5) S.track = (TRACK_DEFAULT[S.cls] || TRACK_DEFAULT.Paladin).map(id => ({ id, min: '', max: '' })); return S.track; }
  let trackEdit = false;
  function trackState(t, s) {
    const v = s ? s.v : 0; const cap = t.max !== '' && t.max != null ? +t.max : s && s.cap; const min = t.min !== '' && t.min != null ? +t.min : null;
    if (cap != null && v > cap) return ['over', `Over the cap by ${fmtV(v - cap, s.u)}`];
    if (cap != null && v >= cap) return ['capped', 'Capped'];
    if (min != null && v >= min) return ['met', 'Target met'];
    if (min != null) return ['short', `${fmtV(min - v, s.u)} to target`];
    return ['track', cap != null ? `${fmtV(cap - v, s.u)} to cap` : 'Tracking'];
  }
  function trackersHtml(M) {
    const defs = Object.values(M);
    const card = (t, i) => { const s = M[t.id]; if (!s) return `<div class="trk empty"><span>Slot ${i + 1}</span><b>Not set</b></div>`;
      const [st, msg] = trackState(t, s); const cap = t.max !== '' && t.max != null ? +t.max : s.cap; const goal = t.min !== '' && t.min != null ? +t.min : cap;
      const pct = goal ? Math.max(0, Math.min(100, s.v / goal * 100)) : 0;
      return `<div class="trk ${st}"><span class="trk-l">${esc(s.l)}</span><b class="trk-v">${fmtV(s.v, s.u)}</b>
        <span class="trk-bar"><i style="width:${pct}%"></i></span><span class="trk-s">${st === 'capped' || st === 'met' ? '<i class="ok" aria-hidden="true"></i>' : ''}${esc(msg)}</span></div>`; };
    const editor = trackEdit ? `<div class="trk-edit">${tracks().map((t, i) => `<div class="trk-erow"><select data-tk="${i}" aria-label="Tracked stat ${i + 1}"><option value="">None</option>${STAT_SECS.map(sec => `<optgroup label="${esc(sec)}">${defs.filter(d => d.sec === sec).map(d => `<option value="${d.id}" ${d.id === t.id ? 'selected' : ''}>${esc(d.l)}</option>`).join('')}</optgroup>`).join('')}</select>
      <input type="number" data-tmin="${i}" value="${esc(t.min ?? '')}" placeholder="Goal" aria-label="Goal for stat ${i + 1}"><input type="number" data-tmax="${i}" value="${esc(t.max !== '' && t.max != null ? t.max : (M[t.id] && M[t.id].cap != null ? M[t.id].cap : ''))}" placeholder="Cap" title="${M[t.id] && M[t.id].cap != null && (t.max === '' || t.max == null) ? 'Filled from the game: ' + esc(M[t.id].capSrc || 'chances top out at 100%') : ''}" class="${M[t.id] && M[t.id].cap != null && (t.max === '' || t.max == null) ? 'gamecap' : ''}" aria-label="Cap for stat ${i + 1}"></div>`).join('')}
      <p class="note">Goal lights the stat green once you reach it. Cap lights it gold, and warns if gear pushes past it. Caps the game sets are filled in for you (gold text): 75% cooldown reduction, 100% attack speed from gear and passives, 80% block reduction, and 100% for chance stats. Type your own number to override, or clear it to go back to the game's cap.</p></div>` : '';
    return `<section class="trackers"><header><h3>Build focus</h3><button class="btn ghost small" id="trkEdit" aria-pressed="${trackEdit}">${trackEdit ? 'Done' : 'Choose stats'}</button></header>
      <div class="trk-list">${tracks().map(card).join('')}</div>${editor}</section>`;
  }
  function checksHtml() {
    const live = SLOTS.filter(sl => !(sl.id === 'offhand' && offhandBlock()));
    const eq = live.map(sl => ({ sl, g: S.gear[sl.id] || {}, it: findItem((S.gear[sl.id] || {}).item) })).filter(x => x.it);
    const sockN = eq.reduce((a, x) => a + socketMax(x.sl.id, x.it, x.g), 0); const sockF = eq.reduce((a, x) => a + ((x.g.gems || []).slice(0, socketMax(x.sl.id, x.it, x.g)).filter(Boolean).length), 0);
    const C = [
      ['All slots filled', eq.length, live.length],
      ['Quality 25 on every item', eq.filter(x => +x.g.q >= Q_MAX).length, eq.length || SLOTS.length],
      ['Every item tempered', eq.filter(x => (x.g.tempers || []).some(Boolean)).length, eq.length || SLOTS.length],
      ['Every socket has a gem', sockF, sockN],
      ['Charm sockets filled', sockets().filter(Boolean).length, sockets().length],
    ];
    return `<section class="checks"><h3>Build checks</h3>${C.map(([l, a, b]) => `<div class="chk${b && a >= b ? ' done' : ''}"><i aria-hidden="true"></i><span>${esc(l)}</span><b>${a}/${b}</b></div>`).join('')}</section>`;
  }
  function statColumnHtml() {
    const M = statModel();
    const attr = ['str', 'int', 'wil', 'dex'].map(k => `<div class="gattr"><span>${esc(M[k].l)}</span><b>${fmtV(M[k].v)}</b></div>`).join('');
    return `<aside class="gstats">
      <div class="gs-head"><b>${esc(S.name || 'Untitled build')}</b><span>${esc(S.cls)}</span></div>
      ${trackersHtml(M)}
      <div class="gattrs">${attr}</div>
      ${statSections(M, false)}
      ${checksHtml()}
    </aside>`;
  }
  function wireStats(root, rerender) {
    $$(root + ' .gsec').forEach(d => d.ontoggle = () => { if (d.open) openSecs.add(d.dataset.sec); else openSecs.delete(d.dataset.sec); });
    const te = $(root + ' #trkEdit'); if (te) te.onclick = () => { trackEdit = !trackEdit; rerender(); };
    $$(root + ' [data-tk]').forEach(x => x.onchange = () => { tracks()[+x.dataset.tk] = { id: x.value, min: '', max: '' }; commit(); rerender(); });
    $$(root + ' [data-tmin]').forEach(x => x.onchange = () => { tracks()[+x.dataset.tmin].min = x.value; commit(); rerender(); });
    $$(root + ' [data-tmax]').forEach(x => x.onchange = () => { tracks()[+x.dataset.tmax].max = x.value; commit(); rerender(); });
  }

  // ---------- theorycraft: single-target min, expected and max damage, read live from the build ----------
  // Uses game constants: hits vary by 10% either way, crits add 50% before bonuses, vulnerable adds 20%, attack speed bonus caps at 100%.
  const TC_COND = [
    ['close', 'Enemy is close', /^§% Damage to Close Enemies$/], ['dist', 'Enemy is distant', /^§% Damage to Distant Enemies$/],
    ['cc', 'Enemy is crowd controlled', /^§% Damage to Crowd Controlled Enemies$/], ['healthy', 'You are healthy', /^§% Damage while Healthy$/],
    ['barrier', 'You have a barrier', /^§% Damage while You Have a Barrier$/], ['fort', 'You are fortified', /Damage while Fortified$/],
    ['injured', 'Enemy is injured', /Damage to Injured Enemies$/], ['slowed', 'Enemy is slowed', /Damage to Slowed Enemies$/],
  ];
  function tcState() { const d = { skill: '', pay: '', wd: '', ws: 1, base: 0, vuln: 50, cond: {}, off: {}, st: { crit: true, vuln: true } }; if (!S.tc || typeof S.tc !== 'object') S.tc = d; else for (const k in d) if (S.tc[k] == null) S.tc[k] = d[k]; return S.tc; }
  // status toggles across the top of Damage Theory Craft. Vulnerable (+20%) and Berserking (+25%) come from the game's keyword text.
  const TC_STATES = [['crit', 'Critical strike'], ['vuln', 'Vulnerable'], ['op', 'Overpower'], ['berserk', 'Berserking'], ['cc', 'Crowd controlled'], ['close', 'Close'], ['dist', 'Distant'], ['injured', 'Injured enemy'], ['slowed', 'Slowed enemy'], ['healthy', 'You are healthy'], ['fort', 'You are fortified'], ['barrier', 'You have a barrier']];
  function payloadList(skill) {
    const sk = skillCtx(skill); const P = sk.P; const order = []; const re = /\{payload:([A-Z0-9_]+)\}/g; let m;
    const scan = t => { re.lastIndex = 0; while ((m = re.exec(t || ''))) if (!order.includes(m[1])) order.push(m[1]); };
    scan(P.desc); P.mods.filter(md => sk.mods.has(md.key)).forEach(md => scan(md.desc));
    Object.keys(P.payloads).forEach(k => { if (!order.includes(k)) order.push(k); });
    return order.map((k, i) => ({ k, v: (sk.ev(P.payloads[k]) || 0) * 100, inTip: i < order.length })).filter(x => x.v > 0);
  }
  // [x] powers on equipped aspects, uniques and charms: "[20 – 60]%[x]" gives a low and high roll
  function gearMultipliers() {
    const out = [];
    const scan = (name, html, role) => {
      const t = strip(String(html || '')).replace(/\s+/g, ' ');
      const re = /\[?([\d.]+)(?:\s*[–-]\s*([\d.]+))?\]?%\s*\[x\]([^.]{0,90})/g; let m; let i = 0;
      while ((m = re.exec(t))) { const lo = +m[1], hi = +(m[2] || m[1]); const what = m[3].trim().replace(/^(increased |bonus )/, ''); const id = name + '#' + (i++); if (!/damage/i.test(what)) continue; out.push({ id, n: name, lo, hi, what, role }); }
    };
    SLOTS.forEach(sl => { const g = S.gear[sl.id] || {}; const it = findItem(g.item); if (it) scan(it.name, it.desc); const a2 = g.aspect2 && data().aspects.find(a => a.id === g.aspect2); if (a2) scan(a2.name, a2.desc); });
    sockets().forEach(x => { const it = socketItem(x); if (it && it.desc) scan(it.name, it.desc); });
    const n0 = out.length; mechLines().forEach(m => scan(m.name, m.html));
    sheetData().powers.filter(q => /^(Passive|Legendary node|Set bonus|Mercenary)$/.test(q.kind)).forEach(q => scan(q.merc ? q.name + ' (' + q.merc + ')' : q.name, q.desc, q.role));
    return out.filter((x, i) => i < n0 || (x.lo > 0 && !/^(Vulnerable|Critical Strike|Overpower) Damage|^Damage Over Time|^Lucky Hit/i.test(x.what)));
  }
  // every Attack Speed (first cap) and Cast Speed (second cap) bonus written into a power's text, so nothing has to be typed in
  const SPEED_COND = /\b(per|while|when|whenever|after|if|against|stacks?|until|each|every|seconds?)\b/i;
  function speedSources(sk) {
    const out = []; const P = sk.P; const C = cdata();
    const scan = (name, html, prose, role) => {
      decode(strip(String(html || '').replace(/<br\s*\/?>/g, '. '))).replace(/\s+/g, ' ').split(/(?<=[.!])\s*(?=[A-Z])/).forEach((t, si) => {
        if (!/(Attack|Cast) Speed/.test(t) || /Summons?|Minions?|Mercenar|Companions?|enemies'|enemy's|Slow/.test(t.replace(/Lucky Hit[^.]*/, ''))) return;
        if (role && !/\b[Yy]ou(r)?\b/.test(t)) return;   // the mercenary's own speed is not yours
        if (prose && !SPEED_COND.test(t)) return;   // already counted on the character sheet as an always-on stat
        const num = '\\[?([\\d.]+)(?:\\s*[–-]\\s*([\\d.]+))?\\]?%'; let m = t.match(new RegExp(num + '[^%]{0,40}?(Attack|Cast) Speed')); let kind, lo, hi;
        if (m) { lo = +m[1]; hi = +(m[2] || m[1]); kind = m[3]; } else { m = t.match(new RegExp('(Attack|Cast) Speed[^%]{0,40}?' + num)); if (!m) return; kind = m[1]; lo = +m[2]; hi = +(m[3] || m[2]); }
        const up = t.match(new RegExp('up to ' + num)); const times = t.match(/up to (?:a maximum of )?(\d+) times|stacking up to (\d+)/);
        if (up) { lo = +up[1]; hi = +(up[2] || up[1]); } else if (times) { const n = +(times[1] || times[2]); lo *= n; hi *= n; }
        // a bonus that names a skill or a kind of skill only counts for that skill
        const subj = (t.match(/^([A-Z][A-Za-z' ]+?) (?:Skills? )?(?:gains?|has|have)\b/) || t.match(/with ([A-Z][A-Za-z' ]+?), increase its/) || t.match(/^(?:Increase )?([A-Z][A-Za-z' ]+?)'s (?:Attack|Cast) Speed/) || [])[1];
        if (subj && !/^(You|Your|Spending|Killing|Damaging|Critical)/.test(subj)) { const w = subj.replace(/ Skills?$/, ''); if (w !== P.name && !skillIs(P, w)) return; }
        if (!(hi > 0)) return; out.push({ id: 'spd:' + name + '#' + si, n: name, kind: kind === 'Cast' ? 'cs' : 'as', lo, hi, role, what: t.length > 110 ? t.slice(0, 107) + '...' : t });
      });
    };
    sheetData().powers.forEach(q => scan(q.merc ? q.name + ' (' + q.merc + ')' : q.name, q.desc, /^(Passive|Legendary node|Class mechanic)$/.test(q.kind), q.role));
    (P.mods || []).filter(md => sk.mods.has(md.key)).forEach(md => { try { scan(P.name + ': ' + md.name, powerText(P, md.desc, sk.lvl, C.powers)); } catch (e) { /* skip */ } });
    try { const fa = 'Paladin_Offensive_Aura'; if (S.cls === 'Paladin' && C.powers[fa] && skillRank(fa) > 0) { const fc = skillCtx(fa); const v = (fc.ev(C.powers[fa].sf[6]) || 0) * (fc.ev(C.powers[fa].sf[8]) || 0) * 100; if (v > 0) out.push({ id: 'spd:fanaticism', n: 'Fanaticism Aura', kind: 'as', lo: v, hi: v, what: 'Passive, at full stacks from spending Faith' }); } } catch (e) { /* skip */ }
    return out;
  }
  // is this damage line damage over time, and for how long? Read from the sentence around the payload in the skill text.
  function dotInfo(sk, key) {
    const P = sk.P; const texts = [P.desc].concat((P.mods || []).filter(md => sk.mods.has(md.key)).map(md => md.desc));
    const byName = [[/BLEED/, 'Bleeding'], [/BURN/, 'Burning'], [/POISON/, 'Poisoning'], [/CORRUPT|SHADOW_DOT/, 'Corrupting'], [/FROSTBITE/, 'Frostbite'], [/SPARK/, 'Sparking'], [/(^|_)DOT(_|$)/, 'Damage over time']].find(([re]) => re.test(key));
    if (byName) { let dur = 0; for (const t of texts) { const m = (t || '').match(/damage over \{c_number\}\[?\{?(SF_\d+|[\d.]+)\}?[^}]*?\{\/c\} seconds/i); if (m) { dur = /^SF_/.test(m[1]) ? +sk.ev(m[1]) || 0 : +m[1]; break; } } return { kind: byName[1], dur }; }
    for (const t of texts) { const i = (t || '').indexOf('{payload:' + key + '}'); if (i < 0) continue; const tail = t.slice(i, i + 260).split(/\.\s|\r|\n| and | then /)[0];
      const kind = (tail.match(/(Bleeding|Burning|Poisoning|Corrupting|Frostbite|Sparking)/) || [])[1]; if (!kind && !/damage over|over \{c_number\}/i.test(tail)) continue;
      let dur = 0; const m = tail.match(/over \{c_number\}\[?\{?(SF_\d+|[\d.]+)\}?[^}]*?\{\/c\} seconds/); if (m) dur = /^SF_/.test(m[1]) ? +sk.ev(m[1]) || 0 : +m[1];
      return { kind: kind || 'Damage over time', dur }; }
    return null;
  }
  // Attack speed steps: [frames, attacks per second needed, ...] per skill, measured by Maxroll (Paladin so far)
  const AS_FRAMES = (t => { const o = {}; for (const k in t) o[k] = t[k].split(',').flatMap(x => x.split(':').map(Number)); return o; })({
    Advance: '52:0.9,51:0.9117,50:0.9342,49:0.9495,48:0.9675,47:0.9855,46:1.008,45:1.0305,44:1.0575,43.5:1.08,43:1.0845,42:1.107,41.5:1.134,41:1.1385,40:1.1655,39.5:1.1925,39:1.197,38.5:1.224,38:1.2285,37.5:1.2555,37:1.26,36:1.296,35:1.3365,34:1.377,33.5:1.413,33:1.422,32.5:1.458,32:1.467,31.5:1.5075,31:1.512,30.5:1.5615,30:1.566,29.5:1.6155,29:1.6245,28.5:1.6695,28:1.6785,27.5:1.7415,27:1.746,26.5:1.8117,26:1.818,25.5:1.89,25:1.896,24.5:1.956,24:1.98,23:2.052,22.5:2.1483,22:2.1538,21.5:2.2616,21:2.2682,20.5:2.382,20:2.394,19.5:2.496,19:2.514',
    Brandish: '54:0.9,53:0.9117,52.5:0.9288,52:0.9342,51.5:0.945,51:0.9567,50.5:0.9621,50:0.9675,49.5:0.981,49:0.9981,48.5:1.0071,48:1.0125,47.5:1.0296,47:1.035,46:1.0521,45.5:1.0746,45:1.08,44.5:1.1025,44:1.107,43:1.1295,42.5:1.1565,42:1.1637,41.5:1.1835,41:1.188,40.5:1.2105,40:1.215,39.5:1.242,39:1.2465,38.5:1.278,38:1.287,37.5:1.3095,37:1.3185,36.5:1.35,36:1.3545,35.5:1.386,35:1.3995,34.5:1.4265,34:1.44,33.5:1.4715,33:1.4805,32.5:1.5165,32:1.5255,31.5:1.566,31:1.584,30.5:1.62,30:1.6335,29.5:1.6785,29:1.6875,28.5:1.737,28:1.7595,27.5:1.8045,27:1.8225,26.5:1.872,26:1.89,25.5:1.9485,25:1.985,24.5:2.058,24:2.064,23:2.148,22.5:2.244,22:2.2616,21.5:2.3463,21:2.3639,20.5:2.46,20:2.502,19.5:2.628,19:2.634',
    'Divine Lance': '56:0.9,55:0.9225,54:0.9342,53:0.9495,52.5:0.9675,52:0.972,51:0.99,50:1.008,49:1.0305,48:1.0485,47:1.0755,46.5:1.098,46:1.1025,45:1.1205,44.5:1.1475,44:1.152,43.5:1.1745,43:1.179,42.5:1.2015,42:1.206,41.5:1.2285,41:1.233,40.5:1.2645,40:1.269,39.5:1.296,39:1.3005,38.5:1.332,38:1.3365,37.5:1.3635,37:1.3725,36.5:1.404,36:1.4085,35.5:1.449,35:1.4535,34.5:1.4895,34:1.4985,33:1.539,32:1.593,31.5:1.638,31:1.6515,30.5:1.6965,30:1.701,29.5:1.764,29:1.7685,28:1.818,27:1.8945,26:1.98,25:2.0457,24:2.148,23:2.226,22:2.3397,21:2.4662,20:2.574,19:2.73',
  });
  function theory() {
    const T = tcState(); const C = cdata(); const skills = unlockedSkills().filter(id => !C.powers[id].passive);
    if (!T.skill || !skills.includes(T.skill)) T.skill = skills[0] || '';
    if (!T.skill) return null;
    const sk = skillCtx(T.skill); const P = sk.P; const SB = sk.SB; const M = statModel(); const D = sheetData();
    // mercenary buffs can be switched off as a group from the status row: hired mercenary and reinforcement
    const stM = T.st || {}; const mercOn = role => !role || stM[role] !== false; const mercP = D.powers.filter(q => q.kind === 'Mercenary');
    const mercInfo = ['mercMain', 'mercSup'].map(role => { const l = mercP.filter(q => q.role === role); return l.length ? { role, name: l[0].merc, n: l.length, on: mercOn(role) } : null; }).filter(Boolean);
    let mCsd = 1, mCc = 0, mDot = 1; mercP.filter(q => mercOn(q.role)).forEach(q => { const t = strip(q.desc); let x = t.match(/([\d.]+)%\s*\[x\] increased Critical Strike Damage/); if (x) mCsd *= 1 + x[1] / 100; x = t.match(/([\d.]+)%\s*\[\+\] Critical Strike Chance/); if (x) mCc += +x[1]; x = t.match(/([\d.]+)%\s*\[x\] increased Damage Over Time/); if (x) mDot *= 1 + x[1] / 100; });
    const pays = payloadList(T.skill); const pay = pays.find(x => x.k === T.pay) || (/Attack Speed further increases this damage/.test(sk.P.desc || '') && pays.find(x => /PULS/i.test(x.k))) || pays.slice().sort((a, b) => b.v - a.v)[0];
    // Dawnfire turns Holy Light Aura's passive into a fire pulse every second, a flat share of weapon damage that grows with each kill
    let dawn = null; { const dw = SLOTS.map(sl => findItem((S.gear[sl.id] || {}).item)).find(it => it && it.name === 'Dawnfire');
      if (dw && P.id === 'Paladin_HolyShock_Aura') { const tx = strip(dw.desc); const r = tx.match(/\[([\d,]+)\s*[–-]\s*([\d,]+)\]/); const per = tx.match(/by ([\d.]+)%\s*\[x\]/); const mx = tx.match(/up to (\d+) times/);
        if (r) { const num = x => +x.replace(/,/g, ''); dawn = { lo: num(r[1]) / 2000, hi: num(r[2]) / 2000, per: per ? +per[1] : 0, max: mx ? +mx[1] : 0 }; dawn.stacks = Math.max(0, Math.min(dawn.max, T.dawn !== '' && T.dawn != null ? +T.dawn || 0 : dawn.max)); pays.unshift({ k: 'DAWNFIRE', v: (dawn.lo + dawn.hi) / 2 * 1.2 * 100, dawn: 1 }); } } }
    const pay0 = pay; const payD = dawn && (T.pay === 'DAWNFIRE' || !pays.some(x => x.k === T.pay)) ? pays[0] : pay0; const isDawn = !!(payD && payD.dawn);
    const Pd = isDawn ? Object.assign({}, P, { dmg: 'Fire' }) : P;
    const skillPct = payD ? payD.v : 0; const dot = payD && !isDawn ? dotInfo(sk, payD.k) : null;
    const [msName, msScal] = MAINSTAT[S.cls]; const msKey = { Strength: 'str', Intelligence: 'int', Willpower: 'wil', Dexterity: 'dex' }[msName];
    const msTotal = (M[msKey] ? M[msKey].v : 0) + (+T.base || 0); const msMult = 1 + msTotal * msScal;
    // additive pool
    const always = [], cond = {}, elite = [];
    for (const e of D.stats) {
      if (e.mult) continue;
      const c = TC_COND.find(([, , re]) => re.test(e.key)); if (c) { (cond[c[0]] = cond[c[0]] || []).push(...e.parts.map(pt => ({ v: pt.v, src: pt.src, what: c[1] }))); continue; }
      if (/^§% Damage to Elites$/.test(e.key)) { elite.push(...e.parts.map(pt => ({ v: pt.v, src: pt.src, what: 'Damage vs Elites' }))); continue; }
      const m = e.key.match(/^§% (.*?)\s*Damage$/); if (!m) continue; const pre = m[1].trim();
      let ok = pre === '' || pre === 'All' || (Pd.dmg && (pre === Pd.dmg || (pre === 'Fire and Holy' && /Fire|Holy/.test(Pd.dmg)))) || pre === P.name || skillIs(P, pre.replace(/ Skills?$/, ''));
      if (/Critical|Vulnerable|Overpower|Thorns|Per |Bleed|Burn|Poison(ing)? Damage over/.test(pre)) ok = false;
      if (ok) always.push(...e.parts.map(pt => ({ v: pt.v, src: pt.src, what: (pre || 'All') + ' damage' })));
    }
    const sum = l => l.reduce((a, x) => a + x.v, 0);
    const condOn = Object.keys(cond).filter(k => T.cond[k]);
    const addAlways = sum(always), addCondAll = Object.values(cond).reduce((a, l) => a + sum(l), 0), addCondOn = condOn.reduce((a, k) => a + sum(cond[k]), 0), addElite = sum(elite);
    // [x] multipliers: stat lines marked [x] that fit this skill, plus aspect and unique powers
    // "x% ... Damage Multiplier" affixes of one kind add together first (All Damage joins the element); "[x]" lines each multiply on their own
    const xStat = []; let xSumEl = 0; const xSumBy = {}; let xOwn = 1;
    for (const e of D.stats) { if (!e.mult) continue; const m = e.key.match(/^§%\s*\[x\]\s*(.*?)\s*Damage$|^x?§% (.*?)\s*Damage(?: Multiplier)?$/); if (!m) continue; const pre = (m[1] || m[2] || '').trim();
      if (/Critical|Vulnerable/.test(pre)) continue;
      const el = pre === '' || pre === 'All' || (Pd.dmg && (pre === Pd.dmg || (pre === 'Fire and Holy' && /Fire|Holy/.test(Pd.dmg))));
      const ok = el || skillIs(P, pre.replace(/ Skills?$/, '')); if (!ok) continue; const summed = /Multiplier$/.test(e.key);
      e.parts.forEach(pt => { xStat.push({ v: pt.v, src: pt.src, what: (pre || 'All') + ' damage [x]' + (summed ? ', summed' : '') }); if (summed && el) xSumEl += pt.v; else if (summed) xSumBy[pre] = (xSumBy[pre] || 0) + pt.v; else xOwn *= 1 + pt.v / 100; }); }
    // damage over time: its own [+] stat joins the pool, its "Multiplier" affixes add together, and it cannot crit or roll high or low
    let dotAdd = 0, dotSum = 0, dotOwn = 1; if (dot) for (const e of D.stats) { if (!/Damage [Oo]ver Time( Multiplier)?$/.test(e.key) && !new RegExp('^\\+?§%( \\[x\\])? ' + dot.kind + ' Damage$').test(e.key)) continue; const v = e.parts.reduce((a, x) => a + x.v, 0); if (!e.mult) dotAdd += v; else if (/Multiplier$/.test(e.key)) dotSum += v; else dotOwn *= 1 + e.v / 100; }
    const dotX = (1 + dotSum / 100) * dotOwn * (dot ? mDot : 1);
    const xGear = gearMultipliers().map(x => Object.assign(x, { on: !T.off[x.id] && mercOn(x.role) }));
    const prod = (l, f) => l.reduce((a, x) => a * (1 + f(x) / 100), 1);
    const xS = (1 + xSumEl / 100) * Object.values(xSumBy).reduce((a, v) => a * (1 + v / 100), 1) * xOwn;
    const xLo = xS * prod(xGear.filter(x => x.on), x => x.lo), xHi = xS * prod(xGear.filter(x => x.on), x => x.hi), xMid = xS * prod(xGear.filter(x => x.on), x => (x.lo + x.hi) / 2);
    // crit and vulnerable
    // [+] Critical Strike and Vulnerable Damage join the additive pool on hits that qualify; the built-in x1.5 and x1.2 are their own multipliers
    const cc = Math.min(100, (M.csc ? M.csc.v : 0) + SB.csc + mCc); const csdAdd = (M.csd ? M.csd.v : 0) + SB.csd; const csdX = M.csd ? M.csd.x : 0;
    const critMult = 1.5 * (1 + csdX / 100) * mCsd;
    const vulnAdd = M.vuln ? M.vuln.v : 0; const vulnX = M.vuln ? M.vuln.x : 0; const vulnMult = 1.2 * (1 + vulnX / 100);
    const monDR = 1 - ((data().scaling && (data().scaling.levels.find(l => l.l === MON_LEVEL) || {}).dr) || 0);
    const vu = Math.max(0, Math.min(100, +T.vuln || 0)) / 100;
    const wd = +T.wd || 0;
    // attack speed: two separate caps of 100%. "Attack Speed" sources fill the first, "Cast Speed" sources fill the second.
    const spd = speedSources(sk).map(x => Object.assign(x, { on: !T.off[x.id] && mercOn(x.role) })); const spdSum = k => spd.filter(x => x.kind === k && x.on).reduce((a, x) => a + (x.lo + x.hi) / 2, 0);
    const as1 = Math.max(0, Math.min(100, (SB.as || 0) + spdSum('as'))); const as2 = Math.max(0, Math.min(100, (SB.cs || 0) + spdSum('cs'))); const asTotal = as1 + as2;
    const aps = (+T.ws || 0) * (1 + asTotal / 100);
    // skills only speed up at set animation lengths (frames at 60 a second); between two steps extra attack speed does nothing
    const bp = AS_FRAMES[P.name]; let frames = 0, nextAps = 0; if (bp && aps > 0) { for (let i = 0; i < bp.length; i += 2) { if (bp[i + 1] <= aps + 1e-9) frames = bp[i]; else { nextAps = bp[i + 1]; break; } } if (!frames) frames = bp[0]; }
    // passive pulses such as Holy Light Aura tick on a fixed timer and gain damage from attack speed instead of hitting faster
    const pulse = /Attack Speed further increases this damage/.test(P.desc || '') && !(payD && /ACTIVE|EXPLOSION/i.test(payD.k || '')); let pulseEvery = 0;
    if (pulse) { const m = (P.desc || '').match(/every \{c_number\}\{SF_(\d+)\}\{\/c\} seconds/); pulseEvery = isDawn ? 1 : m && +P.sf[+m[1]] > 0 ? +P.sf[+m[1]] : 1; }
    const asDmg = pulse ? 1 + asTotal / 100 : 1;
    const hps = pulse ? 1 / pulseEvery : frames ? 60 / frames : aps;
    const dawnX = isDawn ? 1 + dawn.per * dawn.stacks / 100 : 1;
    const base = wd * skillPct / 100 * msMult * monDR * asDmg * dawnX * (dot ? dotX : 1);
    const seg = eliteOn => {
      const A0 = addAlways + (eliteOn ? addElite : 0) + (dot ? dotAdd : 0); const p = dot ? 0 : cc / 100; const cm = dot ? 1 : critMult; const roll = dot || isDawn ? 0 : 0.1;
      const min = base * (1 - roll) * (isDawn ? dawn.lo / ((dawn.lo + dawn.hi) / 2) : 1) * (1 + A0 / 100) * xLo;
      const hit = (c, v) => (1 + (A0 + addCondOn + (c ? csdAdd : 0) + (v ? vulnAdd : 0)) / 100) * (c ? cm : 1) * (v ? vulnMult : 1);
      const exp = base * xMid * ((1 - p) * (1 - vu) * hit(0, 0) + p * (1 - vu) * hit(1, 0) + (1 - p) * vu * hit(0, 1) + p * vu * hit(1, 1));
      const max = base * (1 + roll) * (isDawn ? dawn.hi / ((dawn.lo + dawn.hi) / 2) : 1) * (1 + (A0 + addCondAll + (dot ? 0 : csdAdd) + vulnAdd) / 100) * xHi * cm * vulnMult;
      return { min, exp, max };
    };
    // one exact hit with the states ticked across the top, against the same hit with none of them
    const st = T.st || {}; const opAdd = M.od ? M.od.v : 0; const opX = M.od ? M.od.x : 0;
    // Lord of Hatred Overpower: stacks of 15% additive damage, 4 as standard and more from powers such as the Tidal aspect. Overpower Damage raises the per-stack amount.
    const opStacks = st.op ? Math.max(1, Math.min(12, +st.opStacks || 4)) : 0; const opPer = 15 * (1 + opAdd / 100);
    const condSt = Object.keys(cond).filter(k => st[k]).reduce((a, k) => a + sum(cond[k]), 0) + (st.berserk ? 25 : 0) + opStacks * opPer + (st.crit && !dot ? csdAdd : 0) + (st.vuln ? vulnAdd : 0) + (dot ? dotAdd : 0);
    const stateHit = eliteOn => base * (1 + (addAlways + condSt + (eliteOn ? addElite : 0)) / 100) * xMid * (st.crit && !dot ? critMult : 1) * (st.vuln ? vulnMult : 1) * (opStacks ? 1 + opX / 100 : 1);
    const plainHit = eliteOn => base * (1 + (addAlways + (dot ? dotAdd : 0) + (eliteOn ? addElite : 0)) / 100) * xMid;
    const segs = [['Normal and magic monsters', seg(false), stateHit(false), plainHit(false)], ['Rare, champion and elite monsters', seg(true), stateHit(true), plainHit(true)], ['Bosses', seg(true), stateHit(true), plainHit(true)]];
    const luck = gearLuckyEffects().map(f => { const p = Math.min(1, sk.lhEff() / 100 * f.v / 100); return { n: f.n.replace(' (from your gear)', ''), v: f.v, p, perSec: p * hps }; });
    return { mercInfo, spd, dawn, isDawn, dawnX, dot, dotAdd, dotX, payD, as1, as2, asTotal, aps, frames, nextAps, pulse, pulseEvery, asDmg, monDR, st, opAdd, opStacks, opPer, condSt, xS, T, sk, P, SB, pays, pay, skillPct, msName, msTotal, msMult, always, cond, condOn, elite, addAlways, addElite, xStat, xGear, xLo, xMid, xHi, cc, csdAdd, csdX, critMult, vulnAdd, vulnX, vulnMult, wd, hps, base, segs, luck, skills };
  }
  function renderTheory() {
    invalidate();
    const R = theory(); const box = $('#panel-theory'); const f = (v, d) => D4T.fmtNum(Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0));
    if (!R) { box.innerHTML = '<div class="tc"><div class="tc-empty"><h2>Damage Theory Craft</h2><p>Put a point into a damage skill on the Skill tree, then come back. Every number here is read live from your skills, gear, gems, charms and Paragon.</p></div></div>'; return; }
    const T = R.T; const C = cdata();
    const row = (l, v, sub) => `<div class="tc-row"><span>${l}</span><b class="num">${v}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
    const list = (arr, unit) => arr.length ? `<ul class="tc-src">${arr.map(x => `<li><span>${esc(x.src)} <em>${esc(x.what || '')}</em></span><b>${f(x.v, 1)}${unit || '%'}</b></li>`).join('')}</ul>` : '<p class="note">Nothing on this build adds to it yet.</p>';
    box.innerHTML = `<div class="tc">
      <header class="tc-head"><div><h2>Damage Theory Craft</h2><p>One skill hitting one monster. Min uses the low roll of every ticked power, the lowest damage roll, no crit, no vulnerable and no conditions. Max uses top rolls, a vulnerable crit and every condition. Expected uses your crit chance, your vulnerable uptime and the conditions you tick. Area damage is left out on purpose: judge it from the skill's size and how many enemies you expect to hit.</p></div></header>
      <section class="tc-states" aria-label="Status on the hit">
        <h3>Status on the hit</h3>
        <div class="chips">${TC_STATES.map(([k, l]) => { const extra = k === 'crit' ? `x${f(R.critMult, 2)}` : k === 'vuln' ? `x${f(R.vulnMult, 2)}` : k === 'op' ? `+${f(R.opPer, 1)}% a stack` : k === 'berserk' ? '+25%' : R.cond[k] ? `+${f(R.cond[k].reduce((a, x) => a + x.v, 0), 1)}%` : '';
          const none = !extra && k !== 'op';
          return `<label class="chip${R.st[k] ? ' on' : ''}${none ? ' none' : ''}" title="${none ? 'Nothing on this build adds damage for this yet' : ''}"><input type="checkbox" data-st="${k}" ${R.st[k] ? 'checked' : ''}><span>${esc(l)}</span>${extra ? `<small>${extra}</small>` : ''}</label>${k === 'op' && R.st.op ? `<label class="chip stacks"><span>Stacks</span><input type="number" min="1" max="8" id="opStacks" value="${R.opStacks}" aria-label="Overpower stacks"></label>` : ''}`; }).join('')}${R.mercInfo.map(m => `<label class="chip merc${m.on ? ' on' : ''}" title="Every damage, crit and speed buff ${esc(m.name)} gives you, on or off together"><input type="checkbox" data-st="${m.role}" ${m.on ? 'checked' : ''}><span>${m.role === 'mercMain' ? 'Hired' : 'Reinforcement'}: ${esc(m.name)}</span><small>${m.n} power${m.n === 1 ? '' : 's'}</small></label>`).join('')}</div>
        ${R.mercInfo.length ? '<p class="note merc-how"><b>Mercenary switches.</b> Green boxes turn your hired mercenary or reinforcement on and off. Buffs count at full strength while on.</p>' : '<p class="note merc-how"><b>Mercenary buffs.</b> Set up a mercenary on the Mercenaries page to get on and off switches here.</p>'}
        <p class="note">Tick what is true for the hit. The Selected column below shows that hit with mid rolls, next to the same hit with nothing ticked. Ticked conditions also feed Expected. Overpower works the Lord of Hatred way: each stack adds 15% additive damage for 4 seconds, up to 4 stacks unless a power such as the Tidal aspect raises the limit. Your Overpower Damage bonus raises the per-stack amount, and its [x] lines multiply on top.</p>
      </section>
      <div class="tc-grid">
        <section class="tc-box"><h3>Setup</h3>
          <div class="kv">
            <label for="tcSkill">Skill</label><select id="tcSkill">${R.skills.map(id => `<option value="${id}" ${id === T.skill ? 'selected' : ''}>${esc(C.powers[id].name)}</option>`).join('')}</select>
            <label for="tcPay">Damage line</label><select id="tcPay">${R.pays.map(x => `<option value="${x.k}" ${R.payD && x.k === R.payD.k ? 'selected' : ''}>${x.dawn ? 'Dawnfire fire pulse, ' + f(x.v) + '% of weapon damage' : f(x.v) + '% skill damage'}</option>`).join('')}</select>
            <label for="tcWd">Weapon damage (from your weapon tooltip)</label><input id="tcWd" type="number" value="${esc(T.wd)}" placeholder="Type it in">
            <label for="tcWs">Weapon speed (attacks per second)</label><input id="tcWs" type="number" step="0.01" value="${esc(T.ws)}">
            <label for="tcBase">${R.msName} not on gear (level and base)</label><input id="tcBase" type="number" value="${esc(T.base)}">
            ${R.dawn ? `<label for="tcDawn">Dawnfire stacks from kills (0 to ${R.dawn.max})</label><input id="tcDawn" type="number" min="0" max="${R.dawn.max}" value="${R.dawn.stacks}">` : ''}
            <label for="tcVuln">Vulnerable uptime for expected (%)</label><input id="tcVuln" type="number" value="${esc(T.vuln)}">
          </div>
        </section>
        <section class="tc-box tc-out"><h3>${esc(R.P.name)}: damage per hit and per second</h3>
          ${R.wd ? '' : '<p class="warn">Type your weapon damage to see real numbers. Everything else is already filled in from your build.</p>'}
          <table class="tc-table"><thead><tr><th>Monster</th><th>${R.dot ? 'Lowest total' : 'Min hit'}</th><th>${R.dot ? 'Expected total' : 'Expected hit'}</th><th>${R.dot ? 'Highest total' : 'Max hit'}</th><th>Selected</th><th>Expected DPS</th></tr></thead>
          <tbody>${R.segs.map(([l, x, sh, ph]) => `<tr><th>${l}</th><td>${f(x.min)}</td><td><b>${f(x.exp)}</b></td><td>${f(x.max)}</td><td class="selhit"><b>${f(sh)}</b><small>${ph ? `x${f(sh / ph, 2)} vs none` : ''}</small></td><td><b>${f(x.exp * R.hps)}</b></td></tr>`).join('')}</tbody></table>
          ${R.dot ? `<p class="note"><b>${esc(R.dot.kind)}.</b> Each number is the whole amount one cast puts on the monster${R.dot.dur ? `, paid out over ${f(R.dot.dur, 1)} seconds in ${f(R.dot.dur * 2)} ticks of ${f(R.segs[0][1].exp / (R.dot.dur * 2))} (every half second)` : ', paid out in ticks every half second'}. It cannot crit and has no high or low roll. Recasting adds to what is left, so over a long fight the damage per second is the total times casts per second.</p>` : ''}${R.isDawn ? `<p class="note"><b>Dawnfire.</b> A flat ${f(R.dawn.lo * 100)} to ${f(R.dawn.hi * 100)}% of your weapon's top damage as Fire every second, x${R.dawnX.toFixed(2)} at ${R.dawn.stacks} kill stacks (${f(R.dawn.per)}%[x] each, up to ${R.dawn.max}).</p>` : ''}
          <p class="note">${R.pulse ? `This is a pulse on a fixed timer: one hit every ${f(R.pulseEvery, 2)} s. Attack speed does not make it tick faster; it raises each pulse by x${R.asDmg.toFixed(2)} instead (${f(R.as1, 1)}% Attack Speed plus ${f(R.as2, 1)}% Cast Speed).` : `Hits per second: ${f(R.hps, 2)}. Weapon speed ${f(+T.ws || 0, 2)} with ${f(R.as1, 1)}% Attack Speed (first cap, 100%) and ${f(R.as2, 1)}% Cast Speed (second cap, 100%) gives ${f(R.aps, 3)} attacks per second.${R.frames ? ` ${esc(R.P.name)} then takes ${f(R.frames, 1)} frames a cast${R.nextAps ? `; it gets faster at ${f(R.nextAps, 3)} attacks per second, which needs ${f((R.nextAps / (+T.ws || 1) - 1) * 100, 1)}% total speed` : ', its fastest measured step'}.` : ' No frame table for this skill yet, so this assumes every bit of speed counts.'}`} Bosses use the elite bonus; boss-only powers can be added as gear or ticked below. Every number already includes the ${f((1 - R.monDR) * 100)}% damage reduction all monsters have at your level, so it should match the numbers you see in game.</p>
          ${(() => { let Dd = null; try { Dd = defense(); } catch (e) { return ''; } const cs = (Dd.cards || []).filter(c => c && c.cat !== 'boss' && c.cat !== 'world'); if (!cs.length || !R.wd) return '';
            const t = v => v < 1 ? 'under 1 second' : v < 90 ? f(v, 1) + ' seconds' : v < 5400 ? f(v / 60, 1) + ' minutes' : f(v / 3600, 1) + ' hours';
            return `<table class="tc-table ttk"><thead><tr><th>Time to kill, ${esc(Dd.tier && Dd.tier.name ? Dd.tier.name : 'at your Defense page difficulty')}</th><th>Life (estimate)</th><th>Time</th></tr></thead><tbody>${cs.map(c => { const seg = R.segs[c.cat === 'normal' && c.rarity === 'normal' ? 0 : c.cat === 'boss' || c.cat === 'world' ? 2 : 1][1]; const dps = seg.exp * R.hps; return `<tr><th>${esc(c.m.name)}</th><td>${f(c.life)}</td><td><b>${dps > 0 ? t(c.life / dps) : 'No damage yet'}</b></td></tr>`; }).join('')}</tbody></table><p class="note">One target, the monsters and difficulty picked on Defense Theory Craft. Monster Life comes from the game files and has not been checked in game. Bosses are left out because their Life is not in the files.</p>`; })()}
          <div class="tc-skill">
            ${row('Skill rank', R.sk.lvl, R.sk.gearRanks ? `${R.sk.baseRank} + ${R.sk.gearRanks} from build` : '')}
            ${row('Cooldown', R.sk.cd() ? f(R.sk.cdEff(), 2) + ' s' : 'None', R.sk.cd() && R.SB.cdrKeep < 1 ? 'base ' + f(R.sk.cd(), 2) + ' s' : '')}
            ${row('Cost', R.sk.cost() ? f(R.sk.costEff(), 1) : 'None', R.SB.rcr ? 'base ' + f(R.sk.cost(), 1) : '')}
            ${row('Lucky Hit chance', f(R.sk.lhEff(), 1) + '%', R.SB.lhc ? 'base ' + f(R.sk.lh(), 1) + '%' : '')}
          </div>
        </section>
        <section class="tc-box"><h3>Damage buckets</h3>
          <div class="bucket"><b>Weapon x skill</b><span>${f(R.wd)} x ${f(R.skillPct, 1)}%</span></div>
          <div class="bucket"><b>${R.msName}</b><span>${f(R.msTotal)} points, x${f(R.msMult, 3)}</span></div>
          <details class="bucket-d"><summary><b>Additive damage</b><span>+${f(R.addAlways, 1)}% always${R.addElite ? `, +${f(R.addElite, 1)}% vs elites` : ''}</span></summary>${list([...R.always, ...R.elite])}</details>
          <details class="bucket-d"><summary><b>[x] from stats</b><span>x${f(R.xLo, 3)}</span></summary>${list(R.xStat)}</details>
          <details class="bucket-d" open><summary><b>[x] from aspects and uniques</b><span>x${f(R.xMid / (R.xS || 1), 3)} expected</span></summary>
            ${R.xGear.length ? R.xGear.map(x => `<label class="check xg"><input type="checkbox" data-xoff="${esc(x.id)}" ${x.on ? 'checked' : ''}> <span><b>${esc(x.n)}</b> ${x.lo === x.hi ? f(x.lo, 1) : f(x.lo, 1) + ' to ' + f(x.hi, 1)}%[x] <em>${esc(x.what)}</em></span></label>`).join('') : '<p class="note">No [x] powers on your equipped aspects or uniques yet.</p>'}
            <p class="note">Untick a power when its condition won't be met in your fight.</p></details>
          <details class="bucket-d" open><summary><b>Attack and cast speed</b><span>${f(R.as1, 1)}% + ${f(R.as2, 1)}%</span></summary>
            ${R.spd.length ? R.spd.map(x => `<label class="check xg"><input type="checkbox" data-xoff="${esc(x.id)}" ${x.on ? 'checked' : ''}> <span><b>${esc(x.n)}</b> ${x.lo === x.hi ? f(x.lo, 1) : f(x.lo, 1) + ' to ' + f(x.hi, 1)}% ${x.kind === 'cs' ? 'Cast Speed' : 'Attack Speed'} <em>${esc(x.what)}</em></span></label>`).join('') : '<p class="note">No buffs on this build add speed beyond what is on the character sheet.</p>'}
            <p class="note">Attack Speed counts up to 100% and Cast Speed up to another 100%. Untick a buff you will not have up.</p></details>
          ${R.dot ? `<div class="bucket"><b>Damage over time</b><span>+${f(R.dotAdd, 1)}% in the pool, x${R.dotX.toFixed(2)}</span></div>` : ''}
          <div class="bucket"><b>Critical strike</b><span>${f(R.cc, 1)}% chance, x${f(R.critMult, 2)} on crit${R.csdAdd ? `, plus +${f(R.csdAdd, 1)}% in the additive pool` : ''}</span></div>
          <div class="bucket"><b>Vulnerable</b><span>x${f(R.vulnMult, 2)} while vulnerable${R.vulnAdd ? `, plus +${f(R.vulnAdd, 1)}% in the additive pool` : ''}</span></div>
          ${R.pulse ? `<div class="bucket"><b>Attack speed on pulse damage</b><span>x${R.asDmg.toFixed(2)}</span></div>` : ''}
          <div class="bucket"><b>Monster damage reduction</b><span>x${f(R.monDR, 2)} at level ${MON_LEVEL}</span></div>
        </section>
        <section class="tc-box"><h3>Lucky Hit with ${esc(R.P.name)}</h3>
          ${R.luck.length ? R.luck.map(l => `<div class="tc-row"><span>${esc(l.n)} <small>up to ${f(l.v)}%</small></span><b class="num">${f(l.p * 100, 2)}% per hit</b><small>${l.perSec ? `${f(l.perSec, 3)} per second, about every ${f(1 / l.perSec, 1)} s` : 'Set weapon speed to see procs per second'}</small></div>`).join('') : '<p class="note">No Lucky Hit effects on your gear yet.</p>'}
        </section>
      </div></div>`;
    const set = (k, v) => { T[k] = v; commit(); renderTheory(); };
    $('#tcSkill').onchange = e => { T.pay = ''; set('skill', e.target.value); };
    $('#tcPay').onchange = e => set('pay', e.target.value);
    [['tcWd', 'wd'], ['tcWs', 'ws'], ['tcBase', 'base'], ['tcVuln', 'vuln'], ['tcDawn', 'dawn']].forEach(([id, k]) => { const el = $('#' + id); if (el) el.onchange = e => set(k, e.target.value); });
    const ops = $('#opStacks'); if (ops) ops.onchange = () => { T.st.opStacks = Math.max(1, Math.min(12, Math.round(+ops.value || 4))); commit(); renderTheory(); };
    $$('#panel-theory [data-st]').forEach(c => c.onchange = () => { const k = c.dataset.st; T.st[k] = c.checked; if (TC_COND.some(([x]) => x === k)) T.cond[k] = c.checked; commit(); renderTheory(); });
    $$('#panel-theory [data-xoff]').forEach(c => c.onchange = () => { T.off[c.dataset.xoff] = !c.checked; commit(); renderTheory(); });
  }


  // ---------- text for powers outside the class tree (mercenaries, war plans, soul shards) ----------
  // pool: the other powers this one can borrow numbers from (PowerTag.<power>."Script Formula N")
  function powerText(P, tpl, lvl, pool) {
    if (!P) return '';
    const D = data(); let depth = 0;
    const table = (i, l) => { const t = D.tables[i]; if (!t) return 0; return t[Math.max(0, Math.min(t.length - 1, Math.round(l)))]; };
    const mk = Q => { const memo = {}; const c = { table, id: name => {
      if (name === 'sLevel' || name === 'Level') return lvl || 1;
      const r = name.match(/^PowerTag\.([A-Za-z0-9_]+)\."Script Formula (\d+)"$/);
      if (r) { const O = pool && pool[r[1]]; if (!O || depth > 30) return 0; depth++; const v = D4F.evaluate(O.sf[+r[2]] || '0', mk(O)); depth--; return v; }
      const m = name.match(/^SF_(\d+)$/); if (!m) return 0;
      if (memo[name] !== undefined) return memo[name]; if (depth > 30) return 0; depth++;
      const v = D4F.evaluate(Q.sf[+m[1]] || '0', c); depth--; memo[name] = v; return v;
    } }; return c; };
    const ctx = mk(P);
    const ev = e => D4F.evaluate(e, ctx);
    const src = String(tpl == null ? P.desc : tpl).replace(/\{(\/?)c_([A-Za-z]+)\}/g, (m, sl, n) => '{' + sl + 'c_' + n.toLowerCase() + '}').replace(/\{\/?b\}/g, '');
    return D4T.render(src, {
      value: inner => ev(inner),
      token: n => {
        if (n.startsWith('payload:')) { const f = P.payloads[n.slice(8)]; return f === undefined ? '' : '<b class="num">' + D4T.fmtNum(ev(f) * 100) + '%</b>'; }
        if (/^SF_\d+$/.test(n)) return ev(n);
        if (n === 'Cooldown Time') return ev(P.cd);
        if (n === 'Combat Effect Chance') return ev(P.lh);
        if (n === 'Resource Cost') return P.cost.length ? ev(P.cost[0]) : 0;
        if (n === 'Max Charges') return ev(P.charges);
        if (n.startsWith('buffduration:')) return '';
        return undefined;
      },
      cond: c => c === 'ADVANCED_TOOLTIP' ? false : /^SF_\d+$/.test(c) ? !!ev(c) : false,
    });
  }

  // ---------- small node tree, shared by mercenaries and war plans ----------
  // nodes in the same exclusive group (g >= 0) are a choice: picking one drops its partner
  function miniTreeHtml(T, picked, key) {
    const ns = T.nodes; if (!ns.length) return '';
    const xs = ns.map(n => n.x), ys = ns.map(n => n.y);
    const pad = 420; const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, w = Math.max(...xs) - Math.min(...xs) + pad * 2, h = Math.max(...ys) - Math.min(...ys) + pad * 2 + 160;
    const on = i => picked.includes(i);
    const lit = i => on(i) || ns[i].kind === 'hub';
    let html = '';
    for (const [a, b] of T.links) { if (!ns[a] || !ns[b]) continue; const L = lit(a) && lit(b) && (on(a) || on(b));
      html += `<path class="mlink${L ? ' lit' : ''}" d="M${ns[a].x} ${ns[a].y} L${ns[b].x} ${ns[b].y}"/>`; }
    for (const n of ns) {
      const P = n.power && T.powers[n.power]; const o = on(n.i);
      if (n.kind === 'hub') { html += `<g class="mnode hub${n.root === 1 ? ' root' : ''}" transform="translate(${n.x} ${n.y})">${n.root === 1 ? `<circle r="150" class="rootc"/><circle r="70" class="rooti"/>` : `<rect x="-55" y="-55" width="110" height="110" rx="10" transform="rotate(45)"/>`}</g>`; continue; }
      const sq = n.kind === 'unlock'; const m = D4ART.modMotif(P && P.name, P && P.desc);
      const tile = sq ? `<rect x="-190" y="-190" width="380" height="380" rx="18" class="mframe"/><rect x="-160" y="-160" width="320" height="320" rx="8" class="mface"/>`
        : `<rect x="-150" y="-150" width="300" height="300" rx="14" transform="rotate(45)" class="mframe"/><rect x="-118" y="-118" width="236" height="236" rx="8" transform="rotate(45)" class="mface"/>`;
      html += `<g class="mnode ${sq ? 'skill' : 'pass'}${o ? ' on' : ''}" data-${key}="${n.i}" role="button" tabindex="0" aria-pressed="${o}" aria-label="${esc(P ? P.name : 'Node')}">
        <title>${esc(P ? P.name : '')}</title><g transform="translate(${n.x} ${n.y})">${o ? '<circle r="330" class="mglow"/>' : ''}${tile}<g class="memb">${inkMotif(m, sq ? 2.2 : 1.7)}</g></g>
        <text class="mlabel${o ? ' on' : ''}" x="${n.x}" y="${n.y + (sq ? 330 : 300)}">${esc(P ? P.name : '')}</text></g>`;
    }
    return `<svg class="minitree" viewBox="${x0} ${y0} ${w} ${h}" role="group" aria-label="Skill tree">${TREE_DEFS}${html}</svg>`;
  }
  function pickNode(T, list, i) {
    const n = T.nodes[i]; if (!n || n.kind === 'hub') return list;
    if (list.includes(i)) return list.filter(x => x !== i);
    const out = n.g >= 0 ? list.filter(x => !(T.nodes[x] && T.nodes[x].g === n.g)) : list.slice();
    out.push(i); return out;
  }
  const nodeCards = (T, list, lvl) => list.map(i => T.nodes[i]).filter(n => n && n.power && T.powers[n.power]).map(n => { const P = T.powers[n.power];
    return `<details class="srow pw" open><summary><span class="sk">${esc(P.name)}</span><em>${n.kind === 'unlock' ? 'Skill' : 'Passive'}</em></summary><div class="pdesc">${powerText(P, null, lvl, T.powers)}</div></details>`; }).join('');

  // ---------- mercenaries: one hired, one reinforcement ----------
  const MERC_GROUP = { 1: 'Core skill', 2: 'Skill', 3: 'Skill' };
  const OPPORTUNITIES = [['avail', 'Cast when available', 'Cast when you cast any skill in combat.'], ['injured', 'Cast when Injured', 'Cast when you become Injured.'], ['cc', 'Cast when hit with a Control Impairing Effect', 'Cast when you are hit with a Control Impairing Effect.'], ['skill', 'Cast when you cast a skill', 'Pick one of your skills below.']];
  function mercState() { const d = { main: '', sup: '', supSkill: '', opp: 'avail', oppSkill: '', nodes: {} }; if (!S.merc || typeof S.merc !== 'object') S.merc = d; else for (const k in d) if (S.merc[k] == null) S.merc[k] = d[k]; return S.merc; }
  function renderMercs() {
    const box = $('#panel-mercs'); const list = data().mercs || [];
    if (!list.length) { box.innerHTML = '<div class="tc"><div class="tc-empty"><h2>Mercenaries</h2><p>No mercenary data in this game version.</p></div></div>'; return; }
    const M = mercState(); const main = list.find(m => m.id === M.main); const sup = list.find(m => m.id === M.sup);
    const card = (m, role) => `<button class="merc-card${(role === 'main' ? M.main : M.sup) === m.id ? ' on' : ''}" data-${role}="${m.id}" ${role === 'sup' && M.main === m.id ? 'disabled title="Your hired mercenary cannot also be your reinforcement"' : ''} aria-pressed="${(role === 'main' ? M.main : M.sup) === m.id}">
      <span class="merc-sig" aria-hidden="true">${inkSvg(m.id)}</span><b>${esc(m.name)}</b><small>${esc(m.role)}</small></button>`;
    const picked = main ? (M.nodes[main.id] || []) : [];
    const groupsLeft = main ? [...new Set(main.nodes.filter(n => n.g >= 0).map(n => n.g))].filter(g => !picked.some(i => main.nodes[i].g === g)).length : 0;
    const bonus = main && main.bonus && main.powers[main.bonus];
    const supSkills = sup ? sup.actives.filter(a => sup.powers[a]) : [];
    const bar = (S.hotbar || []).filter(p => cdata().powers[p] && !cdata().powers[p].passive);
    box.innerHTML = `<div class="tc merc">
      <header class="tc-head"><div><h2>Mercenaries</h2><p>Hire one mercenary to fight beside you and pick their skills on the tree. Enlist a different one as your reinforcement: they appear for one skill at the moment you choose.</p><p><b>How it counts:</b> your hired mercenary's picks and your reinforcement's skill feed Damage, Defense and the Character sheet. Each has an on and off switch there.</p></div></header>
      <div class="merc-cols">
        <section class="tc-box"><h3>Hired mercenary</h3><div class="merc-row">${list.map(m => card(m, 'main')).join('')}</div>
          ${main ? `<p class="note">${groupsLeft ? `${groupsLeft} choice${groupsLeft > 1 ? 's' : ''} left. ` : 'Every choice made. '}Each pair of linked nodes is a choice: pick one. The top pair is the Core skill, which changes how ${esc(main.name)} fights.</p>
          ${miniTreeHtml(main, picked, 'mn')}
          ${bonus ? `<div class="merc-bonus"><h4>${esc(bonus.name)} <span>signature</span></h4><div class="pdesc">${powerText(bonus, null, 1, main.powers)}</div></div>` : ''}
          <div class="merc-picked">${nodeCards(main, picked) || '<p class="empty">Click nodes on the tree to choose skills and passives.</p>'}</div>
          <button class="btn ghost" id="mercReset">Clear ${esc(main.name)}'s tree</button>` : '<p class="empty">Choose who to hire.</p>'}
        </section>
        <section class="tc-box"><h3>Reinforcement</h3><div class="merc-row">${list.map(m => card(m, 'sup')).join('')}</div>
          ${sup ? `<h4 class="sub">Skill</h4><div class="opt-list">${supSkills.map(a => { const P = sup.powers[a]; return `<label class="opt${M.supSkill === a ? ' on' : ''}"><input type="radio" name="supSkill" value="${a}" ${M.supSkill === a ? 'checked' : ''}><span><b>${esc(P.name)}</b><span class="pdesc">${powerText(P, null, 1, sup.powers)}</span></span></label>`; }).join('')}</div>
          <h4 class="sub">Opportunity</h4><div class="opt-list">${OPPORTUNITIES.map(([k, l, d]) => `<label class="opt${M.opp === k ? ' on' : ''}"><input type="radio" name="opp" value="${k}" ${M.opp === k ? 'checked' : ''}><span><b>${esc(l)}</b><span class="pdesc">${esc(d)}</span></span></label>`).join('')}</div>
          ${M.opp === 'skill' ? `<div class="frow"><select id="oppSkill" aria-label="Skill that calls the reinforcement"><option value="">Choose one of your skills...</option>${bar.map(p => `<option value="${p}" ${p === M.oppSkill ? 'selected' : ''}>${esc(cdata().powers[p].name)}</option>`).join('')}</select></div>${bar.length ? '' : '<p class="note">Take some skills on the Skill tree first.</p>'}` : ''}` : '<p class="empty">Choose a reinforcement. It has to be someone other than your hired mercenary.</p>'}
        </section>
      </div></div>`;
    $$('#panel-mercs [data-main]').forEach(b => b.onclick = () => { M.main = M.main === b.dataset.main ? '' : b.dataset.main; if (M.sup === M.main) { M.sup = ''; M.supSkill = ''; } commit(); renderMercs(); });
    $$('#panel-mercs [data-sup]').forEach(b => b.onclick = () => { M.sup = M.sup === b.dataset.sup ? '' : b.dataset.sup; M.supSkill = ''; commit(); renderMercs(); });
    $$('#panel-mercs [data-mn]').forEach(g => { const go = () => { M.nodes[main.id] = pickNode(main, picked, +g.dataset.mn); commit(); renderMercs(); }; g.onclick = go; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }; });
    $$('#panel-mercs input[name=supSkill]').forEach(r => r.onchange = () => { M.supSkill = r.value; commit(); renderMercs(); });
    $$('#panel-mercs input[name=opp]').forEach(r => r.onchange = () => { M.opp = r.value; commit(); renderMercs(); });
    const os = $('#oppSkill'); if (os) os.onchange = () => { M.oppSkill = os.value; commit(); renderMercs(); };
    const mr = $('#mercReset'); if (mr) mr.onclick = () => { M.nodes[main.id] = []; commit(); renderMercs(); };
  }
  // a small emblem per mercenary, drawn from the shared motif set
  const MERC_MOTIF = { ShieldBearer: 'shield', BerserkerCrone: 'blade', BountyHunter: 'target', CursedChild: 'eye' };
  const inkSvg = id => `<svg viewBox="-60 -60 120 120" aria-hidden="true">${inkMotif(D4ART.paths[MERC_MOTIF[id]] ? MERC_MOTIF[id] : Object.keys(D4ART.paths)[0], 0.75)}</svg>`;

  // ---------- war plans: one passive tree per activity ----------
  let wpSel = '';
  function renderWarplans() {
    const box = $('#panel-warplans'); const list = data().warplans || [];
    if (!list.length) { box.innerHTML = '<div class="tc"><div class="tc-empty"><h2>War Plans</h2><p>No war plan data in this game version.</p></div></div>'; return; }
    S.wp = S.wp || {}; if (!list.some(w => w.id === wpSel)) wpSel = list[0].id;
    const W = list.find(w => w.id === wpSel); const picked = S.wp[W.id] || [];
    const count = w => (S.wp[w.id] || []).length;
    box.innerHTML = `<div class="tc wp">
      <header class="tc-head"><div><h2>War Plans</h2><p>Each endgame activity has its own War Plan tree. Its nodes change how the activity plays and what it rewards. Linked pairs are a choice: pick one.</p></div></header>
      <div class="wp-tabs" role="tablist">${list.map(w => `<button role="tab" data-wp="${w.id}" aria-selected="${w.id === wpSel}">${esc(w.name)}${count(w) ? ` <small>${count(w)}</small>` : ''}</button>`).join('')}</div>
      <div class="wp-body">
        <section class="tc-box">${miniTreeHtml(W, picked, 'wn')}<button class="btn ghost" id="wpReset">Clear ${esc(W.name)}</button></section>
        <section class="tc-box"><h3>${esc(W.name)}: chosen</h3><div class="merc-picked">${nodeCards(W, picked) || '<p class="empty">Click nodes on the tree to add them to your plan.</p>'}</div></section>
      </div></div>`;
    $$('#panel-warplans [data-wp]').forEach(b => b.onclick = () => { wpSel = b.dataset.wp; renderWarplans(); });
    $$('#panel-warplans [data-wn]').forEach(g => { const go = () => { S.wp[W.id] = pickNode(W, picked, +g.dataset.wn); commit(); renderWarplans(); }; g.onclick = go; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }; });
    $('#wpReset').onclick = () => { S.wp[W.id] = []; commit(); renderWarplans(); };
  }

  // ---------- Warlock soul shards: one shard and one of its fragments ----------
  function renderShards() {
    const box = $('#panel-shards'); const list = data().shards || [];
    S.shard = Object.assign({ id: '', frag: '' }, S.shard || {});
    const pool = Object.assign({}, cdata().powers); list.forEach(sh => { pool[sh.power.id] = sh.power; sh.frags.forEach(f => { pool[f.id] = f; }); });
    box.innerHTML = `<div class="tc shards">
      <header class="tc-head"><div><h2>Soul Shards</h2><p>The Warlock carries one Soul Shard and sets one of its three fragments. You can change both at any time.</p></div></header>
      <div class="shard-grid">${list.map(sh => { const on = S.shard.id === sh.id;
        return `<section class="tc-box shard${on ? ' on' : ''}"><button class="shard-h" data-shard="${sh.id}" aria-pressed="${on}"><span class="shard-gem" aria-hidden="true"></span><b>${esc(sh.power.name)}</b></button>
          <div class="pdesc">${powerText(sh.power, null, 1, pool)}</div>
          <h4 class="sub">Fragment</h4><div class="opt-list">${sh.frags.map(f => `<label class="opt${on && S.shard.frag === f.id ? ' on' : ''}"><input type="radio" name="frag-${sh.id}" value="${f.id}" ${on && S.shard.frag === f.id ? 'checked' : ''}><span><b>${esc(f.name)}</b><span class="pdesc">${powerText(f, null, 1, pool)}</span></span></label>`).join('')}</div></section>`; }).join('')}</div></div>`;
    $$('#panel-shards [data-shard]').forEach(b => b.onclick = () => { if (S.shard.id === b.dataset.shard) S.shard = { id: '', frag: '' }; else S.shard = { id: b.dataset.shard, frag: '' }; commit(); renderShards(); });
    $$('#panel-shards input[type=radio]').forEach(r => r.onchange = () => { S.shard = { id: r.name.slice(5), frag: r.value }; commit(); renderShards(); });
  }

  // ---------- class mechanics for the other seven classes (Warlock uses renderShards) ----------
  function mechState() { S.mech = S.mech || {}; const m = S.mech[S.cls] = Object.assign({ picks: {}, bond: '', up: {} }, S.mech[S.cls] || {}); return m; }
  const mechPool = M => { const pool = Object.assign({}, cdata().powers); (M.groups || []).forEach(g => g.options.forEach(o => { if (o.power) pool[o.power.id] = o.power; if (o.extra) pool[o.extra.id] = o.extra; (o.upgrades || []).forEach(u => { pool[u.power.id] = u.power; }); })); return pool; };
  // how many picks a group allows right now
  const groupCap = (M, st, g) => g.pick + (M.bond && st.bond === g.name ? 1 : 0);
  function mechSummary() {
    const M = (data().mechanics || {})[S.cls]; if (!M) return '';
    const st = mechState(); const parts = [];
    M.groups.forEach((g, gi) => (st.picks[gi] || []).forEach(id => { const o = g.options.find(x => x.id === id); if (!o) return; const u = o.upgrades && o.upgrades.find(x => x.id === st.up[o.id]); parts.push(o.name + (u ? ` (${u.name})` : '')); }));
    return parts.length ? `<p class="sbar-shard">${esc(M.title)}: <b>${parts.map(esc).join(', ')}</b></p>` : '';
  }
  function renderMechanic() {
    const box = $('#panel-shards'); if (S.cls === 'Warlock') { renderShards(); return; }
    const M = (data().mechanics || {})[S.cls];
    if (!M) { box.innerHTML = '<div class="tc"><div class="tc-empty"><h2>Class mechanic</h2><p>No class mechanic data for this class in this game version.</p></div></div>'; return; }
    const st = mechState(); const pool = mechPool(M);
    const txt = P => powerText(P, null, 1, pool);
    const groups = M.groups.map((g, gi) => {
      const picked = st.picks[gi] || []; const cap = groupCap(M, st, g);
      const other = M.distinct ? M.groups.flatMap((h, hi) => hi === gi ? [] : (st.picks[hi] || []).map(id => id.split('_')[0])) : [];
      return `<section class="tc-box mech-group"><header class="mech-gh"><h3>${esc(g.name)}</h3><small>${picked.length} of ${cap}</small>
          ${M.bond ? `<button class="btn ghost small" data-bond="${esc(g.name)}" aria-pressed="${st.bond === g.name}">${st.bond === g.name ? 'Bonded' : 'Bond'}</button>` : ''}</header>
        <div class="opt-list">${g.options.map(o => { const on = picked.includes(o.id); const blocked = !on && other.includes(o.id.split('_')[0]);
          return `<div class="opt mech-opt${on ? ' on' : ''}${blocked ? ' blocked' : ''}"><button class="mech-pick" data-g="${gi}" data-o="${esc(o.id)}" aria-pressed="${on}" ${blocked ? 'disabled title="Already your other guardian"' : ''}><b>${esc(o.name)}</b></button>
            ${o.power ? `<span class="pdesc">${txt(o.power)}</span>` : ''}
            ${o.extra ? `<span class="pdesc mech-extra"><em>At rank 10:</em> ${txt(o.extra)}</span>` : ''}
            ${o.upgrades ? `<div class="mech-ups" role="group" aria-label="${esc(o.name)} upgrade">${o.upgrades.map(u => `<label class="opt${on && st.up[o.id] === u.id ? ' on' : ''}"><input type="radio" name="up-${esc(o.id)}" data-up="${esc(o.id)}" value="${u.id}" ${on && st.up[o.id] === u.id ? 'checked' : ''}><span><b>${esc(u.name)}</b><span class="pdesc">${txt(u.power)}</span></span></label>`).join('')}</div>` : ''}
          </div>`; }).join('')}</div></section>`; }).join('');
    box.innerHTML = `<div class="tc mech">
      <header class="tc-head"><div><h2>${esc(M.title)}</h2><p>${esc(M.intro || '')}</p></div><button class="btn ghost" id="mechClear">Clear</button></header>
      <div class="mech-grid">${groups}</div>
      <p class="note">The text and numbers are from the game files. Flat stat bonuses here are added to your stat totals, and [x] damage bonuses show up as multipliers you can switch on and off in Damage Theory Craft. Bonuses with conditions the planner cannot read are listed under Powers on the Character page.</p></div>`;
    $$('#panel-shards [data-g]').forEach(b => b.onclick = () => {
      const gi = +b.dataset.g, id = b.dataset.o; const g = M.groups[gi]; const cur = (st.picks[gi] || []).slice(); const cap = groupCap(M, st, g);
      if (cur.includes(id)) cur.splice(cur.indexOf(id), 1); else { cur.push(id); while (cur.length > cap) cur.shift(); }
      st.picks[gi] = cur; if (g.book) { g.options.forEach(o => { if (!cur.includes(o.id)) delete st.up[o.id]; }); const o = g.options.find(x => x.id === id); if (cur.includes(id) && o.upgrades && !st.up[id]) st.up[id] = o.upgrades[0].id; }
      commit(); renderMechanic(); });
    $$('#panel-shards [data-up]').forEach(r => r.onchange = () => { const id = r.dataset.up; const gi = M.groups.findIndex(g => g.options.some(o => o.id === id)); st.picks[gi] = [id]; M.groups[gi].options.forEach(o => { if (o.id !== id) delete st.up[o.id]; }); st.up[id] = r.value; commit(); renderMechanic(); });
    $$('#panel-shards [data-bond]').forEach(b => b.onclick = () => { st.bond = st.bond === b.dataset.bond ? '' : b.dataset.bond;
      M.groups.forEach((g, gi) => { const cap = groupCap(M, st, g); if ((st.picks[gi] || []).length > cap) st.picks[gi] = st.picks[gi].slice(-cap); }); commit(); renderMechanic(); });
    $('#mechClear').onclick = () => { S.mech[S.cls] = { picks: {}, bond: '', up: {} }; commit(); renderMechanic(); };
  }


  // ---------- class mechanic picks as text the stat and damage maths can read ----------
  var MECH_CACHE = { k: '', v: [] };
  function mechLines() {
    const key = S.cls + '|' + S.ver + '|' + JSON.stringify(S.cls === 'Warlock' ? S.shard || {} : (S.mech || {})[S.cls] || {});
    if (MECH_CACHE.k === key) return MECH_CACHE.v;
    const out = [];
    try {
      if (S.cls === 'Warlock') {
        const list = data().shards || []; const sh = S.shard && list.find(x => x.id === S.shard.id);
        if (sh) { const pool = Object.assign({}, cdata().powers); list.forEach(s => { pool[s.power.id] = s.power; s.frags.forEach(f => { pool[f.id] = f; }); });
          out.push({ name: sh.power.name, html: powerText(sh.power, null, 1, pool) });
          const fr = sh.frags.find(f => f.id === S.shard.frag); if (fr) out.push({ name: fr.name, html: powerText(fr, null, 1, pool) }); }
      } else {
        const M = (data().mechanics || {})[S.cls];
        if (M) { const st = mechState(); const pool = mechPool(M);
          M.groups.forEach((g, gi) => (st.picks[gi] || []).forEach(id => { const o = g.options.find(x => x.id === id); if (!o) return;
            if (o.power) out.push({ name: o.name, html: powerText(o.power, null, 1, pool) });
            if (o.extra) out.push({ name: o.name + ', rank 10', html: powerText(o.extra, null, 1, pool) });
            const u = o.upgrades && o.upgrades.find(x => x.id === st.up[o.id]); if (u) out.push({ name: `${o.name}, ${u.name}`, html: powerText(u.power, null, 1, pool) }); })); }
      }
    } catch (e) { /* a mechanic that fails to render adds nothing */ }
    MECH_CACHE = { k: key, v: out }; return out;
  }
  // "You gain 10%[+] increased Attack Speed" and "Your Critical Strike Chance is increased by 5%[+]" as stat lines
  function proseStats(html) {
    const out = [];
    decode(strip(String(html || ''))).replace(/\s+/g, ' ').split(/(?<=[.!])\s*(?=[A-Z])/).forEach(t => {
      // a bonus with a condition or a duration is not always on, so it stays out of the totals
      if (/\b(per|while|when|whenever|after|if|against|stacks?|until|each|every|seconds?)\b/i.test(t)) return;
      let m;
      const a = /([\d.]+)%\s*\[\+\]\s*(?:increased\s+)?([A-Z][A-Za-z]*(?: (?:to |of )?[A-Z][A-Za-z]*)*)/g;
      while ((m = a.exec(t))) if (+m[1]) out.push(`${m[1]}% ${m[2].trim()}`);
      const b = /([A-Z][A-Za-z]*(?: (?:to |of )?[A-Z][A-Za-z]*)*) is increased by ([\d.]+)%\s*\[\+\]/g;
      while ((m = b.exec(t))) if (+m[2]) out.push(`${m[2]}% ${m[1].replace(/^Your /, '').trim()}`);
      const c = /([\d.]+)%\s*\[x\]\s*(?:increased\s+)?(Vulnerable|Critical Strike|Overpower) Damage/g;
      while ((m = c.exec(t))) if (+m[1]) out.push(`${m[1]}%[x] ${m[2]} Damage`);
    });
    return out;
  }
  // ---------- one score for the whole build: damage and Effective Life ----------
  var EXTRA_LINES = [];   // what-if stat lines added on top of the build while the advisor tests an affix
  function evalBuild() {
    invalidate();
    const T = tcState(); const had = T.wd, hadS = T.ws; if (!(+T.wd)) T.wd = 100; if (!(+T.ws)) T.ws = 1;
    let R = null; try { R = theory(); } catch (e) { R = null; } T.wd = had; T.ws = hadS;
    let Dd = null; try { Dd = defense(); } catch (e) { Dd = null; }
    const M = statModel();
    const trk = tracks().map(t => { const s = M[t.id]; return s ? { id: t.id, l: s.l, st: trackState(t, s)[0], v: s.v, u: s.u || '' } : null; }).filter(Boolean);
    const shots = Dd ? [].concat(...Dd.cards.map(c => c.attacks.filter(r => r.hit >= Dd.life).map(r => `${c.m.name}'s ${r.a.name}`))) : [];
    const res = { dmg: R && R.base > 0 ? R.segs[1][1].exp * R.hps : null, ehp: Dd ? Dd.now : null, life: Dd ? Dd.life : null, trk, shots, skill: R ? R.P.name : '' };
    invalidate(); return res;
  }
  function withGear(slotId, g, fn) { const old = S.gear[slotId]; S.gear[slotId] = g; try { return fn(); } finally { if (old === undefined) delete S.gear[slotId]; else S.gear[slotId] = old; invalidate(); } }
  const pctCh = (a, b) => a == null || b == null || !a ? null : (b / a - 1) * 100;
  const FOCUS = { balanced: ['Balanced', 1, 1], damage: ['Damage first', 1, 0.35], survival: ['Survival first', 0.35, 1] };
  const focusOf = () => FOCUS[S.focus] ? S.focus : 'balanced';
  const scoreOf = (dD, dE) => { const [, wD, wE] = FOCUS[focusOf()]; return (dD || 0) * wD + (dE || 0) * wE; };
  const sgn = (v, d) => (v >= 0 ? '+' : '') + D4T.fmtNum(Math.round(v * Math.pow(10, d == null ? 1 : d)) / Math.pow(10, d == null ? 1 : d)) + '%';
  // the call: is the swap worth it
  function verdictOf(A, B) {
    const dD = pctCh(A.dmg, B.dmg), dE = pctCh(A.ehp, B.ehp); const [, wD, wE] = FOCUS[focusOf()];
    const x = (dD || 0) * wD, y = (dE || 0) * wE; const up = Math.max(x, 0) + Math.max(y, 0), down = Math.max(-x, 0) + Math.max(-y, 0);
    let tag, cls, call;
    const dTxt = dD == null ? '' : `${Math.abs(dD) < 0.05 ? 'the same' : sgn(dD)} damage`, eTxt = dE == null ? '' : `${Math.abs(dE) < 0.05 ? 'the same' : sgn(dE)} Effective Life`;
    if (up < 1 && down < 1) { tag = 'About the same'; cls = 'side'; call = 'Neither item is clearly better. Keep whichever has the better greater affixes.'; }
    else if (down < 1) { tag = 'Upgrade'; cls = 'up'; call = `Better for this build: ${[dTxt, eTxt].filter(Boolean).join(', ')}.`; }
    else if (up < 1) { tag = 'Downgrade'; cls = 'down'; call = `Worse for this build: ${[dTxt, eTxt].filter(Boolean).join(', ')}.`; }
    else if (up >= 2.5 * down) { tag = 'Worth it'; cls = 'up'; call = `Worth it: ${x > 0 ? dTxt : eTxt} for ${x > 0 ? eTxt : dTxt}.`; }
    else if (down >= 2.5 * up) { tag = 'Not worth it'; cls = 'down'; call = `Not worth it: ${x > 0 ? dTxt : eTxt}, but ${x > 0 ? eTxt : dTxt}.`; }
    else { tag = 'Close call'; cls = 'side'; call = `Close call: ${dTxt}, ${eTxt}. ${(dD || 0) > 0 ? 'Take it if you are farming, skip it if you are pushing.' : 'Take it if you are dying, skip it if you are not.'}`; }
    const warn = [];
    A.trk.forEach(t => { const n = B.trk.find(z => z.id === t.id); if (!n) return;
      if ((t.st === 'capped' || t.st === 'met') && !(n.st === 'capped' || n.st === 'met' || n.st === 'over')) warn.push(`${t.l} drops from ${fmtV(t.v, t.u)} to ${fmtV(n.v, n.u)} and falls below your target.`);
      else if (n.st === 'over' && t.st !== 'over') warn.push(`${t.l} goes over its cap, so some of it is wasted.`); });
    const newShots = B.shots.filter(s => !A.shots.includes(s)), savedShots = A.shots.filter(s => !B.shots.includes(s));
    if (newShots.length) warn.push(`${newShots.slice(0, 2).join(' and ')} would now kill you in one hit.`);
    const good = savedShots.length ? [`You now survive ${savedShots.slice(0, 2).join(' and ')}.`] : [];
    return { dD, dE, tag, cls, call, warn, good };
  }
  // ---------- compare a drop against what is in the slot ----------
  const clone = o => JSON.parse(JSON.stringify(o || {}));
  function startCompare(slotId) {
    const g = S.gear[slotId]; if (!g || !g.item) return; const it = findItem(g.item);
    S.cmp = { slot: slotId, base: clone(g) };
    // a legendary drop takes your aspect, temper, quality and gems: only its own affixes are judged
    if (it && !it.kind) { g.affixes = []; g.hor = null; }
    commit();
  }
  function compareHtml(sel, it, g) {
    const C = S.cmp && S.cmp.slot === sel.id ? S.cmp : null;
    if (!it && !C) return '';
    if (!C) return `<div class="cmp-start"><button class="btn ghost" id="cmpStart">Compare a drop</button><small>Found something for this slot? Enter it and see whether it beats what you are wearing.</small></div>`;
    const A = withGear(sel.id, C.base, evalBuild), B = evalBuild(); const V = verdictOf(A, B);
    const lineOf = a => { const d = a && affixDef(a.id); return d ? d.t.replace('§', D4T.fmtNum(rollOf(a, d))) + (a.ga ? ' (greater)' : '') : ''; };
    const oldA = (C.base.affixes || []).filter(Boolean), newA = (g.affixes || []).filter(Boolean);
    const gained = newA.filter(a => !oldA.some(o => o.id === a.id)).map(lineOf).filter(Boolean), lost = oldA.filter(a => !newA.some(o => o.id === a.id)).map(lineOf).filter(Boolean);
    const baseIt = findItem(C.base.item); const legend = !!it && !it.kind && !!baseIt && !baseIt.kind;
    const none = !it || (legend && !newA.length);
    return `<section class="cmp ${none ? 'side' : V.cls}" aria-live="polite">
      <header><span class="cmp-tag">${none ? 'Enter the drop' : esc(V.tag)}</span><h3>${esc(baseIt ? baseIt.name : sel.name)} against the drop</h3>
        <label class="cmp-focus">Build cares about <select id="cmpFocus">${Object.keys(FOCUS).map(k => `<option value="${k}" ${k === focusOf() ? 'selected' : ''}>${FOCUS[k][0]}</option>`).join('')}</select></label></header>
      ${none ? `<p class="cmp-call">Pick the drop's affixes below and type its rolls. ${legend ? 'Your aspect, temper, quality and gems are carried over, since you would put those on it yourself.' : ''}</p>` : `
      <div class="cmp-nums"><div class="${(V.dD || 0) > 0.05 ? 'pos' : (V.dD || 0) < -0.05 ? 'neg' : ''}"><b>${V.dD == null ? 'No skill' : sgn(V.dD)}</b><span>damage${A.skill ? ` (${esc(A.skill)})` : ''}</span></div>
        <div class="${(V.dE || 0) > 0.05 ? 'pos' : (V.dE || 0) < -0.05 ? 'neg' : ''}"><b>${V.dE == null ? 'No data' : sgn(V.dE)}</b><span>Effective Life</span></div></div>
      <p class="cmp-call">${esc(V.call)}</p>
      ${V.good.map(w => `<p class="cmp-good">${esc(w)}</p>`).join('')}${V.warn.map(w => `<p class="cmp-warn">${esc(w)}</p>`).join('')}
      ${gained.length || lost.length ? `<div class="cmp-diff">${gained.length ? `<div><span>You gain</span>${gained.map(x => `<i class="g">${esc(x)}</i>`).join('')}</div>` : ''}${lost.length ? `<div><span>You lose</span>${lost.map(x => `<i class="l">${esc(x)}</i>`).join('')}</div>` : ''}</div>` : ''}
      ${V.dD == null ? '<p class="note">Take a skill on the Skill tree and pick it on Damage Theory Craft to get a damage number.</p>' : ''}`}
      <div class="cmp-act"><button class="btn" id="cmpKeep" ${none ? 'disabled' : ''}>Keep the drop</button><button class="btn ghost" id="cmpBack">Put the old one back</button></div>
      ${legend ? '<p class="note">Judged on the affixes only. Aspect, temper, quality and gems are the same on both sides. Effective Life is measured against the monsters picked on Defense Theory Craft.</p>' : '<p class="note">Uniques are compared whole, power included. Effective Life is measured against the monsters picked on Defense Theory Craft.</p>'}
    </section>`;
  }
  function wireCompare(sel, redo) {
    const st = $('#cmpStart'); if (st) st.onclick = () => { startCompare(sel.id); redo(); };
    const k = $('#cmpKeep'); if (k) k.onclick = () => { delete S.cmp; commit(); redo(); toast('Drop kept'); };
    const b = $('#cmpBack'); if (b) b.onclick = () => { S.gear[S.cmp.slot] = S.cmp.base; delete S.cmp; commit(); redo(); toast('Old item restored'); };
    const f = $('#cmpFocus'); if (f) f.onchange = () => { S.focus = f.value; commit(); redo(); };
  }

  // ---------- what to upgrade next: the best single affix swap in each slot ----------
  var ADVICE = null;
  function upgradeAdvice() {
    const base = evalBuild(); const G = GD(); const rows = [];
    const okCls = x => !x.cls || !x.cls.length || (Array.isArray(x.cls) ? x.cls.includes(S.cls) : x.cls === S.cls);
    const gainOf = {};   // what one top roll of each affix adds to the build as it stands
    const gain = d => { if (gainOf[d.id]) return gainOf[d.id]; EXTRA_LINES = [fillTpl(d.t, d.v, 1)]; const e = evalBuild(); EXTRA_LINES = []; invalidate();
      const dD = pctCh(base.dmg, e.dmg), dE = pctCh(base.ehp, e.ehp); return (gainOf[d.id] = { dD, dE, s: scoreOf(dD, dE) }); };
    for (const sl of SLOTS) {
      if (sl.id === 'offhand' && offhandBlock()) continue;
      const g = S.gear[sl.id]; const it = g && findItem(g.item);
      if (!it) { rows.push({ sl, kind: 'empty', s: 1e6 }); continue; }
      if (it.kind) { rows.push({ sl, it, kind: 'unique', s: -1 }); continue; }
      const cur = (g.affixes || []).slice(0, N_AFF); const have = new Set(cur.filter(Boolean).map(a => a.id));
      const pool = G.affixes.filter(a => a.slots.includes(slotKind(sl.id)) && okCls(a) && !have.has(a.id));
      const best = pool.map(d => ({ d, g: gain(d) })).sort((a, b) => b.g.s - a.g.s)[0];
      if (!best || best.g.s <= 0.05) { rows.push({ sl, it, kind: 'done', s: 0 }); continue; }
      // which slot to put it in: an empty one, or the affix the build misses least
      let idx = -1; for (let i = 0; i < N_AFF; i++) if (!cur[i]) { idx = i; break; }
      let drop = null, trial;
      if (idx < 0) { let worst = null;
        cur.forEach((a, i) => { const t = clone(g); t.affixes[i] = { id: best.d.id }; const e = withGear(sl.id, t, evalBuild); const s = scoreOf(pctCh(base.dmg, e.dmg), pctCh(base.ehp, e.ehp)); if (!worst || s > worst.s) worst = { i, s, e }; });
        idx = worst.i; drop = cur[idx]; trial = worst.e; }
      else { const t = clone(g); t.affixes[idx] = { id: best.d.id }; trial = withGear(sl.id, t, evalBuild); }
      const dD = pctCh(base.dmg, trial.dmg), dE = pctCh(base.ehp, trial.ehp); const s = scoreOf(dD, dE);
      if (s <= 0.05) { rows.push({ sl, it, kind: 'done', s: 0 }); continue; }
      rows.push({ sl, it, kind: 'swap', add: best.d, drop: drop && affixDef(drop.id), idx, dD, dE, s });
    }
    rows.sort((a, b) => b.s - a.s);
    return { rows, key: adviceKey(), focus: focusOf(), noSkill: base.dmg == null };
  }
  const adviceKey = () => JSON.stringify([S.cls, S.ver, S.gear, S.alloc, S.mech, S.shard, S.focus, (S.df || {}).diff, (S.df || {}).pit, (S.df || {}).mon]);
  function adviceHtml() {
    const stale = ADVICE && ADVICE.key !== adviceKey();
    const head = `<header><h3>What to upgrade next</h3><label class="cmp-focus">Build cares about <select id="advFocus">${Object.keys(FOCUS).map(k => `<option value="${k}" ${k === focusOf() ? 'selected' : ''}>${FOCUS[k][0]}</option>`).join('')}</select></label>
      <button class="btn${ADVICE && !stale ? ' ghost' : ''}" id="advRun">${ADVICE ? (stale ? 'Work it out again' : 'Refresh') : 'Work it out'}</button></header>`;
    if (!ADVICE) return `<section class="advice">${head}<p class="note">Ranks your gear slots by how much each one is holding the build back, and names the best single affix change for each.</p></section>`;
    const txt = d => d.t.replace('§', D4T.fmtNum(d.v));
    const row = (r, i) => {
      if (r.kind === 'empty') return `<li class="adv-row empty"><b>${esc(r.sl.name)}</b><span>Empty. Putting anything here is your biggest gain.</span><button class="btn ghost small" data-advgo="${r.sl.id}">Open</button></li>`;
      if (r.kind === 'unique') return `<li class="adv-row quiet"><b>${esc(r.sl.name)}</b><span>${esc(r.it.name)}: a unique, so its affixes are fixed.</span></li>`;
      if (r.kind === 'done') return `<li class="adv-row quiet"><b>${esc(r.sl.name)}</b><span>No single affix change helps here.</span></li>`;
      return `<li class="adv-row${i === 0 ? ' top' : ''}"><b>${esc(r.sl.name)}</b><span>${r.drop ? `Swap <i class="l">${esc(txt(r.drop))}</i> for <i class="g">${esc(txt(r.add))}</i>` : `Add <i class="g">${esc(txt(r.add))}</i> in the empty affix slot`}</span>
        <em>${[Math.abs(r.dD || 0) >= 0.05 ? sgn(r.dD) + ' damage' : '', Math.abs(r.dE || 0) >= 0.05 ? sgn(r.dE) + ' Effective Life' : ''].filter(Boolean).join(', ')}</em><button class="btn ghost small" data-advgo="${r.sl.id}">Open</button></li>`; };
    return `<section class="advice">${head}${stale ? '<p class="note warnc">The build has changed since this was worked out.</p>' : ''}
      <ol class="adv-list">${ADVICE.rows.map(row).join('')}</ol>
      <p class="note">Each line assumes a top roll of the new affix at your current item quality.${ADVICE.noSkill ? ' No skill is picked on Damage Theory Craft, so only Effective Life is scored.' : ''} Effective Life is measured against the monsters picked on Defense Theory Craft.</p></section>`;
  }
  function wireAdvice(rerender) {
    const r = $('#advRun'); if (r) r.onclick = () => { r.disabled = true; r.textContent = 'Working...'; setTimeout(() => { ADVICE = upgradeAdvice(); rerender(); }, 30); };
    const f = $('#advFocus'); if (f) f.onchange = () => { S.focus = f.value; commit(); rerender(); };
    $$('[data-advgo]').forEach(b => b.onclick = () => { gearSel = b.dataset.advgo; showTab('gear'); window.scrollTo(0, 0); });
  }

  // ---------- can I do this: a traffic light for the difficulty and monsters picked on the Defense page ----------
  function readiness(R) {
    const all = [].concat(...R.cards.map(c => c.attacks.map(r => ({ c, r })))).concat(...R.affRows.map(a => a.hits.map(x => ({ c: { m: { name: a.a.name + ' affix' } }, r: Object.assign({ a: { name: x.h.type + ' hit' } }, x) }))));
    if (!all.length) return null;
    const shots = all.filter(x => x.r.hit >= R.life), heavy = all.filter(x => x.r.hit < R.life && x.r.hit >= R.life * 0.5);
    const worst = all.slice().sort((a, b) => b.r.hit - a.r.hit)[0];
    const lvl = shots.length ? 'red' : heavy.length ? 'amber' : 'green';
    const need = Math.floor(worst.r.hit) + 1;
    const where = R.SC.worlds.find(w => w.tier === R.tierNo); const place = +R.T.pit > 0 ? `Pit ${R.tierNo}` : where ? where.name : `Tier ${R.tierNo}`;
    const name = x => `${x.c.m.name}'s ${x.r.a.name}`;
    const msg = lvl === 'red' ? `Not yet. ${shots.length} attack${shots.length > 1 ? 's' : ''} would kill you in one hit, starting with ${name(shots.sort((a, b) => b.r.hit - a.r.hit)[0])}. You need ${D4T.fmtNum(need)} Life at your current defenses, or more Armor and Resistance, to live through the biggest.`
      : lvl === 'amber' ? `Risky. Nothing kills you in one hit, but ${heavy.length} attack${heavy.length > 1 ? 's take' : ' takes'} more than half your Life, such as ${name(heavy.sort((a, b) => b.r.hit - a.r.hit)[0])}. Two in a row and you are dead.`
      : `Ready. The biggest hit, ${name(worst)}, takes ${D4T.fmtNum(Math.round(worst.r.hit / R.life * 100))}% of your Life.`;
    return { lvl, place, msg, best: R.whatIf[0] };
  }
  function readinessHtml(R) {
    const x = readiness(R); if (!x) return '';
    return `<section class="ready ${x.lvl}" aria-live="polite"><span class="ready-light" aria-hidden="true"></span><div><h3>Can I do ${esc(x.place)}?</h3><p>${esc(x.msg)}</p>
      ${x.lvl !== 'green' && x.best ? `<p class="ready-tip">Fastest fix: one more top-roll <b>${esc(x.best.n)}</b> affix adds ${sgn(x.best.gain * 100)} Effective Life.</p>` : ''}</div></section>`;
  }

  window.__D4 = { powerText, theory, statModel, mechLines, proseStats, evalBuild, upgradeAdvice, state: () => S };

  // ---------- build library: ready-made builds with their variants, loaded with one click ----------
  const lnorm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const lkey = s => lnorm(String(s || '').replace(/\b(aspect|of|the)\b/gi, ''));
  const LIB_ALIAS = { 'all-damage-multipler': 'all-damage-multiplier', 'skill-rank-all': 'ranks-to-all-skills', 'ranks-to-imbuements-skills': 'ranks-to-imbuement-skills' };
  const libUrl = b => b.url || `https://${window.D4LIB.source}/diablo-4/${b.id}`; const libSrc = b => b.src || window.D4LIB.source;
  // turn one variant of a library build (names and slugs) into a planner build, and list what could not be matched
  function libResolve(b, vi) {
    const D = window.D4DATA[S.ver] || data(); const C = D.classes[b.cls]; const G = D.gear; const V = b.variants[vi] || b.variants[0]; const miss = [];
    const st = blank(b.cls); st.ver = S.ver; st.name = `${b.name} ${b.cls}${b.variants.length > 1 ? ', ' + V.t : ''}`;
    // skills: active skills first, then upgrades and passives
    const byName = {}; Object.values(C.powers).forEach(p => { if (p.name) byName[lnorm(p.name)] = p; });
    const taken = new Set(); const later = [];
    (V.sk || []).forEach(([n, r]) => { const p = byName[lnorm(n)]; const nd = p && C.nodes.find(x => x.kind === 'unlock' && x.power === p.id);
      if (nd) { st.alloc[nd.i] = Math.max(1, Math.min(r, nd.max || r)); taken.add(p.id); } else later.push([n, r]); });
    const modName = x => lnorm((((C.powers[x.power] || {}).mods || []).find(m => m.id === x.mod) || {}).name);
    const modFull = x => lnorm((C.powers[x.power] || {}).name) + modName(x);
    later.forEach(([n, r]) => { const k = lnorm(n); const nd = C.nodes.find(x => x.kind === 'mod' && !st.alloc[x.i] && modFull(x) === k) || C.nodes.find(x => x.kind === 'mod' && taken.has(x.power) && !st.alloc[x.i] && modName(x) === k) || C.nodes.find(x => x.kind === 'mod' && !st.alloc[x.i] && modName(x) === k);
      if (nd) st.alloc[nd.i] = Math.max(1, Math.min(r, nd.max || r)); else miss.push('Skill tree: ' + n.replace(/-/g, ' ')); });
    st.hotbar = (V.bar || []).map(n => (byName[lnorm(n)] || {}).id).filter(id => id && taken.has(id));
    // gear
    const okCls = x => !x.cls || !x.cls.length || (Array.isArray(x.cls) ? x.cls.includes(b.cls) : x.cls === b.cls);
    const tkey = t => lnorm(String(t).replace(/§|%|\+|\[x\]/g, '').replace(/^x/, ''));
    const extra = [], sockNotes = [];
    (V.gear || []).forEach(([to, title0, kind0, stats, tempers, sockets, transfig, mythic]) => {
      if (!title0) return; const title = String(title0).replace(/\s*\(.*\)\s*$/, '');
      if (sockets && sockets.length) sockNotes.push(`${to.replace(/^x:/, '')}: ${sockets.map(x => x.replace(/-/g, ' ')).join(', ')}`);
      if (to.startsWith('x:') || st.gear[to]) { extra.push(`${to.replace(/^x:/, '')}: ${title}`); return; }
      const u = kind0 !== 'a' ? D.uniques.filter(x => x.kind !== 'charm' && lnorm(x.name) === lnorm(title)) : []; const uq = u.find(x => (x.classes || []).includes(b.cls)) || u[0];
      const as = !uq && (D.aspects.find(x => lkey(x.name) === lkey(title) && (x.classes || []).includes(b.cls)) || D.aspects.find(x => lkey(x.name) === lkey(title)));
      if (!uq && !as) { miss.push(`${to}: ${title}`); return; }
      const g = st.gear[to] = { item: { t: uq ? 'u' : 'aspect', id: (uq || as).id }, affixes: [], tempers: [], gems: [] }; const kind = slotKind(to);
      if (uq && mythic) g.mythic = true;
      (stats || []).slice(0, N_AFF - (uq ? Math.min(N_AFF, (uq.affixes || []).length) : 0)).forEach(raw => { const ga = raw.endsWith('!'); let s = raw.replace(/!$/, '').replace(/-s04-corestat$/, '').replace(/^\d+-\d+-/, ''); s = LIB_ALIAS[s] || s;
        if (s === 'primary-core-stat') s = MAINSTAT[b.cls][0].toLowerCase();
        const want = lnorm(s.replace(/^ranks-to-/, 'to-')); const pool = G.affixes.filter(a => a.slots.includes(kind) && okCls(a) && !g.affixes.some(z => z.id === a.id));
        const d = pool.find(a => tkey(a.t) === want) || pool.filter(a => tkey(a.t).includes(want)).sort((x, y) => x.t.length - y.t.length)[0];
        if (d) g.affixes.push(ga ? { id: d.id, ga: true } : { id: d.id }); else miss.push(`${to} affix: ${s.replace(/-/g, ' ')}`); });
      (tempers || []).slice(0, N_TEMP).forEach(slug => { const parts = slug.split('-'); let hit = null;
        for (let k = 1; k < parts.length && !hit; k++) { const want = lnorm(parts.slice(k).join('')); if (want.length < 4) break;
          for (const m of G.tempers) { if (!m.slots.includes(kind) || (m.cls && m.cls.length && m.cls !== b.cls)) continue; const o = m.opts.find(x => tkey(x.t) === want); if (o && (!hit || (m.tier || 0) > (hit.m.tier || 0))) hit = { m, o }; } }
        if (hit) g.tempers.push({ rid: hit.m.id, oid: hit.o.id }); else miss.push(`${to} temper: ${slug.replace(/-/g, ' ')}`); });
      (sockets || []).forEach(sl => { const type = sl.charAt(0).toUpperCase() + sl.slice(1); const gm = (G.gems || []).filter(x => x.type === type).sort((x, y) => y.grade - x.grade)[0]; if (gm) g.gems.push({ type: gm.type, grade: gm.grade }); });
    });
    // class mechanic
    if (b.cls === 'Warlock') { const sh = V.shard && (D.shards || []).find(s => lnorm(s.power.name) === lnorm(V.shard[0])); if (sh) { const fr = sh.frags.find(f => lnorm(f.name) === lnorm(V.shard[1])); st.shard = { id: sh.id, frag: fr ? fr.id : '' }; } else if (V.shard) miss.push('Soul Shard: ' + V.shard[0].replace(/-/g, ' ')); }
    else { const M = (D.mechanics || {})[b.cls]; const picks = {}, up = {}; const used = new Set();
      const names = (V.mech || []).map(n => [n, 0]).concat((V.book || []).map(x => [x[0], x[1]]));
      names.forEach(([n, upg]) => { let done = false; if (M) M.groups.forEach((g, gi) => { if (done || (picks[gi] || []).length >= g.pick + (M.bond ? 0 : 0)) return;
          const o = g.options.find(x => (lnorm(x.name) === lnorm(n) || lnorm(x.name).includes(lnorm(n))) && !used.has(M.distinct ? x.id.split('_')[0] : gi + ':' + x.id)); if (!o) return;
          (picks[gi] = picks[gi] || []).push(o.id); used.add(M.distinct ? o.id.split('_')[0] : gi + ':' + o.id); done = true;
          if (g.book && o.upgrades) up[o.id] = (o.upgrades[Math.max(0, (upg || 1) - 1)] || o.upgrades[0]).id; }); if (!done) miss.push('Class mechanic: ' + n); });
      if (Object.keys(picks).length) st.mech = { [b.cls]: { picks, bond: '', up } }; }
    // Paragon, already laid out by the converter
    const P = V.para;
    if (P && P.b) { const alloc = {}; Object.keys(P.a).forEach(id => P.a[id].split(' ').filter(Boolean).forEach(k => { alloc[id + ':' + k] = 1; }));
      st.paragon = { boards: P.b.map(x => x.length > 4 ? { id: x[0], ox: x[1], oy: x[2], r: x[3], at: { gx: x[4], gy: x[5], dx: x[6], dy: x[7] } } : { id: x[0], ox: x[1], oy: x[2], r: x[3] }), alloc, glyphs: Object.assign({}, P.g), glyphLv: Object.assign({}, P.lv), cap: Math.max(300, Object.keys(alloc).length), base: { Strength: 0, Intelligence: 0, Willpower: 0, Dexterity: 0 } }; }
    else if (P && P.note) miss.push('Paragon: ' + P.note);
    // mercenaries
    const mer = n => n && (D.mercs || []).find(m => lnorm(n).startsWith(lnorm(m.name))); const m0 = mer((V.mercs || [])[0]), m1 = mer((V.mercs || [])[1]);
    if (m0) st.merc = { main: m0.id, sup: m1 && m1.id !== m0.id ? m1.id : '', supSkill: '', opp: 'avail', oppSkill: '', nodes: {} };
    st.notes = { about: `${b.name} ${b.cls}${b.tier ? `, ${b.tier} tier in ${window.D4LIB.season}` : ''}. Build by ${b.author} on ${libSrc(b)}, guide updated ${b.updated}.${b.variants.length > 1 ? ` Variant: ${V.t}.` : ''}\n${libUrl(b)}`
        + (extra.length ? `\n\nOther weapon slots (not in the planner yet):\n${extra.join('\n')}` : '')
        + (V.seal || (V.charms || []).length ? `\n\nSeal: ${V.seal || 'not named'}\nCharms: ${(V.charms || []).join(', ') || 'not named'}` : '')
        + (sockNotes.length ? `\n\nGems and runes:\n${sockNotes.join('\n')}` : '')
        + (miss.length ? `\n\nNot matched to this game version, set these by hand:\n${miss.join('\n')}` : ''),
      strengths: '', weaknesses: '', rotation: '', glyphs: (V.paraList || []).length ? 'Paragon boards in order (set these by hand):\n' + V.paraList.join('\n') : '', video: '', filter: '', tags: [] };
    return { st, miss, extra };
  }
  let libCls = '', libArm = '', libTier = ''; const libVar = {};
  function renderLibrary() {
    const box = $('#panel-library'); const L = window.D4LIB; if (!box) return;
    if (!L) { box.innerHTML = '<div class="tc"><div class="tc-empty"><h2>Build library</h2><p>The library file is missing.</p></div></div>'; return; }
    const classes = Object.keys(window.D4DATA[S.ver].classes).filter(c => L.builds.some(b => b.cls === c)); const list = L.builds.filter(b => (!libCls || b.cls === libCls) && (!libTier || b.tier === libTier));
    const GS = L.guides || { rows: [] }; const guides = GS.rows.filter(r => (!libCls || r[2] === libCls) && (!libTier || r[0] === libTier));
    const dirty = Object.keys(S.gear || {}).length || Object.keys(S.alloc || {}).length;
    const crest = c => `<span class="lib-crest"><svg viewBox="-2 -2 36 36" aria-hidden="true">${D4ART.crest(c)}</svg></span>`;
    const card = b => { const vi = Math.min(libVar[b.id] || 0, b.variants.length - 1); const V = b.variants[vi]; const key = [...new Set(V.gear.filter(g => g[2] !== 'a').map(g => g[1]))].slice(0, 5);
      return `<article class="lib-card" data-cls="${esc(b.cls)}"><header>${crest(b.cls)}<div><h3>${esc(b.name)}</h3><p>${esc(b.cls)}</p></div><span class="lib-tier t-${esc(b.tier)}" title="${esc(b.tier)} tier on ${esc(libSrc(b))}">${esc(b.tier || '-')}</span></header>
        ${b.variants.length > 1 ? `<label class="lib-var">Variant <select data-libvar="${esc(b.id)}">${b.variants.map((v, i) => `<option value="${i}" ${i === vi ? 'selected' : ''}>${esc(v.t)}</option>`).join('')}</select></label>` : ''}
        <p class="lib-skills">${V.bar.map(esc).join(', ')}</p>
        ${key.length ? `<p class="lib-items"><span>Built around</span> ${key.map(esc).join(', ')}</p>` : ''}
        <footer><button class="btn" data-lib="${esc(b.id)}">${libArm === b.id ? 'Replace my current build' : 'Load into planner'}</button>
          <a class="lib-src" href="${libUrl(b)}" target="_blank" rel="noopener">Guide by ${esc(b.author)}${b.src ? ', ' + esc(b.src) : ''}</a></footer></article>`; };
    const gcard = r => `<article class="lib-card guide" data-cls="${esc(r[2])}"><header>${crest(r[2])}<div><h3>${esc(r[1])}</h3><p>${esc(r[2])}</p></div><span class="lib-tier t-${esc(r[0])}" title="${esc(r[0])} tier on ${esc(GS.source)}">${esc(r[0])}</span></header>
        <footer><a class="btn ghost" href="https://mobalytics.gg/diablo-4/${esc(r[4])}" target="_blank" rel="noopener">Open the guide</a><span class="lib-src">By ${esc(r[3])}, ${esc(GS.source)}</span></footer></article>`;
    const nVar = L.builds.reduce((n, b) => n + b.variants.length, 0);
    box.innerHTML = `<div class="tc lib">
      <header class="tc-head"><div><h2>Build library</h2><p>${L.builds.length} ${esc(L.season)} endgame builds with ${nVar} variants, across S, A, B and C tier. Pick a variant and load it: skills, gear, tempers, class mechanic, Paragon boards with glyphs, and mercenaries are filled in for you to tune. Each build is credited to its author, with a link to the full guide.</p></div></header>
      <div class="lib-filter" role="group" aria-label="Class"><button class="chip" data-libcls="" aria-pressed="${!libCls}">All classes</button>${classes.map(c => `<button class="chip" data-libcls="${esc(c)}" aria-pressed="${libCls === c}">${esc(c)}</button>`).join('')}</div>
      <div class="lib-filter" role="group" aria-label="Tier"><button class="chip" data-libtier="" aria-pressed="${!libTier}">All tiers</button>${['S', 'A', 'B', 'C'].map(t => `<button class="chip" data-libtier="${t}" aria-pressed="${libTier === t}">${t} tier</button>`).join('')}</div>
      ${list.length ? `<div class="lib-grid">${list.map(card).join('')}</div>` : ''}
      ${guides.length ? `<h3 class="lib-h">Guide links only <small>${guides.length} builds whose data could not be read</small></h3><div class="lib-grid">${guides.map(gcard).join('')}</div>` : ''}
      ${!list.length && !guides.length ? '<p class="note">No builds match those filters.</p>' : ''}
      <p class="note">Builds and tiers are from ${esc(L.source)} as read on ${esc(L.checked)}; the few marked d4guides.gg are builds Mobalytics does not list, with that site's tier and without Paragon node paths. Charms, the seal, runes and extra weapon slots are listed on the Notes tab after loading, with anything that did not match this game version.</p></div>`;
    $$('#panel-library [data-libtier]').forEach(x => x.onclick = () => { libTier = x.dataset.libtier; libArm = ''; renderLibrary(); });
    $$('#panel-library [data-libcls]').forEach(x => x.onclick = () => { libCls = x.dataset.libcls; libArm = ''; renderLibrary(); });
    $$('#panel-library [data-libvar]').forEach(x => x.onchange = () => { libVar[x.dataset.libvar] = +x.value; libArm = ''; renderLibrary(); });
    $$('#panel-library [data-lib]').forEach(x => x.onclick = () => { const b = L.builds.find(z => z.id === x.dataset.lib);
      if (dirty && libArm !== b.id) { libArm = b.id; renderLibrary(); return; }
      libArm = ''; const r = libResolve(b, libVar[b.id] || 0); useBuild(r.st, `${b.name} loaded${r.miss.length ? `, ${r.miss.length} thing${r.miss.length > 1 ? 's' : ''} to set by hand (see Notes)` : ''}`); tab = 'sheet'; showSite('planner'); });
  }
  window.__D4LIB = { libResolve };


  // ---------- read an item from an in-game screenshot ----------
  let SCAN = null;   // { state: 'reading' | 'done' | 'error', msg, R, M, slot }
  let tessP = null;
  function ocrWorker() {
    return tessP || (tessP = new Promise((ok, bad) => { if (window.Tesseract) return ok();
      const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'; s.onload = () => ok(); s.onerror = () => bad(new Error('offline')); document.head.appendChild(s); })
      .then(async () => { const w = await window.Tesseract.createWorker('eng'); await w.setParameters({ tessedit_pageseg_mode: '6' }); return w; }).catch(e => { tessP = null; throw e; }));
  }
  // read the text out of a screenshot: tooltip text is light on dark and small, so enlarge it and flip it to dark on light first
  async function ocrText(blob) {
    const url = URL.createObjectURL(blob); const img = await new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => bad(new Error('image')); i.src = url; });
    const k = Math.max(1, Math.min(3, 2600 / img.width)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.filter = 'grayscale(1) invert(1)'; x.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    const w = await ocrWorker(); const out = await w.recognize(c); return out.data.text;
  }
  async function scanImage(blob) {
    SCAN = { state: 'reading', msg: 'Reading the screenshot. The first one takes a few seconds while the text reader loads.' }; if (tab !== 'gear') showTab('gear'); else renderGear();
    try {
      scanText(await ocrText(blob));
    } catch (e) {
      SCAN = { state: 'error', msg: e && e.message === 'offline' ? 'The text reader could not be downloaded. It needs an internet connection the first time.' : e && e.message === 'image' ? 'That file is not an image the browser can open.' : 'The screenshot could not be read. Try a tighter crop of just the item tooltip.' }; renderGear();
    }
  }
  function scanText(text) {
    const R = window.D4SCAN.read(text); const D = { gear: GD(), uniques: data().uniques, aspects: data().aspects };
    const M = window.D4SCAN.match(R, D, S.cls, { maxAff: N_AFF, maxTemp: N_TEMP });
    if (!M.slot) { SCAN = { state: 'error', msg: M.notes[0] || 'No item was found in that screenshot.' }; renderGear(); return; }
    const slot = M.slot === 'ring' ? (slotKind(gearSel) === 'ring' ? gearSel : 'ring1') : M.slot;
    SCAN = { state: 'done', R, M, slot }; gearSel = slot; gemSel = -1; if (tab !== 'gear') showTab('gear'); else renderGear();
  }
  function scanGear() { return gearFromMatch(SCAN.M); }
  function gearFromMatch(M) { const g = { item: M.item, affixes: M.affixes.map(a => Object.assign({ id: a.id, val: a.val }, a.ga ? { ga: true } : {})), tempers: M.tempers.map(t => ({ rid: t.rid, oid: t.oid })), q: M.q || 0, gems: [] };
    const ci = M.affixes.findIndex(a => a.cap); if (ci >= 0) g.cap = ci; if (M.mythic) g.mythic = true; if (M.wtype) g.wtype = M.wtype; return g; }
  function scanHtml() {
    if (!SCAN) return `<div class="pastebox" tabindex="0" data-paste="scan"><b>Paste an item here</b><span>Click this box, then press Ctrl+V to paste a snip of an item tooltip. You can also drop an image on it. It reads the item so you can equip it or compare it with what you wear.</span></div>
      <div class="pastebox" tabindex="0" data-paste="bag"><b>Paste a bag of drops here</b><span>Click this box and paste one item after another, or drop several images. Each one is ranked against your gear.</span></div>
      <div class="scan-start"><button class="btn ghost" id="scanPick">Read an item screenshot</button><input type="file" id="scanFile" accept="image/*" hidden><small>Or copy a screenshot of an item tooltip in the game and press Ctrl+V on this page.</small><button class="btn ghost" id="bagPick">Check a bag of drops</button><input type="file" id="bagFile" accept="image/*" multiple hidden><small>Pick several item screenshots at once to rank them.</small></div>`;
    if (SCAN.state === 'reading') return `<section class="scan busy" aria-live="polite"><p>${esc(SCAN.msg)}</p></section>`;
    if (SCAN.state === 'error') return `<section class="scan err" aria-live="polite"><p>${esc(SCAN.msg)}</p><div class="cmp-act"><button class="btn ghost" id="scanDrop">Close</button></div></section>`;
    const { M, R, slot } = SCAN; const sl = SLOTS.find(s => s.id === slot); const cur = S.gear[slot]; const curIt = cur && findItem(cur.item); const scanned = M.item && findItem(M.item);
    const legend = scanned && !scanned.kind && curIt && !curIt.kind;
    return `<section class="scan" aria-live="polite"><header><h3>${esc(M.itemName || 'Item not recognised')}</h3><span>${esc(R.rarity === 'Unique' ? (M.mythic ? 'Mythic unique' : 'Unique') : 'Legendary')} for ${esc(sl.name)}${M.q ? `, quality ${M.q}` : ''}</span></header>
      ${M.affixes.length ? `<ul class="scan-list">${M.affixes.map(a => `<li>${esc(a.label)}${a.ga ? ' <b>greater affix</b>' : ''}${a.inSlot ? '' : ' <em>not normally on this slot</em>'}</li>`).join('')}</ul>` : R.rarity === 'Unique' ? '<p class="note">Unique items keep their fixed affixes, so only the item and its quality are read.</p>' : ''}
      ${M.tempers.length ? `<p class="scan-sub">Temper: ${M.tempers.map(t => esc(t.label)).join(', ')}</p>` : ''}
      ${M.unplaced.length ? `<p class="cmp-warn">Read but not placed, add by hand if you need them: ${M.unplaced.map(esc).join('; ')}</p>` : ''}
      ${M.notes.map(n => `<p class="cmp-warn">${esc(n)}</p>`).join('')}
      <div class="cmp-act">${curIt && M.item ? `<button class="btn" id="scanCmp">Compare with my ${esc(sl.name.toLowerCase())}</button>` : ''}<button class="btn${curIt && M.item ? ' ghost' : ''}" id="scanEquip" ${M.item ? '' : 'disabled'}>Equip in ${esc(sl.name)}</button><button class="btn ghost" id="scanDrop">Discard</button></div>
      ${curIt && M.item ? `<p class="note">${legend ? 'Compare keeps your aspect, temper, quality and gems and swaps in only this item\'s affixes, since you would put those on it yourself.' : 'Compare puts the whole item in and shows the difference against what you are wearing.'}</p>` : ''}</section>`;
  }
  // ---------- bag check: read a batch of item screenshots and rank them against what is equipped ----------
  let BAG = null;
  function judgeDrop(M) {
    const g = gearFromMatch(M); const it = findItem(g.item); const slots = M.slot === 'ring' ? ['ring1', 'ring2'] : [M.slot]; const base = evalBuild(); let best = null;
    for (const slot of slots) { const old = S.gear[slot]; const oldIt = old && findItem(old.item); let ng = g;
      if (it && !it.kind && oldIt && !oldIt.kind) { ng = clone(old); ng.affixes = g.affixes; ng.hor = null; delete ng.cap; if (g.cap != null) ng.cap = g.cap; }
      const V = verdictOf(base, withGear(slot, ng, evalBuild)); const score = scoreOf(V.dD, V.dE); if (!best || score > best.score) best = { slot, g: ng, V, score, empty: !oldIt }; }
    return best;
  }
  async function bagScan(files) {
    const list = [...files].filter(f => /^image\//.test(f.type)); if (!list.length) return; if (BAG && BAG.state === 'reading') { toast('Still reading the last batch. Paste again in a moment.'); return; } BAG = { state: 'reading', done: 0, total: list.length, rows: BAG ? BAG.rows : [] }; if (tab !== 'gear') showTab('gear'); else renderGear();
    const D = { gear: GD(), uniques: data().uniques, aspects: data().aspects };
    for (const f of list) { let row = { file: f.name };
      try { const R = window.D4SCAN.read(await ocrText(f)); const M = window.D4SCAN.match(R, D, S.cls, { maxAff: N_AFF, maxTemp: N_TEMP });
        if (!M.slot || !M.item) row.err = M.notes[0] || 'No item found in this screenshot'; else Object.assign(row, { name: M.itemName, ga: M.affixes.filter(a => a.ga).length }, judgeDrop(M)); }
      catch (e) { row.err = e && e.message === 'offline' ? 'The text reader could not be downloaded' : 'Could not be read'; }
      BAG.rows.push(row); BAG.done++; if (tab === 'gear') renderGear(); }
    BAG.state = 'done'; BAG.rows.sort((a, b) => (b.score == null ? -1e9 : b.score) - (a.score == null ? -1e9 : a.score)); if (tab === 'gear') renderGear();
  }
  function bagHtml() {
    if (!BAG) return '';
    const more = '<div class="pastebox" tabindex="0" data-paste="bag"><b>Paste the next drop here</b><span>Click, then Ctrl+V. It is added to this list.</span></div>';
    const rows = BAG.rows.map((r, i) => r.err ? `<tr><th>${esc(r.file)}</th><td colspan="4" class="cmp-warn">${esc(r.err)}</td></tr>` : `<tr><th>${esc(r.name)}${r.ga ? ` <small>${r.ga} greater</small>` : ''}</th><td>${esc((SLOTS.find(x => x.id === r.slot) || {}).name || r.slot)}</td><td><b class="verdict ${r.V.cls}">${r.empty ? 'Empty slot' : esc(r.V.tag)}</b></td><td>${r.V.dD == null ? '' : sgn(r.V.dD) + ' damage'}${r.V.dE == null ? '' : ', ' + sgn(r.V.dE) + ' Effective Life'}${r.V.warn.length ? `<br><small class="cmp-warn">${esc(r.V.warn[0])}</small>` : ''}</td><td><button class="btn ghost small" data-bageq="${i}">Equip</button></td></tr>`).join('');
    return `<section class="scan bag" aria-live="polite"><header><h3>Bag check</h3><span>${BAG.state === 'reading' ? `Reading ${BAG.done + 1} of ${BAG.total}` : `${BAG.rows.length} read, best first`}</span></header>
      ${rows ? `<table class="tc-table"><thead><tr><th>Item</th><th>Slot</th><th>Verdict</th><th>Against what you wear</th><th></th></tr></thead><tbody>${rows}</tbody></table>` : ''}
      <p class="note">Each item is judged on its own against your current gear, using the focus you set for comparisons. Legendaries are judged on their affixes only.</p>
      ${BAG.state === 'done' ? more : ''}<div class="cmp-act"><button class="btn ghost" id="bagClear">Close bag check</button></div></section>`;
  }
  document.addEventListener('click', e => { const t = e.target.closest ? e.target : null; if (!t) return;
    if (t.closest('#bagPick')) { const f = $('#bagFile'); if (f) f.click(); }
    else if (t.closest('#bagClear')) { BAG = null; renderGear(); }
    else if (t.closest('[data-bageq]') && BAG) { const r = BAG.rows[+t.closest('[data-bageq]').dataset.bageq]; if (r && r.g) { S.gear[r.slot] = r.g; BAG.rows = BAG.rows.filter(x => x !== r); commit(); renderGear(); toast('Equipped ' + r.name); } }
    else if (t.closest('#sheetChkPick')) { const f = $('#sheetChkFile'); if (f) f.click(); }
    else if (t.closest('#sheetChkClear')) { SHEETCHK = null; renderSheet(); }
    else if (t.closest('#cardBtn')) buildCard(); });
  document.addEventListener('change', e => { const t = e.target; if (!t || !t.files) return;
    if (t.id === 'bagFile' && t.files.length) bagScan(t.files); else if (t.id === 'sheetChkFile' && t.files[0]) sheetCheck(t.files[0]); });
  // ---------- character sheet check: read the in-game stats screen and line it up with the planner ----------
  let SHEETCHK = null;
  async function sheetCheck(blob, typed) {
    SHEETCHK = { state: 'reading' }; renderSheet();
    try { const text = (typed || await ocrText(blob)).replace(/[|]/g, ' '); const M = statModel(); const Dd = defense(); const rows = []; const seen = new Set();
      const grab = label => { const m = text.match(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+') + '[^\\d\\n]{0,14}([\\d][\\d,]*(?:\\.\\d+)?)', 'i')); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
      const push = (label, mine, pct) => { if (seen.has(label)) return; const g = grab(label); if (g == null) return; seen.add(label); rows.push({ label, game: g, mine, pct }); };
      if (Dd) { push('Maximum Life', Dd.life); push('Armor', Dd.armor); }
      statDefs().forEach(d => { const e = M[d.id]; if (!e) return; push(d.l.replace(/ Bonus.*$/, ''), e.v + (e.x || 0), d.u === PCT); });
      SHEETCHK = { state: 'done', rows };
    } catch (e) { SHEETCHK = { state: 'error', msg: e && e.message === 'offline' ? 'The text reader could not be downloaded. It needs an internet connection the first time.' : 'The screenshot could not be read.' }; }
    if (tab === 'sheet') renderSheet();
  }
  function sheetChkHtml() {
    const start = '<div class="pastebox" tabindex="0" data-paste="sheet"><b>Paste your stats screen here</b><span>Click this box, then press Ctrl+V to paste a snip of your in-game stats, or drop an image on it.</span></div><div class="scan-start"><button class="btn ghost" id="sheetChkPick">Check against a character screenshot</button><input type="file" id="sheetChkFile" accept="image/*" hidden><small>Open your stats in the game (Character, then Stats), take a screenshot and pick it here.</small></div>';
    if (!SHEETCHK) return start;
    if (SHEETCHK.state === 'reading') return '<section class="scan busy" aria-live="polite"><p>Reading the screenshot. The first one takes a few seconds while the text reader loads.</p></section>';
    if (SHEETCHK.state === 'error') return `<section class="scan err"><p>${esc(SHEETCHK.msg)}</p><div class="cmp-act"><button class="btn ghost" id="sheetChkClear">Close</button></div></section>`;
    const f = v => D4T.fmtNum(Math.round(v * 10) / 10); const R = SHEETCHK.rows;
    return `<section class="scan" aria-live="polite"><header><h3>Planner against the game</h3><span>${R.length} stats read</span></header>
      ${R.length ? `<table class="tc-table"><thead><tr><th>Stat</th><th>In game</th><th>Planner</th><th>Difference</th></tr></thead><tbody>${R.map(r => { const d = r.game - r.mine; const ok = Math.abs(d) <= Math.max(0.6, Math.abs(r.game) * 0.01); return `<tr><th>${esc(r.label)}</th><td>${f(r.game)}${r.pct ? '%' : ''}</td><td>${f(r.mine)}${r.pct ? '%' : ''}</td><td><b class="verdict ${ok ? 'up' : 'down'}">${ok ? 'Matches' : (d > 0 ? 'Game is ' + f(d) + ' higher' : 'Game is ' + f(-d) + ' lower')}</b></td></tr>`; }).join('')}</tbody></table>` : '<p class="cmp-warn">No stats could be read. Use a screenshot of the full stats list.</p>'}
      <p class="note">A gap usually means something in the game is not in the planner yet (a gem, a temper, an elixir or shrine), or the planner is counting a buff that is not up.</p>
      <div class="cmp-act"><button class="btn ghost" id="sheetChkClear">Close</button></div></section>`;
  }
  // ---------- build card: a picture of the build to share ----------
  function buildCard() {
    const W = 1200, H = 675; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d1611'); g.addColorStop(1, '#090706'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const rg = x.createRadialGradient(W * 0.5, 0, 40, W * 0.5, 0, 700); rg.addColorStop(0, 'rgba(190,120,40,.28)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#8a6a36'; x.lineWidth = 3; x.strokeRect(14, 14, W - 28, H - 28); x.strokeStyle = 'rgba(138,106,54,.4)'; x.lineWidth = 1; x.strokeRect(24, 24, W - 48, H - 48);
    const fit = (t, max) => { t = String(t || ''); while (t.length > 3 && x.measureText(t).width > max) t = t.slice(0, -2); return t; };
    x.fillStyle = '#f0d9a0'; x.font = '600 50px Georgia, serif'; x.fillText(fit(S.name || 'Untitled build', W - 120), 56, 96);
    x.fillStyle = '#b9a98c'; x.font = '22px Georgia, serif'; x.fillText(`${S.cls}  |  ${S.ver === 'ptr' ? 'Season 16 PTR' : 'Season 15'}  |  ${data().meta ? 'build ' + data().meta.build : ''}`, 58, 132);
    const head = (t, px, py) => { x.fillStyle = '#d6a23a'; x.font = '600 22px Georgia, serif'; x.fillText(t, px, py); x.fillStyle = 'rgba(214,162,58,.45)'; x.fillRect(px, py + 8, 300, 1); };
    const C = cdata(); let y = 190; head('Skills', 56, y); x.font = '20px Georgia, serif'; x.fillStyle = '#e6dccb';
    (S.hotbar || []).filter(p => C.powers[p]).slice(0, 6).forEach((p, i) => x.fillText(fit(C.powers[p].name, 300), 56, y + 44 + i * 32));
    const mech = (PARA && PARA.summary && PARA.summary()) || null; let y2 = y + 44 + 6 * 32 + 26; head('Paragon', 56, y2); x.font = '20px Georgia, serif'; x.fillStyle = '#e6dccb';
    if (mech) { x.fillText(`${mech.points} of ${mech.cap} points`, 56, y2 + 42); (mech.boards || []).slice(0, 5).forEach((b, i) => x.fillText(fit(b.name + (b.glyph ? ': ' + b.glyph : ''), 300), 56, y2 + 74 + i * 28)); }
    head('Gear', 430, y); x.font = '19px Georgia, serif';
    SLOTS.forEach((sl, i) => { const it = findItem((S.gear[sl.id] || {}).item); x.fillStyle = '#9a8c76'; x.fillText(sl.name, 430, y + 44 + i * 34); x.fillStyle = it ? (it.kind ? '#f0a050' : '#e6dccb') : '#5c5348'; x.fillText(fit(it ? it.name : 'Empty', 250), 560, y + 44 + i * 34); });
    head('Numbers', 850, y); let E = null, Dd = null; try { E = evalBuild(); Dd = defense(); } catch (e) { /* card still draws */ }
    const nums = [['Maximum Life', Dd && Dd.life], ['Armor', Dd && Dd.armor], ['Effective Life', E && E.ehp]].concat(E && E.dmg ? [['Damage per second', E.dmg], ['Skill measured', E.skill]] : []);
    nums.forEach(([l, v], i) => { x.fillStyle = '#9a8c76'; x.font = '19px Georgia, serif'; x.fillText(l, 850, y + 44 + i * 62); x.fillStyle = '#f0d9a0'; x.font = '600 28px Georgia, serif'; x.fillText(v == null || v === '' ? 'Not set' : typeof v === 'number' ? D4T.fmtNum(Math.round(v)) : fit(v, 290), 850, y + 76 + i * 62); });
    x.fillStyle = '#7d705c'; x.font = '18px Georgia, serif'; x.textAlign = 'right'; x.fillText('Made with D4 Build Planner', W - 56, H - 44); x.textAlign = 'left';
    c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (S.name || 'build').replace(/[^\w -]+/g, '').trim().replace(/\s+/g, '_') + '_card.png'; a.click(); toast('Build card saved as a picture'); }, 'image/png');
  }
  window.__D4X = { buildCard, bagScan, sheetCheck, judgeDrop };
  function wireScan() {
    const pick = $('#scanPick'), file = $('#scanFile'); if (pick && file) { pick.onclick = () => file.click(); file.onchange = () => { if (file.files[0]) scanImage(file.files[0]); }; }
    const drop = $('#scanDrop'); if (drop) drop.onclick = () => { SCAN = null; renderGear(); };
    const eq = $('#scanEquip'); if (eq) eq.onclick = () => { const slot = SCAN.slot; if (S.cmp && S.cmp.slot === slot) delete S.cmp; S.gear[slot] = scanGear(); SCAN = null; commit(); renderGear(); toast('Item equipped from the screenshot'); };
    const cp = $('#scanCmp'); if (cp) cp.onclick = () => { const slot = SCAN.slot; const old = S.gear[slot]; const oldIt = findItem(old.item); const g = scanGear(); const it = findItem(g.item);
      S.cmp = { slot, base: clone(old) };
      if (it && !it.kind && oldIt && !oldIt.kind) { const ng = clone(old); ng.affixes = g.affixes; ng.hor = null; delete ng.cap; if (g.cap != null) ng.cap = g.cap; S.gear[slot] = ng; } else S.gear[slot] = g;
      SCAN = null; commit(); renderGear(); };
  }
  // pasted or dropped images go to the box that has focus; with no box picked, to whatever fits the page being viewed
  let PASTE_TO = '';
  function takeImages(files, where) { const list = [...files].filter(f => f && /^image\//.test(f.type)); if (!list.length) return false;
    const to = where || PASTE_TO || (tab === 'sheet' ? 'sheet' : BAG ? 'bag' : 'scan');
    if (to === 'sheet') sheetCheck(list[0]); else if (to === 'bag' || list.length > 1) bagScan(list); else scanImage(list[0]); return true; }
  document.addEventListener('focusin', e => { const b = e.target.closest && e.target.closest('[data-paste]'); PASTE_TO = b ? b.dataset.paste : ''; });
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-paste]'); if (b) { PASTE_TO = b.dataset.paste; $$('.pastebox.armed').forEach(x => x.classList.remove('armed')); b.classList.add('armed'); } });
  document.addEventListener('paste', e => { const items = (e.clipboardData && e.clipboardData.items) || []; const fs = []; for (const it of items) if (it.type && it.type.startsWith('image/')) { const f = it.getAsFile(); if (f) fs.push(f); } if (fs.length) { e.preventDefault(); takeImages(fs); } });
  document.addEventListener('dragover', e => { if (e.target.closest && e.target.closest('[data-paste]')) e.preventDefault(); });
  document.addEventListener('drop', e => { const b = e.target.closest && e.target.closest('[data-paste]'); if (!b || !e.dataTransfer) return; e.preventDefault(); takeImages(e.dataTransfer.files, b.dataset.paste); });
  window.__D4SCANUI = { scanText };


  // ---------- site navigation: the sidebar switches between the planner, the build library and reference pages ----------
  let site = 'planner';
  const NAV = [['Planner', [['planner', 'Build Planner'], ['library', 'Build Library']]], ['Reference', Object.keys(window.D4PAGES || {}).map(k => [k, window.D4PAGES[k].nav])]];
  function showSite(id) {
    if (id !== 'planner' && id !== 'library' && !(window.D4PAGES || {})[id]) id = 'planner';
    site = id; $('#app').dataset.site = id === 'planner' || id === 'library' ? id : 'page';
    $$('#rail [data-site]').forEach(b => b.setAttribute('aria-current', b.dataset.site === id ? 'page' : 'false'));
    const lib = $('#panel-library'), pg = $('#sitePage');
    if (id === 'planner') { pg.hidden = true; showTab(tab === 'library' ? 'sheet' : tab); }
    else { $$('.stage > .panel').forEach(p => { p.hidden = true; }); lib.hidden = id !== 'library'; pg.hidden = id === 'library'; if (id === 'library') renderLibrary(); else renderPage(id); $('.stage').scrollTop = 0; }
    try { sessionStorage.setItem('d4bp-site', id); } catch (e) { /* ignore */ }
  }
  // what changed between the live game files and the PTR files
  let DIFF_CACHE = null;
  function seasonDiff() {
    if (DIFF_CACHE) return DIFF_CACHE; const A = window.D4DATA.live, B = window.D4DATA.ptr; const rows = []; const detail = [];
    const names = (l, n) => l.length ? l.slice(0, n || 14).join(', ') + (l.length > (n || 14) ? `, and ${l.length - (n || 14)} more` : '') : 'None';
    const cmp = (label, a, b, key, same) => { const am = new Map(a.map(x => [key(x), x])), bm = new Map(b.map(x => [key(x), x])); const add = [], gone = [], chg = [];
      bm.forEach((x, k) => { const o = am.get(k); if (!o) add.push(x.name || k); else if (!same(o, x)) chg.push(x.name || k); }); am.forEach((x, k) => { if (!bm.has(k)) gone.push(x.name || k); });
      const u = l => [...new Set(l.filter(Boolean))].sort(); rows.push([label, String(u(add).length), String(u(gone).length), String(u(chg).length)]);
      if (add.length || gone.length || chg.length) detail.push([label, names(u(add)), names(u(gone)), names(u(chg), 30)]); };
    const txt = p => JSON.stringify([p.desc, p.sf, p.payloads, (p.mods || []).map(m => [m.name, m.desc])]);
    Object.keys(B.classes || {}).forEach(cl => { const a = Object.values(((A.classes || {})[cl] || {}).powers || {}), b = Object.values(B.classes[cl].powers || {}); cmp(cl + ' skills and passives', a, b, x => x.id, (o, n) => txt(o) === txt(n)); });
    cmp('Legendary aspects', A.aspects || [], B.aspects || [], x => x.id, (o, n) => o.desc === n.desc);
    cmp('Unique and mythic items', A.uniques || [], B.uniques || [], x => x.id, (o, n) => o.desc === n.desc && JSON.stringify(o.affixes) === JSON.stringify(n.affixes));
    return (DIFF_CACHE = [
      { h: 'What changed in the game files', p: `Worked out by comparing the planner's live data (${A.meta ? A.meta.build : 'Season 15'}) with its PTR data (${B.meta ? B.meta.build : 'Season 16 PTR'}). Changed means the text or the numbers behind it differ.`, table: { head: ['Area', 'New', 'Removed', 'Changed'], rows } },
      { h: 'The names', p: 'Switch the planner to Season 16 PTR to read any of these with its new numbers.', table: { head: ['Area', 'New', 'Removed', 'Changed'], rows: detail } }]);
  }
  function renderPage(id) {
    if (id === 'cube') { renderCubePlanner(); return; }
    if (id === 'bosses') { renderBosses(); return; }
    if (id === 'submit') { renderSubmit(); return; }
    const P0 = window.D4PAGES[id]; const P = id === 's16' && window.D4DATA.ptr && window.D4DATA.live ? Object.assign({}, window.D4PAGES[id], { sections: seasonDiff().concat(window.D4PAGES[id].sections) }) : id === 'recipes' ? Object.assign({}, P0, { sections: cubeSections() }) : id === 'secrets' && data().cube ? Object.assign({}, P0, { sections: P0.sections.map(s => s.h === 'Soul Splinters' ? Object.assign({}, s, { table: { head: ['Splinter', 'Effect by tier (Lesser / normal / Greater / Abyssal)', 'When socketed, by tier'], rows: data().cube.splinters.map(x => [x.name, x.effect, x.tiers.map(t => t.sock).join(' / ')]) } }) : s) }) : P0; const link = l => `<li><a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])}</a>${l[2] ? `<span>${esc(l[2])}</span>` : ''}</li>`;
    $('#sitePage').innerHTML = `<div class="tc ref"><header class="tc-head"><div><h2>${esc(P.title)}</h2><p>${esc(P.intro || '')}</p></div></header>
      ${P.sections.map(s => `<section class="ref-sec">${s.h ? `<h3>${esc(s.h)}</h3>` : ''}${s.p ? `<p>${esc(s.p)}</p>` : ''}
        ${s.links ? `<ul class="ref-links">${s.links.map(link).join('')}</ul>` : ''}
        ${s.table ? `<div class="ref-scroll"><table class="tc-table ref-table"><thead><tr>${s.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</section>`).join('')}
      ${P.source ? `<p class="note">Source: <a href="${esc(P.source[1])}" target="_blank" rel="noopener">${esc(P.source[0])}</a></p>` : ''}</div>`;
  }


  // ---------- Horadric Cube: recipe list and the affix planner, both built from the game files ----------
  function cubeSections() {
    const C = data().cube; if (!C) return [{ p: 'Cube data is missing for this game version.' }];
    const g = n => (C.groups.find(x => x.name === n) || { rows: [] }).rows; const uniq = rows => { const seen = new Set(); return rows.filter(r => { const k = r.join('|'); if (seen.has(k)) return false; seen.add(k); return true; }); };
    const nm = r => r.name || '';
    return [
      { h: 'Runewords', p: 'Put the runes in, in this order, with a white (common) base item of an allowed type. The result is a unique item; its stats are in the planner\'s item list.', table: { head: ['Runeword', 'Runes, in order', 'Allowed bases', 'Level'], rows: C.runewords.map(r => [r.name, r.runes.join(', '), r.bases.join(', '), String(r.level || '')]) } },
      { h: 'Rune upgrades', p: 'Only while Season 15 is running.', table: { head: ['Put in', 'Get'], rows: C.runes.map(r => [r.in, r.out]) } },
      { h: 'Hidden recipes', p: 'These do not show in the cube\'s recipe list.', table: { head: ['Put in', 'Get'], rows: g('Hidden recipes').map(r => [r.in, r.out || 'Not named in the game files (the recipe is called Wirt\'s Coin)']) } },
      { h: 'Soul Splinters', p: 'Five of one tier make one of the next: Lesser, normal, Greater, then Abyssal.', table: { head: ['Put in', 'Get'], rows: g('Soul Splinters').map(r => [r.in, r.out]) } },
      { h: 'Gear changes', p: 'The Tuning Prism picks which kind of affix is added, removed or changed. See the Horadric Cube Planner for what each prism can roll.', table: { head: ['Recipe', 'Put in with the item', 'What it does'], rows: uniq([].concat(g('Add an affix'), g('Remove an affix'), g('Change an affix'), g('Reroll affix values'), g('Transfigure'), g('Upgrade to legendary'), g('Other').filter(r => r.name)).map(r => [nm(r), r.in, r.desc || ''])) } },
      { h: 'Upgrade to unique or mythic', table: { head: ['Recipe', 'Put in'], rows: uniq(g('Upgrade to unique').map(r => ['Upgrade to unique', r.in.replace(/^a (item|Totem)/, 'a legendary item').replace(/^a /, 'a legendary ')]).concat(g('Upgrade a unique to mythic').map(r => [r.name || 'Upgrade a unique to mythic', r.in + (r.desc ? '. ' + r.desc : '')]))) } },
      { h: 'Gems', p: 'Five of a gem make one of the next tier up.', table: { head: ['Put in'], rows: g('Gems').map(r => [r.in]) } },
      { h: 'Boss summoning materials', p: 'Five of one boss\'s summoning material make one unique item from that boss\'s loot table.', table: { head: ['Put in', 'Get'], rows: g('Boss summoning materials').filter(r => r.in && /Mats$/.test(r.id)).map(r => [r.in, '1 unique from the loot table of ' + ({ Andariel: 'Andariel', Astaroth: 'Astaroth', Bartuc: 'Bartuc', BeastInTheIce: 'The Beast in the Ice', Butcher: 'The Butcher', Duriel: 'Duriel', Grigoire: 'Grigoire', Harbinger: 'the Harbinger of Hatred', LordZir: 'Lord Zir', Urivar: 'Urivar', Varshan: 'Varshan' }[r.id.replace(/^.*Collection_|Mats$/g, '')] || 'that boss')]) } },
      { h: 'Nightmare Sigils and goblin scrolls', table: { head: ['Put in', 'Get'], rows: [['5 Nightmare Sigils', '1 Nightmare Escalation Sigil']].concat(g('Boss summoning materials').filter(r => r.in && /ChaosCaches|GoblinScrolls/.test(r.id)).map(r => [r.in, r.out || 'Not named in the game files'])) } },
      { h: 'Undercity tributes', p: 'Five of the same tribute make one of the next rarity up. This stops at legendary, except Tribute of Armaments, which goes on to unique.', table: { head: ['Put in', 'Get'], rows: g('Undercity tributes').filter(r => r.in).map(r => [r.in, /Equipment/.test(r.id) ? 'The next rarity of Tribute of Armaments, up to unique' : 'The next rarity of that tribute, up to legendary']) } },
      { h: 'Charms and set pieces', p: `${g('Charms').length} charm recipes turn a unique item into its charm: the unique, three more items, 1 Enhanced Primordial Dust, 50 Raw Primordial Dust and 100 Infused Horadric Resin. ${g('Set pieces').length} set recipes reroll a set charm for 25 Raw Primordial Dust and 50 Infused Horadric Resin. Three items of the same type and rarity can also be combined into one new item.` },
      { h: 'Runes from the base game', table: { head: ['Recipe', 'Put in', 'Get'], rows: g('Runes from the base game').map(r => [r.name, r.in.replace(/5 rune, 5 (rune|item)/, '5 runes of one rarity and 5 of the next'), r.out]) } }
    ];
  }
  const PRISMS = [['Random', 'No prism', 'Any affix the item can roll'], ['Offensive', 'Aggressive Tuning Prism', ''], ['Defensive', 'Protector\'s Tuning Prism', ''], ['Utility', 'Pragmatic Tuning Prism', ''], ['Resource', 'Resourceful Tuning Prism', ''], ['Skill', 'Adept\'s Tuning Prism', ''], ['Resistance', 'Chromatic Tuning Prism', 'Add a Royal gem to force one element']];
  let cubeSt = { cls: '', slot: 'helm', prism: 'Offensive', have: [] };
  function renderCubePlanner() {
    const G = GD(); const st = cubeSt; if (!st.cls) st.cls = S.cls; const slots = G.slots || [];
    const okCls = x => !x.cls || !x.cls.length || x.cls.includes(st.cls);
    const all = G.affixes.filter(a => a.slots.includes(st.slot) && okCls(a)); st.have = st.have.filter(id => all.some(a => a.id === id));
    const onItem = all.filter(a => st.have.includes(a.id)); const taken = new Set(onItem.map(a => a.t));
    const pool = all.filter(a => (st.prism === 'Random' || a.cat === st.prism) && !taken.has(a.t)); const sum = pool.reduce((n, a) => n + (a.w || 0), 0);
    const pct = a => sum ? (a.w || 0) / sum * 100 : 0; const f1 = v => D4T.fmtNum(Math.round(v * 10) / 10);
    const row = a => `<tr><th><button class="cube-aff" data-cubeaff="${esc(a.id)}" aria-pressed="false" title="Mark as already on the item">${esc(a.t.replace('§', D4T.fmtNum(a.lo != null && a.lo < a.v ? a.lo : a.v) + (a.lo != null && a.lo < a.v ? ' to ' + D4T.fmtNum(a.v) : '')))}</button></th><td>${esc(a.cat)}</td><td>${a.w || 0}</td><td><b>${f1(pct(a))}%</b></td><td><span class="cube-bar"><i style="width:${Math.min(100, pct(a) * 2)}%"></i></span></td></tr>`;
    const P = PRISMS.find(p => p[0] === st.prism);
    $('#sitePage').innerHTML = `<div class="tc ref cube"><header class="tc-head"><div><h2>Horadric Cube Planner</h2><p>Pick a class, an item and a Tuning Prism to see every affix the cube can add and the chance of each. Click the affixes already on your item and the odds update, since the cube cannot add one you have.</p></div></header>
      <div class="cube-ctl"><label>Class <select id="cubeCls">${CLASS_LIST.map(c => `<option ${c === st.cls ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <label>Item <select id="cubeSlot">${slots.map(s => `<option value="${s}" ${s === st.slot ? 'selected' : ''}>${esc(s.charAt(0).toUpperCase() + s.slice(1).replace('offhand', 'Off-hand'))}</option>`).join('')}</select></label>
        <div class="cube-prisms" role="group" aria-label="Tuning Prism">${PRISMS.map(p => `<button class="chip" data-prism="${p[0]}" aria-pressed="${p[0] === st.prism}">${p[0]}</button>`).join('')}</div></div>
      <p class="cube-info"><b>${esc(P[1])}</b>${P[2] ? ', ' + esc(P[2].charAt(0).toLowerCase() + P[2].slice(1)) : ''}. ${pool.length} possible affix${pool.length === 1 ? '' : 'es'}${pool.length ? `, the most likely at ${f1(Math.max(...pool.map(pct)))}%` : ''}.</p>
      ${onItem.length ? `<div class="cube-have"><span>Already on the item</span>${onItem.map(a => `<button class="chip" data-cubeaff="${esc(a.id)}" aria-pressed="true">${esc(a.t.replace('§ ', '').replace('§', ''))} ✕</button>`).join('')}</div>` : ''}
      ${pool.length ? `<div class="ref-scroll"><table class="tc-table ref-table cube-table"><thead><tr><th>Affix and roll range</th><th>Kind</th><th>Weight</th><th>Chance</th><th></th></tr></thead><tbody>${pool.slice().sort((a, b) => (b.w || 0) - (a.w || 0) || a.t.localeCompare(b.t)).map(row).join('')}</tbody></table></div>` : '<p class="note">Nothing of that kind can roll on this item for this class.</p>'}
      <p class="note">Affixes, roll ranges and weights are from the game files. Which affixes count as Offensive, Defensive, Utility or Resource is the game's own category on each affix; treating skill-rank affixes as the Skill prism's pool and single-element resistances as the Resistance prism's pool is this planner's reading and has not been checked in game. Resource regeneration affixes are missing from the planner's affix list, so they are missing here too.</p></div>`;
    $('#cubeCls').onchange = e => { st.cls = e.target.value; renderCubePlanner(); }; $('#cubeSlot').onchange = e => { st.slot = e.target.value; st.have = []; renderCubePlanner(); };
    $$('#sitePage [data-prism]').forEach(b => b.onclick = () => { st.prism = b.dataset.prism; renderCubePlanner(); });
    $$('#sitePage [data-cubeaff]').forEach(b => b.onclick = () => { const id = b.dataset.cubeaff; if (st.have.includes(id)) st.have = st.have.filter(x => x !== id); else if (st.have.length < N_AFF) st.have.push(id); else { toast(`An item holds ${N_AFF} affixes`); return; } renderCubePlanner(); });
  }


  // ---------- boss loot table ----------
  let bossCls = '', bossQ = '';
  function renderBosses() {
    const P = window.D4PAGES.bosses; const q = bossQ.trim().toLowerCase(); const cls = bossCls; const names = new Set(data().uniques.map(u => u.name.toLowerCase()));
    const hit = n => !q || n.toLowerCase().includes(q); const chip = n => `<span class="loot${q && hit(n) ? ' hit' : ''}${names.has(n.toLowerCase()) ? '' : ' unk'}"${names.has(n.toLowerCase()) ? '' : ' title="Not in this game version\'s item list"'}>${esc(n)}</span>`;
    const groups = [...new Set(P.bosses.map(b => b.g))];
    const card = b => { const rows = [['All classes', b.all]].concat(CLASS_LIST.filter(c => !cls || c === cls).map(c => [c, b.d[c] || []])).map(([c, list]) => [c, list.filter(hit)]).filter(r => r[1].length);
      if ((q || (cls && Object.keys(b.d).length)) && !rows.length) return ''; if (q && !rows.length) return '';
      return `<article class="boss"><header><h4>${esc(b.name)}</h4><span>${esc(b.where)}</span><em>${esc(b.cost)}</em></header>${b.note ? `<p class="boss-note">${esc(b.note)}</p>` : ''}
        ${rows.length ? `<table class="boss-t"><tbody>${rows.map(([c, list]) => `<tr><th>${esc(c)}</th><td>${list.map(chip).join('')}</td></tr>`).join('')}</tbody></table>` : ''}</article>`; };
    const body = groups.map(g => { const cards = P.bosses.filter(b => b.g === g).map(card).join(''); return cards ? `<h3 class="boss-g">${esc(g)}</h3><div class="boss-grid">${cards}</div>` : ''; }).join('');
    const myth = P.mythics.map(([who, list]) => [who, list.filter(hit)]).filter(r => r[1].length && (!cls || /All classes/.test(r[0]) || r[0].includes(cls) || (/All but/.test(r[0]) && !r[0].includes(cls))));
    $('#sitePage').innerHTML = `<div class="tc ref bosses"><header class="tc-head"><div><h2>${esc(P.title)}</h2><p>${esc(P.intro)}</p></div></header>
      <div class="cube-ctl"><label>Find an item <input id="bossQ" type="search" value="${esc(bossQ)}" placeholder="For example Temerity"></label>
        <div class="cube-prisms" role="group" aria-label="Class"><button class="chip" data-bosscls="" aria-pressed="${!cls}">All classes</button>${CLASS_LIST.map(c => `<button class="chip" data-bosscls="${c}" aria-pressed="${cls === c}">${c}</button>`).join('')}</div></div>
      ${body || '<p class="note">No boss drops an item with that name.</p>'}
      ${myth.length ? `<h3 class="boss-g">Mythic uniques</h3><p class="ref-p">Any lair boss can drop these.</p><article class="boss"><table class="boss-t"><tbody>${myth.map(([c, list]) => `<tr><th>${esc(c)}</th><td>${list.map(chip).join('')}</td></tr>`).join('')}</tbody></table></article>` : ''}
      <p class="note">${esc(P.checked)} Dimmed names are not in this game version's item list.</p>
      <ul class="ref-links">${P.sources.map(l => `<li><a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])}</a><span>${esc(l[2])}</span></li>`).join('')}</ul></div>`;
    const inp = $('#bossQ'); inp.oninput = () => { bossQ = inp.value; const pos = inp.selectionStart; renderBosses(); const n = $('#bossQ'); n.focus(); n.setSelectionRange(pos, pos); };
    $$('#sitePage [data-bosscls]').forEach(b => b.onclick = () => { bossCls = b.dataset.bosscls; renderBosses(); });
  }


  // monster dropdown options, grouped by season tag or monster family so a list of hundreds stays easy to scan
  const FAM_NAME = { zombies: 'Zombies', fly: 'Flies', demon: 'Demons', knight: 'Knights', cultist: 'Cultists', vampire: 'Vampires', drowned: 'Drowned', khazra: 'Khazra', cannibal: 'Cannibals', werewolf: 'Werewolves', corruptAmazon: 'Corrupted Amazons', BloodSeekers: 'Blood Seekers', Golems: 'Golems and constructs', Constructs: 'Golems and constructs', Rats: 'Rats', Snake: 'Snakes (Nangari)', Spider: 'Spiders', Bandit: 'Bandits', Skeleton: 'Skeletons', Ghost: 'Ghosts', Goatman: 'Goatmen' };
  function monOptions(list, cur, pre) {
    pre = pre || ''; const cnt = {}; const g0 = m => m.tag || FAM_NAME[m.fam] || (m.fam ? m.fam.charAt(0).toUpperCase() + m.fam.slice(1) : 'Other'); list.forEach(m => { const g = g0(m); cnt[g] = (cnt[g] || 0) + 1; });
    const g = m => { const x = g0(m); return m.tag || cnt[x] >= 3 ? x : 'Other'; }; const groups = [...new Set(list.map(g))].sort((a, b) => (a === 'Other') - (b === 'Other') || a.localeCompare(b));
    return groups.map(t => `<optgroup label="${esc(t)}">${list.filter(m => g(m) === t).sort((a, b) => a.name.localeCompare(b.name)).map(m => `<option value="${pre}${esc(m.id)}" ${pre + m.id === cur ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</optgroup>`).join('');
  }
  // ---------- submit your damage: players report real hits, and the planner uses them ----------
  const HIT_KEY = 'd4bp-hits';
  // readings taken on 14 Nov 2026 by the planner's author: level 70 Paladin, Torment I, 2,259 Life, 7,574 Toughness
  const HIT_SEED = [['fallen_grunt_sword_fire', 'fallen_grunt_attack', 10, 2259, 1476, 2259, 7574], ['fallen_grunt_sword_fire', 'fallen_grunt_attack', 10, 2259, 1476, 2259, 7574], ['fallen_grunt_sword_fire', 'fallen_grunt_attack', 10, 2259, 1476, 2259, 7574],
    ['Fallen_Hound', 'Fallen_Hound_Attack', 10, 2259, 1372, 2259, 7574], ['Fallen_Hound', 'Fallen_Hound_Attack', 10, 2259, 1416, 2259, 7574], ['Fallen_Hound', 'Fallen_Hound_Attack', 10, 2259, 1432, 2259, 7574], ['Fallen_Hound', 'Fallen_Hound_Attack', 10, 2259, 1422, 2259, 7574],
    ['wildlife_bat', 'vampire_bat_attack', 10, 2259, 1958, 2259, 7574], ['fallen_brute_lightning', 'fallen_brute_attack', 10, 2259, 1850, 2259, 7574]]
    .map(r => ({ seed: 1, mon: r[0], atk: r[1], tier: r[2], before: r[3], after: r[4], life: r[5], tough: r[6] }));
  function hitReports() { try { const j = JSON.parse(localStorage.getItem(HIT_KEY) || '[]'); return Array.isArray(j) ? j : []; } catch (e) { return []; } }
  function saveHits(list) { try { localStorage.setItem(HIT_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ } HIT_CACHE = null; }
  const hitRaw = r => (r.before - r.after) / (r.life / r.tough);   // the hit before the player's defenses, using the game's own Toughness figure
  // what the game files alone predict for an attack at a tier, with no correction
  function fileHit(monId, atkId, tierNo) {
    const SC = data().scaling; const m = ((window.D4MON || {}).monsters || []).find(x => x.id === monId); if (!SC || !m) return null; const a = m.attacks.find(x => x.id === atkId) || m.attacks[0]; if (!a) return null;
    const L = SC.levels.find(l => l.l === MON_LEVEL); const tier = SC.tiers.find(t => t.t === tierNo); if (!tier) return null;
    return { m, a, v: a.s * SC.healthBase * L.hp * L.md * m.dmg * (a.type === 'Physical' ? 1 : L.mnp) * tier.dmg };
  }
  let HIT_CACHE = null;
  // correction per monster attack: the average of measured hit over file prediction, from the built-in readings and this device's reports
  function hitCal() {
    if (HIT_CACHE) return HIT_CACHE; const by = {};
    HIT_SEED.concat(hitReports()).forEach(r => { const f = fileHit(r.mon, r.atk, r.tier); if (!f || !(f.v > 0)) return; const raw = hitRaw(r); if (!(raw > 0)) return; const k = r.mon + '|' + f.a.id; const e = by[k] = by[k] || { n: 0, sum: 0, lo: Infinity, hi: 0, mine: 0 }; const x = raw / f.v; e.n++; e.sum += x; e.lo = Math.min(e.lo, x); e.hi = Math.max(e.hi, x); if (!r.seed) e.mine++; });
    Object.values(by).forEach(e => { e.k = e.sum / e.n; e.spread = e.n > 1 ? (e.hi - e.lo) / 2 / e.k : 0; });
    return (HIT_CACHE = by);
  }
  const calOf = (m, a) => { const c = hitCal(); return c[m.id + '|' + a.id] || (m.attacks.length && c[m.id + '|' + m.attacks[0].id] && !Object.keys(c).some(k => k.startsWith(m.id + '|') && k !== m.id + '|' + m.attacks[0].id) ? Object.assign({ fam: 1 }, c[m.id + '|' + m.attacks[0].id]) : null); };
  let subSt = { mon: '', atk: '', tier: 10, before: '', after: '', life: '', tough: '', note: '' };
  function renderSubmit() {
    const MON = (window.D4MON || {}).monsters || []; const SC = data().scaling; const st = subSt; const f0 = (v, d) => D4T.fmtNum(Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0));
    if (!st.mon || !MON.some(m => m.id === st.mon)) st.mon = 'fallen_grunt_sword_fire'; const m = MON.find(x => x.id === st.mon); if (m && !m.attacks.some(a => a.id === st.atk)) st.atk = m.attacks[0] ? m.attacks[0].id : '';
    const cats = [['normal', 'Normal monsters'], ['elite', 'Elites and minibosses'], ['boss', 'Bosses'], ['world', 'World bosses']];
    const n = k => +String(st[k]).replace(/,/g, ''); const ok = n('before') > 0 && n('after') >= 0 && n('after') < n('before') && n('life') > 0 && n('tough') >= n('life');
    const rep = ok ? { mon: st.mon, atk: st.atk, tier: +st.tier, before: n('before'), after: n('after'), life: n('life'), tough: n('tough') } : null; const f = rep && fileHit(rep.mon, rep.atk, rep.tier); const raw = rep ? hitRaw(rep) : 0;
    const died = n('before') > 0 && String(st.after) !== '' && n('after') <= 0;
    const list = hitReports(); const cal = hitCal();
    const nameOf = id => (MON.find(x => x.id === id) || { name: id }).name; const atkOf = (id, a) => { const mm = MON.find(x => x.id === id); const at = mm && mm.attacks.find(x => x.id === a); return at ? at.name : a; }; const tierName = t => (SC.worlds.find(w => w.tier === t) || { name: 'Pit ' + t }).name;
    $('#sitePage').innerHTML = `<div class="tc ref submit"><header class="tc-head"><div><h2>Submit your damage</h2><p>Diablo 4 has no combat log, so nobody has published how hard each monster really hits. Take one hit, type in four numbers, and the planner works out that attack's true damage and uses it on the Defense page. Every report makes the planner more accurate.</p></div></header>
      <div class="sub-grid"><section class="tc-box"><h3>Report a hit</h3>
        <ol class="sub-steps"><li>Hover <b>Toughness</b> on your character sheet and note your Maximum Life and the Toughness number for the attack's damage type.</li><li>At full Life, let one monster hit you once, with nothing else attacking.</li><li>Hover your Life globe and note the number left.</li></ol>
        <div class="sub-form">
          <label>Kind <select id="subCat">${cats.map(([c, l]) => `<option value="${c}" ${m && m.cat === c ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
          <label>Monster <select id="subMon">${monOptions(MON.filter(x => x.cat === (m ? m.cat : 'normal')), st.mon)}</select></label>
          <label>Attack <select id="subAtk">${m ? m.attacks.map(a => `<option value="${esc(a.id)}" ${a.id === st.atk ? 'selected' : ''}>${esc(a.name)} (${esc(a.type)})</option>`).join('') : ''}</select></label>
          <label>Difficulty <select id="subTier">${SC.worlds.map(w => `<option value="${w.tier}" ${+st.tier === w.tier ? 'selected' : ''}>${esc(w.name)}</option>`).join('')}</select></label>
          <label>Life before the hit <input id="subBefore" inputmode="numeric" value="${esc(st.before)}" placeholder="2,259"></label>
          <label>Life after the hit <input id="subAfter" inputmode="numeric" value="${esc(st.after)}" placeholder="1,476"></label>
          <label>Maximum Life <input id="subLife" inputmode="numeric" value="${esc(st.life)}" placeholder="2,259"></label>
          <label>Toughness for ${esc(m && m.attacks.find(a => a.id === st.atk) ? m.attacks.find(a => a.id === st.atk).type : 'that damage type')} <input id="subTough" inputmode="numeric" value="${esc(st.tough)}" placeholder="7,574"></label>
        </div>
        ${died ? '<p class="cmp-warn">A hit that kills you cannot be measured, because the damage beyond your Life is lost. Try a lower difficulty or more defense.</p>' : ''}
        ${rep ? `<div class="sub-result"><div><b>${f0(raw)}</b><span>damage before your defenses</span></div><div><b>${f0((1 - rep.life / rep.tough) * 100, 1)}%</b><span>your damage reduction</span></div>${f ? `<div><b>${f0(raw / f.v, 2)} times</b><span>the game-file value of ${f0(f.v)}</span></div>` : ''}</div>` : '<p class="note">Fill in all four numbers. Toughness is always at least your Maximum Life.</p>'}
        <div class="cmp-act"><button class="btn" id="subSave" ${rep ? '' : 'disabled'}>Save this hit</button><button class="btn ghost" id="subMine">Fill Life and Toughness from my last report</button></div>
        <p class="note">Monster not in the list? Pick the closest one and say which monster it was when you send your reports in. Reports are saved on this device for now; when the site goes live they will be sent to the shared database.</p></section>
      <section class="tc-box"><h3>What has been measured</h3>
        ${Object.keys(cal).length ? `<table class="tc-table ref-table"><thead><tr><th>Monster and attack</th><th>Hits</th><th>Against the game files</th><th>Spread</th></tr></thead><tbody>${Object.entries(cal).sort((a, b) => b[1].n - a[1].n).map(([k, e]) => { const [id, a] = k.split('|'); return `<tr><th>${esc(nameOf(id))} <small>${esc(atkOf(id, a))}</small></th><td>${e.n}${e.mine ? ` <small>(${e.mine} yours)</small>` : ''}</td><td><b>${f0(e.k, 2)} times</b></td><td>${e.n > 1 ? (e.spread < 0.005 ? 'none' : f0(e.spread * 100, 1) + '% either side') : 'one hit so far'}</td></tr>`; }).join('')}</tbody></table>` : '<p class="note">Nothing yet.</p>'}
        <p class="note">Monsters with no reports use 2 times the game-file value, which is what the Fallen measured at, and are marked as estimates on the Defense page.</p>
        <h3 class="sub-h">Your reports <small>${list.length}</small></h3>
        ${list.length ? `<table class="tc-table ref-table"><thead><tr><th>Monster</th><th>Difficulty</th><th>Life lost</th><th>Before defenses</th><th></th></tr></thead><tbody>${list.map((r, i) => `<tr><th>${esc(nameOf(r.mon))} <small>${esc(atkOf(r.mon, r.atk))}</small></th><td>${esc(tierName(r.tier))}</td><td>${f0(r.before - r.after)}</td><td>${f0(hitRaw(r))}</td><td><button class="btn ghost small" data-subdel="${i}">Remove</button></td></tr>`).join('')}</tbody></table>
        <div class="cmp-act"><button class="btn ghost" id="subCopy">Copy my reports</button><button class="btn ghost" id="subFile">Download my reports</button></div>` : '<p class="note">You have not saved any hits yet.</p>'}</section></div></div>`;
    const bind = (id, key, ev) => { const el = $('#' + id); if (el) el[ev || 'onchange'] = () => { st[key] = el.value; if (key === 'mon') st.atk = ''; renderSubmit(); }; };
    bind('subMon', 'mon'); { const sc = $('#subCat'); if (sc) sc.onchange = () => { const first = MON.filter(x => x.cat === sc.value).sort((x, y) => x.name.localeCompare(y.name))[0]; if (first) { st.mon = first.id; st.atk = ''; renderSubmit(); } }; } bind('subAtk', 'atk'); bind('subTier', 'tier'); bind('subBefore', 'before'); bind('subAfter', 'after'); bind('subLife', 'life'); bind('subTough', 'tough');
    const sv = $('#subSave'); if (sv) sv.onclick = () => { const l = hitReports(); l.push(Object.assign({ ts: Date.now(), ver: data().meta ? data().meta.build : S.ver }, rep)); saveHits(l); st.before = ''; st.after = ''; renderSubmit(); toast('Hit saved. The Defense page now uses it.'); };
    const mine = $('#subMine'); if (mine) mine.onclick = () => { const l = hitReports(); const last = l[l.length - 1]; if (!last) { toast('No earlier report on this device'); return; } st.life = String(last.life); st.tough = String(last.tough); st.before = String(last.life); renderSubmit(); };
    $$('#sitePage [data-subdel]').forEach(b => b.onclick = () => { const l = hitReports(); l.splice(+b.dataset.subdel, 1); saveHits(l); renderSubmit(); });
    const out = () => JSON.stringify({ app: 'D4 Build Planner', kind: 'hit reports', reports: hitReports() }, null, 1);
    const cp = $('#subCopy'); if (cp) cp.onclick = () => { navigator.clipboard.writeText(out()).then(() => toast('Reports copied'), () => toast('Could not copy. Use Download instead.')); };
    const dl = $('#subFile'); if (dl) dl.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([out()], { type: 'application/json' })); a.download = 'd4-hit-reports.json'; a.click(); };
  }

  // ---------- skill bar on the Character page ----------
  const BAR_KEYS = ['1', '2', '3', '4', 'Left click', 'Right click'];
  function skillBarHtml() {
    const C = cdata(); const act = unlockedSkills().filter(p => !C.powers[p].passive);
    S.hotbar = (S.hotbar || []).filter(p => act.includes(p)).slice(0, 6);
    for (const p of act) if (S.hotbar.length < 6 && !S.hotbar.includes(p)) S.hotbar.push(p);
    const slot = i => { const p = S.hotbar[i]; const P = p && C.powers[p]; const sk = P && skillCtx(p);
      return `<div class="sbar-slot${P ? ' filled' : ''}">
        <div class="sbar-icon">${P ? `<img src="${skillImg(S.cls, P.name)}" alt="">` : ''}<span class="key">${esc(BAR_KEYS[i])}</span></div>
        <select data-bar="${i}" aria-label="Skill on ${esc(BAR_KEYS[i])}"><option value="">Empty</option>${act.map(q => `<option value="${q}" ${q === p ? 'selected' : ''}>${esc(C.powers[q].name)}</option>`).join('')}</select>
        ${P ? `<small>Rank ${sk.lvl}${sk.cd() ? `, ${D4T.fmtNum(Math.round(sk.cdEff() * 100) / 100)} s` : ''}${sk.cost() ? `, ${D4T.fmtNum(Math.round(sk.costEff() * 10) / 10)} ${esc(CLASS_RES[S.cls] || '')}` : ''}</small>` : ''}</div>`; };
    const sh = S.cls === 'Warlock' && S.shard && (data().shards || []).find(x => x.id === S.shard.id);
    const fr = sh && sh.frags.find(f => f.id === S.shard.frag);
    return `<section class="sbar" aria-label="Skill bar"><h3>Skill bar</h3><div class="sbar-row">${BAR_KEYS.map((k, i) => slot(i)).join('')}</div>
      ${act.length ? '' : '<p class="note">Take skills on the Skill tree and they appear here.</p>'}
      ${sh ? `<p class="sbar-shard">Soul Shard: <b>${esc(sh.power.name)}</b>${fr ? `, ${esc(fr.name)}` : ''}</p>` : ''}${S.cls !== 'Warlock' ? mechSummary() : ''}</section>`;
  }
  function wireSkillBar(root, rerender) {
    $$(root + ' [data-bar]').forEach(x => x.onchange = () => { const i = +x.dataset.bar; const v = x.value; const cur = S.hotbar.slice(); const j = cur.indexOf(v);
      if (j >= 0 && j !== i) cur[j] = cur[i]; cur[i] = v; S.hotbar = cur.filter((p, k) => p || k < cur.length); while (S.hotbar.length && !S.hotbar[S.hotbar.length - 1]) S.hotbar.pop(); commit(); rerender(); });
  }

  // ---------- Defense Theory Craft: incoming hits from game data ----------
  // A hit = the attack's share of level hitpoints (power payload) x base Life (flHealthBase x LevelScaling flHPScalar)
  //   x LevelScaling flMonsterDamageScalar x the monster's own flDamageScalarOverride x DifficultyTiers flMonsterDamageScalar
  //   (x the non-physical scalar for elements). Difficulty steps 4.75% per tier from Pit 11 up, matching Maxroll.
  // Armor: 0.9 x A / (A + 5100); resistance: 0.9 x R / (R + 1020), both from LevelScaling at level 70.
  //   The resistance curve matches published Season 15 measurements (4,500 gives 73.4%, 11,000 gives 82.4%).
  const WEAKEN = { normal: 20, elite: 15, boss: 10 };
  const MON_LEVEL = 70;
  const RARITY_HP = { normal: 0, champion: 1, elite: 2, boss: -1 };
  function dfState() {
    S.df = Object.assign({ diff: 10, pit: 0, fort: false, weak: false, block: true, dodge: true, mon: {}, rar: 'elite', aff: [] }, S.df || {});
    if (!S.df.mon) S.df.mon = {}; if (!Array.isArray(S.df.aff)) S.df.aff = [];
    const MON = (window.D4MON || {}).monsters || [];
    if (S.df.mon.world && !MON.some(m => m.id === S.df.mon.world)) S.df.mon.world = '';
    for (const c of ['normal', 'boss']) if (!MON.some(m => m.id === S.df.mon[c])) { const first = MON.find(m => m.cat === c); S.df.mon[c] = first ? first.id : ''; }
    if (S.df.mon.elite === undefined) { const first = MON.find(m => m.cat === 'elite'); S.df.mon.elite = first ? first.id : ''; }
    else if (S.df.mon.elite && !eliteBase(MON, S.df.mon.elite)) S.df.mon.elite = '';
    return S.df;
  }
  // the elite slot holds a miniboss id, or 'e:' + a normal monster's id for an elite or champion of that kind
  const eliteBase = (MON, v) => { if (!v) return null; if (v.startsWith('e:')) { const m = MON.find(x => x.id === v.slice(2)); return m ? { m, promoted: true } : null; } const m = MON.find(x => x.id === v); return m ? { m, promoted: false } : null; };
  function affixCount(T, tierNo, kind) { const C = (window.D4MON || {}).counts || []; const row = C.find(x => x.t === tierNo) || C[C.length - 1] || {}; return row[kind] || 0; }
  function rollAffixes(kind, n) {
    const D = window.D4MON || {}; const pool = (D.affixes || []).slice(); const caps = D.caps || {}; const used = {}; const out = [];
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    for (const a of pool) { if (out.length >= n) break; const cap = caps[a.cat] ? caps[a.cat][kind] : 1; if ((used[a.cat] || 0) >= cap) continue; used[a.cat] = (used[a.cat] || 0) + 1; out.push(a.id); }
    return out;
  }
  const HIT_CAL = 2;
  // Per-monster corrections from the same in-game test (level 70, Torment I, 11 clean hits). Fallen: three identical hits, exact. Fallen hounds: four single hits of 827 to 887, about 1.63 times the file value, with a spread of about 4% either side.
  function defense() {
    const SC = data().scaling; const D = window.D4MON || {}; const MON = D.monsters || []; if (!SC || !MON.length) return null;
    const T = dfState(); const M = statModel();
    const tierNo = +T.pit > 0 ? Math.min(150, +T.pit) : +T.diff;
    const tier = SC.tiers.find(t => t.t === tierNo) || SC.tiers[0];
    const L = SC.levels.find(l => l.l === MON_LEVEL);
    const baseLife = SC.healthBase * L.hp;
    const lifeFlat = M.life ? M.life.v : 0;
    const lifeMul = (1 + (M.lifep ? M.lifep.v : 0) / 100) * (1 + (M.lifep ? M.lifep.x : 0) / 100);
    const barrier = Math.max(0, +T.barrier || 0); const life = (baseLife + lifeFlat) * lifeMul + barrier;
    const armorBase = M.armor ? M.armor.v : 0, armorPct = M.armorp ? M.armorp.v : 0, armorX = M.armorp ? M.armorp.x : 0;
    const armor = armorBase * (1 + armorPct / 100) * (1 + armorX / 100);
    const aDRof = A => Math.min(SC.maxArmor || 0.9, L.as * A / (A + L.ad));
    const armorDR = aDRof(armor);
    const resPct = (M.rallp ? M.rallp.v : 0);
    const resOf = type => { const id = 'r' + type.toLowerCase(); const flat = M[id] ? M[id].v : 0; return flat * (1 + resPct / 100); };
    const rDRof = R => Math.min(SC.maxRes || 0.9, L.rs * R / (R + L.rdf));
    const resDR = type => rDRof(resOf(type));
    // mercenary powers that cut the damage you take: each has its own switch because they need the mercenary's skill to be up
    const mercSt = tcState().st || {}; const mercDR = []; sheetData().powers.filter(q => q.kind === 'Mercenary').forEach(q => { const t = strip(q.desc); const m = t.match(/Damage Reduction[^.]*?up to ([\d.]+)%/) || t.match(/([\d.]+)%\s*(?:\[[x+]\])?\s*Damage Reduction/) || t.match(/deal ([\d.]+)%\s*(?:\[[x+]\])?\s*reduced damage/) || t.match(/reducing their damage dealt by ([\d.]+)%/);
      if (m && +m[1] > 0) { const id = q.role + ':' + q.name; mercDR.push({ id, v: +m[1], name: q.name, merc: q.merc, role: q.role, on: (T.mdr || {})[id] !== false && mercSt[q.role] !== false }); } });
    const mercInfo = ['mercMain', 'mercSup'].map(role => { const l = sheetData().powers.filter(q => q.kind === 'Mercenary' && q.role === role); return l.length ? { role, name: l[0].merc, n: l.length, on: mercSt[role] !== false } : null; }).filter(Boolean);
    const drParts = (M.dr ? M.dr.parts : []).concat(mercDR.filter(x => x.on).map(x => ({ v: x.v, src: x.name + ' (' + x.merc + ')' }))); const drMul = drParts.reduce((k, p) => k * (1 - Math.min(100, p.v) / 100), 1);
    const block = Math.min(100, M.block ? M.block.v : 0) / 100, blockR = Math.min(80, (M.blockr ? M.blockr.v : 0)) / 100;
    const dodge = Math.min(100, M.dodge ? M.dodge.v : 0) / 100;
    // HIT_CAL: measured in game on 14 Nov 2026. Two Fallen basic hits on Torment I each took 783 Life from a level 70 Paladin whose own Toughness figure gives 70.18% reduction: exactly twice what the file values alone predict.
    const rawHit = (s, type, dmgK) => s * baseLife * L.md * (dmgK || 1) * (type === 'Physical' ? 1 : L.mnp) * tier.dmg * HIT_CAL;
    const taken = (s, type, tierKey, dmgK) => {
      const raw = rawHit(s, type, dmgK);
      const k = (1 - armorDR) * (1 - resDR(type)) * drMul * (T.fort ? 0.9 : 1) * (T.weak ? 1 - WEAKEN[tierKey] / 100 : 1);
      const hit = raw * k; const exp = hit * (T.block ? 1 - block * blockR : 1) * (T.dodge ? 1 - dodge : 1);
      return { raw, hit, exp };
    };
    const monLife = (m, rarity) => { const rh = RARITY_HP[rarity]; const rk = rh >= 0 && L.rh ? 1 + (L.rh[rh] || 0) : 1; return L.mhp * m.hp * tier.hp * rk; };
    const card = (cat, m, rarity, tierKey) => m ? { cat, m, rarity, life: monLife(m, rarity), attacks: m.attacks.map(a => { const c = calOf(m, a); return Object.assign({ a, cal: c }, taken(a.s, a.type, tierKey, m.dmg * (c ? c.k / HIT_CAL : 1))); }) } : null;
    const nm = MON.find(x => x.id === T.mon.normal);
    const eb = eliteBase(MON, T.mon.elite);
    const kind = eb ? (eb.promoted ? (T.rar === 'champion' ? 'champion' : 'elite') : 'superElite') : 'elite';
    const nAff = affixCount(T, tierNo, kind);
    const affs = T.aff.slice(0, nAff).map(id => (D.affixes || []).find(a => a.id === id)).filter(Boolean);
    const affRows = affs.map(a => ({ a, hits: a.hits.map(h => Object.assign({ h }, taken(h.s, h.type, 'elite', 1))) }));
    const bm = MON.find(x => x.id === T.mon.boss); const wm = T.mon.world ? MON.find(x => x.id === T.mon.world) : null;
    const cards = [card('normal', nm, 'normal', 'normal'), eb ? card('elite', eb.m, eb.promoted ? (T.rar === 'champion' ? 'champion' : 'elite') : 'boss', 'elite') : null, card('boss', bm, 'boss', 'boss'), card('world', wm, 'boss', 'boss')].filter(Boolean);
    // over-cap check for hand-picked affixes
    const caps = D.caps || {}; const capKey = kind; const byCat = {}; affs.forEach(a => { byCat[a.cat] = (byCat[a.cat] || 0) + 1; });
    const overCap = Object.keys(byCat).filter(c => caps[c] && byCat[c] > caps[c][capKey]);
    const types = ['Physical', 'Fire', 'Lightning', 'Cold', 'Poison', 'Shadow'];
    const mitig = (type, A, R0, dr) => (1 - aDRof(A)) * (1 - rDRof(R0)) * drMul * (1 - (dr || 0)) * (T.fort ? 0.9 : 1);
    const ehp = types.map(t => ({ t, dr: 1 - mitig(t, armor, resOf(t)), ehp: life / mitig(t, armor, resOf(t)), R: resOf(t) }));
    // what helps: average Effective Life against every attack on the selected monsters
    const mix = []; cards.forEach(c => c.attacks.forEach(r => mix.push(r.a.type))); affRows.forEach(r => r.hits.forEach(x => mix.push(x.h.type)));
    const mixEhp = (lf, ar, rs, dr) => mix.length ? mix.reduce((t, ty) => t + lf / mitig(ty, ar, resOf(ty) + rs * (1 + resPct / 100), dr), 0) / mix.length : 0;
    const now = mixEhp(life, armor, 0, 0);
    const A = GD().affixes; const top = re => A.filter(x => re.test(x.t)).sort((x, y) => y.v - x.v)[0];
    const cands = [['Maximum Life', top(/^\+?§ Maximum Life$/)], ['Maximum Life %', top(/^§% Maximum Life$/)], ['Armor', top(/^\+?§ Armor$/)], ['Total Armor %', top(/^§% Total Armor$/)], ['All Resistance', top(/^\+?§ Resistance to All Elements$/)], ['Damage Reduction', top(/^§% Damage Reduction$/)]].filter(c => c[1]);
    const whatIf = cands.map(([n, d]) => { const v = d.v; let e;
      if (n === 'Maximum Life') e = mixEhp((baseLife + lifeFlat + v) * lifeMul, armor, 0, 0);
      else if (n === 'Maximum Life %') e = mixEhp((baseLife + lifeFlat) * (1 + ((M.lifep ? M.lifep.v : 0) + v) / 100) * (1 + (M.lifep ? M.lifep.x : 0) / 100), armor, 0, 0);
      else if (n === 'Armor') e = mixEhp(life, (armorBase + v) * (1 + armorPct / 100) * (1 + armorX / 100), 0, 0);
      else if (n === 'Total Armor %') e = mixEhp(life, armorBase * (1 + (armorPct + v) / 100) * (1 + armorX / 100), 0, 0);
      else if (n === 'All Resistance') e = mixEhp(life, armor, v, 0);
      else e = mixEhp(life, armor, 0, v / 100);
      return { n, d, gain: now ? e / now - 1 : 0 }; }).sort((a, b) => b.gain - a.gain);
    return { mercInfo, mercDR, T, SC, D, MON, tier, tierNo, L, baseLife, lifeFlat, life, armor, armorDR, drParts, drMul, block, blockR, dodge, cards, eb, kind, nAff, affs, affRows, overCap, ehp, whatIf, resDR, now };
  }
  function renderDefense() {
    invalidate();
    const box = $('#panel-defense'); const R = defense(); const f = (v, d) => D4T.fmtNum(Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0));
    if (!R) { box.innerHTML = '<div class="tc"><div class="tc-empty"><h2>Defense Theory Craft</h2><p>Monster data is missing for this game version.</p></div></div>'; return; }
    const T = R.T; const pct = v => f(v * 100, 1) + '%';
    const big = v => v >= 1e9 ? f(v / 1e9, 2) + 'B' : v >= 1e6 ? f(v / 1e6, 2) + 'M' : f(v);
    const hitRow = (label, sub, r) => { const share = r.hit / R.life; const ht = r.exp > 0 ? Math.ceil(R.life / r.exp) : 0;
      return `<tr class="${share >= 1 ? 'oneshot' : share >= 0.5 ? 'heavy' : ''}"><th>${esc(label)}${sub ? ` <small>${sub}</small>` : ''}</th><td>${f(r.raw)}</td><td><b>${f(r.hit)}</b></td><td>${pct(share)}</td><td>${f(r.exp)}</td><td>${share >= 1 ? '<b class="warnc">One hit</b>' : ht}</td></tr>`; };
    const head = '<thead><tr><th>Attack</th><th>Raw hit</th><th>After defenses</th><th>Of your Life</th><th>Average with block and dodge</th><th>Hits to die</th></tr></thead>';
    const sub = a => [a.type, a.hits > 1 ? `${a.hits} hits` : '', a.cd ? `${f(a.cd, 1)} s cooldown` : ''].filter(Boolean).join(', ');
    const norm = R.MON.filter(m => m.cat === 'normal'), mini = R.MON.filter(m => m.cat === 'elite'), boss = R.MON.filter(m => m.cat === 'boss'), world = R.MON.filter(m => m.cat === 'world');
    // options grouped the way the game files tag them: the base game first, then Season 14 and Season 15
    const grouped = (list, cur, pre) => monOptions(list, cur, pre);
    const kindName = { elite: 'Elite', champion: 'Champion', superElite: 'Miniboss' }[R.kind];
    const affSel = i => { const cur = T.aff[i] || ''; const taken = new Set(T.aff.filter((x, k) => k !== i && k < R.nAff));
      const groups = ['Offensive', 'Defensive', 'CrowdControl', 'Passive'];
      return `<select data-aff="${i}" aria-label="Affix ${i + 1}"><option value="">Affix ${i + 1}: none</option>${groups.map(g => `<optgroup label="${g === 'CrowdControl' ? 'Crowd control' : g}">${R.D.affixes.filter(a => a.cat === g && !taken.has(a.id)).map(a => `<option value="${a.id}" ${a.id === cur ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</optgroup>`).join('')}</select>`; };
    const monCard = c => { const m = c.m; const title = c.cat === 'elite' && R.eb && R.eb.promoted ? `${m.name} (${kindName.toLowerCase()})` : m.name;
      return `<section class="tc-box mon-card"><header class="mon-h"><h3>${esc(title)}</h3><span class="mon-tag ${c.cat}">${c.cat === 'normal' ? 'Normal' : c.cat === 'elite' ? kindName : c.cat === 'world' ? 'World boss' : 'Boss'}</span>${m.tag ? `<span class="mon-tag">${esc(m.tag)}</span>` : ''}${(() => { const cs = c.attacks.map(r => r.cal).filter(Boolean); const hits = cs.reduce((t, x) => Math.max(t, x.n), 0); const sp = cs.reduce((t, x) => Math.max(t, x.spread || 0), 0);
          return cs.length ? `<span class="mon-tag ok" title="Checked against ${hits} real hit${hits === 1 ? '' : 's'} reported from the game.">Measured in game${sp >= 0.005 ? ', within ' + f(sp * 100, 0) + '%' : hits > 1 ? ', exact' : ''}</span>` : '<button class="mon-tag est" data-gosubmit="' + esc(m.id) + '" title="Not yet checked against real hits. Monsters tested so far came in up to 45% below this estimate. Click to report a hit from this monster.">Estimate, may read high. Report a hit</button>'; })()}</header>
        <div class="mon-stats"><div><span>Life (estimate)</span><b>${c.cat === 'boss' || c.cat === 'world' ? 'Not in the files' : big(c.life)}</b></div><div><span>Damage scaling</span><b>x${f(m.dmg, 2)}</b></div><div><span>Element</span><b>${esc(m.el)}</b></div><div><span>Attacks</span><b>${m.attacks.length}</b></div>${(() => { const top = c.attacks.reduce((a, r) => r.hit > a.hit ? r : a, { hit: 0 }); const need = Math.floor(top.hit) + 1; const ok = R.life > top.hit;
          return `<div class="${ok ? 'ok' : 'bad'}" title="Biggest single hit after your defenses: ${esc(top.a ? top.a.name : '')}"><span>Life to survive its biggest hit</span><b>${f(need)}</b><small>${ok ? `you have ${f(R.life - top.hit)} to spare` : `you are ${f(need - R.life)} short`}</small></div>`; })()}</div>
        <table class="tc-table df">${head}<tbody>${c.attacks.map(r => hitRow(r.a.name, sub(r.a), r)).join('')}</tbody></table>
        ${c.cat === 'elite' ? `<div class="aff-box"><div class="aff-head"><h4>Elite affixes <small>${R.nAff} at tier ${R.tierNo}</small></h4>
            ${R.eb && R.eb.promoted ? `<div class="seg" role="group" aria-label="Elite type"><button data-rar="elite" aria-pressed="${T.rar !== 'champion'}">Elite</button><button data-rar="champion" aria-pressed="${T.rar === 'champion'}">Champion</button></div>` : ''}
            <button class="btn" id="affRoll">Roll affixes</button><button class="btn ghost" id="affClear">Clear</button></div>
          <div class="aff-sel">${Array.from({ length: R.nAff }, (_, i) => affSel(i)).join('')}</div>
          ${R.overCap.length ? `<p class="note warnc">The game allows only ${R.overCap.map(c => `${R.D.caps[c][R.kind]} ${c === 'CrowdControl' ? 'crowd control' : c.toLowerCase()}`).join(' and ')} affix${R.overCap.length > 1 ? 'es' : ''} on a ${kindName.toLowerCase()}.</p>` : ''}
          ${R.affRows.length ? `<table class="tc-table df">${head}<tbody>${R.affRows.map(r => r.hits.length ? r.hits.map((x, k) => hitRow(k ? '' : r.a.name, `${x.h.type}${k ? '' : `, ${r.a.cat === 'CrowdControl' ? 'crowd control' : r.a.cat.toLowerCase()}`}`, x)).join('') : `<tr><th>${esc(r.a.name)} <small>${r.a.cat === 'CrowdControl' ? 'crowd control' : r.a.cat.toLowerCase()}</small></th><td colspan="5" class="nodmg">No damage of its own in the game files</td></tr>`).join('')}</tbody></table>` : '<p class="note">No affixes picked. Roll them, or choose them one by one.</p>'}
        </div>` : ''}
      </section>`; };
    box.innerHTML = `<div class="tc">
      <header class="tc-head"><div><h2>Defense Theory Craft</h2><p>Pick a monster of each kind and see every attack it has, from the game files, against your Armor, Resistances and Damage Reduction. Change gear and every number moves.</p></div></header>
      ${readinessHtml(R)}
      <section class="tc-states" aria-label="Difficulty and status">
        <h3>Where and how</h3>
        <div class="df-ctrl">
          <label>Difficulty <select id="dfDiff">${R.SC.worlds.map(w => `<option value="${w.tier}" ${+T.diff === w.tier && !(+T.pit) ? 'selected' : ''}>${esc(w.name)} (Pit ${w.tier})</option>`).join('')}</select></label>
          <label>Pit tier <input id="dfPit" type="number" min="0" max="150" value="${+T.pit || ''}" placeholder="Off"></label>
          <label>Barrier you keep up <input id="dfBarrier" type="number" min="0" value="${+T.barrier || ''}" placeholder="0"></label>
        </div>
        <div class="df-ctrl mon-pick">
          <label>Normal <select id="dfNormal">${grouped(norm, T.mon.normal, '', 'Base game')}</select></label>
          <label>Elite or miniboss <select id="dfElite"><option value="">None</option>${grouped(mini, T.mon.elite, '', 'Minibosses')}${norm.length ? `<optgroup label="Elite packs (any normal monster)">${norm.slice().sort((a, b) => a.name.localeCompare(b.name)).map(m => `<option value="e:${m.id}" ${'e:' + m.id === T.mon.elite ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</optgroup>` : ''}</select></label>
          <label>Boss <select id="dfBoss">${grouped(boss, T.mon.boss, '', 'Lair and story bosses')}</select></label>
          <label>World boss <select id="dfWorld"><option value="">None</option>${grouped(world, T.mon.world, '', 'World bosses')}</select></label>
        </div>
        <div class="chips">
          <label class="chip${T.fort ? ' on' : ''}"><input type="checkbox" data-df="fort" ${T.fort ? 'checked' : ''}><span>You are fortified</span><small>10% less</small></label>
          <label class="chip${T.weak ? ' on' : ''}"><input type="checkbox" data-df="weak" ${T.weak ? 'checked' : ''}><span>Enemy weakened</span><small>20, 15, 10%</small></label>
          <label class="chip${T.block ? ' on' : ''}"><input type="checkbox" data-df="block" ${T.block ? 'checked' : ''}><span>Count block</span><small>${pct(R.block)} x ${pct(R.blockR)}</small></label>
          <label class="chip${T.dodge ? ' on' : ''}"><input type="checkbox" data-df="dodge" ${T.dodge ? 'checked' : ''}><span>Count dodge</span><small>${pct(R.dodge)}</small></label>
          ${R.mercInfo.map(m => `<label class="chip merc${m.on ? ' on' : ''}" title="Everything ${esc(m.name)} gives you, on or off together. The same switch as on Damage Theory Craft."><input type="checkbox" data-dfmerc="${m.role}" ${m.on ? 'checked' : ''}><span>${m.role === 'mercMain' ? 'Hired' : 'Reinforcement'}: ${esc(m.name)}</span><small>${m.n} power${m.n === 1 ? '' : 's'}</small></label>`).join('')}
          ${R.mercDR.filter(x => R.mercInfo.some(m => m.role === x.role && m.on)).map(x => `<label class="chip merc${x.on ? ' on' : ''}" title="${esc(x.merc)}, ${x.role === 'mercMain' ? 'hired mercenary' : 'reinforcement'}. Counted at its full value."><input type="checkbox" data-dfm="${esc(x.id)}" ${x.on ? 'checked' : ''}><span>${esc(x.merc)}: ${esc(x.name)}</span><small>${f(x.v, 0)}% less</small></label>`).join('')}
        </div>
        ${R.mercInfo.length ? '<p class="note merc-how"><b>Mercenary switches.</b> Green boxes turn your hired mercenary or reinforcement on and off. Buffs count at full strength while on.</p>' : '<p class="note merc-how"><b>Mercenary buffs.</b> Set up a mercenary on the Mercenaries page to get on and off switches here.</p>'}
        <p class="note">Tier ${R.tierNo}: monsters deal x${f(R.tier.dmg, 2)} damage and have x${f(R.tier.hp, 2)} life. Monsters are level ${MON_LEVEL}. Weakened enemies deal 20% less if normal, 15% if elite and 10% if a boss. Block and dodge feed the Average column only.</p>
      </section>
      <div class="tc-grid">
        <section class="tc-box"><h3>Your defenses</h3>
          <div class="tc-row"><span>Maximum Life</span><b class="num">${f(R.life)}</b><small>${f(R.baseLife)} base at level ${MON_LEVEL}, plus ${f(R.lifeFlat)} from the build, then Life bonuses${+T.barrier ? ', plus your ' + f(+T.barrier) + ' Barrier' : ''}</small></div>
          <div class="tc-row"><span>Armor</span><b class="num">${f(R.armor)}</b><small>${pct(R.armorDR)} less damage from every hit</small></div>
          ${R.ehp.map(e => `<div class="tc-row"><span>${e.t} Resistance</span><b class="num">${f(e.R)}</b><small>${pct(R.resDR(e.t))} less ${e.t.toLowerCase()} damage</small></div>`).join('')}
          <div class="tc-row"><span>Damage Reduction</span><b class="num">${pct(1 - R.drMul)}</b><small>${R.drParts.length ? R.drParts.map(p => `${f(p.v, 1)}% ${esc(p.src)}`).join(', ') + ', multiplied' : 'None on the build yet'}</small></div>
        </section>
        <section class="tc-box"><h3>Effective Life by damage type</h3>
          ${R.ehp.map(e => `<div class="bucket"><b>${e.t}</b><span>${f(e.ehp)} <small>${pct(e.dr)} total reduction</small></span></div>`).join('')}
          <p class="note">Effective Life is your Life divided by what gets through. It ignores block, dodge, barriers and healing.</p>
        </section>
        <div class="mon-cards wide">${R.cards.map(monCard).join('')}</div>
        <section class="tc-box wide"><h3>What helps most against these monsters</h3>
          <p class="note">One more top-roll affix of each kind, measured as average Effective Life across every attack and affix hit above.</p>
          ${R.whatIf.map((w, i) => `<div class="bucket${i === 0 ? ' best' : ''}"><b>${esc(w.n)}</b><span>+${f(w.d.v, 1)}${/%|Reduction/.test(w.n) ? '%' : ''}: <b>+${pct(w.gain)}</b> Effective Life</span></div>`).join('')}
        </section>
        <section class="tc-box wide"><h3>How these numbers are worked out</h3>
          <p class="note">Confirmed: difficulty scaling, read tier by tier from the game files (4.74% more damage per tier from Pit 11 to 110, 2.37% after Pit 110, and bigger steps below Pit 10, matching Maxroll and logged Pit tests, so Torment 12 hits 64.7 times harder than Torment 1), base player Life (50 at level 1, as Selig testers measured), the Torment to Pit tiers, and the armor and resistance curves (the game's 0.9 x rating / (rating + 5,100) for armor and + 1,020 for resistance are Maxroll's level 70 formulas, and match published Season 15 measurements). Armor, resistance and each Damage Reduction source multiply. Not yet checked against a hit in game: how a monster's attack share and the level table build its raw hit, and monster Life. Players have logged hits for one-shot breakpoints and Pit scaling, but nobody has published that piece. The game works out on-hit effects such as Fury from the hit before your defenses, and the damage you take after them, which is the order used here. The Character Level tooltip's line about level difference is treated as old launch wording, since monsters now match your level and difficulty comes from the tier multipliers. Elite affix groups are our own reading: the game caps each group but the files do not name which affix sits in which.</p>
        </section>
      </div></div>`;
    const set = (k, v) => { T[k] = v; commit(); renderDefense(); };
    $('#dfDiff').onchange = e => { T.pit = 0; set('diff', +e.target.value); };
    $$('#panel-defense [data-gosubmit]').forEach(b => b.onclick = () => { subSt.mon = b.dataset.gosubmit; subSt.atk = ''; subSt.tier = +T.diff; showSite('submit'); });
    { const bz = $('#dfBarrier'); if (bz) bz.onchange = e => set('barrier', Math.max(0, Math.round(+e.target.value || 0))); }
    $('#dfPit').onchange = e => set('pit', Math.max(0, Math.min(150, Math.round(+e.target.value || 0))));
    $('#dfNormal').onchange = e => { T.mon.normal = e.target.value; commit(); renderDefense(); };
    $('#dfElite').onchange = e => { T.mon.elite = e.target.value; commit(); renderDefense(); };
    $('#dfBoss').onchange = e => { T.mon.boss = e.target.value; commit(); renderDefense(); };
    $('#dfWorld').onchange = e => { T.mon.world = e.target.value; commit(); renderDefense(); };
    $$('#panel-defense [data-df]').forEach(c => c.onchange = () => set(c.dataset.df, c.checked));
    $$('#panel-defense [data-dfmerc]').forEach(c => c.onchange = () => { const st = tcState().st; st[c.dataset.dfmerc] = c.checked; commit(); renderDefense(); });
    $$('#panel-defense [data-dfm]').forEach(c => c.onchange = () => { T.mdr = T.mdr || {}; T.mdr[c.dataset.dfm] = c.checked; commit(); renderDefense(); });
    $$('#panel-defense [data-rar]').forEach(b => b.onclick = () => set('rar', b.dataset.rar));
    $$('#panel-defense [data-aff]').forEach(s => s.onchange = () => { const a = T.aff.slice(0, R.nAff); a[+s.dataset.aff] = s.value; T.aff = a; commit(); renderDefense(); });
    const rb = $('#affRoll'); if (rb) rb.onclick = () => set('aff', rollAffixes(R.kind, R.nAff));
    const cb = $('#affClear'); if (cb) cb.onclick = () => set('aff', []);
  }


  // ---------- build notes ----------
  const NOTE_TAGS = ['Leveling', 'Endgame', 'Boss Killer', 'Push', 'Speed Farm', 'Infernal Hordes', 'The Tower', 'Hardcore', 'PvP'];
  function renderNotes() {
    const box = $('#panel-notes'); S.notes = Object.assign({ about: '', strengths: '', weaknesses: '', rotation: '', glyphs: '', video: '', filter: '', tags: [] }, S.notes || {});
    const N = S.notes; const field = (k, label, hint, rows) => `<label class="note-f"><span>${label}</span>${hint ? `<small>${hint}</small>` : ''}<textarea data-note="${k}" rows="${rows || 4}">${esc(N[k] || '')}</textarea></label>`;
    const vid = (N.video || '').match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
    box.innerHTML = `<div class="tc notes">
      <header class="tc-head"><div><h2>Notes</h2><p>Write down how the build plays, what to chase and what to watch out for. Notes travel with the build in share links and exports.</p></div></header>
      <section class="tc-states"><h3>Where it shines</h3><div class="chips">${NOTE_TAGS.map(t => `<label class="chip${N.tags.includes(t) ? ' on' : ''}"><input type="checkbox" data-tag="${esc(t)}" ${N.tags.includes(t) ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}</div></section>
      <div class="notes-grid">
        <section class="tc-box">${field('about', 'About the build', 'What it does and how it kills.', 6)}${field('rotation', 'Rotation', 'The order you press things in, and when.', 5)}</section>
        <section class="tc-box">${field('strengths', 'Strengths', '', 3)}${field('weaknesses', 'Weaknesses', '', 3)}${field('glyphs', 'Glyph and upgrade priority', 'Which glyphs to level first, what to chase on gear.', 3)}</section>
        <section class="tc-box"><label class="note-f"><span>Video guide</span><small>A YouTube link.</small><input data-note="video" type="url" value="${esc(N.video || '')}" placeholder="https://www.youtube.com/watch?v="></label>
          ${vid ? `<div class="note-video"><iframe src="https://www.youtube-nocookie.com/embed/${vid[1]}" title="Video guide" allowfullscreen loading="lazy"></iframe></div>` : ''}
          ${field('filter', 'Loot filter', 'Paste the string from the game\'s loot filter Export. Copy it back into the game with Import.', 3)}
          <button class="btn ghost" id="copyFilter" ${N.filter ? '' : 'disabled'}>Copy loot filter</button></section>
      </div></div>`;
    $$('#panel-notes [data-note]').forEach(x => x.onchange = () => { N[x.dataset.note] = x.value; commit(); if (x.dataset.note === 'video' || x.dataset.note === 'filter') renderNotes(); });
    $$('#panel-notes [data-tag]').forEach(c => c.onchange = () => { const t = c.dataset.tag; N.tags = c.checked ? [...new Set(N.tags.concat(t))] : N.tags.filter(x => x !== t); commit(); renderNotes(); });
    $('#copyFilter').onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(N.filter) : Promise.reject()).then(() => toast('Loot filter copied'), () => prompt('Copy the loot filter', N.filter)); };
  }

  // ---------- export and import ----------
  // Our own format: { app, format, game, exported, build }. Import also takes our share links and Maxroll planner links or JSON.
  const EXPORT_FORMAT = 1;
  function exportBuild() {
    const out = { app: 'D4 Build Planner', format: EXPORT_FORMAT, game: data().meta ? data().meta.build || '' : '', exported: new Date().toISOString(), build: S };
    const blob = new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (S.name || 'build').replace(/[^\w -]+/g, '').trim().replace(/\s+/g, '_') + '.json';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); toast('Build exported');
  }
  function useBuild(b, label) { S = migrate(Object.assign(blank(b.cls || 'Paladin'), b)); renderAll(); commit(); closeImport(); toast(label || 'Build loaded'); }
  const MAXROLL_ID = s => { const m = String(s).trim().match(/maxroll\.gg\/d4\/planner\/([A-Za-z0-9]+)/) || String(s).trim().match(/^([a-z0-9]{6,12})$/i); return m ? m[1] : null; };
  // Maxroll item slots (from the Diablo IV Companion app's mapping)
  const MX_SLOT = { 4: 'helm', 5: 'chest', 6: 'offhand', 7: 'weapon', 8: 'weapon', 9: 'weapon', 10: 'weapon', 11: 'weapon', 12: 'weapon', 13: 'gloves', 14: 'pants', 15: 'boots', 16: 'ring1', 17: 'ring2', 18: 'amulet' };
  const MX_WTYPE = { '1HAxe': 'Axe', '1HMace': 'Mace', '1HSword': 'Sword', '1HFlail': 'Flail', '1HDagger': 'Dagger', '1HWand': 'Wand', '1HScythe': 'Scythe', '2HAxe': 'Axe2H', '2HMace': 'Mace2H', '2HSword': 'Sword2H', '2HScythe': 'Scythe2H', '2HPolearm': 'Polearm', '2HStaff': 'Staff', '2HBow': 'Bow', '2HCrossbow': 'Crossbow2H', '2HGlaive': 'Glaive', '2HQuarterstaff': 'Quarterstaff' };
  function fromMaxroll(raw, profileIdx) {
    let top = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const d = typeof top.data === 'string' ? JSON.parse(top.data) : (top.data || top);
    const sno = (window.D4SNO || {})[S.ver] || (window.D4SNO || {}).live || { affix: {} };
    const aff = nid => sno.affix[String(nid)] || null;
    const profiles = d.profiles || []; const P = profiles[profileIdx || 0]; if (!P) throw new Error('No profiles in this Maxroll build');
    const G = GD(); const items = d.items || {}; const gear = {}; const skipped = [];
    const allClasses = {};
    for (const [slotKey, itemIdx] of Object.entries(P.items || {})) {
      const sl = MX_SLOT[+slotKey]; if (!sl) continue; if (gear[sl] && sl === 'weapon') continue;
      const it = items[itemIdx]; if (!it) continue; const g = { affixes: [], tempers: [], gems: [] };
      const uniq = (data().uniques || []).find(u => u.id === it.id);
      if (uniq) { g.item = { t: 'unique', id: uniq.id }; (uniq.classes || []).forEach(c => { allClasses[c] = (allClasses[c] || 0) + 1; }); }
      else {
        const asp = (it.aspects || []).map(a => aff(a.nid)).find(Boolean);
        const A = asp && (data().aspects || []).find(a => a.id === asp);
        if (A) { g.item = { t: 'aspect', id: A.id }; (A.classes || []).forEach(c => { allClasses[c] = (allClasses[c] || 0) + 1; }); }
        else if (it.aspects && it.aspects.length) skipped.push(`${sl}: aspect not found`);
        const wt = sl === 'weapon' && Object.keys(MX_WTYPE).find(k => String(it.id || '').startsWith(k)); if (wt) g.wtype = MX_WTYPE[wt];
      }
      (it.explicits || []).forEach(e => { const id = aff(e.nid); if (id && G.affixes.some(a => a.id === id) && g.affixes.length < N_AFF) g.affixes.push({ id, ga: !!e.greater }); else if (!id) skipped.push(`${sl}: affix ${e.nid}`); });
      (it.tempered || []).forEach(t => { const id = aff(t.nid); const man = id && G.tempers.find(m => m.opts.some(o => o.id === id)); if (man && g.tempers.length < N_TEMP) g.tempers.push({ rid: man.id, oid: id }); });
      if (g.item) gear[sl] = g;
    }
    const cls = d.class && Object.keys(data().classes).includes(d.class) ? d.class : Object.entries(allClasses).sort((a, b) => b[1] - a[1]).map(x => x[0]).find(c => Object.keys(data().classes).includes(c)) || S.cls;
    const b = Object.assign(blank(cls), { name: top.name || P.name || 'Maxroll import', gear });
    b.notes = Object.assign({}, b.notes || {}, { about: `Imported from Maxroll (${top.id || ''}${P.name ? ', ' + P.name : ''}). Gear, aspects, affixes, greater affixes and tempers came across. Skills and Paragon are not read from Maxroll yet, so set those here.` });
    return { build: b, profiles: profiles.map(p => p.name || 'Profile'), skipped };
  }
  function openImport() {
    const box = $('#importBox'); box.hidden = false;
    box.innerHTML = `<div class="imp-card" role="dialog" aria-label="Load a build"><header><h3>Load a build</h3><button class="btn ghost small" id="impClose">Close</button></header>
      <p class="note">Paste one of these, or choose a file: a D4 Build Planner export or share link, a Maxroll planner link or ID (maxroll.gg/d4/planner/...), or the text from a Maxroll build page.</p>
      <textarea id="impText" rows="6" placeholder="Paste a link, an ID or build text"></textarea>
      <div class="imp-row"><button class="btn" id="impGo">Load</button><label class="btn ghost">Choose file<input type="file" id="impFile" accept=".json,application/json" hidden></label></div>
      <div id="impMsg" class="note"></div></div>`;
    $('#impClose').onclick = closeImport;
    $('#impFile').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { $('#impText').value = t; runImport(); }); };
    $('#impGo').onclick = () => runImport();
  }
  function closeImport() { const b = $('#importBox'); if (b) { b.hidden = true; b.innerHTML = ''; } }
  async function runImport(profileIdx) {
    const msg = $('#impMsg'); const raw = ($('#impText').value || '').trim(); if (!raw) { msg.textContent = 'Paste something first.'; return; }
    const say = h => { msg.innerHTML = h; };
    try {
      const h = raw.match(/#b=(.+)$/); if (h) { useBuild(JSON.parse(decodeURIComponent(escape(atob(h[1])))), 'Shared build loaded'); return; }
      if (/^[{[]/.test(raw)) {
        const j = JSON.parse(raw);
        if (j.app === 'D4 Build Planner' && j.build) { useBuild(j.build, 'Build loaded'); return; }
        if (j.cls && j.gear) { useBuild(j, 'Build loaded'); return; }
        const r = fromMaxroll(j, profileIdx || 0); return pickProfile(r, j);
      }
      const mid = MAXROLL_ID(raw);
      if (mid) {
        say('Asking Maxroll for the build...');
        try { const res = await fetch(`https://planners.maxroll.gg/profiles/d4/${mid}`); if (!res.ok) throw new Error(res.status); const j = await res.json(); return pickProfile(fromMaxroll(j, profileIdx || 0), j); }
        catch (e) { say(`Maxroll did not let this page read the build directly. Open <a href="https://planners.maxroll.gg/profiles/d4/${esc(mid)}" target="_blank" rel="noopener">the build's data</a>, select all, copy, and paste it here.`); return; }
      }
      say('That does not look like a link, an ID or build text this page knows.');
    } catch (e) { say('Could not read that: ' + esc(e.message || String(e))); }
  }
  function pickProfile(r, raw, idx) {
    const msg = $('#impMsg');
    msg.innerHTML = `${r.profiles.length > 1 ? `<label>Variant <select id="impProf">${r.profiles.map((p, i) => `<option value="${i}" ${i === (idx || 0) ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select></label>` : ''}
      <p>${r.build.cls}: ${Object.keys(r.build.gear).length} items found.${r.skipped.length ? ` ${r.skipped.length} lines did not match this game version.` : ''} Skills and Paragon are not read from Maxroll yet, so set those here.</p>
      <button class="btn" id="impUse">Use this build</button>`;
    const ps = $('#impProf'); if (ps) ps.onchange = () => pickProfile(fromMaxroll(raw, +ps.value), raw, +ps.value);
    $('#impUse').onclick = () => useBuild(r.build, 'Maxroll build loaded');
  }

  // ---------- tabs and wiring ----------
  let tab = 'sheet';
  function showTab(t) {
    if (t === 'library') { showSite('library'); return; }
    if (site !== 'planner') { tab = t; showSite('planner'); return; }
    tab = t;
    $$('#tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
    const MECH = S.cls === 'Warlock' ? { title: 'Soul Shards' } : (data().mechanics || {})[S.cls];
    if (t === 'shards' && !MECH) t = tab = 'sheet';
    $$('#tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
    const sb = $('#tabs [data-tab=shards]'); if (sb) { sb.hidden = !MECH; if (MECH) sb.textContent = MECH.title; }
    ['tree', 'paragon', 'gear', 'charms', 'sheet', 'theory', 'defense', 'mercs', 'warplans', 'shards', 'notes', 'calc', 'codex', 'library'].forEach(k => { const el = $('#panel-' + k); if (el) el.hidden = k !== t; });
    if (t === 'library') renderLibrary(); if (t === 'gear') renderGear(); if (t === 'charms') renderCharms(); if (t === 'sheet') renderSheet(); if (t === 'theory') renderTheory(); if (t === 'defense') renderDefense(); if (t === 'mercs') renderMercs(); if (t === 'warplans') renderWarplans(); if (t === 'shards') renderMechanic(); if (t === 'notes') renderNotes(); if (t === 'calc') renderCalc(); if (t === 'codex') renderCodex();
    if (t === 'tree') renderTree();
    if (t === 'paragon' && PARA) PARA.render();
  }
  function renderAll() { view = null; if (PARA) PARA.reset(); renderRail(); renderHeader(); if (tab === 'tree') renderTree(); renderInspector(); renderLedger(); showTab(tab); }

  $$('#tabs button').forEach(b => b.onclick = () => showTab(b.dataset.tab));
  $('#buildName').onchange = e => { S.name = e.target.value || 'Untitled build'; commit(); };
  $$('.season-toggle button').forEach(b => b.onclick = () => { if (!ALL[b.dataset.ver]) return; S.ver = b.dataset.ver; renderAll(); commit(); toast(S.ver === 'ptr' ? 'Showing Season 16 PTR data' : 'Showing Season 15 live data'); });
  $('#shareBtn').onclick = () => {
    const url = location.href.split('#')[0] + '#b=' + btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast('Share link copied'), () => { prompt('Copy this link', url); });
  };
  $('#exportBtn').onclick = exportBuild; $('#importBtn').onclick = openImport;
  $('#resetBtn').onclick = () => { if (confirm('Start a new build? This clears the current one.')) { S = blank(S.cls); renderAll(); commit(); } };
  $('#pickerClose').onclick = closePicker;
  $('#picker').addEventListener('click', e => { if (e.target.id === 'picker') closePicker(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#picker').hidden) closePicker(); });

  if (!ALL[S.ver]) S.ver = 'live';
  if (!CLASS_LIST.includes(S.cls)) S.cls = 'Paladin';
  wireTree(); if (PARA) PARA.wire(); renderAll();
  try { const s0 = sessionStorage.getItem('d4bp-site'); if (s0 && s0 !== 'planner') showSite(s0); } catch (e) { /* ignore */ }
})();
