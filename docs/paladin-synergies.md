# Paladin synergy map

Reference for building Paladin builds that work in concert. Each section is one **mechanic**: first what **makes it happen** (skills, upgrades, items that create the trigger), then what **pays it off** (powers that react to it or scale with it). Pick a trigger you can make all the time, then stack payoffs for it.

Made from the planner's Season 15 game data on 22 Nov 2026 (aspects, uniques, runewords, unique charms, talisman sets, Paragon legendary nodes, glyphs, skills, skill upgrades). `X` stands for a number that scales with rank or roll. Things marked **tested** were checked in game by Phil.

## How to read a build

1. **Pick the engine.** The engine is the one thing the build does all the time: block, move, cast an Aura, apply Judgement, crowd control enemies, deal Thorns, or stay in Arbiter.
2. **Turn the main skill into the engine.** Skill upgrades usually do this, for example Shield Charge hits count as blocks.
3. **Stack payoffs for that engine.** Prefer [x] multiplicative payoffs over additive ones.
4. **Close the loop.** Pick something that turns the payoff back into more of the engine, such as block → cooldown reduction → more Shield Charge, or Aura cast → Resplendence → more Aura casts.
5. **Pick glyphs that fit how the build plays.** Glyphs reward a stat or a state, so pick the ones your engine already keeps up.

## Tested combos and rules

These were checked in game and are modelled in the planner.

- **Grief:** procs from Holy Light Aura pulses and from Dawnfire. It also rides the Thorns nova. The poison is a copy of 40% of the finished hit, so anything that scales the hit also scales the poison.
- **Aura pulses and Dawnfire:** Fists of Fate, Blood-Mad Idol and Reaver all proc from both.
- **Phoenix:** its "Attacks" spears do not proc from Auras.
- **Stone of Jordan:** uses whichever element you have the highest resistance in.
- **Heaven's Radiant Fire:** can be kept up all the time. Proselytizing spreads Judgement, so Judgement Day stays at full stacks.
- **Preacher:** this is the attack speed board, not Fervent. It gives 65%[x] × (1 + attack speed), so it pairs with Auradin and any attack speed stacking.
- **Shield of Retribution:** uses Ward of the White Dove, not Gate of the Red Dawn. The Ward's effect is doubled.
- **Nerfed, do not use:** Heir of Perdition and The Grandfather.
- **Not viable for bosses:** El'Druin's execute, Heaven's Fury and Herald's Morningstar.
- **Wumba's Embrace:** Spiritborn only. Eggis is real; it is from the April Fowl's event.

## Core engines

### Block engine (Shield Charge, Shield Bash)

- **Make it happen:**
  - Take the Shield Charge or Shield Bash upgrade that makes it a Core skill.
  - Take the upgrade that makes its hits count as blocks. Every enemy hit is now a block.
  - Stack Block Chance: Shield Bearer node (110%, additive), Bulwark and Castle.
- **Pay it off:**
  - Redirected Force (block and crit).
  - Akarat's Blessing.
  - Bastion of Sir Matthias.
  - Northern Guard.
  - Cathan's Righteous Will 2-piece and 5-piece.
  - Anything that says "when you block". The full list is in the Block section below.
- **Close the loop:** anything that cuts cooldowns or gives Faith on block, so you can charge again sooner. Block → crowd control pairs with the crowd control section.
- **Glyphs:** Castle (armor) and whatever rewards Block Chance or Fortify. Check the Glyphs table.

### Aura engine (Auradin)

- **Make it happen:** cast Aura skills often, using cooldown reduction and Resplendence (which cuts the cooldown of non-Aura skills when you cast an Aura). Aura Potency and standing in Consecration also count.
- **Pay it off:**
  - Grief, Fists of Fate, Blood-Mad Idol and Reaver all proc from pulses.
  - Preacher, which scales with attack speed.
  - Holy Light Aura's Judgement bonus.
- **Glyphs:** Resplendence, plus anything with "Aura" in the text. See the Aura section.

### Judgement engine

- **Make it happen:**
  - Rite of Judgement and Aegis "Faith Is My Shield" apply Judgement.
  - Proselytizing (amulet) chains and spreads it.
  - Condemn cuts cooldowns per enemy it hits.
- **Pay it off:**
  - Sentencing.
  - Law glyph.
  - Holy Light's Judgement bonus.
  - Heaven's Radiant Fire (Judgement Day stacks).

### Movement engine

- **Make it happen:** Movement Speed, Unhindered, Unstoppable, or a mobility skill like Shield Charge or Advance.
- **Pay it off:**
  - Alacrity on Defiance while moving.
  - Relentless while moving.
  - Anything "while moving" or "after moving" in the Movement section.

### Crowd control engine

- **Make it happen:** Stun, Knock Down, Daze, Taunt or Slow from skill upgrades, or block → crowd control powers.
- **Pay it off:** "Crowd Controlled" and "worthy enemy" payoffs. Bosses count as worthy (crowd control immune), so payoffs that work on worthy enemies also hit bosses.

### Thorns engine (nova)

- **Make it happen:** Thorns from gear, Retribution Chance, block (Retribution procs on block), and Ward of the White Dove.
- **Pay it off:** the Thorns nova. Grief rides the nova, so maximise cooldown reduction for more novas.

## For the optimizer and the build agent

`data/synergy-tags.json` is the machine-readable version of this file. Every power carries two lists:

- `makes`: the triggers it creates.
- `pays`: the triggers it pays off.

Rules for picking one power over another:

1. **Engine first.** Find the triggers the main skill line `makes` all the time, for example "Block" when Shield Charge has Hit Count As Blocking.
2. **Payoff only counts with its engine.** Rank a power that `pays` a trigger only if the build also `makes` that trigger. A block payoff on a build that never blocks is dead weight.
3. **Prefer closed loops.** A power that pays one engine trigger and makes another, like Akarat's Blessing (block → cooldowns), beats one that only pays.
4. **Then pure numbers.** Among powers that fit, [x] multiplicative beats [+] additive. Confirm the choice with LAB.optimize and the boss score, not with tags alone.
5. **Respect the tested rules above.** For example, Phoenix gives nothing on an Aura build, and Heir and Grandfather are banned.

## Multiplier checklist

Phil values [x] multiplicative over additive. Look for these when you check a build:

- [x] in skill upgrades, aspects and uniques.
- Legendary Paragon nodes: Preacher, Castle and Shield Bearer.
- Doublers from a single slot: runewords (Holy Thunder, King's Grace) and Ward of the White Dove.
- Grief: 40% of the hit, repeated on every proc.
- Glyph level matters. The planner assumes level 75 (max 150), and each glyph's bonus scales with its level.

---

# Full lists by mechanic


## Block

A block, or a hit that counts as one.


### Makes it happen (16)

- **Aegis** *Skill*: Cooldown: seconds Surround yourself with shields of the Light, Taunting Close enemies and gaining X Block Chance and X Armor for seconds.
- **Clash** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Strike an enemy with your weapon and shield, dealing damage. Striking enemies with Clash grants you Crusader's March, increasing your Block Cha...
- **Blessed Shield > Armor and Block Chance Bonus** *Skill upgrade*: Blessed Shield increases your Armor by X and Block Chance by X for X seconds each time it hits an enemy.
- **Blessed Shield > Damage Bonus** *Skill upgrade*: Blessed Shield deals X of your shield's Block Chance as additional damage.
- **Clash > Enhanced Clash** *Skill upgrade*: Whenever you cast Clash, gain Crusader's March for seconds. Crusader's March grants you X Block Chance and X stacks of Resolve.
- **Clash > Skirmish** *Skill upgrade*: Clash becomes a Zealot Skill and cleaves in an area for damage. Crusaders March no longer grants Block Chance or Resolve, instead granting X Critical Strike Chance up to X.
- **Shield Bash > Enhanced Shield Bash** *Skill upgrade*: Hits with Shield Bash counts as Blocks. This effect can trigger once per Cast.
- **Shield Bash > Hits Are Blocks** *Skill upgrade*: Shield Bash's hits counts as Blocks. This effect can trigger once per Cast.
- **Shield Charge > Hit Count As Blocking** *Skill upgrade*: Shield Charge's hits count as Blocks.
- **Aspect of Interdiction** *Aspect*: Gain [2 – 3]%[+] Block Chance per Resolve stack.
- **Aspect of Redirected Force** *Aspect*: Gain increased Critical Strike Damage equal to [40 – 60]%[x] of your Block Chance. Blocking doubles this bonus for 10 seconds.
- **Aspect of Spiked Armor** *Aspect*: Gain [40 – 60]%[+] increased Total Armor, 2,033 Thorns, and 15%[+] increased Block Chance.
- **Aspect of the Indomitable** *Aspect*: Gain Armor and Impairment Reduction equal to [30 – 45]% of your Block Chance.Current Bonus: 0%
- **Bulwark's** *Aspect*: You no longer dodge, but your Block chance is increased by [10 – 30]%[+].
- **Bulwark's** *Aspect*: You no longer Dodge, but you gain [20 – 35]% Block Damage Reduction and 15%[+] Block Chance.
- **Shield Bearer** *Paragon node*: You deal increased damage equal to 110% of your Block chance.

### Pays it off (12)

- **Aegis > Faith Is My Shield** *Skill upgrade*: Aegis now applies Judgement instead of Taunting enemies. Blocking while Aegis is active applies Judgement to the attacker.
- **Blessed Shield > Damage Bonus** *Skill upgrade*: Blessed Shield deals X of your shield's Block Chance as additional damage.
- **Aspect of Akarat's Blessing** *Aspect*: Blocks have a [10 – 17.5]% chance to reduce all Cooldowns by 1 second.
- **Aspect of Layered Wards** *Aspect*: Your Blocked Damage Reduction is increased by [30 – 40]%[+].
- **Aspect of Redirected Force** *Aspect*: Gain increased Critical Strike Damage equal to [40 – 60]%[x] of your Block Chance. Blocking doubles this bonus for 10 seconds.
- **Aspect of the Indomitable** *Aspect*: Gain Armor and Impairment Reduction equal to [30 – 45]% of your Block Chance.Current Bonus: 0%
- **Aspect of the Northern Guard** *Aspect*: Blocks have a [25 – 45]% chance to Freeze the attacker for 3 seconds.
- **Bristleback** *Aspect*: When you Dodge or Block an attack you trigger a [200 – 300]% Thorns attack against the attacker.
- **Bastion of Sir Matthias** (Shield) *Unique*: Blocking has a 15% chance to retaliate with a Shield Bash. Your Shield Bash damage is increased by [80 – 100]%[x].
- **Eggis** (Shield) *Unique*: Blocking an attack has a chance to turn the attacker into a Feared chicken for [3 – 4] seconds.
- **Cathan's Righteous Will (2-piece)** *Talisman set*: • Enemies cower before you, becoming Feared and Immobilized for 0.5 seconds when they first see you or when you Block them.
- **Shield Bearer** *Paragon node*: You deal increased damage equal to 110% of your Block chance.

## Crowd control

Stun, Freeze, Knock Down, Fear, Immobilize, Slow, Chill, Daze, Taunt.


### Makes it happen (47)

- **Aegis** *Skill*: Cooldown: seconds Surround yourself with shields of the Light, Taunting Close enemies and gaining X Block Chance and X Armor for seconds.
- **Condemn** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Harness the Light and Pull enemies in after XX seconds, briefly Stunning them and dealing damage. While Casting Condemn, you become Unhindered for X seconds.
- **Spear of the Heavens** *Skill*: Faith Cost: Cooldown: seconds Lucky Hit Chance: % Rain down [1+X] heavenly spears from the sky, dealing damage and Knocking Down enemies for seconds. After X seconds, the spears burst, dealing damage.
- **Zenith** *Skill*: Cooldown: seconds Lucky Hit Chance: % Summon a divine sword that cleaves the battlefield for damage. Casting Zenith again cuts through the battlefield for damage and Knocks Down enemies for seconds.
- **Aegis > Faith Is My Shield** *Skill upgrade*: Aegis now applies Judgement instead of Taunting enemies. Blocking while Aegis is active applies Judgement to the attacker.
- **Blessed Hammer > Slow** *Skill upgrade*: Blessed Hammer now Slows enemies by X for X seconds.
- **Consecration > Bastion** *Skill upgrade*: Consecration Immobilizes enemies and can be cast anywhere.
- **Falling Star > Faster Than Light** *Skill upgrade*: Falling Star cuts through the battlefield, Knocking Down enemies for X seconds when landing and creating a fissure along your path that deals damage before erupting for damage.
- **Fortress > Rampart of Thorns** *Skill upgrade*: Enemies inside Fortress are Slowed by X and take X of your Thorns damage per second.
- **Heaven's Fury > Slow** *Skill upgrade*: Heaven's Fury Slows enemies by X for X seconds.
- **Holy Bolt > Slow** *Skill upgrade*: Holy Bolt Slows enemies by X for X seconds.
- **Holy Bolt > Storm Bolt** *Skill upgrade*: Holy Bolt becomes a Justice Skill with a X second Cooldown. Holy Bolt is hurled and smashes the ground, dealing damage and Stunning enemies in an area for seconds.
- **Holy Light Aura > Rite of Submission** *Skill upgrade*: Holy Light's active now Stuns enemies for seconds and deals damage in an area if the enemy dies during this effect.
- **Purify > Surrender** *Skill upgrade*: Instead of Dazing enemies, Purify now Stuns for seconds.
- **Shield Bash > Smite** *Skill upgrade*: Shield Bash smites the first enemy it hits, dealing damage, Stunning for second, and Knocking Back enemies behind for damage.
- **Shield Charge > Virtuous Charge** *Skill upgrade*: Shield Charge becomes a Judicator Skill and consumes Judgement on impact, increasing the ending nova damage by X for each Judgement consumed up to X. When Shield Charge ends you release a Holy nova...
- **Zenith > Sermon of Steel** *Skill upgrade*: Zenith unleashes your wrath, dealing damage and can be cast indefinitely for seconds before starting its Cooldown. Instead of Knocking Down enemies, Zenith's 2nd strike extends this duration by X s...
- **Zenith > Sunder** *Skill upgrade*: Zenith sunders a rift in the ground with a single strike, Knocking Down enemies and dealing damage. After X second, the rift detonates for damage.
- **Aspect of Audacity** *Aspect*: Gain [10 – 15]% Damage Reduction against Close enemies. When there are at least 5 Close enemies, Stun them for [5 seconds. Can only occur once every 20 seconds.
- **Aspect of Binding Morass** *Aspect*: Close enemies or those you deal indirect damage to are Slowed by [50 – 70]% for 3 seconds. You deal [40 – 55]% increased damage to Slowed enemies.
- **Aspect of Concussive Strikes** *Aspect*: Your Daze effects last [20 – 40]%[+] longer. Dazing an enemy increases your Movement Speed by [20 – 40]%[+] for 3 seconds.
- **Aspect of Dazzling Light** *Aspect*: The first time you apply Judgement to an enemy, you Daze them for [1 – 3] seconds.
- **Aspect of Forward Momentum** *Aspect*: Your Knock Back and Pull effects grant you [25 – 35]%[x] Movement Speed for 4 seconds.
- **Aspect of Frosty Strides** *Aspect*: While below [45 – 60]% Life, Evade Freezes Close enemies, deals 6,000 Cold damage to them, and makes them Vulnerable for 3 seconds.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 10% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Stunned or Knocked Down enemies.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 20% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Distant enemies.
- **Aspect of Slaughter** *Aspect*: You gain [30 – 45]%[+] increased Movement Speed. Taking damage from Close enemies Slows you by 30% for 2 seconds.
- **Aspect of the Northern Guard** *Aspect*: Blocks have a [25 – 45]% chance to Freeze the attacker for 3 seconds.
- **Unrelenting** *Aspect*: Your Knock Downs cause enemies to take [50 – 65]%[x] damage from you for 6 seconds.
- **Azurewrath** (Sword) *Unique*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Eggis** (Shield) *Unique*: Blocking an attack has a chance to turn the attacker into a Feared chicken for [3 – 4] seconds.
- **Frostburn** (Gloves) *Unique*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Godslayer Crown** (Boots) *Unique*: When you Stun, Freeze, or Immobilize an Elite, you Pull In all Nearby enemies and deal 60%[x] increased damage to them for 3 seconds. Can only occur once every 12 seconds.Against Bosses, this effec...
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
- **Cathan's Righteous Will (2-piece)** *Talisman set*: • Enemies cower before you, becoming Feared and Immobilized for 0.5 seconds when they first see you or when you Block them.
- **Cathan's Righteous Will (3-piece)** *Talisman set*: • You reflect Stun and Knockback effects. • Your Minimum Resolve is increased by 2 and Maximum Resolve is increased by 2 and you gain 10%[+] Damage Reduction for each Minimum Resolve you have.
- **Control** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased damage to Crowd Controlled targets. / You deal 10%[x] increased damage to Slowed or Chilled enemies or, instead, 20%[x] increa...

### Pays it off (24)

- **Blessed Shield > Faith Generation** *Skill upgrade*: When Blessed Shield hits a Crowd Controlled enemy, gain X Faith.
- **Fortress > Rampart of Thorns** *Skill upgrade*: Enemies inside Fortress are Slowed by X and take X of your Thorns damage per second.
- **Aspect of Binding Morass** *Aspect*: Close enemies or those you deal indirect damage to are Slowed by [50 – 70]% for 3 seconds. You deal [40 – 55]% increased damage to Slowed enemies.
- **Aspect of Chastisement** *Aspect*: Your Juggernaut Skills deal [55 – 75]%[x] increased damage to Bosses and Crowd Controlled enemies.
- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Dominance** *Aspect*: Crowd Controlling an enemy has a 25% chance to generate [1 – 5] Resolve.
- **Aspect of Dominance** *Aspect*: Crowd Controlling an enemy grants [1 – 16] Resolve.
- **Aspect of Rallying Reversal** *Aspect*: When you Crowd Control an enemy or apply any Stagger to a Boss, gain 1 Ferocity and [10 – 15]% Damage Reduction for 4 seconds.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 10% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Stunned or Knocked Down enemies.
- **Aspect of Retribution** *Aspect*: Distant enemies have a 20% chance to be Stunned for 2 seconds when they hit you. You deal [15 – 30]%[x] increased damage to Distant enemies.
- **Aspect of Shared Misery** *Aspect*: Lucky Hit: When you hit a Crowd Controlled enemy, there is up to a [35 – 55]% chance for that Crowd Control effect to spread to another unaffected enemy.
- **Eluding** *Aspect*: Becoming Crowd Controlled grants you Unstoppable and [10 – 25]% Damage Reduction for 4 seconds. This effect has a 6 second Cooldown.
- **Everliving** *Aspect*: Each Crowd Controlled enemy Nearby grants [2 – 3.5]% Damage Reduction, up to 13 enemies.
- **Exploiter's** *Aspect*: You have 50%[+] increased Crowd Control Duration. While enemies are Unstoppable, you deal [30 – 50]%[x] increased damage to them.
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Vanquishing** *Aspect*: You deal [60 – 90]%[x] more damage to Incapacitated enemies.
- **Azurewrath** (Sword) *Unique*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Frostburn** (Gloves) *Unique*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Signet of Pelghain** (Ring) *Unique*: Your Freeze effects cause enemies to permanently take [10 – 15]%[x] increased Cold damage from you for each second they are Frozen.
- **Azurewrath** (Charm) *Unique charm*: After Freeze expires, enemies take [120 – 150]% of the damage you dealt to them while Frozen.
- **Frostburn** (Charm) *Unique charm*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Signet of Pelghain** (Charm) *Unique charm*: Your Freeze effects cause enemies to permanently take [10 – 15]%[x] increased Cold damage from you for each second they are Frozen.
- **Cathan's Righteous Will (5-piece)** *Talisman set*: • When you try to Crowd Control a worthy enemy, one that can't be Crowd Controlled, you rise to the occasion gaining 500%[x] increased damage for 15 seconds.
- **Control** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased damage to Crowd Controlled targets. / You deal 10%[x] increased damage to Slowed or Chilled enemies or, instead, 20%[x] increa...

## Movement

Moving, standing still, Unhindered, Unstoppable.


### Makes it happen (37)

- **Condemn** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Harness the Light and Pull enemies in after XX seconds, briefly Stunning them and dealing damage. While Casting Condemn, you become Unhindered for X seconds.
- **Defiance Aura** *Skill*: Faith Cost: Cooldown: seconds Lucky Hit Chance: [|%|] Passive: Your presence reinforces you and your allies, granting X Armor and X bonus on All Resistances. Active: You become Unstoppable for X se...
- **Rally** *Skill*: Charges: X Charge Cooldown: secondsHealth Cost:X Rally forth, generating X Faith and gaining X Movement Speed for seconds.
- **Advance > Unhindered** *Skill upgrade*: Casting Advance grants you Unhindered for seconds.
- **Aegis > Unstoppable** *Skill upgrade*: Casting Aegis grants Unstoppable for seconds.
- **Arbiter of Justice > Movement Speed** *Skill upgrade*: Arbiter form grants an additional X Movement Speed.
- **Condemn > Enhanced Condemn** *Skill upgrade*: While Casting Condemn, become Unhindered for X seconds.
- **Condemn > Movement Speed** *Skill upgrade*: Casting Condemn increases your Movement Speed by X for X seconds.
- **Defiance Aura > Unstoppable** *Skill upgrade*: Whenever you or an ally are Injured, they become Unstoppable for X seconds and gain X Resolve. This can only occur once every X seconds
- **Divine Lance > Enhanced Divine Lance** *Skill upgrade*: Divine Lance's damage is increased by X of your Movement Speed bonus. Current Bonus: X
- **Fortress > Unstoppable** *Skill upgrade*: While inside of your Fortress you are Unstoppable.
- **Rally > Enhanced Rally** *Skill upgrade*: Rally's increases your Movement Speed by an additional X and generates X additional Faith.
- **Rally > Unhindered and Movement Speed** *Skill upgrade*: Casting Rally's increases your Movement Speed by an additional X and grants Unhindered while active.
- **Zenith > Enhanced Zenith** *Skill upgrade*: While Zenith is active, you are Unstoppable.
- **Zenith > Unstoppable** *Skill upgrade*: While Zenith is active, you are Unstoppable.
- **Aspect of Concussive Strikes** *Aspect*: Your Daze effects last [20 – 40]%[+] longer. Dazing an enemy increases your Movement Speed by [20 – 40]%[+] for 3 seconds.
- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Forward Momentum** *Aspect*: Your Knock Back and Pull effects grant you [25 – 35]%[x] Movement Speed for 4 seconds.
- **Aspect of Holy Cadence** *Aspect*: When Judgement detonates you gain [25 – 35]%[x] increased Movement Speed for 8 seconds.
- **Aspect of Nebulous Brews** *Aspect*: Healing Potions grant [20 – 30]%[x] Movement Speed for 8 seconds. Every 80 meters you travel refills a Healing Potion.
- **Aspect of Slaughter** *Aspect*: You gain [30 – 45]%[+] increased Movement Speed. Taking damage from Close enemies Slows you by 30% for 2 seconds.
- **Aspect of Swift Spirit** *Aspect*: Losing Resolve grants [3 – 5]%[x] Movement Speed for 10 seconds, stacking up to 5 times.
- **Aspect of Unstoppable Force** *Aspect*: Gain [5 – 20]% Movement Speed. Double this bonus while Unhindered or Unstoppable.
- **Aspect of the Moonrise** *Aspect*: Damaging an enemy with a Basic Skill grants you 4% Attack Speed for 10 seconds, stacking up to 5 times. Upon reaching maximum stacks, you enter a Vampiric Bloodrage, gaining [40 – 60]%[x] Basic Ski...
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
- **Light's Epiphany (3-piece)** *Talisman set*: • While in Arbiter, gain 30% increased Maximum Life and 10%[x] increased Movement Speed

### Pays it off (23)

- **Condemn** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Harness the Light and Pull enemies in after XX seconds, briefly Stunning them and dealing damage. While Casting Condemn, you become Unhindered for X seconds.
- **Advance > Unhindered** *Skill upgrade*: Casting Advance grants you Unhindered for seconds.
- **Blessed Hammer > Cast Speed** *Skill upgrade*: Blessed Hammer gains X increased Cast Speed and its hammers travel X faster.
- **Blessed Shield > Shield of Retribution** *Skill upgrade*: Blessed Shield becomes a Juggernaut Skill. Blessed Shield travels straight without returning, pulsing X of your Thorns damage for X seconds before bursting for damage.
- **Brandish > Sword of Mastery** *Skill upgrade*: While Healthy, Brandish deals damage and travels X faster.
- **Condemn > Enhanced Condemn** *Skill upgrade*: While Casting Condemn, become Unhindered for X seconds.
- **Rally > Unhindered and Movement Speed** *Skill upgrade*: Casting Rally's increases your Movement Speed by an additional X and grants Unhindered while active.
- **Shield Bash > Distance** *Skill upgrade*: Shield Bash now travels farther.
- **Aspect of Alacrity** *Aspect*: Your Defensive and Mobility Skills gain [50 – 75]% Cooldown Rate while moving.
- **Aspect of Inner Calm** *Aspect*: While standing still, deal up to [50 – 75]%[x] increased damage.
- **Aspect of Nebulous Brews** *Aspect*: Healing Potions grant [20 – 30]%[x] Movement Speed for 8 seconds. Every 80 meters you travel refills a Healing Potion.
- **Aspect of Pilgrim's Progress** *Aspect*: Your Disciple Skills with Cooldowns generate up to [20 – 60] Faith based on how far your travel with them.
- **Aspect of Unstoppable Force** *Aspect*: Gain [5 – 20]% Movement Speed. Double this bonus while Unhindered or Unstoppable.
- **Ghostwalker** *Aspect*: While Unstoppable and for 4 seconds after, you gain [10 – 20]%[x] increased Movement Speed and are Unhindered.
- **Argent Veil** (Ring) *Unique*: Arbiter's Evade triggers a random equipped non-Channeled Core Skill for every 2 meters traveled. Core Skills deal [5 – 15]%[x] increased damage during Arbiter's Evade and for 4 seconds after.
- **March of the Stalwart Soul** (Boots) *Unique*: Advance deals [60 – 80]%[x] increased damage, gains 3 Skill Ranks, and travels twice as far.
- **Penitent Greaves** (Boots) *Unique*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Thousand-Eye Reaver** (Axe) *Unique*: Moving grants Ferocity, and Maximum Ferocity is increased by [2 – 4]. Ferocity also increases Movement Speed by [6 – 8]%[+] per stack.
- **Argent Veil** (Charm) *Unique charm*: Arbiter's Evade triggers a random equipped non-Channeled Core Skill for every 2 meters traveled. Core Skills deal [5 – 15]%[x] increased damage during Arbiter's Evade and for 4 seconds after.
- **Penitent Greaves** (Charm) *Unique charm*: You are permanently Unhindered and leave behind a trail of frost that Chills enemies. Your Chill effects cause enemies to take [10 – 15]%[x] increased damage from you.
- **Thousand-Eye Reaver** (Charm) *Unique charm*: Moving grants Ferocity, and Maximum Ferocity is increased by [2 – 4]. Ferocity also increases Movement Speed by [6 – 8]%[+] per stack.
- **Cathan's Dauntless Faith (5-piece)** *Talisman set*: • Zealot Skills deal 200%[x] increased damage. • Every 5 Stacks of Do or Die stores a Zealot Afterimage. Moving periodically spawns your stored Afterimages.
- **Relentless** *Paragon node*: While moving and for 2 seconds after, you deal 80%[x] increased damage and have 0%[+] Cooldown Reduction.

## Aura cast / Aura Potency

Casting an Aura skill, Aura Potency, Consecration.


### Makes it happen (14)

- **Consecration > Bastion** *Skill upgrade*: Consecration Immobilizes enemies and can be cast anywhere.
- **Consecration > Duration** *Skill upgrade*: Increase the duration of Consecration by X.
- **Consecration > Fortify** *Skill upgrade*: Consecration's initial Cast Fortifies you for X of Maximum Life ([Max(1,)|0|]) per enemy hit.
- **Consecration > Hallowed Ground** *Skill upgrade*: Consecration's size is increased by [(SF_9 / SF_10 - 1) * 100 |%|] While inside Consecration, you and your allies deal X additional damage and consume X less resource.
- **Consecration > Resource Generation** *Skill upgrade*: Consecration increases Primary Resource Generation for you and your allies by X.
- **Consecration > Sanctify** *Skill upgrade*: Consecration lasts X seconds, increasing its damage and Healing by X each second. Consecration detonates when it expires, dealing damage to all enemies and Healing you and your allies for X of thei...
- **Consecration > Weaken** *Skill upgrade*: Consecration Weakens enemies within.
- **Sanctis of Kethamar** (Amulet) *Unique*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Sundered Night** (Axe2H) *Unique*: Casting an Aura Skill triggers a Consecration beneath you. You gain [80 – 100]% Aura Potency while standing in Consecration.
- **Sanctis of Kethamar** (Charm) *Unique charm*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Sundered Night** (Charm) *Unique charm*: Casting an Aura Skill triggers a Consecration beneath you. You gain [80 – 100]% Aura Potency while standing in Consecration.
- **Cathan's Iron Conviction (2-piece)** *Talisman set*: • Gain 55% Aura Potency.
- **Cathan's Iron Conviction (5-piece)** *Talisman set*: • Gain Conviction Aura, increasing the damage Nearby enemies take from all sources by 0.5%[x] per Skill Rank you have in all your Aura Skills.
- **Resplendence** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / After casting an Aura Skill, the active cooldown of every Non-Aura skill is reduced by 2 seconds. / Increase damage by X.

### Pays it off (6)

- **Sanctis of Kethamar** (Amulet) *Unique*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Sundered Night** (Axe2H) *Unique*: Casting an Aura Skill triggers a Consecration beneath you. You gain [80 – 100]% Aura Potency while standing in Consecration.
- **Sanctis of Kethamar** (Charm) *Unique charm*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Sundered Night** (Charm) *Unique charm*: Casting an Aura Skill triggers a Consecration beneath you. You gain [80 – 100]% Aura Potency while standing in Consecration.
- **Cathan's Iron Conviction (2-piece)** *Talisman set*: • Gain 55% Aura Potency.
- **Resplendence** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / After casting an Aura Skill, the active cooldown of every Non-Aura skill is reduced by 2 seconds. / Increase damage by X.

## Cooldowns

Cooldown reduction and things that fire off cooldown skills.


### Makes it happen (20)

- **Falling Star > Cooldown Reduction** *Skill upgrade*: Killing a Vulnerable enemy reduces the Cooldown of Falling Star by X seconds.
- **Falling Star > Enhanced Falling Star** *Skill upgrade*: Killing a Vulnerable enemy reduces the cooldown of Falling Star by X second.
- **Holy Light Aura > Rite of Judgement** *Skill upgrade*: Holy Light's active also Judges enemies and its Cooldown is reduced per rank.
- **Purify > Sentence** *Skill upgrade*: Purify also Judges enemies and its cooldown is reduced by X seconds.
- **Aspect of Akarat's Blessing** *Aspect*: Blocks have a [10 – 17.5]% chance to reduce all Cooldowns by 1 second.
- **Aspect of Alacrity** *Aspect*: Your Defensive and Mobility Skills gain [50 – 75]% Cooldown Rate while moving.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill increases your Ultimate damage by [6 – 10]%[x], up to [60 – 100]%[x]. At 10 stacks, your Cooldowns and this bonus are reset.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill reduces the Cooldowns of your other Skills by [6.5 – 14] seconds.
- **Aspect of Assistance** *Aspect*: Your Reinforcement Cooldown is reduced by [22.5 – 32.5]%[x]. After casting your Ultimate Skill, your Reinforcement Mercenary is called. This cannot occur more than once each 30 seconds.
- **Aspect of Elusive Menace** *Aspect*: Your Dodge Chance increases by [20 – 35]%[+] whenever you take damage. Successfully Dodging resets this bonus.
- **Aspect of the Arbiter's Zephyr** *Aspect*: Arbiter's evade cooldown is reduced by [1 – 3] Seconds.
- **Aspect of the Orange Herald** *Aspect*: Cast Core Skill damage reduces the Cooldown of one of your Skills by [0.7 – 2.2] second.
- **Hectic** *Aspect*: After Casting 5 Basic Skills, one of your active Cooldowns is reduced by [3 – 6] seconds.
- **In-Geom** (Sword) *Unique*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Messerschmidt's Reaver** (Axe2H) *Unique*: Lucky Hit: Attacks have up to a [20 – 30]% chance to explode, dealing 12,000 Fire Damage and reducing your Cooldowns by 1 second.
- **Squirt's Blouse** (ChestArmor) *Unique*: While not taking damage, you take up to 50% more damage and deal up to [35 – 50]%[x] more damage. This bonus is reset upon getting hit.
- **In-Geom** (Charm) *Unique charm*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Squirt's Blouse** (Charm) *Unique charm*: While not taking damage, you take up to 50% more damage and deal up to [35 – 50]%[x] more damage. This bonus is reset upon getting hit.
- **Light's Epiphany (2-piece)** *Talisman set*: • Disciple Skills reduce the Cooldown of Arbiter of Justice by 0.1 seconds when they deal damage, or by 0.5 seconds if they have a Cooldown.
- **Relentless** *Paragon node*: While moving and for 2 seconds after, you deal 80%[x] increased damage and have 0%[+] Cooldown Reduction.

### Pays it off (2)

- **Rakanoth's Wake** (Boots) *Unique*: When you cast a Skill with a Cooldown, you explode, dealing [6,000 – 7,000] Fire damage.
- **Rakanoth's Wake** (Charm) *Unique charm*: When you cast a Skill with a Cooldown, you explode, dealing [6,000 – 7,000] Fire damage.

## Lucky Hit

Lucky Hit procs.


### Makes it happen (22)

- **Advance** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Advance forward with your weapon, dealing damage.
- **Arbiter of Justice** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Ascend to the heavens and crash upon the battlefield as an Arbiter for X seconds, dealing damage upon landing.
- **Blessed Hammer** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Throw a Blessed Hammer that spirals out, dealing damage.
- **Blessed Shield** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Bless and hurl your shield with Holy energy, dealing damage that ricochets up to X times.
- **Brandish** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Brandish the Light, unleashing an arc that deals damage.
- **Clash** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Strike an enemy with your weapon and shield, dealing damage. Striking enemies with Clash grants you Crusader's March, increasing your Block Cha...
- **Condemn** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Harness the Light and Pull enemies in after XX seconds, briefly Stunning them and dealing damage. While Casting Condemn, you become Unhindered for X seconds.
- **Consecration** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Bathe in the Light for seconds, Healing you and your allies for X Maximum Life ([Max(1,PlayerHealthMax() * X)]) per second and damaging enemies for damage ...
- **Defiance Aura** *Skill*: Faith Cost: Cooldown: seconds Lucky Hit Chance: [|%|] Passive: Your presence reinforces you and your allies, granting X Armor and X bonus on All Resistances. Active: You become Unstoppable for X se...
- **Divine Lance** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Impale enemies with a heavenly lance, stabbing X times for damage each.
- **Falling Star** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Soar into the air with angelic wings and dive onto the battlefield, dealing damage on takeoff and damage on landing.
- **Fortress** *Skill*: Cooldown: X seconds Lucky Hit Chance: [|%|] Make your stand, becoming Immune for [|1|] seconds and create a defensive area around you for X seconds. Standing in your Fortress grants you and your al...
- **Heaven's Fury** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Grasp the Light, dealing damage around you per second before releasing it to seek Nearby enemies and dealing damage per hit for X seconds.
- **Holy Bolt** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Throw a Holy hammer, dealing damage.
- **Holy Light Aura** *Skill*: Cooldown: seconds Lucky Hit Chance: % Passive: You and your allies emanate the Light, dealing damage every X seconds to X random Nearby enemies. Attack Speed further increases this damage. Active: ...
- **Purify** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Enshroud your enemies in the Light, Dazing them for seconds.
- **Shield Bash** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Charge at an enemy and bash in front of you, dealing damage.
- **Shield Charge** *Skill*: Faith Cost: plus 1 more per secondCooldown: seconds Lucky Hit Chance: [|%|] Charge with your shield and push enemies Back, granting X Armor and dealing damage while Channeling.
- **Spear of the Heavens** *Skill*: Faith Cost: Cooldown: seconds Lucky Hit Chance: % Rain down [1+X] heavenly spears from the sky, dealing damage and Knocking Down enemies for seconds. After X seconds, the spears burst, dealing damage.
- **Zeal** *Skill*: Health Cost:X Faith Cost: Lucky Hit Chance: [|%|] Strike enemies with blinding speed, dealing damage followed immediately by X additional strikes dealing damage each.
- **Zenith** *Skill*: Cooldown: seconds Lucky Hit Chance: % Summon a divine sword that cleaves the battlefield for damage. Casting Zenith again cuts through the battlefield for damage and Knocks Down enemies for seconds.
- **Aspect of Fortune** *Aspect*: You gain [15 – 22.5]%[x] Lucky Hit Chance against Elite enemies.

### Pays it off (26)

- **Aspect of Accursed Touch** *Aspect*: Lucky Hit: Up to a [30 – 45]% chance for your Skills to inflict Vampiric Curse on enemies. Enemies afflicted with Vampiric Curse are also Vulnerable.Vampiric Curse's stored souls deal [40 – 70]% in...
- **Aspect of Efficiency** *Aspect*: Lucky Hit: Cast Basic Skills have up to a [35 – 50]% chance to make your next Core Skill cost no Primary Resource, stacks up to 3 times.
- **Aspect of Exorcism ** *Aspect*: Lucky Hit: Up to a [30 – 45]% chance to Execute enemies.
- **Aspect of Militance** *Aspect*: Lucky Hit: Critically Striking has up to a 25% chance to Fortify for [0.25 – 0.5]% of your Maximum Life for each stack of Fervor you have.
- **Aspect of Salvation** *Aspect*: Lucky Hit: Critical Strikes with Zealot Skills have up to a 20% chance to restore [3 – 7] Faith.
- **Aspect of Shared Misery** *Aspect*: Lucky Hit: When you hit a Crowd Controlled enemy, there is up to a [35 – 55]% chance for that Crowd Control effect to spread to another unaffected enemy.
- **Lightning Rod** *Aspect*: Lucky Hit: Lightning damage has up to a 25% chance to deal [200 – 300]%[x] increased damage.
- **Lord of Blood's** *Aspect*: Lucky Hit: Up to a 20% chance to heal you for [1 – 9]% of your missing Life.
- **Lord of Blood's** *Aspect*: Lucky Hit: Zealot Skills have up to a 20% chance to heal you for [4 – 6]% of your missing Life.
- **Andariel's Visage** (Helm) *Unique*: Lucky Hit: Up to a 20% chance to trigger a poison nova that deals 40% of the damage dealt over 5 seconds to enemies in the area.
- **Bell of the Bovine** (Amulet) *Unique*: Lucky Hit: Up to a 30% chance to Moo when hitting an enemy.Lucky Moo: Up to a 50% chance to summon a Cow that explodes for [15,000 – 16,000] Fire damage. This damage is increased by 50% on Tuesdays.
- **Doombringer** (Sword) *Unique*: Lucky Hit: Up to a 40% chance to deal 20,000 Shadow damage to surrounding enemies and reduce their damage dealt by 25% for 5 seconds.
- **Frostburn** (Gloves) *Unique*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Griswold's Opus** (Sword) *Unique*: Dealing direct damage grants [80 – 100]%[x] increased Critical Strike Damage for each enemy hit within 10 seconds, up to [40 – 50]%[x].At Maximum you gain:Lucky Hit: Critical Strikes have up to a 5...
- **Herald's Morningstar** (Mace) *Unique*: Blessed Hammer deals [80 – 100]%[x] increased damage.Lucky Hit: Up to a 20% chance to spawn a base Blessed Hammer on the target hit.
- **Judicant's Glaivehelm** (Helm) *Unique*: Lucky Hit: Judicator Skills have up to a [30 – 40]% chance to call down a Blessed Spear that carries a Judgement mark and deals Judgement's damage on impact.
- **Messerschmidt's Reaver** (Axe2H) *Unique*: Lucky Hit: Attacks have up to a [20 – 30]% chance to explode, dealing 12,000 Fire Damage and reducing your Cooldowns by 1 second.
- **Wreath of Auric Laurel** (Ring) *Unique*: Lucky Hit: Holy Bolt has up to a 40% chance to trigger Purify. Purify causes enemies to take [45 – 55]%[x] increased damage from you for 4 seconds.
- **X'Fal's Corroded Signet** (Boots) *Unique*: Lucky Hit: Your damage over time effects have up to a 75% chance to erupt, dealing 26,000 damage of the same type to surrounding enemies.
- **Phoenix** (Axe) *Runeword*: Lucky Hit: Attacks have up to a [15 – 30]% chance to unleash a level 22 Fire Spear. When you level up, unleash a level 40 Ring of Fire.
- **Rain** (ChestArmor) *Runeword*: Lucky Hit: Attacks have up to a [15 – 30]% chance to unleash a Rank 15 Druid Tornado.50% Chance to unleash a Rank 15 Druid Cyclone Armor whenever you Dodge.
- **Andariel's Visage** (Charm) *Unique charm*: Lucky Hit: Up to a 20% chance to trigger a poison nova that deals 40% of the damage dealt over 5 seconds to enemies in the area.
- **Doombringer** (Charm) *Unique charm*: Lucky Hit: Up to a 40% chance to deal 20,000 Shadow damage to surrounding enemies and reduce their damage dealt by 25% for 5 seconds.
- **Frostburn** (Charm) *Unique charm*: Lucky Hit: Up to a 50% chance to Freeze enemies for 1 second.You deal [40 – 50]%[x] increased damage to Frozen enemies.
- **Griswold's Opus** (Charm) *Unique charm*: Dealing direct damage grants [80 – 100]%[x] increased Critical Strike Damage for each enemy hit within 10 seconds, up to [40 – 50]%[x].At Maximum you gain:Lucky Hit: Critical Strikes have up to a 5...
- **Judicant's Glaivehelm** (Charm) *Unique charm*: Lucky Hit: Judicator Skills have up to a [30 – 40]% chance to call down a Blessed Spear that carries a Judgement mark and deals Judgement's damage on impact.

## Critical Strikes

Crit chance feeds crit payoffs.


### Makes it happen (19)

- **Fanaticism Aura** *Skill*: Faith Cost: Cooldown: seconds Passive: Spending Faith emanates power from you, granting you and your allies X Attack Speed and X Critical Strike Chance for X seconds up to a maximum of X times. Act...
- **Advance > Critical Strike Chance** *Skill upgrade*: Advance grants X Critical Strike Chance for X seconds.
- **Clash > Skirmish** *Skill upgrade*: Clash becomes a Zealot Skill and cleaves in an area for damage. Crusaders March no longer grants Block Chance or Resolve, instead granting X Critical Strike Chance up to X.
- **Rally > Critical Strike Chance** *Skill upgrade*: Casting Rally increases your Critical Strike Chance by X while active.
- **Zeal > Critical Strike Chance** *Skill upgrade*: Zeal has an additional X Critical Strike Chance. Double this bonus against Weakened enemies.
- **Zeal > Death or Glory** *Skill upgrade*: Zeal costs X Maximum Life instead of Faith and strikes around you in a circle. Whenever you lose Life, Zeal's damage increases by X and Critical Strike Chance by X for X seconds.
- **Zenith > Critical Strike Chance** *Skill upgrade*: Casting Zenith increases your X Critical Strike Chance for seconds.
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Squire's** *Aspect*: Basic Skills increase the Critical Strike Chance of your Core Skills by [10 – 20]% for 5 seconds, up to 3 times.
- **The Penitent's** *Aspect*: Spending Health on a Skill grants you [5 – 15]% Critical Strike Chance and [35 – 55]%[x] Critical Strike Damage for 0 seconds.
- **Heir of Perdition** (Helm) *Unique*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **Locran's Talisman** (Amulet) *Unique*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **Locran's Talisman** (Boots) *Unique*: Your Skills gain 0.4%[+] Critical Strike Chance per point of Primary Resource you have when cast, up to 40%[+]. Each point of Primary Resource above 100 grants Skills 0.2%[x] Critical Strike Damage...
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **Heir of Perdition** (Charm) *Unique charm*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **Locran's Talisman** (Charm) *Unique charm*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **Fervent** *Paragon node*: You gain 35%[x] increased Critical Strike damage and 3%[+] Critical Strike chance for each stack of Fervor you have.
- **Honed** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 1 Faith. / Increase Critical Strike Damage by X.

### Pays it off (20)

- **Divine Lance > Zealous Joust** *Skill upgrade*: Divine Lance becomes a Zealot Skill. Divine Lance now stabs with X additional spears in a wider area, dealing damage each and has X increased Critical Strike Damage.
- **Fanaticism Aura > Rite of Vengeance** *Skill upgrade*: Fanaticism Aura Passive increases Critical Strike Damage by X for you and your allies. Critical Strikes trigger Fanaticism's Passive.
- **Zenith > Empyrean Edge** *Skill upgrade*: Zenith is now also a Mobility Skill that: Dashes to enemies Gains X Critical Strike Damage
- **Accelerating** *Aspect*: Critical Strikes with Core Skills increase your Attack Speed by [30 – 50]%[+] for 5 seconds.
- **Aspect of Jacques' Fervor** *Aspect*: Each stack of Fervor grants you [15 – 20]%[x] bonus Critical Strike Damage.
- **Aspect of Redirected Force** *Aspect*: Gain increased Critical Strike Damage equal to [40 – 60]%[x] of your Block Chance. Blocking doubles this bonus for 10 seconds.
- **Aspect of Salvation** *Aspect*: Lucky Hit: Critical Strikes with Zealot Skills have up to a 20% chance to restore [3 – 7] Faith.
- **The Penitent's** *Aspect*: Spending Health on a Skill grants you [5 – 15]% Critical Strike Chance and [35 – 55]%[x] Critical Strike Damage for 0 seconds.
- **Wind Striker** *Aspect*: Critical Strikes grant [30 – 50]%[+] Movement Speed for 1 second, up to 6 seconds.
- **Griswold's Opus** (Sword) *Unique*: Dealing direct damage grants [80 – 100]%[x] increased Critical Strike Damage for each enemy hit within 10 seconds, up to [40 – 50]%[x].At Maximum you gain:Lucky Hit: Critical Strikes have up to a 5...
- **Locran's Talisman** (Amulet) *Unique*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **Locran's Talisman** (Boots) *Unique*: Your Skills gain 0.4%[+] Critical Strike Chance per point of Primary Resource you have when cast, up to 40%[+]. Each point of Primary Resource above 100 grants Skills 0.2%[x] Critical Strike Damage...
- **The Grandfather** (Sword2H) *Unique*: Increases your Critical Strike Damage by 120%[x].
- **Griswold's Opus** (Charm) *Unique charm*: Dealing direct damage grants [80 – 100]%[x] increased Critical Strike Damage for each enemy hit within 10 seconds, up to [40 – 50]%[x].At Maximum you gain:Lucky Hit: Critical Strikes have up to a 5...
- **Locran's Talisman** (Charm) *Unique charm*: Critical Strikes deal [80 – 100]%[x] increased damage but your Critical Strike Chance is reduced by 50%[+].
- **The Grandfather** (Charm) *Unique charm*: Increases your Critical Strike Damage by 120%[x].
- **Cathan's Dauntless Faith (2-piece)** *Talisman set*: • Casting Zealot Skills grants Do or Die on hit, increasing your Critical Strike damage by 2.5%[x] and Cast Speed by 0.4%[+] for 2 seconds, stacking up to 25 times.
- **Fervent** *Paragon node*: You gain 35%[x] increased Critical Strike damage and 3%[+] Critical Strike chance for each stack of Fervor you have.
- **Honed** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 1 Faith. / Increase Critical Strike Damage by X.
- **Spirit** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased Critical Strike Damage. / Critical Strikes increase the damage an enemy takes from you by 3%[x] for 20 seconds, up to 12%[x]. / I...

## Resolve, Fortify, Barrier

Juggernaut Resolve and the defensive states.


### Makes it happen (26)

- **Fortress** *Skill*: Cooldown: X seconds Lucky Hit Chance: [|%|] Make your stand, becoming Immune for [|1|] seconds and create a defensive area around you for X seconds. Standing in your Fortress grants you and your al...
- **Advance > Wave Dash** *Skill upgrade*: Advance becomes a Juggernaut Skill. Advance's impact waves out, dealing damage and gains X Resolve for every 1 meter you dash.
- **Aegis > Stay Resolute** *Skill upgrade*: Passive: Gaining or spending Resolve has a X% chance to trigger a free Aegis. Casting Aegis grants X stacks of Resolve.
- **Clash > Resolve** *Skill upgrade*: Striking an enemy with Clash grants X stacks of Resolve.
- **Clash > Skirmish** *Skill upgrade*: Clash becomes a Zealot Skill and cleaves in an area for damage. Crusaders March no longer grants Block Chance or Resolve, instead granting X Critical Strike Chance up to X.
- **Defiance Aura > Rite of Might** *Skill upgrade*: Defiance Aura's increases your damage by X for X seconds whenever you gain Resolve.
- **Defiance Aura > Rite of Prayer** *Skill upgrade*: Defiance Aura's passive also Heals you and your allies for X of your Maximum Life ([Max(1,PlayerHealthMax() * X)]) per second. Healing yourself and allies grants X stacks of Resolve every X second.
- **Defiance Aura > Unstoppable** *Skill upgrade*: Whenever you or an ally are Injured, they become Unstoppable for X seconds and gain X Resolve. This can only occur once every X seconds
- **Fanaticism Aura > Rite of Redemption** *Skill upgrade*: Weakened enemies who die within Fanaticism Aura's radius Heal you for X and Fortify for X of your Maximum Life ([Max(1,PlayerHealthMax() * X)]).
- **Fortress > Resolve Damage Bonus** *Skill upgrade*: While inside of your Fortress you gain X damage per stack of Resolve.
- **Shield Bash > Lay Siege** *Skill upgrade*: Whenever you have Resolve, Shield Bash increases impact size by X and deals damage. Gain X Resolve per enemy hit.
- **Shield Charge > Resolve** *Skill upgrade*: Shield Charge grants X Resolve whenever it hits an enemy.
- **Aspect of Coagulation** *Aspect*: Gain 30%[+] increased Fortify generation and [15 – 23]% Damage Reduction while Fortified.
- **Aspect of Dominance** *Aspect*: Crowd Controlling an enemy has a 25% chance to generate [1 – 5] Resolve.
- **Aspect of Dominance** *Aspect*: Crowd Controlling an enemy grants [1 – 16] Resolve.
- **Aspect of Militance** *Aspect*: Lucky Hit: Critically Striking has up to a 25% chance to Fortify for [0.25 – 0.5]% of your Maximum Life for each stack of Fervor you have.
- **Aspect of Valiance** *Aspect*: Valor Skills generate [1 – 6] Resolve when cast.
- **Aspect of the Deflecting Barrier** *Aspect*: You have a [10 – 25]% chance after taking direct damage to gain a Barrier equal to 20% of your Maximum Life for 10 seconds. This chance is doubled against Distant enemies.
- **Aspect of the Protector** *Aspect*: Damaging an Elite enemy grants you a Barrier for [70 – 100]% of your Maximum Life for 10 seconds. This effect can only happen once every 20 seconds.
- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Shroud of False Death** (ChestArmor) *Unique*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Soulbrand** (ChestArmor) *Unique*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Temerity** (Legs) *Unique*: Effects that Heal you beyond 100% Life grant you Barrier equal to [80 – 100]% of the overhealed amount that lasts for 8 seconds. You may now drink your Healing Potion while at full Life.
- **Shroud of False Death** (Charm) *Unique charm*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Soulbrand** (Charm) *Unique charm*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Temerity** (Charm) *Unique charm*: Effects that Heal you beyond 100% Life grant you Barrier equal to [80 – 100]% of the overhealed amount that lasts for 8 seconds. You may now drink your Healing Potion while at full Life.

### Pays it off (13)

- **Fortress** *Skill*: Cooldown: X seconds Lucky Hit Chance: [|%|] Make your stand, becoming Immune for [|1|] seconds and create a defensive area around you for X seconds. Standing in your Fortress grants you and your al...
- **Aspect of Coagulation** *Aspect*: Gain 30%[+] increased Fortify generation and [15 – 23]% Damage Reduction while Fortified.
- **Aspect of Glynn's Anvil** *Aspect*: Your maximum Resolve is increased by 2 and you gain [2.5 – 4]% Damage Reduction per Resolve, up to [25 – 40]%.
- **Aspect of Interdiction** *Aspect*: Gain [2 – 3]%[+] Block Chance per Resolve stack.
- **Aspect of the Juggernaut's Covenant** *Aspect*: Consuming Resolve stacks with Juggernaut Oath grants an additional [60 – 100]%[x] damage.
- **Conceited** *Aspect*: Deal [40 – 60]%[x] increased damage while you have a Barrier active.
- **Crushing** *Aspect*: While Fortified, you deal [45 – 65]%[x] increased damage.
- **Vulpine's** *Aspect*: Gain [15 – 30] Primary Resource per second while you have a Barrier.
- **Soulbrand** (ChestArmor) *Unique*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Soulbrand** (Charm) *Unique charm*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Cathan's Righteous Will (3-piece)** *Talisman set*: • You reflect Stun and Knockback effects. • Your Minimum Resolve is increased by 2 and Maximum Resolve is increased by 2 and you gain 10%[+] Damage Reduction for each Minimum Resolve you have.
- **Endure** *Paragon node*: You deal 90%[x] increased damage while Fortified.
- **Undaunted** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Fortified. / You gain up to 15% Damage Reduction the more Fortify you have. / Increase damage by X.

## Judgement

Applying, spreading and detonating Judgement.


### Makes it happen (16)

- **Holy Light Aura** *Skill*: Cooldown: seconds Lucky Hit Chance: % Passive: You and your allies emanate the Light, dealing damage every X seconds to X random Nearby enemies. Attack Speed further increases this damage. Active: ...
- **Aegis > Faith Is My Shield** *Skill upgrade*: Aegis now applies Judgement instead of Taunting enemies. Blocking while Aegis is active applies Judgement to the attacker.
- **Arbiter of Justice > Reach of the Law** *Skill upgrade*: Arbiter's Wing Strikes now apply Judgement to enemies.
- **Holy Light Aura > Rite of Mercy** *Skill upgrade*: Holy Light's active chains X more times and Fortifies you and your allies for X of their Maximum Life ([Max(1,PlayerHealthMax() * X)]).
- **Holy Light Aura > Rite of Submission** *Skill upgrade*: Holy Light's active now Stuns enemies for seconds and deals damage in an area if the enemy dies during this effect.
- **Aspect of Dazzling Light** *Aspect*: The first time you apply Judgement to an enemy, you Daze them for [1 – 3] seconds.
- **Aspect of Firm Decree** *Aspect*: Judging an enemy grants you [20 – 35]% Damage Reduction for 8 seconds.
- **Aspect of Proselytizing** *Aspect*: Judicator Skills have a 40% chance to chain to a Close enemy for [50 – 150]%[x] of their damage. If no enemy is within range, damage the initial target instead.
- **Aspect of Watkins' Law** *Aspect*: Your Judicator Skills deal [45 – 65]%[x] increased damage against enemies affected by Judgement, then consume and reapply Judgement. Consuming and reapplying can only happen once every 3 seconds pe...
- **Judicant's Glaivehelm** (Helm) *Unique*: Lucky Hit: Judicator Skills have up to a [30 – 40]% chance to call down a Blessed Spear that carries a Judgement mark and deals Judgement's damage on impact.
- **Infinity** (Axe2H) *Runeword*: 50% Chance to unleash a Rank 10 Sorcerer Chain Lightning when you kill an enemy. You gain the Rank 11 passive of Druid's Cyclone Armor. Close enemies are Vulnerable and take 62.5%[x] more damage fr...
- **Judicant's Glaivehelm** (Charm) *Unique charm*: Lucky Hit: Judicator Skills have up to a [30 – 40]% chance to call down a Blessed Spear that carries a Judgement mark and deals Judgement's damage on impact.
- **Heaven's Radiant Fire (2-piece)** *Talisman set*: • Judgement now spreads to targets that don't have it and Judging enemies grants Judgement Day, increasing your damage by 12.5%[x] for 10 seconds, up to 5 times.
- **Heaven's Radiant Fire (5-piece)** *Talisman set*: •Judgement Day's damage bonus is increased to 25%[x] and its maximum number of stacks is increased to 20. Judging a Boss grants 5 stacks of Judgement Day.
- **Sentencing** *Paragon node*: Judging an enemy causes them to take 90%[x] more damage from you until they die.
- **Law** [Strength] *Glyph*: For every 5 Strength purchased within range, your Judgement deals X increased damage. / Judging an enemy causes them to take 15%[x] damage from you for 5 seconds. / Increase damage by X.

### Pays it off (18)

- **Blessed Shield > Shield of Justice** *Skill upgrade*: Blessed Shield detonates Judgement and ricochets X additional times. Whenever Blessed Shield detonates Judgement, it empowers your next throw to deal X increased damage, up to a maximum of X times ...
- **Holy Light Aura > Judgement Damage Bonus** *Skill upgrade*: Holy Light Aura's deals X increased damage against enemies affected by Judgement.
- **Shield Charge > Virtuous Charge** *Skill upgrade*: Shield Charge becomes a Judicator Skill and consumes Judgement on impact, increasing the ending nova damage by X for each Judgement consumed up to X. When Shield Charge ends you release a Holy nova...
- **Spear of the Heavens > Cooldown Reduction** *Skill upgrade*: Consuming Judgement reduces Spear of the Heavens active cooldown by X seconds.
- **Spear of the Heavens > Judgement Damage Bonus** *Skill upgrade*: Spear of the Heavens deals X increased damage against enemies affected by Judgement.
- **Aspect of Contemplation** *Aspect*: Every time you consume Judgement, reduce one of your active Cooldowns by [0.1 – 0.2] seconds.
- **Aspect of Dedication** *Aspect*: Gain [5 – 25] Faith every 10 times you consume Judgement.
- **Aspect of Holy Cadence** *Aspect*: When Judgement detonates you gain [25 – 35]%[x] increased Movement Speed for 8 seconds.
- **Aspect of Watkins' Law** *Aspect*: Your Judicator Skills deal [45 – 65]%[x] increased damage against enemies affected by Judgement, then consume and reapply Judgement. Consuming and reapplying can only happen once every 3 seconds pe...
- **Aspect of the Golden Hour** *Aspect*: Judgement detonations can detonate other Judgements early. Judgement deals [60 – 100]%[x] increased damage.
- **Aspect of the Light's Mending** *Aspect*: Consuming Judgement has a 10% chance to restore [1 – 2.5]% of your Maximum Life to you and nearby allies.
- **Aspect of the Light's Mending** *Aspect*: Consuming Judgement Heals [2.5 – 5.5]% of your Maximum Life to you and Nearby Allies.
- **Cathedral's Song** (Shield) *Unique*: Consuming Judgement 100 times calls down Spear of the Heavens on a random enemy. Judgement on Bosses counts as 10.Your Spear of the Heavens damage is increased by [80 – 100]%[x].
- **Seal of the Second Trumpet** (Ring) *Unique*: Judgement deals [100 – 150]%[x] increased damage and has a 33% chance to explode twice when using the Judicator Oath.
- **Cathedral's Song** (Charm) *Unique charm*: Consuming Judgement 100 times calls down Spear of the Heavens on a random enemy. Judgement on Bosses counts as 10.Your Spear of the Heavens damage is increased by [80 – 100]%[x].
- **Seal of the Second Trumpet** (Charm) *Unique charm*: Judgement deals [100 – 150]%[x] increased damage and has a 33% chance to explode twice when using the Judicator Oath.
- **Heaven's Radiant Fire (3-piece)** *Talisman set*: • You gain 30% Damage Reduction and Heal for 2.5% of your Maximum Life every second while affected by Judgement Day.
- **Law** [Strength] *Glyph*: For every 5 Strength purchased within range, your Judgement deals X increased damage. / Judging an enemy causes them to take 15%[x] damage from you for 5 seconds. / Increase damage by X.

## Arbiter form

Entering Arbiter form and Wing Strikes.


### Makes it happen (14)

- **Arbiter of Justice > Cooldown Reduction** *Skill upgrade*: Reduce Arbiter of Justice's Cooldown by X seconds.
- **Arbiter of Justice > Divine Intervention** *Skill upgrade*: Arbiter of Justice ascends for an additional X seconds and rains Blessed Spears on the battlefield. Upon landing, Arbiter of Justice bombards the battlefield with X additional Blessed Spears, apply...
- **Arbiter of Justice > Enhanced Arbiter of Justice** *Skill upgrade*: Arbiter form's Wing Strikes recast time is reduced by X seconds.
- **Arbiter of Justice > Movement Speed** *Skill upgrade*: Arbiter form grants an additional X Movement Speed.
- **Arbiter of Justice > Seraph's Wings** *Skill upgrade*: Arbiter form gains the following benefits: Wing Strikes deal X increased damage Wing Strikes apply Vulnerable
- **Arbiter of Justice > Wing Strike Recast** *Skill upgrade*: Arbiter form's Wing Strikes recast time is reduced by X seconds.
- **Aspect of Angelic Masterwork** *Aspect*: Your All Resistance is increased by [100 – 140]% while in Arbiter form.
- **Aspect of Ascension** *Aspect*: Casting a Skill that grants Arbiter form increases your damage by [5 – 7]%[x], stacking up to 10 times. All stacks are lost when leaving Arbiter form.
- **Judgment of Auriel** (Amulet) *Unique*: Arbiter of Justice gains all Variants and grants you [53.33 – 66.6]%[x] increased damage and Damage Reduction for each Skill Rank it has while in Arbiter form. This bonus doubles for 30 seconds aft...
- **Sanctis of Kethamar** (Amulet) *Unique*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Sanctis of Kethamar** (Charm) *Unique charm*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Light's Epiphany (2-piece)** *Talisman set*: • Disciple Skills reduce the Cooldown of Arbiter of Justice by 0.1 seconds when they deal damage, or by 0.5 seconds if they have a Cooldown.
- **Light's Epiphany (5-piece)** *Talisman set*: • When you Cast Arbiter of Justice, unleash all Ultimates, triggering Heaven's Fury and Fortress and replacing Arbiter of Justice with Zenith for 10 seconds. • Gain 500%[x] increased damage with Di...
- **Arbiter** [Willpower] *Glyph*: For every 5 Willpower purchased within range, your Arbiter Wing Attacks deal X increased damage. / You deal 3%[x] increased damage for each second you've been in Arbiter form, up to 18%[x]. / You d...

### Pays it off (15)

- **Arbiter of Justice > Enhanced Arbiter of Justice** *Skill upgrade*: Arbiter form's Wing Strikes recast time is reduced by X seconds.
- **Arbiter of Justice > Movement Speed** *Skill upgrade*: Arbiter form grants an additional X Movement Speed.
- **Arbiter of Justice > Reach of the Law** *Skill upgrade*: Arbiter's Wing Strikes now apply Judgement to enemies.
- **Arbiter of Justice > Seraph's Wings** *Skill upgrade*: Arbiter form gains the following benefits: Wing Strikes deal X increased damage Wing Strikes apply Vulnerable
- **Arbiter of Justice > Wing Strike Recast** *Skill upgrade*: Arbiter form's Wing Strikes recast time is reduced by X seconds.
- **Aspect of Angelic Masterwork** *Aspect*: Your All Resistance is increased by [100 – 140]% while in Arbiter form.
- **Aspect of Ascension** *Aspect*: Casting a Skill that grants Arbiter form increases your damage by [5 – 7]%[x], stacking up to 10 times. All stacks are lost when leaving Arbiter form.
- **Aspect of Celestial Strife** *Aspect*: While in Arbiter, kills grant [1 – 1.5]%[x] increased Vulnerable damage, up to a maximum of [50 – 75]%[x].
- **Aspect of Tyrael's Jurisdiction** *Aspect*: Arbiter's Wing Strikes now seek nearby enemies and deal [160 – 240]%[x] increased damage.
- **Judgment of Auriel** (Amulet) *Unique*: Arbiter of Justice gains all Variants and grants you [53.33 – 66.6]%[x] increased damage and Damage Reduction for each Skill Rank it has while in Arbiter form. This bonus doubles for 30 seconds aft...
- **Sanctis of Kethamar** (Amulet) *Unique*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Sanctis of Kethamar** (Charm) *Unique charm*: Arbiter form increases Aura Potency by 30% and Wing Strike damage by [86.7 – 100]%[x]
- **Light's Epiphany (3-piece)** *Talisman set*: • While in Arbiter, gain 30% increased Maximum Life and 10%[x] increased Movement Speed
- **Divinity** *Paragon node*: While in Arbiter you deal 0%[x] increased damage to Vulnerable enemies.
- **Arbiter** [Willpower] *Glyph*: For every 5 Willpower purchased within range, your Arbiter Wing Attacks deal X increased damage. / You deal 3%[x] increased damage for each second you've been in Arbiter form, up to 18%[x]. / You d...

## Thorns and Retribution

Thorns damage and Retribution procs.


### Makes it happen (22)

- **Aegis > Impunity** *Skill upgrade*: While Aegis is active, you gain X Thorns and Retribution Chance.
- **Blessed Shield > Shield of Retribution** *Skill upgrade*: Blessed Shield becomes a Juggernaut Skill. Blessed Shield travels straight without returning, pulsing X of your Thorns damage for X seconds before bursting for damage.
- **Clash > Punishment** *Skill upgrade*: You are emboldened during Crusader's March, granting: X Retribution Chance X Thorns X Thorns damage
- **Defiance Aura > Rite of Thorns** *Skill upgrade*: Defiance Aura's passive also grants X Thorns and increases you and your allies' Thorns by X. Defiance Aura's active instead releases a nova dealing X of your Thorns damage.
- **Fortress > Rampart of Thorns** *Skill upgrade*: Enemies inside Fortress are Slowed by X and take X of your Thorns damage per second.
- **Shield Bash > Breach** *Skill upgrade*: Hits with Shield Bash grant you X Retribution Chance for X seconds, stacking up to X times.
- **Shield Charge > Retribution** *Skill upgrade*: Shield Charge grants X Retribution chance while charging when you hit an enemy up to X.
- **Aspect of Barbed Roses** *Aspect*: Thorns damage is increased by up to [100 – 120]%, based on how Injured you are.
- **Aspect of Excellence** *Aspect*: Losing 8 Resolve grants [30 – 50]% increased Retribution chance for 10 seconds.Retribution gains 50%[+] increased Size.
- **Aspect of Lapa's Scripture** *Aspect*: Losing Resolve grants you [427 – 783] Thorns for 10 seconds. Stacks up to 20 times.
- **Aspect of Spiked Armor** *Aspect*: Gain [40 – 60]%[+] increased Total Armor, 2,033 Thorns, and 15%[+] increased Block Chance.
- **Aspect of Verdant Restoration** *Aspect*: Thorns damage heals you for [0.2 – 0.4]% of your Maximum Life.
- **Bristleback** *Aspect*: When you Dodge or Block an attack you trigger a [200 – 300]% Thorns attack against the attacker.
- **Bruiser's** *Aspect*: Gain 4%[+] increased Armor and [163 – 569] Thorns per 1% missing Maximum Life.
- **Needleflare** *Aspect*: Thorns damage dealt has a [40 – 60]% chance to deal damage to all enemies around you and your Minions.
- **Sticker-thought** *Aspect*: Gain [2,033 – 6,100] Thorns while Channeling and for 3 seconds afterwards.
- **Herald of Zakarum** (Shield) *Unique*: Gain [40 – 50]% increased Strength, Resistance, Armor and Retribution Chance.Retribution gains 50%[+] increased Size.
- **Razorplate** (ChestArmor) *Unique*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Herald of Zakarum** (Charm) *Unique charm*: Gain [40 – 50]% increased Strength, Resistance, Armor and Retribution Chance.Retribution gains 50%[+] increased Size.
- **Razorplate** (Charm) *Unique charm*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Retribution** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / Retribution gains 10%[x] increased damage and 50%[+] increased Size. / Increase damage by X.
- **Revenge** [Intelligence] *Glyph*: Grants +X bonus to all Rare nodes within range. / Dealing Thorns damage to an enemy increases all damage it takes from you by 1%[x], up to 15%[x], for 10 seconds. / Increase damage by X.

### Pays it off (16)

- **Aegis > Impunity** *Skill upgrade*: While Aegis is active, you gain X Thorns and Retribution Chance.
- **Blessed Shield > Shield of Retribution** *Skill upgrade*: Blessed Shield becomes a Juggernaut Skill. Blessed Shield travels straight without returning, pulsing X of your Thorns damage for X seconds before bursting for damage.
- **Clash > Punishment** *Skill upgrade*: You are emboldened during Crusader's March, granting: X Retribution Chance X Thorns X Thorns damage
- **Defiance Aura > Rite of Thorns** *Skill upgrade*: Defiance Aura's passive also grants X Thorns and increases you and your allies' Thorns by X. Defiance Aura's active instead releases a nova dealing X of your Thorns damage.
- **Fortress > Rampart of Thorns** *Skill upgrade*: Enemies inside Fortress are Slowed by X and take X of your Thorns damage per second.
- **Shield Bash > Breach** *Skill upgrade*: Hits with Shield Bash grant you X Retribution Chance for X seconds, stacking up to X times.
- **Shield Charge > Retribution** *Skill upgrade*: Shield Charge grants X Retribution chance while charging when you hit an enemy up to X.
- **Aspect of Barbed Roses** *Aspect*: Thorns damage is increased by up to [100 – 120]%, based on how Injured you are.
- **Aspect of Excellence** *Aspect*: Losing 8 Resolve grants [30 – 50]% increased Retribution chance for 10 seconds.Retribution gains 50%[+] increased Size.
- **Aspect of Verdant Restoration** *Aspect*: Thorns damage heals you for [0.2 – 0.4]% of your Maximum Life.
- **Needleflare** *Aspect*: Thorns damage dealt has a [40 – 60]% chance to deal damage to all enemies around you and your Minions.
- **Herald of Zakarum** (Shield) *Unique*: Gain [40 – 50]% increased Strength, Resistance, Armor and Retribution Chance.Retribution gains 50%[+] increased Size.
- **Razorplate** (ChestArmor) *Unique*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Herald of Zakarum** (Charm) *Unique charm*: Gain [40 – 50]% increased Strength, Resistance, Armor and Retribution Chance.Retribution gains 50%[+] increased Size.
- **Razorplate** (Charm) *Unique charm*: Thorns has a 30% chance to deal [200 – 250]%[x] increased damage.
- **Revenge** [Intelligence] *Glyph*: Grants +X bonus to all Rare nodes within range. / Dealing Thorns damage to an enemy increases all damage it takes from you by 1%[x], up to 15%[x], for 10 seconds. / Increase damage by X.

## Faith

Paladin's resource.


### Makes it happen (13)

- **Advance** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Advance forward with your weapon, dealing damage.
- **Brandish** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Brandish the Light, unleashing an arc that deals damage.
- **Clash** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Strike an enemy with your weapon and shield, dealing damage. Striking enemies with Clash grants you Crusader's March, increasing your Block Cha...
- **Holy Bolt** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Throw a Holy hammer, dealing damage.
- **Blessed Shield > Faith Generation** *Skill upgrade*: When Blessed Shield hits a Crowd Controlled enemy, gain X Faith.
- **Brandish > Faith Generation** *Skill upgrade*: Brandish generates X additional Faith.
- **Clash > Faith Generation** *Skill upgrade*: Clash generates X additional Faith.
- **Purify > Faith Generation** *Skill upgrade*: Purify generates X Faith for each enemy it hits.
- **Rally > Enhanced Rally** *Skill upgrade*: Rally's increases your Movement Speed by an additional X and generates X additional Faith.
- **Rally > Words of Rejuvenation** *Skill upgrade*: Rally generates X more Faith and gains X additional Charge.
- **Aspect of Dedication** *Aspect*: Gain [5 – 25] Faith every 10 times you consume Judgement.
- **Aspect of Salvation** *Aspect*: Lucky Hit: Critical Strikes with Zealot Skills have up to a 20% chance to restore [3 – 7] Faith.
- **Honed** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 1 Faith. / Increase Critical Strike Damage by X.

### Pays it off (15)

- **Advance** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Advance forward with your weapon, dealing damage.
- **Blessed Hammer** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Throw a Blessed Hammer that spirals out, dealing damage.
- **Blessed Shield** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Bless and hurl your shield with Holy energy, dealing damage that ricochets up to X times.
- **Brandish** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Brandish the Light, unleashing an arc that deals damage.
- **Clash** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Strike an enemy with your weapon and shield, dealing damage. Striking enemies with Clash grants you Crusader's March, increasing your Block Cha...
- **Defiance Aura** *Skill*: Faith Cost: Cooldown: seconds Lucky Hit Chance: [|%|] Passive: Your presence reinforces you and your allies, granting X Armor and X bonus on All Resistances. Active: You become Unstoppable for X se...
- **Divine Lance** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Impale enemies with a heavenly lance, stabbing X times for damage each.
- **Fanaticism Aura** *Skill*: Faith Cost: Cooldown: seconds Passive: Spending Faith emanates power from you, granting you and your allies X Attack Speed and X Critical Strike Chance for X seconds up to a maximum of X times. Act...
- **Holy Bolt** *Skill*: Faith Cost: Generate Faith: X Lucky Hit Chance: [|%|] Throw a Holy hammer, dealing damage.
- **Shield Bash** *Skill*: Faith Cost: Lucky Hit Chance: [|%|] Charge at an enemy and bash in front of you, dealing damage.
- **Shield Charge** *Skill*: Faith Cost: plus 1 more per secondCooldown: seconds Lucky Hit Chance: [|%|] Charge with your shield and push enemies Back, granting X Armor and dealing damage while Channeling.
- **Spear of the Heavens** *Skill*: Faith Cost: Cooldown: seconds Lucky Hit Chance: % Rain down [1+X] heavenly spears from the sky, dealing damage and Knocking Down enemies for seconds. After X seconds, the spears burst, dealing damage.
- **Zeal** *Skill*: Health Cost:X Faith Cost: Lucky Hit Chance: [|%|] Strike enemies with blinding speed, dealing damage followed immediately by X additional strikes dealing damage each.
- **Shield Charge > Relentless Charge** *Skill upgrade*: Shield Charge becomes a Core Skill that deals damage. Shield Charge now costs X Faith to Cast and an additional X Faith per second.
- **Ward of the White Dove** (Shield) *Unique*: Blessed Shield deals [77 – 99]%[x] increased damage. Casting another Skill makes your next 3 Blessed Shields double this bonus and cost 7 less Faith to Cast.

## Healthy, Injured, Life

Life thresholds and healing.


### Makes it happen (59)

- **Consecration** *Skill*: Cooldown: seconds Lucky Hit Chance: [|%|] Bathe in the Light for seconds, Healing you and your allies for X Maximum Life ([Max(1,PlayerHealthMax() * X)]) per second and damaging enemies for damage ...
- **Holy Light Aura** *Skill*: Cooldown: seconds Lucky Hit Chance: % Passive: You and your allies emanate the Light, dealing damage every X seconds to X random Nearby enemies. Attack Speed further increases this damage. Active: ...
- **Rally** *Skill*: Charges: X Charge Cooldown: secondsHealth Cost:X Rally forth, generating X Faith and gaining X Movement Speed for seconds.
- **Zeal** *Skill*: Health Cost:X Faith Cost: Lucky Hit Chance: [|%|] Strike enemies with blinding speed, dealing damage followed immediately by X additional strikes dealing damage each.
- **Advance > Fortify** *Skill upgrade*: Grants X of Maximum Life ([Max(1,)|0|]) as Fortify when Advance hits an enemy for the first time.
- **Brandish > Sword of Mastery** *Skill upgrade*: While Healthy, Brandish deals damage and travels X faster.
- **Consecration > Fortify** *Skill upgrade*: Consecration's initial Cast Fortifies you for X of Maximum Life ([Max(1,)|0|]) per enemy hit.
- **Consecration > Sanctify** *Skill upgrade*: Consecration lasts X seconds, increasing its damage and Healing by X each second. Consecration detonates when it expires, dealing damage to all enemies and Healing you and your allies for X of thei...
- **Defiance Aura > Bonus Healing** *Skill upgrade*: Defiance Aura grants you and your allies X Healing received.
- **Defiance Aura > Maximum Life** *Skill upgrade*: Defiance Aura's passive also grants you and your allies X% Maximum Life.
- **Defiance Aura > Rite of Prayer** *Skill upgrade*: Defiance Aura's passive also Heals you and your allies for X of your Maximum Life ([Max(1,PlayerHealthMax() * X)]) per second. Healing yourself and allies grants X stacks of Resolve every X second.
- **Fanaticism Aura > Rite of Redemption** *Skill upgrade*: Weakened enemies who die within Fanaticism Aura's radius Heal you for X and Fortify for X of your Maximum Life ([Max(1,PlayerHealthMax() * X)]).
- **Holy Light Aura > Rite of Mercy** *Skill upgrade*: Holy Light's active chains X more times and Fortifies you and your allies for X of their Maximum Life ([Max(1,PlayerHealthMax() * X)]).
- **Rally > Words of Sacrifice** *Skill upgrade*: Rally now costs X of your Maximum Life ([Max(1,PlayerHealthMax() * X)]) and can stack up to X times.
- **Zeal > Death or Glory** *Skill upgrade*: Zeal costs X Maximum Life instead of Faith and strikes around you in a circle. Whenever you lose Life, Zeal's damage increases by X and Critical Strike Chance by X for X seconds.
- **Zeal > Fortify** *Skill upgrade*: Critically Striking enemies with Zeal has a X chance to grant X of Maximum Life ([Max(1,)|0|]) as Fortify.
- **Apostle's** *Aspect*: Each stack of Fervor grants you [10 – 20]% bonus Healing Received from all sources.
- **Aspect of Hale's Salve** *Aspect*: Healing while at full life Fortifies you for [0.5 – 1]% Maximum Life and grants 50% increased Armor for 5 seconds.
- **Aspect of Militance** *Aspect*: Lucky Hit: Critically Striking has up to a 25% chance to Fortify for [0.25 – 0.5]% of your Maximum Life for each stack of Fervor you have.
- **Aspect of Nebulous Brews** *Aspect*: Healing Potions grant [20 – 30]%[x] Movement Speed for 8 seconds. Every 80 meters you travel refills a Healing Potion.
- **Aspect of Utmost Glory** *Aspect*: While Healthy your Skills deal [20 – 35]%[x] increased damage. Double this bonus against Weakened enemies.
- **Aspect of Verdant Restoration** *Aspect*: Thorns damage heals you for [0.2 – 0.4]% of your Maximum Life.
- **Aspect of the Crowded Sage** *Aspect*: You have 8% increased Dodge Chance. Successful Dodges restore [5 – 20]% of your Maximum Life.
- **Aspect of the Dark Dance** *Aspect*: Every 5 seconds, your next Core Skill costs [0 – 407] Life instead of Primary Resource. Will only occur if you have at least 60% of your Maximum Life.Skills that consume Life deal 80%[x] increased ...
- **Aspect of the Deflecting Barrier** *Aspect*: You have a [10 – 25]% chance after taking direct damage to gain a Barrier equal to 20% of your Maximum Life for 10 seconds. This chance is doubled against Distant enemies.
- **Aspect of the Light's Mending** *Aspect*: Consuming Judgement has a 10% chance to restore [1 – 2.5]% of your Maximum Life to you and nearby allies.
- **Aspect of the Light's Mending** *Aspect*: Consuming Judgement Heals [2.5 – 5.5]% of your Maximum Life to you and Nearby Allies.
- **Aspect of the Protector** *Aspect*: Damaging an Elite enemy grants you a Barrier for [70 – 100]% of your Maximum Life for 10 seconds. This effect can only happen once every 20 seconds.
- **Aspect of the Prudent Heart** *Aspect*: After being damaged for at least 20% of your Maximum Life at once, you become Immune for [2.5 – 4.5] seconds. Can only occur once every 20 seconds.
- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Bruiser's** *Aspect*: Gain 4%[+] increased Armor and [163 – 569] Thorns per 1% missing Maximum Life.
- **Enshrouding** *Aspect*: Using a Healing Potion increases your Resistance to All Elements by [19.5 – 29.5]%[+] for 8 seconds.You may now drink your Healing Potion while at full Life.
- **Lord of Blood's** *Aspect*: Lucky Hit: Up to a 20% chance to heal you for [1 – 9]% of your missing Life.
- **Lord of Blood's** *Aspect*: Lucky Hit: Zealot Skills have up to a 20% chance to heal you for [4 – 6]% of your missing Life.
- **Protecting** *Aspect*: When hit while not Healthy, you form a protective bubble that grants all Players inside Immune. The bubble lasts for [4 – 11.5] seconds and can only form once every 90 seconds.
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Starlight** *Aspect*: Every 10% of your Life that you Heal grants you [20 – 35]% Primary Resource Cost Reduction for 2 seconds, up to 6 seconds.
- **The Penitent's** *Aspect*: Spending Health on a Skill grants you [5 – 15]% Critical Strike Chance and [35 – 55]%[x] Critical Strike Damage for 0 seconds.
- **Undying** *Aspect*: Casting a Skill Heals you for [2 – 3.5]% of your Maximum Life. Double this bonus while Injured.
- **Arcadia** (Legs) *Unique*: Rally Fortifies you for [6 – 8]% of your Maximum Life. Whenever you recover 8% of your Maximum Life, gain a charge of Rally.
- **Endurant Faith** (Gloves) *Unique*: When you would be damaged for at least 30% of your Maximum Life at once, it is instead distributed over the next 4 seconds and reduced by [15 – 20]%.
- **Endurant Faith** (Boots) *Unique*: When you would be damaged for at least 40% of your Maximum Life at once, it is instead distributed over the next 3 seconds and reduced by 30%.
- **Griswold's Opus** (Sword) *Unique*: Dealing direct damage grants [80 – 100]%[x] increased Critical Strike Damage for each enemy hit within 10 seconds, up to [40 – 50]%[x].At Maximum you gain:Lucky Hit: Critical Strikes have up to a 5...
- **Melted Heart of Selig** (Amulet) *Unique*: Damage is dealt to your Primary Resource before Life and damage taken this way is drastically reduced.Your Primary Resource is doubled but Maximum Life is reduced by 75%.
- **Shroud of False Death** (ChestArmor) *Unique*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Soulbrand** (ChestArmor) *Unique*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Temerity** (Legs) *Unique*: Effects that Heal you beyond 100% Life grant you Barrier equal to [80 – 100]% of the overhealed amount that lasts for 8 seconds. You may now drink your Healing Potion while at full Life.
- **Call to Arms** (Axe) *Runeword*: While affected by a Shout Skill gain:• +5 Ranks to all Skills• +15%[+] Maximum Life• +15%[x] Maximum Primary Resource
- **Arcadia** (Charm) *Unique charm*: Rally Fortifies you for [6 – 8]% of your Maximum Life. Whenever you recover 8% of your Maximum Life, gain a charge of Rally.
- **Endurant Faith** (Charm) *Unique charm*: When you would be damaged for at least 30% of your Maximum Life at once, it is instead distributed over the next 4 seconds and reduced by [15 – 20]%.
- **Griswold's Opus** (Charm) *Unique charm*: Dealing direct damage grants [80 – 100]%[x] increased Critical Strike Damage for each enemy hit within 10 seconds, up to [40 – 50]%[x].At Maximum you gain:Lucky Hit: Critical Strikes have up to a 5...
- **Melted Heart of Selig** (Charm) *Unique charm*: Damage is dealt to your Primary Resource before Life and damage taken this way is drastically reduced.Your Primary Resource is doubled but Maximum Life is reduced by 75%.
- **Shroud of False Death** (Charm) *Unique charm*: When you would be dealt fatal damage, instead you Heal to full Life, gain a Barrier for 100% of your Maximum Life for 3 seconds, and Knock Back Close enemies. This power is disabled once used until...
- **Soulbrand** (Charm) *Unique charm*: Your Healing Potions grant a Barrier for 100% of your Maximum Life for 1 second.You gain [25 – 30]% Damage Reduction while you have a Barrier and may drink your Healing Potion while at full Life.
- **Temerity** (Charm) *Unique charm*: Effects that Heal you beyond 100% Life grant you Barrier equal to [80 – 100]% of the overhealed amount that lasts for 8 seconds. You may now drink your Healing Potion while at full Life.
- **Heaven's Radiant Fire (3-piece)** *Talisman set*: • You gain 30% Damage Reduction and Heal for 2.5% of your Maximum Life every second while affected by Judgement Day.
- **Light's Epiphany (3-piece)** *Talisman set*: • While in Arbiter, gain 30% increased Maximum Life and 10%[x] increased Movement Speed
- **Imbiber** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Healthy. / You gain 5%[x] increased damage and 5%[+] increased Potion Healing for each missing Healing Potion, up to...
- **Outmatch** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / You deal 20%[x] increased Physical damage to Non-Elites and Bosses. / Increase damage while Healthy by X.

### Pays it off (9)

- **Brandish > Sword of Mastery** *Skill upgrade*: While Healthy, Brandish deals damage and travels X faster.
- **Aspect of Righteous Rage** *Aspect*: Zealot Skills deal [0.8 – 1]%[x] increased damage for each percent of Life you are missing.
- **Aspect of Utmost Glory** *Aspect*: While Healthy your Skills deal [20 – 35]%[x] increased damage. Double this bonus against Weakened enemies.
- **Smiting** *Aspect*: You have [20 – 30]%[+] increased Critical Strike Chance against Injured enemies. While you are Healthy, you gain [40 – 60]%[+] increased Crowd Control Duration.
- **Undying** *Aspect*: Casting a Skill Heals you for [2 – 3.5]% of your Maximum Life. Double this bonus while Injured.
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **Imbiber** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Healthy. / You gain 5%[x] increased damage and 5%[+] increased Potion Healing for each missing Healing Potion, up to...
- **Outmatch** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / You deal 20%[x] increased Physical damage to Non-Elites and Bosses. / Increase damage while Healthy by X.

## Ultimates

Ultimate skills.


### Makes it happen (6)

- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill increases your Ultimate damage by [6 – 10]%[x], up to [60 – 100]%[x]. At 10 stacks, your Cooldowns and this bonus are reset.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill reduces the Cooldowns of your other Skills by [6.5 – 14] seconds.
- **Aspect of Assistance** *Aspect*: Your Reinforcement Cooldown is reduced by [22.5 – 32.5]%[x]. After casting your Ultimate Skill, your Reinforcement Mercenary is called. This cannot occur more than once each 30 seconds.
- **Vehement Brawler's** *Aspect*: Casting an Ultimate Skill increases your damage by [35 – 55]%[x] for 8 seconds. Gain 2 additional Ultimate Skill Ranks.
- **Yen's Blessing** (Boots) *Unique*: Casting a Skill has a [40 – 60]% chance to trigger a Non-Mobility, Non-Ultimate Skill that is currently on Cooldown. Can only occur once every 8 seconds.
- **Yen's Blessing** (Charm) *Unique charm*: Casting a Skill has a [40 – 60]% chance to trigger a Non-Mobility, Non-Ultimate Skill that is currently on Cooldown. Can only occur once every 8 seconds.

### Pays it off (3)

- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill increases your Ultimate damage by [6 – 10]%[x], up to [60 – 100]%[x]. At 10 stacks, your Cooldowns and this bonus are reset.
- **Aspect of Apogeic Furor** *Aspect*: Casting an Ultimate Skill reduces the Cooldowns of your other Skills by [6.5 – 14] seconds.
- **Vehement Brawler's** *Aspect*: Casting an Ultimate Skill increases your damage by [35 – 55]%[x] for 8 seconds. Gain 2 additional Ultimate Skill Ranks.

## Elites, bosses and kills

Things that care about elites, bosses or kills.


### Makes it happen (0)

- none found

### Pays it off (34)

- **Divine Lance > Cost Reduction** *Skill upgrade*: Killing enemies with Divine Lance reduces the cost of your next Divine Lance by X% up to X%
- **Divine Lance > Tip of the Spear** *Skill upgrade*: Divine Lance flurries, stabbing X additional times and deals damage each. Killing Vulnerable enemies with Divine Lance increases its Attack Speed by X for X seconds, up to X.
- **Falling Star > Cooldown Reduction** *Skill upgrade*: Killing a Vulnerable enemy reduces the Cooldown of Falling Star by X seconds.
- **Falling Star > Enhanced Falling Star** *Skill upgrade*: Killing a Vulnerable enemy reduces the cooldown of Falling Star by X second.
- **Fortress > Barricade** *Skill upgrade*: Killing enemies inside of your Fortress extends its duration by X seconds up to X seconds. You may recast Fortress to move it to your current location.
- **Zenith > Weaken** *Skill upgrade*: Killing Weakened enemies with Zenith reduces its cooldown by X seconds.
- **Aspect of Celestial Strife** *Aspect*: While in Arbiter, kills grant [1 – 1.5]%[x] increased Vulnerable damage, up to a maximum of [50 – 75]%[x].
- **Aspect of Chastisement** *Aspect*: Your Juggernaut Skills deal [55 – 75]%[x] increased damage to Bosses and Crowd Controlled enemies.
- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Fortune** *Aspect*: You gain [15 – 22.5]%[x] Lucky Hit Chance against Elite enemies.
- **Aspect of Rallying Reversal** *Aspect*: When you Crowd Control an enemy or apply any Stagger to a Boss, gain 1 Ferocity and [10 – 15]% Damage Reduction for 4 seconds.
- **Aspect of Voracious Rage** *Aspect*: Killing an enemy with a Core Skill refunds [20 – 30]% of its base cost. Can only happen once per Skill cast.
- **Aspect of the Protector** *Aspect*: Damaging an Elite enemy grants you a Barrier for [70 – 100]% of your Maximum Life for 10 seconds. This effect can only happen once every 20 seconds.
- **Shard of Dawn** *Aspect*: After 30 seconds of Night's Grasp, gain Dawn's Haste, increasing your Cast Speed by [20 – 40]% and Movement Speed by 20% for 12 seconds. While empowered by the Midwinter Ward, killing an enemy redu...
- **Cathedral's Song** (Shield) *Unique*: Consuming Judgement 100 times calls down Spear of the Heavens on a random enemy. Judgement on Bosses counts as 10.Your Spear of the Heavens damage is increased by [80 – 100]%[x].
- **Godslayer Crown** (Boots) *Unique*: When you Stun, Freeze, or Immobilize an Elite, you Pull In all Nearby enemies and deal 60%[x] increased damage to them for 3 seconds. Can only occur once every 12 seconds.Against Bosses, this effec...
- **Heir of Perdition** (Helm) *Unique*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **In-Geom** (Sword) *Unique*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Nemesis Bracers** (Gloves) *Unique*: Shrines will spawn an Elite Pack.
- **The Butcher's Cleaver** (Axe) *Unique*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Furnace** (Mace2H) *Unique*: You deal [75 – 100]%[x] more damage to Elites.
- **Wendigo Brand** (Ring) *Unique*: Every 15 kills in the last [50 – 60] seconds increases your damage by 2%[x], and Attack Speed by 1%[+].
- **Infinity** (Axe2H) *Runeword*: 50% Chance to unleash a Rank 10 Sorcerer Chain Lightning when you kill an enemy. You gain the Rank 11 passive of Druid's Cyclone Armor. Close enemies are Vulnerable and take 62.5%[x] more damage fr...
- **Cathedral's Song** (Charm) *Unique charm*: Consuming Judgement 100 times calls down Spear of the Heavens on a random enemy. Judgement on Bosses counts as 10.Your Spear of the Heavens damage is increased by [80 – 100]%[x].
- **Heir of Perdition** (Charm) *Unique charm*: Succumb to hatred and earn Mother's Favor. Slaughtering enemies briefly steals 15%[+] Critical Strike Chance from surrounding allies with Mother's Favor.Mother's Favor always grants you 15%[x] incr...
- **In-Geom** (Charm) *Unique charm*: Defeating an Elite pack reduces your Skill Cooldowns by [8 – 10] seconds for 15 seconds.
- **Nemesis Bracers** (Charm) *Unique charm*: Shrines will spawn an Elite Pack.
- **The Butcher's Cleaver** (Charm) *Unique charm*: Your attacks Critically Strike Injured Enemies. Killing Elites Fears and Slows nearby enemies by [85 – 95]% for 2 seconds.
- **The Furnace** (Charm) *Unique charm*: You deal [75 – 100]%[x] more damage to Elites.
- **Wendigo Brand** (Charm) *Unique charm*: Every 15 kills in the last [50 – 60] seconds increases your damage by 2%[x], and Attack Speed by 1%[+].
- **Heaven's Radiant Fire (5-piece)** *Talisman set*: •Judgement Day's damage bonus is increased to 25%[x] and its maximum number of stacks is increased to 20. Judging a Boss grants 5 stacks of Judgement Day.
- **Challenger** [Strength] *Glyph*: Grants +X bonus to all Normal nodes within range. / You deal 10%[x] increased damage to Elites. / Increase damage to Elites by X.
- **Judicator** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, your Judicator skills deal X increased damage. / Deal an additional 20%[x] Non-physical Damage to Elites. / Increase Holy and Fire damage by X.
- **Outmatch** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / You deal 20%[x] increased Physical damage to Non-Elites and Bosses. / Increase damage while Healthy by X.

## Vulnerable

Making enemies Vulnerable and paying it off.


### Makes it happen (15)

- **Advance > Flash of the Blade** *Skill upgrade*: Advance becomes a Disciple Skill and has a X second cooldown. Advance becomes a dash that cuts through enemies, applying Vulnerable and dealing damage.
- **Arbiter of Justice > Divine Intervention** *Skill upgrade*: Arbiter of Justice ascends for an additional X seconds and rains Blessed Spears on the battlefield. Upon landing, Arbiter of Justice bombards the battlefield with X additional Blessed Spears, apply...
- **Arbiter of Justice > Seraph's Wings** *Skill upgrade*: Arbiter form gains the following benefits: Wing Strikes deal X increased damage Wing Strikes apply Vulnerable
- **Brandish > Vulnerable** *Skill upgrade*: Brandish applies Vulnerable to enemies for X seconds.
- **Condemn > Gather the Guilty** *Skill upgrade*: Condemn now has 1 additional Charge and applies Vulnerable for X seconds.
- **Falling Star > Vulnerable** *Skill upgrade*: Falling Star applies Vulnerable to enemies for X seconds on landing.
- **Fanaticism Aura > Rite of Humility** *Skill upgrade*: Fanaticism Aura's active instead makes Nearby enemies Vulnerable for X seconds. Damaging Vulnerable enemies will also trigger Fanaticism's Passive.
- **Holy Bolt > Divine Bolt** *Skill upgrade*: Holy Bolt becomes a Disciple Skill. Holy Bolt pierces, deals damage, and applies Vulnerable.
- **Purify > Absolution** *Skill upgrade*: Purify now can be cast on enemies. Instead of Dazing them, it deals damage and makes enemies Vulnerable for seconds.
- **Spear of the Heavens > Vulnerable** *Skill upgrade*: Spear of the Heavens applies Vulnerable to enemies for X seconds.
- **Aspect of Frosty Strides** *Aspect*: While below [45 – 60]% Life, Evade Freezes Close enemies, deals 6,000 Cold damage to them, and makes them Vulnerable for 3 seconds.
- **Wyrdskin** (Gloves) *Unique*: Attacks apply Vulnerable to Distant Enemies, and Weakened to Close Enemies. You deal [30 – 40]%[x] increased damage to Enemies that are both Vulnerable and Weakened.
- **Infinity** (Axe2H) *Runeword*: 50% Chance to unleash a Rank 10 Sorcerer Chain Lightning when you kill an enemy. You gain the Rank 11 passive of Druid's Cyclone Armor. Close enemies are Vulnerable and take 62.5%[x] more damage fr...
- **Wyrdskin** (Charm) *Unique charm*: Attacks apply Vulnerable to Distant Enemies, and Weakened to Close Enemies. You deal [30 – 40]%[x] increased damage to Enemies that are both Vulnerable and Weakened.
- **Exploit** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased damage to Vulnerable targets. / When an enemy is damaged by you, they become Vulnerable for 3 seconds. This cannot happen more...

### Pays it off (8)

- **Divine Lance > Damage Bonus** *Skill upgrade*: Divine Lance deals X increased damage. Double this bonus against Vulnerable enemies.
- **Divine Lance > Tip of the Spear** *Skill upgrade*: Divine Lance flurries, stabbing X additional times and deals damage each. Killing Vulnerable enemies with Divine Lance increases its Attack Speed by X for X seconds, up to X.
- **Fanaticism Aura > Rite of Humility** *Skill upgrade*: Fanaticism Aura's active instead makes Nearby enemies Vulnerable for X seconds. Damaging Vulnerable enemies will also trigger Fanaticism's Passive.
- **Aspect of Celestial Strife** *Aspect*: While in Arbiter, kills grant [1 – 1.5]%[x] increased Vulnerable damage, up to a maximum of [50 – 75]%[x].
- **Divinity** *Paragon node*: While in Arbiter you deal 0%[x] increased damage to Vulnerable enemies.
- **Apostle ** [Strength] *Glyph*: For every 5 Strength purchased within range, your Disciple skills deal X increased damage. / Disciple skills deal an additional 15%[x] damage to Vulnerable enemies. / Increase damage to Vulnerable ...
- **Diminish** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / You take 15% reduced Physical damage from Vulnerable enemies. / Increase damage to Vulnerable targets by X.
- **Exploit** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased damage to Vulnerable targets. / When an enemy is damaged by you, they become Vulnerable for 3 seconds. This cannot happen more...

## Burning, Poisoning, Bleeding

Damage over time and while-Burning effects.


### Makes it happen (3)

- **Blood-Mad Idol** (Amulet) *Unique*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **Grief** (Sword_Phase_Blade) *Runeword*: Your direct damage inflicts 40% bonus Poisoning damage over 5 seconds.
- **Blood-Mad Idol** (Charm) *Unique charm*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.

### Pays it off (6)

- **Aspect of Creeping Death** *Aspect*: You deal [5 – 25]%[x] increased damage over time to enemies for each different Crowd Control effect they're afflicted by. Unstoppable enemies and Staggered Bosses take [10 – 50]%[x] increased damag...
- **Aspect of Disobedience** *Aspect*: Your Damage over Time grants you [1 – 2.5]% Damage Reduction for 2 seconds, stacking up to 30 times.
- **Aspect of Inevitable Fate** *Aspect*: When an enemy falls below 35% Life while afflicted with any of your damage over time effects, an explosion occurs every 7 seconds, dealing [4,000 – 8,000] damage for each Element they're afflicted by.
- **Blood-Mad Idol** (Amulet) *Unique*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.
- **X'Fal's Corroded Signet** (Boots) *Unique*: Lucky Hit: Your damage over time effects have up to a 75% chance to erupt, dealing 26,000 damage of the same type to surrounding enemies.
- **Blood-Mad Idol** (Charm) *Unique charm*: You are always Berserking but take 200%[x] increased damage as Burning over 8 seconds. While Burning, Berserking grants an additional [80 – 100]%[x] increased damage.

## Evade and Dodge

Evade casts and dodges.


### Makes it happen (12)

- **Aspect of Elusive Menace** *Aspect*: Your Dodge Chance increases by [20 – 35]%[+] whenever you take damage. Successfully Dodging resets this bonus.
- **Aspect of Frosty Strides** *Aspect*: While below [45 – 60]% Life, Evade Freezes Close enemies, deals 6,000 Cold damage to them, and makes them Vulnerable for 3 seconds.
- **Aspect of Metamorphosis** *Aspect*: Evade transforms you into a cloud of bats, dealing 4,000 Physical damage and inflicting Vampiric Curse to enemies in your path. Evade's Cooldown is increased by [2.5 – 10] seconds.
- **Aspect of the Arbiter's Zephyr** *Aspect*: Arbiter's evade cooldown is reduced by [1 – 3] Seconds.
- **Aspect of the Crowded Sage** *Aspect*: You have 8% increased Dodge Chance. Successful Dodges restore [5 – 20]% of your Maximum Life.
- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Juggernaut's** *Aspect*: You gain [100 – 150]%[+] Total Armor, but your Evade has 100% increased Cooldown.
- **Argent Veil** (Ring) *Unique*: Arbiter's Evade triggers a random equipped non-Channeled Core Skill for every 2 meters traveled. Core Skills deal [5 – 15]%[x] increased damage during Arbiter's Evade and for 4 seconds after.
- **Flickerstep** (Boots) *Unique*: Each enemy you Evade through reduces your active Ultimate Cooldown by [3 – 4] seconds, up to 10 seconds.
- **Enigma** (ChestArmor) *Runeword*: Your Evade is now Sorcerer's Teleport and costs 33 Primary Resource.
- **Argent Veil** (Charm) *Unique charm*: Arbiter's Evade triggers a random equipped non-Channeled Core Skill for every 2 meters traveled. Core Skills deal [5 – 15]%[x] increased damage during Arbiter's Evade and for 4 seconds after.
- **Flickerstep** (Charm) *Unique charm*: Each enemy you Evade through reduces your active Ultimate Cooldown by [3 – 4] seconds, up to 10 seconds.

### Pays it off (4)

- **Assimilation** *Aspect*: Gain 8% increased Dodge Chance. When you Dodge, Fortify for [7 – 22]% of your Maximum Life.
- **Bristleback** *Aspect*: When you Dodge or Block an attack you trigger a [200 – 300]% Thorns attack against the attacker.
- **Juggernaut's** *Aspect*: You gain [100 – 150]%[+] Total Armor, but your Evade has 100% increased Cooldown.
- **Rain** (ChestArmor) *Runeword*: Lucky Hit: Attacks have up to a [15 – 30]% chance to unleash a Rank 15 Druid Tornado.50% Chance to unleash a Rank 15 Druid Cyclone Armor whenever you Dodge.

## Fervor (Zealot)

Zealot Oath stacks.


### Makes it happen (8)

- **Advance > Vanguard's Rush** *Skill upgrade*: Advance rushes into enemies, granting X Fervor on each strike and deals an additional X damage per stack of Fervor you have.
- **Apostle's** *Aspect*: Each stack of Fervor grants you [10 – 20]% bonus Healing Received from all sources.
- **Aspect of Jacques' Fervor** *Aspect*: Each stack of Fervor grants you [15 – 20]%[x] bonus Critical Strike Damage.
- **Aspect of Militance** *Aspect*: Lucky Hit: Critically Striking has up to a 25% chance to Fortify for [0.25 – 0.5]% of your Maximum Life for each stack of Fervor you have.
- **Aspect of the Zealot's Covenant** *Aspect*: Additional hits from Zealot Oath deal [100 – 120]%[x] increased damage.Your Maximum Fervor is increased by 1 and its duration is increased by 2 seconds.
- **Revelator's** *Aspect*: Zealot Skills deal [12.5 – 32.5]%[x] increased damage, doubled while at 3 or more stacks of Fervor.
- **Fervent** *Paragon node*: You gain 35%[x] increased Critical Strike damage and 3%[+] Critical Strike chance for each stack of Fervor you have.
- **Feverous** [Willpower] *Glyph*: For every 5 Willpower purchased within range, your Zealot skills deal X increased damage. / You deal 5%[x] increased damage for each stack of Fervor you have. / Increase damage by X.

### Pays it off (2)

- **Aspect of the Zealot's Covenant** *Aspect*: Additional hits from Zealot Oath deal [100 – 120]%[x] increased damage.Your Maximum Fervor is increased by 1 and its duration is increased by 2 seconds.
- **Revelator's** *Aspect*: Zealot Skills deal [12.5 – 32.5]%[x] increased damage, doubled while at 3 or more stacks of Fervor.

## Glyphs at a glance

Which glyph rewards which playstyle. The stat in brackets is the one the glyph counts.

- **Apostle ** [Strength] *Glyph*: For every 5 Strength purchased within range, your Disciple skills deal X increased damage. / Disciple skills deal an additional 15%[x] damage to Vulnerable enemies. / Increase damage to Vulnerable ...
- **Arbiter** [Willpower] *Glyph*: For every 5 Willpower purchased within range, your Arbiter Wing Attacks deal X increased damage. / You deal 3%[x] increased damage for each second you've been in Arbiter form, up to 18%[x]. / You d...
- **Canny** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased Non-physical damage. / Non-Physical damage increases all the Non-Physical damage an enemy takes from you by 1%[x], up to 15%[x...
- **Challenger** [Strength] *Glyph*: Grants +X bonus to all Normal nodes within range. / You deal 10%[x] increased damage to Elites. / Increase damage to Elites by X.
- **Chip** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased Physical damage. / Physical damage increases the damage an enemy takes from you by 1%[x], up to 15%[x], for 15 seconds. / Increas...
- **Control** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased damage to Crowd Controlled targets. / You deal 10%[x] increased damage to Slowed or Chilled enemies or, instead, 20%[x] increa...
- **Diminish** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / You take 15% reduced Physical damage from Vulnerable enemies. / Increase damage to Vulnerable targets by X.
- **Exploit** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased damage to Vulnerable targets. / When an enemy is damaged by you, they become Vulnerable for 3 seconds. This cannot happen more...
- **Feverous** [Willpower] *Glyph*: For every 5 Willpower purchased within range, your Zealot skills deal X increased damage. / You deal 5%[x] increased damage for each stack of Fervor you have. / Increase damage by X.
- **Honed** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, you deal +X increased Critical Strike Damage. / Skills that Critically Strike generate 1 Faith. / Increase Critical Strike Damage by X.
- **Imbiber** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Healthy. / You gain 5%[x] increased damage and 5%[+] increased Potion Healing for each missing Healing Potion, up to...
- **Judicator** [Intelligence] *Glyph*: For every 5 Intelligence purchased within range, your Judicator skills deal X increased damage. / Deal an additional 20%[x] Non-physical Damage to Elites. / Increase Holy and Fire damage by X.
- **Law** [Strength] *Glyph*: For every 5 Strength purchased within range, your Judgement deals X increased damage. / Judging an enemy causes them to take 15%[x] damage from you for 5 seconds. / Increase damage by X.
- **Outmatch** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / You deal 20%[x] increased Physical damage to Non-Elites and Bosses. / Increase damage while Healthy by X.
- **Resplendence** [Strength] *Glyph*: Grants +X bonus to all Magic nodes within range. / After casting an Aura Skill, the active cooldown of every Non-Aura skill is reduced by 2 seconds. / Increase damage by X.
- **Retribution** [Strength] *Glyph*: Grants +X bonus to all Rare nodes within range. / Retribution gains 10%[x] increased damage and 50%[+] increased Size. / Increase damage by X.
- **Revenge** [Intelligence] *Glyph*: Grants +X bonus to all Rare nodes within range. / Dealing Thorns damage to an enemy increases all damage it takes from you by 1%[x], up to 15%[x], for 10 seconds. / Increase damage by X.
- **Sentinel** [Strength] *Glyph*: For every 5 Strength purchased within range, your Juggernaut skills deal X increased damage. / You deal 1.5%[x] increased damage for each stack of Resolve you have. / You deal X increased damage to...
- **Spirit** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased Critical Strike Damage. / Critical Strikes increase the damage an enemy takes from you by 3%[x] for 20 seconds, up to 12%[x]. / I...
- **Turf** [Strength] *Glyph*: For every 5 Strength purchased within range, you deal +X increased damage to Close targets. / You gain 15% Damage Reduction against Close enemies. / You deal X increased damage to Close enemies.
- **Undaunted** [Willpower] *Glyph*: For every 5 Willpower purchased within range, you deal +X increased damage while Fortified. / You gain up to 15% Damage Reduction the more Fortify you have. / Increase damage by X.
