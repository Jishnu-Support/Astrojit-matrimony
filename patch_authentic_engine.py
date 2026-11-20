import re

path = r'frontend/src/utils/thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

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

export const NAKSHATRA_PORUTHAM_TABLE = [
  { nak: 'அஸ்வினி', gyn: 'தேவம் / ஆண் குதிரை / பார்சுவ', vr: 'எட்டி / பாதம்', pa: 'புள்ளு / அசுவினி தேவர்கள்' },
  { nak: 'பரணி', gyn: 'மானுட / பெண் யானை / மத்திய', vr: 'நெல்லி / தொடை', pa: 'காகம் / எமன்' },
  { nak: 'கார்த்திகை', gyn: 'ராட்சச / பெண் ஆடு / சமான', vr: 'அத்தி / உதர', pa: 'மயில் / அக்னி' },
  { nak: 'ரோகிணி', gyn: 'மானுட / ஆண் நாகம் / பார்சுவ', vr: 'நாவல் / கண்ட', pa: 'ஆண்டலை / பிரம்மன்' },
  { nak: 'மிருகசீரிஷம்', gyn: 'தேவம் / பெண் சாரை / மத்திய', vr: 'கருங்காலி / சிரசு', pa: 'கோழி / சந்திரன்' },
  { nak: 'திருவாதிரை', gyn: 'மானுட / ஆண் நாய் / பார்சுவ', vr: 'செங்காலி / கண்ட', pa: 'சிட்டுக்குருவி / ருத்திரன்' },
  { nak: 'புனர்பூசம்', gyn: 'தேவம் / பெண் பூனை / சமான', vr: 'மூங்கில் / உதர', pa: 'அன்னம் / அதிதி' },
  { nak: 'பூசம்', gyn: 'தேவம் / ஆண் ஆடு / மத்திய', vr: 'அரசு / தொடை', pa: 'நீர்க்காகம் / குரு' },
  { nak: 'ஆயில்யம்', gyn: 'ராட்சச / ஆண் பூனை / பார்சுவ', vr: 'புன்னை / பாதம்', pa: 'செம்போத்து / ஆதிசேஷன்' },
  { nak: 'மகம்', gyn: 'ராட்சச / ஆண் எலி / சமான', vr: 'ஆலமரம் / பாதம்', pa: 'ஆண்கழுகு / பித்துருக்கள்' },
  { nak: 'பூரம்', gyn: 'மானுட / பெண் எலி / மத்திய', vr: 'பலாசு / தொடை', pa: 'பெண் கழுகு / பகன்' },
  { nak: 'உத்திரம்', gyn: 'மானுட / எருது / பார்சுவ', vr: 'அலரி / உதர', pa: 'கழுகு / பகன்' },
  { nak: 'ஹஸ்தம்', gyn: 'தேவம் / பெண் எருமை / சமான', vr: 'ஆத்தி / கண்ட', pa: 'பருந்து / சாவித்திரி' },
  { nak: 'சித்திரை', gyn: 'ராட்சச / பெண் புலி / மத்திய', vr: 'வில்வம் / சிரசு', pa: 'மரங்கொத்தி / விஸ்வகர்மா' },
  { nak: 'சுவாதி', gyn: 'தேவம் / ஆண் எருமை / பார்சுவ', vr: 'மருதம் / கண்ட', pa: 'புறா / வாயு' },
  { nak: 'விசாகம்', gyn: 'ராட்சச / பெண் புலி / சமான', vr: 'விளா / உதர', pa: 'செங்காகம் / இந்திராக்னி' },
  { nak: 'அனுஷம்', gyn: 'தேவம் / பெண் மான் / மத்திய', vr: 'மகிழம் / தொடை', pa: 'வானம்பாடி / மித்திரன்' },
  { nak: 'கேட்டை', gyn: 'ராட்சச / ஆண் மான் / பார்சுவ', vr: 'பராய் / பாதம்', pa: 'சக்ரவாகம் / இந்திரன்' },
  { nak: 'மூலம்', gyn: 'ராட்சச / பெண் நாய் / சமான', vr: 'மரா / பாதம்', pa: 'செம்பருந்து / நிருதி' },
  { nak: 'பூராடம்', gyn: 'மானுட / ஆண் குரங்கு / மத்திய', vr: 'வஞ்சி / தொடை', pa: 'கௌதாரி / வருணன்' },
  { nak: 'உத்திராடம்', gyn: 'மானுட / பெண் கீரி / பார்சுவ', vr: 'பலா / உதர', pa: 'வலியன் / விஸ்வேதேவர்கள்' },
  { nak: 'திருவோணம்', gyn: 'தேவம் / பெண் குரங்கு / சமான', vr: 'எருக்கு / கண்ட', pa: 'நாரை / விஷ்ணு' },
  { nak: 'அவிட்டம்', gyn: 'ராட்சச / பெண் சிங்கம் / மத்திய', vr: 'வன்னி / சிரசு', pa: 'வண்டானம் / அஷ்ட வசுக்கள்' },
  { nak: 'சதயம்', gyn: 'ராட்சச / பெண் குதிரை / பார்சுவ', vr: 'கடம்பு / கண்ட', pa: 'அண்டரண்டா / வருணன்' },
  { nak: 'பூரட்டாதி', gyn: 'மானுட / ஆண் சிங்கம் / சமான', vr: 'தேமா / உதர', pa: 'உள்ளான் / அஜைகபாதன்' },
  { nak: 'உத்திரட்டாதி', gyn: 'மானுட / பெண் பசு / மத்திய', vr: 'வேம்பு / தொடை', pa: 'கொக்கு / அகிர்புத்னியன்' },
  { nak: 'ரேவதி', gyn: 'தேவம் / பெண் யானை / பார்சுவ', vr: 'இலுப்பை / பாதம்', pa: 'வல்லூறு / பூஷா' }
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

  const mandiLong = mandiHoro?.summary?.lagnaDeg360 !== undefined
    ? mandiHoro.summary.lagnaDeg360
    : (mandiHoro?.planets?.find(pl => pl.id === 'lagna')?.longitude || 0);

  return mandiLong;
}

export function getLagnaSubhar(lagnaRasiIdx) {
  const map = {
    0: 'சூரியன்,சந்திரன்,குரு',
    1: 'புதன்,சுக்கிரன்,சனி',
    2: 'புதன்,சுக்கிரன்',
    3: 'சந்திரன்,செவ்வாய்,குரு',
    4: 'சூரியன்,செவ்வாய்,குரு',
    5: 'புதன்,சுக்கிரன்',
    6: 'புதன்,சுக்கிரன்,சனி',
    7: 'சூரியன்,சந்திரன்,குரு',
    8: 'சூரியன்,செவ்வாய்',
    9: 'புதன்,சுக்கிரன்,சனி',
    10: 'சுக்கிரன்,சனி',
    11: 'சந்திரன்,செவ்வாய்,குரு'
  };
  return map[lagnaRasiIdx] || 'சூரியன்,சந்திரன்,குரு';
}

export function getLagnaPabar(lagnaRasiIdx) {
  const map = {
    0: 'புதன்,சுக்கிரன்,சனி',
    1: 'சூரியன்,சந்திரன்,குரு',
    2: 'செவ்வாய்,குரு',
    3: 'புதன்,சுக்கிரன்,சனி',
    4: 'புதன்,சுக்கிரன்',
    5: 'செவ்வாய்,சந்திரன்',
    6: 'சூரியன்,செவ்வாய்,குரு',
    7: 'செவ்வாய்,புதன்,சுக்கிரன்',
    8: 'சுக்கிரன்',
    9: 'சூரியன்,செவ்வாய்,குரு',
    10: 'சூரியன்,செவ்வாய்,குரு',
    11: 'புதன்,சுக்கிரன்,சனி'
  };
  return map[lagnaRasiIdx] || 'செவ்வாய்,புதன்,சுக்கிரன்';
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
    30: 'சூன்யம் இல்லை'
  };
  return map[tithiNum] || 'மிதுனம் கன்னி';
}
'''

if 'function computeTopocentricSunRiseSet' not in code:
    idx = code.find('export function calculateThirukanithaHoroscope')
    if idx != -1:
        code = code[:idx] + helpers_code + '\n' + code[idx:]
        print('Inserted helper functions before calculateThirukanithaHoroscope!')
    else:
        print('Could not find calculateThirukanithaHoroscope!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated successfully!')
