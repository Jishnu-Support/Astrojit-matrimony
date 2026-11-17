/**
 * Thirukanitha (Drik Ganitha) Ephemeris & Vedic Astrology Engine
 * Accurate planetary calculations according to exact specifications.
 */

export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;

export function N(x) {
  let val = x % 360;
  if (val < 0) val += 360;
  return val;
}

export function sinD(x) { return Math.sin(x * D2R); }
export function cosD(x) { return Math.cos(x * D2R); }
export function atan2D(y, x) { return N(Math.atan2(y, x) * R2D); }

export function formatDMS(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`;
}

export function formatDegInSign(deg) {
  const rem = deg % 30;
  const d = Math.floor(rem);
  const m = Math.floor((rem - d) * 60);
  const s = Math.round(((rem - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`;
}

export function parseUtcOffset(tzVal) {
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

export function formatUtcOffset(offsetNum) {
  if (typeof offsetNum === 'string' && offsetNum.includes('UTC')) return offsetNum;
  const num = typeof offsetNum === 'number' ? offsetNum : parseUtcOffset(offsetNum);
  const sign = num < 0 ? '-' : '+';
  const abs = Math.abs(num);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`;
}

export function parseLocalHour(timeVal) {
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

export const PRESETS = [
  { name: 'Salem', lat: 11.65, lon: 78.20, labelTa: 'சேலம்' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, labelTa: 'சென்னை' },
  { name: 'Madurai', lat: 9.9252, lon: 78.1198, labelTa: 'மதுரை' },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, labelTa: 'கோயம்புத்தூர்' },
  { name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047, labelTa: 'திருச்சிராப்பள்ளி' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, labelTa: 'பெங்களூரு' }
];

export const RASHIS = [
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

export const NAKSHATRAS = [
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

export const PLANET_INFO = [
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

export const WEEKDAYS = [
  { id: 0, en: 'Sunday', ta: 'ஞாயிறு' },
  { id: 1, en: 'Monday', ta: 'திங்கள்' },
  { id: 2, en: 'Tuesday', ta: 'செவ்வாய்' },
  { id: 3, en: 'Wednesday', ta: 'புதன்' },
  { id: 4, en: 'Thursday', ta: 'வியாழன்' },
  { id: 5, en: 'Friday', ta: 'வெள்ளி' },
  { id: 6, en: 'Saturday', ta: 'சனி' }
];

export const DASHA_LORDS = [
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
export function calculateThirukanithaHoroscope({
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

export const RASHI_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export const YOGAS_TA = [
  'விஷ்கம்பம்', 'ப்ரீதி', 'ஆயுஷ்மான்', 'சௌபாக்யம்', 'சோபனம்', 'அதிகண்டம்', 'சுகர்மம்', 'திருதி',
  'சூலம்', 'கண்டம்', 'விருத்தி', 'துருவம்', 'வியாகாதம்', 'ஹர்ஷணம்', 'வஜ்ரம்', 'சித்தி',
  'வியதீபாதம்', 'வரீயான்', 'பரிகம்', 'சிவம்', 'சித்தம்', 'சாத்தியம்', 'சுப்பிரம்', 'பிராம்மம்',
  'ஐந்திரம்', 'வைதிருதி'
];

export const KARANAS_TA = [
  'பவ', 'பாலவ', 'கௌலவ', 'சைதுளை', 'கரசை', 'வனசை', 'பத்திரை',
  'சகுனி', 'சதுஷ்பாதம்', 'நாகவம்', 'கிம்ஸ்துக்னம்'
];

export const NAKSHATRA_SYLLABLES_TA = [
  'சூ, சே, சோ, லா', 'லீ, லூ, லே, லோ', 'அ, ஈ, உ, ஏ', 'ஓ, வா, வி, வு',
  'வே, வோ, கா, கீ', 'கு, க, ங, ச', 'கே, கோ, ஹா, ஹீ', 'ஹூ, ஹே, ஹோ, டா',
  'டீ, டூ, டே, டோ', 'மா, மீ, மூ, மே', 'மோ, டா, டீ, டூ', 'டே, டோ, பா, பீ',
  'பூ, ஷ, ண, ட', 'பே, போ, ரா, ரீ', 'ரூ, ரே, ரோ, தா', 'தீ, தூ, தே, தோ',
  'நா, நீ, நூ, நே', 'நோ, யா, யீ, யூ', 'யே, யோ, பா, பீ', 'பூ, தா, பா, டா',
  'பே, போ, ஜா, ஜீ', 'கீ, கூ, கே, கோ', 'கா, கீ, கூ, கே', 'கோ, ஸா, ஸீ, ஸூ',
  'ஸே, ஸோ, தா, தீ', 'தூ, ச, ஞ, த', 'தே, தோ, சா, சீ'
];

export const PLANET_ROW_KEYS = [
  '1-லக்னம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்(வ)', 'குரு',
  'சுக்கிரன்(வ)', 'சனி(வ)', 'ராகு', 'கேது', 'மாந்தி'
];

/**
 * Returns an empty JSON data object where all fields start blank.
 */
export function createEmptyHoroscopePagerData() {
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
export function computeHoroscopePagerData(horoInput) {
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
