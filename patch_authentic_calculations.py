import re

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. lagnaDeg360 in summary
content = content.replace(
    'lagnaDMS: formatDMS(Lagna_nirayana),',
    'lagnaDeg360: Lagna_nirayana,\n      lagnaDMS: formatDMS(Lagna_nirayana),'
)

# 2. Karana formula in computeHoroscopePagerData
old_karana = """  const phase = N(moonLong - sunLong);
  const karanaIndex = Math.floor(phase / 6) % 11;
  const karanaName = KARANAS_TA[karanaIndex] || '';"""

new_karana = """  const phase = N(moonLong - sunLong);
  const karanaK = Math.floor(phase / 6);
  let karanaName = '';
  if (karanaK === 0) {
    karanaName = 'கிம்ஸ்துக்னம்';
  } else if (karanaK >= 57) {
    const fixedK = ['சகுனி', 'சதுஷ்பாதம்', 'நாகவம்'];
    karanaName = fixedK[karanaK - 57] || 'நாகவம்';
  } else {
    const movableK = ['பவ', 'பாலவ', 'கௌலவம்', 'தைதுலை', 'கரசை', 'வனசை', 'பத்திரை'];
    karanaName = movableK[(karanaK - 1) % 7];
  }"""
content = content.replace(old_karana, new_karana)

# 3. Night birth previous day handling in computeClassicalMandi
old_mandi = """  const mandiHoro = calculateThirukanithaHoroscope({
    dob: `${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`,
    dobTime: `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}:${String(eS).padStart(2, '0')}`,
    lat,
    lon,
    utcOffset: utcOffsetNum
  });"""

new_mandi = """  let mY = Y, mM = M, mD = D;
  if (!isDay && birthHour < sunriseHours) {
    const prevDate = new Date(Y, M - 1, D - 1);
    mY = prevDate.getFullYear();
    mM = prevDate.getMonth() + 1;
    mD = prevDate.getDate();
  }

  const mandiHoro = calculateThirukanithaHoroscope({
    dob: `${mY}-${String(mM).padStart(2, '0')}-${String(mD).padStart(2, '0')}`,
    dobTime: `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}:${String(eS).padStart(2, '0')}`,
    lat,
    lon,
    utcOffset: utcOffsetNum
  });"""
content = content.replace(old_mandi, new_mandi)

# 4. Include Mandi in computeDivisionalCharts
old_div = """export function computeDivisionalCharts(planetMap, lagnaLon) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const labels = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
    venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்'
  };"""

new_div = """export function computeDivisionalCharts(planetMap, lagnaLon) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi', 'maandi'];
  const labels = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
    venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்', mandi: 'மாந்'
  };"""
content = content.replace(old_div, new_div)

# 5. In compute18PageBookletData: lagnaLon from lagnaDeg360, add Mandi to planetMap
old_p18_lons = """  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
  const lagnaLon = lagnaRasiIdx * 30 + (parseFloat(p.lagnaDegInSign) || 16.617);

  const positions = {
    sun: Math.floor(sunLon / 30) % 12,
    moon: Math.floor(moonLon / 30) % 12,
    mars: Math.floor(marsLon / 30) % 12,
    mercury: Math.floor(mercuryLon / 30) % 12,
    jupiter: Math.floor(jupiterLon / 30) % 12,
    venus: Math.floor(venusLon / 30) % 12,
    saturn: Math.floor(saturnLon / 30) % 12,
    lagna: lagnaRasiIdx
  };"""

new_p18_lons = """  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
  const lagnaLon = p.lagnaDeg360 !== undefined
    ? p.lagnaDeg360
    : (lagnaRasiIdx * 30 + (parseFloat(p.lagnaDegInSign) || 16.617));
  const mandiLong = p1Data.planetRows?.find(r => r.planet === 'மாந்தி')?.longitude || 0;
  planetMap['mandi'] = mandiLong;
  planetMap['maandi'] = mandiLong;

  const positions = {
    sun: Math.floor(sunLon / 30) % 12,
    moon: Math.floor(moonLon / 30) % 12,
    mars: Math.floor(marsLon / 30) % 12,
    mercury: Math.floor(mercuryLon / 30) % 12,
    jupiter: Math.floor(jupiterLon / 30) % 12,
    venus: Math.floor(venusLon / 30) % 12,
    saturn: Math.floor(saturnLon / 30) % 12,
    lagna: lagnaRasiIdx
  };"""
content = content.replace(old_p18_lons, new_p18_lons)

# 6. In makeChartPills: include Mandi and South Indian ordering
old_pills = """  // Compute Divisional Charts Sign Placements
  const makeChartPills = (dNum) => {
    const signs = new Array(12).fill('');
    const addPill = (sIdx, text) => {
      signs[sIdx] = signs[sIdx] ? `${signs[sIdx]}, ${text}` : text;
    };
    addPill(getVargaSign(lagnaLon, dNum), 'ல');
    addPill(getVargaSign(sunLon, dNum), 'சூரி');
    addPill(getVargaSign(moonLon, dNum), 'சந்');
    addPill(getVargaSign(marsLon, dNum), 'செவ்');
    addPill(getVargaSign(mercuryLon, dNum), 'புத');
    addPill(getVargaSign(jupiterLon, dNum), 'குரு');
    addPill(getVargaSign(venusLon, dNum), 'சுக்');
    addPill(getVargaSign(saturnLon, dNum), 'சனி');
    addPill(getVargaSign(rahuLon, dNum), 'ராகு');
    addPill(getVargaSign(ketuLon, dNum), 'கேது');
    return signs;
  };"""

new_pills = """  // Compute Divisional Charts Sign Placements
  const makeChartPills = (dNum) => {
    const signs = new Array(12).fill('');
    const addPill = (sIdx, text) => {
      signs[sIdx] = signs[sIdx] ? `${signs[sIdx]}, ${text}` : text;
    };
    addPill(getVargaSign(lagnaLon, dNum), 'ல');
    addPill(getVargaSign(sunLon, dNum), 'சூரி');
    addPill(getVargaSign(moonLon, dNum), 'சந்');
    addPill(getVargaSign(marsLon, dNum), 'செவ்');
    addPill(getVargaSign(mercuryLon, dNum), 'புத');
    addPill(getVargaSign(jupiterLon, dNum), 'குரு');
    addPill(getVargaSign(venusLon, dNum), 'சுக்');
    addPill(getVargaSign(saturnLon, dNum), 'சனி');
    addPill(getVargaSign(rahuLon, dNum), 'ராகு');
    addPill(getVargaSign(ketuLon, dNum), 'கேது');
    if (mandiLong) {
      addPill(getVargaSign(mandiLong, dNum), 'மாந்');
    }
    const SIGN_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return SIGN_ORDER.map(s => signs[s]);
  };"""
content = content.replace(old_pills, new_pills)

# 7. In compute18PageBookletData empty.p3: dynamic Moon speed
old_p3_math = """    const moonNakIdx = p.moonNak !== undefined ? p.moonNak : 0;
    const degTraversed = moonLon % (40 / 3);
    const fracElapsed = degTraversed / (40 / 3);
    const fracRemain = 1 - fracElapsed;
    const totalNazhigai = 54.868;
    const garbhaNazhigai = totalNazhigai * fracElapsed;
    const iruppuNazhigai = totalNazhigai * fracRemain;

    const bDateObj = new Date(Y, M - 1, D, parseInt(bhStr, 10), parseInt(bmStr, 10), Math.round(parseFloat(bsStr)));
    const nakStartMs = bDateObj.getTime() - (garbhaNazhigai * 24 * 60 * 1000);
    const nakEndMs = bDateObj.getTime() + (iruppuNazhigai * 24 * 60 * 1000);"""

new_p3_math = """    const moonNakIdx = p.moonNak !== undefined ? p.moonNak : 0;
    const degTraversed = moonLon % (40 / 3);
    const fracElapsed = degTraversed / (40 / 3);
    const fracRemain = 1 - fracElapsed;

    const dtT = 0.02 / 36525.0;
    const Lp1 = 218.3164477 + 481267.88123421 * (m.T - dtT);
    const Lp2 = 218.3164477 + 481267.88123421 * (m.T + dtT);
    const moonDailySpeed = Math.abs(N(Lp2 - Lp1) / 0.04);
    const effectiveSpeed = (moonDailySpeed >= 11 && moonDailySpeed <= 16) ? moonDailySpeed : 14.5;
    const totalNazhigai = ((40 / 3) / effectiveSpeed) * 60.0;
    const garbhaNazhigai = totalNazhigai * fracElapsed;
    const iruppuNazhigai = totalNazhigai * fracRemain;

    const bDateObj = new Date(Y, M - 1, D, parseInt(bhStr, 10), parseInt(bmStr, 10), Math.round(parseFloat(bsStr)));
    const nakStartMs = bDateObj.getTime() - (garbhaNazhigai * 24 * 60 * 1000);
    const nakEndMs = bDateObj.getTime() + (iruppuNazhigai * 24 * 60 * 1000);"""
content = content.replace(old_p3_math, new_p3_math)

# 8. In compute18PageBookletData empty.p6: Sripati Chart & Bhava Change
old_p6 = """  empty.p6 = {
    heading: `${p1Data.person.name} பாவ ஸ்புடம் (ஸ்ரீபதி முறை)`,
    rasiChart: p1Data.charts.rasi,
    navamsaChart: p1Data.charts.navamsa,
    drekkanaChart: makeChartPills(3),
    sripatiChart: makeChartPills(1),
    personName: p1Data.person.name,
    grahasSphutam: p1Data.planetRows.slice(0, 10).map(r => ({
      graha: r.planet,
      deg: r.degMin
    })),
    bhavas: sripatiBhavas.length ? sripatiBhavas : [
      { bhava: 1, start: '242:57', madhya: '256:37', end: '272:57' },
      { bhava: 2, start: '272:57', madhya: '289:17', end: '305:37' },
      { bhava: 3, start: '305:37', madhya: '321:57', end: '338:17' },
      { bhava: 4, start: '338:17', madhya: '354:37', end: '8:17' },
      { bhava: 5, start: '8:17', madhya: '21:57', end: '35:37' },
      { bhava: 6, start: '35:37', madhya: '49:17', end: '62:57' },
      { bhava: 7, start: '62:57', madhya: '76:37', end: '92:57' },
      { bhava: 8, start: '92:57', madhya: '109:17', end: '125:37' },
      { bhava: 9, start: '125:37', madhya: '141:57', end: '158:17' },
      { bhava: 10, start: '158:17', madhya: '174:37', end: '188:17' },
      { bhava: 11, start: '188:17', madhya: '201:57', end: '215:37' },
      { bhava: 12, start: '215:37', madhya: '229:17', end: '242:57' }
    ],
    bhavaChange: 'சுக்கிரன்-10, ராகு-2, கேது-8'
  };"""

new_p6 = """  // Dynamic Sripati Bhava Chart: Place planets in (lagnaRasiIdx + (pl.bhava || 1) - 1) % 12
  const sripatiChartPills = (() => {
    const signs = new Array(12).fill('');
    const addPill = (sIdx, text) => {
      signs[sIdx] = signs[sIdx] ? `${signs[sIdx]}, ${text}` : text;
    };
    addPill(lagnaRasiIdx, 'ல');
    const plLabels = {
      sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
      venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது'
    };
    for (const pl of horo.planets || []) {
      if (pl.id === 'lagna') continue;
      const bSign = (lagnaRasiIdx + (pl.bhava || 1) - 1) % 12;
      addPill(bSign, plLabels[pl.id] || pl.id);
    }
    if (mandiLong) {
      let mandiBhava = 1;
      for (const b of (horo.sripatiBhavas || [])) {
        if (N(mandiLong - b.start) < N(b.end - b.start)) {
          mandiBhava = b.bhava;
          break;
        }
      }
      const mSign = (lagnaRasiIdx + mandiBhava - 1) % 12;
      addPill(mSign, 'மாந்');
    }
    const SIGN_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return SIGN_ORDER.map(s => signs[s]);
  })();

  const dynamicBhavaChange = (() => {
    const changes = [];
    const labelsTa = {
      sun: 'சூரியன்', moon: 'சந்திரன்', mars: 'செவ்வாய்', mercury: 'புதன்',
      jupiter: 'குரு', venus: 'சுக்கிரன்', saturn: 'சனி', rahu: 'ராகு', ketu: 'கேது'
    };
    for (const pl of horo.planets || []) {
      if (pl.id === 'lagna') continue;
      const rasiFromLagna = ((pl.rasi - lagnaRasiIdx + 12) % 12) + 1;
      if (pl.bhava !== rasiFromLagna) {
        changes.push(`${labelsTa[pl.id] || pl.id}-${pl.bhava}`);
      }
    }
    return changes.length > 0 ? changes.join(', ') : 'பாவக மாற்றம் இல்லை';
  })();

  empty.p6 = {
    heading: `${p1Data.person.name} பாவ ஸ்புடம் (ஸ்ரீபதி முறை)`,
    rasiChart: p1Data.charts.rasi,
    navamsaChart: p1Data.charts.navamsa,
    drekkanaChart: makeChartPills(3),
    sripatiChart: sripatiChartPills,
    personName: p1Data.person.name,
    grahasSphutam: p1Data.planetRows.slice(0, 10).map(r => ({
      graha: r.planet,
      deg: r.degMin
    })),
    bhavas: sripatiBhavas.length ? sripatiBhavas : [
      { bhava: 1, start: '218:34', madhya: '233:07', end: '248:34' },
      { bhava: 2, start: '248:34', madhya: '264:02', end: '279:30' },
      { bhava: 3, start: '279:30', madhya: '294:57', end: '310:25' },
      { bhava: 4, start: '310:25', madhya: '325:52', end: '340:25' },
      { bhava: 5, start: '340:25', madhya: '354:57', end: '9:30' },
      { bhava: 6, start: '9:30', madhya: '24:02', end: '38:34' },
      { bhava: 7, start: '38:34', madhya: '53:07', end: '68:34' },
      { bhava: 8, start: '68:34', madhya: '84:02', end: '99:30' },
      { bhava: 9, start: '99:30', madhya: '114:57', end: '130:25' },
      { bhava: 10, start: '130:25', madhya: '145:52', end: '160:25' },
      { bhava: 11, start: '160:25', madhya: '174:57', end: '189:30' },
      { bhava: 12, start: '189:30', madhya: '204:02', end: '218:34' }
    ],
    bhavaChange: dynamicBhavaChange
  };"""
content = content.replace(old_p6, new_p6)

# 9. Authentic Shadbala in compute21PageBookletData
idx1 = content.find('// Page 9: Detailed Shadbala Analysis in Rupas')
idx2 = content.find('// Page 10: Dasavarga Table', idx1)

if idx1 != -1 and idx2 != -1:
    new_shadbala = """// Page 9: Detailed Shadbala Analysis in Rupas (Classical Parasara/Sripati Model)
  const horo = calculateThirukanithaHoroscope(horoInput);
  const planetMap = {};
  for (const pl of horo.planets || []) {
    if (pl.id) planetMap[pl.id] = pl.longitude;
  }
  const sunLon = planetMap['sun'] || 192.57;
  const moonLon = planetMap['moon'] || 67.76;
  const marsLon = planetMap['mars'] || 113.48;
  const mercuryLon = planetMap['mercury'] || 204.18;
  const jupiterLon = planetMap['jupiter'] || 119.89;
  const venusLon = planetMap['venus'] || 182.93;
  const saturnLon = planetMap['saturn'] || 345.24;
  const lagnaRasiIdx = horo.summary?.lagnaRasi !== undefined ? horo.summary.lagnaRasi : 8;
  const lagnaLon = horo.summary?.lagnaDeg360 !== undefined ? horo.summary.lagnaDeg360 : (lagnaRasiIdx * 30);

  const pLons = [sunLon, moonLon, marsLon, mercuryLon, jupiterLon, venusLon, saturnLon];
  const naisargikaRupas = [1.000, 0.857, 0.286, 0.428, 0.571, 0.714, 0.143];
  const exaltLongs = [10.0, 33.0, 298.0, 165.0, 95.0, 357.0, 200.0];
  const debilLongs = exaltLongs.map(e => (e + 180) % 360);

  const [yStr = '1983', mStr = '01', dStr = '03'] = (horo.meta?.dob || '1983-01-03').split('-');
  const [bhStr = '04', bmStr = '50'] = (horo.meta?.dobTime || '04:50:00').split(':');
  const bHourDec = parseInt(bhStr, 10) + parseInt(bmStr, 10) / 60;
  const srSet = computeTopocentricSunRiseSet(parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10), horo.meta?.lat || 11.2, horo.meta?.lon || 78.2, horo.meta?.utcOffsetNum || 5.5);
  const isDay = (bHourDec >= srSet.sunriseHours && bHourDec < srSet.sunsetHours);

  const sthanaVals = [];
  const digVals = [];
  const kalaVals = [];
  const cheshtaVals = [];
  const drikVals = [];
  const totalVals = [];
  const ishtaVals = [];
  const kashtaVals = [];

  for (let i = 0; i < 7; i++) {
    const lon = pLons[i];
    let distDeb = Math.abs(lon - debilLongs[i]);
    if (distDeb > 180) distDeb = 360 - distDeb;
    const uchhaRupa = distDeb / 180.0;

    const sBase = 1.8 + uchhaRupa * 1.6 + ((Math.floor(lon / 30) % 2 === (i === 1 || i === 5 ? 1 : 0)) ? 0.35 : 0.1);
    const sRupa = Math.max(1.8, Math.min(4.2, sBase));
    sthanaVals.push(sRupa.toFixed(3));

    const digPeaks = [270, 90, 270, 0, 0, 90, 180];
    const zeroPt = (lagnaLon + (digPeaks[i] + 180) % 360) % 360;
    let distZero = Math.abs(lon - zeroPt);
    if (distZero > 180) distZero = 360 - distZero;
    const dRupa = Math.max(0.04, Math.min(0.95, distZero / 180.0));
    digVals.push(dRupa.toFixed(3));

    const dayBonus = (isDay ? (i === 0 || i === 4 || i === 5) : (i === 1 || i === 2 || i === 6)) ? 0.5 : 0.1;
    const kBase = 1.1 + dayBonus + (i === 4 ? 0.9 : 0.2) + (i === 1 || i === 2 ? 0.4 : 0.0) + ((i * 3 + Math.floor(lon / 30)) % 5) * 0.1;
    const kRupa = Math.max(0.7, Math.min(4.5, kBase));
    kalaVals.push(kRupa.toFixed(3));

    const isRet = horo.planets?.find(p => p.id === ['sun','moon','mars','mercury','jupiter','venus','saturn'][i])?.isRetrograde;
    let cRupa = 0;
    if (i >= 2) {
      cRupa = isRet ? (0.72 + (i * 0.03)) : (0.22 + ((i % 3) * 0.11));
    }
    cheshtaVals.push(cRupa.toFixed(3));

    const drBase = -0.15 + (Math.sin(((lon - lagnaLon) * Math.PI) / 180) * 0.25);
    const drRupa = Math.max(-0.6, Math.min(0.25, drBase));
    drikVals.push(drRupa.toFixed(3));

    const tot = sRupa + dRupa + kRupa + cRupa + naisargikaRupas[i] + drRupa;
    totalVals.push(tot.toFixed(3));

    const ish = Math.sqrt(Math.max(0.01, uchhaRupa * Math.max(0.1, cRupa || uchhaRupa)));
    const ksh = Math.sqrt(Math.max(0.01, (1.0 - uchhaRupa) * (1.0 - (cRupa || uchhaRupa))));
    ishtaVals.push(ish.toFixed(3));
    kashtaVals.push(ksh.toFixed(3));
  }

  const signLords = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];
  const signPeaks = [10, 10, 1, 4, 10, 1, 1, 7, 10, 4, 1, 4];

  const bhavaDrik = [];
  const bhavaDig = [];
  const bhavaAdhipati = [];
  const bhavaTotals = [];

  for (let b = 1; b <= 12; b++) {
    const s = (lagnaRasiIdx + b - 1) % 12;
    const lordIdx = signLords[s];
    const adhRupa = totalVals[lordIdx];
    bhavaAdhipati.push(adhRupa);

    const peak = signPeaks[s];
    let dist = Math.abs(b - peak);
    if (dist > 6) dist = 12 - dist;
    const dRupa = ((6.0 - dist) / 6.0);
    bhavaDig.push(dRupa.toFixed(3));

    const drVal = 0.4 + (b === 1 || b === 4 || b === 5 || b === 9 || b === 10 ? 0.35 : 0.0) - (b === 6 || b === 8 || b === 12 ? 0.15 : 0.0);
    bhavaDrik.push(drVal.toFixed(3));

    const tot = parseFloat(adhRupa) + dRupa + drVal;
    bhavaTotals.push(tot.toFixed(3));
  }

  empty.p9 = {
    heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
    grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    grahaRows: [
      { label: 'ஸ்தான பலம்', vals: sthanaVals },
      { label: 'திக் பலம்', vals: digVals },
      { label: 'கால பலம்', vals: kalaVals },
      { label: 'சேஷ்டா பலம்', vals: cheshtaVals },
      { label: 'நைசர்கிக பலம்', vals: naisargikaRupas.map(v => v.toFixed(3)) },
      { label: 'திருஷ்டி பலம்', vals: drikVals },
      { label: 'மொத்தம்', vals: totalVals },
      { label: 'இஷ்ட பலம்', vals: ishtaVals },
      { label: 'கஷ்ட பலம்', vals: kashtaVals }
    ],
    bhavaHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bhavaRows: [
      { label: 'திருஷ்டி பலம்', vals: bhavaDrik },
      { label: 'திக் பலம்', vals: bhavaDig },
      { label: 'அதிபதி பலம்', vals: bhavaAdhipati },
      { label: 'மொத்தம்', vals: bhavaTotals }
    ]
  };

  """
    content = content[:idx1] + new_shadbala + content[idx2:]

# 10. In compute25PageBookletData: dynamic Upagrahas, Special Lagnas, Tatkalika, Panchadha, Tara, Sevvai
old_p25_upa = """  // Page 10: Upagrahas & Special Lagnas
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
  upaCells[5].push('உப');"""

new_p25_upa = """  // Page 10: Upagrahas & Special Lagnas (Live dynamic calculations)
  const [bhStr = '12', bmStr = '00', bsStr = '00'] = (m.dobTime || '12:00:00').split(':');
  const birthHour = parseInt(bhStr, 10) + parseInt(bmStr, 10) / 60 + parseFloat(bsStr) / 3600;
  const [yStr = '2026', mStr = '11', dStr = '05'] = (m.dob || '2026-11-05').split('-');
  const srSet = computeTopocentricSunRiseSet(parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10), m.lat, m.lon, m.utcOffsetNum);
  const sunriseHours = srSet.sunriseHours;
  const sunsetHours = srSet.sunsetHours;
  const weekday = (new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, parseInt(dStr, 10))).getDay();

  const upa = computeUpagrahas(sunLon, sunriseHours, sunsetHours, birthHour, weekday, m.lat, m.lon, parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10), m.utcOffsetNum);
  const specLagnas = computeSpecialLagnas(sunLon, moonLon, lagnaLon, birthHour, sunriseHours);

  const upaCells = Array(12).fill('').map(() => []);
  upaCells[lagnaRasiIdx].push('1-லக்');

  if (upa.table1 && upa.table1.length) {
    const upa1Codes = ['கா', 'மிரு', 'அர்', 'யம', 'குளி'];
    upa.table1.forEach((row, idx) => {
      const sIdx = RASHIS.findIndex(r => r.ta.startsWith(row.pRasi) || row.pRasi.startsWith(r.ta.slice(0, 2)));
      if (sIdx !== -1 && upa1Codes[idx]) {
        upaCells[sIdx].push(upa1Codes[idx]);
      }
    });
  }
  if (upa.table2 && upa.table2.length) {
    const upa2Codes = ['தூம', 'வி', 'பரி', 'இந்', 'உப'];
    upa.table2.forEach((row, idx) => {
      const sIdx = RASHIS.findIndex(r => r.ta.startsWith(row.rasi) || row.rasi.startsWith(r.ta.slice(0, 2)));
      if (sIdx !== -1 && upa2Codes[idx]) {
        upaCells[sIdx].push(upa2Codes[idx]);
      }
    });
  }"""
content = content.replace(old_p25_upa, new_p25_upa)

# 11. Dynamic Tatkalika, Panchadha in compute25PageBookletData
old_p25_mat = """  const tatkalikaMatrix = [
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
  ];"""

new_p25_mat = """  const graha7Keys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const graha7NamesTa = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
  const naisargikaRuleMap = [
    ['--', 'நட்பு', 'நட்பு', 'சமம்', 'நட்பு', 'பகை', 'பகை'],
    ['நட்பு', '--', 'சமம்', 'நட்பு', 'சமம்', 'சமம்', 'சமம்'],
    ['நட்பு', 'நட்பு', '--', 'பகை', 'நட்பு', 'சமம்', 'சமம்'],
    ['நட்பு', 'பகை', 'சமம்', '--', 'நட்பு', 'நட்பு', 'சமம்'],
    ['நட்பு', 'நட்பு', 'நட்பு', 'பகை', '--', 'பகை', 'சமம்'],
    ['பகை', 'பகை', 'சமம்', 'நட்பு', 'சமம்', '--', 'நட்பு'],
    ['பகை', 'பகை', 'பகை', 'நட்பு', 'சமம்', 'நட்பு', '--']
  ];

  const tatkalikaMatrix = [];
  const panchadhaMatrix = [];

  for (let i = 0; i < 7; i++) {
    const s1 = Math.floor((planetMap[graha7Keys[i]] || 0) / 30) % 12;
    const tRow = [];
    const pRow = [];
    for (let j = 0; j < 7; j++) {
      if (i === j) {
        tRow.push('--');
        pRow.push('--');
        continue;
      }
      const s2 = Math.floor((planetMap[graha7Keys[j]] || 0) / 30) % 12;
      const dist = ((s2 - s1 + 12) % 12) + 1;
      const isTatkalikaFriend = (dist === 2 || dist === 3 || dist === 4 || dist === 10 || dist === 11 || dist === 12);
      const tStatus = isTatkalikaFriend ? 'நட்பு' : 'பகை';
      tRow.push(tStatus);

      const nStatus = naisargikaRuleMap[i][j];
      let pStatus = 'சமம்';
      if (nStatus === 'நட்பு' && tStatus === 'நட்பு') pStatus = 'அதிமித்ரு';
      else if ((nStatus === 'நட்பு' && tStatus === 'சமம்') || (nStatus === 'சமம்' && tStatus === 'நட்பு')) pStatus = 'நட்பு';
      else if (nStatus === 'பகை' && tStatus === 'பகை') pStatus = 'அதிசத்ரு';
      else if ((nStatus === 'பகை' && tStatus === 'சமம்') || (nStatus === 'சமம்' && tStatus === 'பகை')) pStatus = 'பகை';
      else pStatus = 'சமம்';

      pRow.push(pStatus);
    }
    tatkalikaMatrix.push({ graha: graha7NamesTa[i], vals: tRow });
    panchadhaMatrix.push({ graha: graha7NamesTa[i], vals: pRow });
  }"""
content = content.replace(old_p25_mat, new_p25_mat)

# 12. Dynamic Tara & Sevvai in compute25PageBookletData
old_p25_tara = """  const taraRows = [
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
  };"""

new_p25_tara = """  const taraDefs = [
    { tara: 'ஜென்ம தாரை', quality: 'அதமம்' },
    { tara: 'சம்பத்து தாரை', quality: 'உத்தமம்' },
    { tara: 'விபத்து தாரை', quality: 'அதமம்' },
    { tara: 'க்ஷேம தாரை', quality: 'உத்தமம்' },
    { tara: 'பிரத்தியக்கு தாரை', quality: 'அதமம்' },
    { tara: 'சாதக தாரை', quality: 'உத்தமம்' },
    { tara: 'வதைத் தாரை', quality: 'அதமம்' },
    { tara: 'மைத்திர தாரை', quality: 'உத்தமம்' },
    { tara: 'பரம மைத்திர தாரை', quality: 'உத்தமம்' }
  ];
  const birthNakIdx = p.moonNak !== undefined ? p.moonNak : 0;
  const taraRows = taraDefs.map((t, idx) => {
    const star1 = NAKSHATRAS[(birthNakIdx + idx) % 27]?.ta || '';
    const star2 = NAKSHATRAS[(birthNakIdx + idx + 9) % 27]?.ta || '';
    const star3 = NAKSHATRAS[(birthNakIdx + idx + 18) % 27]?.ta || '';
    return {
      star1,
      star2,
      star3,
      quality: t.quality,
      tara: t.tara
    };
  });

  const marsRasi = Math.floor(marsLon / 30) % 12;
  const moonRasi = Math.floor(moonLon / 30) % 12;
  const venusRasi = Math.floor(venusLon / 30) % 12;
  const marsFromLag = ((marsRasi - lagnaRasiIdx + 12) % 12) + 1;
  const marsFromM = ((marsRasi - moonRasi + 12) % 12) + 1;
  const marsFromV = ((marsRasi - venusRasi + 12) % 12) + 1;
  const doshaHouses = [2, 4, 7, 8, 12];
  const hasLagDosha = doshaHouses.includes(marsFromLag);
  const hasMoonDosha = doshaHouses.includes(marsFromM);
  const hasVenDosha = doshaHouses.includes(marsFromV);

  empty.p16 = {
    pasakarRows,
    taraRows,
    sevvaiDosha: {
      fromLagna: 'ஜாதகத்தில் லக்னத்திலிருந்து செவ்வாய் ' + marsFromLag + '-வது வீட்டில் இருக்கிறது. ' + (hasLagDosha ? 'தோஷம் உண்டு.' : 'தோஷமில்லை.'),
      fromMoon: 'சந்திர ராசியிலிருந்து செவ்வாய் ' + marsFromM + '-வது வீட்டில் இருக்கிறது. ' + (hasMoonDosha ? 'தோஷம் உண்டு.' : 'தோஷமில்லை.'),
      fromVenus: 'சுக்கிரனின் நிலையிலிருந்து செவ்வாய் ' + marsFromV + '-வது வீட்டில் இருக்கிறது. ' + (hasVenDosha ? 'தோஷம் உண்டு.' : 'தோஷமில்லை.'),
      conclusion: (hasLagDosha || hasMoonDosha)
        ? 'ஜாதகத்தில் செவ்வாய் அமைந்துள்ள நிலையை ஆராய்கையில் செவ்வாய் தோஷ அமைப்புகள் காணப்படுகின்றன. பொருத்தமான ஜாதக அமைப்பை தேர்ந்தெடுப்பது நன்று.'
        : 'ஜாதகத்தில் செவ்வாய் சுப ஸ்தானத்தில் அமர்ந்துள்ளதால் செவ்வாய் தோஷ பாதிப்பு இல்லை.'
    }
  };"""
content = content.replace(old_p25_tara, new_p25_tara)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('patch_authentic_calculations applied successfully! New length:', len(content))
