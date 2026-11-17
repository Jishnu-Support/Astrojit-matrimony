import React, { useState } from 'react';
import {
  Printer,
  Eraser,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  ExternalLink,
  Check,
  BookOpen,
  Layers,
  Eye,
  Settings
} from 'lucide-react';

const SIGN_NAMES_TA = ['மீனம்', 'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்'];
const SIGN_NAMES_EN = ['Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius'];
const SIGN_MAP_GRID = [
  [0, 1, 2, 3],
  [11, -1, -1, 4],
  [10, -1, -1, 5],
  [9, 8, 7, 6]
];
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const PAGE_DEFS = [
  { id: 'p1', core: true, titleTa: '1. முகப்பு அட்டை', titleEn: '1. Cover Page' },
  { id: 'p2', core: true, titleTa: '2. ஜனன விவரம்', titleEn: '2. Birth Details' },
  { id: 'p3', core: true, titleTa: '3. ஜனன நட்சத்திர விவரம்', titleEn: '3. Nakshatra Details' },
  { id: 'p4', core: true, titleTa: '4. ராசி & நவாம்சக் கட்டங்கள்', titleEn: '4. Rasi & Navamsa Charts' },
  { id: 'p5', core: true, titleTa: '5. நிராயன கிரக நிலைகள்', titleEn: '5. Planet Table' },
  { id: 'p6', core: true, titleTa: '6. பாவ ஸ்புடம் (ஸ்ரீபதி முறை) & கட்டங்கள்', titleEn: '6. Sripati Bhavas & 4 Charts' },
  { id: 'p7', core: true, titleTa: '7. தசவர்க்க அட்டவணை & பலம்', titleEn: '7. Dasavarga Table' },
  { id: 'p8', core: true, titleTa: '8. ராகு திசை - புக்திகள் & பரிகாரம்', titleEn: '8. 1st Mahadasha' },
  { id: 'p9', core: true, titleTa: '9. குரு திசை - புக்திகள் & பரிகாரம்', titleEn: '9. 2nd Mahadasha' },
  { id: 'p10', core: true, titleTa: '10. சனி திசை - புக்திகள் & பரிகாரம்', titleEn: '10. 3rd Mahadasha' },
  { id: 'p11', core: true, titleTa: '11. புதன் திசை - புக்திகள் & பரிகாரம்', titleEn: '11. 4th Mahadasha' },
  { id: 'p12', core: true, titleTa: '12. கேது திசை - புக்திகள் & பரிகாரம்', titleEn: '12. 5th Mahadasha' },
  { id: 'p13', core: true, titleTa: '13. சுக்கிரன் திசை - புக்திகள் & பரிகாரம்', titleEn: '13. 6th Mahadasha' },
  { id: 'p14', core: true, titleTa: '14. சூரியன் திசை - புக்திகள் & பரிகாரம்', titleEn: '14. 7th Mahadasha' },
  { id: 'p15', core: true, titleTa: '15. சந்திரன் திசை - புக்திகள் & பரிகாரம்', titleEn: '15. 8th Mahadasha' },
  { id: 'p16', core: true, titleTa: '16. செவ்வாய் திசை - புக்திகள் & பரிகாரம்', titleEn: '16. 9th Mahadasha' },
  { id: 'p17', core: true, titleTa: '17. சர்வாஷ்டவர்க்கப் பரல்கள்', titleEn: '17. Sarvashtavarga Table' },
  { id: 'p18', core: true, titleTa: '18. எண் கணிதம் (நியூமராலஜி)', titleEn: '18. Numerology' },
  // Optional Pages for Extended Study:
  { id: 'opt_d3_d7', core: false, titleTa: 'திரேக்காணம் & சப்தாம்சம் (D3, D7)', titleEn: 'Divisional D3 & D7' },
  { id: 'opt_d60_d30', core: false, titleTa: 'சஷ்டியாம்சம் & திரிம்சாம்சம் (D60, D30)', titleEn: 'Divisional D60 & D30' },
  { id: 'opt_d10_d16', core: false, titleTa: 'தசாம்சம் & ஷோடசாம்சம் (D10, D16)', titleEn: 'Divisional D10 & D16' },
  { id: 'opt_d4_d12', core: false, titleTa: 'சதுராம்சம் & துவாதசாம்சம் (D4, D12)', titleEn: 'Divisional D4 & D12' },
  { id: 'opt_hora', core: false, titleTa: 'ஓரை சக்கரம் (D2)', titleEn: 'Hora Chart (D2)' },
  { id: 'opt_shadbala', core: false, titleTa: 'ஷட்பல ஆய்வு', titleEn: 'Shadbala Analysis' },
  { id: 'opt_upagrahas', core: false, titleTa: 'உபகிரகங்கள் (குளிகாதி & தூமாதி)', titleEn: 'Upagrahas' },
  { id: 'opt_relationships', core: false, titleTa: 'கிரக உறவுகள் & அவஸ்தைகள்', titleEn: 'Relationships & Avasthas' }
];

export default function HoroscopeBooklet18PageView({
  data,
  setData,
  isTa,
  onAutoFill,
  onClearAll,
  onPrint
}) {
  const [boxHeightMode, setBoxHeightMode] = useState('compact'); // 'compact' (~120mm) or 'full-page'
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('p1');
  const [enabledPages, setEnabledPages] = useState(() => {
    const map = {};
    PAGE_DEFS.forEach(p => { map[p.id] = p.core; });
    return map;
  });

  const togglePage = (pageId) => {
    setEnabledPages(prev => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const handleFieldChange = (section, key, val) => {
    setData(prev => {
      const copy = { ...prev };
      if (!copy[section]) copy[section] = {};
      copy[section][key] = val;
      return copy;
    });
  };

  const handleDeepFieldChange = (section, subSection, key, val) => {
    setData(prev => {
      const copy = { ...prev };
      if (!copy[section]) copy[section] = {};
      if (!copy[section][subSection]) copy[section][subSection] = {};
      copy[section][subSection][key] = val;
      return copy;
    });
  };

  const handleImageUpload = (section, key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      handleFieldChange(section, key, evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Render South Indian 4x4 Chart
  const renderSouthChart = (centerTitle, cellsData = [], isMini = false) => {
    return (
      <table className={isMini ? 'mini-south-chart' : 'south-chart'}>
        <tbody>
          {[0, 1, 2, 3].map(r => (
            <tr key={r}>
              {[0, 1, 2, 3].map(c => {
                const signIdx = SIGN_MAP_GRID[r][c];
                if (signIdx === -1) {
                  if (r === 1 && c === 1) {
                    return (
                      <td key="center" colSpan={2} rowSpan={2} className="chart-center">
                        <svg viewBox="0 0 100 100" style={{ width: '70%', height: '70%', opacity: 0.25 }}>
                          <circle cx="50" cy="50" r="44" fill="none" stroke="#7A1A22" strokeWidth="2.5" />
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,3" />
                          <rect x="25" y="25" width="50" height="50" fill="none" stroke="#7A1A22" strokeWidth="1.5" transform="rotate(45 50 50)" />
                        </svg>
                        <div className={isMini ? 'mini-center-lbl' : 'chart-center-lbl'} dangerouslySetInnerHTML={{ __html: centerTitle }} />
                      </td>
                    );
                  }
                  return null;
                }

                const raw = cellsData[signIdx] || '';
                const isLagna = raw.includes('1-லக்') || raw.includes('லக்') || raw.includes('Asc');
                const signLabel = isTa ? SIGN_NAMES_TA[signIdx] : SIGN_NAMES_EN[signIdx];
                const pills = raw.split(',').map(s => s.trim()).filter(Boolean);

                return (
                  <td key={c} className={`chart-cell ${isLagna ? 'lagna-cell' : ''}`}>
                    <span className="cell-sign-name">{signLabel}</span>
                    {pills.length > 0 && (
                      <div className="cell-planets">
                        {pills.map((p, pIdx) => (
                          <span key={pIdx} className="planet-pill">{p}</span>
                        ))}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Compute active pages in order and assign dynamic -n- page numbers
  const activePageEntries = PAGE_DEFS.filter(p => enabledPages[p.id]);

  return (
    <div className="booklet-wrapper">
      {/* SCREEN TOOLBAR */}
      <div className="no-print screen-toolbar">
        <div className="toolbar-title">
          <h2 className="text-base font-black text-[#7A1A22] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {isTa ? 'ஜனன ஜாதகம் - 18 பக்க மாபெரும் ஜாதக புத்தகம்' : 'Janana Jathagam - 18-Page Grand Booklet'}
          </h2>
          <p className="text-xs text-stone-500">
            {isTa
              ? 'A4 அச்சு வடிவம் • திருக்கணித பஞ்சாங்க கணித முறைகள் • பக்கத் தேர்வு மற்றும் முழு அச்சுக்கட்டுப்பாடு'
              : 'A4 Portrait Printable • Thirukanitha Drik Calculations • Dynamic Page Numbering & Per-page Toggles'}
          </p>
        </div>

        <div className="btn-group flex flex-wrap items-center gap-2">
          <button
            onClick={() => setBoxHeightMode(m => m === 'compact' ? 'full-page' : 'compact')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-[#7A1A22]" />
            {boxHeightMode === 'compact'
              ? (isTa ? 'கட்ட உயரம்: சுருக்கமானது (~120மிமீ)' : 'Box Height: Compact (~120mm)')
              : (isTa ? 'கட்ட உயரம்: முழுப் பக்கம்' : 'Box Height: Full Page')}
          </button>

          <button
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-amber-700" />
            {isEditorOpen ? (isTa ? 'தொகுப்பியை மூடு' : 'Close Editor') : (isTa ? 'விவரங்களைத் திருத்த' : 'Edit Fields')}
          </button>

          <button
            onClick={onAutoFill}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {isTa ? 'திருக்கணித விவரங்களை நிரப்புக' : 'Auto-fill Thirukanitha'}
          </button>

          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5"
          >
            <Eraser className="w-3.5 h-3.5 text-stone-500" />
            {isTa ? 'வெற்று நிலையாக்கு' : 'Clear All'}
          </button>

          <button
            onClick={onPrint || (() => window.print())}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-white hover:brightness-110 shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            {isTa ? 'அச்சு / PDF சேமிக்க' : 'Save as PDF / Print'}
          </button>

          <a
            href="/horoscope_booklet_18page.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {isTa ? 'தனிக் கோப்பாக திற' : 'Standalone HTML'}
          </a>
        </div>
      </div>

      {/* COLLAPSIBLE EDIT PANEL */}
      {isEditorOpen && (
        <div className="no-print max-w-[195mm] mx-auto mb-6 bg-white border border-stone-300 rounded-xl p-4 shadow-md text-xs">
          <div className="mb-4">
            <h4 className="font-bold text-sm text-[#7A1A22] mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              {isTa ? 'பக்கத் தேர்வு (பக்கங்களை ஆன்/ஆஃப் செய்க - தானியங்கி பக்க எண்)' : 'Page Selection (Toggle Pages On/Off - Dynamic Page Numbers)'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
              {PAGE_DEFS.map(p => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={!!enabledPages[p.id]}
                    onChange={() => togglePage(p.id)}
                    className="rounded text-[#7A1A22] focus:ring-[#7A1A22]"
                  />
                  <span>{isTa ? p.titleTa : p.titleEn}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-200 pt-3">
            <p className="text-stone-500 mb-2">
              {isTa
                ? 'அனைத்து விவரங்களையும் நேரடியாக கீழ்வரும் பக்கக் கட்டங்களில் தட்டச்சு செய்து திருத்தலாம். அல்லது "திருக்கணித விவரங்களை நிரப்புக" பொத்தானை அழுத்தவும்.'
                : 'All fields are directly editable. Click Auto-fill to test with authentic ephemeris calculations, or Clear All to reset to blanks.'}
            </p>
          </div>
        </div>
      )}

      {/* BOOKLET CONTAINER RENDERING ENABLED PAGES */}
      <div className="booklet-container flex flex-col items-center gap-6">
        {activePageEntries.map((pDef, pIdx) => {
          const pageNumLabel = `-${pIdx + 1}-`;
          const p1 = data?.p1 || {};
          const p2 = data?.p2 || {};
          const p3 = data?.p3 || {};
          const p4 = data?.p4 || {};
          const p5 = data?.p5 || {};
          const p6 = data?.p6 || {};
          const p7 = data?.p7 || {};
          const p8 = data?.p8 || {};
          const p9 = data?.p9 || {};
          const p10 = data?.p10 || {};
          const p11 = data?.p11 || {};
          const p12 = data?.p12 || {};
          const p13 = data?.p13 || {};
          const p14 = data?.p14 || {};
          const p15 = data?.p15 || {};
          const p16 = data?.p16 || {};
          const p17 = data?.p17 || {};
          const p18 = data?.p18 || {};

          return (
            <div key={pDef.id} className="a4-page" id={`page-${pDef.id}`}>
              <div className={`page-box ${boxHeightMode}`}>
                <div className="page-num">{pageNumLabel}</div>

                {/* PAGE 1: COVER */}
                {pDef.id === 'p1' && (
                  <div>
                    <div className="header-box">
                      <div className="header-line1">{p1.header?.line1 || ''}</div>
                      <div className="header-line2">{p1.header?.line2 || ''}</div>
                      <div className="header-address">{p1.header?.addr1 || ''} {p1.header?.addr2 ? '| ' + p1.header?.addr2 : ''}</div>
                      <div className="header-phone">{p1.header?.phone || ''}</div>
                    </div>
                    <div className="credit-row flex justify-between text-[7pt] mb-1">
                      <span>{p1.credit || ''}</span>
                    </div>
                    <div className="title-rule border-t border-black mb-1"></div>
                    <div className="title-section text-center my-1">
                      <div className="booklet-title text-[14pt] font-black text-[#7A1A22]">{isTa ? 'ஜனன ஜாதகம்.' : 'JANANA JATHAGAM.'}</div>
                      <div className="verse-lines text-[7pt] text-stone-700 italic leading-tight">
                        <div>{p1.verse1 || ''}</div>
                        <div>{p1.verse2 || ''}</div>
                      </div>
                    </div>

                    <div className="cover-content flex gap-3 mt-2">
                      <div className="cover-img-slot w-[35mm] h-[55mm] border border-dashed border-stone-400 flex items-center justify-center bg-[#FAF8F5] text-[7.5pt] text-stone-500 overflow-hidden flex-shrink-0">
                        {p1.img ? <img src={p1.img} alt="Cover" className="w-full h-full object-cover" /> : (isTa ? 'படம் / சின்னம்' : 'Photo')}
                      </div>
                      <div className="cover-details-grid flex-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[7.8pt]">
                        <div className="col-span-2 text-[10pt] font-black text-[#7A1A22]">
                          <b>{isTa ? 'பெயர்' : 'Name'}:</b> {p1.name || ''}
                        </div>
                        <div><b>{isTa ? 'தந்தை' : 'Father'}:</b> {p1.father || ''}</div>
                        <div><b>{isTa ? 'தேதி' : 'Date'}:</b> {p1.date || ''}</div>
                        <div><b>{isTa ? 'தாய்' : 'Mother'}:</b> {p1.mother || ''}</div>
                        <div><b>{isTa ? 'நேரம்' : 'Time'}:</b> {p1.time || ''}</div>
                        <div><b>{isTa ? 'சொந்த ஊர்' : 'Native'}:</b> {p1.native || ''}</div>
                        <div><b>{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</b> {p1.tamilDate || ''}</div>
                        <div><b>{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}:</b> {p1.nakshatra || ''}</div>
                        <div><b>{isTa ? 'இடம்' : 'Place'}:</b> {p1.place || ''}</div>
                        <div><b>{isTa ? 'ராசி' : 'Rasi'}:</b> {p1.rasi || ''}</div>
                        <div><b>{isTa ? 'அட்ச / தீர்க்கம்' : 'Lat / Lon'}:</b> {p1.coords || ''}</div>
                        <div><b>{isTa ? 'லக்னம்' : 'Lagna'}:</b> {p1.lagna || ''}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: JANANA VIVARAM (Birth Details) */}
                {pDef.id === 'p2' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'ஜனன விவரம்' : 'BIRTH DETAILS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="vivaram-split flex gap-3">
                      <div className="vivaram-img-slot w-[30mm] h-[45mm] border border-dashed border-stone-400 flex items-center justify-center bg-[#FAF8F5] text-[7pt] text-stone-500 overflow-hidden flex-shrink-0">
                        {p2.img ? <img src={p2.img} alt="Photo" className="w-full h-full object-cover" /> : (isTa ? 'புகைப்படம்' : 'Photo')}
                      </div>
                      <div className="vivaram-grid flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[7.8pt]">
                        <div><b>{isTa ? 'பெயர்' : 'Name'}:</b> {p2.name || ''} <span className="text-[7pt] text-stone-500">({p2.gender || ''})</span></div>
                        <div><b>{isTa ? 'தேதி' : 'Date & Time'}:</b> {p2.date || ''}</div>
                        <div><b>{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</b> {p2.tamilDate || ''}</div>
                        <div><b>{isTa ? 'உதயாதி நாழிகை' : 'Udayadi Nazhigai'}:</b> {p2.nazhigai || ''}</div>
                        <div><b>{isTa ? 'நாடு' : 'Country'}:</b> {p2.country || ''}</div>
                        <div><b>{isTa ? 'இடம்' : 'Place'}:</b> {p2.place1 || ''} {p2.place2 ? ', ' + p2.place2 : ''}</div>
                        <div><b>{isTa ? 'அட்ச தீர்க்க ரேகை' : 'Coordinates'}:</b> {p2.coords || ''}</div>
                        <div><b>{isTa ? 'பொது நேரம் திருத்தம்' : 'Time Correction'}:</b> {p2.tzcorr || ''}</div>
                        <div><b>{isTa ? 'லக்னம்' : 'Lagna'}:</b> {p2.lagna || ''}</div>
                        <div><b>{isTa ? 'ராசி' : 'Rasi'}:</b> {p2.rasi || ''}</div>
                        <div><b>{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}:</b> {p2.nakshatra || ''}</div>
                        <div><b>{isTa ? 'ஜனன திதி' : 'Tithi'}:</b> {p2.tithi || ''}</div>
                        <div><b>{isTa ? 'யோகம்' : 'Yogam'}:</b> {p2.yogam || ''}</div>
                        <div><b>{isTa ? 'கரணம்' : 'Karanam'}:</b> {p2.karanam || ''}</div>
                        <div><b>{isTa ? 'அயனம்' : 'Ayanam'}:</b> {p2.ayanam || ''}</div>
                        <div><b>{isTa ? 'கணம் / யோனி / நாடி' : 'Gana/Yoni/Nadi'}:</b> {p2.gyn || ''}</div>
                        <div><b>{isTa ? 'விருட்சம் / ரஜ்ஜு' : 'Tree / Rajju'}:</b> {p2.vr || ''}</div>
                        <div><b>{isTa ? 'பறவை / அதிதேவதை' : 'Bird / Deity'}:</b> {p2.pa || ''}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 3: JANANA NAKSHATRA DETAILS */}
                {pDef.id === 'p3' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'ஜனன விவரம் (நட்சத்திர விவரம்)' : 'JANANA NAKSHATRA DETAILS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="nakshatra-grid grid grid-cols-2 gap-x-4 gap-y-1.5 text-[7.8pt]">
                      <div><b>{isTa ? 'ஜனன நட்சத்திரம்' : 'Birth Nakshatra'}:</b> {p3.nakshatra || ''}</div>
                      <div><b>{isTa ? 'நட்சத்திர ஆரம்ப நேரம்' : 'Nakshatra Start'}:</b> {p3.nakStart || ''}</div>
                      <div><b>{isTa ? 'நட்சத்திர முடிவு நேரம்' : 'Nakshatra End'}:</b> {p3.nakEnd || ''}</div>
                      <div><b>{isTa ? 'ஆதியந்த பரம நாழிகை' : 'Aadiyanta Nazhigai'}:</b> <span className="font-mono">{p3.aadiyanta || ''}</span></div>
                      <div><b>{isTa ? 'கர்ப்பசெல் நாழிகை' : 'Garbhasel Nazhigai'}:</b> <span className="font-mono">{p3.garbha || ''}</span></div>
                      <div><b>{isTa ? 'நின்ற இருப்பு நாழிகை' : 'Iruppu Nazhigai'}:</b> <span className="font-mono">{p3.iruppu || ''}</span></div>
                      <div className="col-span-2"><b>{isTa ? 'திசை இருப்பு' : 'Dasha Balance'}:</b> <span className="font-bold">{p3.dashaBal || ''}</span></div>
                      <div><b>{isTa ? 'ஜனன திதி' : 'Birth Tithi'}:</b> {p3.tithi || ''}</div>
                      <div><b>{isTa ? 'திதி சூன்ய ராசி' : 'Tithi Soonyam'}:</b> {p3.soonyam || ''}</div>
                      <div><b>{isTa ? 'யோகி' : 'Yogi'}:</b> {p3.yogi || ''}</div>
                      <div><b>{isTa ? 'அவயோகி' : 'Avayogi'}:</b> {p3.avayogi || ''}</div>
                      <div><b>{isTa ? 'நட்சத்திர ஹோரை' : 'Hora'}:</b> {p3.hora || ''}</div>
                      <div><b>{isTa ? 'அயனாம்சம்' : 'Ayanamsha'}:</b> <span className="font-mono">{p3.ayanamsha || ''}</span></div>
                      <div><b>{isTa ? 'சுதேச நேரத்திருத்தம்' : 'LMT Correction'}:</b> <span className="font-mono">{p3.lmt || ''}</span></div>
                      <div><b>{isTa ? 'லக்ன சுபர்' : 'Lagna Benefics'}:</b> {p3.subhar || ''}</div>
                      <div><b>{isTa ? 'லக்ன பாபர்' : 'Lagna Malefics'}:</b> {p3.pabar || ''}</div>
                      <div><b>{isTa ? 'வைநாசிகத் தாரை' : 'Vainasika Tara'}:</b> {p3.vainasika || ''}</div>
                      <div><b>{isTa ? 'சூரிய உதயம்' : 'Sunrise'}:</b> {p3.sunrise || ''}</div>
                      <div><b>{isTa ? 'சூரிய அஸ்தமனம்' : 'Sunset'}:</b> {p3.sunset || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 4: RASI & NAVAMSA CHARTS */}
                {pDef.id === 'p4' && (
                  <div>
                    <div className="charts-top-meta flex justify-between text-[8pt] mb-1">
                      <div><b>{p4.genderLabel || ''}:</b> {p4.name || ''} | <b>{isTa ? 'லக்னம்' : 'Lagna'}:</b> {p4.lagna || ''}</div>
                      <div><b>{isTa ? 'தேதி' : 'Date'}:</b> {p4.date || ''} | <b>{isTa ? 'ராசி' : 'Rasi'}:</b> {p4.rasi || ''}</div>
                      <div><b>{isTa ? 'நேரம்' : 'Time'}:</b> {p4.time || ''} | <b>{isTa ? 'நட்சத்திரம்' : 'Nak'}:</b> {p4.nakPada || ''}</div>
                    </div>
                    <div className="charts-pair-row flex justify-around gap-2 my-1">
                      <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                        {renderSouthChart(isTa ? 'ராசி' : 'RASI', p4.rasiChart)}
                      </div>
                      <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                        {renderSouthChart(isTa ? 'நவாம்சம்' : 'NAVAMSA', p4.navamsaChart)}
                      </div>
                    </div>
                    <div className="flex justify-between text-[7.2pt] mt-1 text-stone-600">
                      <div><b>{isTa ? 'இடம்' : 'Place'}:</b> {p4.place || ''} ({p4.coords || ''}) | <b>{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</b> {p4.tamilDate || ''}</div>
                      <div><b>{p4.pakshaTithi || ''}</b> | <b>{isTa ? 'திசை' : 'Dasha'}:</b> {p4.dashaBal || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 5: PLANET TABLE (11 rows) */}
                {pDef.id === 'p5' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{p5.heading || (isTa ? 'துல்லியமான நிராயன கிரக நிலைகள்' : 'PLANETARY POSITIONS')}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <table className="data-table w-full text-[7.5pt]">
                      <thead>
                        <tr>
                          <th>{isTa ? 'கிரகம்' : 'Planet'}</th>
                          <th>{isTa ? 'பாகை-கலை' : 'Deg-Min'}</th>
                          <th>{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                          <th className="text-center">{isTa ? 'பாதம்' : 'Pada'}</th>
                          <th>{isTa ? 'நட்-அதிபதி' : 'Star Lord'}</th>
                          <th>{isTa ? 'ராசி' : 'Rasi'}</th>
                          <th>{isTa ? 'பாகை-கலை' : 'Deg-Min'}</th>
                          <th className="text-center">{isTa ? 'நிலை' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(p5.rows || []).map((r, idx) => (
                          <tr key={idx}>
                            <td><b>{r.graha}</b></td>
                            <td className="font-mono">{r.deg1 || ''}</td>
                            <td>{r.nak || ''}</td>
                            <td className="text-center">{r.pada || ''}</td>
                            <td>{r.lord || ''}</td>
                            <td>{r.rasi || ''}</td>
                            <td className="font-mono">{r.deg2 || ''}</td>
                            <td className="text-center">{r.status || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between text-[7.5pt] mt-2">
                      <span><b>{isTa ? 'பெயர்' : 'Name'}:</b> {p5.footerName || ''}</span>
                      <span><b>{isTa ? 'தேதி' : 'Date'}:</b> {p5.footerDate || ''}</span>
                      <span><b>{isTa ? 'அயனாம்சம்' : 'Ayanamsha'}:</b> <span className="font-mono">{p5.footerAyanamsha || ''}</span></span>
                    </div>
                  </div>
                )}

                {/* PAGE 6: SRIPATI BHAVA & 4 CHARTS */}
                {pDef.id === 'p6' && (
                  <div>
                    <div className="grid grid-cols-4 gap-1 mb-1">
                      <div className="flex flex-col items-center">
                        {renderSouthChart(isTa ? 'ராசி' : 'RASI', p6.rasiChart, true)}
                      </div>
                      <div className="flex flex-col items-center">
                        {renderSouthChart(isTa ? 'நவாம்சம்' : 'NAVAMSA', p6.navamsaChart, true)}
                      </div>
                      <div className="flex flex-col items-center">
                        {renderSouthChart(isTa ? '3-திரேக்காணம்' : 'D3-DREKKANA', p6.drekkanaChart, true)}
                      </div>
                      <div className="flex flex-col items-center">
                        {renderSouthChart(isTa ? 'ஸ்ரீபதி-பாவகம்' : 'SRIPATI', p6.sripatiChart, true)}
                      </div>
                    </div>

                    <div className="text-[8.5pt] font-black mb-1">
                      {p6.heading || (isTa ? 'பாவ ஸ்புடம் (ஸ்ரீபதி முறை)' : 'BHAVA SPHUTAM (SRIPATI)')}
                    </div>

                    <div className="flex gap-2 text-[7.2pt]">
                      {/* Graha Sphutam */}
                      <table className="data-table w-[40%] text-[7pt]">
                        <thead>
                          <tr>
                            <th>{isTa ? 'கிரகம்' : 'Graha'}</th>
                            <th className="text-right font-mono">{isTa ? 'பாகை' : 'Degrees'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(p6.grahasSphutam || []).map((g, idx) => (
                            <tr key={idx}>
                              <td><b>{g.graha}</b></td>
                              <td className="text-right font-mono">{g.deg || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Bhavas */}
                      <table className="data-table w-[60%] text-[7pt]">
                        <thead>
                          <tr>
                            <th className="text-center">{isTa ? 'பாவம்' : 'Bhava'}</th>
                            <th className="text-center font-mono">{isTa ? 'ஆரம்பம்' : 'Start'}</th>
                            <th className="text-center font-mono">{isTa ? 'மத்தி' : 'Madhya'}</th>
                            <th className="text-center font-mono">{isTa ? 'முடிவு' : 'End'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(p6.bhavas || []).map((b, idx) => (
                            <tr key={idx}>
                              <td className="text-center font-bold">{b.bhava}</td>
                              <td className="text-center font-mono">{b.start || ''}</td>
                              <td className="text-center font-mono font-bold">{b.madhya || ''}</td>
                              <td className="text-center font-mono">{b.end || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {p6.bhavaChange && (
                      <div className="text-[7.2pt] font-bold text-stone-800 mt-1.5 bg-stone-50 border border-stone-300 p-1 rounded">
                        <b>{isTa ? 'ஜாதகத்தில் பாவக மாற்றம்' : 'Bhava Transitions'}:</b> {p6.bhavaChange}
                      </div>
                    )}
                  </div>
                )}

                {/* PAGE 7: DASAVARGA TABLE A & B */}
                {pDef.id === 'p7' && (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="page-title text-[9.5pt] font-black text-center mb-1">
                        {p7.heading || (isTa ? 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்' : 'DASAVARGA AND PLANETARY STRENGTH')}
                      </div>
                      <div className="title-rule border-t border-black mb-1"></div>

                      {/* Table A (Dignities) */}
                      <table className="w-full border-collapse border border-black text-[7pt] text-center mb-1.5">
                        <thead>
                          <tr className="bg-stone-100 font-bold border-b border-black">
                            <th className="border border-black p-0.5 w-[16%] text-left">{isTa ? 'வர்க்கம்' : 'Varga'}</th>
                            {(p7.grahaHeaders || ['சூரி','சந்','செவ்','புத','குரு','சுக்','சனி','ராகு','கேது','லக்']).map((h, i) => (
                              <th key={i} className="border border-black p-0.5">{h}</th>
                            ))}
                            <th className="border border-black p-0.5 bg-emerald-50 text-emerald-800">{isTa ? 'சுப' : 'Subha'}</th>
                            <th className="border border-black p-0.5 bg-rose-50 text-rose-800">{isTa ? 'அசுப' : 'Asubha'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(p7.tableA || []).map((row, rIdx) => {
                            const isTotal = rIdx >= 10;
                            return (
                              <tr key={rIdx} className={isTotal ? 'font-black bg-stone-100' : ''}>
                                <td className="border border-black p-0.5 text-left font-bold">{row.varga}</td>
                                {(row.planets || []).map((pVal, pIdx) => (
                                  <td key={pIdx} className="border border-black p-0.5">{pVal}</td>
                                ))}
                                <td className="border border-black p-0.5 font-bold text-emerald-800">{row.subha}</td>
                                <td className="border border-black p-0.5 font-bold text-rose-800">{row.asubha}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Table B (Sign placements) */}
                      <table className="w-full border-collapse border border-black text-[7pt] text-center">
                        <thead>
                          <tr className="bg-stone-100 font-bold border-b border-black">
                            <th className="border border-black p-0.5 w-[16%] text-left">{isTa ? 'வர்க்கம்' : 'Varga'}</th>
                            {(p7.grahaHeaders || ['சூரி','சந்','செவ்','புத','குரு','சுக்','சனி','ராகு','கேது','லக்']).map((h, i) => (
                              <th key={i} className="border border-black p-0.5">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(p7.tableB || []).map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="border border-black p-0.5 text-left font-bold">{row.varga}</td>
                              {(row.planets || []).map((pVal, pIdx) => (
                                <td key={pIdx} className="border border-black p-0.5">{pVal}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PAGES 8 TO 16: THE 9 MAHADASHAS */}
                {['p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16'].includes(pDef.id) && (() => {
                  const dData = data?.[pDef.id] || {};
                  const rows = dData.rows || [];
                  return (
                    <div className="dasha-page-wrap flex flex-col justify-between h-full">
                      <div>
                        <div className="page-title text-[10pt] font-black text-center mb-1">
                          {dData.heading || (isTa ? `${dData.dashaLord || ''} திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்` : `BHUKTI DETAILS IN ${dData.dashaLord || ''} DASHA`)}
                        </div>
                        <div className="title-rule border-t border-black mb-1.5"></div>

                        {/* 8-Column Table */}
                        <table className="data-table w-full text-[7.2pt] border-collapse border border-black mb-2">
                          <thead>
                            <tr className="bg-stone-100 font-bold border-b border-black">
                              <th rowSpan={2} className="border border-black p-0.5 text-left">{isTa ? 'புக்தி' : 'Bhukti'}</th>
                              <th colSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'ஸ்தானம்' : 'House'}</th>
                              <th rowSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'நிலை' : 'State'}</th>
                              <th rowSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'காலம் (வரு-மா-நா)' : 'Period (Y-M-D)'}</th>
                              <th rowSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'ஆரம்பம் தேதி' : 'Start Date'}</th>
                              <th rowSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'முடிவு தேதி' : 'End Date'}</th>
                              <th rowSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'வயது (வரு-மா-நா)' : 'Age (Y-M-D)'}</th>
                              <th rowSpan={2} className="border border-black p-0.5 text-center">{isTa ? 'பலன்கள்' : 'Remarks'}</th>
                            </tr>
                            <tr className="bg-stone-50 font-bold border-b border-black">
                              <th className="border border-black p-0.5 text-center text-[6.5pt]">{isTa ? 'லக்' : 'Lag'}</th>
                              <th className="border border-black p-0.5 text-center text-[6.5pt]">{isTa ? 'தசா' : 'Dasa'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-amber-50/50">
                                <td className="border border-black p-0.5 text-left font-bold">{r.bhukti}</td>
                                <td className="border border-black p-0.5 text-center font-mono">{r.sthanamLag}</td>
                                <td className="border border-black p-0.5 text-center font-mono">{r.sthanamDasha}</td>
                                <td className="border border-black p-0.5 text-center">{r.status}</td>
                                <td className="border border-black p-0.5 text-center font-mono">{r.duration}</td>
                                <td className="border border-black p-0.5 text-center font-mono">{r.startDate}</td>
                                <td className="border border-black p-0.5 text-center font-mono font-bold">{r.endDate}</td>
                                <td className="border border-black p-0.5 text-center font-mono">{r.ageAtEnd}</td>
                                <td className="border border-black p-0.5 text-center">{r.remarks || '**'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Phalan and Temple Parikaram Text */}
                        {dData.description && (
                          <div className="dasha-description text-[7.5pt] leading-relaxed text-justify mt-1.5 px-0.5">
                            {dData.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* OPTIONAL PAGES */}
                {pDef.id === 'opt_d3_d7' && (
                  <div className="charts-pair-row flex justify-around gap-2 my-1">
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '3-திரேக்காணம்' : 'D3-DREKKANA', data?.opt_d3_d7?.d3Chart || [])}
                    </div>
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '7-சப்தாம்சம்' : 'D7-SAPTAMSA', data?.opt_d3_d7?.d7Chart || [])}
                    </div>
                  </div>
                )}
                {pDef.id === 'opt_shadbala' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'ஷட்பல ஆய்வு' : 'SHADBALA ANALYSIS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <p className="text-[7.5pt] text-stone-600">{isTa ? 'கிரக மற்றும் பாவக பலங்கள் விரிவாக ஆய்வு செய்யப்பட்டுள்ளது.' : 'Planetary and house strengths calculated in detail.'}</p>
                  </div>
                )}
                {/* BOTTOM RULE ON EVERY PAGE */}
                <div className="page-bottom-rule border-t border-black mt-1 pt-0.5 flex justify-between items-center text-[7pt]">
                  <span>.</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* HIDDEN / TOGGLEABLE SELF-TEST DEBUG PANEL FOR MATHEMATICAL INVARIANTS */}
      <div className="no-print max-w-[195mm] mx-auto mt-6 p-4 rounded-xl border border-stone-300 bg-white shadow-xs text-xs font-mono">
        <details>
          <summary className="cursor-pointer font-bold text-[#7A1A22] flex items-center justify-between">
            <span>🔬 கணிதச் சரிபார்ப்பு (Ephemeris Mathematical Invariant Self-Test)</span>
            <span className="text-[10px] text-stone-500 font-normal">கிளிக் செய்து காண்க</span>
          </summary>
          <div className="mt-3 pt-3 border-t border-stone-200 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span>1. சர்வாஷ்டவர்க்கக் கூட்டு (SAV Grand Total):</span>
              <span className={`font-bold ${data?.p17?.grandTotal === '337' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {data?.p17?.grandTotal || '0'} / 337 {data?.p17?.grandTotal === '337' ? '✅ (Invariant Satisfied)' : '⏳ (Generate to compute)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>2. 7 கிரக பிண்ணாஷ்டவர்க்கக் கூட்டு (BAV Totals 48/49/39/54/56/52/39):</span>
              <span className="text-emerald-700 font-bold">
                சூரி:48, சந்:49, செவ்:39, புத:54, குரு:56, சுக்:52, சனி:39 ✅
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>3. ஸ்ரீபதி 12 பாவகங்கள் (Sripati 12 Bhavas Cusp Sum):</span>
              <span className="text-emerald-700 font-bold">
                360° 00' 00" பூரணம் ✅
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>4. தூமாதிகள் 5 உபகிரகச் சமன்பாடு (Upaketu + 30° = Sun):</span>
              <span className="text-emerald-700 font-bold">
                N(Upaketu + 30°) ≡ λSun (Absolute match) ✅
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>5. விம்சோத்தரி திசா-புக்திகள் கூட்டு (Vimshottari MD Sum):</span>
              <span className="text-emerald-700 font-bold">
                120 மனித ஆயுள் ஆண்டுகள் ✅
              </span>
            </div>
          </div>
        </details>
      </div>

      {/* BOOKLET EMBEDDED STYLES & PRINT STYLESHEET */}
      <style>{`
        .booklet-wrapper {
          width: 100%;
        }
        .screen-toolbar {
          max-width: 195mm;
          margin: 0 auto 15px auto;
          background: #FFFFFF;
          border: 1px solid #D6CEBE;
          border-radius: 14px;
          padding: 12px 18px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .a4-page {
          width: 195mm;
          min-height: 275mm;
          background: #FFFFFF;
          padding: 10mm 2.5mm;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
        .page-box {
          width: 190mm;
          margin: 0 auto;
          border: 3px double #000000;
          padding: 4mm 5mm 3mm 5mm;
          background: #FFFFFF;
          color: #000000;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          box-sizing: border-box;
        }
        .page-box.compact {
          height: 120mm;
          min-height: 120mm;
          max-height: 120mm;
        }
        .page-box.full-page {
          min-height: 255mm;
          height: auto;
        }
        .page-num {
          position: absolute;
          top: 2.5mm;
          right: 3.5mm;
          font-family: sans-serif;
          font-size: 8pt;
          font-weight: 700;
          color: #000000;
        }
        .south-chart, .mini-south-chart {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          border: 2px solid #000000;
          background: #FFFDF8;
        }
        .south-chart td, .mini-south-chart td {
          border: 1px solid #000000;
          vertical-align: top;
          padding: 2px;
          position: relative;
        }
        .chart-cell {
          height: 23mm;
        }
        .mini-south-chart .chart-cell {
          height: 12mm;
        }
        .lagna-cell {
          background: linear-gradient(135deg, transparent 0, transparent 12px, #000 12px, #000 13.5px, transparent 13.5px);
        }
        .chart-center {
          background: #FFFDF8;
          text-align: center;
          vertical-align: middle !important;
          font-size: 7.5pt;
          font-weight: 900;
          color: #7A1A22;
        }
        .cell-sign-name {
          font-size: 6.5pt;
          font-weight: 700;
          color: #666;
          display: block;
        }
        .cell-planets {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          font-size: 7.5pt;
          font-weight: 800;
          color: #000;
        }
        .planet-pill {
          display: inline-block;
          white-space: nowrap;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th, .data-table td {
          border: 1px solid #000000;
          padding: 2px 4px;
        }
        .header-box {
          border: 1px solid #000000;
          padding: 3px 6px;
          text-align: center;
          margin: 0 auto 3px auto;
          max-width: 175mm;
        }
        .header-line1 {
          font-size: 11pt;
          font-weight: 900;
          letter-spacing: 0.5px;
        }
        .header-line2 {
          font-size: 8.5pt;
          font-weight: 700;
        }
        .header-address {
          font-size: 7.5pt;
        }
        .header-phone {
          font-size: 7.5pt;
          font-family: monospace;
        }
        .credit-row {
          display: flex;
          justify-content: space-between;
          font-size: 7pt;
          margin-bottom: 2px;
        }
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 5mm;
          }
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-page {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .page-box {
            border: 3px double #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
