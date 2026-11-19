/* Paragon boards for D4 Build Planner. Installs window.D4PARAGON(api) and returns render hooks. */
(function (root) {
  'use strict';
  root.D4PARAGON = function (A) {
    const { $, $$, esc, toast, openPicker, getS, data, commit } = A;
    const C = 60; // world units per cell
    const STAT_COL = { Strength: '#c0603f', Intelligence: '#5a86c9', Willpower: '#5fa25a', Dexterity: '#cfa83f' };
    const STATS = ['Strength', 'Intelligence', 'Willpower', 'Dexterity'];
    const MAX_BOARDS = 5;
    const RAR = { normal: 1, magic: 2, rare: 3 };
    let pview = null, psel = null;

    const PD = () => data().paragon;
    const cls = () => getS().cls;
    const classBoards = () => (PD() && PD().boards[cls()]) || [];
    const bdef = id => classBoards().find(b => b.id === id);
    const node = k => PD().nodes[k];
    const fmt = (v, d) => D4T.fmtNum(v, d);

    function state() {
      const S = getS();
      if (!S.paragon || !Array.isArray(S.paragon.boards)) S.paragon = { boards: [], alloc: {}, glyphs: {}, glyphLv: {}, cap: 300, base: { Strength: 0, Intelligence: 0, Willpower: 0, Dexterity: 0 } };
      const P = S.paragon; const B = classBoards();
      if (B.length && (!P.boards.length || !bdef(P.boards[0].id))) { P.boards = [{ id: B[0].id, ox: 0, oy: 0, r: 0 }]; P.alloc = {}; P.glyphs = {}; }
      P.boards = P.boards.filter(b => bdef(b.id));
      if (!P.base) P.base = { Strength: 0, Intelligence: 0, Willpower: 0, Dexterity: 0 };
      if (!P.glyphLv) P.glyphLv = {};
      if (!P.cap) P.cap = 300;
      return P;
    }

    // ---------- geometry ----------
    function rot(x, y, w, h, r) {
      switch (r & 3) { case 1: return [h - 1 - y, x]; case 2: return [w - 1 - x, h - 1 - y]; case 3: return [y, w - 1 - x]; default: return [x, y]; }
    }
    const rotDir = (dx, dy, r) => { for (let i = 0; i < (r & 3); i++) [dx, dy] = [-dy, dx]; return [dx, dy]; };
    function gateDir(def, x, y) { if (y === 0) return [0, -1]; if (y === def.h - 1) return [0, 1]; if (x === 0) return [-1, 0]; if (x === def.w - 1) return [1, 0]; return null; }

    function world() {
      const P = state(); const cells = new Map(); const list = [];
      P.boards.forEach((b, bi) => {
        const def = bdef(b.id); if (!def) return;
        for (const [x, y, k] of def.cells) {
          const [rx, ry] = rot(x, y, def.w, def.h, b.r); const wx = b.ox + rx, wy = b.oy + ry;
          const c = { bi, b, def, x, y, k, n: node(k), wx, wy, key: b.id + ':' + x + ',' + y, wk: wx + ',' + wy };
          cells.set(c.wk, c); list.push(c);
        }
      });
      return { cells, list };
    }
    const square = (b) => { const d = bdef(b.id); return { x0: b.ox, y0: b.oy, x1: b.ox + d.w - 1, y1: b.oy + d.h - 1 }; };
    const inSq = (q, x, y) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1;
    const overlap = (a, b) => !(a.x1 < b.x0 || b.x1 < a.x0 || a.y1 < b.y0 || b.y1 < a.y0);

    function openGates() {
      const P = state(); const W = world(); const out = [];
      if (P.boards.length >= MAX_BOARDS) return out;
      for (const c of W.list) {
        if (c.n.r !== 'gate') continue;
        const d0 = gateDir(c.def, c.x, c.y); if (!d0) continue;
        const [dx, dy] = rotDir(d0[0], d0[1], c.b.r);
        const tx = c.wx + dx, ty = c.wy + dy;
        if (P.boards.some(b => inSq(square(b), tx, ty))) continue;
        out.push({ gx: c.wx, gy: c.wy, dx, dy, from: c.b.id });
      }
      return out;
    }
    function placeAt(id, g, r0) {
      const P = state(); const def = bdef(id);
      for (let t = 0; t < 4; t++) {
        const r = (r0 + t) & 3;
        for (const [x, y, k] of def.cells) {
          if (node(k).r !== 'gate') continue;
          const d0 = gateDir(def, x, y); if (!d0) continue;
          const [dx, dy] = rotDir(d0[0], d0[1], r);
          if (dx !== -g.dx || dy !== -g.dy) continue;
          const [rx, ry] = rot(x, y, def.w, def.h, r);
          const nb = { id, ox: g.gx + g.dx - rx, oy: g.gy + g.dy - ry, r, at: { gx: g.gx, gy: g.gy, dx: g.dx, dy: g.dy } };
          const q = square(nb);
          if (P.boards.some(b => b.id !== id && overlap(square(b), q))) continue;
          return nb;
        }
      }
      return null;
    }
    function children(b) { const P = state(); const q = square(b); return P.boards.filter(o => o !== b && o.at && inSq(q, o.at.gx, o.at.gy)); }

    // ---------- allocation ----------
    const startCell = W => W.list.find(c => c.n.r === 'start');
    function allocSet() { const P = state(); const W = world(); const st = startCell(W); const set = new Set(Object.keys(P.alloc)); if (st) set.add(st.key); return { set, W, st }; }
    const NB = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function connectedFrom(W, set, st) {
      const seen = new Set(); if (!st || !set.has(st.key)) return seen;
      const q = [st]; seen.add(st.key);
      while (q.length) { const c = q.pop(); for (const [dx, dy] of NB) { const n = W.cells.get((c.wx + dx) + ',' + (c.wy + dy)); if (n && set.has(n.key) && !seen.has(n.key)) { seen.add(n.key); q.push(n); } } }
      return seen;
    }
    function spent() { const P = state(); return Object.keys(P.alloc).length; }
    function toggle(wk, add) {
      const P = state(); const { set, W, st } = allocSet(); const c = W.cells.get(wk); if (!c) return;
      if (c.n.r === 'start') return;
      if (add) {
        if (set.has(c.key)) { if (c.n.r === 'socket') pickGlyph(c.b.id); return; }
        const ok = NB.some(([dx, dy]) => { const n = W.cells.get((c.wx + dx) + ',' + (c.wy + dy)); return n && set.has(n.key); });
        if (!ok) { toast('Connect it to a node you already have'); return; }
        if (spent() >= P.cap) { toast(`All ${P.cap} paragon points are spent`); return; }
        P.alloc[c.key] = 1;
      } else {
        if (!set.has(c.key)) return;
        set.delete(c.key);
        const reach = connectedFrom(W, set, st); const cut = [...set].filter(k => !reach.has(k));
        if (cut.length) { toast(`Removing it would cut off ${cut.length} node${cut.length === 1 ? '' : 's'}`); return; }
        delete P.alloc[c.key];
        if (c.n.r === 'socket') delete P.glyphs[c.b.id];
      }
      psel = wk; render(); commit();
    }

    // ---------- glyphs ----------
    const classGlyphs = () => Object.entries(PD().glyphs).filter(([, g]) => !g.classes.length || g.classes.includes(cls())).map(([id, g]) => Object.assign({ id }, g));
    const glyphLv = id => Math.max(1, Math.min(100, +state().glyphLv[id] || 100));
    const radius = L => L >= 46 ? 5 : L >= 15 ? 4 : 3;
    const scal = (a, L) => a.b * (a.s0 + a.s1 * (L - 1)) * 100 / (a.op === 2 ? 3 : 1);
    // the stat a glyph counts is the one its bonus and threshold name (Honed and Feverous list another stat on the glyph itself)
    const gStat = g => (g.thr && g.thr[0] && g.thr[0][0]) || ((g.a || []).find(a => a.src) || {}).src || g.stat;
    function glyphLine(a, L, val) {
      const v = val !== undefined ? val : scal(a, L);
      return a.d.replace(/§([^§]*)§/g, (m, f) => `<b class="num">${(f.includes('+') ? '+' : '')}${fmt(v, 1)}${f.includes('%') ? '%' : ''}${f.includes('x') ? '[x]' : ''}</b>`);
    }
    function pickGlyph(boardId) {
      const P = state(); const used = new Set(Object.entries(P.glyphs).filter(([b]) => b !== boardId).map(([, g]) => g));
      const items = classGlyphs().filter(g => !used.has(g.id)).map(g => ({
        id: g.id, name: g.name, kind: 'glyph', sub: `${g.stat} glyph, ${g.kind === 'Main' ? 'main stat' : 'side stat'}`,
        desc: g.a.map(a => glyphLine(a, glyphLv(g.id))).join('<br>'),
      }));
      openPicker('Socket a glyph', items, it => { P.glyphs[boardId] = it.id; render(); commit(); });
    }

    // ---------- math ----------
    function compute() {
      const P = state(); const { set, W } = allocSet();
      const glyphs = [];
      for (const b of P.boards) {
        const gid = P.glyphs[b.id]; if (!gid) continue; const g = PD().glyphs[gid]; if (!g) continue;
        const sock = W.list.find(c => c.b === b && c.n.r === 'socket'); if (!sock || !set.has(sock.key)) continue;
        const L = glyphLv(gid);
        glyphs.push({ id: gid, g, L, R: radius(L), sock, b, count: 0 });
      }
      const inR = (c, G) => c.b === G.b && c !== G.sock && Math.abs(c.wx - G.sock.wx) + Math.abs(c.wy - G.sock.wy) <= G.R;
      const mult = c => { let m = 1; for (const G of glyphs) if (inR(c, G)) for (const a of G.g.a) if (a.op === 1 && a.nr && RAR[c.n.r] === a.nr) m += scal(a, G.L) / 100; return m; };
      const taken = W.list.filter(c => set.has(c.key));
      const purchased = { Strength: 0, Intelligence: 0, Willpower: 0, Dexterity: 0 };
      const cm = new Map(); for (const c of taken) cm.set(c, mult(c));
      for (const c of taken) for (const [a, v] of (c.n.c || [])) if (purchased[a] !== undefined) purchased[a] += v * cm.get(c);
      for (const G of glyphs) for (const c of taken) if (inR(c, G)) for (const [a, v] of (c.n.c || [])) if (a === gStat(G.g)) G.count += v * cm.get(c);
      const total = a => (+P.base[a] || 0) + purchased[a];
      const rareMet = c => {
        if (!c.n.t || !c.n.b) return false;
        return c.n.t.some(([a, base, per]) => total(a) >= base + per * c.bi);
      };
      const lines = {};
      const add = (ti, v) => { lines[ti] = (lines[ti] || 0) + v; };
      for (const c of taken) {
        const m = cm.get(c);
        c.n.s.forEach(([ti, v], i) => { add(ti, v * m); if (c.n.r === 'rare' && c.n.b && c.n.b.includes(i) && rareMet(c)) add(ti, v * m); });
      }
      const glyphOut = glyphs.map(G => {
        const thr = G.g.thr ? G.g.thr[0][1] : 0;
        const per5 = Math.floor(G.count / 5);
        return { G, thr, met: G.count >= thr, per5, legendary: G.L >= 46 };
      });
      return { set, W, taken, purchased, total, rareMet, lines, glyphs: glyphOut, inR, cm };
    }

    // ---------- render ----------
    function bounds() {
      const P = state(); let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const b of P.boards) { const q = square(b); x0 = Math.min(x0, q.x0); y0 = Math.min(y0, q.y0); x1 = Math.max(x1, q.x1); y1 = Math.max(y1, q.y1); }
      const pad = 3; return { x: (x0 - pad) * C, y: (y0 - pad - 5) * C, w: (x1 - x0 + 1 + pad * 2) * C, h: (y1 - y0 + 1 + pad * 2 + 5) * C };
    }
    const DEFS = `<defs>
      <linearGradient id="pgBoard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1713"/><stop offset="0.5" stop-color="#14100d"/><stop offset="1" stop-color="#0d0a08"/></linearGradient>
      <radialGradient id="pgShade" cx="50%" cy="50%" r="72%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient>
      <linearGradient id="pgRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9c7c45"/><stop offset="0.5" stop-color="#4d3b20"/><stop offset="1" stop-color="#85683a"/></linearGradient>
      <filter id="pgLine" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="pgLeg" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#7a3f17"/><stop offset="1" stop-color="#241208"/></radialGradient>
      <radialGradient id="pgRare" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#5e4718"/><stop offset="1" stop-color="#1e170a"/></radialGradient>
      <radialGradient id="pgSock" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#2e2a33"/><stop offset="1" stop-color="#0c0b0e"/></radialGradient>
      <filter id="pgGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
    function tile(c, on, R, glyph) {
      const x = c.wx * C, y = c.wy * C; const n = c.n;
      const core = (n.c || [])[0]; const sc = core ? STAT_COL[core[0]] : '#8a7a62';
      const sel = psel === c.wk ? ' sel' : '';
      let body;
      switch (n.r) {
        case 'normal':
          body = `<rect x="${x - 13}" y="${y - 13}" width="26" height="26" rx="3" class="pn-normal" style="--sc:${sc}"/>`; break;
        case 'magic':
          body = `<rect x="${x - 18}" y="${y - 18}" width="36" height="36" rx="4" class="pn-magic" style="--sc:${sc}"/>`; break;
        case 'rare':
          body = `<g transform="translate(${x} ${y})"><rect x="-23" y="-23" width="46" height="46" rx="5" class="pn-rare"/><g class="emb">${D4ART.emblem(n.n, n.g, '', 0.42)}</g></g>`; break;
        case 'legendary':
          body = `<g transform="translate(${x} ${y})"${on ? ' filter="url(#pgGlow)"' : ''}><rect x="-36" y="-36" width="72" height="72" rx="6" transform="rotate(45)" class="pn-leg"/><g class="emb">${D4ART.emblem(n.n, n.g, '', 0.6)}</g></g>`; break;
        case 'gate':
          body = `<g transform="translate(${x} ${y})"><rect x="-22" y="-22" width="44" height="44" rx="22" class="pn-gate"/><path d="M-11 12 V-2 A11 11 0 0 1 11 -2 V12" class="pn-gate-arch"/></g>`; break;
        case 'socket':
          body = `<g transform="translate(${x} ${y})"><circle r="27" class="pn-sock"/><circle r="19" fill="url(#pgSock)"/>${glyph ? `<g class="emb">${D4ART.emblem(glyph.name, [glyph.stat], '', 0.36).replace(/stroke="[^"]*"/, `stroke="${STAT_COL[glyph.stat] || '#d9c9a3'}"`)}</g>` : ''}</g>`; break;
        case 'start':
          body = `<g transform="translate(${x} ${y})"><circle r="26" class="pn-start"/><path d="M0 -14 V14 M-14 0 H14" class="pn-start-x"/></g>`; break;
        default: body = '';
      }
      return `<g class="pn ${n.r}${on ? ' on' : ''}${R ? ' inr' : ''}${sel}" data-c="${c.wk}">${body}</g>`;
    }
    function render() {
      const svg = $('#pboard'); if (!svg || !PD()) return;
      const P = state(); if (!pview) pview = bounds();
      const R = compute(); const { set, W } = R;
      let html = DEFS;
      // boards
      for (const b of P.boards) {
        const d = bdef(b.id);
        let ex0 = Infinity, ey0 = Infinity, ex1 = -Infinity, ey1 = -Infinity;
        for (const [cx, cy] of d.cells) { const [rx, ry] = rot(cx, cy, d.w, d.h, b.r); ex0 = Math.min(ex0, rx); ey0 = Math.min(ey0, ry); ex1 = Math.max(ex1, rx); ey1 = Math.max(ey1, ry); }
        if (!d.start) { ex0 = 0; ey0 = 0; ex1 = d.w - 1; ey1 = d.h - 1; }
        const x = (b.ox + ex0 - 0.5) * C, y = (b.oy + ey0 - 0.5) * C, w = (ex1 - ex0 + 1) * C, h = (ey1 - ey0 + 1) * C;
        const isStart = d.start;
        const stud = (sx, sy) => `<rect x="${sx - 16}" y="${sy - 16}" width="32" height="32" transform="rotate(45 ${sx} ${sy})" class="pb-stud"/>`;
        html += `<g class="pboard"><rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="10" class="pb-rim"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="pb-bg"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="pb-shade"/><rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" rx="2" class="pb-inner"/>
          ${stud(x, y)}${stud(x + w, y)}${stud(x, y + h)}${stud(x + w, y + h)}
          <text class="pb-name" x="${x + 10}" y="${isStart ? y + h + 96 : y - 44}">${esc(d.name)}</text>
          ${isStart ? '' : `<g class="pb-btn" data-act="rot" data-b="${b.id}" transform="translate(${x + w - 190} ${y - 92}) scale(1.6)"><rect width="48" height="40" rx="8"/><path d="M14 22 A10 10 0 1 1 24 30 M14 22 l-5 -6 M14 22 l7 -3"/><title>Rotate board</title></g>
          <g class="pb-btn danger" data-act="del" data-b="${b.id}" transform="translate(${x + w - 90} ${y - 92}) scale(1.6)"><rect width="48" height="40" rx="8"/><path d="M16 12 L32 28 M32 12 L16 28"/><title>Remove board</title></g>`}</g>`;
      }
      // glyph radius tint
      for (const G of R.glyphs) {
        const col = STAT_COL[G.G.g.stat] || '#c9a35a';
        const s = G.G.sock; const r = G.G.R;
        let poly = '';
        for (let dy = -r; dy <= r; dy++) { const span = r - Math.abs(dy); poly += `<rect x="${(s.wx - span - 0.5) * C}" y="${(s.wy + dy - 0.5) * C}" width="${(span * 2 + 1) * C}" height="${C}"/>`; }
        html += `<g class="pg-radius" style="--gc:${col}">${poly}</g>`;
      }
      // lit links
      let links = '';
      for (const c of R.taken) for (const [dx, dy] of [[1, 0], [0, 1]]) { const n = W.cells.get((c.wx + dx) + ',' + (c.wy + dy)); if (n && set.has(n.key)) links += `<line x1="${c.wx * C}" y1="${c.wy * C}" x2="${n.wx * C}" y2="${n.wy * C}"/>`; }
      html += `<g class="pl-glow">${links}</g><g class="pl">${links}</g>`;
      // nodes
      const inAny = c => R.glyphs.some(G => R.inR(c, G.G));
      for (const c of W.list) { const gid = c.n.r === 'socket' ? P.glyphs[c.b.id] : null; html += tile(c, set.has(c.key), inAny(c), gid ? Object.assign({ id: gid }, PD().glyphs[gid]) : null); }
      // attach points
      openGates().forEach((g, i) => {
        const x = (g.gx + g.dx * 1.4) * C, y = (g.gy + g.dy * 1.4) * C;
        html += `<g class="pattach" data-attach="${i}" transform="translate(${x} ${y})"><circle r="26"/><path d="M-10 0 H10 M0 -10 V10"/><title>Attach a board here</title></g>`;
      });
      svg.innerHTML = html;
      svg.setAttribute('viewBox', `${pview.x} ${pview.y} ${pview.w} ${pview.h}`);
      $('#pPoints').textContent = `${spent()} of ${P.cap} points`;
      inspector(R);
    }

    function statLinesHtml(lines) {
      const T = PD().texts; const keys = Object.keys(lines).map(Number).filter(k => lines[k]);
      const isAttr = k => /^§ (Strength|Intelligence|Willpower|Dexterity)$/.test(T[k]);
      const off = k => /Damage|Critical|Attack Speed|Vulnerable|Lucky|Overpower/.test(T[k]) && !/Reduction|Received/.test(T[k]);
      const groups = [['Offense', keys.filter(k => !isAttr(k) && off(k))], ['Defense and utility', keys.filter(k => !isAttr(k) && !off(k))]];
      return groups.filter(g => g[1].length).map(([h, ks]) => `<h3>${h}</h3><ul class="pstat">${ks.sort((a, b) => lines[b] - lines[a]).map(k => `<li>${esc(T[k]).replace('§', `<b class="num">${fmt(lines[k], 1)}</b>`)}</li>`).join('')}</ul>`).join('');
    }
    // hover card for a node, in the same frame as the skill tree tooltips
    function tipHtml(c, R) {
      const P = state(); const T = PD().texts; const n = c.n; const on = R.set.has(c.key);
      const kind = { normal: 'Normal node', magic: 'Magic node', rare: 'Rare node', legendary: 'Legendary node', gate: 'Board attachment gate', socket: 'Glyph socket', start: 'Starting node' }[n.r];
      const col = { normal: '#cfc6b6', magic: '#8fb0ff', rare: '#f2d27a', legendary: '#ff9d4d', gate: '#cfc6b6', socket: '#c9b3f0', start: '#f2d27a' }[n.r];
      let extra = '';
      if (n.r === 'rare' && n.b) { const met = R.rareMet(c); const bonus = n.b.map(i => n.s[i]).filter(Boolean).map(([ti, v]) => esc(T[ti]).replace('§', `<b class="num">${fmt(v * (R.cm.get(c) || 1), 1)}</b>`)).join(', ');
        const req = (n.t || []).map(([a, base, per]) => `${fmt(base + per * c.bi)} ${a}`).join(' or '); extra = `<p class="pt-bonus${met ? ' met' : ''}"><b>Bonus${met ? ' (active)' : ''}:</b> ${bonus}<br><small>Needs ${req}</small></p>`; }
      if (n.r === 'socket') { const gid = P.glyphs[c.b.id]; const g = gid && PD().glyphs[gid]; if (g) { const L = glyphLv(gid); extra = `<p class="pt-glyph"><b>${esc(g.name)}</b>, level ${L}<br><small>${esc(g.stat)} glyph, radius ${radius(L)}</small></p>${g.a.filter(a => a.op !== 2 || true).slice(0, 4).map(a => `<p class="pt-line">${a.op === 5 ? a.d : glyphLine(a, L)}</p>`).join('')}`; } else extra = '<p class="pt-hint">Empty socket. Take the node, then click it to choose a glyph.</p>'; }
      if (n.r === 'gate') extra = '<p class="pt-hint">Take this gate to attach another board beside it.</p>';
      const title = n.n || (n.s[0] ? T[n.s[0][0]].replace('§', fmt(n.s[0][1], 1)) : kind);
      return `<h4 style="color:${col}">${esc(title)}</h4><div class="tt-rank">${kind}${on ? ' <b>taken</b>' : ''}</div><p class="tt-contrib">${esc(c.def.name)} board</p>
        ${n.s.length ? `<ul class="pstat">${nodeLines(c, R)}</ul>` : ''}${n.d ? `<div class="pt-desc">${n.d}</div>` : ''}${extra}
        <p class="pt-foot">${on ? 'Right-click to give the point back' : 'Click to take when it touches a node you have'}</p>`;
    }
    function nodeLines(c, R) {
      const T = PD().texts; const m = R.cm.get(c) || 1;
      return c.n.s.map(([ti, v]) => `<li>${esc(T[ti]).replace('§', `<b class="num">${fmt(v * m, 1)}</b>`)}${m > 1 ? ' <span class="boost">glyph boosted</span>' : ''}</li>`).join('');
    }
    function inspector(R) {
      const box = $('#pInspector'); if (!box) return;
      const P = state(); const c = psel ? R.W.cells.get(psel) : null;
      const T = PD().texts;
      if (c) {
        const n = c.n; const on = R.set.has(c.key);
        const kind = { normal: 'Normal node', magic: 'Magic node', rare: 'Rare node', legendary: 'Legendary node', gate: 'Board attachment gate', socket: 'Glyph socket', start: 'Starting node' }[n.r];
        let extra = '';
        if (n.r === 'rare' && n.b) {
          const met = R.rareMet(c);
          const bonus = n.b.map(i => n.s[i]).filter(Boolean).map(([ti, v]) => esc(T[ti]).replace('§', `<b class="num">${fmt(v * (R.cm.get(c) || 1), 1)}</b>`)).join(', ');
          const req = (n.t || []).map(([a, base, per]) => `${fmt(base + per * c.bi)} ${a} (you have ${fmt(R.total(a))})`).join(' or ');
          extra = `<div class="pbonus${met ? ' met' : ''}"><b>Bonus:</b> ${bonus}<br><small>Needs ${req}${c.bi ? ` on board ${c.bi + 1}` : ''}</small></div>`;
        }
        if (n.r === 'socket') {
          const gid = P.glyphs[c.b.id]; const g = gid && PD().glyphs[gid];
          if (g) {
            const L = glyphLv(gid); const G = R.glyphs.find(x => x.G.id === gid);
            extra = `<div class="pglyph"><h3>${esc(g.name)}</h3><p class="meta">${esc(g.stat)} glyph, radius ${radius(L)}</p>
              <div class="kv"><label for="gLv">Glyph level</label><input id="gLv" type="number" min="1" max="100" value="${L}"></div>
              ${g.a.map(a => {
                if (a.op === 2) { const tot = G ? G.per5 * scal(a, L) : 0; return `<p>${glyphLine(a, L)}<br><small>${fmt(G ? G.G.count : 0)} ${esc(g.stat)} in range: <b class="num">${fmt(tot, 1)}%</b> total</small></p>`; }
                if (a.op === 4) return `<p class="${L >= 46 ? '' : 'off'}"><b>Legendary (level 46):</b> ${glyphLine(a, L)}</p>`;
                if (a.op === 5) return `<p class="${G && G.met ? '' : 'off'}"><b>Needs ${fmt(G ? G.thr : (g.thr ? g.thr[0][1] : 0))} ${esc(g.stat)} in range:</b> ${a.d}</p>`;
                if (a.op === 1) return `<p>${glyphLine(a, L)}</p>`;
                return `<p>${glyphLine(a, L)}</p>`;
              }).join('')}
              <div class="detail-actions"><button class="btn" id="gChange">Change glyph</button><button class="btn ghost danger" id="gClear">Remove glyph</button></div></div>`;
          } else extra = `<p class="empty">${on ? 'Click the socket again, or use the button, to add a glyph.' : 'Take this node first, then add a glyph.'}</p>${on ? '<div class="detail-actions"><button class="btn" id="gChange">Choose glyph</button></div>' : ''}`;
        }
        box.innerHTML = `<h2>${esc(n.n || (n.s[0] ? T[n.s[0][0]].replace('§', fmt(n.s[0][1], 1)) : kind))}</h2>
          <p class="meta">${kind}, ${esc(c.def.name)} board${on ? ', taken' : ''}</p>
          ${n.s.length ? `<ul class="pstat">${nodeLines(c, R)}</ul>` : ''}
          ${n.d ? `<div class="desc">${n.d}</div>` : ''}${extra}
          <p class="empty" style="margin-top:18px"><a href="#" id="pBack">Back to totals</a></p>`;
        const lv = $('#gLv'); if (lv) lv.onchange = () => { P.glyphLv[P.glyphs[c.b.id]] = Math.max(1, Math.min(100, +lv.value || 1)); render(); commit(); };
        const gc = $('#gChange'); if (gc) gc.onclick = () => pickGlyph(c.b.id);
        const gx = $('#gClear'); if (gx) gx.onclick = () => { delete P.glyphs[c.b.id]; render(); commit(); };
        $('#pBack').onclick = e => { e.preventDefault(); psel = null; inspector(compute()); };
        return;
      }
      const leg = R.taken.filter(x => x.n.r === 'legendary');
      box.innerHTML = `<h2>Paragon</h2>
        <p class="meta">${spent()} of ${P.cap} points, ${P.boards.length} of ${MAX_BOARDS} boards</p>
        <p class="empty">Click a node next to one you have to take it, right-click to give it back. The + markers beside open gates attach a new board. Hover anything to read it here.</p>
        <h3>Attributes</h3>
        <div class="pattr">${STATS.map(a => `<div><span style="color:${STAT_COL[a]}">${a}</span><b class="num">${fmt(R.purchased[a])}</b><label>+ gear <input type="number" data-base="${a}" value="${+P.base[a] || 0}" aria-label="${a} from gear and level"></label></div>`).join('')}</div>
        <p class="note">Rare node bonuses check your total attribute, so add what your gear and level give you.</p>
        <div class="kv"><label for="pCap">Paragon points available</label><input id="pCap" type="number" min="1" max="400" value="${P.cap}"></div>
        ${leg.length ? `<h3>Legendary nodes</h3>${leg.map(x => `<div class="pleg"><b>${esc(x.n.n)}</b><div>${x.n.d || ''}</div></div>`).join('')}` : ''}
        ${R.glyphs.length ? `<h3>Glyphs</h3><ul class="pstat">${R.glyphs.map(G => `<li><b>${esc(G.G.g.name)}</b> level ${G.G.L}: ${fmt(G.G.count)} ${esc(gStat(G.G.g))} in range${(() => { const a = G.G.g.a.find(x => x.op === 2); return a ? `, <b class="num">+${fmt(G.per5 * scal(a, G.G.L), 1)}%</b> from its main bonus` : ''; })()}${G.met ? ', threshold bonus active' : `, needs ${fmt(G.thr)} for the threshold bonus`}</li>`).join('')}</ul>` : ''}
        ${statLinesHtml(R.lines) || '<p class="empty">No stats yet.</p>'}`;
      $$('[data-base]', box).forEach(i => i.onchange = () => { P.base[i.dataset.base] = +i.value || 0; render(); commit(); });
      $('#pCap').onchange = e => { P.cap = Math.max(1, +e.target.value || 300); render(); commit(); };
    }

    // ---------- board actions ----------
    function attach(i) {
      const P = state(); const g = openGates()[i]; if (!g) return;
      const used = new Set(P.boards.map(b => b.id));
      const items = classBoards().filter(b => !b.start && !used.has(b.id)).map(b => ({ id: b.id, name: b.name, kind: 'board', sub: 'Paragon board', desc: (b.leg && node(b.leg).d) || '' }));
      if (!items.length) { toast('Every board is already placed'); return; }
      openPicker('Attach a board', items, it => {
        const nb = placeAt(it.id, g, 0);
        if (!nb) { toast('That board does not fit there. Try another gate.'); return; }
        P.boards.push(nb); pview = bounds(); render(); commit();
      });
    }
    function rotate(id) {
      const P = state(); const b = P.boards.find(x => x.id === id); if (!b || !b.at) return;
      if (children(b).length) { toast('Remove the boards attached to this one before rotating it'); return; }
      const others = P.boards.filter(x => x !== b);
      for (let t = 1; t <= 4; t++) {
        const save = P.boards; P.boards = others;
        const nb = placeAt(id, b.at, (b.r + t) & 3); P.boards = save;
        if (nb && nb.r !== b.r) {
          for (const k of Object.keys(P.alloc)) if (k.startsWith(id + ':')) delete P.alloc[k];
          Object.assign(b, nb); render(); commit(); toast('Board rotated. Its points were refunded.'); return;
        }
      }
      toast('No other rotation fits here');
    }
    function removeBoard(id) {
      const P = state(); const b = P.boards.find(x => x.id === id); if (!b || !b.at) return;
      if (children(b).length) { toast('Remove the boards attached to this one first'); return; }
      P.boards = P.boards.filter(x => x !== b);
      for (const k of Object.keys(P.alloc)) if (k.startsWith(id + ':')) delete P.alloc[k];
      delete P.glyphs[id];
      // drop anything now cut off
      const { set, W, st } = allocSet(); const reach = connectedFrom(W, set, st);
      for (const k of Object.keys(P.alloc)) if (!reach.has(k)) delete P.alloc[k];
      psel = null; render(); commit();
    }

    function wire() {
      const svg = $('#pboard'); let drag = null;
      svg.addEventListener('pointerdown', e => {
        const t = e.target.closest && (e.target.closest('[data-c]') || e.target.closest('[data-attach]') || e.target.closest('[data-act]'));
        drag = { x: e.clientX, y: e.clientY, v: Object.assign({}, pview), moved: false, t, btn: e.button };
        if (e.button === 0) svg.setPointerCapture(e.pointerId);
      });
      svg.addEventListener('pointermove', e => {
        if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; svg.classList.add('dragging'); }
        if (!drag.moved) return;
        pview.x = drag.v.x - dx * (pview.w / svg.clientWidth); pview.y = drag.v.y - dy * (pview.h / svg.clientHeight);
        svg.setAttribute('viewBox', `${pview.x} ${pview.y} ${pview.w} ${pview.h}`);
      });
      svg.addEventListener('pointerup', () => {
        svg.classList.remove('dragging');
        if (drag && !drag.moved && drag.t && drag.btn === 0) {
          const t = drag.t;
          if (t.dataset.c) toggle(t.dataset.c, true);
          else if (t.dataset.attach) attach(+t.dataset.attach);
          else if (t.dataset.act === 'rot') rotate(t.dataset.b);
          else if (t.dataset.act === 'del') removeBoard(t.dataset.b);
        }
        drag = null;
      });
      svg.addEventListener('contextmenu', e => { e.preventDefault(); const g = e.target.closest('[data-c]'); if (g) toggle(g.dataset.c, false); });
      const tipEl = () => { let t = document.getElementById('ptip'); if (!t) { t = document.createElement('div'); t.id = 'ptip'; t.className = 'ttip ptip'; t.hidden = true; document.body.appendChild(t); } return t; };
      const tipMove = e => { const t = tipEl(); if (t.hidden) return; const w = t.offsetWidth, h = t.offsetHeight; let x = e.clientX + 22, y = e.clientY + 18; if (x + w > innerWidth - 8) x = e.clientX - w - 22; if (y + h > innerHeight - 8) y = Math.max(8, innerHeight - h - 8); t.style.left = Math.max(8, x) + 'px'; t.style.top = y + 'px'; };
      const tipShow = (key, e) => { const R = compute(); const c = R.W.cells.get(key); if (!c) return; const t = tipEl(); t.innerHTML = tipHtml(c, R); t.hidden = false; tipMove(e); };
      svg.addEventListener('mousemove', e => { if (drag && drag.moved) tipEl().hidden = true; else tipMove(e); });
      svg.addEventListener('mouseleave', () => { tipEl().hidden = true; });
      svg.addEventListener('mouseout', e => { if (e.target.closest('[data-c]') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-c]'))) tipEl().hidden = true; });
      svg.addEventListener('mouseover', e => {
        const g = e.target.closest('[data-c]'); if (g) tipShow(g.dataset.c, e); if (!g || g.dataset.c === psel) return;
        const prev = svg.querySelector('.pn.sel'); if (prev) prev.classList.remove('sel'); g.classList.add('sel');
        psel = g.dataset.c; inspector(compute());
      });
      svg.addEventListener('wheel', e => {
        e.preventDefault(); const r = svg.getBoundingClientRect(); const k = e.deltaY > 0 ? 1.12 : 1 / 1.12;
        const px = pview.x + (e.clientX - r.left) / r.width * pview.w, py = pview.y + (e.clientY - r.top) / r.height * pview.h;
        pview.w *= k; pview.h *= k; pview.x = px - (px - pview.x) * k; pview.y = py - (py - pview.y) * k;
        svg.setAttribute('viewBox', `${pview.x} ${pview.y} ${pview.w} ${pview.h}`);
      }, { passive: false });
      $('#pFit').onclick = () => { pview = bounds(); render(); };
      $('#pClear').onclick = () => { const P = state(); P.alloc = {}; P.glyphs = {}; psel = null; render(); commit(); };
      $('#pReset').onclick = () => { if (!confirm('Remove every board except the starting board?')) return; const P = state(); P.boards = P.boards.slice(0, 1); P.alloc = {}; P.glyphs = {}; psel = null; pview = null; render(); commit(); };
    }

    function summary() {
      if (!PD()) return null;
      const P = state();
      return { points: spent(), cap: P.cap, boards: P.boards.map(b => { const d = bdef(b.id); const gid = P.glyphs[b.id]; return { name: d.name, glyph: gid ? PD().glyphs[gid].name : '' }; }) };
    }

    // Totals for the character sheet: attribute points, every stat line, and active glyphs.
    // a glyph's live damage text, read by the item scan: the per-5 bonus with its total, the threshold bonus once met, the legendary bonus from level 46
    function glyphPower(G) {
      const st = gStat(G.G.g); const out = [];
      for (const a of G.G.g.a) {
        const raw = String(a.d || '').replace(/<[^>]+>/g, '');
        if (a.op === 2 && G.per5 > 0) { const v = G.per5 * scal(a, G.G.L); out.push(raw.replace(/^For every 5 \w+ purchased within range, /, '').replace(/^./, c => c.toUpperCase()).replace(/\+?§[^§]*§/, '+' + v.toFixed(1) + '%')); }
        else if (a.op === 5 && G.met) out.push(raw);
        else if (a.op === 4 && G.G.L >= 46) out.push(raw.replace(/§[^§]*§/, scal(a, G.G.L).toFixed(1) + '%[x]'));
      }
      return out.join(' ');
    }
    function stats() {
      if (!PD()) return null;
      const P = state(); if (!P.boards.length) return { purchased: {}, base: P.base, lines: [], glyphs: [] };
      const R = compute(); const T = PD().texts;
      return { purchased: R.purchased, base: P.base, lines: Object.keys(R.lines).filter(k => R.lines[k]).map(k => ({ t: T[k], v: R.lines[k] })),
        glyphs: R.glyphs.map(g => ({ name: g.G.g.name, L: g.G.L, met: g.met, desc: glyphPower(g) })), legend: R.taken.filter(x => x.n.r === 'legendary').map(x => ({ name: x.n.n, desc: x.n.d || '' })) };
    }
    return { render, wire, reset: () => { pview = null; psel = null; }, summary, stats };
  };
})(window);
