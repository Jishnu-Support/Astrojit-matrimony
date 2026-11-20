/**
 * Astrojit Matrimony & Daily Panchangam Engine
 * Contains Nakshatra reference tables, 10 Tamil Poruthams, 36 Gunas Ashtakoota,
 * and Daily Panchangam. All horoscope calculation modules have been removed.
 */

// 27 Nakshatras with ruling planets and deities
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', sign: 'Aries', varna: 'Kshatriya', yoni: 'Horse', gana: 'Deva', nadi: 'Adi' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', sign: 'Aries', varna: 'Kshatriya', yoni: 'Elephant', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', sign: 'Aries/Taurus', varna: 'Brahmin', yoni: 'Sheep', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma', sign: 'Taurus', varna: 'Shudra', yoni: 'Serpent', gana: 'Manushya', nadi: 'Antya' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', sign: 'Taurus/Gemini', varna: 'Vaishya', yoni: 'Serpent', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', sign: 'Gemini', varna: 'Shudra', yoni: 'Dog', gana: 'Manushya', nadi: 'Adi' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', sign: 'Gemini/Cancer', varna: 'Vaishya', yoni: 'Cat', gana: 'Deva', nadi: 'Adi' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', sign: 'Cancer', varna: 'Kshatriya', yoni: 'Sheep', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpa', sign: 'Cancer', varna: 'Shudra', yoni: 'Cat', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris', sign: 'Leo', varna: 'Shudra', yoni: 'Rat', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', sign: 'Leo', varna: 'Brahmin', yoni: 'Rat', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', sign: 'Leo/Virgo', varna: 'Kshatriya', yoni: 'Cow', gana: 'Manushya', nadi: 'Adi' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr', sign: 'Virgo', varna: 'Vaishya', yoni: 'Buffalo', gana: 'Deva', nadi: 'Adi' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtar', sign: 'Virgo/Libra', varna: 'Shudra', yoni: 'Tiger', gana: 'Rakshasa', nadi: 'Madhya' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', sign: 'Libra', varna: 'Shudra', yoni: 'Buffalo', gana: 'Deva', nadi: 'Antya' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', sign: 'Libra/Scorpio', varna: 'Brahmin', yoni: 'Tiger', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', sign: 'Scorpio', varna: 'Kshatriya', yoni: 'Deer', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', sign: 'Scorpio', varna: 'Vaishya', yoni: 'Deer', gana: 'Rakshasa', nadi: 'Adi' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', sign: 'Sagittarius', varna: 'Shudra', yoni: 'Dog', gana: 'Rakshasa', nadi: 'Adi' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', sign: 'Sagittarius', varna: 'Brahmin', yoni: 'Monkey', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas', sign: 'Sagittarius/Capricorn', varna: 'Kshatriya', yoni: 'Mongoose', gana: 'Manushya', nadi: 'Antya' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', sign: 'Capricorn', varna: 'Vaishya', yoni: 'Monkey', gana: 'Deva', nadi: 'Antya' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', sign: 'Capricorn/Aquarius', varna: 'Shudra', yoni: 'Lion', gana: 'Rakshasa', nadi: 'Madhya' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', sign: 'Aquarius', varna: 'Shudra', yoni: 'Horse', gana: 'Rakshasa', nadi: 'Adi' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', sign: 'Aquarius/Pisces', varna: 'Brahmin', yoni: 'Lion', gana: 'Manushya', nadi: 'Adi' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya', sign: 'Pisces', varna: 'Kshatriya', yoni: 'Cow', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', sign: 'Pisces', varna: 'Shudra', yoni: 'Elephant', gana: 'Deva', nadi: 'Antya' },
];

const TAMIL_STARS = [
  { index: 0, name: 'Ashwini', tamil: 'அசுவினி', lord: 'Ketu', rashi: 'Mesha', gana: 'Deva', yoni: 'Horse', yoniSex: 'Male', rajju: 'Paadha', vedha: 'Jyeshtha' },
  { index: 1, name: 'Bharani', tamil: 'பரணி', lord: 'Venus', rashi: 'Mesha', gana: 'Manushya', yoni: 'Elephant', yoniSex: 'Male', rajju: 'Thodai', vedha: 'Anuradha' },
  { index: 2, name: 'Krittika', tamil: 'கார்த்திகை', lord: 'Sun', rashi: 'Mesha/Vrishabha', gana: 'Rakshasa', yoni: 'Sheep', yoniSex: 'Female', rajju: 'Naabhi', vedha: 'Vishakha' },
  { index: 3, name: 'Rohini', tamil: 'ரோகிணி', lord: 'Moon', rashi: 'Vrishabha', gana: 'Manushya', yoni: 'Serpent', yoniSex: 'Male', rajju: 'Kanda', vedha: 'Swati' },
  { index: 4, name: 'Mrigashira', tamil: 'மிருகசீரிடம்', lord: 'Mars', rashi: 'Vrishabha/Mithuna', gana: 'Deva', yoni: 'Serpent', yoniSex: 'Female', rajju: 'Sirasu', vedha: 'Chitra' },
  { index: 5, name: 'Ardra', tamil: 'திருவாதிரை', lord: 'Rahu', rashi: 'Mithuna', gana: 'Manushya', yoni: 'Dog', yoniSex: 'Female', rajju: 'Kanda', vedha: 'Shravana' },
  { index: 6, name: 'Punarvasu', tamil: 'புனர்பூசம்', lord: 'Jupiter', rashi: 'Mithuna/Karka', gana: 'Deva', yoni: 'Cat', yoniSex: 'Female', rajju: 'Naabhi', vedha: 'Uttara Ashadha' },
  { index: 7, name: 'Pushya', tamil: 'பூசம்', lord: 'Saturn', rashi: 'Karka', gana: 'Deva', yoni: 'Sheep', yoniSex: 'Male', rajju: 'Thodai', vedha: 'Purva Ashadha' },
  { index: 8, name: 'Ashlesha', tamil: 'ஆயில்யம்', lord: 'Mercury', rashi: 'Karka', gana: 'Rakshasa', yoni: 'Cat', yoniSex: 'Male', rajju: 'Paadha', vedha: 'Mula' },
  { index: 9, name: 'Magha', tamil: 'மகம்', lord: 'Ketu', rashi: 'Simha', gana: 'Rakshasa', yoni: 'Rat', yoniSex: 'Male', rajju: 'Paadha', vedha: 'Revati' },
  { index: 10, name: 'Purva Phalguni', tamil: 'பூரம்', lord: 'Venus', rashi: 'Simha', gana: 'Manushya', yoni: 'Rat', yoniSex: 'Female', rajju: 'Thodai', vedha: 'Uttara Bhadrapada' },
  { index: 11, name: 'Uttara Phalguni', tamil: 'உத்திரம்', lord: 'Sun', rashi: 'Simha/Kanya', gana: 'Manushya', yoni: 'Cow', yoniSex: 'Male', rajju: 'Naabhi', vedha: 'Purva Bhadrapada' },
  { index: 12, name: 'Hasta', tamil: 'அஸ்தம்', lord: 'Moon', rashi: 'Kanya', gana: 'Deva', yoni: 'Buffalo', yoniSex: 'Female', rajju: 'Kanda', vedha: 'Shatabhisha' },
  { index: 13, name: 'Chitra', tamil: 'சித்திரை', lord: 'Mars', rashi: 'Kanya/Tula', gana: 'Rakshasa', yoni: 'Tiger', yoniSex: 'Female', rajju: 'Sirasu', vedha: 'Mrigashira' },
  { index: 14, name: 'Swati', tamil: 'சுவாதி', lord: 'Rahu', rashi: 'Tula', gana: 'Deva', yoni: 'Buffalo', yoniSex: 'Male', rajju: 'Kanda', vedha: 'Rohini' },
  { index: 15, name: 'Vishakha', tamil: 'விசாகம்', lord: 'Jupiter', rashi: 'Tula/Vrishchika', gana: 'Rakshasa', yoni: 'Tiger', yoniSex: 'Male', rajju: 'Naabhi', vedha: 'Krittika' },
  { index: 16, name: 'Anuradha', tamil: 'அனுஷம்', lord: 'Saturn', rashi: 'Vrishchika', gana: 'Deva', yoni: 'Deer', yoniSex: 'Female', rajju: 'Thodai', vedha: 'Bharani' },
  { index: 17, name: 'Jyeshtha', tamil: 'கேட்டை', lord: 'Mercury', rashi: 'Vrishchika', gana: 'Rakshasa', yoni: 'Deer', yoniSex: 'Male', rajju: 'Paadha', vedha: 'Ashwini' },
  { index: 18, name: 'Mula', tamil: 'மூலம்', lord: 'Ketu', rashi: 'Dhanu', gana: 'Rakshasa', yoni: 'Dog', yoniSex: 'Male', rajju: 'Paadha', vedha: 'Ashlesha' },
  { index: 19, name: 'Purva Ashadha', tamil: 'பூராடம்', lord: 'Venus', rashi: 'Dhanu', gana: 'Manushya', yoni: 'Monkey', yoniSex: 'Male', rajju: 'Thodai', vedha: 'Pushya' },
  { index: 20, name: 'Uttara Ashadha', tamil: 'உத்திராடம்', lord: 'Sun', rashi: 'Dhanu/Makara', gana: 'Manushya', yoni: 'Mongoose', yoniSex: 'Male', rajju: 'Naabhi', vedha: 'Punarvasu' },
  { index: 21, name: 'Shravana', tamil: 'திருவோணம்', lord: 'Moon', rashi: 'Makara', gana: 'Deva', yoni: 'Monkey', yoniSex: 'Female', rajju: 'Kanda', vedha: 'Ardra' },
  { index: 22, name: 'Dhanishta', tamil: 'அவிட்டம்', lord: 'Mars', rashi: 'Makara/Kumbha', gana: 'Rakshasa', yoni: 'Lion', yoniSex: 'Female', rajju: 'Sirasu', vedha: 'Chitra' },
  { index: 23, name: 'Shatabhisha', tamil: 'சதயம்', lord: 'Rahu', rashi: 'Kumbha', gana: 'Rakshasa', yoni: 'Horse', yoniSex: 'Female', rajju: 'Kanda', vedha: 'Hasta' },
  { index: 24, name: 'Purva Bhadrapada', tamil: 'பூரட்டாதி', lord: 'Jupiter', rashi: 'Kumbha/Meena', gana: 'Manushya', yoni: 'Lion', yoniSex: 'Male', rajju: 'Naabhi', vedha: 'Uttara Phalguni' },
  { index: 25, name: 'Uttara Bhadrapada', tamil: 'உத்திரட்டாதி', lord: 'Saturn', rashi: 'Meena', gana: 'Manushya', yoni: 'Cow', yoniSex: 'Female', rajju: 'Thodai', vedha: 'Purva Phalguni' },
  { index: 26, name: 'Revati', tamil: 'ரேவதி', lord: 'Mercury', rashi: 'Meena', gana: 'Deva', yoni: 'Elephant', yoniSex: 'Female', rajju: 'Paadha', vedha: 'Magha' },
];

const RASHIS = [
  { index: 0, name: 'Aries', tamil: 'மேஷம்', lord: 'Mars' },
  { index: 1, name: 'Taurus', tamil: 'ரிஷபம்', lord: 'Venus' },
  { index: 2, name: 'Gemini', tamil: 'மிதுனம்', lord: 'Mercury' },
  { index: 3, name: 'Cancer', tamil: 'கடகம்', lord: 'Moon' },
  { index: 4, name: 'Leo', tamil: 'சிம்மம்', lord: 'Sun' },
  { index: 5, name: 'Virgo', tamil: 'கன்னி', lord: 'Mercury' },
  { index: 6, name: 'Libra', tamil: 'துலாம்', lord: 'Venus' },
  { index: 7, name: 'Scorpio', tamil: 'விருச்சிகம்', lord: 'Mars' },
  { index: 8, name: 'Sagittarius', tamil: 'தனுசு', lord: 'Jupiter' },
  { index: 9, name: 'Capricorn', tamil: 'மகரம்', lord: 'Saturn' },
  { index: 10, name: 'Aquarius', tamil: 'கும்பம்', lord: 'Saturn' },
  { index: 11, name: 'Pisces', tamil: 'மீனம்', lord: 'Jupiter' },
];

const TITHIS = [
  'Prathama (Shukla)', 'Dwitiya (Shukla)', 'Tritiya (Shukla)', 'Chaturthi (Shukla)', 'Panchami (Shukla)',
  'Shashthi (Shukla)', 'Saptami (Shukla)', 'Ashtami (Shukla)', 'Navami (Shukla)', 'Dashami (Shukla)',
  'Ekadashi (Shukla)', 'Dwadashi (Shukla)', 'Trayodashi (Shukla)', 'Chaturdashi (Shukla)', 'Purnima (Full Moon)',
  'Prathama (Krishna)', 'Dwitiya (Krishna)', 'Tritiya (Krishna)', 'Chaturthi (Krishna)', 'Panchami (Krishna)',
  'Shashthi (Krishna)', 'Saptami (Krishna)', 'Ashtami (Krishna)', 'Navami (Krishna)', 'Dashami (Krishna)',
  'Ekadashi (Krishna)', 'Dwadashi (Krishna)', 'Trayodashi (Krishna)', 'Chaturdashi (Krishna)', 'Amavasya (New Moon)'
];

const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'];

const ENEMY_YONIS = [
  ['Monkey', 'Goat'], ['Lion', 'Elephant'], ['Horse', 'Buffalo'], ['Cow', 'Tiger'],
  ['Rat', 'Cat'], ['Snake', 'Rat'], ['Mongoose', 'Snake'], ['Deer', 'Dog']
];

const VEDHA_PAIRS = [
  ['Ashwini', 'Jyeshtha'], ['Bharani', 'Anuradha'], ['Krittika', 'Vishakha'],
  ['Rohini', 'Swati'], ['Ardra', 'Shravana'], ['Punarvasu', 'Uttara Ashadha'],
  ['Pushya', 'Purva Ashadha'], ['Ashlesha', 'Mula'], ['Magha', 'Revati'],
  ['Purva Phalguni', 'Uttara Bhadrapada'], ['Uttara Phalguni', 'Purva Bhadrapada'],
  ['Hasta', 'Shatabhisha']
];

const VASHYA_MAP = {
  Aries: ['Leo', 'Scorpio'], Taurus: ['Cancer', 'Libra'], Gemini: ['Virgo'],
  Cancer: ['Scorpio', 'Sagittarius'], Leo: ['Libra', 'Pisces'], Virgo: ['Taurus', 'Pisces'],
  Libra: ['Capricorn'], Scorpio: ['Cancer', 'Virgo'], Sagittarius: ['Pisces'],
  Capricorn: ['Aries', 'Aquarius'], Aquarius: ['Pisces'], Pisces: ['Capricorn']
};

function findStarObj(nameOrObj) {
  if (!nameOrObj) return TAMIL_STARS[0];
  if (typeof nameOrObj === 'object') {
    if (nameOrObj.name) {
      const found = TAMIL_STARS.find(s => s.name.toLowerCase() === nameOrObj.name.toLowerCase());
      if (found) return found;
    }
    if (nameOrObj.starNakshatra) {
      const found = TAMIL_STARS.find(s => s.name.toLowerCase() === nameOrObj.starNakshatra.toLowerCase());
      if (found) return found;
    }
    if (nameOrObj.astrologicalDetails?.nakshatra) {
      const found = TAMIL_STARS.find(s => s.name.toLowerCase() === nameOrObj.astrologicalDetails.nakshatra.toLowerCase());
      if (found) return found;
    }
  }
  const str = nameOrObj.toString().toLowerCase().trim();
  return TAMIL_STARS.find(s => s.name.toLowerCase() === str || s.tamil.includes(str)) || TAMIL_STARS[0];
}

function findRashiIdx(nameOrObj) {
  if (!nameOrObj) return 0;
  let str = '';
  if (typeof nameOrObj === 'object') {
    str = nameOrObj.rasiMoonSign || nameOrObj.moonSign || nameOrObj.astrologicalDetails?.moonSign || '';
  } else {
    str = nameOrObj.toString();
  }
  str = str.toLowerCase().trim();
  const idx = RASHIS.findIndex(r => r.name.toLowerCase().includes(str) || r.tamil.includes(str));
  return idx >= 0 ? idx : 0;
}

/**
 * 10 Tamil Poruthams for Matrimony
 */
function calculateTamilPoruthams(boyInput, girlInput) {
  const boyNak = findStarObj(boyInput);
  const girlNak = findStarObj(girlInput);
  const boySignIdx = findRashiIdx(boyInput);
  const girlSignIdx = findRashiIdx(girlInput);

  const starDistance = ((boyNak.index - girlNak.index + 27) % 27) + 1;
  const rashiDistance = ((boySignIdx - girlSignIdx + 12) % 12) + 1;

  const poruthams = [];

  // 1. Dina Porutham
  const goodDinaCounts = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24, 26];
  const dinaPass = goodDinaCounts.includes(starDistance) || starDistance === 1;
  poruthams.push({
    name: 'Dina Porutham',
    nameTamil: 'தினப் பொருத்தம்',
    points: dinaPass ? 1 : 0,
    maxPoints: 1,
    status: dinaPass ? 'Uttamam' : 'Porunthathu',
    statusTamil: dinaPass ? 'உத்தமம்' : 'பொருந்தாது',
    note: dinaPass ? 'Auspicious health and fortune.' : 'Requires reconciliation.'
  });

  // 2. Gana Porutham
  let ganaPass = false;
  if (girlNak.gana === boyNak.gana) ganaPass = true;
  else if (girlNak.gana === 'Deva' && boyNak.gana === 'Manushya') ganaPass = true;
  else if (girlNak.gana === 'Manushya' && boyNak.gana === 'Deva') ganaPass = true;
  poruthams.push({
    name: 'Gana Porutham',
    nameTamil: 'கணப் பொருத்தம்',
    points: ganaPass ? 1 : 0,
    maxPoints: 1,
    status: ganaPass ? 'Uttamam' : 'Madhyamam',
    statusTamil: ganaPass ? 'உத்தமம்' : 'மத்திமம்',
    note: ganaPass ? 'Harmonious temperament.' : 'Complementary temperaments.'
  });

  // 3. Mahendra Porutham
  const mahendraDistances = [4, 7, 10, 13, 16, 19, 22, 25];
  const mahendraPass = mahendraDistances.includes(starDistance);
  poruthams.push({
    name: 'Mahendra Porutham',
    nameTamil: 'மகேந்திரப் பொருத்தம்',
    points: mahendraPass ? 1 : 0,
    maxPoints: 1,
    status: mahendraPass ? 'Uttamam' : 'Illai',
    statusTamil: mahendraPass ? 'உத்தமம்' : 'இல்லை',
    note: mahendraPass ? 'Family prosperity and lineage growth.' : 'Standard.'
  });

  // 4. Stree Dheerkha
  const streePass = starDistance >= 13;
  poruthams.push({
    name: 'Stree Dheerkha Porutham',
    nameTamil: 'ஸ்திரீ தீர்க்கப் பொருத்தம்',
    points: streePass ? 1 : 0.5,
    maxPoints: 1,
    status: streePass ? 'Uttamam' : 'Madhyamam',
    statusTamil: streePass ? 'உத்தமம்' : 'மத்திமம்',
    note: streePass ? 'Spousal longevity.' : 'Acceptable.'
  });

  // 5. Yoni Porutham
  const isEnemyYoni = ENEMY_YONIS.some(([y1, y2]) =>
    (girlNak.yoni === y1 && boyNak.yoni === y2) || (girlNak.yoni === y2 && boyNak.yoni === y1)
  );
  const yoniPass = girlNak.yoni === boyNak.yoni || !isEnemyYoni;
  poruthams.push({
    name: 'Yoni Porutham',
    nameTamil: 'யோனிப் பொருத்தம்',
    points: yoniPass ? (girlNak.yoni === boyNak.yoni ? 1 : 0.5) : 0,
    maxPoints: 1,
    status: yoniPass ? 'Uttamam' : 'Porunthathu',
    statusTamil: yoniPass ? 'உத்தமம்' : 'பொருந்தாது',
    note: yoniPass ? 'Physical harmony.' : 'Incompatible yoni.'
  });

  // 6. Rasi Porutham
  const goodRashiDist = [1, 7, 3, 4, 10, 11];
  const rasiPass = goodRashiDist.includes(rashiDistance);
  poruthams.push({
    name: 'Rasi Porutham',
    nameTamil: 'ராசிப் பொருத்தம்',
    points: rasiPass ? 1 : 0,
    maxPoints: 1,
    status: rasiPass ? 'Uttamam' : 'Madhyamam',
    statusTamil: rasiPass ? 'உத்தமம்' : 'மத்திமம்',
    note: rasiPass ? 'Family alignment.' : 'Neutral alignment.'
  });

  // 7. Rasi Adhipathi
  const lordPass = RASHIS[boySignIdx].lord === RASHIS[girlSignIdx].lord;
  poruthams.push({
    name: 'Rasi Adhipathi Porutham',
    nameTamil: 'ராசி அதிபதிப் பொருத்தம்',
    points: lordPass ? 1 : 0.5,
    maxPoints: 1,
    status: lordPass ? 'Uttamam' : 'Madhyamam',
    statusTamil: lordPass ? 'உத்தமம்' : 'மத்திமம்',
    note: lordPass ? 'Planetary friendship.' : 'Mutual neutrality.'
  });

  // 8. Vashya Porutham
  const girlRashiName = RASHIS[girlSignIdx].name;
  const boyRashiName = RASHIS[boySignIdx].name;
  const vashyaPass = (VASHYA_MAP[girlRashiName] || []).includes(boyRashiName);
  poruthams.push({
    name: 'Vashya Porutham',
    nameTamil: 'வசியப் பொருத்தம்',
    points: vashyaPass ? 1 : 0,
    maxPoints: 1,
    status: vashyaPass ? 'Uttamam' : 'Illai',
    statusTamil: vashyaPass ? 'உத்தமம்' : 'இல்லை',
    note: vashyaPass ? 'Mutual affection.' : 'Standard.'
  });

  // 9. Rajju Porutham
  const rajjuPass = girlNak.rajju !== boyNak.rajju;
  poruthams.push({
    name: 'Rajju Porutham',
    nameTamil: 'ரஜ்ஜுப் பொருத்தம்',
    points: rajjuPass ? 1 : 0,
    maxPoints: 1,
    status: rajjuPass ? 'Uttamam' : 'Eka Rajju',
    statusTamil: rajjuPass ? 'உத்தமம்' : 'ஏக ரஜ்ஜு',
    note: rajjuPass ? 'Different rajju (auspicious marital bond).' : 'Same rajju.'
  });

  // 10. Vedha Porutham
  const isVedha = VEDHA_PAIRS.some(([s1, s2]) =>
    (girlNak.name === s1 && boyNak.name === s2) || (girlNak.name === s2 && boyNak.name === s1)
  );
  const vedhaPass = !isVedha;
  poruthams.push({
    name: 'Vedha Porutham',
    nameTamil: 'வேதைப் பொருத்தம்',
    points: vedhaPass ? 1 : 0,
    maxPoints: 1,
    status: vedhaPass ? 'Uttamam' : 'Vedha Affliction',
    statusTamil: vedhaPass ? 'உத்தமம்' : 'வேதை உண்டு',
    note: vedhaPass ? 'No mutual affliction.' : 'Affliction present.'
  });

  const totalPoints = poruthams.reduce((sum, p) => sum + p.points, 0);

  return {
    poruthams,
    totalPoints,
    totalScore: totalPoints,
    maxPoints: 10,
    isRajjuMatching: rajjuPass,
    isDinaMatching: dinaPass,
    verdict: totalPoints >= 7 ? 'Uttamam' : totalPoints >= 5 ? 'Madhyamam' : 'Adhamam',
    verdictTamil: totalPoints >= 7 ? 'உத்தமப் பொருத்தம்' : totalPoints >= 5 ? 'மத்திமப் பொருத்தம்' : 'அற்பப் பொருத்தம்'
  };
}

/**
 * 36 Gunas Ashtakoota Matchmaking
 */
function calculateKundliMatch(boyBirth, girlBirth) {
  const boyNak = findStarObj(boyBirth);
  const girlNak = findStarObj(girlBirth);
  const boySign = findRashiIdx(boyBirth);
  const girlSign = findRashiIdx(girlBirth);

  const boyNakObj = NAKSHATRAS.find(n => n.name === boyNak.name) || NAKSHATRAS[0];
  const girlNakObj = NAKSHATRAS.find(n => n.name === girlNak.name) || NAKSHATRAS[0];

  // 1. Varna (1 Point)
  const varnaRank = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  const varnaPoints = (varnaRank[boyNakObj.varna] || 1) >= (varnaRank[girlNakObj.varna] || 1) ? 1 : 0;

  // 2. Vashya (2 Points)
  const vashyaPoints = boySign === girlSign ? 2 : (boySign + girlSign) % 3 === 0 ? 1 : 2;

  // 3. Tara (3 Points)
  const diff1 = (girlNak.index - boyNak.index + 27) % 9;
  const taraPoints = [3, 5, 7].includes(diff1) ? 1.5 : 3;

  // 4. Yoni (4 Points)
  const isEnemy = ENEMY_YONIS.some(([y1, y2]) => (boyNak.yoni === y1 && girlNak.yoni === y2) || (boyNak.yoni === y2 && girlNak.yoni === y1));
  const yoniPoints = boyNak.yoni === girlNak.yoni ? 4 : isEnemy ? 0 : 2;

  // 5. Graha Maitri (5 Points)
  const maitriPoints = RASHIS[boySign].lord === RASHIS[girlSign].lord ? 5 : 3;

  // 6. Gana (6 Points)
  const ganaPoints = boyNak.gana === girlNak.gana ? 6 : (boyNak.gana === 'Deva' && girlNak.gana === 'Manushya') ? 5 : 1;

  // 7. Bhakoot (7 Points)
  const rDiff = ((boySign - girlSign + 12) % 12) + 1;
  const bhakootPoints = [6, 8, 12, 2].includes(rDiff) ? 0 : 7;

  // 8. Nadi (8 Points)
  const nadiPoints = boyNakObj.nadi === girlNakObj.nadi ? 0 : 8;

  const totalScore = varnaPoints + vashyaPoints + taraPoints + yoniPoints + maitriPoints + ganaPoints + bhakootPoints + nadiPoints;

  const kootas = [
    { name: 'Varna', obtained: varnaPoints, total: 1, desc: 'Work & spiritual ego alignment' },
    { name: 'Vashya', obtained: vashyaPoints, total: 2, desc: 'Mutual magnetic power & bonding' },
    { name: 'Tara', obtained: taraPoints, total: 3, desc: 'Health & destiny destiny rhythm' },
    { name: 'Yoni', obtained: yoniPoints, total: 4, desc: 'Biological & intimacy harmony' },
    { name: 'Graha Maitri', obtained: maitriPoints, total: 5, desc: 'Friendship & intellectual communication' },
    { name: 'Gana', obtained: ganaPoints, total: 6, desc: 'Temperament & behavior temperament' },
    { name: 'Bhakoot', obtained: bhakootPoints, total: 7, desc: 'Family welfare & emotional bonding' },
    { name: 'Nadi', obtained: nadiPoints, total: 8, desc: 'Genetic, physiological & lineage health' },
  ];

  return {
    kootas,
    totalScore,
    maxScore: 36,
    percentage: Math.round((totalScore / 36) * 100),
    verdict: totalScore >= 28 ? 'Excellent Match' : totalScore >= 18 ? 'Good Match' : 'Requires Remedies',
    tamilPorutham: calculateTamilPoruthams(boyBirth, girlBirth)
  };
}

/**
 * Lightweight Chevvai Dosha Evaluation for Matrimony
 */
function evaluateChevvaiDosha(person = {}, gender = 'male') {
  const hasDosha = Boolean(person.hasDosha || person.chevvaiDosha || person.marsDosha);
  return {
    hasDosha,
    isAfflicted: hasDosha,
    remedyRequired: hasDosha,
    verdict: hasDosha ? 'Chevvai Dosha Present' : 'Free from Chevvai Dosha',
    verdictTamil: hasDosha ? 'செவ்வாய் தோஷம் உண்டு' : 'செவ்வாய் தோஷம் இல்லை',
    cancellations: []
  };
}

/**
 * Daily Panchangam for Calendar
 */
function getDailyPanchangam(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const weekdayIndex = date.getDay();

  const weekdays = [
    { name: 'Ravivara (Sunday)', lord: 'Sun', deity: 'Surya Dev', nature: 'Auspicious for ceremonies' },
    { name: 'Somavara (Monday)', lord: 'Moon', deity: 'Shiva', nature: 'Peaceful, auspicious for travel' },
    { name: 'Mangalavara (Tuesday)', lord: 'Mars', deity: 'Hanuman', nature: 'Courageous tasks' },
    { name: 'Budhavara (Wednesday)', lord: 'Mercury', deity: 'Vishnu', nature: 'Commerce and contracts' },
    { name: 'Guruvara (Thursday)', lord: 'Jupiter', deity: 'Brihaspati', nature: 'Pujas and education' },
    { name: 'Shukravara (Friday)', lord: 'Venus', deity: 'Lakshmi', nature: 'Harmony and celebrations' },
    { name: 'Shanivara (Saturday)', lord: 'Saturn', deity: 'Shani Dev', nature: 'Spiritual grounding' },
  ];

  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + 0.5 + B - 1524.5;
  const T = (jd - 2451545.0) / 36525.0;

  const sunLong = ((280.46646 + 36000.76983 * T) % 360 + 360) % 360;
  const moonLong = ((218.31645 + 481267.8813 * T) % 360 + 360) % 360;
  const diff = ((moonLong - sunLong) % 360 + 360) % 360;

  const tithiIndex = Math.floor(diff / 12) % 30;
  const tithiName = TITHIS[tithiIndex];
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';

  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const yogaIndex = Math.floor(((sunLong + moonLong) % 360) / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIndex];
  const karanaIndex = Math.floor(diff / 6) % 60;
  const karana = KARANAS[karanaIndex % 11];

  const rahuKalamSlots = ['04:30 PM - 06:00 PM', '07:30 AM - 09:00 AM', '03:00 PM - 04:30 PM', '12:00 PM - 01:30 PM', '01:30 PM - 03:00 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM'];
  const yamagandamSlots = ['12:00 PM - 01:30 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM', '07:30 AM - 09:00 AM', '06:00 AM - 07:30 AM', '03:00 PM - 04:30 PM', '01:30 PM - 03:00 PM'];
  const gulikaSlots = ['03:00 PM - 04:30 PM', '01:30 PM - 03:00 PM', '12:00 PM - 01:30 PM', '10:30 AM - 12:00 PM', '09:00 AM - 10:30 AM', '07:30 AM - 09:00 AM', '06:00 AM - 07:30 AM'];

  return {
    date: date.toISOString().split('T')[0],
    weekday: weekdays[weekdayIndex],
    tithi: { name: tithiName, paksha, index: tithiIndex + 1 },
    nakshatra: { name: nakshatra.name, lord: nakshatra.lord, deity: nakshatra.deity, index: nakshatraIndex + 1 },
    yoga: { name: yoga, index: yogaIndex + 1 },
    karana: { name: karana, index: karanaIndex + 1 },
    rahuKalam: rahuKalamSlots[weekdayIndex],
    yamagandam: yamagandamSlots[weekdayIndex],
    gulikaKalam: gulikaSlots[weekdayIndex],
    sunMoonTimes: {
      sunrise: '06:16 AM',
      sunset: '05:50 PM',
      moonrise: '01:30 PM',
      moonset: '01:15 AM'
    }
  };
}

module.exports = {
  NAKSHATRAS,
  TAMIL_STARS,
  RASHIS,
  TITHIS,
  YOGAS,
  calculateTamilPoruthams,
  calculateKundliMatch,
  evaluateChevvaiDosha,
  getDailyPanchangam,
};
