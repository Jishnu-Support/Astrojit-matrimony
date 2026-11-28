import React, { useState, useMemo, useEffect } from 'react';
import {
  Printer,
  CheckSquare,
  Square,
  Monitor
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { getInitialLetterhead } from './LetterheadBrandingModal';
import {
  calculateThirukanithaHoroscope,
  NAKSHATRAS,
  NAKSHATRA_SYLLABLES_TA,
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
  { row: 1, col: 0, rasi: 10 }
];

const SIGN_NAMES = [
  { num: 1, ta: 'மேஷம்', en: 'Aries', shortTa: 'மேஷ', shortEn: 'Ari' },
  { num: 2, ta: 'ரிஷபம்', en: 'Taurus', shortTa: 'ரிஷ', shortEn: 'Tau' },
  { num: 3, ta: 'மிதுனம்', en: 'Gemini', shortTa: 'மிது', shortEn: 'Gem' },
  { num: 4, ta: 'கடகம்', en: 'Cancer', shortTa: 'கட', shortEn: 'Can' },
  { num: 5, ta: 'சிம்மம்', en: 'Leo', shortTa: 'சிம்', shortEn: 'Leo' },
  { num: 6, ta: 'கன்னி', en: 'Virgo', shortTa: 'கன்', shortEn: 'Vir' },
  { num: 7, ta: 'துலாம்', en: 'Libra', shortTa: 'துலா', shortEn: 'Lib' },
  { num: 8, ta: 'விருச்சிகம்', en: 'Scorpio', shortTa: 'விரு', shortEn: 'Sco' },
  { num: 9, ta: 'தனுசு', en: 'Sagittarius', shortTa: 'தனு', shortEn: 'Sag' },
  { num: 10, ta: 'மகரம்', en: 'Capricorn', shortTa: 'மக', shortEn: 'Cap' },
  { num: 11, ta: 'கும்பம்', en: 'Aquarius', shortTa: 'கும்', shortEn: 'Aqu' },
  { num: 12, ta: 'மீனம்', en: 'Pisces', shortTa: 'மீன', shortEn: 'Pis' }
];

const PLANET_SHORT_EN = {
  lagna: 'Asc', sun: 'Sun', moon: 'Moo', mars: 'Mar',
  mercury: 'Mer', jupiter: 'Jup', venus: 'Ven', saturn: 'Sat',
  rahu: 'Rah', ketu: 'Ket', mandi: 'Man'
};

const PLANET_SHORT_TA = {
  lagna: 'லக்', sun: 'சூரி', moon: 'சந்', mars: 'செவ்',
  mercury: 'புத', jupiter: 'குரு', venus: 'சுக்', saturn: 'சனி',
  rahu: 'ராகு', ketu: 'கேது', mandi: 'மாந்'
};

const PLANET_LORDS_TA = ['செவ்', 'சுக்', 'புத', 'சந்', 'சூரி', 'புத', 'சுக்', 'செவ்', 'குரு', 'சனி', 'சனி', 'குரு'];
const PLANET_LORDS_EN = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const NAK_LORD_TA = {
  Ketu: 'கேது', Venus: 'சுக்கிரன்', Sun: 'சூரியன்', Moon: 'சந்திரன்',
  Mars: 'செவ்வாய்', Rahu: 'ராகு', Jupiter: 'குரு', Saturn: 'சனி', Mercury: 'புதன்'
};

// All 20 Horoscope Screen View Titles mapped 1-to-1
const HOROSCOPE_20_SECTIONS = [
  { id: 1, titleEn: '1. Birth Summary Details', titleTa: '1. ஜனன விவரக் குறிப்பு' },
  { id: 2, titleEn: '2. Divisional Charts (All 20 Charts)', titleTa: '2. வர்க்கச் சக்கரங்கள் (20 சக்கரங்கள்)' },
  { id: 3, titleEn: '3. Nirayana Planetary Positions Table', titleTa: '3. கிரக நிலைகள் அட்டவணை (நிராயண)' },
  { id: 4, titleEn: '4. Vimshottari Dasha & All 81 Bhuktis', titleTa: '4. விம்சோத்தரி திசா & 81 புக்திகள்' },
  { id: 5, titleEn: '5. Sripati Bhava Sphutam & Shifts', titleTa: '5. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு' },
  { id: 6, titleEn: '6. Shadbala & Complete Bhava Bala', titleTa: '6. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு' },
  { id: 7, titleEn: '7. Planetary Dasavarga & Dignity Matrix', titleTa: '7. கிரகங்களின் தசவர்க்கமும் பலமும்' },
  { id: 8, titleEn: '8. Ashtakavarga, SAV & Shodhya Pindas', titleTa: '8. அஷ்டகவர்க்கம், சர்வாஷ்டகவர்க்கம் & பிண்டம்' },
  { id: 9, titleEn: '9. Real-Time Gocharam (Transit) Analysis', titleTa: '9. கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)' },
  { id: 10, titleEn: '10. Planetary Hora (Orai) Analysis', titleTa: '10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்' },
  { id: 11, titleEn: '11. Upagrahas - Gulikadi & Dhumadi', titleTa: '11. உபகிரகங்கள் - குளிகாதி ஐவர் & தூமாதி' },
  { id: 12, titleEn: '12. Special Sphutas & Karmic Points', titleTa: '12. முக்கிய ஸ்புடங்கள் & கர்ம புள்ளிகள்' },
  { id: 13, titleEn: '13. Planetary Friendships & Avasthas', titleTa: '13. நைசர்கிக, தற்கால, பஞ்சதா நட்பு & அவஸ்தைகள்' },
  { id: 14, titleEn: '14. Graha & Bhava Aspect Angles', titleTa: '14. கிரக & பாவக பார்வை கோணங்கள்' },
  { id: 15, titleEn: '15. Pancha Pakshi & Weekly Timings', titleTa: '15. பஞ்ச பட்சி விபரம் & வார அட்டவணை' },
  { id: 16, titleEn: '16. Mahadasha Roles & 9 Tara Balas', titleTa: '16. மகாதசை போதகங்கள் & தாரா பலம்' },
  { id: 17, titleEn: '17. Dignities, Aspects & Conjunctions', titleTa: '17. கிரகங்களின் நிலை, பார்வை & சேர்க்கை' },
  { id: 18, titleEn: '18. Astro-Numerology (Chaldean System)', titleTa: '18. எண் கணிதம் (நியூமராலஜி)' },
  { id: 19, titleEn: '19. Jathaga Yogas (All 16 Combinations)', titleTa: '19. ஜாதக யோகங்கள் (16 யோகங்கள்)' },
  { id: 20, titleEn: '20. Vimshottari Maha Dashas & Significations', titleTa: '20. விம்சோத்தரி மகாதிசைகள் & பலன்கள்' }
];

// Compact South Indian Chart for Half-A4 Booklet
function A5SouthChart({ title, chartData, lagnaRasi, isTa, sizeClass = 'h-[40mm]', compact = false }) {
  return (
    <div className={`border border-[#7A1A22] bg-white flex flex-col rounded-[2px] overflow-hidden ${sizeClass}`}>
      <div className={`bg-[#7A1A22] text-amber-100 font-bold text-center tracking-wide uppercase truncate px-1.5 ${compact ? 'text-[8.5px] py-[2px]' : 'text-[12px] py-[3px]'}`}>
        {title}
      </div>
      <div className="grid grid-cols-4 grid-rows-4 flex-1 relative">
        {SOUTH_INDIAN_CELLS.map((cell) => {
          const rawCell = Array.isArray(chartData)
            ? chartData.find(c => c.rasi === cell.rasi) || chartData[cell.rasi]
            : chartData?.[cell.rasi];
          const items = Array.isArray(rawCell)
            ? rawCell
            : Array.isArray(rawCell?.occupants)
              ? rawCell.occupants
              : [];
          const isLagna = cell.rasi === lagnaRasi;
          const sign = SIGN_NAMES[cell.rasi];
          return (
            <div
              key={cell.rasi}
              style={{ gridRowStart: cell.row + 1, gridColumnStart: cell.col + 1 }}
              className={`border border-stone-300 ${compact ? 'p-0.5' : 'p-1'} flex flex-col justify-between overflow-hidden ${
                isLagna ? 'bg-amber-50/90' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center leading-none">
                <span className={`${compact ? 'text-[6.5px]' : 'text-[9px]'} text-stone-400 font-semibold`}>
                  {isTa ? sign?.shortTa : sign?.shortEn}
                </span>
                {isLagna && (
                  <span className={`${compact ? 'text-[6.5px]' : 'text-[9px]'} font-black text-[#7A1A22]`}>
                    {isTa ? 'லக்' : 'Asc'}
                  </span>
                )}
              </div>
              <div className={`flex flex-wrap gap-x-1 leading-[1.12] items-center justify-center my-auto`}>
                {items.map((item, idx) => {
                  const id = typeof item === 'string' ? item : item?.id;
                  if (id === 'lagna') return null;
                  const lbl = isTa
                    ? (PLANET_SHORT_TA[id] || item?.shortTa || item?.labelTa || id)
                    : (PLANET_SHORT_EN[id] || item?.shortEn || item?.labelEn || id);
                  const isRetro = item?.isRetrograde;
                  return (
                    <span
                      key={idx}
                      className={`${compact ? 'text-[8px]' : 'text-[11.8px]'} font-bold ${
                        id === 'moon' ? 'text-indigo-800' : 'text-stone-900'
                      }`}
                    >
                      {lbl}{isRetro ? '(R)' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* Center Box */}
        <div
          style={{ gridRowStart: 2, gridRowEnd: 4, gridColumnStart: 2, gridColumnEnd: 4 }}
          className="relative overflow-hidden border border-stone-300 bg-[#FDF9F0] flex flex-col items-center justify-center p-1 text-center"
        >
          <img
            src="/sri-yantra-center.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 m-auto w-[84%] h-[84%] object-contain opacity-[0.14]"
          />
          <span className={`relative z-10 ${compact ? 'text-[8.5px]' : 'text-[13px]'} font-black text-[#7A1A22] leading-tight`}>{title}</span>
          {typeof lagnaRasi === 'number' && (
            <span className={`relative z-10 ${compact ? 'text-[7px]' : 'text-[10.5px]'} text-stone-600 font-semibold mt-0.5`}>
              {isTa ? SIGN_NAMES[lagnaRasi]?.ta : SIGN_NAMES[lagnaRasi]?.en}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Professional Print Section Header Banner
function A5SectionBanner({ num, titleEn, titleTa, badge, isTa }) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#6E141B] via-[#831D25] to-[#9B2630] text-amber-50 px-2.5 py-1 rounded-[2px] mb-1.5 shrink-0 border-b border-amber-400">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="px-1.5 py-[1px] rounded bg-amber-300 text-[#5C1017] text-[10.5px] font-black flex items-center justify-center shrink-0">
          {String(num).padStart(2, '0')}
        </span>
        <span className="text-[12px] font-extrabold tracking-wide truncate uppercase">
          {isTa ? titleTa : titleEn}
        </span>
      </div>
      {badge && (
        <span className="text-[9.2px] font-bold bg-black/20 border border-amber-200/40 px-1.5 py-[1px] rounded text-amber-100 shrink-0 ml-1">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function HoroscopeMultiPagePrint({
  birthData,
  onSwitchToScreen,
  onSwitchToOnePage
}) {
  const { lang } = useLang();
  const isTa = lang === 'ta';
  const { user } = useAuth();

  const [letterhead, setLetterhead] = useState(() => getInitialLetterhead(user, isTa));
  const [chartStyle, setChartStyle] = useState(() => birthData?.chartStyle || 'south');
  const [selectedIds, setSelectedIds] = useState(() => HOROSCOPE_20_SECTIONS.map(s => s.id));

  useEffect(() => {
    setLetterhead(getInitialLetterhead(user, isTa));
    const onUpdated = () => setLetterhead(getInitialLetterhead(user, isTa));
    window.addEventListener('astrojit-letterhead-updated', onUpdated);
    return () => window.removeEventListener('astrojit-letterhead-updated', onUpdated);
  }, [user, isTa]);

  useEffect(() => {
    if (birthData?.chartStyle) setChartStyle(birthData.chartStyle);
  }, [birthData?.chartStyle]);

  const horoscope = useMemo(() => {
    return calculateThirukanithaHoroscope(birthData || {});
  }, [birthData]);

  // Letterhead Branding
  const astrologerTitle =
    letterhead?.line1 ||
    user?.astrologerName ||
    user?.name ||
    (isTa ? 'ஸ்ரீ ஜிஷ்ணு ஜோதிடம் & வாஸ்து ஆராய்ச்சி மையம்' : 'ASTROJIT VEDIC ASTROLOGY CENTRE');
  const rawLine2 = letterhead?.line2 || '';
  const isGenericSubtitle = rawLine2 === 'Authentic Vedic Natal Horoscope Dossier';
  const astrologerSubTitle = (!isGenericSubtitle && rawLine2)
    ? rawLine2
    : (user?.name ? `${isTa ? 'ஜோதிடர்' : 'Astrologer'}: ${user.name}` : '');
  const astrologerAddress = [letterhead?.address1, letterhead?.address2].filter(Boolean).join(' • ');
  const astrologerContact = letterhead?.phoneEmail || [user?.phone, user?.email].filter(Boolean).join(' | ');
  const invocationText = letterhead?.invocation !== undefined
    ? letterhead.invocation
    : (isTa ? '|| ஸ்ரீ கணேசாய நமஹ ||' : '|| OM SRI GANESHAYA NAMAHA ||');

  const summary = horoscope?.summary || {};
  const nativeName = birthData?.name || summary?.name || '---';
  const dobDisplay = useMemo(() => {
    const raw = birthData?.dob || summary?.dob || '';
    if (!raw) return '---';
    const parts = raw.split(/[-/.]/);
    return parts.length === 3 && parts[0].length === 4 ? `${parts[2]}-${parts[1]}-${parts[0]}` : raw;
  }, [birthData?.dob, summary?.dob]);

  const printedDateTime = useMemo(() => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  }, []);

  const handlePrint = () => {
    const safeName = (nativeName || 'Horoscope').replace(/\s+/g, '_');
    printElementById('astrojit-horoscope-multipage', `${safeName}_HalfA4_Booklet`, {
      pageSize: 'A4 portrait',
      pageMargin: '4mm'
    });
  };

  const toggleSection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedIds(HOROSCOPE_20_SECTIONS.map(s => s.id));
  const selectCore = () => setSelectedIds([1, 2, 3, 4, 6, 8, 9, 18, 19]);
  const clearAll = () => setSelectedIds([]);

  // Helper to convert arrays or keyed objects into arrays
  const toArr = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []).filter(Boolean);

  // Build Complete Professional A5 Booklet Pages covering ALL 20 Screen View Sections
  const generatedPages = useMemo(() => {
    const pages = [];
    const has = (id) => selectedIds.includes(id);
    const planets = horoscope?.planets || [];
    const lagnaRasi = summary?.lagnaRasi ?? 0;
    const charts = horoscope?.charts || {};
    const dashaTable = horoscope?.dashaTable || [];
    const curDasha = summary?.currentDashaToday || {};
    const dashaBal = summary?.dashaBalance || {};

    const renderChart = (title, key, lRasi, sizeClass = 'h-[92mm]', compact = false) => {
      if (chartStyle === 'north') {
        return (
          <div className={`flex flex-col justify-center overflow-hidden ${sizeClass}`}>
            <NorthIndianChartGrid
              centerTitle={title}
              centerSub={typeof lRasi === 'number' ? (isTa ? SIGN_NAMES[lRasi]?.ta : SIGN_NAMES[lRasi]?.en) : ''}
              chartData={charts[key]}
              lagnaRasi={lRasi}
              isTamil={isTa}
              isPrint={true}
            />
          </div>
        );
      }
      return <A5SouthChart title={title} chartData={charts[key]} lagnaRasi={lRasi} isTa={isTa} sizeClass={sizeClass} compact={compact} />;
    };

    // =========================================================================
    // SECTION 1: COVER + COMPLETE BIRTH SUMMARY DETAILS
    // =========================================================================
    if (has(1)) {
      const lagnaRoles = summary?.lagnaRoles || {};
      const fourRoles = summary?.grahaFourRoles || {};
      const yogi = summary?.yogiAvayogi || {};
      const latNum = birthData?.lat !== undefined ? Number(birthData.lat) : null;
      const lonNum = birthData?.lon !== undefined ? Number(birthData.lon) : null;
      const latLonStr = (latNum !== null && !isNaN(latNum) && lonNum !== null && !isNaN(lonNum))
        ? `${Math.abs(latNum).toFixed(4)}°${latNum >= 0 ? 'N' : 'S'}, ${Math.abs(lonNum).toFixed(4)}°${lonNum >= 0 ? 'E' : 'W'}`
        : '---';

      const isFemale = (birthData?.gender || '').toLowerCase() === 'female' || (birthData?.gender || '').includes('பெண்');
      const genderStr = birthData?.gender ? (isTa ? (isFemale ? 'பெண்' : 'ஆண்') : (isFemale ? 'Female' : 'Male')) : '---';
      const fatherStr = birthData?.fatherName || birthData?.father || '---';
      const motherStr = birthData?.motherName || birthData?.mother || '---';
      const lagnaDegSuffix = summary?.lagnaDegInSign ? ` ${summary.lagnaDegInSign}` : '';

      const birthRows = [
        [isTa ? 'பெயர் / பாலினம்' : 'Name / Gender', `${nativeName} (${genderStr}${summary?.age?.years !== undefined ? `, ${summary.age.years} ${isTa ? 'வயது' : 'Yrs'}` : ''})`],
        [isTa ? 'தந்தை / தாய் பெயர்' : 'Father / Mother', `${fatherStr} / ${motherStr}`],
        [isTa ? 'பிறந்த தேதி & நேரம்' : 'Birth Date & Time', `${dobDisplay} • ${birthData?.dobTime12 || birthData?.dobTime || '---'}`],
        [isTa ? 'பிறந்த ஊர் & அட்சரேகை' : 'Place & Coordinates', `${birthData?.placeName || birthData?.city || '---'} (${latLonStr})`],
        [isTa ? 'தமிழ் தேதி / கிழமை' : 'Tamil Date / Weekday', `${isTa ? (summary?.tamilDate?.textTa || summary?.tamilDate?.ta || '---') : (summary?.tamilDate?.textEn || summary?.tamilDate?.en || '---')} • ${isTa ? (summary?.weekday?.ta || '---') : (summary?.weekday?.en || '---')}`],
        [isTa ? 'அயனாம்சம் (லஹரி)' : 'Ayanamsha (Lahiri)', `${summary?.ayanamshaDMS || '---'} | ${isTa ? (summary?.ayanam?.ta || '---') : (summary?.ayanam?.en || '---')}`],
        [isTa ? 'ஜன்ம லக்னம் & அதிபதி' : 'Janma Lagna & Lord', `${isTa ? (summary?.lagnaTa || '---') : (summary?.lagnaEn || '---')}${lagnaDegSuffix} (${isTa ? (lagnaRoles?.lordTa || '---') : (lagnaRoles?.lordEn || '---')})`],
        [isTa ? 'ஜன்ம ராசி & நட்சத்திரம்' : 'Rasi & Nakshatra', `${isTa ? (summary?.moonSignTa || '---') : (summary?.moonSignEn || '---')} • ${isTa ? (summary?.nakshatraTa || '---') : (summary?.nakshatraEn || '---')} (${isTa ? 'பாதம்' : 'Pd'} ${summary?.moonPada || 1})`],
        [isTa ? 'திதி / பக்ஷம்' : 'Tithi & Paksha', `${isTa ? (summary?.tithiNameTa || '---') : (summary?.tithiNameEn || '---')} (${(summary?.tithiNum || 1) <= 15 ? (isTa ? 'வளர்பிறை' : 'Shukla') : (isTa ? 'தேய்பிறை' : 'Krishna')})`],
        [isTa ? 'நித்திய யோகம் / கரணம்' : 'Yoga & Karana', `${isTa ? (summary?.yogaKarana?.yogaTa || '---') : (summary?.yogaKarana?.yogaEn || '---')} / ${isTa ? (summary?.yogaKarana?.karanaTa || '---') : (summary?.yogaKarana?.karanaEn || '---')}`],
        [isTa ? 'ஹோரை / சூரிய உதயம்-அஸ்தமனம்' : 'Hora & Sun Rise/Set', `${isTa ? (summary?.nakshatraHora?.horaTa || '---') : (summary?.nakshatraHora?.horaEn || '---')} (${horoscope?.orai?.birthSunriseSunset?.sunriseFormatted || '--'} – ${horoscope?.orai?.birthSunriseSunset?.sunsetFormatted || '--'})`],
        [isTa ? 'வக்ர கிரகங்கள்' : 'Retrograde Planets', isTa ? (summary?.vakraNamesTa || 'இல்லை') : (summary?.vakraNamesEn || 'None')],
        [isTa ? 'யோகி / அவயோகி / சகயோகி' : 'Yogi / Avayogi', `${isTa ? `${yogi?.yogiTa || '---'} / ${yogi?.avayogiTa || '---'}` : `${yogi?.yogiEn || '---'} / ${yogi?.avayogiEn || '---'}`}`],
        [isTa ? 'லக்ன சுபர்கள் / அசுபர்கள்' : 'Benefics / Malefics', `${isTa ? (lagnaRoles?.subharTa || '---') : (lagnaRoles?.subharEn || '---')} | ${isTa ? (lagnaRoles?.asubharTa || '---') : (lagnaRoles?.asubharEn || '---')}`],
        [isTa ? 'பாக்கிய / பாதகாதிபதி' : 'Bhagya / Badhaka Lord', `${isTa ? (lagnaRoles?.bhagyaTa || '---') : (lagnaRoles?.bhagyaEn || '---')} / ${isTa ? (lagnaRoles?.badhakaTa || '---') : (lagnaRoles?.badhakaEn || '---')}`],
        [isTa ? 'போதகர் / வேதகர்' : 'Bhodhagar / Vedhagar', `${isTa ? (fourRoles?.bhodhagarTa || '---') : (fourRoles?.bhodhagarEn || '---')} / ${isTa ? (fourRoles?.vedhagarTa || '---') : (fourRoles?.vedhagarEn || '---')}`],
        [isTa ? 'பாசகர் / காரகர்' : 'Pasagar / Karagar', `${isTa ? (fourRoles?.pasagarTa || '---') : (fourRoles?.pasagarEn || '---')} / ${isTa ? (fourRoles?.karagarTa || '---') : (fourRoles?.karagarEn || '---')}`],
        [isTa ? 'ஜனன தசை இருப்பு' : 'Birth Dasha Balance', isTa ? (dashaBal?.textTa || '---') : (dashaBal?.textEn || '---')]
      ];

      pages.push({
        key: 'sec-1',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            {/* Cover Letterhead */}
            <div className="border-b-2 border-[#7A1A22] pb-1 mb-1 shrink-0">
              <div className="text-center text-[9px] font-bold text-amber-800 tracking-widest uppercase">
                {invocationText}
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <img src="/astrojit-logo.webp" alt="AstroJit" className="h-10 w-auto object-contain shrink-0" onError={e => { e.target.style.display = 'none'; }} />
                <div className="text-center flex-1 min-w-0">
                  <div className="text-[14px] font-black text-[#7A1A22] leading-tight">{astrologerTitle}</div>
                  {astrologerSubTitle && <div className="text-[10.5px] font-bold text-stone-800">{astrologerSubTitle}</div>}
                  {astrologerAddress && <div className="text-[8.8px] text-stone-600 truncate">{astrologerAddress}</div>}
                  {astrologerContact && <div className="text-[8.8px] font-mono text-stone-700 truncate">{astrologerContact}</div>}
                </div>
                {(letterhead?.astrologerLogo || user?.pagerHeader?.astrologerLogo) && (
                  <img
                    src={letterhead?.astrologerLogo || user?.pagerHeader?.astrologerLogo}
                    alt="Logo"
                    className="h-10 w-auto object-contain rounded border border-amber-300 bg-white p-0.5 shrink-0"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>
            </div>

            <A5SectionBanner num="1" titleEn="Birth Summary & Panchangam" titleTa="ஜனன விவரக் குறிப்பு & பஞ்சாங்கம்" badge={isTa ? 'திருக்கணிதம்' : 'VEDIC DOSSIER'} isTa={isTa} />

            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <div className="grid grid-cols-2 divide-x divide-stone-300 h-full">
                {[birthRows.slice(0, 9), birthRows.slice(9)].map((colRows, colIdx) => (
                  <table key={colIdx} className="w-full border-collapse text-[9.2px]">
                    <tbody className="divide-y divide-stone-200">
                      {colRows.map(([lbl, val], idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FDFBF7]' : 'bg-white'}>
                          <td className="py-[2.2px] px-1.5 font-bold text-[#7A1A22] w-[42%] border-r border-stone-200">{lbl}</td>
                          <td className="py-[2.2px] px-1.5 font-semibold text-stone-900">{val || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 2: ALL DIVISIONAL & SPECIAL CHARTS (2 CHARTS PER HALF-A4 PAGE)
    // =========================================================================
    if (has(2)) {
      const navLagna = planets.find(p => p.id === 'lagna')?.navamsa ?? lagnaRasi;
      const chartPairs = [
        {
          key: 'sec-2a',
          sub: isTa ? 'ராசி (D1) & நவாம்சம் (D9)' : 'Rasi (D1) & Navamsa (D9)',
          list: [
            [isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)', 'D1', lagnaRasi],
            [isTa ? 'நவாம்ச கட்டம் (D9)' : 'Navamsa (D9)', 'D9', navLagna]
          ]
        },
        {
          key: 'sec-2b',
          sub: isTa ? 'பாவக கட்டம் & ஓரை சக்கரம் (D2)' : 'Bhava Chart & Hora Chart (D2)',
          list: [
            [isTa ? 'பாவக கட்டம்' : 'Bhava Chart', 'Bhava', lagnaRasi],
            [isTa ? 'ஓரை சக்கரம் (D2)' : 'Hora Chart (D2)', 'D2', lagnaRasi]
          ]
        },
        {
          key: 'sec-2c',
          sub: isTa ? 'திரேக்காணம் (D3) & சதுர்த்தாம்சம் (D4)' : 'Drekkana (D3) & Chaturthamsa (D4)',
          list: [
            [isTa ? 'திரேக்காணம் (D3)' : 'Drekkana (D3)', 'D3', lagnaRasi],
            [isTa ? 'சதுர்த்தாம்சம் (D4)' : 'Chaturthamsa (D4)', 'D4', lagnaRasi]
          ]
        },
        {
          key: 'sec-2d',
          sub: isTa ? 'ஷஷ்டாம்சம் (D6) & சப்தாம்சம் (D7)' : 'Shashtamsa (D6) & Saptamsa (D7)',
          list: [
            [isTa ? 'ஷஷ்டாம்சம் (D6)' : 'Shashtamsa (D6)', 'D6', lagnaRasi],
            [isTa ? 'சப்தாம்சம் (D7)' : 'Saptamsa (D7)', 'D7', lagnaRasi]
          ]
        },
        {
          key: 'sec-2e',
          sub: isTa ? 'அஷ்டாம்சம் (D8) & தசாம்சம் (D10)' : 'Ashtamsa (D8) & Dasamsa (D10)',
          list: [
            [isTa ? 'அஷ்டாம்சம் (D8)' : 'Ashtamsa (D8)', 'D8', lagnaRasi],
            [isTa ? 'தசாம்சம் (D10)' : 'Dasamsa (D10)', 'D10', lagnaRasi]
          ]
        },
        {
          key: 'sec-2f',
          sub: isTa ? 'துவாதசாம்சம் (D12) & ஷோடசாம்சம் (D16)' : 'Dwadasamsa (D12) & Shodasamsa (D16)',
          list: [
            [isTa ? 'துவாதசாம்சம் (D12)' : 'Dwadasamsa (D12)', 'D12', lagnaRasi],
            [isTa ? 'ஷோடசாம்சம் (D16)' : 'Shodasamsa (D16)', 'D16', lagnaRasi]
          ]
        },
        {
          key: 'sec-2g',
          sub: isTa ? 'விம்சாம்சம் (D20) & சதுர்விம்சாம்சம் (D24)' : 'Vimsamsa (D20) & Chaturvimsamsa (D24)',
          list: [
            [isTa ? 'விம்சாம்சம் (D20)' : 'Vimsamsa (D20)', 'D20', lagnaRasi],
            [isTa ? 'சதுர்விம்சாம்சம் (D24)' : 'Chaturvimsamsa (D24)', 'D24', lagnaRasi]
          ]
        },
        {
          key: 'sec-2h',
          sub: isTa ? 'பாம்சம் (D27) & திரிம்சாம்சம் (D30)' : 'Bhamsa (D27) & Trimsamsa (D30)',
          list: [
            [isTa ? 'பாம்சம் (D27)' : 'Bhamsa (D27)', 'D27', lagnaRasi],
            [isTa ? 'திரிம்சாம்சம் (D30)' : 'Trimsamsa (D30)', 'D30', lagnaRasi]
          ]
        },
        {
          key: 'sec-2i',
          sub: isTa ? 'கவேதாம்சம் (D40) & அக்ஷவேதாம்சம் (D45)' : 'Khavedamsa (D40) & Akshavedamsa (D45)',
          list: [
            [isTa ? 'கவேதாம்சம் (D40)' : 'Khavedamsa (D40)', 'D40', lagnaRasi],
            [isTa ? 'அக்ஷவேதாம்சம் (D45)' : 'Akshavedamsa (D45)', 'D45', lagnaRasi]
          ]
        },
        {
          key: 'sec-2j',
          sub: isTa ? 'ஷஷ்டியாம்சம் (D60) & கோச்சார சக்கரம்' : 'Shashtiamsa (D60) & Gocharam Transit',
          list: [
            [isTa ? 'ஷஷ்டியாம்சம் (D60)' : 'Shashtiamsa (D60)', 'D60', lagnaRasi],
            [isTa ? 'கோச்சார சக்கரம்' : 'Gocharam Transit', 'Gocharam', horoscope?.gocharam?.birthMoonRasi ?? lagnaRasi]
          ]
        }
      ];

      const totalChartPages = chartPairs.length + 1;
      chartPairs.forEach((cp, idx) => {
        pages.push({
          key: cp.key,
          render: () => (
            <div className="h-full flex flex-col justify-between">
              <A5SectionBanner num="2" titleEn={cp.sub} titleTa={cp.sub} badge={`${idx + 1}/${totalChartPages}`} isTa={isTa} />
              <div className="grid grid-cols-2 gap-3 flex-1 items-center px-1">
                {cp.list.map(([t, k, lr], i) => (
                  <React.Fragment key={i}>{renderChart(t, k, lr, 'h-[94mm]', false)}</React.Fragment>
                ))}
              </div>
              <div className="text-[8.8px] text-stone-600 text-center border-t border-stone-200 pt-0.5 shrink-0">
                {isTa ? 'பராசர திருக்கணித வர்க்கச் சக்கரங்கள் • லஹரி அயனாம்சம்' : 'Parashari Thirukanitha Divisional Vargas • Lahiri Ayanamsha'}
              </div>
            </div>
          )
        });
      });

      // Last chart page: Upagrahas Chart + Ashtakavarga SAV 337 Rasi Grid Chart (2 charts)
      const avSavPts = horoscope?.ashtakavarga?.savPoints || [];
      pages.push({
        key: 'sec-2k',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <A5SectionBanner num="2" titleEn="Upagrahas & Sarvashtakavarga Rasi Charts" titleTa="உபகிரக & சர்வாஷ்டகவர்க்க சக்கரங்கள்" badge={`${totalChartPages}/${totalChartPages}`} isTa={isTa} />
            <div className="grid grid-cols-2 gap-3 items-center flex-1 px-1">
              {renderChart(isTa ? 'உபகிரக சக்கரம்' : 'Upagrahas Chart', 'Upagrahas', lagnaRasi, 'h-[80mm]', false)}
              {/* Sarvashtakavarga 12-House Rasi Bindu Chart */}
              <div className="border border-[#7A1A22] bg-white flex flex-col rounded-[2px] overflow-hidden h-[80mm]">
                <div className="bg-[#7A1A22] text-amber-100 text-[12px] font-bold text-center py-[3px] tracking-wide uppercase">
                  {isTa ? 'சர்வாஷ்டகவர்க்கம் (SAV 337)' : 'Sarvashtakavarga (SAV 337)'}
                </div>
                <div className="grid grid-cols-4 grid-rows-4 flex-1 relative">
                  {SOUTH_INDIAN_CELLS.map((cell) => {
                    const pts = avSavPts[cell.rasi] ?? '-';
                    const isLagna = cell.rasi === lagnaRasi;
                    const sign = SIGN_NAMES[cell.rasi];
                    return (
                      <div
                        key={cell.rasi}
                        style={{ gridRowStart: cell.row + 1, gridColumnStart: cell.col + 1 }}
                        className={`border border-stone-300 p-1 flex flex-col justify-between items-center ${isLagna ? 'bg-amber-50' : 'bg-white'}`}
                      >
                        <span className="text-[9px] text-stone-500 self-start">{isTa ? sign?.shortTa : sign?.shortEn}</span>
                        <span className={`text-[17px] font-black my-auto ${Number(pts) >= 28 ? 'text-emerald-700' : 'text-[#7A1A22]'}`}>{pts}</span>
                      </div>
                    );
                  })}
                  <div
                    style={{ gridRowStart: 2, gridRowEnd: 4, gridColumnStart: 2, gridColumnEnd: 4 }}
                    className="border border-stone-300 bg-[#FDF9F0] flex flex-col items-center justify-center p-1 text-center"
                  >
                    <span className="text-[12.5px] font-black text-[#7A1A22]">SAV</span>
                    <span className="text-[18px] font-black text-amber-800">{horoscope?.ashtakavarga?.grandTotal || 337}</span>
                    <span className="text-[9.5px] text-stone-600">{isTa ? 'மொத்த பரல்கள்' : 'Total Bindus'}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Karakatva Guide */}
            <div className="border border-amber-300 bg-[#FAF3E0]/70 px-2 py-1 rounded-sm text-[8.5px] leading-snug text-stone-800 shrink-0 mt-1">
              <strong className="text-[#7A1A22]">{isTa ? 'வர்க்க காரகத்துவம்: ' : 'Divisional Key: '}</strong>
              D1: {isTa ? 'உடல்' : 'Body'} &bull; D2: {isTa ? 'தனம்' : 'Wealth'} &bull; D3: {isTa ? 'சகோதரம்' : 'Siblings'} &bull; D4: {isTa ? 'சொத்து' : 'Property'} &bull; D7: {isTa ? 'புத்திரம்' : 'Progeny'} &bull; D9: {isTa ? 'களத்திரம்' : 'Spouse'} &bull; D10: {isTa ? 'தொழில்' : 'Career'} &bull; D12: {isTa ? 'பெற்றோர்' : 'Parents'} &bull; D24: {isTa ? 'கல்வி' : 'Education'} &bull; D30: {isTa ? 'அரிஷ்டம்' : 'Evils'} &bull; D60: {isTa ? 'பூர்வ புண்ணியம்' : 'Karma'}
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 3: NIRAYANA PLANETARY POSITIONS TABLE (ALL PLANETS)
    // =========================================================================
    if (has(3)) {
      pages.push({
        key: 'sec-3',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="3" titleEn="Nirayana Planetary Positions" titleTa="நிராயண கிரக நிலைகள் அட்டவணை" badge={`Lahiri ${summary?.ayanamshaDMS || ''}`} isTa={isTa} />
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                    <th className="py-1 px-1">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-1 px-1">{isTa ? 'நிராயண பாகை' : 'Longitude'}</th>
                    <th className="py-1 px-1">{isTa ? 'நட்சத்திரம் (பா)' : 'Nakshatra (Pd)'}</th>
                    <th className="py-1 px-1">{isTa ? 'ராசி & பாகை' : 'Rasi & Deg'}</th>
                    <th className="py-1 px-1 text-center">D9 / {isTa ? 'பா' : 'Bh'}</th>
                    <th className="py-1 px-1">{isTa ? 'நிலை' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {planets.map((p, idx) => {
                    const nakObj = NAKSHATRAS[p.nakshatra];
                    const rasiObj = SIGN_NAMES[p.rasi];
                    const navObj = SIGN_NAMES[p.navamsa];
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-1 px-1 font-bold text-[#7A1A22]">
                          {isTa ? (p.info?.ta || '---') : (p.info?.en || '---')}{p.isRetrograde ? (isTa ? ' (வ)' : ' (R)') : ''}
                        </td>
                        <td className="py-1 px-1 font-mono text-[9px]">{p.dms || '---'}</td>
                        <td className="py-1 px-1">
                          <span className="font-semibold">{isTa ? (nakObj?.ta || '---') : (nakObj?.en || '---')}</span> ({p.pada || 1})
                          <span className="text-[8.6px] text-stone-500 block">{isTa ? (NAK_LORD_TA[nakObj?.lord] || nakObj?.lord || '---') : (nakObj?.lord || '---')}</span>
                        </td>
                        <td className="py-1 px-1">
                          <span className="font-semibold">{isTa ? (rasiObj?.ta || '---') : (rasiObj?.en || '---')}</span>
                          <span className="font-mono text-[8.6px] text-stone-600 block">{p.degInSign || ''}</span>
                        </td>
                        <td className="py-1 px-1 text-center text-[9px]">
                          {isTa ? (navObj?.shortTa || '-') : (navObj?.shortEn || '-')} / {p.bhava || 1}
                        </td>
                        <td className="py-1 px-1 text-[9px] font-semibold">{isTa ? (p.dignityTa || '---') : (p.dignityEn || '---')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 4: VIMSHOTTARI DASHA & ALL 81 BHUKTIS (3 A5 PAGES - ZERO SLICE!)
    // =========================================================================
    if (has(4)) {
      const chunks = [
        { key: 'sec-4a', range: [0, 3], label: '1/3' },
        { key: 'sec-4b', range: [3, 6], label: '2/3' },
        { key: 'sec-4c', range: [6, 9], label: '3/3' }
      ];
      chunks.forEach((ch, idx) => {
        const subDashas = dashaTable.slice(ch.range[0], ch.range[1]);
        if (subDashas.length === 0) return;
        pages.push({
          key: ch.key,
          render: () => (
            <div className="h-full flex flex-col justify-between">
              <div className="flex flex-col flex-1 min-h-0">
                <A5SectionBanner num="4" titleEn="Vimshottari Dasha & All Bhuktis (120 Years)" titleTa="விம்சோத்தரி திசா & புக்திகள் (120 ஆண்டுகள்)" badge={ch.label} isTa={isTa} />
                {idx === 0 && (
                  <div className="grid grid-cols-12 gap-1.5 mb-1 shrink-0">
                    <div className="col-span-5 grid grid-cols-3 gap-1 text-[8.8px] bg-[#FAF3E0] border border-amber-300 p-1 rounded-sm">
                      <div>
                        <span className="text-stone-500 text-[7.6px] block">{isTa ? 'நடப்பு தசை' : 'Mahadasha'}</span>
                        <strong className="text-[#7A1A22]">{isTa ? curDasha?.mahadasha?.nameTa : curDasha?.mahadasha?.nameEn}</strong>
                        <span className="text-[7.6px] text-stone-600 block">({curDasha?.dashaDaysRemaining ?? curDasha?.daysRemaining ?? '-'} {isTa ? 'நா' : 'd'})</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[7.6px] block">{isTa ? 'நடப்பு புக்தி' : 'Bhukti'}</span>
                        <strong className="text-[#7A1A22]">{isTa ? curDasha?.bhukti?.nameTa : curDasha?.bhukti?.nameEn}</strong>
                        <span className="text-[7.5px] text-stone-600 block">{curDasha?.startDate} → {curDasha?.endDate}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 text-[7.6px] block">{isTa ? 'அந்தரம்' : 'Antara'}</span>
                        <strong className="text-[#7A1A22]">{isTa ? curDasha?.antara?.nameTa : curDasha?.antara?.nameEn}</strong>
                        <span className="text-[7.5px] text-stone-600 block">{curDasha?.antaraStartDate} → {curDasha?.antaraEndDate}</span>
                      </div>
                    </div>
                    {(() => {
                      const activeMd = dashaTable.find(m => m.isOngoingToday);
                      const activeBh = activeMd?.bhuktis?.find(b => b.isOngoingToday);
                      const antaras = activeBh?.antaras || [];
                      if (!antaras.length) return null;
                      return (
                        <div className="col-span-7 border border-amber-300 bg-[#FDFBF7] rounded-sm overflow-hidden">
                          <div className="bg-amber-100/80 px-1.5 py-[1px] text-[8px] font-black text-[#7A1A22]">
                            {isTa ? `நடப்பு ${activeBh.bhuktiLord?.nameTa || ''} புக்தியின் 9 அந்தரங்கள்` : `Active ${activeBh.bhuktiLord?.nameEn || ''} Bhukti — 9 Antaras`}
                          </div>
                          <div className="grid grid-cols-3 divide-x divide-y divide-stone-200 text-[7.6px]">
                            {antaras.map((an, ai) => (
                              <div key={ai} className={`px-1 py-[1px] ${an.isOngoingToday ? 'bg-amber-100 font-bold' : ''}`}>
                                <strong className="text-[#7A1A22]">{isTa ? an.lord?.nameTa : an.lord?.nameEn}:</strong> {an.startDate}→{an.endDate}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                <div className="space-y-1 flex-1">
                  {subDashas.map((d, di) => (
                    <div key={di} className={`border rounded-sm overflow-hidden ${d.isOngoingToday ? 'border-[#7A1A22] bg-amber-50/40' : 'border-stone-400'}`}>
                      <div className="bg-[#FAF3E0] border-b border-stone-300 px-1.5 py-0.5 flex justify-between items-center text-[9.5px] font-black text-[#7A1A22]">
                        <span>
                          {isTa ? d.lord?.nameTa : d.lord?.nameEn} ({d.lord?.years} {isTa ? 'ஆ' : 'Yrs'})
                          {d.isBirthDasha ? (isTa ? ' • ஜனன தசை' : ' • Birth Dasha') : ''}
                        </span>
                        <span className="font-mono text-[9px] text-stone-700">{d.startDate} → {d.endDate}</span>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-y divide-stone-200 text-[8.4px]">
                        {(d.bhuktis || []).map((b, bi) => {
                          const bName = isTa
                            ? (b.bhuktiLord?.nameTa || b.lord?.nameTa || '---')
                            : (b.bhuktiLord?.nameEn || b.lord?.nameEn || '---');
                          return (
                            <div key={bi} className={`px-1.5 py-[1.5px] ${b.isOngoingToday ? 'bg-amber-100 font-bold' : 'bg-white'}`}>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[#7A1A22]">{bName}</span>
                                <span className="text-[7.6px] text-stone-500">{isTa ? b.duration?.textTa : b.duration?.textEn}</span>
                              </div>
                              <div className="font-mono text-stone-700 text-[8px] leading-tight">
                                {b.startDate} → {b.endDate}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[7.6px] text-stone-600 italic mt-1 shrink-0">
                {isTa ? `ஜனன தசை இருப்பு: ${dashaBal?.textTa || '---'}` : `Birth Balance: ${dashaBal?.textEn || '---'}`}
              </div>
            </div>
          )
        });
      });
    }

    // =========================================================================
    // SECTION 5: SRIPATI BHAVA SPHUTAM & BHAVA SHIFTS
    // =========================================================================
    if (has(5)) {
      const bhavas = horoscope?.sripatiBhavas || [];
      const shifts = horoscope?.bhavaShifts || [];
      pages.push({
        key: 'sec-5',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <div>
              <A5SectionBanner num="5" titleEn="Sripati Bhava Sphutam & Shifts" titleTa="ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு & மாற்றம்" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden mb-1.5">
                <table className="w-full border-collapse text-[9.5px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                      <th className="py-1 px-1 text-center">{isTa ? 'பாவம்' : 'Bhava'}</th>
                      <th className="py-1 px-1">{isTa ? 'ஆரம்பம்' : 'Start'}</th>
                      <th className="py-1 px-1">{isTa ? 'மத்திமம்' : 'Madhya'}</th>
                      <th className="py-1 px-1">{isTa ? 'முடிவு' : 'End'}</th>
                      <th className="py-1 px-1">{isTa ? 'மத்திம ராசி (அதிபதி)' : 'Sign (Lord)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {bhavas.map((b, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-0.5 px-1 text-center font-mono font-bold text-[#7A1A22]">{b.bhava || idx + 1}</td>
                        <td className="py-0.5 px-1 font-mono text-[9px]">{b.startDMS || '---'}</td>
                        <td className="py-0.5 px-1 font-mono text-[9px] font-bold">{b.madhyaDMS || '---'}</td>
                        <td className="py-0.5 px-1 font-mono text-[9px]">{b.endDMS || '---'}</td>
                        <td className="py-0.5 px-1 font-semibold">
                          {isTa ? SIGN_NAMES[b.madhyaRasi]?.ta : SIGN_NAMES[b.madhyaRasi]?.en} ({isTa ? PLANET_LORDS_TA[b.madhyaRasi] : PLANET_LORDS_EN[b.madhyaRasi]})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {shifts.length > 0 && (
                <div className="border border-amber-300 bg-[#FAF3E0]/80 p-1.5 rounded-sm text-[9.2px] space-y-0.5">
                  <div className="font-black text-[#7A1A22]">{isTa ? 'பாவக கிரக மாற்றங்கள் (Rasi → Chalit)' : 'Bhava Chalit Shifts'}</div>
                  {shifts.map((sh, i) => (
                    <div key={i} className="leading-tight text-stone-800">• {isTa ? sh.explanationTa : sh.explanationEn}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 6: SHADBALA (7 GRAHAS) & COMPLETE 12 BHAVA BALA (2 A5 PAGES)
    // =========================================================================
    if (has(6)) {
      const sb = horoscope?.shadbala || {};
      const gHeaders = (isTa ? (sb.grahaHeaders || []) : (sb.grahaHeadersEn || sb.grahaHeaders || [])).slice(1);
      const gRows = sb.grahaRows || [];
      const bHeaders = sb.bhavaHeaders || [];
      const bRows = sb.bhavaRows || [];

      pages.push({
        key: 'sec-6a',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="6" titleEn="Shadbala Analysis (7 Planets)" titleTa="ஜாதகத்தில் ஷட்பலம் ஆய்வு (7 கிரகங்கள்)" badge="1/2" isTa={isTa} />
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black">
                    <th className="py-1.5 px-1 text-left">{isTa ? 'பலம் கூறுகள்' : 'Shadbala Component'}</th>
                    {gHeaders.map((h, i) => <th key={i} className="py-1.5 px-0.5 text-center">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {gRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                      <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? row.label : (row.labelEn || row.label)}</td>
                      {(row.vals || []).map((v, j) => (
                        <td key={j} className="py-1 px-0.5 text-center font-mono">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });

      if (bRows.length > 0) {
        pages.push({
          key: 'sec-6b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="6" titleEn="Complete Bhava Bala (All 12 Houses)" titleTa="முழுமையான பாவக பலம் (12 வீடுகள்)" badge="2/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                <table className="w-full border-collapse text-[8.6px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black">
                      <th className="py-1 px-1 text-left">{isTa ? 'பலம்' : 'Component'}</th>
                      {(bHeaders.length ? bHeaders : ['1','2','3','4','5','6','7','8','9','10','11','12']).map((h, i) => (
                        <th key={i} className="py-1 px-0.5 text-center">{String(h).replace(/பாவம்/g, '').trim()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {bRows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? row.label : (row.labelEn || row.label)}</td>
                        {(row.vals || []).map((v, j) => (
                          <td key={j} className="py-1 px-0.5 text-center font-mono">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 7: DASAVARGA & COMPLETE SHODASHAVARGA (16 VARGAS) (2 A5 PAGES)
    // =========================================================================
    if (has(7)) {
      const dv = horoscope?.dasavarga || {};
      const headers = isTa ? (dv.grahaHeadersTa || []) : (dv.grahaHeadersEn || []);
      const rows = dv.rows || [];
      const shoda = horoscope?.shodashavarga || [];
      const shodaKeys = ['lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi'];
      pages.push({
        key: 'sec-7a',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="7" titleEn="Dasavarga & Dignity Strength Matrix" titleTa="கிரகங்களின் தசவர்க்கமும் பலமும்" badge="1/2" isTa={isTa} />
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[9.2px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black">
                    <th className="py-1 px-1 text-left">{isTa ? 'வர்க்கம்' : 'Varga'}</th>
                    {headers.map((h, i) => <th key={i} className="py-1 px-0.5 text-center">{h}</th>)}
                    <th className="py-1 px-0.5 text-center">{isTa ? 'சுப' : 'Sub'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {rows.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                      <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{r.key} ({isTa ? r.nameTa : r.nameEn})</td>
                      {(r.dignities || []).map((dg, j) => {
                        const sShort = isTa ? r.signsTa?.[j] : r.signsEn?.[j];
                        const digLabel = isTa
                          ? dg
                          : (dg === 'உ' ? 'Ex' : dg === 'ஆ' ? 'Own' : dg === 'ந' ? 'Fr' : dg === 'ச' ? 'Neu' : dg === 'ப' ? 'En' : dg === 'நீ' ? 'Db' : dg);
                        return (
                          <td key={j} className="py-0.5 px-0.5 text-center font-semibold">
                            {sShort ? `${sShort}(${digLabel})` : digLabel}
                          </td>
                        );
                      })}
                      <td className="py-0.5 px-0.5 text-center font-mono font-bold text-emerald-700">{r.subha}</td>
                    </tr>
                  ))}
                  {dv.subhaTotals && (
                    <tr className="bg-amber-50 border-t border-stone-400 font-black">
                      <td className="py-1 px-1 text-[#7A1A22]">{isTa ? 'சுப / அசுப கூட்டு' : 'Benefic Totals'}</td>
                      {dv.subhaTotals.slice(0, 10).map((t, j) => <td key={j} className="py-1 px-0.5 text-center font-mono">{t}</td>)}
                      <td className="py-1 px-0.5 text-center font-mono text-[#7A1A22]">{dv.grandSubha}/{dv.grandTotal}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      });

      if (shoda.length > 0) {
        pages.push({
          key: 'sec-7b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="7" titleEn="Shodashavarga 16-Division Sign Matrix" titleTa="ஷோடசவர்க்க 16 பிரிவு ராசி அட்டவணை" badge="2/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                <table className="w-full border-collapse text-[8.6px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black">
                      <th className="py-1 px-1 text-left">{isTa ? 'வர்க்கம்' : 'Varga'}</th>
                      {shodaKeys.map(k => (
                        <th key={k} className="py-1 px-0.5 text-center">{isTa ? PLANET_SHORT_TA[k] : PLANET_SHORT_EN[k]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {shoda.map((sv, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{sv.key}</td>
                        {shodaKeys.map(k => {
                          const cell = sv.planets?.[k];
                          return (
                            <td key={k} className="py-0.5 px-0.5 text-center font-semibold">
                              {isTa ? (cell?.signShortTa || '-') : (cell?.signShortEn || '-')}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 8: ASHTAKAVARGA, SAV (337) & SHODHYA PINDAS (2 A5 PAGES)
    // =========================================================================
    if (has(8)) {
      const av = horoscope?.ashtakavarga || {};
      const sav = av.savPoints || [];
      const bavPlanets = av.bavPlanets || [];
      const pindas = av.pindas || [];
      pages.push({
        key: 'sec-8a',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <div>
              <A5SectionBanner num="8" titleEn="Ashtakavarga & Sarvashtakavarga (337 Bindus)" titleTa="அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)" badge="1/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden mb-1.5">
                <table className="w-full border-collapse text-[9.5px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black">
                      <th className="py-1 px-1 text-left">{isTa ? 'ராசி' : 'Rasi'}</th>
                      {bavPlanets.map((bp, i) => <th key={i} className="py-1 px-0.5 text-center">{(isTa ? bp.nameTa : bp.nameEn)?.slice(0, 3)}</th>)}
                      <th className="py-1 px-1 text-center bg-amber-100">SAV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {SIGN_NAMES.map((s, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{isTa ? s.shortTa : s.shortEn}</td>
                        {bavPlanets.map((bp, j) => (
                          <td key={j} className="py-0.5 px-0.5 text-center font-mono">{bp.points?.[rIdx] ?? '-'}</td>
                        ))}
                        <td className="py-0.5 px-1 text-center font-mono font-black bg-amber-50/70">{sav[rIdx] ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9.5px] bg-[#FDFBF7] border border-stone-300 p-1.5 rounded-sm">
                <div><strong>{isTa ? 'கேந்திரம் / பணபரம் / அபோக்லிமம்:' : 'Kendra / Panapara / Apoklima:'}</strong> {av.kendram} / {av.panaparam} / {av.apoklimam}</div>
                <div><strong>{isTa ? 'உபசயம் / திரிகோணம்:' : 'Upachaya / Trikona:'}</strong> {av.upachayam} / {av.trikonam}</div>
                <div><strong>{isTa ? 'வரவு / செலவு:' : 'Income / Expense (11th/12th):'}</strong> {av.varavinam} / {av.selavinam}</div>
                <div><strong>{isTa ? 'திசை பலம் (கி/தெ/மே/வ):' : 'Dir (E/S/W/N):'}</strong> {av.east}/{av.south}/{av.west}/{av.north}</div>
              </div>
            </div>
          </div>
        )
      });

      if (pindas.length > 0) {
        const shodList = av.shodhana || [];
        pages.push({
          key: 'sec-8b',
          render: () => (
            <div className="h-full flex flex-col justify-between">
              <div>
                <A5SectionBanner num="8" titleEn="Ashtakavarga Shodhana & Shodhya Pindas" titleTa="அஷ்டகவர்க்க சோதனை & சோதன பிண்டங்கள்" badge="2/3" isTa={isTa} />
                <div className="border border-stone-400 rounded-sm overflow-hidden mb-1.5">
                  <table className="w-full border-collapse text-[9.2px]">
                    <thead>
                      <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                        <th className="py-1 px-1">{isTa ? 'கிரகம்' : 'Planet'}</th>
                        <th className="py-1 px-1 text-center">{isTa ? 'மொத்த' : 'Raw'}</th>
                        <th className="py-1 px-1 text-center">{isTa ? 'திரிகோண' : 'Trikona'}</th>
                        <th className="py-1 px-1 text-center">{isTa ? 'ஏகாதி' : 'Ekadhi'}</th>
                        <th className="py-1 px-1 text-center">{isTa ? 'ராசி' : 'Rasi P'}</th>
                        <th className="py-1 px-1 text-center">{isTa ? 'கிரக' : 'Graha P'}</th>
                        <th className="py-1 px-1 text-center bg-amber-100">{isTa ? 'சோதன பிண்டம்' : 'Shodhya'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {pindas.map((pd, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                          <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? pd.nameTa : pd.nameEn}</td>
                          <td className="py-1 px-1 text-center font-mono">{pd.rawTotal}</td>
                          <td className="py-1 px-1 text-center font-mono">{pd.trikonaTotal}</td>
                          <td className="py-1 px-1 text-center font-mono">{pd.ekadhipatyaTotal}</td>
                          <td className="py-1 px-1 text-center font-mono">{pd.rasiPinda}</td>
                          <td className="py-1 px-1 text-center font-mono">{pd.grahaPinda}</td>
                          <td className="py-1 px-1 text-center font-mono font-black bg-amber-50 text-[#7A1A22]">{pd.shodhyaPinda}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {shodList.length > 0 && (
                  <div className="border border-amber-300 bg-[#FAF3E0]/70 p-1.5 rounded-sm space-y-0.5 text-[8.6px] leading-tight">
                    <div className="font-black text-[#7A1A22] text-[9.5px]">{isTa ? 'சோத்திய பிண்ட பலன் குறிப்புகள்' : 'Shodhya Pinda Domain & Transit Insights'}</div>
                    {shodList.map((sh, i) => (
                      <div key={i}><strong>{isTa ? sh.nameTa : sh.nameEn} ({sh.shodhyaPinda}):</strong> {isTa ? sh.insightTa : sh.insightEn}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        });

        if (shodList.length > 0) {
          pages.push({
            key: 'sec-8c',
            render: () => (
              <div className="h-full flex flex-col">
                <A5SectionBanner num="8" titleEn="12-Sign Trikona & Ekadhipatya Reductions" titleTa="12 ராசி திரிகோண & ஏகாதிபத்திய சோதனை படிகள்" badge="3/3" isTa={isTa} />
                <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                  <table className="w-full border-collapse text-[8.6px]">
                    <thead>
                      <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                        <th className="py-1 px-1">{isTa ? 'கிரகம்' : 'Entity'}</th>
                        <th className="py-1 px-1">{isTa ? 'அசல் (Ari–Pis)' : 'Raw (12 Signs)'}</th>
                        <th className="py-1 px-1">{isTa ? 'திரிகோண சோதனை' : 'Trikona Reduced'}</th>
                        <th className="py-1 px-1">{isTa ? 'ஏகாதிபத்திய சோதனை' : 'Ekadhipatya'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {shodList.map((sh, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                          <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? sh.nameTa : sh.nameEn}</td>
                          <td className="py-1 px-1 font-mono">{(sh.rawPoints || []).join(',')}</td>
                          <td className="py-1 px-1 font-mono text-indigo-800">{(sh.trikona || []).join(',')}</td>
                          <td className="py-1 px-1 font-mono text-emerald-800 font-bold">{(sh.ekadhipatya || []).join(',')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          });
        }
      }
    }

    // =========================================================================
    // SECTION 9: REAL-TIME GOCHARAM (TRANSIT) ANALYSIS
    // =========================================================================
    if (has(9)) {
      const goc = horoscope?.gocharam || {};
      const sade = goc?.sadeSati || {};
      const guru = goc?.guruBala || {};
      const rk = goc?.rahuKetu || {};
      pages.push({
        key: 'sec-9',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="9" titleEn="Real-Time Gocharam (Transit)" titleTa="கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)" badge={goc.transitDateFormatted} isTa={isTa} />
            <div className="grid grid-cols-12 gap-1.5 mb-1.5 items-stretch">
              <div className="col-span-5">
                {renderChart(isTa ? 'கோச்சார சக்கரம்' : 'Transit Chart', 'Gocharam', goc.birthMoonRasi ?? lagnaRasi, 'h-[40mm]', true)}
              </div>
              <div className="col-span-7 flex flex-col justify-between gap-1 text-[8.8px]">
                <div className="border border-amber-300 bg-[#FAF3E0] p-1 rounded-sm">
                  <div className="font-black text-[#7A1A22]">{isTa ? sade.titleTa : sade.titleEn}</div>
                  <div className="text-stone-700 leading-tight">{isTa ? sade.descTa : sade.descEn}</div>
                </div>
                <div className="border border-amber-300 bg-[#FAF3E0] p-1 rounded-sm">
                  <div className="font-black text-[#7A1A22]">{isTa ? guru.titleTa : guru.titleEn}</div>
                  <div className="text-stone-700 leading-tight">{isTa ? guru.descTa : guru.descEn}</div>
                </div>
                <div className="border border-amber-300 bg-[#FAF3E0] p-1 rounded-sm">
                  <div className="font-black text-[#7A1A22]">{isTa ? rk.titleTa : rk.titleEn}</div>
                  <div className="text-stone-700 leading-tight">{isTa ? rk.descTa : (rk.descEn || 'Rahu-Ketu Transit')}</div>
                </div>
              </div>
            </div>
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                    <th className="py-1 px-1">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-1 px-1">{isTa ? 'ராசி (வீடு)' : 'Transit (H)'}</th>
                    <th className="py-1 px-1 text-center">BAV/SAV</th>
                    <th className="py-1 px-1">{isTa ? 'கோச்சார பலன்' : 'Transit Phalan'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {(goc.planets || []).map((gp, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                      <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? gp.nameWithVakraTa : gp.nameWithVakraEn}</td>
                      <td className="py-1 px-1 font-semibold">{isTa ? gp.transitRasiTa : gp.transitRasiEn} ({gp.houseFromMoon})</td>
                      <td className="py-1 px-1 text-center font-mono">{gp.bavBindus ?? '-'}/{gp.savBindus ?? '-'}</td>
                      <td className="py-1 px-1 leading-tight">
                        <strong>{isTa ? gp.statusBadgeTa : gp.statusBadgeEn}</strong>
                        {gp.phalanTa || gp.phalanEn ? ` — ${isTa ? gp.phalanTa : gp.phalanEn}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 10: PLANETARY HORA (ORAI) - BIRTH DATE & TODAY (2 A5 PAGES)
    // =========================================================================
    if (has(10)) {
      const orai = horoscope?.orai || {};
      const bh = orai?.birthHora || {};
      const liveH = orai?.currentLiveHora || {};
      const bSun = orai?.birthSunriseSunset || {};
      const tSun = orai?.todaySunriseSunset || {};

      pages.push({
        key: 'sec-10a',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner
              num="10"
              titleEn="Birth Date Planetary Horas (Orai)"
              titleTa="ஜனன தின ஹோரை (ஓரை) அட்டவணை"
              badge="1/2"
              isTa={isTa}
            />
            <div className="border border-amber-300 bg-[#FAF3E0] p-1.5 rounded-sm mb-1.5 text-[9.5px]">
              <div className="flex justify-between font-black text-[#7A1A22]">
                <span>{isTa ? 'ஜனன ஹோரை:' : 'Birth Hora:'} {isTa ? bh.nameTa : bh.nameEn} ({bh.timeText})</span>
                <span className="font-mono">{bSun.sunriseFormatted} – {bSun.sunsetFormatted}</span>
              </div>
              <div className="text-stone-700">
                <strong>{isTa ? 'தன்மை:' : 'Nature:'}</strong> {isTa ? bh.natureTa : bh.natureEn}
                {bSun.dinamanaFormatted ? ` • ${isTa ? 'தினமானம்' : 'Day'}: ${bSun.dinamanaFormatted}` : ''}
              </div>
              <div className="text-stone-800 leading-tight"><strong>{isTa ? 'உகந்தது:' : 'Suitable:'}</strong> {isTa ? bh.info?.suitableTa : bh.info?.suitableEn}</div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              <div className="border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 font-black text-[9.6px] text-[#7A1A22]">
                  {isTa ? 'பகல் ஹோரைகள் (1–12)' : 'Birth Day Horas (1–12)'}
                </div>
                <table className="w-full border-collapse text-[9px]">
                  <tbody className="divide-y divide-stone-200">
                    {(orai.birthDayHoras || []).map((hr, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-mono font-bold w-4">{hr.num}</td>
                        <td className="py-0.5 px-1 font-semibold">{isTa ? hr.info?.ta : hr.info?.en}</td>
                        <td className="py-0.5 px-1 font-mono text-right">{hr.startFormatted}–{hr.endFormatted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 font-black text-[9.6px] text-[#7A1A22]">
                  {isTa ? 'இரவு ஹோரைகள் (1–12)' : 'Birth Night Horas (1–12)'}
                </div>
                <table className="w-full border-collapse text-[9px]">
                  <tbody className="divide-y divide-stone-200">
                    {(orai.birthNightHoras || []).map((hr, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-mono font-bold w-4">{hr.num}</td>
                        <td className="py-0.5 px-1 font-semibold">{isTa ? hr.info?.ta : hr.info?.en}</td>
                        <td className="py-0.5 px-1 font-mono text-right">{hr.startFormatted}–{hr.endFormatted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      });

      if ((orai.todayDayHoras || []).length > 0) {
        pages.push({
          key: 'sec-10b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner
                num="10"
                titleEn="Today's Live Planetary Horas (Orai)"
                titleTa="இன்றைய நேரடி ஹோரை (ஓரை) அட்டவணை"
                badge="2/2"
                isTa={isTa}
              />
              <div className="border border-amber-300 bg-[#FDFBF7] p-1.5 rounded-sm mb-1.5 text-[9.5px]">
                <div className="flex justify-between font-black text-[#7A1A22]">
                  <span>{isTa ? 'தற்போதைய ஹோரை:' : 'Live Hora:'} {isTa ? liveH.nameTa : liveH.nameEn}</span>
                  <span className="font-mono">{tSun.sunriseFormatted} – {tSun.sunsetFormatted}</span>
                </div>
                <div className="text-stone-700">{isTa ? liveH.natureTa : liveH.natureEn}</div>
                <div className="text-stone-800 leading-tight"><strong>{isTa ? 'உகந்தது:' : 'Suitable:'}</strong> {isTa ? liveH.info?.suitableTa : liveH.info?.suitableEn}</div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 flex-1">
                <div className="border border-stone-400 rounded-sm overflow-hidden">
                  <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 font-black text-[9.6px] text-[#7A1A22]">
                    {isTa ? 'இன்றைய பகல் ஹோரைகள்' : "Today's Day Horas (1–12)"}
                  </div>
                  <table className="w-full border-collapse text-[9px]">
                    <tbody className="divide-y divide-stone-200">
                      {(orai.todayDayHoras || []).map((hr, i) => (
                        <tr key={i} className={hr.isCurrent ? 'bg-amber-100 font-bold' : ''}>
                          <td className="py-0.5 px-1 font-mono font-bold w-4">{hr.num}</td>
                          <td className="py-0.5 px-1 font-semibold">{isTa ? hr.info?.ta : hr.info?.en}</td>
                          <td className="py-0.5 px-1 font-mono text-right">{hr.startFormatted}–{hr.endFormatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border border-stone-400 rounded-sm overflow-hidden">
                  <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 font-black text-[9.6px] text-[#7A1A22]">
                    {isTa ? 'இன்றைய இரவு ஹோரைகள்' : "Today's Night Horas (1–12)"}
                  </div>
                  <table className="w-full border-collapse text-[9px]">
                    <tbody className="divide-y divide-stone-200">
                      {(orai.todayNightHoras || []).map((hr, i) => (
                        <tr key={i} className={hr.isCurrent ? 'bg-amber-100 font-bold' : ''}>
                          <td className="py-0.5 px-1 font-mono font-bold w-4">{hr.num}</td>
                          <td className="py-0.5 px-1 font-semibold">{isTa ? hr.info?.ta : hr.info?.en}</td>
                          <td className="py-0.5 px-1 font-mono text-right">{hr.startFormatted}–{hr.endFormatted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 11: UPAGRAHAS - GULIKADI FIVE & DHUMADI FIVE (2 A5 PAGES)
    // =========================================================================
    if (has(11)) {
      const up = horoscope?.upagrahas || {};
      const gulikaadi = up.gulikaadi || [];
      const dhumadi = up.dhumadi || [];
      pages.push({
        key: 'sec-11a',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <div>
              <A5SectionBanner num="11" titleEn="Upagrahas Chart & Gulikadi Five" titleTa="உபகிரக சக்கரம் & குளிகாதி ஐவர்" badge="1/2" isTa={isTa} />
              <div className="grid grid-cols-12 gap-2 mb-1.5 items-center">
                <div className="col-span-6">
                  {renderChart(isTa ? 'உபகிரக சக்கரம்' : 'Upagrahas Chart', 'Upagrahas', lagnaRasi, 'h-[45mm]', true)}
                </div>
                <div className="col-span-6 border border-amber-300 bg-[#FAF3E0]/80 p-1.5 rounded-sm text-[9.2px] leading-snug space-y-1">
                  <div className="font-black text-[#7A1A22]">{isTa ? 'குளிகாதி கணித விதி' : 'Gulikadi Parashara & Kalidasa Rule'}</div>
                  <div className="text-stone-700">
                    {(isTa ? up.verificationRule?.textTa : up.verificationRule?.textEn) ||
                      up.verificationRule?.formulaTa ||
                      (isTa
                        ? 'பகல் / இரவு 8 யாமங்களாகப் பிரித்து பராசரர் (ஆரம்பம்) மற்றும் காளிதாசர் (முடிவு) முறையில் கணக்கிடப்படுகிறது.'
                        : 'Day & Night divided into 8 equal parts; Parashara takes slot start, Kalidasa takes slot end.')}
                  </div>
                </div>
              </div>
              <div className="border border-stone-400 rounded-sm overflow-hidden">
                <table className="w-full border-collapse text-[9px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-bold text-left">
                      <th className="py-1 px-1">{isTa ? 'உபகிரகம் (நேரம்)' : 'Upagraha (Slot)'}</th>
                      <th className="py-1 px-1">{isTa ? 'பராசரர்' : 'Parashara Pos'}</th>
                      <th className="py-1 px-1">{isTa ? 'காளிதாசர்' : 'Kalidasa Pos'}</th>
                      <th className="py-1 px-1">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {gulikaadi.map((g, i) => (
                      <tr key={i}>
                        <td className="py-1 px-1 font-bold text-[#7A1A22]">
                          {isTa ? g.nameTa : g.nameEn} ({isTa ? g.lordTa : g.lordEn})
                          {g.startTime && <span className="block font-mono text-[9.6px] text-stone-500">{g.startTime}–{g.endTime}</span>}
                        </td>
                        <td className="py-1 px-1 font-semibold">{isTa ? g.parashara?.rasiTa : g.parashara?.rasiEn} <span className="font-mono text-[9.8px]">{g.parashara?.degDMS}</span></td>
                        <td className="py-1 px-1 font-semibold">{isTa ? g.kalidasa?.rasiTa : g.kalidasa?.rasiEn} <span className="font-mono text-[9.8px]">{g.kalidasa?.degDMS}</span></td>
                        <td className="py-1 px-1">{isTa ? g.parashara?.nakTa : g.parashara?.nakEn} ({g.parashara?.pada})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      });

      if (dhumadi.length > 0) {
        pages.push({
          key: 'sec-11b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="11" titleEn="Dhumadi Five Solar Upagrahas" titleTa="தூமாதி ஐவர் உபகிரக விபரங்கள்" badge="2/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                <table className="w-full border-collapse text-[9.5px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-bold text-left">
                      <th className="py-1.5 px-1.5">{isTa ? 'உபகிரகம்' : 'Upagraha'}</th>
                      <th className="py-1.5 px-1">{isTa ? 'கணித சூத்திரம்' : 'Formula'}</th>
                      <th className="py-1.5 px-1">{isTa ? 'ராசி & பாகை' : 'Rasi & Deg'}</th>
                      <th className="py-1.5 px-1">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {dhumadi.map((dm, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-1.5 px-1.5 font-bold text-[#7A1A22]">
                          {isTa ? dm.nameTa : dm.nameEn}
                          <span className="block text-[8.6px] text-stone-500">{isTa ? dm.lordTa : dm.lordEn}</span>
                        </td>
                        <td className="py-1.5 px-1 text-stone-700 leading-tight">{isTa ? dm.formulaTa : dm.formulaEn}</td>
                        <td className="py-1.5 px-1 font-semibold">{isTa ? dm.rasiTa : dm.rasiEn} <span className="font-mono text-[8.6px]">{dm.degDMS}</span></td>
                        <td className="py-1.5 px-1">{isTa ? dm.nakTa : dm.nakEn} ({dm.pada})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 12: ALL SPECIAL LAGNAS, SPHUTAS & KARMIC POINTS (2 A5 PAGES)
    // =========================================================================
    if (has(12)) {
      const sp = horoscope?.specialLagnas || {};
      const page12List = [...toArr(sp.specialLagnas), ...toArr(sp.auspiciousSphutas)];
      const page12Karmic = toArr(sp.karmicPoints);

      pages.push({
        key: 'sec-12a',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="12" titleEn="Special Lagnas & Auspicious Sphutas" titleTa="சிறப்பு லக்னங்கள் & சுப ஸ்புடங்கள்" badge="1/2" isTa={isTa} />
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                    <th className="py-1 px-1.5">{isTa ? 'ஸ்புடம் / லக்னம்' : 'Special Point'}</th>
                    <th className="py-1 px-1">{isTa ? 'ராசி & பாகை' : 'Rasi & Deg'}</th>
                    <th className="py-1 px-1">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {page12List.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                      <td className="py-0.5 px-1.5 font-bold text-[#7A1A22]">
                        {isTa ? (item.nameTa || item.labelTa || item.id) : (item.nameEn || item.labelEn || item.id)}
                        {(item.formulaTa || item.formulaEn) && (
                          <span className="block text-[9.6px] text-stone-500 font-normal">{isTa ? item.formulaTa : item.formulaEn}</span>
                        )}
                      </td>
                      <td className="py-0.5 px-1 font-semibold">
                        {isTa ? (item.rasiTa || item.planetTa || (item.subhaBalam ? `சுப: ${item.subhaBalam}` : '---')) : (item.rasiEn || item.planetEn || (item.subhaBalam ? `Subha: ${item.subhaBalam}` : '---'))}{' '}
                        <span className="font-mono text-[9.8px]">{item.degDMS || ''}</span>
                      </td>
                      <td className="py-0.5 px-1 leading-tight">
                        {item.nakTa || item.nakEn
                          ? `${isTa ? item.nakTa : item.nakEn}${item.pada ? ` (${item.pada})` : ''}`
                          : (isTa ? (item.ratioTa || item.notesTa || item.purposeTa || '---') : (item.ratioEn || item.notesEn || item.purposeEn || '---'))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });

      if (page12Karmic.length > 0) {
        pages.push({
          key: 'sec-12b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="12" titleEn="Sensitive & Karmic Points (Mrityu, 64th Navamsha, 22nd Drekkana)" titleTa="நுட்ப கர்ம புள்ளிகள் (64-ம் நவாம்சம், 22-ம் திரேக்காணம், மிருத்யு பாகை)" badge="2/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                <table className="w-full border-collapse text-[9.5px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                      <th className="py-1 px-1.5">{isTa ? 'புள்ளி' : 'Point'}</th>
                      <th className="py-1 px-1">{isTa ? 'ராசி / கிரகம்' : 'Sign / Planets'}</th>
                      <th className="py-1 px-1">{isTa ? 'பலன் / குறிப்பு' : 'Significance'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {page12Karmic.map((kp, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-1 px-1.5 font-bold text-[#7A1A22]">{isTa ? (kp.nameTa || kp.labelTa || kp.titleTa || kp.id) : (kp.nameEn || kp.labelEn || kp.titleEn || kp.id)}</td>
                        <td className="py-1 px-1 font-semibold">
                          {isTa ? (kp.rasiTa || kp.planetTa || kp.planetsTa || kp.valueTa || '---') : (kp.rasiEn || kp.planetEn || kp.planetsEn || kp.valueEn || '---')}
                          {(kp.lordTa || kp.lordEn) && <span className="block text-[9.8px] text-stone-500">{isTa ? `அதிபதி: ${kp.lordTa}` : `Lord: ${kp.lordEn}`}</span>}
                        </td>
                        <td className="py-1 px-1 text-stone-700 leading-tight">{isTa ? (kp.notesTa || kp.descTa || kp.noteTa || kp.nakTa || '---') : (kp.notesEn || kp.descEn || kp.noteEn || kp.nakEn || '---')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 13: PLANETARY FRIENDSHIPS (NAISARGIKA/TATKALIKA/PANCHADHA) & AVASTHAS
    // =========================================================================
    if (has(13)) {
      const rel = horoscope?.planetaryRelationshipsAndAvasthas || {};
      const naisargika = rel.naisargikaList || [];
      const tatkalika = rel.tatkalikaData || [];
      const panchadha = rel.panchadhaData || [];
      const avasthas = rel.avasthasData || [];

      pages.push({
        key: 'sec-13a',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="13" titleEn="Naisargika & Tatkalika Friendships" titleTa="நைசர்கிக & தற்கால நட்பு நிலைகள்" badge="1/3" isTa={isTa} />
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              <div className="border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 text-[9.5px] font-black text-[#7A1A22]">
                  {isTa ? 'நைசர்கிக (இயற்கை) நட்பு' : 'Naisargika (Natural)'}
                </div>
                <table className="w-full border-collapse text-[9.8px]">
                  <tbody className="divide-y divide-stone-200">
                    {naisargika.map((n, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22] w-11">{isTa ? n.nameTa : n.nameEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'ந:' : 'F:'}</strong> {isTa ? n.friendsTa : n.friendsEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'ச:' : 'N:'}</strong> {isTa ? n.neutralsTa : n.neutralsEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'ப:' : 'E:'}</strong> {isTa ? n.enemiesTa : n.enemiesEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 text-[9.5px] font-black text-[#7A1A22]">
                  {isTa ? 'தற்கால (ஜனன சக்கர) நட்பு' : 'Tatkalika (Temporal)'}
                </div>
                <table className="w-full border-collapse text-[9.8px]">
                  <tbody className="divide-y divide-stone-200">
                    {tatkalika.map((tk, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22] w-11">{isTa ? tk.nameTa : tk.nameEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'மி:' : 'F:'}</strong> {isTa ? tk.friendsTa : tk.friendsEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'ச:' : 'E:'}</strong> {isTa ? tk.enemiesTa : tk.enemiesEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      });

      pages.push({
        key: 'sec-13b',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="13" titleEn="Panchadha Maitri (5-Fold Combined Relationships)" titleTa="பஞ்சதா நட்பு (5-வகை கலப்பு நிலைகள்)" badge="2/3" isTa={isTa} />
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[9px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                    <th className="py-1 px-1">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-1 px-1">{isTa ? 'அதிமித்ரு / மித்ரு' : 'Great / Friend'}</th>
                    <th className="py-1 px-1">{isTa ? 'சமம்' : 'Neutral'}</th>
                    <th className="py-1 px-1">{isTa ? 'சத்ரு / அதிசத்ரு' : 'Enemy / Great'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {panchadha.map((pc, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                      <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? pc.nameTa : pc.nameEn}</td>
                      <td className="py-1 px-1 text-emerald-800">{isTa ? `${pc.adhiMithruTa} / ${pc.mithruTa}` : `${pc.adhiMithruEn} / ${pc.mithruEn}`}</td>
                      <td className="py-1 px-1">{isTa ? pc.samaTa : pc.samaEn}</td>
                      <td className="py-1 px-1 text-rose-800">{isTa ? `${pc.shatruTa} / ${pc.adhiShatruTa}` : `${pc.shatruEn} / ${pc.adhiShatruEn}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });

      pages.push({
        key: 'sec-13c',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="13" titleEn="Planetary Avasthas & Mandala States" titleTa="கிரக அவஸ்தைகள் & மண்டல நிலைகள்" badge="3/3" isTa={isTa} />
            <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
              <table className="w-full border-collapse text-[8.6px]">
                <thead>
                  <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                    <th className="py-1 px-1">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-1 px-1">{isTa ? 'பாலாதி / ஜாக்ரதாதி' : 'Baladi / Jagradadi'}</th>
                    <th className="py-1 px-1">{isTa ? 'தீப்தாதி' : 'Deeptadi'}</th>
                    <th className="py-1 px-1">{isTa ? 'சயனாதி' : 'Shayanadi'}</th>
                    <th className="py-1 px-1">{isTa ? 'மண்டலம்' : 'Mandala'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {avasthas.map((av, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                      <td className="py-1 px-1 font-bold text-[#7A1A22]">{isTa ? av.nameTa : av.nameEn}</td>
                      <td className="py-1 px-1">{isTa ? `${av.baladi?.ta} (${av.baladi?.potency}) / ${av.jagradadi?.ta}` : `${av.baladi?.en} / ${av.jagradadi?.en}`}</td>
                      <td className="py-1 px-1">{isTa ? av.deeptadi?.ta : av.deeptadi?.en}</td>
                      <td className="py-1 px-1">{isTa ? av.shayanadi?.ta : av.shayanadi?.en}</td>
                      <td className="py-1 px-1">{isTa ? av.mandalam?.ta : av.mandalam?.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 14: GRAHA & BHAVA ASPECT ANGLES (2 A5 PAGES)
    // =========================================================================
    if (has(14)) {
      const aa = horoscope?.aspectAnglesData || {};
      const gHeaders = aa.grahaHeaders || [];
      const gMatrix = aa.grahaMatrix || [];
      const bMatrix = aa.bhavaMatrix || [];

      pages.push({
        key: 'sec-14a',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="14" titleEn="Graha-to-Graha Aspect Angles Matrix" titleTa="கிரகங்களுக்கான பார்வை கோணங்கள்" badge="1/2" isTa={isTa} />
            <div className="grid grid-cols-12 gap-1.5 flex-1">
              <div className="col-span-6 border border-stone-400 rounded-sm overflow-hidden">
                <table className="w-full border-collapse text-[9.6px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black">
                      <th className="py-1 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Pl'}</th>
                      {gHeaders.map((h, i) => <th key={i} className="py-1 px-0.5 text-center">{(isTa ? h.nameTa : h.nameEn)?.slice(0, 2)}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {gMatrix.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-0.5 px-0.5 font-bold text-[#7A1A22]">{(isTa ? row.nameTa : row.nameEn)?.slice(0, 3)}</td>
                        {gHeaders.map((h, j) => (
                          <td key={j} className="py-0.5 px-0.5 text-center font-mono">{row.cells?.[h.id]?.angleFormatted || '--'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-span-6 border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 text-[9.2px] font-black text-[#7A1A22]">
                  {isTa ? 'முழு பார்வை & பகுதி பார்வை விபரம்' : 'Full & Partial Aspects Cast Summary'}
                </div>
                <table className="w-full border-collapse text-[9.6px]">
                  <tbody className="divide-y divide-stone-200">
                    {gMatrix.map((row, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22] w-11">{isTa ? row.nameTa : row.nameEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'மு:' : 'F:'}</strong> {isTa ? row.fullAspectListTa : row.fullAspectListEn}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'ப:' : 'P:'}</strong> {isTa ? row.partialAspectListTa : row.partialAspectListEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      });

      if (bMatrix.length > 0) {
        pages.push({
          key: 'sec-14b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="14" titleEn="Bhava-Graha Aspect Strength & Virupas" titleTa="பாவக-கிரக பார்வை கோணங்கள் & விருபா பலம்" badge="2/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                <table className="w-full border-collapse text-[9px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                      <th className="py-1 px-1">{isTa ? 'பாவம்' : 'Bhava'}</th>
                      <th className="py-1 px-1">{isTa ? 'வலுவான சுப பார்வை' : 'Strong Benefic'}</th>
                      <th className="py-1 px-1">{isTa ? 'வலுவான பாப பார்வை' : 'Strong Malefic'}</th>
                      <th className="py-1 px-1 text-right">{isTa ? 'நிகர பலன்' : 'Verdict'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {bMatrix.map((bm, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{bm.bhavaNum}. {isTa ? bm.rasiNameTa : bm.rasiNameEn}</td>
                        <td className="py-0.5 px-1 text-emerald-800">{isTa ? (bm.strongBeneficAspectsTa || '-') : (bm.strongBeneficAspectsEn || '-')}</td>
                        <td className="py-0.5 px-1 text-rose-800">{isTa ? (bm.strongMaleficAspectsTa || '-') : (bm.strongMaleficAspectsEn || '-')}</td>
                        <td className="py-0.5 px-1 font-semibold text-right">{isTa ? bm.verdictTa : bm.verdictEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 15: PANCHA PAKSHI DETAILS & WEEKLY SCHEDULE (2 A5 PAGES)
    // =========================================================================
    if (has(15)) {
      const pp = horoscope?.panchaPakshiData || {};
      const bird = pp.birthBird || {};
      const act = pp.activitiesList || [];
      const weekly = pp.weeklySchedule || [];
      pages.push({
        key: 'sec-15a',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <div>
              <A5SectionBanner num="15" titleEn="Pancha Pakshi (Birth Bird & Activities)" titleTa="பஞ்ச பட்சி விபரம் (ஜன்ம பட்சி & தொழில்கள்)" badge="1/2" isTa={isTa} />
              <div className="border border-amber-300 bg-[#FAF3E0] p-2 rounded-sm mb-2 text-[10px] space-y-1">
                <div className="flex justify-between font-black text-[#7A1A22] text-[9.5px]">
                  <span>{isTa ? 'ஜன்ம பட்சி:' : 'Birth Bird:'} {isTa ? bird.ta : bird.en}</span>
                  <span>{isTa ? bird.pakshaTa : bird.pakshaEn}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div><strong>{isTa ? 'பூதம் / நிறம்:' : 'Elem / Color:'}</strong> {isTa ? `${bird.elementTa} / ${bird.colorTa}` : `${bird.elementEn} / ${bird.colorEn}`}</div>
                  <div><strong>{isTa ? 'திசை / அதிபதி:' : 'Dir / Lord:'}</strong> {isTa ? `${bird.directionTa} / ${bird.rulingPlanetTa}` : `${bird.directionEn} / ${bird.rulingPlanetEn}`}</div>
                  <div><strong>{isTa ? 'நட்பு:' : 'Friends:'}</strong> {isTa ? bird.friendBirdsTa : bird.friendBirdsEn}</div>
                  <div><strong>{isTa ? 'பகை:' : 'Enemies:'}</strong> {isTa ? bird.enemyBirdsTa : bird.enemyBirdsEn}</div>
                </div>
                <div><strong>{isTa ? 'அவயோக நாட்கள்:' : 'Unfavorable Days:'}</strong> {isTa ? bird.badDaysTa : bird.badDaysEn}</div>
              </div>
              {act.length > 0 && (
                <div className="border border-stone-400 rounded-sm overflow-hidden">
                  <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 text-[9.8px] font-black text-[#7A1A22]">
                    {isTa ? 'பஞ்ச பட்சி 5 தொழில்கள் & பலன்கள்' : 'Five Pakshi Activities & Potency'}
                  </div>
                  <table className="w-full border-collapse text-[9.6px]">
                    <tbody className="divide-y divide-stone-200">
                      {act.map((a, i) => (
                        <tr key={i}>
                          <td className="py-1.5 px-1.5 font-bold text-[#7A1A22] w-28">{isTa ? a.ta : a.en} ({a.potency})</td>
                          <td className="py-1.5 px-1.5">{isTa ? a.effectTa : a.effectEn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      });

      if (weekly.length > 0) {
        pages.push({
          key: 'sec-15b',
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="15" titleEn="Pancha Pakshi 7-Day Weekly Timings" titleTa="பஞ்ச பட்சி வார சுப & சாவு நேர அட்டவணை" badge="2/2" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden flex-1">
                <table className="w-full border-collapse text-[9.2px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                      <th className="py-1 px-1">{isTa ? 'கிழமை' : 'Day'}</th>
                      <th className="py-1 px-1">{isTa ? 'பொன்னான சுப நேரங்கள் (அரசு/ஊண்)' : 'Golden Ruling / Feeding Hours'}</th>
                      <th className="py-1 px-1">{isTa ? 'சாவு நேரம் (தவிர்க்க)' : 'Saavu (Avoid)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {weekly.map((w, i) => (
                      <tr key={i} className={w.isBadDay ? 'bg-rose-50/40' : i % 2 === 0 ? 'bg-white' : 'bg-stone-50/70'}>
                        <td className="py-1.5 px-1 font-bold text-[#7A1A22]">{isTa ? w.weekdayTa : w.weekdayEn}</td>
                        <td className="py-1.5 px-1 text-emerald-800 leading-tight">{isTa ? w.goldenHoursTa : w.goldenHoursEn}</td>
                        <td className="py-1.5 px-1 text-rose-700 leading-tight">{isTa ? w.saavuHoursTa : w.saavuHoursEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        });
      }
    }

    // =========================================================================
    // SECTION 16: MAHADASHA FUNCTIONAL ROLES & 9 TARA BALA (27 STARS)
    // =========================================================================
    if (has(16)) {
      const pbt = horoscope?.pasakarBodhakarTaraData || {};
      const tRows = pbt.taraRows || [];
      pages.push({
        key: 'sec-16',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <A5SectionBanner num="16" titleEn="Mahadasha Roles & 9 Tara Balas" titleTa="மகாதசை போதகங்கள் & 9 தாரா பலம் (27 நட்சத்திரம்)" isTa={isTa} />
            <div className="grid grid-cols-12 gap-1.5 flex-1">
              <div className="col-span-6 border border-stone-400 rounded-sm overflow-hidden">
                <table className="w-full border-collapse text-[9.8px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                      <th className="py-1 px-1">{isTa ? 'தசை' : 'Dasha'}</th>
                      <th className="py-1 px-1">{isTa ? 'போகன்' : 'Bhogan'}</th>
                      <th className="py-1 px-1">{isTa ? 'வேதகன்' : 'Vedhagan'}</th>
                      <th className="py-1 px-1">{isTa ? 'பாசகன்' : 'Pasagan'}</th>
                      <th className="py-1 px-1">{isTa ? 'காரகன்' : 'Karagan'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {MAHADASHA_BHOGAN_VEDHAGAN_TABLE.map((r, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{isTa ? r.idTa : r.idEn}</td>
                        <td className="py-0.5 px-1">{isTa ? r.bhoganTa : r.bhoganEn}</td>
                        <td className="py-0.5 px-1">{isTa ? r.vedhaganTa : r.vedhaganEn}</td>
                        <td className="py-0.5 px-1">{isTa ? r.pasaganTa : r.pasaganEn}</td>
                        <td className="py-0.5 px-1">{isTa ? r.karaganTa : r.karaganEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-span-6 border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 text-[9.2px] font-black text-[#7A1A22]">
                  {isTa ? 'தாரா பலம் (9 தாரைகள் — 27 நட்சத்திரம்)' : 'Tara Bala (9 Taras — 27 Stars)'}
                </div>
                <table className="w-full border-collapse text-[9.6px]">
                  <tbody className="divide-y divide-stone-200">
                    {tRows.map((tr, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{isTa ? tr.taraTa : tr.taraEn}</td>
                        <td className="py-0.5 px-1">{isTa ? tr.starsListTa : tr.starsListEn}</td>
                        <td className="py-0.5 px-1 font-semibold text-right">{isTa ? tr.qualityTa : tr.qualityEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {(pbt.auspiciousNoteTa || pbt.auspiciousNoteEn) && (
              <div className="mt-1 border border-amber-300 bg-[#FAF3E0]/70 px-2 py-0.5 rounded-sm text-[9.8px] text-stone-800 shrink-0">
                <strong className="text-[#7A1A22]">{isTa ? 'தாரா பல குறிப்பு:' : 'Tara Bala Note:'}</strong> {isTa ? pbt.auspiciousNoteTa : pbt.auspiciousNoteEn}
              </div>
            )}
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 17: PLANETARY DIGNITIES, ASPECTS & CONJUNCTIONS
    // =========================================================================
    if (has(17)) {
      const d17 = horoscope?.dignitiesAspectsSection17Data || {};
      const digTable = d17.dignitiesTable || [];
      const aspTable = d17.aspectsTable || [];
      pages.push({
        key: 'sec-17',
        render: () => (
          <div className="h-full flex flex-col">
            <A5SectionBanner num="17" titleEn="Planetary Dignities, Aspects & Conjunctions" titleTa="கிரகங்களின் நிலை, பார்வை & சேர்க்கை" isTa={isTa} />
            <div className="grid grid-cols-12 gap-1.5 flex-1">
              <div className="col-span-5 border border-stone-400 rounded-sm overflow-hidden">
                <table className="w-full border-collapse text-[8.6px]">
                  <thead>
                    <tr className="bg-[#FAF3E0] border-b border-stone-400 text-[#7A1A22] font-black text-left">
                      <th className="py-1 px-1">{isTa ? 'கிரக நிலை வகை' : 'Dignity Category'}</th>
                      <th className="py-1 px-1">{isTa ? 'கிரகங்கள்' : 'Planets'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {digTable.map((r, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{isTa ? r.labelTa : r.labelEn}</td>
                        <td className="py-0.5 px-1 font-semibold">{isTa ? r.valTa : r.valEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-span-7 border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-1.5 py-0.5 text-[9.2px] font-black text-[#7A1A22]">
                  {isTa ? 'பார்வை & சேர்க்கை அட்டவணை' : 'Aspects & Conjunctions Table'}
                </div>
                <table className="w-full border-collapse text-[9.8px]">
                  <tbody className="divide-y divide-stone-200">
                    {aspTable.map((a, i) => (
                      <tr key={i}>
                        <td className="py-0.5 px-1 font-bold text-[#7A1A22] w-12">{isTa ? a.grahaTa : a.grahaEn}</td>
                        <td className="py-0.5 px-1">{isTa ? a.rasiTa : a.rasiEn} ({isTa ? a.statusTa : a.statusEn})</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'பா:' : 'Asp:'}</strong> {isTa ? (a.aspectsByTa || '-') : (a.aspectsByEn || '-')}</td>
                        <td className="py-0.5 px-1"><strong>{isTa ? 'சே:' : 'Cnj:'}</strong> {isTa ? (a.conjunctionsTa || '-') : (a.conjunctionsEn || '-')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 18: ASTRO-NUMEROLOGY (CHALDEAN SYSTEM + LETTER TABLE)
    // =========================================================================
    if (has(18)) {
      const nm = horoscope?.numerologyData || {};
      const birthNumDisplay = (isTa ? (nm.dateNumTa || nm.dateNum) : (nm.dateNumEn || nm.dateNum))
        || (nm.rawDateNum ? `${nm.rawDateNum}${nm.datePlanetTa || nm.datePlanetEn ? ` (${isTa ? nm.datePlanetTa : nm.datePlanetEn})` : ''}` : '---');
      const lifeNumDisplay = (isTa ? (nm.yearNumTa || nm.yearNum) : (nm.yearNumEn || nm.yearNum))
        || (nm.rawLifeNum ? `${nm.rawLifeNum}${nm.lifePlanetTa || nm.lifePlanetEn ? ` (${isTa ? nm.lifePlanetTa : nm.lifePlanetEn})` : ''}` : '---');
      const nakSylEn = [
        'Chu, Che, Cho, La', 'Li, Lu, Le, Lo', 'A, I, U, E', 'O, Va, Vi, Vu',
        'Ve, Vo, Ka, Ki', 'Ku, Gha, Ng, Chha', 'Ke, Ko, Ha, Hi', 'Hu, He, Ho, Da',
        'Di, Du, De, Do', 'Ma, Mi, Mu, Me', 'Mo, Ta, Ti, Tu', 'Te, To, Pa, Pi',
        'Pu, Sha, Na, Tha', 'Pe, Po, Ra, Ri', 'Ru, Re, Ro, Ta', 'Ti, Tu, Te, To',
        'Na, Ni, Nu, Ne', 'No, Ya, Yi, Yu', 'Ye, Yo, Bha, Bhi', 'Bhu, Dha, Pha, Dha',
        'Bhe, Bho, Ja, Ji', 'Ju, Je, Jo, Gha', 'Ga, Gi, Gu, Ge', 'Go, Sa, Si, Su',
        'Se, So, Da, Di', 'Du, Tha, Jha, Da', 'De, Do, Cha, Chi'
      ];
      const moonNakIdx = summary?.moonNak ?? 0;
      const starSyllablesStr = isTa
        ? (NAKSHATRA_SYLLABLES_TA[moonNakIdx] || '---')
        : (nakSylEn[moonNakIdx] || '---');
      const rows = [
        [isTa ? 'பெயர் எண் (சால்டியன்)' : 'Name Number (Chaldean)', (isTa ? (nm.engSumTa || nm.engSum) : (nm.engSumEn || nm.engSum)) || '---'],
        [isTa ? 'பிறப்பு எண் (உடல் எண்)' : 'Birth Number (Psychic)', birthNumDisplay],
        [isTa ? 'விதி எண் (உயிர் எண்)' : 'Life Path Number', lifeNumDisplay],
        [isTa ? 'அதிர்ஷ்ட எண்கள் & தேதிகள்' : 'Lucky Numbers & Dates', `${nm.luckyNums || '---'} • ${nm.luckyDates || '---'}`],
        [isTa ? 'அதிர்ஷ்ட நிறங்கள்' : 'Lucky Colours', isTa ? (nm.luckyColorsTa || nm.luckyColors) : (nm.luckyColorsEn || nm.luckyColors)],
        [isTa ? 'அதிர்ஷ்ட ரத்தினம்' : 'Lucky Gemstone', isTa ? nm.luckyStonesTa : nm.luckyStonesEn],
        [isTa ? 'வழிபட வேண்டிய தெய்வம்' : 'Ishta Devata', isTa ? nm.deityTa : nm.deityEn],
        [isTa ? 'செல்ல வேண்டிய கோவில்கள்' : 'Recommended Temples', isTa ? nm.templesTa : nm.templesEn],
        [isTa ? 'நட்சத்திர நாம எழுத்துக்கள்' : 'Nakshatra Syllables', starSyllablesStr]
      ];
      const chaldean = [
        ['1', 'A, I, J, Q, Y'], ['2', 'B, K, R'], ['3', 'C, G, L, S'], ['4', 'D, M, T'],
        ['5', 'E, H, N, X'], ['6', 'U, V, W'], ['7', 'O, Z'], ['8', 'F, P']
      ];
      pages.push({
        key: 'sec-18',
        render: () => (
          <div className="h-full flex flex-col justify-between">
            <div>
              <A5SectionBanner num="18" titleEn="Astro-Numerology (Chaldean System)" titleTa="எண் கணிதம் (சால்டியன் நியூமராலஜி)" isTa={isTa} />
              <div className="border border-stone-400 rounded-sm overflow-hidden mb-2">
                <table className="w-full border-collapse text-[10px]">
                  <tbody className="divide-y divide-stone-200">
                    {rows.map(([k, v], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#FDFBF7]' : 'bg-white'}>
                        <td className="py-1 px-2 font-bold text-[#7A1A22] w-[42%] border-r border-stone-200">{k}</td>
                        <td className="py-1 px-2 font-semibold text-stone-900">{v || '---'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border border-stone-400 rounded-sm overflow-hidden">
                <div className="bg-[#FAF3E0] border-b border-stone-400 px-2 py-0.5 text-[9.6px] font-black text-[#7A1A22]">
                  {isTa ? 'சால்டியன் எண் – எழுத்து அட்டவணை' : 'Chaldean Alphabet Matrix (1–8)'}
                </div>
                <div className="grid grid-cols-4 divide-x divide-y divide-stone-200 text-[9.6px]">
                  {chaldean.map(([num, lets]) => (
                    <div key={num} className="p-1 text-center">
                      <span className="font-black text-[#7A1A22]">{num}:</span> <span className="font-mono font-semibold">{lets}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // =========================================================================
    // SECTION 19: ALL 16 JATHAGA YOGAS (2 A5 PAGES - ZERO SLICE!)
    // =========================================================================
    if (has(19)) {
      const ygData = horoscope?.jathagaYogasSection19Data || {};
      const allYogas = ygData.yogas || [];
      const activeCnt = ygData.presentCount ?? allYogas.filter(y => y.isPresent).length;
      const chunks = [
        { key: 'sec-19a', list: allYogas.slice(0, 8), label: `1/2 (${activeCnt}/${allYogas.length})` },
        { key: 'sec-19b', list: allYogas.slice(8, 16), label: `2/2 (${activeCnt}/${allYogas.length})` }
      ];
      chunks.forEach((ch) => {
        if (ch.list.length === 0) return;
        pages.push({
          key: ch.key,
          render: () => (
            <div className="h-full flex flex-col">
              <A5SectionBanner num="19" titleEn="Jathaga Yogas (Classical Combinations)" titleTa="ஜாதக யோகங்கள் (பாரம்பரிய அமைப்புகள்)" badge={ch.label} isTa={isTa} />
              <div className="grid grid-cols-2 gap-1 flex-1 content-start">
                {ch.list.map((yg, i) => (
                  <div key={i} className={`border px-1.5 py-1 rounded-sm text-[8.6px] leading-tight ${yg.isPresent ? 'border-emerald-400 bg-emerald-50/40' : 'border-stone-300 bg-[#FDFBF7]'}`}>
                    <div className="flex justify-between font-black text-[#7A1A22]">
                      <span className="truncate">{isTa ? yg.nameTa : yg.nameEn}</span>
                      <span className={`shrink-0 ml-1 ${yg.isPresent ? 'text-emerald-700' : 'text-stone-500'}`}>{isTa ? yg.strengthTa : yg.strengthEn}</span>
                    </div>
                    <div className="text-stone-600 line-clamp-1">{isTa ? yg.observationTa : yg.observationEn}</div>
                    <div className="text-stone-900 font-medium line-clamp-2">{isTa ? yg.phalanTa : yg.phalanEn}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        });
      });
    }

    // =========================================================================
    // SECTION 20: ALL 9 VIMSHOTTARI MAHA DASHAS & SIGNIFICATIONS (2 A5 PAGES)
    // =========================================================================
    if (has(20)) {
      const d20 = horoscope?.dashaSection20Data || {};
      const analytics = d20.dashaAnalytics || [];
      const list = analytics.length > 0 ? analytics : dashaTable;
      const chunks = [
        { key: 'sec-20a', items: list.slice(0, 5), label: '1/2' },
        { key: 'sec-20b', items: list.slice(5, 9), label: '2/2' }
      ];
      chunks.forEach((ch, idx) => {
        if (ch.items.length === 0) return;
        const isLast = idx === chunks.length - 1;
        pages.push({
          key: ch.key,
          render: () => (
            <div className="h-full flex flex-col justify-between">
              <div>
                <A5SectionBanner num="20" titleEn="Vimshottari Maha Dashas & Significations" titleTa="விம்சோத்தரி மகாதிசைகள் & பலன்கள்" badge={ch.label} isTa={isTa} />
                {idx === 0 && d20.moonCoordinates && (
                  <div className="border border-amber-300 bg-[#FAF3E0]/80 p-1.5 rounded-sm mb-1.5 text-[9px] leading-tight">
                    <div className="font-black text-[#7A1A22]">
                      {isTa ? 'சந்திர ஸ்புடம் & ஜனன தசை இருப்பு கணிதம்' : 'Birth Moon Coordinates & Balance Math'}:{' '}
                      {d20.moonCoordinates.dms} • {isTa ? d20.moonCoordinates.nakNameTa : d20.moonCoordinates.nakNameEn} ({isTa ? 'பாதம்' : 'Pd'} {d20.moonCoordinates.pada})
                    </div>
                    {d20.birthBalanceMathematics && (
                      <div className="text-stone-700">
                        {isTa ? 'கடந்த பாகை:' : 'Elapsed:'} {d20.birthBalanceMathematics.elapsedFractionPct}% •{' '}
                        {isTa ? 'மீதம்:' : 'Remaining:'} {d20.birthBalanceMathematics.remainingFractionPct}% •{' '}
                        <strong>{isTa ? d20.birthBalanceMathematics.engineBalance?.textTa : d20.birthBalanceMathematics.engineBalance?.textEn}</strong>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-1">
                  {ch.items.map((row, i) => {
                    const name = isTa ? (row.lordNameTa || row.lord?.nameTa) : (row.lordNameEn || row.lord?.nameEn);
                    const yrs = row.fullYears || row.lord?.years;
                    const ph = row.phalam || {};
                    return (
                      <div key={i} className={`border p-1 rounded-sm text-[9.8px] leading-tight ${row.isOngoingToday ? 'border-[#7A1A22] bg-amber-50/60' : 'border-stone-300 bg-[#FDFBF7]'}`}>
                        <div className="flex justify-between font-black text-[#7A1A22] border-b border-stone-200 pb-0.5 mb-0.5">
                          <span>{name} ({yrs} {isTa ? 'ஆ' : 'Yrs'})</span>
                          <span className="font-mono text-stone-700">{row.startDate} → {row.endDate}</span>
                        </div>
                        {ph.natureTa || ph.natureEn ? (
                          <div className="text-stone-700 font-semibold line-clamp-1">{isTa ? ph.natureTa : ph.natureEn}</div>
                        ) : null}
                        <div className="text-stone-900 mt-0.5 line-clamp-2">{isTa ? (ph.phalanTa || '---') : (ph.phalanEn || '---')}</div>
                        {(ph.favorableHousesTa || ph.favorableHousesEn || ph.gemstoneTa) && (
                          <div className="text-[9.5px] text-stone-600 mt-0.5 line-clamp-1">
                            <strong>{isTa ? 'வீடுகள்:' : 'Fav:'}</strong> {isTa ? (ph.favorableHousesTa || '-') : (ph.favorableHousesEn || '-')} •{' '}
                            {isTa ? `${ph.gemstoneTa || '-'} • ${ph.deityTa || '-'}` : `${ph.gemstoneEn || '-'} • ${ph.deityEn || '-'}`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {isLast && (
                <div className="text-center pt-1.5">
                  <span className="text-[11px] font-black text-[#7A1A22] tracking-widest border-b-2 border-[#7A1A22] pb-0.5">
                    {isTa ? '|| சுபம் ||' : '|| SUBHAM ||'}
                  </span>
                </div>
              )}
            </div>
          )
        });
      });
    }

    return pages.map((p, idx) => ({ ...p, pageNo: idx + 1, totalPages: pages.length }));
  }, [horoscope, selectedIds, isTa, birthData, chartStyle, letterhead, user, astrologerTitle, astrologerSubTitle, astrologerAddress, astrologerContact, invocationText, nativeName, dobDisplay, summary]);

  return (
    <div className="space-y-4">
      {/* TOP INTERACTIVE CONTROL BAR (Screen Only) */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-4 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A1A22] to-[#99222C] text-amber-100 flex items-center justify-center text-xl shadow-sm">
              📖
            </div>
            <div>
              <h2 className="text-base font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight flex flex-wrap items-center gap-2">
                <span>{isTa ? 'முழுமையான 20-பிரிவு ஜாதக புத்தகம்' : 'Complete 20-Section Horoscope Booklet'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700/60">
                  {isTa ? 'Half A4 (A5: 148 × 210 மி.மீ)' : 'Half A4 (A5: 148 × 210 mm)'}
                </span>
              </h2>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                {isTa
                  ? 'ஜாதகத் திரை பார்வையின் 20 பிரிவுகளும், அனைத்து அட்டவணைகள் மற்றும் சக்கரங்களுடன் Half A4 (A5: 148 × 210 mm / 5.83 × 8.27 in) அச்சு வடிவில்.'
                  : 'All 20 Horoscope Screen View sections with complete charts, tables, and significations formatted in Half A4 (A5: 148 × 210 mm / 5.83 × 8.27 in).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#7A1A22] dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold">
              {isTa
                ? `${selectedIds.length} பிரிவுகள் • ${generatedPages.length} A5 பக்கங்கள்`
                : `${selectedIds.length} Sections • ${generatedPages.length} A5 Pages`}
            </div>

            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setChartStyle('south')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  chartStyle === 'south' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                {isTa ? 'தென்னிந்தியா' : 'South'}
              </button>
              <button
                type="button"
                onClick={() => setChartStyle('north')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  chartStyle === 'north' ? 'bg-amber-600 text-white' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                {isTa ? 'வடஇந்தியா' : 'North'}
              </button>
            </div>

            {onSwitchToOnePage && (
              <button
                type="button"
                onClick={onSwitchToOnePage}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 text-xs font-bold cursor-pointer"
              >
                {isTa ? '1-பக்க A4' : '1-Page A4'}
              </button>
            )}

            {onSwitchToScreen && (
              <button
                type="button"
                onClick={onSwitchToScreen}
                className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600 text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{isTa ? 'திரை' : 'Screen'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] hover:from-[#5C1017] hover:to-[#7A1A22] text-amber-100 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isTa ? 'அரை A4 அச்சு / PDF' : 'Print / Save Half-A4 PDF'}</span>
            </button>
          </div>
        </div>

        {/* 20-Section Filter Checkboxes */}
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={selectAll} className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-[#7A1A22] dark:text-amber-300 text-[11px] font-bold cursor-pointer">
            {isTa ? 'அனைத்தும் (20)' : 'Select All (20)'}
          </button>
          <button type="button" onClick={selectCore} className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-bold cursor-pointer">
            {isTa ? 'முக்கிய பிரிவுகள்' : 'Core Summary'}
          </button>
          <button type="button" onClick={clearAll} className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 text-[11px] font-bold cursor-pointer">
            {isTa ? 'அனைத்தும் நீக்கு' : 'Clear All'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
          {HOROSCOPE_20_SECTIONS.map(sec => {
            const active = selectedIds.includes(sec.id);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => toggleSection(sec.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 text-[#7A1A22] dark:text-amber-300'
                    : 'bg-white dark:bg-[#1E1815] border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {active ? <CheckSquare className="w-3.5 h-3.5 text-[#7A1A22] dark:text-amber-300 shrink-0" /> : <Square className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
                <span className="truncate">{isTa ? sec.titleTa : sec.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* A4 MULTI-PAGE PRINT CANVAS (210 x 297 mm; Bordered Content Strictly on Top Half 144 mm, Bottom Half Blank) */}
      <div className="w-full overflow-x-auto pb-8">
        <div id="astrojit-horoscope-multipage" className="space-y-6 print:space-y-0">
          {generatedPages.length === 0 ? (
            <div className="bg-white dark:bg-[#1E1815] p-8 text-center text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-600 max-w-[210mm] mx-auto rounded-xl">
              {isTa ? 'எந்தப் பிரிவும் தேர்ந்தெடுக்கப்படவில்லை.' : 'No sections selected. Please select sections above.'}
            </div>
          ) : (
            generatedPages.map((pg) => (
              <div
                key={pg.key}
                className="bg-white text-black mx-auto shadow-xl p-2.5 print:p-0 print:shadow-none print:break-after-page half-a4-sheet flex flex-col justify-start"
                style={{
                  width: '210mm',
                  maxWidth: '210mm',
                  height: '297mm',
                  minHeight: '297mm',
                  maxHeight: '297mm',
                  boxSizing: 'border-box',
                  pageBreakAfter: 'always',
                  breakAfter: 'page',
                  fontFamily: isTa
                    ? "'Noto Serif Tamil', 'Source Serif 4', Georgia, serif"
                    : "'Source Serif 4', Georgia, serif"
                }}
              >
                {/* Maroon & Gold Traditional Outer Frame — lasts strictly for Top Half (~144mm) of the A4 page */}
                <div
                  className="border-[2px] border-[#7A1A22] p-[2px] flex flex-col shrink-0 overflow-hidden bg-white"
                  style={{ height: '144mm', maxHeight: '144mm' }}
                >
                  <div className="border border-amber-500/80 p-2 h-full flex flex-col justify-between bg-white">
                    {/* Running Page Header (Pages 2+) */}
                    {pg.pageNo > 1 && (
                      <div className="flex items-center justify-between border-b border-amber-400/70 pb-0.5 mb-1 text-[9.5px] font-bold shrink-0">
                        <span className="truncate max-w-[40%] text-[#7A1A22]">{nativeName} • {dobDisplay}</span>
                        <span className="truncate max-w-[42%] uppercase text-stone-600">{astrologerTitle}</span>
                        <span className="font-mono text-[#7A1A22]">{pg.pageNo} / {pg.totalPages}</span>
                      </div>
                    )}

                    {/* Main Page Body */}
                    <div className="flex-1 overflow-hidden min-h-0">
                      {pg.render()}
                    </div>

                    {/* Running Page Footer */}
                    <div className="border-t border-amber-400/70 mt-1 pt-0.5 flex justify-between items-center text-[8.8px] text-stone-600 font-mono shrink-0">
                      <span>{printedDateTime} • Thirukanitha Ephemeris (Lahiri)</span>
                      <span>AstroJit • Page {pg.pageNo} of {pg.totalPages}</span>
                    </div>
                  </div>
                </div>

                {/* Remaining bottom half of the A4 page intentionally left 100% blank */}
                <div className="flex-1 bg-white print:bg-white" aria-hidden="true" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
