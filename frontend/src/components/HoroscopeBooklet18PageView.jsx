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
  { id: 'p1', core: true, titleTa: '1. அட்டைப் பக்கம்', titleEn: '1. Cover Page' },
  { id: 'p2', core: true, titleTa: '2. விநாயகர் ஸ்துதி', titleEn: '2. Vinayagar Stuthi' },
  { id: 'p3', core: true, titleTa: '3. ஜனன விவரம்', titleEn: '3. Birth Details' },
  { id: 'p4', core: true, titleTa: '4. ஜனன நட்சத்திர விவரம்', titleEn: '4. Nakshatra Details' },
  { id: 'p5', core: true, titleTa: '5. ராசி & நவாம்சம்', titleEn: '5. Rasi & Navamsa Charts' },
  { id: 'p6', core: true, titleTa: '6. நிராயன கிரக நிலைகள்', titleEn: '6. Planet Table' },
  { id: 'p7', core: true, titleTa: '7. ஸ்ரீபதி பாவகம் & ஸ்புடம்', titleEn: '7. Bhava Charts & Sripati' },
  { id: 'p8', core: true, titleTa: '8. திரேக்காணம் & சப்தாம்சம் (D3, D7)', titleEn: '8. Divisional D3 & D7' },
  { id: 'p9', core: true, titleTa: '9. சஷ்டியாம்சம் & திரிம்சாம்சம் (D60, D30)', titleEn: '9. Divisional D60 & D30' },
  { id: 'p10', core: true, titleTa: '10. தசாம்சம் & ஷோடசாம்சம் (D10, D16)', titleEn: '10. Divisional D10 & D16' },
  { id: 'p11', core: true, titleTa: '11. சதுராம்சம் & துவாதசாம்சம் (D4, D12)', titleEn: '11. Divisional D4 & D12' },
  { id: 'p12', core: true, titleTa: '12. ஓரை சக்கரம் (D2)', titleEn: '12. Hora Chart (D2)' },
  { id: 'p13', core: true, titleTa: '13. ஷட்பல ஆய்வு', titleEn: '13. Shadbala Analysis' },
  { id: 'p14', core: true, titleTa: '14. உபகிரகங்கள் (குளிகாதி & தூமாதி)', titleEn: '14. Upagrahas (Gulikaadi & Dhumadi)' },
  { id: 'p15', core: true, titleTa: '15. உபகிரக சக்கரம் & லக்ன பாகைகள்', titleEn: '15. Upagraha Chart & Lagna Degrees' },
  { id: 'p16', core: true, titleTa: '16. கிரக உறவுகள் & அவஸ்தைகள்', titleEn: '16. Relationships & Avasthas' },
  { id: 'p17', core: true, titleTa: '17. சர்வாஷ்டவர்க்க பரல்கள்', titleEn: '17. Sarvashtavarga Table' },
  { id: 'p18', core: true, titleTa: '18. எண் கணிதம் (நியூமராலஜி)', titleEn: '18. Numerology' },
  // Optional pages:
  { id: 'opt_aspects', core: false, titleTa: 'கிரக & பாவக பார்வை கோணங்கள்', titleEn: 'Graha & Bhava Aspects' },
  { id: 'opt_dasavarga', core: false, titleTa: 'தசவர்க்கமும் பலமும்', titleEn: 'Dasavarga Strength' },
  { id: 'opt_pakshi', core: false, titleTa: 'பஞ்ச பட்சி விவரம்', titleEn: 'Pancha Pakshi' },
  { id: 'opt_dashas', core: false, titleTa: 'தசா புக்தி விரிவான பக்கங்கள்', titleEn: '9 Mahadasha Detailed Pages' },
  { id: 'opt_dasha_matrix', core: false, titleTa: 'திசை-புக்தி முடிவு அட்டவணை', titleEn: 'Dasha End Dates Matrix' }
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
                    <div className="credit-rule border-t border-black mb-1"></div>
                    <div className="cover-title-area text-center mb-1">
                      <div className="cover-title text-[15pt] font-black">{isTa ? 'ஜனன ஜாதகம்' : 'JANANA JATHAGAM'}</div>
                      <div className="cover-verse text-[7.5pt] italic leading-tight">{p1.verse1 || ''}<br />{p1.verse2 || ''}</div>
                    </div>
                    <div className="cover-body-split flex gap-3 mt-1">
                      <div className="cover-img-slot w-[35mm] h-[55mm] border border-dashed border-stone-400 flex items-center justify-center bg-[#FAF8F5] text-[7pt] text-stone-500 overflow-hidden flex-shrink-0">
                        {p1.img ? <img src={p1.img} alt="Cover Artwork" className="w-full h-full object-cover" /> : (isTa ? 'அட்டைப் படம்' : 'Cover Image')}
                      </div>
                      <div className="cover-details-block flex-1 flex flex-col gap-0.5 text-[8pt]">
                        <div className="cover-row large-name text-[12pt] font-black"><span className="cover-lbl font-bold">{isTa ? 'பெயர்' : 'Name'}: </span>{p1.name || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'தந்தை' : 'Father'}: </span>{p1.father || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'தாய்' : 'Mother'}: </span>{p1.mother || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'சொந்த ஊர்' : 'Native'}: </span>{p1.native || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}: </span>{p1.nakshatra || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'ராசி' : 'Rasi'}: </span>{p1.rasi || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'லக்னம்' : 'Lagna'}: </span>{p1.lagna || ''}</div>
                        <div className="h-1"></div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'தேதி' : 'Date'}: </span>{p1.date || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'நேரம்' : 'Time'}: </span>{p1.time || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}: </span>{p1.tamilDate || ''}</div>
                        <div className="cover-row"><span className="cover-lbl font-bold">{isTa ? 'இடம்' : 'Place'}: </span>{p1.place || ''}</div>
                        <div className="text-[6.8pt] text-stone-500 pl-16">{p1.coords || ''}</div>
                        <div className="bold-thirukanitha text-[9.5pt] font-black mt-1 text-[#7A1A22]">{isTa ? 'திருக்கணிதம்' : 'Thirukanitha (Drik)'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: VINAYAGAR STUTHI */}
                {pDef.id === 'p2' && (
                  <div className="stuthi-container flex flex-col items-center justify-center text-center h-full gap-2">
                    <div className="stuthi-title text-[13pt] font-black">{isTa ? 'விநாயகர் ஸ்துதி' : 'VINAYAGAR STUTHI'}</div>
                    <div className="stuthi-img-slot w-[55mm] h-[55mm] border border-dashed border-stone-400 flex items-center justify-center bg-[#FAF8F5] text-[7.5pt] text-stone-500 overflow-hidden">
                      {p2.img ? <img src={p2.img} alt="Vinayagar" className="w-full h-full object-contain" /> : (isTa ? 'விநாயகர் படம்' : 'Vinayagar Image')}
                    </div>
                    <div className="stuthi-verse text-[8.5pt] font-semibold leading-relaxed whitespace-pre-line">
                      {p2.verse || ''}
                    </div>
                    <div className="stuthi-subham text-[9.5pt] font-black mt-2">{p2.subham || (isTa ? 'சுப மஸ்து.' : 'Subha Masthu.')}</div>
                  </div>
                )}

                {/* PAGE 3: JANANA VIVARAM */}
                {pDef.id === 'p3' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'ஜனன விவரம்' : 'BIRTH DETAILS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="vivaram-split flex gap-3">
                      <div className="vivaram-img-slot w-[30mm] h-[45mm] border border-dashed border-stone-400 flex items-center justify-center bg-[#FAF8F5] text-[7pt] text-stone-500 overflow-hidden flex-shrink-0">
                        {p3.img ? <img src={p3.img} alt="Photo" className="w-full h-full object-cover" /> : (isTa ? 'புகைப்படம்' : 'Photo')}
                      </div>
                      <div className="vivaram-grid flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[7.8pt]">
                        <div><b>{isTa ? 'பெயர்' : 'Name'}:</b> {p3.name || ''} <span className="text-[7pt] text-stone-500">({p3.gender || ''})</span></div>
                        <div><b>{isTa ? 'தேதி' : 'Date & Time'}:</b> {p3.date || ''}</div>
                        <div><b>{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</b> {p3.tamilDate || ''}</div>
                        <div><b>{isTa ? 'உதயாதி நாழிகை' : 'Udayadi Nazhigai'}:</b> {p3.nazhigai || ''}</div>
                        <div><b>{isTa ? 'நாடு' : 'Country'}:</b> {p3.country || ''}</div>
                        <div><b>{isTa ? 'இடம்' : 'Place'}:</b> {p3.place1 || ''} {p3.place2 ? ', ' + p3.place2 : ''}</div>
                        <div><b>{isTa ? 'அட்ச தீர்க்க ரேகை' : 'Coordinates'}:</b> {p3.coords || ''}</div>
                        <div><b>{isTa ? 'பொது நேரம் திருத்தம்' : 'Time Correction'}:</b> {p3.tzcorr || ''}</div>
                        <div><b>{isTa ? 'லக்னம்' : 'Lagna'}:</b> {p3.lagna || ''}</div>
                        <div><b>{isTa ? 'ராசி' : 'Rasi'}:</b> {p3.rasi || ''}</div>
                        <div><b>{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}:</b> {p3.nakshatra || ''}</div>
                        <div><b>{isTa ? 'ஜனன திதி' : 'Tithi'}:</b> {p3.tithi || ''}</div>
                        <div><b>{isTa ? 'யோகம்' : 'Yogam'}:</b> {p3.yogam || ''}</div>
                        <div><b>{isTa ? 'கரணம்' : 'Karanam'}:</b> {p3.karanam || ''}</div>
                        <div><b>{isTa ? 'அயனம்' : 'Ayanam'}:</b> {p3.ayanam || ''}</div>
                        <div><b>{isTa ? 'கணம் / யோனி / நாடி' : 'Gana/Yoni/Nadi'}:</b> {p3.gyn || ''}</div>
                        <div><b>{isTa ? 'விருட்சம் / ரஜ்ஜு' : 'Tree / Rajju'}:</b> {p3.vr || ''}</div>
                        <div><b>{isTa ? 'பறவை / அதிதேவதை' : 'Bird / Deity'}:</b> {p3.pa || ''}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 4: JANANA NAKSHATRA DETAILS */}
                {pDef.id === 'p4' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'ஜனன விவரம்' : 'JANANA VIVARAM'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="nakshatra-grid grid grid-cols-2 gap-x-4 gap-y-1.5 text-[7.8pt]">
                      <div><b>{isTa ? 'ஜனன நட்சத்திரம்' : 'Birth Nakshatra'}:</b> {p4.nakshatra || ''}</div>
                      <div><b>{isTa ? 'நட்சத்திர ஆரம்ப நேரம்' : 'Nakshatra Start'}:</b> {p4.nakStart || ''}</div>
                      <div><b>{isTa ? 'நட்சத்திர முடிவு நேரம்' : 'Nakshatra End'}:</b> {p4.nakEnd || ''}</div>
                      <div><b>{isTa ? 'ஆதியந்த பரம நாழிகை' : 'Aadiyanta Nazhigai'}:</b> {p4.aadiyanta || ''}</div>
                      <div><b>{isTa ? 'கர்ப்பசெல் நாழிகை' : 'Garbhasel Nazhigai'}:</b> {p4.garbha || ''}</div>
                      <div><b>{isTa ? 'நின்ற இருப்பு நாழிகை' : 'Iruppu Nazhigai'}:</b> {p4.iruppu || ''}</div>
                      <div className="col-span-2"><b>{isTa ? 'திசை இருப்பு' : 'Dasha Balance'}:</b> {p4.dashaBal || ''}</div>
                      <div><b>{isTa ? 'ஜனன திதி' : 'Birth Tithi'}:</b> {p4.tithi || ''}</div>
                      <div><b>{isTa ? 'திதி சூன்ய ராசி' : 'Tithi Soonyam'}:</b> {p4.soonyam || ''}</div>
                      <div><b>{isTa ? 'யோகி' : 'Yogi'}:</b> {p4.yogi || ''}</div>
                      <div><b>{isTa ? 'அவயோகி' : 'Avayogi'}:</b> {p4.avayogi || ''}</div>
                      <div><b>{isTa ? 'நட்சத்திர ஹோரை' : 'Hora'}:</b> {p4.hora || ''}</div>
                      <div><b>{isTa ? 'அயனாம்சம்' : 'Ayanamsha'}:</b> <span className="font-mono">{p4.ayanamsha || ''}</span></div>
                      <div><b>{isTa ? 'சுதேச நேரத்திருத்தம்' : 'LMT Correction'}:</b> {p4.lmt || ''}</div>
                      <div><b>{isTa ? 'லக்ன சுபர்' : 'Lagna Benefics'}:</b> {p4.subhar || ''}</div>
                      <div><b>{isTa ? 'லக்ன பாபர்' : 'Lagna Malefics'}:</b> {p4.pabar || ''}</div>
                      <div><b>{isTa ? 'வைநாசிகத் தாரை' : 'Vainasika Tara'}:</b> {p4.vainasika || ''}</div>
                      <div><b>{isTa ? 'சூரிய உதயம்' : 'Sunrise'}:</b> {p4.sunrise || ''}</div>
                      <div><b>{isTa ? 'சூரிய அஸ்தமனம்' : 'Sunset'}:</b> {p4.sunset || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 5: RASI & NAVAMSA */}
                {pDef.id === 'p5' && (
                  <div>
                    <div className="charts-top-meta flex justify-between text-[8pt] mb-1">
                      <div><b>{p5.genderLabel || ''}</b> | {p5.date || ''} {p5.time || ''}</div>
                      <div><b>{isTa ? 'லக்னம்' : 'Lagna'}:</b> {p5.lagna || ''} | <b>{isTa ? 'ராசி' : 'Rasi'}:</b> {p5.rasi || ''} | <b>{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}:</b> {p5.nakPada || ''}</div>
                    </div>
                    <div className="charts-pair-row flex justify-around gap-2 my-1">
                      <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                        {renderSouthChart(isTa ? 'ராசி' : 'RASI', p5.rasiChart)}
                      </div>
                      <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                        {renderSouthChart(isTa ? 'நவாம்சம்' : 'NAVAMSA', p5.navamsaChart)}
                      </div>
                    </div>
                    <div className="flex justify-between text-[7.5pt] mt-1">
                      <div><b>{isTa ? 'இடம்' : 'Place'}:</b> {p5.place || ''} <span className="text-[6.8pt] text-stone-500">({p5.coords || ''})</span> | <b>{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</b> {p5.tamilDate || ''}</div>
                      <div><b>{p5.pakshaTithi || ''}</b> | <b>{p5.yogaKarana || ''}</b> | <b>{isTa ? 'திசை இருப்பு' : 'Dasha'}:</b> {p5.dashaBal || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 6: PLANET TABLE */}
                {pDef.id === 'p6' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{p6.heading || (isTa ? 'துல்லியமான நிராயன கிரக நிலைகள்' : 'PLANETARY POSITIONS')}</div>
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
                        {(p6.rows || []).map((r, idx) => (
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
                      <span><b>{isTa ? 'பெயர்' : 'Name'}:</b> {p6.footerName || ''}</span>
                      <span><b>{isTa ? 'தேதி' : 'Date'}:</b> {p6.footerDate || ''}</span>
                      <span><b>{isTa ? 'அயனாம்சம்' : 'Ayanamsha'}:</b> <span className="font-mono">{p6.footerAyanamsha || ''}</span></span>
                    </div>
                  </div>
                )}

                {/* PAGE 7: SRIPATI BHAVA & SPHUTAM */}
                {pDef.id === 'p7' && (
                  <div>
                    <div className="flex justify-between gap-1 mb-1">
                      {renderSouthChart(isTa ? 'ராசி' : 'RASI', p7.rasiChart, true)}
                      {renderSouthChart(isTa ? 'நவாம்சம்' : 'NAVAMSA', p7.navamsaChart, true)}
                      {renderSouthChart(isTa ? '3-திரேக்காணம்' : 'D3-DREKKANA', p7.drekkanaChart, true)}
                    </div>
                    <div className="flex gap-2 items-start mt-1">
                      <div className="w-[56mm]">
                        {renderSouthChart(isTa ? 'ஸ்ரீபதி-பாவகம்' : 'SRIPATI BHAVA', p7.sripatiChart, true)}
                      </div>
                      <div className="flex-1">
                        <div className="text-[8.5pt] font-black mb-1">{isTa ? 'பாவ ஸ்புடம் (ஸ்ரீபதி முறை)' : 'BHAVA SPHUTAM (SRIPATI)'}</div>
                        <div className="flex gap-2">
                          <table className="data-table w-[42%] text-[7.2pt]">
                            <thead>
                              <tr><th>{p7.personName || (isTa ? 'கிரகம்' : 'Planet')}</th><th>{isTa ? 'பாகை' : 'Deg'}</th></tr>
                            </thead>
                            <tbody>
                              {(p7.grahasSphutam || []).map((g, idx) => (
                                <tr key={idx}><td><b>{g.graha}</b></td><td className="font-mono">{g.deg || ''}</td></tr>
                              ))}
                            </tbody>
                          </table>
                          <table className="data-table w-[58%] text-[7.2pt]">
                            <thead>
                              <tr><th className="text-center">{isTa ? 'பாவம்' : 'Bhava'}</th><th>{isTa ? 'ஆரம்பம்' : 'Start'}</th><th>{isTa ? 'மத்தி' : 'Madhya'}</th><th>{isTa ? 'முடிவு' : 'End'}</th></tr>
                            </thead>
                            <tbody>
                              {(p7.bhavas || []).map((b, idx) => (
                                <tr key={idx}><td className="text-center">{b.bhava}</td><td className="font-mono">{b.start || ''}</td><td className="font-mono">{b.madhya || ''}</td><td className="font-mono">{b.end || ''}</td></tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="text-[7.5pt] mt-1"><b>{isTa ? 'ஜாதகத்தில் பாவக மாற்றம்' : 'Bhava Shift'}: </b>{p7.bhavaChange || ''}</div>
                  </div>
                )}

                {/* PAGE 8: DIVISIONAL D3 & D7 */}
                {pDef.id === 'p8' && (
                  <div className="charts-pair-row flex justify-around gap-2 my-1">
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '3-திரேக்காணம்' : 'D3-DREKKANA', p8.d3Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p8.d3Text || ''}</div>
                    </div>
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '7-சப்தாம்சம்' : 'D7-SAPTAMSA', p8.d7Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p8.d7Text || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 9: DIVISIONAL D60 & D30 */}
                {pDef.id === 'p9' && (
                  <div className="charts-pair-row flex justify-around gap-2 my-1">
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '60-சஷ்டியாம்சம்' : 'D60-SHASHTIAMSA', p9.d60Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p9.d60Text || ''}</div>
                    </div>
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '30-திரிம்சாம்சம்' : 'D30-TRIMSAMSA', p9.d30Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p9.d30Text || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 10: DIVISIONAL D10 & D16 */}
                {pDef.id === 'p10' && (
                  <div className="charts-pair-row flex justify-around gap-2 my-1">
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '10-தசாம்சம்' : 'D10-DASAMSA', p10.d10Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p10.d10Text || ''}</div>
                    </div>
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '16-ஷோடசாம்சம்' : 'D16-SHODASAMSA', p10.d16Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p10.d16Text || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 11: DIVISIONAL D4 & D12 */}
                {pDef.id === 'p11' && (
                  <div className="charts-pair-row flex justify-around gap-2 my-1">
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '4-சதுராம்சம்' : 'D4-CHATURTHAMSA', p11.d4Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p11.d4Text || ''}</div>
                    </div>
                    <div className="chart-box-wrap flex-1 max-w-[88mm] flex flex-col items-center">
                      {renderSouthChart(isTa ? '12-துவாதசாம்சம்' : 'D12-DWADASAMSA', p11.d12Chart)}
                      <div className="text-[7.2pt] mt-1 leading-snug">{p11.d12Text || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 12: HORA CHART */}
                {pDef.id === 'p12' && (
                  <div className="flex gap-4 items-start">
                    <div className="flex-[2] flex justify-center">
                      {renderSouthChart(isTa ? 'ஓரை' : 'HORA (D2)', p12.horaChart)}
                    </div>
                    <div className="flex-1 text-[7.5pt] leading-normal p-1">
                      <div className="font-bold text-[8.5pt] mb-1">{isTa ? 'ஓரை பலன்கள்' : 'Hora Analysis'}</div>
                      <div>{p12.notes || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 13: SHADBALA */}
                {pDef.id === 'p13' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'ஜாதகத்தில் ஷட்பலம் ஆய்வு' : 'SHADBALA ANALYSIS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="text-[8pt] font-bold mb-0.5">{isTa ? 'கிரக கணிதம்' : 'Graha Bala'}</div>
                    <table className="data-table w-full text-[7.2pt]">
                      <thead>
                        <tr>
                          <th>{isTa ? 'பலன்' : 'Bala'}</th>
                          {(p13.grahaCols || ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி']).map((g, idx) => (
                            <th key={idx} className="text-center">{g}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(p13.grahaRows || []).map((r, rIdx) => (
                          <tr key={rIdx}>
                            <td><b>{r.name}</b></td>
                            {(r.vals || []).map((v, cIdx) => (
                              <td key={cIdx} className="font-mono text-center">{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="text-[8pt] font-bold mt-2 mb-0.5">{isTa ? 'பாவக கணிதம்' : 'Bhava Bala'}</div>
                    <table className="data-table w-full text-[7.2pt]">
                      <thead>
                        <tr>
                          <th>{isTa ? 'பலன்' : 'Bala'}</th>
                          {Array.from({ length: 12 }, (_, i) => <th key={i} className="text-center">{i + 1}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {(p13.bhavaRows || []).map((r, rIdx) => (
                          <tr key={rIdx}>
                            <td><b>{r.name}</b></td>
                            {(r.vals || []).map((v, cIdx) => (
                              <td key={cIdx} className="font-mono text-center">{v}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PAGE 14: UPAGRAHAS 1 */}
                {pDef.id === 'p14' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'உபகிரகங்கள் - குளிகாதி ஐவர் விவரங்கள்' : 'UPAGRAHAS - GULIKADI'}</div>
                    <div className="title-rule border-t border-black mb-1"></div>
                    <div className="text-[7.2pt] mb-1">{p14.introText || ''}</div>
                    <table className="data-table w-full text-[7pt]">
                      <thead>
                        <tr>
                          <th rowSpan={2}>{isTa ? 'உப கிரகம்' : 'Upagraha'}</th>
                          <th rowSpan={2}>{isTa ? 'அதிபதி' : 'Lord'}</th>
                          <th rowSpan={2}>{isTa ? 'கிரகம்' : 'Graha'}</th>
                          <th colSpan={4} className="text-center">{isTa ? 'பராசரர் முறை' : 'Parasara'}</th>
                          <th colSpan={4} className="text-center">{isTa ? 'காளிதாசர் முறை' : 'Kalidasa'}</th>
                        </tr>
                        <tr>
                          <th>{isTa ? 'ராசி' : 'Rasi'}</th><th>{isTa ? 'பாகை' : 'Deg'}</th><th>{isTa ? 'நட்' : 'Nak'}</th><th>{isTa ? 'பா' : 'P'}</th>
                          <th>{isTa ? 'ராசி' : 'Rasi'}</th><th>{isTa ? 'பாகை' : 'Deg'}</th><th>{isTa ? 'நட்' : 'Nak'}</th><th>{isTa ? 'பா' : 'P'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(p14.table1 || []).map((r, idx) => (
                          <tr key={idx}>
                            <td><b>{r.name}</b></td>
                            <td>{r.lord || ''}</td>
                            <td>{r.graha || ''}</td>
                            <td>{r.pRasi || ''}</td>
                            <td className="font-mono">{r.pDeg || ''}</td>
                            <td>{r.pNak || ''}</td>
                            <td className="text-center">{r.pPada || ''}</td>
                            <td>{r.kRasi || ''}</td>
                            <td className="font-mono">{r.kDeg || ''}</td>
                            <td>{r.kNak || ''}</td>
                            <td className="text-center">{r.kPada || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="text-[8pt] font-bold mt-2 mb-0.5">{isTa ? 'உபகிரகங்கள் - தூமாதி ஐவர் ஸ்புடங்கள்' : 'DHUMADI SPHUTAS'}</div>
                    <table className="data-table w-full text-[7pt]">
                      <thead>
                        <tr>
                          <th>{isTa ? 'உபகிரகம்' : 'Upagraha'}</th>
                          <th>{isTa ? 'அதிபதி' : 'Lord'}</th>
                          <th>{isTa ? 'ராசி' : 'Rasi'}</th>
                          <th>{isTa ? 'பாகை-கலை' : 'Deg-Min'}</th>
                          <th>{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                          <th className="text-center">{isTa ? 'பாதம்' : 'Pada'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(p14.table2 || []).map((r, idx) => (
                          <tr key={idx}>
                            <td><b>{r.name}</b></td>
                            <td>{r.lord || ''}</td>
                            <td>{r.rasi || ''}</td>
                            <td className="font-mono">{r.deg || ''}</td>
                            <td>{r.nak || ''}</td>
                            <td className="text-center">{r.pada || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PAGE 15: UPAGRAHAS 2 & SPHUTAS */}
                {pDef.id === 'p15' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்' : 'UPAGRAHAS & SPECIAL SPHUTAS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="flex gap-3 items-start">
                      <div className="w-[56mm]">
                        {renderSouthChart(isTa ? 'உபகிரகம்' : 'UPAGRAHA', p15.upagrahaChart, true)}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[7.2pt]">
                        <div><b>{isTa ? 'ஓரா லக்னம்' : 'Hora Lagna'}:</b> <span className="font-mono">{p15.sphutas?.horaLagna || ''}</span></div>
                        <div><b>{isTa ? 'ஆருட லக்னம்' : 'Arudha Lagna'}:</b> <span className="font-mono">{p15.sphutas?.arudhaLagna || ''}</span></div>
                        <div><b>{isTa ? 'கடிகா லக்னம்' : 'Ghatika Lagna'}:</b> <span className="font-mono">{p15.sphutas?.ghatikaLagna || ''}</span></div>
                        <div><b>{isTa ? 'இந்து லக்னம்' : 'Indu Lagna'}:</b> <span className="font-mono">{p15.sphutas?.induLagna || ''}</span></div>
                        <div><b>{isTa ? 'பாவ லக்னம்' : 'Bhava Lagna'}:</b> <span className="font-mono">{p15.sphutas?.bhavaLagna || ''}</span></div>
                        <div><b>{isTa ? 'ஸ்ரீ லக்னம்' : 'Sri Lagna'}:</b> <span className="font-mono">{p15.sphutas?.sriLagna || ''}</span></div>
                        <div><b>{isTa ? 'யோகி பாகை' : 'Yogi Deg'}:</b> <span className="font-mono">{p15.sphutas?.yogiDeg || ''}</span></div>
                        <div><b>{isTa ? 'அவயோகி பாகை' : 'Avayogi Deg'}:</b> <span className="font-mono">{p15.sphutas?.avayogiDeg || ''}</span></div>
                        <div><b>{isTa ? 'மாற்று யோகி' : 'Matru Yogi'}:</b> {p15.sphutas?.matruYogi || ''}</div>
                        <div><b>{isTa ? '22-ம் திரேக்காணம்' : '22nd Drekkana'}:</b> {p15.sphutas?.drekkana22 || ''}</div>
                        <div><b>{isTa ? '64-ம் நவாம்சம்' : '64th Navamsa'}:</b> {p15.sphutas?.navamsa64 || ''}</div>
                        <div><b>{isTa ? 'சர்ப்ப திரேக்காணம்' : 'Sarpa Drekkana'}:</b> {p15.sphutas?.sarpaDrekkana || ''}</div>
                        <div><b>{isTa ? 'க்ஷேத்ர ஸ்புடம்' : 'Kshetra Sphutam'}:</b> <span className="font-mono">{p15.sphutas?.kshetraSphutam || ''}</span></div>
                        <div><b>{isTa ? 'அதிர்ஷ்டப்பாகை' : 'Adrishta Deg'}:</b> <span className="font-mono">{p15.sphutas?.adrishtaDeg || ''}</span></div>
                      </div>
                    </div>
                    <div className="text-[7.2pt] mt-2 border-t border-stone-300 pt-1 flex flex-col gap-0.5">
                      <div><b>{isTa ? 'ஐந்தாம் பாவ சுப/அசுப பலன்கள்' : '5th Bhava Effects'}:</b> {p15.notes?.bhava5 || ''}</div>
                      <div><b>{isTa ? 'அந்தகாம்சத்தில் உள்ள கிரகங்கள்' : 'Andhaka Grahas'}:</b> {p15.notes?.andhaka || ''}</div>
                      <div><b>{isTa ? 'புஷ்கராம்சத்தில் உள்ள கிரகங்கள்' : 'Pushkara Grahas'}:</b> {p15.notes?.pushkara || ''}</div>
                      <div><b>{isTa ? 'மிருத்யு பாகையில் உள்ள கிரகங்கள்' : 'Mrityu Grahas'}:</b> {p15.notes?.mrityu || ''}</div>
                      <div><b>{isTa ? 'அவமிருத்து நட்சத்திரத்தில் உள்ள கிரகங்கள்' : 'Avamrityu Grahas'}:</b> {p15.notes?.avamrityu || ''}</div>
                    </div>
                  </div>
                )}

                {/* PAGE 16: RELATIONSHIPS AND AVASTHAS */}
                {pDef.id === 'p16' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'நைசர்கிக, தற்கால & சத்ரு-மித்ரு நிலைகள்' : 'GRAHA RELATIONSHIPS & AVASTHAS'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[7.5pt] font-bold mb-1">{isTa ? 'நைசர்கிக நட்பு' : 'Naisargika'}</div>
                        <table className="data-table w-full text-[7pt]">
                          <thead>
                            <tr>
                              <th></th>
                              {(p16.grahaNames || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி']).map((g, idx) => (
                                <th key={idx} className="text-center">{g.slice(0, 3)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(p16.grahaNames || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி']).map((g, rIdx) => (
                              <tr key={rIdx}>
                                <td><b>{g.slice(0, 3)}</b></td>
                                {(p16.grahaNames || []).map((_, cIdx) => (
                                  <td key={cIdx} className="text-center font-mono">
                                    {rIdx === cIdx ? '---' : (p16.naisargika?.[rIdx]?.[cIdx] || '')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <div className="text-[7.5pt] font-bold mb-1">{isTa ? 'தற்கால நட்பு' : 'Tatkalika'}</div>
                        <table className="data-table w-full text-[7pt]">
                          <thead>
                            <tr>
                              <th></th>
                              {(p16.grahaNames || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி']).map((g, idx) => (
                                <th key={idx} className="text-center">{g.slice(0, 3)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(p16.grahaNames || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி']).map((g, rIdx) => (
                              <tr key={rIdx}>
                                <td><b>{g.slice(0, 3)}</b></td>
                                {(p16.grahaNames || []).map((_, cIdx) => (
                                  <td key={cIdx} className="text-center font-mono">
                                    {rIdx === cIdx ? '---' : (p16.tatkalika?.[rIdx]?.[cIdx] || '')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="text-[6.8pt] text-stone-500 my-1">{p16.legend || ''}</div>
                    <div className="text-[7.5pt] font-bold mt-1 mb-0.5">{isTa ? 'கிரகங்களின் அவஸ்தா - மண்டலம் - தசா சமய நிலைகள்' : 'Avasthas & Mandalam'}</div>
                    <table className="data-table w-full text-[7.2pt]">
                      <thead>
                        <tr>
                          <th>{isTa ? 'கிரகம்' : 'Graha'}</th>
                          <th>{isTa ? 'ராசி' : 'Rasi'}</th>
                          <th>{isTa ? 'பாகை' : 'Deg'}</th>
                          <th>{isTa ? 'அவஸ்தா' : 'Avastha'}</th>
                          <th className="text-center">{isTa ? 'நிலை' : 'Status'}</th>
                          <th>{isTa ? 'தசா மண்டலம்' : 'Mandalam'}</th>
                          <th>{isTa ? 'தசா சமயம்' : 'Samayam'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(p16.avasthas || []).map((r, idx) => (
                          <tr key={idx}>
                            <td><b>{r.graha}</b></td>
                            <td>{r.rasi || ''}</td>
                            <td className="font-mono">{r.deg || ''}</td>
                            <td>{r.avastha || ''}</td>
                            <td className="text-center">{r.status || ''}</td>
                            <td>{r.mandalam || ''}</td>
                            <td>{r.samayam || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PAGE 17: SARVASHTAVARGA */}
                {pDef.id === 'p17' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'சர்வாஷ்டவர்க்க பரல்கள் விவரம்..' : 'SARVASHTAVARGA POINTS TABLE'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <table className="data-table w-full text-[7.2pt]">
                      <thead>
                        <tr>
                          <th>{isTa ? 'கிரகம்' : 'Graha'}</th>
                          {['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'].map((s, idx) => (
                            <th key={idx} className="text-center">{s}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(p17.grahas || ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி']).map((g, rIdx) => (
                          <tr key={rIdx}>
                            <td><b>{g}</b></td>
                            {Array.from({ length: 12 }, (_, cIdx) => (
                              <td key={cIdx} className="text-center font-mono">{p17.matrix?.[rIdx]?.[cIdx] || ''}</td>
                            ))}
                          </tr>
                        ))}
                        <tr className="border-t-2 border-black font-black">
                          <td>{isTa ? 'மொத்தம்' : 'Total'}</td>
                          {Array.from({ length: 12 }, (_, cIdx) => (
                            <td key={cIdx} className="text-center font-mono">{p17.totals?.[cIdx] || ''}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex gap-3 items-start mt-2">
                      <div className="w-[56mm]">
                        {renderSouthChart(`${isTa ? 'பரல்கள்' : 'Points'}<br/>${p17.grandTotal || ''}`, p17.chartCells, true)}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[7.2pt]">
                        <div><b>{isTa ? 'கேந்திரம்' : 'Kendram'}:</b> <span className="font-mono">{p17.kendram || ''}</span></div>
                        <div><b>{isTa ? 'பணபரம்' : 'Panaparam'}:</b> <span className="font-mono">{p17.panaparam || ''}</span></div>
                        <div><b>{isTa ? 'ஆபோக்லீயம்' : 'Apoklimam'}:</b> <span className="font-mono">{p17.apoklimam || ''}</span></div>
                        <div><b>{isTa ? 'உபசெயம்' : 'Upachayam'}:</b> <span className="font-mono">{p17.upachayam || ''}</span></div>
                        <div><b>{isTa ? 'திரிகோணம்' : 'Trikonam'}:</b> <span className="font-mono">{p17.trikonam || ''}</span></div>
                        <div></div>
                        <div><b>{isTa ? 'வரவினம்' : 'Inflow'}:</b> <span className="font-mono">{p17.varavinam || ''}</span></div>
                        <div><b>{isTa ? 'செலவினம்' : 'Outflow'}:</b> <span className="font-mono">{p17.selavinam || ''}</span></div>
                        <div><b>{isTa ? 'கிழக்கு' : 'East'}:</b> <span className="font-mono">{p17.east || ''}</span></div>
                        <div><b>{isTa ? 'மேற்கு' : 'West'}:</b> <span className="font-mono">{p17.west || ''}</span></div>
                        <div><b>{isTa ? 'தெற்கு' : 'South'}:</b> <span className="font-mono">{p17.south || ''}</span></div>
                        <div><b>{isTa ? 'வடக்கு' : 'North'}:</b> <span className="font-mono">{p17.north || ''}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 18: NUMEROLOGY */}
                {pDef.id === 'p18' && (
                  <div>
                    <div className="page-title text-[10.5pt] font-black text-center mb-1">{isTa ? 'எண் கணிதம் (நியூமராலஜி)' : 'NUMEROLOGY'}</div>
                    <div className="title-rule border-t border-black mb-2"></div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[7.8pt] mb-2">
                      <div><b>{isTa ? 'பெயர்' : 'Name'}:</b> {p18.name || ''}</div>
                      <div><b>{isTa ? 'ஆங்கில எழுத்துகளின் கூட்டல்' : 'English Letters Sum'}:</b> <span className="font-mono">{p18.engSum || ''}</span></div>
                      <div><b>{isTa ? 'பிறந்த தேதி' : 'Date of Birth'}:</b> {p18.dobEng || ''}</div>
                      <div><b>{isTa ? 'தேதி (உடல்) எண்' : 'Birth Day Number'}:</b> <span className="font-mono">{p18.dateNum || ''}</span></div>
                      <div><b>{isTa ? 'வருஷ (உயிர்) எண்' : 'Life Path Number'}:</b> <span className="font-mono">{p18.yearNum || ''}</span></div>
                      <div><b>{isTa ? 'அதிர்ஷ்ட எண்கள்' : 'Lucky Numbers'}:</b> <span className="font-mono">{p18.luckyNums || ''}</span></div>
                      <div><b>{isTa ? 'அதிர்ஷ்ட தேதிகள்' : 'Lucky Dates'}:</b> {p18.luckyDates || ''}</div>
                      <div><b>{isTa ? 'அதிர்ஷ்ட நிறங்கள்' : 'Lucky Colors'}:</b> {p18.luckyColors || ''}</div>
                      <div><b>{isTa ? 'அதிர்ஷ்ட கற்கள்' : 'Lucky Gemstones'}:</b> {p18.luckyStones || ''}</div>
                      <div><b>{isTa ? 'மேன்மை தரும் தெய்வம்' : 'Benefic Deity'}:</b> {p18.deity || ''}</div>
                      <div className="col-span-2"><b>{isTa ? 'ஸ்தலங்கள் (தென்னிந்தியா)' : 'Temples'}:</b> {p18.temples || ''}</div>
                    </div>

                    <table className="data-table w-full text-[6.8pt] mt-2">
                      <tbody>
                        <tr>
                          {ALPHABETS.map((l, idx) => (
                            <td key={idx} className="text-center font-mono font-bold p-0.5">{l}</td>
                          ))}
                        </tr>
                        <tr className="border-t border-stone-300">
                          {ALPHABETS.map((_, idx) => (
                            <td key={idx} className="text-center font-mono p-0.5">{p18.letters?.[idx] || ''}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-center text-[9.5pt] font-black mt-3 text-[#7A1A22]">{p18.subham || (isTa ? 'சுபம்.' : 'Subham.')}</div>
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
    </div>
  );
}
