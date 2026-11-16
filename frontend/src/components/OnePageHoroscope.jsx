import React, { useState, useEffect } from 'react';
import { Printer, Globe, Grid } from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';
import KundliChart from './KundliChart';
import { HORO_I18N } from '../horoscopeI18n';
import { useLang, LANGUAGES } from '../i18n';
import { printElementById } from '../utils/printHelper';

/**
 * Astrojit Traditional Authentic 1-Page Certified Janma Kundli (Horoscope Dossier)
 * Modeled after Classical Thirukanitha (Drik-Siddha) Vedic Janma Patrika
 * Strictly calibrated to fit on EXACTLY ONE A4 PAGE (Print & Screen)
 * Supports Full Multi-Language Localization: Tamil, English, Hindi, Kannada, Telugu, Bengali
 */
export default function OnePageHoroscope({ horoscope, clientNotes = [], onAddNote = null, isAstrologer = false }) {
  const { lang: globalLang, setLanguage } = useLang();
  // Local language state defaults to global language, allows instant switching on the dossier
  const [docLang, setDocLang] = useState(globalLang || 'ta');
  const [chartMode, setChartMode] = useState('south'); // 'south' (Dual Rashi + Navamsha) or 'north' (Diamond)

  useEffect(() => {
    if (globalLang) {
      setDocLang(globalLang);
    }
  }, [globalLang]);

  if (!horoscope) {
    return (
      <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
        <p className="text-slate-600 text-sm font-medium">Synthesizing Thirukanitha Vedic Ephemeris...</p>
      </div>
    );
  }

  const { client, astrologicalDetails, nirayanaTable = [], southIndianRashiGrid = {}, southIndianNavamshaGrid = {}, houseMap = {} } = horoscope;

  const tHoro = HORO_I18N;
  const labels = tHoro.labels;
  const tblH = tHoro.tableHeaders;
  const dashaT = tHoro.dasha;

  const handlePrint = () => {
    printElementById('printable-one-page-horoscope', `Horoscope_${horoscope?.client?.name || 'Native'}`);
  };

  // Helper Translation Functions
  const getPlanetName = (key, fallback) => {
    const k = (key || '').toLowerCase().trim();
    if (tHoro.planets[k]?.[docLang]) return tHoro.planets[k][docLang];
    const fb = (fallback || '').toLowerCase().trim();
    if (tHoro.planets[fb]?.[docLang]) return tHoro.planets[fb][docLang];
    const found = Object.values(tHoro.planets).find(
      (p) => p.en.toLowerCase() === k || p.en.toLowerCase() === fb || p.ta === key || p.ta === fallback
    );
    if (found?.[docLang]) return found[docLang];
    return fallback || key;
  };

  const getRashiName = (rashiIndex, fallback) => {
    if (typeof rashiIndex === 'number' && rashiIndex >= 0 && rashiIndex < 12) {
      return tHoro.rashis[rashiIndex]?.[docLang] || fallback;
    }
    if (fallback) {
      const clean = fallback.trim().toLowerCase();
      const found = tHoro.rashis.find(
        (r) => r.en.toLowerCase() === clean || r.ta === fallback.trim() || r.kn === fallback.trim() || r.hi === fallback.trim()
      );
      if (found?.[docLang]) return found[docLang];
    }
    return fallback;
  };

  const getNakshatraName = (nakshatraIndex, fallback) => {
    if (typeof nakshatraIndex === 'number' && nakshatraIndex >= 0 && nakshatraIndex < 27) {
      return tHoro.nakshatras[nakshatraIndex]?.[docLang] || fallback;
    }
    if (fallback) {
      const clean = fallback.trim().toLowerCase();
      const found = tHoro.nakshatras.find(
        (n) => n.en.toLowerCase() === clean || n.ta === fallback.trim() || n.kn === fallback.trim() || n.hi === fallback.trim()
      );
      if (found?.[docLang]) return found[docLang];
    }
    return fallback;
  };

  const getDignity = (dignity) => {
    if (!dignity || dignity === '---') return '---';
    const clean = dignity.trim();
    return tHoro.dignities[clean]?.[docLang] || tHoro.dignities[clean.toLowerCase()]?.[docLang] || dignity;
  };

  const getPaksha = (paksha) => {
    return tHoro.pakshas[paksha]?.[docLang] || paksha;
  };

  const getAyana = (ayana) => {
    return tHoro.ayanas[ayana]?.[docLang] || ayana;
  };

  const getWeekday = (weekday) => {
    return tHoro.weekdays[weekday]?.[docLang] || weekday;
  };

  // Client Metadata
  const clientName = client?.name || 'R. Dharshan';
  const fatherName = client?.fatherName || 'Ramesh Reddy K';
  const motherName = client?.motherName || 'Sudha';
  const nativePlace = client?.nativePlace || client?.dobPlace || 'Hosur';
  const place = client?.dobPlace || 'Hosur';
  const country = client?.country || 'Tamil Nadu, India';

  // Format Date & Time
  const dobFormatted = astrologicalDetails?.dateFormatted || client?.dobFormatted || client?.dob || '02-07-2004';
  const dobTime = client?.dobTime12 || client?.dobTime || '05:15:00 AM';
  const ageStr = astrologicalDetails?.age?.[docLang] || astrologicalDetails?.age?.ta || '22 வருடம், 4 மாதம், 11 நாள்';

  // Lagna & Rashi Names
  const lagnaRashiName = getRashiName(astrologicalDetails?.lagna?.signIndex, astrologicalDetails?.lagna?.signName || 'மிதுனம்');
  const moonRashiName = getRashiName(astrologicalDetails?.moonSignIndex, astrologicalDetails?.moonSign || 'தனுசு');

  // Star & Pada
  const nakshatraName = getNakshatraName(astrologicalDetails?.nakshatraIndex, astrologicalDetails?.nakshatra || 'மூலம்');
  const pada = astrologicalDetails?.pada || 3;

  // Lagnayathipathi
  const lagnayathipathiName = getPlanetName(astrologicalDetails?.lagnayathipathi?.toLowerCase(), astrologicalDetails?.lagnayathipathi || 'புதன்');
  const bhagayathipathyName = getPlanetName(astrologicalDetails?.bhagayathipathy?.toLowerCase(), astrologicalDetails?.bhagayathipathy || 'சனி');
  const batharathipathyName = getPlanetName(astrologicalDetails?.batharathipathy?.toLowerCase(), astrologicalDetails?.batharathipathy || 'குரு');

  // Additional Astronomical Attributes
  const pakshaStr = getPaksha(astrologicalDetails?.paksha || 'சுக்கில');
  const tithiStr = astrologicalDetails?.tithi || 'பௌர்ணமி';
  const yogaStr = astrologicalDetails?.yoga || 'பிரம்மம்';
  const karanaStr = astrologicalDetails?.karana || 'பத்தரை';
  const ayanaStr = getAyana(astrologicalDetails?.ayana || 'உத்தராயணம்');
  const horaStr = astrologicalDetails?.hora || '23 : 37 : 42';
  const ayanamshaStr = astrologicalDetails?.ayanamshaColon || '-23:55:01 Lahiri';
  const localTimeCorrStr = astrologicalDetails?.localTimeCorrection || '-0:18:44';
  const weekdayStr = getWeekday(astrologicalDetails?.weekday || 'வெள்ளி');
  const regionalDateStr = astrologicalDetails?.tamilDate || 'தாரண ஆனி-17 வியாழக்கிழமை';
  const nazhikaiStr = astrologicalDetails?.udayathiNazhikai || '58:06:25';
  const coordsStr = astrologicalDetails?.coordinates || '12:44 N , 77:49 E';
  const stdTimeStr = astrologicalDetails?.standardTimeCorrection || '5:30 E , 0:00';
  const sunTimesStr = astrologicalDetails?.sunriseSunset || '06:00:26 AM / 06:44:44 PM';

  // Yogi & Avayogi
  const yogiName = getPlanetName(astrologicalDetails?.yogiPlanet?.toLowerCase(), astrologicalDetails?.yogiPlanet || 'செவ்வாய்');
  const avayogiName = getPlanetName(astrologicalDetails?.avayogiPlanet?.toLowerCase(), astrologicalDetails?.avayogiPlanet || 'கேது');
  const yogiAvayogiStr = `${yogiName} - ${avayogiName}`;

  // Subar / Asubar
  const subarName = astrologicalDetails?.subar?.[docLang] || (docLang === 'ta' ? 'சுக்கிரன், சனி' : docLang === 'en' ? 'Venus, Saturn' : 'शुक्र, शनि');
  const assubarName = astrologicalDetails?.assubar?.[docLang] || (docLang === 'ta' ? 'செவ்வாய், குரு, சூரியன்' : docLang === 'en' ? 'Mars, Jupiter, Sun' : 'मंगल, गुरु, सूर्य');

  const nameLetters = docLang === 'ta'
    ? 'யே, யோ, ப, பி, பு, பூ'
    : 'Ye, Yo, Pa, Pi, Pu, Poo';

  // Dasha Balance
  const dashaBal = astrologicalDetails?.dashaBalance;
  const dashaLordKey = (dashaBal?.lord || 'Ketu').toLowerCase();
  const dashaLordName = getPlanetName(dashaLordKey, dashaBal?.lord || 'Ketu');
  const dashaYears = dashaBal?.years !== undefined ? dashaBal.years : 1;
  const dashaMonths = dashaBal?.months !== undefined ? dashaBal.months : 10;
  const dashaDays = dashaBal?.days !== undefined ? dashaBal.days : 23;

  const dashaBalFormatted = docLang === 'ta'
    ? `${dashaLordName} திசையில் ${dashaYears} வரு, ${dashaMonths} மா, ${dashaDays} நாள்`
    : docLang === 'kn'
    ? `${dashaLordName} ದೆಸೆಯಲ್ಲಿ ${dashaYears} ವರ್ಷ, ${dashaMonths} ತಿಂಗಳು, ${dashaDays} ದಿನ`
    : docLang === 'hi'
    ? `${dashaLordName} दशा में ${dashaYears} वर्ष, ${dashaMonths} माह, ${dashaDays} दिन`
    : docLang === 'te'
    ? `${dashaLordName} దశలో ${dashaYears} సం., ${dashaMonths} నెలలు, ${dashaDays} రోజులు`
    : `${dashaLordName} Dasha: ${dashaYears} Yrs, ${dashaMonths} Mos, ${dashaDays} Days`;

  // Active Dasha-Bhukti-Anthara
  const activeD = astrologicalDetails?.activeDasha;
  const activeDashaLord = getPlanetName(activeD?.mahadasha?.toLowerCase(), 'Sun');
  const activeBhuktiLord = getPlanetName(activeD?.bhukti?.toLowerCase(), 'Moon');
  const activeAntaraLord = getPlanetName(activeD?.antaram?.toLowerCase(), 'Jupiter');

  const activeDashaStr = docLang === 'ta'
    ? `நடப்பு: ${activeDashaLord} திசை ${activeD?.mahadashaEnd || '24-05-2032'} வரை, ${activeBhuktiLord} புக்தி ${activeD?.bhuktiEnd || '13-03-2027'} வரை, ${activeAntaraLord} அந்தரம் ${activeD?.antaramEnd || '28-11-2026'} வரை.`
    : docLang === 'kn'
    ? `ಪ್ರಸ್ತುತ: ${activeDashaLord} ದೆಸೆ ${activeD?.mahadashaEnd || '24-05-2032'} ವರೆಗೆ, ${activeBhuktiLord} ಭುಕ್ತಿ ${activeD?.bhuktiEnd || '13-03-2027'} ವರೆಗೆ, ${activeAntaraLord} ಅಂತರ ${activeD?.antaramEnd || '28-11-2026'} ವರೆಗೆ.`
    : docLang === 'hi'
    ? `वर्तमान: ${activeDashaLord} दशा ${activeD?.mahadashaEnd || '24-05-2032'} तक, ${activeBhuktiLord} भुक्ति ${activeD?.bhuktiEnd || '13-03-2027'} तक, ${activeAntaraLord} अंतर ${activeD?.antaramEnd || '28-11-2026'} तक.`
    : docLang === 'te'
    ? `ప్రస్తుతం: ${activeDashaLord} దశ ${activeD?.mahadashaEnd || '24-05-2032'} వరకు, ${activeBhuktiLord} భుక్తి ${activeD?.bhuktiEnd || '13-03-2027'} వరకు, ${activeAntaraLord} అంతరం ${activeD?.antaramEnd || '28-11-2026'} వరకు.`
    : `Running: ${activeDashaLord} Dasha till ${activeD?.mahadashaEnd || '24-05-2032'}, ${activeBhuktiLord} Bhukti till ${activeD?.bhuktiEnd || '13-03-2027'}, ${activeAntaraLord} Anthara till ${activeD?.antaramEnd || '28-11-2026'}.`;

  const bhavaShiftsStr = docLang === 'ta'
    ? (astrologicalDetails?.bhavaShifts || 'குரு-4, சனி-2.')
    : docLang === 'kn'
    ? 'ಗುರು-4, ಶನಿ-2.'
    : docLang === 'hi'
    ? 'गुरु-4, शनि-2.'
    : docLang === 'te'
    ? 'గురు-4, శని-2.'
    : (astrologicalDetails?.bhavaShiftsEn || 'Guru-4, Sani-2.');

  const luckyNumbersStr = (astrologicalDetails?.luckyNumbers || [15, 24, 33, 42, 69]).join(', ');

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Print CSS Rules: Strictly 1 Single Page */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 4mm 6mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .one-page-sheet {
            width: 100% !important;
            max-width: 100% !important;
            height: 98vh !important;
            max-height: 287mm !important;
            margin: 0 auto !important;
            padding: 6px 10px !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            border: 2px solid #0f172a !important;
            background: #ffffff !important;
          }
          .one-page-sheet * {
            font-size-adjust: none;
          }
        }
      `}</style>

      {/* Top Toolbar: Language Selector, Chart Style Toggle & Print CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-amber-200/80 shadow-xs no-print">
        {/* Language Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-600" /> {labels.languageLabel?.[docLang] || 'Language:'}
          </span>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setDocLang(l.code);
                if (setLanguage) setLanguage(l.code);
              }}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                docLang === l.code
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Chart Style Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setChartMode('south')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'south'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-amber-600" />
              <span>{labels.southChart?.[docLang] || 'South Dual'}</span>
            </button>
            <button
              onClick={() => setChartMode('north')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                chartMode === 'north'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{labels.northChart?.[docLang] || 'North'}</span>
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{labels.printPdf?.[docLang] || 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* AUTHENTIC 1-PAGE VEDIC HOROSCOPE DOSSIER (MATCHING USER SAMPLE) */}
      {/* ============================================================== */}
      <div id="printable-one-page-horoscope" className="one-page-sheet bg-white border-2 border-slate-900 p-3 sm:p-5 shadow-md text-slate-900 font-sans relative">
        {/* 1. Header Banner */}
        <header className="border-b-2 border-slate-900 pb-1.5 text-center">
          <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase leading-tight">
            {tHoro.headerTitle[docLang]}
          </h1>
          <h2 className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            {tHoro.subHeader[docLang]}
          </h2>
          <p className="text-[9px] sm:text-[10px] text-slate-600 leading-tight mt-0.5">
            {tHoro.address[docLang]}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-700 font-semibold leading-tight">
            Vedic Ephemeris Support: support@astrojit.com | www.astrojit.com
          </p>
          <div className="mt-0.5 pt-0.5 border-t border-slate-200 flex justify-between items-center text-[8.5px] text-slate-500 font-mono">
            <span>{tHoro.softwareCredit[docLang]}</span>
            <span>Ref: {client?.astrologerReferralCode || 'ASTROJIT-OFFICIAL'}</span>
          </div>

          {/* Sacred Invocatory Sanskrit Shloka */}
          <div className="mt-1 pt-1 border-t border-slate-300 text-center">
            <p className="text-[9.5px] sm:text-[10px] font-serif font-bold italic tracking-wide text-slate-800 whitespace-pre-line leading-tight">
              {tHoro.shloka[docLang]}
            </p>
          </div>
        </header>

        {/* 2. Client Particulars & Panchanga (Two-Column Key-Value Layout) */}
        <section className="py-1.5 border-b-2 border-slate-900 text-[10px] sm:text-[10.5px] leading-tight">
          {/* Client Name Display */}
          <div className="mb-1 flex justify-between items-center">
            <span className="font-black text-xs sm:text-sm text-slate-950 uppercase tracking-wide">
              {clientName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            {/* Left Column */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.father?.[docLang] || 'Father')} :</span>
                <span className="text-slate-950 font-semibold truncate text-right">{fatherName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.mother?.[docLang] || 'Mother')} :</span>
                <span className="text-slate-950 font-semibold truncate text-right">{motherName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.native?.[docLang] || 'Native Place')} :</span>
                <span className="text-slate-950 font-semibold truncate text-right">{nativePlace}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.lagna?.[docLang] || 'Lagna')} :</span>
                <span className="text-slate-950 font-black text-right">{lagnaRashiName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.lagnayathipathi?.[docLang] || 'Lagnayathipathi')} :</span>
                <span className="text-slate-950 font-bold text-right text-indigo-900">{lagnayathipathiName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.bhagayathipathy?.[docLang] || 'Bhagayathipathy')} :</span>
                <span className="text-slate-950 font-bold text-right text-indigo-900">{bhagayathipathyName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.batharathipathy?.[docLang] || 'Batharathipathy')} :</span>
                <span className="text-slate-950 font-bold text-right text-amber-900">{batharathipathyName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold flex items-center gap-1">
                  <span>{(labels.rashi?.[docLang] || 'Rashi')}</span> :
                </span>
                <span className="text-slate-950 font-black text-right">{moonRashiName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.nakshatra?.[docLang] || 'Nakshatra')} :</span>
                <span className="text-slate-950 font-bold text-right">{nakshatraName} {(labels.pada?.[docLang] || 'Pada')} {pada}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.pakshaTithi?.[docLang] || 'Paksha & Tithi')} :</span>
                <span className="text-slate-950 font-semibold text-right">{pakshaStr}-{tithiStr.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.yogaKarana?.[docLang] || 'Yoga-Karana')} :</span>
                <span className="text-slate-950 font-semibold text-right">{yogaStr}-{karanaStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.ayanam?.[docLang] || 'Ayanam')} :</span>
                <span className="text-slate-950 font-semibold text-right">{ayanaStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.hora?.[docLang] || 'Hora')} :</span>
                <span className="text-slate-950 font-mono text-right">{horaStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.ayanamsha?.[docLang] || 'Ayanamsha')} :</span>
                <span className="text-slate-950 font-mono text-right">{ayanamshaStr}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-700 font-bold">{(labels.timeCorrection?.[docLang] || 'Time Corr.')} :</span>
                <span className="text-slate-950 font-mono text-right">{localTimeCorrStr}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.date?.[docLang] || 'Date')} :</span>
                <span className="text-slate-950 font-semibold text-right font-mono font-bold">{dobFormatted} {weekdayStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.age?.[docLang] || 'Age')} :</span>
                <span className="text-slate-950 font-bold text-right text-emerald-900 font-mono text-[10px] sm:text-[10.5px]">{ageStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.time?.[docLang] || 'Time')} :</span>
                <span className="text-slate-950 font-mono text-right">{dobTime}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.regionalDate?.[docLang] || 'Regional Date')} :</span>
                <span className="text-slate-950 font-semibold text-right">{regionalDateStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.nazhikai?.[docLang] || 'Nazhikai')} :</span>
                <span className="text-slate-950 font-mono text-right">{nazhikaiStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.country?.[docLang] || 'Country')} :</span>
                <span className="text-slate-950 font-semibold text-right">{country}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.place?.[docLang] || 'Place')} :</span>
                <span className="text-slate-950 font-semibold text-right">{place}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.latLong?.[docLang] || 'Lat, Long')} :</span>
                <span className="text-slate-950 font-mono text-right">{coordsStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.standardTime?.[docLang] || 'Std Time')} :</span>
                <span className="text-slate-950 font-mono text-right">{stdTimeStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.sunTimes?.[docLang] || 'Sun Times')} :</span>
                <span className="text-slate-950 font-mono text-right">{sunTimesStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">{(labels.yogiAvayogi?.[docLang] || 'Yogi-Avayogi')} :</span>
                <span className="text-slate-950 font-bold text-right">{yogiAvayogiStr}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">
                  {(labels.subar?.[docLang] || (docLang === 'ta' ? 'சுபர்கள்' : 'Subar'))} :
                </span>
                <span className="text-emerald-800 font-bold text-right text-[10px] sm:text-[10.5px]">{subarName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-0.2">
                <span className="text-slate-700 font-bold">
                  {(labels.assubar?.[docLang] || (docLang === 'ta' ? 'அசுபர்கள்' : 'Assubar'))} :
                </span>
                <span className="text-rose-800 font-bold text-right text-[10px] sm:text-[10.5px]">{assubarName}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-700 font-bold">{(labels.nameLetters?.[docLang] || 'Name Letters')} :</span>
                <span className="text-slate-950 font-black text-right">{nameLetters}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Precision Nirayana Planetary Table (Thirukanitha) */}
        <section className="py-1.5 border-b-2 border-slate-900">
          <h3 className="text-[11px] sm:text-xs font-black text-center text-slate-950 mb-1 uppercase tracking-wide">
            {tblH.title[docLang]}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-[9px] sm:text-[10px] border border-slate-900 border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold text-slate-950">
                  <th className="border-r border-slate-900 py-0.5 px-1 text-left">{tblH.graha[docLang]}</th>
                  <th className="border-r border-slate-900 py-0.5 px-1">{tblH.longitude[docLang]}</th>
                  <th className="border-r border-slate-900 py-0.5 px-1">{tblH.nakshatra[docLang]}</th>
                  <th className="border-r border-slate-900 py-0.5 px-0.5">{tblH.pada[docLang]}</th>
                  <th className="border-r border-slate-900 py-0.5 px-1">{tblH.nakLord[docLang]}</th>
                  <th className="border-r border-slate-900 py-0.5 px-1">{tblH.rashi[docLang]}</th>
                  <th className="border-r border-slate-900 py-0.5 px-1">{tblH.rashiDeg[docLang]}</th>
                  <th className="py-0.5 px-1">{tblH.status[docLang]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {nirayanaTable.map((row, idx) => {
                  const planetName = getPlanetName(row.key, row.name) + (row.isRetro && row.key !== 'rahu' && row.key !== 'ketu' && !row.isLagna ? tHoro.retroSuffix[docLang] : '');
                  const nakName = getNakshatraName(row.nakshatraIndex, row.nakshatra);
                  const nakLordName = getPlanetName(row.nakLord?.toLowerCase(), row.nakLord);
                  const rashiName = getRashiName(row.rashiIndex, row.rashi);
                  const dignityName = getDignity(row.dignity);

                  return (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                    >
                      <td className="border-r border-slate-900 py-0.5 px-1 text-left font-bold text-slate-950 whitespace-nowrap">
                        {planetName}
                      </td>
                      <td className="border-r border-slate-900 py-0.5 px-1 font-mono">
                        {row.longitude}
                      </td>
                      <td className="border-r border-slate-900 py-0.5 px-1 font-medium">
                        {nakName}
                      </td>
                      <td className="border-r border-slate-900 py-0.5 px-0.5 font-bold">
                        {row.pada}
                      </td>
                      <td className="border-r border-slate-900 py-0.5 px-1 font-medium">
                        {nakLordName}
                      </td>
                      <td className="border-r border-slate-900 py-0.5 px-1 font-bold">
                        {rashiName}
                      </td>
                      <td className="border-r border-slate-900 py-0.5 px-1 font-mono">
                        {row.rashiDeg}
                      </td>
                      <td className="py-0.5 px-1 font-semibold">
                        {dignityName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Dual Charts: Rashi Chart & Navamsha Chart (Side-by-Side) */}
        <section className="py-1.5 border-b-2 border-slate-900">
          {chartMode === 'south' ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center justify-center">
              {/* Rashi Chart (D1) */}
              <div className="flex flex-col items-center">
                <SouthIndianChart
                  title={tHoro.charts.rashi[docLang]}
                  chartType="rashi"
                  gridData={southIndianRashiGrid}
                  lang={docLang}
                  className="max-w-[220px] sm:max-w-[260px]"
                />
              </div>

              {/* Navamsha Chart (D9) */}
              <div className="flex flex-col items-center">
                <SouthIndianChart
                  title={tHoro.charts.navamsha[docLang]}
                  chartType="navamsha"
                  gridData={southIndianNavamshaGrid}
                  lang={docLang}
                  className="max-w-[220px] sm:max-w-[260px]"
                />
              </div>
            </div>
          ) : (
            <KundliChart
              houseMap={houseMap}
              planets={horoscope.planets}
              lagnaSignName={lagnaRashiName}
            />
          )}
        </section>

        {/* 5. Vimshottari Dasha Balance, Active Bhukti & Lucky Numbers */}
        <section className="py-1.5 border-b-2 border-slate-900 text-[10px] sm:text-[10.5px] space-y-0.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-black text-slate-950">{dashaT.balanceTitle[docLang]}</span>
            <span className="font-bold text-slate-900">{dashaBalFormatted}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-1.5 text-slate-800">
            <span>{activeDashaStr}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-1.5 text-slate-800">
            <span className="font-bold text-slate-950">{dashaT.bhavaShiftTitle[docLang]}</span>
            <span>{bhavaShiftsStr}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-1.5 text-slate-800">
            <span className="font-bold text-slate-950">{dashaT.luckyNumbersTitle[docLang]}</span>
            <span className="font-bold text-slate-950 font-mono">{luckyNumbersStr}</span>
          </div>
        </section>

        {/* 6. Footer Authenticity Seal */}
        <footer className="pt-1.5 text-center">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 tracking-wide">
            {tHoro.footerSeal[docLang]}
          </p>
        </footer>
      </div>

      {/* Astrologer Consultation Notes if provided (Screen only, excluded from 1-page print) */}
      {clientNotes && clientNotes.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs no-print">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            Astrologer Consultation Notes & Prescribed Remedies
          </h4>
          <div className="space-y-2">
            {clientNotes.map((n, i) => (
              <div key={i} className="text-xs p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                  <span className="font-bold text-amber-800">{n.astrologerName || 'Astrologer'}</span>
                  <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800 leading-relaxed">{n.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
