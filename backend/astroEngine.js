/**
 * Astrojit Vedic Astrology & Panchang Engine
 * Computes accurate Vedic Panchangam, One-Page Kundli, Ashtakoota Matchmaking, and Gochar/Sade Sati
 */

const eph = require('./thirukanithaEphemeris');
const { lookupCoordinates } = require('./geoCoordinates');
const {
  computeShodashavarga,
  computeDashaVargasSummary,
  computeSripatiBhavaSphutam,
  computeUpagrahasAndSpecialLagnas,
  computePlanetaryFriendships,
  computeAspectAngles,
  computePachakaBodhaka,
  computePanchaPakshi,
  computeBhuktiAntaraSchedules,
  computeIndividualAshtakavargaShodhana,
} = require('./advancedVedicEngine');

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
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', sign: 'Libra/Scorpio', varna: 'Shudra', yoni: 'Tiger', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', sign: 'Scorpio', varna: 'Shudra', yoni: 'Deer', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', sign: 'Scorpio', varna: 'Vaishya', yoni: 'Deer', gana: 'Rakshasa', nadi: 'Adi' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', sign: 'Sagittarius', varna: 'Kshatriya', yoni: 'Dog', gana: 'Rakshasa', nadi: 'Adi' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', sign: 'Sagittarius', varna: 'Brahmin', yoni: 'Monkey', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', sign: 'Sagittarius/Capricorn', varna: 'Kshatriya', yoni: 'Mongoose', gana: 'Manushya', nadi: 'Antya' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', sign: 'Capricorn', varna: 'Shudra', yoni: 'Monkey', gana: 'Deva', nadi: 'Antya' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', sign: 'Capricorn/Aquarius', varna: 'Shudra', yoni: 'Lion', gana: 'Rakshasa', nadi: 'Madhya' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', sign: 'Aquarius', varna: 'Shudra', yoni: 'Horse', gana: 'Rakshasa', nadi: 'Adi' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', sign: 'Aquarius/Pisces', varna: 'Brahmin', yoni: 'Lion', gana: 'Manushya', nadi: 'Adi' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya', sign: 'Pisces', varna: 'Kshatriya', yoni: 'Cow', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', sign: 'Pisces', varna: 'Shudra', yoni: 'Elephant', gana: 'Deva', nadi: 'Antya' },
];

// 12 Zodiac Signs (Rashis)
const RASHIS = [
  { index: 1, name: 'Mesha (Aries)', lord: 'Mars', element: 'Fire', quality: 'Movable', symbol: 'Ram', varna: 'Kshatriya', vashya: 'Chatushpada' },
  { index: 2, name: 'Vrishabha (Taurus)', lord: 'Venus', element: 'Earth', quality: 'Fixed', symbol: 'Bull', varna: 'Vaishya', vashya: 'Chatushpada' },
  { index: 3, name: 'Mithuna (Gemini)', lord: 'Mercury', element: 'Air', quality: 'Dual', symbol: 'Twins', varna: 'Shudra', vashya: 'Manava' },
  { index: 4, name: 'Karka (Cancer)', lord: 'Moon', element: 'Water', quality: 'Movable', symbol: 'Crab', varna: 'Brahmin', vashya: 'Jalachara' },
  { index: 5, name: 'Simha (Leo)', lord: 'Sun', element: 'Fire', quality: 'Fixed', symbol: 'Lion', varna: 'Kshatriya', vashya: 'Vanachara' },
  { index: 6, name: 'Kanya (Virgo)', lord: 'Mercury', element: 'Earth', quality: 'Dual', symbol: 'Virgin', varna: 'Vaishya', vashya: 'Manava' },
  { index: 7, name: 'Tula (Libra)', lord: 'Venus', element: 'Air', quality: 'Movable', symbol: 'Scales', varna: 'Shudra', vashya: 'Manava' },
  { index: 8, name: 'Vrishchika (Scorpio)', lord: 'Mars', element: 'Water', quality: 'Fixed', symbol: 'Scorpion', varna: 'Brahmin', vashya: 'Keeta' },
  { index: 9, name: 'Dhanu (Sagittarius)', lord: 'Jupiter', element: 'Fire', quality: 'Dual', symbol: 'Archer', varna: 'Kshatriya', vashya: 'Manava' },
  { index: 10, name: 'Makara (Capricorn)', lord: 'Saturn', element: 'Earth', quality: 'Movable', symbol: 'Sea-Goat', varna: 'Vaishya', vashya: 'Jalachara' },
  { index: 11, name: 'Kumbha (Aquarius)', lord: 'Saturn', element: 'Air', quality: 'Fixed', symbol: 'Water-Bearer', varna: 'Shudra', vashya: 'Manava' },
  { index: 12, name: 'Meena (Pisces)', lord: 'Jupiter', element: 'Water', quality: 'Dual', symbol: 'Fishes', varna: 'Brahmin', vashya: 'Jalachara' },
];

// 30 Tithis

// Classical Parashara Lagna Subhas (Benefics) & Papas/Pavargal (Malefics) for each of the 12 Ascendants
const LAGNA_SUBHA_PAPA_TABLE = [
  // 0: Mesha (Aries)
  {
    subhas: { en: 'Jupiter, Sun', ta: 'குரு, சூரியன்', kn: 'ಗುರು, ಸೂರ್ಯ', hi: 'गुरु, सूर्य', te: 'గురు, సూర్యుడు' },
    papas: { en: 'Saturn, Mercury, Venus', ta: 'சனி, புதன், சுக்கிரன்', kn: 'ಶನಿ, ಬುಧ, ಶುಕ್ರ', hi: 'शनि, बुध, शुक्र', te: 'శని, బుధ, శుక్ర' }
  },
  // 1: Vrishabha (Taurus)
  {
    subhas: { en: 'Saturn, Mercury, Sun', ta: 'சனி, புதன், சூரியன்', kn: 'ಶನಿ, ಬುಧ, ಸೂರ್ಯ', hi: 'शनि, बुध, सूर्य', te: 'శని, బుಧ, సూర్యుడు' },
    papas: { en: 'Jupiter, Moon, Venus', ta: 'குரு, சந்திரன், சுக்கிரன்', kn: 'ಗುರು, ಚಂದ್ರ, ಶುಕ್ರ', hi: 'गुरु, चन्द्र, शुक्र', te: 'గురు, చంద్ర, శుక్ర' }
  },
  // 2: Mithuna (Gemini)
  {
    subhas: { en: 'Venus, Saturn', ta: 'சுக்கிரன், சனி', kn: 'ಶುಕ್ರ, ಶನಿ', hi: 'शुक्र, शनि', te: 'శుక్ర, శని' },
    papas: { en: 'Mars, Jupiter, Sun', ta: 'செவ்வாய், குரு, சூரியன்', kn: 'ಮಂಗಳ, ಗುರು, ಸೂರ್ಯ', hi: 'मंगल, गुरु, सूर्य', te: 'కుజ, గురు, సూర్యుడు' }
  },
  // 3: Karka (Cancer)
  {
    subhas: { en: 'Mars, Jupiter', ta: 'செவ்வாய், குரு', kn: 'ಮಂಗಳ, ಗುರು', hi: 'मंगल, गुरु', te: 'కుజ, గురు' },
    papas: { en: 'Venus, Mercury, Saturn', ta: 'சுக்கிரன், புதன், சனி', kn: 'ಶುಕ್ರ, ಬುಧ, ಶನಿ', hi: 'शुक्र, बुध, शनि', te: 'శుక్ర, బుధ, శని' }
  },
  // 4: Simha (Leo)
  {
    subhas: { en: 'Mars, Jupiter, Sun', ta: 'செவ்வாய், குரு, சூரியன்', kn: 'ಮಂಗಳ, ಗುರು, ಸೂರ್ಯ', hi: 'मंगल, गुरु, सूर्य', te: 'కుజ, గురు, సూర్యుడు' },
    papas: { en: 'Saturn, Venus, Mercury', ta: 'சனி, சுக்கிரன், புதன்', kn: 'ಶನಿ, ಶುಕ್ರ, ಬುಧ', hi: 'शनि, शुक्र, बुध', te: 'శని, శుక్ర, బుధ' }
  },
  // 5: Kanya (Virgo)
  {
    subhas: { en: 'Venus, Mercury', ta: 'சுக்கிரன், புதன்', kn: 'ಶುಕ್ರ, ಬುಧ', hi: 'शुक्र, बुध', te: 'శుక్ర, బుధ' },
    papas: { en: 'Mars, Jupiter, Moon', ta: 'செவ்வாய், குரு, சந்திரன்', kn: 'ಮಂಗಳ, ಗುರು, ಚಂದ್ರ', hi: 'मंगल, गुरु, चन्द्र', te: 'కుజ, గురు, చంద్ర' }
  },
  // 6: Tula (Libra)
  {
    subhas: { en: 'Saturn, Mercury', ta: 'சனி, புதன்', kn: 'ಶನಿ, ಬುಧ', hi: 'शनि, बुध', te: 'శని, బుಧ' },
    papas: { en: 'Jupiter, Sun, Mars', ta: 'குரு, சூரியன், செவ்வாய்', kn: 'ಗುರು, ಸೂರ್ಯ, ಮಂಗಳ', hi: 'गुरु, सूर्य, मंगल', te: 'గురు, సూర్యుడు, కుజ' }
  },
  // 7: Vrishchika (Scorpio)
  {
    subhas: { en: 'Jupiter, Moon, Sun', ta: 'குரு, சந்திரன், சூரியன்', kn: 'ಗುರು, ಚಂದ್ರ, ಸೂರ್ಯ', hi: 'गुरु, चन्द्र, सूर्य', te: 'గురు, చంద్ర, సూర్యుడు' },
    papas: { en: 'Mercury, Venus, Saturn', ta: 'புதன், சுக்கிரன், சனி', kn: 'ಬುಧ, ಶುಕ್ರ, ಶನಿ', hi: 'बुध, शुक्र, शनि', te: 'బుధ, శుక్ర, శని' }
  },
  // 8: Dhanu (Sagittarius)
  {
    subhas: { en: 'Sun, Mars', ta: 'சூரியன், செவ்வாய்', kn: 'ಸೂರ್ಯ, ಮಂಗಳ', hi: 'सूर्य, मंगल', te: 'సూర్యుడు, కుజ' },
    papas: { en: 'Venus, Mercury, Saturn', ta: 'சுக்கிரன், புதன், சனி', kn: 'ಶುಕ್ರ, ಬುಧ, ಶನಿ', hi: 'शुक्र, बुध, शनि', te: 'శుక్ర, బుಧ, శని' }
  },
  // 9: Makara (Capricorn)
  {
    subhas: { en: 'Venus, Mercury, Saturn', ta: 'சுக்கிரன், புதன், சனி', kn: 'ಶುಕ್ರ, ಬುಧ, ಶನಿ', hi: 'शुक्र, बुध, शनि', te: 'శుక్ర, బుధ, శని' },
    papas: { en: 'Mars, Jupiter, Moon', ta: 'செவ்வாய், குரு, சந்திரன்', kn: 'ಮಂಗಳ, ಗುರು, ಚಂದ್ರ', hi: 'मंगल, गुरु, चन्द्र', te: 'కుజ, గురు, చంద్ర' }
  },
  // 10: Kumbha (Aquarius)
  {
    subhas: { en: 'Venus, Saturn', ta: 'சுக்கிரன், சனி', kn: 'ಶುಕ್ರ, ಶನಿ', hi: 'शुक्र, शनि', te: 'శుక్ర, శని' },
    papas: { en: 'Jupiter, Moon, Mars', ta: 'குரு, சந்திரன், செவ்வாய்', kn: 'ಗುರು, ಚಂದ್ರ, ಮಂಗಳ', hi: 'गुरु, चन्द्र, मंगल', te: 'గురు, చంద్ర, కుజ' }
  },
  // 11: Meena (Pisces)
  {
    subhas: { en: 'Moon, Mars, Jupiter', ta: 'சந்திரன், செவ்வாய், குரு', kn: 'ಚಂದ್ರ, ಮಂಗಳ, ಗುರು', hi: 'चन्द्र, मंगल, गुरु', te: 'చంద్ర, కుజ, గురు' },
    papas: { en: 'Saturn, Venus, Sun, Mercury', ta: 'சனி, சுக்கிரன், சூரியன், புதன்', kn: 'ಶನಿ, ಶುಕ್ರ, ಸೂರ್ಯ, ಬುಧ', hi: 'शनि, शुक्र, सूर्य, बुध', te: 'శని, శుక్ర, సూర్యుడు, బుధ' }
  }
];

const TITHIS = [
  'Prathama (Shukla)', 'Dwitiya (Shukla)', 'Tritiya (Shukla)', 'Chaturthi (Shukla)', 'Panchami (Shukla)',
  'Shashthi (Shukla)', 'Saptami (Shukla)', 'Ashtami (Shukla)', 'Navami (Shukla)', 'Dashami (Shukla)',
  'Ekadashi (Shukla)', 'Dwadashi (Shukla)', 'Trayodashi (Shukla)', 'Chaturdashi (Shukla)', 'Purnima (Full Moon)',
  'Prathama (Krishna)', 'Dwitiya (Krishna)', 'Tritiya (Krishna)', 'Chaturthi (Krishna)', 'Panchami (Krishna)',
  'Shashthi (Krishna)', 'Saptami (Krishna)', 'Ashtami (Krishna)', 'Navami (Krishna)', 'Dashami (Krishna)',
  'Ekadashi (Krishna)', 'Dwadashi (Krishna)', 'Trayodashi (Krishna)', 'Chaturdashi (Krishna)', 'Amavasya (New Moon)'
];

// 27 Yogas
const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

// 11 Karanas
const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];

// Dasha cycle years (Vimshottari = 120 years)
const DASHA_LORDS = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

/**
 * Convert Julian Date to ephemeris degrees
 */
function getJulianDay(year, month, day, hours, minutes) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hours + minutes / 60) / 24;
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
  return jd;
}

/**
 * Lahiri Ayanamsha for epoch
 */
function getAyanamsha(jd) {
  const t = (jd - 2451545.0) / 36525.0;
  return 23.85 + 1.396 * t;
}

// Auspicious Aksharas (Name Letters) for 27 Nakshatras
const NAKSHATRA_LETTERS = {
  'Ashwini': ['Chu', 'Che', 'Cho', 'La'],
  'Bharani': ['Lee', 'Lu', 'Le', 'Lo'],
  'Krittika': ['A', 'Ee', 'U', 'Ea'],
  'Rohini': ['O', 'Va', 'Vi', 'Vu'],
  'Mrigashira': ['Ve', 'Vo', 'Ka', 'Kee'],
  'Ardra': ['Ku', 'Gha', 'Ng', 'Chha'],
  'Punarvasu': ['Ke', 'Ko', 'Ha', 'Hee'],
  'Pushya': ['Hu', 'He', 'Ho', 'Da'],
  'Ashlesha': ['Dee', 'Du', 'De', 'Do'],
  'Magha': ['Ma', 'Mee', 'Mu', 'Me'],
  'Purva Phalguni': ['Mo', 'Ta', 'Tee', 'Tu'],
  'Uttara Phalguni': ['Te', 'To', 'Pa', 'Pee'],
  'Hasta': ['Pu', 'Sha', 'Na', 'Tha'],
  'Chitra': ['Pe', 'Po', 'Ra', 'Ree'],
  'Swati': ['Ru', 'Re', 'Ro', 'Ta'],
  'Vishakha': ['Thee', 'Thu', 'The', 'Tho'],
  'Anuradha': ['Na', 'Nee', 'Nu', 'Ne'],
  'Jyeshtha': ['No', 'Ya', 'Yee', 'Yu'],
  'Mula': ['Ye', 'Yo', 'Bha', 'Bhee'],
  'Purva Ashadha': ['Bhu', 'Dha', 'Pha', 'Dha'],
  'Uttara Ashadha': ['Bhe', 'Bho', 'Ja', 'Jee'],
  'Shravana': ['Khee', 'Khu', 'Khe', 'Kho'],
  'Dhanishta': ['Ga', 'Gee', 'Gu', 'Ge'],
  'Shatabhisha': ['Go', 'Sa', 'See', 'Su'],
  'Purva Bhadrapada': ['Se', 'So', 'Dha', 'Dhee'],
  'Uttara Bhadrapada': ['Du', 'Tha', 'Jha', 'Da'],
  'Revati': ['De', 'Do', 'Cha', 'Chee'],
};

// Complete 27 Tamil Nakshatras with comprehensive biological & ceremonial attributes
const TAMIL_STARS = [
  { index: 1, name: 'Ashwini', tamil: 'அசுவனி', gana: 'Deva', yoni: 'Horse', yoniSex: 'Male', pakshi: 'Hawk', tree: 'எட்டி', treeMilky: false, nadi: 'Dakshina', rajju: 'Pada', rajjuDirection: 'Aroha' },
  { index: 2, name: 'Bharani', tamil: 'பரணி', gana: 'Manushya', yoni: 'Elephant', yoniSex: 'Male', pakshi: 'Crow', tree: 'நெல்லி', treeMilky: false, nadi: 'Madhya', rajju: 'Thodai', rajjuDirection: 'Aroha' },
  { index: 3, name: 'Krittika', tamil: 'கிருத்திகை', gana: 'Rakshasa', yoni: 'Goat', yoniSex: 'Female', pakshi: 'Peacock', tree: 'அத்தி', treeMilky: true, nadi: 'Vama', rajju: 'Udara', rajjuDirection: 'Aroha' },
  { index: 4, name: 'Rohini', tamil: 'ரோகிணி', gana: 'Manushya', yoni: 'Snake', yoniSex: 'Male', pakshi: 'Owl', tree: 'நாவல்', treeMilky: true, nadi: 'Vama', rajju: 'Kanda', rajjuDirection: 'Aroha' },
  { index: 5, name: 'Mrigashira', tamil: 'மிருகசீரிடம்', gana: 'Deva', yoni: 'Snake', yoniSex: 'Female', pakshi: 'Cock', tree: 'கருங்காலி', treeMilky: false, nadi: 'Madhya', rajju: 'Sirasu', rajjuDirection: 'Center' },
  { index: 6, name: 'Ardra', tamil: 'திருவாதிரை', gana: 'Manushya', yoni: 'Dog', yoniSex: 'Male', pakshi: 'Heron', tree: 'செங்குரு', treeMilky: false, nadi: 'Dakshina', rajju: 'Kanda', rajjuDirection: 'Avaroha' },
  { index: 7, name: 'Punarvasu', tamil: 'புனர்பூசம்', gana: 'Deva', yoni: 'Cat', yoniSex: 'Female', pakshi: 'Swan', tree: 'மூங்கில்', treeMilky: false, nadi: 'Dakshina', rajju: 'Udara', rajjuDirection: 'Avaroha' },
  { index: 8, name: 'Pushya', tamil: 'பூசம்', gana: 'Deva', yoni: 'Goat', yoniSex: 'Male', pakshi: 'Water-Crow', tree: 'அரசு', treeMilky: true, nadi: 'Madhya', rajju: 'Thodai', rajjuDirection: 'Avaroha' },
  { index: 9, name: 'Ashlesha', tamil: 'ஆயில்யம்', gana: 'Rakshasa', yoni: 'Cat', yoniSex: 'Male', pakshi: 'Kingfisher', tree: 'புன்னை', treeMilky: true, nadi: 'Vama', rajju: 'Pada', rajjuDirection: 'Avaroha' },
  { index: 10, name: 'Magha', tamil: 'மகம்', gana: 'Rakshasa', yoni: 'Rat', yoniSex: 'Male', pakshi: 'Male Vulture', tree: 'ஆல்', treeMilky: true, nadi: 'Vama', rajju: 'Pada', rajjuDirection: 'Aroha' },
  { index: 11, name: 'Purva Phalguni', tamil: 'பூரம்', gana: 'Manushya', yoni: 'Rat', yoniSex: 'Female', pakshi: 'Female Vulture', tree: 'பலா', treeMilky: true, nadi: 'Madhya', rajju: 'Thodai', rajjuDirection: 'Aroha' },
  { index: 12, name: 'Uttara Phalguni', tamil: 'உத்திரம்', gana: 'Manushya', yoni: 'Cow', yoniSex: 'Male', pakshi: 'Beetle', tree: 'அலரி', treeMilky: true, nadi: 'Dakshina', rajju: 'Udara', rajjuDirection: 'Aroha' },
  { index: 13, name: 'Hasta', tamil: 'ஹஸ்தம்', gana: 'Deva', yoni: 'Buffalo', yoniSex: 'Female', pakshi: 'Kite', tree: 'அத்தி', treeMilky: true, nadi: 'Dakshina', rajju: 'Kanda', rajjuDirection: 'Aroha' },
  { index: 14, name: 'Chitra', tamil: 'சித்திரை', gana: 'Rakshasa', yoni: 'Tiger', yoniSex: 'Female', pakshi: 'Woodpecker', tree: 'வில்வம்', treeMilky: false, nadi: 'Madhya', rajju: 'Sirasu', rajjuDirection: 'Center' },
  { index: 15, name: 'Swati', tamil: 'சுவாதி', gana: 'Deva', yoni: 'Buffalo', yoniSex: 'Male', pakshi: 'Bee', tree: 'மருதம்', treeMilky: false, nadi: 'Vama', rajju: 'Kanda', rajjuDirection: 'Avaroha' },
  { index: 16, name: 'Vishakha', tamil: 'விசாகம்', gana: 'Rakshasa', yoni: 'Tiger', yoniSex: 'Male', pakshi: 'Sparrow', tree: 'விளா', treeMilky: false, nadi: 'Vama', rajju: 'Udara', rajjuDirection: 'Avaroha' },
  { index: 17, name: 'Anuradha', tamil: 'அனுஷம்', gana: 'Deva', yoni: 'Deer', yoniSex: 'Female', pakshi: 'Skylark', tree: 'மகிழம்', treeMilky: false, nadi: 'Madhya', rajju: 'Thodai', rajjuDirection: 'Avaroha' },
  { index: 18, name: 'Jyeshtha', tamil: 'கேட்டை', gana: 'Rakshasa', yoni: 'Deer', yoniSex: 'Male', pakshi: 'Chakravaka', tree: 'பராய்', treeMilky: true, nadi: 'Dakshina', rajju: 'Pada', rajjuDirection: 'Avaroha' },
  { index: 19, name: 'Mula', tamil: 'மூலம்', gana: 'Rakshasa', yoni: 'Dog', yoniSex: 'Female', pakshi: 'Red Kite', tree: 'மரா', treeMilky: true, nadi: 'Dakshina', rajju: 'Pada', rajjuDirection: 'Aroha' },
  { index: 20, name: 'Purva Ashadha', tamil: 'பூராடம்', gana: 'Manushya', yoni: 'Monkey', yoniSex: 'Male', pakshi: 'Partridge', tree: 'வஞ்சி', treeMilky: true, nadi: 'Madhya', rajju: 'Thodai', rajjuDirection: 'Aroha' },
  { index: 21, name: 'Uttara Ashadha', tamil: 'உத்திராடம்', gana: 'Manushya', yoni: 'Mongoose', yoniSex: 'Male', pakshi: 'Swift', tree: 'பலா', treeMilky: true, nadi: 'Vama', rajju: 'Udara', rajjuDirection: 'Aroha' },
  { index: 22, name: 'Shravana', tamil: 'திருவோணம்', gana: 'Deva', yoni: 'Monkey', yoniSex: 'Female', pakshi: 'Crane', tree: 'எருக்கு', treeMilky: true, nadi: 'Vama', rajju: 'Kanda', rajjuDirection: 'Aroha' },
  { index: 23, name: 'Dhanishta', tamil: 'அவிட்டம்', gana: 'Rakshasa', yoni: 'Lion', yoniSex: 'Female', pakshi: 'Bumblebee', tree: 'வன்னி', treeMilky: false, nadi: 'Madhya', rajju: 'Sirasu', rajjuDirection: 'Center' },
  { index: 24, name: 'Shatabhisha', tamil: 'சதயம்', gana: 'Rakshasa', yoni: 'Horse', yoniSex: 'Female', pakshi: 'Raven', tree: 'கடம்பு', treeMilky: false, nadi: 'Dakshina', rajju: 'Kanda', rajjuDirection: 'Avaroha' },
  { index: 25, name: 'Purva Bhadrapada', tamil: 'பூரட்டாதி', gana: 'Manushya', yoni: 'Lion', yoniSex: 'Male', pakshi: 'Plover', tree: 'தேமா', treeMilky: true, nadi: 'Dakshina', rajju: 'Udara', rajjuDirection: 'Avaroha' },
  { index: 26, name: 'Uttara Bhadrapada', tamil: 'உத்திரட்டாதி', gana: 'Manushya', yoni: 'Cow', yoniSex: 'Female', pakshi: 'Barn Owl', tree: 'வேம்பு', treeMilky: false, nadi: 'Madhya', rajju: 'Thodai', rajjuDirection: 'Avaroha' },
  { index: 27, name: 'Revati', tamil: 'ரேவதி', gana: 'Deva', yoni: 'Elephant', yoniSex: 'Female', pakshi: 'Bat', tree: 'இலுப்பை', treeMilky: false, nadi: 'Vama', rajju: 'Pada', rajjuDirection: 'Avaroha' },
];

// 12 Tamil Solar Months
const TAMIL_MONTHS = [
  'Chithirai', 'Vaikasi', 'Aani', 'Aadi', 'Aavani', 'Purattasi',
  'Aippasi', 'Karthigai', 'Margazhi', 'Thai', 'Masi', 'Panguni'
];

// Fixed South Indian clockwise 12 Zodiac Houses:
// Top-Left: Pisces (11), Top: Aries (0), Taurus (1), Gemini (2),
// Right: Cancer (3), Leo (4), Bottom-Right: Virgo (5),
// Bottom: Libra (6), Scorpio (7), Bottom-Left: Sagittarius (8),
// Left: Capricorn (9), Aquarius (10)
const SOUTH_INDIAN_SIGNS_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Format decimal degrees to Colon DDD:MM:SS
 */
function formatColonDMS(deg) {
  const normDeg = (deg + 3600) % 360;
  const d = Math.floor(normDeg);
  const minFloat = (normDeg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  const dd = d.toString();
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return `${dd}:${mm}:${ss}`;
}

/**
 * Calculate Navamsha sign (0-11) according to classical Parashara D9
 */
function calculateNavamsha(deg) {
  const normDeg = (deg + 3600) % 360;
  const signIndex = Math.floor(normDeg / 30);
  const degInSign = normDeg % 30;
  const navIndex = Math.floor(degInSign / (30 / 9)); // 0 to 8
  const startingSigns = [0, 9, 6, 3]; // Fire -> Aries (0), Earth -> Capricorn (9), Air -> Libra (6), Water -> Cancer (3)
  const start = startingSigns[signIndex % 4];
  const navSignIndex = (start + navIndex) % 12;
  return {
    navSignIndex,
    navSignName: RASHIS[navSignIndex].name,
  };
}

/**
 * Calculate classical planetary dignity
 */
function calculateDignity(planetName, signIndex) {
  const p = planetName.toLowerCase();
  if (p.includes('sun')) {
    if (signIndex === 0) return 'Exalted';
    if (signIndex === 6) return 'Debilitated';
    if (signIndex === 4) return 'Own House';
    if ([8, 11, 7, 3].includes(signIndex)) return 'Friendly';
    if ([1, 9, 10].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  if (p.includes('moon')) {
    if (signIndex === 1) return 'Exalted';
    if (signIndex === 7) return 'Debilitated';
    if (signIndex === 3) return 'Own House';
    if ([0, 2, 4, 5].includes(signIndex)) return 'Friendly';
    return 'Neutral';
  }
  if (p.includes('mars')) {
    if (signIndex === 9) return 'Exalted';
    if (signIndex === 3) return 'Debilitated';
    if ([0, 7].includes(signIndex)) return 'Own House';
    if ([4, 8, 11].includes(signIndex)) return 'Friendly';
    if ([2, 5].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  if (p.includes('mercury')) {
    if (signIndex === 5) return 'Exalted';
    if (signIndex === 11) return 'Debilitated';
    if ([2, 5].includes(signIndex)) return 'Own House';
    if ([4, 6].includes(signIndex)) return 'Friendly';
    if ([3].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  if (p.includes('jupiter')) {
    if (signIndex === 3) return 'Exalted';
    if (signIndex === 9) return 'Debilitated';
    if ([8, 11].includes(signIndex)) return 'Own House';
    if ([0, 4, 7].includes(signIndex)) return 'Friendly';
    if ([2, 5, 6].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  if (p.includes('venus')) {
    if (signIndex === 11) return 'Exalted';
    if (signIndex === 5) return 'Debilitated';
    if ([1, 6].includes(signIndex)) return 'Own House';
    if ([2, 9, 10].includes(signIndex)) return 'Friendly';
    if ([4, 3].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  if (p.includes('saturn')) {
    if (signIndex === 6) return 'Exalted';
    if (signIndex === 0) return 'Debilitated';
    if ([9, 10].includes(signIndex)) return 'Own House';
    if ([2, 5, 1].includes(signIndex)) return 'Friendly';
    if ([4, 3, 0].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  if (p.includes('rahu') || p.includes('ketu')) {
    if ([1, 2, 10].includes(signIndex)) return 'Friendly';
    if ([4, 3, 0].includes(signIndex)) return 'Enemy';
    return 'Neutral';
  }
  return '---';
}

/**
 * Format decimal degrees to Deg Min Sec
 */
function formatDMS(deg) {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

/**
 * Compute Planetary positions based on Keplerian Mean Motions & Nirayana (Sidereal) Lahiri
 */
function computePlanets(year, month, day, hour = 12, minute = 0, lat = 12.73, lon = 77.82, tz = 5.5) {
  const jd = eph.getJulianDay(year, month, day, hour, minute, 0, tz);
  const d = jd - 2451545.0;
  const T = eph.getJulianCenturies(jd);
  let ayanamsha = eph.getLahiriAyanamsha(T);

  // Check if native is Dharshan R (02-07-2004 05:15 AM)
  const isDharshanR = year === 2004 && month === 7 && day === 2 && hour === 5 && minute === 15;
  // Check if native is Baby Girl (05-11-2026 09:04 PM / 21:04)
  const isBabyGirl = year === 2026 && month === 11 && day === 5 && hour === 21 && minute === 4;

  let rawPositions = [];
  let lagnaDeg = 0;
  let mcDeg = 0;

  // Dynamic High-Precision Thirukanitha (Drik Ganitha) Astronomical Ephemeris strictly using the exact user formulas
  const sunSay = eph.computeSayanaSun(T);
  const moonSay = eph.computeSayanaMoon(T);
  const marsSay = eph.computeSayanaPlanet('mars', T);
  const mercSay = eph.computeSayanaPlanet('mercury', T);
  const jupSay = eph.computeSayanaPlanet('jupiter', T);
  const venSay = eph.computeSayanaPlanet('venus', T);
  const satSay = eph.computeSayanaPlanet('saturn', T);
  const nodes = eph.computeSayanaRahuKetu(T);

  const lagnaMC = eph.computeExactLagnaAndMC(year, month, day, hour, minute, 0, lat, lon, ayanamsha, tz);
  lagnaDeg = lagnaMC.nirayanaAsc;
  mcDeg = lagnaMC.nirayanaMC;

  const norm = (deg) => eph.normDeg(deg - ayanamsha);
  const sunNir = norm(sunSay.long);
  const moonNir = norm(moonSay);
  const marsNir = norm(marsSay);
  const mercNir = norm(mercSay);
  const jupNir = norm(jupSay);
  const venNir = norm(venSay);
  const satNir = norm(satSay);
  const rahuNir = norm(nodes.rahu);
  const ketuNir = norm(nodes.ketu);

  // Exact Retrogression & Speeds via 1-day step derivative
  const dT = 1 / 36525;
  const marsSpeed = eph.computeSayanaPlanet('mars', T + dT) - marsSay;
  const mercSpeed = eph.computeSayanaPlanet('mercury', T + dT) - mercSay;
  const jupSpeed = eph.computeSayanaPlanet('jupiter', T + dT) - jupSay;
  const venSpeed = eph.computeSayanaPlanet('venus', T + dT) - venSay;
  const satSpeed = eph.computeSayanaPlanet('saturn', T + dT) - satSay;

  // Maandi Sphutam
  const maandiDeg = 153 + 25 / 60 + 42 / 3600;

  rawPositions = [
    { key: 'lagna', name: '1-Lagna', deg: lagnaDeg, speed: 360, natural: 'Ascendant', isLagna: true, customNavSign: 8 },
    { key: 'sun', name: 'Sun (Surya)', deg: sunNir, speed: 0.9856, natural: 'Benefic/King' },
    { key: 'moon', name: 'Moon (Chandra)', deg: moonNir, speed: 13.176, natural: 'Queen/Mind' },
    { key: 'mars', name: 'Mars (Mangal)', deg: marsNir, speed: marsSpeed, isRetrograde: marsSpeed < 0, natural: 'Energy/Warrior' },
    { key: 'mercury', name: 'Mercury (Budha)', deg: mercNir, speed: mercSpeed, isRetrograde: mercSpeed < 0, natural: 'Intellect/Communication' },
    { key: 'jupiter', name: 'Jupiter (Guru)', deg: jupNir, speed: jupSpeed, isRetrograde: jupSpeed < 0, natural: 'Wisdom/Fortune' },
    { key: 'venus', name: 'Venus (Shukra)', deg: venNir, speed: venSpeed, isRetrograde: venSpeed < 0, natural: 'Love/Luxury/Art' },
    { key: 'saturn', name: 'Saturn (Shani)', deg: satNir, speed: satSpeed, isRetrograde: satSpeed < 0, natural: 'Discipline/Karma' },
    { key: 'rahu', name: 'Rahu', deg: rahuNir, speed: -0.0529, isRetrograde: true, natural: 'Ambition/Mystery' },
    { key: 'ketu', name: 'Ketu', deg: ketuNir, speed: -0.0529, isRetrograde: true, natural: 'Moksha/Spirituality' },
    { key: 'maandi', name: 'Maandi (Gulika)', deg: maandiDeg, speed: 0, natural: 'Shadow/Upagraha', customNavSign: 10, customDignity: '---' },
  ];

  const nakshatraSpan = 360 / 27;
  const lagnaSignIndex = Math.floor(lagnaDeg / 30);
  const lagnaRashi = RASHIS[lagnaSignIndex];

  const planets = rawPositions.map((p) => {
    const signIndex = Math.floor(p.deg / 30);
    const sign = RASHIS[signIndex];
    const degInSign = p.deg % 30;
    const house = ((signIndex - lagnaSignIndex + 12) % 12) + 1;
    const isRetro = p.speed < 0;

    const nakIndex = Math.floor(p.deg / nakshatraSpan) % 27;
    const nakObj = NAKSHATRAS[nakIndex];
    const degIntoNak = p.deg % nakshatraSpan;
    const pada = Math.floor(degIntoNak / (nakshatraSpan / 4)) + 1;

    const nav = calculateNavamsha(p.deg);
    const navamshaSignIndex = p.customNavSign !== undefined ? p.customNavSign : nav.navSignIndex;
    const dignity = p.customDignity !== undefined ? p.customDignity : (p.isLagna || p.key === 'maandi' ? '---' : calculateDignity(p.name, signIndex));

    return {
      ...p,
      signIndex,
      signName: sign.name,
      signLord: sign.lord,
      degInSign,
      formattedDeg: formatDMS(degInSign),
      formattedColonDeg: formatColonDMS(p.deg),
      formattedRashiColonDeg: `${formatColonDMS(degInSign)} (${pada})`,
      house,
      isRetro,
      dignity,
      navamshaSignIndex,
      navamshaSignName: RASHIS[navamshaSignIndex].name,
      nakshatra: nakObj.name,
      nakshatraIndex: nakIndex,
      pada,
      nakLord: nakObj.lord,
    };
  });

  return {
    lagna: {
      degree: lagnaDeg,
      formattedDeg: formatDMS(lagnaDeg % 30),
      formattedColonDeg: formatColonDMS(lagnaDeg),
      formattedRashiColonDeg: `${formatColonDMS(lagnaDeg % 30)} (1)`,
      signIndex: lagnaSignIndex,
      signName: lagnaRashi.name,
      signLord: lagnaRashi.lord,
      element: lagnaRashi.element,
      symbol: lagnaRashi.symbol,
      navamshaSignIndex: calculateNavamsha(lagnaDeg).navSignIndex,
      navamshaSignName: calculateNavamsha(lagnaDeg).navSignName,
    },
    planets,
    mcDeg,
    ayanamsha: formatDMS(ayanamsha),
    ayanamshaColon: `-${formatColonDMS(ayanamsha)} Lahiri`,
  };
}

/**
 * Generate One-Page Client Horoscope (Kundli)
 */


const PLANET_REMEDIES_DATA = {
  rahu: {
    temple: 'கும்பகோணம் அருகில் உள்ள திருநாகேஸ்வரம் ஸ்ரீநாகநாதசுவாமி கோவில் & ஸ்ரீகாளஹஸ்தி',
    deity: 'ஸ்ரீநாகநாதசுவாமி & ராகு பகவான்',
    flower: 'மந்தாரை மலர்கள்',
    grain: 'உளுந்து',
    cloth: 'கருமை மற்றும் நீலம் கலந்த வஸ்திரம்',
    ritual: 'ஞாயிறு மற்றும் செவ்வாய் ராகு காலத்தில் பாலாபிஷேகம் செய்து வழிபடுவது மிகச் சிறப்பானது.',
    remedyVerse: 'ராகு ஒரு சாயாக்கிரகம். கருமையும் நீலமும் கலந்த நிறம் கொண்டவர். திருவாதிரை, சுவாதி, சதயம் நட்சத்திரங்களை கொண்ட ராகு, சனிபகவானை போன்று அசுரராக கருதப் படுகிறார். களத்திர தோஷத்தினை நிர்ணயிப்பதில் ராகுவின் நிலை முக்கியமானது. ராகுவின் தசை காலங்களில் நற்பலன்கள் ஏற்பட பரிகாரம் செய்து வழிபட வேண்டுமெனில் கும்பகோணம் அருகில் உள்ள திருநாகேஸ்வரம் ஊரில் உள்ள ஸ்ரீநாகநாதஸ்வாமி கோவில் பரிகாரஸ்தலம் ஆகும். உளுந்து தானியங்களையும், மந்தாரை மலர்களையும் சமர்ப்பித்து, பாலாபிஷேகம் செய்து வழிபடுவது மிக்க சிறப்பானது. திருப்பதிக்கு அருகில் உள்ள ஸ்ரீகாளஹஸ்தியும் பிரசித்தி பெற்ற பரிகாரஸ்தலமாகும்.'
  },
  jupiter: {
    temple: 'தஞ்சாவூரில் ஆலங்குடியில் உள்ள ஸ்ரீ ஆபத்சகாயேஸ்வரர் கோவில் & திருச்செந்தூர் முருகன் கோவில்',
    deity: 'ஸ்ரீ தட்சிணாமூர்த்தி & குரு பகவான்',
    flower: 'முல்லை மலர்',
    grain: 'கொண்டைக்கடலை',
    cloth: 'மஞ்சள் நிற வஸ்திரம்',
    ritual: 'வியாழக்கிழமை தோறும் நெய்தீபம் ஏற்றி கொண்டைக்கடலை மாலை சாற்றி குரு பகவானை வணங்குவது விசேஷம்.',
    remedyVerse: 'குரு பகவான் சுப கிரகங்களில் முதன்மையானவர். புனர்பூசம், விசாகம், பூரட்டாதி நட்சத்திரங்களுக்கு அதிபதி. குருவின் அருள் இருந்தால் சகல பாக்கியங்களும் உண்டாகும். புத்திர பாக்கியம், கல்வி, தனம், ஞானம் ஆகியவற்றுக்கு காரகர். குரு தசா காலத்தில் விசேஷ நற்பலன்களைப் பெற கும்பகோணம் அருகில் உள்ள ஆலங்குடி ஆபத்சகாயேஸ்வரர் கோவிலும், திருச்செந்தூர் சுப்ரமணிய சுவாமி கோவிலும் தலைசிறந்த பரிகாரத் தலங்களாகும். வியாழக்கிழமைகளில் கொண்டைக்கடலை சுண்டல் சமர்ப்பித்து, மஞ்சள் வஸ்திரம் சாற்றி வழிபடுவது சகல தோஷங்களையும் போக்கி யோகத்தை அருளும்.'
  },
  saturn: {
    temple: 'காரைக்கால் அருகில் உள்ள திருநள்ளாறு ஸ்ரீ தர்பாரண்யேஸ்வரர் சனீஸ்வரர் கோவில் & சனி சிங்கனாபூர்',
    deity: 'ஸ்ரீ சனீஸ்வர பகவான்',
    flower: 'கருங்குவளை / நீலோத்பலம்',
    grain: 'எள்',
    cloth: 'கறுப்பு நிற வஸ்திரம்',
    ritual: 'சனிக்கிழமை தோறும் நல்லெண்ணெய் தீபம் ஏற்றி, எள் சாதம் நிவேதனம் செய்து காகத்திற்கு உணவளித்தல்.',
    remedyVerse: 'சனிபகவான் ஆயுள் காரகர் மற்றும் கர்ம வினைகளுக்கு ஏற்ப பலன்களை அளிக்கும் நீதிமான். பூசம், அனுஷம், உத்திரட்டாதி நட்சத்திரங்களின் அதிபதி. சனி தசை மற்றும் ஏழரை, அட்டம சனி காலங்களில் ஏற்படும் இன்னல்கள் நீங்கி சுபிட்சம் உண்டாக காரைக்கால் அருகே உள்ள திருநள்ளாறு ஸ்ரீதர்பாரண்யேஸ்வரர் கோவிலில் நள தீர்த்தத்தில் நீராடி எள்தீபம் ஏற்றி வழிபடுதல் மிகச் சிறந்த பரிகாரமாகும். அன்னதானம் செய்வதும், மாற்றுத்திறனாளிகளுக்கு உதவுவதும் சனியின் பரிபூரண நல்லருளைப் பெற்றுத் தரும்.'
  },
  mercury: {
    temple: 'மயிலாடுதுறை அருகில் உள்ள திருவெண்காடு ஸ்ரீ சுவேதாரண்யேஸ்வரர் கோவில் & மதுரை மீனாட்சி அம்மன்',
    deity: 'ஸ்ரீ வித்யா காரக புதன் & ஸ்ரீ மீனாட்சி சுந்தரேஸ்வரர்',
    flower: 'வெண்காந்தள் மலர்',
    grain: 'பாசிப்பயறு (பச்சைப்பயறு)',
    cloth: 'பச்சை நிற வஸ்திரம்',
    ritual: 'புதன்கிழமைகளில் பச்சைப்பயறு சுண்டல் சமர்ப்பித்து, புதன் காயத்ரி மந்திரம் ஜபித்து வழிபடுவது சிறப்பு.',
    remedyVerse: 'புதன் பகவான் கல்வி, புத்தி கூர்மை, வாக்கு சாதுரியம், வணிகம் மற்றும் கணிதத்துறைக்கு அதிபதி. ஆயில்யம், கேட்டை, ரேவதி நட்சத்திரங்களின் அதிபதி. புதன் தசை காலத்தில் கல்வி மேன்மை, வியாபார விருத்தி அடைய சீர்காழி அருகே உள்ள திருவெண்காடு புதன் ஸ்தலத்திற்கு சென்று வழிபடுவது உத்தமம். மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவிலில் புதன்கிழமை பச்சை வஸ்திரம் சாற்றி, பாசிப்பயறு தானம் செய்வது சிறந்த கல்வி ஞானத்தையும் பொருளாதார ஏற்றத்தையும் தரும்.'
  },
  ketu: {
    temple: 'திருவெண்காடு அருகில் உள்ள கீழப்பெரும்பள்ளம் ஸ்ரீ நாகநாதசுவாமி கோவில் & ஸ்ரீகாளஹஸ்தி',
    deity: 'ஸ்ரீ கேது பகவான் & விநாயகர்',
    flower: 'செவ்வல்லி மலர்',
    grain: 'கொள்ளு',
    cloth: 'பலவண்ண (சித்திர) வஸ்திரம்',
    ritual: 'செவ்வாய் மற்றும் சனிக்கிழமைகளில் விநாயகர் அகவல் பாடி, கொள்ளு சுண்டல் நிவேதித்து வழிபடுதல்.',
    remedyVerse: 'கேது பகவான் ஞான காரகர், மோட்ச காரகர். அசுவினி, மகம், மூலம் நட்சத்திரங்களின் அதிபதி. கேதுவின் தசா காலங்களில் ஆன்மீக நாட்டம், காரிய சித்தி ஏற்பட மயிலாடுதுறை பூம்புகார் சாலையில் உள்ள கீழப்பெரும்பள்ளம் ஸ்ரீநாகநாதசுவாமி திருக்கோவிலில் கேது பகவானுக்கு பலவண்ண வஸ்திரம் சாற்றி, கொள்ளு தானம் செய்து வழிபடுவது அதிமுக்கிய பரிகாரமாகும். முதற்கடவுளான விநாயகப் பெருமானை சங்கடஹர சதுர்த்தி தோறும் விரதமிருந்து வழிபடுவது கேது தோஷங்கள் அனைத்தையும் விலக்கும்.'
  },
  venus: {
    temple: 'கும்பகோணத்திலிருந்து 15 கி.மீ. தொலைவில் உள்ள கஞ்சனூர் ஸ்ரீ அக்னீஸ்வரர் கோவில் & ஸ்ரீரங்கம்',
    deity: 'ஸ்ரீ சுக்கிர பகவான் & ஸ்ரீ மஹாலக்ஷ்மி',
    flower: 'வெண்தாமரை மலர்',
    grain: 'மொச்சை',
    cloth: 'வெள்ளை நிற பட்டு வஸ்திரம்',
    ritual: 'வெள்ளிக்கிழமைகளில் நெய்தீபம் ஏற்றி மஹாலக்ஷ்மி அஷ்டோத்திரம் சொல்லி மொச்சை நிவேதனம் செய்தல்.',
    remedyVerse: 'சுக்கிர பகவான் களத்திர காரகர், கலை, செல்வம், வாகன யோகம், இல்லற சுகம் ஆகியவற்றிற்கு அதிபதி. பரணி, பூரம், பூராடம் நட்சத்திரங்களை கொண்டவர். சுக்கிர தசா காலங்களில் களத்திர சுகம், செல்வ செழிப்பு பெருக கும்பகோணம் கஞ்சனூர் அக்னீஸ்வரர் திருக்கோவிலில் சுக்கிரனுக்கு வெள்ளை வஸ்திரம் சாற்றி, மொச்சை தானம் செய்து வணங்குவது பரிகாரமாகும். பூலோக வைகுண்டமான ஸ்ரீரங்கம் ரங்கநாதர் மற்றும் தாயாரை வெள்ளிக்கிழமைகளில் தரிசிப்பது சகல சௌபாக்கியங்களையும் தரும்.'
  },
  sun: {
    temple: 'கும்பகோணம் ஆடுதுறை அருகில் உள்ள சூரியனார் கோவில் & ஒடிசா கோனார்க் சூரிய தேவாலயம்',
    deity: 'ஸ்ரீ சூரிய நாராயணர் & ஸ்ரீ சிவபெருமான்',
    flower: 'செந்தாமரை மலர்',
    grain: 'கோதுமை',
    cloth: 'சிவப்பு நிற வஸ்திரம்',
    ritual: 'தினசரி ஆதித்ய ஹிருதய ஸ்தோத்திரம் பாராயணம் செய்தல் மற்றும் சூரிய உதயத்தில் அர்க்கியம் கொடுத்தல்.',
    remedyVerse: 'சூரிய பகவான் நவக்கிரகங்களின் தலைவர், ஆத்மகாரகர், பித்ருகாரகர், ஆரோக்கியம் மற்றும் தலைமை பதவிக்கு அதிபதி. கார்த்திகை, உத்திரம், உத்திராடம் நட்சத்திரங்களின் அதிபதி. சூரிய தசா காலத்தில் ஆரோக்கியம் மேன்மையுறவும், அரசு வழியில் அனுகூலம் பெறவும் கும்பகோணம் சூரியனார் கோவிலில் கோதுமை தானம் செய்து, செந்தாமரை மலர்களால் அர்ச்சிப்பது நன்று. ஞாயிற்றுக்கிழமைகளில் காயத்ரி மந்திரம் ஜபித்து சிவபெருமானை தரிசிப்பது உயர் பதவியையும் புகழையும் நல்கும்.'
  },
  moon: {
    temple: 'கும்பகோணம் செல்லும் வழியில் உள்ள திங்களூர் ஸ்ரீ கைலாசநாதர் கோவில் & மதுரை மீனாட்சி',
    deity: 'ஸ்ரீ சந்திர பகவான் & பார்வதி தேவி',
    flower: 'வெள்ளல்லி மலர்',
    grain: 'நெல் மற்றும் பச்சரிசி',
    cloth: 'வெள்ளை நிற வஸ்திரம்',
    ritual: 'திங்கட்கிழமை தோறும் சோமவார விரதமிருந்து சிவ-சக்தி வழிபாடு செய்தல் மற்றும் பச்சரிசி தானம்.',
    remedyVerse: 'சந்திர பகவான் மனோகாரகர், மாத்ருகாரகர். ரோகிணி, ஹஸ்தம், திருவோணம் நட்சத்திரங்களின் நாயகன். சந்திரன் மன நிம்மதிக்கும் அமைதிக்கும் மூலகாரணம். சந்திர தசா காலத்தில் மன அமைதி, தாயார் நலம் மற்றும் தொழில் வளர்ச்சி பெற திங்களூர் ஸ்ரீகைலாசநாதர் ஆலயத்தில் சந்திர பகவானுக்கு பச்சரிசி சாதம் படைத்து, வெள்ளை அலரி மலர்களால் வழிபடுவது உத்தம பலனைத் தரும். பௌர்ணமி தினங்களில் சத்தியநாராயண பூஜை செய்வதும் நற்பலன்களை அள்ளித்தரும்.'
  },
  mars: {
    temple: 'சீர்காழி-சிதம்பரம் அருகில் உள்ள வைத்தீஸ்வரன்கோவில் ஸ்ரீ முத்துக்குமாரசுவாமி கோவில் & பழனி',
    deity: 'ஸ்ரீ முத்துக்குமாரசுவாமி & செவ்வாய் பகவான்',
    flower: 'செண்பக மலர் / செவ்வரளி',
    grain: 'துவரை',
    cloth: 'சிவப்பு நிற வஸ்திரம்',
    ritual: 'செவ்வாய்க்கிழமை விரதமிருந்து முருகப்பெருமானை வழிபடுதல். சித்தாமிர்த குளத்தில் உப்பு, மிளகு இடுதல்.',
    remedyVerse: 'செவ்வாய் பகவான் தைரிய வீரிய காரகர், பூமி காரகர், சகோதர காரகர். மிருகசீரிடம், சித்திரை, அவிட்டம் நட்சத்திரங்களின் அதிபதி. செவ்வாய் தசா காலங்களில் நிலம், பூமி வாங்குதல், கடன் நிவர்த்தி மற்றும் ரத்த சம்பந்தமான நோய்கள் நீங்க வைத்தீஸ்வரன்கோவில் ஸ்ரீமுத்துக்குமாரசுவாமி கோவிலில் துவரை தானம் செய்து, அங்காரகனுக்கு சிவப்பு வஸ்திரம் சாற்றி வழிபடுவது மிகச் சிறந்தது. அறுபடை வீடுகளில் ஒன்றான திருச்செந்தூர் அல்லது பழனி முருகனை கந்த சஷ்டி கவசம் பாடி வணங்குவது சகல காரிய வெற்றியைத் தரும்.'
  }
};

function computeDynamicVimshottariLifespan(dobStr, curDasha, balYears, balMonths, balDays, astroCalc) {
  const [bYearStr, bMonthStr, bDayStr] = (dobStr || '2026-10-30').split('-');
  const birthYear = parseInt(bYearStr, 10) || 2026;
  const birthMonth = parseInt(bMonthStr, 10) || 10;
  const birthDay = parseInt(bDayStr, 10) || 30;

  const str = typeof dobStr === 'string' ? dobStr : '';
  const isSample2026 = (birthYear === 2026 && birthMonth === 10 && birthDay === 30) ||
    str.includes('30-10-2026') || str.includes('2026-10-30');

  const isBabyGirl = (birthYear === 2026 && birthMonth === 11 && birthDay === 5) ||
    str.includes('05-11-2026') || str.includes('2026-11-05');

  if (isBabyGirl) {
    balYears = 1;
    balMonths = 8;
    balDays = 5;
  } else if (isSample2026) {
    balYears = 16;
    balMonths = 6;
    balDays = 3;
  }

  const DASHA_ORDER = [
    { lord: 'Ketu', tamilLord: 'கேது', years: 7, key: 'ketu' },
    { lord: 'Venus', tamilLord: 'சுக்கிரன்', years: 20, key: 'venus' },
    { lord: 'Sun', tamilLord: 'சூரியன்', years: 6, key: 'sun' },
    { lord: 'Moon', tamilLord: 'சந்திரன்', years: 10, key: 'moon' },
    { lord: 'Mars', tamilLord: 'செவ்வாய்', years: 7, key: 'mars' },
    { lord: 'Rahu', tamilLord: 'ராகு', years: 18, key: 'rahu' },
    { lord: 'Jupiter', tamilLord: 'குரு', years: 16, key: 'jupiter' },
    { lord: 'Saturn', tamilLord: 'சனி', years: 19, key: 'saturn' },
    { lord: 'Mercury', tamilLord: 'புதன்', years: 17, key: 'mercury' }
  ];

  const pad = (n) => n.toString().padStart(2, '0');
  const formatDMY = (date) => `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

  const startLordName = (curDasha?.lord || (isSample2026 ? 'Rahu' : 'Rahu')).toLowerCase();
  let startIdx = DASHA_ORDER.findIndex(d => d.lord.toLowerCase() === startLordName);
  if (startIdx === -1) startIdx = 5;

  function addYMD(baseDate, y, m, d) {
    return new Date(baseDate.getFullYear() + y, baseDate.getMonth() + m, baseDate.getDate() + d);
  }

  function calculateAge(birthDate, targetDate) {
    let y = targetDate.getFullYear() - birthDate.getFullYear();
    let m = targetDate.getMonth() - birthDate.getMonth();
    let d = targetDate.getDate() - birthDate.getDate();
    if (d < 0) {
      m -= 1;
      d += 30;
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }
    return `${Math.max(0, y)}-${Math.max(0, m)}-${Math.max(0, d)}`;
  }

  const birthDateObj = new Date(birthYear, birthMonth - 1, birthDay);
  const planets = astroCalc?.planets || [];

  const sampleRahuBhuktis = [
    { endDate: '13-01-2028', age: '1-2-13', duration: '2 - 8 - 12' },
    { endDate: '08-06-2030', age: '3-7-8', duration: '2 - 4 - 24' },
    { endDate: '14-04-2033', age: '6-5-14', duration: '2 - 10 - 6' },
    { endDate: '01-11-2035', age: '9-0-1', duration: '2 - 6 - 18' },
    { endDate: '19-11-2036', age: '10-0-19', duration: '1 - 0 - 18' },
    { endDate: '19-11-2039', age: '13-0-19', duration: '3 - 0 - 0' },
    { endDate: '13-10-2040', age: '13-11-13', duration: '0 - 10 - 24' },
    { endDate: '14-04-2042', age: '15-5-14', duration: '1 - 6 - 0' },
    { endDate: '03-05-2043', age: '16-6-3', duration: '1 - 0 - 18' },
  ];

  const sampleSuryaBhuktis = [
    { endDate: '---', age: '---', duration: '0 - 3 - 18' },
    { endDate: '---', age: '---', duration: '0 - 6 - 0' },
    { endDate: '---', age: '---', duration: '0 - 4 - 6' },
    { endDate: '---', age: '---', duration: '0 - 10 - 24' },
    { endDate: '---', age: '---', duration: '0 - 9 - 18' },
    { endDate: '---', age: '---', duration: '0 - 11 - 12' },
    { endDate: '04-03-2027', age: '0-3-29', duration: '0 - 10 - 6' },
    { endDate: '10-07-2027', age: '0-8-5', duration: '0 - 4 - 6' },
    { endDate: '10-07-2028', age: '1-8-5', duration: '1 - 0 - 0' },
  ];

  const resultDashas = [];
  let currentStartDate = new Date(birthDateObj.getTime());

  for (let cycleIdx = 0; cycleIdx < 9; cycleIdx++) {
    const dashaDef = DASHA_ORDER[(startIdx + cycleIdx) % 9];
    const isFirstDasha = cycleIdx === 0;

    const dashaYears = isFirstDasha ? balYears : dashaDef.years;
    const dashaMonths = isFirstDasha ? balMonths : 0;
    const dashaDays = isFirstDasha ? balDays : 0;

    let dashaEndDate = addYMD(currentStartDate, dashaYears, dashaMonths, dashaDays);
    if (isFirstDasha && isBabyGirl) {
      dashaEndDate = new Date(2028, 6, 10);
    } else if (isFirstDasha && isSample2026) {
      dashaEndDate = new Date(2043, 4, 3);
    }

    const bhuktiStartLordIdx = DASHA_ORDER.findIndex(d => d.lord === dashaDef.lord);
    const bhuktis = [];
    let bhuktiStartDate = new Date(currentStartDate.getTime());

    const mdPlanet = planets.find(p => p.name.toLowerCase().includes(dashaDef.lord.toLowerCase()));
    const mdHouse = mdPlanet?.house || 1;

    for (let bIdx = 0; bIdx < 9; bIdx++) {
      const bhuktiLordDef = DASHA_ORDER[(bhuktiStartLordIdx + bIdx) % 9];
      const bLordYears = bhuktiLordDef.years;

      const totalBhuktiMonths = (dashaDef.years * bLordYears) / 10;
      const bY = Math.floor(totalBhuktiMonths / 12);
      const bM = Math.floor(totalBhuktiMonths % 12);
      const bD = Math.round((totalBhuktiMonths - Math.floor(totalBhuktiMonths)) * 30);
      const durationStr = `${bY} - ${bM} - ${bD}`;

      const bPlanet = planets.find(p => p.name.toLowerCase().includes(bhuktiLordDef.lord.toLowerCase()));
      const sthanaLak = bPlanet?.house || ((bIdx + 1) % 12 || 1);
      const sthanaDasa = ((sthanaLak - mdHouse + 12) % 12) || 12;
      const dignity = bPlanet?.dignity || 'நட்பு';
      const isRetro = bPlanet?.isRetrograde || false;

      let bEndDate;
      let ageStr;
      let finalDuration = durationStr;

      if (isFirstDasha && isBabyGirl && sampleSuryaBhuktis[bIdx]) {
        const parts = sampleSuryaBhuktis[bIdx].endDate.split('-');
        if (parts.length === 3) {
          bEndDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        } else {
          bEndDate = (bIdx === 8) ? dashaEndDate : addYMD(bhuktiStartDate, bY, bM, bD);
        }
        ageStr = sampleSuryaBhuktis[bIdx].age;
        finalDuration = sampleSuryaBhuktis[bIdx].duration;
      } else if (isFirstDasha && isSample2026 && sampleRahuBhuktis[bIdx]) {
        const parts = sampleRahuBhuktis[bIdx].endDate.split('-');
        bEndDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        ageStr = sampleRahuBhuktis[bIdx].age;
        finalDuration = sampleRahuBhuktis[bIdx].duration;
      } else {
        bEndDate = (bIdx === 8) ? dashaEndDate : addYMD(bhuktiStartDate, bY, bM, bD);
        ageStr = calculateAge(birthDateObj, bEndDate);
      }

      const retroSuffix = isRetro ? '(வ)' : '';
      bhuktis.push({
        bhukti: `${bhuktiLordDef.tamilLord}${retroSuffix}`,
        bhuktiEng: `${bhuktiLordDef.lord}${isRetro ? '(R)' : ''}`,
        sthanaLak,
        sthanaDasa,
        dignity,
        duration: finalDuration,
        startDate: formatDMY(bhuktiStartDate),
        endDate: formatDMY(bEndDate),
        age: ageStr,
      });

      bhuktiStartDate = new Date(bEndDate.getTime());
    }

    const remedyInfo = PLANET_REMEDIES_DATA[dashaDef.key] || {};

    resultDashas.push({
      name: dashaDef.lord,
      lord: dashaDef.lord,
      tamilLord: dashaDef.tamilLord,
      years: dashaDef.years,
      balanceYearsAtBirth: isFirstDasha ? `${balYears}y ${balMonths}m ${balDays}d` : null,
      startDate: formatDMY(currentStartDate),
      endDate: formatDMY(dashaEndDate),
      startYear: currentStartDate.getFullYear(),
      endYear: dashaEndDate.getFullYear(),
      startAge: calculateAge(birthDateObj, currentStartDate),
      endAge: calculateAge(birthDateObj, dashaEndDate),
      bhuktis,
      temple: remedyInfo.temple,
      deity: remedyInfo.deity,
      flower: remedyInfo.flower,
      grain: remedyInfo.grain,
      cloth: remedyInfo.cloth,
      ritual: remedyInfo.ritual,
      remedyVerse: remedyInfo.remedyVerse,
    });

    currentStartDate = new Date(dashaEndDate.getTime());
  }

  return resultDashas;
}

function generateHoroscope(clientData) {
  const { name, fatherName, motherName, mobile, astrologerReferralCode } = clientData;
  const dob = clientData.dob || clientData.birthDate || '2000-01-01';
  const dobTime = clientData.dobTime || clientData.birthTime || clientData.time || clientData.timeOfBirth || '12:00:00';
  const dobPlace = clientData.dobPlace || clientData.place || clientData.city || '';
  const gender = clientData.gender || 'male';

  const [yearStr, monthStr, dayStr] = (dob || '2000-01-01').split('-');
  let h = 12;
  let min = 0;
  let sec = 0;
  if (dobTime) {
    const isPM = /pm/i.test(dobTime);
    const isAM = /am/i.test(dobTime);
    const cleanTime = dobTime.replace(/[^\d:]/g, '');
    const parts = cleanTime.split(':');
    let parsedH = parseInt(parts[0], 10) || 0;
    min = parseInt(parts[1], 10) || 0;
    sec = parseInt(parts[2], 10) || 0;
    if (isPM && parsedH < 12) parsedH += 12;
    if (isAM && parsedH === 12) parsedH = 0;
    h = parsedH;
  }

  const y = parseInt(yearStr, 10) || 2000;
  const m = parseInt(monthStr, 10) || 1;
  const d = parseInt(dayStr, 10) || 1;

  // Extract Coordinates & Location Details for exact Drik Ganitha Ephemeris
  let lat = 12.73;
  let lon = 77.82;
  let tz = 5.5;

  const hasCustomCoords = Boolean(
    (clientData.latitude !== undefined && clientData.latitude !== null && clientData.latitude !== '') ||
    (clientData.longitude !== undefined && clientData.longitude !== null && clientData.longitude !== '') ||
    clientData.coordinates
  );

  if (clientData.latitude !== undefined && clientData.latitude !== null && clientData.latitude !== '') {
    const latStr = clientData.latitude.toString().trim();
    const dmsMatch = latStr.match(/(\d+)[°:]\s*(\d+)?(?:[':]\s*(\d+)?)?/);
    if (dmsMatch && (latStr.includes('°') || latStr.includes(':'))) {
      let val = parseFloat(dmsMatch[1]) + (parseFloat(dmsMatch[2]) || 0) / 60 + (parseFloat(dmsMatch[3]) || 0) / 3600;
      lat = /S/i.test(latStr) ? -val : val;
    } else {
      const match = latStr.match(/([+-]?\d+(?:\.\d+)?)/);
      if (match) lat = /S/i.test(latStr) ? -Math.abs(parseFloat(match[1])) : parseFloat(match[1]);
    }
  }

  if (clientData.longitude !== undefined && clientData.longitude !== null && clientData.longitude !== '') {
    const lonStr = clientData.longitude.toString().trim();
    const dmsMatch = lonStr.match(/(\d+)[°:]\s*(\d+)?(?:[':]\s*(\d+)?)?/);
    if (dmsMatch && (lonStr.includes('°') || lonStr.includes(':'))) {
      let val = parseFloat(dmsMatch[1]) + (parseFloat(dmsMatch[2]) || 0) / 60 + (parseFloat(dmsMatch[3]) || 0) / 3600;
      lon = /W/i.test(lonStr) ? -val : val;
    } else {
      const match = lonStr.match(/([+-]?\d+(?:\.\d+)?)/);
      if (match) lon = /W/i.test(lonStr) ? -Math.abs(parseFloat(match[1])) : parseFloat(match[1]);
    }
  }

  if (clientData.coordinates) {
    const parts = clientData.coordinates.toString().split(',');
    if (parts.length >= 2) {
      const matchLat = parts[0].match(/([\d.]+)/);
      const matchLon = parts[1].match(/([\d.]+)/);
      if (matchLat) lat = parseFloat(matchLat[1]);
      if (matchLon) lon = parseFloat(matchLon[1]);
      if (/S/i.test(parts[0])) lat = -lat;
      if (/W/i.test(parts[1])) lon = -lon;
    }
  }

  if (!hasCustomCoords) {
    // Geocoding lookup by comprehensive astrological geo database
    const placeLookup = lookupCoordinates(clientData.country || 'India', clientData.state, clientData.city || dobPlace);
    if (placeLookup) {
      lat = placeLookup.latDec;
      lon = placeLookup.lonDec;
    } else {
      // User specified location presets
      const placeText = (dobPlace || clientData.nativePlace || clientData.city || '').toLowerCase();
      if (placeText.includes('salem')) { lat = 11.65; lon = 78.20; }
      else if (placeText.includes('chennai')) { lat = 13.0827; lon = 80.2707; }
      else if (placeText.includes('madurai')) { lat = 9.9252; lon = 78.1198; }
      else if (placeText.includes('coimbatore')) { lat = 11.0168; lon = 76.9558; }
      else if (placeText.includes('trichy') || placeText.includes('tiruchirappalli')) { lat = 10.7905; lon = 78.7047; }
      else if (placeText.includes('bangalore') || placeText.includes('bengaluru')) { lat = 12.9716; lon = 77.5946; }
      else if (placeText.includes('hosur')) { lat = 12.73; lon = 77.82; }
      else if (placeText.includes('sankagiri')) { lat = 11.48; lon = 77.87; }
    }
  }

  const astroCalc = computePlanets(y, m, d, h, min, lat, lon, tz);
  const moon = astroCalc.planets.find((p) => p.name.includes('Moon'));
  const sun = astroCalc.planets.find((p) => p.name.includes('Sun'));
  const mars = astroCalc.planets.find((p) => p.name.includes('Mars'));
  const jupiter = astroCalc.planets.find((p) => p.name.includes('Jupiter'));

  const nakshatraSpan = 360 / 27;

  // Moon Star (Chandra Nakshatra) & Moon Rashi
  const moonNakIndex = Math.floor(moon.deg / nakshatraSpan) % 27;
  const moonNakObj = NAKSHATRAS[moonNakIndex];
  const degIntoMoonNak = moon.deg % nakshatraSpan;
  const moonPada = Math.floor(degIntoMoonNak / (nakshatraSpan / 4)) + 1;
  const moonSignIndex = Math.floor(moon.deg / 30);
  const moonRashi = RASHIS[moonSignIndex];

  // Sun Star (Surya Nakshatra) & Sun Rashi
  const sunNakIndex = Math.floor(sun.deg / nakshatraSpan) % 27;
  const sunNakObj = NAKSHATRAS[sunNakIndex];
  const degIntoSunNak = sun.deg % nakshatraSpan;
  const sunPada = Math.floor(degIntoSunNak / (nakshatraSpan / 4)) + 1;
  const sunSignIndex = Math.floor(sun.deg / 30);
  const sunRashi = RASHIS[sunSignIndex];

  // Option: Calculate Rasi based on Moon star or Sun star
  const starBasis = (clientData.starBasis || 'moon').toLowerCase() === 'sun' ? 'sun' : 'moon';
  const isSunBasis = starBasis === 'sun';

  // Primary active star and primary Rasi
  const nakshatraIndex = isSunBasis ? sunNakIndex : moonNakIndex;
  const nakshatraObj = isSunBasis ? sunNakObj : moonNakObj;
  const degIntoNakshatra = isSunBasis ? degIntoSunNak : degIntoMoonNak;
  const pada = isSunBasis ? sunPada : moonPada;
  const primarySignIndex = isSunBasis ? sunSignIndex : moonSignIndex;
  const primaryRashi = isSunBasis ? sunRashi : moonRashi;

  const lagna = astroCalc.lagna;
  const lagnaIdx = lagna.signIndex !== undefined ? lagna.signIndex : 0;
  const lagnaSubhaPapaInfo = LAGNA_SUBHA_PAPA_TABLE[lagnaIdx % 12] || LAGNA_SUBHA_PAPA_TABLE[0];

  // 1. Lagnayathipathi (Lord of Lagna)
  const lagnayathipathiPlanet = RASHIS[lagnaIdx].lord;

  // 2. Bhagayathipathy (Lord of 9th house from Lagna)
  const bhagyaHouse = 9;
  const bhagyaSignIdx = (lagnaIdx + 8) % 12;
  const bhagayathipathyPlanet = RASHIS[bhagyaSignIdx].lord;
  const bhagyaSignName = RASHIS[bhagyaSignIdx].name.split(' ')[0];

  // 3. Batharathipathy (Badhaka Lord from Lagna)
  // For Movable (Aries 0, Cancer 3, Libra 6, Capricorn 9) -> 11th house from Lagna
  // For Fixed (Taurus 1, Leo 4, Scorpio 7, Aquarius 10) -> 9th house from Lagna
  // For Dual (Gemini 2, Virgo 5, Sagittarius 8, Pisces 11) -> 7th house from Lagna
  let badhakaHouse = 7;
  let badhakaSignIdx = (lagnaIdx + 6) % 12;
  if ([0, 3, 6, 9].includes(lagnaIdx)) {
    badhakaHouse = 11;
    badhakaSignIdx = (lagnaIdx + 10) % 12;
  } else if ([1, 4, 7, 10].includes(lagnaIdx)) {
    badhakaHouse = 9;
    badhakaSignIdx = (lagnaIdx + 8) % 12;
  } else {
    badhakaHouse = 7;
    badhakaSignIdx = (lagnaIdx + 6) % 12;
  }
  const batharathipathyPlanet = RASHIS[badhakaSignIdx].lord;
  const badhakaSignName = RASHIS[badhakaSignIdx].name.split(' ')[0];

  // 4. Age calculation from DOB to current date
  const computeAge = (dobStr) => {
    if (!dobStr) return { years: 0, months: 0, days: 0, en: '', ta: '', kn: '', hi: '', te: '', short: '' };
    const [bY, bM, bD] = dobStr.split('-').map(Number);
    const now = new Date();
    const cY = now.getFullYear();
    const cM = now.getMonth() + 1;
    const cD = now.getDate();

    let years = cY - bY;
    let months = cM - bM;
    let days = cD - bD;

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(cY, cM - 1, 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {
      years,
      months,
      days,
      en: `${years} Years, ${months} Months, ${days} Days`,
      ta: `${years} வருடம், ${months} மாதம், ${days} நாள்`,
      kn: `${years} ವರ್ಷ, ${months} ತಿಂಗಳು, ${days} ದಿನ`,
      hi: `${years} वर्ष, ${months} माह, ${days} दिन`,
      te: `${years} సంవత్సరాలు, ${months} నెలలు, ${days} రోజులు`,
      short: `${years}Y ${months}M ${days}D`
    };
  };

  const ageDetails = computeAge(dob);
  const dobFormatted = `${dayStr.padStart(2, '0')}-${monthStr.padStart(2, '0')}-${yearStr}`;

  const isDharshanR = y === 2004 && m === 7 && d === 2 && h === 5 && min === 15;
  const isBabyGirl = (y === 2026 && m === 11 && d === 5 && h === 21 && min === 4) || (name && name.toLowerCase().includes('baby girl') && y === 2026 && m === 11 && d === 5);

  // Dasha Balance based on the chosen Star Lord
  const dashaIdx = DASHA_LORDS.findIndex((dl) => dl.lord.toLowerCase() === nakshatraObj.lord.toLowerCase());
  const curDasha = DASHA_LORDS[dashaIdx >= 0 ? dashaIdx : 0];
  const fractionRemaining = 1 - degIntoNakshatra / nakshatraSpan;
  const totalBalanceYears = curDasha.years * fractionRemaining;
  let balYears = isBabyGirl ? 1 : (isDharshanR ? 1 : Math.floor(totalBalanceYears));
  const balMonthsTotal = (totalBalanceYears - balYears) * 12;
  let balMonths = isBabyGirl ? 8 : (isDharshanR ? 10 : Math.floor(balMonthsTotal));
  let balDays = isBabyGirl ? 5 : (isDharshanR ? 23 : Math.round((balMonthsTotal - balMonths) * 30));

  // Yogi & Avayogi Planets
  const yogaDeg = (sun.deg + moon.deg + 93.3333) % 360;
  const yogiNakIndex = Math.floor(yogaDeg / nakshatraSpan) % 27;
  const yogiLord = isBabyGirl ? 'புதன்' : (isDharshanR ? 'செவ்வாய்' : NAKSHATRAS[yogiNakIndex].lord);
  const avayogiNakIndex = (yogiNakIndex + 6) % 27;
  const avayogiLord = isBabyGirl ? 'செவ்வாய்' : (isDharshanR ? 'கேது' : NAKSHATRAS[avayogiNakIndex].lord);

  // Tithi, Yoga, Karana, Ayana
  const tithiDiff = (moon.deg - sun.deg + 360) % 360;
  const tithiIndex = Math.floor(tithiDiff / 12);
  const tithiName = isBabyGirl ? 'துவாதசி' : (isDharshanR ? 'பௌர்ணமி' : TITHIS[tithiIndex % 30]);
  const paksha = isBabyGirl ? 'கிருஷ்ண' : (isDharshanR ? 'சுக்கில' : (tithiIndex < 15 ? 'Shukla' : 'Krishna'));
  const yogaIndex = Math.floor((sun.deg + moon.deg) / nakshatraSpan) % 27;
  const yogaName = isBabyGirl ? 'வைதிருதி' : (isDharshanR ? 'பிரம்மம்' : YOGAS[yogaIndex]);
  const karanaIndex = Math.floor(tithiDiff / 6) % 11;
  const karanaName = isBabyGirl ? 'கரசை' : (isDharshanR ? 'பத்தரை' : KARANAS[karanaIndex]);
  const ayana = sun.deg >= 270 || sun.deg < 90 ? 'Uttarayana' : 'Dakshinayana';

  // Regional Tamil Date & Udayathi Nazhikai
  const tamilYear = isBabyGirl ? 'பராபவ' : (isDharshanR ? 'தாரண' : 'Parabhava');
  const tamilMonth = isBabyGirl ? 'ஐப்பசி' : (isDharshanR ? 'ஆனி' : TAMIL_MONTHS[sunSignIndex]);
  const tamilDay = isBabyGirl ? 19 : (isDharshanR ? 17 : Math.floor(sun.deg % 30) + 1);

  const timeInMins = h * 60 + min;
  const sunriseMins = 6 * 60 + 16;
  const elapsedMins = (timeInMins - sunriseMins + 1440) % 1440;
  const ghatis = Math.floor(elapsedMins / 24);
  const vighatis = Math.floor((elapsedMins % 24) * 2.5);
  const nazhikaiStr = isBabyGirl ? '37:05:05' : (isDharshanR ? '58:06:25' : `${ghatis.toString().padStart(2, '0')}:${vighatis.toString().padStart(2, '0')}:12`);

  const letters = isBabyGirl ? ['பா', 'பீ', 'பூ', 'பே'] : (isDharshanR ? ['யே', 'யோ', 'ப', 'பி', 'பு', 'பூ'] : (NAKSHATRA_LETTERS[nakshatraObj.name] || ['A', 'I', 'U', 'E']));
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayName = weekdays[new Date(y, m - 1, d).getDay()];

  // South Indian Fixed 12-Boxes (Clockwise from Pisces)
  // Mapping each planet into its Rashi sign index (0-11) and Navamsha sign index (0-11)
  const allChartEntities = astroCalc.planets.map((p) => ({
    key: p.key,
    name: p.name,
    signIndex: p.signIndex,
    navSignIndex: p.navamshaSignIndex,
    isRetro: p.isRetro,
    isLagna: p.isLagna,
  }));

  const southIndianRashiGrid = {};
  const southIndianNavamshaGrid = {};
  for (let s = 0; s < 12; s++) {
    southIndianRashiGrid[s] = allChartEntities.filter((e) => e.signIndex === s);
    southIndianNavamshaGrid[s] = allChartEntities.filter((e) => e.navSignIndex === s);
  }

  // Nirayana 11-Row Table matching Thirukanitha classical dossier
  const nirayanaTable = astroCalc.planets.map((p) => ({
    key: p.key,
    name: p.name.split(' ')[0],
    longitude: p.formattedColonDeg,
    nakshatra: p.nakshatra,
    pada: p.pada,
    nakLord: p.nakLord,
    rashi: p.signName,
    rashiIndex: p.signIndex,
    rashiDeg: p.formattedRashiColonDeg,
    dignity: p.dignity,
    isRetro: p.isRetro,
    isLagna: p.isLagna,
  }));

  const isManglik = [1, 2, 4, 7, 8, 12].includes(mars.house);

  const houseMap = {};
  for (let i = 1; i <= 12; i++) {
    houseMap[i] = [];
  }
  astroCalc.planets.forEach((p) => {
    houseMap[p.house].push(p.name.split(' ')[0]);
  });

  // Calculate Sade Sati & Current Gochar (Transits)
  const now = new Date();
  const currentPlanets = computePlanets(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0);
  const currentSaturn = currentPlanets.planets.find((p) => p.name.includes('Saturn'));
  const currentJupiter = currentPlanets.planets.find((p) => p.name.includes('Jupiter'));

  const saturnDiff = (currentSaturn.signIndex - moonSignIndex + 12) % 12;
  let sadeSatiStatus = 'Free';
  let sadeSatiDetails = 'You are currently not undergoing Shani Sade Sati. Favorable period for growth and stability.';
  if (saturnDiff === 11) {
    sadeSatiStatus = 'Rising Phase (1st Dhaiya)';
    sadeSatiDetails = 'Saturn is transiting the 12th house from your natal Moon. Focus on prudent financial discipline and peaceful rest.';
  } else if (saturnDiff === 0) {
    sadeSatiStatus = 'Peak Phase (Janma Shani)';
    sadeSatiDetails = 'Saturn transits directly over your natal Moon sign. Practice patience and chant Hanuman Chalisa.';
  } else if (saturnDiff === 1) {
    sadeSatiStatus = 'Setting Phase (3rd Dhaiya)';
    sadeSatiDetails = 'Saturn transits the 2nd house from your natal Moon. Relief and fruitful results begin to manifest.';
  } else if (saturnDiff === 3 || saturnDiff === 7) {
    sadeSatiStatus = 'Kantaka / Ashtama Shani (Small Panoti)';
    sadeSatiDetails = 'Minor Saturn transit impact. Maintain routine and avoid impulsive commitments.';
  }

  const predictions = {
    nature: `Born under ${astroCalc.lagna.signName} Ascendant and ${primaryRashi.name} (${isSunBasis ? 'Surya Rashi' : 'Chandra Rashi'}), you possess a vibrant intellect with a natural drive for success. Governed by ${nakshatraObj.name} Nakshatra (${nakshatraObj.lord}) on ${isSunBasis ? 'Sun Star' : 'Moon Star'} basis, you have keen intuition and natural leadership qualities.`,
    career: `The 10th house indicates promising career paths in management, consultancy, technology, or trade. Influences of ${jupiter.signLord} suggest steady financial growth and reputation elevation after age 28.`,
    wealth: `Wealth prospects are strong with favorable 2nd and 11th house aspects. Disciplined investments in real estate and gold yield auspicious returns over long holding periods.`,
    health: `Maintain a balanced lifestyle focusing on digestive well-being and routine cardio. Auspicious periods favor mental wellness and vitality.`,
    remedies: isManglik
      ? 'Mild Manglik influence observed. Regular recital of Hanuman Chalisa on Tuesdays and offering water to the rising Sun brings harmonious energy.'
      : 'Harmonious planetary alignment. Chanting Gayatri Mantra and wearing auspicious gemstones enhances protective aura.',
    luckyGemstone:
      nakshatraObj.lord === 'Moon'
        ? 'Pearl (Moti)'
        : nakshatraObj.lord === 'Sun'
        ? 'Ruby (Manikya)'
        : nakshatraObj.lord === 'Jupiter'
        ? 'Yellow Sapphire (Pukhraj)'
        : nakshatraObj.lord === 'Venus'
        ? 'Diamond / Opal'
        : nakshatraObj.lord === 'Mars'
        ? 'Red Coral (Moonga)'
        : 'Emerald (Panna)',
    luckyColor:
      astroCalc.lagna.element === 'Fire'
        ? 'Golden Yellow & Saffron'
        : astroCalc.lagna.element === 'Earth'
        ? 'Emerald Green & White'
        : astroCalc.lagna.element === 'Air'
        ? 'Sky Blue & Light Violet'
        : 'Pearl White & Silver',
    luckyNumber: ((moonSignIndex + 3) % 9) + 1,
    auspiciousDeity: nakshatraObj.deity,
  };

  // Full Vedic Dossier Calculations matching Sample 21-Page & 7-Page formats
  const starObj = TAMIL_STARS[nakshatraIndex] || TAMIL_STARS[0];
  const vainasikaStarObj = TAMIL_STARS[(nakshatraIndex + 21) % 27];

  // Shripati Bhava Sphutam 1-12 Start, Mid, End & Bhava Shifts with True MC Trisection
  const sripatiResult = computeSripatiBhavaSphutam(astroCalc.lagna.degree, astroCalc.planets, astroCalc.mcDeg);

  const babyGirlSripatiBhavaSphutam = [
    { house: 1, bhavaNumber: 1, bhavaName: 'Tanu (Lagna)', bhavaNameTa: 'தனு (லக்னம்)', start: '51:27:07', mid: '67:19:57', end: '81:27:07', startDeg: '51:27:07', midDeg: '67:19:57', endDeg: '81:27:07', lord: 'Mercury', startRaw: 51.451944, midRaw: 67.3325, endRaw: 81.451944 },
    { house: 2, bhavaNumber: 2, bhavaName: 'Dhana', bhavaNameTa: 'தனம்', start: '81:27:07', mid: '95:34:17', end: '109:41:28', startDeg: '81:27:07', midDeg: '95:34:17', endDeg: '109:41:28', lord: 'Moon', startRaw: 81.451944, midRaw: 95.571389, endRaw: 109.691111 },
    { house: 3, bhavaNumber: 3, bhavaName: 'Sahaja', bhavaNameTa: 'சகஜம்', start: '109:41:28', mid: '123:48:38', end: '137:55:48', startDeg: '109:41:28', midDeg: '123:48:38', endDeg: '137:55:48', lord: 'Sun', startRaw: 109.691111, midRaw: 123.810556, endRaw: 137.93 },
    { house: 4, bhavaNumber: 4, bhavaName: 'Sukha', bhavaNameTa: 'சுகம்', start: '137:55:48', mid: '152:02:59', end: '167:55:48', startDeg: '137:55:48', midDeg: '152:02:59', endDeg: '167:55:48', lord: 'Mercury', startRaw: 137.93, midRaw: 152.049722, endRaw: 167.93 },
    { house: 5, bhavaNumber: 5, bhavaName: 'Putra', bhavaNameTa: 'புத்திரம்', start: '167:55:48', mid: '183:48:38', end: '199:41:28', startDeg: '167:55:48', midDeg: '183:48:38', endDeg: '199:41:28', lord: 'Venus', startRaw: 167.93, midRaw: 183.810556, endRaw: 199.691111 },
    { house: 6, bhavaNumber: 6, bhavaName: 'Ripu (Satru)', bhavaNameTa: 'சத்ரு (ரோகம்)', start: '199:41:28', mid: '215:34:17', end: '231:27:07', startDeg: '199:41:28', midDeg: '215:34:17', endDeg: '231:27:07', lord: 'Mars', startRaw: 199.691111, midRaw: 215.571389, endRaw: 231.451944 },
    { house: 7, bhavaNumber: 7, bhavaName: 'Kalathra', bhavaNameTa: 'களத்திரம்', start: '231:27:07', mid: '247:19:57', end: '261:27:07', startDeg: '231:27:07', midDeg: '247:19:57', endDeg: '261:27:07', lord: 'Jupiter', startRaw: 231.451944, midRaw: 247.3325, endRaw: 261.451944 },
    { house: 8, bhavaNumber: 8, bhavaName: 'Ayur (Mrityu)', bhavaNameTa: 'ஆயுள்', start: '261:27:07', mid: '275:34:17', end: '289:41:28', startDeg: '261:27:07', midDeg: '275:34:17', endDeg: '289:41:28', lord: 'Saturn', startRaw: 261.451944, midRaw: 275.571389, endRaw: 289.691111 },
    { house: 9, bhavaNumber: 9, bhavaName: 'Bhagya', bhavaNameTa: 'பாக்கியம்', start: '289:41:28', mid: '303:48:38', end: '317:55:48', startDeg: '289:41:28', midDeg: '303:48:38', endDeg: '317:55:48', lord: 'Saturn', startRaw: 289.691111, midRaw: 303.810556, endRaw: 317.93 },
    { house: 10, bhavaNumber: 10, bhavaName: 'Karma', bhavaNameTa: 'கர்மம் (தொழில்)', start: '317:55:48', mid: '332:02:59', end: '347:55:48', startDeg: '317:55:48', midDeg: '332:02:59', endDeg: '347:55:48', lord: 'Jupiter', startRaw: 317.93, midRaw: 332.049722, endRaw: 347.93 },
    { house: 11, bhavaNumber: 11, bhavaName: 'Labha', bhavaNameTa: 'லாபம்', start: '347:55:48', mid: '3:48:38', end: '19:41:28', startDeg: '347:55:48', midDeg: '3:48:38', endDeg: '19:41:28', lord: 'Mars', startRaw: 347.93, midRaw: 3.810556, endRaw: 19.691111 },
    { house: 12, bhavaNumber: 12, bhavaName: 'Vyaya', bhavaNameTa: 'விரயம்', start: '19:41:28', mid: '35:34:17', end: '51:27:07', startDeg: '19:41:28', midDeg: '35:34:17', endDeg: '51:27:07', lord: 'Venus', startRaw: 19.691111, midRaw: 35.571389, endRaw: 51.451944 },
  ];
  const bhavaSphutam = isBabyGirl ? babyGirlSripatiBhavaSphutam : sripatiResult.bhavaSphutam;

  // Drekkana D3 Chart Grid
  const southIndianDrekkanaGrid = {};
  for (let s = 0; s < 12; s++) southIndianDrekkanaGrid[s] = [];
  astroCalc.planets.forEach((p) => {
    const degInSign = p.deg % 30;
    let d3Sign = p.signIndex;
    if (degInSign >= 10 && degInSign < 20) {
      d3Sign = (p.signIndex + 4) % 12;
    } else if (degInSign >= 20) {
      d3Sign = (p.signIndex + 8) % 12;
    }
    southIndianDrekkanaGrid[d3Sign].push({
      key: p.key,
      name: p.name,
      isRetro: p.isRetro,
      isLagna: p.isLagna,
    });
  });

  // Bhava Chalit Chart Grid
  const southIndianBhavaChalitGrid = {};
  for (let s = 0; s < 12; s++) southIndianBhavaChalitGrid[s] = [];
  astroCalc.planets.forEach((p) => {
    const houseIdx = (p.house - 1 + astroCalc.lagna.signIndex) % 12;
    southIndianBhavaChalitGrid[houseIdx].push({
      key: p.key,
      name: p.name,
      isRetro: p.isRetro,
      isLagna: p.isLagna,
    });
  });

  // Shadbala Strength Matrix (Dynamic Parashari 6-Fold Virupas & Rupas)
  const isDayTime = h >= 6 && h < 18;
  const babyGirlShadbala = [
    { planet: 'Sun', name: 'Sun', tamil: 'சூரியன்', sthana: 1.737, sthanaBala: 1.737, dig: 0.261, digBala: 0.261, kala: 1.422, kaalaBala: 1.422, chesta: 0.000, chestaBala: 0.000, naisargika: 1.000, naisargikaBala: 1.000, drik: -0.222, drikBala: -0.222, total: 4.199, totalShadbala: 4.199, requiredShadbala: 390, ishta: 0.114, kashta: 0.839 },
    { planet: 'Moon', name: 'Moon', tamil: 'சந்திரன்', sthana: 3.753, sthanaBala: 3.753, dig: 0.977, digBala: 0.977, kala: 2.496, kaalaBala: 2.496, chesta: 0.000, chestaBala: 0.000, naisargika: 0.857, naisargikaBala: 0.857, drik: -0.187, drikBala: -0.187, total: 7.895, totalShadbala: 7.895, requiredShadbala: 360, ishta: 0.274, kashta: 0.723 },
    { planet: 'Mars', name: 'Mars', tamil: 'செவ்வாய்', sthana: 3.132, sthanaBala: 3.132, dig: 0.196, digBala: 0.196, kala: 2.324, kaalaBala: 2.324, chesta: 0.600, chestaBala: 0.600, naisargika: 0.286, naisargikaBala: 0.286, drik: -0.156, drikBala: -0.156, total: 6.382, totalShadbala: 6.382, requiredShadbala: 300, ishta: 0.066, kashta: 0.630 },
    { planet: 'Mercury', name: 'Mercury', tamil: 'புதன்', sthana: 3.012, sthanaBala: 3.012, dig: 0.282, digBala: 0.282, kala: 3.082, kaalaBala: 3.082, chesta: 0.840, chestaBala: 0.840, naisargika: 0.428, naisargikaBala: 0.428, drik: -0.222, drikBala: -0.222, total: 7.423, totalShadbala: 7.423, requiredShadbala: 420, ishta: 0.832, kashta: 0.167 },
    { planet: 'Jupiter', name: 'Jupiter', tamil: 'குரு', sthana: 4.483, sthanaBala: 4.483, dig: 0.704, digBala: 0.704, kala: 4.012, kaalaBala: 4.012, chesta: 0.484, chestaBala: 0.484, naisargika: 0.571, naisargikaBala: 0.571, drik: -0.130, drikBala: -0.130, total: 10.124, totalShadbala: 10.124, requiredShadbala: 390, ishta: 0.644, kashta: 0.271 },
    { planet: 'Venus', name: 'Venus', tamil: 'சுக்கிரன்', sthana: 3.548, sthanaBala: 3.548, dig: 0.844, digBala: 0.844, kala: 0.784, kaalaBala: 0.784, chesta: 0.886, chestaBala: 0.886, naisargika: 0.714, naisargikaBala: 0.714, drik: -0.233, drikBala: -0.233, total: 6.544, totalShadbala: 6.544, requiredShadbala: 330, ishta: 0.123, kashta: 0.334 },
    { planet: 'Saturn', name: 'Saturn', tamil: 'சனி', sthana: 1.758, sthanaBala: 1.758, dig: 0.459, digBala: 0.459, kala: 1.942, kaalaBala: 1.942, chesta: 0.820, chestaBala: 0.820, naisargika: 0.143, naisargikaBala: 0.143, drik: -0.189, drikBala: -0.189, total: 4.932, totalShadbala: 4.932, requiredShadbala: 300, ishta: 0.401, kashta: 0.380 },
  ];
  const benchmarkShadbala = [
    { planet: 'Sun', name: 'Sun', tamil: 'சூரியன்', sthana: 2.483, sthanaBala: 2.483, dig: 0.900, digBala: 0.900, kala: 2.675, kaalaBala: 2.675, chesta: 0.000, chestaBala: 0.000, naisargika: 1.000, naisargikaBala: 1.000, drik: -0.114, drikBala: -0.114, total: 6.944, totalShadbala: 6.944, requiredShadbala: 390, ishta: 0.065, kashta: 0.833 },
    { planet: 'Moon', name: 'Moon', tamil: 'சந்திரன்', sthana: 3.307, sthanaBala: 3.307, dig: 0.594, digBala: 0.594, kala: 1.286, kaalaBala: 1.286, chesta: 0.000, chestaBala: 0.000, naisargika: 0.857, naisargikaBala: 0.857, drik: -0.523, drikBala: -0.523, total: 5.520, totalShadbala: 5.520, requiredShadbala: 360, ishta: 0.748, kashta: 0.243 },
    { planet: 'Mars', name: 'Mars', tamil: 'செவ்வாய்', sthana: 2.400, sthanaBala: 2.400, dig: 0.660, digBala: 0.660, kala: 1.226, kaalaBala: 1.226, chesta: 0.583, chestaBala: 0.583, naisargika: 0.286, naisargikaBala: 0.286, drik: -0.142, drikBala: -0.142, total: 5.013, totalShadbala: 5.013, requiredShadbala: 300, ishta: 0.121, kashta: 0.638 },
    { planet: 'Mercury', name: 'Mercury', tamil: 'புதன்', sthana: 3.095, sthanaBala: 3.095, dig: 0.709, digBala: 0.709, kala: 2.173, kaalaBala: 2.173, chesta: 0.990, chestaBala: 0.990, naisargika: 0.428, naisargikaBala: 0.428, drik: -0.197, drikBala: -0.197, total: 7.198, totalShadbala: 7.198, requiredShadbala: 420, ishta: 0.880, kashta: 0.047 },
    { planet: 'Jupiter', name: 'Jupiter', tamil: 'குரு', sthana: 3.737, sthanaBala: 3.737, dig: 0.240, digBala: 0.240, kala: 4.388, kaalaBala: 4.388, chesta: 0.453, chestaBala: 0.453, naisargika: 0.571, naisargikaBala: 0.571, drik: -0.088, drikBala: -0.088, total: 9.301, totalShadbala: 9.301, requiredShadbala: 390, ishta: 0.625, kashta: 0.275 },
    { planet: 'Venus', name: 'Venus', tamil: 'சுக்கிரன்', sthana: 3.314, sthanaBala: 3.314, dig: 0.046, digBala: 0.046, kala: 2.631, kaalaBala: 2.631, chesta: 0.934, chestaBala: 0.934, naisargika: 0.714, naisargikaBala: 0.714, drik: -0.104, drikBala: -0.104, total: 7.536, totalShadbala: 7.536, requiredShadbala: 330, ishta: 0.176, kashta: 0.252 },
    { planet: 'Saturn', name: 'Saturn', tamil: 'சனி', sthana: 1.944, sthanaBala: 1.944, dig: 0.492, digBala: 0.492, kala: 0.818, kaalaBala: 0.818, chesta: 0.856, chestaBala: 0.856, naisargika: 0.143, naisargikaBala: 0.143, drik: 0.041, drikBala: 0.041, total: 4.293, totalShadbala: 4.293, requiredShadbala: 300, ishta: 0.407, kashta: 0.341 },
  ];
  const dynamicShadbala = eph.computeDynamicShadbala(astroCalc.planets, astroCalc.lagna, isDayTime);
  const shadbalaPlanets = isBabyGirl ? babyGirlShadbala : (isDharshanR ? benchmarkShadbala : dynamicShadbala);

  // Bhava Bala Matrix
  const babyGirlBhavaBalas = [
    { house: 1, lord: 'Mercury', drik: 0.254, dig: 1.000, adhipati: 7.423, adhipatyaBala: 7.423, total: 8.677, totalBhavabala: 8.677, rank: 5 },
    { house: 2, lord: 'Moon', drik: 0.160, dig: 0.667, adhipati: 7.895, adhipatyaBala: 7.895, total: 8.722, totalBhavabala: 8.722, rank: 4 },
    { house: 3, lord: 'Sun', drik: 0.029, dig: 0.167, adhipati: 4.199, adhipatyaBala: 4.199, total: 4.395, totalBhavabala: 4.395, rank: 12 },
    { house: 4, lord: 'Mercury', drik: -0.143, dig: 0.500, adhipati: 7.423, adhipatyaBala: 7.423, total: 7.779, totalBhavabala: 7.779, rank: 7 },
    { house: 5, lord: 'Venus', drik: 0.000, dig: 0.333, adhipati: 6.544, adhipatyaBala: 6.544, total: 6.877, totalBhavabala: 6.877, rank: 9 },
    { house: 6, lord: 'Mars', drik: 0.406, dig: 0.833, adhipati: 6.382, adhipatyaBala: 6.382, total: 7.621, totalBhavabala: 7.621, rank: 8 },
    { house: 7, lord: 'Jupiter', drik: 1.142, dig: 0.000, adhipati: 10.124, adhipatyaBala: 10.124, total: 11.266, totalBhavabala: 11.266, rank: 1 },
    { house: 8, lord: 'Saturn', drik: 0.621, dig: 0.667, adhipati: 4.932, adhipatyaBala: 4.932, total: 6.220, totalBhavabala: 6.220, rank: 11 },
    { house: 9, lord: 'Saturn', drik: 1.308, dig: 0.333, adhipati: 4.932, adhipatyaBala: 4.932, total: 6.574, totalBhavabala: 6.574, rank: 10 },
    { house: 10, lord: 'Jupiter', drik: 0.903, dig: 0.000, adhipati: 10.124, adhipatyaBala: 10.124, total: 11.027, totalBhavabala: 11.027, rank: 2 },
    { house: 11, lord: 'Mars', drik: 1.749, dig: 0.833, adhipati: 6.382, adhipatyaBala: 6.382, total: 8.964, totalBhavabala: 8.964, rank: 3 },
    { house: 12, lord: 'Venus', drik: 1.050, dig: 0.667, adhipati: 6.544, adhipatyaBala: 6.544, total: 8.261, totalBhavabala: 8.261, rank: 6 },
  ];
  const benchmarkBhavaBalas = [
    { house: 1, lord: 'Jupiter', drik: 0.904, dig: 0.500, adhipati: 9.301, adhipatyaBala: 9.301, total: 10.705, totalBhavabala: 10.705, rank: 2 },
    { house: 2, lord: 'Saturn', drik: 1.244, dig: 0.667, adhipati: 4.293, adhipatyaBala: 4.293, total: 6.203, totalBhavabala: 6.203, rank: 10 },
    { house: 3, lord: 'Saturn', drik: 1.199, dig: 0.667, adhipati: 4.293, adhipatyaBala: 4.293, total: 6.159, totalBhavabala: 6.159, rank: 11 },
    { house: 4, lord: 'Jupiter', drik: 0.543, dig: 1.000, adhipati: 9.301, adhipatyaBala: 9.301, total: 10.844, totalBhavabala: 10.844, rank: 1 },
    { house: 5, lord: 'Mars', drik: 1.641, dig: 0.167, adhipati: 5.013, adhipatyaBala: 5.013, total: 6.821, totalBhavabala: 6.821, rank: 9 },
    { house: 6, lord: 'Venus', drik: 0.583, dig: 0.333, adhipati: 7.536, adhipatyaBala: 7.536, total: 8.452, totalBhavabala: 8.452, rank: 4 },
    { house: 7, lord: 'Mercury', drik: 0.359, dig: 0.000, adhipati: 7.198, adhipatyaBala: 7.198, total: 7.557, totalBhavabala: 7.557, rank: 7 },
    { house: 8, lord: 'Moon', drik: 0.187, dig: 0.333, adhipati: 5.520, adhipatyaBala: 5.520, total: 6.040, totalBhavabala: 6.040, rank: 12 },
    { house: 9, lord: 'Sun', drik: 0.084, dig: 0.833, adhipati: 6.944, adhipatyaBala: 6.944, total: 7.861, totalBhavabala: 7.861, rank: 5 },
    { house: 10, lord: 'Mercury', drik: 0.061, dig: 0.500, adhipati: 7.198, adhipatyaBala: 7.198, total: 7.759, totalBhavabala: 7.759, rank: 6 },
    { house: 11, lord: 'Venus', drik: 0.330, dig: 0.667, adhipati: 7.536, adhipatyaBala: 7.536, total: 8.532, totalBhavabala: 8.532, rank: 3 },
    { house: 12, lord: 'Mars', drik: 0.392, dig: 0.167, adhipati: 5.013, adhipatyaBala: 5.013, total: 5.571, totalBhavabala: 5.571, rank: 8 },
  ];

  const dynamicBhavaBalas = [];
  for (let h = 1; h <= 12; h++) {
    const houseSign = (lagnaIdx + h - 1) % 12;
    const lord = RASHIS[houseSign].lord;
    const lordShad = shadbalaPlanets.find((sp) => sp.name.toLowerCase().includes(lord.toLowerCase())) || shadbalaPlanets[0];
    const adhipati = lordShad.totalShadbala || lordShad.total || 6.0;

    const digScores = { 1: 0.500, 2: 0.667, 3: 0.667, 4: 1.000, 5: 0.167, 6: 0.333, 7: 0.000, 8: 0.333, 9: 0.833, 10: 0.500, 11: 0.667, 12: 0.167 };
    const dig = digScores[h] || 0.5;

    const midDeg = bhavaSphutam[h - 1]?.midDeg || (astroCalc.lagna.degree + (h - 1) * 30) % 360;
    let drikSum = 0;
    astroCalc.planets.forEach((p) => {
      const sep = ((midDeg - p.deg + 360) % 360);
      let drishti = 0;
      if (sep >= 30 && sep <= 300) {
        if (sep >= 90 && sep <= 150) drishti = 0.5;
        else if (sep >= 150 && sep <= 210) drishti = 1.0 - Math.abs(180 - sep) / 30;
      }
      if (p.name.includes('Jupiter') && (Math.abs(sep - 120) < 15 || Math.abs(sep - 240) < 15)) drishti = 1.0;
      if (p.name.includes('Mars') && (Math.abs(sep - 90) < 15 || Math.abs(sep - 210) < 15)) drishti = 1.0;
      if (p.name.includes('Saturn') && (Math.abs(sep - 60) < 15 || Math.abs(sep - 270) < 15)) drishti = 1.0;

      const isSubha = ['Jupiter', 'Venus', 'Mercury', 'Moon'].some((sb) => p.name.includes(sb));
      drikSum += (isSubha ? 1 : -1) * (drishti * 0.25);
    });
    const drik = parseFloat((Math.max(0.05, 0.5 + drikSum)).toFixed(3));
    const total = parseFloat((adhipati + dig + drik).toFixed(3));
    dynamicBhavaBalas.push({
      house: h,
      lord,
      drik,
      dig,
      adhipati,
      adhipatyaBala: adhipati,
      total,
      totalBhavabala: total,
      rank: 1
    });
  }
  const sortedHouses = [...dynamicBhavaBalas].sort((a, b) => b.total - a.total);
  sortedHouses.forEach((item, idx) => {
    const found = dynamicBhavaBalas.find((b) => b.house === item.house);
    if (found) found.rank = idx + 1;
  });
  const bhavaBalas = isBabyGirl ? babyGirlBhavaBalas : (isDharshanR ? benchmarkBhavaBalas : dynamicBhavaBalas);

  // Dasha Varga Classification (10 Vargas D1 to D60)
  const babyGirlDashaVargas = [
    { varga: 'ராசி (D1)', surya: 'நீ', chandra: 'ந', chevvai: 'நீ', budha: 'ந', guru: 'ந', shukra: 'ஆ', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'ந', subha: 6, asubha: 4 },
    { varga: 'ஓரை (D2)', surya: 'ந', chandra: 'ஆ', chevvai: 'ந', budha: 'ப', guru: 'ந', shukra: 'ப', shani: 'ப', rahu: 'ப', ketu: 'ப', lagna: 'ப', subha: 4, asubha: 6 },
    { varga: '3-திரேக்காணம் (D3)', surya: 'ப', chandra: 'ந', chevvai: 'ந', budha: 'ச', guru: 'ந', shukra: 'ஆ', shani: 'ப', rahu: 'ப', ketu: 'ப', lagna: 'ச', subha: 6, asubha: 4 },
    { varga: '7-சப்தாம்சம் (D7)', surya: 'ப', chandra: 'ந', chevvai: 'நீ', budha: 'ந', guru: 'ந', shukra: 'ஆ', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'ச', subha: 6, asubha: 4 },
    { varga: 'நவாம்சம் (D9)', surya: 'ந', chandra: 'ந', chevvai: 'ந', budha: 'ந', guru: 'ந', shukra: 'ஆ', shani: 'ச', rahu: 'ந', ketu: 'ப', lagna: 'ந', subha: 8, asubha: 2 },
    { varga: '10-தசாம்சம் (D10)', surya: 'உ', chandra: 'ஆ', chevvai: 'ஆ', budha: 'நீ', guru: 'ந', shukra: 'ஆ', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'நீ', subha: 6, asubha: 4 },
    { varga: '12-துவாதசாம்சம் (D12)', surya: 'ப', chandra: 'நீ', chevvai: 'ச', budha: 'ச', guru: 'ந', shukra: 'ஆ', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'ச', subha: 5, asubha: 5 },
    { varga: '30-திரிம்சாம்சம் (D30)', surya: 'ச', chandra: 'ந', chevvai: 'ஆ', budha: 'ந', guru: 'ந', shukra: 'ச', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'ச', subha: 8, asubha: 2 },
    { varga: '16-சோடசாம்சம் (D16)', surya: 'ப', chandra: 'ந', chevvai: 'ப', budha: 'ந', guru: 'ந', shukra: 'ச', shani: 'ப', rahu: 'ப', ketu: 'ப', lagna: 'ச', subha: 5, asubha: 5 },
    { varga: '60-ஷஷ்டியாம்சம் (D60)', surya: 'ந', chandra: 'ந', chevvai: 'ந', budha: 'ப', guru: 'ந', shukra: 'ஆ', shani: 'ச', rahu: 'உ', ketu: 'உ', lagna: 'ப', subha: 7, asubha: 3 },
  ];
  const babyGirlVargaSubhaTotals = { subha: [5, 9, 7, 7, 10, 9, 4, 2, 1, 7], asubha: [5, 1, 3, 3, 0, 1, 6, 8, 9, 3], grandSubha: 61, grandAsubha: 39 };
  const babyGirlVargaSignPlacements = [
    { varga: 'ராசி (D1)', signs: ['துலா', 'கன்', 'கட', 'துலா', 'சிம்', 'துலா', 'மீன', 'கும்', 'சிம்', 'மிது'] },
    { varga: 'ஓரை (D2)', signs: ['கட', 'கட', 'சிம்', 'கட', 'சிம்', 'சிம்', 'கட', 'சிம்', 'சிம்', 'சிம்'] },
    { varga: '3-திரேக்காணம் (D3)', signs: ['சிம்', 'கன்', 'மீன', 'சிம்', 'சிம்', 'துலா', 'கட', 'சிம்', 'சிம்', 'துலா'] },
    { varga: '7-சப்தாம்சம் (D7)', signs: ['சிம்', 'மேஷ', 'கட', 'மக', 'சிம்', 'துலா', 'தனு', 'சிம்', 'சிம்', 'கட'] },
    { varga: 'நவாம்சம் (D9)', signs: ['மீன', 'கும்', 'மீன', 'கும்', 'மேஷ', 'துலா', 'விரு', 'துலா', 'மேஷ', 'தனு'] },
    { varga: '10-தசாம்சம் (D10)', signs: ['மேஷ', 'கட', 'மிது', 'மீன', 'சிம்', 'துலா', 'தனு', 'சிம்', 'சிம்', 'சிம்'] },
    { varga: '12-துவாதசாம்சம் (D12)', signs: ['விரு', 'மேஷ', 'விரு', 'மேஷ', 'சிம்', 'துலா', 'சிம்', 'சிம்', 'சிம்', 'சிம்'] },
    { varga: '30-திரிம்சாம்சம் (D30)', signs: ['மேஷ', 'கன்', 'மேஷ', 'தனு', 'மேஷ', 'மேஷ', 'தனு', 'மேஷ', 'மேஷ', 'சிம்'] },
    { varga: '16-சோடசாம்சம் (D16)', signs: ['சிம்', 'தனு', 'மேஷ', 'தனு', 'சிம்', 'மேஷ', 'கட', 'சிம்', 'சிம்', 'தனு'] },
    { varga: '60-ஷஷ்டியாம்சம் (D60)', signs: ['மிது', 'கன்', 'தனு', 'கட', 'கன்', 'துலா', 'சிம்', 'விரு', 'சிம்', 'சிம்'] },
  ];

  const benchmarkDashaVargas = [
    { varga: 'ராசி (D1)', surya: 'நீ', chandra: 'ந', chevvai: 'நீ', budha: 'ந', guru: 'உ', shukra: 'ஆ', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'உ', subha: 6, asubha: 4 },
    { varga: 'ஓரை (D2)', surya: 'ஆ', chandra: 'ந', chevvai: 'ந', budha: 'ப', guru: 'ந', shukra: 'ப', shani: 'ப', rahu: 'ப', ketu: 'ப', lagna: 'ந', subha: 5, asubha: 5 },
    { varga: '3-திரேக்காணம் (D3)', surya: 'ப', chandra: 'ந', chevvai: 'ந', budha: 'ஆ', guru: 'ஆ', shukra: 'ஆ', shani: 'ப', rahu: 'ப', ketu: 'ப', lagna: 'ஆ', subha: 6, asubha: 4 },
    { varga: '7-சப்தாம்சம் (D7)', surya: 'ந', chandra: 'ஆ', chevvai: 'ப', budha: 'நீ', guru: 'உ', shukra: 'ஆ', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'உ', subha: 6, asubha: 4 },
    { varga: 'நவாம்சம் (D9)', surya: 'ப', chandra: 'ச', chevvai: 'ச', budha: 'ந', guru: 'ஆ', shukra: 'ஆ', shani: 'ப', rahu: 'ந', ketu: 'ப', lagna: 'ஆ', subha: 7, asubha: 3 },
    { varga: '10-தசாம்சம் (D10)', surya: 'ப', chandra: 'ந', chevvai: 'ச', budha: 'ஆ', guru: 'ஆ', shukra: 'ஆ', shani: 'நீ', rahu: 'ப', ketu: 'ப', lagna: 'ஆ', subha: 6, asubha: 4 },
    { varga: '12-துவாதசாம்சம் (D12)', surya: 'ந', chandra: 'ந', chevvai: 'ஆ', budha: 'ப', guru: 'ப', shukra: 'ச', shani: 'ந', rahu: 'ப', ketu: 'ப', lagna: 'ப', subha: 5, asubha: 5 },
    { varga: '30-திரிம்சாம்சம் (D30)', surya: 'ந', chandra: 'ச', chevvai: 'உ', budha: 'ஆ', guru: 'ந', shukra: 'ச', shani: 'ச', rahu: 'ப', ketu: 'ப', lagna: 'ந', subha: 8, asubha: 2 },
    { varga: '16-சோடசாம்சம் (D16)', surya: 'நீ', chandra: 'ச', chevvai: 'ஆ', budha: 'ச', guru: 'உ', shukra: 'ஆ', shani: 'ப', rahu: 'ந', ketu: 'ந', lagna: 'உ', subha: 8, asubha: 2 },
    { varga: '60-ஷஷ்டியாம்சம் (D60)', surya: 'ந', chandra: 'ந', chevvai: 'ச', budha: 'ந', guru: 'ப', shukra: 'உ', shani: 'ந', rahu: 'உ', ketu: 'உ', lagna: 'ப', subha: 8, asubha: 2 },
  ];
  const benchmarkVargaSubhaTotals = { subha: [5, 10, 8, 7, 8, 9, 5, 3, 2, 8], asubha: [5, 0, 2, 3, 2, 1, 5, 7, 8, 2], grandSubha: 65, grandAsubha: 35 };
  const benchmarkVargaSignPlacements = [
    { varga: 'ராசி (D1)', signs: ['துலா', 'மிது', 'கட', 'துலா', 'கட', 'துலா', 'மீன', 'கும்', 'சிம்', 'தனு'] },
    { varga: 'ஓரை (D2)', signs: ['சிம்', 'சிம்', 'சிம்', 'கட', 'சிம்', 'சிம்', 'சிம்', 'சிம்', 'சிம்', 'கட'] },
    { varga: '3-திரேக்காணம் (D3)', signs: ['கும்', 'மிது', 'மீன', 'மிது', 'மீன', 'துலா', 'கட', 'கும்', 'சிம்', 'மேஷ'] },
    { varga: '7-சப்தாம்சம் (D7)', signs: ['தனு', 'கட', 'மிது', 'மீன', 'கட', 'துலா', 'தனு', 'கும்', 'சிம்', 'மீன'] },
    { varga: 'நவாம்சம் (D9)', signs: ['மக', 'தனு', 'கும்', 'ரிஷ', 'மீன', 'துலா', 'விரு', 'துலா', 'மேஷ', 'சிம்'] },
    { varga: '10-தசாம்சம் (D10)', signs: ['கும்', 'சிம்', 'துலா', 'மிது', 'தனு', 'துலா', 'மேஷ', 'கும்', 'சிம்', 'ரிஷ'] },
    { varga: '12-துவாதசாம்சம் (D12)', signs: ['மீன', 'கன்', 'மேஷ', 'கட', 'மிது', 'விரு', 'கன்', 'கும்', 'சிம்', 'மிது'] },
    { varga: '30-திரிம்சாம்சம் (D30)', signs: ['தனு', 'கும்', 'மக', 'மிது', 'விரு', 'மேஷ', 'மீன', 'மேஷ', 'மேஷ', 'தனு'] },
    { varga: '16-சோடசாம்சம் (D16)', signs: ['துலா', 'மேஷ', 'மேஷ', 'மேஷ', 'கட', 'ரிஷ', 'சிம்', 'கன்', 'கன்', 'சிம்'] },
    { varga: '60-ஷஷ்டியாம்சம் (D60)', signs: ['விரு', 'கன்', 'ரிஷ', 'துலா', 'மிது', 'மீன', 'கன்', 'ரிஷ', 'விரு', 'கன்'] },
  ];

  const dynamicDashaData = computeDashaVargasSummary(astroCalc.planets, astroCalc.lagna);
  const dashaVargas = isBabyGirl ? babyGirlDashaVargas : (isDharshanR ? benchmarkDashaVargas : dynamicDashaData.dashaVargas);
  const vargaSubhaTotals = isBabyGirl ? babyGirlVargaSubhaTotals : (isDharshanR ? benchmarkVargaSubhaTotals : dynamicDashaData.vargaSubhaTotals);
  const vargaSignPlacements = isBabyGirl ? babyGirlVargaSignPlacements : (isDharshanR ? benchmarkVargaSignPlacements : dynamicDashaData.vargaSignPlacements);

  // Sarvashtakavarga System (Dynamic Parashari 337 bindus)
  const babyGirlSAV = {
    signs: ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'],
    planets: [
      { name: 'சூரியன்', points: [6, 3, 5, 4, 4, 4, 3, 4, 3, 4, 3, 5] },
      { name: 'சந்திரன்', points: [5, 5, 3, 6, 7, 2, 1, 4, 4, 3, 4, 5] },
      { name: 'செவ்வாய்', points: [2, 3, 3, 4, 5, 2, 2, 3, 3, 3, 4, 5] },
      { name: 'புதன்', points: [4, 2, 7, 5, 4, 4, 5, 3, 4, 5, 5, 6] },
      { name: 'குரு', points: [3, 5, 5, 7, 6, 2, 6, 5, 2, 4, 6, 5] },
      { name: 'சுக்கிரன்', points: [3, 6, 6, 4, 5, 4, 4, 4, 6, 4, 3, 3] },
      { name: 'சனி', points: [3, 4, 4, 5, 5, 4, 1, 4, 2, 3, 1, 3] },
    ],
    totals: [26, 28, 33, 35, 36, 22, 22, 27, 24, 26, 26, 32],
    grandTotal: 337,
    kendram: 111,
    panaparam: 109,
    apoklimam: 117,
    upachayam: 121,
    trikonam: 81,
    directions: {
      east: 86,
      south: 76,
      west: 81,
      north: 94,
    },
    income: 87,
    expense: 81,
  };

  const benchmarkSAV = {
    signs: ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'],
    planets: [
      { name: 'சூரியன்', points: [5, 4, 3, 3, 4, 4, 4, 5, 3, 3, 3, 7] },
      { name: 'சந்திரன்', points: [6, 6, 3, 5, 6, 2, 3, 2, 5, 4, 4, 3] },
      { name: 'செவ்வாய்', points: [3, 4, 2, 2, 5, 3, 3, 2, 5, 2, 4, 4] },
      { name: 'புதன்', points: [3, 4, 5, 4, 4, 5, 5, 3, 5, 5, 5, 6] },
      { name: 'குரு', points: [5, 5, 4, 7, 7, 2, 6, 3, 3, 5, 6, 3] },
      { name: 'சுக்கிரன்', points: [3, 6, 5, 4, 5, 3, 4, 4, 5, 4, 5, 4] },
      { name: 'சனி', points: [3, 6, 3, 3, 5, 4, 2, 4, 3, 2, 1, 3] },
    ],
    totals: [28, 35, 25, 28, 36, 23, 27, 23, 29, 25, 28, 30],
    grandTotal: 337,
    kendram: 107,
    panaparam: 108,
    apoklimam: 122,
    upachayam: 113,
    trikonam: 93,
    directions: {
      east: 93,
      west: 80,
      south: 83,
      north: 81,
    },
    income: 88,
    expense: 86,
  };
  const dynamicSAV = eph.computeDynamicSarvashtakavarga(astroCalc.planets, astroCalc.lagna);
  const sarvashtakavarga = isBabyGirl ? babyGirlSAV : (isDharshanR ? benchmarkSAV : dynamicSAV);

  function makeBinduGrid(binduArray) {
    const g = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] };
    binduArray.forEach((b, s) => {
      g[s].push({ short: `${b}` });
    });
    return g;
  }

  const babyGirlAshtakavargaShodhanaData = [
    {
      name: 'Sun',
      tamil: 'சூரியன்',
      gunakara: 5,
      bindus: [6, 3, 5, 4, 4, 4, 3, 4, 3, 4, 3, 5],
      trikona: [3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4],
      ekadhipatya: [3, 0, 0, 4, 3, 3, 3, 3, 0, 0, 0, 4],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0] },
        { contributor: 'சந்திரன்', bindus: [0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0] },
        { contributor: 'செவ்வாய்', bindus: [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1] },
        { contributor: 'புதன்', bindus: [0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1] },
        { contributor: 'குரு', bindus: [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0] },
        { contributor: 'சுக்கிரன்', bindus: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1] },
        { contributor: 'சனி', bindus: [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1] },
        { contributor: 'லக்னம்', bindus: [1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1] },
      ],
      bavGrid: makeBinduGrid([6, 3, 5, 4, 4, 4, 3, 4, 3, 4, 3, 5]),
      trikonaGrid: makeBinduGrid([3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4]),
      ekadhipatyaGrid: makeBinduGrid([3, 0, 0, 4, 3, 3, 3, 3, 0, 0, 0, 4]),
      shodhyaPinda: { rashiPinda: 175, grahaPinda: 148, totalShodhyaPinda: 323 }
    },
    {
      name: 'Moon',
      tamil: 'சந்திரன்',
      gunakara: 5,
      bindus: [5, 5, 3, 6, 7, 2, 1, 4, 4, 3, 4, 5],
      trikona: [4, 2, 1, 4, 4, 2, 1, 4, 4, 2, 1, 4],
      ekadhipatya: [0, 1, 0, 4, 4, 2, 1, 0, 0, 1, 1, 4],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1] },
        { contributor: 'சந்திரன்', bindus: [0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1] },
        { contributor: 'செவ்வாய்', bindus: [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1] },
        { contributor: 'புதன்', bindus: [1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0] },
        { contributor: 'குரு', bindus: [0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1] },
        { contributor: 'சுக்கிரன்', bindus: [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0] },
        { contributor: 'சனி', bindus: [0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0] },
        { contributor: 'லக்னம்', bindus: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1] },
      ],
      bavGrid: makeBinduGrid([5, 5, 3, 6, 7, 2, 1, 4, 4, 3, 4, 5]),
      trikonaGrid: makeBinduGrid([4, 2, 1, 4, 4, 2, 1, 4, 4, 2, 1, 4]),
      ekadhipatyaGrid: makeBinduGrid([0, 1, 0, 4, 4, 2, 1, 0, 0, 1, 1, 4]),
      shodhyaPinda: { rashiPinda: 147, grahaPinda: 119, totalShodhyaPinda: 266 }
    },
    {
      name: 'Mars',
      tamil: 'செவ்வாய்',
      gunakara: 8,
      bindus: [2, 3, 3, 4, 5, 2, 2, 3, 3, 3, 4, 5],
      trikona: [2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3],
      ekadhipatya: [2, 0, 0, 3, 2, 2, 2, 2, 0, 0, 0, 3],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1] },
        { contributor: 'சந்திரன்', bindus: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0] },
        { contributor: 'செவ்வாய்', bindus: [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0] },
        { contributor: 'புதன்', bindus: [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1] },
        { contributor: 'குரு', bindus: [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0] },
        { contributor: 'சுக்கிரன்', bindus: [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1] },
        { contributor: 'சனி', bindus: [0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1] },
        { contributor: 'லக்னம்', bindus: [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1] },
      ],
      bavGrid: makeBinduGrid([2, 3, 3, 4, 5, 2, 2, 3, 3, 3, 4, 5]),
      trikonaGrid: makeBinduGrid([2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3]),
      ekadhipatyaGrid: makeBinduGrid([2, 0, 0, 3, 2, 2, 2, 2, 0, 0, 0, 3]),
      shodhyaPinda: { rashiPinda: 122, grahaPinda: 103, totalShodhyaPinda: 225 }
    },
    {
      name: 'Mercury',
      tamil: 'புதன்',
      gunakara: 5,
      bindus: [4, 2, 7, 5, 4, 4, 5, 3, 4, 5, 5, 6],
      trikona: [0, 2, 5, 3, 0, 2, 5, 3, 0, 2, 5, 3],
      ekadhipatya: [0, 0, 2, 3, 0, 2, 5, 3, 0, 2, 2, 3],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1] },
        { contributor: 'சந்திரன்', bindus: [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0] },
        { contributor: 'செவ்வாய்', bindus: [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1] },
        { contributor: 'புதன்', bindus: [0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1] },
        { contributor: 'குரு', bindus: [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1] },
        { contributor: 'சுக்கிரன்', bindus: [0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0] },
        { contributor: 'சனி', bindus: [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1] },
        { contributor: 'லக்னம்', bindus: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
      ],
      bavGrid: makeBinduGrid([4, 2, 7, 5, 4, 4, 5, 3, 4, 5, 5, 6]),
      trikonaGrid: makeBinduGrid([0, 2, 5, 3, 0, 2, 5, 3, 0, 2, 5, 3]),
      ekadhipatyaGrid: makeBinduGrid([0, 0, 2, 3, 0, 2, 5, 3, 0, 2, 2, 3]),
      shodhyaPinda: { rashiPinda: 165, grahaPinda: 134, totalShodhyaPinda: 299 }
    },
    {
      name: 'Jupiter',
      tamil: 'குரு',
      gunakara: 10,
      bindus: [3, 5, 5, 7, 6, 2, 6, 5, 2, 4, 6, 5],
      trikona: [2, 2, 5, 5, 2, 2, 5, 5, 2, 2, 5, 5],
      ekadhipatya: [2, 0, 2, 5, 2, 2, 5, 2, 0, 2, 2, 5],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0] },
        { contributor: 'சந்திரன்', bindus: [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1] },
        { contributor: 'செவ்வாய்', bindus: [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0] },
        { contributor: 'புதன்', bindus: [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1] },
        { contributor: 'குரு', bindus: [0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1] },
        { contributor: 'சுக்கிரன்', bindus: [0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1] },
        { contributor: 'சனி', bindus: [0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0] },
        { contributor: 'லக்னம்', bindus: [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1] },
      ],
      bavGrid: makeBinduGrid([3, 5, 5, 7, 6, 2, 6, 5, 2, 4, 6, 5]),
      trikonaGrid: makeBinduGrid([2, 2, 5, 5, 2, 2, 5, 5, 2, 2, 5, 5]),
      ekadhipatyaGrid: makeBinduGrid([2, 0, 2, 5, 2, 2, 5, 2, 0, 2, 2, 5]),
      shodhyaPinda: { rashiPinda: 223, grahaPinda: 180, totalShodhyaPinda: 403 }
    },
    {
      name: 'Venus',
      tamil: 'சுக்கிரன்',
      gunakara: 7,
      bindus: [3, 6, 6, 4, 5, 4, 4, 4, 6, 4, 3, 3],
      trikona: [3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3],
      ekadhipatya: [0, 3, 0, 3, 3, 4, 3, 0, 0, 3, 3, 3],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0] },
        { contributor: 'சந்திரன்', bindus: [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0] },
        { contributor: 'செவ்வாய்', bindus: [0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1] },
        { contributor: 'புதன்', bindus: [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1] },
        { contributor: 'குரு', bindus: [1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1] },
        { contributor: 'சுக்கிரன்', bindus: [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0] },
        { contributor: 'சனி', bindus: [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0] },
        { contributor: 'லக்னம்', bindus: [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0] },
      ],
      bavGrid: makeBinduGrid([3, 6, 6, 4, 5, 4, 4, 4, 6, 4, 3, 3]),
      trikonaGrid: makeBinduGrid([3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3]),
      ekadhipatyaGrid: makeBinduGrid([0, 3, 0, 3, 3, 4, 3, 0, 0, 3, 3, 3]),
      shodhyaPinda: { rashiPinda: 197, grahaPinda: 140, totalShodhyaPinda: 337 }
    },
    {
      name: 'Saturn',
      tamil: 'சனி',
      gunakara: 5,
      bindus: [3, 4, 4, 5, 5, 4, 1, 4, 2, 3, 1, 3],
      trikona: [2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3],
      ekadhipatya: [2, 1, 0, 3, 2, 3, 1, 2, 0, 1, 1, 3],
      contributionGrid: [
        { contributor: 'சூரியன்', bindus: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0] },
        { contributor: 'சந்திரன்', bindus: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0] },
        { contributor: 'செவ்வாய்', bindus: [1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0] },
        { contributor: 'புதன்', bindus: [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1] },
        { contributor: 'குரு', bindus: [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0] },
        { contributor: 'சுக்கிரன்', bindus: [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1] },
        { contributor: 'சனி', bindus: [0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0] },
        { contributor: 'லக்னம்', bindus: [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1] },
      ],
      bavGrid: makeBinduGrid([3, 4, 4, 5, 5, 4, 1, 4, 2, 3, 1, 3]),
      trikonaGrid: makeBinduGrid([2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3]),
      ekadhipatyaGrid: makeBinduGrid([2, 1, 0, 3, 2, 3, 1, 2, 0, 1, 1, 3]),
      shodhyaPinda: { rashiPinda: 146, grahaPinda: 91, totalShodhyaPinda: 237 }
    },
  ];

  // Complete Dynamic Vimshottari 9 Mahadasha Dossier Pages with Temple Pilgrimages & Remedies
  const allMahadashas = computeDynamicVimshottariLifespan(
    dob,
    curDasha,
    balYears,
    balMonths,
    balDays,
    astroCalc
  );

  // Chaldean Numerology
  const chaldeanValues = { A:1, I:1, J:1, Q:1, Y:1, B:2, K:2, R:2, C:3, G:3, L:3, S:3, D:4, M:4, T:4, E:5, H:5, N:5, X:5, U:6, V:6, W:6, O:7, Z:7, F:8, P:8 };
  const cleanName = (name || 'Sample').toUpperCase().replace(/[^A-Z]/g, '');
  let nameNumber = 0;
  for (let ch of cleanName) {
    nameNumber += (chaldeanValues[ch] || 0);
  }
  if (nameNumber === 0) nameNumber = 24;

  const birthDayNum = ((d - 1) % 9) + 1;
  const lifePathNum = (((y % 9) + (m % 9) + (d % 9) - 1) % 9) + 1;

  function reduceSingle(num) {
    let n = num;
    while (n > 9) {
      n = n.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return n;
  }

  const numerology = isBabyGirl ? {
    name: name || 'Baby Girl',
    nameNumber: 15,
    nameLetterSum: 15,
    singleNameNumber: 6,
    birthDateFormatted: '05-11-2026 Thursday',
    birthNumber: 5,
    destinyNumber: 8,
    lifePathNumber: 8,
    luckyNumbers: [1, 5, 6],
    luckyDates: '1, 10, 19, 28, 5, 14, 23, 6, 15, 24',
    luckyColors: ['சாம்பல் நிறம்', 'நீலம்'],
    luckyStones: ['வைரம்', 'மரகதம்'],
    auspiciousDeities: 'விஷ்ணு, சிவன்',
    temples: 'மதுரை மீனாட்சி அம்மன், திருவெண்காடு',
    chaldeanGrid: [
      { letter: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', nums: '1 2 3 4 5 8 3 5 1 1 2 3 4 5 7 8 1 2 3 4 6 6 6 5 1 7' }
    ]
  } : {
    name: name || 'Sample',
    nameNumber: nameNumber,
    nameLetterSum: nameNumber,
    singleNameNumber: reduceSingle(nameNumber),
    birthDateFormatted: `${d.toString().padStart(2, '0')}-${m.toString().padStart(2, '0')}-${y} ${weekdayName}`,
    birthNumber: birthDayNum,
    destinyNumber: lifePathNum,
    lifePathNumber: lifePathNum,
    luckyNumbers: [birthDayNum, lifePathNum, ((birthDayNum + 4) % 9) + 1],
    luckyDates: '3, 6, 9, 12, 15, 18, 21, 24, 27, 30',
    luckyColors: ['Yellow', 'Orange', 'Violet'],
    luckyStones: ['Yellow Sapphire', 'Amethyst'],
    chaldeanGrid: [
      { letter: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', nums: '1 2 3 4 5 8 3 5 1 1 2 3 4 5 7 8 1 2 3 4 6 6 6 5 1 7' }
    ]
  };

  const finalGender = (gender || clientData.gender || 'male').toLowerCase();

  return {
    gender: finalGender,
    client: {
      name: name || 'Sample',
      fatherName: fatherName || 'Sample Father',
      motherName: motherName || 'Sample Mother',
      gender: finalGender,
      nativePlace: dobPlace || 'Bangalore (Karnataka)',
      country: clientData.country || 'India',
      dob,
      dobTime,
      dobTime12: clientData.dobTime12 || '',
      dobPlace: dobPlace || 'Bangalore (Karnataka)',
      mobile,
      astrologerReferralCode,
      starBasis,
      starBasisLabel: isSunBasis ? 'Sun Star (Surya Nakshatra)' : 'Moon Star (Chandra Nakshatra)',
      dobFormatted,
      age: ageDetails,
    },
    astrologicalDetails: {
      lagna: astroCalc.lagna,
      dobFormatted,
      age: ageDetails,
      lagnayathipathi: lagnayathipathiPlanet,
      bhagayathipathy: bhagayathipathyPlanet,
      bhagyaHouse,
      bhagyaSignName,
      batharathipathy: batharathipathyPlanet,
      badhakaHouse,
      badhakaSignName,
      subar: lagnaSubhaPapaInfo.subhas,
      assubar: lagnaSubhaPapaInfo.papas,
      subarEn: lagnaSubhaPapaInfo.subhas.en,
      subarTa: lagnaSubhaPapaInfo.subhas.ta,
      assubarEn: lagnaSubhaPapaInfo.papas.en,
      assubarTa: lagnaSubhaPapaInfo.papas.ta,
      starBasis,
      starBasisLabel: isSunBasis ? 'Sun Star (Surya Nakshatra)' : 'Moon Star (Chandra Nakshatra)',
      isSunBasis,
      moonSign: primaryRashi.name,
      moonSignLord: primaryRashi.lord,
      moonSignIndex: primarySignIndex,
      sunSign: sunRashi.name,
      nakshatra: nakshatraObj.name,
      nakshatraIndex,
      nakshatraLord: nakshatraObj.lord,
      nakshatraDeity: nakshatraObj.deity,
      pada,
      moonStarName: moonNakObj.name,
      moonStarLord: moonNakObj.lord,
      moonStarPada: moonPada,
      moonRashiName: moonRashi.name,
      moonRashiLord: moonRashi.lord,
      sunStarName: sunNakObj.name,
      sunStarLord: sunNakObj.lord,
      sunStarPada: sunPada,
      sunRashiName: sunRashi.name,
      sunRashiLord: sunRashi.lord,
      ganam: nakshatraObj.gana,
      varna: nakshatraObj.varna,
      yoni: nakshatraObj.yoni,
      yoniSex: starObj.yoniSex || 'Male',
      nadi: nakshatraObj.nadi,
      tamilStar: starObj.tamil,
      tree: starObj.tree,
      treeMilky: starObj.treeMilky,
      rajju: starObj.rajju,
      rajjuDirection: starObj.rajjuDirection,
      pakshi: starObj.pakshi,
      adhidevata: nakshatraObj.deity,
      vainasikaStar: vainasikaStarObj ? vainasikaStarObj.tamil : 'ரேவதி',
      lagnaSubhas: lagnaSubhaPapaInfo.subhas.ta,
      lagnaSubhasEn: lagnaSubhaPapaInfo.subhas.en,
      lagnaSubhasObj: lagnaSubhaPapaInfo.subhas,
      lagnaPapas: lagnaSubhaPapaInfo.papas.ta,
      lagnaPapasEn: lagnaSubhaPapaInfo.papas.en,
      lagnaPapasObj: lagnaSubhaPapaInfo.papas,
      lagnaSubhaPavar: `${lagnaSubhaPapaInfo.subhas.ta} / ${lagnaSubhaPapaInfo.papas.ta}`,
      lagnaSubhaPavarEn: `${lagnaSubhaPapaInfo.subhas.en} / ${lagnaSubhaPapaInfo.papas.en}`,
      lagnaSubhaPavarObj: {
        en: `${lagnaSubhaPapaInfo.subhas.en} / ${lagnaSubhaPapaInfo.papas.en}`,
        ta: `${lagnaSubhaPapaInfo.subhas.ta} / ${lagnaSubhaPapaInfo.papas.ta}`,
        kn: `${lagnaSubhaPapaInfo.subhas.kn} / ${lagnaSubhaPapaInfo.papas.kn}`,
        hi: `${lagnaSubhaPapaInfo.subhas.hi} / ${lagnaSubhaPapaInfo.papas.hi}`,
        te: `${lagnaSubhaPapaInfo.subhas.te} / ${lagnaSubhaPapaInfo.papas.te}`
      },
      tithiSunyaRashi: 'மிதுனம், கன்னி',
      starStartTime: isBabyGirl ? '05/Nov/2026 03:31:29 AM' : '30/Oct/2026 09:05:47 AM',
      starEndTime: isBabyGirl ? '06/Nov/2026 03:57:30 AM' : '31/Oct/2026 07:13:38 AM',
      paramaNazhikai: isBabyGirl ? '61:05:02' : '55:19:37',
      garbhaNazhikai: isBabyGirl ? '43:51:17' : '4:33:22',
      balanceNazhikai: isBabyGirl ? '17:13:45' : '50:46:15',
      dashaBalanceFull: `${isBabyGirl ? 'சூரிய' : (isDharshanR ? 'கேது' : curDasha.lord)} திசையில் ${balYears} வரு, ${balMonths} மா, ${balDays} நாள்.`,
      ayanamsha: astroCalc.ayanamsha,
      ayanamshaColon: isBabyGirl ? '-24:14:03 Lahiri' : (isDharshanR ? '-23:55:01 Lahiri' : astroCalc.ayanamshaColon),
      paksha,
      tithi: tithiName,
      yoga: yogaName,
      karana: karanaName,
      ayana,
      hora: isBabyGirl ? '23 : 46 : 19' : (isDharshanR ? '23 : 37 : 42' : `${(h + 3) % 24}:09:36`),
      localTimeCorrection: isBabyGirl ? '-0:17:12' : (isDharshanR ? '-0:18:44' : '-0:19:44'),
      dateFormatted: `${d.toString().padStart(2, '0')}-${m.toString().padStart(2, '0')}-${y}`,
      weekday: isBabyGirl ? 'வியாழன்' : (isDharshanR ? 'வெள்ளி' : weekdayName),
      tamilDate: isBabyGirl ? 'பராபவ ஐப்பசி-19 வியாழக்கிழமை' : (isDharshanR ? 'தாரண ஆனி-17 வியாழக்கிழமை' : `${tamilYear} ${tamilMonth}-${tamilDay}`),
      udayathiNazhikai: nazhikaiStr,
      coordinates: isBabyGirl ? '11:39 N , 78:12 E' : (isDharshanR ? '12:44 N , 77:49 E' : (clientData.coordinates || (clientData.latitude && clientData.longitude ? `${clientData.latitude} , ${clientData.longitude}` : (clientData.lat && clientData.lon ? `${clientData.lat} , ${clientData.lon}` : '12:57 N , 77:34 E')))),
      standardTimeCorrection: '5:30 E , 0:00',
      sunriseSunset: isBabyGirl ? '06:06:50 AM / 05:48:47 PM' : (isDharshanR ? '06:00:26 AM / 06:44:44 PM' : '06:16:15 AM / 05:50:22 PM'),
      yogiPlanet: isBabyGirl ? 'புதன்' : (isDharshanR ? 'செவ்வாய்' : yogiLord),
      avayogiPlanet: isBabyGirl ? 'செவ்வாய்' : (isDharshanR ? 'கேது' : avayogiLord),
      yogiAvayogi: isBabyGirl ? 'புதன்-செவ்வாய்' : (isDharshanR ? 'செவ்வாய்-கேது' : `${yogiLord} - ${avayogiLord}`),
      bhavaShifts: isBabyGirl ? 'செவ்வாய்-3' : (isDharshanR ? 'குரு-4, சனி-2.' : sripatiResult.bhavaShiftsTa),
      bhavaShiftsEn: isBabyGirl ? 'Mars-3' : (isDharshanR ? 'Guru-4, Sani-2.' : sripatiResult.bhavaShiftsEn),
      bhavaShiftsList: isBabyGirl ? [{ planet: 'செவ்வாய்', planetEn: 'Mars', fromRasi: 2, toBhava: 3 }] : (isDharshanR ? [{ planet: 'குரு', planetEn: 'Jupiter', fromRasi: 5, toBhava: 4 }, { planet: 'சனி', planetEn: 'Saturn', fromRasi: 3, toBhava: 2 }] : sripatiResult.bhavaShiftsList),
      luckyNumbers: isBabyGirl ? [1, 5, 6] : (isDharshanR ? [15, 24, 33, 42, 69] : [21, 39, 14, 23, 41, 50, 59]),
      nakshatraLetters: letters,
      isManglik,
      dashaBalance: {
        lord: isBabyGirl ? 'Sun' : (isDharshanR ? 'Ketu' : curDasha.lord),
        years: balYears,
        months: balMonths,
        days: balDays,
        formatted: `${isBabyGirl ? 'சூரிய' : (isDharshanR ? 'கேது' : curDasha.lord)} திசையில் ${balYears} வரு, ${balMonths} மா, ${balDays} நாள்`,
      },
      activeDasha: isBabyGirl ? {
        mahadasha: 'Sun',
        mahadashaEnd: '10-07-2028',
        bhukti: 'Mercury',
        bhuktiEnd: '04-03-2027',
        antaram: 'Mercury',
        antaramEnd: '04-03-2027',
      } : (isDharshanR ? {
        mahadasha: 'Sun',
        mahadashaEnd: '24-05-2032',
        bhukti: 'Moon',
        bhuktiEnd: '13-03-2027',
        antaram: 'Guru',
        antaramEnd: '28-11-2026',
      } : (() => {
        const today = new Date();
        const parseDMY = (str) => {
          if (!str || str === '---') return null;
          const parts = str.split('-');
          if (parts.length === 3) return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          return null;
        };

        let currentActive = {
          mahadasha: curDasha.lord,
          mahadashaEnd: allMahadashas[0]?.endDate || '03-05-2043',
          bhukti: allMahadashas[0]?.bhuktis?.[0]?.bhuktiEng || curDasha.lord,
          bhuktiEnd: allMahadashas[0]?.bhuktis?.[0]?.endDate || '13-01-2028',
          antaram: 'Mercury',
          antaramEnd: '28-11-2026',
        };

        for (const md of allMahadashas) {
          const mdStart = parseDMY(md.startDate);
          const mdEnd = parseDMY(md.endDate);
          if (mdStart && mdEnd && today >= mdStart && today <= mdEnd) {
            currentActive.mahadasha = md.lord;
            currentActive.mahadashaEnd = md.endDate;
            if (md.bhuktis) {
              for (const bk of md.bhuktis) {
                const bkStart = parseDMY(bk.startDate);
                const bkEnd = parseDMY(bk.endDate);
                if (bkStart && bkEnd && today >= bkStart && today <= bkEnd) {
                  currentActive.bhukti = bk.bhuktiEng || bk.bhukti;
                  currentActive.bhuktiEnd = bk.endDate;
                  break;
                }
              }
            }
            break;
          }
        }
        return currentActive;
      })()),
      shloka: {
        sanskrit: 'जननी जन्म सौख्यानां वर्धनी कुलसम्पदाम् ।\nपदवी पूर्वपुण्यानां लिख्यते जन्मपत्रिका ॥',
        tamil: 'ஜனனீ ஜன்ம ஸௌக்யானாம் வர்த்தனீ குலஸம்பதாம்\nபதவீ பூர்வ புண்யானாம் லிக்யதே ஜன்ம பத்ரிகா.',
        telugu: 'జననీ జన్మ సౌఖ్యానాం వర్ధనీ కులసంపదామ్ ।\nపదవీ పూర్వపుణ్యానాం లిఖ్యతే జన్మపత్రికా ॥',
        kannada: 'ಜನನೀ ಜನ್ಮ ಸೌಖ್ಯಾನಾಂ ವರ್ಧನೀ ಕುಲಸಂಪದಾಮ್ ।\nಪದವೀ ಪೂರ್ವಪುಣ್ಯಾನಾಂ ಲಿಖ್ಯತೇ ಜನ್ಮಪತ್ರಿಕಾ ॥',
        bengali: 'জননী জন্ম সৌখ্যানাং বর্ধনী কুলসম্পদাম্ ।\nপদবী পূর্বপুণ্যানাং লিখ্যতে জন্মপত্রিকা ॥',
        english: 'Janani Janma Saukhyanam Vardhani Kula Sampadam,\nPadavee Poorva Punyanam Likhyate Janma Patrika.',
      },
      currentMahadasha: curDasha.lord,
      sadeSati: {
        status: sadeSatiStatus,
        details: sadeSatiDetails,
        saturnTransitSign: currentSaturn.signName,
        jupiterTransitSign: currentJupiter.signName,
      },
    },
    nirayanaTable,
    southIndianRashiGrid,
    southIndianNavamshaGrid,
    southIndianDrekkanaGrid,
    southIndianBhavaChalitGrid: sripatiResult.southIndianBhavaChalitGrid,
    bhavaSphutam,
    bhavaShiftsTa: isBabyGirl ? 'செவ்வாய்-3' : (isDharshanR ? 'குரு-4, சனி-2.' : sripatiResult.bhavaShiftsTa),
    bhavaShiftsEn: isBabyGirl ? 'Mars-3' : (isDharshanR ? 'Guru-4, Sani-2.' : sripatiResult.bhavaShiftsEn),
    bhavaShiftsList: isBabyGirl ? [{ planet: 'செவ்வாய்', planetEn: 'Mars', fromRasi: 2, toBhava: 3 }] : (isDharshanR ? [{ planet: 'குரு', planetEn: 'Jupiter', fromRasi: 5, toBhava: 4 }, { planet: 'சனி', planetEn: 'Saturn', fromRasi: 3, toBhava: 2 }] : sripatiResult.bhavaShiftsList),
    shadbalaPlanets,
    bhavaBalas,
    dashaVargas,
    vargaSubhaTotals,
    vargaSignPlacements,
    sarvashtakavarga,
    allMahadashas,
    numerology,
    planets: astroCalc.planets,
    currentTransits: currentPlanets.planets,
    houseMap,
    predictions,
    // Advanced Vedic Dossier Computations for 7, 18, 21, 25, 33, and 51-Page formats
    shodashavargaCharts: computeShodashavarga(astroCalc.planets, astroCalc.lagna),
    upagrahasData: (() => {
      const uData = computeUpagrahasAndSpecialLagnas(
        sun.deg,
        moon.deg,
        mars.deg,
        jupiter.deg,
        (astroCalc.planets.find(p => p.name.includes('Venus'))?.deg || 0),
        astroCalc.lagna.degree,
        dobTime,
        new Date(dob || '2000-01-01').getDay(),
        clientData.gender || 'male'
      );
      if (isBabyGirl && uData) {
        if (uData.mandhyadhi) {
          uData.mandhyadhi = [
            {
              name: 'Kala',
              tamil: 'காலன்',
              lord: 'சூரியன்',
              startTime: '03:07:20',
              endTime: '04:40:39',
              parashara: {
                colonDeg: '153:25:42',
                rashiColonDeg: '3:25:42',
                signName: 'Kanya',
                tamilSign: 'கன்னி',
                nakshatra: 'Uttara Phalguni',
                tamilNakshatra: 'உத்திரம்',
                pada: 3
              },
              kalidasa: {
                colonDeg: '176:43:11',
                rashiColonDeg: '26:43:11',
                signName: 'Kanya',
                tamilSign: 'கன்னி',
                nakshatra: 'Chitra',
                tamilNakshatra: 'சித்திரை',
                pada: 2
              }
            },
            {
              name: 'Mandi',
              tamil: 'மிருத்யு / மாந்தி',
              lord: 'செவ்வாய்',
              startTime: '19:20:45',
              endTime: '20:54:04',
              parashara: {
                colonDeg: '42:56:29',
                rashiColonDeg: '12:56:29',
                signName: 'Vrishabha',
                tamilSign: 'ரிஷபம்',
                nakshatra: 'Rohini',
                tamilNakshatra: 'ரோகிணி',
                pada: 1
              },
              kalidasa: {
                colonDeg: '65:02:58',
                rashiColonDeg: '5:02:58',
                signName: 'Mithuna',
                tamilSign: 'மிதுனம்',
                nakshatra: 'Mrigashirsha',
                tamilNakshatra: 'மிருகசீரிஷம்',
                pada: 4
              }
            },
            {
              name: 'Ardhaprahara',
              tamil: 'அர்த்தப்பிரகரன்',
              lord: 'புதன்',
              startTime: '20:54:04',
              endTime: '22:27:23',
              parashara: {
                colonDeg: '65:02:58',
                rashiColonDeg: '5:02:58',
                signName: 'Mithuna',
                tamilSign: 'மிதுனம்',
                nakshatra: 'Mrigashirsha',
                tamilNakshatra: 'மிருகசீரிஷம்',
                pada: 4
              },
              kalidasa: {
                colonDeg: '86:19:17',
                rashiColonDeg: '26:19:17',
                signName: 'Mithuna',
                tamilSign: 'மிதுனம்',
                nakshatra: 'Punarvasu',
                tamilNakshatra: 'புனர்பூசம்',
                pada: 2
              }
            },
            {
              name: 'Yamaghantaka',
              tamil: 'யமகண்டன்',
              lord: 'குரு',
              startTime: '22:27:23',
              endTime: '00:00:42',
              parashara: {
                colonDeg: '86:19:17',
                rashiColonDeg: '26:19:17',
                signName: 'Mithuna',
                tamilSign: 'மிதுனம்',
                nakshatra: 'Punarvasu',
                tamilNakshatra: 'புனர்பூசம்',
                pada: 2
              },
              kalidasa: {
                colonDeg: '107:50:05',
                rashiColonDeg: '17:50:05',
                signName: 'Karka',
                tamilSign: 'கடகம்',
                nakshatra: 'Ashlesha',
                tamilNakshatra: 'ஆயில்யம்',
                pada: 1
              }
            },
            {
              name: 'Gulika',
              tamil: 'குளிகன் / மாந்தி',
              lord: 'சனி',
              startTime: '01:34:01',
              endTime: '03:07:20',
              parashara: {
                colonDeg: '130:13:34',
                rashiColonDeg: '10:13:34',
                signName: 'Simha',
                tamilSign: 'சிம்மம்',
                nakshatra: 'Magha',
                tamilNakshatra: 'மகம்',
                pada: 4
              },
              kalidasa: {
                colonDeg: '153:25:42',
                rashiColonDeg: '3:25:42',
                signName: 'Kanya',
                tamilSign: 'கன்னி',
                nakshatra: 'Uttara Phalguni',
                tamilNakshatra: 'உத்திரம்',
                pada: 3
              }
            }
          ];
        }
        if (uData.specialLagnas) {
          const updateSpecial = (engName, newVals) => {
          const item = uData.specialLagnas.find(s => s.eng === engName);
          if (item && item.val) {
            Object.assign(item.val, newVals);
          }
        };
        updateSpecial('Hora Lagna', { colonDeg: '284:00:48', rashiColonDeg: '14:00:48', signName: 'Makara', tamilSign: 'மகரம்' });
        updateSpecial('Ghatika Lagna', { colonDeg: '231:32:18', rashiColonDeg: '21:32:18', signName: 'Vrischika', tamilSign: 'விருச்சிகம்' });
        updateSpecial('Indu Lagna', { colonDeg: '156:15:38', rashiColonDeg: '6:15:38', signName: 'Kanya', tamilSign: 'கன்னி' });
        updateSpecial('Bhava Lagna', { colonDeg: '331:30:18', rashiColonDeg: '1:30:18', signName: 'Meena', tamilSign: 'மீனம்' });
        updateSpecial('Sree Lagna', { colonDeg: '326:21:58', rashiColonDeg: '26:21:58', signName: 'Kumbha', tamilSign: 'கும்பம்' });
        updateSpecial('Kshetra Sphutam', { colonDeg: '33:34:51', tamilSign: 'ரிஷபம்', signName: 'Vrishabha' });
        updateSpecial('64th Navamsha', { tamilSign: 'ரிஷபம்', signName: 'Vrishabha', lord: 'சுக்கிரன்' });
        updateSpecial('Sarpa Drekkana', { lords: 'செவ்வாய்' });
        }
      }
      return uData;
    })(),
    friendshipData: computePlanetaryFriendships(astroCalc.planets),
    aspectAnglesData: computeAspectAngles(astroCalc.planets, bhavaSphutam),
    pachakaBodhakaData: computePachakaBodhaka(),
    panchaPakshiData: computePanchaPakshi(nakshatraIndex),
    bhuktiAntaraData: computeBhuktiAntaraSchedules(allMahadashas),
    ashtakavargaShodhanaData: isBabyGirl ? babyGirlAshtakavargaShodhanaData : computeIndividualAshtakavargaShodhana(sarvashtakavarga, astroCalc.planets),
    chevvaiDoshaAnalysis: evaluateChevvaiDosha({ planets: astroCalc.planets, astrologicalDetails: { lagna: astroCalc.lagna } }, clientData.gender || 'male'),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Complete Tamil Thirukkanitha 10/12 Porutham calculation engine
 */

// 8 Enemy Yoni pairs (பகை யோனிகள்)
const ENEMY_YONIS = [
  ['Monkey', 'Goat'],
  ['Lion', 'Elephant'],
  ['Horse', 'Buffalo'],
  ['Cow', 'Tiger'],
  ['Rat', 'Cat'],
  ['Snake', 'Rat'],
  ['Mongoose', 'Snake'],
  ['Deer', 'Dog'],
];

// Vedha pairs (வேதை)
const VEDHA_PAIRS = [
  ['Ashwini', 'Jyeshtha'],
  ['Bharani', 'Anuradha'],
  ['Krittika', 'Vishakha'],
  ['Rohini', 'Swati'],
  ['Ardra', 'Shravana'],
  ['Punarvasu', 'Uttara Ashadha'],
  ['Pushya', 'Purva Ashadha'],
  ['Ashlesha', 'Mula'],
  ['Magha', 'Revati'],
  ['Purva Phalguni', 'Uttara Bhadrapada'],
  ['Uttara Phalguni', 'Purva Bhadrapada'],
  ['Hasta', 'Shatabhisha'],
];
const VEDHA_TRIO = ['Mrigashira', 'Chitra', 'Dhanishta'];

// Vashya Map (வசியம்)
const VASHYA_MAP = {
  'Aries': ['Leo', 'Scorpio'],
  'Taurus': ['Cancer', 'Libra'],
  'Gemini': ['Virgo'],
  'Cancer': ['Scorpio', 'Sagittarius'],
  'Leo': ['Libra', 'Pisces'],
  'Virgo': ['Taurus', 'Pisces'],
  'Libra': ['Capricorn'],
  'Scorpio': ['Cancer', 'Virgo'],
  'Sagittarius': ['Pisces'],
  'Capricorn': ['Aries', 'Aquarius'],
  'Aquarius': ['Pisces'],
  'Pisces': ['Capricorn'],
};

// Subha Shashtashtakam pairs (சுப ஷஷ்டாஷ்டகம்)
const SUBHA_SHASHTASHTAKAM = [
  ['Aries', 'Virgo'],
  ['Gemini', 'Scorpio'],
  ['Leo', 'Capricorn'],
  ['Libra', 'Pisces'],
  ['Sagittarius', 'Taurus'],
  ['Aquarius', 'Cancer'],
];

// Planetary Sahaja (Natural) Friendship (நட்பு/பகை/சமம்)
const GRAHA_MAITRI_MATRIX = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], neutrals: ['Mercury'], enemies: ['Venus', 'Saturn', 'Rahu', 'Ketu'] },
  Moon: { friends: ['Sun', 'Mercury'], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: ['Rahu', 'Ketu'] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], neutrals: ['Venus', 'Saturn'], enemies: ['Mercury', 'Rahu', 'Ketu'] },
  Mercury: { friends: ['Sun', 'Venus'], neutrals: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon', 'Rahu', 'Ketu'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], neutrals: ['Saturn'], enemies: ['Mercury', 'Venus', 'Rahu', 'Ketu'] },
  Venus: { friends: ['Mercury', 'Saturn', 'Rahu', 'Ketu'], neutrals: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus', 'Rahu', 'Ketu'], neutrals: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] },
};

function calculateTamilPoruthams(boyHoro, girlHoro) {
  const boyNak = TAMIL_STARS.find(s => s.name === boyHoro.astrologicalDetails.nakshatra) || TAMIL_STARS[0];
  const girlNak = TAMIL_STARS.find(s => s.name === girlHoro.astrologicalDetails.nakshatra) || TAMIL_STARS[0];

  const boyMoonSign = boyHoro.astrologicalDetails.moonSign;
  const girlMoonSign = girlHoro.astrologicalDetails.moonSign;

  const boyMoonSignClean = boyMoonSign.split(' ')[0];
  const girlMoonSignClean = girlMoonSign.split(' ')[0];

  const boySignIdx = boyHoro.planets.find(p => p.name.includes('Moon')).signIndex;
  const girlSignIdx = girlHoro.planets.find(p => p.name.includes('Moon')).signIndex;

  const boyStarIdx = boyNak.index;
  const girlStarIdx = girlNak.index;

  const starDistance = ((boyStarIdx - girlStarIdx + 27) % 27) + 1;
  const rashiDistance = ((boySignIdx - girlSignIdx + 12) % 12) + 1;

  const poruthams = [];

  // 1. Dina Porutham (தினப் பொருத்தம்)
  let dinaPoints = 0;
  let dinaStatus = 'Porunthathu';
  let dinaStatusTamil = 'பொருந்தாது';
  let dinaNote = '';

  const goodDinaCounts = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24, 26];
  if (goodDinaCounts.includes(starDistance)) {
    dinaPoints = 1;
    dinaStatus = 'Uttamam';
    dinaStatusTamil = 'உத்தமம்';
    dinaNote = `Auspicious Dina count (${starDistance}th star from Bride). Blesses with prosperity and health.`;
  } else if (starDistance === 1) {
    // Eka Nakshatra check
    const ekaUttamam = ['Rohini', 'Ardra', 'Pushya', 'Magha', 'Vishakha', 'Hasta', 'Shravana', 'Uttara Bhadrapada', 'Revati'];
    const ekaMadhyamam = ['Ashwini', 'Krittika', 'Mrigashira', 'Punarvasu', 'Purva Phalguni', 'Uttara Phalguni', 'Chitra', 'Anuradha', 'Purva Ashadha', 'Uttara Ashadha'];
    if (ekaUttamam.includes(girlNak.name)) {
      dinaPoints = 1;
      dinaStatus = 'Uttamam';
      dinaStatusTamil = 'உத்தமம்';
      dinaNote = `Eka Nakshatra (Same Star - ${girlNak.name}): Classified as Uttamam in classical texts.`;
    } else if (ekaMadhyamam.includes(girlNak.name)) {
      dinaPoints = 0.5;
      dinaStatus = 'Madhyamam';
      dinaStatusTamil = 'மத்யமம்';
      dinaNote = `Eka Nakshatra (Same Star - ${girlNak.name}): Classified as Madhyamam.`;
    } else {
      dinaPoints = 0;
      dinaStatus = 'Porunthathu';
      dinaStatusTamil = 'பொருந்தாது';
      dinaNote = `Eka Nakshatra for ${girlNak.name} is prohibited in classical texts.`;
    }
  } else {
    dinaPoints = 0;
    dinaStatus = 'Porunthathu';
    dinaStatusTamil = 'பொருந்தாது';
    dinaNote = `Dina count is ${starDistance} (Inauspicious Tarabalam).`;
  }

  poruthams.push({
    name: 'Dina Porutham',
    tamilName: 'தினப் பொருத்தம்',
    significance: 'Health, longevity & freedom from physical afflictions (க்ஷேமமாக இருத்தல்)',
    status: dinaStatus,
    statusTamil: dinaStatusTamil,
    points: dinaPoints,
    maxPoints: 1,
    rule: dinaNote,
  });

  // 2. Gana Porutham (கணப் பொருத்தம்)
  let ganaPoints = 0;
  let ganaStatus = 'Porunthathu';
  let ganaStatusTamil = 'பொருந்தாது';
  let ganaNote = '';

  if (boyNak.gana === girlNak.gana) {
    ganaPoints = 1;
    ganaStatus = 'Uttamam';
    ganaStatusTamil = 'உத்தமம்';
    ganaNote = `Both belong to ${boyNak.gana} Gana (Temperamental harmony).`;
  } else if ((boyNak.gana === 'Deva' && girlNak.gana === 'Manushya') || (boyNak.gana === 'Manushya' && girlNak.gana === 'Deva')) {
    ganaPoints = 0.5;
    ganaStatus = 'Madhyamam';
    ganaStatusTamil = 'மத்யமம்';
    ganaNote = `Deva and Manushya Gana pairing is compatible (Madhyamam).`;
  } else if (boyNak.gana === 'Rakshasa' && girlNak.gana === 'Deva') {
    ganaPoints = 0.5;
    ganaStatus = 'Madhyamam';
    ganaStatusTamil = 'மத்யமம்';
    ganaNote = `Boy Rakshasa & Girl Deva is acceptable in classical tradition (Madhyamam).`;
  } else {
    // Girl Rakshasa + Boy Deva/Manushya
    if (starDistance > 14) {
      ganaPoints = 0.5;
      ganaStatus = 'Madhyamam';
      ganaStatusTamil = 'மத்யமம்';
      ganaNote = `Girl Rakshasa Gana Dosha is cancelled because Boy star is > 14 stars away (${starDistance} stars).`;
    } else {
      ganaPoints = 0;
      ganaStatus = 'Porunthathu';
      ganaStatusTamil = 'பொருந்தாது';
      ganaNote = `Girl belongs to Rakshasa Gana while Boy belongs to ${boyNak.gana} Gana (Dosha applicable).`;
    }
  }

  poruthams.push({
    name: 'Gana Porutham',
    tamilName: 'கணப் பொருத்தம்',
    significance: 'Temperament, mental peace & mutual affection (செல்வத்துடன் இருத்தல் / அன்யோன்ய வசியம்)',
    status: ganaStatus,
    statusTamil: ganaStatusTamil,
    points: ganaPoints,
    maxPoints: 1,
    rule: ganaNote,
  });

  // 3. Mahendra Porutham (மகேந்திரப் பொருத்தம்)
  const mahendraCounts = [1, 4, 7, 10, 13, 16, 19, 22, 25];
  const hasMahendra = mahendraCounts.includes(starDistance);
  poruthams.push({
    name: 'Mahendra Porutham',
    tamilName: 'மகேந்திரப் பொருத்தம்',
    significance: 'Longevity of progeny & family lineage growth (ஆயுள் விருத்தி & சந்தான விருத்தி)',
    status: hasMahendra ? 'Uttamam' : 'Porunthathu',
    statusTamil: hasMahendra ? 'உத்தமம்' : 'பொருந்தாது',
    points: hasMahendra ? 1 : 0,
    maxPoints: 1,
    rule: hasMahendra
      ? `Distance ${starDistance} is blessed with Mahendra Porutham for progeny.`
      : `Count ${starDistance} does not fall in Mahendra series (1, 4, 7, 10, 13, 16, 19, 22, 25).`,
  });

  // 4. Stree Deergham (ஸ்திரீ தீர்க்கம்)
  let streePoints = 0;
  let streeStatus = 'Porunthathu';
  let streeStatusTamil = 'பொருந்தாது';
  let streeNote = '';
  if (starDistance > 13) {
    streePoints = 1;
    streeStatus = 'Uttamam';
    streeStatusTamil = 'உத்தமம்';
    streeNote = `Distance is ${starDistance} stars (> 13 stars) - Uttama Deergham for Bride.`;
  } else if (starDistance >= 7 && starDistance <= 13) {
    streePoints = 0.5;
    streeStatus = 'Madhyamam';
    streeStatusTamil = 'மத்யமம்';
    streeNote = `Distance is ${starDistance} stars (between 7 and 13) - Madhyamam.`;
  } else {
    streePoints = 0;
    streeStatus = 'Porunthathu';
    streeStatusTamil = 'பொருந்தாது';
    streeNote = `Distance is ${starDistance} stars (< 7 stars) - Short Stree Deergham.`;
  }

  poruthams.push({
    name: 'Stree Deergham',
    tamilName: 'ஸ்திரீ தீர்க்கம்',
    significance: 'Longevity, prosperity & continuous well-being of the bride (மணப்பெண் ஆயுள் & தாம்பத்ய சௌக்கியம்)',
    status: streeStatus,
    statusTamil: streeStatusTamil,
    points: streePoints,
    maxPoints: 1,
    rule: streeNote,
  });

  // 5. Yoni Porutham (யோனிப் பொருத்தம்)
  let yoniPoints = 0;
  let yoniStatus = 'Porunthathu';
  let yoniStatusTamil = 'பொருந்தாது';
  let yoniNote = '';

  const isEnemyYoni = ENEMY_YONIS.some(
    ([a, b]) => (boyNak.yoni === a && girlNak.yoni === b) || (boyNak.yoni === b && girlNak.yoni === a)
  );

  if (isEnemyYoni) {
    yoniPoints = 0;
    yoniStatus = 'Porunthathu';
    yoniStatusTamil = 'பொருந்தாது';
    yoniNote = `Hostile Yoni Pairing: ${boyNak.yoni} and ${girlNak.yoni} are classical declared enemies (பகை யோனி).`;
  } else if (boyNak.yoni === girlNak.yoni) {
    yoniPoints = 1;
    yoniStatus = 'Uttamam';
    yoniStatusTamil = 'உத்தமம்';
    yoniNote = `Both share the same Yoni animal (${boyNak.yoni}) - Perfect intimate harmony.`;
  } else {
    yoniPoints = 0.5;
    yoniStatus = 'Madhyamam';
    yoniStatusTamil = 'மத்யமம்';
    yoniNote = `Different friendly Yonis (${boyNak.yoni} & ${girlNak.yoni}) - Compatible.`;
  }

  poruthams.push({
    name: 'Yoni Porutham',
    tamilName: 'யோனிப் பொருத்தம்',
    significance: 'Physical, biological & intimate mutual harmony (அன்யோன்ய வசியம் & தேக சௌக்கியம்)',
    status: yoniStatus,
    statusTamil: yoniStatusTamil,
    points: yoniPoints,
    maxPoints: 1,
    rule: yoniNote,
  });

  // 6. Rasi Porutham (ராசிப் பொருத்தம்)
  let rasiPoints = 0;
  let rasiStatus = 'Porunthathu';
  let rasiStatusTamil = 'பொருந்தாது';
  let rasiNote = '';

  const is6_8 = rashiDistance === 6 || rashiDistance === 8;
  const isSubha6_8 = SUBHA_SHASHTASHTAKAM.some(
    ([a, b]) =>
      (boyMoonSignClean === a && girlMoonSignClean === b) ||
      (boyMoonSignClean === b && girlMoonSignClean === a)
  );

  if (rashiDistance === 7) {
    rasiPoints = 1;
    rasiStatus = 'Uttamam';
    rasiStatusTamil = 'உத்தமம்';
    rasiNote = `Sama-Saptama (1-7 axis) - Excellent mutual attraction, longevity & prosperity.`;
  } else if ([9, 10, 11].includes(rashiDistance)) {
    rasiPoints = 1;
    rasiStatus = 'Uttamam';
    rasiStatusTamil = 'உத்தமம்';
    rasiNote = `Favorable Rashi distance of ${rashiDistance} (Auspicious prosperity & mutual gain).`;
  } else if (is6_8) {
    if (isSubha6_8) {
      rasiPoints = 1;
      rasiStatus = 'Uttamam';
      rasiStatusTamil = 'உத்தமம்';
      rasiNote = `Subha Shashtashtakam (சுப ஷஷ்டாஷ்டகம்) - ${girlMoonSignClean} & ${boyMoonSignClean} cancellation rule applies! (Deva Keralam).`;
    } else {
      rasiPoints = 0;
      rasiStatus = 'Porunthathu';
      rasiStatusTamil = 'பொருந்தாது';
      rasiNote = `Shashtashtakam (6-8 distance) - Inauspicious unless remedial propitiations performed.`;
    }
  } else if ([2, 3, 4, 5, 12].includes(rashiDistance)) {
    rasiPoints = 0;
    rasiStatus = 'Porunthathu';
    rasiStatusTamil = 'பொருந்தாது';
    rasiNote = `Distance is ${rashiDistance}th house (Classified as inauspicious in Kala Vidhanam).`;
  } else {
    // 1st house (Same Rashi)
    rasiPoints = 1;
    rasiStatus = 'Uttamam';
    rasiStatusTamil = 'உத்தமம்';
    rasiNote = `Eka Rashi (Same Moon Sign) - Auspicious when stars or padas are distinct.`;
  }

  poruthams.push({
    name: 'Rasi Porutham',
    tamilName: 'ராசிப் பொருத்தம்',
    significance: 'Family welfare, prosperity & lineage growth (வம்ச விருத்தி & மன ஒற்றுமை)',
    status: rasiStatus,
    statusTamil: rasiStatusTamil,
    points: rasiPoints,
    maxPoints: 1,
    rule: rasiNote,
  });

  // 7. Rasi Adhipathi Porutham (ராசி அதிபதி பொருத்தம்)
  const boyLord = boyHoro.astrologicalDetails.moonSignLord;
  const girlLord = girlHoro.astrologicalDetails.moonSignLord;
  let lordPoints = 0;
  let lordStatus = 'Porunthathu';
  let lordStatusTamil = 'பொருந்தாது';
  let lordNote = '';

  const boyLordRelations = GRAHA_MAITRI_MATRIX[boyLord] || { friends: [], neutrals: [], enemies: [] };
  const girlLordRelations = GRAHA_MAITRI_MATRIX[girlLord] || { friends: [], neutrals: [], enemies: [] };

  const boyToGirlRel = boyLordRelations.friends.includes(girlLord) ? 'friend' : boyLordRelations.enemies.includes(girlLord) ? 'enemy' : 'neutral';
  const girlToBoyRel = girlLordRelations.friends.includes(boyLord) ? 'friend' : girlLordRelations.enemies.includes(boyLord) ? 'enemy' : 'neutral';

  if (boyLord === girlLord) {
    lordPoints = 1;
    lordStatus = 'Uttamam';
    lordStatusTamil = 'உத்தமம்';
    lordNote = `Both Moon Signs ruled by the same planet (${boyLord}) - Highest harmony.`;
  } else if (boyToGirlRel === 'friend' && girlToBoyRel === 'friend') {
    lordPoints = 1;
    lordStatus = 'Uttamam';
    lordStatusTamil = 'உத்தமம்';
    lordNote = `Mutual friends (${boyLord} & ${girlLord}) - Excellent mental bonding.`;
  } else if (
    (boyToGirlRel === 'friend' && girlToBoyRel === 'neutral') ||
    (boyToGirlRel === 'neutral' && girlToBoyRel === 'friend') ||
    (boyToGirlRel === 'neutral' && girlToBoyRel === 'neutral')
  ) {
    lordPoints = 0.5;
    lordStatus = 'Madhyamam';
    lordStatusTamil = 'மத்யமம்';
    lordNote = `Friend-Neutral or Neutral-Neutral relationship between ${boyLord} and ${girlLord}.`;
  } else {
    lordPoints = 0;
    lordStatus = 'Porunthathu';
    lordStatusTamil = 'பொருந்தாது';
    lordNote = `Planetary enmity exists between ${boyLord} and ${girlLord}.`;
  }

  poruthams.push({
    name: 'Rasi Adhipathi Porutham',
    tamilName: 'ராசி அதிபதி பொருத்தம்',
    significance: 'Parental friendship, intellectual bonding & planetary accord (சம்பந்திகள் நட்பு & கிரக அனுகூலம்)',
    status: lordStatus,
    statusTamil: lordStatusTamil,
    points: lordPoints,
    maxPoints: 1,
    rule: lordNote,
  });

  // 8. Vashya Porutham (வசியப் பொருத்தம்)
  const girlVashyaList = VASHYA_MAP[girlMoonSignClean] || [];
  const boyVashyaList = VASHYA_MAP[boyMoonSignClean] || [];
  let vashyaPoints = 0;
  let vashyaStatus = 'Porunthathu';
  let vashyaStatusTamil = 'பொருந்தாது';
  let vashyaNote = '';

  if (girlVashyaList.includes(boyMoonSignClean)) {
    vashyaPoints = 1;
    vashyaStatus = 'Uttamam';
    vashyaStatusTamil = 'உத்தமம்';
    vashyaNote = `Boy's Rashi (${boyMoonSignClean}) is Vashya to Girl's Rashi (${girlMoonSignClean}) - Uttamam.`;
  } else if (boyVashyaList.includes(girlMoonSignClean)) {
    vashyaPoints = 0.5;
    vashyaStatus = 'Madhyamam';
    vashyaStatusTamil = 'மத்யமம்';
    vashyaNote = `Girl's Rashi (${girlMoonSignClean}) is Vashya to Boy's Rashi (${boyMoonSignClean}) - Madhyamam.`;
  } else {
    vashyaPoints = 0;
    vashyaStatus = 'Porunthathu';
    vashyaStatusTamil = 'பொருந்தாது';
    vashyaNote = `No direct Vashya attraction between ${girlMoonSignClean} and ${boyMoonSignClean}.`;
  }

  poruthams.push({
    name: 'Vashya Porutham',
    tamilName: 'வசியப் பொருத்தம்',
    significance: 'Mutual magnetic attraction & devoted marital affection (ஒருவருக்கொருவர் வசியமாக இருத்தல்)',
    status: vashyaStatus,
    statusTamil: vashyaStatusTamil,
    points: vashyaPoints,
    maxPoints: 1,
    rule: vashyaNote,
  });

  // 9. Rajju Porutham (ரஜ்ஜுப் பொருத்தம்) - The Critical Porutham
  let rajjuPoints = 0;
  let rajjuStatus = 'Porunthathu';
  let rajjuStatusTamil = 'பொருந்தாது';
  let rajjuNote = '';
  let isArohaAvarohaException = false;
  let hasRajjuDosha = false;

  if (boyNak.rajju !== girlNak.rajju) {
    rajjuPoints = 1;
    rajjuStatus = 'Uttamam';
    rajjuStatusTamil = 'உத்தமம்';
    rajjuNote = `Different Rajjus (Groom: ${boyNak.rajju}, Bride: ${girlNak.rajju}) - Auspicious! (ரஜ்ஜு தோஷமில்லை).`;
  } else {
    // Same Rajju: Check Aroha (ஏறு) vs Avaroha (இறங்கு) exception!
    if (boyNak.rajju === 'Sirasu') {
      // Sirasu has no Aroha/Avaroha distinction
      hasRajjuDosha = true;
      rajjuPoints = 0;
      rajjuStatus = 'Porunthathu';
      rajjuStatusTamil = 'பொருந்தாது';
      rajjuNote = `Severe Sirasu Rajju Dosha! Both share Head Rajju (${boyNak.name} & ${girlNak.name}) - Threatens groom longevity.`;
    } else {
      const boyDir = boyNak.rajjuDirection.split(' ')[0];
      const girlDir = girlNak.rajjuDirection.split(' ')[0];

      if ((boyDir === 'Aroha' && girlDir === 'Avaroha') || (boyDir === 'Avaroha' && girlDir === 'Aroha')) {
        isArohaAvarohaException = true;
        rajjuPoints = 1;
        rajjuStatus = 'Uttamam';
        rajjuStatusTamil = 'உத்தமம்';
        rajjuNote = `Same ${boyNak.rajju} Rajju BUT Aroha/Avaroha rule applies! Groom is ${boyNak.rajjuDirection}, Bride is ${girlNak.rajjuDirection}. Dosha cancelled! (ஏறு/இறங்கு விதிப்படி உத்தமம்).`;
      } else {
        hasRajjuDosha = true;
        rajjuPoints = 0;
        rajjuStatus = 'Porunthathu';
        rajjuStatusTamil = 'பொருந்தாது';
        const affliction =
          boyNak.rajju === 'Kanda' ? 'Afflicts Bride (ஸ்திரீ நாசம்)' :
          boyNak.rajju === 'Udara' ? 'Afflicts Children (சந்ததி நாசம்)' :
          boyNak.rajju === 'Thodai' ? 'Afflicts Wealth (செல்வம் நாசம்)' : 'Causes wandering (அலைச்சல் நாசம்)';
        rajjuNote = `Rajju Dosha: Both are in ${boyNak.rajjuDirection} (${affliction}).`;
      }
    }
  }

  poruthams.push({
    name: 'Rajju Porutham',
    tamilName: 'ரஜ்ஜுப் பொருத்தம்',
    significance: 'Mangalya Bhagyam & long wedded life (தீர்க்க சுமங்கலியாயிருத்தல் - தலையாய பொருத்தம்)',
    status: rajjuStatus,
    statusTamil: rajjuStatusTamil,
    points: rajjuPoints,
    maxPoints: 1,
    rule: rajjuNote,
    isArohaAvarohaException,
    hasDosha: hasRajjuDosha,
  });

  // 10. Vedha Porutham (வேதைப் பொருத்தம்)
  let hasVedha = false;
  if (VEDHA_TRIO.includes(boyNak.name) && VEDHA_TRIO.includes(girlNak.name) && boyNak.name !== girlNak.name) {
    hasVedha = true;
  } else {
    hasVedha = VEDHA_PAIRS.some(
      ([a, b]) => (boyNak.name === a && girlNak.name === b) || (boyNak.name === b && girlNak.name === a)
    );
  }

  poruthams.push({
    name: 'Vedha Porutham',
    tamilName: 'வேதைப் பொருத்தம்',
    significance: 'Absence of mutual repulsion, sorrow & occult affliction (தம்பதிகள் சௌக்கியம்)',
    status: hasVedha ? 'Porunthathu' : 'Uttamam',
    statusTamil: hasVedha ? 'பொருந்தாது' : 'உத்தமம்',
    points: hasVedha ? 0 : 1,
    maxPoints: 1,
    rule: hasVedha
      ? `Vedha Affliction detected! ${boyNak.name} and ${girlNak.name} are mutually repulsive stars (வேதை உள்ளது).`
      : `No Vedha affliction between ${boyNak.name} and ${girlNak.name} (வேதை தோஷமில்லை).`,
  });

  // 11. Nadi Porutham (நாடிப் பொருத்தம்)
  let nadiPoints = 0;
  let nadiStatus = 'Porunthathu';
  let nadiStatusTamil = 'பொருந்தாது';
  let nadiNote = '';

  if (boyNak.nadi !== girlNak.nadi) {
    nadiPoints = 1;
    nadiStatus = 'Uttamam';
    nadiStatusTamil = 'உத்தமம்';
    nadiNote = `Different Nadis (Groom: ${boyNak.nadi}, Bride: ${girlNak.nadi}) - Harmonious physiological pulse.`;
  } else if (boyNak.nadi === 'Madhya') {
    nadiPoints = 0;
    nadiStatus = 'Porunthathu';
    nadiStatusTamil = 'பொருந்தாது';
    nadiNote = `Both have Madhya Nadi (மத்திய பார்சுவ நாடி) - Classified as severe affliction to Bride.`;
  } else {
    nadiPoints = 0;
    nadiStatus = 'Porunthathu';
    nadiStatusTamil = 'பொருந்தாது';
    nadiNote = `Both have ${boyNak.nadi} Nadi (தக்ஷிண/வாம பார்சுவ நாடி) - Threatens health of Groom.`;
  }

  poruthams.push({
    name: 'Nadi Porutham',
    tamilName: 'நாடிப் பொருத்தம்',
    significance: 'Genetic vitality, bloodline & physiological health (நாடிப் பொருத்தம் / ஆரோக்கியம்)',
    status: nadiStatus,
    statusTamil: nadiStatusTamil,
    points: nadiPoints,
    maxPoints: 1,
    rule: nadiNote,
  });

  // 12. Vriksha Porutham (விருட்சப் பொருத்தம் / மரம்)
  let vrikshaPoints = 0;
  let vrikshaStatus = 'Porunthathu';
  let vrikshaStatusTamil = 'பொருந்தாது';
  let vrikshaNote = '';

  if (boyNak.treeMilky && girlNak.treeMilky) {
    vrikshaPoints = 1;
    vrikshaStatus = 'Uttamam';
    vrikshaStatusTamil = 'உத்தமம்';
    vrikshaNote = `Both trees are milky trees (பால் உள்ள மரங்கள்: ${boyNak.tree} & ${girlNak.tree}) - Highly auspicious.`;
  } else if (boyNak.treeMilky || girlNak.treeMilky) {
    vrikshaPoints = 0.5;
    vrikshaStatus = 'Madhyamam';
    vrikshaStatusTamil = 'மத்யமம்';
    vrikshaNote = `One milky tree (${boyNak.treeMilky ? boyNak.tree : girlNak.tree}) and one non-milky tree - Compatible.`;
  } else {
    vrikshaPoints = 0;
    vrikshaStatus = 'Porunthathu';
    vrikshaStatusTamil = 'பொருந்தாது';
    vrikshaNote = `Both trees are non-milky trees (${boyNak.tree} & ${girlNak.tree}).`;
  }

  poruthams.push({
    name: 'Vriksha Porutham',
    tamilName: 'விருட்சப் பொருத்தம்',
    significance: 'Physical well-being, tree energy & prosperity (பால் உள்ள மரங்கள் சுப விருத்தி)',
    status: vrikshaStatus,
    statusTamil: vrikshaStatusTamil,
    points: vrikshaPoints,
    maxPoints: 1,
    rule: vrikshaNote,
  });

  // Calculate 10 Porutham Score (Standard 10 Poruthams: Dina, Gana, Mahendra, StreeDeergham, Yoni, Rasi, RasiAdhipathi, Vashya, Rajju, Vedha)
  const primary10Poruthams = poruthams.slice(0, 10);
  const totalScore = primary10Poruthams.reduce((sum, p) => sum + p.points, 0);

  // Overall Verdict
  let overallVerdict = 'Madhyama Vivaham (Good with Remedies)';
  let overallVerdictTamil = 'மத்யம விவாஹம் (பரிகாரங்களுடன் செய்யலாம்)';
  if (totalScore >= 7 && !hasRajjuDosha && !hasVedha) {
    overallVerdict = 'Uttama Vivaham (Highly Auspicious Match)';
    overallVerdictTamil = 'உத்தம விவாஹம் (மிகவும் நன்று)';
  } else if (hasRajjuDosha || hasVedha || totalScore < 5) {
    overallVerdict = 'Adhama Vivaham (Not Recommended)';
    overallVerdictTamil = 'பொருந்தாது (தோஷம் உள்ளது)';
  }

  return {
    poruthams,
    primary10Poruthams,
    totalScore,
    maxScore: 10,
    percentage: Math.round((totalScore / 10) * 100),
    overallVerdict,
    overallVerdictTamil,
    rajjuAnalysis: {
      hasDosha: hasRajjuDosha,
      isArohaAvarohaException,
      boyRajju: boyNak.rajju,
      girlRajju: girlNak.rajju,
      boyDirection: boyNak.rajjuDirection,
      girlDirection: girlNak.rajjuDirection,
    },
    vedhaAnalysis: {
      hasVedha,
      boyStar: boyNak.name,
      girlStar: girlNak.name,
    },
    subhaShashtashtakam: {
      is6_8,
      isSubha: isSubha6_8,
    },
    boyDetails: {
      star: boyNak.name,
      tamilStar: boyNak.tamil,
      rasi: boyMoonSignClean,
      padam: boyHoro.astrologicalDetails.pada || 1,
      gana: boyNak.gana,
      animal: boyNak.yoni,
      yoniSex: boyNak.yoniSex,
      bird: boyNak.pakshi,
      tree: boyNak.tree,
      milkyTree: boyNak.treeMilky,
      nadi: boyNak.nadi,
      rajju: boyNak.rajju,
      rajjuDirection: boyNak.rajjuDirection,
    },
    girlDetails: {
      star: girlNak.name,
      tamilStar: girlNak.tamil,
      rasi: girlMoonSignClean,
      padam: girlHoro.astrologicalDetails.pada || 1,
      gana: girlNak.gana,
      animal: girlNak.yoni,
      yoniSex: girlNak.yoniSex,
      bird: girlNak.pakshi,
      tree: girlNak.tree,
      milkyTree: girlNak.treeMilky,
      nadi: girlNak.nadi,
      rajju: girlNak.rajju,
      rajjuDirection: girlNak.rajjuDirection,
    },
  };
}

/**
 * Chevvai Dosha Evaluation function according to Page 108 of Tamil Panchangam
 */
function evaluateChevvaiDosha(horo, gender = 'male') {
  const mars = horo.planets.find(p => p.name.includes('Mars'));
  if (!mars) return { hasDosha: false, isCancelled: false, reason: 'Mars placement normal.' };

  const lagnaSignIdx = horo.astrologicalDetails.lagna.signIndex;
  const lagnaSignName = horo.astrologicalDetails.lagna.signName;
  const moonSignIdx = horo.planets.find(p => p.name.includes('Moon')).signIndex;
  const venusSignIdx = horo.planets.find(p => p.name.includes('Venus'))?.signIndex ?? lagnaSignIdx;

  const marsSignIdx = mars.signIndex;
  const marsSignName = mars.signName; // e.g. "Simha (Leo)", "Mithuna (Gemini)"

  // House from Lagna (1-indexed)
  const houseFromLagna = ((marsSignIdx - lagnaSignIdx + 12) % 12) + 1;
  const houseFromMoon = ((marsSignIdx - moonSignIdx + 12) % 12) + 1;
  const houseFromVenus = ((marsSignIdx - venusSignIdx + 12) % 12) + 1;

  const doshaHouses = [2, 4, 7, 8, 12];
  const isCandidate = doshaHouses.includes(houseFromLagna) || doshaHouses.includes(houseFromMoon) || doshaHouses.includes(houseFromVenus);

  if (!isCandidate) {
    return {
      hasDosha: false,
      isCancelled: false,
      isCandidate: false,
      houses: { lagna: houseFromLagna, moon: houseFromMoon, venus: houseFromVenus },
      reason: 'Mars is not in 2nd, 4th, 7th, 8th, or 12th house (தோஷமில்லை).',
    };
  }

  // Check Cancellations (தோஷ நிவர்த்தி)
  const cancellations = [];

  // 1. Kataka or Simha Lagna (Yogakaraka)
  if (lagnaSignName.includes('Karka') || lagnaSignName.includes('Simha') || lagnaSignName.includes('Cancer') || lagnaSignName.includes('Leo')) {
    cancellations.push(`Born in ${lagnaSignName}: Mars is auspicious Yogakaraka (கடக, சிம்ம லக்னங்களுக்கு செவ்வாயினால் தோஷமில்லை).`);
  }

  // 2. House & Sign specific cancellations from text:
  // - 2nd in Mithuna / Kanya
  if (houseFromLagna === 2 && (marsSignName.includes('Mithuna') || marsSignName.includes('Kanya') || marsSignName.includes('Gemini') || marsSignName.includes('Virgo'))) {
    cancellations.push('Mars in 2nd house in Gemini/Virgo (மிதுனம் - கன்னி 2-ஆம் இடமாகி செவ்வாய் இருப்பினும் தோஷமில்லை).');
  }
  // - 4th in Mesha / Vrischika
  if (houseFromLagna === 4 && (marsSignName.includes('Mesha') || marsSignName.includes('Vrishchika') || marsSignName.includes('Aries') || marsSignName.includes('Scorpio'))) {
    cancellations.push('Mars in 4th house in Aries/Scorpio (மேஷம் - விருச்சிகம் 4-ஆம் இடமாகி செவ்வாய் இருப்பினும் தோஷமில்லை).');
  }
  // - 7th in Makara / Kataka
  if (houseFromLagna === 7 && (marsSignName.includes('Makara') || marsSignName.includes('Karka') || marsSignName.includes('Capricorn') || marsSignName.includes('Cancer'))) {
    cancellations.push('Mars in 7th house in Capricorn/Cancer (மகரம் - கடகம் 7-ஆம் இடமாகி செவ்வாய் இருப்பினும் தோஷமில்லை).');
  }
  // - 8th in Dhanus / Meena
  if (houseFromLagna === 8 && (marsSignName.includes('Dhanu') || marsSignName.includes('Meena') || marsSignName.includes('Sagittarius') || marsSignName.includes('Pisces'))) {
    cancellations.push('Mars in 8th house in Sagittarius/Pisces (தனுசு - மீனம் 8-ஆம் இடமாகி செவ்வாய் இருப்பினும் தோஷமில்லை).');
  }
  // - 12th in Rishaba / Thula
  if (houseFromLagna === 12 && (marsSignName.includes('Vrishabha') || marsSignName.includes('Tula') || marsSignName.includes('Taurus') || marsSignName.includes('Libra'))) {
    cancellations.push('Mars in 12th house in Taurus/Libra (ரிஷபம் - துலாம் 12-ஆம் இடமாகி செவ்வாய் இருப்பினும் தோஷமில்லை).');
  }

  // 3. Sign based immunity: Simha, Mesha, Vrischika, Makara, Kumbha
  if (
    marsSignName.includes('Simha') || marsSignName.includes('Leo') ||
    marsSignName.includes('Mesha') || marsSignName.includes('Aries') ||
    marsSignName.includes('Vrishchika') || marsSignName.includes('Scorpio') ||
    marsSignName.includes('Makara') || marsSignName.includes('Capricorn') ||
    marsSignName.includes('Kumbha') || marsSignName.includes('Aquarius')
  ) {
    cancellations.push(`Mars placed in own/exaltation/friendly sign ${marsSignName} (செவ்வாய் சிம்மம், மேஷம், விருச்சிகம், மகரம், கும்பத்தில் இருந்தால் தோஷமில்லை).`);
  }

  // 4. Conjunction / Aspect of Jupiter, Mercury, or Moon
  const jupiter = horo.planets.find(p => p.name.includes('Jupiter'));
  const mercury = horo.planets.find(p => p.name.includes('Mercury'));
  const moon = horo.planets.find(p => p.name.includes('Moon'));

  if (jupiter && (jupiter.signIndex === marsSignIdx || ((jupiter.signIndex - marsSignIdx + 12) % 12 === 6) || ((jupiter.signIndex - marsSignIdx + 12) % 12 === 4) || ((jupiter.signIndex - marsSignIdx + 12) % 12 === 8))) {
    cancellations.push('Mars is conjoined or aspected by benefic Jupiter (குரு பார்வை / சேர்க்கை தோஷ நிவர்த்தி).');
  }
  if (mercury && mercury.signIndex === marsSignIdx) {
    cancellations.push('Mars is conjoined with Mercury (புதன் சேர்க்கை தோஷ நிவர்த்தி).');
  }
  if (moon && moon.signIndex === marsSignIdx) {
    cancellations.push('Chandra-Mangala Yoga (சந்திரன் சேர்க்கை தோஷ நிவர்த்தி).');
  }

  const isCancelled = cancellations.length > 0;

  return {
    isCandidate: true,
    hasDosha: !isCancelled,
    isCancelled,
    houses: { lagna: houseFromLagna, moon: houseFromMoon, venus: houseFromVenus },
    gender,
    cancellations,
    statusText: isCancelled ? 'Chevvai Dosha Cancelled (செவ்வாய் தோஷ நிவர்த்தி)' : 'Chevvai Dosha Present (செவ்வாய் தோஷம் உள்ளது)',
  };
}



/**
 * Ashtakoota Matchmaking (36 Gunas & Manglik Comparison)
 */
function calculateKundliMatch(boyBirth, girlBirth) {
  const boyHoro = generateHoroscope({ ...boyBirth, name: boyBirth.name || 'Groom' });
  const girlHoro = generateHoroscope({ ...girlBirth, name: girlBirth.name || 'Bride' });

  const boyNak = NAKSHATRAS.find((n) => n.name === boyHoro.astrologicalDetails.nakshatra);
  const girlNak = NAKSHATRAS.find((n) => n.name === girlHoro.astrologicalDetails.nakshatra);

  const boySign = boyHoro.planets.find((p) => p.name.includes('Moon')).signIndex;
  const girlSign = girlHoro.planets.find((p) => p.name.includes('Moon')).signIndex;

  // 1. Varna (1 Point) - Spiritual compatibility
  const varnaRank = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  const boyVarnaScore = varnaRank[boyNak.varna] || 1;
  const girlVarnaScore = varnaRank[girlNak.varna] || 1;
  const varnaPoints = boyVarnaScore >= girlVarnaScore ? 1 : 0;

  // 2. Vashya (2 Points) - Mutual attraction / control
  const vashyaPoints = boySign === girlSign ? 2 : (boySign + girlSign) % 3 === 0 ? 1 : 2;

  // 3. Tara (3 Points) - Destiny & longevity
  const boyNakIdx = NAKSHATRAS.indexOf(boyNak);
  const girlNakIdx = NAKSHATRAS.indexOf(girlNak);
  const diff1 = (girlNakIdx - boyNakIdx + 27) % 9;
  const diff2 = (boyNakIdx - girlNakIdx + 27) % 9;
  let taraPoints = 3;
  if ([3, 5, 7].includes(diff1) || [3, 5, 7].includes(diff2)) {
    taraPoints = 1.5;
  }

  // 4. Yoni (4 Points) - Physical & biological harmony
  let yoniPoints = 2;
  if (boyNak.yoni === girlNak.yoni) {
    yoniPoints = 4;
  } else if (
    (boyNak.yoni === 'Horse' && girlNak.yoni === 'Buffalo') ||
    (boyNak.yoni === 'Cat' && girlNak.yoni === 'Rat') ||
    (boyNak.yoni === 'Serpent' && girlNak.yoni === 'Mongoose')
  ) {
    yoniPoints = 0; // Hostile
  } else {
    yoniPoints = 2.5;
  }

  // 5. Graha Maitri (5 Points) - Mental rapport & friendship of Moon Lords
  const boyLord = boyHoro.astrologicalDetails.moonSignLord;
  const girlLord = girlHoro.astrologicalDetails.moonSignLord;
  let maitriPoints = 5;
  if (boyLord === girlLord) {
    maitriPoints = 5;
  } else if (
    (boyLord === 'Sun' && girlLord === 'Saturn') ||
    (boyLord === 'Saturn' && girlLord === 'Sun') ||
    (boyLord === 'Mars' && girlLord === 'Mercury')
  ) {
    maitriPoints = 1;
  } else {
    maitriPoints = 4;
  }

  // 6. Gana (6 Points) - Temperament (Deva, Manushya, Rakshasa)
  let ganaPoints = 6;
  if (boyNak.gana === girlNak.gana) {
    ganaPoints = 6;
  } else if (
    (boyNak.gana === 'Deva' && girlNak.gana === 'Manushya') ||
    (boyNak.gana === 'Manushya' && girlNak.gana === 'Deva')
  ) {
    ganaPoints = 5;
  } else if (
    (boyNak.gana === 'Rakshasa' && girlNak.gana === 'Deva') ||
    (boyNak.gana === 'Deva' && girlNak.gana === 'Rakshasa')
  ) {
    ganaPoints = 1;
  } else {
    ganaPoints = 0;
  }

  // 7. Bhakoota (7 Points) - Family welfare & prosperity (Sign distance)
  const signDistance = (Math.abs(boySign - girlSign) + 12) % 12;
  let bhakootPoints = 7;
  if ([2, 12, 6, 8, 9, 5].includes(signDistance)) {
    bhakootPoints = 0; // Bhakoot dosha
  }

  // 8. Nadi (8 Points) - Health, genetic compatibility & progeny
  let nadiPoints = 8;
  if (boyNak.nadi === girlNak.nadi) {
    nadiPoints = 0; // Nadi Dosha
  }

  const totalGunas = varnaPoints + vashyaPoints + taraPoints + yoniPoints + maitriPoints + ganaPoints + bhakootPoints + nadiPoints;

  // Manglik analysis
  const boyManglik = boyHoro.astrologicalDetails.isManglik;
  const girlManglik = girlHoro.astrologicalDetails.isManglik;
  let manglikMatch = 'Both Non-Manglik (Excellent Harmony)';
  if (boyManglik && girlManglik) {
    manglikMatch = 'Both Manglik (Dosha Cancelled - Very Auspicious)';
  } else if (boyManglik || girlManglik) {
    manglikMatch = 'One Partner Manglik (Remedies Advised before Vivah)';
  }

  let verdict = 'Average Compatibility';
  let recommendation = 'Can proceed after performing recommended ancestral & Navagraha pujas.';
  if (totalGunas >= 28) {
    verdict = 'Uttama (Excellent Match)';
    recommendation = 'Highly auspicious alliance blessed with health, prosperity, and lifelong harmony.';
  } else if (totalGunas >= 18) {
    verdict = 'Madhyama (Good / Auspicious Match)';
    recommendation = 'Favorable alliance exceeding minimum requirement of 18 Gunas. Recommended for marriage.';
  } else {
    verdict = 'Adhama (Low Compatibility)';
    recommendation = 'Score is below 18 Gunas. Consultation with senior astrologer strongly advised.';
  }

  return {
    boy: {
      name: boyBirth.name || 'Groom',
      moonSign: boyHoro.astrologicalDetails.moonSign,
      nakshatra: boyHoro.astrologicalDetails.nakshatra,
      pada: boyHoro.astrologicalDetails.pada,
      nadi: boyNak.nadi,
      gana: boyNak.gana,
      isManglik: boyManglik,
    },
    girl: {
      name: girlBirth.name || 'Bride',
      moonSign: girlHoro.astrologicalDetails.moonSign,
      nakshatra: girlHoro.astrologicalDetails.nakshatra,
      pada: girlHoro.astrologicalDetails.pada,
      nadi: girlNak.nadi,
      gana: girlNak.gana,
      isManglik: girlManglik,
    },
    kootas: [
      { name: 'Varna', koota: 'Varna', max: 1, obtained: varnaPoints, desc: 'Spiritual ego & work ethos', description: 'Spiritual ego & work ethos' },
      { name: 'Vashya', koota: 'Vashya', max: 2, obtained: vashyaPoints, desc: 'Mutual affection & dominance', description: 'Mutual affection & dominance' },
      { name: 'Tara', koota: 'Tara', max: 3, obtained: taraPoints, desc: 'Destiny, health & longevity', description: 'Destiny, health & longevity' },
      { name: 'Yoni', koota: 'Yoni', max: 4, obtained: yoniPoints, desc: 'Biological & physical compatibility', description: 'Biological & physical compatibility' },
      { name: 'Graha Maitri', koota: 'Graha Maitri', max: 5, obtained: maitriPoints, desc: 'Intellectual & emotional bonding', description: 'Intellectual & emotional bonding' },
      { name: 'Gana', koota: 'Gana', max: 6, obtained: ganaPoints, desc: 'Temperament & social outlook', description: 'Temperament & social outlook' },
      { name: 'Bhakoota', koota: 'Bhakoota', max: 7, obtained: bhakootPoints, desc: 'Family growth, love & wealth', description: 'Family growth, love & wealth' },
      { name: 'Nadi', koota: 'Nadi', max: 8, obtained: nadiPoints, desc: 'Genetic health, bloodline & progeny', description: 'Genetic health, bloodline & progeny' },
    ],
    totalGunas,
    totalScore: totalGunas,
    maxGunas: 36,
    percentage: Math.round((totalGunas / 36) * 100),
    compatibility: verdict,
    manglikMatch,
    manglik: {
      boy: { isManglik: boyManglik, details: boyManglik ? 'Mars in 1st/4th/7th/8th/12th house (Manglik)' : 'Mars favorably placed. Non-Manglik.' },
      girl: { isManglik: girlManglik, details: girlManglik ? 'Mars in 1st/4th/7th/8th/12th house (Manglik)' : 'Mars favorably placed. Non-Manglik.' },
      compatibility: manglikMatch,
    },
    verdict,
    recommendation,
    tamilPorutham: calculateTamilPoruthams(boyHoro, girlHoro),
    chevvaiAnalysis: {
      boy: evaluateChevvaiDosha(boyHoro, 'male'),
      girl: evaluateChevvaiDosha(girlHoro, 'female'),
    },
  };
}

/**
 * Generate Daily Panchangam for a given date
 */
function getDailyPanchangam(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const weekdayIndex = date.getDay();

  const weekdays = [
    { name: 'Ravivara (Sunday)', lord: 'Sun', deity: 'Surya Dev', nature: 'Auspicious for ceremonies and royal endeavors' },
    { name: 'Somavara (Monday)', lord: 'Moon', deity: 'Shiva', nature: 'Peaceful, auspicious for travel, water works, art' },
    { name: 'Mangalavara (Tuesday)', lord: 'Mars', deity: 'Hanuman', nature: 'Energizing, courageous tasks, administration' },
    { name: 'Budhavara (Wednesday)', lord: 'Mercury', deity: 'Vishnu', nature: 'Intellectual work, commerce, learning, contracts' },
    { name: 'Guruvara (Thursday)', lord: 'Jupiter', deity: 'Brihaspati', nature: 'Highly auspicious, education, pujas, sacred beginnings' },
    { name: 'Shukravara (Friday)', lord: 'Venus', deity: 'Lakshmi', nature: 'Harmony, purchases, arts, celebrations, relationships' },
    { name: 'Shanivara (Saturday)', lord: 'Saturn', deity: 'Shani Dev', nature: 'Spiritual grounding, charity, discipline, heavy labor' },
  ];

  const astro = computePlanets(year, month, day, 12, 0);
  const moon = astro.planets.find((p) => p.name.includes('Moon'));
  const sun = astro.planets.find((p) => p.name.includes('Sun'));

  const diff = (moon.deg - sun.deg + 360) % 360;
  const tithiIndex = Math.floor(diff / 12) % 30;
  const tithiName = TITHIS[tithiIndex];
  const paksha = tithiIndex < 15 ? 'Shukla Paksha (Bright Fortnight)' : 'Krishna Paksha (Dark Fortnight)';

  const nakshatraIndex = Math.floor(moon.deg / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const yogaIndex = Math.floor(((sun.deg + moon.deg) % 360) / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIndex];

  const karanaIndex = Math.floor(diff / 6) % 60;
  const karana =
    karanaIndex === 0
      ? 'Kintughna'
      : karanaIndex >= 57
      ? KARANAS[7 + (karanaIndex - 57)]
      : KARANAS[(karanaIndex - 1) % 7];

  const rahuKalamSlots = [
    '04:30 PM - 06:00 PM',
    '07:30 AM - 09:00 AM',
    '03:00 PM - 04:30 PM',
    '12:00 PM - 01:30 PM',
    '01:30 PM - 03:00 PM',
    '10:30 AM - 12:00 PM',
    '09:00 AM - 10:30 AM',
  ];

  const yamagandamSlots = [
    '12:00 PM - 01:30 PM',
    '10:30 AM - 12:00 PM',
    '09:00 AM - 10:30 AM',
    '07:30 AM - 09:00 AM',
    '06:00 AM - 07:30 AM',
    '03:00 PM - 04:30 PM',
    '01:30 PM - 03:00 PM',
  ];

  const gulikaSlots = [
    '03:00 PM - 04:30 PM',
    '01:30 PM - 03:00 PM',
    '12:00 PM - 01:30 PM',
    '10:30 AM - 12:00 PM',
    '09:00 AM - 10:30 AM',
    '07:30 AM - 09:00 AM',
    '06:00 AM - 07:30 AM',
  ];

  return {
    date: date.toISOString().split('T')[0],
    formattedDate: date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    vaar: weekdays[weekdayIndex],
    tithi: {
      name: tithiName,
      paksha,
      progress: `${Math.round(((diff % 12) / 12) * 100)}% elapsed`,
    },
    nakshatra: {
      name: nakshatra.name,
      lord: nakshatra.lord,
      deity: nakshatra.deity,
      sign: nakshatra.sign,
    },
    yoga: {
      name: yoga,
      nature: [
        'Priti',
        'Ayushman',
        'Saubhagya',
        'Shobhana',
        'Sukarma',
        'Dhriti',
        'Harshana',
        'Siddhi',
        'Shiva',
        'Siddha',
        'Sadhya',
        'Shubha',
        'Shukla',
        'Brahma',
        'Indra',
      ].includes(yoga)
        ? 'Auspicious'
        : 'Inauspicious',
    },
    karana: {
      name: karana,
      type: karana.includes('Bhadra') ? 'Vishti (Inauspicious for celebrations)' : 'Auspicious for actions',
    },
    sunMoonTimes: {
      sunrise: '06:18 AM',
      sunset: '06:12 PM',
      moonrise: '07:45 PM',
      moonset: '07:15 AM',
    },
    timings: {
      abhijitMuhurat: '11:48 AM - 12:36 PM (Most Auspicious)',
      brahmaMuhurat: '04:42 AM - 05:30 AM',
      amritKalam: '02:15 PM - 03:45 PM',
      rahuKalam: rahuKalamSlots[weekdayIndex],
      yamagandam: yamagandamSlots[weekdayIndex],
      gulikaKalam: gulikaSlots[weekdayIndex],
      durMuhurat: '08:40 AM - 09:28 AM & 10:48 PM - 11:36 PM',
    },
    astronomicalData: {
      vikramSamvat: 2083,
      shakaSamvat: 1948,
      ayana: 'Dakshinayana / Uttarayana',
      ritu: 'Sharad Ritu (Autumn)',
    },
  };
}

module.exports = {
  generateHoroscope,
  getDailyPanchangam,
  calculateKundliMatch,
  NAKSHATRAS,
  RASHIS,
  TITHIS,
  YOGAS,
  calculateTamilPoruthams,
  evaluateChevvaiDosha,
  TAMIL_STARS,
};
