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
  const parts = String(timeStr).split(':').map(s => parseInt(s, 10));
  return { hour: isNaN(parts[0]) ? 6 : parts[0], minute: isNaN(parts[1]) ? 0 : parts[1] };
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

  // Moon Position & Star (use astronomical Moon if no explicit star/pada override was given)
  let moonSid = astroMoonSid;
  let starObj = findStarObj(input);
  const rashiIdx = findRashiIdx(input);
  let pada = parseInt(input.pada || input.padam || 0, 10);

  if (input.star || input.starNakshatra || input.nakshatra) {
    if (starObj && starObj.index !== undefined) {
      const pVal = pada >= 1 && pada <= 4 ? pada : 1;
      pada = pVal;
      moonSid = normalizeDeg(starObj.index * (40 / 3) + (pVal - 1) * (10 / 3) + (5 / 3));
    }
  } else {
    const padaTotal = Math.floor((astroMoonSid * 3 + 1e-9) / 10);
    const nakIdx = Math.floor(padaTotal / 4) % 27;
    pada = (padaTotal % 4) + 1;
    starObj = { ...NAKSHATRAS[nakIdx], index: nakIdx };
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
    rahuKetuAnalysis: rahuKetuAnalysis
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
  calculateGujaDashaAnalysis,
  calculateRahuKetuMatchAnalysis,
  getDailyPanchangam,
};
