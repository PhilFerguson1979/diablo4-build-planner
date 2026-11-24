# Argent Veil, Shield Bash with Bastion (Paladin)

*Made by the build agent on 2026-11-24. Everything below comes from the planner's maths and has not been checked in game.*

## The idea

Argent Veil makes Arbiter's Evade cast Shield Bash every 2 meters. Every Shield Bash counts as a Block, and Bastion of Sir Matthias gives each Block a 15% chance to retaliate with another Shield Bash, which is itself a Block, so the chain feeds itself. Bastion also makes Shield Bash hit 80 to 100% [x] harder and adds a chance to deal double damage.

## Numbers

- **Damage against elites:** 285.97 billion a second
- **Build score:** 285.97 billion on packs, 208.34 billion on bosses
- **Effective Life:** 1.2 million (Life 21,039, Armor 46,467, Block 30%)
- **Pit check:** kills an elite before it dies up to Pit 110; the starting build managed below 60 by the same test. The planner's Pit model is harsher than the game, so use it to compare builds, not as a promise.
- **Started from:** Arbiter Wing Strikes: build score 4.1 million on packs, 4.1 million on bosses, 151,356 Effective Life

| Pit | Elite dies in | Elite kills you in | Biggest hit | Your Life |
|---|---|---|---|---|
| 60 | 0 s | 0 s | 1,563 | 21,039 |
| 70 | 0 s | 0 s | 2,484 | 21,039 |
| 80 | 0 s | 78.8 s | 3,948 | 21,039 |
| 90 | 0.1 s | 12.8 s | 6,274 | 21,039 |
| 100 | 0.5 s | 5.7 s | 9,971 | 21,039 |
| 110 | 2.3 s | 3.1 s | 15,847 | 21,039 |
| 120 | 37.7 s | 2.3 s | 20,031 | 21,039 |
| 130 | 605 s | 1.8 s | 25,319 | 21,039 |
| 140 | 9716.2 s | 1.4 s | 32,004 | 21,039 |
| 150 | 156039.3 s | 1.1 s | 40,454 | 21,039 |

## How it works

- **Evade and Dodge:** made by Juggernaut's and Argent Veil; paid off by Juggernaut's.
- **Crowd control:** made by Aegis, Shield Bash > Smite, Condemn and Control; paid off by Exploiter's, Vanquishing, Aspect of Chastisement and Control.
- **Movement:** made by Exploiter's, Defiance Aura, Defiance Aura > Unstoppable, Arbiter of Justice > Movement Speed, Condemn and Condemn > Movement Speed; paid off by Argent Veil and Condemn.
- **Block:** made by Aegis and Shield Bash > Hits Are Blocks; paid off by Bastion of Sir Matthias.
- **Resource spending:** made by Fanaticism Aura > Resource Generation; paid off by Fanaticism Aura.
- **Critical Strikes:** made by Fanaticism Aura and Locran's Talisman; paid off by Fanaticism Aura > Rite of Vengeance, The Grandfather and Locran's Talisman.
- **Vulnerable:** made by Fanaticism Aura > Rite of Humility, Arbiter of Justice > Seraph's Wings and Condemn > Gather the Guilty; paid off by Fanaticism Aura > Rite of Humility.
- **Arbiter form:** made by Arbiter of Justice > Seraph's Wings, Arbiter of Justice > Wing Strike Recast, Arbiter of Justice > Movement Speed and Arbiter; paid off by Arbiter of Justice > Seraph's Wings, Arbiter of Justice > Wing Strike Recast, Arbiter of Justice > Movement Speed and Arbiter.
- **Fortify, Barrier, Healthy:** made by Fanaticism Aura > Rite of Redemption; paid off by Outmatch and Imbiber.

## Rotation

- **Condemn:** cast on cooldown (every 11.25 seconds after Cooldown Reduction).
- **Arbiter of Justice:** Ultimate. Cast it on cooldown (every 114 seconds after Cooldown Reduction), ideally when elites or the boss are in range.
- **Fanaticism Aura:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect (every 14.25 seconds after Cooldown Reduction).
- **Defiance Aura:** Aura. Its passive stays on while it is on your bar. Cast it on cooldown for the active effect (every 19 seconds after Cooldown Reduction).
- **Aegis:** cast on cooldown (every 15.2 seconds after Cooldown Reduction).
- **Shield Bash:** your main skill. Cast it as much as you can.

## Skills

- Defiance Aura r11 [Rite of Might, Rite of Prayer, Rite of Thorns, Maximum Life, Bonus Healing, Potency, Unstoppable]
- Aegis r24 [Stay Resolute, Duration, Cooldown Reduction]
- Shield Bash r29 [Smite, Hits Are Blocks, Size Bonus]
- Fanaticism Aura r18 [Rite of Vengeance, Rite of Humility, Rite of Redemption, Additional Maximum Resource, Extra Passive Stack, Resource Generation, Potency]
- Arbiter of Justice r8 [Seraph's Wings, Wing Strike Recast, Movement Speed]
- Condemn r4 [Gather the Guilty, Cooldown Reduction, Movement Speed]

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
| Physical | 94.6% | 393,028 |
| Fire | 99.1% | 2.4 million |
| Lightning | 94.6% | 393,028 |
| Cold | 94.6% | 393,028 |
| Poison | 94.6% | 393,028 |
| Shadow | 99.1% | 2.4 million |

Best next defensive affixes: Damage Reduction (+17.6% Effective Life), Maximum Life (+15.7% Effective Life), All Resistance (+10% Effective Life), Armor (+-18.5% Effective Life).

## Paragon

- **Boards:** Start, Relentless, Castle, Shield Bearer and Beacon (layout from Argent Veil, Shield Bash with Bastion (Agent search))
- **Glyphs:** Outmatch on Start (level 75), Arbiter on Relentless (level 75), Imbiber on Castle (level 75), Challenger on Shield Bearer (level 75), Control on Beacon (level 75)

## Charms

- **Seal:** Seal of the Diamond Mind, with the unique swap (socket the uniques under the Golden Epiphany, then swap to the Diamond Mind)
- **Season 16 Horadric jewelry:** both rings and the amulet with +1 to Cathan's Iron Conviction, so one charm plus 3 points makes its 5-piece. The Hellfire Torch's +1 goes to Cathan's Dauntless Faith for its 2-piece.
- Set: Cathan's Dauntless Faith (+3 to Juggernaut Skills; 15%[x] Vulnerable Damage)
- Set: Cathan's Iron Conviction (15%[x] Critical Strike Damage; +3 to Juggernaut Skills)
- Unique: Hellfire Torch
- Unique: The Grandfather
- Unique: Locran's Talisman
- Unique: The Furnace

## Mercenaries

- **Hired:** Varyana
- **Reinforcement:** Aldkin (Field of Languish)

## Search log

- started from Arbiter Wing Strikes
- main skill upgrades: Lay Siege, Hits Are Blocks, Size Bonus
- starting point holds Pit 0
- engine: Movement, Lucky Hit, Resolve (Juggernaut), Block, Crowd control, Critical Strikes, Attack speed, Vulnerable, Arbiter form, Cooldowns, Aura cast / Aura Potency, Evade and Dodge; 12 payoffs left out for lack of a trigger
- gear searched (2 passes)
- paragon boards from Argent Veil, Shield Bash with Bastion (Agent search)
- gear searched again with the new boards
- hired Raheir -> Varyana
- reinforcement Aldkin -> Aldkin (Mercenary_CursedChild_Wither)
- charms: The Grandfather
- talisman: Seal of the Diamond Mind (unique swap), Cathan's Dauntless Faith 2-piece (+Torch), Cathan's Iron Conviction 5-piece (3 Horadric), Hellfire Torch, The Grandfather, Locran's Talisman, The Furnace (189 layouts tried, 3 Horadric jewelry points)
- glyphs, mercenaries and charms searched
- took 1111 seconds
