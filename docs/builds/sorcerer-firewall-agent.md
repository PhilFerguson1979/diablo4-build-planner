# Firewall, agent search (Sorcerer)

*Made by the build agent on 2026-11-22. Everything below comes from the planner's maths and has not been checked in game.*

## The idea

Firewall keeps enemies Burning all the time, so every Burning payoff and Aspect of Disobedience (Damage Reduction from damage over time) stay on. A test of the agent on another class, starting from the meta Firewall build.

## Numbers

- **Damage against elites:** 98.85 billion a second
- **Build score:** 98.85 billion on packs, 72.02 billion on bosses
- **Effective Life:** 484,924 (Life 20,293, Armor 12,150, Block 0%)
- **Pit check:** kills an elite before it dies up to Pit 100; the starting build managed below 60 by the same test. The planner's Pit model is harsher than the game, so use it to compare builds, not as a promise.
- **Started from:** Firewall: build score 71.7 million on packs, 71.7 million on bosses, 161,292 Effective Life

| Pit | Elite dies in | Elite kills you in | Biggest hit | Your Life |
|---|---|---|---|---|
| 60 | 0 s | 0 s | 3,250 | 20,293 |
| 70 | 0 s | 0 s | 5,165 | 20,293 |
| 80 | 0.1 s | 10.7 s | 8,208 | 20,293 |
| 90 | 0.3 s | 3.7 s | 13,044 | 20,293 |
| 100 | 1.4 s | 1.8 s | 20,730 | 20,293 |
| 110 | 6.8 s | 1 s | 32,944 | 20,293 |
| 120 | 109 s | 0.8 s | 41,643 | 20,293 |
| 130 | 1750.2 s | 0.6 s | 52,638 | 20,293 |
| 140 | 28107.8 s | 0.5 s | 66,536 | 20,293 |
| 150 | 451405.6 s | 0.3 s | 84,103 | 20,293 |

## How it works

- **Crowd control:** made by Shivering, Aspect of Retribution, Ice Armor > Frozen and Chill, Hydra > Frigid Hydra, Meteor > Immobilize and Control; paid off by Exploiter's, Aspect of Retribution, Blue Rose, Vanquishing, Ice Armor > Frozen and Chill and Control.
- **Damage over time:** made by Blood-Mad Idol, Meteor, Meteor > Shooting Star, Inferno, Fire Bolt and Firewall; paid off by Aspect of Disobedience and Blood-Mad Idol.
- **Burning:** made by Blood-Mad Idol, Meteor, Meteor > Shooting Star, Inferno, Fire Bolt and Firewall; paid off by Blood-Mad Idol, Meteor, Meteor > Shooting Star, Fire Bolt and Firewall.
- **Lucky Hit:** made by Hydra, Meteor, Teleport, Inferno, Fire Bolt and Chain Lightning; paid off by Blue Rose and Firewall > Grounding.
- **Crackling Energy:** made by Firewall > Grounding and Charged; paid off by Charged.
- **Frozen and Chilled:** made by Shivering, Ice Armor > Frozen and Chill, Hydra > Frigid Hydra and Control; paid off by Control.

## Rotation

- **Firewall:** your main skill. Cast it as much as you can.
- **Hydra:** spends resource. Cast it between Firewall casts when you have resource to spare, or keep it up if it summons or lingers.
- **Fire Bolt:** spends resource. Cast it between Firewall casts when you have resource to spare, or keep it up if it summons or lingers.
- **Teleport:** cast on cooldown (every 10 seconds after Cooldown Reduction).
- **Chain Lightning:** spends resource. Cast it between Firewall casts when you have resource to spare, or keep it up if it summons or lingers.
- **Inferno:** Ultimate. Cast it on cooldown (every 12 seconds after Cooldown Reduction), ideally when elites or the boss are in range.

## Skills

- Ice Armor r14 [Permafrost, Frozen and Chill, Cooldown Reduction]
- Hydra r6 [Frigid Hydra, Overpower, Cooldown Reduction]
- Meteor r15 [Shooting Star, Immobilize, Overpower]
- Teleport r18 [Blaze, Weaken, Ferocity]
- Inferno r20 [Lifecoil, Overpower, Cooldown Reduction]
- Fire Bolt r6 [Overpower]
- Chain Lightning r6 [Chain Whipping, Additional Chains]
- Firewall r50 [Grounding, Healing, Damage Bonus]

## Gear to chase

Affixes are in the order the agent picked them, most valuable first. Get the item, then the first affix, and so on.

| Slot | Item | Affixes | Temper |
|---|---|---|---|
| Helm | Vision of the Firestorm | +1,450 Maximum Life; +121 Intelligence; +100 All Stats; +2,800 Shadow Resistance | +2,000 Armor |
| Chest | Exploiter's | +2,500 Armor; +1,450 Maximum Life; +2,800 Fire Resistance; +121 Intelligence | +2,000 Armor |
| Gloves | Shivering | x50% Critical Strike Damage Multiplier; +8.5% Critical Strike Chance; x24% Lightning Damage Multiplier; x28% Vulnerable Damage Multiplier | +50% Critical Strike Damage |
| Pants | Aspect of Disobedience | +2,500 Armor; +1,450 Maximum Life; +121 Intelligence; +100 All Stats | +1,500 Maximum Life |
| Boots | Aspect of Retribution | +3 to Firewall; +1,450 Maximum Life; +121 Intelligence; +100 All Stats | +15% Crowd Control Duration |
| Amulet | Blood-Mad Idol | x50% Critical Strike Damage Multiplier; +8.5% Critical Strike Chance; x24% Lightning Damage Multiplier; x28% Vulnerable Damage Multiplier | +50% Critical Strike Damage |
| Ring | Blue Rose | +5% Critical Strike Chance; x25% Critical Strike Damage Multiplier; +10% Attack Speed; x10% All Damage Multiplier | +50% Critical Strike Damage |
| Ring | Ring of Starless Skies | +15% Attack Speed (fixed); +12% Critical Strike Chance (fixed); +12.5% Lucky Hit Chance (fixed); +2 to 2 Skills (fixed) | +50% Critical Strike Damage |
| Weapon | Vanquishing | x25% Critical Strike Damage Multiplier; +2,200 Maximum Life; +180 Intelligence; x10% Lightning Damage Multiplier | +5% Critical Strike Chance |
| Off-hand | Spirit | +5 to All Skills (fixed); +25% Attack Speed (fixed); x50% All Damage Multiplier (fixed); +20 Maximum Resource (fixed) | +1,500 Maximum Life |

## Caps

| Stat | Now | Cap |
|---|---|---|
| Attack Speed Bonus | 63.8% | 100% |
| Critical Strike Chance | 39% | 100% |
| Block Chance | 0% | 100% |
| Cooldown Reduction | 0% | 75% |
| Lucky Hit Chance Bonus | 17.5% | 100% |

| Element | Damage reduction | Effective Life |
|---|---|---|
| Physical | 88.9% | 182,339 |
| Fire | 97.8% | 902,208 |
| Lightning | 96.5% | 573,942 |
| Cold | 96.5% | 573,942 |
| Poison | 96.5% | 573,942 |
| Shadow | 97.8% | 902,208 |

Best next defensive affixes: Damage Reduction (+17.6% Effective Life), Maximum Life (+17.6% Effective Life), All Resistance (+15.1% Effective Life), Armor (+13.5% Effective Life).

## Paragon

- **Boards:** Start, Ceaseless Conduit, Enchantment Master, Static Surge and Frigid Fate (layout from Chain Lightning (Min/Max Version Paragon +200))
- **Glyphs:** Elementalist on Start (level 75), Destruction on Ceaseless Conduit (level 75), Charged on Enchantment Master (level 75), Control on Static Surge (level 75), Flamefeeder on Frigid Fate (level 75)

## Charms

- **Seal:** Seal of the Diamond Mind
- Rare charm: 15%[x] Critical Strike Damage; +3 to Firewall
- Rare charm: 15%[x] Vulnerable Damage; +3 to Firewall
- Unique: Banished Lord's Talisman
- Rare charm: +10% Attack Speed; +3 to Firewall
- Rare charm: +3 to Firewall; +3 to Mastery Skills
- Rare charm: +3 to Firewall; +3 to Mastery Skills

## Mercenaries

- **Hired:** Aldkin
- **Reinforcement:** Raheir (Provoke)

## Search log

- started from Firewall
- main skill upgrades: Grounding, Healing, Damage Bonus
- starting point holds Pit 0
- engine: Movement, Crowd control, Frozen and Chilled, Cooldowns, Lucky Hit, Enchantments and Conjurations, Overpower, Damage over time, Burning, Crackling Energy, Ultimates; 1 payoffs left out for lack of a trigger
- gear searched (2 passes)
- paragon boards from Chain Lightning (Min/Max Version Paragon +200)
- gear searched again with the new boards
- Paragon_Sorc_02: Exploit -> Flamefeeder
- hired Subo -> Aldkin
- reinforcement Aldkin -> Raheir (NPC_Mercenary_ShieldBearer_Provoke)
- charms: Banished Lord's Talisman
- glyphs, mercenaries and charms searched
- took 2 seconds
