/**
 * Astrojit Matrimony & Daily Panchangam Engine
 * Contains Nakshatra reference tables, 10 Tamil Poruthams, 36 Gunas Ashtakoota,
 * and Daily Panchangam. All horoscope calculation modules have been removed.
 */

const Astronomy = require('astronomy-engine');

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
  { index: 0, name: 'Ashwini', tamil: 'அசுவினி', lord: 'Ketu', rashi: 'Aries', gana: 'Deva', yoni: 'Horse', yoniSex: 'Male', rajju: 'Pada', rajjuDirection: 'Aroha', bird: 'Hawk', tree: 'Etti', milkyTree: false, nadi: 'Adi', vedha: 'Jyeshtha' },
  { index: 1, name: 'Bharani', tamil: 'பரணி', lord: 'Venus', rashi: 'Aries', gana: 'Manushya', yoni: 'Elephant', yoniSex: 'Male', rajju: 'Thodai', rajjuDirection: 'Aroha', bird: 'Hawk', tree: 'Nelli', milkyTree: false, nadi: 'Madhya', vedha: 'Anuradha' },
  { index: 2, name: 'Krittika', tamil: 'கார்த்திகை', lord: 'Sun', rashi: 'Aries', gana: 'Rakshasa', yoni: 'Sheep', yoniSex: 'Female', rajju: 'Udara', rajjuDirection: 'Aroha', bird: 'Hawk', tree: 'Aththi', milkyTree: true, nadi: 'Antya', vedha: 'Vishakha' },
  { index: 3, name: 'Rohini', tamil: 'ரோகிணி', lord: 'Moon', rashi: 'Taurus', gana: 'Manushya', yoni: 'Serpent', yoniSex: 'Male', rajju: 'Kanda', rajjuDirection: 'Aroha', bird: 'Hawk', tree: 'Naval', milkyTree: false, nadi: 'Antya', vedha: 'Swati' },
  { index: 4, name: 'Mrigashira', tamil: 'மிருகசீரிடம்', lord: 'Mars', rashi: 'Taurus', gana: 'Deva', yoni: 'Serpent', yoniSex: 'Female', rajju: 'Sirasu', rajjuDirection: 'Center', bird: 'Hawk', tree: 'Karungali', milkyTree: false, nadi: 'Madhya', vedha: 'Chitra' },
  { index: 5, name: 'Ardra', tamil: 'திருவாதிரை', lord: 'Rahu', rashi: 'Gemini', gana: 'Manushya', yoni: 'Dog', yoniSex: 'Female', rajju: 'Kanda', rajjuDirection: 'Avaroha', bird: 'Owl', tree: 'Sengali', milkyTree: false, nadi: 'Adi', vedha: 'Shravana' },
  { index: 6, name: 'Punarvasu', tamil: 'புனர்பூசம்', lord: 'Jupiter', rashi: 'Gemini', gana: 'Deva', yoni: 'Cat', yoniSex: 'Female', rajju: 'Udara', rajjuDirection: 'Avaroha', bird: 'Owl', tree: 'Moongil', milkyTree: false, nadi: 'Adi', vedha: 'Uttara Ashadha' },
  { index: 7, name: 'Pushya', tamil: 'பூசம்', lord: 'Saturn', rashi: 'Cancer', gana: 'Deva', yoni: 'Sheep', yoniSex: 'Male', rajju: 'Thodai', rajjuDirection: 'Avaroha', bird: 'Owl', tree: 'Arasu', milkyTree: true, nadi: 'Madhya', vedha: 'Purva Ashadha' },
  { index: 8, name: 'Ashlesha', tamil: 'ஆயில்யம்', lord: 'Mercury', rashi: 'Cancer', gana: 'Rakshasa', yoni: 'Cat', yoniSex: 'Male', rajju: 'Pada', rajjuDirection: 'Avaroha', bird: 'Owl', tree: 'Punnai', milkyTree: false, nadi: 'Antya', vedha: 'Mula' },
  { index: 9, name: 'Magha', tamil: 'மகம்', lord: 'Ketu', rashi: 'Leo', gana: 'Rakshasa', yoni: 'Rat', yoniSex: 'Male', rajju: 'Pada', rajjuDirection: 'Aroha', bird: 'Owl', tree: 'Al', milkyTree: true, nadi: 'Antya', vedha: 'Revati' },
  { index: 10, name: 'Purva Phalguni', tamil: 'பூரம்', lord: 'Venus', rashi: 'Leo', gana: 'Manushya', yoni: 'Rat', yoniSex: 'Female', rajju: 'Thodai', rajjuDirection: 'Aroha', bird: 'Owl', tree: 'Pala', milkyTree: true, nadi: 'Madhya', vedha: 'Uttara Bhadrapada' },
  { index: 11, name: 'Uttara Phalguni', tamil: 'உத்திரம்', lord: 'Sun', rashi: 'Leo', gana: 'Manushya', yoni: 'Cow', yoniSex: 'Male', rajju: 'Udara', rajjuDirection: 'Aroha', bird: 'Crow', tree: 'Alari', milkyTree: true, nadi: 'Adi', vedha: 'Purva Bhadrapada' },
  { index: 12, name: 'Hasta', tamil: 'அஸ்தம்', lord: 'Moon', rashi: 'Virgo', gana: 'Deva', yoni: 'Buffalo', yoniSex: 'Female', rajju: 'Kanda', rajjuDirection: 'Aroha', bird: 'Crow', tree: 'Vilvam', milkyTree: false, nadi: 'Adi', vedha: 'Shatabhisha' },
  { index: 13, name: 'Chitra', tamil: 'சித்திரை', lord: 'Mars', rashi: 'Virgo', gana: 'Rakshasa', yoni: 'Tiger', yoniSex: 'Female', rajju: 'Sirasu', rajjuDirection: 'Center', bird: 'Crow', tree: 'Marutham', milkyTree: false, nadi: 'Madhya', vedha: 'Mrigashira' },
  { index: 14, name: 'Swati', tamil: 'சுவாதி', lord: 'Rahu', rashi: 'Libra', gana: 'Deva', yoni: 'Buffalo', yoniSex: 'Male', rajju: 'Kanda', rajjuDirection: 'Avaroha', bird: 'Crow', tree: 'Vila', milkyTree: false, nadi: 'Antya', vedha: 'Rohini' },
  { index: 15, name: 'Vishakha', tamil: 'விசாகம்', lord: 'Jupiter', rashi: 'Libra', gana: 'Rakshasa', yoni: 'Tiger', yoniSex: 'Male', rajju: 'Udara', rajjuDirection: 'Avaroha', bird: 'Crow', tree: 'Vila', milkyTree: true, nadi: 'Antya', vedha: 'Krittika' },
  { index: 16, name: 'Anuradha', tamil: 'அனுஷம்', lord: 'Saturn', rashi: 'Scorpio', gana: 'Deva', yoni: 'Deer', yoniSex: 'Female', rajju: 'Thodai', rajjuDirection: 'Avaroha', bird: 'Cock', tree: 'Magizham', milkyTree: false, nadi: 'Madhya', vedha: 'Bharani' },
  { index: 17, name: 'Jyeshtha', tamil: 'கேட்டை', lord: 'Mercury', rashi: 'Scorpio', gana: 'Rakshasa', yoni: 'Deer', yoniSex: 'Male', rajju: 'Pada', rajjuDirection: 'Avaroha', bird: 'Cock', tree: 'Parai', milkyTree: true, nadi: 'Adi', vedha: 'Ashwini' },
  { index: 18, name: 'Mula', tamil: 'மூலம்', lord: 'Ketu', rashi: 'Sagittarius', gana: 'Rakshasa', yoni: 'Dog', yoniSex: 'Male', rajju: 'Pada', rajjuDirection: 'Aroha', bird: 'Cock', tree: 'Maram', milkyTree: true, nadi: 'Adi', vedha: 'Ashlesha' },
  { index: 19, name: 'Purva Ashadha', tamil: 'பூராடம்', lord: 'Venus', rashi: 'Sagittarius', gana: 'Manushya', yoni: 'Monkey', yoniSex: 'Male', rajju: 'Thodai', rajjuDirection: 'Aroha', bird: 'Cock', tree: 'Vanji', milkyTree: false, nadi: 'Madhya', vedha: 'Pushya' },
  { index: 20, name: 'Uttara Ashadha', tamil: 'உத்திராடம்', lord: 'Sun', rashi: 'Sagittarius', gana: 'Manushya', yoni: 'Mongoose', yoniSex: 'Male', rajju: 'Udara', rajjuDirection: 'Aroha', bird: 'Cock', tree: 'Pala', milkyTree: true, nadi: 'Antya', vedha: 'Punarvasu' },
  { index: 21, name: 'Shravana', tamil: 'திருவோணம்', lord: 'Moon', rashi: 'Capricorn', gana: 'Deva', yoni: 'Monkey', yoniSex: 'Female', rajju: 'Kanda', rajjuDirection: 'Aroha', bird: 'Peacock', tree: 'Erukku', milkyTree: true, nadi: 'Antya', vedha: 'Ardra' },
  { index: 22, name: 'Dhanishta', tamil: 'அவிட்டம்', lord: 'Mars', rashi: 'Capricorn', gana: 'Rakshasa', yoni: 'Lion', yoniSex: 'Female', rajju: 'Sirasu', rajjuDirection: 'Center', bird: 'Peacock', tree: 'Vanni', milkyTree: false, nadi: 'Madhya', vedha: 'Chitra' },
  { index: 23, name: 'Shatabhisha', tamil: 'சதயம்', lord: 'Rahu', rashi: 'Aquarius', gana: 'Rakshasa', yoni: 'Horse', yoniSex: 'Female', rajju: 'Kanda', rajjuDirection: 'Avaroha', bird: 'Peacock', tree: 'Kadambu', milkyTree: false, nadi: 'Adi', vedha: 'Hasta' },
  { index: 24, name: 'Purva Bhadrapada', tamil: 'பூரட்டாதி', lord: 'Jupiter', rashi: 'Aquarius', gana: 'Manushya', yoni: 'Lion', yoniSex: 'Male', rajju: 'Udara', rajjuDirection: 'Avaroha', bird: 'Peacock', tree: 'Themaa', milkyTree: false, nadi: 'Adi', vedha: 'Uttara Phalguni' },
  { index: 25, name: 'Uttara Bhadrapada', tamil: 'உத்திரட்டாதி', lord: 'Saturn', rashi: 'Pisces', gana: 'Manushya', yoni: 'Cow', yoniSex: 'Female', rajju: 'Thodai', rajjuDirection: 'Avaroha', bird: 'Peacock', tree: 'Veppu', milkyTree: false, nadi: 'Madhya', vedha: 'Purva Phalguni' },
  { index: 26, name: 'Revati', tamil: 'ரேவதி', lord: 'Mercury', rashi: 'Pisces', gana: 'Deva', yoni: 'Elephant', yoniSex: 'Female', rajju: 'Pada', rajjuDirection: 'Avaroha', bird: 'Peacock', tree: 'Iluppai', milkyTree: true, nadi: 'Antya', vedha: 'Magha' },
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
  ['Monkey', 'Goat'], ['Monkey', 'Sheep'],
  ['Lion', 'Elephant'],
  ['Horse', 'Buffalo'],
  ['Cow', 'Tiger'],
  ['Rat', 'Cat'],
  ['Snake', 'Rat'], ['Serpent', 'Rat'],
  ['Mongoose', 'Snake'], ['Mongoose', 'Serpent'],
  ['Deer', 'Dog']
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
    const candidate = nameOrObj.starNakshatra || nameOrObj.nakshatra || nameOrObj.star || nameOrObj.astrologicalDetails?.nakshatra;
    if (candidate) {
      const cleanCandidate = String(candidate).replace(/\(.*?\)/g, '').trim().toLowerCase();
      const found = TAMIL_STARS.find(s =>
        s.name.toLowerCase() === cleanCandidate ||
        s.tamil === cleanCandidate ||
        cleanCandidate.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(cleanCandidate)
      );
      if (found) return found;
    }
    if (nameOrObj.name) {
      const cleanName = String(nameOrObj.name).replace(/\(.*?\)/g, '').trim().toLowerCase();
      const found = TAMIL_STARS.find(s => s.name.toLowerCase() === cleanName || s.tamil === cleanName);
      if (found) return found;
    }
  }
  const str = String(nameOrObj).replace(/\(.*?\)/g, '').trim().toLowerCase();
  return TAMIL_STARS.find(s =>
    s.name.toLowerCase() === str ||
    s.tamil.includes(str) ||
    str.includes(s.name.toLowerCase()) ||
    s.name.toLowerCase().includes(str)
  ) || TAMIL_STARS[0];
}

function findRashiIdx(nameOrObj) {
  if (!nameOrObj) return 0;
  let str = '';
  if (typeof nameOrObj === 'object') {
    str = nameOrObj.rasiMoonSign || nameOrObj.moonSign || nameOrObj.rasi || nameOrObj.rashi || nameOrObj.astrologicalDetails?.moonSign || '';
  } else {
    str = nameOrObj.toString();
  }
  str = String(str).replace(/\(.*?\)/g, '').trim().toLowerCase();
  const idx = RASHIS.findIndex(r =>
    r.name.toLowerCase() === str ||
    r.name.toLowerCase().includes(str) ||
    str.includes(r.name.toLowerCase()) ||
    r.tamil === str ||
    r.tamil.includes(str)
  );
  return idx >= 0 ? idx : 0;
}

/**
 * 10 & 12 Classical Tamil Vivaha Poruthams
 * Strictly following Nirayana Muhurtha Panchangam rules.
 */
function calculateTamilPoruthams(boyInput, girlInput) {
  const boyNak = findStarObj(boyInput);
  const girlNak = findStarObj(girlInput);
  const boySignIdx = findRashiIdx(boyInput);
  const girlSignIdx = findRashiIdx(girlInput);

  // Star distance: from Bride (girl) to Groom (boy) - 1 to 27
  const starDistance = ((boyNak.index - girlNak.index + 27) % 27) + 1;
  // Rasi distance: from Bride (girl) to Groom (boy) - 1 to 12
  const rashiDistance = ((boySignIdx - girlSignIdx + 12) % 12) + 1;

  const poruthams = [];

  // 1. Dina Porutham (1 point)
  const goodDinaCounts = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24, 26];
  const janmaStarsPermitted = ['Rohini', 'Ardra', 'Magha', 'Hasta', 'Vishakha', 'Anuradha', 'Mula', 'Uttara Bhadrapada', 'Revati'];
  const isJanmaAuspicious = (starDistance === 1) && (janmaStarsPermitted.includes(girlNak.name) || janmaStarsPermitted.includes(boyNak.name));
  const dinaPass = goodDinaCounts.includes(starDistance) || isJanmaAuspicious;
  poruthams.push({
    name: 'Dina Porutham',
    nameTamil: 'தினப் பொருத்தம்',
    points: dinaPass ? 1 : 0,
    maxPoints: 1,
    status: dinaPass ? 'Uttamam' : 'Porunthathu',
    statusTamil: dinaPass ? 'உத்தமம்' : 'பொருந்தாது',
    rule: dinaPass
      ? 'தினப் பொருத்தம் உத்தமமாக உள்ளது. தம்பதியருக்கு நீண்ட ஆயுள் மற்றும் ஆரோக்கியத்தைத் தரும்.'
      : 'தினப் பொருத்தம் அமையவில்லை. அசுப தாராபலத்தில் நட்சத்திரம் அமைந்துள்ளது.'
  });

  // 2. Gana Porutham (1 point)
  let ganaPoints = 0;
  let ganaStatus = 'Porunthathu';
  let ganaRule = '';
  if (girlNak.gana === boyNak.gana) {
    ganaPoints = 1;
    ganaStatus = 'Uttamam';
    ganaRule = 'இருவருக்கும் ஒரே கணம் (தேவ/மனித/ராட்சஸ) அமைந்ததால் மன ஒற்றுமை மிகச் சிறப்பு.';
  } else if ((girlNak.gana === 'Deva' && boyNak.gana === 'Manushya') || (girlNak.gana === 'Manushya' && boyNak.gana === 'Deva')) {
    ganaPoints = 0.5;
    ganaStatus = 'Madhyamam';
    ganaRule = 'தேவ-மனித கணங்கள் இணைவதால் மத்திமப் பொருத்தம் உண்டாகிறது.';
  } else if (starDistance > 14) {
    ganaPoints = 0.5;
    ganaStatus = 'Madhyamam';
    ganaRule = 'ராட்சஸ கணம் ஆயினும், 14 நட்சத்திரங்களுக்கு மேல் இடைவெளி இருப்பதால் கண தோஷ நிவர்த்தி பெற்று மத்திமமாகிறது.';
  } else {
    ganaPoints = 0;
    ganaStatus = 'Porunthathu';
    ganaRule = 'கணப் பொருத்தம் பொருந்தாது. ராட்சஸ கணமும் தேவ/மனித கணமும் 14 நட்சத்திர இடைவெளியின்றி அமைந்ததால் தோஷமாகும்.';
  }
  poruthams.push({
    name: 'Gana Porutham',
    nameTamil: 'கணப் பொருத்தம்',
    points: ganaPoints,
    maxPoints: 1,
    status: ganaStatus,
    statusTamil: ganaStatus === 'Uttamam' ? 'உத்தமம்' : ganaStatus === 'Madhyamam' ? 'மத்திமம்' : 'பொருந்தாது',
    rule: ganaRule
  });

  // 3. Mahendra Porutham (1 point)
  const mahendraDistances = [4, 7, 10, 13, 16, 19, 22, 25];
  const mahendraPass = mahendraDistances.includes(starDistance);
  poruthams.push({
    name: 'Mahendra Porutham',
    nameTamil: 'மகேந்திரப் பொருத்தம்',
    points: mahendraPass ? 1 : 0,
    maxPoints: 1,
    status: mahendraPass ? 'Uttamam' : 'Porunthathu',
    statusTamil: mahendraPass ? 'உத்தமம்' : 'பொருந்தாது',
    rule: mahendraPass
      ? 'மகேந்திரப் பொருத்தம் உத்தமம். வம்ச விருத்தி, புத்திர பாக்கியம் மற்றும் சந்ததி செழிப்பை நல்கும்.'
      : 'மகேந்திரப் பொருத்தம் அமையவில்லை.'
  });

  // 4. Stree Deergham (1 point)
  let streePoints = 0;
  let streeStatus = 'Porunthathu';
  let streeRule = '';
  if (starDistance >= 13) {
    streePoints = 1;
    streeStatus = 'Uttamam';
    streeRule = 'பெண் நட்சத்திரத்திலிருந்து வரன் நட்சத்திரம் 13-க்கு மேல் உள்ளதால் தீர்க்க சுமங்கலி யோகம் உண்டாகும்.';
  } else if (starDistance >= 7) {
    streePoints = 0.5;
    streeStatus = 'Madhyamam';
    streeRule = 'நட்சத்திர இடைவெளி 7 முதல் 12 வரை உள்ளதால் மத்திம ஸ்திரீ தீர்க்கமாகும்.';
  } else {
    streePoints = 0;
    streeStatus = 'Porunthathu';
    streeRule = 'ஸ்திரீ தீர்க்கப் பொருத்தம் அமையவில்லை (இடைவெளி 7-க்குக் கீழ்).';
  }
  poruthams.push({
    name: 'Stree Deergham',
    nameTamil: 'ஸ்திரீ தீர்க்கப் பொருத்தம்',
    points: streePoints,
    maxPoints: 1,
    status: streeStatus,
    statusTamil: streeStatus === 'Uttamam' ? 'உத்தமம்' : streeStatus === 'Madhyamam' ? 'மத்திமம்' : 'பொருந்தாது',
    rule: streeRule
  });

  // 5. Yoni Porutham (1 point)
  const isEnemyYoni = ENEMY_YONIS.some(([y1, y2]) =>
    (girlNak.yoni === y1 && boyNak.yoni === y2) || (girlNak.yoni === y2 && boyNak.yoni === y1)
  );
  let yoniPoints = 0;
  let yoniStatus = 'Porunthathu';
  let yoniRule = '';
  if (girlNak.yoni === boyNak.yoni) {
    if (girlNak.yoniSex !== boyNak.yoniSex) {
      yoniPoints = 1;
      yoniStatus = 'Uttamam';
      yoniRule = 'இருவருக்கும் ஒரே மிருக யோனியும் ஆண்-பெண் சேர்க்கையும் அமைந்ததால் உத்தம தாம்பத்திய ஒற்றுமை.';
    } else {
      yoniPoints = 0.5;
      yoniStatus = 'Madhyamam';
      yoniRule = 'ஒரே யோனியாக அமைந்தாலும் ஒரே பாலினமாக இருப்பதால் மத்திம யோனிப் பொருத்தம்.';
    }
  } else if (!isEnemyYoni) {
    yoniPoints = 0.5;
    yoniStatus = 'Madhyamam';
    yoniRule = 'பகை யோனிகள் அல்லாததால் தாம்பத்தியத்தில் நற்பலன் தரும் மத்திம யோனிப் பொருத்தம்.';
  } else {
    yoniPoints = 0;
    yoniStatus = 'Porunthathu';
    yoniRule = 'பகை யோனிகள் (சிங்கம்-யானை, பசு-புலி, குதிரை-எருமை முதலியன) அமைந்ததால் யோனிப் பொருத்தம் இல்லை.';
  }
  poruthams.push({
    name: 'Yoni Porutham',
    nameTamil: 'யோனிப் பொருத்தம்',
    points: yoniPoints,
    maxPoints: 1,
    status: yoniStatus,
    statusTamil: yoniStatus === 'Uttamam' ? 'உத்தமம்' : yoniStatus === 'Madhyamam' ? 'மத்திமம்' : 'பொருந்தாது',
    rule: yoniRule
  });

  // 6. Rasi Porutham (1 point)
  // Subha Shashtashtakam pairs check
  const subhaPairs = [
    [0, 7], [7, 0], // Aries & Scorpio (Mars)
    [1, 6], [6, 1], // Taurus & Libra (Venus)
    [2, 9], [9, 2], // Gemini & Capricorn
    [3, 8], [8, 3], // Cancer & Sagittarius
    [4, 11], [11, 4], // Leo & Pisces
  ];
  const isSubhaShashtashtakam = (rashiDistance === 6 || rashiDistance === 8) &&
    subhaPairs.some(([b, g]) => boySignIdx === b && girlSignIdx === g);

  const goodRashiDist = [1, 7, 3, 4, 10, 11];
  let rasiPoints = 0;
  let rasiStatus = 'Porunthathu';
  let rasiRule = '';
  if (isSubhaShashtashtakam) {
    rasiPoints = 1;
    rasiStatus = 'Uttamam';
    rasiRule = 'தேவகேரளம் சாஸ்திர விதிப்படி அதிபதிகள் நட்பானதால் 6-8 ராசி இடைவெளியிலும் சுப ஷஷ்டாஷ்டகமாக உத்தமம்!';
  } else if (goodRashiDist.includes(rashiDistance)) {
    rasiPoints = 1;
    rasiStatus = 'Uttamam';
    rasiRule = 'ராசிப் பொருத்தம் உத்தமம். சப்தம (7), 3, 4, 10, 11 ராசிகளில் அமைந்ததால் குடும்ப ஒற்றுமை சிறக்கும்.';
  } else if (rashiDistance === 5 || rashiDistance === 9) {
    rasiPoints = 0.5;
    rasiStatus = 'Madhyamam';
    rasiRule = 'நவபஞ்சம (5-9) அமைப்பில் உள்ளதால் மத்திமப் பொருத்தம்.';
  } else {
    rasiPoints = 0;
    rasiStatus = 'Porunthathu';
    rasiRule = 'அசுப ஷஷ்டாஷ்டகம் (6-8) அல்லது துவித்வாதசம் (2-12) அமைப்பில் உள்ளதால் ராசிப் பொருத்தம் பொருந்தாது.';
  }
  poruthams.push({
    name: 'Rasi Porutham',
    nameTamil: 'ராசிப் பொருத்தம்',
    points: rasiPoints,
    maxPoints: 1,
    status: rasiStatus,
    statusTamil: rasiStatus === 'Uttamam' ? 'உத்தமம்' : rasiStatus === 'Madhyamam' ? 'மத்திமம்' : 'பொருந்தாது',
    rule: rasiRule
  });

  // 7. Rasi Adhipathi Porutham (1 point)
  const boyLord = RASHIS[boySignIdx]?.lord;
  const girlLord = RASHIS[girlSignIdx]?.lord;
  const devasGroup = ['Sun', 'Moon', 'Mars', 'Jupiter'];
  const asurasGroup = ['Mercury', 'Venus', 'Saturn'];
  const areFriends = (boyLord === girlLord) ||
    (devasGroup.includes(boyLord) && devasGroup.includes(girlLord)) ||
    (asurasGroup.includes(boyLord) && asurasGroup.includes(girlLord));

  let adhipathiPoints = 0;
  let adhipathiStatus = 'Porunthathu';
  let adhipathiRule = '';
  if (areFriends) {
    adhipathiPoints = 1;
    adhipathiStatus = 'Uttamam';
    adhipathiRule = 'இரு ராசிநாதர்களும் ஒரே கிரகமாகவோ அல்லது பரஸ்பர மித்திரர்களாகவோ உள்ளதால் உத்தமப் பொருத்தம்.';
  } else if (boyLord === 'Jupiter' || girlLord === 'Jupiter' || boyLord === 'Mercury' || girlLord === 'Mercury') {
    adhipathiPoints = 0.5;
    adhipathiStatus = 'Madhyamam';
    adhipathiRule = 'ராசிநாதர்கள் சமநிலையில் உள்ளதால் மத்திமப் பொருத்தம்.';
  } else {
    adhipathiPoints = 0;
    adhipathiStatus = 'Porunthathu';
    adhipathiRule = 'ராசிநாதர்கள் பரஸ்பர சத்ருக்களாக உள்ளதால் ராசி அதிபதிப் பொருத்தம் இல்லை.';
  }
  poruthams.push({
    name: 'Rasi Adhipathi Porutham',
    nameTamil: 'ராசி அதிபதிப் பொருத்தம்',
    points: adhipathiPoints,
    maxPoints: 1,
    status: adhipathiStatus,
    statusTamil: adhipathiStatus === 'Uttamam' ? 'உத்தமம்' : adhipathiStatus === 'Madhyamam' ? 'மத்திமம்' : 'பொருந்தாது',
    rule: adhipathiRule
  });

  // 8. Vashya Porutham (1 point)
  const girlRashiName = RASHIS[girlSignIdx]?.name;
  const boyRashiName = RASHIS[boySignIdx]?.name;
  const vashyaPass = Boolean((VASHYA_MAP[girlRashiName] || []).includes(boyRashiName) || (VASHYA_MAP[boyRashiName] || []).includes(girlRashiName));
  poruthams.push({
    name: 'Vashya Porutham',
    nameTamil: 'வசியப் பொருத்தம்',
    points: vashyaPass ? 1 : 0,
    maxPoints: 1,
    status: vashyaPass ? 'Uttamam' : 'Illai',
    statusTamil: vashyaPass ? 'உத்தமம்' : 'இல்லை',
    rule: vashyaPass
      ? 'வசியப் பொருத்தம் உத்தமம். தம்பதியரிடையே பிரிக்க முடியாத அன்பு மற்றும் ஈர்ப்பு நிலைத்திருக்கும்.'
      : 'வசியப் பொருத்தம் இல்லை.'
  });

  // 9. Rajju Porutham (1 point) - Critical
  const isArohaAvarohaException = (boyNak.rajju === girlNak.rajju) &&
    (boyNak.rajjuDirection && girlNak.rajjuDirection && boyNak.rajjuDirection !== girlNak.rajjuDirection);
  const rajjuDifferent = girlNak.rajju !== boyNak.rajju;
  const rajjuPoints = (rajjuDifferent || isArohaAvarohaException) ? 1 : 0;
  const rajjuStatus = (rajjuDifferent || isArohaAvarohaException) ? 'Uttamam' : 'Porunthathu';
  let rajjuRule = '';
  if (isArohaAvarohaException) {
    rajjuRule = 'இருவரும் ஒரே ரஜ்ஜுவில் அமைந்திருந்தாலும், ஒருவர் ஏறுமுகம் மற்றவர் இறங்குமுகம் என எதிர் திசையில் அமைந்ததால் ரஜ்ஜு தோஷம் நிவர்த்தியாகி உத்தமமாகிறது!';
  } else if (rajjuDifferent) {
    rajjuRule = 'இருவருக்கும் வெவ்வேறு ரஜ்ஜு அமைந்ததால் தீர்க்க மாங்கல்ய பலம் மற்றும் நல்வாழ்வு உறுதி.';
  } else {
    rajjuRule = 'இருவருக்கும் ஒரே ரஜ்ஜுவும் ஒரே திசையும் அமைந்ததால் ரஜ்ஜு தட்டல் (தோஷம்) உள்ளது. சாஸ்திர பரிகாரம் அவசியம்.';
  }
  poruthams.push({
    name: 'Rajju Porutham',
    nameTamil: 'ரஜ்ஜுப் பொருத்தம்',
    points: rajjuPoints,
    maxPoints: 1,
    status: rajjuStatus,
    statusTamil: rajjuStatus === 'Uttamam' ? 'உத்தமம்' : 'பொருந்தாது',
    rule: rajjuRule
  });

  // 10. Vedha Porutham (1 point) - Critical
  const isVedha = VEDHA_PAIRS.some(([s1, s2]) =>
    (girlNak.name === s1 && boyNak.name === s2) || (girlNak.name === s2 && boyNak.name === s1)
  );
  const vedhaPoints = isVedha ? 0 : 1;
  const vedhaStatus = isVedha ? 'Porunthathu' : 'Uttamam';
  poruthams.push({
    name: 'Vedha Porutham',
    nameTamil: 'வேதைப் பொருத்தம்',
    points: vedhaPoints,
    maxPoints: 1,
    status: vedhaStatus,
    statusTamil: vedhaStatus === 'Uttamam' ? 'உத்தமம்' : 'பொருந்தாது',
    rule: isVedha
      ? 'பரஸ்பர வேதை நட்சத்திரங்களாக அமைந்ததால் வேதை தோஷம் உள்ளது.'
      : 'வேதை தோஷம் இல்லை. உத்தமமான நட்சத்திர அமைவு.'
  });

  // 11. Nadi Porutham (11th Porutham)
  const nadiPass = boyNak.nadi !== girlNak.nadi;
  poruthams.push({
    name: 'Nadi Porutham',
    nameTamil: 'நாடிப் பொருத்தம்',
    points: nadiPass ? 1 : 0,
    maxPoints: 1,
    status: nadiPass ? 'Uttamam' : 'Porunthathu',
    statusTamil: nadiPass ? 'உத்தமம்' : 'பொருந்தாது',
    rule: nadiPass
      ? 'வெவ்வேறு நாடிகளாக அமைந்ததால் உடல்நலம் மற்றும் மரபியல் பொருத்தம் உத்தமம்.'
      : 'ஒரே நாடியாக அமைந்ததால் நாடிப் பொருத்தம் அமையவில்லை.'
  });

  // 12. Vriksha Porutham (12th Porutham)
  const hasMilkyTree = Boolean(boyNak.milkyTree || girlNak.milkyTree);
  poruthams.push({
    name: 'Vriksha Porutham',
    nameTamil: 'விருட்சப் பொருத்தம்',
    points: hasMilkyTree ? 1 : 0.5,
    maxPoints: 1,
    status: hasMilkyTree ? 'Uttamam' : 'Madhyamam',
    statusTamil: hasMilkyTree ? 'உத்தமம்' : 'மத்திமம்',
    rule: hasMilkyTree
      ? 'பால் உள்ள விருட்சம் அமைந்ததால் சந்ததி விருத்திக்கு உத்தமம்.'
      : 'இருவரும் பால் அற்ற விருட்சங்கள் ஆதலால் மத்திமம்.'
  });

  // Total points for primary 10 poruthams
  const primary10 = poruthams.slice(0, 10);
  const totalScore = primary10.reduce((sum, p) => sum + p.points, 0);

  // Extract pada from input or default to 1
  const boyPada = boyInput.pada || boyInput.padam || boyInput.moonPada || 1;
  const girlPada = girlInput.pada || girlInput.padam || girlInput.moonPada || 1;

  const boyDetails = {
    name: boyInput.name || 'Groom',
    star: boyNak.name,
    nakshatra: boyNak.name,
    nakshatraTamil: boyNak.tamil,
    padam: boyPada,
    pada: boyPada,
    rasi: RASHIS[boySignIdx]?.name || boyNak.rashi,
    rashi: RASHIS[boySignIdx]?.name || boyNak.rashi,
    rashiTamil: RASHIS[boySignIdx]?.tamil,
    gana: boyNak.gana,
    animal: boyNak.yoni,
    yoni: boyNak.yoni,
    yoniSex: boyNak.yoniSex || 'Male',
    bird: boyNak.bird,
    tree: boyNak.tree,
    vriksha: boyNak.tree,
    milkyTree: Boolean(boyNak.milkyTree),
    rajju: boyNak.rajju,
    rajjuDirection: boyNak.rajjuDirection,
    nadi: boyNak.nadi,
  };

  const girlDetails = {
    name: girlInput.name || 'Bride',
    star: girlNak.name,
    nakshatra: girlNak.name,
    nakshatraTamil: girlNak.tamil,
    padam: girlPada,
    pada: girlPada,
    rasi: RASHIS[girlSignIdx]?.name || girlNak.rashi,
    rashi: RASHIS[girlSignIdx]?.name || girlNak.rashi,
    rashiTamil: RASHIS[girlSignIdx]?.tamil,
    gana: girlNak.gana,
    animal: girlNak.yoni,
    yoni: girlNak.yoni,
    yoniSex: girlNak.yoniSex || 'Female',
    bird: girlNak.bird,
    tree: girlNak.tree,
    vriksha: girlNak.tree,
    milkyTree: Boolean(girlNak.milkyTree),
    rajju: girlNak.rajju,
    rajjuDirection: girlNak.rajjuDirection,
    nadi: girlNak.nadi,
  };

  return {
    poruthams,
    totalPoints: totalScore,
    totalScore: totalScore,
    maxPoints: 10,
    maxScore: 10,
    boyDetails,
    girlDetails,
    rajjuAnalysis: {
      hasDosha: (boyNak.rajju === girlNak.rajju),
      isArohaAvarohaException: isArohaAvarohaException,
      limbAfflicted: boyNak.rajju,
      boyRajju: boyNak.rajju,
      girlRajju: girlNak.rajju,
      boyDirection: boyNak.rajjuDirection,
      girlDirection: girlNak.rajjuDirection,
    },
    vedhaAnalysis: {
      hasVedha: isVedha,
      boyStar: boyNak.name,
      girlStar: girlNak.name
    },
    subhaShashtashtakam: {
      isSubhaShashtashtakam: isSubhaShashtashtakam,
      boySign: RASHIS[boySignIdx]?.name,
      girlSign: RASHIS[girlSignIdx]?.name,
    },
    isRajjuMatching: rajjuPoints === 1,
    isDinaMatching: dinaPass,
    verdict: totalScore >= 7 ? 'Uttamam' : totalScore >= 5 ? 'Madhyamam' : 'Adhamam',
    verdictTamil: totalScore >= 7 ? 'உத்தமப் பொருத்தம்' : totalScore >= 5 ? 'மத்திமப் பொருத்தம்' : 'அற்பப் பொருத்தம்'
  };
}

/**
 * Classical Nirayana Ephemeris & Astronomical Helper for Guja (Chevvai) & Dasha Analysis
 */
function normalizeDeg(deg) {
  let v = deg % 360;
  if (v < 0) v += 360;
  return v;
}

function sinD(deg) {
  return Math.sin(deg * Math.PI / 180);
}

function cosD(deg) {
  return Math.cos(deg * Math.PI / 180);
}

function atan2D(y, x) {
  return normalizeDeg(Math.atan2(y, x) * 180 / Math.PI);
}

function parseDobParts(dobStr) {
  if (!dobStr) return { year: 2000, month: 1, day: 1 };
  const parts = String(dobStr).split(/[-/.]/).map(s => parseInt(s, 10));
  if (parts[0] > 1000) {
    return { year: parts[0] || 2000, month: parts[1] || 1, day: parts[2] || 1 };
  }
  return { year: parts[2] || 2000, month: parts[1] || 1, day: parts[0] || 1 };
}

function parseTimeParts(timeStr) {
  if (!timeStr) return { hour: 6, minute: 0 };
  const raw = String(timeStr).trim();
  const amPmMatch = raw.match(/\b(AM|PM)\b/i);
  const clean = raw.replace(/\b(AM|PM)\b/i, '').trim();
  const parts = clean.split(':').map(s => parseInt(s, 10));
  let hour = isNaN(parts[0]) ? 6 : parts[0];
  const minute = isNaN(parts[1]) ? 0 : parts[1];
  if (amPmMatch) {
    const period = amPmMatch[1].toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    else if (period === 'AM' && hour === 12) hour = 0;
  }
  return { hour, minute };
}

function computeJulianDay(Y, M, D, hour = 0, minute = 0) {
  let y = Y;
  let m = M;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = D + (hour + minute / 60) / 24.0;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
}

/**
 * Computes Sidereal planetary positions for Lagna, Sun, Moon, Mars, Jupiter, Venus, Saturn, Rahu, Ketu
 */
function parseBackendUtcOffset(tzVal) {
  if (typeof tzVal === 'number' && !isNaN(tzVal)) return tzVal;
  if (typeof tzVal === 'string') {
    const m = tzVal.match(/([+-]?)(\d{1,2})(?::(\d{2}))?/);
    if (m) {
      const sign = m[1] === '-' ? -1 : 1;
      const hrs = parseInt(m[2], 10) || 0;
      const mins = parseInt(m[3], 10) || 0;
      return sign * (hrs + mins / 60);
    }
    const f = parseFloat(tzVal);
    if (!isNaN(f)) return f;
  }
  return 5.5;
}

function computePersonGrahas(input = {}) {
  const { year, month, day } = parseDobParts(input.dob || input.birthDate || input.dateOfBirth);
  const { hour, minute } = parseTimeParts(input.dobTime || input.birthTime || input.timeOfBirth || '06:00');
  const lat = parseFloat(input.lat || input.latitude || 11.65);
  const lon = parseFloat(input.lon || input.longitude || 78.20);
  const utcOffset = parseBackendUtcOffset(input.utcOffset ?? input.tz ?? 5.5);

  const utHours = (hour + minute / 60) - utcOffset;
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) + utHours * 3600000);
  if (year >= 0 && year < 100) utcDate.setUTCFullYear(year);
  const astroTime = Astronomy.MakeTime(utcDate);
  const T = astroTime.tt / 36525.0;

  // Lahiri (Chitrapaksha) Ayanamsha & True Obliquity via astronomy-engine
  const tilt = Astronomy.e_tilt(astroTime);
  const ayanamsha = normalizeDeg(23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600.0 + tilt.dpsi / 3600.0);

  // Geocentric Sidereal Longitudes (VSOP87 / ELP2000 / JPL accuracy)
  const sunSid = normalizeDeg(Astronomy.SunPosition(astroTime).elon - ayanamsha);
  const astroMoonSid = normalizeDeg(Astronomy.EclipticGeoMoon(astroTime).lon - ayanamsha);
  const marsSid = normalizeDeg(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mars, astroTime, true)).elon - ayanamsha);
  const jupSid = normalizeDeg(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Jupiter, astroTime, true)).elon - ayanamsha);
  const venSid = normalizeDeg(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Venus, astroTime, true)).elon - ayanamsha);
  const satSid = normalizeDeg(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Saturn, astroTime, true)).elon - ayanamsha);
  const merSid = normalizeDeg(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, astroTime, true)).elon - ayanamsha);

  // Mean Rahu & Ketu
  const rahuTrop = normalizeDeg(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0);
  const rahuSid = normalizeDeg(rahuTrop - ayanamsha);
  const ketuSid = normalizeDeg(rahuSid + 180);

  // Local Sidereal Time (GAST + lon) and Ascendant (Lagna) — standard Meeus quadrant
  const gastDeg = normalizeDeg(Astronomy.SiderealTime(astroTime) * 15.0);
  const LST = normalizeDeg(gastDeg + lon);
  const eps = tilt.tobl;
  const sinLST = sinD(LST);
  const cosLST = cosD(LST);
  const sinEps = sinD(eps);
  const cosEps = cosD(eps);
  const tanLat = Math.tan(lat * Math.PI / 180);
  const ascRad = Math.atan2(cosLST, -(sinLST * cosEps + tanLat * sinEps));
  const ascTrop = normalizeDeg(ascRad * 180 / Math.PI);
  const ascSid = normalizeDeg(ascTrop - ayanamsha);

  // Moon Position & Star (preserve exact astronomical Moon when DOB matches the supplied star)
  let moonSid = astroMoonSid;
  let starObj = findStarObj(input);
  let pada = parseInt(input.pada || input.padam || 0, 10);
  const astroPadaTotal = Math.floor((astroMoonSid * 3 + 1e-9) / 10);
  const astroNakIdx = Math.floor(astroPadaTotal / 4) % 27;
  const astroPada = (astroPadaTotal % 4) + 1;
  const hasDob = Boolean(input.dob || input.birthDate || input.dateOfBirth);

  if (input.star || input.starNakshatra || input.nakshatra) {
    if (starObj && starObj.index !== undefined) {
      if (hasDob && astroNakIdx === starObj.index) {
        // Use true astronomical longitude so Dasha balance & Tithi match Horoscope View exactly
        pada = astroPada;
        moonSid = astroMoonSid;
      } else {
        const pVal = pada >= 1 && pada <= 4 ? pada : 1;
        pada = pVal;
        moonSid = normalizeDeg(starObj.index * (40 / 3) + (pVal - 1) * (10 / 3) + (5 / 3));
      }
    }
  } else {
    pada = astroPada;
    starObj = { ...NAKSHATRAS[astroNakIdx], index: astroNakIdx };
    moonSid = astroMoonSid;
  }
  if (!pada || pada < 1 || pada > 4) pada = 1;

  const lagnaRasi = Math.floor(ascSid / 30) % 12;
  const moonRasi = Math.floor(moonSid / 30) % 12;
  const marsRasi = Math.floor(marsSid / 30) % 12;
  const venusRasi = Math.floor(venSid / 30) % 12;
  const jupRasi = Math.floor(jupSid / 30) % 12;
  const sunRasi = Math.floor(sunSid / 30) % 12;
  const merRasi = Math.floor(merSid / 30) % 12;
  const satRasi = Math.floor(satSid / 30) % 12;
  const rahuRasi = Math.floor(rahuSid / 30) % 12;
  const ketuRasi = Math.floor(ketuSid / 30) % 12;

  return {
    birthYear: year,
    birthMonth: month,
    birthDay: day,
    starObj,
    pada,
    longitudes: {
      ascendant: ascSid,
      sun: sunSid,
      moon: moonSid,
      astroMoon: astroMoonSid,
      mars: marsSid,
      jupiter: jupSid,
      venus: venSid,
      saturn: satSid,
      mercury: merSid,
      rahu: rahuSid,
      ketu: ketuSid,
    },
    rashis: {
      lagna: lagnaRasi,
      moon: moonRasi,
      mars: marsRasi,
      venus: venusRasi,
      jupiter: jupRasi,
      sun: sunRasi,
      mercury: merRasi,
      saturn: satRasi,
      rahu: rahuRasi,
      ketu: ketuRasi,
    }
  };
}

/**
 * Detailed Guja (Chevvai) Dosha Evaluation with Classical Nivrutti Rules
 */
function evaluateDetailedChevvai(grahas, personInput = {}) {
  const { rashis, starObj, pada } = grahas;
  const lagnaRasi = rashis.lagna;
  const moonRasi = rashis.moon;
  const venusRasi = rashis.venus;
  const marsRasi = rashis.mars;
  const jupRasi = rashis.jupiter;

  // Exact houses of Mars
  const houseLagna = ((marsRasi - lagnaRasi + 12) % 12) + 1;
  const houseMoon = ((marsRasi - moonRasi + 12) % 12) + 1;
  const houseVenus = ((marsRasi - venusRasi + 12) % 12) + 1;

  const doshaHouses = [1, 2, 4, 7, 8, 12];
  const isLagnaDosha = doshaHouses.includes(houseLagna);
  const isMoonDosha = doshaHouses.includes(houseMoon);
  const isVenusDosha = doshaHouses.includes(houseVenus);

  const rawHasDosha = isLagnaDosha || isMoonDosha || isVenusDosha;

  // Sastric Nivrutti (Cancellations)
  const cancellations = [];

  // 1. Swakshetra (Own House: Aries / Scorpio)
  if (marsRasi === 0 || marsRasi === 7) {
    cancellations.push('Swakshetra Exemption: Mars in own house (Aries/Scorpio) neutralizes dosha');
  }
  // 2. Exaltation (Capricorn)
  if (marsRasi === 9) {
    cancellations.push('Uccha Exemption: Mars exalted in Capricorn cancels inauspiciousness');
  }
  // 3. Debilitation (Cancer)
  if (marsRasi === 3) {
    cancellations.push('Neecha Nivrutti: Mars in Cancer loses malefic stinging capacity');
  }
  // 4. Leo (Friendly Sign of Sun)
  if (marsRasi === 4) {
    cancellations.push('Mitra Kshetra Exemption: Mars in friendly royal sign Leo');
  }
  // 5. Jupiter Signs (Sagittarius / Pisces)
  if (marsRasi === 8 || marsRasi === 11) {
    cancellations.push('Guru Kshetra Exemption: Mars in auspicious signs of Jupiter');
  }
  // 6. Guru Aspect / Association (Guru Mangala Yoga)
  const distFromGuru = ((marsRasi - jupRasi + 12) % 12) + 1;
  if (distFromGuru === 1 || distFromGuru === 5 || distFromGuru === 7 || distFromGuru === 9) {
    cancellations.push('Guru Mangala Yoga: Benefic Jupiter conjuncts or directly aspects Mars');
  }
  // 7. Chandra Mangala Yoga (Moon with Mars)
  if (marsRasi === moonRasi) {
    cancellations.push('Chandra Mangala Yoga: Auspicious association of Moon and Mars');
  }
  // 8. Specific House-Sign Pairs
  if (houseLagna === 2 && (marsRasi === 2 || marsRasi === 5)) {
    cancellations.push('Mercury Sign 2nd House Exemption: Mars in Gemini/Virgo in 2nd');
  }
  if (houseLagna === 4 && (marsRasi === 0 || marsRasi === 7)) {
    cancellations.push('Aries/Scorpio 4th House Exemption: Mars in 4th house in own sign');
  }
  if (houseLagna === 7 && (marsRasi === 3 || marsRasi === 9)) {
    cancellations.push('Cancer/Capricorn 7th House Exemption: Mars in 7th house exalted or debilitated');
  }
  if (houseLagna === 8 && (marsRasi === 8 || marsRasi === 11)) {
    cancellations.push('Sagittarius/Pisces 8th House Exemption: Mars in 8th house in Jupiter signs');
  }
  if (houseLagna === 12 && (marsRasi === 1 || marsRasi === 6)) {
    cancellations.push('Venus Sign 12th House Exemption: Mars in Taurus/Libra in 12th');
  }

  const isCancelled = rawHasDosha && cancellations.length > 0;
  const netHasDosha = rawHasDosha && !isCancelled;

  // Dosha level
  let doshaLevel = 'None';
  let doshaLevelTamil = 'தோஷம் இல்லை';
  if (netHasDosha) {
    if (houseLagna === 7 || houseLagna === 8) {
      doshaLevel = 'High (Severe)';
      doshaLevelTamil = 'அதி தீவிர செவ்வாய் தோஷம்';
    } else {
      doshaLevel = 'Moderate / Mild';
      doshaLevelTamil = 'மிதமான செவ்வாய் தோஷம்';
    }
  } else if (isCancelled) {
    doshaLevel = 'Exempted / Cancelled (Nivrutti)';
    doshaLevelTamil = 'தோஷ நிவர்த்தி (சாஸ்திர விதிப்படி நீக்கம்)';
  }

  return {
    hasDosha: rawHasDosha,
    isCancelled,
    netHasDosha,
    doshaLevel,
    doshaLevelTamil,
    houses: {
      lagna: houseLagna,
      moon: houseMoon,
      venus: houseVenus,
    },
    cancellations: cancellations.length > 0 ? cancellations : ['Natural benefic alignment / neutral placement'],
    verdict: netHasDosha ? 'Chevvai Dosha Present' : isCancelled ? 'Chevvai Dosha Cancelled (Nivrutti)' : 'Free from Chevvai Dosha',
    verdictTamil: netHasDosha ? 'செவ்வாய் தோஷம் உண்டு' : isCancelled ? 'செவ்வாய் தோஷ நிவர்த்தி' : 'செவ்வாய் தோஷம் இல்லை'
  };
}

/**
 * South Indian 12-Cell Rasi Chart Builder
 */
function buildSouthIndianChart(grahas, chevvaiInfo) {
  const { rashis } = grahas;
  const cells = [];

  for (let sIdx = 0; sIdx < 12; sIdx++) {
    const occupants = [];
    if (rashis.lagna === sIdx) occupants.push({ name: 'Lagna', code: 'ASC / ல', isLagna: true });
    if (rashis.mars === sIdx) occupants.push({
      name: 'Mars',
      code: 'செவ் / Mars',
      isMars: true,
      houseFromLagna: chevvaiInfo.houses.lagna,
      isDoshaHouse: [1, 2, 4, 7, 8, 12].includes(chevvaiInfo.houses.lagna)
    });
    if (rashis.moon === sIdx) occupants.push({ name: 'Moon', code: 'சந் / Moon', isMoon: true });
    if (rashis.venus === sIdx) occupants.push({ name: 'Venus', code: 'சுக் / Ven', isVenus: true });
    if (rashis.jupiter === sIdx) occupants.push({ name: 'Jupiter', code: 'குரு / Jup', isJupiter: true });
    if (rashis.sun === sIdx) occupants.push({ name: 'Sun', code: 'சூரி / Sun' });
    if (rashis.mercury === sIdx) occupants.push({ name: 'Mercury', code: 'புதன் / Mer' });
    if (rashis.saturn === sIdx) occupants.push({ name: 'Saturn', code: 'சனி / Sat' });
    if (rashis.rahu === sIdx) occupants.push({ name: 'Rahu', code: 'ராகு / Rahu' });
    if (rashis.ketu === sIdx) occupants.push({ name: 'Ketu', code: 'கேது / Ketu' });

    cells.push({
      signIdx: sIdx,
      signName: RASHIS[sIdx]?.name,
      signTamil: RASHIS[sIdx]?.tamil,
      occupants
    });
  }

  return cells;
}

/**
 * Vimshottari 120-Year Dasha Timeline & Guja Dasha (Mars 7-Year Mahadasha) Calculation
 */
function computePersonDashaTimeline(grahas) {
  const DASHA_LORDS = [
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

  const starIdx = grahas.starObj ? grahas.starObj.index : 0;
  const startLordIdx = starIdx % 9;
  const pada = grahas.pada || 1;

  // Fraction remaining of birth Dasha
  const remainingFraction = Math.max(0.05, Math.min(0.95, (4 - pada + 0.5) / 4.0));
  const birthBalYears = remainingFraction * DASHA_LORDS[startLordIdx].years;

  const bYear = grahas.birthYear;
  const bMonth = grahas.birthMonth;
  const bDay = grahas.birthDay;

  // Build 9 successive Mahadashas
  const dashas = [];
  let currentStartYear = bYear + (bMonth - 1) / 12.0 + bDay / 365.25;
  let currentAge = 0;

  for (let i = 0; i < 9; i++) {
    const lordObj = DASHA_LORDS[(startLordIdx + i) % 9];
    const duration = i === 0 ? birthBalYears : lordObj.years;
    const startAge = currentAge;
    const endAge = currentAge + duration;
    const startDateYear = currentStartYear;
    const endDateYear = currentStartYear + duration;

    const sY = Math.floor(startDateYear);
    const sM = Math.max(1, Math.min(12, Math.floor((startDateYear - sY) * 12) + 1));
    const sD = Math.max(1, Math.min(28, Math.floor(((startDateYear - sY) * 12 + 1 - sM) * 30) + 1));

    const eY = Math.floor(endDateYear);
    const eM = Math.max(1, Math.min(12, Math.floor((endDateYear - eY) * 12) + 1));
    const eD = Math.max(1, Math.min(28, Math.floor(((endDateYear - eY) * 12 + 1 - eM) * 30) + 1));

    const startDateStr = `${sY}-${String(sM).padStart(2, '0')}-${String(sD).padStart(2, '0')}`;
    const endDateStr = `${eY}-${String(eM).padStart(2, '0')}-${String(eD).padStart(2, '0')}`;

    dashas.push({
      lord: lordObj.nameEn,
      lordTamil: lordObj.nameTa,
      lordId: lordObj.id,
      durationYears: Math.round(duration * 10) / 10,
      startAge: Math.round(startAge * 10) / 10,
      endAge: Math.round(endAge * 10) / 10,
      startDate: startDateStr,
      endDate: endDateStr,
      startDateYear,
      endDateYear
    });

    currentStartYear = endDateYear;
    currentAge = endAge;
  }

  // Find Guja (Mars) Mahadasha specifically
  const marsDasha = dashas.find(d => d.lordId === 'mars') || dashas[4];

  // Current date (2026.9)
  const nowYear = 2026.9;
  const currentRunning = dashas.find(d => d.startDateYear <= nowYear && d.endDateYear > nowYear) || dashas[0];

  // Status of Guja Dasha
  let marsStatus = 'Upcoming';
  let marsStatusTamil = 'எதிர்காலத்தில் வரவுள்ளது';
  if (marsDasha.endDateYear < nowYear) {
    marsStatus = 'Completed in Past';
    marsStatusTamil = 'கடந்த காலத்தில் நிறைவடைந்தது';
  } else if (marsDasha.startDateYear <= nowYear && marsDasha.endDateYear >= nowYear) {
    marsStatus = 'Currently Active (Running)';
    marsStatusTamil = 'தற்போது நடப்பில் உள்ளது';
  }

  const bBalY = Math.floor(birthBalYears);
  const bBalM = Math.floor((birthBalYears - bBalY) * 12);
  const bBalD = Math.round(((birthBalYears - bBalY) * 12 - bBalM) * 30);

  return {
    dashaBalanceText: `${DASHA_LORDS[startLordIdx].nameEn} Dasha ${bBalY}y ${bBalM}m ${bBalD}d`,
    dashaBalanceTamil: `${DASHA_LORDS[startLordIdx].nameTa} திசை ${bBalY} வருடம் ${bBalM} மாதம் ${bBalD} நாள்`,
    currentRunningDasha: {
      lord: currentRunning.lord,
      lordTamil: currentRunning.lordTamil,
      startDate: currentRunning.startDate,
      endDate: currentRunning.endDate,
      endAge: currentRunning.endAge
    },
    gujaDasha: {
      lord: 'Mars',
      lordTamil: 'செவ்வாய்',
      durationYears: 7,
      startDate: marsDasha.startDate,
      endDate: marsDasha.endDate,
      startAge: marsDasha.startAge,
      endAge: marsDasha.endAge,
      status: marsStatus,
      statusTamil: marsStatusTamil,
      startDateYear: marsDasha.startDateYear,
      endDateYear: marsDasha.endDateYear
    },
    allDashas: dashas
  };
}

/**
 * Full Classical Guja (Chevvai) Dasha & Dosha Matchmaking Analysis
 */
function calculateGujaDashaAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);

  const boyChevvai = evaluateDetailedChevvai(boyGrahas, boyInput);
  const girlChevvai = evaluateDetailedChevvai(girlGrahas, girlInput);

  const boyChartCells = buildSouthIndianChart(boyGrahas, boyChevvai);
  const girlChartCells = buildSouthIndianChart(girlGrahas, girlChevvai);

  const boyDasha = computePersonDashaTimeline(boyGrahas);
  const girlDasha = computePersonDashaTimeline(girlGrahas);

  // 1. Dosha Samyam (Mutual Balance / Neutralization)
  let samyamVerdict = 'Auspicious (Dosha Samyam Achieved)';
  let samyamVerdictTamil = 'சுபமானது (செவ்வாய் தோஷ சமநிலை பெற்றது)';
  let samyamSummary = 'Both horoscopes possess classical dosha nivrutti or comparable Mars placement, ensuring perfect harmony.';

  if (boyChevvai.netHasDosha && girlChevvai.netHasDosha) {
    samyamVerdict = 'Auspicious (Like Neutralizes Like)';
    samyamVerdictTamil = 'உத்தமம் (இருவருக்கும் செவ்வாய் தோஷம் சமநிலையில் உள்ளது)';
    samyamSummary = 'Both Groom and Bride carry Chevvai Dosha in equal measure. Sastra affirms that matching doshas fully neutralize malefic influences.';
  } else if (!boyChevvai.netHasDosha && !girlChevvai.netHasDosha) {
    samyamVerdict = 'Auspicious (Both Free from Affliction)';
    samyamVerdictTamil = 'உத்தமம் (இருவருக்கும் செவ்வாய் தோஷம் இல்லை / நிவர்த்தி)';
    samyamSummary = 'Both charts are completely free from active Chevvai Dosha through natural placement or Sastric Nivrutti.';
  } else {
    samyamVerdict = 'Remedies Required (Dosha Asymmetry)';
    samyamVerdictTamil = 'பரிகாரம் தேவை (ஒருவருக்கு மட்டும் தோஷம் உள்ளது)';
    samyamSummary = 'One chart carries uncancelled Chevvai Dosha while the other does not. Classical marriage pre-consultation and remedial Shanti are advised.';
  }

  // 2. Dasa Sandhi (Transition Junction Conflict Check)
  const boyCurrentEnd = boyDasha.currentRunningDasha.endAge;
  const girlCurrentEnd = girlDasha.currentRunningDasha.endAge;
  const nowYear = 2026.9;

  const boyYearsToEnd = boyDasha.gujaDasha.startDateYear > nowYear
    ? Math.abs(boyDasha.allDashas.find(d => d.startDateYear <= nowYear && d.endDateYear > nowYear)?.endDateYear - nowYear)
    : 2.0;
  const girlYearsToEnd = girlDasha.gujaDasha.startDateYear > nowYear
    ? Math.abs(girlDasha.allDashas.find(d => d.startDateYear <= nowYear && d.endDateYear > nowYear)?.endDateYear - nowYear)
    : 2.0;

  const boyInSandhi = boyYearsToEnd <= 1.0;
  const girlInSandhi = girlYearsToEnd <= 1.0;
  const hasSimultaneousSandhi = boyInSandhi && girlInSandhi;

  let dasaSandhiVerdict = 'No Simultaneous Dasa Sandhi';
  let dasaSandhiVerdictTamil = 'ஒரே நேரத்தில் தசா சந்தி இல்லை - சுபமானது';
  if (hasSimultaneousSandhi) {
    dasaSandhiVerdict = 'Simultaneous Dasa Sandhi Present';
    dasaSandhiVerdictTamil = 'இருவருக்கும் ஒரே நேரத்தில் தசா சந்தி உள்ளது (கவனம் தேவை)';
  }

  // 3. Guja Dasha Concurrence (Sama Dasa Check)
  const bMarsStart = boyDasha.gujaDasha.startDateYear;
  const bMarsEnd = boyDasha.gujaDasha.endDateYear;
  const gMarsStart = girlDasha.gujaDasha.startDateYear;
  const gMarsEnd = girlDasha.gujaDasha.endDateYear;

  const isOverlapMars = (bMarsStart < gMarsEnd && bMarsEnd > gMarsStart);
  let samaDashaVerdict = 'No Concurrent Mars Mahadasha Conflict';
  let samaDashaVerdictTamil = 'இருவருக்கும் ஒரே நேரத்தில் செவ்வாய் தசை இல்லை';
  if (isOverlapMars) {
    samaDashaVerdict = 'Concurrent Mars Mahadasha Overlap';
    samaDashaVerdictTamil = 'இருவருக்கும் ஒரே காலத்தில் செவ்வாய் தசை நடக்கும் வாய்ப்பு உள்ளது';
  }

  return {
    boy: {
      name: boyInput.name || 'Groom',
      star: boyGrahas.starObj ? boyGrahas.starObj.name : 'Mula',
      starTamil: boyGrahas.starObj ? boyGrahas.starObj.tamil : 'மூலம்',
      pada: boyGrahas.pada,
      lagnaRasiIdx: boyGrahas.rashis.lagna,
      lagnaRasi: RASHIS[boyGrahas.rashis.lagna]?.name,
      lagnaRasiTamil: RASHIS[boyGrahas.rashis.lagna]?.tamil,
      moonRasiIdx: boyGrahas.rashis.moon,
      moonRasi: RASHIS[boyGrahas.rashis.moon]?.name,
      moonRasiTamil: RASHIS[boyGrahas.rashis.moon]?.tamil,
      marsRasiIdx: boyGrahas.rashis.mars,
      marsRasi: RASHIS[boyGrahas.rashis.mars]?.name,
      marsRasiTamil: RASHIS[boyGrahas.rashis.mars]?.tamil,
      venusRasiIdx: boyGrahas.rashis.venus,
      venusRasi: RASHIS[boyGrahas.rashis.venus]?.name,
      venusRasiTamil: RASHIS[boyGrahas.rashis.venus]?.tamil,
      jupiterRasiIdx: boyGrahas.rashis.jupiter,
      jupiterRasi: RASHIS[boyGrahas.rashis.jupiter]?.name,
      jupiterRasiTamil: RASHIS[boyGrahas.rashis.jupiter]?.tamil,
      houses: boyChevvai.houses,
      hasDosha: boyChevvai.hasDosha,
      isCancelled: boyChevvai.isCancelled,
      netHasDosha: boyChevvai.netHasDosha,
      doshaLevel: boyChevvai.doshaLevel,
      doshaLevelTamil: boyChevvai.doshaLevelTamil,
      cancellations: boyChevvai.cancellations,
      verdict: boyChevvai.verdict,
      verdictTamil: boyChevvai.verdictTamil,
      chartCells: boyChartCells,
      dashaBalance: boyDasha.dashaBalanceText,
      dashaBalanceTamil: boyDasha.dashaBalanceTamil,
      currentDasha: boyDasha.currentRunningDasha,
      gujaDasha: boyDasha.gujaDasha,
      allDashas: boyDasha.allDashas
    },
    girl: {
      name: girlInput.name || 'Bride',
      star: girlGrahas.starObj ? girlGrahas.starObj.name : 'Purva Phalguni',
      starTamil: girlGrahas.starObj ? girlGrahas.starObj.tamil : 'பூரம்',
      pada: girlGrahas.pada,
      lagnaRasiIdx: girlGrahas.rashis.lagna,
      lagnaRasi: RASHIS[girlGrahas.rashis.lagna]?.name,
      lagnaRasiTamil: RASHIS[girlGrahas.rashis.lagna]?.tamil,
      moonRasiIdx: girlGrahas.rashis.moon,
      moonRasi: RASHIS[girlGrahas.rashis.moon]?.name,
      moonRasiTamil: RASHIS[girlGrahas.rashis.moon]?.tamil,
      marsRasiIdx: girlGrahas.rashis.mars,
      marsRasi: RASHIS[girlGrahas.rashis.mars]?.name,
      marsRasiTamil: RASHIS[girlGrahas.rashis.mars]?.tamil,
      venusRasiIdx: girlGrahas.rashis.venus,
      venusRasi: RASHIS[girlGrahas.rashis.venus]?.name,
      venusRasiTamil: RASHIS[girlGrahas.rashis.venus]?.tamil,
      jupiterRasiIdx: girlGrahas.rashis.jupiter,
      jupiterRasi: RASHIS[girlGrahas.rashis.jupiter]?.name,
      jupiterRasiTamil: RASHIS[girlGrahas.rashis.jupiter]?.tamil,
      houses: girlChevvai.houses,
      hasDosha: girlChevvai.hasDosha,
      isCancelled: girlChevvai.isCancelled,
      netHasDosha: girlChevvai.netHasDosha,
      doshaLevel: girlChevvai.doshaLevel,
      doshaLevelTamil: girlChevvai.doshaLevelTamil,
      cancellations: girlChevvai.cancellations,
      verdict: girlChevvai.verdict,
      verdictTamil: girlChevvai.verdictTamil,
      chartCells: girlChartCells,
      dashaBalance: girlDasha.dashaBalanceText,
      dashaBalanceTamil: girlDasha.dashaBalanceTamil,
      currentDasha: girlDasha.currentRunningDasha,
      gujaDasha: girlDasha.gujaDasha,
      allDashas: girlDasha.allDashas
    },
    doshaSamyam: {
      isCompatible: !((boyChevvai.netHasDosha && !girlChevvai.netHasDosha) || (!boyChevvai.netHasDosha && girlChevvai.netHasDosha)),
      verdict: samyamVerdict,
      verdictTamil: samyamVerdictTamil,
      summary: samyamSummary
    },
    dasaSandhi: {
      hasSimultaneousSandhi,
      boyInSandhi,
      girlInSandhi,
      verdict: dasaSandhiVerdict,
      verdictTamil: dasaSandhiVerdictTamil
    },
    gujaDashaSamaCheck: {
      isSimultaneous: isOverlapMars,
      verdict: samaDashaVerdict,
      verdictTamil: samaDashaVerdictTamil
    },
    remedies: [
      'Worship of Lord Murugan / Subrahmanya on Tuesdays with red oleander flowers (செவ்வரளி).',
      'Chanting of Angaraka Gayatri Mantra (அங்காரக காயத்ரி மந்திரம்) 108 times.',
      'Pilgrimage to Vaitheeswaran Koil (Chevvai Sthalam) and offering ghee lamps.',
      'Charity of red lentils (துவரம் பருப்பு) or copper items on Tuesdays.'
    ],
    remediesTamil: [
      'செவ்வாய்க்கிழமைகளில் முருகப்பெருமான் வழிபாடு மற்றும் செவ்வரளி மலர் அர்ச்சனை.',
      'அங்காரக காயத்ரி மந்திரம் ஜெபித்தல் (ஓம் வீரத்வஜாய வித்மஹே விக்னஹஸ்தாய தீமஹி...).',
      'வைத்தீஸ்வரன் கோவில் தரிசனம் அல்லது செவ்வாய் பகவானுக்கு நெய் தீபம் ஏற்றுதல்.',
      'செவ்வாய்க்கிழமைகளில் துவரம் பருப்பு அல்லது சிவப்பு நிற வஸ்திரம் தானம் செய்தல்.'
    ]
  };
}

/**
 * Detailed Rahu-Ketu (Sarpa) Dosha Evaluation with Classical Sastric Nivrutti Rules
 */
function evaluateDetailedRahuKetu(grahas, personInput = {}) {
  const { rashis } = grahas;
  const lagnaRasi = rashis.lagna;
  const moonRasi = rashis.moon;
  const venusRasi = rashis.venus;
  const rahuRasi = rashis.rahu;
  const ketuRasi = rashis.ketu;
  const jupRasi = rashis.jupiter;

  // Exact houses of Rahu & Ketu from Lagna, Moon, Venus
  const houseLagnaRahu = ((rahuRasi - lagnaRasi + 12) % 12) + 1;
  const houseLagnaKetu = ((ketuRasi - lagnaRasi + 12) % 12) + 1;

  const houseMoonRahu = ((rahuRasi - moonRasi + 12) % 12) + 1;
  const houseMoonKetu = ((ketuRasi - moonRasi + 12) % 12) + 1;

  const houseVenusRahu = ((rahuRasi - venusRasi + 12) % 12) + 1;
  const houseVenusKetu = ((ketuRasi - venusRasi + 12) % 12) + 1;

  // Determine Axis Type from Lagna
  let axisType = 'Other';
  let axisName = 'Neutral Axis (No Kalathra Dosha)';
  let axisNameTamil = 'தோஷமற்ற நடுநிலை அச்சு';
  let isKalathraDosha = false;
  let isMangalyaDosha = false;
  let isPutraDosha = false;
  let isSukhaDosha = false;

  if (houseLagnaRahu === 1 || houseLagnaRahu === 7) {
    axisType = '1_7_Axis';
    axisName = '1st / 7th Axis (Kalathra Sarpa Dosha)';
    axisNameTamil = '1 / 7 ஆம் இடம் (களத்திர சர்ப்ப தோஷம்)';
    isKalathraDosha = true;
  } else if (houseLagnaRahu === 2 || houseLagnaRahu === 8) {
    axisType = '2_8_Axis';
    axisName = '2nd / 8th Axis (Mangalya & Kutumba Sarpa Dosha)';
    axisNameTamil = '2 / 8 ஆம் இடம் (மாங்கல்ய & குடும்ப சர்ப்ப தோஷம்)';
    isMangalyaDosha = true;
  } else if (houseLagnaRahu === 5 || houseLagnaRahu === 11) {
    axisType = '5_11_Axis';
    axisName = '5th / 11th Axis (Putra / Naga Dosha)';
    axisNameTamil = '5 / 11 ஆம் இடம் (புத்திர நாக தோஷம்)';
    isPutraDosha = true;
  } else if (houseLagnaRahu === 4 || houseLagnaRahu === 12) {
    axisType = '4_12_Axis';
    axisName = '4th / 12th Axis (Sukha / Sayana Dosha)';
    axisNameTamil = '4 / 12 ஆம் இடம் (சுக / சயன தோஷம்)';
    isSukhaDosha = true;
  }

  const rawHasDosha = isKalathraDosha || isMangalyaDosha || isPutraDosha || isSukhaDosha;

  // Sastric Nivrutti (Cancellations) for Rahu-Ketu
  const cancellations = [];

  // 1. Guru Parvai (Jupiter aspect on Rahu or Ketu or 7th house)
  const distFromGuruToRahu = ((rahuRasi - jupRasi + 12) % 12) + 1;
  const distFromGuruToKetu = ((ketuRasi - jupRasi + 12) % 12) + 1;
  const isGuruAspectRahu = [1, 5, 7, 9].includes(distFromGuruToRahu);
  const isGuruAspectKetu = [1, 5, 7, 9].includes(distFromGuruToKetu);

  if (isGuruAspectRahu || isGuruAspectKetu) {
    cancellations.push('Guru Parvai Nivrutti: Jupiter conjuncts or directly aspects Rahu/Ketu, fully purifying the nodal axis.');
  }

  // 2. Favorable signs for Rahu (Taurus, Gemini, Virgo, Aquarius)
  if ([1, 2, 5, 10].includes(rahuRasi)) {
    cancellations.push('Favorable Rahu Sign: Rahu placed in auspicious/own sign (Taurus/Gemini/Virgo/Aquarius).');
  }

  // 3. Favorable signs for Ketu (Scorpio, Sagittarius, Pisces)
  if ([7, 8, 11].includes(ketuRasi)) {
    cancellations.push('Favorable Ketu Sign: Ketu placed in exaltation/moksha sign (Scorpio/Sagittarius/Pisces).');
  }

  // 4. Benefic Conjunction (Venus or Jupiter in same sign)
  if (rahuRasi === rashis.venus || ketuRasi === rashis.venus) {
    cancellations.push('Sukra Chaya Yoga: Conjunction with natural benefic Venus softens nodal severity.');
  }

  // 5. Upachaya placement from Moon
  if ([3, 6, 11].includes(houseMoonRahu) && [3, 6, 11].includes(houseMoonKetu)) {
    cancellations.push('Upachaya Bhava Exemption: Nodes in 3rd/6th/11th from Moon act as wealth and courage givers.');
  }

  const isCancelled = rawHasDosha && cancellations.length > 0;
  const netHasDosha = rawHasDosha && !isCancelled;

  let doshaLevel = 'None';
  let doshaLevelTamil = 'தோஷம் இல்லை';
  if (netHasDosha) {
    if (isKalathraDosha || isMangalyaDosha) {
      doshaLevel = 'High (Severe Sarpa Dosha)';
      doshaLevelTamil = 'அதி தீவிர சர்ப்ப தோஷம்';
    } else {
      doshaLevel = 'Moderate / Mild';
      doshaLevelTamil = 'மிதமான சர்ப்ப தோஷம்';
    }
  } else if (isCancelled) {
    doshaLevel = 'Exempted / Cancelled (Nivrutti)';
    doshaLevelTamil = 'தோஷ நிவர்த்தி (சாஸ்திர விதிப்படி நீக்கம்)';
  }

  return {
    axisType,
    axisName,
    axisNameTamil,
    hasDosha: rawHasDosha,
    isCancelled,
    netHasDosha,
    doshaLevel,
    doshaLevelTamil,
    isKalathraDosha,
    isMangalyaDosha,
    isPutraDosha,
    isSukhaDosha,
    houses: {
      lagnaRahu: houseLagnaRahu,
      lagnaKetu: houseLagnaKetu,
      moonRahu: houseMoonRahu,
      moonKetu: houseMoonKetu,
      venusRahu: houseVenusRahu,
      venusKetu: houseVenusKetu,
    },
    cancellations: cancellations.length > 0 ? cancellations : ['Favorable nodal disposition / neutral bhava alignment'],
    verdict: netHasDosha ? `${axisName} Present` : isCancelled ? `${axisName} Cancelled (Nivrutti)` : 'Free from Rahu-Ketu Dosha',
    verdictTamil: netHasDosha ? `${axisNameTamil} உள்ளது` : isCancelled ? `${axisNameTamil} நிவர்த்தி` : 'ராகு-கேது தோஷம் இல்லை'
  };
}

/**
 * South Indian 12-Cell Rasi Chart Builder specifically highlighting Rahu & Ketu
 */
function buildSouthIndianRahuKetuChart(grahas, rkInfo) {
  const { rashis } = grahas;
  const cells = [];

  for (let sIdx = 0; sIdx < 12; sIdx++) {
    const occupants = [];
    if (rashis.lagna === sIdx) occupants.push({ name: 'Lagna', code: 'ASC / ல', isLagna: true });
    if (rashis.rahu === sIdx) occupants.push({
      name: 'Rahu',
      code: 'ராகு / Rahu',
      isRahu: true,
      houseFromLagna: rkInfo.houses.lagnaRahu,
      isDoshaHouse: [1, 2, 7, 8].includes(rkInfo.houses.lagnaRahu)
    });
    if (rashis.ketu === sIdx) occupants.push({
      name: 'Ketu',
      code: 'கேது / Ketu',
      isKetu: true,
      houseFromLagna: rkInfo.houses.lagnaKetu,
      isDoshaHouse: [1, 2, 7, 8].includes(rkInfo.houses.lagnaKetu)
    });
    if (rashis.mars === sIdx) occupants.push({ name: 'Mars', code: 'செவ் / Mars', isMars: true });
    if (rashis.moon === sIdx) occupants.push({ name: 'Moon', code: 'சந் / Moon', isMoon: true });
    if (rashis.venus === sIdx) occupants.push({ name: 'Venus', code: 'சுக் / Ven', isVenus: true });
    if (rashis.jupiter === sIdx) occupants.push({ name: 'Jupiter', code: 'குரு / Jup', isJupiter: true });
    if (rashis.sun === sIdx) occupants.push({ name: 'Sun', code: 'சூரி / Sun' });
    if (rashis.mercury === sIdx) occupants.push({ name: 'Mercury', code: 'புதன் / Mer' });
    if (rashis.saturn === sIdx) occupants.push({ name: 'Saturn', code: 'சனி / Sat' });

    cells.push({
      signIdx: sIdx,
      signName: RASHIS[sIdx]?.name,
      signTamil: RASHIS[sIdx]?.tamil,
      occupants
    });
  }

  return cells;
}

/**
 * Full Classical Rahu-Ketu (Sarpa) Matchmaking Analysis
 */
function calculateRahuKetuMatchAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);

  const boyRK = evaluateDetailedRahuKetu(boyGrahas, boyInput);
  const girlRK = evaluateDetailedRahuKetu(girlGrahas, girlInput);

  const boyChartCells = buildSouthIndianRahuKetuChart(boyGrahas, boyRK);
  const girlChartCells = buildSouthIndianRahuKetuChart(girlGrahas, girlRK);

  const boyDasha = computePersonDashaTimeline(boyGrahas);
  const girlDasha = computePersonDashaTimeline(girlGrahas);

  // Extract Rahu & Ketu Mahadashas
  const boyRahuDasha = boyDasha.allDashas.find(d => d.lordId === 'rahu') || {};
  const boyKetuDasha = boyDasha.allDashas.find(d => d.lordId === 'ketu') || {};
  const girlRahuDasha = girlDasha.allDashas.find(d => d.lordId === 'rahu') || {};
  const girlKetuDasha = girlDasha.allDashas.find(d => d.lordId === 'ketu') || {};

  // Dosha Samyam (Mutual Balance / Neutralization)
  let samyamVerdict = 'Auspicious (Dosha Samyam Achieved)';
  let samyamVerdictTamil = 'சுபமானது (சர்ப்ப தோஷ சமநிலை பெற்றது)';
  let samyamSummary = 'Both horoscopes possess classical dosha nivrutti or matching nodal placement, ensuring harmony.';

  // If both have sensitive axes (1/7 or 2/8)
  const isBoySensitive = boyRK.isKalathraDosha || boyRK.isMangalyaDosha;
  const isGirlSensitive = girlRK.isKalathraDosha || girlRK.isMangalyaDosha;

  if (isBoySensitive && isGirlSensitive) {
    samyamVerdict = 'Auspicious (Like Neutralizes Like - Samyam)';
    samyamVerdictTamil = 'உத்தமம் (இருவருக்கும் சர்ப்ப தோஷம் சமநிலையில் உள்ளது)';
    samyamSummary = 'Both Groom and Bride possess matching Rahu-Ketu sensitive axes (1/7 or 2/8). Sastra affirms that equal nodal affliction neutralizes malefic effects perfectly.';
  } else if (!isBoySensitive && !isGirlSensitive) {
    samyamVerdict = 'Auspicious (Both Free from Kalathra Sarpa Dosha)';
    samyamVerdictTamil = 'உத்தமம் (இருவருக்கும் களத்திர சர்ப்ப தோஷம் இல்லை)';
    samyamSummary = 'Both charts are completely free from active Rahu-Ketu marital affliction or have complete Sastric Nivrutti.';
  } else {
    samyamVerdict = 'Remedies Required (Nodal Asymmetry)';
    samyamVerdictTamil = 'பரிகாரம் தேவை (ஒருவருக்கு மட்டும் சர்ப்ப தோஷம் உள்ளது)';
    samyamSummary = 'One chart carries Rahu-Ketu affliction on the marriage house (1st/7th or 2nd/8th) while the other chart is free from it. Pre-marital Sarpa Shanti pariharams are advised.';
  }

  return {
    boy: {
      name: boyInput.name || 'Groom',
      star: boyGrahas.starObj ? boyGrahas.starObj.name : 'Mula',
      starTamil: boyGrahas.starObj ? boyGrahas.starObj.tamil : 'மூலம்',
      pada: boyGrahas.pada,
      lagnaRasiIdx: boyGrahas.rashis.lagna,
      lagnaRasi: RASHIS[boyGrahas.rashis.lagna]?.name,
      lagnaRasiTamil: RASHIS[boyGrahas.rashis.lagna]?.tamil,
      moonRasiIdx: boyGrahas.rashis.moon,
      moonRasi: RASHIS[boyGrahas.rashis.moon]?.name,
      moonRasiTamil: RASHIS[boyGrahas.rashis.moon]?.tamil,
      rahuRasiIdx: boyGrahas.rashis.rahu,
      rahuRasi: RASHIS[boyGrahas.rashis.rahu]?.name,
      rahuRasiTamil: RASHIS[boyGrahas.rashis.rahu]?.tamil,
      ketuRasiIdx: boyGrahas.rashis.ketu,
      ketuRasi: RASHIS[boyGrahas.rashis.ketu]?.name,
      ketuRasiTamil: RASHIS[boyGrahas.rashis.ketu]?.tamil,
      jupiterRasiIdx: boyGrahas.rashis.jupiter,
      jupiterRasi: RASHIS[boyGrahas.rashis.jupiter]?.name,
      jupiterRasiTamil: RASHIS[boyGrahas.rashis.jupiter]?.tamil,
      axisType: boyRK.axisType,
      axisName: boyRK.axisName,
      axisNameTamil: boyRK.axisNameTamil,
      houses: boyRK.houses,
      hasDosha: boyRK.hasDosha,
      isCancelled: boyRK.isCancelled,
      netHasDosha: boyRK.netHasDosha,
      doshaLevel: boyRK.doshaLevel,
      doshaLevelTamil: boyRK.doshaLevelTamil,
      cancellations: boyRK.cancellations,
      verdict: boyRK.verdict,
      verdictTamil: boyRK.verdictTamil,
      chartCells: boyChartCells,
      rahuDasha: boyRahuDasha,
      ketuDasha: boyKetuDasha,
      currentDasha: boyDasha.currentRunningDasha,
    },
    girl: {
      name: girlInput.name || 'Bride',
      star: girlGrahas.starObj ? girlGrahas.starObj.name : 'Purva Phalguni',
      starTamil: girlGrahas.starObj ? girlGrahas.starObj.tamil : 'பூரம்',
      pada: girlGrahas.pada,
      lagnaRasiIdx: girlGrahas.rashis.lagna,
      lagnaRasi: RASHIS[girlGrahas.rashis.lagna]?.name,
      lagnaRasiTamil: RASHIS[girlGrahas.rashis.lagna]?.tamil,
      moonRasiIdx: girlGrahas.rashis.moon,
      moonRasi: RASHIS[girlGrahas.rashis.moon]?.name,
      moonRasiTamil: RASHIS[girlGrahas.rashis.moon]?.tamil,
      rahuRasiIdx: girlGrahas.rashis.rahu,
      rahuRasi: RASHIS[girlGrahas.rashis.rahu]?.name,
      rahuRasiTamil: RASHIS[girlGrahas.rashis.rahu]?.tamil,
      ketuRasiIdx: girlGrahas.rashis.ketu,
      ketuRasi: RASHIS[girlGrahas.rashis.ketu]?.name,
      ketuRasiTamil: RASHIS[girlGrahas.rashis.ketu]?.tamil,
      jupiterRasiIdx: girlGrahas.rashis.jupiter,
      jupiterRasi: RASHIS[girlGrahas.rashis.jupiter]?.name,
      jupiterRasiTamil: RASHIS[girlGrahas.rashis.jupiter]?.tamil,
      axisType: girlRK.axisType,
      axisName: girlRK.axisName,
      axisNameTamil: girlRK.axisNameTamil,
      houses: girlRK.houses,
      hasDosha: girlRK.hasDosha,
      isCancelled: girlRK.isCancelled,
      netHasDosha: girlRK.netHasDosha,
      doshaLevel: girlRK.doshaLevel,
      doshaLevelTamil: girlRK.doshaLevelTamil,
      cancellations: girlRK.cancellations,
      verdict: girlRK.verdict,
      verdictTamil: girlRK.verdictTamil,
      chartCells: girlChartCells,
      rahuDasha: girlRahuDasha,
      ketuDasha: girlKetuDasha,
      currentDasha: girlDasha.currentRunningDasha,
    },
    doshaSamyam: {
      isCompatible: !(isBoySensitive !== isGirlSensitive && (boyRK.netHasDosha || girlRK.netHasDosha)),
      verdict: samyamVerdict,
      verdictTamil: samyamVerdictTamil,
      summary: samyamSummary,
    },
    remedies: [
      'Pilgrimage to Tirunageswaram (Rahu Sthalam) & performing Milk Abhishekam.',
      'Pilgrimage to Keezhaperumpallam (Ketu Sthalam) with multicolored floral offering.',
      'Srikalahasti Rahu-Ketu Sarpa Dosha Nivarana Puja or Kukke Subramanya Ashlesha Bali.',
      'Chanting of Rahu Gayatri and Ketu Gayatri mantras on Tuesdays/Saturdays.'
    ],
    remediesTamil: [
      'திருநாகேஸ்வரம் ராகு ஸ்தலத்தில் பால் அபிஷேகம் செய்து வழிபடுதல்.',
      'கீழப்பெரும்பள்ளம் கேது பகவான் கோவிலில் கொள்ளு நைவேத்தியம் படைத்து வணங்குதல்.',
      'ஸ்ரீ காளஹஸ்தி ராகு-கேது சர்ப்ப தோஷ நிவாரண பூஜை அல்லது குக்கே சுப்பிரமண்யா ஆஷ்லேஷ பலி.',
      'ராகு காயத்ரி மற்றும் கேது காயத்ரி மந்திரங்களை செவ்வாய்/சனிக்கிழமைகளில் 108 முறை ஜெபித்தல்.'
    ]
  };
}

/**
 * 5th House (Puthrasthanam / Childbirth & Progeny) Analysis
 * Evaluates:
 * 1. 5th House from Lagna & 5th Lord placement + dignity
 * 2. Planets occupying the 5th house (benefics vs malefics)
 * 3. Puthrakaraka Jupiter strength & aspect on 5th house
 * 4. Saptamsha (D7) Lagna & Jupiter strength
 * 5. Beeja Sphuta (Male: Sun + Venus + Jupiter) & Kshetra Sphuta (Female: Moon + Mars + Jupiter)
 */
const RASHI_LORDS_KEY = [
  'mars', 'venus', 'mercury', 'moon', 'sun', 'mercury',
  'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'
];

const PLANET_NAMES_TA_EN = {
  sun: { ta: 'சூரியன்', en: 'Sun' },
  moon: { ta: 'சந்திரன்', en: 'Moon' },
  mars: { ta: 'செவ்வாய்', en: 'Mars' },
  mercury: { ta: 'புதன்', en: 'Mercury' },
  jupiter: { ta: 'குரு', en: 'Jupiter' },
  venus: { ta: 'சுக்கிரன்', en: 'Venus' },
  saturn: { ta: 'சனி', en: 'Saturn' },
  rahu: { ta: 'ராகு', en: 'Rahu' },
  ketu: { ta: 'கேது', en: 'Ketu' },
};

const RASHI_TA_NAMES = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
  'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
];

const D7_SIGN = (lon) => {
  const s = Math.floor(normalizeDeg(lon) / 30) % 12;
  const deg = normalizeDeg(lon) % 30;
  const part = Math.floor(deg / (30 / 7));
  const isOdd = s % 2 === 0;
  return isOdd ? (s + part) % 12 : (s + 6 + part) % 12;
};

const PLANET_DIGNITY_SIMPLE = (planetId, rasiIdx) => {
  const utcha = { sun: 0, moon: 1, mars: 9, mercury: 5, jupiter: 3, venus: 11, saturn: 6, rahu: 7, ketu: 7 };
  const neecha = { sun: 6, moon: 7, mars: 3, mercury: 11, jupiter: 9, venus: 5, saturn: 0, rahu: 1, ketu: 1 };
  const own = { sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5], jupiter: [8, 11], venus: [1, 6], saturn: [9, 10], rahu: [], ketu: [] };
  if (rasiIdx === utcha[planetId]) return { key: 'utcha', ta: 'உச்சம்', en: 'Exalted', pts: 25 };
  if ((own[planetId] || []).includes(rasiIdx)) return { key: 'aatchi', ta: 'ஆட்சி', en: 'Own Sign', pts: 22 };
  if (rasiIdx === neecha[planetId]) return { key: 'neecha', ta: 'நீசம்', en: 'Debilitated', pts: 5 };
  return { key: 'samam', ta: 'சமம் / நட்பு', en: 'Balanced', pts: 15 };
};

function evaluatePersonPuthrasthanam(grahas, isFemale = false) {
  const { longitudes } = grahas;
  const rasiOf = (lon) => Math.floor(normalizeDeg(lon) / 30) % 12;

  const lagnaRasi = rasiOf(longitudes.ascendant);
  const fifthRasi = (lagnaRasi + 4) % 12;
  const fifthLordId = RASHI_LORDS_KEY[fifthRasi];
  const fifthLordRasi = rasiOf(longitudes[fifthLordId]);
  const fifthLordHouse = ((fifthLordRasi - lagnaRasi + 12) % 12) + 1;
  const fifthLordDig = PLANET_DIGNITY_SIMPLE(fifthLordId, fifthLordRasi);

  const jupRasi = rasiOf(longitudes.jupiter);
  const jupHouse = ((jupRasi - lagnaRasi + 12) % 12) + 1;
  const jupDig = PLANET_DIGNITY_SIMPLE('jupiter', jupRasi);
  // Jupiter aspects 5th, 7th, 9th from itself (so occupies 5th, or in 1st, 9th, 11th)
  const jupiterAspects5th = [1, 5, 9, 11].includes(jupHouse);

  const planetsIn5th = [];
  for (const key of ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu']) {
    if (rasiOf(longitudes[key]) === fifthRasi) {
      planetsIn5th.push({
        id: key,
        ta: PLANET_NAMES_TA_EN[key].ta,
        en: PLANET_NAMES_TA_EN[key].en,
        isBenefic: ['jupiter', 'venus', 'mercury', 'moon'].includes(key)
      });
    }
  }

  // Saptamsha (D7) check
  const d7Lagna = D7_SIGN(longitudes.ascendant);
  const d7Jupiter = D7_SIGN(longitudes.jupiter);
  const d7FifthLord = D7_SIGN(longitudes[fifthLordId] ?? longitudes.jupiter);

  // Beeja Sphuta (Male: Sun + Venus + Jupiter) | Kshetra Sphuta (Female: Moon + Mars + Jupiter)
  const sphutaLon = isFemale
    ? normalizeDeg(longitudes.moon + longitudes.mars + longitudes.jupiter)
    : normalizeDeg(longitudes.sun + longitudes.venus + longitudes.jupiter);
  const sphutaRasi = Math.floor(sphutaLon / 30) % 12;
  const isOddSphuta = sphutaRasi % 2 === 0; // 0=Aries(odd), 2=Gemini(odd)...
  const sphutaFavorable = isFemale ? !isOddSphuta : isOddSphuta;

  // Score (0-100)
  let score = 40;
  if ([1, 4, 5, 7, 9, 10, 11].includes(fifthLordHouse)) score += 18;
  else if ([6, 8, 12].includes(fifthLordHouse)) score -= 8;
  score += Math.round((fifthLordDig.pts - 15) * 0.8);
  score += Math.round((jupDig.pts - 15) * 0.8);
  if (jupiterAspects5th) score += 15;
  if (sphutaFavorable) score += 10;
  const beneficsIn5 = planetsIn5th.filter(p => p.isBenefic).length;
  const maleficsIn5 = planetsIn5th.filter(p => !p.isBenefic).length;
  score += beneficsIn5 * 8 - maleficsIn5 * 6;
  score = Math.max(25, Math.min(98, score));

  const status = score >= 72 ? 'Strong' : score >= 52 ? 'Moderate' : 'Needs Remedies';
  const statusTa = score >= 72 ? 'உத்தமம் (பலம்)' : score >= 52 ? 'மத்திமம் (சமநிலை)' : 'பரிகாரத்திற்கு உகந்தது';

  const hasMaleficIn5 = maleficsIn5 > 0;
  const putraDosha = (hasMaleficIn5 || [6, 8, 12].includes(fifthLordHouse) || fifthLordDig.key === 'neecha') && !jupiterAspects5th;

  return {
    lagnaRasi: RASHIS[lagnaRasi].name,
    lagnaRasiTa: RASHI_TA_NAMES[lagnaRasi],
    lagnaRasiIdx: lagnaRasi,
    fifthRasi: RASHIS[fifthRasi].name,
    fifthRasiTa: RASHI_TA_NAMES[fifthRasi],
    fifthRasiIdx: fifthRasi,
    fifthLord: PLANET_NAMES_TA_EN[fifthLordId].en,
    fifthLordTa: PLANET_NAMES_TA_EN[fifthLordId].ta,
    fifthLordHouse,
    fifthLordDignity: fifthLordDig.en,
    fifthLordDignityTa: fifthLordDig.ta,
    planetsIn5th,
    jupiterHouse: jupHouse,
    jupiterRasi: RASHIS[jupRasi].name,
    jupiterRasiTa: RASHI_TA_NAMES[jupRasi],
    jupiterDignity: jupDig.en,
    jupiterDignityTa: jupDig.ta,
    jupiterAspects5th,
    d7Lagna: RASHIS[d7Lagna].name,
    d7LagnaTa: RASHI_TA_NAMES[d7Lagna],
    d7Jupiter: RASHIS[d7Jupiter].name,
    d7JupiterTa: RASHI_TA_NAMES[d7Jupiter],
    d7FifthLord: RASHIS[d7FifthLord].name,
    d7FifthLordTa: RASHI_TA_NAMES[d7FifthLord],
    sphutaNameEn: isFemale ? 'Kshetra Sphuta' : 'Beeja Sphuta',
    sphutaNameTa: isFemale ? 'க்ஷேத்திர ஸ்புடம்' : 'பீஜ ஸ்புடம்',
    sphutaRasi: RASHIS[sphutaRasi].name,
    sphutaRasiTa: RASHI_TA_NAMES[sphutaRasi],
    sphutaFavorable,
    putraDosha,
    score,
    status,
    statusTa,
    chartBoxes: buildSouthIndianChart(grahas, { isManglik: false, houses: { lagna: 1, moon: 1, venus: 1 } })
  };
}

function calculatePuthrasthanamAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);
  const boy = evaluatePersonPuthrasthanam(boyGrahas, false);
  const girl = evaluatePersonPuthrasthanam(girlGrahas, true);

  const combinedScore = Math.round((boy.score + girl.score) / 2);
  let verdictEn = '';
  let verdictTa = '';
  if (combinedScore >= 70 && (!boy.putraDosha || !girl.putraDosha)) {
    verdictEn = 'Auspicious Puthrasthanam (5th House) — Strong progeny yoga & healthy lineage prospects.';
    verdictTa = 'சுப புத்திர ஸ்தானம் (5-ம் வீடு) — சிறந்த குழந்தை பாக்கியம் மற்றும் வம்ச விருத்தி யோகம் உள்ளது.';
  } else if (combinedScore >= 52) {
    verdictEn = 'Moderate Puthrasthanam — Favorable progeny support with Jupiter’s grace and timely Dasha.';
    verdictTa = 'மத்திம புத்திர ஸ்தானம் — குரு அருள் மற்றும் சுப தசா–புக்தி காலத்தில் நற்பலன் உண்டு.';
  } else {
    verdictEn = 'Sensitive 5th House Alignment — Traditional Santhana Gopala / Puthrakameshti remedies advised.';
    verdictTa = 'கவனிக்க வேண்டிய 5-ம் வீடு அமைப்பு — சந்தான கோபால கிருஷ்ண வழிபாடு & எளிய பரிகாரங்கள் நன்மை தரும்.';
  }

  return {
    boy,
    girl,
    combinedScore,
    verdictEn,
    verdictTa
  };
}

const TITHI_NAMES_TA = [
  'பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி',
  'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி',
  'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்தசி', 'பௌர்ணமி'
];

function evaluatePersonPaksha(grahas) {
  const moonLon = grahas.longitudes.astroMoon ?? grahas.longitudes.moon;
  const sunLon = grahas.longitudes.sun;
  const diff = normalizeDeg(moonLon - sunLon);
  const tithiNum = (Math.floor(diff / 12) % 30) + 1;
  const isValarpirai = tithiNum <= 15;
  const phaseIdx = (tithiNum - 1) % 15;
  const tithiNameEn = tithiNum === 15 ? 'Pournami (Full Moon)' : tithiNum === 30 ? 'Amavasai (New Moon)' : TITHIS[phaseIdx];
  const tithiNameTa = tithiNum === 15 ? 'பௌர்ணமி' : tithiNum === 30 ? 'அமாவாசை' : TITHI_NAMES_TA[phaseIdx];
  const illuminationPct = Math.round(((1 - Math.cos(diff * Math.PI / 180)) / 2) * 100);

  const moonRasi = Math.floor(normalizeDeg(moonLon) / 30) % 12;
  const jupRasi = Math.floor(normalizeDeg(grahas.longitudes.jupiter) / 30) % 12;
  const jupDiff = (jupRasi - moonRasi + 12) % 12;
  const jupiterAspectsMoon = [0, 4, 6, 8].includes(jupDiff);
  const moonOwnOrExalted = moonRasi === 1 || moonRasi === 3; // Taurus (Exalted) or Cancer (Own)
  const hasExemption = !isValarpirai && (jupiterAspectsMoon || moonOwnOrExalted || tithiNum <= 20);

  let strengthEn = 'Subha Chandra (Strong)';
  let strengthTa = 'சுப சந்திரன் (பலம்)';
  if (!isValarpirai) {
    if (tithiNum <= 20) {
      strengthEn = 'Madhyama Chandra (Moderate)';
      strengthTa = 'மத்திம சந்திரன் (சமநிலை)';
    } else if (hasExemption) {
      strengthEn = 'Exempted by Jupiter / Moon Dignity';
      strengthTa = 'குரு பார்வை / ராசி பலத்தால் நிவர்த்தி';
    } else {
      strengthEn = 'Ksheena Chandra (Weak Moon)';
      strengthTa = 'க்ஷீண சந்திரன் (பலவீனம்)';
    }
  }

  return {
    paksha: isValarpirai ? 'Valarpirai' : 'Theipirai',
    pakshaTa: isValarpirai ? 'வளர்பிறை' : 'தேய்பிறை',
    pakshaEn: isValarpirai ? 'Valarpirai (Shukla Paksha)' : 'Theipirai (Krishna Paksha)',
    isValarpirai,
    tithiNum,
    tithiNameEn,
    tithiNameTa,
    illuminationPct,
    moonRasi: RASHIS[moonRasi].name,
    moonRasiTa: RASHI_TA_NAMES[moonRasi],
    jupiterAspectsMoon,
    moonOwnOrExalted,
    hasExemption,
    strengthEn,
    strengthTa
  };
}

function calculatePakshaMatchAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);
  const boy = evaluatePersonPaksha(boyGrahas);
  const girl = evaluatePersonPaksha(girlGrahas);

  let status = 'Good';
  let statusTa = 'நல்ல பொருத்தம்';
  let verdictEn = '';
  let verdictTa = '';

  if (boy.isValarpirai && girl.isValarpirai) {
    status = 'Uttamam';
    statusTa = 'உத்தமம் (சிறப்பு)';
    verdictEn = 'Both Bride and Groom are born in Valarpirai (Waxing Moon) — Excellent emotional harmony, optimism & family growth.';
    verdictTa = 'மணமகள் மற்றும் மணமகன் இருவரும் வளர்பிறையில் பிறந்தவர்கள் — சிறந்த மன இணக்கம், மகிழ்ச்சி மற்றும் குடும்ப வளர்ச்சி உண்டு.';
  } else if (boy.isValarpirai || girl.isValarpirai) {
    status = 'Balanced';
    statusTa = 'நல்லது / சமநிலை';
    verdictEn = 'One partner is Valarpirai and the other is Theipirai — The waxing Moon balances and supports the waning Moon.';
    verdictTa = 'ஒருவர் வளர்பிறை மற்றும் ஒருவர் தேய்பிறை — வளர்பிறை சந்திரன் தேய்பிறை சந்திரனுக்கு உறுதுணையாக இருந்து சமநிலை தரும்.';
  } else if (boy.hasExemption || girl.hasExemption) {
    status = 'Moderate';
    statusTa = 'மத்திமம் (நிவர்த்தி உண்டு)';
    verdictEn = 'Both are born in Theipirai (Waning Moon), but early Krishna Paksha / Jupiter aspect / Moon dignity provides classical balance.';
    verdictTa = 'இருவரும் தேய்பிறையில் பிறந்தாலும், குரு பார்வை அல்லது சந்திர பலத்தால் தோஷ நிவர்த்தி கிடைக்கிறது.';
  } else {
    status = 'Needs Care';
    statusTa = 'கவனம் தேவை';
    verdictEn = 'Both are born in late Theipirai (Ksheena Chandra) — Emotional patience and Monday Shiva/Devi worship recommended.';
    verdictTa = 'இருவரும் தேய்பிறை இறுதி திதிகளில் பிறந்தவர்கள் — மன அமைதிக்கு திங்கட்கிழமை அம்பிகை/சிவன் வழிபாடு சிறந்தது.';
  }

  return {
    boy,
    girl,
    status,
    statusTa,
    verdictEn,
    verdictTa
  };
}

function evaluatePersonMarsVenus(grahas) {
  const rasiOf = (lon) => Math.floor(normalizeDeg(lon) / 30) % 12;
  const lagnaRasi = rasiOf(grahas.longitudes.ascendant);
  const moonRasi = grahas.rashis?.moon ?? rasiOf(grahas.longitudes.moon);
  const marsRasi = rasiOf(grahas.longitudes.mars);
  const venusRasi = rasiOf(grahas.longitudes.venus);
  const jupRasi = rasiOf(grahas.longitudes.jupiter);

  const marsHouse = ((marsRasi - lagnaRasi + 12) % 12) + 1;
  const venusHouse = ((venusRasi - lagnaRasi + 12) % 12) + 1;
  const marsHouseFromMoon = ((marsRasi - moonRasi + 12) % 12) + 1;
  const venusHouseFromMoon = ((venusRasi - moonRasi + 12) % 12) + 1;
  const marsDig = PLANET_DIGNITY_SIMPLE('mars', marsRasi);
  const venusDig = PLANET_DIGNITY_SIMPLE('venus', venusRasi);

  // Distance from Mars to Venus (1..12)
  const mvDist = ((venusRasi - marsRasi + 12) % 12) + 1;
  let relationEn = `Mars–Venus ${mvDist}/${14 - mvDist > 12 ? (14 - mvDist - 12) : (14 - mvDist)} Placement`;
  let relationTa = `செவ்வாய்–சுக்கிரன் ${mvDist}-ம் நிலை`;
  let relationTone = 'neutral';

  if (mvDist === 1) {
    relationEn = 'Conjunction (1/1 – Kuja-Sukra Yoga)';
    relationTa = 'சேர்க்கை (1/1 – செவ்வாய்–சுக்கிரன் யோகம்)';
    relationTone = 'intense';
  } else if (mvDist === 7) {
    relationEn = 'Mutual 7th Aspect (7/7 – Samasaptama)';
    relationTa = 'சமசப்தம பார்வை (7/7 நேர் பார்வை)';
    relationTone = 'harmonious';
  } else if (mvDist === 4 || mvDist === 8) {
    relationEn = `Mars ${mvDist}th Aspect on Venus`;
    relationTa = `சுக்கிரன் மீது செவ்வாயின் ${mvDist}-ம் பார்வை`;
    relationTone = mvDist === 8 ? 'sensitive' : 'intense';
  } else if (mvDist === 5 || mvDist === 9 || mvDist === 3 || mvDist === 11) {
    relationEn = `Harmonious ${mvDist}/${14 - mvDist} Alignment`;
    relationTa = `சுப ${mvDist}-ம் கோண இணக்கம்`;
    relationTone = 'harmonious';
  } else if (mvDist === 6 || mvDist === 2 || mvDist === 12) {
    relationEn = `Sensitive ${mvDist}/${14 - mvDist > 12 ? mvDist : (14 - mvDist)} Separation`;
    relationTa = `கவனிக்க வேண்டிய ${mvDist}-ம் பிரிவு நிலை`;
    relationTone = 'sensitive';
  }

  // Jupiter aspects 1st (0), 5th (+4), 7th (+6), and 9th (+8) signs forward from Jupiter
  const jupAspectVenus = [0, 4, 6, 8].includes((venusRasi - jupRasi + 12) % 12);
  const jupAspectMars = [0, 4, 6, 8].includes((marsRasi - jupRasi + 12) % 12);

  const computeBasisScore = (vHouse) => {
    let s = 55;
    if ([1, 2, 4, 5, 7, 9, 10, 11].includes(vHouse)) s += 14;
    else if ([6, 8, 12].includes(vHouse)) s -= 8;
    if (venusDig.key === 'utcha' || venusDig.key === 'aatchi') s += 12;
    else if (venusDig.key === 'neecha') s -= 10;

    if (marsDig.key === 'utcha' || marsDig.key === 'aatchi') s += 8;
    else if (marsDig.key === 'neecha') s -= 6;

    if (relationTone === 'harmonious') s += 10;
    else if (relationTone === 'sensitive') s -= 6;

    if (jupAspectVenus) s += 8;
    if (jupAspectMars) s += 5;
    return Math.max(30, Math.min(98, s));
  };

  const statusLabel = (s) => ({
    en: s >= 74 ? 'Strong' : s >= 55 ? 'Balanced' : 'Needs Care',
    ta: s >= 74 ? 'உத்தமம் (பலம்)' : s >= 55 ? 'மத்திமம் (சமநிலை)' : 'கவனம் தேவை',
  });

  const score = computeBasisScore(venusHouse);
  const lagnamSt = statusLabel(score);
  const rasiScore = computeBasisScore(venusHouseFromMoon);
  const rasiSt = statusLabel(rasiScore);

  return {
    lagnaRasi: RASHIS[lagnaRasi].name,
    lagnaRasiTa: RASHI_TA_NAMES[lagnaRasi],
    lagnaRasiIdx: lagnaRasi,
    moonRasi: RASHIS[moonRasi].name,
    moonRasiTa: RASHI_TA_NAMES[moonRasi],
    moonRasiIdx: moonRasi,
    marsRasi: RASHIS[marsRasi].name,
    marsRasiTa: RASHI_TA_NAMES[marsRasi],
    marsRasiIdx: marsRasi,
    marsHouse,
    marsHouseFromMoon,
    marsDignity: marsDig.en,
    marsDignityTa: marsDig.ta,
    venusRasi: RASHIS[venusRasi].name,
    venusRasiTa: RASHI_TA_NAMES[venusRasi],
    venusRasiIdx: venusRasi,
    venusHouse,
    venusHouseFromMoon,
    venusDignity: venusDig.en,
    venusDignityTa: venusDig.ta,
    relationEn,
    relationTa,
    relationTone,
    jupAspectVenus,
    jupAspectMars,
    score,
    status: lagnamSt.en,
    statusTa: lagnamSt.ta,
    rasiScore,
    rasiStatus: rasiSt.en,
    rasiStatusTa: rasiSt.ta,
    chartBoxes: buildSouthIndianChart(grahas, { isManglik: false, houses: { lagna: 1, moon: 1, venus: 1 } })
  };
}

function buildMarsVenusVerdict(combinedScore, isRasi) {
  if (combinedScore >= 72) {
    return isRasi
      ? {
          verdictEn: 'Harmonious Moon-Rasi Mars–Venus Alignment — Strong emotional bonding, mutual affection & joyful married life.',
          verdictTa: 'சிறந்த சந்திர ராசி செவ்வாய்–சுக்கிரன் இணக்கம் — மன ஒற்றுமை, அன்பு மற்றும் இனிய இல்லற வாழ்வு சிறப்பாக உள்ளது.'
        }
      : {
          verdictEn: 'Harmonious Mars–Venus (Kuja–Sukra) Alignment — Strong mutual attraction, affection & marital vitality.',
          verdictTa: 'சிறந்த செவ்வாய்–சுக்கிரன் இணக்கம் — அன்பு, ஈர்ப்பு மற்றும் இல்லற ஒற்றுமை சிறப்பாக உள்ளது.'
        };
  }
  if (combinedScore >= 55) {
    return isRasi
      ? {
          verdictEn: 'Balanced Moon-Rasi Mars–Venus Alignment — Steady emotional rapport and mutual respect.',
          verdictTa: 'சமநிலையான சந்திர ராசி செவ்வாய்–சுக்கிரன் அமைப்பு — சீரான மனப் புரிதலும் குடும்ப இணக்கமும் உண்டு.'
        }
      : {
          verdictEn: 'Balanced Mars–Venus Alignment — Good compatibility with mutual understanding and respect.',
          verdictTa: 'சமநிலையான செவ்வாய்–சுக்கிரன் அமைப்பு — பரஸ்பர புரிதலுடன் நல்ல இல்லற இணக்கம் உண்டு.'
        };
  }
  return isRasi
    ? {
        verdictEn: 'Sensitive Moon-Rasi Mars–Venus Placement — Mindful communication advised; Friday Mahalakshmi & Tuesday Murugan worship recommended.',
        verdictTa: 'கவனிக்க வேண்டிய சந்திர ராசி செவ்வாய்–சுக்கிரன் நிலை — அமைதியான உரையாடலுடன் வெள்ளி லட்சுமி & செவ்வாய் முருகன் வழிபாடு சிறந்தது.'
      }
    : {
        verdictEn: 'Sensitive Mars–Venus Placement — Temperament differences possible; Friday Mahalakshmi & Tuesday Murugan worship advised.',
        verdictTa: 'கவனிக்க வேண்டிய செவ்வாய்–சுக்கிரன் நிலை — மன ஒற்றுமைக்கு வெள்ளி லட்சுமி & செவ்வாய் முருகன் வழிபாடு சிறந்தது.'
      };
}

function calculateMarsVenusMatchAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);
  const boy = evaluatePersonMarsVenus(boyGrahas);
  const girl = evaluatePersonMarsVenus(girlGrahas);

  // Cross-couple resonance (Lagnam/Planet-to-Planet): Bride Venus <-> Groom Mars & Groom Venus <-> Bride Mars
  const brideVenToGroomMar = ((boy.marsRasiIdx - girl.venusRasiIdx + 12) % 12) + 1;
  const groomVenToBrideMar = ((girl.marsRasiIdx - boy.venusRasiIdx + 12) % 12) + 1;
  const isFavorableDist = (d) => [1, 3, 5, 7, 9, 11].includes(d);

  const cross1Good = isFavorableDist(brideVenToGroomMar);
  const cross2Good = isFavorableDist(groomVenToBrideMar);

  let combinedScore = Math.round((boy.score + girl.score) / 2);
  if (cross1Good) combinedScore += 4;
  if (cross2Good) combinedScore += 4;
  combinedScore = Math.max(30, Math.min(98, combinedScore));
  const lagnamVerdict = buildMarsVenusVerdict(combinedScore, false);

  // Rasi-based (Chandra Rasi) cross-couple resonance: Partner Venus & Mars houses from Moon Rasi
  const brideVenToGroomMoon = ((girl.venusRasiIdx - boy.moonRasiIdx + 12) % 12) + 1;
  const groomVenToBrideMoon = ((boy.venusRasiIdx - girl.moonRasiIdx + 12) % 12) + 1;
  const brideMarToGroomMoon = ((girl.marsRasiIdx - boy.moonRasiIdx + 12) % 12) + 1;
  const groomMarToBrideMoon = ((boy.marsRasiIdx - girl.moonRasiIdx + 12) % 12) + 1;
  const isFavorableFromMoon = (d) => [1, 2, 4, 5, 7, 9, 10, 11].includes(d);

  const crossVenGroomMoonGood = isFavorableFromMoon(brideVenToGroomMoon);
  const crossVenBrideMoonGood = isFavorableFromMoon(groomVenToBrideMoon);

  let rasiCombinedScore = Math.round((boy.rasiScore + girl.rasiScore) / 2);
  if (crossVenGroomMoonGood) rasiCombinedScore += 4;
  if (crossVenBrideMoonGood) rasiCombinedScore += 4;
  rasiCombinedScore = Math.max(30, Math.min(98, rasiCombinedScore));
  const rasiVerdict = buildMarsVenusVerdict(rasiCombinedScore, true);

  return {
    boy,
    girl,
    brideVenToGroomMar,
    groomVenToBrideMar,
    cross1Good,
    cross2Good,
    combinedScore,
    verdictEn: lagnamVerdict.verdictEn,
    verdictTa: lagnamVerdict.verdictTa,
    rasiAnalysis: {
      brideVenToGroomMoon,
      groomVenToBrideMoon,
      brideMarToGroomMoon,
      groomMarToBrideMoon,
      crossVenGroomMoonGood,
      crossVenBrideMoonGood,
      combinedScore: rasiCombinedScore,
      verdictEn: rasiVerdict.verdictEn,
      verdictTa: rasiVerdict.verdictTa
    }
  };
}

/**
 * Section 8: Shashtashtagam (6/8 Rasi, Lagnam & Navamsa D9 Dosha + Cancellation Rules) Analysis
 */
const PLANET_FRIENDS_SIMPLE = {
  Sun:     { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  Moon:    { friends: ['Sun', 'Mercury'], enemies: [] },
  Mars:    { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  Venus:   { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  Saturn:  { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] },
};

function evaluateLordRelation(lordA, lordB) {
  if (!lordA || !lordB) {
    return { key: 'neutral', en: 'Neutral', ta: 'சமம்', isFriendlyOrSame: false };
  }
  if (lordA === lordB) {
    return { key: 'same', en: 'Same Lord (Strong)', ta: 'ஒரே அதிபதி (உத்தமம்)', isFriendlyOrSame: true };
  }
  const fA = PLANET_FRIENDS_SIMPLE[lordA] || { friends: [], enemies: [] };
  const fB = PLANET_FRIENDS_SIMPLE[lordB] || { friends: [], enemies: [] };
  const aFrB = fA.friends.includes(lordB);
  const bFrA = fB.friends.includes(lordA);
  const aEnB = fA.enemies.includes(lordB);
  const bEnA = fB.enemies.includes(lordA);

  if (aFrB && bFrA) {
    return { key: 'mutual_friend', en: 'Mutual Friends', ta: 'பரஸ்பர நட்பு', isFriendlyOrSame: true };
  }
  if ((aFrB && !bEnA) || (bFrA && !aEnB)) {
    return { key: 'friendly', en: 'Friendly', ta: 'நட்பு', isFriendlyOrSame: true };
  }
  if (aEnB && bEnA) {
    return { key: 'enemy', en: 'Mutual Enemies', ta: 'பரஸ்பர பகை', isFriendlyOrSame: false };
  }
  return { key: 'neutral', en: 'Mixed / Neutral', ta: 'சமம் / கலப்பு', isFriendlyOrSame: false };
}

function getNavamsaSignIndex(sidLon) {
  const deg = normalizeDeg(sidLon);
  const d1 = Math.floor(deg / 30) % 12;
  const padaInSign = Math.floor((deg % 30) / (30 / 9));
  const startSign = [0, 9, 6, 3][d1 % 4];
  return (startSign + padaInSign) % 12;
}

const SUBHA_SHASHTASHTAKAM_PAIRS = [
  [0, 7], [7, 0],   // Aries <-> Scorpio
  [1, 6], [6, 1],   // Taurus <-> Libra
  [2, 9], [9, 2],   // Gemini <-> Capricorn
  [3, 8], [8, 3],   // Cancer <-> Sagittarius
  [4, 11], [11, 4], // Leo <-> Pisces
];

function evaluateShashtashtagamAxis(boyIdx, girlIdx, axisId) {
  const brideToGroom = ((boyIdx - girlIdx + 12) % 12) + 1;
  const groomToBride = ((girlIdx - boyIdx + 12) % 12) + 1;

  const boyRasi = RASHIS[boyIdx]?.name || 'Mesha';
  const boyRasiTa = RASHI_TA_NAMES[boyIdx] || boyRasi;
  const girlRasi = RASHIS[girlIdx]?.name || 'Mesha';
  const girlRasiTa = RASHI_TA_NAMES[girlIdx] || girlRasi;

  const boyLord = RASHIS[boyIdx]?.lord || 'Mars';
  const girlLord = RASHIS[girlIdx]?.lord || 'Mars';
  const lordRel = evaluateLordRelation(boyLord, girlLord);

  const is68 = brideToGroom === 6 || brideToGroom === 8;
  const is212 = brideToGroom === 2 || brideToGroom === 12;
  const isSubhaPair = is68 && SUBHA_SHASHTASHTAKAM_PAIRS.some(([b, g]) => boyIdx === b && girlIdx === g);

  let status = 'favorable';
  let statusEn = 'No 6/8 Dosha (Favorable)';
  let statusTa = 'ஷஷ்டாஷ்டகம் இல்லை (நல்லது)';

  if (isSubhaPair) {
    status = 'subha';
    statusEn = 'Subha Shashtashtakam (Auspicious 6/8 Exemption)';
    statusTa = 'சுப ஷஷ்டாஷ்டகம் (நற்பொருத்தம்)';
  } else if (is68 && lordRel.isFriendlyOrSame) {
    status = 'mitigated';
    statusEn = '6/8 Mitigated by Friendly Lords';
    statusTa = 'அதிபதி நட்பால் 6/8 தோஷம் தணிவு';
  } else if (is68) {
    status = 'asubha';
    statusEn = 'Asubha Shashtashtakam (6/8 Mismatch)';
    statusTa = 'அசுப ஷஷ்டாஷ்டகம் (6/8 தோஷம்)';
  } else if (is212) {
    status = 'dwidwadasam';
    statusEn = 'Dwidwadasam (2/12 Placement)';
    statusTa = 'துவித்வாதசம் (2/12 அமைப்பு)';
  }

  return {
    axisId,
    boyIdx,
    girlIdx,
    boyRasi,
    boyRasiTa,
    girlRasi,
    girlRasiTa,
    boyLord,
    girlLord,
    lordRel,
    brideToGroom,
    groomToBride,
    is68,
    is212,
    isSubhaPair,
    status,
    statusEn,
    statusTa
  };
}

function calculateShashtashtagamAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);

  const buildPersonSummary = (g) => {
    const moonIdx = g.rashis.moon;
    const lagnaIdx = g.rashis.lagna;
    const jupIdx = g.rashis.jupiter;
    const navamsaMoonIdx = getNavamsaSignIndex(g.longitudes.moon);
    const navamsaLagnaIdx = getNavamsaSignIndex(g.longitudes.ascendant);
    return {
      moonRasiIdx: moonIdx,
      moonRasi: RASHIS[moonIdx].name,
      moonRasiTa: RASHI_TA_NAMES[moonIdx],
      moonLord: RASHIS[moonIdx].lord,
      lagnaRasiIdx: lagnaIdx,
      lagnaRasi: RASHIS[lagnaIdx].name,
      lagnaRasiTa: RASHI_TA_NAMES[lagnaIdx],
      lagnaLord: RASHIS[lagnaIdx].lord,
      navamsaMoonIdx,
      navamsaMoonRasi: RASHIS[navamsaMoonIdx].name,
      navamsaMoonRasiTa: RASHI_TA_NAMES[navamsaMoonIdx],
      navamsaLagnaIdx,
      jupAspectsMoon: [0, 4, 6, 8].includes((moonIdx - jupIdx + 12) % 12),
      jupAspectsLagna: [0, 4, 6, 8].includes((lagnaIdx - jupIdx + 12) % 12),
      chartBoxes: buildSouthIndianChart(g, { isManglik: false, houses: { lagna: 1, moon: 1, venus: 1 } })
    };
  };

  const boy = buildPersonSummary(boyGrahas);
  const girl = buildPersonSummary(girlGrahas);

  const rasiAxis = evaluateShashtashtagamAxis(boy.moonRasiIdx, girl.moonRasiIdx, 'rasi');
  const lagnaAxis = evaluateShashtashtagamAxis(boy.lagnaRasiIdx, girl.lagnaRasiIdx, 'lagna');
  const navamsaAxis = evaluateShashtashtagamAxis(boy.navamsaMoonIdx, girl.navamsaMoonIdx, 'navamsa');

  // Cancellation (Bhanga) checklist
  const cancellations = [
    {
      id: 'lord_friendship',
      active: rasiAxis.lordRel.isFriendlyOrSame,
      labelEn: 'Rasi Lords Same / Mutual Friends (Rasi Adhipathi)',
      labelTa: 'ராசி அதிபதிகள் ஒரே கிரகம் அல்லது நட்பு'
    },
    {
      id: 'lagna_clear',
      active: lagnaAxis.status !== 'asubha',
      labelEn: 'Janma Lagnam Free from Asubha 6/8 Dosha',
      labelTa: 'ஜன்ம லக்னத்தில் அசுப ஷஷ்டாஷ்டகம் இல்லை'
    },
    {
      id: 'navamsa_harmony',
      active: navamsaAxis.status === 'favorable' || navamsaAxis.status === 'subha' || navamsaAxis.lordRel.isFriendlyOrSame,
      labelEn: 'Navamsa (D9) Moon Rasi Alignment Favorable',
      labelTa: 'நவாம்ச (D9) சந்திர ராசி இணக்கம் சாதகமாக உள்ளது'
    },
    {
      id: 'jupiter_grace',
      active: boy.jupAspectsMoon || girl.jupAspectsMoon || boy.jupAspectsLagna || girl.jupAspectsLagna,
      labelEn: 'Benefic Jupiter Aspect on Moon / Lagnam',
      labelTa: 'சந்திரன் அல்லது லக்னம் மீது குரு பார்வை (சுப பலம்)'
    },
    {
      id: 'nadi_diff',
      active: (boyGrahas.starObj?.nadi && girlGrahas.starObj?.nadi && boyGrahas.starObj.nadi !== girlGrahas.starObj.nadi) || false,
      labelEn: 'Distinct Nadi Support (Physiological Balance)',
      labelTa: 'நாடி வேறுபாடு (உடல் நல சமநிலை ஆதரவு)'
    }
  ];

  const activeCancelCount = cancellations.filter((c) => c.active).length;

  let overallStatus = 'clear';
  let statusLabelEn = 'Clear — No Shashtashtagam Dosha';
  let statusLabelTa = 'சுபம் — ஷஷ்டாஷ்டக தோஷம் இல்லை';
  let score = 88;
  let verdictEn = '';
  let verdictTa = '';

  if (rasiAxis.isSubhaPair) {
    overallStatus = 'subha';
    statusLabelEn = 'Subha Shashtashtakam (Auspicious Exemption)';
    statusLabelTa = 'சுப ஷஷ்டாஷ்டகம் (நற்பொருத்தம்)';
    score = Math.min(94, 78 + activeCancelCount * 3);
    verdictEn = `Moon Rasis are 6/8 (${rasiAxis.girlRasi} ↔ ${rasiAxis.boyRasi}), but Deva Keralam grants Subha Shashtashtakam exemption due to lord harmony (${rasiAxis.lordRel.en}).`;
    verdictTa = `மணமகள்–மணமகன் ராசிகள் 6/8 நிலையில் (${rasiAxis.girlRasiTa} ↔ ${rasiAxis.boyRasiTa}) இருந்தாலும், தேவகேரளம் விதிப்படி சுப ஷஷ்டாஷ்டகமாக உத்தம பலன் தரும்.`;
  } else if (rasiAxis.is68) {
    if (activeCancelCount >= 3 || (rasiAxis.lordRel.isFriendlyOrSame && lagnaAxis.status !== 'asubha')) {
      overallStatus = 'cancelled';
      statusLabelEn = '6/8 Dosha Mitigated / Cancelled (Bhanga)';
      statusLabelTa = 'ஷஷ்டாஷ்டக தோஷம் நிவர்த்தி (பங்கம்)';
      score = Math.min(78, 56 + activeCancelCount * 5);
      verdictEn = `Moon Rasi shows 6/8 spacing (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}), but ${activeCancelCount} classical cancellation factors neutralize friction and support stability.`;
      verdictTa = `ராசியில் 6/8 நிலை (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}) இருந்தாலும், ${activeCancelCount} சாஸ்திர நிவர்த்தி காரணிகள் தோஷத்தைத் தணிக்கின்றன.`;
    } else {
      overallStatus = 'dosha';
      statusLabelEn = 'Asubha Shashtashtakam Present — Care Needed';
      statusLabelTa = 'அசுப ஷஷ்டாஷ்டகம் — கவனம் & பரிகாரம் தேவை';
      score = Math.max(36, 42 + activeCancelCount * 4 - (lagnaAxis.status === 'asubha' ? 6 : 0));
      verdictEn = `Moon Rasis stand in 6/8 (${rasiAxis.girlRasi} ↔ ${rasiAxis.boyRasi}) with ${rasiAxis.lordRel.en} lordship. Detailed astrologer review & Shiva-Parvati / Navagraha pariharam advised.`;
      verdictTa = `ராசிகள் 6/8 அசுப ஷஷ்டாஷ்டகத்தில் (${rasiAxis.girlRasiTa} ↔ ${rasiAxis.boyRasiTa}) உள்ளதால் தசாசந்தி & ஜாதக பலம் சரிபார்த்து பரிகாரம் செய்வது நன்று.`;
    }
  } else if (rasiAxis.is212) {
    if (lagnaAxis.status === 'asubha') {
      overallStatus = 'cancelled';
      statusLabelEn = '2/12 in Rasi (6/8 in Lagnam)';
      statusLabelTa = 'ராசியில் 2/12 (லக்னத்தில் 6/8)';
      score = 58;
      verdictEn = 'Moon Rasis are 2/12 while Janma Lagnams stand 6/8; look at lord friendship and Navamsa strength for final balance.';
      verdictTa = 'சந்திர ராசி 2/12 அமைப்பிலும் ஜன்ம லக்னம் 6/8 அமைப்பிலும் உள்ளது; நவாம்ச பலம் கொண்டு முடிவு எடுக்கவும்.';
    } else {
      overallStatus = 'dwidwadasam';
      statusLabelEn = 'No 6/8 Dosha (Dwidwadasam 2/12)';
      statusLabelTa = '6/8 இல்லை (துவித்வாதசம் 2/12)';
      score = Math.min(76, 62 + activeCancelCount * 3);
      verdictEn = `No 6/8 Shashtashtagam in Moon Rasi; gentle 2/12 spacing (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}) balances smoothly when lords/Navamsa align.`;
      verdictTa = 'சந்திர ராசியில் 6/8 ஷஷ்டாஷ்டகம் இல்லை; 2/12 நிலை அதிபதி நட்பால் சமநிலை பெறும்.';
    }
  } else {
    if (lagnaAxis.status === 'asubha') {
      overallStatus = 'cancelled';
      statusLabelEn = 'Rasi Clear (Lagna 6/8 Present)';
      statusLabelTa = 'ராசி சுபம் (லக்னத்தில் 6/8)';
      score = 74;
      verdictEn = `Moon Rasis (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}) are completely free from Shashtashtagam! Only Janma Lagnam sits 6/8, which carries lighter weight when Moon & D9 agree.`;
      verdictTa = `சந்திர ராசிகள் (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}) ஷஷ்டாஷ்டக தோஷமற்றவை! லக்ன 6/8 அமைப்பை ராசிப் பொருத்தம் சமநிலை செய்கிறது.`;
    } else {
      overallStatus = 'clear';
      statusLabelEn = 'Clear — No Shashtashtagam Dosha';
      statusLabelTa = 'சுபம் — ஷஷ்டாஷ்டக தோஷம் இல்லை';
      score = Math.min(96, 82 + activeCancelCount * 3);
      verdictEn = `Both Moon Rasi (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}) and Janma Lagnam (${lagnaAxis.brideToGroom}/${lagnaAxis.groomToBride}) are completely free from 6/8 Shashtashtagam conflict.`;
      verdictTa = `சந்திர ராசி (${rasiAxis.brideToGroom}/${rasiAxis.groomToBride}) மற்றும் ஜன்ம லக்னம் (${lagnaAxis.brideToGroom}/${lagnaAxis.groomToBride}) இரண்டிலும் 6/8 ஷஷ்டாஷ்டக தோஷம் இல்லை.`;
    }
  }

  return {
    boy,
    girl,
    rasiAxis,
    lagnaAxis,
    navamsaAxis,
    cancellations,
    activeCancelCount,
    overallStatus,
    statusLabelEn,
    statusLabelTa,
    score,
    verdictEn,
    verdictTa
  };
}

/**
 * Section 9: Chandran (Moon) Compatibility, Yogas & Mental Harmony Analysis
 */
function evaluatePersonChandran(grahas) {
  const rasiOf = (lon) => Math.floor(normalizeDeg(lon) / 30) % 12;
  const lagnaIdx = grahas.rashis.lagna;
  const moonIdx = grahas.rashis.moon;
  const marsIdx = grahas.rashis.mars;
  const merIdx = grahas.rashis.mercury;
  const jupIdx = grahas.rashis.jupiter;
  const venIdx = grahas.rashis.venus;
  const satIdx = grahas.rashis.saturn;
  const rahuIdx = grahas.rashis.rahu;
  const ketuIdx = grahas.rashis.ketu;

  const moonLon = grahas.longitudes.astroMoon ?? grahas.longitudes.moon;
  const sunLon = grahas.longitudes.sun;
  const diff = normalizeDeg(moonLon - sunLon);
  const tithiNum = (Math.floor(diff / 12) % 30) + 1;
  const isValarpirai = tithiNum <= 15;
  const illuminationPct = Math.round(((1 - Math.cos((diff * Math.PI) / 180)) / 2) * 100);

  const moonHouseFromLagna = ((moonIdx - lagnaIdx + 12) % 12) + 1;
  const moonDig = PLANET_DIGNITY_SIMPLE('moon', moonIdx);

  // Neechabhanga check if Moon is debilitated in Scorpio (idx 7)
  const marsFromMoon = ((marsIdx - moonIdx + 12) % 12) + 1;
  const marsFromLagna = ((marsIdx - lagnaIdx + 12) % 12) + 1;
  const venFromMoon = ((venIdx - moonIdx + 12) % 12) + 1;
  const isNeechabhanga = moonDig.key === 'neecha' && (
    [1, 4, 7, 10].includes(marsFromMoon) ||
    [1, 4, 7, 10].includes(marsFromLagna) ||
    marsIdx === 9 || // Mars exalted
    [1, 4, 7, 10].includes(venFromMoon) // Taurus lord Venus in Kendra from Moon
  );

  // Navamsa (D9) Moon
  const d9MoonIdx = getNavamsaSignIndex(moonLon);
  const d9Dig = PLANET_DIGNITY_SIMPLE('moon', d9MoonIdx);

  // Classical Moon Yogas & Doshas
  const jupFromMoon = ((jupIdx - moonIdx + 12) % 12) + 1;
  const gajakesariYoga = [1, 4, 7, 10].includes(jupFromMoon);
  const jupAspectsMoon = [0, 4, 6, 8].includes((moonIdx - jupIdx + 12) % 12);
  const chandraMangalaYoga = marsFromMoon === 1 || marsFromMoon === 7;

  // Kemadruma check (no physical planet other than Sun/Rahu/Ketu in 2nd or 12th from Moon)
  const otherPlanets = [marsIdx, merIdx, jupIdx, venIdx, satIdx];
  const has2ndOr12thFromMoon = otherPlanets.some((p) => {
    const h = ((p - moonIdx + 12) % 12) + 1;
    return h === 2 || h === 12;
  });
  const hasKendraFromMoonOrLagna = [marsIdx, merIdx, jupIdx, venIdx, satIdx].some((p) => {
    const hM = ((p - moonIdx + 12) % 12) + 1;
    const hL = ((p - lagnaIdx + 12) % 12) + 1;
    return [1, 4, 7, 10].includes(hM) || [1, 4, 7, 10].includes(hL);
  });
  const kemadrumaStatus = has2ndOr12thFromMoon
    ? 'supported'
    : hasKendraFromMoonOrLagna
    ? 'cancelled'
    : 'active';

  // Punarphoo (Saturn conjunct/aspecting Moon: 1st, 3rd, 7th, 10th forward from Saturn)
  const punarphooDosha = [0, 2, 6, 9].includes((moonIdx - satIdx + 12) % 12);
  // Chandra-Rahu/Ketu Grahan association
  const grahanYoga = moonIdx === rahuIdx || moonIdx === ketuIdx;

  // Compute Chandran score [32..98]
  let score = 58;
  if (moonDig.key === 'utcha' || moonDig.key === 'aatchi') score += 14;
  else if (isNeechabhanga) score += 6;
  else if (moonDig.key === 'neecha') score -= 10;

  if (isValarpirai || illuminationPct >= 45) score += 8;
  else if (illuminationPct < 20) score -= 5;

  if ([1, 4, 5, 7, 9, 10, 11].includes(moonHouseFromLagna)) score += 7;
  else if ([6, 8, 12].includes(moonHouseFromLagna)) score -= 6;

  if (gajakesariYoga) score += 10;
  else if (jupAspectsMoon) score += 6;
  if (chandraMangalaYoga) score += 4;
  if (kemadrumaStatus === 'active') score -= 8;
  if (punarphooDosha) score -= 5;
  if (grahanYoga) score -= 6;

  score = Math.max(32, Math.min(98, score));
  const status = score >= 74 ? 'Strong' : score >= 55 ? 'Balanced' : 'Needs Care';
  const statusTa = score >= 74 ? 'உத்தமம் (பலம்)' : score >= 55 ? 'மத்திமம் (சமநிலை)' : 'கவனம் தேவை';

  const yogas = [
    {
      id: 'gajakesari',
      active: gajakesariYoga,
      tone: 'good',
      en: gajakesariYoga ? 'Gajakesari Yoga (Wisdom & Grace)' : 'No Gajakesari Yoga',
      ta: gajakesariYoga ? 'கஜகேசரி யோகம் (அறிவு & செல்வம்)' : 'கஜகேசரி யோகம் இல்லை'
    },
    {
      id: 'chandra_mangala',
      active: chandraMangalaYoga,
      tone: 'good',
      en: chandraMangalaYoga ? 'Chandra–Mangala Yoga (Vitality)' : 'No Chandra–Mangala Yoga',
      ta: chandraMangalaYoga ? 'சந்திர–மங்கள யோகம் (உறுதி & வளம்)' : 'சந்திர–மங்கள யோகம் இல்லை'
    },
    {
      id: 'kemadruma',
      active: kemadrumaStatus !== 'supported',
      tone: kemadrumaStatus === 'active' ? 'warn' : 'good',
      en:
        kemadrumaStatus === 'supported'
          ? 'Moon Flanked (Sunafa/Anafa Support)'
          : kemadrumaStatus === 'cancelled'
          ? 'Kemadruma Cancelled (Kendra Bhanga)'
          : 'Kemadruma Sensitivity (Needs Care)',
      ta:
        kemadrumaStatus === 'supported'
          ? 'சந்திரனுக்கு 2/12 கிரக பலம் (சுனபா/அனபா)'
          : kemadrumaStatus === 'cancelled'
          ? 'கேமதுரும தோஷம் நிவர்த்தி (கேந்திர பங்கம்)'
          : 'கேமதுரும அமைப்பு (மனத் தனிமை கவனம்)'
    },
    {
      id: 'punarphoo',
      active: punarphooDosha,
      tone: punarphooDosha ? 'warn' : 'good',
      en: punarphooDosha ? 'Punarphoo (Saturn–Moon Aspect)' : 'Free from Punarphoo',
      ta: punarphooDosha ? 'புனர்பூ தோஷம் (சனி–சந்திரன் தொடர்பு)' : 'புனர்பூ தோஷம் இல்லை'
    },
    {
      id: 'grahan',
      active: grahanYoga,
      tone: grahanYoga ? 'warn' : 'good',
      en: grahanYoga ? 'Chandra–Rahu/Ketu Grahan Association' : 'Moon Free from Eclipse Axis',
      ta: grahanYoga ? 'சந்திர கிரகண அமைப்பு (ராகு/கேது சேர்க்கை)' : 'ராகு/கேது கிரகண தொடர்பு இல்லை'
    }
  ];

  const dignityEn = isNeechabhanga ? 'Neechabhanga (Debility Cancelled)' : moonDig.en;
  const dignityTa = isNeechabhanga ? 'நீசபங்கம் (தோஷ நிவர்த்தி)' : moonDig.ta;

  return {
    moonRasiIdx: moonIdx,
    moonRasi: RASHIS[moonIdx].name,
    moonRasiTa: RASHI_TA_NAMES[moonIdx],
    lagnaRasiIdx: lagnaIdx,
    lagnaRasi: RASHIS[lagnaIdx].name,
    lagnaRasiTa: RASHI_TA_NAMES[lagnaIdx],
    moonHouseFromLagna,
    dignityEn,
    dignityTa,
    dignityKey: moonDig.key,
    isNeechabhanga,
    isValarpirai,
    illuminationPct,
    d9MoonIdx,
    d9MoonRasi: RASHIS[d9MoonIdx].name,
    d9MoonRasiTa: RASHI_TA_NAMES[d9MoonIdx],
    d9DignityEn: d9Dig.en,
    d9DignityTa: d9Dig.ta,
    gajakesariYoga,
    jupAspectsMoon,
    chandraMangalaYoga,
    kemadrumaStatus,
    punarphooDosha,
    grahanYoga,
    yogas,
    score,
    status,
    statusTa,
    chartBoxes: buildSouthIndianChart(grahas, { isManglik: false, houses: { lagna: 1, moon: 1, venus: 1 } })
  };
}

function calculateChandranMatchAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);
  const boy = evaluatePersonChandran(boyGrahas);
  const girl = evaluatePersonChandran(girlGrahas);

  // Couple Moon-to-Moon & Moon-to-Partner Lagnam
  const moonToMoon = ((boy.moonRasiIdx - girl.moonRasiIdx + 12) % 12) + 1;
  const isFavorableHouse = (h) => [1, 3, 4, 5, 7, 9, 10, 11].includes(h);
  const moonToMoonGood = isFavorableHouse(moonToMoon);

  const brideMoonInGroomLagna = ((girl.moonRasiIdx - boy.lagnaRasiIdx + 12) % 12) + 1;
  const groomMoonInBrideLagna = ((boy.moonRasiIdx - girl.lagnaRasiIdx + 12) % 12) + 1;
  const crossMoonLagnaGood = isFavorableHouse(brideMoonInGroomLagna) && isFavorableHouse(groomMoonInBrideLagna);

  const d9MoonDist = ((boy.d9MoonIdx - girl.d9MoonIdx + 12) % 12) + 1;
  const d9MoonRel = evaluateLordRelation(RASHIS[boy.d9MoonIdx]?.lord, RASHIS[girl.d9MoonIdx]?.lord);
  const d9HarmonyGood = isFavorableHouse(d9MoonDist) || d9MoonRel.isFriendlyOrSame;

  let combinedScore = Math.round((boy.score + girl.score) / 2);
  if (moonToMoonGood) combinedScore += 5;
  else combinedScore -= 4;
  if (crossMoonLagnaGood) combinedScore += 4;
  if (d9HarmonyGood) combinedScore += 4;
  combinedScore = Math.max(32, Math.min(98, combinedScore));

  let verdictEn = '';
  let verdictTa = '';
  if (combinedScore >= 74) {
    verdictEn = 'Harmonious Chandran Alignment — Deep emotional empathy, mental peace & affectionate companionship.';
    verdictTa = 'உத்தம சந்திர பலம் & மன இணக்கம் — ஆழமான மனப் புரிதல், குடும்ப அமைதி மற்றும் அன்பு சிறப்பாக உள்ளது.';
  } else if (combinedScore >= 56) {
    verdictEn = 'Balanced Chandran Placement — Steady mental rapport with mutual care and supportive Dasha timing.';
    verdictTa = 'சமநிலையான சந்திர அமைப்பு — பரஸ்பர அன்பும் நிதானமான மனப் புரிதலும் குடும்பத்தை வழிநடத்தும்.';
  } else {
    verdictEn = 'Sensitive Chandran Alignment — Emotional patience advised; Monday Shiva–Parameshwari & Pournami worship recommended.';
    verdictTa = 'கவனிக்க வேண்டிய சந்திர நிலை — மன அமைதிக்கு திங்கட்கிழமை சிவன்–பார்வதி & பௌர்ணமி வழிபாடு சிறந்தது.';
  }

  return {
    boy,
    girl,
    moonToMoon,
    moonToMoonGood,
    brideMoonInGroomLagna,
    groomMoonInBrideLagna,
    crossMoonLagnaGood,
    d9MoonDist,
    d9MoonRel,
    d9HarmonyGood,
    combinedScore,
    verdictEn,
    verdictTa
  };
}

/**
 * Section 10: Guru (Jupiter) Bala, Guru Paarvai, Yogas & Gochara Transit Analysis
 */
function getCurrentTransitJupiterRasi() {
  try {
    const nowTime = Astronomy.MakeTime(new Date());
    const T = nowTime.tt / 36525.0;
    const tilt = Astronomy.e_tilt(nowTime);
    const ayanamsha = normalizeDeg(23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600.0 + tilt.dpsi / 3600.0);
    const jupSid = normalizeDeg(Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Jupiter, nowTime, true)).elon - ayanamsha);
    return Math.floor(jupSid / 30) % 12;
  } catch {
    return 3;
  }
}

function evaluatePersonGuru(grahas, transitJupIdx) {
  const lagnaIdx = grahas.rashis.lagna;
  const moonIdx = grahas.rashis.moon;
  const jupIdx = grahas.rashis.jupiter;
  const venIdx = grahas.rashis.venus;
  const marsIdx = grahas.rashis.mars;
  const satIdx = grahas.rashis.saturn;
  const rahuIdx = grahas.rashis.rahu;
  const ketuIdx = grahas.rashis.ketu;

  const jupHouseFromLagna = ((jupIdx - lagnaIdx + 12) % 12) + 1;
  const jupHouseFromMoon = ((jupIdx - moonIdx + 12) % 12) + 1;
  const jupDig = PLANET_DIGNITY_SIMPLE('jupiter', jupIdx);

  // Neechabhanga check if Jupiter is debilitated in Capricorn (idx 9)
  const satFromLagna = ((satIdx - lagnaIdx + 12) % 12) + 1;
  const satFromMoon = ((satIdx - moonIdx + 12) % 12) + 1;
  const marsFromLagna = ((marsIdx - lagnaIdx + 12) % 12) + 1;
  const moonFromLagna = ((moonIdx - lagnaIdx + 12) % 12) + 1;
  const isNeechabhanga = jupDig.key === 'neecha' && (
    [1, 4, 7, 10].includes(satFromLagna) ||
    [1, 4, 7, 10].includes(satFromMoon) ||
    satIdx === 6 || satIdx === 9 || satIdx === 10 || // Saturn exalted or own
    [1, 4, 7, 10].includes(marsFromLagna) ||
    [1, 4, 7, 10].includes(moonFromLagna)
  );

  // Navamsa (D9) Jupiter
  const d9JupIdx = getNavamsaSignIndex(grahas.longitudes.jupiter);
  const d9Dig = PLANET_DIGNITY_SIMPLE('jupiter', d9JupIdx);

  // Guru Paarvai (Conjunct 1st, 5th, 7th, 9th aspects forward from Guru)
  const hasGuruSight = (targetIdx) => [0, 4, 6, 8].includes((targetIdx - jupIdx + 12) % 12);
  const aspectsLagna = hasGuruSight(lagnaIdx);
  const aspects2nd = hasGuruSight((lagnaIdx + 1) % 12);
  const aspects5th = hasGuruSight((lagnaIdx + 4) % 12);
  const aspects7th = hasGuruSight((lagnaIdx + 6) % 12);
  const aspectsMoon = hasGuruSight(moonIdx);
  const aspectsVenus = hasGuruSight(venusIdxSafe(venIdx));

  function venusIdxSafe(v) {
    return typeof v === 'number' ? v : 0;
  }

  const blessedTargets = [];
  if (aspectsLagna) blessedTargets.push({ en: 'Lagnam (Self)', ta: 'லக்னம்' });
  if (aspects2nd) blessedTargets.push({ en: '2nd Family House', ta: '2-ம் குடும்பம்' });
  if (aspects5th) blessedTargets.push({ en: '5th Progeny House', ta: '5-ம் புத்திர ஸ்தானம்' });
  if (aspects7th) blessedTargets.push({ en: '7th Marriage House', ta: '7-ம் களத்திரம்' });
  if (aspectsMoon) blessedTargets.push({ en: 'Moon (Mind)', ta: 'சந்திரன்' });
  if (aspectsVenus) blessedTargets.push({ en: 'Venus (Spouse)', ta: 'சுக்கிரன்' });

  // Classical Yogas & Dosha Checks
  const hamsaYoga = [1, 4, 7, 10].includes(jupHouseFromLagna) && (jupDig.key === 'utcha' || jupDig.key === 'aatchi');
  const gajakesariYoga = [1, 4, 7, 10].includes(jupHouseFromMoon);
  const guruMangalaYoga = hasGuruSight(marsIdx);
  const guruChandalaYoga = jupIdx === rahuIdx || jupIdx === ketuIdx;
  const kendradhipati = [2, 5, 8, 11].includes(lagnaIdx);

  // Live Gochara Guru Balam (Transit Jupiter in 2, 5, 7, 9, 11 from Natal Moon Rasi)
  const transitHouseFromMoon = ((transitJupIdx - moonIdx + 12) % 12) + 1;
  const hasGocharaGuruBalam = [2, 5, 7, 9, 11].includes(transitHouseFromMoon);

  let score = 56;
  if (jupDig.key === 'utcha' || jupDig.key === 'aatchi') score += 15;
  else if (isNeechabhanga) score += 7;
  else if (jupDig.key === 'neecha') score -= 9;

  if ([1, 2, 4, 5, 7, 9, 10, 11].includes(jupHouseFromLagna)) score += 9;
  else if ([6, 8, 12].includes(jupHouseFromLagna)) score -= 6;

  if (hamsaYoga) score += 8;
  if (gajakesariYoga) score += 5;
  if (aspects7th) score += 6;
  if (aspectsMoon || aspectsVenus) score += 4;
  if (guruChandalaYoga) score -= 7;

  score = Math.max(32, Math.min(98, score));
  const status = score >= 74 ? 'Strong' : score >= 55 ? 'Balanced' : 'Needs Care';
  const statusTa = score >= 74 ? 'உத்தமம் (குரு பலம்)' : score >= 55 ? 'மத்திமம் (சமநிலை)' : 'கவனம் தேவை';

  const yogas = [
    {
      id: 'hamsa',
      active: hamsaYoga,
      tone: hamsaYoga ? 'good' : 'neutral',
      en: hamsaYoga ? 'Hamsa Mahapurusha Yoga' : 'No Hamsa Yoga',
      ta: hamsaYoga ? 'ஹம்ச மகாபுருஷ யோகம் (மிகச் சிறப்பு)' : 'ஹம்ச யோகம் இல்லை'
    },
    {
      id: 'gajakesari',
      active: gajakesariYoga,
      tone: gajakesariYoga ? 'good' : 'neutral',
      en: gajakesariYoga ? 'Gajakesari Yoga' : 'No Gajakesari Yoga',
      ta: gajakesariYoga ? 'கஜகேசரி யோகம்' : 'கஜகேசரி யோகம் இல்லை'
    },
    {
      id: 'guru_mangala',
      active: guruMangalaYoga,
      tone: guruMangalaYoga ? 'good' : 'neutral',
      en: guruMangalaYoga ? 'Guru–Mangala Yoga' : 'No Guru–Mangala Yoga',
      ta: guruMangalaYoga ? 'குரு–மங்கள யோகம்' : 'குரு–மங்கள யோகம் இல்லை'
    },
    {
      id: 'guru_chandala',
      active: guruChandalaYoga,
      tone: guruChandalaYoga ? 'warn' : 'good',
      en: guruChandalaYoga ? 'Guru–Chandala Yoga (Rahu/Ketu)' : 'Pure Guru (Free from Nodal Axis)',
      ta: guruChandalaYoga ? 'குரு–சண்டாள யோகம் (ராகு/கேது சேர்க்கை)' : 'ராகு/கேது கலப்பற்ற சுத்த குரு'
    },
    {
      id: 'kendradhipati',
      active: kendradhipati,
      tone: kendradhipati ? 'warn' : 'good',
      en: kendradhipati ? 'Kendradhipati Lagna Notice' : 'No Kendradhipati Dosha',
      ta: kendradhipati ? 'கேந்திராதிபத்திய நிலை (உபய லக்னம்)' : 'கேந்திராதிபத்திய தோஷம் இல்லை'
    }
  ];

  const dignityEn = isNeechabhanga ? 'Neechabhanga (Cancelled)' : jupDig.en;
  const dignityTa = isNeechabhanga ? 'நீசபங்கம் (நிவர்த்தி)' : jupDig.ta;

  return {
    jupRasiIdx: jupIdx,
    jupRasi: RASHIS[jupIdx].name,
    jupRasiTa: RASHI_TA_NAMES[jupIdx],
    lagnaRasiIdx: lagnaIdx,
    lagnaRasi: RASHIS[lagnaIdx].name,
    lagnaRasiTa: RASHI_TA_NAMES[lagnaIdx],
    moonRasiIdx: moonIdx,
    moonRasi: RASHIS[moonIdx].name,
    moonRasiTa: RASHI_TA_NAMES[moonIdx],
    jupHouseFromLagna,
    jupHouseFromMoon,
    dignityEn,
    dignityTa,
    d9JupIdx,
    d9JupRasi: RASHIS[d9JupIdx].name,
    d9JupRasiTa: RASHI_TA_NAMES[d9JupIdx],
    d9DignityEn: d9Dig.en,
    d9DignityTa: d9Dig.ta,
    blessedTargets,
    aspects7th,
    aspectsMoon,
    aspectsVenus,
    hamsaYoga,
    guruChandalaYoga,
    transitJupRasi: RASHIS[transitJupIdx]?.name || 'Cancer',
    transitJupRasiTa: RASHI_TA_NAMES[transitJupIdx] || 'கடகம்',
    transitHouseFromMoon,
    hasGocharaGuruBalam,
    yogas,
    score,
    status,
    statusTa,
    chartBoxes: buildSouthIndianChart(grahas, { isManglik: false, houses: { lagna: 1, moon: 1, venus: 1 } })
  };
}

function calculateGuruMatchAnalysis(boyInput = {}, girlInput = {}) {
  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);
  const transitJupIdx = getCurrentTransitJupiterRasi();

  const boy = evaluatePersonGuru(boyGrahas, transitJupIdx);
  const girl = evaluatePersonGuru(girlGrahas, transitJupIdx);

  const guruToGuru = ((boy.jupRasiIdx - girl.jupRasiIdx + 12) % 12) + 1;
  const isFavorableDist = (d) => [1, 3, 4, 5, 7, 9, 10, 11].includes(d);
  const guruToGuruGood = isFavorableDist(guruToGuru);

  const hasSight = (fromIdx, targetIdx) => [0, 4, 6, 8].includes((targetIdx - fromIdx + 12) % 12);
  const brideGuruBlessesGroom =
    hasSight(girl.jupRasiIdx, boy.lagnaRasiIdx) ||
    hasSight(girl.jupRasiIdx, (boy.lagnaRasiIdx + 6) % 12) ||
    hasSight(girl.jupRasiIdx, boy.moonRasiIdx);
  const groomGuruBlessesBride =
    hasSight(boy.jupRasiIdx, girl.lagnaRasiIdx) ||
    hasSight(boy.jupRasiIdx, (girl.lagnaRasiIdx + 6) % 12) ||
    hasSight(boy.jupRasiIdx, girl.moonRasiIdx);

  const d9GuruDist = ((boy.d9JupIdx - girl.d9JupIdx + 12) % 12) + 1;
  const d9GuruGood = isFavorableDist(d9GuruDist);
  const gocharaBothReady = boy.hasGocharaGuruBalam && girl.hasGocharaGuruBalam;
  const gocharaOneReady = boy.hasGocharaGuruBalam || girl.hasGocharaGuruBalam;

  let combinedScore = Math.round((boy.score + girl.score) / 2);
  if (guruToGuruGood) combinedScore += 4;
  else combinedScore -= 3;
  if (brideGuruBlessesGroom) combinedScore += 3;
  if (groomGuruBlessesBride) combinedScore += 3;
  if (d9GuruGood) combinedScore += 3;
  combinedScore = Math.max(32, Math.min(98, combinedScore));

  let verdictEn = '';
  let verdictTa = '';
  if (combinedScore >= 74) {
    verdictEn = 'Auspicious Guru Bala & Paarvai — Strong divine grace, dharmic wisdom, progeny blessing & lifelong marital stability.';
    verdictTa = 'உத்தம குரு பலம் & குரு பார்வை — தெய்வ அருள், தர்ம சிந்தனை, குடும்ப வளர்ச்சி மற்றும் நீண்ட இல்லற சுபிட்சம் சிறப்பாக உள்ளது.';
  } else if (combinedScore >= 56) {
    verdictEn = 'Balanced Guru Placement — Supportive values and steady family progress; Guru grace strengthens key marital houses.';
    verdictTa = 'சமநிலையான குரு அமைப்பு — நல்ல குடும்ப மதிப்புகளும் சீரான வளர்ச்சியும் உண்டு; சுப தசா காலத்தில் மேலும் சிறக்கும்.';
  } else {
    verdictEn = 'Moderate Guru Strength — Thursday Sri Dakshinamurthy / Guru Bhagavan worship & elders’ blessings advised before marriage.';
    verdictTa = 'மத்திம குரு பலம் — வியாழக்கிழமை ஸ்ரீ தக்ஷிணாமூர்த்தி / குரு பகவான் வழிபாடு மற்றும் பெரியோர்களின் ஆசி சுப பலம் தரும்.';
  }

  return {
    boy,
    girl,
    transitJupRasi: RASHIS[transitJupIdx]?.name || 'Cancer',
    transitJupRasiTa: RASHI_TA_NAMES[transitJupIdx] || 'கடகம்',
    guruToGuru,
    guruToGuruGood,
    brideGuruBlessesGroom,
    groomGuruBlessesBride,
    d9GuruDist,
    d9GuruGood,
    gocharaBothReady,
    gocharaOneReady,
    combinedScore,
    verdictEn,
    verdictTa
  };
}

/**
 * Section 11: Dasa Sandhi Porutham (தசா சந்திப் பொருத்தம்) — Full Mahadasha & Bhukti Transition Scan
 */
const VIMSHOTTARI_LORDS = [
  { id: 'ketu', nameEn: 'Ketu', nameTa: 'கேது', years: 7, nature: 'malefic' },
  { id: 'venus', nameEn: 'Venus', nameTa: 'சுக்கிரன்', years: 20, nature: 'benefic' },
  { id: 'sun', nameEn: 'Sun', nameTa: 'சூரியன்', years: 6, nature: 'neutral' },
  { id: 'moon', nameEn: 'Moon', nameTa: 'சந்திரன்', years: 10, nature: 'benefic' },
  { id: 'mars', nameEn: 'Mars', nameTa: 'செவ்வாய்', years: 7, nature: 'malefic' },
  { id: 'rahu', nameEn: 'Rahu', nameTa: 'ராகு', years: 18, nature: 'malefic' },
  { id: 'jupiter', nameEn: 'Jupiter', nameTa: 'குரு', years: 16, nature: 'benefic' },
  { id: 'saturn', nameEn: 'Saturn', nameTa: 'சனி', years: 19, nature: 'malefic' },
  { id: 'mercury', nameEn: 'Mercury', nameTa: 'புதன்', years: 17, nature: 'benefic' },
];

function yearDecToStr(yearDec) {
  const y = Math.floor(yearDec);
  const remMonths = (yearDec - y) * 12;
  const m = Math.max(1, Math.min(12, Math.floor(remMonths) + 1));
  const remDays = (remMonths - (m - 1)) * 30;
  const d = Math.max(1, Math.min(28, Math.floor(remDays) + 1));
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function formatYearMonthGap(months) {
  if (months < 12) return `${months}m`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}m` : `${y}y`;
}

function buildPersonDasaSandhiProfile(grahas, nowYear) {
  const moonLon = normalizeDeg(grahas.longitudes.moon);
  const nakSpan = 40 / 3;
  const nakIdx = Math.floor(moonLon / nakSpan) % 27;
  const startIdx = nakIdx % 9;
  const degInsideNak = moonLon % nakSpan;
  const remFrac = Math.max(0.01, Math.min(0.99, 1 - degInsideNak / nakSpan));
  const birthLord = VIMSHOTTARI_LORDS[startIdx];
  const birthBalYears = remFrac * birthLord.years;

  const birthDateYear = grahas.birthYear + (grahas.birthMonth - 1) / 12.0 + (grahas.birthDay - 1) / 365.25;
  const periods = [];
  let cursorYear = birthDateYear;
  let cursorAge = 0;

  // Build 12 successive Mahadashas (>120 years coverage)
  for (let i = 0; i < 12; i++) {
    const idx = (startIdx + i) % 9;
    const lord = VIMSHOTTARI_LORDS[idx];
    const duration = i === 0 ? birthBalYears : lord.years;
    const startDateYear = cursorYear;
    const endDateYear = cursorYear + duration;
    periods.push({
      seqIdx: i,
      lordIdx: idx,
      lordId: lord.id,
      lord: lord.nameEn,
      lordTa: lord.nameTa,
      nature: lord.nature,
      fullYears: lord.years,
      durationYears: Number(duration.toFixed(2)),
      startAge: Number(cursorAge.toFixed(1)),
      endAge: Number((cursorAge + duration).toFixed(1)),
      startDateYear,
      endDateYear,
      startDate: yearDecToStr(startDateYear),
      endDate: yearDecToStr(endDateYear),
    });
    cursorYear = endDateYear;
    cursorAge += duration;
  }

  const runningIdx = periods.findIndex((p) => p.startDateYear <= nowYear && p.endDateYear > nowYear);
  const curIdx = runningIdx >= 0 ? runningIdx : 0;
  const currentDasha = periods[curIdx];
  const nextDasha = periods[curIdx + 1] || periods[curIdx];

  // Compute current running Anthardasha (Bhukti) inside currentDasha
  const fullDashaStartYear = currentDasha.seqIdx === 0
    ? currentDasha.endDateYear - currentDasha.fullYears
    : currentDasha.startDateYear;
  let bhuktiCursor = fullDashaStartYear;
  let currentBhukti = { lord: currentDasha.lord, lordTa: currentDasha.lordTa, endDate: currentDasha.endDate };
  for (let b = 0; b < 9; b++) {
    const bLord = VIMSHOTTARI_LORDS[(currentDasha.lordIdx + b) % 9];
    const bDur = (currentDasha.fullYears * bLord.years) / 120.0;
    const bEnd = bhuktiCursor + bDur;
    if (nowYear >= bhuktiCursor && nowYear < bEnd) {
      currentBhukti = {
        lordId: bLord.id,
        lord: bLord.nameEn,
        lordTa: bLord.nameTa,
        startDate: yearDecToStr(bhuktiCursor),
        endDate: yearDecToStr(bEnd),
        isLastBhukti: b === 8
      };
      break;
    }
    bhuktiCursor = bEnd;
  }

  const yearsRemaining = Math.max(0, currentDasha.endDateYear - nowYear);
  const monthsRemaining = Math.round(yearsRemaining * 12);
  const inDashaChidram = yearsRemaining <= 0.75 || currentBhukti.isLastBhukti;

  // Upcoming Mahadasha transitions over next 45 years (plus recent -0.5 yr)
  const transitions = [];
  for (let i = curIdx; i < periods.length - 1; i++) {
    const fromD = periods[i];
    const toD = periods[i + 1];
    if (fromD.endDateYear >= nowYear - 0.5 && fromD.endDateYear <= nowYear + 45) {
      transitions.push({
        fromId: fromD.lordId,
        fromEn: fromD.lord,
        fromTa: fromD.lordTa,
        fromNature: fromD.nature,
        toId: toD.lordId,
        toEn: toD.lord,
        toTa: toD.lordTa,
        toNature: toD.nature,
        dateYear: fromD.endDateYear,
        dateStr: fromD.endDate,
        ageAtTransition: fromD.endAge
      });
    }
  }

  const bY = Math.floor(birthBalYears);
  const bM = Math.floor((birthBalYears - bY) * 12);
  const bD = Math.round(((birthBalYears - bY) * 12 - bM) * 30);

  return {
    starEn: NAKSHATRAS[nakIdx]?.name || 'Ashwini',
    starTa: TAMIL_STARS[nakIdx]?.tamil || 'அசுவினி',
    birthBalanceEn: `${birthLord.nameEn} (${bY}y ${bM}m ${bD}d)`,
    birthBalanceTa: `${birthLord.nameTa} (${bY}வ ${bM}மா ${bD}நா)`,
    currentDasha: {
      lordId: currentDasha.lordId,
      lord: currentDasha.lord,
      lordTa: currentDasha.lordTa,
      startDate: currentDasha.startDate,
      endDate: currentDasha.endDate,
      endAge: currentDasha.endAge,
      monthsRemaining
    },
    currentBhukti,
    nextDasha: {
      lord: nextDasha.lord,
      lordTa: nextDasha.lordTa,
      startDate: nextDasha.startDate
    },
    inDashaChidram,
    transitions
  };
}

function calculateDasaSandhiAnalysis(boyInput = {}, girlInput = {}) {
  const now = new Date();
  const nowYear = now.getFullYear() + now.getMonth() / 12.0 + (now.getDate() - 1) / 365.25;

  const boyGrahas = computePersonGrahas(boyInput);
  const girlGrahas = computePersonGrahas(girlInput);

  const boy = buildPersonDasaSandhiProfile(boyGrahas, nowYear);
  const girl = buildPersonDasaSandhiProfile(girlGrahas, nowYear);

  // Scan every Bride x Groom transition pair within 18 months (1.5 years)
  const collisions = [];
  girl.transitions.forEach((gTr) => {
    boy.transitions.forEach((bTr) => {
      const gapYears = Math.abs(gTr.dateYear - bTr.dateYear);
      if (gapYears <= 1.5) {
        const gapMonths = Math.round(gapYears * 12);
        const avgYear = (gTr.dateYear + bTr.dateYear) / 2;
        const yearsAway = Math.max(0, Number((avgYear - nowYear).toFixed(1)));
        const isBeneficPair = gTr.toNature === 'benefic' && bTr.toNature === 'benefic';
        const isMaleficPair = gTr.toNature === 'malefic' || bTr.toNature === 'malefic';

        let severity = 'moderate';
        let severityEn = 'Near-Junction Watch (13–18m)';
        let severityTa = 'கவனிக்க வேண்டிய இடைவெளி (13–18 மாதம்)';
        if (gapMonths <= 6) {
          severity = isBeneficPair ? 'moderate' : 'critical';
          severityEn = isBeneficPair ? 'Benefic Sandhi (≤ 6m Gap)' : 'Severe Dasa Sandhi (≤ 6m Gap)';
          severityTa = isBeneficPair ? 'சுப தசா சந்தி (≤ 6 மாதம்)' : 'தீவிர தசா சந்தி (≤ 6 மாத இடைவெளி)';
        } else if (gapMonths <= 12) {
          severity = isBeneficPair ? 'moderate' : 'high';
          severityEn = isBeneficPair ? 'Mild Sandhi (7–12m, Benefic)' : 'Active Dasa Sandhi (7–12m Gap)';
          severityTa = isBeneficPair ? 'மிதமான சுப சந்தி (7–12 மாதம்)' : 'தசா சந்தி தோஷம் (7–12 மாதம்)';
        }

        collisions.push({
          id: `${gTr.dateStr}_${bTr.dateStr}`,
          approxYear: Math.round(avgYear),
          yearsAway,
          gapMonths,
          gapLabel: formatYearMonthGap(gapMonths),
          girlTransition: gTr,
          boyTransition: bTr,
          isBeneficPair,
          isMaleficPair,
          severity,
          severityEn,
          severityTa
        });
      }
    });
  });

  collisions.sort((a, b) => a.approxYear - b.approxYear);

  const criticalCount = collisions.filter((c) => c.severity === 'critical' || c.severity === 'high').length;
  const nearCritical = collisions.some((c) => (c.severity === 'critical' || c.severity === 'high') && c.yearsAway <= 15);
  const anyChidram = boy.inDashaChidram || girl.inDashaChidram;

  let overallStatus = 'clear';
  let statusLabelEn = 'Porunthum — No Simultaneous Dasa Sandhi';
  let statusLabelTa = 'பொருந்தும் — தசா சந்தி தோஷம் இல்லை';
  let score = 92;
  let verdictEn = '';
  let verdictTa = '';

  if (nearCritical || criticalCount >= 2) {
    overallStatus = 'sandhi';
    statusLabelEn = 'Dasa Sandhi Present — Timing & Shanti Advised';
    statusLabelTa = 'தசா சந்தி உள்ளது — தசா சந்தி சாந்தி & பரிகாரம் தேவை';
    score = Math.max(36, 56 - criticalCount * 8 - (anyChidram ? 6 : 0));
    verdictEn = `Detected ${collisions.length} Mahadasha transition overlap(s) within 18 months (closest ${collisions[0].gapMonths}m apart around ${collisions[0].approxYear}). Classical Dasa Sandhi Shanti & Mrityunjaya Homam before wedding are recommended.`;
    verdictTa = `இருவரின் மகா தசை மாற்றங்களும் 18 மாத இடைவெளிக்குள் (${collisions[0].approxYear}-ல் ${collisions[0].gapMonths} மாத இடைவெளியில்) சந்திக்கின்றன. திருமணத்திற்கு முன் தசா சந்தி சாந்தி & மிருத்யுஞ்சய ஹோமம் செய்வது உத்தமம்.`;
  } else if (collisions.length > 0 || anyChidram) {
    overallStatus = 'watch';
    statusLabelEn = 'Madhyamam — Mild / Distant Sandhi Watch';
    statusLabelTa = 'மத்திமம் — எளிய தசா சந்தி கவனம்';
    score = anyChidram && collisions.length === 0 ? 74 : 68;
    verdictEn = collisions.length > 0
      ? `Minor or benefic-cushioned transition proximity detected around ${collisions[0].approxYear} (${collisions[0].gapMonths}m apart). Manageable with simple Navagraha prayer.`
      : 'No simultaneous 45-year Mahadasha collision detected; one partner is near Dasha Chidram (final Bhukti), so fixing auspicious Muhurat after transition brings added peace.';
    verdictTa = collisions.length > 0
      ? `${collisions[0].approxYear}-ம் ஆண்டில் சுப அல்லது மிதமான தசா சந்திப்பு (${collisions[0].gapMonths} மாதம்) உள்ளது; எளிய நவக்கிரக வழிபாட்டால் சமநிலை பெறும்.`
      : '45 ஆண்டுகளில் ஒரே நேரத்தில் தசா சந்திப்பு இல்லை; ஒருவர் தசா சித்ர காலத்தில் இருப்பதால் சுப முகூர்த்தம் பார்த்து திருமணம் நடத்துவது சிறப்பு.';
  } else {
    overallStatus = 'clear';
    statusLabelEn = 'Porunthum — No Simultaneous Dasa Sandhi';
    statusLabelTa = 'பொருந்தும் — தசா சந்தி தோஷம் இல்லை';
    score = 94;
    verdictEn = 'All upcoming Mahadasha transitions over the next 45 years are cleanly spaced (>18 months apart) — Auspicious Dasa Sandhi Porutham!';
    verdictTa = 'அடுத்த 45 ஆண்டுகளில் இருவரின் மகா தசை மாற்றங்களும் 18 மாதங்களுக்கு மேல் இடைவெளியில் அமைவதால் தசா சந்திப் பொருத்தம் உத்தமமாக உள்ளது.';
  }

  return {
    boy,
    girl,
    collisions,
    criticalCount,
    anyChidram,
    overallStatus,
    statusLabelEn,
    statusLabelTa,
    score,
    verdictEn,
    verdictTa
  };
}

/**
 * Section 12: Matching Nakshatras Finder (பொருந்தும் நட்சத்திரங்கள் பட்டியல்)
 * Evaluates all 27 Nakshatras (handling split-Rasi padas) for a given horoscope.
 */
function buildCandidateNakshatraRasiSlots() {
  const slots = [];
  for (let sIdx = 0; sIdx < TAMIL_STARS.length; sIdx++) {
    const starObj = TAMIL_STARS[sIdx];
    const startDeg = sIdx * (40 / 3);
    const padaSigns = [1, 2, 3, 4].map((p) => {
      const midDeg = normalizeDeg(startDeg + (p - 0.5) * (10 / 3));
      return { p, rasiIdx: Math.floor(midDeg / 30) % 12 };
    });

    const uniqueRasis = [...new Set(padaSigns.map((x) => x.rasiIdx))];
    if (uniqueRasis.length === 1) {
      slots.push({
        starIdx: sIdx,
        starName: starObj.name,
        starTamil: starObj.tamil,
        padaLabelEn: 'All Padas (1–4)',
        padaLabelTa: 'அனைத்து பாதங்கள் (1–4)',
        pada: 1,
        rasiIdx: uniqueRasis[0],
        rasiName: RASHIS[uniqueRasis[0]].name,
        rasiTamil: RASHIS[uniqueRasis[0]].tamil
      });
    } else {
      uniqueRasis.forEach((rIdx) => {
        const matchingPadas = padaSigns.filter((x) => x.rasiIdx === rIdx).map((x) => x.p);
        const firstP = matchingPadas[0];
        const lastP = matchingPadas[matchingPadas.length - 1];
        const rangeEn = firstP === lastP ? `Pada ${firstP}` : `Pada ${firstP}–${lastP}`;
        const rangeTa = firstP === lastP ? `${firstP}-ம் பாதம்` : `${firstP}–${lastP} பாதங்கள்`;
        slots.push({
          starIdx: sIdx,
          starName: starObj.name,
          starTamil: starObj.tamil,
          padaLabelEn: rangeEn,
          padaLabelTa: rangeTa,
          pada: firstP,
          rasiIdx: rIdx,
          rasiName: RASHIS[rIdx].name,
          rasiTamil: RASHIS[rIdx].tamil
        });
      });
    }
  }
  return slots;
}

const CANDIDATE_NAKSHATRA_SLOTS = buildCandidateNakshatraRasiSlots();

function resolvePersonStarAndRasi(personInput = {}) {
  const hasExplicitStar = Boolean(personInput.starNakshatra || personInput.nakshatra || personInput.star);
  const hasExplicitRasi = Boolean(personInput.rasiMoonSign || personInput.moonSign || personInput.rasi || personInput.rashi);

  let starObj = hasExplicitStar ? findStarObj(personInput) : null;
  let rasiIdx = hasExplicitRasi ? findRashiIdx(personInput) : null;
  let pada = parseInt(personInput.pada || personInput.padam || 1, 10) || 1;

  if (!starObj || rasiIdx === null) {
    try {
      const grahas = computePersonGrahas(personInput);
      if (!starObj && grahas.starObj) starObj = TAMIL_STARS[grahas.starObj.index] || TAMIL_STARS[0];
      if (rasiIdx === null && typeof grahas.rashis?.moon === 'number') rasiIdx = grahas.rashis.moon;
      if (grahas.pada) pada = grahas.pada;
    } catch {
      // Fallback below
    }
  }

  starObj = starObj || TAMIL_STARS[0];
  rasiIdx = typeof rasiIdx === 'number' ? rasiIdx : 0;

  return {
    name: personInput.name || 'Person',
    starIdx: starObj.index,
    starName: starObj.name,
    starTamil: starObj.tamil,
    pada,
    rasiIdx,
    rasiName: RASHIS[rasiIdx]?.name || 'Aries',
    rasiTamil: RASHIS[rasiIdx]?.tamil || 'மேஷம்'
  };
}

function findMatchingNakshatrasForHoroscope(personInput = {}, gender = 'female') {
  const isSourceBride = String(gender || personInput.gender || 'female').toLowerCase() === 'female';
  const source = resolvePersonStarAndRasi(personInput);

  const sourcePayload = {
    name: source.name,
    starNakshatra: source.starName,
    moonSign: source.rasiName,
    pada: source.pada
  };

  const evaluated = CANDIDATE_NAKSHATRA_SLOTS.map((cand) => {
    const candidatePayload = {
      name: cand.starName,
      starNakshatra: cand.starName,
      moonSign: cand.rasiName,
      pada: cand.pada
    };

    const poruthamRes = isSourceBride
      ? calculateTamilPoruthams(candidatePayload, sourcePayload)
      : calculateTamilPoruthams(sourcePayload, candidatePayload);

    const totalScore = poruthamRes.totalScore || 0;
    const rajjuClear = !poruthamRes.rajjuAnalysis?.hasDosha;
    const rajjuExempt = Boolean(poruthamRes.rajjuAnalysis?.isArohaAvarohaException);
    const vedhaClear = !poruthamRes.vedhaAnalysis?.hasVedha;
    const dinaClear = Boolean(poruthamRes.isDinaMatching);
    const subha68 = Boolean(poruthamRes.subhaShashtashtakam?.isSubhaShashtashtakam);

    const failReasonsEn = [];
    const failReasonsTa = [];
    if (!rajjuClear && !rajjuExempt) {
      failReasonsEn.push(`Rajju Dosha (${poruthamRes.rajjuAnalysis?.limbAfflicted})`);
      failReasonsTa.push(`ரஜ்ஜு தோஷம் (${poruthamRes.rajjuAnalysis?.limbAfflicted})`);
    }
    if (!vedhaClear) {
      failReasonsEn.push('Vedha Conflict');
      failReasonsTa.push('வேதை தோஷம்');
    }
    if (totalScore < 5) {
      failReasonsEn.push(`Low Score (${totalScore}/10)`);
      failReasonsTa.push(`குறைந்த மதிப்பெண் (${totalScore}/10)`);
    }

    let tier = 'avoid';
    if (rajjuClear && vedhaClear && totalScore >= 7) {
      tier = 'uttamam';
    } else if ((rajjuClear || rajjuExempt) && vedhaClear && totalScore >= 5) {
      tier = 'madhyamam';
    }

    return {
      key: `${cand.starIdx}_${cand.rasiIdx}`,
      starIdx: cand.starIdx,
      starName: cand.starName,
      starTamil: cand.starTamil,
      padaLabelEn: cand.padaLabelEn,
      padaLabelTa: cand.padaLabelTa,
      rasiIdx: cand.rasiIdx,
      rasiName: cand.rasiName,
      rasiTamil: cand.rasiTamil,
      totalScore,
      tier,
      rajjuClear,
      rajjuExempt,
      vedhaClear,
      dinaClear,
      subha68,
      failReasonsEn,
      failReasonsTa,
      poruthams: (poruthamRes.poruthams || []).slice(0, 10).map((p) => ({
        name: p.name,
        nameTamil: p.nameTamil,
        points: p.points,
        status: p.status,
        statusTamil: p.statusTamil
      }))
    };
  });

  const sortStars = (a, b) => (b.totalScore - a.totalScore) || (a.starIdx - b.starIdx) || (a.rasiIdx - b.rasiIdx);
  const uttamam = evaluated.filter((x) => x.tier === 'uttamam').sort(sortStars);
  const madhyamam = evaluated.filter((x) => x.tier === 'madhyamam').sort(sortStars);
  const avoid = evaluated.filter((x) => x.tier === 'avoid').sort(sortStars);

  return {
    source,
    sourceGender: isSourceBride ? 'female' : 'male',
    lookingFor: isSourceBride ? 'groom' : 'bride',
    counts: {
      uttamam: uttamam.length,
      madhyamam: madhyamam.length,
      avoid: avoid.length,
      totalSlots: evaluated.length
    },
    uttamam,
    madhyamam,
    avoid,
    allSlots: [...uttamam, ...madhyamam, ...avoid]
  };
}

function calculateMatchingNakshatrasPair(boyBirth = {}, girlBirth = {}) {
  return {
    forGirl: findMatchingNakshatrasForHoroscope(girlBirth, 'female'),
    forBoy: findMatchingNakshatrasForHoroscope(boyBirth, 'male')
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
    { name: 'Tara', obtained: taraPoints, total: 3, desc: 'Health & destiny rhythm' },
    { name: 'Yoni', obtained: yoniPoints, total: 4, desc: 'Biological & intimacy harmony' },
    { name: 'Graha Maitri', obtained: maitriPoints, total: 5, desc: 'Friendship & intellectual communication' },
    { name: 'Gana', obtained: ganaPoints, total: 6, desc: 'Temperament & behavior alignment' },
    { name: 'Bhakoot', obtained: bhakootPoints, total: 7, desc: 'Family welfare & emotional bonding' },
    { name: 'Nadi', obtained: nadiPoints, total: 8, desc: 'Genetic, physiological & lineage health' },
  ];

  const gujaDashaAnalysis = calculateGujaDashaAnalysis(boyBirth, girlBirth);
  const rahuKetuAnalysis = calculateRahuKetuMatchAnalysis(boyBirth, girlBirth);
  const puthrasthanamAnalysis = calculatePuthrasthanamAnalysis(boyBirth, girlBirth);
  const pakshaAnalysis = calculatePakshaMatchAnalysis(boyBirth, girlBirth);
  const marsVenusAnalysis = calculateMarsVenusMatchAnalysis(boyBirth, girlBirth);
  const shashtashtagamAnalysis = calculateShashtashtagamAnalysis(boyBirth, girlBirth);
  const chandranAnalysis = calculateChandranMatchAnalysis(boyBirth, girlBirth);
  const guruAnalysis = calculateGuruMatchAnalysis(boyBirth, girlBirth);
  const dasaSandhiAnalysis = calculateDasaSandhiAnalysis(boyBirth, girlBirth);
  const matchingNakshatrasAnalysis = calculateMatchingNakshatrasPair(boyBirth, girlBirth);

  return {
    boy: boyBirth,
    girl: girlBirth,
    kootas,
    totalScore,
    maxScore: 36,
    percentage: Math.round((totalScore / 36) * 100),
    verdict: totalScore >= 28 ? 'Excellent Match' : totalScore >= 18 ? 'Good Match' : 'Requires Remedies',
    compatibility: totalScore >= 28 ? 'Excellent Match' : totalScore >= 18 ? 'Good Match' : 'Requires Remedies',
    tamilPorutham: calculateTamilPoruthams(boyBirth, girlBirth),
    chevvaiAnalysis: {
      boy: gujaDashaAnalysis.boy,
      girl: gujaDashaAnalysis.girl,
      compatibilitySummary: gujaDashaAnalysis.doshaSamyam.summary,
      doshaSamyam: gujaDashaAnalysis.doshaSamyam
    },
    gujaDashaAnalysis: gujaDashaAnalysis,
    rahuKetuAnalysis: rahuKetuAnalysis,
    puthrasthanamAnalysis: puthrasthanamAnalysis,
    pakshaAnalysis: pakshaAnalysis,
    marsVenusAnalysis: marsVenusAnalysis,
    shashtashtagamAnalysis: shashtashtagamAnalysis,
    chandranAnalysis: chandranAnalysis,
    guruAnalysis: guruAnalysis,
    dasaSandhiAnalysis: dasaSandhiAnalysis,
    matchingNakshatrasAnalysis: matchingNakshatrasAnalysis
  };
}

/**
 * Lightweight Chevvai Dosha Evaluation for Matrimony
 */
function evaluateChevvaiDosha(person = {}, gender = 'male') {
  const hasDosha = Boolean(person.hasDosha || person.chevvaiDosha || person.marsDosha);
  const houses = person.houses || {
    lagna: person.chevvaiHouseLagna || person.marsHouse || (hasDosha ? 7 : 9),
    moon: person.chevvaiHouseMoon || (hasDosha ? 8 : 11),
    venus: person.chevvaiHouseVenus || (hasDosha ? 2 : 5)
  };
  return {
    hasDosha,
    isAfflicted: hasDosha,
    remedyRequired: hasDosha,
    verdict: hasDosha ? 'Chevvai Dosha Present' : 'Free from Chevvai Dosha',
    verdictTamil: hasDosha ? 'செவ்வாய் தோஷம் உண்டு' : 'செவ்வாய் தோஷம் இல்லை',
    houses,
    cancellations: person.cancellations || (hasDosha ? [] : ['Friendly / neutral sign placement'])
  };
}

const TAMIL_MONTHS_TA_PANCHANG = [
  'சித்திரை', 'வைகாசி', 'ஆனி', 'ஆடி', 'ஆவணி', 'புரட்டாசி',
  'ஐப்பசி', 'கார்த்திகை', 'மார்கழி', 'தை', 'மாசி', 'பங்குனி'
];
const TAMIL_MONTHS_EN_PANCHANG = [
  'Chithirai', 'Vaikasi', 'Aani', 'Aadi', 'Avani', 'Purattasi',
  'Aippasi', 'Karthigai', 'Margazhi', 'Thai', 'Maasi', 'Panguni'
];
const TAMIL_YEARS_60_EN_PANCHANG = [
  'Prabhava', 'Vibhava', 'Shukla', 'Pramodoota', 'Prajotpatti', 'Angirasa', 'Shrimukha', 'Bhava', 'Yuva', 'Dhatri',
  'Ishvara', 'Bahudhanya', 'Pramathi', 'Vikrama', 'Vishu', 'Chitrabhanu', 'Subhanu', 'Tarana', 'Parthiva', 'Vyaya',
  'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikruti', 'Khara', 'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
  'Hevilambi', 'Vilambi', 'Vikari', 'Sharvari', 'Plava', 'Shubhakrit', 'Sobhakrit', 'Krodhi', 'Vishvavasu', 'Parabhava',
  'Plavanga', 'Kilaka', 'Saumya', 'Sadharana', 'Virodhikrit', 'Paridhavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala',
  'Pingala', 'Kalayukti', 'Siddharthi', 'Raudra', 'Durmati', 'Dundubhi', 'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Akshaya'
];
const TAMIL_YEARS_60_TA_PANCHANG = [
  'பிரபவ', 'விபவ', 'சுக்ல', 'பிரமோதூத', 'பிரஜோத்பத்தி', 'ஆங்கீரச', 'ஸ்ரீமுக', 'பவ', 'யுவ', 'தாது',
  'ஈஸ்வர', 'வெகுதான்ய', 'பிரமாதி', 'விக்ரம', 'விஷு', 'சித்திரபானு', 'சுபானு', 'தாரண', 'பார்த்திப', 'விய',
  'சர்வஜித்', 'சர்வதாரி', 'விரோதி', 'விக்ருதி', 'கர', 'நந்தன', 'விஜய', 'ஜெய', 'மன்மத', 'துர்முகி',
  'ஹேவிளம்பி', 'விளம்பி', 'விகாரி', 'சார்வரி', 'பிலவ', 'சுபகிருது', 'சோபகிருது', 'குரோதி', 'விசுவாவசு', 'பராபவ',
  'பிலவங்க', 'கீலக', 'சௌமிய', 'சாதாரண', 'விரோதிகிருது', 'பரிதாபி', 'பிரமாதீச', 'ஆனந்த', 'ராட்சத', 'நள',
  'பிங்கள', 'காளயுக்தி', 'சித்தார்த்தி', 'ரௌத்ரி', 'துர்மதி', 'துந்துபி', 'ருத்ரோத்காரி', 'ரக்தாட்சி', 'குரோதன', 'அட்சய'
];

function computeSunTimesDecimal(Y, M, D, lat, lon, utcOffset) {
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D - 1524.5;
  const T = (JD - 2451545.0) / 36525.0;
  const eps = 23.439291 - 0.0130042 * T;
  const Ls = normalizeDeg(280.46646 + 36000.76983 * T);
  const M_sun = normalizeDeg(357.52911 + 35999.05029 * T);
  const C_sun = (1.914602 - 0.004817 * T) * sinD(M_sun) + 0.019993 * sinD(2 * M_sun);
  const lamSun = normalizeDeg(Ls + C_sun);

  const sinDec = sinD(eps) * sinD(lamSun);
  const cosDec = Math.sqrt(Math.max(0, 1 - sinDec * sinDec));
  const raSun = normalizeDeg(Math.atan2(cosD(eps) * sinD(lamSun), cosD(lamSun)) * 180 / Math.PI);
  let eotDeg = Ls - raSun;
  if (eotDeg > 180) eotDeg -= 360;
  if (eotDeg < -180) eotDeg += 360;
  const eotMin = eotDeg * 4;

  const cosH0 = (sinD(-0.8333) - sinD(lat) * sinDec) / (cosD(lat) * cosDec);
  const clampedCos = Math.max(-0.99, Math.min(0.99, cosH0));
  const H0 = Math.acos(clampedCos) * (180 / Math.PI) / 15;
  const noonLST = 12.0 - (lon - utcOffset * 15) / 15 - eotMin / 60;
  return {
    tSunrise: noonLST - H0,
    tSunset: noonLST + H0,
    solarNoon: noonLST
  };
}

function formatTime12Hr(hDec) {
  let h = Math.floor(hDec);
  let m = Math.round((hDec - h) * 60);
  if (m >= 60) { m = 0; h += 1; }
  h = ((h % 24) + 24) % 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatUtcDateToLocal12Hr(dateObj, utcOffset) {
  if (!dateObj) return null;
  const localMs = dateObj.getTime() + utcOffset * 3600000;
  const d = new Date(localMs);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  return formatTime12Hr(h + m / 60);
}

function computePanchangTamilDate(year, month, day, lat, lon, utcOffset) {
  const getSidSunAtMs = (ms) => {
    const t = Astronomy.MakeTime(new Date(ms));
    const T = t.tt / 36525.0;
    const tilt = Astronomy.e_tilt(t);
    const ay = 23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600.0 + tilt.dpsi / 3600.0;
    return normalizeDeg(Astronomy.SunPosition(t).elon - ay);
  };
  const signedDegDiff = (a, b) => {
    let d = (a - b) % 360;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  };
  const findTamilMonthStartDayUTC = (signIdx, approxMs) => {
    const targetDeg = (signIdx % 12) * 30;
    const curSun = getSidSunAtMs(approxMs);
    let ingMs = approxMs - (signedDegDiff(curSun, targetDeg) / 0.9856) * 86400000;
    for (let k = 0; k < 5; k++) {
      const err = signedDegDiff(getSidSunAtMs(ingMs), targetDeg);
      ingMs -= (err / 0.9856) * 86400000;
    }
    const localDate = new Date(ingMs + utcOffset * 3600000);
    const ingY = localDate.getUTCFullYear();
    const ingM = localDate.getUTCMonth() + 1;
    const ingD = localDate.getUTCDate();
    const ingH = localDate.getUTCHours() + localDate.getUTCMinutes() / 60 + localDate.getUTCSeconds() / 3600;
    const srss = computeSunTimesDecimal(ingY, ingM, ingD, lat, lon, utcOffset);
    let dayUTC = Date.UTC(ingY, ingM - 1, ingD);
    if (ingH > srss.tSunset) dayUTC += 86400000;
    return dayUTC;
  };

  const targetDayUTC = Date.UTC(year, month - 1, day);
  const noonMs = targetDayUTC + (12.0 - utcOffset) * 3600000;
  const sunLon = getSidSunAtMs(noonMs);

  let tamilMonthIdx = Math.floor(sunLon / 30) % 12;
  let monthStartUTC = findTamilMonthStartDayUTC(tamilMonthIdx, noonMs);
  let tamilDay = Math.round((targetDayUTC - monthStartUTC) / 86400000) + 1;

  if (tamilDay < 1) {
    tamilMonthIdx = (tamilMonthIdx + 11) % 12;
    monthStartUTC = findTamilMonthStartDayUTC(tamilMonthIdx, noonMs - 20 * 86400000);
    tamilDay = Math.round((targetDayUTC - monthStartUTC) / 86400000) + 1;
  } else if (tamilDay >= 29) {
    const nextStartUTC = findTamilMonthStartDayUTC((tamilMonthIdx + 1) % 12, noonMs + 5 * 86400000);
    if (targetDayUTC >= nextStartUTC) {
      tamilMonthIdx = (tamilMonthIdx + 1) % 12;
      tamilDay = Math.round((targetDayUTC - nextStartUTC) / 86400000) + 1;
    }
  }

  const chithirai1UTC = findTamilMonthStartDayUTC(0, Date.UTC(year, 3, 14));
  const effGYear = targetDayUTC < chithirai1UTC ? year - 1 : year;
  const cycleIndex = ((effGYear - 1987) % 60 + 60) % 60;

  return {
    yearEn: TAMIL_YEARS_60_EN_PANCHANG[cycleIndex],
    yearTa: TAMIL_YEARS_60_TA_PANCHANG[cycleIndex],
    monthEn: TAMIL_MONTHS_EN_PANCHANG[tamilMonthIdx],
    monthTa: TAMIL_MONTHS_TA_PANCHANG[tamilMonthIdx],
    day: tamilDay,
    monthIndex: tamilMonthIdx,
    labelEn: `${TAMIL_MONTHS_EN_PANCHANG[tamilMonthIdx]} ${tamilDay}`,
    labelTa: `${TAMIL_MONTHS_TA_PANCHANG[tamilMonthIdx]} ${tamilDay}`,
    fullEn: `${TAMIL_YEARS_60_EN_PANCHANG[cycleIndex]} · ${TAMIL_MONTHS_EN_PANCHANG[tamilMonthIdx]} ${tamilDay}`,
    fullTa: `${TAMIL_YEARS_60_TA_PANCHANG[cycleIndex]} · ${TAMIL_MONTHS_TA_PANCHANG[tamilMonthIdx]} ${tamilDay}`
  };
}

/**
 * Daily Panchangam for Calendar (supports city coordinates, UTC offset, & reckoning)
 */
function getDailyPanchangam(dateStr, options = {}) {
  let year, month, day;
  if (dateStr && /^\d{4}-\d{2}-\d{2}/.test(String(dateStr))) {
    const parts = String(dateStr).slice(0, 10).split('-').map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
  }

  const lat = Number.isFinite(parseFloat(options.lat)) ? parseFloat(options.lat) : 13.0827; // Chennai default
  const lon = Number.isFinite(parseFloat(options.lon)) ? parseFloat(options.lon) : 80.2707;
  const utcOffset = Number.isFinite(parseFloat(options.utcOffset)) ? parseFloat(options.utcOffset) : 5.5;
  const city = options.city ? String(options.city).trim() : 'Chennai';
  const reckoning = String(options.reckoning || 'thirukanitha').toLowerCase() === 'vakya' ? 'vakya' : 'thirukanitha';

  const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const weekdayIndex = dateObj.getUTCDay();

  const weekdays = [
    { name: 'Ravivara (Sunday)', lord: 'Sun', deity: 'Surya Dev', nature: 'Auspicious for ceremonies' },
    { name: 'Somavara (Monday)', lord: 'Moon', deity: 'Shiva', nature: 'Peaceful, auspicious for travel' },
    { name: 'Mangalavara (Tuesday)', lord: 'Mars', deity: 'Hanuman', nature: 'Courageous tasks' },
    { name: 'Budhavara (Wednesday)', lord: 'Mercury', deity: 'Vishnu', nature: 'Commerce and contracts' },
    { name: 'Guruvara (Thursday)', lord: 'Jupiter', deity: 'Brihaspati', nature: 'Pujas and education' },
    { name: 'Shukravara (Friday)', lord: 'Venus', deity: 'Lakshmi', nature: 'Harmony and celebrations' },
    { name: 'Shanivara (Saturday)', lord: 'Saturn', deity: 'Shani Dev', nature: 'Spiritual grounding' },
  ];

  const { tSunrise, tSunset } = computeSunTimesDecimal(year, month, day, lat, lon, utcOffset);
  const dayLen = tSunset > tSunrise ? (tSunset - tSunrise) : 12.0;
  const partLen = dayLen / 8.0;
  const slotStr = (slotNum) => {
    const s = tSunrise + (slotNum - 1) * partLen;
    return `${formatTime12Hr(s)} - ${formatTime12Hr(s + partLen)}`;
  };

  // Standard 8-segment Muhurat order starting from Sunday (0) .. Saturday (6)
  const rahuSegByDay = [8, 2, 7, 5, 6, 4, 3];
  const yamaSegByDay = [5, 4, 3, 2, 1, 7, 6];
  const guliSegByDay = [7, 6, 5, 4, 3, 2, 1];
  const amritSegByDay = [4, 2, 3, 6, 5, 4, 3];

  const rahuKalam = slotStr(rahuSegByDay[weekdayIndex]);
  const yamagandam = slotStr(yamaSegByDay[weekdayIndex]);
  const gulikaKalam = slotStr(guliSegByDay[weekdayIndex]);
  const amritKalam = slotStr(amritSegByDay[weekdayIndex]);

  const solarNoonDec = (tSunrise + tSunset) / 2;
  const muhurtaHalf = (dayLen / 15) / 2;
  const abhijitMuhurat = `${formatTime12Hr(solarNoonDec - muhurtaHalf)} - ${formatTime12Hr(solarNoonDec + muhurtaHalf)}`;
  const brahmaMuhurat = `${formatTime12Hr(tSunrise - 1.6)} - ${formatTime12Hr(tSunrise - 0.8)}`;

  // Astronomical Moonrise & Moonset via astronomy-engine Observer
  let moonriseStr = '01:30 PM';
  let moonsetStr = '01:15 AM';
  try {
    const observer = new Astronomy.Observer(lat, lon, 0);
    const localMidnightUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - utcOffset * 3600000);
    const moonRiseEvt = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, localMidnightUtc, 1.2);
    const moonSetEvt = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, localMidnightUtc, 1.2);
    if (moonRiseEvt?.date) moonriseStr = formatUtcDateToLocal12Hr(moonRiseEvt.date, utcOffset) || moonriseStr;
    if (moonSetEvt?.date) moonsetStr = formatUtcDateToLocal12Hr(moonSetEvt.date, utcOffset) || moonsetStr;
  } catch {
    // Fallback preserved above
  }

  // Sidereal Sun & Moon longitudes at local sunrise
  const sunriseUtcMs = Date.UTC(year, month - 1, day, 0, 0, 0) + (tSunrise - utcOffset) * 3600000;
  const astroTime = Astronomy.MakeTime(new Date(sunriseUtcMs));
  const T = astroTime.tt / 36525.0;
  const tilt = Astronomy.e_tilt(astroTime);
  const ayanamsha = normalizeDeg(23.857092 + (5029.0966 * T + 1.11161 * T * T) / 3600.0 + tilt.dpsi / 3600.0);

  let sunLong = normalizeDeg(Astronomy.SunPosition(astroTime).elon - ayanamsha);
  let moonLong = normalizeDeg(Astronomy.EclipticGeoMoon(astroTime).lon - ayanamsha);
  if (reckoning === 'vakya') {
    // Vakya traditional mean-motion offset (~ -0.32 deg Sun / -0.45 deg Moon traditional correction)
    sunLong = normalizeDeg(sunLong - 0.32);
    moonLong = normalizeDeg(moonLong - 0.45);
  }

  const diff = normalizeDeg(moonLong - sunLong);
  const tithiIndex = Math.floor(diff / 12) % 30;
  const tithiProgressPct = Math.round(((diff % 12) / 12) * 100);
  const tithiName = TITHIS[tithiIndex];
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';

  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const yogaIndex = Math.floor(normalizeDeg(sunLong + moonLong) / (360 / 27)) % 27;
  const yogaName = YOGAS[yogaIndex];
  const inauspiciousYogas = new Set(['Vishkumbha', 'Atiganda', 'Shoola', 'Ganda', 'Vyaghata', 'Vajra', 'Vyatipata', 'Parigha', 'Vaidhriti']);
  const karanaIndex = Math.floor(diff / 6) % 60;
  const karanaName = KARANAS[karanaIndex % 11];
  const karanaType = karanaName === 'Vishti' ? 'Avoid auspicious ceremonies (Bhadra)' : 'Favourable for regular ceremonies';

  const ayana = sunLong >= 270 || sunLong < 90 ? 'Uttarayana' : 'Dakshinayana';
  const rituNames = ['Vasanta (Spring)', 'Grishma (Summer)', 'Varsha (Monsoon)', 'Sharad (Autumn)', 'Hemanta (Pre-Winter)', 'Shishira (Winter)'];
  const ritu = rituNames[Math.floor(sunLong / 60) % 6];

  const tamilDate = computePanchangTamilDate(year, month, day, lat, lon, utcOffset);
  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return {
    date: isoDate,
    formattedDate,
    city,
    reckoning,
    tamilDate,
    vaar: weekdays[weekdayIndex],
    weekday: weekdays[weekdayIndex],
    tithi: { name: tithiName, paksha, index: (tithiIndex % 15) + 1, rawIndex: tithiIndex + 1, progress: `${tithiProgressPct}% elapsed` },
    nakshatra: { name: nakshatra.name, lord: nakshatra.lord, deity: nakshatra.deity, index: nakshatraIndex + 1 },
    yoga: { name: yogaName, nature: inauspiciousYogas.has(yogaName) ? 'Inauspicious' : 'Auspicious', index: yogaIndex + 1 },
    karana: { name: karanaName, type: karanaType, index: karanaIndex + 1 },
    rahuKalam,
    yamagandam,
    gulikaKalam,
    timings: {
      abhijitMuhurat,
      brahmaMuhurat,
      amritKalam,
      rahuKalam,
      yamagandam,
      gulikaKalam
    },
    sunMoonTimes: {
      sunrise: formatTime12Hr(tSunrise),
      sunset: formatTime12Hr(tSunset),
      moonrise: moonriseStr,
      moonset: moonsetStr,
      sunriseDec: Number(tSunrise.toFixed(3)),
      sunsetDec: Number(tSunset.toFixed(3))
    },
    astronomicalData: {
      vikramSamvat: String(year + (month >= 4 ? 57 : 56)),
      shakaSamvat: String(year - (month >= 4 || (month === 3 && day >= 22) ? 78 : 79)),
      ayana,
      ritu
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
  calculateGujaDashaAnalysis,
  calculateRahuKetuMatchAnalysis,
  calculatePuthrasthanamAnalysis,
  calculatePakshaMatchAnalysis,
  calculateMarsVenusMatchAnalysis,
  calculateShashtashtagamAnalysis,
  calculateChandranMatchAnalysis,
  calculateGuruMatchAnalysis,
  calculateDasaSandhiAnalysis,
  findMatchingNakshatrasForHoroscope,
  calculateMatchingNakshatrasPair,
  getDailyPanchangam,
};
