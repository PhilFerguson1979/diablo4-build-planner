/* Tiny expression evaluator for Diablo IV game-data formulas.
   Works in Node (module.exports) and the browser (window.D4F). */
(function (root) {
  function tokenize(src) {
    const t = []; let i = 0; const s = String(src);
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; t.push({ k: 'n', v: parseFloat(s.slice(i, j)) || 0 }); i = j; continue; }
      if (/[A-Za-z_#]/.test(c)) {
        let j = i;
        while (j < s.length) {
          if (/[A-Za-z0-9_#.]/.test(s[j])) { j++; continue; }
          if (s[j] === '"') { const e = s.indexOf('"', j + 1); if (e < 0) break; j = e + 1; continue; }
          break;
        }
        t.push({ k: 'id', v: s.slice(i, j) }); i = j; continue;
      }
      const two = s.slice(i, i + 2);
      if (['<=', '>=', '==', '!=', '&&', '||'].includes(two)) { t.push({ k: 'op', v: two }); i += 2; continue; }
      t.push({ k: 'op', v: c }); i++;
    }
    return t;
  }
  const PREC = { '?': 1, '||': 2, '&&': 3, '==': 4, '!=': 4, '<': 5, '>': 5, '<=': 5, '>=': 5, '+': 6, '-': 6, '*': 7, '/': 7, '%': 7 };
  const isFlag = n => n && n.k === 'id' && /^(Mod\.|SF\.)/.test(n.v);
  function parse(src) {
    const t = tokenize(src); let p = 0;
    const peek = () => t[p], next = () => t[p++];
    function primary() {
      const tk = next();
      if (!tk) return { k: 'n', v: 0 };
      if (tk.k === 'n') return tk;
      if (tk.k === 'op' && tk.v === '(') { const e = expr(0); if (peek() && peek().v === ')') next(); return e; }
      if (tk.k === 'op' && tk.v === '-') return { k: 'neg', a: primary() };
      if (tk.k === 'op' && tk.v === '!') return { k: 'not', a: primary() };
      if (tk.k === 'op' && tk.v === '+') return primary();
      if (tk.k === 'id') {
        if (peek() && peek().v === '(') {
          next(); const args = [];
          while (peek() && peek().v !== ')') { args.push(expr(0)); if (peek() && peek().v === ',') next(); else if (peek() && peek().v !== ')') next(); }
          next(); return { k: 'call', f: tk.v, args };
        }
        return tk;
      }
      return { k: 'n', v: 0 };
    }
    function expr(minP) {
      let left = primary();
      for (;;) {
        const tk = peek(); if (!tk || tk.k !== 'op') break;
        const pr = PREC[tk.v]; if (pr === undefined || pr < minP) break;
        next();
        if (tk.v === '?') {
          const a = expr(0); if (peek() && peek().v === ':') next(); const b = expr(1);
          // Designer intent: "X + Mod.Flag ? a : b" means X + (Mod.Flag ? a : b)
          if (left.k === 'bin' && ['+', '-', '*', '/'].includes(left.o) && isFlag(left.r)) {
            left = { k: 'bin', o: left.o, l: left.l, r: { k: 'tern', c: left.r, a, b } };
          } else left = { k: 'tern', c: left, a, b };
          continue;
        }
        const right = expr(pr + 1); left = { k: 'bin', o: tk.v, l: left, r: right };
      }
      return left;
    }
    try { return expr(0); } catch (e) { return { k: 'n', v: 0 }; }
  }
  const cache = new Map();
  function compile(src) { if (!cache.has(src)) cache.set(src, parse(src)); return cache.get(src); }
  function ev(n, ctx) {
    switch (n.k) {
      case 'n': return n.v;
      case 'id': { const r = ctx.id ? ctx.id(n.v) : undefined; return (r === undefined || r === null || isNaN(r)) ? 0 : r; }
      case 'neg': return -ev(n.a, ctx);
      case 'not': return ev(n.a, ctx) ? 0 : 1;
      case 'tern': return ev(n.c, ctx) ? ev(n.a, ctx) : ev(n.b, ctx);
      case 'bin': {
        const a = ev(n.l, ctx), b = ev(n.r, ctx);
        switch (n.o) {
          case '+': return a + b; case '-': return a - b; case '*': return a * b;
          case '/': return b === 0 ? 0 : a / b; case '%': return b === 0 ? 0 : a % b;
          case '<': return +(a < b); case '>': return +(a > b); case '<=': return +(a <= b); case '>=': return +(a >= b);
          case '==': return +(a === b); case '!=': return +(a !== b); case '&&': return +(!!a && !!b); case '||': return +(!!a || !!b);
        }
        return 0;
      }
      case 'call': {
        const f = n.f.toLowerCase(), A = n.args.map(x => ev(x, ctx));
        if (f === 'min') return Math.min(...A); if (f === 'max') return Math.max(...A);
        if (f === 'pow') return Math.pow(A[0], A[1]); if (f === 'floor') return Math.floor(A[0]);
        if (f === 'ceil') return Math.ceil(A[0]); if (f === 'round') return Math.round(A[0]); if (f === 'abs') return Math.abs(A[0]);
        if (f === 'sqrt') return Math.sqrt(A[0]);
        if (f === 'table') return ctx.table ? ctx.table(A[0], A[1]) : 0;
        if (ctx.call) { const r = ctx.call(n.f, A); if (r !== undefined) return r; }
        return 0;
      }
    }
    return 0;
  }
  function evaluate(src, ctx) { if (src === undefined || src === null || src === '') return 0; return ev(compile(String(src)), ctx || {}); }
  const api = { evaluate, compile };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.D4F = api;
})(typeof window !== 'undefined' ? window : globalThis);
