/* Renders Diablo IV tooltip templates into HTML. Shared by Node and browser (window.D4T). */
(function (root) {
  const F = (typeof module !== 'undefined' && module.exports) ? require('./formula.js') : root.D4F;
  function fmtNum(v, digits) {
    if (typeof v !== 'number' || !isFinite(v)) return '?';
    if (digits === undefined) digits = Math.abs(v) >= 100 || Number.isInteger(Math.round(v * 10) / 10) && Math.round(v * 10) % 10 === 0 ? 0 : 1;
    const r = Number(v.toFixed(digits));
    return r.toLocaleString('en-US', { maximumFractionDigits: digits });
  }
  function fmtVal(val, fmt) {
    fmt = fmt || '';
    const dm = fmt.match(/\d/); const digits = dm ? +dm[0] : undefined;
    const suffix = (fmt.includes('%') ? '%' : '') + (fmt.includes('x') ? '[x]' : '') + (fmt.includes('+') ? '[+]' : '');
    if (val && typeof val === 'object') {
      const a = fmtNum(val.min, digits), b = fmtNum(val.max, digits);
      return (a === b ? a : '[' + a + ' – ' + b + ']') + suffix;
    }
    return fmtNum(val, digits) + suffix;
  }
  // ctx: { value(expr) -> number|{min,max}, token(name) -> number|{min,max}|string, cond(name) -> bool }
  function render(tpl, ctx) {
    if (!tpl) return '';
    let s = String(tpl);
    // conditionals (innermost first)
    for (let guard = 0; guard < 40 && /\{if:/.test(s); guard++) {
      s = s.replace(/\{if:([^}]*)\}((?:(?!\{if:)[\s\S])*?)(?:\{else\}((?:(?!\{if:)[\s\S])*?))?\{\/if\}/g, (m, c, a, b) => (ctx.cond ? ctx.cond(c.trim()) : false) ? a : (b || ''));
    }
    s = s.replace(/\{if:[^}]*\}|\{else\}|\{\/if\}/g, '');
    // bracket expressions [expr|fmt|]
    s = s.replace(/\[([^\[\]|]+?)(?:\|([^|\]]*)\|?)?\]/g, (m, expr, fmt) => {
      const inner = expr.replace(/\{([^}]+)\}/g, (q, n) => { const v = ctx.token ? ctx.token(n) : 0; return typeof v === 'object' && v ? `(${v.max})` : `(${+v || 0})`; });
      let v;
      if (/^\s*\{[^}]+\}\s*$/.test(expr)) v = ctx.token(expr.trim().slice(1, -1), fmt);
      else v = ctx.value ? ctx.value(inner, expr, fmt) : F.evaluate(inner, {});
      return '<b class="num">' + fmtVal(v, fmt) + '</b>';
    });
    // plain tokens {Name}
    s = s.replace(/\{(?!c_|\/c|u\}|\/u\}|icon:)([^{}]+)\}/g, (m, n) => {
      const v = ctx.token ? ctx.token(n) : undefined;
      if (v === undefined || v === null) return '';
      if (typeof v === 'string') return v;
      return '<b class="num">' + fmtVal(v) + '</b>';
    });
    // plural forms written as |4second;seconds after a number
    s = s.replace(/(<b class="num">([^<]*)<\/b>(?:\{\/c[a-z_]*\})?)\s*\|\d([A-Za-z]+)[;:]([A-Za-z]+);?/g, (m, pre, n, one, many) => pre + ' ' + (String(n).trim() === '1' ? one : many));
    s = s.replace(/\|\d([A-Za-z]+)[;:]([A-Za-z]+);?/g, (m, one, many) => many);
    s = s.replace(/\{icon:bullet[^}]*\}/g, '•').replace(/\{icon:[^}]*\}/g, '');
    s = s.replace(/\{c_([a-z_]+)\}/g, '<span class="c-$1">').replace(/\{\/c(?:_[a-z_]+)?\}/g, '</span>');
    s = s.replace(/\{u\}/g, '<u>').replace(/\{\/u\}/g, '</u>');
    s = s.replace(/\r?\n/g, '<br>');
    // balance spans
    const open = (s.match(/<span/g) || []).length, close = (s.match(/<\/span>/g) || []).length;
    if (close > open) { let extra = close - open; s = s.replace(/<\/span>/g, m => (extra-- > 0 ? '' : m)); }
    else if (open > close) s += '</span>'.repeat(open - close);
    return s;
  }
  const api = { render, fmtVal, fmtNum };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.D4T = api;
})(typeof window !== 'undefined' ? window : globalThis);
