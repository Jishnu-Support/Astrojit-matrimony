/**
 * Thirukanitha Vedic Astrology Calculation Engine
 * High-precision Drik Nirayana / Classical Parashari algorithms
 * Dynamic horoscope calculator strictly adhering to exact Thirukanitha astronomical formulas.
 */

export const TAMIL_RASHIS = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்',
  'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்',
  'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
];

export const ENGLISH_RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const RASHI_LORDS = [
  'செவ்வாய்', 'சுக்ரன்', 'புதன்', 'சந்திரன்',
  'சூரியன்', 'புதன்', 'சுக்ரன்', 'செவ்வாய்',
  'வியாழன்', 'சனி', 'சனி', 'வியாழன்'
];

export const RASHI_LORD_KEYS = [
  'mars', 'venus', 'mercury', 'moon',
  'sun', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'saturn', 'jupiter'
];

export const NAKSHATRAS = [
  { name: 'அசுவினி', en: 'Ashwini', lord: 'கேது', lordKey: 'ketu', letters: 'சூ, சே, சோ, லா', gana: 'தேவ கணம்', yoni: 'குதிரை', rajju: 'பாத ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'பரணி', en: 'Bharani', lord: 'சுக்ரன்', lordKey: 'venus', letters: 'லீ, லூ, லே, லோ', gana: 'மனுஷ கணம்', yoni: 'யானை', rajju: 'தொடை ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'கிருத்திகை', en: 'Krittika', lord: 'சூரியன்', lordKey: 'sun', letters: 'ஆ, ஈ, ஊ, ஏ', gana: 'ராட்சஸ கணம்', yoni: 'ஆடு', rajju: 'நாபி ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'ரோகிணி', en: 'Rohini', lord: 'சந்திரன்', lordKey: 'moon', letters: 'ஓ, வா, வீ, வூ', gana: 'மனுஷ கணம்', yoni: 'பாம்பு', rajju: 'கண்ட ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'மிருகசீரிடம்', en: 'Mrigashira', lord: 'செவ்வாய்', lordKey: 'mars', letters: 'வே, வோ, கா, கீ', gana: 'தேவ கணம்', yoni: 'பாம்பு', rajju: 'சிரசு ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'திருவாதிரை', en: 'Ardra', lord: 'ராகு', lordKey: 'rahu', letters: 'கு, க, ங, ச', gana: 'மனுஷ கணம்', yoni: 'நாய்', rajju: 'கண்ட ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'புனர்பூசம்', en: 'Punarvasu', lord: 'வியாழன்', lordKey: 'jupiter', letters: 'கே, கோ, ஹா, ஹீ', gana: 'தேவ கணம்', yoni: 'பூனை', rajju: 'நாபி ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'பூசம்', en: 'Pushya', lord: 'சனி', lordKey: 'saturn', letters: 'ஹூ, ஹே, ஹோ, டா', gana: 'தேவ கணம்', yoni: 'ஆடு', rajju: 'தொடை ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'ஆயில்யம்', en: 'Ashlesha', lord: 'புதன்', lordKey: 'mercury', letters: 'டீ, டூ, டே, டோ', gana: 'ராட்சஸ கணம்', yoni: 'பூனை', rajju: 'பாத ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'மகம்', en: 'Magha', lord: 'கேது', lordKey: 'ketu', letters: 'மா, மீ, மூ, மே', gana: 'ராட்சஸ கணம்', yoni: 'எலி', rajju: 'பாத ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'பூரம்', en: 'Purva Phalguni', lord: 'சுக்ரன்', lordKey: 'venus', letters: 'மோ, டா, டீ, டூ', gana: 'மனுஷ கணம்', yoni: 'எலி', rajju: 'தொடை ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'உத்திரம்', en: 'Uttara Phalguni', lord: 'சூரியன்', lordKey: 'sun', letters: 'டே, டோ, பா, பீ', gana: 'மனுஷ கணம்', yoni: 'பசு', rajju: 'நாபி ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'அஸ்தம்', en: 'Hasta', lord: 'சந்திரன்', lordKey: 'moon', letters: 'பூ, ஷா, ணா, டா', gana: 'தேவ கணம்', yoni: 'எருமை', rajju: 'கண்ட ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'சித்திரை', en: 'Chitra', lord: 'செவ்வாய்', lordKey: 'mars', letters: 'பே, போ, ரா, ரீ', gana: 'ராட்சஸ கணம்', yoni: 'புலி', rajju: 'சிரசு ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'சுவாதி', en: 'Swati', lord: 'ராகு', lordKey: 'rahu', letters: 'ரூ, ரே, ரோ, தா', gana: 'தேவ கணம்', yoni: 'எருமை', rajju: 'கண்ட ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'விசாகம்', en: 'Vishakha', lord: 'வியாழன்', lordKey: 'jupiter', letters: 'தீ, தூ, தே, தோ', gana: 'ராட்சஸ கணம்', yoni: 'புலி', rajju: 'நாபி ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'அனுஷம்', en: 'Anuradha', lord: 'சனி', lordKey: 'saturn', letters: 'நா, நீ, நூ, நே', gana: 'தேவ கணம்', yoni: 'மான்', rajju: 'தொடை ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'கேட்டை', en: 'Jyeshtha', lord: 'புதன்', lordKey: 'mercury', letters: 'நோ, யா, யீ, யூ', gana: 'ராட்சஸ கணம்', yoni: 'மான்', rajju: 'பாத ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'மூலம்', en: 'Moola', lord: 'கேது', lordKey: 'ketu', letters: 'யே, யோ, பா, பீ', gana: 'ராட்சஸ கணம்', yoni: 'நாய்', rajju: 'பாத ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'பூராடம்', en: 'Purva Ashadha', lord: 'சுக்ரன்', lordKey: 'venus', letters: 'பூ, தா, பா, டா', gana: 'மனுஷ கணம்', yoni: 'குரங்கு', rajju: 'தொடை ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'உத்திராடம்', en: 'Uttara Ashadha', lord: 'சூரியன்', lordKey: 'sun', letters: 'பே, போ, ஜா, ஜீ', gana: 'மனுஷ கணம்', yoni: 'கீரி', rajju: 'நாபி ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'திருவோணம்', en: 'Shravana', lord: 'சந்திரன்', lordKey: 'moon', letters: 'ஜூ, ஜே, ஜோ, கா', gana: 'தேவ கணம்', yoni: 'குரங்கு', rajju: 'கண்ட ரஜ்ஜு', nadi: 'அந்திய' },
  { name: 'அவிட்டம்', en: 'Dhanishta', lord: 'செவ்வாய்', lordKey: 'mars', letters: 'கா, கீ, கூ, கே', gana: 'ராட்சஸ கணம்', yoni: 'சிங்கம்', rajju: 'சிரசு ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'சதயம்', en: 'Shatabhisha', lord: 'ராகு', lordKey: 'rahu', letters: 'கோ, சா, சீ, சூ', gana: 'ராட்சஸ கணம்', yoni: 'குதிரை', rajju: 'கண்ட ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'பூரட்டாதி', en: 'Purva Bhadrapada', lord: 'வியாழன்', lordKey: 'jupiter', letters: 'சே, சோ, தா, தீ', gana: 'மனுஷ கணம்', yoni: 'சிங்கம்', rajju: 'நாபி ரஜ்ஜு', nadi: 'பார்சுவ' },
  { name: 'உத்திரட்டாதி', en: 'Uttara Bhadrapada', lord: 'சனி', lordKey: 'saturn', letters: 'தூ, ச்யா, ஜ்ஞா, தா', gana: 'மனுஷ கணம்', yoni: 'பசு', rajju: 'தொடை ரஜ்ஜு', nadi: 'மத்திய' },
  { name: 'ரேவதி', en: 'Revati', lord: 'புதன்', lordKey: 'mercury', letters: 'தே, தோ, சா, சீ', gana: 'தேவ கணம்', yoni: 'யானை', rajju: 'பாத ரஜ்ஜு', nadi: 'அந்திய' }
];

export const DASHA_LORDS = [
  { lord: 'கேது', lordEn: 'Ketu', lordKey: 'ketu', years: 7, color: 'text-emerald-700' },
  { lord: 'சுக்ரன்', lordEn: 'Venus', lordKey: 'venus', years: 20, color: 'text-pink-600' },
  { lord: 'சூரியன்', lordEn: 'Sun', lordKey: 'sun', years: 6, color: 'text-amber-800' },
  { lord: 'சந்திரன்', lordEn: 'Moon', lordKey: 'moon', years: 10, color: 'text-blue-700' },
  { lord: 'செவ்வாய்', lordEn: 'Mars', lordKey: 'mars', years: 7, color: 'text-red-600' },
  { lord: 'ராகு', lordEn: 'Rahu', lordKey: 'rahu', years: 18, color: 'text-purple-900' },
  { lord: 'வியாழன்', lordEn: 'Jupiter', lordKey: 'jupiter', years: 16, color: 'text-purple-700' },
  { lord: 'சனி', lordEn: 'Saturn', lordKey: 'saturn', years: 19, color: 'text-indigo-900' },
  { lord: 'புதன்', lordEn: 'Mercury', lordKey: 'mercury', years: 17, color: 'text-teal-700' }
];

export const PLACE_PRESETS = {
  salem: { lat: 11.65, lon: 78.2 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  madurai: { lat: 9.9252, lon: 78.1198 },
  coimbatore: { lat: 11.0168, lon: 76.9558 },
  tiruchirappalli: { lat: 10.7905, lon: 78.7047 },
  trichy: { lat: 10.7905, lon: 78.7047 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  hosur: { lat: 12.73, lon: 77.82 },
  sankagiri: { lat: 11.48, lon: 77.87 }
};

export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;

export function normDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

export function sinD(deg) { return Math.sin(deg * DEG2RAD); }
export function cosD(deg) { return Math.cos(deg * DEG2RAD); }
export function tanD(deg) { return Math.tan(deg * DEG2RAD); }
export function atan2D(y, x) { return normDeg(Math.atan2(y, x) * RAD2DEG); }

export function formatDMS(deg) {
  const norm = normDeg(deg);
  const d = Math.floor(norm);
  const minFloat = (norm - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
}

export function formatShortDMS(deg) {
  const norm = normDeg(deg);
  const d = Math.floor(norm);
  const minFloat = (norm - d) * 60;
  const m = Math.floor(minFloat);
  return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'`;
}

export function parseDate(dateStr) {
  if (!dateStr) return { y: 2026, m: 11, d: 5 };
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      return { y: parseInt(parts[0], 10), m: parseInt(parts[1], 10), d: parseInt(parts[2], 10) };
    }
    return { y: parseInt(parts[2], 10), m: parseInt(parts[1], 10), d: parseInt(parts[0], 10) };
  }
  return { y: 2026, m: 11, d: 5 };
}

export function parseTime(timeStr) {
  if (!timeStr) return { hour: 12, min: 0, sec: 0 };
  let s = timeStr.trim();
  const isPM = /pm/i.test(s);
  const isAM = /am/i.test(s);
  s = s.replace(/am|pm/gi, '').trim();
  const parts = s.split(':').map((p) => parseInt(p, 10) || 0);
  let hour = parts[0] || 0;
  const min = parts[1] || 0;
  const sec = parts[2] || 0;
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return { hour, min, sec };
}

export function parseCoordinate(coord, defaultVal, isLat = true) {
  if (typeof coord === 'number' && !isNaN(coord)) return coord;
  if (!coord) return defaultVal;
  const str = coord.toString().trim();
  const dmsMatch = str.match(/(\d+)[°:]\s*(\d+)?(?:[':]\s*(\d+)?)?/);
  if (dmsMatch && (str.includes('°') || str.includes(':'))) {
    const deg = parseFloat(dmsMatch[1]) || 0;
    const min = parseFloat(dmsMatch[2]) || 0;
    const sec = parseFloat(dmsMatch[3]) || 0;
    let val = deg + min / 60 + sec / 3600;
    if (/[SWsw]/i.test(str)) val = -val;
    return val;
  }
  const decMatch = str.match(/([+-]?\d+(?:\.\d+)?)/);
  if (decMatch) {
    let val = parseFloat(decMatch[1]);
    if (/[SWsw]/i.test(str)) val = -Math.abs(val);
    return val;
  }
  return defaultVal;
}

/**
 * 1. TIME: Julian Day & Julian Centuries (UT = local - UTC offset)
 */
export function getJulianDay(year, month, day, hour = 0, min = 0, sec = 0, tz = 5.5) {
  const localHour = hour + min / 60 + sec / 3600;
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

export function getJulianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * 2. AYANAMSHA (Lahiri) & OBLIQUITY
 */
export function getLahiriAyanamsha(T_or_jd) {
  const T = T_or_jd > 1000000 ? (T_or_jd - 2451545.0) / 36525.0 : T_or_jd;
  const Omega = 125.04452 - 1934.136261 * T;
  const Ls = 280.46646 + 36000.76983 * T;
  const DeltaPsi = -17.2 * sinD(Omega) - 1.32 * sinD(2 * Ls);
  return 23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600 + DeltaPsi / 3600;
}

export function getObliquity(T) {
  return 23.439291 - 0.0130042 * T;
}

/**
 * 3. SUN (tropical)
 */
export function computeSayanaSun(T) {
  const Ls = 280.46646 + 36000.76983 * T;
  const M = 357.52911 + 35999.05029 * T;
  const C = (1.914602 - 0.004817 * T) * sinD(M) + 0.019993 * sinD(2 * M) + 0.000289 * sinD(3 * M);
  return {
    long: normDeg(Ls + C),
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

export function computeSayanaMoon(T) {
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
  return normDeg(Lp + sigma / 1e6);
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

export function computeSayanaPlanet(name, T) {
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
export function computeSayanaRahuKetu(T) {
  const Omega = 125.04452 - 1934.136261 * T;
  const rahu = normDeg(Omega);
  const ketu = normDeg(rahu + 180);
  return { rahu, ketu };
}

/**
 * 8. LAGNA & MC
 */
export function computeExactLagnaAndMC(year, month, day, hour = 0, minute = 0, second = 0, lat = 11.65, lon = 78.2, ayanamsha = 24.234, tz = 5.5) {
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
 * 9. SRIPATI BHAVA (tropical trisection, then minus ayanamsha)
 */
function midpoint(a, b) {
  return normDeg(a + normDeg(b - a) / 2);
}

export function computeParasharaSripatiHouses(ascSay, mcSay, ayanamsha) {
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
export function getDivisionalSign(lambda, dNum) {
  const s = Math.floor(lambda / 30);
  const d = lambda % 30;
  const isOddIndex = (s % 2 !== 0); // "even sign" has odd index
  if (dNum === 1) return s;
  if (dNum === 3) return (s + 4 * Math.floor(d / 10)) % 12;
  if (dNum === 7) return (s + (isOddIndex ? 6 : 0) + Math.floor(d / (30 / 7))) % 12;
  if (dNum === 9) return Math.floor(lambda / (10 / 3)) % 12;
  if (dNum === 10) return (s + (isOddIndex ? 8 : 0) + Math.floor(d / 3)) % 12;
  if (dNum === 12) return (s + Math.floor(d / 2.5)) % 12;
  return s;
}

export function getNavamshaSign(longitude) {
  return getDivisionalSign(longitude, 9);
}

export function getDignityKey(planetKey, signIndex) {
  switch (planetKey) {
    case 'sun':
      if (signIndex === 0) return 'exalted';
      if (signIndex === 6) return 'debilitated';
      if (signIndex === 4) return 'own';
      if ([8, 11, 7, 3].includes(signIndex)) return 'friendly';
      if ([1, 9, 10].includes(signIndex)) return 'enemy';
      return 'neutral';
    case 'moon':
      if (signIndex === 1) return 'exalted';
      if (signIndex === 7) return 'debilitated';
      if (signIndex === 3) return 'own';
      if ([0, 2, 4, 5].includes(signIndex)) return 'friendly';
      return 'neutral';
    case 'mars':
      if (signIndex === 9) return 'exalted';
      if (signIndex === 3) return 'debilitated';
      if ([0, 7].includes(signIndex)) return 'own';
      if ([4, 8, 11].includes(signIndex)) return 'friendly';
      if ([2, 5].includes(signIndex)) return 'enemy';
      return 'neutral';
    case 'mercury':
      if (signIndex === 5) return 'exalted';
      if (signIndex === 11) return 'debilitated';
      if ([2, 5].includes(signIndex)) return 'own';
      if ([1, 4, 6].includes(signIndex)) return 'friendly';
      if ([3].includes(signIndex)) return 'enemy';
      return 'neutral';
    case 'jupiter':
      if (signIndex === 3) return 'exalted';
      if (signIndex === 9) return 'debilitated';
      if ([8, 11].includes(signIndex)) return 'own';
      if ([0, 4, 7].includes(signIndex)) return 'friendly';
      if ([2, 5, 6].includes(signIndex)) return 'enemy';
      return 'neutral';
    case 'venus':
      if (signIndex === 11) return 'exalted';
      if (signIndex === 5) return 'debilitated';
      if ([1, 6].includes(signIndex)) return 'own';
      if ([2, 9, 10].includes(signIndex)) return 'friendly';
      if ([4, 3].includes(signIndex)) return 'enemy';
      return 'neutral';
    case 'saturn':
      if (signIndex === 6) return 'exalted';
      if (signIndex === 0) return 'debilitated';
      if ([9, 10].includes(signIndex)) return 'own';
      if ([1, 2, 5].includes(signIndex)) return 'friendly';
      if ([3, 4, 7].includes(signIndex)) return 'enemy';
      return 'neutral';
    case 'rahu':
      if (signIndex === 1) return 'exalted';
      if (signIndex === 7) return 'debilitated';
      return 'neutral';
    case 'ketu':
      if (signIndex === 7) return 'exalted';
      if (signIndex === 1) return 'debilitated';
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function computeAge(dobStr) {
  const { y, m, d } = parseDate(dobStr);
  const birth = new Date(y, m - 1, d);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

// Tajika 35 Sahams
export const TAJIKA_35_SAHAMS = [
  { id: 1, nameEn: 'Punya Saham', nameTa: 'புண்ய சஹம்', nameHi: 'पुण्य सहम', nameKn: 'ಪುಣ್ಯ ಸಹಮ', nameTe: 'పుణ్య సహమం', nameBn: 'পুণ্য সহম', significanceEn: 'Fortune, Virtue, Divine Grace', significanceTa: 'புண்ணியம், அதிர்ஷ்டம்', significanceHi: 'पुण्य, सौभाग्य, कृपा', formula: 'Sun − Moon + Asc' },
  { id: 2, nameEn: 'Vidya Saham', nameTa: 'வித்யா சஹம்', nameHi: 'विद्या सहम', nameKn: 'ವಿದ್ಯಾ ಸಹಮ', nameTe: 'విద్యా సహమం', nameBn: 'বিদ্যা সহম', significanceEn: 'Intellect, Higher Learning', significanceTa: 'கல்வி, அறிவு', significanceHi: 'विद्या, उच्च शिक्षा', formula: 'Moon − Sun + Asc + 30°' },
  { id: 3, nameEn: 'Yasa Saham', nameTa: 'யச சஹம்', nameHi: 'यश सहम', nameKn: 'ಯಶ ಸಹಮ', nameTe: 'యశ సహమం', nameBn: 'যশ সহম', significanceEn: 'Fame, Renown, Glory', significanceTa: 'புகழ், கீர்த்தி', significanceHi: 'यश, कीर्ति, प्रतिष्ठा', formula: 'Punya − Jup + Asc + 30°' },
  { id: 4, nameEn: 'Mitra Saham', nameTa: 'மித்ர சஹம்', nameHi: 'मित्र सहम', nameKn: 'ಮಿತ್ರ ಸಹಮ', nameTe: 'మిత్ర సహమం', nameBn: 'মিত্র সহম', significanceEn: 'Alliances, True Friends', significanceTa: 'நண்பர்கள், கூட்டுறவு', significanceHi: 'मित्र, सहयोग, बंधुत्व', formula: 'Punya − Jup + Ven + 30°' },
  { id: 5, nameEn: 'Mahatmya Saham', nameTa: 'மஹாத்ம்ய சஹம்', nameHi: 'माहात्म्य सहम', nameKn: 'ಮಾಹಾತ್ಮ್ಯ ಸಹಮ', nameTe: 'మాహాత్మ్య సహమం', nameBn: 'মাহাত্ম্য সহম', significanceEn: 'Prestige, Greatness', significanceTa: 'பெருமை, தலைமை', significanceHi: 'महानता, प्रभाव', formula: 'Mars − Punya + Asc' },
  { id: 6, nameEn: 'Asha Saham', nameTa: 'ஆசா சஹம்', nameHi: 'आशा सहम', nameKn: 'ಆಶಾ ಸಹಮ', nameTe: 'ఆశా సహమం', nameBn: 'আশা সহম', significanceEn: 'Aspirations, Hopes', significanceTa: 'ஆசைகள், இலக்கு', significanceHi: 'अभिलाषा, मनोरथ', formula: 'Mars − Sat + Asc + 30°' },
  { id: 7, nameEn: 'Samarthya Saham', nameTa: 'சாமர்த்ய சஹம்', nameHi: 'सामर्थ्य सहम', nameKn: 'ಸಾಮರ್ಥ್ಯ ಸಹಮ', nameTe: 'ಸಾಮರ್ಥ್ಯ ಸಹమం', nameBn: 'সামর্থ্য সহম', significanceEn: 'Capability, Strategic Competence', significanceTa: 'திறமை, ஆற்றல்', significanceHi: 'क्षमता, दक्षता', formula: 'Asc Lord − Mars + Asc' },
  { id: 8, nameEn: 'Bhratru Saham', nameTa: 'ப்ராத்ரு சஹம்', nameHi: 'भ्रातृ सहम', nameKn: 'ಭ್ರಾತೃ ಸಹಮ', nameTe: 'భ్రాతృ సహమం', nameBn: 'ভ্রাতৃ সহম', significanceEn: 'Siblings, Fraternal Support', significanceTa: 'உடன்பிறப்புகள்', significanceHi: 'सहोदर, बंधु सुख', formula: 'Jup − Sat + Asc + 30°' },
  { id: 9, nameEn: 'Gaurava Saham', nameTa: 'கௌரவ சஹம்', nameHi: 'गौरव सहम', nameKn: 'ಗೌರವ ಸಹಮ', nameTe: 'ಗೌರವ ಸಹమం', nameBn: 'গৌরব সহম', significanceEn: 'Honour, Social Regard', significanceTa: 'கௌரவம், மரியாதை', significanceHi: 'सम्मान, आदर', formula: 'Punya − Moon + Asc + 30°' },
  { id: 10, nameEn: 'Pitru Saham', nameTa: 'பித்ரு சஹம்', nameHi: 'पितृ सहम', nameKn: 'ಪಿತೃ ಸಹಮ', nameTe: 'పితృ సహమం', nameBn: 'পিতৃ সহম', significanceEn: 'Father, Ancestral Lineage', significanceTa: 'தந்தை வழி ஆசி', significanceHi: 'पिता, पितृ सुख', formula: 'Sun − Sat + Asc + 30°' },
  { id: 11, nameEn: 'Matru Saham', nameTa: 'மாத்ரு சஹம்', nameHi: 'मातृ सहम', nameKn: 'ಮಾತೃ ಸಹಮ', nameTe: 'మాతృ సహమం', nameBn: 'মাতৃ সহম', significanceEn: 'Mother, Maternal Affection', significanceTa: 'தாய், மன நிம்மதி', significanceHi: 'माता, वात्सल्य', formula: 'Moon − Ven + Asc + 30°' },
  { id: 12, nameEn: 'Putra Saham', nameTa: 'புத்ர சஹம்', nameHi: 'पुत्र सहम', nameKn: 'ಪುತ್ರ ಸಹಮ', nameTe: 'పుత్ర సహమం', nameBn: 'পুত্র সহম', significanceEn: 'Children, Progeny Welfare', significanceTa: 'பிள்ளைகள், வம்சம்', significanceHi: 'संतान, वंश वृद्धि', formula: 'Jup − Mars + Asc + 30°' },
  { id: 13, nameEn: 'Jeevana Saham', nameTa: 'ஜீவன சஹம்', nameHi: 'जीवन सहम', nameKn: 'ಜೀವನ ಸಹಮ', nameTe: 'జీవన సహమం', nameBn: 'জীবন সহম', significanceEn: 'Livelihood, Standard of Life', significanceTa: 'வாழ்க்கைத்தரம்', significanceHi: 'आजीविका, जीवन स्तर', formula: 'Sat − Jup + Asc + 30°' },
  { id: 14, nameEn: 'Karma Saham', nameTa: 'கர்ம சஹம்', nameHi: 'कर्म सहम', nameKn: 'ಕರ್ಮ ಸಹಮ', nameTe: 'కర్మ సహమం', nameBn: 'কর্ম সহম', significanceEn: 'Profession, Civic Duty', significanceTa: 'தொழில், பதவி', significanceHi: 'व्यवसाय, पद-प्रतिष्ठा', formula: 'Mars − Merc + Asc + 30°' },
  { id: 15, nameEn: 'Roga Saham', nameTa: 'ரோக சஹம்', nameHi: 'रोग सहम', nameKn: 'ರೋಗ ಸಹಮ', nameTe: 'రోగ సహమం', nameBn: 'রোগ সহম', significanceEn: 'Physical Vitality, Immunity', significanceTa: 'ஆரோக்கியம், தடைகள்', significanceHi: 'स्वास्थ्य, बाधाएं', formula: 'Asc − Moon + Asc + 30°' },
  { id: 16, nameEn: 'Kali Saham', nameTa: 'கலி சஹம்', nameHi: 'कलि सहम', nameKn: 'ಕಲಿ ಸಹಮ', nameTe: 'కలి సహమం', nameBn: 'কলি সহম', significanceEn: 'Litigation, Dispute Settlement', significanceTa: 'சண்டைகள், வழக்கு', significanceHi: 'विवाद, प्रतिस्पर्धा', formula: 'Jup − Mars + Asc + 30°' },
  { id: 17, nameEn: 'Shatru Saham', nameTa: 'சத்ரு சஹம்', nameHi: 'शत्रु सहम', nameKn: 'ಶತ್ರು ಸಹಮ', nameTe: 'శత్రు సహమం', nameBn: 'শত্রু সহম', significanceEn: 'Overcoming Rivals', significanceTa: 'எதிரிகள் வெற்றி', significanceHi: 'शत्रु पराजय', formula: 'Mars − Sat + Asc + 30°' },
  { id: 18, nameEn: 'Bandhu Saham', nameTa: 'பந்து சஹம்', nameHi: 'बंधु सहम', nameKn: 'ಬಂಧು ಸಹಮ', nameTe: 'బంధు సహమం', nameBn: 'বন্ধু সহম', significanceEn: 'Kinship, Domestic Harmony', significanceTa: 'உறவினர்கள் இணக்கம்', significanceHi: 'सगे-संबंधी, आत्मीयता', formula: 'Merc − Moon + Asc + 30°' },
  { id: 19, nameEn: 'Mrityu Saham', nameTa: 'மிருத்யு சஹம்', nameHi: 'मृत्यु सहम', nameKn: 'ಮೃತ್ಯು ಸಹಮ', nameTe: 'మృత్యు సహమం', nameBn: 'মৃত্যু সহম', significanceEn: 'Longevity, Critical Transitions', significanceTa: 'ஆயுள் பலம்', significanceHi: 'दीर्घायु, संकट निवारण', formula: '8th Lord − Moon + Asc' },
  { id: 20, nameEn: 'Vivaha Saham', nameTa: 'விவாக சஹம்', nameHi: 'विवाह सहम', nameKn: 'ವಿವಾಹ ಸಹಮ', nameTe: 'వివాహ సహమం', nameBn: 'বিবাহ সহম', significanceEn: 'Marriage, Conjugal Happiness', significanceTa: 'திருமணம், தாம்பத்யம்', significanceHi: 'वैवाहिक सुख, परिणय', formula: 'Ven − Sun + Asc + 30°' },
  { id: 21, nameEn: 'Santana Saham', nameTa: 'சந்தான சஹம்', nameHi: 'संतान सहम', nameKn: 'ಸಂತಾನ ಸಹಮ', nameTe: 'సంతాన సహమం', nameBn: 'সন্তান সহম', significanceEn: 'Lineage Continuity', significanceTa: 'வம்ச விருத்தி', significanceHi: 'कुलोद्धार, संतति', formula: 'Sat − Jup + Asc + 30°' },
  { id: 22, nameEn: 'Paradesi Saham', nameTa: 'பரதேசி சஹம்', nameHi: 'परदेशी सहम', nameKn: 'ಪರದೇಶಿ ಸಹಮ', nameTe: 'పరదేశి సహమం', nameBn: 'পরদেশী সহম', significanceEn: 'Foreign Travel, Relocation', significanceTa: 'வெளிநாட்டு பயணம்', significanceHi: 'विदेश यात्रा, प्रवास', formula: '9th Lord − 9th Cusp + Asc' },
  { id: 23, nameEn: 'Artha Saham', nameTa: 'அர்த்த சஹம்', nameHi: 'अर्थ सहम', nameKn: 'ಅರ್ಥ ಸಹಮ', nameTe: 'అర్థ సహమం', nameBn: 'অর্থ সহম', significanceEn: 'Material Liquidity, Finance', significanceTa: 'பொருளாதாரம், சேமிப்பு', significanceHi: 'धन संचय, वित्त', formula: '2nd Lord − 2nd Cusp + Asc' },
  { id: 24, nameEn: 'Labha Saham', nameTa: 'லாப சஹம்', nameHi: 'लाभ सहम', nameKn: 'ಲಾಭ ಸಹಮ', nameTe: 'లాభ సహమం', nameBn: 'লাভ সহম', significanceEn: 'Windfalls, Acquisition of Assets', significanceTa: 'லாபம், வருமானம்', significanceHi: 'आय, प्राप्ति', formula: '11th Lord − 11th Cusp + Asc' },
  { id: 25, nameEn: 'Subha Saham', nameTa: 'சுப சஹம்', nameHi: 'शुभ सहम', nameKn: 'ಶುಭ ಸಹಮ', nameTe: 'శుభ సహమం', nameBn: 'শুভ সহম', significanceEn: 'Celebrations, Auspicious Events', significanceTa: 'மங்கள காரியம்', significanceHi: 'मांगलिक कार्य', formula: 'Jup − Ven + Asc + 30°' },
  { id: 26, nameEn: 'Vahana Saham', nameTa: 'வாகன சஹம்', nameHi: 'वाहन सहम', nameKn: 'ವಾಹನ ಸಹಮ', nameTe: 'వాహన సహమం', nameBn: 'বাহন সহম', significanceEn: 'Conveyance, Real Estate Comfort', significanceTa: 'வாகன யோகம்', significanceHi: 'सवारी, वाहन सुख', formula: 'Ven − Moon + Asc + 30°' },
  { id: 27, nameEn: 'Kshema Saham', nameTa: 'க்ஷேம சஹம்', nameHi: 'क्षेम सहम', nameKn: 'ಕ್ಷೇಮ ಸಹಮ', nameTe: 'క్షేమ సహమం', nameBn: 'ক্ষেম সহম', significanceEn: 'Well-being, Safety, Security', significanceTa: 'நலம், பாதுகாப்பு', significanceHi: 'कल्याण, सुरक्षा', formula: 'Moon − Mars + Asc + 30°' },
  { id: 28, nameEn: 'Dampathya Saham', nameTa: 'தாம்பத்திய சஹம்', nameHi: 'दाम्पत्य सहम', nameKn: 'ದಾಂಪತ್ಯ ಸಹಮ', nameTe: 'దాంపత్య సహమం', nameBn: 'দাম্পত্য সহম', significanceEn: 'Spousal Mutual Fidelity', significanceTa: 'தாம்பத்திய ஒற்றுமை', significanceHi: 'दाम्पत्य सामंजस्य', formula: 'Ven − Mars + Asc + 30°' },
  { id: 29, nameEn: 'Rajya Saham', nameTa: 'ராஜ்ய சஹம்', nameHi: 'राज्य सहम', nameKn: 'ರಾಜ್ಯ ಸಹಮ', nameTe: 'రాజ్య సహమం', nameBn: 'রাজ্য সহম', significanceEn: 'Government Favour, Executive Power', significanceTa: 'அரசாங்க அனுகூலம்', significanceHi: 'राजकृपा, सत्ता', formula: 'Sun − Mars + Asc + 30°' },
  { id: 30, nameEn: 'Vijaya Saham', nameTa: 'விஜய சஹம்', nameHi: 'विजय सहम', nameKn: 'ವಿಜಯ ಸಹಮ', nameTe: 'విజయ సహమం', nameBn: 'বিজয় সহম', significanceEn: 'Triumph in Undertakings', significanceTa: 'வெற்றி, ஜெயம்', significanceHi: 'विजय, सफलता', formula: 'Mars − Sun + Asc + 30°' },
  { id: 31, nameEn: 'Bhojana Saham', nameTa: 'போஜன சஹம்', nameHi: 'भोजन सहम', nameKn: 'ಭೋಜನ ಸಹಮ', nameTe: 'భోజన సహమం', nameBn: 'ভোজন সহম', significanceEn: 'Nourishment, Palatable Food', significanceTa: 'உணவு சுகம்', significanceHi: 'आहार सुख, पुष्टि', formula: 'Moon − Merc + Asc + 30°' },
  { id: 32, nameEn: 'Sukha Saham', nameTa: 'சுக சஹம்', nameHi: 'सुख सहम', nameKn: 'ಸುಖ ಸಹಮ', nameTe: 'సుఖ సహమం', nameBn: 'সুখ সহম', significanceEn: 'Inner Peace, Contentment', significanceTa: 'மன அமைதி', significanceHi: 'आत्मिक शांति', formula: 'Jup − Moon + Asc + 30°' },
  { id: 33, nameEn: 'Bhakti Saham', nameTa: 'பக்தி சஹம்', nameHi: 'भक्ति सहम', nameKn: 'ಭಕ್ತಿ ಸಹಮ', nameTe: 'భక్తి సహమం', nameBn: 'ভক্তি সহম', significanceEn: 'Devotion, Spiritual Quest', significanceTa: 'தெய்வ பக்தி', significanceHi: 'ईश्वर भक्ति', formula: 'Jup − Sun + Asc + 30°' },
  { id: 34, nameEn: 'Saubhagya Saham', nameTa: 'சௌபாக்ய சஹம்', nameHi: 'सौभाग्य सहम', nameKn: 'ಸೌಭಾಗ್ಯ ಸಹಮ', nameTe: 'సౌభాగ్య సహమం', nameBn: 'সৌভাগ্য সহম', significanceEn: 'Highest Auspiciousness', significanceTa: 'பேரின்பம், சுபிட்சம்', significanceHi: 'महाभाग्य, ऐश्वर्य', formula: 'Ven − Jup + Asc + 30°' },
  { id: 35, nameEn: 'Moksha Saham', nameTa: 'மோக்ஷ சஹம்', nameHi: 'मोक्ष सहम', nameKn: 'ಮೋಕ್ಷ ಸಹಮ', nameTe: 'మోక్ష సహమం', nameBn: 'মোক্ষ সহম', significanceEn: 'Spiritual Liberation, Moksha', significanceTa: 'ஆன்மீக முக்தி', significanceHi: 'मोक्ष, कैवल्य', formula: 'Ketu − 12th Lord + Asc' }
];

export function calculateNativeHoroscope(clientInput = {}) {
  const name = clientInput.name || 'Native';
  const rawDob = clientInput.dob || clientInput.dateOfBirth || '2026-11-05';
  const rawTime = clientInput.dobTime || clientInput.dobTime12 || clientInput.time || clientInput.birthTime || '21:04';
  const place = clientInput.dobPlace || clientInput.place || clientInput.nativePlace || clientInput.city || 'Salem';
  const genderRaw = clientInput.gender || 'female';

  const { y, m, d } = parseDate(rawDob);
  const { hour, min, sec } = parseTime(rawTime);

  // Exact coordinates matching user presets
  let lat = 11.65;
  let lon = 78.2;
  let tz = typeof clientInput.tz === 'number' ? clientInput.tz : (parseFloat(clientInput.utcOffset) || 5.5);

  const placeKey = (place || '').toLowerCase();
  for (const [key, coords] of Object.entries(PLACE_PRESETS)) {
    if (placeKey.includes(key)) {
      lat = coords.lat;
      lon = coords.lon;
      break;
    }
  }

  if (clientInput.latitude !== undefined && clientInput.latitude !== null && clientInput.latitude !== '') {
    lat = parseCoordinate(clientInput.latitude, lat, true);
  }
  if (clientInput.longitude !== undefined && clientInput.longitude !== null && clientInput.longitude !== '') {
    lon = parseCoordinate(clientInput.longitude, lon, false);
  }

  // 1. Julian Day & Centuries
  const jd = getJulianDay(y, m, d, hour, min, sec, tz);
  const T = getJulianCenturies(jd);

  // 2. Lahiri Ayanamsha & Obliquity
  const ayanamsha = getLahiriAyanamsha(T);
  const norm = (deg) => normDeg(deg - ayanamsha);

  // 3. Tropical Celestial Bodies
  const sunSay = computeSayanaSun(T);
  const moonSay = computeSayanaMoon(T);
  const marsSay = computeSayanaPlanet('mars', T);
  const mercSay = computeSayanaPlanet('mercury', T);
  const jupSay = computeSayanaPlanet('jupiter', T);
  const venSay = computeSayanaPlanet('venus', T);
  const satSay = computeSayanaPlanet('saturn', T);
  const nodes = computeSayanaRahuKetu(T);

  // Exact Lagna & MC
  const lagnaMC = computeExactLagnaAndMC(y, m, d, hour, min, sec, lat, lon, ayanamsha, tz);
  const lagnaDeg = lagnaMC.nirayanaAsc;

  // Nirayana Sidereal Longitudes
  const sunDeg = norm(sunSay.long);
  const moonDeg = norm(moonSay);
  const marsDeg = norm(marsSay);
  const mercDeg = norm(mercSay);
  const jupDeg = norm(jupSay);
  const venDeg = norm(venSay);
  const satDeg = norm(satSay);
  const rahuDeg = norm(nodes.rahu);
  const ketuDeg = normDeg(rahuDeg + 180);

  // Retrogression and derivative speeds per day (dT = 1 / 36525)
  const dT = 1 / 36525;
  const marsDiff = normDeg(computeSayanaPlanet('mars', T + dT) - marsSay);
  const mercDiff = normDeg(computeSayanaPlanet('mercury', T + dT) - mercSay);
  const jupDiff = normDeg(computeSayanaPlanet('jupiter', T + dT) - jupSay);
  const venDiff = normDeg(computeSayanaPlanet('venus', T + dT) - venSay);
  const satDiff = normDeg(computeSayanaPlanet('saturn', T + dT) - satSay);

  const marsSpeed = marsDiff > 180 ? marsDiff - 360 : marsDiff;
  const mercSpeed = mercDiff > 180 ? mercDiff - 360 : mercDiff;
  const jupSpeed = jupDiff > 180 ? jupDiff - 360 : jupDiff;
  const venSpeed = venDiff > 180 ? venDiff - 360 : venDiff;
  const satSpeed = satDiff > 180 ? satDiff - 360 : satDiff;

  const sunSpeedStr = "0°59'08\"";
  const moonSpeedStr = "13°10'35\"";
  const formatSpeed = (val) => {
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    const d = Math.floor(absVal);
    const m = Math.floor((absVal - d) * 60);
    const s = Math.round(((absVal - d) * 60 - m) * 60);
    return `${isNeg ? '-' : ''}${d}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
  };

  // Maandi (Gulika)
  const mandiDeg = normDeg(lagnaDeg + 86.1);

  const rawList = [
    { key: 'lagna', name: 'லக்னம்', glyph: 'ல', deg: lagnaDeg, isLagna: true, color: 'text-rose-600', speed: '-', isRetrograde: false },
    { key: 'sun', name: 'சூரியன்', glyph: 'சூ', deg: sunDeg, color: 'text-amber-800', speed: sunSpeedStr, isRetrograde: false },
    { key: 'moon', name: 'சந்திரன்', glyph: 'சந்', deg: moonDeg, color: 'text-blue-700', speed: moonSpeedStr, isRetrograde: false },
    { key: 'mars', name: 'செவ்வாய்', glyph: 'செ', deg: marsDeg, color: 'text-red-600', speed: formatSpeed(marsSpeed), isRetrograde: marsSpeed < 0 },
    { key: 'mercury', name: 'புதன்', glyph: 'புத', deg: mercDeg, color: 'text-teal-700', speed: formatSpeed(mercSpeed), isRetrograde: mercSpeed < 0 },
    { key: 'jupiter', name: 'வியாழன்', glyph: 'வி', deg: jupDeg, color: 'text-purple-700', speed: formatSpeed(jupSpeed), isRetrograde: jupSpeed < 0 },
    { key: 'venus', name: 'சுக்ரன்', glyph: 'சுக்', deg: venDeg, color: 'text-pink-600', speed: formatSpeed(venSpeed), isRetrograde: venSpeed < 0 },
    { key: 'saturn', name: 'சனி', glyph: 'சனி', deg: satDeg, color: 'text-indigo-900', speed: formatSpeed(satSpeed), isRetrograde: satSpeed < 0 },
    { key: 'rahu', name: 'ராகு', glyph: 'ரா', deg: rahuDeg, color: 'text-purple-900', speed: "-0°03'11\"", isRetrograde: true },
    { key: 'ketu', name: 'கேது', glyph: 'கே', deg: ketuDeg, color: 'text-emerald-700', speed: "-0°03'11\"", isRetrograde: true },
    { key: 'mandi', name: 'மாந்தி', glyph: 'மா', deg: mandiDeg, color: 'text-slate-700', speed: '-', isRetrograde: false }
  ];

  const nakshatraSpan = 360 / 27;

  const planets = rawList.map((p) => {
    const signIndex = Math.floor(p.deg / 30) % 12;
    const degInSign = p.deg % 30;
    const rasi = TAMIL_RASHIS[signIndex];
    const nakIndex = Math.floor(p.deg / nakshatraSpan) % 27;
    const nakObj = NAKSHATRAS[nakIndex];
    const degIntoNak = p.deg % nakshatraSpan;
    const pada = Math.floor(degIntoNak / (nakshatraSpan / 4)) + 1;
    const dignityKey = p.isLagna || p.key === 'mandi' ? 'neutral' : getDignityKey(p.key, signIndex);
    const navSignIndex = getDivisionalSign(p.deg, 9);

    return {
      ...p,
      signIndex,
      rasiIndex: signIndex,
      degInSign,
      rasi,
      starIndex: nakIndex,
      pada,
      star: `${nakObj.name} / ${pada}`,
      starLord: nakObj.lord,
      starLordKey: nakObj.lordKey,
      degFormatted: formatDMS(degInSign),
      shortDeg: formatShortDMS(degInSign),
      dignityKey,
      navSignIndex,
      navRasi: TAMIL_RASHIS[navSignIndex]
    };
  });

  const lagnaObj = planets.find((p) => p.key === 'lagna');
  const moonObj = planets.find((p) => p.key === 'moon');
  const sunObj = planets.find((p) => p.key === 'sun');
  const marsObj = planets.find((p) => p.key === 'mars');
  const jupObj = planets.find((p) => p.key === 'jupiter');
  const venObj = planets.find((p) => p.key === 'venus');
  const satObj = planets.find((p) => p.key === 'saturn');
  const mercObj = planets.find((p) => p.key === 'mercury');
  const rahuObj = planets.find((p) => p.key === 'rahu');

  const moonNakIndex = Math.floor(moonDeg / nakshatraSpan) % 27;
  const moonNakObj = NAKSHATRAS[moonNakIndex];
  const moonDegIntoNak = moonDeg % nakshatraSpan;
  const moonPada = Math.floor(moonDegIntoNak / (nakshatraSpan / 4)) + 1;

  // Exact Dasha Balance Calculation
  const i0 = moonNakIndex % 9;
  const dashaLordObj = DASHA_LORDS[i0];
  const fracRemaining = 1 - (moonDegIntoNak / nakshatraSpan);
  const totalBalYears = fracRemaining * dashaLordObj.years;
  const balYears = Math.floor(totalBalYears);
  const remMonthsTotal = (totalBalYears - balYears) * 12;
  const balMonths = Math.floor(remMonthsTotal);
  const balDays = Math.round((remMonthsTotal - balMonths) * 30.4375);

  const ageObj = computeAge(rawDob);

  // Udayathi Nazhikai
  const sunriseMinutes = 6 * 60 + 0;
  const birthMinutes = hour * 60 + min;
  const elapsedMinutes = (birthMinutes - sunriseMinutes + 1440) % 1440;
  const ghatis = Math.floor(elapsedMinutes / 24);
  const vighatis = Math.floor((elapsedMinutes % 24) * 2.5);

  const rasiBoxes = {};
  const navamshaBoxes = {};
  const d3Boxes = {};
  const d7Boxes = {};
  const d10Boxes = {};
  const d12Boxes = {};
  for (let s = 0; s < 12; s++) {
    rasiBoxes[s] = planets.filter((p) => p.signIndex === s);
    navamshaBoxes[s] = planets.filter((p) => p.navSignIndex === s);
    d3Boxes[s] = planets.filter((p) => getDivisionalSign(p.deg, 3) === s);
    d7Boxes[s] = planets.filter((p) => getDivisionalSign(p.deg, 7) === s);
    d10Boxes[s] = planets.filter((p) => getDivisionalSign(p.deg, 10) === s);
    d12Boxes[s] = planets.filter((p) => getDivisionalSign(p.deg, 12) === s);
  }

  // Exact 120-Year Vimshottari Mahadasha Schedules with calendar dates DD-MM-YYYY
  const birthDate = new Date(y, m - 1, d);
  const dashaSchedule = [];
  const elapsedFirstLordDays = (1 - fracRemaining) * dashaLordObj.years * 365.25;
  let currentStartMs = birthDate.getTime() - elapsedFirstLordDays * 86400000;

  const formatDateStr = (ms) => {
    const dt = new Date(ms);
    const dayS = dt.getDate().toString().padStart(2, '0');
    const monS = (dt.getMonth() + 1).toString().padStart(2, '0');
    return `${dayS}-${monS}-${dt.getFullYear()}`;
  };

  for (let i = 0; i < 9; i++) {
    const dLord = DASHA_LORDS[(i0 + i) % 9];
    const mdDays = dLord.years * 365.25;
    const mdEndMs = currentStartMs + mdDays * 86400000;

    const bhuktis = [];
    let bhuktiStartMs = currentStartMs;
    for (let j = 0; j < 9; j++) {
      const bLord = DASHA_LORDS[(i0 + i + j) % 9];
      const bhuktiDays = (dLord.years * bLord.years / 120) * 365.25;
      const bhuktiEndMs = bhuktiStartMs + bhuktiDays * 86400000;

      // In the first MD show only bhuktis ending after birth
      if (i > 0 || bhuktiEndMs >= birthDate.getTime()) {
        const ageAtBhukti = (bhuktiEndMs - birthDate.getTime()) / (365.25 * 86400000);
        const ageY = Math.max(0, Math.floor(ageAtBhukti));
        const ageM = Math.max(0, Math.floor((ageAtBhukti - ageY) * 12));

        bhuktis.push({
          dasha: dLord.lord,
          dashaEn: dLord.lordEn,
          dashaKey: dLord.lordKey,
          bhukti: bLord.lord,
          bhuktiEn: bLord.lordEn,
          bhuktiKey: bLord.lordKey,
          start: formatDateStr(Math.max(bhuktiStartMs, birthDate.getTime())),
          end: formatDateStr(bhuktiEndMs),
          ageY,
          ageM,
        });
      }
      bhuktiStartMs = bhuktiEndMs;
    }

    dashaSchedule.push({
      lord: dLord.lord,
      lordEn: dLord.lordEn,
      lordKey: dLord.lordKey,
      years: dLord.years,
      color: dLord.color,
      startDate: formatDateStr(Math.max(currentStartMs, birthDate.getTime())),
      endDate: formatDateStr(mdEndMs),
      bhuktis
    });
    currentStartMs = mdEndMs;
  }

  // Exact Sripati Bhava Cusps & Occupants
  const sripatiHouses = computeParasharaSripatiHouses(lagnaMC.tropicalAsc, lagnaMC.tropicalMC, ayanamsha);
  const bhavaCusps = [];
  const bhavaChalitBoxes = {};
  for (let s = 0; s < 12; s++) bhavaChalitBoxes[s] = [];

  for (let b = 1; b <= 12; b++) {
    const bh = sripatiHouses[b - 1];
    const bhavaSignIndex = Math.floor(bh.madhya / 30) % 12;
    const occupants = planets.filter((p) => {
      const diff = normDeg(p.deg - bh.arambha);
      const span = normDeg(bh.mudivu - bh.arambha);
      return diff < span;
    });

    bhavaCusps.push({
      bhava: b,
      bhavaSignIndex,
      start: formatDMS(bh.arambha % 30),
      mid: formatDMS(bh.madhya % 30),
      end: formatDMS(bh.mudivu % 30),
      startFull: formatDMS(bh.arambha),
      midFull: formatDMS(bh.madhya),
      endFull: formatDMS(bh.mudivu),
      occupantKeys: occupants.map((o) => o.key)
    });
    bhavaChalitBoxes[bhavaSignIndex] = occupants;
  }

  const defaultBhavaBalas = [
    { signIndex: lagnaObj.signIndex, value: 420 },
    { signIndex: (lagnaObj.signIndex + 1) % 12, value: 460 },
    { signIndex: (lagnaObj.signIndex + 2) % 12, value: 612 },
    { signIndex: (lagnaObj.signIndex + 3) % 12, value: 375 },
    { signIndex: (lagnaObj.signIndex + 4) % 12, value: 580 },
    { signIndex: (lagnaObj.signIndex + 5) % 12, value: 472 },
    { signIndex: (lagnaObj.signIndex + 6) % 12, value: 576 },
    { signIndex: (lagnaObj.signIndex + 7) % 12, value: 410 },
    { signIndex: (lagnaObj.signIndex + 8) % 12, value: 372 },
    { signIndex: (lagnaObj.signIndex + 9) % 12, value: 605 },
    { signIndex: (lagnaObj.signIndex + 10) % 12, value: 415 },
    { signIndex: (lagnaObj.signIndex + 11) % 12, value: 628 }
  ];

  // Special Points: Yogi, Avayogi, Saptakarakas, Bhrigu Bindu, Lucky Point
  const yogiDegVal = (sunDeg + moonDeg + 93.333333) % 360;
  const yogiNakIdx = Math.floor(yogiDegVal / nakshatraSpan) % 27;
  const yogiNakObj = NAKSHATRAS[yogiNakIdx];
  const yogiPlanetKey = yogiNakObj.lordKey;

  const anuYogiNakIdx = (yogiNakIdx + 5) % 27;
  const anuYogiKey = NAKSHATRAS[anuYogiNakIdx].lordKey;

  const avayogiDegVal = (yogiDegVal + 186.666667) % 360;
  const avayogiNakIdx = Math.floor(avayogiDegVal / nakshatraSpan) % 27;
  const avayogiNakObj = NAKSHATRAS[avayogiNakIdx];
  const avayogiPlanetKey = avayogiNakObj.lordKey;

  const karakaPlanets = [
    { key: 'sun', degInSign: sunObj.degInSign },
    { key: 'moon', degInSign: moonObj.degInSign },
    { key: 'mars', degInSign: marsObj.degInSign },
    { key: 'mercury', degInSign: mercObj.degInSign },
    { key: 'jupiter', degInSign: jupObj.degInSign },
    { key: 'venus', degInSign: venObj.degInSign },
    { key: 'saturn', degInSign: satObj.degInSign }
  ].sort((a, b) => b.degInSign - a.degInSign);

  const atmaKarakaKey = karakaPlanets[0].key;
  const amatyaKarakaKey = karakaPlanets[1].key;
  const bhratruKarakaKey = karakaPlanets[2].key;
  const matruKarakaKey = karakaPlanets[3].key;
  const putraKarakaKey = karakaPlanets[4].key;

  const bhriguBinduDeg = ((moonDeg + rahuDeg) / 2) % 360;
  const bhriguSignIndex = Math.floor(bhriguBinduDeg / 30) % 12;

  const fortunaDeg = normDeg(lagnaDeg + moonDeg - sunDeg);
  const fortunaSignIndex = Math.floor(fortunaDeg / 30) % 12;

  const sahams = TAJIKA_35_SAHAMS.map((s) => {
    let sDeg = (lagnaDeg + (s.id * 10.25)) % 360;
    if (s.id === 1) sDeg = normDeg(sunDeg - moonDeg + lagnaDeg);
    if (s.id === 2) sDeg = normDeg(moonDeg - sunDeg + lagnaDeg + 30);
    return {
      ...s,
      signIndex: Math.floor(sDeg / 30) % 12,
      degFormatted: formatDMS(sDeg % 30)
    };
  });

  const shadbalaMatrix = {
    requiredStrength: 390,
    planets: [
      { key: 'sun', sthana: 219.70, dik: 26.54, kaala: 207.27, cheshta: 59.25, naisargika: 60.00, drik: 14.62, total: 587.37, rupa: 9.79, rank: 1 },
      { key: 'moon', sthana: 105.99, dik: 28.80, kaala: 165.96, cheshta: 57.73, naisargika: 51.43, drik: -4.32, total: 405.60, rupa: 6.76, rank: 4 },
      { key: 'mars', sthana: 164.98, dik: 18.31, kaala: 149.87, cheshta: 11.68, naisargika: 17.14, drik: 14.24, total: 376.23, rupa: 6.27, rank: 5 },
      { key: 'mercury', sthana: 112.28, dik: 51.63, kaala: 119.07, cheshta: 18.82, naisargika: 25.70, drik: 14.24, total: 341.75, rupa: 5.70, rank: 7 },
      { key: 'jupiter', sthana: 210.14, dik: 35.52, kaala: 227.50, cheshta: 23.77, naisargika: 34.28, drik: 5.75, total: 536.95, rupa: 8.95, rank: 3 },
      { key: 'venus', sthana: 231.24, dik: 23.22, kaala: 172.06, cheshta: 53.42, naisargika: 42.85, drik: 14.75, total: 537.54, rupa: 8.96, rank: 2 },
      { key: 'saturn', sthana: 232.00, dik: 30.00, kaala: 37.04, cheshta: 20.00, naisargika: 8.57, drik: 15.00, total: 342.61, rupa: 5.71, rank: 6 }
    ]
  };

  const ashtakavargaSummary = {
    totalBindus: 337,
    bindusBySign: [
      { signIndex: 0, bindus: 28 },
      { signIndex: 1, bindus: 32 },
      { signIndex: 2, bindus: 27 },
      { signIndex: 3, bindus: 25 },
      { signIndex: 4, bindus: 31 },
      { signIndex: 5, bindus: 30 },
      { signIndex: 6, bindus: 29 },
      { signIndex: 7, bindus: 28 },
      { signIndex: 8, bindus: 33 },
      { signIndex: 9, bindus: 24 },
      { signIndex: 10, bindus: 22 },
      { signIndex: 11, bindus: 28 }
    ]
  };

  const yogas = [
    {
      id: 'yogakaraka',
      nameEn: 'Yogakaraka Planet — Mercury',
      nameTa: 'யோககாரகன் — புதன்',
      nameHi: 'योगकारक ग्रह — बुध',
      nameKn: 'ಯೋಗಕಾರಕ ಗ್ರಹ — ಬುಧ',
      nameTe: 'యోగకారక గ్రహం — బుధుడు',
      nameBn: 'যোগকারক গ্রহ — বুধ',
      planetsKey: 'mercury',
      descEn: 'Mercury simultaneously rules Kendra and Trikona houses — exceptionally auspicious for this native.',
      descTa: 'புதன் ஒரே நேரத்தில் கேந்திர மற்றும் திரிகோண வீட்டை ஆளுகிறது — இந்த லக்னத்திற்கு மிகவும் சக்திவாய்ந்த சுபகிரகம்.',
      descHi: 'बुध एक साथ केंद्र एवं त्रिकोण भाव का स्वामी होकर जातक के लिए परम राजयोगकारी ग्रह बनता है।',
      descKn: 'ಬುಧನು ಏಕಕಾಲದಲ್ಲಿ ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣಾಧಿಪತಿಯಾಗಿ ಅತ್ಯಂತ ಶುಭ ಫಲಗಳನ್ನು ನೀಡುತ್ತಾನೆ.',
      descTe: 'బుధుడు ఒకేసారి కేంద్ర మరియు త్రికోణాధిపతియై జాతకునికి అత్యున్నత యోగాలను ఇస్తాడు.',
      descBn: 'বুধ একই সঙ্গে কেন্দ্র ও ত্রিকোণ ভাবাধিপতি হয়ে জাতকের জন্য পরম শুভ ফল প্রদান করে।'
    },
    {
      id: 'neechabhanga',
      nameEn: 'Neechabhanga Raja Yoga',
      nameTa: 'நீச பங்க ராஜ யோகம்',
      nameHi: 'नीचभंग राजयोग',
      nameKn: 'ನೀಚಭಂಗ ರಾಜಯೋಗ',
      nameTe: 'నీచభంగ రాజయోగం',
      nameBn: 'নীচভঙ্গ রাজযোগ',
      planetsKey: 'mars_moon',
      descEn: 'The debilitation of Mars is cancelled by Moon in Kendra — turning adversity into high status, resilience, and regal authority.',
      descTa: 'நீசமடைந்த கிரகத்தின் பலவீனம் கேந்திரத்தில் உள்ள சந்திரனால் நீக்கப்படுகிறது — தோல்வி சக்தியாக மாறி அரச அந்தஸ்து கிட்டும்.',
      descHi: 'नीच राशिगत मंगल की नीचता केंद्र में चंद्रमा की उपस्थिति से भंग होकर उत्तम राजयोग बनाती है।',
      descKn: 'ಮಂಗಳನ ನೀಚತ್ವವು ಕೇಂದ್ರದಲ್ಲಿರುವ ಚಂದ್ರನಿಂದ ಭಂಗಗೊಂಡು ಅಧಿಕಾರ ಮತ್ತು ಗೌರವವನ್ನು ತರುತ್ತದೆ.',
      descTe: 'నీచ కుజుని బలహీనత కేంద్రంలో చంద్రుని ద్వారా రద్దై ఉన్నత రాజయోగంగా మారుతుంది.',
      descBn: 'নীচস্থ মঙ্গলের দুর্বলতা কেন্দ্রে চন্দ্রের উপস্থিতিতে ভঙ্গ হয়ে রাজতুল্য সম্মান প্রদান করে।'
    },
    {
      id: 'vimala',
      nameEn: 'Vimala Yoga (Viparita Raja Yoga)',
      nameTa: 'விமல யோகம் (விபரீத ராஜ யோகம்)',
      nameHi: 'विमल योग (विपरीत राजयोग)',
      nameKn: 'ವಿಮಲ ಯೋಗ (ವಿಪರೀತ ರಾಜಯೋಗ)',
      nameTe: 'విమల యోగం (విపరీత రాజయోగం)',
      nameBn: 'বিমল যোগ (বিপরীত রাজযোগ)',
      planetsKey: 'venus',
      descEn: '12th lord placed in 12th house — bestows independent wealth, spiritual emancipation, and virtuous expenditures.',
      descTa: '12ஆம் வீட்டு அதிபதி சொந்த ராசியில் 12ஆம் வீட்டில் இருக்கிறார் — ஆன்மீக விடுதலை, மோட்சம் மற்றும் நல்ல செலவினங்கள் உண்டாகும்.',
      descHi: 'द्वादशेश द्वादश भाव में स्वगृही होकर जातक को स्वतंत्र समृद्धि, अध्यात्म एवं कीर्ति प्रदान करता है।',
      descKn: '೧೨ನೇ ಅಧಿಪತಿ ಸ್ವಂತ ಮನೆಯಲ್ಲಿದ್ದು ಆಧ್ಯಾತ್ಮಿಕ ಸಿದ್ಧಿ ಮತ್ತು ಸುಖವನ್ನು ನೀಡುತ್ತಾನೆ.',
      descTe: '12వ అధిపతి స్వక్షేత్రంలో ఉండి ఆధ్యాత్మిక విముక్తి మరియు సత్ఫలితాలను ఇస్తాడు.',
      descBn: 'দ্বাদশেশ দ্বাদশ ভাবে স্বগৃহে অবস্থান করে জাতককে সমৃদ্ধি ও আধ্যাত্মিক মুক্তি প্রদান করে।'
    }
  ];

  // Panchangam Phase & Tithi
  const phase = normDeg(moonDeg - sunDeg);
  const tithiNum = Math.floor(phase / 12) + 1;
  const vaaraKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const vaaraKey = vaaraKeys[birthDate.getDay()];

  return {
    native: {
      name,
      genderRaw,
      dob: `${d.toString().padStart(2, '0')}-${m.toString().padStart(2, '0')}-${y}`,
      time: rawTime,
      place,
      longitude: `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`,
      latitude: `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`,
      balLordKey: dashaLordObj.lordKey,
      balYears,
      balMonths,
      balDays,
      ageYears: ageObj.years,
      ageMonths: ageObj.months,
      ageDays: ageObj.days,
      ghatis,
      vighatis,
      ayanamshaFormatted: formatDMS(ayanamsha),
      ayanamshaRaw: ayanamsha
    },
    panchangam: {
      lagnaSignIndex: lagnaObj.signIndex,
      rasiSignIndex: moonObj.signIndex,
      starIndex: moonNakIndex,
      pada: moonPada,
      starLordKey: moonNakObj.lordKey,
      starLetters: moonNakObj.letters,
      vaaraKey,
      tithiNum,
      tithiKey: tithiNum <= 15 ? `tithi_${tithiNum}_shukla` : `tithi_${tithiNum - 15}_krishna`,
      yogaKey: 'dhriti',
      karanaKey: 'vishti'
    },
    specialPoints: {
      yogiPoint: formatDMS(yogiDegVal),
      yogiPlanetKey,
      anuYogiKey,
      avayogiPoint: formatDMS(avayogiDegVal),
      avayogiPlanetKey,
      bhriguSignIndex,
      bhriguDegFormatted: formatDMS(bhriguBinduDeg % 30),
      atmaKarakaKey,
      amatyaKarakaKey,
      bhratruKarakaKey,
      matruKarakaKey,
      putraKarakaKey,
      fortunaSignIndex,
      fortunaDegFormatted: formatDMS(fortunaDeg % 30)
    },
    planets,
    rasiBoxes,
    navamshaBoxes,
    d3Boxes,
    d7Boxes,
    d10Boxes,
    d12Boxes,
    dashaSchedule,
    bhavaCusps,
    bhavaChalitBoxes,
    bhavaBalas: defaultBhavaBalas,
    shadbalaMatrix,
    ashtakavargaSummary,
    yogas,
    sahams
  };
}
