import os

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update computeDivisionalCharts to include Mandi
old_div_charts = """export function computeDivisionalCharts(planetMap, lagnaLon) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];
  const labels = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
    venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்'
  };"""

new_div_charts = """export function computeDivisionalCharts(planetMap, lagnaLon) {
  const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi', 'maandi'];
  const labels = {
    sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத(வ)', jupiter: 'குரு',
    venus: 'சுக்(வ)', saturn: 'சனி(வ)', rahu: 'ராகு', ketu: 'கேது', lagna: '1-லக்', maandi: 'மாந்', mandi: 'மாந்'
  };"""

if old_div_charts in content:
    content = content.replace(old_div_charts, new_div_charts)
    print('Updated computeDivisionalCharts to include Mandi!')
else:
    print('Warning: old_div_charts not found directly')

# 2. Update compute18PageBookletData
old_p18_start = """  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
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

new_p18_start = """  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
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

if old_p18_start in content:
    content = content.replace(old_p18_start, new_p18_start)
    print('Updated compute18PageBookletData lagnaLon and mandiLong!')
else:
    print('Warning: old_p18_start not found directly')

# 3. Update makeChartPills in compute18PageBookletData to include Mandi and South Indian ordering
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

if old_pills in content:
    content = content.replace(old_pills, new_pills)
    print('Updated makeChartPills!')
else:
    print('Warning: old_pills not found directly')

# 4. Update empty.p3 dynamic Moon speed in compute18PageBookletData
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
    
    // Dynamic Moon daily speed calculation
    const dtT = 0.02 / 36525.0; // ~30 min in Julian centuries
    const Lp1 = 218.3164477 + 481267.88123421 * (m.T - dtT);
    const Lp2 = 218.3164477 + 481267.88123421 * (m.T + dtT);
    const moonDailySpeed = Math.abs(N(Lp2 - Lp1) / 0.04);
    const effectiveSpeed = (moonDailySpeed >= 11 && moonDailySpeed <= 16) ? moonDailySpeed : 14.5;
    const totalNazhigai = ( (40 / 3) / effectiveSpeed ) * 60.0;
    const garbhaNazhigai = totalNazhigai * fracElapsed;
    const iruppuNazhigai = totalNazhigai * fracRemain;

    const bDateObj = new Date(Y, M - 1, D, parseInt(bhStr, 10), parseInt(bmStr, 10), Math.round(parseFloat(bsStr)));
    const nakStartMs = bDateObj.getTime() - (garbhaNazhigai * 24 * 60 * 1000);
    const nakEndMs = bDateObj.getTime() + (iruppuNazhigai * 24 * 60 * 1000);"""

if old_p3_math in content:
    content = content.replace(old_p3_math, new_p3_math)
    print('Updated dynamic Moon speed in empty.p3!')
else:
    print('Warning: old_p3_math not found directly')

# 5. Update empty.p6 in compute18PageBookletData (Sripati Chart & Bhava Change)
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

if old_p6 in content:
    content = content.replace(old_p6, new_p6)
    print('Updated Sripati Chart and dynamic Bhava Change in empty.p6!')
else:
    print('Warning: old_p6 not found directly')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Phase 2 applied successfully!')
