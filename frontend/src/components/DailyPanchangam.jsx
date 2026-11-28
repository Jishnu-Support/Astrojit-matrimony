import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sun, Moon, ShieldAlert, Award, ChevronLeft, ChevronRight, Sparkles, MessageCircle, MapPin, Search, X } from 'lucide-react';
import { useLang } from '../i18n';
import { API } from '../api';
import { GEO_DATA, parseCoordinateToDec } from '../data/geoCoordinates';
import CelestialDayBackdrop from './CelestialDayBackdrop';
import AlertsSubscriptionModal from './AlertsSubscriptionModal';

// Localization lookup dictionaries
const VAARA_NAMES = {
  ta: ['ஞாயிற்றுக்கிழமை', 'திங்கட்கிழமை', 'செவ்வாய்க்கிழமை', 'புதன்கிழமை', 'வியாழக்கிழமை', 'வெள்ளிக்கிழமை', 'சனிக்கிழமை'],
  kn: ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  te: ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'],
  bn: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
};

const VAARA_NATURES = {
  ta: [
    'சுப காரியங்கள், மங்கல சடங்குகள் செய்ய உகந்த நாள்',
    'அமைதியான நாள், பயணம் மற்றும் கலைப் பணிகளுக்கு உகந்தது',
    'துணிச்சலான செயல்கள், நிர்வாகப் பணிகளுக்கு உகந்தது',
    'கல்வி, வணிகம், ஒப்பந்தங்கள் மற்றும் அறிவுசார் பணிகளுக்கு உகந்தது',
    'மிகவும் மங்கலகரமான நாள், ஆன்மீகம், கல்விக்கு நன்று',
    'சுப நிகழ்வுகள், மங்கலப் பொருட்கள் வாங்க உகந்தது',
    'ஆன்மீகம், தான தர்மங்கள், ஒழுக்க நெறி பணிகளுக்கு நன்று'
  ],
  kn: [
    'ಶುಭ ಕಾರ್ಯಗಳು ಮತ್ತು ಆಡಳಿತಾತ್ಮಕ ಕೆಲಸಗಳಿಗೆ ಶ್ರೇಷ್ಠ',
    'ಶಾಂತಿಯುತ ದಿನ, ಪ್ರಯಾಣ ಹಾಗೂ ಕಲಾತ್ಮಕ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತ',
    'ಧೈರ್ಯ ಸಾಹಸದ ಕೆಲಸಗಳು ಮತ್ತು ಆಡಳಿತಕ್ಕೆ ಪ್ರಶಸ್ತ',
    'ಶಿಕ್ಷಣ, ವ್ಯಾಪಾರ, ಒಪ್ಪಂದಗಳು ಮತ್ತು ಜ್ಞಾನಾರ್ಜನೆಗೆ ಉತ್ತಮ',
    'ಅತ್ಯಂತ ಶುಭಕರ, ಪೂಜೆ, ದೇವತಾರಾಧನೆ ಮತ್ತು ನೂತನ ಆರಂಭಗಳಿಗೆ ಶ್ರೇಷ್ಠ',
    'ಸಂತೋಷದ ದಿನ, ಕಲೆ, ಆಭರಣ ಖರೀದಿ ಮತ್ತು ಮಂಗಲ ಕಾರ್ಯಗಳಿಗೆ ಸೂಕ್ತ',
    'ಆಧ್ಯಾತ್ಮ, ದಾನ-ಧರ್ಮ, ಶಿಸ್ತು ಮತ್ತು ಸೇವಾ ಕಾರ್ಯಗಳಿಗೆ ಉತ್ತಮ'
  ],
  hi: [
    'शुभ कार्यों और राजकीय कार्यों के लिए उत्तम दिन',
    'शांत एवं यात्रा, कला और रचनात्मक कार्यों हेतु अनुकूल',
    'साहसिक कार्य, ऊर्जावान एवं प्रशासनिक गतिविधियों के लिए श्रेष्ठ',
    'शिक्षा, व्यापार, अनुबंध एवं बौद्धिक कार्यों के लिए उत्तम',
    'अत्यंत शुभ, धार्मिक अनुष्ठान, विद्या एवं नए कार्यों की शुरुआत हेतु श्रेष्ठ',
    'सौंदर्य, खरीदारी, कला, उत्सव एवं पारिवारिक सुख हेतु शुभ',
    'अध्यात्म, दान, अनुशासन एवं सेवा कार्यों के लिए उत्तम'
  ]
};

const PLANET_NAMES = {
  ta: { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'இராகு', Ketu: 'கேது' },
  kn: { Sun: 'ಸೂರ್ಯ', Moon: 'ಚಂದ್ರ', Mars: 'ಮಂಗಳ', Mercury: 'ಬುಧ', Jupiter: 'ಗುರು', Venus: 'ಶುಕ್ರ', Saturn: 'ಶನಿ', Rahu: 'ರಾಹು', Ketu: 'ಕೇತು' },
  hi: { Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु' },
  te: { Sun: 'సూర్యుడు', Moon: 'చంద్రుడు', Mars: 'కుజుడు', Mercury: 'బుధుడు', Jupiter: 'గురు', Venus: 'శుక్రుడు', Saturn: 'శని', Rahu: 'రాహువు', Ketu: 'కేతువు' },
  bn: { Sun: 'সূর্য', Moon: 'চন্দ্র', Mars: 'মঙ্গল', Mercury: 'বুধ', Jupiter: 'বৃহস্পতি', Venus: 'শুক্র', Saturn: 'শনি', Rahu: 'রাহু', Ketu: 'কেতু' }
};

const DEITY_NAMES = {
  ta: {
    Indra: 'இந்திரன்', 'Surya Dev': 'சூரிய பகவான்', Shiva: 'சிவபெருமான்', Vishnu: 'மகாவிஷ்ணு',
    Hanuman: 'அனுமன்', Brihaspati: 'பிரகஸ்பதி', Lakshmi: 'மகாலட்சுமி', 'Shani Dev': 'சனீஸ்வர பகவான்',
    Agni: 'அக்னி', Prajapati: 'பிரஜாபதி', Soma: 'சந்திர தேவன்', Rudra: 'ருத்ரன்',
    Aditi: 'அதிதி', Sarpa: 'நாக தேவதை', Pitris: 'பித்ருக்கள்', Bhaga: 'பகன்',
    Aryaman: 'அரியமான்', Savitar: 'சவிதா', Tvashtar: 'துவஷ்டா', Vayu: 'வாயு தேவன்',
    Indragni: 'இந்திராக்னி', Mitra: 'மித்ரன்', Nirriti: 'நிர்ருதி', Apas: 'வருண தேவன்',
    Vishvadevas: 'விஸ்வதேவர்கள்', Vasus: 'அஷ்ட வசுக்கள்', Varuna: 'வருணன்',
    'Aja Ekapada': 'அஜ ஏகபாதர்', Ahirbudhnya: 'அகிர்புத்னியர்', Pushan: 'பூஷா'
  },
  kn: {
    Indra: 'ಇಂದ್ರ', 'Surya Dev': 'ಸೂರ್ಯ ದೇವ', Shiva: 'ಶಿವ', Vishnu: 'ವಿಷ್ಣು',
    Hanuman: 'ಹನುಮಂತ', Brihaspati: 'ಬೃಹಸ್ಪತಿ', Lakshmi: 'ಲಕ್ಷ್ಮೀ', 'Shani Dev': 'ಶನಿ ದೇವ',
    Agni: 'ಅಗ್ನಿ', Prajapati: 'ಪ್ರಜಾಪತಿ', Soma: 'ಸೋಮ', Rudra: 'ರುದ್ರ'
  },
  hi: {
    Indra: 'इंद्र', 'Surya Dev': 'सूर्य देव', Shiva: 'शिव जी', Vishnu: 'विष्णु जी',
    Hanuman: 'हनुमान जी', Brihaspati: 'बृहस्पति', Lakshmi: 'महालक्ष्मी', 'Shani Dev': 'शनि देव',
    Agni: 'अग्नि देव', Prajapati: 'प्रजापति', Soma: 'चंद्र देव', Rudra: 'रुद्र'
  }
};

// Tithi meanings / significance (deity + nature of the day)
const TITHI_MEANING = {
  Prathama:    { deity: 'Agni',       meaning: 'New beginnings, auspicious for starting ventures' },
  Dwitiya:     { deity: 'Brahma',     meaning: 'Creative work, building foundations' },
  Tritiya:     { deity: 'Gauri',      meaning: 'Favourable for travel and new undertakings' },
  Chaturthi:   { deity: 'Ganesha',    meaning: 'Remove obstacles; good for rituals' },
  Panchami:    { deity: 'Naga',       meaning: 'Learning, education, medicine' },
  Shashthi:    { deity: 'Kartikeya',  meaning: 'Victory, valour, auspicious for contests' },
  Saptami:     { deity: 'Surya',      meaning: 'Energy, authority, good for travel' },
  Ashtami:     { deity: 'Shiva',      meaning: 'Mixed results; good for courage-based tasks' },
  Navami:      { deity: 'Durga',      meaning: 'Powerful energy; avoid new beginnings' },
  Dashami:     { deity: 'Vishnu',     meaning: 'Auspicious for religious acts and ceremonies' },
  Ekadashi:    { deity: 'Vishnu',     meaning: 'Fasting, devotion; highly auspicious' },
  Dwadashi:    { deity: 'Vishnu',     meaning: 'Charity, religious activity, end of fasting' },
  Trayodashi:  { deity: 'Kamadeva',   meaning: 'Love, relationships; good for celebrations' },
  Chaturdashi: { deity: 'Shiva/Kali', meaning: 'Powerful; best for tantric and spiritual work' },
  Purnima:     { deity: 'Chandra',    meaning: 'Full Moon — peak energy, highly auspicious' },
  Amavasya:    { deity: 'Pitrs',      meaning: 'New Moon — ancestor reverence, avoid ceremonies' },
};

// Localized Tithi meanings
const TITHI_MEANING_DICT = {
  ta: {
    Prathama:    'புதிய தொடக்கங்களுக்கு உகந்தது',
    Dwitiya:     'படைப்பு பணிகள், அடிப்படை அமைக்க சிறந்தது',
    Tritiya:     'பயணம் மற்றும் புதிய முயற்சிகளுக்கு சாதகம்',
    Chaturthi:   'தடைகளை நீக்க; சடங்குகளுக்கு நல்லது',
    Panchami:    'கல்வி, மருத்துவம், கற்றல் பணிகளுக்கு உகந்தது',
    Shashthi:    'வெற்றி, வீரம்; போட்டிகளுக்கு சாதகம்',
    Saptami:     'ஆற்றல், அதிகாரம்; பயணத்திற்கு நன்று',
    Ashtami:     'கலப்பு பலன்கள்; துணிச்சலான செயல்களுக்கு நல்லது',
    Navami:      'சக்திவாய்ந்த நாள்; புதிய தொடக்கங்களை தவிர்க்கவும்',
    Dashami:     'சடங்குகள் மற்றும் மத காரியங்களுக்கு சுபமானது',
    Ekadashi:    'விரதம், பக்தி; மிகவும் மங்கலகரமான நாள்',
    Dwadashi:    'தர்மம், மத செயல்கள்; விரத முடிவு',
    Trayodashi:  'காதல், உறவுகள்; கொண்டாட்டங்களுக்கு நல்லது',
    Chaturdashi: 'சக்திவாய்ந்த நாள்; ஆன்மீக பணிகளுக்கு சிறந்தது',
    Purnima:     'பௌர்ணமி — உச்ச சக்தி, மிகவும் மங்கலகரமானது',
    Amavasya:    'அமாவாசை — மூதாதையர் வழிபாடு; சடங்குகளை தவிர்க்கவும்',
  },
  hi: {
    Prathama:    'नई शुरुआत के लिए अनुकूल',
    Dwitiya:     'रचनात्मक कार्य, नींव रखने के लिए उत्तम',
    Tritiya:     'यात्रा और नए उद्यमों के लिए शुभ',
    Chaturthi:   'बाधा निवारण; धार्मिक कार्यों के लिए उत्तम',
    Panchami:    'शिक्षा, चिकित्सा, अध्ययन के लिए अनुकूल',
    Shashthi:    'विजय, पराक्रम; प्रतियोगिता के लिए शुभ',
    Saptami:     'ऊर्जा, अधिकार; यात्रा के लिए अनुकूल',
    Ashtami:     'मिश्रित फल; साहसिक कार्यों के लिए उत्तम',
    Navami:      'शक्तिशाली दिन; नई शुरुआत से बचें',
    Dashami:     'धार्मिक कार्यों और समारोहों के लिए शुभ',
    Ekadashi:    'व्रत, भक्ति; अत्यंत शुभ दिन',
    Dwadashi:    'दान-पुण्य, धार्मिक कार्य; व्रत समाप्ति',
    Trayodashi:  'प्रेम, संबंध; उत्सवों के लिए अनुकूल',
    Chaturdashi: 'शक्तिशाली; आध्यात्मिक कार्यों के लिए श्रेष्ठ',
    Purnima:     'पूर्णिमा — उच्च ऊर्जा, अत्यंत शुभ',
    Amavasya:    'अमावस्या — पितृ तर्पण; समारोह से बचें',
  },
};

const TITHI_DICT = {
  ta: {
    Pratipada: 'பிரதமை', Dwitiya: 'துவிதியை', Tritiya: 'திருதியை', Chaturthi: 'சதுர்த்தி',
    Panchami: 'பஞ்சமி', Shashti: 'சஷ்டி', Saptami: 'சப்தமி', Ashtami: 'அஷ்டமி',
    Navami: 'நவமி', Dashami: 'தசமி', Ekadashi: 'ஏகாதசி', Dvadashi: 'துவாதசி',
    Trayodashi: 'திரயோதசி', Chaturdashi: 'சதுர்த்தசி', Purnima: 'பௌர்ணமி', Amavasya: 'அமாவாசை'
  },
  kn: {
    Pratipada: 'ಪಾಡ್ಯ (ಪ್ರಥಮಾ)', Dwitiya: 'ಬಿದಿಗೆ (ದ್ವಿತೀಯಾ)', Tritiya: 'ತದಿಗೆ (ತೃತೀಯಾ)', Chaturthi: 'ಚೌತಿ (ಚತುರ್ಥಿ)',
    Panchami: 'ಪಂಚಮಿ', Shashti: 'ಷಷ್ಠಿ', Saptami: 'ಸಪ್ತಮಿ', Ashtami: 'ಅಷ್ಟಮಿ',
    Navami: 'ನವಮಿ', Dashami: 'ದಶಮಿ', Ekadashi: 'ಏಕಾದಶಿ', Dvadashi: 'ದ್ವಾದಶಿ',
    Trayodashi: 'ತ್ರಯೋದಶಿ', Chaturdashi: 'ಚತುರ್ದಶಿ', Purnima: 'ಹುಣ್ಣಿಮೆ (ಪೂರ್ಣಿಮಾ)', Amavasya: 'ಅಮಾವಾಸ್ಯೆ'
  },
  hi: {
    Pratipada: 'प्रतिपदा', Dwitiya: 'द्वितीया', Tritiya: 'तृतीया', Chaturthi: 'चतुर्थी',
    Panchami: 'पंचमी', Shashti: 'षष्ठी', Saptami: 'सप्तमी', Ashtami: 'अष्टमी',
    Navami: 'नवमी', Dashami: 'दशमी', Ekadashi: 'एकादशी', Dvadashi: 'द्वादशी',
    Trayodashi: 'त्रयोदशी', Chaturdashi: 'चतुर्दशी', Purnima: 'पूर्णिमा', Amavasya: 'अमावस्या'
  }
};

const NAKSHATRA_DICT = {
  ta: {
    Ashwini: 'அசுவினி', Bharani: 'பரணி', Krittika: 'கார்த்திகை', Rohini: 'ரோகிணி',
    Mrigashira: 'மிருகசீரிஷம்', Ardra: 'திருவாதிரை', Punarvasu: 'புனர்பூசம்', Pushya: 'பூசம்',
    Ashlesha: 'ஆயில்யம்', Magha: 'மகம்', 'Purva Phalguni': 'பூரம்', 'Uttara Phalguni': 'உத்திரம்',
    Hasta: 'அஸ்தம்', Chitra: 'சித்திரை', Swati: 'சுவாதி', Vishakha: 'விசாகம்',
    Anuradha: 'அனுஷம்', Jyeshtha: 'கேட்டை', Mula: 'மூலம்', 'Purva Ashadha': 'பூராடம்',
    'Uttara Ashadha': 'உத்திராடம்', Shravana: 'திருவோணம்', Dhanishta: 'அவிட்டம்',
    Shatabhisha: 'சதயம்', 'Purva Bhadrapada': 'பூரட்டாதி', 'Uttara Bhadrapada': 'உத்திரட்டாதி', Revati: 'ரேவதி'
  },
  kn: {
    Ashwini: 'ಅಶ್ವಿನಿ', Bharani: 'ಭರಣಿ', Krittika: 'ಕೃತ್ತಿಕಾ', Rohini: 'ರೋಹಿಣಿ',
    Mrigashira: 'ಮೃಗಶಿರ', Ardra: 'ಆರ್ದ್ರ', Punarvasu: 'ಪುನರ್ವಸು', Pushya: 'ಪುಷ್ಯ',
    Ashlesha: 'ಆಶ್ಲೇಷ', Magha: 'ಮಘ', 'Purva Phalguni': 'ಪುಬ್ಬಾ (ಪೂರ್ವ ಫಲ್ಗುಣಿ)', 'Uttara Phalguni': 'ಉತ್ತರ ಫಲ್ಗುಣಿ',
    Hasta: 'ಹಸ್ತ', Chitra: 'ಚಿತ್ತಾ', Swati: 'ಸ್ವಾತಿ', Vishakha: 'ವಿಶಾಖಾ',
    Anuradha: 'ಅನುರಾಧಾ', Jyeshtha: 'ಜ್ಯೇಷ್ಠಾ', Mula: 'ಮೂಲ', 'Purva Ashadha': 'ಪೂರ್ವಾಷಾಢ',
    'Uttara Ashadha': 'ಉತ್ತರಾಷಾಢ', Shravana: 'ಶ್ರವಣ', Dhanishta: 'ಧನಿಷ್ಠಾ',
    Shatabhisha: 'ಶತಭಿಷ', 'Purva Bhadrapada': 'ಪೂರ್ವಭಾದ್ರಪದ', 'Uttara Bhadrapada': 'ಉತ್ತರಭಾದ್ರಪದ', Revati: 'ರೇವತಿ'
  },
  hi: {
    Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'रोहिणी',
    Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
    Ashlesha: 'आश्लेषा', Magha: 'मघा', 'Purva Phalguni': 'पूर्वाफाल्गुनी', 'Uttara Phalguni': 'उत्तराफाल्गुनी',
    Hasta: 'हस्त', Chitra: 'चित्रा', Swati: 'स्वाति', Vishakha: 'विशाखा',
    Anuradha: 'अनुराधा', Jyeshtha: 'ज्येष्ठा', Mula: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा',
    'Uttara Ashadha': 'उत्तराषाढ़ा', Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा',
    Shatabhisha: 'शतभिषा', 'Purva Bhadrapada': 'पूर्वभाद्रपद', 'Uttara Bhadrapada': 'उत्तरभाद्रपद', Revati: 'रेवती'
  }
};

const YOGA_DICT = {
  ta: {
    Vishkambha: 'விஸ்கம்பம்', Priti: 'ப்ரீதி', Ayushman: 'ஆயுஷ்மான்', Saubhagya: 'சௌபாக்கியம்',
    Shobhana: 'சோபனம்', Atiganda: 'அதிகண்டம்', Sukarma: 'சுகர்மம்', Dhriti: 'திருதி',
    Shula: 'சூலம்', Ganda: 'கண்டம்', Vriddhi: 'விருத்தி', Dhruva: 'துருவம்',
    Vyaghata: 'வியாகாதம்', Harshana: 'ஹர்ஷணம்', Vajra: 'வஜ்ரம்', Siddhi: 'சித்தி',
    Vyatipata: 'வியதிபாதம்', Variyan: 'வரியான்', Parigha: 'பரிகம்', Shiva: 'சிவம்',
    Siddha: 'சித்தம்', Sadhya: 'சாத்தியம்', Shubha: 'சுபம்', Shukla: 'சுக்லம்',
    Brahma: 'பிரம்மம்', Indra: 'இந்திரன்', Vaidhriti: 'வைதிருதி'
  },
  kn: {
    Vishkambha: 'ವಿಷ್ಕಂಭ', Priti: 'ಪ್ರೀತಿ', Ayushman: 'ಆಯುಷ್ಮಾನ್', Saubhagya: 'ಸೌಭಾಗ್ಯ',
    Shobhana: 'ಶೋಭನ', Atiganda: 'ಅತಿಗಂಡ', Sukarma: 'ಸುಕರ್ಮ', Dhriti: 'ಧೃತಿ',
    Shula: 'ಶೂಲ', Ganda: 'ಗಂಡ', Vriddhi: 'ವೃದ್ಧಿ', Dhruva: 'ಧ್ರುವ',
    Vyaghata: 'ವ್ಯಾಘಾತ', Harshana: 'ಹರ್ಷಣ', Vajra: 'ವಜ್ರ', Siddhi: 'ಸಿದ್ಧಿ',
    Vyatipata: 'ವ್ಯತೀಪಾತ', Variyan: 'ವರೀಯಾನ್', Parigha: 'ಪರಿಘ', Shiva: 'ಶಿವ',
    Siddha: 'ಸಿದ್ಧ', Sadhya: 'ಸಾಧ್ಯ', Shubha: 'ಶುಭ', Shukla: 'ಶುಕ್ಲ',
    Brahma: 'ಬ್ರಹ್ಮ', Indra: 'ಐಂದ್ರ', Vaidhriti: 'ವೈಧೃತಿ'
  },
  hi: {
    Vishkambha: 'विष्कम्भ', Priti: 'प्रीति', Ayushman: 'आयुष्मान', Saubhagya: 'सौभाग्य',
    Shobhana: 'शोभन', Atiganda: 'अतिगंड', Sukarma: 'सुकर्मा', Dhriti: 'धृति',
    Shula: 'शूल', Ganda: 'गंड', Vriddhi: 'वृद्धि', Dhruva: 'ध्रुव',
    Vyaghata: 'व्याघात', Harshana: 'हर्षण', Vajra: 'वज्र', Siddhi: 'सिद्धि',
    Vyatipata: 'व्यतीपात', Variyan: 'वरीयान', Parigha: 'परिघ', Shiva: 'शिव',
    Siddha: 'सिद्ध', Sadhya: 'साध्य', Shubha: 'शुभ', Shukla: 'शुक्ल',
    Brahma: 'ब्रह्म', Indra: 'ऐन्द्र', Vaidhriti: 'वैधृति'
  }
};

const KARANA_DICT = {
  ta: {
    Bava: 'பவம்', Balava: 'பாலவம்', Kaulava: 'கௌலவம்', Taitila: 'தைதுலை',
    Gara: 'கரசை', Vanija: 'வனசை', Vishti: 'பத்திரை (விஷ்டி)', Shakuni: 'சகுனி',
    Chatushpada: 'சதுஷ்பாதம்', Naga: 'நாகவம்', Kintughna: 'கிம்துக்கினம்'
  },
  kn: {
    Bava: 'ಬವ', Balava: 'ಬಾಲವ', Kaulava: 'ಕೌಲವ', Taitila: 'ತೈತಿಲ',
    Gara: 'ಗರಜ', Vanija: 'ವಣಿಜ', Vishti: 'ವಿಷ್ಟಿ (ಭದ್ರಾ)', Shakuni: 'ಶಕುನಿ',
    Chatushpada: 'ಚತುಷ್ಪಾದ', Naga: 'ನಾಗವಂತ', Kintughna: 'ಕಿಂಸ್ತುಘ್ನ'
  },
  hi: {
    Bava: 'बव', Balava: 'बालव', Kaulava: 'कौलव', Taitila: 'तैतिल',
    Gara: 'गर', Vanija: 'वणिज', Vishti: 'विष्टि (भद्रा)', Shakuni: 'शकुनि',
    Chatushpada: 'चतुष्पाद', Naga: 'नाग', Kintughna: 'किंस्तुघ्न'
  }
};

const AYANA_DICT = {
  ta: { Dakshinayana: 'தட்சிணாயனம்', Uttarayana: 'உத்தராயணம்' },
  kn: { Dakshinayana: 'ದಕ್ಷಿಣಾಯಣ', Uttarayana: 'ಉತ್ತರಾಯಣ' },
  hi: { Dakshinayana: 'दक्षिणायन', Uttarayana: 'उत्तरायण' }
};

const RITU_DICT = {
  ta: {
    'Sharad (Autumn)': 'சரத் (இலையுதிர் காலம்)',
    'Hemant (Pre-winter)': 'ஹேமந்தம் (முன்பனிக் காலம்)',
    'Shishir (Winter)': 'சிசிரம் (பின்பனிக் காலம்)',
    'Vasant (Spring)': 'வசந்தம் (இளவேனிற்காலம்)',
    'Grishma (Summer)': 'கிரீஷ்மம் (முதுவேனிற்காலம்)',
    'Varsha (Monsoon)': 'வர்ஷம் (மழைக்காலம்)'
  },
  kn: {
    'Sharad (Autumn)': 'ಶರದ್ ಋತು',
    'Hemant (Pre-winter)': 'ಹೇಮಂತ ಋತು',
    'Shishir (Winter)': 'ಶಿಶಿರ ಋತು',
    'Vasant (Spring)': 'ವಸಂತ ಋತು',
    'Grishma (Summer)': 'ಗ್ರೀಷ್ಮ ಋತು',
    'Varsha (Monsoon)': 'ವರ್ಷಾ ಋತು'
  },
  hi: {
    'Sharad (Autumn)': 'शरद ऋतु',
    'Hemant (Pre-winter)': 'हेमंत ऋतु',
    'Shishir (Winter)': 'शिशिर ऋतु',
    'Vasant (Spring)': 'वसन्त ऋतु',
    'Grishma (Summer)': 'ग्रीष्म ऋतु',
    'Varsha (Monsoon)': 'वर्षा ऋतु'
  }
};

const DEFAULT_LOCATION = {
  name: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India',
  lat: 13.0827,
  lon: 80.2707,
  utcOffset: 5.5,
};

const QUICK_CITIES = [
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707, utcOffset: 5.5 },
  { name: 'Salem', state: 'Tamil Nadu', country: 'India', lat: 11.6643, lon: 78.1460, utcOffset: 5.5 },
  { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', lat: 11.0168, lon: 76.9558, utcOffset: 5.5 },
  { name: 'Madurai', state: 'Tamil Nadu', country: 'India', lat: 9.9252, lon: 78.1198, utcOffset: 5.5 },
  { name: 'Hosur', state: 'Tamil Nadu', country: 'India', lat: 12.7409, lon: 77.8253, utcOffset: 5.5 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946, utcOffset: 5.5 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777, utcOffset: 5.5 },
  { name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090, utcOffset: 5.5 },
];

function getLocalIsoDate(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseTzOffset(tzStr) {
  if (typeof tzStr === 'number' && !Number.isNaN(tzStr)) return tzStr;
  const match = String(tzStr || '+05:30').match(/([+-]?)(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 5.5;
  const sign = match[1] === '-' ? -1 : 1;
  const h = parseInt(match[2], 10) || 0;
  const m = parseInt(match[3] || '0', 10) || 0;
  return sign * (h + m / 60);
}

function buildHorizonWavePath() {
  let d = 'M 38 112';
  for (let x = 38; x < 956; x += 26) {
    const mid = x + 13;
    const end = Math.min(962, x + 26);
    d += ` Q ${mid} 105, ${end} 112`;
  }
  return d;
}

const HORIZON_WAVE_PATH = buildHorizonWavePath();

function getMoonCycleMeta(rawIndex = 18, isTa = false) {
  const idx = Math.max(1, Math.min(30, Number(rawIndex) || 18));
  const phaseFrac = ((idx - 0.5) % 30) / 30;
  const illumPct = Math.round(((1 - Math.cos(phaseFrac * 2 * Math.PI)) / 2) * 100);
  const isWaxing = idx <= 15;

  let nameEn = 'Waning Gibbous';
  let nameTa = 'தேய்பிறை (பௌர்ணமி அடுத்து)';
  if (idx === 30) { nameEn = 'New Moon (Amavasya)'; nameTa = 'அமாவாசை'; }
  else if (idx === 15) { nameEn = 'Full Moon (Purnima)'; nameTa = 'பௌர்ணமி'; }
  else if (idx <= 6) { nameEn = 'Waxing Crescent'; nameTa = 'வளர்பிறை பிறைச்சந்திரன்'; }
  else if (idx <= 9) { nameEn = 'First Quarter'; nameTa = 'வளர்பிறை அஷ்டமி'; }
  else if (idx < 15) { nameEn = 'Waxing Gibbous'; nameTa = 'வளர்பிறை'; }
  else if (idx <= 21) { nameEn = 'Waning Gibbous'; nameTa = 'தேய்பிறை'; }
  else if (idx <= 24) { nameEn = 'Last Quarter'; nameTa = 'தேய்பிறை அஷ்டமி'; }
  else { nameEn = 'Waning Crescent'; nameTa = 'தேய்பிறை பிறைச்சந்திரன்'; }

  // SVG lit lunar disc path inside circle center=(18,18), radius=9
  const cosP = Math.cos(phaseFrac * 2 * Math.PI);
  const rx = Math.max(0.01, Math.abs(cosP) * 9);
  let litPath = '';
  if (idx === 30) {
    litPath = '';
  } else if (idx === 15) {
    litPath = 'M 18 9 A 9 9 0 1 1 18 27 A 9 9 0 1 1 18 9 Z';
  } else if (isWaxing) {
    const innerSweep = phaseFrac <= 0.25 ? 0 : 1;
    litPath = `M 18 9 A 9 9 0 0 1 18 27 A ${rx.toFixed(2)} 9 0 0 ${innerSweep} 18 9 Z`;
  } else {
    const innerSweep = phaseFrac <= 0.75 ? 1 : 0;
    litPath = `M 18 27 A 9 9 0 0 1 18 9 A ${rx.toFixed(2)} 9 0 0 ${innerSweep} 18 27 Z`;
  }

  return {
    illumPct,
    label: isTa ? `${nameTa} (${illumPct}%)` : `${nameEn} (${illumPct}%)`,
    litPath,
  };
}

export default function DailyPanchangam() {
  const { lang, t } = useLang();
  const [selectedDate, setSelectedDate] = useState(() => getLocalIsoDate());
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('astrojit_panchang_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });
  const [reckoning, setReckoning] = useState(() => {
    try {
      return localStorage.getItem('astrojit_panchang_reckoning') || 'thirukanitha';
    } catch {
      return 'thirukanitha';
    }
  });
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [nowClock, setNowClock] = useState(() => new Date());
  const [isBellRinging, setIsBellRinging] = useState(false);
  const bellAudioCtxRef = useRef(null);
  const bellSwingTimerRef = useRef(null);
  const cityPickerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNowClock(new Date()), 60000);
    return () => {
      clearInterval(timer);
      if (bellSwingTimerRef.current) clearTimeout(bellSwingTimerRef.current);
    };
  }, []);

  // Synthesize an authentic South Indian brass temple bell (Ghanta) sound cleanly via Web Audio API
  const playTempleBellSound = () => {
    setIsBellRinging(false);
    requestAnimationFrame(() => setIsBellRinging(true));
    if (bellSwingTimerRef.current) clearTimeout(bellSwingTimerRef.current);
    bellSwingTimerRef.current = setTimeout(() => setIsBellRinging(false), 1250);

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!bellAudioCtxRef.current || bellAudioCtxRef.current.state === 'closed') {
        bellAudioCtxRef.current = new AudioCtx();
      }
      const ctx = bellAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.45, now);
      masterGain.connect(ctx.destination);

      // Inharmonic brass bell partials (frequency, initial gain, decay duration in sec)
      const partials = [
        { freq: 528, gain: 0.55, decay: 2.6 },
        { freq: 1056, gain: 0.32, decay: 2.1 },
        { freq: 1492, gain: 0.24, decay: 1.7 },
        { freq: 2116, gain: 0.16, decay: 1.3 },
        { freq: 2820, gain: 0.10, decay: 0.85 },
      ];

      partials.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const partialGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        partialGain.gain.setValueAtTime(0.0001, now);
        partialGain.gain.exponentialRampToValueAtTime(gain, now + 0.008);
        partialGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(partialGain);
        partialGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + decay + 0.05);
      });
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (cityPickerRef.current && !cityPickerRef.current.contains(e.target)) {
        setShowCityPicker(false);
      }
    };
    if (showCityPicker) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showCityPicker]);

  useEffect(() => {
    async function fetchPanchang() {
      setLoading(true);
      try {
        const raw = await API.getPanchangam(selectedDate, {
          lat: location.lat,
          lon: location.lon,
          utcOffset: location.utcOffset,
          city: location.name,
          reckoning
        });
        const data = {
          ...raw,
          vaar: raw?.vaar || raw?.weekday || { name: 'Wednesday', lord: 'Mercury', nature: '' },
          sunMoonTimes: raw?.sunMoonTimes || { sunrise: '06:16 AM', sunset: '05:50 PM', moonrise: '01:30 PM', moonset: '01:15 AM', sunriseDec: 6.26, sunsetDec: 17.83 },
          timings: raw?.timings || {
            abhijitMuhurat: '11:45 AM - 12:35 PM',
            brahmaMuhurat: '04:45 AM - 05:35 AM',
            amritKalam: '08:30 AM - 10:00 AM',
            rahuKalam: raw?.rahuKalam || '12:00 PM - 01:30 PM',
            yamagandam: raw?.yamagandam || '07:30 AM - 09:00 AM',
            gulikaKalam: raw?.gulikaKalam || '10:30 AM - 12:00 PM'
          },
          astronomicalData: raw?.astronomicalData || {
            vikramSamvat: '2083',
            shakaSamvat: '1948',
            ayana: 'Dakshinayana',
            ritu: 'Sharad (Autumn)'
          }
        };
        setPanchang(data);
      } catch (err) {
        console.error('Failed to load panchangam:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPanchang();
  }, [selectedDate, location, reckoning]);

  const handleSelectCity = (cityObj) => {
    const nextLoc = {
      name: cityObj.name,
      state: cityObj.state || '',
      country: cityObj.country || 'India',
      lat: parseCoordinateToDec(cityObj.latDec ?? cityObj.lat, 13.0827),
      lon: parseCoordinateToDec(cityObj.lonDec ?? cityObj.lon, 80.2707),
      utcOffset: cityObj.utcOffset != null ? cityObj.utcOffset : parseTzOffset(cityObj.tz),
    };
    setLocation(nextLoc);
    try { localStorage.setItem('astrojit_panchang_location', JSON.stringify(nextLoc)); } catch {}
    setShowCityPicker(false);
    setCityQuery('');
  };

  const toggleReckoning = () => {
    const next = reckoning === 'thirukanitha' ? 'vakya' : 'thirukanitha';
    setReckoning(next);
    try { localStorage.setItem('astrojit_panchang_reckoning', next); } catch {}
  };

  const citySuggestions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return QUICK_CITIES;
    const matches = [];
    for (const [country, states] of Object.entries(GEO_DATA || {})) {
      for (const [stateName, cities] of Object.entries(states || {})) {
        for (const c of cities) {
          const nameLow = c.name.toLowerCase();
          if (nameLow.startsWith(q) || nameLow.includes(q)) {
            matches.push({ ...c, state: stateName, country });
            if (matches.length >= 24) return matches;
          }
        }
      }
    }
    return matches;
  }, [cityQuery]);

  const changeDateBy = (days) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const next = new Date(y, m - 1, d + days);
    setSelectedDate(getLocalIsoDate(next));
  };

  const setToday = () => {
    setSelectedDate(getLocalIsoDate());
  };

  // Localized date parts for Celestial Hero Card
  const heroDateInfo = useMemo(() => {
    const todayStr = getLocalIsoDate(nowClock);
    const tomorrowStr = getLocalIsoDate(new Date(nowClock.getFullYear(), nowClock.getMonth(), nowClock.getDate() + 1));
    const yesterdayStr = getLocalIsoDate(new Date(nowClock.getFullYear(), nowClock.getMonth(), nowClock.getDate() - 1));
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dObj = new Date(y, m - 1, d);
    const localeMap = { ta: 'ta-IN', kn: 'kn-IN', hi: 'hi-IN', te: 'te-IN', bn: 'bn-IN', en: 'en-GB' };
    const loc = localeMap[lang] || 'en-GB';

    const weekdayLabel = dObj.toLocaleDateString(loc, { weekday: 'long' });
    const weekdayEn = dObj.toLocaleDateString('en-US', { weekday: 'long' });
    const monthLabel = dObj.toLocaleDateString(loc, { month: 'long' });

    let relLabel = '';
    if (selectedDate === todayStr) {
      relLabel = lang === 'ta' ? 'இன்று' : lang === 'kn' ? 'ಇಂದು' : lang === 'hi' ? 'आज' : 'Today';
    } else if (selectedDate === tomorrowStr) {
      relLabel = lang === 'ta' ? 'நாளை' : lang === 'kn' ? 'ನಾಳೆ' : lang === 'hi' ? 'कल' : 'Tomorrow';
    } else if (selectedDate === yesterdayStr) {
      relLabel = lang === 'ta' ? 'நேற்று' : lang === 'kn' ? 'ನಿನ್ನೆ' : lang === 'hi' ? 'कल' : 'Yesterday';
    } else {
      relLabel = lang === 'ta' ? 'தேர்ந்தெடுத்த நாள்' : 'Selected Date';
    }

    return {
      isToday: selectedDate === todayStr,
      relLabel,
      weekdayLabel,
      weekdayEn,
      dayNum: d,
      monthLabel,
      yearNum: y,
    };
  }, [selectedDate, lang, nowClock]);

  // Live 3-phase Sky (Bright Day -> Evening Twilight -> Dark Night) & Solar/Lunar Arc along M 50 98 Q 500 -70 950 98
  const solarArcState = useMemo(() => {
    const sr = panchang?.sunMoonTimes?.sunriseDec ?? 6.26;
    const ss = panchang?.sunMoonTimes?.sunsetDec ?? 17.83;
    const cityMs = nowClock.getTime() + (location.utcOffset ?? 5.5) * 3600000;
    const cityDate = new Date(cityMs);
    const cityHours = cityDate.getUTCHours() + cityDate.getUTCMinutes() / 60;

    let tPos = 0.5;
    let isDaytime = true;
    let skyPhase = 'day'; // 'day' | 'evening' | 'night'

    if (heroDateInfo.isToday) {
      if (cityHours >= sr && cityHours <= ss) {
        isDaytime = true;
        tPos = Math.max(0.02, Math.min(0.98, (cityHours - sr) / Math.max(1, ss - sr)));
        if (cityHours >= ss - 1.25 || cityHours <= sr + 0.45) {
          skyPhase = 'evening';
        } else {
          skyPhase = 'day';
        }
      } else {
        isDaytime = false;
        const nightSpan = Math.max(1, (24 - ss) + sr);
        const elapsedNight = cityHours > ss ? (cityHours - ss) : ((24 - ss) + cityHours);
        tPos = Math.max(0.02, Math.min(0.98, elapsedNight / nightSpan));
        if ((cityHours > ss && cityHours <= ss + 0.75) || (cityHours < sr && cityHours >= sr - 0.5)) {
          skyPhase = 'evening';
        } else {
          skyPhase = 'night';
        }
      }
    }

    // Quadratic Bezier: P0=(50,98), P1=(500,-70), P2=(950,98)
    const oneMinus = 1 - tPos;
    const ySvg = oneMinus * oneMinus * 98 + 2 * oneMinus * tPos * (-70) + tPos * tPos * 98;
    const leftPct = 5 + 90 * tPos;
    const topPct = (ySvg / 120) * 100;
    const pctDone = Math.round(tPos * 100);

    return { leftPct, topPct, isDaytime, skyPhase, pctDone };
  }, [panchang, nowClock, location.utcOffset, heroDateInfo.isToday]);

  const moonCycle = useMemo(
    () => getMoonCycleMeta(panchang?.tithi?.rawIndex, lang === 'ta'),
    [panchang?.tithi?.rawIndex, lang]
  );

  // Helper translations for Panchang Angas
  const getVaaraDetails = () => {
    if (!panchang?.vaar) return { name: '', lord: '', nature: '' };
    if (lang === 'en') return panchang.vaar;
    const weekdayIdx = new Date(selectedDate + 'T12:00:00').getDay();
    const localizedName = VAARA_NAMES[lang]?.[weekdayIdx] || panchang.vaar.name;
    const localizedLord = PLANET_NAMES[lang]?.[panchang.vaar.lord] || panchang.vaar.lord;
    const localizedNature = VAARA_NATURES[lang]?.[weekdayIdx] || panchang.vaar.nature;
    return {
      name: localizedName,
      lord: localizedLord,
      nature: localizedNature
    };
  };

  const getTithiDetails = () => {
    if (!panchang?.tithi) return { name: '', paksha: '', progress: '', meaning: '', deity: '', number: '' };
    // Extract clean tithi name (without paksha suffix like "(Shukla)")
    const rawName = panchang.tithi.name || '';
    const cleanName = rawName.replace(/\s*\(.*\)/, '').trim(); // e.g. "Dwadashi"
    const tithiNumber = panchang.tithi.index || '';

    // Localized name
    const localizedName = (lang !== 'en' && TITHI_DICT[lang]?.[cleanName]) || cleanName;

    // Localized paksha
    const isShukla = (panchang.tithi.paksha || '').toLowerCase().includes('shukla');
    const localizedPaksha = lang === 'ta'
      ? (isShukla ? 'சுக்ல பட்சம் (வளர்பிறை)' : 'கிருஷ்ண பட்சம் (தேய்பிறை)')
      : lang === 'kn'
      ? (isShukla ? 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳದಿಂಗಳು)' : 'ಕೃಷ್ಣ ಪಕ್ಷ (ಕತ್ತಲ ತಿಂಗಳು)')
      : lang === 'hi'
      ? (isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष')
      : (panchang.tithi.paksha || '');

    // Meaning & deity
    const meaningObj = TITHI_MEANING[cleanName] || {};
    const localizedMeaning = TITHI_MEANING_DICT[lang]?.[cleanName] || meaningObj.meaning || '';
    const deity = meaningObj.deity || '';

    const progressStr = panchang.tithi.progress || '';
    const localizedProgress = lang === 'ta'
      ? progressStr.replace('elapsed', 'முடிந்தது')
      : lang === 'kn'
      ? progressStr.replace('elapsed', 'ಮುಗಿದಿದೆ')
      : lang === 'hi'
      ? progressStr.replace('elapsed', 'समाप्त')
      : progressStr;

    return {
      name: localizedName,
      paksha: localizedPaksha,
      progress: localizedProgress,
      meaning: localizedMeaning,
      deity,
      number: tithiNumber,
    };
  };

  const getNakshatraDetails = () => {
    if (!panchang?.nakshatra) return { name: '', lord: '', deity: '' };
    if (lang === 'en') return panchang.nakshatra;
    const cleanName = (panchang.nakshatra.name || '').trim();
    const localizedName = NAKSHATRA_DICT[lang]?.[cleanName] || cleanName;
    const localizedLord = PLANET_NAMES[lang]?.[panchang.nakshatra.lord] || panchang.nakshatra.lord;
    const localizedDeity = DEITY_NAMES[lang]?.[panchang.nakshatra.deity] || panchang.nakshatra.deity;
    return {
      name: localizedName,
      lord: localizedLord,
      deity: localizedDeity
    };
  };

  const getYogaDetails = () => {
    if (!panchang?.yoga) return { name: '', nature: '' };
    if (lang === 'en') return panchang.yoga;
    const cleanName = (panchang.yoga.name || '').trim();
    const localizedName = YOGA_DICT[lang]?.[cleanName] || cleanName;
    const isAuspicious = panchang.yoga.nature === 'Auspicious';
    const localizedNature = lang === 'ta'
      ? (isAuspicious ? 'சுபம்' : 'அசுபம்')
      : lang === 'kn'
      ? (isAuspicious ? 'ಶುಭ' : 'ಅಶುಭ')
      : lang === 'hi'
      ? (isAuspicious ? 'शुभ' : 'अशुभ')
      : panchang.yoga.nature;
    return {
      name: localizedName,
      nature: localizedNature,
      isAuspicious
    };
  };

  const getKaranaDetails = () => {
    if (!panchang?.karana) return { name: '', type: '' };
    if (lang === 'en') return panchang.karana;
    const cleanName = (panchang.karana.name || '').trim();
    const localizedName = KARANA_DICT[lang]?.[cleanName] || cleanName;
    const rawType = panchang.karana.type || '';
    let localizedType = rawType;
    if (lang === 'ta') {
      if (rawType.includes('Avoid')) localizedType = 'சுப காரியங்களைத் தவிர்க்கவும்';
      else if (rawType.includes('ceremonies')) localizedType = 'மங்கல நிகழ்வுகளுக்கு உகந்தது';
      else localizedType = 'சுப காரியங்களுக்கு உகந்தது';
    } else if (lang === 'kn') {
      if (rawType.includes('Avoid')) localizedType = 'ಶುಭ ಕಾರ್ಯಗಳನ್ನು ವರ್ಜಿಸಿ';
      else localizedType = 'ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಪ್ರಶಸ್ತ';
    } else if (lang === 'hi') {
      if (rawType.includes('Avoid')) localizedType = 'शुभ कार्य वर्जित हैं';
      else localizedType = 'शुभ कार्यों के लिए अनुकूल';
    }
    return {
      name: localizedName,
      type: localizedType
    };
  };

  const getAyanaName = (ayana) => {
    if (!ayana) return '';
    return AYANA_DICT[lang]?.[ayana] || ayana;
  };

  const getRituName = (ritu) => {
    if (!ritu) return '';
    return RITU_DICT[lang]?.[ritu] || ritu;
  };

  const vaarData = getVaaraDetails();
  const tithiData = getTithiDetails();
  const nakshatraData = getNakshatraDetails();
  const yogaData = getYogaDetails();
  const karanaData = getKaranaDetails();

  const lordLabel = lang === 'ta' ? 'அதிபதி:' : lang === 'kn' ? 'ಅಧಿಪತಿ:' : lang === 'hi' ? 'स्वामी:' : 'Lord:';
  const deityLabel = lang === 'ta' ? 'தெய்வம்:' : lang === 'kn' ? 'ದೇವತೆ:' : lang === 'hi' ? 'देवता:' : 'Deity:';

  const isBrightDay = solarArcState.skyPhase === 'day';
  const isEveningSky = solarArcState.skyPhase === 'evening';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Celestial Today / Bright Day, Evening Dusk & Dark Night Hero Card */}
      <style>{`
        @keyframes templeBellSwing {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(15deg); }
          32% { transform: rotate(-13deg); }
          50% { transform: rotate(9deg); }
          68% { transform: rotate(-6deg); }
          84% { transform: rotate(3deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-temple-bell-swing {
          animation: templeBellSwing 1.2s ease-in-out;
        }
      `}</style>
      <div
        className={`relative rounded-2xl border shadow-xl transition-colors duration-700 ${
          isBrightDay
            ? 'border-amber-300/90 bg-[#FDF3DC] text-slate-900'
            : isEveningSky
            ? 'border-amber-800/40 bg-gradient-to-b from-[#1E1B4B] via-[#4C2C59] to-[#9A4223] text-white'
            : 'border-indigo-950 bg-gradient-to-b from-[#020511] via-[#060C22] to-[#0D1533] text-white'
        }`}
      >
        {/* Dynamic Scenery Backdrop: Bespoke Panoramic Temple & Lotus Pond (Day) | Evening Dusk | Dark Night Stars & Temple */}
        {isBrightDay ? (
          <CelestialDayBackdrop sunLeftPct={solarArcState.leftPct} />
        ) : (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {isEveningSky ? (
            <>
              {/* Light-Dark Dusk Horizon Glow & Early Evening Stars */}
              <div
                className="absolute -bottom-10 w-80 h-44 rounded-full blur-3xl opacity-55"
                style={{
                  left: `${solarArcState.leftPct}%`,
                  transform: 'translateX(-50%)',
                  background: 'radial-gradient(circle, rgba(249,115,22,0.55) 0%, rgba(234,88,12,0.2) 55%, transparent 78%)'
                }}
              />
              <span className="absolute top-6 left-[34%] w-0.5 h-0.5 rounded-full bg-amber-100/65" />
              <span className="absolute top-12 left-[52%] w-1 h-1 rounded-full bg-amber-100/75" />
              <span className="absolute top-8 left-[69%] w-0.5 h-0.5 rounded-full bg-indigo-100/60" />
              <span className="absolute top-18 left-[79%] w-0.5 h-0.5 rounded-full bg-amber-100/55" />
              <svg viewBox="0 0 1000 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-full h-full opacity-65">
                <path d="M0 190 Q120 144 240 176 Q370 134 505 168 Q640 138 780 172 Q895 146 1000 178 L1000 220 L0 220 Z" fill="#2A1C3D" fillOpacity="0.6" />
                <path d="M0 198 Q170 162 320 188 Q490 158 640 186 Q820 162 1000 190 L1000 220 L0 220 Z" fill="#18122B" fillOpacity="0.82" />
                <g transform="translate(725, 118)" fill="#130D24">
                  <rect x="0" y="54" width="96" height="28" rx="1" />
                  <polygon points="10,54 86,54 80,43 16,43" />
                  <polygon points="16,43 80,43 74,33 22,33" />
                  <polygon points="22,33 74,33 67,24 29,24" />
                  <polygon points="29,24 67,24 60,16 36,16" />
                  <path d="M35 16 Q48 5 61 16 Z" />
                  <line x1="48" y1="8" x2="48" y2="1" stroke="#FBBF24" strokeOpacity="0.85" strokeWidth="1.7" />
                  <path d="M41 82 L41 64 Q48 57 55 64 L55 82 Z" fill="#F59E0B" fillOpacity="0.7" />
                  <rect x="-24" y="64" width="24" height="18" />
                  <rect x="96" y="66" width="20" height="16" />
                </g>
              </svg>
            </>
          ) : (
            <>
              {/* Dark Night Sky: Bright Twinkling Starfield & Quiet Midnight Temple Silhouette */}
              <div className="absolute inset-0">
                {[
                  { top: '9%', left: '22%', size: 'w-1 h-1', cls: 'bg-white/90' },
                  { top: '16%', left: '34%', size: 'w-0.5 h-0.5', cls: 'bg-indigo-200/80' },
                  { top: '8%', left: '46%', size: 'w-1 h-1', cls: 'bg-amber-100/85' },
                  { top: '22%', left: '53%', size: 'w-0.5 h-0.5', cls: 'bg-white/75' },
                  { top: '12%', left: '61%', size: 'w-1 h-1', cls: 'bg-indigo-100/85' },
                  { top: '29%', left: '41%', size: 'w-0.5 h-0.5', cls: 'bg-amber-100/70' },
                  { top: '19%', left: '72%', size: 'w-1 h-1', cls: 'bg-white/80' },
                  { top: '10%', left: '82%', size: 'w-0.5 h-0.5', cls: 'bg-indigo-200/75' },
                  { top: '37%', left: '19%', size: 'w-0.5 h-0.5', cls: 'bg-white/65' },
                  { top: '42%', left: '58%', size: 'w-1 h-1', cls: 'bg-amber-100/75' },
                  { top: '34%', left: '88%', size: 'w-0.5 h-0.5', cls: 'bg-white/75' },
                  { top: '47%', left: '31%', size: 'w-0.5 h-0.5', cls: 'bg-indigo-100/65' },
                  { top: '51%', left: '77%', size: 'w-0.5 h-0.5', cls: 'bg-amber-100/65' },
                  { top: '26%', left: '9%', size: 'w-0.5 h-0.5', cls: 'bg-white/65' },
                  { top: '14%', left: '14%', size: 'w-1 h-1', cls: 'bg-indigo-100/70' },
                  { top: '40%', left: '48%', size: 'w-0.5 h-0.5', cls: 'bg-white/65' },
                ].map((s, idx) => (
                  <span
                    key={idx}
                    className={`absolute rounded-full ${s.size} ${s.cls} animate-pulse`}
                    style={{ top: s.top, left: s.left, animationDelay: `${(idx % 5) * 0.4}s` }}
                  />
                ))}
              </div>
              <svg viewBox="0 0 1000 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-full h-full opacity-55">
                <path d="M0 194 Q170 162 320 188 Q490 158 640 186 Q820 162 1000 190 L1000 220 L0 220 Z" fill="#040814" />
                <g transform="translate(730, 128)" fill="#030610">
                  <rect x="0" y="50" width="90" height="24" />
                  <polygon points="10,50 80,50 74,40 16,40" />
                  <polygon points="16,40 74,40 68,30 22,30" />
                  <polygon points="22,30 68,30 61,20 29,20" />
                  <path d="M33 20 Q45 9 57 20 Z" />
                  <line x1="45" y1="11" x2="45" y2="5" stroke="#93C5FD" strokeOpacity="0.45" strokeWidth="1.4" />
                </g>
              </svg>
            </>
          )}
        </div>
        )}

        {/* Hanging Golden Temple Bell — Only rings with sound & swing on click */}
        <button
          type="button"
          onClick={playTempleBellSound}
          title={lang === 'ta' ? 'கோவில் மணி ஒலிக்க அழுத்தவும்' : 'Click to ring temple bell'}
          aria-label="Ring temple bell"
          className="group absolute top-0 right-3 sm:right-6 z-20 flex flex-col items-center cursor-pointer focus:outline-none"
        >
          <svg
            width="42"
            height="68"
            viewBox="0 0 42 68"
            className={`drop-shadow-[0_4px_10px_rgba(245,158,11,0.35)] transition-transform duration-300 origin-top group-hover:rotate-6 ${
              isBellRinging ? 'animate-temple-bell-swing' : ''
            }`}
          >
            {/* Silver Chain Links */}
            <line x1="21" y1="0" x2="21" y2="18" stroke="#CBD5E1" strokeWidth="1.8" strokeDasharray="3 2" />
            <circle cx="21" cy="20" r="2.6" fill="none" stroke="#FBBF24" strokeWidth="1.8" />
            {/* Temple Bell Crown & Body */}
            <path
              d="M15 24 C15 20.5, 27 20.5, 27 24 L29 39 C30 43, 35 45.5, 36 48.5 L6 48.5 C7 45.5, 12 43, 13 39 Z"
              fill="url(#templeBellGold)"
              stroke="#B45309"
              strokeWidth="0.9"
            />
            <ellipse cx="21" cy="49" rx="14.5" ry="2.2" fill="#92400E" />
            <circle cx="21" cy="53" r="2.6" fill="#FBBF24" />
            <defs>
              <linearGradient id="templeBellGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="40%" stopColor="#FCD34D" />
                <stop offset="75%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Main Hero Content */}
        <div className="relative z-10 px-4 pt-4 pb-1 sm:px-7 sm:pt-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pr-10 sm:pr-14">
            {/* Left: Gregorian + Tamil Solar Date & Reckoning */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-bold tracking-wide ${isBrightDay ? 'text-[#5B1419]' : 'text-white'}`}>
                  {heroDateInfo.relLabel}
                </span>
                <span className={`text-[11px] font-medium ${isBrightDay ? 'text-amber-950/75' : 'text-indigo-300/80'}`}>
                  · {t('dailyPanchangam')}
                </span>
              </div>
              <div className={`text-xs sm:text-sm font-semibold ${isBrightDay ? 'text-amber-950/85' : 'text-indigo-200/85'}`}>
                {heroDateInfo.weekdayLabel}
              </div>

              <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight ${isBrightDay ? 'text-stone-950' : 'text-white'}`}>
                {heroDateInfo.dayNum} {heroDateInfo.monthLabel}{' '}
                <span className={`font-semibold ${isBrightDay ? 'text-amber-900/75' : 'text-indigo-200/75'}`}>{heroDateInfo.yearNum}</span>
              </h2>

              {/* Tamil Solar Date Highlight */}
              <div className="pt-0.5 space-y-0.5">
                <div className={`text-base sm:text-lg font-extrabold tracking-wide ${isBrightDay ? 'text-[#7A1A22]' : 'text-amber-400'}`}>
                  {panchang?.tamilDate
                    ? (lang === 'ta' ? panchang.tamilDate.labelTa : panchang.tamilDate.labelEn)
                    : (lang === 'ta' ? 'தமிழ் பஞ்சாங்கம்' : 'Tamil Solar Calendar')}
                </div>
                <div className={`text-xs font-semibold ${isBrightDay ? 'text-stone-800/95' : 'text-indigo-200/75'}`}>
                  {heroDateInfo.weekdayEn}
                  {panchang?.tamilDate
                    ? ` · ${panchang.tamilDate.yearEn} · ${panchang.tamilDate.labelTa}`
                    : ''}
                </div>
                <div className={`text-[11px] sm:text-xs flex items-center gap-1.5 pt-0.5 ${isBrightDay ? 'text-amber-950/85 font-medium' : 'text-indigo-300/80'}`}>
                  <span>
                    {reckoning === 'thirukanitha'
                      ? (lang === 'ta' ? 'திருக்கணித பஞ்சாங்கம்' : 'Thirukanitha reckoning')
                      : (lang === 'ta' ? 'வாக்கிய பஞ்சாங்கம்' : 'Vakya reckoning')}
                  </span>
                  <span className={isBrightDay ? 'text-amber-800' : 'text-indigo-400'}>·</span>
                  <button
                    type="button"
                    onClick={toggleReckoning}
                    className={`underline underline-offset-2 transition-colors cursor-pointer font-bold ${
                      isBrightDay
                        ? 'decoration-amber-800/60 text-amber-950 hover:text-[#7A1A22]'
                        : 'decoration-indigo-400/70 text-indigo-200 hover:text-amber-300'
                    }`}
                  >
                    {lang === 'ta' ? 'மாற்றுக' : 'change'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: City Pill & Integrated Date Controls */}
            <div className="flex flex-col items-start lg:items-end gap-2.5 pt-1">
              {/* Location Pill + Popover */}
              <div className="relative" ref={cityPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowCityPicker((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer shadow-sm ${
                    isBrightDay
                      ? 'border-amber-200 bg-white/85 hover:bg-white text-stone-900'
                      : 'border-indigo-400/25 bg-white/10 hover:bg-white/15 text-indigo-100'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${isBrightDay ? 'text-amber-600' : 'text-amber-300'}`} />
                  <span className={`font-semibold ${isBrightDay ? 'text-stone-950' : 'text-white'}`}>{location.name}</span>
                  <span className={`underline underline-offset-2 ml-0.5 ${isBrightDay ? 'decoration-amber-700/60 text-[#7A1A22]' : 'decoration-indigo-300/70 text-indigo-200'}`}>
                    {lang === 'ta' ? 'மாற்றுக' : 'change'}
                  </span>
                </button>

                {showCityPicker && (
                  <div className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-[min(18rem,calc(100vw-3rem))] sm:w-72 rounded-xl border border-indigo-700/60 bg-[#0E162E] text-white shadow-2xl p-2.5 z-30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        {lang === 'ta' ? 'ஊரைத் தேர்ந்தெடுக்கவும்' : 'Select Location'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCityPicker(false)}
                        className="text-indigo-300 hover:text-white p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-indigo-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cityQuery}
                        onChange={(e) => setCityQuery(e.target.value)}
                        placeholder={lang === 'ta' ? 'நகரம் தேடு...' : 'Search city (e.g. Madurai, London)...'}
                        className="w-full bg-white/10 border border-indigo-500/40 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-indigo-300/60 focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
                      {citySuggestions.length === 0 ? (
                        <div className="text-center text-xs text-indigo-300 py-3">
                          No matching cities
                        </div>
                      ) : (
                        citySuggestions.map((c, idx) => (
                          <button
                            key={`${c.name}-${c.state}-${idx}`}
                            type="button"
                            onClick={() => handleSelectCity(c)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              location.name === c.name
                                ? 'bg-amber-500/20 text-amber-300 font-bold'
                                : 'hover:bg-white/10 text-indigo-100'
                            }`}
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-[10px] text-indigo-300/75 ml-2 shrink-0">
                              {c.state || c.country}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Frosted Date Navigation & Alerts */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div
                  className={`inline-flex items-center rounded-lg border p-0.5 ${
                    isBrightDay
                      ? 'bg-white/75 border-white/90 shadow-xs'
                      : 'bg-white/10 border-indigo-400/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => changeDateBy(-1)}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      isBrightDay ? 'hover:bg-sky-100 text-slate-800' : 'hover:bg-white/15 text-indigo-100'
                    }`}
                    title={t('previousDay')}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`bg-transparent text-[11px] font-semibold px-1.5 py-0.5 max-w-[128px] sm:max-w-none focus:outline-none ${
                      isBrightDay ? 'text-slate-900 [color-scheme:light]' : 'text-white [color-scheme:dark]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => changeDateBy(1)}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      isBrightDay ? 'hover:bg-sky-100 text-slate-800' : 'hover:bg-white/15 text-indigo-100'
                    }`}
                    title={t('nextDay')}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={setToday}
                  className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer border ${
                    isBrightDay
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {t('today')}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAlertModal(true)}
                  className={`text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
                    isBrightDay
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/30'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('whatsappAlerts')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Live Solar / Lunar Horizon Arc */}
        <div className="relative mt-2 px-3 sm:px-6 pb-2 select-none">
          <div className="relative w-full h-24 sm:h-28">
            <svg
              viewBox="0 0 1000 120"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {/* Dotted Path Arc */}
              <path
                d="M 50 98 Q 500 -70 950 98"
                fill="none"
                stroke={isBrightDay ? '#78350F' : '#94A3B8'}
                strokeOpacity={isBrightDay ? '0.58' : '0.55'}
                strokeWidth="2"
                strokeDasharray="3 6"
              />
              {/* Horizon Straight Baseline */}
              <line
                x1="28"
                y1="98"
                x2="972"
                y2="98"
                stroke={isBrightDay ? '#78350F' : '#94A3B8'}
                strokeOpacity={isBrightDay ? '0.62' : '0.65'}
                strokeWidth="1.6"
              />
              {/* Scalloped Horizon Wave Motif */}
              <path
                d={HORIZON_WAVE_PATH}
                fill="none"
                stroke={isBrightDay ? '#92400E' : '#475569'}
                strokeOpacity={isBrightDay ? '0.48' : '0.70'}
                strokeWidth="1.4"
              />
            </svg>

            {/* Circular Sun (Day) or Real Moon Cycle Phase (Night) Orb Riding Along the Horizon Arc */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
              style={{
                left: `${solarArcState.leftPct}%`,
                top: `${solarArcState.topPct}%`,
              }}
              title={
                solarArcState.isDaytime
                  ? `${panchang?.sunMoonTimes?.sunrise || '06:16 AM'} → ${panchang?.sunMoonTimes?.sunset || '05:50 PM'} (${solarArcState.pctDone}%)`
                  : `${moonCycle.label} · ${panchang?.sunMoonTimes?.sunset || '05:50 PM'} → ${panchang?.sunMoonTimes?.sunrise || '06:16 AM'}`
              }
            >
              {solarArcState.isDaytime ? (
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-300/45 blur-sm" />
                  <svg width="32" height="32" viewBox="0 0 36 36" className="relative drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="18"
                        y1="3"
                        x2="18"
                        y2="6.8"
                        stroke={isBrightDay ? '#D97706' : '#FCD34D'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform={`rotate(${deg} 18 18)`}
                      />
                    ))}
                    <circle
                      cx="18"
                      cy="18"
                      r="8.2"
                      fill={isBrightDay ? '#F59E0B' : '#FBBF24'}
                      stroke="#FEF08A"
                      strokeWidth="1.3"
                    />
                  </svg>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-200/25 blur-sm" />
                    <svg width="32" height="32" viewBox="0 0 36 36" className="relative drop-shadow-[0_0_10px_rgba(224,231,255,0.8)]">
                      <defs>
                        <clipPath id="lunarLitClip">
                          {moonCycle.litPath ? <path d={moonCycle.litPath} /> : <circle cx="18" cy="18" r="0" />}
                        </clipPath>
                        <radialGradient id="nightMoonLitGrad" cx="38%" cy="35%" r="72%">
                          <stop offset="0%" stopColor="#FEFCE8" />
                          <stop offset="65%" stopColor="#E2E8F0" />
                          <stop offset="100%" stopColor="#CBD5E1" />
                        </radialGradient>
                      </defs>
                      {/* Dark Unlit Side of the Moon */}
                      <circle cx="18" cy="18" r="9" fill="#0F172A" stroke="#64748B" strokeOpacity="0.65" strokeWidth="0.9" />
                      {/* Exact Waxing / Waning Lit Moon Cycle Phase */}
                      {moonCycle.litPath && (
                        <>
                          <path d={moonCycle.litPath} fill="url(#nightMoonLitGrad)" />
                          <g clipPath="url(#lunarLitClip)" fill="#94A3B8" fillOpacity="0.35">
                            <circle cx="14.5" cy="15.5" r="1.7" />
                            <circle cx="21" cy="19.5" r="2.1" />
                            <circle cx="16" cy="21.5" r="1.2" />
                          </g>
                        </>
                      )}
                    </svg>
                  </div>
                  <span className="mt-0.5 whitespace-nowrap rounded-full bg-slate-950/75 border border-indigo-400/25 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-100">
                    {moonCycle.label}
                  </span>
                </div>
              )}
            </div>

            {/* Horizon Left & Right Timings (Day: Sunrise -> Sunset | Night: Sunset -> Sunrise) */}
            <div
              className={`absolute bottom-[2px] left-1 sm:left-2 text-[10px] font-semibold flex items-center gap-1 rounded px-1.5 py-0.5 ${
                isBrightDay ? 'bg-white/70 text-slate-800 shadow-2xs' : 'text-amber-200/85'
              }`}
            >
              <span>{solarArcState.isDaytime ? t('sunrise') : t('sunset')}:</span>
              <span className={isBrightDay ? 'text-slate-950 font-bold' : 'text-white'}>
                {solarArcState.isDaytime
                  ? (panchang?.sunMoonTimes?.sunrise || '06:16 AM')
                  : (panchang?.sunMoonTimes?.sunset || '05:50 PM')}
              </span>
            </div>
            <div
              className={`absolute bottom-[2px] right-1 sm:right-2 text-[10px] font-semibold flex items-center gap-1 rounded px-1.5 py-0.5 ${
                isBrightDay ? 'bg-white/70 text-slate-800 shadow-2xs' : 'text-amber-200/85'
              }`}
            >
              <span>{solarArcState.isDaytime ? t('sunset') : t('sunrise')}:</span>
              <span className={isBrightDay ? 'text-slate-950 font-bold' : 'text-white'}>
                {solarArcState.isDaytime
                  ? (panchang?.sunMoonTimes?.sunset || '05:50 PM')
                  : (panchang?.sunMoonTimes?.sunrise || '06:16 AM')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-spin mb-3" />
          <p className="text-slate-500 text-xs">Calculating Tithi & Ephemeris...</p>
        </div>
      ) : panchang ? (
        <div className="space-y-4 sm:space-y-6">
          {/* 5 Angas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white border border-amber-200/70 rounded-xl p-3.5 shadow-xs hover:border-amber-400 transition-all">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">1. {t('vaar')}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{vaarData.name}</h4>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">{lordLabel} {vaarData.lord}</p>
              <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-tight">{vaarData.nature}</p>
            </div>

            <div className="bg-white border border-amber-200/70 rounded-xl p-3.5 shadow-xs hover:border-amber-400 transition-all">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">2. {t('tithi')}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {tithiData.name}
                {tithiData.number ? <span className="ml-1.5 text-xs font-semibold text-slate-400">#{tithiData.number}</span> : null}
              </h4>
              <p className="text-xs text-indigo-700 font-semibold mt-0.5">{tithiData.paksha}</p>
              {tithiData.deity && (
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  {lang === 'ta' ? 'தெய்வம்:' : lang === 'hi' ? 'देवता:' : 'Deity:'} {tithiData.deity}
                </p>
              )}
              {tithiData.meaning && (
                <p className="mt-1 text-[10px] text-slate-500 leading-tight line-clamp-2">{tithiData.meaning}</p>
              )}
            </div>

            <div className="bg-white border border-amber-200/70 rounded-xl p-3.5 shadow-xs hover:border-amber-400 transition-all">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">3. {t('nakshatra')}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{nakshatraData.name}</h4>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">{lordLabel} {nakshatraData.lord}</p>
              <p className="text-[11px] text-slate-500 mt-1.5">{deityLabel} {nakshatraData.deity}</p>
            </div>

            <div className="bg-white border border-amber-200/70 rounded-xl p-3.5 shadow-xs hover:border-amber-400 transition-all">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">4. {t('yoga')}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{yogaData.name}</h4>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold mt-1 ${
                yogaData.isAuspicious
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {yogaData.nature}
              </span>
            </div>

            <div className="bg-white border border-amber-200/70 rounded-xl p-3.5 shadow-xs hover:border-amber-400 transition-all">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">5. {t('karana')}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{karanaData.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">{karanaData.type}</p>
            </div>
          </div>

          {/* Sun & Moon Timings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-amber-50/50 border border-amber-200/70 rounded-xl p-3 text-center">
            <div className="flex flex-col items-center justify-center p-1.5">
              <Sun className="w-5 h-5 text-amber-600 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('sunrise')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes?.sunrise || '06:16 AM'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <Sun className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('sunset')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes?.sunset || '05:50 PM'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <Moon className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('moonrise')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes?.moonrise || '01:30 PM'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <Moon className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('moonset')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes?.moonset || '01:15 AM'}</span>
            </div>
          </div>

          {/* Muhurats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auspicious */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
                <Award className="w-4 h-4 text-emerald-600" /> {t('auspiciousMuhurats')}
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-bold text-slate-800">{t('abhijitMuhurat')}:</span>
                  <span className="font-bold text-emerald-700">{panchang.timings?.abhijitMuhurat || '11:45 AM - 12:35 PM'}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-medium text-slate-700">{t('brahmaMuhurat')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings?.brahmaMuhurat || '04:45 AM - 05:35 AM'}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-medium text-slate-700">{t('amritKalam')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings?.amritKalam || '08:30 AM - 10:00 AM'}</span>
                </div>
              </div>
            </div>

            {/* Inauspicious */}
            <div className="bg-white border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2 mb-3 pb-2 border-b border-rose-100">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> {t('inauspiciousPeriods')}
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-bold text-slate-800">{t('rahuKalam')}:</span>
                  <span className="font-bold text-rose-700">{panchang.timings?.rahuKalam || '12:00 PM - 01:30 PM'}</span>
                </div>
                <div className="flex justify-between items-center bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-medium text-slate-700">{t('yamagandam')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings?.yamagandam || '07:30 AM - 09:00 AM'}</span>
                </div>
                <div className="flex justify-between items-center bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-medium text-slate-700">{t('gulikaKalam')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings?.gulikaKalam || '10:30 AM - 12:00 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs flex flex-wrap justify-between items-center gap-3 text-slate-600">
            <div><span className="text-amber-800 font-bold">{t('vikramSamvat')}:</span> {panchang.astronomicalData?.vikramSamvat || '2083'}</div>
            <div><span className="text-amber-800 font-bold">{t('shakaSamvat')}:</span> {panchang.astronomicalData?.shakaSamvat || '1948'}</div>
            <div><span className="text-amber-800 font-bold">{t('ayana')}:</span> {getAyanaName(panchang.astronomicalData?.ayana)}</div>
            <div><span className="text-amber-800 font-bold">{t('ritu')}:</span> {getRituName(panchang.astronomicalData?.ritu)}</div>
          </div>
        </div>
      ) : null}

      <AlertsSubscriptionModal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} panchang={panchang} />
    </div>
  );
}
