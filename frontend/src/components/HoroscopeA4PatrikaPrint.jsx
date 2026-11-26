import React, { useMemo, useState, useEffect } from 'react';
import { Printer, Monitor, Sparkles, FileText } from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import LetterheadBrandingModal, { getInitialLetterhead } from './LetterheadBrandingModal';
import {
  calculateThirukanithaHoroscope,
  RASHIS,
  NAKSHATRAS,
  MAHADASHA_BHOGAN_VEDHAGAN_TABLE
} from '../utils/thirukanithaEngine';
import { printElementById } from '../utils/printHelper';
import NorthIndianChartGrid from './NorthIndianChartGrid';

// South Indian Chart Fixed Sign Layout (4x4 Grid)
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
  { row: 1, col: 0, rasi: 10 },
];

const NAKSHATRA_LORD_TA = {
  Ketu: 'கேது', Venus: 'சுக்கிரன்', Sun: 'சூரியன்', Moon: 'சந்திரன்',
  Mars: 'செவ்வாய்', Rahu: 'ராகு', Jupiter: 'குரு', Saturn: 'சனி', Mercury: 'புதன்',
};

const SHORT_PLANET_TA = {
  lagna: 'லக்', sun: 'சூரி', moon: 'சந்', mars: 'செவ்', mercury: 'புத',
  jupiter: 'குரு', venus: 'சுக்', saturn: 'சனி', rahu: 'ராகு', ketu: 'கேது', mandi: 'மாந்',
};

const SHORT_PLANET_EN = {
  lagna: 'Asc', sun: 'Sun', moon: 'Moo', mars: 'Mar', mercury: 'Mer',
  jupiter: 'Jup', venus: 'Ven', saturn: 'Sat', rahu: 'Rah', ketu: 'Ket', mandi: 'Man',
};

// Traditional Nakshatra Syllable Letters (4 padas per star, 27 stars)
const NAKSHATRA_LETTERS = [
  ['Chu', 'Che', 'Cho', 'La'], ['Li', 'Lu', 'Le', 'Lo'], ['A', 'I', 'U', 'E'],
  ['O', 'Va', 'Vi', 'Vu'], ['Ve', 'Vo', 'Ka', 'Ki'], ['Ku', 'Gha', 'Ng', 'Chha'],
  ['Ke', 'Ko', 'Ha', 'Hi'], ['Hu', 'He', 'Ho', 'Da'], ['Di', 'Du', 'De', 'Do'],
  ['Ma', 'Mi', 'Mu', 'Me'], ['Mo', 'Ta', 'Ti', 'Tu'], ['Te', 'To', 'Pa', 'Pi'],
  ['Pu', 'Sha', 'Na', 'Tha'], ['Pe', 'Po', 'Ra', 'Ri'], ['Ru', 'Re', 'Ro', 'Ta'],
  ['Ti', 'Tu', 'Te', 'To'], ['Na', 'Ni', 'Nu', 'Ne'], ['No', 'Ya', 'Yi', 'Yu'],
  ['Ye', 'Yo', 'Bha', 'Bhi'], ['Bhu', 'Dha', 'Pha', 'Dha'], ['Bhe', 'Bho', 'Ja', 'Ji'],
  ['Ju', 'Je', 'Jo', 'Gha'], ['Ga', 'Gi', 'Gu', 'Ge'], ['Go', 'Sa', 'Si', 'Su'],
  ['Se', 'So', 'Da', 'Di'], ['Du', 'Tha', 'Jha', 'Da'], ['De', 'Do', 'Cha', 'Chi']
];

const LUCKY_BY_LORD = {
  sun:     { dayTa: 'ஞாயிறு',          dayEn: 'Sunday',    dirTa: 'கிழக்கு',     dirEn: 'East',       deityTa: 'சிவபெருமான்',     deityEn: 'Lord Shiva' },
  moon:    { dayTa: 'திங்கள்',         dayEn: 'Monday',    dirTa: 'வடமேற்கு',    dirEn: 'North-West', deityTa: 'அம்பிகை',         deityEn: 'Goddess Parvati' },
  mars:    { dayTa: 'செவ்வாய்',        dayEn: 'Tuesday',   dirTa: 'தெற்கு',      dirEn: 'South',      deityTa: 'முருகப்பெருமான்',  deityEn: 'Lord Murugan' },
  mercury: { dayTa: 'புதன்',           dayEn: 'Wednesday', dirTa: 'வடக்கு',      dirEn: 'North',      deityTa: 'மகாவிஷ்ணு',       deityEn: 'Lord Vishnu' },
  jupiter: { dayTa: 'வியாழன்',         dayEn: 'Thursday',  dirTa: 'வடகிழக்கு',   dirEn: 'North-East', deityTa: 'தட்சிணாமூர்த்தி', deityEn: 'Dakshinamurthy' },
  venus:   { dayTa: 'வெள்ளி',          dayEn: 'Friday',    dirTa: 'தென்கிழக்கு', dirEn: 'South-East', deityTa: 'மகாலட்சுமி',      deityEn: 'Goddess Lakshmi' },
  saturn:  { dayTa: 'சனி',             dayEn: 'Saturday',  dirTa: 'மேற்கு',      dirEn: 'West',       deityTa: 'ஆஞ்சநேயர்',       deityEn: 'Lord Hanuman' },
  rahu:    { dayTa: 'செவ்வாய் / வெள்ளி', dayEn: 'Tue / Fri', dirTa: 'தென்மேற்கு',  dirEn: 'South-West', deityTa: 'துர்க்கை அம்மன்',  deityEn: 'Goddess Durga' },
  ketu:    { dayTa: 'செவ்வாய்',        dayEn: 'Tuesday',   dirTa: 'வடகிழக்கு',   dirEn: 'North-East', deityTa: 'விநாயகர்',         deityEn: 'Lord Ganesha' },
};

const SIGN_LORD_ID = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];

function SouthIndianChartBox({ title, chartBoxes, isTa, lagnaRasi }) {
  const byRasi = useMemo(() => {
    const map = {};
    (chartBoxes || []).forEach(b => { map[b.rasi] = b.occupants || []; });
    return map;
  }, [chartBoxes]);

  return (
    <div className="border border-black bg-white">
      <div className="grid grid-cols-4 grid-rows-4 w-full h-[57mm] text-[9.5px] leading-tight">
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-amber-50/60 border border-black/40 p-1.5 text-center"
                  >
                    <span className="font-black text-[12px] text-black">{title}</span>
                    {lagnaRasi !== undefined && RASHIS[lagnaRasi] && (
                      <span className="text-[9px] font-bold text-stone-700 mt-0.5">
                        {isTa ? `லக்னம்: ${RASHIS[lagnaRasi].ta}` : `Asc: ${RASHIS[lagnaRasi].en}`}
                      </span>
                    )}
                  </div>
                );
              }
              return null;
            }
            const cell = SOUTH_INDIAN_CELLS.find(x => x.row === r && x.col === c);
            if (!cell) return null;
            const occupants = byRasi[cell.rasi] || [];
            const isAsc = cell.rasi === lagnaRasi;
            return (
              <div
                key={`${r}-${c}`}
                className={`border border-black/35 p-1 flex flex-col justify-between overflow-hidden ${
                  isAsc ? 'bg-amber-50/80' : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap gap-0.5 items-start">
                  {occupants.map((occ, idx) => {
                    const label = isTa
                      ? (SHORT_PLANET_TA[occ.id] || occ.labelTa)
                      : (SHORT_PLANET_EN[occ.id] || occ.labelEn);
                    return (
                      <span
                        key={idx}
                        className={`px-0.5 rounded-[2px] font-bold ${
                          occ.isLagna
                            ? 'bg-black text-white'
                            : occ.isRetrograde
                            ? 'text-[#7A1A22] underline'
                            : 'text-black'
                        }`}
                      >
                        {label}{occ.isRetrograde ? (isTa ? '(வ)' : '(R)') : ''}
                      </span>
                    );
                  })}
                </div>
                <div className="text-[7px] text-stone-400 text-right leading-none">
                  {isTa ? RASHIS[cell.rasi]?.ta?.slice(0, 3) : RASHIS[cell.rasi]?.en?.slice(0, 3)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function HoroscopeA4PatrikaPrint({
  birthData,
  onSwitchToScreen
}) {
  const { lang } = useLang();
  const { user } = useAuth();
  const isTa = lang === 'ta';

  const [letterhead, setLetterhead] = useState(() => getInitialLetterhead(user, isTa));
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [chartStyle, setChartStyle] = useState(() => birthData?.chartStyle || 'south');

  useEffect(() => {
    setLetterhead(getInitialLetterhead(user, isTa));
  }, [user, isTa]);

  useEffect(() => {
    if (birthData?.chartStyle) setChartStyle(birthData.chartStyle);
  }, [birthData?.chartStyle]);

  const horoscope = useMemo(() => {
    return calculateThirukanithaHoroscope(birthData || {});
  }, [birthData]);

  const summary = horoscope?.summary || {};
  const planets = horoscope?.planets || [];
  const currentDasha = summary?.currentDashaToday || {};
  const dashaBalance = summary?.dashaBalance || {};
  const activeMahadashaRow = (horoscope?.dashaTable || []).find(d => d.isOngoingToday) || {};
  const sadeSati = horoscope?.gocharam?.sadeSati || {};
  const numerology = horoscope?.numerologyData || {};
  const yogiAvayogi = summary?.yogiAvayogi || {};
  const activeYogas = (horoscope?.jathagaYogasSection19Data?.yogas || []).filter(y => y.isPresent).slice(0, 4);

  // Header Centre & Astrologer Details
  const astrologerTitle =
    letterhead?.line1 ||
    user?.astrologerName ||
    user?.name ||
    (isTa ? 'ஸ்ரீ ஜிஷ்ணு ஜோதிடம் & வாஸ்து ஆராய்ச்சி மையம்' : 'Jishnu Astro & Vasthu Research Centre');
  const rawLine2 = letterhead?.line2 || '';
  const isGenericSubtitle = rawLine2 === 'Authentic Vedic Natal Horoscope Dossier' || rawLine2 === 'SAI BALAJI ASTROLOGICAL RESEARCH CENTRE';
  const astrologerSubTitle = (!isGenericSubtitle && rawLine2)
    ? rawLine2
    : (user?.name ? `${isTa ? 'ஜோதிடர்' : 'Astrologer'}: ${user.name}` : rawLine2);
  const astrologerAddress = [letterhead?.address1, letterhead?.address2].filter(Boolean).join(' • ');
  const astrologerContact = letterhead?.phoneEmail || [user?.phone, user?.email].filter(Boolean).join(' | ');
  const invocationText = letterhead?.invocation || (isTa ? 'ஸ்ரீ கணேசாய நமஹ • சுபம்' : 'Sri Ganeshaya Namah');

  // Personal & Birth Details (Formatted per Master Prompt Rules)
  const nativeName = birthData?.name || summary?.name || '---';
  const fatherName = birthData?.fatherName || '---';
  const motherName = birthData?.motherName || '---';
  const isFemale = (birthData?.gender || '').toLowerCase() === 'female' || (birthData?.gender || '').includes('பெண்');
  const genderLabel = birthData?.gender ? (isTa ? (isFemale ? 'பெண்' : 'ஆண்') : (isFemale ? 'Female' : 'Male')) : '---';
  const ageYears = summary?.age?.years;
  const genderAndAge = ageYears !== undefined && ageYears !== null
    ? `${genderLabel} (${ageYears} ${isTa ? 'வயது' : 'Yrs'})`
    : genderLabel;

  // Date of Birth in DD-MM-YYYY
  const dobFormatted = useMemo(() => {
    const rawDob = birthData?.dob || summary?.dob || '';
    if (!rawDob) return '---';
    const parts = rawDob.split(/[-/.]/);
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return rawDob;
  }, [birthData?.dob, summary?.dob]);

  // Time of Birth in HH:MM AM/PM
  const timeFormatted = useMemo(() => {
    if (birthData?.dobTime12) return birthData.dobTime12;
    const raw = birthData?.dobTime || summary?.dobTime || '';
    if (!raw) return '---';
    if (/AM|PM/i.test(raw)) return raw;
    const [hStr, mStr] = raw.split(':');
    const h = parseInt(hStr, 10);
    if (isNaN(h)) return raw;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, '0')}:${(mStr || '00').slice(0, 2)} ${period}`;
  }, [birthData?.dobTime12, birthData?.dobTime, summary?.dobTime]);

  const place = birthData?.placeName || birthData?.city || summary?.placeName || '---';
  const latNum = birthData?.lat !== undefined ? Number(birthData.lat) : null;
  const lonNum = birthData?.lon !== undefined ? Number(birthData.lon) : null;
  const latLonFormatted = (latNum !== null && !isNaN(latNum) && lonNum !== null && !isNaN(lonNum))
    ? `${Math.abs(latNum).toFixed(4)}° ${latNum >= 0 ? 'N' : 'S'} / ${Math.abs(lonNum).toFixed(4)}° ${lonNum >= 0 ? 'E' : 'W'}`
    : '---';

  // Sunrise / Sunset based on birth latitude
  const effLat = latNum !== null && !isNaN(latNum) ? latNum : 11.65;
  const srDec = 6.0 - (effLat - 12.0) * 0.02;
  const srH = Math.floor(srDec);
  const srM = Math.floor((srDec - srH) * 60);
  const ssH = 18 - (srH - 6);
  const ssM = (60 - srM) % 60;
  const sunriseTime = birthData?.sunrise || `${String(srH).padStart(2, '0')}:${String(srM).padStart(2, '0')} AM`;
  const sunsetTime = birthData?.sunset || `${String(ssH > 12 ? ssH - 12 : ssH).padStart(2, '0')}:${String(ssM).padStart(2, '0')} PM`;

  const lagnaRoles = summary?.lagnaRoles || {};
  const grahaFourRoles = summary?.grahaFourRoles || {};

  // Paksha from tithiNum (1-15 Shukla, 16-30 Krishna)
  const tithiNum = summary?.tithiNum || 1;
  const pakshaText = tithiNum <= 15 ? (isTa ? 'வளர்பிறை' : 'Shukla') : (isTa ? 'தேய்பிறை' : 'Krishna');

  // Moon Nakshatra & Lucky Letters
  const moonNakIdx = summary.moonNak ?? 0;
  const moonPada = summary.moonPada ?? 1;
  const moonNakshatraObj = NAKSHATRAS[moonNakIdx] || NAKSHATRAS[0];
  const moonLordEn = moonNakshatraObj?.lord || 'Ketu';
  const moonLordDisplay = isTa ? (NAKSHATRA_LORD_TA[moonLordEn] || moonLordEn) : moonLordEn;
  const nakLetters = (NAKSHATRA_LETTERS[moonNakIdx] || []).join(', ');
  const padaLetter = NAKSHATRA_LETTERS[moonNakIdx]?.[(moonPada - 1) % 4] || '';

  // Lagna Lord & Dosha checks
  const lagnaRasi = summary.lagnaRasi ?? 0;
  const lagnaLordId = SIGN_LORD_ID[lagnaRasi] || 'mars';
  const luckyInfo = LUCKY_BY_LORD[lagnaLordId] || LUCKY_BY_LORD.jupiter;

  // 14 LEFT COLUMN FIELDS (Exact Order)
  const leftColumnRows = [
    { label: isTa ? 'பெயர்' : 'Name', value: nativeName },
    { label: isTa ? 'தந்தை பெயர்' : "Father's Name", value: fatherName },
    { label: isTa ? 'தாய் பெயர்' : "Mother's Name", value: motherName },
    { label: isTa ? 'பாலினம் & வயது' : 'Gender & Age', value: genderAndAge },
    { label: isTa ? 'பிறந்த தேதி' : 'Date of Birth', value: dobFormatted },
    { label: isTa ? 'பிறந்த நேரம்' : 'Time of Birth', value: timeFormatted },
    { label: isTa ? 'பிறந்த இடம்' : 'Place of Birth', value: place },
    { label: isTa ? 'அட்சரேகை / தீர்க்கரேகை' : 'Latitude / Longitude', value: latLonFormatted },
    { label: isTa ? 'உதயம் / அஸ்தமனம்' : 'Sunrise / Sunset', value: `${sunriseTime} / ${sunsetTime}` },
    { label: isTa ? 'அயனாம்சம்' : 'Ayanamsa', value: summary.ayanamshaDMS || '---' },
    { label: isTa ? 'யோகி கிரகம்' : 'Yogi Graha', value: (isTa ? yogiAvayogi.yogiTa : yogiAvayogi.yogiEn) || '---' },
    { label: isTa ? 'அவயோகி கிரகம்' : 'Ayogi Graha', value: (isTa ? yogiAvayogi.avayogiTa : yogiAvayogi.avayogiEn) || '---' },
    {
      label: isTa ? 'லக்ன போதகர் & வேதகர்' : 'Lagna Bodhagar & Vedhagar',
      value: `${isTa ? (grahaFourRoles.bhodhagarTa || '---') : (grahaFourRoles.bhodhagarEn || '---')} / ${isTa ? (grahaFourRoles.vedhagarTa || '---') : (grahaFourRoles.vedhagarEn || '---')}`
    },
    {
      label: isTa ? 'லக்ன பாசகர் & காரகர்' : 'Lagna Pasagar & Karagar',
      value: `${isTa ? (grahaFourRoles.pasagarTa || '---') : (grahaFourRoles.pasagarEn || '---')} / ${isTa ? (grahaFourRoles.karagarTa || '---') : (grahaFourRoles.karagarEn || '---')}`
    },
  ];

  // 11 RIGHT COLUMN FIELDS (Current Dasha-Bhukti removed from top, shown below charts)
  const rightColumnRows = [
    { label: isTa ? 'ஜனன லக்னம்' : 'Janma Lagna', value: (isTa ? summary.lagnaTa : summary.lagnaEn) || '---' },
    { label: isTa ? 'லக்னாதிபதி' : 'Lagna Lord', value: (isTa ? lagnaRoles.lordTa : lagnaRoles.lordEn) || '---' },
    { label: isTa ? 'ஜனன ராசி' : 'Janma Rasi', value: (isTa ? summary.rasiTa : summary.rasiEn) || '---' },
    { label: isTa ? 'ஜனன நட்சத்திரம்' : 'Janma Nakshatra', value: (isTa ? summary.nakshatraWithPadaTa : summary.nakshatraWithPadaEn) || '---' },
    { label: isTa ? 'திதி' : 'Tithi', value: `${(isTa ? summary.tithiNameTa : summary.tithiNameEn) || '---'} (${pakshaText})` },
    { label: isTa ? 'யோகம் - கரணம்' : 'Yoga - Karana', value: (isTa ? summary.yogaKarana?.textTa : summary.yogaKarana?.textEn) || '---' },
    { label: isTa ? 'சுபர்கள்' : 'Benefics', value: (isTa ? lagnaRoles.subharTa : lagnaRoles.subharEn) || '---' },
    { label: isTa ? 'அசுபர்கள்' : 'Malefics', value: (isTa ? lagnaRoles.asubharTa : lagnaRoles.asubharEn) || '---' },
    { label: isTa ? 'பாக்கியாதிபதி (9)' : 'Bhagya Lord (9th)', value: (isTa ? lagnaRoles.bhagyaTa : lagnaRoles.bhagyaEn) || '---' },
    { label: isTa ? 'பாதகாதிபதி' : 'Badhaka Lord', value: (isTa ? lagnaRoles.badhakaTa : lagnaRoles.badhakaEn) || '---' },
    { label: isTa ? 'பிறப்பு தசை இருப்பு' : 'Birth Dasha Balance', value: (isTa ? dashaBalance.textTa : dashaBalance.textEn) || '---' },
  ];

  // Mahadasha Bhodhagar (Bhogan), Vedhagar, Pasagar, Karagar from fixed classical table
  const activeMdLordEn = currentDasha?.mahadasha?.nameEn || '';
  const mdRoleRow = MAHADASHA_BHOGAN_VEDHAGAN_TABLE.find(
    r => r.idEn.toLowerCase() === activeMdLordEn.toLowerCase()
  );

  const marsPlanet = planets.find(p => p.id === 'mars');
  const rahuPlanet = planets.find(p => p.id === 'rahu');
  const ketuPlanet = planets.find(p => p.id === 'ketu');

  const marsHouse = marsPlanet?.bhava || 1;
  const isChevvaiHouse = [2, 4, 7, 8, 12].includes(marsHouse);
  const marsExaltedOrOwn = marsPlanet?.dignityKey === 'utcha' || marsPlanet?.dignityKey === 'aatchi';
  const chevvaiStatus = !isChevvaiHouse
    ? (isTa ? `இல்லை (${marsHouse}-ம் வீடு)` : `No (${marsHouse}H)`)
    : marsExaltedOrOwn
    ? (isTa ? `நிவர்த்தி (${marsHouse}-ம் வீடு)` : `Cancelled (${marsHouse}H)`)
    : (isTa ? `உண்டு (${marsHouse}-ம் வீடு)` : `Yes (${marsHouse}H)`);

  const rahuHouse = rahuPlanet?.bhava || 1;
  const ketuHouse = ketuPlanet?.bhava || 7;
  const isSarpaAxis = [1, 2, 7, 8].includes(rahuHouse) || [1, 2, 7, 8].includes(ketuHouse);
  const sarpaStatus = isSarpaAxis
    ? (isTa ? `சர்ப்ப அச்சு (${rahuHouse}/${ketuHouse})` : `Axis ${rahuHouse}/${ketuHouse}`)
    : (isTa ? `சமநிலை (${rahuHouse}/${ketuHouse})` : `Balanced (${rahuHouse}/${ketuHouse})`);

  const handlePrint = () => {
    printElementById('astrojit-horoscope-1page', `${nativeName.replace(/\s+/g, '_')}_Jathagam_A4`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar (Hidden on Print) */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-3 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7A1A22] dark:text-amber-400" />
          <span className="text-xs sm:text-sm font-black text-[#7A1A22] dark:text-[#E8838B]">
            {isTa ? '1-பக்க ஜாதக அறிக்கை (A4)' : '1-Page Jathagam Report (A4)'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setChartStyle('south')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                chartStyle === 'south' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {isTa ? 'தென்னிந்தியா' : 'South Indian'}
            </button>
            <button
              type="button"
              onClick={() => setChartStyle('north')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                chartStyle === 'north' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {isTa ? 'வடஇந்தியா' : 'North Indian'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setBrandingModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 text-[#7A1A22] dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTa ? 'லெட்டர்ஹெட் திருத்து' : 'Edit Letterhead'}</span>
          </button>

          {onSwitchToScreen && (
            <button
              type="button"
              onClick={onSwitchToScreen}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isTa ? 'திரை காட்சி' : 'Screen View'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] hover:from-[#5C1017] hover:to-[#7A1A22] text-amber-100 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isTa ? 'A4 அச்சு / PDF' : 'Print / Save A4 PDF'}</span>
          </button>
        </div>
      </div>

      {/* Strict Single A4 Page (200mm x 288mm filling full printable A4 area) */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          id="astrojit-horoscope-1page"
          className="w-[200mm] h-[288mm] mx-auto bg-white text-black p-[1mm] shadow-lg overflow-hidden print:shadow-none"
          style={{ pageBreakAfter: 'avoid', breakInside: 'avoid' }}
        >
          {/* Thin Black Double Page Border */}
          <div className="w-full h-full border border-black p-[1mm] flex flex-col">
            <div className="w-full h-full border border-black/70 px-[4mm] py-[2.5mm] flex flex-col justify-between gap-1.5 bg-white">

              {/* 1. HEADER – ASTROLOGY CENTRE DETAILS (Left: AstroJit Logo | Center: Astrologer Details | Right: Astrologer Logo Only) */}
              <div className="border-b border-black pb-1.5 shrink-0">
                <div className="text-center text-[8.5px] font-bold text-stone-700 tracking-wider uppercase mb-0.5">
                  {invocationText}
                </div>
                <div className="flex items-center justify-between gap-2">
                  {/* Left: AstroJit Logo ONLY (Enlarged) */}
                  <div className="w-[38mm] shrink-0 flex items-center justify-start">
                    <img
                      src="/astrojit-logo.webp"
                      alt="AstroJit"
                      className="h-14 w-auto max-w-[37mm] object-contain shrink-0"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  {/* Center: Astrology Centre & Astrologer Name + Address */}
                  <div className="flex-1 text-center px-1 min-w-0">
                    <div className="text-[13.5px] font-black text-black leading-tight">
                      {astrologerTitle}
                    </div>
                    {astrologerSubTitle && (
                      <div className="text-[10px] font-bold text-stone-900 leading-tight mt-0.5">
                        {astrologerSubTitle}
                      </div>
                    )}
                    {astrologerAddress && (
                      <div className="text-[8.5px] text-stone-700 leading-tight mt-0.5">
                        {astrologerAddress}
                      </div>
                    )}
                    {astrologerContact && (
                      <div className="text-[8.5px] font-mono font-semibold text-stone-800 leading-tight mt-0.5">
                        {astrologerContact}
                      </div>
                    )}
                  </div>

                  {/* Right: Astrologer Uploaded Logo ONLY (Enlarged, no name/Thirukanitha text) */}
                  <div className="w-[38mm] shrink-0 flex items-center justify-end">
                    {(letterhead?.astrologerLogo || user?.pagerHeader?.astrologerLogo) ? (
                      <img
                        src={letterhead?.astrologerLogo || user?.pagerHeader?.astrologerLogo}
                        alt="Astrologer Logo"
                        className="h-14 w-auto max-w-[37mm] object-contain rounded border border-black/30 bg-white p-0.5 shrink-0"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setBrandingModalOpen(true)}
                        className="print:hidden text-[9px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded px-2.5 py-1.5 cursor-pointer"
                      >
                        {isTa ? '+ ஜோதிடர் லோகோ' : '+ Add Logo'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. TWO-COLUMN JATHAGAM PERSONAL DETAILS & ASTROLOGICAL ANALYSIS (14 Left / 11 Right) */}
              <div className="grid grid-cols-2 gap-3 border border-black/70 px-2.5 py-1.5 text-[9px] leading-[1.32] font-serif bg-white flex-1">
                {/* LEFT COLUMN – Birth & Astrological Details (14 Fields) */}
                <div className="border-r border-black/35 pr-2.5 flex flex-col justify-between divide-y divide-black/15">
                  {leftColumnRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[44%_8px_1fr] items-start py-[2px]">
                      <span className="font-bold text-black text-left">{row.label}</span>
                      <span className="font-bold text-black text-center">:</span>
                      <span className="font-semibold text-stone-900 break-words">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* RIGHT COLUMN – Horoscope & Planetary Analysis (11 Fields) */}
                <div className="flex flex-col justify-between divide-y divide-black/15">
                  {rightColumnRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-[42%_8px_1fr] items-start py-[2.5px]">
                      <span className="font-bold text-black text-left">{row.label}</span>
                      <span className="font-bold text-black text-center">:</span>
                      <span className="font-semibold text-stone-900 break-words">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. FULL-WIDTH PLANETARY POSITIONS – GRAHA NILAI (8 REQUIRED COLUMNS) */}
              <div className="border border-black/70 shrink-0">
                <div className="bg-stone-100 border-b border-black/60 px-2.5 py-1 font-black text-[9px] uppercase flex justify-between">
                  <span>{isTa ? 'கிரக நிலைகள் அட்டவணை (நிராயண)' : 'Planetary Positions – Graha Nilai (Nirayana)'}</span>
                  <span>{isTa ? '★ வர்கோத்தமம்' : '★ Vargottama'}</span>
                </div>
                <table className="w-full text-[8.7px] text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 font-bold border-b border-black/40">
                      <th className="py-1 px-1.5 border-r border-black/20">{isTa ? 'கிரகம்' : 'Planet'}</th>
                      <th className="py-1 px-1.5 border-r border-black/20">{isTa ? 'நிராயண பாகை' : 'Longitude'}</th>
                      <th className="py-1 px-1.5 border-r border-black/20">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                      <th className="py-1 px-1 text-center border-r border-black/20">{isTa ? 'பாதம்' : 'Pada'}</th>
                      <th className="py-1 px-1.5 border-r border-black/20">{isTa ? 'நட்சத்திர அதிபதி' : 'Nakshatra Lord'}</th>
                      <th className="py-1 px-1.5 border-r border-black/20">{isTa ? 'ராசி' : 'Rasi'}</th>
                      <th className="py-1 px-1.5 border-r border-black/20">{isTa ? 'ராசி பாகை' : 'Rasi Long'}</th>
                      <th className="py-1 px-1.5">{isTa ? 'கிரக நிலை' : 'Planetary Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20">
                    {planets.map(p => {
                      const isLagna = p.id === 'lagna' || p.isLagna;
                      const isMandi = p.id === 'mandi' || p.isMandi;
                      const starObj = NAKSHATRAS[p.nakshatra] || NAKSHATRAS[0];
                      const lordEn = starObj.lord;
                      const lordText = isTa ? (NAKSHATRA_LORD_TA[lordEn] || lordEn) : lordEn;
                      const isVargottama = !isLagna && !isMandi && p.rasi === p.navamsa;
                      return (
                        <tr key={p.id} className={isLagna ? 'bg-amber-50/60 font-bold' : ''}>
                          <td className="py-[2.4px] px-1.5 font-bold border-r border-black/15 whitespace-nowrap">
                            {isTa ? p.info.ta : p.info.en}
                            {p.isRetrograde ? (isTa ? ' (வ)' : ' (R)') : ''}
                            {isVargottama ? ' ★' : ''}
                          </td>
                          <td className="py-[2.4px] px-1.5 font-mono border-r border-black/15 whitespace-nowrap">{p.dms}</td>
                          <td className="py-[2.4px] px-1.5 border-r border-black/15 whitespace-nowrap">{isTa ? starObj.ta : starObj.en}</td>
                          <td className="py-[2.4px] px-1 text-center font-bold border-r border-black/15">{p.pada}</td>
                          <td className="py-[2.4px] px-1.5 border-r border-black/15 whitespace-nowrap">{lordText}</td>
                          <td className="py-[2.4px] px-1.5 border-r border-black/15 whitespace-nowrap">{isTa ? RASHIS[p.rasi]?.ta : RASHIS[p.rasi]?.en}</td>
                          <td className="py-[2.4px] px-1.5 font-mono border-r border-black/15 whitespace-nowrap">{p.degInSign}</td>
                          <td className="py-[2.4px] px-1.5 font-bold whitespace-nowrap">
                            {isLagna || isMandi ? '---' : (isTa ? p.dignityTa : p.dignityEn)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 4. TWO SOUTH INDIAN CHARTS SIDE BY SIDE (RASI & NAVAMSA) */}
              <div className="grid grid-cols-2 gap-3">
                {chartStyle === 'south' ? (
                  <>
                    <SouthIndianChartBox
                      title={isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                      chartBoxes={horoscope?.charts?.D1}
                      isTa={isTa}
                      lagnaRasi={lagnaRasi}
                    />
                    <SouthIndianChartBox
                      title={isTa ? 'நவாம்ச கட்டம் (D9)' : 'Navamsa Chart (D9)'}
                      chartBoxes={horoscope?.charts?.D9}
                      isTa={isTa}
                      lagnaRasi={planets.find(p => p.id === 'lagna')?.navamsa}
                    />
                  </>
                ) : (
                  <>
                    <NorthIndianChartGrid
                      title={isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                      chartData={horoscope?.charts?.D1}
                      lagnaRasi={lagnaRasi}
                      isTamil={isTa}
                      compact
                    />
                    <NorthIndianChartGrid
                      title={isTa ? 'நவாம்ச கட்டம் (D9)' : 'Navamsa Chart (D9)'}
                      chartData={horoscope?.charts?.D9}
                      lagnaRasi={planets.find(p => p.id === 'lagna')?.navamsa ?? lagnaRasi}
                      isTamil={isTa}
                      compact
                    />
                  </>
                )}
              </div>

              {/* 5. VIMSHOTTARI DASHA & BHUKTI INFORMATION + MAHADASHA BHODHAGAR, VEDHAGAR, PASAGAR, KARAGAR */}
              <div className="border border-black/70 p-2 text-[8.8px] leading-snug bg-stone-50/40 space-y-1 shrink-0">
                <div className="font-black text-[9px] border-b border-black/35 pb-0.5 uppercase flex items-center justify-between">
                  <span>{isTa ? 'விம்சோத்தரி தசா & புக்தி விவரம்' : 'Vimshottari Dasha & Bhukti Information'}</span>
                  <span className="text-[8px] font-bold">
                    {isTa ? `ஜனன தசை இருப்பு: ${dashaBalance.textTa || '---'}` : `Birth Balance: ${dashaBalance.textEn || '---'}`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                  <div>
                    <span className="text-stone-600">{isTa ? 'நடப்பு மகாதிசை:' : 'Current Mahadasha:'}</span>{' '}
                    <strong>{isTa ? currentDasha.mahadasha?.nameTa : currentDasha.mahadasha?.nameEn}</strong>{' '}
                    {activeMahadashaRow.startDate ? `(${activeMahadashaRow.startDate} – ${activeMahadashaRow.endDate})` : ''}
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'நடப்பு புக்தி:' : 'Current Bhukti:'}</span>{' '}
                    <strong>{isTa ? currentDasha.bhukti?.nameTa : currentDasha.bhukti?.nameEn}</strong>{' '}
                    {currentDasha.startDate ? `(${currentDasha.startDate} – ${currentDasha.endDate})` : ''}
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'நடப்பு அந்தரம்:' : 'Current Antara:'}</span>{' '}
                    <strong>{isTa ? currentDasha.antara?.nameTa : currentDasha.antara?.nameEn}</strong>{' '}
                    {currentDasha.antaraStartDate ? `(${currentDasha.antaraStartDate} – ${currentDasha.antaraEndDate})` : ''}
                  </div>
                </div>
                {/* Mahadasha Bhodhagar (Bhogan), Vedhagar, Pasagar, Karagar */}
                <div className="border-t border-black/25 pt-1 grid grid-cols-4 gap-2 text-[8.3px]">
                  <div>
                    <span className="text-stone-600">{isTa ? 'மகாதசை போகன்:' : 'Bhodhagar (Bhogan):'}</span>{' '}
                    <strong>{mdRoleRow ? (isTa ? mdRoleRow.bhoganTa : mdRoleRow.bhoganEn) : '---'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'மகாதசை வேதகன்:' : 'Vedhagar:'}</span>{' '}
                    <strong>{mdRoleRow ? (isTa ? mdRoleRow.vedhaganTa : mdRoleRow.vedhaganEn) : '---'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'மகாதசை பாசகன்:' : 'Pasagar:'}</span>{' '}
                    <strong>{mdRoleRow ? (isTa ? mdRoleRow.pasaganTa : mdRoleRow.pasaganEn) : '---'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'மகாதசை காரகன்:' : 'Karagar:'}</span>{' '}
                    <strong>{mdRoleRow ? (isTa ? mdRoleRow.karaganTa : mdRoleRow.karaganEn) : '---'}</strong>
                  </div>
                </div>
              </div>

              {/* 6. ADDITIONAL ASTROLOGICAL + LUCKY & TRADITIONAL REFERENCE INFO */}
              <div className="grid grid-cols-2 gap-2 text-[8.6px] leading-snug shrink-0">
                {/* Additional Astrological Information */}
                <div className="border border-black/70 p-1.5 space-y-0.5">
                  <div className="font-black text-[8.8px] border-b border-black/35 pb-0.5 uppercase">
                    {isTa ? 'கூடுதல் ஜோதிட விவரங்கள்' : 'Additional Astrological Information'}
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'தோஷ நிலை:' : 'Doshas:'}</span>{' '}
                    <strong>
                      {isTa ? 'செவ்வாய்' : 'Chevvai'}: {chevvaiStatus} | {isTa ? 'ராகு–கேது' : 'Rahu-Ketu'}: {sarpaStatus}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'ஏழரைச் சனி:' : 'Sade Sati:'}</span>{' '}
                    <strong>{isTa ? (sadeSati.titleTa || 'இல்லை') : (sadeSati.titleEn || 'No')}</strong>
                    {' | '}
                    <span className="text-stone-600">{isTa ? 'அஷ்டகவர்க்கம்:' : 'Ashtakavarga:'}</span>{' '}
                    <strong>{horoscope?.ashtakavarga?.grandTotal || 337} {isTa ? 'பரல்கள்' : 'Bindus'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'யோகி / அவயோகி:' : 'Yogi / Avayogi:'}</span>{' '}
                    <strong>{isTa ? `${yogiAvayogi.yogiTa || '---'} / ${yogiAvayogi.avayogiTa || '---'}` : `${yogiAvayogi.yogiEn || '---'} / ${yogiAvayogi.avayogiEn || '---'}`}</strong>
                    {' | '}
                    <span className="text-stone-600">{isTa ? 'வக்ரம்:' : 'Retrograde:'}</span>{' '}
                    <strong>{isTa ? (summary.vakraNamesTa || 'இல்லை') : (summary.vakraNamesEn || 'None')}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'முக்கிய யோகங்கள்:' : 'Active Yogas:'}</span>{' '}
                    <strong>{activeYogas.length > 0 ? activeYogas.map(y => (isTa ? y.nameTa : y.nameEn)).join(', ') : '---'}</strong>
                  </div>
                </div>

                {/* Lucky & Traditional Reference Information */}
                <div className="border border-black/70 p-1.5 space-y-0.5">
                  <div className="font-black text-[8.8px] border-b border-black/35 pb-0.5 uppercase">
                    {isTa ? 'அதிர்ஷ்ட & பாரம்பரிய குறிப்புகள்' : 'Lucky & Traditional Reference'}
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'அதிர்ஷ்ட எண்கள்:' : 'Lucky Numbers:'}</span>{' '}
                    <strong>{numerology.luckyNums || '---'}</strong>
                    {' | '}
                    <span className="text-stone-600">{isTa ? 'அதிர்ஷ்ட கிழமை:' : 'Lucky Day:'}</span>{' '}
                    <strong>{isTa ? luckyInfo.dayTa : luckyInfo.dayEn}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'அதிர்ஷ்ட நிறம்:' : 'Lucky Colours:'}</span>{' '}
                    <strong>{isTa ? (numerology.luckyColorsTa || numerology.luckyColors || '---') : (numerology.luckyColorsEn || '---')}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'அதிர்ஷ்ட திசை:' : 'Lucky Direction:'}</span>{' '}
                    <strong>{isTa ? luckyInfo.dirTa : luckyInfo.dirEn}</strong>
                    {' | '}
                    <span className="text-stone-600">{isTa ? 'இஷ்ட தெய்வம்:' : 'Ishta Devata:'}</span>{' '}
                    <strong>{isTa ? luckyInfo.deityTa : luckyInfo.deityEn}</strong>
                  </div>
                  <div>
                    <span className="text-stone-600">{isTa ? 'நட்சத்திர எழுத்துகள்:' : 'Nakshatra Letters:'}</span>{' '}
                    <strong>{nakLetters} ({isTa ? 'பாதம்' : 'Pada'} {moonPada}: {padaLetter})</strong>
                  </div>
                </div>
              </div>

              {/* 7. FOOTER – METHODOLOGY & SOFTWARE ATTRIBUTION */}
              <div className="border-t border-black pt-1 flex items-center justify-between text-[8.5px] text-stone-700 font-semibold shrink-0">
                <span>{isTa ? 'கணிப்பு முறை: திருக்கணித பஞ்சாங்கம் (லஹரி அயனாம்சம்)' : 'Methodology: Thirukanitha Ephemeris (Lahiri Ayanamsa)'}</span>
                <span>{isTa ? 'மென்பொருள்: AstroJit வேத ஜோதிட தளம்' : 'Software: AstroJit Vedic Astrology Platform'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
