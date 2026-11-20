path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

helpers_code = '''
export const TAMIL_YEARS = [
  'பிரபவ', 'விபவ', 'சுக்ல', 'பிரமோதூத', 'பிரசோற்பத்தி', 'ஆங்கீரச', 'ஸ்ரீமுக', 'பவ', 'யுவ', 'தாது',
  'ஈஸ்வர', 'வெகுதானிய', 'பிரமாதி', 'விக்ரம', 'விஷு', 'சித்திரபானு', 'சுபானு', 'தாரண', 'பார்த்திப', 'விய',
  'சர்வசித்து', 'சர்வதாரி', 'விரோதி', 'விகிருதி', 'கர', 'நந்தன', 'விஜய', 'ஜய', 'மன்மத', 'துன்முகி',
  'ஹேவிளம்பி', 'விளம்பி', 'விகாரி', 'சார்வரி', 'பிலவ', 'சுபகிருது', 'சோபகிருது', 'குரோதி', 'விசுவாசுவ', 'பராபவ',
  'பிலவங்க', 'கீலக', 'சௌமிய', 'சாதாரண', 'விரோதிகிருது', 'பரிதாபி', 'பிரமாதீச', 'ஆனந்த', 'ராட்சச', 'நள',
  'பிங்கள', 'காளயுக்தி', 'சித்தார்த்தி', 'ரௌத்திரி', 'துன்மதி', 'துந்துபி', 'ருத்ரோத்காரி', 'ரக்தாட்சி', 'குரோதன', 'அட்சய'
];

export const TAMIL_MONTHS = [
  'சித்திரை', 'வைகாசி', 'ஆனி', 'ஆடி', 'ஆவணி', 'புரட்டாசி',
  'ஐப்பசி', 'கார்த்திகை', 'மார்கழி', 'தை', 'மாசி', 'பங்குனி'
];

export const VEDIC_WEEKDAYS_TA = [
  'ஞாயிற்றுக்கிழமை', 'திங்கட்கிழமை', 'செவ்வாய்க்கிழமை', 'புதன்கிழமை',
  'வியாழக்கிழமை', 'வெள்ளிக்கிழமை', 'சனிக்கிழமை'
];

export function computeTopocentricSunRiseSet(Y, M, D, lat = 11.2, lon = 78.2, utcOffsetNum = 5.5, sunLon = 0) {
  const D2R = Math.PI / 180;
  let sLon = sunLon;
  if (!sLon) {
    const startYear = new Date(Y, 0, 1);
    const curDate = new Date(Y, M - 1, D);
    const dayOfYear = Math.floor((curDate - startYear) / 86400000);
    sLon = (280.46 + 0.9856 * dayOfYear) % 360;
  }
  const eps = 23.44;
  const sin_dec = Math.sin(eps * D2R) * Math.sin(sLon * D2R);
  const cos_dec = Math.cos(Math.asin(sin_dec));
  const sin_h0 = Math.sin(-0.833 * D2R);
  let cos_H0 = (sin_h0 - Math.sin(lat * D2R) * sin_dec) / (Math.cos(lat * D2R) * cos_dec);
  cos_H0 = Math.max(-1.0, Math.min(1.0, cos_H0));
  const H0 = Math.acos(cos_H0) * 180 / Math.PI / 15.0; // hours

  const stdMer = utcOffsetNum * 15.0;
  const lonCorr = (stdMer - lon) / 15.0;
  const noon = 12.0 + lonCorr;

  const sunriseHours = noon - H0;
  const sunsetHours = noon + H0;

  const srH = Math.floor(sunriseHours);
  const srM = Math.floor((sunriseHours - srH) * 60);
  const srS = Math.round((((sunriseHours - srH) * 60) - srM) * 60);

  const ssH = Math.floor(sunsetHours);
  const ssM = Math.floor((sunsetHours - ssH) * 60);
  const ssS = Math.round((((sunsetHours - ssH) * 60) - ssM) * 60);

  const sr12H = srH % 12 === 0 ? 12 : srH % 12;
  const ss12H = ssH % 12 === 0 ? 12 : ssH % 12;

  const sunriseStr = `${String(sr12H).padStart(2, '0')}:${String(srM).padStart(2, '0')}:${String(srS).padStart(2, '0')} AM (பிம்ப மத்தி)`;
  const sunsetStr = `${String(ss12H).padStart(2, '0')}:${String(ssM).padStart(2, '0')}:${String(ssS).padStart(2, '0')} PM (பிம்ப மத்தி)`;

  return { sunriseHours, sunsetHours, sunriseStr, sunsetStr };
}

export function computeTamilCalendarDate({ dob, dobTime, sunLon, sunriseHour = 6.668, weekdayIdx = 0 }) {
  const parts = dob.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const tParts = (dobTime || '12:00:00').split(':');
  const bHour = parseInt(tParts[0], 10) + parseInt(tParts[1] || '0', 10) / 60 + parseFloat(tParts[2] || '0') / 3600;

  let calWeekday = weekdayIdx;
  if (bHour < sunriseHour) {
    calWeekday = (calWeekday - 1 + 7) % 7;
  }

  const isBeforeNewYear = (m < 4) || (m === 4 && d < 14);
  const baseYear = isBeforeNewYear ? y - 1 : y;
  const yearIdx = ((baseYear - 1987) % 60 + 60) % 60;
  const yearName = TAMIL_YEARS[yearIdx] || 'துந்துபி';

  const signIdx = Math.floor(sunLon / 30) % 12;
  const monthName = TAMIL_MONTHS[signIdx] || 'மார்கழி';

  const degInSign = sunLon % 30;
  let dayNum = Math.floor(degInSign);
  if (bHour < sunriseHour) {
    dayNum = Math.floor(degInSign);
  } else {
    dayNum = Math.floor(degInSign) + 1;
  }
  if (dayNum <= 0) dayNum = 1;

  const weekdayName = VEDIC_WEEKDAYS_TA[calWeekday] || 'ஞாயிற்றுக்கிழமை';
  return `${yearName} ${monthName}-${dayNum} ${weekdayName}`;
}

export function computeClassicalMandi({ Y, M, D, birthHour, lat, lon, utcOffsetNum = 5.5, sunriseHours = 6.66, sunsetHours = 18.0, sunLon = 0, calWeekday = 0 }) {
  const isDay = (birthHour >= sunriseHours && birthHour < sunsetHours);
  let effectiveWeekday = calWeekday;
  let baseHour = sunriseHours;
  let spanDur = 12;

  if (isDay) {
    spanDur = sunsetHours > sunriseHours ? sunsetHours - sunriseHours : 12;
    baseHour = sunriseHours;
    effectiveWeekday = calWeekday;
  } else {
    if (birthHour < sunriseHours) {
      effectiveWeekday = (calWeekday - 1 + 7) % 7;
      spanDur = (sunriseHours + 24) - sunsetHours;
      baseHour = sunsetHours;
    } else {
      effectiveWeekday = calWeekday;
      spanDur = (sunriseHours + 24) - sunsetHours;
      baseHour = sunsetHours;
    }
  }

  const partDur = spanDur / 8.0;
  const startLord = isDay ? effectiveWeekday : (effectiveWeekday + 4) % 7;
  const partLords = [];
  for (let i = 0; i < 7; i++) {
    partLords.push((startLord + i) % 7);
  }
  partLords.push(-1);

  const satPartIdx = partLords.indexOf(6);
  const pIdx = satPartIdx !== -1 ? satPartIdx : 2;

  const sHour = (baseHour + pIdx * partDur) % 24;
  const eHour = (baseHour + (pIdx + 1) * partDur) % 24;

  const eH = Math.floor(eHour);
  const eM = Math.floor((eHour % 1) * 60);
  const eS = Math.round((((eHour % 1) * 60) - eM) * 60);

  let mY = Y, mM = M, mD = D;
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
  });

  const mandiLong = mandiHoro.summary?.lagnaDeg360 !== undefined
    ? mandiHoro.summary.lagnaDeg360
    : (mandiHoro.planets?.find(p => p.id === 'lagna')?.longitude || N(sunLon + 130));

  return { mandiLong, sHour, eHour };
}

export function getLagnaSubhar(lagnaRasi) {
  const map = {
    0: 'சூரியன்,செவ்வாய்',
    1: 'சுக்கிரன்,புதன்,சனி',
    2: 'சுக்கிரன்,புதன்',
    3: 'குரு,செவ்வாய்',
    4: 'செவ்வாய்,சூரியன்,குரு',
    5: 'புதன்,சுக்கிரன்',
    6: 'சனி,புதன்',
    7: 'சூரியன்,சந்திரன்,குரு',
    8: 'சூரியன்,செவ்வாய்,குரு',
    9: 'சுக்கிரன்,புதன்,சனி',
    10: 'சுக்கிரன்,சனி',
    11: 'சந்திரன்,செவ்வாய்,குரு'
  };
  return map[lagnaRasi % 12] || 'சூரியன்,சந்திரன்,குரு';
}

export function getLagnaPabar(lagnaRasi) {
  const map = {
    0: 'சுக்கிரன்',
    1: 'குரு,சூரியன்,செவ்வாய்',
    2: 'செவ்வாய்,குரு,சூரியன்',
    3: 'சுக்கிரன்,புதன்',
    4: 'சுக்கிரன்,புதன்',
    5: 'செவ்வாய்,சந்திரன்,குரு',
    6: 'சூரியன்,செவ்வாய்,குரு',
    7: 'செவ்வாய்,புதன்,சுக்கிரன்',
    8: 'சுக்கிரன்',
    9: 'செவ்வாய்,குரு,சூரியன்',
    10: 'குரு,சூரியன்,செவ்வாய்',
    11: 'சனி,புதன்,சுக்கிரன்,சூரியன்'
  };
  return map[lagnaRasi % 12] || 'செவ்வாய்,புதன்,சுக்கிரன்';
}

export function getTithiSoonyaRashis(tithiNum) {
  const map = {
    1: 'துலாம் மகரம்',
    2: 'தனுசு மீனம்',
    3: 'சிம்மம் மகரம்',
    4: 'ரிஷபம் கும்பம்',
    5: 'மிதுனம் கன்னி',
    6: 'மேஷம் சிம்மம்',
    7: 'தனுசு கடகம்',
    8: 'மிதுனம் கன்னி',
    9: 'சிம்மம் விருச்சிகம்',
    10: 'சிம்மம் விருச்சிகம்',
    11: 'தனுசு மீனம்',
    12: 'துலாம் மகரம்',
    13: 'ரிஷபம் சிம்மம்',
    14: 'மிதுனம் கன்னி தனுசு மீனம்',
    15: 'சூன்யம் இல்லை',
    16: 'துலாம் மகரம்',
    17: 'தனுசு மீனம்',
    18: 'சிம்மம் மகரம்',
    19: 'ரிஷபம் கும்பம்',
    20: 'மிதுனம் கன்னி',
    21: 'மேஷம் சிம்மம்',
    22: 'தனுசு கடகம்',
    23: 'மிதுனம் கன்னி',
    24: 'சிம்மம் விருச்சிகம்',
    25: 'சிம்மம் விருச்சிகம்',
    26: 'தனுசு மீனம்',
    27: 'துலாம் மகரம்',
    28: 'ரிஷபம் சிம்மம்',
    29: 'மிதுனம் கன்னி தனுசு மீனம்',
    30: 'சூன்யம் இல்லை'
  };
  return map[tithiNum] || 'மிதுனம் கன்னி';
}
'''

# Insert right before calculateThirukanithaHoroscope
idx = content.find('export function calculateThirukanithaHoroscope')
if idx != -1:
    content = content[:idx] + helpers_code + '\n' + content[idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Inserted helper functions before calculateThirukanithaHoroscope!')
else:
    print('Error: calculateThirukanithaHoroscope not found!')
