import React, { useState, useMemo, useEffect } from 'react';
import { useLang } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import {
  PRESETS,
  RASHIS,
  NAKSHATRAS,
  WEEKDAYS,
  DASHA_LORDS,
  getGrahaFourRoles,
  calculateThirukanithaHoroscope,
  parseUtcOffset,
  formatUtcOffset,
  SHODASHAVARGA_DEFS,
  DIVISIONAL_CHART_DEFS
} from '../utils/thirukanithaEngine';
import { COUNTRIES, GEO_DATA, lookupCoordinates } from '../data/geoCoordinates';
import ShadbalaBarChart from './ShadbalaBarChart';

// South Indian Chart Fixed Sign Layout (4x4 Grid)
// [Pisces(11), Aries(0),   Taurus(1),  Gemini(2) ]
// [Aquarius(10),       CENTER,         Cancer(3) ]
// [Capricorn(9),       CENTER,         Leo(4)    ]
// [Sagittarius(8), Scorpio(7), Libra(6), Virgo(5)]
const SOUTH_INDIAN_CELLS = [
  { row: 0, col: 0, rasi: 11 },
  { row: 0, col: 1, rasi: 0 },
  { row: 0, col: 2, rasi: 1 },
  { row: 0, col: 3, rasi: 2 },
  { row: 1, col: 3, rasi: 3 },
  { row: 2, col: 3, rasi: 4 },
  { row: 3, col: 3, rasi: 5 },
  { row: 3, col: 2, rasi: 6 },
  { row: 3, col: 1, rasi: 7 },
  { row: 3, col: 0, rasi: 8 },
  { row: 2, col: 0, rasi: 9 },
  { row: 1, col: 0, rasi: 10 }
];

function formatDobDDMMYYYY(dobStr) {
  if (!dobStr) return '';
  const parts = String(dobStr).trim().split(/[-/.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
    } else {
      return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
    }
  }
  return dobStr;
}

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
    // 24-hr format
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

export default function ThirukanithaHoroscopeView({ initialData, onClose, onSwitchToPrint }) {
  const { lang } = useLang();
  const { theme, isDark } = useTheme();
  const isTamil = lang === 'ta';

  // Form State initialized from parent initialData
  const [form, setForm] = useState(() => ({
    name: initialData?.name || '',
    dob: initialData?.dob || '',
    dobTime: initialData?.dobTime || '',
    dobTime12: initialData?.dobTime12 || '',
    country: initialData?.country || 'India',
    state: initialData?.state || 'Tamil Nadu',
    placeName: initialData?.placeName || initialData?.city || 'Salem',
    city: initialData?.city || 'Salem',
    lat: initialData?.lat !== undefined ? initialData.lat : 11.6643,
    lon: initialData?.lon !== undefined ? initialData.lon : 78.1460,
    utcOffset: (typeof initialData?.utcOffset === 'number' ? (initialData.utcOffset === 5.5 ? '05:30 UTC' : formatUtcOffset(initialData.utcOffset)) : (initialData?.utcOffset || '05:30 UTC')),
    father: initialData?.father || '',
    mother: initialData?.mother || '',
    nativePlace: initialData?.nativePlace || '',
    gender: initialData?.gender || 'male'
  }));

  useEffect(() => {
    if (initialData) {
      const isNowEmpty = !initialData.name?.trim() || !initialData.dob?.trim();
      setForm({
        name: initialData.name || '',
        dob: initialData.dob || '',
        dobTime: initialData.dobTime || '',
        dobTime12: initialData.dobTime12 || '',
        country: initialData.country || 'India',
        state: initialData.state || 'Tamil Nadu',
        placeName: initialData.placeName || initialData.city || 'Salem',
        city: initialData.city || 'Salem',
        lat: initialData.lat !== undefined ? initialData.lat : 11.6643,
        lon: initialData.lon !== undefined ? initialData.lon : 78.1460,
        utcOffset: (typeof initialData.utcOffset === 'number' ? (initialData.utcOffset === 5.5 ? '05:30 UTC' : formatUtcOffset(initialData.utcOffset)) : (initialData.utcOffset || '05:30 UTC')),
        father: initialData.father || '',
        mother: initialData.mother || '',
        nativePlace: initialData.nativePlace || '',
        gender: initialData.gender || 'male'
      });

      if (isNowEmpty) {
        setOpenSections({
          1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false,
          11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 19: false, 20: false
        });
      }
    }
  }, [initialData]);

  // Check if birth details intake is empty (requires both Name and DOB)
  const isBirthDetailsEmpty = !form.name?.trim() || !form.dob?.trim();
  const [permissionNotice, setPermissionNotice] = useState(null);

  useEffect(() => {
    if (isBirthDetailsEmpty) {
      setOpenSections({
        1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false,
        11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 19: false, 20: false
      });
    }
  }, [isBirthDetailsEmpty]);

  const [activeChartKey, setActiveChartKey] = useState('D1');
  const [dasavargaMode, setDasavargaMode] = useState('bala'); // 'bala' | 'rasi' | 'shodashavarga'
  const [expandedMdIndex, setExpandedMdIndex] = useState(0);
  const [expandedBhuktiKey, setExpandedBhuktiKey] = useState(null);
  const [selectedShodhanaPlanet, setSelectedShodhanaPlanet] = useState('sun');
  const [shadbalaDisplayMode, setShadbalaDisplayMode] = useState('both'); // 'both' | 'chart' | 'table'

  const [openSections, setOpenSections] = useState(() => {
    const isInitEmpty = !initialData?.name?.trim() || !initialData?.dob?.trim();
    if (isInitEmpty) {
      return {
        1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false,
        11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 19: false, 20: false
      };
    }
    return {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true,
      11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true
    };
  });

  const notifyDetailsRequired = () => {
    const msg = isTamil
      ? '⚠️ பிறப்பு விவரங்கள் காலியாக உள்ளன! தயவுசெய்து மேலே உள்ள படிவத்தில் பெயர் மற்றும் பிறந்த தேதி உள்ளிட்ட விவரங்களை பூர்த்தி செய்து "ஜாதகம் கணிக்கவும்" பொத்தானை அழுத்தவும். அதன் பிறகே 20 பிரிவுகளும் திறக்கப்படும்.'
      : '⚠️ Birth Details are empty! Please enter Name & Date of Birth in the intake form above and calculate to unlock and view the 20 sections.';
    setPermissionNotice(msg);
    const intakeCard = document.getElementById('birth-intake-card') || document.getElementById('birth-intake-form');
    if (intakeCard) {
      intakeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      intakeCard.classList.add('ring-4', 'ring-rose-500/70', 'transition-all');
      setTimeout(() => {
        intakeCard.classList.remove('ring-4', 'ring-rose-500/70');
      }, 2500);
    }
    setTimeout(() => setPermissionNotice(null), 5000);
  };

  const toggleSection = (secNum) => {
    if (isBirthDetailsEmpty) {
      notifyDetailsRequired();
      return;
    }
    setOpenSections(prev => ({ ...prev, [secNum]: !prev[secNum] }));
  };

  const expandAllSections = () => {
    if (isBirthDetailsEmpty) {
      notifyDetailsRequired();
      return;
    }
    setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true });
  };

  const collapseAllSections = () => {
    setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false, 16: false, 17: false, 18: false, 19: false, 20: false });
  };

  const jumpToSection = (secNum) => {
    if (isBirthDetailsEmpty) {
      notifyDetailsRequired();
      return;
    }
    setOpenSections(prev => ({ ...prev, [secNum]: true }));
    setTimeout(() => {
      const el = document.getElementById(`horoscope-section-${secNum}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const renderSectionBadge = (secNum, customBadge = null) => {
    if (isBirthDetailsEmpty) {
      return (
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
            <span>🔒</span>
            <span className="hidden sm:inline">{isTamil ? 'விவரங்கள் தேவை' : 'Details Required'}</span>
          </span>
          <span className="w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center text-xs">
            🔒
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5 shrink-0">
        {customBadge}
        <span className={`w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-200 flex items-center justify-center text-xs transition-transform duration-200 ${openSections[secNum] ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </div>
    );
  };
  const [horaViewTab, setHoraViewTab] = useState('birth'); // 'birth' | 'today'
  const [horaDayNightFilter, setHoraDayNightFilter] = useState('all'); // 'all' | 'day' | 'night'
  const [upagrahaTab, setUpagrahaTab] = useState('all'); // 'all' | 'gulikaadi' | 'dhumadi'
  const [specialLagnaTab, setSpecialLagnaTab] = useState('all'); // 'all' | 'lagnas' | 'sphutas' | 'karmic'
  const [section13Tab, setSection13Tab] = useState('all'); // 'all' | 'naisargika' | 'tatkalika' | 'panchadha' | 'avastha'
  const [section13Planet, setSection13Planet] = useState('all');
  const [section14Tab, setSection14Tab] = useState('all'); // 'all' | 'graha' | 'bhava'
  const [section15Tab, setSection15Tab] = useState('all'); // 'all' | 'profile' | 'schedule' | 'live'
  const [section16Tab, setSection16Tab] = useState('all'); // 'all' | 'pasakar' | 'tara'
  const [section17Tab, setSection17Tab] = useState('all'); // 'all' | 'dignities' | 'aspects'
  const [section19Tab, setSection19Tab] = useState('present');
  const [section20Tab, setSection20Tab] = useState('phalam'); // 'phalam' | 'timeline'
  const [gocharaDate, setGocharaDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Compute Horoscope (All client-side)
  const horoscope = useMemo(() => {
    return calculateThirukanithaHoroscope({
      ...form,
      transitDate: gocharaDate
    });
  }, [form, gocharaDate]);

  const handlePrint = () => {
    window.print();
  };

  // Labels Dictionary
  const T = {
    title: isTamil ? 'திருக்கணித பஞ்சாங்க ஜாதகம்' : 'Thirukanitha Vedic Horoscope',
    subtitle: isTamil
      ? 'திருவானைக்காவல் / தஞ்சை திருக்கணித வாக்கிய முறைப்படி அமைக்கப்பட்ட வேத ஜோதிடக் கணிப்பு'
      : 'Authentic Drik Ganitha Sidereal Ephemeris & Parashara Vedic System',
    calcForm: isTamil ? 'பிறப்பு விவரப் படிவம்' : 'Birth Details Input',
    name: isTamil ? 'பெயர்' : 'Full Name',
    dob: isTamil ? 'பிறந்த தேதி' : 'Date of Birth',
    time: isTamil ? 'பிறந்த நேரம் (12 மணி நேரம் AM/PM)' : 'Birth Time (12-Hour AM/PM)',
    hour: isTamil ? 'மணி' : 'Hour',
    minute: isTamil ? 'நிமிடம்' : 'Min',
    second: isTamil ? 'விநாடி' : 'Sec',
    period: isTamil ? 'பகல்/இரவு' : 'AM/PM',
    country: isTamil ? 'நாடு' : 'Country',
    state: isTamil ? 'மாநிலம்' : 'State / Province',
    city: isTamil ? 'ஊர் / நகரம்' : 'City / Place',
    searchCity: isTamil ? 'ஊர் வடிகட்டல்...' : 'Filter city...',
    latitude: isTamil ? 'அட்சரேகை' : 'Latitude',
    longitude: isTamil ? 'தீர்க்கரேகை' : 'Longitude',
    utcOffset: isTamil ? 'நேர மண்டலம்' : 'UTC Offset',
    calculate: isTamil ? 'ஜாதகம் கணிக்க' : 'Recalculate Horoscope',
    birthSummary: isTamil ? 'ஜனன விவரக் குறிப்பு' : 'Birth & Planetary Summary',
    ayanamsha: isTamil ? 'அயனாம்சம் (லஹிரி)' : 'Ayanamsha (Lahiri)',
    obliquity: isTamil ? 'சாய்கோணம் (ε)' : 'Obliquity (ε)',
    lagna: isTamil ? 'லக்னம்' : 'Ascendant',
    rasi: isTamil ? 'ராசி' : 'Moon Sign',
    nakshatra: isTamil ? 'நட்சத்திரம்' : 'Birth Star',
    pada: isTamil ? 'பாதம்' : 'Pada',
    tithi: isTamil ? 'திதி' : 'Tithi',
    weekday: isTamil ? 'கிழமை' : 'Weekday',
    dashaBalance: isTamil ? 'திசா இருப்பு (பிறப்பில்)' : 'Dasha Balance at Birth',
    charts: isTamil ? 'வர்க்கச் சக்கரங்கள் (16 வர்க்கங்கள்)' : 'Divisional Charts (16 Varga Charts)',
    chartsSubtitle: isTamil ? 'பராசரர் முறைப்படி 16 வர்க்கச் சக்கரங்கள் மற்றும் பாவக சூட்சும பலன்கள்' : 'Parashari 16 Divisional Varga Chakras & Subtle Karakatva Domains',
    masterVargaTableToggle: isTamil ? '16 வர்க்கங்களில் கிரக நிலைகள் & பலம் அட்டவணை' : '16-Varga Planetary Placements & Dignity Matrix',
    dignityLegend: isTamil ? 'உ=உச்சம், ஆ=ஆட்சி, ந=நட்பு, ச=சமம், ப=பகை, நீ=நீசம்' : 'Ex=Exalted, Own=Own Sign, Fr=Friendly, Neu=Neutral, En=Enemy, Deb=Debilitated',
    d1: isTamil ? 'D1 ராசி' : 'D1 Rasi',
    d9: isTamil ? 'D9 நவாம்சம்' : 'D9 Navamsa',
    d3: isTamil ? 'D3 திரேக்காணம்' : 'D3 Drekkana',
    d7: isTamil ? 'D7 சப்தாம்சம்' : 'D7 Saptamsa',
    d10: isTamil ? 'D10 தசாம்சம்' : 'D10 Dasamsa',
    d12: isTamil ? 'D12 துவாதசாம்சம்' : 'D12 Dwadasamsa',
    planetTable: isTamil ? 'கிரக நிலைகள் அட்டவணை (நிராயண)' : 'Planetary Positions (Nirayana Table)',
    planet: isTamil ? 'கிரகம்' : 'Planet',
    long: isTamil ? 'ஸ்புடம் (பாகை)' : 'Longitude',
    degInSign: isTamil ? 'ராசி பாகை' : 'Degrees in Sign',
    dignity: isTamil ? 'நிலை' : 'Dignity',
    bhava: isTamil ? 'பாவம்' : 'Bhava',
    sripatiTable: isTamil ? 'ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு' : 'Sripati Bhava Sphutam Table',
    bhavaNum: isTamil ? 'பாவம்' : 'Bhava',
    start: isTamil ? 'ஆரம்பம் (Start)' : 'Start (Prarambha)',
    madhya: isTamil ? 'மத்திமம் (Madhya / Cusp)' : 'Madhya (Cusp)',
    end: isTamil ? 'முடிவு (End)' : 'End (Antya)',
    vimshottari: isTamil ? 'விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்)' : 'Vimshottari Dasha & Bhukti Table (120 Years)',
    mahadasha: isTamil ? 'மகாதிசை' : 'Mahadasha',
    period: isTamil ? 'காலம்' : 'Period',
    bhukti: isTamil ? 'புக்தி' : 'Bhukti',
    from: isTamil ? 'முதல்' : 'From',
    to: isTamil ? 'வரை' : 'To',
    shadbalaTitle: isTamil ? 'ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு' : 'Shadbala & Bhava Bala Analysis in Horoscope',
    shadbalaSubtitle: isTamil ? 'பராசரர் முறைப்படி கிரகங்களின் அறுவகை பலங்கள் மற்றும் 12 பாவகங்களின் பலங்கள் (ரூபங்களில்)' : 'Parashari 6-fold planetary strengths and 12 house strengths (in Rupas)',
    oraiTitle: isTamil ? 'ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்' : 'Planetary Hora (Orai) Analysis',
    oraiSubtitle: isTamil ? 'பராசரர் முறைப்படி 24 பகல் & இரவு ஓரைகள், பிறந்த ஹோரை மற்றும் இன்றைய நடப்பு ஹோரை' : 'Parashari 24 Day & Night Horas, Birth Hora & Live Real-Time Active Hora',
    gocharamTitle: isTamil ? 'ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)' : 'Real-Time Gocharam (Planetary Transit) Analysis',
    gocharamSubtitle: isTamil ? 'ஜென்ம ராசி மற்றும் லக்னத்தை அடிப்படையாகக் கொண்டு தற்போதைய 9 கிரக நிலைகள், வேதை & அஷ்டகவர்க்க பலன்கள்' : 'Current 9-Graha Transits relative to Janma Rasi & Lagna with Vedha, SAV/BAV Bindus & Phalan',
    grahaShadbala: isTamil ? 'கிரக கணிதம் (Planetary Shadbala)' : 'Planetary Shadbala (Graha Bala in Rupas)',
    bhavaBala: isTamil ? 'பாவக கணிதம் (Bhava Bala)' : 'Bhava Bala (House Strengths in Rupas)',
    strength: isTamil ? 'பலம்' : 'Strength',
    house: isTamil ? 'பாவகம்' : 'Bhava',
    ashtakavargaTitle: isTamil ? 'ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)' : 'Ashtakavarga & Sarvashtakavarga Analysis (337 Bindus)',
    ashtakavargaSubtitle: isTamil ? 'பராசரர் முறைப்படி 7 கிரகங்களின் பின்னாஷ்டகவர்க்கம், சர்வாஷ்டகவர்க்கப் பரல்கள் மற்றும் பாவக ஆய்வுகள்' : 'Parashari 7-Graha Bhinna Ashtakavarga, 12 Signs Sarvashtakavarga Chart & House Diagnostics',
    bavTitle: isTamil ? 'பின்னாஷ்டகவர்க்கப் பரல்கள் அட்டவணை (Bhinna Ashtakavarga Matrix)' : 'Bhinna Ashtakavarga Matrix (Planetary Bindus in 12 Signs)',
    savChartTitle: isTamil ? 'சர்வாஷ்டகவர்க்கச் சக்கரம் (Sarvashtakavarga 4×4 Chart)' : 'Sarvashtakavarga Chart (South Indian 4×4)',
    grandTotal: isTamil ? 'மொத்தப் பரல்கள் (Grand Total)' : 'Grand Total Bindus',
    inflowOutflowRatio: isTamil ? 'வரவு - செலவு ஒப்பீடு (2,9,11 vs 6,8,12)' : 'Inflow vs Outflow (2,9,11 vs 6,8,12)',
    inflow: isTamil ? 'வரவினம்' : 'Inflow',
    outflow: isTamil ? 'செலவினம்' : 'Outflow',
    kendram: isTamil ? 'கேந்திரம் (1, 4, 7, 10)' : 'Kendram (1, 4, 7, 10)',
    panaparam: isTamil ? 'பணபரம் (2, 5, 8, 11)' : 'Panaparam (2, 5, 8, 11)',
    apoklimam: isTamil ? 'அபோக்லிமம் (3, 6, 9, 12)' : 'Apoklimam (3, 6, 9, 12)',
    trikonam: isTamil ? 'திரிகோணம் (1, 5, 9)' : 'Trikonam (1, 5, 9)',
    upachayam: isTamil ? 'உபசயம் (3, 6, 10, 11)' : 'Upachayam (3, 6, 10, 11)',
    directionalTotals: isTamil ? 'திசை பலன்கள் (Directional Bindus)' : 'Directional Strengths',
    strongBhava: isTamil ? '28-க்கு மேல் (வலுவான பாவம்)' : '≥ 28 Strong Bhava',
    weakBhava: isTamil ? '28-க்கு கீழ் (எச்சரிக்கை பாவம்)' : '< 28 Vulnerable Bhava',
    totalLabel: isTamil ? 'மொத்தம்' : 'Total',
    shodhanaTitle: isTamil ? 'அஷ்டவர்க்கச் சோதனை & சோத்திய பிண்டம் (Shodhita Ashtakavarga & Pindas)' : 'Ashtakavarga Shodhana Reductions & Shodhya Pindas',
    shodhanaSubtitle: isTamil ? 'பராசரர் முறைப்படி 7 கிரகங்கள் & லக்னத்திற்கான திரிகோண சோதனை, ஏகாதிபத்திய சோதனை மற்றும் பிண்ட சாதனை' : 'Parashari Trinal Reduction (Trikona), Dual-Lordship Reduction (Ekadhipatya) & Pinda Sadhana for 7 Grahas & Lagna',
    rawBavLabel: isTamil ? 'மூல பரல்' : 'Raw BAV',
    trikonaLabel: isTamil ? 'திரிகோண சோதனை' : 'Trikona Shodhana',
    ekadhipatyaLabel: isTamil ? 'ஏகாதிபத்திய சோதனை' : 'Ekadhipatya Shodhana',
    shodhitaLabel: isTamil ? 'சோதித்த பரல்கள்' : 'Shodhita Bindus',
    rasiPindaLabel: isTamil ? 'ராசி பிண்டம்' : 'Rasi Pinda',
    grahaPindaLabel: isTamil ? 'கிரக பிண்டம்' : 'Graha Pinda',
    shodhyaPindaLabel: isTamil ? 'சோத்திய பிண்டம்' : 'Shodhya Pinda',
    domainLabel: isTamil ? 'முக்கிய காரகத்துவம்' : 'Primary Domain',
    shodhanaSelectPrompt: isTamil ? 'கிரகத்தைத் தேர்வு செய்து 12 ராசி சோதனைப் படிகளைக் காண்க:' : 'Select an Entity to inspect 12-Sign Step-by-Step Reduction Breakdown:',
    dashaBirthBadge: isTamil ? 'பிறந்த திசை' : 'Birth Dasha',
    dashaCurrentToday: isTamil ? 'இன்றைய நடப்பு திசை' : 'Active Dasha Today',
    bhuktiCurrentToday: isTamil ? 'இன்றைய நடப்பு புக்தி' : 'Active Bhukti Today',
    bhuktiOngoingAtBirth: isTamil ? 'பிறப்பில் நடப்பு புக்தி' : 'Ongoing at Birth',
    bhuktiPriorToBirth: isTamil ? 'பிறப்பிற்கு முன் முடிந்தது' : 'Prior to Birth',
    completedStatus: isTamil ? 'முடிந்தது' : 'Completed',
    upcomingStatus: isTamil ? 'எதிர்காலம்' : 'Upcoming',
    printPdf: isTamil ? 'அச்சு / PDF சேமிக்க' : 'Save as PDF / Print',
    close: isTamil ? 'மூடுக' : 'Close',
    darkToggle: isTamil ? (theme === 'dark' ? '☀️ பகல் முறை' : '🌙 இரவு முறை') : (theme === 'dark' ? '☀️ Light' : '🌙 Dark'),
    expandState: isTamil ? 'விரிவாக்கப்பட்டது' : 'Expanded',
    collapseState: isTamil ? 'சுருக்கப்பட்டது' : 'Collapsed',
    omHeader: isTamil ? 'ॐ ஸ்ரீ கணபதயே நமஹ • ஶுபம் பவது' : 'OM SRI GANESHAYA NAMAHA • SUBHAM BHAVATU',
    subhamText: isTamil ? 'சுபம்.' : 'Subham (Auspicious).'
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 font-serif p-3 sm:p-6 print:p-0 ${
        isDark ? 'bg-[#181412] text-[#E8DFD8]' : 'bg-[#FAF6EF] text-[#2C241E]'
      }`}
      style={{
        fontFamily: isTamil ? "'Noto Serif Tamil', 'Source Serif 4', Georgia, serif" : "'Source Serif 4', Georgia, serif"
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* PRINT HEADER (Shown in Print Mode / Clean Official Header) */}
        <div className="text-center pb-2 border-b-2 border-[#7A1A22] space-y-1 hidden print:block">
          <div className="text-xs uppercase tracking-widest text-[#B8860B] dark:text-[#E5C158] font-black">
            {T.omHeader}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight">
            {T.title}
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            {form.name} • {formatDobDDMMYYYY(form.dob)} ({form.dobTime12 || form.dobTime}) • {form.city || form.placeName}, {form.state}, {form.country} ({form.lat}°N, {form.lon}°E, {form.utcOffset})
          </p>
        </div>

        {/* ======================================================== */}
        {/* MASTER SECTION DROP LIST & QUICK JUMPER TOOLBAR */}
        {/* ======================================================== */}
        <div className="bg-white/95 dark:bg-[#251E1A] p-3 sm:p-4 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-14 sm:top-16 z-20 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 whitespace-nowrap flex items-center gap-1.5">
              <span>📑</span>
              <span>{isTamil ? 'பிரிவுக்குச் செல்ல (Drop List):' : 'Jump to Section:'}</span>
            </span>
            <select
              disabled={isBirthDetailsEmpty}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val) jumpToSection(val);
              }}
              className={`bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#7A1A22] w-full max-w-sm shadow-2xs ${
                isBirthDetailsEmpty ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <option value="">
                {isBirthDetailsEmpty
                  ? (isTamil ? '🔒 20 பிரிவுகள் (விவரங்கள் உள்ளிட்ட பின் திறக்கப்படும்)' : '🔒 20 Sections (Enter details above to unlock)')
                  : (isTamil ? '-- 20 பிரிவுகள் பட்டியல் (தேர்வு செய்க) --' : '-- Select Section to Jump (1 to 20) --')}
              </option>
              <option value="1">{isTamil ? '1. ஜனன விவரக் குறிப்பு' : '1. Birth Summary Details'}</option>
              <option value="2">{isTamil ? '2. வர்க்கச் சக்கரங்கள் (Divisional Charts)' : '2. Divisional Charts'}</option>
              <option value="3">{isTamil ? '3. கிரக நிலைகள் அட்டவணை (நிராயண)' : '3. Nirayana Planetary Positions Table'}</option>
              <option value="4">{isTamil ? '4. விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்)' : '4. Vimshottari Dasha & Bhukti Table (120 Years)'}</option>
              <option value="5">{isTamil ? '5. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு' : '5. Sripati Bhava Sphutam Table'}</option>
              <option value="6">{isTamil ? '6. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு' : '6. Shadbala & Bhava Bala Analysis'}</option>
              <option value="7">{isTamil ? '7. ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்' : '7. Planetary Dasavarga & Dignity Strength Matrix'}</option>
              <option value="8">{isTamil ? '8. ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)' : '8. Ashtakavarga & Sarvashtakavarga (337 Bindus)'}</option>
              <option value="9">{isTamil ? '9. ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)' : '9. Real-Time Gocharam (Planetary Transit) Analysis'}</option>
              <option value="10">{isTamil ? '10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்' : '10. Planetary Hora (Orai) Analysis'}</option>
              <option value="11">{isTamil ? '11. உபகிரகங்கள் - குளிகாதி ஐவர் விபரங்கள்.' : '11. Upagrahas - Gulikadi Five Details'}</option>
              <option value="12">{isTamil ? '12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்.' : '12. Upagrahas - Special Sphutas - Lagna Degrees'}</option>
              <option value="13">{isTamil ? '13. கிரகங்களின் நைசர்கிக, தற்கால, பஞ்சதா நட்பு & அவஸ்தா - மண்டல நிலைகள்.' : '13. Planetary Friendships & Avasthas - Mandalam'}</option>
              <option value="14">{isTamil ? '14. கிரகங்களுக்கான பார்வை கோணங்கள் & பாவக-கிரகங்களிடையே பார்வை கோணங்கள்.' : '14. Planetary Aspect Angles & Bhava Aspect Angles'}</option>
              <option value="15">{isTamil ? '15. பஞ்ச பட்சி விபரம்.' : '15. Pancha Pakshi Details (Ancient Tamil Siddha System)'}</option>
              <option value="16">{isTamil ? '16. கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர் & தாரா பலமுள்ள நட்சத்திரங்கள்.' : '16. Graha Pasakar - Bodhakar - Karagar - Vedhagar & Tara Bala'}</option>
              <option value="17">{isTamil ? '17. ஜாதகத்தில் கிரகங்களின் நிலை & கிரகங்களின் பார்வை, சேர்க்கை நிலை.' : '17. Planetary Dignities & Aspects, Conjunctions Table'}</option>
              <option value="18">{isTamil ? '18. எண் கணிதம் (நியூமராலஜி - சாலடியன் முறை).' : '18. Astro-Numerology (Chaldean System)'}</option>
              <option value="19">{isTamil ? '19. ஜாதக யோகங்கள் (16 யோகங்கள்)' : '19. Jathaga Yogas (16 Classical Combinations)'}</option>
              <option value="20">{isTamil ? '20. விம்சோத்தரி மகாதிசைகள் & பலன்கள்' : '20. Vimshottari Maha Dashas & Significations'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={expandAllSections}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1A22] dark:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs ${
                isBirthDetailsEmpty ? 'opacity-60' : ''
              }`}
              title={isBirthDetailsEmpty ? (isTamil ? 'பிறப்பு விவரங்கள் தேவை' : 'Birth Details Required') : ''}
            >
              <span>{isBirthDetailsEmpty ? '🔒' : '▼'}</span>
              <span>{isTamil ? 'அனைத்தும் விரி' : 'Expand All'}</span>
            </button>
            <button
              type="button"
              onClick={collapseAllSections}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>▲</span>
              <span>{isTamil ? 'அனைத்தும் சுருக்கு' : 'Collapse All'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 hover:from-[#5C1017] hover:to-[#7A1A22] text-xs font-bold shadow-md shadow-red-950/20 transition-all cursor-pointer flex items-center gap-1"
              title="Print Horoscope"
            >
              <span>🖨️</span>
              <span>{isTamil ? 'அச்சு' : 'Print'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Floating Notification Toast when section clicked without entering details */}
        {permissionNotice && (
          <div className="bg-[#7A1A22] text-amber-100 p-3.5 sm:p-4 rounded-2xl shadow-lg border-2 border-amber-400 font-bold text-xs sm:text-sm flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔒</span>
              <span>{permissionNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setPermissionNotice(null)}
              className="text-amber-200 hover:text-white text-base px-2 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Empty Birth Details Lock Notice Banner */}
        {isBirthDetailsEmpty && (
          <div className="bg-amber-50/90 dark:bg-[#1F1815] border-2 border-dashed border-amber-400/80 dark:border-amber-600/50 rounded-2xl p-4 sm:p-5 text-center shadow-xs space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-200/70 dark:bg-amber-900/50 text-[#7A1A22] dark:text-amber-300 flex items-center justify-center text-xl shadow-xs">
              🔒
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#7A1A22] dark:text-amber-300">
              {isTamil
                ? 'பிறப்பு விவரப் படிவத்தில் விவரங்களை உள்ளிட்ட பிறகே இப்பிரிவுகள் திறக்கப்படும்'
                : 'Enter Birth Details in the Form Above to Unlock the 20 Sections'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
              {isTamil
                ? 'பிறப்பு விவரப் படிவம் தற்போது காலியாக உள்ளது. கீழே உள்ள 20 தலைப்புகளின் பட்டியல் மட்டுமே காட்டப்படுகிறது (அனைத்துப் பிரிவுகளும் சுருக்கப்பட்டுள்ளன). மேலே உள்ள படிவத்தில் பெயர் மற்றும் பிறந்த தேதியை உள்ளிட்ட பின்னரே இப்பிரிவுகளை திறக்க அனுமதி உண்டு.'
                : 'Birth details intake is currently empty. The 20 section titles are displayed below in collapsed mode. Please enter name and date of birth in the intake form above and calculate to unlock and view these sections.'}
            </p>
          </div>
        )}


        {/* ======================================================== */}
        {/* ITEM 1: 1. ஜனன விவரக் குறிப்பு (1. Birth Summary Details) */}
        {/* ======================================================== */}
        <div id="horoscope-section-1" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(1)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                1
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>✨</span>
                  <span>{isTamil ? '1. ஜனன விவரக் குறிப்பு' : '1. Birth Summary Details'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'லக்னம், ராசி, நட்சத்திரம், திதி, கிழமை, திசா இருப்பு மற்றும் அயனாம்ச விவரங்கள்' : 'Ascendant, Moon sign, Nakshatra, Tithi, Weekday, Dasha balance & Ayanamsha'}
                </p>
              </div>
            </div>

            {renderSectionBadge(1, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? RASHIS[horoscope.summary.lagnaRasi]?.ta : RASHIS[horoscope.summary.lagnaRasi]?.en} / {isTamil ? RASHIS[horoscope.summary.moonRasi]?.ta : RASHIS[horoscope.summary.moonRasi]?.en}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[1] && (
            <div className="p-4 sm:p-6 border-t border-amber-900/10 dark:border-amber-500/15 space-y-5">
              {/* SUB-SECTION 1: Primary Birth Credentials */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-amber-900/15 dark:border-amber-500/15 pb-1.5">
                  <span className="text-sm">👤</span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-[#E8838B]">
                    {isTamil ? 'முதன்மை ஜனன விவரங்கள்' : 'Primary Birth Profile'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'பெயர்' : 'Name'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {horoscope.summary?.name || horoscope.meta?.name || '---'}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'பிறந்த தேதி' : 'Date of Birth (D.O.B)'}</span>
                    <strong className="text-xs sm:text-sm font-mono font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {horoscope.summary?.dobFormatted || horoscope.meta?.dob || '---'}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'பிறந்த நேரம்' : 'Time of Birth'}</span>
                    <strong className="text-xs sm:text-sm font-mono font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {horoscope.summary?.dobTime || horoscope.meta?.dobTime12 || horoscope.meta?.dobTime || '---'}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'பிறந்த இடம்' : 'Place of Birth'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {horoscope.summary?.placeName || horoscope.meta?.city || horoscope.meta?.placeName || '---'}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'தமிழ் தேதி' : 'Tamil Date of Birth'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {isTamil ? (horoscope.summary?.tamilDate?.ta || horoscope.summary?.tamilDate) : (horoscope.summary?.tamilDate?.en || horoscope.summary?.tamilDate)}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'அயனம்' : 'Ayanam'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {isTamil ? horoscope.summary?.ayanam?.ta : horoscope.summary?.ayanam?.en}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'நட்சத்திர ஓரை / நாதன்' : 'Nakshatra Hora / Lord'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {isTamil ? horoscope.summary?.nakshatraHora?.combinedTa : horoscope.summary?.nakshatraHora?.combinedEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-400/40 col-span-2 sm:col-span-1 md:col-span-1">
                    <span className="block text-[10px] text-emerald-800 dark:text-emerald-400 uppercase font-bold">{isTamil ? 'நடப்பு தசா - புக்தி' : 'Current Dasha - Bhukti'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {isTamil ? (horoscope.summary?.currentDashaToday?.textTa || horoscope.summary?.dashaBalance?.textTa) : (horoscope.summary?.currentDashaToday?.textEn || horoscope.summary?.dashaBalance?.textEn)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SUB-SECTION 2: Panchangam & Astrological Foundations */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-amber-900/15 dark:border-amber-500/15 pb-1.5">
                  <span className="text-sm">📜</span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-[#E8838B]">
                    {isTamil ? 'பஞ்சாங்க அங்கங்கள் & லக்ன விவரங்கள்' : 'Panchanga Angas & Astrological Foundations'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 text-xs">
                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.lagna}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                      {isTamil ? RASHIS[horoscope.summary.lagnaRasi].ta : RASHIS[horoscope.summary.lagnaRasi].en} ({horoscope.summary.lagnaDegInSign})
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.rasi}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                      {isTamil ? RASHIS[horoscope.summary.moonRasi].ta : RASHIS[horoscope.summary.moonRasi].en}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.nakshatra}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                      {isTamil ? NAKSHATRAS[horoscope.summary.moonNak].ta : NAKSHATRAS[horoscope.summary.moonNak].en} - {horoscope.summary.moonPada} {T.pada}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.tithi}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                      {isTamil ? horoscope.summary.tithiNameTa : horoscope.summary.tithiNameEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.weekday}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                      {isTamil ? horoscope.summary.weekday.ta : horoscope.summary.weekday.en}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'யோகம் - கரணம்' : 'Yoga - Karana'}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {isTamil ? horoscope.summary?.yogaKarana?.textTa : horoscope.summary?.yogaKarana?.textEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.ayanamsha}</span>
                    <strong className="text-xs font-mono text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {horoscope.summary.ayanamshaDMS}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.dashaBalance}</span>
                    <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {isTamil ? horoscope.summary.dashaBalance.textTa : horoscope.summary.dashaBalance.textEn}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SUB-SECTION 3: Special Planetary Rulerships (Lagnathipathi, Bhagyathipathi, Badhakathipathi, Subhar, Asubhar, Yogi-Avayogi) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-amber-900/15 dark:border-amber-500/15 pb-1.5">
                  <span className="text-sm">👑</span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-[#E8838B]">
                    {isTamil ? 'லக்ன ஆதிபத்தியங்கள், சுப-அசுபர்கள் & யோகி-அவயோகி' : 'Special Planetary Rulerships, Benefics & Malefics'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5 text-xs">
                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-400/40 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'லக்னாதிபதி' : 'Lagnathipathi'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {isTamil ? horoscope.summary?.lagnaRoles?.lordTa : horoscope.summary?.lagnaRoles?.lordEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-400/40 text-center">
                    <span className="block text-[10px] text-stone-500 uppercase font-bold">{isTamil ? 'பாக்கியாதிபதி' : 'Bhagyathipathi'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words">
                      {isTamil ? horoscope.summary?.lagnaRoles?.bhagyaTa : horoscope.summary?.lagnaRoles?.bhagyaEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/20 rounded-xl border border-rose-400/40 text-center">
                    <span className="block text-[10px] text-rose-700 dark:text-rose-400 uppercase font-bold">{isTamil ? 'பாதகாதிபதி' : 'Badhakathipathi'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-300 mt-0.5 block break-words">
                      {isTamil ? horoscope.summary?.lagnaRoles?.badhakaTa : horoscope.summary?.lagnaRoles?.badhakaEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-400/40 text-center">
                    <span className="block text-[10px] text-emerald-800 dark:text-emerald-400 uppercase font-bold">{isTamil ? 'சுபர்கள்' : 'Benefics (Subhar)'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {isTamil ? horoscope.summary?.lagnaRoles?.subharTa : horoscope.summary?.lagnaRoles?.subharEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/20 rounded-xl border border-rose-400/40 text-center">
                    <span className="block text-[10px] text-rose-800 dark:text-rose-400 uppercase font-bold">{isTamil ? 'அசுபர்கள்' : 'Malefics (Asubhar)'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {isTamil ? horoscope.summary?.lagnaRoles?.asubharTa : horoscope.summary?.lagnaRoles?.asubharEn}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-indigo-50/70 dark:bg-indigo-950/20 rounded-xl border border-indigo-400/40 text-center">
                    <span className="block text-[10px] text-indigo-800 dark:text-indigo-400 uppercase font-bold">{isTamil ? 'யோகி - அவயோகி' : 'Yogi - Avayogi'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {isTamil ? horoscope.summary?.yogiAvayogi?.textTa : horoscope.summary?.yogiAvayogi?.textEn}
                    </strong>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-center ${
                    horoscope.summary?.vakraCount > 0
                      ? 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-500/50'
                      : 'bg-[#FAF6EF] dark:bg-[#1A1513] border-amber-900/10 dark:border-amber-500/15'
                  }`}>
                    <span className="block text-[10px] text-stone-500 uppercase font-bold flex items-center justify-center gap-1">
                      <span>🌀</span>
                      <span>{isTamil ? 'வக்ர நிலை' : 'Retrograde Status'}</span>
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block break-words whitespace-normal leading-snug">
                      {horoscope.summary?.vakraCount > 0
                        ? (isTamil ? horoscope.summary.vakraNamesTa : horoscope.summary.vakraNamesEn)
                        : (isTamil ? 'நேர்கதி' : 'All Direct')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SUB-SECTION 4: Four Functional Roles for Lagna Lord (Bhodhagar, Vedhagar, Pasagar, Karagar) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-amber-900/15 dark:border-amber-500/15 pb-1.5">
                  <span className="text-sm">⚖️</span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-[#E8838B]">
                    {isTamil ? 'லக்னாதிபதிக்கான பாசகாதி நால்வர்' : 'Functional Role Deliverers for Lagna Lord'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 bg-cyan-50/70 dark:bg-cyan-950/30 rounded-xl border border-cyan-400/40">
                    <span className="block text-[10px] text-cyan-800 dark:text-cyan-400 uppercase font-bold">{isTamil ? 'பாசகர்' : 'Pasagar (Activator)'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-cyan-950 dark:text-cyan-200 mt-0.5 block">
                      {isTamil ? horoscope.summary?.grahaFourRoles?.pasagarTa : horoscope.summary?.grahaFourRoles?.pasagarEn}
                    </strong>
                    <span className="text-[10px] text-cyan-700 dark:text-cyan-300 mt-0.5 block">
                      {isTamil ? 'சீக்கிர பலனைத் தருபவர்' : 'Quickly ripens & delivers results'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-400/40">
                    <span className="block text-[10px] text-emerald-800 dark:text-emerald-400 uppercase font-bold">{isTamil ? 'போதகர்' : 'Bhodhagar (Bestower)'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200 mt-0.5 block">
                      {isTamil ? horoscope.summary?.grahaFourRoles?.bhodhagarTa : horoscope.summary?.grahaFourRoles?.bhodhagarEn}
                    </strong>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                      {isTamil ? 'நிறையத் தருபவர்' : 'Showers abundant blessings'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-400/40">
                    <span className="block text-[10px] text-amber-800 dark:text-amber-400 uppercase font-bold">{isTamil ? 'காரகர்' : 'Karagar (Steady Doer)'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 mt-0.5 block">
                      {isTamil ? horoscope.summary?.grahaFourRoles?.karagarTa : horoscope.summary?.grahaFourRoles?.karagarEn}
                    </strong>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5 block">
                      {isTamil ? 'நிதானமாக, குறைந்த பலனைத் தருபவர்' : 'Gives measured, steady results'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-xl border border-rose-400/40">
                    <span className="block text-[10px] text-rose-800 dark:text-rose-400 uppercase font-bold">{isTamil ? 'வேதகர்' : 'Vedhagar (Obstructionist)'}</span>
                    <strong className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-200 mt-0.5 block">
                      {isTamil ? horoscope.summary?.grahaFourRoles?.vedhagarTa : horoscope.summary?.grahaFourRoles?.vedhagarEn}
                    </strong>
                    <span className="text-[10px] text-rose-700 dark:text-rose-300 mt-0.5 block">
                      {isTamil ? 'தடுத்து விடுவார்' : 'Blocks, pierces or delays fruits'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 2: 2. வர்க்கச் சக்கரங்கள் (Divisional Charts) */}
        {/* ======================================================== */}
        <div id="horoscope-section-2" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(2)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                2
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>☸️</span>
                  <span>{isTamil ? '2. வர்க்கச் சக்கரங்கள் (Divisional Charts)' : '2. Divisional Charts'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் முறைப்படி வர்க்கச் சக்கரங்கள் (D1 முதல் D60 வரை) மற்றும் பாவக பலன்கள்' : 'Parashari Divisional Varga Chakras (D1 to D60) & Subtle Karakatva Domains'}
                </p>
              </div>
            </div>

            {renderSectionBadge(2, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {activeChartKey} ({isTamil ? (DIVISIONAL_CHART_DEFS.find(d => d.key === activeChartKey)?.nameTa || '') : activeChartKey})
              </span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[2] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 2: South Indian Charts (Divisional, Bava Chart & Gocharam Grid Layout) */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4">
          {/* Divisional, Bava & Gocharam Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 max-w-full print:hidden scrollbar-thin touch-pan-x overscroll-x-contain">
            {DIVISIONAL_CHART_DEFS.map(chart => (
              <button
                key={chart.key}
                type="button"
                onClick={() => setActiveChartKey(chart.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  activeChartKey === chart.key
                    ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                    : chart.key === 'Bhava'
                      ? 'bg-amber-600/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-600/25'
                      : chart.key === 'Gocharam'
                        ? 'bg-emerald-600/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/25'
                        : 'bg-amber-900/10 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-900/20'
                }`}
              >
                {chart.key === 'Gocharam' && <span>🪐</span>}
                {chart.key === 'Bhava' && <span>🏛️</span>}
                <span>{isTamil ? chart.nameTa : chart.nameEn}</span>
              </button>
            ))}
          </div>

          {/* Active Varga Information Card */}
          {(() => {
            const activeDef = DIVISIONAL_CHART_DEFS.find(d => d.key === activeChartKey) || DIVISIONAL_CHART_DEFS[0];
            return (
              <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/50 border border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-[#7A1A22] dark:text-amber-300 mr-2">
                    {isTamil ? activeDef.nameTa : activeDef.nameEn}:
                  </span>
                  <span className="text-stone-700 dark:text-stone-300 font-medium">
                    {isTamil ? activeDef.domainTa : activeDef.domainEn}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-amber-900 dark:text-amber-300 font-semibold bg-white/70 dark:bg-stone-900/60 px-2 py-0.5 rounded border border-amber-900/10">
                  {isTamil ? `பாகை அளவு: ${activeDef.divisionDeg}` : `Division: ${activeDef.divisionDeg}`}
                </div>
              </div>
            );
          })()}

          {/* Render South Indian Chart (Screen: selected active, Print: D1 and D9 side-by-side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {/* Chart 1: Active Varga, Bava Chart, or Gocharam */}
            {(() => {
              const activeDef = DIVISIONAL_CHART_DEFS.find(d => d.key === activeChartKey) || DIVISIONAL_CHART_DEFS[0];
              const title = isTamil ? activeDef.nameTa : activeDef.nameEn;
              const chartData = horoscope.charts[activeChartKey] || horoscope.charts.D1;
              return (
                <div className="space-y-1.5">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-[#7A1A22] dark:text-[#E8838B]">
                    {title}
                  </div>
                  <SouthIndianChartGrid
                    chartData={chartData}
                    isTamil={isTamil}
                    centerTitle={title}
                    centerSub={form.name}
                  />
                </div>
              );
            })()}

            {/* Chart 2: Comparison Chart (D9 Navamsa when D1 is selected; D1 Rasi for Bava, Gocharam, and all other vargas) */}
            {(() => {
              const isD1 = activeChartKey === 'D1';
              const isBhava = activeChartKey === 'Bhava';
              const isGocharam = activeChartKey === 'Gocharam';
              const compKey = isD1 ? 'D9' : 'D1';
              const compTitle = isTamil
                ? (isBhava ? 'D1 ராசி (ஒப்பீடு)' : isGocharam ? 'D1 ராசி (ஜென்மம் ஒப்பீடு)' : (isD1 ? 'D9 நவாம்சம்' : 'D1 ராசி'))
                : (isBhava ? 'D1 Rasi (Comparison)' : isGocharam ? 'D1 Rasi (Janma Comparison)' : (isD1 ? 'D9 Navamsa' : 'D1 Rasi'));

              return (
                <div className="space-y-1.5">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-[#7A1A22] dark:text-[#E8838B]">
                    {compTitle}
                  </div>
                  <SouthIndianChartGrid
                    chartData={horoscope.charts[compKey] || horoscope.charts.D1}
                    isTamil={isTamil}
                    centerTitle={compTitle}
                    centerSub={form.name}
                  />
                </div>
              );
            })()}
          </div>

          {/* Additional Bava Chart Diagnostics & Sripati Cusps (Rendered when Bava Chart is active) */}
          {activeChartKey === 'Bhava' && (
            <div className="pt-2 space-y-3 border-t border-amber-900/15 dark:border-amber-500/20">
              {/* 1. Bava Shift (பாவக மாற்றம்) Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-900/15">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                    <span>🔄</span>
                    <span>{isTamil ? 'பாவக மாற்றம் ஆய்வு (Bava Shifts vs Rasi)' : 'Bava Shifts vs Rasi Analysis'}</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-amber-900/10">
                    {horoscope?.bhavaShifts?.length || 0} {isTamil ? 'மாற்றங்கள்' : 'Shifts'}
                  </span>
                </div>

                {horoscope?.bhavaShifts && horoscope.bhavaShifts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {horoscope.bhavaShifts.map(sh => (
                      <div key={sh.id} className="p-2.5 rounded-lg bg-white dark:bg-stone-900/80 border border-amber-900/10 flex items-start gap-2 shadow-2xs">
                        <span className="text-amber-700 dark:text-amber-400 font-bold shrink-0 text-sm">✦</span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{isTamil ? sh.nameTa : sh.nameEn}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-[#7A1A22] dark:text-amber-300 font-bold">
                              {isTamil ? `ராசி H${sh.rasiHouse} ➔ பாவக H${sh.chalitHouse}` : `Rasi H${sh.rasiHouse} ➔ Bava H${sh.chalitHouse}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                            {isTamil ? sh.explanationTa : sh.explanationEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                    {isTamil
                      ? '✓ இந்த ஜாதகத்தில் பாவக மாற்றம் ஏதும் இல்லை. ராசியில் உள்ள அதே பாவங்களிலேயே அனைத்து கிரகங்களும் சுபமாக செயல்படுகின்றன.'
                      : '✓ No house shifts detected in this chart. All planets deliver their effects through their native Rasi houses.'}
                  </p>
                )}
              </div>

              {/* 2. Sripati 12 Bava Cusps Table (ஆரம்பம், மத்திமம், முடிவு) */}
              {Array.isArray(horoscope?.sripatiBhavas) && horoscope.sripatiBhavas.length > 0 && (
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-900/15 overflow-x-auto">
                  <div className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>{isTamil ? 'ஸ்ரீபதி 12 பாவக ஆரம்ப, மத்திம, முடிவு அட்டவணை' : 'Sripati 12 Bava Cusps (Start, Madhya, End)'}</span>
                  </div>
                  <table className="w-full border-collapse text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-amber-900/15 bg-amber-50/60 dark:bg-stone-800/50 font-bold text-stone-800 dark:text-stone-200">
                        <th className="py-1 px-2">{isTamil ? 'பாவகம்' : 'Bhava'}</th>
                        <th className="py-1 px-2">{isTamil ? 'ஆரம்பம் (Start)' : 'Start Cusp'}</th>
                        <th className="py-1 px-2">{isTamil ? 'மத்திமம் (Madhya)' : 'Bhava Madhya'}</th>
                        <th className="py-1 px-2">{isTamil ? 'முடிவு (End)' : 'End Cusp'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800">
                      {horoscope.sripatiBhavas.map(b => (
                        <tr key={b.bhava} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30">
                          <td className="py-1 px-2 font-bold text-[#7A1A22] dark:text-amber-400">
                            {isTamil ? `${b.bhava}-ம் பாவம்` : `Bhava ${b.bhava}`}
                          </td>
                          <td className="py-1 px-2 font-mono">{RASHIS[b.startRasi]?.[isTamil ? 'ta' : 'en']} {b.startDMS}</td>
                          <td className="py-1 px-2 font-mono font-bold text-slate-900 dark:text-slate-100">{RASHIS[b.madhyaRasi]?.[isTamil ? 'ta' : 'en']} {b.madhyaDMS}</td>
                          <td className="py-1 px-2 font-mono">{RASHIS[b.endRasi]?.[isTamil ? 'ta' : 'en']} {b.endDMS}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Additional Gocharam Transit Diagnostics & Phalan (Rendered when Gocharam is active) */}
          {activeChartKey === 'Gocharam' && horoscope?.gocharam && (
            <div className="pt-2 space-y-3.5 border-t border-amber-900/15 dark:border-amber-500/20">
              {/* Gocharam Header Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-amber-950/30 border border-emerald-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪐</span>
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">
                      {isTamil ? 'தற்போதைய கோச்சார கிரக நிலைகள்' : 'Real-time Planetary Transits'}
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 ml-2">
                      ({isTamil ? `கணித்த நாள்: ${horoscope.gocharam.transitDateFormatted}` : `Transit Date: ${horoscope.gocharam.transitDateFormatted}`})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-900/15">
                    {isTamil ? `ஜென்ம ராசி: ${horoscope.gocharam.birthMoonRasiTa}` : `Birth Moon: ${horoscope.gocharam.birthMoonRasiEn}`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-900/15">
                    {isTamil ? `ஜென்ம லக்னம்: ${horoscope.gocharam.birthLagnaRasiTa}` : `Birth Lagna: ${horoscope.gocharam.birthLagnaRasiEn}`}
                  </span>
                </div>
              </div>

              {/* 3 Summary Diagnostic Cards: Sade Sati, Guru Bala, Rahu-Ketu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Sade Sati Card */}
                <div className={`p-3 rounded-xl border ${
                  horoscope.gocharam.sadeSati?.isActive
                    ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/30'
                    : 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/30'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                    <span>{horoscope.gocharam.sadeSati?.isActive ? '⚠️' : '✅'}</span>
                    <span className={horoscope.gocharam.sadeSati?.isActive ? 'text-amber-900 dark:text-amber-300' : 'text-emerald-900 dark:text-emerald-300'}>
                      {isTamil ? horoscope.gocharam.sadeSati?.titleTa : horoscope.gocharam.sadeSati?.titleEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    {isTamil ? horoscope.gocharam.sadeSati?.descTa : horoscope.gocharam.sadeSati?.descEn}
                  </p>
                </div>

                {/* Guru Bala Card */}
                <div className={`p-3 rounded-xl border ${
                  horoscope.gocharam.guruBala?.hasGuruBala
                    ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/30'
                    : 'bg-blue-500/10 border-blue-500/30 dark:bg-blue-950/30'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                    <span>{horoscope.gocharam.guruBala?.hasGuruBala ? '🌟' : 'ℹ️'}</span>
                    <span className={horoscope.gocharam.guruBala?.hasGuruBala ? 'text-emerald-900 dark:text-emerald-300' : 'text-blue-900 dark:text-blue-300'}>
                      {isTamil ? horoscope.gocharam.guruBala?.titleTa : horoscope.gocharam.guruBala?.titleEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    {isTamil ? horoscope.gocharam.guruBala?.descTa : horoscope.gocharam.guruBala?.descEn}
                  </p>
                </div>

                {/* Rahu Ketu Transit Axis Card */}
                <div className="p-3 rounded-xl border bg-purple-500/10 border-purple-500/30 dark:bg-purple-950/30">
                  <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                    <span>🔮</span>
                    <span className="text-purple-900 dark:text-purple-300">
                      {isTamil ? horoscope.gocharam.rahuKetu?.titleTa : horoscope.gocharam.rahuKetu?.titleEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    {isTamil ? horoscope.gocharam.rahuKetu?.descTa : (horoscope.gocharam.rahuKetu?.descEn || horoscope.gocharam.rahuKetu?.descTa)}
                  </p>
                </div>
              </div>

              {/* Transit Planets Table */}
              {Array.isArray(horoscope.gocharam.planets) && horoscope.gocharam.planets.length > 0 && (
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-900/15 overflow-x-auto">
                  <div className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>📊</span>
                      <span>{isTamil ? '9 கோச்சார கிரக சஞ்சார பலன்கள் (Gochara Phalan)' : '9 Transit Planetary Influences (Gochara Phalan)'}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                      {isTamil ? '* சந்திரன் & லக்னத்திலிருந்து பாவ நிலைகள்' : '* Houses calculated from Birth Moon & Lagna'}
                    </span>
                  </div>
                  <table className="w-full border-collapse text-[11px] text-left">
                    <thead>
                      <tr className="border-b border-amber-900/15 bg-amber-50/60 dark:bg-stone-800/50 font-bold text-stone-800 dark:text-stone-200">
                        <th className="py-1.5 px-2">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                        <th className="py-1.5 px-2">{isTamil ? 'கோச்சார ராசி' : 'Transit Sign'}</th>
                        <th className="py-1.5 px-2 text-center">{isTamil ? 'சந்திரனில் இருந்து' : 'From Moon'}</th>
                        <th className="py-1.5 px-2 text-center">{isTamil ? 'லக்னத்தில் இருந்து' : 'From Lagna'}</th>
                        <th className="py-1.5 px-2 text-center">{isTamil ? 'நிலை' : 'Status'}</th>
                        <th className="py-1.5 px-2">{isTamil ? 'கோச்சார பலன்' : 'Gochara Phalan'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800">
                      {horoscope.gocharam.planets.map(p => (
                        <tr key={p.id} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30">
                          <td className="py-1.5 px-2 font-bold text-[#7A1A22] dark:text-amber-300 whitespace-nowrap">
                            <span className="font-mono mr-1">{p.symbol}</span>
                            <span>{isTamil ? p.nameWithVakraTa : p.nameWithVakraEn}</span>
                          </td>
                          <td className="py-1.5 px-2 font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap">
                            {isTamil ? p.transitRasiTa : p.transitRasiEn} <span className="font-mono text-[10px] text-stone-500 font-normal">({p.degInSign})</span>
                          </td>
                          <td className="py-1.5 px-2 text-center font-mono font-bold text-amber-900 dark:text-amber-300 whitespace-nowrap">
                            {isTamil ? `${p.houseFromMoon}-ம் இடம்` : `House ${p.houseFromMoon}`}
                          </td>
                          <td className="py-1.5 px-2 text-center font-mono text-stone-600 dark:text-stone-400 whitespace-nowrap">
                            {isTamil ? `${p.houseFromLagna}-ம் இடம்` : `House ${p.houseFromLagna}`}
                          </td>
                          <td className="py-1.5 px-2 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.statusType === 'subha'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20'
                                : p.statusType === 'vedha'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-500/20'
                                  : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-500/20'
                            }`}>
                              {isTamil ? p.statusBadgeTa : p.statusBadgeEn}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-stone-700 dark:text-stone-300 text-[11px]">
                            {isTamil ? p.phalanTa : p.phalanEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 3: 3. கிரக நிலைகள் அட்டவணை (நிராயண) (3. Nirayana Planetary Positions Table) */}
        {/* ======================================================== */}
        <div id="horoscope-section-3" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(3)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                3
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🌌</span>
                  <span>{isTamil ? '3. கிரக நிலைகள் அட்டவணை (நிராயண)' : '3. Nirayana Planetary Positions Table'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'துல்லியமான நிராயண கிரக நிலைகள், பாகை, நட்சத்திரம், பாதம், நவாம்சம் மற்றும் பாவகம்' : 'Accurate Nirayana Planetary Longitudes, Nakshatra, Pada, Navamsa & Bhava'}
                </p>
              </div>
            </div>

            {renderSectionBadge(3, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">11 {isTamil ? 'கிரக நிலைகள்' : 'Planets'}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[3] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 4: Planetary Positions Table */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-900/20 text-[#7A1A22] dark:text-amber-300 font-bold bg-amber-900/5 dark:bg-stone-800">
                  <th className="py-2.5 px-3">{isTamil ? 'கிரகம்' : 'Planet / Body'}</th>
                  <th className="py-2.5 px-3">{T.long}</th>
                  <th className="py-2.5 px-3">{T.degInSign}</th>
                  <th className="py-2.5 px-3">{isTamil ? 'ராசி' : 'Sign (Rasi)'}</th>
                  <th className="py-2.5 px-3">{isTamil ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                  <th className="py-2.5 px-3">{T.pada}</th>
                  <th className="py-2.5 px-3">{T.d9}</th>
                  <th className="py-2.5 px-3 text-center">{T.dignity || (isTamil ? 'நிலை' : 'Dignity')}</th>
                  <th className="py-2.5 px-3 text-right">{T.bhava}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800">
                {horoscope.planets.map(p => {
                  const isLagna = p.id === 'lagna' || p.isLagna;
                  const isMandi = p.id === 'mandi' || p.isMandi;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-amber-900/5 dark:hover:bg-stone-800/50 transition-colors ${
                        isLagna
                          ? 'bg-amber-500/10 dark:bg-amber-500/15 font-semibold'
                          : isMandi
                          ? 'bg-amber-900/5 dark:bg-amber-950/30'
                          : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-bold flex items-center gap-1.5">
                        <span className="text-amber-800 dark:text-amber-400 font-mono text-sm">{p.info.symbol}</span>
                        <span className={isLagna ? 'text-[#7A1A22] dark:text-amber-300 font-black' : isMandi ? 'text-[#8C3A00] dark:text-amber-400 font-black' : ''}>
                          {isTamil ? p.info.ta : p.info.en}
                        </span>
                        {p.isRetrograde && (
                          <span
                            className="ml-1 px-1 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200 border border-amber-600/30 shadow-2xs"
                            title={isTamil ? 'வக்ர கதி (Retrograde Motion)' : 'Retrograde Motion'}
                          >
                            {isTamil ? '(வ)' : '(R)'}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono">{p.dms}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-[#7A1A22] dark:text-amber-200">{p.degInSign}</td>
                      <td className="py-2 px-3 font-bold">{isTamil ? RASHIS[p.rasi].ta : RASHIS[p.rasi].en}</td>
                      <td className="py-2 px-3">{isTamil ? NAKSHATRAS[p.nakshatra].ta : NAKSHATRAS[p.nakshatra].en}</td>
                      <td className="py-2 px-3 font-bold">{p.pada}</td>
                      <td className="py-2 px-3">{isTamil ? RASHIS[p.navamsa].ta : RASHIS[p.navamsa].en}</td>
                      <td className="py-2 px-3 text-center font-bold">
                        {isLagna || isMandi ? (
                          <span className="text-stone-400 font-mono">---</span>
                        ) : (
                          <span className={
                            p.dignityKey === 'utcha' || p.dignityKey === 'aatchi'
                              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                              : p.dignityKey === 'neecha' || p.dignityKey === 'pagai'
                              ? 'text-rose-700 dark:text-rose-400 font-bold'
                              : 'text-stone-700 dark:text-stone-300 font-semibold'
                          }>
                            {isTamil ? (p.dignityTa || p.dignity || '---') : (p.dignityEn || p.dignity || '---')}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right font-black text-[#7A1A22] dark:text-amber-300">{p.bhava}</td>
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
  

        {/* ======================================================== */}
        {/* ITEM 4: 4. விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்) (6. Vimshottari Dasha & Bhukti Table (120 Years)) */}
        {/* ======================================================== */}
        <div id="horoscope-section-4" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(4)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                4
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>⏳</span>
                  <span>{isTamil ? '4. விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்)' : '4. Vimshottari Dasha & Bhukti Table (120 Years)'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் முறைப்படி 120 ஆண்டுகளுக்கான 9 மகாதிகைகள் மற்றும் 81 புக்திகள் கணக்கீடு' : 'Parashari 120-Year Vimshottari Cycle with 9 Mahadashas and 81 Sub-Periods'}
                </p>
              </div>
            </div>

            {renderSectionBadge(4, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? horoscope.summary.dashaBalance?.textTa : horoscope.summary.dashaBalance?.textEn}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[4] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 6: Vimshottari Dasha & Collapsible Bhukti Tables (120 Years) */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4">
          <div className="border-b border-amber-900/10 pb-3 flex flex-wrap items-center justify-end gap-2">
            {/* Quick Status Badges at Top */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {horoscope.summary?.dashaBalance && (
                <div className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1.5">
                  <span className="text-xs">👶</span>
                  <span className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                    {isTamil ? horoscope.summary.dashaBalance.textTa : horoscope.summary.dashaBalance.textEn}
                  </span>
                </div>
              )}
              {horoscope.summary?.currentDashaToday && (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-700/50 flex items-center gap-1.5">
                  <span className="text-xs">🌟</span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    {isTamil ? `இன்றைய நடப்பு: ${horoscope.summary.currentDashaToday.textTa}` : `Active Today: ${horoscope.summary.currentDashaToday.textEn}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* LIVE CURRENT DASHA - BHUKTI - ANTARA TRACKER WIDGET */}
          {horoscope.summary?.currentDashaToday && (
            <div className="bg-gradient-to-r from-emerald-900/10 via-amber-500/10 to-transparent dark:from-emerald-950/40 dark:via-stone-900/40 p-4 rounded-xl border border-emerald-500/30 dark:border-emerald-600/30 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
                    🌟
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      {isTamil ? 'இன்றைய நேரடி தசா புக்தி அந்தர சஞ்சாரம்' : 'Active Dasha - Bhukti - Antara Live Tracker'}
                    </h3>
                    <p className="text-[11px] font-mono text-stone-600 dark:text-stone-400">
                      {isTamil ? horoscope.summary.currentDashaToday.textTa : horoscope.summary.currentDashaToday.textEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    {isTamil ? `${horoscope.summary.currentDashaToday.progressPct}% முடிந்தது` : `${horoscope.summary.currentDashaToday.progressPct}% Elapsed`}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1 shadow-2xs">
                    <span>⏳</span>
                    <span>
                      {isTamil
                        ? `நடப்பு மகாதிசை: ${horoscope.summary.currentDashaToday.mahadasha?.nameTa || ''} திசை (${horoscope.summary.currentDashaToday.dashaDaysRemaining || horoscope.summary.currentDashaToday.daysRemaining} நாட்கள் மீதம்) | நடப்பு புக்தி: ${horoscope.summary.currentDashaToday.bhukti?.nameTa || ''} புக்தி (${horoscope.summary.currentDashaToday.daysRemaining} நாட்கள் மீதம்)`
                        : `Current Mahadasha: ${horoscope.summary.currentDashaToday.mahadasha?.nameEn || ''} Dasha (${horoscope.summary.currentDashaToday.dashaDaysRemaining || horoscope.summary.currentDashaToday.daysRemaining} days left) | Current Bhukti: ${horoscope.summary.currentDashaToday.bhukti?.nameEn || ''} Bhukti (${horoscope.summary.currentDashaToday.daysRemaining} days left)`}
                    </span>
                  </span>
                </div>
              </div>

              {/* 3 Interactive Cards: Mahadasha -> Bhukti -> Antara */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-900 border border-emerald-500/20 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold uppercase">{isTamil ? 'மகாதிசை (Level 1)' : 'Mahadasha (Level 1)'}</span>
                  <span className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] block mt-0.5">
                    {isTamil ? horoscope.summary.currentDashaToday.mahadasha?.nameTa : horoscope.summary.currentDashaToday.mahadasha?.nameEn}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500 block">
                    {horoscope.dashaTable.find(d => d.isOngoingToday)?.startDate} ➔ {horoscope.dashaTable.find(d => d.isOngoingToday)?.endDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-900 border border-emerald-500/30 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold uppercase">{isTamil ? 'புக்தி (Level 2)' : 'Bhukti (Level 2)'}</span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 block mt-0.5">
                    {isTamil ? horoscope.summary.currentDashaToday.bhukti?.nameTa : horoscope.summary.currentDashaToday.bhukti?.nameEn}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500 block">
                    {horoscope.summary.currentDashaToday.startDate} ➔ {horoscope.summary.currentDashaToday.endDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-900 border border-emerald-500/40 shadow-2xs ring-1 ring-emerald-500/30">
                  <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">{isTamil ? 'அந்தரம் (Level 3 - சூட்சுமம்)' : 'Antara (Level 3)'}</span>
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-300 block mt-0.5">
                    {isTamil ? horoscope.summary.currentDashaToday.antara?.nameTa : horoscope.summary.currentDashaToday.antara?.nameEn}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500 block">
                    {horoscope.summary.currentDashaToday.antaraStartDate} ➔ {horoscope.summary.currentDashaToday.antaraEndDate}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${horoscope.summary.currentDashaToday.progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>{horoscope.summary.currentDashaToday.startDate} ({isTamil ? 'துவக்கம்' : 'Start'})</span>
                  <span>{horoscope.summary.currentDashaToday.endDate} ({isTamil ? 'முடிவு' : 'End'})</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {horoscope.dashaTable.map((md, idx) => {
              const isExpanded = expandedMdIndex === idx;

              return (
                <div
                  key={md.lord.id}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    md.isOngoingToday
                      ? 'border-emerald-500/60 dark:border-emerald-500/50 shadow-xs bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-amber-900/15 dark:border-stone-800 bg-[#FAF6EF]/60 dark:bg-[#1A1513]/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMdIndex(isExpanded ? -1 : idx)}
                    className="w-full p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold hover:bg-amber-900/10 dark:hover:bg-stone-800/70 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-[#7A1A22] dark:text-amber-400">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span className="text-sm text-[#7A1A22] dark:text-[#E8838B] font-bold">
                        {idx + 1}. {isTamil ? md.lord.nameTa : md.lord.nameEn} {T.mahadasha} ({md.lord.years} {isTamil ? 'ஆண்டுகள்' : 'Years'})
                      </span>

                      {/* Status Badges */}
                      {md.isBirthDasha && md.balanceAtBirth && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-[#7A1A22] dark:text-amber-200 border border-amber-400">
                          {isTamil ? `பிறந்த திசை இருப்பு: ${md.balanceAtBirth.textTa}` : `Birth Balance: ${md.balanceAtBirth.textEn}`}
                        </span>
                      )}

                      {md.isOngoingToday && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                          <span>🌟</span>
                          <span>{T.dashaCurrentToday}</span>
                          {(horoscope.summary?.currentDashaToday?.dashaDaysRemaining !== undefined || horoscope.summary?.currentDashaToday?.daysRemaining !== undefined) && (
                            <span className="bg-emerald-800/60 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded text-[9px] font-mono font-medium ml-0.5">
                              {isTamil
                                ? `நடப்பு மகாதிசை: ${horoscope.summary.currentDashaToday.mahadasha?.nameTa || md.lord.nameTa} மகாதிசை - ${horoscope.summary.currentDashaToday.dashaDaysRemaining || horoscope.summary.currentDashaToday.daysRemaining} நாட்கள் மீதம்`
                                : `Current Mahadasha: ${horoscope.summary.currentDashaToday.mahadasha?.nameEn || md.lord.nameEn} Mahadasha - ${horoscope.summary.currentDashaToday.dashaDaysRemaining || horoscope.summary.currentDashaToday.daysRemaining} days left`}
                            </span>
                          )}
                        </span>
                      )}

                      {!md.isOngoingToday && md.isPastToday && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          {T.completedStatus}
                        </span>
                      )}

                      {!md.isOngoingToday && !md.isPastToday && !md.isBirthDasha && (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-stone-100 dark:bg-stone-800/40 text-stone-500 dark:text-stone-400">
                          {T.upcomingStatus}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      {md.ageAtEnd && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-300 border border-amber-300 dark:border-stone-700">
                          {isTamil ? `முடிவு வயது: ${md.ageAtEnd.textTa}` : `Age at End: ${md.ageAtEnd.textEn}`}
                        </span>
                      )}
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{md.startDate}</span>
                      <span>➔</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{md.endDate}</span>
                    </div>
                  </button>

                  {/* Bhukti Accordion Content */}
                  {isExpanded && (
                    <div className="p-3 sm:p-4 bg-white dark:bg-[#201A16] border-t border-amber-900/10 space-y-2.5">
                      {/* Pasakar, Bodhakar, Karagar, Vedhakar 4-Roles Banner */}
                      {(() => {
                        const roles = md.fourRoles || getGrahaFourRoles(md.lord?.id);
                        if (!roles) return null;
                        return (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                              <span className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                                <span>👑</span>
                                <span>
                                  {isTamil
                                    ? `${md.lord.nameTa} திசா நாதனின் 4 முக்கிய கிரகப் பங்களிப்பு (பராசரர் முறை):`
                                    : `4 Functional Planetary Roles for ${md.lord.nameEn} Dasha Lord:`}
                                </span>
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono">
                                {isTamil ? 'திசா பலன்களைத் தூண்டும் கிரகங்கள்' : 'Actionable Trigger Planets'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-700/60 flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                                  {isTamil ? 'பாசகர் (சீக்கிர பலன்)' : 'Pasakar (Fast Result)'}
                                </span>
                                <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                  {isTamil ? roles.pasakarTa : roles.pasakarEn}
                                </span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-300/80 dark:border-blue-700/60 flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300">
                                  {isTamil ? 'போதகர் (நிறையத் தருபவர்)' : 'Bodhakar (Abundance)'}
                                </span>
                                <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                  {isTamil ? roles.bodhakarTa : roles.bodhakarEn}
                                </span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                                  {isTamil ? 'காரகர் (நிதான பலன்)' : 'Karagar (Steady Fruit)'}
                                </span>
                                <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                  {isTamil ? roles.karagarTa : roles.karagarEn}
                                </span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300/80 dark:border-rose-700/60 flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300">
                                  {isTamil ? 'வேதகர் (தடுத்து சோதிப்பவர்)' : 'Vedhakar (Obstructor/Tester)'}
                                </span>
                                <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                  {isTamil ? roles.vedhakarTa : roles.vedhakarEn}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="text-[11px] font-bold text-stone-600 dark:text-stone-400 pb-1 border-b border-stone-200 dark:border-stone-800 flex justify-between">
                        <span>{isTamil ? `${md.lord.nameTa} மகாதிசையின் 9 புக்திகள்:` : `9 Bhuktis of ${md.lord.nameEn} Mahadasha:`}</span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          {isTamil ? 'பராசரர் விதி: (மகாதிசை × புக்தி / 120)' : 'Formula: (MD × BD / 120)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {md.bhuktis.map((bh, bIdx) => {
                          const isOngoingToday = bh.isOngoingToday;
                          const isOngoingAtBirth = bh.isOngoingAtBirth;
                          const isPastAtBirth = bh.isPastAtBirth;

                          const mdRoles = md.fourRoles || getGrahaFourRoles(md.lord?.id);
                          let bhuktiRoleTag = null;
                          if (mdRoles) {
                            if (bh.bhuktiLord?.id === mdRoles.pasakarId) {
                              bhuktiRoleTag = { labelTa: 'பாசகர்', labelEn: 'Pasakar', badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' };
                            } else if (bh.bhuktiLord?.id === mdRoles.bodhakarId) {
                              bhuktiRoleTag = { labelTa: 'போதகர்', labelEn: 'Bodhakar', badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700' };
                            } else if (bh.bhuktiLord?.id === mdRoles.karagarId) {
                              bhuktiRoleTag = { labelTa: 'காரகர்', labelEn: 'Karagar', badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700' };
                            } else if (bh.bhuktiLord?.id === mdRoles.vedhakarId) {
                              bhuktiRoleTag = { labelTa: 'வேதகர்', labelEn: 'Vedhakar', badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700' };
                            }
                          }

                          let cardBgClass = 'bg-[#FAF6EF]/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800';
                          if (isOngoingToday) {
                            cardBgClass = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600 font-bold ring-1 ring-emerald-400';
                          } else if (isOngoingAtBirth) {
                            cardBgClass = 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-400 font-semibold';
                          } else if (isPastAtBirth) {
                            cardBgClass = 'bg-stone-100/50 dark:bg-stone-900/20 border-stone-200 dark:border-stone-800/60 opacity-60';
                          }

                          return (
                            <div
                              key={bh.bhuktiLord.id}
                              className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-1.5 transition-all ${cardBgClass}`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-[#7A1A22] dark:text-amber-200 text-[11.5px]">
                                  {bIdx + 1}. {isTamil ? `${md.lord.nameTa} - ${bh.bhuktiLord.nameTa}` : `${md.lord.nameEn} - ${bh.bhuktiLord.nameEn}`}
                                </span>
                                {bhuktiRoleTag && (
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border shrink-0 ${bhuktiRoleTag.badgeClass}`}>
                                    {isTamil ? bhuktiRoleTag.labelTa : bhuktiRoleTag.labelEn}
                                  </span>
                                )}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                                    {isTamil ? bh.duration.textTa : bh.duration.textEn}
                                  </span>
                                  {bh.ageAtEnd && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-[#7A1A22] dark:text-amber-300 font-semibold">
                                      {isTamil ? `வயது: ${bh.ageAtEnd.textTa}` : `Age: ${bh.ageAtEnd.textEn}`}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[10.5px] font-mono text-stone-600 dark:text-stone-400">
                                <span>{bh.startDate}</span>
                                <span>➔</span>
                                <span>{bh.endDate}</span>
                              </div>

                              {/* Bhukti status pill & Antaras Button */}
                              <div className="flex items-center justify-between pt-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const key = `${md.lord.id}-${bh.bhuktiLord.id}`;
                                    setExpandedBhuktiKey(expandedBhuktiKey === key ? null : key);
                                  }}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/60 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1A22] dark:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>⚡</span>
                                  <span>{isTamil ? 'அந்தரங்கள் (9)' : 'Antaras (9)'}</span>
                                  <span>{expandedBhuktiKey === `${md.lord.id}-${bh.bhuktiLord.id}` ? '▲' : '▼'}</span>
                                </button>

                                <div>
                                  {isOngoingToday && (
                                    <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                                      <span>🌟</span>
                                      <span>{T.bhuktiCurrentToday}</span>
                                      {horoscope.summary?.currentDashaToday?.daysRemaining !== undefined && (
                                        <span className="bg-emerald-800/60 dark:bg-emerald-950/80 px-1 py-0.2 rounded text-[8.5px] font-mono font-medium">
                                          ({isTamil
                                            ? `நடப்பு புக்தி: ${horoscope.summary.currentDashaToday.bhukti?.nameTa || bh.bhuktiLord?.nameTa || ''} புக்தி - ${horoscope.summary.currentDashaToday.daysRemaining} நாட்கள் மீதம்`
                                            : `Current Bhukti: ${horoscope.summary.currentDashaToday.bhukti?.nameEn || bh.bhuktiLord?.nameEn || ''} Bhukti - ${horoscope.summary.currentDashaToday.daysRemaining} days left`})
                                        </span>
                                      )}
                                    </span>
                                  )}
                                  {!isOngoingToday && isOngoingAtBirth && (
                                    <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-amber-500 text-white flex items-center gap-0.5">
                                      <span>👶</span>
                                      <span>{T.bhuktiOngoingAtBirth}</span>
                                    </span>
                                  )}
                                  {!isOngoingToday && !isOngoingAtBirth && isPastAtBirth && (
                                    <span className="text-[9px] px-1 py-0.2 rounded text-stone-400">
                                      {T.bhuktiPriorToBirth}
                                    </span>
                                  )}
                                  {!isOngoingToday && !isPastAtBirth && bh.isPastToday && (
                                    <span className="text-[9px] px-1 py-0.2 rounded text-stone-400">
                                      {T.completedStatus}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* LEVEL 3 ANTARAS BREAKDOWN GRID */}
                              {expandedBhuktiKey === `${md.lord.id}-${bh.bhuktiLord.id}` && bh.antaras && (
                                <div className="p-2.5 bg-white dark:bg-[#1A1513] rounded-lg border border-amber-900/20 shadow-xs space-y-2 mt-1">
                                  <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
                                    <span className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1">
                                      <span>⚡</span>
                                      <span>{isTamil ? `${bh.bhuktiLord.nameTa} புக்தியின் 9 அந்தரங்கள்:` : `9 Antaras of ${bh.bhuktiLord.nameEn}:`}</span>
                                    </span>
                                    <span className="text-[9.5px] text-stone-500 font-mono">
                                      {isTamil ? 'சூட்சும காலம் (Antaras)' : 'Sub-Sub Periods'}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 gap-1.5">
                                    {bh.antaras.map((an, aIdx) => {
                                      let anBg = 'bg-stone-50/70 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800';
                                      if (an.isOngoingToday) {
                                        anBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold ring-1 ring-emerald-400';
                                      } else if (an.isPastToday) {
                                        anBg = 'bg-stone-100/40 dark:bg-stone-900/20 border-stone-200 opacity-60';
                                      }

                                      return (
                                        <div key={an.lord.id} className={`p-1.5 rounded border text-[10.5px] flex items-center justify-between gap-1.5 ${anBg}`}>
                                          <div className="flex items-center gap-1 min-w-[70px]">
                                            <span className="text-stone-400 text-[9.5px]">{aIdx + 1}.</span>
                                            <span className="font-bold text-[#7A1A22] dark:text-amber-200">
                                              {isTamil ? an.lord.nameTa : an.lord.nameEn}
                                            </span>
                                          </div>

                                          <div className="font-mono text-[10px] text-stone-600 dark:text-stone-400">
                                            <span>{an.startDate}</span> ➔ <span>{an.endDate}</span>
                                          </div>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500">
                                              {an.durationDays}{isTamil ? 'நா' : 'd'}
                                            </span>
                                            {an.isOngoingToday && (
                                              <span className="text-[8.5px] px-1 py-0.2 rounded font-bold bg-emerald-600 text-white shrink-0">
                                                {isTamil ? 'நடப்பு' : 'Live'}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 5: 5. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு (4. Sripati Bhava Sphutam Table) */}
        {/* ======================================================== */}
        <div id="horoscope-section-5" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(5)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                5
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>📐</span>
                  <span>{isTamil ? '5. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு' : '5. Sripati Bhava Sphutam Table'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'ஸ்ரீபதி பத்ததி முறைப்படி 12 பாவகங்களின் ஆரம்பம், மத்திமம் (Cusp) மற்றும் முடிவு நிலைகள்' : 'Sripati System 12 House Cusps (Prarambha, Madhya, Antya)'}
                </p>
              </div>
            </div>

            {renderSectionBadge(5, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">12 {isTamil ? 'பாவங்கள்' : 'Bhavas'}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[5] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 5: Sripati Bhava Sphutam Table */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-900/20 text-[#7A1A22] dark:text-amber-300 font-bold bg-amber-900/5 dark:bg-stone-800">
                  <th className="py-2 px-3 text-center">{T.bhavaNum}</th>
                  <th className="py-2 px-3">{T.start}</th>
                  <th className="py-2 px-3">{T.madhya}</th>
                  <th className="py-2 px-3">{T.end}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 font-mono text-[11px]">
                {horoscope.sripatiBhavas.map(b => (
                  <tr key={b.bhava} className="hover:bg-amber-900/5 dark:hover:bg-stone-800/50">
                    <td className="py-1.5 px-3 text-center font-bold font-serif text-[#7A1A22] dark:text-amber-300">
                      {b.bhava}
                    </td>
                    <td className="py-1.5 px-3">
                      {b.startDMS} ({isTamil ? RASHIS[b.startRasi].ta : RASHIS[b.startRasi].en})
                    </td>
                    <td className="py-1.5 px-3 font-bold text-[#7A1A22] dark:text-amber-200">
                      {b.madhyaDMS} ({isTamil ? RASHIS[b.madhyaRasi].ta : RASHIS[b.madhyaRasi].en})
                    </td>
                    <td className="py-1.5 px-3">
                      {b.endDMS} ({isTamil ? RASHIS[b.endRasi].ta : RASHIS[b.endRasi].en})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 6: 6. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு (5. Shadbala & Bhava Bala Analysis) */}
        {/* ======================================================== */}
        <div id="horoscope-section-6" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(6)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                6
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>⚖️</span>
                  <span>{isTamil ? '6. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு' : '6. Shadbala & Bhava Bala Analysis'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் முறைப்படி கிரகங்களின் அறுவகை பலங்கள் மற்றும் 12 பாவகங்களின் பலங்கள் (ரூபங்களில்)' : 'Parashari 6-fold planetary strengths and 12 house strengths (in Rupas)'}
                </p>
              </div>
            </div>

            {renderSectionBadge(6, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? 'ஷட்பலம் & பாவக பலம்' : 'Shadbala Rupas'}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[6] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 6: Shadbala & Bhava Bala Analysis (ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு) */}
              {horoscope.shadbala && (
                <div className="space-y-4">
                  {/* Mode Selector Toggle: Visual Bar Charts vs Detailed Tables */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50/70 dark:bg-amber-950/20 p-2 sm:p-2.5 rounded-xl border border-amber-900/10 dark:border-amber-500/15">
                    <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <span>👁️</span>
                      <span>{isTamil ? 'காட்சி முறை (Display Mode):' : 'Display Mode:'}</span>
                    </div>
                    <div className="inline-flex rounded-lg bg-white dark:bg-stone-800 p-0.5 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setShadbalaDisplayMode('chart')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          shadbalaDisplayMode === 'chart'
                            ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                            : 'text-stone-600 dark:text-stone-300 hover:text-[#7A1A22]'
                        }`}
                      >
                        {isTamil ? '📊 வரைபட பலம் (Visual Bar Charts)' : '📊 Visual Bar Charts'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShadbalaDisplayMode('table')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          shadbalaDisplayMode === 'table'
                            ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                            : 'text-stone-600 dark:text-stone-300 hover:text-[#7A1A22]'
                        }`}
                      >
                        {isTamil ? '📋 விரிவான அட்டவணை (Tables)' : '📋 Detailed Tables'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShadbalaDisplayMode('both')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                          shadbalaDisplayMode === 'both'
                            ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                            : 'text-stone-600 dark:text-stone-300 hover:text-[#7A1A22]'
                        }`}
                      >
                        {isTamil ? '✨ இரண்டும் (Both)' : '✨ Both'}
                      </button>
                    </div>
                  </div>

                  {/* Render Visual Bar Charts */}
                  {(shadbalaDisplayMode === 'chart' || shadbalaDisplayMode === 'both') && (
                    <ShadbalaBarChart shadbalaData={horoscope.shadbala} isTamil={isTamil} />
                  )}

                  {/* Render Numerical Tables */}
                  {(shadbalaDisplayMode === 'table' || shadbalaDisplayMode === 'both') && (
                    <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4">
                      {/* Table 1: Graha Shadbala */}
                      <div className="space-y-1.5">
                        <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300">
                          {T.grahaShadbala}
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                          <table className="w-full text-xs text-center border-collapse">
                            <thead>
                              <tr className="bg-amber-100/70 dark:bg-amber-900/30 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                                <th className="py-2 px-3 text-left">{T.strength}</th>
                                {(isTamil ? horoscope.shadbala.grahaHeaders.slice(1) : horoscope.shadbala.grahaHeadersEn.slice(1)).map((gh, idx) => (
                                  <th key={idx} className="py-2 px-2.5">{gh}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/15">
                              {horoscope.shadbala.grahaRows.map((row, rIdx) => {
                                const isTot = row.isTotal;
                                return (
                                  <tr
                                    key={rIdx}
                                    className={
                                      isTot
                                        ? 'bg-amber-200/50 dark:bg-amber-900/40 font-bold text-[#7A1A22] dark:text-amber-200'
                                        : 'hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors'
                                    }
                                  >
                                    <td className="py-1.5 px-3 text-left font-semibold">
                                      {isTamil ? row.label : row.labelEn}
                                    </td>
                                    {row.vals.map((v, vIdx) => (
                                      <td key={vIdx} className="py-1.5 px-2.5 font-mono text-[11px]">
                                        {v}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Table 2: Bhava Bala */}
                      <div className="space-y-1.5 pt-2">
                        <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300">
                          {T.bhavaBala}
                        </h3>
                        <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                          <table className="w-full text-xs text-center border-collapse">
                            <thead>
                              <tr className="bg-amber-100/70 dark:bg-amber-900/30 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                                <th className="py-2 px-3 text-left">{T.house}</th>
                                {horoscope.shadbala.bhavaHeaders.map(bh => (
                                  <th key={bh} className="py-2 px-2 font-mono">{bh}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/15">
                              {horoscope.shadbala.bhavaRows.map((row, rIdx) => {
                                const isTot = row.isTotal;
                                return (
                                  <tr
                                    key={rIdx}
                                    className={
                                      isTot
                                        ? 'bg-amber-200/50 dark:bg-amber-900/40 font-bold text-[#7A1A22] dark:text-amber-200'
                                        : 'hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors'
                                    }
                                  >
                                    <td className="py-1.5 px-3 text-left font-semibold">
                                      {isTamil ? row.label : row.labelEn}
                                    </td>
                                    {row.vals.map((v, vIdx) => (
                                      <td key={vIdx} className="py-1.5 px-2 font-mono text-[11px]">
                                        {v}
                                      </td>
                                    ))}
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
              )}
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 7: 7. ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும் (7. Planetary Dasavarga & Dignity Strength Matrix) */}
        {/* ======================================================== */}
        <div id="horoscope-section-7" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(7)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                7
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>👑</span>
                  <span>{isTamil ? '7. ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்' : '7. Planetary Dasavarga & Dignity Strength Matrix'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் முறைப்படி 10 வர்க்கங்களில் கிரகங்களின் ஆட்சி, உச்சம், நட்பு, சமம், பகை, நீச நிலைகள் மற்றும் சுப/அசுப பலம்' : 'Parashari 10-Varga Dignity Strengths with 79 Subha / 21 Asubha Total Scores'}
                </p>
              </div>
            </div>

            {renderSectionBadge(7, (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">{isTamil ? 'சுபம் 79 / அசுபம் 21' : 'Subha 79 / Asubha 21'}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[7] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* Interactive Dasavarga & Shodashavarga Dignity Strength Section (Page 20 Benchmark) */}
          {horoscope.dasavarga && (
            <div className="mt-4 p-3.5 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-stone-800/40 border border-amber-900/15 space-y-3.5">
              <div className="flex items-center justify-end gap-2.5 border-b border-amber-900/10 pb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <span>🌟</span>
                    <span>{isTamil ? `சுப பலம்: ${horoscope.dasavarga.grandSubha}` : `Subha: ${horoscope.dasavarga.grandSubha}`}</span>
                    <span className="text-[10px] font-normal opacity-75">({horoscope.dasavarga.grandSubha}%)</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    <span>⚡</span>
                    <span>{isTamil ? `அசுப பலம்: ${horoscope.dasavarga.grandAsubha}` : `Asubha: ${horoscope.dasavarga.grandAsubha}`}</span>
                    <span className="text-[10px] font-normal opacity-75">({horoscope.dasavarga.grandAsubha}%)</span>
                  </div>
                </div>
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-amber-900/10 dark:bg-stone-900 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDasavargaMode('bala')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      dasavargaMode === 'bala'
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span>{isTamil ? '📊 தசவர்க்க பலம் (Dignity)' : '📊 Dignity Matrix'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDasavargaMode('rasi')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      dasavargaMode === 'rasi'
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span>{isTamil ? '🏛️ தசவர்க்க ராசி (Rasi)' : '🏛️ Rasi Placements'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDasavargaMode('shodashavarga')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      dasavargaMode === 'shodashavarga'
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    <span>{isTamil ? '📜 16 வர்க்க முழு அட்டவணை' : '📜 16-Varga Full'}</span>
                  </button>
                </div>

                <div className="text-[10.5px] text-stone-500 font-mono">
                  {isTamil ? '10 வர்க்கங்கள் × 10 நிலைகள் = 100 பலன்கள்' : '10 Vargas × 10 Entities = 100 Total Points'}
                </div>
              </div>

              {/* TABLE 1: DASAVARGA DIGNITY MATRIX (BALA) */}
              {dasavargaMode === 'bala' && (
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 bg-white/90 dark:bg-stone-900/80 shadow-2xs">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/80 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 text-[11px]">
                        <th className="py-2.5 px-3 text-left">{isTamil ? 'வர்க்கம்' : 'Varga'}</th>
                        {(isTamil ? horoscope.dasavarga.grahaHeadersTa : horoscope.dasavarga.grahaHeadersEn).map((gh, idx) => (
                          <th key={gh} className={`py-2.5 px-1.5 text-center ${idx === 9 ? 'font-bold text-[#7A1A22] dark:text-amber-300' : ''}`}>
                            {gh}
                          </th>
                        ))}
                        <th className="py-2.5 px-2 text-center bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border-l border-amber-900/10">
                          {isTamil ? 'சுப' : 'Subha'}
                        </th>
                        <th className="py-2.5 px-2 text-center bg-rose-500/10 text-rose-800 dark:text-rose-300 font-bold">
                          {isTamil ? 'அசுப' : 'Asubha'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 text-[11.5px]">
                      {horoscope.dasavarga.rows.map(row => {
                        const isRowActive = activeChartKey === row.key;
                        return (
                          <tr
                            key={row.key}
                            onClick={() => setActiveChartKey(row.key)}
                            className={`cursor-pointer transition-colors ${
                              isRowActive
                                ? 'bg-amber-500/15 dark:bg-amber-500/20 font-semibold'
                                : 'hover:bg-amber-50/70 dark:hover:bg-stone-800/60'
                            }`}
                          >
                            <td className="py-2 px-3 text-left font-bold text-[#7A1A22] dark:text-amber-200 whitespace-nowrap">
                              <span className="mr-1">{isRowActive ? '▶' : ''}</span>
                              <span>{isTamil ? row.nameTa : row.nameEn}</span>
                            </td>

                            {row.dignities.map((dig, dIdx) => {
                              let badgeClass = 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300';
                              if (dig === 'உ') badgeClass = 'bg-red-700 text-white font-bold shadow-2xs';
                              else if (dig === 'ஆ') badgeClass = 'bg-emerald-600 text-white font-bold shadow-2xs';
                              else if (dig === 'ந') badgeClass = 'bg-blue-600/85 text-white font-medium';
                              else if (dig === 'ச') badgeClass = 'bg-stone-400 text-stone-900 dark:bg-stone-700 dark:text-stone-100';
                              else if (dig === 'ப') badgeClass = 'bg-amber-600 text-white font-medium';
                              else if (dig === 'நீ') badgeClass = 'bg-rose-900 text-white font-bold shadow-2xs';

                              const digLabel = isTamil
                                ? dig
                                : (dig === 'உ' ? 'Ex' : dig === 'ஆ' ? 'Own' : dig === 'ந' ? 'Fr' : dig === 'ச' ? 'Neu' : dig === 'ப' ? 'En' : dig === 'நீ' ? 'Db' : dig);

                              return (
                                <td key={dIdx} className="py-2 px-1 text-center font-mono text-[11px]">
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10.5px] min-w-[20px] ${badgeClass}`}>
                                    {digLabel}
                                  </span>
                                </td>
                              );
                            })}

                            <td className="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 border-l border-amber-900/10">
                              {row.subha}
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-rose-700 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/20">
                              {row.asubha}
                            </td>
                          </tr>
                        );
                      })}

                      {/* SUMMARY ROW 1: SUBHA BALAM */}
                      <tr className="bg-emerald-100/60 dark:bg-emerald-950/30 font-bold border-t-2 border-emerald-600/30 text-[11px]">
                        <td className="py-2 px-3 text-left text-emerald-900 dark:text-emerald-200 whitespace-nowrap">
                          {isTamil ? 'சுப பலம் (Subha)' : 'Subha Points'}
                        </td>
                        {horoscope.dasavarga.subhaTotals.slice(0, 10).map((st, i) => (
                          <td key={i} className="py-2 px-1 text-center text-emerald-800 dark:text-emerald-300 font-bold">
                            {st}
                          </td>
                        ))}
                        <td colSpan={2} className="py-2 px-2 text-center font-extrabold text-xs text-emerald-900 dark:text-emerald-200 border-l border-amber-900/10">
                          {horoscope.dasavarga.grandSubha}
                        </td>
                      </tr>

                      {/* SUMMARY ROW 2: ASUBHA BALAM */}
                      <tr className="bg-rose-100/60 dark:bg-rose-950/30 font-bold border-t border-rose-300/40 text-[11px]">
                        <td className="py-2 px-3 text-left text-rose-900 dark:text-rose-200 whitespace-nowrap">
                          {isTamil ? 'அசுப பலம் (Asubha)' : 'Asubha Points'}
                        </td>
                        {horoscope.dasavarga.asubhaTotals.slice(0, 10).map((at, i) => (
                          <td key={i} className="py-2 px-1 text-center text-rose-800 dark:text-rose-300 font-bold">
                            {at}
                          </td>
                        ))}
                        <td colSpan={2} className="py-2 px-2 text-center font-extrabold text-xs text-rose-900 dark:text-rose-200 border-l border-amber-900/10">
                          {horoscope.dasavarga.grandAsubha}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABLE 2: DASAVARGA RASI PLACEMENTS */}
              {dasavargaMode === 'rasi' && (
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 bg-white/90 dark:bg-stone-900/80 shadow-2xs">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/80 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 text-[11px]">
                        <th className="py-2.5 px-3 text-left">{isTamil ? 'வர்க்கம்' : 'Varga'}</th>
                        {(isTamil ? horoscope.dasavarga.grahaHeadersTa : horoscope.dasavarga.grahaHeadersEn).map((gh, idx) => (
                          <th key={gh} className={`py-2.5 px-1.5 text-center ${idx === 9 ? 'font-bold text-[#7A1A22] dark:text-amber-300' : ''}`}>
                            {gh}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 text-[11.5px]">
                      {horoscope.dasavarga.rows.map(row => {
                        const isRowActive = activeChartKey === row.key;
                        return (
                          <tr
                            key={row.key}
                            onClick={() => setActiveChartKey(row.key)}
                            className={`cursor-pointer transition-colors ${
                              isRowActive
                                ? 'bg-amber-500/15 dark:bg-amber-500/20 font-semibold'
                                : 'hover:bg-amber-50/70 dark:hover:bg-stone-800/60'
                            }`}
                          >
                            <td className="py-2 px-3 text-left font-bold text-[#7A1A22] dark:text-amber-200 whitespace-nowrap">
                              <span className="mr-1">{isRowActive ? '▶' : ''}</span>
                              <span>{isTamil ? row.nameTa : row.nameEn}</span>
                            </td>

                            {(isTamil ? row.signsTa : row.signsEn).map((sg, sIdx) => (
                              <td key={sIdx} className="py-2 px-1 text-center font-mono font-semibold text-stone-700 dark:text-stone-300">
                                <span className="inline-block px-2 py-0.5 rounded bg-amber-50/80 dark:bg-stone-800 border border-amber-900/10 text-[11px]">
                                  {sg}
                                </span>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABLE 3: 16-VARGA FULL MASTER TABLE */}
              {dasavargaMode === 'shodashavarga' && (
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 bg-white/90 dark:bg-stone-900/80 shadow-2xs">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/80 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 text-[11px]">
                        <th className="py-2.5 px-3 text-left">{isTamil ? 'வர்க்கம்' : 'Varga'}</th>
                        <th className="py-2.5 px-2 text-left hidden sm:table-cell">{isTamil ? 'காரகத்துவம்' : 'Domain'}</th>
                        {[
                          { id: 'lagna', ta: 'லக்', en: 'Lag', isLagna: true },
                          { id: 'sun', ta: 'சூரி', en: 'Sun' },
                          { id: 'moon', ta: 'சந்', en: 'Moo' },
                          { id: 'mars', ta: 'செவ்', en: 'Mar' },
                          { id: 'mercury', ta: 'புத', en: 'Mer' },
                          { id: 'jupiter', ta: 'குரு', en: 'Jup' },
                          { id: 'venus', ta: 'சுக்', en: 'Ven' },
                          { id: 'saturn', ta: 'சனி', en: 'Sat' },
                          { id: 'rahu', ta: 'ராகு', en: 'Rah' },
                          { id: 'ketu', ta: 'கேது', en: 'Ket' },
                          { id: 'mandi', ta: 'மாந்', en: 'Man', isMandi: true }
                        ].map(c => {
                          const pl = horoscope.planets?.find(p => p.id === c.id);
                          const isR = Boolean(pl?.isRetrograde);
                          const label = isTamil
                            ? (isR ? `${c.ta}(வ)` : c.ta)
                            : (isR ? `${c.en}(R)` : c.en);
                          return (
                            <th
                              key={c.id}
                              className={`py-2.5 px-1 text-center ${
                                c.isLagna
                                  ? 'text-[#7A1A22] dark:text-amber-300 font-bold'
                                  : c.isMandi
                                  ? 'text-stone-500'
                                  : isR
                                  ? 'text-amber-900 dark:text-amber-300 font-black'
                                  : ''
                              }`}
                              title={isR ? (isTamil ? 'வக்ர கதி' : 'Retrograde Motion') : undefined}
                            >
                              {label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 text-[11px]">
                      {horoscope.shodashavarga.map(row => {
                        const isRowActive = activeChartKey === row.key;
                        return (
                          <tr
                            key={row.key}
                            onClick={() => setActiveChartKey(row.key)}
                            className={`cursor-pointer transition-colors ${
                              isRowActive
                                ? 'bg-amber-500/15 dark:bg-amber-500/20 font-semibold'
                                : 'hover:bg-amber-50/70 dark:hover:bg-stone-800/60'
                            }`}
                          >
                            <td className="py-2 px-3 text-left font-bold text-[#7A1A22] dark:text-amber-200 whitespace-nowrap">
                              <span className="mr-1">{isRowActive ? '▶' : ''}</span>
                              <span>{isTamil ? row.nameTa : row.nameEn}</span>
                            </td>
                            <td className="py-2 px-2 text-left text-[10.5px] text-stone-600 dark:text-stone-400 hidden sm:table-cell">
                              {isTamil ? row.domainTa : row.domainEn}
                            </td>

                            {['lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi'].map(pId => {
                              const pl = row.planets[pId];
                              if (!pl) return <td key={pId} className="py-2 px-1">-</td>;

                              let dignityClass = '';
                              if (pl.dignityTa === 'உ') dignityClass = 'bg-red-700 text-white font-bold';
                              else if (pl.dignityTa === 'ஆ') dignityClass = 'bg-emerald-600 text-white font-bold';
                              else if (pl.dignityTa === 'ந') dignityClass = 'bg-blue-600 text-white';
                              else if (pl.dignityTa === 'ப') dignityClass = 'bg-orange-600 text-white';
                              else if (pl.dignityTa === 'நீ') dignityClass = 'bg-rose-900 text-white font-bold';

                              return (
                                <td key={pId} className="py-2 px-1 font-mono text-[11px]">
                                  <span className={pId === 'lagna' ? 'font-bold text-[#7A1A22] dark:text-amber-300' : 'text-stone-700 dark:text-stone-300'}>
                                    {isTamil ? pl.signShortTa : pl.signShortEn}
                                  </span>
                                  {pl.dignityTa && (
                                    <span className={`text-[8.5px] ml-0.5 px-0.8 py-0.2 rounded ${dignityClass}`}>
                                      {isTamil ? pl.dignityTa : (pl.dignityEn || (pl.dignityTa === 'உ' ? 'Ex' : pl.dignityTa === 'ஆ' ? 'Own' : pl.dignityTa === 'ந' ? 'Fr' : pl.dignityTa === 'ச' ? 'Neu' : pl.dignityTa === 'ப' ? 'En' : pl.dignityTa === 'நீ' ? 'Db' : pl.dignityTa))}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dignity Key / Legend */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-amber-900/10 text-[10.5px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-600 dark:text-stone-400">{isTamil ? 'பலம் குறியீடுகள்:' : 'Dignity Key:'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-700 text-white font-bold text-[9.5px]">{isTamil ? 'உ - உச்சம்' : 'Ex - Exalted'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9.5px]">{isTamil ? 'ஆ - ஆட்சி' : 'Own - Own Sign'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9.5px]">{isTamil ? 'ந - நட்பு' : 'Fr - Friend'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-400 text-stone-900 text-[9.5px]">{isTamil ? 'ச - சமம்' : 'Neu - Neutral'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white text-[9.5px]">{isTamil ? 'ப - பகை' : 'En - Enemy'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-900 text-white font-bold text-[9.5px]">{isTamil ? 'நீ - நீசம்' : 'Db - Debilitated'}</span>
                </div>
                <div className="text-[10px] text-stone-500 font-mono">
                  {isTamil ? 'சுப பலம்: (உ, ஆ, ந, ச) • அசுப பலம்: (ப, நீ)' : 'Subha: (Exalt, Own, Friend, Neutral) • Asubha: (Enemy, Debil)'}
                </div>
              </div>
            </div>
          )}
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 8: 8. ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்) (8. Ashtakavarga & Sarvashtakavarga (337 Bindus)) */}
        {/* ======================================================== */}
        <div id="horoscope-section-8" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(8)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                8
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🔢</span>
                  <span>{isTamil ? '8. ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)' : '8. Ashtakavarga & Sarvashtakavarga (337 Bindus)'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் முறைப்படி 7 கிரகங்களின் பின்னாஷ்டகவர்க்கம், சர்வாஷ்டகவர்க்கப் பரல்கள் மற்றும் பாவக ஆய்வுகள்' : 'Parashari 7-Graha Bhinna Ashtakavarga, 12 Signs Sarvashtakavarga Chart & Diagnostics'}
                </p>
              </div>
            </div>

            {renderSectionBadge(8, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{horoscope.ashtakavarga?.grandTotal || 337} {isTamil ? 'பரல்கள்' : 'Bindus'}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[8] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 5C: Ashtakavarga & Sarvashtakavarga (அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் - 337 பரல்கள்) */}
        {horoscope.ashtakavarga && (
          <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-5">
            {/* Section Header */}
            <div className="border-b border-amber-900/10 dark:border-amber-500/15 pb-2 flex justify-end items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-[#7A1A22] dark:text-amber-200 border border-amber-900/20 shrink-0">
                <span>✨</span>
                <span>337 {isTamil ? 'பரல்கள் (பராசரர் விதி)' : 'Bindus (Parashari Invariant)'}</span>
              </div>
            </div>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Card 1: Grand Total */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20">
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">{T.grandTotal}</div>
                <div className="text-xl font-black font-mono text-[#7A1A22] dark:text-amber-200 mt-0.5">
                  {horoscope.ashtakavarga.grandTotal}
                </div>
                <div className="text-[10px] text-stone-500 font-medium">
                  {isTamil ? '7 கிரக பரல்களின் கூட்டுத்தொகை' : 'Sum of 7 planet bindus'}
                </div>
              </div>

              {/* Card 2: Inflow vs Outflow */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20">
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">{T.inflowOutflowRatio}</div>
                <div className="text-sm font-black font-mono mt-0.5 flex items-center gap-1.5">
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {horoscope.ashtakavarga.varavinam}
                  </span>
                  <span className="text-stone-400">/</span>
                  <span className="text-rose-700 dark:text-rose-400">
                    {horoscope.ashtakavarga.selavinam}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ml-auto ${
                    parseInt(horoscope.ashtakavarga.varavinam, 10) >= parseInt(horoscope.ashtakavarga.selavinam, 10)
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                  }`}>
                    {parseInt(horoscope.ashtakavarga.varavinam, 10) >= parseInt(horoscope.ashtakavarga.selavinam, 10)
                      ? (isTamil ? 'வரவு அதிகம்' : 'Surplus')
                      : (isTamil ? 'செலவு அதிகம்' : 'Deficit')}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                  {T.inflow}: {horoscope.ashtakavarga.varavinam} | {T.outflow}: {horoscope.ashtakavarga.selavinam}
                </div>
              </div>

              {/* Card 3: Kendram & Trikonam */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20">
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                  {isTamil ? 'கேந்திரம் & திரிகோணம்' : 'Kendram & Trikonam'}
                </div>
                <div className="text-sm font-black font-mono text-stone-800 dark:text-stone-100 mt-0.5 flex items-center gap-2">
                  <span>{horoscope.ashtakavarga.kendram}</span>
                  <span className="text-stone-400 text-xs font-normal">|</span>
                  <span>{horoscope.ashtakavarga.trikonam}</span>
                </div>
                <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                  {T.kendram}: {horoscope.ashtakavarga.kendram} • {T.trikonam}: {horoscope.ashtakavarga.trikonam}
                </div>
              </div>

              {/* Card 4: Upachayam */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20">
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">{T.upachayam}</div>
                <div className="text-xl font-black font-mono text-[#7A1A22] dark:text-amber-200 mt-0.5">
                  {horoscope.ashtakavarga.upachayam}
                </div>
                <div className="text-[10px] text-stone-500 font-medium">
                  {isTamil ? 'உழைப்பால் வளர்ச்சி (3, 6, 10, 11)' : 'Growth houses (3, 6, 10, 11)'}
                </div>
              </div>
            </div>

            {/* Middle Section: Sarvashtakavarga Chart & Diagnostic Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left: 4x4 Chart Grid */}
              <div className="lg:col-span-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#7A1A22] dark:text-amber-300">
                  <span>{T.savChartTitle}</span>
                  <div className="flex items-center gap-2 text-[10px] font-normal text-stone-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>{T.strongBhava}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                      <span>{T.weakBhava}</span>
                    </span>
                  </div>
                </div>
                <SarvashtakavargaChartGrid
                  ashtakavarga={horoscope.ashtakavarga}
                  lagnaRasi={horoscope.summary.lagnaRasi}
                  isTamil={isTamil}
                  T={T}
                />
              </div>

              {/* Right: Directions & House Groups Details */}
              <div className="lg:col-span-6 space-y-4">
                {/* Directional Analysis */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                    <span>🧭</span>
                    <span>{T.directionalTotals}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-amber-50/40 dark:bg-stone-800/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">
                          {isTamil ? '🔥 கிழக்கு (நெருப்பு)' : '🔥 East (Fire)'}
                        </div>
                        <div className="text-[10px] text-stone-500">{isTamil ? 'மேஷம், சிம்மம், தனுசு' : 'Ar, Le, Sg'}</div>
                      </div>
                      <div className="font-black font-mono text-base text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.east}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-amber-50/40 dark:bg-stone-800/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">
                          {isTamil ? '🌍 தெற்கு (பூமி)' : '🌍 South (Earth)'}
                        </div>
                        <div className="text-[10px] text-stone-500">{isTamil ? 'ரிஷபம், கன்னி, மகரம்' : 'Ta, Vi, Cp'}</div>
                      </div>
                      <div className="font-black font-mono text-base text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.south}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-amber-50/40 dark:bg-stone-800/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">
                          {isTamil ? '💨 மேற்கு (காற்று)' : '💨 West (Air)'}
                        </div>
                        <div className="text-[10px] text-stone-500">{isTamil ? 'மிதுனம், துலாம், கும்பம்' : 'Ge, Li, Aq'}</div>
                      </div>
                      <div className="font-black font-mono text-base text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.west}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-amber-50/40 dark:bg-stone-800/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-800 dark:text-stone-200">
                          {isTamil ? '💧 வடக்கு (நீர்)' : '💧 North (Water)'}
                        </div>
                        <div className="text-[10px] text-stone-500">{isTamil ? 'கடகம், விருச்சிகம், மீனம்' : 'Cn, Sc, Pi'}</div>
                      </div>
                      <div className="font-black font-mono text-base text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.north}
                      </div>
                    </div>
                  </div>
                </div>

                {/* House Classification Breakdown */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                    <span>🏛️</span>
                    <span>{isTamil ? 'பாவக வகைப்பாடுகள்' : 'House Classification Strengths'}</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-900/15 dark:border-amber-500/20">
                      <div className="text-[10px] text-stone-500 font-semibold">{T.kendram}</div>
                      <div className="text-base font-black font-mono text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.kendram}
                      </div>
                      <div className="text-[9px] text-stone-500">{isTamil ? 'ஸ்திர வாழ்க்கை' : 'Pillars of Life'}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-900/15 dark:border-amber-500/20">
                      <div className="text-[10px] text-stone-500 font-semibold">{T.panaparam}</div>
                      <div className="text-base font-black font-mono text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.panaparam}
                      </div>
                      <div className="text-[9px] text-stone-500">{isTamil ? 'பொருளாதாரம்' : 'Wealth Accumulation'}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-900/15 dark:border-amber-500/20">
                      <div className="text-[10px] text-stone-500 font-semibold">{T.apoklimam}</div>
                      <div className="text-base font-black font-mono text-[#7A1A22] dark:text-amber-300">
                        {horoscope.ashtakavarga.apoklimam}
                      </div>
                      <div className="text-[9px] text-stone-500">{isTamil ? 'ஆன்மீகம்/பயணம்' : 'Spirituality/Effort'}</div>
                    </div>
                  </div>
                </div>

                {/* Astrological Insight Note */}
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-900/20 border border-amber-900/15 dark:border-amber-500/30 text-[11px] space-y-1">
                  <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1">
                    <span>💡</span>
                    <span>{isTamil ? 'அஷ்டகவர்க்க பலன் காணும் முறை:' : 'Ashtakavarga Reading Principle:'}</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {isTamil
                      ? 'சர்வாஷ்டகவர்க்கத்தில் 28 பரல்களுக்கு மேல் பெற்ற ராசிகள் நற்பலனையும், 28-க்கு கீழ் உள்ள ராசிகள் எச்சரிக்கையையும் குறிக்கும். கோசாரத்தில் சுப கிரகங்கள் அதிக பரல்கள் உள்ள ராசிகளில் சஞ்சரிக்கும் காலத்தில் நற்பலன்கள் மிகும்.'
                      : 'Signs with ≥ 28 bindus confer auspicious results, vitality, and success during major planetary transits (Gocharam). Signs with < 28 bindus require mindfulness and remedies when transited by malefics.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom: Bhinna Ashtakavarga Matrix Table */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                  <span>📊</span>
                  <span>{T.bavTitle}</span>
                </h3>
                <span className="text-[10px] text-stone-500">
                  {isTamil ? '7 கிரகங்கள் × 12 ராசிகள்' : '7 Planets × 12 Signs'}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-amber-100/70 dark:bg-amber-900/30 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                      <th className="py-2 px-3 text-left">{T.planet}</th>
                      {RASHIS.map((r, idx) => (
                        <th key={idx} className="py-2 px-2 text-center">
                          <div>{isTamil ? r.shortTa : r.shortEn}</div>
                          <div className="text-[9px] font-normal opacity-70">({idx + 1})</div>
                        </th>
                      ))}
                      <th className="py-2 px-3 text-center">{T.totalLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/15">
                    {horoscope.ashtakavarga.bavPlanets.map((pl, pIdx) => (
                      <tr
                        key={pIdx}
                        className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors"
                      >
                        <td className="py-1.5 px-3 text-left font-semibold text-stone-800 dark:text-stone-200">
                          {isTamil ? pl.nameTa : pl.nameEn}
                        </td>
                        {pl.points.map((pt, sIdx) => (
                          <td
                            key={sIdx}
                            className={`py-1.5 px-2 text-center font-mono text-[11px] font-medium ${
                              pt >= 5
                                ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/5'
                                : pt <= 2
                                ? 'text-amber-800 dark:text-rose-400'
                                : 'text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            {pt}
                          </td>
                        ))}
                        <td className="py-1.5 px-3 text-center font-mono text-xs font-bold text-[#7A1A22] dark:text-amber-300 bg-amber-500/10">
                          {pl.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-200/50 dark:bg-amber-900/40 font-bold text-[#7A1A22] dark:text-amber-200 border-t-2 border-amber-900/20">
                      <td className="py-2 px-3 text-left font-bold">
                        {isTamil ? 'சர்வாஷ்டகவர்க்கம்' : 'Sarvashtakavarga'}
                      </td>
                      {horoscope.ashtakavarga.totals.map((tot, idx) => {
                        const num = parseInt(tot, 10);
                        return (
                          <td
                            key={idx}
                            className={`py-2 px-2 text-center font-mono text-xs font-black ${
                              num >= 28
                                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15'
                                : 'text-amber-900 dark:text-rose-300 bg-amber-500/10'
                            }`}
                          >
                            {tot}
                          </td>
                        );
                      })}
                      <td className="py-2 px-3 text-center font-mono text-sm font-black text-white bg-[#7A1A22] dark:bg-amber-700">
                        {horoscope.ashtakavarga.grandTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* SUB-SECTION 5C.2: Ashtakavarga Shodhana & Shodhya Pindas */}
            {horoscope.ashtakavarga.shodhana && horoscope.ashtakavarga.shodhana.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-amber-900/10 dark:border-amber-500/15">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <div>
                    <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>⚖️</span>
                      <span>{T.shodhanaTitle}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      {T.shodhanaSubtitle}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-[#7A1A22] dark:text-amber-200 border border-amber-900/20 shrink-0 self-start sm:self-auto">
                    <span>📜</span>
                    <span>{isTamil ? '7 கிரகங்கள் + லக்னம்' : '7 Grahas + Lagna'}</span>
                  </div>
                </div>

                {/* Master Comparative Shodhana Table */}
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-amber-100/70 dark:bg-amber-900/30 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                        <th className="py-2 px-3 text-left">{T.planet}</th>
                        <th className="py-2 px-2 text-center">{T.rawBavLabel}</th>
                        <th className="py-2 px-2 text-center">{T.trikonaLabel}</th>
                        <th className="py-2 px-2 text-center">{T.shodhitaLabel}</th>
                        <th className="py-2 px-2 text-center">{T.rasiPindaLabel}</th>
                        <th className="py-2 px-2 text-center">{T.grahaPindaLabel}</th>
                        <th className="py-2 px-3 text-center bg-amber-500/15">{T.shodhyaPindaLabel}</th>
                        <th className="py-2 px-3 text-left">{T.domainLabel}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/15">
                      {horoscope.ashtakavarga.shodhana.map((item) => {
                        const isSelected = selectedShodhanaPlanet === item.key;
                        const isLagna = item.key === 'lagna';
                        return (
                          <tr
                            key={item.key}
                            onClick={() => setSelectedShodhanaPlanet(item.key)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-amber-500/15 dark:bg-amber-500/20 font-semibold'
                                : 'hover:bg-amber-50/60 dark:hover:bg-amber-900/10'
                            }`}
                          >
                            <td className="py-2 px-3 text-left font-bold flex items-center gap-1.5">
                              <span className="text-amber-800 dark:text-amber-400 font-mono text-sm">{item.symbol}</span>
                              <span className={isLagna ? 'text-[#7A1A22] dark:text-amber-300 font-black' : 'text-stone-800 dark:text-stone-200'}>
                                {isTamil ? item.nameTa : item.nameEn}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#7A1A22] text-amber-100 font-bold ml-auto">
                                  ✓
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-2 font-mono font-bold text-stone-700 dark:text-stone-300">{item.rawTotal}</td>
                            <td className="py-2 px-2 font-mono text-stone-700 dark:text-stone-300">{item.trikonaTotal}</td>
                            <td className="py-2 px-2 font-mono font-bold text-emerald-700 dark:text-emerald-400">{item.ekadhipatyaTotal}</td>
                            <td className="py-2 px-2 font-mono text-stone-700 dark:text-stone-300">{item.rasiPinda}</td>
                            <td className="py-2 px-2 font-mono text-stone-700 dark:text-stone-300">{item.grahaPinda}</td>
                            <td className="py-2 px-3 font-mono font-black text-sm text-[#7A1A22] dark:text-amber-200 bg-amber-500/10">
                              {item.shodhyaPinda}
                            </td>
                            <td className="py-2 px-3 text-left text-[11px] text-stone-600 dark:text-stone-400">
                              {isTamil ? item.domainTa : item.domainEn}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-amber-200/50 dark:bg-amber-900/40 font-bold text-[#7A1A22] dark:text-amber-200 border-t-2 border-amber-900/20 text-xs">
                        <td className="py-2 px-3 text-left font-bold">
                          {isTamil ? '7 கிரகங்களின் கூடுதல்' : '7 Grahas Total'}
                        </td>
                        <td className="py-2 px-2 font-mono font-black">
                          {horoscope.ashtakavarga.shodhana.filter(s => s.key !== 'lagna').reduce((sum, s) => sum + s.rawTotal, 0)}
                        </td>
                        <td className="py-2 px-2 font-mono font-black">
                          {horoscope.ashtakavarga.shodhana.filter(s => s.key !== 'lagna').reduce((sum, s) => sum + s.trikonaTotal, 0)}
                        </td>
                        <td className="py-2 px-2 font-mono font-black text-emerald-700 dark:text-emerald-300">
                          {horoscope.ashtakavarga.shodhana.filter(s => s.key !== 'lagna').reduce((sum, s) => sum + s.ekadhipatyaTotal, 0)}
                        </td>
                        <td className="py-2 px-2 font-mono font-black">
                          {horoscope.ashtakavarga.shodhana.filter(s => s.key !== 'lagna').reduce((sum, s) => sum + s.rasiPinda, 0)}
                        </td>
                        <td className="py-2 px-2 font-mono font-black">
                          {horoscope.ashtakavarga.shodhana.filter(s => s.key !== 'lagna').reduce((sum, s) => sum + s.grahaPinda, 0)}
                        </td>
                        <td className="py-2 px-3 font-mono font-black text-sm text-white bg-[#7A1A22] dark:bg-amber-700">
                          {horoscope.ashtakavarga.shodhana.filter(s => s.key !== 'lagna').reduce((sum, s) => sum + s.shodhyaPinda, 0)}
                        </td>
                        <td className="py-2 px-3 text-left text-[10px] text-stone-500 font-medium">
                          {isTamil ? '337 பரல்களின் தூய பிண்ட பலம்' : 'Purified Potency of 337 Bindus'}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Interactive 12-Sign Step-by-Step Inspector for Selected Planet */}
                {(() => {
                  const selItem = horoscope.ashtakavarga.shodhana.find(s => s.key === selectedShodhanaPlanet) || horoscope.ashtakavarga.shodhana[0];
                  if (!selItem) return null;
                  return (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-900/15 dark:border-amber-500/20 space-y-3">
                      {/* Planet Selector Pills */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-900/10 dark:border-amber-500/15 pb-2">
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                          {T.shodhanaSelectPrompt}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {horoscope.ashtakavarga.shodhana.map((p) => (
                            <button
                              key={p.key}
                              type="button"
                              onClick={() => setSelectedShodhanaPlanet(p.key)}
                              className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                                selectedShodhanaPlanet === p.key
                                  ? 'bg-[#7A1A22] text-amber-100 shadow-2xs'
                                  : 'bg-white/80 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 border border-amber-900/10'
                              }`}
                            >
                              <span>{p.symbol}</span>
                              <span>{isTamil ? p.nameTa : p.nameEn}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Header of Selected Planet with 3 Summary Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{selItem.symbol}</span>
                          <div>
                            <div className="text-sm font-bold text-[#7A1A22] dark:text-amber-200">
                              {isTamil ? `${selItem.nameTa} அஷ்டவர்க்கச் சோதனை.` : `${selItem.nameEn} Ashtakavarga Sodhana Analysis.`}
                            </div>
                            <div className="text-[10px] text-stone-500 dark:text-stone-400">
                              {isTamil ? selItem.domainTa : selItem.domainEn}
                            </div>
                          </div>
                        </div>

                        {/* Metric Highlights for this Planet */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-amber-900/15 text-center">
                            <div className="text-[9px] text-stone-500 font-semibold">{T.rasiPindaLabel}</div>
                            <div className="text-xs font-black font-mono text-[#7A1A22] dark:text-amber-300">{selItem.rasiPinda}</div>
                          </div>
                          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-amber-900/15 text-center">
                            <div className="text-[9px] text-stone-500 font-semibold">{T.grahaPindaLabel}</div>
                            <div className="text-xs font-black font-mono text-[#7A1A22] dark:text-amber-300">{selItem.grahaPinda}</div>
                          </div>
                          <div className="px-3 py-1 rounded-lg bg-[#7A1A22] text-amber-100 border border-amber-400 text-center shadow-2xs">
                            <div className="text-[9px] text-amber-200 font-bold uppercase">{T.shodhyaPindaLabel}</div>
                            <div className="text-sm font-black font-mono">{selItem.shodhyaPinda}</div>
                          </div>
                        </div>
                      </div>

                      {/* 12 Signs 4-Row Breakdown Table */}
                      <div className="overflow-x-auto rounded-lg border border-amber-900/15 dark:border-amber-500/20 bg-white/70 dark:bg-stone-900/50">
                        <table className="w-full text-xs text-center border-collapse">
                          <thead>
                            <tr className="bg-amber-100/60 dark:bg-amber-900/30 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 text-[10px]">
                              <th className="py-1.5 px-2 text-left">{isTamil ? 'படிநிலை (Step)' : 'Reduction Step'}</th>
                              {RASHIS.map((r, idx) => (
                                <th key={idx} className="py-1.5 px-1.5 text-center">
                                  <div>{isTamil ? r.shortTa : r.shortEn}</div>
                                  <div className="text-[8px] opacity-60">({idx + 1})</div>
                                </th>
                              ))}
                              <th className="py-1.5 px-2 text-center bg-amber-500/10">{T.totalLabel}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/15 text-[11px]">
                            {/* Row 1: Raw BAV */}
                            <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40">
                              <td className="py-1.5 px-2 text-left font-bold text-stone-700 dark:text-stone-300">
                                {isTamil ? '1. மூலப் பரல்கள் (Raw BAV)' : '1. Raw Bindus'}
                              </td>
                              {selItem.rawPoints.map((pt, sIdx) => (
                                <td key={sIdx} className="py-1.5 px-1.5 font-mono text-stone-700 dark:text-stone-300">
                                  {pt}
                                </td>
                              ))}
                              <td className="py-1.5 px-2 font-mono font-bold text-[#7A1A22] dark:text-amber-300 bg-amber-500/10">
                                {selItem.rawTotal}
                              </td>
                            </tr>

                            {/* Row 2: Trikona Shodhana */}
                            <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 bg-amber-50/20">
                              <td className="py-1.5 px-2 text-left font-bold text-stone-700 dark:text-stone-300">
                                {isTamil ? '2. திரிகோண சோதனை (Trikona)' : '2. Trikona Shodhana'}
                              </td>
                              {selItem.trikona.map((pt, sIdx) => (
                                <td key={sIdx} className="py-1.5 px-1.5 font-mono text-stone-700 dark:text-stone-300">
                                  {pt}
                                </td>
                              ))}
                              <td className="py-1.5 px-2 font-mono font-bold text-[#7A1A22] dark:text-amber-300 bg-amber-500/10">
                                {selItem.trikonaTotal}
                              </td>
                            </tr>

                            {/* Row 3: Ekadhipatya Shodhana / Shodhita */}
                            <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 bg-emerald-500/5">
                              <td className="py-1.5 px-2 text-left font-bold text-emerald-800 dark:text-emerald-300">
                                {isTamil ? '3. சோதித்த பரல்கள் (Shodhita)' : '3. Shodhita Bindus'}
                              </td>
                              {selItem.ekadhipatya.map((pt, sIdx) => (
                                <td key={sIdx} className="py-1.5 px-1.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                  {pt}
                                </td>
                              ))}
                              <td className="py-1.5 px-2 font-mono font-black text-emerald-800 dark:text-emerald-300 bg-emerald-500/15">
                                {selItem.ekadhipatyaTotal}
                              </td>
                            </tr>

                            {/* Row 4: Rasi Multipliers Product */}
                            <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/40 bg-amber-50/5">
                              <td className="py-1.5 px-2 text-left font-bold text-stone-600 dark:text-stone-400 text-[10px]">
                                {isTamil ? '4. ராசி பெருக்கல் (Rasi × Gunaka)' : '4. Rasi Products (× Gunaka)'}
                              </td>
                              {selItem.rasiProducts.map((prod, sIdx) => (
                                <td key={sIdx} className="py-1.5 px-1.5 font-mono text-[10px] text-stone-600 dark:text-stone-400">
                                  {prod}
                                </td>
                              ))}
                              <td className="py-1.5 px-2 font-mono font-black text-[#7A1A22] dark:text-amber-200 bg-amber-500/15">
                                {selItem.rasiPinda}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Astrological Insight Card */}
                      <div className="p-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-900/20 border border-amber-900/15 text-[11px] flex items-start gap-2">
                        <span className="text-sm">🎯</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#7A1A22] dark:text-amber-300">
                            {isTamil ? `${selItem.nameTa} சோத்திய பிண்ட பலன் & கோசார விதி:` : `${selItem.nameEn}'s Shodhya Pinda Astrological Insight:`}
                          </span>
                          <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[10.5px]">
                            {isTamil ? selItem.insightTa : selItem.insightEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 9: 9. ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்) (9. Real-Time Gocharam (Planetary Transit) Analysis) */}
        {/* ======================================================== */}
        <div id="horoscope-section-9" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(9)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                9
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🪐</span>
                  <span>{isTamil ? '9. ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)' : '9. Real-Time Gocharam (Planetary Transit) Analysis'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'ஜென்ம ராசி மற்றும் லக்னத்தை அடிப்படையாகக் கொண்டு தற்போதைய 9 கிரக நிலைகள், வேதை & அஷ்டகவர்க்க பலன்கள்' : 'Real-time transits relative to Janma Rasi & Lagna with Vedha, SAV/BAV Bindus & Phalan'}
                </p>
              </div>
            </div>

            {renderSectionBadge(9, (
              <span className="px-2.5 py-1 rounded-lg bg-purple-100/70 dark:bg-purple-950/40 text-[11px] font-bold text-purple-800 dark:text-purple-300">{isTamil ? (horoscope.gocharam?.sadeSati?.titleTa?.slice(0, 15) || 'கோச்சாரம்') : (horoscope.gocharam?.sadeSati?.titleEn?.slice(0, 15) || 'Transit')}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[9] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 3C: GOCHARAM (கோச்சாரம் - தற்போதைய கிரக சஞ்சாரம்) */}
        {horoscope.gocharam && (
          <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4">
            {/* Header */}
            <div className="border-b border-amber-900/10 dark:border-amber-500/15 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                {isTamil
                  ? `ஜென்ம ராசி (${horoscope.gocharam.birthMoonRasiTa}) மற்றும் லக்னம் (${horoscope.gocharam.birthLagnaRasiTa}) அடிப்படையில் கோச்சார கிரக சஞ்சார பலன்கள்`
                  : `Planetary transits relative to birth Moon (${horoscope.gocharam.birthMoonRasiEn || horoscope.gocharam.birthMoonRasiTa}) and Lagna (${horoscope.gocharam.birthLagnaRasiEn || horoscope.gocharam.birthLagnaRasiTa})`}
              </p>

              {/* Transit Date Selector */}
              <div className="flex items-center gap-2 print:hidden">
                <label className="text-xs font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap">
                  📅 {isTamil ? 'கோச்சார தேதி:' : 'Transit Date:'}
                </label>
                <input
                  type="date"
                  value={gocharaDate}
                  onChange={e => setGocharaDate(e.target.value)}
                  className="bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#7A1A22]"
                />
                <button
                  type="button"
                  onClick={() => setGocharaDate(new Date().toISOString().split('T')[0])}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-900/10 hover:bg-amber-900/20 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1A22] dark:text-amber-300 transition-colors cursor-pointer"
                >
                  {isTamil ? 'இன்று' : 'Today'}
                </button>
              </div>
            </div>

            {/* Top 4 Key Transit Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* 1. Saturn (Sade Sati / Ashtama Sani) */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                horoscope.gocharam.sadeSati.isActive
                  ? 'bg-rose-50/70 dark:bg-stone-800/60 border-rose-900/20'
                  : 'bg-emerald-50/70 dark:bg-stone-800/60 border-emerald-900/20'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-500 uppercase text-[10px]">
                    {isTamil ? '♄ சனி சஞ்சாரம்' : 'Saturn Transit'}
                  </span>
                  <span className="font-bold text-sm">♄</span>
                </div>
                <div className="font-bold text-[#7A1A22] dark:text-amber-200 text-xs">
                  {isTamil ? horoscope.gocharam.sadeSati.titleTa : horoscope.gocharam.sadeSati.titleEn}
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  {isTamil ? horoscope.gocharam.sadeSati.descTa : horoscope.gocharam.sadeSati.descEn}
                </p>
              </div>

              {/* 2. Guru Bala (Jupiter Transit) */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                horoscope.gocharam.guruBala.hasGuruBala
                  ? 'bg-emerald-50/70 dark:bg-stone-800/60 border-emerald-900/20'
                  : 'bg-amber-50/70 dark:bg-stone-800/60 border-amber-900/20'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-500 uppercase text-[10px]">
                    {isTamil ? '♃ குரு பலம்' : 'Guru Bala'}
                  </span>
                  <span className="font-bold text-sm">♃</span>
                </div>
                <div className="font-bold text-[#7A1A22] dark:text-amber-200 text-xs">
                  {isTamil ? horoscope.gocharam.guruBala.titleTa : horoscope.gocharam.guruBala.titleEn}
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  {isTamil ? horoscope.gocharam.guruBala.descTa : horoscope.gocharam.guruBala.descEn}
                </p>
              </div>

              {/* 3. Rahu-Ketu Axis */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-500 uppercase text-[10px]">
                    {isTamil ? '☊-☋ ராகு-கேது சஞ்சாரம்' : 'Rahu-Ketu Axis'}
                  </span>
                  <span className="font-bold text-sm">☊☋</span>
                </div>
                <div className="font-bold text-[#7A1A22] dark:text-amber-200 text-xs">
                  {isTamil ? horoscope.gocharam.rahuKetu.titleTa : horoscope.gocharam.rahuKetu.titleEn}
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  {isTamil ? horoscope.gocharam.rahuKetu.descTa : horoscope.gocharam.rahuKetu.titleEn}
                </p>
              </div>

              {/* 4. Auspicious Transits Count */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-500 uppercase text-[10px]">
                    {isTamil ? '✨ சுப சஞ்சார கிரகங்கள்' : 'Benefic Transits'}
                  </span>
                  <span className="font-bold text-sm">🌟</span>
                </div>
                {(() => {
                  const subhaCount = horoscope.gocharam.planets.filter(p => p.statusType === 'subha').length;
                  const vedhaCount = horoscope.gocharam.planets.filter(p => p.statusType === 'vedha').length;
                  return (
                    <div>
                      <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                        {subhaCount} / 9 {isTamil ? 'கிரகங்கள் சுபம்' : 'Planets Benefic'}
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {vedhaCount > 0 ? (isTamil ? `${vedhaCount} கிரகம் வேதையால் தடைபட்டுள்ளது.` : `${vedhaCount} obstructed by Vedha.`) : (isTamil ? 'வேதை தடைகள் ஏதுமில்லை.' : 'No major Vedha obstructions.')}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* South Indian 4x4 Transit Chart + Gocharam Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left: 4x4 Transit Chart */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300">
                    {isTamil ? 'கோச்சார ராசி சக்கரம் (South Indian 4×4)' : 'Transit Rasi Chart (4×4)'}
                  </h3>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {horoscope.gocharam.transitDateFormatted}
                  </span>
                </div>

                <div className="aspect-square w-full max-w-[340px] mx-auto border-2 border-amber-900/40 dark:border-amber-700/60 grid grid-cols-4 grid-rows-4 bg-amber-50/30 dark:bg-stone-900/50 rounded-xl overflow-hidden shadow-xs">
                  {SOUTH_INDIAN_CELLS.map((cell, idx) => {
                    const chartData = horoscope.gocharam.chart?.[cell.rasi];
                    const rasiLabel = isTamil ? RASHIS[cell.rasi]?.ta : RASHIS[cell.rasi]?.en;

                    return (
                      <div
                        key={idx}
                        style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
                        className="border border-amber-900/20 dark:border-amber-700/40 p-1 flex flex-col justify-between relative bg-white/60 dark:bg-stone-900/60"
                      >
                        <div className="flex justify-between items-center text-[9px] text-stone-500 dark:text-stone-400 font-bold">
                          <span>{isTamil ? RASHIS[cell.rasi]?.ta : RASHIS[cell.rasi]?.en}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 items-center justify-center py-1">
                          {chartData?.occupants?.map((occ, oIdx) => (
                            <span
                              key={oIdx}
                              className={`text-[8px] sm:text-[9.5px] px-0.5 sm:px-1 py-0 sm:py-0.2 rounded font-bold leading-tight ${
                                occ.isBirthMoon
                                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 ring-1 ring-purple-400'
                                  : occ.isBirthLagna
                                  ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 ring-1 ring-red-400'
                                  : occ.statusType === 'subha'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                                  : occ.statusType === 'vedha'
                                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                                  : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                              }`}
                            >
                              {isTamil ? occ.labelTa : occ.labelEn}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {/* Chart Center */}
                  <div
                    style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }}
                    className="border border-amber-900/20 dark:border-amber-700/40 p-2 flex flex-col items-center justify-center text-center bg-amber-100/50 dark:bg-amber-950/30"
                  >
                    <div className="text-xs font-bold text-[#7A1A22] dark:text-[#E8838B]">
                      {isTamil ? 'கோச்சார நிலை' : 'Planetary Transit'}
                    </div>
                    <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5 font-mono">
                      {horoscope.gocharam.transitDateFormatted}
                    </div>
                    <div className="text-[9px] text-stone-500 mt-1">
                      {isTamil ? 'சந்திரன் = ஜென்ம ராசி | லக்னம் = ஜென்ம லக்னம்' : 'Moon = Janma Rasi | Lagna = Janma Lagna'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Detailed Transit Table */}
              <div className="lg:col-span-7 space-y-2">
                <h3 className="text-xs font-bold text-[#7A1A22] dark:text-amber-300">
                  {isTamil ? 'கோச்சார கிரக நிலைகள் & வேதை ஆய்வு' : 'Transit Planetary Dignity & Vedha Diagnostic Table'}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 bg-white/90 dark:bg-stone-900/80 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/80 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 text-[11px]">
                        <th className="py-2.5 px-2.5">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                        <th className="py-2.5 px-2.5">{isTamil ? 'கோச்சார ராசி' : 'Transit Sign'}</th>
                        <th className="py-2.5 px-2 text-center">{isTamil ? 'சந்திரனில் ஸ்தானம்' : 'House from Moon'}</th>
                        <th className="py-2.5 px-2 text-center">{isTamil ? 'லக்னத்தில் ஸ்தானம்' : 'House from Lagna'}</th>
                        <th className="py-2.5 px-2 text-center">{isTamil ? 'நிலை & வேதை' : 'Status & Vedha'}</th>
                        <th className="py-2.5 px-2 text-center">{isTamil ? 'பரல்கள் (SAV/BAV)' : 'SAV / BAV'}</th>
                        <th className="py-2.5 px-2.5">{isTamil ? 'கோச்சாரப் பலன்' : 'Transit Phalan'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 text-[11px]">
                      {horoscope.gocharam.planets.map(p => {
                        const badgeClass =
                          p.statusType === 'subha'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : p.statusType === 'vedha'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                        return (
                          <tr key={p.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="py-2 px-2.5 font-bold text-[#7A1A22] dark:text-amber-200 whitespace-nowrap">
                              <span className="mr-1">{p.symbol}</span>
                              <span>{isTamil ? p.nameTa : p.nameEn}</span>
                              {p.isRetrograde && (
                                <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-500/20 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200 border border-amber-600/30" title={isTamil ? 'வக்ர சஞ்சாரம்' : 'Retrograde Transit'}>
                                  {isTamil ? '(வ)' : '(R)'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-2.5 whitespace-nowrap">
                              <div className="font-semibold text-stone-800 dark:text-stone-200">
                                {isTamil ? p.transitRasiTa : p.transitRasiEn}
                              </div>
                              <div className="text-[10px] text-stone-500 font-mono">{p.degInSign}</div>
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-amber-900 dark:text-amber-200">
                              {isTamil ? `${p.houseFromMoon}-ஆம் இடம்` : `House ${p.houseFromMoon}`}
                            </td>
                            <td className="py-2 px-2 text-center text-stone-600 dark:text-stone-400">
                              {isTamil ? `${p.houseFromLagna}-ஆம் இடம்` : `House ${p.houseFromLagna}`}
                            </td>
                            <td className="py-2 px-2 text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${badgeClass}`}>
                                {isTamil ? p.statusBadgeTa : p.statusBadgeEn}
                              </span>
                              {p.vedhaOccurred && (
                                <div className="text-[9.5px] text-rose-600 dark:text-rose-400 mt-0.5">
                                  {isTamil ? `(${p.vedhaCausingPlanet} வேதை)` : `(${p.vedhaCausingPlanet} Vedha)`}
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center font-mono whitespace-nowrap">
                              <span className="font-bold text-[#7A1A22] dark:text-amber-300">{p.savBindus}</span>
                              <span className="text-stone-400 mx-0.5">/</span>
                              <span className="text-stone-600 dark:text-stone-400">{p.bavBindus}</span>
                            </td>
                            <td className="py-2 px-2.5 text-stone-700 dark:text-stone-300 max-w-xs">
                              {isTamil ? p.phalanTa : p.phalanEn}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 10: 10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம் (10. Planetary Hora (Orai) Analysis) */}
        {/* ======================================================== */}
        <div id="horoscope-section-10" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(10)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                10
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{isTamil ? '10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்' : '10. Planetary Hora (Orai) Analysis'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் முறைப்படி 24 பகல் & இரவு ஓரைகள், பிறந்த ஹோரை மற்றும் இன்றைய நடப்பு ஹோரை' : 'Parashari 24 Day & Night Horas, Birth Hora & Live Real-Time Active Hora'}
                </p>
              </div>
            </div>

            {renderSectionBadge(10, (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">{isTamil ? (horoscope.orai?.birthHora?.nameTa || 'ஹோரை') : (horoscope.orai?.birthHora?.nameEn || 'Hora')}</span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[10] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              {/* SECTION 3B: ORAI (ஹோரை கணிதம்) */}
        {horoscope.orai && (
          <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4">
            {/* Header */}
            <div className="border-b border-amber-900/10 dark:border-amber-500/15 pb-2 flex justify-end items-center">
              {/* Tab Switcher: Birth Horas vs Today Live Horas */}
              <div className="flex items-center gap-1 bg-amber-900/10 dark:bg-stone-900 p-0.5 rounded-xl text-xs font-bold print:hidden">
                <button
                  type="button"
                  onClick={() => setHoraViewTab('birth')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    horaViewTab === 'birth'
                      ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <span>👶 {isTamil ? 'பிறந்த நாள் ஹோரை' : 'Birth Horas'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHoraViewTab('today')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    horaViewTab === 'today'
                      ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <span>🌟 {isTamil ? 'இன்றைய நடப்பு ஹோரை' : "Today's Live Horas"}</span>
                </button>
              </div>
            </div>

            {/* Top 3 Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* 1. Birth Hora Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-500 uppercase text-[10px] tracking-wider">
                    {isTamil ? '👶 பிறந்த ஹோரை' : 'Birth Hora'}
                  </span>
                  <span className="text-base font-bold text-amber-700 dark:text-amber-300">
                    {horoscope.orai.birthHora?.info?.symbol || '♃'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#7A1A22] dark:text-[#E8838B]">
                    {isTamil ? horoscope.orai.birthHora?.nameTa : horoscope.orai.birthHora?.nameEn}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px]">
                    {isTamil ? horoscope.orai.birthHora?.natureTa : horoscope.orai.birthHora?.natureEn}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  <strong className="text-stone-800 dark:text-stone-200">{isTamil ? 'உகந்தவை: ' : 'Best for: '}</strong>
                  {isTamil ? horoscope.orai.birthHora?.info?.suitableTa : horoscope.orai.birthHora?.info?.suitableEn}
                </p>
              </div>

              {/* 2. Today's Live Active Hora Card */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-stone-800/60 border border-emerald-900/15 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{isTamil ? 'இன்றைய நடப்பு ஹோரை (நேரலை)' : 'Active Today (Live)'}</span>
                  </span>
                  <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                    {horoscope.orai.currentLiveHora?.info?.symbol || '⏱️'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    {isTamil ? horoscope.orai.currentLiveHora?.nameTa : horoscope.orai.currentLiveHora?.nameEn}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    horoscope.orai.currentLiveHora?.natureType === 'subha'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : horoscope.orai.currentLiveHora?.natureType === 'madhyama'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}>
                    {isTamil ? horoscope.orai.currentLiveHora?.natureTa : horoscope.orai.currentLiveHora?.natureEn}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
                  {horoscope.orai.currentLiveHora?.startFormatted} ➔ {horoscope.orai.currentLiveHora?.endFormatted}
                </div>
              </div>

              {/* 3. Sunrise & Sunset Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-500 uppercase text-[10px] tracking-wider">
                    {horaViewTab === 'birth' ? (isTamil ? 'பிறந்த நாள் சூரியோதயம்' : 'Birth Day Solar Times') : (isTamil ? 'இன்றைய சூரியோதயம்' : "Today's Solar Times")}
                  </span>
                  <span>🌅</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div className="text-stone-500 text-[10px]">{isTamil ? 'உதயம் (Sunrise)' : 'Sunrise'}</div>
                    <div className="font-bold text-amber-900 dark:text-amber-200 font-mono">
                      {horaViewTab === 'birth' ? horoscope.orai.birthSunriseSunset.sunriseFormatted : horoscope.orai.todaySunriseSunset.sunriseFormatted}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-500 text-[10px]">{isTamil ? 'அஸ்தமனம் (Sunset)' : 'Sunset'}</div>
                    <div className="font-bold text-amber-900 dark:text-amber-200 font-mono">
                      {horaViewTab === 'birth' ? horoscope.orai.birthSunriseSunset.sunsetFormatted : horoscope.orai.todaySunriseSunset.sunsetFormatted}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-500 text-[10px]">{isTamil ? 'பகல் அளவு (Dinamana)' : 'Daylight Span'}</div>
                    <div className="font-semibold text-stone-700 dark:text-stone-300">
                      {horaViewTab === 'birth' ? horoscope.orai.birthSunriseSunset.dinamanaFormatted : horoscope.orai.todaySunriseSunset.dinamanaFormatted}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-500 text-[10px]">{isTamil ? 'இரவு அளவு (Ratrimana)' : 'Night Span'}</div>
                    <div className="font-semibold text-stone-700 dark:text-stone-300">
                      {horaViewTab === 'birth' ? horoscope.orai.birthSunriseSunset.ratrimanaFormatted : horoscope.orai.todaySunriseSunset.ratrimanaFormatted}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day / Night Filter Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHoraDayNightFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    horaDayNightFilter === 'all'
                      ? 'bg-amber-900/15 text-[#7A1A22] dark:text-amber-300 dark:bg-stone-800'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {isTamil ? 'அனைத்து 24 ஓரைகள்' : 'All 24 Horas'}
                </button>
                <button
                  type="button"
                  onClick={() => setHoraDayNightFilter('day')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    horaDayNightFilter === 'day'
                      ? 'bg-amber-900/15 text-[#7A1A22] dark:text-amber-300 dark:bg-stone-800'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  ☀️ {isTamil ? 'பகல் ஓரை (12)' : 'Day Horas (12)'}
                </button>
                <button
                  type="button"
                  onClick={() => setHoraDayNightFilter('night')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    horaDayNightFilter === 'night'
                      ? 'bg-amber-900/15 text-[#7A1A22] dark:text-amber-300 dark:bg-stone-800'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  🌙 {isTamil ? 'இரவு ஓரை (12)' : 'Night Horas (12)'}
                </button>
              </div>
              <div className="text-[11px] text-stone-500 italic">
                {isTamil ? '*சூரியோதய அடிப்படையில் ஒவ்வொரு ஓரையும் கணக்கிடப்படுகிறது.' : '*Each Hora is computed from real solar disc-center timing.'}
              </div>
            </div>

            {/* 24-Hora Table */}
            {(() => {
              const activeSchedule = horaViewTab === 'birth'
                ? (horaDayNightFilter === 'day' ? horoscope.orai.birthDayHoras : horaDayNightFilter === 'night' ? horoscope.orai.birthNightHoras : [...horoscope.orai.birthDayHoras, ...horoscope.orai.birthNightHoras])
                : (horaDayNightFilter === 'day' ? horoscope.orai.todayDayHoras : horaDayNightFilter === 'night' ? horoscope.orai.todayNightHoras : [...horoscope.orai.todayDayHoras, ...horoscope.orai.todayNightHoras]);

              return (
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 bg-white/90 dark:bg-stone-900/80 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/80 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 text-[11px]">
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3">{isTamil ? 'காலம் (Time Range)' : 'Time Range'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'ஹோராதிபதி (Hora Lord)' : 'Hora Lord'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'தன்மை (Nature)' : 'Nature'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'உகந்த நற்செயல்கள் (Best Activities)' : 'Recommended Tasks'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 text-[11px]">
                      {activeSchedule.map((h, idx) => {
                        const isHighlight = h.isCurrent;
                        const natureBadgeClass =
                          h.info?.natureType === 'subha'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : h.info?.natureType === 'madhyama'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';

                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isHighlight
                                ? 'bg-amber-100/90 dark:bg-amber-950/70 font-semibold ring-1 ring-inset ring-amber-500'
                                : 'hover:bg-amber-50/50 dark:hover:bg-stone-800/40'
                            }`}
                          >
                            <td className="py-2 px-3 text-center font-mono">
                              {h.num}
                            </td>
                            <td className="py-2 px-3 font-mono whitespace-nowrap">
                              {h.startFormatted} ➔ {h.endFormatted}
                            </td>
                            <td className="py-2 px-3 font-bold text-[#7A1A22] dark:text-amber-200 whitespace-nowrap">
                              <span className="mr-1.5">{h.info?.symbol}</span>
                              <span>{isTamil ? h.info?.ta : h.info?.en}</span>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${natureBadgeClass}`}>
                                {isTamil ? h.info?.natureTa : h.info?.natureEn}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-stone-700 dark:text-stone-300">
                              {isTamil ? h.info?.suitableTa : h.info?.suitableEn}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}
            </div>
          )}
        </div>
  

        {/* ======================================================== */}
        {/* ITEM 11: 11. உபகிரகங்கள் - குளிகாதி ஐவர் & தூமாதி ஐவர் விபரங்கள் (11. Upagrahas - Gulikaadi & Dhumadi Details) */}
        {/* ======================================================== */}
        <div id="horoscope-section-11" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(11)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                11
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🪐</span>
                  <span>{isTamil ? '11. உபகிரகங்கள் - குளிகாதி ஐவர் விபரங்கள்.' : '11. Upagrahas - Gulikadi Five Details'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் மற்றும் காளிதாஸர் முறைப்படி 5 குளிகாதி உபகிரகங்கள் மற்றும் 5 தூமாதி உபகிரகங்கள் ஸ்புடக் கணிதம்' : 'Mathematical Longitudes of Gulikaadi 5 and Dhumadi 5 Secondary Planets (Parashara & Kalidasa Methods)'}
                </p>
              </div>
            </div>

            {renderSectionBadge(11, (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/40 text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                {isTamil ? '10 உபகிரகங்கள்' : '10 Upagrahas'}
              </span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[11] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-6">
              {/* Introduction Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 dark:bg-stone-900/50 border border-amber-900/10 dark:border-amber-500/15 text-xs text-stone-700 dark:text-stone-300 leading-relaxed space-y-1.5">
                <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>{isTamil ? 'வேத ஜோதிட உபகிரகக் கணிதக் கோட்பாடுகள்' : 'Classical Vedic Upagraha Calculation Principles'}</span>
                </div>
                <p>
                  {isTamil
                    ? 'ஒவ்வொரு முதன்மை கிரகத்திற்கும் துணை உபகிரகங்கள் உண்டு. ஒரு தினத்தின் ஜனன அடிப்படையில் பகல் அல்லது இரவு அகஸ் காலத்தை எட்டு சம பிரிவுகளாக்கி (கண்டங்கள்), பராசரர் முறைப்படி கண்டத்தின் ஆரம்ப நேரத்தையும், காளிதாஸர் (உத்தர காலாமிர்தம்) முறைப்படி கண்டத்தின் முடிவு நேரத்தையும் லக்ன உதய நேரமாகக் கொண்டு குளிகாதி ஐவர் ஸ்புடங்கள் கணிக்கப்படுகின்றன.'
                    : 'Each principal planet has corresponding secondary non-luminous planets (Upagrahas). By dividing the Day (Dinamana) or Night (Ratrimana) into 8 equal parts (khandas), the rising Lagna at the Start time (Parashara method) and End time (Kalidasa / Uttara Kalamrita method) determine the Gulikaadi Five positions.'}
                </p>
                <p>
                  {isTamil
                    ? 'தூமாதி ஐவர் ஸ்புடங்கள் சூரியனின் துல்லிய நிராயண பாகையை அடிப்படையாகக் கொண்டு வேத சூத்திரங்களால் கணிக்கப்படுகின்றன.'
                    : 'The Dhumadi Five Upagrahas are directly calculated from the Nirayana longitude of the Sun using classical Parashara mathematical formulas.'}
                </p>
              </div>

              {/* Sub-Tabs: All | Gulikaadi | Dhumadi */}
              <div className="flex items-center gap-2 border-b border-amber-900/10 dark:border-stone-800 pb-2">
                <button
                  type="button"
                  onClick={() => setUpagrahaTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    upagrahaTab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? 'அனைத்து உபகிரகங்கள் (10)' : 'All Upagrahas (10)'}
                </button>
                <button
                  type="button"
                  onClick={() => setUpagrahaTab('gulikaadi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    upagrahaTab === 'gulikaadi'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '1. குளிகாதி ஐவர் (5)' : '1. Gulikaadi Five (5)'}
                </button>
                <button
                  type="button"
                  onClick={() => setUpagrahaTab('dhumadi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    upagrahaTab === 'dhumadi'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '2. தூமாதி ஐவர் (5)' : '2. Dhumadi Five (5)'}
                </button>
              </div>

              {/* PART A: GULIKAADI FIVE (குளிகாதி ஐவர் விபரங்கள்) */}
              {(upagrahaTab === 'all' || upagrahaTab === 'gulikaadi') && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                        <span>🪐</span>
                        <span>{isTamil ? 'குளிகாதி ஐவர் கால & ஸ்புட ஒப்பீட்டு அட்டவணை' : 'Gulikaadi Five Upagrahas - Timing & Sphutas'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil
                          ? 'பராசரர் முறை (ஆரம்ப நேர லக்னம்) vs காளிதாஸர் முறை (முடிவு நேர லக்னம்) ஒப்பீட்டு ஆய்வு'
                          : 'Comparison between Parashara Method (Start Time Lagna) and Kalidasa Method (End Time Lagna)'}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EF] dark:bg-[#1A1513] text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'உப கிரகம்' : 'Upagraha'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'அதிபதி கிரகம்' : 'Ruling Planet'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'கால எல்லை (ஆரம்பம் ➔ முடிவு)' : 'Khanda Period (Start ➔ End)'}</th>
                          <th className="py-2.5 px-3 bg-amber-50/60 dark:bg-stone-900/40 border-l border-amber-900/10 dark:border-amber-500/15">
                            <div className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? 'பராசரர் முறை (ஆரம்பம்)' : 'Parashara Method (Start)'}</div>
                            <div className="text-[9px] font-normal text-stone-500">{isTamil ? 'ராசி / பாகை / நட்சத்திரம் / பாதம்' : 'Rasi / Deg DMS / Star / Pada'}</div>
                          </th>
                          <th className="py-2.5 px-3 bg-rose-50/50 dark:bg-stone-900/60 border-l border-amber-900/10 dark:border-amber-500/15">
                            <div className="text-[11px] font-bold text-rose-900 dark:text-rose-300">{isTamil ? 'காளிதாஸர் முறை (முடிவு)' : 'Kalidasa Method (End)'}</div>
                            <div className="text-[9px] font-normal text-stone-500">{isTamil ? 'ராசி / பாகை / நட்சத்திரம் / பாதம்' : 'Rasi / Deg DMS / Star / Pada'}</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 bg-white/50 dark:bg-[#201A17]">
                        {horoscope.upagrahas?.gulikaadi?.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{item.symbol}</span>
                                <div>
                                  <div className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.nameTa : item.nameEn}</div>
                                  <div className="text-[10px] text-stone-500">{isTamil ? `கண்டம் எண் ${item.slotNum}` : `Khanda #${item.slotNum}`}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-[11px] text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? item.lordTa : item.lordEn}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-stone-700 dark:text-stone-300">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{item.startTime}</span>
                              <span className="mx-1 text-stone-400">➔</span>
                              <span className="font-semibold text-rose-700 dark:text-rose-400">{item.endTime}</span>
                            </td>
                            <td className="py-2.5 px-3 bg-amber-50/30 dark:bg-stone-900/20 border-l border-amber-900/10 dark:border-amber-500/15 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.parashara.rasiTa : item.parashara.rasiEn}</span>
                                <span className="font-mono text-[11px] text-amber-900 dark:text-amber-200 font-semibold">{item.parashara.degDMS}</span>
                              </div>
                              <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                {isTamil ? `${item.parashara.nakTa} பாதம் ${item.parashara.pada}` : `${item.parashara.nakEn} Pada ${item.parashara.pada}`}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 bg-rose-50/20 dark:bg-stone-900/30 border-l border-amber-900/10 dark:border-amber-500/15 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.kalidasa.rasiTa : item.kalidasa.rasiEn}</span>
                                <span className="font-mono text-[11px] text-rose-900 dark:text-rose-200 font-semibold">{item.kalidasa.degDMS}</span>
                              </div>
                              <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                {isTamil ? `${item.kalidasa.nakTa} பாதம் ${item.kalidasa.pada}` : `${item.kalidasa.nakEn} Pada ${item.kalidasa.pada}`}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PART B: DHUMADI FIVE (தூமாதி ஐவர் ஸ்புடங்கள்) */}
              {(upagrahaTab === 'all' || upagrahaTab === 'dhumadi') && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                        <span>☀️</span>
                        <span>{isTamil ? 'உபகிரகங்கள் - தூமாதி ஐவர் ஸ்புடங்கள்' : 'Dhumadi Five Upagrahas - Solar Derived Sphutas'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil
                          ? 'சூரியனின் நிராயண பாகையைக் கொண்டு தூமாதி ஐவர் ஸ்புடங்கள் கணிக்கப்பெறுகின்றன'
                          : 'Calculated directly from the Nirayana longitude of the Sun'}
                      </p>
                    </div>
                    {horoscope.upagrahas?.sunNirayana && (
                      <div className="px-3 py-1 rounded-lg bg-amber-100/80 dark:bg-stone-800 border border-amber-900/20 text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                        <span>☉ {isTamil ? 'சூரியன் ஸ்புடம்' : 'Sun Nirayana'}:</span>
                        <span className="font-mono">{isTamil ? horoscope.upagrahas.sunNirayana.rasiTa : (horoscope.upagrahas.sunNirayana.rasiEn || horoscope.upagrahas.sunNirayana.rasiTa)} {horoscope.upagrahas.sunNirayana.degDMS}</span>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EF] dark:bg-[#1A1513] text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'உப கிரகம்' : 'Upagraha'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'அதிபதி' : 'Ruling Planet'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'கணித முறை / சூத்திரம்' : 'Calculation Formula'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'ராசி' : 'Rasi / Sign'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'பாகை - கலை - விகலை' : 'Deg - Min - Sec'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'பாதம்' : 'Pada'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 bg-white/50 dark:bg-[#201A17]">
                        {horoscope.upagrahas?.dhumadi?.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{item.symbol}</span>
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.nameTa : item.nameEn}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-[11px] text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? item.lordTa : item.lordEn}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                                {isTamil ? item.formulaTa : item.formulaEn}
                              </div>
                              <div className="text-[10px] text-stone-500">
                                {isTamil ? item.ruleDetailTa : item.formulaEn}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-bold text-stone-900 dark:text-stone-100">
                              {isTamil ? item.rasiTa : item.rasiEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-stone-800 dark:text-stone-200 font-bold">
                              {item.degDMS}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-stone-700 dark:text-stone-300">
                              {isTamil ? item.nakTa : item.nakEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-[#7A1A22] dark:text-amber-300">
                              {item.pada}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Maharishi Parashara Verification Rule Box */}
                  {horoscope.upagrahas?.verificationRule && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-600/30 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                          <span className="text-base">✓</span>
                          <span>{isTamil ? 'பராசரர் கணித சரிபார்ப்பு விதி (Verification Rule):' : 'Parashara Mathematical Verification Rule:'}</span>
                          <span className="font-mono px-2 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-[11px]">
                            {isTamil ? horoscope.upagrahas.verificationRule.formulaTa : horoscope.upagrahas.verificationRule.formulaEn}
                          </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-300 text-[11px]">
                          {isTamil ? horoscope.upagrahas.verificationRule.textTa : horoscope.upagrahas.verificationRule.textEn}
                        </p>
                      </div>
                      <div className="shrink-0 font-mono text-[11px] bg-white dark:bg-stone-900 px-3 py-2 rounded-lg border border-emerald-500/20 shadow-2xs space-y-0.5">
                        <div className="text-stone-600 dark:text-stone-400">{isTamil ? "உபகேது:" : "Upaketu:"} <span className="font-bold text-stone-800 dark:text-stone-200">{horoscope.upagrahas.verificationRule.upaketuDeg}</span></div>
                        <div className="text-stone-600 dark:text-stone-400">+ 30° = <span className="font-bold text-emerald-700 dark:text-emerald-300">{horoscope.upagrahas.verificationRule.plus30Deg}</span></div>
                        <div className="text-stone-600 dark:text-stone-400">{isTamil ? "சூரியன்:" : "Sun:"} <span className="font-bold text-[#7A1A22] dark:text-amber-300">{horoscope.upagrahas.verificationRule.sunDeg}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        <div id="horoscope-section-12" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(12)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                12
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🔮</span>
                  <span>{isTamil ? '12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்.' : '12. Upagrahas - Special Sphutas - Lagna Degrees'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'விசேஷ லக்னங்கள் (ஹோரா, ஆரூட, கடிகா, இந்து, பாவ, ஸ்ரீ) மற்றும் யோகி, அவயோகி, பீஜ ஸ்புடம், 22-ம் திரேக்காணம், 64-ம் நவாம்சம்' : 'Special Lagnas (Hora, Arudha, Ghatika, Indu, Bhava, Shree) & Yogi, Avayogi, Beeja, 22nd Drekkana, 64th Navamsha'}
                </p>
              </div>
            </div>

            {renderSectionBadge(12, (
              <span className="px-2.5 py-1 rounded-lg bg-purple-100/70 dark:bg-purple-950/40 text-[11px] font-bold text-purple-800 dark:text-purple-300">
                {isTamil ? '12 முக்கிய ஸ்புடங்கள்' : '12 Special Sphutas'}
              </span>
            ))}
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[12] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-6">
              {/* Introduction Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/70 dark:bg-stone-900/50 border border-purple-900/10 dark:border-purple-500/15 text-xs text-stone-700 dark:text-stone-300 leading-relaxed space-y-1.5">
                <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>{isTamil ? 'வேத ஜோதிட விசேஷ லக்னங்கள் & சூட்சும ஸ்புடக் கோட்பாடுகள்' : 'Vedic Principles of Special Lagnas and Sensitive Sphutas'}</span>
                </div>
                <p>
                  {isTamil
                    ? 'மகரிஷி பராசரர் மற்றும் ஜைமினி மகரிஷி முறைப்படி, மனித வாழ்க்கையின் குறிப்பிட்ட பலன்களை ஆராய விசேஷ லக்னங்கள் பயன்படுகின்றன: தன வரவிற்கு ஹோரா லக்னம், சமூக அந்தஸ்திற்கு ஆரூட லக்னம், அதிகார பதவிக்கு கடிகா லக்னம், அழியாச் செல்வ யோகத்திற்கு இந்து லக்னம், ஆயுள் ஆரோக்கியத்திற்கு பாவ லக்னம் மற்றும் மாங்கல்ய பாக்கியத்திற்கு ஸ்ரீ லக்னம் ஆகியவை கணிக்கப்படுகின்றன.'
                    : 'According to Maharishi Parashara and Jaimini Maharishi, Special Lagnas reveal specific life spheres: Hora Lagna for financial flow, Arudha Lagna for societal status, Ghatika Lagna for authority and power, Indu Lagna for wealth fortunes, Bhava Lagna for vitality, and Shree Lagna for Lakshmi Kataksham.'}
                </p>
                <p>
                  {isTamil
                    ? 'மேலும் ஜாதகத்தின் அதிர்ஷ்டத்தை நிர்ணயிக்கும் யோகி, அவயோகி, பீஜ ஸ்புடம் மற்றும் ஆயுள் சூட்சுமங்களை உணர்த்தும் 22-ம் திரேக்காணம், 64-ம் நவாம்சம் ஆகிய முக்கிய பாகைகள் கீழே வழங்கப்பட்டுள்ளன.'
                    : 'Key karmic indices including Yogi, Avayogi, Beeja Sphuta (fertility vitality), Pars Fortuna, 22nd Drekkana, and 64th Navamsha are computed below.'}
                </p>
              </div>

              {/* Sub-Tabs: All | Lagnas | Sphutas | Karmic */}
              <div className="flex flex-wrap items-center gap-2 border-b border-amber-900/10 dark:border-stone-800 pb-2">
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? 'அனைத்து விபரங்கள்' : 'All Details'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('lagnas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'lagnas'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '1. விசேஷ லக்னங்கள் (6)' : '1. Special Lagnas (6)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('sphutas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'sphutas'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '2. அதிர்ஷ்ட யோக ஸ்புடங்கள் (6)' : '2. Prosperity Sphutas (6)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('karmic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'karmic'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '3. ஆயுள் & கர்ம சூட்சுமங்கள் (7)' : '3. Karmic Points (7)'}
                </button>
              </div>

              {/* PART 1: SPECIAL LAGNAS (விசேஷ லக்னங்கள்) */}
              {(specialLagnaTab === 'all' || specialLagnaTab === 'lagnas') && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>👑</span>
                      <span>{isTamil ? 'விசேஷ லக்னங்கள் அட்டவணை (Special Lagnas Table)' : 'Special Lagnas (Hora, Arudha, Ghatika, Indu, Bhava, Shree)'}</span>
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isTamil
                        ? 'பராசரர் மற்றும் ஜைமினி மகரிஷி அருளிய 6 சூட்சும விசேஷ லக்னங்களின் துல்லிய பாகைகள் மற்றும் பலன்கள்'
                        : 'Precision calculations and functional significance of the 6 Classical Special Lagnas'}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EF] dark:bg-[#1A1513] text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'லக்னம்' : 'Special Lagna'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'அதிபதி' : 'Ruling Planet'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'ராசி' : 'Rasi / Sign'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'பாகை - கலை - விகலை' : 'Deg - Min - Sec'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'நட்சத்திரம் / பாதம்' : 'Nakshatra / Pada'}</th>
                          <th className="py-2.5 px-3">{isTamil ? 'முக்கியத்துவம் & பலன்கள்' : 'Significance & Functional Areas'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 bg-white/50 dark:bg-[#201A17]">
                        {horoscope.specialLagnas?.specialLagnas?.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{item.symbol}</span>
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.nameTa : item.nameEn}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-[11px] text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? (item.lordTa || '---') : (item.lordEn || '---')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-bold text-stone-900 dark:text-stone-100">
                              {isTamil ? item.rasiTa : item.rasiEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-indigo-700 dark:text-indigo-400">
                              {isTamil ? (item.degDMSTa || item.degDMS) : (item.degDMSEn || item.degDMS)}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-stone-700 dark:text-stone-300">
                              {item.nakTa ? `${isTamil ? item.nakTa : item.nakEn} (${item.pada})` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 text-[11px] max-w-xs">
                              {isTamil ? item.purposeTa : item.purposeEn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PART 2: PROSPERITY SPHUTAS (அதிர்ஷ்ட & யோக ஸ்புடங்கள்) */}
              {(specialLagnaTab === 'all' || specialLagnaTab === 'sphutas') && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>🌟</span>
                      <span>{isTamil ? 'அதிர்ஷ்ட & யோக ஸ்புடங்கள் (Prosperity & Fortune Sphutas)' : 'Auspicious Sphutas (Yogi, Avayogi, Beeja, Fortuna)'}</span>
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isTamil
                        ? 'யோகி பாகை, அவயோகி பாகை, மாற்று யோகி, பீஜ ஸ்புடம், அதிர்ஷ்டப் பாகை மற்றும் 5-ம் பாவ பலம்'
                        : 'Yogi, Avayogi, Sahayogi, Beeja Sphuta, Pars Fortuna, and 5th House Strengths'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Yogi Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.yogi && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/30 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                            <span>🌟</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.yogi.nameTa : horoscope.specialLagnas.auspiciousSphutas.yogi.nameEn}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/60 font-bold text-[10px] text-emerald-900 dark:text-emerald-200">
                            {isTamil ? `அதிபதி: ${horoscope.specialLagnas.auspiciousSphutas.yogi.lordTa}` : `Lord: ${horoscope.specialLagnas.auspiciousSphutas.yogi.lordEn}`}
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.yogi.rasiTa : (horoscope.specialLagnas.auspiciousSphutas.yogi.rasiEn || horoscope.specialLagnas.auspiciousSphutas.yogi.rasiTa)} {horoscope.specialLagnas.auspiciousSphutas.yogi.degDMS}
                        </div>
                        <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                          {isTamil ? `நட்சத்திரம்: ${horoscope.specialLagnas.auspiciousSphutas.yogi.nakTa} பாதம் ${horoscope.specialLagnas.auspiciousSphutas.yogi.pada}` : `${horoscope.specialLagnas.auspiciousSphutas.yogi.nakEn} Pada ${horoscope.specialLagnas.auspiciousSphutas.yogi.pada}`}
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.yogi.notesTa : horoscope.specialLagnas.auspiciousSphutas.yogi.notesEn}
                        </p>
                      </div>
                    )}

                    {/* Avayogi Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.avayogi && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-500/30 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                            <span>⚠️</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.avayogi.nameTa : horoscope.specialLagnas.auspiciousSphutas.avayogi.nameEn}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 font-bold text-[10px] text-amber-900 dark:text-amber-200">
                            {isTamil ? `அதிபதி: ${horoscope.specialLagnas.auspiciousSphutas.avayogi.lordTa}` : `Lord: ${horoscope.specialLagnas.auspiciousSphutas.avayogi.lordEn}`}
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.avayogi.rasiTa : (horoscope.specialLagnas.auspiciousSphutas.avayogi.rasiEn || horoscope.specialLagnas.auspiciousSphutas.avayogi.rasiTa)} {horoscope.specialLagnas.auspiciousSphutas.avayogi.degDMS}
                        </div>
                        <div className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">
                          {isTamil ? `நட்சத்திரம்: ${horoscope.specialLagnas.auspiciousSphutas.avayogi.nakTa} பாதம் ${horoscope.specialLagnas.auspiciousSphutas.avayogi.pada}` : `${horoscope.specialLagnas.auspiciousSphutas.avayogi.nakEn} Pada ${horoscope.specialLagnas.auspiciousSphutas.avayogi.pada}`}
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.avayogi.notesTa : horoscope.specialLagnas.auspiciousSphutas.avayogi.notesEn}
                        </p>
                      </div>
                    )}

                    {/* Sahayogi & Fortuna Card */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-500/30 shadow-2xs space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 text-xs flex items-center gap-1">
                            <span>🌕</span>
                            <span>{isTamil ? 'மாற்று யோகி (Sahayogi):' : 'Sahayogi:'}</span>
                          </span>
                          <span className="font-bold text-indigo-800 dark:text-indigo-200 text-xs px-2 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900/40">
                            {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.planetTa : horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.planetEn}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400">
                          {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.notesTa : horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.notesEn}
                        </p>
                      </div>

                      <div className="border-t border-indigo-200 dark:border-indigo-800/40 pt-1.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 text-xs flex items-center gap-1">
                            <span>🎯</span>
                            <span>{isTamil ? 'அதிர்ஷ்டப் பாகை (Fortuna):' : 'Pars Fortuna:'}</span>
                          </span>
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-xs">
                            {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.rasiTa : (horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.rasiEn || horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.rasiTa)} {horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.degDMS}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400">
                          {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.notesTa : horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.notesEn}
                        </p>
                      </div>
                    </div>

                    {/* Beeja Sphuta Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.beeja && (
                      <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-500/30 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5 text-xs">
                            <span>🌱</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.beeja.nameTa : horoscope.specialLagnas.auspiciousSphutas.beeja.nameEn}</span>
                          </span>
                          <span className="font-mono font-bold text-rose-800 dark:text-rose-200 text-xs">
                            {horoscope.specialLagnas.auspiciousSphutas.beeja.degDMS}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono font-semibold text-stone-700 dark:text-stone-300">
                          {isTamil ? `சூத்திரம்: ${horoscope.specialLagnas.auspiciousSphutas.beeja.formulaTa}` : `Formula: ${horoscope.specialLagnas.auspiciousSphutas.beeja.formulaEn}`}
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.beeja.notesTa : horoscope.specialLagnas.auspiciousSphutas.beeja.notesEn}
                        </p>
                      </div>
                    )}

                    {/* 5th House Strengths Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.fifthHouseStrength && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/40 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1.5 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5 text-xs">
                            <span>👶</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.nameTa : horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.nameEn}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-xs">
                          <div className="p-1.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'சுப பலம்' : 'Subha Bala'}</div>
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.subhaBalam}</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-rose-100/60 dark:bg-rose-950/40 border border-rose-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'அசுப பலம்' : 'Asubha Bala'}</div>
                            <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.asubhaBalam}</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'சுப ஆதிப்பத்தியம்' : 'Subha Lordship'}</div>
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.subhaAdhipatyam}</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-rose-100/60 dark:bg-rose-950/40 border border-rose-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'அசுப ஆதிப்பத்தியம்' : 'Asubha Lordship'}</div>
                            <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.asubhaAdhipatyam}</div>
                          </div>
                        </div>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium pt-0.5">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.ratioTa : horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.ratioEn}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PART 3: KARMIC & CRITICAL POINTS (ஆயுள் & கர்ம சூட்சுமங்கள்) */}
              {(specialLagnaTab === 'all' || specialLagnaTab === 'karmic') && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>{isTamil ? 'ஆயுள் & கர்ம சூட்சும புள்ளிகள் (Karmic & Critical Vulnerability Points)' : 'Karmic Points (22nd Drekkana, 64th Navamsha, Sarpa Drekkana, Andhakamsa)'}</span>
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isTamil
                        ? '22-ம் திரேக்காணம், 64-ம் நவாம்சம், சர்ப்ப திரேக்காணம், அந்தகாம்சம் மற்றும் மிருத்யு பாகை நிலைப்பாடுகள்'
                        : 'Critical transit triggers and planetary vulnerability indicators'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* 22nd Drekkana */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "⚔️ 22-ம் திரேக்காணம்" : "⚔️ 22nd Drekkana (Khara)"}</span>
                        <span className="font-bold text-[#7A1A22] dark:text-amber-300 font-mono">{isTamil ? horoscope.specialLagnas?.karmicPoints?.drekkana22?.rasiTa : horoscope.specialLagnas?.karmicPoints?.drekkana22?.rasiEn}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? `அதிபதி: ${horoscope.specialLagnas?.karmicPoints?.drekkana22?.lordTa}` : `Lord: ${horoscope.specialLagnas?.karmicPoints?.drekkana22?.lordEn}`}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.drekkana22?.notesTa : horoscope.specialLagnas?.karmicPoints?.drekkana22?.notesEn}
                      </p>
                    </div>

                    {/* 64th Navamsha */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "🛡️ 64-ம் நவாம்சம்" : "🛡️ 64th Navamsha"}</span>
                        <span className="font-bold text-[#7A1A22] dark:text-amber-300 font-mono">{isTamil ? horoscope.specialLagnas?.karmicPoints?.navamsha64?.rasiTa : horoscope.specialLagnas?.karmicPoints?.navamsha64?.rasiEn}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? `அதிபதி: ${horoscope.specialLagnas?.karmicPoints?.navamsha64?.lordTa}` : `Lord: ${horoscope.specialLagnas?.karmicPoints?.navamsha64?.lordEn}`}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.navamsha64?.notesTa : horoscope.specialLagnas?.karmicPoints?.navamsha64?.notesEn}
                      </p>
                    </div>

                    {/* Sarpa Drekkana */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "🐍 சர்ப்ப திரேக்காணம்" : "🐍 Sarpa Drekkana"}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{isTamil ? horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.planetTa : horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.planetEn}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? 'அமைந்துள்ள கிரகம்' : 'Occupying Planet'}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.notesTa : horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.notesEn}
                      </p>
                    </div>

                    {/* Andhakamsa */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "👁️ அந்தகாம்சம்" : "👁️ Andhakamsa"}</span>
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 font-mono">{isTamil ? (horoscope.specialLagnas?.karmicPoints?.andhakamsa?.planetsTa || '---') : (horoscope.specialLagnas?.karmicPoints?.andhakamsa?.planetsEn || horoscope.specialLagnas?.karmicPoints?.andhakamsa?.planetsTa || '---')}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? 'அமைந்துள்ள கிரகம்' : 'Occupying Planet'}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.andhakamsa?.notesTa : horoscope.specialLagnas?.karmicPoints?.andhakamsa?.notesEn}
                      </p>
                    </div>

                    {/* Pushkaramsha */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "✨ புஷ்கராம்சம்" : "✨ Pushkaramsha"}</span>
                        <span className="font-bold text-stone-500 font-mono">{isTamil ? (horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.planetsTa || '---') : (horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.planetsEn || horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.planetsTa || '---')}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.notesTa : horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.notesEn}
                      </p>
                    </div>

                    {/* Mrityu Bhaga */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "🛡️ மிருத்யு பாகை" : "🛡️ Mrityu Bhaga"}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">{isTamil ? (horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.planetsTa || '---') : (horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.planetsEn || horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.planetsTa || '---')}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.notesTa : horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.notesEn}
                      </p>
                    </div>

                    {/* Avamrityu Nakshatra */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? "⚕️ அவமிருத்யு நட்சத்திரம்" : "⚕️ Avamrityu Nakshatra"}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">{isTamil ? (horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.planetsTa || '---') : (horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.planetsEn || horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.planetsTa || '---')}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.notesTa : horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.notesEn}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        <div id="horoscope-section-13" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(13)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                13
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🪐</span>
                  <span>{isTamil ? '13. கிரகங்களின் நைசர்கிக, தற்கால, பஞ்சதா நட்பு & அவஸ்தா - மண்டல நிலைகள்.' : '13. Planetary Friendships (Naisargika, Tatkalika, Panchadha) & Avasthas - Mandalam'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'நைசர்கிக நட்பு, தற்கால நட்பு, பஞ்சதா மைத்ரி (அதி மித்துரு முதல் அதி சத்துரு வரை), பாலாதி - ஜாக்ரதாதி - தீப்தாதி - சயனாதி 12 அவஸ்தைகள் & மண்டலங்கள்' : 'Naisargika, Tatkalika, Panchadha Maitri, Baladi, Jagradadi, Deeptadi, Shayanadi 12 Avasthas & Mandalam'}
                </p>
              </div>
            </div>

            {renderSectionBadge(13, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {isTamil ? '4 முக்கிய பகுதிகள்' : '4 Major Sections'}
              </span>
            ))}
          </button>

          {/* Section Body */}
          {openSections[13] && (
            <div className="p-4 sm:p-5 border-t border-amber-900/10 dark:border-amber-500/10 space-y-6">
              {/* Tab Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-amber-900/5 dark:bg-stone-800/60 rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSection13Tab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section13Tab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'அனைத்தும்' : 'All Views'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection13Tab('naisargika')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section13Tab === 'naisargika'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'நைசர்கிக (நிலையான) நட்பு விபரங்கள்' : '1. Naisargika (Permanent)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection13Tab('tatkalika')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section13Tab === 'tatkalika'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'தற்கால நட்பு விபரங்கள்' : '2. Tatkalika (Temporal)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection13Tab('panchadha')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section13Tab === 'panchadha'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'கிரகங்களின் சத்துரு - மித்துரு நிலைகள்.' : '3. Panchadha Maitri'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection13Tab('avastha')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section13Tab === 'avastha'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'கிரகங்களின் அவஸ்தா - மண்டலம் - தசா சமய நிலைகள்.' : '4. Avasthas & Mandalam'}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* PART 1: நைசர்கிக (நிலையான) நட்பு விபரங்கள் */}
              {/* ------------------------------------------------------------- */}
              {(section13Tab === 'all' || section13Tab === 'naisargika') && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>🌟</span>
                        <span>{isTamil ? 'நைசர்கிக (நிலையான) நட்பு விபரங்கள்' : 'Permanent Planetary Friendships (Naisargika Maitri)'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'மூலத்திரிகோணம், உச்சம், நீசம், ஆட்சி மற்றும் நிலையான நட்பு, சமம், பகை விபரங்கள் (பராசர கணித விதிப்படி)' : 'Permanent dignity and natural friendships according to Parashari principles'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium self-start sm:self-auto">
                      {isTamil ? 'இயற்கை நட்பு விபரம்' : 'Natural Maitri'}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'மூலத்திரிகோணம்' : 'Moolatrikona'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'உச்ச வீடு' : 'Exaltation'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'நீச வீடு' : 'Debilitation'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'ஆட்சி வீடு' : 'Own Sign'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-emerald-800 dark:text-emerald-400">{isTamil ? 'நைசர்கிக மித்துரு (நண்பர்கள்)' : 'Friends'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-amber-800 dark:text-amber-400">{isTamil ? 'சமம் (நடுநிலை)' : 'Neutrals'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-rose-800 dark:text-rose-400">{isTamil ? 'நைசர்கிக சத்துரு (பகைவர்கள்)' : 'Enemies'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-mono text-[11px]">
                        {horoscope?.planetaryRelationshipsAndAvasthas?.naisargikaList?.map(row => (
                          <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 sm:p-2.5 font-bold text-[#7A1A22] dark:text-[#E8838B] font-sans">
                              {isTamil ? row.nameTa : row.nameEn}
                            </td>
                            <td className="p-2 sm:p-2.5 text-stone-700 dark:text-stone-300 font-sans">
                              {isTamil ? (row.moolatrikonaTa || row.moolatrikona) : (row.moolatrikonaEn || row.moolatrikona)}
                            </td>
                            <td className="p-2 sm:p-2.5 text-amber-700 dark:text-amber-300 font-sans">
                              {isTamil ? (row.exaltationTa || row.exaltation) : (row.exaltationEn || row.exaltation)}
                            </td>
                            <td className="p-2 sm:p-2.5 text-rose-700 dark:text-rose-300 font-sans">
                              {isTamil ? (row.debilitationTa || row.debilitation) : (row.debilitationEn || row.debilitation)}
                            </td>
                            <td className="p-2 sm:p-2.5 text-emerald-700 dark:text-emerald-300 font-sans">
                              {isTamil ? (row.ownTa || row.own) : (row.ownEn || row.own)}
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium">
                                {isTamil ? row.friendsTa : (row.friendsEn || row.friendsTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-2 py-0.5 rounded bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium">
                                {isTamil ? row.neutralsTa : (row.neutralsEn || row.neutralsTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-2 py-0.5 rounded bg-rose-100/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 font-medium">
                                {isTamil ? row.enemiesTa : (row.enemiesEn || row.enemiesTa)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Parashari Rule Footnote */}
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-[#1A1412] border border-amber-900/10 dark:border-amber-500/10 text-[11px] space-y-1">
                    <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>📖</span>
                      <span>{isTamil ? 'நைசர்கிக மைத்ரி பராசர கணித விதி:' : 'Parashari Principle for Naisargika Maitri:'}</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                      {isTamil
                        ? 'ஒரு கிரகத்தின் மூலத்திரிகோண ராசியிலிருந்து 2, 4, 5, 8, 9, 12-ம் ராசிகளின் அதிபதிகளும், அக்கிரகத்தின் உச்ச ராசி அதிபதியும் “நைசர்கிக மித்துருக்கள்” (நண்பர்கள்) ஆவர். 3, 6, 7, 10, 11-ம் ராசிகளின் அதிபதிகள் “நைசர்கிக சத்துருக்கள்” (பகைவர்கள்) ஆவர். மற்றவர் சமம் ஆவர்.'
                        : 'Lords of the 2nd, 4th, 5th, 8th, 9th, and 12th houses from a planet’s Moolatrikona sign, along with the lord of its exaltation sign, are its natural friends. Lords of other houses are enemies or neutrals.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 2: தற்கால நட்பு விபரங்கள் */}
              {/* ------------------------------------------------------------- */}
              {(section13Tab === 'all' || section13Tab === 'tatkalika') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>🤝</span>
                        <span>{isTamil ? 'தற்கால நட்பு விபரங்கள்' : 'Temporal Planetary Friendships (Tatkalika Maitri)'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'ஜாதகத்தில் உள்ள கிரக அமைப்புகளின்படி (ராசி தூரம்) தற்காலிக நண்பர்கள் மற்றும் பகைவர்கள் விபரம்' : 'Temporal friendships computed from the actual house distance in this horoscope'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium self-start sm:self-auto">
                      {isTamil ? 'ஜாதக நிலை விபரம்' : 'Chart-Specific'}
                    </span>
                  </div>

                  {/* Rule Explanatory Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                      <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                        <span>✓</span>
                        <span>{isTamil ? 'தற்கால மித்துருக்கள் (Temporal Friends):' : 'Temporal Friends:'}</span>
                      </div>
                      <p className="text-[11px] mt-1 text-emerald-900 dark:text-emerald-300/90 leading-tight font-sans">
                        {isTamil
                          ? 'ஒரு கிரகம் நின்ற ராசியிலிருந்து 2, 3, 4, 10, 11, 12-ம் ராசிகளில் அமர்ந்த கிரகங்கள் தற்கால நண்பர்கள் (+1).'
                          : 'Planets placed in the 2nd, 3rd, 4th, 10th, 11th, and 12th houses from a planet become temporal friends (+1).'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-500/20 text-rose-950 dark:text-rose-200">
                      <div className="font-bold flex items-center gap-1.5 text-xs text-rose-800 dark:text-rose-300">
                        <span>✗</span>
                        <span>{isTamil ? 'தற்கால சத்துருக்கள் (Temporal Enemies):' : 'Temporal Enemies:'}</span>
                      </div>
                      <p className="text-[11px] mt-1 text-rose-900 dark:text-rose-300/90 leading-tight font-sans">
                        {isTamil
                          ? 'ஒரு கிரகம் நின்ற அதே ராசி (1) மற்றும் 5, 6, 7, 8, 9-ம் ராசிகளில் அமர்ந்த கிரகங்கள் தற்கால பகைவர்கள் (-1).'
                          : 'Planets placed in the same sign (1st) or 5th, 6th, 7th, 8th, and 9th houses become temporal enemies (-1).'}
                      </p>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'நின்ற ராசி' : 'Occupied Sign'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-emerald-800 dark:text-emerald-400">
                            {isTamil ? 'தற்கால மித்துருக்கள் (2, 3, 4, 10, 11, 12-ல் உள்ளவை)' : 'Temporal Friends (2, 3, 4, 10, 11, 12)'}
                          </th>
                          <th className="p-2 sm:p-2.5 font-bold text-rose-800 dark:text-rose-400">
                            {isTamil ? 'தற்கால சத்துருக்கள் (1, 5, 6, 7, 8, 9-ல் உள்ளவை)' : 'Temporal Enemies (1, 5, 6, 7, 8, 9)'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-mono text-[11px]">
                        {horoscope?.planetaryRelationshipsAndAvasthas?.tatkalikaData?.map(row => (
                          <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 sm:p-2.5 font-bold text-[#7A1A22] dark:text-[#E8838B] font-sans">
                              {isTamil ? row.nameTa : row.nameEn}
                            </td>
                            <td className="p-2 sm:p-2.5 text-stone-800 dark:text-stone-200 font-sans font-semibold">
                              {isTamil ? (row.rasiNameTa || row.rasiName) : (row.rasiNameEn || row.rasiName)}
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium inline-block">
                                {isTamil ? row.friendsTa : (row.friendsEn || row.friendsTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-2 py-0.5 rounded bg-rose-100/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 font-medium inline-block">
                                {isTamil ? row.enemiesTa : (row.enemiesEn || row.enemiesTa)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 3: கிரகங்களின் சத்துரு - மித்துரு நிலைகள். (பஞ்சதா மைத்ரி) */}
              {/* ------------------------------------------------------------- */}
              {(section13Tab === 'all' || section13Tab === 'panchadha') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>⚔️</span>
                        <span>{isTamil ? 'கிரகங்களின் சத்துரு - மித்துரு நிலைகள்.' : 'Compound Relationships (Panchadha Maitri)'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'நைசர்கிக (இயற்கை) நட்பு மற்றும் தற்காலிக நட்பின் கூட்டு சேர்க்கை (அதி மித்துரு முதல் அதி சத்துரு வரை 5 நிலைகள்)' : 'Compound relationships synthesized from Natural and Temporal dignities'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 font-medium self-start sm:self-auto">
                      {isTamil ? 'பஞ்சதா மைத்ரி' : '5-Fold Compound'}
                    </span>
                  </div>

                  {/* 5 Levels Formula Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center text-[10px] font-sans">
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-900 dark:text-emerald-300 font-bold">
                      <div>{isTamil ? "அதி மித்துரு (+2)" : "Great Friend (+2)"}</div>
                      <div className="text-[9px] font-normal text-emerald-700 dark:text-emerald-400">{isTamil ? "நட்பு + தற்கால நட்பு" : "Permanent + Temporal Friend"}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-300 text-green-800 dark:text-green-300 font-semibold">
                      <div>{isTamil ? "மித்துரு (+1)" : "Friend (+1)"}</div>
                      <div className="text-[9px] font-normal text-green-700 dark:text-green-400">{isTamil ? "சமம் + தற்கால நட்பு" : "Neutral + Temporal Friend"}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-300 font-medium">
                      <div>{isTamil ? "சமம் (0)" : "Neutral (0)"}</div>
                      <div className="text-[9px] font-normal text-amber-700 dark:text-amber-400">{isTamil ? "நட்பு+பகை / சமம்+சமம்" : "Friend+Enemy / Neutral+Neutral"}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300 font-semibold">
                      <div>{isTamil ? "சத்துரு (-1)" : "Enemy (-1)"}</div>
                      <div className="text-[9px] font-normal text-rose-700 dark:text-rose-400">{isTamil ? "சமம் + தற்கால பகை" : "Neutral + Temporal Enemy"}</div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 border border-rose-500 text-rose-950 dark:text-rose-200 font-bold">
                      <div>{isTamil ? "அதி சத்துரு (-2)" : "Great Enemy (-2)"}</div>
                      <div className="text-[9px] font-normal text-rose-800 dark:text-rose-300">{isTamil ? "பகை + தற்கால பகை" : "Permanent + Temporal Enemy"}</div>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'ராசி & அதிபதி நிலை' : 'Sign & Lord Dignity'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-emerald-800 dark:text-emerald-400">{isTamil ? 'அதி மித்துரு' : 'Great Friend'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-green-700 dark:text-green-400">{isTamil ? 'மித்துரு' : 'Friend'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-amber-700 dark:text-amber-400">{isTamil ? 'சமம்' : 'Neutral'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-rose-700 dark:text-rose-400">{isTamil ? 'சத்துரு' : 'Enemy'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-rose-900 dark:text-rose-300">{isTamil ? 'அதி சத்துரு' : 'Great Enemy'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-mono text-[11px]">
                        {horoscope?.planetaryRelationshipsAndAvasthas?.panchadhaData?.map(row => (
                          <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 sm:p-2.5 font-bold text-[#7A1A22] dark:text-[#E8838B] font-sans">
                              {isTamil ? row.nameTa : row.nameEn}
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="font-semibold text-stone-800 dark:text-stone-200">{isTamil ? (row.rasiNameTa || row.rasiName) : (row.rasiNameEn || row.rasiName)}</span>
                              <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${row.presentDignityBadge}`}>
                                {isTamil ? (row.presentDignityTa || row.presentDignity) : (row.presentDignityEn || row.presentDignityTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium">
                                {isTamil ? row.adhiMithruTa : (row.adhiMithruEn || row.adhiMithruTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 font-medium">
                                {isTamil ? row.mithruTa : (row.mithruEn || row.mithruTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium">
                                {isTamil ? row.samaTa : (row.samaEn || row.samaTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-medium">
                                {isTamil ? row.shatruTa : (row.shatruEn || row.shatruTa)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-950 dark:text-rose-200 font-bold">
                                {isTamil ? row.adhiShatruTa : (row.adhiShatruEn || row.adhiShatruTa)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 9x9 Panchadha Compound Matrix Table */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <span>▦</span>
                      <span>{isTamil ? '9x9 பஞ்சதா மைத்ரி ஒப்பீட்டு கட்டம் (Compound Relationship Matrix):' : '9x9 Panchadha Maitri Comparison Matrix:'}</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                      <table className="w-full text-[10px] text-center border-collapse">
                        <thead>
                          <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20">
                            <th className="p-1.5 font-bold text-left">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                            {(isTamil ? ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது'] : ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']).map((pName, i) => (
                              <th key={i} className="p-1.5 font-bold">{pName}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                          {horoscope?.planetaryRelationshipsAndAvasthas?.panchadhaData?.map(row => (
                            <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                              <td className="p-1.5 font-bold text-left text-[#7A1A22] dark:text-[#E8838B] whitespace-nowrap">
                                {isTamil ? row.nameTa : row.nameEn}
                              </td>
                              {['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'].map(colId => {
                                const rel = row.relations?.[colId];
                                if (!rel) return <td key={colId} className="p-1 text-stone-400">-</td>;
                                if (colId === row.id) {
                                  return (
                                    <td key={colId} className="p-1">
                                      <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-400 text-[9px]">
                                        {isTamil ? 'சுயம்' : 'Self'}
                                      </span>
                                    </td>
                                  );
                                }
                                return (
                                  <td key={colId} className="p-1">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] whitespace-nowrap ${rel.badge}`}>
                                      {isTamil ? rel.textTa : (rel.textEn || rel.textTa)}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 4: கிரகங்களின் அவஸ்தா - மண்டலம் - தசா சமய நிலைகள். */}
              {/* ------------------------------------------------------------- */}
              {(section13Tab === 'all' || section13Tab === 'avastha') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>🔮</span>
                        <span>{isTamil ? 'கிரகங்களின் அவஸ்தா - மண்டலம் - தசா சமய நிலைகள்.' : 'Planetary Avasthas, Mandalam & Dasha Samaya States'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'பாலாதி 5 அவஸ்தைகள், ஜாக்ரதாதி 3 அவஸ்தைகள், தீப்தாதி 9 அவஸ்தைகள், சயனாதி 12 தசா சமய அவஸ்தைகள் மற்றும் மண்டலங்கள்' : 'Classical 5-fold Avastha system & Mandala classifications for planetary strength'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium self-start sm:self-auto">
                      {isTamil ? 'அவஸ்தா நிலைகள்' : 'Planetary Avasthas'}
                    </span>
                  </div>

                  {/* Explanatory cards on 5 Avastha systems */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px] flex items-center gap-1">
                        <span>👶</span>
                        <span>{isTamil ? 'பாலாதி அவஸ்தைகள் (Baladi 5 States):' : 'Baladi (5 States):'}</span>
                      </div>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil
                          ? 'ஒற்றை ராசி: பால (25%), குமார (50%), யுவ (100%), விருத்த (15%), மிருத (0%). இரட்டை ராசி: தலைகீழ் வரிசை.'
                          : 'Odd signs: Bala (25%), Kumara (50%), Yuva (100%), Vriddha (15%), Mrita (0%). Reversed in even signs.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px] flex items-center gap-1">
                        <span>👁️</span>
                        <span>{isTamil ? 'ஜாக்ரதாதி & தீப்தாதி (Consciousness & Moods):' : 'Jagradadi & Deeptadi (9 Moods):'}</span>
                      </div>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil
                          ? 'ஜாக்ரத் (விழிப்பு 100%), ஸ்வப்னம் (கனவு 50%), சுஷுப்தி (உறக்கம் 0%). தீப்தாதி: உச்சம் (தீப்தா), ஆட்சி (சுவஸ்தா), அஸ்தமனம் (விகலா).'
                          : 'Jagrata (Awake 100%), Swapna (Dreaming 50%), Sushupti (Sleeping 0%). Deeptadi classifies 9 emotional states.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px] flex items-center gap-1">
                        <span>🌀</span>
                        <span>{isTamil ? 'சயனாதி 12 அவஸ்தைகள் (Shayanadi 12):' : 'Shayanadi 12 (Dasha States):'}</span>
                      </div>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil
                          ? 'கிரக எண், நின்ற நட்சத்திரம், பாத எண், சந்திரன் நட்சத்திரம், லக்ன-ஜனன கடிகை கொண்டு தசா சமய பலன் அறியும் சூட்சும கணிதம்.'
                          : 'Classical Parashari formula revealing what activity the planet performs during its Dasha period.'}
                      </p>
                    </div>
                  </div>

                  {/* Main Avasthas Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'கிரகம்' : 'Planet'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'ராசி & பாகை' : 'Rashi & Deg'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'பாலாதி அவஸ்தை (பலம் %)' : 'Baladi & Potency'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'ஜாக்ரதாதி நிலை' : 'Jagradadi State'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'தீப்தாதி நிலை' : 'Deeptadi State'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-indigo-900 dark:text-indigo-300">{isTamil ? 'சயனாதி 12 அவஸ்தை (தசா சமய பலன்)' : 'Shayanadi 12 (Dasha State)'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'மண்டலம்' : 'Mandala'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-mono text-[11px]">
                        {horoscope?.planetaryRelationshipsAndAvasthas?.avasthasData?.map(row => (
                          <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 sm:p-2.5 font-bold text-[#7A1A22] dark:text-[#E8838B] font-sans">
                              {isTamil ? row.nameTa : row.nameEn}
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className="font-semibold text-stone-800 dark:text-stone-200">
                                {isTamil ? (row.rasiNameTa || row.rasiName) : (row.rasiNameEn || row.rasiName)}
                              </span>
                              <span className="ml-1 text-[10px] text-stone-500">{row.degInSignFormatted}</span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${row.baladi?.badge}`}>
                                {isTamil ? row.baladi?.ta : (row.baladi?.en || row.baladi?.ta)}
                              </span>
                              <div className="text-[9px] text-stone-500 mt-0.5 font-sans">
                                {isTamil ? `பலம்: ${row.baladi?.potency}` : `Potency: ${row.baladi?.potency}`}
                              </div>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${row.jagradadi?.badge}`}>
                                {isTamil ? row.jagradadi?.ta : (row.jagradadi?.en || row.jagradadi?.ta)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${row.deeptadi?.badge}`}>
                                {isTamil ? row.deeptadi?.ta : (row.deeptadi?.en || row.deeptadi?.ta)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${row.shayanadi?.badge}`}>
                                {isTamil ? row.shayanadi?.ta : (row.shayanadi?.en || row.shayanadi?.ta)}
                              </span>
                              <div className="text-[9px] text-stone-600 dark:text-stone-400 mt-0.5 font-sans">
                                {isTamil ? row.shayanadi?.effectTa : row.shayanadi?.en}
                              </div>
                            </td>
                            <td className="p-2 sm:p-2.5 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${row.mandalam?.badge}`}>
                                {isTamil ? row.mandalam?.ta : (row.mandalam?.en || row.mandalam?.ta)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 12 Shayanadi Quick Legend Box */}
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-[#1A1412] border border-amber-900/10 dark:border-amber-500/10 text-[11px] space-y-2">
                    <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>📜</span>
                      <span>{isTamil ? 'சயனாதி 12 தசா சமய அவஸ்தைகளின் குறிப்புரை:' : 'Shayanadi 12 Dasha States Reference Guide:'}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-sans">
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "1. சயனம்:" : "1. Shayana:"}</span> {isTamil ? "சுகபோகம், அமைதி" : "Comfort, Relaxation, Peace"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "2. உபவேஷனம்:" : "2. Upaveshana:"}</span> {isTamil ? "கல்வி, கௌரவம்" : "Learning, Status, Dignity"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "3. நேத்ரபாணி:" : "3. Netrapani:"}</span> {isTamil ? "பார்வை கவனம், அலைச்சல்" : "Restlessness, Travel, Eye Care"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "4. பிரகாஷனம்:" : "4. Prakashana:"}</span> {isTamil ? "புகழ், கீர்த்தி, அதிகாரம்" : "Fame, Glory, High Executive Power"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "5. கமனம்:" : "5. Gamana:"}</span> {isTamil ? "தூரப் பயணம், மாற்றம்" : "Travel, Overseas Move, Shift"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "6. ஆகமனம்:" : "6. Aagamana:"}</span> {isTamil ? "இல்லம் திரும்புதல், சுபம்" : "Homecoming, Auspicious Events"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "7. சபாவாசம்:" : "7. Sabhavasatha:"}</span> {isTamil ? "சபையில் மதிப்பு, தலைமை" : "Social Honors, Assemblies, Command"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "8. ஆகமம்:" : "8. Aagama:"}</span> {isTamil ? "தன லாபம், சாஸ்திர ஞானம்" : "Wealth Growth, Shastric Erudition"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "9. போஜனம்:" : "9. Bhojana:"}</span> {isTamil ? "அறுசுவை உணவு, தான்யம்" : "Sumptuous Feasts, Nourishment"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "10. நிருத்யலிப்சா:" : "10. Nrityalipsa:"}</span> {isTamil ? "கலை ஆர்வம், உற்சாகம்" : "Artistic Passion, Vitality"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "11. கௌதுகம்:" : "11. Kautuka:"}</span> {isTamil ? "குதூகலம், வெற்றி" : "Joy, Celebration, Victory"}
                      </div>
                      <div className="p-1.5 rounded bg-white/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                        <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? "12. நித்ரா:" : "12. Nidra:"}</span> {isTamil ? "மந்த நிலை, தாமதம்" : "Slumber, Lethargy, Delays"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ITEM 14: 14. கிரகங்களுக்கான பார்வை கோணங்கள் & பாவக-கிரகங்களிடையே பார்வை கோணங்கள் */}
        {/* ======================================================== */}
        <div id="horoscope-section-14" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(14)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                14
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>📐</span>
                  <span>{isTamil ? '14. கிரகங்களுக்கான பார்வை கோணங்கள் & பாவக-கிரகங்களிடையே பார்வை கோணங்கள்.' : '14. Planetary Aspect Angles & Bhava-Graha Aspect Angles'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'கிரகங்களுக்கிடையேயான பார்வை கோணங்கள் (9x9 அட்டவணை) & 12 பாவக மத்தியங்களின் மீதான கிரகங்களின் பார்வை பலம் (பராசர திருக்பல கணிதம்)' : 'Planetary-to-Planetary Aspect Angles (9x9 Matrix) & Bhava Madhya Aspect Angles (12x9 Matrix)'}
                </p>
              </div>
            </div>

            {renderSectionBadge(14, (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/40 text-[11px] font-bold text-indigo-900 dark:text-indigo-300">
                {isTamil ? '2 முக்கிய பகுதிகள்' : '2 Major Tables'}
              </span>
            ))}
          </button>

          {/* Section Body */}
          {openSections[14] && (
            <div className="p-4 sm:p-5 border-t border-amber-900/10 dark:border-amber-500/10 space-y-6">
              {/* Tab Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-amber-900/5 dark:bg-stone-800/60 rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSection14Tab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section14Tab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'அனைத்தும் (All)' : 'All Views'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection14Tab('graha')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section14Tab === 'graha'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'கிரகங்களுக்கான பார்வை கோணங்கள்' : '1. Graha Aspect Angles (9x9)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection14Tab('bhava')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section14Tab === 'bhava'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'பாவக-கிரகங்களிடையே பார்வை கோணங்கள்' : '2. Bhava-Graha Aspect Angles (12x9)'}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* PART 1: கிரகங்களுக்கான பார்வை கோணங்கள் */}
              {/* ------------------------------------------------------------- */}
              {(section14Tab === 'all' || section14Tab === 'graha') && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>👁️</span>
                        <span>{isTamil ? 'கிரகங்களுக்கான பார்வை கோணங்கள்' : 'Planetary Aspect Angles (Graha Drishti Matrix)'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? '9 கிரகங்களின் பரஸ்பர பார்வை கோண தூரம் (பாகை கலை) மற்றும் பராசர திருக்பல பலம் (0 to 60 ஷஷ்டியாம்சம் / 100%)' : 'Mutual aspect angles and Parashari Drik Bala aspect potencies among all 9 planets'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium self-start sm:self-auto">
                      {isTamil ? '9x9 பார்வை கட்டம்' : '9x9 Graha Matrix'}
                    </span>
                  </div>

                  {/* Parashara Aspect Rules Key Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px]">{isTamil ? "7-ம் பார்வை (180°):" : "7th Aspect (180°):"}</div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil ? "அனைத்து கிரகங்களுக்கும் 7-ம் பார்வை முழு பார்வை (100% / 60)" : "Full Aspect (100% / 60 Virupas) for all planets on 7th sign."}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px]">{isTamil ? "செவ்வாய் (Mars):" : "Mars Special Aspect:"}</div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil ? "4-ம் பார்வை (90°) & 8-ம் பார்வை (210°) முழு பார்வை (100% / 60)" : "Full special aspect on 4th (90°) & 8th (210°) signs."}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px]">{isTamil ? "குரு & ராகு/கேது:" : "Jupiter, Rahu, Ketu:"}</div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil ? "5-ம் பார்வை (120°) & 9-ம் பார்வை (240°) முழு பார்வை (100% / 60)" : "Full special trinal aspect on 5th (120°) & 9th (240°) signs."}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11px]">{isTamil ? "சனி (Saturn):" : "Saturn Special Aspect:"}</div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isTamil ? "3-ம் பார்வை (60°) & 10-ம் பார்வை (270°) முழு பார்வை (100% / 60)" : "Full special aspect on 3rd (60°) & 10th (270°) signs."}
                      </div>
                    </div>
                  </div>

                  {/* 9x9 Graha Drishti Matrix Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-[10px] text-center border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20">
                          <th className="p-2 font-bold text-left whitespace-nowrap">
                            {isTamil ? 'பார்வை வீசும் கிரகம்' : 'Aspecting Planet'}
                          </th>
                          {horoscope?.aspectAnglesData?.grahaHeaders?.map(gh => (
                            <th key={gh.id} className="p-1.5 font-bold whitespace-nowrap">
                              <div>{isTamil ? gh.nameTa : gh.nameEn}</div>
                              <div className="text-[8px] font-normal text-stone-500 font-mono">{isTamil ? (gh.rasiNameTa || gh.rasiName) : (gh.rasiNameEn || gh.rasiName)}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                        {horoscope?.aspectAnglesData?.grahaMatrix?.map(row => (
                          <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 font-bold text-left text-[#7A1A22] dark:text-[#E8838B] whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold">{isTamil ? row.nameTa : row.nameEn}</span>
                                <span className="text-[9px] font-normal text-stone-500">({isTamil ? (row.rasiNameTa || row.rasiName) : (row.rasiNameEn || row.rasiName)})</span>
                              </div>
                              <div className="text-[8px] text-stone-400 font-mono">{row.lonFormatted}</div>
                            </td>
                            {['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'].map(colId => {
                              const cell = row.cells?.[colId];
                              if (!cell) return <td key={colId} className="p-1 text-stone-400">-</td>;
                              if (cell.isSelf) {
                                return (
                                  <td key={colId} className="p-1">
                                    <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-400 text-[9px]">
                                      {isTamil ? 'சுயம்' : 'Self'}
                                    </span>
                                  </td>
                                );
                              }
                              return (
                                <td key={colId} className="p-1">
                                  <div className="font-mono text-[9px] font-bold text-stone-700 dark:text-stone-300">
                                    {cell.angleFormatted}
                                  </div>
                                  <div className="mt-0.5">
                                    <span className={`px-1 py-0.5 rounded text-[8px] whitespace-nowrap inline-block ${cell.badge}`}>
                                      {cell.percent > 0 ? `${cell.percent}% (${cell.virupas})` : '0%'}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary of 100% Full Aspects */}
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-[#1A1412] border border-amber-900/10 dark:border-amber-500/10 text-xs space-y-2">
                    <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5 text-xs">
                      <span>🎯</span>
                      <span>{isTamil ? 'ஜாதகத்தில் கிரகங்களின் நேரடி முழு பார்வைகள் (100% Full Aspects Summary):' : 'Key 100% Full Aspects in this Horoscope:'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-sans">
                      {horoscope?.aspectAnglesData?.grahaMatrix?.map(row => (
                        <div key={row.id} className="p-2 rounded-lg bg-white/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#7A1A22] dark:text-amber-400">{isTamil ? row.nameTa : row.nameEn}</span>
                            <span className="text-[9px] text-stone-500 font-mono">{isTamil ? (row.rasiNameTa || row.rasiName) : (row.rasiNameEn || row.rasiName)}</span>
                          </div>
                          <div className="text-[10px] text-stone-700 dark:text-stone-300">
                            <span className="text-stone-500">{isTamil ? 'முழு பார்வை: ' : 'Full Aspect: '}</span>
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">{isTamil ? (row.fullAspectListTa || row.fullAspectList) : (row.fullAspectListEn || row.fullAspectList)}</span>
                          </div>
                          <div className="text-[9px] text-stone-500 leading-tight">
                            <span>{isTamil ? 'பகுதி பார்வை: ' : 'Partial: '}</span>
                            <span>{isTamil ? (row.partialAspectListTa || row.partialAspectList) : (row.partialAspectListEn || row.partialAspectList)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 2: பாவக-கிரகங்களிடையே பார்வை கோணங்கள் */}
              {/* ------------------------------------------------------------- */}
              {(section14Tab === 'all' || section14Tab === 'bhava') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>🏛️</span>
                        <span>{isTamil ? 'பாவக-கிரகங்களிடையே பார்வை கோணங்கள்' : 'Bhava-Graha Aspect Angles (12x9 Matrix)'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? '12 பாவக மத்தியங்களின் (Bhava Madhya) மீது 9 கிரகங்கள் செலுத்தும் பார்வை கோணங்கள் மற்றும் சுப-அசுப பார்வை பலம்' : 'Aspect angles and benefic/malefic impact of all 9 planets on the mid-points (Madhya) of the 12 houses'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium self-start sm:self-auto">
                      {isTamil ? '12x9 பாவ பார்வை கட்டம்' : '12x9 Bhava Matrix'}
                    </span>
                  </div>

                  {/* Benefic / Malefic Aspect Explanatory Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                      <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                        <span>🌿</span>
                        <span>{isTamil ? 'சுப கிரக பார்வை (Benefic Aspect):' : 'Benefic Aspects:'}</span>
                      </div>
                      <p className="text-[11px] mt-1 text-emerald-900 dark:text-emerald-300/90 leading-tight font-sans">
                        {isTamil
                          ? 'குரு, சுக்கிரன், வளர்பிறை சந்திரன், சுப புதன் பார்வை படும் பாவகங்கள் விருத்தியடையும்; தோஷங்கள் நிவர்த்தியாகும்.'
                          : 'Houses receiving aspects from Jupiter, Venus, Waxing Moon, and Mercury gain strength, protection, and auspicious results.'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-500/20 text-rose-950 dark:text-rose-200">
                      <div className="font-bold flex items-center gap-1.5 text-xs text-rose-800 dark:text-rose-300">
                        <span>⚡</span>
                        <span>{isTamil ? 'பாப கிரக பார்வை (Malefic Aspect):' : 'Malefic Aspects:'}</span>
                      </div>
                      <p className="text-[11px] mt-1 text-rose-900 dark:text-rose-300/90 leading-tight font-sans">
                        {isTamil
                          ? 'சனி, செவ்வாய், சூரியன், ராகு, கேதுவின் தீவிர பார்வை படும் பாவக காரகத்துவங்களில் போராட்டங்களும் கவனமும் தேவைப்படும்.'
                          : 'Houses receiving intense aspects from Saturn, Mars, Rahu, Ketu, and Sun require extra care and specific remedies.'}
                      </p>
                    </div>
                  </div>

                  {/* 12x9 Bhava Aspect Matrix Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-[10px] text-center border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20">
                          <th className="p-2 font-bold text-left whitespace-nowrap">
                            {isTamil ? 'பாவகம் & பாவ மத்தியம்' : 'Bhava & Madhya'}
                          </th>
                          {(isTamil ? ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது'] : ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']).map((pName, i) => (
                            <th key={i} className="p-1.5 font-bold whitespace-nowrap">
                              {pName}
                            </th>
                          ))}
                          <th className="p-1.5 font-bold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                            {isTamil ? 'சுப பலம்' : 'Subha'}
                          </th>
                          <th className="p-1.5 font-bold text-rose-800 dark:text-rose-400 whitespace-nowrap">
                            {isTamil ? 'அசுப பலம்' : 'Asubha'}
                          </th>
                          <th className="p-2 font-bold text-left whitespace-nowrap">
                            {isTamil ? 'நிகர பார்வை நிலை' : 'Verdict'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                        {horoscope?.aspectAnglesData?.bhavaMatrix?.map(bRow => (
                          <tr key={bRow.bhavaNum} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 font-bold text-left text-[#7A1A22] dark:text-[#E8838B] whitespace-nowrap">
                              <div>{isTamil ? bRow.nameTa : bRow.nameEn}</div>
                              <div className="text-[9px] font-normal text-stone-500 font-mono">
                                {isTamil ? (bRow.rasiNameTa || bRow.rasiName) : (bRow.rasiNameEn || bRow.rasiName)} • {bRow.madhyaFormatted}
                              </div>
                            </td>
                            {['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'].map(colId => {
                              const cell = bRow.cells?.[colId];
                              if (!cell) return <td key={colId} className="p-1 text-stone-400">-</td>;
                              return (
                                <td key={colId} className="p-1">
                                  <div className="font-mono text-[9px] font-bold text-stone-700 dark:text-stone-300">
                                    {cell.angleFormatted}
                                  </div>
                                  <div className="mt-0.5">
                                    <span className={`px-1 py-0.5 rounded text-[8px] whitespace-nowrap inline-block ${cell.badge}`}>
                                      {cell.percent > 0 ? `${cell.percent}%` : '0%'}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                            <td className="p-1.5 font-bold text-emerald-800 dark:text-emerald-400 font-mono text-[10px]">
                              {bRow.totalSubhaVirupas}
                            </td>
                            <td className="p-1.5 font-bold text-rose-800 dark:text-rose-400 font-mono text-[10px]">
                              {bRow.totalAsubhaVirupas}
                            </td>
                            <td className="p-2 text-left whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[9px] ${bRow.verdictBadge}`}>
                                {isTamil ? bRow.verdictTa : (bRow.verdictEn || bRow.verdictTa)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bhava Insights Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1.5">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <span>🛡️</span>
                        <span>{isTamil ? 'அதிக சுப பார்வை பெற்ற பாவகங்கள் (Strongly Protected Houses):' : 'Houses with Strong Benefic Aspects:'}</span>
                      </div>
                      <div className="space-y-1 text-[11px] font-sans">
                        {horoscope?.aspectAnglesData?.bhavaMatrix
                          ?.filter(b => b.totalSubhaVirupas >= b.totalAsubhaVirupas)
                          ?.slice(0, 3)
                          ?.map(b => (
                            <div key={b.bhavaNum} className="flex items-center justify-between p-1.5 rounded bg-white/70 dark:bg-stone-800/40 border border-emerald-200 dark:border-emerald-900/40">
                              <span className="font-bold text-emerald-950 dark:text-emerald-200">{isTamil ? b.nameTa : b.nameEn}</span>
                              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono">{isTamil ? "சுப பலம்:" : "Subha Bala:"} {b.totalSubhaVirupas}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-500/20 text-xs space-y-1.5">
                      <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>{isTamil ? 'கவனம் / பரிகாரம் தேவைப்படும் பாவகங்கள் (Houses Needing Remedies):' : 'Houses Receiving Strong Malefic Aspects:'}</span>
                      </div>
                      <div className="space-y-1 text-[11px] font-sans">
                        {horoscope?.aspectAnglesData?.bhavaMatrix
                          ?.filter(b => b.totalAsubhaVirupas > b.totalSubhaVirupas)
                          ?.slice(0, 3)
                          ?.map(b => (
                            <div key={b.bhavaNum} className="flex items-center justify-between p-1.5 rounded bg-white/70 dark:bg-stone-800/40 border border-rose-200 dark:border-rose-900/40">
                              <span className="font-bold text-rose-950 dark:text-rose-200">{isTamil ? b.nameTa : b.nameEn}</span>
                              <span className="text-[10px] text-rose-800 dark:text-rose-300 font-mono">{isTamil ? "பாப பலம்:" : "Asubha Bala:"} {b.totalAsubhaVirupas}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ITEM 15: 15. பஞ்ச பட்சி விபரம் (15. Pancha Pakshi Details) */}
        {/* ======================================================== */}
        <div id="horoscope-section-15" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(15)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                15
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🦅</span>
                  <span>{isTamil ? '15. பஞ்ச பட்சி விபரம்.' : '15. Pancha Pakshi Details (Ancient Tamil Siddha System)'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'தமிழ் சித்தர்கள் அருளிய பஞ்ச பட்சி சாஸ்திரம் - ஜென்ம பட்சி, பஞ்ச தொழில்கள், வாராந்திர 5 ஜாம அட்டவணை & தற்போதைய பட்சி நிலை' : 'Pancha Pakshi Shastra - Birth Bird, 5 Activities, 7-Day 5-Yamam Day/Night Schedules & Live Status'}
                </p>
              </div>
            </div>

            {renderSectionBadge(15, (
              <span className="px-2.5 py-1 rounded-lg bg-teal-100/70 dark:bg-teal-950/40 text-[11px] font-bold text-teal-900 dark:text-teal-300">
                {isTamil ? 'சித்தர் பஞ்ச பட்சி' : 'Siddha Tradition'}
              </span>
            ))}
          </button>

          {/* Section Body */}
          {openSections[15] && (
            <div className="p-4 sm:p-5 border-t border-amber-900/10 dark:border-amber-500/10 space-y-6">
              {/* Tab Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-amber-900/5 dark:bg-stone-800/60 rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSection15Tab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section15Tab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'அனைத்தும்' : 'All Views'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection15Tab('profile')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section15Tab === 'profile'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'ஜென்ம பட்சி & விபரங்கள்' : '1. Birth Bird Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection15Tab('schedule')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section15Tab === 'schedule'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'வாராந்திர 5 ஜாம அட்டவணை' : '2. 7-Day 5-Yamam Cycle'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection15Tab('live')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section15Tab === 'live'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'தற்போதைய பட்சி நிலை' : '3. Live Bird Status'}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* PART 1: ஜென்ம பட்சி & விபரங்கள் (BIRTH BIRD PROFILE) */}
              {/* ------------------------------------------------------------- */}
              {(section15Tab === 'all' || section15Tab === 'profile') && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>🦚</span>
                        <span>{isTamil ? 'ஜென்ம பட்சி அடிப்படை விவரக்குறிப்பு' : 'Natal Birth Bird Elemental Profile'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'அகத்தியர் மற்றும் போகர் சித்தர்கள் அருளிய ஐந்து பட்சிகளின் பஞ்சபூத ஆற்றல் தத்துவம்' : 'Ancient Tamil Siddha classification of planetary and elemental biorhythms'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium self-start sm:self-auto">
                      {isTamil ? horoscope?.panchaPakshiData?.birthBird?.pakshaTa : (horoscope?.panchaPakshiData?.birthBird?.pakshaEn || horoscope?.panchaPakshiData?.birthBird?.pakshaTa)}
                    </span>
                  </div>

                  {/* Classical Intro Text from Siddha Shastra */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-[#1A1412] border border-amber-900/10 dark:border-amber-500/10 text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed space-y-1.5 font-sans">
                    <p>
                      {isTamil
                        ? 'தமிழ் சித்தர்களால் ஆக்கப்பட்ட "ஐம்புள் நூல்" என கூறப்படும் பஞ்சபட்சி சாஸ்திரம் உலகம் தழுவிய எல்லாவற்றையும் அதாவது ஒலி, ஒளி, இடம், பொருள், காலம், எண், வலிமை, நிறம், உடை, ஊண், இன்னபிற உலக நடப்புகள் என அனைத்து முக்கியத்துவத்தையும் குறிப்பதாக ஐந்து பட்சிகளாக (வல்லூறு, ஆந்தை, காகம், கோழி, மயில்) வகைப்படுத்தியுள்ளனர்.'
                        : 'Pancha Pakshi Shastra, traditionally known as "Aimpol Nool" composed by Tamil Siddhas, categorizes all cosmic energies into five sacred birds: Hawk, Owl, Crow, Cock, and Peacock.'}
                    </p>
                    <p>
                      {isTamil
                        ? 'நட்சத்திர பட்சியினை அறிந்துகொள்வதும், அதன் செயல்திறன் நிலைகளை அறிந்து செயல்படுவதும் அனைத்து விதத்திலும் நற்பயனையே அளிக்கிறது. பட்சியின் தொழில் வலிமையறிந்து செய்யும் செயல் மேன்மேலும் செழிப்புறும்.'
                        : 'Knowing your birth bird and its active power states enables starting actions at the most auspicious times to achieve maximum success.'}
                    </p>
                  </div>

                  {/* Birth Bird Core Attributes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-[#241B17] dark:to-[#1E1714] border border-amber-900/15 dark:border-amber-500/20">
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">{isTamil ? 'ஜென்ம பட்சி' : 'Birth Bird'}</div>
                      <div className="text-base sm:text-lg font-black text-[#7A1A22] dark:text-amber-400 mt-0.5 flex items-center gap-1.5">
                        <span>🦅</span>
                        <span>{isTamil ? horoscope?.panchaPakshiData?.birthBird?.ta : horoscope?.panchaPakshiData?.birthBird?.en}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">{isTamil ? 'பக்ஷம் & நட்சத்திரம்' : 'Paksha & Star'}</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        {isTamil ? horoscope?.panchaPakshiData?.birthBird?.nakshatraNameTa : (horoscope?.panchaPakshiData?.birthBird?.nakshatraNameEn || horoscope?.panchaPakshiData?.birthBird?.nakshatraNameTa)}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{isTamil ? horoscope?.panchaPakshiData?.birthBird?.pakshaTa : (horoscope?.panchaPakshiData?.birthBird?.pakshaEn || horoscope?.panchaPakshiData?.birthBird?.pakshaTa)}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">{isTamil ? 'பஞ்சபூதம் & நிறம்' : 'Element & Color'}</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        {isTamil ? horoscope?.panchaPakshiData?.birthBird?.elementTa : (horoscope?.panchaPakshiData?.birthBird?.elementEn || horoscope?.panchaPakshiData?.birthBird?.elementTa)}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{isTamil ? horoscope?.panchaPakshiData?.birthBird?.colorTa : (horoscope?.panchaPakshiData?.birthBird?.colorEn || horoscope?.panchaPakshiData?.birthBird?.colorTa)}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">{isTamil ? 'திசை & அதிபதி' : 'Direction & Planet'}</div>
                      <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                        {isTamil ? horoscope?.panchaPakshiData?.birthBird?.directionTa : (horoscope?.panchaPakshiData?.birthBird?.directionEn || horoscope?.panchaPakshiData?.birthBird?.directionTa)}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{isTamil ? horoscope?.panchaPakshiData?.birthBird?.rulingPlanetTa : (horoscope?.panchaPakshiData?.birthBird?.rulingPlanetEn || horoscope?.panchaPakshiData?.birthBird?.rulingPlanetTa)}</div>
                    </div>
                  </div>

                  {/* Friendship, Enmity & Bad Day Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                        <span>🤝</span>
                        <span>{isTamil ? 'நட்பு பட்சிகள்:' : 'Friend Birds:'}</span>
                      </div>
                      <div className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                        {isTamil ? horoscope?.panchaPakshiData?.birthBird?.friendBirdsTa : (horoscope?.panchaPakshiData?.birthBird?.friendBirdsEn || horoscope?.panchaPakshiData?.birthBird?.friendBirdsTa)}
                      </div>
                      <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80">
                        {isTamil ? 'இவர்களுடன் கூட்டு, ஒப்பந்தம், நட்பு நற்பலன் தரும்.' : 'Favorable for alliances and partnerships.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                      <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 text-xs">
                        <span>⚔️</span>
                        <span>{isTamil ? 'பகை பட்சிகள்:' : 'Inimical Birds:'}</span>
                      </div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {isTamil ? horoscope?.panchaPakshiData?.birthBird?.enemyBirdsTa : (horoscope?.panchaPakshiData?.birthBird?.enemyBirdsEn || horoscope?.panchaPakshiData?.birthBird?.enemyBirdsTa)}
                      </div>
                      <p className="text-[10px] text-stone-500">
                        {isTamil ? 'இவர்களுடன் வாக்குவாதம், போட்டி, கூட்டு சேர்வதைத் தவிர்க்கவும்.' : 'Avoid direct conflicts and major shared ventures.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-500/30 text-xs space-y-1">
                      <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-xs">
                        <span>⚠️</span>
                        <span>{isTamil ? 'படுபக்ஷி / சாவு நாட்கள்:' : 'Inauspicious Days (Padupakshi):'}</span>
                      </div>
                      <div className="text-sm font-bold text-rose-950 dark:text-rose-200">
                        {isTamil ? horoscope?.panchaPakshiData?.birthBird?.badDaysTa : (horoscope?.panchaPakshiData?.birthBird?.badDaysEn || horoscope?.panchaPakshiData?.birthBird?.badDaysTa)}
                      </div>
                      <p className="text-[10px] text-rose-800/90 dark:text-rose-300/90 font-sans leading-tight">
                        {isTamil
                          ? 'படுபட்சி நாள் என்பது பட்சி மிகவும் வலிமை குறைந்து காணப்படும் நாளாகும். மிக முக்கியமான அலுவல்களை அன்று தவிர்க்கவும்.'
                          : 'Padupakshi is when the bird is severely weakened. Avoid major initiatives and critical events on these weekdays.'}
                      </p>
                    </div>
                  </div>

                  {/* 5 Activities Reference Table */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>⚙️</span>
                      <span>{isTamil ? 'பட்சிகளின் ஐந்து தொழில்கள் மற்றும் பலன்கள்:' : 'The 5 Bird Activities & Potencies:'}</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                            <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'தொழில்' : 'Activity'}</th>
                            <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'சக்தி பலம் (%)' : 'Potency'}</th>
                            <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'விளைவு & ஜோதிட வழிகாட்டுதல்' : 'Astrological Effect & Guidance'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans text-[11px]">
                          {horoscope?.panchaPakshiData?.activitiesList?.map(act => (
                            <tr key={act.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                              <td className="p-2 sm:p-2.5 font-bold whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded ${act.badge}`}>
                                  {isTamil ? act.ta : act.en}
                                </span>
                              </td>
                              <td className="p-2 sm:p-2.5 font-mono font-bold text-stone-800 dark:text-stone-200">
                                {act.potency}
                              </td>
                              <td className="p-2 sm:p-2.5 text-stone-700 dark:text-stone-300">
                                {isTamil ? act.effectTa : (act.effectEn || act.effectTa)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 2: வாராந்திர 5 ஜாம அட்டவணை (7-DAY 5-YAMAM SCHEDULE) */}
              {/* ------------------------------------------------------------- */}
              {(section15Tab === 'all' || section15Tab === 'schedule') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>📅</span>
                        <span>{isTamil ? 'வாராந்திர 5 ஜாம கால அட்டவணை (பகல் & இரவு சுழற்சி)' : 'Weekly 5-Yamam Day & Night Activity Schedule'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil
                          ? `உங்கள் ஜென்ம பட்சியான ${horoscope?.panchaPakshiData?.birthBird?.ta}க்கு 7 கிழமைகளிலும் பகல் மற்றும் இரவில் நடைபெறும் தொழில் கால அட்டவணை`
                          : `Complete 5-yamam cycle for ${horoscope?.panchaPakshiData?.birthBird?.en} across all 7 days of the week`}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-medium self-start sm:self-auto">
                      {isTamil ? '7 நாள் சுழற்சி' : 'Weekly Master Grid'}
                    </span>
                  </div>

                  {/* 7-Day Master Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-[10px] text-center border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20">
                          <th className="p-2 font-bold text-left whitespace-nowrap">{isTamil ? 'கிழமை' : 'Day'}</th>
                          <th className="p-1 font-bold whitespace-nowrap">{isTamil ? "ஜாமம் 1" : "Yamam 1"}<br/><span className="text-[8px] font-normal text-stone-500 font-mono">06:00-08:24</span></th>
                          <th className="p-1 font-bold whitespace-nowrap">{isTamil ? "ஜாமம் 2" : "Yamam 2"}<br/><span className="text-[8px] font-normal text-stone-500 font-mono">08:24-10:48</span></th>
                          <th className="p-1 font-bold whitespace-nowrap">{isTamil ? "ஜாமம் 3" : "Yamam 3"}<br/><span className="text-[8px] font-normal text-stone-500 font-mono">10:48-13:12</span></th>
                          <th className="p-1 font-bold whitespace-nowrap">{isTamil ? "ஜாமம் 4" : "Yamam 4"}<br/><span className="text-[8px] font-normal text-stone-500 font-mono">13:12-15:36</span></th>
                          <th className="p-1 font-bold whitespace-nowrap">{isTamil ? "ஜாமம் 5" : "Yamam 5"}<br/><span className="text-[8px] font-normal text-stone-500 font-mono">15:36-18:00</span></th>
                          <th className="p-2 font-bold text-left whitespace-nowrap">{isTamil ? 'வெற்றி நேரம் (அரசு / ஊண்)' : 'Golden Hours (Ruling / Feeding)'}</th>
                          <th className="p-2 font-bold text-left whitespace-nowrap">{isTamil ? 'தவிர்க்க வேண்டிய நேரம் (சாவு)' : 'Inauspicious Hours (Dying)'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                        {horoscope?.panchaPakshiData?.weeklySchedule?.map(row => (
                          <tr key={row.weekdayId} className={`hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors ${row.isBadDay ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}`}>
                            <td className="p-2 text-left font-bold text-[#7A1A22] dark:text-[#E8838B] whitespace-nowrap">
                              <div>{isTamil ? row.weekdayTa : (row.weekdayEn || row.weekdayTa)}</div>
                              {row.isBadDay && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[8px] font-bold inline-block mt-0.5">
                                  {isTamil ? 'படுபக்ஷி நாள்' : 'Bad Day'}
                                </span>
                              )}
                            </td>
                            {row.dayYamams.map(y => (
                              <td key={y.yamamNum} className="p-1">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold inline-block whitespace-nowrap ${y.badge}`}>
                                  {isTamil ? y.ta : y.en} ({y.potency})
                                </span>
                              </td>
                            ))}
                            <td className="p-2 text-left font-mono text-[9px] text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                              {isTamil ? row.goldenHoursTa : (row.goldenHoursEn || row.goldenHoursTa)}
                            </td>
                            <td className="p-2 text-left font-mono text-[9px] text-rose-800 dark:text-rose-400 whitespace-nowrap font-bold">
                              {isTamil ? row.saavuHoursTa : (row.saavuHoursEn || row.saavuHoursTa)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    * {isTamil ? 'இரவு 5 ஜாமங்கள் மாலை 06:00 மணி முதல் மறுநாள் காலை 06:00 மணி வரை 5 சம பங்குகளாக சுழற்சி முறையில் இயங்கும்.' : 'Night-time 5 Yamams run from 06:00 PM to 06:00 AM in matching classical 2.4-hour intervals.'}
                  </p>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 3: தற்போதைய பட்சி நிலை (LIVE BIRD STATUS TRACKER) */}
              {/* ------------------------------------------------------------- */}
              {(section15Tab === 'all' || section15Tab === 'live') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>⏱️</span>
                        <span>{isTamil ? 'தற்போதைய பட்சி நிலை கண்காணிப்பான்' : 'Live Pancha Pakshi Activity Tracker'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'இன்றைய நாளில் இந்த நேரத்தில் உங்கள் ஜென்ம பட்சியின் தொழில் நிலை மற்றும் உடனடி வழிகாட்டுதல்' : 'Current real-time activity and actionable advice for the native'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium self-start sm:self-auto flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{isTamil ? 'நேரடி நிலை' : 'Live'}</span>
                    </span>
                  </div>

                  {/* Live Status Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50/80 dark:from-[#251B17] dark:via-[#1F1713] dark:to-[#1C1512] border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          {isTamil ? `இன்றைய கிழமை: ${horoscope?.panchaPakshiData?.currentStatus?.weekdayTa}` : `Today: ${horoscope?.panchaPakshiData?.currentStatus?.weekdayEn || horoscope?.panchaPakshiData?.currentStatus?.weekdayTa}`}
                        </span>
                        <span className="text-stone-300 dark:text-stone-600">•</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                          {isTamil ? (horoscope?.panchaPakshiData?.currentStatus?.timeSlotTa || horoscope?.panchaPakshiData?.currentStatus?.timeSlot) : (horoscope?.panchaPakshiData?.currentStatus?.timeSlotEn || horoscope?.panchaPakshiData?.currentStatus?.timeSlot)}
                        </span>
                        <span className="text-stone-300 dark:text-stone-600">•</span>
                        <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                          {isTamil ? `ஜாமம் ${horoscope?.panchaPakshiData?.currentStatus?.yamamNum}` : `Yamam ${horoscope?.panchaPakshiData?.currentStatus?.yamamNum}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-xs text-stone-600 dark:text-stone-300">{isTamil ? 'தற்போதைய பட்சியின் தொழில்:' : 'Current Activity:'}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${horoscope?.panchaPakshiData?.currentStatus?.badge}`}>
                          {isTamil ? horoscope?.panchaPakshiData?.currentStatus?.activityTa : horoscope?.panchaPakshiData?.currentStatus?.activityEn} ({horoscope?.panchaPakshiData?.currentStatus?.potency})
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 font-sans pt-1">
                        {isTamil ? horoscope?.panchaPakshiData?.currentStatus?.effectTa : (horoscope?.panchaPakshiData?.currentStatus?.effectEn || horoscope?.panchaPakshiData?.currentStatus?.effectTa)}
                      </p>
                    </div>

                    <div className="shrink-0 text-center sm:text-right p-3 rounded-xl bg-white/70 dark:bg-stone-800/40 border border-amber-900/10 dark:border-amber-500/15">
                      <div className="text-[10px] text-stone-500">{isTamil ? 'காரிய வெற்றி பலன்' : 'Readiness Rating'}</div>
                      <div className="text-xl font-black text-[#7A1A22] dark:text-amber-400 font-mono mt-0.5">
                        {horoscope?.panchaPakshiData?.currentStatus?.potency}
                      </div>
                      <div className="text-[9px] text-stone-500 mt-0.5">
                        {horoscope?.panchaPakshiData?.currentStatus?.potency === '100%' || horoscope?.panchaPakshiData?.currentStatus?.potency === '75%'
                          ? (isTamil ? 'சுப காரியங்களுக்கு நன்று' : 'Highly Favorable')
                          : (isTamil ? 'எச்சரிக்கை தேவை' : 'Caution Advised')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ITEM 16: 16. கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர் & தாரா பலமுள்ள நட்சத்திரங்கள் */}
        {/* ======================================================== */}
        <div id="horoscope-section-16" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(16)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                16
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>⚖️</span>
                  <span>{isTamil ? '16. கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர் & தாரா பலமுள்ள நட்சத்திரங்கள்.' : '16. Graha Pasakar - Bodhakar - Karagar - Vedhagar & Tara Bala Nakshatras'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'கிரகங்களின் பலன் வழங்கும் காரகர்கள் (சீக்கிர பலன், நிறைய தருபவர், நிதான பலன், தடுத்து விடுபவர்) & ஜன்ம நவதாரை பலன்கள்' : 'Planetary Role Deliverers (Pasakar, Bodhakar, Karagar, Vedhagar) & 9-Tara Auspiciousness Matrix'}
                </p>
              </div>
            </div>

            {renderSectionBadge(16, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {isTamil ? '2 முக்கிய பகுதிகள்' : '2 Major Sections'}
              </span>
            ))}
          </button>

          {/* Section Body */}
          {openSections[16] && (
            <div className="p-4 sm:p-5 border-t border-amber-900/10 dark:border-amber-500/10 space-y-6">
              {/* Tab Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-amber-900/5 dark:bg-stone-800/60 rounded-xl border border-amber-900/10 dark:border-amber-500/15 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSection16Tab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section16Tab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'அனைத்தும் (All)' : 'All Views'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection16Tab('pasakar')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section16Tab === 'pasakar'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர்' : '1. Pasakar - Bodhakar - Karagar - Vedhagar'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection16Tab('tara')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    section16Tab === 'tara'
                      ? 'bg-[#7A1A22] text-white shadow-2xs dark:bg-amber-500 dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {isTamil ? 'தாரா பலமுள்ள நட்சத்திரங்கள்' : '2. Tara Bala Nakshatras (9 Taras)'}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* PART 1: கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர் */}
              {/* ------------------------------------------------------------- */}
              {(section16Tab === 'all' || section16Tab === 'pasakar') && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>🌟</span>
                        <span>{isTamil ? 'பாசகாதி நால்வர் கோட்பாடு' : '4 Functional Planetary Roles'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil ? 'கிரகங்களின் பலன் வழங்கும் ஆற்றலைத் தூண்டும் மற்றும் தடுக்கும் காரக கிரகங்கள் (ஜாதக அலங்கார விதி)' : 'Astrological role agents that stimulate, deliver, delay or obstruct planetary results'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium self-start sm:self-auto">
                      {isTamil ? 'பாசகாதி நால்வர்' : '4 Functional Role Agents'}
                    </span>
                  </div>

                  {/* 4 Role Definition Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-500/20 text-cyan-950 dark:text-cyan-200 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-cyan-800 dark:text-cyan-300">
                        <span>⚡</span>
                        <span>{isTamil ? 'பாசகர் (Pasagar)' : 'Pasagar (Activator)'}</span>
                      </div>
                      <div className="text-[10px] text-cyan-900 dark:text-cyan-300/90 font-medium">
                        {isTamil ? 'சீக்கிர பலனைத் தருபவர்' : 'Quickly ripens & delivers results'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                        <span>🎁</span>
                        <span>{isTamil ? 'போதகர் (Bodhakar)' : 'Bodhakar (Bestower)'}</span>
                      </div>
                      <div className="text-[10px] text-emerald-900 dark:text-emerald-300/90 font-medium">
                        {isTamil ? 'நிறையத் தருபவர்' : 'Showers abundant blessings & wisdom'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-500/20 text-amber-950 dark:text-amber-200 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300">
                        <span>⏳</span>
                        <span>{isTamil ? 'காரகர் (Karagar)' : 'Karagar (Steady Doer)'}</span>
                      </div>
                      <div className="text-[10px] text-amber-900 dark:text-amber-300/90 font-medium">
                        {isTamil ? 'நிதானமாக, குறைந்த பலனைத் தருபவர்' : 'Gives measured, steady, lasting fruits'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-500/20 text-rose-950 dark:text-rose-200 space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-[11px] text-rose-800 dark:text-rose-300">
                        <span>🛑</span>
                        <span>{isTamil ? 'வேதகர் (Vedhakar)' : 'Vedhakar (Obstructionist)'}</span>
                      </div>
                      <div className="text-[10px] text-rose-900 dark:text-rose-300/90 font-medium">
                        {isTamil ? 'தடுத்து விடுவார்' : 'Blocks, pierces or delays the fruits'}
                      </div>
                    </div>
                  </div>

                  {/* Master Table (Matching Page 31 verbatim) */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'கிரகங்கள்' : 'Planets'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-cyan-800 dark:text-cyan-300">{isTamil ? 'பாசகர்' : 'Pasakar'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-emerald-800 dark:text-emerald-300">{isTamil ? 'போதகர்' : 'Bodhakar'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-amber-800 dark:text-amber-300">{isTamil ? 'காரகர்' : 'Karagar'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-rose-800 dark:text-rose-300">{isTamil ? 'வேதகர்' : 'Vedhakar'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-stone-600 dark:text-stone-400">{isTamil ? 'ஜாதகத்தில் ராசி' : 'Occupied Sign'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans text-[11px]">
                        {horoscope?.pasakarBodhakarTaraData?.pasakarRows?.map(row => (
                          <tr key={row.id} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 sm:p-2.5 font-bold text-[#7A1A22] dark:text-[#E8838B] whitespace-nowrap">
                              {isTamil ? (row.grahaTa || row.graha) : (row.grahaEn || row.graha)}
                            </td>
                            <td className="p-2 sm:p-2.5">
                              <span className="px-2 py-0.5 rounded bg-cyan-100/80 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-300 font-medium">
                                {isTamil ? (row.pasakarTa || row.pasakar) : (row.pasakarEn || row.pasakar)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold">
                                {isTamil ? (row.pothakarTa || row.pothakar) : (row.pothakarEn || row.pothakar)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5">
                              <span className="px-2 py-0.5 rounded bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium">
                                {isTamil ? (row.karakarTa || row.karakar) : (row.karakarEn || row.karakar)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5">
                              <span className="px-2 py-0.5 rounded bg-rose-100/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 font-medium">
                                {isTamil ? (row.vedhakarTa || row.vedhakar) : (row.vedhakarEn || row.vedhakar)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-semibold text-stone-700 dark:text-stone-300 font-mono">
                              {isTamil ? (row.rasiTa || row.rasi) : (row.rasiEn || row.rasi)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Classical Rule Footnote Box */}
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-[#1A1412] border border-amber-900/10 dark:border-amber-500/10 text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed font-sans space-y-1">
                    <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>📖</span>
                      <span>{isTamil ? 'சாஸ்திர குறிப்புரை (Page 31 Benchmark):' : 'Classical Principles:'}</span>
                    </div>
                    <p>
                      {isTamil
                        ? 'காரகர் நிதானமாக, குறைந்த பலனைத் தருபவர். வேதகர் தடுத்து விடுவார். போதகர் நிறையத் தருபவர். பாசகர் சீக்கிர பலனைத் தருபவர்.'
                        : 'Karagar delivers measured, delayed results. Vedhakar obstructs and creates hurdles. Bodhakar bestows abundance. Pasagar accelerates and ripens the fruits quickly.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* PART 2: தாரா பலமுள்ள நட்சத்திரங்கள் */}
              {/* ------------------------------------------------------------- */}
              {(section16Tab === 'all' || section16Tab === 'tara') && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-amber-900/15 dark:border-amber-500/15">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                        <span>✨</span>
                        <span>{isTamil ? 'தாரா பலமுள்ள நட்சத்திரங்கள்' : 'Tara Bala Nakshatras (9 Navataras across 27 Stars)'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil
                          ? `உங்கள் ஜன்ம நட்சத்திரமான "${horoscope?.pasakarBodhakarTaraData?.birthStarNameTa}" முதல் கணக்கிடப்பட்ட 9 நவதாரைகள் மற்றும் 27 நட்சத்திரங்களின் சுப பலன் அட்டவணை`
                          : `Complete 9-Tara Auspiciousness Matrix computed from your birth star "${horoscope?.pasakarBodhakarTaraData?.birthStarNameEn || horoscope?.pasakarBodhakarTaraData?.birthStarNameTa}"`}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-medium self-start sm:self-auto">
                      {isTamil ? `ஜன்ம நட்சத்திரம்: ${horoscope?.pasakarBodhakarTaraData?.birthStarNameTa}` : `Birth Star: ${horoscope?.pasakarBodhakarTaraData?.birthStarNameEn || horoscope?.pasakarBodhakarTaraData?.birthStarNameTa}`}
                    </span>
                  </div>

                  {/* Auspicious Guidance Banner */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex items-center gap-2">
                    <span className="text-lg">🌟</span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 font-sans">
                      {isTamil ? 'உத்தம வரிசையில் உள்ள நட்சத்திர நாட்களில் அனைத்து விதமான சுப காரியங்களும் செய்யலாம்.' : 'All auspicious ceremonies and ventures can be conducted successfully on Uthama Tara days.'}
                    </span>
                  </div>

                  {/* 9 Taras Master Table (Matching Page 31 verbatim) */}
                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 bg-[#FFFDF9] dark:bg-[#1C1613]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 dark:bg-amber-950/40 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 dark:border-amber-500/20 text-[11px]">
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'நட்சத்திரம் 1' : 'Cycle 1 (1-9)'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'நட்சத்திரம் 2' : 'Cycle 2 (10-18)'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'நட்சத்திரம் 3' : 'Cycle 3 (19-27)'}</th>
                          <th className="p-2 sm:p-2.5 font-bold text-center">{isTamil ? 'தாரா பலம்' : 'Quality'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'தாரை பெயர்' : 'Tara Name'}</th>
                          <th className="p-2 sm:p-2.5 font-bold">{isTamil ? 'ஜோதிடப் பலன் & வழிகாட்டுதல்' : 'Astrological Effect'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans text-[11px]">
                        {horoscope?.pasakarBodhakarTaraData?.taraRows?.map(row => (
                          <tr key={row.taraNum} className="hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors">
                            <td className="p-2 sm:p-2.5 font-bold text-stone-800 dark:text-stone-200">
                              {isTamil ? (row.star1Ta || row.star1) : (row.star1En || row.star1)}
                            </td>
                            <td className="p-2 sm:p-2.5 font-bold text-stone-800 dark:text-stone-200">
                              {isTamil ? (row.star2Ta || row.star2) : (row.star2En || row.star2)}
                            </td>
                            <td className="p-2 sm:p-2.5 font-bold text-stone-800 dark:text-stone-200">
                              {isTamil ? (row.star3Ta || row.star3) : (row.star3En || row.star3)}
                            </td>
                            <td className="p-2 sm:p-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] inline-block ${row.qualityBadge}`}>
                                {isTamil ? (row.qualityTa || row.quality) : (row.qualityEn || row.quality)}
                              </span>
                            </td>
                            <td className="p-2 sm:p-2.5 font-bold text-[#7A1A22] dark:text-[#E8838B] whitespace-nowrap">
                              {isTamil ? (row.taraTa || row.tara) : (row.taraEn || row.tara)}
                            </td>
                            <td className="p-2 sm:p-2.5 text-stone-700 dark:text-stone-300">
                              {isTamil ? (row.effectTa || row.effect) : (row.effectEn || row.effect)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Cards: Uthama vs Adhama */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1.5">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <span>✅</span>
                        <span>{isTamil ? 'சுப காரியங்களுக்கு உகந்த உத்தம தாரைகள் (Auspicious):' : 'Favorable Taras:'}</span>
                      </div>
                      <div className="text-[11px] text-emerald-950 dark:text-emerald-200 font-sans space-y-1">
                        <div>• <span className="font-bold">{isTamil ? "சம்பத்து தாரை:" : "Sampat Tara:"}</span> {isTamil ? "தன லாபம், செல்வம், வியாபாரம், ஒப்பந்தங்கள்." : "Wealth gain, commerce, prosperity, agreements."}</div>
                        <div>• <span className="font-bold">{isTamil ? "க்ஷேம தாரை:" : "Kshema Tara:"}</span> {isTamil ? "பாதுகாப்பு, சௌக்கியம், ஆரோக்கியம், சுப தொடக்கங்கள்." : "Well-being, safety, sound health, auspicious beginnings."}</div>
                        <div>• <span className="font-bold">{isTamil ? "சாதக தாரை:" : "Sadhaka Tara:"}</span> {isTamil ? "காரிய சித்தி, வெற்றி, புதிய முயற்சிகள், வேலை வாய்ப்பு." : "Achievement of goals, victory, ventures, employment."}</div>
                        <div>• <span className="font-bold">{isTamil ? "மைத்ர தாரை:" : "Mitra Tara:"}</span> {isTamil ? "நட்பு, உதவி, சமாதானம், கூட்டாண்மை." : "Friendship, alliance, cooperation, peace."}</div>
                        <div>• <span className="font-bold">{isTamil ? "பரம மைத்ர தாரை:" : "Parama Mitra Tara:"}</span> {isTamil ? "உன்னத வெற்றி, பேரின்பம், சகல சுப காரியங்கள்." : "Supreme triumph, supreme happiness, all auspicious milestones."}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-500/20 text-xs space-y-1.5">
                      <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>{isTamil ? 'சுப காரியங்களைத் தவிர்க்க வேண்டிய அதம தாரைகள் (Inauspicious):' : 'Inauspicious Taras:'}</span>
                      </div>
                      <div className="text-[11px] text-rose-950 dark:text-rose-200 font-sans space-y-1">
                        <div>• <span className="font-bold">{isTamil ? "ஜன்ம தாரை:" : "Janma Tara:"}</span> {isTamil ? "உடல் நலம் கவனம், மன உளைச்சல், சுப ஆரம்பங்களைத் தவிர்க்கவும்." : "Physical vitality care, mental calm needed, avoid high-stakes debuts."}</div>
                        <div>• <span className="font-bold">{isTamil ? "விபத்து தாரை:" : "Vipat Tara:"}</span> {isTamil ? "நஷ்டம், விரயம், விபத்து, பயணங்களைத் தவிர்க்கவும்." : "Obstacles, expenses, risk mitigation, avoid unnecessary travel."}</div>
                        <div>• <span className="font-bold">{isTamil ? "பிரத்யக்கு தாரை:" : "Pratyak Tara:"}</span> {isTamil ? "எதிர்ப்புகள், விரோதம், வழக்கு, வாக்குவாதங்கள்." : "Opposition, disputes, litigations, avoid arguments."}</div>
                        <div>• <span className="font-bold">{isTamil ? "வத தாரை:" : "Naidhana / Vadha Tara:"}</span> {isTamil ? "கடுமையான இழப்பு மற்றும் ஆபத்து (முற்றிலும் தவிர்க்கவும்)." : "Critical vulnerability, severe obstruction (strictly avoid major initiatives)."}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* ======================================================== */}
        {/* ITEM 17: 17. ஜாதகத்தில் கிரகங்களின் நிலை & கிரகங்களின் பார்வை, சேர்க்கை நிலை */}
        {/* ======================================================== */}
        <div id="horoscope-section-17" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(17)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                17
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🏛️</span>
                  <span>{isTamil ? '17. ஜாதகத்தில் கிரகங்களின் நிலை & கிரகங்களின் பார்வை, சேர்க்கை நிலை.' : '17. Planetary Dignities in Chart & Planetary Aspects, Conjunctions Table'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'ஜாதகத்தில் கிரகங்களின் ஆட்சி, உச்சம், நீசம், நட்பு, சமம், பகை, வக்ரம், அஸ்தமனம் & கிரகங்களின் பார்வை, சேர்க்கை அட்டவணை' : 'Planetary Dignities (Own, Exaltation, Debilitation, Retrograde, Combustion, Parivartana, Vargottama) & Mutual Aspects, Conjunctions'}
                </p>
              </div>
            </div>
            {renderSectionBadge(17, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {isTamil ? 'கிரக நிலை & சேர்க்கை' : 'Dignities & Aspects'}
              </span>
            ))}
          </button>

          {/* Body */}
          {openSections[17] && (
            <div className="p-4 sm:p-6 border-t border-amber-900/10 dark:border-amber-500/10 space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-amber-900/10 dark:border-amber-500/10 pb-3">
                <button
                  type="button"
                  onClick={() => setSection17Tab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    section17Tab === 'all'
                      ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                      : 'bg-amber-100/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200/60'
                  }`}
                >
                  {isTamil ? 'அனைத்தும் (All)' : 'All Tables'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection17Tab('dignities')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    section17Tab === 'dignities'
                      ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                      : 'bg-amber-100/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200/60'
                  }`}
                >
                  {isTamil ? '1. ஜாதகத்தில் கிரகங்களின் நிலை.' : '1. Planetary Dignities'}
                </button>
                <button
                  type="button"
                  onClick={() => setSection17Tab('aspects')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    section17Tab === 'aspects'
                      ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                      : 'bg-amber-100/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-200/60'
                  }`}
                >
                  {isTamil ? '2. கிரகங்களின் பார்வை, சேர்க்கை நிலை' : '2. Aspects & Conjunctions'}
                </button>
              </div>

              {/* PART 1: ஜாதகத்தில் கிரகங்களின் நிலை. */}
              {(section17Tab === 'all' || section17Tab === 'dignities') && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/20 dark:border-amber-500/20 pb-2">
                    <div className="font-bold text-sm sm:text-base text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                      <span>👑</span>
                      <span>{isTamil ? 'ஜாதகத்தில் கிரகங்களின் நிலை.' : 'Planetary Dignities & States in Horoscope'}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                      {isTamil ? 'ராசி சக்கரம், நவாம்சம் மற்றும் சூரியன் தொடர்பு அடிப்படையில்' : 'Based on Rasi, Navamsa and Solar alignment'}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs bg-white dark:bg-[#1A1412]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-100/70 dark:bg-stone-800/80 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                          <th className="p-2.5 sm:p-3 w-[35%] sm:w-[30%] border-r border-amber-900/10 dark:border-amber-500/10 font-bold">
                            {isTamil ? 'விபரம் (Dignity)' : 'Dignity / Classification'}
                          </th>
                          <th className="p-2.5 sm:p-3 font-bold">
                            {isTamil ? 'கிரகம் (Planets)' : 'Planets Qualifying'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                        {(horoscope?.dignitiesAspectsSection17Data?.dignitiesTable || []).map((row, idx) => (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              idx % 2 === 1
                                ? 'bg-amber-50/40 dark:bg-stone-900/40'
                                : 'bg-transparent'
                            } hover:bg-amber-100/30 dark:hover:bg-stone-800/30`}
                          >
                            <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 border-r border-amber-900/10 dark:border-amber-500/10">
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 dark:bg-amber-400"></span>
                                <span>{isTamil ? (row.labelTa || row.label) : (row.labelEn || row.label)}</span>
                              </span>
                            </td>
                            <td className="p-2.5 sm:p-3 font-bold text-[#7A1A22] dark:text-amber-300">
                              {row.val === '---' ? (
                                <span className="text-stone-400 font-normal">---</span>
                              ) : (
                                <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs ${row.badgeClass || 'bg-amber-100 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-300'}`}>
                                  {isTamil ? (row.valTa || row.val) : (row.valEn || row.val)}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footnote card */}
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 text-xs space-y-1.5">
                    <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>{isTamil ? 'கிரக நிலைகளின் பலன் விளக்கம்:' : 'Key Dignity Interpretations:'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700 dark:text-stone-300 font-sans">
                      <div>• <span className="font-bold text-emerald-800 dark:text-emerald-400">{isTamil ? "ஆட்சி / உச்சம்:" : "Own / Exalted:"}</span> {isTamil ? "முழு சுப பலம், தலைமைப் பண்பு மற்றும் நற்பெயர் வழங்கும் நிலைகள்." : "Full benefic potency, leadership excellence, and high reputation."}</div>
                      <div>• <span className="font-bold text-rose-800 dark:text-rose-400">{isTamil ? "நீசம் / பகை:" : "Debilitated / Enemy:"}</span> {isTamil ? "முயற்சிகளில் தடை, கடின உழைப்பிற்கு பிறகே வெற்றி கிட்டும் நிலை." : "Hard work and persevering remedy needed before triumph."}</div>
                      <div>• <span className="font-bold text-indigo-800 dark:text-indigo-400">{isTamil ? "வர்க்கோத்தமம்:" : "Vargottama:"}</span> {isTamil ? "ராசி மற்றும் நவாம்சத்தில் ஒரே ராசியில் அமர்ந்து ஆட்சிக்கு இணையான பலம் தரும் நிலை." : "Planet in same sign in D1 & D9, granting strength equal to own sign."}</div>
                      <div>• <span className="font-bold text-amber-800 dark:text-amber-400">{isTamil ? "பரிவர்த்தனை:" : "Parivartana:"}</span> {isTamil ? "இரு கிரகங்கள் தத்தம் வீடுகளைப் பரிமாறிக்கொண்டு யோக பலன் வழங்கும் ராஜயோக அமைப்பு." : "Mutual sign exchange between two planets forming powerful yoga."}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PART 2: கிரகங்களின் பார்வை, சேர்க்கை நிலை */}
              {(section17Tab === 'all' || section17Tab === 'aspects') && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/20 dark:border-amber-500/20 pb-2">
                    <div className="font-bold text-sm sm:text-base text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                      <span>👁️</span>
                      <span>{isTamil ? 'கிரகங்களின் பார்வை, சேர்க்கை நிலை' : 'Planetary Aspects & Conjunctions Table'}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                      {isTamil ? 'பார்வை (Drishti) & சேர்க்கை (Yuti) - பராசரர் முறைப்படி' : 'Drishti & Yuti according to Parashari principles'}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs bg-white dark:bg-[#1A1412]">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-amber-100/70 dark:bg-stone-800/80 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                          <th className="p-2 sm:p-3 text-left w-[18%] font-bold border-r border-amber-900/10 dark:border-amber-500/10">
                            {isTamil ? 'கிரகம்' : 'Graha'}
                          </th>
                          <th className="p-2 sm:p-3 w-[14%] font-bold border-r border-amber-900/10 dark:border-amber-500/10">
                            {isTamil ? 'ராசி' : 'Rasi'}
                          </th>
                          <th className="p-2 sm:p-3 w-[14%] font-bold border-r border-amber-900/10 dark:border-amber-500/10">
                            {isTamil ? 'நிலை' : 'Status'}
                          </th>
                          <th className="p-2 sm:p-3 text-left pl-3 font-bold border-r border-amber-900/10 dark:border-amber-500/10">
                            {isTamil ? 'பார்க்கும் கிரகங்கள்' : 'Aspects Received'}
                          </th>
                          <th className="p-2 sm:p-3 text-left pl-3 font-bold">
                            {isTamil ? 'சேர்க்கையுள்ள கிரகங்கள்' : 'Conjunctions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                        {(horoscope?.dignitiesAspectsSection17Data?.aspectsTable || []).map((row, idx) => {
                          const statusBadge =
                            row.status === 'உச்சம்' || row.status === 'ஆட்சி'
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-400 font-black'
                              : row.status === 'நட்பு'
                              ? 'bg-green-100 dark:bg-green-950/60 text-green-900 dark:text-green-300 border border-green-300 font-bold'
                              : row.status === 'நீசம்' || row.status === 'பகை'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-950 dark:text-rose-200 border border-rose-400 font-bold'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 font-semibold';

                          return (
                            <tr
                              key={idx}
                              className={`transition-colors ${
                                idx % 2 === 1
                                  ? 'bg-amber-50/40 dark:bg-stone-900/40'
                                  : 'bg-transparent'
                              } hover:bg-amber-100/30 dark:hover:bg-stone-800/30`}
                            >
                              <td className="p-2 sm:p-3 text-left font-black text-[#7A1A22] dark:text-amber-300 border-r border-amber-900/10 dark:border-amber-500/10">
                                {isTamil ? (row.grahaTa || row.graha) : (row.grahaEn || row.graha)}
                              </td>
                              <td className="p-2 sm:p-3 font-bold text-stone-800 dark:text-stone-200 border-r border-amber-900/10 dark:border-amber-500/10">
                                {isTamil ? (row.rasiTa || row.rasi) : (row.rasiEn || row.rasi)}
                              </td>
                              <td className="p-2 sm:p-3 border-r border-amber-900/10 dark:border-amber-500/10">
                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${statusBadge}`}>
                                  {isTamil ? (row.statusTa || row.status) : (row.statusEn || row.status)}
                                </span>
                              </td>
                              <td className="p-2 sm:p-3 text-left pl-3 font-mono text-stone-800 dark:text-stone-200 border-r border-amber-900/10 dark:border-amber-500/10">
                                {row.aspectsBy === '---' ? (
                                  <span className="text-stone-400 font-sans">---</span>
                                ) : (
                                  <span className="font-bold text-indigo-900 dark:text-indigo-300">
                                    {isTamil ? (row.aspectsByTa || row.aspectsBy) : (row.aspectsByEn || row.aspectsBy)}
                                  </span>
                                )}
                              </td>
                              <td className="p-2 sm:p-3 text-left pl-3 font-mono text-stone-800 dark:text-stone-200">
                                {row.conjunctions === '---' ? (
                                  <span className="text-stone-400 font-sans">---</span>
                                ) : (
                                  <span className="font-bold text-purple-900 dark:text-purple-300">
                                    {isTamil ? (row.conjunctionsTa || row.conjunctions) : (row.conjunctionsEn || row.conjunctions)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Drishti Rules Card */}
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-1.5">
                    <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                      <span>🔭</span>
                      <span>{isTamil ? 'பார்வை விதிகள் (Drishti Principles):' : 'Drishti Rules:'}</span>
                    </div>
                    <div className="text-[11px] text-indigo-950 dark:text-indigo-200 font-sans space-y-1">
                      <div>• <span className="font-bold">{isTamil ? "அனைத்து கிரகங்களும்:" : "All Planets:"}</span> {isTamil ? "தாங்கள் நின்ற ராசியிலிருந்து 7-வது ராசியை முழு பார்வையாகப் பார்க்கும் ($180^\\circ$)." : "Cast 100% full aspect on the 7th house ($180^\\circ$)."}</div>
                      <div>• <span className="font-bold">{isTamil ? "செவ்வாய்:" : "Mars:"}</span> {isTamil ? "4-வது மற்றும் 8-வது ராசிகளை சிறப்புப் பார்வையாகப் பார்க்கும்." : "Special full aspect on 4th and 8th signs."}</div>
                      <div>• <span className="font-bold">{isTamil ? "குரு, ராகு, கேது:" : "Jupiter, Rahu, Ketu:"}</span> {isTamil ? "5-வது மற்றும் 9-வது திரிகோண ராசிகளை சிறப்புப் பார்வையாகப் பார்க்கும்." : "Special full aspect on 5th and 9th trinal signs."}</div>
                      <div>• <span className="font-bold">{isTamil ? "சனி:" : "Saturn:"}</span> {isTamil ? "3-வது மற்றும் 10-வது ராசிகளை சிறப்புப் பார்வையாகப் பார்க்கும்." : "Special full aspect on 3rd and 10th signs."}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


        {/* ======================================================== */}

        
        {/* ======================================================== */}
        {/* ITEM 18: 18. எண் கணிதம் (நியூமராலஜி) */}
        {/* ======================================================== */}
        <div id="horoscope-section-18" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(18)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                18
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🔢</span>
                  <span>{isTamil ? '18. எண் கணிதம் (நியூமராலஜி).' : '18. Astro-Numerology (Chaldean System)'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'தேதி (உடல்) எண், வருஷ (உயிர்) எண், பெயர் எண், அதிர்ஷ்ட தேதிகள், நிறங்கள், கற்கள் & சாலடியன் எழுத்துக்கள்' : 'Birth Number (Udal), Life Path (Uyir), Name Number, Lucky Dates, Gems, Colors & 26-Letter Chaldean Matrix'}
                </p>
              </div>
            </div>
            {renderSectionBadge(18, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {isTamil ? 'எண் கணிதம்' : 'Numerology'}
              </span>
            ))}
          </button>

          {/* Body */}
          {openSections[18] && (
            <div className="p-4 sm:p-6 border-t border-amber-900/10 dark:border-amber-500/10 space-y-6">
              {/* Top Highlight Cards: Udal Enn & Uyir Enn */}
              {(() => {
                const numData = horoscope?.numerologyData || {};
                const dateNumVal = String(numData.rawDateNum || numData.dateNumEn || numData.dateNum || '').match(/^\d+/)?.[0] || '---';
                const datePlanet = isTamil
                  ? (numData.datePlanetTa || String(numData.dateNumTa || numData.dateNum || '').match(/\(([^)]+)\)/)?.[1] || '')
                  : (numData.datePlanetEn || String(numData.dateNumEn || numData.dateNum || '').match(/\(([^)]+)\)/)?.[1] || '');

                const yearNumVal = String(numData.rawLifeNum || numData.yearNumEn || numData.yearNum || '').match(/^\d+/)?.[0] || '---';
                const yearPlanet = isTamil
                  ? (numData.lifePlanetTa || String(numData.yearNumTa || numData.yearNum || '').match(/\(([^)]+)\)/)?.[1] || '')
                  : (numData.lifePlanetEn || String(numData.yearNumEn || numData.yearNum || '').match(/\(([^)]+)\)/)?.[1] || '');

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card 1: Birth Number (Body) */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#7A1A22] text-amber-100 flex flex-col items-center justify-center shrink-0 shadow-md">
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85 leading-tight">
                          {isTamil ? "உடல் எண்" : "Body No"}
                        </span>
                        <span className="text-2xl font-black font-mono leading-none mt-1">
                          {dateNumVal}
                        </span>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 flex-wrap">
                          <span>{isTamil ? 'தேதி (உடல்) எண் - Birth Number' : 'Birth Number (Body)'}</span>
                          {datePlanet && (
                            <span className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 border border-amber-900/15 dark:border-amber-500/20 px-2 py-0.5 rounded-md">
                              {datePlanet}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-600 dark:text-stone-400">
                          {isTamil ? 'பிறந்த தேதியின் கூட்டுத்தொகை (புறக் குணம், உடனடி இயல்பு)' : 'Day of birth vibration (physical nature & basic temperament)'}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Life Path Number (Destiny) */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/30 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-indigo-100 flex flex-col items-center justify-center shrink-0 shadow-md">
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85 leading-tight">
                          {isTamil ? "உயிர் எண்" : "Destiny No"}
                        </span>
                        <span className="text-2xl font-black font-mono leading-none mt-1">
                          {yearNumVal}
                        </span>
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 flex-wrap">
                          <span>{isTamil ? 'வருஷ (உயிர்) எண் - Life Path / Destiny' : 'Life Path Number (Destiny)'}</span>
                          {yearPlanet && (
                            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/70 border border-indigo-900/15 dark:border-indigo-500/20 px-2 py-0.5 rounded-md">
                              {yearPlanet}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-600 dark:text-stone-400">
                          {isTamil ? 'முழு பிறந்த தேதியின் கூட்டுத்தொகை (ஆன்மப் பயணம், விதிப்பயன்)' : 'Full DOB compound sum (soul destiny & ultimate life purpose)'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Master Numerology Profile Table */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/20 dark:border-amber-500/20 pb-2">
                  <div className="font-bold text-sm sm:text-base text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                    <span>📜</span>
                    <span>{isTamil ? 'எண் கணித முழு விவரப் பட்டியல்' : 'Complete Astro-Numerology Profile'}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    {isTamil ? 'சாலடியன் எண் கணித முறைப்படி கணிக்கப்பட்டது' : 'Computed according to Ancient Chaldean System'}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs bg-white dark:bg-[#1A1412]">
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody className="divide-y divide-amber-900/10 dark:divide-amber-500/10 font-sans">
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 w-[35%] sm:w-[30%] font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'பெயர் (Name)' : 'Name'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-black text-[#7A1A22] dark:text-amber-300">
                          {horoscope?.numerologyData?.name || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'ஆங்கில எழுத்துக்களின் கூடுதல்' : 'English Letters Compound Sum'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                          {(isTamil ? (horoscope?.numerologyData?.engSumTa || horoscope?.numerologyData?.engSum) : (horoscope?.numerologyData?.engSumEn || horoscope?.numerologyData?.engSum)) || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'பிறந்த தேதி (DOB & Day)' : 'Date of Birth & Weekday'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-mono font-bold text-stone-800 dark:text-stone-200">
                          {(isTamil ? (horoscope?.numerologyData?.dobTa || horoscope?.numerologyData?.dobEng) : horoscope?.numerologyData?.dobEng) || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'தேதி (உடல்) எண்' : 'Birth (Body) Number'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-black text-amber-900 dark:text-amber-300">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 border border-amber-300">
                            {(isTamil ? (horoscope?.numerologyData?.dateNumTa || horoscope?.numerologyData?.dateNum) : (horoscope?.numerologyData?.dateNumEn || horoscope?.numerologyData?.dateNum)) || '---'}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'வருஷ (உயிர்) எண்' : 'Life Path (Soul) Number'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-black text-indigo-900 dark:text-indigo-300">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-300">
                            {(isTamil ? (horoscope?.numerologyData?.yearNumTa || horoscope?.numerologyData?.yearNum) : (horoscope?.numerologyData?.yearNumEn || horoscope?.numerologyData?.yearNum)) || '---'}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'அதிர்ஷ்ட எண்கள்' : 'Lucky Harmonic Numbers'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-bold text-emerald-800 dark:text-emerald-300">
                          {horoscope?.numerologyData?.luckyNums || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'அதிர்ஷ்ட தேதிகள்' : 'Lucky Calendar Dates'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-mono font-bold text-stone-800 dark:text-stone-200">
                          {horoscope?.numerologyData?.luckyDates || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'அதிர்ஷ்ட நிறங்கள்' : 'Lucky Colors'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-bold text-purple-900 dark:text-purple-300">
                          {(isTamil ? (horoscope?.numerologyData?.luckyColorsTa || horoscope?.numerologyData?.luckyColors) : (horoscope?.numerologyData?.luckyColorsEn || horoscope?.numerologyData?.luckyColors)) || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'அதிர்ஷ்ட கற்கள்' : 'Lucky Gemstones'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-bold text-amber-900 dark:text-amber-200">
                          {(isTamil ? (horoscope?.numerologyData?.luckyStonesTa || horoscope?.numerologyData?.luckyStones) : (horoscope?.numerologyData?.luckyStonesEn || horoscope?.numerologyData?.luckyStones)) || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'மேன்மை தரும் தெய்வம்' : 'Presiding Benefic Deity'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-bold text-[#7A1A22] dark:text-[#E8838B]">
                          {(isTamil ? (horoscope?.numerologyData?.deityTa || horoscope?.numerologyData?.deity) : (horoscope?.numerologyData?.deityEn || horoscope?.numerologyData?.deity)) || '---'}
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                        <td className="p-2.5 sm:p-3 font-bold text-stone-800 dark:text-stone-200 bg-amber-50/30 dark:bg-stone-900/40 border-r border-amber-900/10 dark:border-amber-500/10">
                          {isTamil ? 'ஸ்தலங்கள் (தென்னிந்தியா)' : 'Sacred Temples (South India)'}
                        </td>
                        <td className="p-2.5 sm:p-3 font-semibold text-stone-800 dark:text-stone-200">
                          {(isTamil ? (horoscope?.numerologyData?.templesTa || horoscope?.numerologyData?.temples) : (horoscope?.numerologyData?.templesEn || horoscope?.numerologyData?.temples)) || '---'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 26-Letter Ancient Chaldean Alphabet Matrix */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/20 dark:border-amber-500/20 pb-2">
                  <div className="font-bold text-sm sm:text-base text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                    <span>🔤</span>
                    <span>{isTamil ? 'சாலடியன் 26 ஆங்கில எழுத்துக்கள் எண் மதிப்பு அட்டவணை' : 'Ancient Chaldean 26-Letter Numerical Matrix'}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    {isTamil ? '9-ம் எண் தெய்வீக எண் என்பதால் எழுத்துகளுக்கு ஒதுக்கப்படவில்லை' : 'Number 9 is excluded from letters as sacred'}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs bg-white dark:bg-[#1A1412]">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-amber-100/70 dark:bg-stone-800/80 text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
                          <th key={l} className="p-1.5 sm:p-2 text-xs font-black border-r border-amber-900/10 dark:border-amber-500/10 last:border-r-0">
                            {l}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => {
                          const val = {
                            A: 1, I: 1, J: 1, Q: 1, Y: 1,
                            B: 2, K: 2, R: 2,
                            C: 3, G: 3, L: 3, S: 3,
                            D: 4, M: 4, T: 4,
                            E: 5, H: 5, N: 5, X: 5,
                            U: 6, V: 6, W: 6,
                            O: 7, Z: 7,
                            F: 8, P: 8
                          }[l] || 0;
                          return (
                            <td key={l} className="p-1.5 sm:p-2 border-r border-amber-900/10 dark:border-amber-500/10 last:border-r-0 text-[#7A1A22] dark:text-amber-300 font-black">
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subham auspicious footer */}
              <div className="pt-2 text-center">
                <div className="inline-block px-6 py-2 rounded-2xl bg-amber-100/80 dark:bg-stone-800 border border-amber-900/20 dark:border-amber-500/30 shadow-xs">
                  <span className="text-sm font-black tracking-widest text-[#7A1A22] dark:text-amber-300">
                    {isTamil ? (horoscope?.numerologyData?.subham || 'சுபம்.') : (horoscope?.numerologyData?.subhamEn || 'Subham (Auspicious).')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 19: ஜாதக யோகங்கள் (JATHAGA YOGAS) */}
        {/* ======================================================== */}
        <div id="horoscope-section-19" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(19)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                19
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🌟</span>
                  <span>{isTamil ? '19. ஜாதக யோகங்கள் (Jathaga Yogas - 16 Classical Combinations)' : '19. Jathaga Yogas (Natal Planetary Combinations)'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil
                    ? 'கஜகேசரி, பஞ்ச மகாபுருஷ, தர்ம-கர்மாதிபதி, புதாதித்ய, சந்திராதி, சூரிய-சந்திர மற்றும் விபரீத ராஜ யோகங்களின் துல்லிய ஆய்வு'
                    : 'Algorithmic evaluation of Gajakesari, Pancha Mahapurusha, Dharma-Karmadhipati, Budhaditya, Adhi, Solar/Lunar & Viparita Raja Yogas'}
                </p>
              </div>
            </div>
            {renderSectionBadge(19, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {horoscope?.jathagaYogasSection19Data?.presentCount || 0} {isTamil ? 'யோகங்கள்' : 'Yogas'}
              </span>
            ))}
          </button>

          {/* Body */}
          {openSections[19] && (
            <div className="p-4 sm:p-6 border-t border-amber-900/10 dark:border-amber-500/10 space-y-4">
              {/* Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-900/10 dark:border-amber-500/20 shadow-2xs">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">
                    {isTamil ? 'அமைந்துள்ள யோகங்கள்' : 'Active Yogas in Chart'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#7A1A22] dark:text-amber-300 font-mono">
                      {horoscope?.jathagaYogasSection19Data?.presentCount || 0}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      / {horoscope?.jathagaYogasSection19Data?.totalYogas || 16}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-stone-800/60 border border-purple-900/10 dark:border-purple-500/20 shadow-2xs">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">
                    {isTamil ? 'ராஜ யோகங்கள்' : 'Raja Yogas'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-purple-900 dark:text-purple-300 font-mono">
                      {horoscope?.jathagaYogasSection19Data?.rajaYogasCount || 0}
                    </span>
                    <span className="text-[10px] text-stone-500">{isTamil ? 'அமைந்துள்ளது' : 'Formed'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-stone-800/60 border border-blue-900/10 dark:border-blue-500/20 shadow-2xs">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">
                    {isTamil ? 'மகாபுருஷ யோகங்கள்' : 'Mahapurusha Yogas'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-300 font-mono">
                      {horoscope?.jathagaYogasSection19Data?.mahapurushaCount || 0}
                    </span>
                    <span className="text-[10px] text-stone-500">/ 5 {isTamil ? 'சாத்தியங்கள்' : 'Types'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-stone-800/60 border border-emerald-900/10 dark:border-emerald-500/20 shadow-2xs">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold">
                    {isTamil ? 'தன & சுப யோகங்கள்' : 'Wealth & Prosperity'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
                      {horoscope?.jathagaYogasSection19Data?.dhanaYogasCount || 0}
                    </span>
                    <span className="text-[10px] text-stone-500">{isTamil ? 'பலம்' : 'Active'}</span>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full print:hidden scrollbar-thin touch-pan-x">
                {[
                  { id: 'present', labelTa: `🌟 ஜாதகத்தில் உள்ளவை (${horoscope?.jathagaYogasSection19Data?.presentCount || 0})`, labelEn: `Active in Chart (${horoscope?.jathagaYogasSection19Data?.presentCount || 0})` },
                  { id: 'all', labelTa: `📑 அனைத்து 16 யோகங்கள் (${horoscope?.jathagaYogasSection19Data?.totalYogas || 16})`, labelEn: `All 16 Yogas (${horoscope?.jathagaYogasSection19Data?.totalYogas || 16})` },
                  { id: 'raja', labelTa: '👑 ராஜ யோகங்கள்', labelEn: 'Raja Yogas' },
                  { id: 'mahapurusha', labelTa: '💎 மகாபுருஷ யோகங்கள்', labelEn: 'Mahapurusha' },
                  { id: 'dhana', labelTa: '💰 தன யோகங்கள்', labelEn: 'Wealth Yogas' },
                  { id: 'lunar_solar', labelTa: '🌙 சந்திர & சூரிய யோகங்கள்', labelEn: 'Lunar & Solar' },
                  { id: 'viparita', labelTa: '⚡ விபரீத & நீசபங்க யோகங்கள்', labelEn: 'Viparita & Neechabhanga' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSection19Tab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0 ${
                      section19Tab === tab.id
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'bg-amber-900/10 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-900/20'
                    }`}
                  >
                    <span>{isTamil ? tab.labelTa : tab.labelEn}</span>
                  </button>
                ))}
              </div>

              {/* Yoga Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(horoscope?.jathagaYogasSection19Data?.yogas || [])
                  .filter(y => {
                    if (section19Tab === 'present') return y.isPresent;
                    if (section19Tab === 'raja') return y.category === 'raja';
                    if (section19Tab === 'mahapurusha') return y.category === 'mahapurusha';
                    if (section19Tab === 'dhana') return y.category === 'dhana';
                    if (section19Tab === 'lunar_solar') return y.category === 'lunar_solar';
                    if (section19Tab === 'viparita') return y.category === 'viparita';
                    return true;
                  })
                  .map(yoga => {
                    const isActive = yoga.isPresent;
                    return (
                      <div
                        key={yoga.id}
                        className={`rounded-2xl border p-3.5 sm:p-4 space-y-2.5 transition-all shadow-2xs ${
                          isActive
                            ? 'bg-gradient-to-br from-[#FFFDF9] via-amber-50/40 to-emerald-50/20 dark:from-[#1E1815] dark:via-stone-900 dark:to-stone-900/80 border-amber-900/20 dark:border-amber-500/30'
                            : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-75'
                        }`}
                      >
                        {/* Header: Title + Category + Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/10 dark:border-stone-800 pb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm sm:text-base text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? yoga.nameTa : yoga.nameEn}
                              </h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-200 border border-amber-900/15">
                                {isTamil ? yoga.categoryTa : yoga.categoryEn}
                              </span>
                            </div>
                            
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-400'
                                  : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400 border-stone-300 dark:border-stone-700'
                              }`}
                            >
                              <span>{isActive ? '✓' : '✕'}</span>
                              <span>{isActive ? (isTamil ? 'யோகம் அமைந்துள்ளது' : 'Formed') : (isTamil ? 'அமையவில்லை' : 'Not Formed')}</span>
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-400/50">
                                {isTamil ? (yoga.strengthTa || yoga.strength) : (yoga.strengthEn || yoga.strength)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rule Formula Box */}
                        <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-stone-800/40 border border-amber-900/10 text-[11px] space-y-0.5">
                          <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                            📐 {isTamil ? 'ஜோதிட விதி & கணித சூத்திரம் (Rule Criteria):' : 'Astrological Rule Criteria:'}
                          </span>
                          <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                            {isTamil ? yoga.ruleTa : yoga.ruleEn}
                          </p>
                        </div>

                        {/* Observation Box */}
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900/60 border border-amber-900/10 text-[11px] space-y-0.5">
                          <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
                            🔍 {isTamil ? 'ஜாதகத்தில் அமைந்த விபரம் (Chart Finding):' : 'Chart Finding:'}
                          </span>
                          <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-semibold">
                            {isTamil ? yoga.observationTa : yoga.observationEn}
                          </p>
                        </div>

                        {/* Phalan / Result Box */}
                        {isActive && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-900/15 text-[11px] space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
                              🎁 {isTamil ? 'யோக பலன்கள் (Manifestation & Astrological Result):' : 'Astrological Results:'}
                            </span>
                            <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                              {isTamil ? yoga.phalanTa : yoga.phalanEn}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>


        {/* ======================================================== */}
        {/* SECTION 20: விம்சோத்தரி மகாதிசைகள் & பலன்கள் (VIMSHOTTARI MAHA DASHAS & SIGNIFICATIONS) */}
        {/* ======================================================== */}
        <div id="horoscope-section-20" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(20)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                20
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🪐</span>
                  <span>{isTamil ? '20. விம்சோத்தரி மகாதிசைகள் & பலன்கள்' : '20. Vimshottari Maha Dashas & Significations'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil
                    ? '9 கிரகங்களின் மகாதிசை காரகத்துவம், பலன்கள் மற்றும் துல்லியமான கால அட்டவணை'
                    : '9 Planetary Dasha Significations, Classical Manifestations & Exact Timings'}
                </p>
              </div>
            </div>
            {renderSectionBadge(20, (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                {isTamil ? '9 மகாதிசைகள்' : '9 Maha Dashas'}
              </span>
            ))}
          </button>

          {/* Body */}
          {openSections[20] && (
            <div className="p-4 sm:p-6 border-t border-amber-900/10 dark:border-amber-500/10 space-y-4">
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 border-b border-amber-900/10 dark:border-amber-500/15 pb-2 text-xs">
                {[
                  { key: 'phalam', labelTa: '9 கிரக மகாதிசை பலன்கள் & கால அட்டவணை', labelEn: '9 Dasha Significations & Exact Timings' },
                  { key: 'timeline', labelTa: '120 ஆண்டு கால அட்டவணை', labelEn: '120-Year Timeline Table' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSection20Tab(tab.key)}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                      section20Tab === tab.key
                        ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {isTamil ? tab.labelTa : tab.labelEn}
                  </button>
                ))}
              </div>

              {/* KPI Status Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {isTamil ? 'சந்திரனின் நின்ற நட்சத்திரம்' : 'Birth Nakshatra'}
                  </span>
                  <span className="text-sm font-bold text-[#7A1A22] dark:text-amber-300 block mt-0.5">
                    {isTamil ? horoscope?.dashaSection20Data?.moonCoordinates?.nakNameTa : horoscope?.dashaSection20Data?.moonCoordinates?.nakNameEn} ({horoscope?.dashaSection20Data?.moonCoordinates?.pada} {isTamil ? 'பாதம்' : 'Pada'})
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500">
                    {horoscope?.dashaSection20Data?.moonCoordinates?.degInSign} ({isTamil ? horoscope?.dashaSection20Data?.moonCoordinates?.rasiNameTa : horoscope?.dashaSection20Data?.moonCoordinates?.rasiNameEn})
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {isTamil ? 'பிறந்த திசை நாதன்' : 'Birth Dasha Lord'}
                  </span>
                  <span className="text-sm font-bold text-[#7A1A22] dark:text-amber-300 block mt-0.5">
                    {isTamil ? horoscope?.dashaSection20Data?.moonCoordinates?.rulingLordTa : horoscope?.dashaSection20Data?.moonCoordinates?.rulingLordEn} ({horoscope?.dashaSection20Data?.birthBalanceMathematics?.birthLordYears} {isTamil ? 'ஆண்டுகள்' : 'Years'})
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500">
                    {isTamil ? 'துவக்க மகாதிசை' : 'Initial Dasha Lord'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {isTamil ? 'பிறந்த திசை இருப்பு' : 'Dasha Balance at Birth'}
                  </span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 block mt-0.5">
                    {isTamil ? horoscope?.dashaSection20Data?.birthBalanceMathematics?.calculatedBalance?.textTa : (horoscope?.dashaSection20Data?.birthBalanceMathematics?.calculatedBalance?.textEn || horoscope?.dashaSection20Data?.birthBalanceMathematics?.calculatedBalance?.textTa)}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500">
                    {isTamil ? 'ஜென்ம இருப்பு காலம்' : 'Remaining at Birth'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/10 dark:border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {isTamil ? 'விம்சோத்தரி சுழற்சி' : 'Vimshottari Full Span'}
                  </span>
                  <span className="text-sm font-bold text-indigo-800 dark:text-indigo-300 block mt-0.5">
                    120 {isTamil ? 'ஆண்டுகள் (9 திசைகள்)' : 'Years (9 Dashas)'}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500">
                    81 {isTamil ? 'புக்திகள்' : 'Bhuktis'} • 729 {isTamil ? 'அந்தரங்கள்' : 'Antaras'}
                  </span>
                </div>
              </div>

              {/* VIEW 1: 9 DASHA PHALAM & EXACT TIMINGS CARDS */}
              {section20Tab === 'phalam' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-900/10 dark:border-amber-500/15 pb-2">
                    <span className="text-base">📜</span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300">
                      {isTamil ? '9 கிரக மகாதிசை காரகத்துவம், பலன்கள் & துல்லிய கால அளவுகள்' : '9 Planetary Dasha Significations, Classical Manifestations & Exact Timings'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {horoscope?.dashaSection20Data?.dashaAnalytics?.map((md) => {
                      const isLive = md.isOngoingToday;
                      const p = md.phalam;

                      return (
                        <div
                          key={md.lordId}
                          className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                            isLive
                              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40 shadow-xs'
                              : md.isBirthDasha
                              ? 'border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/20'
                              : 'border-amber-900/15 dark:border-stone-800 bg-white/90 dark:bg-stone-900/50 hover:border-amber-900/30'
                          }`}
                        >
                          {/* Card Header with Status */}
                          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-amber-500/20 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs">
                                {md.index}
                              </span>
                              <span className="font-bold text-sm text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? md.lordNameTa : md.lordNameEn} {isTamil ? 'திசை' : 'Dasha'} ({md.fullYears} {isTamil ? 'ஆண்டுகள்' : 'Yrs'})
                              </span>
                            </div>

                            {isLive ? (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                                <span>🌟</span>
                                <span>{isTamil ? 'நடப்பு' : 'Live'}</span>
                              </span>
                            ) : md.isBirthDasha ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center gap-1">
                                <span>👶</span>
                                <span>{isTamil ? 'பிறந்த திசை' : 'Birth Dasha'}</span>
                              </span>
                            ) : md.isPastToday ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                ✓ {isTamil ? 'முடிந்தது' : 'Completed'}
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-stone-100 dark:bg-stone-800/60 text-stone-500">
                                ⏳ {isTamil ? 'எதிர்காலம்' : 'Upcoming'}
                              </span>
                            )}
                          </div>

                          {/* EXACT TIMINGS BOX */}
                          <div className="p-2.5 rounded-lg bg-amber-100/60 dark:bg-stone-800/80 border border-amber-900/15 dark:border-amber-500/20 space-y-1.5 text-xs font-mono">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-sans font-bold uppercase text-stone-500">
                                🗓️ {isTamil ? 'கால எல்லை (தேதிகள்)' : 'Exact Period'}:
                              </span>
                              <span className="font-bold text-[#7A1A22] dark:text-amber-300 text-[11.5px]">
                                {md.startDate} → {md.endDate}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-amber-900/10 dark:border-stone-700/50 text-[11px]">
                              <span className="text-stone-600 dark:text-stone-400 font-sans">
                                🎂 {isTamil ? 'முடிவு வயது' : 'Age at End'}:
                              </span>
                              <span className="font-semibold text-stone-800 dark:text-stone-200">
                                {isTamil ? md.ageAtEnd?.textTa : md.ageAtEnd?.textEn}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-amber-900/10 dark:border-stone-700/50 text-[11px]">
                              <span className="text-stone-600 dark:text-stone-400 font-sans">
                                ⏳ {isTamil ? (md.isBirthDasha ? 'பிறந்த இருப்பு காலம்' : 'முழு கால அளவு') : (md.isBirthDasha ? 'Balance at Birth' : 'Total Duration')}:
                              </span>
                              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                                {md.isBirthDasha
                                  ? (isTamil ? md.balanceAtBirth?.textTa : md.balanceAtBirth?.textEn)
                                  : `${md.fullYears} ${isTamil ? 'ஆண்டுகள்' : 'Years'}`}
                              </span>
                            </div>
                          </div>

                          {/* 4 ROLES: PASAKAR, BODHAKAR, KARAGAR, VEDHAKAR */}
                          {(() => {
                            const roles = md.fourRoles || getGrahaFourRoles(md.lordId);
                            if (!roles) return null;
                            return (
                              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/80 border border-amber-900/15 dark:border-amber-500/20 space-y-1.5">
                                <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1A22] dark:text-amber-300 flex items-center gap-1">
                                    <span>👑</span>
                                    <span>{isTamil ? 'திசா நாதனின் 4 முக்கிய கிரகங்கள்' : 'Dasha Lord 4 Key Roles'}</span>
                                  </span>
                                  <span className="text-[9px] text-stone-400 font-mono">
                                    {isTamil ? 'பராசரர் முறை' : 'Parashari'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                  <div className="p-1 rounded bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/70 dark:border-emerald-800 flex items-center justify-between px-2">
                                    <span className="text-emerald-900 dark:text-emerald-300 font-bold text-[10.5px]">{isTamil ? 'பாசகர்' : 'Pasakar'}:</span>
                                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px]">{isTamil ? roles.pasakarTa : roles.pasakarEn}</span>
                                  </div>
                                  <div className="p-1 rounded bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300/70 dark:border-blue-800 flex items-center justify-between px-2">
                                    <span className="text-blue-900 dark:text-blue-300 font-bold text-[10.5px]">{isTamil ? 'போதகர்' : 'Bodhakar'}:</span>
                                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px]">{isTamil ? roles.bodhakarTa : roles.bodhakarEn}</span>
                                  </div>
                                  <div className="p-1 rounded bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-800 flex items-center justify-between px-2">
                                    <span className="text-amber-900 dark:text-amber-300 font-bold text-[10.5px]">{isTamil ? 'காரகர்' : 'Karagar'}:</span>
                                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px]">{isTamil ? roles.karagarTa : roles.karagarEn}</span>
                                  </div>
                                  <div className="p-1 rounded bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300/70 dark:border-rose-800 flex items-center justify-between px-2">
                                    <span className="text-rose-900 dark:text-rose-300 font-bold text-[10.5px]">{isTamil ? 'வேதகர்' : 'Vedhakar'}:</span>
                                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px]">{isTamil ? roles.vedhakarTa : roles.vedhakarEn}</span>
                                  </div>
                                </div>
                                <div className="text-[9.5px] text-stone-500 dark:text-stone-400 flex flex-wrap gap-x-2 gap-y-0.5 leading-tight pt-0.5">
                                  <span><strong className="text-emerald-700 dark:text-emerald-400">{isTamil ? 'பாசகர்' : 'Pasakar'}:</strong> {isTamil ? 'சீக்கிர பலன்' : 'Fast fruit'}</span>
                                  <span><strong className="text-blue-700 dark:text-blue-400">{isTamil ? 'போதகர்' : 'Bodhakar'}:</strong> {isTamil ? 'நிறையத் தருபவர்' : 'Abundance'}</span>
                                  <span><strong className="text-amber-700 dark:text-amber-400">{isTamil ? 'காரகர்' : 'Karagar'}:</strong> {isTamil ? 'நிதான பலன்' : 'Steady fruit'}</span>
                                  <span><strong className="text-rose-700 dark:text-rose-400">{isTamil ? 'வேதகர்' : 'Vedhakar'}:</strong> {isTamil ? 'தடுத்து சோதிப்பவர்' : 'Tester'}</span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Content Details */}
                          <div className="text-xs space-y-2">
                            <div>
                              <span className="text-[10px] font-bold text-stone-500 uppercase block">
                                {isTamil ? 'காரகத்துவம் & இயல்பு:' : 'Signification:'}
                              </span>
                              <p className="text-stone-700 dark:text-stone-300 font-semibold text-[11px] leading-tight">
                                {isTamil ? p.natureTa : p.natureEn}
                              </p>
                            </div>

                            <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/10 text-[11px]">
                              <span className="text-[10px] font-bold text-[#7A1A22] dark:text-amber-300 uppercase block mb-0.5">
                                🎁 {isTamil ? 'திசை பொதுப் பலன்:' : 'General Result:'}
                              </span>
                              <p className="text-stone-800 dark:text-stone-200 leading-snug">
                                {isTamil ? p.phalanTa : p.phalanEn}
                              </p>
                            </div>

                            {p.favorableHousesTa && (
                              <div className="text-[10.5px]">
                                <span className="text-[10px] font-bold text-stone-500 uppercase block">
                                  🏛️ {isTamil ? 'நற்பலன் தரும் ஸ்தானங்கள்:' : 'Favorable Bhavas:'}
                                </span>
                                <span className="text-stone-700 dark:text-stone-300 font-medium">
                                  {isTamil ? p.favorableHousesTa : p.favorableHousesEn}
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-stone-600 dark:text-stone-400">
                              <div>• {isTamil ? 'ரத்தினம்' : 'Gem'}: <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? p.gemstoneTa : p.gemstoneEn}</span></div>
                              <div>• {isTamil ? 'தெய்வம்' : 'Deity'}: <span className="font-bold text-stone-800 dark:text-stone-200">{isTamil ? p.deityTa : p.deityEn}</span></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW 2: 120-YEAR MAHA DASHA TIMELINE TABLE */}
              {section20Tab === 'timeline' && (
                <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-900/10 dark:bg-stone-800/80 text-[#7A1A22] dark:text-amber-300 border-b border-amber-900/15 font-bold">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">{isTamil ? 'மகாதிசை கிரகம்' : 'Maha Dasha Lord'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'மொத்த காலம்' : 'Full Span'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'துவக்கத் தேதி' : 'Start Date'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'முடிவுத் தேதி' : 'End Date'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'முடிவு வயது' : 'Age at End'}</th>
                        <th className="py-2.5 px-3">{isTamil ? 'நிலை' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 font-mono text-[11px]">
                      {horoscope?.dashaSection20Data?.dashaAnalytics?.map((md, idx) => {
                        let rowClass = 'hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors';
                        if (md.isOngoingToday) rowClass = 'bg-emerald-50 dark:bg-emerald-950/30 font-bold';
                        else if (md.isBirthDasha) rowClass = 'bg-amber-100/40 dark:bg-amber-950/20 font-semibold';

                        return (
                          <tr key={md.lordId} className={rowClass}>
                            <td className="py-2 px-3 text-stone-500 font-sans">{idx + 1}</td>
                            <td className="py-2 px-3 font-sans font-bold text-[#7A1A22] dark:text-amber-300">
                              {isTamil ? md.lordNameTa : md.lordNameEn} {isTamil ? 'திசை' : 'Dasha'}
                            </td>
                            <td className="py-2 px-3 text-stone-700 dark:text-stone-300">
                              {md.fullYears} {isTamil ? 'ஆண்டுகள்' : 'Years'}
                            </td>
                            <td className="py-2 px-3">{md.startDate}</td>
                            <td className="py-2 px-3">{md.endDate}</td>
                            <td className="py-2 px-3 text-stone-600 dark:text-stone-400">
                              {isTamil ? md.ageAtEnd?.textTa : md.ageAtEnd?.textEn}
                            </td>
                            <td className="py-2 px-3 font-sans">
                              {md.isOngoingToday ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                                  🌟 {isTamil ? 'நடப்பு திசை' : 'Active Today'}
                                </span>
                              ) : md.isBirthDasha ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                                  👶 {isTamil ? 'பிறந்த திசை' : 'Birth Dasha'}
                                </span>
                              ) : md.isPastToday ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                                  ✓ {isTamil ? 'முடிந்தது' : 'Completed'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-stone-800/40 text-stone-500">
                                  ⏳ {isTamil ? 'எதிர்காலம்' : 'Upcoming'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>


        <div className="text-center text-[11px] text-stone-500 py-3 border-t border-amber-900/10 font-serif">
          Astrojit • {isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை' : 'All rights reserved'}
        </div>
      </div>
    </div>
  );
}

/**
 * South Indian 4x4 Chart Grid Component
 */
function SouthIndianChartGrid({ chartData, isTamil, centerTitle, centerSub }) {
  // Map signs by sign index 0..11
  const signsMap = {};
  if (Array.isArray(chartData)) {
    for (const s of chartData) {
      if (s && typeof s.rasi === 'number') {
        signsMap[s.rasi] = s;
      }
    }
  }

  // Generate 4x4 cells
  // cell at [r, c]
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  return (
    <div className="aspect-square w-full max-w-[420px] mx-auto border-2 border-[#7A1A22] dark:border-amber-600 grid grid-cols-4 grid-rows-4 bg-[#FFFDF9] dark:bg-[#1E1815] text-[#2C241E] dark:text-[#E8DFD8] shadow-sm">
      {rows.map(r =>
        cols.map(c => {
          // Check if this is the center 2x2 area
          if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
            if (r === 1 && c === 1) {
              return (
                <div
                  key="center"
                  className="col-span-2 row-span-2 border border-amber-900/30 flex flex-col items-center justify-center p-2 text-center bg-[#FAF6EF]/60 dark:bg-[#15110F]/60"
                >
                  <span className="text-xs uppercase font-black tracking-wider text-[#7A1A22] dark:text-amber-400">
                    {centerTitle}
                  </span>
                  {centerSub && (
                    <span className="text-[10px] text-stone-500 font-medium mt-0.5">{centerSub}</span>
                  )}
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-mono mt-1">
                    ☸
                  </span>
                </div>
              );
            }
            return null; // covered by col-span-2 row-span-2
          }

          // Otherwise it's a perimeter cell with a sign
          const cellDef = SOUTH_INDIAN_CELLS.find(item => item.row === r && item.col === c);
          if (!cellDef) return null;

          const signInfo = RASHIS[cellDef.rasi];
          const signData = signsMap[cellDef.rasi] || { occupants: [] };
          const occupants = Array.isArray(signData?.occupants) ? signData.occupants : [];

          return (
            <div
              key={`${r}-${c}`}
              className="border border-[#7A1A22]/30 dark:border-amber-700/40 p-1 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Sign label in corner */}
              <div className="flex justify-between items-center text-[9px] font-bold text-stone-500 dark:text-stone-400">
                <span>{isTamil ? signInfo.ta : signInfo.en}</span>
                <span className="text-[8px] opacity-60 font-mono">{cellDef.rasi + 1}</span>
              </div>

              {/* Occupants: Planets, Lagna, and Mandi */}
              <div className="flex flex-wrap gap-1 items-center justify-center my-auto">
                {occupants.map((occ, oIdx) => (
                  <span
                    key={oIdx}
                    className={`text-[8.5px] sm:text-[9.5px] md:text-[10px] font-black px-0.5 sm:px-1 py-0 sm:py-0.2 rounded leading-tight ${
                      occ.isLagna
                        ? 'bg-[#7A1A22] text-amber-100 border border-amber-400 shadow-2xs'
                        : occ.isMandi
                        ? 'bg-amber-200/90 dark:bg-amber-900/60 text-[#7A1A22] dark:text-amber-200 border border-amber-500/50 shadow-2xs'
                        : occ.isBirthMoon
                        ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 ring-1 ring-purple-400 shadow-2xs'
                        : occ.isBirthLagna
                        ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 ring-1 ring-red-400 shadow-2xs'
                        : 'text-[#7A1A22] dark:text-amber-300 font-bold'
                    }`}
                  >
                    {isTamil ? occ.labelTa : occ.labelEn}
                  </span>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/**
 * Sarvashtakavarga 4x4 Chart Grid Component
 */
function SarvashtakavargaChartGrid({ ashtakavarga, lagnaRasi, isTamil, T }) {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  const varavinam = parseInt(ashtakavarga.varavinam || '0', 10);
  const selavinam = parseInt(ashtakavarga.selavinam || '0', 10);

  return (
    <div className="aspect-square w-full max-w-[440px] mx-auto border-2 border-[#7A1A22] dark:border-amber-600 grid grid-cols-4 grid-rows-4 bg-[#FFFDF9] dark:bg-[#1E1815] text-[#2C241E] dark:text-[#E8DFD8] shadow-sm">
      {rows.map(r =>
        cols.map(c => {
          // Center 2x2 area
          if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
            if (r === 1 && c === 1) {
              return (
                <div
                  key="center"
                  className="col-span-2 row-span-2 border border-amber-900/30 flex flex-col items-center justify-center p-2.5 text-center bg-[#FAF6EF]/90 dark:bg-[#15110F]/90 space-y-1"
                >
                  <span className="text-[11px] uppercase font-black tracking-wider text-[#7A1A22] dark:text-amber-400">
                    {isTamil ? 'சர்வாஷ்டகவர்க்கம்' : 'Sarvashtakavarga'}
                  </span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-[#7A1A22] dark:text-amber-200">
                      {ashtakavarga.grandTotal}
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {isTamil ? 'பரல்கள்' : 'Bindus'}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-600 dark:text-stone-300 border-t border-amber-900/20 pt-1 w-full flex justify-around">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {isTamil ? 'வரவு' : 'In'}: {varavinam}
                    </span>
                    <span className="text-rose-700 dark:text-rose-400 font-bold">
                      {isTamil ? 'செலவு' : 'Out'}: {selavinam}
                    </span>
                  </div>
                  <div className="text-[9px] text-stone-500 dark:text-stone-400">
                    {isTamil ? 'சராசரி' : 'Avg'}: 28.1 / {isTamil ? 'ராசி' : 'sign'}
                  </div>
                </div>
              );
            }
            return null;
          }

          // Perimeter cell with sign
          const cellDef = SOUTH_INDIAN_CELLS.find(item => item.row === r && item.col === c);
          if (!cellDef) return null;

          const signInfo = RASHIS[cellDef.rasi];
          const pts = parseInt(ashtakavarga.totals[cellDef.rasi] || '0', 10);
          const isLagna = cellDef.rasi === lagnaRasi;
          const isStrong = pts >= 28;
          const diff = pts - 28;

          return (
            <div
              key={`${r}-${c}`}
              className={`border border-[#7A1A22]/30 dark:border-amber-700/40 p-1 sm:p-1.5 flex flex-col justify-between relative transition-colors ${
                isStrong
                  ? 'bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08]'
                  : 'bg-rose-500/[0.04] dark:bg-rose-500/[0.06]'
              }`}
            >
              {/* Header: Sign name + Lagna badge */}
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1 font-bold text-stone-600 dark:text-stone-300">
                  <span>{isTamil ? signInfo.shortTa : signInfo.shortEn}</span>
                  <span className="text-[8px] opacity-60 font-mono">({cellDef.rasi + 1})</span>
                </div>
                {isLagna && (
                  <span className="text-[8px] font-black px-1 py-0.2 rounded bg-[#7A1A22] text-amber-100 border border-amber-400">
                    {isTamil ? 'லக்' : 'Lag'}
                  </span>
                )}
              </div>

              {/* Main Bindu display */}
              <div className="flex flex-col items-center justify-center my-auto">
                <span
                  className={`text-lg sm:text-xl font-black font-mono leading-none ${
                    isStrong
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-800 dark:text-rose-400'
                  }`}
                >
                  {pts}
                </span>
                <span
                  className={`text-[9px] font-mono font-semibold mt-0.5 ${
                    diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {diff >= 0 ? `+${diff}` : `${diff}`}
                </span>
              </div>

              {/* Footer status */}
              <div className="flex items-center justify-between text-[8px] font-medium text-stone-500">
                <span className="truncate">{isTamil ? signInfo.ta : signInfo.en}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isStrong ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  title={isStrong ? (isTamil ? 'வலுவான பாவம் (≥ 28)' : 'Strong (≥ 28)') : (isTamil ? 'எச்சரிக்கை பாவம் (< 28)' : 'Vulnerable (< 28)')}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
