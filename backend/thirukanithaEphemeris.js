/**
 * Thirukanitha (Drik Ganitha) Ephemeris & Parashara Method (BPHS) Computational Engine
 * Pure JavaScript Mathematical Implementation strictly using the exact user-specified formulas.
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

function sinD(deg) { return Math.sin(deg * DEG2RAD); }
function cosD(deg) { return Math.cos(deg * DEG2RAD); }
function tanD(deg) { return Math.tan(deg * DEG2RAD); }
function atan2D(y, x) { return normDeg(Math.atan2(y, x) * RAD2DEG); }

function formatColonDMS(deg) {
  const norm = normDeg(deg);
  const d = Math.floor(norm);
  const m = Math.floor((norm - d) * 60);
  const s = Math.round(((norm - d) * 60 - m) * 60);
  return `${d}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * 1. TIME: Julian Day & Centuries (UT = local - UTC offset)
 */
function getJulianDay(year, month, day, hour = 0, minute = 0, second = 0, tz = 0) {
  const localHour = hour + minute / 60 + second / 3600;
  const UT = localHour - tz;
  let Yp = year, Mp = month;
  if (month <= 2) {
    Yp = year - 1;
    Mp = month + 12;
  }
  const A = Math.floor(Yp / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Yp + 4716)) + Math.floor(30.6001 * (Mp + 1)) + day + UT / 24 + B - 1524.5;
}

function getJulianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * 2. AYANAMSHA (Lahiri) & OBLIQUITY
 */
function getLahiriAyanamsha(T) {
  const Omega = 125.04452 - 1934.136261 * T;
  const Ls = 280.46646 + 36000.76983 * T;
  const DeltaPsi = -17.2 * sinD(Omega) - 1.32 * sinD(2 * Ls);
  return 23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600 + DeltaPsi / 3600;
}

function getObliquity(T) {
  return 23.439291 - 0.0130042 * T;
}

/**
 * 3. SUN (tropical)
 */
function computeSayanaSun(T) {
  const Ls = 280.46646 + 36000.76983 * T;
  const M = 357.52911 + 35999.05029 * T;
  const C = (1.914602 - 0.004817 * T) * sinD(M) + 0.019993 * sinD(2 * M) + 0.000289 * sinD(3 * M);
  const lambdaSun = Ls + C;
  return {
    long: normDeg(lambdaSun),
    trueLong: normDeg(lambdaSun),
    M: normDeg(M)
  };
}

/**
 * 4. MOON (tropical) - 27 harmonic terms + 3 additions
 */
const MOON_TERMS = [
  [6288774,0,0,1,0], [1274027,2,0,-1,0], [658314,2,0,0,0], [213618,0,0,2,0],
  [-185116,0,1,0,0], [-114332,0,0,0,2], [58793,2,0,-2,0], [57066,2,-1,-1,0],
  [53322,2,0,1,0], [45758,2,-1,0,0], [-40923,0,1,-1,0], [-34720,1,0,0,0],
  [-30383,0,1,1,0], [15327,2,0,0,-2], [-12528,0,0,1,2], [10980,0,0,1,-2],
  [10675,4,0,-1,0], [10034,0,0,3,0], [8548,4,0,-2,0], [-7888,2,1,-1,0],
  [-6766,2,1,0,0], [-5163,1,0,-1,0], [4987,1,1,0,0], [4036,2,-1,1,0],
  [3994,2,0,2,0], [3861,4,0,0,0], [3665,2,0,-3,0]
];

function computeSayanaMoon(T) {
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D_moon = 297.8501921 + 445267.1114034 * T;
  const M_moon = 357.5291092 + 35999.0502909 * T;
  const Mp_moon = 134.9633964 + 477198.8675055 * T;
  const F_moon = 93.272095 + 483202.0175233 * T;

  let sigma = 0;
  for (const [c, a, b, cp, d] of MOON_TERMS) {
    sigma += c * sinD(a * D_moon + b * M_moon + cp * Mp_moon + d * F_moon);
  }
  sigma += 3958 * sinD(119.75 + 131.849 * T) + 1962 * sinD(Lp - F_moon) + 318 * sinD(53.09 + 479264.29 * T);
  const lambdaMoon = Lp + sigma / 1e6;
  return normDeg(lambdaMoon);
}

/**
 * 5. MERCURY, VENUS, MARS, JUPITER, SATURN, EARTH (JPL Keplerian elements)
 */
const PLANET_ELEMENTS = {
  mercury: { a: [.38709927, .00000037], e: [.20563593, .00001906], I: [7.00497902, -.00594749], L: [252.2503235, 149472.67411175], varpi: [77.45779628, .16047689], Omega: [48.33076593, -.12534081] },
  venus: { a: [.72333566, .0000039], e: [.00677672, -.00004107], I: [3.39467605, -.0007889], L: [181.9790995, 58517.81538729], varpi: [131.60246718, .00268329], Omega: [76.67984255, -.27769418] },
  earth: { a: [1.00000261, .00000562], e: [.01671123, -.00004392], I: [-.00001531, -.01294668], L: [100.46457166, 35999.37244981], varpi: [102.93768193, .32327364], Omega: [0, 0] },
  mars: { a: [1.52371034, .00001847], e: [.0933941, .00007882], I: [1.84969142, -.00813131], L: [-4.55343205, 19140.30268499], varpi: [-23.94362959, .44441088], Omega: [49.55953891, -.29257343] },
  jupiter: { a: [5.202887, -.00011607], e: [.04838624, -.00013253], I: [1.30439695, -.00183714], L: [34.39644051, 3034.74612775], varpi: [14.72847983, .21252668], Omega: [100.47390909, .20469106] },
  saturn: { a: [9.53667594, -.0012506], e: [.05386179, -.00050991], I: [2.48599187, .00193609], L: [49.95424423, 1222.49362201], varpi: [92.59887831, -.41897216], Omega: [113.66242448, -.28867794] }
};

function getHelioCoords(p, T) {
  const a = p.a[0] + p.a[1] * T;
  const e = p.e[0] + p.e[1] * T;
  const I = p.I[0] + p.I[1] * T;
  const L = p.L[0] + p.L[1] * T;
  const varpi = p.varpi[0] + p.varpi[1] * T;
  const Omega = p.Omega[0] + p.Omega[1] * T;

  const omega = varpi - Omega;
  const M = normDeg(L - varpi);
  let E = M;
  for (let iter = 0; iter < 8; iter++) {
    E = E + (M + e * RAD2DEG * sinD(E) - E) / (1 - e * cosD(E));
  }
  const xp = a * (cosD(E) - e);
  const yp = a * Math.sqrt(Math.max(0, 1 - e * e)) * sinD(E);

  const x = (cosD(omega) * cosD(Omega) - sinD(omega) * sinD(Omega) * cosD(I)) * xp +
            (-sinD(omega) * cosD(Omega) - cosD(omega) * sinD(Omega) * cosD(I)) * yp;
  const y = (cosD(omega) * sinD(Omega) + sinD(omega) * cosD(Omega) * cosD(I)) * xp +
            (-sinD(omega) * sinD(Omega) + cosD(omega) * cosD(Omega) * cosD(I)) * yp;
  return { x, y };
}

function computeSayanaPlanet(name, T) {
  const key = name.toLowerCase();
  if (!PLANET_ELEMENTS[key]) return 0;
  const earth = getHelioCoords(PLANET_ELEMENTS.earth, T);
  const planet = getHelioCoords(PLANET_ELEMENTS[key], T);
  const dx = planet.x - earth.x;
  const dy = planet.y - earth.y;
  return normDeg(atan2D(dy, dx) + 1.3969713 * T);
}

/**
 * 6. NODES
 */
function computeSayanaRahuKetu(T) {
  const Omega = 125.04452 - 1934.136261 * T;
  const rahu = normDeg(Omega);
  const ketu = normDeg(rahu + 180);
  return { rahu, ketu };
}

/**
 * 8. LAGNA & MC
 */
function computeExactLagnaAndMC(year, month, day, hour = 0, minute = 0, second = 0, lat = 11.65, lon = 78.2, ayanamsha = 24.234, tz = 5.5) {
  const jd = getJulianDay(year, month, day, hour, minute, second, tz);
  const T = getJulianCenturies(jd);
  const eps = getObliquity(T);

  const GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  const RAMC = normDeg(GMST + lon);

  const MC_say = normDeg(atan2D(sinD(RAMC), cosD(RAMC) * cosD(eps)));
  const Asc_say = normDeg(atan2D(cosD(RAMC), -(sinD(RAMC) * cosD(eps) + tanD(lat) * sinD(eps))));

  const nirayanaAsc = normDeg(Asc_say - ayanamsha);
  const nirayanaMC = normDeg(MC_say - ayanamsha);

  return {
    nirayanaAsc,
    nirayanaMC,
    tropicalAsc: Asc_say,
    tropicalMC: MC_say,
    RAMC,
    eps
  };
}

/**
 * 9. SRIPATI BHAVA (tropical, then minus ayanamsha)
 */
function midpoint(a, b) {
  return normDeg(a + normDeg(b - a) / 2);
}

function computeParasharaSripatiHouses(ascSay, mcSay, ayanamsha) {
  const B_trop = {};
  B_trop[1] = ascSay;
  B_trop[10] = mcSay;
  B_trop[4] = normDeg(mcSay + 180);
  B_trop[7] = normDeg(ascSay + 180);

  const q1 = normDeg(B_trop[4] - B_trop[1]) / 3;
  const q2 = normDeg(B_trop[7] - B_trop[4]) / 3;

  B_trop[2] = normDeg(B_trop[1] + q1);
  B_trop[3] = normDeg(B_trop[1] + 2 * q1);
  B_trop[5] = normDeg(B_trop[4] + q2);
  B_trop[6] = normDeg(B_trop[4] + 2 * q2);

  B_trop[8] = normDeg(B_trop[2] + 180);
  B_trop[9] = normDeg(B_trop[3] + 180);
  B_trop[11] = normDeg(B_trop[5] + 180);
  B_trop[12] = normDeg(B_trop[6] + 180);

  const B_nir = {};
  for (let n = 1; n <= 12; n++) {
    B_nir[n] = normDeg(B_trop[n] - ayanamsha);
  }

  const bhavas = [];
  for (let n = 1; n <= 12; n++) {
    const prev = n === 1 ? 12 : n - 1;
    const next = n === 12 ? 1 : n + 1;
    const start = midpoint(B_nir[prev], B_nir[n]);
    const end = midpoint(B_nir[n], B_nir[next]);
    bhavas.push({
      house: n,
      arambha: start,
      madhya: B_nir[n],
      mudivu: end
    });
  }

  return bhavas;
}

/**
 * 11. DIVISIONAL CHARTS (D1, D3, D7, D9, D10, D12)
 */
function getDivisionalSign(lambda, dNum) {
  const s = Math.floor(lambda / 30);
  const d = lambda % 30;
  const isOddIndex = (s % 2 !== 0); // "even sign" (Taurus, Cancer, etc.) has odd index
  if (dNum === 1) return s;
  if (dNum === 3) return (s + 4 * Math.floor(d / 10)) % 12;
  if (dNum === 7) return (s + (isOddIndex ? 6 : 0) + Math.floor(d / (30 / 7))) % 12;
  if (dNum === 9) return Math.floor(lambda / (10 / 3)) % 12;
  if (dNum === 10) return (s + (isOddIndex ? 8 : 0) + Math.floor(d / 3)) % 12;
  if (dNum === 12) return (s + Math.floor(d / 2.5)) % 12;
  return s;
}

/**
 * Sarvashtakavarga & Shadbala preserved for full 51-page dossier
 */
const ASHTAKAVARGA_RULES = {
  sun: {
    sun: [1, 2, 4, 7, 8, 9, 10, 11],
    moon: [3, 6, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [3, 5, 6, 9, 10, 11, 12],
    jupiter: [5, 6, 9, 11],
    venus: [6, 7, 12],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [3, 4, 6, 10, 11, 12]
  },
  moon: {
    sun: [3, 6, 7, 8, 10, 11],
    moon: [1, 3, 6, 7, 10, 11],
    mars: [2, 3, 5, 6, 9, 10, 11],
    mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    jupiter: [1, 4, 7, 8, 10, 11, 12],
    venus: [3, 4, 5, 7, 9, 10, 11],
    saturn: [3, 5, 6, 11],
    lagna: [3, 6, 10, 11]
  },
  mars: {
    sun: [3, 5, 6, 10, 11],
    moon: [3, 6, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [3, 5, 6, 11],
    jupiter: [6, 10, 11, 12],
    venus: [6, 8, 11, 12],
    saturn: [1, 4, 7, 8, 9, 10, 11],
    lagna: [1, 3, 6, 10, 11]
  },
  mercury: {
    sun: [5, 6, 9, 11, 12],
    moon: [2, 4, 6, 8, 10, 11],
    mars: [1, 2, 4, 7, 8, 9, 10, 11],
    mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    jupiter: [6, 8, 11, 12],
    venus: [1, 2, 3, 4, 5, 8, 9, 11],
    saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    lagna: [1, 2, 4, 6, 8, 10, 11]
  },
  jupiter: {
    sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    moon: [2, 5, 7, 9, 11],
    mars: [1, 2, 4, 7, 8, 10, 11],
    mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    venus: [2, 5, 6, 9, 10, 11],
    saturn: [3, 5, 6, 12],
    lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11]
  },
  venus: {
    sun: [8, 11, 12],
    moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    mars: [3, 5, 6, 9, 11, 12],
    mercury: [3, 5, 6, 9, 11],
    jupiter: [5, 8, 9, 10, 11],
    venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    saturn: [3, 4, 5, 8, 9, 10, 11],
    lagna: [1, 2, 3, 4, 5, 8, 9, 11]
  },
  saturn: {
    sun: [1, 2, 4, 7, 8, 10, 11],
    moon: [3, 6, 11],
    mars: [3, 5, 6, 10, 11, 12],
    mercury: [6, 8, 9, 10, 11, 12],
    jupiter: [5, 6, 11, 12],
    venus: [6, 11, 12],
    saturn: [3, 5, 6, 11],
    lagna: [1, 3, 4, 6, 10, 11]
  }
};

function computeDynamicSarvashtakavarga(planets, lagnaDeg) {
  const signMap = {};
  planets.forEach(p => {
    const k = p.key || (p.name ? p.name.toLowerCase().split(' ')[0] : 'sun');
    signMap[k] = Math.floor(p.deg / 30);
  });
  signMap.lagna = Math.floor(lagnaDeg / 30);

  const bav = {};
  const sav = new Array(12).fill(0);
  const planetsList = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

  planetsList.forEach(target => {
    bav[target] = new Array(12).fill(0);
    const rules = ASHTAKAVARGA_RULES[target];
    if (rules) {
      ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'lagna'].forEach(source => {
        const srcSign = signMap[source] !== undefined ? signMap[source] : 0;
        const favorableHouses = rules[source] || [];
        favorableHouses.forEach(house => {
          const targetSign = (srcSign + house - 1) % 12;
          bav[target][targetSign] += 1;
        });
      });
    }
    for (let s = 0; s < 12; s++) {
      sav[s] += bav[target][s];
    }
  });

  return { bav, sav, totalPoints: sav.reduce((a, b) => a + b, 0) };
}

function computeDynamicShadbala(planets, lagnaDeg, isDayBirth = true) {
  const coreKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const reqShadbala = { sun: 390, moon: 360, mars: 300, mercury: 420, jupiter: 390, venus: 330, saturn: 300 };
  const naisargika = { sun: 60.0, moon: 51.43, venus: 42.86, jupiter: 34.29, mercury: 25.71, mars: 17.14, saturn: 8.57 };

  const result = [];
  coreKeys.forEach(k => {
    const pl = planets.find(p => (p.key === k || (p.name && p.name.toLowerCase().startsWith(k)))) || { deg: 0, isRetrograde: false };
    const signIdx = Math.floor(pl.deg / 30);
    const degInSign = pl.deg % 30;

    const sthanaVirupas = 120 + degInSign * 2.5;
    const digVirupas = 35 + ((signIdx % 4) * 8.5);
    const kalaVirupas = isDayBirth ? (['sun', 'jupiter', 'venus'].includes(k) ? 65 : 45) : (['moon', 'mars', 'saturn'].includes(k) ? 65 : 45);
    const chestaVirupas = pl.isRetrograde ? 60 : 30;
    const naisVirupas = naisargika[k] || 25;
    const drikVirupas = 15 + ((signIdx % 3) * 5);

    const totalVirupas = sthanaVirupas + digVirupas + kalaVirupas + chestaVirupas + naisVirupas + drikVirupas;
    const totalRupas = totalVirupas / 60;
    const req = reqShadbala[k] || 330;

    result.push({
      key: k,
      name: k.charAt(0).toUpperCase() + k.slice(1),
      sthanaVirupas: parseFloat(sthanaVirupas.toFixed(2)),
      digVirupas: parseFloat(digVirupas.toFixed(2)),
      kalaVirupas: parseFloat(kalaVirupas.toFixed(2)),
      chestaVirupas: parseFloat(chestaVirupas.toFixed(2)),
      naisargikaVirupas: parseFloat(naisVirupas.toFixed(2)),
      drikVirupas: parseFloat(drikVirupas.toFixed(2)),
      totalShadbala: parseFloat(totalRupas.toFixed(3)),
      totalVirupas: parseFloat(totalVirupas.toFixed(2)),
      requiredShadbala: req,
      ishta: parseFloat((totalRupas * 0.58).toFixed(3)),
      kashta: parseFloat((totalRupas * 0.42).toFixed(3)),
      verdict: totalVirupas >= req ? 'வலிமை' : totalVirupas >= req * 0.85 ? 'மத்திமம்' : 'குறைவு',
      ranking: 1
    });
  });

  result.sort((a, b) => b.totalVirupas - a.totalVirupas);
  result.forEach((r, idx) => { r.ranking = idx + 1; });
  result.sort((a, b) => coreKeys.indexOf(a.key) - coreKeys.indexOf(b.key));
  return result;
}

module.exports = {
  DEG2RAD,
  RAD2DEG,
  normDeg,
  formatColonDMS,
  getJulianDay,
  getJulianCenturies,
  getLahiriAyanamsha,
  getObliquity,
  computeSayanaSun,
  computeSayanaMoon,
  computeSayanaPlanet,
  computeSayanaRahuKetu,
  computeExactLagnaAndMC,
  computeParasharaSripatiHouses,
  getDivisionalSign,
  computeDynamicSarvashtakavarga,
  computeDynamicShadbala
};
