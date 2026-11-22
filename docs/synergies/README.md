# Synergy maps

One file per class. Each one tells the build agent (and you) which parts of a build feed each other, so builds are made of pieces that work in concert instead of a pile of good stats.

- [Barbarian](barbarian.md)
- [Druid](druid.md)
- [Necromancer](necromancer.md)
- [Rogue](rogue.md)
- [Sorcerer](sorcerer.md)
- [Spiritborn](spiritborn.md)
- [Paladin](paladin.md)
- [Warlock](warlock.md)

## The method

1. **Pick the engine.** The engine is the thing the build does all the time, like blocking, moving, casting Auras, dealing damage over time, crowd control, spending resource or keeping a form up.
2. **Make the main skill feed it.** Usually a skill upgrade does this, such as Shield Charge hits counting as blocks, Poison Imbuement turning a skill into damage over time, or Grizzly Rage keeping Werebear up.
3. **Stack payoffs for that engine.** [x] multiplicative beats [+] additive.
4. **Close the loop.** Something should turn the payoff back into more of the engine, for example block → cooldowns → more blocks.
5. **Pick glyphs and Paragon nodes for the engine.** Glyphs reward a stat or a state the build already keeps up.
6. **Check defence the same way.** A damage-over-time engine also turns on Aspect of Disobedience, so the engine can pay for survivability too.

## Each class file

- **Engines:** written notes on what the class's builds run on.
- **How the meta builds link up:** for every current meta build in the planner's library, the mechanics its own parts both make and pay off. These are proven pairings.
- **Full lists by mechanic:** every skill, upgrade, aspect, unique, runeword, charm, set, Paragon node and glyph, sorted by the mechanics it makes and pays off.
- **Glyphs and Paragon legendary nodes.**

The lists were sorted by matching words in the game text. Expect a few wrong entries. The meta build pairings and the tested rules are the most reliable parts.

## Rules for every class (tested or confirmed)

- **Grief** copies 40% of the finished hit as poison. Anything that scales the hit scales the poison. It procs from aura pulses and from Dawnfire.
- **Aspect of Disobedience** gives Damage Reduction each time your damage over time ticks, stacking up to 30 times. Any build with damage over time can run it. Grief, Poison Imbuement, Burning, Bleeding and Blight all turn it on. Phil found this on Auradin with Grief, where it is the largest single Damage Reduction available. It also appears in meta Barbarian Charge, Sorcerer Firewall and Blizzard, Druid Rabies and Spiritborn builds.
- **Stone of Jordan** uses whichever element you have the highest resistance in.
- **Heir of Perdition and The Grandfather** were nerfed, not removed. Only their guaranteed affixes changed: Heir now guarantees Movement Speed only and The Grandfather Critical Strike Chance only. Their powers still work, so the optimizer keeps them in the pool.
- **Fists of Fate, Blood-Mad Idol and Reaver** proc from aura pulses and Dawnfire. **Phoenix's "Attacks" spears do not** proc from auras.

## Rules for the optimizer and the build agent

`data/synergy-tags.json` has every class under `classes.<Class>`. Each power has `makes` (the mechanics it creates) and `pays` (the mechanics it pays off).

1. **Engine first.** Find what the main skill line makes all the time.
2. **A payoff only counts with its engine.** A block payoff on a build that never blocks is dead weight, even if the maths shows a small gain from its stat line.
3. **Closed loops win.** A power that pays one engine mechanic and makes another beats one that only pays.
4. **Then pure numbers.** Among powers that fit, [x] beats [+]. Confirm every choice with the planner's maths: the boss score and Effective Life, never tags alone.
5. **Tell the user what the maths can't see.** If a synergy is in the tags but the planner doesn't model it, the agent says so in the build notes.
