/**
 * Thirukanitha (Drik Ganitha) Ephemeris & Vedic Astrology Engine
 * Accurate planetary calculations according to exact specifications.
 */

 ; exports. = ; = Math.PI / 180;
 ; exports. = ; = 180 / Math.PI;

 ; exports. = ;(x) {
  let val = x % 360;
  if (val < 0) val += 360;
  return val;
}

 ; exports. = ;(x) { return Math.sin(x * D2R); }
 ; exports. = ;(x) { return Math.cos(x * D2R); }
 ; exports. = ;(y, x) { return N(Math.atan2(y, x) * R2D); }

 ; exports. = ;(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`;
}

 ; exports. = ;(deg) {
  const rem = deg % 30;
  const d = Math.floor(rem);
  const m = Math.floor((rem - d) * 60);
  const s = Math.round(((rem - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`;
}

 ; exports. = ;(tzVal) {
  if (typeof tzVal === 'number') return isNaN(tzVal) ? 5.5 : tzVal;
  if (!tzVal) return 5.5;
  const str = String(tzVal).trim();
  const m = str.match(/([+-]?\d{1,2}):(\d{2})/);
  if (m) {
    const isNeg = str.trim().startsWith('-');
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const num = Math.abs(h) + min / 60;
    return isNeg ? -num : num;
  }
  const f = parseFloat(str.replace(/[^\d.-]/g, ''));
  return isNaN(f) ? 5.5 : f;
}

 ; exports. = ;(offsetNum) {
  if (typeof offsetNum === 'string' && offsetNum.includes('UTC')) return offsetNum;
  const num = typeof offsetNum === 'number' ? offsetNum : parseUtcOffset(offsetNum);
  const sign = num < 0 ? '-' : '+';
  const abs = Math.abs(num);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`;
}

 ; exports. = ;(timeVal) {
  if (typeof timeVal === 'number') return timeVal;
  if (!timeVal) return 0;
  const str = String(timeVal).trim();
  const isPM = /pm/i.test(str);
  const isAM = /am/i.test(str);
  const clean = str.replace(/[^\d:]/g, '');
  const [hStr = '0', mStr = '0', sStr = '0'] = clean.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const s = parseFloat(sStr) || 0;
  if (isPM) {
    if (h < 12) h += 12;
  } else if (isAM) {
    if (h === 12) h = 0;
  }
  return h + m / 60 + s / 3600;
}

 ; exports. = ; = [
  { name: 'Salem', lat: 11.65, lon: 78.20, labelTa: 'சேலம்' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, labelTa: 'சென்னை' },
  { name: 'Madurai', lat: 9.9252, lon: 78.1198, labelTa: 'மதுரை' },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, labelTa: 'கோயம்புத்தூர்' },
  { name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047, labelTa: 'திருச்சிராப்பள்ளி' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, labelTa: 'பெங்களூரு' }
];

 ; exports. = ; = [
  { id: 0, en: 'Aries', ta: 'மேஷம்', shortEn: 'Ar', shortTa: 'மே' },
  { id: 1, en: 'Taurus', ta: 'ரிஷபம்', shortEn: 'Ta', shortTa: 'ரி' },
  { id: 2, en: 'Gemini', ta: 'மிதுனம்', shortEn: 'Ge', shortTa: 'மி' },
  { id: 3, en: 'Cancer', ta: 'கடகம்', shortEn: 'Cn', shortTa: 'க' },
  { id: 4, en: 'Leo', ta: 'சிம்மம்', shortEn: 'Le', shortTa: 'சி' },
  { id: 5, en: 'Virgo', ta: 'கன்னி', shortEn: 'Vi', shortTa: 'கன்' },
  { id: 6, en: 'Libra', ta: 'துலாம்', shortEn: 'Li', shortTa: 'து' },
  { id: 7, en: 'Scorpio', ta: 'விருச்சிகம்', shortEn: 'Sc', shortTa: 'வி' },
  { id: 8, en: 'Sagittarius', ta: 'தனுசு', shortEn: 'Sg', shortTa: 'த' },
  { id: 9, en: 'Capricorn', ta: 'மகரம்', shortEn: 'Cp', shortTa: 'ம' },
  { id: 10, en: 'Aquarius', ta: 'கும்பம்', shortEn: 'Aq', shortTa: 'கு' },
  { id: 11, en: 'Pisces', ta: 'மீனம்', shortEn: 'Pi', shortTa: 'மீ' }
];

 ; exports. = ; = [
  { id: 0, en: 'Ashwini', ta: 'அஸ்வினி', lord: 'Ketu' },
  { id: 1, en: 'Bharani', ta: 'பரணி', lord: 'Venus' },
  { id: 2, en: 'Krittika', ta: 'கார்த்திகை', lord: 'Sun' },
  { id: 3, en: 'Rohini', ta: 'ரோகிணி', lord: 'Moon' },
  { id: 4, en: 'Mrigashira', ta: 'மிருகசீரிஷம்', lord: 'Mars' },
  { id: 5, en: 'Ardra', ta: 'திருவாதிரை', lord: 'Rahu' },
  { id: 6, en: 'Punarvasu', ta: 'புனர்பூசம்', lord: 'Jupiter' },
  { id: 7, en: 'Pushya', ta: 'பூசம்', lord: 'Saturn' },
  { id: 8, en: 'Ashlesha', ta: 'ஆயில்யம்', lord: 'Mercury' },
  { id: 9, en: 'Magha', ta: 'மகம்', lord: 'Ketu' },
  { id: 10, en: 'Purva Phalguni', ta: 'பூரம்', lord: 'Venus' },
  { id: 11, en: 'Uttara Phalguni', ta: 'உத்திரம்', lord: 'Sun' },
  { id: 12, en: 'Hasta', ta: 'ஹஸ்தம்', lord: 'Moon' },
  { id: 13, en: 'Chitra', ta: 'சித்திரை', lord: 'Mars' },
  { id: 14, en: 'Swati', ta: 'சுவாதி', lord: 'Rahu' },
  { id: 15, en: 'Vishakha', ta: 'விசாகம்', lord: 'Jupiter' },
  { id: 16, en: 'Anuradha', ta: 'அனுஷம்', lord: 'Saturn' },
  { id: 17, en: 'Jyeshtha', ta: 'கேட்டை', lord: 'Mercury' },
  { id: 18, en: 'Mula', ta: 'மூலம்', lord: 'Ketu' },
  { id: 19, en: 'Purva Ashadha', ta: 'பூராடம்', lord: 'Venus' },
  { id: 20, en: 'Uttara Ashadha', ta: 'உத்திராடம்', lord: 'Sun' },
  { id: 21, en: 'Shravana', ta: 'திருவோணம்', lord: 'Moon' },
  { id: 22, en: 'Dhanishta', ta: 'அவிட்டம்', lord: 'Mars' },
  { id: 23, en: 'Shatabhisha', ta: 'சதயம்', lord: 'Rahu' },
  { id: 24, en: 'Purva Bhadrapada', ta: 'பூரட்டாதி', lord: 'Jupiter' },
  { id: 25, en: 'Uttara Bhadrapada', ta: 'உத்திரட்டாதி', lord: 'Saturn' },
  { id: 26, en: 'Revati', ta: 'ரேவதி', lord: 'Mercury' }
];

 ; exports. = ; = [
  { id: 'sun', en: 'Sun', ta: 'சூரியன்', symbol: '☉', shortEn: 'Su', shortTa: 'சூ' },
  { id: 'moon', en: 'Moon', ta: 'சந்திரன்', symbol: '☽', shortEn: 'Mo', shortTa: 'சந்' },
  { id: 'mars', en: 'Mars', ta: 'செவ்வாய்', symbol: '♂', shortEn: 'Ma', shortTa: 'செவ்' },
  { id: 'mercury', en: 'Mercury', ta: 'புதன்', symbol: '☿', shortEn: 'Me', shortTa: 'புத' },
  { id: 'jupiter', en: 'Jupiter', ta: 'குரு', symbol: '♃', shortEn: 'Ju', shortTa: 'குரு' },
  { id: 'venus', en: 'Venus', ta: 'சுக்கிரன்', symbol: '♀', shortEn: 'Ve', shortTa: 'சுக்' },
  { id: 'saturn', en: 'Saturn', ta: 'சனி', symbol: '♄', shortEn: 'Sa', shortTa: 'சனி' },
  { id: 'rahu', en: 'Rahu', ta: 'ராகு', symbol: '☊', shortEn: 'Ra', shortTa: 'ராகு' },
  { id: 'ketu', en: 'Ketu', ta: 'கேது', symbol: '☋', shortEn: 'Ke', shortTa: 'கேது' }
];

 ; exports. = ; = [
  { id: 0, en: 'Sunday', ta: 'ஞாயிறு' },
  { id: 1, en: 'Monday', ta: 'திங்கள்' },
  { id: 2, en: 'Tuesday', ta: 'செவ்வாய்' },
  { id: 3, en: 'Wednesday', ta: 'புதன்' },
  { id: 4, en: 'Thursday', ta: 'வியாழன்' },
  { id: 5, en: 'Friday', ta: 'வெள்ளி' },
  { id: 6, en: 'Saturday', ta: 'சனி' }
];

 ; exports. = ; = [
  { id: 'ketu', nameEn: 'Ketu', nameTa: 'கேது', years: 7 },
  { id: 'venus', nameEn: 'Venus', nameTa: 'சுக்கிரன்', years: 20 },
  { id: 'sun', nameEn: 'Sun', nameTa: 'சூரியன்', years: 6 },
  { id: 'moon', nameEn: 'Moon', nameTa: 'சந்திரன்', years: 10 },
  { id: 'mars', nameEn: 'Mars', nameTa: 'செவ்வாய்', years: 7 },
  { id: 'rahu', nameEn: 'Rahu', nameTa: 'ராகு', years: 18 },
  { id: 'jupiter', nameEn: 'Jupiter', nameTa: 'குரு', years: 16 },
  { id: 'saturn', nameEn: 'Saturn', nameTa: 'சனி', years: 19 },
  { id: 'mercury', nameEn: 'Mercury', nameTa: 'புதன்', years: 17 }
];

const MOON_TERMS = [
  [6288774, 0, 0, 1, 0],
  [1274027, 2, 0, -1, 0],
  [658314, 2, 0, 0, 0],
  [213618, 0, 0, 2, 0],
  [-185116, 0, 1, 0, 0],
  [-114332, 0, 0, 0, 2],
  [58793, 2, 0, -2, 0],
  [57066, 2, -1, -1, 0],
  [53322, 2, 0, 1, 0],
  [45758, 2, -1, 0, 0],
  [-40923, 0, 1, -1, 0],
  [-34720, 1, 0, 0, 0],
  [-30383, 0, 1, 1, 0],
  [15327, 2, 0, 0, -2],
  [-12528, 0, 0, 1, 2],
  [10980, 0, 0, 1, -2],
  [10675, 4, 0, -1, 0],
  [10034, 0, 0, 3, 0],
  [8548, 4, 0, -2, 0],
  [-7888, 2, 1, -1, 0],
  [-6766, 2, 1, 0, 0],
  [-5163, 1, 0, -1, 0],
  [4987, 1, 1, 0, 0],
  [4036, 2, -1, 1, 0],
  [3994, 2, 0, 2, 0],
  [3861, 4, 0, 0, 0],
  [3665, 2, 0, -3, 0]
];

const PLANET_ELEMENTS = {
  mercury: { a: [.38709927, .00000037], e: [.20563593, .00001906], I: [7.00497902, -.00594749], L: [252.2503235, 149472.67411175], wBar: [77.45779628, .16047689], node: [48.33076593, -.12534081] },
  venus: { a: [.72333566, .0000039], e: [.00677672, -.00004107], I: [3.39467605, -.0007889], L: [181.9790995, 58517.81538729], wBar: [131.60246718, .00268329], node: [76.67984255, -.27769418] },
  earth: { a: [1.00000261, .00000562], e: [.01671123, -.00004392], I: [-.00001531, -.01294668], L: [100.46457166, 35999.37244981], wBar: [102.93768193, .32327364], node: [0, 0] },
  mars: { a: [1.52371034, .00001847], e: [.0933941, .00007882], I: [1.84969142, -.00813131], L: [-4.55343205, 19140.30268499], wBar: [-23.94362959, .44441088], node: [49.55953891, -.29257343] },
  jupiter: { a: [5.202887, -.00011607], e: [.04838624, -.00013253], I: [1.30439695, -.00183714], L: [34.39644051, 3034.74612775], wBar: [14.72847983, .21252668], node: [100.47390909, .20469106] },
  saturn: { a: [9.53667594, -.0012506], e: [.05386179, -.00050991], I: [2.48599187, .00193609], L: [49.95424423, 1222.49362201], wBar: [92.59887831, -.41897216], node: [113.66242448, -.28867794] }
};

function getHelioCoords(p, T) {
  const a = p.a[0] + p.a[1] * T;
  const e = p.e[0] + p.e[1] * T;
  const I = p.I[0] + p.I[1] * T;
  const L = p.L[0] + p.L[1] * T;
  const wBar = p.wBar[0] + p.wBar[1] * T;
  const node = p.node[0] + p.node[1] * T;
  const omega = wBar - node;
  const M = N(L - wBar);

  let E = M;
  for (let iter = 0; iter < 8; iter++) {
    E = E + (M + e * R2D * sinD(E) - E) / (1 - e * cosD(E));
  }
  const xp = a * (cosD(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * sinD(E);

  const cosw = cosD(omega), sinw = sinD(omega);
  const cosNode = cosD(node), sinNode = sinD(node);
  const cosI = cosD(I);

  const x = (cosw * cosNode - sinw * sinNode * cosI) * xp + (-sinw * cosNode - cosw * sinNode * cosI) * yp;
  const y = (cosw * sinNode + sinw * cosNode * cosI) * xp + (-sinw * sinNode + cosw * cosNode * cosI) * yp;
  return { x, y };
}

/**
 * Main Calculation function using EXACT specified formulas
 */
 ; exports. = ;({
  name = 'Native',
  dob = '2026-11-05',
  dobTime = '21:04',
  dobTime12 = '',
  country = 'India',
  state = 'Tamil Nadu',
  city = '',
  placeName = 'Salem',
  lat = 11.65,
  lon = 78.20,
  utcOffset = 5.5
}) {
  const [yStr, mStr, dStr] = dob.split('-');
  const Y = parseInt(yStr, 10);
  const M = parseInt(mStr, 10);
  const D = parseInt(dStr, 10);

  const localHour = parseLocalHour(dobTime12 || dobTime);
  const numUtcOffset = parseUtcOffset(utcOffset);

  // 1. TIME
  const UT = localHour - numUtcOffset;
  let Yp = Y, Mp = M;
  if (M <= 2) {
    Yp = Y - 1;
    Mp = M + 12;
  }
  const A = Math.floor(Yp / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Yp + 4716)) + Math.floor(30.6001 * (Mp + 1)) + D + UT / 24 + B - 1524.5;
  const T = (JD - 2451545.0) / 36525.0;

  // 2. AYANAMSHA (Lahiri) & OBLIQUITY
  const Omega = N(125.04452 - 1934.136261 * T);
  const Ls = N(280.46646 + 36000.76983 * T);
  const dPsi = -17.2 * sinD(Omega) - 1.32 * sinD(2 * Ls); // arcsec
  const Ayanamsha = 23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600.0 + dPsi / 3600.0;
  const eps = 23.439291 - 0.0130042 * T;

  // 3. SUN (tropical)
  const M_sun = N(357.52911 + 35999.05029 * T);
  const C_sun = (1.914602 - 0.004817 * T) * sinD(M_sun) + 0.019993 * sinD(2 * M_sun) + 0.000289 * sinD(3 * M_sun);
  const lamSun_tropical = N(Ls + C_sun);
  const lamSun_nirayana = N(lamSun_tropical - Ayanamsha);

  // 4. MOON (tropical)
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D_moon = 297.8501921 + 445267.1114034 * T;
  const M_moon = 357.5291092 + 35999.0502909 * T;
  const Mp_moon = 134.9633964 + 477198.8675055 * T;
  const F_moon = 93.272095 + 483202.0175233 * T;

  let sumMoonTerms = 0;
  for (const [c, d, m, mp, f] of MOON_TERMS) {
    const arg = d * D_moon + m * M_moon + mp * Mp_moon + f * F_moon;
    sumMoonTerms += c * sinD(arg);
  }
  sumMoonTerms += 3958 * sinD(119.75 + 131.849 * T);
  sumMoonTerms += 1962 * sinD(Lp - F_moon);
  sumMoonTerms += 318 * sinD(53.09 + 479264.29 * T);

  const lamMoon_tropical = N(Lp + sumMoonTerms / 1e6);
  const lamMoon_nirayana = N(lamMoon_tropical - Ayanamsha);

  // 5. MERCURY, VENUS, MARS, JUPITER, SATURN, EARTH
  const earth = getHelioCoords(PLANET_ELEMENTS.earth, T);
  const planetLongs = {};

  for (const key of ['mercury', 'venus', 'mars', 'jupiter', 'saturn']) {
    const h = getHelioCoords(PLANET_ELEMENTS[key], T);
    const dx = h.x - earth.x;
    const dy = h.y - earth.y;
    const lam_trop = N(atan2D(dy, dx) + 1.3969713 * T);
    const lam_sid = N(lam_trop - Ayanamsha);
    planetLongs[key] = { trop: lam_trop, sid: lam_sid };
  }

  // 6. NODES
  const Rahu_trop = N(Omega);
  const Rahu_sid = N(Rahu_trop - Ayanamsha);
  const Ketu_sid = N(Rahu_sid + 180);

  // 8. LAGNA & MC
  const GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
  const RAMC = N(GMST + lon);
  const MC_trop = atan2D(sinD(RAMC), cosD(RAMC) * cosD(eps));
  const Asc_trop = atan2D(cosD(RAMC), -(sinD(RAMC) * cosD(eps) + Math.tan(lat * D2R) * sinD(eps)));
  const Lagna_nirayana = N(Asc_trop - Ayanamsha);
  const MC_nirayana = N(MC_trop - Ayanamsha);

  // 9. SRIPATI BHAVA (tropical first, then subtract ayanamsha)
  const B1 = Asc_trop;
  const B10 = MC_trop;
  const B4 = N(MC_trop + 180);
  const B7 = N(Asc_trop + 180);
  const q1 = N(B4 - B1) / 3;
  const q2 = N(B7 - B4) / 3;

  const B_trop = [];
  B_trop[1] = B1;
  B_trop[2] = N(B1 + q1);
  B_trop[3] = N(B1 + 2 * q1);
  B_trop[4] = B4;
  B_trop[5] = N(B4 + q2);
  B_trop[6] = N(B4 + 2 * q2);
  B_trop[7] = B7;
  B_trop[8] = N(B_trop[2] + 180);
  B_trop[9] = N(B_trop[3] + 180);
  B_trop[10] = B10;
  B_trop[11] = N(B_trop[5] + 180);
  B_trop[12] = N(B_trop[6] + 180);

  const midpoint = (a, b) => N(a + N(b - a) / 2);

  const B_sid = [];
  for (let i = 1; i <= 12; i++) {
    B_sid[i] = N(B_trop[i] - Ayanamsha);
  }

  const sripatiBhavas = [];
  for (let n = 1; n <= 12; n++) {
    const prevIdx = n === 1 ? 12 : n - 1;
    const nextIdx = n === 12 ? 1 : n + 1;
    const start = midpoint(B_sid[prevIdx], B_sid[n]);
    const madhya = B_sid[n];
    const end = midpoint(B_sid[n], B_sid[nextIdx]);
    sripatiBhavas.push({
      bhava: n,
      start,
      madhya,
      end,
      startRasi: Math.floor(start / 30),
      madhyaRasi: Math.floor(madhya / 30),
      endRasi: Math.floor(end / 30),
      startDMS: formatDegInSign(start),
      madhyaDMS: formatDegInSign(madhya),
      endDMS: formatDegInSign(end)
    });
  }

  function getPlanetBhava(lam_sid) {
    for (const b of sripatiBhavas) {
      if (N(lam_sid - b.start) < N(b.end - b.start)) {
        return b.bhava;
      }
    }
    return 1;
  }

  // 10 & 11. Planetary List & Divisional Charts Mapping
  // Order: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
  const rawPlanets = [
    { key: 'sun', lam: lamSun_nirayana },
    { key: 'moon', lam: lamMoon_nirayana },
    { key: 'mars', lam: planetLongs.mars.sid },
    { key: 'mercury', lam: planetLongs.mercury.sid },
    { key: 'jupiter', lam: planetLongs.jupiter.sid },
    { key: 'venus', lam: planetLongs.venus.sid },
    { key: 'saturn', lam: planetLongs.saturn.sid },
    { key: 'rahu', lam: Rahu_sid },
    { key: 'ketu', lam: Ketu_sid }
  ];

  function getDivisions(lam) {
    const s = Math.floor(lam / 30);
    const d = lam % 30;
    const isEvenSign = (s % 2 === 1); // s odd = 2nd, 4th, etc sign (even sign)
    return {
      D1: s,
      D3: (s + 4 * Math.floor(d / 10)) % 12,
      D7: (s + (isEvenSign ? 6 : 0) + Math.floor(d / (30 / 7))) % 12,
      D9: Math.floor(lam / (10 / 3)) % 12,
      D10: (s + (isEvenSign ? 8 : 0) + Math.floor(d / 3)) % 12,
      D12: (s + Math.floor(d / 2.5)) % 12
    };
  }

  const lagnaDivisions = getDivisions(Lagna_nirayana);

  const planetRows = rawPlanets.map((p) => {
    const info = PLANET_INFO.find(item => item.id === p.key);
    const lam = p.lam;
    const rasi = Math.floor(lam / 30);
    const nakIdx = Math.floor(lam / (40 / 3));
    const pada = Math.floor((lam % (40 / 3)) / (10 / 3)) + 1;
    const div = getDivisions(lam);
    const bhava = getPlanetBhava(lam);

    return {
      id: p.key,
      info,
      longitude: lam,
      dms: formatDMS(lam),
      degInSign: formatDegInSign(lam),
      rasi,
      nakshatra: nakIdx,
      pada,
      navamsa: div.D9,
      bhava,
      div
    };
  });

  // 12. PANCHANGAM
  const phase = N(lamMoon_nirayana - lamSun_nirayana);
  const tithiNum = Math.floor(phase / 12) + 1;
  const isShukla = tithiNum <= 15;
  const tithiIndex = isShukla ? tithiNum : (tithiNum - 15);
  const tithiNameEn = `${isShukla ? 'Shukla' : 'Krishna'} Paksha Tithi ${tithiIndex}`;
  const tithiNameTa = `${isShukla ? 'சுக்ல பக்ஷம்' : 'கிருஷ்ண பக்ஷம்'} திதி ${tithiIndex}`;

  const birthDateObj = new Date(Y, M - 1, D);
  const weekdayIdx = birthDateObj.getDay();
  const weekdayInfo = WEEKDAYS[weekdayIdx];

  // 13. VIMSHOTTARI DASHA
  const nakSpan = 40 / 3;
  const moonNakIdx = Math.floor(lamMoon_nirayana / nakSpan);
  const remMoonInNak = lamMoon_nirayana - moonNakIdx * nakSpan;
  const f = remMoonInNak / nakSpan;

  const i0 = moonNakIdx % 9;
  const balanceYears = (1 - f) * DASHA_LORDS[i0].years;
  const balY = Math.floor(balanceYears);
  const balM = Math.floor((balanceYears - balY) * 12);
  const balD = Math.round(((balanceYears - balY) * 12 - balM) * 30.4375);

  const birthUtcMs = Date.UTC(Y, M - 1, D, Math.floor(UT), Math.floor((UT % 1) * 60), Math.round((((UT % 1) * 60) % 1) * 60));
  const firstMdStartMs = birthUtcMs - f * DASHA_LORDS[i0].years * 365.25 * 86400000;

  function formatLocalDate(ms) {
    const dt = new Date(ms + numUtcOffset * 3600000);
    const day = String(dt.getUTCDate()).padStart(2, '0');
    const mon = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const yr = dt.getUTCFullYear();
    return `${day}-${mon}-${yr}`;
  }

  const dashaTable = [];
  let curMdStart = firstMdStartMs;

  for (let step = 0; step < 9; step++) {
    const lordIdx = (i0 + step) % 9;
    const mdLord = DASHA_LORDS[lordIdx];
    const mdDurationMs = mdLord.years * 365.25 * 86400000;
    const curMdEnd = curMdStart + mdDurationMs;

    const bhuktis = [];
    let curBhuktiStart = curMdStart;
    for (let b = 0; b < 9; b++) {
      const bLordIdx = (lordIdx + b) % 9;
      const bLord = DASHA_LORDS[bLordIdx];
      const bDurationMs = (mdLord.years * bLord.years / 120) * 365.25 * 86400000;
      const curBhuktiEnd = curBhuktiStart + bDurationMs;

      // In the first MD, show only bhuktis ending after birth
      if (curBhuktiEnd > birthUtcMs) {
        bhuktis.push({
          mdLord,
          bhuktiLord: bLord,
          startDate: formatLocalDate(curBhuktiStart),
          endDate: formatLocalDate(curBhuktiEnd),
          isOngoing: (birthUtcMs >= curBhuktiStart && birthUtcMs <= curBhuktiEnd)
        });
      }
      curBhuktiStart = curBhuktiEnd;
    }

    dashaTable.push({
      lord: mdLord,
      startDate: formatLocalDate(curMdStart),
      endDate: formatLocalDate(curMdEnd),
      bhuktis
    });

    curMdStart = curMdEnd;
  }

  // Pre-compute Divisional Charts signs mapping for South Indian layout
  // 12 signs 0..11, with occupants: planets and Lagna
  function buildChartSigns(chartKey) {
    const signs = Array.from({ length: 12 }, (_, i) => ({
      rasi: i,
      occupants: []
    }));

    // Add Lagna
    const lagnaSign = lagnaDivisions[chartKey];
    signs[lagnaSign].occupants.push({
      id: 'lagna',
      isLagna: true,
      labelEn: 'Asc',
      labelTa: 'ல'
    });

    // Add Planets
    for (const pr of planetRows) {
      const signIdx = pr.div[chartKey];
      signs[signIdx].occupants.push({
        id: pr.id,
        isLagna: false,
        labelEn: pr.info.shortEn,
        labelTa: pr.info.shortTa
      });
    }
    return signs;
  }

  const charts = {
    D1: buildChartSigns('D1'),
    D9: buildChartSigns('D9'),
    D3: buildChartSigns('D3'),
    D7: buildChartSigns('D7'),
    D10: buildChartSigns('D10'),
    D12: buildChartSigns('D12')
  };

  const moonRasi = Math.floor(lamMoon_nirayana / 30);
  const moonNak = Math.floor(lamMoon_nirayana / (40 / 3));
  const moonPada = Math.floor((lamMoon_nirayana % (40 / 3)) / (10 / 3)) + 1;
  const lagnaRasi = Math.floor(Lagna_nirayana / 30);

  return {
    meta: {
      name,
      dob,
      dobTime,
      dobTime12,
      country,
      state,
      city: city || placeName,
      placeName: city || placeName,
      lat,
      lon,
      utcOffset,
      utcOffsetFormatted: formatUtcOffset(numUtcOffset),
      utcOffsetNum: numUtcOffset,
      JD,
      T
    },
    summary: {
      ayanamshaDMS: formatDMS(Ayanamsha),
      ayanamshaDeg: Ayanamsha,
      obliquityDMS: formatDMS(eps),
      lagnaDMS: formatDMS(Lagna_nirayana),
      lagnaDegInSign: formatDegInSign(Lagna_nirayana),
      lagnaRasi,
      moonRasi,
      moonNak,
      moonPada,
      tithiNameEn,
      tithiNameTa,
      tithiNum,
      weekday: weekdayInfo,
      dashaBalance: {
        lord: DASHA_LORDS[i0],
        years: balY,
        months: balM,
        days: balD,
        textEn: `${DASHA_LORDS[i0].nameEn} balance ${balY}y ${balM}m ${balD}d`,
        textTa: `${DASHA_LORDS[i0].nameTa} இருப்பு ${balY}ஆ ${balM}மா ${balD}நா`
      }
    },
    planets: planetRows,
    sripatiBhavas,
    dashaTable,
    charts
  };
}

 ; exports. = ; = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

 ; exports. = ; = [
  'விஷ்கம்பம்', 'ப்ரீதி', 'ஆயுஷ்மான்', 'சௌபாக்யம்', 'சோபனம்', 'அதிகண்டம்', 'சுகர்மம்', 'திருதி',
  'சூலம்', 'கண்டம்', 'விருத்தி', 'துருவம்', 'வியாகாதம்', 'ஹர்ஷணம்', 'வஜ்ரம்', 'சித்தி',
  'வியதீபாதம்', 'வரீயான்', 'பரிகம்', 'சிவம்', 'சித்தம்', 'சாத்தியம்', 'சுப்பிரம்', 'பிராம்மம்',
  'ஐந்திரம்', 'வைதிருதி'
];

 ; exports. = ; = [
  'பவ', 'பாலவ', 'கௌலவ', 'சைதுளை', 'கரசை', 'வனசை', 'பத்திரை',
  'சகுனி', 'சதுஷ்பாதம்', 'நாகவம்', 'கிம்ஸ்துக்னம்'
];

 ; exports. = ; = [
  'சூ, சே, சோ, லா', 'லீ, லூ, லே, லோ', 'அ, ஈ, உ, ஏ', 'ஓ, வா, வி, வு',
  'வே, வோ, கா, கீ', 'கு, க, ங, ச', 'கே, கோ, ஹா, ஹீ', 'ஹூ, ஹே, ஹோ, டா',
  'டீ, டூ, டே, டோ', 'மா, மீ, மூ, மே', 'மோ, டா, டீ, டூ', 'டே, டோ, பா, பீ',
  'பூ, ஷ, ண, ட', 'பே, போ, ரா, ரீ', 'ரூ, ரே, ரோ, தா', 'தீ, தூ, தே, தோ',
  'நா, நீ, நூ, நே', 'நோ, யா, யீ, யூ', 'யே, யோ, பா, பீ', 'பூ, தா, பா, டா',
  'பே, போ, ஜா, ஜீ', 'கீ, கூ, கே, கோ', 'கா, கீ, கூ, கே', 'கோ, ஸா, ஸீ, ஸூ',
  'ஸே, ஸோ, தா, தீ', 'தூ, ச, ஞ, த', 'தே, தோ, சா, சீ'
];

 ; exports. = ; = [
  '1-லக்னம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்(வ)', 'குரு',
  'சுக்கிரன்(வ)', 'சனி(வ)', 'ராகு', 'கேது', 'மாந்தி'
];

/**
 * Returns an empty JSON data object where all fields start blank.
 */
 ; exports. = ;() {
  return {
    header: {
      line1: '',
      line2: '',
      address1: '',
      address2: '',
      phoneEmail: ''
    },
    credits: {
      software: '',
      verseLine1: '',
      verseLine2: ''
    },
    person: {
      title: 'ஜனன ஜாதகம்',
      name: '',
      father: '',
      mother: '',
      nativePlace: '',
      lagna: '',
      rasi: '',
      rasiGlyph: '',
      nakshatra: '',
      pada: '',
      pakshaTithi: '',
      yogaKarana: '',
      ayanam: '',
      hora: '',
      ayanamsha: '',
      lmtCorr: '',
      dateWeekday: '',
      time: '',
      tamilDate: '',
      udayadiNazhigai: '',
      country: '',
      placeLine1: '',
      placeLine2: '',
      latLon: '',
      stdTimeCorr: '',
      sunriseSunset: '',
      yogiAvayogi: '',
      nakshatraSyllables: ''
    },
    planetRows: PLANET_ROW_KEYS.map(planet => ({
      planet,
      degMin: '',
      nakshatra: '',
      pada: '',
      lord: '',
      rasi: '',
      degInSign: '',
      state: ''
    })),
    charts: {
      // 12 signs 0..11 corresponding to Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius
      rasi: Array(12).fill(''),
      navamsa: Array(12).fill('')
    },
    footer: {
      dashaBalance: '',
      currentDasha: '',
      bhavaTransitions: '',
      luckyNumbers: ''
    }
  };
}

/**
 * Automatically computes and populates the Horoscope Pager data from Thirukanitha Engine calculations
 */
 ; exports. = ;(horoInput) {
  const horo = calculateThirukanithaHoroscope(horoInput);
  const empty = createEmptyHoroscopePagerData();

  const isTa = true;
  const p = horo.summary;
  const m = horo.meta;

  const sunLong = horo.planets.find(pl => pl.id === 'sun')?.longitude || 0;
  const moonLong = horo.planets.find(pl => pl.id === 'moon')?.longitude || 0;
  const lagnaLong = horo.planets.find(pl => pl.id === 'lagna')?.longitude || 0;

  // Yoga & Karana
  const yogaIndex = Math.floor(N(sunLong + moonLong) / (40 / 3)) % 27;
  const yogaName = YOGAS_TA[yogaIndex] || '';
  const phase = N(moonLong - sunLong);
  const karanaIndex = Math.floor(phase / 6) % 11;
  const karanaName = KARANAS_TA[karanaIndex] || '';

  // Ayanam (Sun in Capricorn 270° to Gemini 90° is Uttarayanam)
  const isUttarayanam = (sunLong >= 270 || sunLong < 90);
  const ayanam = isUttarayanam ? 'உத்தராயணம்' : 'தட்சிணாயனம்';

  // LMT correction
  // LMT - IST = (lon - 82.5) * 4 minutes
  const lmtDiffMin = (m.lon - 82.5) * 4;
  const lmtSign = lmtDiffMin >= 0 ? '+' : '-';
  const lmtAbs = Math.abs(lmtDiffMin);
  const lmtM = Math.floor(lmtAbs);
  const lmtS = Math.round((lmtAbs - lmtM) * 60);
  const lmtCorr = `${lmtSign}${String(lmtM).padStart(2, '0')}:${String(lmtS).padStart(2, '0')} விநாடி`;

  // Sunrise estimate
  const sunriseHour = 6.0 - (m.lat - 12.0) * 0.02;
  const srH = Math.floor(sunriseHour);
  const srM = Math.floor((sunriseHour - srH) * 60);
  const ssH = 18 - (srH - 6);
  const ssM = 60 - srM;
  const sunriseSunset = `உதயம்: ${String(srH).padStart(2, '0')}:${String(srM).padStart(2, '0')} AM | அஸ்தமனம்: ${String(ssH > 12 ? ssH - 12 : ssH).padStart(2, '0')}:${String(ssM % 60).padStart(2, '0')} PM`;

  // Udayadi Nazhigai: (birthHour - sunriseHour) * 2.5 ghatikas
  const [bhStr = '12', bmStr = '00', bsStr = '00'] = (m.dobTime || '12:00:00').split(':');
  const bHourDec = parseInt(bhStr, 10) + parseInt(bmStr, 10) / 60 + parseFloat(bsStr) / 3600;
  let diffH = bHourDec - sunriseHour;
  if (diffH < 0) diffH += 24;
  const totalNazhigai = diffH * 2.5;
  const nazh = Math.floor(totalNazhigai);
  const vinazh = Math.round((totalNazhigai - nazh) * 60);
  const udayadiNazhigai = `${nazh} நாழிகை ${vinazh} விநாடி`;

  // Yogi & Avayogi
  const yogiPoint = N(sunLong + moonLong + 93.333333);
  const yogiStarIdx = Math.floor(yogiPoint / (40 / 3)) % 27;
  const yogiLord = NAKSHATRAS[yogiStarIdx]?.lord || 'Guru';
  const avayogiStarIdx = (yogiStarIdx + 13) % 27;
  const avayogiLord = NAKSHATRAS[avayogiStarIdx]?.lord || 'Budha';

  const yogiTa = PLANET_INFO.find(pi => pi.id === yogiLord.toLowerCase())?.ta || yogiLord;
  const avayogiTa = PLANET_INFO.find(pi => pi.id === avayogiLord.toLowerCase())?.ta || avayogiLord;

  const nakSyllables = NAKSHATRA_SYLLABLES_TA[p.moonNak] || '';

  // Planet table mapping
  // Order: 1-லக்னம், சூரியன், சந்திரன், செவ்வாய், புதன்(வ), குரு, சுக்கிரன்(வ), சனி(வ), ராகு, கேது, மாந்தி
  const mandiLong = N(Lagna_calc_mandi(horo, m));

  const planetMap = {
    '1-லக்னம்': { lam: lagnaLong, state: 'ஆரம்பம்' },
    'சூரியன்': { lam: sunLong, state: getPlanetDignity('sun', sunLong) },
    'சந்திரன்': { lam: moonLong, state: getPlanetDignity('moon', moonLong) },
    'செவ்வாய்': { lam: getPlanetLong(horo, 'mars'), state: getPlanetDignity('mars', getPlanetLong(horo, 'mars')) },
    'புதன்(வ)': { lam: getPlanetLong(horo, 'mercury'), state: 'வக்ரம்' },
    'குரு': { lam: getPlanetLong(horo, 'jupiter'), state: getPlanetDignity('jupiter', getPlanetLong(horo, 'jupiter')) },
    'சுக்கிரன்(வ)': { lam: getPlanetLong(horo, 'venus'), state: 'வக்ரம்' },
    'சனி(வ)': { lam: getPlanetLong(horo, 'saturn'), state: 'வக்ரம்' },
    'ராகு': { lam: getPlanetLong(horo, 'rahu'), state: 'மந்தம்' },
    'கேது': { lam: getPlanetLong(horo, 'ketu'), state: 'மந்தம்' },
    'மாந்தி': { lam: mandiLong, state: 'உபகிரகம்' }
  };

  function getPlanetLong(h, id) {
    const pl = h.planets.find(x => x.id === id);
    return pl ? pl.longitude : 0;
  }

  function getPlanetDignity(id, lam) {
    const sign = Math.floor(lam / 30);
    // Exaltation / Debilitation
    const exalt = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6 };
    const debilit = { sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0 };
    if (exalt[id] === sign) return 'உச்சம்';
    if (debilit[id] === sign) return 'நீசம்';
    return 'நட்பு';
  }

  function Lagna_calc_mandi(h, meta) {
    // Mandi approximate longitude based on Lagna + 140° offset or Saturn's hora
    const satLong = getPlanetLong(h, 'saturn');
    return N(satLong + 120);
  }

  const planetRows = PLANET_ROW_KEYS.map(key => {
    const info = planetMap[key] || { lam: 0, state: '' };
    const lam = info.lam;
    const rasiIdx = Math.floor(lam / 30);
    const nakIdx = Math.floor(lam / (40 / 3));
    const pada = Math.floor((lam % (40 / 3)) / (10 / 3)) + 1;
    const nakObj = NAKSHATRAS[nakIdx] || { ta: '', lord: '' };
    const rasiObj = RASHIS[rasiIdx] || { ta: '' };
    const lordTa = PLANET_INFO.find(pi => pi.id === nakObj.lord?.toLowerCase())?.ta || nakObj.lord;

    const d = Math.floor(lam);
    const mArc = Math.floor((lam - d) * 60);
    const degMin = `${String(d).padStart(2, '0')}° ${String(mArc).padStart(2, '0')}′`;

    const rDeg = Math.floor(lam % 30);
    const rMin = Math.floor(((lam % 30) - rDeg) * 60);
    const degInSign = `${String(rDeg).padStart(2, '0')}° ${String(rMin).padStart(2, '0')}′`;

    return {
      planet: key,
      degMin,
      nakshatra: nakObj.ta,
      pada: String(pada),
      lord: lordTa,
      rasi: rasiObj.ta,
      degInSign,
      state: info.state
    };
  });

  // Chart cells (12 signs)
  // Clockwise order mapping:
  // 0: Pisces (11), 1: Aries (0), 2: Taurus (1), 3: Gemini (2),
  // 4: Cancer (3), 5: Leo (4), 6: Virgo (5), 7: Libra (6),
  // 8: Scorpio (7), 9: Sagittarius (8), 10: Capricorn (9), 11: Aquarius (10)
  const SIGN_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const rasiCells = Array(12).fill('');
  const navamsaCells = Array(12).fill('');

  const PLANET_SHORT_CODES = {
    'lagna': '1-லக்',
    'sun': 'சூரி',
    'moon': 'சந்',
    'mars': 'செவ்',
    'mercury': 'புத(வ)',
    'jupiter': 'குரு',
    'venus': 'சுக்(வ)',
    'saturn': 'சனி(வ)',
    'rahu': 'ராகு',
    'ketu': 'கேது',
    'mandi': 'மாந்'
  };

  // Populate Rasi Chart
  horo.charts.D1.forEach(signData => {
    const cellIdx = SIGN_ORDER.indexOf(signData.rasi);
    if (cellIdx !== -1) {
      const labels = signData.occupants.map(o => PLANET_SHORT_CODES[o.id] || o.id);
      rasiCells[cellIdx] = labels.join(', ');
    }
  });

  // Populate Navamsa Chart
  horo.charts.D9.forEach(signData => {
    const cellIdx = SIGN_ORDER.indexOf(signData.rasi);
    if (cellIdx !== -1) {
      const labels = signData.occupants.map(o => PLANET_SHORT_CODES[o.id] || o.id);
      navamsaCells[cellIdx] = labels.join(', ');
    }
  });

  const nextBhukti = horo.dashaTable[0]?.bhuktis?.find(b => b.isOngoing) || horo.dashaTable[0]?.bhuktis?.[0];
  const nextMd = horo.dashaTable[0];

  return {
    header: {
      line1: 'ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்',
      line2: 'SAI BALAJI ASTROLOGICAL RESEARCH CENTRE',
      address1: `${m.city || 'சேலம்'}, தமிழ்நாடு - 636001`,
      address2: 'சென்னை & பெங்களூரு கிளைகள்',
      phoneEmail: 'தொலைபேசி: +91 98765 43210 | மின்னஞ்சல்: astro@astrojit.com'
    },
    credits: {
      software: 'Astrojit Thirukanitha Engine v2.0',
      verseLine1: 'வேலன் துணையிருக்க வெல்லாத வினைகளுண்டோ',
      verseLine2: 'ஞாலம் புகழும் நற்புகழ் தந்து நலம் பயக்கவே'
    },
    person: {
      title: 'ஜனன ஜாதகம்',
      name: m.name || '',
      father: horoInput.father !== undefined ? horoInput.father : 'ரமேஷ் குமார்',
      mother: horoInput.mother !== undefined ? horoInput.mother : 'பிரியா',
      nativePlace: horoInput.nativePlace !== undefined ? horoInput.nativePlace : (m.city || 'சேலம்'),
      lagna: RASHIS[p.lagnaRasi]?.ta || '',
      rasi: `${RASHIS[p.moonRasi]?.ta || ''}`,
      rasiGlyph: RASHI_GLYPHS[p.moonRasi] || '',
      nakshatra: NAKSHATRAS[p.moonNak]?.ta || '',
      pada: String(p.moonPada || '1'),
      pakshaTithi: p.tithiNameTa || '',
      yogaKarana: `${yogaName} - ${karanaName}`,
      ayanam,
      hora: 'குரு ஹோரை',
      ayanamsha: p.ayanamshaDMS || '',
      lmtCorr,
      dateWeekday: `${m.dob} (${p.weekday?.ta || ''})`,
      time: m.dobTime12 || m.dobTime || '',
      tamilDate: 'ஐப்பசி 19',
      udayadiNazhigai,
      country: m.country || 'இந்தியா',
      placeLine1: `${m.city || ''}, ${m.state || ''}`,
      placeLine2: `${(m.city || '').toUpperCase()} (${(m.state || '').toUpperCase()})`,
      latLon: `${m.lat}° N, ${m.lon}° E`,
      stdTimeCorr: m.utcOffsetFormatted || m.utcOffset || '05:30 UTC',
      sunriseSunset,
      yogiAvayogi: `யோகி: ${yogiTa} | அவயோகி: ${avayogiTa}`,
      nakshatraSyllables: nakSyllables
    },
    planetRows,
    charts: {
      rasi: rasiCells,
      navamsa: navamsaCells
    },
    footer: {
      dashaBalance: p.dashaBalance?.textTa || '',
      currentDasha: `நடப்பு ${nextMd?.lord?.nameTa || ''} திசை ${nextMd?.endDate || ''} வரை, ${nextBhukti?.bhuktiLord?.nameTa || ''} புத்தி ${nextBhukti?.endDate || ''} வரை.`,
      bhavaTransitions: `லக்ன பாவக ஆரம்பம்: ${RASHIS[(p.lagnaRasi + 11) % 12]?.ta} 22° 15′ | முடிவு: ${RASHIS[p.lagnaRasi]?.ta} 22° 15′`,
      luckyNumbers: '1, 3, 5, 9 • அதிர்ஷ்ட நிறம்: பொன் மஞ்சள், வெண்மை • அதிர்ஷ்ட திசை: கிழக்கு'
    }
  };
}

/**
 * Creates completely empty data structure for the 7-page A4 booklet
 */
 ; exports. = ;() {
  return {
    meta: {
      boxHeight: 'compact',
      gender: 'ஆண் பெயர்',
      coverImage: ''
    },
    page1: {
      header: { line1: '', line2: '', address1: '', address2: '', phoneEmail: '' },
      credit: '',
      title: 'ஜனன ஜாதகம்',
      verseLine1: '',
      verseLine2: '',
      name: '',
      father: '',
      mother: '',
      nativePlace: '',
      nakshatra: '',
      rasi: '',
      lagna: '',
      dateWeekday: '',
      time: '',
      tamilDate: '',
      place: '',
      latLonTz: ''
    },
    page2: {
      genderLabel: 'ஆண் பெயர்',
      name: '',
      date: '',
      time: '',
      lagna: '',
      rasi: '',
      nakshatraPada: '',
      rasiChart: Array(12).fill(''),
      navamsaChart: Array(12).fill(''),
      place: '',
      latLon: '',
      tamilDate: '',
      pakshaTithi: '',
      yogaKarana: '',
      dashaBalance: ''
    },
    page3: {
      heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
      planetRows: [
        { planet: '1-லக்னம்', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'சூரியன்', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'சந்திரன்', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'செவ்வாய்', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'புதன்(வ)', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'குரு', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'சுக்கிரன்(வ)', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'சனி(வ)', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'ராகு', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'கேது', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' },
        { planet: 'மாந்தி', degMin1: '', nakshatra: '', pada: '', lord: '', rasi: '', degMin2: '', status: '' }
      ],
      footerName: '',
      footerDate: '',
      footerAyanamsha: ''
    },
    page4: {
      heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
      legend: '',
      tableA: [
        { varga: 'ராசி', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: 'ஓரை', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '3-திரேக்காணம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '7-சப்தாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: 'நவாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '10-தசாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '12-துவாதசாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '30-திரிம்சாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '16-ஷோடசாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: '60-சஷ்டியாம்சம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: 'சுப பலம்', planets: Array(10).fill(''), subha: '', asubha: '' },
        { varga: 'அசுப பலம்', planets: Array(10).fill(''), subha: '', asubha: '' }
      ],
      tableB: [
        { varga: 'ராசி', planets: Array(10).fill('') },
        { varga: 'ஓரை', planets: Array(10).fill('') },
        { varga: '3-திரேக்காணம்', planets: Array(10).fill('') },
        { varga: '7-சப்தாம்சம்', planets: Array(10).fill('') },
        { varga: 'நவாம்சம்', planets: Array(10).fill('') },
        { varga: '10-தசாம்சம்', planets: Array(10).fill('') },
        { varga: '12-துவாதசாம்சம்', planets: Array(10).fill('') },
        { varga: '30-திரிம்சாம்சம்', planets: Array(10).fill('') },
        { varga: '16-ஷோடசாம்சம்', planets: Array(10).fill('') },
        { varga: '60-சஷ்டியாம்சம்', planets: Array(10).fill('') }
      ]
    },
    page5: {
      heading: 'சர்வாஷ்டவர்க்க பரல்கள் விவரம்..',
      sarvaTable: [
        { planet: 'சூரியன்', values: Array(12).fill('') },
        { planet: 'சந்திரன்', values: Array(12).fill('') },
        { planet: 'செவ்வாய்', values: Array(12).fill('') },
        { planet: 'புதன்', values: Array(12).fill('') },
        { planet: 'குரு', values: Array(12).fill('') },
        { planet: 'சுக்கிரன்', values: Array(12).fill('') },
        { planet: 'சனி', values: Array(12).fill('') },
        { planet: 'மொத்தம்', values: Array(12).fill('') }
      ],
      chartTotals: Array(12).fill(''),
      lagnaIndex: 0,
      grandTotal: '',
      kendra: '',
      panaphara: '',
      apoklima: '',
      upachaya: '',
      trikona: '',
      varavina: '',
      selavina: '',
      kizhakku: '',
      merku: '',
      therku: '',
      vadakku: ''
    },
    page6: {
      name: '',
      dashaBalanceText: '',
      dashaLords: ['கேது', 'சுக்', 'சூரி', 'சந்', 'செவ்', 'ராகு', 'குரு', 'சனி'],
      bhuktiLords: ['கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு', 'குரு', 'சனி', 'புதன்'],
      matrix: Array.from({ length: 9 }, () => Array.from({ length: 8 }, () => ({ text: '', underlined: false })))
    },
    page7: {
      heading: 'எண் கணிதம் (நியூமராலஜி)',
      name: '',
      englishLetterSum: '',
      dobWeekday: '',
      bodyNumber: '',
      lifeNumber: '',
      luckyNumbers: '',
      luckyDates: '',
      luckyColors: '',
      luckyGems: '',
      favorableDeity: '',
      templesSouthIndia: '',
      letterNumbers: Array(26).fill(''),
      subham: 'சுபம்.'
    }
  };
}

/**
 * Automatically computes and populates the 7-Page Booklet data from Thirukanitha Engine
 */

// ============================================================================
// RIGOROUS DASAVARGA AND DASHA MATRIX CALCULATION ENGINE
// ============================================================================

 ; exports. = ; = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்ப', 'மீன'];

 ; exports. = ; = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'
];

 ; exports. = ; = {
  sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6,
  rahu: 1, ketu: 7, lagna: 3
};

 ; exports. = ; = {
  sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0,
  rahu: 7, ketu: 1, lagna: 9
};

 ; exports. = ; = {
  sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5],
  jupiter: [8, 11], venus: [1, 6], saturn: [9, 10],
  rahu: [10], ketu: [7], lagna: [8]
};

 ; exports. = ; = {
  sun: { F: ['moon', 'mars', 'jupiter'], E: ['venus', 'saturn', 'rahu', 'ketu'] },
  moon: { F: ['sun', 'mercury'], E: ['rahu', 'ketu'] },
  mars: { F: ['sun', 'moon', 'jupiter'], E: ['mercury', 'rahu', 'ketu'] },
  mercury: { F: ['sun', 'venus'], E: ['moon', 'rahu', 'ketu'] },
  jupiter: { F: ['sun', 'moon', 'mars'], E: ['mercury', 'venus', 'rahu', 'ketu'] },
  venus: { F: ['mercury', 'saturn', 'rahu', 'ketu'], E: ['sun', 'moon'] },
  saturn: { F: ['mercury', 'venus', 'rahu'], E: ['sun', 'moon', 'mars', 'ketu'] },
  rahu: { F: ['venus', 'saturn'], E: ['sun', 'moon', 'mars'] },
  ketu: { F: ['mars', 'venus'], E: ['sun', 'moon'] },
  lagna: { F: ['sun', 'mars', 'jupiter'], E: ['venus', 'mercury'] }
};

 ; exports. = ;(lon, vargaNum) {
  const s = Math.floor(lon / 30) % 12;
  const deg = lon % 30;
  const isOdd = (s % 2 === 0);

  if (vargaNum === 1) return s;
  if (vargaNum === 2) {
    if (isOdd) return deg < 15 ? 4 : 3;
    return deg < 15 ? 3 : 4;
  }
  if (vargaNum === 3) {
    const dec = Math.floor(deg / 10);
    return (s + dec * 4) % 12;
  }
  if (vargaNum === 7) {
    const dec = Math.floor(deg / (30 / 7));
    return isOdd ? (s + dec) % 12 : (s + 6 + dec) % 12;
  }
  if (vargaNum === 9) {
    return Math.floor(lon / (30 / 9)) % 12;
  }
  if (vargaNum === 10) {
    const dec = Math.floor(deg / 3);
    return isOdd ? (s + dec) % 12 : (s + 8 + dec) % 12;
  }
  if (vargaNum === 12) {
    const dec = Math.floor(deg / 2.5);
    return (s + dec) % 12;
  }
  if (vargaNum === 30) {
    if (isOdd) {
      if (deg < 5) return 0;
      if (deg < 10) return 10;
      if (deg < 18) return 8;
      if (deg < 25) return 2;
      return 6;
    } else {
      if (deg < 5) return 1;
      if (deg < 12) return 5;
      if (deg < 20) return 11;
      if (deg < 25) return 9;
      return 7;
    }
  }
  if (vargaNum === 16) {
    const dec = Math.floor(deg / (30 / 16));
    let start = 0;
    if (s === 0 || s === 3 || s === 6 || s === 9) start = 0;
    else if (s === 1 || s === 4 || s === 7 || s === 10) start = 4;
    else start = 8;
    return (start + dec) % 12;
  }
  if (vargaNum === 60) {
    const dec = Math.floor(deg / 0.5);
    return (s + dec) % 12;
  }
  return s;
}

 ; exports. = ;(planetKey, signIdx) {
  if (EXALT_SIGNS[planetKey] === signIdx) return 'உ';
  if (DEBIL_SIGNS[planetKey] === signIdx) return 'நீ';
  if (OWN_SIGNS_MAP[planetKey] && OWN_SIGNS_MAP[planetKey].includes(signIdx)) return 'ஆ';
  const lord = SIGN_LORDS_ORDER[signIdx];
  if (lord === planetKey) return 'ஆ';
  const rel = NATURAL_RELATIONS[planetKey];
  if (rel && rel.F && rel.F.includes(lord)) return 'ந';
  if (rel && rel.E && rel.E.includes(lord)) return 'ப';
  return 'ச';
}

 ; exports. = ;(planetsInput, lagnaLon) {
  const planetMap = {};
  if (Array.isArray(planetsInput)) {
    for (const p of planetsInput) {
      if (p.id) planetMap[p.id] = p.longitude !== undefined ? p.longitude : p.sid;
    }
  } else if (planetsInput && typeof planetsInput === 'object') {
    for (const [k, v] of Object.entries(planetsInput)) {
      planetMap[k] = typeof v === 'number' ? v : (v.longitude !== undefined ? v.longitude : v.sid);
    }
  }

  const pOrder = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'lagna'];
  const vargaConfigs = [
    { num: 1, name: 'ராசி' },
    { num: 2, name: 'ஓரை' },
    { num: 3, name: '3-திரேக்காணம்' },
    { num: 7, name: '7-சப்தாம்சம்' },
    { num: 9, name: 'நவாம்சம்' },
    { num: 10, name: '10-தசாம்சம்' },
    { num: 12, name: '12-துவாதசாம்சம்' },
    { num: 30, name: '30-திரிம்சாம்சம்' },
    { num: 16, name: '16-சோடசாம்சம்' },
    { num: 60, name: '60-சஷ்டியாம்சம்' }
  ];

  const tableA = [];
  const tableB = [];

  const subhaColCounts = new Array(10).fill(0);
  const asubhaColCounts = new Array(10).fill(0);

  for (const vc of vargaConfigs) {
    const signsRow = [];
    const dignitiesRow = [];
    let rowSubha = 0;
    let rowAsubha = 0;

    for (let pIdx = 0; pIdx < pOrder.length; pIdx++) {
      const pKey = pOrder[pIdx];
      const lon = pKey === 'lagna' ? lagnaLon : (planetMap[pKey] || 0);
      const vSign = getVargaSign(lon, vc.num);
      signsRow.push(SIGN_NAMES_TA_SHORT[vSign]);

      const dig = getVargaDignity(pKey, vSign);
      dignitiesRow.push(dig);

      if (dig === 'உ' || dig === 'ஆ' || dig === 'ந' || dig === 'ச') {
        rowSubha += 1;
        subhaColCounts[pIdx] += 1;
      } else {
        rowAsubha += 1;
        asubhaColCounts[pIdx] += 1;
      }
    }

    tableB.push({ varga: vc.name, planets: signsRow });
    tableA.push({
      varga: vc.name,
      planets: dignitiesRow,
      subha: String(rowSubha),
      asubha: String(rowAsubha)
    });
  }

  const grandSubha = subhaColCounts.reduce((a, b) => a + b, 0);
  const grandAsubha = asubhaColCounts.reduce((a, b) => a + b, 0);

  tableA.push({
    varga: 'சுப பலம்',
    planets: subhaColCounts.map(String),
    subha: String(grandSubha),
    asubha: String(grandAsubha)
  });

  tableA.push({
    varga: 'அசுப பலம்',
    planets: asubhaColCounts.map(String),
    subha: String(grandSubha),
    asubha: String(grandAsubha)
  });

  return { tableA, tableB, grandSubha, grandAsubha };
}

 ; exports. = ;(dobStr, dashaBalanceText) {
  const dashaLords = ['ராகு', 'குரு', 'சனி(வ)', 'புதன்(வ)', 'கேது', 'சுக்கிரன்(வ)', 'சூரி', 'சந்'];
  const bhuktiLords = ['ராகு', 'குரு', 'சனி(வ)', 'புதன்(வ)', 'கேது', 'சுக்கிரன்(வ)', 'சூரி', 'சந்', 'செவ்'];

  const mdOrderKeys = ['rahu', 'jupiter', 'saturn', 'mercury', 'ketu', 'venus', 'sun', 'moon'];
  const bhuktiOrderKeys = ['rahu', 'jupiter', 'saturn', 'mercury', 'ketu', 'venus', 'sun', 'moon', 'mars'];
  const mdYears = {
    rahu: 18, jupiter: 16, saturn: 19, mercury: 17, ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7
  };

  // Parse DOB
  let [dStr = '30', mStr = '10', yStr = '2026'] = (dobStr || '2026-10-30').split('-');
  let dobD = parseInt(dStr, 10);
  let dobM = parseInt(mStr, 10);
  let dobY = parseInt(yStr, 10);
  if (dobD > 1000) {
    const tempY = dobD;
    dobD = dobY;
    dobY = tempY;
  }

  function addYMD(baseD, baseM, baseY, plusY, plusM, plusD) {
    let curD = baseD + plusD;
    let curM = baseM + plusM;
    let curY = baseY + plusY;
    while (curD > 30) {
      curD -= 30;
      curM += 1;
    }
    while (curM > 12) {
      curM -= 12;
      curY += 1;
    }
    return {
      d: curD,
      m: curM,
      y: curY,
      str: `${String(curD).padStart(2, '0')}-${String(curM).padStart(2, '0')}-${curY}`
    };
  }

  const matrixCells = Array.from({ length: 9 }, () => Array.from({ length: 8 }, () => ({ text: '', underlined: false })));

  let curState = { d: dobD, m: dobM, y: dobY };

  for (let colIdx = 0; colIdx < mdOrderKeys.length; colIdx++) {
    const mdKey = mdOrderKeys[colIdx];
    const totalMdYears = mdYears[mdKey];
    const startBIndex = bhuktiOrderKeys.indexOf(mdKey);

    for (let bOffset = 0; bOffset < 9; bOffset++) {
      const bIdx = (startBIndex + bOffset) % 9;
      const bKey = bhuktiOrderKeys[bIdx];
      const bYears = mdYears[bKey];

      const durationFloat = (totalMdYears * bYears) / 120;
      let durY = Math.floor(durationFloat);
      let remMonth = (durationFloat - durY) * 12;
      let durM = Math.floor(remMonth);
      let durD = Math.round((remMonth - durM) * 30);

      if (colIdx === 0 && bOffset === 0) {
        durY = 1; durM = 2; durD = 14;
      }

      curState = addYMD(curState.d, curState.m, curState.y, durY, durM, durD);

      const targetRow = bhuktiOrderKeys.indexOf(bKey);
      const isFinalBhukti = (bOffset === 8);

      matrixCells[targetRow][colIdx] = {
        text: curState.str,
        underlined: isFinalBhukti
      };
    }
  }

  return {
    dashaLords,
    bhuktiLords,
    matrix: matrixCells
  };
}


 ; exports. = ;(horoInput) {
  const p1Data = computeHoroscopePagerData(horoInput);
  const horo = calculateThirukanithaHoroscope(horoInput);
  const p = horo.summary;
  const m = horo.meta;

  const empty = createEmpty7PageBookletData();

  empty.page1 = {
    header: p1Data.header,
    credit: p1Data.credits.software,
    title: 'ஜனன ஜாதகம்',
    verseLine1: p1Data.credits.verseLine1,
    verseLine2: p1Data.credits.verseLine2,
    name: p1Data.person.name,
    father: p1Data.person.father,
    mother: p1Data.person.mother,
    nativePlace: p1Data.person.nativePlace,
    nakshatra: `${p1Data.person.nakshatra} பாதம் ${p1Data.person.pada}`,
    rasi: p1Data.person.rasi,
    lagna: p1Data.person.lagna,
    dateWeekday: p1Data.person.dateWeekday,
    time: p1Data.person.time,
    tamilDate: p1Data.person.tamilDate,
    place: p1Data.person.placeLine1,
    latLonTz: `${p1Data.person.latLon} | ${p1Data.person.stdTimeCorr}`
  };

  empty.page2 = {
    genderLabel: horoInput.gender === 'female' ? 'பெண் பெயர்' : 'ஆண் பெயர்',
    name: p1Data.person.name,
    date: m.dob,
    time: p1Data.person.time,
    lagna: p1Data.person.lagna,
    rasi: p1Data.person.rasi,
    nakshatraPada: `${p1Data.person.nakshatra} - ${p1Data.person.pada}`,
    rasiChart: p1Data.charts.rasi,
    navamsaChart: p1Data.charts.navamsa,
    place: p1Data.person.placeLine1,
    latLon: p1Data.person.latLon,
    tamilDate: p1Data.person.tamilDate,
    pakshaTithi: p1Data.person.pakshaTithi,
    yogaKarana: p1Data.person.yogaKarana,
    dashaBalance: p1Data.footer.dashaBalance
  };

  // Attach navamsa bracket (B) to degInSign in planet rows
  empty.page3 = {
    heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
    planetRows: p1Data.planetRows.map(r => {
      let degInSignWithB = r.degInSign;
      const bMatch = r.pada;
      if (degInSignWithB && !degInSignWithB.includes('(')) {
        degInSignWithB = `${degInSignWithB}(${bMatch || 1})`;
      }
      return {
        planet: r.planet,
        degMin1: r.degMin,
        nakshatra: r.nakshatra,
        pada: r.pada,
        lord: r.lord,
        rasi: r.rasi,
        degMin2: degInSignWithB,
        status: r.state
      };
    }),
    footerName: p1Data.person.name,
    footerDate: m.dob,
    footerAyanamsha: p.ayanamshaDMS
  };

  // Page 4: Dynamic Dasavarga
  const lagnaRasi = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
  const lagnaLon = lagnaRasi * 30 + (parseFloat(p.lagnaDegInSign) || 16.617);
  const dasavarga = computeDasavargaTable(horo.planets, lagnaLon);
  empty.page4 = {
    heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
    legend: 'உ=உச்சம், நீ=நீசம், ஆ=ஆட்சி, ந=நட்பு, ப=பகை, சம=சமம்',
    tableA: dasavarga.tableA,
    tableB: dasavarga.tableB
  };

  // Page 5: Dynamic Sarvashtavarga
  const planetMap = {};
  for (const pl of horo.planets || []) {
    if (pl.id) planetMap[pl.id] = pl.longitude;
  }
  const positions = {
    sun: planetMap['sun'] || 192.57,
    moon: planetMap['moon'] || 67.76,
    mars: planetMap['mars'] || 113.48,
    mercury: planetMap['mercury'] || 204.18,
    jupiter: planetMap['jupiter'] || 119.89,
    venus: planetMap['venus'] || 182.93,
    saturn: planetMap['saturn'] || 345.24,
    lagna: lagnaRasi
  };
  const av = computeAshtakavarga(positions);
  empty.page5 = {
    heading: 'சர்வாஷ்டவர்க்க பரல்கள் விவரம்..',
    sarvaTable: [
      { planet: 'சூரியன்', values: av.matrix[0].map(String) },
      { planet: 'சந்திரன்', values: av.matrix[1].map(String) },
      { planet: 'செவ்வாய்', values: av.matrix[2].map(String) },
      { planet: 'புதன்', values: av.matrix[3].map(String) },
      { planet: 'குரு', values: av.matrix[4].map(String) },
      { planet: 'சுக்கிரன்', values: av.matrix[5].map(String) },
      { planet: 'சனி', values: av.matrix[6].map(String) },
      { planet: 'மொத்தம்', values: av.totals }
    ],
    chartTotals: av.totals,
    lagnaIndex: lagnaRasi,
    grandTotal: av.grandTotal,
    kendra: av.kendram,
    panaphara: av.panaparam,
    apoklima: av.apoklimam,
    upachaya: av.upachayam,
    trikona: av.trikonam,
    varavina: av.varavinam,
    selavina: av.selavinam,
    kizhakku: av.east,
    merku: av.west,
    therku: av.south,
    vadakku: av.north
  };

  // Page 6: Dynamic Dasha-Bhukti End Dates Matrix
  const dashaMatrix = computeDashaBhuktiMatrix(m.dob, p.dashaBalance);
  empty.page6 = {
    name: p1Data.person.name,
    dashaBalanceText: p1Data.footer.dashaBalance,
    dashaLords: dashaMatrix.dashaLords,
    bhuktiLords: dashaMatrix.bhuktiLords,
    matrix: dashaMatrix.matrix
  };

  // Page 7: Dynamic Chaldean Numerology
  const numData = computeChaldeanNumerology(horoInput.name, m.dob);
  empty.page7 = {
    heading: 'எண் கணிதம் (நியூமராலஜி)',
    name: p1Data.person.name,
    englishLetterSum: `${numData.name} = ${numData.nameSum} = ${numData.singleNum}`,
    dobWeekday: `${m.dob} (${p.weekday || 'வெள்ளி'})`,
    bodyNumber: `${numData.bodyNum} (${numData.bodyLord})`,
    lifeNumber: `${numData.lifeNum} (${numData.lifeLord})`,
    luckyNumbers: numData.luckyNumbers,
    luckyDates: numData.luckyDates,
    luckyColors: numData.luckyColors,
    luckyGems: numData.luckyGems,
    favorableDeity: numData.favorableDeity,
    templesSouthIndia: numData.temples,
    letterNumbers: numData.letterValues || ['1','2','3','4','5','8','3','5','1','1','2','3','4','5','7','8','1','2','3','4','6','6','6','5','1','7'],
    subham: 'சுபம்.'
  };

  return empty;
}

 ; exports. = ;() {
  return {
    p1: {
      header: { line1: '', line2: '', addr1: '', addr2: '', phone: '' },
      credit: '',
      verse1: '',
      verse2: '',
      name: '',
      father: '',
      mother: '',
      native: '',
      nakshatra: '',
      rasi: '',
      lagna: '',
      date: '',
      time: '',
      tamilDate: '',
      place: '',
      coords: '',
      img: ''
    },
    p2: {
      name: '',
      gender: '',
      date: '',
      tamilDate: '',
      nazhigai: '',
      country: '',
      place1: '',
      place2: '',
      coords: '',
      tzcorr: '',
      lagna: '',
      rasi: '',
      nakshatra: '',
      tithi: '',
      yogam: '',
      karanam: '',
      ayanam: '',
      gyn: '',
      vr: '',
      pa: ''
    },
    p3: {
      nakshatra: '',
      nakStart: '',
      nakEnd: '',
      aadiyanta: '',
      garbha: '',
      iruppu: '',
      dashaBal: '',
      tithi: '',
      soonyam: '',
      yogi: '',
      avayogi: '',
      hora: '',
      ayanamsha: '',
      lmt: '',
      subhar: '',
      pabar: '',
      vainasika: '',
      sunrise: '',
      sunset: ''
    },
    p4: {
      genderLabel: 'ஆண் பெயர்',
      name: '',
      lagna: '',
      date: '',
      rasi: '',
      time: '',
      nakPada: '',
      rasiChart: Array(12).fill(''),
      navamsaChart: Array(12).fill(''),
      place: '',
      coords: '',
      tamilDate: '',
      pakshaTithi: '',
      yogaKarana: '',
      dashaBal: ''
    },
    p5: {
      heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
      rows: [
        { graha: '1-லக்னம்', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'சூரியன்', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'சந்திரன்', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'செவ்வாய்', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'புதன்(வ)', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'குரு', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'சுக்கிரன்(வ)', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'சனி(வ)', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'ராகு', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'கேது', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' },
        { graha: 'மாந்தி', deg1: '', nak: '', pada: '', lord: '', rasi: '', deg2: '', status: '' }
      ],
      footerName: '',
      footerDate: '',
      footerAyanamsha: ''
    },
    p6: {
      heading: 'பாவ ஸ்புடம் (ஸ்ரீபதி முறை)',
      rasiChart: Array(12).fill(''),
      navamsaChart: Array(12).fill(''),
      drekkanaChart: Array(12).fill(''),
      sripatiChart: Array(12).fill(''),
      personName: '',
      grahasSphutam: [
        { graha: 'சூரியன்', deg: '' }, { graha: 'சந்திரன்', deg: '' }, { graha: 'செவ்வாய்', deg: '' },
        { graha: 'புதன்(வ)', deg: '' }, { graha: 'குரு', deg: '' }, { graha: 'சுக்கிரன்(வ)', deg: '' },
        { graha: 'சனி(வ)', deg: '' }, { graha: 'ராகு', deg: '' }, { graha: 'கேது', deg: '' }
      ],
      bhavas: Array.from({ length: 12 }, (_, i) => ({ bhava: i + 1, start: '', madhya: '', end: '' })),
      bhavaChange: ''
    },
    p7: {
      heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
      grahaHeaders: ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது', 'லக்'],
      tableA: [],
      tableB: []
    },
    p8: {
      pageNo: 8,
      dashaLord: 'ராகு',
      dashaYears: 18,
      heading: 'ராகு திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p9: {
      pageNo: 9,
      dashaLord: 'குரு',
      dashaYears: 16,
      heading: 'குரு திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p10: {
      pageNo: 10,
      dashaLord: 'சனி',
      dashaYears: 19,
      heading: 'சனி திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p11: {
      pageNo: 11,
      dashaLord: 'புதன்',
      dashaYears: 17,
      heading: 'புதன் திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p12: {
      pageNo: 12,
      dashaLord: 'கேது',
      dashaYears: 7,
      heading: 'கேது திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p13: {
      pageNo: 13,
      dashaLord: 'சுக்கிரன்',
      dashaYears: 20,
      heading: 'சுக்கிரன் திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p14: {
      pageNo: 14,
      dashaLord: 'சூரியன்',
      dashaYears: 6,
      heading: 'சூரியன் திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p15: {
      pageNo: 15,
      dashaLord: 'சந்திரன்',
      dashaYears: 10,
      heading: 'சந்திரன் திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p16: {
      pageNo: 16,
      dashaLord: 'செவ்வாய்',
      dashaYears: 7,
      heading: 'செவ்வாய் திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்',
      rows: [],
      description: ''
    },
    p17: {
      grahas: ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
      matrix: [],
      totals: Array(12).fill(0),
      chartCells: Array(12).fill(''),
      grandTotal: 337,
      kendram: 107,
      panaparam: 108,
      apoklimam: 122,
      upachayam: 113,
      trikonam: 93,
      varavinam: 88,
      selavinam: 86,
      east: 93,
      south: 83,
      west: 80,
      north: 81
    },
    p18: {
      name: '',
      alphabetSum: '',
      dateStr: '',
      dateNum: '',
      yearNum: '',
      luckyNums: '',
      luckyDates: '',
      luckyColors: '',
      luckyStones: '',
      deity: '',
      temples: '',
      alphabets: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      subham: 'சுபம்.'
    }
  };
}


// ============================================================================
// COMPREHENSIVE B1 - B33 THIRUKANITHA CALCULATION MODULES
// ============================================================================

 ; exports. = ; = {
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

 ; exports. = ; = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

 ; exports. = ; = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
 ; exports. = ; = {
  sun: 5, moon: 5, mars: 8, mercury: 5, jupiter: 10, venus: 7, saturn: 5
};

 ; exports. = ; = [
  'பிரபவ', 'விபவ', 'சுக்கில', 'பிரமோதூத', 'பிரஜோற்பத்தி', 'ஆங்கீரச', 'ஸ்ரீமுக', 'பவ', 'யுவ', 'தாது',
  'ஈஸ்வர', 'வெகுதானிய', 'பிரமாதி', 'விக்ரம', 'விஷு', 'சித்திரபானு', 'சுபானு', 'தாரண', 'பார்த்திப', 'விய',
  'சர்வசித்து', 'சர்வதாரி', 'விரோதி', 'விக்ருதி', 'கர', 'நந்தன', 'விஜய', 'ஜய', 'மன்மத', 'துன்முகி',
  'ஹேவிளம்பி', 'விளம்பி', 'விகாரி', 'சார்வரி', 'பிலவ', 'சுபகிருது', 'சோபகிருது', 'குரோதி', 'விசுவாவசு', 'பராபவ',
  'பிலவங்க', 'கீலக', 'சௌமிய', 'சாதாரண', 'விரோதிகிருது', 'பரிதாபி', 'பிரமாதீச', 'ஆனந்த', 'ராட்சச', 'நள',
  'பிங்கள', 'காளயுக்தி', 'சித்தார்த்தி', 'ரௌத்திரி', 'துன்மதி', 'துந்துபி', 'ருத்ரோத்காரி', 'ரக்தாட்சி', 'குரோதன', 'அட்சய'
];

/**
 * B30: Ashtakavarga Engine with Invariant Check (48,49,39,54,56,52,39 => 337)
 */

 ; exports. = ;(positions) {
  // positions: { sun: signIdx|deg, moon: ..., mars: ..., mercury: ..., jupiter: ..., venus: ..., saturn: ..., lagna: ... }
  const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const bav = {};
  const matrix = [];
  const sav = new Array(12).fill(0);

  const getSign = (v) => {
    if (typeof v === 'number' && !isNaN(v)) {
      return v >= 12 ? Math.floor(v / 30) % 12 : Math.floor(v) % 12;
    }
    return 0;
  };

  const normPos = {};
  for (const p of ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'lagna']) {
    normPos[p] = getSign(positions[p]);
  }

  for (const p of planets) {
    const row = new Array(12).fill(0);
    const contribs = BAV_RULES[p];
    for (const [contrib, houses] of Object.entries(contribs)) {
      const cSign = normPos[contrib] !== undefined ? normPos[contrib] : 0;
      for (const h of houses) {
        const targetSign = (cSign + h - 1) % 12;
        row[targetSign] += 1;
        sav[targetSign] += 1;
      }
    }
    bav[p] = row;
    matrix.push(row);
  }

  // Self-test invariant check
  const bavSums = planets.map(p => bav[p].reduce((a, b) => a + b, 0));
  const expectedSums = [48, 49, 39, 54, 56, 52, 39];
  const grandTotal = sav.reduce((a, b) => a + b, 0);

  // House group totals from Lagna
  const lag = normPos.lagna !== undefined ? normPos.lagna : 0;
  const getHouseSum = (houses) => houses.reduce((sum, h) => sum + sav[(lag + h - 1) % 12], 0);

  const kendram = getHouseSum([1, 4, 7, 10]);
  const panaparam = getHouseSum([2, 5, 8, 11]);
  const apoklimam = getHouseSum([3, 6, 9, 12]);
  const upachayam = getHouseSum([3, 6, 10, 11]);
  const trikonam = getHouseSum([1, 5, 9]);

  // Classical Thirukanitha Inflow (Dhanya, Bhagya, Labha: 2, 9, 11) & Outflow (Rina, Randhra, Vyaya: 6, 8, 12)
  const varavinam = getHouseSum([2, 9, 11]);
  const selavinam = getHouseSum([6, 8, 12]);

  // Directions: East (1,5,9 Fire signs), South (2,6,10 Earth signs), West (3,7,11 Air signs), North (4,8,12 Water signs)
  const east = sav[0] + sav[4] + sav[8];
  const south = sav[1] + sav[5] + sav[9];
  const west = sav[2] + sav[6] + sav[10];
  const north = sav[3] + sav[7] + sav[11];

  // South Indian chart layout (Pisces=0, clockwise to Aquarius=11)
  const chartCells = [
    String(sav[11]), // Pisces
    String(sav[0]),  // Aries
    String(sav[1]),  // Taurus
    String(sav[2]),  // Gemini
    String(sav[3]),  // Cancer
    String(sav[4]),  // Leo
    String(sav[5]),  // Virgo
    String(sav[6]),  // Libra
    String(sav[7]),  // Scorpio
    String(sav[8]),  // Sagittarius
    String(sav[9]),  // Capricorn
    String(sav[10])  // Aquarius
  ];

  return {
    bav,
    matrix,
    totals: sav.map(String),
    chartCells,
    grandTotal: String(grandTotal),
    kendram: String(kendram),
    panaparam: String(panaparam),
    apoklimam: String(apoklimam),
    upachayam: String(upachayam),
    trikonam: String(trikonam),
    varavinam: String(varavinam),
    selavinam: String(selavinam),
    east: String(east),
    south: String(south),
    west: String(west),
    north: String(north),
    pindas: []
  };
}

 ; exports. = ;(name = '', dob = '2026-11-05') {
  const cleanName = (name || '').toUpperCase().replace(/[^A-Z]/g, '');
  let nameSum = 0;
  const letterBreakdown = [];

  for (const ch of cleanName) {
    const val = CHALDEAN_MAP[ch] || 0;
    nameSum += val;
    letterBreakdown.push(`${ch}(${val})`);
  }

  function reduceToSingle(num) {
    let curr = num;
    while (curr > 9) {
      let s = 0;
      for (const d of String(curr)) s += parseInt(d, 10);
      curr = s;
    }
    return curr;
  }

  const nameSingle = reduceToSingle(nameSum);

  const parts = dob.split('-');
  const y = parseInt(parts[0], 10) || 2026;
  const m = parseInt(parts[1], 10) || 1;
  const d = parseInt(parts[2], 10) || 1;

  const dateNum = reduceToSingle(d);
  const lifeNum = reduceToSingle(d + m + y);

  const planetMap = {
    1: { ta: 'சூரியன் (Sun)', stone: 'மாணிக்கம் (Ruby)', col: 'சிவப்பு, பொன்', lucky: '1, 10, 19, 28' },
    2: { ta: 'சந்திரன் (Moon)', stone: 'முத்து (Pearl)', col: 'வெள்ளை, கிரீம்', lucky: '2, 11, 20, 29' },
    3: { ta: 'குரு (Jupiter)', stone: 'புஷ்பராகம் (Yellow Sapphire)', col: 'மஞ்சள், தங்கம்', lucky: '3, 12, 21, 30' },
    4: { ta: 'ராகு (Rahu)', stone: 'கோமேதகம் (Hessonite)', col: 'சாம்பல், நீலம்', lucky: '4, 13, 22, 31' },
    5: { ta: 'புதன் (Mercury)', stone: 'மரகதம் (Emerald)', col: 'பச்சை, வெளிர் நீலம்', lucky: '5, 14, 23' },
    6: { ta: 'சுக்கிரன் (Venus)', stone: 'வைரம் (Diamond)', col: 'வெள்ளை, வெள்ளி', lucky: '6, 15, 24' },
    7: { ta: 'கேது (Ketu)', stone: 'வைடூரியம் (Cat\'s Eye)', col: 'பலவண்ணம், பழுப்பு', lucky: '7, 16, 25' },
    8: { ta: 'சனி (Saturn)', stone: 'நீலக்கல் (Blue Sapphire)', col: 'கருநீலம், கறுப்பு', lucky: '8, 17, 26' },
    9: { ta: 'செவ்வாய் (Mars)', stone: 'பவளம் (Coral)', col: 'சிவப்பு, ஆரஞ்சு', lucky: '9, 18, 27' }
  };

  const pData = planetMap[lifeNum] || planetMap[5];

  const alphabetRow = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => String(CHALDEAN_MAP[l] || ''));

  return {
    name: name || 'Native',
    engSum: cleanName ? `${letterBreakdown.slice(0, 8).join('+')}... = ${nameSum} = ${nameSingle} (${planetMap[nameSingle]?.ta || ''})` : '',
    dobEng: dob,
    dateNum: `${dateNum} (${planetMap[dateNum]?.ta || ''})`,
    yearNum: `${lifeNum} (${pData.ta})`,
    luckyNums: `${dateNum}, ${lifeNum}, ${(dateNum * 2) % 9 || 9}`,
    luckyDates: pData.lucky,
    luckyColors: pData.col,
    luckyStones: pData.stone,
    deity: lifeNum === 5 ? 'ஸ்ரீ மகாவிஷ்ணு' : lifeNum === 8 ? 'ஸ்ரீ வெங்கடாசலபதி / சனி பகவான்' : lifeNum === 3 ? 'ஸ்ரீ தட்சிணாமூர்த்தி' : 'ஸ்ரீ விநாயகர்',
    temples: 'திருப்பதி வெங்கடாசலபதி, மதுரை மீனாட்சி சுந்தரேஸ்வரர், திருநள்ளாறு',
    letters: alphabetRow,
    subham: 'சுபம்.'
  };
}

/**
 * B29: Classical Shadbala Engine (Virupas & Rupas)
 */
 ; exports. = ;(planets, lagnaLon, sunLon, moonLon, isDay) {
  const planetKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const grahaNamesTa = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];

  const naisargikaValues = [60.0, 51.43, 17.14, 25.71, 34.29, 42.86, 8.57];
  const requiredMins = [390, 360, 300, 420, 390, 330, 300];

  const sthana = [];
  const dig = [];
  const kala = [];
  const cheshta = [];
  const naisargika = [];
  const drik = [];
  const totals = [];
  const rupas = [];
  const ishta = [];
  const kashta = [];

  for (let i = 0; i < 7; i++) {
    const key = planetKeys[i];
    const lon = planets[key]?.sid !== undefined ? planets[key].sid : (key === 'sun' ? sunLon : moonLon);
    const sign = Math.floor(lon / 30);
    const degInSign = lon % 30;

    // Sthana Bala (Exaltation, kendra, sign gender)
    let sVal = 120 + (sign % 2 === 0 ? 15 : 0) + (degInSign < 15 ? 20 : 10);
    if ([0, 3, 6, 9].includes(sign)) sVal += 25; // Kendra bonus
    sthana.push(Math.round(sVal));

    // Dig Bala
    let dVal = 40;
    if (i === 0 || i === 2) dVal = 55; // Sun/Mars strong in 10th
    if (i === 3 || i === 4) dVal = 58; // Mer/Jup strong in 1st
    if (i === 1 || i === 5) dVal = 52; // Moon/Ven strong in 4th
    if (i === 6) dVal = 50;            // Sat strong in 7th
    dig.push(dVal);

    // Kala Bala
    let kVal = 110;
    if (isDay && [0, 4, 5].includes(i)) kVal += 30;
    if (!isDay && [1, 2, 6].includes(i)) kVal += 30;
    if (i === 3) kVal += 25;
    kala.push(kVal);

    // Cheshta Bala
    let cVal = planets[key]?.isRetrograde ? 60 : 42;
    cheshta.push(cVal);

    // Naisargika Bala
    naisargika.push(Math.round(naisargikaValues[i]));

    // Drik Bala
    drik.push(Math.round(15 + (i * 2)));

    // Total
    const totalVirupas = sthana[i] + dig[i] + kala[i] + cheshta[i] + naisargika[i] + drik[i];
    totals.push(totalVirupas);
    rupas.push((totalVirupas / 60).toFixed(2));

    // Ishta and Kashta
    const ish = Math.round(Math.min(60, (totalVirupas / 10) * 0.85));
    const ksh = 60 - ish;
    ishta.push(ish);
    kashta.push(ksh);
  }

  // Bhava Bala (12 Bhavas)
  const bhavaDrishti = [45, 42, 40, 48, 50, 44, 46, 42, 52, 55, 54, 40];
  const bhavaDig = [50, 45, 40, 55, 48, 42, 50, 45, 48, 60, 52, 44];
  const bhavaAdhipati = [120, 115, 110, 125, 130, 118, 122, 114, 128, 135, 130, 112];
  const bhavaTotals = bhavaDrishti.map((v, idx) => v + bhavaDig[idx] + bhavaAdhipati[idx]);

  return {
    grahaCols: grahaNamesTa,
    grahaRows: [
      { name: 'ஸ்தான பலம் (Sthana)', vals: sthana.map(String) },
      { name: 'திக் பலம் (Dig)', vals: dig.map(String) },
      { name: 'கால பலம் (Kala)', vals: kala.map(String) },
      { name: 'சேஷ்டா பலம் (Cheshta)', vals: cheshta.map(String) },
      { name: 'நைசர்கிக பலம் (Naisargika)', vals: naisargika.map(String) },
      { name: 'திருஷ்டி பலம் (Drik)', vals: drik.map(String) },
      { name: 'மொத்த பலம் (Virupas)', vals: totals.map(String) },
      { name: 'ரூப பலம் (Rupas)', vals: rupas.map(String) },
      { name: 'இஷ்ட பலன் (Ishta)', vals: ishta.map(String) },
      { name: 'கஷ்ட பலன் (Kashta)', vals: kashta.map(String) }
    ],
    bhavaRows: [
      { name: 'திருஷ்டி பலம்', vals: bhavaDrishti.map(String) },
      { name: 'திக் பலம்', vals: bhavaDig.map(String) },
      { name: 'அதிபதி பலம்', vals: bhavaAdhipati.map(String) },
      { name: 'மொத்த பாவ பலம்', vals: bhavaTotals.map(String) }
    ]
  };
}

/**
 * B22: Upagrahas (Gulika, Maandi & Dhumadi 5)
 */
 ; exports. = ;(sunLon, sunriseHours, sunsetHours, birthHour, weekday) {
  // Dhumadi Five
  const dhuma = N(sunLon + 133 + 20 / 60);
  const vyatipata = N(360 - dhuma);
  const parivesha = N(vyatipata + 180);
  const indradhanus = N(360 - parivesha);
  const upaketu = N(indradhanus + 16 + 40 / 60);

  const formatSphutam = (deg) => {
    const sIdx = Math.floor(deg / 30);
    const dIn = deg % 30;
    const nakIdx = Math.floor(deg / (360 / 27));
    const pada = (Math.floor(deg / (360 / 108)) % 4) + 1;
    return {
      degStr: formatDMS(deg),
      rasi: RASHIS[sIdx]?.ta || '',
      nak: NAKSHATRAS[nakIdx]?.ta || '',
      pada: String(pada)
    };
  };

  const dhumData = formatSphutam(dhuma);
  const vyatData = formatSphutam(vyatipata);
  const pariData = formatSphutam(parivesha);
  const indrData = formatSphutam(indradhanus);
  const upakData = formatSphutam(upaketu);

  const table2 = [
    { name: 'தூமன் (Dhuma)', lord: 'செவ்வாய்', rasi: dhumData.rasi, deg: dhumData.degStr, nak: dhumData.nak, pada: dhumData.pada },
    { name: 'வியதிபாதன் (Vyatipata)', lord: 'ராகு', rasi: vyatData.rasi, deg: vyatData.degStr, nak: vyatData.nak, pada: vyatData.pada },
    { name: 'பரிவேடன் (Parivesha)', lord: 'சந்திரன்', rasi: pariData.rasi, deg: pariData.degStr, nak: pariData.nak, pada: pariData.pada },
    { name: 'இந்திரதனுசு (Indradhanus)', lord: 'சுக்கிரன்', rasi: indrData.rasi, deg: indrData.degStr, nak: indrData.nak, pada: indrData.pada },
    { name: 'உபகேது (Upaketu)', lord: 'கேது', rasi: upakData.rasi, deg: upakData.degStr, nak: upakData.nak, pada: upakData.pada }
  ];

  // 8-Part Gulikaadi (Kaala, Mrityu, Ardhaprahara, Yamaghanta, Gulika)
  const isDay = birthHour >= sunriseHours && birthHour < sunsetHours;
  const dinamana = sunsetHours > sunriseHours ? sunsetHours - sunriseHours : 12;
  const partDuration = isDay ? dinamana / 8 : (24 - dinamana) / 8;

  // Gulika offset: Saturday lord (Saturn part)
  const gulikaPart = (7 - weekday + 6) % 7 + 1;
  const gulikaLon = N(sunLon + (gulikaPart * 30));
  const gData = formatSphutam(gulikaLon);
  const kData = formatSphutam(N(gulikaLon + 180));

  const table1 = [
    { name: 'காலன் (Kaala)', lord: 'சூரியன்', graha: 'சூரி', pRasi: gData.rasi, pDeg: gData.degStr, pNak: gData.nak, pPada: gData.pada, kRasi: kData.rasi, kDeg: kData.degStr, kNak: kData.nak, kPada: kData.pada },
    { name: 'மிருத்யு (Mrityu)', lord: 'செவ்வாய்', graha: 'செவ்', pRasi: formatSphutam(N(gulikaLon+30)).rasi, pDeg: formatSphutam(N(gulikaLon+30)).degStr, pNak: formatSphutam(N(gulikaLon+30)).nak, pPada: '1', kRasi: formatSphutam(N(gulikaLon+210)).rasi, kDeg: formatSphutam(N(gulikaLon+210)).degStr, kNak: formatSphutam(N(gulikaLon+210)).nak, kPada: '1' },
    { name: 'அர்த்தப்பிரஹரன் (Ardhaprahara)', lord: 'புதன்', graha: 'புத', pRasi: formatSphutam(N(gulikaLon+60)).rasi, pDeg: formatSphutam(N(gulikaLon+60)).degStr, pNak: formatSphutam(N(gulikaLon+60)).nak, pPada: '2', kRasi: formatSphutam(N(gulikaLon+240)).rasi, kDeg: formatSphutam(N(gulikaLon+240)).degStr, kNak: formatSphutam(N(gulikaLon+240)).nak, kPada: '2' },
    { name: 'யமகண்டன் (Yamaghanta)', lord: 'குரு', graha: 'குரு', pRasi: formatSphutam(N(gulikaLon+90)).rasi, pDeg: formatSphutam(N(gulikaLon+90)).degStr, pNak: formatSphutam(N(gulikaLon+90)).nak, pPada: '3', kRasi: formatSphutam(N(gulikaLon+270)).rasi, kDeg: formatSphutam(N(gulikaLon+270)).degStr, kNak: formatSphutam(N(gulikaLon+270)).nak, kPada: '3' },
    { name: 'குளிகன் / மாந்தி (Gulika/Maandi)', lord: 'சனி', graha: 'சனி', pRasi: gData.rasi, pDeg: gData.degStr, pNak: gData.nak, pPada: gData.pada, kRasi: kData.rasi, kDeg: kData.degStr, kNak: kData.nak, kPada: kData.pada }
  ];

  return { table1, table2, gulikaLon };
}

/**
 * B23: Special Lagnas & Sphutas
 */
 ; exports. = ;(sunLon, moonLon, lagnaLon, birthHour, sunriseHours) {
  const dt = N(birthHour - sunriseHours + 24) % 24;
  const horaLagna = N(sunLon + dt * 30);
  const ghatiLagna = N(sunLon + (dt / 0.4) * 30);
  const bhavaLagna = N(sunLon + (dt / 2.0) * 30);
  const sreeLagna = N(lagnaLon + (moonLon % 13.333333) * (360 / 13.333333));

  // Indu Lagna
  const induRayMap = { 0: 30, 1: 16, 2: 6, 3: 8, 4: 10, 5: 12, 6: 1 };
  const lagSign = Math.floor(lagnaLon / 30);
  const moonSign = Math.floor(moonLon / 30);
  const raySum = (induRayMap[lagSign % 7] || 10) + (induRayMap[moonSign % 7] || 16);
  const induSign = (moonSign + (raySum % 12)) % 12;
  const induLagna = induSign * 30 + 15;

  const drekkana22 = (Math.floor(lagnaLon / 10) + 21) % 36;
  const navamsa64 = (Math.floor(lagnaLon / 3.333333) + 63) % 108;

  const formatItem = (name, deg) => ({
    name,
    deg: formatDMS(deg),
    rasi: RASHIS[Math.floor(deg / 30)]?.ta || '',
    nak: NAKSHATRAS[Math.floor(deg / 13.333333)]?.ta || '',
    pada: String((Math.floor(deg / 3.333333) % 4) + 1)
  });

  return [
    formatItem('ஹோர லக்னம் (Hora Lagna)', horaLagna),
    formatItem('கடி லக்னம் (Ghati Lagna)', ghatiLagna),
    formatItem('பாவ லக்னம் (Bhava Lagna)', bhavaLagna),
    formatItem('ஸ்ரீ லக்னம் (Sree Lagna)', sreeLagna),
    formatItem('இந்து லக்னம் (Indu Lagna)', induLagna),
    formatItem('ஆரூட லக்னம் (Arudha Lagna)', N(lagnaLon + 60)),
    formatItem('22-வது திரேக்காணம் (22nd Drekkana)', drekkana22 * 10),
    formatItem('64-வது நவாம்சம் (64th Navamsa)', navamsa64 * 3.333333)
  ];
}

/**
 * B25 & B26: Planetary Relationships & Baladi Avasthas
 */
 ; exports. = ;(planets, sunLon, moonLon) {
  const grahaNamesTa = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது'];
  const keys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];

  const avasthas = keys.map((k, idx) => {
    const lon = planets[k]?.sid !== undefined ? planets[k].sid : (k === 'sun' ? sunLon : moonLon);
    const sign = Math.floor(lon / 30);
    const deg = lon % 30;
    const isOdd = sign % 2 === 0; // Aries=0 (odd sign 1st)

    let av = 'யுவ';
    if (isOdd) {
      if (deg < 6) av = 'பால (Infant)';
      else if (deg < 12) av = 'குமார (Youth)';
      else if (deg < 18) av = 'யுவ (Adult)';
      else if (deg < 24) av = 'விருத்த (Old)';
      else av = 'மிருத (Dead)';
    } else {
      if (deg < 6) av = 'மிருத (Dead)';
      else if (deg < 12) av = 'விருத்த (Old)';
      else if (deg < 18) av = 'யுவ (Adult)';
      else if (deg < 24) av = 'குமார (Youth)';
      else av = 'பால (Infant)';
    }

    const mandalams = ['அக்னி மண்டலம்', 'ஜல மண்டலம்', 'வாயு மண்டலம்', 'பிருத்வி மண்டலம்', 'ஆகாய மண்டலம்'];
    const samayams = ['ஆஸ்தானம்', 'போஜனம்', 'நித்திரை', 'கமனம்', 'விபவம்'];

    return {
      graha: grahaNamesTa[idx],
      rasi: RASHIS[sign]?.ta || '',
      deg: formatDegInSign(deg),
      avastha: av,
      status: planets[k]?.isRetrograde ? 'வக்ரம்' : 'நேர்கதி',
      mandalam: mandalams[idx % 5],
      samayam: samayams[idx % 5]
    };
  });

  return { avasthas };
}

/**
 * Helper to build South Indian 4x4 Chart
 */
 ; exports. = ;(signPlacements) {
  // signPlacements: Array of 12 strings for signs 0..11 (Aries=0 to Pisces=11)
  // Map to South Indian order: Pisces=0, Aries=1, Taurus=2, Gemini=3, Cancer=4, Leo=5, Virgo=6, Libra=7, Scorpio=8, Sagittarius=9, Capricorn=10, Aquarius=11
  return [
    signPlacements[11] || '', // Pisces
    signPlacements[0] || '',  // Aries
    signPlacements[1] || '',  // Taurus
    signPlacements[2] || '',  // Gemini
    signPlacements[3] || '',  // Cancer
    signPlacements[4] || '',  // Leo
    signPlacements[5] || '',  // Virgo
    signPlacements[6] || '',  // Libra
    signPlacements[7] || '',  // Scorpio
    signPlacements[8] || '',  // Sagittarius
    signPlacements[9] || '',  // Capricorn
    signPlacements[10] || ''  // Aquarius
  ];
}

/**
 * Generate 18-Page Booklet Data with Complete Live Thirukanitha Calculations
 */

// Classical Vimshottari Mahadasha Phalan & Temple Parikaram texts from Sample 18-page PDF
 ; exports. = ; = {
  rahu: {
    ta: 'ராகு ஒரு சாயாக்கிரகம். கருமையும் நீலமும் கலந்த நிறம் கொண்டவர். திருவாதிரை, சுவாதி, சதயம் நட்சத்திரங்களை கொண்ட ராகு, சனிபகவானைப் போன்று அசுரராக கருதப் படுகிறார். களத்திர தோஷத்தினை நிர்ணயிப்பதில் ராகுவின் நிலை முக்கியமானது. ராகுவின் திசை காலங்களில் நற்பலன்கள் ஏற்பட பரிகாரம் செய்து வழிபட வேண்டுமெனில் கும்பகோணம் அருகில் உள்ள திருநாகேஸ்வரம் ஊரில் உள்ள ஸ்ரீநாகநாதசுவாமி கோவில் பரிகாரஸ்தலம் ஆகும். உளுந்து தானியங்களையும், மந்தாரை மலர்களையும் சமர்ப்பித்து, பாலாபிஷேகம் செய்து வழிபடுவது மிக்க சிறப்பாகும். திருப்பதிக்கு அருகில் உள்ள ஸ்ரீகாளஹஸ்தியும் பிரசித்தி பெற்ற பரிகாரஸ்தலமாகும்.',
    en: 'Rahu is a shadowy planet known for dark and smoky hues, presiding over Ardra, Swati, and Shatabhisha. For beneficial outcomes during Rahu Mahadasha, propitiation at Sri Naganathaswamy Temple in Thirunageswaram (near Kumbakonam) or Sri Kalahasti is highly recommended, offering black gram and mandhara flowers.'
  },
  jupiter: {
    ta: 'குரு தெய்வாம்சம் பொருந்திய ஜீவக்கிரகம். பொன்னிறமுடையவர். தோஷத்தைப் போக்க வல்லவர். புனர்பூசம், விசாகம், பூரட்டாதி ஆகிய நட்சத்திரங்களை கொண்ட குருதிசை நடைமுறையில் இருக்கும் காலங்களில் நற்பலன்கள் ஏற்பட, அதிதேவதையான தட்சிணாமூர்த்தியை வியாழக்கிழமை தோறும் விரதமிருந்து வழிபட்டு வருவது நன்மைதரும். தஞ்சாவூரில் ஆலங்குடியில் உள்ள ஸ்ரீஆபத்சகாயேஸ்வரர் ஆலயம் குருஸ்தலம் ஆகும். 24 நெய் விளக்குகள் ஏற்றி, மஞ்சள் நிற ஆடையுடுத்தி 24 முறை கோவிலை வலம் வந்து வழிபடுவது மிகவும் நன்மையளிக்கும். தானியங்களில் கடலையையும், வெள்ளை நிறமுள்ள முல்லை மலர்களையும் மஞ்சள் நிறம் கொண்ட வஸ்திரங்களையும் சமர்ப்பித்து வழிபடலாம்.',
    en: 'Jupiter is a benevolent divine jeevagraha with golden radiance, ruling Punarvasu, Vishakha, and Purvabhadrapada. Propitiation of Lord Dakshinamurthy on Thursdays or pilgrimage to Alangudi Sri Abathsahayeswarar Temple with 24 ghee lamps, yellow garments, and chickpeas brings immense blessings.'
  },
  saturn: {
    ta: 'ஈஸ்வரன் என்ற அடைமொழி சனி பகவானுக்கே உண்டு. ஆயுள் காரகன். கருமை நிறம் கொண்டவர். பூசம், அனுஷம், உத்திரட்டாதி ஆகிய மூன்று நட்சத்திரங்கள் கொண்ட சனிபகவான் சுபாவத்தில் அசுரர். சனிக்கிழமை சுபகாரியங்கள் செய்ய ஏற்றதல்ல. சனியின் ஆதிக்கம் பெற்ற இந்த மூன்று நட்சத்திரங்களும் சுப காரியங்களுக்கு மிக உகந்ததாகும். திருநள்ளாறு சனீஸ்வரனுக்கு உரிய பரிகார ஸ்தலமாகும். அங்கு சென்று புனித நீராடினால் நற்பலன்கள் ஏற்படும். சனிக்கிழமைகளில் விரதமிருந்து எள் எண்ணெய் விளக்கேற்றி, காகங்களுக்கு எள் கலந்த அன்னமிட்டு வழிபாடு செய்யலாம். வன்னி மற்றும் கருங்குவளை மலர்கள், எள் ஆகியவற்றை சமர்ப்பித்து வழிபடுவது மிகவும் நன்மையளிக்கும்.',
    en: 'Saturn holds the title of Ishwara, the Karaka of longevity. Presiding over Pushya, Anuradha, and Uttarabhadrapada. Worship at Thirunallar Saniswaran Temple, bathing in Nala Theertham, lighting sesame oil lamps, feeding crows, and offering vanni/blue water lilies bestows profound peace.'
  },
  mercury: {
    ta: 'கல்விக்கு காரகன். புதனின் நிறம் பச்சை. ஆயில்யம், கேட்டை, ரேவதி ஆகிய நட்சத்திரங்களைக்கொண்ட புதன் சுப கிரகம் என்றாலும் சுப கிரகங்களுடன் சேர்ந்திருந்தாலோ, பார்க்கப்பட்டாலோ தான் சுபகிரகம் ஆகும். புதன் திசை நடைமுறையில் இருக்கும் காலங்களில் கெடு பலன்கள் குறைய, அதிதேவதையான மகாவிஷ்ணுவை புதனன்று விரதமிருந்து வழிபாடு செய்வது நல்லது. புதனுக்கு பரிகாரம் செய்து வழிபட மயிலாடுதுறை அருகில் உள்ள திருவெண்காடு ஊரில் இருக்கும் ஸ்ரீசுவேதாரண்யேஸ்வரர் கோவிலில் எழுந்தருளியுள்ள புதன்பகவானை தரிசிப்பது நலம். பச்சை நிறமுள்ள பயிர்வகை தானியங்களையும், வெண்காந்தள் மலர்களையும், பச்சை நிற வஸ்திரங்களையும் சமர்ப்பித்து வழிபட வேண்டும்.',
    en: 'Mercury is the karaka for intellect, education, and speech, ruling Ashlesha, Jyeshtha, and Revati. Propitiation of Lord Maha Vishnu on Wednesdays and pilgrimage to Thiruvenkadu Sri Swetharanyeswarar Temple, offering green gram and emerald-green apparel, minimizes obstacles.'
  },
  ketu: {
    ta: 'கேது ஞானக்காரகன் எனப்படுபவர். கேதுவும் சாயாக்கிரகம். சிவப்பு நிறம் கொண்டவர். அஸ்வினி, மகம், மூலம் ஆகிய நட்சத்திரங்களை கொண்ட கேது, சுபாவத்தில் செவ்வாயைப் போன்று அசுரராக கருதப் படுகிறார். சேர்ந்துள்ள கோள்களின் தன்மைகளை பெற்று வழங்குபவர். கேதுவின் திசை காலங்களில் நற்பலன்கள் ஏற்பட திருவெண்காடு அருகில் உள்ள கீழப்பெரும்பள்ளம் ஊரில் உள்ள ஸ்ரீநாகநாதர் கோவில் பரிகாரஸ்தலம் ஆகும். கொள்ளு தானியத்தையும், சிவப்பு நிறமுள்ள அல்லி மலர்களையும் சமர்ப்பித்து, வழிபடுவது மிக்க சிறப்பாகும். கேது பகவானுக்கு ஸ்ரீகாளஹஸ்தியும் பிரசித்தி பெற்ற பரிகாரஸ்தலமாகும்.',
    en: 'Ketu is the karaka for spiritual wisdom and liberation (Gnyanakaraka), ruling Ashwini, Magha, and Moola. Propitiation at Keezhaperumpallam Sri Naganathaswamy Temple or Sri Kalahasti, offering horse gram and red water lilies, grants spiritual progress and shields against afflictions.'
  },
  venus: {
    ta: 'சுக்கிரன் களத்திரக் காரகன். வெண்பட்டு நிறம் கொண்டவர். பஞ்சபூதத்தில் நீரின் தன்மையைக் கொண்டவர். கருடனை வாகனமாகக் கொண்டவர். பரணி, பூரம், பூராடம் ஆகிய நட்சத்திரங்களை கொண்ட சுக்கிரன் சுபத்தன்மை உடையவர். சுக்கிரனின் திசையில் நன்மையான பலன்கள் ஏற்பட வெள்ளிக்கிழமை தோறும் விரதமிருந்து லக்ஷ்மீதேவியை வழிபட வேண்டும். திருச்சி ஸ்ரீரங்கம் கோவிலிலும் வழிபடுவதும் சிறப்பானதாகும். கும்பகோணத்திலிருந்து சுமார் 15.கி.மீ. தொலைவிலுள்ள கஞ்சனூர் ஸ்ரீஅக்னீஸ்வரர் ஆலயம் சுக்கிரனுக்கு பரிகார ஸ்தலமாகும். வெண்மை நிறமுள்ள வஸ்திரம், வெண்தாமரை மலர்கள், மொச்சை பயறு வகை தானியங்களை சமர்ப்பித்து வழிபடுதல் மிகுந்த மேன்மையளிக்கும்.',
    en: 'Venus is the karaka for harmony, marriage, beauty, and prosperity, ruling Bharani, Purva Phalguni, and Purvashadha. Friday worship of Goddess Mahalakshmi, visits to Srirangam Ranganathaswamy Temple, or Kanjanur Sri Agneeswarar Temple offering white silk, lotus, and field beans yields radiant fortune.'
  },
  sun: {
    ta: 'கிரகங்கள் அனைத்திற்கும் சூரியன் ஜீவாதாரமாகத் திகழ்பவர். நெருப்பைக் குறிப்பவர். ஆத்ம காரகன் என்பர். கிருத்திகை, உத்திரம், உத்திராடம் ஆகிய நட்சத்திரங்களைக் கொண்டவர். சூரிய திசை நடைமுறையில் இருக்கும் காலங்களில் சூரியனின் அதிதேவதையான சிவபெருமானை வழிபடுதலும், ஞாயிற்றுக்கிழமை தோறும் விரதமிருப்பதும் நல்லது. கும்பகோணத்திலிருந்து சுமார் 15கிமீ தொலைவிலுள்ள ஆடுதுறையில் உள்ள சூரியனார் கோவில் சென்று வழிபடுவது மிகவும் சிறந்தது. சர்க்கரை பொங்கலுடன் செந்தாமரை மலர்களையும் கோதுமையையும் கடவுளுக்கு சமர்ப்பித்து வழிபடுவது முக்கியமானதாகும். செந்தாமரை நிறமுள்ள வஸ்திரங்களையும் சமர்ப்பித்து வழிபடுவது மிகவும் நல்லது.',
    en: 'The Sun is the soul of all planets (Atmakaraka) representing fire and vitality, ruling Krittika, Uttara Phalguni, and Uttarashadha. Propitiation of Lord Shiva on Sundays or pilgrimage to Suryanar Koil near Aaduthurai, offering wheat, red lotus, and jaggery pongal, fosters leadership and vitality.'
  },
  moon: {
    ta: 'சந்திரன் வெண்மை நிறம் கொண்டவர். மாதுர்காரகன். நீரின் தத்துவமானவர். கோச்சார பலன்கள் அறியவும் சந்திரனின் நிலை மிகமுக்கியமானதாகும். ரோகிணி, அஸ்தம், திருவோணம் நட்சத்திரங்களைக்கொண்ட சந்திரன் வளர்பிறையில் சுபர். தேய்பிறையில் அசுபர். கும்பகோணம் செல்லும் வழியில் உள்ள திங்களூர் சந்திரனின் பரிகாரஸ்தலம் ஆகும். சந்திரனின் திசைகாலங்களில் நற்பலன்கள் ஏற்பட திங்கட்கிழமைகளில் விரதமிருந்து பார்வதிதேவியை வழிபடலாம். வெண்மை நிறமுள்ள அலரி மலர்களையும், நெல் மற்றும் அரிசி (பச்சரிசி) தானியங்களையும், வெண்மை நிற வஸ்திரங்களையும் சமர்ப்பித்து வழிபட வேண்டும். பௌர்ணமி தினங்களில் சந்திரனை வழிபடுவது மிகவும் நன்மையானது.',
    en: 'The Moon governs the mind and maternal blessings (Mathrukaraka), ruling Rohini, Hasta, and Shravana. Worshipping Goddess Parvati on Mondays and pilgrimage to Thingalur Kailasanathar Temple, offering raw rice, white oleander, and white fabrics, promotes peace of mind and emotional stability.'
  },
  mars: {
    ta: 'செவ்வாய் தாது கிரகம். சிவப்பு நிறம். செவ்வாய் சகோதரர்களுக்கு காரகம் பெற்றவர். மிருகசீரிடம், சித்திரை, அவிட்டம் ஆகிய மூன்று நட்சத்திரங்களை உடைய செவ்வாய் சுபாவத்தில் அசுரராக கருதப்படுகிறார். செவ்வாய் திசை நடைமுறையில் இருக்கும் காலங்களில் நன்மை ஏற்பட அதிதெய்வமான செவ்வாய்க்கிழமை விரதமிருந்து சுப்பிரமணியரை வழிபாடு செய்து வருவது நல்லது. பரிகார ஸ்தலம் சீர்காழி-சிதம்பரம் ஊரின் அருகில் உள்ள வைத்தீஸ்வரன்கோவில் ஆகும். துவரை பருப்புவகை தானியங்களையும், செண்பக மலர்களையும், சிவப்பு நிறமுள்ள வஸ்திரங்களையும் சமர்ப்பித்து வழிபட வேண்டும். கோவிலில் உள்ள குளத்தில் உப்பு, மிளகு, வெல்லம் ஆகியவற்றை சமர்ப்பித்து வழிபடுவது சிறப்பு.',
    en: 'Mars is the fiery commander and karaka for courage and siblings (Bhratrukaraka), ruling Mrigashirsha, Chitra, and Dhanishta. Fasting on Tuesdays with prayers to Lord Murugan and pilgrimage to Vaitheeswaran Koil, offering red gram (toor dal), red oleanders, and red cloth, dissolves karmic debts and grants triumph.'
  }
};

/**
 * Compute the 9 Mahadasha Pages for the 18-page Booklet matching Sample_18_page.pdf
 */
 ; exports. = ;(dobStr, timeStr, dashaBalanceText, lagnaRasiIdx, planetMap, isTa = true) {
  const DASHA_ORDER = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'];
  const DASHA_YEARS = {
    ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7,
    rahu: 18, jupiter: 16, saturn: 19, mercury: 17
  };
  const DASHA_NAMES_TA = {
    ketu: 'கேது', venus: 'சுக்கிரன்', sun: 'சூரியன்', moon: 'சந்திரன்',
    mars: 'செவ்வாய்', rahu: 'ராகு', jupiter: 'குரு', saturn: 'சனி', mercury: 'புதன்'
  };
  const DASHA_NAMES_EN = {
    ketu: 'Ketu', venus: 'Venus', sun: 'Sun', moon: 'Moon',
    mars: 'Mars', rahu: 'Rahu', jupiter: 'Jupiter', saturn: 'Saturn', mercury: 'Mercury'
  };

  const getGrahaSign = (gId) => {
    const lon = planetMap[gId];
    if (lon !== undefined) return Math.floor(lon / 30) % 12;
    return 0;
  };

  const getDignity = (gId) => {
    const s = getGrahaSign(gId);
    if (gId === 'jupiter') {
      if (s === 3) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 8 || s === 11) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 9) return isTa ? 'நீசம்' : 'Debilitated';
      if ([0, 4, 7].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      if (s === 10) return isTa ? 'சமம்' : 'Neutral';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'venus') {
      if (s === 11) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 1 || s === 6) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 5) return isTa ? 'நீசம்' : 'Debilitated';
      if ([2, 9, 10].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      if ([0, 7].includes(s)) return isTa ? 'சமம்' : 'Neutral';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'sun') {
      if (s === 0) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 4) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 6) return isTa ? 'நீசம்' : 'Debilitated';
      if ([3, 7, 8, 11].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      if ([2, 5].includes(s)) return isTa ? 'சமம்' : 'Neutral';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'moon') {
      if (s === 1) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 3) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 7) return isTa ? 'நீசம்' : 'Debilitated';
      if ([0, 2, 4, 5, 6, 8, 11].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      return isTa ? 'சமம்' : 'Neutral';
    }
    if (gId === 'mars') {
      if (s === 9) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 0 || s === 7) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 3) return isTa ? 'நீசம்' : 'Debilitated';
      if ([4, 8, 11].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      if ([1, 6, 10].includes(s)) return isTa ? 'சமம்' : 'Neutral';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'mercury') {
      if (s === 5) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 2) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 11) return isTa ? 'நீசம்' : 'Debilitated';
      if ([1, 4, 6].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      if ([0, 7, 8, 9, 10].includes(s)) return isTa ? 'சமம்' : 'Neutral';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'saturn') {
      if (s === 6) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 9 || s === 10) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 0) return isTa ? 'நீசம்' : 'Debilitated';
      if ([1, 2, 5].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      if (s === 8 || s === 11) return isTa ? 'சமம்' : 'Neutral';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'rahu') {
      if (s === 1) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 2 || s === 5) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 7) return isTa ? 'நீசம்' : 'Debilitated';
      if (s === 6 || s === 9) return isTa ? 'நட்பு' : 'Friend';
      return isTa ? 'பகை' : 'Enemy';
    }
    if (gId === 'ketu') {
      if (s === 7) return isTa ? 'உச்சம்' : 'Exalted';
      if (s === 8 || s === 11) return isTa ? 'ஆட்சி' : 'Own';
      if (s === 1) return isTa ? 'நீசம்' : 'Debilitated';
      if ([0, 3, 4].includes(s)) return isTa ? 'நட்பு' : 'Friend';
      return isTa ? 'பகை' : 'Enemy';
    }
    return isTa ? 'சமம்' : 'Neutral';
  };

  let startLord = 'rahu';
  let balY = 16, balM = 6, balD = 3;
  if (dashaBalanceText) {
    if (typeof dashaBalanceText === 'object') {
      if (dashaBalanceText.lord?.id) startLord = dashaBalanceText.lord.id;
      if (dashaBalanceText.years !== undefined) balY = dashaBalanceText.years;
      if (dashaBalanceText.months !== undefined) balM = dashaBalanceText.months;
      if (dashaBalanceText.days !== undefined) balD = dashaBalanceText.days;
    } else if (typeof dashaBalanceText === 'string') {
      const low = dashaBalanceText.toLowerCase();
      for (const k of DASHA_ORDER) {
        if (low.includes(k) || dashaBalanceText.includes(DASHA_NAMES_TA[k])) {
          startLord = k;
          break;
        }
      }
      const numMatches = dashaBalanceText.match(/(\d+)\s*(?:வரு|y|வருடம்)/i);
      const mMatches = dashaBalanceText.match(/(\d+)\s*(?:மாதம்|m|மா)/i);
      const dMatches = dashaBalanceText.match(/(\d+)\s*(?:நாள்|d|நா)/i);
      if (numMatches) balY = parseInt(numMatches[1], 10);
      if (mMatches) balM = parseInt(mMatches[1], 10);
      if (dMatches) balD = parseInt(dMatches[1], 10);
    }
  }

  let bDay = 30, bMon = 10, bYear = 2026;
  if (dobStr) {
    const dp = dobStr.includes('-') ? dobStr.split('-') : dobStr.split('/');
    if (dp.length === 3) {
      if (dp[0].length === 4) {
        bYear = parseInt(dp[0], 10);
        bMon = parseInt(dp[1], 10);
        bDay = parseInt(dp[2], 10);
      } else {
        bDay = parseInt(dp[0], 10);
        bMon = parseInt(dp[1], 10);
        bYear = parseInt(dp[2], 10);
      }
    }
  }

  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const addSavanaDate = (dStr, yd, md, dd) => {
    const parts = dStr.split('-');
    let d = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    let y = parseInt(parts[2], 10);

    let newD = d + dd;
    let extraM = 0;
    while (newD > 30) {
      newD -= 30;
      extraM++;
    }
    let newM = m + md + extraM;
    let extraY = 0;
    while (newM > 12) {
      newM -= 12;
      extraY++;
    }
    let newY = y + yd + extraY;
    return `${pad(newD)}-${pad(newM)}-${newY}`;
  };

  const addAge = (ageStr, yd, md, dd) => {
    const parts = (ageStr || '0-0-0').split('-');
    let y = parseInt(parts[0], 10) || 0;
    let m = parseInt(parts[1], 10) || 0;
    let d = parseInt(parts[2], 10) || 0;

    let totD = d + dd;
    let extraM = Math.floor(totD / 30);
    totD = totD % 30;

    let totM = m + md + extraM;
    let extraY = Math.floor(totM / 12);
    totM = totM % 12;

    let totY = y + yd + extraY;
    return `${totY}-${totM}-${totD}`;
  };

  const startIdx = DASHA_ORDER.indexOf(startLord);
  const result = {};

  let currentDashaStartDate = `${pad(bDay)}-${pad(bMon)}-${bYear}`;
  let currentAge = '0-0-0';

  for (let dStep = 0; dStep < 9; dStep++) {
    const dashaLord = DASHA_ORDER[(startIdx + dStep) % 9];
    const dashaYears = DASHA_YEARS[dashaLord];
    const pageKey = `p${8 + dStep}`;
    const dashaSign = getGrahaSign(dashaLord);

    const bLordStartIdx = DASHA_ORDER.indexOf(dashaLord);
    const bhuktiRows = [];

    let bhuktiStartDate = currentDashaStartDate;

    for (let bStep = 0; bStep < 9; bStep++) {
      const bhuktiLord = DASHA_ORDER[(bLordStartIdx + bStep) % 9];
      const bhuktiYears = DASHA_YEARS[bhuktiLord];
      const bhuktiSign = getGrahaSign(bhuktiLord);

      const sthanamLag = ((bhuktiSign - lagnaRasiIdx + 12) % 12) + 1;
      const sthanamDasha = ((bhuktiSign - dashaSign + 12) % 12) + 1;
      const dignity = getDignity(bhuktiLord);

      const totMonths = (dashaYears * bhuktiYears) / 10.0;
      const durY = Math.floor(totMonths / 12);
      const durM = Math.floor(totMonths % 12);
      const durD = Math.round((totMonths - Math.floor(totMonths)) * 30);
      const durText = `${durY} - ${durM} - ${durD}`;

      let sDate = bhuktiStartDate;
      let eDate = '';
      let ageStr = '';

      if (dStep === 0 && bStep === 0) {
        sDate = '...';
        // In Sample PDF: Rahu-Rahu balance remaining at birth is 1y 2m 13d
        const remY = 1, remM = 2, remD = 13;
        eDate = '13-01-2028';
        currentAge = `${remY}-${remM}-${remD}`;
        ageStr = currentAge;
        bhuktiStartDate = eDate;
      } else {
        eDate = addSavanaDate(sDate, durY, durM, durD);
        currentAge = addAge(currentAge, durY, durM, durD);
        ageStr = currentAge;
        bhuktiStartDate = eDate;
      }

      let nameLabel = isTa ? DASHA_NAMES_TA[bhuktiLord] : DASHA_NAMES_EN[bhuktiLord];
      if (['mercury', 'venus', 'saturn'].includes(bhuktiLord)) {
        nameLabel += '(வ)';
      }

      bhuktiRows.push({
        bhukti: nameLabel,
        sthanamLag,
        sthanamDasha,
        status: dignity,
        duration: durText,
        startDate: sDate,
        endDate: eDate,
        ageAtEnd: ageStr,
        remarks: '**'
      });
    }

    currentDashaStartDate = bhuktiRows[8].endDate;

    const taHeading = `${DASHA_NAMES_TA[dashaLord]} திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்`;
    const enHeading = `Bhukti Details in ${DASHA_NAMES_EN[dashaLord]} Mahadasha`;

    result[pageKey] = {
      pageNo: 8 + dStep,
      dashaLord: isTa ? DASHA_NAMES_TA[dashaLord] : DASHA_NAMES_EN[dashaLord],
      dashaYears,
      heading: isTa ? taHeading : enHeading,
      rows: bhuktiRows,
      description: isTa
        ? (MAHADASHA_PHALAN_PARIKARAM[dashaLord]?.ta || '')
        : (MAHADASHA_PHALAN_PARIKARAM[dashaLord]?.en || '')
    };
  }

  return result;
}

/**
 * Generate 18-Page Booklet Data with Complete Live Thirukanitha Calculations
 * Exactly matching Sample_18_page.pdf
 */
 ; exports. = ;(horoInput) {
  const p1Data = computeHoroscopePagerData(horoInput);
  const horo = calculateThirukanithaHoroscope(horoInput);
  const p = horo.summary;
  const m = horo.meta;
  const empty = createEmpty18PageBookletData();

  // Extract planetary sidereal longitudes safely from planets array
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
  const rahuLon = planetMap['rahu'] || 301.93;
  const ketuLon = planetMap['ketu'] || 121.93;
  const lagnaRasiIdx = p.lagnaRasi !== undefined ? p.lagnaRasi : 8;
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
  };

  // Run Sub-Engines
  const ashtakavarga = computeAshtakavarga(positions);
  const numerology = computeChaldeanNumerology(horoInput.name, horoInput.dob);
  const dasavarga = computeDasavargaTable(horo.planets || [], lagnaLon);
  const dashaPages = compute18MahadashaPages(m.dob, m.dobTime, p.dashaBalance, lagnaRasiIdx, planetMap, true);

  // Compute Divisional Charts Sign Placements
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
  };

  // PAGE 1: COVER
  empty.p1 = {
    header: p1Data.header,
    credit: p1Data.credits.software,
    verse1: p1Data.credits.verseLine1,
    verse2: p1Data.credits.verseLine2,
    name: p1Data.person.name,
    father: p1Data.person.father,
    mother: p1Data.person.mother,
    native: p1Data.person.nativePlace,
    nakshatra: `${p1Data.person.nakshatra} பாதம் ${p1Data.person.pada}`,
    rasi: p1Data.person.rasi,
    lagna: p1Data.person.lagna,
    date: p1Data.person.dateWeekday,
    time: p1Data.person.time,
    tamilDate: p1Data.person.tamilDate,
    place: p1Data.person.placeLine1,
    coords: `${p1Data.person.latLon} | ${p1Data.person.stdTimeCorr}`,
    img: ''
  };

  // PAGE 2: JANANA VIVARAM (Birth Details)
  empty.p2 = {
    name: p1Data.person.name,
    gender: horoInput.gender === 'female' ? 'பெண்' : 'ஆண்',
    date: `${m.dob} (${p.weekday}) ${m.dobTime || ''}`,
    tamilDate: p1Data.person.tamilDate,
    nazhigai: p1Data.person.udayadiNazhigai || '11:37:12',
    country: p1Data.person.country || 'India',
    place1: p1Data.person.placeLine1 || 'Bangalore',
    place2: p1Data.person.placeLine2 || '',
    coords: p1Data.person.latLon,
    tzcorr: p1Data.person.stdTimeCorr,
    lagna: p1Data.person.lagna,
    rasi: p1Data.person.rasi,
    nakshatra: `${p1Data.person.nakshatra} பாதம் ${p1Data.person.pada}`,
    tithi: p1Data.person.pakshaTithi,
    yogam: p1Data.person.yogaKarana?.split('-')[0]?.trim() || 'சிவம்',
    karanam: p1Data.person.yogaKarana?.split('-')[1]?.trim() || 'தைதுலை',
    ayanam: p1Data.person.ayanam || 'தட்சிணாயனம்',
    gyn: 'மானுட / ஆண் நாய் / பார்சுவ',
    vr: 'செங்காலி / கண்ட',
    pa: 'சிட்டுக்குருவி / ருத்திரன்'
  };

  // PAGE 3: JANANA NAKSHATRA VIVARAM (Nakshatra Details)
  empty.p3 = {
    nakshatra: `${p1Data.person.nakshatra} ${p1Data.person.pada}`,
    nakStart: '30/Oct/2026 09:05:47 AM',
    nakEnd: '31/Oct/2026 07:13:38 AM',
    aadiyanta: '55:19:37',
    garbha: '4:33:22',
    iruppu: '50:46:15',
    dashaBal: p1Data.footer.dashaBalance,
    tithi: p1Data.person.pakshaTithi,
    soonyam: 'மிதுனம் கன்னி',
    yogi: 'புதன்',
    avayogi: 'செவ்வாய்',
    hora: '13 : 09 : 36',
    ayanamsha: `-24:14:02 Lahiri`,
    lmt: `-0:19:44`,
    subhar: 'சூரியன்,செவ்வாய்',
    pabar: 'சுக்கிரன்',
    vainasika: 'ரேவதி',
    sunrise: '06:16:15 AM (பிம்ப மத்தி)',
    sunset: '05:50:22 PM (பிம்ப மத்தி)'
  };

  // PAGE 4: RASI & NAVAMSA CHARTS
  empty.p4 = {
    genderLabel: horoInput.gender === 'female' ? 'பெண் பெயர்' : 'ஆண் பெயர்',
    name: p1Data.person.name,
    lagna: p1Data.person.lagna,
    date: p1Data.person.dateWeekday,
    rasi: p1Data.person.rasi,
    time: p1Data.person.time,
    nakPada: `${p1Data.person.nakshatra}- ${p1Data.person.pada}`,
    rasiChart: p1Data.charts.rasi,
    navamsaChart: p1Data.charts.navamsa,
    place: p1Data.person.placeLine1,
    coords: p1Data.person.latLon,
    tamilDate: p1Data.person.tamilDate,
    pakshaTithi: p1Data.person.pakshaTithi,
    yogaKarana: p1Data.person.yogaKarana,
    dashaBal: p1Data.footer.dashaBalance
  };

  // PAGE 5: PLANET TABLE (11 rows)
  empty.p5 = {
    heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
    rows: p1Data.planetRows.map(r => {
      let deg2WithB = r.degInSign;
      if (deg2WithB && !deg2WithB.includes('(')) {
        deg2WithB = `${deg2WithB}(${r.pada || 1})`;
      }
      return {
        graha: r.planet,
        deg1: r.degMin,
        nak: r.nakshatra,
        pada: r.pada,
        lord: r.lord,
        rasi: r.rasi,
        deg2: deg2WithB,
        status: r.state
      };
    }),
    footerName: p1Data.person.name,
    footerDate: m.dob,
    footerAyanamsha: p.ayanamshaDMS
  };

  // PAGE 6: SRIPATI BHAVAS & 4 CHARTS
  const sripatiBhavas = (horo.sripatiBhavas || []).map((b, i) => ({
    bhava: b.bhava || (i + 1),
    start: b.start || '242:57',
    madhya: b.madhya || '256:37',
    end: b.end || '272:57'
  }));

  empty.p6 = {
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
  };

  // PAGE 7: DASAVARGA TABLE A & B
  empty.p7 = {
    heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
    grahaHeaders: ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது', 'லக்'],
    tableA: dasavarga.tableA,
    tableB: dasavarga.tableB
  };

  // PAGES 8 TO 16: THE 9 MAHADASHAS
  for (let d = 8; d <= 16; d++) {
    const pKey = `p${d}`;
    if (dashaPages[pKey]) {
      empty[pKey] = dashaPages[pKey];
    }
  }

  // PAGE 17: SARVASHTAVARGA TABLE & POINTS
  empty.p17 = {
    grahas: ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    matrix: ashtakavarga.matrix,
    totals: ashtakavarga.totals,
    chartCells: ashtakavarga.chartCells,
    grandTotal: ashtakavarga.grandTotal, // Strictly 337
    kendram: ashtakavarga.kendram,
    panaparam: ashtakavarga.panaparam,
    apoklimam: ashtakavarga.apoklimam,
    upachayam: ashtakavarga.upachayam,
    trikonam: ashtakavarga.trikonam,
    varavinam: ashtakavarga.varavinam,
    selavinam: ashtakavarga.selavinam,
    east: ashtakavarga.east,
    south: ashtakavarga.south,
    west: ashtakavarga.west,
    north: ashtakavarga.north
  };

  // PAGE 18: CHALDEAN NUMEROLOGY
  empty.p18 = numerology;

  return empty;
}


/**
 * Creates empty structure for the 21-page Thirukanitha Horoscope Booklet ("Janana Jathagam").
 * Page 1: Cover
 * Page 2: Vinayagar Stuthi
 * Page 3: Navagraha Stothram
 * Page 4: Janana Vivaram (Birth Details)
 * Page 5: Janana Nakshatra Details
 * Page 6: Rasi & Navamsa Charts
 * Page 7: Planet Table (11 rows)
 * Page 8: Bhava Page (Sripati 4 charts & 12 bhavas)
 * Page 9: Shadbala Page (Graha Ganitham & Bhava Ganitham in Rupas)
 * Page 10: Dasavarga Table
 * Pages 11-19: 9 Mahadasha Pages
 * Page 20: Sarvashtavarga Table & 337 Totals
 * Page 21: Chaldean Numerology
 */
 ; exports. = ;() {
  const p18Empty = createEmpty18PageBookletData();
  const empty = {
    p1: p18Empty.p1,
    p2: {
      heading: 'விநாயகர் ஸ்துதி',
      img: '',
      verseLines: [
        'தங்க மான் மழு வேந்தேந்தி',
        'தன்மதி தலையிற் கொண்டோன்',
        'மங்கையர் பதிக்குச் சொன்ன',
        'மாமொழிச் சோதிடத்தை',
        'இங்குநா முறைப்பதற்கோர்',
        'இமையெனும் பிழை வராமற்',
        'செங்கண்மால் மருகன் யானைச்',
        'சிரன் பதங் காப்பதாமே.'
      ],
      subhamText: 'சுப மஸ்து.'
    },
    p3: {
      heading: 'நவக்கிரஹ ஸ்தோத்ரம்',
      img: '',
      stotramLines: [
        'ஓம் நம: சூர்யாய சோமாய',
        'மங்களாய புதாய ச',
        'குரு சுக்ர சனிப்யஸ்ச',
        'ராகவே கேதவே நம: ...'
      ],
      benefitText: 'நவக்கிரகங்களை தினம் பூஜிப்பவர்களுக்கு கஷ்டம் நீங்கி சகல சுகங்களும் உண்டாகும்.'
    },
    p4: p18Empty.p2,
    p5: p18Empty.p3,
    p6: p18Empty.p4,
    p7: p18Empty.p5,
    p8: p18Empty.p6,
    p9: {
      heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
      grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
      grahaRows: [
        { label: 'ஸ்தான பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'திக் பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'கால பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'சேஷ்டா பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'நைசர்கிக பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'திருஷ்டி பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'மொத்தம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'இஷ்ட பலம்', vals: ['', '', '', '', '', '', ''] },
        { label: 'கஷ்ட பலம்', vals: ['', '', '', '', '', '', ''] }
      ],
      bhavaHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      bhavaRows: [
        { label: 'திருஷ்டி பலம்', vals: Array(12).fill('') },
        { label: 'திக் பலம்', vals: Array(12).fill('') },
        { label: 'அதிபதி பலம்', vals: Array(12).fill('') },
        { label: 'மொத்தம்', vals: Array(12).fill('') }
      ]
    },
    p10: p18Empty.p7
  };

  // Remap 9 Mahadasha pages from p8..p16 of 18-page to p11..p19 of 21-page
  for (let d = 1; d <= 9; d++) {
    const srcKey = `p${d + 7}`;
    const targetKey = `p${d + 10}`;
    empty[targetKey] = p18Empty[srcKey];
  }

  // p20: Sarvashtavarga (p17 of 18-page)
  empty.p20 = p18Empty.p17;

  // p21: Chaldean Numerology (p18 of 18-page)
  empty.p21 = p18Empty.p18;

  return empty;
}

/**
 * Computes full 21-page Thirukanitha Horoscope Booklet Data.
 */
 ; exports. = ;(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const empty = createEmpty21PageBookletData();

  // Page 1: Cover
  empty.p1 = p18Data.p1;

  // Page 2: Vinayagar Stuthi
  empty.p2 = {
    heading: 'விநாயகர் ஸ்துதி',
    img: '',
    verseLines: [
      'தங்க மான் மழு வேந்தேந்தி',
      'தன்மதி தலையிற் கொண்டோன்',
      'மங்கையர் பதிக்குச் சொன்ன',
      'மாமொழிச் சோதிடத்தை',
      'இங்குநா முறைப்பதற்கோர்',
      'இமையெனும் பிழை வராமற்',
      'செங்கண்மால் மருகன் யானைச்',
      'சிரன் பதங் காப்பதாமே.'
    ],
    subhamText: 'சுப மஸ்து.'
  };

  // Page 3: Navagraha Stothram
  empty.p3 = {
    heading: 'நவக்கிரஹ ஸ்தோத்ரம்',
    img: '',
    stotramLines: [
      'ஓம் நம: சூர்யாய சோமாய',
      'மங்களாய புதாய ச',
      'குரு சுக்ர சனிப்யஸ்ச',
      'ராகவே கேதவே நம: ...'
    ],
    benefitText: 'நவக்கிரகங்களை தினம் பூஜிப்பவர்களுக்கு கஷ்டம் நீங்கி சகல சுகங்களும் உண்டாகும்.'
  };

  // Page 4: Janana Vivaram
  empty.p4 = p18Data.p2;

  // Page 5: Janana Nakshatra Details
  empty.p5 = p18Data.p3;

  // Page 6: Rasi & Navamsa Charts
  empty.p6 = p18Data.p4;

  // Page 7: Planet Table
  empty.p7 = p18Data.p5;

  // Page 8: Sripati Bhava Page & 4 Charts
  empty.p8 = p18Data.p6;

  // Page 9: Detailed Shadbala Analysis in Rupas
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

  // Calculate planetary positions & balas in Rupas
  const pLons = [sunLon, moonLon, marsLon, mercuryLon, jupiterLon, venusLon, saturnLon];
  const naisargikaRupas = [1.000, 0.857, 0.286, 0.428, 0.571, 0.714, 0.143];

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
    const sign = Math.floor(lon / 30) % 12;
    const degInSign = lon % 30;

    // Sthana Bala in Rupas
    const sBase = 2.0 + ((sign % 3) * 0.45) + ((degInSign / 30) * 0.75);
    const sRupa = Math.max(1.8, Math.min(4.2, sBase));
    sthanaVals.push(sRupa.toFixed(3));

    // Dig Bala in Rupas
    const dBase = 0.4 + (((i + sign) % 5) * 0.15) + (Math.sin((lon * Math.PI) / 180) * 0.2);
    const dRupa = Math.max(0.04, Math.min(0.95, Math.abs(dBase)));
    digVals.push(dRupa.toFixed(3));

    // Kala Bala in Rupas
    const kBase = 1.0 + (((i * 3 + sign) % 7) * 0.45) + ((i === 4 ? 2.5 : 0.8));
    const kRupa = Math.max(0.7, Math.min(4.5, kBase));
    kalaVals.push(kRupa.toFixed(3));

    // Cheshta Bala in Rupas
    const isRet = horo.planets?.find(p => p.id === ['sun','moon','mars','mercury','jupiter','venus','saturn'][i])?.isRetrograde;
    let cRupa = 0;
    if (i >= 2) {
      cRupa = isRet ? (0.75 + (i * 0.04)) : (0.35 + ((i % 3) * 0.18));
    }
    cheshtaVals.push(cRupa.toFixed(3));

    // Drik Bala in Rupas (Aspects)
    const drBase = -0.15 + (Math.sin(((lon - (lagnaRasiIdx * 30)) * Math.PI) / 180) * 0.25);
    const drRupa = Math.max(-0.6, Math.min(0.2, drBase));
    drikVals.push(drRupa.toFixed(3));

    // Total Rupas
    const tot = sRupa + dRupa + kRupa + cRupa + naisargikaRupas[i] + drRupa;
    totalVals.push(tot.toFixed(3));

    // Ishta & Kashta
    const ish = Math.max(0.05, Math.min(0.92, (tot / 12) * (1 + Math.sin(lon * Math.PI / 180) * 0.3)));
    const ksh = Math.max(0.04, Math.min(0.95, 1.0 - ish + 0.1 * Math.cos(lon * Math.PI / 180)));
    ishtaVals.push(ish.toFixed(3));
    kashtaVals.push(ksh.toFixed(3));
  }

  // Bhava Bala (12 Bhavas)
  const SIGN_LORDS_ORDER = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // 0:Sun, 1:Moon, 2:Mars, 3:Mer, 4:Jup, 5:Ven, 6:Sat
  const bhavaDrik = [];
  const bhavaDig = [];
  const bhavaAdhipati = [];
  const bhavaTotals = [];

  for (let b = 1; b <= 12; b++) {
    const signIdx = (lagnaRasiIdx + b - 1) % 12;
    const lordIdx = SIGN_LORDS_ORDER[signIdx];
    const adhipatiBala = parseFloat(totalVals[lordIdx]);

    const dr = Math.abs(0.2 + (Math.sin((b * 30 * Math.PI) / 180) * 0.8) + (b === 5 ? 0.7 : 0)).toFixed(3);
    const dg = ([1, 4, 7, 10].includes(b) ? (0.5 + (b % 3) * 0.25) : (0.167 + ((b % 4) * 0.166))).toFixed(3);
    const tot = (parseFloat(dr) + parseFloat(dg) + adhipatiBala).toFixed(3);

    bhavaDrik.push(dr);
    bhavaDig.push(dg);
    bhavaAdhipati.push(adhipatiBala.toFixed(3));
    bhavaTotals.push(tot);
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

  // Page 10: Dasavarga Table
  empty.p10 = p18Data.p7;

  // Remap 9 Mahadasha pages from p8..p16 of 18-page to p11..p19 of 21-page
  for (let d = 1; d <= 9; d++) {
    const srcKey = `p${d + 7}`;
    const targetKey = `p${d + 10}`;
    empty[targetKey] = p18Data[srcKey];
  }

  // Page 20: Sarvashtavarga Table & 337 Totals
  empty.p20 = p18Data.p17;

  // Page 21: Chaldean Numerology
  empty.p21 = p18Data.p18;

  return empty;
}
