// Craftable gear data: regular affixes per slot, tempering manuals and their affixes.
const fs = require('fs'), path = require('path');
const SLOT_LABELS = {
  helm: [16, 14, 54], chest: [17, 14, 54], gloves: [28, 14, 54], pants: [30, 14, 54], boots: [29, 14, 54],
  amulet: [26, 18, 54], ring: [19, 18, 54],
  weapon: [0, 8, 9, 54, 2, 3, 4, 5, 6, 7, 10, 12, 13, 46, 61, 62, 72],
  offhand: [15, 23, 31, 47, 54],
};
const CLASS_PREFIX = { Barb: 'Barbarian', Druid: 'Druid', Necro: 'Necromancer', Rogue: 'Rogue', Sorc: 'Sorcerer', Sorcerer: 'Sorcerer', Spiritborn: 'Spiritborn', Spirit: 'Spiritborn', Paladin: 'Paladin', Warlock: 'Warlock' };

module.exports = function extractGear(ROOT, H, P) {
  const { readJ, strings, F, CLASSES } = H; const { tplFor, AF } = P;
  const META = path.join(ROOT, 'base/meta');
  const ls = d => { try { return fs.readdirSync(path.join(META, d)); } catch (e) { return []; } };
  // lo: the smallest roll (FloatRandomRangeWithInterval(step, lo, hi), RandomInt(lo, hi)); otherwise the top roll
  const top = (src, lo) => F.evaluate(src || '0', { id: () => 0, table: () => 0, call: (fn, args) => {
    if (/Range|Random/.test(fn) && args.length >= 2) return lo ? args[args.length - 2] : args[args.length - 1];
    if (/^GetTotalAffixBonus$/i.test(fn)) return 1;
    if (/^ROUND$/i.test(fn)) return Math.round(args[0]);
    if (/^(FLOOR)$/i.test(fn)) return Math.floor(args[0]);
    return undefined;
  } });

  function affixLine(A, cls) {
    const at = (A.ptItemAffixAttributes || [])[0]; if (!at) return null;
    const t = at.tAttribute; const attr = t.__eAttribute_name__;
    const f = t.gbidFormula ? AF[t.gbidFormula.name] : t.szAttributeFormula.value;
    let v = top(f); if (!v) return null; let lo = top(f, true);
    let { s, pct } = tplFor(attr, t.nParam, cls);
    if (/Resist/.test(attr) && !pct) s = s.replace('§%', '§');
    if (/^(Strength|Dexterity|Intelligence|Willpower|Plus_All_Stats)$/.test(attr) && /^§ /.test(s)) s = '+' + s;   // core stats come without a sign
    s = s.replace(/Flat Hitpoints On Hit Unscaled By Player Health/, 'Life On Hit').replace(/Flat Hitpoints On Kill Unscaled By Player Health/, 'Life On Kill');
    if (pct) { v *= 100; lo *= 100; }
    if (pct && v > 300) { v /= 100; lo /= 100; }
    if (/\{|\}|undefined/.test(s) || / § |^§ |§ Potency/.test(s)) return null;
    if (attr === 'Plus_All_Stats' && Math.abs(v - 100) < 1e-9 && /PassiveRank|Talent/.test(A.__fileName__ || '')) return null;
    if (/Thorns/.test(attr) && v < 10) return null;
    if (!pct && v < 1) return null;
    const r2 = x => Math.round(x * 100) / 100;
    return Object.assign({ t: s, v: r2(v) }, lo > 0 && lo < v ? { lo: r2(lo) } : {});
  }

  // regular affixes
  const affixes = []; const seen = new Set();
  const BAD = /UNIQUE|Unique|UBER|Transfiguration|Runeword|RuneWord|Legacy|zz|Test|TEST|QA_|Mythic|Talisman|INHERENT|SMP|KillStreak|AprilFools|OLD/;
  for (const f of ls('Affix')) {
    const n = f.replace('.aff.json', '');
    if (!/^(S04|X1|X2|S10|S11)_/.test(n) || BAD.test(n)) continue;
    const A = readJ(path.join(META, 'Affix', f)); if (!A || A.bIsTemperedAffix) continue;
    const g = ((A.ptItemAffixAttributes || [])[0] || {}).tAttribute; if (!g || !g.gbidFormula || !/^GearAffix_/.test(g.gbidFormula.name)) continue;
    const classes = (A.fAllowedForPlayerClass || []).map((v, i) => v ? CLASSES[i] : null).filter(Boolean);
    const cls1 = classes.length === 1 ? classes[0] : '';
    const line = affixLine(A, cls1); if (!line) continue;
    const labels = A.arAllowedItemLabels || [];
    const slots = Object.keys(SLOT_LABELS).filter(s => labels.some(l => SLOT_LABELS[s].includes(l)));
    if (!slots.length) continue;
    const key = line.t + '|' + slots.join(',') + '|' + classes.join(',');
    if (seen.has(key)) continue; seen.add(key);
    const attr0 = g.__eAttribute_name__ || '';
    const kind = /SkillRank|PassiveRank|Talent/.test(n) ? 'Skill' : /^Resistance|Resist/.test(attr0) && !/All/.test(n) ? 'Resistance' : ['Offensive', 'Defensive', 'Utility', 'Resource', 'Utility'][A.eCategory] || 'Utility';
    affixes.push({ id: n, t: line.t, v: line.v, lo: line.lo, slots, cls: classes.length === CLASSES.length ? [] : classes, cat: kind, w: A.nWeight || 0, fam: A.gbidAffixFamily ? A.gbidAffixFamily.name : '' });
  }
  affixes.sort((a, b) => a.t.localeCompare(b.t));

  // tempering manuals: newest tier of each family
  const fam = {};
  for (const f of ls('Recipe').filter(f => /^Tempering_/.test(f))) {
    const id = f.replace('.rcp.json', ''); const m = id.match(/^(.*)_Tier(\d)$/); const base = m ? m[1] : id; const tier = m ? +m[2] : 0;
    const s = strings('Item_' + id); if (!s.Name || /Legacy/.test(s.Name)) continue;
    if (!fam[base] || fam[base].tier < tier) fam[base] = { id, tier, s };
  }
  const tempers = [];
  for (const [base, { id, tier, s }] of Object.entries(fam)) {
    const R = readJ(path.join(META, 'Recipe', id + '.rcp.json')); if (!R || !R.temperingData) continue;
    const td = R.temperingData; const who = base.split('_')[1];
    const cls = CLASS_PREFIX[who] || '';
    const desc = s.Description || '';
    const slots = [];
    if (/Weapon/i.test(desc)) slots.push('weapon');
    if (/Glove/i.test(desc)) slots.push('gloves');
    if (/Ring/i.test(desc)) slots.push('ring');
    if (/Amulet/i.test(desc)) slots.push('amulet');
    if (/Helm/i.test(desc)) slots.push('helm');
    if (/Chest/i.test(desc)) slots.push('chest');
    if (/Pants|Legs/i.test(desc)) slots.push('pants');
    if (/Boot/i.test(desc)) slots.push('boots');
    if (/Shield|Off-?hand|Focus|Totem/i.test(desc)) slots.push('offhand');
    if (/Armor/i.test(desc) && !/Chest Armor/i.test(desc)) slots.push('helm', 'chest', 'pants', 'gloves', 'boots');
    const opts = []; const allow = new Set();
    for (const ta of td.arTemperedAffixes || []) {
      if (!ta.snoAffix) continue; const A = readJ(path.join(META, 'Affix', ta.snoAffix.name + '.aff.json')); if (!A) continue;
      const cl = (A.fAllowedForPlayerClass || []).map((v, i) => v ? CLASSES[i] : null).filter(Boolean); if (cl.length && cl.length < CLASSES.length) cl.forEach(c => allow.add(c));
      const line = affixLine(A, cls); if (line) opts.push({ id: ta.snoAffix.name, t: line.t, v: line.v, lo: line.lo });
    }
    if (!opts.length) continue;
    const cls2 = cls || (allow.size === 1 ? [...allow][0] : '');
    tempers.push({ id, name: s.Name.replace(/\s*\(.*\)$/, ''), cat: td.gbidItemLabelGroup ? td.gbidItemLabelGroup.name : '', tier, cls: cls2, slots: [...new Set(slots)], where: desc, opts });
  }
  tempers.sort((a, b) => (a.cls || 'zz').localeCompare(b.cls || 'zz') || a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));

  // ---------- sanctification (the bonus affix from the Horadric Cube) ----------
  const { renderAffix, sets } = H;
  const descOf = (n, A) => { const st = strings('Affix_' + n); if (!st.Desc) return ''; const h = renderAffix(st.Desc.replace(/\{(\/?)c_([A-Za-z]+)\}/g, (m, sl, n) => '{' + sl + 'c_' + n.toLowerCase() + '}'), A).replace(/\{\/?c(_\w+)?\}/g, ''); return /<b class="num">0%?<\/b>/.test(h) && !/[1-9]/.test(h.replace(/<[^>]+>/g, '').replace(/^[^:]*:/, '')) ? '' : h; };
  const sanctify = [];
  for (const f of ls('Affix').filter(f => /^X2_Transfiguration_/.test(f))) {
    const n = f.replace('.aff.json', ''); if (/Mythic|AddQuality|Lesser|IncreasedRuneOffering/.test(n)) continue;
    const A = readJ(path.join(META, 'Affix', f)); if (!A) continue;
    const classes = (A.fAllowedForPlayerClass || []).map((v, i) => v ? CLASSES[i] : null).filter(Boolean);
    const labels = A.arAllowedItemLabels || [];
    const slots = Object.keys(SLOT_LABELS).filter(s => labels.some(l => SLOT_LABELS[s].includes(l)));
    const d = descOf(n, A); const line = d ? null : affixLine(A, classes.length === 1 ? classes[0] : '');
    if (!d && !line) continue;
    sanctify.push(Object.assign({ id: n, slots: slots.length ? slots : Object.keys(SLOT_LABELS), cls: classes.length === CLASSES.length ? [] : classes }, d ? { html: d } : line));
  }

  // ---------- talisman: seals, seal affixes, charm affixes, set pieces ----------
  const SEAL_TYPES = ['Talisman_Seal_Magic', 'Talisman_Seal_Rare', 'Talisman_Seal_Legendary', 'Talisman_Seal_Ancestral'];
  const SEAL_SLOTS = { Talisman_Seal_Magic: 2, Talisman_Seal_Rare: 3, Talisman_Seal_Legendary: 3, Talisman_Seal_Ancestral: 4 };
  const seals = [];
  for (const id of [...SEAL_TYPES, ...ls('Item').filter(f => /^Talisman_Seal_MythicUnique_\d+/.test(f)).map(f => f.replace('.itm.json', ''))]) {
    const I = readJ(path.join(META, 'Item', id + '.itm.json')); if (!I) continue; const st = strings('Item_' + id); if (!st.Name) continue;
    const forced = (I.arForcedAffixes || []).filter(Boolean).map(a => { const A = readJ(path.join(META, 'Affix', a.name + '.aff.json')); return { id: a.name, html: descOf(a.name, A) }; }).filter(x => x.html);
    const mythic = /Mythic/.test(id);
    seals.push({ id, name: st.Name, rarity: mythic ? 'mythic' : id.split('_').pop().toLowerCase(), slots: mythic ? 4 : SEAL_SLOTS[id], legendary: mythic || /Legendary|Ancestral/.test(id), forced });
  }
  const SET_CLASS = { Barbarian: 'Barb', Druid: 'Druid', Necromancer: 'Necro', Rogue: 'Rogue', Sorcerer: 'Sorc', Spiritborn: 'Spirit', Paladin: 'Pala', Warlock: 'Warlock' };
  const sealAffixes = [];
  for (const f of ls('Affix').filter(f => /^Talisman_SealAffix_/.test(f) && !/TEST|GURTEST|Ancestral_0/.test(f))) {
    const n = f.replace('.aff.json', ''); const A = readJ(path.join(META, 'Affix', f)); if (!A) continue;
    let kind = 'normal', set = '';
    if (/_Legendary_/.test(n)) kind = 'legendary';
    else if (/_Set_/.test(n)) { kind = 'set'; const m = n.match(/_Set_([A-Za-z]+)_(\d+)_/); if (m) set = 'Talisman_' + (SET_CLASS[m[1]] || m[1]) + '_' + m[2]; }
    else if (/AdditionalCharmSlot/.test(n)) kind = 'special';
    else if (/_\d+$/.test(n)) kind = 'virtue';
    const d = descOf(n, A); const line = d ? null : affixLine(A, '');
    if (!d && !line) continue;
    sealAffixes.push(Object.assign({ id: n, kind, set }, d ? { html: d } : line));
  }
  const charmAffixes = [];
  const seenC = new Set();
  for (const f of ls('Affix').filter(f => /^Talisman_Charm_/.test(f) && !/UNIQUE|Unique|MagicOnly|_Affix_|GoldFind|CraftingMaterial|Experience|S05_BSK/.test(f))) {
    const n = f.replace('.aff.json', ''); const A = readJ(path.join(META, 'Affix', f)); if (!A) continue;
    const classes = (A.fAllowedForPlayerClass || []).map((v, i) => v ? CLASSES[i] : null).filter(Boolean);
    const d = descOf(n, A); const line = d ? null : affixLine(A, classes.length === 1 ? classes[0] : '');
    if (!d && !line) continue;
    const key = (d || line.t) + classes.join(); if (seenC.has(key)) continue; seenC.add(key);
    charmAffixes.push(Object.assign({ id: n, cls: classes.length === CLASSES.length ? [] : classes, virtue: /Virtue/.test(n) }, d ? { html: d } : line));
  }
  charmAffixes.sort((a, b) => (a.t || a.html).localeCompare(b.t || b.html));
  const setIds = new Set((sets || []).map(s => s.id));
  const setPieces = {};
  for (const f of ls('Item').filter(f => /^Talisman_Charm_Set_/.test(f))) {
    const id = f.replace('.itm.json', ''); const m = id.match(/^Talisman_Charm_Set_(.+?)_?(\d+)_(\d+)$/); if (!m) continue;
    const sid = 'Talisman_' + m[1] + '_' + m[2]; const sid2 = 'Talisman_' + m[1] + m[2];
    const key = setIds.has(sid) ? sid : setIds.has(sid2) ? sid2 : null; if (!key) continue;
    const st = strings('Item_' + id); if (!st.Name) continue;
    (setPieces[key] = setPieces[key] || []).push({ id, name: st.Name });
  }
  for (const k in setPieces) setPieces[k].sort((a, b) => a.id.localeCompare(b.id));
  // gems: every type and grade, with the weapon, armor and jewelry effect (eSocketTarget 0, 1, 2)
  const gemLine = at => {
    const attr = at.__eAttribute_name__; let v = +at.szAttributeFormula.value || 0; if (!v) return null;
    let { s, pct } = tplFor(attr, at.nParam, '');
    if (/Resist/.test(attr) && !pct) s = s.replace('§%', '§');
    if (/^(Strength|Dexterity|Intelligence|Willpower|Plus_All_Stats)$/.test(attr) && /^§ /.test(s)) s = '+' + s;   // core stats come without a sign
    if (pct) v *= 100;
    if (/\{|\}|undefined/.test(s)) return null;
    return { t: s, v: Math.round(v * 100) / 100 };
  };
  const gems = [];
  for (const f of ls('Item').filter(f => /^Gem_[A-Za-z]+_\d+\.itm\.json$/.test(f)).sort()) {
    const n = f.replace('.itm.json', ''); const [, type, grade] = n.match(/^Gem_([A-Za-z]+)_(\d+)$/);
    const I = readJ(path.join(META, 'Item', f)); if (!I) continue;
    const st = strings('Item_' + n) || {};
    const eff = {}; for (const e of I.ptSocketedEffects || []) { const k = ['w', 'a', 'j'][e.eSocketTarget]; const ls2 = (e.ptAttributes || []).map(gemLine).filter(Boolean); if (k && ls2.length) eff[k] = ls2; }
    if (!eff.w && !eff.a && !eff.j) continue;
    gems.push({ id: n, type, grade: +grade, name: st.Name || (type + ' ' + grade), flavor: st.Flavor || '', ...eff });
  }
  return { affixes, tempers, sanctify, seals, sealAffixes, charmAffixes, setPieces, gems, slots: Object.keys(SLOT_LABELS) };
};
