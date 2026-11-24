import React, { useState, useMemo } from 'react';
import {
  Printer,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Edit
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import LetterheadBrandingModal, { getInitialLetterhead } from './LetterheadBrandingModal';
import AIPrompt51PageModal from './AIPrompt51PageModal';
import {
  compute51PageBookletData,
  calculateThirukanithaHoroscope
} from '../utils/thirukanithaEngine';
import { printElementById } from '../utils/printHelper';

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

const SIGN_INDEX_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SIGN_NAMES = [
  { num: 1, ta: 'மேஷம்', en: 'Aries', shortTa: 'மேஷ', shortEn: 'Ari' },
  { num: 2, ta: 'ரிஷபம்', en: 'Taurus', shortTa: 'ரிஷ', shortEn: 'Tau' },
  { num: 3, ta: 'மிதுனம்', en: 'Gemini', shortTa: 'மிது', shortEn: 'Gem' },
  { num: 4, ta: 'கடகம்', en: 'Cancer', shortTa: 'கட', shortEn: 'Can' },
  { num: 5, ta: 'சிம்மம்', en: 'Leo', shortTa: 'சிம்', shortEn: 'Leo' },
  { num: 6, ta: 'கன்னி', en: 'Virgo', shortTa: 'கன்', shortEn: 'Vir' },
  { num: 7, ta: 'துலாம்', en: 'Libra', shortTa: 'துலா', shortEn: 'Lib' },
  { num: 8, ta: 'விருச்சிகம்', en: 'Scorpio', shortTa: 'விருச்', shortEn: 'Sco' },
  { num: 9, ta: 'தனுசு', en: 'Sagittarius', shortTa: 'தனு', shortEn: 'Sag' },
  { num: 10, ta: 'மகரம்', en: 'Capricorn', shortTa: 'மக', shortEn: 'Cap' },
  { num: 11, ta: 'கும்பம்', en: 'Aquarius', shortTa: 'கும்', shortEn: 'Aqu' },
  { num: 12, ta: 'மீனம்', en: 'Pisces', shortTa: 'மீன', shortEn: 'Pis' }
];

// 20 Logical Horoscope Sections mapping to the exact 51 pages of the booklet
export const HOROSCOPE_20_SECTIONS = [
  { id: 1, titleEn: '1. Cover & Vinayagar Slogan (Pages 1-2)', titleTa: '1. முகப்பு & விநாயகர் ஸ்துதி (பக்கங்கள் 1-2)', defaultSelected: true, pages: [1, 2] },
  { id: 2, titleEn: '2. Birth Particulars & Panchangam (Pages 3-4)', titleTa: '2. ஜனன விபரம் & பஞ்சாங்கம் (பக்கங்கள் 3-4)', defaultSelected: true, pages: [3, 4] },
  { id: 3, titleEn: '3. D1 Rasi & D9 Navamsa Charts (Page 5)', titleTa: '3. ராசி & நவாம்சம் சக்கரங்கள் (பக்கம் 5)', defaultSelected: true, pages: [5] },
  { id: 4, titleEn: '4. Nirayana Planetary Positions Table (Page 6)', titleTa: '4. துல்லியமான நிராயன கிரக நிலைகள் (பக்கம் 6)', defaultSelected: true, pages: [6] },
  { id: 5, titleEn: '5. Sripati Bhava Cusps & 4 Charts (Page 7)', titleTa: '5. ஸ்ரீபதி பாவக ஆரம்ப, மத்திம, முடிவு (பக்கம் 7)', defaultSelected: true, pages: [7] },
  { id: 6, titleEn: '6. Divisional Charts D3-D60-D10-D4-D2 (Pages 8-12)', titleTa: '6. வர்க்கச் சக்கரங்கள் D3, D7, D60, D30.. (பக்கங்கள் 8-12)', defaultSelected: true, pages: [8, 9, 10, 11, 12] },
  { id: 7, titleEn: '7. Shadbala & Bhava Bala Analysis (Page 13)', titleTa: '7. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் (பக்கம் 13)', defaultSelected: true, pages: [13] },
  { id: 8, titleEn: '8. Upagrahas & Special Lagnas (Pages 14-15)', titleTa: '8. உபகிரகங்கள் குளிகாதி, தூமாதி & ஸ்புடங்கள் (பக்கங்கள் 14-15)', defaultSelected: true, pages: [14, 15] },
  { id: 9, titleEn: '9. Planetary Friendships & Avasthas (Pages 16-17)', titleTa: '9. கிரக நட்பு நிலைகள் & அவஸ்தைகள் (பக்கங்கள் 16-17)', defaultSelected: true, pages: [16, 17] },
  { id: 10, titleEn: '10. Aspect Angles - Graha & Bhava (Pages 18-19)', titleTa: '10. கிரக & பாவக பார்வை கோணங்கள் (பக்கங்கள் 18-19)', defaultSelected: true, pages: [18, 19] },
  { id: 11, titleEn: '11. Dasavarga Dignity Strength Matrix (Page 20)', titleTa: '11. கிரகங்களின் தசவர்க்கமும் பலமும் (பக்கம் 20)', defaultSelected: true, pages: [20] },
  { id: 12, titleEn: '12. Pancha Pakshi Siddha System (Page 21)', titleTa: '12. பஞ்ச பட்சி விபரம் (பக்கம் 21)', defaultSelected: true, pages: [21] },
  { id: 13, titleEn: '13. 9 Maha Dashas & Pariharams (Pages 22-30)', titleTa: '13. 9 மகா திசா புக்திகள் & பரிகாரங்கள் (பக்கங்கள் 22-30)', defaultSelected: true, pages: [22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { id: 14, titleEn: '14. Functional Roles & Tara Bala (Page 31)', titleTa: '14. பாசகர், போதகர், காரகர் & தாரா பலம் (பக்கம் 31)', defaultSelected: true, pages: [31] },
  { id: 15, titleEn: '15. Planetary Dignities & Conjunctions (Page 32)', titleTa: '15. கிரகங்களின் நிலை, பார்வைகள் & சேர்க்கை (பக்கம் 32)', defaultSelected: true, pages: [32] },
  { id: 16, titleEn: '16. Sevvai Dosham Analysis (Page 33)', titleTa: '16. செவ்வாய் தோஷ ஆய்வு (பக்கம் 33)', defaultSelected: true, pages: [33] },
  { id: 17, titleEn: '17. 120-Year Vimshottari 81 Antaras (Pages 34-42)', titleTa: '17. 120 வருட விம்சோத்தரி 81 அந்தரங்கள் (பக்கங்கள் 34-42)', defaultSelected: true, pages: [34, 35, 36, 37, 38, 39, 40, 41, 42] },
  { id: 18, titleEn: '18. Individual Graha Ashtakavarga Shodhana (Pages 43-49)', titleTa: '18. தனித்தனி அஷ்டவர்க்க சோதனை (பக்கங்கள் 43-49)', defaultSelected: true, pages: [43, 44, 45, 46, 47, 48, 49] },
  { id: 19, titleEn: '19. Sarvashtakavarga 337 Bindus & Metrics (Page 50)', titleTa: '19. சர்வாஷ்டவர்க்கம் 337 பரல்கள் (பக்கம் 50)', defaultSelected: true, pages: [50] },
  { id: 20, titleEn: '20. Astro-Numerology & Chaldean Matrix (Page 51)', titleTa: '20. எண் கணிதம் & சால்டியன் முறை (பக்கம் 51)', defaultSelected: true, pages: [51] }
];

export default function HoroscopeMultiPagePrint({
  birthData,
  onSwitchToScreen,
  onSwitchToOnePage
}) {
  const { lang } = useLang();
  const isTa = lang === 'ta';
  const { user } = useAuth();

  // Letterhead Branding State (synced with profile / localStorage)
  const [letterhead, setLetterhead] = useState(() => getInitialLetterhead(user, isTa));
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);
  const [aiPromptModalOpen, setAiPromptModalOpen] = useState(false);

  // Selected Section IDs (Defaults to ALL 20 sections = Full 51 Pages)
  const [selectedIds, setSelectedIds] = useState(() =>
    HOROSCOPE_20_SECTIONS.map(s => s.id)
  );

  // Compute 51-Page Booklet Data directly using authentic Thirukanitha engine
  const bookletData = useMemo(() => {
    return compute51PageBookletData(birthData || {});
  }, [birthData]);

  // Astrologer branding
  const astrologerTitle =
    letterhead?.line1 ||
    user?.pagerHeader?.line1 ||
    user?.branding?.title ||
    user?.displayName ||
    (isTa ? 'ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்' : 'SAI BALAJI ASTROLOGICAL RESEARCH CENTRE');

  const astrologerSubTitle =
    letterhead?.line2 ||
    user?.pagerHeader?.line2 ||
    '';

  const astrologerContact =
    letterhead?.phoneEmail ||
    user?.pagerHeader?.phoneEmail ||
    user?.branding?.phone ||
    'Ph: +91 98765 43210 • email: astro@astrojit.com';

  const astrologerAddress =
    [letterhead?.address1, letterhead?.address2].filter(Boolean).join(' • ') ||
    [user?.pagerHeader?.address1, user?.pagerHeader?.address2].filter(Boolean).join(' • ') || '';

  const printedDateTime = useMemo(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  }, []);

  const handlePrint = () => {
    printElementById('astrojit-horoscope-multipage');
  };

  const toggleSection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(HOROSCOPE_20_SECTIONS.map(s => s.id));
  const selectStandard = () => setSelectedIds([1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 13, 16, 19, 20]);
  const selectCore = () => setSelectedIds([1, 2, 3, 4, 5, 7, 19]);
  const clearAll = () => setSelectedIds([]);

  // Helper to render South Indian Chart in half-page block
  const renderMiniChart = (chartCells = [], chartTitle = '', chartDomain = '', height = '112px') => {
    const safeCells = Array.isArray(chartCells) ? chartCells : [];
    return (
      <div className="border border-black bg-white rounded-none overflow-hidden">
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed', height }}>
          <tbody>
            {[0, 1, 2, 3].map(row => (
              <tr key={row} style={{ height: '28px' }}>
                {[0, 1, 2, 3].map(col => {
                  const isCenter = (row === 1 || row === 2) && (col === 1 || col === 2);
                  if (isCenter) {
                    if (row === 1 && col === 1) {
                      return (
                        <td
                          key={col}
                          rowSpan={2}
                          colSpan={2}
                          className="border border-black text-center align-middle p-1 bg-[#FFFDF9]"
                        >
                          <div className="font-black text-[9.5px] text-[#7A1A22] leading-tight tracking-wider uppercase">
                            {chartTitle}
                          </div>
                          {chartDomain && (
                            <div className="text-[6.5px] text-stone-600 leading-tight mt-0.5 max-w-[90px] mx-auto truncate font-medium">
                              {chartDomain}
                            </div>
                          )}
                        </td>
                      );
                    }
                    return null;
                  }

                  const cellDef = SOUTH_INDIAN_CELLS.find(c => c.row === row && c.col === col);
                  const rasiIdx = cellDef ? cellDef.rasi : 0;
                  const signOrderIdx = SIGN_INDEX_ORDER.indexOf(rasiIdx);
                  const signInfo = SIGN_NAMES[rasiIdx] || { ta: '', en: '', num: rasiIdx + 1 };
                  const content = String(safeCells[signOrderIdx] || '');
                  const hasLagna = content.includes('1-லக்') || content.includes('1-Lag') || content.includes('லக்');

                  return (
                    <td
                      key={col}
                      className="border border-black p-0.5 align-top relative bg-white"
                      style={{ width: '25%' }}
                    >
                      {hasLagna && (
                        <div
                          className="absolute bottom-0 left-0 w-2.5 h-2.5 pointer-events-none"
                          style={{
                            borderBottom: '1.5px solid black',
                            borderLeft: '1.5px solid black',
                            transform: 'rotate(45deg)',
                            transformOrigin: 'bottom left'
                          }}
                        />
                      )}
                      <div className="flex justify-between items-center text-[7px] font-bold text-stone-600 leading-none">
                        <span className="truncate">{isTa ? signInfo.ta : signInfo.en}</span>
                        <span className="opacity-40 font-mono text-[6.5px]">{signInfo.num}</span>
                      </div>
                      <div className="text-[7px] font-bold text-black flex flex-wrap gap-0.5 leading-tight mt-0.5">
                        {content.split(',').map((item, pIdx) => {
                          const trim = item.trim();
                          if (!trim) return null;
                          const isLag = trim.includes('1-லக்') || trim.includes('1-Lag') || trim.includes('லக்');
                          return (
                            <span
                              key={pIdx}
                              className={`inline-block px-0.5 rounded-2xs ${
                                isLag ? 'bg-amber-200 text-[#7A1A22] font-black' : ''
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

  // -------------------------------------------------------------
  // BUILD EXACT 51 SHEETS BASED ON SELECTED SECTION IDS
  // -------------------------------------------------------------
  const generatedSheets = useMemo(() => {
    const sheets = [];
    const d = bookletData || {};
    const nativeName = birthData?.name || d.p1?.name || 'Muthu Kumar';
    const dobFormatted = birthData?.dob || d.p1?.date || '15-06-1994';

    // Helper: is page included in selected sections?
    const isPageSelected = (pageNum) => {
      const parentSec = HOROSCOPE_20_SECTIONS.find(s => s.pages.includes(pageNum));
      return parentSec ? selectedIds.includes(parentSec.id) : true;
    };

    // -----------------------------------------------------------
    // PAGE 1: Janana Jathakam Primary Profile
    // -----------------------------------------------------------
    if (isPageSelected(1)) {
      const p1 = d.p1 || {};
      sheets.push({
        pageNum: 1,
        pageKey: 'page-1',
        title: isTa ? 'ஜனன ஜாதகம்' : 'Janana Jathakam',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            {/* Top Astrologer Header Box */}
            <div
              onClick={() => setBrandingModalOpen(true)}
              className="border border-black p-1 text-center bg-[#FAF6EE] relative group cursor-pointer hover:ring-2 hover:ring-amber-600/40 transition-all"
              title={isTa ? 'லெட்டர்ஹெட் அமைப்புகளைத் திருத்த கிளிக் செய்க' : 'Click to edit letterhead branding details'}
            >
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setBrandingModalOpen(true); }}
                className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#7A1A22] text-white text-[8px] font-bold px-1.5 py-0.2 rounded shadow cursor-pointer flex items-center gap-0.5"
              >
                <span>✏️</span>
                <span>{isTa ? 'திருத்து' : 'Edit'}</span>
              </button>
              <div className="text-[10px] font-black uppercase text-[#7A1A22] tracking-wider">
                {astrologerTitle}
              </div>
              {astrologerSubTitle && (
                <div className="text-[8px] font-bold text-stone-800 leading-tight">
                  {astrologerSubTitle}
                </div>
              )}
              <div className="text-[7px] text-stone-700 font-medium mt-0.5">
                {[astrologerAddress, astrologerContact].filter(Boolean).join(' • ')}
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-0.5">
              <span className="text-[12px] font-black text-[#7A1A22] tracking-widest border-b-2 border-black pb-0.5">
                {isTa ? 'ஜனன ஜாதகம்' : 'JANANA JATHAKAM'}
              </span>
            </div>

            {/* Main Content Grid: Left Kalasam / Right Credentials */}
            <div className="grid grid-cols-12 gap-2 text-[8px] leading-tight">
              {/* Left Column: Traditional Kalasam & Mangala Slokas */}
              <div className="col-span-4 border border-black p-1.5 flex flex-col items-center justify-between text-center bg-[#FFFDF9]">
                <div className="text-[14px] font-bold text-amber-800">🕉</div>
                <div className="w-16 h-16 flex items-center justify-center my-0.5 border border-amber-800/40 rounded-full p-1 bg-amber-50">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#7A1A22] fill-current">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M50 15 L55 35 L75 35 L60 48 L65 70 L50 56 L35 70 L40 48 L25 35 L45 35 Z" fill="#7A1A22" />
                    <circle cx="50" cy="50" r="14" fill="#FBF3D5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="text-[7px] font-serif italic text-stone-700 leading-tight">
                  {isTa ? 'குருவே சரணம் • சுபமஸ்து' : 'Guruve Saranam • Subhamastu'}
                </div>
                <div className="text-[6.5px] text-stone-500 font-mono mt-0.5">
                  {p1.credit || 'Astrojit Thirukanitha'}
                </div>
              </div>

              {/* Right Column: Native Credentials Table */}
              <div className="col-span-8 border border-black p-1 space-y-0.5 bg-white text-[7.5px]">
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பெயர்' : 'Name'}:</span>
                  <span className="font-black text-[#7A1A22]">{nativeName}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'தகப்பனார் பெயர்' : "Father's Name"}:</span>
                  <span className="font-medium">{p1.father || '---'}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'தாயார் பெயர்' : "Mother's Name"}:</span>
                  <span className="font-medium">{p1.mother || '---'}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பிறந்த தேதி' : 'Date of Birth'}:</span>
                  <span className="font-mono font-bold">{dobFormatted}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பிறந்த நேரம்' : 'Time of Birth'}:</span>
                  <span className="font-mono font-bold">{p1.time || birthData?.dobTime12 || '10:30:00 AM'}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</span>
                  <span className="font-medium">{p1.tamilDate || 'பவ ஆனி-1'}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பிறந்த இடம்' : 'Place of Birth'}:</span>
                  <span className="font-medium">{p1.place || birthData?.city || 'Chennai'}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'லக்னம் / ராசி' : 'Lagna / Rasi'}:</span>
                  <span className="font-bold">{p1.lagna || 'சிம்மம்'} / {p1.rasi || 'சிம்மம்'}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'நட்சத்திரம் / பாதம்' : 'Nakshatra / Pada'}:</span>
                  <span className="font-bold text-[#7A1A22]">{p1.nakshatra || 'மகம்'}</span>
                </div>
                <div className="grid grid-cols-2 py-0.2">
                  <span className="font-bold">{isTa ? 'அயனாம்சம் (லாஹிரி)' : 'Ayanamsa (Lahiri)'}:</span>
                  <span className="font-mono">{p1.coords || '23° 46ʹ 54″ (Lahiri)'}</span>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 2: Divine Stotras (விநாயகர், முருகன், லக்ஷ்மி, சரஸ்வதி ஸ்துதி)
    // -----------------------------------------------------------
    if (isPageSelected(2)) {
      const p2 = d.p2 || {};
      sheets.push({
        pageNum: 2,
        pageKey: 'page-2',
        title: isTa ? 'தெய்வீக ஸ்தோத்திரங்கள்' : 'Divine Stotras (Ganesha, Murugan, Lakshmi, Saraswathi)',
        renderTopHalf: () => (
          <div className="space-y-1 text-black flex flex-col justify-between h-full py-0.5">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'தெய்வீக மங்கள ஸ்தோத்திரங்கள் (விநாயகர் • முருகன் • லக்ஷ்மி • சரஸ்வதி)' : 'Divine Mangala Stotras (Ganesha • Murugan • Lakshmi • Saraswathi)'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                PRAYER
              </span>
            </div>

            {/* 4 Divine Quadrants Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-[7px] leading-tight">
              {/* 1. Sri Vinayagar */}
              <div className="border border-black p-1 bg-[#FFFDF9] space-y-0.5">
                <div className="flex items-center space-x-1 border-b border-stone-300 pb-0.5">
                  <span className="text-[11px]">🐘</span>
                  <span className="font-black text-[#7A1A22] text-[7.5px]">
                    {isTa ? '1. ஸ்ரீ விநாயகர் ஸ்துதி' : '1. Sri Vinayagar Stotram'}
                  </span>
                </div>
                <p className="font-serif italic text-stone-800 leading-snug">
                  {isTa
                    ? 'ஐந்து கரத்தனை யானை முகத்தனை இந்தின் இளம்பிறை போலும் எயிற்றனை நந்தி மகன்தனை ஞானக் கொழுந்தினைப் புந்தியில் வைத்தடி போற்றுகின்றேனே.'
                    : 'Ainthu karathanai yaanai mugathanai inthin ilampirai polum eyitranai, Nandhi magan thanai gnaana kozhunthinai punthiyil vaithadi potrugindrene.'}
                </p>
                <p className="text-[6.5px] font-medium text-stone-600">
                  {isTa ? 'தங்க மான் மழு வோடேந்தித் தன்மதி தலையிற் கொண்டோன்... எங்கள்வாழ் வனைத்தும் காக்க போற்றி.' : 'Praise to the Remover of all obstacles and Bestower of Wisdom.'}
                </p>
              </div>

              {/* 2. Sri Murugan */}
              <div className="border border-black p-1 bg-[#FFFDF9] space-y-0.5">
                <div className="flex items-center space-x-1 border-b border-stone-300 pb-0.5">
                  <span className="text-[11px]">🦚</span>
                  <span className="font-black text-[#7A1A22] text-[7.5px]">
                    {isTa ? '2. ஸ்ரீ முருகப்பெருமான் ஸ்துதி' : '2. Lord Murugan Stotram'}
                  </span>
                </div>
                <p className="font-serif italic text-stone-800 leading-snug">
                  {isTa
                    ? 'வாக்குண்டாம் நல்ல மனமுண்டாம் மாமலராள் நோக்குண்டாம் மேனி நுடங்காது பூக்கொண்டு துப்பார் திருமேனித் தும்பிக்கையான் பாதம் தப்பாமல் சார்வார் தமக்கு.'
                    : 'Vaakkundaam nalla manamundaam maamalaraal nokkundaam meni nudangaadhu, Pookondu thuppaar thirumaenith thumbikkaiyaan paadham thappaamal saarvaar thamakku.'}
                </p>
                <p className="text-[6.5px] font-medium text-stone-600">
                  {isTa ? 'உருவாய் அருவாய் உளதாய் இலதாய் மருவாய் மலராய் குருவாய் வருவாய் அருள்வாய் குகனே.' : 'Praise to Lord Guha, the embodiment of Grace, Valor, and Supreme Knowledge.'}
                </p>
              </div>

              {/* 3. Sri Mahalakshmi */}
              <div className="border border-black p-1 bg-[#FFFDF9] space-y-0.5">
                <div className="flex items-center space-x-1 border-b border-stone-300 pb-0.5">
                  <span className="text-[11px]">🪷</span>
                  <span className="font-black text-[#7A1A22] text-[7.5px]">
                    {isTa ? '3. ஸ்ரீ மகாலக்ஷ்மி ஸ்துதி' : '3. Sri Mahalakshmi Stotram'}
                  </span>
                </div>
                <p className="font-serif italic text-stone-800 leading-snug">
                  {isTa
                    ? 'நமஸ்தேஸ்து மஹாமாயே ஸ்ரீபீடே சுரபூஜிதே | சங்கு சக்ர கதாஹஸ்தே மஹாலக்ஷ்மி நமோஸ்துதே || ஸர்வக்ஞே ஸர்வ வரதே ஸர்வ துஷ்ட பயங்கரி...'
                    : 'Namasthesthu Mahaamaaye Sreepeethe Surapoojithe, Sankha Chakra Gadaahasthé Mahaalakshmi Namosthuthe.'}
                </p>
                <p className="text-[6.5px] font-medium text-stone-600">
                  {isTa ? 'தன தான்ய தான்ய மஹா ஐஸ்வர்யம், ஆரோக்கியம், சௌபாக்கியம் நல்கும் தாயே போற்றி.' : 'Praise to the Divine Mother of Abundance, Auspiciousness, and Prosperity.'}
                </p>
              </div>

              {/* 4. Sri Saraswathi */}
              <div className="border border-black p-1 bg-[#FFFDF9] space-y-0.5">
                <div className="flex items-center space-x-1 border-b border-stone-300 pb-0.5">
                  <span className="text-[11px]">🪕</span>
                  <span className="font-black text-[#7A1A22] text-[7.5px]">
                    {isTa ? '4. ஸ்ரீ சரஸ்வதி / கலைவாணி ஸ்துதி' : '4. Sri Saraswathi Stotram'}
                  </span>
                </div>
                <p className="font-serif italic text-stone-800 leading-snug">
                  {isTa
                    ? 'சரஸ்வதி நமஸ்துப்யம் வரதே காமரூபிணி | வித்யாரம்பம் கரிஷ்யாமி ஸித்திர் பவது மே ஸதா || ஆய கலைகள் அறுபத்து நான்கினையும் ஏய உணர்விக்கும் என்னம்மை...'
                    : 'Saraswathi Namasthubhyam Varadé Kaamaroopini, Vidyaarambham Karishyaami Siddhyr Bhavathu Mé Sadaa.'}
                </p>
                <p className="text-[6.5px] font-medium text-stone-600">
                  {isTa ? 'தூய உருப்பளிங்கு போல்வாள் என் உள்ளத்தினுள்ளே இருப் பளிங்கு வாராது இடர்.' : 'Praise to Goddess of Divine Speech, Arts, Music, and Enlightenment.'}
                </p>
              </div>
            </div>

            {/* Bottom Subhamastu Banner */}
            <div className="text-center py-0.5 border-t border-black bg-[#FAF6EE]">
              <span className="text-[9.5px] font-black text-[#7A1A22] tracking-widest uppercase">
                {p2.subhamText || (isTa ? 'சுப மஸ்து • சர்வ மங்களாநி சந்து • ஓம் சாந்தி சாந்தி சாந்தி:' : 'SUBHAMASTU • SARVA MANGALANI SANTU • OM SHANTI')}
              </span>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 3: Janana Vivaram & Avakahada (ஜனன விபரம் - 1)
    // -----------------------------------------------------------
    if (isPageSelected(3)) {
      const p3 = d.p3 || {};
      sheets.push({
        pageNum: 3,
        pageKey: 'page-3',
        title: isTa ? 'ஜனன விபரம்' : 'Native Birth Particulars',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'ஜனன விபரம் & அவகஹடா சக்கரம்' : 'Janana Vivaram & Avakahada Chakra'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                PART 1
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[7.5px] leading-tight">
              {/* Left Column */}
              <div className="border border-black p-1 space-y-0.5 bg-white">
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பெயர்' : 'Name'}:</span>
                  <span className="font-black text-[#7A1A22]">{p3.name || nativeName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பாலினம்' : 'Gender'}:</span>
                  <span className="font-medium">{p3.gender || (isTa ? 'ஆண்' : 'Male')}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பிறந்த தேதி' : 'Date'}:</span>
                  <span className="font-mono font-bold">{p3.date || dobFormatted}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'தமிழ் தேதி' : 'Tamil Date'}:</span>
                  <span className="font-medium">{p3.tamilDate || 'பவ ஆனி-1'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'நாழிகை' : 'Nazhigai'}:</span>
                  <span className="font-mono">{p3.nazhigai || '11:15:30'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'தேசம் / நாடு' : 'Country'}:</span>
                  <span className="font-medium">{p3.country || 'India'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பிறந்த இடம்' : 'Birth Place'}:</span>
                  <span className="font-medium">{p3.place1 || birthData?.city || 'Chennai'}</span>
                </div>
                <div className="flex justify-between py-0.2">
                  <span className="font-bold">{isTa ? 'அட்ச / தீர்க்க ரேகை' : 'Coordinates'}:</span>
                  <span className="font-mono text-[7px]">{p3.coords || '13° 04ʹ N, 80° 17ʹ E'}</span>
                </div>
              </div>

              {/* Right Column: Avakahada Chakra */}
              <div className="border border-black p-1 space-y-0.5 bg-white">
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'லக்னம்' : 'Lagna'}:</span>
                  <span className="font-black text-[#7A1A22]">{p3.lagna || 'சிம்மம்'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'ராசி' : 'Rasi'}:</span>
                  <span className="font-black text-[#7A1A22]">{p3.rasi || 'சிம்மம்'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}:</span>
                  <span className="font-bold">{p3.nakshatra || 'மகம்'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'திதி / யோகம்' : 'Tithi / Yogam'}:</span>
                  <span className="font-medium">{p3.tithi || 'சப்தமி'} / {p3.yogam || 'சுப'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'கரணம் / அயனம்' : 'Karana / Ayanam'}:</span>
                  <span className="font-medium">{p3.karanam || 'பவ'} / {p3.ayanam || 'உத்தராயணம்'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'கணம் / யோனி / நாடி' : 'Gana / Yoni / Nadi'}:</span>
                  <span className="font-medium">{p3.gyn || 'ராட்சஸ / எலி / அந்திய'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'விருட்சம் / ரஜ்ஜு' : 'Vriksham / Rajju'}:</span>
                  <span className="font-medium">{p3.vr || 'ஆலமரம் / தொடை'}</span>
                </div>
                <div className="flex justify-between py-0.2">
                  <span className="font-bold">{isTa ? 'பட்சி / அதிதேவதை' : 'Bird / Deity'}:</span>
                  <span className="font-medium">{p3.pa || 'ஆந்தை / சுக்கிரன்'}</span>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 4: Janana Vivaram Extended Math (ஜனன விபரம் - 2)
    // -----------------------------------------------------------
    if (isPageSelected(4)) {
      const p4 = d.p4 || {};
      sheets.push({
        pageNum: 4,
        pageKey: 'page-4',
        title: isTa ? 'ஜனன விபரம் - கணித விவரங்கள்' : 'Birth Details - Extended Math',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'ஜனன விபரம் - நட்சத்திர & கணித நுட்பங்கள்' : 'Birth Details - Extended Astrological Math'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                PART 2
              </span>
            </div>

            <div className="border border-black overflow-hidden text-[7.5px]">
              <table className="w-full border-collapse">
                <tbody className="divide-y divide-stone-200">
                  <tr className="bg-stone-50">
                    <td className="py-0.5 px-1 font-bold w-1/3">{isTa ? 'ஜனன நட்சத்திரம் & பாதம்' : 'Birth Nakshatra & Pada'}:</td>
                    <td className="py-0.5 px-1 font-black text-[#7A1A22]">{p4.nakshatra || 'மகம் - 1'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'நட்சத்திர ஆரம்ப & முடிவு நேரம்' : 'Nakshatra Start & End Time'}:</td>
                    <td className="py-0.5 px-1 font-mono">{p4.nakStart || '09:05 AM'} ➔ {p4.nakEnd || '07:13 AM'}</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'ஆதியந்த பரம நாழிகை' : 'Aadiyanta Parama Nazhigai'}:</td>
                    <td className="py-0.5 px-1 font-mono">{p4.aadiyanta || '55:19:37'} ({isTa ? 'இருப்பு' : 'Balance'}: {p4.iruppu || '12:45'})</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'பிறப்பில் திசா இருப்பு' : 'Dasha Balance at Birth'}:</td>
                    <td className="py-0.5 px-1 font-bold text-[#7A1A22]">{p4.dashaBal || 'கேது திசை 5 வருடம் 2 மாதம் 10 நாள்'}</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'யோகி & அவயோகி ஸ்புடங்கள்' : 'Yogi & Avayogi Sphutas'}:</td>
                    <td className="py-0.5 px-1 font-medium">{p4.yogi || 'குரு (விருச்சிகம் 12°)'} / <span className="text-rose-700 font-bold">{p4.avayogi || 'ராகு (கடகம் 19°)'}</span></td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'ஹோரா அதிபதி / லக்ன சுபர் - பாபர்' : 'Hora Lord / Subhar - Paabar'}:</td>
                    <td className="py-0.5 px-1 font-medium">{p4.hora || 'செவ்வாய் ஓரை'} | {isTa ? 'சுபர்' : 'Subha'}: {p4.subhar || 'குரு, சுக்'} | {isTa ? 'பாபர்' : 'Paapa'}: {p4.pabar || 'சனி, ராகு'}</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'வைநாசிக தாரை / சூன்ய ராசிகள்' : 'Vainasika Tara / Sunya Signs'}:</td>
                    <td className="py-0.5 px-1 font-medium">{p4.vainasika || 'சுவாதி'} | {p4.soonyam || 'ரிஷபம், விருச்சிகம்'}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 px-1 font-bold">{isTa ? 'சூரியோதயம் / சூரியாஸ்தமனம்' : 'Sunrise / Sunset'}:</td>
                    <td className="py-0.5 px-1 font-mono">{p4.sunrise || '05:46 AM'} / {p4.sunset || '06:34 PM'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 5: D1 Rasi & D9 Navamsa (ராசி & நவாம்சம்)
    // -----------------------------------------------------------
    if (isPageSelected(5)) {
      const p5 = d.p5 || {};
      sheets.push({
        pageNum: 5,
        pageKey: 'page-5',
        title: isTa ? 'ராசி & நவாம்சம் சக்கரங்கள்' : 'D1 Rasi & D9 Navamsa Natal Charts',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center text-[7.5px] font-bold">
              <span>{p5.genderLabel || 'ஆண்'}: <span className="text-[#7A1A22] font-black">{nativeName}</span></span>
              <span>{isTa ? 'லக்னம்' : 'Lagna'}: <span className="font-black">{p5.lagna || 'சிம்மம்'}</span></span>
              <span>{isTa ? 'ராசி' : 'Rasi'}: <span className="font-black">{p5.rasi || 'சிம்மம்'}</span></span>
              <span>{isTa ? 'நட்சத்திரம்' : 'Star'}: <span className="font-black">{p5.nakPada || 'மகம்-1'}</span></span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>{renderMiniChart(p5.rasiChart || [], isTa ? 'ராசி' : 'D1 RASI', nativeName)}</div>
              <div>{renderMiniChart(p5.navamsaChart || [], isTa ? 'நவாம்சம்' : 'D9 NAVAMSA', nativeName)}</div>
            </div>

            <div className="border border-black p-0.5 text-[7px] text-center font-mono bg-[#FAF6EE] flex justify-between px-2">
              <span>{p5.place || 'Chennai'} ({p5.coords || '13° 04ʹ N, 80° 17ʹ E'})</span>
              <span className="font-bold text-[#7A1A22]">{p5.dashaBal || 'திசா இருப்பு'}</span>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 6: Nirayana Planetary Positions Table (நிராயன கிரக நிலைகள்)
    // -----------------------------------------------------------
    if (isPageSelected(6)) {
      const p6 = d.p6 || {};
      const rows = Array.isArray(p6.rows) ? p6.rows : [];
      sheets.push({
        pageNum: 6,
        pageKey: 'page-6',
        title: isTa ? 'துல்லியமான நிராயன கிரக நிலைகள்' : 'Accurate Nirayana Planetary Positions',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'துல்லியமான நிராயன கிரக நிலைகள்' : 'Accurate Nirayana Planetary Positions Table'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                11 GRAHAS
              </span>
            </div>

            <div className="border border-black overflow-hidden text-[7px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.5 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'பாகை-கலை' : 'Longitude'}</th>
                    <th className="py-0.5 px-0.5">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'பாதம்' : 'Pada'}</th>
                    <th className="py-0.5 px-0.5">{isTa ? 'நட்-அதிபதி' : 'Star Lord'}</th>
                    <th className="py-0.5 px-0.5">{isTa ? 'ராசி' : 'Rasi'}</th>
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'ராசி பாகை' : 'Sign Deg'}</th>
                    <th className="py-0.5 px-0.5">{isTa ? 'நிலை' : 'Dignity'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-300">
                  {rows.map((r, rIdx) => {
                    const isLag = r.id === 'lagna' || String(r.graha).includes('லக்') || String(r.graha).includes('Lag');
                    return (
                      <tr
                        key={rIdx}
                        className={isLag ? 'bg-amber-100/60 font-bold text-[#7A1A22]' : 'hover:bg-amber-50/30 text-center'}
                      >
                        <td className="py-0.2 px-0.5 text-left font-bold whitespace-nowrap">{r.graha}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap">{r.degFull}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.nak}</td>
                        <td className="py-0.2 px-0.5 font-mono font-bold">{r.pada}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.starLord}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.rasi}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap">{r.rasiDeg}</td>
                        <td className="py-0.2 px-0.5 font-semibold whitespace-nowrap">{r.dignity || '---'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between text-[6.5px] text-stone-600 font-mono px-1">
              <span>{p6.footerName || nativeName} • {p6.footerDate || dobFormatted}</span>
              <span>{p6.footerAyanamsha || 'Lahiri Ayanamsha 23° 46ʹ 54″'}</span>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 7: 4 Charts & Sripati Bhava Sphutam (ஸ்ரீபதி பாவக ஆரம்ப, மத்திம, முடிவு)
    // -----------------------------------------------------------
    if (isPageSelected(7)) {
      const p7 = d.p7 || {};
      const bhavas = Array.isArray(p7.bhavas) ? p7.bhavas : [];
      sheets.push({
        pageNum: 7,
        pageKey: 'page-7',
        title: isTa ? 'ஸ்ரீபதி பாவக ஆரம்ப, மத்திம, முடிவு & 4 சக்கரங்கள்' : 'Sripati Bhava Cusps & 4 Charts',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="grid grid-cols-4 gap-1">
              <div>{renderMiniChart(p7.rasiChart || [], isTa ? 'ராசி' : 'D1 Rasi', '', '75px')}</div>
              <div>{renderMiniChart(p7.navamsaChart || [], isTa ? 'நவாம்சம்' : 'D9 Navamsa', '', '75px')}</div>
              <div>{renderMiniChart(p7.drekkanaChart || [], isTa ? 'திரேக்காணம்' : 'D3 Drekkana', '', '75px')}</div>
              <div>{renderMiniChart(p7.sripatiChart || [], isTa ? 'ஸ்ரீபதி பாவகம்' : 'Bhava Chart', '', '75px')}</div>
            </div>

            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'பாவகம்' : 'House'}</th>
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'ஆரம்ப பாகை (Start)' : 'Prarambha (Start)'}</th>
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'மத்திம பாகை (Cusp)' : 'Madhya (Cusp)'}</th>
                    <th className="py-0.5 px-0.5 font-mono">{isTa ? 'முடிவு பாகை (End)' : 'Antya (End)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {bhavas.map((b, bIdx) => (
                    <tr key={bIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 font-mono font-bold">{b.num || bIdx + 1}</td>
                      <td className="py-0.2 px-0.5 font-mono">{b.start}</td>
                      <td className="py-0.2 px-0.5 font-mono font-bold text-[#7A1A22]">{b.madhya}</td>
                      <td className="py-0.2 px-0.5 font-mono">{b.end}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[6.5px] italic text-stone-600 text-center">
              {p7.bhavaChange || (isTa ? 'ஜாதகத்தில் பாவக மாற்றம் ஏதும் இல்லை.' : 'No bhava shift detected in this chart.')}
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGES 8 TO 11: Divisional Charts Pairs (D3/D7, D60/D30, D10/D16, D4/D12)
    // -----------------------------------------------------------
    const vargaPairs = [
      { pageNum: 8, key: 'p8', defL: { num: 3, nameTa: '3-திரேக்காணம்', nameEn: 'D3 Drekkana' }, defR: { num: 7, nameTa: '7-சப்தாம்சம்', nameEn: 'D7 Saptamsa' } },
      { pageNum: 9, key: 'p9', defL: { num: 60, nameTa: '60-சஷ்டியாம்சம்', nameEn: 'D60 Shastiamsa' }, defR: { num: 30, nameTa: '30-திரிம்சாம்சம்', nameEn: 'D30 Trimsamsa' } },
      { pageNum: 10, key: 'p10', defL: { num: 10, nameTa: '10-தசாம்சம்', nameEn: 'D10 Dasamsa' }, defR: { num: 16, nameTa: '16-ஷோடசாம்சம்', nameEn: 'D16 Shodasamsa' } },
      { pageNum: 11, key: 'p11', defL: { num: 4, nameTa: '4-சதுராம்சம்', nameEn: 'D4 Chaturthamsa' }, defR: { num: 12, nameTa: '12-துவாதசாம்சம்', nameEn: 'D12 Dwadasamsa' } }
    ];

    vargaPairs.forEach(vp => {
      if (isPageSelected(vp.pageNum)) {
        const pData = d[vp.key] || {};
        const lChart = pData.leftChart || {};
        const rChart = pData.rightChart || {};
        sheets.push({
          pageNum: vp.pageNum,
          pageKey: `page-${vp.pageNum}`,
          title: isTa ? pData.heading : `${vp.defL.nameEn} & ${vp.defR.nameEn}`,
          renderTopHalf: () => (
            <div className="space-y-1 text-black">
              <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
                <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                  {isTa ? pData.heading : `${vp.defL.nameEn} & ${vp.defR.nameEn}`}
                </span>
                <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                  D{vp.defL.num} & D{vp.defR.num}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  {renderMiniChart(lChart.cells || [], isTa ? vp.defL.nameTa : vp.defL.nameEn, nativeName)}
                  <p className="text-[6.5px] leading-tight text-stone-700 italic border border-stone-300 p-1 bg-stone-50">
                    {lChart.desc || 'Signification analysis'}
                  </p>
                </div>
                <div className="space-y-1">
                  {renderMiniChart(rChart.cells || [], isTa ? vp.defR.nameTa : vp.defR.nameEn, nativeName)}
                  <p className="text-[6.5px] leading-tight text-stone-700 italic border border-stone-300 p-1 bg-stone-50">
                    {rChart.desc || 'Signification analysis'}
                  </p>
                </div>
              </div>
            </div>
          )
        });
      }
    });

    // -----------------------------------------------------------
    // PAGE 12: D2 Hora Chart (ஓரை சக்கரம்)
    // -----------------------------------------------------------
    if (isPageSelected(12)) {
      const p12 = d.p12 || {};
      sheets.push({
        pageNum: 12,
        pageKey: 'page-12',
        title: isTa ? 'ஓரை (D2 Hora)' : 'D2 Hora Chart',
        renderTopHalf: () => (
          <div className="space-y-1 text-black flex flex-col justify-between h-full">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? '2-ஹோரா (ஓரை) சக்கரம் & பலன்கள்' : 'D2 Hora Chart & Wealth Significations'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                D2 HORA
              </span>
            </div>

            <div className="max-w-[260px] mx-auto w-full">
              {renderMiniChart(p12.horaChart || [], isTa ? 'ஓரை' : 'D2 HORA', nativeName, '118px')}
            </div>

            <div className="border border-black p-1 text-[7px] leading-tight text-stone-800 bg-[#FFFDF9]">
              <span className="font-bold text-[#7A1A22]">{isTa ? 'ஹோரா கணித விளக்கம்:' : 'Hora Rules:'} </span>
              {isTa
                ? 'ஹோரா சக்கரம் ஜாதகரின் செல்வம், நிதி ஆதாயங்கள், குடும்பப் பொருளாதாரம், வாக்கு வன்மை ஆகியவற்றை உறுதிபடுத்துகிறது. ஒற்றை ராசிகளில் முதல் பாதி சூரிய ஹோரை (சிம்மம்), இரண்டாம் பாதி சந்திர ஹோரை (கடகம்). இரட்டை ராசிகளில் முதல் பாதி சந்திர ஹோரை, இரண்டாம் பாதி சூரிய ஹோரை ஆகும்.'
                : 'D2 Hora chart reveals wealth, financial prosperity, assets, and speech potency according to Maharishi Parashara.'}
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 13: Shadbala & Bhava Bala (ஜாதகத்தில் ஷட்பலம் ஆய்வு)
    // -----------------------------------------------------------
    if (isPageSelected(13)) {
      const p13 = d.p13 || {};
      const grahaHeaders = p13.grahaHeaders || ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
      const grahaRows = Array.isArray(p13.grahaRows) ? p13.grahaRows : [];
      const bhavaHeaders = p13.bhavaHeaders || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const bhavaRows = Array.isArray(p13.bhavaRows) ? p13.bhavaRows : [];

      sheets.push({
        pageNum: 13,
        pageKey: 'page-13',
        title: isTa ? 'ஜாதகத்தில் ஷட்பலம் ஆய்வு' : 'Shadbala & Bhava Bala Analysis',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு' : 'Shadbala & Bhava Bala Analysis in Horoscope'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                RUPAS
              </span>
            </div>

            {/* Graha Bala Table */}
            <div className="text-[7px] font-bold text-[#7A1A22]">
              {isTa ? 'கிரக கணிதம் (ரூபங்களில்)' : 'Planetary Shadbala (in Rupas)'}
            </div>
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{grahaHeaders[0]}</th>
                    {grahaHeaders.slice(1).map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5 font-mono">{gh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {grahaRows.map((r, rIdx) => {
                    const isTot = r.isTotal || r.label === 'மொத்தம்' || r.labelEn === 'Total Shadbala';
                    return (
                      <tr
                        key={rIdx}
                        className={isTot ? 'bg-amber-100/60 font-bold text-[#7A1A22]' : 'hover:bg-amber-50/20 text-center'}
                      >
                        <td className="py-0.2 px-0.5 text-left font-semibold whitespace-nowrap">
                          {isTa ? r.label : r.labelEn}
                        </td>
                        {(r.vals || []).map((v, vIdx) => (
                          <td key={vIdx} className="py-0.2 px-0.5 font-mono">
                            {v}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bhava Bala Table */}
            <div className="text-[7px] font-bold text-[#7A1A22] pt-0.5">
              {isTa ? 'பாவக கணிதம் (12 பாவங்களின் பலங்கள்)' : 'Bhava Bala (12 House Strengths)'}
            </div>
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'பாவகம்' : 'Bhava'}</th>
                    {bhavaHeaders.map((bh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5 font-mono">{bh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {bhavaRows.map((r, rIdx) => {
                    const isTot = r.isTotal || r.label === 'மொத்தம்';
                    return (
                      <tr
                        key={rIdx}
                        className={isTot ? 'bg-amber-100/60 font-bold text-[#7A1A22]' : 'hover:bg-amber-50/20 text-center'}
                      >
                        <td className="py-0.2 px-0.5 text-left font-semibold whitespace-nowrap">
                          {isTa ? r.label : r.labelEn}
                        </td>
                        {(r.vals || []).map((v, vIdx) => (
                          <td key={vIdx} className="py-0.2 px-0.5 font-mono">
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
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 14: Upagrahas - Gulikadi & Dhumadi (உபகிரகங்கள்)
    // -----------------------------------------------------------
    if (isPageSelected(14)) {
      const p14 = d.p14 || {};
      const table1 = Array.isArray(p14.table1) ? p14.table1 : [];
      const table2 = Array.isArray(p14.table2) ? p14.table2 : [];
      sheets.push({
        pageNum: 14,
        pageKey: 'page-14',
        title: isTa ? 'உபகிரகங்கள் - குளிகாதி ஐவர் விபரங்கள்' : 'Upagrahas - Gulikadi & Dhumadi Details',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'உபகிரகங்கள் - குளிகாதி ஐவர் விபரங்கள்' : 'Upagrahas - Gulikadi Five & Dhumadi Five'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                UPAGRAHAS
              </span>
            </div>

            <p className="text-[6.5px] text-stone-700 leading-tight">
              {isTa
                ? 'ஒவ்வொரு கிரகத்திற்கும் உபகிரகங்கள் உண்டு. ஒரு தினத்தின் ஜனன அடிப்படையில் பகல் அல்லது இரவு அகஸ் காலத்தை எட்டு பிரிவுகளாக்கி ஒவ்வொரு பிரிவும் ஒரு உபகிரகத்திற்கான காலமாக கணிக்கப்படுகிறது.'
                : 'Each principal planet possesses corresponding secondary shadow planets (Upagrahas), computed by dividing the diurnal or nocturnal span into 8 equal segments.'}
            </p>

            {/* Gulikadi Five */}
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'உபகிரகம்' : 'Upagraha'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'பராசர முறை (ஆரம்பம்)' : 'Parashara (Start)'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'காளிதாச முறை (முடிவு)' : 'Kalidasa (End)'}</th>
                    <th className="py-0.2 px-0.5 font-mono">{isTa ? 'ஸ்புட பாகை' : 'Longitude'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'ராசி' : 'Rasi'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'நட்சத்திரம்' : 'Star'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {table1.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.name}</td>
                      <td className="py-0.2 px-0.5 font-mono">{r.start}</td>
                      <td className="py-0.2 px-0.5 font-mono">{r.end}</td>
                      <td className="py-0.2 px-0.5 font-mono font-bold">{r.deg}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.rasi}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.nak}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dhumadi Five */}
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'தூமாதி உபகிரகம்' : 'Dhumadi Upagraha'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'கணித சூத்திரம்' : 'Formula'}</th>
                    <th className="py-0.2 px-0.5 font-mono">{isTa ? 'ஸ்புட பாகை' : 'Longitude'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'ராசி' : 'Rasi'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {table2.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.name}</td>
                      <td className="py-0.2 px-0.5 font-mono text-[6px]">{r.formula}</td>
                      <td className="py-0.2 px-0.5 font-mono font-bold">{r.deg}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.rasi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 15: Upagrahas Chart & Special Lagnas (முக்கிய ஸ்புடங்கள்)
    // -----------------------------------------------------------
    if (isPageSelected(15)) {
      const p15 = d.p15 || {};
      const spLagnas = Array.isArray(p15.specialLagnas) ? p15.specialLagnas : [];
      sheets.push({
        pageNum: 15,
        pageKey: 'page-15',
        title: isTa ? 'உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்' : 'Upagraha Chart & Special Lagnas',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்' : 'Upagraha Chart & Special Lagnas / Sphutas'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                SPECIAL
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                {renderMiniChart(p15.upagrahaChart || [], isTa ? 'உபகிரகம்' : 'UPAGRAHA', nativeName, '118px')}
              </div>
              <div className="col-span-7 border border-black overflow-hidden text-[6.5px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'ஸ்புடம் / லக்னம்' : 'Special Point'}</th>
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'பாகை' : 'Degree'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'ராசி' : 'Rasi'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'அதிபதி' : 'Lord'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {spLagnas.slice(0, 10).map((r, rIdx) => (
                      <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                        <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.name}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap">{r.deg}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.rasi}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.lord}</td>
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

    // -----------------------------------------------------------
    // PAGE 16: Naisargika & Tatkalika Friendships (நைசர்கிக & தற்கால நட்பு)
    // -----------------------------------------------------------
    if (isPageSelected(16)) {
      const p16 = d.p16 || {};
      const gHeaders = p16.grahaHeaders || ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
      const naisargika = Array.isArray(p16.naisargika) ? p16.naisargika : [];
      const tatkalika = Array.isArray(p16.tatkalika) ? p16.tatkalika : [];
      sheets.push({
        pageNum: 16,
        pageKey: 'page-16',
        title: isTa ? 'நைசர்கிக மற்றும் தற்கால நட்பு விபரங்கள்' : 'Permanent & Temporal Friendships',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'நைசர்கிக (நிலையான) மற்றும் தற்கால நட்பு விபரங்கள்' : 'Permanent & Temporal Friendships'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                7x7 MAITRI
              </span>
            </div>

            {/* Naisargika */}
            <div className="text-[7px] font-bold text-[#7A1A22]">
              {isTa ? 'நைசர்கிக (இயற்கை) நட்பு விபரம்' : 'Natural Friendships (Naisargika)'}
            </div>
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    {gHeaders.map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{gh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {naisargika.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                      {(r.relations || []).map((rel, cIdx) => (
                        <td key={cIdx} className="py-0.2 px-0.5 font-medium whitespace-nowrap">{rel}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tatkalika */}
            <div className="text-[7px] font-bold text-[#7A1A22] pt-0.5">
              {isTa ? 'தற்கால நட்பு விபரம் (2, 3, 4, 10, 11, 12 இடங்கள்)' : 'Temporal Friendships (Tatkalika)'}
            </div>
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    {gHeaders.map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{gh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {tatkalika.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                      {(r.relations || []).map((rel, cIdx) => (
                        <td key={cIdx} className="py-0.2 px-0.5 font-medium whitespace-nowrap">{rel}</td>
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

    // -----------------------------------------------------------
    // PAGE 17: Panchadha Maitri & Avasthas (பஞ்சதா நட்பு & அவஸ்தைகள்)
    // -----------------------------------------------------------
    if (isPageSelected(17)) {
      const p17 = d.p17 || {};
      const gHeaders = p17.grahaHeaders || ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
      const panchadha = Array.isArray(p17.panchadha) ? p17.panchadha : [];
      const avasthas = Array.isArray(p17.avasthas) ? p17.avasthas : [];
      sheets.push({
        pageNum: 17,
        pageKey: 'page-17',
        title: isTa ? 'கிரகங்களின் சத்துரு - மித்துரு நிலைகள் & அவஸ்தைகள்' : 'Panchadha Maitri & Avasthas',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'கிரகங்களின் சத்துரு - மித்துரு நிலைகள் & அவஸ்தைகள்' : '5-Fold Compound Friendships (Panchadha) & Avasthas'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                PANCHADHA
              </span>
            </div>

            {/* Panchadha Table */}
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    {gHeaders.map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{gh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {panchadha.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                      {(r.relations || []).map((rel, cIdx) => (
                        <td key={cIdx} className="py-0.2 px-0.5 font-medium whitespace-nowrap">{rel}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Avasthas Table */}
            <div className="text-[7px] font-bold text-[#7A1A22] pt-0.5">
              {isTa ? 'கிரக அவஸ்தா மற்றும் மண்டல நிலைகள்' : 'Planetary Avasthas & Mandala States'}
            </div>
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'பாலாதி அவஸ்தை' : 'Baladi'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'ஜாக்ரதாதி' : 'Jagradadi'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'தீப்தாதி' : 'Deeptadi'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'மண்டலம்' : 'Mandala'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {avasthas.slice(0, 7).map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.baladi}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.jagradadi}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.deeptadi}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.mandala}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 18: Graha Aspect Angles (கிரக பார்வை கோணங்கள்)
    // -----------------------------------------------------------
    if (isPageSelected(18)) {
      const p18 = d.p18 || {};
      const gHeaders = p18.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];
      const matrix = Array.isArray(p18.grahaMatrix) ? p18.grahaMatrix : [];
      sheets.push({
        pageNum: 18,
        pageKey: 'page-18',
        title: isTa ? 'கிரகங்களுக்கான பார்வை கோணங்கள்' : 'Planetary Aspect Angles (Drishti)',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'கிரகங்களுக்கான பார்வை கோணங்கள் (கோடிட்ட எண்கள் = நேரடி பார்வை)' : 'Planetary Aspect Angles (Underlined = Active Aspect)'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                9x9 DRISHTI
              </span>
            </div>

            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    <th className="py-0.2 px-0.5 font-mono">{isTa ? 'பாகை' : 'Deg'}</th>
                    {gHeaders.map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{gh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {matrix.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                      <td className="py-0.2 px-0.5 font-mono text-[6px]">{r.deg}</td>
                      {(r.angles || []).map((ang, cIdx) => {
                        const isUnderlined = String(ang).includes('_') || parseInt(ang) === 180 || (parseInt(ang) >= 170 && parseInt(ang) <= 190);
                        const cleanAng = String(ang).replace('_', '');
                        return (
                          <td
                            key={cIdx}
                            className={`py-0.2 px-0.5 font-mono ${
                              isUnderlined ? 'font-black underline text-[#7A1A22]' : ''
                            }`}
                          >
                            {cleanAng}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[6.5px] italic text-stone-600 text-center">
              {isTa ? 'அனைத்து கிரகங்களுக்கும் 7-ம் பார்வை உண்டு. செவ்வாய்க்கு 4, 8; குருவிற்கு 5, 9; சனிக்கு 3, 10 சிறப்பு பார்வைகள் உண்டு.' : 'All planets aspect 7th house. Mars has 4, 8; Jupiter 5, 9; Saturn 3, 10 special aspects.'}
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 19: Bhava-Graha Aspect Angles (பாவக பார்வை கோணங்கள்)
    // -----------------------------------------------------------
    if (isPageSelected(19)) {
      const p19 = d.p19 || {};
      const gHeaders = p19.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];
      const matrix = Array.isArray(p19.bhavaMatrix) ? p19.bhavaMatrix : [];
      sheets.push({
        pageNum: 19,
        pageKey: 'page-19',
        title: isTa ? 'பாவக-கிரகங்களிடையே பார்வை கோணங்கள்' : 'House-Planetary Aspect Angles Matrix',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'பாவக-கிரகங்களிடையே பார்வை கோணங்கள்' : 'House-Planetary Aspect Angles (12 Houses x 9 Planets)'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                12x9 BHAVA
              </span>
            </div>

            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 font-mono">{isTa ? 'பாவம்' : 'House'}</th>
                    <th className="py-0.2 px-0.5 font-mono">{isTa ? 'மத்திம பாகை' : 'Cusp'}</th>
                    {gHeaders.map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{gh}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {matrix.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 font-mono font-bold text-[#7A1A22]">{r.bhava}</td>
                      <td className="py-0.2 px-0.5 font-mono text-[6px]">{r.cuspDeg}</td>
                      {(r.angles || []).map((ang, cIdx) => (
                        <td key={cIdx} className="py-0.2 px-0.5 font-mono">
                          {ang}
                        </td>
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

    // -----------------------------------------------------------
    // PAGE 20: Dasavarga Matrix & Strengths (தசவர்க்க பலம்)
    // -----------------------------------------------------------
    if (isPageSelected(20)) {
      const p20 = d.p20 || {};
      const gHeaders = p20.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது', 'லக்'];
      const tableA = Array.isArray(p20.tableA) ? p20.tableA : [];
      const tableB = Array.isArray(p20.tableB) ? p20.tableB : [];
      sheets.push({
        pageNum: 20,
        pageKey: 'page-20',
        title: isTa ? 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்' : 'Dasavarga Dignity & Strength Matrix',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும் (100 மதிப்பெண்)' : 'Planetary Dasavarga Dignity & Strengths (100 Points)'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                DASAVARGA
              </span>
            </div>

            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'வர்க்கம்' : 'Varga'}</th>
                    {gHeaders.map((gh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{gh}</th>
                    ))}
                    <th className="py-0.2 px-0.5 font-bold text-emerald-700">{isTa ? 'சுப' : 'Sub'}</th>
                    <th className="py-0.2 px-0.5 font-bold text-rose-700">{isTa ? 'அசுப' : 'Asu'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {tableA.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.varga}</td>
                      {(r.dignities || []).map((dig, cIdx) => (
                        <td key={cIdx} className="py-0.2 px-0.5 font-medium whitespace-nowrap">{dig}</td>
                      ))}
                      <td className="py-0.2 px-0.5 font-bold font-mono text-emerald-700">{r.subha}</td>
                      <td className="py-0.2 px-0.5 font-bold font-mono text-rose-700">{r.asubha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Points Table */}
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <tbody className="divide-y divide-stone-200">
                  <tr className="bg-[#FAF6EE] font-bold text-center">
                    <td className="py-0.2 px-0.5 text-left">{isTa ? 'மொத்த மதிப்பெண்' : 'Total Points'}</td>
                    {tableB.map((tb, idx) => (
                      <td key={idx} className="py-0.2 px-0.5 font-mono">{tb.points}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 21: Pancha Pakshi Siddha System (பஞ்ச பட்சி விபரம்)
    // -----------------------------------------------------------
    if (isPageSelected(21)) {
      const p21 = d.p21 || {};
      const pp = p21.panchaPakshiData?.birthBird || {};
      sheets.push({
        pageNum: 21,
        pageKey: 'page-21',
        title: isTa ? 'பஞ்ச பட்சி விபரம்' : 'Pancha Pakshi Shastra Details',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'பஞ்ச பட்சி விபரம் (தமிழ் சித்தர் ஐம்புள் சாஸ்திரம்)' : 'Pancha Pakshi Shastra (Tamil Siddha System)'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                SIDDHA
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2 text-[7.5px]">
              <div className="col-span-4 border border-black p-2 flex flex-col items-center justify-center text-center bg-[#FFFDF9]">
                <div className="text-3xl mb-1">
                  {pp.id === 'owl' ? '🦉' : pp.id === 'rooster' ? '🐓' : pp.id === 'peacock' ? '🦚' : pp.id === 'crow' ? '🦅' : '🦅'}
                </div>
                <div className="font-black text-[11px] text-[#7A1A22]">
                  {isTa ? pp.ta : pp.en || 'வல்லூறு (Hawk)'}
                </div>
                <div className="text-[6.5px] text-stone-600 mt-0.5 font-medium">
                  {isTa ? 'ஜென்ம பட்சி' : 'Birth Bird'}
                </div>
              </div>

              <div className="col-span-8 space-y-1">
                <p className="text-[6.5px] leading-tight text-stone-700 italic border border-stone-300 p-1 bg-stone-50">
                  {isTa
                    ? 'தமிழ் சித்தர்களால் ஆக்கப்பட்ட "ஐம்புள் நூல்" என கூறப்படும் பஞ்சபட்சி சாஸ்திரம் உலகம் தழுவிய எல்லாவற்றையும் அதாவது ஒளி, ஒலி, இடம், பொருள், காலம், எண், வலிமை, நிறம், உடை, ஊண், இன்னபிற உலக நடப்புகள் என அனைத்து முக்கியத்துவத்தையும் குறிப்பிடுவதாக ஐந்து பட்சிகளாக வகைப்படுத்தியுள்ளனர்.'
                    : 'The ancient Tamil Siddha Pancha Pakshi system categorizes cosmic biorhythms into five sacred birds (Hawk, Owl, Rooster, Peacock, Crow) mapping hourly potency.'}
                </p>

                <div className="border border-black overflow-hidden text-[7px]">
                  <table className="w-full border-collapse">
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="py-0.2 px-1 font-bold w-1/3">{isTa ? 'ஜென்ம பட்சி' : 'Birth Bird'}:</td>
                        <td className="py-0.2 px-1 font-black text-[#7A1A22]">{isTa ? pp.ta : pp.en} ({isTa ? pp.pakshaTa : pp.pakshaEn})</td>
                      </tr>
                      <tr className="bg-stone-50">
                        <td className="py-0.2 px-1 font-bold">{isTa ? 'நட்பு பட்சிகள்' : 'Friend Birds'}:</td>
                        <td className="py-0.2 px-1 font-bold text-emerald-800">{isTa ? pp.friendBirdsTa : pp.friendBirdsEn}</td>
                      </tr>
                      <tr>
                        <td className="py-0.2 px-1 font-bold">{isTa ? 'பகை பட்சிகள்' : 'Enemy Birds'}:</td>
                        <td className="py-0.2 px-1 font-bold text-rose-800">{isTa ? pp.enemyBirdsTa : pp.enemyBirdsEn}</td>
                      </tr>
                      <tr className="bg-stone-50">
                        <td className="py-0.2 px-1 font-bold">{isTa ? 'படுபக்ஷி நாட்கள்' : 'Bad Days (Padu Pakshi)'}:</td>
                        <td className="py-0.2 px-1 font-medium">{isTa ? pp.badDaysTa : pp.badDaysEn}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGES 22 TO 30: 9 Maha Dashas (Rahu, Guru, Sani, Budha, Ketu, Sukra, Surya, Chandra, Sevvai)
    // -----------------------------------------------------------
    const dashaPagesConfig = [
      { pageNum: 22, key: 'p22', lordTa: 'ராகு', lordEn: 'Rahu', temple: 'திருநாகேஸ்வரம்', deity: 'துர்க்கை அம்மன்', icon: '🐍' },
      { pageNum: 23, key: 'p23', lordTa: 'குரு', lordEn: 'Jupiter', temple: 'ஆலங்குடி / திருச்செந்தூர்', deity: 'தட்சிணாமூர்த்தி', icon: '🧘' },
      { pageNum: 24, key: 'p24', lordTa: 'சனி', lordEn: 'Saturn', temple: 'திருநள்ளாறு', deity: 'சனீஸ்வர பகவான்', icon: '⚖️' },
      { pageNum: 25, key: 'p25', lordTa: 'புதன்', lordEn: 'Mercury', temple: 'திருவெண்காடு', deity: 'ஸ்ரீ புதன் பகவான்', icon: '📚' },
      { pageNum: 26, key: 'p26', lordTa: 'கேது', lordEn: 'Ketu', temple: 'கீழப்பெரும்பள்ளம்', deity: 'ஸ்ரீ நாகநாதசுவாமி', icon: '📿' },
      { pageNum: 27, key: 'p27', lordTa: 'சுக்கிரன்', lordEn: 'Venus', temple: 'கஞ்சனூர்', deity: 'ஸ்ரீ வெள்ளீஸ்வரர்', icon: '💎' },
      { pageNum: 28, key: 'p28', lordTa: 'சூரியன்', lordEn: 'Sun', temple: 'சூரியனார் கோவில்', deity: 'ஸ்ரீ சிவபெருமான்', icon: '☀️' },
      { pageNum: 29, key: 'p29', lordTa: 'சந்திரன்', lordEn: 'Moon', temple: 'திங்களூர்', deity: 'ஸ்ரீ சந்திர பகவான்', icon: '🌙' },
      { pageNum: 30, key: 'p30', lordTa: 'செவ்வாய்', lordEn: 'Mars', temple: 'வைத்தீஸ்வரன் கோவில்', deity: 'ஸ்ரீ முருகப்பெருமான்', icon: '🔥' }
    ];

    dashaPagesConfig.forEach(dc => {
      if (isPageSelected(dc.pageNum)) {
        const dp = d[dc.key] || {};
        const rows = Array.isArray(dp.rows) ? dp.rows : [];
        sheets.push({
          pageNum: dc.pageNum,
          pageKey: `page-${dc.pageNum}`,
          title: isTa ? `${dc.lordTa} திசையில் நடைபெறும் புக்திகள்` : `${dc.lordEn} Maha Dasha Bhuktis`,
          renderTopHalf: () => (
            <div className="space-y-1 text-black">
              <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
                <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                  {isTa ? `${dc.lordTa} திசையில் நடைபெறும் புக்திகளுக்கான விபரங்கள்` : `${dc.lordEn} Maha Dasha Bhukti Schedule`}
                </span>
                <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                  {dc.lordEn.toUpperCase()} DASHA
                </span>
              </div>

              {/* Bhukti Table */}
              <div className="border border-black overflow-hidden text-[6.5px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'புக்தி' : 'Bhukti'}</th>
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'ஸ்தானம்' : 'House'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'நிலை' : 'Status'}</th>
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'காலம்' : 'Period'}</th>
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'ஆரம்பம்' : 'Start'}</th>
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'முடிவு' : 'End'}</th>
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'வயது' : 'Age'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'பலன்கள்' : 'Phalam'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {rows.map((r, rIdx) => (
                      <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                        <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.bhukti}</td>
                        <td className="py-0.2 px-0.5 font-mono">{r.sthana}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.dignity}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap">{r.period}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap">{r.start}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap font-bold">{r.end}</td>
                        <td className="py-0.2 px-0.5 font-mono whitespace-nowrap">{r.age}</td>
                        <td className="py-0.2 px-0.5 font-mono text-[6px]">{r.phalam || '**'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Temple & Pariharam Box */}
              <div className="grid grid-cols-12 gap-1 border border-black p-1 bg-[#FFFDF9] text-[7px] leading-tight">
                <div className="col-span-2 flex flex-col items-center justify-center border-r border-stone-300 pr-1 text-center">
                  <div className="text-xl">{dc.icon}</div>
                  <div className="font-bold text-[#7A1A22] text-[6.5px] mt-0.5">{isTa ? dc.lordTa : dc.lordEn}</div>
                </div>
                <div className="col-span-10 space-y-0.5 pl-1">
                  <div>
                    <span className="font-bold">{isTa ? 'பரிகார ஸ்தலம்' : 'Remedy Temple'}: </span>
                    <span className="font-black text-[#7A1A22]">{dc.temple}</span>
                  </div>
                  <div>
                    <span className="font-bold">{isTa ? 'வழிபட வேண்டிய தெய்வம்' : 'Presiding Deity'}: </span>
                    <span className="font-medium">{dc.deity}</span>
                  </div>
                  <div className="text-stone-600 text-[6.5px]">
                    {isTa
                      ? `${dc.lordTa} திசா காலத்தில் உரிய நவதானியம் தானம் வழங்கி, குறிப்பிட்ட கிழமைகளில் அர்ச்சனை வழிபாடு செய்வது நற்பலன்களைத் தரும்.`
                      : `Performing archana at ${dc.temple} and propitiating ${dc.deity} grants supreme protection and prosperity.`}
                  </div>
                </div>
              </div>
            </div>
          )
        });
      }
    });

    // -----------------------------------------------------------
    // PAGE 31: Functional Roles & Tara Bala (பாசகர், போதகர், காரகர், வேதகர்)
    // -----------------------------------------------------------
    if (isPageSelected(31)) {
      const p31 = d.p31 || {};
      const pasakarRows = Array.isArray(p31.pasakarRows) ? p31.pasakarRows : [];
      const taraRows = Array.isArray(p31.taraRows) ? p31.taraRows : [];
      sheets.push({
        pageNum: 31,
        pageKey: 'page-31',
        title: isTa ? 'கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர்' : 'Functional Roles & Tara Balam',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர் & தாரா பலம்' : '4 Functional Roles & Navatara Strength'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                TARA BALAM
              </span>
            </div>

            {/* Functional Roles */}
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகங்கள்' : 'Planet'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'பாசகர்' : 'Pasakar'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'போதகர்' : 'Bodhakar'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'காரகர்' : 'Karagar'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'வேதகர்' : 'Vedhakar'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {pasakarRows.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.pasakar}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.bodhakar}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.karagar}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.vedhakar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tara Balam Table */}
            <div className="text-[7px] font-bold text-[#7A1A22] pt-0.5">
              {isTa ? 'நவதாரா சக்கரம் (27 நட்சத்திரங்களின் தாரா பலம்)' : 'Navatara Chakra (27 Nakshatras Tara Strengths)'}
            </div>
            <div className="border border-black overflow-hidden text-[6.5px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'தாரா எண் & பெயர்' : 'Tara Name'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'சுழற்சி 1' : 'Cycle 1 (1-9)'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'சுழற்சி 2' : 'Cycle 2 (10-18)'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'சுழற்சி 3' : 'Cycle 3 (19-27)'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'தன்மை' : 'Effect'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {taraRows.map((r, rIdx) => (
                    <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                      <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.taraName}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.cycle1}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.cycle2}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap">{r.cycle3}</td>
                      <td className="py-0.2 px-0.5 whitespace-nowrap font-medium">{r.effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 32: Planetary Dignities & Conjunctions (கிரகங்களின் நிலை)
    // -----------------------------------------------------------
    if (isPageSelected(32)) {
      const p32 = d.p32 || {};
      const dignities = Array.isArray(p32.dignitiesTable) ? p32.dignitiesTable : [];
      const aspects = Array.isArray(p32.aspectsTable) ? p32.aspectsTable : [];
      sheets.push({
        pageNum: 32,
        pageKey: 'page-32',
        title: isTa ? 'ஜாதகத்தில் கிரகங்களின் நிலை' : 'Planetary Dignities & Conjunctions',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'ஜாதகத்தில் கிரகங்களின் நிலை & பார்வை சேர்க்கைகள்' : 'Planetary Dignities, Aspects & Conjunctions'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                DIGNITIES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[6.5px]">
              {/* Dignities Table */}
              <div className="border border-black overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'நிலை விவரம்' : 'Classification'}</th>
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகங்கள்' : 'Planets'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {dignities.map((r, rIdx) => (
                      <tr key={rIdx} className="hover:bg-amber-50/20">
                        <td className="py-0.2 px-0.5 font-bold text-[#7A1A22] whitespace-nowrap">{r.label}</td>
                        <td className="py-0.2 px-0.5 font-medium">{r.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Aspects & Conjunctions Table */}
              <div className="border border-black overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'ராசி' : 'Sign'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'பார்வை' : 'Aspects'}</th>
                      <th className="py-0.2 px-0.5">{isTa ? 'சேர்க்கை' : 'Conj'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {aspects.map((r, rIdx) => (
                      <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                        <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.rasi}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap">{r.aspects}</td>
                        <td className="py-0.2 px-0.5 whitespace-nowrap font-medium">{r.conjunctions}</td>
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

    // -----------------------------------------------------------
    // PAGE 33: Sevvai Dosham Analysis (செவ்வாய் தோஷ ஆய்வு)
    // -----------------------------------------------------------
    if (isPageSelected(33)) {
      const p33 = d.p33 || {};
      const sev = p33.sevvaiDosha || {};
      sheets.push({
        pageNum: 33,
        pageKey: 'page-33',
        title: isTa ? 'செவ்வாய் தோஷ ஆய்வு' : 'Sevvai (Kuja) Dosha Analysis',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'செவ்வாய் தோஷ விரிவான ஆய்வு & விதிவிலக்குகள்' : 'Comprehensive Kuja (Sevvai) Dosha Evaluation'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                KUJA DOSHA
              </span>
            </div>

            <p className="text-[6.5px] text-stone-700 leading-tight">
              {isTa
                ? 'ஜாதகத்தில் செவ்வாய் தோஷம் திருமண காலத்தில் முக்கியத்துவம் பெறுகிறது. லக்னம், சந்திரன், சுக்கிரன் ஆகியவற்றின் நிலையிலிருந்து 1, 2, 4, 7, 8, 12-ம் இடங்களில் செவ்வாய் அமர்வது தோஷமாகக் கருதப்படுகிறது.'
                : 'Kuja Dosha is evaluated from Lagna, Moon, and Venus in houses 1, 2, 4, 7, 8, and 12 with classical exception cancellations.'}
            </p>

            <div className="border border-black overflow-hidden text-[7px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'ஆய்வு நிலை' : 'Reference Point'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'செவ்வாய் நின்ற பாவகம்' : 'Mars House'}</th>
                    <th className="py-0.2 px-0.5">{isTa ? 'தோஷம் உண்டா?' : 'Dosha Present?'}</th>
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'விதிவிலக்குகள் / பலன்' : 'Exceptions / Effect'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr className="text-center hover:bg-amber-50/20">
                    <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22]">{isTa ? '1. லக்னத்திலிருந்து' : 'From Lagna'}</td>
                    <td className="py-0.2 px-0.5 font-mono">{sev.lagnaHouse || 'House 9'}</td>
                    <td className="py-0.2 px-0.5 font-bold text-emerald-700">{sev.lagnaDosha ? (isTa ? 'உண்டு' : 'Yes') : (isTa ? 'இல்லை' : 'No')}</td>
                    <td className="py-0.2 px-0.5 text-left font-medium">{sev.lagnaNotes || '---'}</td>
                  </tr>
                  <tr className="text-center hover:bg-amber-50/20">
                    <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22]">{isTa ? '2. சந்திரனிலிருந்து' : 'From Moon'}</td>
                    <td className="py-0.2 px-0.5 font-mono">{sev.moonHouse || 'House 9'}</td>
                    <td className="py-0.2 px-0.5 font-bold text-emerald-700">{sev.moonDosha ? (isTa ? 'உண்டு' : 'Yes') : (isTa ? 'இல்லை' : 'No')}</td>
                    <td className="py-0.2 px-0.5 text-left font-medium">{sev.moonNotes || '---'}</td>
                  </tr>
                  <tr className="text-center hover:bg-amber-50/20">
                    <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22]">{isTa ? '3. சுக்கிரனிலிருந்து' : 'From Venus'}</td>
                    <td className="py-0.2 px-0.5 font-mono">{sev.venusHouse || 'House 10'}</td>
                    <td className="py-0.2 px-0.5 font-bold text-emerald-700">{sev.venusDosha ? (isTa ? 'உண்டு' : 'Yes') : (isTa ? 'இல்லை' : 'No')}</td>
                    <td className="py-0.2 px-0.5 text-left font-medium">{sev.venusNotes || '---'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Final Verdict Banner */}
            <div className="border border-black p-1 text-center bg-[#FAF6EE]">
              <span className="text-[8.5px] font-black text-emerald-800 uppercase tracking-wide">
                {isTa ? 'முடிவு: இந்த ஜாதகருக்கு செவ்வாய் தோஷம் இல்லை / சுப கிரக பார்வையால் விலக்கு பெற்றுள்ளது.' : 'Conclusion: No Severe Kuja Dosha Detected in this Chart.'}
              </span>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGES 34 TO 42: 81 Antaras per Dasha (9 Full Pages)
    // -----------------------------------------------------------
    const antaraDashaConfig = [
      { pageNum: 34, key: 'p34', lordTa: 'ராகு', lordEn: 'Rahu' },
      { pageNum: 35, key: 'p35', lordTa: 'குரு', lordEn: 'Jupiter' },
      { pageNum: 36, key: 'p36', lordTa: 'சனி', lordEn: 'Saturn' },
      { pageNum: 37, key: 'p37', lordTa: 'புதன்', lordEn: 'Mercury' },
      { pageNum: 38, key: 'p38', lordTa: 'கேது', lordEn: 'Ketu' },
      { pageNum: 39, key: 'p39', lordTa: 'சுக்கிரன்', lordEn: 'Venus' },
      { pageNum: 40, key: 'p40', lordTa: 'சூரியன்', lordEn: 'Sun' },
      { pageNum: 41, key: 'p41', lordTa: 'சந்திரன்', lordEn: 'Moon' },
      { pageNum: 42, key: 'p42', lordTa: 'செவ்வாய்', lordEn: 'Mars' }
    ];

    antaraDashaConfig.forEach(ac => {
      if (isPageSelected(ac.pageNum)) {
        const ap = d[ac.key] || {};
        const dashaObj = ap.dasha || {};
        const bhuktis = Array.isArray(dashaObj.bhuktis) ? dashaObj.bhuktis : [];

        // Flatten 9 bhuktis x 9 antaras = 81 items
        const flatAntaras = [];
        bhuktis.forEach(b => {
          (b.antaras || []).forEach(a => {
            flatAntaras.push({
              bhukti: b.bhuktiLord,
              antara: a.lord,
              endDate: a.endDate
            });
          });
        });

        // Split 81 into 3 columns of 27 rows each
        const col1 = flatAntaras.slice(0, 27);
        const col2 = flatAntaras.slice(27, 54);
        const col3 = flatAntaras.slice(54, 81);

        sheets.push({
          pageNum: ac.pageNum,
          pageKey: `page-${ac.pageNum}`,
          title: isTa ? `${ac.lordTa} திசையில் புக்தி மற்றும் அந்தரம் முடிவு விபரம்` : `${ac.lordEn} Dasha 81 Antara Dates`,
          renderTopHalf: () => (
            <div className="space-y-1 text-black">
              <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
                <span className="text-[9px] font-black text-[#7A1A22] uppercase tracking-wide truncate max-w-[85%]">
                  {isTa
                    ? `${nativeName} ஜாதகத்தில் ${ac.lordTa} திசையில் புக்தி மற்றும் அந்தரம் முடிவு விபரம்`
                    : `${nativeName} - ${ac.lordEn} Maha Dasha 81 Antara End Dates`}
                </span>
                <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                  81 ANTARAS
                </span>
              </div>

              {/* 3 Columns Grid */}
              <div className="grid grid-cols-3 gap-1 text-[6px]">
                {[col1, col2, col3].map((colList, colIdx) => (
                  <div key={colIdx} className="border border-black overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                          <th className="py-0.2 px-0.5 text-left">{isTa ? 'புக்தி' : 'Bhuk'}</th>
                          <th className="py-0.2 px-0.5">{isTa ? 'அந்தரம்' : 'Ant'}</th>
                          <th className="py-0.2 px-0.5 font-mono">{isTa ? 'முடிவு' : 'End'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {colList.map((item, iIdx) => (
                          <tr key={iIdx} className="text-center hover:bg-amber-50/20">
                            <td className="py-0.1 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{item.bhukti}</td>
                            <td className="py-0.1 px-0.5 whitespace-nowrap">{item.antara}</td>
                            <td className="py-0.1 px-0.5 font-mono whitespace-nowrap text-[5.5px]">{item.endDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )
        });
      }
    });

    // -----------------------------------------------------------
    // PAGES 43 TO 49: Individual Graha Ashtakavarga Shodhana (7 Pages)
    // -----------------------------------------------------------
    const bavConfig = [
      { pageNum: 43, key: 'p43', lordTa: 'சூரியன்', lordEn: 'Sun' },
      { pageNum: 44, key: 'p44', lordTa: 'சந்திரன்', lordEn: 'Moon' },
      { pageNum: 45, key: 'p45', lordTa: 'செவ்வாய்', lordEn: 'Mars' },
      { pageNum: 46, key: 'p46', lordTa: 'புதன்', lordEn: 'Mercury' },
      { pageNum: 47, key: 'p47', lordTa: 'குரு', lordEn: 'Jupiter' },
      { pageNum: 48, key: 'p48', lordTa: 'சுக்கிரன்', lordEn: 'Venus' },
      { pageNum: 49, key: 'p49', lordTa: 'சனி', lordEn: 'Saturn' }
    ];

    bavConfig.forEach(bc => {
      if (isPageSelected(bc.pageNum)) {
        const bp = d[bc.key] || {};
        const matrix = Array.isArray(bp.matrix) ? bp.matrix : [];
        const totals = Array.isArray(bp.totals) ? bp.totals : [];
        const rasiHeaders = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விருச்', 'தனு', 'மக', 'கும்', 'மீன'];

        sheets.push({
          pageNum: bc.pageNum,
          pageKey: `page-${bc.pageNum}`,
          title: isTa ? `${bc.lordTa} அஷ்டவர்க்கச் சோதனை` : `${bc.lordEn} Ashtakavarga Shodhana`,
          renderTopHalf: () => (
            <div className="space-y-1 text-black">
              <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
                <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                  {isTa ? `${bc.lordTa} அஷ்டவர்க்கச் சோதனை & பிண்டங்கள்` : `${bc.lordEn} Ashtakavarga Shodhana & Pindas`}
                </span>
                <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                  {bp.totalPoints || 0} BINDUS
                </span>
              </div>

              {/* BAV 8x12 Table */}
              <div className="border border-black overflow-hidden text-[6px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                      {rasiHeaders.map((rh, idx) => (
                        <th key={idx} className="py-0.2 px-0.5">{rh}</th>
                      ))}
                      <th className="py-0.2 px-0.5 font-bold font-mono">{isTa ? 'மொ' : 'Tot'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {matrix.map((r, rIdx) => {
                      const rowTot = (r.points || []).reduce((a, b) => a + Number(b), 0);
                      return (
                        <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                          <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                          {(r.points || []).map((pt, pIdx) => (
                            <td key={pIdx} className="py-0.2 px-0.5 font-mono">{pt}</td>
                          ))}
                          <td className="py-0.2 px-0.5 font-mono font-bold">{rowTot}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-amber-100/60 font-bold text-center border-t border-black">
                      <td className="py-0.2 px-0.5 text-left text-[#7A1A22]">{isTa ? 'மொத்தம்' : 'Total'}</td>
                      {totals.map((t, tIdx) => (
                        <td key={tIdx} className="py-0.2 px-0.5 font-mono text-[#7A1A22]">{t}</td>
                      ))}
                      <td className="py-0.2 px-0.5 font-mono font-black text-[#7A1A22]">{bp.totalPoints || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3 Mini Charts Grid: BAV, Trikona, Ekadhipatya */}
              <div className="grid grid-cols-3 gap-1">
                <div>{renderMiniChart(bp.bavChart || [], isTa ? 'பின்னாஷ்டம்' : 'BAV Chart', `${bp.totalPoints || 0} பரல்கள்`, '70px')}</div>
                <div>{renderMiniChart(bp.trikonaChart || [], isTa ? 'திரிகோணம்' : 'Trikona', `${bp.trikonaTotal || 0} பரல்கள்`, '70px')}</div>
                <div>{renderMiniChart(bp.ekadhipatyaChart || [], isTa ? 'ஏகாதிபத்தியம்' : 'Ekadhipatya', `${bp.ekadhipatyaTotal || 0} பரல்கள்`, '70px')}</div>
              </div>

              {/* Pinda Metrics */}
              <div className="border border-black p-0.5 bg-[#FAF6EE] flex justify-between text-[7px] font-bold px-2">
                <span>{isTa ? 'ராசி பிண்டம்' : 'Rasi Pinda'}: <span className="font-mono text-[#7A1A22]">{bp.rasiPinda || 0}</span></span>
                <span>{isTa ? 'கிரக பிண்டம்' : 'Graha Pinda'}: <span className="font-mono text-[#7A1A22]">{bp.grahaPinda || 0}</span></span>
                <span>{isTa ? 'சோத்ய பிண்டம்' : 'Shodhya Pinda'}: <span className="font-mono text-[#7A1A22] font-black">{bp.shodhyaPinda || 0}</span></span>
              </div>
            </div>
          )
        });
      }
    });

    // -----------------------------------------------------------
    // PAGE 50: Sarvashtakavarga 337 Bindus (சர்வாஷ்டவர்க்கம்)
    // -----------------------------------------------------------
    if (isPageSelected(50)) {
      const p50 = d.p50 || {};
      const matrix = Array.isArray(p50.matrix) ? p50.matrix : [];
      const totals = Array.isArray(p50.totals) ? p50.totals : [];
      const rasiHeaders = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விருச்', 'தனு', 'மக', 'கும்', 'மீன'];

      sheets.push({
        pageNum: 50,
        pageKey: 'page-50',
        title: isTa ? 'சர்வாஷ்டவர்க்க பரல்கள் விபரம்' : 'Sarvashtakavarga 337 Bindus & Metrics',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'சர்வாஷ்டவர்க்க பரல்கள் விபரம் & பலன்கள்' : 'Sarvashtakavarga 337 Bindus Summary Table & Chart'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                337 BINDUS
              </span>
            </div>

            {/* SAV Table */}
            <div className="border border-black overflow-hidden text-[6px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                    <th className="py-0.2 px-0.5 text-left">{isTa ? 'கிரகம்' : 'Planet'}</th>
                    {rasiHeaders.map((rh, idx) => (
                      <th key={idx} className="py-0.2 px-0.5">{rh}</th>
                    ))}
                    <th className="py-0.2 px-0.5 font-bold font-mono">{isTa ? 'மொ' : 'Tot'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {matrix.map((r, rIdx) => {
                    const rowTot = (r.points || []).reduce((a, b) => a + Number(b), 0);
                    return (
                      <tr key={rIdx} className="text-center hover:bg-amber-50/20">
                        <td className="py-0.2 px-0.5 text-left font-bold text-[#7A1A22] whitespace-nowrap">{r.graha}</td>
                        {(r.points || []).map((pt, pIdx) => (
                          <td key={pIdx} className="py-0.2 px-0.5 font-mono">{pt}</td>
                        ))}
                        <td className="py-0.2 px-0.5 font-mono font-bold">{rowTot}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-amber-100/60 font-bold text-center border-t border-black">
                    <td className="py-0.2 px-0.5 text-left text-[#7A1A22]">{isTa ? 'சர்வாஷ்டகம்' : 'Total'}</td>
                    {totals.map((t, tIdx) => (
                      <td key={tIdx} className="py-0.2 px-0.5 font-mono font-black text-[#7A1A22]">{t}</td>
                    ))}
                    <td className="py-0.2 px-0.5 font-mono font-black text-[#7A1A22]">337</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Chart + Strength Breakdown */}
            <div className="grid grid-cols-12 gap-2 text-[6.5px]">
              <div className="col-span-5">
                {renderMiniChart(p50.chartCells || [], isTa ? 'சர்வாஷ்டகம்' : 'SAV 337', '337 பரல்கள்', '75px')}
              </div>
              <div className="col-span-7 border border-black p-1 space-y-0.5 bg-white">
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span>{isTa ? 'கேந்திர பலம் (1, 4, 7, 10)' : 'Kendram (1, 4, 7, 10)'}:</span>
                  <span className="font-mono font-bold text-[#7A1A22]">{p50.kendram || 114}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span>{isTa ? 'பணபர பலம் (2, 5, 8, 11)' : 'Panaparam (2, 5, 8, 11)'}:</span>
                  <span className="font-mono font-bold">{p50.panaparam || 115}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span>{isTa ? 'அபோக்லிம பலம் (3, 6, 9, 12)' : 'Apoklimam (3, 6, 9, 12)'}:</span>
                  <span className="font-mono font-bold">{p50.apoklimam || 108}</span>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 py-0.2">
                  <span>{isTa ? 'வரவினம் / செலவினம்' : 'Income / Expenditure'}:</span>
                  <span className="font-mono font-bold text-emerald-800">{p50.varavinam || 78}</span> / <span className="font-mono font-bold text-rose-800">{p50.selavinam || 94}</span>
                </div>
                <div className="grid grid-cols-2 py-0.2">
                  <span>{isTa ? 'திசை பலங்கள் (கிழக்கு/தெற்கு/மேற்கு/வடக்கு)' : 'Directions (E / S / W / N)'}:</span>
                  <span className="font-mono">{p50.east || 77} / {p50.south || 89} / {p50.west || 93} / {p50.north || 78}</span>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }

    // -----------------------------------------------------------
    // PAGE 51: Astro-Numerology & Chaldean Matrix (எண் கணிதம்)
    // -----------------------------------------------------------
    if (isPageSelected(51)) {
      const p51 = d.p51 || {};
      const chaldeanLetters = [
        { num: 1, letters: 'A, I, J, Q, Y' },
        { num: 2, letters: 'B, K, R' },
        { num: 3, letters: 'C, G, L, S' },
        { num: 4, letters: 'D, M, T' },
        { num: 5, letters: 'E, H, N, X' },
        { num: 6, letters: 'U, V, W' },
        { num: 7, letters: 'O, Z' },
        { num: 8, letters: 'F, P' }
      ];

      sheets.push({
        pageNum: 51,
        pageKey: 'page-51',
        title: isTa ? 'எண் கணிதம் (நியூமராலஜி)' : 'Astro-Numerology Analysis',
        renderTopHalf: () => (
          <div className="space-y-1 text-black">
            <div className="bg-[#FAF6EE] border border-black px-2 py-0.5 flex justify-between items-center">
              <span className="text-[9.5px] font-black text-[#7A1A22] uppercase tracking-wide">
                {isTa ? 'எண் கணிதம் (நியூமராலஜி) & சால்டியன் முறை' : 'Astro-Numerology Analysis (Chaldean System)'}
              </span>
              <span className="text-[7.5px] font-bold font-mono px-1 bg-amber-100 border border-stone-400">
                NUMEROLOGY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[7px] leading-tight">
              {/* Profile Table */}
              <div className="border border-black p-1 space-y-0.5 bg-white">
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'பெயர் & ஆங்கில எழுத்துக் கூடுதல்' : 'Name & Letter Sum'}:</span>
                  <span className="font-black text-[#7A1A22]">{p51.name || nativeName} = {p51.engSum || 24}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'உடலெண் (Body No)' : 'Birth Number'}:</span>
                  <span className="font-mono font-bold text-[#7A1A22]">{p51.dateNum || 6}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'உயிரெண் (Soul No)' : 'Destiny Number'}:</span>
                  <span className="font-mono font-bold text-[#7A1A22]">{p51.yearNum || 8}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'அதிர்ஷ்ட எண்கள்' : 'Lucky Numbers'}:</span>
                  <span className="font-mono font-bold">{p51.luckyNums || '3, 2, 6'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'அதிர்ஷ்ட தேதிகள்' : 'Lucky Dates'}:</span>
                  <span className="font-medium">{p51.luckyDates || '3, 12, 21, 30, 6, 15, 24'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.2">
                  <span className="font-bold">{isTa ? 'அதிர்ஷ்ட நிறங்கள்' : 'Lucky Colors'}:</span>
                  <span className="font-medium">{p51.luckyColors || 'வெள்ளை, நீலம், சந்தன நிறம்'}</span>
                </div>
                <div className="flex justify-between py-0.2">
                  <span className="font-bold">{isTa ? 'வணங்க வேண்டிய தெய்வம்' : 'Presiding Deity'}:</span>
                  <span className="font-medium">{p51.deity || 'ஸ்ரீ மகாவிஷ்ணு / தட்சிணாமூர்த்தி'}</span>
                </div>
              </div>

              {/* Chaldean 26-Letter Matrix */}
              <div className="border border-black overflow-hidden text-[6.5px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EE] border-b border-black font-bold text-center">
                      <th className="py-0.2 px-0.5 font-mono">{isTa ? 'எண்' : 'No'}</th>
                      <th className="py-0.2 px-0.5 text-left">{isTa ? 'சால்டியன் ஆங்கில எழுத்துக்கள்' : 'Chaldean Letters'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {chaldeanLetters.map((cl, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/20">
                        <td className="py-0.2 px-0.5 font-mono font-black text-center text-[#7A1A22]">{cl.num}</td>
                        <td className="py-0.2 px-0.5 font-medium">{cl.letters}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subham Footer */}
            <div className="text-center pt-2">
              <span className="text-[14px] font-black text-[#7A1A22] tracking-widest border-b-2 border-black pb-0.5">
                {isTa ? 'சுபம்.' : 'SUBHAM.'}
              </span>
            </div>
          </div>
        )
      });
    }

    // Re-index displayed sheet numbers sequentially
    return sheets.map((sh, idx) => ({
      ...sh,
      sheetNo: idx + 1
    }));
  }, [bookletData, selectedIds, isTa, birthData, astrologerTitle, astrologerContact]);

  return (
    <div className="space-y-4">
      {/* 1. TOP INTERACTIVE SECTION SELECTOR (Screen Only) */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-4 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A1A22] to-[#99222C] text-amber-100 flex items-center justify-center text-xl shadow-sm">
              📚
            </div>
            <div>
              <h2 className="text-base font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight flex items-center gap-2">
                <span>{isTa ? 'விரிவான 51 பக்க ஜாதக புத்தகம்' : '51-Page Horoscope Print Booklet'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold border border-amber-300">
                  {isTa ? 'அரைப்பக்க A4 முறை' : 'Half-Page A4 Grid'}
                </span>
              </h2>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                {isTa
                  ? 'திரைப்பக்கத்தின் அனைத்து விவரங்களும் A4 தாளின் மேல் அரைப்பகுதியில் அமையும் (கீழ் அரைப்பகுதி வெற்றாக விடப்படும்)'
                  : 'All full details from the horoscope screen view formatted into the top half of A4 sheets (lower half blank).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#7A1A22] dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold shadow-2xs">
              {isTa
                ? `${selectedIds.length} தலைப்புகள் • ${generatedSheets.length} A4 பக்கங்கள்`
                : `${selectedIds.length} Sections Selected • ${generatedSheets.length} A4 Pages`}
            </div>

            {/* 51-Page AI Prompt Button */}
            <button
              type="button"
              onClick={() => setAiPromptModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-amber-400"
              title={isTa ? '51-பக்க ஜாதகத்திற்கான AI ஆய்வு Prompt-ஐ காண்க' : 'Open 51-Page AI Analysis Prompt'}
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950 fill-amber-300" />
              <span>{isTa ? '51-பக்க AI Prompt' : '51-Page AI Prompt'}</span>
            </button>

            {/* Edit Letterhead Branding Button */}
            <button
              type="button"
              onClick={() => setBrandingModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/70 text-[#7A1A22] dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={isTa ? 'லெட்டர்ஹெட் அமைப்புகளைத் திருத்துக' : 'Edit Letterhead Branding Details'}
            >
              <FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{isTa ? 'லெட்டர்ஹெட் திருத்து' : 'Edit Letterhead'}</span>
            </button>

            {onSwitchToOnePage && (
              <button
                type="button"
                onClick={onSwitchToOnePage}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isTa ? '1-பக்க ஜாதகம்' : '1-Page Patrika'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              disabled={generatedSheets.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] hover:from-[#5C1017] hover:to-[#7A1A22] disabled:opacity-50 text-amber-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{isTa ? 'அச்சு / PDF பதிவிறக்குக' : 'Print / Save as PDF'}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-stone-500 dark:text-stone-400 text-[11px]">
            {isTa ? 'விரைவுத் தேர்வு:' : 'Quick Presets:'}
          </span>
          <button
            type="button"
            onClick={selectAll}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold cursor-pointer border border-amber-300 dark:border-amber-700"
          >
            {isTa ? 'முழு புத்தகம் (51 பக்கங்கள் / 20 தலைப்புகள்)' : 'Complete Dossier (51 Pages)'}
          </button>
          <button
            type="button"
            onClick={selectStandard}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer border border-stone-300 dark:border-stone-700"
          >
            {isTa ? 'நிலையான புத்தகம் (25 பக்கங்கள்)' : 'Standard Booklet (25 Pages)'}
          </button>
          <button
            type="button"
            onClick={selectCore}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer border border-stone-300 dark:border-stone-700"
          >
            {isTa ? 'விரைவு ஜாதகம் (7 பக்கங்கள்)' : 'Quick Patrika (7 Pages)'}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold cursor-pointer border border-rose-300 dark:border-rose-800"
          >
            {isTa ? 'அனைத்தும் நீக்குக' : 'Clear All'}
          </button>
        </div>

        {/* 20 Sections Checkbox Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {HOROSCOPE_20_SECTIONS.map(sec => {
            const isChecked = selectedIds.includes(sec.id);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => toggleSection(sec.id)}
                className={`p-2 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-[#7A1A22] dark:text-amber-200 font-bold shadow-2xs'
                    : 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#7A1A22] dark:text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                </div>
                <div className="text-[11px] leading-tight">
                  <span className="block">{isTa ? sec.titleTa : sec.titleEn}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MULTI-PAGE PRINT CANVAS */}
      <div className="w-full overflow-x-auto touch-pan-x pb-8">
        <div id="astrojit-horoscope-multipage" className="space-y-6 print:space-y-0">
          {generatedSheets.length === 0 ? (
            <div className="bg-white p-8 text-center text-stone-500 border border-stone-300 max-w-[202mm] mx-auto">
              {isTa ? 'எந்தவொரு பிரிவும் தேர்ந்தெடுக்கப்படவில்லை.' : 'No sections selected. Please select titles above.'}
            </div>
          ) : (
            generatedSheets.map((sheet) => {
              const nativeName = birthData?.name || bookletData?.p1?.name || 'Muthu Kumar';
              const dobDisplay = birthData?.dob || bookletData?.p1?.date || '15-06-1994';

              return (
                <div
                  key={sheet.pageKey}
                  className="bg-white text-black mx-auto shadow-2xl p-4 sm:p-5 print:p-0 print:shadow-none print:break-after-page a4-booklet-sheet"
                  style={{
                    width: '100%',
                    maxWidth: '202mm',
                    height: '282mm',
                    minHeight: '282mm',
                    maxHeight: '282mm',
                    boxSizing: 'border-box',
                    pageBreakAfter: 'always',
                    breakAfter: 'page',
                    fontFamily: isTa
                      ? "'Noto Serif Tamil', 'Source Serif 4', Georgia, serif"
                      : "'Source Serif 4', Georgia, serif"
                  }}
                >
                  {/* Traditional Outer Double Border Frame */}
                  <div
                    className="border-[2.5px] border-double border-black p-3 h-full flex flex-col justify-between"
                    style={{
                      height: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Top Half Content Container (strictly 133mm height) */}
                    <div
                      className="flex-1 flex flex-col justify-between overflow-hidden"
                      style={{
                        height: '133mm',
                        maxHeight: '133mm',
                        minHeight: '133mm',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Sheet Header */}
                      <div className="flex items-center justify-between border-b border-black pb-0.5 mb-1 text-[8px] font-bold">
                        <span className="truncate max-w-[45%] text-[#7A1A22]">
                          {nativeName} • {dobDisplay}
                        </span>
                        <span className="font-extrabold uppercase tracking-wider text-[#7A1A22]">
                          {astrologerTitle}
                        </span>
                        <span className="font-mono text-black">
                          - {sheet.sheetNo} -
                        </span>
                      </div>

                      {/* Rendered Top Half Content */}
                      <div className="flex-1 overflow-hidden">
                        {sheet.renderTopHalf()}
                      </div>

                      {/* Bottom Rule of Top Half */}
                      <div className="border-t border-black/40 mt-0.5 pt-0.5 flex justify-between text-[6.5px] text-stone-500 font-mono">
                        <span>{printedDateTime}</span>
                        <span>Astrojit Thirukanitha Panchangam System</span>
                      </div>
                    </div>

                    {/* Center Fold Guide Divider */}
                    <div className="border-t border-dashed border-stone-400 my-1 text-[6.5px] text-center text-stone-400 font-mono tracking-widest uppercase">
                      --- CENTER FOLD LINE / மடிப்புக்கோடு ---
                    </div>

                    {/* Bottom Half: Completely Blank for Traditional Booklet Horizontal Folding */}
                    <div
                      className="flex-1"
                      style={{
                        height: '133mm',
                        maxHeight: '133mm',
                        minHeight: '133mm'
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
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

      {/* 51-Page AI Analysis Prompt Modal */}
      <AIPrompt51PageModal
        isOpen={aiPromptModalOpen}
        onClose={() => setAiPromptModalOpen(false)}
        birthData={birthData}
      />
    </div>
  );
}
