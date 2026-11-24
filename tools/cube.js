// Horadric Cube: every recipe the cube crafter knows, runewords, rune upgrades and Soul Splinters, read from the game files.
const fs = require('fs'), path = require('path');
const LABELS = { 16: 'Helm', 17: 'Chest Armor', 28: 'Gloves', 30: 'Pants', 29: 'Boots', 26: 'Amulet', 19: 'Ring', 54: 'piece of gear', 73: 'fish', 34: 'socketable', 15: 'Shield', 23: 'Focus', 31: 'Totem', 35: 'rune', 41: 'rune' };
const QUAL = { 1: 'common', 2: 'magic', 3: 'rare', 5: 'legendary', 6: 'unique', 8: 'mythic' };
module.exports = function extractCube(ROOT, H) {
  const { readJ, strings } = H; const META = path.join(ROOT, 'base/meta');
  const clean = s => String(s || '').replace(/\{[^}]*\}/g, '').replace(/\[[^\]]*\|[^\]]*\]/g, 'X').replace(/\s+/g, ' ').trim();
  const itemName = id => clean(strings('Item_' + id).Name) || id.replace(/_/g, ' ');
  const ls = d => { try { return fs.readdirSync(path.join(META, d)); } catch (e) { return []; } };
  const ingOf = J => (J.arIngredients || []).map(i => { const q = i.nQuantity || 1; const d = i.tItemDescription || {}; const r = d.tRequirements || {};
    if (i.snoItem && i.snoItem.name) return { q, n: itemName(i.snoItem.name), id: i.snoItem.name };
    const lab = (d.arItemLabels || []).map(l => LABELS[l]).filter(Boolean)[0] || 'item'; const ql = QUAL[r.eMinItemDisplayedQualityLevel] || (r.eMaxItemQualityLevel === 0 || (r.bDefineItemQualityLevelRequirement && !r.eMaxItemQualityLevel) ? 'common' : '');
    return { q, n: `${ql ? ql + ' ' : ''}${lab}`.trim(), any: 1 }; });
  const txt = list => list.map(i => `${i.q > 1 || !i.any ? i.q + ' ' : 'a '}${i.n}`).join(', ');
  const all = ls('Recipe').filter(f => f.endsWith('.rcp.json')).map(f => f.replace('.rcp.json', ''));
  const R = id => readJ(path.join(META, 'Recipe', id + '.rcp.json'));
  const out = { runewords: [], runes: [], splinters: [], groups: [] };
  // runewords: one entry per name, with every base it can be made on; the rune order is the item's own description
  const BASE = { FocusBookOffHand: 'Focus', OffHandTotem: 'Totem', Axe2H: 'Two-Handed Axe', Mace2H: 'Two-Handed Mace', Sword2H: 'Two-Handed Sword', Scythe2H: 'Two-Handed Scythe', Crossbow2H: 'Crossbow', ChestArmor: 'Chest Armor', Axe_Berserker_Axe: 'Axe', Sword_Phase_Blade: 'Sword' };
  const rw = {};
  for (const f of ls('Item').filter(x => /^Runeword_.*\.itm\.json$/.test(x))) {
    const item = f.replace('.itm.json', ''); const I = readJ(path.join(META, 'Item', f)); const S = strings('Item_' + item); if (!I || !S.Name) continue;
    const name = clean(S.Name); const runes = (clean(S.Description).match(/[A-Z][a-z]+/g) || []); const tn = I.snoItemType ? I.snoItemType.name : ''; const base = BASE[tn] || tn.replace(/_/g, ' ');
    const e = rw[name] = rw[name] || { name, runes, bases: [], level: I.nExplicitRequiredLevel || 0 }; if (base && !e.bases.includes(base)) e.bases.push(base);
  }
  out.runewords = Object.values(rw).sort((a, b) => a.name.localeCompare(b.name));
  // rune upgrades
  for (const id of all.filter(x => /^Runecraft_/.test(x))) { const J = R(id); if (!J) continue; const to = id.split('_')[2]; out.runes.push({ in: txt(ingOf(J)), out: to, season: J.snoActiveCondition ? clean(J.snoActiveCondition.name).replace(/Season_Active_Season/, 'Season ') : '' }); }
  const ORDER = ['Tir', 'Eth', 'Ith', 'Tal', 'Ral', 'Ort', 'Thul', 'Amn', 'Sol', 'Mal', 'Ist', 'Vex', 'Ohm', 'Lo', 'Ber', 'Jah']; out.runes.sort((a, b) => ORDER.indexOf(a.out) - ORDER.indexOf(b.out));
  // Soul Splinters: the power text lives in the attribute descriptions, the numbers on each tier's item
  const AD = strings('AttributeDescriptions');
  for (const who of ['Andariel', 'Azmodan', 'Belial', 'BlackSoulStone', 'Duriel', 'Lilith', 'NaKrul', 'Skarn']) {
    const tiers = []; for (let t = 1; t <= 4; t++) { const id = `S15_SoulSplinter_${who}_0${t}`; const I = readJ(path.join(META, 'Item', id + '.itm.json')); const S = strings('Item_' + id); if (!I) continue;
      const a = ((I.ptSocketedEffects || [])[0] || {}).ptAttributes || []; const v = a[1] && a[1].szAttributeFormula ? parseFloat(a[1].szAttributeFormula.value) : null;
      tiers.push({ name: clean(S.Name), sock: clean(S.Description), v }); }
    const key = Object.keys(AD).find(k => k.toLowerCase() === ('S15_Socketable_' + who).toLowerCase()); const P = readJ(path.join(META, 'Power', `S15_Socketable_${who === 'BlackSoulStone' ? 'BlackSoulstone' : who}.pow.json`));
    const f = P ? (P.arScriptFormulas || P.ptScriptFormulas || []).map(x => x.tFormula && x.tFormula.value) : [];
    let t = String(AD[key] || '').replace(/\[PowerTag\.[^.\]]+\."Script Formula (\d)"\s*(\*\s*100)?\s*(\|[^\]]*)?\]/g, (m, n, pct, fmt) => { const v = parseFloat(f[+n]); return isFinite(v) ? (pct ? Math.round(v * 100) + '%' : String(v)) : 'X'; });
    t = t.replace(/\[\{VALUE2\}\|?([^\]]*)\]/g, (m, fmt) => tiers.map(x => x.v).join('/') + (/%/.test(fmt) ? '%' : '') + (/x/.test(fmt) ? '[x]' : /\+/.test(fmt) ? '[+]' : ''));
    out.splinters.push({ who, name: (tiers[0] || {}).name ? tiers[0].name.replace(/^\w+ /, '') : who, effect: clean(t), tiers });
  }
  // everything else the cube crafter can do, grouped
  const FAM = [['Hidden recipes', /Hidden_|WirtsCoin/], ['Soul Splinters', /SoulSplinter_/], ['Gems', /CraftGem_/], ['Boss summoning materials', /Collection_/], ['Undercity tributes', /Combine_Tribute/], ['Upgrade a unique to mythic', /UpgradeToMythic/],
    ['Add an affix', /AddAffix_/], ['Remove an affix', /RemoveAffix_/], ['Change an affix', /ChangeAffix_/], ['Reroll affix values', /RerollAffix_/], ['Transfigure', /Transfigure/], ['Upgrade to legendary', /UpgradeToLegendary_/], ['Upgrade to unique', /^X2_HoradricCube_UpgradeToUnique_/],
    ['Combine three items into one', /_3to1_/], ['Runes from the base game', /X2_Recipe_HoradricCube_Rune_/], ['Charms', /CraftCharm_/], ['Set pieces', /SetReroll_/], ['Other', /./]];
  const G = {}; let n = 0;
  for (const id of all) { if (/^Tempering|^EGD_|Runecraft_|Craft_Runeword|^Runeword_|_Bundle|Blocker|Prevent_|^zLEGACY/.test(id)) continue; const J = R(id); if (!J || J.eCrafterType !== 10) continue; n++;
    const S = strings('Recipe_' + id); const fam = FAM.find(f => f[1].test(id))[0]; const ing = ingOf(J); const drop = J.tSpecificItem && J.tSpecificItem.snoItemToDrop && J.tSpecificItem.snoItemToDrop.name;
    const row = { name: clean(S.Name) || '', desc: clean(S.Description || S.Desc || ''), in: txt(ing), out: drop ? itemName(drop) : '', id, hidden: J.bRecipeIsHidden ? 1 : 0 };
    const k = [row.name, row.in, row.out].join('|'); (G[fam] = G[fam] || {}); if (!G[fam][k]) G[fam][k] = row; }
  out.groups = FAM.map(f => ({ name: f[0], rows: Object.values(G[f[0]] || {}) })).filter(g => g.rows.length);
  out.count = n; return out;
};
