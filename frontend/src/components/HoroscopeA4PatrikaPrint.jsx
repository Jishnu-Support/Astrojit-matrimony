import React, { useMemo, useState, useEffect } from 'react';
import { Printer, Monitor, Sparkles, FileText } from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import LetterheadBrandingModal, { getInitialLetterhead } from './LetterheadBrandingModal';
import {
  calculateThirukanithaHoroscope,
  RASHIS,
  NAKSHATRAS
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
      <div className="grid grid-cols-4 grid-rows-4 w-full h-[46mm] text-[7.5px] leading-tight">
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-amber-50/60 border border-black/40 p-1 text-center"
                  >
                    <span className="font-black text-[9.5px] text-black">{title}</span>
                    {lagnaRasi !== undefined && RASHIS[lagnaRasi] && (
                      <span className="text-[7px] font-bold text-stone-700 mt-0.5">
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
                className={`border border-black/35 p-0.5 flex flex-col justify-between overflow-hidden ${
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
                <div className="text-[6px] text-stone-400 text-right leading-none">
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
  const astrologerSubTitle = letterhead?.line2 || (user?.name ? `${isTa ? 'ஜோதிடர்' : 'Astrologer'}: ${user.name}` : '');
  const astrologerAddress = [letterhead?.address1, letterhead?.address2].filter(Boolean).join(' • ');
  const astrologerContact = letterhead?.phoneEmail || [user?.phone, user?.email].filter(Boolean).join(' | ');
  const invocationText = letterhead?.invocation || (isTa ? 'ஸ்ரீ கணேசாய நமஹ • சுபம்' : 'Sri Ganeshaya Namah');

  // Personal & Birth Details
  const nativeName = birthData?.name || summary?.name || (isTa ? 'ஜாதகர்' : 'Native');
  const fatherName = birthData?.fatherName || '---';
  const motherName = birthData?.motherName || '---';
  const genderText = birthData?.gender === 'female' ? (isTa ? 'பெண்' : 'Female') : birthData?.gender === 'male' ? (isTa ? 'ஆண்' : 'Male') : '---';
  const dob = birthData?.dob || summary?.dob || '---';
  const dobTime = birthData?.dobTime12 || birthData?.dobTime || summary?.dobTime || '---';
  const place = birthData?.placeName || birthData?.city || summary?.placeName || '---';
  const stateCountry = [birthData?.state, birthData?.country].filter(Boolean).join(', ') || '---';
  const latStr = birthData?.lat !== undefined ? `${Number(birthData.lat).toFixed(4)}°N` : '---';
  const lonStr = birthData?.lon !== undefined ? `${Number(birthData.lon).toFixed(4)}°E` : '---';
  const tzStr = birthData?.utcOffset ? `UTC ${birthData.utcOffset}` : 'UTC +05:30';
  const sunriseTime = birthData?.sunrise || '06:05 AM';
  const sunsetTime = birthData?.sunset || '06:15 PM';

  // Paksha from tithiNum (1-15 Shukla, 16-30 Krishna)
  const tithiNum = summary?.tithiNum || 1;
  const pakshaText = tithiNum <= 15 ? (isTa ? 'வளர்பிறை' : 'Shukla Paksha') : (isTa ? 'தேய்பிறை' : 'Krishna Paksha');

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

      {/* Strict Single A4 Page (198mm x 272mm matching printHelper #astrojit-horoscope-1page) */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          id="astrojit-horoscope-1page"
          className="w-[198mm] h-[272mm] mx-auto bg-white text-black p-[1.5mm] shadow-lg overflow-hidden print:shadow-none"
          style={{ pageBreakAfter: 'avoid', breakInside: 'avoid' }}
        >
          {/* Thin Black Double Page Border */}
          <div className="w-full h-full border border-black p-[1mm] flex flex-col">
            <div className="w-full h-full border border-black/70 px-[3.5mm] py-[2.5mm] flex flex-col justify-between bg-white">

              {/* 1. HEADER – ASTROLOGY CENTRE DETAILS (Left: AstroJit Logo | Center: Astrologer Details | Right: Astrologer Logo) */}
              <div className="border-b border-black pb-1.5">
                <div className="text-center text-[7px] font-bold text-stone-700 tracking-wider uppercase mb-0.5">
                  {invocationText}
                </div>
                <div className="flex items-center justify-between gap-2">
                  {/* Left: AstroJit Logo */}
                  <div className="w-[33mm] shrink-0 flex items-center gap-1.5 text-left">
                    <img
                      src="/astrojit-logo.webp"
                      alt="AstroJit"
                      className="w-8 h-8 object-contain shrink-0"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <div className="text-[11px] font-black tracking-tight text-black leading-none">ASTROJIT</div>
                      <div className="text-[7px] font-bold text-stone-600 uppercase mt-0.5">
                        {isTa ? 'வேத ஜோதிடம்' : 'Vedic Astrology'}
                      </div>
                    </div>
                  </div>

                  {/* Center: Astrology Centre & Astrologer Details */}
                  <div className="flex-1 text-center px-1 min-w-0">
                    <div className="text-[12.5px] font-black text-black leading-tight truncate">
                      {astrologerTitle}
                    </div>
                    {astrologerSubTitle && (
                      <div className="text-[8px] font-bold text-stone-800 leading-tight mt-0.5 truncate">
                        {astrologerSubTitle}
                      </div>
                    )}
                    {astrologerAddress && (
                      <div className="text-[7px] text-stone-700 leading-tight mt-0.5 truncate">
                        {astrologerAddress}
                      </div>
                    )}
                    {astrologerContact && (
                      <div className="text-[7px] font-mono font-semibold text-stone-800 leading-tight mt-0.5 truncate">
                        {astrologerContact}
                      </div>
                    )}
                  </div>

                  {/* Right: Astrologer Logo */}
                  <div className="w-[33mm] shrink-0 flex items-center justify-end gap-1.5 text-right">
                    <div className="min-w-0">
                      <div className="text-[7.5px] font-black text-black uppercase leading-tight truncate">
                        {user?.name || (isTa ? 'ஜோதிடர்' : 'Astrologer')}
                      </div>
                      <div className="text-[6.5px] font-semibold text-stone-600 mt-0.5">
                        {isTa ? 'திருக்கணித ஜாதகம்' : 'Thirukanitha'}
                      </div>
                    </div>
                    <img
                      src={letterhead?.astrologerLogo || '/astrojit-emblem.webp'}
                      alt="Astrologer Logo"
                      className="w-8 h-8 object-contain rounded border border-black/40 bg-white p-0.5 shrink-0"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. TWO-COLUMN PERSONAL, BIRTH & ASTROLOGICAL DETAILS */}
              <div className="grid grid-cols-2 gap-2 border border-black/60 p-1.5 text-[7.5px] leading-snug bg-stone-50/40">
                {/* Left Column: Personal & Birth Information */}
                <div className="border-r border-black/30 pr-2 space-y-0.5">
                  <div className="font-black text-[8px] border-b border-black/30 pb-0.5 mb-0.5 uppercase">
                    {isTa ? 'ஜனன & தனிப்பட்ட விவரங்கள்' : 'Personal & Birth Information'}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <div><span className="text-stone-600">{isTa ? 'பெயர்:' : 'Name:'}</span> <strong>{nativeName}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'பாலினம்:' : 'Gender:'}</span> <strong>{genderText}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'தந்தை:' : 'Father:'}</span> <strong>{fatherName}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'தாய்:' : 'Mother:'}</span> <strong>{motherName}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'பிறந்த தேதி:' : 'DOB:'}</span> <strong>{dob}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'பிறந்த நேரம்:' : 'Time:'}</span> <strong>{dobTime}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'பிறந்த இடம்:' : 'Place:'}</span> <strong>{place}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'மாநிலம்/நாடு:' : 'Region:'}</span> <strong>{stateCountry}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'தமிழ் தேதி:' : 'Tamil Date:'}</span> <strong>{isTa ? summary.tamilDate?.ta : summary.tamilDate?.en}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'நேர மண்டலம்:' : 'Timezone:'}</span> <strong>{tzStr}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'அட்சரேகை:' : 'Lat:'}</span> <strong className="font-mono">{latStr}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'தீர்க்கரேகை:' : 'Lon:'}</span> <strong className="font-mono">{lonStr}</strong></div>
                  </div>
                </div>

                {/* Right Column: Astrological Information */}
                <div className="space-y-0.5">
                  <div className="font-black text-[8px] border-b border-black/30 pb-0.5 mb-0.5 uppercase">
                    {isTa ? 'ஜோதிட & பஞ்சாங்க விவரங்கள்' : 'Astrological & Panchanga Details'}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <div><span className="text-stone-600">{isTa ? 'லக்னம்:' : 'Lagnam:'}</span> <strong>{isTa ? summary.lagnaTa : summary.lagnaEn}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'ராசி:' : 'Rasi:'}</span> <strong>{isTa ? summary.rasiTa : summary.rasiEn}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'நட்சத்திரம்:' : 'Nakshatram:'}</span> <strong>{isTa ? summary.nakshatraTa : summary.nakshatraEn} ({moonPada})</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'நட்சத்திர அதிபதி:' : 'Star Lord:'}</span> <strong>{moonLordDisplay}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'திதி:' : 'Tithi:'}</span> <strong>{isTa ? summary.tithiNameTa : summary.tithiNameEn}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'பக்ஷம்:' : 'Paksha:'}</span> <strong>{pakshaText}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'யோகம்:' : 'Yoga:'}</span> <strong>{isTa ? summary.yogaKarana?.yogaTa : summary.yogaKarana?.yogaEn}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'கரணம்:' : 'Karana:'}</span> <strong>{isTa ? summary.yogaKarana?.karanaTa : summary.yogaKarana?.karanaEn}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'கிழமை:' : 'Weekday:'}</span> <strong>{isTa ? summary.weekday?.ta : summary.weekday?.en}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'அயனாம்சம்:' : 'Ayanamsa:'}</span> <strong className="font-mono">{summary.ayanamshaDMS || '---'}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'சூரிய உதயம்:' : 'Sunrise:'}</span> <strong>{sunriseTime}</strong></div>
                    <div><span className="text-stone-600">{isTa ? 'சூரிய அஸ்தமனம்:' : 'Sunset:'}</span> <strong>{sunsetTime}</strong></div>
                  </div>
                </div>
              </div>

              {/* 3. FULL-WIDTH PLANETARY POSITIONS – GRAHA NILAI (8 REQUIRED COLUMNS) */}
              <div className="border border-black/70 overflow-hidden">
                <div className="bg-stone-100 border-b border-black/60 px-2 py-0.5 font-black text-[8px] uppercase flex justify-between">
                  <span>{isTa ? 'கிரக நிலைகள் அட்டவணை (நிராயண)' : 'Planetary Positions – Graha Nilai (Nirayana)'}</span>
                  <span>{isTa ? '★ வர்கோத்தமம்' : '★ Vargottama'}</span>
                </div>
                <table className="w-full text-[7.3px] text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 font-bold border-b border-black/40">
                      <th className="py-0.5 px-1.5 border-r border-black/20">{isTa ? 'கிரகம்' : 'Planet'}</th>
                      <th className="py-0.5 px-1 border-r border-black/20">{isTa ? 'நிராயண பாகை' : 'Longitude'}</th>
                      <th className="py-0.5 px-1 border-r border-black/20">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                      <th className="py-0.5 px-1 text-center border-r border-black/20">{isTa ? 'பாதம்' : 'Pada'}</th>
                      <th className="py-0.5 px-1 border-r border-black/20">{isTa ? 'நட்சத்திர அதிபதி' : 'Nakshatra Lord'}</th>
                      <th className="py-0.5 px-1 border-r border-black/20">{isTa ? 'ராசி' : 'Rasi'}</th>
                      <th className="py-0.5 px-1 border-r border-black/20">{isTa ? 'ராசி பாகை' : 'Rasi Long'}</th>
                      <th className="py-0.5 px-1">{isTa ? 'கிரக நிலை' : 'Planetary Status'}</th>
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
                          <td className="py-[1.5px] px-1.5 font-bold border-r border-black/15 whitespace-nowrap">
                            {isTa ? p.info.ta : p.info.en}
                            {p.isRetrograde ? (isTa ? ' (வ)' : ' (R)') : ''}
                            {isVargottama ? ' ★' : ''}
                          </td>
                          <td className="py-[1.5px] px-1 font-mono border-r border-black/15 whitespace-nowrap">{p.dms}</td>
                          <td className="py-[1.5px] px-1 border-r border-black/15 whitespace-nowrap">{isTa ? starObj.ta : starObj.en}</td>
                          <td className="py-[1.5px] px-1 text-center font-bold border-r border-black/15">{p.pada}</td>
                          <td className="py-[1.5px] px-1 border-r border-black/15 whitespace-nowrap">{lordText}</td>
                          <td className="py-[1.5px] px-1 border-r border-black/15 whitespace-nowrap">{isTa ? RASHIS[p.rasi]?.ta : RASHIS[p.rasi]?.en}</td>
                          <td className="py-[1.5px] px-1 font-mono border-r border-black/15 whitespace-nowrap">{p.degInSign}</td>
                          <td className="py-[1.5px] px-1 font-bold whitespace-nowrap">
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

              {/* 5. DASHA AND BHUKTI INFORMATION (BELOW THE CHARTS) */}
              <div className="border border-black/60 p-1.5 text-[7.5px] leading-snug bg-stone-50/40">
                <div className="font-black text-[8px] border-b border-black/30 pb-0.5 mb-0.5 uppercase">
                  {isTa ? 'விம்சோத்தரி தசா & புக்தி விவரம்' : 'Vimshottari Dasha & Bhukti Information'}
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                  <div>
                    <span className="text-stone-600">{isTa ? 'ஜனன தசை இருப்பு:' : 'Dasha Balance at Birth:'}</span>{' '}
                    <strong>{isTa ? dashaBalance.textTa : dashaBalance.textEn}</strong>
                  </div>
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
                  <div className="col-span-3">
                    <span className="text-stone-600">{isTa ? 'நடப்பு அந்தரம் (Pratyantardasha):' : 'Current Antara (Pratyantardasha):'}</span>{' '}
                    <strong>{isTa ? currentDasha.antara?.nameTa : currentDasha.antara?.nameEn}</strong>{' '}
                    {currentDasha.antaraStartDate ? `(${currentDasha.antaraStartDate} – ${currentDasha.antaraEndDate})` : ''}
                    {' • '}
                    <span className="text-stone-600">{isTa ? 'மீதமுள்ள நாட்கள்:' : 'Remaining:'}</span>{' '}
                    <strong>{currentDasha.daysRemaining ?? '---'} {isTa ? 'நாட்கள்' : 'days'}</strong>
                  </div>
                </div>
              </div>

              {/* 6. ADDITIONAL ASTROLOGICAL + LUCKY & TRADITIONAL REFERENCE INFO */}
              <div className="grid grid-cols-2 gap-2 text-[7.2px] leading-snug">
                {/* Additional Astrological Information */}
                <div className="border border-black/60 p-1.5 space-y-0.5">
                  <div className="font-black text-[7.8px] border-b border-black/30 pb-0.5 uppercase">
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
                <div className="border border-black/60 p-1.5 space-y-0.5">
                  <div className="font-black text-[7.8px] border-b border-black/30 pb-0.5 uppercase">
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
              <div className="border-t border-black pt-0.5 flex items-center justify-between text-[7px] text-stone-700 font-semibold">
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
