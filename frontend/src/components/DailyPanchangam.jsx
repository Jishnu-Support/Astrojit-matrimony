import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Moon, Clock, Compass, ShieldAlert, Award, ChevronLeft, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
import { useLang } from '../i18n';
import { API } from '../api';
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

export default function DailyPanchangam() {
  const { lang, t } = useLang();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    async function fetchPanchang() {
      setLoading(true);
      try {
        const data = await API.getPanchangam(selectedDate);
        setPanchang(data);
      } catch (err) {
        console.error('Failed to load panchangam:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPanchang();
  }, [selectedDate]);

  const changeDateBy = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Localized date header
  const getFormattedDate = () => {
    if (!selectedDate) return panchang?.formattedDate;
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dObj = new Date(y, m - 1, d);
      const localeMap = {
        ta: 'ta-IN',
        kn: 'kn-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        en: 'en-US'
      };
      return dObj.toLocaleDateString(localeMap[lang] || 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return panchang?.formattedDate;
    }
  };

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
    if (!panchang?.tithi) return { name: '', paksha: '', progress: '' };
    if (lang === 'en') return panchang.tithi;
    const cleanName = (panchang.tithi.name || '').replace(/\s*\(.*\)/, '').trim();
    const localizedName = TITHI_DICT[lang]?.[cleanName] || panchang.tithi.name;
    const isShukla = (panchang.tithi.paksha || '').toLowerCase().includes('shukla');
    const localizedPaksha = lang === 'ta'
      ? (isShukla ? 'சுக்ல பட்சம் (வளர்பிறை)' : 'கிருஷ்ண பட்சம் (தேய்பிறை)')
      : lang === 'kn'
      ? (isShukla ? 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳದಿಂಗಳು)' : 'ಕೃಷ್ಣ ಪಕ್ಷ (ಕತ್ತಲ ತಿಂಗಳು)')
      : lang === 'hi'
      ? (isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष')
      : panchang.tithi.paksha;

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
      progress: localizedProgress
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Header & Controller */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-amber-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl border border-amber-200 shrink-0">
            ☀️
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              {t('dailyPanchangam')}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {getFormattedDate() || 'Calculating auspicious planetary alignments...'}
            </p>
          </div>
        </div>

        {/* Date Selector & WhatsApp Button */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title={t('previousDay')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
            />

            <button
              onClick={() => changeDateBy(1)}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title={t('nextDay')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={setToday}
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
          >
            {t('today')}
          </button>

          <button
            onClick={() => setShowAlertModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" /> {t('whatsappAlerts')}
          </button>
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
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{tithiData.name}</h4>
              <p className="text-xs text-indigo-700 font-semibold mt-0.5">{tithiData.paksha}</p>
              <div className="mt-1.5 text-[11px] text-slate-500 font-medium">{tithiData.progress}</div>
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
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes.sunrise}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <Sun className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('sunset')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes.sunset}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <Moon className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('moonrise')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes.moonrise}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <Moon className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">{t('moonset')}</span>
              <span className="font-bold text-slate-900 text-sm">{panchang.sunMoonTimes.moonset}</span>
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
                  <span className="font-bold text-emerald-700">{panchang.timings.abhijitMuhurat}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-medium text-slate-700">{t('brahmaMuhurat')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings.brahmaMuhurat}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-medium text-slate-700">{t('amritKalam')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings.amritKalam}</span>
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
                  <span className="font-bold text-rose-700">{panchang.timings.rahuKalam}</span>
                </div>
                <div className="flex justify-between items-center bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-medium text-slate-700">{t('yamagandam')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings.yamagandam}</span>
                </div>
                <div className="flex justify-between items-center bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-medium text-slate-700">{t('gulikaKalam')}:</span>
                  <span className="font-semibold text-slate-800">{panchang.timings.gulikaKalam}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs flex flex-wrap justify-between items-center gap-3 text-slate-600">
            <div><span className="text-amber-800 font-bold">{t('vikramSamvat')}:</span> {panchang.astronomicalData.vikramSamvat}</div>
            <div><span className="text-amber-800 font-bold">{t('shakaSamvat')}:</span> {panchang.astronomicalData.shakaSamvat}</div>
            <div><span className="text-amber-800 font-bold">{t('ayana')}:</span> {getAyanaName(panchang.astronomicalData.ayana)}</div>
            <div><span className="text-amber-800 font-bold">{t('ritu')}:</span> {getRituName(panchang.astronomicalData.ritu)}</div>
          </div>
        </div>
      ) : null}

      <AlertsSubscriptionModal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} panchang={panchang} />
    </div>
  );
}
