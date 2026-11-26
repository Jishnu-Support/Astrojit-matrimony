import React, { useMemo, useState, useEffect } from 'react';
import { Printer, Monitor, ShieldCheck, Sparkles, FileText } from 'lucide-react';
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
  Ketu: 'கேது',
  Venus: 'சுக்கிரன்',
  Sun: 'சூரியன்',
  Moon: 'சந்திரன்',
  Mars: 'செவ்வாய்',
  Rahu: 'ராகு',
  Jupiter: 'குரு',
  Saturn: 'சனி',
  Mercury: 'புதன்',
};

const SHORT_PLANET_TA = {
  lagna: 'ல', sun: 'சூ', moon: 'சந்', mars: 'செ', mercury: 'பு',
  jupiter: 'கு', venus: 'சு', saturn: 'சனி', rahu: 'ரா', ketu: 'கே', mandi: 'மா',
};

const SHORT_PLANET_EN = {
  lagna: 'Asc', sun: 'Sun', moon: 'Moo', mars: 'Mar', mercury: 'Mer',
  jupiter: 'Jup', venus: 'Ven', saturn: 'Sat', rahu: 'Rah', ketu: 'Ket', mandi: 'Man',
};

const REMEDY_BY_LORD = {
  sun: {
    deityTa: 'சிவபெருமான் / சூரிய நாராயணர்', deityEn: 'Lord Shiva / Suryanarayana',
    dayTa: 'ஞாயிறு', dayEn: 'Sunday',
    tipTa: 'ஞாயிறு காலை சூரிய நமஸ்காரம் மற்றும் கோதுமை தானம் நன்மை தரும்.',
    tipEn: 'Offer morning Surya Arghya on Sundays and practice charitable giving.'
  },
  moon: {
    deityTa: 'அம்பிகை / பார்வதி தேவி', deityEn: 'Goddess Parvati / Devi',
    dayTa: 'திங்கள்', dayEn: 'Monday',
    tipTa: 'திங்கள்கிழமை சிவாலய தரிசனம் மற்றும் பால்/அரிசி தானம் அமைதி தரும்.',
    tipEn: 'Visit Shiva temple on Mondays and maintain emotional calm & hydration.'
  },
  mars: {
    deityTa: 'முருகப்பெருமான் / துர்க்கை', deityEn: 'Lord Murugan / Subrahmanya',
    dayTa: 'செவ்வாய்', dayEn: 'Tuesday',
    tipTa: 'செவ்வாய்க்கிழமை முருகன் வழிபாடு மற்றும் சிவப்பு மலர் அர்ச்சனை சிறந்தது.',
    tipEn: 'Worship Lord Murugan on Tuesdays and channel energy into disciplined action.'
  },
  mercury: {
    deityTa: 'மகாவிஷ்ணு / ஹயக்ரீவர்', deityEn: 'Lord Maha Vishnu / Hayagriva',
    dayTa: 'புதன்', dayEn: 'Wednesday',
    tipTa: 'புதன்கிழமை விஷ்ணு சஹஸ்ரநாமம் பாராயணம் மற்றும் கல்வி உதவி நன்மை தரும்.',
    tipEn: 'Chant Vishnu Sahasranama on Wednesdays and support educational causes.'
  },
  jupiter: {
    deityTa: 'தட்சிணாமூர்த்தி / குரு பகவான்', deityEn: 'Lord Dakshinamurthy',
    dayTa: 'வியாழன்', dayEn: 'Thursday',
    tipTa: 'வியாழக்கிழமை தட்சிணாமூர்த்தி வழிபாடு மற்றும் பெரியோர்களின் ஆசி பெறுதல் சிறந்தது.',
    tipEn: 'Worship Dakshinamurthy on Thursdays and seek blessings of teachers/elders.'
  },
  venus: {
    deityTa: 'மகாலட்சுமி / அம்பாள்', deityEn: 'Goddess Mahalakshmi',
    dayTa: 'வெள்ளி', dayEn: 'Friday',
    tipTa: 'வெள்ளிக்கிழமை மகாலட்சுமி வழிபாடு மற்றும் நெய் தீபம் ஏற்றுதல் சுபம் தரும்.',
    tipEn: 'Light a ghee lamp for Goddess Lakshmi on Fridays and cultivate harmony.'
  },
  saturn: {
    deityTa: 'ஆஞ்சநேயர் / ஐயப்பன்', deityEn: 'Lord Hanuman / Ayyappan',
    dayTa: 'சனி', dayEn: 'Saturday',
    tipTa: 'சனிக்கிழமை ஆஞ்சநேயர் வழிபாடு, எள் தீபம் மற்றும் உழைப்பாளர்களுக்கு உதவி நன்மை தரும்.',
    tipEn: 'Visit Hanuman temple on Saturdays and offer help to the needy/elderly.'
  },
  rahu: {
    deityTa: 'துர்க்கை அம்மன்', deityEn: 'Goddess Durga',
    dayTa: 'செவ்வாய் / வெள்ளி', dayEn: 'Tuesday / Friday',
    tipTa: 'ராகு காலத்தில் துர்க்கை அம்மனுக்கு எலுமிச்சை தீபம் ஏற்றி வழிபடுதல் சிறந்தது.',
    tipEn: 'Offer prayers to Goddess Durga and stay grounded in clear decision-making.'
  },
  ketu: {
    deityTa: 'விநாயகப் பெருமான்', deityEn: 'Lord Ganesha',
    dayTa: 'சதுர்த்தி / செவ்வாய்', dayEn: 'Tuesday / Chaturthi',
    tipTa: 'விநாயகர் வழிபாடு மற்றும் ஆன்மீக தியானம் மனத்தெளிவைத் தரும்.',
    tipEn: 'Worship Lord Ganesha and practice regular meditation for inner clarity.'
  },
};

const SIGN_LORD_ID = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];

function CompactSouthChart({ title, chartBoxes, isTa, lagnaRasi }) {
  const byRasi = useMemo(() => {
    const map = {};
    (chartBoxes || []).forEach(b => { map[b.rasi] = b.occupants || []; });
    return map;
  }, [chartBoxes]);

  return (
    <div className="border border-amber-900/45 rounded overflow-hidden bg-[#FFFDF8]">
      <div className="grid grid-cols-4 grid-rows-4 aspect-square w-full text-[8px] leading-tight">
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div
                    key="center"
                    className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-amber-50/80 border border-amber-900/25 p-1 text-center"
                  >
                    <span className="font-black text-[9.5px] text-[#7A1A22]">{title}</span>
                    {lagnaRasi !== undefined && RASHIS[lagnaRasi] && (
                      <span className="text-[7.5px] font-bold text-stone-600 mt-0.5">
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
                className={`border border-amber-900/20 p-0.5 flex flex-col justify-start overflow-hidden ${
                  isAsc ? 'bg-amber-100/60' : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap gap-0.5 items-center">
                  {occupants.map((occ, idx) => {
                    const label = isTa
                      ? (SHORT_PLANET_TA[occ.id] || occ.labelTa)
                      : (SHORT_PLANET_EN[occ.id] || occ.labelEn);
                    return (
                      <span
                        key={idx}
                        className={`px-0.5 rounded font-bold ${
                          occ.isLagna
                            ? 'bg-[#7A1A22] text-white'
                            : occ.isRetrograde
                            ? 'text-amber-800 underline'
                            : 'text-stone-800'
                        }`}
                      >
                        {label}{occ.isRetrograde ? (isTa ? '(வ)' : '(R)') : ''}
                      </span>
                    );
                  })}
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
  const sadeSati = horoscope?.gocharam?.sadeSati || {};

  // Astrologer letterhead details
  const astrologerTitle =
    letterhead?.line1 ||
    user?.astrologerName ||
    user?.name ||
    (isTa ? 'ஸ்ரீ ஜிஷ்ணு ஜோதிடம் & வாஸ்து ஆராய்ச்சி மையம்' : 'Jishnu Astro & Vasthu Research Centre');
  const astrologerSubTitle = letterhead?.line2 || '';
  const astrologerAddress = [letterhead?.address1, letterhead?.address2].filter(Boolean).join(' • ');
  const astrologerContact = letterhead?.phoneEmail || [user?.phone, user?.email].filter(Boolean).join(' | ');
  const invocationText = letterhead?.invocation || (isTa ? 'ஸ்ரீ கணேசாய நமஹ • சுபம்' : 'Sri Ganeshaya Namah');

  // Sunrise/Sunset
  const sunriseTime = birthData?.sunrise || '06:05 AM';
  const sunsetTime = birthData?.sunset || '06:15 PM';

  // Nakshatra Athipathi for Moon
  const moonNakshatraObj = NAKSHATRAS[summary.moonNak ?? 0] || NAKSHATRAS[0];
  const moonLordEn = moonNakshatraObj?.lord || 'Ketu';
  const moonLordDisplay = isTa ? (NAKSHATRA_LORD_TA[moonLordEn] || moonLordEn) : moonLordEn;

  // Lagna Lord & Dosha checks
  const lagnaRasi = summary.lagnaRasi ?? 0;
  const lagnaLordId = SIGN_LORD_ID[lagnaRasi] || 'mars';
  const lagnaLordPlanet = planets.find(p => p.id === lagnaLordId);

  const marsPlanet = planets.find(p => p.id === 'mars');
  const rahuPlanet = planets.find(p => p.id === 'rahu');
  const ketuPlanet = planets.find(p => p.id === 'ketu');

  const marsHouse = marsPlanet?.bhava || 1;
  const isChevvaiHouse = [2, 4, 7, 8, 12].includes(marsHouse);
  const marsExaltedOrOwn = marsPlanet?.dignityKey === 'utcha' || marsPlanet?.dignityKey === 'aatchi';
  const chevvaiStatus = !isChevvaiHouse
    ? (isTa ? `செவ்வாய் தோஷம் இல்லை (${marsHouse}-ம் வீடு)` : `No Chevvai Dosha (House ${marsHouse})`)
    : marsExaltedOrOwn
    ? (isTa ? `தோஷ நிவர்த்தி (${marsHouse}-ம் வீடு, ஆட்சி/உச்சம்)` : `Dosha Cancelled (House ${marsHouse}, Own/Exalted)`)
    : (isTa ? `செவ்வாய் தோஷம் உள்ளது (${marsHouse}-ம் வீடு)` : `Chevvai Dosha Present (House ${marsHouse})`);

  const rahuHouse = rahuPlanet?.bhava || 1;
  const ketuHouse = ketuPlanet?.bhava || 7;
  const isSarpaAxis = [1, 2, 7, 8].includes(rahuHouse) || [1, 2, 7, 8].includes(ketuHouse);
  const sarpaStatus = isSarpaAxis
    ? (isTa ? `சர்ப்ப தோஷ அச்சு (${rahuHouse}/${ketuHouse}-ம் வீடுகள்)` : `Sarpa Dosha Axis (Houses ${rahuHouse}/${ketuHouse})`)
    : (isTa ? `சமநிலை ராகு–கேது (${rahuHouse}/${ketuHouse}-ம் வீடுகள்)` : `Balanced Nodal Axis (Houses ${rahuHouse}/${ketuHouse})`);

  // Current Dasha Lord & Remedy
  const activeDashaId = currentDasha?.mahadasha?.id || lagnaLordId;
  const remedyInfo = REMEDY_BY_LORD[activeDashaId] || REMEDY_BY_LORD[lagnaLordId] || REMEDY_BY_LORD.jupiter;

  const nativeName = birthData?.name || summary?.name || (isTa ? 'ஜாதகர்' : 'Native');
  const dob = birthData?.dob || summary?.dob || 'YYYY-MM-DD';
  const dobTime = birthData?.dobTime12 || birthData?.dobTime || summary?.dobTime || 'HH:MM';
  const place = birthData?.placeName || birthData?.city || summary?.placeName || '';
  const coords = birthData?.lat && birthData?.lon ? `(${Number(birthData.lat).toFixed(2)}°N, ${Number(birthData.lon).toFixed(2)}°E)` : '';

  const handlePrint = () => {
    printElementById('astrojit-horoscope-1page', `${nativeName.replace(/\s+/g, '_')}_A4_Patrika`);
  };

  const getPlanetNote = (planetId, domainTa, domainEn) => {
    const pl = planets.find(x => x.id === planetId);
    if (!pl) return isTa ? `${domainTa} சமநிலையில் உள்ளது.` : `${domainEn} remains balanced.`;
    const isStrong = pl.dignityKey === 'utcha' || pl.dignityKey === 'aatchi' || pl.dignityKey === 'natpu';
    const dig = isTa ? pl.dignityTa : pl.dignityEn;
    if (isTa) {
      return `${pl.info.ta} (${pl.bhava}-ம் வீடு, ${dig}) — ${isStrong ? `${domainTa} முன்னேற்றம் சிறப்பாகும்.` : `${domainTa} முயற்சியால் நிலைபெறும்.`}`;
    }
    return `${pl.info.en} (H${pl.bhava}, ${dig}) — ${isStrong ? `supports steady growth in ${domainEn}.` : `requires planned effort in ${domainEn}.`}`;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar (Hidden on Print) */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-3 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7A1A22] dark:text-amber-400" />
          <span className="text-xs sm:text-sm font-black text-[#7A1A22] dark:text-[#E8838B]">
            {isTa ? '1-பக்க விரைவு ஜாதகம் (A4)' : '1-Page Quick Horoscope (A4 Patrika)'}
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

      {/* Strict Single A4 Sheet (Matches printHelper #astrojit-horoscope-1page: 198mm x 272mm) */}
      <div className="w-full overflow-x-auto pb-4">
        <div
          id="astrojit-horoscope-1page"
          className="w-[198mm] h-[272mm] mx-auto bg-white text-stone-900 p-[2.5mm] shadow-lg overflow-hidden print:shadow-none"
          style={{ pageBreakAfter: 'avoid', breakInside: 'avoid' }}
        >
          {/* Outer Classic Border + Inner Accent Border */}
          <div className="w-full h-full border-2 border-[#7A1A22] p-[1.5mm] flex flex-col">
            <div className="w-full h-full border border-amber-700/60 px-[4mm] py-[3mm] flex flex-col justify-between bg-[#FFFDFB]">
              {/* TOP LETTERHEAD TITLE: Left AstroJit Logo | Center Astrologer Details | Right Astrologer Logo */}
              <div className="border-b-2 border-[#7A1A22] pb-1.5">
                <div className="text-center text-[7.5px] font-bold text-amber-800 tracking-wider uppercase mb-0.5">
                  {invocationText}
                </div>
                <div className="flex items-center justify-between gap-2">
                  {/* Left: AstroJit Logo */}
                  <div className="w-[34mm] shrink-0 flex items-center gap-1.5 text-left">
                    <img
                      src="/astrojit-logo.webp"
                      alt="AstroJit"
                      className="w-9 h-9 object-contain shrink-0"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <div className="text-[12px] font-black tracking-tight text-[#7A1A22] leading-none">ASTROJIT</div>
                      <div className="text-[7.5px] font-bold text-stone-600 uppercase tracking-wide mt-0.5">
                        {isTa ? 'வேத ஜோதிடம்' : 'Vedic Astrology'}
                      </div>
                    </div>
                  </div>

                  {/* Center: Astrologer Details */}
                  <div className="flex-1 text-center px-1 min-w-0">
                    <div className="text-[13px] font-black text-black leading-tight truncate">
                      {astrologerTitle}
                    </div>
                    {astrologerSubTitle && (
                      <div className="text-[8.5px] font-bold text-stone-700 leading-tight mt-0.5 truncate">
                        {astrologerSubTitle}
                      </div>
                    )}
                    {astrologerAddress && (
                      <div className="text-[7.5px] text-stone-600 leading-tight mt-0.5 truncate">
                        {astrologerAddress}
                      </div>
                    )}
                    {astrologerContact && (
                      <div className="text-[7.5px] font-mono font-semibold text-stone-700 leading-tight mt-0.5 truncate">
                        {astrologerContact}
                      </div>
                    )}
                  </div>

                  {/* Right: Astrologer Logo */}
                  <div className="w-[34mm] shrink-0 flex items-center justify-end gap-1.5 text-right">
                    <div className="min-w-0">
                      <div className="text-[8px] font-black text-[#7A1A22] uppercase leading-tight truncate">
                        {user?.name || (isTa ? 'ஜோதிடர்' : 'Astrologer')}
                      </div>
                      <div className="text-[7px] font-bold text-stone-500 mt-0.5">
                        {isTa ? '1-பக்க ஜாதகம்' : 'A4 Patrika'}
                      </div>
                    </div>
                    {letterhead?.astrologerLogo ? (
                      <img
                        src={letterhead.astrologerLogo}
                        alt="Astrologer Logo"
                        className="w-9 h-9 object-contain rounded border border-amber-900/30 bg-white p-0.5 shrink-0"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <img
                        src="/astrojit-emblem.webp"
                        alt="Astrologer Emblem"
                        className="w-8 h-8 object-contain rounded border border-amber-900/20 bg-amber-50 p-0.5 shrink-0"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* NATIVE TITLE BAR */}
              <div className="bg-[#7A1A22] text-amber-50 rounded px-2.5 py-1 flex items-center justify-between text-[8.5px]">
                <div className="font-black text-[10px]">
                  {isTa ? `ஜாதகர்: ${nativeName}` : `Native: ${nativeName}`}
                </div>
                <div className="font-semibold">
                  {dob} • {dobTime} • {place} {coords}
                </div>
              </div>

              {/* 1. BIRTH & PANCHANGA VERIFICATION */}
              <div className="bg-amber-50/70 border border-amber-900/25 rounded px-2 py-1 text-[8px]">
                <div className="font-black text-[#7A1A22] text-[8.5px] mb-0.5 uppercase tracking-wide border-b border-amber-900/15 pb-0.5">
                  {isTa ? '1. ஜனன விவரம் & பஞ்சாங்கச் சுருக்கம்' : '1. Birth & Panchanga Verification'}
                </div>
                <div className="grid grid-cols-4 gap-x-2 gap-y-0.5">
                  <div><span className="text-stone-500">{isTa ? 'லக்னம்:' : 'Lagna:'}</span> <strong>{isTa ? summary.lagnaTa : summary.lagnaEn}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'ராசி:' : 'Moon Rasi:'}</span> <strong>{isTa ? summary.rasiTa : summary.rasiEn}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'நட்சத்திரம்:' : 'Nakshatra:'}</span> <strong>{isTa ? summary.nakshatraWithPadaTa : summary.nakshatraWithPadaEn}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'நட்சத்திர அதிபதி:' : 'Nakshatra Athipathi:'}</span> <strong>{moonLordDisplay}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'திதி:' : 'Tithi:'}</span> <strong>{isTa ? summary.tithiNameTa : summary.tithiNameEn}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'வாரம்:' : 'Vara:'}</span> <strong>{isTa ? summary.weekday?.ta : summary.weekday?.en}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'யோகம் / கரணம்:' : 'Yoga / Karana:'}</span> <strong>{isTa ? summary.yogaKarana?.textTa : summary.yogaKarana?.textEn}</strong></div>
                  <div><span className="text-stone-500">{isTa ? 'உதயம் / அஸ்தமனம்:' : 'Sun Rise/Set:'}</span> <strong>{sunriseTime} / {sunsetTime}</strong></div>
                </div>
              </div>

              {/* 2. RASI (D1) & NAVAMSA (D9) CHARTS + NIRAYANA PLANETARY TABLE */}
              <div className="space-y-1">
                <div className="font-black text-[#7A1A22] text-[8.5px] uppercase tracking-wide">
                  {isTa ? '2. ராசி (D1), நவாம்சம் (D9) & நிராயண கிரக நிலைகள்' : '2. Rasi (D1), Navamsa (D9) & Nirayana Planetary Positions'}
                </div>
                <div className="grid grid-cols-12 gap-2 items-start">
                  {/* Charts (Left 4 cols) */}
                  <div className="col-span-4 space-y-1.5">
                    {chartStyle === 'south' ? (
                      <>
                        <CompactSouthChart
                          title={isTa ? 'ராசி (D1)' : 'Rasi (D1)'}
                          chartBoxes={horoscope?.charts?.D1}
                          isTa={isTa}
                          lagnaRasi={lagnaRasi}
                        />
                        <CompactSouthChart
                          title={isTa ? 'நவாம்சம் (D9)' : 'Navamsa (D9)'}
                          chartBoxes={horoscope?.charts?.D9}
                          isTa={isTa}
                          lagnaRasi={planets.find(p => p.id === 'lagna')?.navamsa}
                        />
                      </>
                    ) : (
                      <>
                        <NorthIndianChartGrid
                          title={isTa ? 'ராசி (D1)' : 'Rasi (D1)'}
                          chartData={horoscope?.charts?.D1}
                          lagnaRasi={lagnaRasi}
                          isTamil={isTa}
                          compact
                        />
                        <NorthIndianChartGrid
                          title={isTa ? 'நவாம்சம் (D9)' : 'Navamsa (D9)'}
                          chartData={horoscope?.charts?.D9}
                          lagnaRasi={planets.find(p => p.id === 'lagna')?.navamsa ?? lagnaRasi}
                          isTamil={isTa}
                          compact
                        />
                      </>
                    )}
                  </div>

                  {/* Nirayana Table (Right 8 cols) */}
                  <div className="col-span-8 border border-amber-900/25 rounded overflow-hidden">
                    <table className="w-full text-[7.8px] text-left border-collapse">
                      <thead>
                        <tr className="bg-amber-900/10 text-[#7A1A22] font-bold border-b border-amber-900/20">
                          <th className="py-1 px-1.5">{isTa ? 'கிரகம்' : 'Planet'}</th>
                          <th className="py-1 px-1">{isTa ? 'பாகை' : 'Deg'}</th>
                          <th className="py-1 px-1">{isTa ? 'ராசி' : 'Sign'}</th>
                          <th className="py-1 px-1">{isTa ? 'நட்சத்திரம்' : 'Star (Pada)'}</th>
                          <th className="py-1 px-1">{isTa ? 'நட். அதிபதி' : 'Athipathi'}</th>
                          <th className="py-1 px-1">{isTa ? 'நிலை' : 'Dignity'}</th>
                          <th className="py-1 px-1 text-center">{isTa ? 'பாவம்' : 'Bhava'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {planets.map(p => {
                          const isLagna = p.id === 'lagna' || p.isLagna;
                          const isMandi = p.id === 'mandi' || p.isMandi;
                          const starObj = NAKSHATRAS[p.nakshatra] || NAKSHATRAS[0];
                          const lordEn = starObj.lord;
                          const lordText = isTa ? (NAKSHATRA_LORD_TA[lordEn] || lordEn) : lordEn;
                          const isVargottama = !isLagna && !isMandi && p.rasi === p.navamsa;
                          return (
                            <tr key={p.id} className={isLagna ? 'bg-amber-50/70 font-bold' : ''}>
                              <td className="py-0.5 px-1.5 font-bold whitespace-nowrap">
                                {isTa ? p.info.ta : p.info.en}
                                {p.isRetrograde ? (isTa ? ' (வ)' : ' (R)') : ''}
                                {isVargottama ? ' ★' : ''}
                              </td>
                              <td className="py-0.5 px-1 font-mono whitespace-nowrap">{p.degInSign}</td>
                              <td className="py-0.5 px-1 whitespace-nowrap">{isTa ? RASHIS[p.rasi]?.ta : RASHIS[p.rasi]?.en}</td>
                              <td className="py-0.5 px-1 whitespace-nowrap">
                                {isTa ? starObj.ta : starObj.en} ({p.pada})
                              </td>
                              <td className="py-0.5 px-1 whitespace-nowrap">{lordText}</td>
                              <td className="py-0.5 px-1 font-bold whitespace-nowrap">
                                <span className={
                                  p.dignityKey === 'utcha' || p.dignityKey === 'aatchi'
                                    ? 'text-emerald-700'
                                    : p.dignityKey === 'neecha' || p.dignityKey === 'pagai'
                                    ? 'text-rose-700'
                                    : 'text-stone-700'
                                }>
                                  {isLagna || isMandi ? '---' : (isTa ? p.dignityTa : p.dignityEn)}
                                </span>
                              </td>
                              <td className="py-0.5 px-1 text-center font-bold">{p.bhava}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="px-1.5 py-0.5 bg-stone-50 text-[7px] text-stone-500 border-t border-stone-200 flex justify-between">
                      <span>{isTa ? '★ வர்கோத்தமம் (ராசி = நவாம்சம்)' : '★ Vargottama (D1 Sign = D9 Sign)'}</span>
                      <span>{isTa ? `அயனாம்சம்: ${summary.ayanamshaDMS || ''}` : `Ayanamsha: ${summary.ayanamshaDMS || ''}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. DOSHA & SENSITIVITY CHECK */}
              <div className="bg-rose-50/40 border border-rose-900/20 rounded px-2 py-1 text-[8px]">
                <div className="font-black text-[#7A1A22] text-[8.5px] mb-0.5 uppercase tracking-wide flex items-center gap-1 border-b border-rose-900/10 pb-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isTa ? '3. தோஷம் & சிறப்பு ஆய்வு' : '3. Dosha & Sensitivity Check'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="font-bold text-stone-700">{isTa ? 'செவ்வாய் தோஷம்:' : 'Chevvai Dosha:'}</span>{' '}
                    <span>{chevvaiStatus}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-700">{isTa ? 'ராகு–கேது அச்சு:' : 'Rahu–Ketu Axis:'}</span>{' '}
                    <span>{sarpaStatus}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-700">{isTa ? 'சனி நிலை:' : 'Saturn Transit:'}</span>{' '}
                    <span>{isTa ? (sadeSati.titleTa || 'இயல்பான நிலை') : (sadeSati.titleEn || 'Normal')}</span>
                  </div>
                </div>
              </div>

              {/* 4. DASHA-BHUKTI & CURRENT PERIOD FORECAST */}
              <div className="bg-amber-50/50 border border-amber-900/20 rounded px-2 py-1 text-[8px]">
                <div className="font-black text-[#7A1A22] text-[8.5px] mb-0.5 uppercase tracking-wide border-b border-amber-900/15 pb-0.5">
                  {isTa ? '4. தசா–புக்தி & நடப்பு காலகட்ட பலன்' : '4. Dasha–Bhukti & Current Period Forecast'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">{isTa ? 'பிறப்பு தசை இருப்பு:' : 'Birth Dasha Balance:'}</span>{' '}
                    <strong>{isTa ? dashaBalance.textTa : dashaBalance.textEn}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">{isTa ? 'நடப்பு காலம்:' : 'Active Period:'}</span>{' '}
                    <strong>{isTa ? currentDasha.textTa : currentDasha.textEn}</strong>{' '}
                    {currentDasha.endDate ? `(${isTa ? 'முடிவு' : 'Ends'}: ${currentDasha.endDate})` : ''}
                  </div>
                </div>
                <div className="text-stone-700 mt-0.5">
                  {isTa
                    ? `தற்போதைய ${currentDasha?.mahadasha?.nameTa || ''} தசை – ${currentDasha?.bhukti?.nameTa || ''} புக்தி காலத்தில் கிரக பலத்திற்கு ஏற்ப திட்டமிட்ட முயற்சிகள் அடுத்த 12–24 மாதங்களில் முன்னேற்றம் தரும்.`
                    : `During the active ${currentDasha?.mahadasha?.nameEn || ''} Dasha – ${currentDasha?.bhukti?.nameEn || ''} Bhukti, steady planning and alignment with planetary strength bring constructive progress over the next 12–24 months.`}
                </div>
              </div>

              {/* 5. CORE LIFE PILLARS */}
              <div className="space-y-0.5">
                <div className="font-black text-[#7A1A22] text-[8.5px] uppercase tracking-wide">
                  {isTa ? '5. முக்கிய வாழ்க்கை அம்சங்கள்' : '5. Core Life Pillars'}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[7.8px] leading-snug">
                  <div className="p-1.5 rounded border border-stone-300 bg-stone-50/70">
                    <strong className="text-[#7A1A22] block">{isTa ? 'கல்வி & தொழில்' : 'Education & Career'}</strong>
                    <span>{getPlanetNote('mercury', 'கல்வி & தொழில்', 'education & career')}</span>
                  </div>
                  <div className="p-1.5 rounded border border-stone-300 bg-stone-50/70">
                    <strong className="text-[#7A1A22] block">{isTa ? 'பொருளாதாரம் & சொத்து' : 'Finance & Assets'}</strong>
                    <span>{getPlanetNote('jupiter', 'வருமானம் & சேமிப்பு', 'finance & wealth')}</span>
                  </div>
                  <div className="p-1.5 rounded border border-stone-300 bg-stone-50/70">
                    <strong className="text-[#7A1A22] block">{isTa ? 'திருமணம் & குடும்பம்' : 'Marriage & Family'}</strong>
                    <span>{getPlanetNote('venus', 'இல்லற இணக்கம்', 'marriage & family')}</span>
                  </div>
                  <div className="p-1.5 rounded border border-stone-300 bg-stone-50/70">
                    <strong className="text-[#7A1A22] block">{isTa ? 'ஆரோக்கியம் & ஆற்றல்' : 'Health & Vitality'}</strong>
                    <span>{getPlanetNote(lagnaLordId, 'உடல் நலம்', 'health & vitality')}</span>
                  </div>
                </div>
              </div>

              {/* 6. PRACTICAL REMEDIES & GUIDANCE + FOOTER */}
              <div className="space-y-1">
                <div className="bg-emerald-50/60 border border-emerald-900/20 rounded px-2 py-1 text-[7.8px] flex items-center justify-between gap-2">
                  <div>
                    <span className="font-black text-emerald-900 uppercase">
                      {isTa ? '6. பரிகாரம் & வழிகாட்டல்: ' : '6. Practical Remedies & Guidance: '}
                    </span>
                    <span className="font-bold text-stone-800">
                      {isTa ? `${remedyInfo.deityTa} (${remedyInfo.dayTa})` : `${remedyInfo.deityEn} (${remedyInfo.dayEn})`}
                    </span>{' '}
                    — <span className="text-stone-700">{isTa ? remedyInfo.tipTa : remedyInfo.tipEn}</span>
                  </div>
                  <div className="text-[7.5px] font-bold text-stone-600 whitespace-nowrap">
                    {lagnaLordPlanet ? (isTa ? `லக்னாதிபதி: ${lagnaLordPlanet.info.ta}` : `Lagna Lord: ${lagnaLordPlanet.info.en}`) : ''}
                  </div>
                </div>

                <div className="border-t border-amber-900/20 pt-0.5 flex items-center justify-between text-[7px] text-stone-500 font-semibold">
                  <span>{isTa ? 'திருக்கணித பஞ்சாங்கம் • சுபம்' : 'Thirukanitha Ephemeris • Subham'}</span>
                  <span>{astrologerTitle}</span>
                </div>
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
