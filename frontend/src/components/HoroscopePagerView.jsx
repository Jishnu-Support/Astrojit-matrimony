import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer,
  Eraser,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Languages,
  RotateCcw,
  Check,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Building,
  User,
  Heart,
  Home,
  BookOpen,
  FileText,
  ExternalLink
} from 'lucide-react';
import {
  createEmptyHoroscopePagerData,
  computeHoroscopePagerData,
  PLANET_ROW_KEYS,
  RASHIS
} from '../utils/thirukanithaEngine';
import { COUNTRIES, GEO_DATA, lookupCoordinates } from '../data/geoCoordinates';
import { useAuth } from '../context/AuthContext';
import { API } from '../api';

function parseInitialTime(timeStr) {
  let raw = timeStr || '21:04:00';
  let isPM = /pm/i.test(raw);
  let isAM = /am/i.test(raw);
  let clean = raw.replace(/[^\d:]/g, '');
  let [hStr = '21', mStr = '04', sStr = '00'] = clean.split(':');
  let hNum = parseInt(hStr, 10) || 0;
  let mNum = parseInt(mStr, 10) || 0;
  let sNum = parseInt(sStr, 10) || 0;

  let period = 'AM';
  let hour12 = hNum;

  if (isPM) {
    period = 'PM';
    if (hour12 > 12) hour12 -= 12;
    if (hour12 === 0) hour12 = 12;
  } else if (isAM) {
    period = 'AM';
    if (hour12 === 0) hour12 = 12;
    if (hour12 > 12) hour12 -= 12;
  } else {
    if (hNum >= 12) {
      period = 'PM';
      hour12 = hNum === 12 ? 12 : hNum - 12;
    } else {
      period = 'AM';
      hour12 = hNum === 0 ? 12 : hNum;
    }
  }

  return {
    hour: String(hour12).padStart(2, '0'),
    minute: String(mNum).padStart(2, '0'),
    second: String(sNum).padStart(2, '0'),
    period
  };
}

const HOURS_12 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// 12 Sign positions clockwise:
// Row 0: Pisces (11), Aries (0), Taurus (1), Gemini (2)
// Row 1: Aquarius (10), Cancer (3)
// Row 2: Capricorn (9), Leo (4)
// Row 3: Sagittarius (8), Scorpio (7), Libra (6), Virgo (5)
const CHART_SIGN_NAMES_TA = [
  'மீனம் (Pisces)', 'மேஷம் (Aries)', 'ரிஷபம் (Taurus)', 'மிதுனம் (Gemini)',
  'கடகம் (Cancer)', 'சிம்மம் (Leo)', 'கன்னி (Virgo)', 'துலாம் (Libra)',
  'விருச்சிகம் (Scorpio)', 'தனுசு (Sagittarius)', 'மகரம் (Capricorn)', 'கும்பம் (Aquarius)'
];

const SIGN_INDEX_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SIGN_LABELS_MAP = {
  11: { ta: 'மீனம்', en: 'Pisces', num: 12 },
  0: { ta: 'மேஷம்', en: 'Aries', num: 1 },
  1: { ta: 'ரிஷபம்', en: 'Taurus', num: 2 },
  2: { ta: 'மிதுனம்', en: 'Gemini', num: 3 },
  3: { ta: 'கடகம்', en: 'Cancer', num: 4 },
  4: { ta: 'சிம்மம்', en: 'Leo', num: 5 },
  5: { ta: 'கன்னி', en: 'Virgo', num: 6 },
  6: { ta: 'துலாம்', en: 'Libra', num: 7 },
  7: { ta: 'விருச்சிகம்', en: 'Scorpio', num: 8 },
  8: { ta: 'தனுசு', en: 'Sagittarius', num: 9 },
  9: { ta: 'மகரம்', en: 'Capricorn', num: 10 },
  10: { ta: 'கும்பம்', en: 'Aquarius', num: 11 }
};

export default function HoroscopePagerView({ initialBirthData, astrologerProfile, onClose }) {
  const { user, setUser } = useAuth();
  const effectiveProfile = astrologerProfile || user?.pagerHeader || user;
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [headerSavedMsg, setHeaderSavedMsg] = useState('');
  const [lang, setLang] = useState('ta'); // 'ta' or 'en'
  const isTa = lang === 'ta';
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const isDark = theme === 'dark';

  // Ensure documentElement reflects light theme by default
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Selected Country / State / City state for hierarchical picker
  const [selectedCountry, setSelectedCountry] = useState(initialBirthData?.country || 'India');
  const [selectedState, setSelectedState] = useState(initialBirthData?.state || 'Tamil Nadu');
  const [selectedCity, setSelectedCity] = useState(initialBirthData?.city || initialBirthData?.placeName || 'Namakkal');
  const [citySearch, setCitySearch] = useState('');

  // 12-hour AM/PM time state
  const [timeState, setTimeState] = useState(() =>
    parseInitialTime(initialBirthData?.dobTime12 || initialBirthData?.dobTime || '04:50:00')
  );

  // Input form state for Thirukanitha calculation, initialized directly from above-entered details
  const [calcInputs, setCalcInputs] = useState(() => ({
    name: initialBirthData?.name || '',
    gender: initialBirthData?.gender || 'male',
    dob: initialBirthData?.dob || '',
    dobTime: initialBirthData?.dobTime || '',
    dobTime12: initialBirthData?.dobTime12 || '',
    country: initialBirthData?.country || 'India',
    state: initialBirthData?.state || 'Tamil Nadu',
    placeName: initialBirthData?.placeName || initialBirthData?.city || 'Salem',
    city: initialBirthData?.city || 'Salem',
    lat: initialBirthData?.lat !== undefined ? initialBirthData.lat : 11.6643,
    lon: initialBirthData?.lon !== undefined ? initialBirthData.lon : 78.1460,
    utcOffset: initialBirthData?.utcOffset !== undefined ? initialBirthData.utcOffset : '05:30 UTC',
    father: initialBirthData?.father !== undefined ? initialBirthData.father : '',
    mother: initialBirthData?.mother !== undefined ? initialBirthData.mother : '',
    nativePlace: initialBirthData?.nativePlace !== undefined ? initialBirthData.nativePlace : ''
  }));

  // Initial computed data for authentic 1-page Janana Jathagam A4 sheet
  const [data, setData] = useState(() => computeHoroscopePagerData(calcInputs, effectiveProfile));
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('person');
  const [calcSuccessMsg, setCalcSuccessMsg] = useState('');

  // Automatically recalculate whenever above-entered details (initialBirthData) change
  useEffect(() => {
    if (initialBirthData) {
      const updatedInputs = {
        name: initialBirthData.name || '',
        gender: initialBirthData.gender || 'male',
        dob: initialBirthData.dob || '',
        dobTime: initialBirthData.dobTime || '',
        dobTime12: initialBirthData.dobTime12 || '',
        country: initialBirthData.country || 'India',
        state: initialBirthData.state || 'Tamil Nadu',
        placeName: initialBirthData.placeName || initialBirthData.city || 'Salem',
        city: initialBirthData.city || 'Salem',
        lat: initialBirthData.lat !== undefined ? initialBirthData.lat : 11.6643,
        lon: initialBirthData.lon !== undefined ? initialBirthData.lon : 78.1460,
        utcOffset: initialBirthData.utcOffset || '05:30 UTC',
        father: initialBirthData.father !== undefined ? initialBirthData.father : '',
        mother: initialBirthData.mother !== undefined ? initialBirthData.mother : '',
        nativePlace: initialBirthData.nativePlace !== undefined ? initialBirthData.nativePlace : ''
      };
      setCalcInputs(updatedInputs);
      setData(computeHoroscopePagerData(updatedInputs, effectiveProfile));
    }
  }, [initialBirthData]);

  // Cascading place options
  // Sync profile header changes directly into 1-pager
  useEffect(() => {
    const prof = astrologerProfile || user?.pagerHeader || user;
    if (prof) {
      const h = prof.pagerHeader || prof;
      if (h.line1 || h.line2 || h.address1 || h.phoneEmail) {
        setData(prev => ({
          ...prev,
          header: {
            line1: h.line1 || prev.header.line1,
            line2: h.line2 || prev.header.line2,
            address1: h.address1 || prev.header.address1,
            address2: h.address2 !== undefined ? h.address2 : prev.header.address2,
            phoneEmail: h.phoneEmail || prev.header.phoneEmail
          }
        }));
      }
    }
  }, [user, astrologerProfile]);

  const handleSaveHeaderToProfile = async () => {
    try {
      setIsSavingHeader(true);
      const res = await API.updateUserProfile({
        pagerHeader: {
          line1: data.header.line1,
          line2: data.header.line2,
          address1: data.header.address1,
          address2: data.header.address2,
          phoneEmail: data.header.phoneEmail
        }
      });
      if (res?.user && setUser) {
        setUser(res.user);
      }
      setHeaderSavedMsg(isTa ? 'சுயவிவரத்தில் வெற்றிகரமாக சேமிக்கப்பட்டது!' : 'Saved to profile successfully!');
      setTimeout(() => setHeaderSavedMsg(''), 3000);
    } catch (err) {
      alert((isTa ? 'சேமிக்க முடியவில்லை: ' : 'Failed to save: ') + err.message);
    } finally {
      setIsSavingHeader(false);
    }
  };

  const availableStates = useMemo(() => {
    return Object.keys(GEO_DATA[selectedCountry] || {});
  }, [selectedCountry]);

  const availableCities = useMemo(() => {
    return GEO_DATA[selectedCountry]?.[selectedState] || [];
  }, [selectedCountry, selectedState]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return availableCities;
    const q = citySearch.toLowerCase();
    return availableCities.filter(c => c.name.toLowerCase().includes(q));
  }, [availableCities, citySearch]);

  const applySelection = (cntry, st, cty) => {
    const cityList = GEO_DATA[cntry]?.[st] || [];
    const cityObj = cityList.find(c => c.name.toLowerCase() === cty.toLowerCase());

    let lat = 11.65;
    let lon = 78.20;
    let tz = '05:30 UTC';

    if (cityObj) {
      lat = cityObj.latDec;
      lon = cityObj.lonDec;
      if (cityObj.tz) {
        const rawTz = cityObj.tz.trim();
        tz = `${rawTz.startsWith('+') ? rawTz.slice(1) : rawTz} UTC`;
      }
    }

    setCalcInputs(prev => ({
      ...prev,
      country: cntry,
      state: st,
      placeName: cty,
      city: cty,
      lat,
      lon,
      utcOffset: tz,
      nativePlace: prev.nativePlace || cty
    }));
  };

  const handleCountryChange = (e) => {
    const cName = e.target.value;
    setSelectedCountry(cName);
    setCitySearch('');
    const countryObj = COUNTRIES.find(c => c.name === cName);
    const avStates = Object.keys(GEO_DATA[cName] || {});
    const newState = countryObj?.defaultState || avStates[0] || '';
    setSelectedState(newState);

    const avCities = GEO_DATA[cName]?.[newState] || [];
    const newCity = countryObj?.defaultCity || avCities[0]?.name || '';
    setSelectedCity(newCity);

    applySelection(cName, newState, newCity);
  };

  const handleStateChange = (e) => {
    const sName = e.target.value;
    setSelectedState(sName);
    setCitySearch('');
    const avCities = GEO_DATA[selectedCountry]?.[sName] || [];
    const newCity = avCities[0]?.name || '';
    setSelectedCity(newCity);

    applySelection(selectedCountry, sName, newCity);
  };

  const handleCityChange = (e) => {
    const cty = e.target.value;
    setSelectedCity(cty);
    applySelection(selectedCountry, selectedState, cty);
  };

  const updateTimeField = (field, val) => {
    const nextTime = { ...timeState, [field]: val };
    setTimeState(nextTime);

    let hNum = parseInt(nextTime.hour, 10) || 12;
    let h24 = hNum % 12;
    if (nextTime.period === 'PM') h24 += 12;

    const time24Str = `${String(h24).padStart(2, '0')}:${nextTime.minute}:${nextTime.second}`;
    const time12Str = `${nextTime.hour}:${nextTime.minute}:${nextTime.second} ${nextTime.period}`;

    setCalcInputs(prev => ({
      ...prev,
      dobTime: time24Str,
      dobTime12: time12Str
    }));
  };

  // Trigger calculation and populate 1-page Janana Jathagam sheet
  const handleCalculatePager = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const computed = computeHoroscopePagerData(calcInputs);
    setData(computed);
    setCalcSuccessMsg(isTa ? 'ஜாதகக் கணிப்பு வெற்றிகரமாக கணிக்கப்பெற்று தயார்!' : 'Horoscope generated successfully!');
    setTimeout(() => setCalcSuccessMsg(''), 4000);
  };

  // Auto-calculate on input changes so Janana Jathagam sheet is always reactive and up to date
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setData(computeHoroscopePagerData(calcInputs));
      } catch (err) {
        console.error('Auto-calculation error:', err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [calcInputs]);

  // Handle nested updates for 1-page sheet
  const updateField = (section, key, val) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: val
      }
    }));
  };

  const updatePlanetRow = (index, field, val) => {
    setData(prev => {
      const rows = [...prev.planetRows];
      rows[index] = { ...rows[index], [field]: val };
      return { ...prev, planetRows: rows };
    });
  };

  const updateChartCell = (chartKey, signIndex, val) => {
    setData(prev => {
      const chart = [...prev.charts[chartKey]];
      chart[signIndex] = val;
      return {
        ...prev,
        charts: {
          ...prev.charts,
          [chartKey]: chart
        }
      };
    });
  };

  const handleClearAll = () => {
    if (window.confirm(isTa ? 'அனைத்து விவரங்களையும் அழிக்கவா?' : 'Clear all fields to blank?')) {
      setData(createEmptyHoroscopePagerData());
    }
  };

  const handleAutoFillFromThirukanitha = () => {
    setData(computeHoroscopePagerData(calcInputs));
  };

  const handlePrint = () => {
    window.print();
  };

  // Fixed Labels Dictionary for Tamil / English toggle
  const L = {
    title: isTa ? 'ஜாதக ஏடு (A4 - 1 பக்கம்)' : 'Horoscope Pagers (1-Page A4 Sheet)',
    appTitle: isTa ? 'ஜனன ஜாதகம்' : 'JANANA JATHAGAM',
    headingPlanetTable: isTa
      ? 'துல்லியமான நிராயன கிரக நிலைகள் ( திருக்கணிதம் )'
      : 'ACCURATE NIRAYANA PLANETARY POSITIONS (THIRUKANITHA)',
    rasiChartCenter: isTa ? 'ராசி' : 'RASI',
    navamsaChartCenter: isTa ? 'நவாம்சம்' : 'NAVAMSA',
    footerNotice: isTa
      ? 'இது சுத்த திருக்கணித பஞ்சாங்கத்தின்படி மிகத்துல்லியமாக கணிக்கப்பெற்றது..'
      : 'Accurately computed according to authentic Shuddha Thirukanitha Drik Ganitha Panchangam..',

    // Left Column Labels
    father: isTa ? 'தந்தை' : 'Father',
    mother: isTa ? 'தாய்' : 'Mother',
    nativePlace: isTa ? 'சொந்த ஊர்' : 'Native Place',
    lagna: isTa ? 'லக்னம்' : 'Ascendant (Lagna)',
    rasi: isTa ? 'ராசி' : 'Moon Sign (Rasi)',
    nakshatra: isTa ? 'நட்சத்திரம்' : 'Birth Star (Nakshatra)',
    pakshaTithi: isTa ? 'பக்ஷம் & திதி' : 'Paksha & Tithi',
    yogaKarana: isTa ? 'யோகம்-கரணம்' : 'Yoga - Karana',
    ayanam: isTa ? 'அயனம்' : 'Ayanam',
    hora: isTa ? 'நட்சத்திர ஹோரை' : 'Nakshatra Hora',
    ayanamsha: isTa ? 'அயனாம்சம்' : 'Ayanamsha (Lahiri)',
    lmtCorr: isTa ? 'சுதேச நேரத்திருத்தம்' : 'Local Mean Time Corr',

    // Right Column Labels
    dateWeekday: isTa ? 'பிறந்த தேதி (D.O.B)' : 'Date of Birth (D.O.B)',
    time: isTa ? 'நேரம்' : 'Birth Time',
    tamilDate: isTa ? 'தமிழ் தேதி' : 'Tamil Date',
    udayadiNazhigai: isTa ? 'உதயாதி நாழிகை' : 'Udayadi Nazhigai',
    country: isTa ? 'நாடு' : 'Country',
    place: isTa ? 'இடம்' : 'Place of Birth',
    latLon: isTa ? 'அட்ச தீர்க்க ரேகை' : 'Lat & Long',
    stdTimeCorr: isTa ? 'பொது நேரம் திருத்தம்' : 'Std Timezone (UTC)',
    sunriseSunset: isTa ? 'சூரிய (பிம்ப மத்தி) sunrise/sunset' : 'Sunrise / Sunset (Center)',
    yogiAvayogi: isTa ? 'யோகி-அவயோகி' : 'Yogi - Avayogi',
    nakshatraSyllables: isTa ? 'நக்ஷத்திர எழுத்துக்கள்' : 'Nakshatra Letters',
    age: isTa ? 'வயது (Age)' : 'Age',
    subhar: isTa ? 'சுபர்கள்' : 'Benefics (Subhar)',
    asubhar: isTa ? 'அசுபர்கள்' : 'Malefics (Asubhar)',
    lagnagathipathi: isTa ? 'லக்னாதிபதி' : 'Lagna Lord',
    bhagayathipathi: isTa ? 'பாக்யாதிபதி' : 'Bhagya Lord (9th)',
    bhathagathipathi: isTa ? 'பாதகாதிபதி' : 'Badhaka Lord',

    // Table Headers
    thPlanet: isTa ? 'கிரகம்' : 'Planet',
    thDegMin: isTa ? 'பாகை-கலை' : 'Deg-Min',
    thNakshatra: isTa ? 'நட்சத்திரம்' : 'Star',
    thPada: isTa ? 'பாதம்' : 'Pada',
    thLord: isTa ? 'நட்-அதிபதி' : 'Star Lord',
    thRasi: isTa ? 'ராசி' : 'Sign',
    thDegInSign: isTa ? 'பாகை-கலை' : 'Deg-Min',
    thState: isTa ? 'நிலை' : 'State',

    // Footer Labels
    dashaBalance: isTa ? 'திசை இருப்பு:' : 'Dasha Balance at Birth:',
    currentDasha: isTa ? 'நடப்பு திசை / புக்தி:' : 'Current Dasha / Bhukti:',
    bhavaTransitions: isTa ? 'பாவக மாறுதல்:' : 'Bhava Transitions:',
    bhodhagar: isTa ? 'போதகர்:' : 'Bhodhagar:',
    vedhagar: isTa ? 'வேதகர்:' : 'Vedhagar:',
    pasagar: isTa ? 'பாசகர்:' : 'Pasagar:',
    karagar: isTa ? 'காரகர்:' : 'Karagar:',
    luckyNumbers: isTa ? 'அதிர்ஷ்ட எண்கள்:' : 'Lucky Numbers:'
  };

  // Helper to render South Indian 4x4 Grid
  const renderSouthIndianGrid = (chartCells, centerLabel) => {
    // 4x4 layout mapping to our 12 clockwise signs
    // row 0: Pisces(0), Aries(1), Taurus(2), Gemini(3)
    // row 1: Aquarius(11), center, center, Cancer(4)
    // row 2: Capricorn(10), center, center, Leo(5)
    // row 3: Sagittarius(9), Scorpio(8), Libra(7), Virgo(6)
    const gridLayout = [
      [0, 1, 2, 3],
      [11, 'center', 'center', 4],
      [10, 'center', 'center', 5],
      [9, 8, 7, 6]
    ];

    return (
      <div className="relative border-2 border-black bg-[#FFFDF7] rounded-xs overflow-hidden shadow-xs" style={{ width: '100%', height: '220px' }}>
        <table className="w-full h-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <tbody>
            {gridLayout.map((row, rIdx) => (
              <tr key={rIdx} style={{ height: '25%' }}>
                {row.map((cellIdx, cIdx) => {
                  if (cellIdx === 'center') {
                    // Only render center cell once (spanning 2x2)
                    if (rIdx === 1 && cIdx === 1) {
                      return (
                        <td
                          key="center"
                          colSpan={2}
                          rowSpan={2}
                          className="border border-black p-0 text-center relative overflow-hidden"
                          style={{
                            background: 'radial-gradient(circle, #FFFDF5 30%, #F5E8C9 100%)'
                          }}
                        >
                          {/* Maroon and Gold Traditional Knotwork Decoration */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                            <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#7A1A22]">
                              <circle cx="50" cy="50" r="44" fill="none" stroke="#7A1A22" strokeWidth="2.5" />
                              <circle cx="50" cy="50" r="38" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,3" />
                              <rect x="25" y="25" width="50" height="50" fill="none" stroke="#7A1A22" strokeWidth="1.5" transform="rotate(45 50 50)" />
                              <circle cx="50" cy="50" r="28" fill="#FFFBE8" stroke="#B8860B" strokeWidth="1" />
                            </svg>
                          </div>
                          <div className="relative z-10 font-bold text-[#7A1A22] text-sm tracking-widest drop-shadow-xs">
                            {centerLabel}
                          </div>
                        </td>
                      );
                    }
                    return null; // spanned cell
                  }

                  const signIdx = cellIdx;
                  const signLabel = SIGN_LABELS_MAP[SIGN_INDEX_ORDER[signIdx]];
                  const content = chartCells[signIdx] || '';
                  const hasLagna = content.includes('1-லக்') || content.includes('லக்');

                  return (
                    <td
                      key={cIdx}
                      className="border border-black p-1 align-top relative"
                      style={{
                        background: 'radial-gradient(circle at center, #FFFDF8 0%, #FFFBEA 100%)',
                        // Diagonal line across top-left corner if Lagna marker is present
                        backgroundImage: hasLagna
                          ? 'linear-gradient(135deg, transparent 0px, transparent 15px, #000 15px, #000 16.5px, transparent 16.5px)'
                          : undefined
                      }}
                    >
                      <div className="flex justify-between items-center text-[8px] font-bold text-stone-500 leading-none mb-0.5">
                        <span className="truncate">{isTa ? signLabel.ta : signLabel.en}</span>
                        <span className="opacity-40 text-[7px]">{signLabel.num}</span>
                      </div>
                      <div className="text-[9px] font-bold text-black flex flex-wrap gap-1 leading-tight items-start content-start">
                        {content.split(',').map((pill, pIdx) => {
                          const trim = pill.trim();
                          if (!trim) return null;
                          const isLag = trim.includes('1-லக்') || trim.includes('லக்');
                          return (
                            <span
                              key={pIdx}
                              className={`inline-block px-1 py-0.2 rounded-xs font-mono font-bold ${
                                isLag ? 'bg-amber-200 text-[#7A1A22] border border-amber-400' : ''
                              }`}
                            >
                              {trim}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#181412] text-stone-100' : 'bg-[#FAF6EF] text-stone-900'} p-2 sm:p-5 font-serif transition-colors duration-200`}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* TOP CONTROL BAR (Screen Only - Hidden on Print) */}
        <div className="bg-white dark:bg-stone-900 border border-amber-900/15 dark:border-stone-800 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#7A1A22] dark:text-[#E8838B]">
                {L.title}
              </h1>
              <p className="text-[11px] text-stone-500">
                {isTa
                  ? 'A4 பக்கத்தில் அச்சிடக்கூடிய மாதிரி ஜாதக ஏடு (Janana Jathagam Printable Sheet)'
                  : 'Single-page A4 portrait printable Janana Jathagam template'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Toggle */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-300 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  isTa ? 'bg-[#7A1A22] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  !isTa ? 'bg-[#7A1A22] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                English
              </button>
            </div>

            {/* Clear All Button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Clear all fields to create a pristine blank sheet"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{isTa ? 'வெற்று ஏடு (Clear)' : 'Blank Sheet'}</span>
            </button>

            {/* Toggle Manual Edit Panel */}
            <button
              type="button"
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isEditorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{isEditorOpen ? (isTa ? 'திருத்தத்தை மறைக்க' : 'Hide Editor') : (isTa ? 'தனிப்பட்ட திருத்தங்கள்' : 'Manual Overrides')}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            >
              {isDark ? (isTa ? '☀️ பகல் முறை' : '☀️ Light') : (isTa ? '🌙 இரவு முறை' : '🌙 Dark')}
            </button>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-white text-xs font-bold hover:from-[#5C1017] hover:to-[#7A1A22] shadow-md shadow-red-950/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isTa ? 'அச்சு / PDF (1-A4)' : 'Save as PDF / Print (1-A4)'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* COLLAPSIBLE EDIT FORM (Screen Only - Hidden on Print) */}
        {isEditorOpen && (
          <div className="bg-white dark:bg-stone-900 border border-amber-900/15 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 no-print text-xs">
            {/* Editor Sub-Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2 pb-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveEditorTab('person')}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                  activeEditorTab === 'person' ? 'bg-[#7A1A22] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                {isTa ? '👤 ஜாதகர் விவரங்கள்' : '👤 Person Details'}
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('planets')}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                  activeEditorTab === 'planets' ? 'bg-[#7A1A22] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                {isTa ? '🪐 கிரக நிலைகள் அட்டவணை' : '🪐 Planet Table'}
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('charts')}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                  activeEditorTab === 'charts' ? 'bg-[#7A1A22] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                {isTa ? '📊 ராசி & நவாம்ச கட்டங்கள்' : '📊 Chart Cells'}
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('header')}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                  activeEditorTab === 'header' ? 'bg-[#7A1A22] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                {isTa ? '🏛️ தலைப்பு & முகவரி' : '🏛️ Header & Credits'}
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('footer')}
                className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                  activeEditorTab === 'footer' ? 'bg-[#7A1A22] text-white' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100'
                }`}
              >
                {isTa ? '📜 அடிப்பகுதி வரிகள்' : '📜 Footer Lines'}
              </button>
            </div>

            {/* TAB 1: Person Details */}
            {activeEditorTab === 'person' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{isTa ? 'பெயர்' : 'Full Name'}</label>
                    <input
                      type="text"
                      value={data.person.name}
                      onChange={e => updateField('person', 'name', e.target.value)}
                      placeholder={isTa ? 'பெயர் உள்ளிடவும்' : 'Enter Full Name'}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.father}</label>
                    <input
                      type="text"
                      value={data.person.father}
                      onChange={e => updateField('person', 'father', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.mother}</label>
                    <input
                      type="text"
                      value={data.person.mother}
                      onChange={e => updateField('person', 'mother', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.nativePlace}</label>
                    <input
                      type="text"
                      value={data.person.nativePlace}
                      onChange={e => updateField('person', 'nativePlace', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.lagna}</label>
                    <input
                      type="text"
                      value={data.person.lagna}
                      onChange={e => updateField('person', 'lagna', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.rasi} & Glyph</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={data.person.rasi}
                        onChange={e => updateField('person', 'rasi', e.target.value)}
                        className="w-3/4 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                      />
                      <input
                        type="text"
                        value={data.person.rasiGlyph}
                        onChange={e => updateField('person', 'rasiGlyph', e.target.value)}
                        placeholder="♍"
                        className="w-1/4 text-center bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.nakshatra} & {L.thPada}</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={data.person.nakshatra}
                        onChange={e => updateField('person', 'nakshatra', e.target.value)}
                        className="w-3/4 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                      />
                      <input
                        type="text"
                        value={data.person.pada}
                        onChange={e => updateField('person', 'pada', e.target.value)}
                        placeholder="3"
                        className="w-1/4 text-center bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.pakshaTithi}</label>
                    <input
                      type="text"
                      value={data.person.pakshaTithi}
                      onChange={e => updateField('person', 'pakshaTithi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.yogaKarana}</label>
                    <input
                      type="text"
                      value={data.person.yogaKarana}
                      onChange={e => updateField('person', 'yogaKarana', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.ayanam}</label>
                    <input
                      type="text"
                      value={data.person.ayanam}
                      onChange={e => updateField('person', 'ayanam', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.hora}</label>
                    <input
                      type="text"
                      value={data.person.hora}
                      onChange={e => updateField('person', 'hora', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.ayanamsha}</label>
                    <input
                      type="text"
                      value={data.person.ayanamsha}
                      onChange={e => updateField('person', 'ayanamsha', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.dateWeekday}</label>
                    <input
                      type="text"
                      value={data.person.dateWeekday}
                      onChange={e => updateField('person', 'dateWeekday', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-bold text-[#7A1A22]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.age}</label>
                    <input
                      type="text"
                      value={data.person.age || ''}
                      onChange={e => updateField('person', 'age', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.time}</label>
                    <input
                      type="text"
                      value={data.person.time}
                      onChange={e => updateField('person', 'time', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.tamilDate}</label>
                    <input
                      type="text"
                      value={typeof data.person.tamilDate === 'object' ? (data.person.tamilDate?.ta || '') : (data.person.tamilDate || '')}
                      onChange={e => updateField('person', 'tamilDate', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.udayadiNazhigai}</label>
                    <input
                      type="text"
                      value={data.person.udayadiNazhigai}
                      onChange={e => updateField('person', 'udayadiNazhigai', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.country}</label>
                    <input
                      type="text"
                      value={data.person.country}
                      onChange={e => updateField('person', 'country', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.place} (Line 1)</label>
                    <input
                      type="text"
                      value={data.person.placeLine1}
                      onChange={e => updateField('person', 'placeLine1', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.place} (Line 2 Larger)</label>
                    <input
                      type="text"
                      value={data.person.placeLine2}
                      onChange={e => updateField('person', 'placeLine2', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.latLon}</label>
                    <input
                      type="text"
                      value={data.person.latLon}
                      onChange={e => updateField('person', 'latLon', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.stdTimeCorr}</label>
                    <input
                      type="text"
                      value={data.person.stdTimeCorr}
                      onChange={e => updateField('person', 'stdTimeCorr', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.sunriseSunset}</label>
                    <input
                      type="text"
                      value={data.person.sunriseSunset}
                      onChange={e => updateField('person', 'sunriseSunset', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.yogiAvayogi}</label>
                    <input
                      type="text"
                      value={data.person.yogiAvayogi}
                      onChange={e => updateField('person', 'yogiAvayogi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.nakshatraSyllables}</label>
                    <input
                      type="text"
                      value={data.person.nakshatraSyllables || ''}
                      onChange={e => updateField('person', 'nakshatraSyllables', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.subhar}</label>
                    <input
                      type="text"
                      value={data.person.subhar || ''}
                      onChange={e => updateField('person', 'subhar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.asubhar}</label>
                    <input
                      type="text"
                      value={data.person.asubhar || ''}
                      onChange={e => updateField('person', 'asubhar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.lagnagathipathi}</label>
                    <input
                      type="text"
                      value={data.person.lagnagathipathi || ''}
                      onChange={e => updateField('person', 'lagnagathipathi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.bhagayathipathi}</label>
                    <input
                      type="text"
                      value={data.person.bhagayathipathi || ''}
                      onChange={e => updateField('person', 'bhagayathipathi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.bhathagathipathi}</label>
                    <input
                      type="text"
                      value={data.person.bhathagathipathi || ''}
                      onChange={e => updateField('person', 'bhathagathipathi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Planet Rows Editor */}
            {activeEditorTab === 'planets' && (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] border border-stone-200 dark:border-stone-700">
                  <thead className="bg-stone-100 dark:bg-stone-800 font-bold">
                    <tr>
                      <th className="p-1.5 text-left">{L.thPlanet}</th>
                      <th className="p-1.5">{L.thDegMin}</th>
                      <th className="p-1.5">{L.thNakshatra}</th>
                      <th className="p-1.5">{L.thPada}</th>
                      <th className="p-1.5">{L.thLord}</th>
                      <th className="p-1.5">{L.thRasi}</th>
                      <th className="p-1.5">{L.thDegInSign}</th>
                      <th className="p-1.5">{L.thState}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.planetRows.map((row, idx) => (
                      <tr key={idx} className="border-t border-stone-200 dark:border-stone-700">
                        <td className="p-1 font-bold whitespace-nowrap bg-stone-50 dark:bg-stone-800/50">
                          {row.planet}
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.degMin}
                            onChange={e => updatePlanetRow(idx, 'degMin', e.target.value)}
                            className="w-20 p-1 border rounded font-mono text-center"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.nakshatra}
                            onChange={e => updatePlanetRow(idx, 'nakshatra', e.target.value)}
                            className="w-24 p-1 border rounded text-center"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.pada}
                            onChange={e => updatePlanetRow(idx, 'pada', e.target.value)}
                            className="w-12 p-1 border rounded text-center font-bold"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.lord}
                            onChange={e => updatePlanetRow(idx, 'lord', e.target.value)}
                            className="w-20 p-1 border rounded text-center"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.rasi}
                            onChange={e => updatePlanetRow(idx, 'rasi', e.target.value)}
                            className="w-20 p-1 border rounded text-center"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.degInSign}
                            onChange={e => updatePlanetRow(idx, 'degInSign', e.target.value)}
                            className="w-20 p-1 border rounded font-mono text-center"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.state}
                            onChange={e => updatePlanetRow(idx, 'state', e.target.value)}
                            className="w-20 p-1 border rounded text-center font-bold"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Chart Cells Editor */}
            {activeEditorTab === 'charts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rasi Chart Editor */}
                <div className="border border-stone-200 dark:border-stone-700 rounded-xl p-3 bg-stone-50 dark:bg-stone-800/40">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-2">
                    {L.rasiChartCenter} {isTa ? 'கட்டங்கள் (12 ராசிகள்)' : 'Chart Cells'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CHART_SIGN_NAMES_TA.map((name, sIdx) => (
                      <div key={sIdx}>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5 truncate">{name}</label>
                        <input
                          type="text"
                          value={data.charts.rasi[sIdx] || ''}
                          onChange={e => updateChartCell('rasi', sIdx, e.target.value)}
                          placeholder="சூரி, சந், 1-லக்"
                          className="w-full p-1.5 border rounded text-xs font-bold font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navamsa Chart Editor */}
                <div className="border border-stone-200 dark:border-stone-700 rounded-xl p-3 bg-stone-50 dark:bg-stone-800/40">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-2">
                    {L.navamsaChartCenter} {isTa ? 'கட்டங்கள் (12 ராசிகள்)' : 'Chart Cells'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CHART_SIGN_NAMES_TA.map((name, sIdx) => (
                      <div key={sIdx}>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5 truncate">{name}</label>
                        <input
                          type="text"
                          value={data.charts.navamsa[sIdx] || ''}
                          onChange={e => updateChartCell('navamsa', sIdx, e.target.value)}
                          placeholder="சூரி, சந், 1-லக்"
                          className="w-full p-1.5 border rounded text-xs font-bold font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Header & Credits Editor */}
            {activeEditorTab === 'header' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'நிறுவனம் / ஜோதிடர் பெயர் (Line 1 Large)' : 'Company / Astrologer Name (Line 1 Large)'}</label>
                  <input
                    type="text"
                    value={data.header.line1}
                    onChange={e => updateField('header', 'line1', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'துணைத் தலைப்பு (Line 2)' : 'Subheading (Line 2)'}</label>
                  <input
                    type="text"
                    value={data.header.line2}
                    onChange={e => updateField('header', 'line2', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'முகவரி வரி 1' : 'Address Line 1'}</label>
                  <input
                    type="text"
                    value={data.header.address1}
                    onChange={e => updateField('header', 'address1', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'முகவரி வரி 2' : 'Address Line 2'}</label>
                  <input
                    type="text"
                    value={data.header.address2}
                    onChange={e => updateField('header', 'address2', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'தொலைபேசி / மின்னஞ்சல்' : 'Phone / Email Line'}</label>
                  <input
                    type="text"
                    value={data.header.phoneEmail}
                    onChange={e => updateField('header', 'phoneEmail', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 p-3 bg-amber-50/60 dark:bg-stone-900/60 border border-amber-900/15 dark:border-stone-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-[11px] text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-[#7A1A22] dark:text-amber-300">💡 {isTa ? 'சுயவிவர இணைப்பு:' : 'Profile Sync:'}</span> {isTa ? 'இங்கு மாற்றிய தலைப்பு & முகவரியை உங்கள் சுயவிவரத்தில் நிரந்தரமாக சேமிக்கலாம்.' : 'Save these header details directly to your astrologer profile for all future 1-pagers.'}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {headerSavedMsg && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span>✓</span>
                        <span>{headerSavedMsg}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={isSavingHeader}
                      onClick={handleSaveHeaderToProfile}
                      className="px-3.5 py-1.5 rounded-lg bg-[#7A1A22] text-amber-100 hover:bg-[#5f1319] text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>💾</span>
                      <span>{isSavingHeader ? (isTa ? 'சேமிக்கிறது...' : 'Saving...') : (isTa ? 'சுயவிவரத்தில் சேமிக்க' : 'Save Header to Profile')}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'மென்பொருள் கடன் வரி (Left)' : 'Software Credit Line (Left)'}</label>
                  <input
                    type="text"
                    value={data.credits.software}
                    onChange={e => updateField('credits', 'software', e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">{isTa ? 'துதிப் பாடல் (Invocation Verse - 2 Lines)' : 'Invocation Verse'}</label>
                  <input
                    type="text"
                    value={data.credits.verseLine1}
                    onChange={e => updateField('credits', 'verseLine1', e.target.value)}
                    placeholder="வரி 1"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={data.credits.verseLine2}
                    onChange={e => updateField('credits', 'verseLine2', e.target.value)}
                    placeholder="வரி 2"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: Footer Lines Editor */}
            {activeEditorTab === 'footer' && (
              <div className="space-y-3">
                <div>
                  <label className="block font-bold mb-1 opacity-80">{L.dashaBalance}</label>
                  <input
                    type="text"
                    value={data.footer.dashaBalance}
                    onChange={e => updateField('footer', 'dashaBalance', e.target.value)}
                    placeholder="e.g. சூரியன் இருப்பு 1 ஆண்டுகள் 8 மாதங்கள் 6 நாட்கள்"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">{L.currentDasha}</label>
                  <input
                    type="text"
                    value={data.footer.currentDasha}
                    onChange={e => updateField('footer', 'currentDasha', e.target.value)}
                    placeholder="e.g. நடப்பு சந்திரன் திசை 11-07-2034 வரை, குரு புத்தி 15-03-2028 வரை, சனி அந்தரம் 22-06-2027 வரை."
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">{L.bhavaTransitions}</label>
                  <input
                    type="text"
                    value={data.footer.bhavaTransitions || ''}
                    onChange={e => updateField('footer', 'bhavaTransitions', e.target.value)}
                    placeholder="e.g. லக்ன பாவக ஆரம்பம்: ரிஷபம் 22° 15′ | முடிவு: மிதுனம் 22° 15′"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.bhodhagar}</label>
                    <input
                      type="text"
                      value={data.footer.bhodhagar || ''}
                      onChange={e => updateField('footer', 'bhodhagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.vedhagar}</label>
                    <input
                      type="text"
                      value={data.footer.vedhagar || ''}
                      onChange={e => updateField('footer', 'vedhagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.pasagar}</label>
                    <input
                      type="text"
                      value={data.footer.pasagar || ''}
                      onChange={e => updateField('footer', 'pasagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.karagar}</label>
                    <input
                      type="text"
                      value={data.footer.karagar || ''}
                      onChange={e => updateField('footer', 'karagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1 opacity-80">{L.luckyNumbers}</label>
                  <input
                    type="text"
                    value={data.footer.luckyNumbers}
                    onChange={e => updateField('footer', 'luckyNumbers', e.target.value)}
                    placeholder="e.g. 1, 3, 5, 9 • அதிர்ஷ்ட நிறம்: பொன் மஞ்சள் • அதிர்ஷ்ட திசை: கிழக்கு"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* PRINTABLE 1-PAGE A4 JANANA JATHAGAM SHEET */}
        {/* ========================================================================= */}
        <div className="w-full overflow-x-auto touch-pan-x pb-4">
          <div
            id="janana-jathagam-sheet"
          className="bg-white text-black mx-auto shadow-2xl p-4 sm:p-6 print:p-0 print:shadow-none transition-all"
          style={{
            width: '100%',
            maxWidth: '190mm',
            minHeight: '265mm',
            boxSizing: 'border-box',
            fontFamily: isTa
              ? "'Noto Serif Tamil', 'Source Serif 4', Georgia, serif"
              : "'Source Serif 4', Georgia, serif"
          }}
        >
          {/* Thin double-line border around the whole page */}
          <div
            className="border-[3px] border-double border-black p-3 sm:p-4 flex flex-col justify-between"
            style={{
              minHeight: '265mm',
              boxSizing: 'border-box'
            }}
          >
            <div className="space-y-2">
              {/* 1. Header box, centred, thin border */}
              {(data.header.line1 || data.header.line2 || data.header.address1 || data.header.address2 || data.header.phoneEmail) ? (
                <div className="border border-black p-2 text-center rounded-xs space-y-0.5">
                  {data.header.line1 && (
                    <div className="text-base sm:text-lg font-black tracking-tight">
                      {data.header.line1}
                    </div>
                  )}
                  {data.header.line2 && (
                    <div className="text-xs font-bold">
                      {data.header.line2}
                    </div>
                  )}
                  {(data.header.address1 || data.header.address2) && (
                    <div className="text-[10px] text-stone-700 leading-tight">
                      {data.header.address1}{data.header.address1 && data.header.address2 ? ' • ' : ''}{data.header.address2}
                    </div>
                  )}
                  {data.header.phoneEmail && (
                    <div className="text-[9px] font-mono font-semibold text-stone-800">
                      {data.header.phoneEmail}
                    </div>
                  )}
                </div>
              ) : null}

              {/* 2. Software credit (left) & Invocation verse (center) */}
              <div className="flex justify-between items-center text-[9px] px-1" style={{ minHeight: '22px' }}>
                <div className="text-left font-mono opacity-80 w-1/4" style={{ minHeight: '12px' }}>
                  {data.credits.software || <span className="opacity-0">&nbsp;</span>}
                </div>
                <div className="text-center font-bold text-[#7A1A22] w-2/4 leading-tight">
                  <div>{(isTa ? data.credits.verseLine1 : (data.credits.verseLine1 === 'ஜனனீ ஜன்ம ஸௌக்யானாம் வர்த்தனீ குலஸம்பதாம்' ? 'Janani Janma Saukhyanam Vardhani Kulasampadam' : data.credits.verseLine1)) || <span className="opacity-0">&nbsp;</span>}</div>
                  <div>{(isTa ? data.credits.verseLine2 : (data.credits.verseLine2 === 'பதவீ பூர்வ புண்யானாம் லிக்யதே ஜன்ம பத்ரிகா.' ? 'Padavi Poorva Punyanam Likhyate Janma Patrika.' : data.credits.verseLine2)) || <span className="opacity-0">&nbsp;</span>}</div>
                </div>
                <div className="w-1/4 text-right opacity-0">&nbsp;</div>
              </div>

              <hr className="border-0 border-t border-black my-1" />

              {/* 3. Title "ஜனன ஜாதகம்" centred, Person's Name below on the left in larger type */}
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-black tracking-wide uppercase inline-block border-b-2 border-black pb-0.5">
                  {L.appTitle}
                </h2>
              </div>

              <div className="flex items-baseline justify-between px-1" style={{ minHeight: '26px' }}>
                <div className="text-sm sm:text-base font-black tracking-tight">
                  {data.person.name ? (
                    <span>{data.person.name}</span>
                  ) : (
                    <span className="opacity-0">&nbsp;</span>
                  )}
                </div>
                <div className="text-[10px] text-stone-600 font-mono">
                  {data.person.title || ''}
                </div>
              </div>

              {/* 4. Professional Two-Column Details Block (Astrological Systems on Left, Birth & Personal Details on Right) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px] sm:text-[9.5px] px-1 border-t border-stone-300 pt-1 leading-normal">
                {/* Left Column: Astrological & Panchangam System (15 lines) */}
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.lagna}</span><span className="mr-1">:</span><span className="font-bold text-[#7A1A22] truncate">{data.person.lagna || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.lagnagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.lagnagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex items-center"><span className="w-34 font-bold shrink-0">{L.rasi}</span><span className="mr-1">:</span><span className="font-bold truncate flex items-center gap-1">{data.person.rasi || <span className="opacity-0">&nbsp;</span>} <span className="text-xs">{data.person.rasiGlyph}</span></span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.nakshatra}</span><span className="mr-1">:</span><span className="font-bold truncate">{data.person.nakshatra ? `${data.person.nakshatra} பாதம் ${data.person.pada || ''}` : <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.nakshatraSyllables}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nakshatraSyllables || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.bhagayathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhagayathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.bhathagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhathagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.subhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.subhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.asubhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.asubhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.pakshaTithi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.pakshaTithi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.yogaKarana}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.yogaKarana || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.ayanam}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.ayanam || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.hora}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.hora || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.ayanamsha}</span><span className="mr-1">:</span><span className="font-mono font-bold truncate">{data.person.ayanamsha || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.lmtCorr}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.lmtCorr || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>

                {/* Right Column: Birth, Timing & Family Details (14 lines, D.O.B on top and Age right below) */}
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.dateWeekday}</span><span className="mr-1">:</span><span className="font-bold truncate text-[#7A1A22]">{data.person.dateWeekday || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.age}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.age || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.time}</span><span className="mr-1">:</span><span className="font-mono font-bold truncate">{data.person.time || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.tamilDate}</span><span className="mr-1">:</span><span className="font-semibold truncate">{(typeof data.person.tamilDate === 'object' ? (isTa ? data.person.tamilDate?.ta : data.person.tamilDate?.en) : data.person.tamilDate) || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.udayadiNazhigai}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.udayadiNazhigai || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.sunriseSunset}</span><span className="mr-1">:</span><span className="font-mono text-[9px] truncate">{data.person.sunriseSunset || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex flex-col"><div className="flex"><span className="w-36 font-bold shrink-0">{L.place}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.placeLine1 || <span className="opacity-0">&nbsp;</span>}</span></div>{data.person.placeLine2 && <div className="pl-38 text-xs font-black tracking-tight">{data.person.placeLine2}</div>}</div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.country}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.country || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.latLon}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.latLon || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.stdTimeCorr}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.stdTimeCorr || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.yogiAvayogi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.yogiAvayogi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.father}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.father || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.mother}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.mother || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.nativePlace}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nativePlace || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>
              </div>

              {/* 5. Rule, then centred heading "துல்லியமான நிராயன கிரக நிலைகள் ( திருக்கணிதம் )" */}
              <hr className="border-0 border-t border-black my-1" />
              <div className="text-center font-bold text-[10px] sm:text-[11px] tracking-wide text-black">
                {L.headingPlanetTable}
              </div>

              {/* 6. Planet Table (Header row with bottom border, no vertical lines) */}
              <div className="overflow-x-hidden">
                <table className="w-full border-collapse text-[9px] sm:text-[9.5px]">
                  <thead>
                    <tr className="border-b-2 border-black font-bold">
                      <th className="py-1 text-left">{L.thPlanet}</th>
                      <th className="py-1 text-center font-mono">{L.thDegMin}</th>
                      <th className="py-1 text-left">{L.thNakshatra}</th>
                      <th className="py-1 text-center">{L.thPada}</th>
                      <th className="py-1 text-left">{L.thLord}</th>
                      <th className="py-1 text-left">{L.thRasi}</th>
                      <th className="py-1 text-center font-mono">{L.thDegInSign}</th>
                      <th className="py-1 text-center">{L.thState}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.planetRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-stone-200" style={{ height: '15px' }}>
                        <td className="py-0.5 font-bold text-left">{row.planet}</td>
                        <td className="py-0.5 font-mono font-bold text-center">{row.degMin || <span className="opacity-0">&nbsp;</span>}</td>
                        <td className="py-0.5 text-left">{row.nakshatra || <span className="opacity-0">&nbsp;</span>}</td>
                        <td className="py-0.5 text-center font-bold">{row.pada || <span className="opacity-0">&nbsp;</span>}</td>
                        <td className="py-0.5 text-left">{row.lord || <span className="opacity-0">&nbsp;</span>}</td>
                        <td className="py-0.5 text-left">{row.rasi || <span className="opacity-0">&nbsp;</span>}</td>
                        <td className="py-0.5 font-mono font-bold text-center">{row.degInSign || <span className="opacity-0">&nbsp;</span>}</td>
                        <td className="py-0.5 text-center font-semibold">{row.state || <span className="opacity-0">&nbsp;</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 7. Two South Indian Charts Side by Side */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  {renderSouthIndianGrid(data.charts.rasi, L.rasiChartCenter)}
                </div>
                <div>
                  {renderSouthIndianGrid(data.charts.navamsa, L.navamsaChartCenter)}
                </div>
              </div>

              {/* 8. Footer text lines (bold Tamil, small) */}
              <div className="space-y-0.5 text-[9px] sm:text-[9.5px] pt-1">
                <div className="flex">
                  <span className="font-bold shrink-0 mr-1.5">{L.dashaBalance}</span>
                  <span className="font-semibold truncate">{data.footer.dashaBalance || <span className="opacity-0">&nbsp;</span>}</span>
                </div>
                <div className="flex">
                  <span className="font-bold shrink-0 mr-1.5">{L.currentDasha}</span>
                  <span className="font-semibold truncate">{data.footer.currentDasha || <span className="opacity-0">&nbsp;</span>}</span>
                </div>
                <div className="flex">
                  <span className="font-bold shrink-0 mr-1.5">{L.bhavaTransitions}</span>
                  <span className="font-semibold truncate">{data.footer.bhavaTransitions || <span className="opacity-0">&nbsp;</span>}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 text-[8.5px] sm:text-[9px]">
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.bhodhagar}</span><span className="font-semibold truncate">{data.footer.bhodhagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.vedhagar}</span><span className="font-semibold truncate">{data.footer.vedhagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.pasagar}</span><span className="font-semibold truncate">{data.footer.pasagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.karagar}</span><span className="font-semibold truncate">{data.footer.karagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>
                <div className="flex">
                  <span className="font-bold shrink-0 mr-1.5">{L.luckyNumbers}</span>
                  <span className="font-semibold truncate">{data.footer.luckyNumbers || <span className="opacity-0">&nbsp;</span>}</span>
                </div>
              </div>

              <hr className="border-0 border-t border-black my-1" />

              {/* Fixed Final Line */}
              <div className="text-center font-bold text-[8.5px] tracking-wide text-stone-800">
                {L.footerNotice}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Print Stylesheet for 1-Page A4 Sheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #janana-jathagam-sheet {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            max-width: 190mm !important;
            width: 100% !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
