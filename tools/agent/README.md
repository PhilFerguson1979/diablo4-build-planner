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
