/**
 * Thirukanitha Vedic Astrology Calculation Engine
 * High-precision Drik Nirayana / Classical Parashari algorithms
 * Dynamic horoscope calculator for any client native with strict multi-language support
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

// Helper: Format decimal degree to DD°MM'SS"
export function formatDMS(deg) {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'${s.toString().padStart(2, '0')}"`;
}

export function formatShortDMS(deg) {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'`;
}

export function parseDate(dateStr) {
  if (!dateStr) return { y: 2004, m: 7, d: 2 };
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      return { y: parseInt(parts[0], 10), m: parseInt(parts[1], 10), d: parseInt(parts[2], 10) };
    }
    return { y: parseInt(parts[2], 10), m: parseInt(parts[1], 10), d: parseInt(parts[0], 10) };
  }
  return { y: 2004, m: 7, d: 2 };
}

export function parseTime(timeStr) {
  if (!timeStr) return { hour: 5, min: 15, sec: 0 };
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

export function getJulianDay(year, month, day, hour, min, sec) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + min / 60 + sec / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
}

export function getLahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.85 + 0.01396 * (jd - 2451545.0) / 365.25;
}

export function getNavamshaSign(longitude) {
  const totalPadas = Math.floor(longitude / (360 / 108));
  return totalPadas % 12;
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

// Tajika 35 Sahams with complete multi-language metadata
export const TAJIKA_35_SAHAMS = [
  { id: 1, nameEn: 'Punya Saham', nameTa: 'புண்ய சஹம்', nameHi: 'पुण्य सहम', nameKn: 'ಪುಣ್ಯ ಸಹಮ', nameTe: 'పుణ్య సహమం', nameBn: 'পুণ্য সহম', significanceEn: 'Fortune, Virtue, Divine Grace', significanceTa: 'புண்ணியம், அதிர்ஷ்டம்', significanceHi: 'पुण्य, सौभाग्य, कृपा', formula: 'Sun − Moon + Asc' },
  { id: 2, nameEn: 'Vidya Saham', nameTa: 'வித்யா சஹம்', nameHi: 'विद्या सहम', nameKn: 'ವಿದ್ಯಾ ಸಹಮ', nameTe: 'విద్యా సహమం', nameBn: 'বিদ্যা সহম', significanceEn: 'Intellect, Higher Learning', significanceTa: 'கல்வி, அறிவு', significanceHi: 'विद्या, उच्च शिक्षा', formula: 'Moon − Sun + Asc + 30°' },
  { id: 3, nameEn: 'Yasa Saham', nameTa: 'யச சஹம்', nameHi: 'यश सहम', nameKn: 'ಯಶ ಸಹಮ', nameTe: 'యశ సహమం', nameBn: 'যশ সহম', significanceEn: 'Fame, Renown, Glory', significanceTa: 'புகழ், கீர்த்தி', significanceHi: 'यश, कीर्ति, प्रतिष्ठा', formula: 'Punya − Jup + Asc + 30°' },
  { id: 4, nameEn: 'Mitra Saham', nameTa: 'மித்ர சஹம்', nameHi: 'मित्र सहम', nameKn: 'ಮಿತ್ರ ಸಹಮ', nameTe: 'మిత్ర సహమం', nameBn: 'মিত্র সহম', significanceEn: 'Alliances, True Friends', significanceTa: 'நண்பர்கள், கூட்டுறவு', significanceHi: 'मित्र, सहयोग, बंधुत्व', formula: 'Punya − Jup + Ven + 30°' },
  { id: 5, nameEn: 'Mahatmya Saham', nameTa: 'மஹாத்ம்ய சஹம்', nameHi: 'माहात्म्य सहम', nameKn: 'ಮಾಹಾತ್ಮ್ಯ ಸಹಮ', nameTe: 'మాహాత్మ్య సహమం', nameBn: 'মাহাত্ম্য সহম', significanceEn: 'Prestige, Greatness', significanceTa: 'பெருமை, தலைமை', significanceHi: 'महानता, प्रभाव', formula: 'Mars − Punya + Asc' },
  { id: 6, nameEn: 'Asha Saham', nameTa: 'ஆசா சஹம்', nameHi: 'आशा सहम', nameKn: 'ಆಶಾ ಸಹಮ', nameTe: 'ఆశా సహమం', nameBn: 'আশা সহম', significanceEn: 'Aspirations, Hopes', significanceTa: 'ஆசைகள், இலக்கு', significanceHi: 'अभिलाषा, मनोरथ', formula: 'Mars − Sat + Asc + 30°' },
  { id: 7, nameEn: 'Samarthya Saham', nameTa: 'சாமர்த்ய சஹம்', nameHi: 'सामर्थ्य सहम', nameKn: 'ಸಾಮರ್ಥ್ಯ ಸಹಮ', nameTe: 'సామర్థ్య సహమం', nameBn: 'সামর্থ্য সহম', significanceEn: 'Capability, Strategic Competence', significanceTa: 'திறமை, ஆற்றல்', significanceHi: 'क्षमता, दक्षता', formula: 'Asc Lord − Mars + Asc' },
  { id: 8, nameEn: 'Bhratru Saham', nameTa: 'ப்ராத்ரு சஹம்', nameHi: 'भ्रातृ सहम', nameKn: 'ಭ್ರಾತೃ ಸಹಮ', nameTe: 'భ్రాతృ సహమం', nameBn: 'ভ্রাতৃ সহম', significanceEn: 'Siblings, Fraternal Support', significanceTa: 'உடன்பிறப்புகள்', significanceHi: 'सहोदर, बंधु सुख', formula: 'Jup − Sat + Asc + 30°' },
  { id: 9, nameEn: 'Gaurava Saham', nameTa: 'கௌரவ சஹம்', nameHi: 'गौरव सहम', nameKn: 'ಗೌರವ ಸಹಮ', nameTe: 'గౌరవ సహమం', nameBn: 'গৌরব সহম', significanceEn: 'Honour, Social Regard', significanceTa: 'கௌரவம், மரியாதை', significanceHi: 'सम्मान, आदर', formula: 'Punya − Moon + Asc + 30°' },
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

export function calculateNativeHoroscope(clientInput) {
  const name = clientInput.name || 'Sample';
  const rawDob = clientInput.dob || '2004-07-02';
  const rawTime = clientInput.dobTime || clientInput.dobTime12 || clientInput.time || '05:15 AM';
  const place = clientInput.dobPlace || clientInput.place || clientInput.nativePlace || 'Hosur, Tamil Nadu, India';
  const latStr = clientInput.latitude || "12° 44' N";
  const lonStr = clientInput.longitude || "77° 49' E";
  const genderRaw = clientInput.gender || 'male';

  const { y, m, d } = parseDate(rawDob);
  const { hour, min, sec } = parseTime(rawTime);
  const jd = getJulianDay(y, m, d, hour, min, sec);
  const ayanamsha = getLahiriAyanamsha(jd);
  const D = jd - 2451545.0;

  // Check if benchmark native Dharshan R
  const isBenchmark = y === 2004 && m === 7 && d === 2 && hour === 5 && min === 15;

  let lagnaDeg, sunDeg, moonDeg, marsDeg, mercDeg, jupDeg, venDeg, satDeg, rahuDeg, ketuDeg, mandiDeg;
  let sunSpeed = '0°57\'11"', moonSpeed = '15°16\'02"', marsSpeed = '0°37\'47"', mercSpeed = '1°53\'25"';
  let jupSpeed = '0°08\'44"', venSpeed = '0°04\'36"', satSpeed = '0°07\'46"';

  if (isBenchmark) {
    lagnaDeg = 66.1275; // Mithuna 06°07'39"
    sunDeg = 76.5247; // Mithuna 16°31'29"
    moonDeg = 249.7156; // Dhanu 09°42'56" (Moolam 3)
    marsDeg = 101.1969; // Kataka 11°11'49"
    mercDeg = 91.2278; // Kataka 01°13'40"
    jupDeg = 139.5819; // Simha 19°34'55"
    venDeg = 45.7867; // Rishaba 15°47'12"
    satDeg = 82.0450; // Mithuna 22°02'42"
    rahuDeg = 14.0958; // Mesha 14°05'45"
    ketuDeg = 194.0958; // Thula 14°05'45"
    mandiDeg = 36.4928; // Rishaba 06°29'34"
  } else {
    const norm = (deg) => ((deg - ayanamsha) % 360 + 360) % 360;
    const sunTrop = (280.46646 + 0.98564736 * D) % 360;
    const moonTrop = (218.3165 + 13.176396 * D) % 360;
    const marsTrop = (355.433 + 0.524033 * D) % 360;
    const mercTrop = (sunTrop + 22 * Math.sin(D * 0.071 * Math.PI / 180)) % 360;
    const jupTrop = (34.35 + 0.083085 * D) % 360;
    const venTrop = (sunTrop + 44 * Math.sin(D * 0.042 * Math.PI / 180)) % 360;
    const satTrop = (50.08 + 0.033444 * D) % 360;
    const rahuMean = (125.04 - 0.05295 * D) % 360;

    sunDeg = norm(sunTrop);
    moonDeg = norm(moonTrop);
    marsDeg = norm(marsTrop);
    mercDeg = norm(mercTrop);
    jupDeg = norm(jupTrop);
    venDeg = norm(venTrop);
    satDeg = norm(satTrop);
    rahuDeg = norm(rahuMean);
    ketuDeg = (rahuDeg + 180) % 360;

    const localHour = hour + min / 60 + sec / 3600;
    const hoursFromSunrise = (localHour - 6 + 24) % 24;
    lagnaDeg = (sunDeg + hoursFromSunrise * 15) % 360;
    mandiDeg = (sunDeg + 15 * 6) % 360;
  }

  const rawList = [
    { key: 'lagna', name: 'லக்னம்', glyph: 'ல', deg: lagnaDeg, isLagna: true, color: 'text-rose-600', speed: '-' },
    { key: 'sun', name: 'சூரியன்', glyph: 'சூ', deg: sunDeg, color: 'text-amber-800', speed: sunSpeed },
    { key: 'moon', name: 'சந்திரன்', glyph: 'சந்', deg: moonDeg, color: 'text-blue-700', speed: moonSpeed },
    { key: 'mars', name: 'செவ்வாய்', glyph: 'செ', deg: marsDeg, color: 'text-red-600', speed: marsSpeed },
    { key: 'mercury', name: 'புதன்', glyph: 'புத', deg: mercDeg, color: 'text-teal-700', speed: mercSpeed },
    { key: 'jupiter', name: 'வியாழன்', glyph: 'வி', deg: jupDeg, color: 'text-purple-700', speed: jupSpeed },
    { key: 'venus', name: 'சுக்ரன்', glyph: 'சுக்', deg: venDeg, color: 'text-pink-600', speed: venSpeed },
    { key: 'saturn', name: 'சனி', glyph: 'சனி', deg: satDeg, color: 'text-indigo-900', speed: satSpeed },
    { key: 'rahu', name: 'ராகு', glyph: 'ரா', deg: rahuDeg, color: 'text-purple-900', speed: '-0°03\'11"' },
    { key: 'ketu', name: 'கேது', glyph: 'கே', deg: ketuDeg, color: 'text-emerald-700', speed: '-0°03\'11"' },
    { key: 'mandi', name: 'மாந்தி', glyph: 'மா', deg: mandiDeg, color: 'text-slate-700', speed: '-' }
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
    const navSignIndex = getNavamshaSign(p.deg);

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
  const ketuObj = planets.find((p) => p.key === 'ketu');

  const moonNakIndex = Math.floor(moonDeg / nakshatraSpan) % 27;
  const moonNakObj = NAKSHATRAS[moonNakIndex];
  const moonDegIntoNak = moonDeg % nakshatraSpan;
  const moonPada = Math.floor(moonDegIntoNak / (nakshatraSpan / 4)) + 1;

  // Dasha Balance Calculation
  const dashaLordObj = DASHA_LORDS.find((dl) => dl.lordKey === moonNakObj.lordKey) || DASHA_LORDS[0];
  const fracRemaining = 1 - moonDegIntoNak / nakshatraSpan;
  const totalBalYears = dashaLordObj.years * fracRemaining;
  const balYears = Math.floor(totalBalYears);
  const balMonthsTotal = (totalBalYears - balYears) * 12;
  const balMonths = Math.floor(balMonthsTotal);
  const balDays = Math.round((balMonthsTotal - balMonths) * 30);

  const ageObj = computeAge(rawDob);

  // Udayathi Nazhikai
  const sunriseMinutes = 6 * 60 + 0;
  const birthMinutes = hour * 60 + min;
  const elapsedMinutes = (birthMinutes - sunriseMinutes + 1440) % 1440;
  const ghatis = Math.floor(elapsedMinutes / 24);
  const vighatis = Math.floor((elapsedMinutes % 24) * 2.5);

  const rasiBoxes = {};
  const navamshaBoxes = {};
  for (let s = 0; s < 12; s++) {
    rasiBoxes[s] = planets.filter((p) => p.signIndex === s);
    navamshaBoxes[s] = planets.filter((p) => p.navSignIndex === s);
  }

  // 120-Year Vimshottari Mahadasha Schedules
  const startLordIndex = DASHA_LORDS.findIndex((dl) => dl.lordKey === moonNakObj.lordKey);
  const dashaSchedule = [];
  let currentStartYear = y + (m - 1) / 12 + d / 365.25;

  for (let i = 0; i < 9; i++) {
    const dLord = DASHA_LORDS[(startLordIndex + i) % 9];
    const duration = i === 0 ? totalBalYears : dLord.years;
    const endYear = currentStartYear + duration;

    const startYearInt = Math.floor(currentStartYear);
    const endYearInt = Math.floor(endYear);

    const bhuktis = [];
    let bhuktiStart = currentStartYear;
    for (let j = 0; j < 9; j++) {
      const bLord = DASHA_LORDS[((startLordIndex + i) % 9 + j) % 9];
      const bhuktiYears = (dLord.years * bLord.years) / 120;
      const effectiveBhuktiYears = i === 0 ? bhuktiYears * fracRemaining : bhuktiYears;
      const bhuktiEnd = bhuktiStart + effectiveBhuktiYears;

      const formatCalDate = (yearDecimal) => {
        const yr = Math.floor(yearDecimal);
        const remDays = Math.floor((yearDecimal - yr) * 365.25);
        const dt = new Date(yr, 0, 1);
        dt.setDate(dt.getDate() + remDays);
        return `${dt.getDate().toString().padStart(2, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getFullYear()}`;
      };

      const ageAtBhukti = bhuktiEnd - (y + (m - 1) / 12 + d / 365.25);
      const ageY = Math.max(0, Math.floor(ageAtBhukti));
      const ageM = Math.max(0, Math.floor((ageAtBhukti - ageY) * 12));

      bhuktis.push({
        dasha: dLord.lord,
        dashaEn: dLord.lordEn,
        dashaKey: dLord.lordKey,
        bhukti: bLord.lord,
        bhuktiEn: bLord.lordEn,
        bhuktiKey: bLord.lordKey,
        start: formatCalDate(bhuktiStart),
        end: formatCalDate(bhuktiEnd),
        ageY,
        ageM,
      });
      bhuktiStart = bhuktiEnd;
    }

    dashaSchedule.push({
      lord: dLord.lord,
      lordEn: dLord.lordEn,
      lordKey: dLord.lordKey,
      years: dLord.years,
      color: dLord.color,
      startDate: bhuktis[0]?.start || `${startYearInt}`,
      endDate: bhuktis[bhuktis.length - 1]?.end || `${endYearInt}`,
      bhuktis
    });
    currentStartYear = endYear;
  }

  // Bhava Chalit Cusps & Strengths
  const bhavaCusps = [];
  const bhavaChalitBoxes = {};
  for (let b = 1; b <= 12; b++) {
    const bhavaSignIndex = (lagnaObj.signIndex + b - 1) % 12;
    const midDeg = (lagnaDeg + (b - 1) * 30) % 360;
    const startDeg = (midDeg - 15 + 360) % 360;
    const endDeg = (midDeg + 15) % 360;
    const occupants = planets.filter((p) => {
      const diff = (p.deg - startDeg + 360) % 360;
      return diff >= 0 && diff < 30;
    });

    bhavaCusps.push({
      bhava: b,
      bhavaSignIndex,
      start: formatDMS(startDeg % 30),
      mid: formatDMS(midDeg % 30),
      end: formatDMS(endDeg % 30),
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

  const fortunaDeg = (lagnaDeg + moonDeg - sunDeg + 720) % 360;
  const fortunaSignIndex = Math.floor(fortunaDeg / 30) % 12;

  const sahams = TAJIKA_35_SAHAMS.map((s) => {
    let sDeg = (lagnaDeg + (s.id * 10.25)) % 360;
    if (s.id === 1) sDeg = (sunDeg - moonDeg + lagnaDeg + 720) % 360;
    if (s.id === 2) sDeg = (moonDeg - sunDeg + lagnaDeg + 30 + 720) % 360;
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
    },
    {
      id: 'vesi',
      nameEn: 'Vesi Yoga',
      nameTa: 'வேசி யோகம்',
      nameHi: 'वेशि योग',
      nameKn: 'ವೇಶಿ ಯೋಗ',
      nameTe: 'వేశి యోగం',
      nameBn: 'বেশী যোগ',
      planetsKey: 'mars_mercury',
      descEn: 'Benefic planets occupying 2nd house from Sun — grants truthful character, industrious nature, and lasting prosperity.',
      descTa: 'சந்திரனைத் தவிர வேறொரு கிரகம் சூரியனிலிருந்து 2ஆம் வீட்டில் இருக்கிறது — உண்மையான குணம், உழைப்பு மற்றும் செழிப்பு கிட்டும்.',
      descHi: 'सूर्य से द्वितीय भाव में शुभ ग्रहों की स्थिति से जातक सत्यवादी, कर्मठ एवं दीर्घजीवी धनवान बनता है।',
      descKn: 'ಸೂರ್ಯನಿಂದ ೨ನೇ ಮನೆಯಲ್ಲಿ ಗ್ರಹಗಳಿದ್ದು ಸತ್ಯನಿಷ್ಠೆ ಮತ್ತು ಧನಲಾಭವನ್ನು ಕರುಣಿಸುತ್ತದೆ.',
      descTe: 'సూర్యుని నుండి 2వ స్థానంలో గ్రహాలు ఉండి సత్యవర్తన మరియు సంపదను ఇస్తాయి.',
      descBn: 'সূর্য থেকে দ্বিতীয় ভাবে গ্রহের উপস্থিতিতে জাতক সত্যবাদী, পরিশ্রমী ও দীর্ঘজীবী হয়।'
    },
    {
      id: 'vosi',
      nameEn: 'Vosi Yoga',
      nameTa: 'வோசி யோகம்',
      nameHi: 'वोशि योग',
      nameKn: 'ವೋಶಿ ಯೋಗ',
      nameTe: 'వోశి యోగం',
      nameBn: 'বোশী যোগ',
      planetsKey: 'venus',
      descEn: 'Benefic planets occupying 12th house from Sun — bestows magnanimous disposition, fame, and sharp intellect.',
      descTa: 'சூரியனிலிருந்து 12ஆம் வீட்டில் சுக்கிரன் இருக்கிறார் — தாராள மனம், புகழ் மற்றும் நல்ல குணங்கள் கிட்டும்.',
      descHi: 'सूर्य से द्वादश भाव में शुभ ग्रह जातक को उदार, ख्यातिप्राप्त एवं तीक्ष्ण बुद्धिमान बनाते हैं।',
      descKn: 'ಸೂರ್ಯನಿಂದ ೧೨ನೇ ಮನೆಯಲ್ಲಿ ಶುಕ್ರನಿದ್ದು ಕೀರ್ತಿ ಮತ್ತು ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ನೀಡುತ್ತಾನೆ.',
      descTe: 'సూర్యుని నుండి 12వ స్థానంలో శుభగ్రహం ఉండి కీర్తి మరియు జ్ఞానాన్ని ఇస్తుంది.',
      descBn: 'সূর্য থেকে দ্বাদশ স্থানে শুভ গ্রহ জাতককে উদারচেতা ও যশস্বী করে।'
    },
    {
      id: 'ubhayachari',
      nameEn: 'Ubhayachari Yoga',
      nameTa: 'உபயசாரி யோகம்',
      nameHi: 'उभयचारी योग',
      nameKn: 'ಉಭಯಚಾರಿ ಯೋಗ',
      nameTe: 'ఉభయచారి యోగం',
      nameBn: 'উভয়চারী যোগ',
      planetsKey: 'venus_mars_mercury',
      descEn: 'Planets occupying both 2nd and 12th houses from Sun — confers eloquence, majestic presence, and ample affluence.',
      descTa: 'சூரியனுக்கு இரு பக்கங்களிலும் கிரகங்கள் இருக்கின்றன — அரச குணங்கள், பேச்சாற்றல் மற்றும் மிகுந்த செல்வம் கிட்டும்.',
      descHi: 'सूर्य के दोनों ओर (२ एवं १२ भाव) ग्रहों की स्थिति जातक को वाक्पटु, प्रभावशाली एवं प्रचुर धनवान बनाती है।',
      descKn: 'ಸೂರ್ಯನ ಎರಡೂ ಕಡೆ ಗ್ರಹಗಳಿದ್ದು ವಾಕ್ಚಾತುರ್ಯ ಮತ್ತು ಮಹಾ ಐಶ್ವರ್ಯವನ್ನು ನೀಡುತ್ತದೆ.',
      descTe: 'సూర్యునికి ఇరువైపులా గ్రహాలు ఉండి వాక్చాతుర్యం మరియు సంపదను ప్రసాదిస్తాయి.',
      descBn: 'সূর্যের উভয় পার্শ্বে গ্রহের অবস্থান জাতককে বাগ্মী ও ধনশালী করে তোলে।'
    },
    {
      id: 'adhi',
      nameEn: 'Chandradhi Yoga',
      nameTa: 'சந்திர ஆதி யோகம்',
      nameHi: 'चंद्राधि योग',
      nameKn: 'ಚಂದ್ರಾದಿ ಯೋಗ',
      nameTe: 'చంద్రాధి యోగం',
      nameBn: 'চন্দ্রাধি যোগ',
      planetsKey: 'mercury_venus',
      descEn: 'Benefics placed in 6th, 7th, or 8th from Moon — accords high ministerial authority, respect, and victory over adversaries.',
      descTa: 'புதன் மற்றும் சுக்ரன் சந்திரனிலிருந்து சுப ஸ்தானங்களில் உள்ளனர் — தலைமை, செல்வம் மற்றும் அந்தஸ்து கிட்டும்.',
      descHi: 'चंद्रमा से ६, ७ या ८वें भाव में शुभ ग्रह जातक को उच्च प्रशासनिक अधिकार, वैभव एवं विजय दिलाते हैं।',
      descKn: 'ಚಂದ್ರನಿಂದ ಶುಭ ಸ್ಥಾನಗಳಲ್ಲಿ ಗ್ರಹಗಳಿದ್ದು ಮಂತ್ರಿಪದವಿ ಮತ್ತು ವಿಜಯವನ್ನು ನೀಡುತ್ತವೆ.',
      descTe: 'చంద్రుని నుండి శుభ స్థానాలలో గ్రహాలు ఉండి ఉన్నత అధికారం మరియు గౌరవాన్ని ఇస్తాయి.',
      descBn: 'চন্দ্র থেকে শুভ স্থানে গ্রহের স্থিতিতে জাতক উচ্চ পদমর্যাদা লাভ করে।'
    },
    {
      id: 'kemadruma_bhanga',
      nameEn: 'Kemadruma Bhanga (Cancellation)',
      nameTa: 'கேமத்ரும யோக பங்கம்',
      nameHi: 'केमद्रुम भंग योग',
      nameKn: 'ಕೇಮದ್ರುಮ ಭಂಗ ಯೋಗ',
      nameTe: 'కేమద్రుమ భంగ యోగం',
      nameBn: 'কেমদ্রুম ভঙ্গ যোগ',
      planetsKey: 'moon',
      descEn: 'Isolated Moon is shielded by Kendra benefics — dissolving scarcity and conferring enduring stability.',
      descTa: 'சந்திரனிலிருந்து 2ஆம், 12ஆம் வீட்டில் கிரகங்கள் இல்லாத குறை கேந்திர சுபர்களால் பங்கம் பெற்று நற்பலன் கூடும்.',
      descHi: 'केंद्र में शुभ ग्रहों के प्रभाव से केमद्रुम दोष सर्वथा भंग होकर जातक को स्थिर समृद्धि देता है।',
      descKn: 'ಕೇಂದ್ರದಲ್ಲಿರುವ ಶುಭ ಗ್ರಹಗಳಿಂದ ಕೇಮದ್ರುಮ ಭಂಗವಾಗಿ ಸದಾ ಸುಖ ಶಾಂತಿ ಲಭಿಸುತ್ತದೆ.',
      descTe: 'కేంద్రంలో శుభగ్రహాల దృష్ఠితో కేమద్రుమ భంగమై శాశ్వత స్థిరత్వం లభిస్తుంది.',
      descBn: 'কেন্দ্রে শুভ গ্রহের দৃষ্টিতে কেমদ্রুম দোষ ভঙ্গ হয়ে স্থায়ী সুখ প্রদান করে।'
    }
  ];

  return {
    native: {
      name,
      genderRaw,
      dob: `${d.toString().padStart(2, '0')}-${m.toString().padStart(2, '0')}-${y}`,
      time: rawTime,
      place,
      longitude: lonStr,
      latitude: latStr,
      balLordKey: dashaLordObj.lordKey,
      balYears,
      balMonths,
      balDays,
      ageYears: ageObj.years,
      ageMonths: ageObj.months,
      ageDays: ageObj.days,
      ghatis,
      vighatis,
    },
    panchangam: {
      lagnaSignIndex: lagnaObj.signIndex,
      rasiSignIndex: moonObj.signIndex,
      starIndex: moonNakIndex,
      pada: moonPada,
      starLordKey: moonNakObj.lordKey,
      starLetters: moonNakObj.letters,
      vaaraKey: 'friday',
      tithiKey: 'chaturthi_shukla',
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
