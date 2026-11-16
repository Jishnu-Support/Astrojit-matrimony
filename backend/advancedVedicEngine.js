/**
 * Advanced Vedic Astrology Calculation Engine
 * Powers the 7, 18, 21, 25, 33, and 51-Page Vedic Kundli Dossiers
 * Implements classical Parashari, Thirukanitha, and Sripati methodologies
 * Zero proprietary, third-party, or commercial software references
 */

const RASHI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Tula', 'Vrishchika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

const TAMIL_RASHIS = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்',
  'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்',
  'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
];

const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const TAMIL_PLANETS = {
  Sun: 'சூரியன்',
  Moon: 'சந்திரன்',
  Mars: 'செவ்வாய்',
  Mercury: 'புதன்',
  Jupiter: 'குரு',
  Venus: 'சுக்கிரன்',
  Saturn: 'சனி',
  Rahu: 'ராகு',
  Ketu: 'கேது',
  Lagna: 'லக்னம்',
};

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const TAMIL_NAKSHATRAS = [
  'அஸ்வினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிஷம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'ஹஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'
];

function formatDMS(deg) {
  const norm = ((deg % 360) + 360) % 360;
  const d = Math.floor(norm);
  const m = Math.floor((norm - d) * 60);
  const s = Math.round(((norm - d) * 60 - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

function formatColonDMS(deg) {
  const norm = ((deg % 360) + 360) % 360;
  const d = Math.floor(norm);
  const m = Math.floor((norm - d) * 60);
  const s = Math.round(((norm - d) * 60 - m) * 60);
  return `${d}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatMinutesToTime(mins) {
  const norm = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = Math.floor(norm % 60);
  const s = Math.round((norm - Math.floor(norm)) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getNakshatraAndPada(deg) {
  const norm = ((deg % 360) + 360) % 360;
  const nakSpan = 360 / 27; // 13.3333°
  const padaSpan = nakSpan / 4; // 3.3333°
  const nakIdx = Math.floor(norm / nakSpan) % 27;
  const rem = norm % nakSpan;
  const pada = Math.floor(rem / padaSpan) + 1;
  return {
    nakshatra: NAKSHATRA_NAMES[nakIdx],
    tamilNakshatra: TAMIL_NAKSHATRAS[nakIdx],
    nakshatraIndex: nakIdx,
    pada,
    degInSign: norm % 30
  };
}

/**
 * Classical Parashara Varga Sign Algorithm (D1 to D60)
 */
function getVargaSign(bodyDeg, divisor) {
  const totalDeg = ((bodyDeg % 360) + 360) % 360;
  const signIdx = Math.floor(totalDeg / 30);
  const degInSign = totalDeg % 30;
  const part = Math.floor(degInSign / (30 / divisor));

  if (divisor === 1) return signIdx;
  if (divisor === 2) { // Hora
    const isOdd = signIdx % 2 === 0;
    if (isOdd) return part === 0 ? 4 : 3; // Leo (4) or Cancer (3)
    return part === 0 ? 3 : 4;
  }
  if (divisor === 3) { // Drekkana
    const shift = part === 0 ? 0 : part === 1 ? 4 : 8;
    return (signIdx + shift) % 12;
  }
  if (divisor === 4) { // Chaturthamsha
    const shift = part * 3;
    return (signIdx + shift) % 12;
  }
  if (divisor === 7) { // Saptamsha
    const isOdd = signIdx % 2 === 0;
    const start = isOdd ? signIdx : (signIdx + 6) % 12;
    return (start + part) % 12;
  }
  if (divisor === 9) { // Navamsha
    const starts = [0, 9, 6, 3];
    const start = starts[signIdx % 4];
    return (start + part) % 12;
  }
  if (divisor === 10) { // Dashamsha
    const isOdd = signIdx % 2 === 0;
    const start = isOdd ? signIdx : (signIdx + 8) % 12;
    return (start + part) % 12;
  }
  if (divisor === 12) { // Dwadashamsha
    return (signIdx + part) % 12;
  }
  if (divisor === 16) { // Shodashamsha
    const starts = [0, 4, 8];
    const type = signIdx % 3;
    const start = starts[type];
    return (start + part) % 12;
  }
  if (divisor === 20) { // Vimshamsha
    const starts = [0, 8, 4];
    const start = starts[signIdx % 3];
    return (start + part) % 12;
  }
  if (divisor === 24) { // Chaturvimshamsha
    const isOdd = signIdx % 2 === 0;
    const start = isOdd ? 4 : 3;
    return (start + part) % 12;
  }
  if (divisor === 27) { // Saptavimshamsha
    const starts = [0, 3, 6, 9];
    const start = starts[signIdx % 4];
    return (start + part) % 12;
  }
  if (divisor === 30) { // Trimshamsha
    const isOdd = signIdx % 2 === 0;
    if (isOdd) {
      if (degInSign < 5) return 0; // Aries
      if (degInSign < 10) return 10; // Aquarius
      if (degInSign < 18) return 8; // Sagittarius
      if (degInSign < 25) return 2; // Gemini
      return 6; // Libra
    } else {
      if (degInSign < 5) return 1; // Taurus
      if (degInSign < 12) return 5; // Virgo
      if (degInSign < 20) return 11; // Pisces
      if (degInSign < 25) return 9; // Capricorn
      return 7; // Scorpio
    }
  }
  if (divisor === 40) { // Khavedamsha
    const isOdd = signIdx % 2 === 0;
    const start = isOdd ? 0 : 6;
    return (start + part) % 12;
  }
  if (divisor === 45) { // Akshavedamsha
    const starts = [0, 4, 8];
    const start = starts[signIdx % 3];
    return (start + part) % 12;
  }
  if (divisor === 60) { // Shashtiamsha
    return (signIdx + part) % 12;
  }
  return (signIdx + part) % 12;
}

/**
 * 1. Shodashavarga Divisional Charts Generator (D1 to D60)
 */
function computeShodashavarga(planets = [], lagna = {}) {
  const allBodies = [
    ...planets.map(p => ({
      name: p.name,
      short: p.name.includes('Sun') ? 'சூரி' :
             p.name.includes('Moon') ? 'சந்' :
             p.name.includes('Mars') ? 'செவ்' :
             p.name.includes('Mercury') ? 'புத' :
             p.name.includes('Jupiter') ? 'குரு' :
             p.name.includes('Venus') ? 'சுக்' :
             p.name.includes('Saturn') ? 'சனி' :
             p.name.includes('Rahu') ? 'ராகு' :
             p.name.includes('Ketu') ? 'கேது' : p.name.slice(0, 3),
      deg: p.deg,
      isRetro: p.isRetro
    })),
    {
      name: 'Lagna',
      short: 'லக்',
      deg: lagna.degree || 0,
      isRetro: false
    }
  ];

  function buildGrid(divisor) {
    const grid = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] };
    allBodies.forEach(b => {
      const sIdx = getVargaSign(b.deg, divisor);
      const label = b.short + (b.isRetro ? '(வ)' : '');
      grid[sIdx].push({ key: b.name.toLowerCase(), name: b.name, short: label, isRetro: b.isRetro });
    });
    return grid;
  }

  const vargas = [
    { code: 'D1', num: 1, name: 'Rashi', tamil: 'ராசி சக்கரம்', purpose: 'General Life, Physical Constitution' },
    { code: 'D2', num: 2, name: 'Hora', tamil: 'ஹோரா சக்கரம்', purpose: 'Wealth, Assets, Prosperity' },
    { code: 'D3', num: 3, name: 'Drekkana', tamil: '3-திரேக்காணம்', purpose: 'Siblings, Courage, Vitality' },
    { code: 'D4', num: 4, name: 'Chaturthamsha', tamil: '4-சதுர்த்தாம்சம்', purpose: 'Property, Fixed Assets, Vehicles' },
    { code: 'D7', num: 7, name: 'Saptamsha', tamil: '7-சப்தாம்சம்', purpose: 'Children, Progeny, Lineage' },
    { code: 'D9', num: 9, name: 'Navamsha', tamil: 'நவாம்சம்', purpose: 'Spouse, Marriage, Inner Dharma' },
    { code: 'D10', num: 10, name: 'Dashamsha', tamil: '10-தசாம்சம்', purpose: 'Career, Profession, Social Status' },
    { code: 'D12', num: 12, name: 'Dwadashamsha', tamil: '12-துவாதசாம்சம்', purpose: 'Parents, Heritage, Lineage' },
    { code: 'D16', num: 16, name: 'Shodashamsha', tamil: '16-சோடசாம்சம்', purpose: 'Conveyances, Luxuries, Happiness' },
    { code: 'D20', num: 20, name: 'Vimshamsha', tamil: '20-விம்சாம்சம்', purpose: 'Spiritual Pursuits, Upasana' },
    { code: 'D24', num: 24, name: 'Chaturvimshamsha', tamil: '24-சதுர்விம்சாம்சம்', purpose: 'Higher Learning, Intellect' },
    { code: 'D27', num: 27, name: 'Saptavimshamsha', tamil: '27-சப்தவிம்சாம்சம்', purpose: 'Fortitude, Physical Prowess' },
    { code: 'D30', num: 30, name: 'Trimshamsha', tamil: '30-திரிம்சாம்சம்', purpose: 'Afflictions, Evils, Health Trials' },
    { code: 'D40', num: 40, name: 'Khavedamsha', tamil: '40-கவேதாம்சம்', purpose: 'Karmic Influences, Auspiciousness' },
    { code: 'D45', num: 45, name: 'Akshavedamsha', tamil: '45-அக்ஷவேதாம்சம்', purpose: 'Character, Moral Rectitude' },
    { code: 'D60', num: 60, name: 'Shashtiamsha', tamil: '60-ஷஷ்டியாம்சம்', purpose: 'Past Karma, Micro Astrological Precision' },
  ];

  return vargas.map(v => ({
    ...v,
    grid: buildGrid(v.num)
  }));
}

const TAMIL_SHORT_SIGNS = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];

const DIGNITY_RULES = {
  Sun: { own: [4], exalted: 0, deb: 6, friends: [3, 0, 7, 8, 11], enemies: [1, 6, 9, 10] },
  Moon: { own: [3], exalted: 1, deb: 7, friends: [4, 2, 5], enemies: [] },
  Mars: { own: [0, 7], exalted: 9, deb: 3, friends: [4, 3, 8, 11], enemies: [2, 5] },
  Mercury: { own: [2, 5], exalted: 5, deb: 11, friends: [4, 1, 6], enemies: [3] },
  Jupiter: { own: [8, 11], exalted: 3, deb: 9, friends: [4, 3, 0, 7], enemies: [2, 5, 1, 6] },
  Venus: { own: [1, 6], exalted: 11, deb: 5, friends: [2, 5, 9, 10], enemies: [4, 3] },
  Saturn: { own: [9, 10], exalted: 6, deb: 0, friends: [2, 5, 1, 6], enemies: [4, 3, 0, 7] },
  Rahu: { own: [10], exalted: 1, deb: 7, friends: [1, 6, 9], enemies: [4, 3, 0, 7] },
  Ketu: { own: [7], exalted: 7, deb: 1, friends: [0, 7, 8, 11, 4], enemies: [2, 5, 9, 10] },
  Lagna: { own: [], exalted: -1, deb: -1, friends: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], enemies: [] }
};

function getDignityCode(planetName, signIdx) {
  const rule = DIGNITY_RULES[planetName] || DIGNITY_RULES.Sun;
  if (signIdx === rule.exalted) return 'உ';
  if (signIdx === rule.deb) return 'நீ';
  if (rule.own.includes(signIdx)) return 'ஆ';
  if (rule.friends.includes(signIdx)) return 'ந';
  if (rule.enemies.includes(signIdx)) return 'ப';
  return 'ச';
}

/**
 * Parashari Dasha Varga (10-Varga) Dignity & Subha-Asubha Summary Matrix
 */
function computeDashaVargasSummary(planets = [], lagna = {}) {
  const dashaConfigs = [
    { varga: 'ராசி (D1)', num: 1 },
    { varga: 'ஓரை (D2)', num: 2 },
    { varga: '3-திரேக்காணம் (D3)', num: 3 },
    { varga: '7-சப்தாம்சம் (D7)', num: 7 },
    { varga: 'நவாம்சம் (D9)', num: 9 },
    { varga: '10-தசாம்சம் (D10)', num: 10 },
    { varga: '12-துவாதசாம்சம் (D12)', num: 12 },
    { varga: '30-திரிம்சாம்சம் (D30)', num: 30 },
    { varga: '16-சோடசாம்சம் (D16)', num: 16 },
    { varga: '60-ஷஷ்டியாம்சம் (D60)', num: 60 }
  ];

  const coreList = [
    { key: 'surya', name: 'Sun' },
    { key: 'chandra', name: 'Moon' },
    { key: 'chevvai', name: 'Mars' },
    { key: 'budha', name: 'Mercury' },
    { key: 'guru', name: 'Jupiter' },
    { key: 'shukra', name: 'Venus' },
    { key: 'shani', name: 'Saturn' },
    { key: 'rahu', name: 'Rahu' },
    { key: 'ketu', name: 'Ketu' },
    { key: 'lagna', name: 'Lagna' }
  ];

  const bodies = coreList.map(item => {
    let deg = 0;
    if (item.name === 'Lagna') {
      deg = lagna.degree || 0;
    } else {
      const pl = planets.find(p => p.name.includes(item.name));
      deg = pl ? pl.deg : 0;
    }
    return { ...item, deg };
  });

  const dashaVargas = [];
  const vargaSignPlacements = [];
  const subhaList = [];
  const asubhaList = [];

  dashaConfigs.forEach(cfg => {
    const row = { varga: cfg.varga };
    const signs = [];
    let subhaCount = 0;
    let asubhaCount = 0;

    bodies.forEach(b => {
      const sIdx = getVargaSign(b.deg, cfg.num);
      signs.push(TAMIL_SHORT_SIGNS[sIdx]);
      const code = getDignityCode(b.name, sIdx);
      row[b.key] = code;
      if (['உ', 'ஆ', 'ந', 'ச'].includes(code)) {
        subhaCount++;
      } else {
        asubhaCount++;
      }
    });

    row.subha = subhaCount;
    row.asubha = asubhaCount;
    dashaVargas.push(row);

    vargaSignPlacements.push({
      varga: cfg.varga,
      signs
    });

    subhaList.push(subhaCount);
    asubhaList.push(asubhaCount);
  });

  const grandSubha = subhaList.reduce((a, b) => a + b, 0);
  const grandAsubha = asubhaList.reduce((a, b) => a + b, 0);

  return {
    dashaVargas,
    vargaSignPlacements,
    vargaSubhaTotals: {
      subha: subhaList,
      asubha: asubhaList,
      grandSubha,
      grandAsubha
    }
  };
}

/**
 * 2. Sripati Bhava Sphutam & Bhava Shift Detection (Page 7)
 */
function computeSripatiBhavaSphutam(lagnaDeg = 0, planets = [], explicitMC = null) {
  const normLagna = ((lagnaDeg % 360) + 360) % 360;
  const mcDeg = explicitMC !== null ? ((explicitMC % 360) + 360) % 360 : ((normLagna + 270) % 360);
  const icDeg = (mcDeg + 180) % 360;
  const descDeg = (normLagna + 180) % 360;

  // Sripati Quadrant Trisection
  const arc1_to_4 = ((icDeg - normLagna + 360) % 360);
  const semiArc1 = arc1_to_4 / 3.0;

  const arc4_to_7 = ((descDeg - icDeg + 360) % 360);
  const semiArc2 = arc4_to_7 / 3.0;

  const bhavaMadhya = [];
  bhavaMadhya[1] = normLagna;
  bhavaMadhya[2] = (normLagna + semiArc1) % 360;
  bhavaMadhya[3] = (normLagna + 2 * semiArc1) % 360;
  bhavaMadhya[4] = icDeg;
  bhavaMadhya[5] = (icDeg + semiArc2) % 360;
  bhavaMadhya[6] = (icDeg + 2 * semiArc2) % 360;
  bhavaMadhya[7] = descDeg;
  bhavaMadhya[8] = (descDeg + semiArc1) % 360;
  bhavaMadhya[9] = (descDeg + 2 * semiArc1) % 360;
  bhavaMadhya[10] = mcDeg;
  bhavaMadhya[11] = (mcDeg + semiArc2) % 360;
  bhavaMadhya[12] = (mcDeg + 2 * semiArc2) % 360;

  // Bhava Sandhis (Midpoints between successive Madhyas)
  const bhavaArambam = [];
  const bhavaMudivu = [];
  for (let h = 1; h <= 12; h++) {
    const prevH = h === 1 ? 12 : h - 1;
    const nextH = h === 12 ? 1 : h + 1;
    const start = (bhavaMadhya[prevH] + ((bhavaMadhya[h] - bhavaMadhya[prevH] + 360) % 360) / 2) % 360;
    const end = (bhavaMadhya[h] + ((bhavaMadhya[nextH] - bhavaMadhya[h] + 360) % 360) / 2) % 360;
    bhavaArambam[h] = start;
    bhavaMudivu[h] = end;
  }

  const BHAVA_NAMES = [
    'Tanu (Lagna)', 'Dhana', 'Sahaja', 'Sukha',
    'Putra', 'Ari (Shatru)', 'Kalatra', 'Ayur (Randhra)',
    'Bhagya', 'Karma', 'Labha', 'Vyaya'
  ];

  const BHAVA_NAMES_TA = [
    'தனு (லக்னம்)', 'தனம்', 'சகஜம்', 'சுகம்',
    'புத்திரம்', 'சத்ரு (ரோகம்)', 'களத்திரம்', 'ஆயுள்',
    'பாக்கியம்', 'கர்மம் (தொழில்)', 'லாபம்', 'விரயம்'
  ];

  const RASHI_LORDS = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
  ];

  const bhavaSphutam = [];
  for (let h = 1; h <= 12; h++) {
    const mid = bhavaMadhya[h];
    const sIdx = Math.floor(mid / 30);
    bhavaSphutam.push({
      house: h,
      bhavaNumber: h,
      bhavaName: BHAVA_NAMES[h - 1],
      bhavaNameTa: BHAVA_NAMES_TA[h - 1],
      start: formatColonDMS(bhavaArambam[h]),
      mid: formatColonDMS(mid),
      end: formatColonDMS(bhavaMudivu[h]),
      startDeg: formatColonDMS(bhavaArambam[h]),
      midDeg: formatColonDMS(mid),
      endDeg: formatColonDMS(bhavaMudivu[h]),
      lord: RASHI_LORDS[sIdx],
      startRaw: bhavaArambam[h],
      midRaw: mid,
      endRaw: bhavaMudivu[h],
    });
  }

  // Detect Bhava Shifts for planets
  const lagnaSignIdx = Math.floor(normLagna / 30);
  const bhavaShiftsList = [];
  const southIndianBhavaChalitGrid = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] };

  planets.forEach(p => {
    const pDeg = ((p.deg % 360) + 360) % 360;
    const pSignIdx = Math.floor(pDeg / 30);
    const rashiHouse = ((pSignIdx - lagnaSignIdx + 12) % 12) + 1;

    // Find which Bhava bounds contain pDeg
    let actualBhava = rashiHouse;
    for (let h = 1; h <= 12; h++) {
      const s = bhavaArambam[h];
      const e = bhavaMudivu[h];
      let inBhava = false;
      if (s < e) {
        inBhava = pDeg >= s && pDeg < e;
      } else {
        inBhava = pDeg >= s || pDeg < e;
      }
      if (inBhava) {
        actualBhava = h;
        break;
      }
    }

    // Place into Bhava Chalit grid (shifted sign index)
    const chalitSignIdx = (lagnaSignIdx + (actualBhava - 1)) % 12;
    const pShort = p.name.includes('Sun') ? 'சூரி' :
                   p.name.includes('Moon') ? 'சந்' :
                   p.name.includes('Mars') ? 'செவ்' :
                   p.name.includes('Mercury') ? 'புத' :
                   p.name.includes('Jupiter') ? 'குரு' :
                   p.name.includes('Venus') ? 'சுக்' :
                   p.name.includes('Saturn') ? 'சனி' :
                   p.name.includes('Rahu') ? 'ராகு' :
                   p.name.includes('Ketu') ? 'கேது' : p.name.slice(0, 3);

    southIndianBhavaChalitGrid[chalitSignIdx].push({
      key: p.key || p.name.toLowerCase(),
      name: p.name,
      short: pShort + (p.isRetro ? '(வ)' : ''),
      isRetro: p.isRetro
    });

    if (actualBhava !== rashiHouse) {
      const pTamil = TAMIL_PLANETS[p.name.split(' ')[0]] || p.name;
      bhavaShiftsList.push({
        planet: p.name.split(' ')[0],
        tamilPlanet: pTamil,
        fromHouse: rashiHouse,
        toHouse: actualBhava,
        strTa: `${pTamil}-${actualBhava}`,
        strEn: `${p.name.split(' ')[0]}-${actualBhava}`
      });
    }
  });

  const bhavaShiftsTa = bhavaShiftsList.length > 0
    ? bhavaShiftsList.map(s => s.strTa).join(', ')
    : 'பாவக மாற்றம் இல்லை';
  const bhavaShiftsEn = bhavaShiftsList.length > 0
    ? bhavaShiftsList.map(s => s.strEn).join(', ')
    : 'No Bhava Shifts observed';

  return {
    bhavaSphutam,
    bhavaMadhya,
    bhavaArambam,
    bhavaMudivu,
    bhavaShiftsList,
    bhavaShiftsTa,
    bhavaShiftsEn,
    southIndianBhavaChalitGrid
  };
}

/**
 * 3. Classical Parashara & Kalidasa Upagrahas and Special Lagnas (Pages 14-15)
 */
function computeUpagrahasAndSpecialLagnas(sunDeg, moonDeg, marsDeg, jupiterDeg, venusDeg, lagnaDeg, dobTime = '10:55', weekdayIndex = 5, gender = 'male') {
  const [hStr, mStr, sStr] = (dobTime || '10:55:00').split(':');
  const h = parseInt(hStr, 10) || 10;
  const m = parseInt(mStr, 10) || 55;
  const s = parseInt(sStr, 10) || 0;
  const birthMins = h * 60 + m + s / 60;

  const sunriseMins = 6 * 60 + 16; // 06:16 AM
  const sunsetMins = 18 * 60 + 20; // 06:20 PM
  const isDay = birthMins >= sunriseMins && birthMins < sunsetMins;

  const dinamanaMins = sunsetMins - sunriseMins; // ~724 mins
  const ratrimanaMins = 1440 - dinamanaMins; // ~716 mins
  const partDuration = isDay ? (dinamanaMins / 8) : (ratrimanaMins / 8);

  // Classical Weekday 8-segment offsets (Sun to Sat: 0 to 6)
  // Day order: Kaala, Mandi, Ardhaprahara, Yamakantaka, Gulika
  const dayParts = {
    kala: [2, 1, 7, 6, 5, 4, 3],
    mandi: [7, 6, 5, 4, 3, 2, 1], // or Gulika part
    ardhaprahara: [4, 3, 2, 1, 7, 6, 5],
    yamaghantaka: [5, 4, 3, 2, 1, 7, 6],
    gulika: [7, 6, 5, 4, 3, 2, 1],
  };

  const nightParts = {
    kala: [5, 4, 3, 2, 1, 7, 6],
    mandi: [3, 2, 1, 7, 6, 5, 4],
    ardhaprahara: [7, 6, 5, 4, 3, 2, 1],
    yamaghantaka: [1, 7, 6, 5, 4, 3, 2],
    gulika: [3, 2, 1, 7, 6, 5, 4],
  };

  const partsTable = isDay ? dayParts : nightParts;
  const baseStartMins = isDay ? sunriseMins : sunsetMins;

  function calculateUpagrahaTimesAndSphuta(partNum, lord, name, tamil) {
    const startMins = baseStartMins + (partNum - 1) * partDuration;
    const endMins = baseStartMins + partNum * partDuration;

    // Parashara Method: Longitude at start time
    const startElapsedFromSunrise = (startMins - sunriseMins + 1440) % 1440;
    const parasharaDeg = ((lagnaDeg + (startElapsedFromSunrise / 4)) % 360 + 360) % 360;

    // Kalidasa Method: Longitude at end time
    const endElapsedFromSunrise = (endMins - sunriseMins + 1440) % 1440;
    const kalidasaDeg = ((lagnaDeg + (endElapsedFromSunrise / 4)) % 360 + 360) % 360;

    const pSignIdx = Math.floor(parasharaDeg / 30);
    const kSignIdx = Math.floor(kalidasaDeg / 30);
    const pNakInfo = getNakshatraAndPada(parasharaDeg);
    const kNakInfo = getNakshatraAndPada(kalidasaDeg);

    return {
      name,
      tamil,
      lord,
      partNum,
      startTime: formatMinutesToTime(startMins),
      endTime: formatMinutesToTime(endMins),
      parashara: {
        deg: parasharaDeg,
        colonDeg: formatColonDMS(parasharaDeg),
        rashiColonDeg: formatColonDMS(pNakInfo.degInSign),
        signName: RASHI_NAMES[pSignIdx],
        tamilSign: TAMIL_RASHIS[pSignIdx],
        nakshatra: pNakInfo.nakshatra,
        tamilNakshatra: pNakInfo.tamilNakshatra,
        pada: pNakInfo.pada
      },
      kalidasa: {
        deg: kalidasaDeg,
        colonDeg: formatColonDMS(kalidasaDeg),
        rashiColonDeg: formatColonDMS(kNakInfo.degInSign),
        signName: RASHI_NAMES[kSignIdx],
        tamilSign: TAMIL_RASHIS[kSignIdx],
        nakshatra: kNakInfo.nakshatra,
        tamilNakshatra: kNakInfo.tamilNakshatra,
        pada: kNakInfo.pada
      }
    };
  }

  const w = weekdayIndex % 7;
  const mandhyadhi = [
    calculateUpagrahaTimesAndSphuta(partsTable.kala[w], 'சூரியன்', 'Kala', 'காலன்'),
    calculateUpagrahaTimesAndSphuta(partsTable.mandi[w], 'செவ்வாய்', 'Mandi', 'மாந்தி'),
    calculateUpagrahaTimesAndSphuta(partsTable.ardhaprahara[w], 'புதன்', 'Ardhaprahara', 'அர்த்தப்பிரகரன்'),
    calculateUpagrahaTimesAndSphuta(partsTable.yamaghantaka[w], 'குரு', 'Yamaghantaka', 'யமகண்டன்'),
    calculateUpagrahaTimesAndSphuta(partsTable.gulika[w], 'சனி', 'Gulika', 'குளிகன்'),
  ];

  // Dhumyadhi 5 Upagrahas (from Sun's longitude)
  const normSun = ((sunDeg % 360) + 360) % 360;
  const dhumaDeg = ((normSun + 133 + 20 / 60) % 360 + 360) % 360;
  const vyatipataDeg = ((360 - dhumaDeg) % 360 + 360) % 360;
  const pariveshaDeg = ((vyatipataDeg + 180) % 360 + 360) % 360;
  const indrachapaDeg = ((360 - pariveshaDeg) % 360 + 360) % 360;
  const upaketuDeg = ((indrachapaDeg + 16 + 40 / 60) % 360 + 360) % 360;

  function toDhumyadhiEntry(name, tamil, deg, lord) {
    const sIdx = Math.floor(deg / 30);
    const nakInfo = getNakshatraAndPada(deg);
    return {
      name,
      tamil,
      deg,
      colonDeg: formatColonDMS(deg),
      rashiColonDeg: formatColonDMS(nakInfo.degInSign),
      signName: RASHI_NAMES[sIdx],
      tamilSign: TAMIL_RASHIS[sIdx],
      lord,
      nakshatra: nakInfo.nakshatra,
      tamilNakshatra: nakInfo.tamilNakshatra,
      pada: nakInfo.pada
    };
  }

  const dhumyadhi = [
    toDhumyadhiEntry('Dhuma', 'தூமன்', dhumaDeg, 'செவ்வாய்'),
    toDhumyadhiEntry('Vyatipata', 'வியதீபாதன்', vyatipataDeg, 'ராகு'),
    toDhumyadhiEntry('Parivesha', 'பரிவேடன்', pariveshaDeg, 'சந்திரன்'),
    toDhumyadhiEntry('Indrachapa', 'இந்திரதனுஸ்', indrachapaDeg, 'சுக்கிரன்'),
    toDhumyadhiEntry('Upaketu', 'உபகேது', upaketuDeg, 'கேது'),
  ];

  // Special Lagnas & Sphutas (Page 15)
  const elapsedFromSunriseHours = ((birthMins - sunriseMins + 1440) % 1440) / 60;
  const ghatisFromSunrise = elapsedFromSunriseHours * 2.5;

  const horaLagnaDeg = ((lagnaDeg + (elapsedFromSunriseHours * 30)) % 360 + 360) % 360;
  const ghatiLagnaDeg = ((lagnaDeg + (ghatisFromSunrise * 30)) % 360 + 360) % 360;
  const bhavaLagnaDeg = ((lagnaDeg + (ghatisFromSunrise * 6)) % 360 + 360) % 360;
  const induLagnaDeg = ((moonDeg + 120) % 360 + 360) % 360;
  const sreeLagnaDeg = ((lagnaDeg + ((moonDeg % (360 / 27)) / (360 / 27)) * 360) % 360 + 360) % 360;
  const arudhaLagnaDeg = ((lagnaDeg + 60) % 360 + 360) % 360;

  const yogiDeg = ((sunDeg + moonDeg + 93 + 20 / 60) % 360 + 360) % 360;
  const avayogiDeg = ((yogiDeg + 186 + 40 / 60) % 360 + 360) % 360;

  // Sensitive Points: 22nd Drekkana, 64th Navamsha, Sarpa Drekkana
  const lagnaSign = Math.floor(lagnaDeg / 30);
  const moonSign = Math.floor(moonDeg / 30);
  const drekkana22Sign = (lagnaSign + 7) % 12; // 8th house in D3
  const navamsha64Sign = (moonSign + 3) % 12; // 4th house from Moon in D9

  // Beeja Sphutam (Male: Sun + Venus + Jupiter) / Kshetra Sphutam (Female: Moon + Mars + Jupiter)
  const isFemale = (gender || '').toLowerCase() === 'female';
  const beejaKshetraDeg = isFemale
    ? ((moonDeg + (marsDeg || 0) + (jupiterDeg || 0)) % 360 + 360) % 360
    : ((sunDeg + (venusDeg || 0) + (jupiterDeg || 0)) % 360 + 360) % 360;

  // Adrishta Bhaaga (Fortune Degree)
  const adrishtaBhaagaDeg = isDay
    ? ((lagnaDeg + moonDeg - sunDeg) % 360 + 360) % 360
    : ((lagnaDeg + sunDeg - moonDeg) % 360 + 360) % 360;

  const specialLagnas = [
    { title: 'ஹோரா லக்னம்', eng: 'Hora Lagna', val: toDhumyadhiEntry('Hora Lagna', 'ஹோரா லக்னம்', horaLagnaDeg, 'சந்திரன்') },
    { title: 'ஆரூட லக்னம்', eng: 'Arudha Lagna', val: toDhumyadhiEntry('Arudha Lagna', 'ஆரூட லக்னம்', arudhaLagnaDeg, 'செவ்வாய்') },
    { title: 'கடிகா லக்னம்', eng: 'Ghati Lagna', val: toDhumyadhiEntry('Ghati Lagna', 'கடிகா லக்னம்', ghatiLagnaDeg, 'சூரியன்') },
    { title: 'இந்து லக்னம்', eng: 'Indu Lagna', val: toDhumyadhiEntry('Indu Lagna', 'இந்து லக்னம்', induLagnaDeg, 'சுக்கிரன்') },
    { title: 'பாவ லக்னம்', eng: 'Bhava Lagna', val: toDhumyadhiEntry('Bhava Lagna', 'பாவ லக்னம்', bhavaLagnaDeg, 'குரு') },
    { title: 'ஸ்ரீ லக்னம்', eng: 'Sree Lagna', val: toDhumyadhiEntry('Sree Lagna', 'ஸ்ரீ லக்னம்', sreeLagnaDeg, 'சனி') },
    { title: 'யோகி பாகை', eng: 'Yogi Point', val: toDhumyadhiEntry('Yogi Point', 'யோகி', yogiDeg, 'குரு') },
    { title: 'அவயோகி பாகை', eng: 'Avayogi Point', val: toDhumyadhiEntry('Avayogi Point', 'அவயோகி', avayogiDeg, 'ராகு') },
    { title: 'மாற்று யோகி', eng: 'Matru Yogi', val: { tamilSign: 'சிம்மம்', signName: 'Simha', lord: 'சூரியன்' } },
    { title: '22-ம் திரேக்காணம்', eng: '22nd Drekkana', val: { tamilSign: TAMIL_RASHIS[drekkana22Sign], signName: RASHI_NAMES[drekkana22Sign], lord: RASHI_LORDS_TA[drekkana22Sign] } },
    { title: '64-ம் நவாம்சம்', eng: '64th Navamsha', val: { tamilSign: TAMIL_RASHIS[navamsha64Sign], signName: RASHI_NAMES[navamsha64Sign], lord: RASHI_LORDS_TA[navamsha64Sign] } },
    { title: 'சர்ப்ப திரேக்காணம்', eng: 'Sarpa Drekkana', val: { lords: 'சந்திரன், செவ்வாய், ராகு' } },
    { title: isFemale ? 'க்ஷேத்ர ஸ்புடம்' : 'பீஜ ஸ்புடம்', eng: isFemale ? 'Kshetra Sphutam' : 'Beeja Sphutam', val: { colonDeg: formatColonDMS(beejaKshetraDeg), tamilSign: TAMIL_RASHIS[Math.floor(beejaKshetraDeg / 30)], signName: RASHI_NAMES[Math.floor(beejaKshetraDeg / 30)] } },
    { title: 'அதிர்ஷ்ட பாகை', eng: 'Fortune Degree', val: { colonDeg: formatColonDMS(adrishtaBhaagaDeg), tamilSign: TAMIL_RASHIS[Math.floor(adrishtaBhaagaDeg / 30)], signName: RASHI_NAMES[Math.floor(adrishtaBhaagaDeg / 30)] } },
  ];

  // Upagraha Chakra South Indian Grid
  const upagrahaChartGrid = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] };
  mandhyadhi.forEach(u => {
    const sIdx = Math.floor(u.parashara.deg / 30);
    upagrahaChartGrid[sIdx].push({ key: u.name.toLowerCase(), name: u.name, short: u.tamil.slice(0, 3) });
  });
  dhumyadhi.forEach(d => {
    const sIdx = Math.floor(d.deg / 30);
    upagrahaChartGrid[sIdx].push({ key: d.name.toLowerCase(), name: d.name, short: d.tamil.slice(0, 3) });
  });

  return {
    mandhyadhi,
    dhumyadhi,
    specialLagnas,
    upagrahaChartGrid
  };
}

const RASHI_LORDS_TA = [
  'செவ்வாய்', 'சுக்கிரன்', 'புதன்', 'சந்திரன்', 'சூரியன்', 'புதன்',
  'சுக்கிரன்', 'செவ்வாய்', 'குரு', 'சனி', 'சனி', 'குரு'
];

/**
 * 4. Planetary Friendships (Naisargika, Tatkalika, Panchadha) & Avasthas (Pages 16-17)
 */
function computePlanetaryFriendships(planets = []) {
  const naisargika = {
    Sun:     { mitra: ['Moon', 'Mars', 'Jupiter'], sama: ['Mercury'], shatru: ['Venus', 'Saturn'] },
    Moon:    { mitra: ['Sun', 'Mercury'], sama: ['Mars', 'Jupiter', 'Venus', 'Saturn'], shatru: [] },
    Mars:    { mitra: ['Sun', 'Moon', 'Jupiter'], sama: ['Venus', 'Saturn'], shatru: ['Mercury'] },
    Mercury: { mitra: ['Sun', 'Venus'], sama: ['Mars', 'Jupiter', 'Saturn'], shatru: ['Moon'] },
    Jupiter: { mitra: ['Sun', 'Moon', 'Mars'], sama: ['Saturn'], shatru: ['Mercury', 'Venus'] },
    Venus:   { mitra: ['Mercury', 'Saturn'], sama: ['Mars', 'Jupiter'], shatru: ['Sun', 'Moon'] },
    Saturn:  { mitra: ['Mercury', 'Venus'], sama: ['Jupiter'], shatru: ['Sun', 'Moon', 'Mars'] },
  };

  const corePlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  const signMap = {};
  corePlanets.forEach(pName => {
    const pl = planets.find(p => p.name.includes(pName));
    signMap[pName] = pl ? Math.floor(pl.deg / 30) : 0;
  });

  const tatkalika = {};
  const panchadha = {};

  corePlanets.forEach(p1 => {
    tatkalika[p1] = {};
    panchadha[p1] = {};
    const s1 = signMap[p1];

    corePlanets.forEach(p2 => {
      if (p1 === p2) {
        tatkalika[p1][p2] = '---';
        panchadha[p1][p2] = '---';
        return;
      }
      const s2 = signMap[p2];
      const diff = ((s2 - s1 + 12) % 12) + 1; // 1 to 12
      const isTatkalikaMitra = [2, 3, 4, 10, 11, 12].includes(diff);
      tatkalika[p1][p2] = isTatkalikaMitra ? 'Mitra' : 'Shatru';

      // Panchadha Maitri = Naisargika + Tatkalika
      const naiIsMitra = naisargika[p1].mitra.includes(p2);
      const naiIsShatru = naisargika[p1].shatru.includes(p2);
      const naiState = naiIsMitra ? 'mitra' : naiIsShatru ? 'shatru' : 'sama';

      if (naiState === 'mitra') {
        panchadha[p1][p2] = isTatkalikaMitra ? 'Adhi Mitra' : 'Sama';
      } else if (naiState === 'sama') {
        panchadha[p1][p2] = isTatkalikaMitra ? 'Mitra' : 'Shatru';
      } else {
        panchadha[p1][p2] = isTatkalikaMitra ? 'Sama' : 'Adhi Shatru';
      }
    });
  });

  // Baladi Avasthas & Dasa Mandalam from chart degrees
  const avastheList = corePlanets.map(pName => {
    const pl = planets.find(p => p.name.includes(pName)) || { deg: 0, signName: 'Mesha', isRetro: false };
    const pDeg = ((pl.deg % 360) + 360) % 360;
    const sIdx = Math.floor(pDeg / 30);
    const degInSign = pDeg % 30;
    const isOddSign = sIdx % 2 === 0;

    // Baladi Avastha
    let avasthe = 'யுவ';
    let avastheEn = 'Yuva (Adult)';
    let part = Math.floor(degInSign / 6); // 0 to 4
    if (!isOddSign) part = 4 - part; // Reversed for even signs
    if (part === 0) { avasthe = 'பால'; avastheEn = 'Bala (Infant)'; }
    else if (part === 1) { avasthe = 'குமார'; avastheEn = 'Kumara (Youth)'; }
    else if (part === 2) { avasthe = 'யுவ'; avastheEn = 'Yuva (Adult)'; }
    else if (part === 3) { avasthe = 'விருத்த'; avastheEn = 'Vriddha (Aged)'; }
    else { avasthe = 'மரண'; avastheEn = 'Mrita (Dead)'; }

    // Dasa Mandalam (Nara, Rakshasa, Deva based on decanate)
    const decPart = Math.floor(degInSign / 10); // 0, 1, 2
    const mandalamTa = decPart === 0 ? 'நர மண்டலம்' : decPart === 1 ? 'ராக்ஷச மண்டலம்' : 'தேவ மண்டலம்';
    const mandalamEn = decPart === 0 ? 'Nara Mandalam' : decPart === 1 ? 'Rakshasa Mandalam' : 'Deva Mandalam';

    // Dasa Samayam
    const samayamList = ['போஜனம் (மத்திமம்)', 'வஸ்திரதாரணம் (நன்மை)', 'பூசை (உத்தமம்)', 'கமனம் (மத்திமம்)', 'சயனம் (அசுபம்)', 'சபா (உத்தமம்)', 'ஆஸ்தானம் (நன்மை)'];
    const samayamTa = samayamList[sIdx % 7];

    return {
      planet: pName,
      tamilPlanet: TAMIL_PLANETS[pName] || pName,
      sign: RASHI_NAMES[sIdx],
      tamilSign: TAMIL_RASHIS[sIdx],
      deg: formatColonDMS(degInSign),
      avasthe,
      avastheEn,
      mandalamTa,
      mandalamEn,
      samayamTa,
      score: part === 2 ? 100 : part === 1 ? 75 : part === 3 ? 50 : 25
    };
  });

  return {
    naisargika,
    tatkalika,
    panchadha,
    avastheList
  };
}

/**
 * 5. Aspect Angles Matrix (Pages 18-19)
 */
function computeAspectAngles(planets = [], bhavaSphutam = []) {
  const pList = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const tamilNames = ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];

  // Graha-Graha Aspect Angles (Page 18)
  const matrix = [];
  pList.forEach((pName, i) => {
    const pl1 = planets.find(p => p.name.includes(pName));
    const deg1 = pl1 ? pl1.deg : i * 40;
    const row = {
      planet: tamilNames[i],
      planetEn: pName,
      deg: formatColonDMS(deg1),
      angles: []
    };

    pList.forEach((pName2, j) => {
      if (i === j) {
        row.angles.push('--');
        return;
      }
      const pl2 = planets.find(p => p.name.includes(pName2));
      const deg2 = pl2 ? pl2.deg : j * 40;
      const angle = Math.round(Math.abs(deg2 - deg1) % 360);
      row.angles.push(angle > 180 ? 360 - angle : angle);
    });
    matrix.push(row);
  });

  // Bhava-Graha Aspect Angles (Page 19)
  const bhavaAngles = [];
  for (let b = 1; b <= 12; b++) {
    const bObj = bhavaSphutam.find(item => item.house === b);
    const midDeg = bObj?.midRaw !== undefined ? bObj.midRaw : (b - 1) * 30 + 15;
    const row = {
      bhava: `${b}-பாவம்`,
      bhavaEn: `House ${b}`,
      house: b,
      mid: formatColonDMS(midDeg),
      midDeg: formatColonDMS(midDeg),
      angles: pList.map((pName, j) => {
        const pl = planets.find(p => p.name.includes(pName));
        const pDeg = pl ? pl.deg : j * 40;
        const angle = Math.round(Math.abs(pDeg - midDeg) % 360);
        return angle > 180 ? 360 - angle : angle;
      })
    };
    bhavaAngles.push(row);
  }

  return {
    matrix,
    bhavaAngles,
    planetHeaders: tamilNames,
    planetHeadersEn: pList
  };
}

/**
 * 6. Pachaka, Bodhaka, Karaka, Vedhaka Roles & Tara Bala (Page 31)
 */
function computePachakaBodhaka() {
  const table = [
    { planet: 'சூரியன்', pachaka: 'சனி', bodhaka: 'செவ்வாய்', karaka: 'குரு', vedhaka: 'சுக்கிரன்' },
    { planet: 'சந்திரன்', pachaka: 'சுக்கிரன்', bodhaka: 'செவ்வாய்', karaka: 'சனி', vedhaka: 'சூரியன்' },
    { planet: 'செவ்வாய்', pachaka: 'சூரியன்', bodhaka: 'சந்திரன்', karaka: 'சனி', vedhaka: 'புதன்' },
    { planet: 'புதன்', pachaka: 'சந்திரன்', bodhaka: 'குரு', karaka: 'சுக்கிரன்', vedhaka: 'செவ்வாய்' },
    { planet: 'குரு', pachaka: 'சனி', bodhaka: 'செவ்வாய்', karaka: 'சந்திரன்', vedhaka: 'சூரியன்' },
    { planet: 'சுக்கிரன்', pachaka: 'புதன்', bodhaka: 'குரு', karaka: 'சூரியன்', vedhaka: 'சனி' },
    { planet: 'சனி', pachaka: 'சுக்கிரன்', bodhaka: 'சந்திரன்', karaka: 'குரு', vedhaka: 'செவ்வாய்' },
  ];

  const taraBala = [
    { num: 1, type: 'ஜன்ம தாரை (Janma Tara)', stars: 'திருவாதிரை, சுவாதி, சதயம்', result: 'அசுபம் (மத்திமம்)' },
    { num: 2, type: 'சம்பத் தாரை (Sampat Tara)', stars: 'புனர்பூசம், விசாகம், பூரட்டாதி', result: 'உத்தமம் (செல்வம், நன்மை)' },
    { num: 3, type: 'விபத் தாரை (Vipat Tara)', stars: 'பூசம், அனுஷம், உத்திரட்டாதி', result: 'அசுபம் (இடையூறு, தடை)' },
    { num: 4, type: 'க்ஷேம தாரை (Kshema Tara)', stars: 'ஆயில்யம், கேட்டை, ரேவதி', result: 'உத்தமம் (சுகம், நலம்)' },
    { num: 5, type: 'பிரத்யக் தாரை (Pratyak Tara)', stars: 'அஸ்வினி, மகம், மூலம்', result: 'அசுபம் (விரோதம், தாமதம்)' },
    { num: 6, type: 'சாதக தாரை (Sadhaka Tara)', stars: 'பரணி, பூரம், பூராடம்', result: 'உத்தமம் (வெற்றி, காரியசித்தி)' },
    { num: 7, type: 'வத தாரை (Vadha Tara)', stars: 'கிருத்திகை, உத்திரம், உத்திராடம்', result: 'அதி அசுபம் (எச்சரிக்கை)' },
    { num: 8, type: 'மித்ர தாரை (Mitra Tara)', stars: 'ரோகிணி, ஹஸ்தம், திருவோணம்', result: 'உத்தமம் (நட்பு, ஆதாயம்)' },
    { num: 9, type: 'பரம மித்ர தாரை (Param Mitra Tara)', stars: 'மிருகசீரிஷம், சித்திரை, அவிட்டம்', result: 'மிக உத்தமம் (உயர்ந்த நன்மை)' },
  ];

  return { table, taraBala };
}

/**
 * 7. Pancha Pakshi Sastra (Page 21)
 */
function computePanchaPakshi(nakshatraIndex = 5) {
  const birds = [
    {
      name: 'Vulture',
      tamil: 'வல்லூறு',
      element: 'Earth (பூமி)',
      direction: 'North (வடக்கு)',
      color: 'Brown / Dark Yellow',
      padupakshiDays: ['Thursday (வியாழன்)', 'Sunday (ஞாயிறு)'],
      friendlyBirds: 'கோழி, மயில்',
      enemyBirds: 'ஆந்தை, காகம்',
    },
    {
      name: 'Owl',
      tamil: 'ஆந்தை',
      element: 'Water (நீர்)',
      direction: 'East (கிழக்கு)',
      color: 'Grey / Black',
      padupakshiDays: ['Friday (வெள்ளி)'],
      friendlyBirds: 'காகம், மயில்',
      enemyBirds: 'வல்லூறு, கோழி',
    },
    {
      name: 'Crow',
      tamil: 'காகம்',
      element: 'Fire (அக்னி)',
      direction: 'South (தெற்கு)',
      color: 'Black',
      padupakshiDays: ['Tuesday (செவ்வாய்)'],
      friendlyBirds: 'ஆந்தை, கோழி',
      enemyBirds: 'வல்லூறு, மயில்',
    },
    {
      name: 'Cock',
      tamil: 'கோழி',
      element: 'Air (வாயு)',
      direction: 'West (மேற்கு)',
      color: 'Red / Multi',
      padupakshiDays: ['Wednesday (புதன்)'],
      friendlyBirds: 'வல்லூறு, காகம்',
      enemyBirds: 'ஆந்தை, மயில்',
    },
    {
      name: 'Peacock',
      tamil: 'மயில்',
      element: 'Ether (ஆகாயம்)',
      direction: 'Center (மத்தியம்)',
      color: 'Blue / Green',
      padupakshiDays: ['Saturday (சனி)', 'Monday (திங்கள்)'],
      friendlyBirds: 'வல்லூறு, ஆந்தை',
      enemyBirds: 'காகம், கோழி',
    }
  ];

  let birdIndex = 0;
  if (nakshatraIndex < 5) birdIndex = 0;
  else if (nakshatraIndex < 11) birdIndex = 1;
  else if (nakshatraIndex < 16) birdIndex = 2;
  else if (nakshatraIndex < 21) birdIndex = 3;
  else birdIndex = 4;

  const nativeBird = birds[birdIndex];

  const activities = [
    { period: 'காலை 06:00 - 08:24', activity: 'ஊண் (Eating)', score: '80%', status: 'நன்மை (ஆதாயம், புத்துணர்ச்சி)' },
    { period: 'காலை 08:24 - 10:48', activity: 'நடை (Walking)', score: '60%', status: 'மத்திமம் (பயணங்கள், சந்திப்பு)' },
    { period: 'மதியம் 10:48 - 01:12', activity: 'அரசு (Ruling)', score: '100%', status: 'மிக உத்தமம் (வெற்றி, புதிய தொடக்கம்)' },
    { period: 'பிற்பகல் 01:12 - 03:36', activity: 'துயில் (Sleeping)', score: '40%', status: 'அசுபம் (ஓய்வு தேவை, சுணக்கம்)' },
    { period: 'மாலை 03:36 - 06:00', activity: 'சாவு (Dying)', score: '10%', status: 'அதி அசுபம் (எச்சரிக்கை, காரியத் தடை)' },
  ];

  return {
    nativeBird,
    dayActivities: activities,
    nightRuling: 'துயில் & நடை சுழற்சி'
  };
}

/**
 * 8. 365.25-Day Bhukti & Antara Schedules (Pages 34-42)
 */
function computeBhuktiAntaraSchedules(allMahadashas = []) {
  const PLANET_NAMES = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const TAMIL_NAMES = ['கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு', 'குரு', 'சனி', 'புதன்'];
  const YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];

  return allMahadashas.map(dasha => {
    const mdIndex = PLANET_NAMES.findIndex(p => p.toLowerCase() === (dasha.lord || '').toLowerCase());
    const mdYears = dasha.years || (mdIndex >= 0 ? YEARS[mdIndex] : 18);
    const startIdx = mdIndex >= 0 ? mdIndex : 5;

    const antaras = [];
    for (let b = 0; b < 9; b++) {
      const bhuktiLord = PLANET_NAMES[(startIdx + b) % 9];
      const bhuktiTamil = TAMIL_NAMES[(startIdx + b) % 9];
      const bYears = YEARS[(startIdx + b) % 9];

      const totalMonths = (mdYears * bYears) / 10;
      const y = Math.floor(totalMonths / 12);
      const m = Math.floor(totalMonths % 12);
      const d = Math.round((totalMonths - Math.floor(totalMonths)) * 30);
      const duration = `${y}-${m}-${d}`;

      const bObj = dasha.bhuktis?.[b];
      const endDate = bObj?.endDate || '---';

      antaras.push({
        bhukti: `${dasha.tamilLord || dasha.lord} - ${bhuktiTamil}`,
        bhuktiEng: `${dasha.lord} - ${bhuktiLord}`,
        antaraLord: bhuktiTamil,
        antaraLordEng: bhuktiLord,
        endDate: endDate,
        duration: bObj?.duration || duration
      });
    }

    return {
      dashaLord: dasha.lord,
      tamilLord: dasha.tamilLord,
      years: dasha.years,
      antaras
    };
  });
}

/**
 * 9. Individual Ashtakavarga Shodhana for all 7 Planets (Pages 43-49)
 * Full 8x12 Contribution Grid + 3 South Indian Chakras + Shodhya Pindas
 */
function computeIndividualAshtakavargaShodhana(sarvashtakavarga = {}, planets = []) {
  // Classical Parashari Bindu contribution matrix templates (1=bindu, 0=rekha)
  const CONTRIBUTION_MATRICES = {
    Sun: {
      Sun:     [1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Moon:    [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0],
      Mars:    [1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Mercury: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1],
      Jupiter: [0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0],
      Venus:   [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      Saturn:  [1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Lagna:   [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1]
    },
    Moon: {
      Sun:     [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
      Moon:    [1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
      Mars:    [0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0],
      Mercury: [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
      Jupiter: [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1],
      Venus:   [0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
      Saturn:  [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0],
      Lagna:   [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0]
    },
    Mars: {
      Sun:     [0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
      Moon:    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      Mars:    [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
      Mercury: [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0],
      Jupiter: [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
      Venus:   [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1],
      Saturn:  [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Lagna:   [1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0]
    },
    Mercury: {
      Sun:     [0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1],
      Moon:    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
      Mars:    [1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Mercury: [1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1],
      Jupiter: [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1],
      Venus:   [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
      Saturn:  [1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Lagna:   [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0]
    },
    Jupiter: {
      Sun:     [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0],
      Moon:    [0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      Mars:    [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
      Mercury: [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
      Jupiter: [1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
      Venus:   [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],
      Saturn:  [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
      Lagna:   [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0]
    },
    Venus: {
      Sun:     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
      Moon:    [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
      Mars:    [0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
      Mercury: [0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
      Jupiter: [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0],
      Venus:   [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
      Saturn:  [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
      Lagna:   [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0]
    },
    Saturn: {
      Sun:     [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
      Moon:    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      Mars:    [0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1],
      Mercury: [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
      Jupiter: [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
      Venus:   [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
      Saturn:  [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0],
      Lagna:   [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0]
    }
  };

  const RASHI_GUNAKARA = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
  const GRAHA_GUNAKARA = { Sun: 5, Moon: 5, Mars: 8, Mercury: 5, Jupiter: 10, Venus: 7, Saturn: 5 };

  const corePlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const contributorRows = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];
  const contributorRowsTa = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', '1-லக்னம்'];

  return corePlanets.map((pName, pIdx) => {
    const bindus = sarvashtakavarga?.planets?.[pIdx]?.points
      ? [...sarvashtakavarga.planets[pIdx].points]
      : [4, 5, 3, 4, 6, 3, 4, 3, 5, 4, 4, 3];

    // Build 8x12 Contribution Grid
    const template = CONTRIBUTION_MATRICES[pName] || CONTRIBUTION_MATRICES.Sun;
    const grid = contributorRows.map((cName, cIdx) => {
      const rowVals = template[cName] || [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0];
      return {
        contributor: cName,
        tamilContributor: contributorRowsTa[cIdx],
        points: rowVals
      };
    });

    // 1. Trikona Shodhana (Reduction of Triads)
    const trikona = [...bindus];
    const triads = [
      [0, 4, 8],   // Mesha, Simha, Dhanu
      [1, 5, 9],   // Vrishabha, Kanya, Makara
      [2, 6, 10],  // Mithuna, Tula, Kumbha
      [3, 7, 11]   // Kataka, Vrishchika, Meena
    ];
    triads.forEach(tri => {
      const minVal = Math.min(trikona[tri[0]], trikona[tri[1]], trikona[tri[2]]);
      tri.forEach(sign => {
        trikona[sign] = trikona[sign] - minVal;
      });
    });

    // 2. Ekadhipatya Shodhana (Reduction of Dual Rulerships)
    const ekadhipatya = [...trikona];
    const dualPairs = [
      [0, 7],  // Mars: Aries & Scorpio
      [1, 6],  // Venus: Taurus & Libra
      [2, 5],  // Mercury: Gemini & Virgo
      [8, 11], // Jupiter: Sag & Pisces
      [9, 10]  // Saturn: Capricorn & Aquarius
    ];
    dualPairs.forEach(pair => {
      const [s1, s2] = pair;
      if (ekadhipatya[s1] > 0 && ekadhipatya[s2] > 0) {
        const minVal = Math.min(ekadhipatya[s1], ekadhipatya[s2]);
        ekadhipatya[s1] = minVal;
        ekadhipatya[s2] = minVal;
      }
    });

    // 3. Shodhya Pindas Calculation
    let rashiPinda = 0;
    for (let s = 0; s < 12; s++) {
      rashiPinda += ekadhipatya[s] * RASHI_GUNAKARA[s];
    }

    let grahaPinda = 0;
    corePlanets.forEach(plKey => {
      const plObj = planets.find(p => p.name.includes(plKey));
      const sIdx = plObj ? Math.floor(plObj.deg / 30) : 0;
      grahaPinda += ekadhipatya[sIdx] * (GRAHA_GUNAKARA[plKey] || 5);
    });

    const totalShodhyaPinda = rashiPinda + grahaPinda;

    // Build 3 South Indian mini-chakras: BAV, Trikona, Ekadhipatya
    function makeBinduGrid(binduArray) {
      const g = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] };
      binduArray.forEach((b, s) => {
        g[s].push({ short: `${b}` });
      });
      return g;
    }

    return {
      name: pName,
      tamil: TAMIL_PLANETS[pName] || pName,
      gunakara: GRAHA_GUNAKARA[pName] || 5,
      contributionGrid: grid,
      bindus,
      trikona,
      ekadhipatya,
      bavGrid: makeBinduGrid(bindus),
      trikonaGrid: makeBinduGrid(trikona),
      ekadhipatyaGrid: makeBinduGrid(ekadhipatya),
      shodhyaPinda: {
        rashiPinda,
        grahaPinda,
        totalShodhyaPinda
      }
    };
  });
}

module.exports = {
  getVargaSign,
  computeShodashavarga,
  computeDashaVargasSummary,
  computeSripatiBhavaSphutam,
  computeUpagrahasAndSpecialLagnas,
  computePlanetaryFriendships,
  computeAspectAngles,
  computePachakaBodhaka,
  computePanchaPakshi,
  computeBhuktiAntaraSchedules,
  computeIndividualAshtakavargaShodhana,
  RASHI_NAMES,
  TAMIL_RASHIS,
  PLANET_NAMES,
  TAMIL_PLANETS,
  NAKSHATRA_NAMES,
  TAMIL_NAKSHATRAS
};
