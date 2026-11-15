/* Original emblem and frame artwork for Sanctuary Ledger (window.D4ART). */
(function (root) {
  'use strict';
  // Motif paths drawn in a 100 x 100 box centred on 0,0.
  const M = {
    strike: 'M-30 30 L28 -28 M14 -30 L30 -30 L30 -14 M-34 14 L-14 34',
    burst: 'M0 -38 L8 -10 L38 0 L8 10 L0 38 L-8 10 L-38 0 L-8 -10 Z',
    crown: 'M-30 18 L-30 -14 L-14 2 L0 -26 L14 2 L30 -14 L30 18 Z M-30 26 H30',
    rings: 'M0 -34 A34 34 0 1 1 -0.1 -34 Z M0 -20 A20 20 0 1 1 -0.1 -20 Z M0 -6 A6 6 0 1 1 -0.1 -6 Z',
    shield: 'M0 -36 L28 -24 V2 C28 20 14 30 0 36 C-14 30 -28 20 -28 2 V-24 Z M0 -22 V22 M-14 -4 H14',
    spear: 'M0 -38 L10 -18 L4 -18 L4 36 L-4 36 L-4 -18 L-10 -18 Z',
    hammer: 'M-26 -30 H26 V-10 H-26 Z M-5 -10 H5 V36 H-5 Z',
    flame: 'M0 -38 C14 -18 26 -6 18 14 C14 26 4 34 0 34 C-4 34 -14 26 -18 14 C-24 -2 -10 -10 -6 -24 C-2 -14 4 -12 0 -38 Z',
    bolt: 'M8 -38 L-16 4 H0 L-8 38 L18 -6 H2 Z',
    frost: 'M0 -36 V36 M-31 -18 L31 18 M-31 18 L31 -18 M-8 -28 L0 -20 L8 -28 M-8 28 L0 20 L8 28',
    drop: 'M0 -36 C12 -14 24 0 24 12 A24 24 0 0 1 -24 12 C-24 0 -12 -14 0 -36 Z',
    eye: 'M-36 0 C-20 -22 20 -22 36 0 C20 22 -20 22 -36 0 Z M0 -10 A10 10 0 1 1 -0.1 -10 Z',
    wing: 'M-4 30 C-30 20 -38 -10 -30 -34 C-20 -20 -12 -18 -4 -24 Z M4 30 C30 20 38 -10 30 -34 C20 -20 12 -18 4 -24 Z',
    cross: 'M-8 -34 H8 V-8 H34 V8 H8 V34 H-8 V8 H-34 V-8 H-8 Z',
    chevrons: 'M-26 -24 L0 -4 L26 -24 M-26 0 L0 20 L26 0 M-26 24 L0 40 L26 24',
    claw: 'M-24 -32 C-14 -10 -14 10 -24 32 M0 -36 C10 -12 10 12 0 36 M24 -32 C34 -10 34 10 24 32',
    orb: 'M0 -30 A30 30 0 1 1 -0.1 -30 Z M-12 -14 A10 10 0 0 1 4 -20',
    hourglass: 'M-22 -34 H22 M-22 34 H22 M-18 -34 C-18 -10 18 -10 18 0 C18 10 -18 10 -18 34 M18 -34 C18 -10 -18 -10 -18 0 C-18 10 18 10 18 34',
    target: 'M0 -32 A32 32 0 1 1 -0.1 -32 Z M0 -16 A16 16 0 1 1 -0.1 -16 Z M0 -40 V-24 M0 24 V40 M-40 0 H-24 M24 0 H40',
    expand: 'M-34 -34 L-12 -12 M-34 -34 H-16 M-34 -34 V-16 M34 34 L12 12 M34 34 H16 M34 34 V16 M34 -34 L12 -12 M34 -34 H16 M34 -34 V-16 M-34 34 L-12 12 M-34 34 H-16 M-34 34 V16',
    heart: 'M0 32 C-30 10 -36 -6 -30 -20 C-24 -34 -6 -32 0 -18 C6 -32 24 -34 30 -20 C36 -6 30 10 0 32 Z',
    stack: 'M-30 -18 L0 -32 L30 -18 L0 -4 Z M-30 0 L0 14 L30 0 M-30 18 L0 32 L30 18',
    clock: 'M0 -34 A34 34 0 1 1 -0.1 -34 Z M0 -20 V0 L16 12',
    multi: 'M-30 20 L-6 -20 M-10 26 L14 -14 M10 32 L34 -8',
    fork: 'M0 34 V4 M0 4 L-24 -26 M0 4 L24 -26 M0 4 V-30',
    plus: 'M0 -26 V26 M-26 0 H26',
    blade: 'M0 -38 L8 -26 L8 22 L18 22 L18 28 L4 28 L4 38 L-4 38 L-4 28 L-18 28 L-18 22 L-8 22 L-8 -26 Z',
  };
  const RULES = [
    [/ultimate|wrath|judgement day|arbiter of|heaven'?s fury|army|cataclysm|deep freeze|inferno|shadow clone|petrify|iron maelstrom|call of the ancients|rain of arrows|bone storm|blood wave|grizzly|lacerate|death trap/i, 'crown'],
    [/aura/i, 'rings'],
    [/shield|bash|charge|block|aegis|fortress|clash|bulwark|iron skin|armor/i, 'shield'],
    [/spear|lance|arrow|shot|barrage|javelin|impale|thrust|penetrat|rain/i, 'spear'],
    [/hammer|smash|stomp|quake|leap|slam|upheaval|landslide|boulder|earth/i, 'hammer'],
    [/fire|flame|incinerat|meteor|ember|burn|blaze|hydra|scream|hellfire/i, 'flame'],
    [/lightning|shock|bolt|storm|spark|charged|thunder|chain/i, 'bolt'],
    [/frost|ice|cold|blizzard|freez|chill|glacial|frozen/i, 'frost'],
    [/poison|toxic|blight|venom|creeper|plague|rot/i, 'drop'],
    [/shadow|dark|hex|curse|decrepify|iron maiden|eye|sigil|abyss/i, 'eye'],
    [/wing|ascen|zenith|falling star|disciple|soar/i, 'wing'],
    [/rally|prayer|purify|heal|consecrat|blessed|holy|light|condemn|sanct/i, 'cross'],
    [/advance|dash|teleport|evade|step|rush|sprint|leap|vault|shadow step|soar/i, 'chevrons'],
    [/claw|maul|rend|shred|rip|feral|wolf|bear|jaguar|eagle|gorilla|centipede|quill|swarm/i, 'claw'],
    [/orb|bone|corpse|golem|skeleton|familiar|summon|minion|companion|raven/i, 'orb'],
    [/zeal|brandish|blade|sword|whirlwind|flurry|twist|cleave|rupture|frenzy|double swing/i, 'blade'],
  ];
  const COLORS = { Holy: '#f1cf7a', Fire: '#ef8a4c', Lightning: '#b9b6ff', Cold: '#9fd4ef', Poison: '#9fd27a', Shadow: '#b48be0', Physical: '#cfc6b4', '': '#d9c9a3' };
  const hash = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  function motifFor(name, tags) {
    const hay = [name, ...(tags || [])].join(' ');
    for (const [re, m] of RULES) if (re.test(hay)) return m;
    const keys = Object.keys(M); return keys[hash(name) % keys.length];
  }
  const MOD_RULES = [
    [/cooldown|recharge|charges?\b/i, 'hourglass'], [/critical/i, 'target'], [/size|radius|area|larger|wider/i, 'expand'],
    [/heal|life|barrier|fortif/i, 'heart'], [/duration|seconds longer|lasts/i, 'clock'], [/stack/i, 'stack'],
    [/additional|extra|twice|projectile|again|repeat/i, 'multi'], [/resource|faith|fury|mana|spirit|essence|energy|vigor|cost/i, 'drop'],
    [/damage reduction|block|resist|armor|unstoppable/i, 'shield'], [/vulnerable|weaken|stun|daze|slow|immobil|knock|fear|chill|freez/i, 'eye'],
    [/damage|deal/i, 'burst'],
  ];
  function modMotif(name, text) { const hay = (name || '') + ' ' + String(text || '').replace(/<[^>]+>/g, ''); for (const [re, m] of MOD_RULES) if (re.test(name || '')) return m; for (const [re, m] of MOD_RULES) if (re.test(hay)) return m; return 'burst'; }
  const motif = (m, col, scale) => `<path d="${M[m]}" transform="scale(${scale || 1})" fill="none" stroke="${col}" stroke-width="${5 / (scale || 1)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  function emblem(name, tags, dmg, scale) {
    const m = motifFor(name, tags); const col = COLORS[dmg || ''] || COLORS[''];
    const k = scale || 1;
    return `<path d="${M[m]}" transform="scale(${k})" fill="none" stroke="${col}" stroke-width="${5 / k}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  // Generic gear slot glyphs (simple outlines, original).
  const SLOT = {
    helm: 'M-24 10 C-24 -20 -12 -30 0 -30 C12 -30 24 -20 24 10 L14 10 L14 0 L-14 0 L-14 10 Z M-4 0 V22 M4 0 V22',
    chest: 'M-24 -24 L-10 -30 C-6 -22 6 -22 10 -30 L24 -24 L20 0 L24 28 H-24 L-20 0 Z',
    gloves: 'M-14 30 V-6 L-22 -18 L-16 -24 L-10 -14 V-30 H-2 V-12 V-32 H6 V-12 V-28 H14 V0 C14 14 10 22 10 30 Z',
    pants: 'M-20 -28 H20 L24 30 H6 L0 -6 L-6 30 H-24 Z',
    boots: 'M-14 -30 H6 V8 L26 16 V28 H-14 Z',
    amulet: 'M-22 -30 C-22 -6 22 -6 22 -30 M0 -8 L12 8 L0 28 L-12 8 Z',
    ring: 'M0 -12 A20 20 0 1 1 -0.1 -12 Z M0 -4 A12 12 0 1 1 -0.1 -4 Z M-8 -18 L0 -30 L8 -18 Z',
    weapon: 'M-28 28 L18 -18 M10 -26 L26 -10 M24 -32 L32 -24 L26 -18 L18 -26 Z M-30 18 L-18 30',
    offhand: 'M0 -32 L24 -22 V0 C24 16 12 26 0 32 C-12 26 -24 16 -24 0 V-22 Z',
    charm: 'M0 -26 L22 0 L0 26 L-22 0 Z M0 -12 L10 0 L0 12 L-10 0 Z',
  };
  const slotGlyph = (id, col) => `<path d="${SLOT[id] || SLOT.charm}" fill="none" stroke="${col || '#8f7a58'}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`;

  // ---------- class crests (0..32 box) ----------
  const CREST = {
    Barbarian: { fill: 'M20.5 2 C26 2.5 29.5 6.5 29.5 11 C27.5 9.8 25.4 9.6 23.6 10.4 L22.4 9.2 C23.2 7.4 23 5.3 20.5 2 Z M26.5 15.2 C25 19.8 20.6 21.6 16.8 20.2 C18.2 18.6 18.8 16.4 18.2 14.6 L19.4 13.4 C21.4 14.6 23.8 15.2 26.5 15.2 Z M11.5 2 C6 2.5 2.5 6.5 2.5 11 C4.5 9.8 6.6 9.6 8.4 10.4 L9.6 9.2 C8.8 7.4 9 5.3 11.5 2 Z M5.5 15.2 C7 19.8 11.4 21.6 15.2 20.2 C13.8 18.6 13.2 16.4 13.8 14.6 L12.6 13.4 C10.6 14.6 8.2 15.2 5.5 15.2 Z', stroke: 'M5 29.5 L22.5 10.5 M27 29.5 L9.5 10.5', dark: '' },
    Druid: { fill: 'M16 30 L11.5 25.5 L7 21.5 L4.6 13 L3.5 2 L10.5 8.2 L16 7.2 L21.5 8.2 L28.5 2 L27.4 13 L25 21.5 L20.5 25.5 Z M9.4 15.2 L13.6 16.6 L12.4 18 Z M22.6 15.2 L18.4 16.6 L19.6 18 Z M14 24.6 H18 L16 26.8 Z', dark: 'M16 9.5 V22 M6.6 6.6 L9 13 M25.4 6.6 L23 13', eyes: [[12, 16.9], [20, 16.9]] },
    Necromancer: { fill: 'M16 3 C9 3 4.5 8 4.5 14 C4.5 18 6.5 20.5 8.5 21.5 V25 C8.5 26.2 9.4 27.2 10.6 27.2 H21.4 C22.6 27.2 23.5 26.2 23.5 25 V21.5 C25.5 20.5 27.5 18 27.5 14 C27.5 8 23 3 16 3 Z M9 13.6 C9 11.6 10.6 10.6 12.6 11.1 C14.1 11.6 14.3 13.6 13.7 15.1 C13.1 16.6 11.1 17.1 10.1 16.5 C9.4 16.1 9 15.1 9 13.6 Z M23 13.6 C23 11.6 21.4 10.6 19.4 11.1 C17.9 11.6 17.7 13.6 18.3 15.1 C18.9 16.6 20.9 17.1 21.9 16.5 C22.6 16.1 23 15.1 23 13.6 Z M16 17.4 L14.5 20.4 H17.5 Z', dark: 'M12.6 23 V27 M15 23 V27 M17.4 23 V27 M19.8 23 V27 M10.5 22.6 H21.5 M11 5.5 C12.5 7 13 8.6 12.6 10', eyes: [[11.5, 13.9], [20.5, 13.9]] },
    Paladin: { fill: 'M16 2.5 L27 7.5 V16 C27 22.5 22 27.5 16 30 C10 27.5 5 22.5 5 16 V7.5 Z M14 8 V13 H9 V17 H14 V25 H18 V17 H23 V13 H18 V8 Z' },
    Rogue: { fill: 'M12.6 17.6 L25.6 3.2 L28.4 3.4 L28.6 6.2 L14.4 19.4 Z M19.4 17.6 L6.4 3.2 L3.6 3.4 L3.4 6.2 L17.6 19.4 Z', stroke: 'M9.6 16.4 L15.6 22.4 M22.4 16.4 L16.4 22.4 M11.6 21.4 L6.4 26.6 M20.4 21.4 L25.6 26.6', dark: 'M26.6 4.6 L14.4 18 M5.4 4.6 L17.6 18', dots: [[5.4, 27.6], [26.6, 27.6]] },
    Sorcerer: { fill: 'M16 1.5 C19.5 8 25.5 11 25.5 19.5 C25.5 26 21 30.5 16 30.5 C11 30.5 6.5 26 6.5 19.5 C6.5 14.5 9.5 11 11.8 8 C12.2 12 13.8 14.4 16.2 15 C15 10.5 14.8 6 16 1.5 Z M16 18 C18.4 20.6 20.4 22.2 20.4 25 C20.4 27.6 18.4 29 16 29 C13.6 29 11.6 27.6 11.6 25 C11.6 22.2 13.6 20.6 16 18 Z', dots: [[16, 25.2]] },
    Spiritborn: { fill: 'M16 5 L18.2 8.4 L18 12.6 L29.5 8.6 L27.4 13.4 L30.5 14.8 L26.4 17.6 L28.4 19.8 L20.2 19 L19.2 23.8 L22.4 29.4 L16 26.2 L9.6 29.4 L12.8 23.8 L11.8 19 L3.6 19.8 L5.6 17.6 L1.5 14.8 L4.6 13.4 L2.5 8.6 L14 12.6 L13.8 8.4 Z', dark: 'M16 12.6 V24 M18.2 14 L26 11 M13.8 14 L6 11 M18.6 16.4 L25.4 15.6 M13.4 16.4 L6.6 15.6', eyes: [[16, 9.6]] },
    Warlock: { fill: 'M10 11.5 C3.5 9 2.5 3.5 5 1.5 C6 6 8.5 7.8 12.4 8.6 Z M22 11.5 C28.5 9 29.5 3.5 27 1.5 C26 6 23.5 7.8 19.6 8.6 Z M16 7.5 C21.5 7.5 24 11 24 15.5 C24 22 20.5 28.5 16 30 C11.5 28.5 8 22 8 15.5 C8 11 10.5 7.5 16 7.5 Z M10.6 15.4 L14.4 17.6 L13.6 19 L10.4 17.2 Z M21.4 15.4 L17.6 17.6 L18.4 19 L21.6 17.2 Z', dark: 'M16 11 V14 M12.6 25.8 C14.6 24.2 17.4 24.2 19.4 25.8 M14.4 21.4 L16 22.6 L17.6 21.4 M14.2 24.7 L14.6 26.8 M17.8 24.7 L17.4 26.8', eyes: [[12.3, 17.3], [19.7, 17.3]] },
  };
  // embossed metal: lights the shape's edges from the upper left
  const bevel = (id, blur, scale) => `<filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>
      <feSpecularLighting in="b" surfaceScale="${scale}" specularConstant="1.15" specularExponent="18" lighting-color="#fff6e0" result="s"><feDistantLight azimuth="235" elevation="38"/></feSpecularLighting>
      <feComposite in="s" in2="SourceAlpha" operator="in" result="si"/>
      <feDiffuseLighting in="b" surfaceScale="${scale}" diffuseConstant="1" lighting-color="#fff" result="d"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.05" k2="0" k3="0" k4="0" result="lit"/>
      <feComposite in="lit" in2="si" operator="arithmetic" k1="0" k2="1" k3="0.75" k4="0" result="out"/>
      <feComposite in="out" in2="SourceAlpha" operator="in"/>
    </filter>`;
  let crestN = 0;
  function crest(cls) {
    const c = CREST[cls] || CREST.Paladin; const id = 'cr' + (crestN++);
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#fff0c4"/><stop offset="0.35" stop-color="#e8b158"/><stop offset="0.7" stop-color="#a5651f"/><stop offset="1" stop-color="#e2a856"/></linearGradient>${bevel(id + 'b', 0.55, 2.2)}</defs>
      <g style="filter:drop-shadow(0 0 2.5px rgba(240,140,60,0.75))"><g filter="url(#${id}b)">
      ${c.fill ? `<path d="${c.fill}" fill="url(#${id})" fill-rule="evenodd" stroke="#2a1608" stroke-width="0.7" stroke-linejoin="round"/>` : ''}
      ${c.stroke ? `<path d="${c.stroke}" fill="none" stroke="#2a1608" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${c.stroke}" fill="none" stroke="url(#${id})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
      ${c.dark ? `<path d="${c.dark}" fill="none" stroke="#2a1608" stroke-width="1" stroke-linecap="round"/>` : ''}
      ${(c.eyes || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#ff6a3a" style="filter:drop-shadow(0 0 1.5px #ff3a1a)"/>`).join('')}
      ${(c.dots || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="url(#${id})" stroke="#2a1608" stroke-width="0.6"/>`).join('')}
      </g></g>`;
  }

  // ---------- equipment art (100 x 100 box), layered and shaded ----------
  const ITEM = {
    helm: [
      ['ivory', 'M-23 -14 C-38 -18 -47 -33 -43 -48 C-39 -37 -32 -33 -21 -29 Z M23 -14 C38 -18 47 -33 43 -48 C39 -37 32 -33 21 -29 Z'],
      ['steel', 'M-24 -2 C-24 -28 -13 -38 0 -38 C13 -38 24 -28 24 -2 V24 C24 32 14 38 0 40 C-14 38 -24 32 -24 24 Z'],
      ['trim', 'M-24 -8 C-14 -12 14 -12 24 -8 V-2 C14 -6 -14 -6 -24 -2 Z M-2.6 -38 C-1 -38.4 1 -38.4 2.6 -38 V36 H-2.6 Z M-24 22 C-14 25 14 25 24 22 V26 C14 29 -14 29 -24 26 Z'],
      ['dark', 'M-19 3 H-5 V9 H-19 Z M5 3 H19 V9 H5 Z'],
      ['holes', [[-12, 15], [-7, 15], [7, 15], [12, 15], [-12, 19.5], [-7, 19.5], [7, 19.5], [12, 19.5]]],
      ['rivets', [[-19, -5.5], [-10, -7.5], [10, -7.5], [19, -5.5]]],
      ['hl', 'M-17 -25 C-13 -31 -7 -34 -3 -35 M-21 -2 V18'],
    ],
    chest: [
      ['steel', 'M-46 -16 C-48 -32 -34 -40 -20 -34 L-26 -12 C-34 -8 -42 -8 -46 -16 Z M46 -16 C48 -32 34 -40 20 -34 L26 -12 C34 -8 42 -8 46 -16 Z'],
      ['steel', 'M-20 -36 C-8 -29 8 -29 20 -36 L27 -22 L23 22 C13 32 -13 32 -23 22 L-27 -22 Z'],
      ['trim', 'M-20 -36 C-8 -29 8 -29 20 -36 L22 -31 C9 -24 -9 -24 -22 -31 Z M-1.6 -27 H1.6 V28 H-1.6 Z M-46 -16 C-42 -10 -34 -10 -27 -14 L-26 -11 C-34 -6 -43 -7 -47 -13 Z M46 -16 C42 -10 34 -10 27 -14 L26 -11 C34 -6 43 -7 47 -13 Z'],
      ['dark', 'M-22 -4 C-10 2 10 2 22 -4 M-21 8 C-10 13 10 13 21 8'],
      ['leather', 'M-23 22 C-13 31 13 31 23 22 L23 34 C13 42 -13 42 -23 34 Z'],
      ['rivets', [[-14, 30], [14, 30], [-38, -26], [38, -26]]],
      ['hl', 'M-14 -22 C-11 -10 -11 4 -14 16 M-40 -28 C-36 -32 -30 -33 -26 -32'],
      ['gem', [0, -14, 5.5]],
    ],
    gloves: [
      ['leather', 'M-24 10 H22 L24 40 H-26 Z'],
      ['trim', 'M-24 10 H22 L22.6 16 H-24.4 Z M-25 33 H23.6 L24 40 H-26 Z'],
      ['steel', 'M-21 8 L-26 -14 C-26 -21 -17 -21 -16 -15 L-15 -30 C-15 -37 -6 -37 -6 -30 L-5.5 -35 C-5.5 -42 3.5 -42 3.5 -35 L4 -31 C4 -38 13 -38 13 -31 L14 -10 L21 -19 C25 -24 32 -19 29 -13 L17 9 Z'],
      ['dark', 'M-15.5 -14 V-4 M-6 -29 V-4 M3.6 -30 V-4 M-15 -20 H-7 M-5.5 -24 H3 M4 -24 H13 M-19 -3 H14'],
      ['rivets', [[-12, 1], [-3, 1], [6, 1]]],
      ['hl', 'M-12 -27 V-17 M-2 -33 V-26 M8 -29 V-22'],
      ['gem', [-1, 25, 4.5]],
    ],
    pants: [
      ['leather', 'M-26 -40 H26 V-30 H-26 Z'],
      ['steel', 'M-27 -30 H27 L29 -14 L4 -12 L0 -6 L-4 -12 L-29 -14 Z'],
      ['steel', 'M-28 -12 L-4 -10 L-6 42 H-22 Z M28 -12 L4 -10 L6 42 H22 Z'],
      ['trim', 'M-26 -40 H26 V-36 H-26 Z M-27 -30 H27 L27.4 -26 H-27.4 Z M-25 10 C-19 6 -10 6 -6 10 L-6 14 C-10 11 -19 11 -25 15 Z M25 10 C19 6 10 6 6 10 L6 14 C10 11 19 11 25 15 Z'],
      ['dark', 'M-27 -20 H27 M-15 -10 V6 M15 -10 V6 M-18 26 H-8 M8 26 H18'],
      ['rivets', [[-15, 8], [15, 8], [-20, -34], [20, -34]]],
      ['hl', 'M-22 -8 L-20 38 M22 -8 L20 38'],
      ['gem', [0, -35, 4]],
    ],
    boots: [
      ['steel', 'M-20 -42 H8 L10 4 L-22 4 Z'],
      ['steel', 'M-22 4 H10 L36 14 C43 18 42 32 34 34 H-22 Z'],
      ['trim', 'M-20 -42 H8 V-36 H-20 Z M-22 2 H10 V7 H-22 Z M-22 30 H40 C39 33 37 34 34 34 H-22 Z'],
      ['dark', 'M-20 -24 H8 M-21 -10 H9 M14 7 L20 30 M24 10 L28 30'],
      ['leather', 'M-26 34 H38 V40 H-26 Z'],
      ['rivets', [[-14, -30], [2, -30], [-14, 17], [2, 17]]],
      ['hl', 'M-15 -38 V0'],
      ['gem', [-6, -14, 4.5]],
    ],
    amulet: [
      ['chain', 'M-32 -44 C-32 -16 -15 -6 0 -4 C15 -6 32 -16 32 -44'],
      ['trim', 'M0 -8 C10 -8 18 0 18 10 C18 24 6 34 0 46 C-6 34 -18 24 -18 10 C-18 0 -10 -8 0 -8 Z'],
      ['dark', 'M0 -3 C7 -3 13 3 13 10 C13 20 5 28 0 38 C-5 28 -13 20 -13 10 C-13 3 -7 -3 0 -3 Z'],
      ['trim', 'M-5 -10 A5 5 0 1 1 5 -10 A5 5 0 1 1 -5 -10 Z'],
      ['gem', [0, 13, 11, 'drop']],
    ],
    ring: [
      ['trim', 'M0 2 C20 2 34 10 34 22 C34 34 20 42 0 42 C-20 42 -34 34 -34 22 C-34 10 -20 2 0 2 Z M0 12 C-13 12 -22 16 -22 22 C-22 28 -13 32 0 32 C13 32 22 28 22 22 C22 16 13 12 0 12 Z', 'evenodd'],
      ['dark', 'M-30 28 C-22 37 22 37 30 28'],
      ['hl', 'M-28 14 C-22 8 -12 5 -4 4'],
      ['trim', 'M-13 6 L-11 -18 L0 -26 L11 -18 L13 6 C6 8 -6 8 -13 6 Z'],
      ['dark', 'M-8 4 L-7 -16 M8 4 L7 -16'],
      ['gem', [0, -12, 11]],
    ],
    weapon: [
      ['steel', 'M30 -44 L38 -36 L-4 10 L-12 2 Z'],
      ['dark', 'M31 -38 L-6 4'],
      ['hl', 'M35 -38 L-1 2'],
      ['trim', 'M-26 -6 C-22 -12 -16 -12 -14 -8 L12 18 C16 20 16 26 10 30 C8 24 4 22 2 20 L-22 -4 C-24 -2 -26 -2 -26 -6 Z'],
      ['leather', 'M-12 14 L-4 22 L-24 42 L-32 34 Z'],
      ['dark', 'M-16 18 L-8 26 M-20 22 L-12 30 M-24 26 L-16 34'],
      ['gem', [-32, 42, 7]],
    ],
    offhand: [
      ['steel', 'M0 -44 L34 -34 V2 C34 23 19 35 0 46 C-19 35 -34 23 -34 2 V-34 Z'],
      ['trim', 'M0 -44 L34 -34 V2 C34 23 19 35 0 46 C-19 35 -34 23 -34 2 V-34 Z M0 -37 L-27 -29 V2 C-27 18 -15 28 0 38 C15 28 27 18 27 2 V-29 Z', 'evenodd'],
      ['dark', 'M-3.5 -30 H3.5 V30 H-3.5 Z M-22 -8 H22 V-1 H-22 Z'],
      ['trim', 'M-2 -28 H2 V28 H-2 Z M-20 -6 H20 V-3 H-20 Z'],
      ['hl', 'M-22 -24 C-22 -10 -21 6 -16 18'],
      ['gem', [0, -4.5, 7.5]],
    ],
  };
  let artN = 0;
  function itemArt(slot, rarityCol, filled) {
    const layers = ITEM[slot] || ITEM.amulet; const id = 'ia' + (artN++);
    const gemCol = filled ? rarityCol : '#2a2420';
    const defs = `<defs>
      <linearGradient id="${id}s" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="#e6ded2"/><stop offset="0.28" stop-color="#9c938a"/><stop offset="0.55" stop-color="#4a433d"/><stop offset="0.8" stop-color="#2a2521"/><stop offset="1" stop-color="#6e655c"/></linearGradient>
      <linearGradient id="${id}t" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#ffe9b0"/><stop offset="0.4" stop-color="#d49a44"/><stop offset="0.7" stop-color="#7c4e1a"/><stop offset="1" stop-color="#c8913e"/></linearGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5236"/><stop offset="1" stop-color="#2c1b10"/></linearGradient>
      <linearGradient id="${id}i" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4ead6"/><stop offset="1" stop-color="#7d6c55"/></linearGradient>
      <radialGradient id="${id}g" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity="${filled ? 0.95 : 0.2}"/><stop offset="0.3" stop-color="${gemCol}"/><stop offset="1" stop-color="#050303"/></radialGradient>
      <radialGradient id="${id}h" r="50%"><stop offset="0" stop-color="${rarityCol}" stop-opacity="${filled ? 0.5 : 0}"/><stop offset="1" stop-color="${rarityCol}" stop-opacity="0"/></radialGradient>
    </defs>`;
    const FILL = { steel: `url(#${id}s)`, trim: `url(#${id}t)`, leather: `url(#${id}l)`, ivory: `url(#${id}i)` };
    const out = layers.map(([k, d, rule]) => {
      if (FILL[k]) return `<path d="${d}" fill="${FILL[k]}" ${rule ? `fill-rule="${rule}"` : ''} stroke="#0a0705" stroke-width="1.6" stroke-linejoin="round"/>`;
      if (k === 'dark') return `<path d="${d}" fill="${/Z/.test(d) ? '#0d0a08' : 'none'}" stroke="#0d0a08" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>`;
      if (k === 'hl') return `<path d="${d}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity="0.45"/>`;
      if (k === 'chain') return `<path d="${d}" fill="none" stroke="#0a0705" stroke-width="5.5" stroke-dasharray="4 2.2"/><path d="${d}" fill="none" stroke="url(#${id}t)" stroke-width="3.6" stroke-dasharray="4 2.2"/>`;
      if (k === 'rivets') return d.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="url(#${id}t)" stroke="#0a0705" stroke-width="0.8"/>`).join('');
      if (k === 'holes') return d.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#0a0705"/>`).join('');
      if (k === 'gem') { const [x, y, r, shape] = d; const g = shape === 'drop' ? `M${x} ${y - r * 1.3} C${x + r} ${y - r * 0.2} ${x + r} ${y + r} ${x} ${y + r} C${x - r} ${y + r} ${x - r} ${y - r * 0.2} ${x} ${y - r * 1.3} Z` : null;
        return (g ? `<path d="${g}" fill="url(#${id}g)" stroke="#0a0705" stroke-width="1.4"/>` : `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}g)" stroke="#0a0705" stroke-width="1.4"/>`) + (filled ? `<circle cx="${x - r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.22}" fill="#fff" opacity="0.8"/>` : ''); }
      return '';
    }).join('');
    return `${defs.replace('</defs>', bevel(id + 'b', 1.4, 3.2) + '</defs>')}<circle r="50" fill="url(#${id}h)"/><g style="filter:drop-shadow(0 3px 2px rgba(0,0,0,0.95))"><g filter="url(#${id}b)">${out}</g></g>`;
  }
  const api = { emblem, motifFor, slotGlyph, COLORS, modMotif, motif, itemArt, crest, paths: M };
  root.D4ART = api;
})(window);
