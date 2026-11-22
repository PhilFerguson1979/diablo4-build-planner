# Shield Charge, block engine (Paladin)

*Made by the build agent on 2026-11-22. Everything below comes from the planner's maths and has not been checked in game.*

## The idea

Shield Charge's hits count as blocks, so every charge sets off the block payoffs (Akarat's Blessing cuts cooldowns, Northern Guard freezes, Redirected Force doubles its crit bonus, Bastion of Sir Matthias retaliates). The agent tests which of them the maths rewards.

## Numbers

- **Damage against elites:** 33.91 billion a second
- **Build score:** 33.91 billion on packs, 24.86 billion on bosses
- **Effective Life:** 770,972 (Life 29,981, Armor 30,167, Block 30%)
- **Pit check:** kills an elite before it dies up to Pit 90; the starting build managed 70 by the same test. The planner's Pit model is harsher than the game, so use it to compare builds, not as a promise.
- **Started from:** Shield Charge: build score 953.3 million on packs, 953.3 million on bosses, 110,615 Effective Life

| Pit | Elite dies in | Elite kills you in | Biggest hit | Your Life |
|---|---|---|---|---|
| 60 | 0 s | 12.8 s | 3,656 | 29,981 |
| 70 | 0 s | 8.1 s | 5,810 | 29,981 |
| 80 | 0.2 s | 5.1 s | 9,234 | 29,981 |
| 90 | 0.9 s | 3.2 s | 14,675 | 29,981 |
| 100 | 4.1 s | 2 s | 23,321 | 29,981 |
| 110 | 19.8 s | 1.3 s | 37,062 | 29,981 |
| 120 | 317.6 s | 1 s | 46,848 | 29,981 |
| 130 | 5101.3 s | 0.8 s | 59,217 | 29,981 |
| 140 | 81926.3 s | 0.7 s | 74,852 | 29,981 |
| 150 | 1315717.9 s | 0.5 s | 94,615 | 29,981 |

## How it works

- **Crowd control:** made by Aspect of Retribution, Shield Charge > Virtuous Charge, Aegis and Control; paid off by Exploiter's, Aspect of Retribution, Vanquishing and Control.
- **Resolve (Juggernaut):** made by Shield Charge > Resolve; paid off by Aspect of the Juggernaut's Covenant, Aspect of Lapa's Scripture and Fortress.
- **Thorns:** made by Aspect of Lapa's Scripture, Defiance Aura > Rite of Thorns, Aegis > Impunity and Clash > Punishment; paid off by Defiance Aura > Rite of Thorns and Clash > Punishment.
- **Resource spending:** made by Clash and Clash > Faith Generation; paid off by Fanaticism Aura.
- **Critical Strikes:** made by Fanaticism Aura; paid off by Fanaticism Aura > Rite of Vengeance, The Grandfather and Spirit.
- **Fortify, Barrier, Healthy:** made by Aspect of the Protector; paid off by Outmatch and Imbiber.

### Payoffs with nothing to trigger them

- **Judgement:** Shield Charge > Virtuous Charge

## Rotation

- **Fortress:** Ultimate. Cast it on cooldown (every 57 seconds after Cooldown Reduction), ideally when elites or the boss are in range.
- **Aegis:** cast on cooldown (every 15.2 seconds after Cooldown Reduction).
- **Defiance Aura:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect (every 19 seconds after Cooldown Reduction).
- **Fanaticism Aura:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect (every 14.25 seconds after Cooldown Reduction).
- **Clash:** spends resource. Cast it between Shield Charge casts when you have resource to spare, or keep it up if it summons or lingers.
- **Shield Charge:** your main skill (every 7.6 seconds after Cooldown Reduction). Cast it on cooldown and fill the gaps with your other skills.

## Skills

- Defiance Aura r19 [Rite of Thorns, Maximum Life, Potency]
- Shield Charge r15 [Virtuous Charge, Resolve, Hit Count As Blocking]
- Aegis r15 [Impunity, Duration, Cooldown Reduction]
- Fanaticism Aura r20 [Rite of Vengeance, Extra Passive Stack, Potency]
- Clash r4 [Punishment, Faith Generation, Crusader's March Effectiveness]
- Fortress r15 [Barricade, Unstoppable, Resolve Damage Bonus]

## Gear to chase

Affixes are in the order the agent picked them, most valuable first. Get the item, then the first affix, and so on.

| Slot | Item | Affixes | Temper |
|---|---|---|---|
| Helm | Exploiter's | +2,800 Shadow Resistance; +1,450 Maximum Life; +121 Strength; +100 All Stats | +2,000 Armor |
| Chest | Mantle of the Grey | +121 Strength (guaranteed); +2,500 Armor; +3 to Defiance Aura; +1,450 Maximum Life (enchant away the guaranteed +2 to Juggernaut Skills) | +1,500 Maximum Life |
| Gloves | Vanguard's | x50% Critical Strike Damage Multiplier; +8.5% Critical Strike Chance; x24% Physical Damage Multiplier; x28% Vulnerable Damage Multiplier | +50% Critical Strike Damage |
| Pants | Aspect of the Protector | +2,500 Armor; +1,450 Maximum Life; +121 Strength; +100 All Stats | +1,500 Maximum Life |
| Boots | Aspect of Retribution | +2,800 Shadow Resistance; +1,450 Maximum Life; +121 Strength; +100 All Stats | +15% Crowd Control Duration |
| Amulet | Blood-Mad Idol | +180 Strength (guaranteed); x50% Critical Strike Damage Multiplier; +8.5% Critical Strike Chance; x24% Physical Damage Multiplier (enchant away the guaranteed +10% Attack Speed) | +50% Critical Strike Damage |
| Ring | Aspect of the Juggernaut's Covenant | +5% Critical Strike Chance; x25% Critical Strike Damage Multiplier; x14% Vulnerable Damage Multiplier; x10% All Damage Multiplier | +50% Critical Strike Damage |
| Ring | Aspect of Lapa's Scripture | +5% Critical Strike Chance; x25% Critical Strike Damage Multiplier; x14% Vulnerable Damage Multiplier; x10% All Damage Multiplier | +50% Critical Strike Damage |
| Weapon | Vanquishing | x25% Critical Strike Damage Multiplier; +2,200 Maximum Life; +180 Strength; x10% All Damage Multiplier | +5% Critical Strike Chance |
| Off-hand | Herald of Zakarum | +180 Strength (guaranteed); +8.5% Critical Strike Chance; +2,500 Armor; 15% Damage Reduction | +1,500 Maximum Life |

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
| Physical | 87.5% | 239,465 |
| Fire | 97.9% | 1.5 million |
| Lightning | 97.9% | 1.5 million |
| Cold | 87.5% | 239,465 |
| Poison | 97.9% | 1.5 million |
| Shadow | 98.1% | 1.6 million |

Best next defensive affixes: Damage Reduction (+17.6% Effective Life), Maximum Life (+15.7% Effective Life), All Resistance (+11.6% Effective Life), Armor (+-14.8% Effective Life).

## Paragon

- **Boards:** Start, Relentless, Castle, Shield Bearer and Beacon (layout from Shield Charge, block engine (Agent search))
- **Glyphs:** Outmatch on Start (level 75), Imbiber on Relentless (level 75), Spirit on Castle (level 75), Retribution on Shield Bearer (level 75), Control on Beacon (level 75)

## Charms

- **Seal:** Seal of the Diamond Mind
- Rare charm: 15%[x] Critical Strike Damage; 15%[x] Vulnerable Damage
- Unique: The Grandfather
- Rare charm: +3 to Aura Skills; +100 All Stats
- Rare charm: +100 All Stats; +3 to Aura Skills
- Rare charm: +100 All Stats; +3 to Aura Skills
- Rare charm: +100 All Stats; +3 to Aura Skills

## Mercenaries

- **Hired:** Raheir
- **Reinforcement:** Aldkin (Field of Languish)

## Search log

- started from Shield Charge
- main skill upgrades: Relentless Charge, Resolve, Hit Count As Blocking
- starting point holds Pit 70
- engine: Movement, Lucky Hit, Thorns, Resolve (Juggernaut), Block, Crowd control, Retribution, Critical Strikes, Attack speed, Resource spending, Aura cast / Aura Potency; 15 payoffs left out for lack of a trigger
- gear searched (2 passes)
- paragon boards from Shield Charge, block engine (Agent search)
- gear searched again with the new boards
- reinforcement Aldkin -> Aldkin (Mercenary_CursedChild_Wither)
- charms: The Grandfather
- glyphs, mercenaries and charms searched
- took 4 seconds
