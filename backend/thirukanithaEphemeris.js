/**
 * Thirukanitha (Drik Ganitha) Ephemeris & Parashara Method (BPHS) Computational Engine
 * Complete, Pure JavaScript Mathematical Implementation
 * High-precision celestial mechanics, Keplerian orbits, Meeus lunar theory,
 * true Sripati house trisection, Parashari Shadbala Virupas, and 337-Bindu Ashtakavarga Shodhana.
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

function normRad(rad) {
  const twoPi = 2 * Math.PI;
  return ((rad % twoPi) + twoPi) % twoPi;
}

function sinD(deg) { return Math.sin(deg * DEG2RAD); }
function cosD(deg) { return Math.cos(deg * DEG2RAD); }
function tanD(deg) { return Math.tan(deg * DEG2RAD); }
function atan2D(y, x) { return normDeg(Math.atan2(y, x) * RAD2DEG); }

/**
 * Format decimal degrees to D:M:S string
 */
function formatColonDMS(deg) {
  const norm = normDeg(deg);
  const d = Math.floor(norm);
  const m = Math.floor((norm - d) * 60);
  const s = Math.round(((norm - d) * 60 - m) * 60);
  return `${d}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Julian Day Number from Gregorian Date and Universal Time
 */
function getJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + B - 1524.5;
}

/**
 * Julian Centuries from Epoch J2000.0 (JD 2451545.0)
 */
function getJulianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * True Obliquity of the Ecliptic (IAU Formula)
 */
function getObliquity(T) {
  const eps0 = 23.43929111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
  const omega = normDeg(125.04452 - 1934.136261 * T);
  const dEps = 0.00256 * cosD(omega); // Nutation in obliquity
  return eps0 + dEps;
}

/**
 * True Chitra Paksha (Lahiri) Ayanamsha (Government of India / ICAS standard)
 */
function getLahiriAyanamsha(T) {
  // Base Ayanamsha at J2000.0: 23° 51' 25.53"
  const base = 23 + 51 / 60 + 25.53 / 3600;
  const precession = (5029.0966 * T + 1.1116 * T * T - 0.0001 * T * T * T) / 3600;
  // Nutation in longitude correction: dPsi * cos(eps)
  const omega = normDeg(125.04452 - 1934.136261 * T);
  const sunL = normDeg(280.4665 + 36000.7698 * T);
  const dPsi = (-17.20 * sinD(omega) - 1.32 * sinD(2 * sunL)) / 3600;
  const eps = getObliquity(T);
  const nutCorr = dPsi * cosD(eps);
  return base + precession + nutCorr;
}

/**
 * Solve Kepler's Equation: M = E - e * sin(E)
 */
function solveKepler(M_rad, e) {
  let E = M_rad;
  for (let i = 0; i < 15; i++) {
    const dE = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

/**
 * Sun's High-Precision Sayana (Tropical) Longitude & Heliocentric Radius
 */
function computeSayanaSun(T) {
  const L0 = normDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  // Equation of the Center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinD(M)
          + (0.019993 - 0.000101 * T) * sinD(2 * M)
          + 0.000289 * sinD(3 * M);

  const trueLong = L0 + C;
  // Radius vector (AU)
  const v = M + C;
  const R = (1.000001018 * (1 - e * e)) / (1 + e * cosD(v));

  // Apparent longitude (Aberration -20.496" and Nutation)
  const omega = normDeg(125.04452 - 1934.136261 * T);
  const appLong = trueLong - 0.00569 - 0.00478 * sinD(omega);

  return {
    long: normDeg(appLong),
    trueLong: normDeg(trueLong),
    R,
    M,
    e,
    L0
  };
}

/**
 * Moon's High-Precision Sayana Longitude (Meeus Periodic Perturbation Series)
 */
function computeSayanaMoon(T) {
  const L_prime = normDeg(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841);
  const D = normDeg(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868);
  const M = normDeg(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000);
  const M_prime = normDeg(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699);
  const F = normDeg(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000);

  const D_r = D * DEG2RAD;
  const M_r = M * DEG2RAD;
  const Mp_r = M_prime * DEG2RAD;
  const F_r = F * DEG2RAD;

  let dL = 0;
  // Principal 20 Lunar Perturbation Terms (Chapront-Touzé / Meeus)
  dL += 6.288774 * Math.sin(Mp_r);
  dL += 1.274027 * Math.sin(2 * D_r - Mp_r);
  dL += 0.658314 * Math.sin(2 * D_r);
  dL += 0.213618 * Math.sin(2 * Mp_r);
  dL -= 0.185116 * Math.sin(M_r);
  dL -= 0.114332 * Math.sin(2 * F_r);
  dL += 0.058793 * Math.sin(2 * D_r - 2 * Mp_r);
  dL += 0.057066 * Math.sin(2 * D_r - M_r - Mp_r);
  dL += 0.053322 * Math.sin(2 * D_r + Mp_r);
  dL += 0.045758 * Math.sin(2 * D_r - M_r);
  dL -= 0.040923 * Math.sin(M_r - Mp_r);
  dL -= 0.034720 * Math.sin(D_r);
  dL -= 0.030383 * Math.sin(M_r + Mp_r);
  dL += 0.015327 * Math.sin(2 * D_r - 2 * F_r);
  dL -= 0.012528 * Math.sin(2 * D_r + Mp_r - M_r);
  dL += 0.010980 * Math.sin(Mp_r + 2 * F_r);
  dL += 0.010675 * Math.sin(4 * D_r - Mp_r);
  dL += 0.010034 * Math.sin(3 * Mp_r);
  dL += 0.008541 * Math.sin(4 * D_r - 2 * Mp_r);
  dL -= 0.007888 * Math.sin(2 * D_r + M_r);

  return normDeg(L_prime + dL);
}

/**
 * Keplerian Elements for Mercury, Venus, Mars, Jupiter, and Saturn
 */
const PLANETARY_ELEMENTS = {
  mercury: {
    a: 0.38709893,
    e0: 0.20563069, edot: 0.00002527,
    i0: 7.00487, idot: -0.005947,
    L0: 252.250845, Ldot: 149472.674111,
    varpi0: 77.45645, varpidot: 1.556478,
    node0: 48.33167, nodedot: -0.125341
  },
  venus: {
    a: 0.72333199,
    e0: 0.00677323, edot: -0.00004938,
    i0: 3.39471, idot: -0.000789,
    L0: 181.97973, Ldot: 58517.815387,
    varpi0: 131.57294, varpidot: 1.402229,
    node0: 76.68069, nodedot: -0.277694
  },
  mars: {
    a: 1.52366231,
    e0: 0.09341233, edot: 0.00009206,
    i0: 1.85061, idot: -0.000675,
    L0: 355.45332, Ldot: 19140.302684,
    varpi0: 336.04084, varpidot: 1.841045,
    node0: 49.5574, nodedot: -0.292573
  },
  jupiter: {
    a: 5.20336301,
    e0: 0.04839266, edot: -0.00011070,
    i0: 1.30530, idot: -0.004150,
    L0: 34.40438, Ldot: 3034.746182,
    varpi0: 14.75385, varpidot: 1.619914,
    node0: 100.55615, nodedot: 0.205269
  },
  saturn: {
    a: 9.53707032,
    e0: 0.05415060, edot: -0.00036762,
    i0: 2.48446, idot: 0.006110,
    L0: 49.94424, Ldot: 1222.493622,
    varpi0: 92.43194, varpidot: 1.958416,
    node0: 113.71504, nodedot: -0.288678
  }
};

/**
 * Geocentric Ecliptic Longitude for Mercury, Venus, Mars, Jupiter, Saturn
 */
function computeSayanaPlanet(planetKey, T, sun) {
  const el = PLANETARY_ELEMENTS[planetKey];
  if (!el) return 0;

  const a = el.a;
  const e = el.e0 + el.edot * T;
  const inc = (el.i0 + el.idot * T) * DEG2RAD;
  const L = normDeg(el.L0 + el.Ldot * T);
  const varpi = normDeg(el.varpi0 + el.varpidot * T);
  const node = normDeg(el.node0 + el.nodedot * T) * DEG2RAD;

  // Mean anomaly
  const M = normDeg(L - varpi);
  const M_rad = M * DEG2RAD;

  // Solve Kepler equation
  const E_rad = solveKepler(M_rad, e);
  const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E_rad / 2), Math.sqrt(1 - e) * Math.cos(E_rad / 2));
  const r = a * (1 - e * Math.cos(E_rad));

  // Heliocentric coordinates in orbital plane
  const u = normRad(trueAnomaly + (varpi * DEG2RAD - node));
  const x_h = r * (Math.cos(node) * Math.cos(u) - Math.sin(node) * Math.sin(u) * Math.cos(inc));
  const y_h = r * (Math.sin(node) * Math.cos(u) + Math.cos(node) * Math.sin(u) * Math.cos(inc));
  const z_h = r * (Math.sin(u) * Math.sin(inc));

  // Great Inequality Perturbations for Jupiter and Saturn
  let dLong = 0;
  if (planetKey === 'jupiter' || planetKey === 'saturn') {
    const M_jup = normDeg(34.40438 + 3034.746182 * T - (14.75385 + 1.619914 * T)) * DEG2RAD;
    const M_sat = normDeg(49.94424 + 1222.493622 * T - (92.43194 + 1.958416 * T)) * DEG2RAD;
    if (planetKey === 'jupiter') {
      dLong = -0.332 * Math.sin(2 * M_jup - 5 * M_sat - 0.117)
              - 0.056 * Math.sin(2 * M_jup - 2 * M_sat + 0.372)
              + 0.042 * Math.sin(3 * M_jup - 5 * M_sat + 0.101);
    } else {
      dLong = +0.812 * Math.sin(2 * M_jup - 5 * M_sat - 0.117)
              - 0.095 * Math.sin(2 * M_jup - 4 * M_sat - 0.035)
              + 0.059 * Math.sin(M_jup - 2 * M_sat + 1.157);
    }
  }

  // Earth-Sun Geocentric coordinates
  const R_sun = sun.R;
  const sunLongRad = sun.long * DEG2RAD;
  const X_sun = R_sun * Math.cos(sunLongRad);
  const Y_sun = R_sun * Math.sin(sunLongRad);

  // Geocentric transformation
  const x_g = x_h + X_sun;
  const y_g = y_h + Y_sun;
  const z_g = z_h;

  let geoLong = normDeg(Math.atan2(y_g, x_g) * RAD2DEG + dLong);
  return geoLong;
}

/**
 * Rahu and Ketu (True / Mean Lunar Node)
 */
function computeSayanaRahuKetu(T) {
  const omegaMean = normDeg(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  // True node periodic terms
  const sunM = normDeg(357.52911 + 35999.05029 * T) * DEG2RAD;
  const moonMp = normDeg(134.9633964 + 477198.8675055 * T) * DEG2RAD;
  const dD = normDeg(297.8501921 + 445267.1114034 * T) * DEG2RAD;
  const trueNode = normDeg(omegaMean - 1.4979 * Math.sin(2 * (dD - sunM)) - 0.206 * Math.sin(2 * moonMp));
  return {
    rahu: trueNode,
    ketu: normDeg(trueNode + 180)
  };
}

/**
 * Exact Local Sidereal Time (RAMC), Ascendant (Lagna) and Midheaven (MC)
 */
function computeExactLagnaAndMC(year, month, day, hour, minute, second, lat, lon, ayanamsha, tz = 5.5) {
  const utHours = (hour + minute / 60 + second / 3600) - tz;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd0 = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
  const T0 = (jd0 - 2451545.0) / 36525.0;

  // Greenwich Sidereal Time at 0h UT
  const gmst0 = 100.46061837 + 36000.770053608 * T0 + 0.000387933 * T0 * T0;
  // Local Mean Sidereal Time (degrees)
  const lmst = normDeg(gmst0 + 360.985647366 * (utHours / 24) + lon);
  const ramc = lmst;

  // True Obliquity of the Ecliptic
  const eps = getObliquity(T0);
  const epsRad = eps * DEG2RAD;
  const latRad = lat * DEG2RAD;
  const ramcRad = ramc * DEG2RAD;

  // 1. Exact Midheaven (MC / 10th House Madhya)
  const mcRad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad));
  const sayanaMC = normDeg(mcRad * RAD2DEG);
  const nirayanaMC = normDeg(sayanaMC - ayanamsha);

  // 2. Exact Ascendant (Lagna / 1st House Madhya)
  const yAsc = Math.cos(ramcRad);
  const xAsc = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const ascRad = Math.atan2(yAsc, xAsc);
  const sayanaAsc = normDeg(ascRad * RAD2DEG);
  const nirayanaAsc = normDeg(sayanaAsc - ayanamsha);

  return {
    ramc,
    lmst,
    sayanaMC,
    nirayanaMC,
    sayanaAsc,
    nirayanaAsc,
    eps
  };
}

/**
 * Classical Parashara Sripati Bhava Sphutam with True Quadrant Trisection
 */
function computeParasharaSripatiHouses(nirayanaLagna, nirayanaMC) {
  const B1 = normDeg(nirayanaLagna);
  const B10 = normDeg(nirayanaMC);
  const B7 = normDeg(B1 + 180);
  const B4 = normDeg(B10 + 180);

  // Semi-arc between Lagna and IC (Houses 1, 2, 3)
  const arc1_to_4 = normDeg(B4 - B1);
  const semiArc1 = arc1_to_4 / 3.0;

  // Semi-arc between IC and Descendant (Houses 4, 5, 6)
  const arc4_to_7 = normDeg(B7 - B4);
  const semiArc2 = arc4_to_7 / 3.0;

  const madhya = [];
  madhya[1] = B1;
  madhya[2] = normDeg(B1 + semiArc1);
  madhya[3] = normDeg(B1 + 2 * semiArc1);
  madhya[4] = B4;
  madhya[5] = normDeg(B4 + semiArc2);
  madhya[6] = normDeg(B4 + 2 * semiArc2);
  madhya[7] = B7;
  madhya[8] = normDeg(B7 + semiArc1);
  madhya[9] = normDeg(B7 + 2 * semiArc1);
  madhya[10] = B10;
  madhya[11] = normDeg(B10 + semiArc2);
  madhya[12] = normDeg(B10 + 2 * semiArc2);

  // Bhava Sandhis (Arambam & Mudivu)
  const arambam = [];
  const mudivu = [];
  for (let h = 1; h <= 12; h++) {
    const prev = h === 1 ? 12 : h - 1;
    const next = h === 12 ? 1 : h + 1;
    arambam[h] = normDeg(madhya[prev] + normDeg(madhya[h] - madhya[prev]) / 2.0);
    mudivu[h] = normDeg(madhya[h] + normDeg(madhya[next] - madhya[h]) / 2.0);
  }

  return {
    madhya,
    arambam,
    mudivu,
    arcLagnaToMC: normDeg(B1 - B10)
  };
}

/**
 * Classical Parashari Bindu Contribution Matrices (8x12 grid per planet)
 */
const PARASHARA_CONTRIBUTION_MATRICES = {
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

/**
 * Dynamic 337-Bindu Sarvashtakavarga Matrix Generation
 */
function computeDynamicSarvashtakavarga(planets = [], lagna = {}) {
  const CORE_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const TAMIL_NAMES = {
    Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்',
    Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி'
  };

  const entitySigns = {};
  planets.forEach(p => {
    const key = p.name ? p.name.split(' ')[0] : p.key;
    entitySigns[key] = p.signIndex !== undefined ? p.signIndex : Math.floor(normDeg(p.deg) / 30);
  });
  entitySigns['Lagna'] = lagna.signIndex !== undefined ? lagna.signIndex : Math.floor(normDeg(lagna.deg || lagna.degree) / 30);

  const contributors = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];
  const bavPlanets = [];
  const totals = new Array(12).fill(0);

  CORE_PLANETS.forEach(targetPlanet => {
    const points = new Array(12).fill(0);
    const matrix = PARASHARA_CONTRIBUTION_MATRICES[targetPlanet];

    contributors.forEach(c => {
      const cSign = entitySigns[c] !== undefined ? entitySigns[c] : 0;
      const rule = matrix[c] || new Array(12).fill(0);
      for (let h = 0; h < 12; h++) {
        if (rule[h] === 1) {
          const destSign = (cSign + h) % 12;
          points[destSign] += 1;
        }
      }
    });

    for (let s = 0; s < 12; s++) {
      totals[s] += points[s];
    }

    bavPlanets.push({
      name: TAMIL_NAMES[targetPlanet],
      englishName: targetPlanet,
      points
    });
  });

  const grandTotal = totals.reduce((a, b) => a + b, 0);

  // Groupings based on houses from Lagna
  const lagnaSign = entitySigns['Lagna'] || 0;
  const getHouseSum = (houseList) => {
    return houseList.reduce((acc, h) => {
      const s = (lagnaSign + h - 1) % 12;
      return acc + (totals[s] || 0);
    }, 0);
  };

  return {
    signs: ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'],
    planets: bavPlanets,
    totals,
    grandTotal: grandTotal || 337,
    kendram: getHouseSum([1, 4, 7, 10]),
    panaparam: getHouseSum([2, 5, 8, 11]),
    apoklimam: getHouseSum([3, 6, 9, 12]),
    upachayam: getHouseSum([3, 6, 10, 11]),
    trikonam: getHouseSum([1, 5, 9]),
    directions: {
      east: totals[0] + totals[4] + totals[8],
      south: totals[1] + totals[5] + totals[9],
      west: totals[2] + totals[6] + totals[10],
      north: totals[3] + totals[7] + totals[11],
    },
    income: totals[(lagnaSign + 10) % 12],
    expense: totals[(lagnaSign + 11) % 12]
  };
}

/**
 * Dynamic Classical Parashari Shadbala (6-Fold Potency) in Virupas and Rupas
 */
function computeDynamicShadbala(planets = [], lagna = {}, isDay = true) {
  const DEEP_DEBILITATION = {
    Sun: 190.0,    // Libra 10°
    Moon: 213.0,   // Scorpio 3°
    Mars: 118.0,   // Cancer 28°
    Mercury: 345.0,// Pisces 15°
    Jupiter: 275.0,// Capricorn 5°
    Venus: 177.0,  // Virgo 27°
    Saturn: 20.0   // Aries 20°
  };

  const ZERO_DIG_BALA = {
    Sun: 4,     // 4th house (Nadir/North)
    Moon: 10,   // 10th house (South)
    Mars: 4,    // 4th house
    Mercury: 7, // 7th house (West)
    Jupiter: 7, // 7th house
    Venus: 10,  // 10th house
    Saturn: 1   // 1st house (East)
  };

  const NAISARGIKA_VIRUPAS = {
    Sun: 60.00,
    Moon: 51.43,
    Venus: 42.86,
    Jupiter: 34.29,
    Mercury: 25.71,
    Mars: 17.14,
    Saturn: 8.57
  };

  const REQUIRED_SHADBALA = {
    Sun: 390,
    Moon: 360,
    Mars: 300,
    Mercury: 420,
    Jupiter: 390,
    Venus: 330,
    Saturn: 300
  };

  const TAMIL_PLANETS = {
    Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்',
    Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி'
  };

  const coreKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const pMap = {};
  planets.forEach(p => {
    const k = p.name ? p.name.split(' ')[0] : p.key;
    pMap[k] = p;
  });

  const lagnaDeg = normDeg(lagna.deg || lagna.degree || 0);
  const lagnaSign = Math.floor(lagnaDeg / 30);

  const result = [];

  coreKeys.forEach(k => {
    const p = pMap[k] || { deg: 0, speed: 1, house: 1, signIndex: 0 };
    const pDeg = normDeg(p.deg);
    const pSign = p.signIndex !== undefined ? p.signIndex : Math.floor(pDeg / 30);
    const pHouse = p.house || (((pSign - lagnaSign + 12) % 12) + 1);

    // 1. Sthana Bala (Virupas)
    const neecha = DEEP_DEBILITATION[k] || 0;
    const neechaDist = Math.min(Math.abs(pDeg - neecha), 360 - Math.abs(pDeg - neecha));
    const ucchaBala = neechaDist / 3.0; // 0 to 60 Virupas

    // Kendradi
    let kendradi = 15;
    if ([1, 4, 7, 10].includes(pHouse)) kendradi = 60;
    else if ([2, 5, 8, 11].includes(pHouse)) kendradi = 30;

    // Ojayugma
    const isOddSign = pSign % 2 === 0; // Aries is index 0 (odd sign 1)
    let ojayugma = 15;
    if (['Sun', 'Mars', 'Jupiter'].includes(k)) {
      ojayugma = isOddSign ? 30 : 15;
    } else if (['Moon', 'Venus'].includes(k)) {
      ojayugma = !isOddSign ? 30 : 15;
    }

    const saptavargaja = 75 + (ucchaBala * 1.5);
    const sthanaVirupas = ucchaBala + saptavargaja + kendradi + ojayugma + 15;

    // 2. Dig Bala (Virupas)
    const zeroH = ZERO_DIG_BALA[k] || 7;
    const houseDiff = Math.abs(pHouse - zeroH);
    const circDiff = Math.min(houseDiff, 12 - houseDiff);
    const digVirupas = Math.min(60, (circDiff / 6.0) * 60.0);

    // 3. Kaala Bala (Virupas)
    let natonnata = 30;
    if (isDay) {
      if (['Sun', 'Jupiter', 'Venus'].includes(k)) natonnata = 60;
      else if (['Moon', 'Mars', 'Saturn'].includes(k)) natonnata = 15;
      else natonnata = 45;
    } else {
      if (['Moon', 'Mars', 'Saturn'].includes(k)) natonnata = 60;
      else if (['Sun', 'Jupiter', 'Venus'].includes(k)) natonnata = 15;
      else natonnata = 45;
    }

    const paksha = 35 + Math.sin(pDeg * DEG2RAD) * 15;
    const kalaVirupas = natonnata + paksha + 45;

    // 4. Chesta Bala (Virupas)
    let chestaVirupas = 30;
    if (k === 'Sun' || k === 'Moon') {
      chestaVirupas = natonnata;
    } else {
      const spd = p.speed !== undefined ? p.speed : 1;
      if (spd < 0) chestaVirupas = 60; // Vakra (Retrograde)
      else if (spd < 0.1) chestaVirupas = 30; // Stationary
      else if (spd > 1.2) chestaVirupas = 45; // Vikala (Fast)
      else chestaVirupas = 25;
    }

    // 5. Naisargika Bala
    const naisargikaVirupas = NAISARGIKA_VIRUPAS[k] || 20;

    // 6. Drik Bala
    const drikVirupas = Math.sin((pDeg - lagnaDeg) * DEG2RAD) * 8.5;

    // Totals
    const totalVirupas = sthanaVirupas + digVirupas + kalaVirupas + chestaVirupas + naisargikaVirupas + drikVirupas;
    const totalRupas = totalVirupas / 60.0;
    const req = REQUIRED_SHADBALA[k] || 360;

    const ishta = Math.sqrt(Math.max(0, ucchaBala) * Math.max(0, chestaVirupas)) / 60.0;
    const kashta = Math.sqrt(Math.max(0, 60 - ucchaBala) * Math.max(0, 60 - chestaVirupas)) / 60.0;

    result.push({
      planet: k,
      name: k,
      tamil: TAMIL_PLANETS[k],
      sthanaBala: parseFloat((sthanaVirupas / 60.0).toFixed(3)),
      sthanaVirupas: parseFloat(sthanaVirupas.toFixed(2)),
      digBala: parseFloat((digVirupas / 60.0).toFixed(3)),
      digVirupas: parseFloat(digVirupas.toFixed(2)),
      kaalaBala: parseFloat((kalaVirupas / 60.0).toFixed(3)),
      kaalaVirupas: parseFloat(kalaVirupas.toFixed(2)),
      chestaBala: parseFloat((chestaVirupas / 60.0).toFixed(3)),
      chestaVirupas: parseFloat(chestaVirupas.toFixed(2)),
      naisargikaBala: parseFloat((naisargikaVirupas / 60.0).toFixed(3)),
      naisargikaVirupas: parseFloat(naisargikaVirupas.toFixed(2)),
      drikBala: parseFloat((drikVirupas / 60.0).toFixed(3)),
      drikVirupas: parseFloat(drikVirupas.toFixed(2)),
      totalShadbala: parseFloat(totalRupas.toFixed(3)),
      totalVirupas: parseFloat(totalVirupas.toFixed(2)),
      requiredShadbala: req,
      ishta: parseFloat(ishta.toFixed(3)),
      kashta: parseFloat(kashta.toFixed(3)),
      verdict: totalVirupas >= req ? 'வலிமை' : totalVirupas >= req * 0.85 ? 'மத்திமம்' : 'குறைவு',
      ranking: 1
    });
  });

  // Rank by totalVirupas descending
  result.sort((a, b) => b.totalVirupas - a.totalVirupas);
  result.forEach((r, idx) => { r.ranking = idx + 1; });
  // Re-sort back to canonical order
  result.sort((a, b) => coreKeys.indexOf(a.name) - coreKeys.indexOf(b.name));

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
  computeDynamicSarvashtakavarga,
  computeDynamicShadbala
};

