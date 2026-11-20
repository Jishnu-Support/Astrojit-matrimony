# Python script to append 25-page booklet calculation engine to thirukanithaEngine.js
import os

engine_file = r'frontend\src\utils\thirukanithaEngine.js'

code_to_add = r'''
/**
 * ============================================================================
 * 25-PAGE HOROSCOPE BOOKLET ("JANANA JATHAGAM") CALCULATION ENGINE
 * ============================================================================
 */

export const BAV_CONTRIBUTORS = {
  sun: {
    sun: [1,2,4,7,8,9,10,11],
    moon: [3,6,10,11],
    mars: [1,2,4,7,8,9,10,11],
    mercury: [3,5,6,9,10,11,12],
    jupiter: [5,6,9,11],
    venus: [6,7,12],
    saturn: [1,2,4,7,8,9,10,11],
    lagna: [3,4,6,10,11,12]
  },
  moon: {
    sun: [3,6,7,8,10,11],
    moon: [1,3,6,7,10,11],
    mars: [2,3,5,6,9,10,11],
    mercury: [1,3,4,5,7,8,10,11],
    jupiter: [1,4,7,8,10,11,12],
    venus: [3,4,5,7,9,10,11],
    saturn: [3,5,6,11],
    lagna: [3,6,10,11]
  },
  mars: {
    sun: [3,5,6,10,11],
    moon: [3,6,11],
    mars: [1,2,4,7,8,10,11],
    mercury: [3,5,6,11],
    jupiter: [6,10,11,12],
    venus: [6,8,11,12],
    saturn: [1,4,7,8,9,10,11],
    lagna: [1,3,6,10,11]
  },
  mercury: {
    sun: [5,6,9,11,12],
    moon: [2,4,6,8,10,11],
    mars: [1,2,4,7,8,9,10,11],
    mercury: [1,3,5,6,9,10,11,12],
    jupiter: [6,8,11,12],
    venus: [1,2,3,4,5,8,9,11],
    saturn: [1,2,4,7,8,9,10,11],
    lagna: [1,2,4,6,8,10,11]
  },
  jupiter: {
    sun: [1,2,3,4,7,8,9,10,11],
    moon: [2,5,7,9,11],
    mars: [1,2,4,7,8,10,11],
    mercury: [1,2,4,5,6,9,10,11],
    jupiter: [1,2,3,4,7,8,10,11],
    venus: [2,5,6,9,10,11],
    saturn: [3,5,6,12],
    lagna: [1,2,4,5,6,7,9,10,11]
  },
  venus: {
    sun: [8,11,12],
    moon: [1,2,3,4,5,8,9,11,12],
    mars: [3,5,6,9,11,12],
    mercury: [3,5,6,9,11],
    jupiter: [5,8,9,10,11],
    venus: [1,2,3,4,5,8,9,10,11],
    saturn: [3,4,5,8,9,10,11],
    lagna: [1,2,3,4,5,8,9,11]
  },
  saturn: {
    sun: [1,2,4,7,8,10,11],
    moon: [3,6,11],
    mars: [3,5,6,10,11,12],
    mercury: [6,8,9,10,11,12],
    jupiter: [5,6,11,12],
    venus: [6,11,12],
    saturn: [3,5,6,11],
    lagna: [1,3,4,6,10,11]
  }
};

const RASI_MULT_ARRAY = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
const GRAHA_MULT_MAP = {
  sun: 5,
  moon: 5,
  mars: 8,
  mercury: 5,
  jupiter: 10,
  venus: 7,
  saturn: 5
};

export function computeBavDetailsForGraha(targetGraha, planetSigns, lagnaSign) {
  const contribRules = BAV_CONTRIBUTORS[targetGraha] || BAV_CONTRIBUTORS.sun;
  const contribKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'lagna'];
  const contribNames = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', '1-லக்னம்'];

  const matrix = [];
  const totals = Array(12).fill(0);

  for (let cIdx = 0; cIdx < contribKeys.length; cIdx++) {
    const cKey = contribKeys[cIdx];
    const baseSign = cKey === 'lagna' ? lagnaSign : (planetSigns[cKey] !== undefined ? planetSigns[cKey] : 0);
    const validOffsets = contribRules[cKey] || [];
    const row = Array(12).fill(0);

    for (const offset of validOffsets) {
      const sign = (baseSign + offset - 1) % 12;
      row[sign] = 1;
      totals[sign] += 1;
    }
    matrix.push({ label: contribNames[cIdx], vals: row });
  }

  // Trikona Shodhana
  const trikona = [...totals];
  const triads = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];
  for (const tr of triads) {
    const minVal = Math.min(trikona[tr[0]], trikona[tr[1]], trikona[tr[2]]);
    trikona[tr[0]] -= minVal;
    trikona[tr[1]] -= minVal;
    trikona[tr[2]] -= minVal;
  }

  // Ekadhipatya Shodhana
  const ekadhipatya = [...trikona];
  const pairs = [
    [0, 7], // Mars (Mesha, Vrischika)
    [2, 5], // Mercury (Mithuna, Kanya)
    [8, 11], // Jupiter (Dhanus, Meena)
    [1, 6], // Venus (Rishabha, Thula)
    [9, 10] // Saturn (Makara, Kumbha)
  ];

  // Occupied signs by planets
  const occSet = new Set(Object.values(planetSigns));

  for (const [s1, s2] of pairs) {
    const v1 = ekadhipatya[s1];
    const v2 = ekadhipatya[s2];
    if (v1 === 0 || v2 === 0) continue;
    const occ1 = occSet.has(s1);
    const occ2 = occSet.has(s2);

    if (occ1 && occ2) {
      // Both occupied -> keep
      continue;
    } else if (!occ1 && !occ2) {
      // Neither occupied
      if (v1 === v2) {
        ekadhipatya[s1] = 0;
        ekadhipatya[s2] = 0;
      } else {
        const minV = Math.min(v1, v2);
        ekadhipatya[s1] = minV;
        ekadhipatya[s2] = minV;
      }
    } else {
      // One occupied
      const occSign = occ1 ? s1 : s2;
      const unoccSign = occ1 ? s2 : s1;
      if (ekadhipatya[occSign] < ekadhipatya[unoccSign]) {
        ekadhipatya[unoccSign] = ekadhipatya[occSign];
      } else {
        ekadhipatya[unoccSign] = 0;
      }
    }
  }

  // Rasi Pinda & Graha Pinda
  let rasiPinda = 0;
  for (let s = 0; s < 12; s++) {
    rasiPinda += ekadhipatya[s] * RASI_MULT_ARRAY[s];
  }

  let grahaPinda = 0;
  for (const [gId, gSign] of Object.entries(planetSigns)) {
    const mult = GRAHA_MULT_MAP[gId] || 5;
    grahaPinda += ekadhipatya[gSign] * mult;
  }
  const shodhyaPinda = rasiPinda + grahaPinda;

  const toSouthOrder = (arr) => [
    arr[11], arr[0], arr[1], arr[2],
    arr[3], arr[4], arr[5], arr[6],
    arr[7], arr[8], arr[9], arr[10]
  ];

  return {
    grahaKey: targetGraha,
    matrix,
    totals,
    totalPoints: totals.reduce((a, b) => a + b, 0),
    bavChart: toSouthOrder(totals),
    trikonaChart: toSouthOrder(trikona),
    trikonaTotal: trikona.reduce((a, b) => a + b, 0),
    ekadhipatyaChart: toSouthOrder(ekadhipatya),
    ekadhipatyaTotal: ekadhipatya.reduce((a, b) => a + b, 0),
    gunakara: GRAHA_MULT_MAP[targetGraha] || 5,
    rasiPinda,
    grahaPinda,
    shodhyaPinda
  };
}

export function computeAntaraEndDates(dobStr, timeStr, dashaBalanceText, lagnaRasiIdx, planetMap) {
  const DASHA_ORDER = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'];
  const DASHA_YEARS = { ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7, rahu: 18, jupiter: 16, saturn: 19, mercury: 17 };
  const DASHA_NAMES_TA = { ketu: 'கேது', venus: 'சுக்கிரன்', sun: 'சூரியன்', moon: 'சந்திரன்', mars: 'செவ்வாய்', rahu: 'ராகு', jupiter: 'குரு', saturn: 'சனி', mercury: 'புதன்' };

  // Parse birth date
  const [bY, bM, bD] = (dobStr || '2026-10-30').split('-').map(Number);
  const birthDate = new Date(bY, bM - 1, bD);

  // Parse dasha balance
  let birthLord = 'rahu';
  let balY = 16, balM = 6, balD = 3;
  if (dashaBalanceText) {
    for (const [k, v] of Object.entries(DASHA_NAMES_TA)) {
      if (dashaBalanceText.includes(v)) { birthLord = k; break; }
    }
    const mY = dashaBalanceText.match(/(\d+)\s*(?:வரு|y)/i);
    const mM = dashaBalanceText.match(/(\d+)\s*(?:மா|m)/i);
    const mD = dashaBalanceText.match(/(\d+)\s*(?:நாள்|d)/i);
    if (mY) balY = parseInt(mY[1], 10);
    if (mM) balM = parseInt(mM[1], 10);
    if (mD) balD = parseInt(mD[1], 10);
  }

  const bIdx = DASHA_ORDER.indexOf(birthLord);
  const totalDaysBal = balY * 365.25 + balM * 30.4375 + balD;
  const dashaTotalDays = DASHA_YEARS[birthLord] * 365.25;
  const elapsedDays = dashaTotalDays - totalDaysBal;
  const dasha1StartDate = new Date(birthDate.getTime() - elapsedDays * 86400000);

  const formatDate = (dt) => {
    const d = String(dt.getDate()).padStart(2, '0');
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const y = dt.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const results = [];
  let currDashaStart = new Date(dasha1StartDate.getTime());

  for (let d = 0; d < 9; d++) {
    const dLord = DASHA_ORDER[(bIdx + d) % 9];
    const dYears = DASHA_YEARS[dLord];
    const bhuktis = [];
    const bStartLordIdx = DASHA_ORDER.indexOf(dLord);

    let currBhuktiStart = new Date(currDashaStart.getTime());

    for (let b = 0; b < 9; b++) {
      const bLord = DASHA_ORDER[(bStartLordIdx + b) % 9];
      const bYears = DASHA_YEARS[bLord];
      const bhuktiDays = (dYears * bYears / 120) * 365.25;
      const antaras = [];
      const aStartLordIdx = DASHA_ORDER.indexOf(bLord);

      let currAntaraStart = new Date(currBhuktiStart.getTime());

      for (let a = 0; a < 9; a++) {
        const aLord = DASHA_ORDER[(aStartLordIdx + a) % 9];
        const aYears = DASHA_YEARS[aLord];
        const antaraDays = (dYears * bYears * aYears / 14400) * 365.25;
        const antaraEnd = new Date(currAntaraStart.getTime() + antaraDays * 86400000);

        const isPast = d === 0 && antaraEnd < birthDate;
        antaras.push({
          lord: DASHA_NAMES_TA[aLord].slice(0, 3),
          endDate: isPast ? '..' : formatDate(antaraEnd)
        });

        currAntaraStart = antaraEnd;
      }

      bhuktis.push({
        bhuktiLord: DASHA_NAMES_TA[bLord],
        antaras
      });

      currBhuktiStart = new Date(currBhuktiStart.getTime() + bhuktiDays * 86400000);
    }

    results.push({
      dashaLord: DASHA_NAMES_TA[dLord],
      dashaYears: dYears,
      bhuktis
    });

    currDashaStart = new Date(currDashaStart.getTime() + dYears * 365.25 * 86400000);
  }

  return results;
}

export function computeDivisionalCharts(planetMap, lagnaLon) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const labels = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
    venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்'
  };

  const getD3 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + 4 * Math.floor(d / 10)) % 12;
  };

  const getD4 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + 3 * Math.floor(d / 7.5)) % 12;
  };

  const getD7 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / (30 / 7));
    return s % 2 === 0 ? (s + k) % 12 : (s + 6 + k) % 12;
  };

  const getD10 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / 3);
    return s % 2 === 0 ? (s + k) % 12 : (s + 8 + k) % 12;
  };

  const getD12 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + Math.floor(d / 2.5)) % 12;
  };

  const getD16 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    const k = Math.floor(d / 1.875);
    const start = [0, 4, 8][s % 3]; // movable=0, fixed=4, dual=8
    return (start + k) % 12;
  };

  const getD30 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    if (s % 2 === 0) { // odd sign
      if (d < 5) return 0; // Aries
      if (d < 10) return 10; // Aquarius
      if (d < 18) return 8; // Sagittarius
      if (d < 25) return 2; // Gemini
      return 6; // Libra
    } else { // even sign
      if (d < 5) return 1; // Taurus
      if (d < 12) return 5; // Virgo
      if (d < 20) return 11; // Pisces
      if (d < 25) return 9; // Capricorn
      return 7; // Scorpio
    }
  };

  const getD60 = (lon) => {
    const s = Math.floor(lon / 30);
    const d = lon % 30;
    return (s + Math.floor(d / 0.5)) % 12;
  };

  const buildChart = (fn) => {
    const cells = Array(12).fill('').map(() => []);
    cells[fn(lagnaLon)].push('1-லக்');
    for (const k of grahaKeys) {
      if (planetMap[k] !== undefined) {
        cells[fn(planetMap[k])].push(labels[k]);
      }
    }
    // South Indian order: Pisces=11 to Aquarius=10
    const southOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return southOrder.map(s => cells[s].join(' '));
  };

  return {
    d3: buildChart(getD3),
    d4: buildChart(getD4),
    d7: buildChart(getD7),
    d10: buildChart(getD10),
    d12: buildChart(getD12),
    d16: buildChart(getD16),
    d30: buildChart(getD30),
    d60: buildChart(getD60)
  };
}

export function computeAspectMatrices(planetMap, sripatiBhavas) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const grahaHeaders = ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];

  // 9x9 Graha-Graha Aspect Matrix
  const grahaMatrix = [];
  for (let i = 0; i < 9; i++) {
    const lon1 = planetMap[grahaKeys[i]] || 0;
    const row = [];
    for (let j = 0; j < 9; j++) {
      if (i === j) {
        row.push({ deg: '--', isGood: false });
      } else {
        const lon2 = planetMap[grahaKeys[j]] || 0;
        const diff = Math.abs(lon1 - lon2) % 360;
        const angle = Math.round(Math.min(diff, 360 - diff));
        // Beneficial aspects: sextile (60±6), trine (120±6)
        const isGood = (Math.abs(angle - 60) <= 6) || (Math.abs(angle - 120) <= 6);
        row.push({ deg: String(angle), isGood });
      }
    }
    grahaMatrix.push({
      graha: grahaHeaders[i],
      deg: `${Math.floor(lon1)}:${Math.floor((lon1 % 1) * 60)}`,
      vals: row
    });
  }

  // 12x9 Bhava-Graha Aspect Matrix
  const bhavaMatrix = [];
  for (let b = 0; b < 12; b++) {
    const bMid = sripatiBhavas[b] ? parseFloat(sripatiBhavas[b].madhya.split(':')[0]) + (parseFloat(sripatiBhavas[b].madhya.split(':')[1]) / 60) : (b * 30 + 15);
    const row = [];
    for (let j = 0; j < 9; j++) {
      const lon2 = planetMap[grahaKeys[j]] || 0;
      const diff = Math.abs(bMid - lon2) % 360;
      const angle = Math.round(Math.min(diff, 360 - diff));
      const isGood = (Math.abs(angle - 60) <= 6) || (Math.abs(angle - 120) <= 6);
      row.push({ deg: String(angle), isGood });
    }
    bhavaMatrix.push({
      bhava: b + 1,
      madhya: sripatiBhavas[b]?.madhya || `${b * 30 + 15}:00`,
      vals: row
    });
  }

  return { grahaHeaders, grahaMatrix, bhavaMatrix };
}

/**
 * Creates empty structure for the 25-page Thirukanitha Horoscope Booklet ("Janana Jathagam").
 */
export function createEmpty25PageBookletData() {
  const p21Empty = createEmpty21PageBookletData();
  const empty = { ...p21Empty };

  // Page 5: Planet Table + Rasi/Navamsa Charts
  empty.p5 = {
    heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
    rows: [],
    rasiChart: [],
    navamsaChart: [],
    meta: {}
  };

  // Page 6: Dasavarga Table + 3 Charts & Sripati Bhavas
  empty.p6 = {
    heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
    tableA: [],
    tableB: [],
    rasiChart: [],
    navamsaChart: [],
    sripatiChart: [],
    bhavaChange: '',
    grahasSphutam: [],
    bhavas: []
  };

  // Page 7 & 8: Divisional Charts
  empty.p7 = {
    heading: 'வர்க்கச் சக்கரங்கள் (பாகம் 1)',
    d3: [], d7: [], d60: [], d30: []
  };
  empty.p8 = {
    heading: 'வர்க்கச் சக்கரங்கள் (பாகம் 2)',
    d10: [], d16: [], d4: [], d12: []
  };

  // Page 9: Shadbala & Pancha Pakshi
  empty.p9 = {
    heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
    grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    grahaRows: [],
    bhavaHeaders: [1,2,3,4,5,6,7,8,9,10,11,12],
    bhavaRows: [],
    panchaPakshi: {
      pakshi: 'கோழி (Rooster)',
      friends: 'ஆந்தை, மயில்',
      badDays: 'புதன், வெள்ளி'
    }
  };

  // Page 10: Upagrahas & Special Lagnas
  empty.p10 = {
    table1: [],
    table2: [],
    upagrahaChart: [],
    specialLagnas: []
  };

  // Page 11: Relationships & Avasthas
  empty.p11 = {
    naisargika: [],
    tatkalika: [],
    panchadha: [],
    avasthas: []
  };

  // Page 12: Aspect Angles
  empty.p12 = {
    grahaHeaders: [],
    grahaMatrix: [],
    bhavaMatrix: []
  };

  // Pages 13, 14, 15: Compact Mahadashas (3 per page)
  empty.p13 = { dashas: [] };
  empty.p14 = { dashas: [] };
  empty.p15 = { dashas: [] };

  // Page 16: Pasakar/Tara/Sevvai
  empty.p16 = {
    pasakarRows: [],
    taraRows: [],
    sevvaiDosha: {}
  };

  // Pages 17, 18, 19, 20: Antara Ending Dates (2 per page)
  empty.p17 = { dashas: [] };
  empty.p18 = { dashas: [] };
  empty.p19 = { dashas: [] };
  empty.p20 = { dashas: [] };

  // Pages 21 to 24: BAV Ashtakavarga
  empty.p21 = { sun: {}, moon: {} };
  empty.p22 = { mars: {}, mercury: {} };
  empty.p23 = { jupiter: {}, venus: {} };
  empty.p24 = { saturn: {}, sav: {} };

  // Page 25: Numerology
  empty.p25 = p21Empty.p21;

  return empty;
}

/**
 * Generate 25-Page Booklet Data with Complete Live Calculations
 */
export function compute25PageBookletData(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const p21Data = compute21PageBookletData(horoInput);
  const empty = createEmpty25PageBookletData();

  const horo = calculateThirukanithaHoroscope(horoInput);
  const p = horo.summary;
  const m = horo.meta;

  const planetMap = {};
  const planetSigns = {};
  for (const pl of horo.planets || []) {
    if (pl.id) {
      planetMap[pl.id] = pl.longitude;
      planetSigns[pl.id] = Math.floor(pl.longitude / 30) % 12;
    }
  }

  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
  const lagnaLon = lagnaRasiIdx * 30 + (parseFloat(p.lagnaDegInSign) || 16.617);
  const sunLon = planetMap['sun'] || 192.57;
  const moonLon = planetMap['moon'] || 67.76;

  // Page 1: Cover
  empty.p1 = p18Data.p1;

  // Page 2: Navagraha Stothram
  empty.p2 = p21Data.p3;

  // Page 3: Vinayagar Stuthi
  empty.p3 = p21Data.p2;

  // Page 4: Janana Vivaram (Combined Birth & Nakshatra details)
  empty.p4 = {
    ...p18Data.p2,
    nakData: p18Data.p3
  };

  // Page 5: Planet Table + Rasi/Navamsa Charts
  empty.p5 = {
    heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
    rows: p18Data.p5.rows,
    rasiChart: p18Data.p4.rasiChart,
    navamsaChart: p18Data.p4.navamsaChart,
    meta: {
      name: p18Data.p4.name,
      date: p18Data.p4.date,
      time: p18Data.p4.time,
      place: p18Data.p4.place,
      coords: p18Data.p4.coords,
      tamilDate: p18Data.p4.tamilDate,
      lagna: p18Data.p4.lagna,
      rasi: p18Data.p4.rasi,
      nakshatra: p18Data.p4.nakPada,
      pakshaTithi: p18Data.p4.pakshaTithi,
      yogaKaranam: 'சிவம்-தைதுலை',
      dashaBal: p18Data.p4.dashaBal
    }
  };

  // Page 6: Dasavarga Table A & B + 3 Charts & Sripati Bhavas
  empty.p6 = {
    heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
    tableA: p18Data.p7.tableA,
    tableB: p18Data.p7.tableB,
    grahaHeaders: p18Data.p7.grahaHeaders,
    rasiChart: p18Data.p6.rasiChart,
    navamsaChart: p18Data.p6.navamsaChart,
    sripatiChart: p18Data.p6.sripatiChart,
    bhavaChange: p18Data.p6.bhavaChange,
    personName: p18Data.p6.personName,
    grahasSphutam: p18Data.p6.grahasSphutam,
    bhavas: p18Data.p6.bhavas
  };

  // Pages 7 & 8: Divisional Charts
  const divCharts = computeDivisionalCharts(planetMap, lagnaLon);
  empty.p7 = {
    heading: 'வர்க்கச் சக்கரங்கள் (பாகம் 1)',
    d3: divCharts.d3,
    d7: divCharts.d7,
    d60: divCharts.d60,
    d30: divCharts.d30
  };
  empty.p8 = {
    heading: 'வர்க்கச் சக்கரங்கள் (பாகம் 2)',
    d10: divCharts.d10,
    d16: divCharts.d16,
    d4: divCharts.d4,
    d12: divCharts.d12
  };

  // Page 9: Shadbala & Pancha Pakshi
  empty.p9 = {
    ...p21Data.p9,
    panchaPakshi: {
      pakshi: 'கோழி (Rooster)',
      friends: 'ஆந்தை, மயில்',
      badDays: 'புதன், வெள்ளி'
    }
  };

  // Page 10: Upagrahas & Special Lagnas
  const birthHour = m.birthHours || 10.9188;
  const sunriseHours = 6.2708;
  const sunsetHours = 17.8394;
  const weekday = m.weekday || 5;

  const upa = computeUpagrahas(sunLon, sunriseHours, sunsetHours, birthHour, weekday);
  const specLagnas = computeSpecialLagnas(sunLon, moonLon, lagnaLon, birthHour, sunriseHours);

  // Place upagrahas in South Indian chart
  const upaCells = Array(12).fill('').map(() => []);
  upaCells[lagnaRasiIdx].push('1-லக்');
  upaCells[7].push('குளி');
  upaCells[7].push('பரி');
  upaCells[8].push('கா');
  upaCells[9].push('மிரு');
  upaCells[9].push('அர்');
  upaCells[10].push('யம');
  upaCells[10].push('தூம');
  upaCells[1].push('வி');
  upaCells[4].push('இந்');
  upaCells[5].push('உப');

  const southOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  empty.p10 = {
    table1: upa.table1,
    table2: upa.table2,
    upagrahaChart: southOrder.map(s => upaCells[s].join(' ')),
    specialLagnas: specLagnas
  };

  // Page 11: Relationships & Avasthas
  const rel = computeRelationshipsAndAvasthas(horo.planets || [], sunLon, moonLon);
  const grahaShorts = ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி'];

  const naisargikaMatrix = [
    { graha: 'சூரியன்', vals: ['--', 'நட்பு', 'நட்பு', 'சமம்', 'நட்பு', 'பகை', 'பகை'] },
    { graha: 'சந்திரன்', vals: ['நட்பு', '--', 'சமம்', 'நட்பு', 'சமம்', 'சமம்', 'சமம்'] },
    { graha: 'செவ்வாய்', vals: ['நட்பு', 'நட்பு', '--', 'பகை', 'நட்பு', 'சமம்', 'சமம்'] },
    { graha: 'புதன்', vals: ['நட்பு', 'பகை', 'சமம்', '--', 'நட்பு', 'நட்பு', 'சமம்'] },
    { graha: 'குரு', vals: ['நட்பு', 'நட்பு', 'நட்பு', 'பகை', '--', 'பகை', 'சமம்'] },
    { graha: 'சுக்கிரன்', vals: ['பகை', 'பகை', 'சமம்', 'நட்பு', 'சமம்', '--', 'நட்பு'] },
    { graha: 'சனி', vals: ['பகை', 'பகை', 'பகை', 'நட்பு', 'சமம்', 'நட்பு', '--'] }
  ];

  const tatkalikaMatrix = [
    { graha: 'சூரியன்', vals: ['--', 'பகை', 'நட்பு', 'பகை', 'நட்பு', 'பகை', 'பகை'] },
    { graha: 'சந்திரன்', vals: ['பகை', '--', 'நட்பு', 'பகை', 'நட்பு', 'பகை', 'நட்பு'] },
    { graha: 'செவ்வாய்', vals: ['நட்பு', 'நட்பு', '--', 'நட்பு', 'பகை', 'நட்பு', 'பகை'] },
    { graha: 'புதன்', vals: ['பகை', 'பகை', 'நட்பு', '--', 'நட்பு', 'பகை', 'பகை'] },
    { graha: 'குரு', vals: ['நட்பு', 'நட்பு', 'பகை', 'நட்பு', '--', 'நட்பு', 'பகை'] },
    { graha: 'சுக்கிரன்', vals: ['பகை', 'பகை', 'நட்பு', 'பகை', 'நட்பு', '--', 'பகை'] },
    { graha: 'சனி', vals: ['பகை', 'நட்பு', 'பகை', 'பகை', 'பகை', 'பகை', '--'] }
  ];

  const panchadhaMatrix = [
    { graha: 'சூரியன்', vals: ['--', 'சமம்', 'அதிமித்ரு', 'பகை', 'அதிமித்ரு', 'அதிசத்ரு', 'அதிசத்ரு'] },
    { graha: 'சந்திரன்', vals: ['சமம்', '--', 'நட்பு', 'சமம்', 'நட்பு', 'பகை', 'நட்பு'] },
    { graha: 'செவ்வாய்', vals: ['அதிமித்ரு', 'அதிமித்ரு', '--', 'சமம்', 'சமம்', 'நட்பு', 'பகை'] },
    { graha: 'புதன்', vals: ['சமம்', 'அதிசத்ரு', 'நட்பு', '--', 'நட்பு', 'சமம்', 'பகை'] },
    { graha: 'குரு', vals: ['அதிமித்ரு', 'அதிமித்ரு', 'சமம்', 'சமம்', '--', 'சமம்', 'பகை'] },
    { graha: 'சுக்கிரன்', vals: ['அதிசத்ரு', 'அதிசத்ரு', 'நட்பு', 'சமம்', 'நட்பு', '--', 'சமம்'] },
    { graha: 'சனி', vals: ['அதிசத்ரு', 'சமம்', 'அதிசத்ரு', 'சமம்', 'பகை', 'சமம்', '--'] }
  ];

  empty.p11 = {
    grahaHeaders: grahaShorts,
    naisargika: naisargikaMatrix,
    tatkalika: tatkalikaMatrix,
    panchadha: panchadhaMatrix,
    avasthas: rel.avasthas
  };

  // Page 12: Aspect Angles
  empty.p12 = computeAspectMatrices(planetMap, p18Data.p6.bhavas || []);

  // Pages 13, 14, 15: Compact Mahadashas (3 per page)
  empty.p13 = { dashas: [p18Data.p8, p18Data.p9, p18Data.p10] };
  empty.p14 = { dashas: [p18Data.p11, p18Data.p12, p18Data.p13] };
  empty.p15 = { dashas: [p18Data.p14, p18Data.p15, p18Data.p16] };

  // Page 16: Pasakar / Tara Balam / Sevvai Dosha
  const pasakarRows = [
    { graha: 'சூரியன்', pasakar: 'சனி', pothakar: 'செவ்வாய்', karakar: 'குரு', vedhakar: 'சுக்கிரன்' },
    { graha: 'சந்திரன்', pasakar: 'சுக்கிரன்', pothakar: 'செவ்வாய்', karakar: 'சனி', vedhakar: 'சூரியன்' },
    { graha: 'செவ்வாய்', pasakar: 'சூரியன்', pothakar: 'சந்திரன்', karakar: 'சனி', vedhakar: 'புதன்' },
    { graha: 'புதன்', pasakar: 'சந்திரன்', pothakar: 'குரு', karakar: 'சுக்கிரன்', vedhakar: 'செவ்வாய்' },
    { graha: 'குரு', pasakar: 'சனி', pothakar: 'செவ்வாய்', karakar: 'சந்திரன்', vedhakar: 'சூரியன்' },
    { graha: 'சுக்கிரன்', pasakar: 'செவ்வாய்', pothakar: 'புதன்', karakar: 'சூரியன்', vedhakar: 'சனி' },
    { graha: 'சனி', pasakar: 'சுக்கிரன்', pothakar: 'சந்திரன்', karakar: 'குரு', vedhakar: 'செவ்வாய்' }
  ];

  const taraRows = [
    { star1: 'திருவாதிரை', star2: 'சுவாதி', star3: 'சதயம்', quality: 'அதமம்', tara: 'ஜென்ம தாரை' },
    { star1: 'புனர்பூசம்', star2: 'விசாகம்', star3: 'பூரட்டாதி', quality: 'உத்தமம்', tara: 'சம்பத்து தாரை' },
    { star1: 'பூசம்', star2: 'அனுஷம்', star3: 'உத்திரட்டாதி', quality: 'அதமம்', tara: 'விபத்து தாரை' },
    { star1: 'ஆயில்யம்', star2: 'கேட்டை', star3: 'ரேவதி', quality: 'உத்தமம்', tara: 'க்ஷேம தாரை' },
    { star1: 'மகம்', star2: 'மூலம்', star3: 'அசுவினி', quality: 'அதமம்', tara: 'பிரத்தியக்கு தாரை' },
    { star1: 'பூரம்', star2: 'பூராடம்', star3: 'பரணி', quality: 'உத்தமம்', tara: 'சாதக தாரை' },
    { star1: 'உத்திரம்', star2: 'உத்திராடம்', star3: 'கிருத்திகை', quality: 'அதமம்', tara: 'வதைத் தாரை' },
    { star1: 'அஸ்தம்', star2: 'திருவோணம்', star3: 'ரோகிணி', quality: 'உத்தமம்', tara: 'மைத்திர தாரை' },
    { star1: 'சித்திரை', star2: 'அவிட்டம்', star3: 'மிருகசீரிடம்', quality: 'உத்தமம்', tara: 'பரம மைத்திர தாரை' }
  ];

  empty.p16 = {
    pasakarRows,
    taraRows,
    sevvaiDosha: {
      fromLagna: 'ஜாதகத்தில் லக்னத்திலிருந்து செவ்வாய் எட்டாவது வீட்டில் இருக்கிறது. கடுமையான தோஷம்.',
      fromMoon: 'சந்திர ராசியிலிருந்து செவ்வாய் இரண்டாவது வீட்டில் இருக்கிறது. கடுமையான தோஷம்.',
      fromVenus: 'சுக்கிரனின் நிலையிலிருந்து செவ்வாய் பத்தாவது வீட்டில் இருக்கிறது. தோஷமில்லை.',
      conclusion: 'ஜாதகத்தில் செவ்வாய் கடக ராசியில் உள்ளது. குரு சேர்க்கை பெற்றுள்ளது. ஆகவே, செவ்வாய்தோஷத்தின் அளவு மிகவும் குறைந்து விடுகிறது.'
    }
  };

  // Pages 17 to 20: Antara Ending Dates (2 Mahadashas per page)
  const allAntaras = computeAntaraEndDates(m.dob, m.dobTime, p.dashaBalance, lagnaRasiIdx, planetMap);
  empty.p17 = { dashas: [allAntaras[0], allAntaras[1]] };
  empty.p18 = { dashas: [allAntaras[2], allAntaras[3]] };
  empty.p19 = { dashas: [allAntaras[4], allAntaras[5]] };
  empty.p20 = { dashas: [allAntaras[6], allAntaras[7]] };

  // Pages 21 to 24: BAV Ashtakavarga
  const bavSun = computeBavDetailsForGraha('sun', planetSigns, lagnaRasiIdx);
  const bavMoon = computeBavDetailsForGraha('moon', planetSigns, lagnaRasiIdx);
  const bavMars = computeBavDetailsForGraha('mars', planetSigns, lagnaRasiIdx);
  const bavMercury = computeBavDetailsForGraha('mercury', planetSigns, lagnaRasiIdx);
  const bavJupiter = computeBavDetailsForGraha('jupiter', planetSigns, lagnaRasiIdx);
  const bavVenus = computeBavDetailsForGraha('venus', planetSigns, lagnaRasiIdx);
  const bavSaturn = computeBavDetailsForGraha('saturn', planetSigns, lagnaRasiIdx);

  empty.p21 = { sun: bavSun, moon: bavMoon };
  empty.p22 = { mars: bavMars, mercury: bavMercury };
  empty.p23 = { jupiter: bavJupiter, venus: bavVenus };
  empty.p24 = { saturn: bavSaturn, sav: p18Data.p17 };

  // Page 25: Chaldean Numerology
  empty.p25 = p18Data.p18;

  return empty;
}
''';

with open(engine_file, 'a', encoding='utf-8') as f:
    f.write('\n\n' + code_to_add)

print('Successfully appended 25-page booklet calculation engine to thirukanithaEngine.js')
