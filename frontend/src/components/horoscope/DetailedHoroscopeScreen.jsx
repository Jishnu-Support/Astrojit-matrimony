import React, { useState, useEffect } from 'react';
import {
  Printer,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  Compass,
  Star,
  Layers,
  BarChart3,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Search,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import ThirukanithaChart from './ThirukanithaChart';
import { calculateNativeHoroscope, RASHI_LORD_KEYS } from './thirukanithaCalculator';
import { useLang } from '../../i18n';
import { HORO_I18N } from '../../horoscopeI18n';
import { API } from '../../api';
import { printElementById } from '../../utils/printHelper';

// Complete multi-language dictionary for Detailed Horoscope Screen
export const HORO_SCREEN_I18N = {
  badge: {
    en: 'Thirukanitha (Drik Ganitha) • Parashara BPHS System',
    ta: 'திருக்கணித பராசரர் முறை கணிப்பு (BPHS)',
    hi: 'तिरुकणितम (दृक्-सिद्ध) • पराशर पद्धति (BPHS)',
    kn: 'ತಿರುಕ್ಕಣಿತ (ದೃಕ್ ಸಿದ್ಧ) • ಪರಾಶರ ಪದ್ಧತಿ (BPHS)',
    te: 'తిరుక్కణిత (దృక్ సిద్ధ) • పరాశర పద్ధతి (BPHS)',
    bn: 'তিরুক্কণিতম (দৃক-সিদ্ধ) • পরাশর পদ্ধতি (BPHS)'
  },
  screenTitle: {
    en: 'Comprehensive Thirukanitha Horoscope Screen',
    ta: 'விரிவான திருக்கணித ஜாதகக் கணிப்பு திரை',
    hi: 'विस्तृत तिरुकणितम जन्मकुण्डली स्क्रीन',
    kn: 'ಸಮಗ್ರ ತಿರುಕ್ಕಣಿತ ಜಾತಕ ಪರದೆ',
    te: 'సమగ్ర తిరుక్కణిత జాతక స్క్రీన్',
    bn: 'সমগ্র তিরুক্কণিতম জন্মকুষ্ঠি স্ক্রিন'
  },
  screenSubtitle: {
    en: 'Complete mathematical Parashari & Thirukanitha planetary longitudes, 120-year Vimshottari schedule, Bhava Balas, Shadbala matrix, Ashtakavarga, and Yogas.',
    ta: 'பராசரர் மற்றும் திருக்கணித முறைப்படி அனைத்து கிரக பாதசாரம், விம்ஷோத்தரி தசா-புக்தி, பாவப்பட்டிகை பலம், ஷட்பலம், அஷ்டகவர்க்கம் மற்றும் யோகங்கள் கணிப்பு.',
    hi: 'पराशर एवं दृक-सिद्ध पद्धति अनुसार ग्रह स्पष्ट, 120 वर्षीय विंशोत्तरी दशा-भुक्ति, भाव बल, षड्बल, अष्टकवर्ग एवं विशेष योग।',
    kn: 'ಪರಾಶರ ಹಾಗೂ ದೃಕ್ ಸಿದ್ಧ ಪದ್ಧತಿಯಂತೆ ಗ್ರಹ ಸ್ಪಷ್ಟ, ೧೨೦ ವರ್ಷಗಳ ವಿಂಶೋತ್ತರಿ ದಶಾ-ಭುಕ್ತಿ, ಭಾವ ಬಲ, ಷಡ್ಬಲ, ಅಷ್ಟಕವರ್ಗ ಮತ್ತು ಯೋಗಗಳು.',
    te: 'పరాశర మరియు దృక్ సిద్ధ పద్ధతి ప్రకారం గ్రహ స్పష్ట, 120 ఏళ్ల వింశోత్తరి దశా-భుక్తి, భావ బలం, షడ్బలం, అష్టకవర్గ మరియు యోగాలు.',
    bn: 'পরাশর ও দৃক-সিদ্ধ অনুসারে গ্রহ স্ফুট, ১২০ বছরের বিংশোত্তরী দশা-ভুক্তি, ভাব বল, ষড়বল, অষ্টকবর্গ ও বিশেষ যোগ।'
  },
  editDetails: {
    en: 'Edit Native Details',
    ta: 'ஜாதகர் விவரங்கள் மாற்றம்',
    hi: 'जन्म विवरण बदलें',
    kn: 'ಜಾತಕ ವಿವರ ಬದಲಿಸಿ',
    te: 'జాతక వివరాలు మార్చండి',
    bn: 'জন্ম বিবরণ পরিবর্তন'
  },
  closeForm: {
    en: 'Close Form',
    ta: 'படிவத்தை மூடு',
    hi: 'फ़ॉर्म बंद करें',
    kn: 'ಫಾರ್ಮ್ ಮುಚ್ಚಿ',
    te: 'ఫారమ్ మూసివేయి',
    bn: 'ফর্ম বন্ধ করুন'
  },
  printExport: {
    en: 'Print / Export PDF',
    ta: 'பதிவிறக்கவும் (Print/PDF)',
    hi: 'प्रिंट / PDF सुरक्षित करें',
    kn: 'ಪ್ರಿಂಟ್ / PDF ಡೌನ್‌ಲೋಡ್',
    te: 'ప్రింట్ / PDF భద్రపరచండి',
    bn: 'প্রিন্ট / PDF সংরক্ষণ'
  },
  selectClient: {
    en: 'Select Client Native:',
    ta: 'வாடிக்கையாளரை தேர்வு செய்க:',
    hi: 'ग्राहक जातक चुनें:',
    kn: 'ಗ್ರಾಹಕ ಜಾತಕರನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    te: 'క్లయింట్ జాతకుడిని ఎంచుకోండి:',
    bn: 'গ্রাহক জাতক নির্বাচন করুন:'
  },
  registeredProfiles: {
    en: 'registered native profiles',
    ta: 'பதிவு செய்யப்பட்ட ஜாதகர்கள்',
    hi: 'पंजीकृत जातक प्रोफाइल',
    kn: 'ನೋಂದಾಯಿತ ಜಾತಕ ಪ್ರೊಫೈಲ್‌ಗಳು',
    te: 'నమోదైన జాతక ప్రొఫైళ్లు',
    bn: 'নিবন্ধিত জাতক প্রোফাইল'
  },
  formTitle: {
    en: 'Enter Native Birth Parameters for Calculation',
    ta: 'ஜாதகர் பிறப்பு விவரங்களை உள்ளிடவும்',
    hi: 'गणना हेतु जातक जन्म विवरण प्रविष्ट करें',
    kn: 'ಗಣನೆಗೆ ಜಾತಕ ಜನನ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    te: 'గణన కోసం జాతక జనన వివరాలను నమోదు చేయండి',
    bn: 'গণনার জন্য জাতক জন্ম বিবরণ লিখুন'
  },
  realtimeCalc: {
    en: 'Realtime Thirukanitha Computation',
    ta: 'உடனடி திருக்கணிதக் கணிப்பு',
    hi: 'तात्कालिक तिरुकणितम गणना',
    kn: 'ತತ್ಕ್ಷಣದ ತಿರುಕ್ಕಣಿತ ಗಣನೆ',
    te: 'తక్షణ తిరుక్కణిత గణన',
    bn: 'তাৎক্ষণিক তিরুক্কণিতম গণনা'
  },
  name: { en: 'Native Name', ta: 'பெயர்', hi: 'जातक का नाम', kn: 'ಹೆಸರು', te: 'పేరు', bn: 'নাম' },
  gender: { en: 'Gender', ta: 'பாலினம்', hi: 'लिंग', kn: 'ಲಿಂಗ', te: 'లింగం', bn: 'লিঙ্গ' },
  male: { en: 'Male', ta: 'ஆண்', hi: 'पुरुष', kn: 'ಪುರುಷ', te: 'పురుషుడు', bn: 'পুরুষ' },
  female: { en: 'Female', ta: 'பெண்', hi: 'महिला', kn: 'ಮಹಿಳೆ', te: 'స్త్రీ', bn: 'মহিলা' },
  dob: { en: 'Date of Birth (YYYY-MM-DD)', ta: 'பிறந்த தேதி (DOB)', hi: 'जन्म तिथि (YYYY-MM-DD)', kn: 'ಜನನ ದಿನಾಂಕ', te: 'పుట్టిన తేదీ', bn: 'জন্ম তারিখ' },
  tob: { en: 'Birth Time (HH:MM:SS / AM/PM)', ta: 'பிறந்த நேரம் (TOB)', hi: 'जन्म समय', kn: 'ಜನನ ಸಮಯ', te: 'పుట్టిన సమయం', bn: 'জন্ম সময়' },
  pob: { en: 'Place of Birth', ta: 'பிறந்த இடம் (Place of Birth)', hi: 'जन्म स्थान', kn: 'ಜನನ ಸ್ಥಳ', te: 'పుట్టిన స్థలం', bn: 'জন্মস্থান' },
  lat: { en: 'Latitude', ta: 'அட்சாம்சம் (Latitude)', hi: 'अक्षांश', kn: 'ಅಕ್ಷಾಂಶ', te: 'అక్షాంశం', bn: 'অক্ষাংশ' },
  lon: { en: 'Longitude', ta: 'தீர்க்காம்சம் (Longitude)', hi: 'रेखांश', kn: 'ರೇಖಾಂಶ', te: 'రేఖాంశం', bn: 'দ্রাঘিমাংশ' },
  calculateBtn: { en: 'Calculate Horoscope', ta: 'ஜாதகம் கணிக்கவும்', hi: 'कुण्डली गणना करें', kn: 'ಜಾತಕ ಗಣಿಸಿ', te: 'జాతకం లెక్కించండి', bn: 'কুষ্ঠি গণনা করুন' },
  nativeInfoTitle: { en: 'Native Information', ta: 'ஜாதகர் விவரங்கள்', hi: 'जातक विवरण', kn: 'ಜಾತಕ ವಿವರ', te: 'జాతక వివరాలు', bn: 'জাতক বিবরণ' },
  dashaBalLabel: { en: 'Dasha Balance:', ta: 'தசா இருப்பு:', hi: 'दशा शेष:', kn: 'ದಶಾ ಶೇಷ:', te: 'దశా శేషం:', bn: 'দশা শেষ:' },
  currAgeLabel: { en: 'Current Age:', ta: 'நடப்பு வயது:', hi: 'वर्तमान आयु:', kn: 'ಪ್ರಸ್ತುತ ವಯಸ್ಸು:', te: 'ప్రస్తుత వయస్సు:', bn: 'বর্তমান বয়স:' },
  dobTobLabel: { en: 'Birth Date & Time', ta: 'பிறந்த தேதி & நேரம்', hi: 'जन्म दिनांक व समय', kn: 'ಜನನ ದಿನಾಂಕ & ಸಮಯ', te: 'పుట్టిన తేదీ & సమయం', bn: 'জন্ম তারিখ ও সময়' },
  placeLabel: { en: 'Place', ta: 'பிறந்த இடம்', hi: 'जन्म स्थान', kn: 'ಸ್ಥಳ', te: 'స్థలం', bn: 'স্থান' },
  coordsLabel: { en: 'Coordinates', ta: 'அட்ச / தீர்க்காம்சம்', hi: 'अक्षांश / रेखांश', kn: 'ಅಕ್ಷಾಂಶ / ರೇಖಾಂಶ', te: 'అక్షాంశం / రేఖాంశం', bn: 'অক্ষাংশ / দ্রাঘিমাংশ' },
  udayathiLabel: { en: 'Udayathi Nazhikai', ta: 'உதயாதி நாழிகை', hi: 'सूर्योदयात् घटी', kn: 'ಉದಯಾದಿ ಘಳಿಗೆ', te: 'ఉదయాది ఘడియలు', bn: 'সূর্যোদয়াৎ ঘটিকা' },
  nazhikaiUnit: { en: 'Nazhikai', ta: 'நாழிகை', hi: 'घटी', kn: 'ಘಳಿಗೆ', te: 'ఘడియలు', bn: 'ঘটি' },
  vinazhikaiUnit: { en: 'Vinazhikai', ta: 'விநாழிகை', hi: 'पल', kn: 'ವಿಘಳಿಗೆ', te: 'విఘడియలు', bn: 'পল' },
  yrs: { en: 'Yrs', ta: 'வரு', hi: 'वर्ष', kn: 'ವರ್ಷ', te: 'సం.', bn: 'বছর' },
  mos: { en: 'Mos', ta: 'மா', hi: 'माह', kn: 'ತಿಂಗಳು', te: 'నెల.', bn: 'মাস' },
  dys: { en: 'Days', ta: 'நாள்', hi: 'दिन', kn: 'ದಿನ', te: 'రోజులు', bn: 'দিন' },
  tabs: {
    charts: { en: '1. Charts & Positions', ta: '1. கட்டங்கள் & நிலைகள்', hi: '1. कुण्डली व ग्रह स्थिति', kn: '1. ಕುಂಡಲಿ ಮತ್ತು ಗ್ರಹ ಸ್ಥಿತಿ', te: '1. చక్రాలు & స్థితులు', bn: '1. চক্র ও গ্রহ স্থিতি' },
    dasha: { en: '2. Vimshottari Dasha', ta: '2. விம்ஷோத்தரி தசா-புக்தி', hi: '2. विंशोत्तरी दशा-भुक्ति', kn: '2. ವಿಂಶೋತ್ತರಿ ದಶಾ-ಭುಕ್ತಿ', te: '2. వింశోత్తరి దశా-భుక్తి', bn: '2. বিংশোত্তরী দশা-ভুক্তি' },
    bhava: { en: '3. Bhava Chalit & Bala', ta: '3. பாவப்பட்டிகை & பலம்', hi: '3. भाव चलित व बल', kn: '3. ಭಾವ ಚಲಿತ & ಬಲ', te: '3. భావ చలిత & బలము', bn: '3. ভাব চলিত ও বল' },
    panchangam: { en: '4. Panchangam & Points', ta: '4. பஞ்சாங்கம் & புள்ளிகள்', hi: '4. पंचांग व विशेष बिंदु', kn: '4. ಪಂಚಾಂಗ ಮತ್ತು ಬಿಂದುಗಳು', te: '4. పంచాంగం & బిందువులు', bn: '4. পঞ্চাঙ্গ ও বিশেষ বিন্দু' },
    vargas: { en: '5. Divisional Charts', ta: '5. வர்க்கசக்கரங்கள் (D1-D60)', hi: '5. वर्ग कुण्डलियाँ (D1-D60)', kn: '5. ವರ್ಗ ಕುಂಡಲಿಗಳು', te: '5. వర్గ చక్రాలు (D1-D60)', bn: '5. বর্গ চক্র (D1-D60)' },
    shadbala: { en: '6. Shadbala & Ashtakavarga', ta: '6. ஷட்பலம் & அஷ்டகவர்க்கம்', hi: '6. षड्बल व अष्टकवर्ग', kn: '6. ಷಡ್ಬಲ & ಅಷ್ಟಕವರ್ಗ', te: '6. షడ్బలం & అష్టకవర్గ', bn: '6. ষড়বল ও অষ্টকবর্গ' },
    yogas: { en: '7. Yogas & 35 Sahams', ta: '7. யோகங்கள் & சஹம்கள்', hi: '7. विशेष योग व 35 सहम', kn: '7. ಯೋಗಗಳು & 35 ಸಹಮ್ಗಳು', te: '7. యోగాలు & 35 సహమ్‌లు', bn: '7. বিশেষ যোগ ও ৩৫ সহম' }
  },
  // Tab 1
  rasiChart: { en: 'Rasi Chart (D1)', ta: 'ராசி கட்டம் (D1)', hi: 'लग्न कुण्डली (D1)', kn: 'ರಾಶಿ ಕುಂಡಲಿ (D1)', te: 'రాశి చక్రం (D1)', bn: 'রাশি চক্র (D1)' },
  navamshaChart: { en: 'Navamsha Chart (D9)', ta: 'நவாம்சம் கட்டம் (D9)', hi: 'नवांश कुण्डली (D9)', kn: 'ನವಾಂಶ ಕುಂಡಲಿ (D9)', te: 'నవాంశ చక్రం (D9)', bn: 'নবাংশ চক্র (D9)' },
  ascendant: { en: 'Ascendant', ta: 'லக்னம்', hi: 'लग्न', kn: 'ಲಗ್ನ', te: 'లగ్నం', bn: 'লগ্ন' },
  navamshaAsc: { en: 'Navamsha Lagna', ta: 'நவாம்ச லக்னம்', hi: 'नवांश लग्न', kn: 'ನವಾಂಶ ಲಗ್ನ', te: 'నవాంశ లగ్నం', bn: 'নবাংশ লগ্ন' },
  tableTitleLong: { en: 'Planetary Longitudes & Speed Matrix', ta: 'கிரக பாதசாரம் மற்றும் வேகம்', hi: 'ग्रह स्पष्ट एवं गति तालिका', kn: 'ಗ್ರಹ ಸ್ಪಷ್ಟ ಮತ್ತು ಗತಿ ಕೋಷ್ಟಕ', te: 'గ్రహ స్పష్ట & వేగ పట్టిక', bn: 'গ্রহ স্ফুট ও গতি সারণী' },
  thPlanet: { en: 'Planet', ta: 'கிரகம்', hi: 'ग्रह', kn: 'ಗ್ರಹ', te: 'గ్రహం', bn: 'গ্রহ' },
  thRasi: { en: 'Rasi', ta: 'ராசி', hi: 'राशि', kn: 'ರಾಶಿ', te: 'రాశి', bn: 'রাশি' },
  thStar: { en: 'Nakshatra', ta: 'நட்சத்திரம்', hi: 'नक्षत्र', kn: 'ನಕ್ಷತ್ರ', te: 'నక్షత్రం', bn: 'নক্ষত্র' },
  thLong: { en: 'Longitude', ta: 'தீர்க்காம்சம்', hi: 'भोग / स्पष्ट', kn: 'ರೇಖಾಂಶ', te: 'రేఖాంశం', bn: 'দ্রাঘিমাংশ' },
  thSpeed: { en: 'Speed', ta: 'வேகம்', hi: 'गति', kn: 'ವೇಗ', te: 'వేగం', bn: 'গতি' },
  thStarLord: { en: 'Star Lord', ta: 'நட்சத்திர அதிபதி', hi: 'नक्षत्र स्वामी', kn: 'ನಕ್ಷತ್ರಾಧಿಪತಿ', te: 'నక్షత్రాధిపతి', bn: 'নক্ষত্রাধিপতি' },
  thDignity: { en: 'Dignity', ta: 'நிலை', hi: 'स्थिति', kn: 'ಸ್ಥಿತಿ', te: 'స్థితి', bn: 'স্থিতি' },
  // Tab 2
  dashaTitle: { en: 'Vimshottari Dasha - Bhukti Lifespan Schedule (120 Years)', ta: 'விம்ஷோத்தரி தசா - புக்தி காலம் (120 ஆண்டுகள்)', hi: 'विंशोत्तरी दशा - भुक्ति अवधि (120 वर्ष)', kn: 'ವಿಂಶೋತ್ತರಿ ದಶಾ - ಭುಕ್ತಿ ಅವಧಿ (120 ವರ್ಷ)', te: 'వింశోత్తరి దశా - భుక్తి కాలం (120 ఏళ్లు)', bn: 'বিংশোত্তরী দশা - ভুক্তি সময়সূচী (১২০ বছর)' },
  dashaSub: { en: 'Complete sequence of 9 Mahadashas & 81 Bhuktis with exact start dates, end dates, and age.', ta: '9 மகாதிசைகள் மற்றும் 81 புக்திகளின் துல்லியமான ஆரம்பம், முடிவு மற்றும் வயது விவரங்கள்.', hi: '9 महादशाओं एवं 81 भुक्तियों का सटीक प्रारंभ, समाप्ति एवं आयु विवरण।', kn: '9 ಮಹಾದಶೆಗಳು ಮತ್ತು 81 ಭುಕ್ತಿಗಳ ನಿಖರ ಪ್ರಾರಂಭ, ಮುಕ್ತಾಯ ಮತ್ತು ವಯಸ್ಸಿನ ವಿವರ.', te: '9 మహాదశలు మరియు 81 భుక్తుల ప్రారంభం, ముగింపు మరియు వయస్సు వివరాలు.', bn: '৯টি মহাদশা ও ৮১টি ভুক্তির নির্ভুল সূচনা, সমাপ্তি ও বয়স বিবরণ।' },
  currentBadge: { en: 'Current:', ta: 'நடப்பு:', hi: 'वर्तमान:', kn: 'ಪ್ರಸ್ತುತ:', te: 'ప్రస్తుత:', bn: 'বর্তমান:' },
  dashaPeriodLabel: { en: 'Dasha Period', ta: 'தசா புக்தி காலம்', hi: 'दशा अवधि', kn: 'ದಶಾ ಅವಧಿ', te: 'దశా కాలం', bn: 'দশা সময়কাল' },
  yearsSuffix: { en: 'Years', ta: 'ஆண்டுகள்', hi: 'वर्ष', kn: 'ವರ್ಷಗಳು', te: 'సంవత్సరాలు', bn: 'বছর' },
  fromWord: { en: 'from', ta: 'முதல்', hi: 'से', kn: 'ದಿಂದ', te: 'నుండి', bn: 'হতে' },
  toWord: { en: 'to', ta: 'வரை', hi: 'तक', kn: 'ವರೆಗೆ', te: 'వరకు', bn: 'পর্যন্ত' },
  thDasha: { en: 'Dasha', ta: 'தசா', hi: 'दशा', kn: 'ದಶಾ', te: 'దశ', bn: 'দশা' },
  thBhukti: { en: 'Bhukti', ta: 'புக்தி', hi: 'भुक्ति', kn: 'ಭುಕ್ತಿ', te: 'భుక్తి', bn: 'ভুক্তি' },
  thStart: { en: 'Start', ta: 'ஆரம்பம்', hi: 'आरंभ', kn: 'ಆರಂಭ', te: 'ప్రారంభం', bn: 'আরম্ভ' },
  thEnd: { en: 'End', ta: 'முடிவு', hi: 'समाप्ति', kn: 'ಮುಕ್ತಾಯ', te: 'ముగింపు', bn: 'সমাপ্তি' },
  thAge: { en: 'Age', ta: 'வயது', hi: 'आयु', kn: 'ವಯಸ್ಸು', te: 'వయస్సు', bn: 'বয়স' },
  // Tab 3
  bhavaChalitChart: { en: 'Bhava Chalit Chart', ta: 'பாவப்பட்டிகை கட்டம்', hi: 'भाव चलित कुण्डली', kn: 'ಭಾವ ಚಲಿತ ಕುಂಡಲಿ', te: 'భావ చలిత చక్రం', bn: 'ভাব চলিত চক্র' },
  bhavaChalitSub: { en: 'Sripati System Cusp Placements', ta: 'ஸ்ரீபதி முறைப்படி பாவ ஆரம்பம் & மையம்', hi: 'श्रीपति पद्धति अनुसार भाव संधि व मध्य', kn: 'ಶ್ರೀಪತಿ ಪದ್ಧತಿಯಂತೆ ಭಾವಾರಂಭ ಮತ್ತು ಮಧ್ಯ', te: 'శ్రీపతి పద్ధతి ప్రకారం భావారంభం & మధ్యం', bn: 'শ্রীপতি পদ্ধতি অনুসারে ভাবারম্ভ ও মধ্য' },
  bhavaBalaTitle: { en: 'Bhava Bala Strength Chart', ta: 'பாவ பலம்', hi: 'भाव बल सारणी', kn: 'ಭಾವ ಬಲ ಕೋಷ್ಟಕ', te: 'భావ బల చార్ట్', bn: 'ভাব বল তালিকা' },
  bhavaBalaSub: { en: '12 Bhava strength metrics in Virupas', ta: '12 பாவங்களின் விரூபா பல மதிப்பீடு', hi: '12 भावों का विरूपा बल मान', kn: '12 ಭಾವಗಳ ವಿರೂಪಾ ಬಲ', te: '12 భావాల విరూపా బలం', bn: '১২টি ভাবের বিরূপা বল' },
  bhavaCuspsTitle: { en: '12 Bhava Cusps & Occupants', ta: 'பாவப்பட்டிகை அட்டவணை', hi: '12 भाव संधि व ग्रह स्थिति', kn: '12 ಭಾವ ಸಂಧಿ ಮತ್ತು ಗ್ರಹಗಳು', te: '12 భావ సంధులు & గ్రహాలు', bn: '১২ ভাব সন্ধি ও গ্রহ স্থিতি' },
  thBhava: { en: 'Bhava', ta: 'பாவம்', hi: 'भाव', kn: 'ಭಾವ', te: 'భావం', bn: 'ভাব' },
  thStartCusp: { en: 'Start', ta: 'ஆரம்பம்', hi: 'आरंभ', kn: 'ಆರಂಭ', te: 'ప్రారంభం', bn: 'আরম্ভ' },
  thMidCusp: { en: 'Mid (Cusp)', ta: 'மத்தியம் (Cusp)', hi: 'मध्य', kn: 'ಮಧ್ಯ', te: 'మధ్యం', bn: 'মধ্য' },
  thEndCusp: { en: 'End', ta: 'முடிவு', hi: 'समाप्ति', kn: 'ಮುಕ್ತಾಯ', te: 'ముగింపు', bn: 'সমাপ্তি' },
  thOccupants: { en: 'Occupants', ta: 'கிரகங்கள்', hi: 'स्थित ग्रह', kn: 'ಇರುವ ಗ್ರಹಗಳು', te: 'ఉన్న గ్రహాలు', bn: 'স্থিত গ্রহ' },
  // Tab 4
  panchangamTitle: { en: 'Panchangam Attributes', ta: 'பஞ்சாங்க விவரங்கள்', hi: 'पंचांग विवरण', kn: 'ಪಂಚಾಂಗ ವಿವರಗಳು', te: 'పంచాంగ వివరాలు', bn: 'পঞ্চাঙ্গ বিবরণ' },
  specialPointsTitle: { en: 'Yogi, Avayogi & Saptakarakas', ta: 'யோகி - அவயோகி & சப்த காரகங்கள்', hi: 'योगी, अवयोगी व सप्तकारक', kn: 'ಯೋಗಿ, ಅವಯೋಗಿ ಮತ್ತು ಸಪ್ತಕಾರಕಗಳು', te: 'యోగి, అవయోగి & సప్తకారకులు', bn: 'যোগী, অবযোগী ও সপ্তকারক' },
  lagnaLord: { en: 'Lagna Lord', ta: 'லக்கினாதிபதி', hi: 'लग्नेश', kn: 'ಲಗ್ನಾಧಿಪತಿ', te: 'లగ్నాధిపతి', bn: 'লগ্নেশ' },
  rasiLord: { en: 'Rasi Lord', ta: 'ராசி அதிபதி', hi: 'राशीश', kn: 'ರಾಶ್ಯಾಧಿಪತಿ', te: 'రాశ్యాధిపతి', bn: 'রাশীশ' },
  tithiLabel: { en: 'Tithi', ta: 'திதி', hi: 'तिथि', kn: 'ತಿಥಿ', te: 'తిథి', bn: 'তিথি' },
  yogaLabel: { en: 'Yoga', ta: 'யோகம்', hi: 'योग', kn: 'ಯೋಗ', te: 'యోగం', bn: 'যোগ' },
  karanaLabel: { en: 'Karana', ta: 'கரணம்', hi: 'करण', kn: 'ಕರಣ', te: 'కరణం', bn: 'করণ' },
  vaaraLabel: { en: 'Vaara (Day)', ta: 'வாரம்', hi: 'वार', kn: 'ವಾರ', te: 'వారం', bn: 'বার' },
  starLettersLabel: { en: 'Auspicious Letters', ta: 'நட்சத்திர பெயர் எழுத்து', hi: 'नक्षत्र नामाक्षर', kn: 'ನಕ್ಷತ್ರ ನಾಮಾಕ್ಷರ', te: 'నక్షత్ర నామాక్షరాలు', bn: 'নক্ষত্র নামাক্ষর' },
  yogiPlanetLabel: { en: 'Yogi Planet', ta: 'யோகி கிரகம்', hi: 'योगी ग्रह', kn: 'ಯೋಗಿ ಗ್ರಹ', te: 'యోగి గ్రహం', bn: 'যোগী গ্রহ' },
  anuYogiLabel: { en: 'Anu-Yogi', ta: 'அனுயோகி', hi: 'अनुयोगी', kn: 'ಅನುಯೋಗಿ', te: 'అనుయోగి', bn: 'অনুযোগী' },
  avayogiPlanetLabel: { en: 'Avayogi Planet', ta: 'அவயோகி கிரகம்', hi: 'अवयोगी ग्रह', kn: 'ಅವಯೋಗಿ ಗ್ರಹ', te: 'అవయోగి గ్రహం', bn: 'অবযোগী গ্রহ' },
  atmaKarakaLabel: { en: 'Atma Karaka (AK)', ta: 'ஆத்ம காரகன் (AK)', hi: 'आत्मकारक (AK)', kn: 'ಆತ್ಮಕಾರಕ (AK)', te: 'ఆత్మకారకుడు (AK)', bn: 'আত্মকারক (AK)' },
  amatyaKarakaLabel: { en: 'Amatya Karaka (AmK)', ta: 'அமத்ய காரகன் (AmK)', hi: 'अमात्यकारक (AmK)', kn: 'ಅಮಾತ್ಯಕಾರಕ (AmK)', te: 'అమాత్యకారకుడు (AmK)', bn: 'অমাত্যকারক (AmK)' },
  bhratruKarakaLabel: { en: 'Bhratru Karaka (BK)', ta: 'பத்ரு காரகன் (BK)', hi: 'भ्रातृकारक (BK)', kn: 'ಭ್ರಾತೃಕಾರಕ (BK)', te: 'భ్రాతృకారకుడు (BK)', bn: 'ভ্রাতৃকারক (BK)' },
  matruKarakaLabel: { en: 'Matru Karaka (MK)', ta: 'மாத்ரு காரகன் (MK)', hi: 'मातृकारक (MK)', kn: 'ಮಾತೃಕಾರಕ (MK)', te: 'మాతృకారకుడు (MK)', bn: 'মাতৃকারক (MK)' },
  putraKarakaLabel: { en: 'Putra Karaka (PK)', ta: 'புத்ர காரகன் (PK)', hi: 'पुत्रकारक (PK)', kn: 'ಪುತ್ರಕಾರಕ (PK)', te: 'పుత్రకారకుడు (PK)', bn: 'পুত্রকারক (PK)' },
  bhriguBinduLabel: { en: 'Bhrigu Bindu', ta: 'பிருகு பிந்து', hi: 'भृगु बिंदु', kn: 'ಭೃಗು ಬಿಂದು', te: 'భృగు బిందువు', bn: 'ভৃগু বিন্দু' },
  luckyPointLabel: { en: 'Lucky Point (Fortuna)', ta: 'அதிர்ஷ்ட புள்ளி (Fortuna)', hi: 'भाग्य बिंदु (Fortuna)', kn: 'ಅದೃಷ್ಟ ಬಿಂದು (ಫಾರ್ಚೂನಾ)', te: 'అదృష్ట బిందువు (ఫార్చూనా)', bn: 'ভাগ্য বিন্দু (ফরচুনা)' },
  // Tab 5
  vargasTitle: { en: 'Shodashavarga Divisional Charts (D1 to D60)', ta: 'ஷோடசவர்க்க சக்கரங்கள் (D1 to D60)', hi: 'षोडशवर्ग कुण्डलियाँ (D1 से D60)', kn: 'ಷೋಡಶವರ್ಗ ಕುಂಡಲಿಗಳು (D1 ರಿಂದ D60)', te: 'షోడశవర్గ చక్రాలు (D1 నుండి D60)', bn: 'ষোড়শবর্গ চক্র (D1 হতে D60)' },
  vargasSub: { en: 'Select any varga to view the authentic South Indian chart.', ta: 'தேவையான வர்க்கத்தை தேர்வு செய்து பாரம்பரிய தென்னிந்திய அமைப்பில் கட்டங்களை காண்க.', hi: 'प्रामाणिक दक्षिण भारतीय शैली में वर्ग कुण्डली देखने हेतु चयन करें।', kn: 'ದಕ್ಷಿಣ ಭಾರತೀಯ ಶೈಲಿಯಲ್ಲಿ ವರ್ಗ ಕುಂಡಲಿ ವೀಕ್ಷಿಸಲು ಆಯ್ಕೆಮಾಡಿ.', te: 'దక్షిణ భారత శైలిలో వర్గ చక్రాన్ని చూడటానికి ఎంచుకోండి.', bn: 'দক্ষিণ ভারতীয় শৈলীতে বর্গ চক্র দেখার জন্য নির্বাচন করুন।' },
  // Tab 6
  shadbalaTitle: { en: '6-Fold Shadbala Planetary Strength Matrix', ta: 'ஷட்பலம் (6-Fold Planetary Strength Matrix)', hi: 'षड्बल - षड्विध ग्रह बल सारणी', kn: 'ಷಡ್ಬಲ - ಆರು ವಿಧದ ಗ್ರಹ ಬಲ ಕೋಷ್ಟಕ', te: 'షడ్బలం - ఆరు విధాల గ్రహ బల పట్టిక', bn: 'ষড়বল - ছয় প্রকার গ্রহ বল সারণী' },
  reqStrength: { en: 'Req: 390 Virupas', ta: 'தேவையான பலம்: 390 விரூபா', hi: 'अपेक्षित: 390 विरूपा', kn: 'ಅಗತ್ಯ: 390 ವಿರೂಪಾ', te: 'అవసరం: 390 విరూపాలు', bn: 'প্রয়োজনীয়: ৩৯০ বিরূপা' },
  thRank: { en: 'Planet Strength Order', ta: 'கிரக பல வரிசை', hi: 'ग्रह बल क्रम', kn: 'ಗ್ರಹ ಬಲ ಶ್ರೇಣಿ', te: 'గ్రహ బల క్రమం', bn: 'গ্রহ বল ক্রম' },
  sthanaBala: { en: 'Sthana Bala (Positional)', ta: 'மொத்த ஸ்தான பலம்', hi: 'स्थान बल', kn: 'ಸ್ಥಾನ ಬಲ', te: 'స్థాన ಬలం', bn: 'স্থান বল' },
  dikBala: { en: 'Dig Bala (Directional)', ta: 'மொத்த திக் பலம்', hi: 'दिग् बल', kn: 'ದಿಗ್ ಬಲ', te: 'దిగ్బలం', bn: 'দিগ্বল' },
  kalaBala: { en: 'Kala Bala (Temporal)', ta: 'மொத்த கால பலம்', hi: 'काल बल', kn: 'ಕಾಲ ಬಲ', te: 'కాల బలం', bn: 'কাল বল' },
  chestaBala: { en: 'Chesta Bala (Motional)', ta: 'மொத்த சேஷ்ட பலம்', hi: 'चेष्टा बल', kn: 'ಚೇಷ್ಟಾ ಬಲ', te: 'చేష్టా బలం', bn: 'চেষ্টা বল' },
  naisargikaBala: { en: 'Naisargika Bala (Natural)', ta: 'மொத்த நைசர்கிக பலம்', hi: 'नैसर्गिक बल', kn: 'ನೈಸರ್ಗಿಕ ಬಲ', te: 'నైసర్గిక బలం', bn: 'নৈসর্গিক বল' },
  drikBala: { en: 'Drik Bala (Aspectual)', ta: 'மொத்த திருக் பலம்', hi: 'दृग् बल', kn: 'ದೃಗ್ ಬಲ', te: 'దృగ్బలం', bn: 'দৃগ্বল' },
  totalShadbala: { en: 'Total Shadbala (Virupas)', ta: 'மொத்த ஷட்பலம் (விரூபா)', hi: 'कुल षड्बल (विरूपा)', kn: 'ಒಟ್ಟು ಷಡ್ಬಲ (ವಿರೂಪಾ)', te: 'మొత్తం షడ్బలం (విరూపాలు)', bn: 'মোট ষড়বল (বিরূপা)' },
  rupaBala: { en: 'Strength in Rupas', ta: 'ரூபாவில் பலம்', hi: 'रूपा में बल', kn: 'ರೂಪಾದಲ್ಲಿ ಬಲ', te: 'రూపాలలో బలం', bn: 'রূপায় বল' },
  rankLabel: { en: 'Planetary Rank', ta: 'கிரக வரிசை எண்', hi: 'ग्रह रैंक', kn: 'ಗ್ರಹ ಶ್ರೇಣಿ', te: 'గ్రహ ర్యాంక్', bn: 'গ্রহ স্থান' },
  ashtakaTitle: { en: 'Sarvashtakavarga 337 Bindus Summary', ta: 'அஷ்டகவர்க்கம் (337 பிந்துக்கள்)', hi: 'सर्वाष्टकवर्ग 337 बिंदु सारांश', kn: 'ಸರ್ವಾಷ್ಟಕವರ್ಗ 337 ಬಿಂದುಗಳು', te: 'సర్వాష్టకవర్గ 337 బిందువులు', bn: 'সর্বাষ্টকবর্গ ৩৩৭ বিন্দু সারাংশ' },
  totalBindusBadge: { en: 'Total: 337 Bindus', ta: 'மொத்தம்: 337 பிந்துக்கள்', hi: 'कुल: 337 बिंदु', kn: 'ಒಟ್ಟು: 337 ಬಿಂದುಗಳು', te: 'మొత్తం: 337 బిందువులు', bn: 'মোট: ৩৩৭ বিন্দু' },
  // Tab 7
  yogasTitle: { en: 'Evaluated Vedic Yogas', ta: 'ஜாதகத்தில் உள்ள சிறப்பு யோகங்கள்', hi: 'कुण्डली में उपस्थित विशिष्ट योग', kn: 'ಜಾತಕದಲ್ಲಿರುವ ವಿಶಿಷ್ಟ ಯೋಗಗಳು', te: 'జాతకంలోని విశిష్ట యోగాలు', bn: 'জন্মে উপস্থিত বিশিষ্ট যোগ' },
  sahamsTitle: { en: 'Tajika 35 Sensitive Points (Sahams)', ta: 'தாஜிக முறை 35 சஹம்கள் அட்டவணை', hi: 'ताजिक 35 संवेदनशील बिंदु (सहम)', kn: 'ತಾಜಿಕ 35 ಸೂಕ್ಷ್ಮ ಬಿಂದುಗಳು (ಸಹಮ್)', te: 'తాజిక 35 సున్నిత బిందువులు (సహమ్‌లు)', bn: 'তাজিক ৩৫ সংবেদনশীল বিন্দু (সহম)' },
  sahamsSub: { en: '35 sensitive points calculated with exact classical formulas.', ta: 'சூத்திரங்களின்படி துல்லியமாக கணிக்கப்பட்ட 35 தாஜிக சஹம் புள்ளிகள்.', hi: 'सटीक शास्त्रीय सूत्रों द्वारा गणित 35 ताजिक सहम बिंदु।', kn: 'ಶಾಸ್ತ್ರೀಯ ಸೂತ್ರಗಳಂತೆ ಗಣಿಸಲಾದ 35 ತಾಜಿಕ ಸಹಮ್ ಬಿಂದುಗಳು.', te: 'శాస్త్రీయ సూత్రాల ప్రకారం లెక్కించిన 35 తాజిక సహమ్ బిందువులు.', bn: 'শাস্ত্রীয় সূত্রানুযায়ী গণিত ৩৫ তাজিক সহম বিন্দু।' },
  thSaham: { en: 'Saham Point', ta: 'சஹம்', hi: 'सहम', kn: 'ಸಹಮ', te: 'సహమం', bn: 'সহম' },
  thSignificance: { en: 'Significance', ta: 'குறிப்பது', hi: 'तात्पर्य / महत्व', kn: 'ಮಹತ್ವ', te: 'ప్రాముఖ్యత', bn: 'তাৎপর্য' },
  thFormula: { en: 'Formula', ta: 'சூத்திரம்', hi: 'सूत्र', kn: 'ಸೂತ್ರ', te: 'సూత్రం', bn: 'सूत्र' },
  thRasiDeg: { en: 'Rasi & Degree', ta: 'ராசி & பாகை', hi: 'राशि व अंश', kn: 'ರಾಶಿ & ಅಂಶ', te: 'రాశి & భాగం', bn: 'রাশি ও অংশ' }
};

const VARGA_NAMES = {
  D1: { en: 'D1 Rasi', ta: 'D1 ராசி', hi: 'D1 लग्न राशि', kn: 'D1 ರಾಶಿ', te: 'D1 రాశి', bn: 'D1 রাশি' },
  D2: { en: 'D2 Hora', ta: 'D2 ஹோரை', hi: 'D2 होरा', kn: 'D2 ಹೋರಾ', te: 'D2 హోర', bn: 'D2 হোরা' },
  D3: { en: 'D3 Drekkana', ta: 'D3 திரேக்காணம்', hi: 'D3 द्रेष्काण', kn: 'D3 ದ್ರೇಕ್ಕಾಣ', te: 'D3 ద్రేక్కాణ', bn: 'D3 দ্রেক্কাণ' },
  D4: { en: 'D4 Chaturthamsha', ta: 'D4 சதுர்தாம்சம்', hi: 'D4 चतुर्थांश', kn: 'D4 ಚತುರ್ಥಾಂಶ', te: 'D4 చతుర్థాంశ', bn: 'D4 চতুর্থাংশ' },
  D7: { en: 'D7 Saptamsha', ta: 'D7 சப்தாம்சம்', hi: 'D7 सप्तांश', kn: 'D7 ಸಪ್ತಾಂಶ', te: 'D7 సప్తాంశ', bn: 'D7 সপ্তাংশ' },
  D9: { en: 'D9 Navamsha', ta: 'D9 நவாம்சம்', hi: 'D9 नवांश', kn: 'D9 ನವಾಂಶ', te: 'D9 నవాంశ', bn: 'D9 নবাংশ' },
  D10: { en: 'D10 Dashamsha', ta: 'D10 தசாம்சம்', hi: 'D10 दशमांश', kn: 'D10 ದಶಮಾಂಶ', te: 'D10 దశమాంశ', bn: 'D10 দশমাংশ' },
  D12: { en: 'D12 Dvadashamsha', ta: 'D12 துவாதாம்சம்', hi: 'D12 द्वादशांश', kn: 'D12 ದ್ವಾದಶಾಂಶ', te: 'D12 ద్వాదశాంశ', bn: 'D12 দ্বাদশাংশ' },
  D60: { en: 'D60 Shashtiamsha', ta: 'D60 ஷஷ்டியாம்சம்', hi: 'D60 षष्ट्यंश', kn: 'D60 ಷಷ್ಟ್ಯಂಶ', te: 'D60 షష్ట్యంశ', bn: 'D60 ষষ্ঠ্যাংশ' }
};

const TITHI_NAMES = {
  chaturthi_shukla: {
    en: 'Shukla Chaturthi (4th Tithi)',
    ta: 'சுக்ல சதுர்த்தி (4-ஆம் திதி)',
    hi: 'शुक्ल चतुर्थी',
    kn: 'ಶುಕ್ಲ ಚತುರ್ಥಿ',
    te: 'శుక్ల చతుర్థి',
    bn: 'শুক্ল চতুর্থী'
  }
};

const YOGA_NAMES = {
  dhriti: {
    en: 'Dhriti Yoga',
    ta: 'திருதி யோகம்',
    hi: 'धृति योग',
    kn: 'ಧೃತಿ ಯೋಗ',
    te: 'ధృతి యోగం',
    bn: 'ধৃতি যোগ'
  }
};

const KARANA_NAMES = {
  vishti: {
    en: 'Vishti (Bhadra)',
    ta: 'பத்திரை (விஷ்டி)',
    hi: 'विष्टि (भद्रा)',
    kn: 'ವಿಷ್ಟಿ (ಭದ್ರಾ)',
    te: 'విష్టి (భద్ర)',
    bn: 'বিষ্টি (ভদ্রা)'
  }
};

const DIGNITY_MAP = {
  exalted: 'Exalted',
  debilitated: 'Debilitated',
  own: 'Own House',
  friendly: 'Friendly',
  neutral: 'Neutral',
  enemy: 'Enemy'
};

const PLANET_GLYPHS = {
  en: { lagna: 'Asc', sun: 'Su', moon: 'Mo', mars: 'Ma', mercury: 'Me', jupiter: 'Ju', venus: 'Ve', saturn: 'Sa', rahu: 'Ra', ketu: 'Ke', mandi: 'Md' },
  ta: { lagna: 'ல', sun: 'சூ', moon: 'சந்', mars: 'செ', mercury: 'புத', jupiter: 'வி', venus: 'சுக்', saturn: 'சனி', rahu: 'ரா', ketu: 'கே', mandi: 'மா' },
  hi: { lagna: 'लग्न', sun: 'सूर्य', moon: 'चन्द्र', mars: 'मंगल', mercury: 'बुध', jupiter: 'गुरु', venus: 'शुक्र', saturn: 'शनि', rahu: 'राहु', ketu: 'केतु', mandi: 'मांदी' },
  kn: { lagna: 'ಲಗ್ನ', sun: 'ಸೂರ್ಯ', moon: 'ಚಂದ್ರ', mars: 'ಮಂಗಳ', mercury: 'ಬುಧ', jupiter: 'ಗುರು', venus: 'ಶುಕ್ರ', saturn: 'ಶನಿ', rahu: 'ರಾಹು', ketu: 'ಕೇತು', mandi: 'ಮಾಂದಿ' },
  te: { lagna: 'లగ్నం', sun: 'సూర్యుడు', moon: 'చంద్రుడు', mars: 'కుజుడు', mercury: 'బుధుడు', jupiter: 'గురు', venus: 'శుక్రుడు', saturn: 'శని', rahu: 'రాహు', ketu: 'కేతు', mandi: 'మాంది' },
  bn: { lagna: 'লগ্ন', sun: 'সূর্য', moon: 'চন্দ্র', mars: 'মঙ্গল', mercury: 'বুধ', jupiter: 'বৃহস্পতি', venus: 'শুক্র', saturn: 'শনি', rahu: 'রাহু', ketu: 'কেতু', mandi: 'মান্দি' },
};

export default function DetailedHoroscopeScreen({ client, isEmbedded = false }) {
  const { lang, tr } = useLang();

  // Helper for safe translation lookup with English fallback
  const t = (item) => {
    if (!item) return '';
    return item[lang] || item.en || item.ta || '';
  };

  // Astrologer's client list
  const [clientList, setClientList] = useState([]);
  const [selectedClientMobile, setSelectedClientMobile] = useState(client?.mobile || '');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Active sub-tab (1 to 7)
  const [activeTab, setActiveTab] = useState('charts');
  const [activeVarga, setActiveVarga] = useState('D1');

  // Custom client form inputs
  const [formInput, setFormInput] = useState({
    name: client?.name || 'Sample',
    gender: client?.gender || 'male',
    dob: client?.dob || '2026-10-30',
    dobTime: client?.dobTime || client?.dobTime12 || '10:55:00',
    dobPlace: client?.dobPlace || client?.pob || client?.nativePlace || 'Hosur, Tamil Nadu, India',
    latitude: client?.latitude || "12° 44' N",
    longitude: client?.longitude || "77° 49' E",
    starBasis: client?.starBasis || 'moon'
  });

  // Load registered/referred clients for astrologer
  useEffect(() => {
    async function loadClients() {
      try {
        const res = await API.getReferredClients();
        if (res?.referredClients?.length > 0) {
          setClientList(res.referredClients);
          if (!client && !selectedClientMobile) {
            const first = res.referredClients[0];
            setSelectedClientMobile(first.mobile);
            setFormInput({
              name: first.name,
              gender: first.gender || 'male',
              dob: first.dob,
              dobTime: first.dobTime,
              dobPlace: first.dobPlace,
              latitude: first.latitude || "12° 44' N",
              longitude: first.longitude || "77° 49' E",
              starBasis: first.starBasis || 'moon'
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch referred clients list:', err);
      }
    }
    if (!isEmbedded) {
      loadClients();
    }
  }, [client, isEmbedded]);

  // If prop client changes, update inputs
  useEffect(() => {
    if (client) {
      if (client.mobile) setSelectedClientMobile(client.mobile);
      setFormInput(prev => ({
        ...prev,
        name: client.name !== undefined ? client.name : prev.name,
        gender: client.gender || prev.gender || 'male',
        dob: client.dob || prev.dob || '2026-10-30',
        dobTime: client.dobTime || client.dobTime12 || prev.dobTime || '10:55:00',
        dobPlace: client.dobPlace || client.pob || client.nativePlace || prev.dobPlace || 'Hosur, Tamil Nadu, India',
        latitude: client.latitude || prev.latitude || "12° 44' N",
        longitude: client.longitude || prev.longitude || "77° 49' E",
        starBasis: client.starBasis || prev.starBasis || 'moon'
      }));
    }
  }, [
    client?.name,
    client?.dob,
    client?.dobTime,
    client?.dobTime12,
    client?.dobPlace,
    client?.pob,
    client?.nativePlace,
    client?.gender,
    client?.latitude,
    client?.longitude,
    client?.starBasis
  ]);

  const handleSelectClient = (mobile) => {
    setSelectedClientMobile(mobile);
    const found = clientList.find((c) => c.mobile === mobile);
    if (found) {
      setFormInput({
        name: found.name,
        gender: found.gender || 'male',
        dob: found.dob,
        dobTime: found.dobTime,
        dobPlace: found.dobPlace,
        latitude: found.latitude || '12°43\'30"N',
        longitude: found.longitude || '77°49\'30"E'
      });
      setShowCustomForm(false);
    }
  };

  // Compute the complete Thirukanitha Horoscope dataset dynamically
  const horoData = calculateNativeHoroscope(formInput);
  const {
    native,
    panchangam,
    specialPoints,
    planets,
    rasiBoxes,
    navamshaBoxes,
    dashaSchedule,
    bhavaCusps,
    bhavaChalitBoxes,
    bhavaBalas,
    shadbalaMatrix,
    ashtakavargaSummary,
    yogas,
    sahams
  } = horoData;

  const lagnaSignIndex = planets.find((p) => p.isLagna)?.signIndex ?? 2;
  const navamshaLagnaIndex = planets.find((p) => p.isLagna)?.navSignIndex ?? 9;

  // Localized formatting helpers
  const getDashaBalanceStr = () => {
    const lordName = HORO_I18N.planets[native.balLordKey]?.[lang] || native.balLordKey;
    const yrsWord = t(HORO_SCREEN_I18N.yrs);
    const mosWord = t(HORO_SCREEN_I18N.mos);
    const dysWord = t(HORO_SCREEN_I18N.dys);
    return `${lordName}: ${native.balYears} ${yrsWord} ${native.balMonths} ${mosWord} ${native.balDays} ${dysWord}`;
  };

  const getAgeStr = () => {
    const yrsWord = t(HORO_SCREEN_I18N.yrs);
    const mosWord = t(HORO_SCREEN_I18N.mos);
    const dysWord = t(HORO_SCREEN_I18N.dys);
    return `${native.ageYears} ${yrsWord} ${native.ageMonths} ${mosWord} ${native.ageDays} ${dysWord}`;
  };

  const getUdayathiStr = () => {
    const nUnit = t(HORO_SCREEN_I18N.nazhikaiUnit);
    const vUnit = t(HORO_SCREEN_I18N.vinazhikaiUnit);
    return `${native.ghatis} ${nUnit} : ${native.vighatis} ${vUnit}`;
  };

  const getDignityName = (dignityKey) => {
    const mapped = DIGNITY_MAP[dignityKey] || 'Neutral';
    return HORO_I18N.dignities[mapped]?.[lang] || mapped;
  };

  return (
    <div id="printable-detailed-horoscope-screen" className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-4 print:p-0">
      {/* 1. Header with Classical Drik Nirayana Engine Title */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden print:bg-white print:text-slate-900 print:shadow-none print:border-b-2 print:border-emerald-800">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8 text-9xl">
          ☸
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 text-xl backdrop-blur-xs border border-emerald-400/30">
                🕉️
              </span>
              <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full border border-emerald-400/30">
                {t(HORO_SCREEN_I18N.badge)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              {t(HORO_SCREEN_I18N.screenTitle)}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 font-medium max-w-2xl">
              {t(HORO_SCREEN_I18N.screenSubtitle)}
            </p>
          </div>

          {/* Action Buttons: Native Details Form & Print */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-emerald-300" />
              <span>{showCustomForm ? t(HORO_SCREEN_I18N.closeForm) : t(HORO_SCREEN_I18N.editDetails)}</span>
            </button>
            <button
              onClick={() => printElementById('printable-detailed-horoscope-screen', `Detailed_Horoscope_${native?.name || 'Screen'}`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>{t(HORO_SCREEN_I18N.printExport)}</span>
            </button>
          </div>
        </div>

        {/* Client Selection Bar (Astrologer Mode) */}
        {clientList.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs print:hidden">
            <span className="font-bold text-emerald-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{t(HORO_SCREEN_I18N.selectClient)}</span>
            </span>
            <select
              value={selectedClientMobile}
              onChange={(e) => handleSelectClient(e.target.value)}
              className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg border border-emerald-500/40 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              {clientList.map((c) => (
                <option key={c.mobile || c.id} value={c.mobile} className="bg-slate-900 text-white">
                  {c.name} {c.clientCode ? `(${c.clientCode})` : ''} - {c.dob} ({c.dobPlace || 'N/A'})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-emerald-300/70">
              ({clientList.length} {t(HORO_SCREEN_I18N.registeredProfiles)})
            </span>
          </div>
        )}
      </div>

      {/* 2. Custom Client Input Drawer / Form */}
      {showCustomForm && (
        <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-200 print:hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>{t(HORO_SCREEN_I18N.formTitle)}</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              {t(HORO_SCREEN_I18N.realtimeCalc)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.name)}
              </label>
              <input
                type="text"
                value={formInput.name}
                onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.gender)}
              </label>
              <select
                value={formInput.gender}
                onChange={(e) => setFormInput({ ...formInput, gender: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="male">{t(HORO_SCREEN_I18N.male)}</option>
                <option value="female">{t(HORO_SCREEN_I18N.female)}</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.dob)}
              </label>
              <input
                type="date"
                value={formInput.dob}
                onChange={(e) => setFormInput({ ...formInput, dob: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.tob)}
              </label>
              <input
                type="text"
                value={formInput.dobTime}
                onChange={(e) => setFormInput({ ...formInput, dobTime: e.target.value })}
                placeholder="10:55:00 AM"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.pob)}
              </label>
              <input
                type="text"
                value={formInput.dobPlace}
                onChange={(e) => setFormInput({ ...formInput, dobPlace: e.target.value })}
                placeholder="Hosur, Tamil Nadu, India"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.lat)}
              </label>
              <input
                type="text"
                value={formInput.latitude}
                onChange={(e) => setFormInput({ ...formInput, latitude: e.target.value })}
                placeholder="12°43'30''N"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t(HORO_SCREEN_I18N.lon)}
              </label>
              <input
                type="text"
                value={formInput.longitude}
                onChange={(e) => setFormInput({ ...formInput, longitude: e.target.value })}
                placeholder="77°49'30''E"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowCustomForm(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t(HORO_SCREEN_I18N.calculateBtn)}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Native Info Card */}
      <div className="bg-white border border-emerald-900/15 rounded-2xl p-5 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {t(HORO_SCREEN_I18N.nativeInfoTitle)}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <span>{t(HORO_SCREEN_I18N.name)}: {native.name}</span>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200 capitalize">
                {native.genderRaw === 'female' ? t(HORO_SCREEN_I18N.female) : t(HORO_SCREEN_I18N.male)}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg">
              {t(HORO_SCREEN_I18N.dashaBalLabel)} <strong>{getDashaBalanceStr()}</strong>
            </span>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 px-3 py-1 rounded-lg">
              {t(HORO_SCREEN_I18N.currAgeLabel)} <strong>{getAgeStr()}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block">{t(HORO_SCREEN_I18N.dobTobLabel)}</span>
            <span className="font-bold text-slate-800">{native.dob} {native.time}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t(HORO_SCREEN_I18N.placeLabel)}</span>
            <span className="font-bold text-slate-800">{native.place}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t(HORO_SCREEN_I18N.coordsLabel)}</span>
            <span className="font-bold text-slate-800">{native.latitude}, {native.longitude}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t(HORO_SCREEN_I18N.udayathiLabel)}</span>
            <span className="font-bold text-slate-800">{getUdayathiStr()}</span>
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none whitespace-nowrap print:hidden">
        {[
          { id: 'charts', label: t(HORO_SCREEN_I18N.tabs.charts), icon: Compass },
          { id: 'dasha', label: t(HORO_SCREEN_I18N.tabs.dasha), icon: Calendar },
          { id: 'bhava', label: t(HORO_SCREEN_I18N.tabs.bhava), icon: BarChart3 },
          { id: 'panchangam', label: t(HORO_SCREEN_I18N.tabs.panchangam), icon: Star },
          { id: 'vargas', label: t(HORO_SCREEN_I18N.tabs.vargas), icon: Layers },
          { id: 'shadbala', label: t(HORO_SCREEN_I18N.tabs.shadbala), icon: Award },
          { id: 'yogas', label: t(HORO_SCREEN_I18N.tabs.yogas), icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CHARTS & PLANETARY POSITIONS */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Rasi Chart (D1) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <ThirukanithaChart
                title={t(HORO_SCREEN_I18N.rasiChart)}
                subtitle={`${t(HORO_SCREEN_I18N.ascendant)}: ${HORO_I18N.rashis[lagnaSignIndex]?.[lang] || ''}`}
                planetsBySign={rasiBoxes}
                lagnaSignIndex={lagnaSignIndex}
                centerContent={
                  <div className="space-y-1 relative z-10 text-center">
                    <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                      {HORO_I18N.charts.rashi?.[lang] || 'Rasi'}
                    </h3>
                    <p className="text-xs font-extrabold text-amber-900">
                      {HORO_I18N.nakshatras[panchangam.starIndex]?.[lang] || ''} / {t(HORO_SCREEN_I18N.thBhava)} {panchangam.pada}
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">
                      {native.dob} {native.time}
                    </p>
                    <div className="pt-1 border-t border-emerald-600/30 text-[9px] text-slate-500 font-mono">
                      <span>{native.longitude}</span>
                      <br />
                      <span>{native.latitude}</span>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Navamsha Chart (D9) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <ThirukanithaChart
                title={t(HORO_SCREEN_I18N.navamshaChart)}
                subtitle={`${t(HORO_SCREEN_I18N.navamshaAsc)}: ${HORO_I18N.rashis[navamshaLagnaIndex]?.[lang] || ''}`}
                planetsBySign={navamshaBoxes}
                lagnaSignIndex={navamshaLagnaIndex}
                centerContent={
                  <div className="space-y-1 relative z-10 text-center">
                    <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                      {HORO_I18N.charts.navamsha?.[lang] || 'Navamsha'}
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-800">
                      Astrojit Vedic Engine
                    </p>
                    <div className="pt-1.5 border-t border-emerald-600/30 text-[9px] text-slate-600 font-medium space-y-0.5">
                      <p>{t(HORO_SCREEN_I18N.dashaBalLabel)} <strong className="text-slate-900">{getDashaBalanceStr()}</strong></p>
                      <p>{t(HORO_SCREEN_I18N.currAgeLabel)} <strong className="text-slate-900">{getAgeStr()}</strong></p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Planetary Longitudes & Speed Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t(HORO_SCREEN_I18N.tableTitleLong)}</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                {t(HORO_SCREEN_I18N.badge)}
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-xs text-left">
                <thead className="bg-emerald-50/70 text-emerald-950 font-black text-[11px] border-b border-emerald-100 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thPlanet)}</th>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thRasi)}</th>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thStar)}</th>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thLong)}</th>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thSpeed)}</th>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thStarLord)}</th>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thDignity)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {planets.map((p) => {
                    const localizedPlanetName = HORO_I18N.planets[p.key]?.[lang] || p.name;
                    const localizedGlyph = PLANET_GLYPHS[lang]?.[p.key] || p.glyph;
                    const localizedRasi = HORO_I18N.rashis[p.signIndex]?.[lang] || p.rasi;
                    const localizedStar = `${HORO_I18N.nakshatras[p.starIndex]?.[lang] || ''} / ${p.pada}`;
                    const localizedStarLord = HORO_I18N.planets[p.starLordKey]?.[lang] || p.starLord;
                    const localizedDignity = getDignityName(p.dignityKey);
                    const isPositive = p.dignityKey === 'exalted' || p.dignityKey === 'own';
                    const isNegative = p.dignityKey === 'debilitated' || p.dignityKey === 'enemy';

                    return (
                      <tr key={p.key} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded flex items-center justify-center font-black text-xs ${p.isLagna ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-800'}`}>
                            {localizedGlyph}
                          </span>
                          <span>{localizedPlanetName}</span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{localizedRasi}</td>
                        <td className="py-2 px-3 text-slate-600">{localizedStar}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{p.degFormatted}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{p.speed}</td>
                        <td className="py-2 px-3 text-slate-600">{localizedStarLord}</td>
                        <td className="py-2 px-3 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            isPositive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            isNegative ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {localizedDignity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIMSHOTTARI DASHA-BHUKTI */}
      {activeTab === 'dasha' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {t(HORO_SCREEN_I18N.dashaTitle)}
              </h3>
              <p className="text-xs text-slate-500">
                {t(HORO_SCREEN_I18N.dashaSub)}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
              {t(HORO_SCREEN_I18N.currentBadge)} {HORO_I18N.planets.jupiter?.[lang] || 'Jupiter'} - {HORO_I18N.planets.saturn?.[lang] || 'Saturn'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {dashaSchedule.map((dasha, idx) => {
              const localizedLord = HORO_I18N.planets[dasha.lordKey]?.[lang] || dasha.lord;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className={dasha.color}>{localizedLord}</span>
                      <span className="text-slate-500 font-normal">
                        - {t(HORO_SCREEN_I18N.dashaPeriodLabel)} ({dasha.years} {t(HORO_SCREEN_I18N.yearsSuffix)})
                      </span>
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    <span>{dasha.startDate} {t(HORO_SCREEN_I18N.fromWord)} {dasha.endDate} {t(HORO_SCREEN_I18N.toWord)}</span>
                  </div>
                  <div className="overflow-x-auto max-h-48 scrollbar-none">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9px]">
                        <tr>
                          <th className="p-1">{t(HORO_SCREEN_I18N.thDasha)}</th>
                          <th className="p-1">{t(HORO_SCREEN_I18N.thBhukti)}</th>
                          <th className="p-1">{t(HORO_SCREEN_I18N.thStart)}</th>
                          <th className="p-1">{t(HORO_SCREEN_I18N.thEnd)}</th>
                          <th className="p-1">{t(HORO_SCREEN_I18N.thAge)}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {dasha.bhuktis.map((b, bIdx) => (
                          <tr key={bIdx} className="hover:bg-emerald-50/60">
                            <td className="p-1 font-semibold">{HORO_I18N.planets[b.dashaKey]?.[lang] || b.dasha}</td>
                            <td className="p-1 font-bold text-emerald-900">{HORO_I18N.planets[b.bhuktiKey]?.[lang] || b.bhukti}</td>
                            <td className="p-1 font-mono text-[10px]">{b.start}</td>
                            <td className="p-1 font-mono text-[10px]">{b.end}</td>
                            <td className="p-1 text-[10px] text-slate-500">
                              {b.ageY} {t(HORO_SCREEN_I18N.yrs)} {b.ageM} {t(HORO_SCREEN_I18N.mos)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BHAVA CHALIT & BHAVA BALA */}
      {activeTab === 'bhava' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Bhava Chalit Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <ThirukanithaChart
                title={t(HORO_SCREEN_I18N.bhavaChalitChart)}
                subtitle={t(HORO_SCREEN_I18N.bhavaChalitSub)}
                planetsBySign={bhavaChalitBoxes}
                lagnaSignIndex={lagnaSignIndex}
                centerContent={
                  <div className="space-y-1 relative z-10 text-center">
                    <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                      {t(HORO_SCREEN_I18N.bhavaChalitChart)}
                    </h3>
                    <p className="text-[10px] text-slate-600 font-medium">
                      Astrojit Vedic Engine
                    </p>
                  </div>
                }
              />
            </div>

            {/* Bhava Bala Strengths Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {t(HORO_SCREEN_I18N.bhavaBalaTitle)}
                </h3>
                <p className="text-xs text-slate-500">
                  {t(HORO_SCREEN_I18N.bhavaBalaSub)}
                </p>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 items-end h-52 pt-4 px-2 border-b border-slate-200">
                {bhavaBalas.map((bb, bIdx) => {
                  const heightPercent = Math.min(100, Math.round((bb.value / 700) * 100));
                  const rasiName = HORO_I18N.rashis[bb.signIndex]?.[lang] || '';
                  return (
                    <div key={bIdx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[9px] font-bold text-slate-600 group-hover:text-emerald-700">
                        {bb.value}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-sm shadow-xs transition-all group-hover:brightness-110"
                        title={`${rasiName}: ${bb.value}`}
                      />
                      <span className="text-[9px] font-bold text-slate-500 truncate w-full text-center">
                        {rasiName.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 text-center italic">
                Values in Virupas (Standard Sripati Bhava Balas)
              </p>
            </div>
          </div>

          {/* 12 Bhava Cusps Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs overflow-hidden">
            <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100 mb-3">
              {t(HORO_SCREEN_I18N.bhavaCuspsTitle)}
            </h3>
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-xs text-left">
                <thead className="bg-emerald-50 text-emerald-950 font-black text-[11px] border-b border-emerald-100 uppercase">
                  <tr>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thBhava)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thRasi)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thStartCusp)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thMidCusp)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thEndCusp)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thOccupants)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {bhavaCusps.map((b) => {
                    const rasiName = HORO_I18N.rashis[b.bhavaSignIndex]?.[lang] || '';
                    const occStr = b.occupantKeys.length === 0
                      ? '—'
                      : b.occupantKeys.map(k => HORO_I18N.planets[k]?.[lang] || HORO_I18N.planets[k === 'mandi' ? 'maandi' : k]?.[lang] || k).join(', ');
                    return (
                      <tr key={b.bhava} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">{t(HORO_SCREEN_I18N.thBhava)} {b.bhava}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{rasiName}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{b.start}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{b.mid}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{b.end}</td>
                        <td className="py-2 px-3 font-bold text-indigo-900">{occStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PANCHANGAM & SPECIAL POINTS */}
      {activeTab === 'panchangam' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panchangam Attributes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              {t(HORO_SCREEN_I18N.panchangamTitle)}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.ascendant)}</span>
                <span className="font-bold text-slate-800">{HORO_I18N.rashis[panchangam.lagnaSignIndex]?.[lang] || ''}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.lagnaLord)}</span>
                <span className="font-bold text-slate-800">{HORO_I18N.planets[RASHI_LORD_KEYS[panchangam.lagnaSignIndex]]?.[lang] || ''}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.thRasi)}</span>
                <span className="font-bold text-slate-800">{HORO_I18N.rashis[panchangam.rasiSignIndex]?.[lang] || ''}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.rasiLord)}</span>
                <span className="font-bold text-slate-800">{HORO_I18N.planets[RASHI_LORD_KEYS[panchangam.rasiSignIndex]]?.[lang] || ''}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.thStar)}</span>
                <span className="font-bold text-slate-800">
                  {HORO_I18N.nakshatras[panchangam.starIndex]?.[lang] || ''} / {t(HORO_SCREEN_I18N.thBhava)} {panchangam.pada}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.tithiLabel)}</span>
                <span className="font-bold text-slate-800">{TITHI_NAMES[panchangam.tithiKey]?.[lang] || panchangam.tithiKey}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.yogaLabel)}</span>
                <span className="font-bold text-slate-800">{YOGA_NAMES[panchangam.yogaKey]?.[lang] || panchangam.yogaKey}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.karanaLabel)}</span>
                <span className="font-bold text-slate-800">{KARANA_NAMES[panchangam.karanaKey]?.[lang] || panchangam.karanaKey}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.vaaraLabel)}</span>
                <span className="font-bold text-slate-800">{HORO_I18N.weekdays.Friday?.[lang] || 'Friday'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.starLettersLabel)}</span>
                <span className="font-bold text-slate-800">{panchangam.starLetters}</span>
              </div>
            </div>
          </div>

          {/* Special Points: Yogi, Avayogi, Karakas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              {t(HORO_SCREEN_I18N.specialPointsTitle)}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-emerald-700 block text-[10px] font-bold">{t(HORO_SCREEN_I18N.yogiPlanetLabel)}</span>
                <span className="font-extrabold text-emerald-950">
                  {HORO_I18N.planets[specialPoints.yogiPlanetKey]?.[lang] || specialPoints.yogiPlanetKey} ({specialPoints.yogiPoint})
                </span>
              </div>
              <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-100">
                <span className="text-teal-700 block text-[10px] font-bold">{t(HORO_SCREEN_I18N.anuYogiLabel)}</span>
                <span className="font-extrabold text-teal-950">
                  {HORO_I18N.planets[specialPoints.anuYogiKey]?.[lang] || specialPoints.anuYogiKey}
                </span>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                <span className="text-rose-700 block text-[10px] font-bold">{t(HORO_SCREEN_I18N.avayogiPlanetLabel)}</span>
                <span className="font-extrabold text-rose-950">
                  {HORO_I18N.planets[specialPoints.avayogiPlanetKey]?.[lang] || specialPoints.avayogiPlanetKey} ({specialPoints.avayogiPoint})
                </span>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <span className="text-indigo-700 block text-[10px] font-bold">{t(HORO_SCREEN_I18N.atmaKarakaLabel)}</span>
                <span className="font-extrabold text-indigo-950">
                  {HORO_I18N.planets[specialPoints.atmaKarakaKey]?.[lang] || specialPoints.atmaKarakaKey}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.amatyaKarakaLabel)}</span>
                <span className="font-bold text-slate-800">
                  {HORO_I18N.planets[specialPoints.amatyaKarakaKey]?.[lang] || specialPoints.amatyaKarakaKey}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.bhratruKarakaLabel)}</span>
                <span className="font-bold text-slate-800">
                  {HORO_I18N.planets[specialPoints.bhratruKarakaKey]?.[lang] || specialPoints.bhratruKarakaKey}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.matruKarakaLabel)}</span>
                <span className="font-bold text-slate-800">
                  {HORO_I18N.planets[specialPoints.matruKarakaKey]?.[lang] || specialPoints.matruKarakaKey}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px]">{t(HORO_SCREEN_I18N.putraKarakaLabel)}</span>
                <span className="font-bold text-slate-800">
                  {HORO_I18N.planets[specialPoints.putraKarakaKey]?.[lang] || specialPoints.putraKarakaKey}
                </span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-amber-800 block text-[10px] font-bold">{t(HORO_SCREEN_I18N.bhriguBinduLabel)}</span>
                <span className="font-extrabold text-amber-950">
                  {HORO_I18N.rashis[specialPoints.bhriguSignIndex]?.[lang] || ''} ({specialPoints.bhriguDegFormatted})
                </span>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-blue-800 block text-[10px] font-bold">{t(HORO_SCREEN_I18N.luckyPointLabel)}</span>
                <span className="font-extrabold text-blue-950">
                  {HORO_I18N.rashis[specialPoints.fortunaSignIndex]?.[lang] || ''} ({specialPoints.fortunaDegFormatted})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DIVISIONAL CHARTS (D1 TO D60) */}
      {activeTab === 'vargas' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">
              {t(HORO_SCREEN_I18N.vargasTitle)}
            </h3>
            <p className="text-xs text-slate-500">
              {t(HORO_SCREEN_I18N.vargasSub)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'D1' },
              { id: 'D2' },
              { id: 'D3' },
              { id: 'D4' },
              { id: 'D7' },
              { id: 'D9' },
              { id: 'D10' },
              { id: 'D12' },
              { id: 'D60' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVarga(v.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeVarga === v.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {VARGA_NAMES[v.id]?.[lang] || v.id}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto pt-4">
            <ThirukanithaChart
              title={VARGA_NAMES[activeVarga]?.[lang] || activeVarga}
              planetsBySign={activeVarga === 'D9' ? navamshaBoxes : rasiBoxes}
              lagnaSignIndex={activeVarga === 'D9' ? navamshaLagnaIndex : lagnaSignIndex}
            />
          </div>
        </div>
      )}

      {/* TAB 6: SHADBALA & ASHTAKAVARGA */}
      {activeTab === 'shadbala' && (
        <div className="space-y-6">
          {/* 6-Fold Shadbala Strength Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                {t(HORO_SCREEN_I18N.shadbalaTitle)}
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                {t(HORO_SCREEN_I18N.reqStrength)}
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-xs text-left">
                <thead className="bg-emerald-50 text-emerald-950 font-black text-[11px] border-b border-emerald-100">
                  <tr>
                    <th className="py-2.5 px-3">{t(HORO_SCREEN_I18N.thRank)}</th>
                    {shadbalaMatrix.planets.map((p) => (
                      <th key={p.key} className="py-2.5 px-3">
                        {HORO_I18N.planets[p.key]?.[lang] || p.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{t(HORO_SCREEN_I18N.sthanaBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.sthana.toFixed(2)}</td>)}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{t(HORO_SCREEN_I18N.dikBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.dik.toFixed(2)}</td>)}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{t(HORO_SCREEN_I18N.kalaBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.kaala.toFixed(2)}</td>)}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{t(HORO_SCREEN_I18N.chestaBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.cheshta.toFixed(2)}</td>)}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{t(HORO_SCREEN_I18N.naisargikaBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.naisargika.toFixed(2)}</td>)}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{t(HORO_SCREEN_I18N.drikBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.drik.toFixed(2)}</td>)}
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                    <td className="py-2.5 px-3 font-sans font-black">{t(HORO_SCREEN_I18N.totalShadbala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2.5 px-3 font-black">{p.total.toFixed(2)}</td>)}
                  </tr>
                  <tr className="bg-amber-50/70 font-bold text-amber-950">
                    <td className="py-2 px-3 font-sans">{t(HORO_SCREEN_I18N.rupaBala)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">{p.rupa.toFixed(2)}</td>)}
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-800">
                    <td className="py-2 px-3 font-sans">{t(HORO_SCREEN_I18N.rankLabel)}</td>
                    {shadbalaMatrix.planets.map((p) => <td key={p.key} className="py-2 px-3">#{p.rank}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ashtakavarga 337 Bindus */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                {t(HORO_SCREEN_I18N.ashtakaTitle)}
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {t(HORO_SCREEN_I18N.totalBindusBadge)}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
              {ashtakavargaSummary.bindusBySign.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {HORO_I18N.rashis[s.signIndex]?.[lang] || ''}
                  </span>
                  <span className="text-base font-extrabold text-slate-800">{s.bindus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: YOGAS & 35 SAHAMS */}
      {activeTab === 'yogas' && (
        <div className="space-y-6">
          {/* Evaluated Vedic Yogas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-2 border-b border-slate-100">
              {t(HORO_SCREEN_I18N.yogasTitle)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {yogas.map((y, idx) => {
                const langCapitalized = lang.charAt(0).toUpperCase() + lang.slice(1);
                const yogaName = y[`name${langCapitalized}`] || y.nameEn || y.nameTa;
                const yogaDesc = y[`desc${langCapitalized}`] || y.descEn || y.descTa;

                // Localized planet tags for yoga
                const planetTag = y.planetsKey
                  .split('_')
                  .map(k => HORO_I18N.planets[k]?.[lang] || k)
                  .join(' + ');

                return (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-emerald-950">{yogaName}</h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {planetTag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{yogaDesc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 35 Tajika Sahams Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                {t(HORO_SCREEN_I18N.sahamsTitle)}
              </h3>
              <p className="text-xs text-slate-500">
                {t(HORO_SCREEN_I18N.sahamsSub)}
              </p>
            </div>

            <div className="overflow-x-auto max-h-96 scrollbar-none">
              <table className="w-full text-xs text-left">
                <thead className="bg-emerald-50 text-emerald-950 font-black text-[11px] border-b border-emerald-100 uppercase sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thSaham)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thSignificance)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thFormula)}</th>
                    <th className="py-2 px-3">{t(HORO_SCREEN_I18N.thRasiDeg)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {sahams.map((s) => {
                    const langCapitalized = lang.charAt(0).toUpperCase() + lang.slice(1);
                    const sahamName = s[`name${langCapitalized}`] || s.nameEn || s.nameTa;
                    const sahamSig = s[`significance${langCapitalized}`] || s.significanceEn || s.significanceTa;
                    const rasiName = HORO_I18N.rashis[s.signIndex]?.[lang] || '';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-400">{s.id}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{sahamName}</td>
                        <td className="py-2 px-3 text-slate-600">{sahamSig}</td>
                        <td className="py-2 px-3 font-mono text-[10px] text-slate-500">{s.formula}</td>
                        <td className="py-2 px-3 font-bold text-emerald-900 font-mono text-[11px]">
                          {rasiName} ({s.degFormatted})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
