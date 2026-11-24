// Monster roster, attacks and elite affixes for the Defense Theory Craft page.
// usage: node monsters.js <d4data repo> <out file>
// Reads straight from git (cat-file), so no sparse checkout is needed.
//   Monster actor: name (Actor_<id>.stl), flHPScalarOverride, flDamageScalarOverride, base element.
//   Attacks: every power whose name matches the monster's pattern and has a damage payload
//            (tDamage.tHitpointScalar, a share of level-scaled hitpoints).
//   Elite affixes: MonsterAffix/*.maf that the game shows, their spawn power's name and damage payloads.
const { execFileSync } = require('child_process'); const fs = require('fs');
const F = require('../js/formula.js');
const [, , REPO, OUT] = process.argv;

const git = (args, input) => execFileSync('git', ['-C', REPO, ...args], { input, maxBuffer: 1 << 30 });
function batch(paths) {
  if (!paths.length) return {};
  const raw = git(['cat-file', '--batch'], paths.map(p => 'HEAD:' + p).join('\n') + '\n');
  const out = {}; let i = 0, k = 0;
  while (i < raw.length) {
    const nl = raw.indexOf(10, i); const h = raw.slice(i, nl).toString().split(' '); const p = paths[k++];
    if (h[1] === 'missing' || h.length < 3) { i = nl + 1; continue; }
    const sz = +h[2]; const body = raw.slice(nl + 1, nl + 1 + sz).toString(); i = nl + 2 + sz;
    try { out[p] = JSON.parse(body); } catch (e) { /* skip */ }
  }
  return out;
}
const lsNames = dir => git(['ls-tree', '--name-only', 'HEAD', dir + '/']).toString().split('\n').filter(Boolean).map(p => p.split('/').pop());
const POWERS = lsNames('json/base/meta/Power').map(f => f.replace(/\.pow\.json$/, ''));
const STRINGS = new Set(lsNames('json/enUS_Text/meta/StringList'));
const DMG = ['Physical', 'Fire', 'Lightning', 'Cold', 'Poison', 'Shadow', 'Holy'];

// [category, actor id, power pattern, optional label override]
const ROSTER = [
  ['normal', 'Fallen_Hound', /^fallen_hound_(bite|Attack)/i],
  ['normal', 'fallen_grunt_sword_fire', /^fallen_grunt_attack/i],
  ['normal', 'fallen_shaman', /^fallen_shaman_elementalbolt/i],
  ['normal', 'fallen_lunatic_fire', /^fallen_lunatic_suicide$/i],
  ['normal', 'Goatman_melee_phys', /^Goatman_melee_attk/i],
  ['normal', 'Goatman_ranged_phys', /^Goatman_ranged_attk/i],
  ['normal', 'Goatman_brute_phys', /^Goatman_brute_(attk|slam|charge)/i],
  ['normal', 'skeleton_melee_phys', /^skeleton_melee_(attack|shield_attack)/i],
  ['normal', 'skeleton_ranged_phys', /^skeleton_ranged_attack/i],
  ['normal', 'cultist_melee_male_phys', /^cultist_melee_attk/i],
  ['normal', 'cultist_caster_male_phys', /^cultist_caster_(attk|projectile|fire|basic)/i],
  ['normal', 'drowned_melee_phys', /^drowned_melee_attk/i],
  ['normal', 'drowned_brute_phys', /^drowned_Brute_attk/i],
  ['normal', 'knight_melee_cold', /^knight_melee_(attack|attk)/i],
  ['normal', 'knight_brute_cold', /^knight_brute_attk/i],
  ['normal', 'bandit_ambusher_male_phys', /^bandit_ambusher_(attk|backstab|poison_blade|ambush)/i],
  ['normal', 'bandit_ranged_male_phys', /^bandit_ranged_(attk|attack|volley)/i],
  ['normal', 'spider_adult', /^spider_adult_(attack|webshot)/i],
  ['normal', 'spider_host', /^spider_host_(attack|explode)$/i],
  ['normal', 'werewolf_melee_phys', /^werewolf_melee_(attack|groundpound|special)/i],
  ['normal', 'werewolf_stealth_phys', /^werewolf_stealth_(attack|attk_lunge)$/i],
  ['normal', 'vampire_brute_phys', /^vampire_brute_attk/i],
  ['normal', 'vampire_caster_phys', /^vampire_caster_attk/i],
  ['normal', 'zombie_brute_phys', /^zombie_brute_attack/i],
  ['normal', 'ghost_caster_phys', /^ghost_caster_(CircleOfDeath$|SoulfireNova$|basic|attk)/i],
  ['normal', 'snake_brute_phys', /^snake_brute_(attack|attk)/i],
  ['normal', 'snake_caster_phys', /^snake_caster_(eye_shadow|lobbed|eh_beam|attk)/i],
  ['normal', 'khazra_melee_shadow', /^khazra_melee_(attk|imbueAttk)/i],
  ['normal', 'khazra_brute_shadow', /^(Khazra_Brute_attk|khazra_brute_attk_charge$)/i],
  ['normal', 'khazra_casterAnchor_shadow', /^khazra_casterAnchor_attk/i],
  ['elite', 'fallen_brute_fire_miniboss', /^fallen_brute_fire_miniboss_(BurstCone|MeteorStrike$)|^fallen_brute_attack/i],
  ['elite', 'fallen_shaman_miniboss', /^fallen_shaman_miniboss_(elementalbolt|elementaltotem$)/i],
  ['elite', 'knight_brute_council_miniboss', /^knight_brute_council_miniboss_(combo|slam)/i],
  ['elite', 'zombie_brute_miniboss', /^zombie_brute_miniboss_(attack|charge$|PoisonPool|Shrapnel)/i],
  ['elite', 'drowned_brute_cold_miniboss', /^drowned_brute_miniboss_(Slam|Waves|frost_curse)/i],
  ['elite', 'ghost_caster_miniboss', /^ghost_caster_miniboss_(barrage|basic)$/i],
  ['elite', 'snake_caster_miniboss', /^snake_caster_miniboss_(cone|lobbed_poison)/i],
  ['elite', 'werewolf_miniboss', /^Werewolf_Miniboss_(?!Intro|Setup|Spiritborn)/i],
  ['elite', 'vampire_brute_shadow_miniboss', /^vampire_brute_miniboss_(Spiral|Summoning)|^vampire_brute_attk/i],
  ['elite', 'khazra_casterAnchor_shadow_miniboss', /^khazra_casterAnchor_attk/i],
  ['elite', 'demon_butcher', /^demon_butcher_miniboss(?!_quickturn|_death|_stagger|_setup)/i, 'The Butcher'],
  ['boss', 'EGB_Andariel_Boss', /^(EGB_andariel|andariel_boss)/i],
  ['boss', 'EGB_Duriel_boss', /^(EGB_Duriel(?!_Add)|duriel_boss)/i],
  ['boss', 'EGB_Belial_Giga', /^EGB_Belial/i],
  ['boss', 'EGB_Astaroth_Boss', /^(EGB_Astaroth|astaroth_boss)/i],
  ['boss', 'EGB_Urivar_Boss', /^(EGB_Urivar|Urivar)/i],
  ['boss', 'EGB_Harbinger_Boss', /^(EGB_Harbinger|Harbinger_Akarat)/i],
  ['boss', 'Uber_Lilith_p1_Boss', /^Uber_Lilith_p1/i, 'Lilith (phase 1)'],
  ['boss', 'Uber_Lilith_p2_Boss', /^Uber_lilith_p2/i, 'Lilith (phase 2)'],
  ['boss', 'Mephisto_Boss_P2', /^Mephisto_Boss_P[12]/i],
  ['boss', 'S10_Bartuc_Boss', /^S10_Bartuc_(Boss|boss)/i],
  ['boss', 'S01_boss', /^(EGB_)?S01_Boss_(?!EGB_Set)/i],
  ['boss', 'S02_boss', /^S02_boss_/i],
  ['boss', 'S03_Boss', /^S03_Boss_/i],
  ['boss', 'EGB_Knight_Brute_Lightning_Boss', /^EGB_Knight_Brute_Lightning_Boss/i, 'Grigoire, the Galvanic Saint'],
  ['boss', 'Demon_mega_unique_FrostT4Boss', /^(EGB_)?demon_mega_.*FrostT4/i, 'The Beast in the Ice'],
  ['boss', 'S14_EGB_Reaper_Boss', /^S14_reaper_boss/i, '', 'Season 14'],
  ['boss', 'S14_Exarch_MiniBoss', /^S14_(Angel_)?Exarch/i, '', 'Season 14'],
  ['boss', 'Triad_A_Boss', /^Triad_A_Boss_(attk|terrorRoar|mechanic)/i, 'Echo of Diablo', 'Season 15'],
  ['boss', 'S15_Triad_B_Boss', /^S15_(TriadB_(FireBreath|FireCircle|IceBlast|ArmTentacle)|Triad_B_(Tentacle_Attack|DungeonCrawl))/i, 'Echo of Baal', 'Season 15'],
  ['boss', 'Triad_C_Boss', /^Triad_C_(?!Boss_Council|IntroBark|Death|Stagger|Teleport|lavadelete)/i, 'Echo of Mephisto', 'Season 15'],
  ['boss', 'Triad_A_Boss_Council', /^Triad_CouncilBoss_attk/i, 'Prime Evils together (Echo of Tristram)', 'Season 15'],
  ['world', 'WorldBoss_AbyssLord', /^WorldBoss_AbyssLord_(attk|cloud)/i],
  ['world', 'WorldBoss_TreasureBeast', /^worldboss_treasurebeast_(attk|chest_s|ore_detonate|vomit)/i],
  ['world', 'WorldBoss_WanderingDeath', /^worldboss_wanderingdeath_(spell|attk|cage_burst|bone_cage)/i],
  ['elite', 'S15_Ancient_Korlic_boss', /^S15_Ancients?_(Korlic|(?!Korlic|Talic|Madawc))/i, 'Korlic (Ancients of Mount Arreat)', 'Season 15'],
  ['elite', 'S15_Ancient_Talic_boss', /^S15_Ancients?_(Talic|(?!Korlic|Talic|Madawc))/i, 'Talic (Ancients of Mount Arreat)', 'Season 15'],
  ['elite', 'S15_Ancient_Madawc_boss', /^S15_Ancients?_(Madawc|(?!Korlic|Talic|Madawc))/i, 'Madawc (Ancients of Mount Arreat)', 'Season 15'],
];
// Season 14 and 15 monsters found by name: each actor's powers are the ones sharing its name, trimmed one word at a time
const AUTO_SKIP = /Triad_|Ancient|Reaper|Exarch_MiniBoss|NPC|Splinter|Altar|Gizmo|Corpse|Map|Table|Proxy|Arrangement|Terrain|Door|Lever|Spawner|Portal|Book|Journal|Cain|Tyrael|Sankekur|Haedrig|Aidan|Kadala|Karyna|Pedestal|Moose|Nut|Cow|Bear|Advocate_B|_RW$|Summon$|Clone|Jakarta|_QST|usz|Ambush|Rupture|Stranger|Dannica|Crusader|Priest|Goblin|BaalsMinion_[BC]|Deadguy|Intro/i;
const SKIP = /(^|_)(death|setup|stagger|intro|outro|idle|aggro|yell|cloak|evade|camera|despawn|taunt|transition|cinematic|dummy|music|audio|escape|reposition)(_|$)|sit_|pray|dead_?pose|kneel|_fx|spawn|summon_?adds|_vo_|teleport$|_test/i;

const ACTORS = lsNames('json/base/meta/Actor').map(f => f.replace(/\.acr\.json$/, ''));
for (const a of ACTORS) {
  if (!/^S1[45]_/.test(a) || AUTO_SKIP.test(a) || !STRINGS.has(`Actor_${a}.stl.json`) || ROSTER.some(r => r[1] === a)) continue;
  const t = a.split('_'); let hit = null;
  for (let k = t.length; k >= 2 && !hit; k--) { const pre = t.slice(0, k).join('_').toLowerCase() + '_'; const m = POWERS.filter(p => p.toLowerCase().startsWith(pre) && !SKIP.test(p)); if (m.length && m.length <= 30) hit = pre; }
  if (!hit) continue;
  const esc = hit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  ROSTER.push(['auto', a, new RegExp('^' + esc, 'i'), '', a.startsWith('S14') ? 'Season 14' : 'Season 15']);
}
// actors and their names
const actorFiles = batch(ROSTER.map(r => `json/base/meta/Actor/${r[1]}.acr.json`));
const nameOf = {}; {
  const st = batch(ROSTER.filter(r => STRINGS.has(`Actor_${r[1]}.stl.json`)).map(r => `json/enUS_Text/meta/StringList/Actor_${r[1]}.stl.json`));
  for (const [p, d] of Object.entries(st)) { const id = p.split('/').pop().replace(/^Actor_|\.stl\.json$/g, ''); const n = (d.arStrings || []).find(x => x.szLabel === 'Name'); if (n) nameOf[id] = n.szText.trim(); }
}

function payloadsOf(d) {
  const sf = (d.ptScriptFormulas || []).map(x => x.tFormula.value);
  const ev = (s, k = 0) => { try { return F.evaluate(s || '0', { id: n => { const m = /^SF_(\d+)$/.exec(n); return m && k < 8 ? ev(sf[+m[1]], k + 1) : 0; }, table: () => 1, call: () => undefined }); } catch (e) { return 0; } };
  const pays = (d.arPayloads || []).filter(p => p.tDamage && p.tDamage.eType === 0).map(p => ({ v: ev(p.tDamage.tHitpointScalar.value), t: p.eForcedDamageType >= 0 ? p.eForcedDamageType : d.eDamageType })).filter(p => p.v > 0 && p.v < 1);
  const cd = ev((d.tCooldownTime || {}).value);
  return { pays, cd };
}
const human = (s, prefix) => {
  let t = s.replace(prefix, '').replace(/^[_\s]+/, '').replace(/^(attk|attack|atk)_?/i, '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  if (!t) t = 'Basic attack';
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
};

// event props and duplicates that the name search picks up
const JUNK = /Gifts|Stone$|Soup|Cloud|Jar|Just a Cow|^Baal$|Council Member|Hell Spawn/i;
const monsters = [];
const allPow = [];
for (const [cat, id, re] of ROSTER) { allPow.push(...POWERS.filter(p => re.test(p) && !SKIP.test(p))); }
const powFiles = batch([...new Set(allPow)].map(p => `json/base/meta/Power/${p}.pow.json`));
const powData = {}; for (const [p, d] of Object.entries(powFiles)) powData[p.split('/').pop().replace('.pow.json', '')] = d;
for (const [cat, id, re, label, tag] of ROSTER) {
  const A = actorFiles[`json/base/meta/Actor/${id}.acr.json`]; const M = A && A.ptMonsterData && A.ptMonsterData[0];
  const names = POWERS.filter(p => re.test(p) && !SKIP.test(p) && powData[p]);
  const pre = new RegExp('^' + (re.source.match(/\^\(?([A-Za-z0-9]+_[A-Za-z0-9]+)/) || [, ''])[1], 'i');
  const attacks = [];
  for (const n of names) {
    const { pays, cd } = payloadsOf(powData[n]); if (!pays.length) continue;
    const top = pays.slice().sort((a, b) => b.v - a.v)[0];
    attacks.push({ id: n, name: human(n, pre), s: +top.v.toFixed(4), type: DMG[top.t] || 'Physical', hits: pays.length, all: pays.map(p => +p.v.toFixed(4)), cd: cd > 0 ? +cd.toFixed(2) : 0 });
  }
  if (!attacks.length) { console.warn('no attacks for', id); continue; }
  attacks.sort((a, b) => b.s - a.s);
  const hpO = M ? +(M.flHPScalarOverride || 1).toFixed(3) : 1;
  const nm = label || nameOf[id] || id.replace(/_/g, ' ');
  let c = cat; if (c === 'auto') c = /boss/i.test(id) && hpO >= 20 ? 'boss' : hpO > 4.75 || /_UE\d?$|_UE_|miniboss|boss/i.test(id) ? 'elite' : 'normal';
  if (cat === 'auto' && /^(The Countess|Na-Krul|The Summoner)$/.test(nm)) c = 'elite';
  if (monsters.some(x => x.name === nm && (x.cat === c || cat === 'auto')) || (cat === 'auto' && JUNK.test(nm))) continue;
  monsters.push({ id, cat: c, tag: tag || '', name: nm, hp: hpO, dmg: M ? +(M.flDamageScalarOverride || 1).toFixed(3) : 1, el: M ? DMG[M.eBaseElement] || 'Physical' : 'Physical', attacks });
}

// ---------- elite affixes ----------
const AFF_SKIP = /DEPRECATED|^S\d|^X\d|^FYM|^VFX|^Test|^proto|^Unique$|^Legendary$|^Mythic$|^Ancestral$|^Champion|NoIcon|Hidden|Malignant|BSK|Procgen|Warplans|Warlock|khazra|Axe Bad|DamageMitigation|EGB/;
// The game sorts affixes into Defensive, Offensive, Crowd Control and Passive (MonsterAffixCategories) but the
// files we have do not say which affix sits in which group, so this grouping is ours, from what each affix does.
const AFF_CAT = {
  Defensive: ['Shielded', 'Suppressor', 'Veiled', 'ElementalResist', 'PhysicalResist', 'FireResist', 'ColdResist', 'PoisonResist', 'RestorativeFountain', 'LifeLink', 'Martyrdom'],
  CrowdControl: ['Waller', 'Tether', 'Vortex', 'Frozen', 'CripplingAura', 'DeathsGrasp', 'Debilitate', 'SeekingCold', 'Earthquake'],
  Passive: ['HeavyHitter', 'Berserker', 'FleetFoot', 'Gilded', 'Commanding', 'SoulEater', 'Executioner', 'SapperV2', 'ShieldBreaker', 'Avenger', 'Splitter'],
};
const catOf = n => Object.keys(AFF_CAT).find(k => AFF_CAT[k].includes(n)) || 'Offensive';
const mafNames = lsNames('json/base/meta/MonsterAffix').map(f => f.replace(/\.maf\.json$/, '')).filter(n => !AFF_SKIP.test(n));
const mafs = batch(mafNames.map(n => `json/base/meta/MonsterAffix/${n}.maf.json`));
const affixes = [];
const affPowNames = [];
const affRows = [];
for (const n of mafNames) {
  const d = mafs[`json/base/meta/MonsterAffix/${n}.maf.json`]; if (!d || !d.bShown || !d.snoSpawnPower) continue;
  const sp = d.snoSpawnPower.name; const base = sp.replace(/_v\d+$|_V\d+$|V\d+$/, '');
  const rel = POWERS.filter(p => p === sp || (p.toLowerCase().startsWith(base.toLowerCase()) && !SKIP.test(p)));
  affRows.push({ n, sp, rel }); affPowNames.push(...rel);
}
const affPow = {}; for (const [p, d] of Object.entries(batch([...new Set(affPowNames)].map(p => `json/base/meta/Power/${p}.pow.json`)))) affPow[p.split('/').pop().replace('.pow.json', '')] = d;
const affStr = {}; {
  const want = [...new Set(affPowNames)].filter(p => STRINGS.has(`Power_${p}.stl.json`));
  for (const [p, d] of Object.entries(batch(want.map(p => `json/enUS_Text/meta/StringList/Power_${p}.stl.json`)))) { const id = p.split('/').pop().replace(/^Power_|\.stl\.json$/g, ''); const nm = (d.arStrings || []).find(x => x.szLabel === 'name'); if (nm) affStr[id] = nm.szText.trim(); }
}
for (const { n, sp, rel } of affRows) {
  const hits = [];
  for (const p of rel) { if (!affPow[p]) continue; const { pays } = payloadsOf(affPow[p]); for (const x of pays) hits.push({ s: +x.v.toFixed(4), type: DMG[x.t] || 'Physical', from: p }); }
  hits.sort((a, b) => b.s - a.s);
  const name = affStr[sp] || rel.map(p => affStr[p]).find(Boolean) || n.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/ V\d$/i, '');
  affixes.push({ id: n, name, cat: catOf(n), hits: hits.slice(0, 3) });
}
affixes.sort((a, b) => a.name.localeCompare(b.name));
const MAC = batch(['json/base/meta/GameBalance/MonsterAffixCategories.gam.json'])['json/base/meta/GameBalance/MonsterAffixCategories.gam.json'];
const caps = {}; if (MAC) for (const e of MAC.ptData[0].tEntries) caps[e.tHeader.szName] = { elite: e.tEliteData.arAllowedCount[0], champion: e.tChampionData.arAllowedCount[0], superElite: e.tSuperEliteData.arAllowedCount[0] };
// affix count per difficulty tier: three unnamed fields on DifficultyTiers (elite, super elite, champion)
const DT = batch(['json/base/meta/GameBalance/DifficultyTiers.gam.json'])['json/base/meta/GameBalance/DifficultyTiers.gam.json'];
const counts = DT ? DT.ptData[0].tEntries.map(e => ({ t: e.nTier, elite: e.unk_d0623fd, superElite: e.unk_44d698c, champion: e.unk_5438619 })) : [];

fs.writeFileSync(OUT, 'window.D4MON=' + JSON.stringify({ monsters, affixes, caps, counts }) + ';\n');
console.log('monsters', monsters.length, monsters.map(m => `${m.name}:${m.attacks.length}`).join(', '));
console.log('affixes', affixes.length, affixes.map(a => `${a.name}[${a.cat[0]}]${a.hits.length ? '*' : ''}`).join(', '));
console.log('caps', JSON.stringify(caps));
