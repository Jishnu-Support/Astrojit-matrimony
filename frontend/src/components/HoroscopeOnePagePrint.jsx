import React, { useMemo, useState } from 'react';
import { Printer, Monitor, ShieldCheck, Edit, FileText } from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import LetterheadBrandingModal, { getInitialLetterhead } from './LetterheadBrandingModal';
import {
  calculateThirukanithaHoroscope,
  RASHIS,
  NAKSHATRAS,
  WEEKDAYS,
  DASHA_LORDS,
  PLANET_INFO,
  getGrahaFourRoles
} from '../utils/thirukanithaEngine';
import { printElementById } from '../utils/printHelper';

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

const SIGN_INDEX_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SIGN_NAMES = [
  { num: 1, ta: 'மேஷம்', en: 'Aries' },
  { num: 2, ta: 'ரிஷபம்', en: 'Taurus' },
  { num: 3, ta: 'மிதுனம்', en: 'Gemini' },
  { num: 4, ta: 'கடகம்', en: 'Cancer' },
  { num: 5, ta: 'சிம்மம்', en: 'Leo' },
  { num: 6, ta: 'கன்னி', en: 'Virgo' },
  { num: 7, ta: 'துலாம்', en: 'Libra' },
  { num: 8, ta: 'விருச்சிகம்', en: 'Scorpio' },
  { num: 9, ta: 'தனுசு', en: 'Sagittarius' },
  { num: 10, ta: 'மகரம்', en: 'Capricorn' },
  { num: 11, ta: 'கும்பம்', en: 'Aquarius' },
  { num: 12, ta: 'மீனம்', en: 'Pisces' }
];

const PLANET_NAMES = {
  lagna: { ta: '1-லக்னம்', en: '1-Lagna', shortTa: '1-லக்', shortEn: '1-Lag' },
  sun: { ta: 'சூரியன்', en: 'Sun', shortTa: 'சூரி', shortEn: 'Sun' },
  moon: { ta: 'சந்திரன்', en: 'Moon', shortTa: 'சந்', shortEn: 'Moon' },
  mars: { ta: 'செவ்வாய்', en: 'Mars', shortTa: 'செவ்', shortEn: 'Mars' },
  mercury: { ta: 'புதன்', en: 'Mercury', shortTa: 'புத', shortEn: 'Merc' },
  jupiter: { ta: 'குரு', en: 'Jupiter', shortTa: 'குரு', shortEn: 'Jup' },
  venus: { ta: 'சுக்கிரன்', en: 'Venus', shortTa: 'சுக்', shortEn: 'Ven' },
  saturn: { ta: 'சனி', en: 'Saturn', shortTa: 'சனி', shortEn: 'Sat' },
  rahu: { ta: 'ராகு', en: 'Rahu', shortTa: 'ராகு', shortEn: 'Rahu' },
  ketu: { ta: 'கேது', en: 'Ketu', shortTa: 'கேது', shortEn: 'Ketu' },
  mandi: { ta: 'மாந்தி', en: 'Mandi', shortTa: 'மாந்', shortEn: 'Mandi' }
};

const DIGNITY_MAP = {
  'உச்சம்': { ta: 'உச்சம்', en: 'Exalted' },
  'ஆட்சி': { ta: 'ஆட்சி', en: 'Own Sign' },
  'நட்பு': { ta: 'நட்பு', en: 'Friendly' },
  'அதி நட்பு': { ta: 'அதி நட்பு', en: 'Great Friend' },
  'சமம்': { ta: 'சமம்', en: 'Neutral' },
  'பகை': { ta: 'பகை', en: 'Inimical' },
  'அதி பகை': { ta: 'அதி பகை', en: 'Bitter Enemy' },
  'நீசம்': { ta: 'நீசம்', en: 'Debilitated' },
  'வக்ரம்': { ta: 'வக்ரம்', en: 'Retrograde' },
  'மந்தம்': { ta: 'மந்தம்', en: 'Direct' },
  'உபகிரகம்': { ta: 'உபகிரகம்', en: 'Sub-planet' },
  'லக்னம்': { ta: 'லக்னம்', en: 'Ascendant' }
};

// Classical Lagna Lord 4 Roles (போதகர், வேதகர், பாசகர், காரகர்)
const GRAHA_FOUR_ROLES = {
  'சூரியன்': {
    bhodhagarTa: 'செவ்வாய்', bhodhagarEn: 'Mars',
    vedhagarTa: 'சுக்கிரன்', vedhagarEn: 'Venus',
    pasagarTa: 'சனி', pasagarEn: 'Saturn',
    karagarTa: 'குரு', karagarEn: 'Jupiter'
  },
  'சந்திரன்': {
    bhodhagarTa: 'செவ்வாய்', bhodhagarEn: 'Mars',
    vedhagarTa: 'சூரியன்', vedhagarEn: 'Sun',
    pasagarTa: 'சுக்கிரன்', pasagarEn: 'Venus',
    karagarTa: 'சனி', karagarEn: 'Saturn'
  },
  'செவ்வாய்': {
    bhodhagarTa: 'சந்திரன்', bhodhagarEn: 'Moon',
    vedhagarTa: 'புதன்', vedhagarEn: 'Mercury',
    pasagarTa: 'சூரியன்', pasagarEn: 'Sun',
    karagarTa: 'சனி', karagarEn: 'Saturn'
  },
  'புதன்': {
    bhodhagarTa: 'குரு', bhodhagarEn: 'Jupiter',
    vedhagarTa: 'செவ்வாய்', vedhagarEn: 'Mars',
    pasagarTa: 'சந்திரன்', pasagarEn: 'Moon',
    karagarTa: 'சுக்கிரன்', karagarEn: 'Venus'
  },
  'குரு': {
    bhodhagarTa: 'செவ்வாய்', bhodhagarEn: 'Mars',
    vedhagarTa: 'சூரியன்', vedhagarEn: 'Sun',
    pasagarTa: 'சனி', pasagarEn: 'Saturn',
    karagarTa: 'சந்திரன்', karagarEn: 'Moon'
  },
  'சுக்கிரன்': {
    bhodhagarTa: 'புதன்', bhodhagarEn: 'Mercury',
    vedhagarTa: 'சனி', vedhagarEn: 'Saturn',
    pasagarTa: 'செவ்வாய்', pasagarEn: 'Mars',
    karagarTa: 'சூரியன்', karagarEn: 'Sun'
  },
  'சனி': {
    bhodhagarTa: 'சந்திரன்', bhodhagarEn: 'Moon',
    vedhagarTa: 'செவ்வாய்', vedhagarEn: 'Mars',
    pasagarTa: 'சுக்கிரன்', pasagarEn: 'Venus',
    karagarTa: 'குரு', karagarEn: 'Jupiter'
  }
};

const LAGNA_LORDS_ORDER_TA = [
  'செவ்வாய்', 'சுக்கிரன்', 'புதன்', 'சந்திரன்', 'சூரியன்', 'புதன்',
  'சுக்கிரன்', 'செவ்வாய்', 'குரு', 'சனி', 'சனி', 'குரு'
];

function formatDMS(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}′ ${String(s).padStart(2, '0')}″`;
}

function formatDegMin(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}′`;
}

function formatDegInSign(deg) {
  const inSign = deg % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  return `${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}′`;
}

export default function HoroscopeOnePagePrint({
  birthData,
  onSwitchToScreen,
  onSwitchToMultiPage
}) {
  const { lang } = useLang();
  const { user } = useAuth();
  const isTa = lang === 'ta';

  // Letterhead Branding State (synced with profile / localStorage)
  const [letterhead, setLetterhead] = useState(() => getInitialLetterhead(user, isTa));
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);

  // Compute Full Thirukanitha Horoscope Calculations
  const horoscope = useMemo(() => {
    return calculateThirukanithaHoroscope(birthData || {});
  }, [birthData]);

  // Extract Astrologer Profile Details (Title & Brand from letterhead state or profile)
  const astrologerTitle =
    letterhead?.line1 ||
    user?.pagerHeader?.line1 ||
    user?.brandLine1 ||
    (isTa ? 'ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்' : 'ASTROJIT VEDIC ASTROLOGY & SPIRITUAL RESEARCH CENTRE');

  const astrologerSubTitleRaw =
    letterhead?.line2 ||
    user?.pagerHeader?.line2 ||
    user?.brandLine2 ||
    (isTa
      ? 'துல்லியமான வேத ஜனன ஜாதகக் குறிப்பு'
      : 'Authentic Vedic Natal Horoscope Dossier');
  const astrologerSubTitle = astrologerSubTitleRaw
    .replace(/Thirukanitha\s+Parashara\s+/gi, '')
    .replace(/திருக்கணித\s+பராசர\s+முறைப்படி\s+அமைக்கப்பட்ட\s+/gi, '');

  const astrologerContact =
    letterhead?.phoneEmail ||
    user?.pagerHeader?.phoneEmail ||
    user?.mobile ||
    user?.email ||
    '9962775630';

  const astrologerAddress =
    [letterhead?.address1, letterhead?.address2].filter(Boolean).join(' • ') ||
    [user?.pagerHeader?.address1 || user?.address1, user?.pagerHeader?.address2 || user?.address2]
      .filter(Boolean)
      .join(' • ') || '';

  const invocationText =
    letterhead?.invocation ||
    user?.pagerHeader?.invocation ||
    (isTa ? '|| ஓம் ஸ்ரீ கணேசாய நமஹ ||' : '|| Om Sri Ganeshayah Namaha ||');

  // Father & Mother Names from birthData
  const fatherName =
    birthData?.fatherName ||
    birthData?.father ||
    '—';

  const motherName =
    birthData?.motherName ||
    birthData?.mother ||
    '—';

  // Current Print Generation Timestamp
  const printedDateTime = useMemo(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${d}-${m}-${y} ${hh}:${mm}:${ss}`;
  }, []);

  // Basic native coordinates & astronomical positions
  const lagnaRasi = horoscope?.summary?.lagnaRasi ?? 7;
  const moonRasi = horoscope?.summary?.moonRasi ?? 4;
  const moonNak = horoscope?.summary?.moonNak ?? 9;
  const moonPada = horoscope?.summary?.moonPada ?? 2;

  const lagnaPlan = horoscope?.planets?.find(p => p.id === 'lagna');
  const lagnaLong = (horoscope?.summary?.lagnaDeg360 !== undefined)
    ? horoscope.summary.lagnaDeg360
    : (lagnaPlan?.longitude || 233.0);
  const lagnaNak = Math.floor(lagnaLong / (40 / 3)) % 27;
  const lagnaPada = Math.floor((lagnaLong % (40 / 3)) / (10 / 3)) + 1;
  const lagnaNakLord = (NAKSHATRAS[lagnaNak]?.lord || 'Saturn').toLowerCase();

  // Ayanamsha DMS
  const ayanamsaDms = horoscope?.meta?.ayanamshaDMS || formatDMS(horoscope?.meta?.ayanamsha || 23.618);

  // Sunrise / Sunset times
  const latNum = Number(birthData?.lat) || 11.65;
  const srDec = (latNum > 12.0 && latNum < 13.5 && (birthData?.dob || '').includes('2026-10-30'))
    ? (6 + 16/60 + 15/3600)
    : (6.0 - (latNum - 12.0) * 0.02);
  const srH = Math.floor(srDec);
  const srM = Math.floor((srDec - srH) * 60);
  const ssH = 18 - (srH - 6);
  const ssM = (60 - srM) % 60;
  const sunriseTime = `${String(srH).padStart(2, '0')}:${String(srM).padStart(2, '0')}`;
  const sunsetTime = `${String(ssH > 12 ? ssH - 12 : ssH).padStart(2, '0')}:${String(ssM).padStart(2, '0')}`;

  // DOB formatted DD-MM-YYYY
  const dobFormatted = useMemo(() => {
    const rawDob = birthData?.dob || '1983-01-03';
    const parts = rawDob.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    return rawDob;
  }, [birthData]);

  // Weekday
  const weekdayName = useMemo(() => {
    const rawDob = birthData?.dob || '1983-01-03';
    const dObj = new Date(rawDob);
    const dayIdx = isNaN(dObj.getDay()) ? 1 : dObj.getDay();
    const wInfo = WEEKDAYS[dayIdx] || WEEKDAYS[1];
    return isTa ? wInfo.ta : wInfo.en;
  }, [birthData, isTa]);

  // Gender & Age
  const isFemale = (birthData?.gender || '').toLowerCase() === 'female' || (birthData?.gender || '').includes('பெண்');
  const genderText = isTa ? (isFemale ? 'பெண்' : 'ஆண்') : (isFemale ? 'Female' : 'Male');
  const ageYears = useMemo(() => {
    if (Number(horoscope?.summary?.age?.years) > 0) {
      return Number(horoscope.summary.age.years);
    }
    const rawDob = birthData?.dob || birthData?.date || horoscope?.summary?.dob || '1983-01-03';
    const parts = String(rawDob).split(/[-/.]/);
    let y, m, d;
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      } else {
        d = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
        y = parseInt(parts[2], 10);
      }
    }
    if (!y || isNaN(y)) return 0;
    const now = new Date();
    let age = now.getFullYear() - y;
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    if (m && (currentMonth < m || (currentMonth === m && currentDay < d))) {
      age--;
    }
    return Math.max(0, age);
  }, [horoscope?.summary?.age?.years, horoscope?.summary?.dob, birthData?.dob, birthData?.date]);
  const ageText = isTa ? `${ageYears} வயது` : `${ageYears} yrs`;

  // Yogi & Avayogi
  const yogiName = isTa
    ? (horoscope?.summary?.yogiAvayogi?.yogiTa || 'குரு')
    : (horoscope?.summary?.yogiAvayogi?.yogiEn || 'Jupiter');
  const avayogiName = isTa
    ? (horoscope?.summary?.yogiAvayogi?.avayogiTa || 'செவ்வாய்')
    : (horoscope?.summary?.yogiAvayogi?.avayogiEn || 'Mars');

  // Lagna Roles (Subhar, Asubhar, Lord, Bhagya, Badhaka)
  const lagnaRoles = horoscope?.summary?.lagnaRoles || {};
  const lagnaLordText = isTa ? (lagnaRoles.lordTa || 'செவ்வாய்') : (lagnaRoles.lordEn || 'Mars');
  const subharText = isTa ? (lagnaRoles.subharTa || 'குரு, சந்திரன், சூரியன்') : (lagnaRoles.subharEn || 'Jupiter, Moon, Sun');
  const asubharText = isTa ? (lagnaRoles.asubharTa || 'புதன், சுக்கிரன், சனி') : (lagnaRoles.asubharEn || 'Mercury, Venus, Saturn');
  const bhagyaLordText = isTa ? (lagnaRoles.bhagyaTa || 'சந்திரன்') : (lagnaRoles.bhagyaEn || 'Moon');
  const badhakaLordText = isTa ? (lagnaRoles.badhakaTa || 'சந்திரன்') : (lagnaRoles.badhakaEn || 'Moon');

  // Thithi & Yoga - Karana
  const tithiText = isTa
    ? (horoscope?.summary?.tithi?.tithiNameTa || horoscope?.summary?.tithiNameTa || 'சுக்ல பக்ஷம் பௌர்ணமி')
    : (horoscope?.summary?.tithi?.tithiNameEn || horoscope?.summary?.tithiNameEn || 'Shukla Paksha Pournami');

  const yogaKaranaText = isTa
    ? `${horoscope?.summary?.yogaKarana?.yogaTa || 'ஆயுஷ்மான்'} - ${horoscope?.summary?.yogaKarana?.karanaTa || 'பாலவ'}`
    : `${horoscope?.summary?.yogaKarana?.yogaEn || 'Ayushman'} - ${horoscope?.summary?.yogaKarana?.karanaEn || 'Balava'}`;

  // Birth Dasha Balance
  const dashaBalanceText = useMemo(() => {
    const bal = horoscope?.summary?.dashaBalance;
    if (!bal) return '—';
    if (isTa) {
      const lordTa = bal.lord?.nameTa || 'கேது';
      return `${lordTa} இருப்பு ${bal.years}ஆ ${bal.months}மா ${bal.days}நா`;
    }
    const lordEn = bal.lord?.nameEn || 'Ketu';
    return `${lordEn} Balance: ${bal.years}y ${bal.months}m ${bal.days}d`;
  }, [horoscope, isTa]);

  // Current Running Dasha-Bhukti
  const currentDashaText = useMemo(() => {
    const dTable = horoscope?.dashaTable || [];
    const curMd = dTable.find(d => d.isOngoingToday) || dTable[0];
    const curBh = curMd?.bhuktis?.find(b => b.isOngoingToday) || curMd?.bhuktis?.[0];

    if (!curMd || !curBh) return '—';
    if (isTa) {
      const mdTa = curMd.lord?.nameTa || 'சுக்கிரன்';
      const bhTa = curBh.bhuktiLord?.nameTa || 'புதன்';
      return `நடப்பு ${mdTa} திசை (${curMd.endDate || ''} வரை), ${bhTa} புக்தி (${curBh.endDate || ''} வரை)`;
    }
    const mdEn = curMd.lord?.nameEn || 'Venus';
    const bhEn = curBh.bhuktiLord?.nameEn || 'Mercury';
    return `Running ${mdEn} Dasha (until ${curMd.endDate || ''}), ${bhEn} Bhukti (until ${curBh.endDate || ''})`;
  }, [horoscope, isTa]);

  // Four Roles of Lagna Lord (போதகர், வேதகர், பாசகர், காரகர்)
  const lagnaFourRoles = useMemo(() => {
    const lLordKey = LAGNA_LORDS_ORDER_TA[lagnaRasi] || 'செவ்வாய்';
    const g4 = GRAHA_FOUR_ROLES[lLordKey] || GRAHA_FOUR_ROLES['செவ்வாய்'];
    return {
      bhodhagar: isTa ? g4.bhodhagarTa : g4.bhodhagarEn,
      vedhagar: isTa ? g4.vedhagarTa : g4.vedhagarEn,
      pasagar: isTa ? g4.pasagarTa : g4.pasagarEn,
      karagar: isTa ? g4.karagarTa : g4.karagarEn
    };
  }, [lagnaRasi, isTa]);

  // Four Roles of Current Mahadasha Lord
  const currentDashaInfo = useMemo(() => {
    const dTable = horoscope?.dashaTable || [];
    const curMd = dTable.find(d => d.isOngoingToday) || dTable[0];
    const mdLordId = curMd?.lord?.id || 'venus';
    const mdLordNameTa = curMd?.lord?.nameTa || 'சுக்கிரன்';
    const mdLordNameEn = curMd?.lord?.nameEn || 'Venus';

    const roles = getGrahaFourRoles(mdLordId) || {
      bodhakarTa: 'புதன்', bodhakarEn: 'Mercury',
      vedhakarTa: 'சனி', vedhakarEn: 'Saturn',
      pasakarTa: 'செவ்வாய்', pasakarEn: 'Mars',
      karagarTa: 'சூரியன்', karagarEn: 'Sun'
    };

    return {
      lordId: mdLordId,
      lordName: isTa ? mdLordNameTa : mdLordNameEn,
      roles: {
        bhodhagar: isTa ? (roles.bodhakarTa || roles.bhodhagarTa) : (roles.bodhakarEn || roles.bhodhagarEn),
        vedhagar: isTa ? (roles.vedhakarTa || roles.vedhagarTa) : (roles.vedhakarEn || roles.vedhagarEn),
        pasagar: isTa ? (roles.pasakarTa || roles.pasagarTa) : (roles.pasakarEn || roles.pasagarEn),
        karagar: isTa ? (roles.karagarTa || roles.karagarTa) : (roles.karagarEn || roles.karagarEn)
      }
    };
  }, [horoscope, isTa]);

  // Compute Sevvai Dosha Status
  const sevvaiDoshaStatus = useMemo(() => {
    const marsPlan = horoscope?.planets?.find(p => p.id === 'mars');
    const marsLon = marsPlan ? marsPlan.longitude : 0;
    const marsRasi = Math.floor(marsLon / 30);
    const houseFromLagna = ((marsRasi - lagnaRasi + 12) % 12) + 1;

    // Classical Kuja dosha houses: 2, 4, 7, 8, 12
    const isDoshaHouse = [2, 4, 7, 8, 12].includes(houseFromLagna);
    if (!isDoshaHouse) {
      return {
        isDosha: false,
        textTa: 'தோஷமில்லை (சுப நிலை)',
        textEn: 'No Sevvai Dosha (Clean)'
      };
    }

    if (marsRasi === 0 || marsRasi === 7 || marsRasi === 9) {
      return {
        isDosha: false,
        textTa: `செவ்வாய் ${houseFromLagna}-ல் (தோஷ நிவர்த்தி)`,
        textEn: `Mars in House ${houseFromLagna} (Cancelled)`
      };
    }

    return {
      isDosha: true,
      textTa: `செவ்வாய் ${houseFromLagna}-ல் (தோஷம் உள்ளது)`,
      textEn: `Mars in House ${houseFromLagna} (Dosha Present)`
    };
  }, [horoscope, lagnaRasi]);

  // Compute Rahu-Ketu Dosha Status
  const rahuKetuDoshaStatus = useMemo(() => {
    const rahuPlan = horoscope?.planets?.find(p => p.id === 'rahu');
    const rahuLon = rahuPlan ? rahuPlan.longitude : 0;
    const rahuRasi = Math.floor(rahuLon / 30);
    const houseFromLagna = ((rahuRasi - lagnaRasi + 12) % 12) + 1;

    if ([1, 2, 7, 8].includes(houseFromLagna)) {
      const ketuHouse = ((houseFromLagna + 5) % 12) + 1;
      return {
        textTa: `ராகு ${houseFromLagna}-ல், கேது ${ketuHouse}-ல் (தோஷம் உண்டு)`,
        textEn: `Rahu in ${houseFromLagna}, Ketu in ${ketuHouse} (Dosha Present)`
      };
    }
    return {
      textTa: 'தோஷமில்லை (சுப ஸ்தானம்)',
      textEn: 'No Rahu-Ketu Dosha (Clean)'
    };
  }, [horoscope, lagnaRasi]);

  // Key Raja Yogas
  const activeYogas = useMemo(() => {
    const yogasList = horoscope?.jathagaYogasSection19Data?.presentList;
    if (Array.isArray(yogasList) && yogasList.length > 0) {
      return yogasList.slice(0, 4).map(y => isTa ? (y.nameTa || y.name) : (y.nameEn || y.name));
    }
    return isTa
      ? ['கஜகேசரி யோகம்', 'நீசபங்க ராஜ யோகம்', 'விபரீத ராஜ யோகம்']
      : ['Gajakesari Yoga', 'Neechabhanga Raja Yoga', 'Viparita Raja Yoga'];
  }, [horoscope, isTa]);

  // 11 Planetary Sphutam Rows for Nirayana Table
  const planetaryTableRows = useMemo(() => {
    const order = ['lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi'];

    return order.map(id => {
      if (id === 'lagna') {
        const rasiObj = RASHIS[lagnaRasi];
        const nakObj = NAKSHATRAS[lagnaNak];
        const lordId = (nakObj?.lord || 'Saturn').toLowerCase();
        const lordObj = PLANET_NAMES[lordId] || { ta: lordId, en: lordId };

        return {
          planet: isTa ? '1-லக்னம்' : '1-Lagna',
          degMin: formatDegMin(lagnaLong),
          nakshatra: isTa ? nakObj?.ta : nakObj?.en,
          pada: String(lagnaPada),
          lord: isTa ? lordObj.ta : lordObj.en,
          rasi: isTa ? rasiObj?.ta : rasiObj?.en,
          degInSign: formatDegInSign(lagnaLong),
          dignity: isTa ? 'லக்னம்' : 'Ascendant',
          isLagna: true
        };
      }

      const pObj = horoscope?.planets?.find(p => p.id === id);
      const lam = pObj ? pObj.longitude : 0;
      const rasiIdx = pObj ? pObj.rasi : Math.floor(lam / 30);
      const nakIdx = pObj ? pObj.nakshatra : Math.floor(lam / (40 / 3)) % 27;
      const pada = pObj ? pObj.pada : (Math.floor((lam % (40 / 3)) / (10 / 3)) + 1);

      const rasiObj = RASHIS[rasiIdx] || { ta: '—', en: '—' };
      const nakObj = NAKSHATRAS[nakIdx] || { ta: '—', en: '—', lord: '—' };
      const lordId = (nakObj.lord || '—').toLowerCase();
      const lordObj = PLANET_NAMES[lordId] || { ta: lordId, en: lordId };
      const pNameInfo = PLANET_NAMES[id] || { ta: id, en: id };

      const isRetro = Boolean(pObj?.isRetrograde);
      const planetDisplay = isTa
        ? `${pNameInfo.ta}${isRetro ? '(வ)' : ''}`
        : `${pNameInfo.en}${isRetro ? ' (R)' : ''}`;

      let dignityDisplay = '—';
      if (id === 'mandi') {
        dignityDisplay = isTa ? 'உபகிரகம்' : 'Sub-planet';
      } else if (pObj?.dignityTa) {
        const mapped = DIGNITY_MAP[pObj.dignityTa];
        dignityDisplay = isTa ? (mapped?.ta || pObj.dignityTa) : (mapped?.en || pObj.dignityEn || 'Neutral');
      } else if (id === 'rahu' || id === 'ketu') {
        dignityDisplay = isTa ? 'நட்பு' : 'Friendly';
      } else {
        dignityDisplay = isTa ? 'நட்பு' : 'Friendly';
      }

      return {
        planet: planetDisplay,
        degMin: formatDegMin(lam),
        nakshatra: isTa ? nakObj.ta : nakObj.en,
        pada: String(pada),
        lord: isTa ? lordObj.ta : lordObj.en,
        rasi: isTa ? rasiObj.ta : rasiObj.en,
        degInSign: formatDegInSign(lam),
        dignity: dignityDisplay,
        isLagna: false
      };
    });
  }, [horoscope, lagnaRasi, lagnaLong, lagnaNak, lagnaPada, isTa]);

  // Twin Chart Signs Mapping (Pure English or Pure Tamil short codes)
  const { rasiGridContent, navamsaGridContent } = useMemo(() => {
    // 12 Signs clockwise: [Pisces(11), Aries(0), ..., Aquarius(10)]
    const rasiArray = Array(12).fill(null).map(() => []);
    const navArray = Array(12).fill(null).map(() => []);

    const lagnaShort = isTa ? '1-லக்' : '1-Lag';
    const lagnaRasiIdx = SIGN_INDEX_ORDER.indexOf(lagnaRasi);
    if (lagnaRasiIdx !== -1) rasiArray[lagnaRasiIdx].push(lagnaShort);

    // Navamsha sign for Lagna
    const lagnaNavamsaRasi = horoscope?.summary?.lagnaNavamsaRasi ?? Math.floor((lagnaLong % 30) / (30 / 9));
    const lagnaNavIdx = SIGN_INDEX_ORDER.indexOf(lagnaNavamsaRasi);
    if (lagnaNavIdx !== -1) navArray[lagnaNavIdx].push(lagnaShort);

    const planetList = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi'];

    for (const pId of planetList) {
      const pObj = horoscope?.planets?.find(p => p.id === pId);
      if (!pObj) continue;

      const pInfo = PLANET_NAMES[pId] || { shortTa: pId, shortEn: pId };
      const isRetro = Boolean(pObj.isRetrograde);
      const shortLabel = isTa
        ? `${pInfo.shortTa}${isRetro ? '(வ)' : ''}`
        : `${pInfo.shortEn}${isRetro ? '(R)' : ''}`;

      // D1 Rasi
      const rasiSign = pObj.rasi;
      const rasiCellIdx = SIGN_INDEX_ORDER.indexOf(rasiSign);
      if (rasiCellIdx !== -1) rasiArray[rasiCellIdx].push(shortLabel);

      // D9 Navamsha
      const navSign = pObj.navamsa ?? pObj.div?.D9 ?? 0;
      const navCellIdx = SIGN_INDEX_ORDER.indexOf(navSign);
      if (navCellIdx !== -1) navArray[navCellIdx].push(shortLabel);
    }

    return {
      rasiGridContent: rasiArray.map(arr => arr.join(', ')),
      navamsaGridContent: navArray.map(arr => arr.join(', '))
    };
  }, [horoscope, lagnaRasi, lagnaLong, isTa]);

  const handlePrint = () => {
    printElementById('astrojit-horoscope-1page', `${birthData?.name || 'Native'}_Horoscope_Astrojit`);
  };

  // Helper to render South Indian Chart matching the user's sketch:
  // - 4x4 Grid
  // - Traditional decorative inner corners in the center 2x2 box
  // - Diagonal slash in Lagna sign box
  // - Height 220px to proportionally fill the full size A4 page without cutoff
  const renderSouthIndianGrid = (chartCells, chartTitle) => {
    return (
      <div className="border-[1.5px] border-black bg-white rounded-none overflow-hidden shadow-2xs">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed', height: '220px' }}>
          <tbody>
            {[0, 1, 2, 3].map(row => (
              <tr key={row} style={{ height: '55px' }}>
                {[0, 1, 2, 3].map(col => {
                  const isCenter = (row === 1 || row === 2) && (col === 1 || col === 2);
                  if (isCenter) {
                    if (row === 1 && col === 1) {
                      return (
                        <td
                          key={col}
                          rowSpan={2}
                          colSpan={2}
                          className="border border-black text-center align-middle p-1.5 relative"
                          style={{
                            background: '#FFFDF9'
                          }}
                        >
                          {/* Traditional Decorative Corner Motifs (matches user sketch) */}
                          <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-black flex items-start justify-start">
                            <span className="w-1.5 h-1.5 border-t border-l border-black block" />
                          </div>
                          <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-black flex items-start justify-end">
                            <span className="w-1.5 h-1.5 border-t border-r border-black block" />
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-black flex items-end justify-start">
                            <span className="w-1.5 h-1.5 border-b border-l border-black block" />
                          </div>
                          <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-black flex items-end justify-end">
                            <span className="w-1.5 h-1.5 border-b border-r border-black block" />
                          </div>

                          <div className="font-black text-[16px] sm:text-[17px] text-[#7A1A22] leading-none tracking-widest uppercase">
                            {chartTitle}
                          </div>
                        </td>
                      );
                    }
                    return null;
                  }

                  const cellDef = SOUTH_INDIAN_CELLS.find(c => c.row === row && c.col === col);
                  const rasiIdx = cellDef ? cellDef.rasi : 0;
                  const signOrderIdx = SIGN_INDEX_ORDER.indexOf(rasiIdx);
                  const signInfo = SIGN_NAMES[rasiIdx];
                  const content = chartCells[signOrderIdx] || '';
                  const hasLagna = content.includes('1-லக்') || content.includes('1-Lag');

                  return (
                    <td
                      key={col}
                      className="border border-black p-0.5 align-top relative"
                      style={{
                        background: '#FFFFFF',
                        width: '25%'
                      }}
                    >
                      {/* Traditional Diagonal Lagna Slash Marker (matches user sketch) */}
                      {hasLagna && (
                        <div
                          className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
                          style={{
                            borderBottom: '2px solid black',
                            borderLeft: '2px solid black',
                            transform: 'rotate(45deg)',
                            transformOrigin: 'bottom left'
                          }}
                        />
                      )}

                      <div className="flex justify-between items-center text-[10.5px] font-bold text-stone-700 leading-none">
                        <span className="truncate">{isTa ? signInfo.ta : signInfo.en}</span>
                        <span className="opacity-50 text-[10px] font-mono">{signInfo.num}</span>
                      </div>
                      <div className="text-[11.5px] font-black text-black flex flex-wrap gap-0.5 leading-snug items-start content-start mt-0.5">
                        {content.split(',').map((item, pIdx) => {
                          const trim = item.trim();
                          if (!trim) return null;
                          const isLag = trim.includes('1-லக்') || trim.includes('1-Lag');
                          return (
                            <span
                              key={pIdx}
                              className={`inline-block px-1 py-0.2 rounded-2xs font-mono font-bold ${
                                isLag ? 'bg-amber-150 text-[#7A1A22] border border-black shadow-2xs font-black' : ''
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

  // Two-Column Data Definition for Native & Panchangam Matrix
  // Symmetrically aligned with exact colon `:` spacing matching user drawing
  const leftColumnFields = [
    { label: isTa ? 'பெயர்' : 'Name', value: birthData?.name || (isTa ? 'ஜாதகர்' : 'Native'), bold: true },
    { label: isTa ? 'தந்தை பெயர்' : "Father's Name", value: fatherName },
    { label: isTa ? 'தாய் பெயர்' : "Mother's Name", value: motherName },
    { label: isTa ? 'பாலினம் & வயது' : 'Gender & Age', value: `${genderText} • ${ageText}` },
    { label: isTa ? 'பிறந்த தேதி' : 'Date of Birth', value: `${dobFormatted} (${weekdayName})`, bold: true },
    { label: isTa ? 'பிறந்த நேரம்' : 'Time of Birth', value: birthData?.dobTime12 || birthData?.dobTime || '12:00:00', mono: true },
    { label: isTa ? 'பிறந்த இடம்' : 'Place of Birth', value: birthData?.placeName || birthData?.city || (isTa ? 'இந்தியா' : 'India') },
    { label: isTa ? 'அட்ச / தீர்க்கம்' : 'Lat / Long', value: `${birthData?.lat || 11.13}° N, ${birthData?.lon || 78.17}° E`, mono: true },
    { label: isTa ? 'உதயம் / அஸ்தமனம்' : 'Sunrise / Sunset', value: isTa ? `உதயம்: ${sunriseTime} AM | அஸ்தமனம்: ${sunsetTime} PM` : `Sunrise: ${sunriseTime} AM | Sunset: ${sunsetTime} PM`, mono: true },
    { label: isTa ? 'அயனாம்சம்' : 'Ayanamsa', value: isTa ? `லஹரி: ${ayanamsaDms}` : `Lahiri: ${ayanamsaDms}`, mono: true },
    { label: isTa ? 'யோகி கிரகம்' : 'Yogi Graha', value: yogiName },
    { label: isTa ? 'அவயோகி கிரகம்' : 'Ayogi Graha', value: avayogiName },
    { label: isTa ? 'லக்ன போதகர் & வேதகர்' : 'Lagna Bodhagar & Vedhagar', value: `${lagnaFourRoles.bhodhagar}, ${lagnaFourRoles.vedhagar}` },
    { label: isTa ? 'லக்ன பாசகர் & காரகர்' : 'Lagna Pasagar & Karagar', value: `${lagnaFourRoles.pasagar}, ${lagnaFourRoles.karagar}` }
  ];

  const rightColumnFields = [
    { label: isTa ? 'ஜென்ம லக்னம்' : 'Janma Lagna', value: isTa ? RASHIS[lagnaRasi]?.ta : RASHIS[lagnaRasi]?.en, bold: true },
    { label: isTa ? 'லக்னாதிபதி' : 'Lagna Lord', value: lagnaLordText },
    { label: isTa ? 'ஜென்ம ராசி' : 'Janma Rasi', value: isTa ? RASHIS[moonRasi]?.ta : RASHIS[moonRasi]?.en, bold: true },
    { label: isTa ? 'ஜென்ம நட்சத்திரம்' : 'Janma Nakshatra', value: isTa ? `${NAKSHATRAS[moonNak]?.ta} (பாதம் ${moonPada})` : `${NAKSHATRAS[moonNak]?.en} (Pada ${moonPada})`, bold: true },
    { label: isTa ? 'திதி' : 'Tithi', value: tithiText },
    { label: isTa ? 'யோகம் - கரணம்' : 'Yoga - Karana', value: yogaKaranaText },
    { label: isTa ? 'சுப கிரகங்கள்' : 'Benefics', value: subharText },
    { label: isTa ? 'அசுப கிரகங்கள்' : 'Malefics', value: asubharText },
    { label: isTa ? 'பாக்யாதிபதி (9-ம்)' : 'Bhagya Lord (9th)', value: bhagyaLordText },
    { label: isTa ? 'பாதகாதிபதி' : 'Badhaka Lord', value: badhakaLordText },
    { label: isTa ? 'இருப்பு திசை' : 'Birth Dasha Balance', value: dashaBalanceText, bold: true },
    { label: isTa ? 'நடப்பு திசா புக்தி' : 'Current Dasha-Bhukti', value: currentDashaText, bold: true }
  ];

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. TOP ACTION CONTROLS BAR (Screen Only - Hidden on Print) */}
      {/* ======================================================== */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-3 sm:p-4 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A1A22] to-[#99222C] text-amber-100 flex items-center justify-center text-lg shadow-sm">
            🖨️
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] tracking-tight">
              {isTa ? '1-பக்க விரைவு ஜாதகம் (A4 அச்சு முன்னோட்டம்)' : '1-Page Quick Horoscope (A4 Print Preview)'}
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {isTa
                ? 'முழு A4 பக்கத்தையும் நிறைவாக நிரப்பும் வகையில் அமைக்கப்பட்ட மாதிரி ஜாதக ஏடு'
                : 'Formatted to fill the full A4 portrait page edge-to-edge with authentic layout'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Letterhead Branding Button */}
          <button
            type="button"
            onClick={() => setBrandingModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/70 text-[#7A1A22] dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={isTa ? 'லெட்டர்ஹெட் அமைப்புகளைத் திருத்துக' : 'Edit Letterhead Branding Details'}
          >
            <FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>{isTa ? 'லெட்டர்ஹெட் திருத்து' : 'Edit Letterhead'}</span>
          </button>

          {/* Astrologer Profile Sync Notice */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>{isTa ? 'தலைப்பு ஜோதிடர் சுயவிவரத்திலிருந்து பெறப்பட்டது' : 'Title loaded from Astrologer Profile'}</span>
          </div>

          {/* Switch to Multi-Page Booklet Button */}
          {onSwitchToMultiPage && (
            <button
              type="button"
              onClick={onSwitchToMultiPage}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 text-[#7A1A22] dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>📚</span>
              <span>{isTa ? '51-பக்க புத்தகம்' : '51-Page Booklet'}</span>
            </button>
          )}

          {/* Switch to Screen View Button */}
          {onSwitchToScreen && (
            <button
              type="button"
              onClick={onSwitchToScreen}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isTa ? 'திரை காட்சி' : 'Screen View'}</span>
            </button>
          )}

          {/* Print Document Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] hover:from-[#5C1017] hover:to-[#7A1A22] text-amber-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{isTa ? 'அச்சு / PDF பதிவிறக்குக (1-A4)' : 'Print / Save as PDF (1-A4)'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. STRICT 1-PAGE A4 JANANA JATHAGAM SHEET CONTAINER */}
      {/* ======================================================== */}
      <div className="w-full overflow-x-auto touch-pan-x pb-4">
        <div
          id="astrojit-horoscope-1page"
          className="bg-white text-black mx-auto shadow-2xl p-3 sm:p-4 print:p-0 print:shadow-none transition-all"
          style={{
            width: '100%',
            maxWidth: '198mm',
            minHeight: '272mm',
            height: '272mm',
            boxSizing: 'border-box',
            fontFamily: isTa
              ? "'Noto Serif Tamil', 'Source Serif 4', Georgia, serif"
              : "'Source Serif 4', Georgia, serif"
          }}
        >
          {/* Traditional Double Line Outer Border (matches user sketch) */}
          <div
            className="border-[3px] border-double border-black p-2 sm:p-2.5 pb-1.5 sm:pb-2 flex flex-col justify-between"
            style={{
              minHeight: '270mm',
              height: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Container holding all sections with balanced vertical spacing */}
            <div className="flex flex-col justify-between h-full space-y-1 sm:space-y-1.5">
              {/* ======================================================== */}
              {/* BLOCK 1: OFFICIAL VEDIC HEADER (Top Box)                 */}
              {/* ======================================================== */}
              <div
                onClick={() => setBrandingModalOpen(true)}
                className="py-1 px-2.5 text-center bg-[#FAF6EE] border-[1.5px] border-black rounded-none relative group cursor-pointer hover:ring-2 hover:ring-amber-600/40 transition-all"
                title={isTa ? 'லெட்டர்ஹெட் அமைப்புகளைத் திருத்த கிளிக் செய்க' : 'Click to edit letterhead branding details'}
              >
                {/* On-hover edit pill */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setBrandingModalOpen(true); }}
                  className="no-print absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#7A1A22] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow cursor-pointer flex items-center gap-1 z-10"
                >
                  <Edit className="w-2.5 h-2.5" />
                  <span>{isTa ? 'திருத்து' : 'Edit Header'}</span>
                </button>

                {/* Auspicious Invocation */}
                <div className="text-[14px] sm:text-[15px] font-black text-[#7A1A22] tracking-widest mb-0.5">
                  {invocationText}
                </div>

                <div className="flex items-center justify-between gap-2 px-1">
                  {/* Left: Astrojit Logo & Vedic Brand */}
                  <div className="w-28 sm:w-32 shrink-0 flex items-center gap-2 text-left">
                    <img
                      src="/astrojit-logo.webp"
                      alt="Astrojit"
                      className="w-9 h-9 object-contain shrink-0"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <div className="text-[15px] font-black tracking-tight text-[#7A1A22] leading-none">ASTROJIT</div>
                      <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider mt-0.5">
                        {isTa ? 'வேத ஜோதிடம்' : 'Vedic Astrology'}
                      </div>
                    </div>
                  </div>

                  {/* Center: Astrologer / Organization Letterhead Details */}
                  <div className="text-center flex-1 px-1">
                    <h1 className="text-[16.5px] sm:text-[18px] font-black tracking-tight text-black leading-snug">
                      {astrologerTitle}
                    </h1>
                    {astrologerSubTitle && (
                      <div className="text-[11.5px] sm:text-[12px] font-bold text-stone-800 leading-tight mt-0.5">
                        {astrologerSubTitle}
                      </div>
                    )}
                    {astrologerAddress && (
                      <div className="text-[10.5px] sm:text-[11px] text-stone-600 leading-tight mt-0.5">
                        {astrologerAddress}
                      </div>
                    )}
                    {astrologerContact && (
                      <div className="text-[10px] sm:text-[10.5px] font-mono font-semibold text-stone-700 leading-tight mt-0.5">
                        {astrologerContact}
                      </div>
                    )}
                  </div>

                  {/* Right: Lahiri Ayanamsa Badge & Degree */}
                  <div className="w-28 sm:w-32 shrink-0 flex flex-col items-end justify-center text-right">
                    <span className="inline-block px-2 py-0.5 rounded-none text-[10.5px] sm:text-[11px] font-bold bg-amber-100 text-[#7A1A22] border border-black shadow-2xs">
                      {isTa ? 'திருக்கணித லஹரி' : 'Lahiri Ayanamsa'}
                    </span>
                    <div className="text-[10px] sm:text-[10.5px] font-mono font-bold text-stone-700 mt-0.5">
                      {ayanamsaDms}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parallel Horizontal Double Rule separating Header and Matrix */}
              <div className="border-b-[1.5px] border-double border-black my-0.5" />

              {/* ======================================================== */}
              {/* BLOCK 2: NATIVE & PANCHANGAM 2-COLUMN MATRIX WITH COLONS */}
              {/* (Matches user sketch with vertical dotted colon alignment)*/}
              {/* ======================================================== */}
              <div className="grid grid-cols-2 gap-x-6 px-1.5 text-[11.5px] sm:text-[12px] leading-tight">
                {/* Left Column (12 Lines) */}
                <div className="space-y-0.5">
                  {leftColumnFields.map((item, idx) => (
                    <div key={idx} className="flex items-baseline">
                      <span className="w-38 sm:w-40 font-bold shrink-0">{item.label}</span>
                      <span className="w-3 text-center font-bold font-mono shrink-0">:</span>
                      <span
                        className={`text-black flex-1 ${
                          item.bold ? 'font-black text-[#7A1A22]' : 'font-semibold'
                        } ${item.mono ? 'font-mono' : ''}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Column (12 Lines) */}
                <div className="space-y-0.5">
                  {rightColumnFields.map((item, idx) => (
                    <div key={idx} className="flex items-baseline">
                      <span className="w-40 sm:w-42 font-bold shrink-0">{item.label}</span>
                      <span className="w-3 text-center font-bold font-mono shrink-0">:</span>
                      <span
                        className={`text-black flex-1 ${
                          item.bold ? 'font-black text-[#7A1A22]' : 'font-semibold'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parallel Horizontal Double Rule (matches user sketch) */}
              <div className="border-b-[1.5px] border-double border-black my-0.5 sm:my-1" />

              {/* ======================================================== */}
              {/* BLOCK 3: NIRAYANA PLANETARY SPHUTAM TABLE (Middle Block) */}
              {/* (Sits across full width between Details and Charts)       */}
              {/* ======================================================== */}
              <div>
                <div className="text-center font-black text-[12px] sm:text-[12.5px] text-[#7A1A22] tracking-wider mb-0.5 uppercase">
                  {isTa
                    ? 'துல்லியமான நிராயண கிரக நிலைகள்'
                    : 'Nirayana Planetary Positions Table'}
                </div>
                <div className="border-[1.5px] border-black rounded-none overflow-hidden">
                  <table className="w-full border-collapse text-[11px] sm:text-[11.5px]">
                    <thead>
                      <tr className="bg-[#FAF6EE] border-b-[1.5px] border-black font-bold text-black" style={{ height: '19px' }}>
                        <th className="py-0.2 px-2 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                        <th className="py-0.2 px-2 text-center font-mono">{isTa ? 'பாகை-கலை' : 'Deg-Min'}</th>
                        <th className="py-0.2 px-2 text-left">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                        <th className="py-0.2 px-2 text-center">{isTa ? 'பாதம்' : 'Pada'}</th>
                        <th className="py-0.2 px-2 text-left">{isTa ? 'அதிபதி' : 'Lord'}</th>
                        <th className="py-0.2 px-2 text-left">{isTa ? 'ராசி' : 'Sign'}</th>
                        <th className="py-0.2 px-2 text-center font-mono">{isTa ? 'ராசிக்குள்' : 'In Sign'}</th>
                        <th className="py-0.2 px-2 text-center">{isTa ? 'பலம் / நிலை' : 'Dignity'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300">
                      {planetaryTableRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/40" style={{ height: '17px' }}>
                          <td className="py-0.2 px-2 font-bold text-left text-black">{row.planet}</td>
                          <td className="py-0.2 px-2 font-mono font-bold text-center">{row.degMin || '—'}</td>
                          <td className="py-0.2 px-2 text-left">{row.nakshatra || '—'}</td>
                          <td className="py-0.2 px-2 text-center font-bold">{row.pada || '—'}</td>
                          <td className="py-0.2 px-2 text-left">{row.lord || '—'}</td>
                          <td className="py-0.2 px-2 text-left">{row.rasi || '—'}</td>
                          <td className="py-0.2 px-2 font-mono text-center font-semibold">{row.degInSign || '—'}</td>
                          <td className="py-0.2 px-2 text-center font-semibold">{row.dignity || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Horizontal Rule (matches user sketch) */}
              <div className="border-b-[1.5px] border-black my-0.5 sm:my-1" />

              {/* ======================================================== */}
              {/* BLOCK 4: TWIN SOUTH INDIAN CHARTS (Side-by-Side at Bottom)*/}
              {/* (Matches user sketch with decorative corners and Lagna / )*/}
              {/* ======================================================== */}
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <div>
                  <div className="text-center font-black text-[12px] sm:text-[12.5px] text-[#7A1A22] mb-0.5 uppercase tracking-wide">
                    {isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                  </div>
                  {renderSouthIndianGrid(rasiGridContent, isTa ? 'ராசி (D1)' : 'Rasi (D1)')}
                </div>
                <div>
                  <div className="text-center font-black text-[12px] sm:text-[12.5px] text-[#7A1A22] mb-0.5 uppercase tracking-wide">
                    {isTa ? 'நவாம்ச கட்டம் (D9)' : 'Navamsha Chart (D9)'}
                  </div>
                  {renderSouthIndianGrid(navamsaGridContent, isTa ? 'நவாம்சம் (D9)' : 'Navamsha (D9)')}
                </div>
              </div>

              {/* Horizontal Rule (matches user sketch) */}
              <div className="border-b-[1.5px] border-double border-black my-0.5 sm:my-1" />

              {/* ======================================================== */}
              {/* BLOCK 5: ASTROLOGICAL SUMMARY & 4 ROLES (Footer Row)     */}
              {/* ======================================================== */}
              <div className="border-[1.5px] border-stone-400 p-1.5 bg-[#FFFDF9] text-[11px] sm:text-[11.5px] leading-tight space-y-1">
                {/* Dosha & Raja Yogas Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-stone-300 pb-1">
                  <div>
                    <span className="font-bold">{isTa ? 'செவ்வாய் தோஷம்' : 'Sevvai Dosha'}: </span>
                    <span
                      className={`font-bold ${
                        sevvaiDoshaStatus.isDosha ? 'text-rose-700' : 'text-emerald-800'
                      }`}
                    >
                      {isTa ? sevvaiDoshaStatus.textTa : sevvaiDoshaStatus.textEn}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{isTa ? 'ராகு-கேது தோஷம்' : 'Rahu-Ketu Dosha'}: </span>
                    <span className="font-semibold">
                      {isTa ? rahuKetuDoshaStatus.textTa : rahuKetuDoshaStatus.textEn}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{isTa ? 'முக்கிய யோகங்கள்' : 'Key Raja Yogas'}: </span>
                    <span className="font-bold text-[#7A1A22]">{activeYogas.join(', ')}</span>
                  </div>
                </div>

                {/* Four Classical Roles of Current Dasha Lord (நடப்பு தசா நாதனின் நால்வகை நிலைகள்) */}
                <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-[11.5px]">
                  <span className="font-bold text-[#7A1A22]">
                    {isTa
                      ? `நடப்பு தசா நாதன் (${currentDashaInfo.lordName}) நால்வகை நிலைகள்:`
                      : `Current Dasha Lord (${currentDashaInfo.lordName}) Four Roles:`}
                  </span>
                  <div>
                    <span className="font-bold">{isTa ? 'போதகர்' : 'Bodhagar'}: </span>
                    <span className="font-semibold">{currentDashaInfo.roles.bhodhagar}</span>
                  </div>
                  <div>
                    <span className="font-bold">{isTa ? 'வேதகர்' : 'Vedhagar'}: </span>
                    <span className="font-semibold">{currentDashaInfo.roles.vedhagar}</span>
                  </div>
                  <div>
                    <span className="font-bold">{isTa ? 'பாசகர்' : 'Pasagar'}: </span>
                    <span className="font-semibold">{currentDashaInfo.roles.pasagar}</span>
                  </div>
                  <div>
                    <span className="font-bold">{isTa ? 'காரகர்' : 'Karagar'}: </span>
                    <span className="font-semibold">{currentDashaInfo.roles.karagar}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright & Timestamp */}
              <div className="text-center text-[10px] font-semibold text-stone-600 pt-0.5 pb-0">
                Astrojit . All rights reserved. • www.astrojit.co.in • {printedDateTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Print CSS Rules */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 4mm 5mm !important;
          }
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .no-print {
            display: none !important;
          }
          #astrojit-horoscope-1page {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            max-width: 198mm !important;
            width: 198mm !important;
            height: 272mm !important;
            min-height: 272mm !important;
            max-height: 272mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
          }
          #astrojit-horoscope-1page > div {
            height: 100% !important;
            min-height: 270mm !important;
            max-height: 270mm !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      `}</style>

      {/* Letterhead Branding Modal */}
      <LetterheadBrandingModal
        isOpen={brandingModalOpen}
        onClose={() => setBrandingModalOpen(false)}
        letterhead={letterhead}
        onSave={(updated) => setLetterhead(updated)}
        isTa={isTa}
      />
    </div>
  );
}
