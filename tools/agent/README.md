# Build agent tools

These scripts drive the planner's own maths to design and test builds for any class. The agent definition is `.claude/agents/d4-build-agent.md`. The synergy maps it reads are in `docs/synergies/`.

```bash
export NODE_PATH=/opt/npm-tools/node_modules
node tools/agent/run.js tools/agent/specs/<key>.json   # search, writes out/<key>.json
node tools/agent/save.js <key>                         # docs/builds/<key>.md and the planner library entry
node tools/agent/run.js --eval script.js               # run any script in the planner (LAB, LX, AGENT loaded)
```

- `lab.js`: damage lines, Effective Life, the gear search (item, four affixes and a temper for each slot), skill tree helpers and the Pit check.
- `labx.js`: the glyph, mercenary and charm searches.
- `pipeline.js`: `AGENT.build(spec)`. This is the whole search, ending in a report of damage, defence, caps, the Pit ladder, rotation facts, gear, glyphs, boards and charms.
- `save.js`: turns a result into planner notes, a chase list and a library entry.
- `specs/`: build ideas. Each file is one search, and the agent definition explains the format.
- `out/`: raw results.

A full search takes several minutes on two cores, because it tries every item in every slot.

## Changes, 23 Nov 2026
- Shield skills (Shield Bash, Shield Charge, Blessed Shield, Clash) deal no damage without a shield; a two-handed weapon can no longer win a shield build.
- Bastion of Sir Matthias: a retaliated Shield Bash is itself a Block when Shield Bash counts as Blocks, so the chain is counted, and Argent Veil's free casts block too.
- `LAB.line` now adds the damage that rides on the main line (Grief's poison, echoes and novas, gear procs) through `__D4X.riderDps(seg)`; pass `{ riders: false }` to leave them out. The build score does the same.
- Unique audit: The Furnace counts on elites, Windforce's triple damage, Protection of the Prime's Damage Reduction, Emblem of Staalbreak's Berserking, Nesekem's marked crits and Leoric's Crown gems are counted. Descriptions with no space after a full stop are now split into sentences.
