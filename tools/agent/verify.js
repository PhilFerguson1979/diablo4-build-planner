// node tools/agent/run.js --eval tools/agent/verify.js : every Build agent entry in the library loads and scores
const X = window.__D4X; const out = [];
for (const b of window.D4LIB.builds.filter(q => q.author === 'Build agent')) { let r; try { r = window.__D4LIB.libResolve(b, 0); } catch (e) { out.push({ name: b.name, err: String(e).slice(0, 120) }); continue; }
  X.setState(JSON.parse(JSON.stringify(r.st))); X.invalidate(); let sc = {}; try { sc = X.buildScore(); } catch (e) { sc = { err: String(e).slice(0, 120) }; }
  out.push({ cls: b.cls, name: b.name, skill: sc.name, pack: Math.round(sc.pack || 0), boss: Math.round(sc.boss || 0), notes: !!(r.st.notes && r.st.notes.about) }); }
return out;
