import React, { useState, useMemo } from 'react';
import {
  PRESETS,
  RASHIS,
  NAKSHATRAS,
  WEEKDAYS,
  DASHA_LORDS,
  calculateThirukanithaHoroscope
} from '../utils/thirukanithaEngine';

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

export default function ThirukanithaHoroscopeView({ initialData, onClose }) {
  const [lang, setLang] = useState('ta'); // 'ta' or 'en'
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // Form State
  const [form, setForm] = useState(() => ({
    name: initialData?.name || 'Aarav Kumar',
    dob: initialData?.dob || '2026-11-05',
    dobTime: initialData?.dobTime || '21:04',
    placeName: initialData?.placeName || 'Salem',
    lat: initialData?.lat !== undefined ? initialData.lat : 11.65,
    lon: initialData?.lon !== undefined ? initialData.lon : 78.20,
    utcOffset: initialData?.utcOffset !== undefined ? initialData.utcOffset : 5.5
  }));

  const [activeChartKey, setActiveChartKey] = useState('D1');
  const [expandedMdIndex, setExpandedMdIndex] = useState(0);

  // Compute Horoscope (All client-side)
  const horoscope = useMemo(() => {
    return calculateThirukanithaHoroscope(form);
  }, [form]);

  const handlePresetChange = (e) => {
    const pName = e.target.value;
    const p = PRESETS.find(item => item.name === pName);
    if (p) {
      setForm(prev => ({
        ...prev,
        placeName: p.name,
        lat: p.lat,
        lon: p.lon
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isTamil = lang === 'ta';

  // Labels Dictionary
  const T = {
    title: isTamil ? 'திருக்கணித பஞ்சாங்க ஜாதகம்' : 'Thirukanitha Vedic Horoscope',
    subtitle: isTamil
      ? 'திருவானைக்காவல் / தஞ்சை திருக்கணித வாக்கிய முறைப்படி அமைக்கப்பட்ட வேத ஜோதிடக் கணிப்பு'
      : 'Authentic Drik Ganitha Sidereal Ephemeris & Parashara Vedic System',
    calcForm: isTamil ? 'பிறப்பு விவரப் படிவம்' : 'Birth Details Input',
    name: isTamil ? 'பெயர்' : 'Full Name',
    dob: isTamil ? 'பிறந்த தேதி' : 'Date of Birth',
    time: isTamil ? 'பிறந்த நேரம் (உள்ளூர்)' : 'Birth Time (Local)',
    place: isTamil ? 'ஊர் (முன் தேர்வு)' : 'Place Preset',
    latitude: isTamil ? 'அட்சரேகை (Lat °N)' : 'Latitude (°N)',
    longitude: isTamil ? 'தீர்க்கரேகை (Lon °E)' : 'Longitude (°E)',
    utcOffset: isTamil ? 'UTC ஆஃப்செட் (Hours)' : 'UTC Offset (Hours)',
    calculate: isTamil ? 'ஜாதகம் கணிக்க' : 'Recalculate Horoscope',
    birthSummary: isTamil ? 'ஜனன விவரக் குறிப்பு' : 'Birth & Planetary Summary',
    ayanamsha: isTamil ? 'அயனாம்சம் (Lahiri)' : 'Ayanamsha (Lahiri)',
    obliquity: isTamil ? 'சாய்கோணம் (Obliquity ε)' : 'Obliquity (ε)',
    lagna: isTamil ? 'லக்னம்' : 'Ascendant (Lagna)',
    rasi: isTamil ? 'ராசி (சந்திரன்)' : 'Moon Sign (Rasi)',
    nakshatra: isTamil ? 'நட்சத்திரம்' : 'Birth Star (Nakshatra)',
    pada: isTamil ? 'பாதம்' : 'Pada',
    tithi: isTamil ? 'திதி' : 'Tithi',
    weekday: isTamil ? 'கிழமை' : 'Weekday',
    dashaBalance: isTamil ? 'திசா இருப்பு (பிறப்பில்)' : 'Dasha Balance at Birth',
    charts: isTamil ? 'வர்க்கச் சக்கரங்கள் (South Indian 4×4)' : 'Divisional Charts (South Indian)',
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
    printPdf: isTamil ? 'அச்சு / PDF சேமிக்க' : 'Save as PDF / Print',
    close: isTamil ? 'மூடுக' : 'Close',
    darkToggle: isTamil ? (theme === 'dark' ? '☀️ பகல் முறை' : '🌙 இரவு முறை') : (theme === 'dark' ? '☀️ Light' : '🌙 Dark')
  };

  const isDark = theme === 'dark';

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
        {/* Top Control Bar (Screen Only) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 dark:bg-[#251E1A] p-3 sm:p-4 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs backdrop-blur-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪐</span>
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight">
                {T.title}
              </h1>
              <p className="text-[11px] text-[#7A1A22]/80 dark:text-stone-400 font-medium">
                {T.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Toggle */}
            <div className="flex items-center bg-amber-900/10 dark:bg-stone-800 p-0.5 rounded-xl border border-amber-900/20">
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isTamil ? 'bg-[#7A1A22] text-amber-100 shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isTamil ? 'bg-[#7A1A22] text-amber-100 shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {T.darkToggle}
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 hover:from-[#5C1017] hover:to-[#7A1A22] text-xs font-bold shadow-md shadow-red-950/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>{T.printPdf}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                {T.close}
              </button>
            )}
          </div>
        </div>

        {/* SECTION 1: Input Form (Hidden on Print) */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-6 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs print:hidden space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] border-b border-amber-900/10 pb-2 flex items-center gap-2">
            <span>📝</span>
            <span>{T.calcForm}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold mb-1 opacity-90">{T.name}</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7A1A22]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-90">{T.dob}</label>
              <input
                type="date"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7A1A22]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-90">{T.time}</label>
              <input
                type="time"
                step="1"
                value={form.dobTime}
                onChange={e => setForm({ ...form, dobTime: e.target.value })}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#7A1A22]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-90">{T.place}</label>
              <select
                value={form.placeName}
                onChange={handlePresetChange}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#7A1A22] cursor-pointer"
              >
                {PRESETS.map(p => (
                  <option key={p.name} value={p.name}>
                    {isTamil ? `${p.labelTa} (${p.lat}°N, ${p.lon}°E)` : `${p.name} (${p.lat}°N, ${p.lon}°E)`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-90">{T.latitude}</label>
              <input
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={e => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#7A1A22]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-90">{T.longitude}</label>
              <input
                type="number"
                step="0.0001"
                value={form.lon}
                onChange={e => setForm({ ...form, lon: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#7A1A22]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 opacity-90">{T.utcOffset}</label>
              <input
                type="number"
                step="0.5"
                value={form.utcOffset}
                onChange={e => setForm({ ...form, utcOffset: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#7A1A22]"
              />
            </div>
          </div>
        </div>

        {/* PRINT HEADER (Shown in Print Mode / Clean Official Header) */}
        <div className="text-center pb-2 border-b-2 border-[#7A1A22] space-y-1">
          <div className="text-xs uppercase tracking-widest text-[#B8860B] dark:text-[#E5C158] font-black">
            ॐ ஸ்ரீ கணபதயே நமஹ • ஶுபம் பவது
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight">
            {T.title}
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            {form.name} • {form.dob} ({form.dobTime}) • {form.placeName} ({form.lat}°N, {form.lon}°E, UTC+{form.utcOffset})
          </p>
        </div>

        {/* SECTION 2: Birth Summary Strip */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs">
          <h2 className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] mb-3 pb-1 border-b border-amber-900/10 flex items-center gap-2">
            <span>✨</span>
            <span>{T.birthSummary}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-xs">
            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.ayanamsha}</span>
              <strong className="text-xs font-mono text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {horoscope.summary.ayanamshaDMS}
              </strong>
            </div>

            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.lagna}</span>
              <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {isTamil ? RASHIS[horoscope.summary.lagnaRasi].ta : RASHIS[horoscope.summary.lagnaRasi].en} ({horoscope.summary.lagnaDegInSign})
              </strong>
            </div>

            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.rasi}</span>
              <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {isTamil ? RASHIS[horoscope.summary.moonRasi].ta : RASHIS[horoscope.summary.moonRasi].en}
              </strong>
            </div>

            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.nakshatra}</span>
              <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {isTamil ? NAKSHATRAS[horoscope.summary.moonNak].ta : NAKSHATRAS[horoscope.summary.moonNak].en} - {horoscope.summary.moonPada} {T.pada}
              </strong>
            </div>

            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.tithi}</span>
              <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {isTamil ? horoscope.summary.tithiNameTa : horoscope.summary.tithiNameEn}
              </strong>
            </div>

            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.weekday}</span>
              <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {isTamil ? horoscope.summary.weekday.ta : horoscope.summary.weekday.en}
              </strong>
            </div>

            <div className="p-2.5 bg-[#FAF6EF] dark:bg-[#1A1513] rounded-xl border border-amber-900/10 text-center col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-stone-500 uppercase font-bold">{T.dashaBalance}</span>
              <strong className="text-xs font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5 block">
                {isTamil ? horoscope.summary.dashaBalance.textTa : horoscope.summary.dashaBalance.textEn}
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION 3: South Indian Charts (4x4 Grid Layout) */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-900/10 pb-2">
            <h2 className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
              <span>☸️</span>
              <span>{T.charts}</span>
            </h2>

            {/* Divisional Chart Switcher Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full print:hidden">
              {[
                { key: 'D1', label: T.d1 },
                { key: 'D9', label: T.d9 },
                { key: 'D3', label: T.d3 },
                { key: 'D7', label: T.d7 },
                { key: 'D10', label: T.d10 },
                { key: 'D12', label: T.d12 }
              ].map(chart => (
                <button
                  key={chart.key}
                  type="button"
                  onClick={() => setActiveChartKey(chart.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeChartKey === chart.key
                      ? 'bg-[#7A1A22] text-amber-100 shadow-xs'
                      : 'bg-amber-900/10 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-900/20'
                  }`}
                >
                  {chart.label}
                </button>
              ))}
            </div>
          </div>

          {/* Render South Indian Chart (Screen: selected active, Print: D1 and D9 side-by-side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {/* Chart 1: Active or D1 */}
            <div className="space-y-1.5">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-[#7A1A22] dark:text-[#E8838B]">
                {activeChartKey === 'D1' ? T.d1 : T[activeChartKey.toLowerCase()]}
              </div>
              <SouthIndianChartGrid
                chartData={horoscope.charts[activeChartKey]}
                isTamil={isTamil}
                centerTitle={activeChartKey === 'D1' ? T.d1 : T[activeChartKey.toLowerCase()]}
                centerSub={form.name}
              />
            </div>

            {/* Chart 2: D9 Navamsa (for comparison) */}
            <div className="space-y-1.5 hidden md:block print:block">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-[#7A1A22] dark:text-[#E8838B]">
                {activeChartKey === 'D9' ? T.d1 : T.d9}
              </div>
              <SouthIndianChartGrid
                chartData={horoscope.charts[activeChartKey === 'D9' ? 'D1' : 'D9']}
                isTamil={isTamil}
                centerTitle={activeChartKey === 'D9' ? T.d1 : T.d9}
                centerSub={form.name}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Planetary Positions Table */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] border-b border-amber-900/10 pb-2 flex items-center gap-2">
            <span>🌌</span>
            <span>{T.planetTable}</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-amber-900/20 text-[#7A1A22] dark:text-amber-300 font-bold bg-amber-900/5 dark:bg-stone-800">
                  <th className="py-2.5 px-3">{T.planet}</th>
                  <th className="py-2.5 px-3">{T.long}</th>
                  <th className="py-2.5 px-3">{T.degInSign}</th>
                  <th className="py-2.5 px-3">{T.rasi}</th>
                  <th className="py-2.5 px-3">{T.nakshatra}</th>
                  <th className="py-2.5 px-3">{T.pada}</th>
                  <th className="py-2.5 px-3">{T.d9}</th>
                  <th className="py-2.5 px-3 text-right">{T.bhava}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800">
                {horoscope.planets.map(p => (
                  <tr key={p.id} className="hover:bg-amber-900/5 dark:hover:bg-stone-800/50">
                    <td className="py-2 px-3 font-bold flex items-center gap-1.5">
                      <span className="text-amber-800 dark:text-amber-400 font-mono text-sm">{p.info.symbol}</span>
                      <span>{isTamil ? p.info.ta : p.info.en}</span>
                    </td>
                    <td className="py-2 px-3 font-mono">{p.dms}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-[#7A1A22] dark:text-amber-200">{p.degInSign}</td>
                    <td className="py-2 px-3 font-bold">{isTamil ? RASHIS[p.rasi].ta : RASHIS[p.rasi].en}</td>
                    <td className="py-2 px-3">{isTamil ? NAKSHATRAS[p.nakshatra].ta : NAKSHATRAS[p.nakshatra].en}</td>
                    <td className="py-2 px-3 font-bold">{p.pada}</td>
                    <td className="py-2 px-3">{isTamil ? RASHIS[p.navamsa].ta : RASHIS[p.navamsa].en}</td>
                    <td className="py-2 px-3 text-right font-black text-[#7A1A22] dark:text-amber-300">{p.bhava}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: Sripati Bhava Sphutam Table */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] border-b border-amber-900/10 pb-2 flex items-center gap-2">
            <span>📐</span>
            <span>{T.sripatiTable}</span>
          </h2>

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

        {/* SECTION 6: Vimshottari Dasha & Collapsible Bhukti Tables */}
        <div className="bg-white/80 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] border-b border-amber-900/10 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>⏳</span>
              <span>{T.vimshottari}</span>
            </span>
            <span className="text-[11px] font-normal text-stone-500">
              {isTamil ? 'மகாதிசையைக் கிளிக் செய்து புக்திகளைப் பார்க்கவும்' : 'Click Mahadasha to expand bhuktis'}
            </span>
          </h2>

          <div className="space-y-2">
            {horoscope.dashaTable.map((md, idx) => {
              const isExpanded = expandedMdIndex === idx;
              return (
                <div
                  key={md.lord.id}
                  className="border border-amber-900/15 dark:border-stone-800 rounded-xl overflow-hidden bg-[#FAF6EF]/60 dark:bg-[#1A1513]/60"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMdIndex(isExpanded ? -1 : idx)}
                    className="w-full p-3 flex justify-between items-center text-xs font-bold hover:bg-amber-900/10 dark:hover:bg-stone-800/70 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{isExpanded ? '▾' : '▸'}</span>
                      <span className="text-[#7A1A22] dark:text-[#E8838B] text-sm">
                        {isTamil ? md.lord.nameTa : md.lord.nameEn} {T.mahadasha} ({md.lord.years} {isTamil ? 'ஆண்டுகள்' : 'Years'})
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      {md.startDate} ➔ {md.endDate}
                    </div>
                  </button>

                  {/* Bhukti Accordion Content */}
                  {isExpanded && (
                    <div className="p-3 bg-white dark:bg-[#201A16] border-t border-amber-900/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {md.bhuktis.map(bh => (
                          <div
                            key={bh.bhuktiLord.id}
                            className={`p-2 rounded-lg border text-[11px] flex justify-between items-center ${
                              bh.isOngoing
                                ? 'bg-amber-100/70 border-amber-400 font-bold dark:bg-amber-900/30'
                                : 'bg-[#FAF6EF]/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800'
                            }`}
                          >
                            <span className="font-bold text-[#7A1A22] dark:text-amber-200">
                              {isTamil ? `${md.lord.nameTa} - ${bh.bhuktiLord.nameTa}` : `${md.lord.nameEn} - ${bh.bhuktiLord.nameEn}`}
                            </span>
                            <span className="font-mono text-stone-600 dark:text-stone-400">
                              {bh.startDate} to {bh.endDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-stone-500 py-3 border-t border-amber-900/10 font-serif">
          {T.title} • Thirukanitha Ephemeris Calculator • All rights reserved
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
  for (const s of chartData) {
    signsMap[s.rasi] = s;
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

          return (
            <div
              key={`${r}-${c}`}
              className="border border-[#7A1A22]/30 dark:border-amber-700/40 p-1 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Sign label in corner */}
              <div className="flex justify-between items-center text-[9px] font-bold text-stone-500 dark:text-stone-400">
                <span>{isTamil ? signInfo.shortTa : signInfo.shortEn}</span>
                <span className="text-[8px] opacity-60 font-mono">{cellDef.rasi + 1}</span>
              </div>

              {/* Occupants: Planets and Lagna */}
              <div className="flex flex-wrap gap-1 items-center justify-center my-auto">
                {signData.occupants.map((occ, oIdx) => (
                  <span
                    key={oIdx}
                    className={`text-[10px] font-black px-1 py-0.2 rounded ${
                      occ.isLagna
                        ? 'bg-[#7A1A22] text-amber-100 border border-amber-400 shadow-2xs'
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
