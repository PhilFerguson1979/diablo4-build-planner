// Builds compact planner data from a d4data checkout.
// usage: node extract.js <d4data/json dir> <out dir> <label>
const fs = require('fs'), path = require('path');
const F = require('../js/formula.js');
const T = require('../js/text.js');

const [, , ROOT, OUT, LABEL] = process.argv;
const META = path.join(ROOT, 'base/meta'), STR = path.join(ROOT, 'enUS_Text/meta/StringList');
const readJ = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } };
const hash = s => { let x = 0; for (const c of s.toLowerCase()) x = (x * 33 + c.charCodeAt(0)) >>> 0; return x; };
const strings = name => {
  const j = readJ(path.join(STR, name + '.stl.json')); const o = {};
  if (j) for (const e of j.arStrings) o[e.szLabel] = e.szText;
  return o;
};
const gb = n => readJ(path.join(ROOT, '..', 'gb', n + '.gam.json')) || readJ(path.join(META, 'GameBalance', n + '.gam.json'));

// ---------- tables ----------
const pft = gb('PowerFormulaTables');
const TABLES = pft ? pft.ptData[0].tEntries.map(e => ({ name: e.szName, v: e.flValue.map(x => Math.round(x * 10000) / 10000) })) : [];
const tableFn = (i, lvl) => { const t = TABLES[i]; if (!t) return 0; const k = Math.max(0, Math.min(t.v.length - 1, Math.round(lvl))); return t.v[k]; };

// ---------- class order (fUsableByClass index) ----------
const CLASSES = ['Sorcerer', 'Druid', 'Barbarian', 'Rogue', 'Necromancer', 'Spiritborn', 'Paladin', 'Warlock'];
const KITS = { Barbarian: 'Barbarian', Druid: 'Druid', Necromancer: 'Necromancer', Rogue: 'Rogue', Sorcerer: 'Sorcerer', Spiritborn: 'Spiritborn', Paladin: 'Paladin_NEW', Warlock: 'Warlock' };

// ---------- skill tree rewards ----------
const rewards = {};
const str = gb('SkillTreeRewards');
if (str) for (const e of str.ptData[0].tEntries) rewards[e.tHeader.szName] = { type: e.eType, power: e.snoPower && e.snoPower.name, mod: e.szPowerMod, max: e.dwMaxTalentRanks };

const MODKEYS = [];
for (const p of ['Upgrade', 'Side', 'Mod', 'Enhancement', 'Variant']) for (const s of '123456789ABCDEFGH') MODKEYS.push(p + s);
MODKEYS.push('Shapeshift_Default');
const modKeyByHash = {}; for (const k of MODKEYS) modKeyByHash[hash(k)] = k;

const prettyTag = n => (n || '').replace(/^Skill_Primary_|^Skill_|^FILTER_/, '').replace(/_/g, ' ');
const DMG = ['Physical', 'Fire', 'Lightning', 'Cold', 'Poison', 'Shadow', 'Holy'];

// some references use different letter case than the file (mercenary_cursedChild_soulChain), so look names up without case
let POWER_CASE = null;
const powerFile = name => { if (!POWER_CASE) { POWER_CASE = {}; try { for (const f of fs.readdirSync(path.join(META, 'Power'))) POWER_CASE[f.toLowerCase()] = f.replace(/\.pow\.json$/, ''); } catch (e) { /* none */ } } return POWER_CASE[(name + '.pow.json').toLowerCase()] || name; };
// work-in-progress entries Blizzard ships in the files but not in the game: (DNS), (DO NOT SHIP), [PH] placeholders
const UNSHIPPED = /^\s*(\(DNS\)|\(DO NOT SHIP\)|\(PH\)|\[PH\]|PH\s*-|New Item\b)|\[PH\]|DO NOT USE/i;
function extractPower(name) {
  name = powerFile(name);
  const d = readJ(path.join(META, 'Power', name + '.pow.json')); if (!d) return null;
  const s = strings('Power_' + name);
  const sf = (d.ptScriptFormulas || []).map(x => x.tFormula.value);
  const payloadNames = {};
  const allText = Object.values(s).join(' ');
  for (const m of allText.matchAll(/\{payload:([A-Za-z0-9_]+)\}/g)) payloadNames[hash(m[1])] = m[1];
  const payloads = {};
  for (const p of d.arPayloads || []) {
    const nm = payloadNames[p.dwID] || ('P' + p.dwPayloadId);
    payloads[nm] = p.tDamage && p.tDamage.tHitpointScalar ? p.tDamage.tHitpointScalar.value : '0';
  }
  const mods = (d.arMods || []).map(m => ({ id: m.dwModId, key: modKeyByHash[m.szName] || ('M' + m.dwModId), hash: m.szName, name: s['Mod' + m.dwModId + '_Name'] || '', desc: s['Mod' + m.dwModId + '_Description'] || '' }));
  return {
    id: name, name: s.name || name.replace(/^[A-Za-z]+_/, '').replace(/_/g, ' '), desc: s.desc || '', rankDesc: s.rankup_desc || '',
    tag: prettyTag(d.tPrimaryTag && d.tPrimaryTag.gbidSkillTag && d.tPrimaryTag.gbidSkillTag.name),
    tags: (d.arSkillTags || []).map(t => prettyTag(t.gbidSkillTag && t.gbidSkillTag.name)).filter(Boolean),
    dmg: DMG[d.eDamageType] || '', sf, payloads, mods,
    cd: d.tCooldownTime ? d.tCooldownTime.value : '0', lh: d.tCombatEffectChance ? d.tCombatEffectChance.value : '0',
    charges: d.tMaxCharges ? d.tMaxCharges.value : '0', recharge: d.tRechargeTime ? d.tRechargeTime.value : '0',
    cost: (d.arResourceCosts || []).map(c => { const v = [c.tResourceCost, c.tInitialCost, c.tCost, c.tMinRequired].map(x => x && x.value).find(x => x && x !== '0'); return v || '0'; }),
    channel: d.bChannelled || 0, basic: d.bIsBasicAttack || 0, passive: d.bIsPassive || 0,
  };
}

// ---------- skill trees ----------
function buildTree(kitName, rw) {
  const kit = readJ(path.join(META, 'SkillKit', kitName + '.skl.json')); if (!kit) return null;
  const powers = {};
  const nodes = kit.arNodes.map((n, i) => {
    const rn = n.gbidReward && n.gbidReward.name; const r = rn ? rw[rn] : null;
    let power = null, modId = null;
    if (r && r.power) {
      if (!(r.power in powers)) powers[r.power] = extractPower(r.power);
      power = r.power;
      const P = powers[r.power];
      if (r.type === 1 && P) { const m = P.mods.find(x => x.hash === r.mod); modId = m ? m.id : null; }
    }
    return { i, id: n.dwID, x: Math.round(n.vPosition.x), y: Math.round(n.vPosition.y), g: n.nExclusiveGroupId, lvl: n.dwNodeRequiredPlayerLevel || 0, root: n.eRootNodeType || 0, reward: rn || null, kind: r ? (r.type === 0 ? 'unlock' : r.type === 2 ? 'passive' : 'mod') : 'hub', power, mod: modId, max: r ? r.max : 0, c: n.arConnections.map(c => c.nIndexNode) };
  });
  for (const k of Object.keys(powers)) if (!powers[k]) delete powers[k];
  return { nodes, links: kit.arConnections.map(c => [c.nIndexNodeA, c.nIndexNodeB]), powers };
}
const classes = {};
for (const cls of Object.keys(KITS)) { const t = buildTree(KITS[cls], rewards); if (t) { t.nodes.forEach(n => { if (n.kind === 'passive') n.kind = 'mod'; }); classes[cls] = t; } }

// ---------- mercenaries: hired skill tree, reinforcement skills, bonus power ----------
const mercs = [];
for (const f of (() => { try { return fs.readdirSync(path.join(META, 'MercenaryClass')); } catch (e) { return []; } })().filter(f => /^MercenaryClass_/.test(f)).sort()) {
  const M = readJ(path.join(META, 'MercenaryClass', f)); if (!M || !M.snoSkillKit) continue;
  const key = f.replace(/^MercenaryClass_|\.mrc\.json$/g, '');
  const tree = buildTree(M.snoSkillKit.name, rewards); if (!tree) continue;
  const kit = readJ(path.join(META, 'SkillKit', M.snoSkillKit.name + '.skl.json'));
  // the merc's skills are the unlock nodes on its tree (the kit's own active list repeats passives in spare slots)
  const actives = [...new Set(tree.nodes.filter(n => n.kind === 'unlock' && n.power).map(n => n.power))];
  for (const a of actives) if (!tree.powers[a]) { const P = extractPower(a); if (P) tree.powers[a] = P; }
  const bonusName = M.unk_7135d14 && M.unk_7135d14.name; let bonus = null;
  if (bonusName) { bonus = extractPower(bonusName); if (bonus) tree.powers[bonusName] = bonus; }
  for (const gp of M.arGlobalPassivePowers || []) if (gp && gp.name && !tree.powers[gp.name]) { const P = extractPower(gp.name); if (P) tree.powers[gp.name] = P; }
  const nm = strings('Actor_' + (M.snoActor ? M.snoActor.name : 'Mercenary_' + key));
  mercs.push(Object.assign({ id: key, name: nm.Name || key, role: key.replace(/([a-z])([A-Z])/g, '$1 $2'), actives, bonus: bonus ? bonusName : null }, tree));
}

// ---------- war plans: one passive tree per activity ----------
const wrw = {};
{ const t = gb('Warplans_SkillTreeRewards'); if (t) for (const e of t.ptData[0].tEntries) wrw[e.tHeader.szName] = { type: e.eType, power: e.snoPower && e.snoPower.name, mod: e.szPowerMod, max: e.dwMaxTalentRanks }; }
const WARPLAN_NAMES = { Pit: 'The Pit', Helltide: 'Helltide', InfernalHordes: 'Infernal Hordes', NightmareDungeons: 'Nightmare Dungeons', Undercity: 'Undercity', BossLair: 'Lair Bosses', Whispers: 'Whispers', General: 'General', Seasonal_General: 'Seasonal' };
const warplans = [];
for (const f of (() => { try { return fs.readdirSync(path.join(META, 'SkillKit')); } catch (e) { return []; } })().filter(f => /^Warplans_/.test(f)).sort()) {
  const key = f.replace(/^Warplans_|\.skl\.json$/g, '');
  const tree = buildTree('Warplans_' + key, wrw); if (!tree) continue;
  warplans.push(Object.assign({ id: key, name: WARPLAN_NAMES[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2') }, tree));
}

// ---------- class mechanics (one per class; the Warlock's Soul Shards are below) ----------
// Each mechanic is a set of groups; each group lets you pick a number of options. Powers come from the PlayerClass file.
const mechanics = {};
{
  const P = n => { const x = extractPower(n); return x ? x : null; };
  const opt = (id, name, power, extra) => power ? { id, name: name || power.name, power, extra: extra || null } : null;
  const pcl = c => { const d = readJ(path.join(META, 'PlayerClass', c + '.pcl.json')); return d ? [...JSON.stringify(d).matchAll(/"groupName": ?"Power", ?"name": ?"([^"]+)"/g)].map(m => m[1]) : []; };
  // Barbarian: Weapon Expertise, one weapon set as the Technique
  { const ws = [['1HAxe', 'One-Handed Axe'], ['1HMace', 'One-Handed Mace'], ['1HSword', 'One-Handed Sword'], ['2HAxe', 'Two-Handed Axe'], ['2HMace', 'Two-Handed Mace'], ['2HSword', 'Two-Handed Sword'], ['2HPolearm', 'Polearm']];
    const refs = pcl('Barbarian');
    const os = ws.map(([k, n]) => { const r10 = refs.find(r => r.startsWith('Barbarian_WeaponExpertise_' + k + '_') && /Rank10/.test(r)); return opt(k, n + ' Expertise', P('Barbarian_WeaponExpertise_' + k), r10 ? P(r10) : null); }).filter(Boolean);
    if (os.length) mechanics.Barbarian = { title: 'Weapon Expertise', intro: 'Every weapon type has its own expertise. Set one as your Technique to keep its bonus whatever you hold. The rank 10 bonus shows under each.', groups: [{ name: 'Technique', pick: 1, options: os }] }; }
  // Druid: Spirit Boons, one per spirit plus a second from the bonded spirit
  { const sp = ['Deer', 'Eagle', 'Wolf', 'Snake'];
    const groups = sp.map(k => ({ name: k, pick: 1, bond: true, options: [1, 2, 3, 4].map(i => opt(k + i, '', P(`Druid_Passive_${k}_0${i}`))).filter(Boolean) })).filter(g => g.options.length);
    if (groups.length) mechanics.Druid = { title: 'Spirit Boons', intro: 'Pick one boon from each spirit. Bond with one spirit to take a second boon from it.', bond: true, groups }; }
  // Necromancer: Book of the Dead, one variant per minion and one of its two upgrades, or sacrifice it
  { const M = [['SkeletonWarrior', 'Skeletal Warriors', [['Skirmisher', 'Skirmishers'], ['Defender', 'Defenders'], ['Reaper', 'Reapers']]], ['SkeletonMage', 'Skeletal Mages', [['Shadow', 'Shadow Mages'], ['Cold', 'Cold Mages'], ['Sacrifice', 'Bone Mages']]], ['Golem', 'Golem', [['Bone', 'Bone Golem'], ['Blood', 'Blood Golem'], ['Iron', 'Iron Golem']]]];
    const groups = M.map(([k, n, vs]) => ({ name: n, pick: 1, book: true, options: vs.map(([v, vn]) => { const a = P(`Necromancer_${k}_${v}_Passive_UpgradeA`), b = P(`Necromancer_${k}_${v}_Passive_UpgradeB`), sc = P(`Necromancer_${k}_${v}_Passive_Sacrifice`); return a || b || sc ? { id: k + '_' + v, name: vn, upgrades: [a && { id: 'A', name: 'Upgrade A', power: a }, b && { id: 'B', name: 'Upgrade B', power: b }, sc && { id: 'S', name: 'Sacrifice', power: sc }].filter(Boolean) } : null; }).filter(Boolean) })).filter(g => g.options.length);
    if (groups.length) mechanics.Necromancer = { title: 'Book of the Dead', intro: 'For each minion, pick a type and one of its two upgrades. Or sacrifice it: the minion is not summoned and you gain its sacrifice bonus instead.', groups }; }
  // Rogue: Specialization
  { const os = pcl('Rogue').filter(r => /^Rogue_Talent_Mechanic_/.test(r)).map(r => opt(r, '', P(r))).filter(Boolean);
    if (os.length) mechanics.Rogue = { title: 'Specialization', intro: 'Pick one Specialization.', groups: [{ name: 'Specialization', pick: 1, options: os }] }; }
  // Sorcerer: Enchantments, two slots of skill enchantments
  { const names = (() => { try { return fs.readdirSync(path.join(META, 'Power')); } catch (e) { return []; } })().filter(f => /^Sorcerer_Enchantment_/.test(f) && !/_Active/.test(f)).map(f => f.replace('.pow.json', ''));
    const os = names.map(n => { const p2 = P(n); if (!p2) return null; const skill = n.replace('Sorcerer_Enchantment_', ''); const base = Object.values((classes.Sorcerer || { powers: {} }).powers).find(x => x.id.toLowerCase() === ('Sorcerer_' + skill).toLowerCase()); return opt(n, (base ? base.name : skill.replace(/([a-z])([A-Z])/g, '$1 $2')) + ' Enchantment', p2); }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
    if (os.length) mechanics.Sorcerer = { title: 'Enchantments', intro: 'Put two skills into your Enchantment slots to gain their enchantment effects.', groups: [{ name: 'Enchantment slots', pick: 2, options: os }] }; }
  // Spiritborn: Spirit Hall, a primary and a different secondary guardian
  { const refs = pcl('Spiritborn'); const G = ['Jaguar', 'Gorilla', 'Eagle', 'Centipede'];
    const one = (g, kind) => { const r = refs.find(x => new RegExp(`^spiritborn_${g}_${kind}_passive`, 'i').test(x)); return r ? opt(g + '_' + kind, g, P(r)) : null; };
    const prim = G.map(g => one(g, 'sun')).filter(Boolean), sec = G.map(g => one(g, 'moon')).filter(Boolean);
    if (prim.length) mechanics.Spiritborn = { title: 'Spirit Hall', intro: 'Pick a primary Spirit Guardian, then a different one as your secondary.', distinct: true, groups: [{ name: 'Primary guardian', pick: 1, options: prim }, { name: 'Secondary guardian', pick: 1, options: sec }] }; }
  // Paladin: Oath
  { const ON = { Angel: 'Oath of the Disciple', Judgement: 'Oath of the Judicator', Juggernaut: 'Oath of the Juggernaut', Zealot: 'Oath of the Zealot' };
    const os = Object.keys(ON).map(k => opt('Paladin_Oath_' + k, ON[k], P('Paladin_Oath_' + k))).filter(Boolean);
    if (os.length) mechanics.Paladin = { title: 'Oath', intro: 'Swear one Oath. It shapes which skill school your build leans on.', groups: [{ name: 'Oath', pick: 1, options: os }] }; }
}

// ---------- Warlock soul shards: pick one shard and one of its three fragments ----------
const shards = [];
for (const sh of ['Legion', 'Vanguard', 'Mastermind', 'Ritualist']) {
  const P = extractPower('Warlock_ClassMechanic_' + sh); if (!P) continue;
  const frags = ['A', 'B', 'C'].map(k => extractPower('Warlock_ClassMechanic_' + sh + '_' + k)).filter(Boolean);
  shards.push({ id: sh, power: P, frags });
}

// ---------- monster scaling for the defense page ----------
const scaling = (() => {
  const ls = gb('LevelScaling'), dt = gb('DifficultyTiers'); if (!ls || !dt) return null;
  const glo = readJ(path.join(META, 'Global', 'globals.glo.json')) || {};
  const gs = JSON.stringify(glo);
  const num = k => { const m = gs.match(new RegExp('"' + k + '": ?([-0-9.e]+)')); return m ? +m[1] : null; };
  const lv = ls.ptData[0].tEntries.filter(e => e.nLevel <= 200).map(e => ({ l: e.nLevel, hp: e.flHPScalar, md: e.flMonsterDamageScalar, mnp: e.flMonsterNonPhysicalDamageScalar, mhp: e.flMonsterHPScalar, rd: e.flMonsterRarityDamageScalar, rh: e.flMonsterRarityHPScalar, dr: e.flMonsterHPConvertedToDamageReduction, ia: e.nPlayerIdealArmor, ir: e.nPlayerIdealResistance, ad: e.nArmorDampingFactor, rdf: e.nResistanceDampingFactor, as: e.flArmorDamageReductionScalar, rs: e.flResistanceDamageReductionScalar }));
  const tiers = dt.ptData[0].tEntries.map(e => ({ t: e.nTier, hp: e.flMonsterHPScalar, dmg: e.flMonsterDamageScalar, il: e.nMonsterIntensityLevel, am: e.flPlayerIdealArmorModifier, rm: e.flPlayerIdealResistanceModifier }));
  const wt = []; for (const m of gs.matchAll(/"dwDifficultyTier": ?(\d+)/g)) wt.push(+m[1]);
  const dl = strings('DifficultyLevels');
  const worlds = wt.map((t, i) => ({ tier: t, name: dl['WT' + (i + 1) + '_Title'] || ('Tier ' + t) }));
  return { levels: lv, tiers, worlds, healthBase: num('flHealthBase'), maxArmor: num('flMaxArmorReduction'), maxRes: num('flMaxResistanceReduction'), maxBlock: num('flMaxBlockDamageReductionPercentCap'), vuln: num('flVulnerableDamageBonus'), variance: num('flDefaultDamageVariance') };
})();

// ---------- affix value resolution ----------
const affixCache = {};
function loadAffix(name) {
  if (affixCache[name] !== undefined) return affixCache[name];
  const a = readJ(path.join(META, 'Affix', name + '.aff.json'));
  affixCache[name] = a; return a;
}
const powerCache = {};
function powerSF(pname, n) {
  if (!(pname in powerCache)) { const d = readJ(path.join(META, 'Power', pname + '.pow.json')); powerCache[pname] = d ? (d.ptScriptFormulas || []).map(x => x.tFormula.value) : null; }
  const sf = powerCache[pname]; if (!sf) return undefined;
  return F.evaluate(sf[n] || '0', { id: id => /^SF_\d+$/.test(id) ? F.evaluate(sf[+id.slice(3)] || '0', {}) : 0, table: tableFn });
}
const AFX = {}; { const af = readJ(path.join(META, 'GameBalance', 'AttributeFormulas.gam.json')); if (af) for (const e of af.ptData[0].tEntries) AFX[e.tHeader.szName] = e.arRanges.length ? e.arRanges[e.arRanges.length - 1].tFormula.value : '0'; }
function affixCtx(aff, extra) {
  const attrs = {};
  for (const at of (aff && aff.ptItemAffixAttributes) || []) { const n = at.tAttribute.__eAttribute_name__; let f = at.tAttribute.szAttributeFormula.value; if ((!f || f === '0') && at.tAttribute.gbidFormula && AFX[at.tAttribute.gbidFormula.name]) f = AFX[at.tAttribute.gbidFormula.name]; if (n && !(n in attrs)) attrs[n] = f; }
  const maxRank = aff && aff.arMaxLegendaryRanks ? Math.max(1, ...aff.arMaxLegendaryRanks) : 1;
  const statics = (aff && aff.arStaticValues) || [];
  const evalAt = (expr, rank) => F.evaluate(expr, {
    id: id => {
      if (attrs[id] !== undefined) return F.evaluate(attrs[id], { call: (f, A) => f === 'CurrentLegendaryRank' ? rank : (/Range/.test(f) && A.length >= 2 ? (rank === 1 ? A[A.length - 2] : A[A.length - 1]) : undefined), table: tableFn });
      let m = id.match(/^Affix\."Static Value (\d+)"$/); if (m) return statics[+m[1]];
      m = id.match(/^PowerTag\.([A-Za-z0-9_]+)\."Script Formula (\d+)"$/); if (m) return powerSF(m[1], +m[2]);
      if (/Weapon_Damage/.test(id)) return 1000;
      return extra && extra[id] !== undefined ? extra[id] : undefined;
    },
    call: (f, A) => f === 'CurrentLegendaryRank' ? rank : (/Range/.test(f) && A.length >= 2 ? (rank === 1 ? A[A.length - 2] : A[A.length - 1]) : undefined), table: tableFn,
  });
  const isFrac = expr => Object.keys(attrs).some(k => expr.includes(k) && /Range/.test(attrs[k]));
  const range = (expr, fmt) => {
    let a = evalAt(expr, 1), b = evalAt(expr, Math.max(maxRank, 2));
    if (fmt && fmt.includes('%') && isFrac(expr) && !/\*\s*100/.test(expr) && Math.max(Math.abs(a), Math.abs(b)) < 5) { a *= 100; b *= 100; }
    return Math.abs(a - b) < 1e-9 ? a : { min: Math.min(a, b), max: Math.max(a, b) };
  };
  return {
    value: (inner, expr, fmt) => range(inner, fmt),
    token: (n, fmt) => { if (attrs[n] !== undefined) return range(n, fmt); return undefined; },
    cond: c => c === 'ADVANCED_TOOLTIP',
  };
}
const renderAffix = (tpl, aff) => T.render(tpl, affixCtx(aff));
const classMask = arr => (arr || []).map((v, i) => v ? CLASSES[i] : null).filter(Boolean);


// ---------- plain stat lines from AttributeDescriptions ----------
const AD = strings('AttributeDescriptions');
const tagNameByHash = {};
{ const st = strings('SkillTags'); const tf = gb('SkillTags'); if (tf) for (const e of tf.ptData[0].tEntries) { const n = e.tHeader.szName; const nm = st[n + '_TagName']; if (nm) tagNameByHash[hash(n)] = nm; } }
function attrParam(attr, p) {
  if (p == null || p < 0) return '';
  if (/Skill_Tag/.test(attr)) return tagNameByHash[p >>> 0] || '';
  if (/Dot_Type/.test(attr)) return ['Bleeding', 'Burning', 'Shocked', 'Chilled', 'Poisoned', 'Shadow-afflicted', 'Holy-afflicted'][p] || '';
  if (/Damage_Type|Resist/.test(attr)) return DMG[p] || '';
  return '';
}
function attrLines(A) {
  const out = [];
  for (const at of A.ptItemAffixAttributes || []) {
    const attr = at.tAttribute.__eAttribute_name__; const f = at.tAttribute.szAttributeFormula.value;
    const ev = hi => F.evaluate(f, { call: (fn, args) => /Range/.test(fn) && args.length >= 2 ? (hi ? args[args.length - 1] : args[args.length - 2]) : undefined, id: () => 0, table: tableFn });
    const lo = ev(false), hi = ev(true);
    if (!lo && !hi) continue;
    const pn = attrParam(attr, at.tAttribute.nParam);
    let tpl = AD[attr + '#' + pn] || AD[attr]; if (!tpl) continue;
    tpl = (pn ? tpl.replace(/\{[vV][aA][lL][uU][eE]1\}/g, pn) : tpl).replace(/\|\d?([A-Za-z]+):([A-Za-z]+);/g, '$2');
    const line = tpl.replace(/\[([^\[\]|]+?)(?:\|([^|\]]*)\|?)?\]/g, (m, expr, fmt) => {
      const at2 = v => F.evaluate(expr.replace(/\{[vV][aA][lL][uU][eE]\d?\}/g, '(' + v + ')'), {});
      const a = at2(lo), b = at2(hi);
      return '<b class="num">' + T.fmtVal(Math.abs(a - b) < 1e-9 ? a : { min: Math.min(a, b), max: Math.max(a, b) }, (fmt || '').replace('~', '')) + '</b>';
    }).replace(/\{[vV][aA][lL][uU][eE]\d?\}/g, () => '<b class="num">' + T.fmtVal(Math.abs(lo - hi) < 1e-9 ? lo : { min: lo, max: hi }) + '</b>');
    out.push(T.render(line, { token: () => undefined, cond: () => false }));
  }
  return out;
}

// ---------- aspects ----------
const aspects = [];
for (const f of fs.readdirSync(path.join(META, 'Aspect'))) {
  const a = readJ(path.join(META, 'Aspect', f)); if (!a || !a.snoAffix) continue;
  const aff = loadAffix(a.snoAffix.name); if (!aff) continue;
  const s = strings('Affix_' + a.snoAffix.name); if (!s.Desc) continue;
  const tags = (aff.arAffixSkillTags || []).map(t => (t && t.name) || '');
  const cat = (tags.find(t => /FILTER_Legendary_/.test(t)) || '').replace('FILTER_Legendary_', '');
  if (UNSHIPPED.test(s.Name || '')) continue;
  aspects.push({ id: a.snoAffix.name, name: (s.Name || '').replace(/^of /, 'Aspect of ').replace(/^(?!Aspect)(.*)$/, '$1'), raw: s.Name || '', cat, classes: (() => { const c = classMask(aff.fAllowedForPlayerClass); if (c.length) return c; const m = a.snoAffix.name.match(/^legendary_([a-z]+)_/i); const k = m && { barb: 'Barbarian', druid: 'Druid', necro: 'Necromancer', rogue: 'Rogue', sorc: 'Sorcerer', spiritborn: 'Spiritborn', paladin: 'Paladin', warlock: 'Warlock' }[m[1].toLowerCase()]; return k ? [k] : c; })(), desc: renderAffix(s.Desc, aff) });
}

// ---------- uniques / runewords / charms ----------
const uniques = [];
for (const f of fs.readdirSync(path.join(META, 'Item'))) {
  if (!/Unique|Runeword|Charm|Talisman|Seal/i.test(f)) continue;
  const it = readJ(path.join(META, 'Item', f)); if (!it) continue;
  const id = f.replace('.itm.json', '');
  const s = strings('Item_' + id); if (!s.Name) continue;
  const forced = (it.arForcedAffixes || []).map(a => a.name);
  // a runeword's power, when it has one, is the forced affix named after it, wherever it sits in the list
  const rwPower = /^Runeword/.test(id) ? forced.find(x => /^Runeword_/i.test(x) && strings('Affix_' + x).Desc) : null;
  const mainName = rwPower || (forced.includes(id) ? id : (forced[0] || id));
  if (!s.Desc && (rwPower || !/^Runeword/.test(id))) { const as = strings('Affix_' + mainName); s.Desc = as.Desc || ''; }
  if (!s.Desc && !/^Runeword/.test(id)) continue;   // runewords have no power text, only their fixed affixes
  const main = loadAffix(mainName) || loadAffix(id);
  const kind = /^Runeword/.test(id) ? 'runeword' : /Charm|Talisman/i.test(id) ? 'charm' : /Seal/i.test(id) ? 'seal' : 'unique';
  const affixLines = [];
  for (const fa of forced.filter(x => x !== mainName || !s.Desc)) {
    const fs2 = strings('Affix_' + fa); const A = loadAffix(fa);
    if (fs2.Desc) affixLines.push(renderAffix(fs2.Desc, A));
    else if (A) for (const l of attrLines(A)) affixLines.push(l);
  }
  for (let k = 0; k < affixLines.length; k++) affixLines[k] = affixLines[k].replace(/^\+?\s*(<span[^>]*>)?\s*<b class="num">0(\.0)?%?(\[[x+]\])?<\/b>\s*(<\/span>)?\s*/, '');
  if (UNSHIPPED.test(s.Name || '') || /_Boost_NoPowers/i.test(id)) continue;
  uniques.push({
    id, name: s.Name, kind, type: it.snoItemType ? it.snoItemType.name : '', classes: classMask(it.fUsableByClass),
    mythic: /Mythic|SF\.IsMythic/.test(s.Desc) && /Unique_Generic_1\d\d|Mythic/i.test(id) ? 1 : 0,
    runes: kind === 'runeword' && s.Description ? s.Description.replace(/\{[^}]*\}/g, '').replace(/([a-z])([A-Z])/g, '$1 $2') : '',
    desc: s.Desc ? T.render(s.Desc, Object.assign(affixCtx(main), { cond: c => c === 'ADVANCED_TOOLTIP' })) : '', affixes: affixLines, flavor: s.Flavor || '',
  });
}

// ---------- talisman sets ----------
const sets = [];
for (const f of fs.readdirSync(path.join(META, 'SetItemBonus'))) {
  const st = readJ(path.join(META, 'SetItemBonus', f)); if (!st || !st.ptTiers) continue;
  const id = f.replace('.set.json', ''); const s = strings('SetItemBonus_' + id);
  const tiers = st.ptTiers.map(t => { const an = t.snoAffix && t.snoAffix.name; const A = an && loadAffix(an); const ts = an ? strings('Affix_' + an) : {}; return { n: t.nRequired, desc: ts.Desc ? renderAffix(ts.Desc, A) : '' }; });
  if (!tiers.some(t => t.desc)) continue;
  const cls = (id.match(/Talisman_([A-Za-z]+)_/) || [])[1] || '';
  const clsName = { Barb: 'Barbarian', Druid: 'Druid', Necro: 'Necromancer', Rogue: 'Rogue', Sorc: 'Sorcerer', Spirit: 'Spiritborn', Spiritborn: 'Spiritborn', Paladin: 'Paladin', Pal: 'Paladin', Pala: 'Paladin', Small: 'All', Warlock: 'Warlock' }[cls] || 'All';
  sets.push({ id, name: s.Name || s.name || id.replace(/_/g, ' '), cls: clsName, tiers });
}

// ---------- write ----------
fs.mkdirSync(OUT, { recursive: true });
const meta = { label: LABEL, build: (fs.existsSync(path.join(ROOT, '..', 'buildVersion.txt')) ? fs.readFileSync(path.join(ROOT, '..', 'buildVersion.txt'), 'utf8').trim() : ''), generated: new Date().toISOString().slice(0, 10) };
const w = (file, obj) => fs.writeFileSync(path.join(OUT, file), `window.D4DATA=window.D4DATA||{};window.D4DATA[${JSON.stringify(LABEL)}]=window.D4DATA[${JSON.stringify(LABEL)}]||{};Object.assign(window.D4DATA[${JSON.stringify(LABEL)}],${JSON.stringify(obj)});\n`);
w(`core-${LABEL}.js`, { meta, tables: TABLES.map(t => t.v), tableNames: TABLES.map(t => t.name), classes, mercs, warplans, shards, mechanics, scaling });
w(`items-${LABEL}.js`, { aspects, uniques, sets });
const PG = require('./paragon.js')(ROOT, { readJ, strings, F, T, hash, CLASSES, tableFn });
const GEAR = require('./gear.js')(ROOT, { readJ, strings, F, T, hash, CLASSES, tableFn, renderAffix, sets }, PG._h); delete PG._h;
w(`paragon-${LABEL}.js`, { paragon: PG });
w(`gear-${LABEL}.js`, { gear: GEAR });
const CUBE = require('./cube.js')(ROOT, { readJ, strings });
w(`cube-${LABEL}.js`, { cube: CUBE });
console.log('cube recipes', CUBE.count, 'runewords', CUBE.runewords.length, 'rune upgrades', CUBE.runes.length, 'splinters', CUBE.splinters.length, CUBE.groups.map(g => g.name + ':' + g.rows.length).join(' | '));
console.log('gear affixes', GEAR.affixes.length, 'tempers', GEAR.tempers.length, 'sanctify', GEAR.sanctify.length, 'seals', GEAR.seals.length, 'sealAffixes', GEAR.sealAffixes.length, 'charmAffixes', GEAR.charmAffixes.length, 'setPieces', Object.keys(GEAR.setPieces).length);
console.log('paragon', Object.keys(PG.boards).map(c => c + ':' + PG.boards[c].length).join(' '), 'nodes', Object.keys(PG.nodes).length, 'glyphs', Object.keys(PG.glyphs).length, 'texts', PG.texts.length);
console.log(LABEL, meta.build, 'classes', Object.keys(classes).map(c => c + ':' + classes[c].nodes.length + '/' + Object.keys(classes[c].powers).length).join(' '), 'mercs', mercs.map(m => m.name + ':' + m.nodes.length).join(','), 'warplans', warplans.length, 'shards', shards.length, 'mechanics', Object.keys(mechanics).join('/'), 'scaling', !!scaling, 'aspects', aspects.length, 'uniques', uniques.length, 'sets', sets.length);
