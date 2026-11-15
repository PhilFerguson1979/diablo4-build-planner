// Reads the text of an in-game item tooltip (from a screenshot) and matches it to the planner's game data.
(function (root) {
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const num = s => { s = String(s).trim(); if (/^\d+,\d$/.test(s)) s = s.replace(',', '.'); return parseFloat(s.replace(/,/g, '')); };
  const tkey = t => norm(String(t).replace(/<[^>]+>/g, '').replace(/§|%|\+|\[x\]/g, '').replace(/^x/, ''));
  const strip = h => String(h || '').replace(/<[^>]+>/g, ' ');
  const SLOT_WORDS = [['Chest Armor', 'chest'], ['Helm', 'helm'], ['Gloves', 'gloves'], ['Pants', 'pants'], ['Boots', 'boots'], ['Amulet', 'amulet'], ['Ring', 'ring'], ['Shield', 'offhand'], ['Focus', 'offhand'], ['Totem', 'offhand'], ['Tome', 'offhand'],
    ['Two-Handed Sword', 'weapon', 'Sword2H'], ['Two-Handed Axe', 'weapon', 'Axe2H'], ['Two-Handed Mace', 'weapon', 'Mace2H'], ['Two-Handed Scythe', 'weapon', 'Scythe2H'], ['Quarterstaff', 'weapon', 'Quarterstaff'], ['Crossbow', 'weapon', 'Crossbow2H'],
    ['Polearm', 'weapon', 'Polearm'], ['Glaive', 'weapon', 'Glaive'], ['Staff', 'weapon', 'Staff'], ['Bow', 'weapon', 'Bow'], ['Sword', 'weapon', 'Sword'], ['Axe', 'weapon', 'Axe'], ['Mace', 'weapon', 'Mace'], ['Flail', 'weapon', 'Flail'], ['Dagger', 'weapon', 'Dagger'], ['Wand', 'weapon', 'Wand'], ['Scythe', 'weapon', 'Scythe']];
  const IGNORE = /^(armor|itempower|allresist|quality|toughness|mainhandweapondamage|blockchance|damagepersecond|attackspersecond|damageperhit|blockeddamagereduction|sellvalue|durability|tempers|requireslevel)/;
  const TAIL = /^(Multiplier|Reduction|Damage|Chance|Elements|Resource|Skills|Resistance|Generation|Speed|Stacks|Life|Regeneration)\b/;

  // step 1: plain text to a structured reading, with no game data involved
  function read(text) {
    const lines = String(text || '').replace(/\r/g, '').split('\n').map(l => l.replace(/[|¦]+\s*$/g, '').trim()).filter(Boolean);
    const ipIdx = lines.findIndex(l => /Item\s*Power/i.test(l));
    const typeIdx = lines.findIndex(l => /\b(Legendary|Unique|Rare|Magic)\b/.test(l) && !/Unique Equipped/i.test(l));
    const out = { title: '', rarity: '', mythic: false, slot: '', wtype: '', q: 0, power: 0, entries: [], missed: [], text: '' };
    if (typeIdx < 0) return out;
    out.title = lines.slice(0, typeIdx).filter(l => !/^EQUIPPED/i.test(l.replace(/[^A-Za-z]/g, ''))).join(' ').replace(/[@®]/g, 'o').replace(/[^A-Za-z' -]/g, ' ').replace(/\s+/g, ' ').trim();
    const head = lines.slice(typeIdx, (ipIdx > typeIdx ? ipIdx : typeIdx + 2)).join(' ');
    out.rarity = (head.match(/\b(Legendary|Unique|Rare|Magic)\b/) || [])[1] || ''; out.mythic = /\bMythic\b/.test(head);
    for (const [w, slot, wt] of SLOT_WORDS) if (new RegExp('\\b' + w + '\\b', 'i').test(head)) { out.slot = slot; out.wtype = wt || ''; break; }
    const ip = ipIdx >= 0 && lines[ipIdx].match(/(\d[\d,]*)\s*Item\s*Power/i); if (ip) out.power = num(ip[1]);
    const body = [];
    for (let i = Math.max(ipIdx, typeIdx) + 1; i < lines.length; i++) { const l = lines[i];
      if (/Properties lost when equipped|Requires Level|Empty Socket|Sell Value|Account Bound|Scroll Down/i.test(l)) break;
      const qm = l.match(/(\d+)\s*\(.{0,8}\)\s*Quality/i); if (qm) { out.q = Math.min(25, +qm[1]); continue; }
      if (/Armory Loadout|Transfigured$|^\W*Imprinted\W*$/i.test(l)) continue;
      body.push(l.replace(/\(\s*[+\-−]?[\d,.]*%?\s*(Toughness)?\s*\)/gi, ' ').trim()); }
    // group wrapped lines: an entry starts with a number, anything else continues it or belongs to the power text
    const entries = []; const textBlocks = []; let inText = false;
    for (const raw of body) {
      let l = raw.replace(/^[^A-Za-z0-9+\[{]*/, '');
      const stray = l.match(/^[A-Za-z0-9#%*]{1,3}[.,]?\s+(?=[+x]?\d)/); if (stray && !/^[+x]?\d[\d,.]*%?\s+[A-Za-z]/.test(l)) l = l.slice(stray[0].length); else if (stray && /^\d\s+[+x]?\d/.test(l)) l = l.slice(stray[0].length);
      const starts = /^[+x]?\d[\d,.]*\s*%?\s+(to\s+)?[A-Z]/.test(l);
      const prev = entries[entries.length - 1];
      if (starts) { entries.push(l); inText = false; }
      else if (prev && !inText && (/^[\[{]/.test(l) || (/[\[{]/.test(prev) && !/[\]}]/.test(prev)) || (TAIL.test(l) && l.length < 40))) entries[entries.length - 1] = prev + ' ' + l;
      else { textBlocks.push(raw.replace(/^[^A-Za-z0-9]*/, '')); inText = true; }
    }
    for (const e of entries) {
      const r = e.match(/^([+x]?)(\d[\d,.]*)\s*(%?)\s+((?:to\s+)?[A-Z][A-Za-z'\- ]{1,48}?)\s*\+?\s*[\[{(\/|]{0,2}\s*(\d[\d,.]*)(?:\s*-\s*(\d[\d,.]*))?\s*[\]})|]{0,2}/);
      const n = !r && e.match(/^([+x]?)(\d[\d,.]*)\s*(%?)\s+((?:to\s+)?[A-Z][A-Za-z'\- ]{1,48}?)\s*$/);
      const m = r || n;
      // a line that starts like an affix but could not be read is reported, not folded into the power text
      if (!m) { if (/^[+x]?\d/.test(e)) out.missed.push(e); else if (e.length > 30) textBlocks.push(e); continue; }
      // the text reader often turns the closing bracket into a 1: "[20.0 - 24.01%". Drop it when what is left still covers the roll.
      if (r && !/[\]})]/.test(e)) { const k = r[6] != null ? 6 : 5; const cut = String(r[k]).replace(/[1lI]$/, '').replace(/[.,]$/, ''); const c = cut ? num(cut) : NaN; if (cut !== String(r[k]) && c >= num(r[2]) && c >= num(r[5] === r[k] ? cut : r[5])) r[k] = cut; }
      const name = m[4].trim(); const armorAffix = !!r && m[1] === '+' && norm(name) === 'armor';   // "+1,100 Armor [981 - 1,225]" is a rolled affix; a bare "900 Armor" is the item's base
      if (IGNORE.test(norm(name)) && !armorAffix) continue;
      out.entries.push({ raw: e, mult: m[1] === 'x', v: num(m[2]), pct: m[3] === '%', name, lo: r ? num(r[5]) : null, hi: r ? num(r[6] != null ? r[6] : r[5]) : null });
    }
    out.text = textBlocks.join(' ').replace(/\s+/g, ' ').trim();
    return out;
  }

  const lev = (a, b) => { const m = a.length, n = b.length; if (!m) return n; if (!n) return m; let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return prev[n]; };
  const words = s => new Set(strip(s).toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  const overlap = (a, b) => { if (!a.size) return 0; let k = 0; for (const w of a) if (b.has(w)) k++; return k / a.size; };

  // step 2: match the reading to items, aspects, affixes and tempers
  function match(R, D, cls, opt) {
    const G = D.gear; const kind = R.slot; const q = R.q || 0; const res = { slot: kind, wtype: R.wtype, q, mythic: R.mythic, item: null, itemName: '', itemKind: '', affixes: [], tempers: [], unplaced: [], notes: [] };
    if (!R.rarity || !kind) { res.notes.push('Could not find the item type line (for example "Ancestral Legendary Helm"). Make sure the whole tooltip is in the screenshot.'); return res; }
    const tw = words(R.text); const title = norm(R.title);
    if (R.rarity === 'Unique') {
      let best = null;
      for (const u of D.uniques) { if (u.kind === 'charm') continue; const n = norm(u.name); const d = lev(title.slice(-Math.max(n.length + 4, 0)), n) / Math.max(n.length, 1); const d2 = title.includes(n) ? 0 : d;
        const s = (1 - Math.min(1, d2)) + overlap(words(u.desc), tw) * 0.8 + ((u.classes || []).includes(cls) ? 0.05 : 0); if (!best || s > best.s) best = { u, s, d: d2 }; }
      if (best && (best.d <= 0.34 || best.s >= 1.0)) { res.item = { t: 'u', id: best.u.id }; res.itemName = best.u.name; res.itemKind = best.u.kind; } else res.notes.push('Could not tell which unique this is from the name.');
    } else {
      let best = null;
      for (const a of D.aspects) { const nm = norm(String(a.raw || a.name).replace(/^of /i, '').replace(/\bAspect\b/i, '')); const inTitle = nm.length > 4 && title.includes(nm);
        const s = overlap(words(a.desc), tw) + (inTitle ? 0.6 : 0) + ((a.classes || []).includes(cls) ? 0.03 : 0); if (!best || s > best.s) best = { a, s }; }
      if (best && best.s >= 0.6) { res.item = { t: 'aspect', id: best.a.id }; res.itemName = best.a.name; res.itemKind = 'aspect'; } else res.notes.push('Could not tell which aspect is on this item.');
    }
    const okCls = x => !x.cls || !x.cls.length || (Array.isArray(x.cls) ? x.cls.includes(cls) : x.cls === cls);
    const scales = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const uDef = res.item && res.item.t === 'u' ? D.uniques.find(u => u.id === res.item.id) : null; const fixedU = uDef ? (uDef.affixes || []).map(h => norm(String(h).replace(/<[^>]+>/g, '').replace(/[\d.,%+\[\]–-]+/g, ' '))) : [];
    for (const e of R.entries) {
      const key = norm(e.name);
      if (e.lo != null) {
        const pool = G.affixes.filter(a => tkey(a.t) === key && /^x/.test(a.t) === e.mult);
        const d = pool.find(a => a.slots.includes(kind) && okCls(a)) || pool.find(a => a.slots.includes(kind)) || pool.find(okCls) || pool[0];
        if (R.rarity === 'Unique' && fixedU.some(f => f.includes(key))) continue;   // one of the unique's own fixed lines, the planner already has it
        if (!d) { res.unplaced.push(e.raw.replace(/\s*\+?[\[{(\/|]?\s*[\d,.]+\s*-.*$/, '')); continue; }
        // which mix of greater affix and quality capstone puts the base roll inside the range printed on the tooltip
        let pick = null; for (const [ga, cap] of scales) { const base = e.v / (1 + 0.01 * q + ga * 0.5 + cap * 0.5); if (base >= e.lo * 0.94 - 0.06 && base <= e.hi * 1.06 + 0.06) { pick = { ga, cap, base }; break; } }
        if (!pick) pick = { ga: 0, cap: 0, base: Math.min(e.hi, Math.max(e.lo, e.v / (1 + 0.01 * q))) };
        const val = Math.round(Math.min(e.hi, Math.max(e.lo, pick.base)) * 100) / 100;
        res.affixes.push({ id: d.id, val, ga: !!pick.ga, cap: !!pick.cap, label: `${e.mult ? 'x' : '+'}${e.v}${e.pct ? '%' : ''} ${e.name}`, inSlot: d.slots.includes(kind) });
      } else {
        let hit = null; for (const m of G.tempers) { if (m.cls && m.cls.length && m.cls !== cls) continue; const o = m.opts.find(x => tkey(x.t) === key); if (!o) continue; const ok = m.slots.includes(kind); if (!hit || (ok && !hit.ok) || (ok === hit.ok && (m.tier || 0) > (hit.m.tier || 0))) hit = { m, o, ok }; }
        if (hit) res.tempers.push({ rid: hit.m.id, oid: hit.o.id, label: `${e.mult ? 'x' : '+'}${e.v}${e.pct ? '%' : ''} ${e.name}` });
        else res.unplaced.push(e.raw);
      }
    }
    (R.missed || []).forEach(e => res.unplaced.push(e));
    if ((opt && opt.maxAff) && res.affixes.length > opt.maxAff) res.unplaced.push(...res.affixes.splice(opt.maxAff).map(a => a.label));
    if ((opt && opt.maxTemp != null) && res.tempers.length > opt.maxTemp) res.unplaced.push(...res.tempers.splice(opt.maxTemp).map(a => a.label));
    return res;
  }
  root.D4SCAN = { read, match };
  if (typeof module !== 'undefined') module.exports = root.D4SCAN;
})(typeof window !== 'undefined' ? window : globalThis);
