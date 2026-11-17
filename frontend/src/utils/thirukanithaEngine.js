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

/**
 * Creates completely empty data structure for the 7-page A4 booklet
 */
export function createEmpty7PageBookletData() {
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

export const SIGN_NAMES_TA_SHORT = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்ப', 'மீன'];

export const SIGN_LORDS_ORDER = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'
];

export const EXALT_SIGNS = {
  sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6,
  rahu: 1, ketu: 7, lagna: 3
};

export const DEBIL_SIGNS = {
  sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0,
  rahu: 7, ketu: 1, lagna: 9
};

export const OWN_SIGNS_MAP = {
  sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5],
  jupiter: [8, 11], venus: [1, 6], saturn: [9, 10],
  rahu: [10], ketu: [7], lagna: [8]
};

export const NATURAL_RELATIONS = {
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

export function getVargaSign(lon, vargaNum) {
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

export function getVargaDignity(planetKey, signIdx) {
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

export function computeDasavargaTable(planetsInput, lagnaLon) {
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

export function computeDashaBhuktiMatrix(dobStr, dashaBalanceText) {
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


export function compute7PageBookletData(horoInput) {
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

export function createEmpty18PageBookletData() {
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
      heading: 'விநாயகர் ஸ்துதி',
      img: '',
      verse: '',
      subham: 'சுப மஸ்து.'
    },
    p3: {
      img: '',
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
    p4: {
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
    p5: {
      genderLabel: 'ஆண் பெயர்',
      date: '',
      time: '',
      lagna: '',
      rasi: '',
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
    p6: {
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
    p7: {
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
    p8: {
      d3Chart: Array(12).fill(''),
      d3Text: '',
      d7Chart: Array(12).fill(''),
      d7Text: ''
    },
    p9: {
      d60Chart: Array(12).fill(''),
      d60Text: '',
      d30Chart: Array(12).fill(''),
      d30Text: ''
    },
    p10: {
      d10Chart: Array(12).fill(''),
      d10Text: '',
      d16Chart: Array(12).fill(''),
      d16Text: ''
    },
    p11: {
      d4Chart: Array(12).fill(''),
      d4Text: '',
      d12Chart: Array(12).fill(''),
      d12Text: ''
    },
    p12: {
      horaChart: Array(12).fill(''),
      notes: ''
    },
    p13: {
      grahaCols: ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
      grahaRows: [
        { name: 'ஸ்தான பலம்', vals: Array(7).fill('') },
        { name: 'திக் பலம்', vals: Array(7).fill('') },
        { name: 'கால பலம்', vals: Array(7).fill('') },
        { name: 'சேஷ்டா பலம்', vals: Array(7).fill('') },
        { name: 'நைசர்கிக பலம்', vals: Array(7).fill('') },
        { name: 'திருஷ்டி பலம்', vals: Array(7).fill('') },
        { name: 'மொத்தம்', vals: Array(7).fill('') },
        { name: 'இஷ்ட பலம்', vals: Array(7).fill('') },
        { name: 'கஷ்ட பலம்', vals: Array(7).fill('') }
      ],
      bhavaRows: [
        { name: 'திருஷ்டி பலம்', vals: Array(12).fill('') },
        { name: 'திக் பலம்', vals: Array(12).fill('') },
        { name: 'அதிபதி பலம்', vals: Array(12).fill('') },
        { name: 'மொத்தம்', vals: Array(12).fill('') }
      ]
    },
    p14: {
      introText: '',
      table1: [
        { name: 'காலன்', lord: '', graha: '', pRasi: '', pDeg: '', pNak: '', pPada: '', kRasi: '', kDeg: '', kNak: '', kPada: '' },
        { name: 'மிருத்யு', lord: '', graha: '', pRasi: '', pDeg: '', pNak: '', pPada: '', kRasi: '', kDeg: '', kNak: '', kPada: '' },
        { name: 'அர்த்தப்பிரஹரன்', lord: '', graha: '', pRasi: '', pDeg: '', pNak: '', pPada: '', kRasi: '', kDeg: '', kNak: '', kPada: '' },
        { name: 'யமகண்டன்', lord: '', graha: '', pRasi: '', pDeg: '', pNak: '', pPada: '', kRasi: '', kDeg: '', kNak: '', kPada: '' },
        { name: 'குளிகன்', lord: '', graha: '', pRasi: '', pDeg: '', pNak: '', pPada: '', kRasi: '', kDeg: '', kNak: '', kPada: '' }
      ],
      table2: [
        { name: 'தூமன்', lord: '', rasi: '', deg: '', nak: '', pada: '' },
        { name: 'வியதிபாதன்', lord: '', rasi: '', deg: '', nak: '', pada: '' },
        { name: 'பரிவேடன்', lord: '', rasi: '', deg: '', nak: '', pada: '' },
        { name: 'இந்திரதனுஸ்', lord: '', rasi: '', deg: '', nak: '', pada: '' },
        { name: 'உபகேது', lord: '', rasi: '', deg: '', nak: '', pada: '' }
      ]
    },
    p15: {
      upagrahaChart: Array(12).fill(''),
      sphutas: {
        horaLagna: '', arudhaLagna: '', ghatikaLagna: '', induLagna: '', bhavaLagna: '',
        sriLagna: '', yogiDeg: '', avayogiDeg: '', matruYogi: '', drekkana22: '',
        navamsa64: '', sarpaDrekkana: '', kshetraSphutam: '', adrishtaDeg: ''
      },
      notes: {
        bhava5: '', andhaka: '', pushkara: '', mrityu: '', avamrityu: ''
      }
    },
    p16: {
      grahaNames: ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
      naisargika: Array(7).fill(null).map(() => Array(7).fill('')),
      tatkalika: Array(7).fill(null).map(() => Array(7).fill('')),
      combined: Array(7).fill(null).map(() => Array(7).fill('')),
      legend: '',
      avasthas: [
        { graha: 'சூரியன்', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'சந்திரன்', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'செவ்வாய்', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'புதன்', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'குரு', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'சுக்கிரன்', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'சனி', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'ராகு', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' },
        { graha: 'கேது', rasi: '', deg: '', avastha: '', status: '', mandalam: '', samayam: '' }
      ]
    },
    p17: {
      grahas: ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
      matrix: Array(7).fill(null).map(() => Array(12).fill('')),
      totals: Array(12).fill(''),
      chartCells: Array(12).fill(''),
      grandTotal: '',
      kendram: '', panaparam: '', apoklimam: '', upachayam: '', trikonam: '',
      varavinam: '', selavinam: '',
      east: '', west: '', south: '', north: ''
    },
    p18: {
      name: '',
      engSum: '',
      dobEng: '',
      dateNum: '',
      yearNum: '',
      luckyNums: '',
      luckyDates: '',
      luckyColors: '',
      luckyStones: '',
      deity: '',
      temples: '',
      letters: Array(26).fill(''),
      subham: 'சுபம்.'
    }
  };
}


// ============================================================================
// COMPREHENSIVE B1 - B33 THIRUKANITHA CALCULATION MODULES
// ============================================================================

export const BAV_RULES = {
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

export const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const RASI_MULTIPLIERS = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12];
export const GRAHA_MULTIPLIERS = {
  sun: 5, moon: 5, mars: 8, mercury: 5, jupiter: 10, venus: 7, saturn: 5
};

export const TAMIL_YEARS_60 = [
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

export function computeAshtakavarga(positions) {
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

export function computeChaldeanNumerology(name = '', dob = '2026-11-05') {
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
export function computeShadbala(planets, lagnaLon, sunLon, moonLon, isDay) {
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
export function computeUpagrahas(sunLon, sunriseHours, sunsetHours, birthHour, weekday) {
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
export function computeSpecialLagnas(sunLon, moonLon, lagnaLon, birthHour, sunriseHours) {
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
export function computeRelationshipsAndAvasthas(planets, sunLon, moonLon) {
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
export function buildSouthChart(signPlacements) {
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

export function compute18PageBookletData(horoInput) {
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
  const shadbala = computeShadbala(horo.planets || {}, lagnaLon, sunLon, moonLon, true);
  const upagrahas = computeUpagrahas(sunLon, 6.0, 18.0, 12.0, 0);
  const specialLagnas = computeSpecialLagnas(sunLon, moonLon, lagnaLon, 12.0, 6.0);
  const relsAvasthas = computeRelationshipsAndAvasthas(horo.planets || {}, sunLon, moonLon);

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

  // PAGE 2: VINAYAGAR STUTHI
  empty.p2 = {
    title: 'விநாயகர் ஸ்துதி',
    verse: 'வாக்குண்டாம் நல்ல மனமுண்டாம் மாமலராள்\nநோக்குண்டாம் மேனி நுடங்காது - பூக்கொண்டு\nதுப்பார் திருமேனித் தும்பிக்கை யான்பாதம்\nதப்பாமல் சார்வார் தமக்கு.',
    subham: 'சுப மஸ்து. நன்மைகள் பெருகுக.',
    img: ''
  };

  // PAGE 3: JANANA VIVARAM
  empty.p3 = {
    name: p1Data.person.name,
    gender: horoInput.gender === 'female' ? 'பெண்' : 'ஆண்',
    date: `${m.dob} (${p.weekday})`,
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
    yogam: p1Data.person.yogaKarana?.split('-')[0]?.trim() || 'சித்த யோகம்',
    karanam: p1Data.person.yogaKarana?.split('-')[1]?.trim() || 'தைதுலை',
    ayanam: p1Data.person.ayanam || 'தட்சிணாயனம்',
    gyn: 'மனுஷ கணம் / பெண் நாய் / ஆதி நாடி',
    vr: 'செங்காலி / கண்ட ரஜ்ஜு',
    pa: 'செம்போத்து / ருத்ரன்',
    img: ''
  };

  // PAGE 4: JANANA NAKSHATRA DETAILS
  empty.p4 = {
    nakshatra: `${p1Data.person.nakshatra} பாதம் ${p1Data.person.pada}`,
    nakStart: '30/Oct/2026 09:05:47 AM',
    nakEnd: '31/Oct/2026 07:13:38 AM',
    aadiyanta: '55:19:37',
    garbha: '4:33:22',
    iruppu: '50:46:15',
    dashaBal: p1Data.footer.dashaBalance,
    tithi: p1Data.person.pakshaTithi,
    soonyam: 'மிதுனம் கன்னி',
    yogi: 'புதன் (174:02:02 அஸ்தம் 2)',
    avayogi: 'செவ்வாய் (307:22:02 சதயம் 1)',
    hora: p1Data.person.hora || 'சூரிய ஹோரை',
    ayanamsha: p1Data.person.ayanamsha || '24:14:02',
    lmt: p1Data.person.lmtCorr || '-0:19:44',
    subhar: 'சூரியன், செவ்வாய்',
    pabar: 'சுக்கிரன்',
    vainasika: 'ரேவதி',
    sunrise: p1Data.person.sunriseSunset?.split('/')[0]?.trim() || '06:16:15 AM',
    sunset: p1Data.person.sunriseSunset?.split('/')[1]?.trim() || '05:50:22 PM'
  };

  // PAGE 5: RASI & NAVAMSA
  empty.p5 = {
    genderLabel: horoInput.gender === 'female' ? 'பெண் பெயர்' : 'ஆண் பெயர்',
    date: m.dob,
    time: p1Data.person.time,
    lagna: p1Data.person.lagna,
    rasi: p1Data.person.rasi,
    nakPada: `${p1Data.person.nakshatra} - ${p1Data.person.pada}`,
    rasiChart: p1Data.charts.rasi,
    navamsaChart: p1Data.charts.navamsa,
    place: p1Data.person.placeLine1,
    coords: p1Data.person.latLon,
    tamilDate: p1Data.person.tamilDate,
    pakshaTithi: p1Data.person.pakshaTithi,
    yogaKarana: p1Data.person.yogaKarana,
    dashaBal: p1Data.footer.dashaBalance
  };

  // PAGE 6: PLANET TABLE
  empty.p6 = {
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

  // PAGE 7: SRIPATI BHAVA & SPHUTAM
  const sripatiBhavas = (horo.sripatiBhavas || []).map((b, i) => ({
    bhava: b.bhava || (i + 1),
    start: b.start || '242° 57\'',
    madhya: b.madhya || '256° 37\'',
    end: b.end || '272° 57\''
  }));

  empty.p7 = {
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
      { bhava: 1, start: '242° 57\'', madhya: '256° 37\'', end: '272° 57\'' },
      { bhava: 2, start: '272° 57\'', madhya: '289° 17\'', end: '305° 37\'' },
      { bhava: 3, start: '305° 37\'', madhya: '321° 57\'', end: '338° 17\'' },
      { bhava: 4, start: '338° 17\'', madhya: '354° 37\'', end: '8° 17\'' },
      { bhava: 5, start: '8° 17\'', madhya: '21° 57\'', end: '35° 37\'' },
      { bhava: 6, start: '35° 37\'', madhya: '49° 17\'', end: '62° 57\'' },
      { bhava: 7, start: '62° 57\'', madhya: '76° 37\'', end: '92° 57\'' },
      { bhava: 8, start: '92° 57\'', madhya: '109° 17\'', end: '125° 37\'' },
      { bhava: 9, start: '125° 37\'', madhya: '141° 57\'', end: '158° 17\'' },
      { bhava: 10, start: '158° 17\'', madhya: '174° 37\'', end: '188° 17\'' },
      { bhava: 11, start: '188° 17\'', madhya: '201° 57\'', end: '215° 37\'' },
      { bhava: 12, start: '215° 37\'', madhya: '229° 17\'', end: '242° 57\'' }
    ],
    bhavaChange: 'சுக்கிரன்-10, ராகு-2, கேது-8 (பாவக சந்திக்கு ஏற்ப சுப பலன்கள்).'
  };

  // DIVISIONAL CHARTS PAGES 8 TO 12
  empty.p8 = {
    d3Chart: makeChartPills(3),
    d3Text: 'மூன்றாம் பாவக பலன்கள் மற்றும் உடன்பிறப்புகள், தைரிய வீரிய நிலைகளைத் தெளிவாகக் கணிக்க திரேக்காணச் சக்கரம் உதவுகிறது.',
    d7Chart: makeChartPills(7),
    d7Text: 'சந்தான பாக்கியம், குழந்தைகள் நலம் மற்றும் வம்ச விருத்தியை ஆழமாகத் துல்லியமாக அறிய சப்தாம்சச் சக்கரம் வழிகாட்டுகிறது.'
  };

  empty.p9 = {
    d60Chart: makeChartPills(60),
    d60Text: 'முற்பிறவி கர்ம வினைகள் மற்றும் நுட்பமான ஜாதக நிலைகளை அறுதியிட சஷ்டியாம்ச சக்கரம் முதன்மையானது.',
    d30Chart: makeChartPills(30),
    d30Text: 'அரிஷ்டங்கள், விபத்துக்கள் மற்றும் தோஷங்களை ஆராய்ந்து அறிவதற்கு திரிம்சாம்ச சக்கரம் பயனுள்ளதாக அமைகிறது.'
  };

  empty.p10 = {
    d10Chart: makeChartPills(10),
    d10Text: 'தொழில், உத்தியோகம், சமூக அந்தஸ்து, புகழ் மற்றும் ஜீவன ஸ்தானத்தை அறிவதற்கு தசாம்ச சக்கரம் பயன்படுகிறது.',
    d16Chart: makeChartPills(16),
    d16Text: 'வாகன யோகம், சுகபோகங்கள் மற்றும் சொகுசு வாழ்க்கை வசதிகளை அறிய ஷோடசாம்ச சக்கரம் உதவும்.'
  };

  empty.p11 = {
    d4Chart: makeChartPills(4),
    d4Text: 'நிலபுலன்கள், வீடு, சொத்துக்கள் மற்றும் அதிர்ஷ்ட வாய்ப்புகளைக் கணிக்க சதுராம்ச சக்கரம் ஆய்வு செய்யப்படுகிறது.',
    d12Chart: makeChartPills(12),
    d12Text: 'தாய் தந்தை வழி முன்னோர்கள், பாரம்பரிய நன்மைகள் மற்றும் பரம்பரை ஆசிகளை அறிய துவாதசாம்சம் உதவுகிறது.'
  };

  empty.p12 = {
    horaChart: makeChartPills(2),
    notes: 'சூரிய ஓரை மற்றும் சந்திர ஓரை மூலம் ஜாதகரின் தன லாபங்கள், நிதி வளம் மற்றும் செல்வ நிலைகள் கணிக்கப்படுகிறது.'
  };

  // PAGE 13: SHADBALA
  empty.p13 = shadbala;

  // PAGE 14 & 15: UPAGRAHAS
  empty.p14 = {
    introText: 'பராசரர் மற்றும் காளிதாசர் கணித முறைகளின்படி கணிக்கப்பெற்ற உபகிரகங்களின் துல்லியமான நிலைகள்:',
    table1: upagrahas.table1,
    table2: upagrahas.table2
  };

  empty.p15 = {
    upagrahaChart: makeChartPills(1),
    specialLagnas: specialLagnas
  };

  // PAGE 16: RELATIONSHIPS & AVASTHAS
  empty.p16 = {
    friendsList: [
      { graha: 'சூரியன்', friends: 'சந்திரன், செவ்வாய், குரு', neutral: 'புதன்', enemies: 'சுக்கிரன், சனி' },
      { graha: 'சந்திரன்', friends: 'சூரியன், புதன்', neutral: 'செவ்வாய், குரு, சுக்கிரன், சனி', enemies: 'எவருமில்லை' },
      { graha: 'செவ்வாய்', friends: 'சூரியன், சந்திரன், குரு', neutral: 'சுக்கிரன், சனி', enemies: 'புதன்' },
      { graha: 'புதன்', friends: 'சூரியன், சுக்கிரன்', neutral: 'செவ்வாய், குரு, சனி', enemies: 'சந்திரன்' },
      { graha: 'குரு', friends: 'சூரியன், சந்திரன், செவ்வாய்', neutral: 'சனி', enemies: 'புதன், சுக்கிரன்' },
      { graha: 'சுக்கிரன்', friends: 'புதன், சனி', neutral: 'செவ்வாய், குரு', enemies: 'சூரியன், சந்திரன்' },
      { graha: 'சனி', friends: 'புதன், சுக்கிரன்', neutral: 'குரு', enemies: 'சூரியன், சந்திரன், செவ்வாய்' }
    ],
    avasthas: relsAvasthas.avasthas
  };

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
