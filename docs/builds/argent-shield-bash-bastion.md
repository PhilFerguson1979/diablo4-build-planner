# Argent Veil, Shield Bash with Bastion (Paladin)

*Made by the build agent on 2026-11-23. Everything below comes from the planner's maths and has not been checked in game.*

## The idea

Argent Veil makes Arbiter's Evade cast Shield Bash every 2 meters. Every Shield Bash counts as a Block, and Bastion of Sir Matthias gives each Block a 15% chance to retaliate with another Shield Bash, which is itself a Block, so the chain feeds itself. Bastion also makes Shield Bash hit 80 to 100% [x] harder and adds a chance to deal double damage.

## Numbers

- **Damage against elites:** 80.25 billion a second
- **Build score:** 80.25 billion on packs, 58.47 billion on bosses
- **Effective Life:** 501,193 (Life 21,039, Armor 41,029, Block 30%)
- **Pit check:** kills an elite before it dies up to Pit 100; the starting build managed below 60 by the same test. The planner's Pit model is harsher than the game, so use it to compare builds, not as a promise.
- **Started from:** Arbiter Wing Strikes: build score 4.1 million on packs, 4.1 million on bosses, 151,356 Effective Life

| Pit | Elite dies in | Elite kills you in | Biggest hit | Your Life |
|---|---|---|---|---|
| 60 | 0 s | 43.9 s | 3,367 | 21,039 |
| 70 | 0 s | 12.6 s | 5,351 | 21,039 |
| 80 | 0.1 s | 6.1 s | 8,504 | 21,039 |
| 90 | 0.4 s | 3.4 s | 13,516 | 21,039 |
| 100 | 1.7 s | 2 s | 21,479 | 21,039 |
| 110 | 8.4 s | 1.2 s | 34,135 | 21,039 |
| 120 | 134.2 s | 1 s | 43,148 | 21,039 |
| 130 | 2155.9 s | 0.8 s | 54,540 | 21,039 |
| 140 | 34622.7 s | 0.6 s | 68,940 | 21,039 |
| 150 | 556032.2 s | 0.5 s | 87,142 | 21,039 |

## How it works

- **Evade and Dodge:** made by Juggernaut's and Argent Veil; paid off by Juggernaut's.
- **Crowd control:** made by Aegis, Shield Bash > Smite, Condemn and Control; paid off by Exploiter's, Vanquishing, Aspect of Chastisement and Control.
- **Movement:** made by Exploiter's, Defiance Aura, Arbiter of Justice > Movement Speed, Condemn and Condemn > Movement Speed; paid off by Argent Veil and Condemn.
- **Block:** made by Aegis and Shield Bash > Hits Are Blocks; paid off by Bastion of Sir Matthias.
- **Vulnerable:** made by Fanaticism Aura > Rite of Humility, Arbiter of Justice > Seraph's Wings and Condemn > Gather the Guilty; paid off by Fanaticism Aura > Rite of Humility.
- **Arbiter form:** made by Arbiter of Justice > Seraph's Wings, Arbiter of Justice > Wing Strike Recast, Arbiter of Justice > Movement Speed and Arbiter; paid off by Arbiter of Justice > Seraph's Wings, Arbiter of Justice > Wing Strike Recast, Arbiter of Justice > Movement Speed and Arbiter.
- **Critical Strikes:** made by Fanaticism Aura; paid off by The Grandfather.

## Rotation

- **Condemn:** cast on cooldown (every 11.25 seconds after Cooldown Reduction).
- **Arbiter of Justice:** Ultimate. Cast it on cooldown (every 114 seconds after Cooldown Reduction), ideally when elites or the boss are in range.
- **Fanaticism Aura:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect (every 14.25 seconds after Cooldown Reduction).
- **Defiance Aura:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect (every 19 seconds after Cooldown Reduction).
- **Aegis:** cast on cooldown (every 15.2 seconds after Cooldown Reduction).
- **Shield Bash:** your main skill. Cast it as much as you can.

## Skills

- Defiance Aura r20 [Rite of Might, Maximum Life, Bonus Healing]
- Aegis r33 [Stay Resolute, Duration, Cooldown Reduction]
- Shield Bash r50 [Smite, Hits Are Blocks, Size Bonus]
- Fanaticism Aura r15 [Rite of Humility, Extra Passive Stack, Potency]
- Arbiter of Justice r5 [Seraph's Wings, Wing Strike Recast, Movement Speed]
- Condemn r1 [Gather the Guilty, Cooldown Reduction, Movement Speed]

## Gear to chase

Affixes are in the order the agent picked them, most valuable first. Get the item, then the first affix, and so on.

| Slot | Item | Affixes | Temper |
|---|---|---|---|
| Helm | Crown of Lucion | +121 Strength (guaranteed); +2,800 Shadow Resistance; +1,450 Maximum Life; +100 All Stats (enchant away the guaranteed 7% Resource Cost Reduction) | +1,500 Maximum Life |
| Chest | Squirt's Blouse | +121 Strength (guaranteed); +2,500 Armor; +2,800 Shadow Resistance; +1,450 Maximum Life | +2,000 Armor |
| Gloves | Vanguard's | x50% Critical Strike Damage Multiplier; +8.5% Critical Strike Chance; x24% Physical Damage Multiplier; x28% Vulnerable Damage Multiplier | +50% Critical Strike Damage |
| Pants | Juggernaut's | +2,500 Armor; +1,450 Maximum Life; +2,800 Fire Resistance; +121 Strength | +1,500 Maximum Life |
| Boots | Exploiter's | +1,450 Maximum Life; +121 Strength; +2,800 Fire Resistance; +100 All Stats | +10% Fanaticism Aura Potency |
| Amulet | Blood-Mad Idol | +180 Strength (guaranteed); x50% Critical Strike Damage Multiplier; +8.5% Critical Strike Chance; x24% Physical Damage Multiplier (enchant away the guaranteed +10% Attack Speed) | +50% Critical Strike Damage |
| Ring | Vanquishing | x25% Critical Strike Damage Multiplier; +5% Critical Strike Chance; x10% All Damage Multiplier; x14% Vulnerable Damage Multiplier | +50% Critical Strike Damage |
| Ring | Argent Veil | +2 to Core Skills (guaranteed); x25% Critical Strike Damage Multiplier; +5% Critical Strike Chance; x14% Vulnerable Damage Multiplier (enchant away the guaranteed +121 Strength) | +50% Critical Strike Damage |
| Weapon | Aspect of Chastisement | x25% Critical Strike Damage Multiplier; +2,200 Maximum Life; +180 Strength; x10% All Damage Multiplier | +5% Critical Strike Chance |
| Off-hand | Bastion of Sir Matthias | +3 to Shield Bash (guaranteed); +8.5% Critical Strike Chance; 15% Damage Reduction; +2,500 Armor (enchant away the guaranteed +180 Strength) | +1,500 Maximum Life |

## Caps

| Stat | Now | Cap |
|---|---|---|
| Critical Strike Chance | 40.5% | 100% |
| Block Chance | 30% | 100% |
| Block Reduction | 30% | 80% |
| All Damage Reduction | 15% | 100% |
| Cooldown Reduction | 5% | 75% |

| Element | Damage reduction | Effective Life |
|---|---|---|
| Physical | 88.5% | 182,456 |
| Fire | 98% | 1.0 million |
| Lightning | 88.5% | 182,456 |
| Cold | 88.5% | 182,456 |
| Poison | 88.5% | 182,456 |
| Shadow | 98% | 1.0 million |

Best next defensive affixes: Damage Reduction (+17.6% Effective Life), Maximum Life (+15.7% Effective Life), All Resistance (+9.8% Effective Life), Armor (+-14% Effective Life).

## Paragon

- **Boards:** Start, Relentless, Castle, Shield Bearer and Beacon (layout from Shield Charge, block engine (Agent search))
- **Glyphs:** Outmatch on Start (level 75), Arbiter on Relentless (level 75), Imbiber on Castle (level 75), Challenger on Shield Bearer (level 75), Control on Beacon (level 75)

## Charms

- **Seal:** Seal of the Diamond Mind
- Rare charm: 15%[x] Critical Strike Damage; +3 to Juggernaut Skills
- Rare charm: +3 to Juggernaut Skills; 15%[x] Vulnerable Damage
- Unique: The Grandfather
- Rare charm: +3 to Juggernaut Skills; +3 to Shield Bash
- Rare charm: +3 to Juggernaut Skills; +3 to Shield Bash
- Rare charm: +3 to Juggernaut Skills; +3 to Shield Bash

## Mercenaries

- **Hired:** Varyana
- **Reinforcement:** Aldkin (Field of Languish)

## Search log

- started from Arbiter Wing Strikes
- main skill upgrades: Lay Siege, Hits Are Blocks, Size Bonus
- starting point holds Pit 0
- engine: Movement, Lucky Hit, Resolve (Juggernaut), Block, Crowd control, Critical Strikes, Attack speed, Vulnerable, Arbiter form, Cooldowns, Aura cast / Aura Potency, Evade and Dodge; 12 payoffs left out for lack of a trigger
- gear searched (2 passes)
- paragon boards from Shield Charge, block engine (Agent search)
- gear searched again with the new boards
- Paragon_Paladin_06: Imbiber -> Arbiter
- Paragon_Paladin_01: Spirit -> Imbiber
- Paragon_Paladin_02: Retribution -> Challenger
- hired Raheir -> Varyana
- reinforcement Aldkin -> Aldkin (Mercenary_CursedChild_Wither)
- charms: The Grandfather
- glyphs, mercenaries and charms searched
- took 3 seconds
