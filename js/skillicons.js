/* Which painted skill icon (img/skills/N.png, Wenrexa Skill Icon Pack) each skill uses. One per skill within a class. */
window.SKILL_ICONS = {
  Barbarian: { 'Whirlwind': 48, 'Call of the Ancients': 37, 'Iron Maelstrom': 56, 'Wrath of the Berserker': 40, 'Charge': 63, 'Leap': 34, 'War Cry': 42, 'Ground Stomp': 49, 'Death Blow': 61, 'Rupture': 14, 'Rend': 12, 'Steel Grasp': 32, 'Kick': 26, 'Flay': 13, 'Challenging Shout': 41, 'Frenzy': 15, 'Rallying Cry': 43, 'Iron Skin': 39, 'Upheaval': 70, 'Lunging Strike': 11, 'Hammer of the Ancients': 38, 'Bash': 2, 'Double Swing': 62 },
  Druid: { 'Debilitating Roar': 42, 'Poison Creeper': 31, 'Wind Shear': 59, 'Lightning Storm': 7, 'Lacerate': 50, 'Grizzly Rage': 40, 'Cataclysm': 65, 'Petrify': 49, 'Rabies': 8, 'Trample': 26, 'Wolves': 18, 'Cyclone Armor': 21, 'Ravens': 51, 'Shred': 5, 'Hurricane': 56, 'Boulder': 68, 'Maul': 34, 'Storm Strike': 33, 'Earthen Bulwark': 41, 'Blood Howl': 60, 'Landslide': 70, 'Claw': 29, 'Pulverize': 2, 'Earth Spike': 22, 'Tornado': 48, 'Stone Burst': 57 },
  Necromancer: { 'Bone Spear': 22, 'Bone Splinters': 24, 'Reap': 63, 'Blood Mist': 8, 'Blight': 36, 'Decompose': 32, 'Sever': 6, 'Corpse Explosion': 68, 'Bone Spirit': 43, 'Blood Surge': 57, 'Hemorrhage': 10, 'Iron Maiden': 40, 'Corpse Tendrils': 31, 'Army of the Dead': 37, 'Bone Storm': 56, 'Blood Wave': 65, 'Blood Lance': 23, 'Decrepify': 67, 'Bone Prison': 44, 'Skeleton Mage': 3, 'Skeleton Warrior': 15, 'Golem': 70 },
  Rogue: { 'Flurry': 16, 'Heartseeker': 52, 'Blade Shift': 5, 'Smoke Grenade': 8, 'Barrage': 24, 'Caltrops': 49, 'Invigorating Strike': 11, 'Shadow Step': 6, 'Cold Imbuement': 58, 'Penetrating Shot': 30, 'Poison Imbuement': 20, 'Puncture': 22, 'Dark Shroud': 21, 'Poison Trap': 35, 'Twisting Blades': 14, 'Dash': 63, 'Shadow Imbuement': 67, 'Forceful Arrow': 33, 'Rain of Arrows': 17, 'Shadow Clone': 15, 'Death Trap': 45, 'Rapid Fire': 53, 'Concealment': 54, 'Dance of Knives': 13 },
  Sorcerer: { 'Flame Shield': 41, 'Frost Nova': 55, 'Ice Armor': 39, 'Charged Bolts': 27, 'Hydra': 28, 'Ice Blades': 12, 'Meteor': 69, 'Blizzard': 53, 'Frozen Orb': 58, 'Lightning Spear': 22, 'Teleport': 57, 'Ball Lightning': 67, 'Inferno': 43, 'Unstable Currents': 65, 'Deep Freeze': 49, 'Incinerate': 66, 'Spark': 7, 'Fire Bolt': 25, 'Arc Lash': 31, 'Fireball': 1, 'Chain Lightning': 30, 'Ice Shards': 24, 'Frost Bolt': 52, 'Firewall': 44 },
  Spiritborn: { 'Withering Fist': 34, 'Vortex': 21, 'Crushing Hand': 29, 'Scourge': 8, 'Payback': 41, 'Thrash': 18, 'Rock Splitter': 70, 'Thunderspike': 33, 'Rake': 13, 'Quill Volley': 24, 'Toxic Skin': 36, 'Rushing Claw': 63, 'Armored Hide': 39, 'Soar': 51, 'Ravager': 42, 'Concussive Stomp': 26, 'Counterattack': 14, 'Touch of Death': 6, 'The Devourer': 40, 'The Seeker': 52, 'The Hunter': 43, 'The Protector': 38, 'Razor Wings': 5, 'Stinger': 30 },
  Paladin: { 'Falling Star': 25, 'Defiance Aura': 46, 'Blessed Hammer': 9, 'Shield Charge': 41, 'Zeal': 16, 'Holy Light Aura': 47, 'Clash': 14, 'Blessed Shield': 45, 'Rally': 42, 'Fanaticism Aura': 50, 'Shield Bash': 39, 'Holy Bolt': 53, 'Divine Lance': 23, 'Aegis': 58, 'Brandish': 12, 'Advance': 63, 'Consecration': 55, "Heaven's Fury": 44, 'Zenith': 4, 'Fortress': 38, 'Arbiter of Justice': 17, 'Condemn': 66, 'Spear of the Heavens': 22, 'Purify': 10 },
  Warlock: { 'Nether Step': 57, 'Infernal Breath': 43, 'Blazing Scream': 42, 'Sigil of Chaos': 35, 'Dark Prison': 32, 'Bombardment': 69, 'Profane Sentinel': 6, 'Rampage': 40, 'Sigil of Summons': 45, 'Umbral Chains': 31, 'Sigil of Subversion': 36, 'Wall of Agony': 44, 'Tortured Wretch': 68, 'Dread Claws': 29, "Tyrant's Grasp": 34, 'Hell Fracture': 49, 'Fiend of Abaddon': 37, 'Terror Swarm': 8, 'Apocalypse': 1, 'Metamorphosis': 47, 'Molten Bomb': 27, 'Command Fallen': 38, 'Doom': 56, 'Hellion Sting': 30 },
};
// Any skill not listed gets an unused icon for its class, so no two skills in a class share one.
window.skillIconFor = function (cls, name, used) {
  const m = window.SKILL_ICONS[cls] || {};
  const key = Object.keys(m).find(k => k.toLowerCase() === String(name).toLowerCase());
  if (key) return m[key];
  const taken = new Set(Object.values(m).concat(used || []));
  let h = 0; for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 70; i++) { const n = ((h + i) % 70) + 1; if (!taken.has(n)) return n; }
  return (h % 70) + 1;
};

// What each painted icon shows, for matching the three-way choice upgrades to their effect.
window.ICON_TAGS = {
  1: 'meteor fall comet fire burn', 2: 'explode explosion burst splash detonate', 3: 'rune circle magic arcane', 4: 'holy cross light divine', 5: 'slash cut wind feather', 6: 'eye mark curse vision vulnerable', 7: 'lightning bolt shock charged', 8: 'smoke cloud poison fog gas mist', 9: 'spin spiral whirl rotate',
  10: 'heal life blood heart lifesteal', 11: 'thrust stab pierce penetrate', 12: 'sword blade weapon', 13: 'enchant empower rune blade', 14: 'counter duel parry crossed', 15: 'double twin second', 16: 'multiple three additional strikes', 17: 'rain falling barrage', 18: 'rend tear claw bleed wing', 19: 'flame weapon ignite burning',
  20: 'resource drop essence fury faith spirit mana cost', 21: 'pull vortex draw whirlpool', 22: 'spear lance', 23: 'dash charge rush wind', 24: 'projectile volley split fan', 25: 'fireball projectile missile', 26: 'nova radial pulse wave', 27: 'orb sphere ball', 28: 'orbit circling swirling', 29: 'grasp hand claw grab',
  30: 'ricochet bounce chain jump', 31: 'root tendril vine creeper', 32: 'chain bind immobilize entangle snare', 33: 'fork split trident', 34: 'fist punch uppercut knock', 35: 'trap sigil triangle rune', 36: 'curse hex swirl decay', 37: 'rage berserk horned ancients', 38: 'helm fortify fortress guard', 39: 'armor barrier defense protect resistance',
  40: 'fear terror demon dread', 41: 'shield block aegis', 42: 'shout cry roar rise', 43: 'spirit summon phoenix minion', 44: 'pillar beam column heaven', 45: 'ground area consecrate zone', 46: 'aura bloom radiant', 47: 'sun radiance blaze', 48: 'whirlwind tornado cyclone', 49: 'shatter shard break fragment crack',
  50: 'pulse spiral ripple', 51: 'bird raven eagle fly soar', 52: 'arrow shot range', 53: 'stun crit critical starburst daze', 54: 'speed haste movement swift', 55: 'blind nova flash holy', 56: 'storm vortex hurricane', 57: 'collapse implode gather', 58: 'frost freeze ice chill crystal cold', 59: 'leaf nature cut wind',
  60: 'life heart heal regen', 61: 'axe cleave', 62: 'heavy axe overpower', 63: 'leap dash lance travel', 64: 'wave swirl surge', 65: 'storm spiral tempest', 66: 'beam ray burst damage', 67: 'orb eye ring', 68: 'skull corpse boulder bone', 69: 'shower meteor rain', 70: 'stone earth rock golem',
};
// Assign icons to every three-way choice upgrade of a class: different within each choice set, never the
// skill's own icon, spread across the class as much as 70 icons allow, and matched to the upgrade's text.
window.modIconsFor = function (cls, groups) {
  // groups: [{ skill, mods: [{ id, text }] }]
  const out = {}; const useCount = {};
  const words = s => String(s || '').toLowerCase().replace(/<[^>]+>/g, ' ');
  const score = (n, text) => { const t = words(text); return window.ICON_TAGS[n].split(' ').reduce((a, w) => a + (t.includes(w) ? (w.length > 4 ? 3 : 2) : 0), 0); };
  for (const g of groups) {
    const own = window.skillIconFor(cls, g.skill); const taken = new Set([own]);
    for (const m of g.mods) {
      let best = 0, bestS = -1e9;
      for (let n = 1; n <= 70; n++) {
        if (taken.has(n)) continue;
        const s = Math.min(score(n, m.text), 8) * 3 - (useCount[n] || 0) * 14 - (n === own ? 99 : 0);
        if (s > bestS) { bestS = s; best = n; }
      }
      taken.add(best); useCount[best] = (useCount[best] || 0) + 1; out[m.id] = best;
    }
  }
  return out;
};
