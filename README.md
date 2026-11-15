# D4 Build Planner

A Diablo IV build planner for every class, built on the game's own data files
(Season 15 live build 3.2.4.74043 and Season 16 PTR build 3.3.0.74145).

## Open it
Double-click `index.html`. It runs in any modern browser with no install and no server.
Your build saves automatically in that browser. Use "Copy share link" to send a build to someone.

## What's inside
- Skill tree for all 8 classes, laid out from the game's tree data, with live tooltips that scale with rank and upgrades.
- Gear slots with every aspect, unique, mythic and runeword your class can use.
- Charm sets with seal, Horadric jewelry and Hellfire Torch counting.
- Calculators: cooldown and uptime, Lucky Hit procs, damage multipliers with a best-next-upgrade list, and toughness.
- Codex search across aspects, uniques, runewords, charms and sets.

## Put it on the web for free (GitHub Pages)
1. In GitHub Desktop: File, New repository, name it `d4-build-planner`, and point it at this folder.
2. Publish the repository (it can be public or private on a paid plan; Pages on free accounts needs public).
3. On github.com open the repository, Settings, Pages, Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`, Save.
4. After a minute the site is live at `https://<your-username>.github.io/d4-build-planner/`.

## How Defense Theory Craft works out a hit

Confirmed, from the game files and checked against outside sources:
- Difficulty: each Pit tier multiplies monster damage and Life by the game's own table (DifficultyTiers). From Pit 11 to 110 that is 4.74% more damage and 17% more Life per tier; past 110 it is 2.37% damage and 32% Life; below Pit 10 the steps are bigger. Matches Maxroll and logged Pit and Tower tests. Torment 1 to 12 sit at Pit 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90 and 100.
- Base player Life: 50 at level 1, the same figure Selig testers measured on a level 1 Barbarian.
- Armor and resistance: 0.9 x rating / (rating + 5,100) for armor and + 1,020 for each resistance at level 70. This is Maxroll's level 70 formula written another way, and matches published Season 15 measurements. Armor, resistance and each Damage Reduction source multiply.
- Weakened: enemies deal 20% less if normal, 15% if elite and 10% if a boss.
- Overpower (Lord of Hatred): 15% additive damage per stack, up to 8 stacks.
- Order of operations: on-hit effects such as Fury are worked out from the hit before your defenses, and the damage you take after them (frame-by-frame Selig testing).

Not yet confirmed:
- How a monster's attack share and the level table build its raw hit. Players have logged hits for one-shot breakpoints and Pit scaling, but nobody has published this piece. One clean logged hit settles it, ideally read from Fury gained on a level 1 Barbarian (1 Fury = 1 raw Life), from a monster whose attack share is already in the planner.
- Level difference: the Character Level tooltip says damage is adjusted by the level gap. Monsters now match your level, so this is treated as old launch wording, not a formula term.
- Monster Life is an estimate, and boss Life is not in the files.
- Some Season 15 monsters (Blood Raven, Moon Lord, Vaeflare, the Greater Mummies and others) have blank damage in the files we have, so they are left out.

## How flat Thorns and Judgement are worked out

- Flat Thorns on powers: the game files store a share, and the game multiplies it by base Life at a level (50 x that level's Life scalar in LevelScaling). Checked against three databases: Aspect of Spiked Armor reads 1,361, 1,813 and 2,415 Thorns at levels 68, 73 and 78, each exactly 50 x the scalar, and Aspect of Lapa's Scripture matches at 1.5 times those levels. The planner uses level 75, the level the files give for 900 item power.
- Skills that grant Thorns (Defiance Aura's Rite of Thorns, Clash's Punishment) use their own formula on character level, read at level 70.
- The Paladin seal's flat Thorns line has no level in the files. It is read at level 70 like the gear affix it shares a formula with, and is not confirmed.
- Judgement: 80% weapon damage as Holy, 3 seconds after the mark lands (Paladin_Sub_Judgement). The Judicator Oath lets Core Judicator Skills set it off early, adds 100%[x] when it hits one enemy and 80%[x] damage taken by Judged enemies. How often it goes off in a real fight is not in the files, so the rate can be typed in.

## Updating game data
The `data` folder is generated from the DiabloTools d4data repository by `tools/extract.js` (paragon boards and glyphs come from `tools/paragon.js`, which it calls).

## Art credits

Skill tree art: Skill Icon Pack 4.0 by Wenrexa (img/skills), recoloured per damage type. Gear item art: Colorless Lab Fantasy RPG Item Icons, M-Xing Studio Vol. 41 and the RPG Weapons free sample (img/gear); the plate leggings are original. Charm art: Colorless Lab gems and Haunted Evidence Lite (img/charms). Interface frames: Cinder UI by Ashbloom Games (img/ui). All other artwork is original.
