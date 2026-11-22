# Barbarian synergy map

Reference for putting Barbarian builds together so their parts work in concert. Each mechanic lists what **makes it happen** and what **pays it off**. Pick an engine you can keep running, make the main skill feed it, then stack payoffs, preferring [x] over [+]. Read [README.md](README.md) first for the method and the rules that apply to every class.

Made from the planner's Season 15 game data on 22 Nov 2026. `X` is a number that scales with rank or roll. The machine-readable copy is `data/synergy-tags.json`.

## Barbarian engines

- **Shouts and Berserking.** War Cry, Rallying Cry, Challenging Shout and Wrath of the Berserker are on almost every meta bar. They give Berserking, Unstoppable, Fortify and movement speed. Pick payoffs that say "while Berserking" or that care about Shouts.
- **Fury spending.** Ramaladni's Magnum Opus and the Fury-cost upgrades reward spending Fury. Rallying Cry's Booming upgrade and Fury generation keep it full.
- **Brawling loop (Chainscourged Mail).** Each damaging Brawling skill turns off after you cast it. When all of them on the bar are off, they come back with refreshed cooldowns, and Brawling skills get [x] damage for each one that is off. Charge builds use this.
- **Bleed and damage over time.** Charge's Battering Ram, Rend, Iron Skin's Retaliation and Rage of Harrogath all add damage over time. That turns on the damage-over-time payoffs: Aspect of Disobedience (Damage Reduction on every tick, the same trick Phil found for Paladin), Overheating and Cut to the Bone. Disobedience appears in both meta Charge builds.
- **Two-handed and Arsenal.** Aspect of Heavenly Strength gives Damage Reduction while wielding a two-handed weapon. Arsenal swaps feed the "after swapping" payoffs.
- **Earthquakes and Dust Devils.** Leapquake and the Whirlwind Dust Devil builds spawn damage objects. Look for payoffs that name them.



## How the meta builds link up

Each current meta build from the planner's library, with the mechanics its own parts both make and pay off. These are proven pairings.


### Whirlwind (S tier, Cliptis)

- **Bar:** Whirlwind, Iron Skin, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Enigma, Gohr's Devastating Grips, Aspect of Anger Management, Spirit (1h Sword), Ramaladni's Magnum Opus, Stone of Jordan, Aspect of Channeling, Melted Heart of Selig, Tuskhelm of Joritz the Mighty, Tibault's Will
- **Charms:** Seal; Endurant Faith, Hellfire Torch, Mlor of the Crucible, Linta of the Crucible, Fer of the Crucible, Berú of the Crucible
- **Damage over time:** made by Iron Skin, Challenging Shout > Raging; paid off by Challenging Shout > Raging
- **Resource spending:** made by Rallying Cry > Booming; paid off by Ramaladni's Magnum Opus, Whirlwind > Cost Damage Bonus

### Ancients, The Bro'Barian Summon Build (S tier, Cliptis)

- **Bar:** Leap, Iron Skin, Call of the Ancients, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Battle Fervor's Aspect, Aspect of Anger Management, Bold Chieftain's Aspect, Aspect of Apogeic Furor, Aspect of Coagulation, Edgemaster's Aspect, Aspect of the Fortress, Progenitor's Aspect, Aspect of Walloping, Vehement Brawler's Aspect
- **Charms:** Seal; Arreat's Bearing, Berú of Bul-Kathos' Pride, Fer of Bul-Kathos' Pride, Linta of Bul-Kathos' Pride, Mlor of Bul-Kathos' Pride, Phoba of Bul-Kathos' Pride
- **Crowd control:** made by Leap, Challenging Shout, Challenging Shout > Damage Bonus, Iron Skin > Juggernaut, War Cry > Slow; paid off by Aspect of Walloping
- **Damage over time:** made by Iron Skin, Call of the Ancients > Empowered; paid off by Call of the Ancients > Empowered
- **Fortify, Barrier, Healthy:** made by Aspect of Coagulation, Iron Skin; paid off by Aspect of Coagulation
- **Ultimates:** made by Aspect of Apogeic Furor, Arreat's Bearing; paid off by Aspect of Apogeic Furor

### Charge Battering Ram (S tier, Cornaro)

- **Bar:** Rallying Cry, War Cry, Challenging Shout, Wrath of the Berserker, Iron Skin, Charge
- **Gear:** Overheating Aspect, Aspect of Disobedience, Edgemaster's Aspect, Chainscourged Mail, Battle Fervor's Aspect, Aspect of Heavenly Strength, Conceited Aspect, Bold Chieftain's Aspect, Cut to the Bone Aspect, Vanquishing Aspect
- **Crowd control:** made by Wrath of the Berserker, Charge, Challenging Shout, Charge > Battering Ram; paid off by Vanquishing
- **Damage over time:** made by Iron Skin, Charge > Battering Ram, Iron Skin > Retaliation; paid off by Overheating, Aspect of Disobedience, Cut to the Bone
- **Fortify, Barrier, Healthy:** made by Iron Skin, Iron Skin > Retaliation; paid off by Conceited

### Flame Charge (A tier, Cliptis)

- **Bar:** Ground Stomp, Charge, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Tuskhelm of Joritz the Mighty, Rage of Harrogath, Edgemaster's Aspect, Chainscourged Mail, Aspect of Accursed Touch, Wanton Rupture Aspect, Ramaladni's Magnum Opus, Vehement Brawler's Aspect, Cut to the Bone Aspect, Aspect of Disobedience
- **Charms:** Seal of the Diamond Mind; Berú of the Crucible, Fer of the Crucible, Berú of Sescheron's Fury, Fer of Sescheron's Fury, Linta of Sescheron's Fury, Mlor of Sescheron's Fury
- **Movement:** made by Rallying Cry, Rallying Cry > Booming, Wrath of the Berserker; paid off by Charge > Distance Damage Bonus
- **Lucky Hit:** made by Charge, Ground Stomp; paid off by Aspect of Accursed Touch
- **Damage over time:** made by Charge > Battering Ram; paid off by Cut to the Bone, Aspect of Disobedience, Ground Stomp > Breach
- **Resource spending:** made by Rallying Cry > Booming, Charge, Ground Stomp; paid off by Ramaladni's Magnum Opus

### Hammer of the Ancients (A tier, Cliptis)

- **Bar:** Hammer of the Ancients, Leap, Call of the Ancients, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Undying Aspect, Wildbolt Aspect, Aspect of Heavenly Strength, Earthstriker's Aspect, Aspect of Walloping, Edgemaster's Aspect, Vehement Brawler's Aspect, Aspect of Apogeic Furor, Bold Chieftain's Aspect, Aspect of the Warpath
- **Charms:** Seal; Tuskhelm of Joritz the Mighty, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Crowd control:** made by Challenging Shout, Challenging Shout > Damage Bonus, Leap; paid off by Aspect of Walloping

### Double Swing (A tier, Cliptis)

- **Bar:** Leap, Double Swing, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Wildbolt Aspect, Aspect of the Warpath, Vehement Brawler's Aspect, Aspect of Berserk Ripping, Aspect of Heavenly Strength, Vehement Brawler's Aspect, Aspect of Inner Calm, Earthstriker's Aspect, Aspect of Limitless Rage, Aspect of Coagulation
- **Charms:** Seal; Ring of Red Furor, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Movement:** made by Rallying Cry, Rallying Cry > Booming, Wrath of the Berserker; paid off by Aspect of Inner Calm
- **Resource spending:** made by Rallying Cry > Booming, Leap, Leap > Fury Generation; paid off by Ring of Red Furor
- **Berserking:** made by War Cry > Mighty Roar, Wrath of the Berserker; paid off by Aspect of Berserk Ripping

### Rend (A tier, Cliptis)

- **Bar:** Rend, Iron Skin, Call of the Ancients, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Writhing Aspect, Wildbolt Aspect, Aspect of Heavenly Strength, Vehement Brawler's Aspect, Aspect of Glynn's Anvil, Aspect of Dominance, Cut to the Bone Aspect, Wanton Rupture Aspect, Bold Chieftain's Aspect, Crushing Aspect
- **Charms:** Seal; The Open Eye of Gorgorra, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Crowd control:** made by Iron Skin > Juggernaut, Challenging Shout, Challenging Shout > Damage Bonus; paid off by Aspect of Dominance
- **Vulnerable:** made by War Cry > Vulnerable; paid off by Cut to the Bone, Rend > Vulnerable Damage Bonus
- **Damage over time:** made by Rend, Rend > Scorching, Iron Skin; paid off by Cut to the Bone
- **Fortify, Barrier, Healthy:** made by Iron Skin; paid off by Crushing

### Frenzy (A tier, Cliptis)

- **Bar:** Frenzy, Leap, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Steadfast Berserker's Aspect, Earthstriker's Aspect, Aspect of the Moonrise, Vehement Brawler's Aspect, Vehement Brawler's Aspect, Battle Fervor's Aspect, Aspect of the Warpath, Aspect of Limitless Rage, Edgemaster's Aspect, Wildbolt Aspect
- **Charms:** Seal; Battle Trance, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible

### Lunging Strike (A tier, Cliptis)

- **Bar:** Lunging Strike, Leap, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Wildbolt Aspect, Aspect of Heavenly Strength, Edgemaster's Aspect, Battle-Mad Aspect, Earthstriker's Aspect, Heavy Hitting Aspect, Vehement Brawler's Aspect, Aspect of Limitless Rage, Aspect of the Moonrise, Bold Chieftain's Aspect
- **Charms:** Seal; Banished Lord's Talisman, Berú of Sescheron's Fury, Fer of Sescheron's Fury, Linta of Sescheron's Fury, Mlor of Sescheron's Fury, Phoba of Sescheron's Fury
- **Weapon swapping:** made by Battle-Mad, Leap > Arsenal Bonus; paid off by Battle-Mad

### Mightiest Throw (A tier, Cliptis)

- **Bar:** Iron Skin, Mighty Throw, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Tuskhelm of Joritz the Mighty, Rage of Harrogath, Fists of Fate, Tibault's Will, Aspect of Anger Management, The Third Blade, Ramaladni's Magnum Opus, Ring of Red Furor, Aspect of the Warpath, Melted Heart of Selig
- **Charms:** Seal; Endurant Faith, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Resource spending:** made by Rallying Cry > Booming; paid off by The Third Blade, Ramaladni's Magnum Opus, Ring of Red Furor

### Upheaval (A tier, Cliptis)

- **Bar:** Upheaval, Leap, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Undying Aspect, Wildbolt Aspect, Aspect of Heavenly Strength, Earthstriker's Aspect, Heavy Hitting Aspect, Accelerating Aspect, Vehement Brawler's Aspect, Bold Chieftain's Aspect, Aspect of Inner Calm, Aspect of the Warpath
- **Charms:** Seal; Nomad's Longing Heart, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Movement:** made by Rallying Cry, Rallying Cry > Booming, Wrath of the Berserker; paid off by Aspect of Inner Calm
- **Resource spending:** made by Rallying Cry > Booming, Leap, Leap > Fury Generation; paid off by Nomad's Longing Heart

### Bash (B tier, Cliptis)

- **Bar:** Bash, Iron Skin, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Wildbolt Aspect, Aspect of Heavenly Strength, Edgemaster's Aspect, Earthstriker's Aspect, Aspect of Accursed Touch, Aspect of the Warpath, Vehement Brawler's Aspect, Aspect of Vocalized Empowerment, Aspect of Walloping, Bold Chieftain's Aspect
- **Charms:** Seal; Berú of Sescheron's Fury, Fer of Sescheron's Fury, Linta of Sescheron's Fury, Mlor of Sescheron's Fury, Phoba of Sescheron's Fury, Paingorger's Gauntlets
- **Crowd control:** made by Bash, Challenging Shout, Challenging Shout > Damage Bonus, Wrath of the Berserker, Leap; paid off by Aspect of Walloping
- **Lucky Hit:** made by Bash, Leap; paid off by Aspect of Accursed Touch

### Kick, Shin2Win (B tier, Cliptis)

- **Bar:** Kick, Rupture, Call of the Ancients, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Tuskhelm of Joritz the Mighty, Rage of Harrogath, Aspect of Encroaching Wrath, Chainscourged Mail, Aspect of Anger Management, Ramaladni's Magnum Opus, Aspect of Walloping, Edgemaster's Aspect, Vehement Brawler's Aspect, Melted Heart of Selig
- **Charms:** Seal; Endurant Faith, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Crowd control:** made by Challenging Shout, Challenging Shout > Damage Bonus, Kick, Kick > Madness; paid off by Aspect of Walloping, Kick
- **Resource spending:** made by Rallying Cry > Booming, Steel Grasp; paid off by Aspect of Encroaching Wrath, Ramaladni's Magnum Opus

### Flay (B tier, Cliptis)

- **Bar:** Flay, Rupture, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Aspect of Might, Earthstriker's Aspect, Wanton Rupture Aspect, Cut to the Bone Aspect, Edgemaster's Aspect, Undying Aspect, Aspect of the Moonrise, Vehement Brawler's Aspect, Aspect of Berserk Ripping, Wildbolt Aspect
- **Charms:** Seal; Sabre of Tsasgal, Berú of the Bloodletter, Fer of the Bloodletter, Linta of the Bloodletter, Mlor of the Bloodletter, Phoba of the Bloodletter
- **Damage over time:** made by Aspect of Berserk Ripping, Flay, Rupture; paid off by Cut to the Bone
- **Berserking:** made by Wrath of the Berserker; paid off by Aspect of Berserk Ripping

### Deathblow (B tier, Cliptis)

- **Bar:** Death Blow, Whirlwind, Wrath of the Berserker, War Cry, Challenging Shout, Rallying Cry
- **Gear:** Tuskhelm of Joritz the Mighty, Rage of Harrogath, Tibault's Will, Aspect of Anger Management, The Third Blade, Ramaladni's Magnum Opus, Aspect of the Warpath, Bold Chieftain's Aspect, Ring of Red Furor, Aspect of Walloping
- **Charms:** Seal; Ring of Red Furor, Berú of the Crucible, Fer of the Crucible, Linta of the Crucible, Mlor of the Crucible, Phoba of the Crucible
- **Crowd control:** made by Challenging Shout, Challenging Shout > Damage Bonus, Wrath of the Berserker; paid off by Aspect of Walloping
- **Resource spending:** made by Rallying Cry > Booming; paid off by The Third Blade, Ramaladni's Magnum Opus, Ring of Red Furor

---

# Full lists by mechanic


## Block

A block, or a hit that counts as one.


### Makes it happen (0)

- none found

### Pays it off (0)

- none found

## Crowd control

Stun, Freeze, Knock Down, Fear, Immobilize, Slow, Chill, Daze, Taunt, Petrify.


### Makes it happen (51)

- **Bash** *Skill*: Fury Cost: Generate Fury: Lucky Hit Chance: [|%|] Bash the enemy with your weapon, dealing damage. Every Xrd[Xth Bash will clobber, Stunning enemies for seconds.
- **Challenging Shout** *Skill*: Cooldown: seconds Taunt Nearby enemies and gain X Damage Reduction for X seconds.
- **Charge** *Skill*: Generate Fury: X per enemy hit Cooldown: seconds Lucky Hit Chance: [|%|] Rush forward and push enemies before swinging your weapon, dealing damage and Knocking Back enemies.
- **Ground Stomp** *Skill*: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Smash the ground, dealing damage and Stunning surrounding enemies for seconds.
- **Iron Maelstrom** *Skill*: Cooldown: seconds Lucky Hit Chance: [[|%|] Activate three times to attach chains to each of your weapons and perform an attack: First, your Two-Handed Bludgeoning weapon slams into the ground, deal...
- **Kick** *Skill*: Charges: X Charge Cooldown: seconds Fury Cost: Lucky Hit Chance: [|%|] Throw a powerful kick that deals damage and Knocks Back enemies in front of you. Enemies who are Knocked Back into terrain tak...
- **Leap** *Skill*: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Leap forward and then slam down, dealing damage and Slowing enemies by X for seconds.
- **Wrath of the Berserker** *Skill*: Cooldown: seconds Explode into rage, Knocking Back surrounding enemies while gaining X increased damage, Berserking, and Unstoppable for X seconds.
- **Bash > Battle Bash** *Skill upgrade*: Increases Bash's stun duration to X seconds, or to X seconds if using a two-handed weapon.
- **Call of the Ancients > The Chosen** *Skill upgrade*: Depending on your last used weapon, you summon X very strong AncientsAncient for twice as long. Your Ancient gains an additional power: Korlic: You gain 10 Fury each time Korlic damages an enemy wi...
- **Challenging Shout > Damage Bonus** *Skill upgrade*: The first X enemies Taunted by Challenging Shout take X increased damage from you.
- **Charge > Battering Ram** *Skill upgrade*: Charge now deals Fire damage. Instead of swinging your weapon, colliding with enemies deals Fire damage and Stuns them for seconds. Additionally, you leave a burning trail that inflicts Burning dam...
- **Double Swing > Slice and Dice** *Skill upgrade*: Sweep Size increased by X but Cast Speed is slowed by X. Enemies caught at the outer edge of your sweeps and are hit an additional time for damage. These additional hits grant this Skill X increase...
- **Flay > Slow** *Skill upgrade*: Flay Slows enemies by X.
- **Ground Stomp > Breach** *Skill upgrade*: Ground Stomp becomes a Brawling Skill that deals Fire damage. Ground Stomp no longer Stuns and smashes the surrounding ground. Instead, it fissures the ground in front of you, dealing damage. Burni...
- **Ground Stomp > Seismic** *Skill upgrade*: Ground Stomp no longer Stuns and instead creates an Earthquake that deals damage and Slows enemies by X.
- **Hammer of the Ancients > Fissure** *Skill upgrade*: Hammer of the Ancients forms a seismic line that deals and Slows enemies hit by X for X seconds.
- **Iron Skin > Juggernaut** *Skill upgrade*: Iron Skin also grants Unstoppable and enemies that hit you are Knocked back.
- **Kick > Madness** *Skill upgrade*: You dash towards your enemy and deliver a powerful kick that deals and Knocks Down enemies for seconds. Kick is additionally a Mobility Skill.
- **Kick > Power** *Skill upgrade*: Instead of Knocking Back enemies, Kick becomes a Core Skill which costs X Fury and deals damage, increased by X per Maximum Fury you have, up to X Fury.
- **Leap > Damage Bonus and Crowd Control** *Skill upgrade*: Leap deals X increased damage and Knocks Down enemies for second.
- **Rallying Cry > The World** *Skill upgrade*: Rallying Cry Dazes and Slows all enemies and their projectiles by X for X seconds. Rallying Cry also grants Attack Speed instead of Movement Speed and its Fury Cost is replaced with a X second Cool...
- **Upheaval > Enhanced Upheaval** *Skill upgrade*: Upheaval has a X chance to Stun all enemies it damages for X seconds.
- **War Cry > Slow** *Skill upgrade*: War Cry Slows nearby enemies by X for X seconds.
- **War Cry > The Scream** *Skill upgrade*: War Cry terrifies your enemies, causing them to cower in Fear. You gain X increased damage for each enemy Feared, up to X
- **Aspect of Anemia** *Aspect*: Lucky Hit: Damaging enemies affected by Damage over Time or Vulnerable enemies has up to a [20 – 30]% chance to Stun them for 2 seconds.
- **Aspect of Audacity** *Aspect*: Gain [10 – 15]% Damage Reduction against Close enemies. When there are at least 5 Close enemies, Stun them for [5 seconds. Can only occur once every 20 seconds.
- **Aspect of Binding Morass** *Aspect*: Close enemies or those you deal indirect damage to are Slowed by [50 – 70]% for 3 seconds. You deal [40 – 55]% increased damage to Slowed enemies.
- **Aspect of Concussive Strikes** *Aspect*: Your Daze effects last [20 – 40]%[+] longer. Dazing an enemy increases your Movement Speed by [20 – 40]%[+] for 3 seconds.
- **Aspect of Forward Momentum** *Aspect*: Your Knock Back and Pull effects grant you [25 – 35]%[x] Movement Speed for 4 seconds.
- **Aspect of Frosty Strides** *Aspect*: While below [45 – 60]% Life, Evade Freezes Close enemies, deals 6,000 Cold damage to them, and makes them Vulnerable for 3 seconds.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 10% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Stunned or Knocked Down enemies.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 20% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Distant enemies.
- **Aspect of Slaughter** *Aspect*: You gain [30 – 45]%[+] increased Movement Speed. Taking damage from Close enemies Slows you by 30% for 2 seconds.
- **Unrelenting** *Aspect*: Your Knock Downs cause enemies to take [50 – 65]%[x] damage from you for 6 seconds.
- **Weapon Master's** *Aspect*: Weapon Mastery Skills Stun enemies for [1 – 2.5] seconds. Enemies can be Stunned this way once every 5 seconds. Your Weapon Mastery Skills have an additional Charge and deal [10 – 25]%[x] increased...
- **Azurewrath** (Sword) *Unique*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Frostburn** (Gloves) *Unique*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Godslayer Crown** (Boots) *Unique*: When you Stun, Freeze, or Immobilize an Elite, you Pull In all Nearby enemies and deal 60%[x] increased damage to them for 3 seconds. Can only occur once every 12 seconds.Against Bosses, this effec...
- **Mantle of Mountain's Fury** (Boots) *Unique*: Hammer of the Ancients also forms a seismic line that deals its damage and Slows enemies hit by 80% for 4 seconds. Earthquakes it passes through explode for their total damage and are consumed.
- **Penitent Greaves** (Boots) *Unique*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Shroud of False Death** (ChestArmor) *Unique*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Signet of Pelghain** (Ring) *Unique*: Your Freeze effects cause enemies to permanently take [10 – 15]%[x] increased Cold damage from you for each second they are Frozen.
- **Sliver of Hate** (Ring) *Unique*: Chance on being hit to unleash Hatred, Fearing and inflicting 72,000 Corrupting damage over 5 seconds to surrounding enemies.
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **Azurewrath** (Charm) *Unique charm*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Frostburn** (Charm) *Unique charm*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Penitent Greaves** (Charm) *Unique charm*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Shroud of False Death** (Charm) *Unique charm*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Signet of Pelghain** (Charm) *Unique charm*: Your Freeze effects cause enemies to permanently take [10 – 15]%[x] increased Cold damage from you for each second they are Frozen.
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.

### Pays it off (24)

- **Kick** *Skill*: Charges: X Charge Cooldown: seconds Fury Cost: Lucky Hit Chance: [|%|] Throw a powerful kick that deals damage and Knocks Back enemies in front of you. Enemies who are Knocked Back into terrain tak...
- **Aspect of Binding Morass** *Aspect*: Close enemies or those you deal indirect damage to are Slowed by [50 – 70]% for 3 seconds. You deal [40 – 55]% increased damage to Slowed enemies.
- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Dominance** *Aspect*: Crowd Controlling an enemy grants [1 – 16] Resolve.
- **Aspect of Rallying Reversal** *Aspect*: When you Crowd Control an enemy or apply any Stagger to a Boss, gain 1 Ferocity and [10 – 15]% Damage Reduction for 4 seconds.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 10% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Stunned or Knocked Down enemies.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 20% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Distant enemies.
- **Aspect of Shared Misery** *Aspect*: Lucky Hit: When you hit a Crowd Controlled enemy, there is up to a [35 – 55]% chance for that Crowd Control effect to spread to another unaffected enemy.
- **Aspect of Walloping** *Aspect*: Your Skills while wielding a Bludgeoning weapon deal [40 – 60]%[x] increased damage if the enemy is Incapacitated or Vulnerable.
- **Eluding** *Aspect*: Becoming Crowd Controlled grants you Unstoppable and [10 – 25]% Damage Reduction for 4 seconds. This effect has a 6 second Cooldown.
- **Everliving** *Aspect*: Each Crowd Controlled enemy Nearby grants [2 – 3.5]% Damage Reduction, up to 13 enemies.
- **Exploiter's** *Aspect*: You have 50%[+] increased Crowd Control Duration. While enemies are Unstoppable, you deal [30 – 50]%[x] increased damage to them.
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Vanquishing** *Aspect*: You deal [60 – 90]%[x] more damage to Incapacitated enemies.
- **Weapon Master's** *Aspect*: Weapon Mastery Skills Stun enemies for [1 – 2.5] seconds. Enemies can be Stunned this way once every 5 seconds. Your Weapon Mastery Skills have an additional Charge and deal [10 – 25]%[x] increased...
- **Azurewrath** (Sword) *Unique*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Dark Stalker's Medallion** (Amulet) *Unique*: Casting a Skill with a Two-Handed Bludgeoning, Two-Handed Slashing, or Dual-Wielded weapon grants [15 – 20]%[x] increased damage for 15 seconds.While all three bonuses are active, you gain [Affix."...
- **Frostburn** (Gloves) *Unique*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Signet of Pelghain** (Ring) *Unique*: Your Freeze effects cause enemies to permanently take [10 – 15]%[x] increased Cold damage from you for each second they are Frozen.
- **Azurewrath** (Charm) *Unique charm*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Dark Stalker's Medallion** (Charm) *Unique charm*: Casting a Skill with a Two-Handed Bludgeoning, Two-Handed Slashing, or Dual-Wielded weapon grants [15 – 20]%[x] increased damage for 15 seconds.While all three bonuses are active, you gain [Affix."...
- **Frostburn** (Charm) *Unique charm*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Signet of Pelghain** (Charm) *Unique charm*: Your Freeze effects cause enemies to permanently take [10 – 15]%[x] increased Cold damage from you for each second they are Frozen.
- **Rumble** [Strength] *Glyph*: For every 5 Strength purchased within range, your Earthquakes deal X increased damage. / You deal 3%[x] increased damage to Bosses and Crowd Controlled enemies for each active Earthquake, up to 15%...

## Movement

Moving, standing still, Unhindered, Unstoppable.


### Makes it happen (33)

- **Rallying Cry** *Skill*: Cooldown: secondsFury Cost: Bellow a rallying cry, increasing your Movement Speed by X for X seconds. Nearby allies gain half of Rallying Cry's effects.
- **Wrath of the Berserker** *Skill*: Cooldown: seconds Explode into rage, Knocking Back surrounding enemies while gaining X increased damage, Berserking, and Unstoppable for X seconds.
- **Charge > Unstoppable** *Skill upgrade*: You are Unstoppable during Charge.
- **Frenzy > Unhindered** *Skill upgrade*: While at maximum Frenzy stacks, you are Unhindered.
- **Iron Skin > Enhanced Iron Skin** *Skill upgrade*: Iron Skin grants Unhindered for seconds and its Barrier absorbs X more of your Maximum Life.
- **Iron Skin > Juggernaut** *Skill upgrade*: Iron Skin also grants Unstoppable and enemies that hit you are Knocked back.
- **Iron Skin > Movement Speed** *Skill upgrade*: Iron Skin increases your Movement Speed by X.
- **Rallying Cry > Booming** *Skill upgrade*: Rallying Cry increases your Resource Generation by X and your Movement Speed by an additional X.
- **Rallying Cry > Enhanced Rallying Cry** *Skill upgrade*: Rallying Cry grants you Unstoppable while active.
- **Rallying Cry > The World** *Skill upgrade*: Rallying Cry Dazes and Slows all enemies and their projectiles by X for X seconds. Rallying Cry also grants Attack Speed instead of Movement Speed and its Fury Cost is replaced with a X second Cool...
- **Whirlwind > Movement Speed** *Skill upgrade*: Gain X increased Movement Speed during Whirlwind.
- **Whirlwind > Winding** *Skill upgrade*: Attacking with another Skill grants X stacks of charge up to X that decays over time. Your Whirlwind deals X increased damage and gains X Movement Speed per stack. While Whirlwind has charges it la...
- **Aspect of Concussive Strikes** *Aspect*: Your Daze effects last [20 – 40]%[+] longer. Dazing an enemy increases your Movement Speed by [20 – 40]%[+] for 3 seconds.
- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Forward Momentum** *Aspect*: Your Knock Back and Pull effects grant you [25 – 35]%[x] Movement Speed for 4 seconds.
- **Aspect of Nebulous Brews** *Aspect*: Healing Potions grant [20 – 30]%[x] Movement Speed for 8 seconds. Every 80 meters you travel refills a Healing Potion.
- **Aspect of Slaughter** *Aspect*: You gain [30 – 45]%[+] increased Movement Speed. Taking damage from Close enemies Slows you by 30% for 2 seconds.
- **Aspect of Swift Spirit** *Aspect*: Losing Resolve grants [3 – 5]%[x] Movement Speed for 10 seconds, stacking up to 5 times.
- **Aspect of the Iron Warrior** *Aspect*: Iron Skin grants Unstoppable, and [20 – 40]% Damage Reduction.
- **Aspect of the Moonrise** *Aspect*: Damaging an enemy with a Basic Skill grants you 4% Attack Speed for 10 seconds, stacking up to 5 times. Upon reaching maximum stacks, you enter a Vampiric Bloodrage, gaining [40 – 60]%[x] Basic Ski...
- **Aspect of the Unholy Confederate** *Aspect*: You gain [1 – 2.5]%[+] increased Movement Speed per active Summon. Casting a Summon Skill doubles this bonus for 3 seconds.
- **Craven** *Aspect*: Each Nearby Hindered enemy grants you [1 – 2.5]%[+] increased Movement Speed.
- **Eluding** *Aspect*: Becoming Crowd Controlled grants you Unstoppable and [10 – 25]% Damage Reduction for 4 seconds. This effect has a 6 second Cooldown.
- **Exploiter's** *Aspect*: You have 50%[+] increased Crowd Control Duration. While enemies are Unstoppable, you deal [30 – 50]%[x] increased damage to them.
- **Ghostwalker** *Aspect*: While Unstoppable and for 4 seconds after, you gain [10 – 20]%[x] increased Movement Speed and are Unhindered.
- **Shard of Dawn** *Aspect*: After 30 seconds of Night's Grasp, gain Dawn's Haste, increasing your Cast Speed by [20 – 40]% and Movement Speed by 20% for 12 seconds. While empowered by the Midwinter Ward, killing an enemy redu...
- **Wind Striker** *Aspect*: Critical Strikes grant [30 – 50]%[+] Movement Speed for 1 second, up to 6 seconds.
- **Penitent Greaves** (Boots) *Unique*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Thousand-Eye Reaver** (Axe) *Unique*: Moving grants Ferocity, and Maximum Ferocity is increased by [2 – 4]. Ferocity also increases Movement Speed by [6 – 8]%[+] per stack.
- **Tibault's Will** (Legs) *Unique*: You deal [15 – 20]%[x] increased damage and gain 25 Primary Resource Regeneration while Unstoppable and for 5 seconds after.
- **Penitent Greaves** (Charm) *Unique charm*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Thousand-Eye Reaver** (Charm) *Unique charm*: Moving grants Ferocity, and Maximum Ferocity is increased by [2 – 4]. Ferocity also increases Movement Speed by [6 – 8]%[+] per stack.
- **Tibault's Will** (Charm) *Unique charm*: You deal [15 – 20]%[x] increased damage and gain 25 Primary Resource Regeneration while Unstoppable and for 5 seconds after.

### Pays it off (14)

- **Charge > Distance Damage Bonus** *Skill upgrade*: Charge deals up to X increased damage based on distance traveled.
- **Frenzy > Unhindered** *Skill upgrade*: While at maximum Frenzy stacks, you are Unhindered.
- **Iron Skin > Enhanced Iron Skin** *Skill upgrade*: Iron Skin grants Unhindered for seconds and its Barrier absorbs X more of your Maximum Life.
- **Kick > Increase Damage** *Skill upgrade*: Moving increases Kick's damage by up to X.
- **Rallying Cry > Fury Gain** *Skill upgrade*: For every X meter traveled while Rallying Cry is active, restore X primary resource to yourself and half to nearby allies.
- **Rend > Moving Damage Bonus** *Skill upgrade*: Rend deals X increased damage to enemies that are moving.
- **Aspect of Alacrity** *Aspect*: Your Defensive and Mobility Skills gain [50 – 75]% Cooldown Rate while moving.
- **Aspect of Inner Calm** *Aspect*: While standing still, deal up to [50 – 75]%[x] increased damage.
- **Ghostwalker** *Aspect*: While Unstoppable and for 4 seconds after, you gain [10 – 20]%[x] increased Movement Speed and are Unhindered.
- **100,000 Steps** (Boots) *Unique*: Ground Stomp's damage is increased by [20 – 25]%[x] plus an additional amount based on the distance traveled since the last casted Ground Stomp's, up to [80 – 100]%[x].
- **Penitent Greaves** (Boots) *Unique*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Thousand-Eye Reaver** (Axe) *Unique*: Moving grants Ferocity, and Maximum Ferocity is increased by [2 – 4]. Ferocity also increases Movement Speed by [6 – 8]%[+] per stack.
- **Penitent Greaves** (Charm) *Unique charm*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Thousand-Eye Reaver** (Charm) *Unique charm*: Moving grants Ferocity, and Maximum Ferocity is increased by [2 – 4]. Ferocity also increases Movement Speed by [6 – 8]%[+] per stack.

## Cooldowns

Cooldown reduction, resets and things that fire off cooldown skills.


### Makes it happen (26)

- **Death Blow** *Skill*: Fury Cost: Charges: X Charge Cooldown: seconds Cooldown: seconds Lucky Hit Chance: [|%|] Attempt a killing strike, dealing in fire damage to enemies in front of you and Burning them for damage over...
- **Charge > Cooldown Reduction** *Skill upgrade*: Charge's Cooldown is reduced by X second for each enemy it hit, up to X.
- **Death Blow > Consecutive** *Skill upgrade*: Death Blow's cooldown is reduced to X seconds. Hitting enemies with Death Blow increases the damage of subsequent casts by X per hit enemy, up to X. Kills reset this bonus.
- **Iron Maelstrom > Cooldown Reduction** *Skill upgrade*: Weapon swaps reduce the Cooldown of Iron Maelstrom is by X second.
- **Iron Maelstrom > Mastered Weapon** *Skill upgrade*: Depending on your last used weapon, Iron Maelstrom is now also a single Weapon Mastery Skill, and its Cooldown is reduced to X seconds.
- **Kick > Cooldown Reduction** *Skill upgrade*: Kicking an enemy reduces the Cooldowns of your Mobility Skills by X seconds.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill reduces the Cooldowns of your other Skills by [6.5 – 14] seconds.
- **Aspect of Assistance** *Aspect*: Your Reinforcement Cooldown is reduced by [22.5 – 32.5]%[x]. After casting your Ultimate Skill, your Reinforcement Mercenary is called. This cannot occur more than once each 30 seconds.
- **Aspect of Delayed Extinction** *Aspect*: Mighty Throw and Steel Grasp now gain multiplicative damage instead of cooldown from Cooldown Reduction and their damage is increased by another 25%[x]. Additionally, Weapon Mastery skills gain [15...
- **Aspect of Giant Strides** *Aspect*: Reduces the Cooldown of Leap by [1.3 – 5] seconds per enemy hit, up to a maximum of 7 seconds. Hitting a Boss with Leap provides the maximum reduction.
- **Aspect of the Orange Herald** *Aspect*: Cast Core Skill damage reduces the Cooldown of one of your Skills by [0.7 – 2.2] second.
- **Bold Chieftain's** *Aspect*: Your Shout Skill Cooldowns are reduced by [8 – 15.5] seconds.
- **Hectic** *Aspect*: After Casting 5 Basic Skills, one of your active Cooldowns is reduced by [3 – 6] seconds.
- **In-Geom** (Sword) *Unique*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Messerschmidt's Reaver** (Axe2H) *Unique*: Lucky Hit: Attacks have up to a [20 – 30]% chance to explode, dealing 12,000 Fire Damage and reducing your Cooldowns by 1 second.
- **Might of Qual-Kehk** (Gloves) *Unique*: Mighty Throw now gains multiplicative damage instead of cooldown from Cooldown Reduction at [75 – 100]% effectiveness.
- **Rage of Harrogath** (ChestArmor) *Unique*: Inflicting Damage Over Time on an enemy has up to a [45 – 60]% chance to reduce the Cooldowns of your Skills by [Affix."Static Value 0|1|"] seconds.
- **Rage of Harrogath** (Boots) *Unique*: Lucky Hit: Inflicting Bleeding on an enemy has up to a 60% chance to reduce the Cooldowns of your Skills by 1 second.
- **The Third Blade** (Sword) *Unique*: Your Weapon Mastery Skills are now also Core Skills that have 100% Cooldown Reduction but cost Fury, dealing [140 – 160]% of normal damage.
- **Tuskhelm of Joritz the Mighty** (Helm) *Unique*: When you gain Berserking while already Berserk, you become more enraged granting [40 – 50]%[x] increased damage, 0 Fury per second, and 0% Cooldown Reduction.
- **In-Geom** (Charm) *Unique charm*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Rage of Harrogath** (Charm) *Unique charm*: Inflicting Damage Over Time on an enemy has up to a [45 – 60]% chance to reduce the Cooldowns of your Skills by [Affix."Static Value 0|1|"] seconds.
- **The Third Blade** (Charm) *Unique charm*: Your Weapon Mastery Skills are now also Core Skills that have 100% Cooldown Reduction but cost Fury, dealing [140 – 160]% of normal damage.
- **Tuskhelm of Joritz the Mighty** (Charm) *Unique charm*: When you gain Berserking while already Berserk, you become more enraged granting [40 – 50]%[x] increased damage, 0 Fury per second, and 0% Cooldown Reduction.
- **Berserker's Crucible (5-piece)** *Talisman set*: You gain stacking bonuses the longer you stay Berserking:• 5 seconds - 200%[x] Damage and 30% Fury Cost Reduction.• 10 seconds - 10 Fury Per Second and 10% Cooldown Reduction.• 20 seconds - Every 5...
- **Bul-Kathos' Pride (2-piece)** *Talisman set*: • Ancient Skills cost 50% reduced Fury, gain 50% increased Cooldown Reduction, and deal 50%[x] increased damage.

### Pays it off (3)

- **Rakanoth's Wake** (Boots) *Unique*: When you cast a Skill with a Cooldown, you explode, dealing [6,000 – 7,000] Fire damage.
- **Rakanoth's Wake** (Charm) *Unique charm*: When you cast a Skill with a Cooldown, you explode, dealing [6,000 – 7,000] Fire damage.
- **Marshal** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / After casting a Shout Skill, the active Cooldown of every other Non-Shout Skill is reduced by 2 seconds. If Rallying Cry is used, reduce the Fury ...

## Lucky Hit

Lucky Hit procs.


### Makes it happen (19)

- **Bash** *Skill*: Fury Cost: Generate Fury: Lucky Hit Chance: [|%|] Bash the enemy with your weapon, dealing damage. Every Xrd[Xth Bash will clobber, Stunning enemies for seconds.
- **Charge** *Skill*: Generate Fury: X per enemy hit Cooldown: seconds Lucky Hit Chance: [|%|] Rush forward and push enemies before swinging your weapon, dealing damage and Knocking Back enemies.
- **Death Blow** *Skill*: Fury Cost: Charges: X Charge Cooldown: seconds Cooldown: seconds Lucky Hit Chance: [|%|] Attempt a killing strike, dealing in fire damage to enemies in front of you and Burning them for damage over...
- **Double Swing** *Skill*: Fury Cost: Lucky Hit Chance: [|%|] Sweep your weapons from opposite directions, dealing damage with each weapon. Enemies caught in the center are damaged by both.
- **Flay** *Skill*: Fury Cost: Generate Fury: X Lucky Hit Chance: [|%|] Flay the enemy, dealing damage and inflicting Bleeding damage over seconds.
- **Frenzy** *Skill*: Fury Cost: Generate Fury: X Lucky Hit Chance: [|%|] Unleash a rapid flurry of blows, dealing damage with each pair of hits. If Frenzy hits an enemy, its Cast Speed is increased by X for seconds, up...
- **Ground Stomp** *Skill*: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Smash the ground, dealing damage and Stunning surrounding enemies for seconds.
- **Hammer of the Ancients** *Skill*: Fury Cost: Lucky Hit Chance: [|%|] Slam your hammer down with the fury of the Ancients, dealing damage to a concentrated area.
- **Iron Maelstrom** *Skill*: Cooldown: seconds Lucky Hit Chance: [[|%|] Activate three times to attach chains to each of your weapons and perform an attack: First, your Two-Handed Bludgeoning weapon slams into the ground, deal...
- **Kick** *Skill*: Charges: X Charge Cooldown: seconds Fury Cost: Lucky Hit Chance: [|%|] Throw a powerful kick that deals damage and Knocks Back enemies in front of you. Enemies who are Knocked Back into terrain tak...
- **Leap** *Skill*: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Leap forward and then slam down, dealing damage and Slowing enemies by X for seconds.
- **Lunging Strike** *Skill*: Fury Cost: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Lunge forward and strike an enemy, dealing damage.
- **Rend** *Skill*: Fury Cost: Lucky Hit Chance: [|%|] Cleave enemies in front of you, dealing damage and inflicting Bleeding damage over seconds.
- **Rupture** *Skill*: Fury Cost: Cooldown: seconds Charges: X Charge Cooldown: seconds Lucky Hit Chance: [|%|] Skewer enemies in front of you, dealing damage, then rip your weapon out, inflicting Bleeding damage over X ...
- **Steel Grasp** *Skill*: Generate Fury: XFury Cost: Charges: X Charge Cooldown: seconds Lucky Hit Chance: [|%|] Throw out a trio of chains that deal damage and Pull In enemies.
- **Upheaval** *Skill*: Fury Cost: Lucky Hit Chance: [|%|] Tear into the ground with your weapon and fling debris forward, dealing damage.
- **Whirlwind** *Skill*: Fury Cost: per second Lucky Hit Chance: [|%|] Rapidly attack surrounding enemies for damage.
- **Aspect of Fortune** *Aspect*: You gain [15 – 22.5]%[x] Lucky Hit Chance against Elite enemies.
- **Luckbringer** *Aspect*: Gain [10 – 30]%[+] increased Lucky Hit Chance while all damage bonuses from the Walking Arsenal Key Passive are active.

### Pays it off (23)

- **Frenzy > Raging** *Skill upgrade*: Frenzy now deals Fire damage. Lucky Hit: Frenzy has up to a X chance to cause a fiery explosion, dealing Burning damage over seconds.
- **Aspect of Accursed Touch** *Aspect*: Lucky Hit: Up to a [30 – 45]% chance for your Skills to inflict Vampiric Curse on enemies. Enemies afflicted with Vampiric Curse are also Vulnerable.Vampiric Curse's stored souls deal [40 – 70]% in...
- **Aspect of Ancestral Echoes** *Aspect*: Lucky Hit: Leap, Upheaval, and Whirlwind have up to a [45 – 65]% chance to Summon an Ancient to perform the same Skill. Can only occur once every 5 seconds.Your Summons deal [20 – 40]% increased da...
- **Aspect of Anemia** *Aspect*: Lucky Hit: Damaging enemies affected by Damage over Time or Vulnerable enemies has up to a [20 – 30]% chance to Stun them for 2 seconds.
- **Aspect of Efficiency** *Aspect*: Lucky Hit: Cast Basic Skills have up to a [35 – 50]% chance to make your next Core Skill cost no Primary Resource, stacks up to 3 times.
- **Aspect of Exorcism ** *Aspect*: Lucky Hit: Up to a [30 – 45]% chance to Execute enemies.
- **Aspect of Shared Misery** *Aspect*: Lucky Hit: When you hit a Crowd Controlled enemy, there is up to a [35 – 55]% chance for that Crowd Control effect to spread to another unaffected enemy.
- **Lightning Rod** *Aspect*: Lucky Hit: Lightning damage has up to a 25% chance to deal [200 – 300]%[x] increased damage.
- **Relentless Berserker's** *Aspect*: Lucky Hit: Damaging an enemy with a Core Skill has up to a [19.5 – 29.5]% chance to extend the duration of Berserking by 2 seconds. Double this duration if it was a Critical Strike.
- **Slaking** *Aspect*: Lucky Hit: You have up to a [45 – 65]% chance to gain 20 Fury when a Core Skill deals direct damage to at least one Bleeding enemy. Your Maximum Fury is increased by [20 – 25].
- **Andariel's Visage** (Helm) *Unique*: Lucky Hit: Up to a 20% chance to trigger a poison nova that deals 40% of the damage dealt over 5 seconds to enemies in the area.
- **Bell of the Bovine** (Amulet) *Unique*: Lucky Hit: Up to a 30% chance to Moo when hitting an enemy.Lucky Moo: Up to a 50% chance to summon a Cow that explodes for [15,000 – 16,000] Fire damage. This damage is increased by 50% on Tuesdays.
- **Coop de Grâce** (Polearm) *Unique*: Lucky Hit: Damage to Injured enemies has up to a [10 – 15]% chance to spawn a flock of explosive chickens.
- **Doombringer** (Sword) *Unique*: Lucky Hit: Up to a 40% chance to deal 20,000 Shadow damage to surrounding enemies and reduce their damage dealt by 25% for 5 seconds.
- **Frostburn** (Gloves) *Unique*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Messerschmidt's Reaver** (Axe2H) *Unique*: Lucky Hit: Attacks have up to a [20 – 30]% chance to explode, dealing 12,000 Fire Damage and reducing your Cooldowns by 1 second.
- **Rage of Harrogath** (Boots) *Unique*: Lucky Hit: Inflicting Bleeding on an enemy has up to a 60% chance to reduce the Cooldowns of your Skills by 1 second.
- **X'Fal's Corroded Signet** (Boots) *Unique*: Lucky Hit: Your damage over time effects have up to a 75% chance to erupt, dealing 26,000 damage of the same type to surrounding enemies.
- **Phoenix** (Axe) *Runeword*: Lucky Hit: Attacks have up to a [15 – 30]% chance to unleash a level 22 Fire Spear. When you level up, unleash a level 40 Ring of Fire.
- **Rain** (ChestArmor) *Runeword*: Lucky Hit: Attacks have up to a [15 – 30]% chance to unleash a Rank 15 Druid Tornado.50% Chance to unleash a Rank 15 Druid Cyclone Armor whenever you Dodge.
- **Andariel's Visage** (Charm) *Unique charm*: Lucky Hit: Up to a 20% chance to trigger a poison nova that deals 40% of the damage dealt over 5 seconds to enemies in the area.
- **Doombringer** (Charm) *Unique charm*: Lucky Hit: Up to a 40% chance to deal 20,000 Shadow damage to surrounding enemies and reduce their damage dealt by 25% for 5 seconds.
- **Frostburn** (Charm) *Unique charm*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.

## Critical Strikes

Crit chance feeds crit payoffs.


### Makes it happen (19)

- **Hammer of the Ancients > Critical Strike** *Skill upgrade*: Hammer of the Ancients gains X increased Critical Strike Chance for every X Maximum Fury you have, up to X Critical Strike Chance at X Maximum Fury. Current bonus: X increased Critical Strike Chance.
- **Lunging Strike > Berserking** *Skill upgrade*: Lunging Strike grants Berserking for X seconds when it Critically Strikes. Lunging Strike gains X increased Critical Strike Chance.
- **Aspect of the Dire Whirlwind** *Aspect*: Whirlwind's Critical Strike Chance and Critical Strike Damage are increased by [5.5 – 13]%[x] for each second it is channeled, up to [27.5 – 65]%[x].
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Heir of Perdition** (Helm) *Unique*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **Locran's Talisman** (Amulet) *Unique*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **Locran's Talisman** (Boots) *Unique*: Your Skills gain 0.4%[+] Critical Strike Chance per point of Primary Resource you have when cast, up to 40%[+]. Each point of Primary Resource above 100 grants Skills 0.2%[x] Critical Strike Damage...
- **Ring of Red Furor** (Ring) *Unique*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **Ring of Red Furor** (Boots) *Unique*: After spending 100 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals 80%[x] bonus Critical Strike Damage.
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Open Eye of Gorgorra** (Amulet) *Unique*: When inflicting Damage Over Time, you have a chance equal to your Critical Strike Chance to increase the damage amount by [75 – 90]%[x].
- **Heir of Perdition** (Charm) *Unique charm*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **Locran's Talisman** (Charm) *Unique charm*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **Ring of Red Furor** (Charm) *Unique charm*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Open Eye of Gorgorra** (Charm) *Unique charm*: When inflicting Damage Over Time, you have a chance equal to your Critical Strike Chance to increase the damage amount by [75 – 90]%[x].
- **Flawless Technique** *Paragon node*: Consecutive attacking with the same weapon increases your Critical Strike chance by 5%[+] and Critical Strike Damage by 45%[x] for 4 seconds.
- **Mortal Draw** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, Skills that swap to a different weapon deal +X increased damage. / Swapping weapons has a 18% chance to cause the Skill's damage to Critically Strike. ...
- **Wrath** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 3 Fury. / Increase Critical Strike Damage by X.

### Pays it off (17)

- **Iron Maelstrom > Additional Effect** *Skill upgrade*: Each attack gains an additional effect: Two Handed Bludgeoning deals X increased Critical Strike Damage Two Handed Slashing deals X increased damage to Vulnerable enemies. Dual Wield gains X Cast S...
- **Accelerating** *Aspect*: Critical Strikes with Core Skills increase your Attack Speed by [30 – 50]%[+] for 5 seconds.
- **Aspect of Sundered Ground** *Aspect*: Every 20 seconds, your next Upheaval cast is guaranteed to Overpower and deals [50 – 70]%[x] increased damage. Upheaval Critical Strikes against Elites reduce this timer by 1 second.
- **Aspect of the Dire Whirlwind** *Aspect*: Whirlwind's Critical Strike Chance and Critical Strike Damage are increased by [5.5 – 13]%[x] for each second it is channeled, up to [27.5 – 65]%[x].
- **Wind Striker** *Aspect*: Critical Strikes grant [30 – 50]%[+] Movement Speed for 1 second, up to 6 seconds.
- **Gohr's Devastating Grips** (Boots) *Unique*: Whirlwind explodes every 3 seconds dealing 600% increased damage as Fire. Critical Strikes with Whirlwind reduce the time until the next explosion by 0.4 seconds down to 1 second.
- **Locran's Talisman** (Amulet) *Unique*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **Locran's Talisman** (Boots) *Unique*: Your Skills gain 0.4%[+] Critical Strike Chance per point of Primary Resource you have when cast, up to 40%[+]. Each point of Primary Resource above 100 grants Skills 0.2%[x] Critical Strike Damage...
- **Ring of Red Furor** (Ring) *Unique*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **Ring of Red Furor** (Boots) *Unique*: After spending 100 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals 80%[x] bonus Critical Strike Damage.
- **The Grandfather** (Sword2H) *Unique*: Increases your Critical Strike Damage by 120%[x].
- **Locran's Talisman** (Charm) *Unique charm*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **Ring of Red Furor** (Charm) *Unique charm*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **The Grandfather** (Charm) *Unique charm*: Increases your Critical Strike Damage by 120%[x].
- **Flawless Technique** *Paragon node*: Consecutive attacking with the same weapon increases your Critical Strike chance by 5%[+] and Critical Strike Damage by 45%[x] for 4 seconds.
- **Cleaver** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding an Axe. / While wielding an Axe, you deal 12%[x] increased Critical Strike Damage. / Increase damage by X.
- **Wrath** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 3 Fury. / Increase Critical Strike Damage by X.

## Overpower

Overpower procs and Overpower damage.


### Makes it happen (24)

- **Bash > Overpower** *Skill upgrade*: Clobbering with Bash grants X stack of Overpower.
- **Death Blow > Overpower** *Skill upgrade*: Death Blow grants X stack of Overpower when it kills an enemy.
- **Hammer of the Ancients > Overpower** *Skill upgrade*: Hammer of the Ancients deals X increased damage if you have Overpower.
- **Leap > Arsenal Bonus** *Skill upgrade*: Leap grants a bonus based on its Arsenal Selection Dual Wield: X seconds of Berserking Bludgeoning: X stack of Overpower Slashing: X stack of Ferocity
- **Upheaval > Overpower** *Skill upgrade*: Upheaval consumes X Overpower stack to increase Upheaval's Size by X and damage by X.
- **Wrath of the Berserker > Overpower** *Skill upgrade*: Wrath of the Berserker grants X stack of Overpower per second.
- **Aspect of Deluge** *Aspect*: Overpower stacks increase your Primary Maximum Resource by [6 – 21] and regeneration by 2.
- **Aspect of Sundered Ground** *Aspect*: Every 20 seconds, your next Upheaval cast is guaranteed to Overpower and deals [50 – 70]%[x] increased damage. Upheaval Critical Strikes against Elites reduce this timer by 1 second.
- **Aspect of the Warpath** *Aspect*: While you have Overpower charges, your attacks while wielding a Bludgeoning weapon deal [40 – 60]%[x] increased damage.
- **Blood Boiling** *Aspect*: Every 6 seconds, gain 1 stack of Overpower. Gaining Overpower spawns 1 Volatile Blood Drop, and collecting it causes it to explode, dealing [3,500 – 12,500] Physical damage around you.
- **Blood Boiling** *Aspect*: Every 6 seconds, gain 1 stack of Overpower. Spending Overpower spawns 1 Volatile Blood Drop, and collecting it causes it to explode, dealing [9,000 – 12,990] Physical damage around you.
- **Cremator's** *Aspect*: While you have 4 or more Overpower, your Fire Skill Casts deal [45 – 65]%[x] increased damage.
- **Earthstriker's** *Aspect*: After swapping weapons 8 times, your next non-Basic Skill will Overpower and deal [15 – 35]%[x] increased Overpower damage.
- **Earthstriker's** *Aspect*: Gain 1 Overpower stack each time you swap weapons. You deal [15.5 – 23]%[x] increased damage while you have Overpower.
- **Executioner's** *Aspect*: Your Overpowers will spawn an Earthquake every 4 seconds that deals [4,000 – 9,360] Physical damage over 4 seconds. Your Earthquake damage is increased by 5%[x] for every 100 Strength you have, up ...
- **Overheating** *Aspect*: Slain Burning enemies have a 10% chance to grant Overpower. Your Fire damage is increased by [15 – 22.5]%[x].
- **Tidal** *Aspect*: Your Maximum Overpower is increased by [1 – 16] while you are Fortified.
- **Banished Lord's Talisman** (Amulet) *Unique*: After you spend 275 of your Primary Resource, gain 4 stacks of Overpower. Consuming Overpower increases your Critical Strikes damage by [86.7 – 100]%[x] for 8 seconds.
- **Banished Lord's Talisman** (Boots) *Unique*: After you spend 275 of your Primary Resource, your next Core Skill is guaranteed to Overpower. Your Critical Strikes that Overpower deal 60%[x] increased damage.
- **Banished Lord's Talisman** (Charm) *Unique charm*: After you spend 275 of your Primary Resource, gain 4 stacks of Overpower. Consuming Overpower increases your Critical Strikes damage by [86.7 – 100]%[x] for 8 seconds.
- **Bone Breaker** *Paragon node*: Every 12 seconds, gain a charge of Overpower. Whenever you attack while having an Overpower charge, your Ultimate Skills deal 10%[x] increased damage for 10 seconds, up to 80%[x].
- **Decimator** *Paragon node*: You deal 25%[x] increased damage to Vulnerable enemies. You deal 25%[x] increased damage while you have Overpower charges.
- **Crusher** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding a Mace or Flail. / While wielding a Mace or Flail, attacks while having an Overpower charge deal 15%[x] incr...
- **Dominate** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage per Overpower charge. / Every 12 seconds, you gain a charge of Overpower. / Increase damage by X.

### Pays it off (1)

- **Earthstriker's** *Aspect*: After swapping weapons 8 times, your next non-Basic Skill will Overpower and deal [15 – 35]%[x] increased Overpower damage.

## Vulnerable

Making enemies Vulnerable and paying it off.


### Makes it happen (15)

- **Bash > Heavy Knuckles** *Skill upgrade*: Clobbering an enemy with Bash has a X chance to Critical Strike, and Clobbered enemies become Vulnerable for X seconds.
- **Flay > Anemia** *Skill upgrade*: Flay's Bleeding duration is reduced by X seconds and it makes enemies Vulnerable.
- **Flay > Enhanced Flay** *Skill upgrade*: Flay has a X chance to make the enemy Vulnerable for X seconds. Double this chance when using a Two-Handed weapon.
- **Kick > Vulnerable** *Skill upgrade*: Kick makes enemies Vulnerable for X seconds.
- **Steel Grasp > Enhanced Steel Grasp** *Skill upgrade*: Steel Grasp also makes enemies Vulnerable for X seconds.
- **Steel Grasp > Vulnerable** *Skill upgrade*: Steel Grasp makes enemies Vulnerable for X seconds.
- **War Cry > Vulnerable** *Skill upgrade*: War Cry makes nearby enemies Vulnerable for X seconds.
- **Aspect of Endless Fury** *Aspect*: Basic skills generate [9 – 12]%[x] more Fury and make enemies Vulnerable.
- **Aspect of Frosty Strides** *Aspect*: While below [45 – 60]% Life, Evade Freezes Close enemies, deals 6,000 Cold damage to them, and makes them Vulnerable for 3 seconds.
- **Twin Strikes** (Gloves) *Unique*: Double Swing's initial sweep deals [45 – 60]%[x] increased damage and applies Vulnerable. Subsequent swings deals [90 – 120]%[x] increased damage and grants Berserking for 3 seconds.
- **Wyrdskin** (Gloves) *Unique*: Attacks apply Vulnerable to Distant Enemies, and Weakened to Close Enemies. You deal [30 – 40]%[x] increased damage to Enemies that are both Vulnerable and Weakened.
- **Infinity** (Axe2H) *Runeword*: 50% Chance to unleash a Rank 10 Sorcerer Chain Lightning when you kill an enemy. You gain the Rank 11 passive of Druid's Cyclone Armor. Close enemies are Vulnerable and take 62.5%[x] more damage fr...
- **Wyrdskin** (Charm) *Unique charm*: Attacks apply Vulnerable to Distant Enemies, and Weakened to Close Enemies. You deal [30 – 40]%[x] increased damage to Enemies that are both Vulnerable and Weakened.
- **Bloodletter's Flow (2-piece)** *Talisman set*: • Your Bleeding effects last 80%[x] longer and make enemies Vulnerable.
- **Exploit** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Vulnerable targets. / When an enemy is damaged by you, they become Vulnerable for 3 seconds. This cannot happen more th...

### Pays it off (7)

- **Iron Maelstrom > Additional Effect** *Skill upgrade*: Each attack gains an additional effect: Two Handed Bludgeoning deals X increased Critical Strike Damage Two Handed Slashing deals X increased damage to Vulnerable enemies. Dual Wield gains X Cast S...
- **Rend > Vulnerable Damage Bonus** *Skill upgrade*: Rend deals X increased damage to Vulnerable enemies.
- **Aspect of Anemia** *Aspect*: Lucky Hit: Damaging enemies affected by Damage over Time or Vulnerable enemies has up to a [20 – 30]% chance to Stun them for 2 seconds.
- **Cut to the Bone** *Aspect*: Your Damage Over Time effects deal [40 – 60]%[x] increased damage to Vulnerable enemies.
- **Decimator** *Paragon node*: You deal 25%[x] increased damage to Vulnerable enemies. You deal 25%[x] increased damage while you have Overpower charges.
- **Exploit** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Vulnerable targets. / When an enemy is damaged by you, they become Vulnerable for 3 seconds. This cannot happen more th...
- **Territorial** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Close targets. / You gain 15% Damage Reduction against Close enemies. / Increase damage to Vulnerable targets by X.

## Damage over time

Burning, Poisoning, Bleeding and other damage over time.


### Makes it happen (51)

- **Death Blow** *Skill*: Fury Cost: Charges: X Charge Cooldown: seconds Cooldown: seconds Lucky Hit Chance: [|%|] Attempt a killing strike, dealing in fire damage to enemies in front of you and Burning them for damage over...
- **Flay** *Skill*: Fury Cost: Generate Fury: X Lucky Hit Chance: [|%|] Flay the enemy, dealing damage and inflicting Bleeding damage over seconds.
- **Iron Maelstrom** *Skill*: Cooldown: seconds Lucky Hit Chance: [[|%|] Activate three times to attach chains to each of your weapons and perform an attack: First, your Two-Handed Bludgeoning weapon slams into the ground, deal...
- **Iron Skin** *Skill*: Cooldown: seconds Steel yourself for X seconds, increasing your Maximum Life by [(X * X)*100|%|] and preventing your Life from being reduced below 1. You are healed to X Life when Iron Skin expires...
- **Rend** *Skill*: Fury Cost: Lucky Hit Chance: [|%|] Cleave enemies in front of you, dealing damage and inflicting Bleeding damage over seconds.
- **Rupture** *Skill*: Fury Cost: Cooldown: seconds Charges: X Charge Cooldown: seconds Lucky Hit Chance: [|%|] Skewer enemies in front of you, dealing damage, then rip your weapon out, inflicting Bleeding damage over X ...
- **Call of the Ancients > Empowered** *Skill upgrade*: Your Ancients are empowered: Korlic creates an Earthquake that deals Physical damage over [PowerTag.Barbarian_Earthquake."Script Formula 1"] seconds when he leaps. Talic leaves behind Dust Devils t...
- **Challenging Shout > Raging** *Skill upgrade*: Challenging Shout causes enemies to burn with rage, dealing Burning damage over seconds. You no longer gain Damage Reduction from Challenging Shout but instead gain X increased damage against Burni...
- **Charge > Battering Ram** *Skill upgrade*: Charge now deals Fire damage. Instead of swinging your weapon, colliding with enemies deals Fire damage and Stuns them for seconds. Additionally, you leave a burning trail that inflicts Burning dam...
- **Death Blow > Blast** *Skill upgrade*: Death Blow now deals Fire damage and deals an additional Burning damage over seconds. Enemies that die to Death Blow while Burning or to Death Blow's burn trigger a fiery explosion for damage to su...
- **Flay > Anemia** *Skill upgrade*: Flay's Bleeding duration is reduced by X seconds and it makes enemies Vulnerable.
- **Flay > Duration Bonus** *Skill upgrade*: Flay's Bleeding duration is increased by X seconds.
- **Flay > Healing** *Skill upgrade*: Each Nearby enemy Bleeding from Flay Heals you for X of your Maximum Life () per second, up to X.
- **Flay > Hemorrhaging** *Skill upgrade*: Flay's Bleeding is extended by X |4second:seconds; whenever the enemy moves too far from you.
- **Flay > The Flayer** *Skill upgrade*: If Flay hits a Bleeding enemy it causes a blood explosion that inflicts Bleeding damage over seconds.
- **Frenzy > Raging** *Skill upgrade*: Frenzy now deals Fire damage. Lucky Hit: Frenzy has up to a X chance to cause a fiery explosion, dealing Burning damage over seconds.
- **Frenzy > Throwing** *Skill upgrade*: Frenzy becomes a ranged attack that pierces enemies, dealing damage. Frenzy has a X chance while at maximum Frenzy stacks to ricochet Iron Shrapnel, dealing damage and inflicting Bleeding damage ov...
- **Iron Maelstrom > Armageddon** *Skill upgrade*: Each attack gains an additional effect: Two Handed Bludgeoning creates a Earthquake that deals Physical damage over [PowerTag.Barbarian_Earthquake."Script Formula 1"] seconds, Two-Handed Slashing s...
- **Iron Skin > Retaliation** *Skill upgrade*: Iron Skin no longer grants a Barrier. Instead you reflect Iron Shrapnel when attacked, dealing damage and inflicting Bleeding damage over seconds. Iron Skin's duration is tripled.
- **Kick > Crimson** *Skill upgrade*: Kick now deals Fire damage and inflicts Burning damage over seconds. Burning enemies will explode on Death or if they hit a wall for damage.
- **Rend > Blood Sworn** *Skill upgrade*: Enemies that die while Bleeding from Rend spread X their remaining Bleed onto a random Close enemy.
- **Rend > Healing** *Skill upgrade*: Heal for X of your Maximum Life per second for each enemy Bleeding from Rend.
- **Rend > Scorching** *Skill upgrade*: Rend now deals Fire damage. Each slash creates a wave of fire, dealing damage and an additional Burning damage over seconds.
- **Rupture > All For One** *Skill upgrade*: Casting Rupture Summons X Ancients that skewer your target for damage and then performing a rip attack that deals as direct damage instead of Bleeding.
- **Rupture > Blood Pool** *Skill upgrade*: Rupture now creates a blood pool when you rip your weapon out, inflicting Bleeding damage over X seconds. You and your Allies gain X% increased Attack Speed while standing in the blood pool.
- **Rupture > Gore** *Skill upgrade*: Rupture now causes an explosion when you rip your weapon out, dealing Bleeding damage over X seconds.
- **Upheaval > Iron Burst** *Skill upgrade*: Upheaval flings Iron Shrapnel dealing damage, and inflicting Bleeding damage over seconds.
- **Whirlwind > Bursting** *Skill upgrade*: Whirlwind also explodes, dealing Fire damage and inflicting Burning damage over seconds. Whirlwind now deals Fire damage.
- **Whirlwind > Winding** *Skill upgrade*: Attacking with another Skill grants X stacks of charge up to X that decays over time. Your Whirlwind deals X increased damage and gains X Movement Speed per stack. While Whirlwind has charges it la...
- **Aspect of Berserk Ripping** *Aspect*: While Berserking, your direct damage inflicts [40 – 60]% bonus Bleeding damage over 5 seconds.
- **Aspect of Bul-Kathos** *Aspect*: Leap creates an Earthquake that deals [2,740 – 4,340] Physical damage over 4 seconds. While standing in Earthquakes and for 4 seconds afterwards, you gain 30% increased Damage Reduction.
- **Aspect of Earthquakes** *Aspect*: Ground Stomp creates an Earthquake damaging enemies for [2,220 – 3,820] Physical damage over 4 seconds. While standing in Earthquakes and for 4 seconds afterwards, you deal [20 – 60]%[x] increased ...
- **Aspect of Warmth** *Aspect*: Each Nearby Burning enemy Heals you for [2 – 3]% of your Maximum Life every second.
- **Executioner's** *Aspect*: Your Overpowers will spawn an Earthquake every 4 seconds that deals [4,000 – 9,360] Physical damage over 4 seconds. Your Earthquake damage is increased by 5%[x] for every 100 Strength you have, up ...
- **Iron Blood** *Aspect*: Gain [3.9 – 5.9]% Damage Reduction for each Nearby Bleeding enemy up to [19.5 – 29.5]% maximum.
- **Skullbreaker's** *Aspect*: Incapacitating a Bleeding enemy deals [40 – 60]% of their total Bleeding amount as Physical damage.
- **Slaking** *Aspect*: Lucky Hit: You have up to a [45 – 65]% chance to gain 20 Fury when a Core Skill deals direct damage to at least one Bleeding enemy. Your Maximum Fury is increased by [20 – 25].
- **Andariel's Visage** (Helm) *Unique*: Lucky Hit: Up to a 20% chance to trigger a poison nova that deals 40% of the damage dealt over 5 seconds to enemies in the area.
- **Blood-Mad Idol** (Amulet) *Unique*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **Fields of Crimson** (Sword2H) *Unique*: Rupture's rip deals [37.5 – 50]% of the total Bleeding damage on an enemy instantly, removing all Bleeding damage from them.
- **Rage of Harrogath** (Boots) *Unique*: Lucky Hit: Inflicting Bleeding on an enemy has up to a 60% chance to reduce the Cooldowns of your Skills by 1 second.
- **Sliver of Hate** (Ring) *Unique*: Chance on being hit to unleash Hatred, Fearing and inflicting 72,000 Corrupting damage over 5 seconds to surrounding enemies.
- **X'Fal's Corroded Signet** (Ring) *Unique*: Each Damage over Time type you apply explodes every second, dealing [6,000 – 7,000] damage over 4 seconds to surrounding enemies.
- **Grief** (Sword_Phase_Blade) *Runeword*: Your direct damage inflicts 40% bonus Poisoning damage over 5 seconds.
- **Andariel's Visage** (Charm) *Unique charm*: Lucky Hit: Up to a 20% chance to trigger a poison nova that deals 40% of the damage dealt over 5 seconds to enemies in the area.
- **Blood-Mad Idol** (Charm) *Unique charm*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **X'Fal's Corroded Signet** (Charm) *Unique charm*: Each Damage over Time type you apply explodes every second, dealing [6,000 – 7,000] damage over 4 seconds to surrounding enemies.
- **Bloodletter's Flow (2-piece)** *Talisman set*: • Your Bleeding effects last 80%[x] longer and make enemies Vulnerable.
- **Bloodletter's Flow (5-piece)** *Talisman set*: • Casting a skill that applies Bleeding to enemies has 10% chance to Rupture them for 200%[x] increased damage. Enemies take 200%[x] increased Bleeding damage.
- **Bloodfeeder** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Bleeding targets. / You deal 10%[x] increased damage to enemies affected by Damage Over Time. / Increase damage by X.
- **Disembowel** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased Bleeding damage. / You deal 15%[x] increased Damage Over Time damage. / Increase damage by X.

### Pays it off (16)

- **Call of the Ancients > Empowered** *Skill upgrade*: Your Ancients are empowered: Korlic creates an Earthquake that deals Physical damage over [PowerTag.Barbarian_Earthquake."Script Formula 1"] seconds when he leaps. Talic leaves behind Dust Devils t...
- **Challenging Shout > Raging** *Skill upgrade*: Challenging Shout causes enemies to burn with rage, dealing Burning damage over seconds. You no longer gain Damage Reduction from Challenging Shout but instead gain X increased damage against Burni...
- **Death Blow > Blast** *Skill upgrade*: Death Blow now deals Fire damage and deals an additional Burning damage over seconds. Enemies that die to Death Blow while Burning or to Death Blow's burn trigger a fiery explosion for damage to su...
- **Ground Stomp > Breach** *Skill upgrade*: Ground Stomp becomes a Brawling Skill that deals Fire damage. Ground Stomp no longer Stuns and smashes the surrounding ground. Instead, it fissures the ground in front of you, dealing damage. Burni...
- **Hammer of the Ancients > Ancestral** *Skill upgrade*: Hammer of the Ancients now deals Fire damage. Casting Hammer of the Ancients Summons X Ancients to hammer the same area for damage each. If Burning enemies are struck Hammer of the Ancients explode...
- **Kick > Crimson** *Skill upgrade*: Kick now deals Fire damage and inflicts Burning damage over seconds. Burning enemies will explode on Death or if they hit a wall for damage.
- **Upheaval > Trailblazing** *Skill upgrade*: Upheaval ignites the ground Burning enemies for an additional damage over seconds. Upheaval now deals Fire damage.
- **Aspect of Disobedience** *Aspect*: Your Damage over Time grants you [1 – 2.5]% Damage Reduction for 2 seconds, stacking up to 30 times.
- **Aspect of Inevitable Fate** *Aspect*: When an enemy falls below 35% Life while afflicted with any of your damage over time effects, an explosion occurs every 7 seconds, dealing [4,000 – 8,000] damage for each Element they're afflicted by.
- **Cut to the Bone** *Aspect*: Your Damage Over Time effects deal [40 – 60]%[x] increased damage to Vulnerable enemies.
- **Overheating** *Aspect*: Slain Burning enemies have a 10% chance to grant Overpower. Your Fire damage is increased by [15 – 22.5]%[x].
- **Sapping** *Aspect*: Gain [1 – 2.5] Primary Resource per second for each Nearby enemy affected by your Damage Over Time effects.
- **Sickfoot's** *Aspect*: Gain up to [1 – 2.5]%[+] increased Movement and Damage over Time Speed for each Nearby enemy affected by your Damage over Time effects, stacks up to 25 times.
- **Blood-Mad Idol** (Amulet) *Unique*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **X'Fal's Corroded Signet** (Boots) *Unique*: Lucky Hit: Your damage over time effects have up to a 75% chance to erupt, dealing 26,000 damage of the same type to surrounding enemies.
- **Blood-Mad Idol** (Charm) *Unique charm*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.

## Fortify, Barrier, Healthy

Fortify, Barriers and Life thresholds.


### Makes it happen (15)

- **Iron Skin** *Skill*: Cooldown: seconds Steel yourself for X seconds, increasing your Maximum Life by [(X * X)*100|%|] and preventing your Life from being reduced below 1. You are healed to X Life when Iron Skin expires...
- **Iron Skin > Endure** *Skill upgrade*: Iron Skin no longer grants a Barrier, but your Life cannot be reduced below 1 for the duration and you are healed to X Life when Iron Skin expires.
- **Iron Skin > Retaliation** *Skill upgrade*: Iron Skin no longer grants a Barrier. Instead you reflect Iron Shrapnel when attacked, dealing damage and inflicting Bleeding damage over seconds. Iron Skin's duration is tripled.
- **Aspect of Coagulation** *Aspect*: Gain 30%[+] increased Fortify generation and [15 – 23]% Damage Reduction while Fortified.
- **Aspect of Numbing Wrath** *Aspect*: Generating 100 Fury while at Maximum Fury grants Fortify for [7 – 10]% of your Maximum Life.
- **Aspect of the Deflecting Barrier** *Aspect*: You have a [10 – 25]% chance after taking direct damage to gain a Barrier equal to 20% of your Maximum Life for 10 seconds. This chance is doubled against Distant enemies.
- **Aspect of the Protector** *Aspect*: Damaging an Elite enemy grants you a Barrier for [70 – 100]% of your Maximum Life for 10 seconds. This effect can only happen once every 20 seconds.
- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Shroud of False Death** (ChestArmor) *Unique*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Soulbrand** (ChestArmor) *Unique*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Temerity** (Legs) *Unique*: Effects that Heal you beyond 100% Life grant you Barrier equal to [80 – 100]% of the overhealed amount that lasts for 8 seconds. You may now drink your Healing Potion while at full Life.
- **Shroud of False Death** (Charm) *Unique charm*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Soulbrand** (Charm) *Unique charm*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Temerity** (Charm) *Unique charm*: Effects that Heal you beyond 100% Life grant you Barrier equal to [80 – 100]% of the overhealed amount that lasts for 8 seconds. You may now drink your Healing Potion while at full Life.
- **Arms of Arreat (3-piece)** *Talisman set*: • Swapping weapons grants 2 Resolve and a Barrier for 10% of your Maximum Life, up to 100%, for 6 seconds.

### Pays it off (19)

- **Aspect of Coagulation** *Aspect*: Gain 30%[+] increased Fortify generation and [15 – 23]% Damage Reduction while Fortified.
- **Conceited** *Aspect*: Deal [40 – 60]%[x] increased damage while you have a Barrier active.
- **Crushing** *Aspect*: While Fortified, you deal [45 – 65]%[x] increased damage.
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Snowveiled** *Aspect*: While you have a Barrier, gain [20 – 35]% Damage Reduction.
- **Undying** *Aspect*: Casting a Skill Heals you for [2 – 3.5]% of your Maximum Life. Double this bonus while Injured.
- **Vulpine's** *Aspect*: Gain [15 – 30] Primary Resource per second while you have a Barrier.
- **Coop de Grâce** (Polearm) *Unique*: Lucky Hit: Damage to Injured enemies has up to a [10 – 15]% chance to spawn a flock of explosive chickens.
- **Nomad's Longing Heart** (Amulet) *Unique*: Core Skills deal [30 – 40]%[x] increased damage, but cost 25%[x] more Fury. The damage is doubled against Injured and Healthy enemies.
- **Soulbrand** (ChestArmor) *Unique*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **Nomad's Longing Heart** (Charm) *Unique charm*: Core Skills deal [30 – 40]%[x] increased damage, but cost 25%[x] more Fury. The damage is doubled against Injured and Healthy enemies.
- **Soulbrand** (Charm) *Unique charm*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **Warbringer** *Paragon node*: For every 300 Fury you spend, gain 2% of your Maximum Life (0) as Fortify. Deal 45%[x] increased damage while Fortified.
- **Weapons Master** *Paragon node*: Swapping weapons grants you 4 Fury. You deal 75%[x] increased damage to Injured and Healthy enemies.
- **Imbiber** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Healthy. / You gain 5%[x] increased damage and 5%[+] increased Potion Healing for each missing Healing Potion, up to...
- **Might** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / You deal 8%[x] increased damage while wielding Two-Handed weapons. / You deal X increased damage to Healthy and Injured enemies.
- **Undaunted** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Fortified. / You gain up to 15% Damage Reduction the more Fortify you have. / Increase damage by X.

## Thorns

Thorns damage.


### Makes it happen (7)

- **Bruiser's** *Aspect*: Gain 4%[+] increased Armor and [163 – 569] Thorns per 1% missing Maximum Life.
- **Death Wish** *Aspect*: Gain [1,423 – 1,830] Thorns while Berserking.
- **Needleflare** *Aspect*: Thorns damage dealt has a [40 – 60]% chance to deal damage to all enemies around you and your Minions.
- **Sticker-thought** *Aspect*: Gain [2,033 – 6,100] Thorns while Channeling and for 3 seconds afterwards.
- **Razorplate** (ChestArmor) *Unique*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Razorplate** (Charm) *Unique charm*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Revenge** [Willpower] *Glyph*: Grants +X bonus to all Rare nodes within range. / Dealing Thorns damage to an enemy increases all damage it takes from you by 1%[x], up to 15%[x], for 10 seconds. / Increase damage by X.

### Pays it off (4)

- **Needleflare** *Aspect*: Thorns damage dealt has a [40 – 60]% chance to deal damage to all enemies around you and your Minions.
- **Razorplate** (ChestArmor) *Unique*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Razorplate** (Charm) *Unique charm*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Revenge** [Willpower] *Glyph*: Grants +X bonus to all Rare nodes within range. / Dealing Thorns damage to an enemy increases all damage it takes from you by 1%[x], up to 15%[x], for 10 seconds. / Increase damage by X.

## Ultimates

Ultimate skills.


### Makes it happen (9)

- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill increases your Ultimate damage by [6 – 10]%[x], up to [60 – 100]%[x]. At 10 stacks, your Cooldowns and this bonus are reset.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill reduces the Cooldowns of your other Skills by [6.5 – 14] seconds.
- **Aspect of Assistance** *Aspect*: Your Reinforcement Cooldown is reduced by [22.5 – 32.5]%[x]. After casting your Ultimate Skill, your Reinforcement Mercenary is called. This cannot occur more than once each 30 seconds.
- **Vehement Brawler's** *Aspect*: Casting an Ultimate Skill increases your damage by [35 – 55]%[x] for 8 seconds. Gain 2 additional Ultimate Skill Ranks.
- **Arreat's Bearing** (Legs) *Unique*: Your non-Ultimate Skills that summon Ancients will now summon an additional one. Skills that summon Ancients deal [30 – 40]%[x] increased damage.
- **Yen's Blessing** (Boots) *Unique*: Casting a Skill has a [40 – 60]% chance to trigger a Non-Mobility, Non-Ultimate Skill that is currently on Cooldown. Can only occur once every 8 seconds.
- **Arreat's Bearing** (Charm) *Unique charm*: Your non-Ultimate Skills that summon Ancients will now summon an additional one. Skills that summon Ancients deal [30 – 40]%[x] increased damage.
- **Yen's Blessing** (Charm) *Unique charm*: Casting a Skill has a [40 – 60]% chance to trigger a Non-Mobility, Non-Ultimate Skill that is currently on Cooldown. Can only occur once every 8 seconds.
- **Bone Breaker** *Paragon node*: Every 12 seconds, gain a charge of Overpower. Whenever you attack while having an Overpower charge, your Ultimate Skills deal 10%[x] increased damage for 10 seconds, up to 80%[x].

### Pays it off (4)

- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill increases your Ultimate damage by [6 – 10]%[x], up to [60 – 100]%[x]. At 10 stacks, your Cooldowns and this bonus are reset.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill reduces the Cooldowns of your other Skills by [6.5 – 14] seconds.
- **Vehement Brawler's** *Aspect*: Casting an Ultimate Skill increases your damage by [35 – 55]%[x] for 8 seconds. Gain 2 additional Ultimate Skill Ranks.
- **Bone Breaker** *Paragon node*: Every 12 seconds, gain a charge of Overpower. Whenever you attack while having an Overpower charge, your Ultimate Skills deal 10%[x] increased damage for 10 seconds, up to 80%[x].

## Elites, bosses and kills

Things that care about elites, bosses or kills.


### Makes it happen (0)

- none found

### Pays it off (36)

- **Death Blow** *Skill*: Fury Cost: Charges: X Charge Cooldown: seconds Cooldown: seconds Lucky Hit Chance: [|%|] Attempt a killing strike, dealing in fire damage to enemies in front of you and Burning them for damage over...
- **Death Blow > Consecutive** *Skill upgrade*: Death Blow's cooldown is reduced to X seconds. Hitting enemies with Death Blow increases the damage of subsequent casts by X per hit enemy, up to X. Kills reset this bonus.
- **Death Blow > Fury Generation** *Skill upgrade*: Killing an enemy with Death Blow restores X of your Fury.
- **Death Blow > Overpower** *Skill upgrade*: Death Blow grants X stack of Overpower when it kills an enemy.
- **Kick > Collide** *Skill upgrade*: Kicked enemies deal damage to enemies they collide with. Additionally, Kick destroys certain objects from Elite monster affixes.
- **Whirlwind > Enhanced Whirlwind** *Skill upgrade*: Gain X Fury each time Whirlwind deals direct damage to an enemy, or X Fury against Elite enemies.
- **Aspect of Ancestral Force** *Aspect*: Hammer of the Ancients quakes outward for [30 – 60]%[x] increased damage. This bonus is doubled against Bosses.
- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Fortune** *Aspect*: You gain [15 – 22.5]%[x] Lucky Hit Chance against Elite enemies.
- **Aspect of Giant Strides** *Aspect*: Reduces the Cooldown of Leap by [1.3 – 5] seconds per enemy hit, up to a maximum of 7 seconds. Hitting a Boss with Leap provides the maximum reduction.
- **Aspect of Rallying Reversal** *Aspect*: When you Crowd Control an enemy or apply any Stagger to a Boss, gain 1 Ferocity and [10 – 15]% Damage Reduction for 4 seconds.
- **Aspect of Sundered Ground** *Aspect*: Every 20 seconds, your next Upheaval cast is guaranteed to Overpower and deals [50 – 70]%[x] increased damage. Upheaval Critical Strikes against Elites reduce this timer by 1 second.
- **Aspect of Voracious Rage** *Aspect*: Killing an enemy with a Core Skill refunds [20 – 30]% of its base cost. Can only happen once per Skill cast.
- **Aspect of the Protector** *Aspect*: Damaging an Elite enemy grants you a Barrier for [70 – 100]% of your Maximum Life for 10 seconds. This effect can only happen once every 20 seconds.
- **Bear Clan Berserker's** *Aspect*: Kills while Berserking increases the Cooldown Rate of your Brawling Skills by [50 – 75]% for 2 seconds.
- **Shard of Dawn** *Aspect*: After 30 seconds of Night's Grasp, gain Dawn's Haste, increasing your Cast Speed by [20 – 40]% and Movement Speed by 20% for 12 seconds. While empowered by the Midwinter Ward, killing an enemy redu...
- **Godslayer Crown** (Boots) *Unique*: When you Stun, Freeze, or Immobilize an Elite, you Pull In all Nearby enemies and deal 60%[x] increased damage to them for 3 seconds. Can only occur once every 12 seconds.Against Bosses, this effec...
- **Heir of Perdition** (Helm) *Unique*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **In-Geom** (Sword) *Unique*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Nemesis Bracers** (Gloves) *Unique*: Shrines will spawn an Elite Pack.
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Furnace** (Mace2H) *Unique*: You deal [75 – 100]%[x] more damage to Elites.
- **Wendigo Brand** (Ring) *Unique*: Every 15 kills in the last [50 – 60] seconds increases your damage by 2%[x], and Attack Speed by 1%[+].
- **Infinity** (Axe2H) *Runeword*: 50% Chance to unleash a Rank 10 Sorcerer Chain Lightning when you kill an enemy. You gain the Rank 11 passive of Druid's Cyclone Armor. Close enemies are Vulnerable and take 62.5%[x] more damage fr...
- **Heir of Perdition** (Charm) *Unique charm*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **In-Geom** (Charm) *Unique charm*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Nemesis Bracers** (Charm) *Unique charm*: Shrines will spawn an Elite Pack.
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Furnace** (Charm) *Unique charm*: You deal [75 – 100]%[x] more damage to Elites.
- **Wendigo Brand** (Charm) *Unique charm*: Every 15 kills in the last [50 – 60] seconds increases your damage by 2%[x], and Attack Speed by 1%[+].
- **Berserker's Crucible (5-piece)** *Talisman set*: You gain stacking bonuses the longer you stay Berserking:• 5 seconds - 200%[x] Damage and 30% Fury Cost Reduction.• 10 seconds - 10 Fury Per Second and 10% Cooldown Reduction.• 20 seconds - Every 5...
- **Blood Rage** *Paragon node*: Killing an enemy affected by a Damage Over Time effect has 10% chance to grant Berserking for 5 seconds. Your damage is increased by 45%[x] while Berserking.
- **Challenger** [Strength] *Glyph*: Grants +X bonus to all Normal nodes within range. / You deal 10%[x] increased damage to Elites. / Increase damage to Elites by X.
- **Ire** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while Berserking. / While Berserking, you take 10% reduced damage from Elites. / You deal X increased damage to Close enemies.
- **Rumble** [Strength] *Glyph*: For every 5 Strength purchased within range, your Earthquakes deal X increased damage. / You deal 3%[x] increased damage to Bosses and Crowd Controlled enemies for each active Earthquake, up to 15%...
- **Seething** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding a Sword. / While wielding a Sword, you gain 5 Fury when you kill an enemy. / Increase damage by X.

## Evade and Dodge

Evade casts and dodges.


### Makes it happen (9)

- **Aspect of Elusive Menace** *Aspect*: Your Dodge Chance increases by [20 – 35]%[+] whenever you take damage. Successfully Dodging resets this bonus.
- **Aspect of Frosty Strides** *Aspect*: While below [45 – 60]% Life, Evade Freezes Close enemies, deals 6,000 Cold damage to them, and makes them Vulnerable for 3 seconds.
- **Aspect of Metamorphosis** *Aspect*: Evade transforms you into a cloud of bats, dealing 4,000 Physical damage and inflicting Vampiric Curse to enemies in your path. Evade's Cooldown is increased by [2.5 – 10] seconds.
- **Aspect of the Crowded Sage** *Aspect*: You have 8% increased Dodge Chance. Successful Dodges restore [5 – 20]% of your Maximum Life.
- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Juggernaut's** *Aspect*: You gain [100 – 150]%[+] Total Armor, but your Evade has 100% increased Cooldown.
- **Flickerstep** (Boots) *Unique*: Each enemy you Evade through reduces your active Ultimate Cooldown by [3 – 4] seconds, up to 10 seconds.
- **Enigma** (ChestArmor) *Runeword*: Your Evade is now Sorcerer's Teleport and costs 33 Primary Resource.
- **Flickerstep** (Charm) *Unique charm*: Each enemy you Evade through reduces your active Ultimate Cooldown by [3 – 4] seconds, up to 10 seconds.

### Pays it off (3)

- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Juggernaut's** *Aspect*: You gain [100 – 150]%[+] Total Armor, but your Evade has 100% increased Cooldown.
- **Rain** (ChestArmor) *Runeword*: Lucky Hit: Attacks have up to a [15 – 30]% chance to unleash a Rank 15 Druid Tornado.50% Chance to unleash a Rank 15 Druid Cyclone Armor whenever you Dodge.

## Attack speed

Attack speed and its payoffs.


### Makes it happen (16)

- **Call of the Ancients > Attack Speed and Damage Bonus** *Skill upgrade*: When you Cast Call of the Ancients, gain X Attack Speed and X increased damage for each Ancient summoned for seconds.
- **Frenzy > Enhanced Frenzy** *Skill upgrade*: While Frenzy is granting X bonus Attack Speed, the Fury costs of your Core Skills are reduced by X.
- **Rallying Cry > The World** *Skill upgrade*: Rallying Cry Dazes and Slows all enemies and their projectiles by X for X seconds. Rallying Cry also grants Attack Speed instead of Movement Speed and its Fury Cost is replaced with a X second Cool...
- **Rupture > Blood Pool** *Skill upgrade*: Rupture now creates a blood pool when you rip your weapon out, inflicting Bleeding damage over X seconds. You and your Allies gain X% increased Attack Speed while standing in the blood pool.
- **Wrath of the Berserker > Fury Generation** *Skill upgrade*: While Wrath of the Berserker is active, gain X Attack Speed and increase Fury Generation by X.
- **Accelerating** *Aspect*: Critical Strikes with Core Skills increase your Attack Speed by [30 – 50]%[+] for 5 seconds.
- **Aspect of Frenzied Onslaught** *Aspect*: Your Summons gain [35 – 50]%[+] Attack Speed.
- **Aspect of the Moonrise** *Aspect*: Damaging an enemy with a Basic Skill grants you 4% Attack Speed for 10 seconds, stacking up to 5 times. Upon reaching maximum stacks, you enter a Vampiric Bloodrage, gaining [40 – 60]%[x] Basic Ski...
- **Rapid** *Aspect*: Basic Skills gain [40 – 60]%[+] Attack Speed.
- **Battle Trance** (Amulet) *Unique*: Frenzy gains the Barrage Variant for free and can stack 2 additional times. While at maximum stacks, you deal [50 – 66.7]%[x] increased damage and your other Skills gain [23.3 – 30]%[+] increased A...
- **Battle Trance** (Boots) *Unique*: Increase Frenzy's maximum stacks by 2. While at maximum stacks, you deal 60%[x] increased damage and your other Skills gain 55%[+] increased Attack Speed.
- **Dark Stalker's Medallion** (Amulet) *Unique*: Casting a Skill with a Two-Handed Bludgeoning, Two-Handed Slashing, or Dual-Wielded weapon grants [15 – 20]%[x] increased damage for 15 seconds.While all three bonuses are active, you gain [Affix."...
- **Wendigo Brand** (Ring) *Unique*: Every 15 kills in the last [50 – 60] seconds increases your damage by 2%[x], and Attack Speed by 1%[+].
- **Dark Stalker's Medallion** (Charm) *Unique charm*: Casting a Skill with a Two-Handed Bludgeoning, Two-Handed Slashing, or Dual-Wielded weapon grants [15 – 20]%[x] increased damage for 15 seconds.While all three bonuses are active, you gain [Affix."...
- **Wendigo Brand** (Charm) *Unique charm*: Every 15 kills in the last [50 – 60] seconds increases your damage by 2%[x], and Attack Speed by 1%[+].
- **Carnage** *Paragon node*: Berserking now additionally grants 15%[+] Attack Speed. You deal 45%[x] increased Fire and Physical damage.

### Pays it off (0)

- none found

## Resource spending

Spending or generating your class resource.


### Makes it happen (24)

- **Bash** *Skill*: Fury Cost: Generate Fury: Lucky Hit Chance: [|%|] Bash the enemy with your weapon, dealing damage. Every Xrd[Xth Bash will clobber, Stunning enemies for seconds.
- **Charge** *Skill*: Generate Fury: X per enemy hit Cooldown: seconds Lucky Hit Chance: [|%|] Rush forward and push enemies before swinging your weapon, dealing damage and Knocking Back enemies.
- **Flay** *Skill*: Fury Cost: Generate Fury: X Lucky Hit Chance: [|%|] Flay the enemy, dealing damage and inflicting Bleeding damage over seconds.
- **Frenzy** *Skill*: Fury Cost: Generate Fury: X Lucky Hit Chance: [|%|] Unleash a rapid flurry of blows, dealing damage with each pair of hits. If Frenzy hits an enemy, its Cast Speed is increased by X for seconds, up...
- **Ground Stomp** *Skill*: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Smash the ground, dealing damage and Stunning surrounding enemies for seconds.
- **Leap** *Skill*: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Leap forward and then slam down, dealing damage and Slowing enemies by X for seconds.
- **Lunging Strike** *Skill*: Fury Cost: Generate Fury: X Cooldown: seconds Lucky Hit Chance: [|%|] Lunge forward and strike an enemy, dealing damage.
- **Steel Grasp** *Skill*: Generate Fury: XFury Cost: Charges: X Charge Cooldown: seconds Lucky Hit Chance: [|%|] Throw out a trio of chains that deal damage and Pull In enemies.
- **Call of the Ancients > The Chosen** *Skill upgrade*: Depending on your last used weapon, you summon X very strong AncientsAncient for twice as long. Your Ancient gains an additional power: Korlic: You gain 10 Fury each time Korlic damages an enemy wi...
- **Challenging Shout > Fury Generation** *Skill upgrade*: Taking damage while Challenging Shout is active will generate X Fury.
- **Death Blow > Fury Generation** *Skill upgrade*: Killing an enemy with Death Blow restores X of your Fury.
- **Frenzy > Fury Generation** *Skill upgrade*: Frenzy generates X additional Fury.
- **Ground Stomp > Enhanced Ground Stomp** *Skill upgrade*: Ground Stomp generates X Fury and Pulls in enemies.
- **Hammer of the Ancients > Enhanced Hammer of the Ancients** *Skill upgrade*: Gain X more Fury for X seconds for each enemy damaged by Hammer of the Ancients, stacking up to X times.
- **Hammer of the Ancients > Fury Generation** *Skill upgrade*: Gain X increased Fury Generation for X seconds for each enemy damaged by Hammer of the Ancients, up to X.
- **Leap > Fury Generation** *Skill upgrade*: Leap now generates X Fury.
- **Lunging Strike > Fury Generation** *Skill upgrade*: Lunging Strike generates X Fury for each enemy you lunge through.
- **Rallying Cry > Booming** *Skill upgrade*: Rallying Cry increases your Resource Generation by X and your Movement Speed by an additional X.
- **Steel Grasp > Solo Chain** *Skill upgrade*: Steel Grasp becomes a Basic Skill that has no Cooldown, generates up to X Fury based on Charges, but only throws a single chain.
- **Whirlwind > Enhanced Whirlwind** *Skill upgrade*: Gain X Fury each time Whirlwind deals direct damage to an enemy, or X Fury against Elite enemies.
- **Aspect of Berserk Fury** *Aspect*: You gain [7 – 11] Fury per second while Berserking.
- **Slaking** *Aspect*: Lucky Hit: You have up to a [45 – 65]% chance to gain 20 Fury when a Core Skill deals direct damage to at least one Bleeding enemy. Your Maximum Fury is increased by [20 – 25].
- **Seething** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding a Sword. / While wielding a Sword, you gain 5 Fury when you kill an enemy. / Increase damage by X.
- **Wrath** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 3 Fury. / Increase Critical Strike Damage by X.

### Pays it off (22)

- **Death Blow > Charges** *Skill upgrade*: Death Blow has X charges.Death Blow's Fury cost is reduced to X Fury.
- **Hammer of the Ancients > Critical Strike** *Skill upgrade*: Hammer of the Ancients gains X increased Critical Strike Chance for every X Maximum Fury you have, up to X Critical Strike Chance at X Maximum Fury. Current bonus: X increased Critical Strike Chance.
- **Kick > Power** *Skill upgrade*: Instead of Knocking Back enemies, Kick becomes a Core Skill which costs X Fury and deals damage, increased by X per Maximum Fury you have, up to X Fury.
- **Upheaval > Fury Cost Reduction** *Skill upgrade*: Upheaval's Fury cost is reduced to X Fury.
- **Whirlwind > Cost Damage Bonus** *Skill upgrade*: Whirlwind deals X increased damage and costs X additional Fury.
- **Aspect of Encroaching Wrath** *Aspect*: After spending 100 Fury, you deal [40 – 60]%[x] increased Brawling Skill damage for 4 seconds.
- **Aspect of Numbing Wrath** *Aspect*: Generating 100 Fury while at Maximum Fury grants Fortify for [7 – 10]% of your Maximum Life.
- **Slaking** *Aspect*: Lucky Hit: You have up to a [45 – 65]% chance to gain 20 Fury when a Core Skill deals direct damage to at least one Bleeding enemy. Your Maximum Fury is increased by [20 – 25].
- **Hooves of the Mountain God** (Boots) *Unique*: Casting a Basic Skill while at Maximum Fury causes your Fury to increasingly Drain until you run out, during which your Basic skills now cleave dealing [45 – 60]%[x] increased damage.
- **Nomad's Longing Heart** (Amulet) *Unique*: Core Skills deal [30 – 40]%[x] increased damage, but cost 25%[x] more Fury. The damage is doubled against Injured and Healthy enemies.
- **Ramaladni's Magnum Opus** (Sword) *Unique*: Skills deal [0.35 – 0.5]%[x] increased damage per point of Fury you have, but 7% Fury Drains per second while in combat.
- **Ramaladni's Magnum Opus** (Boots) *Unique*: Skills deal 0.5%[x] increased damage per point of Fury you have, but 10 Fury Drains per second.
- **Ring of Red Furor** (Ring) *Unique*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **Ring of Red Furor** (Boots) *Unique*: After spending 100 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals 80%[x] bonus Critical Strike Damage.
- **The Third Blade** (Sword) *Unique*: Your Weapon Mastery Skills are now also Core Skills that have 100% Cooldown Reduction but cost Fury, dealing [140 – 160]% of normal damage.
- **Hooves of the Mountain God** (Charm) *Unique charm*: Casting a Basic Skill while at Maximum Fury causes your Fury to increasingly Drain until you run out, during which your Basic skills now cleave dealing [45 – 60]%[x] increased damage.
- **Nomad's Longing Heart** (Charm) *Unique charm*: Core Skills deal [30 – 40]%[x] increased damage, but cost 25%[x] more Fury. The damage is doubled against Injured and Healthy enemies.
- **Ramaladni's Magnum Opus** (Charm) *Unique charm*: Skills deal [0.35 – 0.5]%[x] increased damage per point of Fury you have, but 7% Fury Drains per second while in combat.
- **Ring of Red Furor** (Charm) *Unique charm*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **The Third Blade** (Charm) *Unique charm*: Your Weapon Mastery Skills are now also Core Skills that have 100% Cooldown Reduction but cost Fury, dealing [140 – 160]% of normal damage.
- **Bul-Kathos' Pride (2-piece)** *Talisman set*: • Ancient Skills cost 50% reduced Fury, gain 50% increased Cooldown Reduction, and deal 50%[x] increased damage.
- **Sescheron's Fury (5-piece)** *Talisman set*: • Your Maximum Fury is increased by 50. • Colossal further increases Skill size to 50%, and damage to 600%[x].

## Berserking

Berserking uptime and payoffs.


### Makes it happen (23)

- **Wrath of the Berserker** *Skill*: Cooldown: seconds Explode into rage, Knocking Back surrounding enemies while gaining X increased damage, Berserking, and Unstoppable for X seconds.
- **Frenzy > Barrage** *Skill upgrade*: Frenzy stacks up an additional X times and you gain Berserking for X seconds while at maximum stacks.
- **Lunging Strike > Berserking** *Skill upgrade*: Lunging Strike grants Berserking for X seconds when it Critically Strikes. Lunging Strike gains X increased Critical Strike Chance.
- **Steel Grasp > Berserking** *Skill upgrade*: Steel Grasp grants Berserking for X seconds on Hit.
- **War Cry > Enhanced War Cry** *Skill upgrade*: War Cry grants you Berserking for X seconds.
- **War Cry > Mighty Roar** *Skill upgrade*: War Cry's damage bonus is increased by X and allies now receive its full effect. You also gain Berserking for X seconds.
- **Aspect of Anger Management** *Aspect*: While above 50 Fury, deal [10 – 30]%[x] increased damage and gain Berserking, but 3 Fury Drains per second.
- **Aspect of Anger Management** *Aspect*: While above 50 Primary Resource, deal [15 – 25]%[x] increased damage and gain Berserking, but lose 3 Primary Resource Regeneration.
- **Aspect of Berserk Fury** *Aspect*: You gain [7 – 11] Fury per second while Berserking.
- **Battle Fervor's** *Aspect*: Brawling Skills grant Berserking for 5 seconds on their first hit. Gain [10 – 17.5]% Damage Reduction while Berserking.
- **Battle-Mad** *Aspect*: Gain [Affix_Value_1|%x|*100] increased damage and Berserking for 4 seconds after swapping weapons 8 times.
- **Battle-Mad** *Aspect*: After swapping weapons 5 times gain Berserking for 4 seconds. Additionally, you deal [Affix_Value_1/100|1%x|*100] increased damage while Berserking.
- **Death Wish** *Aspect*: Gain [1,423 – 1,830] Thorns while Berserking.
- **Blood-Mad Idol** (Amulet) *Unique*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **Emblem of Staalbreak** (Amulet) *Unique*: Berserking's damage bonus is increased by [56.7 – 73.3]%[+]. While not Healthy, you are always Berserk.
- **Tuskhelm of Joritz the Mighty** (Helm) *Unique*: When you gain Berserking while already Berserk, you become more enraged granting [40 – 50]%[x] increased damage, 0 Fury per second, and 0% Cooldown Reduction.
- **Twin Strikes** (Gloves) *Unique*: Double Swing's initial sweep deals [45 – 60]%[x] increased damage and applies Vulnerable. Subsequent swings deals [90 – 120]%[x] increased damage and grants Berserking for 3 seconds.
- **Blood-Mad Idol** (Charm) *Unique charm*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **Emblem of Staalbreak** (Charm) *Unique charm*: Berserking's damage bonus is increased by [56.7 – 73.3]%[+]. While not Healthy, you are always Berserk.
- **Tuskhelm of Joritz the Mighty** (Charm) *Unique charm*: When you gain Berserking while already Berserk, you become more enraged granting [40 – 50]%[x] increased damage, 0 Fury per second, and 0% Cooldown Reduction.
- **Berserker's Crucible (3-piece)** *Talisman set*: • Gain 30% Damage Reduction while Berserking.
- **Berserker's Crucible (5-piece)** *Talisman set*: You gain stacking bonuses the longer you stay Berserking:• 5 seconds - 200%[x] Damage and 30% Fury Cost Reduction.• 10 seconds - 10 Fury Per Second and 10% Cooldown Reduction.• 20 seconds - Every 5...
- **Blood Rage** *Paragon node*: Killing an enemy affected by a Damage Over Time effect has 10% chance to grant Berserking for 5 seconds. Your damage is increased by 45%[x] while Berserking.

### Pays it off (15)

- **Double Swing > Flurry** *Skill upgrade*: Each sweep also hits X additional time dealing , and an extra X additional times while Berserking.
- **Aspect of Berserk Fury** *Aspect*: You gain [7 – 11] Fury per second while Berserking.
- **Aspect of Berserk Ripping** *Aspect*: While Berserking, your direct damage inflicts [40 – 60]% bonus Bleeding damage over 5 seconds.
- **Aspect of Burning Rage** *Aspect*: While Berserking, you deal [900 – 1,650] Fire damage every second to surrounding enemies.
- **Aspect of Prolific Fury** *Aspect*: While Berserking, Fury Generation is increased by [30 – 60]%.
- **Battle Fervor's** *Aspect*: Brawling Skills grant Berserking for 5 seconds on their first hit. Gain [10 – 17.5]% Damage Reduction while Berserking.
- **Battle-Mad** *Aspect*: After swapping weapons 5 times gain Berserking for 4 seconds. Additionally, you deal [Affix_Value_1/100|1%x|*100] increased damage while Berserking.
- **Bear Clan Berserker's** *Aspect*: Kills while Berserking increases the Cooldown Rate of your Brawling Skills by [50 – 75]% for 2 seconds.
- **Death Wish** *Aspect*: Gain [1,423 – 1,830] Thorns while Berserking.
- **Steadfast Berserker's** *Aspect*: Gain [4 – 6]% of your Maximum Life as Fortify whenever you deal direct damage while Berserking.
- **Blood-Mad Idol** (Amulet) *Unique*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **Blood-Mad Idol** (Charm) *Unique charm*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **Berserker's Crucible (3-piece)** *Talisman set*: • Gain 30% Damage Reduction while Berserking.
- **Blood Rage** *Paragon node*: Killing an enemy affected by a Damage Over Time effect has 10% chance to grant Berserking for 5 seconds. Your damage is increased by 45%[x] while Berserking.
- **Ire** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while Berserking. / While Berserking, you take 10% reduced damage from Elites. / You deal X increased damage to Close enemies.

## Shouts

War Cry, Rallying Cry, Challenging Shout.


### Makes it happen (34)

- **Rallying Cry** *Skill*: Cooldown: secondsFury Cost: Bellow a rallying cry, increasing your Movement Speed by X for X seconds. Nearby allies gain half of Rallying Cry's effects.
- **War Cry** *Skill*: Cooldown: seconds Bellow a mighty war cry, increasing your damage dealt by X for X seconds. Nearby allies gain half of War Cry's effects.
- **Challenging Shout > Bawl** *Skill upgrade*: Challenging Shout's grants an additional X Damage Reduction that decays over its duration.
- **Challenging Shout > Damage Bonus** *Skill upgrade*: The first X enemies Taunted by Challenging Shout take X increased damage from you.
- **Challenging Shout > Duration Bonus** *Skill upgrade*: Challenging Shout's duration is increased by X seconds.
- **Challenging Shout > Enhanced Challenging Shout** *Skill upgrade*: While Challenging Shout is active, gain X bonus Maximum Life.
- **Challenging Shout > Fury Generation** *Skill upgrade*: Taking damage while Challenging Shout is active will generate X Fury.
- **Challenging Shout > Raging** *Skill upgrade*: Challenging Shout causes enemies to burn with rage, dealing Burning damage over seconds. You no longer gain Damage Reduction from Challenging Shout but instead gain X increased damage against Burni...
- **Challenging Shout > Talic** *Skill upgrade*: Challenging Shout Summons X TalicsTalic, who spins in a whirlwind rapidly attacking enemies for damage.
- **Challenging Shout > Weaken** *Skill upgrade*: Challenging Shout Weakens enemies.
- **Rallying Cry > Booming** *Skill upgrade*: Rallying Cry increases your Resource Generation by X and your Movement Speed by an additional X.
- **Rallying Cry > Duration Bonus** *Skill upgrade*: Rallying Cry's duration is increased to X seconds.
- **Rallying Cry > Enhanced Rallying Cry** *Skill upgrade*: Rallying Cry grants you Unstoppable while active.
- **Rallying Cry > Fortify** *Skill upgrade*: Rallying Cry Fortifies you for X of your Maximum Life when cast.
- **Rallying Cry > Fury Gain** *Skill upgrade*: For every X meter traveled while Rallying Cry is active, restore X primary resource to yourself and half to nearby allies.
- **Rallying Cry > Madawc** *Skill upgrade*: Rallying Cry's Fury Cost is reduced by X and it now Summons X MadawcsMadawc who upheaves the ground, dealing damage.
- **Rallying Cry > Potency** *Skill upgrade*: Rallying Cry's effectiveness is increased by X plus an additional X for each ally affected, up to X.
- **Rallying Cry > The World** *Skill upgrade*: Rallying Cry Dazes and Slows all enemies and their projectiles by X for X seconds. Rallying Cry also grants Attack Speed instead of Movement Speed and its Fury Cost is replaced with a X second Cool...
- **War Cry > Duration Increase** *Skill upgrade*: War Cry's duration is increased to X seconds.
- **War Cry > Enhanced War Cry** *Skill upgrade*: War Cry grants you Berserking for X seconds.
- **War Cry > Ferocity** *Skill upgrade*: War Cry grants X stacks of Ferocity.
- **War Cry > Korlic** *Skill upgrade*: War Cry Summons X KorlicsKorlic who leaps at enemies, dealing damage
- **War Cry > Mighty Roar** *Skill upgrade*: War Cry's damage bonus is increased by X and allies now receive its full effect. You also gain Berserking for X seconds.
- **War Cry > Slow** *Skill upgrade*: War Cry Slows nearby enemies by X for X seconds.
- **War Cry > The Scream** *Skill upgrade*: War Cry terrifies your enemies, causing them to cower in Fear. You gain X increased damage for each enemy Feared, up to X
- **War Cry > Vulnerable** *Skill upgrade*: War Cry makes nearby enemies Vulnerable for X seconds.
- **Aspect of Booming Voice** *Aspect*: Your Shout Skill effect durations are increased by [20 – 35]%[+] and Weaken enemies for 5 seconds.
- **Aspect of Fierce Winds** *Aspect*: Your Shout Skills create 3 Dust Devils that deal [800 – 1,600] damage to enemies along their path.Your Dust Devils are [5 – 25]% bigger and deal 1%[x] increased damage for each 1% their size is inc...
- **Aspect of Guttural Yell** *Aspect*: Your Shout Skills cause enemies to deal [20 – 30]% less damage for 5 seconds.
- **Aspect of Vocalized Empowerment** *Aspect*: Your Shout Skills grant you [10 – 17.5] Primary Resource Regeneration while active.
- **Bold Chieftain's** *Aspect*: Your Shout Skill Cooldowns are reduced by [8 – 15.5] seconds.
- **Call to Arms** (Axe) *Runeword*: While affected by a Shout Skill gain:• +5 Ranks to all Skills• +15%[+] Maximum Life• +15%[x] Maximum Primary Resource
- **Berserker's Crucible (5-piece)** *Talisman set*: You gain stacking bonuses the longer you stay Berserking:• 5 seconds - 200%[x] Damage and 30% Fury Cost Reduction.• 10 seconds - 10 Fury Per Second and 10% Cooldown Reduction.• 20 seconds - Every 5...
- **Marshal** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / After casting a Shout Skill, the active Cooldown of every other Non-Shout Skill is reduced by 2 seconds. If Rallying Cry is used, reduce the Fury ...

### Pays it off (4)

- **Challenging Shout > Enhanced Challenging Shout** *Skill upgrade*: While Challenging Shout is active, gain X bonus Maximum Life.
- **Challenging Shout > Fury Generation** *Skill upgrade*: Taking damage while Challenging Shout is active will generate X Fury.
- **Raid Leader's** *Aspect*: Your Shouts grant you [7 – 10]%[x] Damage Reduction and also Heal allies for [4 – 6]%[x] of their Maximum Life per second.
- **Call to Arms** (Axe) *Runeword*: While affected by a Shout Skill gain:• +5 Ranks to all Skills• +15%[+] Maximum Life• +15%[x] Maximum Primary Resource

## Weapon swapping

Arsenal and weapon swaps.


### Makes it happen (26)

- **Iron Maelstrom > Mastered Weapon** *Skill upgrade*: Depending on your last used weapon, Iron Maelstrom is now also a single Weapon Mastery Skill, and its Cooldown is reduced to X seconds.
- **Leap > Arsenal Bonus** *Skill upgrade*: Leap grants a bonus based on its Arsenal Selection Dual Wield: X seconds of Berserking Bludgeoning: X stack of Overpower Slashing: X stack of Ferocity
- **Aspect of Delayed Extinction** *Aspect*: Mighty Throw and Steel Grasp now gain multiplicative damage instead of cooldown from Cooldown Reduction and their damage is increased by another 25%[x]. Additionally, Weapon Mastery skills gain [15...
- **Aspect of Furious Impulse** *Aspect*: Each time you swap weapons, gain [7 – 14.5] Fury.
- **Aspect of Tempering Blows** *Aspect*: After swapping weapons 5 times, gain [20 – 35]% Damage Reduction for 10 seconds.
- **Aspect of the Relentless Armsmaster** *Aspect*: Gain [35 – 75]%[x] increased Fury Generation and 15% reduced Fury cost while all damage bonuses from the Walking Arsenal Key Passive are active.
- **Battle-Mad** *Aspect*: Gain [Affix_Value_1|%x|*100] increased damage and Berserking for 4 seconds after swapping weapons 8 times.
- **Battle-Mad** *Aspect*: After swapping weapons 5 times gain Berserking for 4 seconds. Additionally, you deal [Affix_Value_1/100|1%x|*100] increased damage while Berserking.
- **Duelist's** *Aspect*: While using a One-Handed weapon, attacks increase your Weapon Damage by [4.5 – 6.5]%, up to 10 times. This bonus is lost when swapping weapons.
- **Earthstriker's** *Aspect*: After swapping weapons 8 times, your next non-Basic Skill will Overpower and deal [15 – 35]%[x] increased Overpower damage.
- **Earthstriker's** *Aspect*: Gain 1 Overpower stack each time you swap weapons. You deal [15.5 – 23]%[x] increased damage while you have Overpower.
- **Irrepressible** *Aspect*: Casting a Weapon Mastery Skill Fortifies you for 5% of your Maximum Life. Increase your Maximum Life by [30 – 45]%[+].
- **Luckbringer** *Aspect*: Gain [10 – 30]%[+] increased Lucky Hit Chance while all damage bonuses from the Walking Arsenal Key Passive are active.
- **Weapon Master's** *Aspect*: Weapon Mastery Skills Stun enemies for [1 – 2.5] seconds. Enemies can be Stunned this way once every 5 seconds. Your Weapon Mastery Skills have an additional Charge and deal [10 – 25]%[x] increased...
- **Ring of Red Furor** (Ring) *Unique*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **Ring of Red Furor** (Boots) *Unique*: After spending 100 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals 80%[x] bonus Critical Strike Damage.
- **The Third Blade** (Sword) *Unique*: Your Weapon Mastery Skills are now also Core Skills that have 100% Cooldown Reduction but cost Fury, dealing [140 – 160]% of normal damage.
- **Unbroken Chain** (Amulet) *Unique*: Swapping weapons increases the damage of Iron Maelstrom by [25 – 30]%[x] for 5 seconds, stacking up to 3 times.
- **Ring of Red Furor** (Charm) *Unique charm*: After spending 30 Fury within 5 seconds, your next non-Channeled Core or Weapon Mastery Skill Cast within 5 seconds is a guaranteed Critical Strike and deals [50 – 60]%[x] bonus Critical Strike Dam...
- **The Third Blade** (Charm) *Unique charm*: Your Weapon Mastery Skills are now also Core Skills that have 100% Cooldown Reduction but cost Fury, dealing [140 – 160]% of normal damage.
- **Arms of Arreat (2-piece)** *Talisman set*: • Casting Skills that swapped weapons deal 100%[x] increased damage and reduce your Weapon Mastery Cooldowns by 5 seconds.
- **Arms of Arreat (3-piece)** *Talisman set*: • Swapping weapons grants 2 Resolve and a Barrier for 10% of your Maximum Life, up to 100%, for 6 seconds.
- **Arms of Arreat (5-piece)** *Talisman set*: • Swapping weapons grants 50%[x] increased damage for 6 seconds, stacking up to 150%[x], and also triggers an equipped Non-Ultimate Weapon Mastery Skill.
- **Weapons Master** *Paragon node*: Swapping weapons grants you 4 Fury. You deal 75%[x] increased damage to Injured and Healthy enemies.
- **Mortal Draw** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, Skills that swap to a different weapon deal +X increased damage. / Swapping weapons has a 18% chance to cause the Skill's damage to Critically Strike. ...
- **Weapon Master** [Dexterity] *Glyph*: Grants +X bonus to all Rare nodes within range. / Hitting with a Weapon Mastery Skill reduces the active Cooldown of another random Weapon Mastery Skill by 2 seconds. / Increase Weapon Mastery skil...

### Pays it off (5)

- **Iron Maelstrom > Cooldown Reduction** *Skill upgrade*: Weapon swaps reduce the Cooldown of Iron Maelstrom is by X second.
- **Aspect of Tempering Blows** *Aspect*: After swapping weapons 5 times, gain [20 – 35]% Damage Reduction for 10 seconds.
- **Battle-Mad** *Aspect*: Gain [Affix_Value_1|%x|*100] increased damage and Berserking for 4 seconds after swapping weapons 8 times.
- **Battle-Mad** *Aspect*: After swapping weapons 5 times gain Berserking for 4 seconds. Additionally, you deal [Affix_Value_1/100|1%x|*100] increased damage while Berserking.
- **Earthstriker's** *Aspect*: After swapping weapons 8 times, your next non-Basic Skill will Overpower and deal [15 – 35]%[x] increased Overpower damage.

## Earthquakes and Dust Devils

Spawned damage objects.


### Makes it happen (22)

- **Call of the Ancients > Empowered** *Skill upgrade*: Your Ancients are empowered: Korlic creates an Earthquake that deals Physical damage over [PowerTag.Barbarian_Earthquake."Script Formula 1"] seconds when he leaps. Talic leaves behind Dust Devils t...
- **Double Swing > Twister** *Skill upgrade*: The initial sweep also creates 1 Dust Devil that deals damage, the subsequent sweep creates 2.
- **Ground Stomp > Seismic** *Skill upgrade*: Ground Stomp no longer Stuns and instead creates an Earthquake that deals damage and Slows enemies by X.
- **Iron Maelstrom > Armageddon** *Skill upgrade*: Each attack gains an additional effect: Two Handed Bludgeoning creates a Earthquake that deals Physical damage over [PowerTag.Barbarian_Earthquake."Script Formula 1"] seconds, Two-Handed Slashing s...
- **Leap > Earthshatter** *Skill upgrade*: Leap now deals damage and can be Cast again within X seconds before the Cooldown begins. Landing creates an Earthquake that deals Physical damage over [PowerTag.Barbarian_Earthquake."Script Formula...
- **Lunging Strike > Whirling** *Skill upgrade*: Lunging Strike forms a Dust Devil that deals damage.
- **Steel Grasp > Devil's Chain** *Skill upgrade*: Steel Grasp gains X additional Charges and forms X Dust Devils dealing damage.
- **Whirlwind > Tornado** *Skill upgrade*: Whirlwind also creates X Dust Devils that each deal damage.
- **Aspect of Bul-Kathos** *Aspect*: Leap creates an Earthquake that deals [2,740 – 4,340] Physical damage over 4 seconds. While standing in Earthquakes and for 4 seconds afterwards, you gain 30% increased Damage Reduction.
- **Aspect of Earthquakes** *Aspect*: Ground Stomp creates an Earthquake damaging enemies for [2,220 – 3,820] Physical damage over 4 seconds. While standing in Earthquakes and for 4 seconds afterwards, you deal [20 – 60]%[x] increased ...
- **Aspect of Fierce Winds** *Aspect*: Your Shout Skills create 3 Dust Devils that deal [800 – 1,600] damage to enemies along their path.Your Dust Devils are [5 – 25]% bigger and deal 1%[x] increased damage for each 1% their size is inc...
- **Aspect of Incendiary Fissures** *Aspect*: Your Earthquakes deal [40 – 60]%[x] increased damage and their damage is converted into Fire.
- **Devilish** *Aspect*: After generating 100 Fury your next direct damage creates 2 Dust Devils that deal [800 – 1,400] damage to enemies along their path.
- **Dust Devil's** *Aspect*: Whirlwind leaves behind Dust Devils that deal [1,600 – 2,800] damage to enemies in their path. Enemies hit by Dust Devils take 25%[x] increased damage from all of your other sources for 3 seconds.
- **Executioner's** *Aspect*: Your Overpowers will spawn an Earthquake every 4 seconds that deals [4,000 – 9,360] Physical damage over 4 seconds. Your Earthquake damage is increased by 5%[x] for every 100 Strength you have, up ...
- **Heavy Hitting** *Aspect*: Your skills that create Iron Shrapnel, Earthquakes, or Dust Devils deal [40 – 60]%[x] increased damage.
- **Windlasher** *Aspect*: Casting Double Swing creates a Dust Devil that deals [700 – 1,100] damage to enemies in its path.
- **Mantle of Mountain's Fury** (ChestArmor) *Unique*: Casting Hammer of the Ancients on an Earthquake explodes for their total damage and are consumed, and also causes your Hammer of the Ancients to deal [60 – 80]%[x] increased damage for 5 seconds.
- **Mantle of Mountain's Fury** (Boots) *Unique*: Hammer of the Ancients also forms a seismic line that deals its damage and Slows enemies hit by 80% for 4 seconds. Earthquakes it passes through explode for their total damage and are consumed.
- **Force of Nature** *Paragon node*: Skills that cast Earthquakes and Dust Devils deal 45%[x] increased damage.
- **Rumble** [Strength] *Glyph*: For every 5 Strength purchased within range, your Earthquakes deal X increased damage. / You deal 3%[x] increased damage to Bosses and Crowd Controlled enemies for each active Earthquake, up to 15%...
- **Twister** [Strength] *Glyph*: For every 5 Strength purchased within range, your Dust Devils deal X increased damage. / You deal 13%[x] increased damage for 4 seconds after creating a Dust Devil. / Increase Dust Devil damage by X.

### Pays it off (9)

- **Steel Grasp > Devil's Chain** *Skill upgrade*: Steel Grasp gains X additional Charges and forms X Dust Devils dealing damage.
- **Aspect of Earthquakes** *Aspect*: Ground Stomp creates an Earthquake damaging enemies for [2,220 – 3,820] Physical damage over 4 seconds. While standing in Earthquakes and for 4 seconds afterwards, you deal [20 – 60]%[x] increased ...
- **Aspect of Fierce Winds** *Aspect*: Your Shout Skills create 3 Dust Devils that deal [800 – 1,600] damage to enemies along their path.Your Dust Devils are [5 – 25]% bigger and deal 1%[x] increased damage for each 1% their size is inc...
- **Aspect of Incendiary Fissures** *Aspect*: Your Earthquakes deal [40 – 60]%[x] increased damage and their damage is converted into Fire.
- **Executioner's** *Aspect*: Your Overpowers will spawn an Earthquake every 4 seconds that deals [4,000 – 9,360] Physical damage over 4 seconds. Your Earthquake damage is increased by 5%[x] for every 100 Strength you have, up ...
- **Heavy Hitting** *Aspect*: Your skills that create Iron Shrapnel, Earthquakes, or Dust Devils deal [40 – 60]%[x] increased damage.
- **Force of Nature** *Paragon node*: Skills that cast Earthquakes and Dust Devils deal 45%[x] increased damage.
- **Rumble** [Strength] *Glyph*: For every 5 Strength purchased within range, your Earthquakes deal X increased damage. / You deal 3%[x] increased damage to Bosses and Crowd Controlled enemies for each active Earthquake, up to 15%...
- **Twister** [Strength] *Glyph*: For every 5 Strength purchased within range, your Dust Devils deal X increased damage. / You deal 13%[x] increased damage for 4 seconds after creating a Dust Devil. / Increase Dust Devil damage by X.

## Glyphs

Which glyph rewards which playstyle. The stat in brackets is the one the glyph counts.

- **Ambidextrous** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / You deal 8%[x] increased damage while wielding One-Handed weapons. / Increase damage by X.
- **Bloodfeeder** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Bleeding targets. / You deal 10%[x] increased damage to enemies affected by Damage Over Time. / Increase damage by X.
- **Brawl** [Willpower] *Glyph*: Grants +X bonus to all Rare nodes within range. / Brawling Skills deal 25%[x] increased damage. / Increase Brawling Skill damage by X.
- **Challenger** [Strength] *Glyph*: Grants +X bonus to all Normal nodes within range. / You deal 10%[x] increased damage to Elites. / Increase damage to Elites by X.
- **Cleaver** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding an Axe. / While wielding an Axe, you deal 12%[x] increased Critical Strike Damage. / Increase damage by X.
- **Crusher** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding a Mace or Flail. / While wielding a Mace or Flail, attacks while having an Overpower charge deal 15%[x] increased damage. / Increase damage by X.
- **Disembowel** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased Bleeding damage. / You deal 15%[x] increased Damage Over Time damage. / Increase damage by X.
- **Dominate** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage per Overpower charge. / Every 12 seconds, you gain a charge of Overpower. / Increase damage by X.
- **Executioner** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding a Polearm. / While wielding a Polearm, you deal 15%[x] increased damage. / Increase damage by X.
- **Exploit** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Vulnerable targets. / When an enemy is damaged by you, they become Vulnerable for 3 seconds. This cannot happen more than once every 5 seconds per enemy. / Increase damage to Vulnerable targets by X.
- **Imbiber** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Healthy. / You gain 5%[x] increased damage and 5%[+] increased Potion Healing for each missing Healing Potion, up to 20%[x] each. / Increase damage while Healthy by X.
- **Ire** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while Berserking. / While Berserking, you take 10% reduced damage from Elites. / You deal X increased damage to Close enemies.
- **Marshal** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / After casting a Shout Skill, the active Cooldown of every other Non-Shout Skill is reduced by 2 seconds. If Rallying Cry is used, reduce the Fury cost of the next Core Skill by 20% instead. / Increase damage by X.
- **Might** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / You deal 8%[x] increased damage while wielding Two-Handed weapons. / You deal X increased damage to Healthy and Injured enemies.
- **Mortal Draw** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, Skills that swap to a different weapon deal +X increased damage. / Swapping weapons has a 18% chance to cause the Skill's damage to Critically Strike. / Increase damage by X.
- **Revenge** [Willpower] *Glyph*: Grants +X bonus to all Rare nodes within range. / Dealing Thorns damage to an enemy increases all damage it takes from you by 1%[x], up to 15%[x], for 10 seconds. / Increase damage by X.
- **Rumble** [Strength] *Glyph*: For every 5 Strength purchased within range, your Earthquakes deal X increased damage. / You deal 3%[x] increased damage to Bosses and Crowd Controlled enemies for each active Earthquake, up to 15%[x]. / Increase Earthquake damage by X.
- **Seething** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage while wielding a Sword. / While wielding a Sword, you gain 5 Fury when you kill an enemy. / Increase damage by X.
- **Territorial** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased damage to Close targets. / You gain 15% Damage Reduction against Close enemies. / Increase damage to Vulnerable targets by X.
- **Twister** [Strength] *Glyph*: For every 5 Strength purchased within range, your Dust Devils deal X increased damage. / You deal 13%[x] increased damage for 4 seconds after creating a Dust Devil. / Increase Dust Devil damage by X.
- **Undaunted** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Fortified. / You gain up to 15% Damage Reduction the more Fortify you have. / Increase damage by X.
- **Weapon Master** [Dexterity] *Glyph*: Grants +X bonus to all Rare nodes within range. / Hitting with a Weapon Mastery Skill reduces the active Cooldown of another random Weapon Mastery Skill by 2 seconds. / Increase Weapon Mastery skill damage by X.
- **Wrath** [Dexterity] *Glyph*: For every 5 Dexterity purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 3 Fury. / Increase Critical Strike Damage by X.

## Paragon legendary nodes

- **Blood Rage** *Paragon node*: Killing an enemy affected by a Damage Over Time effect has 10% chance to grant Berserking for 5 seconds. Your damage is increased by 45%[x] while Berserking.
- **Bone Breaker** *Paragon node*: Every 12 seconds, gain a charge of Overpower. Whenever you attack while having an Overpower charge, your Ultimate Skills deal 10%[x] increased damage for 10 seconds, up to 80%[x].
- **Carnage** *Paragon node*: Berserking now additionally grants 15%[+] Attack Speed. You deal 45%[x] increased Fire and Physical damage.
- **Decimator** *Paragon node*: You deal 25%[x] increased damage to Vulnerable enemies. You deal 25%[x] increased damage while you have Overpower charges.
- **Flawless Technique** *Paragon node*: Consecutive attacking with the same weapon increases your Critical Strike chance by 5%[+] and Critical Strike Damage by 45%[x] for 4 seconds.
- **Force of Nature** *Paragon node*: Skills that cast Earthquakes and Dust Devils deal 45%[x] increased damage.
- **Hemorrhage** *Paragon node*: Applying a Damage Over Time effect to a Vulnerable enemy deals 60%[x] increased damage.
- **Warbringer** *Paragon node*: For every 300 Fury you spend, gain 2% of your Maximum Life (0) as Fortify. Deal 45%[x] increased damage while Fortified.
- **Weapons Master** *Paragon node*: Swapping weapons grants you 4 Fury. You deal 75%[x] increased damage to Injured and Healthy enemies.
